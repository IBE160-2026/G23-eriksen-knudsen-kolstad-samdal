// Fasittestene for bestillingsplanen (Story 2.2, SM-1, NFR-2, AD-16).
//
// Hvert testeksempel kjører samme vei som appen: les (excel/les.ts) → valider → byggStruktur →
// beregnBestillingsplan. Så sammenlignes hvert tall per del, rad og uke med arket Fasittabell,
// rekkefølgen på delene med rekkefølgen i Fasittabell, og hele listen med bestillingsforslag med
// arket Bestillingsforslag. Fasitene leses med tests/hjelpere/fasit-leser.ts (unntaket i AD-15).
//
// Fasit 05 er ikke kontrollert for hånd av gruppen ennå. Testen er like hard som for 01–04
// (beslutning 3A). Feiler den, meldes avviket til gruppen.

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { beregnBestillingsplan } from '../../src/domene/beregn.ts'
import { byggStruktur } from '../../src/domene/struktur.ts'
import type { DelResultat, Resultat } from '../../src/domene/typer.ts'
import { valider } from '../../src/domene/valider.ts'
import { les } from '../../src/excel/les.ts'
import { FASITRADER, lesFasit, testeksempelSti, type Fasit, type Fasitrad } from '../hjelpere/fasit-leser.ts'

/** Hvilken serie i DelResultat hver rad i Fasittabell svarer til (FR-14). */
const SERIE: Record<Fasitrad, keyof DelResultat> = {
  Bruttobehov: 'bruttobehov',
  'Planlagte mottak': 'planlagteMottak',
  'Forventet lagerbeholdning': 'forventetLagerbeholdning',
  Nettobehov: 'nettobehov',
  'Planlagte ordremottak': 'planlagteOrdremottak',
  'Planlagte ordrefrigivelser': 'planlagteOrdrefrigivelser',
}

/** Kjører testeksempelet samme vei som appen (AD-16). */
function beregnTesteksempel(nr: string): Resultat {
  const filnavn = `testeksempel-${nr}.xlsx`
  const lest = les(readFileSync(testeksempelSti(nr)), filnavn)
  if (!lest.ok) throw new Error(`${filnavn}: ventet RaaArk, fikk ${lest.feil.kode}`)
  const validert = valider(lest.verdi)
  if (!validert.ok) throw new Error(`${filnavn}: ventet gyldig fil, fikk ${validert.feil.feil.length} valideringsfeil`)
  return beregnBestillingsplan(validert.verdi, byggStruktur(validert.verdi.stykkliste))
}

const EKSEMPLER = [
  { nr: '01', merknad: '' },
  { nr: '02', merknad: '' },
  { nr: '03', merknad: '' },
  { nr: '04', merknad: '' },
  { nr: '05', merknad: ' (fasiten er ikke kontrollert for hånd: et avvik meldes til gruppen)' },
]

describe.each(EKSEMPLER)('testeksempel $nr$merknad er identisk med fasiten', ({ nr }) => {
  // Leses én gang per testeksempel. Feil i lesingen gir feil i hver test under.
  let fasit: Fasit
  let resultat: Resultat
  const hent = () => {
    fasit ??= lesFasit(nr)
    resultat ??= beregnTesteksempel(nr)
    return { fasit, resultat }
  }

  it('delene står i samme rekkefølge som i Fasittabell (stykklisterekkefølge, FR-14, FR-16)', () => {
    const { fasit, resultat } = hent()
    expect(resultat.deler.map((d) => d.del.varenummer)).toEqual(fasit.deler)
  })

  it('hver serie har lengde H', () => {
    const { fasit, resultat } = hent()
    for (const del of resultat.deler) {
      for (const rad of FASITRADER) expect(del[SERIE[rad]], `${del.del.varenummer} ${rad}`).toHaveLength(fasit.horisont)
      expect(del.utregning, `${del.del.varenummer} utregning`).toHaveLength(fasit.horisont)
    }
  })

  it('alle tall per del, rad og uke er identiske med Fasittabell (SM-1)', () => {
    const { fasit, resultat } = hent()
    // expect.soft gjør at alle avvikende deler og rader meldes i samme kjøring, ikke bare det første.
    let sammenlignet = 0
    for (const varenummer of fasit.deler) {
      const del = resultat.deler.find((d) => d.del.varenummer === varenummer)
      expect.soft(del, `testeksempel ${nr}: ${varenummer} mangler i resultatet`).toBeDefined()
      if (del === undefined) continue
      for (const rad of FASITRADER) {
        expect.soft(del[SERIE[rad]], `testeksempel ${nr}, ${varenummer}, ${rad}`).toEqual(fasit.tabell.get(varenummer)![rad])
        sammenlignet++
      }
    }
    expect(sammenlignet).toBe(fasit.deler.length * FASITRADER.length)
  })

  it('bestillingsforslagene er identiske med arket Bestillingsforslag (FR-17)', () => {
    const { fasit, resultat } = hent()
    expect(resultat.bestillingsforslag).toEqual(fasit.bestillingsforslag)
  })

  it('eksepsjonene er tomme til Story 2.3 (beslutning 1A)', () => {
    const { resultat } = hent()
    expect(resultat.eksepsjoner).toEqual([])
    expect(resultat.kritiskeDeler).toEqual([])
    expect(resultat.deler.every((d) => d.kritisk === false)).toBe(true)
  })
})

describe('enkelttilfeller fra akseptkriteriene', () => {
  it('bruttobehovet for 300-003 Hjul i testeksempel 01 (FR-5)', () => {
    const hjul = beregnTesteksempel('01').deler.find((d) => d.del.varenummer === '300-003')!
    expect(hjul.bruttobehov).toEqual([100, 125, 150, 100, 175, 150, 125, 200, 150, 100])
  })

  it('en forfalt frigivelse for ferdigproduktet gir bruttobehov i uke 1 for delene under (testeksempel 02, FR-8)', () => {
    const resultat = beregnTesteksempel('02')
    const stol = resultat.deler.find((d) => d.del.varenummer === '100-001')!
    const sete = resultat.deler.find((d) => d.del.varenummer === '200-001')!
    expect(stol.forfaltMengde).toBe(15)
    expect(stol.planlagteOrdrefrigivelser[0]).toBe(45)
    expect(sete.bruttobehov[0]).toBe(45)
  })

  // Akseptkriteriet i epics.md (Story 2.2) sier at mottak som er fremskyndet mer enn én uke, ikke gir
  // nye planlagte ordremottak i ukene mellom (200-002 i testeksempel 03, 300-028 i testeksempel 04).
  //
  // KRAVKONFLIKT, ORDLYDEN MÅ AVKLARES MED GRUPPEN: for 300-028 fremskyndes begge mottakene, 10 fra uke 3
  // og 15 fra uke 5, til uke 2. Mottaket fra uke 3 er flyttet én uke, og mottaket fra uke 5 tre uker.
  // Fasit 04 har likevel et planlagt ordremottak på 30 i uke 4, altså mellom uke 2 og uke 5. Det er et nytt
  // behov: etter at begge mottakene er regnet med i uke 2, er beholdningen 0 inn i uke 4, og bruttobehovet
  // er 30. Ordlyden i akseptkriteriet stemmer derfor ikke med fasiten for uke 4. Testen følger fasiten
  // (beslutning 2A): ingen planlagte ordremottak i uke 2–3, der mottakene dekker behovet, og 30 i uke 4.
  // epics.md er ikke endret.
  it('200-002 i testeksempel 03: mottaket i uke 4 er fremskyndet til uke 2, og uke 2–3 har ingen planlagte ordremottak (FR-6)', () => {
    const rygg = beregnTesteksempel('03').deler.find((d) => d.del.varenummer === '200-002')!
    expect(rygg.utregning[1].fremskyndedeMottak.map((m) => m.mottaksuke)).toEqual([4])
    expect(rygg.planlagteOrdremottak.slice(1, 3)).toEqual([0, 0])
    expect(rygg.forventetLagerbeholdning.slice(1, 3)).toEqual([-10, -35])
  })

  it('300-028 i testeksempel 04: mottakene i uke 3 og 5 er fremskyndet til uke 2, uke 2–3 har ingen planlagte ordremottak, og uke 4 har 30 som i fasiten (FR-6, kravkonflikt)', () => {
    const hodestotte = beregnTesteksempel('04').deler.find((d) => d.del.varenummer === '300-028')!
    expect(hodestotte.utregning[1].fremskyndedeMottak.map((m) => m.mottaksuke)).toEqual([3, 5])
    expect(hodestotte.planlagteOrdremottak.slice(1, 3)).toEqual([0, 0])
    expect(hodestotte.planlagteOrdremottak[3]).toBe(30)
  })

  // Tallene i de neste testene er skrevet av fra fasitene (Fasittabell), ikke regnet ut fra resultatet,
  // så testene er uavhengige av beregningen.

  it('300-002 Skruesett M6 i testeksempel 02 er én felles del med behov fra Sete (4) og Rygg (2) (FR-28)', () => {
    const resultat = beregnTesteksempel('02')
    expect(resultat.deler.filter((d) => d.del.varenummer === '300-002')).toHaveLength(1)
    const skrue = resultat.deler.find((d) => d.del.varenummer === '300-002')!
    // Fasit 02: Planlagte ordrefrigivelser for 200-001 Sete og 200-002 Rygg, og Bruttobehov for 300-002.
    const sete = [55, 25, 40, 35, 30, 45, 35, 30, 0, 0]
    const rygg = [0, 0, 25, 35, 30, 45, 35, 30, 0, 0]
    expect(skrue.bruttobehov).toEqual([220, 100, 210, 210, 180, 270, 210, 180, 0, 0])
    expect(skrue.utregning.map((u) => u.bruttobehovFra)).toEqual(
      sete.map((s, i) => [
        { varenummer: '200-001', frigivelse: s, antall: 4 },
        { varenummer: '200-002', frigivelse: rygg[i], antall: 2 },
      ]),
    )
  })

  it('300-023 Monteringsbrakett i testeksempel 04 beregnes på lavnivåkode 2, etter delene over, med behov fra begge (FR-28, AD-6)', () => {
    const lest = les(readFileSync(testeksempelSti('04')), 'testeksempel-04.xlsx')
    if (!lest.ok) throw new Error('kunne ikke lese testeksempel 04')
    const validert = valider(lest.verdi)
    if (!validert.ok) throw new Error('testeksempel 04 er ikke gyldig')
    const struktur = byggStruktur(validert.verdi.stykkliste)
    // Rett under ferdigproduktet (2 per stol) og under 200-010 Sete (1 per sete), i stykklisten.
    const brakett = struktur.deler.find((d) => d.varenummer === '300-023')!
    expect(brakett.lavnivaakode).toBe(2)
    expect(brakett.overordnede).toEqual([
      { varenummer: '100-003', antall: 2 },
      { varenummer: '200-010', antall: 1 },
    ])
    const rekkefolge = struktur.beregningsrekkefolge
    expect(rekkefolge.indexOf('300-023')).toBeGreaterThan(rekkefolge.indexOf('200-010'))

    const resultat = beregnBestillingsplan(validert.verdi, struktur)
    const del = resultat.deler.find((d) => d.del.varenummer === '300-023')!
    // Fasit 04: Bruttobehov for 300-023, og Planlagte ordrefrigivelser for 100-003 og 200-010.
    expect(del.bruttobehov).toEqual([55, 50, 20, 85, 100, 40, 70, 50, 60, 80, 60, 0])
    expect(del.utregning.map((u) => u.bruttobehovFra.map((p) => p.frigivelse))).toEqual(
      [10, 25, 0, 30, 35, 0, 20, 25, 30, 40, 30, 0].map((f, i) => [f, [35, 0, 20, 25, 30, 40, 30, 0, 0, 0, 0, 0][i]]),
    )
  })

  it('200-012 og 200-013 i testeksempel 04 står to ganger, og underdelene deres får behov én gang (FR-3, FR-28)', () => {
    const resultat = beregnTesteksempel('04')
    const finn = (vnr: string) => resultat.deler.find((d) => d.del.varenummer === vnr)!
    expect(finn('200-012').del.forekomster).toHaveLength(2)
    expect(finn('200-013').del.forekomster).toHaveLength(2)
    // Fasit 04: Bruttobehov for underdelene. Med dobbel telling hadde tallene vært dobbelt så store.
    const fasit = lesFasit('04').tabell
    for (const underdel of ['300-024', '300-025', '300-029']) {
      expect(finn(underdel).del.overordnede, underdel).toHaveLength(1)
      expect(finn(underdel).bruttobehov, underdel).toEqual(fasit.get(underdel)!.Bruttobehov)
    }
  })

  it('samme fil gir samme resultat to ganger (FR-8)', () => {
    expect(beregnTesteksempel('04')).toEqual(beregnTesteksempel('04'))
  })
})
