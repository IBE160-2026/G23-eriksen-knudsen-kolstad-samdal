// Reduseren for den felles tilstanden (Story 1.3, AD-13).

import { describe, expect, it } from 'vitest'
import { endreTilstand, startTilstand, type Tilstand } from '../../src/app/tilstand-handlinger.ts'
import type { Kjoring } from '../../src/domene/typer.ts'

// Reduseren ser ikke inni kjøringen, så et tomt objekt holder her.
const kjoring = {} as Kjoring

describe('endreTilstand', () => {
  it('starter uten kjøring og uten statusmelding', () => {
    expect(startTilstand).toEqual({ kjoring: null, statusmelding: '' })
  })

  it('viser og fjerner en kjøring', () => {
    const med = endreTilstand(startTilstand, { type: 'VIS_KJORING', kjoring })
    expect(med.kjoring).toBe(kjoring)
    expect(endreTilstand(med, { type: 'FJERN_KJORING' }).kjoring).toBeNull()
  })

  it('viser og fjerner en statusmelding uten å røre kjøringen', () => {
    const med: Tilstand = { kjoring, statusmelding: '' }
    const melding = endreTilstand(med, { type: 'VIS_STATUSMELDING', melding: 'Leser filen …' })
    expect(melding).toEqual({ kjoring, statusmelding: 'Leser filen …' })
    expect(endreTilstand(melding, { type: 'FJERN_STATUSMELDING' })).toEqual({ kjoring, statusmelding: '' })
  })

  it('endrer ikke tilstanden den får', () => {
    const for_ = { ...startTilstand }
    endreTilstand(for_, { type: 'VIS_STATUSMELDING', melding: 'x' })
    expect(for_).toEqual(startTilstand)
  })
})
