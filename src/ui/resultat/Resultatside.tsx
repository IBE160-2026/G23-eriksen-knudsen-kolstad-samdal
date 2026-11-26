// Resultat med en beregnet bestillingsplan (Story 2.6, AD-13, AD-14, UX-DR14–UX-DR16).
// Kjøringslinjen med seksjonsmenyen, tallboksene, «Slik leser du resultatet» og de tre seksjonene i fast rekkefølge.
// Innholdet i seksjonene kommer i Story 2.7 (Resultattabell), 2.10 (Kritiske deler) og 2.11 (Bestillingsforslag).
//
// Hopp til en seksjon: `scrollIntoView` så overskriften står rett under kjøringslinjen, fokus til overskriften,
// og ingen endring av adressen. Seksjonen som er i bildet, får `aria-current="location"` mens Kari ruller.

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Kjoring, Resultat } from '../../domene/typer.ts'
import { resultat as tekster } from '../../tekster/nb.ts'
import { Kjoringslinje } from './Kjoringslinje.tsx'
import { KritiskeDeler } from './KritiskeDeler.tsx'
import { Resultattabell, type Tabellstyring } from './Resultattabell.tsx'
import { SlikLeserDu } from './SlikLeserDu.tsx'
import { Seksjonsmeny } from './Seksjonsmeny.tsx'
import { Tallbokser } from './Tallbokser.tsx'
import { finnAktivSeksjon, overskriftId, SEKSJONER, tell, type SeksjonId } from './seksjoner.ts'

/** En seksjon med h2. Innholdet kommer som barn. */
function Seksjon({ seksjon, children }: { seksjon: SeksjonId; children?: ReactNode }) {
  return (
    <section className="resultat-seksjon" aria-labelledby={overskriftId(seksjon)}>
      <h2 id={overskriftId(seksjon)} tabIndex={-1}>
        {tekster.seksjoner[seksjon]}
      </h2>
      {children}
    </section>
  )
}

/** Luften mellom kjøringslinjen og overskriften når en seksjon er rullet på plass, i px. */
const LUFT = 12

function reduserteBevegelser(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Resultatside({ kjoring, resultat }: { kjoring: Kjoring; resultat: Resultat }) {
  const tall = useMemo(() => tell(resultat), [resultat])
  const [aktiv, setAktiv] = useState<SeksjonId | null>(null)
  const side = useRef<HTMLDivElement>(null)
  const linje = useRef<HTMLDivElement>(null)
  const tabellRef = useRef<Tabellstyring>(null)

  // Kjøringslinjen har fast posisjon og skiftende høyde (seksjonsmenyen brytes på smal skjerm).
  // Høyden settes som CSS-variabel, så `scroll-margin-top` på overskriftene alltid stemmer.
  useEffect(() => {
    const element = linje.current
    const mal = side.current
    if (!element || !mal) return
    const oppdater = () => mal.style.setProperty('--kjoringslinje-hoyde', `${element.getBoundingClientRect().height}px`)
    oppdater()
    const observator = new ResizeObserver(oppdater)
    observator.observe(element)
    return () => observator.disconnect()
  }, [])

  // Seksjonen som er i bildet, oppdateres mens Kari ruller.
  useEffect(() => {
    let ventende = 0
    const oppdater = () => {
      ventende = 0
      const grense = (linje.current?.getBoundingClientRect().bottom ?? 0) + LUFT + 1
      const topper = SEKSJONER.map((s) => document.getElementById(overskriftId(s))?.getBoundingClientRect().top ?? Infinity)
      const erNederst = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      const indeks = finnAktivSeksjon(topper, grense, erNederst)
      setAktiv(indeks === null ? null : (SEKSJONER[indeks] ?? null))
    }
    const planlegg = () => {
      if (ventende === 0) ventende = requestAnimationFrame(oppdater)
    }
    window.addEventListener('scroll', planlegg, { passive: true })
    window.addEventListener('resize', planlegg)
    return () => {
      window.removeEventListener('scroll', planlegg)
      window.removeEventListener('resize', planlegg)
      if (ventende !== 0) cancelAnimationFrame(ventende)
    }
  }, [])

  const gaTil = useCallback((seksjon: SeksjonId) => {
    const overskrift = document.getElementById(overskriftId(seksjon))
    if (!overskrift) return
    overskrift.scrollIntoView({ behavior: reduserteBevegelser() ? 'auto' : 'smooth', block: 'start' })
    overskrift.focus({ preventScroll: true })
    setAktiv(seksjon)
  }, [])

  const hoppTilDel = useCallback((varenummer: string) => tabellRef.current?.hoppTilDel(varenummer), [])

  return (
    <div className="resultatside" ref={side}>
      <Kjoringslinje
        ref={linje}
        kjoring={kjoring}
        meny={<Seksjonsmeny tall={tall} aktiv={aktiv} onVelg={gaTil} />}
      />
      <Tallbokser tall={tall} onVelg={gaTil} />
      <SlikLeserDu harKritiskeDeler={tall.kritiskeDeler > 0} />
      {/* Uten kritiske deler står bare en kort melding i en informasjonsboks, uten overskrift og liste (FR-16). Meldingen
          har id-en til overskriften og kan få fokus, så knappen og tallboksen for kritiske deler fører hit. */}
      {tall.kritiskeDeler === 0 ? (
        <section className="resultat-seksjon">
          <div className="informasjonsboks" id={overskriftId('kritiskeDeler')} tabIndex={-1}>
            <p>{tekster.kritiskeDeler.ingen}</p>
          </div>
        </section>
      ) : (
        <Seksjon seksjon="kritiskeDeler">
          <KritiskeDeler resultat={resultat} onHopp={hoppTilDel} />
        </Seksjon>
      )}
      {/* Innholdet kommer i Story 2.11. */}
      <Seksjon seksjon="bestillingsforslag" />
      <Seksjon seksjon="resultattabell">
        <Resultattabell kjoring={kjoring} resultat={resultat} ref={tabellRef} />
      </Seksjon>
    </div>
  )
}
