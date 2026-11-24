// Tokenene i lys og mørk visning (Story 1.13, AD-1, UX-DR1).
// - Begge visningene har de samme fargevariablene, og verdiene stemmer med DESIGN.md.
// - Kontrasten er minst WCAG 2.1 AA for tekstparene i begge visningene.
// - Komponentene bruker bare variablene: ingen fargeverdier utenfor tokens.css.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROT = join(import.meta.dirname, '..', '..')
const TOKENS = join(ROT, 'src', 'ui', 'felles', 'tokens.css')
const DESIGN = join(ROT, '.docs', 'planning-artifacts', 'ux-designs', 'ux-COSI - MRP-2026-11-22', 'DESIGN.md')

type Farger = Record<string, string>

/** Fargevariablene (`--navn: #rrggbb`) i en blokk i tokens.css. */
function fargerI(blokk: string): Farger {
  const farger: Farger = {}
  for (const [, navn, verdi] of blokk.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    farger[navn!] = verdi!.toLowerCase()
  }
  return farger
}

const css = readFileSync(TOKENS, 'utf8')
const lysBlokk = css.slice(css.indexOf(':root {'), css.indexOf(":root[data-visning='mork']"))
const morkBlokk = css.slice(css.indexOf(":root[data-visning='mork']"))
const LYS = fargerI(lysBlokk)
const MORK = fargerI(morkBlokk)

/** Fargene i DESIGN.md. Mørke har suffikset `-dark`, som tas bort. */
function fargerIDesign(): { lys: Farger; mork: Farger } {
  const lys: Farger = {}
  const mork: Farger = {}
  const frontmatter = readFileSync(DESIGN, 'utf8').split('\n---')[0]!
  for (const [, navn, verdi] of frontmatter.matchAll(/^ {2}([a-z0-9-]+):\s*'(#[0-9a-fA-F]{6})'/gm)) {
    if (navn!.endsWith('-dark')) mork[navn!.slice(0, -5)] = verdi!.toLowerCase()
    else lys[navn!] = verdi!.toLowerCase()
  }
  return { lys, mork }
}

const DESIGN_FARGER = fargerIDesign()

function lysstyrke(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function kontrast(a: string, b: string): number {
  const [lys, morkere] = [lysstyrke(a), lysstyrke(b)].sort((x, y) => y - x)
  return (lys! + 0.05) / (morkere! + 0.05)
}

describe('fargene i tokens.css', () => {
  it('begge visningene har de samme fargevariablene', () => {
    expect(Object.keys(MORK).sort()).toEqual(Object.keys(LYS).sort())
    expect(Object.keys(LYS).length).toBeGreaterThan(25)
  })

  it('lys visning stemmer med DESIGN.md', () => {
    expect(LYS).toEqual(DESIGN_FARGER.lys)
  })

  it('mørk visning stemmer med -dark-fargene i DESIGN.md', () => {
    expect(MORK).toEqual(DESIGN_FARGER.mork)
  })

  it('mørk visning settes med data-visning="mork" på <html>, og begge visningene sier fra om fargeskjemaet', () => {
    expect(css).toMatch(/:root\[data-visning='mork'\]\s*\{\s*color-scheme:\s*dark;/)
    expect(lysBlokk).toMatch(/color-scheme:\s*light;/)
  })
})

// Tekst mot flaten den står på. Krav 4,5:1 til vanlig tekst og 3:1 til stor tekst (WCAG 2.1 AA).
// Parene er tabellen i DESIGN.md › Colors › Kontrast, og de vanligste kombinasjonene i appen.
const PAR: [forgrunn: string, bakgrunn: string, krav: number][] = [
  ['ink-primary', 'surface-base', 4.5],
  ['ink-primary', 'surface-raised', 4.5],
  ['ink-primary', 'surface-sunken', 4.5],
  ['ink-primary', 'accent-soft', 4.5],
  ['ink-secondary', 'surface-base', 4.5],
  ['ink-secondary', 'surface-raised', 4.5],
  ['ink-secondary', 'surface-sunken', 4.5],
  ['ink-secondary', 'accent-soft', 4.5],
  ['accent', 'surface-base', 4.5],
  ['accent', 'surface-raised', 4.5],
  ['accent', 'accent-soft', 4.5],
  ['accent-ink', 'accent', 4.5],
  ['accent-ink', 'accent-hover', 4.5],
  ['exc-critical', 'exc-critical-soft', 4.5],
  ['exc-warning', 'exc-warning-soft', 4.5],
  ['exc-info', 'exc-info-soft', 4.5],
  ['exc-horizon', 'exc-horizon-soft', 4.5],
  ['change-new', 'change-new-soft', 4.5],
  ['exc-critical', 'surface-raised', 4.5],
  ['exc-warning', 'surface-raised', 4.5],
  ['exc-info', 'surface-raised', 4.5],
  ['exc-horizon', 'surface-raised', 4.5],
  ['change-new', 'surface-raised', 4.5],
  ['summary-ink', 'summary-bg', 4.5],
  ['summary-ink2', 'summary-bg', 4.5],
  ['summary-num-critical', 'summary-bg', 3],
  ['summary-num-overdue', 'summary-bg', 3],
  ['summary-ink', 'summary-hover', 4.5],
  ['summary-ink2', 'summary-hover', 4.5],
  ['summary-num-critical', 'summary-hover', 3],
  ['summary-num-overdue', 'summary-hover', 3],
]

describe('kontrast (WCAG 2.1 AA)', () => {
  for (const [visning, farger] of [['lys', LYS], ['mørk', MORK]] as const) {
    it.each(PAR)(`${visning} visning: %s på %s er minst %s:1`, (forgrunn, bakgrunn, krav) => {
      const f = farger[forgrunn]
      const b = farger[bakgrunn]
      expect(f, `mangler --${forgrunn}`).toBeDefined()
      expect(b, `mangler --${bakgrunn}`).toBeDefined()
      expect(kontrast(f!, b!)).toBeGreaterThanOrEqual(krav)
    })
  }

  it('line-faint er bare for ikke-tekst, og står ikke i parene for tekst', () => {
    expect(PAR.some(([f]) => f === 'line-faint')).toBe(false)
  })
})

describe('komponentene bruker bare variablene (UX-DR1)', () => {
  function cssFiler(mappe: string): string[] {
    return readdirSync(mappe).flatMap((navn) => {
      const sti = join(mappe, navn)
      if (statSync(sti).isDirectory()) return cssFiler(sti)
      return navn.endsWith('.css') && sti !== TOKENS ? [sti] : []
    })
  }

  it('ingen css-fil utenom tokens.css har fargeverdier', () => {
    const filer = cssFiler(join(ROT, 'src'))
    expect(filer.length).toBeGreaterThan(1)
    for (const fil of filer) {
      const uten = readFileSync(fil, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
      expect(uten, fil).not.toMatch(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/)
    }
  })
})
