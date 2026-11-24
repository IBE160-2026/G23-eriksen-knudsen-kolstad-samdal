// Tester for den felles regelen for heltall (Story 1.6, AD-4, FR-3).

import { describe, expect, it } from 'vitest'
import { tolkHeltall } from '../../src/domene/heltall.ts'

describe('tolkHeltall godtar heltall', () => {
  it('et tall som er et heltall', () => {
    expect(tolkHeltall(7)).toBe(7)
    expect(tolkHeltall(0)).toBe(0)
    expect(tolkHeltall(-3)).toBe(-3)
  })

  it('største og minste trygge heltall', () => {
    expect(tolkHeltall(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
    expect(tolkHeltall(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)
  })

  it('tekst med et heltall: «7»', () => {
    expect(tolkHeltall('7')).toBe(7)
  })

  it('tekst med nuller foran: «007»', () => {
    expect(tolkHeltall('007')).toBe(7)
  })

  it('tekst med minus: «-3»', () => {
    expect(tolkHeltall('-3')).toBe(-3)
  })

  it('tekst med mellomrom foran og bak: « 12 »', () => {
    expect(tolkHeltall(' 12 ')).toBe(12)
    expect(tolkHeltall('\t5\n')).toBe(5)
  })

  it('-0 gir 0, både som tall og som tekst', () => {
    expect(Object.is(tolkHeltall(-0), 0)).toBe(true)
    expect(Object.is(tolkHeltall('-0'), 0)).toBe(true)
  })
})

describe('tolkHeltall gir null for alt annet', () => {
  it('desimaltall som tall: 1.5 og 30.5', () => {
    expect(tolkHeltall(1.5)).toBeNull()
    expect(tolkHeltall(30.5)).toBeNull()
  })

  it('desimaltall som tekst: «1,5», «30,5» og «30.5»', () => {
    expect(tolkHeltall('1,5')).toBeNull()
    expect(tolkHeltall('30,5')).toBeNull()
    expect(tolkHeltall('30.5')).toBeNull()
  })

  it('ord: «fem»', () => {
    expect(tolkHeltall('fem')).toBeNull()
  })

  it('mellomrom i tallet: «1 000»', () => {
    expect(tolkHeltall('1 000')).toBeNull()
  })

  it('pluss foran: «+5»', () => {
    expect(tolkHeltall('+5')).toBeNull()
  })

  it('tekst rundt tallet: «ca. 40»', () => {
    expect(tolkHeltall('ca. 40')).toBeNull()
  })

  it('tom tekst og bare mellomrom', () => {
    expect(tolkHeltall('')).toBeNull()
    expect(tolkHeltall('   ')).toBeNull()
  })

  it('bare minus: «-»', () => {
    expect(tolkHeltall('-')).toBeNull()
  })

  it('sannhetsverdier', () => {
    expect(tolkHeltall(true)).toBeNull()
    expect(tolkHeltall(false)).toBeNull()
  })

  it('null (tom celle)', () => {
    expect(tolkHeltall(null)).toBeNull()
  })

  it('tall som ikke er trygge heltall', () => {
    expect(tolkHeltall(Number.MAX_SAFE_INTEGER + 1)).toBeNull()
    expect(tolkHeltall(Number.NaN)).toBeNull()
    expect(tolkHeltall(Number.POSITIVE_INFINITY)).toBeNull()
    expect(tolkHeltall('99999999999999999999')).toBeNull()
  })

  it('andre sifre og skrivemåter enn 0–9: «１２», «1e3», «0x10»', () => {
    expect(tolkHeltall('１２')).toBeNull()
    expect(tolkHeltall('1e3')).toBeNull()
    expect(tolkHeltall('0x10')).toBeNull()
  })
})
