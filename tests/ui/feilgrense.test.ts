// Feilgrensen (Story 1.3, AD-5): fanger feil under tegning, viser en norsk reservemelding med
// lenke til Ny kjøring, og nullstilles når ruten endres.
// react-dom/server har ingen feilgrenser, så livssyklusen testes med de statiske metodene.

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

  it('viser reservemeldingen med sidetittelen når en feil er fanget', () => {
    const grense = new Feilgrense({ nokkel: 'ny-kjoring' })
    grense.state = { nokkel: 'ny-kjoring', harFeil: true }
    const element = grense.render() as ReactElement
    expect(element.type).toBe(Reservemelding)
    expect(renderToStaticMarkup(element)).toContain(`<title>${felles.feilgrense.overskrift} – COSI - MRP</title>`)
  })

  it('lenken nullstiller grensen når brukeren allerede står på Ny kjøring', () => {
    const forrigeWindow = (globalThis as { window?: unknown }).window
    ;(globalThis as { window?: unknown }).window = { location: { hash: '#/ny-kjoring' } }
    try {
      const grense = new Feilgrense({ nokkel: 'ny-kjoring' })
      grense.state = { nokkel: 'ny-kjoring', harFeil: true }
      const settTilstand = vi.spyOn(grense, 'setState').mockImplementation(() => {})
      const element = grense.render() as ReactElement<{ vedKlikk: () => void }>
      element.props.vedKlikk()
      expect(settTilstand).toHaveBeenCalledWith({ harFeil: false })
    } finally {
      ;(globalThis as { window?: unknown }).window = forrigeWindow
    }
  })

  it('viser barna når ingen feil har skjedd', () => {
    const html = renderToStaticMarkup(
      createElement(Feilgrense, { nokkel: 'resultat' }, createElement('h1', null, 'Innhold')),
    )
    expect(html).toBe('<h1>Innhold</h1>')
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
