// Sperre mot filer som slippes utenfor opplastingssonen (Story 1.11, UX-DR8, NFR-9).
//
// Uten sperren åpner nettleseren en fil som slippes et sted på siden, og forlater appen. Da forsvinner
// kjøringen i minnet. Sperren står i appskallet, så den gjelder alle visningene: Ny kjøring, Resultat,
// Veiledning og de andre.
//
// - Bare når det som dras, er filer (`dataTransfer.types` har 'Files'). Tekst og lenker som dras inne
//   på siden, berøres ikke.
// - Ikke inne i en sone med `data-slippsone`. Der tar sonen imot filen selv.
// - Utenfor sonen vises «ikke tillatt» (dropEffect 'none'), og et slipp gjør ingenting: filen behandles ikke.

import { useEffect } from 'react'

/** Attributtet som merker en sone som tar imot filer. Opplastingssonen på Ny kjøring har det. */
export const SLIPPSONE = 'data-slippsone'

/** Om hendelsen gjelder filer som dras utenfor en slippsone. Da skal nettleserens standardhandling stoppes. */
export function skalSperres(typer: readonly string[] | undefined, mal: EventTarget | null): boolean {
  if (!typer?.includes('Files')) return false
  return !iSlippsone(mal)
}

/** Om målet ligger i en slippsone. Et tekstnode-mål bruker forelderen sin. */
function iSlippsone(mal: EventTarget | null): boolean {
  const kandidat = mal as { closest?: (s: string) => Element | null; parentElement?: Element | null } | null
  const element = typeof kandidat?.closest === 'function' ? kandidat : (kandidat?.parentElement ?? null)
  return Boolean(element?.closest?.(`[${SLIPPSONE}]`))
}

function typerFor(hendelse: DragEvent): readonly string[] | undefined {
  return hendelse.dataTransfer ? Array.from(hendelse.dataTransfer.types) : undefined
}

/** Legger sperren på vinduet så lenge komponenten vises. Brukes én gang, i appskallet. */
export function useSlippsperre(): void {
  useEffect(() => {
    function over(hendelse: DragEvent) {
      if (!skalSperres(typerFor(hendelse), hendelse.target)) return
      hendelse.preventDefault()
      if (hendelse.dataTransfer) hendelse.dataTransfer.dropEffect = 'none'
    }
    function slipp(hendelse: DragEvent) {
      if (skalSperres(typerFor(hendelse), hendelse.target)) hendelse.preventDefault()
    }
    window.addEventListener('dragover', over)
    window.addEventListener('drop', slipp)
    return () => {
      window.removeEventListener('dragover', over)
      window.removeEventListener('drop', slipp)
    }
  }, [])
}
