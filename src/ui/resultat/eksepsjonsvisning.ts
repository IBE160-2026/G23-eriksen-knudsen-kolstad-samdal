// Symbol og farge for de fem eksepsjonene (Story 2.7, DESIGN.md › Components › exception-badge-*, FR-15).
// Navnene står i tekster/nb.ts. Symbolene og fargene er design og står her.

import type { Eksepsjonskode } from '../../domene/typer.ts'
import { resultat as tekster } from '../../tekster/nb.ts'

type Visning = { symbol: string; klasse: string }

export const EKSEPSJONSVISNING: Record<Eksepsjonskode, Visning> = {
  LEDETID_OVERSKRIDER_HORISONT: { symbol: '⧗', klasse: 'eks-horisont' },
  BESTILLING_FORSINKET: { symbol: '!', klasse: 'eks-kritisk' },
  BRUK_AV_SIKKERHETSLAGER: { symbol: 'S', klasse: 'eks-sikkerhetslager' },
  MOTTAK_FORSINKET: { symbol: 'M', klasse: 'eks-mottak' },
  KANSELLER_MOTTAK: { symbol: 'K', klasse: 'eks-kanseller' },
}

/** Eksepsjonskodene i rekkefølgen i PRD §4.3. Domenets liste kan ikke importeres som verdi i ui (arkitektur kap. 2). */
export const KODER = Object.keys(tekster.tabell.eksepsjonsnavn) as Eksepsjonskode[]
