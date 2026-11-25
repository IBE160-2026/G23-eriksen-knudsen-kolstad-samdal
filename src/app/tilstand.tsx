// Leverandøren av den felles tilstanden (AD-13). Typene og reduseren står i tilstand-handlinger.ts.

import { useMemo, useReducer, type ReactNode } from 'react'
import { lagStandardKjorer } from './kjoring.ts'
import { endreTilstand, startTilstand, Tilstandskontekst } from './tilstand-handlinger.ts'

export function TilstandLeverandor({ children }: { children: ReactNode }) {
  const [tilstand, send] = useReducer(endreTilstand, startTilstand)
  // Worker-en lages først når en kjøring starter, så dette koster ingenting før det.
  const kjorer = useMemo(() => lagStandardKjorer(send), [send])
  const verdi = useMemo(() => ({ tilstand, send, kjorer }), [tilstand, send, kjorer])
  return <Tilstandskontekst value={verdi}>{children}</Tilstandskontekst>
}
