// Tester for stykklistestrukturen (Story 1.7, AD-6).
// Stykklistene er skrevet av fra testdata/testeksempel-01.xlsx, -02.xlsx og -04.xlsx, og forventningene
// er hentet fra fasitene (Materiell, Regler, Eksepsjoner) og fra PRD-en (FR-3, FR-9, FR-28, FR-31).
// SheetJS er ikke tillatt i denne testen (AD-15), så radene står her som data.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import { byggStruktur } from '../../src/domene/struktur.ts'
import type { Delstype, Nivaa, Stykklisterad } from '../../src/domene/typer.ts'
import { fjernKommentarer } from '../hjelpere/arkitekturregler.ts'

const F: Delstype = 'FERDIGVARE'
const K: Delstype = 'KJOPES_INN'
const P: Delstype = 'PRODUSERES_SELV'

type Linje = [Nivaa, string, string, number | null, Delstype, number | null, number | null, number | null]

/** Lager stykklisterader med Excel-rad fra og med rad 2, slik de står i arket. */
function rader(linjer: Linje[]): Stykklisterad[] {
  return linjer.map(([nivaa, varenummer, beskrivelse, antall, type, lagerbeholdning, sikkerhetslager, ledetid], i) => ({
    excelRad: i + 2,
    nivaa,
    varenummer,
    beskrivelse,
    antall,
    type,
    lagerbeholdning,
    sikkerhetslager,
    ledetid,
  }))
}

const TESTEKSEMPEL_01 = rader([
  ['0', '100-002', 'Kontorstol Basic', null, F, 0, 0, 0],
  ['.1', '300-001', 'Sete', 1, K, 200, 20, 2],
  ['.1', '300-002', 'Rygg', 1, K, 60, 10, 1],
  ['.1', '300-003', 'Hjul', 5, K, 80, 30, 1],
  ['.1', '300-004', 'Armlene', 2, K, 50, 20, 1],
  ['.1', '300-005', 'Gassfjær', 1, K, 75, 10, 2],
  ['.1', '300-006', 'Stolfot', 1, K, 400, 20, 10],
  ['.1', '300-007', 'Skruesett', 4, K, 150, 40, 2],
  ['.1', '300-008', 'Trekk', 1, K, 90, 0, 3],
])

const TESTEKSEMPEL_02 = rader([
  ['0', '100-001', 'Kontorstol Pro', null, F, 20, 5, 1],
  ['.1', '200-001', 'Sete', 1, P, 30, 5, 1],
  ['..2', '300-001', 'Seteplate', 1, K, 120, 10, 2],
  ['..2', '300-002', 'Skruesett M6', 4, K, 400, 50, 1],
  ['.1', '200-002', 'Rygg', 1, P, 85, 5, 1],
  ['..2', '300-002', 'Skruesett M6', 2, K, null, null, null],
  ['..2', '300-003', 'Ryggtrekk', 1, K, 20, 30, 2],
  ['.1', '300-004', 'Hjul', 5, K, 300, 30, 1],
  ['.1', '300-005', 'Gassfjær', 1, K, 400, 10, 12],
])

const TESTEKSEMPEL_04 = rader([
  ['0', '100-003', 'Kontorstol Ergo', null, F, 20, 0, 1],
  ['.1', '200-010', 'Sete', 1, P, 70, 5, 4],
  ['..2', '300-022', 'Skruesett M8', 4, K, 1000, 0, 7],
  ['..2', '300-023', 'Monteringsbrakett', 1, K, 120, 10, 1],
  ['.1', '200-011', 'Rygg', 1, P, 40, 5, 3],
  ['..2', '300-021', 'Ryggplate', 1, K, 400, 10, 7],
  ['..2', '300-022', 'Skruesett M8', 2, K, null, null, null],
  ['.1', '200-012', 'Armlene', 1, P, 20, 0, 1],
  ['..2', '300-024', 'Armlenepute', 1, K, 200, 0, 1],
  ['..2', '300-025', 'Skrue M5', 2, K, 500, 20, 1],
  ['.1', '300-023', 'Monteringsbrakett', 2, K, null, null, null],
  ['.1', '200-012', 'Armlene', 1, P, null, null, null],
  ['..2', '300-025', 'Skrue M5', 2, K, null, null, null],
  ['..2', '300-024', 'Armlenepute', 1, K, null, null, null],
  ['.1', '200-013', 'Fotkryss', 1, P, 300, 0, 2],
  ['..2', '300-029', 'Hjul', 5, K, 2000, 0, 1],
  ['.1', '200-013', 'Fotkryss', 1, P, null, null, null],
  ['.1', '300-026', 'Låseskive', 4, K, 0, 0, 1],
  ['.1', '300-027', 'Trekk', 1, K, 40, 0, 2],
  ['.1', '300-028', 'Hodestøtte', 1, K, 10, 0, 1],
])

function del(rader: Stykklisterad[], varenummer: string) {
  const d = byggStruktur(rader).deler.find((x) => x.varenummer === varenummer)
  if (!d) throw new Error(`Fant ikke ${varenummer}`)
  return d
}

describe('byggStruktur: unike deler og overordnede deler', () => {
  it('slår sammen like varenumre og lar delene stå i stykklisterekkefølge (FR-16)', () => {
    const s = byggStruktur(TESTEKSEMPEL_04)
    expect(s.deler.map((d) => d.varenummer)).toEqual([
      '100-003', '200-010', '300-022', '300-023', '200-011', '300-021', '200-012', '300-024', '300-025',
      '200-013', '300-029', '300-026', '300-027', '300-028',
    ])
  })

  it('overordnet del er nærmeste rad over med ett nivå høyere (testeksempel 02)', () => {
    expect(del(TESTEKSEMPEL_02, '300-001').overordnede).toEqual([{ varenummer: '200-001', antall: 1 }])
    expect(del(TESTEKSEMPEL_02, '300-003').overordnede).toEqual([{ varenummer: '200-002', antall: 1 }])
    expect(del(TESTEKSEMPEL_02, '300-004').overordnede).toEqual([{ varenummer: '100-001', antall: 5 }])
    expect(del(TESTEKSEMPEL_02, '100-001').overordnede).toEqual([])
  })

  it('en felles del har begge overordnede deler med antall og står der den står først (FR-28)', () => {
    const skrue = del(TESTEKSEMPEL_02, '300-002')
    expect(skrue.overordnede).toEqual([
      { varenummer: '200-001', antall: 4 },
      { varenummer: '200-002', antall: 2 },
    ])
    expect(skrue.nivaa).toBe('..2')
    expect(byggStruktur(TESTEKSEMPEL_02).deler.map((d) => d.varenummer)).toEqual([
      '100-001', '200-001', '300-001', '300-002', '200-002', '300-003', '300-004', '300-005',
    ])
  })

  it('henter beskrivelse, type, lager, sikkerhetslager og ledetid fra første rad med varenummeret (FR-28)', () => {
    expect(del(TESTEKSEMPEL_02, '300-002')).toMatchObject({
      beskrivelse: 'Skruesett M6',
      type: 'KJOPES_INN',
      lagerbeholdning: 400,
      sikkerhetslager: 50,
      ledetid: 1,
    })
  })
})

describe('byggStruktur: forekomster og underdeler (FR-3, FR-28)', () => {
  it('en del med underdeler to ganger har underdelene per forekomst, så valideringen kan sammenligne dem', () => {
    const armlene = del(TESTEKSEMPEL_04, '200-012')
    expect(armlene.forekomster).toHaveLength(2)
    expect(armlene.forekomster.map((f) => f.excelRad)).toEqual([9, 13])
    expect(armlene.forekomster[0]?.underdeler).toEqual([
      { varenummer: '300-024', antall: 1, excelRad: 10 },
      { varenummer: '300-025', antall: 2, excelRad: 11 },
    ])
    // Samme underdeler i en annen rekkefølge (fasit 04, Regler).
    expect(armlene.forekomster[1]?.underdeler).toEqual([
      { varenummer: '300-025', antall: 2, excelRad: 14 },
      { varenummer: '300-024', antall: 1, excelRad: 15 },
    ])
    expect(armlene.forekomster[1]?.overordnet).toBe('100-003')
  })

  it('underdeler som står likt under begge forekomstene, regnes én gang (300-024 og 300-025)', () => {
    expect(del(TESTEKSEMPEL_04, '300-024').overordnede).toEqual([{ varenummer: '200-012', antall: 1 }])
    expect(del(TESTEKSEMPEL_04, '300-025').overordnede).toEqual([{ varenummer: '200-012', antall: 2 }])
    expect(del(TESTEKSEMPEL_04, '300-024').antallPerFerdigprodukt).toBe(2)
    expect(del(TESTEKSEMPEL_04, '300-025').antallPerFerdigprodukt).toBe(4)
  })

  it('underdeler som bare står under første forekomst, regnes også én gang (200-013 og 300-029)', () => {
    const fotkryss = del(TESTEKSEMPEL_04, '200-013')
    expect(fotkryss.forekomster.map((f) => f.underdeler.length)).toEqual([1, 0])
    expect(del(TESTEKSEMPEL_04, '300-029').overordnede).toEqual([{ varenummer: '200-013', antall: 5 }])
  })

  it('en del som står to ganger under samme overordnede del, teller to ganger for den delen selv', () => {
    // Fasit 04: bruttobehov for 200-012 og 200-013 er 2 × frigivelsene til 100-003.
    expect(del(TESTEKSEMPEL_04, '200-012').overordnede).toEqual([{ varenummer: '100-003', antall: 2 }])
    expect(del(TESTEKSEMPEL_04, '200-013').overordnede).toEqual([{ varenummer: '100-003', antall: 2 }])
  })

  it('underdeler som bare står under en senere forekomst, regnes også én gang (FR-3: «den første eller en senere»)', () => {
    const s = rader([
      ['0', 'FP', 'Ferdigprodukt', null, F, 0, 0, 1],
      ['.1', 'A', 'Fotkryss', 1, P, 0, 0, 2],
      ['.1', 'A', 'Fotkryss', 1, P, null, null, null],
      ['..2', 'B', 'Hjul', 5, K, 0, 0, 1],
    ])
    const a = del(s, 'A')
    expect(a.forekomster.map((f) => f.underdeler.length)).toEqual([0, 1])
    expect(del(s, 'B').overordnede).toEqual([{ varenummer: 'A', antall: 5 }])
    // A står to ganger under ferdigproduktet, så 2 × 5 Hjul per ferdigprodukt.
    expect(del(s, 'B').antallPerFerdigprodukt).toBe(10)
  })

  it('en del står under begge delene over (300-022 nevner Sete og Rygg)', () => {
    expect(del(TESTEKSEMPEL_04, '300-022').overordnede).toEqual([
      { varenummer: '200-010', antall: 4 },
      { varenummer: '200-011', antall: 2 },
    ])
  })
})

describe('byggStruktur: lavnivåkode og beregningsrekkefølge (AD-6)', () => {
  it('stemmer med kolonnen Lavnivåkode i Materiell i fasit 04', () => {
    const forventet: Record<string, number> = {
      '100-003': 0,
      '200-010': 1, '200-011': 1, '200-012': 1, '200-013': 1, '300-026': 1, '300-027': 1, '300-028': 1,
      '300-022': 2, '300-023': 2, '300-021': 2, '300-024': 2, '300-025': 2, '300-029': 2,
    }
    const faktisk = Object.fromEntries(byggStruktur(TESTEKSEMPEL_04).deler.map((d) => [d.varenummer, d.lavnivaakode]))
    expect(faktisk).toEqual(forventet)
  })

  it('delene står etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge', () => {
    expect(byggStruktur(TESTEKSEMPEL_04).beregningsrekkefolge).toEqual([
      '100-003',
      '200-010', '200-011', '200-012', '200-013', '300-026', '300-027', '300-028',
      '300-022', '300-023', '300-021', '300-024', '300-025', '300-029',
    ])
  })

  it('en del på både .1 og ..2 beregnes etter delene på .1 (FR-28)', () => {
    // 300-023 står på ..2 under Sete og på .1 under ferdigproduktet. Lavnivåkoden er 2.
    expect(del(TESTEKSEMPEL_04, '300-023').lavnivaakode).toBe(2)
    const rekkefolge = byggStruktur(TESTEKSEMPEL_04).beregningsrekkefolge
    for (const v of ['200-010', '200-011', '200-012', '200-013']) {
      expect(rekkefolge.indexOf(v)).toBeLessThan(rekkefolge.indexOf('300-023'))
    }
  })

  it('en overordnet del står før underdelene i beregningsrekkefølgen i alle testeksemplene', () => {
    for (const stykkliste of [TESTEKSEMPEL_01, TESTEKSEMPEL_02, TESTEKSEMPEL_04]) {
      const s = byggStruktur(stykkliste)
      for (const d of s.deler) {
        for (const o of d.overordnede) {
          expect(s.beregningsrekkefolge.indexOf(o.varenummer)).toBeLessThan(s.beregningsrekkefolge.indexOf(d.varenummer))
        }
      }
    }
  })

  it('en overordnet del regnes alltid før underdelene, også når begge står på nivå ..2 et sted', () => {
    // Q (.1) har P (..2). P står også på .1 og har C (..2). Største nivåtall gir P og C begge 2, og C
    // ville stått først (rad 3). Lengste vei gir C 3, så P regnes alltid før C.
    const s = byggStruktur(
      rader([
        ['0', 'FP', 'Ferdigprodukt', null, F, 0, 0, 0],
        ['.1', 'Q', 'Q', 1, P, 0, 0, 1],
        ['..2', 'C', 'C', 1, K, 0, 0, 1],
        ['.1', 'R', 'R', 1, P, 0, 0, 1],
        ['..2', 'P', 'P', 1, P, 0, 0, 1],
        ['.1', 'P', 'P', 1, P, null, null, null],
        ['..2', 'C', 'C', 1, K, null, null, null],
      ]),
    )
    expect(s.deler.find((d) => d.varenummer === 'P')?.lavnivaakode).toBe(2)
    expect(s.deler.find((d) => d.varenummer === 'C')?.lavnivaakode).toBe(3)
    expect(s.beregningsrekkefolge.indexOf('P')).toBeLessThan(s.beregningsrekkefolge.indexOf('C'))
  })
})

describe('byggStruktur: ledetid fra ferdigproduktet (FR-9)', () => {
  it('300-006 Stolfot i testeksempel 01 har ledetid fra ferdigproduktet 10', () => {
    const stolfot = del(TESTEKSEMPEL_01, '300-006')
    expect(stolfot.ledetidFraFerdigproduktet).toBe(10)
    expect(stolfot.stiForLedetid).toEqual(['100-002', '300-006'])
  })

  it('med L = 1, 4 og 5 er ledetiden 10 for underdelen og 5 for delen på nivå .1', () => {
    const s = rader([
      ['0', 'FP', 'Ferdigprodukt', null, F, 0, 0, 1],
      ['.1', 'A', 'Del', 1, P, 0, 0, 4],
      ['..2', 'B', 'Underdel', 1, K, 0, 0, 5],
    ])
    expect(del(s, 'B').ledetidFraFerdigproduktet).toBe(10)
    expect(del(s, 'B').stiForLedetid).toEqual(['FP', 'A', 'B'])
    expect(del(s, 'A').ledetidFraFerdigproduktet).toBe(5)
    expect(del(s, 'FP').ledetidFraFerdigproduktet).toBe(1)
  })

  it('en del som står flere steder får ledetiden fra den lengste stien (300-022 i testeksempel 04)', () => {
    const skrue = del(TESTEKSEMPEL_04, '300-022')
    // Via Sete: 1 + 4 + 7 = 12. Via Rygg: 1 + 3 + 7 = 11.
    expect(skrue.ledetidFraFerdigproduktet).toBe(12)
    expect(skrue.stiForLedetid).toEqual(['100-003', '200-010', '300-022'])
    expect(del(TESTEKSEMPEL_04, '300-021').ledetidFraFerdigproduktet).toBe(11)
  })

  it('ledetiden kan komme fra en senere overordnet del enn den første (300-023 i testeksempel 04)', () => {
    // 300-023 står under ferdigproduktet (1 + 1 = 2) og under Sete (1 + 4 + 1 = 6). Sete står etter i listen,
    // men gir den lengste stien.
    const brakett = del(TESTEKSEMPEL_04, '300-023')
    expect(brakett.ledetidFraFerdigproduktet).toBe(6)
    expect(brakett.stiForLedetid).toEqual(['100-003', '200-010', '300-023'])
  })

  it('ved lik ledetid beholdes den første stien (300-002 i testeksempel 02, 3 uker via begge)', () => {
    const skrue = del(TESTEKSEMPEL_02, '300-002')
    expect(skrue.ledetidFraFerdigproduktet).toBe(3)
    expect(skrue.stiForLedetid).toEqual(['100-001', '200-001', '300-002'])
  })

  it('300-005 Gassfjær i testeksempel 02 har ledetid 1 + 12 = 13', () => {
    expect(del(TESTEKSEMPEL_02, '300-005').ledetidFraFerdigproduktet).toBe(13)
  })
})

describe('byggStruktur: antall per ferdigprodukt (FR-31)', () => {
  it('ferdigproduktet er 1, og delene rett under har antallet på raden', () => {
    expect(del(TESTEKSEMPEL_01, '100-002').antallPerFerdigprodukt).toBe(1)
    expect(del(TESTEKSEMPEL_01, '300-003').antallPerFerdigprodukt).toBe(5)
  })

  it('skruesett M6 er brukt 4 per sete og 2 per rygg (testeksempel 02), så 6 per ferdigprodukt (FR-28)', () => {
    expect(del(TESTEKSEMPEL_02, '300-002').antallPerFerdigprodukt).toBe(6)
  })

  it('multipliserer antallene langs stien og summerer over stedene delen står', () => {
    // 300-022 Skruesett M8: 4 per Sete + 2 per Rygg, og Sete og Rygg er ett stykk hver.
    expect(del(TESTEKSEMPEL_04, '300-022').antallPerFerdigprodukt).toBe(6)
    // 300-023: 2 rett under ferdigproduktet + 1 per Sete.
    expect(del(TESTEKSEMPEL_04, '300-023').antallPerFerdigprodukt).toBe(3)
    // 300-029 Hjul: 5 per Fotkryss, og Fotkryss står to ganger under ferdigproduktet.
    expect(del(TESTEKSEMPEL_04, '300-029').antallPerFerdigprodukt).toBe(10)
  })
})

describe('byggStruktur: kantene', () => {
  it('gir tom struktur for en tom stykkliste', () => {
    expect(byggStruktur([])).toEqual({ deler: [], beregningsrekkefolge: [] })
  })

  it('stopper når delene står under hverandre (en sløyfe), og kaster ikke', () => {
    const s = byggStruktur(
      rader([
        ['0', 'FP', 'Ferdigprodukt', null, F, 0, 0, 1],
        ['.1', 'A', 'A', 1, P, 0, 0, 1],
        ['..2', 'B', 'B', 1, P, 0, 0, 1],
        ['.1', 'B', 'B', 1, P, null, null, null],
        ['..2', 'A', 'A', 1, P, null, null, null],
      ]),
    )
    expect(s.deler.map((d) => d.varenummer)).toEqual(['FP', 'A', 'B'])
    expect(s.beregningsrekkefolge).toHaveLength(3)
  })

  it('endrer ikke radene som er sendt inn', () => {
    const kopi = structuredClone(TESTEKSEMPEL_04)
    byggStruktur(TESTEKSEMPEL_04)
    expect(TESTEKSEMPEL_04).toEqual(kopi)
  })
})

// Vakten for AD-6: bare struktur.ts bygger `Struktur`. Den leter etter at noen bygger en Struktur
// (typet variabel, `as`, `satisfies` eller en funksjon med returtypen Struktur), ikke etter feltnavnet,
// så det å lese `beregningsrekkefolge` eller destrukturere en Struktur gir ikke treff.
// Vakten fanger ikke en Struktur bygd med spread eller en uttypet objektliteral som sendes rett til en
// funksjon. Vil vi ha full sikkerhet, må Struktur gjøres nominell i typer.ts (egen PR, AD-3).
export function finnStrukturKonstruksjon(kode: string): string[] {
  const ren = fjernKommentarer(kode)
  const monstre: [string, RegExp][] = [
    ['as Struktur', /\bas\s+Struktur\b/],
    ['satisfies Struktur', /\bsatisfies\s+Struktur\b/],
    ['const x: Struktur = {', /:\s*Struktur\s*=\s*\{/],
    ['funksjon med returtype Struktur', /\)\s*:\s*Struktur\s*(\{|=>)/],
  ]
  return monstre.filter(([, monster]) => monster.test(ren)).map(([navn]) => navn)
}

describe('byggStruktur: ingen andre bygger Struktur (AD-6)', () => {
  const ROT = join(import.meta.dirname, '..', '..')

  function kildefiler(mappe: string): string[] {
    return readdirSync(mappe).flatMap((navn) => {
      const sti = join(mappe, navn)
      if (statSync(sti).isDirectory()) return kildefiler(sti)
      return /\.(ts|tsx)$/.test(navn) ? [sti] : []
    })
  }

  it('ingen fil i src/ bygger Struktur, bortsett fra struktur.ts (og typer.ts, som bare har typen)', () => {
    const brudd = kildefiler(join(ROT, 'src'))
      .map((sti) => relative(ROT, sti).split(sep).join('/'))
      .filter((sti) => sti !== 'src/domene/struktur.ts' && sti !== 'src/domene/typer.ts')
      .flatMap((sti) =>
        finnStrukturKonstruksjon(readFileSync(join(ROT, sti), 'utf8')).map((hva) => `${sti}: ${hva}`),
      )
    expect(brudd, `Bare src/domene/struktur.ts bygger Struktur (AD-6):\n${brudd.join('\n')}`).toEqual([])
  })

  it('vakten finner bygging, men ikke lesing eller destrukturering', () => {
    expect(finnStrukturKonstruksjon('const s: Struktur = { deler: [], beregningsrekkefolge: [] }')).not.toEqual([])
    expect(finnStrukturKonstruksjon('return { deler: [], beregningsrekkefolge: [] } as Struktur')).not.toEqual([])
    expect(finnStrukturKonstruksjon('const s = {} satisfies Struktur')).not.toEqual([])
    expect(finnStrukturKonstruksjon('function lag(rader: Stykklisterad[]): Struktur {\n  return x\n}')).not.toEqual([])
    expect(finnStrukturKonstruksjon('const lag = (rader: Stykklisterad[]): Struktur => x')).not.toEqual([])

    expect(finnStrukturKonstruksjon('const { deler, beregningsrekkefolge } = struktur')).toEqual([])
    expect(finnStrukturKonstruksjon('for (const v of struktur.beregningsrekkefolge) { bruk(v) }')).toEqual([])
    expect(finnStrukturKonstruksjon('function beregn(struktur: Struktur, h: number) { return struktur.deler }')).toEqual([])
    expect(finnStrukturKonstruksjon('// const s: Struktur = {}\n/* x as Struktur */')).toEqual([])
  })
})
