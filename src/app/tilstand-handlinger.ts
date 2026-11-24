// Felles tilstand for appen (AD-13): den viste kjøringen og statusmeldingen.
// Lokal tilstand som filtre, valgt celle og åpent panel hører ikke hjemme her.
// Komponenten TilstandLeverandor står i tilstand.tsx.

import { createContext, useContext, type Dispatch } from 'react'
import type { Kjoring } from '../domene/typer.ts'

export type Tilstand = {
  /** Kjøringen som vises på Resultat. Finnes bare i minnet, så den er null etter reload. */
  kjoring: Kjoring | null
  /** Teksten i statusregionen (`role="status"`). Tom når det ikke er noe å kunngjøre. */
  statusmelding: string
}

export type Handling =
  | { type: 'VIS_KJORING'; kjoring: Kjoring }
  | { type: 'FJERN_KJORING' }
  | { type: 'VIS_STATUSMELDING'; melding: string }
  | { type: 'FJERN_STATUSMELDING' }

export const startTilstand: Tilstand = { kjoring: null, statusmelding: '' }

export function endreTilstand(tilstand: Tilstand, handling: Handling): Tilstand {
  switch (handling.type) {
    case 'VIS_KJORING':
      return { ...tilstand, kjoring: handling.kjoring }
    case 'FJERN_KJORING':
      return { ...tilstand, kjoring: null }
    case 'VIS_STATUSMELDING':
      return { ...tilstand, statusmelding: handling.melding }
    case 'FJERN_STATUSMELDING':
      return { ...tilstand, statusmelding: '' }
  }
}

export type TilstandKontekst = { tilstand: Tilstand; send: Dispatch<Handling> }

export const Tilstandskontekst = createContext<TilstandKontekst | null>(null)

export function useTilstand(): TilstandKontekst {
  const kontekst = useContext(Tilstandskontekst)
  if (!kontekst) throw new Error('useTilstand må brukes inne i TilstandLeverandor')
  return kontekst
}
