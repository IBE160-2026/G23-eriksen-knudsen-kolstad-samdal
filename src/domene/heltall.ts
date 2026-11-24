// Den felles regelen for heltall i Excel-filen (Story 1.6, AD-4, FR-3).
// Brukes av kontrollene i Story 1.6, 1.8 og 1.9. Grensene (≥ 0, ≥ 1) avgjør den som kaller funksjonen.

import type { Celleverdi } from './typer.ts'

const HELTALL_SOM_TEKST = /^-?[0-9]+$/

/**
 * Gir heltallet i cellen, eller null hvis verdien ikke er et heltall.
 *
 * - Et tall godtas hvis det er et trygt heltall.
 * - En tekst godtas hvis den etter trimming er `^-?[0-9]+$` og verdien er et trygt heltall,
 *   for eksempel «7», «007» og «-3».
 * - `-0` gir 0.
 * - Alt annet gir null: desimaltall (1,5, «30,5», 30.5), ord («fem»), «1 000», «+5», «ca. 40»,
 *   tom tekst, sannhetsverdier og null.
 */
export function tolkHeltall(verdi: Celleverdi): number | null {
  if (typeof verdi === 'number') return trygtHeltall(verdi)
  if (typeof verdi === 'string') {
    const tekst = verdi.trim()
    return HELTALL_SOM_TEKST.test(tekst) ? trygtHeltall(Number(tekst)) : null
  }
  return null
}

function trygtHeltall(tall: number): number | null {
  // `+ 0` gjør -0 om til 0.
  return Number.isSafeInteger(tall) ? tall + 0 : null
}
