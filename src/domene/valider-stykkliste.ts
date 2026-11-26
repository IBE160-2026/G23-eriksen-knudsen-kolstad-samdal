// Kontroll av verdiene i arket Stykkliste (Story 1.8, FR-3, FR-4, AD-4, AD-5, AD-6, AD-9).
//
// Reglene er tabellen i FR-3, og hver regel har sin kode i VALIDERINGSKODER. Funksjonen gir koder,
// ark, sted og felt, aldri ferdig tekst (AD-9). Teksten lages i tekster/nb.ts.
//
// - Kaster aldri unntak for feil i brukerens data, og samler alle feil før den svarer (AD-5, FR-4).
// - Én feil i filen gir én valideringsfeil. Regler som ville gitt følgefeil, hoppes over: en regel som
//   trenger en kolonne som `hoppesOver` sier mangler, kontrolleres ikke (FR-2). Reglene som ikke trenger
//   den ukjente kolonnen, kontrolleres likevel: et antall som ikke er et heltall på 1 eller mer, og lager,
//   sikkerhetslager og ledetid som ikke er heltall, er feil uansett nivå og varenummer.
// - Sløyfekontrollen og reglene om underdeler kjøres bare når nivå og varenummer er gyldige i alle radene
//   (hierarkiet er da til å stole på). Antall og type sperrer bare delene de gjelder: en del med et ugyldig
//   antall under seg får ikke «ulike underdeler», og en type med feil får ikke «kjøpes inn har underdeler».
// - Reglene om underdeler og om delen som kjøpes inn, bruker `Struktur` fra `struktur.ts` (AD-6).
// - Feilene står i rekkefølgen de har i arket (Excel-rad), og ved lik rad i rekkefølgen kolonnene har.
//   Feil på hele raden (Rader) står først i raden, og feil på underdelene (Underdeler) sist.

import { NIVAATALL, beskrivelseTekst, cellested, erTom, tolkNivaa, tolkType, varenummerTekst } from './celler.ts'
import { tolkHeltall } from './heltall.ts'
import { byggStruktur } from './struktur.ts'
import {
  STYKKLISTE_KOLONNER,
  type Celleverdi,
  type Delstype,
  type Nivaa,
  type RaaArk,
  type RaaRad,
  type StykklisteKolonne,
  type Stykklisterad,
  type Valideringsfeil,
  type Valideringskode,
} from './typer.ts'

type Stykkliste = NonNullable<RaaArk['stykkliste']>
type Rad = RaaRad<StykklisteKolonne>

/** Stykklisten har inntil 1000 rader, fra rad 2 (FR-3). */
export const MAKS_RADER = 1000

/** En rad med cellene tolket, så reglene kan sammenligne rader med hverandre. */
type Tolket = {
  rad: Rad
  nivaa: Nivaa | undefined
  varenummer: string | null
  beskrivelse: string | null
  type: Delstype | undefined
}

/** Kodene for de tre feltene som er «fylt ut første gang, tom de neste gangene» (FR-3). */
const FORSTE_GANG: {
  felt: 'Lagerbeholdning' | 'Sikkerhetslager' | 'Ledetid (uker)'
  mangler: Valideringskode
  ugyldig: Valideringskode
  senere: Valideringskode
}[] = [
  {
    felt: 'Lagerbeholdning',
    mangler: 'LAGERBEHOLDNING_MANGLER',
    ugyldig: 'LAGERBEHOLDNING_UGYLDIG',
    senere: 'LAGERBEHOLDNING_FYLT_UT_SENERE',
  },
  {
    felt: 'Sikkerhetslager',
    mangler: 'SIKKERHETSLAGER_MANGLER',
    ugyldig: 'SIKKERHETSLAGER_UGYLDIG',
    senere: 'SIKKERHETSLAGER_FYLT_UT_SENERE',
  },
  {
    felt: 'Ledetid (uker)',
    mangler: 'LEDETID_MANGLER',
    ugyldig: 'LEDETID_UGYLDIG',
    senere: 'LEDETID_FYLT_UT_SENERE',
  },
]

/** Kodene som gjør at hierarkiet (nivåene og varenumrene) ikke kan stoles på som struktur. */
function ødelegger(kode: Valideringskode): boolean {
  return /^(NIVAA|VARENUMMER)_/.test(kode)
}

/**
 * Kontrollerer verdiene i arket Stykkliste (FR-3).
 *
 * @param hoppesOver om kontrollen av en kolonne skal hoppes over fordi arket eller overskriften mangler (FR-2)
 */
export function validerStykklisteVerdier(
  ark: Stykkliste,
  hoppesOver: (felt: StykklisteKolonne) => boolean,
): Valideringsfeil[] {
  const feil: Valideringsfeil[] = []
  const bruk = (felt: StykklisteKolonne): boolean => !hoppesOver(felt)
  const celle = (rad: Rad, felt: StykklisteKolonne): Celleverdi => rad.celler[felt] ?? null
  const sted = (felt: StykklisteKolonne, excelRad: number) => cellested(ark.overskrifter[felt], excelRad)
  const meld = (kode: Valideringskode, felt: StykklisteKolonne, rad: Rad, ekstra: Partial<Valideringsfeil> = {}) =>
    feil.push({ kode, ark: 'Stykkliste', sted: sted(felt, rad.excelRad), felt, verdi: celle(rad, felt), ...ekstra })

  // Radene over 1000 er utenfor malen og kontrolleres ikke, bare telles. Nivå og varenummer er ukjente
  // når kolonnen hoppes over, så ingen regel bygger på dem da.
  const tolket: Tolket[] = ark.rader.slice(0, MAKS_RADER).map((rad) => ({
    rad,
    nivaa: bruk('Nivå') ? tolkNivaa(celle(rad, 'Nivå')) : undefined,
    varenummer: bruk('Varenummer') ? varenummerTekst(celle(rad, 'Varenummer')) : null,
    beskrivelse: beskrivelseTekst(celle(rad, 'Beskrivelse')),
    type: bruk('Type') ? tolkType(celle(rad, 'Type')) : undefined,
  }))

  // --- Rader -----------------------------------------------------------------
  if (ark.tomRadMedInnholdUnder !== null) {
    feil.push({
      kode: 'RADER_IKKE_SAMMENHENGENDE',
      ark: 'Stykkliste',
      sted: { type: 'RAD', excelRad: ark.tomRadMedInnholdUnder },
      felt: 'Rader',
    })
  }
  const forMange = ark.rader[MAKS_RADER]
  if (forMange) {
    feil.push({ kode: 'RADER_FOR_MANGE', ark: 'Stykkliste', sted: { type: 'RAD', excelRad: forMange.excelRad }, felt: 'Rader' })
  }
  // --- Rad for rad, kolonne for kolonne -----------------------------------------
  const forste = new Map<string, Tolket>() // første rad med varenummeret (FR-3, FR-28)
  // Referanseradene for «lik beskrivelse» og «lik type»: første rad med varenummeret som har en gyldig verdi.
  const forsteBeskrivelse = new Map<string, Tolket>()
  const forsteType = new Map<string, Tolket>()
  const nivaaRader: (Tolket | undefined)[] = [undefined, undefined, undefined] // nærmeste rad over på hvert nivå

  tolket.forEach((t, indeks) => {
    const { rad, nivaa, varenummer, beskrivelse, type } = t
    const forrige = tolket[indeks - 1]
    const tidligere = varenummer === null ? undefined : forste.get(varenummer)
    const overordnede = nivaa === undefined ? [] : nivaaRader.slice(0, NIVAATALL[nivaa]).filter((x) => x !== undefined)
    // En del rett under seg selv (V-S09) sammenlignes ikke med tidligere rader: det ville gitt følgefeil.
    const eier = varenummer === null ? undefined : overordnede.find((o) => o.varenummer === varenummer)

    if (bruk('Nivå')) {
      if (nivaa === undefined) meld('NIVAA_UGYLDIG', 'Nivå', rad)
      else if (indeks === 0 && nivaa !== '0') meld('NIVAA_FORSTE_RAD_IKKE_0', 'Nivå', rad)
      else if (indeks > 0 && nivaa === '0') meld('NIVAA_FLERE_NIVAA_0', 'Nivå', rad)
      // Rett under en ekstra nivå 0-rad er feilen den ekstra raden, ikke at nivå 1 mangler.
      if (nivaa === '..2' && forrige?.nivaa === '0' && indeks - 1 === 0) meld('NIVAA_2_UTEN_NIVAA_1_OVER', 'Nivå', rad)
    }

    if (bruk('Varenummer')) {
      if (varenummer === null) meld('VARENUMMER_MANGLER', 'Varenummer', rad)
      else if (eier) meld('VARENUMMER_UNDER_SEG_SELV', 'Varenummer', rad, { varenummer, andreRader: [eier.rad.excelRad] })
    }

    if (bruk('Beskrivelse') && beskrivelse === null) meld('BESKRIVELSE_MANGLER', 'Beskrivelse', rad)
    if (bruk('Beskrivelse') && beskrivelse !== null && varenummer !== null) {
      const fasit = forsteBeskrivelse.get(varenummer)
      if (fasit === undefined) forsteBeskrivelse.set(varenummer, t)
      else if (eier === undefined && fasit.beskrivelse !== beskrivelse) {
        meld('BESKRIVELSE_ULIK', 'Beskrivelse', rad, { varenummer, andreRader: [fasit.rad.excelRad] })
      }
    }

    // Ferdigproduktet har ikke antall. Ellers er antallet et heltall på 1 eller mer (FR-3).
    // Er nivået ukjent, kan vi ikke si at antallet mangler, men et antall som står der, må være gyldig.
    if (bruk('Antall')) {
      const antall = celle(rad, 'Antall')
      if (nivaa === '0') {
        if (!erTom(antall)) meld('ANTALL_FYLT_UT_FOR_NIVAA_0', 'Antall', rad)
      } else if (erTom(antall)) {
        if (nivaa !== undefined) meld('ANTALL_MANGLER', 'Antall', rad)
      } else if ((tolkHeltall(antall) ?? 0) < 1) meld('ANTALL_UGYLDIG', 'Antall', rad)
    }

    if (bruk('Type')) {
      if (type === undefined) meld('TYPE_UGYLDIG', 'Type', rad)
      else {
        // Én feil per celle: har typen alt en feil mot nivået, meldes ikke også «ulik type».
        const feilMotNivaa = (type === 'FERDIGVARE' && nivaa !== undefined && nivaa !== '0') || (nivaa === '0' && type !== 'FERDIGVARE')
        if (type === 'FERDIGVARE' && nivaa !== undefined && nivaa !== '0') meld('TYPE_FERDIGVARE_IKKE_NIVAA_0', 'Type', rad)
        if (nivaa === '0' && type !== 'FERDIGVARE') meld('TYPE_NIVAA_0_IKKE_FERDIGVARE', 'Type', rad)
        const fasit = varenummer === null ? undefined : forsteType.get(varenummer)
        if (varenummer !== null && fasit === undefined) forsteType.set(varenummer, t)
        else if (varenummer !== null && eier === undefined && !feilMotNivaa && fasit?.type !== type) {
          meld('TYPE_ULIK', 'Type', rad, { varenummer, andreRader: [fasit!.rad.excelRad] })
        }
      }
    }

    // Lagerbeholdning, sikkerhetslager og ledetid: fylt ut første gang varenummeret står, tom de neste (FR-3).
    // Uten varenummer vet vi ikke hva som er første gang, så da kontrolleres bare at en verdi som står der,
    // er et gyldig heltall. En del rett under seg selv sammenlignes ikke (V-S09).
    // Ledetiden er minst 1 for alt unntatt ferdigproduktet. Er nivået ukjent, regnes første rad som ferdigproduktet.
    for (const { felt, mangler, ugyldig, senere } of FORSTE_GANG) {
      if (!bruk(felt)) continue
      const verdi = celle(rad, felt)
      const minst = felt === 'Ledetid (uker)' && (nivaa ?? (indeks === 0 ? '0' : '.1')) !== '0' ? 1 : 0
      if (varenummer === null || !bruk('Varenummer')) {
        if (!erTom(verdi) && (tolkHeltall(verdi) ?? -1) < minst) meld(ugyldig, felt, rad)
      } else if (eier !== undefined) {
        continue
      } else if (tidligere !== undefined) {
        if (!erTom(verdi)) meld(senere, felt, rad, { varenummer, andreRader: [tidligere.rad.excelRad] })
      } else if (erTom(verdi)) meld(mangler, felt, rad)
      else if ((tolkHeltall(verdi) ?? -1) < minst) meld(ugyldig, felt, rad)
    }

    if (varenummer !== null && !forste.has(varenummer)) forste.set(varenummer, t)
    if (nivaa === undefined) nivaaRader.fill(undefined)
    else {
      nivaaRader[NIVAATALL[nivaa]] = t
      for (let i = NIVAATALL[nivaa] + 1; i < nivaaRader.length; i++) nivaaRader[i] = undefined
    }
  })

  // «Ingen nivå .1» er bare en feil når alle nivåene kunne tolkes, lesingen ikke stoppet ved en tom rad og
  // ..2 ikke alt er meldt som feil rett under ferdigproduktet. Ellers er den en følge av de andre feilene.
  if (
    bruk('Nivå') &&
    ark.tomRadMedInnholdUnder === null &&
    tolket.every((t) => t.nivaa !== undefined) &&
    !tolket.some((t) => t.nivaa === '.1') &&
    !feil.some((f) => f.kode === 'NIVAA_2_UTEN_NIVAA_1_OVER')
  ) {
    feil.push({
      kode: 'RADER_INGEN_NIVAA_1',
      ark: 'Stykkliste',
      sted: { type: 'RAD', excelRad: tolket[0]?.rad.excelRad ?? 2 },
      felt: 'Rader',
    })
  }

  // --- Underdeler, med strukturen (AD-6) ------------------------------------------
  // Hierarkiet må være til å stole på. Står en tom rad over innhold, eller er lesingen stoppet ved 1000 rader,
  // mangler deler av stykklisten, og underdelene kan se ulike ut uten å være det. Antall og type sperrer bare
  // delene de gjelder (se validerUnderdeler).
  const kanBygge =
    bruk('Nivå') &&
    bruk('Varenummer') &&
    ark.tomRadMedInnholdUnder === null &&
    ark.rader.length <= MAKS_RADER &&
    !feil.some((f) => ødelegger(f.kode))
  if (kanBygge) {
    const cellerMedFeil = new Set(feil.flatMap((f) => (f.sted.type === 'CELLE' ? [`${f.felt}@${f.sted.excelRad}`] : [])))
    feil.push(...validerUnderdeler(tolket, ark, forste, cellerMedFeil, bruk('Antall')))
  }

  return feil.sort((a, b) => radNummer(a) - radNummer(b) || kolonneRang(a) - kolonneRang(b))
}

function radNummer(feil: Valideringsfeil): number {
  return feil.sted.type === 'CELLE' || feil.sted.type === 'RAD' ? feil.sted.excelRad : 0
}

/** Plassen i raden: feil på hele raden først, så kolonnene fra venstre, og underdelene sist. */
function kolonneRang(feil: Valideringsfeil): number {
  if (feil.felt === 'Rader') return -1
  const indeks = STYKKLISTE_KOLONNER.indexOf(feil.felt as StykklisteKolonne)
  return indeks === -1 ? STYKKLISTE_KOLONNER.length : indeks
}

/**
 * Reglene om underdeler (FR-3): en del som kjøpes inn, har ingen underdeler, underdelene er like under
 * hver forekomst (eller står under bare én), og ingen del står under seg selv via andre deler.
 * Kalles bare når alle radene har gyldig nivå og varenummer. Radene med feil i Antall eller Type brukes
 * ikke i reglene de ville gitt følgefeil i (`cellerMedFeil`).
 */
function validerUnderdeler(
  tolket: Tolket[],
  ark: Stykkliste,
  forste: ReadonlyMap<string, Tolket>,
  cellerMedFeil: ReadonlySet<string>,
  medAntall: boolean,
): Valideringsfeil[] {
  const feil: Valideringsfeil[] = []
  const harFeil = (felt: StykklisteKolonne, excelRad: number) => cellerMedFeil.has(`${felt}@${excelRad}`)
  const rader: Stykklisterad[] = tolket.map(({ rad, nivaa, varenummer, beskrivelse, type }) => ({
    excelRad: rad.excelRad,
    // Gyldige her: kanBygge er bare sann når ingen rad har ugyldig nivå eller varenummer.
    nivaa: nivaa as Nivaa,
    varenummer: varenummer as string,
    beskrivelse: beskrivelse ?? '',
    // Et antall som mangler eller er ugyldig, regnes som 1 i strukturen. Raden har alt sin egen feil.
    antall: nivaa === '0' ? null : (tallEllerNull(rad.celler['Antall']) ?? 1),
    type: type ?? 'PRODUSERES_SELV',
    lagerbeholdning: tallEllerNull(rad.celler['Lagerbeholdning']),
    sikkerhetslager: tallEllerNull(rad.celler['Sikkerhetslager']),
    ledetid: tallEllerNull(rad.celler['Ledetid (uker)']),
  }))
  const struktur = byggStruktur(rader)
  const typeVedRad = new Map(tolket.map((t) => [t.rad.excelRad, t.type]))
  const radVedNummer = new Map(tolket.map((t) => [t.rad.excelRad, t.rad]))
  const melding = (kode: Valideringskode, felt: 'Type' | 'Varenummer' | 'Underdeler', excelRad: number, ekstra: Partial<Valideringsfeil>) => {
    const rad = radVedNummer.get(excelRad)
    const verdi = felt === 'Underdeler' || !rad ? null : (rad.celler[felt] ?? null)
    const stedet = felt === 'Underdeler' ? ({ type: 'RAD', excelRad } as const) : cellested(ark.overskrifter[felt], excelRad)
    feil.push({ kode, ark: 'Stykkliste', sted: stedet, felt, verdi, ...ekstra })
  }

  for (const del of struktur.deler) {
    // En del som kjøpes inn, har ingen rader under seg (FR-3). En rad med feil i Type har alt sin egen feil.
    for (const forekomst of del.forekomster) {
      if (
        forekomst.underdeler.length > 0 &&
        typeVedRad.get(forekomst.excelRad) === 'KJOPES_INN' &&
        !harFeil('Type', forekomst.excelRad)
      ) {
        melding('TYPE_KJOPES_INN_HAR_UNDERDELER', 'Type', forekomst.excelRad, {
          varenummer: del.varenummer,
          andreRader: forekomst.underdeler.map((u) => u.excelRad).sort((a, b) => a - b),
        })
      }
    }

    // Underdelene er like under hver forekomst som har underdeler. Står de bare under én, er det greit (FR-3).
    // En forekomst med en underdel som har et antall med feil, sammenlignes ikke: antallet er ukjent, og raden har
    // alt sin feil. Mangler Antall-overskriften, sammenlignes bare varenumrene.
    const medUnderdeler = del.forekomster.filter(
      (f) => f.underdeler.length > 0 && !f.underdeler.some((u) => harFeil('Antall', u.excelRad)),
    )
    const [fasit, ...andre] = medUnderdeler
    if (fasit) {
      // Hver forekomst som avviker fra den første, får sin egen feil, så ingen kommer først ved neste opplasting.
      for (const avvik of andre.filter((f) => nokkelForUnderdeler(f, medAntall) !== nokkelForUnderdeler(fasit, medAntall))) {
        const førsteUnderdel = avvik.underdeler[0]
        if (!førsteUnderdel) continue
        melding('UNDERDELER_ULIKE', 'Underdeler', førsteUnderdel.excelRad, {
          varenummer: del.varenummer,
          andreRader: [fasit.excelRad, avvik.excelRad],
        })
      }
    }
  }

  // En del kan ikke stå under seg selv via andre deler (A under B, og B under A). Beregningen går ovenfra og
  // ned, så den har ingen rekkefølge å regne i. Samme kode som for en del rett under seg selv (V-S09).
  const kanter = new Map<string, Map<string, number>>() // overordnet del → underdel → raden der underdelen står
  for (const del of struktur.deler) {
    const barn = new Map<string, number>()
    for (const forekomst of del.forekomster) {
      for (const u of forekomst.underdeler) if (!barn.has(u.varenummer)) barn.set(u.varenummer, u.excelRad)
    }
    kanter.set(del.varenummer, barn)
  }
  const tilstand = new Map<string, 'pågår' | 'ferdig'>()
  const besøk = (varenummer: string): void => {
    tilstand.set(varenummer, 'pågår')
    for (const [barn, excelRad] of kanter.get(varenummer) ?? []) {
      const barnetsTilstand = tilstand.get(barn)
      if (barnetsTilstand === 'pågår') {
        const førsteRad = forste.get(barn)?.rad.excelRad
        melding('VARENUMMER_UNDER_SEG_SELV', 'Varenummer', excelRad, {
          varenummer: barn,
          andreRader: førsteRad === undefined || førsteRad === excelRad ? [] : [førsteRad],
        })
      } else if (barnetsTilstand === undefined) besøk(barn)
    }
    tilstand.set(varenummer, 'ferdig')
  }
  for (const del of struktur.deler) if (!tilstand.has(del.varenummer)) besøk(del.varenummer)

  return feil
}

/** En heltallscelle som tall, eller null når den er tom eller ikke et heltall. Brukes bare til å bygge strukturen. */
function tallEllerNull(verdi: Celleverdi | undefined): number | null {
  return verdi === null || verdi === undefined ? null : tolkHeltall(verdi)
}

/**
 * Underdelene under én forekomst som en sammenlignbar tekst: antall per varenummer, lagt sammen innenfor
 * forekomsten, i fast rekkefølge. Rekkefølgen på radene spiller ingen rolle (FR-3), og en underdel som står
 * to ganger rett under samme del, telles som summen, slik `byggStruktur` gjør det. Uten antall (Antall-overskriften
 * mangler) er det bare varenumrene som sammenlignes.
 */
function nokkelForUnderdeler(
  forekomst: { underdeler: readonly { varenummer: string; antall: number }[] },
  medAntall: boolean,
): string {
  const sum = new Map<string, number>()
  for (const { varenummer, antall } of forekomst.underdeler) sum.set(varenummer, medAntall ? (sum.get(varenummer) ?? 0) + antall : 1)
  return JSON.stringify([...sum].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
}
