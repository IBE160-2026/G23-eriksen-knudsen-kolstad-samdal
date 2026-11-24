// Plassholder for Lagrede kjøringer (Story 1.3). Innholdet kommer i Epic 4.

import { felles } from '../../tekster/nb.ts'

export function LagredeKjoringer() {
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.lagredeKjoringer)}</title>
      <h1 tabIndex={-1}>{felles.visninger.lagredeKjoringer}</h1>
    </section>
  )
}
