// Nøkkelen for introduksjonssiden (Story 1.3, AD-10, FR-27). Blokkert lagring gir «ikke sett»,
// og skriving som feiler, ignoreres.

import { describe, expect, it } from 'vitest'
import {
  NOKKEL_INTRO_SETT,
  lagreIntroSett,
  lesIntroSett,
  type Lager,
} from '../../src/lagring/lagrede-kjoringer.ts'

function minneLager(): Lager & { data: Map<string, string> } {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (nokkel) => data.get(nokkel) ?? null,
    setItem: (nokkel, verdi) => void data.set(nokkel, verdi),
  }
}

const blokkertLager: Lager = {
  getItem: () => {
    throw new DOMException('Lagring blokkert', 'SecurityError')
  },
  setItem: () => {
    throw new DOMException('Lagring full', 'QuotaExceededError')
  },
}

describe('cosi-mrp:intro-sett', () => {
  it('har nøkkelen fra AD-10', () => {
    expect(NOKKEL_INTRO_SETT).toBe('cosi-mrp:intro-sett')
  })

  it('første besøk: nøkkelen mangler, så introduksjonen er ikke sett', () => {
    expect(lesIntroSett(minneLager())).toBe(false)
  })

  it('etter lagring er introduksjonen sett', () => {
    const lager = minneLager()
    lagreIntroSett(lager)
    expect(lager.data.has(NOKKEL_INTRO_SETT)).toBe(true)
    expect(lesIntroSett(lager)).toBe(true)
  })

  it('blokkert lagring: lesing gir «ikke sett», og skriving kaster ikke', () => {
    expect(lesIntroSett(blokkertLager)).toBe(false)
    expect(() => lagreIntroSett(blokkertLager)).not.toThrow()
  })

  it('uten lagring i det hele tatt: lesing gir «ikke sett», og skriving kaster ikke', () => {
    expect(lesIntroSett(null)).toBe(false)
    expect(() => lagreIntroSett(null)).not.toThrow()
  })
})
