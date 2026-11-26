// Filvalget i opplastingssonen og ved Beregn (Story 1.11, UX-DR8, UX-DR10, UX-DR12, NFR-9).
// Redusenten er ren, så alle overgangene testes her. Samspillet i nettleseren testes i e2e/opplasting.spec.ts.

import { describe, expect, it } from 'vitest'
import type { KjoringUtfall } from '../../src/app/kjoring.ts'
import { FILFEILKODER, type Kjoring, type Valideringsfeil } from '../../src/domene/typer.ts'
import { felles, filfeilOgValidering } from '../../src/tekster/nb.ts'
import {
  endreFilvalg,
  sonemeldingTekst,
  startFilvalg,
  type Filen,
  type Filvalg,
  type FilvalgHandling,
} from '../../src/ui/ny-kjoring/filvalg.ts'

const A: Filen = { name: 'testeksempel-01.xlsx' }
const B: Filen = { name: 'testeksempel-02.xlsx' }

/** Kjører handlingene etter hverandre fra start. */
function etter(...handlinger: FilvalgHandling[]): Filvalg {
  return handlinger.reduce<Filvalg>(endreFilvalg, startFilvalg())
}

const velg = (...filer: Filen[]): FilvalgHandling => ({ type: 'VELG_FILER', filer })
const svar = (utfall: KjoringUtfall): FilvalgHandling => ({ type: 'SVAR', utfall })

const KJORING = { valg: 'BESTILLINGSPLAN' } as Kjoring
const EN_FEIL = { kode: 'MPS_ANTALL_UGYLDIG' } as Valideringsfeil

describe('start', () => {
  it('ingen fil, ingen melding, klar og ingen valideringsfeil', () => {
    expect(startFilvalg()).toEqual({ fil: null, melding: null, fremdrift: 'KLAR', valideringsfeil: null })
  })
})

describe('valg av fil: dra og slipp og «Velg fil» går gjennom samme handling (UX-DR8)', () => {
  it('én fil blir valgt og vises med navnet', () => {
    expect(etter(velg(A)).fil).toBe(A)
  })

  it('et nytt valg erstatter forrige valg', () => {
    expect(etter(velg(A), velg(B)).fil).toBe(B)
  })

  it('flere filer: ingen brukes, forrige valg står, og sonen sier «Slipp bare én fil …»', () => {
    const tilstand = etter(velg(A), velg(B, A))
    expect(tilstand.fil).toBe(A)
    expect(tilstand.melding).toEqual({ type: 'FLERE_FILER' })
    expect(sonemeldingTekst(tilstand.melding!)).toBe('Slipp bare én fil. Ingen av filene er lest.')
  })

  it('flere filer uten forrige valg gir ingen valgt fil', () => {
    expect(etter(velg(A, B)).fil).toBeNull()
  })

  it('en tom liste (dialogen avbrutt) endrer ingenting', () => {
    const tilstand = etter(velg(A))
    expect(endreFilvalg(tilstand, velg())).toBe(tilstand)
  })

  it('et nytt valg fjerner meldingen i sonen', () => {
    expect(etter(velg(A, B), velg(A)).melding).toBeNull()
    expect(etter({ type: 'BEREGN_UTEN_FIL' }, velg(A)).melding).toBeNull()
  })

  it('mens en kjøring pågår, kan ingen ny fil velges', () => {
    const lesing = etter(velg(A), { type: 'START_LESING' })
    expect(endreFilvalg(lesing, velg(B))).toBe(lesing)
    const beregning = endreFilvalg(lesing, { type: 'START_BEREGNING' })
    expect(endreFilvalg(beregning, velg(B))).toBe(beregning)
  })
})

describe('Beregn (UX-DR10)', () => {
  it('uten fil: «Velg en fil først.»', () => {
    const tilstand = etter({ type: 'BEREGN_UTEN_FIL' })
    expect(tilstand.melding).toEqual({ type: 'VELG_FIL_FORST' })
    expect(sonemeldingTekst(tilstand.melding!)).toBe('Velg en fil først.')
  })

  it('med fil: «Leser filen …», så «Beregner …», og meldingen fjernes', () => {
    const lesing = etter(velg(A, B), velg(A), { type: 'START_LESING' })
    expect(lesing).toMatchObject({ fremdrift: 'LESER', melding: null, valideringsfeil: null, fil: A })
    expect(endreFilvalg(lesing, { type: 'START_BEREGNING' }).fremdrift).toBe('BEREGNER')
  })

  it('teksten for fremdriften er ordrett fra EXPERIENCE.md, med «…» (U+2026)', () => {
    expect(felles.nyKjoring.beregning.leserFilen).toBe('Leser filen …')
    expect(felles.nyKjoring.beregning.beregner).toBe('Beregner …')
  })
})

describe('svaret fra styringen', () => {
  const underveis = (): Filvalg => etter(velg(A), { type: 'START_LESING' }, { type: 'START_BEREGNING' })

  it('gyldig fil: klar igjen, uten melding', () => {
    expect(endreFilvalg(underveis(), svar({ type: 'FERDIG', kjoring: KJORING }))).toMatchObject({
      fremdrift: 'KLAR',
      melding: null,
    })
  })

  it.each(FILFEILKODER)('feil i hele filen (%s): meldingen i sonen, og filvalget nullstilles', (kode) => {
    const tilstand = endreFilvalg(underveis(), svar({ type: 'FILFEIL', feil: { kode } }))
    expect(tilstand).toEqual({ fil: null, melding: { type: 'FILFEIL', kode }, fremdrift: 'KLAR', valideringsfeil: null })
    expect(sonemeldingTekst(tilstand.melding!)).toBe(filfeilOgValidering.heleFilen[kode])
  })

  it('uventet feil: meldingen i sonen, og filvalget nullstilles', () => {
    const tilstand = endreFilvalg(underveis(), svar({ type: 'UVENTET_FEIL' }))
    expect(tilstand).toEqual({ fil: null, melding: { type: 'UVENTET_FEIL' }, fremdrift: 'KLAR', valideringsfeil: null })
  })

  it('filen kunne ikke leses inn i nettleseren: uventet feil, og filvalget nullstilles', () => {
    const tilstand = endreFilvalg(etter(velg(A), { type: 'START_LESING' }), { type: 'LESING_FEILET' })
    expect(tilstand).toEqual({ fil: null, melding: { type: 'UVENTET_FEIL' }, fremdrift: 'KLAR', valideringsfeil: null })
  })

  it('valideringsfeil: hele resultatet tas vare på (Story 1.12), ingen melding i sonen, og filvalget nullstilles', () => {
    const resultat = { feil: [EN_FEIL, EN_FEIL, EN_FEIL], hoppetOver: [] }
    const tilstand = endreFilvalg(underveis(), svar({ type: 'VALIDERINGSFEIL', feil: resultat }))
    expect(tilstand).toEqual({ fil: null, melding: null, fremdrift: 'KLAR', valideringsfeil: resultat })
  })

  describe('feiloppsummeringen står til neste svar (Story 1.12)', () => {
    const forste = { feil: [EN_FEIL], hoppetOver: [] }
    const medFeil = (): Filvalg => endreFilvalg(underveis(), svar({ type: 'VALIDERINGSFEIL', feil: forste }))
    const nyKjoring = (): Filvalg =>
      endreFilvalg(endreFilvalg(endreFilvalg(medFeil(), velg(B)), { type: 'START_LESING' }), { type: 'START_BEREGNING' })

    it('mens en ny fil leses og beregnes, står den, så siden ikke hopper', () => {
      expect(nyKjoring().valideringsfeil).toBe(forste)
    })

    it('nye valideringsfeil erstatter den med et nytt objekt, så fokus flyttes dit på nytt', () => {
      const andre = { feil: [EN_FEIL, EN_FEIL], hoppetOver: [] }
      expect(endreFilvalg(nyKjoring(), svar({ type: 'VALIDERINGSFEIL', feil: andre })).valideringsfeil).toBe(andre)
    })

    it('en gyldig fil fjerner den', () => {
      expect(endreFilvalg(nyKjoring(), svar({ type: 'FERDIG', kjoring: KJORING })).valideringsfeil).toBeNull()
    })

    it.each([
      ['feil i hele filen', { type: 'FILFEIL', feil: { kode: 'SKADET_FIL' } }],
      ['uventet feil', { type: 'UVENTET_FEIL' }],
    ] as const)('%s fjerner den', (_navn, utfall) => {
      expect(endreFilvalg(nyKjoring(), svar(utfall)).valideringsfeil).toBeNull()
    })

    it('filen som ikke kunne leses inn, fjerner den', () => {
      const lesing = endreFilvalg(endreFilvalg(medFeil(), velg(B)), { type: 'START_LESING' })
      expect(endreFilvalg(lesing, { type: 'LESING_FEILET' }).valideringsfeil).toBeNull()
    })

    it('OPPTATT lar den stå', () => {
      const tilstand = nyKjoring()
      expect(endreFilvalg(tilstand, svar({ type: 'OPPTATT' })).valideringsfeil).toBe(forste)
    })
  })

  it('OPPTATT endrer ingenting', () => {
    const tilstand = underveis()
    expect(endreFilvalg(tilstand, svar({ type: 'OPPTATT' }))).toBe(tilstand)
  })

  it('samme fil kan velges på nytt etter en feil (NFR-9)', () => {
    const feil = endreFilvalg(underveis(), svar({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } }))
    const igjen = endreFilvalg(feil, velg(A))
    expect(igjen.fil).toBe(A)
    expect(igjen.melding).toBeNull()
  })
})
