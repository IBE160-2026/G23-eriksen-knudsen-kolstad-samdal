// Feilgrensen (Story 1.3, AD-5): fanger feil under tegning, viser en norsk reservemelding med
// lenke til Ny kjøring, og nullstilles når ruten endres.
// react-dom/server har ingen feilgrenser, så livssyklusen testes med metodene direkte.
// Forventede konsollmeldinger fanges med vi.spyOn i testen som utløser dem. E2e-vakten berøres ikke.

import { createElement, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { felles } from '../../src/tekster/nb.ts'
import { Feilgrense, Reservemelding } from '../../src/ui/felles/Feilgrense.tsx'

describe('Feilgrense', () => {
  it('går til reservemeldingen når en visning kaster', () => {
    expect(Feilgrense.getDerivedStateFromError()).toEqual({ harFeil: true })
  })

  it('nullstilles når ruten endres', () => {
    expect(
      Feilgrense.getDerivedStateFromProps(
        { nokkel: 'veiledning', children: null },
        { nokkel: 'resultat', harFeil: true },
      ),
    ).toEqual({ nokkel: 'veiledning', harFeil: false })
  })

  it('beholder feilen så lenge ruten er den samme', () => {
    expect(
      Feilgrense.getDerivedStateFromProps(
        { nokkel: 'resultat', children: null },
        { nokkel: 'resultat', harFeil: true },
      ),
    ).toBeNull()
  })

  it('viser barna når ingen feil har skjedd', () => {
    const html = renderToStaticMarkup(
      createElement(Feilgrense, { nokkel: 'resultat' }, createElement('h1', null, 'Innhold')),
    )
    expect(html).toBe('<h1>Innhold</h1>')
  })

  it('viser reservemeldingen med sidetittelen når en feil er fanget', () => {
    const grense = new Feilgrense({ nokkel: 'ny-kjoring' })
    grense.state = { nokkel: 'ny-kjoring', harFeil: true }
    const element = grense.render() as ReactElement
    expect(element.type).toBe(Reservemelding)
    expect(renderToStaticMarkup(element)).toContain(`<title>${felles.feilgrense.overskrift} – COSI - MRP</title>`)
  })

  // Lenken i reservemeldingen. Grensen bestemmer ut fra sin egen rute, ikke adresselinjen.
  function klikkTilNyKjoring(rute: string) {
    const grense = new Feilgrense({ nokkel: rute })
    grense.state = { nokkel: rute, harFeil: true }
    const settTilstand = vi.spyOn(grense, 'setState').mockImplementation(() => {})
    const element = grense.render() as ReactElement<{ vedKlikk: () => void }>
    element.props.vedKlikk()
    return settTilstand
  }

  it('lenken nullstiller grensen når brukeren allerede står på Ny kjøring', () => {
    expect(klikkTilNyKjoring('ny-kjoring')).toHaveBeenCalledWith({ harFeil: false })
  })

  it('fra en annen rute nullstiller ruteskiftet grensen, ikke lenken (ingen ekstra tegning av visningen som feilet)', () => {
    expect(klikkTilNyKjoring('resultat')).not.toHaveBeenCalled()
  })

  it('logger feilen med komponentstakken i konsollen (componentDidCatch)', () => {
    const konsoll = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const feil = new Error('visningen kastet')
      const info = { componentStack: '\n    at Veiledning' }
      new Feilgrense({ nokkel: 'veiledning' }).componentDidCatch(feil, info)
      expect(konsoll).toHaveBeenCalledTimes(1)
      expect(konsoll).toHaveBeenCalledWith(feil, info)
    } finally {
      konsoll.mockRestore()
    }
  })
})

describe('Feilgrense: fokus', () => {
  // componentDidUpdate flytter fokus til h1 bare når grensen skifter uten ruteskifte.
  // Ved ruteskifte gjør Skall i App.tsx det, så fokus flyttes bare én gang.
  function etterOppdatering(forrige: { nokkel: string; harFeil: boolean }, na: { nokkel: string; harFeil: boolean }) {
    const fokus = vi.fn()
    const forrigeDocument = (globalThis as { document?: unknown }).document
    ;(globalThis as { document?: unknown }).document = { querySelector: () => ({ focus: fokus }) }
    try {
      const grense = new Feilgrense({ nokkel: na.nokkel })
      grense.state = na
      grense.componentDidUpdate({ nokkel: forrige.nokkel }, forrige)
    } finally {
      ;(globalThis as { document?: unknown }).document = forrigeDocument
    }
    return fokus
  }

  it('flytter fokus én gang når en visning kaster uten ruteskifte', () => {
    expect(etterOppdatering({ nokkel: 'resultat', harFeil: false }, { nokkel: 'resultat', harFeil: true })).toHaveBeenCalledTimes(1)
  })

  it('flytter fokus én gang når lenken nullstiller grensen på Ny kjøring', () => {
    expect(etterOppdatering({ nokkel: 'ny-kjoring', harFeil: true }, { nokkel: 'ny-kjoring', harFeil: false })).toHaveBeenCalledTimes(1)
  })

  it('flytter ikke fokus ved ruteskifte, fordi Skall gjør det', () => {
    expect(etterOppdatering({ nokkel: 'resultat', harFeil: true }, { nokkel: 'veiledning', harFeil: false })).not.toHaveBeenCalled()
  })

  it('flytter ikke fokus når grensen ikke skifter', () => {
    expect(etterOppdatering({ nokkel: 'resultat', harFeil: false }, { nokkel: 'resultat', harFeil: false })).not.toHaveBeenCalled()
  })
})

describe('Reservemelding', () => {
  it('har én h1, norsk tekst og lenke til Ny kjøring', () => {
    const html = renderToStaticMarkup(createElement(Reservemelding))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(html).toContain(`<h1 tabindex="-1">${felles.feilgrense.overskrift}</h1>`)
    expect(html).toContain(felles.feilgrense.tekst)
    expect(html).toContain('<a href="#/ny-kjoring">Til Ny kjøring</a>')
  })
})
