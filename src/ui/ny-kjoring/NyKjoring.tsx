// Startsiden «Ny kjøring» (Story 1.4, UX-DR7, FR-27): h1, setningen om ett ferdigprodukt per fil
// og tre nummererte kort. Det første kortet har nedlastingene av malen og testeksempel 01.
// Opplastingssonen og valget av beregning kommer i Story 1.11. All tekst står i tekster/nb.ts.

import { felles } from '../../tekster/nb.ts'

// Filene ligger i public/ og er byte for byte like filene i testdata/ (tests/public-filer.test.ts).
const MAL = '/COSI-MRP-mal.xlsx'
const TESTEKSEMPEL_01 = '/testeksempel-01.xlsx'

export function NyKjoring() {
  const tekst = felles.nyKjoring
  return (
    <section className="visning">
      <title>{felles.sidetittel(felles.visninger.nyKjoring)}</title>
      <h1 tabIndex={-1}>{felles.visninger.nyKjoring}</h1>
      <p className="ingress">{tekst.ettFerdigprodukt}</p>
      <ol className="startkort">
        <li className="kort">
          <h2>{tekst.kort.fyllUt.tittel}</h2>
          <p className="kort-tekst">{tekst.kort.fyllUt.tekst}</p>
          <p className="knapp-rad">
            <a className="knapp" href={MAL} download>
              {tekst.kort.fyllUt.lastNedMalen}
            </a>
            <a className="knapp" href={TESTEKSEMPEL_01} download>
              {tekst.kort.fyllUt.lastNedTesteksempel}
            </a>
          </p>
        </li>
        <li className="kort">
          <h2>{tekst.kort.lastOpp.tittel}</h2>
          <p className="kort-tekst">{tekst.kort.lastOpp.tekst}</p>
        </li>
        <li className="kort kort-bred">
          <h2>{tekst.kort.beregn.tittel}</h2>
          <p className="kort-tekst">{tekst.kort.beregn.tekst}</p>
        </li>
      </ol>
    </section>
  )
}
