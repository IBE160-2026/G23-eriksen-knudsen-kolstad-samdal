// Kontrollen av arket Stykkliste med de ekte filene i testdata/ (Story 1.8, FR-3, FR-4, SM-4, AD-16).
// Filene leses med excel/les.ts og valideres med `valider`. Hver V-S-fil gir nøyaktig én valideringsfeil
// med arket, stedet og feltet i testdata/validering/README.md, og ingen andre feil i filen.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { RaaArk, Valideringskode, Valideringsresultat } from '../../src/domene/typer.ts'
import { valider } from '../../src/domene/valider.ts'
import { les } from '../../src/excel/les.ts'
import { somIFasit, valideringsfasit } from '../hjelpere/valideringsfasit.ts'

const TESTDATA = join(import.meta.dirname, '..', '..', 'testdata')
const VALIDERING = join(TESTDATA, 'validering')

function lesFil(sti: string): RaaArk {
  const utfall = les(readFileSync(sti), sti.split(/[\\/]/).pop()!)
  if (!utfall.ok) throw new Error(`${sti}: ventet RaaArk, fikk ${utfall.feil.kode}`)
  return utfall.verdi
}

function ugyldig(fil: string): Valideringsresultat {
  const utfall = valider(lesFil(join(VALIDERING, fil)))
  if (utfall.ok) throw new Error(`${fil}: ventet valideringsfeil, fikk Inndata`)
  return utfall.feil
}

function fasitliste(fil: string): { ark: string; sted: string; felt: string }[] {
  const fasit = valideringsfasit(fil)
  return fasit.ark.map((ark, i) => ({ ark, sted: fasit.sted[i]!, felt: fasit.felt[i]! }))
}

/** Koden hver fil skal gi (README-en har ark, sted og felt, men ikke koden). */
const KODER: Record<string, Valideringskode> = {
  'V-S01': 'RADER_IKKE_SAMMENHENGENDE',
  'V-S02': 'RADER_INGEN_NIVAA_1',
  'V-S03': 'RADER_FOR_MANGE',
  'V-S04': 'NIVAA_UGYLDIG',
  'V-S05': 'NIVAA_FORSTE_RAD_IKKE_0',
  'V-S06': 'NIVAA_FLERE_NIVAA_0',
  'V-S07': 'NIVAA_2_UTEN_NIVAA_1_OVER',
  'V-S08': 'VARENUMMER_MANGLER',
  'V-S09': 'VARENUMMER_UNDER_SEG_SELV',
  'V-S10': 'BESKRIVELSE_MANGLER',
  'V-S11': 'BESKRIVELSE_ULIK',
  'V-S12': 'ANTALL_FYLT_UT_FOR_NIVAA_0',
  'V-S13': 'ANTALL_MANGLER',
  'V-S14': 'ANTALL_UGYLDIG',
  'V-S15': 'ANTALL_UGYLDIG',
  'V-S16': 'ANTALL_UGYLDIG',
  'V-S17': 'TYPE_UGYLDIG',
  'V-S18': 'TYPE_FERDIGVARE_IKKE_NIVAA_0',
  'V-S19': 'TYPE_NIVAA_0_IKKE_FERDIGVARE',
  'V-S20': 'TYPE_ULIK',
  'V-S21': 'TYPE_KJOPES_INN_HAR_UNDERDELER',
  'V-S22': 'UNDERDELER_ULIKE',
  'V-S23': 'LAGERBEHOLDNING_UGYLDIG',
  'V-S24': 'SIKKERHETSLAGER_UGYLDIG',
  'V-S25': 'LAGERBEHOLDNING_MANGLER',
  'V-S26': 'LAGERBEHOLDNING_FYLT_UT_SENERE',
  'V-S27': 'LEDETID_UGYLDIG',
  'V-S28': 'LEDETID_MANGLER',
  'V-S29': 'LEDETID_FYLT_UT_SENERE',
}

describe('én regel brutt i Stykkliste: nøyaktig feilen README-en oppgir', () => {
  it('README-en har alle 29 filene, og testen kjenner koden for hver', () => {
    expect(Object.keys(KODER)).toHaveLength(29)
    for (const navn of Object.keys(KODER)) expect(valideringsfasit(`${navn}.xlsx`).antall, navn).toBe(1)
  })

  it.each(Object.entries(KODER))('%s gir én feil med koden %s', (navn, kode) => {
    const fil = `${navn}.xlsx`
    const resultat = ugyldig(fil)
    expect(resultat.feil.map(somIFasit), `${fil}: ark, sted og felt`).toEqual(fasitliste(fil))
    expect(resultat.feil.map((f) => f.kode), `${fil}: koden`).toEqual([kode])
  })
})

describe('detaljene i feilene', () => {
  const feilI = (fil: string) => ugyldig(`${fil}.xlsx`).feil[0]!

  it('V-S01: feilen står på den tomme raden, og radene under leses ikke', () => {
    expect(feilI('V-S01').sted).toEqual({ type: 'RAD', excelRad: 9 })
  })

  it('V-S03: 1001 rader gir feilen på rad 1002', () => {
    expect(feilI('V-S03').sted).toEqual({ type: 'RAD', excelRad: 1002 })
  })

  it('V-S05 og V-S19 gir ingen ekstra feil for at det ikke finnes en rad med typen Ferdigvare', () => {
    expect(ugyldig('V-S05.xlsx').feil).toHaveLength(1)
    expect(ugyldig('V-S19.xlsx').feil).toHaveLength(1)
  })

  it('V-S11 og V-S20: den andre forekomsten er feil, og første rad med varenummeret oppgis', () => {
    expect(feilI('V-S11')).toMatchObject({ varenummer: '300-002', andreRader: [5], verdi: 'Skruesett M8' })
    expect(feilI('V-S20')).toMatchObject({ varenummer: '300-002', andreRader: [5] })
  })

  it('V-S21: delen som kjøpes inn, og radene med underdelene den ikke skal ha', () => {
    expect(feilI('V-S21')).toMatchObject({ varenummer: '200-001', andreRader: [4, 5], verdi: 'Komponent (Kjøpes inn)' })
  })

  it('V-S22: nevner varenummeret og begge forekomstene (rad 3 og 11), og peker på rad 12', () => {
    expect(feilI('V-S22')).toMatchObject({
      sted: { type: 'RAD', excelRad: 12 },
      felt: 'Underdeler',
      varenummer: '200-001',
      andreRader: [3, 11],
    })
  })

  it('V-S26 og V-S29: første rad med varenummeret oppgis', () => {
    expect(feilI('V-S26')).toMatchObject({ varenummer: '300-002', andreRader: [5], verdi: 10 })
    expect(feilI('V-S29')).toMatchObject({ varenummer: '300-002', andreRader: [5], verdi: 1 })
  })

  it('verdien i cellen følger med: «fem», 1,5, −5 og 2,5', () => {
    expect(feilI('V-S16').verdi).toBe('fem')
    expect(feilI('V-S15').verdi).toBe(1.5)
    expect(feilI('V-S23').verdi).toBe(-5)
    expect(feilI('V-S24').verdi).toBe(2.5)
  })
})

describe('gyldige filer', () => {
  it('V-G04: del med underdeler to ganger, likt og bare første gang, gir 0 feil', () => {
    expect(valideringsfasit('V-G04.xlsx').antall).toBe(0)
    expect(valider(lesFil(join(VALIDERING, 'V-G04.xlsx'))).ok).toBe(true)
  })

  it.each(['V-G01.xlsx', 'V-G02.xlsx', 'V-G03.xlsx', 'V-G05.xlsx'])('%s gir 0 feil (formler i hjelpekolonnene er ikke innhold)', (fil) => {
    expect(valider(lesFil(join(VALIDERING, fil))).ok).toBe(true)
  })

  it.each([1, 2, 3, 4, 5])('testeksempel 0%s gir 0 feil', (n) => {
    expect(valider(lesFil(join(TESTDATA, `testeksempel-0${n}.xlsx`))).ok).toBe(true)
  })
})

describe('flere feil i samme fil (FR-4)', () => {
  it('V-F05: antall 0 på Stykkliste (D9), MPS (uke 3) og Planlagte mottak (B2), i den rekkefølgen', () => {
    const resultat = ugyldig('V-F05.xlsx')
    expect(resultat.feil.map(somIFasit)).toEqual(fasitliste('V-F05.xlsx'))
    expect(resultat.feil.map((f) => f.kode)).toEqual(['ANTALL_UGYLDIG', 'MPS_ANTALL_UGYLDIG', 'MOTTAK_UKE_UTENFOR_HORISONT'])
  })

  it('V-F06: ledetid hoppes over når overskriften mangler, så bare H1 og mottaket i C3 gir feil', () => {
    const resultat = ugyldig('V-F06.xlsx')
    expect(resultat.feil.map(somIFasit)).toEqual(fasitliste('V-F06.xlsx'))
    expect(resultat.feil.map((f) => f.kode)).toEqual(['OVERSKRIFT_MANGLER', 'MOTTAK_ANTALL_UGYLDIG'])
  })
})
