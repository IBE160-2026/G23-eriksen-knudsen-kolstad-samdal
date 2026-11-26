// Tester for nettingen for én del (Story 2.1, arkitektur AD-7, PRD FR-6–FR-8).
// Tallene er skrevet av fra Fasittabell i testdata/testeksempel-01-fasit.xlsx og -04-fasit.xlsx,
// med lagerbeholdning, SS, ledetid og planlagte mottak fra inndatafilene. SheetJS er ikke tillatt
// her (AD-15), så tallene står som data. Fasittestene som leser Excel, kommer i Story 2.2.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  beregnNetting,
  STANDARDINNSTILLINGER,
  type NettingInndata,
  type Nettingsvar,
} from '../../src/domene/netting.ts'
import type { PlanlagtMottak } from '../../src/domene/typer.ts'
import { fjernKommentarer } from '../hjelpere/arkitekturregler.ts'

/** Lager mottakslinjer med Excel-rad fra og med rad 2. */
function mottak(...linjer: [uke: number, antall: number][]): PlanlagtMottak[] {
  return linjer.map(([uke, antall], i) => ({ varenummer: 'X', uke, antall, excelRad: i + 2 }))
}

function inndata(
  lagerbeholdning: number,
  sikkerhetslager: number,
  ledetid: number,
  bruttobehov: number[],
  planlagteMottak: PlanlagtMottak[] = [],
): NettingInndata {
  return { lagerbeholdning, sikkerhetslager, ledetid, bruttobehov, planlagteMottak }
}

const MPS_01 = [20, 25, 30, 20, 35, 30, 25, 40, 30, 20]
const ganger = (n: number) => MPS_01.map((x) => x * n)

// Tilfellene i matrisen i spec-en. Brukes også i kontrollene som gjelder alle tilfellene.
const TILFELLER: Record<string, NettingInndata> = {
  'FR-6-eksempelet': inndata(20, 0, 1, [0, 0, 60, 0], mottak([4, 100])),
  '300-003 Hjul': inndata(80, 30, 1, ganger(5)),
  '300-004 Armlene': inndata(50, 20, 1, ganger(2)),
  '300-005 Gassfjær': inndata(75, 10, 2, ganger(1), mottak([4, 100])),
  '300-007 Skruesett': inndata(150, 40, 2, ganger(4), mottak([2, 120])),
  '100-002 Kontorstol Basic': inndata(0, 0, 0, MPS_01),
  '300-022 Skruesett M8': inndata(1000, 0, 7, [200, 70, 80, 140, 170, 220, 200, 60, 0, 0, 0, 0]),
  '300-026': inndata(0, 0, 1, [40, 100, 0, 120, 140, 0, 80, 100, 120, 160, 120, 0], mottak([3, 30])),
  '300-028 Hodestøtte': inndata(10, 0, 1, [10, 25, 0, 30, 35, 0, 20, 25, 30, 40, 30, 0], mottak([3, 10], [5, 15])),
  'mottak i uke H': inndata(0, 0, 1, [50, 0, 0, 0, 0, 0, 0, 0], mottak([8, 80])),
  'to linjer i samme uke': inndata(0, 0, 1, [0, 40, 0, 0], mottak([4, 20], [4, 30])),
  'flere uker forfalt': inndata(0, 0, 3, [10, 20, 30, 40, 0]),
  'første senere mottak er nok': inndata(0, 5, 1, [30, 0, 0, 0, 0], mottak([3, 40], [5, 50])),
}

const kjor = (navn: string): Nettingsvar => beregnNetting(TILFELLER[navn])

describe('beregnNetting: eksempelet i FR-6', () => {
  const svar = kjor('FR-6-eksempelet')

  it('gir nettobehov 0, forventet lagerbeholdning 20, 20, −40, 60 og viser mottaket i uke 4', () => {
    expect(svar.nettobehov).toEqual([0, 0, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([20, 20, -40, 60])
    expect(svar.planlagteMottak).toEqual([0, 0, 0, 100])
    expect(svar.planlagteOrdremottak).toEqual([0, 0, 0, 0])
    expect(svar.planlagteOrdrefrigivelser).toEqual([0, 0, 0, 0])
  })

  it('fremskynder mottaket til uke 3 og teller det ikke igjen i uke 4', () => {
    const [, , uke3, uke4] = svar.uker
    expect(uke3.disponibelForFremskynding).toBe(-40)
    expect(uke3.disponibelEtterFremskynding).toBe(60)
    expect(uke3.fremskyndedeMottak).toEqual([{ mottaksuke: 4, antall: 100, excelRad: 2 }])
    expect(uke3.fremskyndetIkkeKommet).toBe(100)
    expect(uke4.beholdningForrigeUke).toBe(60)
    expect(uke4.planlagteMottak).toBe(0)
    expect(uke4.disponibelEtterFremskynding).toBe(60)
    expect(uke4.fremskyndetIkkeKommet).toBe(0)
  })
})

describe('beregnNetting: testeksempel 01', () => {
  it('300-003 Hjul: disponibel −20 og nettobehov 50 i uke 1, frigivelse 175 med 50 forfalt', () => {
    const svar = kjor('300-003 Hjul')
    expect(svar.uker[0].disponibelEtterFremskynding).toBe(-20)
    expect(svar.uker[0].nettobehov).toBe(50)
    expect(svar.uker[0].forfaltMengde).toBe(50)
    expect(svar.uker[1].forfaltMengde).toBe(0)
    expect(svar.nettobehov).toEqual([50, 125, 150, 100, 175, 150, 125, 200, 150, 100])
    expect(svar.planlagteOrdremottak).toEqual([50, 125, 150, 100, 175, 150, 125, 200, 150, 100])
    expect(svar.planlagteOrdrefrigivelser).toEqual([175, 150, 100, 175, 150, 125, 200, 150, 100, 0])
    expect(svar.forventetLagerbeholdning).toEqual(new Array(10).fill(30))
    expect(svar.forfaltMengde).toBe(50)
  })

  it('300-004 Armlene: disponibel 10 under SS 20, 10 forfalt av frigivelsen på 60', () => {
    const svar = kjor('300-004 Armlene')
    expect(svar.uker[0].disponibelEtterFremskynding).toBe(10)
    expect(svar.nettobehov).toEqual([10, 50, 60, 40, 70, 60, 50, 80, 60, 40])
    expect(svar.planlagteOrdrefrigivelser).toEqual([60, 60, 40, 70, 60, 50, 80, 60, 40, 0])
    expect(svar.forventetLagerbeholdning).toEqual(new Array(10).fill(20))
    expect(svar.forfaltMengde).toBe(10)
  })

  it('300-005 Gassfjær: mottaket i uke 4 dekker uke 3, forventet lagerbeholdning 0 i uke 3 og 80 i uke 4', () => {
    const svar = kjor('300-005 Gassfjær')
    expect(svar.planlagteMottak).toEqual([0, 0, 0, 100, 0, 0, 0, 0, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([55, 30, 0, 80, 45, 15, 10, 10, 10, 10])
    expect(svar.nettobehov).toEqual([0, 0, 0, 0, 0, 0, 20, 40, 30, 20])
    expect(svar.planlagteOrdremottak).toEqual([0, 0, 0, 0, 0, 0, 20, 40, 30, 20])
    expect(svar.planlagteOrdrefrigivelser).toEqual([0, 0, 0, 0, 20, 40, 30, 20, 0, 0])
    expect(svar.uker[2].disponibelForFremskynding).toBe(0)
    expect(svar.uker[2].fremskyndedeMottak).toEqual([{ mottaksuke: 4, antall: 100, excelRad: 2 }])
    expect(svar.uker[3].beholdningForrigeUke).toBe(100)
    expect(svar.forfaltMengde).toBe(0)
  })

  it('300-007 Skruesett: mottaket i uke 2 kommer i tide og fremskyndes ikke. Frigivelse i uke 1 er ikke forfalt', () => {
    const svar = kjor('300-007 Skruesett')
    expect(svar.planlagteMottak).toEqual([0, 120, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([70, 90, 40, 40, 40, 40, 40, 40, 40, 40])
    expect(svar.nettobehov).toEqual([0, 0, 70, 80, 140, 120, 100, 160, 120, 80])
    expect(svar.planlagteOrdrefrigivelser).toEqual([70, 80, 140, 120, 100, 160, 120, 80, 0, 0])
    expect(svar.uker.every((u) => u.fremskyndedeMottak.length === 0)).toBe(true)
    expect(svar.forfaltMengde).toBe(0)
  })

  it('100-002 Kontorstol Basic (L = 0): frigivelsen står i samme uke som ordremottaket', () => {
    const svar = kjor('100-002 Kontorstol Basic')
    expect(svar.planlagteOrdremottak).toEqual(MPS_01)
    expect(svar.planlagteOrdrefrigivelser).toEqual(MPS_01)
    expect(svar.forventetLagerbeholdning).toEqual(new Array(10).fill(0))
    expect(svar.forfaltMengde).toBe(0)
  })
})

describe('beregnNetting: testeksempel 04', () => {
  it('300-028: to mottak fremskyndes til uke 2, uten ordremottak i ukene mellom', () => {
    const svar = kjor('300-028 Hodestøtte')
    expect(svar.uker[1].disponibelForFremskynding).toBe(-25)
    expect(svar.uker[1].fremskyndedeMottak).toEqual([
      { mottaksuke: 3, antall: 10, excelRad: 2 },
      { mottaksuke: 5, antall: 15, excelRad: 3 },
    ])
    expect(svar.planlagteMottak).toEqual([0, 0, 10, 0, 15, 0, 0, 0, 0, 0, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([0, -25, -15, -15, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(svar.nettobehov).toEqual([0, 0, 0, 30, 35, 0, 20, 25, 30, 40, 30, 0])
    expect(svar.planlagteOrdremottak).toEqual([0, 0, 0, 30, 35, 0, 20, 25, 30, 40, 30, 0])
    expect(svar.planlagteOrdrefrigivelser).toEqual([0, 0, 30, 35, 0, 20, 25, 30, 40, 30, 0, 0])
    // Ukene mellom fremskyndingen og mottaksukene får ingen nye ordremottak.
    expect(svar.planlagteOrdremottak[2]).toBe(0)
    expect(svar.uker[2].planlagteMottak).toBe(0)
    expect(svar.uker[4].planlagteMottak).toBe(0)
  })

  it('300-026: mottaket er for lite, så resten blir ordremottak med forfalt frigivelse', () => {
    const svar = kjor('300-026')
    const uke1 = svar.uker[0]
    expect(uke1.disponibelForFremskynding).toBe(-40)
    expect(uke1.disponibelEtterFremskynding).toBe(-10)
    expect(uke1.nettobehov).toBe(10)
    expect(uke1.forfaltMengde).toBe(10)
    expect(svar.forventetLagerbeholdning).toEqual([-30, -30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(svar.nettobehov).toEqual([10, 100, 0, 120, 140, 0, 80, 100, 120, 160, 120, 0])
    expect(svar.planlagteOrdrefrigivelser).toEqual([110, 0, 120, 140, 0, 80, 100, 120, 160, 120, 0, 0])
    expect(svar.planlagteMottak[2]).toBe(30)
    expect(svar.uker[2].planlagteMottak).toBe(0)
    expect(svar.forfaltMengde).toBe(10)
  })

  it('300-022: forfalt i uke 7 når ledetiden er 7, ikke forfalt i uke 8', () => {
    const svar = kjor('300-022 Skruesett M8')
    expect(svar.nettobehov).toEqual([0, 0, 0, 0, 0, 0, 80, 60, 0, 0, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([800, 730, 650, 510, 340, 120, 0, 0, 0, 0, 0, 0])
    expect(svar.planlagteOrdrefrigivelser).toEqual([140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(svar.uker[6].forfaltMengde).toBe(80)
    expect(svar.uker[7].forfaltMengde).toBe(0)
    expect(svar.forfaltMengde).toBe(80)
  })
})

describe('beregnNetting: grensetilfeller', () => {
  it('et mottak i uke H fremskyndes helt til uke 1', () => {
    const svar = kjor('mottak i uke H')
    expect(svar.uker[0].fremskyndedeMottak).toEqual([{ mottaksuke: 8, antall: 80, excelRad: 2 }])
    expect(svar.uker[0].disponibelEtterFremskynding).toBe(30)
    expect(svar.nettobehov).toEqual(new Array(8).fill(0))
    expect(svar.forventetLagerbeholdning).toEqual([-50, -50, -50, -50, -50, -50, -50, 30])
    expect(svar.planlagteMottak).toEqual([0, 0, 0, 0, 0, 0, 0, 80])
  })

  it('to linjer i samme uke vises samlet og fremskyndes sammen, som to poster', () => {
    const svar = kjor('to linjer i samme uke')
    expect(svar.planlagteMottak).toEqual([0, 0, 0, 50])
    expect(svar.uker[1].fremskyndedeMottak).toEqual([
      { mottaksuke: 4, antall: 20, excelRad: 2 },
      { mottaksuke: 4, antall: 30, excelRad: 3 },
    ])
    expect(svar.forventetLagerbeholdning).toEqual([0, -40, -40, 10])
    expect(svar.nettobehov).toEqual([0, 0, 0, 0])
  })

  it('flere uker forfalt: forfalt mengde er summen, og uke 1 har også den vanlige frigivelsen', () => {
    const svar = kjor('flere uker forfalt')
    expect(svar.uker.map((u) => u.forfaltMengde)).toEqual([10, 20, 30, 0, 0])
    expect(svar.forfaltMengde).toBe(60)
    expect(svar.planlagteOrdrefrigivelser).toEqual([100, 0, 0, 0, 0])
  })

  it('uten fremskynding regnes mottaket i sin egen uke, og nettobehovet blir ordremottak', () => {
    const svar = beregnNetting(TILFELLER['FR-6-eksempelet'], { fremskynding: false })
    expect(svar.uker.every((u) => u.fremskyndedeMottak.length === 0)).toBe(true)
    expect(svar.nettobehov).toEqual([0, 0, 40, 0])
    expect(svar.planlagteOrdremottak).toEqual([0, 0, 40, 0])
    expect(svar.planlagteOrdrefrigivelser).toEqual([0, 40, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([20, 20, 0, 100])
    expect(svar.uker[3].planlagteMottak).toBe(100)
  })

  it('et mottak før behovet fremskyndes ikke, og mottak utenfor uke 1..H regnes ikke med', () => {
    const svar = beregnNetting(inndata(0, 0, 1, [0, 0, 30], mottak([1, 40], [0, 99], [4, 99])))
    expect(svar.planlagteMottak).toEqual([40, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([40, 40, 10])
    expect(svar.uker.every((u) => u.fremskyndedeMottak.length === 0)).toBe(true)
  })

  it('fremskyndingen stopper når nettobehovet er dekket: det andre mottaket blir i sin uke', () => {
    const svar = kjor('første senere mottak er nok')
    expect(svar.uker[0].disponibelForFremskynding).toBe(-30)
    expect(svar.uker[0].fremskyndedeMottak).toEqual([{ mottaksuke: 3, antall: 40, excelRad: 2 }])
    expect(svar.uker[0].disponibelEtterFremskynding).toBe(10)
    expect(svar.uker.slice(1).every((u) => u.fremskyndedeMottak.length === 0)).toBe(true)
    expect(svar.uker[4].planlagteMottak).toBe(50)
    expect(svar.nettobehov).toEqual([0, 0, 0, 0, 0])
    expect(svar.forventetLagerbeholdning).toEqual([-30, -30, 10, 10, 60])
    expect(svar.uker.map((u) => u.fremskyndetIkkeKommet)).toEqual([40, 40, 0, 0, 0])
  })

  it('uten fremskynding og med SS > 0 gir hele mangelen opp til SS ordremottak (grunnlaget for Kanseller mottak)', () => {
    const svar = beregnNetting(TILFELLER['første senere mottak er nok'], { fremskynding: false })
    expect(svar.uker.every((u) => u.fremskyndedeMottak.length === 0)).toBe(true)
    expect(svar.nettobehov).toEqual([35, 0, 0, 0, 0])
    expect(svar.forfaltMengde).toBe(35)
    expect(svar.forventetLagerbeholdning).toEqual([5, 5, 45, 45, 95])
  })
})

describe('beregnNetting: innstillingene', () => {
  const inn = TILFELLER['300-005 Gassfjær']
  const medFremskynding = beregnNetting(inn, { fremskynding: true })

  it('uten innstillinger, med tomme innstillinger og med STANDARDINNSTILLINGER fremskyndes mottak', () => {
    expect(medFremskynding.uker[2].fremskyndedeMottak).toHaveLength(1)
    expect(beregnNetting(inn)).toEqual(medFremskynding)
    expect(beregnNetting(inn, {})).toEqual(medFremskynding)
    expect(beregnNetting(inn, STANDARDINNSTILLINGER)).toEqual(medFremskynding)
  })

  it('fremskynding: undefined gir standardverdien, ikke av', () => {
    expect(beregnNetting(inn, { fremskynding: undefined })).toEqual(medFremskynding)
  })

  it('STANDARDINNSTILLINGER har fremskynding på og kan ikke endres', () => {
    expect(STANDARDINNSTILLINGER).toEqual({ fremskynding: true })
    expect(Object.isFrozen(STANDARDINNSTILLINGER)).toBe(true)
  })
})

describe('netting.ts importerer bare ./typer.ts (AD-7)', () => {
  it('har ingen andre importer', () => {
    const kode = fjernKommentarer(readFileSync(join(import.meta.dirname, '..', '..', 'src', 'domene', 'netting.ts'), 'utf8'))
    const kilder = [...kode.matchAll(/\b(?:import|export)\b[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
    const dynamiske = [...kode.matchAll(/\bimport\s*\(/g)]
    expect(kilder).toEqual(['./typer.ts'])
    expect(dynamiske).toEqual([])
  })
})

describe('beregnNetting: kontroller for alle tilfellene', () => {
  for (const [navn, inn] of Object.entries(TILFELLER)) {
    describe(navn, () => {
      const svar = beregnNetting(inn)
      const H = inn.bruttobehov.length

      it('alle serier og ukene har lengde H', () => {
        for (const serie of [
          svar.planlagteMottak,
          svar.forventetLagerbeholdning,
          svar.nettobehov,
          svar.planlagteOrdremottak,
          svar.planlagteOrdrefrigivelser,
          svar.uker,
        ]) {
          expect(serie).toHaveLength(H)
        }
        expect(svar.uker.map((u) => u.uke)).toEqual(Array.from({ length: H }, (_, i) => i + 1))
      })

      it('SS holdes i beregningen, og forventet lagerbeholdning er under SS bare før et fremskyndet mottak (FR-7)', () => {
        for (const u of svar.uker) {
          expect(u.disponibelEtterFremskynding + u.nettobehov).toBeGreaterThanOrEqual(inn.sikkerhetslager)
          if (u.fremskyndetIkkeKommet === 0) expect(u.forventetLagerbeholdning).toBeGreaterThanOrEqual(inn.sikkerhetslager)
        }
      })

      it('ingen mottak telles dobbelt (lagerbalansen går opp)', () => {
        const totalMottak = inn.planlagteMottak.reduce((s, m) => s + m.antall, 0)
        const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0)
        const sist = svar.uker[H - 1]
        expect(sist.forventetLagerbeholdning + sist.fremskyndetIkkeKommet).toBe(
          inn.lagerbeholdning + totalMottak + sum(svar.planlagteOrdremottak) - sum(inn.bruttobehov),
        )
        expect(sum(svar.planlagteMottak)).toBe(totalMottak)
        expect(sum(svar.uker.map((u) => u.planlagteMottak + sum(u.fremskyndedeMottak.map((m) => m.antall))))).toBe(
          totalMottak,
        )
      })

      it('forfalt mengde er summen av ukene og ligger i frigivelsen i uke 1', () => {
        expect(svar.forfaltMengde).toBe(svar.uker.reduce((s, u) => s + u.forfaltMengde, 0))
        expect(svar.forfaltMengde).toBeLessThanOrEqual(svar.planlagteOrdrefrigivelser[0])
        expect(svar.planlagteOrdrefrigivelser.reduce((s, x) => s + x, 0)).toBe(
          svar.planlagteOrdremottak.reduce((s, x) => s + x, 0),
        )
      })

      it('ordremottak er lik nettobehov (lot-for-lot)', () => {
        expect(svar.planlagteOrdremottak).toEqual(svar.nettobehov)
      })
    })
  }
})

describe('beregnNetting: ren og deterministisk', () => {
  it('endrer ikke inndataene', () => {
    const inn = TILFELLER['300-028 Hodestøtte']
    const kopi = structuredClone(inn)
    const frosset: NettingInndata = Object.freeze({
      ...inn,
      bruttobehov: Object.freeze([...inn.bruttobehov]),
      planlagteMottak: Object.freeze(inn.planlagteMottak.map((m) => Object.freeze({ ...m }))),
    })
    beregnNetting(frosset)
    beregnNetting(inn)
    expect(inn).toEqual(kopi)
  })

  it('samme inndata gir samme svar', () => {
    for (const inn of Object.values(TILFELLER)) {
      expect(beregnNetting(inn)).toEqual(beregnNetting(inn))
    }
  })

  it('husker ingenting mellom kall: å endre et svar påvirker ikke neste kall', () => {
    const inn = TILFELLER['300-003 Hjul']
    const svar = beregnNetting(inn)
    svar.planlagteOrdrefrigivelser[0] = -1
    expect(beregnNetting(inn).planlagteOrdrefrigivelser[0]).toBe(175)
  })

  it('svaret deler ingen objekter med inndataene', () => {
    const inn = TILFELLER['FR-6-eksempelet']
    const kopi = structuredClone(inn)
    const svar = beregnNetting(inn)
    const post = svar.uker[2].fremskyndedeMottak[0]
    expect(post).not.toBe(inn.planlagteMottak[0])
    expect(svar.uker[2].bruttobehov).toBe(60)
    post.antall = -1
    expect(inn).toEqual(kopi)
  })
})
