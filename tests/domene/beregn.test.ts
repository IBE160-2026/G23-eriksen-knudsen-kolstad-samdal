// Enhetstester for beregningen nivå for nivå (Story 2.2, FR-5, FR-8, FR-17, FR-28, AD-6–AD-8).
// Små stykklister står her som data. SheetJS er ikke tillatt i denne testen (AD-15).
// Alle tallene for testeksempel 01–05 sammenlignes med fasitene i tests/fasit/bestillingsplan.test.ts.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { beregnBestillingsplan } from '../../src/domene/beregn.ts'
import { byggStruktur } from '../../src/domene/struktur.ts'
import type { Delstype, Inndata, Nivaa, PlanlagtMottak, Resultat, Struktur, Stykklisterad } from '../../src/domene/typer.ts'
import { fjernKommentarer } from '../hjelpere/arkitekturregler.ts'

const F: Delstype = 'FERDIGVARE'
const K: Delstype = 'KJOPES_INN'
const P: Delstype = 'PRODUSERES_SELV'

/** [nivå, varenummer, antall, type, lager, SS, ledetid]. Lager, SS og ledetid er null etter første gang. */
type Linje = [Nivaa, string, number | null, Delstype, number | null, number | null, number | null]

function inndata(linjer: Linje[], prognostiserteBehov: number[], planlagteMottak: PlanlagtMottak[] = []): Inndata {
  const stykkliste: Stykklisterad[] = linjer.map(([nivaa, varenummer, antall, type, lager, ss, ledetid], i) => ({
    excelRad: i + 2,
    nivaa,
    varenummer,
    beskrivelse: `Del ${varenummer}`,
    antall,
    type,
    lagerbeholdning: lager,
    sikkerhetslager: ss,
    ledetid,
  }))
  return { stykkliste, horisont: prognostiserteBehov.length, prognostiserteBehov, planlagteMottak }
}

function beregn(data: Inndata): Resultat {
  return beregnBestillingsplan(data, byggStruktur(data.stykkliste))
}

function del(resultat: Resultat, varenummer: string) {
  const funnet = resultat.deler.find((d) => d.del.varenummer === varenummer)
  if (funnet === undefined) throw new Error(`${varenummer} mangler i resultatet`)
  return funnet
}

const MPS = [20, 25, 30, 20, 35, 30, 25, 40]

describe('ferdigproduktet', () => {
  const resultat = beregn(inndata([['0', 'FP', null, F, 0, 0, 0], ['.1', 'A', 1, K, 0, 0, 1]], MPS))
  const fp = del(resultat, 'FP')

  it('bruttobehovet er prognostiserte behov, og med L = 0 er frigivelsene lik MPS (FR-5)', () => {
    expect(fp.bruttobehov).toEqual(MPS)
    expect(fp.planlagteOrdrefrigivelser).toEqual(MPS)
  })

  it('Utregning har prognostiserte behov og ingen bruttobehov fra overordnede deler (AD-8)', () => {
    expect(fp.utregning.map((u) => u.prognostiserteBehov)).toEqual(MPS)
    expect(fp.utregning.every((u) => u.bruttobehovFra.length === 0)).toBe(true)
  })

  it('andre deler har prognostiserte behov null i Utregning', () => {
    expect(del(resultat, 'A').utregning.every((u) => u.prognostiserteBehov === null)).toBe(true)
  })
})

describe('bruttobehov fra overordnede deler (FR-5)', () => {
  it('er frigivelsen til den overordnede delen × antall', () => {
    const resultat = beregn(inndata([['0', 'FP', null, F, 0, 0, 0], ['.1', 'HJUL', 5, K, 80, 30, 1]], MPS))
    expect(del(resultat, 'HJUL').bruttobehov).toEqual(MPS.map((m) => m * 5))
  })

  it('har ledetiden til den overordnede delen med: L = 1 flytter behovet én uke fram', () => {
    // Lager 1000 på ferdigproduktet hadde dekket alt. Lager 0, SS 0 og L 1 gir frigivelse uke t − 1.
    const resultat = beregn(inndata([['0', 'FP', null, F, 0, 0, 1], ['.1', 'A', 2, K, 0, 0, 1]], MPS))
    const fp = del(resultat, 'FP')
    expect(fp.forfaltMengde).toBe(20)
    expect(fp.planlagteOrdrefrigivelser).toEqual([45, 30, 20, 35, 30, 25, 40, 0])
    expect(del(resultat, 'A').bruttobehov).toEqual([90, 60, 40, 70, 60, 50, 80, 0])
  })

  it('en del på nivå ..2 får behov fra delen over, ikke fra prognostiserte behov', () => {
    const resultat = beregn(
      inndata([['0', 'FP', null, F, 0, 0, 0], ['.1', 'A', 1, P, 0, 0, 2], ['..2', 'B', 3, K, 0, 0, 1]], MPS),
    )
    // A: lager 0, L 2. Ordremottak = MPS. Uke 1 og 2 er forfalte: 20 + 25 + 30 (uke 3) i uke 1.
    expect(del(resultat, 'A').planlagteOrdrefrigivelser).toEqual([75, 20, 35, 30, 25, 40, 0, 0])
    expect(del(resultat, 'B').bruttobehov).toEqual([225, 60, 105, 90, 75, 120, 0, 0])
  })

  it('en forfalt frigivelse på nivå .1 gir bruttobehov i uke 1 for delene under (FR-8)', () => {
    // A: lager 0, L 2. Ordremottak i uke 1 og 2 er forfalt og ligger i frigivelsen i uke 1.
    const resultat = beregn(
      inndata([['0', 'FP', null, F, 0, 0, 0], ['.1', 'A', 1, P, 0, 0, 2], ['..2', 'B', 2, K, 1000, 0, 1]], MPS),
    )
    const a = del(resultat, 'A')
    expect(a.forfaltMengde).toBe(45)
    expect(a.planlagteOrdrefrigivelser[0]).toBe(45 + 30)
    expect(del(resultat, 'B').bruttobehov[0]).toBe((45 + 30) * 2)
    expect(del(resultat, 'B').utregning[0].bruttobehovFra).toEqual([{ varenummer: 'A', frigivelse: 75, antall: 2 }])
  })
})

describe('felles deler (FR-28)', () => {
  // C står under både A (4 per A) og B (2 per B), som i 300-002 Skruesett M6 i testeksempel 02.
  const data = inndata(
    [
      ['0', 'FP', null, F, 0, 0, 0],
      ['.1', 'A', 1, P, 0, 0, 1],
      ['..2', 'C', 4, K, 100, 10, 1],
      ['.1', 'B', 1, P, 0, 0, 2],
      ['..2', 'C', 2, K, null, null, null],
    ],
    MPS,
  )
  const resultat = beregn(data)

  it('har én DelResultat, der den står første gang', () => {
    expect(resultat.deler.map((d) => d.del.varenummer)).toEqual(['FP', 'A', 'C', 'B'])
  })

  // Håndregnet: A (L 1) frigir [45, 30, 20, 35, 30, 25, 40, 0], B (L 2) frigir [75, 20, 35, 30, 25, 40, 0, 0].
  const FRIGIVELSER_A = [45, 30, 20, 35, 30, 25, 40, 0]
  const FRIGIVELSER_B = [75, 20, 35, 30, 25, 40, 0, 0]

  it('får samlet bruttobehov fra alle overordnede deler', () => {
    expect(del(resultat, 'A').planlagteOrdrefrigivelser).toEqual(FRIGIVELSER_A)
    expect(del(resultat, 'B').planlagteOrdrefrigivelser).toEqual(FRIGIVELSER_B)
    // 4 × A + 2 × B.
    expect(del(resultat, 'C').bruttobehov).toEqual([330, 160, 150, 200, 170, 180, 160, 0])
  })

  it('bruker lagerbeholdningen én gang', () => {
    const c = del(resultat, 'C')
    expect(c.utregning[0].beholdningForrigeUke).toBe(100)
    expect(c.utregning[0].disponibelForFremskynding).toBe(100 - c.bruttobehov[0])
  })

  it('har bruttobehovet fordelt på hver overordnet del, også når frigivelsen er 0 (AD-8)', () => {
    const c = del(resultat, 'C')
    expect(c.utregning.map((u) => u.bruttobehovFra)).toEqual(
      FRIGIVELSER_A.map((a, i) => [
        { varenummer: 'A', frigivelse: a, antall: 4 },
        { varenummer: 'B', frigivelse: FRIGIVELSER_B[i], antall: 2 },
      ]),
    )
    expect(c.utregning[7].bruttobehovFra.map((p) => p.frigivelse)).toEqual([0, 0])
  })
})

describe('beregningsrekkefølgen (AD-6)', () => {
  // D står både rett under ferdigproduktet og under A, som 300-023 Monteringsbrakett i testeksempel 04.
  // D står før A i stykklisten, men må beregnes etter A (lavnivåkode 2).
  const data = inndata(
    [
      ['0', 'FP', null, F, 0, 0, 0],
      ['.1', 'D', 1, K, 0, 0, 1],
      ['.1', 'A', 1, P, 0, 0, 2],
      ['..2', 'D', 3, K, null, null, null],
    ],
    MPS,
  )
  const struktur = byggStruktur(data.stykkliste)
  const resultat = beregnBestillingsplan(data, struktur)

  it('en del på både .1 og ..2 beregnes på lavnivåkode 2, etter delen over, med behov fra begge', () => {
    expect(struktur.beregningsrekkefolge).toEqual(['FP', 'A', 'D'])
    // Håndregnet: 1 × FP (frigivelser = MPS) + 3 × A (frigivelser [75, 20, 35, 30, 25, 40, 0, 0]).
    expect(del(resultat, 'D').bruttobehov).toEqual([245, 85, 135, 110, 110, 150, 25, 40])
  })

  it('delene vises likevel i stykklisterekkefølge', () => {
    expect(resultat.deler.map((d) => d.del.varenummer)).toEqual(['FP', 'D', 'A'])
  })

  it('kaster hvis en del står før en overordnet del i rekkefølgen', () => {
    const feil: Struktur = { ...struktur, beregningsrekkefolge: ['FP', 'D', 'A'] }
    expect(() => beregnBestillingsplan(data, feil)).toThrow(/D skal beregnes før den overordnede delen A/)
  })

  it('kaster hvis en del mangler i rekkefølgen', () => {
    const feil: Struktur = { ...struktur, beregningsrekkefolge: ['FP', 'A'] }
    expect(() => beregnBestillingsplan(data, feil)).toThrow(/D mangler i beregningsrekkefølgen/)
  })

  it('kaster hvis rekkefølgen har en del som ikke finnes', () => {
    const feil: Struktur = { ...struktur, beregningsrekkefolge: [...struktur.beregningsrekkefolge, 'X'] }
    expect(() => beregnBestillingsplan(data, feil)).toThrow(/X, som ikke finnes/)
  })
})

describe('en del med underdeler som står to ganger (FR-3, FR-28)', () => {
  // A står to ganger under ferdigproduktet med E under hver, som 200-012 Armlene i testeksempel 04.
  const data = inndata(
    [
      ['0', 'FP', null, F, 0, 0, 0],
      ['.1', 'A', 1, P, 0, 0, 1],
      ['..2', 'E', 2, K, 0, 0, 1],
      ['.1', 'A', 1, P, null, null, null],
      ['..2', 'E', 2, K, null, null, null],
    ],
    MPS,
  )
  const resultat = beregn(data)

  it('den overordnede delen får behov fra begge forekomstene, og underdelene telles én gang', () => {
    // Håndregnet: A får 1 + 1 per stol, og frigir [90, 60, 40, 70, 60, 50, 80, 0] (L 1, uke 1 forfalt).
    // E får 2 × A én gang. Med underdelene telt to ganger hadde tallene vært doblet.
    expect(del(resultat, 'A').bruttobehov).toEqual([40, 50, 60, 40, 70, 60, 50, 80])
    expect(del(resultat, 'A').planlagteOrdrefrigivelser).toEqual([90, 60, 40, 70, 60, 50, 80, 0])
    expect(del(resultat, 'E').bruttobehov).toEqual([180, 120, 80, 140, 120, 100, 160, 0])
  })
})

describe('planlagte mottak', () => {
  it('bare mottakene for delen regnes med, som enkeltlinjer (AD-4)', () => {
    const mottak: PlanlagtMottak[] = [
      { varenummer: 'A', uke: 3, antall: 20, excelRad: 2 },
      { varenummer: 'B', uke: 3, antall: 500, excelRad: 3 },
      { varenummer: 'A', uke: 3, antall: 30, excelRad: 4 },
    ]
    const resultat = beregn(
      inndata([['0', 'FP', null, F, 0, 0, 0], ['.1', 'A', 1, K, 1000, 0, 1], ['.1', 'B', 1, K, 1000, 0, 1]], MPS, mottak),
    )
    expect(del(resultat, 'A').planlagteMottak).toEqual([0, 0, 50, 0, 0, 0, 0, 0])
    expect(del(resultat, 'B').planlagteMottak).toEqual([0, 0, 500, 0, 0, 0, 0, 0])
  })
})

describe('bestillingsforslag (FR-17)', () => {
  // FP: L 0. S (produseres selv) og K1, K2 (kjøpes inn). K2 står før K1 i stykklisten.
  const data = inndata(
    [
      ['0', 'FP', null, F, 0, 0, 0],
      ['.1', 'S', 1, P, 0, 0, 1],
      ['..2', 'K2', 1, K, 0, 0, 1],
      ['.1', 'K1', 1, K, 0, 0, 3],
    ],
    [10, 10, 10, 10, 10, 10, 10, 10],
  )
  const resultat = beregn(data)

  it('én per del og uke med frigivelse > 0, med beskrivelse og mengde', () => {
    const antall = resultat.deler.reduce((s, d) => s + d.planlagteOrdrefrigivelser.filter((f) => f > 0).length, 0)
    expect(resultat.bestillingsforslag).toHaveLength(antall)
    expect(resultat.bestillingsforslag.every((f) => f.mengde > 0)).toBe(true)
    expect(resultat.bestillingsforslag[0]).toMatchObject({ varenummer: 'FP', beskrivelse: 'Del FP', frigivelsesuke: 1, mengde: 10 })
  })

  it('er sortert etter frigivelsesuke og så stykklisterekkefølge', () => {
    const uke1 = resultat.bestillingsforslag.filter((f) => f.frigivelsesuke === 1).map((f) => f.varenummer)
    expect(uke1).toEqual(['FP', 'S', 'K2', 'K1'])
    const uker = resultat.bestillingsforslag.map((f) => f.frigivelsesuke)
    expect(uker).toEqual([...uker].sort((a, b) => a - b))
  })

  it('har forfalt mengde bare i uke 1, og 0 ellers', () => {
    const k1 = resultat.bestillingsforslag.filter((f) => f.varenummer === 'K1')
    expect(k1[0]).toMatchObject({ frigivelsesuke: 1, mengde: 40, forfaltMengde: 30 })
    expect(k1.slice(1).every((f) => f.forfaltMengde === 0)).toBe(true)
    expect(resultat.bestillingsforslag.find((f) => f.varenummer === 'FP')!.forfaltMengde).toBe(0)
  })

  it('er innkjøp for Komponent (Kjøpes inn) og produksjonsordre ellers', () => {
    const art = new Map(resultat.bestillingsforslag.map((f) => [f.varenummer, f.art]))
    expect(Object.fromEntries(art)).toEqual({ FP: 'PRODUKSJONSORDRE', S: 'PRODUKSJONSORDRE', K2: 'INNKJOP', K1: 'INNKJOP' })
  })
})

describe('Resultat', () => {
  const data = inndata(
    [['0', 'FP', null, F, 5, 2, 1], ['.1', 'A', 2, P, 10, 3, 2], ['..2', 'B', 3, K, 50, 0, 1]],
    MPS,
    [{ varenummer: 'B', uke: 4, antall: 40, excelRad: 2 }],
  )

  it('har eksepsjoner og kritiske deler tomme til Story 2.3 (beslutning 1A)', () => {
    const resultat = beregn(data)
    expect(resultat.eksepsjoner).toEqual([])
    expect(resultat.kritiskeDeler).toEqual([])
    expect(resultat.deler.every((d) => d.kritisk === false)).toBe(true)
  })

  it('har seks serier og Utregning med lengde H for hver del, og ingen uke 0 (AD-4)', () => {
    for (const d of beregn(data).deler) {
      for (const serie of [d.bruttobehov, d.planlagteMottak, d.forventetLagerbeholdning, d.nettobehov, d.planlagteOrdremottak, d.planlagteOrdrefrigivelser]) {
        expect(serie).toHaveLength(MPS.length)
      }
      expect(d.utregning.map((u) => u.uke)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    }
  })

  it('Utregning har bruttobehovet og bare feltene i den delte typen', () => {
    const d = del(beregn(data), 'A')
    d.utregning.forEach((u, i) => expect(u.bruttobehov).toBe(d.bruttobehov[i]))
    expect(Object.keys(d.utregning[0]).sort()).toEqual(
      [
        'uke',
        'beholdningForrigeUke',
        'planlagteMottak',
        'bruttobehov',
        'prognostiserteBehov',
        'bruttobehovFra',
        'disponibelForFremskynding',
        'disponibelEtterFremskynding',
        'sikkerhetslager',
        'nettobehov',
        'fremskyndedeMottak',
        'fremskyndetIkkeKommet',
        'forfaltMengde',
      ].sort(),
    )
  })

  it('samme inndata gir samme resultat (FR-8)', () => {
    expect(beregn(data)).toEqual(beregn(data))
  })

  it('endrer ikke inndataene eller strukturen', () => {
    const struktur = byggStruktur(data.stykkliste)
    const forData = structuredClone(data)
    const forStruktur = structuredClone(struktur)
    beregnBestillingsplan(data, struktur)
    expect(data).toEqual(forData)
    expect(struktur).toEqual(forStruktur)
  })

  it('ferdigproduktets bruttobehov er en kopi, ikke prognostiserte behov i inndataene', () => {
    const resultat = beregn(data)
    del(resultat, 'FP').bruttobehov[0] = 999
    expect(data.prognostiserteBehov[0]).toBe(20)
  })
})

describe('håndregnet eksempel med tre nivåer (uavhengig av fasitene)', () => {
  // Stykkliste (H = 6, MPS 10 hver uke):
  //   FP  ferdigprodukt          lager 15, SS 5,  L 1, mottak 10 i uke 3
  //   .1  A  (2 per FP)  produseres selv  lager 5,  SS 0,  L 2
  //   ..2 C  (3 per A)   kjøpes inn       lager 50, SS 10, L 1, mottak 40 i uke 4   (felles del)
  //   .1  B  (1 per FP)  produseres selv  lager 0,  SS 0,  L 1
  //   ..2 C  (1 per B)
  //
  // Regnet for hånd uke for uke etter FR-5–FR-8 og FR-28, og kontrollert med et eget skript:
  // FP: uke 2 disponibel −5 < SS 5, så mottaket i uke 3 fremskyndes til uke 2. Fra uke 3 nettobehov 10,
  //     frigitt uken før: frigivelser [0, 10, 10, 10, 10, 0].
  // A:  bruttobehov 2 × FP = [0, 20, 20, 20, 20, 0]. Uke 2: 5 − 20 = −15, nettobehov 15, frigivelse
  //     2 − 2 = 0 → forfalt, i uke 1. Uke 3 frigis i uke 1. Frigivelser [35, 20, 20, 0, 0, 0], forfalt 15.
  // B:  bruttobehov 1 × FP. Frigivelser [10, 10, 10, 10, 0, 0].
  // C:  beregnes sist (lavnivåkode 2), bruttobehov 3 × A + 1 × B = [115, 70, 70, 10, 0, 0]. Uke 1:
  //     50 − 115 = −65, mottaket fra uke 4 fremskyndes (−25), nettobehov 35, forfalt. Uke 2: 10 − 70 = −60,
  //     nettobehov 70, frigis i uke 1. Frigivelser [105, 70, 10, 0, 0, 0], forfalt 35.
  const data = inndata(
    [
      ['0', 'FP', null, F, 15, 5, 1],
      ['.1', 'A', 2, P, 5, 0, 2],
      ['..2', 'C', 3, K, 50, 10, 1],
      ['.1', 'B', 1, P, 0, 0, 1],
      ['..2', 'C', 1, K, null, null, null],
    ],
    [10, 10, 10, 10, 10, 10],
    [
      { varenummer: 'C', uke: 4, antall: 40, excelRad: 2 },
      { varenummer: 'FP', uke: 3, antall: 10, excelRad: 3 },
    ],
  )
  const resultat = beregn(data)
  const rader = (varenummer: string) => {
    const d = del(resultat, varenummer)
    return {
      bruttobehov: d.bruttobehov,
      planlagteMottak: d.planlagteMottak,
      forventetLagerbeholdning: d.forventetLagerbeholdning,
      nettobehov: d.nettobehov,
      planlagteOrdremottak: d.planlagteOrdremottak,
      planlagteOrdrefrigivelser: d.planlagteOrdrefrigivelser,
      forfaltMengde: d.forfaltMengde,
    }
  }

  it('FP: mottaket fremskyndes, og frigivelsene kommer uken før behovet', () => {
    expect(rader('FP')).toEqual({
      bruttobehov: [10, 10, 10, 10, 10, 10],
      planlagteMottak: [0, 0, 10, 0, 0, 0],
      forventetLagerbeholdning: [5, -5, 5, 5, 5, 5],
      nettobehov: [0, 0, 10, 10, 10, 10],
      planlagteOrdremottak: [0, 0, 10, 10, 10, 10],
      planlagteOrdrefrigivelser: [0, 10, 10, 10, 10, 0],
      forfaltMengde: 0,
    })
  })

  it('A: bruttobehov 2 × FP, og en forfalt frigivelse i uke 1', () => {
    expect(rader('A')).toEqual({
      bruttobehov: [0, 20, 20, 20, 20, 0],
      planlagteMottak: [0, 0, 0, 0, 0, 0],
      forventetLagerbeholdning: [5, 0, 0, 0, 0, 0],
      nettobehov: [0, 15, 20, 20, 20, 0],
      planlagteOrdremottak: [0, 15, 20, 20, 20, 0],
      planlagteOrdrefrigivelser: [35, 20, 20, 0, 0, 0],
      forfaltMengde: 15,
    })
  })

  it('B: bruttobehov 1 × FP', () => {
    expect(rader('B')).toEqual({
      bruttobehov: [0, 10, 10, 10, 10, 0],
      planlagteMottak: [0, 0, 0, 0, 0, 0],
      forventetLagerbeholdning: [0, 0, 0, 0, 0, 0],
      nettobehov: [0, 10, 10, 10, 10, 0],
      planlagteOrdremottak: [0, 10, 10, 10, 10, 0],
      planlagteOrdrefrigivelser: [10, 10, 10, 10, 0, 0],
      forfaltMengde: 0,
    })
  })

  it('C (felles del): samlet behov med As forfalte frigivelse i uke 1, lageret én gang, mottaket fremskyndet, og C selv forfalt', () => {
    expect(rader('C')).toEqual({
      bruttobehov: [115, 70, 70, 10, 0, 0],
      planlagteMottak: [0, 0, 0, 40, 0, 0],
      forventetLagerbeholdning: [-30, -30, -30, 10, 10, 10],
      nettobehov: [35, 70, 70, 10, 0, 0],
      planlagteOrdremottak: [35, 70, 70, 10, 0, 0],
      planlagteOrdrefrigivelser: [105, 70, 10, 0, 0, 0],
      forfaltMengde: 35,
    })
  })

  it('C: Utregning for uke 1 har tallene bak forklaringen (AD-8)', () => {
    expect(del(resultat, 'C').utregning[0]).toEqual({
      uke: 1,
      beholdningForrigeUke: 50,
      planlagteMottak: 0,
      bruttobehov: 115,
      prognostiserteBehov: null,
      bruttobehovFra: [
        { varenummer: 'A', frigivelse: 35, antall: 3 },
        { varenummer: 'B', frigivelse: 10, antall: 1 },
      ],
      disponibelForFremskynding: -65,
      disponibelEtterFremskynding: -25,
      sikkerhetslager: 10,
      nettobehov: 35,
      fremskyndedeMottak: [{ mottaksuke: 4, antall: 40, excelRad: 2 }],
      fremskyndetIkkeKommet: 40,
      forfaltMengde: 35,
    })
    // Uke 5: verken A eller B frigir noe, men begge står i fordelingen (FR-18).
    expect(del(resultat, 'C').utregning[4].bruttobehovFra).toEqual([
      { varenummer: 'A', frigivelse: 0, antall: 3 },
      { varenummer: 'B', frigivelse: 0, antall: 1 },
    ])
  })

  it('delene vises i stykklisterekkefølge, og C beregnes sist', () => {
    expect(resultat.deler.map((d) => d.del.varenummer)).toEqual(['FP', 'A', 'C', 'B'])
    expect(byggStruktur(data.stykkliste).beregningsrekkefolge).toEqual(['FP', 'A', 'B', 'C'])
  })

  it('bestillingsforslagene står etter uke og stykklisterekkefølge (C før B), med forfalt mengde og art', () => {
    const P_ = 'PRODUKSJONSORDRE'
    const I_ = 'INNKJOP'
    const forslag = (varenummer: string, frigivelsesuke: number, mengde: number, art: string, forfaltMengde = 0) => ({
      varenummer,
      beskrivelse: `Del ${varenummer}`,
      frigivelsesuke,
      mengde,
      forfaltMengde,
      art,
    })
    expect(resultat.bestillingsforslag).toEqual([
      forslag('A', 1, 35, P_, 15),
      forslag('C', 1, 105, I_, 35),
      forslag('B', 1, 10, P_),
      forslag('FP', 2, 10, P_),
      forslag('A', 2, 20, P_),
      forslag('C', 2, 70, I_),
      forslag('B', 2, 10, P_),
      forslag('FP', 3, 10, P_),
      forslag('A', 3, 20, P_),
      forslag('C', 3, 10, I_),
      forslag('B', 3, 10, P_),
      forslag('FP', 4, 10, P_),
      forslag('B', 4, 10, P_),
      forslag('FP', 5, 10, P_),
    ])
  })
})

describe('beregn.ts importerer bare ./typer.ts og ./netting.ts (AD-7)', () => {
  it('ingen andre importer', () => {
    const kode = fjernKommentarer(readFileSync(join(import.meta.dirname, '..', '..', 'src', 'domene', 'beregn.ts'), 'utf8'))
    const kilder = [...kode.matchAll(/\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
    expect(new Set(kilder)).toEqual(new Set(['./typer.ts', './netting.ts']))
    expect([...kode.matchAll(/\bimport\s*\(/g)]).toHaveLength(0)
  })
})
