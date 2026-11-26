// Feiloppsummeringen som data (Story 1.12, FR-2, FR-4, UX-DR11, EXPERIENCE.md › Component Patterns).
// En ren funksjon uten React og DOM, så grupperingen, sorteringen og sammenslåingen kan testes uten nettleser.
// Teksten lages i tekster/nb.ts (AD-9). Komponenten står i Feiloppsummering.tsx.
//
// - Strukturfeil (ark eller kolonneoverskrift som mangler, gammel mal) står først, i gruppen «Filen følger
//   ikke malen», sammen med kontrollene som er hoppet over (FR-2).
// - Verdifeil står per ark i malens rekkefølge: Stykkliste → MPS → Planlagte mottak. Bare ark med feil får en gruppe.
//   Innenfor arket sorteres de etter Excel-rad, og på arket MPS etter uke. Ved lik rad står de i
//   rekkefølgen valideringen ga, som er malens kolonnerekkefølge.
// - Like feil (samme ark, felt og kode) på rader eller uker som følger rett etter hverandre, slås sammen til én
//   linje med intervall og antall. Bare kodene i `samletAarsak` kan slås sammen, så en melding med varenummer,
//   andre rader eller uke utenfor horisonten aldri mister opplysninger.

import { samletAarsak, type SamletFeil } from '../../tekster/nb.ts'
import type { Arknavn, HoppetOverKontroll, Valideringsfeil, Valideringskode, Valideringsresultat } from '../../domene/typer.ts'

/** Én linje i en tabell. `feil` er den første feilen. `samlet` er null for en enkelt feil. */
export type Feillinje = { feil: Valideringsfeil; samlet: SamletFeil | null }

/** Kontrollene som er hoppet over: et helt ark, eller én kolonne (FR-2). */
export type HoppetOverLinje = { type: 'ARK'; ark: Arknavn } | { type: 'KOLONNE'; kontroll: HoppetOverKontroll }

export type Strukturgruppe = { linjer: Feillinje[]; hoppetOver: HoppetOverLinje[] }

/** Verdifeilene i ett ark. `antallFeil` teller alle feilene, også de som er slått sammen. */
export type Arkgruppe = { ark: Arknavn; antallFeil: number; linjer: Feillinje[] }

export type Oppsummering = {
  /** Alle valideringsfeilene i filen (FR-4). */
  antallFeil: number
  /** Null når filen følger malen. */
  struktur: Strukturgruppe | null
  ark: Arkgruppe[]
}

/** Malens rekkefølge (FR-2). Står her fordi ui bare kan importere typer fra domene (arkitektur kap. 2). */
const ARKREKKEFOLGE: readonly Arknavn[] = ['Stykkliste', 'MPS', 'Planlagte mottak']

const STRUKTURKODER: ReadonlySet<Valideringskode> = new Set(['ARK_MANGLER', 'GAMMEL_MAL', 'OVERSKRIFT_MANGLER'])

/** Kodene som kan slås sammen. Teksten for en samlet linje står i `samletAarsak` i tekster/nb.ts. */
export function kanSlaasSammen(kode: Valideringskode): boolean {
  return kode in samletAarsak
}

export function lagOppsummering({ feil, hoppetOver }: Valideringsresultat): Oppsummering {
  const strukturfeil = feil.filter((f) => STRUKTURKODER.has(f.kode))
  const verdifeil = feil.filter((f) => !STRUKTURKODER.has(f.kode))

  const struktur: Strukturgruppe | null =
    strukturfeil.length === 0 && hoppetOver.length === 0
      ? null
      : {
          linjer: [...strukturfeil]
            .sort((a, b) => ARKREKKEFOLGE.indexOf(a.ark) - ARKREKKEFOLGE.indexOf(b.ark))
            .map((f) => ({ feil: f, samlet: null })),
          hoppetOver: hoppetOverLinjer(hoppetOver),
        }

  const ark: Arkgruppe[] = []
  for (const navn of ARKREKKEFOLGE) {
    const iArket = verdifeil.filter((f) => f.ark === navn)
    if (iArket.length > 0) ark.push({ ark: navn, antallFeil: iArket.length, linjer: slaaSammen(sorter(iArket)) })
  }

  return { antallFeil: feil.length, struktur, ark }
}

/** Raden eller uken feilen står på. Rad for Stykkliste og Planlagte mottak, uke for MPS. */
function plass(feil: Valideringsfeil): number {
  switch (feil.sted.type) {
    case 'UKE':
      return feil.sted.uke
    case 'CELLE':
    case 'RAD':
      return feil.sted.excelRad
    case 'OVERSKRIFT':
    case 'ARK':
      return 0
  }
}

/** Etter rad eller uke. `sort` er stabil, så lik rad beholder rekkefølgen fra valideringen (kolonnene). */
function sorter(feil: Valideringsfeil[]): Valideringsfeil[] {
  return [...feil].sort((a, b) => plass(a) - plass(b))
}

/**
 * Slår sammen like feil på rader eller uker som følger rett etter hverandre. Linjen står der den første
 * feilen står. En rad eller uke som mangler i rekken, starter en ny linje.
 */
function slaaSammen(sortert: Valideringsfeil[]): Feillinje[] {
  const linjer: Feillinje[] = []
  /** Siste linje per ark, felt og kode, med plassen til den siste feilen i den. */
  const aapne = new Map<string, { linje: Feillinje; sist: number }>()

  for (const feil of sortert) {
    const naa = plass(feil)
    const nokkel = `${feil.felt}|${feil.kode}`
    const aapen = aapne.get(nokkel)
    if (kanSlaasSammen(feil.kode) && aapen && aapen.sist === naa - 1) {
      const fra = aapen.linje.samlet?.fra ?? plass(aapen.linje.feil)
      aapen.linje.samlet = { fra, til: naa, antall: naa - fra + 1 }
      aapen.sist = naa
      continue
    }
    const linje: Feillinje = { feil, samlet: null }
    linjer.push(linje)
    aapne.set(nokkel, { linje, sist: naa })
  }
  return linjer
}

/**
 * Ett ark som mangler, blir én linje i stedet for én per kolonne i arket. Kolonner i andre ark som avhenger
 * av det (for eksempel ukene i Planlagte mottak når MPS mangler), står hver for seg.
 */
function hoppetOverLinjer(hoppetOver: readonly HoppetOverKontroll[]): HoppetOverLinje[] {
  const linjer: HoppetOverLinje[] = []
  const helArk = new Set<Arknavn>()
  for (const kontroll of hoppetOver) {
    if (kontroll.fordi.kode === 'ARK_MANGLER' && kontroll.fordi.ark === kontroll.ark) {
      if (!helArk.has(kontroll.ark)) {
        helArk.add(kontroll.ark)
        linjer.push({ type: 'ARK', ark: kontroll.ark })
      }
      continue
    }
    linjer.push({ type: 'KOLONNE', kontroll })
  }
  return linjer
}
