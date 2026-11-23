// Reglene fra arkitektur kapittel 2 («Delene og hva de kan bruke»), AD-2, AD-15 og AD-18,
// skrevet som rene funksjoner, så de kan testes med eksempler på brudd (tests/arkitektur.test.ts).
//
// Importene leses med regulære uttrykk. TypeScript 7 har ikke JavaScript-grensesnittet
// til kompilatoren, så vi kan ikke bruke det her.

import { posix } from 'node:path'

export type Fil = { sti: string; innhold: string }
export type Brudd = { fil: string; regel: string; melding: string }

export type Del = 'domene' | 'tekster' | 'excel' | 'lagring' | 'worker' | 'app' | 'ui' | 'main'

type Tilgang = 'alt' | 'type' | { bareFiler: string[] }
type Regel = { deler: Partial<Record<Del, Tilgang>>; pakker: string[] }

const SKRIFTER = [
  '@fontsource/ibm-plex-sans',
  '@fontsource/ibm-plex-sans-condensed',
  '@fontsource/ibm-plex-mono',
]

// Hva hver del kan importere. «type» betyr bare `import type` / `export type`.
export const REGLER: Record<Del, Regel> = {
  domene: { deler: { domene: 'alt' }, pakker: [] },
  tekster: { deler: { tekster: 'alt', domene: 'type' }, pakker: [] },
  excel: { deler: { excel: 'alt', domene: 'alt', tekster: 'alt' }, pakker: ['xlsx'] },
  lagring: { deler: { lagring: 'alt', domene: 'type' }, pakker: [] },
  worker: { deler: { worker: 'alt', domene: 'alt', excel: 'alt' }, pakker: [] },
  app: {
    deler: {
      app: 'alt',
      domene: 'alt',
      excel: { bareFiler: ['eksport'] },
      lagring: 'alt',
      tekster: 'alt',
      worker: 'alt',
    },
    pakker: ['react'],
  },
  ui: {
    deler: { ui: 'alt', app: 'alt', tekster: 'alt', domene: 'type' },
    pakker: ['react', 'react-dom', ...SKRIFTER],
  },
  main: { deler: { ui: 'alt' }, pakker: ['react', 'react-dom', ...SKRIFTER] },
}

// Unntaket i AD-15: testhjelperen som leser fasitfilene, kan bruke SheetJS.
export const SHEETJS_UNNTAK = ['tests/hjelpere/fasit-leser.ts']

const FORBUDT_I_DOMENE: { navn: string; monster: RegExp }[] = [
  { navn: 'window', monster: /\bwindow\b/ },
  { navn: 'document', monster: /\bdocument\b/ },
  { navn: 'localStorage', monster: /\blocalStorage\b/ },
  { navn: 'Date.now', monster: /\bDate\s*\.\s*now\b/ },
  { navn: 'new Date()', monster: /\bnew\s+Date\s*\(/ },
  { navn: 'Math.random', monster: /\bMath\s*\.\s*random\b/ },
]

export function fjernKommentarer(kode: string): string {
  return kode.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1')
}

// Tekststrenger med mellomrom er tekst, ikke kode (for eksempel kodeeksempler i testene).
// En importsti har aldri mellomrom, så den beholdes.
export function fjernTekst(kode: string): string {
  return kode.replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g, (s) =>
    /\s/.test(s) ? s[0] + s[0] : s,
  )
}

function rensKode(kode: string): string {
  return fjernTekst(fjernKommentarer(kode))
}

export type Import = { spesifikator: string; bareType: boolean }

export function finnImporter(kode: string): Import[] {
  const ren = rensKode(kode)
  const funn: Import[] = []
  const statiske = /\b(import|export)\s+(type\s+)?(?:[\w*${}\s,]+?\s+from\s+)?['"]([^'"]+)['"]/g
  for (const m of ren.matchAll(statiske)) {
    funn.push({ spesifikator: m[3], bareType: Boolean(m[2]) })
  }
  // import('…'), import(`…`) og require('…')
  const dynamiske = /\b(?:import|require)\s*\(\s*(['"`])([^'"`]+)\1\s*\)/g
  for (const m of ren.matchAll(dynamiske)) {
    funn.push({ spesifikator: m[2], bareType: false })
  }
  // Måtene Vite henter filer på uten import-setning: new URL('…', import.meta.url) og import.meta.glob('…')
  const viteFiler = [
    /\bnew\s+URL\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*import\.meta\.url\s*\)/g,
    /\bimport\.meta\.glob\s*\(\s*(['"`])([^'"`]+)\1/g,
  ]
  for (const monster of viteFiler) {
    for (const m of ren.matchAll(monster)) {
      funn.push({ spesifikator: m[2], bareType: false })
    }
  }
  return funn
}

export function delAv(sti: string): Del | undefined {
  const m = /^src\/([^/]+)(\/|$)/.exec(sti)
  if (!m) return undefined
  if (m[1] === 'main.tsx' || m[1] === 'main.ts') return 'main'
  if (m[2] === '/' && m[1] in REGLER && m[1] !== 'main') return m[1] as Del
  return undefined
}

function pakkenavn(spesifikator: string): string {
  const deler = spesifikator.split('/')
  return spesifikator.startsWith('@') ? deler.slice(0, 2).join('/') : deler[0]
}

function filnavnUtenEndelse(sti: string): string {
  return posix.basename(sti).replace(/\.(tsx?|jsx?|css)$/, '')
}

export function sjekkImporter(fil: Fil): Brudd[] {
  const fra = delAv(fil.sti)
  if (!fra) {
    // En fil i src/ som ikke ligger i en av delene, ville sluppet unna alle reglene.
    return fil.sti.startsWith('src/')
      ? [
          {
            fil: fil.sti,
            regel: 'kap. 2: hver fil i src/ hører til en del',
            melding: `${fil.sti} ligger ikke i en av delene i src/ (domene, tekster, excel, lagring, worker, app, ui) og er ikke src/main.tsx. Flytt den, eller avtal en ny del i arkitekturen.`,
          },
        ]
      : []
  }
  const regel = REGLER[fra]
  const brudd: Brudd[] = []

  for (const imp of finnImporter(fil.innhold)) {
    const s = imp.spesifikator
    if (s.startsWith('.')) {
      const mal = posix.normalize(posix.join(posix.dirname(fil.sti), s))
      const til = delAv(mal)
      if (!til) {
        brudd.push({
          fil: fil.sti,
          regel: 'kap. 2: import utenfor delene i src/',
          melding: `${fil.sti} importerer «${s}», som ikke ligger i en del i src/.`,
        })
        continue
      }
      const tilgang = regel.deler[til]
      const lov =
        tilgang === 'alt' ||
        (tilgang === 'type' && imp.bareType) ||
        (typeof tilgang === 'object' && tilgang.bareFiler.includes(filnavnUtenEndelse(mal)))
      if (!lov) {
        const hva =
          tilgang === 'type'
            ? `${fra}/ kan bare importere typer fra ${til}/ (bruk «import type»)`
            : `${fra}/ kan ikke importere fra ${til}/`
        brudd.push({
          fil: fil.sti,
          regel: 'kap. 2: delene og hva de kan bruke',
          melding: `${fil.sti} importerer «${s}»: ${hva}.`,
        })
      }
    } else {
      const pakke = pakkenavn(s)
      if (!regel.pakker.includes(pakke)) {
        brudd.push({
          fil: fil.sti,
          regel: pakke === 'xlsx' ? 'AD-15: bare src/excel/ bruker SheetJS' : 'kap. 2: pakker per del',
          melding: `${fil.sti} importerer pakken «${pakke}», som ${fra === 'main' ? 'src/main.tsx' : `${fra}/`} ikke kan bruke.`,
        })
      }
    }
  }
  return brudd
}

export function sjekkRenKjerne(fil: Fil): Brudd[] {
  if (delAv(fil.sti) !== 'domene') return []
  const ren = rensKode(fil.innhold)
  return FORBUDT_I_DOMENE.filter(({ monster }) => monster.test(ren)).map(({ navn }) => ({
    fil: fil.sti,
    regel: 'AD-2: ren kjerne',
    melding: `${fil.sti} bruker «${navn}». src/domene/ kan ikke bruke window, document, localStorage, Date.now, new Date() eller Math.random.`,
  }))
}

// Gjelder også tests/ og e2e/: bare src/excel/ og testhjelperen for fasitfilene bruker SheetJS.
export function sjekkSheetJs(fil: Fil): Brudd[] {
  if (fil.sti.startsWith('src/')) return [] // dekkes av sjekkImporter
  if (SHEETJS_UNNTAK.includes(fil.sti)) return []
  const bruker = finnImporter(fil.innhold).some((i) => pakkenavn(i.spesifikator) === 'xlsx')
  return bruker
    ? [
        {
          fil: fil.sti,
          regel: 'AD-15: bare src/excel/ bruker SheetJS',
          melding: `${fil.sti} importerer SheetJS. Bare src/excel/ og ${SHEETJS_UNNTAK.join(', ')} kan det.`,
        },
      ]
    : []
}

const EKSAKT_VERSJON = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/
const SHEETJS_ADRESSE = 'https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz'

export function sjekkVersjoner(packageJson: string): Brudd[] {
  const pakke = JSON.parse(packageJson) as Record<string, Record<string, string> | undefined>
  const brudd: Brudd[] = []
  for (const felt of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    for (const [navn, versjon] of Object.entries(pakke[felt] ?? {})) {
      if (navn === 'xlsx') {
        if (versjon !== SHEETJS_ADRESSE) {
          brudd.push({
            fil: 'package.json',
            regel: 'AD-15: SheetJS fra cdn.sheetjs.com',
            melding: `xlsx har «${versjon}». SheetJS skal installeres fra ${SHEETJS_ADRESSE}, ikke fra npm.`,
          })
        }
        continue
      }
      if (!EKSAKT_VERSJON.test(versjon)) {
        const tegn = versjon.startsWith('^') || versjon.startsWith('~') ? ` (har «${versjon[0]}»)` : ''
        brudd.push({
          fil: 'package.json',
          regel: 'AD-18: eksakte versjoner',
          melding: `${felt}.${navn} har versjonen «${versjon}»${tegn}. Alle avhengigheter skal ha eksakt versjon, uten ^ og ~.`,
        })
      }
    }
  }
  return brudd
}

export function finnAlleBrudd(filer: Fil[], packageJson: string): Brudd[] {
  return [
    ...filer.flatMap((f) => [...sjekkImporter(f), ...sjekkRenKjerne(f), ...sjekkSheetJs(f)]),
    ...sjekkVersjoner(packageJson),
  ]
}

export function formaterBrudd(brudd: Brudd[]): string {
  return brudd.map((b) => `- ${b.fil} [${b.regel}]: ${b.melding}`).join('\n')
}
