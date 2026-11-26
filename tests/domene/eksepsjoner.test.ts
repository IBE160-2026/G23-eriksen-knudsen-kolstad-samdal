// Tester for eksepsjonene og de kritiske delene (Story 2.3, PRD FR-9–FR-13 og FR-29, SM-2).
//
// - Enhetstestene bygger delene med `beregnNetting` og sammenligner med eksepsjonene fra fasitene (typer-eksempler.ts).
// - Fasittestene leser testeksempel 01–05 og fasitene fra Excel (tests/hjelpere/fasit-leser.ts, AD-15) og sammenligner
//   eksepsjonslisten med arket Eksepsjoner (varenummer, uke, type). Bruttobehovet leses fra Fasittabell, så testene
//   er uavhengige av beregningen nivå for nivå (Story 2.2), som får sine egne fasittester.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { finnEksepsjoner as finnEksepsjonerIResultat } from '../../src/domene/eksepsjoner.ts'
import { beregnBestillingsplan } from '../../src/domene/beregn.ts'
import { beregnNetting, type NettingInndata, type Nettingsvar } from '../../src/domene/netting.ts'
import { byggStruktur } from '../../src/domene/struktur.ts'
import type { DelResultat, Eksepsjon, Nivaa, PlanlagtMottak, StrukturDel, Utregning } from '../../src/domene/typer.ts'
import { valider } from '../../src/domene/valider.ts'
import { les } from '../../src/excel/les.ts'
import { lesFasitEksepsjoner } from '../hjelpere/fasit-leser.ts'
import { EKSEPSJONER_01, KANSELLER_MOTTAK_02, LASESKIVE_04, PRODUKSJON_FORSINKET_04, SIKKERHETSLAGER_02 } from './typer-eksempler.ts'

// ---------------------------------------------------------------------------
// Hjelpere til enhetstestene
// ---------------------------------------------------------------------------

const MPS_01 = [20, 25, 30, 20, 35, 30, 25, 40, 30, 20]
const ganger = (n: number) => MPS_01.map((x) => x * n)

function del(
  varenummer: string,
  beskrivelse: string,
  nivaa: Nivaa,
  lager: number,
  ss: number,
  ledetid: number,
  overordnede: { varenummer: string; antall: number }[],
  ledetidFraFerdigproduktet = ledetid,
  sti: string[] = [varenummer],
  type: StrukturDel['type'] = 'KJOPES_INN',
): StrukturDel {
  return {
    varenummer,
    beskrivelse,
    type,
    nivaa,
    lagerbeholdning: lager,
    sikkerhetslager: ss,
    ledetid,
    overordnede,
    forekomster: [],
    lavnivaakode: nivaa.length - nivaa.replace(/\./g, '').length,
    ledetidFraFerdigproduktet,
    stiForLedetid: sti,
    antallPerFerdigprodukt: overordnede[0]?.antall ?? 1,
  }
}

function mottak(varenummer: string, ...linjer: [uke: number, antall: number][]): PlanlagtMottak[] {
  return linjer.map(([uke, antall], i) => ({ varenummer, uke, antall, excelRad: i + 2 }))
}

/** En del slik beregningen nivå for nivå gir den (`DelResultat`), med mottakene den ble regnet med. */
type TestDel = { resultat: DelResultat; mottak: PlanlagtMottak[] }

/** Bygger `DelResultat` fra nettingen for én del, slik beregn.ts gjør det (Story 2.2). */
function tilDelResultat(d: StrukturDel, bruttobehov: number[], svar: Nettingsvar): DelResultat {
  return {
    del: d,
    bruttobehov,
    planlagteMottak: svar.planlagteMottak,
    forventetLagerbeholdning: svar.forventetLagerbeholdning,
    nettobehov: svar.nettobehov,
    planlagteOrdremottak: svar.planlagteOrdremottak,
    planlagteOrdrefrigivelser: svar.planlagteOrdrefrigivelser,
    forfaltMengde: svar.forfaltMengde,
    utregning: svar.uker.map((uke): Utregning => {
      const { planlagtOrdremottak: _ordremottak, forventetLagerbeholdning: _forventet, ...felles } = uke
      return { ...felles, prognostiserteBehov: null, bruttobehovFra: [] }
    }),
    kritisk: false,
  }
}

/** En del med nettingen kjørt på inndataene. */
function medNetting(d: StrukturDel, bruttobehov: number[], planlagteMottak: PlanlagtMottak[] = []): TestDel {
  const inndata: NettingInndata = {
    lagerbeholdning: d.lagerbeholdning,
    sikkerhetslager: d.sikkerhetslager,
    ledetid: d.ledetid,
    bruttobehov,
    planlagteMottak,
  }
  return { resultat: tilDelResultat(d, bruttobehov, beregnNetting(inndata)), mottak: planlagteMottak }
}

/** Kaller finnEksepsjoner slik Story 2.5 gjør: med `Resultat.deler` og mottakene fra inndataene. */
function finnEksepsjoner(deler: readonly TestDel[], horisont: number) {
  return finnEksepsjonerIResultat(
    deler.map((d) => d.resultat),
    deler.flatMap((d) => d.mottak),
    horisont,
  )
}

const FERDIG = del('100-002', 'Kontorstol Basic', '0', 0, 0, 0, [], 0, ['100-002'], 'FERDIGVARE')
const ferdigprodukt = () => medNetting(FERDIG, MPS_01)

const kodeOgUke = (e: readonly Eksepsjon[]) => e.map((x) => [x.varenummer, x.uke, x.kode])

// ---------------------------------------------------------------------------
// Enhetstester
// ---------------------------------------------------------------------------

describe('Bestilling forsinket (FR-10)', () => {
  const hjul = del('300-003', 'Hjul', '.1', 80, 30, 1, [{ varenummer: '100-002', antall: 5 }], 1, ['100-002', '300-003'])

  it('300-003 Hjul i testeksempel 01 gir eksepsjonen fra fasiten, med alle opplysningene', () => {
    const { eksepsjoner } = finnEksepsjoner([ferdigprodukt(), medNetting(hjul, ganger(5))], 10)
    expect(eksepsjoner).toEqual([EKSEPSJONER_01[0]])
  })

  it('en del som ikke har forfalt frigivelse, får ingen eksepsjon selv om nettobehovet er over 0', () => {
    const d = del('300-001', 'Sete', '.1', 0, 0, 1, [{ varenummer: '100-002', antall: 1 }])
    // Bruttobehov bare fra uke 3: nettobehovet i uke 3 frigis i uke 2, ikke før uke 1.
    const { eksepsjoner, kritiskeDeler } = finnEksepsjoner([medNetting(d, [0, 0, 30, 0])], 4)
    expect(eksepsjoner).toEqual([])
    expect(kritiskeDeler).toEqual([])
  })

  it('en uke kan ikke få både Bestilling forsinket og Bruk av sikkerhetslager', () => {
    const d = del('300-009', 'X', '.1', 5, 10, 3, [{ varenummer: '100-002', antall: 1 }])
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, [10, 10, 10, 10, 10])], 5)
    const per = new Map<number, string[]>()
    for (const e of eksepsjoner) per.set(e.uke ?? 0, [...(per.get(e.uke ?? 0) ?? []), e.kode])
    for (const koder of per.values()) {
      expect(koder.includes('BESTILLING_FORSINKET') && koder.includes('BRUK_AV_SIKKERHETSLAGER')).toBe(false)
    }
  })

  it('forfalt frigivelse i flere uker gir en eksepsjon i hver av dem (L = 3), og total frigivelse i uke 1 har også uke 4 sin vanlige frigivelse', () => {
    const d = del('300-009', 'X', '.1', 0, 0, 3, [{ varenummer: '100-002', antall: 1 }])
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, [10, 20, 30, 40, 0, 0])], 6)
    expect(eksepsjoner.map((e) => [e.kode, e.uke])).toEqual([
      ['BESTILLING_FORSINKET', 1],
      ['BESTILLING_FORSINKET', 2],
      ['BESTILLING_FORSINKET', 3],
    ])
    expect(eksepsjoner[2]).toMatchObject({ skulleFrigis: 0, tidligsteMottaksuke: 4, frigivelseUke1: 100 })
    expect(eksepsjoner[0]).toMatchObject({ skulleFrigis: -2, forfaltMengde: 10 })
  })
})

describe('Bestilling forsinket: hva som blir forsinket (FR-10)', () => {
  const sete = del('200-010', 'Sete', '.1', 0, 0, 4, [{ varenummer: '100-003', antall: 1 }], 5, ['100-003', '200-010'], 'PRODUSERES_SELV')
  const rygg = del('200-011', 'Rygg', '.1', 0, 0, 3, [{ varenummer: '100-003', antall: 1 }], 4, ['100-003', '200-011'], 'PRODUSERES_SELV')
  const ferdig = del('100-003', 'Kontorstol Ergo', '0', 0, 0, 1, [], 1, ['100-003'], 'FERDIGVARE')

  it('300-022 Skruesett M8 under to .1-deler: produksjonen av begge blir forsinket, med navn', () => {
    const skruer = del('300-022', 'Skruesett M8', '..2', 0, 0, 7, [{ varenummer: '200-010', antall: 4 }, { varenummer: '200-011', antall: 4 }], 12, ['100-003', '200-010', '300-022'])
    const { eksepsjoner } = finnEksepsjoner(
      [medNetting(ferdig, [0, 0, 0, 0, 0, 0, 0, 0]), medNetting(sete, [0, 0, 0, 0, 0, 0, 0, 0]), medNetting(rygg, [0, 0, 0, 0, 0, 0, 0, 0]), medNetting(skruer, [0, 0, 0, 0, 0, 0, 80, 0])],
      12,
    )
    const bestilling = eksepsjoner.find((e) => e.kode === 'BESTILLING_FORSINKET')
    expect(bestilling).toMatchObject({ forsinker: PRODUKSJON_FORSINKET_04.forsinker, uke: 7 })
    expect(bestilling).toMatchObject({ disponibel: -80, forfaltMengde: 80, frigivelseUke1: 80, tidligsteMottaksuke: 8 })
  })

  it('ferdigproduktet og delene på nivå .1 gir leveranse til kunde', () => {
    const d = del('300-003', 'Hjul', '.1', 0, 0, 1, [{ varenummer: '100-003', antall: 5 }])
    const { eksepsjoner } = finnEksepsjoner([medNetting(ferdig, [0, 0]), medNetting(d, [10, 0])], 12)
    expect(eksepsjoner[0]).toMatchObject({ kode: 'BESTILLING_FORSINKET', forsinker: { type: 'LEVERANSE_TIL_KUNDE' } })
  })

  it('et ferdigprodukt med ledetid (nivå 0, ingen overordnet del) gir leveranse til kunde, som 100-001 i testeksempel 02', () => {
    const pro = del('100-001', 'Kontorstol Pro', '0', 10, 0, 1, [], 1, ['100-001'], 'FERDIGVARE')
    const { eksepsjoner } = finnEksepsjoner([medNetting(pro, [20, 25, 30, 20])], 10)
    expect(eksepsjoner[0]).toMatchObject({ kode: 'BESTILLING_FORSINKET', uke: 1, forsinker: { type: 'LEVERANSE_TIL_KUNDE' } })
  })

  it('en felles del som også står rett under ferdigproduktet, gir leveranse til kunde', () => {
    const skruer = del('300-002', 'Skruesett', '..2', 0, 0, 1, [{ varenummer: '200-010', antall: 4 }, { varenummer: '100-003', antall: 2 }])
    const { eksepsjoner } = finnEksepsjoner([medNetting(ferdig, [0, 0]), medNetting(sete, [0, 0]), medNetting(skruer, [10, 0])], 12)
    expect(eksepsjoner.find((e) => e.varenummer === '300-002')).toMatchObject({ forsinker: { type: 'LEVERANSE_TIL_KUNDE' } })
  })

  it('en del på ..2 som bare står under .1-deler, gir produksjon av de overordnede', () => {
    const d = del('300-002', 'Skruesett', '..2', 0, 0, 1, [{ varenummer: '200-010', antall: 4 }])
    const { eksepsjoner } = finnEksepsjoner([medNetting(ferdig, [0, 0]), medNetting(sete, [0, 0]), medNetting(d, [10, 0])], 12)
    expect(eksepsjoner.find((e) => e.varenummer === '300-002')).toMatchObject({
      forsinker: { type: 'PRODUKSJON', av: [{ varenummer: '200-010', beskrivelse: 'Sete' }] },
    })
  })
})

describe('Bruk av sikkerhetslager (FR-11)', () => {
  it('300-004 Armlene i testeksempel 01 gir eksepsjonen fra fasiten', () => {
    const armlene = del('300-004', 'Armlene', '.1', 50, 20, 1, [{ varenummer: '100-002', antall: 2 }], 1, ['100-002', '300-004'])
    const { eksepsjoner } = finnEksepsjoner([ferdigprodukt(), medNetting(armlene, ganger(2))], 10)
    expect(eksepsjoner).toEqual([EKSEPSJONER_01[1]])
  })

  it('300-003 Ryggtrekk i testeksempel 02 (L = 2) har skulleFrigis −1 og tidligste mottaksuke 3', () => {
    const d = del('300-003', 'Ryggtrekk', '..2', 40, 30, 2, [{ varenummer: '200-001', antall: 1 }], 3, ['100-001', '200-001', '300-003'])
    // Lager 40 mot bruttobehov 20 gir disponibel 20, under SS 30. Frigivelsen skulle vært gjort i uke −1.
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, [20, 0, 0, 0, 0, 0, 0, 0, 0, 0])], 10)
    expect(eksepsjoner).toEqual([
      expect.objectContaining({
        kode: 'BRUK_AV_SIKKERHETSLAGER',
        uke: 1,
        disponibel: 20,
        sikkerhetslager: 30,
        forfaltMengde: 10,
        skulleFrigis: SIKKERHETSLAGER_02.skulleFrigis,
        tidligsteMottaksuke: SIKKERHETSLAGER_02.tidligsteMottaksuke,
      }),
    ])
  })
})

describe('Mottak forsinket (FR-12)', () => {
  it('300-005 Gassfjær i testeksempel 01: mottaket i uke 4 fremskyndes til uke 3, med disponibel beholdning før fremskyndingen', () => {
    const d = del('300-005', 'Gassfjær', '.1', 75, 10, 2, [{ varenummer: '100-002', antall: 1 }], 2, ['100-002', '300-005'])
    const { eksepsjoner } = finnEksepsjoner([ferdigprodukt(), medNetting(d, ganger(1), mottak('300-005', [4, 100]))], 10)
    expect(eksepsjoner).toEqual([EKSEPSJONER_01[2]])
  })

  it('to mottak som fremskyndes til samme uke, gir to eksepsjoner i rekkefølgen de fremskyndes (300-028)', () => {
    const d = del('300-028', 'Hodestøtte', '.1', 10, 0, 1, [{ varenummer: '100-002', antall: 1 }])
    const brutto = [10, 25, 0, 30, 35, 0, 20, 25, 30, 40, 30, 0]
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, brutto, mottak('300-028', [3, 10], [5, 15]))], 12)
    const mottaksforsinkelser = eksepsjoner.filter((e) => e.kode === 'MOTTAK_FORSINKET')
    expect(mottaksforsinkelser).toMatchObject([
      { uke: 2, mottaksuke: 3, antall: 10, excelRad: 2, disponibelForFremskynding: -25 },
      { uke: 2, mottaksuke: 5, antall: 15, excelRad: 3, disponibelForFremskynding: -25 },
    ])
  })

  it('en del med Bestilling forsinket og Mottak forsinket i samme uke har begge, med ulik disponibel beholdning (300-026)', () => {
    const d = del('300-026', 'Låseskive', '..2', 0, 0, 1, [{ varenummer: '200-010', antall: 1 }])
    const brutto = [40, 100, 0, 120, 140, 0, 80, 100, 120, 160, 120, 0]
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, brutto, mottak('300-026', [3, 30]))], 12)
    expect(eksepsjoner.filter((e) => e.uke === 1).map((e) => e.kode)).toEqual(['BESTILLING_FORSINKET', 'MOTTAK_FORSINKET'])
    expect(eksepsjoner[0]).toMatchObject({ disponibel: LASESKIVE_04[0].disponibel })
    expect(eksepsjoner[1]).toMatchObject({ disponibelForFremskynding: LASESKIVE_04[1].disponibelForFremskynding })
  })
})

describe('Ledetid overskrider horisont (FR-9)', () => {
  it('slår til når ledetiden fra ferdigproduktet er lik horisonten, selv om nettobehovet er 0 i alle uker (300-006)', () => {
    const d = del('300-006', 'Stolfot', '.1', 300, 0, 10, [{ varenummer: '100-002', antall: 1 }], 10, ['100-002', '300-006'])
    const { eksepsjoner } = finnEksepsjoner([ferdigprodukt(), medNetting(d, ganger(1))], 10)
    expect(eksepsjoner).toEqual([EKSEPSJONER_01[3]])
  })

  it('slår til over horisonten, men ikke ett under, og sti og ledetid per del følger med', () => {
    const d = del('300-005', 'Gassfjær', '..2', 100, 0, 12, [{ varenummer: '200-001', antall: 1 }], 13, ['100-001', '200-001', '300-005'])
    const ferdig = del('100-001', 'Kontorstol Pro', '0', 0, 0, 1, [], 1, ['100-001'], 'FERDIGVARE')
    const mellom = del('200-001', 'Sete', '.1', 0, 0, 0, [{ varenummer: '100-001', antall: 1 }], 1, ['100-001', '200-001'], 'PRODUSERES_SELV')
    const lager = [medNetting(ferdig, [0, 0]), medNetting(mellom, [0, 0]), medNetting(d, [0, 0])]
    const over = finnEksepsjoner(lager, 10).eksepsjoner
    expect(over).toHaveLength(1)
    expect(over[0]).toMatchObject({
      kode: 'LEDETID_OVERSKRIDER_HORISONT',
      uke: null,
      ledetidFraFerdigproduktet: 13,
      horisont: 10,
      sti: [
        { varenummer: '100-001', beskrivelse: 'Kontorstol Pro', ledetid: 1 },
        { varenummer: '200-001', beskrivelse: 'Sete', ledetid: 0 },
        { varenummer: '300-005', beskrivelse: 'Gassfjær', ledetid: 12 },
      ],
    })
    expect(finnEksepsjoner(lager, 14).eksepsjoner).toEqual([])
  })

  it('300-007 Skruesett og 300-008 Trekk får ingen eksepsjon, og de er ikke kritiske', () => {
    const skruesett = del('300-007', 'Skruesett', '.1', 150, 40, 2, [{ varenummer: '100-002', antall: 4 }], 2, ['100-002', '300-007'])
    const { eksepsjoner, kritiskeDeler } = finnEksepsjoner([ferdigprodukt(), medNetting(skruesett, ganger(4), mottak('300-007', [2, 120]))], 10)
    expect(eksepsjoner).toEqual([])
    expect(kritiskeDeler).toEqual([])
  })
})

describe('Kanseller mottak (FR-29)', () => {
  // Testeksempel 02: 300-005 Gassfjær har lager 100 og nettobehov 0 i hele horisonten. Mottaket på 50 i uke 5 trengs ikke.
  const gassfjaer = del('300-005', 'Gassfjær', '..2', 100, 0, 1, [{ varenummer: '200-001', antall: 1 }], 2, ['100-001', '200-001', '300-005'])
  const brutto = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]

  it('et mottak som ikke trengs, får eksepsjonen i mottaksuken', () => {
    const { eksepsjoner } = finnEksepsjoner([medNetting(gassfjaer, brutto, mottak('300-005', [5, 50]))], 10)
    expect(eksepsjoner).toEqual([{ ...KANSELLER_MOTTAK_02, excelRad: 2 }])
    expect(eksepsjoner[0]).toMatchObject({ uke: 5, antall: 50, excelRad: 2, horisont: 10 })
  })

  it('et mottak som trengs fra mottaksuken til uke H, får den ikke', () => {
    const lite = del('300-005', 'Gassfjær', '..2', 30, 0, 1, [{ varenummer: '200-001', antall: 1 }], 2, ['100-001', '200-001', '300-005'])
    // Lager 30 rekker til uke 3. Uten mottaket i uke 5 blir det nettobehov fra uke 4, så mottaket trengs.
    const { eksepsjoner } = finnEksepsjoner([medNetting(lite, brutto, mottak('300-005', [5, 50]))], 10)
    expect(eksepsjoner.filter((e) => e.kode === 'KANSELLER_MOTTAK')).toEqual([])
  })

  it('et mottak som er fremskyndet, får den aldri', () => {
    const d = del('300-005', 'Gassfjær', '.1', 75, 10, 2, [{ varenummer: '100-002', antall: 1 }], 2, ['100-002', '300-005'])
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, ganger(1), mottak('300-005', [4, 100]))], 10)
    expect(eksepsjoner.map((e) => e.kode)).toEqual(['MOTTAK_FORSINKET'])
  })

  it('nettingen kjøres uten annen fremskynding: et annet mottak kan ikke dekke behovet i stedet', () => {
    // To mottak, begge i uke 6 og 9. Lageret er tomt fra uke 2. Hvert mottak vurderes uten det andre og uten fremskynding.
    const d = del('300-005', 'Gassfjær', '..2', 20, 0, 1, [{ varenummer: '200-001', antall: 1 }], 2, ['100-001', '200-001', '300-005'])
    const { eksepsjoner } = finnEksepsjoner([medNetting(d, [10, 10, 0, 0, 0, 0, 0, 0, 0, 0], mottak('300-005', [6, 50], [9, 50]))], 10)
    expect(eksepsjoner.filter((e) => e.kode === 'KANSELLER_MOTTAK').map((e) => [e.uke, (e as { excelRad: number }).excelRad])).toEqual([
      [6, 2],
      [9, 3],
    ])
  })

  const enkel = (lager = 0) => del('300-005', 'Gassfjær', '..2', lager, 0, 1, [{ varenummer: '200-001', antall: 1 }], 2, ['100-001', '200-001', '300-005'])
  const kansellert = (funn: readonly Eksepsjon[]) =>
    funn.filter((e) => e.kode === 'KANSELLER_MOTTAK').map((e) => [e.uke, (e as { excelRad: number }).excelRad])

  it('et mottak som er fremskyndet for å dekke et behov før mottaksuken, får den aldri, selv om det ikke trengs derfra (uke 5 → 3)', () => {
    // Behov i uke 3 dekkes av mottaket i uke 5, som fremskyndes. Uten mottaket er det ikke behov fra uke 5, men mottaket er brukt.
    const { eksepsjoner } = finnEksepsjoner([medNetting(enkel(20), [10, 10, 10, 0, 0, 0, 0, 0, 0, 0], mottak('300-005', [5, 50]))], 10)
    expect(eksepsjoner.map((e) => [e.kode, e.uke])).toEqual([['MOTTAK_FORSINKET', 3]])
  })

  it('et mottak vurderes uten annen fremskynding: det andre mottaket kan ikke dekke behovet i stedet', () => {
    // A (uke 4) trengs for behovet i uke 5. Med fremskynding på, ville B (uke 8) blitt flyttet til uke 5 og A virket overflødig.
    const { eksepsjoner } = finnEksepsjoner([medNetting(enkel(), [0, 0, 0, 0, 10, 0, 0, 0, 0, 0], mottak('300-005', [4, 10], [8, 10]))], 10)
    expect(kansellert(eksepsjoner)).toEqual([[8, 3]])
  })

  it('bare behov fra mottaksuken til uke H teller: behov før mottaksuken, som et annet mottak dekker, gjør ikke mottaket nødvendig', () => {
    // Behov i uke 2 dekkes av A (uke 4, fremskyndet). B (uke 8) trengs ikke fra uke 8, selv om uke 2 har behov uten A.
    const { eksepsjoner } = finnEksepsjoner([medNetting(enkel(), [0, 10, 0, 0, 0, 0, 0, 0, 0, 0], mottak('300-005', [4, 10], [8, 10]))], 10)
    expect(eksepsjoner.filter((e) => e.kode === 'MOTTAK_FORSINKET').map((e) => e.uke)).toEqual([2])
    expect(kansellert(eksepsjoner)).toEqual([[8, 3]])
  })

  it('en uke utenfor horisonten gir ingen eksepsjon', () => {
    const { eksepsjoner } = finnEksepsjoner([medNetting(gassfjaer, brutto, mottak('300-005', [11, 50]))], 10)
    expect(eksepsjoner).toEqual([])
  })
})

describe('Kritiske deler og rekkefølgen (FR-13, arkitektur kap. 4)', () => {
  const sete = del('300-001', 'Sete', '.1', 200, 20, 2, [{ varenummer: '100-002', antall: 1 }])
  const hjul = del('300-003', 'Hjul', '.1', 80, 30, 1, [{ varenummer: '100-002', antall: 5 }], 1, ['100-002', '300-003'])
  const gass = del('300-005', 'Gassfjær', '.1', 75, 10, 2, [{ varenummer: '100-002', antall: 1 }], 2, ['100-002', '300-005'])
  const stolfot = del('300-006', 'Stolfot', '.1', 300, 0, 10, [{ varenummer: '100-002', antall: 1 }], 10, ['100-002', '300-006'])
  const alle = () => [
    ferdigprodukt(),
    medNetting(sete, ganger(1)),
    medNetting(hjul, ganger(5)),
    medNetting(gass, ganger(1), mottak('300-005', [4, 100])),
    medNetting(stolfot, ganger(1)),
  ]

  it('en del med minst én eksepsjon er kritisk, i stykklisterekkefølge, og de andre er det ikke', () => {
    expect(finnEksepsjoner(alle(), 10).kritiskeDeler).toEqual(['300-003', '300-005', '300-006'])
  })

  it('eksepsjonene står i stykklisterekkefølge, uavhengig av hvilken type de har', () => {
    expect(kodeOgUke(finnEksepsjoner(alle(), 10).eksepsjoner)).toEqual([
      ['300-003', 1, 'BESTILLING_FORSINKET'],
      ['300-005', 3, 'MOTTAK_FORSINKET'],
      ['300-006', null, 'LEDETID_OVERSKRIDER_HORISONT'],
    ])
  })

  it('hele delen kommer først, og så uke, og så typen i rekkefølgen i PRD §4.3', () => {
    // 300-006 får Ledetid (hele delen), Bestilling forsinket i uke 1 og Mottak forsinket i uke 1 (to typer i samme uke).
    const d = del('300-006', 'X', '.1', 0, 0, 10, [{ varenummer: '100-002', antall: 1 }], 10, ['100-002', '300-006'])
    const funn = finnEksepsjoner([medNetting(d, [40, 100, 0, 120, 140, 0, 80, 100, 120, 160], mottak('300-006', [3, 30]))], 10)
    expect(funn.eksepsjoner.map((e) => [e.uke, e.kode]).slice(0, 3)).toEqual([
      [null, 'LEDETID_OVERSKRIDER_HORISONT'],
      [1, 'BESTILLING_FORSINKET'],
      [1, 'MOTTAK_FORSINKET'],
    ])
    for (let i = 1; i < funn.eksepsjoner.length; i++) {
      expect(funn.eksepsjoner[i - 1]!.uke ?? 0).toBeLessThanOrEqual(funn.eksepsjoner[i]!.uke ?? 0)
    }
  })

  it('er ren: endrer ikke inndataene og gir samme svar to ganger (FR-8)', () => {
    const delene = alle()
    const kopi = structuredClone(delene)
    const første = finnEksepsjoner(delene, 10)
    expect(delene).toEqual(kopi)
    expect(finnEksepsjoner(delene, 10)).toEqual(første)
  })

  it('uten deler gir ingen eksepsjoner og ingen kritiske deler', () => {
    expect(finnEksepsjoner([], 10)).toEqual({ eksepsjoner: [], kritiskeDeler: [] })
  })
})

describe('eksepsjoner.ts er en ren fil i domene/ (AD-2, AD-7)', () => {
  const kilde = readFileSync(join(import.meta.dirname, '..', '..', 'src', 'domene', 'eksepsjoner.ts'), 'utf8')
    .split('\n')
    .filter((linje) => !linje.trimStart().startsWith('//'))
    .join('\n')

  it('importerer bare netting.ts og typer.ts', () => {
    const importer = [...kilde.matchAll(/from '([^']+)'/g)].map((m) => m[1])
    expect(importer.sort()).toEqual(['./netting.ts', './typer.ts'])
  })

  it('bruker ikke tid, tilfeldige tall eller nettleser', () => {
    expect(kilde).not.toMatch(/\b(window|document|localStorage|Math\.random|Date)\b/)
  })
})

// ---------------------------------------------------------------------------
// Fasittestene (SM-2): eksepsjonslisten er identisk med arket Eksepsjoner i fasiten
// ---------------------------------------------------------------------------

const TESTDATA = join(import.meta.dirname, '..', '..', 'testdata')

/** Kjører testeksemplet samme vei som appen: les → valider → byggStruktur → beregn (AD-16). Eksepsjonene finnes etterpå. */
function kjorTesteksempel(nr: string): { deler: DelResultat[]; mottak: PlanlagtMottak[]; horisont: number } {
  const fil = readFileSync(join(TESTDATA, `testeksempel-${nr}.xlsx`))
  const lest = les(fil, `testeksempel-${nr}.xlsx`)
  if (!lest.ok) throw new Error(`Testeksempel ${nr} kan ikke leses`)
  const validert = valider(lest.verdi)
  if (!validert.ok) throw new Error(`Testeksempel ${nr} er ugyldig`)
  const inndata = validert.verdi
  const resultat = beregnBestillingsplan(inndata, byggStruktur(inndata.stykkliste))
  return { deler: resultat.deler, mottak: inndata.planlagteMottak, horisont: inndata.horisont }
}

/** Eksepsjonene for et testeksempel, slik Story 2.5 kaller funksjonen. */
function funnFor(nr: string) {
  const { deler, mottak, horisont } = kjorTesteksempel(nr)
  return { deler, funn: finnEksepsjonerIResultat(deler, mottak, horisont) }
}

describe.each(['01', '02', '03', '04', '05'])('Fasittest: testeksempel %s (SM-2)', (nr) => {
  const { deler, funn } = funnFor(nr)
  const fasit = lesFasitEksepsjoner(nr)

  it('eksepsjonslisten er identisk med arket Eksepsjoner (varenummer, uke, type), uten andre eksepsjoner', () => {
    expect(funn.eksepsjoner.map((e) => ({ varenummer: e.varenummer, uke: e.uke, kode: e.kode }))).toEqual(fasit)
  })

  it('de kritiske delene er delene med minst én eksepsjon i fasiten, i stykklisterekkefølge', () => {
    const iFasit = new Set(fasit.map((e) => e.varenummer))
    expect(funn.kritiskeDeler).toEqual(deler.map((d) => d.del.varenummer).filter((vn) => iFasit.has(vn)))
  })
})

describe('Fasittest: testeksempel 01 i detalj (FR-13, FR-9)', () => {
  const { deler, funn } = funnFor('01')

  it('nøyaktig 300-003, 300-004, 300-005 og 300-006 er kritiske', () => {
    expect(funn.kritiskeDeler).toEqual(['300-003', '300-004', '300-005', '300-006'])
  })

  it('300-006 Stolfot har Ledetid overskrider horisont selv om nettobehovet er 0 i alle uker', () => {
    const stolfot = deler.find((d) => d.del.varenummer === '300-006')!
    expect(stolfot.nettobehov.every((n) => n === 0)).toBe(true)
    expect(funn.eksepsjoner.filter((e) => e.varenummer === '300-006').map((e) => e.kode)).toEqual(['LEDETID_OVERSKRIDER_HORISONT'])
  })

  it('opplysningene er de samme som i testene av delene (alle felt, ikke bare kode og uke)', () => {
    expect(funn.eksepsjoner).toEqual(EKSEPSJONER_01)
  })
})

describe('Fasittest: grensetilfellene i testeksempel 02 og 04', () => {
  it('Kanseller mottak for 300-005 Gassfjær i uke 5 finnes i testeksempel 02', () => {
    const { funn } = funnFor('02')
    expect(funn.eksepsjoner).toContainEqual(KANSELLER_MOTTAK_02)
  })

  it('300-026 i testeksempel 04 har både Bestilling forsinket og Mottak forsinket i uke 1, og 300-022 har produksjon forsinket', () => {
    const { funn } = funnFor('04')
    expect(funn.eksepsjoner.filter((e) => e.varenummer === '300-026')).toEqual(LASESKIVE_04)
    expect(funn.eksepsjoner).toContainEqual(PRODUKSJON_FORSINKET_04)
  })
})
