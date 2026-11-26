// Eksepsjonsmarkøren (Story 2.7, FR-15, NFR-8): symbolet i en liten firkant (20 × 20 px) med tilgjengelig navn,
// for eksempel «Bestilling forsinket, uke 1». Aldri farge alene.

import type { Eksepsjon } from '../../domene/typer.ts'
import { resultat as tekster } from '../../tekster/nb.ts'
import { EKSEPSJONSVISNING } from './eksepsjonsvisning.ts'

export function Markor({ eksepsjon }: { eksepsjon: Eksepsjon }) {
  const { symbol, klasse } = EKSEPSJONSVISNING[eksepsjon.kode]
  const navn = tekster.tabell.markornavn(tekster.tabell.eksepsjonsnavn[eksepsjon.kode], eksepsjon.uke)
  return (
    <span className={`markor ${klasse}`} role="img" aria-label={navn}>
      {symbol}
    </span>
  )
}
