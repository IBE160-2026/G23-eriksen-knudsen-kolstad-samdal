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

// Introduksjonssiden har overskriften fra designet (Story 1.4, UX-DR6), med klasse. De andre har navnet som h1.
const VISNINGER: [string, ComponentType, string][] = [
  ['Introduksjon', Introduksjon, '<h1 class="intro-overskrift" tabindex="-1">'],
  ['Ny kjøring', NyKjoring, '<h1 tabindex="-1">Ny kjøring</h1>'],
  ['Resultat', Resultat, '<h1 tabindex="-1">Resultat</h1>'],
  ['Lagrede kjøringer', LagredeKjoringer, '<h1 tabindex="-1">Lagrede kjøringer</h1>'],
  ['Veiledning', Veiledning, '<h1 tabindex="-1">Veiledning</h1>'],
]

describe('visningene', () => {
  it.each(VISNINGER)('%s har én h1 med tabindex="-1" og sidetittelen', (navn, Visning, h1) => {
    const html = tegn(Visning)
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(h1)
    expect(html).toContain(`<title>${navn} – COSI - MRP</title>`)
  })

  it('Resultat uten kjøring viser meldingen med lenke til Ny kjøring', () => {
    const html = tegn(Resultat)
    expect(html).toContain(resultat.utenKjoring)
    expect(html).toContain('<a href="#/ny-kjoring">Til Ny kjøring</a>')
  })
})
