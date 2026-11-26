// Tallboksene under kjøringslinjen (Story 2.6, UX-DR15, DESIGN.md › Components › Tallbokser).
// Fire bokser, hver én lenke til seksjonen tallet gjelder. Bare kritiske deler (●) og forfalt mengde (!) har farge,
// og begge har symbol, så farge ikke står alene. Et tall som er 0, forklares i ord.

import { formaterTall, resultat as tekster } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'
import type { SeksjonId, Tallene } from './seksjoner.ts'

type Boks = {
  nokkel: keyof Tallene
  tekst: (typeof tekster.tallbokser)[keyof typeof tekster.tallbokser]
  seksjon: SeksjonId
  /** «kritisk» (●) og «forfalt» (!) er de eneste som har farge og symbol. */
  tegn?: { symbol: string; klasse: string }
}

const BOKSER: readonly Boks[] = [
  {
    nokkel: 'kritiskeDeler',
    tekst: tekster.tallbokser.kritiskeDeler,
    seksjon: 'kritiskeDeler',
    tegn: { symbol: '●', klasse: 'tallboks-kritisk' },
  },
  { nokkel: 'forslagUke1', tekst: tekster.tallbokser.forslagUke1, seksjon: 'bestillingsforslag' },
  { nokkel: 'forslagIAlt', tekst: tekster.tallbokser.forslagIAlt, seksjon: 'bestillingsforslag' },
  {
    nokkel: 'forslagForfalt',
    tekst: tekster.tallbokser.forslagForfalt,
    seksjon: 'bestillingsforslag',
    tegn: { symbol: '!', klasse: 'tallboks-forfalt' },
  },
]

type Props = {
  tall: Tallene
  onVelg: (seksjon: SeksjonId) => void
}

export function Tallbokser({ tall, onVelg }: Props) {
  return (
    <section className="tallbokser" aria-label={tekster.tallbokserNavn}>
      {BOKSER.map(({ nokkel, tekst, seksjon, tegn }) => {
        const verdi = tall[nokkel]
        const harFarge = tegn !== undefined && verdi > 0
        return (
          // Samme adresse som siden, så en lenke åpnet i ny fane havner på Resultat. Klikket endrer ikke adressen (AD-13).
          <a
            key={nokkel}
            className="tallboks"
            href={ruteFor('resultat').adresse}
            onClick={(hendelse) => {
              hendelse.preventDefault()
              onVelg(seksjon)
            }}
          >
            <span className={harFarge ? `tallboks-tall ${tegn.klasse}` : 'tallboks-tall'}>
              {harFarge && (
                <span className="tallboks-symbol" aria-hidden="true">
                  {tegn.symbol}
                </span>
              )}
              {formaterTall(verdi)}
            </span>
            <span className="tallboks-tittel">{tekst.tittel}</span>
            <span className="tallboks-forklaring">{verdi === 0 ? tekst.forklaringNull : tekst.forklaring}</span>
          </a>
        )
      })}
    </section>
  )
}
