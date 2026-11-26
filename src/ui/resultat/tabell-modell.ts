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
