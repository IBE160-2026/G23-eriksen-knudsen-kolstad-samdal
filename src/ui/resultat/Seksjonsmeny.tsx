// Seksjonsmenyen nederst i kjøringslinjen (Story 2.6, UX-DR14, DESIGN.md › Components › Seksjonsmeny).
// Runde knapper, én per seksjon, i samme rekkefølge som seksjonene. Knappene er ekte <button>, ikke lenker med
// `#`-adresse, fordi appen bruker hash-adresser og et klikk ikke skal endre adressen eller legge inn historikk (AD-13).

import { formaterTall, resultat as tekster } from '../../tekster/nb.ts'
import { antallForSeksjon, SEKSJONER, type SeksjonId, type Tallene } from './seksjoner.ts'

type Props = {
  tall: Tallene
  aktiv: SeksjonId | null
  onVelg: (seksjon: SeksjonId) => void
}

export function Seksjonsmeny({ tall, aktiv, onVelg }: Props) {
  return (
    <nav className="seksjonsmeny" aria-label={tekster.seksjonsmenyNavn}>
      {SEKSJONER.map((seksjon) => {
        const antall = antallForSeksjon(seksjon, tall)
        const kritisk = seksjon === 'kritiskeDeler'
        return (
          <button
            key={seksjon}
            type="button"
            className="seksjonsknapp"
            aria-current={aktiv === seksjon ? 'location' : undefined}
            onClick={() => onVelg(seksjon)}
          >
            {tekster.seksjoner[seksjon]}
            {antall !== null && (
              <span className={kritisk ? 'seksjonsknapp-antall seksjonsknapp-kritisk' : 'seksjonsknapp-antall'}>
                {formaterTall(antall)}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
