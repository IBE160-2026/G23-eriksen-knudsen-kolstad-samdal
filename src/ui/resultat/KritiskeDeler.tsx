// Seksjonen Kritiske deler (Story 2.10, FR-16, UX-DR17, DESIGN.md › Components › Linje i kritiske deler).
// Én linje per kritisk del i stykklisterekkefølge, før bestillingsforslagene. Hele linjen er én knapp: klikk eller Enter
// ruller tabellen til delen, flytter fokus til cellen med delens tidligste eksepsjon og markerer delen kort.
// «Se forklaring →» åpner forklaringspanelet først i Epic 3. Til da er hoppet hele handlingen.
//
// Uten kritiske deler står bare en kort melding i en informasjonsboks, uten overskrift og liste (Resultatside.tsx).

import type { DelResultat, Eksepsjon, Resultat } from '../../domene/typer.ts'
import { eksepsjoner as eksTekster, resultat as tekster } from '../../tekster/nb.ts'
import { EKSEPSJONSVISNING } from './eksepsjonsvisning.ts'

type Props = {
  resultat: Resultat
  /** Ruller tabellen til delen og flytter fokus til cellen med den tidligste eksepsjonen. */
  onHopp: (varenummer: string) => void
}

function Linje({ del, eksepsjoner, resultat, onHopp }: { del: DelResultat; eksepsjoner: Eksepsjon[]; resultat: Resultat; onHopp: Props['onHopp'] }) {
  const { varenummer, beskrivelse, type, nivaa } = del.del
  const t = tekster.kritiskeDeler
  const tidligste = eksepsjoner[0]
  const forslag = resultat.bestillingsforslag.filter((f) => f.varenummer === varenummer)
  const forste = forslag[0]
  const merker = eksepsjoner.map((e) => tekster.tabell.markornavn(tekster.tabell.eksepsjonsnavn[e.kode], e.uke))
  const setninger = eksepsjoner.map((e) => eksTekster.setning(e))
  // Fargen på venstrekanten er fargen til delens tidligste eksepsjon.
  const kant = tidligste ? ` kant-${EKSEPSJONSVISNING[tidligste.kode].klasse}` : ''
  return (
    <li>
      <button
        type="button"
        className={`kritisk-linje${kant}`}
        aria-label={t.knappNavn(varenummer, beskrivelse, merker, setninger)}
        onClick={() => onHopp(varenummer)}
      >
        <span className="kritisk-linje-del">
          <span className="kritisk-linje-varenummer">{varenummer}</span>
          <span className="kritisk-linje-beskrivelse">{beskrivelse}</span>
          <span className="kritisk-linje-meta">{t.typeOgNivaa(tekster.tabell.delstyper[type], nivaa)}</span>
        </span>
        <span className="kritisk-linje-eksepsjoner">
          {eksepsjoner.map((e) => {
            const visning = EKSEPSJONSVISNING[e.kode]
            return (
              <span key={`${e.kode}-${e.uke}`} className="kritisk-eksepsjon">
                <span className="kritisk-eksepsjon-merke">
                  <span className={`markor ${visning.klasse}`} aria-hidden="true">
                    {visning.symbol}
                  </span>
                  <span className="kritisk-eksepsjon-navn">{t.merke(tekster.tabell.eksepsjonsnavn[e.kode], e.uke)}</span>
                </span>
                <span className="kritisk-eksepsjon-setning">{eksTekster.setning(e)}</span>
              </span>
            )
          })}
          <span className="kritisk-linje-meta">
            {forste ? t.forsteForslag(forste.mengde, forste.frigivelsesuke, forste.forfaltMengde, forslag.length) : t.ingenForslag}
          </span>
        </span>
        <span className="kritisk-linje-handling">{t.seForklaring}</span>
      </button>
    </li>
  )
}

export function KritiskeDeler({ resultat, onHopp }: Props) {
  // Delene står i stykklisterekkefølge i `resultat.deler`, og eksepsjonene er sortert på uke og type (arkitektur kap. 4).
  const kritiske = resultat.deler.filter((del) => del.kritisk)
  return (
    <ul className="kritiske-deler">
      {kritiske.map((del) => (
        <Linje
          key={del.del.varenummer}
          del={del}
          eksepsjoner={resultat.eksepsjoner.filter((e) => e.varenummer === del.del.varenummer)}
          resultat={resultat}
          onHopp={onHopp}
        />
      ))}
    </ul>
  )
}
