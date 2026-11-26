// Seksjonen Kritiske deler (Story 2.10, FR-16, UX-DR17): hvilken celle et hopp lander i, setningene i vanlig språk
// og HTML-en med eksempeldata fra testeksempel 01. Hoppet, fokus og rulling testes i nettleseren
// (e2e/kritiske-deler.spec.ts, venter på Story 2.5).

import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Kjorer } from '../../src/app/kjoring.ts'
import { startTilstand, Tilstandskontekst } from '../../src/app/tilstand-handlinger.ts'
import type { Bestillingsforslag, Eksepsjon, Kjoring, Resultat as ResultatData } from '../../src/domene/typer.ts'
import { eksepsjoner as eksTekster } from '../../src/tekster/nb.ts'
import { Resultat } from '../../src/ui/resultat/Resultat.tsx'
import { hoppPlass } from '../../src/ui/resultat/tabell-modell.ts'
import { EKSEPSJONER_01, KANSELLER_MOTTAK_02 } from '../domene/typer-eksempler.ts'
import { KJORING_TABELL, RESULTAT_TABELL } from './resultattabell-eksempel.ts'

const KJORER: Kjorer = { kjor: () => Promise.resolve({ type: 'OPPTATT' }), pagar: () => false }

function tegn(resultat: ResultatData = RESULTAT_TABELL): string {
  const kjoring: Kjoring = { ...KJORING_TABELL, resultat }
  const verdi = { tilstand: { ...startTilstand, kjoring }, send: () => {}, kjorer: KJORER }
  return renderToStaticMarkup(createElement(Tilstandskontekst, { value: verdi }, createElement(Resultat)))
}

function seksjon(html: string): string {
  return /<section class="resultat-seksjon"[^>]*>[\s\S]*?<\/section>/.exec(html)?.[0] ?? ''
}

function tekst(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const forslag = (varenummer: string, uke: number, mengde: number, forfalt = 0): Bestillingsforslag => ({
  varenummer,
  beskrivelse: varenummer,
  frigivelsesuke: uke,
  mengde,
  forfaltMengde: forfalt,
  art: 'INNKJOP',
})

describe('hoppPlass: cellen med delens tidligste eksepsjon (UX-DR17)', () => {
  it('Bestilling forsinket: Nettobehov i uke 1 (rad 3, kolonne 2)', () => {
    expect(hoppPlass(EKSEPSJONER_01, '300-003')).toEqual({ varenummer: '300-003', r: 3, k: 2 })
  })

  it('Mottak forsinket for 300-005 Gassfjær: Nettobehov i uke 3', () => {
    expect(hoppPlass(EKSEPSJONER_01, '300-005')).toEqual({ varenummer: '300-005', r: 3, k: 4 })
  })

  it('Ledetid overskrider horisont for 300-006 Stolfot: delens felt', () => {
    expect(hoppPlass(EKSEPSJONER_01, '300-006')).toEqual({ varenummer: '300-006', r: 0, k: 0 })
  })

  it('Kanseller mottak: Planlagte mottak i mottaksuka', () => {
    expect(hoppPlass([KANSELLER_MOTTAK_02], '300-005')).toEqual({ varenummer: '300-005', r: 1, k: 6 })
  })

  it('har delen flere eksepsjoner, gjelder den første i den sorterte listen (hele delen først)', () => {
    const horisont = EKSEPSJONER_01[3] as Eksepsjon
    const bestilling = { ...(EKSEPSJONER_01[0] as Eksepsjon), varenummer: '300-006' }
    expect(hoppPlass([horisont, bestilling], '300-006')).toEqual({ varenummer: '300-006', r: 0, k: 0 })
  })

  it('en del uten eksepsjoner gir null', () => {
    expect(hoppPlass(EKSEPSJONER_01, '300-001')).toBeNull()
  })
})

describe('setning i vanlig språk (EXPERIENCE.md › Eksepsjonsmeldinger)', () => {
  const [bestilling, sikkerhet, mottak, ledetid] = EKSEPSJONER_01 as [Eksepsjon, Eksepsjon, Eksepsjon, Eksepsjon]

  it('har en setning for hver eksepsjon, og den er aldri bare typenavnet', () => {
    expect(eksTekster.setning(bestilling)).toBe('Bestillingen skulle vært sendt før uke 1.')
    expect(eksTekster.setning(sikkerhet)).toBe('Bestillingen skulle vært sendt før uke 1, så sikkerhetslageret brukes.')
    expect(eksTekster.setning(mottak)).toBe('Mottaket i uke 4 trengs allerede i uke 3.')
    expect(eksTekster.setning(ledetid)).toBe('Planen er for kort til å vise alt som må bestilles nå.')
    expect(eksTekster.setning(KANSELLER_MOTTAK_02)).toBe('Mottaket i uke 5 trengs ikke innenfor horisonten.')
  })

  it('for en del som produseres selv, står det produksjonen og ikke bestillingen', () => {
    const produksjon = { ...bestilling, delstype: 'PRODUSERES_SELV' } as Eksepsjon
    expect(eksTekster.setning(produksjon)).toBe('Produksjonen skulle vært startet før uke 1.')
    expect(eksTekster.setning({ ...sikkerhet, delstype: 'FERDIGVARE' } as Eksepsjon)).toBe(
      'Produksjonen skulle vært startet før uke 1, så sikkerhetslageret brukes.',
    )
  })

  it('bruker «før uke 1» og aldri «uke 0», «frigitt» eller «før horisonten»', () => {
    for (const e of [...EKSEPSJONER_01, KANSELLER_MOTTAK_02]) {
      expect(eksTekster.setning(e as Eksepsjon)).not.toMatch(/uke 0|frigitt|før horisonten/)
    }
  })
})

describe('Kritiske deler: linjene (FR-16, UX-DR17)', () => {
  const html = tegn()
  const del = seksjon(html)
  const linjer = [...del.matchAll(/<li><button[\s\S]*?<\/button><\/li>/g)].map((m) => m[0])

  it('har h2 «Kritiske deler» og én linje per kritisk del i stykklisterekkefølge, før bestillingsforslagene', () => {
    expect(del).toContain('<h2 id="seksjon-kritiskeDeler" tabindex="-1">Kritiske deler</h2>')
    expect(linjer).toHaveLength(4)
    expect(linjer.map((l) => /kritisk-linje-varenummer">([^<]+)</.exec(l)?.[1])).toEqual([
      '300-003',
      '300-004',
      '300-005',
      '300-006',
    ])
    expect(html.indexOf('seksjon-kritiskeDeler')).toBeLessThan(html.indexOf('seksjon-bestillingsforslag'))
  })

  it('hele linjen er én knapp med tilgjengelig navn fra EXPERIENCE.md', () => {
    expect(linjer[0]).toMatch(/^<li><button type="button" class="kritisk-linje[^"]*"/)
    expect(linjer[0]).toContain(
      'aria-label="300-003 Hjul, Bestilling forsinket, uke 1. Bestillingen skulle vært sendt før uke 1. Se forklaring"',
    )
    expect(linjer[0]!.match(/<button/g)).toHaveLength(1)
  })

  it('viser varenummer, beskrivelse, type og nivå, merket med typenavn og uke, setningen og «Se forklaring →»', () => {
    const t = tekst(linjer[0] ?? '')
    expect(t).toContain('300-003 Hjul Komponent (Kjøpes inn) · nivå .1')
    expect(t).toContain('! Bestilling forsinket · uke 1 Bestillingen skulle vært sendt før uke 1.')
    expect(t).toContain('Se forklaring →')
  })

  it('viser første bestillingsforslag med forfalt mengde og antall forslag i alt', () => {
    const resultat: ResultatData = {
      ...RESULTAT_TABELL,
      bestillingsforslag: [forslag('300-003', 1, 175, 50), forslag('300-003', 4, 150), forslag('300-003', 6, 125)],
    }
    const hjul = seksjon(tegn(resultat))
    expect(tekst(hjul)).toContain('Første bestillingsforslag: 175 i uke 1, 50 forfalt · 3 forslag i alt')
  })

  it('uten forfalt mengde står ikke «forfalt», og en del uten forslag sier det', () => {
    const t = tekst(del)
    expect(t).toContain('Første bestillingsforslag: 60 i uke 1, 10 forfalt · 1 forslag i alt') // 300-004 Armlene
    expect(tekst(linjer[2] ?? '')).toContain('Ingen bestillingsforslag') // 300-005 Gassfjær
    const utenForfalt = tegn({ ...RESULTAT_TABELL, bestillingsforslag: [forslag('300-004', 2, 60)] })
    expect(tekst(seksjon(utenForfalt))).toContain('Første bestillingsforslag: 60 i uke 2 · 1 forslag i alt')
  })

  it('Ledetid overskrider horisont står som «hele delen», og venstrekanten har eksepsjonens farge', () => {
    expect(tekst(linjer[3] ?? '')).toContain('⧗ Ledetid overskrider horisont · hele delen')
    expect(linjer[3]).toContain('kant-eks-horisont')
    expect(linjer[0]).toContain('kant-eks-kritisk')
    expect(linjer[1]).toContain('kant-eks-sikkerhetslager')
    expect(linjer[2]).toContain('kant-eks-mottak')
  })

  it('en del med flere eksepsjoner viser alle, og kanten har fargen til den tidligste', () => {
    const horisont = { ...(EKSEPSJONER_01[3] as Eksepsjon), varenummer: '300-003' }
    const resultat = { ...RESULTAT_TABELL, eksepsjoner: [horisont, ...EKSEPSJONER_01.filter((e) => e.varenummer !== '300-006')] }
    const linje = [...seksjon(tegn(resultat)).matchAll(/<li><button[\s\S]*?<\/button><\/li>/g)].map((m) => m[0])[0] ?? ''
    expect(linje.match(/class="kritisk-eksepsjon"/g)).toHaveLength(2)
    expect(linje).toContain('kant-eks-horisont')
    expect(linje).toContain('aria-label="300-003 Hjul, Ledetid overskrider horisont, hele delen, Bestilling forsinket, uke 1.')
  })

  it('har ikke farge alene: hvert merke har symbol og typenavn', () => {
    for (const linje of linjer) expect(linje).toMatch(/<span class="markor [^"]+" aria-hidden="true">[^<]+<\/span><span class="kritisk-eksepsjon-navn">/)
  })
})

describe('Kritiske deler uten kritiske deler (FR-16)', () => {
  const uten: ResultatData = {
    ...RESULTAT_TABELL,
    deler: RESULTAT_TABELL.deler.map((d) => ({ ...d, kritisk: false })),
    eksepsjoner: [],
    kritiskeDeler: [],
  }
  const html = tegn(uten)

  it('står bare «Ingen kritiske deler. Planen går opp for alle delene.» i en informasjonsboks, uten overskrift og liste', () => {
    expect(html).not.toMatch(/<h2[^>]*>Kritiske deler<\/h2>/)
    expect(html).not.toContain('class="kritiske-deler"')
    const boks = /<div class="informasjonsboks" id="seksjon-kritiskeDeler"[\s\S]*?<\/div>/.exec(html)?.[0] ?? ''
    expect(tekst(boks)).toBe('Ingen kritiske deler. Planen går opp for alle delene.')
  })

  it('meldingen har id-en og kan få fokus, så knappen og tallboksen for kritiske deler fører hit', () => {
    expect(html).toContain('id="seksjon-kritiskeDeler" tabindex="-1"')
    expect(html).toMatch(/<button[^>]*>Kritiske deler<span[^>]*>0<\/span><\/button>/)
  })

  it('seksjonen har ingen aria-labelledby til en overskrift som ikke finnes', () => {
    expect(html).not.toContain('aria-labelledby="seksjon-kritiskeDeler"')
  })

  it('filteret i tabellen er skjult', () => {
    expect(html).not.toContain('Vis bare kritiske deler')
  })
})
