// «Slik leser du resultatet» (Story 2.6, UX-DR16, DESIGN.md › Components › howto-box).
// Nummerert liste med én linje per seksjon i samme rekkefølge som seksjonene. Åpen, men kan felles sammen.
// Uten kritiske deler er punktet om kritiske deler borte.

import { resultat as tekster } from '../../tekster/nb.ts'
import { SEKSJONER, type SeksjonId } from './seksjoner.ts'

export function SlikLeserDu({ harKritiskeDeler }: { harKritiskeDeler: boolean }) {
  const punkter: SeksjonId[] = SEKSJONER.filter((s) => s !== 'kritiskeDeler' || harKritiskeDeler)
  return (
    <details className="slik-leser-du" open>
      <summary>{tekster.slikLeserDu.overskrift}</summary>
      <ol>
        {punkter.map((seksjon) => (
          <li key={seksjon}>{tekster.slikLeserDu[seksjon]}</li>
        ))}
      </ol>
    </details>
  )
}
