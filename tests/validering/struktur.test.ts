// Kontrollen av malens struktur med de ekte filene i testdata/ (Story 1.6, FR-2).
// Filene leses med excel/les.ts og sammenlignes med testdata/validering/README.md.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { RaaArk } from '../../src/domene/typer.ts'
import { validerStruktur } from '../../src/domene/valider.ts'
import { les } from '../../src/excel/les.ts'
import { somIFasit, valideringsfasit } from '../hjelpere/valideringsfasit.ts'

const TESTDATA = join(import.meta.dirname, '..', '..', 'testdata')
const VALIDERING = join(TESTDATA, 'validering')

/** Feltene README-en bruker for strukturfeil (FR-2). */
const STRUKTURFELT = new Set(['Ark', 'Overskrift'])

function lesFil(sti: string): RaaArk {
  const utfall = les(readFileSync(sti), sti.split(/[\\/]/).pop()!)
  if (!utfall.ok) throw new Error(`${sti}: ventet RaaArk, fikk ${utfall.feil.kode}`)
  return utfall.verdi
}

describe('strukturfeilene i testdata/validering/ stemmer med README-en', () => {
  it.each(['V-F01.xlsx', 'V-F02.xlsx', 'V-F03.xlsx', 'V-F06.xlsx'])('%s', (fil) => {
    const fasit = valideringsfasit(fil)
    // Bare strukturfeilene i fasiten. Verdifeilen i V-F06 (C3) er Story 1.9 sin.
    const forventet = fasit.ark
      .map((ark, i) => ({ ark, sted: fasit.sted[i], felt: fasit.felt[i] }))
      .filter((f) => STRUKTURFELT.has(f.felt))
    expect(forventet.length, `${fil}: README har ingen strukturfeil`).toBeGreaterThan(0)

    const resultat = validerStruktur(lesFil(join(VALIDERING, fil)))
    expect(resultat.feil.map(somIFasit)).toEqual(forventet)
  })

  it('V-F01: MPS mangler, og ukene i Planlagte mottak hoppes over', () => {
    const resultat = validerStruktur(lesFil(join(VALIDERING, 'V-F01.xlsx')))
    expect(resultat.feil.map((f) => f.kode)).toEqual(['ARK_MANGLER'])
    expect(resultat.hoppetOver.map((h) => `${h.ark} › ${h.felt}`)).toEqual([
      'MPS › Uke',
      'MPS › Antall ferdigprodukter',
      'Planlagte mottak › Uke',
    ])
  })

  it('V-F02 og V-F06: bare feilen i H1, felt «Ledetid (uker)»', () => {
    for (const fil of ['V-F02.xlsx', 'V-F06.xlsx']) {
      const resultat = validerStruktur(lesFil(join(VALIDERING, fil)))
      expect(resultat.feil, fil).toEqual([
        { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', sted: { type: 'OVERSKRIFT', celle: 'H1' }, felt: 'Ledetid (uker)' },
      ])
    }
  })

  it('V-F03: gammel mal gir GAMMEL_MAL og ingen ARK_MANGLER', () => {
    const resultat = validerStruktur(lesFil(join(VALIDERING, 'V-F03.xlsx')))
    expect(resultat.feil.map((f) => f.kode)).toEqual(['GAMMEL_MAL'])
  })
})

describe('gyldige filer har malens struktur', () => {
  const testeksempler = [1, 2, 3, 4, 5].map((n) => join(TESTDATA, `testeksempel-0${n}.xlsx`))
  const gyldige = ['V-G01.xlsx', 'V-G02.xlsx', 'V-G03.xlsx', 'V-G04.xlsx', 'V-G05.xlsx']

  it.each([...testeksempler, ...gyldige.map((f) => join(VALIDERING, f))])('%s: 0 feil, ingenting hoppes over', (sti) => {
    expect(validerStruktur(lesFil(sti))).toEqual({ feil: [], hoppetOver: [] })
  })

  it.each(gyldige)('%s er gyldig i README-en', (fil) => {
    expect(valideringsfasit(fil).antall).toBe(0)
  })
})

describe('valideringsfilene for verdier (V-S, V-M, V-P, V-F05) har ingen strukturfeil', () => {
  const filer = readdirSync(VALIDERING).filter((f) => /^V-(S|M|P)\d+\.xlsx$/.test(f) || f === 'V-F05.xlsx')

  it('det er mer enn 30 slike filer', () => {
    expect(filer.length).toBeGreaterThan(30)
  })

  // Én test per fil, med filnavnet i testnavnet, så hver fil får sin egen tidsgrense (#29).
  it.each(filer)('%s har ingen strukturfeil', (fil) => {
    expect(validerStruktur(lesFil(join(VALIDERING, fil))), fil).toEqual({ feil: [], hoppetOver: [] })
  })
})

describe('valideringsfasit leser README-linjene', () => {
  it('flere feil står i samme rekkefølge i Ark, Sted og Felt (V-F05)', () => {
    expect(valideringsfasit('V-F05.xlsx')).toEqual({
      antall: 3,
      ark: ['Stykkliste', 'MPS', 'Planlagte mottak'],
      sted: ['D9', 'uke 3', 'B2'],
      felt: ['Antall', 'Antall per uke', 'Uke'],
    })
  })

  it('hele arket er «–», og avviste filer har ingen feil', () => {
    expect(valideringsfasit('V-F01.xlsx')).toEqual({ antall: 1, ark: ['MPS'], sted: ['–'], felt: ['Ark'] })
    expect(valideringsfasit('V-F07.xlsx')).toEqual({ antall: 'avvist', ark: [], sted: [], felt: [] })
  })

  it('en fil som ikke står i README-en, gir en tydelig feil', () => {
    expect(() => valideringsfasit('V-X99.xlsx')).toThrow('V-X99.xlsx mangler')
  })
})
