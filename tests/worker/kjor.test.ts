// Det worker-en gjør med én melding (Story 1.10, AD-5, AD-12), testet med de ekte filene i testdata/ uten en worker.
// Selve worker-en testes i e2e/worker.spec.ts, og styringen i tests/app/kjoring.test.ts.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { kjorFil } from '../../src/worker/kjor.ts'
import { erWorkerSvar, type WorkerSvar } from '../../src/worker/meldinger.ts'
import type { Resultat, Valg } from '../../src/domene/typer.ts'
import { lesFasit, lesFasitEksepsjoner } from '../hjelpere/fasit-leser.ts'

const ROT = join(import.meta.dirname, '..', '..')
const TESTDATA = join(ROT, 'testdata')

function innhold(sti: string): ArrayBuffer {
  const bytes = readFileSync(sti)
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

function svarFor(sti: string, valg: Valg = 'BESTILLINGSPLAN'): WorkerSvar {
  return kjorFil({ innhold: innhold(sti), filnavn: sti.split(/[\\/]/).pop()!, valg })
}

describe('gyldige filer gir GYLDIG', () => {
  it.each([1, 2, 3, 4, 5])('testeksempel 0%s', (n) => {
    const svar = svarFor(join(TESTDATA, `testeksempel-0${n}.xlsx`))
    expect(svar.type).toBe('GYLDIG')
    if (svar.type !== 'GYLDIG') return
    expect(svar.inndata.horisont).toBeGreaterThanOrEqual(8)
    expect(svar.inndata.horisont).toBeLessThanOrEqual(12)
    expect(svar.inndata.stykkliste[0]).toMatchObject({ nivaa: '0', type: 'FERDIGVARE' })
  })

  it('testeksempel 01: Kontorstol Basic (100-002) og H = 10, og kapasiteten er null til Epic 5', () => {
    const svar = svarFor(join(TESTDATA, 'testeksempel-01.xlsx'))
    expect(svar).toMatchObject({ type: 'GYLDIG', kapasitet: null })
    if (svar.type !== 'GYLDIG') return
    expect(svar.inndata.horisont).toBe(10)
    expect(svar.inndata.stykkliste[0]).toMatchObject({ varenummer: '100-002', beskrivelse: 'Kontorstol Basic' })
  })
})

/** Resultatet fra en gyldig kjøring, eller en feil hvis svaret ikke er GYLDIG med resultat. */
function resultatFor(nr: string, valg: Valg = 'BESTILLINGSPLAN'): Resultat {
  const svar = svarFor(join(TESTDATA, `testeksempel-${nr}.xlsx`), valg)
  if (svar.type !== 'GYLDIG' || svar.resultat === null) throw new Error(`Testeksempel ${nr} ga ikke resultat: ${svar.type}`)
  return svar.resultat
}

describe('bestillingsplanen i svaret (Story 2.5, AD-12)', () => {
  it('Bestillingsplan og Begge gir resultat, og bare Produksjonskapasitet gir ingen (FR-30)', () => {
    for (const valg of ['BESTILLINGSPLAN', 'BEGGE'] as const) {
      expect(svarFor(join(TESTDATA, 'testeksempel-01.xlsx'), valg)).toMatchObject({ type: 'GYLDIG', resultat: expect.any(Object) })
    }
    expect(svarFor(join(TESTDATA, 'testeksempel-01.xlsx'), 'PRODUKSJONSKAPASITET')).toMatchObject({ type: 'GYLDIG', resultat: null })
  })

  it('testeksempel 01: 9 deler, 59 bestillingsforslag, og nøyaktig 300-003, 300-004, 300-005 og 300-006 er kritiske', () => {
    const resultat = resultatFor('01')
    expect(resultat.deler).toHaveLength(9)
    expect(resultat.bestillingsforslag).toHaveLength(59)
    expect(resultat.kritiskeDeler).toEqual(['300-003', '300-004', '300-005', '300-006'])
    expect(resultat.eksepsjoner).toHaveLength(4)
    expect(resultat.deler.filter((d) => d.kritisk).map((d) => d.del.varenummer)).toEqual(resultat.kritiskeDeler)
  })

  it('bruttobehovet for 300-003 Hjul i testeksempel 01 er 100, 125, 150, 100, 175, 150, 125, 200, 150, 100 (FR-5)', () => {
    const hjul = resultatFor('01').deler.find((d) => d.del.varenummer === '300-003')!
    expect(hjul.bruttobehov).toEqual([100, 125, 150, 100, 175, 150, 125, 200, 150, 100])
  })

  it.each(['01', '02', '03', '04', '05'])('testeksempel %s: bestillingsforslagene og eksepsjonene er lik arkene i fasiten (SM-1, SM-2)', (nr) => {
    const resultat = resultatFor(nr)
    expect(resultat.bestillingsforslag).toEqual(lesFasit(nr).bestillingsforslag)
    expect(resultat.eksepsjoner.map((e) => ({ varenummer: e.varenummer, uke: e.uke, kode: e.kode }))).toEqual(lesFasitEksepsjoner(nr))
  })

  it('samme fil to ganger gir samme resultat, og svaret kan sendes som en melding (AD-12, FR-8)', () => {
    const fil = join(TESTDATA, 'testeksempel-01.xlsx')
    const første = svarFor(fil)
    expect(svarFor(fil)).toEqual(første)
    expect(structuredClone(første)).toEqual(første)
    expect(erWorkerSvar(første)).toBe(true)
  })

  it('en fil med feil gir ingen resultat, bare feilene (ingen halvt svar, AD-5)', () => {
    const svar = svarFor(join(TESTDATA, 'validering', 'V-F05.xlsx'))
    expect(svar.type).toBe('VALIDERINGSFEIL')
    expect(Object.keys(svar)).toEqual(['type', 'feil'])
  })
})

describe('filfeil (NFR-9)', () => {
  it.each([
    ['V-F04.csv', 'IKKE_XLSX'],
    ['V-F07.xlsx', 'SKADET_FIL'],
    ['V-F08.xlsx', 'TOM_FIL'],
    ['V-F09.xlsx', 'IKKE_EXCEL'],
    ['V-F10.xlsx', 'PASSORDBESKYTTET'],
  ] as const)('%s gir FILFEIL %s', (fil, kode) => {
    expect(svarFor(join(TESTDATA, 'validering', fil))).toEqual({ type: 'FILFEIL', feil: { kode } })
  })
})

describe('valideringsfeil (FR-4)', () => {
  it('V-M01 (−5 i MPS) gir VALIDERINGSFEIL med den ene feilen, og ingen kontroller hoppet over', () => {
    const svar = svarFor(join(TESTDATA, 'validering', 'V-M01.xlsx'))
    expect(svar.type).toBe('VALIDERINGSFEIL')
    if (svar.type !== 'VALIDERINGSFEIL') return
    expect(svar.feil.feil.map((f) => f.kode)).toEqual(['MPS_ANTALL_UGYLDIG'])
    expect(svar.feil.hoppetOver).toEqual([])
  })

  it('V-F01 (arket MPS mangler) gir VALIDERINGSFEIL, og kontrollene som avhenger av MPS er hoppet over', () => {
    const svar = svarFor(join(TESTDATA, 'validering', 'V-F01.xlsx'))
    expect(svar.type).toBe('VALIDERINGSFEIL')
    if (svar.type !== 'VALIDERINGSFEIL') return
    expect(svar.feil.feil.map((f) => f.kode)).toEqual(['ARK_MANGLER'])
    expect(svar.feil.hoppetOver.length).toBeGreaterThan(0)
  })

  // Én test per fil, med filnavnet i testnavnet, så hver fil får sin egen tidsgrense (som i #29/#30).
  const valideringsfiler = readdirSync(join(TESTDATA, 'validering')).filter((f) => /^V-.*.(xlsx|csv)$/.test(f))

  it('testdata/validering/ har mer enn 50 filer', () => {
    expect(valideringsfiler.length).toBeGreaterThan(50)
  })

  it.each(valideringsfiler)('%s gir et svar worker-en kan sende, og aldri UVENTET_FEIL', (fil) => {
    const svar = svarFor(join(TESTDATA, 'validering', fil))
    expect(svar.type).not.toBe('UVENTET_FEIL')
    expect(erWorkerSvar(svar)).toBe(true)
  })
})

describe('svaret er bare data (AD-12)', () => {
  it('kan kopieres med structuredClone, som postMessage gjør, uten å miste noe', () => {
    for (const fil of ['testeksempel-01.xlsx', join('validering', 'V-M01.xlsx'), join('validering', 'V-F08.xlsx')]) {
      const svar = svarFor(join(TESTDATA, fil))
      expect(structuredClone(svar)).toEqual(svar)
    }
  })
})

describe('worker-en har ingen tilgang til lagring eller DOM-en (AD-12)', () => {
  it('ingen fil i src/worker/ bruker localStorage, sessionStorage, document eller window', () => {
    const mappe = join(ROT, 'src', 'worker')
    const filer = readdirSync(mappe).filter((f) => f.endsWith('.ts'))
    expect(filer).toEqual(expect.arrayContaining(['beregning.worker.ts', 'kjor.ts', 'meldinger.ts']))
    for (const fil of filer) {
      const kode = readFileSync(join(mappe, fil), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1')
      expect(kode, fil).not.toMatch(/\b(localStorage|sessionStorage|document|window)\b/)
    }
  })
})

describe('erWorkerSvar', () => {
  it('godtar de fire svarene, og ingenting annet', () => {
    expect(erWorkerSvar({ type: 'UVENTET_FEIL' })).toBe(true)
    expect(erWorkerSvar({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } })).toBe(true)
    expect(erWorkerSvar({ type: 'VALIDERINGSFEIL', feil: { feil: [], hoppetOver: [] } })).toBe(true)
    expect(erWorkerSvar({ type: 'GYLDIG', inndata: { stykkliste: [], horisont: 8 }, resultat: null, kapasitet: null })).toBe(true)
    const feil = [
      null,
      undefined,
      'GYLDIG',
      3,
      [],
      {},
      { type: 'ANNET' },
      { type: 'GYLDIG' },
      { type: 'GYLDIG', inndata: {} },
      { type: 'FILFEIL' },
      { type: 'VALIDERINGSFEIL', feil: {} },
    ]
    for (const verdi of feil) expect(erWorkerSvar(verdi), JSON.stringify(verdi)).toBe(false)
  })
})
