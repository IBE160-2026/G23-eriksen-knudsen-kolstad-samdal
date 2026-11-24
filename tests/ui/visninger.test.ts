// Hver visning har nøyaktig én h1 og sin egen sidetittel (Story 1.3, AD-13, UX-DR4).
// Resultat uten kjøring viser en melding med lenke til Ny kjøring (UX-DR27).

import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TilstandLeverandor } from '../../src/app/tilstand.tsx'
import { resultat } from '../../src/tekster/nb.ts'
import { Introduksjon } from '../../src/ui/introduksjon/Introduksjon.tsx'
import { LagredeKjoringer } from '../../src/ui/lagrede-kjoringer/LagredeKjoringer.tsx'
import { NyKjoring } from '../../src/ui/ny-kjoring/NyKjoring.tsx'
import { Resultat } from '../../src/ui/resultat/Resultat.tsx'
import { Veiledning } from '../../src/ui/veiledning/Veiledning.tsx'

function tegn(Visning: ComponentType): string {
  return renderToStaticMarkup(createElement(TilstandLeverandor, null, createElement(Visning)))
}

const VISNINGER: [string, ComponentType][] = [
  ['Introduksjon', Introduksjon],
  ['Ny kjøring', NyKjoring],
  ['Resultat', Resultat],
  ['Lagrede kjøringer', LagredeKjoringer],
  ['Veiledning', Veiledning],
]

describe('visningene', () => {
  it.each(VISNINGER)('%s har én h1 med tabindex="-1" og sidetittelen', (navn, Visning) => {
    const html = tegn(Visning)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`<h1 tabindex="-1">${navn}</h1>`)
    expect(html).toContain(`<title>${navn} – COSI - MRP</title>`)
  })

  it('Resultat uten kjøring viser meldingen med lenke til Ny kjøring', () => {
    const html = tegn(Resultat)
    expect(html).toContain(resultat.utenKjoring)
    expect(html).toContain('<a href="#/ny-kjoring">Til Ny kjøring</a>')
  })
})
