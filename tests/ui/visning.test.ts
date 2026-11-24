// Valget av lys eller mørk visning (Story 1.13, AD-1, AD-10, UX-DR3): knappen i appmenyen, bytte og lagring,
// blokkert lagring og scriptet som setter visningen før første tegning. Utseendet og omlastingen
// kontrolleres i e2e/visning.spec.ts.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bytVisning, gjeldendeVisning } from '../../src/app/visning.ts'
import { NOKKEL_VISNING } from '../../src/lagring/lagrede-kjoringer.ts'
import { Appmeny } from '../../src/ui/appmeny/Appmeny.tsx'

const ROT = join(import.meta.dirname, '..', '..')

/** En <html> som bare kan det visningen trenger. */
function lagRot() {
  const attributter = new Map<string, string>()
  return {
    attributter,
    getAttribute: (navn: string) => attributter.get(navn) ?? null,
    setAttribute: (navn: string, verdi: string) => void attributter.set(navn, verdi),
    removeAttribute: (navn: string) => void attributter.delete(navn),
  }
}

function lagLager() {
  const data = new Map<string, string>()
  return { data, getItem: (n: string) => data.get(n) ?? null, setItem: (n: string, v: string) => void data.set(n, v) }
}

afterEach(() => vi.unstubAllGlobals())

describe('bytVisning', () => {
  it('bytter mellom lys og mørk, setter data-visning på <html> og husker valget', () => {
    const rot = lagRot()
    const lager = lagLager()
    vi.stubGlobal('document', { documentElement: rot })
    vi.stubGlobal('localStorage', lager)

    expect(gjeldendeVisning()).toBe('lys')
    expect(bytVisning()).toBe('mork')
    expect(rot.attributter.get('data-visning')).toBe('mork')
    expect(lager.data.get(NOKKEL_VISNING)).toBe('mork')

    expect(bytVisning()).toBe('lys')
    expect(rot.attributter.has('data-visning')).toBe(false)
    expect(lager.data.get(NOKKEL_VISNING)).toBe('lys')
  })

  it('blokkert lagring: valget gjelder likevel mens siden er åpen', () => {
    const rot = lagRot()
    vi.stubGlobal('document', { documentElement: rot })
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new DOMException('Lagringen er blokkert', 'SecurityError')
      },
      setItem: () => {
        throw new DOMException('Lagringen er blokkert', 'SecurityError')
      },
    })

    expect(() => bytVisning()).not.toThrow()
    expect(gjeldendeVisning()).toBe('mork')
    expect(bytVisning()).toBe('lys')
    expect(bytVisning()).toBe('mork')
  })
})

describe('knappen i appmenyen', () => {
  it('står nederst i appmenyen, og heter «Bytt til mørk» i lys visning', () => {
    const html = renderToStaticMarkup(createElement(Appmeny, { aktiv: 'ny-kjoring' }))
    const knapp = '<button type="button" class="appmeny-visning">'
    expect(html).toContain(knapp)
    expect(html).toContain('Bytt til mørk</button>')
    expect(html.lastIndexOf('</ul>')).toBeLessThan(html.indexOf(knapp))
  })

  it('heter «Bytt til lys» i mørk visning', () => {
    // Rot med attributtet satt fra start, slik public/visning.js gjør det.
    const rot = lagRot()
    rot.setAttribute('data-visning', 'mork')
    vi.stubGlobal('document', { documentElement: rot })
    const html = renderToStaticMarkup(createElement(Appmeny, { aktiv: 'ny-kjoring' }))
    expect(html).toContain('Bytt til lys</button>')
  })

  it('har ingen innebygd stil, som CSP-en ikke tillater (AD-17)', () => {
    expect(renderToStaticMarkup(createElement(Appmeny, { aktiv: 'ny-kjoring' }))).not.toMatch(/\sstyle=/)
  })
})

describe('public/visning.js', () => {
  const skript = readFileSync(join(ROT, 'public', 'visning.js'), 'utf8')

  function kjor(lager: { getItem: (n: string) => string | null }) {
    const rot = lagRot()
    new Function('localStorage', 'document', skript)(lager, { documentElement: rot })
    return rot
  }

  it('bruker samme nøkkel som lagring/', () => {
    expect(skript).toContain(`'${NOKKEL_VISNING}'`)
  })

  it('setter data-visning="mork" når mørk er valgt', () => {
    const lager = lagLager()
    lager.data.set(NOKKEL_VISNING, 'mork')
    expect(kjor(lager).attributter.get('data-visning')).toBe('mork')
  })

  it('gjør ingenting når nøkkelen mangler, har en annen verdi, eller lagringen er blokkert', () => {
    expect(kjor(lagLager()).attributter.size).toBe(0)
    const lys = lagLager()
    lys.data.set(NOKKEL_VISNING, 'lys')
    expect(kjor(lys).attributter.size).toBe(0)
    const blokkert = {
      getItem: (): string | null => {
        throw new DOMException('Lagringen er blokkert', 'SecurityError')
      },
    }
    expect(() => kjor(blokkert)).not.toThrow()
    expect(kjor(blokkert).attributter.size).toBe(0)
  })

  it('lastes fra <head> før appen, uten inline-skript (CSP)', () => {
    const html = readFileSync(join(ROT, 'index.html'), 'utf8')
    const hode = html.slice(html.indexOf('<head>'), html.indexOf('</head>'))
    expect(hode).toContain('<script src="/visning.js"></script>')
    expect(html.indexOf('/visning.js')).toBeLessThan(html.indexOf('/src/main.tsx'))
    expect(html).not.toMatch(/<script(?![^>]*\ssrc=)[^>]*>/)
  })
})
