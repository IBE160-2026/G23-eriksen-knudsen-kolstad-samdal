// Plassholder for Veiledning (Story 1.3). Innholdet kommer i Story 1.4.

import { felles } from '../../tekster/nb.ts'

export function Veiledning() {
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.veiledning)}</title>
      <h1 tabIndex={-1}>{felles.visninger.veiledning}</h1>
    </section>
  )
}
