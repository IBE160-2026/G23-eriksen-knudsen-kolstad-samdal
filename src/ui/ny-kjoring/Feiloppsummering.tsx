// Feiloppsummeringen øverst på startsiden (Story 1.12, FR-2, FR-4, UX-DR11, DESIGN.md › validation-summary).
//
// - Overskriften er sidens h1. Brettet får fokus (`tabindex="-1"`) og har ingen `role="alert"`. Det er en
//   navngitt region, så skjermleseren leser overskriften når fokus flyttes hit (EXPERIENCE.md › Accessibility).
// - Strukturfeilene står først i gruppen «Filen følger ikke malen», med kontrollene som er hoppet over.
//   Så verdifeilene per ark, hver gruppe med h2 og en vanlig tabell med kolonnene Ark, Sted, Felt og Feil.
// - Dataene kommer fra feiloppsummering.ts og teksten fra tekster/nb.ts.

import { useId, type ReactNode, type RefObject } from 'react'
import { filfeilOgValidering } from '../../tekster/nb.ts'
import type { Feillinje, HoppetOverLinje, Oppsummering } from './feiloppsummering.ts'

const tekst = filfeilOgValidering.feiloppsummering

type Egenskaper = {
  oppsummering: Oppsummering
  /** Brettet. NyKjoring flytter fokus hit etter hver kjøring med valideringsfeil. */
  brett: RefObject<HTMLElement | null>
}

export function Feiloppsummering({ oppsummering, brett }: Egenskaper) {
  const id = useId()
  const overskriftId = `${id}-overskrift`
  const { struktur, ark } = oppsummering

  return (
    <section ref={brett} className="feiloppsummering" tabIndex={-1} aria-labelledby={overskriftId}>
      <div className="feiloppsummering-topp">
        <span className="feiloppsummering-ikon" aria-hidden="true">
          ✕
        </span>
        <div>
          <h1 id={overskriftId}>{tekst.overskrift(oppsummering.antallFeil)}</h1>
          <p className="feiloppsummering-urort">{tekst.urort}</p>
        </div>
      </div>

      {struktur !== null && (
        <Gruppe id={`${id}-struktur`} overskrift={tekst.strukturgruppe} linjer={struktur.linjer}>
          {struktur.hoppetOver.length > 0 && (
            <div className="feiloppsummering-hoppet-over">
              <p>{tekst.hoppetOverIngress}</p>
              <ul>
                {struktur.hoppetOver.map((linje, i) => (
                  <li key={i}>{hoppetOverTekst(linje)}</li>
                ))}
              </ul>
            </div>
          )}
        </Gruppe>
      )}

      {ark.map((gruppe) => (
        <Gruppe
          key={gruppe.ark}
          id={`${id}-${gruppe.ark}`}
          overskrift={tekst.arkgruppe(gruppe.ark, gruppe.antallFeil)}
          linjer={gruppe.linjer}
        />
      ))}
    </section>
  )
}

function Gruppe({
  id,
  overskrift,
  linjer,
  children,
}: {
  id: string
  overskrift: string
  linjer: Feillinje[]
  children?: ReactNode
}) {
  const overskriftId = `${id}-h2`.replace(/\s/g, '-')
  return (
    <section className="feiloppsummering-gruppe" aria-labelledby={overskriftId}>
      <h2 id={overskriftId}>{overskrift}</h2>
      {linjer.length > 0 && (
        <table className="feiltabell" aria-labelledby={overskriftId}>
          <thead>
            <tr>
              <th scope="col">{tekst.kolonner.ark}</th>
              <th scope="col">{tekst.kolonner.sted}</th>
              <th scope="col">{tekst.kolonner.felt}</th>
              <th scope="col">{tekst.kolonner.feil}</th>
            </tr>
          </thead>
          <tbody>
            {linjer.map(({ feil, samlet }, i) => (
              <tr key={i}>
                <td>{tekst.ark(feil.ark)}</td>
                <td>{tekst.sted(feil, samlet)}</td>
                <td>{tekst.felt(feil)}</td>
                <td>{tekst.aarsak(feil, samlet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {children}
    </section>
  )
}

function hoppetOverTekst(linje: HoppetOverLinje): string {
  return linje.type === 'ARK' ? tekst.hoppetOverArk(linje.ark) : tekst.hoppetOverKolonne(linje.kontroll)
}
