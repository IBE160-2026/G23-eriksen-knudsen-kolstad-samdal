// Plassholder for Ny kjøring (Story 1.3). Innholdet kommer i Story 1.4 og 1.11.

import { felles } from '../../tekster/nb.ts'

export function NyKjoring() {
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.nyKjoring)}</title>
      <h1 tabIndex={-1}>{felles.visninger.nyKjoring}</h1>
    </section>
  )
}
