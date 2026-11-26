// Resultattabellen (Story 2.7, FR-14–FR-16, AD-14, UX-DR21–UX-DR24): modellen og HTML-en, med eksempeldata fra
// testeksempel 01. Klikk, filter og rulling testes i e2e/resultattabell.spec.ts (venter på Story 2.5).

import { createElement, isValidElement, type ComponentProps, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Eksepsjon } from '../../src/domene/typer.ts'
import { DelTbody } from '../../src/ui/resultat/DelTbody.tsx'
import { Markor } from '../../src/ui/resultat/Markor.tsx'
import { Resultattabell } from '../../src/ui/resultat/Resultattabell.tsx'
import {
  celleNokkel,
  grupperMarkorer,
  innrykkNivaa,
  markorerFor,
  markorplass,
  RADER,
  synligeDeler,
  valgEtterFilter,
} from '../../src/ui/resultat/tabell-modell.ts'
import { EKSEPSJONER_01, KANSELLER_MOTTAK_02, LASESKIVE_04 } from '../domene/typer-eksempler.ts'
import { DELER_01, KJORING_TABELL, RESULTAT_TABELL } from './resultattabell-eksempel.ts'

const UKER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function tegn(resultat = RESULTAT_TABELL): string {
  return renderToStaticMarkup(createElement(Resultattabell, { kjoring: { ...KJORING_TABELL, resultat }, resultat }))
}

/** Teksten uten tagger, med enkle mellomrom. */
function tekst(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** HTML-en til én del. */
function tbody(html: string, varenummer: string): string {
  return new RegExp(`<tbody class="[^"]*" data-del="${varenummer}">[\\s\\S]*?</tbody>`).exec(html)?.[0] ?? ''
}

/** HTML-en til én celle. */
function celle(html: string, varenummer: string, rad: string, uke: number): string {
  return new RegExp(`<td [^>]*data-rad="${rad}" data-uke="${uke}">[\\s\\S]*?</td>`).exec(tbody(html, varenummer))?.[0] ?? ''
}

describe('tabell-modell: hvilken celle en eksepsjon markeres i (UX-DR23)', () => {
  const [bestilling, sikkerhetslager, mottak, ledetid] = EKSEPSJONER_01 as [Eksepsjon, Eksepsjon, Eksepsjon, Eksepsjon]

  it('Bestilling forsinket og Bruk av sikkerhetslager: Nettobehov i uke t', () => {
    expect(markorplass(bestilling)).toEqual({ type: 'CELLE', rad: 'nettobehov', uke: 1 })
    expect(markorplass(sikkerhetslager)).toEqual({ type: 'CELLE', rad: 'nettobehov', uke: 1 })
  })

  it('Mottak forsinket: Nettobehov i uka mottaket fremskyndes til (ikke mottaksuka)', () => {
    expect(markorplass(mottak)).toEqual({ type: 'CELLE', rad: 'nettobehov', uke: 3 })
  })

  it('Kanseller mottak: Planlagte mottak i mottaksuka', () => {
    expect(markorplass(KANSELLER_MOTTAK_02)).toEqual({ type: 'CELLE', rad: 'planlagteMottak', uke: 5 })
  })

  it('Ledetid overskrider horisont: delens felt, ikke en celle', () => {
    expect(markorplass(ledetid)).toEqual({ type: 'DEL' })
  })

  it('flere eksepsjoner i samme celle står sammen, i den sorterte rekkefølgen', () => {
    const per = grupperMarkorer(LASESKIVE_04)
    const celler = markorerFor(per, '300-026').celler.get(celleNokkel('nettobehov', 1))
    expect(celler?.map((e) => e.kode)).toEqual(['BESTILLING_FORSINKET', 'MOTTAK_FORSINKET'])
  })

  it('en del uten eksepsjoner har ingen markører', () => {
    const markorer = markorerFor(grupperMarkorer(EKSEPSJONER_01), '300-001')
    expect(markorer.ved).toEqual([])
    expect(markorer.celler.size).toBe(0)
  })
})

describe('tabell-modell: innrykk, filter og valgt celle', () => {
  it('innrykket er 0, 1 og 2 for nivå 0, .1 og ..2', () => {
    expect([innrykkNivaa('0'), innrykkNivaa('.1'), innrykkNivaa('..2')]).toEqual([0, 1, 2])
  })

  it('filteret beholder stykklisterekkefølgen og bare de kritiske delene', () => {
    expect(synligeDeler(RESULTAT_TABELL, true).map((d) => d.del.varenummer)).toEqual([
      '300-003',
      '300-004',
      '300-005',
      '300-006',
    ])
    expect(synligeDeler(RESULTAT_TABELL, false)).toHaveLength(9)
  })

  it('valgt celle i en del som skjules, nullstilles, og ellers beholdes den', () => {
    const synlige = synligeDeler(RESULTAT_TABELL, true)
    const iHjul = { varenummer: '300-003', rad: 'nettobehov', uke: 1 } as const
    const iSete = { varenummer: '300-001', rad: 'nettobehov', uke: 1 } as const
    expect(valgEtterFilter(iHjul, synlige)).toBe(iHjul)
    expect(valgEtterFilter(iSete, synlige)).toBeNull()
    expect(valgEtterFilter(null, synlige)).toBeNull()
  })
})

describe('Resultattabell: oppbyggingen (AD-14, UX-DR21)', () => {
  const html = tegn()

  it('er én <table> med <caption> for ferdigprodukt og horisont', () => {
    expect(html.match(/<table[\s>]/g)).toHaveLength(1)
    expect(html).toContain('<caption id="resultattabell-bildetekst">Resultattabell for Kontorstol Basic (100-002), horisont 10 uker</caption>')
  })

  it('har <th scope="col"> for nøyaktig H uker, og uke 1 har accent-soft', () => {
    const hode = /<thead>[\s\S]*?<\/thead>/.exec(html)?.[0] ?? ''
    expect(hode.match(/<th [^>]*scope="col"/g)).toHaveLength(10)
    expect(tekst(hode)).toBe('Uke 1 Uke 2 Uke 3 Uke 4 Uke 5 Uke 6 Uke 7 Uke 8 Uke 9 Uke 10')
    expect(hode).toContain('<th scope="col" class="uke-1">')
  })

  it('har én <tbody> per del, i stykklisterekkefølge, med delens felt som <th scope="rowgroup">', () => {
    expect([...html.matchAll(/<tbody class="[^"]*" data-del="([^"]+)">/g)].map((m) => m[1])).toEqual(
      DELER_01.map((d) => d.del.varenummer),
    )
    expect(html.match(/<th scope="rowgroup" rowSpan="6"/gi)).toHaveLength(9)
  })

  it('hver del har de seks radene fra FR-14 i rekkefølgen, og H celler i hver', () => {
    const hjul = tbody(html, '300-003')
    const rader = [...hjul.matchAll(/<th scope="row"[^>]*>([^<]*)<\/th>/g)].map((m) => m[1])
    expect(rader).toEqual([
      'Bruttobehov',
      'Planlagte mottak',
      'Forventet lagerbeholdning',
      'Nettobehov',
      'Planlagte ordremottak',
      'Planlagte ordrefrigivelser',
    ])
    expect(RADER).toHaveLength(6)
    expect(hjul.match(/<tr>/g)).toHaveLength(6)
    expect(hjul.match(/<td /g)).toHaveLength(60)
  })

  it('en felles del står én gang', () => {
    expect(html.match(/data-del="300-007"/g)).toHaveLength(1)
  })

  it('tallene for 300-003 Hjul i uke 1 er fra fasit 01', () => {
    const verdi = (rad: string) => tekst(celle(html, '300-003', rad, 1)).replace(/^[^\d−]*/, '')
    expect(verdi('bruttobehov')).toBe('100')
    expect(verdi('forventetLagerbeholdning')).toBe('30')
    expect(verdi('nettobehov')).toBe('50')
    expect(verdi('planlagteOrdrefrigivelser')).toBe('175')
  })

  it('nuller har ink-secondary, negative tall har exc-critical og ekte minus, og uke 1 har accent-soft', () => {
    expect(celle(html, '300-001', 'nettobehov', 2)).toContain('<span class="tall tall-null">0</span>')
    expect(celle(html, '300-005', 'forventetLagerbeholdning', 9)).toContain('<span class="tall tall-negativ">−5</span>')
    expect(celle(html, '300-003', 'bruttobehov', 1)).toContain('celle-uke1')
    expect(celle(html, '300-003', 'bruttobehov', 2)).not.toContain('celle-uke1')
  })

  it('planlagte ordrefrigivelser står i fet skrift (table-strong)', () => {
    expect(celle(html, '300-003', 'planlagteOrdrefrigivelser', 3)).toContain('celle-sterk')
    expect(celle(html, '300-003', 'nettobehov', 3)).not.toContain('celle-sterk')
  })

  it('området med rulling er en navngitt region koblet til seksjonsoverskriften', () => {
    expect(html).toContain('role="region" aria-labelledby="resultattabell-bildetekst"')
  })
})

describe('Resultattabell: delens felt (UX-DR21)', () => {
  const html = tegn()
  const hjul = tbody(html, '300-003')

  it('har nivåmerke, varenummer i Mono, beskrivelse, type, lager, SS, L og antall per overordnet del', () => {
    expect(hjul).toContain('<span class="skjult-visuelt">Nivå </span>.1</span>')
    expect(hjul).toContain('<span class="delfelt-varenummer">300-003</span>')
    const felt = tekst(/<th scope="rowgroup"[\s\S]*?<\/th>/i.exec(hjul)?.[0] ?? '')
    expect(felt).toContain('Hjul')
    expect(felt).toContain('Komponent (Kjøpes inn)')
    expect(felt).toContain('Lager 80 · SS 30 · L 1')
    expect(felt).toContain('lagerbeholdning 80, sikkerhetslager 30, ledetid 1 uke')
    expect(felt).toContain('Antall: 5 per 100-002')
  })

  it('innrykket er 12 px per nivå', () => {
    expect(tbody(html, '100-002')).toContain('delfelt-innhold innrykk-0')
    expect(hjul).toContain('delfelt-innhold innrykk-1')
    expect(tbody(html, '300-007')).toContain('delfelt-innhold innrykk-2')
  })

  it('en kritisk del har «● Kritisk del», synlig og som tilgjengelig navn, og de andre har det ikke', () => {
    expect(hjul).toContain('<div class="kritisk-flagg"><span aria-hidden="true">●</span> Kritisk del</div>')
    expect(tbody(html, '300-001')).not.toContain('kritisk-flagg')
    expect(html.match(/<div class="kritisk-flagg">/g)).toHaveLength(4)
  })

  it('en del med ferdigprodukt har ingen «Antall … per»', () => {
    expect(tekst(tbody(html, '100-002'))).not.toContain('Antall:')
    expect(tekst(tbody(html, '100-002'))).toContain('Ferdigvare')
  })
})

describe('Resultattabell: eksepsjonsmarkørene (FR-15, UX-DR23)', () => {
  const html = tegn()

  it('Bestilling forsinket står i Nettobehov uke 1 for Hjul, med symbol, lys bakgrunn og tilgjengelig navn', () => {
    const c = celle(html, '300-003', 'nettobehov', 1)
    expect(c).toContain('<span class="markor eks-kritisk" role="img" aria-label="Bestilling forsinket, uke 1">!</span>')
    expect(c).toContain('eks-kritisk-bakgrunn')
  })

  it('Bruk av sikkerhetslager står i Nettobehov uke 1 for Armlene', () => {
    const c = celle(html, '300-004', 'nettobehov', 1)
    expect(c).toContain('aria-label="Bruk av sikkerhetslager, uke 1">S</span>')
    expect(c).toContain('eks-sikkerhetslager-bakgrunn')
  })

  it('Mottak forsinket står i uka mottaket fremskyndes til (uke 3), ikke i mottaksuka (uke 4)', () => {
    expect(celle(html, '300-005', 'nettobehov', 3)).toContain('aria-label="Mottak forsinket, uke 3">M</span>')
    expect(celle(html, '300-005', 'nettobehov', 4)).not.toContain('markor')
    expect(celle(html, '300-005', 'planlagteMottak', 4)).not.toContain('markor')
  })

  it('Ledetid overskrider horisont står ved delens felt, med «hele delen» i navnet', () => {
    const felt = /<th scope="rowgroup"[\s\S]*?<\/th>/i.exec(tbody(html, '300-006'))?.[0] ?? ''
    expect(felt).toContain('aria-label="Ledetid overskrider horisont, hele delen">⧗</span>')
    expect(felt).toContain('eks-horisont-bakgrunn')
  })

  it('Kanseller mottak står i Planlagte mottak i mottaksuka', () => {
    const resultat = { ...RESULTAT_TABELL, eksepsjoner: [...EKSEPSJONER_01, KANSELLER_MOTTAK_02] }
    const c = celle(tegn(resultat), '300-005', 'planlagteMottak', 5)
    expect(c).toContain('aria-label="Kanseller mottak, uke 5">K</span>')
    expect(c).toContain('eks-kanseller-bakgrunn')
  })

  it('flere eksepsjoner i samme celle står side om side', () => {
    // Mottak forsinket for Hjul i uke 1, i tillegg til Bestilling forsinket (som for 300-026 i fasit 04).
    const resultat = { ...RESULTAT_TABELL, eksepsjoner: [...EKSEPSJONER_01, { ...LASESKIVE_04[1]!, varenummer: '300-003' }] }
    const c = celle(tegn(resultat), '300-003', 'nettobehov', 1)
    expect(c.match(/class="markor /g)).toHaveLength(2)
    expect(c.indexOf('Bestilling forsinket')).toBeLessThan(c.indexOf('Mottak forsinket'))
  })

  it('ingen egen rad for eksepsjoner, og celler uten eksepsjon har ingen markør', () => {
    expect(tbody(html, '300-003').match(/<tr>/g)).toHaveLength(6)
    expect(celle(html, '300-003', 'nettobehov', 2)).not.toContain('markor')
    expect(celle(html, '300-001', 'nettobehov', 1)).not.toContain('markor')
  })

  it('tegnforklaringen over tabellen har de fem eksepsjonene, kritisk del og valgt celle', () => {
    const forklaring = /<ul class="tegnforklaring"[\s\S]*?<\/ul>/.exec(html)?.[0] ?? ''
    expect(tekst(forklaring)).toBe(
      '⧗ Ledetid overskrider horisont ! Bestilling forsinket S Bruk av sikkerhetslager M Mottak forsinket K Kanseller mottak ● Kritisk del Valgt celle',
    )
    expect(forklaring).toContain('aria-label="Tegnforklaring"')
  })
})

describe('Resultattabell: valgt celle (UX-DR21, FR-18)', () => {
  const del = DELER_01[3]!
  const markorer = markorerFor(grupperMarkorer(EKSEPSJONER_01), '300-003')
  const tegnDel = (valgtRad: 'nettobehov' | null, valgtUke: number | null) =>
    renderToStaticMarkup(
      createElement('table', null, createElement(DelTbody, { del, markorer, uker: UKER, valgtRad, valgtUke, onVelg: () => {} })),
    )

  it('uten valg har ingen celle ramme, og ingen radnavn er fete', () => {
    const html = tegnDel(null, null)
    expect(html).not.toContain('celle-valgt')
    expect(html).not.toContain('radnavn-valgt')
  })

  it('den valgte cellen får rammen, og bare radnavnet i samme rad blir fet', () => {
    const html = tegnDel('nettobehov', 3)
    expect(html.match(/celle-valgt/g)).toHaveLength(1)
    expect(html).toMatch(/<td class="celle celle-valgt"[^>]*data-rad="nettobehov" data-uke="3"/)
    expect(html.match(/radnavn-valgt/g)).toHaveLength(1)
    expect(html).toMatch(/<th scope="row" class="radnavn radnavn-valgt">Nettobehov<\/th>/)
  })
})

describe('Resultattabell: filteret «Vis bare kritiske deler» (FR-16, UX-DR24)', () => {
  it('avkrysningsboksen står over tabellen og er av når resultatet åpnes, med alle delene synlige', () => {
    const html = tegn()
    expect(html).toMatch(/<label class="tabellfilter"><input type="checkbox"\/>[\s\S]*Vis bare kritiske deler<\/label>/)
    expect(html).not.toContain('checked')
    expect(html).not.toContain('Viser ')
    expect(html.match(/<tbody /g)).toHaveLength(9)
    expect(html.indexOf('tabellfilter')).toBeLessThan(html.indexOf('<table'))
  })

  it('er skjult når det ikke finnes kritiske deler', () => {
    const html = tegn({ ...RESULTAT_TABELL, eksepsjoner: [], kritiskeDeler: [] })
    expect(html).not.toContain('Vis bare kritiske deler')
    expect(html.match(/<tbody /g)).toHaveLength(9)
  })
})

describe('Resultattabell: unike React-nøkler og landemerker (Carmens F2 og navn på regionen)', () => {
  // 300-028 i testeksempel 04: to mottak (uke 3 og uke 5) fremskyndes til uke 2, så to Mottak forsinket står i samme celle.
  const to300028 = (kode: 'MOTTAK_FORSINKET'): Eksepsjon[] =>
    [
      { kode, varenummer: '300-003', beskrivelse: 'Hjul', delstype: 'KJOPES_INN', uke: 2, mottaksuke: 3, antall: 10, excelRad: 2, disponibelForFremskynding: -25, sikkerhetslager: 0 },
      { kode, varenummer: '300-003', beskrivelse: 'Hjul', delstype: 'KJOPES_INN', uke: 2, mottaksuke: 5, antall: 15, excelRad: 3, disponibelForFremskynding: -25, sikkerhetslager: 0 },
    ] as Eksepsjon[]

  /**
   * Nøklene til alle markørene i en tegnet del. React advarer om like nøkler først når den oppdaterer DOM-en, så server-
   * tegning (renderToStaticMarkup) fanger det ikke. Testen går derfor gjennom elementtreet DelTbody gir.
   */
  function nokler(node: unknown, funnet: string[] = []): string[] {
    if (Array.isArray(node)) node.forEach((n) => nokler(n, funnet))
    else if (isValidElement(node)) {
      const element = node as ReactElement<{ children?: unknown }>
      if (element.type === Markor && element.key !== null) funnet.push(String(element.key))
      nokler(element.props.children, funnet)
    }
    return funnet
  }

  /** DelTbody er memoisert. `.type` er funksjonen inni, som gir elementtreet uten en DOM. */
  function tegnDelSomTre(eksepsjoner: Eksepsjon[]): ReactElement {
    const del = DELER_01[3]!
    const innmat = (DelTbody as unknown as { type: (props: ComponentProps<typeof DelTbody>) => ReactElement }).type
    return innmat({
      del,
      markorer: markorerFor(grupperMarkorer(eksepsjoner), del.del.varenummer),
      uker: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      valgtRad: null,
      valgtUke: null,
      onVelg: () => {},
    })
  }

  it('to eksepsjoner av samme type i samme celle får hver sin nøkkel, og begge markørene står der', () => {
    const alle = [...EKSEPSJONER_01, ...to300028('MOTTAK_FORSINKET')]
    const liste = nokler(tegnDelSomTre(alle))
    expect(liste.length).toBeGreaterThanOrEqual(3)
    expect(new Set(liste).size).toBe(liste.length)
    const resultat = { ...RESULTAT_TABELL, eksepsjoner: alle }
    expect(celle(tegn(resultat), '300-003', 'nettobehov', 2).match(/class="markor /g)).toHaveLength(2)
  })

  it('nøklene er også unike når delen både har Ledetid overskrider horisont og eksepsjoner i cellene', () => {
    const ledetid = { ...EKSEPSJONER_01[3]!, varenummer: '300-003' } as Eksepsjon
    const liste = nokler(tegnDelSomTre([ledetid, ...to300028('MOTTAK_FORSINKET'), EKSEPSJONER_01[0] as Eksepsjon]))
    expect(new Set(liste).size).toBe(liste.length)
  })

  it('regionen med rulling heter etter bildeteksten, så siden ikke har to landemerker som heter «Resultattabell»', () => {
    const html = tegn()
    expect(html).toContain('<caption id="resultattabell-bildetekst">')
    expect(html).toContain('role="region" aria-labelledby="resultattabell-bildetekst"')
    expect(html.match(/id="resultattabell-bildetekst"/g)).toHaveLength(1)
    expect(html).not.toContain('aria-labelledby="seksjon-resultattabell"')
  })
})
