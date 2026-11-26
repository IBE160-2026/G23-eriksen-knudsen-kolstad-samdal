// Den eneste fila som bruker localStorage (AD-10). Hver lesing og skriving står i try/catch,
// så appen virker også når lagringen er blokkert eller full.
//
// Nøklene hittil: introduksjonssiden (Story 1.3) og valget av lys eller mørk visning (Story 1.13).
// Lagrede kjøringer (`cosi-mrp:kjoring:…`) kommer i en senere story.
//
// Unntak: `public/visning.js` leser `cosi-mrp:visning` før siden tegnes første gang, så siden ikke
// blinker i feil visning (AD-1, AD-10). Den bruker samme nøkkel, og tests/ui/visning.test.ts sjekker det.

/** Den delen av `Storage` fila bruker. Testene setter inn sin egen lager. */
export type Lager = Pick<Storage, 'getItem' | 'setItem'>

export const NOKKEL_INTRO_SETT = 'cosi-mrp:intro-sett'
export const NOKKEL_VISNING = 'cosi-mrp:visning'

/** Lys eller mørk visning (AD-10). */
export type Visning = 'lys' | 'mork'

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

/** Valgt visning. Mangler nøkkelen, har den en ukjent verdi eller er lagringen blokkert, er visningen lys (AD-10). */
export function lesVisning(lager: Lager | null = nettleserensLager()): Visning {
  if (!lager) return 'lys'
  try {
    return lager.getItem(NOKKEL_VISNING) === 'mork' ? 'mork' : 'lys'
  } catch {
    return 'lys'
  }
}

/** Husker valgt visning. Feil i lagringen ignoreres, og valget gjelder da til siden lukkes (AD-10). */
export function lagreVisning(visning: Visning, lager: Lager | null = nettleserensLager()): void {
  if (!lager) return
  try {
    lager.setItem(NOKKEL_VISNING, visning)
  } catch {
    // Blokkert eller full lagring: valget gjelder til siden lukkes. Det ligger i `data-visning` på <html>.
  }
}
