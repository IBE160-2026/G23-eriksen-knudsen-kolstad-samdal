// Leverandøren av den felles tilstanden (AD-13). Typene og reduseren står i tilstand-handlinger.ts.

import { useMemo, useReducer, type ReactNode } from 'react'
import { endreTilstand, startTilstand, Tilstandskontekst } from './tilstand-handlinger.ts'

export function TilstandLeverandor({ children }: { children: ReactNode }) {
  const [tilstand, send] = useReducer(endreTilstand, startTilstand)
  const verdi = useMemo(() => ({ tilstand, send }), [tilstand])
  return <Tilstandskontekst value={verdi}>{children}</Tilstandskontekst>
}
