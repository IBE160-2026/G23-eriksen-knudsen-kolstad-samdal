// Et uventet unntak i lesing eller validering gir UVENTET_FEIL, og aldri et halvt resultat (Story 1.10, AD-5).
// Lesingen og valideringen er byttet ut med funksjoner som kaster.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const { lesMock, validerMock, beregnMock } = vi.hoisted(() => ({ lesMock: vi.fn(), validerMock: vi.fn(), beregnMock: vi.fn() }))
vi.mock('../../src/excel/les.ts', () => ({ les: lesMock }))
vi.mock('../../src/domene/valider.ts', () => ({ valider: validerMock }))
vi.mock('../../src/domene/beregn.ts', () => ({ beregnBestillingsplan: beregnMock }))

import { kjorFil } from '../../src/worker/kjor.ts'

const MELDING = { innhold: new ArrayBuffer(8), filnavn: 'a.xlsx', valg: 'BESTILLINGSPLAN' } as const

describe('uventede feil i worker-en', () => {
  beforeEach(() => {
    lesMock.mockReset()
    validerMock.mockReset()
    beregnMock.mockReset()
  })

  it('et unntak i lesingen gir UVENTET_FEIL, ikke et unntak', () => {
    lesMock.mockImplementation(() => {
      throw new Error('uventet i lesing')
    })
    expect(kjorFil(MELDING)).toEqual({ type: 'UVENTET_FEIL' })
    expect(validerMock).not.toHaveBeenCalled()
  })

  it('et unntak i valideringen gir UVENTET_FEIL uten spor av det som var lest (ingen halvt resultat)', () => {
    lesMock.mockReturnValue({ ok: true, verdi: { filnavn: 'a.xlsx' } })
    validerMock.mockImplementation(() => {
      throw new Error('uventet i validering')
    })
    const svar = kjorFil(MELDING)
    expect(svar).toEqual({ type: 'UVENTET_FEIL' })
    expect(Object.keys(svar)).toEqual(['type'])
  })

  it('et unntak i beregningen gir UVENTET_FEIL uten resultat og uten spor av det som var lest og validert (Story 2.5)', async () => {
    const GYLDIG_INNDATA = {
      stykkliste: [],
      horisont: 8,
      prognostiserteBehov: [],
      planlagteMottak: [],
    }
    lesMock.mockReturnValue({ ok: true, verdi: { filnavn: 'a.xlsx' } })
    validerMock.mockReturnValue({ ok: true, verdi: GYLDIG_INNDATA })
    beregnMock.mockImplementation(() => {
      throw new Error('uventet i beregningen')
    })
    const svar = kjorFil(MELDING)
    expect(beregnMock).toHaveBeenCalledOnce()
    expect(svar).toEqual({ type: 'UVENTET_FEIL' })
    expect(Object.keys(svar)).toEqual(['type'])
  })

  it('Produksjonskapasitet beregner ikke bestillingsplanen, så beregningen kan ikke feile den kjøringen', () => {
    lesMock.mockReturnValue({ ok: true, verdi: { filnavn: 'a.xlsx' } })
    validerMock.mockReturnValue({ ok: true, verdi: { stykkliste: [], horisont: 8, prognostiserteBehov: [], planlagteMottak: [] } })
    expect(kjorFil({ ...MELDING, valg: 'PRODUKSJONSKAPASITET' })).toMatchObject({ type: 'GYLDIG', resultat: null })
  })

  it('en kjøring som går bra etter en som feilet, påvirkes ikke (ingen tilstand mellom kjøringer)', () => {
    lesMock.mockImplementationOnce(() => {
      throw new Error('uventet')
    })
    expect(kjorFil(MELDING)).toEqual({ type: 'UVENTET_FEIL' })
    lesMock.mockReturnValue({ ok: false, feil: { kode: 'TOM_FIL' } })
    expect(kjorFil(MELDING)).toEqual({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } })
  })
})
