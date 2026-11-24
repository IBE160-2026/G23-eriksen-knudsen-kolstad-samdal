// Leser fasiten for én valideringsfil i testdata/validering/README.md (Story 1.6).
// Gjenbrukes av testene for Story 1.8 og 1.9.
//
// README-linjene ser slik ut (kolonnene Fil, Tilfelle, Feil, Ark, Sted, Felt, Regel):
//   | `V-F05.xlsx` | Tre feil på tre ark | 3 | Stykkliste, MPS, Planlagte mottak | D9, uke 3, B2 | Antall, Antall per uke, Uke | … |
// Ark, Sted og Felt har én verdi per feil, skilt med komma, i samme rekkefølge.
// Sted «–» betyr hele arket. Felt er «Ark» når et ark mangler, og «Overskrift» når en overskrift mangler.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Feilsted, Valideringsfeil } from '../../src/domene/typer.ts'

const README = join(import.meta.dirname, '..', '..', 'testdata', 'validering', 'README.md')

export type Valideringsfasit = {
  /** Antall valideringsfeil, eller «avvist» for filer som gir en filfeil. */
  antall: number | 'avvist'
  /** Én verdi per feil, i README-ens rekkefølge. Tomme når filen er gyldig eller avvist. */
  ark: string[]
  sted: string[]
  felt: string[]
}

/** Fasiten for filen, for eksempel `valideringsfasit('V-F02.xlsx')`. Kaster hvis linjen mangler. */
export function valideringsfasit(fil: string): Valideringsfasit {
  const linje = readFileSync(README, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith(`| \`${fil}\` |`))
  if (linje === undefined) throw new Error(`${fil} mangler i testdata/validering/README.md`)

  const kolonner = linje.split('|').map((k) => k.trim())
  const feil = kolonner[3]
  if (feil === 'avvist') return { antall: 'avvist', ark: [], sted: [], felt: [] }
  if (!/^[0-9]+$/.test(feil)) throw new Error(`${fil}: «Feil» må være et tall eller «avvist», ikke «${feil}»`)

  const antall = Number(feil)
  const lister = { ark: liste(kolonner[4]), sted: liste(kolonner[5]), felt: liste(kolonner[6]) }
  for (const [navn, verdier] of Object.entries(lister)) {
    const bareStrek = verdier.length === 1 && verdier[0] === '–'
    if (verdier.length > 0 && !bareStrek && verdier.length !== antall) {
      throw new Error(`${fil}: ${verdier.length} verdier i «${navn}», men ${antall} feil`)
    }
  }
  if (antall === 0) return { antall, ark: [], sted: [], felt: [] }
  return { antall, ...lister }
}

function liste(celle: string): string[] {
  return celle
    .split(',')
    .map((verdi) => verdi.trim())
    .filter((verdi) => verdi !== '')
}

/** Stedet slik README-en skriver det: «H1», «D9», «rad 9», «uke 3» eller «–» for hele arket. */
export function stedSomIFasit(sted: Feilsted): string {
  switch (sted.type) {
    case 'CELLE':
    case 'OVERSKRIFT':
      return sted.celle
    case 'RAD':
      return `rad ${sted.excelRad}`
    case 'UKE':
      return `uke ${sted.uke}`
    case 'ARK':
      return '–'
  }
}

/**
 * En valideringsfeil i README-ens form. Felt er «Overskrift» når en overskrift mangler, og
 * «Antall per uke» for «Antall ferdigprodukter» i arket MPS (Story 1.9), ellers feltet i feilen.
 * Stedet i MPS er «uke N» (se stedSomIFasit).
 */
export function somIFasit(feil: Valideringsfeil): { ark: string; sted: string; felt: string } {
  return {
    ark: feil.ark,
    sted: stedSomIFasit(feil.sted),
    felt: feltSomIFasit(feil),
  }
}

function feltSomIFasit(feil: Valideringsfeil): string {
  if (feil.sted.type === 'OVERSKRIFT') return 'Overskrift'
  if (feil.ark === 'MPS' && feil.felt === 'Antall ferdigprodukter') return 'Antall per uke'
  return feil.felt
}
