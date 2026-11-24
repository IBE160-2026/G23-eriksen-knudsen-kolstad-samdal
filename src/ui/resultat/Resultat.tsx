// Plassholder for Resultat (Story 1.3). Innholdet kommer i Story 1.11 og Epic 2.
// Uten en kjøring i minnet, for eksempel etter reload eller fra et bokmerke, vises en kort
// melding med lenke til Ny kjøring (AD-13, UX-DR27).

import { useTilstand } from '../../app/tilstand-handlinger.ts'
import { felles, resultat } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'

export function Resultat() {
  const { tilstand } = useTilstand()
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.resultat)}</title>
      <h1 tabIndex={-1}>{felles.visninger.resultat}</h1>
      {tilstand.kjoring === null && (
        <div className="informasjonsboks">
          <p>{resultat.utenKjoring}</p>
          <p>
            <a href={ruteFor('ny-kjoring').adresse}>{felles.tilNyKjoring}</a>
          </p>
        </div>
      )}
    </section>
  )
}
