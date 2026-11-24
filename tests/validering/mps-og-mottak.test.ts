// Kontrollen av MPS og Planlagte mottak og den samlede valider med de ekte filene i testdata/
// (Story 1.9, FR-3, FR-4). Filene leses med excel/les.ts og sammenlignes med testdata/validering/README.md.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Inndata, RaaArk, Valideringsresultat } from '../../src/domene/typer.ts'
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

function gyldig(sti: string): Inndata {
  const utfall = valider(lesFil(sti))
  if (!utfall.ok) throw new Error(`${sti}: ventet Inndata, fikk ${JSON.stringify(utfall.feil.feil)}`)
  return utfall.verdi
}

function ugyldig(sti: string): Valideringsresultat {
  const utfall = valider(lesFil(sti))
  if (utfall.ok) throw new Error(`${sti}: ventet valideringsfeil, fikk Inndata`)
  return utfall.feil
}

function fasitliste(fil: string): { ark: string; sted: string; felt: string }[] {
  const fasit = valideringsfasit(fil)
  return fasit.ark.map((ark, i) => ({ ark, sted: fasit.sted[i], felt: fasit.felt[i] }))
}

describe('én feil i MPS eller Planlagte mottak: nøyaktig feilen README-en oppgir', () => {
  it.each(['V-M01', 'V-M02', 'V-M03', 'V-M04', 'V-M05', 'V-P01', 'V-P02', 'V-P03', 'V-P04'])('%s', (navn) => {
    const fil = `${navn}.xlsx`
    const forventet = fasitliste(fil)
    expect(forventet).toHaveLength(1)
    expect(ugyldig(join(VALIDERING, fil)).feil.map(somIFasit)).toEqual(forventet)
  })

  it('kodene er de README-en beskriver', () => {
    const koder = (navn: string): string[] => ugyldig(join(VALIDERING, `${navn}.xlsx`)).feil.map((f) => f.kode)
    expect(koder('V-M01')).toEqual(['MPS_ANTALL_UGYLDIG'])
    expect(koder('V-M02')).toEqual(['MPS_UKE_ETTER_HULL'])
    expect(koder('V-M03')).toEqual(['MPS_HORISONT_UGYLDIG'])
    expect(koder('V-M04')).toEqual(['MPS_ANTALL_UGYLDIG'])
    expect(koder('V-M05')).toEqual(['MPS_ANTALL_UGYLDIG'])
    expect(koder('V-P01')).toEqual(['MOTTAK_VARENUMMER_UKJENT'])
    expect(koder('V-P02')).toEqual(['MOTTAK_UKE_UTENFOR_HORISONT'])
    expect(koder('V-P03')).toEqual(['MOTTAK_UKE_UTENFOR_HORISONT'])
    expect(koder('V-P04')).toEqual(['MOTTAK_ANTALL_UGYLDIG'])
  })
})

describe('flere feil (FR-4)', () => {
  it('V-F05: MPS-feilen i uke 3 og mottaksfeilen i B2 finnes, og ingen andre MPS- eller mottaksfeil', () => {
    const forventet = fasitliste('V-F05.xlsx')
    // Bare feilene utenfor Stykkliste: Story 1.8 legger til Stykkliste-reglene (D9, antall mangler).
    const funnet = ugyldig(join(VALIDERING, 'V-F05.xlsx')).feil.map(somIFasit).filter((f) => f.ark !== 'Stykkliste')
    expect(funnet).toEqual(forventet.filter((f) => f.ark !== 'Stykkliste'))
    expect(funnet).toEqual([
      { ark: 'MPS', sted: 'uke 3', felt: 'Antall per uke' },
      { ark: 'Planlagte mottak', sted: 'B2', felt: 'Uke' },
    ])
  })

  it('V-F06: strukturfeilen i H1 og mottaksfeilen i C3, i den rekkefølgen', () => {
    const resultat = ugyldig(join(VALIDERING, 'V-F06.xlsx'))
    expect(resultat.feil.map(somIFasit)).toEqual(fasitliste('V-F06.xlsx'))
    expect(resultat.feil.map((f) => f.kode)).toEqual(['OVERSKRIFT_MANGLER', 'MOTTAK_ANTALL_UGYLDIG'])
    expect(resultat.hoppetOver.map((h) => `${h.ark} › ${h.felt}`)).toEqual(['Stykkliste › Ledetid (uker)'])
  })
})

describe('gyldige filer gir Inndata', () => {
  it.each(['V-G01.xlsx', 'V-G02.xlsx', 'V-G03.xlsx'])('%s er gyldig i README-en og gir Inndata', (fil) => {
    expect(valideringsfasit(fil).antall).toBe(0)
    expect(() => gyldig(join(VALIDERING, fil))).not.toThrow()
  })

  it('V-G01 har H = 8 og V-G02 H = 12, med prognostiserteBehov av lengde H', () => {
    for (const [fil, h] of [
      ['V-G01.xlsx', 8],
      ['V-G02.xlsx', 12],
    ] as const) {
      const inndata = gyldig(join(VALIDERING, fil))
      expect(inndata.horisont, fil).toBe(h)
      expect(inndata.prognostiserteBehov, fil).toHaveLength(h)
    }
  })

  it('V-G03: tomt ark Planlagte mottak gir ingen mottak', () => {
    expect(gyldig(join(VALIDERING, 'V-G03.xlsx')).planlagteMottak).toEqual([])
  })

  it.each([1, 2, 3, 4, 5])('testeksempel 0%s er gyldig', (n) => {
    const inndata = gyldig(join(TESTDATA, `testeksempel-0${n}.xlsx`))
    expect(inndata.prognostiserteBehov).toHaveLength(inndata.horisont)
    expect(inndata.horisont).toBeGreaterThanOrEqual(8)
    expect(inndata.horisont).toBeLessThanOrEqual(12)
  })

  it('testeksempel 01: 9 stykklisterader (rad 2–10) med typene som koder, H = 10 og to mottak som enkeltlinjer', () => {
    const inndata = gyldig(join(TESTDATA, 'testeksempel-01.xlsx'))
    expect(inndata.stykkliste.map((r) => r.excelRad)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(inndata.stykkliste[0]).toMatchObject({ nivaa: '0', varenummer: '100-002', type: 'FERDIGVARE', antall: null })
    for (const rad of inndata.stykkliste) expect(['FERDIGVARE', 'KJOPES_INN', 'PRODUSERES_SELV']).toContain(rad.type)
    expect(inndata.horisont).toBe(10)
    expect(inndata.prognostiserteBehov[0]).toBe(20)
    expect(inndata.prognostiserteBehov).toEqual([20, 25, 30, 20, 35, 30, 25, 40, 30, 20])
    expect(inndata.planlagteMottak).toEqual([
      { varenummer: '300-005', uke: 4, antall: 100, excelRad: 2 },
      { varenummer: '300-007', uke: 2, antall: 120, excelRad: 3 },
    ])
  })
})
