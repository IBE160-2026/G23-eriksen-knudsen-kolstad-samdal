// Appmenyen (UX-DR3, DESIGN.md › Components): logo og de fem visningene, aktiv side markert.
// Nederst står knappen for lys og mørk visning (Story 1.13).

import type { ReactNode } from 'react'
import { useVisning } from '../../app/visning.ts'
import { felles } from '../../tekster/nb.ts'
import { RUTER, ruteFor, type RuteId } from '../ruter.ts'

// Ikonene fra prototypen v3. SVG-attributter er ikke stil, så de er greie under CSP-en.
const IKONER: Record<RuteId, ReactNode> = {
  introduksjon: <path d="M3 9l7-6 7 6v8H3z" />,
  'ny-kjoring': <path d="M10 4v12M4 10h12" />,
  resultat: <path d="M3 3h14v14H3zM3 8h14M8 8v9" />,
  'lagrede-kjoringer': <path d="M5 3h10v14l-5-3-5 3z" />,
  veiledning: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v5M10 6v.5" />
    </>
  ),
}

// Månen vises når visningen er lys (knappen bytter til mørk), og solen når den er mørk.
const MAANE = <path d="M16.5 12A7 7 0 0 1 8 3.5 7 7 0 1 0 16.5 12z" />
const SOL = (
  <>
    <circle cx="10" cy="10" r="3.5" />
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />
  </>
)

export function Appmeny({ aktiv }: { aktiv: RuteId }) {
  const { visning, bytt } = useVisning()
  const mork = visning === 'mork'
  return (
    <nav className="appmeny" aria-label={felles.appmeny}>
      <a className="appmeny-logo" href={ruteFor('introduksjon').adresse}>
        <span className="appmeny-logo-merke" aria-hidden="true" />
        {felles.appnavn}
      </a>
      <ul className="appmeny-lenker">
        {RUTER.map((rute) => (
          <li key={rute.id}>
            <a
              className="appmeny-lenke"
              href={rute.adresse}
              aria-current={rute.id === aktiv ? 'page' : undefined}
            >
              <svg
                className="appmeny-ikon"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                focusable="false"
              >
                {IKONER[rute.id]}
              </svg>
              {rute.tittel}
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="appmeny-visning" onClick={bytt}>
        <svg
          className="appmeny-ikon"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          focusable="false"
        >
          {mork ? SOL : MAANE}
        </svg>
        {mork ? felles.visningsknapp.tilLys : felles.visningsknapp.tilMork}
      </button>
    </nav>
  )
}
