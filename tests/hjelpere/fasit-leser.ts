// Leser fasitfilene testdata/testeksempel-0N-fasit.xlsx til fasittestene (Story 2.2, AD-15, AD-16).
//
// Denne fila og tests/hjelpere/lag-arbeidsbok.ts er de eneste i tests/ som kan bruke SheetJS
// (SHEETJS_UNNTAK). Den leser bare arkene Fasittabell og Bestillingsforslag. Eksepsjoner,
// Utregning og Kapasitet hører til senere stories.
//
// Arkene i fasitene:
// - Fasittabell: rad 1 er overskriften (Varenummer, Rad, Uke 1 … Uke H). Så kommer seks rader per del
//   og en tom rad mellom delene.
// - Bestillingsforslag: Varenummer, Beskrivelse, Frigivelsesuke, Mengde, Art, Forfalt mengde.
//   Tom forfalt mengde betyr 0. Art er teksten «Innkjøp» eller «Produksjonsordre».
//
// Leseren er streng, så en feil i fasitfilen aldri gir en falsk grønn test: ukekolonnene må være
// Uke 1 … Uke H rett etter Rad, og en rad kan ikke stå to ganger for samme del.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { read, utils, type WorkSheet } from 'xlsx'
import type { Bestillingsforslag, Eksepsjonskode } from '../../src/domene/typer.ts'

const TESTDATA = join(import.meta.dirname, '..', '..', 'testdata')

/** Radnavnene i Fasittabell, i den rekkefølgen de står for hver del (FR-14). */
export const FASITRADER = [
  'Bruttobehov',
  'Planlagte mottak',
  'Forventet lagerbeholdning',
  'Nettobehov',
  'Planlagte ordremottak',
  'Planlagte ordrefrigivelser',
] as const
export type Fasitrad = (typeof FASITRADER)[number]

export type Fasittabell = {
  horisont: number
  /** Varenumrene i den rekkefølgen de står i Fasittabell. */
  deler: string[]
  /** Tallene per del og rad, hver med lengde H. */
  tabell: Map<string, Record<Fasitrad, number[]>>
}

export type Fasit = Fasittabell & { bestillingsforslag: Bestillingsforslag[] }

const ART: Record<string, Bestillingsforslag['art']> = { Innkjøp: 'INNKJOP', Produksjonsordre: 'PRODUKSJONSORDRE' }
const FORSLAG_KOLONNER = ['Varenummer', 'Beskrivelse', 'Frigivelsesuke', 'Mengde', 'Art', 'Forfalt mengde']

/** Stien til testeksempelet, for eksempel `testeksempelSti('01')`. */
export function testeksempelSti(nr: string): string {
  return join(TESTDATA, `testeksempel-${nr}.xlsx`)
}

/** Leser fasiten for testeksempelet `nr` («01»–«05»). Kaster hvis et ark ikke har formen over. */
export function lesFasit(nr: string): Fasit {
  const fil = `testeksempel-${nr}-fasit.xlsx`
  const bok = read(readFileSync(join(TESTDATA, fil)), { type: 'buffer' })
  const ark = (navn: string): unknown[][] => {
    const sheet: WorkSheet | undefined = bok.Sheets[navn]
    if (sheet === undefined) throw new Error(`${fil}: arket ${navn} mangler`)
    return utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false, defval: null })
  }
  return {
    ...tolkFasittabell(fil, ark('Fasittabell')),
    bestillingsforslag: tolkBestillingsforslag(fil, ark('Bestillingsforslag')),
  }
}

/** Tolker radene i arket Fasittabell (rad 1 er overskriften). Ren funksjon, så testene kan gi den rader direkte. */
export function tolkFasittabell(fil: string, rader: readonly (readonly unknown[])[]): Fasittabell {
  const [overskrift, ...tabellrader] = rader
  if (overskrift === undefined || overskrift[0] !== 'Varenummer' || overskrift[1] !== 'Rad') {
    throw new Error(`${fil}: uventet overskrift i Fasittabell`)
  }
  // Ukekolonnene må stå sammenhengende som Uke 1 … Uke H, rett etter Varenummer og Rad.
  const horisont = overskrift.slice(2).filter((c) => typeof c === 'string' && /^Uke [0-9]+$/.test(c)).length
  for (let i = 0; i < horisont; i++) {
    if (overskrift[2 + i] !== `Uke ${i + 1}`) {
      throw new Error(`${fil}: kolonne ${i + 3} i Fasittabell skal være «Uke ${i + 1}», ikke «${String(overskrift[2 + i])}»`)
    }
  }

  const deler: string[] = []
  const tabell = new Map<string, Record<Fasitrad, number[]>>()
  for (const rad of tabellrader) {
    if (rad[0] === null || rad[0] === undefined || rad[0] === '') continue
    const varenummer = String(rad[0]).trim()
    const radnavn = String(rad[1]) as Fasitrad
    if (!FASITRADER.includes(radnavn)) throw new Error(`${fil}: ukjent rad «${radnavn}» for ${varenummer}`)
    const tall = rad.slice(2, 2 + horisont).map((v) => heltall(v, `${fil} ${varenummer} ${radnavn}`))
    if (tall.length !== horisont) throw new Error(`${fil}: ${varenummer} ${radnavn} har ${tall.length} uker, ikke ${horisont}`)

    let del = tabell.get(varenummer)
    if (del === undefined) {
      del = {} as Record<Fasitrad, number[]>
      tabell.set(varenummer, del)
      deler.push(varenummer)
    }
    // En del står bare én gang i Fasittabell (FR-16). En rad som står to ganger, skal ikke slås sammen.
    if (radnavn in del) throw new Error(`${fil}: ${varenummer} har raden «${radnavn}» to ganger`)
    del[radnavn] = tall
  }
  for (const varenummer of deler) {
    const mangler = FASITRADER.filter((r) => !(r in tabell.get(varenummer)!))
    if (mangler.length > 0) throw new Error(`${fil}: ${varenummer} mangler ${mangler.join(', ')}`)
  }
  return { horisont, deler, tabell }
}

/** Tolker radene i arket Bestillingsforslag (rad 1 er overskriften). */
export function tolkBestillingsforslag(fil: string, rader: readonly (readonly unknown[])[]): Bestillingsforslag[] {
  const [overskrift, ...forslagrader] = rader
  if (overskrift === undefined || FORSLAG_KOLONNER.some((navn, i) => overskrift[i] !== navn)) {
    throw new Error(`${fil}: uventet overskrift i Bestillingsforslag`)
  }
  return forslagrader
    .filter((rad) => rad[0] !== null && rad[0] !== undefined && rad[0] !== '')
    .map((rad): Bestillingsforslag => {
      const art = ART[String(rad[4])]
      if (art === undefined) throw new Error(`${fil}: ukjent art «${String(rad[4])}»`)
      return {
        varenummer: String(rad[0]).trim(),
        beskrivelse: String(rad[1]),
        frigivelsesuke: heltall(rad[2], `${fil} frigivelsesuke`),
        mengde: heltall(rad[3], `${fil} mengde`),
        forfaltMengde: rad[5] === null || rad[5] === undefined || rad[5] === '' ? 0 : heltall(rad[5], `${fil} forfalt mengde`),
        art,
      }
    })
}

function heltall(verdi: unknown, hvor: string): number {
  if (typeof verdi !== 'number' || !Number.isInteger(verdi)) throw new Error(`${hvor}: ventet heltall, fikk ${String(verdi)}`)
  return verdi
}

// ---------------------------------------------------------------------------
// Arket Eksepsjoner (Story 2.3, SM-2)
// ---------------------------------------------------------------------------

/** Én eksepsjon i arket Eksepsjoner: varenummer, uke (null for «–», hele delen) og type. Ordlyden sammenlignes ikke (AD-16). */
export type Fasiteksepsjon = { varenummer: string; uke: number | null; kode: Eksepsjonskode }

const KODE_FRA_TYPENAVN: Record<string, Eksepsjonskode> = {
  'Ledetid overskrider horisont': 'LEDETID_OVERSKRIDER_HORISONT',
  'Bestilling forsinket': 'BESTILLING_FORSINKET',
  'Bruk av sikkerhetslager': 'BRUK_AV_SIKKERHETSLAGER',
  'Mottak forsinket': 'MOTTAK_FORSINKET',
  'Kanseller mottak': 'KANSELLER_MOTTAK',
}

const EKSEPSJON_KOLONNER = ['Varenummer', 'Uke', 'Eksepsjonstype', 'Melding']

/** Tolker radene i arket Eksepsjoner (rad 1 er overskriften). Kaster ved ukjent type eller uventet uke. */
export function tolkFasitEksepsjoner(fil: string, rader: readonly (readonly unknown[])[]): Fasiteksepsjon[] {
  const [overskrift, ...eksepsjonsrader] = rader
  if (overskrift === undefined || EKSEPSJON_KOLONNER.some((navn, i) => overskrift[i] !== navn)) {
    throw new Error(`${fil}: uventet overskrift i Eksepsjoner`)
  }
  return eksepsjonsrader
    .filter((rad) => rad[0] !== null && rad[0] !== undefined && rad[0] !== '')
    .map((rad): Fasiteksepsjon => {
      const kode = KODE_FRA_TYPENAVN[String(rad[2])]
      if (kode === undefined) throw new Error(`${fil}: ukjent eksepsjonstype «${String(rad[2])}»`)
      // «–» betyr hele delen (Ledetid overskrider horisont). Ellers må uken være et heltall.
      const uke = rad[1] === '–' ? null : heltall(rad[1], `${fil} uke`)
      return { varenummer: String(rad[0]).trim(), uke, kode }
    })
}

/** Leser arket Eksepsjoner i fasiten for testeksempelet `nr` («01»–«05»), i fasitens rekkefølge. */
export function lesFasitEksepsjoner(nr: string): Fasiteksepsjon[] {
  const fil = `testeksempel-${nr}-fasit.xlsx`
  const bok = read(readFileSync(join(TESTDATA, fil)), { type: 'buffer' })
  const sheet = bok.Sheets['Eksepsjoner']
  if (sheet === undefined) throw new Error(`${fil}: arket Eksepsjoner mangler`)
  return tolkFasitEksepsjoner(fil, utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false, defval: null }))
}
