// Beregningen nivå for nivå (Story 2.2, arkitektur AD-6–AD-8).
//
// Går gjennom delene i beregningsrekkefølgen fra `Struktur` (stigende lavnivåkode, så
// stykklisterekkefølge), lager bruttobehovet for hver del og kaller nettingen (netting.ts) med
// standardinnstillingene. Resultatet har én DelResultat per del og bestillingsforslagene.
//
// Reglene (PRD FR-5, FR-8, FR-17, FR-28):
// - Bruttobehovet for ferdigproduktet er prognostiserte behov. For de andre delene er det summen av
//   planlagt ordrefrigivelse(t) × antall for hver overordnet del (FR-5).
// - `Struktur` har alt slått sammen like varenumre og underdeler (AD-6). En felles del har derfor én
//   post per overordnet del og beregnes én gang med samlet bruttobehov og lagerbeholdningen én gang (FR-28).
// - Frigivelsen i uke 1 har den forfalte mengden i seg (netting.ts), så en forfalt frigivelse gir
//   bruttobehov i uke 1 for delene under (FR-8).
// - Bestillingsforslag: én per del og uke med frigivelse > 0, sortert etter frigivelsesuke og så
//   stykklisterekkefølge (FR-17, arkitektur kap. 4).
//
// Eksepsjonene og de kritiske delene finnes i Story 2.3. Til da er `eksepsjoner` og `kritiskeDeler`
// tomme, og `kritisk` er false (beslutning 1A i spec-2-2).
//
// Ingen nettingregler står her (AD-7). Funksjonen er ren: den endrer ikke inndataene og gir samme
// svar for samme inndata (AD-2, FR-8).

import { beregnNetting, type Nettingsvar } from './netting.ts'
import type { Bestillingsforslag, DelResultat, Inndata, Resultat, Struktur, StrukturDel, Utregning } from './typer.ts'

/**
 * Beregner bestillingsplanen for hele stykklisten (FR-5–FR-8, FR-17, FR-28).
 *
 * Forutsetter kontrollerte data (valideringen har godkjent filen) og `struktur` fra `byggStruktur`
 * for de samme stykklisteradene. Mangler en del eller en overordnet del i strukturen, er det en
 * programfeil, og funksjonen kaster en `Error` (worker-en gjør den om til UVENTET_FEIL, AD-5).
 */
export function beregnBestillingsplan(inndata: Inndata, struktur: Struktur): Resultat {
  const horisont = inndata.horisont
  const delPerVarenummer = new Map<string, StrukturDel>()
  for (const del of struktur.deler) delPerVarenummer.set(del.varenummer, del)

  const svar = new Map<string, Nettingsvar>()
  const bruttobehovPerDel = new Map<string, number[]>()

  for (const varenummer of struktur.beregningsrekkefolge) {
    const del = delPerVarenummer.get(varenummer)
    if (del === undefined) throw new Error(`Beregningsrekkefølgen har ${varenummer}, som ikke finnes i strukturen`)

    const bruttobehov = lagBruttobehov(del, inndata.prognostiserteBehov, horisont, svar)
    const nettingsvar = beregnNetting({
      lagerbeholdning: del.lagerbeholdning,
      sikkerhetslager: del.sikkerhetslager,
      ledetid: del.ledetid,
      bruttobehov,
      planlagteMottak: inndata.planlagteMottak.filter((m) => m.varenummer === varenummer),
    })
    svar.set(varenummer, nettingsvar)
    bruttobehovPerDel.set(varenummer, bruttobehov)
  }

  // Delene vises i stykklisterekkefølge, og en felles del står der den står første gang (FR-14, FR-16).
  const deler: DelResultat[] = struktur.deler.map((del) => {
    const nettingsvar = svar.get(del.varenummer)
    if (nettingsvar === undefined) throw new Error(`${del.varenummer} mangler i beregningsrekkefølgen`)
    return lagDelResultat(del, bruttobehovPerDel.get(del.varenummer)!, nettingsvar, inndata.prognostiserteBehov, svar)
  })

  return {
    deler,
    bestillingsforslag: lagBestillingsforslag(deler),
    // Story 2.3 fyller inn eksepsjonene og de kritiske delene.
    eksepsjoner: [],
    kritiskeDeler: [],
  }
}

/** Bruttobehovet per uke for én del (FR-5). Alle overordnede deler er alt beregnet (AD-6). */
function lagBruttobehov(
  del: StrukturDel,
  prognostiserteBehov: readonly number[],
  horisont: number,
  svar: ReadonlyMap<string, Nettingsvar>,
): number[] {
  if (del.overordnede.length === 0) return prognostiserteBehov.slice(0, horisont)

  const bruttobehov = new Array<number>(horisont).fill(0)
  for (const { varenummer, antall } of del.overordnede) {
    const frigivelser = frigivelserFor(varenummer, del.varenummer, svar)
    for (let i = 0; i < horisont; i++) bruttobehov[i] += frigivelser[i] * antall
  }
  return bruttobehov
}

function frigivelserFor(overordnet: string, del: string, svar: ReadonlyMap<string, Nettingsvar>): number[] {
  const nettingsvar = svar.get(overordnet)
  if (nettingsvar === undefined) {
    throw new Error(`${del} skal beregnes før den overordnede delen ${overordnet} (AD-6)`)
  }
  return nettingsvar.planlagteOrdrefrigivelser
}

/** De seks radene og én Utregning per uke for én del (FR-14, AD-8). */
function lagDelResultat(
  del: StrukturDel,
  bruttobehov: number[],
  nettingsvar: Nettingsvar,
  prognostiserteBehov: readonly number[],
  svar: ReadonlyMap<string, Nettingsvar>,
): DelResultat {
  const erFerdigprodukt = del.overordnede.length === 0
  const utregning: Utregning[] = nettingsvar.uker.map((uke, i) => {
    const { planlagtOrdremottak: _ordremottak, forventetLagerbeholdning: _forventet, ...felles } = uke
    return {
      ...felles,
      prognostiserteBehov: erFerdigprodukt ? prognostiserteBehov[i] : null,
      // Én post per overordnet del, også når frigivelsen er 0, i rekkefølgen i strukturen (FR-18).
      bruttobehovFra: del.overordnede.map(({ varenummer, antall }) => ({
        varenummer,
        frigivelse: frigivelserFor(varenummer, del.varenummer, svar)[i],
        antall,
      })),
    }
  })

  return {
    del,
    bruttobehov,
    planlagteMottak: nettingsvar.planlagteMottak,
    forventetLagerbeholdning: nettingsvar.forventetLagerbeholdning,
    nettobehov: nettingsvar.nettobehov,
    planlagteOrdremottak: nettingsvar.planlagteOrdremottak,
    planlagteOrdrefrigivelser: nettingsvar.planlagteOrdrefrigivelser,
    forfaltMengde: nettingsvar.forfaltMengde,
    utregning,
    kritisk: false,
  }
}

/** Én per del og uke med frigivelse > 0, sortert etter frigivelsesuke og så stykklisterekkefølge (FR-17). */
function lagBestillingsforslag(deler: readonly DelResultat[]): Bestillingsforslag[] {
  // `deler` står i stykklisterekkefølge. Plassen der brukes som andre sorteringsnøkkel, så rekkefølgen
  // ved lik uke ikke avhenger av at listen er bygd i en bestemt rekkefølge.
  const forslag: { forslag: Bestillingsforslag; stykklisteplass: number }[] = []
  deler.forEach(({ del, planlagteOrdrefrigivelser, forfaltMengde }, stykklisteplass) => {
    planlagteOrdrefrigivelser.forEach((mengde, i) => {
      if (mengde <= 0) return
      forslag.push({
        stykklisteplass,
        forslag: {
          varenummer: del.varenummer,
          beskrivelse: del.beskrivelse,
          frigivelsesuke: i + 1,
          mengde,
          // Den forfalte mengden ligger i frigivelsen i uke 1 (FR-8).
          forfaltMengde: i === 0 ? forfaltMengde : 0,
          art: del.type === 'KJOPES_INN' ? 'INNKJOP' : 'PRODUKSJONSORDRE',
        },
      })
    })
  })
  return forslag
    .sort((a, b) => a.forslag.frigivelsesuke - b.forslag.frigivelsesuke || a.stykklisteplass - b.stykklisteplass)
    .map((f) => f.forslag)
}
