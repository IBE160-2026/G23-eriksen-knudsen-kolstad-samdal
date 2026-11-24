// Introduksjonssiden (Story 1.4, UX-DR6, FR-27): hva appen gjør, de tre stegene og «Kom i gang».
// Den vises første gang appen åpnes i en nettleser, og ved hvert besøk hvis lagring er blokkert (AD-10).
// Rutingen i `ruter.ts` styrer når den vises. All tekst står i tekster/nb.ts.

import { felles } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'

export function Introduksjon() {
  const tekst = felles.introduksjon
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.introduksjon)}</title>
      <div className="intro-flate">
        <h1 className="intro-overskrift" tabIndex={-1}>
          {tekst.overskriftLinje1} <span className="intro-overskrift-linje2">{tekst.overskriftLinje2}</span>
        </h1>
        {tekst.avsnitt.map((avsnitt) => (
          <p key={avsnitt} className="intro-avsnitt">
            {avsnitt}
          </p>
        ))}
        <a className="knapp knapp-primaer" href={ruteFor('ny-kjoring').adresse}>
          {tekst.komIGang} <span aria-hidden="true">→</span>
        </a>
      </div>
      <ol className="steg-rad" aria-label={tekst.stegOverskrift}>
        {tekst.steg.map((steg) => (
          <li key={steg.tittel} className="steg-boks">
            <h2>{steg.tittel}</h2>
            <p>{steg.tekst}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
