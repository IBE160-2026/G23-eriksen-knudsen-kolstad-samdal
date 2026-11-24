// Hvordan en celle i Stykkliste tolkes, felles for kontrollene i `valider.ts` (omgjøringen til
// `Stykklisterad`) og `valider-stykkliste.ts` (Story 1.8), så de to er enige om hva som er et gyldig
// nivå, en gyldig type og et varenummer (FR-3, AD-4).

import type { Celleverdi, Delstype, Feilsted, Nivaa } from './typer.ts'

export const NIVAAER: readonly Nivaa[] = ['0', '.1', '..2']

/** Teksten i Excel og koden for typen (FR-3). */
export const TYPER: ReadonlyMap<string, Delstype> = new Map<string, Delstype>([
  ['Ferdigvare', 'FERDIGVARE'],
  ['Komponent (Kjøpes inn)', 'KJOPES_INN'],
  ['Komponent (Produseres selv)', 'PRODUSERES_SELV'],
])

/** Nivået i cellen, eller undefined hvis det ikke er 0, .1 eller ..2. Et tall gjøres om til tekst først. */
export function tolkNivaa(verdi: Celleverdi): Nivaa | undefined {
  const tekst = typeof verdi === 'number' ? String(verdi) : typeof verdi === 'string' ? verdi.trim() : null
  return NIVAAER.find((nivaa) => nivaa === tekst)
}

/** Typen i cellen, eller undefined hvis den ikke er en av de tre i listen. */
export function tolkType(verdi: Celleverdi): Delstype | undefined {
  return typeof verdi === 'string' ? TYPER.get(verdi.trim()) : undefined
}

/**
 * Varenummeret som tekst (AD-4), eller null når det er tomt. Excel-delen har alt gjort tall om til
 * tekst og trimmet, men et tall gjøres om her også, så 300001 og «300001» er samme varenummer.
 */
export function varenummerTekst(verdi: Celleverdi | undefined): string | null {
  if (typeof verdi === 'number') return String(verdi)
  if (typeof verdi !== 'string') return null
  const tekst = verdi.trim()
  return tekst === '' ? null : tekst
}

/** En celle uten innhold: ikke fylt ut, eller bare mellomrom. */
export function erTom(verdi: Celleverdi | undefined): boolean {
  return verdi === null || verdi === undefined || (typeof verdi === 'string' && verdi.trim() === '')
}

/** Cellen med kolonnebokstaven fra overskriftene, for eksempel C3. Mangler bokstaven, er stedet raden. */
export function cellested(kolonne: string | null, excelRad: number): Feilsted {
  return kolonne === null ? { type: 'RAD', excelRad } : { type: 'CELLE', celle: `${kolonne}${excelRad}`, excelRad }
}
