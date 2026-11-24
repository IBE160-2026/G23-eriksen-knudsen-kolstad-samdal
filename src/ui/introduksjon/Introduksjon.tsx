// Plassholder for Introduksjon (Story 1.3). Innholdet kommer i Story 1.4.

import { felles } from '../../tekster/nb.ts'

export function Introduksjon() {
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.introduksjon)}</title>
      <h1 tabIndex={-1}>{felles.visninger.introduksjon}</h1>
    </section>
  )
}
