// Tastaturstyringen i resultattabellen (Story 2.9, UX-DR22, WCAG 2.4.11): navigasjonsmodellen og HTML-en for roving
// tabindex og navnene skjermleseren leser. Selve tastetrykkene, fokus og rulling testes i nettleseren
// (e2e/resultattabell-tastatur.spec.ts, venter på Story 2.5).

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DelTbody } from '../../src/ui/resultat/DelTbody.tsx'
import { Resultattabell } from '../../src/ui/resultat/Resultattabell.tsx'
import {
  erLik,
  flytt,
  forstePlass,
  grupperMarkorer,
  markorerFor,
  type Rutenettplass,
} from '../../src/ui/resultat/tabell-modell.ts'
import { EKSEPSJONER_01 } from '../domene/typer-eksempler.ts'
import { DELER_01, KJORING_TABELL, RESULTAT_TABELL } from './resultattabell-eksempel.ts'

const DELER = ['100-002', '300-001', '300-002', '300-003']
const UKER = 10
const SISTE = UKER + 1 // kolonne for siste uke

const plass = (varenummer: string, r: number, k: number): Rutenettplass => ({ varenummer, r, k })
const trykk = (fra: Rutenettplass, tast: string, ctrl = false, deler = DELER) => flytt(fra, tast, ctrl, deler, UKER)

describe('flytt: piltastene (UX-DR22)', () => {
  it('høyre og venstre flytter én celle og stopper ved kanten', () => {
    expect(trykk(plass('300-001', 2, 2), 'ArrowRight')).toEqual(plass('300-001', 2, 3))
    expect(trykk(plass('300-001', 2, SISTE), 'ArrowRight')).toEqual(plass('300-001', 2, SISTE))
    expect(trykk(plass('300-001', 2, 3), 'ArrowLeft')).toEqual(plass('300-001', 2, 2))
    expect(trykk(plass('300-001', 2, 0), 'ArrowLeft')).toEqual(plass('300-001', 2, 0))
  })

  it('venstre fra første uke går til radnavnet, og venstre fra radnavnet går til delens felt', () => {
    expect(trykk(plass('300-001', 2, 2), 'ArrowLeft')).toEqual(plass('300-001', 2, 1))
    expect(trykk(plass('300-001', 2, 1), 'ArrowLeft')).toEqual(plass('300-001', 2, 0))
  })

  it('høyre fra delens felt går tilbake til radnavnet i raden Kari kom fra', () => {
    expect(trykk(plass('300-001', 4, 0), 'ArrowRight')).toEqual(plass('300-001', 4, 1))
  })

  it('opp og ned flytter én rad, og går over i forrige og neste del ved kanten av delen', () => {
    expect(trykk(plass('300-001', 2, 5), 'ArrowDown')).toEqual(plass('300-001', 3, 5))
    expect(trykk(plass('300-001', 5, 5), 'ArrowDown')).toEqual(plass('300-002', 0, 5))
    expect(trykk(plass('300-002', 0, 5), 'ArrowUp')).toEqual(plass('300-001', 5, 5))
    expect(trykk(plass('300-001', 3, 5), 'ArrowUp')).toEqual(plass('300-001', 2, 5))
  })

  it('opp og ned stopper i første og siste rad i tabellen', () => {
    expect(trykk(plass('100-002', 0, 5), 'ArrowUp')).toEqual(plass('100-002', 0, 5))
    expect(trykk(plass('300-003', 5, 5), 'ArrowDown')).toEqual(plass('300-003', 5, 5))
  })

  it('opp og ned fra delens felt går til forrige og neste del, ikke til neste rad', () => {
    expect(trykk(plass('300-001', 3, 0), 'ArrowDown')).toEqual(plass('300-002', 3, 0))
    expect(trykk(plass('300-001', 3, 0), 'ArrowUp')).toEqual(plass('100-002', 3, 0))
    expect(trykk(plass('100-002', 0, 0), 'ArrowUp')).toEqual(plass('100-002', 0, 0))
    expect(trykk(plass('300-003', 0, 0), 'ArrowDown')).toEqual(plass('300-003', 0, 0))
  })
})

describe('flytt: Home, End og Ctrl (UX-DR22)', () => {
  it('Home og End går til første og siste uke i raden', () => {
    expect(trykk(plass('300-001', 3, 6), 'Home')).toEqual(plass('300-001', 3, 2))
    expect(trykk(plass('300-001', 3, 6), 'End')).toEqual(plass('300-001', 3, SISTE))
    expect(trykk(plass('300-001', 3, 0), 'Home')).toEqual(plass('300-001', 3, 2))
  })

  it('Ctrl+Home og Ctrl+End går til første og siste uke i første og siste rad i tabellen', () => {
    expect(trykk(plass('300-002', 3, 6), 'Home', true)).toEqual(plass('100-002', 0, 2))
    expect(trykk(plass('300-002', 3, 6), 'End', true)).toEqual(plass('300-003', 5, SISTE))
  })
})

describe('flytt: PgUp og PgDn (UX-DR22)', () => {
  it('går til samme rad og kolonne i forrige og neste del', () => {
    expect(trykk(plass('300-001', 3, 6), 'PageDown')).toEqual(plass('300-002', 3, 6))
    expect(trykk(plass('300-001', 3, 6), 'PageUp')).toEqual(plass('100-002', 3, 6))
    expect(trykk(plass('300-001', 3, 0), 'PageDown')).toEqual(plass('300-002', 3, 0))
  })

  it('stopper i første og siste del', () => {
    expect(trykk(plass('100-002', 3, 6), 'PageUp')).toEqual(plass('100-002', 3, 6))
    expect(trykk(plass('300-003', 3, 6), 'PageDown')).toEqual(plass('300-003', 3, 6))
  })

  it('hopper bare mellom delene som vises når filteret er på', () => {
    const kritiske = ['300-003', '300-004', '300-005', '300-006']
    expect(trykk(plass('300-003', 2, 4), 'PageDown', false, kritiske)).toEqual(plass('300-004', 2, 4))
    expect(trykk(plass('300-005', 2, 4), 'PageUp', false, kritiske)).toEqual(plass('300-004', 2, 4))
    expect(trykk(plass('300-003', 2, 4), 'PageUp', false, kritiske)).toEqual(plass('300-003', 2, 4))
    expect(trykk(plass('300-003', 5, 4), 'ArrowDown', false, kritiske)).toEqual(plass('300-004', 0, 4))
  })
})

describe('flytt: andre taster og skjulte deler', () => {
  it('andre taster flytter ikke fokus (null), og taster for en del som ikke vises, heller ikke', () => {
    expect(trykk(plass('300-001', 2, 2), 'a')).toBeNull()
    expect(trykk(plass('300-001', 2, 2), 'Tab')).toBeNull()
    expect(trykk(plass('300-001', 2, 2), 'ArrowRight', false, ['300-003'])).toBeNull()
  })

  it('første plass er første uke i første rad i første del som vises, og finnes ikke uten deler', () => {
    expect(forstePlass(DELER)).toEqual(plass('100-002', 0, 2))
    expect(forstePlass([])).toBeNull()
  })

  it('erLik sammenligner del, rad og kolonne', () => {
    expect(erLik(plass('a', 1, 2), plass('a', 1, 2))).toBe(true)
    expect(erLik(plass('a', 1, 2), plass('a', 1, 3))).toBe(false)
    expect(erLik(null, plass('a', 1, 2))).toBe(false)
  })
})

function tegn(resultat = RESULTAT_TABELL): string {
  return renderToStaticMarkup(createElement(Resultattabell, { kjoring: { ...KJORING_TABELL, resultat }, resultat }))
}

describe('Resultattabell: rutenettet i HTML (UX-DR22)', () => {
  const html = tegn()

  it('er en ekte <table> med role="grid", og området med rulling har ikke eget tabulatorstopp', () => {
    expect(html).toMatch(/<table class="resultattabell-tabell" role="grid"/)
    expect(html).toMatch(/<div class="tabellomrade" role="region"[^>]*>/)
    expect(/<div class="tabellomrade"[^>]*>/.exec(html)?.[0]).not.toContain('tabindex')
  })

  it('hele tabellen har én tabulatorstopp: bare én celle har tabindex, og den er "0"', () => {
    expect(html.match(/tabindex="/g)).toHaveLength(1)
    expect(html).toContain('tabindex="0"')
    expect(html).not.toContain('tabindex="-1"')
  })

  it('tabulatorstoppet står på første uke i første rad i første del, med navnet fra EXPERIENCE.md', () => {
    const celle = /<td [^>]*tabindex="0"[^>]*>/.exec(html)?.[0] ?? ''
    expect(celle).toContain('data-rad="bruttobehov"')
    expect(celle).toContain('data-uke="1"')
    expect(celle).toContain('aria-label="100-002 Kontorstol Basic, Bruttobehov, Uke 1, 20"')
  })

  it('alle cellene Kari kan flytte fokus til, har rad og kolonne (data-r og data-k)', () => {
    // 9 deler × (1 felt + 6 radnavn + 6 × 10 uker)
    expect(html.match(/data-k="/g)).toHaveLength(9 * (1 + 6 + 60))
    expect(html.match(/data-k="0"/g)).toHaveLength(9)
    expect(html.match(/data-k="1"/g)).toHaveLength(54)
    expect(html.match(/data-k="11"/g)).toHaveLength(54)
  })
})

describe('DelTbody: roving tabindex og navn for skjermleseren (UX-DR22)', () => {
  const hjul = DELER_01[3]!
  const markorer = markorerFor(grupperMarkorer(EKSEPSJONER_01), '300-003')
  const tegnDel = (aktivR: number | null, aktivK: number | null) =>
    renderToStaticMarkup(
      createElement(
        'table',
        null,
        createElement(DelTbody, {
          del: hjul,
          markorer,
          uker: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          valgtRad: null,
          valgtUke: null,
          aktivR,
          aktivK,
          onVelg: () => {},
        }),
      ),
    )

  it('en del uten tabulatorstopp har ingen tabindex og ingen aria-label', () => {
    const html = tegnDel(null, null)
    expect(html).not.toContain('tabindex')
    expect(html).not.toContain('aria-label="300-003')
  })

  it('en celle leses som «300-003 Hjul, Nettobehov, Uke 1, 50», med eksepsjonen til slutt', () => {
    const html = tegnDel(3, 2)
    expect(html.match(/tabindex="0"/g)).toHaveLength(1)
    expect(html).toContain('aria-label="300-003 Hjul, Nettobehov, Uke 1, 50, Bestilling forsinket, uke 1"')
  })

  it('en celle uten eksepsjon har bare del, rad, uke og verdi, og et negativt tall leses med ekte minus', () => {
    expect(tegnDel(0, 3)).toContain('aria-label="300-003 Hjul, Bruttobehov, Uke 2, 125"')
    const negativ = { ...hjul, forventetLagerbeholdning: [-20, ...hjul.forventetLagerbeholdning.slice(1)] }
    const html = renderToStaticMarkup(
      createElement(
        'table',
        null,
        createElement(DelTbody, {
          del: negativ,
          markorer,
          uker: [1, 2],
          valgtRad: null,
          valgtUke: null,
          aktivR: 2,
          aktivK: 2,
          onVelg: () => {},
        }),
      ),
    )
    expect(html).toContain('aria-label="300-003 Hjul, Forventet lagerbeholdning, Uke 1, −20"')
  })

  it('radnavnet og delens felt har egne navn når de har tabulatorstoppet', () => {
    expect(tegnDel(4, 1)).toContain('aria-label="300-003 Hjul, Planlagte ordremottak"')
    const felt = tegnDel(0, 0)
    expect(felt).toMatch(/<th scope="rowgroup"[^>]*tabindex="0"/)
    expect(felt).toContain('aria-label="300-003 Hjul, Komponent (Kjøpes inn), Kritisk del"')
  })
})
