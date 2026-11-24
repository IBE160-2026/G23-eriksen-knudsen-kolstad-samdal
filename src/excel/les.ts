// Leser Excel-filen og gir RaaArk eller en filfeil (Story 1.5, AD-5, AD-15).
//
// - Kaster aldri unntak. Et uventet unntak under lesingen gir SKADET_FIL.
// - Avgjør aldri om en verdi er feil. Det gjør valideringen (domene/valider.ts).
// - Finner arkene på eksakt navn og kolonnene på overskriften i rad 1 (trimmet). Første treff gjelder.
// - Leser bare malens kolonner. Kontroll-kolonnen, hjelpekolonnene og arkene Veiledning og
//   Veien videre leses ikke (FR-2).
// - Leser lagrede verdier, aldri formler (NFR-11).

import { CFB, read, utils, type CellObject, type WorkBook, type WorkSheet } from 'xlsx'
import {
  MPS_KOLONNER,
  PLANLAGTE_MOTTAK_KOLONNER,
  STYKKLISTE_KOLONNER,
  type Celleverdi,
  type Filfeil,
  type Filfeilkode,
  type Kolonnenavn,
  type RaaArk,
  type RaaArkInnhold,
  type RaaRad,
  type StykklisteKolonne,
  type Utfall,
} from '../domene/typer.ts'

const CFB_START = [0xd0, 0xcf, 0x11, 0xe0]
const ZIP_START = [0x50, 0x4b, 0x03, 0x04]

/** Nivå og Varenummer er tekst (AD-4). Tall gjøres om med String(tall), og tekst trimmes. */
const TEKSTKOLONNER: ReadonlySet<Kolonnenavn> = new Set<Kolonnenavn>(['Nivå', 'Varenummer'])

/** Feilverdiene i Excel, etter koden SheetJS lagrer i `v`. Brukes bare hvis `w` mangler. */
const FEILVERDIER: Record<number, string> = {
  0x00: '#NULL!',
  0x07: '#DIV/0!',
  0x0f: '#VALUE!',
  0x17: '#REF!',
  0x1d: '#NAME?',
  0x24: '#NUM!',
  0x2a: '#N/A',
  0x2b: '#GETTING_DATA',
}

type CfbFil = { FullPaths: string[] }
type CfbLeser = {
  read: (data: Uint8Array, valg: { type: 'array' }) => CfbFil
  find: (fil: CfbFil, sti: string) => unknown
}

export function les(innhold: ArrayBuffer | Uint8Array, filnavn: string): Utfall<RaaArk, Filfeil> {
  try {
    // Rekkefølgen er bestemt (spec 1.5). Bytesjekken kommer før SheetJS, fordi SheetJS leser
    // tomme filer og tekstfiler som CSV uten å feile.
    if (!filnavn.toLowerCase().endsWith('.xlsx')) return filfeil('IKKE_XLSX')
    const bytes = tilBytes(innhold)
    if (bytes.length === 0) return filfeil('TOM_FIL')
    if (starterMed(bytes, CFB_START)) {
      return erKryptert(bytes) ? filfeil('PASSORDBESKYTTET') : filfeil('IKKE_EXCEL')
    }
    if (!starterMed(bytes, ZIP_START)) return filfeil('IKKE_EXCEL')

    let bok: WorkBook
    try {
      bok = read(bytes, {
        type: 'array',
        dense: true,
        cellFormula: false,
        cellHTML: false,
        cellStyles: false,
      })
    } catch {
      return filfeil('SKADET_FIL')
    }
    return { ok: true, verdi: lesBok(bok, filnavn) }
  } catch {
    return filfeil('SKADET_FIL')
  }
}

function filfeil(kode: Filfeilkode): Utfall<RaaArk, Filfeil> {
  return { ok: false, feil: { kode } }
}

function tilBytes(innhold: ArrayBuffer | Uint8Array): Uint8Array {
  return ArrayBuffer.isView(innhold)
    ? new Uint8Array(innhold.buffer, innhold.byteOffset, innhold.byteLength)
    : new Uint8Array(innhold)
}

function starterMed(bytes: Uint8Array, start: number[]): boolean {
  return bytes.length >= start.length && start.every((b, i) => bytes[i] === b)
}

/** En .xlsx-fil lagret med passord er en CFB-fil med strømmen EncryptedPackage. */
function erKryptert(bytes: Uint8Array): boolean {
  const cfb = CFB as CfbLeser
  return Boolean(cfb.find(cfb.read(bytes, { type: 'array' }), 'EncryptedPackage'))
}

function lesBok(bok: WorkBook, filnavn: string): RaaArk {
  const ark = (navn: string): WorkSheet | undefined =>
    bok.SheetNames.includes(navn) ? bok.Sheets[navn] : undefined

  const stykkliste = ark('Stykkliste')
  const mps = ark('MPS')
  const planlagteMottak = ark('Planlagte mottak')

  return {
    filnavn,
    alleArk: [...bok.SheetNames],
    stykkliste: stykkliste ? lesStykkliste(stykkliste) : null,
    mps: mps ? lesTabell(mps, MPS_KOLONNER) : null,
    planlagteMottak: planlagteMottak ? lesTabell(planlagteMottak, PLANLAGTE_MOTTAK_KOLONNER) : null,
  }
}

// ---------------------------------------------------------------------------
// Ark og kolonner
// ---------------------------------------------------------------------------

type Ark<K extends Kolonnenavn> = {
  overskrifter: Record<K, string | null>
  /** Kolonnene som finnes, med indeks (0 = A). */
  kolonner: [K, number][]
  /** Cellene per rad, 0-basert (rad 0 = Excel-rad 1). */
  data: CellObject[][]
  /**
   * Siste Excel-rad med celler i `!data`. Radene under kan ikke ha innhold, så det er nok å lese hit,
   * selv om !ref er større (for eksempel til rad 1 048 576) eller malen har 1001 rader.
   */
  sisteRad: number
}

function finnKolonner<K extends Kolonnenavn>(ws: WorkSheet, malkolonner: readonly K[]): Ark<K> {
  const data: CellObject[][] = ws['!data'] ?? []
  const overskriftsrad = data[0] ?? []

  const overskrifter = {} as Record<K, string | null>
  const kolonner: [K, number][] = []
  for (const navn of malkolonner) {
    const indeks = overskriftsrad.findIndex((celle) => {
      const verdi = celle?.v
      return typeof verdi === 'string' && verdi.normalize('NFC').trim() === navn
    })
    overskrifter[navn] = indeks >= 0 ? utils.encode_col(indeks) : null
    if (indeks >= 0) kolonner.push([navn, indeks])
  }

  return { overskrifter, kolonner, data, sisteRad: data.length }
}

function lesRad<K extends Kolonnenavn>(ark: Ark<K>, excelRad: number): RaaRad<K> {
  const rad = ark.data[excelRad - 1]
  const celler: Partial<Record<K, Celleverdi>> = {}
  for (const [navn, indeks] of ark.kolonner) {
    celler[navn] = celleverdi(rad?.[indeks], TEKSTKOLONNER.has(navn))
  }
  return { excelRad, celler }
}

function harInnhold<K extends Kolonnenavn>(rad: RaaRad<K>): boolean {
  return Object.values(rad.celler).some((verdi) => verdi !== null && verdi !== undefined)
}

/** MPS og Planlagte mottak: alle rader fra rad 2 der minst én av malens kolonner har innhold. */
function lesTabell<K extends Kolonnenavn>(ws: WorkSheet, malkolonner: readonly K[]): RaaArkInnhold<K> {
  const ark = finnKolonner(ws, malkolonner)
  const rader: RaaRad<K>[] = []
  for (let r = 2; r <= ark.sisteRad; r++) {
    const rad = lesRad(ark, r)
    if (harInnhold(rad)) rader.push(rad)
  }
  return { overskrifter: ark.overskrifter, rader }
}

/**
 * Stykkliste: radene fra rad 2 og ned til første rad der både Nivå og Varenummer er tomme, uten
 * grense på 1000 rader. Under den tomme raden leses malens kolonner til siste rad med celler
 * for å finne innhold under den (FR-3). Radene under den, også ned til rad 1001, er tomme.
 */
function lesStykkliste(ws: WorkSheet): NonNullable<RaaArk['stykkliste']> {
  const ark = finnKolonner(ws, STYKKLISTE_KOLONNER)
  const rader: RaaRad<StykklisteKolonne>[] = []
  let r = 2
  for (; ; r++) {
    const rad = lesRad(ark, r)
    if (erTom(rad.celler['Nivå']) && erTom(rad.celler['Varenummer'])) break
    rader.push(rad)
  }

  const tomRad = r
  let tomRadMedInnholdUnder: number | null = null
  for (let under = tomRad + 1; under <= ark.sisteRad; under++) {
    if (harInnhold(lesRad(ark, under))) {
      tomRadMedInnholdUnder = tomRad
      break
    }
  }
  return { overskrifter: ark.overskrifter, rader, tomRadMedInnholdUnder }
}

function erTom(verdi: Celleverdi | undefined): boolean {
  return verdi === null || verdi === undefined
}

// ---------------------------------------------------------------------------
// Celler
// ---------------------------------------------------------------------------

/**
 * Den lagrede verdien i en celle. Tom celle og tekst som er tom etter trimming blir null.
 * En feilverdi blir teksten sin, for eksempel «#N/A». Tall, tekst og sannhetsverdier beholdes,
 * bortsett fra i Nivå og Varenummer, der tall blir String(tall) og tekst trimmes (AD-4).
 */
function celleverdi(celle: CellObject | undefined, somTekst: boolean): Celleverdi {
  const verdi = raaVerdi(celle)
  if (!somTekst) return verdi
  if (typeof verdi === 'number') return String(verdi)
  if (typeof verdi === 'string') return verdi.trim()
  return verdi
}

function raaVerdi(celle: CellObject | undefined): Celleverdi {
  if (!celle) return null
  switch (celle.t) {
    case 'n':
      return typeof celle.v === 'number' ? celle.v : null
    case 's': {
      const tekst = celle.v === undefined || celle.v === null ? '' : String(celle.v)
      return tekst.trim() === '' ? null : tekst
    }
    case 'b':
      return Boolean(celle.v)
    case 'e':
      return celle.w ?? (typeof celle.v === 'number' ? FEILVERDIER[celle.v] : undefined) ?? '#N/A'
    default:
      // 'z' (tom celle med format) og 'd' (dato, kommer ikke uten cellDates)
      return celle.w !== undefined && celle.w.trim() !== '' ? celle.w : null
  }
}
