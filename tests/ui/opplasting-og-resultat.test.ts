// Oppbyggingen av opplastingssonen, Beregn og Resultat med en kjøring (Story 1.11, UX-DR4, UX-DR8, UX-DR10, UX-DR13).
// Visningene tegnes til HTML på serveren. Klikk, dra og slipp, fokus og 1366 × 630 testes i e2e/opplasting.spec.ts.

import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Kjorer } from '../../src/app/kjoring.ts'
import { startTilstand, Tilstandskontekst } from '../../src/app/tilstand-handlinger.ts'
import type { Kjoring } from '../../src/domene/typer.ts'
import { formaterTidspunkt } from '../../src/tekster/nb.ts'
import { NyKjoring } from '../../src/ui/ny-kjoring/NyKjoring.tsx'
import { Resultat } from '../../src/ui/resultat/Resultat.tsx'

const KJORER: Kjorer = { kjor: () => Promise.resolve({ type: 'OPPTATT' }), pagar: () => false }

const KJORING: Kjoring = {
  valg: 'BESTILLINGSPLAN',
  filnavn: 'testeksempel-01.xlsx',
  tidspunkt: '2026-11-13T07:04:00.000Z',
  ferdigprodukt: { varenummer: '100-002', beskrivelse: 'Kontorstol Basic' },
  horisont: 10,
  resultat: null,
  kapasitet: null,
  sammenligning: null,
  lagring: 'IKKE_LAGRET_BLOKKERT',
}

function tegn(Visning: ComponentType, kjoring: Kjoring | null = null): string {
  const verdi = { tilstand: { ...startTilstand, kjoring }, send: () => {}, kjorer: KJORER }
  return renderToStaticMarkup(createElement(Tilstandskontekst, { value: verdi }, createElement(Visning)))
}

describe('Ny kjøring: opplastingssonen (UX-DR8)', () => {
  const html = tegn(NyKjoring)

  it('«Velg fil» er en ekte <button>, og filfeltet er skjult og tar bare imot .xlsx', () => {
    expect(html).toContain('<button type="button" class="knapp knapp-primaer">Velg fil</button>')
    expect(html).toMatch(/<input type="file" accept="\.xlsx" hidden=""\/>/)
  })

  it('sonen står i kort 2 med «Slipp Excel-filen her», «eller» og hjelpeteksten, og uten valgt fil og melding', () => {
    const kort2 = html.split('<li class="kort">')[2] ?? ''
    expect(kort2).toContain('class="opplastingssone"')
    expect(kort2).toContain('Slipp Excel-filen her')
    expect(kort2).toContain('Du kan laste opp én Excel-fil (.xlsx). Filen blir i nettleseren din.')
    expect(html).not.toContain('Valgt fil:')
    expect(html).not.toContain('sonemelding')
  })
})

describe('Ny kjøring: Beregn (UX-DR10)', () => {
  const html = tegn(NyKjoring)

  it('Beregn står i kort 3 og er aldri deaktivert', () => {
    const kort3 = html.split('<li class="kort kort-bred">')[1] ?? ''
    expect(kort3).toMatch(/<button type="button" class="knapp knapp-primaer knapp-beregn">Beregn<\/button>/)
    expect(html).not.toContain('disabled')
  })

  it('startsiden har ingen egen statusregion, så skjermleseren ikke får meldingene to ganger', () => {
    expect(html).not.toContain('role="status"')
    expect(html).not.toContain('aria-live')
  })

  it('ingen radiogruppe før Epic 5 (UX-DR9)', () => {
    expect(html).not.toContain('type="radio"')
  })
})

describe('Resultat med en kjøring (UX-DR4, UX-DR13)', () => {
  const html = tegn(Resultat, KJORING)

  it('har én h1 «Resultat for Kontorstol Basic», skjult for øyet, med tabindex="-1"', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain('<h1 tabindex="-1" class="skjult-visuelt">Resultat for Kontorstol Basic</h1>')
  })

  it('sidetittelen er «Kontorstol Basic (100-002) – Resultat – COSI - MRP»', () => {
    expect(html).toContain('<title>Kontorstol Basic (100-002) – Resultat – COSI - MRP</title>')
  })

  it('kjøringslinjen har ferdigproduktet, horisonten, filnavnet, tidspunktet og «Last opp ny fil»', () => {
    const tekst = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    expect(tekst).toContain('Kontorstol Basic (100-002)')
    expect(tekst).toContain('Horisont: 10 uker')
    expect(tekst).toContain('testeksempel-01.xlsx')
    expect(tekst).toContain(`Kjørt ${formaterTidspunkt(KJORING.tidspunkt)}`)
    expect(html).toContain('<a class="knapp" href="#/ny-kjoring">Last opp ny fil</a>')
  })

  it('sier at bestillingsplanen ikke er beregnet, og viser ingen lagringsstatus før Story 4.1', () => {
    expect(html).toContain('Bestillingsplanen beregnes ikke ennå.')
    expect(html).not.toMatch(/lagre|Lagret/i)
  })

  it('uten kjøring vises fortsatt meldingen fra Story 1.3', () => {
    expect(tegn(Resultat)).toContain('<h1 tabindex="-1">Resultat</h1>')
  })
})
