// Toppen av Resultat (Story 2.6, AD-14, UX-DR14–UX-DR16): seksjonsmenyen, tallboksene, «Slik leser du resultatet»
// og de tre seksjonene. Visningene tegnes til HTML på serveren, med eksempeldata fra fasit 01.
// Rulling, fokus og aria-current mens Kari ruller, testes i e2e/resultat-toppen.spec.ts.

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Kjorer } from '../../src/app/kjoring.ts'
import { startTilstand, Tilstandskontekst } from '../../src/app/tilstand-handlinger.ts'
import type { Bestillingsforslag, Kjoring, Resultat as ResultatData } from '../../src/domene/typer.ts'
import { Resultat } from '../../src/ui/resultat/Resultat.tsx'
import { antallForSeksjon, finnAktivSeksjon, tell } from '../../src/ui/resultat/seksjoner.ts'
import { KJORING_01, RESULTAT_01 } from '../domene/typer-eksempler.ts'

const KJORER: Kjorer = { kjor: () => Promise.resolve({ type: 'OPPTATT' }), pagar: () => false }

function tegn(kjoring: Kjoring): string {
  const verdi = { tilstand: { ...startTilstand, kjoring }, send: () => {}, kjorer: KJORER }
  return renderToStaticMarkup(createElement(Tilstandskontekst, { value: verdi }, createElement(Resultat)))
}

const MED_RESULTAT: Kjoring = { ...KJORING_01, resultat: RESULTAT_01 }
const UTEN_KRITISKE: ResultatData = { ...RESULTAT_01, eksepsjoner: [], kritiskeDeler: [] }
const TOMT: ResultatData = { ...RESULTAT_01, bestillingsforslag: [], eksepsjoner: [], kritiskeDeler: [] }

/** Teksten i HTML-en uten tagger, med enkle mellomrom. */
function tekst(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function forslag(frigivelsesuke: number, forfaltMengde: number): Bestillingsforslag {
  return { varenummer: 'A', beskrivelse: 'A', frigivelsesuke, mengde: 5, forfaltMengde, art: 'INNKJOP' }
}

describe('tell (UX-DR15)', () => {
  it('fasit 01: 4 kritiske deler, 5 forslag i alt, 5 i uke 1 og 2 med forfalt mengde', () => {
    expect(tell(RESULTAT_01)).toEqual({ kritiskeDeler: 4, forslagUke1: 5, forslagIAlt: 5, forslagForfalt: 2 })
  })

  it('uke 1 teller bare frigivelsesuke 1, og forfalt teller bare forslag med forfalt mengde over 0', () => {
    const resultat: ResultatData = {
      ...RESULTAT_01,
      bestillingsforslag: [forslag(1, 0), forslag(2, 0), forslag(1, 3)],
    }
    expect(tell(resultat)).toMatchObject({ forslagUke1: 2, forslagIAlt: 3, forslagForfalt: 1 })
  })

  it('antallet i seksjonsmenyen: kritiske deler og bestillingsforslag har antall, resultattabellen ikke', () => {
    const tall = tell(RESULTAT_01)
    expect(antallForSeksjon('kritiskeDeler', tall)).toBe(4)
    expect(antallForSeksjon('bestillingsforslag', tall)).toBe(5)
    expect(antallForSeksjon('resultattabell', tall)).toBeNull()
  })
})

describe('finnAktivSeksjon (UX-DR14)', () => {
  const linje = 100
  it('ingen er aktiv før den første seksjonen har nådd linjen', () => {
    expect(finnAktivSeksjon([400, 900, 1500], linje, false)).toBeNull()
  })
  it('den siste seksjonen som har nådd linjen, er aktiv', () => {
    expect(finnAktivSeksjon([-300, 80, 700], linje, false)).toBe(1)
    expect(finnAktivSeksjon([-900, -300, 60], linje, false)).toBe(2)
  })
  it('nederst på siden er den siste aktiv, også når den ikke har nådd linjen', () => {
    expect(finnAktivSeksjon([-900, -300, 400], linje, true)).toBe(2)
  })
  it('uten seksjoner er ingen aktiv', () => {
    expect(finnAktivSeksjon([], linje, true)).toBeNull()
  })
})

describe('Resultat med beregnet bestillingsplan: seksjonene (AD-14)', () => {
  const html = tegn(MED_RESULTAT)

  it('har tre h2 i fast rekkefølge: Kritiske deler, Bestillingsforslag, Resultattabell, og fortsatt én h1', () => {
    const overskrifter = [...html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/g)].map((m) => m[1])
    expect(overskrifter).toEqual(['Kritiske deler', 'Bestillingsforslag', 'Resultattabell'])
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
  })

  it('overskriftene kan få fokus (tabindex="-1") og er koblet til seksjonen med aria-labelledby', () => {
    expect(html).toContain('<h2 id="seksjon-kritiskeDeler" tabindex="-1">')
    expect(html).toContain('<section class="resultat-seksjon" aria-labelledby="seksjon-bestillingsforslag">')
  })

  it('Kritiske deler og Bestillingsforslag er tomme til Story 2.10 og 2.11, og Resultattabell har tabellen (Story 2.7)', () => {
    expect(html).toMatch(/<section class="resultat-seksjon"[^>]*><h2[^>]*>Kritiske deler<\/h2><\/section>/)
    expect(html).toMatch(/<section class="resultat-seksjon"[^>]*><h2[^>]*>Bestillingsforslag<\/h2><\/section>/)
    expect(html).toMatch(/<h2[^>]*>Resultattabell<\/h2><div class="resultattabell">/)
  })

  it('viser ikke meldingen om at bestillingsplanen ikke er beregnet', () => {
    expect(html).not.toContain('beregnes ikke ennå')
  })
})

describe('Seksjonsmenyen (UX-DR14)', () => {
  const html = tegn(MED_RESULTAT)
  const meny = /<nav[\s\S]*?<\/nav>/.exec(html)?.[0] ?? ''

  it('er <nav aria-label="Seksjoner i resultatet"> nederst i kjøringslinjen', () => {
    expect(meny).toContain('<nav class="seksjonsmeny" aria-label="Seksjoner i resultatet">')
    const linje = /<div class="kjoringslinje"[\s\S]*<\/nav><\/div>/.exec(html)?.[0] ?? ''
    expect(linje).toContain('seksjonsmeny')
    expect(linje.indexOf('Last opp ny fil')).toBeLessThan(linje.indexOf('seksjonsmeny'))
  })

  it('har runde knapper i seksjonsrekkefølgen, med antall for kritiske deler og bestillingsforslag', () => {
    const knapper = [...meny.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => tekst(m[1] ?? ''))
    expect(knapper).toEqual(['Kritiske deler 4', 'Bestillingsforslag 5', 'Resultattabell'])
  })

  it('knappene er ekte <button type="button">, ikke lenker som endrer adressen (AD-13)', () => {
    expect(meny).not.toContain('<a ')
    expect(meny.match(/<button type="button" class="seksjonsknapp"/g)).toHaveLength(3)
  })

  it('antallet kritiske deler har klassen for exc-critical og fet skrift', () => {
    expect(meny).toContain('seksjonsknapp-kritisk')
  })

  it('ingen knapp er aktiv før Kari har rullet', () => {
    expect(meny).not.toContain('aria-current')
  })

  it('knappen for kritiske deler står der også uten kritiske deler, med antallet 0', () => {
    const uten = /<nav[\s\S]*?<\/nav>/.exec(tegn({ ...MED_RESULTAT, resultat: UTEN_KRITISKE }))?.[0] ?? ''
    expect(tekst(uten)).toContain('Kritiske deler 0')
  })
})

describe('Tallboksene (UX-DR15)', () => {
  const html = tegn(MED_RESULTAT)
  const bokser = [...html.matchAll(/<a class="tallboks"[\s\S]*?<\/a>/g)].map((m) => m[0])

  it('er fire bokser i rekkefølgen kritiske deler, uke 1, i alt og forfalt', () => {
    expect(bokser.map(tekst)).toEqual([
      '● 4 Kritiske deler Deler der planen ikke går opp.',
      '5 Bestillingsforslag i uke 1 Skal bestilles eller settes i produksjon denne uka.',
      '5 Bestillingsforslag i alt Alle forslagene i horisonten.',
      '! 2 Forslag med forfalt mengde Noe av mengden skulle vært bestilt før uke 1.',
    ])
  })

  it('hver boks er én lenke, til siden Resultat', () => {
    expect(bokser).toHaveLength(4)
    for (const boks of bokser) expect(boks).toContain('href="#/resultat"')
  })

  it('bare kritiske deler og forfalt mengde har farge, og symbolet er skjult for skjermleseren', () => {
    expect(bokser[0]).toContain('tallboks-kritisk')
    expect(bokser[3]).toContain('tallboks-forfalt')
    expect(bokser[1]).not.toMatch(/tallboks-(kritisk|forfalt)/)
    expect(bokser[2]).not.toMatch(/tallboks-(kritisk|forfalt)/)
    expect(bokser[0]).toContain('<span class="tallboks-symbol" aria-hidden="true">●</span>')
  })

  it('et tall som er 0, forklares i ord, og har verken farge eller symbol', () => {
    const tomme = [...tegn({ ...MED_RESULTAT, resultat: TOMT }).matchAll(/<a class="tallboks"[\s\S]*?<\/a>/g)].map(
      (m) => m[0],
    )
    expect(tekst(tomme[0] ?? '')).toContain('0 Kritiske deler Planen går opp for alle delene.')
    expect(tekst(tomme[2] ?? '')).toContain('Kjøringen gir ingen bestillingsforslag.')
    expect(tekst(tomme[3] ?? '')).toContain('Ingenting skulle vært bestilt før uke 1.')
    for (const boks of tomme) {
      expect(boks).not.toMatch(/tallboks-(kritisk|forfalt)/)
      expect(boks).not.toContain('tallboks-symbol')
    }
  })

  it('tall over 999 har hardt mellomrom som tusenskille', () => {
    const mange: ResultatData = {
      ...RESULTAT_01,
      bestillingsforslag: Array.from({ length: 1234 }, () => forslag(2, 0)),
    }
    expect(tegn({ ...MED_RESULTAT, resultat: mange })).toContain('1 234')
  })
})

describe('«Slik leser du resultatet» (UX-DR16)', () => {
  it('er åpen, kan felles sammen, og har en nummerert liste med én linje per seksjon i samme rekkefølge', () => {
    const html = tegn(MED_RESULTAT)
    expect(html).toContain('<details class="slik-leser-du" open="">')
    expect(html).toContain('<summary>Slik leser du resultatet</summary>')
    const punkter = [...(/<ol>[\s\S]*?<\/ol>/.exec(html)?.[0] ?? '').matchAll(/<li>([^<]*)<\/li>/g)].map(
      (m) => m[1] ?? '',
    )
    expect(punkter).toHaveLength(3)
    expect(punkter[0]).toMatch(/^Kritiske deler/)
    expect(punkter[1]).toMatch(/^Bestillingsforslag/)
    expect(punkter[2]).toMatch(/^Resultattabellen/)
  })

  it('uten kritiske deler er punktet om kritiske deler borte', () => {
    const html = tegn({ ...MED_RESULTAT, resultat: UTEN_KRITISKE })
    const liste = /<ol>[\s\S]*?<\/ol>/.exec(html)?.[0] ?? ''
    expect(liste.match(/<li>/g)).toHaveLength(2)
    expect(liste).not.toContain('Kritiske deler')
  })
})

describe('Resultat uten beregnet plan (til Story 2.5)', () => {
  it('viser kjøringslinjen uten seksjonsmeny og meldingen om at planen ikke er beregnet', () => {
    const html = tegn({ ...KJORING_01, resultat: null })
    expect(html).toContain('Bestillingsplanen beregnes ikke ennå.')
    expect(html).not.toContain('seksjonsmeny')
    expect(html).not.toContain('tallboks')
    expect(html).not.toContain('<h2')
  })
})
