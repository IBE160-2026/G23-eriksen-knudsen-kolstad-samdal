// Arkitekturtesten (Story 1.1, arkitektur kap. 2, AD-2, AD-15, AD-18).
// Første del sjekker de ekte filene i src/, tests/ og e2e/ og package.json.
// Andre del viser at reglene faktisk oppdager brudd, så testen ikke er grønn bare fordi src/ er nesten tom.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  delAv,
  finnAlleBrudd,
  finnImporter,
  formaterBrudd,
  sjekkImporter,
  sjekkRenKjerne,
  sjekkSheetJs,
  sjekkVersjoner,
  type Fil,
} from './hjelpere/arkitekturregler.ts'

const ROT = join(import.meta.dirname, '..')

function lesFiler(mappe: string): Fil[] {
  const full = join(ROT, mappe)
  const filer: Fil[] = []
  for (const navn of readdirSync(full)) {
    const sti = join(full, navn)
    if (statSync(sti).isDirectory()) {
      filer.push(...lesFiler(relative(ROT, sti)))
    } else if (/\.(ts|tsx|mts|cts|js|jsx|mjs)$/.test(navn)) {
      filer.push({ sti: relative(ROT, sti).split(sep).join('/'), innhold: readFileSync(sti, 'utf8') })
    }
  }
  return filer
}

describe('arkitekturen i prosjektet', () => {
  it('ingen fil bryter reglene for import, ren kjerne, SheetJS eller versjoner', () => {
    const filer = [...lesFiler('src'), ...lesFiler('tests'), ...lesFiler('e2e')]
    const brudd = finnAlleBrudd(filer, readFileSync(join(ROT, 'package.json'), 'utf8'))
    expect(brudd, `Arkitekturtesten fant brudd:\n${formaterBrudd(brudd)}`).toEqual([])
  })
})

describe('reglene oppdager brudd', () => {
  it('finner statiske, type-, re-eksport- og dynamiske importer, men ikke i kommentarer', () => {
    const kode = [
      "import { a } from './a.ts'",
      "import type { B } from '../domene/typer.ts'",
      "export { c } from './c.ts'",
      "import './stil.css'",
      "const d = await import('./d.ts')",
      "// import { x } from 'xlsx'",
      "/* import { y } from 'react' */",
    ].join('\n')
    expect(finnImporter(kode)).toEqual([
      { spesifikator: './a.ts', bareType: false },
      { spesifikator: '../domene/typer.ts', bareType: true },
      { spesifikator: './c.ts', bareType: false },
      { spesifikator: './stil.css', bareType: false },
      { spesifikator: './d.ts', bareType: false },
    ])
  })

  it('en fil i src/ utenfor delene er et brudd (H1)', () => {
    for (const sti of ['src/hjelp/verktoy.ts', 'src/vite-env.d.ts', 'src/annet.ts']) {
      const brudd = sjekkImporter({ sti, innhold: 'export const x = 1' })
      expect(brudd.map((b) => b.regel), sti).toEqual(['kap. 2: hver fil i src/ hører til en del'])
    }
    expect(sjekkImporter({ sti: 'src/main.tsx', innhold: "import { App } from './ui/App.tsx'" })).toEqual([])
    expect(sjekkImporter({ sti: 'tests/x.test.ts', innhold: 'export const x = 1' })).toEqual([])
  })

  it('dynamisk import med backtick oppdages (H2)', () => {
    expect(finnImporter('const m = await import(`../lagring/x.ts`)')).toEqual([
      { spesifikator: '../lagring/x.ts', bareType: false },
    ])
    expect(sjekkImporter({ sti: 'src/ui/A.tsx', innhold: 'const m = await import(`../lagring/x.ts`)' })).toHaveLength(1)
  })

  it('new URL(…, import.meta.url) og import.meta.glob følger de samme reglene (H3)', () => {
    const worker = "new Worker(new URL('../worker/beregning.worker.ts', import.meta.url), { type: 'module' })"
    expect(sjekkImporter({ sti: 'src/app/kjoring.ts', innhold: worker })).toEqual([])
    expect(sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: worker })).toHaveLength(1)
    expect(sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: "import.meta.glob('../excel/*.ts')" })).toHaveLength(1)
    expect(sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: "const u = new URL('https://eksempel.no')" })).toEqual([])
  })

  it('kode inne i tekststrenger regnes ikke som import', () => {
    expect(finnImporter(`const eksempel = "import * as XLSX from 'xlsx'"`)).toEqual([])
    expect(finnImporter("const e = 'await import(\"./d.ts\") her'")).toEqual([])
  })

  it('kjenner igjen delene', () => {
    expect(delAv('src/domene/typer.ts')).toBe('domene')
    expect(delAv('src/ui/felles/Knapp.tsx')).toBe('ui')
    expect(delAv('src/main.tsx')).toBe('main')
    expect(delAv('src/ukjent/x.ts')).toBeUndefined()
    expect(delAv('tests/x.test.ts')).toBeUndefined()
  })

  it('domene/ kan bare importere fra domene/', () => {
    const brudd = sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: "import { nb } from '../tekster/nb.ts'" })
    expect(brudd).toHaveLength(1)
    expect(brudd[0].fil).toBe('src/domene/beregn.ts')
    expect(brudd[0].melding).toContain('domene/ kan ikke importere fra tekster/')
  })

  it('domene/ kan ikke bruke React eller andre pakker', () => {
    const brudd = sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: "import { useState } from 'react'" })
    expect(brudd.map((b) => b.regel)).toEqual(['kap. 2: pakker per del'])
  })

  it('ui/ kan ikke importere fra excel/ eller lagring/', () => {
    expect(sjekkImporter({ sti: 'src/ui/Resultat.tsx', innhold: "import { les } from '../excel/les.ts'" })).toHaveLength(1)
    expect(sjekkImporter({ sti: 'src/ui/Resultat.tsx', innhold: "import { hent } from '../lagring/lagrede-kjoringer.ts'" })).toHaveLength(1)
  })

  it('ui/, tekster/ og lagring/ kan bare importere typer fra domene/', () => {
    expect(sjekkImporter({ sti: 'src/ui/Resultat.tsx', innhold: "import type { Resultat } from '../domene/typer.ts'" })).toEqual([])
    const brudd = sjekkImporter({ sti: 'src/tekster/nb.ts', innhold: "import { beregn } from '../domene/beregn.ts'" })
    expect(brudd).toHaveLength(1)
    expect(brudd[0].melding).toContain('bare importere typer')
    expect(sjekkImporter({ sti: 'src/lagring/lagrede-kjoringer.ts', innhold: "import { sammenlign } from '../domene/sammenlign.ts'" })).toHaveLength(1)
  })

  it('app/ kan bruke excel/eksport, men ikke excel/les', () => {
    expect(sjekkImporter({ sti: 'src/app/kjoring.ts', innhold: "import { eksporter } from '../excel/eksport.ts'" })).toEqual([])
    expect(sjekkImporter({ sti: 'src/app/kjoring.ts', innhold: "import { les } from '../excel/les.ts'" })).toHaveLength(1)
  })

  it('worker/ kan ikke importere lagring/ eller app/', () => {
    expect(sjekkImporter({ sti: 'src/worker/beregning.worker.ts', innhold: "import { lagre } from '../lagring/lagrede-kjoringer.ts'" })).toHaveLength(1)
    expect(sjekkImporter({ sti: 'src/worker/beregning.worker.ts', innhold: "import { kjor } from '../app/kjoring.ts'" })).toHaveLength(1)
  })

  it('en import ut av delene i src/ er et brudd', () => {
    const brudd = sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: "import x from '../../testdata/lag_testdata.py'" })
    expect(brudd.map((b) => b.regel)).toEqual(['kap. 2: import utenfor delene i src/'])
  })

  it('SheetJS er bare lov i src/excel/', () => {
    expect(sjekkImporter({ sti: 'src/excel/les.ts', innhold: "import * as XLSX from 'xlsx'" })).toEqual([])
    const brudd = sjekkImporter({ sti: 'src/domene/valider.ts', innhold: "import * as XLSX from 'xlsx'" })
    expect(brudd.map((b) => b.regel)).toEqual(['AD-15: bare src/excel/ bruker SheetJS'])
    expect(sjekkImporter({ sti: 'src/ui/Eksport.tsx', innhold: "import { writeFile } from 'xlsx'" })).toHaveLength(1)
  })

  it('SheetJS i tests/ er bare lov i de to testhjelperne fra AD-15', () => {
    expect(sjekkSheetJs({ sti: 'tests/hjelpere/fasit-leser.ts', innhold: "import * as XLSX from 'xlsx'" })).toEqual([])
    expect(sjekkSheetJs({ sti: 'tests/hjelpere/lag-arbeidsbok.ts', innhold: "import * as XLSX from 'xlsx'" })).toEqual([])
    expect(sjekkSheetJs({ sti: 'tests/hjelpere/annen-hjelper.ts', innhold: "import * as XLSX from 'xlsx'" })).toHaveLength(1)
    expect(sjekkSheetJs({ sti: 'tests/domene/beregn.test.ts', innhold: "import * as XLSX from 'xlsx'" })).toHaveLength(1)
  })

  it('domene/ kan ikke bruke window, document, localStorage, Date.now, new Date() eller Math.random', () => {
    const kode = [
      'const a = window.innerWidth',
      'const b = document.title',
      "const c = localStorage.getItem('x')",
      'const d = Date.now()',
      'const e = new Date()',
      'const f = Math.random()',
    ].join('\n')
    const brudd = sjekkRenKjerne({ sti: 'src/domene/beregn.ts', innhold: kode })
    expect(brudd.map((b) => b.melding.match(/bruker «(.+?)»/)?.[1])).toEqual([
      'window',
      'document',
      'localStorage',
      'Date.now',
      'new Date()',
      'Math.random',
    ])
    expect(brudd.every((b) => b.regel === 'AD-2: ren kjerne')).toBe(true)
  })

  it('ord i kommentarer og andre deler gir ikke brudd på ren kjerne', () => {
    expect(sjekkRenKjerne({ sti: 'src/domene/beregn.ts', innhold: '// tidspunktet settes i styringen, ikke med Date.now()' })).toEqual([])
    expect(sjekkRenKjerne({ sti: 'src/app/kjoring.ts', innhold: 'const t = new Date()' })).toEqual([])
  })

  it('versjoner med ^ eller ~, områder eller SheetJS fra npm er brudd', () => {
    const pakke = JSON.stringify({
      dependencies: { react: '^19.3.1', xlsx: '0.18.5' },
      devDependencies: { vite: '~8.3.8', vitest: '5.1.1', oxlint: '>=1.0.0', typescript: 'latest' },
    })
    const brudd = sjekkVersjoner(pakke)
    expect(brudd.map((b) => b.melding.split(' har')[0])).toEqual([
      'dependencies.react',
      'xlsx',
      'devDependencies.vite',
      'devDependencies.oxlint',
      'devDependencies.typescript',
    ])
    expect(brudd[0].melding).toContain('(har «^»)')
    expect(brudd[2].melding).toContain('(har «~»)')
  })

  it('meldingen sier hvilken fil og hvilken regel', () => {
    const tekst = formaterBrudd(
      sjekkImporter({ sti: 'src/domene/beregn.ts', innhold: "import { nb } from '../tekster/nb.ts'" }),
    )
    expect(tekst).toContain('src/domene/beregn.ts')
    expect(tekst).toContain('[kap. 2: delene og hva de kan bruke]')
  })
})
