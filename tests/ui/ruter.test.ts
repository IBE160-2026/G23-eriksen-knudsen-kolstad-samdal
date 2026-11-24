// Rutetabellen og valget av standardrute (Story 1.3, AD-13, FR-27).
// Lytting på hashchange, replaceState, Tilbake og Frem testes i e2e/appskall.spec.ts.

import { describe, expect, it } from 'vitest'
import { RUTER, finnRute, ruteFor, standardRute } from '../../src/ui/ruter.ts'

describe('rutetabellen', () => {
  it('har de fem visningene i rekkefølgen i appmenyen, med adressene fra AD-13', () => {
    expect(RUTER.map((r) => [r.adresse, r.tittel])).toEqual([
      ['#/introduksjon', 'Introduksjon'],
      ['#/ny-kjoring', 'Ny kjøring'],
      ['#/resultat', 'Resultat'],
      ['#/lagrede-kjoringer', 'Lagrede kjøringer'],
      ['#/veiledning', 'Veiledning'],
    ])
  })

  it.each(RUTER.map((r) => r.adresse))('finner ruten for %s (bokmerke)', (adresse) => {
    expect(finnRute(adresse)?.adresse).toBe(adresse)
  })

  it.each(['', '#', '#/', '#/ukjent', '#/Veiledning', '#veiledning', '#/veiledning/', '#/intro'])(
    'kjenner ikke adressen «%s»',
    (adresse) => {
      expect(finnRute(adresse)).toBeUndefined()
    },
  )
})

describe('standardRute', () => {
  it('første besøk (intro-sett mangler): Introduksjon', () => {
    expect(standardRute(false)).toBe(ruteFor('introduksjon'))
  })

  it('senere besøk (intro-sett finnes): Ny kjøring', () => {
    expect(standardRute(true)).toBe(ruteFor('ny-kjoring'))
  })
})
