// Appskallet (Story 1.3, AD-5, AD-13): appmenyen, hovedfeltet med visningen for ruten,
// feilgrensen rundt visningene og én `role="status"`-region som aldri byttes ut.

import { useEffect, useRef, type ComponentType } from 'react'
import { TilstandLeverandor } from '../app/tilstand.tsx'
import { useTilstand } from '../app/tilstand-handlinger.ts'
import { Appmeny } from './appmeny/Appmeny.tsx'
import { Feilgrense } from './felles/Feilgrense.tsx'
import { Introduksjon } from './introduksjon/Introduksjon.tsx'
import { LagredeKjoringer } from './lagrede-kjoringer/LagredeKjoringer.tsx'
import { NyKjoring } from './ny-kjoring/NyKjoring.tsx'
import { Resultat } from './resultat/Resultat.tsx'
import { useRute, type RuteId } from './ruter.ts'
import { Veiledning } from './veiledning/Veiledning.tsx'

const VISNINGER: Record<RuteId, ComponentType> = {
  introduksjon: Introduksjon,
  'ny-kjoring': NyKjoring,
  resultat: Resultat,
  'lagrede-kjoringer': LagredeKjoringer,
  veiledning: Veiledning,
}

export function App() {
  return (
    <TilstandLeverandor>
      <Skall />
    </TilstandLeverandor>
  )
}

function Skall() {
  const rute = useRute()
  const { tilstand } = useTilstand()
  const hovedfelt = useRef<HTMLElement>(null)
  const forrigeRute = useRef<RuteId | null>(null)

  // Appen styrer rullingen selv. Ellers gjenoppretter Chromium den gamle rulleposisjonen ved
  // Tilbake og Frem etter at siden er rullet til toppen, og h1 med fokus havner utenfor skjermen.
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  // Ved ruteskifte går siden til toppen, og fokus flyttes til h1. Ikke ved første tegning,
  // så Tab fra adresselinjen starter i appmenyen.
  useEffect(() => {
    const forrige = forrigeRute.current
    forrigeRute.current = rute.id
    if (forrige === null || forrige === rute.id) return
    window.scrollTo(0, 0)
    hovedfelt.current?.querySelector('h1')?.focus({ preventScroll: true })
  }, [rute.id])

  const Visning = VISNINGER[rute.id]

  return (
    <div className="app">
      <Appmeny aktiv={rute.id} />
      <main className="hovedfelt" ref={hovedfelt}>
        <Feilgrense nokkel={rute.id}>
          <Visning />
        </Feilgrense>
      </main>
      {/* Skjult for øyet til Story 1.11 bestemmer hvor statusmeldingene skal stå. */}
      <div role="status" className="skjult-visuelt">
        {tilstand.statusmelding}
      </div>
    </div>
  )
}
