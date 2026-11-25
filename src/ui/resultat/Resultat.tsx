// Resultat (Story 1.3 og 1.11, AD-13, UX-DR4, UX-DR13, UX-DR27).
//
// Med en kjøring i minnet: skjult h1 «Resultat for ‹beskrivelse›» (får fokus etter Beregn, App.tsx),
// sidetittelen «‹beskrivelse› (‹varenummer›) – Resultat – COSI - MRP» og kjøringslinjen øverst.
// Beregningen er ikke bygd ennå (Epic 2), så siden sier tydelig at filen bare er lest og kontrollert,
// og viser ingen tall som kan se ut som en plan (deferred-work.md).
//
// Uten en kjøring i minnet, for eksempel etter reload eller fra et bokmerke, vises en kort
// melding med lenke til Ny kjøring.

import { useTilstand } from '../../app/tilstand-handlinger.ts'
import { felles, resultat } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'
import { Kjoringslinje } from './Kjoringslinje.tsx'

export function Resultat() {
  const { tilstand } = useTilstand()
  const kjoring = tilstand.kjoring

  if (kjoring === null) {
    return (
      <section className="visning">
        <title>{felles.sidetittel(felles.visninger.resultat)}</title>
        <h1 tabIndex={-1}>{felles.visninger.resultat}</h1>
        <div className="informasjonsboks">
          <p>{resultat.utenKjoring}</p>
          <p>
            <a href={ruteFor('ny-kjoring').adresse}>{felles.tilNyKjoring}</a>
          </p>
        </div>
      </section>
    )
  }

  const { beskrivelse, varenummer } = kjoring.ferdigprodukt
  return (
    <section className="visning">
      <title>{resultat.sidetittel(beskrivelse, varenummer)}</title>
      {/* Skjult for øyet fordi kjøringslinjen viser ferdigproduktet, men lest av skjermleseren (UX-DR4). */}
      <h1 tabIndex={-1} className="skjult-visuelt">
        {resultat.overskrift(beskrivelse)}
      </h1>
      <Kjoringslinje kjoring={kjoring} />
      {/* Midlertidig til beregningen er bygd (Epic 2). */}
      <div className="informasjonsboks">
        {resultat.ikkeBeregnet.map((avsnitt) => (
          <p key={avsnitt}>{avsnitt}</p>
        ))}
      </div>
    </section>
  )
}
