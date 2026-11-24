// Den eneste fila som bruker localStorage (AD-10). Hver lesing og skriving står i try/catch,
// så appen virker også når lagringen er blokkert eller full.
//
// Story 1.3 har bare nøkkelen for introduksjonssiden. Lagrede kjøringer (`cosi-mrp:kjoring:…`)
// og visningen (`cosi-mrp:visning`) kommer i senere stories.

/** Den delen av `Storage` fila bruker. Testene setter inn sin egen lager. */
export type Lager = Pick<Storage, 'getItem' | 'setItem'>

export const NOKKEL_INTRO_SETT = 'cosi-mrp:intro-sett'

function nettleserensLager(): Lager | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    // Nettleseren kan kaste allerede når localStorage leses, når lagringen er blokkert.
    return null
  }
}

/** Om introduksjonssiden er vist i denne nettleseren. Blokkert lagring gir «ikke sett». */
export function lesIntroSett(lager: Lager | null = nettleserensLager()): boolean {
  if (!lager) return false
  try {
    return lager.getItem(NOKKEL_INTRO_SETT) !== null
  } catch {
    return false
  }
}

/** Husker at introduksjonssiden er vist. Feil i lagringen ignoreres. */
export function lagreIntroSett(lager: Lager | null = nettleserensLager()): void {
  if (!lager) return
  try {
    lager.setItem(NOKKEL_INTRO_SETT, 'ja')
  } catch {
    // Blokkert eller full lagring: introduksjonen vises igjen ved neste besøk (AD-10).
  }
}
