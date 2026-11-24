// Tester for tekstene i tekster/nb.ts (Story 1.6, AD-9, NFR-7, EXPERIENCE.md › Voice and Tone).

import { describe, expect, it } from 'vitest'
import { VALIDERINGSKODER, type Valideringsfeil } from '../../src/domene/typer.ts'
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
