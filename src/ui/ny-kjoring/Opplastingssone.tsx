// Opplastingssonen i kortet «Last opp filen» (Story 1.11, UX-DR8, DESIGN.md › Components › Opplastingssone).
//
// - Dra og slipp, og alltid en ekte <button> «Velg fil» som åpner et skjult <input type="file" accept=".xlsx">.
//   Talestyring kan ikke aktivere et vanlig filfelt, derfor knappen (EXPERIENCE.md › Interaction Primitives).
// - Begge veiene gir `velgFiler` med listen over filer. Kontrollen ligger i filvalg.ts og i worker-en.
// - Når en fil dras over, får sonen valgt-tone. Et slipp utenfor sonen gjør ingenting: sperren i
//   appskallet (ui/felles/slippsperre.ts) hindrer nettleseren i å åpne filen, og ingenting velges.
// - Filfeltet tømmes etter hvert valg, så samme fil kan velges på nytt (også etter en feil).
// - Fokus går tilbake til «Velg fil» når fildialogen lukkes, både ved valg og ved Avbryt.
// - Meldingen i sonen er koblet til «Velg fil» med aria-describedby, så den leses når knappen får fokus.

import { useEffect, useId, useRef, useState, type DragEvent, type RefObject } from 'react'
import { felles } from '../../tekster/nb.ts'
import { SLIPPSONE } from '../felles/slippsperre.ts'
import { sonemeldingTekst, type Sonemelding } from './filvalg.ts'

type Egenskaper = {
  filnavn: string | null
  melding: Sonemelding | null
  velgFiler: (filer: File[]) => void
  /** Knappen «Velg fil». NyKjoring flytter fokus hit ved «Velg en fil først.». */
  velgFilKnapp: RefObject<HTMLButtonElement | null>
}

const tekst = felles.nyKjoring

export function Opplastingssone({ filnavn, melding, velgFiler, velgFilKnapp }: Egenskaper) {
  const filfelt = useRef<HTMLInputElement>(null)
  const [drasOver, settDrasOver] = useState(false)
  const meldingId = useId()

  // Et slipp utenfor sonen stoppes av sperren i appskallet (ui/felles/slippsperre.ts), på alle visningene.
  // Her tas bare valgt-tonen bort når et slipp eller en dragning avsluttes et annet sted.
  useEffect(() => {
    const slutt = () => settDrasOver(false)
    window.addEventListener('drop', slutt)
    window.addEventListener('dragend', slutt)
    return () => {
      window.removeEventListener('drop', slutt)
      window.removeEventListener('dragend', slutt)
    }
  }, [])

  // Fokus tilbake til «Velg fil» når fildialogen lukkes med Avbryt. React har ikke `cancel` for filfelt.
  useEffect(() => {
    const felt = filfelt.current
    if (!felt) return
    const tilbake = () => velgFilKnapp.current?.focus()
    felt.addEventListener('cancel', tilbake)
    return () => felt.removeEventListener('cancel', tilbake)
  }, [velgFilKnapp])

  function drasInn(hendelse: DragEvent<HTMLDivElement>) {
    // Bare filer gir valgt-tone. Tekst og lenker som dras over sonen, berøres ikke.
    if (!Array.from(hendelse.dataTransfer.types).includes('Files')) return
    hendelse.preventDefault()
    hendelse.dataTransfer.dropEffect = 'copy'
    settDrasOver(true)
  }

  function drasUt(hendelse: DragEvent<HTMLDivElement>) {
    const til = hendelse.relatedTarget
    if (til instanceof Node && hendelse.currentTarget.contains(til)) return
    settDrasOver(false)
  }

  function slippISonen(hendelse: DragEvent<HTMLDivElement>) {
    hendelse.preventDefault()
    settDrasOver(false)
    velgFiler(Array.from(hendelse.dataTransfer.files))
  }

  function filValgt() {
    const felt = filfelt.current
    if (!felt) return
    velgFiler(Array.from(felt.files ?? []))
    // Tømmes, så samme fil gir en ny `change` neste gang den velges (NFR-9).
    felt.value = ''
    velgFilKnapp.current?.focus()
  }

  return (
    <div
      {...{ [SLIPPSONE]: '' }}
      className={drasOver ? 'opplastingssone opplastingssone-over' : 'opplastingssone'}
      onDragEnter={drasInn}
      onDragOver={drasInn}
      onDragLeave={drasUt}
      onDrop={slippISonen}
    >
      <p className="opplastingssone-valg">
        <span aria-hidden="true">{tekst.opplasting.slippHer}</span>
        <span className="opplastingssone-eller" aria-hidden="true">
          {tekst.opplasting.eller}
        </span>
        <button
          ref={velgFilKnapp}
          type="button"
          className="knapp knapp-primaer"
          aria-describedby={melding ? meldingId : undefined}
          onClick={() => filfelt.current?.click()}
        >
          {tekst.opplasting.velgFil}
        </button>
      </p>
      <input ref={filfelt} type="file" accept=".xlsx" hidden onChange={filValgt} />
      {filnavn !== null && <p className="opplastingssone-fil">{tekst.opplasting.valgtFil(filnavn)}</p>}
      <p className="opplastingssone-hjelp">{tekst.kort.lastOpp.tekst}</p>
      {melding && (
        <p id={meldingId} className="sonemelding">
          {sonemeldingTekst(melding)}
        </p>
      )}
    </div>
  )
}
