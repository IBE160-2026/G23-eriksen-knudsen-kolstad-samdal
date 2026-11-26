// Modellen bak listen over bestillingsforslag (Story 2.11, FR-17, UX-DR18, UX-DR19): antall per uke og ukefilteret.
// Ren logikk uten React, så den kan testes alene. Filteret endrer bare det som vises. `Resultat` og tallboksene er uendret.

import type { Bestillingsforslag } from '../../domene/typer.ts'

/** Antall forslag per frigivelsesuke. Plass i er uke i + 1, og lengden er horisonten H. */
export function antallPerUke(forslag: readonly Bestillingsforslag[], horisont: number): number[] {
  const antall = Array.from({ length: horisont }, () => 0)
  for (const f of forslag) {
    const indeks = f.frigivelsesuke - 1
    if (indeks >= 0 && indeks < horisont) antall[indeks] = (antall[indeks] ?? 0) + 1
  }
  return antall
}

/** Forslagene for én uke, eller alle når `uke` er null. Rekkefølgen (uke, så stykklisterekkefølge) beholdes (FR-17). */
export function filtrerUke(forslag: readonly Bestillingsforslag[], uke: number | null): Bestillingsforslag[] {
  return uke === null ? [...forslag] : forslag.filter((f) => f.frigivelsesuke === uke)
}
