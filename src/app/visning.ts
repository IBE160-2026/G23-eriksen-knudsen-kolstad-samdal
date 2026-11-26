// Valget av lys eller mørk visning (Story 1.13, AD-1, AD-10, UX-DR3). ui/ kan ikke bruke lagring/ direkte,
// så appmenyen spør her.
//
// Visningen ligger i `data-visning="mork"` på <html>. Lys er standard og har ingen attributt.
// Attributtet er det som gjelder mens siden er åpen, også når lagringen er blokkert (AD-10).
// `public/visning.js` setter det før siden tegnes første gang, så siden ikke blinker i feil visning.

import { useState } from 'react'
import { lagreVisning, lesVisning, type Visning } from '../lagring/lagrede-kjoringer.ts'

export type { Visning }

function rotElement(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

/** Setter visningen på <html>. */
export function brukVisning(visning: Visning): void {
  const rot = rotElement()
  if (!rot) return
  if (visning === 'mork') rot.setAttribute('data-visning', 'mork')
  else rot.removeAttribute('data-visning')
}

/** Visningen siden har nå. */
export function gjeldendeVisning(): Visning {
  return rotElement()?.getAttribute('data-visning') === 'mork' ? 'mork' : 'lys'
}

/** Bytter mellom lys og mørk, og husker valget. Gir den nye visningen. */
export function bytVisning(): Visning {
  const ny: Visning = gjeldendeVisning() === 'mork' ? 'lys' : 'mork'
  brukVisning(ny)
  lagreVisning(ny)
  return ny
}

/**
 * Visningen til appmenyen. Reserve hvis public/visning.js ikke ble lastet: startverdien bruker da det
 * lagrede valget. Det er trygt å gjøre flere ganger, siden det bare setter samme attributt på <html>.
 */
function startverdi(): Visning {
  if (gjeldendeVisning() === 'lys' && lesVisning() === 'mork') brukVisning('mork')
  return gjeldendeVisning()
}

export function useVisning(): { visning: Visning; bytt: () => void } {
  const [visning, settVisning] = useState<Visning>(startverdi)
  return { visning, bytt: () => settVisning(bytVisning()) }
}
