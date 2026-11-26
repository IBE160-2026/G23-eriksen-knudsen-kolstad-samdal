// Seksjonene på Resultat og tallene i tallboksene og seksjonsmenyen (Story 2.6, AD-14, UX-DR14, UX-DR15).
// Ren logikk uten React, så den kan testes alene.

import type { Resultat } from '../../domene/typer.ts'

/** Seksjonene i fast rekkefølge (AD-14). Endringer og Produksjonskapasitet kommer i Epic 4 og 5. */
export const SEKSJONER = ['kritiskeDeler', 'bestillingsforslag', 'resultattabell'] as const
export type SeksjonId = (typeof SEKSJONER)[number]

/** `id` på h2-en. Den får fokus når Kari hopper til seksjonen. */
export function overskriftId(seksjon: SeksjonId): string {
  return `seksjon-${seksjon}`
}

export type Tallene = {
  kritiskeDeler: number
  forslagUke1: number
  forslagIAlt: number
  forslagForfalt: number
}

/** Tallene viser alltid totalen. Filtrene i Story 2.7 og 2.11 endrer dem ikke (UX-DR15). */
export function tell(resultat: Resultat): Tallene {
  const forslag = resultat.bestillingsforslag
  return {
    kritiskeDeler: resultat.kritiskeDeler.length,
    forslagUke1: forslag.filter((f) => f.frigivelsesuke === 1).length,
    forslagIAlt: forslag.length,
    forslagForfalt: forslag.filter((f) => f.forfaltMengde > 0).length,
  }
}

/** Antallet i knappen i seksjonsmenyen. Resultattabellen har ikke antall (EXPERIENCE.md › Seksjonsmeny). */
export function antallForSeksjon(seksjon: SeksjonId, tall: Tallene): number | null {
  if (seksjon === 'kritiskeDeler') return tall.kritiskeDeler
  if (seksjon === 'bestillingsforslag') return tall.forslagIAlt
  return null
}

/**
 * Seksjonen som er i bildet (`aria-current="location"`): den siste som har rukket opp til linjen under
 * kjøringslinjen. Nederst på siden gjelder den siste, også når den er for kort til å nå opp til linjen.
 * Før den første seksjonen er nådd, er ingen aktiv.
 *
 * @param topper avstanden fra toppen av bildet til hver seksjon, i seksjonsrekkefølge
 * @param linje avstanden fra toppen av bildet til linjen under kjøringslinjen
 */
export function finnAktivSeksjon(topper: readonly number[], linje: number, erNederst: boolean): number | null {
  if (topper.length === 0) return null
  if (erNederst) return topper.length - 1
  let aktiv: number | null = null
  topper.forEach((topp, i) => {
    if (topp <= linje) aktiv = i
  })
  return aktiv
}
