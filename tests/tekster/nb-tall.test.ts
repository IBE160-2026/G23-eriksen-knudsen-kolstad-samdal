// Tester for formateringen av tall i tekster/nb.ts (Story 2.6, UX-DR2).

import { describe, expect, it } from 'vitest'
import { formaterTall } from '../../src/tekster/nb.ts'

describe('formaterTall (UX-DR2)', () => {
  it('små tall har ingen tusenskille', () => {
    expect(formaterTall(0)).toBe('0')
    expect(formaterTall(7)).toBe('7')
    expect(formaterTall(999)).toBe('999')
  })

  it('tusenskillet er hardt mellomrom (U+00A0), aldri vanlig mellomrom', () => {
    expect(formaterTall(1000)).toBe('1 000')
    expect(formaterTall(12345)).toBe('12 345')
    expect(formaterTall(1234567)).toBe('1 234 567')
    expect(formaterTall(1234567)).not.toContain(' ')
  })

  it('negative tall har ekte minus (U+2212), ikke bindestrek', () => {
    expect(formaterTall(-20)).toBe('−20')
    expect(formaterTall(-1500)).toBe('−1 500')
    expect(formaterTall(-20)).not.toContain('-')
  })

  it('null og negativ null skrives uten minus', () => {
    expect(formaterTall(-0)).toBe('0')
  })

  it('desimaltegnet er komma', () => {
    expect(formaterTall(30.5)).toBe('30,5')
    expect(formaterTall(-1234.25)).toBe('−1 234,25')
  })
})
