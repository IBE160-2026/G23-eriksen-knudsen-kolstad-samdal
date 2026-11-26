// Modellen bak resultattabellen (Story 2.7, FR-14–FR-16, UX-DR21–UX-DR24): radene, hvilken celle en eksepsjon
// markeres i, innrykk og filteret for kritiske deler. Ren logikk uten React, så den kan testes alene.

import type { DelResultat, Eksepsjon, Nivaa, Resultat } from '../../domene/typer.ts'

/** De seks radene i en del, i rekkefølgen fra FR-14. Nøklene er feltene i `DelResultat`. */
export const RADER = [
  'bruttobehov',
  'planlagteMottak',
  'forventetLagerbeholdning',
  'nettobehov',
  'planlagteOrdremottak',
  'planlagteOrdrefrigivelser',
] as const
export type RadId = (typeof RADER)[number]

/** Cellen en eksepsjon markeres i, ifølge tabellen i EXPERIENCE.md (Eksepsjonsmarkør: hvilken celle). */
export type Markorplass = { type: 'DEL' } | { type: 'CELLE'; rad: RadId; uke: number }

export function markorplass(eksepsjon: Eksepsjon): Markorplass {
  switch (eksepsjon.kode) {
    case 'LEDETID_OVERSKRIDER_HORISONT':
      return { type: 'DEL' }
    case 'KANSELLER_MOTTAK':
      return { type: 'CELLE', rad: 'planlagteMottak', uke: eksepsjon.uke }
    case 'BESTILLING_FORSINKET':
    case 'BRUK_AV_SIKKERHETSLAGER':
    case 'MOTTAK_FORSINKET':
      return { type: 'CELLE', rad: 'nettobehov', uke: eksepsjon.uke }
  }
}

/** Eksepsjonene til én del, delt i dem som står ved delens felt og dem som står i en celle. */
export type DelensMarkorer = {
  /** Ledetid overskrider horisont. */
  ved: Eksepsjon[]
  /** Nøkkel: `radnøkkel(rad, uke)`. Flere eksepsjoner i samme celle står side om side, i den sorterte rekkefølgen. */
  celler: Map<string, Eksepsjon[]>
}

export function celleNokkel(rad: RadId, uke: number): string {
  return `${rad}:${uke}`
}

const TOM: DelensMarkorer = { ved: [], celler: new Map() }

/**
 * Eksepsjonene gruppert per varenummer. En del uten eksepsjoner får ikke egen oppføring (se `markorerFor`),
 * og objektene er stabile mellom tegninger så lenge `eksepsjoner` er det, slik at en memoisert del ikke tegnes på nytt.
 */
export function grupperMarkorer(eksepsjoner: readonly Eksepsjon[]): Map<string, DelensMarkorer> {
  const per = new Map<string, DelensMarkorer>()
  for (const eksepsjon of eksepsjoner) {
    const markorer = per.get(eksepsjon.varenummer) ?? { ved: [], celler: new Map<string, Eksepsjon[]>() }
    per.set(eksepsjon.varenummer, markorer)
    const plass = markorplass(eksepsjon)
    if (plass.type === 'DEL') {
      markorer.ved.push(eksepsjon)
    } else {
      const nokkel = celleNokkel(plass.rad, plass.uke)
      markorer.celler.set(nokkel, [...(markorer.celler.get(nokkel) ?? []), eksepsjon])
    }
  }
  return per
}

export function markorerFor(per: ReadonlyMap<string, DelensMarkorer>, varenummer: string): DelensMarkorer {
  return per.get(varenummer) ?? TOM
}

/** Innrykket i delens felt: 12 px per nivå (UX-DR21). Nivå `0` er 0, `.1` er 1 og `..2` er 2. */
export function innrykkNivaa(nivaa: Nivaa): number {
  return nivaa.length - nivaa.replace(/\./g, '').length
}

/** Delene som vises. Filteret skjuler bare delene uten eksepsjon, og stykklisterekkefølgen beholdes (FR-16). */
export function synligeDeler(resultat: Resultat, bareKritiske: boolean): DelResultat[] {
  return bareKritiske ? resultat.deler.filter((del) => del.kritisk) : resultat.deler
}

/** Valgt celle. Beholdes til en annen velges (UX-DR24, FR-18). */
export type ValgtCelle = { varenummer: string; rad: RadId; uke: number }

/** Er den valgte cellen i en del som fortsatt vises? Ellers nullstilles valget. */
export function valgEtterFilter(valgt: ValgtCelle | null, synlige: readonly DelResultat[]): ValgtCelle | null {
  if (valgt === null) return null
  return synlige.some((del) => del.del.varenummer === valgt.varenummer) ? valgt : null
}

// ---------------------------------------------------------------------------
// Tastaturstyringen: WAI-ARIA grid på den ekte <table> (Story 2.9, UX-DR22)
// ---------------------------------------------------------------------------

/** Kolonnene i rutenettet: delens felt, radnavnet og så ukene. Uke u står i kolonne u + 1. */
export const KOLONNE_FELT = 0
export const KOLONNE_RADNAVN = 1
export const KOLONNE_FORSTE_UKE = 2

/**
 * Cellen med fokus. `r` er raden i delen (0–5 i `RADER`). Delens felt spenner over alle seks radene, men
 * husker raden Kari kom fra, så høyre pil går tilbake til samme rad.
 */
export type Rutenettplass = { varenummer: string; r: number; k: number }

export function sisteKolonne(uker: number): number {
  return uker + 1
}

/** Cellen tabulatorstoppet står på til Kari har flyttet seg: første uke i første rad i første del som vises. */
export function forstePlass(varenumre: readonly string[]): Rutenettplass | null {
  const varenummer = varenumre[0]
  return varenummer === undefined ? null : { varenummer, r: 0, k: KOLONNE_FORSTE_UKE }
}

export const NAVIGASJONSTASTER = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'] as const

/**
 * Hvor fokus går ved et tastetrykk, eller null hvis tasten ikke flytter fokus i rutenettet. Ved kanten blir fokus stående.
 *
 * - Piltastene flytter én celle. Venstre fra første uke går til radnavnet, og videre til delens felt.
 *   Opp og ned fra delens felt går til forrige og neste del.
 * - Home og End går til første og siste uke i raden. Ctrl+Home og Ctrl+End går til første uke i første rad i første
 *   del og siste uke i siste rad i siste del.
 * - PgUp og PgDn går til samme rad og kolonne i forrige og neste del.
 *
 * @param varenumre delene som vises, i stykklisterekkefølge (filteret skjuler noen)
 */
export function flytt(
  plass: Rutenettplass,
  tast: string,
  ctrl: boolean,
  varenumre: readonly string[],
  uker: number,
): Rutenettplass | null {
  const indeks = varenumre.indexOf(plass.varenummer)
  if (indeks < 0) return null
  const siste = sisteKolonne(uker)
  const sisteRad = RADER.length - 1
  const iDel = (i: number, endring: Partial<Rutenettplass> = {}): Rutenettplass => {
    const varenummer = varenumre[i]
    return varenummer === undefined ? plass : { ...plass, ...endring, varenummer }
  }
  const forrige = indeks - 1
  const neste = indeks + 1
  const harForrige = forrige >= 0
  const harNeste = neste < varenumre.length

  switch (tast) {
    case 'ArrowRight':
      return { ...plass, k: Math.min(plass.k + 1, siste) }
    case 'ArrowLeft':
      return { ...plass, k: Math.max(plass.k - 1, KOLONNE_FELT) }
    case 'ArrowDown':
      if (plass.k === KOLONNE_FELT) return harNeste ? iDel(neste) : plass
      if (plass.r < sisteRad) return { ...plass, r: plass.r + 1 }
      return harNeste ? iDel(neste, { r: 0 }) : plass
    case 'ArrowUp':
      if (plass.k === KOLONNE_FELT) return harForrige ? iDel(forrige) : plass
      if (plass.r > 0) return { ...plass, r: plass.r - 1 }
      return harForrige ? iDel(forrige, { r: sisteRad }) : plass
    case 'Home':
      return ctrl
        ? { varenummer: varenumre[0] ?? plass.varenummer, r: 0, k: KOLONNE_FORSTE_UKE }
        : { ...plass, k: KOLONNE_FORSTE_UKE }
    case 'End':
      return ctrl
        ? { varenummer: varenumre[varenumre.length - 1] ?? plass.varenummer, r: sisteRad, k: siste }
        : { ...plass, k: siste }
    case 'PageUp':
      return harForrige ? iDel(forrige) : plass
    case 'PageDown':
      return harNeste ? iDel(neste) : plass
    default:
      return null
  }
}

export function erLik(a: Rutenettplass | null, b: Rutenettplass | null): boolean {
  return a === b || (a !== null && b !== null && a.varenummer === b.varenummer && a.r === b.r && a.k === b.k)
}
