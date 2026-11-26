// Tekstene for opplastingen, Beregn og kjøringslinjen (Story 1.11, UX-DR2, UX-DR4, UX-DR12, UX-DR13).
// Egen fil, så den ikke krasjer med tekstene for Stykkliste i nb.test.ts (Story 1.8).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FILFEILKODER } from '../../src/domene/typer.ts'
import { felles, filfeilOgValidering, formaterTidspunkt, resultat } from '../../src/tekster/nb.ts'

const EXPERIENCE = readFileSync(
  join(import.meta.dirname, '..', '..', '.docs', 'planning-artifacts', 'ux-designs', 'ux-COSI - MRP-2026-11-22', 'EXPERIENCE.md'),
  'utf8',
)

/** Sitatene («…») i avsnittet «Feil i hele filen» i EXPERIENCE.md, med ledeteksten foran. */
function feilIHeleFilen(): Map<string, string> {
  const avsnitt = EXPERIENCE.split('### Feil i hele filen')[1]?.split('\n### ')[0] ?? ''
  // «- **Skadet fil:** «…»» og «- **Ikke .xlsx** (FR-1): «…»»: ledeteksten er den fete teksten uten kolon.
  const linjer = [...avsnitt.matchAll(/^- \*\*(.+?)\*\*.*?«(.+)»\s*$/gm)]
  return new Map(linjer.map((m) => [m[1].replace(/:$/, ''), m[2]]))
}

describe('feil i hele filen (UX-DR12, NFR-9)', () => {
  const fasit = feilIHeleFilen()
  const LEDETEKST = {
    IKKE_XLSX: 'Ikke .xlsx',
    SKADET_FIL: 'Skadet fil',
    TOM_FIL: 'Tom fil (0 byte)',
    IKKE_EXCEL: 'Ikke en Excel-fil, selv om den heter .xlsx',
    PASSORDBESKYTTET: 'Passordbeskyttet',
    UVENTET_FEIL: 'Uventet feil',
  } as const

  it('EXPERIENCE.md har seks meldinger', () => {
    expect(fasit.size).toBe(6)
  })

  it('det finnes én tekst for hver filfeilkode og for uventet feil, og ingen andre', () => {
    expect(Object.keys(filfeilOgValidering.heleFilen).sort()).toEqual([...FILFEILKODER, 'UVENTET_FEIL'].sort())
  })

  it.each(Object.entries(LEDETEKST))('%s er ordrett fra EXPERIENCE.md', (kode, ledetekst) => {
    expect(filfeilOgValidering.heleFilen[kode as keyof typeof LEDETEKST]).toBe(fasit.get(ledetekst))
  })
})

describe('opplastingssonen og Beregn (UX-DR8, UX-DR10)', () => {
  it('meldingene er ordrett fra akseptkriteriene', () => {
    expect(felles.nyKjoring.opplasting.flereFiler).toBe('Slipp bare én fil. Ingen av filene er lest.')
    expect(felles.nyKjoring.opplasting.velgFilForst).toBe('Velg en fil først.')
    expect(felles.nyKjoring.opplasting.velgFil).toBe('Velg fil')
    expect(felles.nyKjoring.beregning.beregn).toBe('Beregn')
  })

  it('meldingen når kjøringen er ferdig, har antall bestillingsforslag og kritiske deler (Story 2.5, UX-DR4)', () => {
    expect(felles.nyKjoring.beregning.ferdig(59, 4)).toBe('Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.')
    expect(felles.nyKjoring.beregning.ferdig(0, 0)).toBe('Kjøringen er ferdig: 0 bestillingsforslag, 0 kritiske deler.')
  })

  it('uten beregnet bestillingsplan (bare produksjonskapasitet) sier meldingen bare at filen er lest', () => {
    expect(felles.nyKjoring.beregning.ferdigUtenPlan).toBe('Kjøringen er ferdig. Filen er lest og har ingen feil.')
  })
})

describe('Resultat (UX-DR4, UX-DR13)', () => {
  it('h1 og sidetittel', () => {
    expect(resultat.overskrift('Kontorstol Basic')).toBe('Resultat for Kontorstol Basic')
    expect(resultat.sidetittel('Kontorstol Basic', '100-002')).toBe('Kontorstol Basic (100-002) – Resultat – COSI - MRP')
  })

  it('horisonten: «Horisont: 10 uker», og entall for 1 uke', () => {
    expect(resultat.horisont(10)).toBe('Horisont: 10 uker')
    expect(resultat.horisont(1)).toBe('Horisont: 1 uke')
  })

  it('tidspunktet skrives som «13.11.2026 kl. 08:04» i nettleserens tidssone (UX-DR2)', () => {
    const lokal = new Date(2026, 10, 13, 8, 4, 30)
    expect(formaterTidspunkt(lokal.toISOString())).toBe('13.11.2026 kl. 08:04')
    expect(formaterTidspunkt(new Date(2026, 0, 5, 23, 59).toISOString())).toBe('05.01.2026 kl. 23:59')
  })

  it('Resultat sier at bestillingsplanen ikke er beregnet ennå (midlertidig til Epic 2)', () => {
    expect(resultat.ikkeBeregnet.join(' ')).toContain('Bestillingsplanen beregnes ikke ennå.')
  })
})
