// Tilstanden i opplastingssonen og ved Beregn (Story 1.11, UX-DR8, UX-DR10, UX-DR12).
// En ren redusent uten React og DOM, så alle overgangene kan testes uten nettleser.
// `F` er filen: `File` i nettleseren, et enkelt objekt med `name` i testene.
//
// - Dra og slipp og «Velg fil» gir begge `VELG_FILER` med listen over filer. Det er den ene kontrollen
//   begge veiene går gjennom. Selve kontrollen av filtype og innhold gjøres av `les()` i worker-en
//   når Kari trykker Beregn, så meldingen kommer på samme måte uansett hvordan filen ble valgt.
// - Etter en feil i hele filen, en uventet feil eller valideringsfeil nullstilles filvalget (NFR-9).
// - Valideringsfeilene fra siste kjøring står til neste svar (Story 1.12), så siden ikke hopper mens en ny
//   fil leses. Et nytt svar med valideringsfeil erstatter dem, og alle andre svar fjerner dem.
// - Meldingene i sonen er koder. `sonemeldingTekst` gir teksten fra tekster/nb.ts.

import type { KjoringUtfall } from '../../app/kjoring.ts'
import type { Filfeilkode, Valideringsresultat } from '../../domene/typer.ts'
import { felles, filfeilOgValidering } from '../../tekster/nb.ts'

/** Det filvalget trenger å vite om en fil. `File` i nettleseren, et enkelt objekt i testene. */
export type Filen = { name: string }

/** Meldingen i opplastingssonen. Bare én om gangen. */
export type Sonemelding =
  | { type: 'FLERE_FILER' }
  | { type: 'VELG_FIL_FORST' }
  | { type: 'FILFEIL'; kode: Filfeilkode }
  | { type: 'UVENTET_FEIL' }

export type Fremdrift = 'KLAR' | 'LESER' | 'BEREGNER'

export type Filvalg<F extends Filen = Filen> = {
  fil: F | null
  melding: Sonemelding | null
  fremdrift: Fremdrift
  /** Valideringsfeilene fra siste kjøring, som feiloppsummeringen viser (Story 1.12). Null uten feil. */
  valideringsfeil: Valideringsresultat | null
}

export type FilvalgHandling<F extends Filen = Filen> =
  | { type: 'VELG_FILER'; filer: readonly F[] }
  | { type: 'BEREGN_UTEN_FIL' }
  | { type: 'START_LESING' }
  | { type: 'START_BEREGNING' }
  /** Filen kunne ikke leses inn i nettleseren (`arrayBuffer()` feilet). */
  | { type: 'LESING_FEILET' }
  | { type: 'SVAR'; utfall: KjoringUtfall }

export function startFilvalg<F extends Filen>(): Filvalg<F> {
  return { fil: null, melding: null, fremdrift: 'KLAR', valideringsfeil: null }
}

/** Nullstiller filvalget etter en feil, så samme filnavn kan velges på nytt. */
function etterFeil<F extends Filen>(melding: Sonemelding | null, valideringsfeil: Valideringsresultat | null): Filvalg<F> {
  return { fil: null, melding, fremdrift: 'KLAR', valideringsfeil }
}

export function endreFilvalg<F extends Filen>(tilstand: Filvalg<F>, handling: FilvalgHandling<F>): Filvalg<F> {
  switch (handling.type) {
    case 'VELG_FILER': {
      // Ingen ny fil kan velges mens en kjøring pågår. Kjøringen bruker filen som var valgt da Beregn ble trykket.
      if (tilstand.fremdrift !== 'KLAR') return tilstand
      const [forste, ...resten] = handling.filer
      if (!forste) return tilstand
      // Flere filer: ingen brukes, og forrige valg står (EXPERIENCE.md, prototypen v3).
      if (resten.length > 0) return { ...tilstand, melding: { type: 'FLERE_FILER' } }
      // Ett valg erstatter forrige valg og fjerner meldingen.
      return { ...tilstand, fil: forste, melding: null }
    }
    case 'BEREGN_UTEN_FIL':
      return { ...tilstand, melding: { type: 'VELG_FIL_FORST' } }
    case 'START_LESING':
      // Feiloppsummeringen står til svaret kommer (Story 1.12).
      return { ...tilstand, melding: null, fremdrift: 'LESER' }
    case 'START_BEREGNING':
      return { ...tilstand, fremdrift: 'BEREGNER' }
    case 'LESING_FEILET':
      return etterFeil({ type: 'UVENTET_FEIL' }, null)
    case 'SVAR':
      switch (handling.utfall.type) {
        case 'FERDIG':
          // Styringen har gitt kjøringen til tilstanden og gått til Resultat. Feiloppsummeringen er borte.
          return { ...tilstand, fremdrift: 'KLAR', valideringsfeil: null }
        case 'OPPTATT':
          // En annen kjøring pågår. Ingenting endres.
          return tilstand
        case 'FILFEIL':
          return etterFeil({ type: 'FILFEIL', kode: handling.utfall.feil.kode }, null)
        case 'UVENTET_FEIL':
          return etterFeil({ type: 'UVENTET_FEIL' }, null)
        case 'VALIDERINGSFEIL':
          return etterFeil(null, handling.utfall.feil)
      }
  }
}

/** Teksten for meldingen i sonen, fra tekster/nb.ts. */
export function sonemeldingTekst(melding: Sonemelding): string {
  switch (melding.type) {
    case 'FLERE_FILER':
      return felles.nyKjoring.opplasting.flereFiler
    case 'VELG_FIL_FORST':
      return felles.nyKjoring.opplasting.velgFilForst
    case 'FILFEIL':
      return filfeilOgValidering.heleFilen[melding.kode]
    case 'UVENTET_FEIL':
      return filfeilOgValidering.heleFilen.UVENTET_FEIL
  }
}
