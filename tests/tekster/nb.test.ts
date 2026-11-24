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
