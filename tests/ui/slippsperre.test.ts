// Sperren mot filer som slippes utenfor opplastingssonen (Story 1.11). Avgjørelsen testes her.
// At nettleseren faktisk stopper slippet på Ny kjøring, Resultat og Veiledning, testes i e2e/opplasting.spec.ts.

import { describe, expect, it } from 'vitest'
import { SLIPPSONE, skalSperres } from '../../src/ui/felles/slippsperre.ts'

/** Et enkelt mål med `closest`, slik et DOM-element har. `iSone` sier om det ligger i en slippsone. */
function mal(iSone: boolean) {
  return { closest: (velger: string) => (iSone && velger === `[${SLIPPSONE}]` ? ({} as Element) : null) } as unknown as EventTarget
}

describe('skalSperres', () => {
  it('filer utenfor en slippsone sperres', () => {
    expect(skalSperres(['Files'], mal(false))).toBe(true)
    expect(skalSperres(['Files', 'application/x-moz-file'], mal(false))).toBe(true)
  })

  it('filer uten mål (for eksempel på vinduet) sperres', () => {
    expect(skalSperres(['Files'], null)).toBe(true)
  })

  it('filer i opplastingssonen sperres ikke, der tar sonen imot dem', () => {
    expect(skalSperres(['Files'], mal(true))).toBe(false)
  })

  it('et tekstnode-mål bruker forelderen', () => {
    const tekstnode = { parentElement: mal(true) } as unknown as EventTarget
    expect(skalSperres(['Files'], tekstnode)).toBe(false)
    expect(skalSperres(['Files'], { parentElement: mal(false) } as unknown as EventTarget)).toBe(true)
  })

  it('tekst og lenker som dras, berøres ikke, så vanlig dra og slipp virker', () => {
    expect(skalSperres(['text/plain'], mal(false))).toBe(false)
    expect(skalSperres(['text/uri-list', 'text/html'], mal(false))).toBe(false)
    expect(skalSperres([], mal(false))).toBe(false)
    expect(skalSperres(undefined, mal(false))).toBe(false)
  })
})
