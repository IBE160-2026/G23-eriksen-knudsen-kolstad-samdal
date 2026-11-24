// Tester for de delte typene (Story 1.2).
// - Typekontrollene (expectTypeOf) kontrolleres av `npm run build` (tsc -b), og de kjøres også av Vitest.
// - Kodelistene kontrolleres mot PRD-en, arkitekturen og testdata/validering/.
// - Eksemplene i typer-eksempler.ts viser at typene kan holde det fasitfilene krever.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  ARKNAVN,
  DELSTYPER,
  EKSEPSJONSKODER,
  ENDRINGSKODER,
  FILFEILKODER,
  MPS_KOLONNER,
  PLANLAGTE_MOTTAK_KOLONNER,
  SAMMENLIGNINGSGRUPPER,
  STYKKLISTE_KOLONNER,
  VALG,
  VALIDERINGSKODER,
  type DelResultat,
  type Eksepsjon,
  type Eksepsjonskode,
  type Filfeilkode,
  type Kjoring,
  type Nivaa,
  type Sammenligningslinje,
  type Utfall,
  type Utregning,
  type Valg,
  type Valideringskode,
} from '../../src/domene/typer.ts'
import {
  EKSEPSJONER_01,
  HJUL_RESULTAT,
  KANSELLER_MOTTAK_02,
  KAPASITET_05,
  KJORING_01,
  LAGRET_KJORING_01,
  LASESKIVE_04,
  PRODUKSJON_FORSINKET_04,
  RAA_V_S01,
  SAMMENLIGNING_02_TIL_03,
  SAMMENLIGNING_03_TIL_02,
  VALIDERING_V_F01,
} from './typer-eksempler.ts'

const ROT = join(import.meta.dirname, '..', '..')

describe('typene (kontrolleres av tsc)', () => {
  it('Utfall snevres inn på ok (AD-5)', () => {
    const svar = { ok: true, verdi: 1 } as Utfall<number, { kode: 'TOM_FIL' }>
    if (svar.ok) expectTypeOf(svar.verdi).toEqualTypeOf<number>()
    else expectTypeOf(svar.feil).toEqualTypeOf<{ kode: 'TOM_FIL' }>()
  })

  it('valget, nivåene og kodene har nøyaktig de vedtatte verdiene', () => {
    expectTypeOf<Valg>().toEqualTypeOf<'BESTILLINGSPLAN' | 'PRODUKSJONSKAPASITET' | 'BEGGE'>() // FR-30
    expectTypeOf<Nivaa>().toEqualTypeOf<'0' | '.1' | '..2'>() // FR-3, AD-4
    expectTypeOf<Eksepsjonskode>().toEqualTypeOf<
      | 'LEDETID_OVERSKRIDER_HORISONT'
      | 'BESTILLING_FORSINKET'
      | 'BRUK_AV_SIKKERHETSLAGER'
      | 'MOTTAK_FORSINKET'
      | 'KANSELLER_MOTTAK'
    >() // AD-9
    expectTypeOf<Filfeilkode>().toEqualTypeOf<'IKKE_XLSX' | 'TOM_FIL' | 'SKADET_FIL' | 'IKKE_EXCEL' | 'PASSORDBESKYTTET'>()
  })

  it('Eksepsjon har én variant per kode, og en switch må dekke alle fem', () => {
    expectTypeOf<Eksepsjon['kode']>().toEqualTypeOf<Eksepsjonskode>()
    // Mangler en kode i switch-en, får `ingen` ikke typen never, og tsc -b feiler.
    const uke = (e: Eksepsjon): number | null => {
      switch (e.kode) {
        case 'LEDETID_OVERSKRIDER_HORISONT':
          expectTypeOf(e.uke).toEqualTypeOf<null>()
          return null
        case 'BESTILLING_FORSINKET':
        case 'BRUK_AV_SIKKERHETSLAGER':
        case 'MOTTAK_FORSINKET':
        case 'KANSELLER_MOTTAK':
          return e.uke
        default: {
          const ingen: never = e
          return ingen
        }
      }
    }
    expect(EKSEPSJONER_01.map(uke)).toEqual([1, 1, 3, null])
  })

  it('Utregning har tallene forklaringspanelet trenger (AD-8)', () => {
    expectTypeOf<Utregning>().toHaveProperty('beholdningForrigeUke').toEqualTypeOf<number>()
    expectTypeOf<Utregning>().toHaveProperty('planlagteMottak').toEqualTypeOf<number>()
    expectTypeOf<Utregning>()
      .toHaveProperty('bruttobehovFra')
      .toEqualTypeOf<{ varenummer: string; frigivelse: number; antall: number }[]>()
    expectTypeOf<Utregning>().toHaveProperty('disponibelForFremskynding').toEqualTypeOf<number>()
    expectTypeOf<Utregning>().toHaveProperty('disponibelEtterFremskynding').toEqualTypeOf<number>()
    expectTypeOf<Utregning>().toHaveProperty('sikkerhetslager').toEqualTypeOf<number>()
    expectTypeOf<Utregning>().toHaveProperty('nettobehov').toEqualTypeOf<number>()
    expectTypeOf<Utregning>().toHaveProperty('fremskyndedeMottak')
    expectTypeOf<Utregning>().toHaveProperty('forfaltMengde').toEqualTypeOf<number>()
  })

  it('DelResultat har de seks radene i FR-14 som serier per uke', () => {
    for (const rad of [
      'bruttobehov',
      'planlagteMottak',
      'forventetLagerbeholdning',
      'nettobehov',
      'planlagteOrdremottak',
      'planlagteOrdrefrigivelser',
    ] as const) {
      expectTypeOf<DelResultat[typeof rad]>().toEqualTypeOf<number[]>()
    }
  })

  it('Kjoring kan mangle resultat eller kapasitet etter valget (FR-30)', () => {
    expectTypeOf<Kjoring['resultat']>().toBeNullable()
    expectTypeOf<Kjoring['kapasitet']>().toBeNullable()
    expectTypeOf<Kjoring['sammenligning']>().toBeNullable()
  })

  // Godkjent 23.11.2026: meldingen på en «Borte»-linje er typenavnet, laget i tekster/ (se typer.ts).
  it('en BORTE-linje har bare det utdraget har, og meldingen er typenavnet (AD-10, AD-11)', () => {
    type Borte = Extract<Sammenligningslinje, { endring: 'BORTE' }>
    expectTypeOf<Borte>().not.toHaveProperty('melding')
    expectTypeOf<Borte>().not.toHaveProperty('eksepsjon')
  })
})

describe('kodelistene', () => {
  it('EKSEPSJONSKODER følger rekkefølgen i PRD §4.3 og AD-9, som også er sorteringen (kap. 4)', () => {
    expect(EKSEPSJONSKODER).toEqual([
      'LEDETID_OVERSKRIDER_HORISONT', // FR-9
      'BESTILLING_FORSINKET', // FR-10
      'BRUK_AV_SIKKERHETSLAGER', // FR-11
      'MOTTAK_FORSINKET', // FR-12
      'KANSELLER_MOTTAK', // FR-29
    ])
  })

  it('FILFEILKODER har én kode per tilfelle i NFR-9, FR-1 og EXPERIENCE.md, også passordbeskyttet', () => {
    expect(FILFEILKODER).toEqual(['IKKE_XLSX', 'TOM_FIL', 'SKADET_FIL', 'IKKE_EXCEL', 'PASSORDBESKYTTET'])
  })

  it('arkene og kolonneoverskriftene er de samme som i Excel-malen (FR-2)', () => {
    expect(ARKNAVN).toEqual(['Stykkliste', 'MPS', 'Planlagte mottak'])
    expect(STYKKLISTE_KOLONNER).toEqual([
      'Nivå',
      'Varenummer',
      'Beskrivelse',
      'Antall',
      'Type',
      'Lagerbeholdning',
      'Sikkerhetslager',
      'Ledetid (uker)',
    ])
    expect(MPS_KOLONNER).toEqual(['Uke', 'Antall ferdigprodukter'])
    expect(PLANLAGTE_MOTTAK_KOLONNER).toEqual(['Varenummer', 'Uke', 'Antall'])
  })

  it('valget, typene og sammenligningen har de vedtatte verdiene', () => {
    expect(VALG).toEqual(['BESTILLINGSPLAN', 'PRODUKSJONSKAPASITET', 'BEGGE']) // FR-30
    expect(DELSTYPER).toEqual(['FERDIGVARE', 'KJOPES_INN', 'PRODUSERES_SELV']) // FR-3
    expect(ENDRINGSKODER).toEqual(['NY', 'ENDRET_MENGDE', 'FJERNET', 'BORTE']) // AD-11
    expect(SAMMENLIGNINGSGRUPPER).toEqual(['BESTILLINGSFORSLAG', 'EKSEPSJON', 'DEL']) // AD-11
  })

  it('VALIDERINGSKODER har ingen duplikater', () => {
    expect(new Set(VALIDERINGSKODER).size).toBe(VALIDERINGSKODER.length)
  })
})

// Antall feil per fil og hvilken regel filen tester, står i testdata/validering/README.md (dokumentert).
// Navnene på kodene og hvordan reglene er delt i koder, er godkjent av koordinatoren 23.11.2026.
describe('valideringskodene dekker testdata/validering/', () => {
  // Hvilken kode hver valideringsfil skal gi, ut fra regelen i testdata/validering/README.md.
  const KODE_PER_FIL: Record<string, Valideringskode[]> = {
    'V-S01': ['RADER_IKKE_SAMMENHENGENDE'],
    'V-S02': ['RADER_INGEN_NIVAA_1'],
    'V-S03': ['RADER_FOR_MANGE'],
    'V-S04': ['NIVAA_UGYLDIG'],
    'V-S05': ['NIVAA_FORSTE_RAD_IKKE_0'],
    'V-S06': ['NIVAA_FLERE_NIVAA_0'],
    'V-S07': ['NIVAA_2_UTEN_NIVAA_1_OVER'],
    'V-S08': ['VARENUMMER_MANGLER'],
    'V-S09': ['VARENUMMER_UNDER_SEG_SELV'],
    'V-S10': ['BESKRIVELSE_MANGLER'],
    'V-S11': ['BESKRIVELSE_ULIK'],
    'V-S12': ['ANTALL_FYLT_UT_FOR_NIVAA_0'],
    'V-S13': ['ANTALL_MANGLER'],
    'V-S14': ['ANTALL_UGYLDIG'],
    'V-S15': ['ANTALL_UGYLDIG'],
    'V-S16': ['ANTALL_UGYLDIG'],
    'V-S17': ['TYPE_UGYLDIG'],
    'V-S18': ['TYPE_FERDIGVARE_IKKE_NIVAA_0'],
    'V-S19': ['TYPE_NIVAA_0_IKKE_FERDIGVARE'],
    'V-S20': ['TYPE_ULIK'],
    'V-S21': ['TYPE_KJOPES_INN_HAR_UNDERDELER'],
    'V-S22': ['UNDERDELER_ULIKE'],
    'V-S23': ['LAGERBEHOLDNING_UGYLDIG'],
    'V-S24': ['SIKKERHETSLAGER_UGYLDIG'],
    'V-S25': ['LAGERBEHOLDNING_MANGLER'],
    'V-S26': ['LAGERBEHOLDNING_FYLT_UT_SENERE'],
    'V-S27': ['LEDETID_UGYLDIG'],
    'V-S28': ['LEDETID_MANGLER'],
    'V-S29': ['LEDETID_FYLT_UT_SENERE'],
    'V-M01': ['MPS_ANTALL_UGYLDIG'],
    'V-M02': ['MPS_UKE_ETTER_HULL'],
    'V-M03': ['MPS_HORISONT_UGYLDIG'],
    'V-M04': ['MPS_ANTALL_UGYLDIG'],
    'V-M05': ['MPS_ANTALL_UGYLDIG'],
    'V-P01': ['MOTTAK_VARENUMMER_UKJENT'],
    'V-P02': ['MOTTAK_UKE_UTENFOR_HORISONT'],
    'V-P03': ['MOTTAK_UKE_UTENFOR_HORISONT'],
    'V-P04': ['MOTTAK_ANTALL_UGYLDIG'],
    'V-F01': ['ARK_MANGLER'],
    'V-F02': ['OVERSKRIFT_MANGLER'],
    'V-F03': ['GAMMEL_MAL'],
    'V-F05': ['ANTALL_UGYLDIG', 'MPS_ANTALL_UGYLDIG', 'MOTTAK_UKE_UTENFOR_HORISONT'], // D9 = 0, uke 3 = −5, B2 = uke 0
    'V-F06': ['OVERSKRIFT_MANGLER', 'MOTTAK_ANTALL_UGYLDIG'], // H1 og C3 = 0
    'V-G01': [],
    'V-G02': [],
    'V-G03': [],
    'V-G04': [],
    'V-G05': [], // lagret fra Excel med en formel i F5 (Story 1.5)
  }

  // Filfeil, ikke valideringsfeil (NFR-9).
  const FILFEIL_PER_FIL: Record<string, Filfeilkode> = {
    'V-F04': 'IKKE_XLSX',
    'V-F07': 'SKADET_FIL',
    'V-F08': 'TOM_FIL',
    'V-F09': 'IKKE_EXCEL',
    'V-F10': 'PASSORDBESKYTTET', // lagret fra Excel med passord (Story 1.5)
  }

  // Kodene for regler i FR-3 som ingen valideringsfil tester ennå.
  const KODER_UTEN_FIL: Valideringskode[] = [
    'SIKKERHETSLAGER_MANGLER',
    'SIKKERHETSLAGER_FYLT_UT_SENERE',
    'MOTTAK_UKE_IKKE_HELTALL',
  ]

  it('hver fil i testdata/validering/ har en kode eller en filfeil', () => {
    const filer = readdirSync(join(ROT, 'testdata', 'validering'))
      .filter((f) => /^V-[A-Z]\d+\.(xlsx|csv)$/.test(f))
      .map((f) => f.replace(/\.(xlsx|csv)$/, ''))
      .sort()
    const kjente = [...Object.keys(KODE_PER_FIL), ...Object.keys(FILFEIL_PER_FIL)].sort()
    expect(filer).toEqual(kjente)
  })

  it('README og koden er enige om antall feil per fil', () => {
    const readme = readFileSync(join(ROT, 'testdata', 'validering', 'README.md'), 'utf8')
    for (const [fil, koder] of Object.entries(KODE_PER_FIL)) {
      const linje = readme.split('\n').find((l) => l.startsWith(`| \`${fil}.xlsx\``))
      expect(linje, `${fil} mangler i README`).toBeDefined()
      const antall = Number(linje!.split('|')[3].trim())
      expect(antall, fil).toBe(koder.length)
    }
  })

  it('hver valideringskode brukes av en fil, eller står på listen over koder uten fil', () => {
    const brukt = new Set(Object.values(KODE_PER_FIL).flat())
    const ubrukt = VALIDERINGSKODER.filter((k) => !brukt.has(k))
    expect(ubrukt).toEqual(KODER_UTEN_FIL)
  })
})

// Testene under kontrollerer eksemplene i typer-eksempler.ts, som er skrevet av fra fasitfilene.
// At eksemplene kompilerer, viser at typene kan holde dataene. Testene her sjekker utvalgte verdier
// i eksemplene. De tester ikke beregningen, lesingen eller sammenligningen, som kommer i senere stories.
describe('eksemplene fra fasitfilene kan skrives med typene', () => {
  it('300-003 Hjul (fasit 01): de seks radene og utregningen har lengde H, og uke 1 har tallene i FR-18', () => {
    const rader = [
      HJUL_RESULTAT.bruttobehov,
      HJUL_RESULTAT.planlagteMottak,
      HJUL_RESULTAT.forventetLagerbeholdning,
      HJUL_RESULTAT.nettobehov,
      HJUL_RESULTAT.planlagteOrdremottak,
      HJUL_RESULTAT.planlagteOrdrefrigivelser,
      HJUL_RESULTAT.utregning,
    ]
    expect(rader.every((r) => r.length === 10)).toBe(true)
    // FR-18: «lagerbeholdning = 80, planlagte mottak = 0, bruttobehov = 100, disponibel beholdning = -20, SS = 30, nettobehov = 50»
    expect(HJUL_RESULTAT.utregning[0]).toMatchObject({
      beholdningForrigeUke: 80,
      planlagteMottak: 0,
      bruttobehov: 100,
      disponibelEtterFremskynding: -20,
      sikkerhetslager: 30,
      nettobehov: 50,
      forfaltMengde: 50,
    })
  })

  it('eksepsjonene fra fasit 01, 02 og 04 har varenummer, uke og kode som i fasiten, og opplysningene FR-10 krever', () => {
    expect(EKSEPSJONER_01.map(({ varenummer, uke, kode }) => [varenummer, uke, kode])).toEqual([
      ['300-003', 1, 'BESTILLING_FORSINKET'],
      ['300-004', 1, 'BRUK_AV_SIKKERHETSLAGER'],
      ['300-005', 3, 'MOTTAK_FORSINKET'],
      ['300-006', null, 'LEDETID_OVERSKRIDER_HORISONT'],
    ])
    expect(KANSELLER_MOTTAK_02.uke).toBe(5)
    // FR-10: samme uke, ulik disponibel beholdning før og etter fremskynding
    expect(LASESKIVE_04[0].disponibel).toBe(-10)
    expect(LASESKIVE_04[1].disponibelForFremskynding).toBe(-40)
    // FR-10: «Står delen under flere overordnede deler, nevnes alle.»
    expect(PRODUKSJON_FORSINKET_04.forsinker).toEqual({
      type: 'PRODUKSJON',
      av: [
        { varenummer: '200-010', beskrivelse: 'Sete' },
        { varenummer: '200-011', beskrivelse: 'Rygg' },
      ],
    })
  })

  it('eksemplene fra arket Sammenligning i fasit 03 har 11 linjer hver vei, med gruppene i fasitens rekkefølge', () => {
    expect(SAMMENLIGNING_02_TIL_03.linjer).toHaveLength(11)
    expect(SAMMENLIGNING_03_TIL_02.linjer).toHaveLength(11)
    // Sjekker rekkefølgen i eksemplene (som er fasitens). Regelen i AD-11 testes i Story 4.2.
    const grupper = (s: { linjer: { gruppe: string }[] }) => [...new Set(s.linjer.map((l) => l.gruppe))]
    expect(grupper(SAMMENLIGNING_02_TIL_03)).toEqual(['BESTILLINGSFORSLAG', 'EKSEPSJON'])
    expect(grupper(SAMMENLIGNING_03_TIL_02)).toEqual(['BESTILLINGSFORSLAG', 'EKSEPSJON'])
  })

  it('eksempelet fra arket Kapasitet i fasit 05 har H uker, 16 begrensende deler og ledig beholdning etter FR-31', () => {
    expect(KAPASITET_05.fraLager).toHaveLength(8)
    expect(KAPASITET_05.medPlanlagteMottak).toHaveLength(8)
    // FR-32: raden med planlagte mottak er aldri lavere enn raden fra lager
    expect(KAPASITET_05.medPlanlagteMottak.every((n, i) => n >= KAPASITET_05.fraLager[i])).toBe(true)
    // FR-33: én begrensende del per rad og uke i fasit 05
    expect(KAPASITET_05.begrensende).toHaveLength(16)
    expect(KAPASITET_05.grunnlag.every((d) => d.ledig === Math.max(0, d.lagerbeholdning - d.sikkerhetslager))).toBe(true)
  })

  it('utdraget og kjøringen for testeksempel 01 har eksepsjonene, delene og de kritiske delene fra fasiten (AD-10, AD-12)', () => {
    expect(LAGRET_KJORING_01.eksepsjoner).toHaveLength(4)
    expect(LAGRET_KJORING_01.deler).toHaveLength(9) // arket Materiell i fasit 01
    expect(KJORING_01.resultat.kritiskeDeler).toEqual(['300-003', '300-004', '300-005', '300-006'])
  })

  it('rådata for V-S01 merker den tomme raden, og V-F01 gir én feil og én kontroll som er hoppet over', () => {
    expect(RAA_V_S01.stykkliste.tomRadMedInnholdUnder).toBe(9)
    expect(VALIDERING_V_F01.feil).toHaveLength(1)
    expect(VALIDERING_V_F01.hoppetOver[0]).toEqual({
      ark: 'Planlagte mottak',
      felt: 'Uke',
      fordi: { kode: 'ARK_MANGLER', ark: 'MPS' },
    })
  })
})
