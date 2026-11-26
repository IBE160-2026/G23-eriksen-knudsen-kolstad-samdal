// Eksepsjonene og de kritiske delene (Story 2.3, arkitektur AD-7 og AD-9, PRD FR-9–FR-13 og FR-29).
//
// Finner de fem eksepsjonene ut fra svaret fra nettingen for hver del (`netting.ts`), og ingen andre:
//   Ledetid overskrider horisont (FR-9), Bestilling forsinket (FR-10), Bruk av sikkerhetslager (FR-11),
//   Mottak forsinket (FR-12) og Kanseller mottak (FR-29).
// Kjernen gir koder og tall, aldri ferdig tekst (AD-9). Teksten lages i `tekster/`.
//
// Funksjonen regner ikke MRP selv. Den leser resultatet fra beregningen nivå for nivå (`DelResultat`, Story 2.2) og
// de planlagte mottakene fra inndataene, og bare Kanseller mottak kjører nettingen en gang til per mottak (AD-7).
// Den er ren: den endrer ikke inndataene og gir samme svar for samme inndata (FR-8).
//
// Rekkefølgen er stykklisterekkefølge, så uke (hele delen først) og så typen i rekkefølgen i PRD §4.3, som er
// rekkefølgen i `EKSEPSJONSKODER` (arkitektur kap. 4). Er alt likt, kommer mottak i rekkefølgen de ble fremskyndet i.

import { beregnNetting, type NettingInndata } from './netting.ts'
import { EKSEPSJONSKODER, type DelNavn, type DelResultat, type Eksepsjon, type PlanlagtMottak, type StrukturDel } from './typer.ts'

export type Eksepsjonsfunn = {
  /** Sortert på stykklisterekkefølge, uke (hele delen først) og type. */
  eksepsjoner: Eksepsjon[]
  /** Varenumrene til delene med minst én eksepsjon, i stykklisterekkefølge (FR-13). */
  kritiskeDeler: string[]
}

/**
 * Finner eksepsjonene for alle delene.
 *
 * @param deler alle delene fra beregningen i stykklisterekkefølge (en felles del står én gang): `Resultat.deler`
 * @param planlagteMottak mottakene som enkeltlinjer fra inndataene, til Kanseller mottak
 * @param horisont antall uker H
 */
export function finnEksepsjoner(
  deler: readonly DelResultat[],
  planlagteMottak: readonly PlanlagtMottak[],
  horisont: number,
): Eksepsjonsfunn {
  const navn = new Map<string, StrukturDel>(deler.map((d) => [d.del.varenummer, d.del]))
  const eksepsjoner: Eksepsjon[] = []
  const kritiskeDeler: string[] = []
  for (const del of deler) {
    const funn = eksepsjonerForDel(del, planlagteMottak, horisont, navn)
    if (funn.length > 0) kritiskeDeler.push(del.del.varenummer)
    eksepsjoner.push(...funn)
  }
  return { eksepsjoner, kritiskeDeler }
}

const KODEPLASS = new Map<string, number>(EKSEPSJONSKODER.map((kode, i) => [kode, i]))

function eksepsjonerForDel(
  resultat: DelResultat,
  alleMottak: readonly PlanlagtMottak[],
  horisont: number,
  deler: ReadonlyMap<string, StrukturDel>,
): Eksepsjon[] {
  const { del } = resultat
  // Det nettingen fikk inn for delen, bygget av resultatet. Brukes bare av Kanseller mottak.
  const inndata: NettingInndata = {
    lagerbeholdning: del.lagerbeholdning,
    sikkerhetslager: del.sikkerhetslager,
    ledetid: del.ledetid,
    bruttobehov: resultat.bruttobehov,
    planlagteMottak: alleMottak.filter((m) => m.varenummer === del.varenummer),
  }
  const felles = { varenummer: del.varenummer, beskrivelse: del.beskrivelse, delstype: del.type }
  const funn: Eksepsjon[] = []

  // FR-9: ledetiden fra ferdigproduktet (lengste sti) er minst like lang som horisonten, uansett behov.
  if (del.ledetidFraFerdigproduktet >= horisont) {
    funn.push({
      ...felles,
      kode: 'LEDETID_OVERSKRIDER_HORISONT',
      uke: null,
      ledetidFraFerdigproduktet: del.ledetidFraFerdigproduktet,
      sti: del.stiForLedetid.map((varenummer) => {
        const d = deler.get(varenummer)
        return { varenummer, beskrivelse: d?.beskrivelse ?? '', ledetid: d?.ledetid ?? 0 }
      }),
      horisont,
    })
  }

  const fremskyndede = new Set<number>()
  for (const uke of resultat.utregning) {
    for (const mottak of uke.fremskyndedeMottak) fremskyndede.add(mottak.excelRad)

    // FR-10 og FR-11: nettobehov med forfalt frigivelse. Disponibel beholdning er verdien etter fremskynding.
    // En uke kan ikke få begge, fordi de gjelder disponibel < 0 og 0 ≤ disponibel < SS.
    if (uke.nettobehov > 0 && uke.forfaltMengde > 0) {
      const forfalt = {
        disponibel: uke.disponibelEtterFremskynding,
        forfaltMengde: uke.forfaltMengde,
        skulleFrigis: uke.uke - del.ledetid,
        frigivelseUke1: resultat.planlagteOrdrefrigivelser[0] ?? 0,
        tidligsteMottaksuke: 1 + del.ledetid,
      }
      if (uke.disponibelEtterFremskynding < 0) {
        funn.push({ ...felles, ...forfalt, kode: 'BESTILLING_FORSINKET', uke: uke.uke, forsinker: forsinker(del, deler) })
      } else {
        // Nettobehov > 0 betyr disponibel < SS, så 0 ≤ disponibel < SS gjelder her.
        funn.push({
          ...felles,
          ...forfalt,
          kode: 'BRUK_AV_SIKKERHETSLAGER',
          uke: uke.uke,
          sikkerhetslager: del.sikkerhetslager,
        })
      }
    }

    // FR-12: et planlagt mottak fremskyndes til uken. Én eksepsjon per mottak, med disponibel beholdning før fremskyndingen.
    for (const mottak of uke.fremskyndedeMottak) {
      funn.push({
        ...felles,
        kode: 'MOTTAK_FORSINKET',
        uke: uke.uke,
        mottaksuke: mottak.mottaksuke,
        antall: mottak.antall,
        excelRad: mottak.excelRad,
        disponibelForFremskynding: uke.disponibelForFremskynding,
        sikkerhetslager: del.sikkerhetslager,
      })
    }
  }

  // FR-29: et mottak som ikke trengs i horisonten. Nettingen kjøres én gang til uten mottaket og uten annen
  // fremskynding. Et fremskyndet mottak får den aldri.
  for (const mottak of inndata.planlagteMottak) {
    if (!Number.isInteger(mottak.uke) || mottak.uke < 1 || mottak.uke > horisont) continue
    if (fremskyndede.has(mottak.excelRad)) continue
    const uten = beregnNetting(
      { ...inndata, planlagteMottak: inndata.planlagteMottak.filter((m) => m !== mottak) },
      { fremskynding: false },
    )
    if (uten.nettobehov.slice(mottak.uke - 1).every((behov) => behov === 0)) {
      funn.push({
        ...felles,
        kode: 'KANSELLER_MOTTAK',
        uke: mottak.uke,
        antall: mottak.antall,
        excelRad: mottak.excelRad,
        horisont,
      })
    }
  }

  return funn.sort(sammenlign)
}

/**
 * Hva som blir forsinket når bestillingen er forsinket (FR-10): leveransen til kunde for ferdigproduktet, delene på
 * nivå .1 og en felles del som også står rett under ferdigproduktet. Ellers produksjonen av alle de overordnede delene.
 */
function forsinker(del: StrukturDel, deler: ReadonlyMap<string, StrukturDel>): { type: 'LEVERANSE_TIL_KUNDE' } | { type: 'PRODUKSJON'; av: DelNavn[] } {
  const ferdigprodukt = [...deler.values()].find((d) => d.nivaa === '0')?.varenummer
  const direkteUnderFerdigprodukt = del.overordnede.some((o) => o.varenummer === ferdigprodukt)
  // En del på nivå .1 har alltid ferdigproduktet som overordnet del, så den er dekket av direkteUnderFerdigprodukt.
  if (del.nivaa === '0' || direkteUnderFerdigprodukt) return { type: 'LEVERANSE_TIL_KUNDE' }
  return {
    type: 'PRODUKSJON',
    av: del.overordnede.map((o) => ({ varenummer: o.varenummer, beskrivelse: deler.get(o.varenummer)?.beskrivelse ?? '' })),
  }
}

/** Uke (hele delen først), så type i rekkefølgen i PRD §4.3. Sorteringen er stabil, så mottak står i fremskyndingsrekkefølge. */
function sammenlign(a: Eksepsjon, b: Eksepsjon): number {
  const ukeA = a.uke ?? 0
  const ukeB = b.uke ?? 0
  if (ukeA !== ukeB) return ukeA - ukeB
  return (KODEPLASS.get(a.kode) ?? 0) - (KODEPLASS.get(b.kode) ?? 0)
}
