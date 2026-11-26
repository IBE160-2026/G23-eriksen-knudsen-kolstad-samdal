// Feiloppsummeringen (Story 1.12, FR-2, FR-4, UX-DR11): grupperingen, sorteringen og sammenslåingen i
// feiloppsummering.ts, tekstene i tekster/nb.ts og HTML-en fra Feiloppsummering.tsx.
// V-F05 og V-F06 leses fra de ekte filene i testdata/validering/. Fokus og samspillet i nettleseren testes i
// e2e/feiloppsummering.spec.ts.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createElement, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  VALIDERINGSKODER,
  type Feilsted,
  type HoppetOverKontroll,
  type Valideringsfeil,
  type Valideringskode,
  type Valideringsresultat,
} from '../../src/domene/typer.ts'
import { valider } from '../../src/domene/valider.ts'
import { les } from '../../src/excel/les.ts'
import { filfeilOgValidering, samletAarsak } from '../../src/tekster/nb.ts'
import { Feiloppsummering } from '../../src/ui/ny-kjoring/Feiloppsummering.tsx'
import { kanSlaasSammen, lagOppsummering, type Feillinje, type Oppsummering } from '../../src/ui/ny-kjoring/feiloppsummering.ts'

const tekst = filfeilOgValidering.feiloppsummering
const VALIDERING = join(import.meta.dirname, '..', '..', 'testdata', 'validering')

function resultatFor(fil: string): Valideringsresultat {
  const lest = les(readFileSync(join(VALIDERING, fil)), fil)
  if (!lest.ok) throw new Error(`${fil}: ${lest.feil.kode}`)
  const validert = valider(lest.verdi)
  if (validert.ok) throw new Error(`${fil}: ventet valideringsfeil`)
  return validert.feil
}

/** En linje slik Kari ser den i tabellen: [Ark, Sted, Felt, Feil]. */
function rad({ feil, samlet }: Feillinje): string[] {
  return [tekst.ark(feil.ark), tekst.sted(feil, samlet), tekst.felt(feil), tekst.aarsak(feil, samlet)]
}

function tegn(oppsummering: Oppsummering): string {
  return renderToStaticMarkup(createElement(Feiloppsummering, { oppsummering, brett: createRef<HTMLElement>() }))
}

const celle = (kolonne: string, excelRad: number): Feilsted => ({ type: 'CELLE', celle: `${kolonne}${excelRad}`, excelRad })
const uke = (n: number): Feilsted => ({ type: 'UKE', uke: n })

function mottak(kode: Valideringskode, felt: 'Varenummer' | 'Uke' | 'Antall', excelRad: number, verdi: Valideringsfeil['verdi'] = 'x'): Valideringsfeil {
  const kolonne = { Varenummer: 'A', Uke: 'B', Antall: 'C' }[felt]
  return { kode, ark: 'Planlagte mottak', sted: celle(kolonne, excelRad), felt, verdi }
}

const resultat = (feil: Valideringsfeil[], hoppetOver: HoppetOverKontroll[] = []): Valideringsresultat => ({ feil, hoppetOver })

// ---------------------------------------------------------------------------
// V-F05 og V-F06 (FR-4, FR-2)
// ---------------------------------------------------------------------------

describe('V-F05: tre feil på tre ark (FR-4)', () => {
  const oppsummering = lagOppsummering(resultatFor('V-F05.xlsx'))

  it('nøyaktig tre feil i tre grupper i malens rekkefølge, og ingen strukturgruppe', () => {
    expect(oppsummering.antallFeil).toBe(3)
    expect(oppsummering.struktur).toBeNull()
    expect(oppsummering.ark.map((g) => [g.ark, g.antallFeil, g.linjer.length])).toEqual([
      ['Stykkliste', 1, 1],
      ['MPS', 1, 1],
      ['Planlagte mottak', 1, 1],
    ])
  })

  it('linjene viser ark, sted (Excel-raden eller uken), felt og årsaken', () => {
    expect(oppsummering.ark.map((g) => rad(g.linjer[0]!))).toEqual([
      ['Stykkliste', 'rad 9', 'Antall', '«0» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.'],
      [
        'Prognostiserte behov (arket MPS)',
        'uke 3',
        'Antall ferdigprodukter',
        '«−5» er ikke et gyldig antall. Skriv et heltall som er 0 eller mer.',
      ],
      ['Planlagte mottak', 'rad 2', 'Uke', 'Uke 0 er før horisonten. Første uke i horisonten er uke 1.'],
    ])
  })

  it('overskriften og gruppene har teksten fra EXPERIENCE.md', () => {
    expect(tekst.overskrift(oppsummering.antallFeil)).toBe(
      'Filen har 3 feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.',
    )
    expect(oppsummering.ark.map((g) => tekst.arkgruppe(g.ark, g.antallFeil))).toEqual([
      'Stykkliste (1 feil)',
      'Prognostiserte behov (arket MPS) (1 feil)',
      'Planlagte mottak (1 feil)',
    ])
  })
})

describe('V-F06: én strukturfeil og én verdifeil (FR-2, FR-4)', () => {
  const oppsummering = lagOppsummering(resultatFor('V-F06.xlsx'))

  it('nøyaktig to feil: H1 i «Filen følger ikke malen» og antall 0 på C3 i Planlagte mottak', () => {
    expect(oppsummering.antallFeil).toBe(2)
    expect(oppsummering.struktur?.linjer.map(rad)).toEqual([
      ['Stykkliste', 'H1', 'Ledetid (uker)', 'Kolonneoverskriften «Ledetid (uker)» mangler. Skriv den inn slik den står i malen.'],
    ])
    expect(oppsummering.ark.map((g) => [g.ark, g.linjer.map(rad)])).toEqual([
      [
        'Planlagte mottak',
        [['Planlagte mottak', 'rad 3', 'Antall', '«0» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.']],
      ],
    ])
  })

  it('strukturgruppen sier at ledetidene ikke er kontrollert', () => {
    const hoppetOver = oppsummering.struktur!.hoppetOver
    expect(hoppetOver).toHaveLength(1)
    expect(tekst.hoppetOverKolonne((hoppetOver[0] as { kontroll: HoppetOverKontroll }).kontroll)).toBe(
      'Verdiene i kolonnen «Ledetid (uker)» i arket Stykkliste er ikke kontrollert, fordi overskriften mangler.',
    )
  })
})

describe('kontroller som er hoppet over (FR-2)', () => {
  it('V-F01 (MPS mangler): én linje for hele arket og én for ukene i Planlagte mottak, ikke én per kolonne', () => {
    const oppsummering = lagOppsummering(resultatFor('V-F01.xlsx'))
    const linjer = oppsummering.struktur!.hoppetOver.map((l) =>
      l.type === 'ARK' ? tekst.hoppetOverArk(l.ark) : tekst.hoppetOverKolonne(l.kontroll),
    )
    expect(linjer).toEqual([
      'Verdiene i Prognostiserte behov (arket MPS) er ikke kontrollert, fordi arket mangler.',
      'Kolonnen «Uke» i arket Planlagte mottak er ikke kontrollert, fordi Prognostiserte behov (arket MPS) mangler.',
    ])
    expect(oppsummering.struktur!.linjer.map(rad)).toEqual([
      [
        'Prognostiserte behov (arket MPS)',
        'hele arket',
        'Ark',
        'Prognostiserte behov (arket MPS) mangler. Legg det til slik det står i malen, med kolonneoverskriftene i rad 1.',
      ],
    ])
    expect(oppsummering.ark).toEqual([])
  })

  it('en kolonne som avhenger av en overskrift i et annet ark, nevner overskriften og arket', () => {
    expect(
      tekst.hoppetOverKolonne({
        ark: 'Planlagte mottak',
        felt: 'Uke',
        fordi: { kode: 'OVERSKRIFT_MANGLER', ark: 'MPS', felt: 'Antall ferdigprodukter' },
      }),
    ).toBe(
      'Kolonnen «Uke» i arket Planlagte mottak er ikke kontrollert, fordi overskriften «Antall ferdigprodukter» mangler i Prognostiserte behov (arket MPS).',
    )
  })
})

// ---------------------------------------------------------------------------
// Gruppering og sortering (UX-DR11)
// ---------------------------------------------------------------------------

describe('gruppering og sortering', () => {
  it('strukturfeil først, så arkene i malens rekkefølge, uansett rekkefølgen feilene kommer i', () => {
    const oppsummering = lagOppsummering(
      resultat([
        mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 3, 0),
        { kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: uke(2), felt: 'Antall ferdigprodukter', verdi: -1 },
        { kode: 'OVERSKRIFT_MANGLER', ark: 'Planlagte mottak', sted: { type: 'OVERSKRIFT', celle: 'A1' }, felt: 'Varenummer' },
        { kode: 'ANTALL_UGYLDIG', ark: 'Stykkliste', sted: celle('D', 4), felt: 'Antall', verdi: 0 },
        { kode: 'ARK_MANGLER', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' },
      ]),
    )
    expect(oppsummering.struktur!.linjer.map((l) => l.feil.ark)).toEqual(['Stykkliste', 'Planlagte mottak'])
    expect(oppsummering.ark.map((g) => g.ark)).toEqual(['Stykkliste', 'MPS', 'Planlagte mottak'])
    expect(oppsummering.antallFeil).toBe(5)
  })

  it('verdifeil sorteres etter Excel-rad, og ved lik rad i rekkefølgen fra valideringen (kolonnene)', () => {
    const oppsummering = lagOppsummering(
      resultat([
        mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 12, 0),
        mottak('MOTTAK_VARENUMMER_UKJENT', 'Varenummer', 5, '999'),
        mottak('MOTTAK_UKE_UTENFOR_HORISONT', 'Uke', 5, 0),
        mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 2, 0),
      ]),
    )
    expect(oppsummering.ark[0]!.linjer.map((l) => tekst.sted(l.feil, l.samlet) + ' ' + l.feil.felt)).toEqual([
      'rad 2 Antall',
      'rad 5 Varenummer',
      'rad 5 Uke',
      'rad 12 Antall',
    ])
  })

  it('på arket MPS sorteres feilene etter uke', () => {
    const mps = (kode: Valideringskode, n: number): Valideringsfeil => ({
      kode,
      ark: 'MPS',
      sted: uke(n),
      felt: 'Antall ferdigprodukter',
      verdi: 1,
    })
    const oppsummering = lagOppsummering(resultat([mps('MPS_UKE_ETTER_HULL', 11), mps('MPS_ANTALL_UGYLDIG', 3), mps('MPS_HORISONT_UGYLDIG', 8)]))
    expect(oppsummering.ark[0]!.linjer.map((l) => tekst.sted(l.feil, l.samlet))).toEqual(['uke 3', 'uke 8', 'uke 11'])
  })

  it('én feil gir også en oppsummering', () => {
    const oppsummering = lagOppsummering(resultat([mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 5, 'ca. 40')]))
    expect(oppsummering.antallFeil).toBe(1)
    expect(tekst.overskrift(1)).toBe('Filen har 1 feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.')
  })

  it('UJ-4: tre feil på to ark, med teksten i mønsteret fra EXPERIENCE.md', () => {
    const oppsummering = lagOppsummering(
      resultat([
        { kode: 'MPS_UKE_ETTER_HULL', ark: 'MPS', sted: uke(11), felt: 'Antall ferdigprodukter', verdi: 30 },
        mottak('MOTTAK_UKE_UTENFOR_HORISONT', 'Uke', 4, 0),
        mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 5, 'ca. 40'),
      ]),
    )
    const meldinger = oppsummering.ark.flatMap((g) => g.linjer.map((l) => tekst.melding(l.feil, l.samlet)))
    expect(meldinger[1]).toBe('Planlagte mottak, rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.')
    expect(meldinger[0]!.startsWith('Prognostiserte behov (arket MPS), uke 11, Antall ferdigprodukter: ')).toBe(true)
    expect(meldinger[2]!.startsWith('Planlagte mottak, rad 5, Antall: «ca. 40»')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Sammenslåing av like feil (UX-DR11, beslutning 26.11: bare sammenhengende rader og uker)
// ---------------------------------------------------------------------------

describe('sammenslåing av like feil', () => {
  const ukeFeil = (rader: number[]): Valideringsfeil[] => rader.map((r) => mottak('MOTTAK_UKE_IKKE_HELTALL', 'Uke', r, `uke ${r}`))
  const fra = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)

  it('50 like feil på rad 4–53 blir én linje med intervall og antall, som i EXPERIENCE.md', () => {
    const oppsummering = lagOppsummering(resultat(ukeFeil(fra(4, 53))))
    const gruppe = oppsummering.ark[0]!
    expect(gruppe.antallFeil).toBe(50)
    expect(gruppe.linjer).toHaveLength(1)
    const [linje] = gruppe.linjer
    expect(tekst.melding(linje!.feil, linje!.samlet)).toBe('Planlagte mottak, rad 4–53, Uke: må være et heltall (50 rader).')
    expect(rad(linje!)).toEqual(['Planlagte mottak', 'rad 4–53', 'Uke', 'Må være et heltall (50 rader).'])
    expect(tekst.overskrift(oppsummering.antallFeil)).toContain('Filen har 50 feil.')
  })

  it('bare sammenhengende rader slås sammen: et hull starter en ny linje', () => {
    const linjer = lagOppsummering(resultat(ukeFeil([4, 5, 6, 9, 10, 15]))).ark[0]!.linjer
    expect(linjer.map((l) => tekst.sted(l.feil, l.samlet))).toEqual(['rad 4–6', 'rad 9–10', 'rad 15'])
    expect(linjer.map((l) => l.samlet?.antall ?? 1)).toEqual([3, 2, 1])
  })

  it('en enkelt feil står med sin egen melding og verdien', () => {
    const [linje] = lagOppsummering(resultat(ukeFeil([7]))).ark[0]!.linjer
    expect(linje!.samlet).toBeNull()
    expect(tekst.aarsak(linje!.feil, null)).toBe('«uke 7» er ikke en uke. Skriv uken som et heltall, for eksempel 4.')
  })

  it('ulike koder eller ulike kolonner på de samme radene slås ikke sammen med hverandre', () => {
    const linjer = lagOppsummering(
      resultat([
        mottak('MOTTAK_UKE_IKKE_HELTALL', 'Uke', 4),
        mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 4),
        mottak('MOTTAK_UKE_IKKE_HELTALL', 'Uke', 5),
        mottak('MOTTAK_ANTALL_UGYLDIG', 'Antall', 5),
        mottak('MOTTAK_UKE_UTENFOR_HORISONT', 'Uke', 6, 0),
      ]),
    ).ark[0]!.linjer
    expect(linjer.map((l) => [tekst.sted(l.feil, l.samlet), l.feil.felt, l.feil.kode])).toEqual([
      ['rad 4–5', 'Uke', 'MOTTAK_UKE_IKKE_HELTALL'],
      ['rad 4–5', 'Antall', 'MOTTAK_ANTALL_UGYLDIG'],
      ['rad 6', 'Uke', 'MOTTAK_UKE_UTENFOR_HORISONT'],
    ])
  })

  it('på arket MPS slås sammenhengende uker sammen, med «uker» som enhet', () => {
    const mps = [3, 4, 5].map(
      (n): Valideringsfeil => ({ kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: uke(n), felt: 'Antall ferdigprodukter', verdi: -1 }),
    )
    const [linje] = lagOppsummering(resultat(mps)).ark[0]!.linjer
    expect(tekst.melding(linje!.feil, linje!.samlet)).toBe(
      'Prognostiserte behov (arket MPS), uke 3–5, Antall ferdigprodukter: må være et heltall som er 0 eller mer (3 uker).',
    )
  })

  it('feil med varenummer, andre rader eller uke utenfor horisonten slås aldri sammen, så ingenting går tapt', () => {
    const fylt = [7, 8, 9].map(
      (r): Valideringsfeil => ({
        kode: 'LAGERBEHOLDNING_FYLT_UT_SENERE',
        ark: 'Stykkliste',
        sted: celle('F', r),
        felt: 'Lagerbeholdning',
        verdi: 1,
        varenummer: `300-00${r}`,
        andreRader: [r - 5],
      }),
    )
    const linjer = lagOppsummering(resultat(fylt)).ark[0]!.linjer
    expect(linjer).toHaveLength(3)
    expect(linjer.map((l) => tekst.aarsak(l.feil, l.samlet))).toEqual([
      'Lagerbeholdningen er allerede fylt ut i rad 2 for varenummer 300-007. Tøm cellen her.',
      'Lagerbeholdningen er allerede fylt ut i rad 3 for varenummer 300-008. Tøm cellen her.',
      'Lagerbeholdningen er allerede fylt ut i rad 4 for varenummer 300-009. Tøm cellen her.',
    ])
    for (const kode of [
      'MOTTAK_VARENUMMER_UKJENT',
      'MOTTAK_UKE_UTENFOR_HORISONT',
      'BESKRIVELSE_ULIK',
      'TYPE_ULIK',
      'TYPE_KJOPES_INN_HAR_UNDERDELER',
      'UNDERDELER_ULIKE',
      'VARENUMMER_UNDER_SEG_SELV',
      'LEDETID_FYLT_UT_SENERE',
      'SIKKERHETSLAGER_FYLT_UT_SENERE',
      'MPS_HORISONT_UGYLDIG',
      'RADER_IKKE_SAMMENHENGENDE',
      'ARK_MANGLER',
      'OVERSKRIFT_MANGLER',
    ] as const) {
      expect(kanSlaasSammen(kode), kode).toBe(false)
    }
  })

  it('hver kode som kan slås sammen, er en kode fra valideringen og har en samlet tekst uten verdi og punktum', () => {
    for (const [kode, aarsak] of Object.entries(samletAarsak)) {
      expect(VALIDERINGSKODER as readonly string[], kode).toContain(kode)
      expect(aarsak.endsWith('.'), kode).toBe(false)
      expect(aarsak, kode).not.toContain('«')
    }
  })
})

// ---------------------------------------------------------------------------
// HTML og tilgjengelighet (UX-DR11, EXPERIENCE.md › Accessibility)
// ---------------------------------------------------------------------------

describe('HTML-en', () => {
  const v05 = tegn(lagOppsummering(resultatFor('V-F05.xlsx')))
  const v06 = tegn(lagOppsummering(resultatFor('V-F06.xlsx')))

  it('brettet får fokus med tabindex="-1", er en navngitt region og har ingen role="alert"', () => {
    expect(v05).toMatch(/^<section class="feiloppsummering" tabindex="-1" aria-labelledby="([^"]+)">/)
    const id = /aria-labelledby="([^"]+)"/.exec(v05)![1]!
    expect(v05).toContain(`<h1 id="${id}">${tekst.overskrift(3)}</h1>`)
    expect(v05).not.toContain('role="alert"')
    expect(v05).not.toContain('aria-live')
  })

  it('har én h1, «✕» skjult for skjermleseren, og sier at den lagrede kjøringen er urørt', () => {
    expect(v05.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(v05).toContain('<span class="feiloppsummering-ikon" aria-hidden="true">✕</span>')
    expect(v05).toContain('Den lagrede kjøringen er ikke endret.')
  })

  it('V-F05: tre grupper med h2 og hver sin tabell med kolonnene Ark, Sted, Felt og Feil', () => {
    expect([...v05.matchAll(/<h2 id="[^"]+">([^<]+)<\/h2>/g)].map((m) => m[1])).toEqual([
      'Stykkliste (1 feil)',
      'Prognostiserte behov (arket MPS) (1 feil)',
      'Planlagte mottak (1 feil)',
    ])
    expect(v05.match(/<table /g)).toHaveLength(3)
    expect(v05.match(/<th scope="col">Ark<\/th><th scope="col">Sted<\/th><th scope="col">Felt<\/th><th scope="col">Feil<\/th>/g)).toHaveLength(3)
    expect(v05.match(/<tbody><tr>/g)).toHaveLength(3)
    // Hver tabell er navngitt av overskriften til gruppen.
    for (const m of v05.matchAll(/<table class="feiltabell" aria-labelledby="([^"]+)">/g)) expect(v05).toContain(`<h2 id="${m[1]}">`)
  })

  it('V-F06: strukturgruppen først, med listen over kontroller som er hoppet over, så Planlagte mottak', () => {
    const h2 = [...v06.matchAll(/<h2 id="[^"]+">([^<]+)<\/h2>/g)].map((m) => m[1])
    expect(h2).toEqual(['Filen følger ikke malen', 'Planlagte mottak (1 feil)'])
    expect(v06).toContain(tekst.hoppetOverIngress)
    expect(v06).toContain('<li>Verdiene i kolonnen «Ledetid (uker)» i arket Stykkliste er ikke kontrollert, fordi overskriften mangler.</li>')
    expect(v06.match(/<tbody><tr>/g)).toHaveLength(2)
  })

  it('id-ene er unike og har ikke mellomrom', () => {
    const ider = [...v05.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!)
    expect(new Set(ider).size).toBe(ider.length)
    for (const id of ider) expect(id).not.toMatch(/\s/)
  })
})

describe('sidetittelen og den urørte kjøringen (UX-DR11, beslutning 26.11)', () => {
  it('sidetittelen er «Feil: Ny kjøring – COSI - MRP»', () => {
    expect(tekst.sidetittel).toBe('Feil: Ny kjøring – COSI - MRP')
  })

  it('teksten om den lagrede kjøringen', () => {
    expect(tekst.urort).toBe('Den lagrede kjøringen er ikke endret.')
  })
})
