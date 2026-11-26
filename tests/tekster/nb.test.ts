// Tester for tekstene i tekster/nb.ts (Story 1.6, AD-9, NFR-7, EXPERIENCE.md › Voice and Tone).

import { describe, expect, it } from 'vitest'
import { VALIDERINGSKODER, type Celleverdi, type Valideringsfeil } from '../../src/domene/typer.ts'
import { filfeilOgValidering } from '../../src/tekster/nb.ts'

const maler = filfeilOgValidering.struktur
type Strukturkode = keyof typeof maler

function tekst(feil: Valideringsfeil): string {
  return maler[feil.kode as Strukturkode](feil)
}

const MPS_TEKST = 'Prognostiserte behov (arket MPS)'

const STRUKTURFEIL: Valideringsfeil[] = [
  { kode: 'ARK_MANGLER', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' },
  { kode: 'ARK_MANGLER', ark: 'MPS', sted: { type: 'ARK' }, felt: 'Ark' },
  { kode: 'ARK_MANGLER', ark: 'Planlagte mottak', sted: { type: 'ARK' }, felt: 'Ark' },
  { kode: 'GAMMEL_MAL', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' },
  { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', sted: { type: 'OVERSKRIFT', celle: 'H1' }, felt: 'Ledetid (uker)' },
  { kode: 'OVERSKRIFT_MANGLER', ark: 'MPS', sted: { type: 'OVERSKRIFT', celle: 'B1' }, felt: 'Antall ferdigprodukter' },
  { kode: 'OVERSKRIFT_MANGLER', ark: 'Planlagte mottak', sted: { type: 'OVERSKRIFT', celle: 'A1' }, felt: 'Varenummer' },
]

describe('filfeilOgValidering.struktur', () => {
  it('har en mal for hver strukturkode', () => {
    expect(Object.keys(maler).sort()).toEqual(['ARK_MANGLER', 'GAMMEL_MAL', 'OVERSKRIFT_MANGLER'])
  })

  it.each(STRUKTURFEIL.map((feil) => [`${feil.kode} på ${feil.ark}`, feil] as const))(
    '%s: ingen kode, og arket og stedet er nevnt',
    (_navn, feil) => {
      const t = tekst(feil)
      for (const kode of VALIDERINGSKODER) expect(t).not.toContain(kode)
      expect(t).toContain(feil.ark === 'MPS' ? MPS_TEKST : feil.ark)
      if (feil.sted.type === 'OVERSKRIFT') {
        expect(t).toContain(feil.sted.celle)
        expect(t).toContain(`«${feil.felt}»`)
      }
      expect(t).not.toContain('!')
    },
  )

  it('MPS skrives «Prognostiserte behov (arket MPS)», aldri MPS alene', () => {
    for (const feil of STRUKTURFEIL.filter((f) => f.ark === 'MPS')) {
      const t = tekst(feil)
      expect(t).toContain(MPS_TEKST)
      expect(t.replace(MPS_TEKST, '')).not.toContain('MPS')
    }
  })

  it('GAMMEL_MAL gir teksten fra EXPERIENCE.md ordrett', () => {
    expect(maler.GAMMEL_MAL({ kode: 'GAMMEL_MAL', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' })).toBe(
      'Arket Stykkliste mangler. Filen ser ut til å følge en gammel mal (arkene Produkt og Komponenter). Last ned malen fra startsiden og flytt dataene over.',
    )
  })
})

describe('filfeilOgValidering.mpsOgMottak (Story 1.9)', () => {
  const mpsOgMottak = filfeilOgValidering.mpsOgMottak
  type MpsOgMottakKode = keyof typeof mpsOgMottak
  const mal = (feil: Valideringsfeil): string => mpsOgMottak[feil.kode as MpsOgMottakKode](feil)

  const uke = (n: number) => ({ type: 'UKE', uke: n }) as const
  const celle = (c: string, excelRad: number) => ({ type: 'CELLE', celle: c, excelRad }) as const

  const FEIL: Valideringsfeil[] = [
    { kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: uke(3), felt: 'Antall ferdigprodukter', verdi: -5 },
    { kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: uke(2), felt: 'Antall ferdigprodukter', verdi: 30.5 },
    { kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: uke(2), felt: 'Antall ferdigprodukter', verdi: 'tretti' },
    { kode: 'MPS_UKE_ETTER_HULL', ark: 'MPS', sted: uke(10), felt: 'Antall ferdigprodukter', verdi: 30 },
    { kode: 'MPS_HORISONT_UGYLDIG', ark: 'MPS', sted: uke(8), felt: 'Antall ferdigprodukter', verdi: null },
    { kode: 'MPS_HORISONT_UGYLDIG', ark: 'MPS', sted: uke(2), felt: 'Antall ferdigprodukter', verdi: null },
    { kode: 'MPS_HORISONT_UGYLDIG', ark: 'MPS', sted: uke(1), felt: 'Antall ferdigprodukter', verdi: null },
    { kode: 'MPS_HORISONT_UGYLDIG', ark: 'MPS', sted: uke(13), felt: 'Antall ferdigprodukter', verdi: 20 },
    { kode: 'MOTTAK_VARENUMMER_UKJENT', ark: 'Planlagte mottak', sted: celle('A3', 3), felt: 'Varenummer', verdi: '300-099' },
    { kode: 'MOTTAK_VARENUMMER_UKJENT', ark: 'Planlagte mottak', sted: celle('A3', 3), felt: 'Varenummer', verdi: null },
    { kode: 'MOTTAK_UKE_IKKE_HELTALL', ark: 'Planlagte mottak', sted: celle('B5', 5), felt: 'Uke', verdi: 'fire' },
    { kode: 'MOTTAK_UKE_IKKE_HELTALL', ark: 'Planlagte mottak', sted: celle('B5', 5), felt: 'Uke', verdi: null },
    { kode: 'MOTTAK_UKE_UTENFOR_HORISONT', ark: 'Planlagte mottak', sted: celle('B4', 4), felt: 'Uke', verdi: 0 },
    { kode: 'MOTTAK_UKE_UTENFOR_HORISONT', ark: 'Planlagte mottak', sted: celle('B3', 3), felt: 'Uke', verdi: 11 },
    { kode: 'MOTTAK_ANTALL_UGYLDIG', ark: 'Planlagte mottak', sted: celle('C5', 5), felt: 'Antall', verdi: 'ca. 40' },
    { kode: 'MOTTAK_ANTALL_UGYLDIG', ark: 'Planlagte mottak', sted: celle('C3', 3), felt: 'Antall', verdi: null },
  ]

  it('har en mal for hver av de sju kodene', () => {
    expect(Object.keys(mpsOgMottak).sort()).toEqual([
      'MOTTAK_ANTALL_UGYLDIG',
      'MOTTAK_UKE_IKKE_HELTALL',
      'MOTTAK_UKE_UTENFOR_HORISONT',
      'MOTTAK_VARENUMMER_UKJENT',
      'MPS_ANTALL_UGYLDIG',
      'MPS_HORISONT_UGYLDIG',
      'MPS_UKE_ETTER_HULL',
    ])
    for (const kode of Object.keys(mpsOgMottak)) expect(FEIL.some((f) => f.kode === kode), kode).toBe(true)
  })

  it.each(FEIL.map((feil) => [`${feil.kode} (${String(feil.verdi)})`, feil] as const))(
    '%s: ingen kode, og arket, stedet og feltet står først',
    (_navn, feil) => {
      const t = mal(feil)
      for (const kode of VALIDERINGSKODER) expect(t).not.toContain(kode)
      const sted = feil.sted.type === 'UKE' ? `uke ${feil.sted.uke}` : feil.sted.type === 'CELLE' ? `rad ${feil.sted.excelRad}` : ''
      const ark = feil.ark === 'MPS' ? MPS_TEKST : feil.ark
      expect(t.startsWith(`${ark}, ${sted}, ${feil.felt}: `)).toBe(true)
      expect(t).not.toContain('!')
      if (feil.ark === 'MPS') expect(t.replace(MPS_TEKST, '')).not.toContain('MPS')
    },
  )

  it('uke 0 gir teksten fra EXPERIENCE.md ordrett', () => {
    expect(
      mpsOgMottak.MOTTAK_UKE_UTENFOR_HORISONT({
        kode: 'MOTTAK_UKE_UTENFOR_HORISONT',
        ark: 'Planlagte mottak',
        sted: { type: 'CELLE', celle: 'B4', excelRad: 4 },
        felt: 'Uke',
        verdi: 0,
      }),
    ).toBe('Planlagte mottak, rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.')
  })

  it('uke 11 (etter horisonten) og uke −1 (før horisonten) gir hver sin tekst ordrett', () => {
    const utenfor = (verdi: Celleverdi): string =>
      mpsOgMottak.MOTTAK_UKE_UTENFOR_HORISONT({
        kode: 'MOTTAK_UKE_UTENFOR_HORISONT',
        ark: 'Planlagte mottak',
        sted: { type: 'CELLE', celle: 'B3', excelRad: 3 },
        felt: 'Uke',
        verdi,
      })
    expect(utenfor(11)).toBe(
      'Planlagte mottak, rad 3, Uke: uke 11 er etter horisonten. Horisonten er ukene som er fylt ut i Prognostiserte behov (arket MPS).',
    )
    expect(utenfor(-1)).toBe('Planlagte mottak, rad 3, Uke: uke −1 er før horisonten. Første uke i horisonten er uke 1.')
    expect(utenfor(' 11 ')).toBe(utenfor(11))
  })

  it('verdien skrives med norsk desimaltegn og minustegn', () => {
    expect(mal(FEIL[0])).toContain('«−5»')
    expect(mal(FEIL[1])).toContain('«30,5»')
  })

  it('horisonten: for kort, ingen uker og for lang gir hver sin tekst', () => {
    // Med hull (uke 1–5 og 7–9 fylt ut) er bare de sammenhengende ukene fra uke 1 talt.
    expect(mal(FEIL[4])).toContain('bare 7 uker er fylt ut sammenhengende fra uke 1')
    expect(mal(FEIL[5])).toContain('bare 1 uke er fylt ut sammenhengende fra uke 1')
    expect(mal(FEIL[6])).toContain('ingen uker er fylt ut sammenhengende fra uke 1')
    expect(mal(FEIL[7])).toContain('mer enn 12 uker')
  })
})

describe('filfeilOgValidering.stykkliste (Story 1.8)', () => {
  const stykkliste = filfeilOgValidering.stykkliste
  type StykklisteKode = keyof typeof stykkliste
  const mal = (feil: Valideringsfeil): string => stykkliste[feil.kode as StykklisteKode](feil)

  const celle = (c: string, excelRad: number) => ({ type: 'CELLE', celle: c, excelRad }) as const
  const rad = (excelRad: number) => ({ type: 'RAD', excelRad }) as const
  const f = (kode: Valideringsfeil['kode'], felt: Valideringsfeil['felt'], sted: Valideringsfeil['sted'], resten: Partial<Valideringsfeil> = {}): Valideringsfeil => ({
    kode,
    ark: 'Stykkliste',
    sted,
    felt,
    ...resten,
  })

  /** Én eksempelfeil per kode, med verdiene fra valideringsfilene (testdata/validering/README.md). */
  const EKSEMPLER: Valideringsfeil[] = [
    f('RADER_IKKE_SAMMENHENGENDE', 'Rader', rad(9)),
    f('RADER_FOR_MANGE', 'Rader', rad(1002)),
    f('RADER_INGEN_NIVAA_1', 'Rader', rad(2)),
    f('NIVAA_UGYLDIG', 'Nivå', celle('A8', 8), { verdi: '3' }),
    f('NIVAA_UGYLDIG', 'Nivå', celle('A8', 8), { verdi: null }),
    f('NIVAA_FORSTE_RAD_IKKE_0', 'Nivå', celle('A2', 2), { verdi: '.1' }),
    f('NIVAA_FLERE_NIVAA_0', 'Nivå', celle('A11', 11), { verdi: '0' }),
    f('NIVAA_2_UTEN_NIVAA_1_OVER', 'Nivå', celle('A3', 3), { verdi: '..2' }),
    f('VARENUMMER_MANGLER', 'Varenummer', celle('B8', 8), { verdi: null }),
    f('VARENUMMER_UNDER_SEG_SELV', 'Varenummer', celle('B6', 6), { verdi: '200-001', varenummer: '200-001', andreRader: [3] }),
    f('BESKRIVELSE_MANGLER', 'Beskrivelse', celle('C9', 9), { verdi: null }),
    f('BESKRIVELSE_ULIK', 'Beskrivelse', celle('C7', 7), { verdi: 'Skruesett M8', varenummer: '300-002', andreRader: [5] }),
    f('ANTALL_FYLT_UT_FOR_NIVAA_0', 'Antall', celle('D2', 2), { verdi: 1 }),
    f('ANTALL_MANGLER', 'Antall', celle('D9', 9), { verdi: null }),
    f('ANTALL_UGYLDIG', 'Antall', celle('D9', 9), { verdi: 'fem' }),
    f('ANTALL_UGYLDIG', 'Antall', celle('D4', 4), { verdi: 1.5 }),
    f('TYPE_UGYLDIG', 'Type', celle('E8', 8), { verdi: 'Råvare (Kjøpes inn)' }),
    f('TYPE_UGYLDIG', 'Type', celle('E8', 8), { verdi: null }),
    f('TYPE_FERDIGVARE_IKKE_NIVAA_0', 'Type', celle('E9', 9), { verdi: 'Ferdigvare' }),
    f('TYPE_NIVAA_0_IKKE_FERDIGVARE', 'Type', celle('E2', 2), { verdi: 'Komponent (Produseres selv)' }),
    f('TYPE_ULIK', 'Type', celle('E7', 7), { verdi: 'Komponent (Produseres selv)', varenummer: '300-002', andreRader: [5] }),
    f('TYPE_KJOPES_INN_HAR_UNDERDELER', 'Type', celle('E3', 3), { verdi: 'Komponent (Kjøpes inn)', varenummer: '200-001', andreRader: [4, 5] }),
    f('UNDERDELER_ULIKE', 'Underdeler', rad(12), { varenummer: '200-001', andreRader: [3, 11] }),
    f('LAGERBEHOLDNING_MANGLER', 'Lagerbeholdning', celle('F8', 8), { verdi: null }),
    f('LAGERBEHOLDNING_UGYLDIG', 'Lagerbeholdning', celle('F9', 9), { verdi: -5 }),
    f('LAGERBEHOLDNING_FYLT_UT_SENERE', 'Lagerbeholdning', celle('F7', 7), { verdi: 10, varenummer: '300-002', andreRader: [5] }),
    f('SIKKERHETSLAGER_MANGLER', 'Sikkerhetslager', celle('G8', 8), { verdi: null }),
    f('SIKKERHETSLAGER_UGYLDIG', 'Sikkerhetslager', celle('G4', 4), { verdi: 2.5 }),
    f('SIKKERHETSLAGER_FYLT_UT_SENERE', 'Sikkerhetslager', celle('G7', 7), { verdi: 5, varenummer: '300-002', andreRader: [5] }),
    f('LEDETID_MANGLER', 'Ledetid (uker)', celle('H10', 10), { verdi: null }),
    f('LEDETID_UGYLDIG', 'Ledetid (uker)', celle('H9', 9), { verdi: 0 }),
    f('LEDETID_FYLT_UT_SENERE', 'Ledetid (uker)', celle('H7', 7), { verdi: 1, varenummer: '300-002', andreRader: [5] }),
  ]

  const STYKKLISTEKODER = VALIDERINGSKODER.filter((k) => /^(RADER|NIVAA|VARENUMMER|BESKRIVELSE|ANTALL|TYPE|UNDERDELER|LAGERBEHOLDNING|SIKKERHETSLAGER|LEDETID)_/.test(k))

  it('har en mal for hver av de 29 kodene for Stykkliste, og ingen andre', () => {
    expect(STYKKLISTEKODER).toHaveLength(29)
    expect(Object.keys(stykkliste).sort()).toEqual([...STYKKLISTEKODER].sort())
    for (const kode of STYKKLISTEKODER) expect(EKSEMPLER.some((e) => e.kode === kode), kode).toBe(true)
  })

  it.each(EKSEMPLER.map((feil) => [`${feil.kode} (${String(feil.verdi ?? 'tom')})`, feil] as const))(
    '%s: ingen kode, og arket, stedet og feltet står først',
    (_navn, feil) => {
      const t = mal(feil)
      for (const kode of VALIDERINGSKODER) expect(t).not.toContain(kode)
      const rad = feil.sted.type === 'CELLE' || feil.sted.type === 'RAD' ? feil.sted.excelRad : 0
      expect(t.startsWith(`Stykkliste, rad ${rad}, ${feil.felt}: `)).toBe(true)
      expect(t).not.toContain('!')
      expect(t).not.toContain('undefined')
      expect(t).not.toContain('[object')
    },
  )

  it('meldingene nevner varenummeret og radene de gjelder', () => {
    const tekst = (kode: string) => mal(EKSEMPLER.find((e) => e.kode === kode)!)
    expect(tekst('UNDERDELER_ULIKE')).toContain('«200-001»')
    expect(tekst('UNDERDELER_ULIKE')).toContain('rad 3 og 11')
    expect(tekst('TYPE_KJOPES_INN_HAR_UNDERDELER')).toContain('rad 4 og 5')
    expect(tekst('BESKRIVELSE_ULIK')).toContain('rad 5 for varenummer 300-002')
    expect(tekst('VARENUMMER_UNDER_SEG_SELV')).toContain('Se rad 3.')
  })

  it('verdien skrives med norsk desimaltegn og minustegn, og tomt nivå og tom type har egne tekster', () => {
    const tekst = (kode: string, verdi: Celleverdi) => mal({ ...EKSEMPLER.find((e) => e.kode === kode)!, verdi })
    expect(tekst('ANTALL_UGYLDIG', 1.5)).toContain('«1,5»')
    expect(tekst('LAGERBEHOLDNING_UGYLDIG', -5)).toContain('«−5»')
    expect(tekst('NIVAA_UGYLDIG', null)).toContain('nivået mangler')
    expect(tekst('NIVAA_UGYLDIG', '3')).toContain('«3» er ikke et nivå')
    expect(tekst('TYPE_UGYLDIG', null)).toContain('typen mangler')
  })

  it('en rad som peker på flere rader, skrives «rad 4, 5 og 6»', () => {
    const feil: Valideringsfeil = {
      kode: 'TYPE_KJOPES_INN_HAR_UNDERDELER',
      ark: 'Stykkliste',
      sted: { type: 'CELLE', celle: 'E3', excelRad: 3 },
      felt: 'Type',
      varenummer: '200-001',
      andreRader: [4, 5, 6],
    }
    expect(mal(feil)).toContain('rad 4, 5 og 6')
  })

  it('radene sorteres, og mange rader kortes ned (gjennomgangen av PR #33)', () => {
    const medRader = (andreRader: number[]): Valideringsfeil => ({
      kode: 'TYPE_KJOPES_INN_HAR_UNDERDELER',
      ark: 'Stykkliste',
      sted: { type: 'CELLE', celle: 'E3', excelRad: 3 },
      felt: 'Type',
      varenummer: '200-001',
      andreRader,
    })
    expect(mal(medRader([9, 4, 6]))).toContain('rad 4, 6 og 9.')
    expect(mal(medRader([4, 5, 6, 7, 8, 9]))).toContain('rad 4, 5, 6, 7, 8 og 9.')
    expect(mal(medRader([4, 5, 6, 7, 8, 9, 10, 11]))).toContain('rad 4, 5, 6, 7, 8 og 3 til.')
    // Uten rader står ikke «rad » alene.
    expect(mal(medRader([]))).toContain('andre rader')
    expect(mal(medRader([]))).not.toMatch(/rad [.,s]/)
  })
})

// Hver kode som valideringen kan gi, har en tekstmal (AD-9). Fanger en ny kode uten mal.
describe('alle valideringskodene har en mal', () => {
  const alleMaler: Record<string, unknown> = {
    ...filfeilOgValidering.struktur,
    ...filfeilOgValidering.stykkliste,
    ...filfeilOgValidering.mpsOgMottak,
  }

  it.each(VALIDERINGSKODER.map((kode) => [kode] as const))('%s har en mal', (kode) => {
    expect(typeof alleMaler[kode], kode).toBe('function')
  })

  it('ingen mal mangler en kode, og ingen mal står uten kode', () => {
    expect(Object.keys(alleMaler).sort()).toEqual([...VALIDERINGSKODER].sort())
  })
})
