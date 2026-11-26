// Leser fasitfilene testdata/testeksempel-NN-fasit.xlsx til fasittestene (AD-15, AD-16, SM-1, SM-2).
//
// Denne fila og tests/hjelpere/lag-arbeidsbok.ts er de eneste i tests/ som kan bruke SheetJS (SHEETJS_UNNTAK).
// Fasitene er laget med lag_testdata.py og kontrollert for hånd. De leses her, så ingen tall er skrevet av for hånd i testene.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { read, utils } from 'xlsx'
import type { Eksepsjonskode } from '../../src/domene/typer.ts'

const TESTDATA = join(import.meta.dirname, '..', '..', 'testdata')

/** Radnavnene i arket Fasittabell. */
export type Fasittrad =
  | 'Bruttobehov'
  | 'Planlagte mottak'
  | 'Forventet lagerbeholdning'
  | 'Nettobehov'
  | 'Planlagte ordremottak'
  | 'Planlagte ordrefrigivelser'

/** Én eksepsjon i arket Eksepsjoner: varenummer, uke (null for «–», hele delen) og type. Ordlyden sammenlignes ikke (AD-16). */
export type Fasiteksepsjon = { varenummer: string; uke: number | null; kode: Eksepsjonskode }

const KODE_FRA_TYPENAVN: Record<string, Eksepsjonskode> = {
  'Ledetid overskrider horisont': 'LEDETID_OVERSKRIDER_HORISONT',
  'Bestilling forsinket': 'BESTILLING_FORSINKET',
  'Bruk av sikkerhetslager': 'BRUK_AV_SIKKERHETSLAGER',
  'Mottak forsinket': 'MOTTAK_FORSINKET',
  'Kanseller mottak': 'KANSELLER_MOTTAK',
}

function ark(nr: string, navn: string): unknown[][] {
  const bok = read(readFileSync(join(TESTDATA, `testeksempel-${nr}-fasit.xlsx`)))
  const regneark = bok.Sheets[navn]
  if (regneark === undefined) throw new Error(`Fasit ${nr} har ikke arket ${navn}`)
  return utils.sheet_to_json<unknown[]>(regneark, { header: 1, defval: null })
}

/** Arket Fasittabell: seks serier per varenummer, i stykklisterekkefølge. */
export function lesFasittabell(nr: string): Map<string, Record<Fasittrad, number[]>> {
  const deler = new Map<string, Record<string, number[]>>()
  for (const rad of ark(nr, 'Fasittabell').slice(1)) {
    const [varenummer, radnavn, ...uker] = rad as [string | null, string | null, ...(number | null)[]]
    if (!varenummer || !radnavn) continue
    const serier = deler.get(varenummer) ?? {}
    serier[radnavn] = uker.filter((x): x is number => x !== null)
    deler.set(varenummer, serier)
  }
  return deler as Map<string, Record<Fasittrad, number[]>>
}

/** Arket Eksepsjoner i fasitens rekkefølge. */
export function lesFasitEksepsjoner(nr: string): Fasiteksepsjon[] {
  return ark(nr, 'Eksepsjoner')
    .slice(1)
    .filter((rad) => rad[0])
    .map((rad) => {
      const typenavn = String(rad[2])
      const kode = KODE_FRA_TYPENAVN[typenavn]
      if (kode === undefined) throw new Error(`Ukjent eksepsjonstype i fasit ${nr}: ${typenavn}`)
      return { varenummer: String(rad[0]), uke: typeof rad[1] === 'number' ? rad[1] : null, kode }
    })
}
