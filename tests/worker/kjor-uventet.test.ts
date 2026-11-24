// Et uventet unntak i lesing eller validering gir UVENTET_FEIL, og aldri et halvt resultat (Story 1.10, AD-5).
// Lesingen og valideringen er byttet ut med funksjoner som kaster.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const { lesMock, validerMock } = vi.hoisted(() => ({ lesMock: vi.fn(), validerMock: vi.fn() }))
vi.mock('../../src/excel/les.ts', () => ({ les: lesMock }))
vi.mock('../../src/domene/valider.ts', () => ({ valider: validerMock }))

import { kjorFil } from '../../src/worker/kjor.ts'

const MELDING = { innhold: new ArrayBuffer(8), filnavn: 'a.xlsx', valg: 'BESTILLINGSPLAN' } as const

describe('uventede feil i worker-en', () => {
  beforeEach(() => {
    lesMock.mockReset()
    validerMock.mockReset()
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

  it('en kjøring som går bra etter en som feilet, påvirkes ikke (ingen tilstand mellom kjøringer)', () => {
    lesMock.mockImplementationOnce(() => {
      throw new Error('uventet')
    })
    expect(kjorFil(MELDING)).toEqual({ type: 'UVENTET_FEIL' })
    lesMock.mockReturnValue({ ok: false, feil: { kode: 'TOM_FIL' } })
    expect(kjorFil(MELDING)).toEqual({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } })
  })
})
