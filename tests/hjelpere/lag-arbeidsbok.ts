// Lager små arbeidsbøker i minnet til testene av Excel-delen (AD-15, AD-16).
// Brukes til logikken (kolonnerekkefølge, tall som tekst, tomme rader). Formler, hjelpekolonner,
// passordbeskyttede, skadede og tomme filer testes med ekte Excel-filer i testdata/.
//
// Denne fila og tests/hjelpere/fasit-leser.ts er de eneste i tests/ som kan bruke SheetJS (SHEETJS_UNNTAK).

import { utils, write, type CellObject } from 'xlsx'
import type { Celleverdi } from '../../src/domene/typer.ts'

/** En feilverdi i en celle, for eksempel `{ feil: '#N/A' }`. */
export type Feilcelle = { feil: keyof typeof FEILKODER }

/** Kodene SheetJS bruker for feilverdiene i Excel. */
const FEILKODER = { '#DIV/0!': 0x07, '#VALUE!': 0x0f, '#REF!': 0x17, '#NAME?': 0x1d, '#N/A': 0x2a } as const

function celle(verdi: Celleverdi | Feilcelle): Celleverdi | CellObject {
  return verdi !== null && typeof verdi === 'object'
    ? { t: 'e', v: FEILKODER[verdi.feil], w: verdi.feil }
    : verdi
}

/**
 * Lager en arbeidsbok med ett ark per nøkkel, i den rekkefølgen nøklene står. Hvert ark er en liste
 * med rader fra rad 1, og null er en tom celle. `{ feil: '#N/A' }` er en celle med feilverdien #N/A.
 * `bokType: 'xls'` gir en gammel Excel-fil (en CFB-fil uten EncryptedPackage).
 */
export function lagArbeidsbok(
  ark: Record<string, (Celleverdi | Feilcelle)[][]>,
  bokType: 'xlsx' | 'xls' = 'xlsx',
): Uint8Array {
  const bok = utils.book_new()
  for (const [navn, rader] of Object.entries(ark)) {
    utils.book_append_sheet(bok, utils.aoa_to_sheet(rader.map((rad) => rad.map(celle))), navn)
  }
  return new Uint8Array(write(bok, { type: 'array', bookType: bokType }) as ArrayBuffer)
}
