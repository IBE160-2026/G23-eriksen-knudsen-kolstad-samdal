// Veiledning (Story 1.4, UX-DR31): hvordan nettsiden brukes, med nummererte overskrifter og
// primærknappen «Til Ny kjøring» nederst. Utfyllingen av malen står i malens ark Veiledning.
// All tekst står i tekster/nb.ts.

import { felles } from '../../tekster/nb.ts'
import { ruteFor } from '../ruter.ts'

type Del = {
  overskrift: string
  avsnitt: readonly string[]
  punkter?: readonly { navn: string; tekst: string }[]
}

const DELER: readonly Del[] = felles.veiledning.deler

export function Veiledning() {
  return (
    <section className="visning tekstside">
      <title>{felles.sidetittel(felles.visninger.veiledning)}</title>
      <h1 tabIndex={-1}>{felles.visninger.veiledning}</h1>
      <p className="ingress">{felles.veiledning.ingress}</p>
      {DELER.map((del, indeks) => {
        const id = `veiledning-del-${indeks + 1}`
        return (
          <section key={id} className="tekstdel" aria-labelledby={id}>
            <h2 id={id}>{del.overskrift}</h2>
            {del.avsnitt.map((avsnitt) => (
              <p key={avsnitt}>{avsnitt}</p>
            ))}
            {del.punkter && (
              <ul>
                {del.punkter.map((punkt) => (
                  <li key={punkt.navn}>
                    <strong>{punkt.navn}:</strong> {punkt.tekst}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
      <p>
        <a className="knapp knapp-primaer" href={ruteFor('ny-kjoring').adresse}>
          {felles.tilNyKjoring}
        </a>
      </p>
    </section>
  )
}
