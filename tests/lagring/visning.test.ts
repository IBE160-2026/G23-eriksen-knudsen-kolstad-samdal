// Nøkkelen for lys og mørk visning (Story 1.13, AD-10). Mangler nøkkelen, er visningen lys.
// Blokkert lagring gir lys, og skriving som feiler, ignoreres.

import { describe, expect, it } from 'vitest'
import { NOKKEL_VISNING, lagreVisning, lesVisning, type Lager } from '../../src/lagring/lagrede-kjoringer.ts'

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

describe('cosi-mrp:visning', () => {
  it('har nøkkelen fra AD-10', () => {
    expect(NOKKEL_VISNING).toBe('cosi-mrp:visning')
  })

  it('mangler nøkkelen, er visningen lys', () => {
    expect(lesVisning(minneLager())).toBe('lys')
  })

  it('lagrer og leser mørk og lys', () => {
    const lager = minneLager()
    lagreVisning('mork', lager)
    expect(lager.data.get(NOKKEL_VISNING)).toBe('mork')
    expect(lesVisning(lager)).toBe('mork')
    lagreVisning('lys', lager)
    expect(lager.data.get(NOKKEL_VISNING)).toBe('lys')
    expect(lesVisning(lager)).toBe('lys')
  })

  it('en ukjent verdi gir lys', () => {
    const lager = minneLager()
    lager.data.set(NOKKEL_VISNING, 'blå')
    expect(lesVisning(lager)).toBe('lys')
  })

  it('blokkert lagring: lesing gir lys, og skriving kaster ikke', () => {
    expect(lesVisning(blokkertLager)).toBe('lys')
    expect(() => lagreVisning('mork', blokkertLager)).not.toThrow()
  })

  it('uten lagring i det hele tatt: lesing gir lys, og skriving kaster ikke', () => {
    expect(lesVisning(null)).toBe('lys')
    expect(() => lagreVisning('mork', null)).not.toThrow()
  })
})
