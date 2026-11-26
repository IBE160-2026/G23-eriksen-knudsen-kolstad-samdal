// Kjøringslinjen øverst på Resultat (Story 1.11, UX-DR13, DESIGN.md › Components › Kjøringslinje).
// Ferdigproduktets beskrivelse og varenummer, «Horisont: H uker», filnavnet, tidspunktet og «Last opp ny fil».
// Seksjonsmenyen (Story 2.6) står nederst i linjen. Lagringsstatusen (Story 4.1) og «Eksporter til Excel» (Epic 4) kommer senere.

import type { ReactNode, Ref } from 'react'
import type { Kjoring } from '../../domene/typer.ts'
import { formaterTidspunkt, resultat } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'

type Props = {
  kjoring: Kjoring
  /** Seksjonsmenyen, nederst i linjen. Mangler før beregningen er gjort. */
  meny?: ReactNode
  ref?: Ref<HTMLDivElement>
}

export function Kjoringslinje({ kjoring, meny, ref }: Props) {
  const { beskrivelse, varenummer } = kjoring.ferdigprodukt
  return (
    <div className="kjoringslinje" ref={ref}>
      <div className="kjoringslinje-innhold">
        <p className="kjoringslinje-produkt">
          {beskrivelse} <span className="kjoringslinje-varenummer">({varenummer})</span>
        </p>
        <p className="kjoringslinje-meta">
          <span>{resultat.horisont(kjoring.horisont)}</span>
          <span>{kjoring.filnavn}</span>
          <span>{resultat.kjort(formaterTidspunkt(kjoring.tidspunkt))}</span>
        </p>
      </div>
      {/* Går til startsiden som en vanlig lenke, så Tilbake og Frem virker som før (AD-13). */}
      <a className="knapp" href={ruteFor('ny-kjoring').adresse}>
        {resultat.lastOppNyFil}
      </a>
      {meny}
    </div>
  )
}
