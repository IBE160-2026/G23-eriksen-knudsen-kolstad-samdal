// Eksempler fra fasitfilene, skrevet med de delte typene (Story 1.2).
// `satisfies` gjør at `npm run build` (tsc -b) feiler hvis en type ikke kan holde det fasiten krever.
//
// Verdiene er skrevet av fra testdata/*-fasit.xlsx, testdata/testeksempel-0X.xlsx og
// testdata/validering/README.md. Fasittestene som leser filene direkte, kommer i Story 2.2 (AD-16).

import type {
  DelResultat,
  Eksepsjon,
  Filfeil,
  Kapasitet,
  Kjoring,
  LagretKjoring,
  RaaArk,
  Resultat,
  Sammenligning,
  StrukturDel,
  Utfall,
  Utregning,
  Valideringsfeil,
  Valideringsresultat,
} from '../../src/domene/typer.ts'

// ---------------------------------------------------------------------------
// Testeksempel 01: 300-003 Hjul (fasit 01, arkene Fasittabell, Utregning og Bestillingsforslag)
// ---------------------------------------------------------------------------

/** 300-003 Hjul står på rad 5 i testeksempel-01.xlsx: .1, antall 5, Kjøpes inn, lager 80, SS 30, L 1. */
export const HJUL: StrukturDel = {
  varenummer: '300-003',
  beskrivelse: 'Hjul',
  type: 'KJOPES_INN',
  nivaa: '.1',
  lagerbeholdning: 80,
  sikkerhetslager: 30,
  ledetid: 1,
  overordnede: [{ varenummer: '100-002', antall: 5 }],
  forekomster: [{ excelRad: 5, nivaa: '.1', overordnet: '100-002', antall: 5, underdeler: [] }],
  lavnivaakode: 1,
  ledetidFraFerdigproduktet: 1, // Kontorstol Basic 0 + Hjul 1
  stiForLedetid: ['100-002', '300-003'],
  antallPerFerdigprodukt: 5,
}

/** Frigivelsene til 100-002 Kontorstol Basic (fasit 01, Fasittabell). */
const FRIGIVELSER_100_002 = [20, 25, 30, 20, 35, 30, 25, 40, 30, 20]

/** Radene for 300-003 i arket Fasittabell i fasit 01. */
const HJUL_RADER = {
  bruttobehov: [100, 125, 150, 100, 175, 150, 125, 200, 150, 100],
  planlagteMottak: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  forventetLagerbeholdning: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  nettobehov: [50, 125, 150, 100, 175, 150, 125, 200, 150, 100],
  planlagteOrdremottak: [50, 125, 150, 100, 175, 150, 125, 200, 150, 100],
  planlagteOrdrefrigivelser: [175, 150, 100, 175, 150, 125, 200, 150, 100, 0],
}

/**
 * Utregningen per uke, slik arket Utregning i fasit 01 skriver den:
 * «Uke 1: Bruttobehov = 5 × 20 (100-002) = 100. Disponibel = 80 + 0 − 100 = -20. Nettobehov = maks(0, 30 − (-20)) = 50.»
 * Hjul har ingen planlagte mottak, så beholdningen forrige uke er forventet lagerbeholdning forrige uke.
 */
export const HJUL_UTREGNING: Utregning[] = HJUL_RADER.bruttobehov.map((bruttobehov, i) => {
  const beholdningForrigeUke = i === 0 ? 80 : HJUL_RADER.forventetLagerbeholdning[i - 1]
  const disponibel = beholdningForrigeUke + 0 - bruttobehov
  return {
    uke: i + 1,
    beholdningForrigeUke,
    planlagteMottak: 0,
    bruttobehov,
    prognostiserteBehov: null,
    bruttobehovFra: [{ varenummer: '100-002', frigivelse: FRIGIVELSER_100_002[i], antall: 5 }],
    disponibelForFremskynding: disponibel,
    disponibelEtterFremskynding: disponibel,
    sikkerhetslager: 30,
    nettobehov: HJUL_RADER.nettobehov[i],
    fremskyndedeMottak: [],
    fremskyndetIkkeKommet: 0,
    forfaltMengde: i === 0 ? 50 : 0, // «Frigis i uke 1 − 1 = 0, før horisonten: forfalt, legges i uke 1.»
  }
})

export const HJUL_RESULTAT = {
  del: HJUL,
  ...HJUL_RADER,
  forfaltMengde: 50, // FR-8: frigivelse 175 i uke 1 = 50 forfalt + 125 vanlig
  utregning: HJUL_UTREGNING,
  kritisk: true,
} satisfies DelResultat

// ---------------------------------------------------------------------------
// Eksepsjoner fra fasitene (arket Eksepsjoner)
// ---------------------------------------------------------------------------

/** Alle de fire eksepsjonene i fasit 01, i fasitens rekkefølge. */
export const EKSEPSJONER_01 = [
  {
    // «Lager blir -20 i uke 1. Bestillingen på 50 måtte vært frigitt i uke 0 … frigivelsen på 175 i uke 1,
    //  men kommer tidligst i uke 2. Leveranse til kunde blir forsinket.»
    kode: 'BESTILLING_FORSINKET',
    varenummer: '300-003',
    beskrivelse: 'Hjul',
    delstype: 'KJOPES_INN',
    uke: 1,
    disponibel: -20,
    forfaltMengde: 50,
    skulleFrigis: 0,
    frigivelseUke1: 175,
    tidligsteMottaksuke: 2,
    forsinker: { type: 'LEVERANSE_TIL_KUNDE' },
  },
  {
    // «Lager blir 10 i uke 1, under sikkerhetslager 20 … Bestillingen på 10 måtte vært frigitt i uke 0.
    //  De 10 er forfalt og tatt med i frigivelsen på 60 i uke 1, men kommer tidligst i uke 2.»
    kode: 'BRUK_AV_SIKKERHETSLAGER',
    varenummer: '300-004',
    beskrivelse: 'Armlene',
    delstype: 'KJOPES_INN',
    uke: 1,
    disponibel: 10,
    sikkerhetslager: 20,
    forfaltMengde: 10,
    skulleFrigis: 0,
    frigivelseUke1: 60,
    tidligsteMottaksuke: 2,
  },
  {
    // «Lager blir 0 i uke 3, under sikkerhetslager 10, før mottaket kommer. Det planlagte mottaket på 100
    //  i uke 4 må fremskyndes til uke 3 hos leverandøren.» Mottaket står på rad 2 i Planlagte mottak.
    kode: 'MOTTAK_FORSINKET',
    varenummer: '300-005',
    beskrivelse: 'Gassfjær',
    delstype: 'KJOPES_INN',
    uke: 3,
    mottaksuke: 4,
    antall: 100,
    excelRad: 2,
    disponibelForFremskynding: 0,
    sikkerhetslager: 10,
  },
  {
    // «Ledetiden fra ferdigproduktet (10 uker: Kontorstol Basic 0 + Stolfot 10) er minst like lang som horisonten (10 uker).»
    kode: 'LEDETID_OVERSKRIDER_HORISONT',
    varenummer: '300-006',
    beskrivelse: 'Stolfot',
    delstype: 'KJOPES_INN',
    uke: null,
    ledetidFraFerdigproduktet: 10,
    sti: [
      { varenummer: '100-002', beskrivelse: 'Kontorstol Basic', ledetid: 0 },
      { varenummer: '300-006', beskrivelse: 'Stolfot', ledetid: 10 },
    ],
    horisont: 10,
  },
] satisfies Eksepsjon[]

/** Fasit 02: «Det planlagte mottaket på 50 i uke 5 trengs ikke i horisonten (uke 5–10).» Rad 3 i Planlagte mottak. */
export const KANSELLER_MOTTAK_02 = {
  kode: 'KANSELLER_MOTTAK',
  varenummer: '300-005',
  beskrivelse: 'Gassfjær',
  delstype: 'KJOPES_INN',
  uke: 5,
  antall: 50,
  excelRad: 3,
  horisont: 10,
} satisfies Eksepsjon

/**
 * Fasit 02: «Bestillingen på 10 måtte vært frigitt i uke -1 … men kommer tidligst i uke 3.»
 * 300-003 Ryggtrekk står på rad 8 i testeksempel-02.xlsx (..2, SS 30, L 2).
 */
export const SIKKERHETSLAGER_02 = {
  kode: 'BRUK_AV_SIKKERHETSLAGER',
  varenummer: '300-003',
  beskrivelse: 'Ryggtrekk',
  delstype: 'KJOPES_INN',
  uke: 1,
  disponibel: 20,
  sikkerhetslager: 30,
  forfaltMengde: 10,
  skulleFrigis: -1,
  frigivelseUke1: 35,
  tidligsteMottaksuke: 3,
} satisfies Eksepsjon

/**
 * Fasit 04, 300-026 Låseskive i uke 1: to eksepsjoner med ulik disponibel beholdning (FR-10).
 * Bestilling forsinket oppgir −10 (etter fremskynding), Mottak forsinket −40 (før).
 */
export const LASESKIVE_04 = [
  {
    kode: 'BESTILLING_FORSINKET',
    varenummer: '300-026',
    beskrivelse: 'Låseskive',
    delstype: 'KJOPES_INN',
    uke: 1,
    disponibel: -10,
    forfaltMengde: 10,
    skulleFrigis: 0,
    frigivelseUke1: 110,
    tidligsteMottaksuke: 2,
    forsinker: { type: 'LEVERANSE_TIL_KUNDE' },
  },
  {
    kode: 'MOTTAK_FORSINKET',
    varenummer: '300-026',
    beskrivelse: 'Låseskive',
    delstype: 'KJOPES_INN',
    uke: 1,
    mottaksuke: 3,
    antall: 30,
    excelRad: 3,
    disponibelForFremskynding: -40,
    sikkerhetslager: 0,
  },
] satisfies Eksepsjon[]

/**
 * Fasit 04, 300-022 Skruesett M8 (nivå ..2, L = 7) under to overordnede deler:
 * «Lager blir -80 i uke 7. Bestillingen på 80 måtte vært frigitt i uke 0 … frigivelsen på 140 i uke 1,
 *  men kommer tidligst i uke 8. Produksjonen av Sete (200-010) og Rygg (200-011) blir forsinket.» (FR-10)
 */
export const PRODUKSJON_FORSINKET_04 = {
  kode: 'BESTILLING_FORSINKET',
  varenummer: '300-022',
  beskrivelse: 'Skruesett M8',
  delstype: 'KJOPES_INN',
  uke: 7,
  disponibel: -80,
  forfaltMengde: 80,
  skulleFrigis: 0,
  frigivelseUke1: 140,
  tidligsteMottaksuke: 8,
  forsinker: {
    type: 'PRODUKSJON',
    av: [
      { varenummer: '200-010', beskrivelse: 'Sete' },
      { varenummer: '200-011', beskrivelse: 'Rygg' },
    ],
  },
} satisfies Eksepsjon

// ---------------------------------------------------------------------------
// Resultat, lagret kjøring og kjøring
// ---------------------------------------------------------------------------

export const RESULTAT_01 = {
  deler: [HJUL_RESULTAT],
  bestillingsforslag: [
    // De første linjene i arket Bestillingsforslag i fasit 01
    { varenummer: '100-002', beskrivelse: 'Kontorstol Basic', frigivelsesuke: 1, mengde: 20, forfaltMengde: 0, art: 'PRODUKSJONSORDRE' },
    { varenummer: '300-003', beskrivelse: 'Hjul', frigivelsesuke: 1, mengde: 175, forfaltMengde: 50, art: 'INNKJOP' },
    { varenummer: '300-004', beskrivelse: 'Armlene', frigivelsesuke: 1, mengde: 60, forfaltMengde: 10, art: 'INNKJOP' },
    { varenummer: '300-007', beskrivelse: 'Skruesett', frigivelsesuke: 1, mengde: 70, forfaltMengde: 0, art: 'INNKJOP' },
    { varenummer: '300-008', beskrivelse: 'Trekk', frigivelsesuke: 1, mengde: 5, forfaltMengde: 0, art: 'INNKJOP' },
  ],
  eksepsjoner: EKSEPSJONER_01,
  kritiskeDeler: ['300-003', '300-004', '300-005', '300-006'], // FR-13
} satisfies Resultat

/** Utdraget av kjøringen for testeksempel 01 (AD-10). Delene er arket Materiell i fasit 01. */
export const LAGRET_KJORING_01 = {
  schemaVersjon: 1,
  ferdigprodukt: { varenummer: '100-002', beskrivelse: 'Kontorstol Basic' },
  tidspunkt: '2026-11-23T12:00:00.000Z',
  deler: [
    { varenummer: '100-002', beskrivelse: 'Kontorstol Basic' },
    { varenummer: '300-001', beskrivelse: 'Sete' },
    { varenummer: '300-002', beskrivelse: 'Rygg' },
    { varenummer: '300-003', beskrivelse: 'Hjul' },
    { varenummer: '300-004', beskrivelse: 'Armlene' },
    { varenummer: '300-005', beskrivelse: 'Gassfjær' },
    { varenummer: '300-006', beskrivelse: 'Stolfot' },
    { varenummer: '300-007', beskrivelse: 'Skruesett' },
    { varenummer: '300-008', beskrivelse: 'Trekk' },
  ],
  bestillingsforslag: RESULTAT_01.bestillingsforslag.map(({ varenummer, frigivelsesuke, mengde }) => ({
    varenummer,
    frigivelsesuke,
    mengde,
  })),
  eksepsjoner: EKSEPSJONER_01.map(({ varenummer, uke, kode }) => ({ varenummer, uke, kode })),
} satisfies LagretKjoring

export const KJORING_01 = {
  valg: 'BESTILLINGSPLAN',
  filnavn: 'testeksempel-01.xlsx',
  tidspunkt: '2026-11-23T12:00:00.000Z',
  ferdigprodukt: { varenummer: '100-002', beskrivelse: 'Kontorstol Basic' },
  horisont: 10,
  resultat: RESULTAT_01,
  kapasitet: null,
  sammenligning: null, // ingen tidligere kjøring
  lagring: 'LAGRET',
} satisfies Kjoring

// ---------------------------------------------------------------------------
// Sammenligning (arket Sammenligning i fasit 03, begge veier)
// ---------------------------------------------------------------------------

export const SAMMENLIGNING_02_TIL_03 = {
  linjer: [
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '100-001', uke: 1, mengdeFor: 45, mengdeEtter: 60 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '200-001', uke: 1, mengdeFor: 55, mengdeEtter: 70 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-001', uke: 1, mengdeFor: 10, mengdeEtter: 25 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'NY', varenummer: '300-002', uke: 1, mengdeEtter: 30 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-002', uke: 2, mengdeFor: 180, mengdeEtter: 240 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '200-002', uke: 3, mengdeFor: 25, mengdeEtter: 40 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-003', uke: 1, mengdeFor: 35, mengdeEtter: 50 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-004', uke: 1, mengdeFor: 130, mengdeEtter: 205 },
    { gruppe: 'EKSEPSJON', endring: 'NY', varenummer: '200-002', uke: 2, kode: 'MOTTAK_FORSINKET' },
    { gruppe: 'EKSEPSJON', endring: 'BORTE', varenummer: '200-002', uke: 3, kode: 'MOTTAK_FORSINKET' },
    { gruppe: 'EKSEPSJON', endring: 'NY', varenummer: '300-004', uke: 1, kode: 'BRUK_AV_SIKKERHETSLAGER' },
  ],
} satisfies Sammenligning

export const SAMMENLIGNING_03_TIL_02 = {
  linjer: [
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '100-001', uke: 1, mengdeFor: 60, mengdeEtter: 45 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '200-001', uke: 1, mengdeFor: 70, mengdeEtter: 55 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-001', uke: 1, mengdeFor: 25, mengdeEtter: 10 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'FJERNET', varenummer: '300-002', uke: 1, mengdeFor: 30 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-002', uke: 2, mengdeFor: 240, mengdeEtter: 180 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '200-002', uke: 3, mengdeFor: 40, mengdeEtter: 25 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-003', uke: 1, mengdeFor: 50, mengdeEtter: 35 },
    { gruppe: 'BESTILLINGSFORSLAG', endring: 'ENDRET_MENGDE', varenummer: '300-004', uke: 1, mengdeFor: 205, mengdeEtter: 130 },
    { gruppe: 'EKSEPSJON', endring: 'BORTE', varenummer: '200-002', uke: 2, kode: 'MOTTAK_FORSINKET' },
    { gruppe: 'EKSEPSJON', endring: 'NY', varenummer: '200-002', uke: 3, kode: 'MOTTAK_FORSINKET' },
    { gruppe: 'EKSEPSJON', endring: 'BORTE', varenummer: '300-004', uke: 1, kode: 'BRUK_AV_SIKKERHETSLAGER' },
  ],
} satisfies Sammenligning

/** En del som er lagt til i stykklisten, vises som egen linje (FR-20). Ikke med i fasit 03. */
export const SAMMENLIGNING_NY_DEL = {
  linjer: [{ gruppe: 'DEL', endring: 'NY', varenummer: '300-009', beskrivelse: 'Nakkestøtte' }],
} satisfies Sammenligning

// ---------------------------------------------------------------------------
// Produksjonskapasitet (arket Kapasitet i fasit 05)
// ---------------------------------------------------------------------------

const ledetid = (rad: 'FRA_LAGER' | 'MED_PLANLAGTE_MOTTAK', uke: number, varenummer: string, beskrivelse: string) =>
  ({ rad, uke, varenummer, beskrivelse, aarsak: 'LEDETID' }) as const
const lager = (rad: 'FRA_LAGER' | 'MED_PLANLAGTE_MOTTAK', uke: number, varenummer: string, beskrivelse: string) =>
  ({ rad, uke, varenummer, beskrivelse, aarsak: 'LAGER' }) as const

export const KAPASITET_05 = {
  fraLager: [10, 10, 18, 30, 30, 30, 30, 30],
  medPlanlagteMottak: [10, 10, 18, 30, 30, 30, 35, 35],
  begrensende: [
    ledetid('FRA_LAGER', 1, '100-004', 'Kontorstol Kompakt'),
    ledetid('FRA_LAGER', 2, '200-021', 'Rygg'),
    ledetid('FRA_LAGER', 3, '200-020', 'Sete'),
    ...[4, 5, 6, 7, 8].map((uke) => lager('FRA_LAGER', uke, '300-033', 'Ryggplate')),
    ledetid('MED_PLANLAGTE_MOTTAK', 1, '100-004', 'Kontorstol Kompakt'),
    ledetid('MED_PLANLAGTE_MOTTAK', 2, '200-021', 'Rygg'),
    ledetid('MED_PLANLAGTE_MOTTAK', 3, '200-020', 'Sete'),
    ...[4, 5, 6].map((uke) => lager('MED_PLANLAGTE_MOTTAK', uke, '300-033', 'Ryggplate')),
    ...[7, 8].map((uke) => lager('MED_PLANLAGTE_MOTTAK', uke, '300-032', 'Skruesett M6')),
  ],
  grunnlag: [
    { varenummer: '100-004', beskrivelse: 'Kontorstol Kompakt', type: 'FERDIGVARE', lagerbeholdning: 12, sikkerhetslager: 2, ledig: 10, ledetid: 1, planlagteMottak: [0, 0, 0, 0, 0, 0, 0, 0] },
    { varenummer: '200-020', beskrivelse: 'Sete', type: 'PRODUSERES_SELV', lagerbeholdning: 8, sikkerhetslager: 0, ledig: 8, ledetid: 2, planlagteMottak: [0, 0, 0, 0, 0, 0, 0, 0] },
    { varenummer: '300-031', beskrivelse: 'Seteplate', type: 'KJOPES_INN', lagerbeholdning: 40, sikkerhetslager: 10, ledig: 30, ledetid: 2, planlagteMottak: [0, 0, 0, 0, 0, 0, 0, 0] },
    { varenummer: '300-032', beskrivelse: 'Skruesett M6', type: 'KJOPES_INN', lagerbeholdning: 140, sikkerhetslager: 20, ledig: 120, ledetid: 1, planlagteMottak: [0, 0, 0, 0, 0, 0, 0, 0] },
    { varenummer: '200-021', beskrivelse: 'Rygg', type: 'PRODUSERES_SELV', lagerbeholdning: 0, sikkerhetslager: 0, ledig: 0, ledetid: 1, planlagteMottak: [0, 0, 0, 0, 0, 0, 0, 0] },
    { varenummer: '300-033', beskrivelse: 'Ryggplate', type: 'KJOPES_INN', lagerbeholdning: 25, sikkerhetslager: 5, ledig: 20, ledetid: 3, planlagteMottak: [0, 0, 0, 0, 30, 0, 0, 0] },
    { varenummer: '300-034', beskrivelse: 'Hjul', type: 'KJOPES_INN', lagerbeholdning: 150, sikkerhetslager: 30, ledig: 120, ledetid: 1, planlagteMottak: [0, 0, 100, 0, 0, 0, 0, 0] },
  ],
} satisfies Kapasitet

// ---------------------------------------------------------------------------
// Lesing, filfeil og validering (testdata/validering/README.md)
// ---------------------------------------------------------------------------

/**
 * V-S01: stykklisten slutter ved rad 9, og det står innhold i rad 10–11.
 * Forkortet eksempel: bare rad 2 er med i Stykkliste, MPS og Planlagte mottak. Verdiene på rad 2 er fra filen.
 */
export const RAA_V_S01 = {
  filnavn: 'V-S01.xlsx',
  alleArk: ['Veiledning', 'Stykkliste', 'MPS', 'Planlagte mottak', 'Veien videre'],
  stykkliste: {
    overskrifter: {
      Nivå: 'A',
      Varenummer: 'B',
      Beskrivelse: 'C',
      Antall: 'D',
      Type: 'E',
      Lagerbeholdning: 'F',
      Sikkerhetslager: 'G',
      'Ledetid (uker)': 'H',
    },
    rader: [
      {
        excelRad: 2,
        celler: { Nivå: '0', Varenummer: '100-001', Beskrivelse: 'Kontorstol Pro', Antall: null, Type: 'Ferdigvare', Lagerbeholdning: 20, Sikkerhetslager: 5, 'Ledetid (uker)': 1 },
      },
    ],
    tomRadMedInnholdUnder: 9,
  },
  mps: { overskrifter: { Uke: 'A', 'Antall ferdigprodukter': 'B' }, rader: [{ excelRad: 2, celler: { Uke: 1, 'Antall ferdigprodukter': 30 } }] },
  planlagteMottak: {
    overskrifter: { Varenummer: 'A', Uke: 'B', Antall: 'C' },
    rader: [{ excelRad: 2, celler: { Varenummer: '200-002', Uke: 4, Antall: 40 } }],
  },
} satisfies RaaArk

/** V-F01: arket MPS mangler. Stykkliste og Planlagte mottak er forkortet til én rad. */
export const RAA_V_F01 = {
  filnavn: 'V-F01.xlsx',
  alleArk: ['Veiledning', 'Stykkliste', 'Planlagte mottak', 'Veien videre'],
  stykkliste: { ...RAA_V_S01.stykkliste, tomRadMedInnholdUnder: null },
  mps: null,
  planlagteMottak: RAA_V_S01.planlagteMottak,
} satisfies RaaArk

/** V-F02: overskriften «Ledetid (uker)» mangler, så kolonnen er null (FR-2). */
export const RAA_V_F02_STYKKLISTE_OVERSKRIFTER = {
  ...RAA_V_S01.stykkliste.overskrifter,
  'Ledetid (uker)': null,
} satisfies NonNullable<RaaArk['stykkliste']>['overskrifter']

export const FILFEIL_V_F08: Utfall<RaaArk, Filfeil> = { ok: false, feil: { kode: 'TOM_FIL' } }

/** Én valideringsfeil per fil, med ark, sted og felt fra testdata/validering/README.md. */
export const VALIDERINGSFEIL_EKSEMPLER = [
  { kode: 'RADER_IKKE_SAMMENHENGENDE', ark: 'Stykkliste', sted: { type: 'RAD', excelRad: 9 }, felt: 'Rader' }, // V-S01
  { kode: 'RADER_FOR_MANGE', ark: 'Stykkliste', sted: { type: 'RAD', excelRad: 1002 }, felt: 'Rader' }, // V-S03
  { kode: 'NIVAA_UGYLDIG', ark: 'Stykkliste', sted: { type: 'CELLE', celle: 'A8', excelRad: 8 }, felt: 'Nivå', verdi: '3' }, // V-S04
  { kode: 'ANTALL_UGYLDIG', ark: 'Stykkliste', sted: { type: 'CELLE', celle: 'D9', excelRad: 9 }, felt: 'Antall', verdi: 'fem' }, // V-S16
  // V-S22: 200-001 Sete står på rad 3 og rad 11, med ulike underdeler. README oppgir rad 12.
  { kode: 'UNDERDELER_ULIKE', ark: 'Stykkliste', sted: { type: 'RAD', excelRad: 12 }, felt: 'Underdeler', varenummer: '200-001', andreRader: [3, 11] },
  { kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: { type: 'UKE', uke: 3 }, felt: 'Antall ferdigprodukter', verdi: -5 }, // V-M01
  { kode: 'MOTTAK_UKE_UTENFOR_HORISONT', ark: 'Planlagte mottak', sted: { type: 'CELLE', celle: 'B3', excelRad: 3 }, felt: 'Uke', verdi: 0 }, // V-P02
  { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', sted: { type: 'OVERSKRIFT', celle: 'H1' }, felt: 'Ledetid (uker)' }, // V-F02
  { kode: 'GAMMEL_MAL', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' }, // V-F03
] satisfies Valideringsfeil[]

/** V-F01: én feil, og ukene i Planlagte mottak kontrolleres ikke (FR-2). */
export const VALIDERING_V_F01 = {
  feil: [{ kode: 'ARK_MANGLER', ark: 'MPS', sted: { type: 'ARK' }, felt: 'Ark' }],
  hoppetOver: [{ ark: 'Planlagte mottak', felt: 'Uke', fordi: { kode: 'ARK_MANGLER', ark: 'MPS' } }],
} satisfies Valideringsresultat
