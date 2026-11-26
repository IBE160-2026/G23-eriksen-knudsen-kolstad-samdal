// Seksjonen Bestillingsforslag (Story 2.11, FR-17, UX-DR18, UX-DR19): modellen for ukefilteret og HTML-en med
// eksempeldata fra testeksempel 01 (de fem første linjene i arket Bestillingsforslag i fasit 01).
// Filteret, klikk og hopp testes i nettleseren (e2e/bestillingsforslag.spec.ts, venter på Story 2.5).

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Kjorer } from '../../src/app/kjoring.ts'
import { startTilstand, Tilstandskontekst } from '../../src/app/tilstand-handlinger.ts'
import type { Bestillingsforslag as Forslag, Kjoring, Resultat as ResultatData } from '../../src/domene/typer.ts'
import { Resultat } from '../../src/ui/resultat/Resultat.tsx'
import { antallPerUke, filtrerUke } from '../../src/ui/resultat/forslag-modell.ts'
import { KJORING_TABELL, RESULTAT_TABELL } from './resultattabell-eksempel.ts'

const KJORER: Kjorer = { kjor: () => Promise.resolve({ type: 'OPPTATT' }), pagar: () => false }

function tegn(resultat: ResultatData = RESULTAT_TABELL): string {
  const kjoring: Kjoring = { ...KJORING_TABELL, resultat }
  const verdi = { tilstand: { ...startTilstand, kjoring }, send: () => {}, kjorer: KJORER }
  return renderToStaticMarkup(createElement(Tilstandskontekst, { value: verdi }, createElement(Resultat)))
}

/** HTML-en til seksjonen Bestillingsforslag. */
function seksjon(html: string): string {
  return /<section class="resultat-seksjon" aria-labelledby="seksjon-bestillingsforslag">[\s\S]*?<\/section>/.exec(html)?.[0] ?? ''
}

function tekst(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const forslag = (varenummer: string, uke: number, mengde = 10, forfalt = 0): Forslag => ({
  varenummer,
  beskrivelse: varenummer,
  frigivelsesuke: uke,
  mengde,
  forfaltMengde: forfalt,
  art: 'INNKJOP',
})

describe('forslag-modell (UX-DR19)', () => {
  const alle = [forslag('A', 1), forslag('B', 1), forslag('C', 3), forslag('D', 3), forslag('E', 3), forslag('F', 10)]

  it('teller forslag per frigivelsesuke, med lengde H', () => {
    expect(antallPerUke(alle, 10)).toEqual([2, 0, 3, 0, 0, 0, 0, 0, 0, 1])
    expect(antallPerUke([], 8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
  })

  it('en uke utenfor horisonten telles ikke', () => {
    expect(antallPerUke([forslag('A', 0), forslag('B', 11)], 10).every((n) => n === 0)).toBe(true)
  })

  it('filtrerer på én uke og beholder rekkefølgen, og null gir alle', () => {
    expect(filtrerUke(alle, 3).map((f) => f.varenummer)).toEqual(['C', 'D', 'E'])
    expect(filtrerUke(alle, null)).toHaveLength(6)
    expect(filtrerUke(alle, 6)).toEqual([])
  })

  it('filteret endrer ikke listen det filtrerer fra', () => {
    const kopi = [...alle]
    filtrerUke(alle, 3)
    expect(alle).toEqual(kopi)
  })
})

describe('Bestillingsforslag: listen (FR-17, UX-DR18)', () => {
  const html = tegn()
  const del = seksjon(html)
  const rader = [...del.matchAll(/<tr[^>]*>(?:(?!<\/tr>)[\s\S])*<td[\s\S]*?<\/tr>/g)].map((m) => m[0])

  it('har h2 «Bestillingsforslag» og hjelpeteksten over listen', () => {
    expect(del).toContain('<h2 id="seksjon-bestillingsforslag" tabindex="-1">Bestillingsforslag</h2>')
    const hjelp = 'Frigivelsesuke er uka du må sende bestillingen eller starte produksjonen. Varene kommer ledetiden senere. Forfalt betyr at noe av mengden skulle vært bestilt før uke 1.'
    expect(tekst(del)).toContain(hjelp)
    expect(del.indexOf(hjelp)).toBeLessThan(del.indexOf('<table'))
  })

  it('er én tabell i et område med egen rulling, som er en navngitt region og et tabulatorstopp', () => {
    expect(del.match(/<table/g)).toHaveLength(1)
    expect(del).toMatch(/<div class="forslagomrade" role="region" aria-label="Liste over bestillingsforslag" tabindex="0">/)
  })

  it('har kolonnene Frigivelsesuke, Varenummer, Beskrivelse, Mengde, «Innkjøp eller produksjonsordre» og Forfalt', () => {
    const hode = /<thead>[\s\S]*?<\/thead>/.exec(del)?.[0] ?? ''
    expect([...hode.matchAll(/<th[^>]*>([^<]*)<\/th>/g)].map((m) => m[1])).toEqual([
      'Frigivelsesuke',
      'Varenummer',
      'Beskrivelse',
      'Mengde',
      'Innkjøp eller produksjonsordre',
      'Forfalt',
    ])
  })

  it('har én linje per forslag i rekkefølgen i Resultat (frigivelsesuke, så stykklisterekkefølge)', () => {
    expect(rader).toHaveLength(5)
    expect(rader.map((r) => /forslag-varenummer">([^<]+)</.exec(r)?.[1])).toEqual([
      '100-002',
      '300-003',
      '300-004',
      '300-007',
      '300-008',
    ])
  })

  it('radene i uke 1 har accent-soft, og andre uker har ikke', () => {
    expect(rader.every((r) => r.includes('class="forslag-uke1"'))).toBe(true)
    const uke2 = tegn({ ...RESULTAT_TABELL, bestillingsforslag: [forslag('300-002', 2, 25)] })
    expect(seksjon(uke2)).not.toContain('forslag-uke1')
  })

  it('viser Innkjøp eller Produksjonsordre som merkelapp, og mengden i fet skrift med tusenskille', () => {
    expect(rader[0]).toContain('<span class="art-merke">Produksjonsordre</span>')
    expect(rader[1]).toContain('<span class="art-merke">Innkjøp</span>')
    expect(rader[1]).toContain('<td class="forslag-tall forslag-mengde">175</td>')
    const stort = tegn({ ...RESULTAT_TABELL, bestillingsforslag: [forslag('300-003', 1, 1500)] })
    expect(seksjon(stort)).toContain('forslag-mengde">1 500</td>')
  })

  it('en kritisk del har symbolet for eksepsjonen ved beskrivelsen, og en del uten eksepsjon har det ikke', () => {
    expect(rader[1]).toMatch(/Hjul<span class="markor eks-kritisk" role="img" aria-label="Bestilling forsinket, uke 1">!<\/span>/)
    expect(rader[2]).toContain('aria-label="Bruk av sikkerhetslager, uke 1"')
    expect(rader[3]).not.toContain('markor')
  })
})

describe('Bestillingsforslag: forfalt mengde (FR-17, FR-10)', () => {
  const del = seksjon(tegn())
  const rader = [...del.matchAll(/<tr[^>]*>(?:(?!<\/tr>)[\s\S])*<td[\s\S]*?<\/tr>/g)].map((m) => m[0])

  it('et forslag med forfalt mengde har knappen «! 50 forfalt» med tilgjengelig navn, og symbolet er skjult for skjermleseren', () => {
    expect(rader[1]).toContain(
      '<button type="button" class="forfalt-knapp" aria-label="50 forfalt: se eksepsjonen for 300-003 Hjul"><span aria-hidden="true">! </span>50 forfalt</button>',
    )
    expect(tekst(rader[1] ?? '')).toContain('! 50 forfalt')
  })

  it('bare forslag med forfalt mengde har knappen, og det er ingen knapper andre steder på raden', () => {
    expect(del.match(/<button type="button" class="forfalt-knapp"/g)).toHaveLength(2)
    expect(rader[0]).not.toContain('<button')
    expect(rader[3]).not.toContain('<button')
    expect(rader[1]!.match(/<button/g)).toHaveLength(1)
  })
})

describe('Bestillingsforslag: ukefilteret (UX-DR19)', () => {
  const del = seksjon(tegn())
  const filter = /<div class="ukefilter"[\s\S]*?<\/div>/.exec(del)?.[0] ?? ''

  it('har «Alle uker» først og så «Uke 1» til «Uke H», hver med antall', () => {
    const knapper = [...filter.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)].map((m) => tekst(m[1] ?? ''))
    expect(knapper).toEqual([
      'Alle uker 5',
      'Uke 1 5',
      'Uke 2 0',
      'Uke 3 0',
      'Uke 4 0',
      'Uke 5 0',
      'Uke 6 0',
      'Uke 7 0',
      'Uke 8 0',
      'Uke 9 0',
      'Uke 10 0',
    ])
    expect(filter).toContain('role="group" aria-label="Filter på frigivelsesuke"')
  })

  it('«Alle uker» er valgt når resultatet åpnes, og ingen andre', () => {
    expect(filter.match(/aria-pressed="true"/g)).toHaveLength(1)
    expect(filter).toMatch(/aria-pressed="true" aria-label="Alle uker, 5 forslag"/)
    expect(filter).toContain('aria-label="Uke 1, 5 forslag"')
  })

  it('uten valgt uke står ingen linje om hvor mange som vises', () => {
    expect(del).not.toContain('Viser ')
    expect(del).not.toContain('Vis alle uker')
  })

  it('antallene viser totalen og følger frigivelsesukene', () => {
    const resultat = {
      ...RESULTAT_TABELL,
      bestillingsforslag: [forslag('A', 1), forslag('B', 2), forslag('C', 2), forslag('D', 4)],
    }
    const f = /<div class="ukefilter"[\s\S]*?<\/div>/.exec(seksjon(tegn(resultat)))?.[0] ?? ''
    expect(f).toContain('aria-label="Alle uker, 4 forslag"')
    expect(f).toContain('aria-label="Uke 2, 2 forslag"')
    expect(f).toContain('aria-label="Uke 3, 0 forslag"')
  })

  it('filteret endrer ikke tallboksene', () => {
    const html = tegn()
    expect(tekst(html)).toContain('5 Bestillingsforslag i alt')
  })
})

describe('Bestillingsforslag: en kjøring uten forslag', () => {
  const html = tegn({ ...RESULTAT_TABELL, bestillingsforslag: [] })
  const del = seksjon(html)

  it('står bare «Kjøringen gir ingen bestillingsforslag.», og ukefilteret og listen er skjult', () => {
    expect(tekst(del)).toBe('Bestillingsforslag Kjøringen gir ingen bestillingsforslag.')
    expect(del).not.toContain('ukefilter')
    expect(del).not.toContain('<table')
  })

  it('overskriften finnes fortsatt, så seksjonsmenyen har et mål', () => {
    expect(del).toContain('id="seksjon-bestillingsforslag"')
  })
})
