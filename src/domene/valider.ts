// Validering av Excel-filen (Story 1.6, 1.8 og 1.9, FR-2, FR-3, FR-4, AD-4, AD-5, AD-9).
//
// Story 1.6 kontrollerer malens struktur: arkene og kolonneoverskriftene. Verdiene kontrolleres
// i Story 1.8 (Stykkliste) og 1.9 (MPS og Planlagte mottak), som spør `hoppesOver` om en kontroll
// skal hoppes over fordi et ark eller en overskrift mangler. `valider` (Story 1.9) kjører alt og
// gir `Inndata` når filen er gyldig.
//
// - Kaster aldri unntak for feil i brukerens data, og samler alle feil før den svarer (AD-5).
// - Gir koder, ark, sted og felt, aldri ferdig tekst. Teksten lages i tekster/nb.ts (AD-9).

import { cellested, tolkNivaa, tolkType, varenummerTekst } from './celler.ts'
import { tolkHeltall } from './heltall.ts'
import { validerStykklisteVerdier } from './valider-stykkliste.ts'
import {
  ARKNAVN,
  MPS_KOLONNER,
  PLANLAGTE_MOTTAK_KOLONNER,
  STYKKLISTE_KOLONNER,
  type Arknavn,
  type Celleverdi,
  type HoppetOverKontroll,
  type Inndata,
  type Kolonnenavn,
  type MpsKolonne,
  type PlanlagteMottakKolonne,
  type PlanlagtMottak,
  type RaaArk,
  type StykklisteKolonne,
  type Stykklisterad,
  type Utfall,
  type Valideringsfeil,
  type Valideringskode,
  type Valideringsresultat,
} from './typer.ts'

/** Malens kolonner per ark, i malens rekkefølge (indeks 0 = kolonne A). */
const KOLONNER: Record<Arknavn, readonly Kolonnenavn[]> = {
  Stykkliste: STYKKLISTE_KOLONNER,
  MPS: MPS_KOLONNER,
  'Planlagte mottak': PLANLAGTE_MOTTAK_KOLONNER,
}

/** Arkene i den gamle malen. Har filen ett av dem og ikke Stykkliste, gir det GAMMEL_MAL (FR-2). */
const GAMLE_ARK = ['Produkt', 'Komponenter']

type Fordi = HoppetOverKontroll['fordi']

/**
 * Kontrollerer at filen har malens ark og kolonneoverskrifter (FR-2).
 *
 * - Arkene kontrolleres i rekkefølgen i ARKNAVN. Et ark som mangler, gir ARK_MANGLER (eller GAMMEL_MAL
 *   for Stykkliste i en fil etter den gamle malen), og overskriftene i det kontrolleres ikke.
 * - Hver overskrift som mangler, gir OVERSKRIFT_MANGLER med malens plass i rad 1, i malens rekkefølge.
 * - `hoppetOver` har én linje per ark og felt som ikke kan kontrolleres, så 1.8 og 1.9 ikke gir følgefeil.
 */
export function validerStruktur(raa: RaaArk): Valideringsresultat {
  const feil: Valideringsfeil[] = []
  const hoppetOver: HoppetOverKontroll[] = []

  for (const ark of ARKNAVN) {
    const kolonner = KOLONNER[ark]
    const overskrifter = overskrifterI(raa, ark)

    if (overskrifter === null) {
      const gammelMal = ark === 'Stykkliste' && raa.alleArk.some((navn) => GAMLE_ARK.includes(navn))
      feil.push({ kode: gammelMal ? 'GAMMEL_MAL' : 'ARK_MANGLER', ark, sted: { type: 'ARK' }, felt: 'Ark' })
      for (const felt of kolonner) hoppetOver.push({ ark, felt, fordi: { kode: 'ARK_MANGLER', ark } })
      continue
    }

    kolonner.forEach((felt, indeks) => {
      if ((overskrifter[felt] ?? null) === null) {
        feil.push({
          kode: 'OVERSKRIFT_MANGLER',
          ark,
          sted: { type: 'OVERSKRIFT', celle: `${kolonnebokstav(indeks)}1` },
          felt,
        })
        hoppetOver.push({ ark, felt, fordi: { kode: 'OVERSKRIFT_MANGLER', ark, felt } })
        return
      }
      const avhengighet = avhengerAv(raa, ark, felt)
      if (avhengighet !== null) hoppetOver.push({ ark, felt, fordi: avhengighet })
    })
  }

  return { feil, hoppetOver }
}

/** Kolonnene i hvert ark, så `hoppesOver` bare godtar en kolonne som finnes i arket. */
export type KolonnerIArk = {
  Stykkliste: StykklisteKolonne
  MPS: MpsKolonne
  'Planlagte mottak': PlanlagteMottakKolonne
}

/** Om kontrollen av feltet i arket er hoppet over (for Story 1.8 og 1.9). */
export function hoppesOver<A extends Arknavn>(resultat: Valideringsresultat, ark: A, felt: KolonnerIArk[A]): boolean {
  return resultat.hoppetOver.some((linje) => linje.ark === ark && linje.felt === felt)
}

// ---------------------------------------------------------------------------
// Hele valideringen (Story 1.9)
// ---------------------------------------------------------------------------

/**
 * Validerer hele filen og gir `Inndata`, eller alle valideringsfeilene (FR-3, FR-4, AD-4, AD-5).
 *
 * - Feilene står i rekkefølgen strukturfeil, Stykkliste, MPS og Planlagte mottak.
 * - Når Stykkliste-reglene gir 0 feil, gjøres radene om til `Stykklisterad`. En celle som ikke kan
 *   gjøres om, gir en feil på cellen (sikkerhetsnettet), aldri et unntak.
 * - Kontroller som `hoppesOver` sier skal hoppes over, kjøres ikke (FR-2).
 */
export function valider(raa: RaaArk): Utfall<Inndata, Valideringsresultat> {
  const struktur = validerStruktur(raa)
  const stykklistefeil = validerStykkliste(raa, struktur)
  const omgjort = stykklistefeil.length === 0 ? tilStykklisterader(raa, struktur) : null
  const feil = [
    ...struktur.feil,
    ...stykklistefeil,
    ...(omgjort?.feil ?? []),
    ...validerMpsOgMottak(raa, struktur),
  ]

  const mps = lesMps(raa, struktur)
  if (feil.length > 0 || omgjort === null || mps === null) {
    return { ok: false, feil: { feil, hoppetOver: struktur.hoppetOver } }
  }

  const prognostiserteBehov: number[] = []
  for (let uke = 1; uke <= mps.horisont; uke++) prognostiserteBehov.push(tolkHeltall(mps.uker.get(uke) ?? null) ?? 0)

  // Enkeltlinjer med Excel-rad, ikke lagt sammen (AD-4).
  const planlagteMottak: PlanlagtMottak[] = (raa.planlagteMottak?.rader ?? []).map((rad) => ({
    varenummer: varenummerTekst(rad.celler['Varenummer']) ?? '',
    uke: tolkHeltall(rad.celler['Uke'] ?? null) ?? 0,
    antall: tolkHeltall(rad.celler['Antall'] ?? null) ?? 0,
    excelRad: rad.excelRad,
  }))

  return {
    ok: true,
    verdi: { stykkliste: omgjort.rader, horisont: mps.horisont, prognostiserteBehov, planlagteMottak },
  }
}

/** Verdiene i Stykkliste (FR-3, Story 1.8). Kontroller som hoppesOver sier skal hoppes over, kjøres ikke (FR-2). */
function validerStykkliste(raa: RaaArk, struktur: Valideringsresultat): Valideringsfeil[] {
  if (raa.stykkliste === null) return []
  return validerStykklisteVerdier(raa.stykkliste, (felt) => hoppesOver(struktur, 'Stykkliste', felt))
}

// ---------------------------------------------------------------------------
// Fra stykklisterad til Stykklisterad (sikkerhetsnettet)
// ---------------------------------------------------------------------------

/** `undefined` betyr at cellen ikke kan gjøres om. `null` er en tom celle der det er lov. */
type Tolk<T> = (verdi: Celleverdi) => T | undefined

const tolkVarenummer: Tolk<string> = (verdi) => varenummerTekst(verdi) ?? undefined
const tolkBeskrivelse: Tolk<string> = (verdi) => {
  if (typeof verdi === 'number') return String(verdi)
  const tekst = typeof verdi === 'string' ? verdi.trim() : ''
  return tekst !== '' ? tekst : undefined
}
/** Tallfeltene: en tom celle blir null. Grensene (≥ 0, ≥ 1) er Stykkliste-reglene sine (Story 1.8). */
const tolkTall: Tolk<number | null> = (verdi) => (verdi === null ? null : (tolkHeltall(verdi) ?? undefined))

/**
 * Gjør radene i Stykkliste om til `Stykklisterad` (AD-4). En celle som ikke kan gjøres om, gir
 * koden for cellen i stedet for et unntak. Når Story 1.8 er flettet, har Stykkliste-reglene alt
 * funnet disse feilene, og dette kjøres bare når de gir 0 feil. Felt som hoppes over, kontrolleres
 * ikke, og raden blir da ikke med (filen har alt en strukturfeil).
 */
function tilStykklisterader(
  raa: RaaArk,
  struktur: Valideringsresultat,
): { rader: Stykklisterad[]; feil: Valideringsfeil[] } {
  const ark = raa.stykkliste
  const rader: Stykklisterad[] = []
  const feil: Valideringsfeil[] = []
  if (ark === null) return { rader, feil }

  for (const rad of ark.rader) {
    let fullstendig = true
    const celle = <T>(felt: StykklisteKolonne, kode: Valideringskode, tolk: Tolk<T>): T => {
      if (hoppesOver(struktur, 'Stykkliste', felt)) {
        fullstendig = false
        return undefined as T
      }
      const verdi = rad.celler[felt] ?? null
      const tolket = tolk(verdi)
      if (tolket === undefined) {
        fullstendig = false
        feil.push({ kode, ark: 'Stykkliste', sted: cellested(ark.overskrifter[felt], rad.excelRad), felt, verdi })
      }
      return tolket as T
    }

    const stykklisterad: Stykklisterad = {
      excelRad: rad.excelRad,
      nivaa: celle('Nivå', 'NIVAA_UGYLDIG', tolkNivaa),
      varenummer: celle('Varenummer', 'VARENUMMER_MANGLER', tolkVarenummer),
      beskrivelse: celle('Beskrivelse', 'BESKRIVELSE_MANGLER', tolkBeskrivelse),
      antall: celle('Antall', 'ANTALL_UGYLDIG', tolkTall),
      type: celle('Type', 'TYPE_UGYLDIG', tolkType),
      lagerbeholdning: celle('Lagerbeholdning', 'LAGERBEHOLDNING_UGYLDIG', tolkTall),
      sikkerhetslager: celle('Sikkerhetslager', 'SIKKERHETSLAGER_UGYLDIG', tolkTall),
      ledetid: celle('Ledetid (uker)', 'LEDETID_UGYLDIG', tolkTall),
    }
    if (fullstendig) rader.push(stykklisterad)
  }
  return { rader, feil }
}

// ---------------------------------------------------------------------------
// MPS og Planlagte mottak (Story 1.9, FR-3)
// ---------------------------------------------------------------------------

const MIN_HORISONT = 8
const MAKS_HORISONT = 12

type Mps = {
  /** «Antall ferdigprodukter» per uke. Uken er Excel-raden − 1 (rad 2 = uke 1). En uke som ikke står, er tom. */
  uker: Map<number, Celleverdi>
  /** H: antall sammenhengende uker fra uke 1 der antallet ikke er tomt. */
  horisont: number
}

/** Ukene i MPS, eller null når kontrollen av «Antall ferdigprodukter» hoppes over (FR-2). */
function lesMps(raa: RaaArk, struktur: Valideringsresultat): Mps | null {
  if (raa.mps === null || hoppesOver(struktur, 'MPS', 'Antall ferdigprodukter')) return null
  const uker = new Map<number, Celleverdi>()
  for (const rad of raa.mps.rader) {
    const verdi = rad.celler['Antall ferdigprodukter'] ?? null
    if (verdi !== null) uker.set(rad.excelRad - 1, verdi)
  }
  let horisont = 0
  while (uker.has(horisont + 1)) horisont++
  return { uker, horisont }
}

function gyldigHorisont(horisont: number): boolean {
  return horisont >= MIN_HORISONT && horisont <= MAKS_HORISONT
}

/**
 * Kontrollerer verdiene i MPS og Planlagte mottak (FR-3). `struktur` er svaret fra `validerStruktur`.
 * Feilene i MPS står etter uke, og feilene i Planlagte mottak etter rad og så kolonne.
 */
export function validerMpsOgMottak(raa: RaaArk, struktur: Valideringsresultat): Valideringsfeil[] {
  const mps = lesMps(raa, struktur)
  const horisont = mps !== null && gyldigHorisont(mps.horisont) ? mps.horisont : null
  return [...(mps === null ? [] : validerMps(mps)), ...validerPlanlagteMottak(raa, struktur, horisont)]
}

/**
 * - H utenfor 8–12 gir én MPS_HORISONT_UGYLDIG, på uke H + 1 når H < 8 og på uke 13 når H > 12.
 * - Hver uke med antall etter den første tomme uken gir MPS_UKE_ETTER_HULL.
 * - Hvert antall som ikke er et heltall ≥ 0, gir MPS_ANTALL_UGYLDIG, også innenfor H.
 */
function validerMps({ uker, horisont }: Mps): Valideringsfeil[] {
  const feil: Valideringsfeil[] = []
  const forsteTommeUke = horisont + 1
  let sisteUke = forsteTommeUke
  for (const uke of uker.keys()) sisteUke = Math.max(sisteUke, uke)
  const legg = (kode: Valideringskode, uke: number, verdi: Celleverdi): void => {
    feil.push({ kode, ark: 'MPS', sted: { type: 'UKE', uke }, felt: 'Antall ferdigprodukter', verdi })
  }

  for (let uke = 1; uke <= sisteUke; uke++) {
    const verdi = uker.get(uke) ?? null
    if (horisont < MIN_HORISONT && uke === forsteTommeUke) legg('MPS_HORISONT_UGYLDIG', uke, verdi)
    if (horisont > MAKS_HORISONT && uke === MAKS_HORISONT + 1) legg('MPS_HORISONT_UGYLDIG', uke, verdi)
    if (verdi === null) continue
    if (uke > forsteTommeUke) legg('MPS_UKE_ETTER_HULL', uke, verdi)
    const antall = tolkHeltall(verdi)
    if (antall === null || antall < 0) legg('MPS_ANTALL_UGYLDIG', uke, verdi)
  }
  return feil
}

/**
 * Hver rad med innhold i Planlagte mottak (FR-3). Et tomt ark er gyldig.
 * `horisont` er null når horisonten er ugyldig. Da hoppes kontrollen av uken mot H over, så det ikke
 * blir følgefeil. Kontrollen av at uken er et heltall ≥ 1 kjøres likevel, fordi uke 0 og negative uker
 * er feil uansett hva H er.
 */
function validerPlanlagteMottak(raa: RaaArk, struktur: Valideringsresultat, horisont: number | null): Valideringsfeil[] {
  const ark = raa.planlagteMottak
  if (ark === null) return []
  const feil: Valideringsfeil[] = []
  const varenumre = new Set<string>()
  for (const rad of raa.stykkliste?.rader ?? []) {
    const varenummer = varenummerTekst(rad.celler['Varenummer'])
    if (varenummer !== null) varenumre.add(varenummer)
  }
  const kontroller = (felt: PlanlagteMottakKolonne): boolean => !hoppesOver(struktur, 'Planlagte mottak', felt)

  for (const rad of ark.rader) {
    const legg = (kode: Valideringskode, felt: PlanlagteMottakKolonne): void => {
      feil.push({
        kode,
        ark: 'Planlagte mottak',
        sted: cellested(ark.overskrifter[felt], rad.excelRad),
        felt,
        verdi: rad.celler[felt] ?? null,
      })
    }

    if (kontroller('Varenummer')) {
      const varenummer = varenummerTekst(rad.celler['Varenummer'])
      if (varenummer === null || !varenumre.has(varenummer)) legg('MOTTAK_VARENUMMER_UKJENT', 'Varenummer')
    }
    if (kontroller('Uke')) {
      const uke = tolkHeltall(rad.celler['Uke'] ?? null)
      if (uke === null) legg('MOTTAK_UKE_IKKE_HELTALL', 'Uke')
      else if (uke < 1 || (horisont !== null && uke > horisont)) legg('MOTTAK_UKE_UTENFOR_HORISONT', 'Uke')
    }
    if (kontroller('Antall')) {
      const antall = tolkHeltall(rad.celler['Antall'] ?? null)
      if (antall === null || antall < 1) legg('MOTTAK_ANTALL_UGYLDIG', 'Antall')
    }
  }
  return feil
}

// ---------------------------------------------------------------------------
// Hjelpere
// ---------------------------------------------------------------------------

function overskrifterI(raa: RaaArk, ark: Arknavn): Partial<Record<Kolonnenavn, string | null>> | null {
  switch (ark) {
    case 'Stykkliste':
      return raa.stykkliste?.overskrifter ?? null
    case 'MPS':
      return raa.mps?.overskrifter ?? null
    case 'Planlagte mottak':
      return raa.planlagteMottak?.overskrifter ?? null
  }
}

/**
 * Kontroller i et ark som finnes, men som avhenger av et annet ark (FR-2):
 * - Planlagte mottak › Uke trenger horisonten, altså MPS med «Antall ferdigprodukter».
 * - Planlagte mottak › Varenummer trenger varenumrene i Stykkliste.
 */
function avhengerAv(raa: RaaArk, ark: Arknavn, felt: Kolonnenavn): Fordi | null {
  if (ark !== 'Planlagte mottak') return null
  if (felt === 'Uke') {
    if (raa.mps === null) return { kode: 'ARK_MANGLER', ark: 'MPS' }
    if ((raa.mps.overskrifter['Antall ferdigprodukter'] ?? null) === null) {
      return { kode: 'OVERSKRIFT_MANGLER', ark: 'MPS', felt: 'Antall ferdigprodukter' }
    }
  }
  if (felt === 'Varenummer') {
    if (raa.stykkliste === null) return { kode: 'ARK_MANGLER', ark: 'Stykkliste' }
    if ((raa.stykkliste.overskrifter['Varenummer'] ?? null) === null) {
      return { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', felt: 'Varenummer' }
    }
  }
  return null
}

/** 0 → A, 7 → H, 26 → AA. */
function kolonnebokstav(indeks: number): string {
  let bokstaver = ''
  for (let n = indeks + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    bokstaver = String.fromCharCode(65 + ((n - 1) % 26)) + bokstaver
  }
  return bokstaver
}
