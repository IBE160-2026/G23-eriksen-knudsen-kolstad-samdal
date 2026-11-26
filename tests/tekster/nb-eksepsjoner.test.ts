// Tester for teksten til eksepsjonene i tekster/nb.ts (Story 2.4, AD-9, AD-16, UX-DR25, PRD FR-9–FR-13 og FR-29).
//
// Ordlyden sammenlignes ikke med fasiten (AD-16). Testene kontrollerer at opplysningene kravene sier, står i meldingen
// (tallene i fasitmeldingene i arket Eksepsjoner), at de fire delene fra EXPERIENCE.md finnes, og at ordene følger
// EXPERIENCE.md › Voice and Tone (aldri «uke 0», «frigitt» eller «før horisonten»).

import { describe, expect, it } from 'vitest'
import type { Delstype, Eksepsjon } from '../../src/domene/typer.ts'
import { eksepsjoner } from '../../src/tekster/nb.ts'
import {
  EKSEPSJONER_01,
  KANSELLER_MOTTAK_02,
  LASESKIVE_04,
  PRODUKSJON_FORSINKET_04,
  SIKKERHETSLAGER_02,
} from './../domene/typer-eksempler.ts'

const [HJUL, ARMLENE, GASSFJAER, STOLFOT] = EKSEPSJONER_01 as [Eksepsjon, Eksepsjon, Eksepsjon, Eksepsjon]
const ALLE: Eksepsjon[] = [...EKSEPSJONER_01, KANSELLER_MOTTAK_02, SIKKERHETSLAGER_02, ...LASESKIVE_04, PRODUKSJON_FORSINKET_04]
const DELSTYPER: Delstype[] = ['KJOPES_INN', 'PRODUSERES_SELV', 'FERDIGVARE']

/** Hele meldingen som én tekst, til kontroll av ord og tall. */
const alt = (e: Eksepsjon) => {
  const m = eksepsjoner.melding(e)
  return [m.setning, m.melding, m.hvorfor].join(' ')
}
const medType = (e: Eksepsjon, delstype: Delstype): Eksepsjon => ({ ...e, delstype }) as Eksepsjon

describe('teksten til eksepsjonene: de fire delene (UX-DR25)', () => {
  it('har typenavnet fra ordbanken, uken, én setning i vanlig språk, Melding og Hvorfor', () => {
    const m = eksepsjoner.melding(HJUL)
    expect(m.typenavn).toBe('Bestilling forsinket')
    expect(m.uke).toBe('uke 1')
    expect(m.merke).toBe('Bestilling forsinket · uke 1')
    expect(m.setning).toBe('Bestillingen skulle vært sendt før uke 1.')
    expect(m.melding.length).toBeGreaterThan(0)
    expect(m.hvorfor.length).toBeGreaterThan(0)
  })

  it('typenavnene er de fem fra ordbanken', () => {
    expect(eksepsjoner.typenavn).toEqual({
      LEDETID_OVERSKRIDER_HORISONT: 'Ledetid overskrider horisont',
      BESTILLING_FORSINKET: 'Bestilling forsinket',
      BRUK_AV_SIKKERHETSLAGER: 'Bruk av sikkerhetslager',
      MOTTAK_FORSINKET: 'Mottak forsinket',
      KANSELLER_MOTTAK: 'Kanseller mottak',
    })
  })

  it('uke for hele delen skrives «hele delen»', () => {
    const m = eksepsjoner.melding(STOLFOT)
    expect(m.uke).toBe('hele delen')
    expect(m.merke).toBe('Ledetid overskrider horisont · hele delen')
  })

  it('setningen i vanlig språk er aldri bare typenavnet, og slutter med punktum', () => {
    for (const e of ALLE) {
      const m = eksepsjoner.melding(e)
      expect(m.setning).not.toBe(m.typenavn)
      expect(m.setning.toLowerCase()).not.toBe(m.typenavn.toLowerCase())
      expect(m.setning.length).toBeGreaterThan(m.typenavn.length)
      expect(m.setning).toMatch(/\.$/)
    }
  })

  it('setning() gir den samme setningen som melding(), til listen over kritiske deler', () => {
    for (const e of ALLE) expect(eksepsjoner.setning(e)).toBe(eksepsjoner.melding(e).setning)
  })

  it('handlingen står i første eller andre setning i Melding', () => {
    for (const e of ALLE) {
      const forsteToSetninger = eksepsjoner.melding(e).melding.split(/(?<=\.)\s+/).slice(0, 2).join(' ')
      expect(forsteToSetninger, e.kode).toMatch(
        /bestille|starte produksjonen av|Be leverandøren|Flytt produksjonen|Vurder å kansellere|Bruk en lengre horisont/,
      )
    }
  })
})

describe('teksten til eksepsjonene: opplysningene kravene sier (FR-13), fra fasitmeldingene', () => {
  it('300-003 Hjul: −20 i uke 1, 50 forfalt, 175 i uke 1, tidligst i uke 2 og leveranse til kunde (FR-10)', () => {
    const m = eksepsjoner.melding(HJUL).melding
    expect(m).toContain('−20 i uke 1')
    expect(m).toContain('50')
    expect(m).toContain('før uke 1')
    expect(m).toContain('175 i uke 1')
    expect(m).toContain('tidligst i uke 2')
    expect(m.endsWith('Leveranse til kunde blir forsinket.')).toBe(true)
  })

  it('300-004 Armlene: lageret 10, sikkerhetslager 20, 10 forfalt, 60 i uke 1, tidligst i uke 2 (FR-11)', () => {
    const m = eksepsjoner.melding(ARMLENE).melding
    expect(m).toContain('lageret blir 10')
    expect(m).toContain('sikkerhetslageret på 20')
    expect(m).toContain('10 Armlene skulle vært bestilt før uke 1')
    expect(m).toContain('60 i uke 1')
    expect(m).toContain('tidligst i uke 2')
  })

  it('300-005 Gassfjær: lageret 0 i uke 3, SS 10, mottaket på 100 i uke 4 fremskyndes til uke 3 hos leverandøren (FR-12)', () => {
    const m = eksepsjoner.melding(GASSFJAER).melding
    expect(m).toContain('blir 0 i uke 3')
    expect(m).toContain('sikkerhetslageret på 10')
    expect(m).toContain('mottaket på 100 i uke 3 i stedet for uke 4')
    expect(m).toContain('leverandøren')
    expect(m).toContain('ingen ny bestilling')
  })

  it('300-006 Stolfot: summen 10 uker, stien, horisonten på 10 uker, og forslag om lengre horisont (FR-9)', () => {
    const m = eksepsjoner.melding(STOLFOT).melding
    expect(m).toContain('10 uker (Kontorstol Basic 0 + Stolfot 10)')
    expect(m).toContain('like lang som horisonten på 10 uker')
    expect(m).toContain('Bruk en lengre horisont')
    expect(m).toContain('etter uke 10')
  })

  it('300-005 Gassfjær i testeksempel 02: mottaket på 50 i uke 5 trengs ikke i uke 5–10 (FR-29)', () => {
    const m = eksepsjoner.melding(KANSELLER_MOTTAK_02).melding
    expect(m).toContain('mottaket på 50 i uke 5')
    expect(m).toContain('(uke 5–10)')
    expect(m).toContain('Vurder å kansellere eller utsette det')
  })

  it('300-003 Ryggtrekk i testeksempel 02 (L = 2): lageret 20, SS 30, 10 forfalt, 35 i uke 1, tidligst i uke 3', () => {
    const m = eksepsjoner.melding(SIKKERHETSLAGER_02).melding
    expect(m).toContain('lageret blir 20')
    expect(m).toContain('sikkerhetslageret på 30')
    expect(m).toContain('35 i uke 1')
    expect(m).toContain('tidligst i uke 3')
  })
})

describe('Bestilling forsinket: hva som blir forsinket (FR-10)', () => {
  it('slutter med «Produksjonen av ‹overordnet del› blir forsinket.» og nevner alle de overordnede delene (300-022)', () => {
    const m = eksepsjoner.melding(PRODUKSJON_FORSINKET_04).melding
    expect(m.endsWith('Produksjonen av Sete (200-010) og Rygg (200-011) blir forsinket.')).toBe(true)
  })

  it('tre overordnede deler skrives «A, B og C»', () => {
    const tre = {
      ...PRODUKSJON_FORSINKET_04,
      forsinker: {
        type: 'PRODUKSJON',
        av: [
          { varenummer: '200-010', beskrivelse: 'Sete' },
          { varenummer: '200-011', beskrivelse: 'Rygg' },
          { varenummer: '200-012', beskrivelse: 'Armlene' },
        ],
      },
    } as Eksepsjon
    expect(eksepsjoner.melding(tre).melding).toMatch(/Produksjonen av Sete \(200-010\), Rygg \(200-011\) og Armlene \(200-012\) blir forsinket\.$/)
  })

  it('én overordnet del skrives uten «og»', () => {
    const en = { ...PRODUKSJON_FORSINKET_04, forsinker: { type: 'PRODUKSJON', av: [{ varenummer: '200-010', beskrivelse: 'Sete' }] } } as Eksepsjon
    expect(eksepsjoner.melding(en).melding.endsWith('Produksjonen av Sete (200-010) blir forsinket.')).toBe(true)
  })

  it('leveranse til kunde nevner ikke produksjon som det som blir forsinket', () => {
    expect(eksepsjoner.melding(HJUL).melding).not.toContain('Produksjonen av')
  })
})

describe('Bestilling forsinket og Bruk av sikkerhetslager: tabellen viser et annet tall (FR-7)', () => {
  it('forklarer at forventet lagerbeholdning i tabellen er høyere fordi de forfalte mengdene regnes som kommet', () => {
    for (const e of [HJUL, ARMLENE, SIKKERHETSLAGER_02, LASESKIVE_04[0] as Eksepsjon, PRODUKSJON_FORSINKET_04]) {
      const h = eksepsjoner.melding(e).hvorfor
      expect(h, e.kode).toContain('Tabellen viser et høyere tall for forventet lagerbeholdning')
      expect(h).toContain('regner med')
    }
  })

  it('sikkerhetslageret nevnes ikke når det er 0 (300-026)', () => {
    expect(eksepsjoner.melding(LASESKIVE_04[1] as Eksepsjon).melding).not.toMatch(/sikkerhetslageret på 0/)
  })

  it('Bestilling forsinket oppgir disponibel beholdning etter fremskynding, og Mottak forsinket oppgir den før (FR-10)', () => {
    expect(eksepsjoner.melding(LASESKIVE_04[0] as Eksepsjon).melding).toContain('−10 i uke 1')
    expect(eksepsjoner.melding(LASESKIVE_04[1] as Eksepsjon).melding).toContain('−40 i uke 1')
  })
})

describe('Ledetid overskrider horisont og Kanseller mottak: bare innenfor horisonten (FR-9, FR-29)', () => {
  it('sier at eksepsjonen bare gjelder innenfor horisonten', () => {
    expect(alt(STOLFOT)).toMatch(/bare innenfor horisonten/)
    expect(alt(KANSELLER_MOTTAK_02)).toMatch(/innenfor horisonten/)
    expect(eksepsjoner.melding(KANSELLER_MOTTAK_02).hvorfor).toContain('bare innenfor horisonten')
  })

  it('ledetid lengre enn horisonten skrives «lengre enn», og stien kan ha flere deler', () => {
    const lang = {
      ...STOLFOT,
      ledetidFraFerdigproduktet: 13,
      horisont: 10,
      sti: [
        { varenummer: '100-001', beskrivelse: 'Kontorstol Pro', ledetid: 1 },
        { varenummer: '200-001', beskrivelse: 'Sete', ledetid: 0 },
        { varenummer: '300-005', beskrivelse: 'Gassfjær', ledetid: 12 },
      ],
    } as Eksepsjon
    const m = eksepsjoner.melding(lang).melding
    expect(m).toContain('13 uker (Kontorstol Pro 1 + Sete 0 + Gassfjær 12), lengre enn horisonten på 10 uker')
    expect(eksepsjoner.melding(lang).hvorfor).toContain('tidligst i uke 14, etter uke 10')
  })

  it('en horisont på 8 eller 12 uker står riktig, og «1 uke» står i entall', () => {
    const kort = { ...STOLFOT, ledetidFraFerdigproduktet: 12, horisont: 12 } as Eksepsjon
    expect(eksepsjoner.melding(kort).melding).toContain('12 uker (')
    expect(eksepsjoner.melding(kort).melding).toContain('horisonten på 12 uker')
    expect(eksepsjoner.melding(HJUL).hvorfor).toContain('ledetiden er 1 uke')
  })

  it('Kanseller mottak i siste uke i horisonten skrives «uke 10» og ikke «uke 10–10»', () => {
    const siste = { ...KANSELLER_MOTTAK_02, uke: 10 } as Eksepsjon
    const m = eksepsjoner.melding(siste).melding
    expect(m).toContain('(uke 10)')
    expect(m).not.toContain('10–10')
  })
})

describe('ord for innkjøp og produksjon (EXPERIENCE.md › Voice and Tone)', () => {
  const MED_ORDER: Eksepsjon[] = [HJUL, ARMLENE, GASSFJAER, SIKKERHETSLAGER_02, ...LASESKIVE_04]

  it('Ferdigvare og Komponent (Produseres selv) skrives «starte produksjonen av» og «skulle vært satt i produksjon»', () => {
    for (const delstype of ['PRODUSERES_SELV', 'FERDIGVARE'] as const) {
      const bestilling = eksepsjoner.melding(medType(HJUL, delstype))
      expect(bestilling.melding).toContain('starte produksjonen av Hjul')
      expect(bestilling.melding).toContain('skulle vært satt i produksjon før uke 1')
      expect(bestilling.setning).toBe('Produksjonen skulle vært startet før uke 1.')
      expect(bestilling.melding).not.toMatch(/bestille|bestilt|bestilling/i)
      const bruk = eksepsjoner.melding(medType(ARMLENE, delstype))
      expect(bruk.melding).toContain('starte produksjonen av Armlene')
      expect(bruk.setning).toBe('Produksjonen skulle vært startet før uke 1, så sikkerhetslageret brukes.')
    }
  })

  it('Komponent (Kjøpes inn) skrives «bestille» og «skulle vært bestilt», uten produksjon', () => {
    const m = eksepsjoner.melding(medType(HJUL, 'KJOPES_INN'))
    expect(m.melding).toContain('bestille Hjul')
    expect(m.melding).toContain('skulle vært bestilt før uke 1')
    expect(m.melding).not.toMatch(/produksjon/i)
  })

  it('Mottak forsinket for en del som produseres selv, flytter produksjonen i stedet for å be leverandøren (fasit 02)', () => {
    const m = eksepsjoner.melding(medType(GASSFJAER, 'PRODUSERES_SELV')).melding
    expect(m).toContain('Flytt produksjonen av mottaket på 100 fra uke 4 til uke 3')
    expect(m).not.toContain('leverandøren')
    expect(m).toContain('ingen ny produksjonsordre')
  })

  it('aldri «uke 0», «frigitt» eller «før horisonten», for noen eksepsjon eller type del', () => {
    for (const e of MED_ORDER) {
      for (const delstype of DELSTYPER) {
        const tekst = alt(medType(e, delstype))
        expect(tekst, `${e.kode} ${delstype}`).not.toMatch(/uke 0|uke −|uke -|frigitt|frigis|før horisonten|planstart/i)
      }
    }
    for (const e of [STOLFOT, KANSELLER_MOTTAK_02]) expect(alt(e)).not.toMatch(/uke 0|frigitt|før horisonten/i)
  })

  it('ingen melding har udefinerte eller tomme verdier', () => {
    for (const e of ALLE) {
      for (const delstype of DELSTYPER) {
        expect(alt(medType(e, delstype)), `${e.kode} ${delstype}`).not.toMatch(/undefined|NaN|\[object|null|\{|\}/)
      }
    }
  })
})

describe('tall i meldingene (UX-DR2)', () => {
  it('negative tall har ekte minus, og tusenskillet er hardt mellomrom', () => {
    const stor = { ...HJUL, disponibel: -1500, forfaltMengde: 1500, frigivelseUke1: 12000 } as Eksepsjon
    const m = eksepsjoner.melding(stor).melding
    expect(m).toContain('−1 500')
    expect(m).toContain('1 500')
    expect(m).toContain('12 000')
    expect(m).not.toContain('-1')
  })
})
