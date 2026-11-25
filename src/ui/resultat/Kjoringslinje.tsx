// Kjøringslinjen øverst på Resultat (Story 1.11, UX-DR13, DESIGN.md › Components › Kjøringslinje).
// Ferdigproduktets beskrivelse og varenummer, «Horisont: H uker», filnavnet, tidspunktet og «Last opp ny fil».
// Lagringsstatusen (Story 4.1), «Eksporter til Excel» (Epic 4) og seksjonsmenyen (Epic 2) kommer senere.

import type { Kjoring } from '../../domene/typer.ts'
import { formaterTidspunkt, resultat } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'

export function Kjoringslinje({ kjoring }: { kjoring: Kjoring }) {
  const { beskrivelse, varenummer } = kjoring.ferdigprodukt
  return (
    <div className="kjoringslinje">
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
    </div>
  )
}
