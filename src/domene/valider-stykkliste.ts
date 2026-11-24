// Kontroll av verdiene i arket Stykkliste (Story 1.8, FR-3, FR-4, AD-4, AD-5, AD-6, AD-9).
//
// Reglene er tabellen i FR-3, og hver regel har sin kode i VALIDERINGSKODER. Funksjonen gir koder,
// ark, sted og felt, aldri ferdig tekst (AD-9). Teksten lages i tekster/nb.ts.
//
// - Kaster aldri unntak for feil i brukerens data, og samler alle feil før den svarer (AD-5, FR-4).
// - Én feil i filen gir én valideringsfeil. Regler som ville gitt følgefeil, hoppes over: en regel som
//   trenger en kolonne som `hoppesOver` sier mangler, kontrolleres ikke (FR-2), og reglene om underdeler
//   kjøres bare når nivå, varenummer, antall og type er gyldige i alle radene (strukturen er da til å stole på).
// - Reglene om underdeler og om delen som kjøpes inn, bruker `Struktur` fra `struktur.ts` (AD-6).
// - Feilene står i rekkefølgen de har i arket (Excel-rad), og ved lik rad i rekkefølgen kolonnene har.

import { cellested, erTom, tolkNivaa, tolkType, varenummerTekst } from './celler.ts'
import { tolkHeltall } from './heltall.ts'
import { byggStruktur } from './struktur.ts'
import type {
  Celleverdi,
  Delstype,
  Nivaa,
  RaaArk,
  RaaRad,
  StykklisteKolonne,
  Stykklisterad,
  Valideringsfeil,
  Valideringskode,
} from './typer.ts'

type Stykkliste = NonNullable<RaaArk['stykkliste']>
type Rad = RaaRad<StykklisteKolonne>

/** Stykklisten har inntil 1000 rader, fra rad 2 (FR-3). */
export const MAKS_RADER = 1000

const NIVAATALL: Record<Nivaa, number> = { '0': 0, '.1': 1, '..2': 2 }

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

/** Kodene som gjør at nivåene, varenumrene, antallene eller typene ikke kan stoles på som struktur. */
function ødelegger(kode: Valideringskode): boolean {
  return /^(NIVAA|VARENUMMER|ANTALL)_/.test(kode) || kode === 'TYPE_UGYLDIG'
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
    type: tolkType(celle(rad, 'Type')),
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
  if (bruk('Nivå') && !tolket.some((t) => t.nivaa === '.1')) {
    feil.push({
      kode: 'RADER_INGEN_NIVAA_1',
      ark: 'Stykkliste',
      sted: { type: 'RAD', excelRad: tolket[0]?.rad.excelRad ?? 2 },
      felt: 'Rader',
    })
  }

  // --- Rad for rad, kolonne for kolonne -----------------------------------------
  const forste = new Map<string, Tolket>() // første rad med varenummeret (FR-3, FR-28)
  const nivaaRader: (Tolket | undefined)[] = [undefined, undefined, undefined] // nærmeste rad over på hvert nivå

  tolket.forEach((t, indeks) => {
    const { rad, nivaa, varenummer, beskrivelse, type } = t
    const forrige = tolket[indeks - 1]
    const tidligere = varenummer === null ? undefined : forste.get(varenummer)
    const overordnede = nivaa === undefined ? [] : nivaaRader.slice(0, NIVAATALL[nivaa]).filter((x) => x !== undefined)

    if (bruk('Nivå')) {
      if (nivaa === undefined) meld('NIVAA_UGYLDIG', 'Nivå', rad)
      else if (indeks === 0 && nivaa !== '0') meld('NIVAA_FORSTE_RAD_IKKE_0', 'Nivå', rad)
      else if (indeks > 0 && nivaa === '0') meld('NIVAA_FLERE_NIVAA_0', 'Nivå', rad)
      if (nivaa === '..2' && forrige?.nivaa === '0') meld('NIVAA_2_UTEN_NIVAA_1_OVER', 'Nivå', rad)
    }

    if (bruk('Varenummer')) {
      if (varenummer === null) meld('VARENUMMER_MANGLER', 'Varenummer', rad)
      else {
        const eier = overordnede.find((o) => o.varenummer === varenummer)
        if (eier) meld('VARENUMMER_UNDER_SEG_SELV', 'Varenummer', rad, { varenummer, andreRader: [eier.rad.excelRad] })
      }
    }

    if (bruk('Beskrivelse')) {
      if (beskrivelse === null) meld('BESKRIVELSE_MANGLER', 'Beskrivelse', rad)
      else if (tidligere?.beskrivelse != null && tidligere.beskrivelse !== beskrivelse) {
        meld('BESKRIVELSE_ULIK', 'Beskrivelse', rad, { varenummer: varenummer ?? undefined, andreRader: [tidligere.rad.excelRad] })
      }
    }

    // Ferdigproduktet har ikke antall. Ellers er antallet et heltall på 1 eller mer (FR-3).
    if (bruk('Antall') && nivaa !== undefined) {
      const antall = celle(rad, 'Antall')
      if (nivaa === '0') {
        if (!erTom(antall)) meld('ANTALL_FYLT_UT_FOR_NIVAA_0', 'Antall', rad)
      } else if (erTom(antall)) meld('ANTALL_MANGLER', 'Antall', rad)
      else if ((tolkHeltall(antall) ?? 0) < 1) meld('ANTALL_UGYLDIG', 'Antall', rad)
    }

    if (bruk('Type')) {
      if (type === undefined) meld('TYPE_UGYLDIG', 'Type', rad)
      else {
        if (type === 'FERDIGVARE' && nivaa !== undefined && nivaa !== '0') meld('TYPE_FERDIGVARE_IKKE_NIVAA_0', 'Type', rad)
        if (nivaa === '0' && type !== 'FERDIGVARE') meld('TYPE_NIVAA_0_IKKE_FERDIGVARE', 'Type', rad)
        if (tidligere?.type !== undefined && tidligere.type !== type) {
          meld('TYPE_ULIK', 'Type', rad, { varenummer: varenummer ?? undefined, andreRader: [tidligere.rad.excelRad] })
        }
      }
    }

    // Lagerbeholdning, sikkerhetslager og ledetid: fylt ut første gang varenummeret står, tom de neste (FR-3).
    // Uten varenummer vet vi ikke hva som er første gang, så da kontrolleres de ikke.
    if (varenummer !== null && bruk('Varenummer')) {
      for (const { felt, mangler, ugyldig, senere } of FORSTE_GANG) {
        if (!bruk(felt)) continue
        const verdi = celle(rad, felt)
        if (tidligere !== undefined) {
          if (!erTom(verdi)) meld(senere, felt, rad, { varenummer, andreRader: [tidligere.rad.excelRad] })
          continue
        }
        // Heltall ≥ 0, men ledetiden er ≥ 1 for alle unntatt ferdigproduktet (FR-3).
        const minst = felt === 'Ledetid (uker)' && nivaa !== '0' && nivaa !== undefined ? 1 : 0
        if (erTom(verdi)) meld(mangler, felt, rad)
        else if ((tolkHeltall(verdi) ?? -1) < minst) meld(ugyldig, felt, rad)
      }
    }

    if (varenummer !== null && !forste.has(varenummer)) forste.set(varenummer, t)
    if (nivaa === undefined) nivaaRader.fill(undefined)
    else {
      nivaaRader[NIVAATALL[nivaa]] = t
      for (let i = NIVAATALL[nivaa] + 1; i < nivaaRader.length; i++) nivaaRader[i] = undefined
    }
  })

  // --- Underdeler, med strukturen (AD-6) ------------------------------------------
  const kanBygge = bruk('Nivå') && bruk('Varenummer') && bruk('Antall') && bruk('Type') && !feil.some((f) => ødelegger(f.kode))
  if (kanBygge) feil.push(...validerUnderdeler(tolket, ark, forste))

  // Feilene står i rekkefølgen de har i arket. Sorteringen er stabil, så kolonnerekkefølgen bevares per rad.
  return feil.sort((a, b) => radNummer(a) - radNummer(b))
}

function radNummer(feil: Valideringsfeil): number {
  return feil.sted.type === 'CELLE' || feil.sted.type === 'RAD' ? feil.sted.excelRad : 0
}

/** Beskrivelsen som tekst, eller null når den er tom. Et tall gjøres om til tekst. */
function beskrivelseTekst(verdi: Celleverdi): string | null {
  if (typeof verdi === 'number') return String(verdi)
  const tekst = typeof verdi === 'string' ? verdi.trim() : ''
  return tekst === '' ? null : tekst
}

/**
 * Reglene om underdeler (FR-3): en del som kjøpes inn, har ingen underdeler, underdelene er like under
 * hver forekomst (eller står under bare én), og ingen del står under seg selv via andre deler.
 * Kalles bare når radene har gyldig nivå, varenummer, antall og type.
 */
function validerUnderdeler(tolket: Tolket[], ark: Stykkliste, forste: ReadonlyMap<string, Tolket>): Valideringsfeil[] {
  const feil: Valideringsfeil[] = []
  const rader: Stykklisterad[] = tolket.map(({ rad, nivaa, varenummer, beskrivelse, type }) => ({
    excelRad: rad.excelRad,
    // Gyldige her: kanBygge er bare sann når ingen rad har ugyldig nivå, varenummer eller type.
    nivaa: nivaa as Nivaa,
    varenummer: varenummer as string,
    beskrivelse: beskrivelse ?? '',
    antall: tallEllerNull(rad.celler['Antall']),
    type: type as Delstype,
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
    // En del som kjøpes inn, har ingen rader under seg (FR-3).
    for (const forekomst of del.forekomster) {
      if (forekomst.underdeler.length > 0 && typeVedRad.get(forekomst.excelRad) === 'KJOPES_INN') {
        melding('TYPE_KJOPES_INN_HAR_UNDERDELER', 'Type', forekomst.excelRad, {
          varenummer: del.varenummer,
          andreRader: forekomst.underdeler.map((u) => u.excelRad),
        })
      }
    }

    // Underdelene er like under hver forekomst som har underdeler. Står de bare under én, er det greit (FR-3).
    const medUnderdeler = del.forekomster.filter((f) => f.underdeler.length > 0)
    const [fasit, ...andre] = medUnderdeler
    if (fasit) {
      const avvik = andre.find((f) => nokkelForUnderdeler(f) !== nokkelForUnderdeler(fasit))
      const førsteUnderdel = avvik?.underdeler[0]
      if (avvik && førsteUnderdel) {
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
 * to ganger rett under samme del, telles som summen, slik `byggStruktur` gjør det.
 */
function nokkelForUnderdeler(forekomst: { underdeler: readonly { varenummer: string; antall: number }[] }): string {
  const sum = new Map<string, number>()
  for (const { varenummer, antall } of forekomst.underdeler) sum.set(varenummer, (sum.get(varenummer) ?? 0) + antall)
  return JSON.stringify([...sum].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
}
