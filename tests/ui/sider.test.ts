// Innholdet på Introduksjon, Ny kjøring og Veiledning (Story 1.4, UX-DR6, UX-DR7, UX-DR31, FR-27).
// Visningene tegnes til HTML på serveren. Utseendet, rullingen og nedlastingene kontrolleres i e2e/sider.spec.ts.

import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TilstandLeverandor } from '../../src/app/tilstand.tsx'
import { felles } from '../../src/tekster/nb.ts'
import { Introduksjon } from '../../src/ui/introduksjon/Introduksjon.tsx'
import { NyKjoring } from '../../src/ui/ny-kjoring/NyKjoring.tsx'
import { Veiledning } from '../../src/ui/veiledning/Veiledning.tsx'

function tegn(Visning: ComponentType): string {
  return renderToStaticMarkup(createElement(TilstandLeverandor, null, createElement(Visning)))
}

/** Teksten i HTML-en, med markeringene fjernet, så avsnitt kan sammenlignes med nb.ts. */
function tekstI(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
}

describe('Introduksjon', () => {
  const html = tegn(Introduksjon)

  it('har overskriften, to avsnitt og primærknappen «Kom i gang» til startsiden (UX-DR6)', () => {
    const tekst = tekstI(html)
    expect(tekst).toContain(`${felles.introduksjon.overskriftLinje1} ${felles.introduksjon.overskriftLinje2}`)
    expect(felles.introduksjon.avsnitt).toHaveLength(2)
    for (const avsnitt of felles.introduksjon.avsnitt) expect(tekst).toContain(avsnitt)
    expect(html).toMatch(/<a class="knapp knapp-primaer" href="#\/ny-kjoring">Kom i gang /)
    expect(html.match(/knapp-primaer/g)).toHaveLength(1)
  })

  it('har de tre stegene i tre bokser: fyll ut malen, last opp, les resultatet', () => {
    expect(html.match(/class="steg-boks"/g)).toHaveLength(3)
    const titler = [...html.matchAll(/<li class="steg-boks"><h2>([^<]+)<\/h2>/g)].map((m) => m[1])
    expect(titler).toEqual(['Fyll ut Excel-malen', 'Last opp filen', 'Les resultatet'])
  })

  it('har ingen innebygd stil, som CSP-en ikke tillater (AD-17)', () => {
    expect(html).not.toMatch(/\sstyle=/)
  })
})

describe('Ny kjøring', () => {
  const html = tegn(NyKjoring)

  it('har h1 «Ny kjøring» og setningen om ett ferdigprodukt rett under (FR-27, UX-DR7)', () => {
    expect(html).toContain('<h1 tabindex="-1">Ny kjøring</h1><p class="ingress">')
    expect(felles.nyKjoring.ettFerdigprodukt).toBe(
      'Hver fil gjelder ett ferdigprodukt. Lageret for deler som brukes i flere ferdigprodukter, må du fordele mellom filene selv.',
    )
    expect(html).toContain(`<p class="ingress">${felles.nyKjoring.ettFerdigprodukt}</p>`)
  })

  it('har de tre nummererte kortene i rekkefølge, og det første forklarer arket Veiledning i malen', () => {
    expect(html).toMatch(/<ol class="startkort">/)
    const titler = [...html.matchAll(/<li class="kort[^"]*"><h2>([^<]+)<\/h2>/g)].map((m) => m[1])
    expect(titler).toEqual(['Fyll ut Excel-malen', 'Last opp filen', 'Velg hva du vil beregne, og beregn'])
    expect(felles.nyKjoring.kort.fyllUt.tekst).toContain('Arket Veiledning i malen forklarer')
  })

  it('har nedlasting av malen og testeksempel 01 som vanlige lenker med download (FR-27)', () => {
    expect(html).toContain('<a class="knapp" href="/COSI-MRP-mal.xlsx" download="">Last ned Excel-malen</a>')
    expect(html).toContain('<a class="knapp" href="/testeksempel-01.xlsx" download="">Last ned testeksempel 01</a>')
  })

  it('har ingen innebygd stil, som CSP-en ikke tillater (AD-17)', () => {
    expect(html).not.toMatch(/\sstyle=/)
  })
})

describe('Veiledning', () => {
  const html = tegn(Veiledning)

  it('har nummererte overskrifter, og tallene går fra 1 og oppover (UX-DR31)', () => {
    const overskrifter = [...html.matchAll(/<h2 id="veiledning-del-\d+">([^<]+)<\/h2>/g)].map((m) => m[1] ?? '')
    expect(overskrifter).toHaveLength(felles.veiledning.deler.length)
    overskrifter.forEach((overskrift, indeks) => expect(overskrift.startsWith(`${indeks + 1}. `)).toBe(true))
  })

  it('har primærknappen «Til Ny kjøring» nederst', () => {
    const knapp = '<a class="knapp knapp-primaer" href="#/ny-kjoring">Til Ny kjøring</a>'
    expect(html).toContain(knapp)
    expect(html.match(/knapp-primaer/g)).toHaveLength(1)
    expect(html.lastIndexOf('<h2')).toBeLessThan(html.indexOf(knapp))
    expect(html.endsWith(`${knapp}</p></section>`)).toBe(true)
  })

  it('sier at utfyllingen av malen står i arket Veiledning i malen', () => {
    expect(tekstI(html)).toContain('står i arket Veiledning i malen')
  })

  it('har ingen innebygd stil, som CSP-en ikke tillater (AD-17)', () => {
    expect(html).not.toMatch(/\sstyle=/)
  })
})
