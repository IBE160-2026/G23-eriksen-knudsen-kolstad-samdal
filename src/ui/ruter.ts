// Rutingen (AD-13): fem visninger med hver sin hash-adresse, uten bibliotek.
// Tilbake og Frem følger adressene, og en visning kan bokmerkes.
// Uten adresse, eller med en ukjent adresse, går appen til Introduksjon første gang
// i en nettleser og ellers til Ny kjøring. Adressen byttes med replaceState.

import { useEffect, useState } from 'react'
import { harSettIntroduksjonen, merkIntroduksjonenSomSett } from '../app/introduksjon.ts'
import { felles } from '../tekster/nb.ts'

export type RuteId = 'introduksjon' | 'ny-kjoring' | 'resultat' | 'lagrede-kjoringer' | 'veiledning'

export type Rute = { id: RuteId; adresse: `#/${RuteId}`; tittel: string }

/** Rekkefølgen er rekkefølgen i appmenyen. */
export const RUTER: readonly Rute[] = [
  { id: 'introduksjon', adresse: '#/introduksjon', tittel: felles.visninger.introduksjon },
  { id: 'ny-kjoring', adresse: '#/ny-kjoring', tittel: felles.visninger.nyKjoring },
  { id: 'resultat', adresse: '#/resultat', tittel: felles.visninger.resultat },
  { id: 'lagrede-kjoringer', adresse: '#/lagrede-kjoringer', tittel: felles.visninger.lagredeKjoringer },
  { id: 'veiledning', adresse: '#/veiledning', tittel: felles.visninger.veiledning },
]

export function ruteFor(id: RuteId): Rute {
  const rute = RUTER.find((r) => r.id === id)
  if (!rute) throw new Error(`Ukjent rute: ${id}`)
  return rute
}

/** Ruten for en hash som `#/veiledning`, eller undefined når adressen mangler eller er ukjent. */
export function finnRute(hash: string): Rute | undefined {
  return RUTER.find((r) => r.adresse === hash)
}

/** Hvor appen går uten adresse eller med en ukjent adresse (AD-13, FR-27). */
export function standardRute(introSett: boolean): Rute {
  return ruteFor(introSett ? 'ny-kjoring' : 'introduksjon')
}

function gjeldendeRute(): Rute {
  return finnRute(window.location.hash) ?? standardRute(harSettIntroduksjonen())
}

export function useRute(): Rute {
  const [rute, settRute] = useState(gjeldendeRute)

  useEffect(() => {
    function oppdater() {
      const funnet = finnRute(window.location.hash)
      if (funnet) {
        settRute(funnet)
        return
      }
      const standard = standardRute(harSettIntroduksjonen())
      window.history.replaceState(window.history.state, '', standard.adresse)
      settRute(standard)
    }
    oppdater()
    window.addEventListener('hashchange', oppdater)
    return () => window.removeEventListener('hashchange', oppdater)
  }, [])

  // Introduksjonen huskes hver gang den vises, som i prototypen.
  useEffect(() => {
    if (rute.id === 'introduksjon') merkIntroduksjonenSomSett()
  }, [rute])

  return rute
}
