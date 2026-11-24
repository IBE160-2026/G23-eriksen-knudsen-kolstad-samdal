// Validering av Excel-filen (Story 1.6, FR-2, AD-5, AD-9).
//
// Story 1.6 kontrollerer malens struktur: arkene og kolonneoverskriftene. Verdiene kontrolleres
// i Story 1.8 (Stykkliste) og 1.9 (MPS og Planlagte mottak), som spør `hoppesOver` om en kontroll
// skal hoppes over fordi et ark eller en overskrift mangler.
//
// - Kaster aldri unntak for feil i brukerens data, og samler alle feil før den svarer (AD-5).
// - Gir koder, ark, sted og felt, aldri ferdig tekst. Teksten lages i tekster/nb.ts (AD-9).

import {
  ARKNAVN,
  MPS_KOLONNER,
  PLANLAGTE_MOTTAK_KOLONNER,
  STYKKLISTE_KOLONNER,
  type Arknavn,
  type HoppetOverKontroll,
  type Kolonnenavn,
  type MpsKolonne,
  type PlanlagteMottakKolonne,
  type RaaArk,
  type StykklisteKolonne,
  type Valideringsfeil,
  type Valideringsresultat,
} from './typer.ts'

/** Malens kolonner per ark, i malens rekkefølge (indeks 0 = kolonne A). */
const KOLONNER: Record<Arknavn, readonly Kolonnenavn[]> = {
  Stykkliste: STYKKLISTE_KOLONNER,
  MPS: MPS_KOLONNER,
  'Planlagte mottak': PLANLAGTE_MOTTAK_KOLONNER,
}

/** Arkene i den gamle malen. Har filen ett av dem og ikke Stykkliste, gir det GAMMEL_MAL (FR-2). */
const GAMLE_ARK = ['Produkt', 'Komponenter']

type Fordi = HoppetOverKontroll['fordi']

/**
 * Kontrollerer at filen har malens ark og kolonneoverskrifter (FR-2).
 *
 * - Arkene kontrolleres i rekkefølgen i ARKNAVN. Et ark som mangler, gir ARK_MANGLER (eller GAMMEL_MAL
 *   for Stykkliste i en fil etter den gamle malen), og overskriftene i det kontrolleres ikke.
 * - Hver overskrift som mangler, gir OVERSKRIFT_MANGLER med malens plass i rad 1, i malens rekkefølge.
 * - `hoppetOver` har én linje per ark og felt som ikke kan kontrolleres, så 1.8 og 1.9 ikke gir følgefeil.
 */
export function validerStruktur(raa: RaaArk): Valideringsresultat {
  const feil: Valideringsfeil[] = []
  const hoppetOver: HoppetOverKontroll[] = []

  for (const ark of ARKNAVN) {
    const kolonner = KOLONNER[ark]
    const overskrifter = overskrifterI(raa, ark)

    if (overskrifter === null) {
      const gammelMal = ark === 'Stykkliste' && raa.alleArk.some((navn) => GAMLE_ARK.includes(navn))
      feil.push({ kode: gammelMal ? 'GAMMEL_MAL' : 'ARK_MANGLER', ark, sted: { type: 'ARK' }, felt: 'Ark' })
      for (const felt of kolonner) hoppetOver.push({ ark, felt, fordi: { kode: 'ARK_MANGLER', ark } })
      continue
    }

    kolonner.forEach((felt, indeks) => {
      if ((overskrifter[felt] ?? null) === null) {
        feil.push({
          kode: 'OVERSKRIFT_MANGLER',
          ark,
          sted: { type: 'OVERSKRIFT', celle: `${kolonnebokstav(indeks)}1` },
          felt,
        })
        hoppetOver.push({ ark, felt, fordi: { kode: 'OVERSKRIFT_MANGLER', ark, felt } })
        return
      }
      const avhengighet = avhengerAv(raa, ark, felt)
      if (avhengighet !== null) hoppetOver.push({ ark, felt, fordi: avhengighet })
    })
  }

  return { feil, hoppetOver }
}

/** Kolonnene i hvert ark, så `hoppesOver` bare godtar en kolonne som finnes i arket. */
export type KolonnerIArk = {
  Stykkliste: StykklisteKolonne
  MPS: MpsKolonne
  'Planlagte mottak': PlanlagteMottakKolonne
}

/** Om kontrollen av feltet i arket er hoppet over (for Story 1.8 og 1.9). */
export function hoppesOver<A extends Arknavn>(resultat: Valideringsresultat, ark: A, felt: KolonnerIArk[A]): boolean {
  return resultat.hoppetOver.some((linje) => linje.ark === ark && linje.felt === felt)
}

function overskrifterI(raa: RaaArk, ark: Arknavn): Partial<Record<Kolonnenavn, string | null>> | null {
  switch (ark) {
    case 'Stykkliste':
      return raa.stykkliste?.overskrifter ?? null
    case 'MPS':
      return raa.mps?.overskrifter ?? null
    case 'Planlagte mottak':
      return raa.planlagteMottak?.overskrifter ?? null
  }
}

/**
 * Kontroller i et ark som finnes, men som avhenger av et annet ark (FR-2):
 * - Planlagte mottak › Uke trenger horisonten, altså MPS med «Antall ferdigprodukter».
 * - Planlagte mottak › Varenummer trenger varenumrene i Stykkliste.
 */
function avhengerAv(raa: RaaArk, ark: Arknavn, felt: Kolonnenavn): Fordi | null {
  if (ark !== 'Planlagte mottak') return null
  if (felt === 'Uke') {
    if (raa.mps === null) return { kode: 'ARK_MANGLER', ark: 'MPS' }
    if ((raa.mps.overskrifter['Antall ferdigprodukter'] ?? null) === null) {
      return { kode: 'OVERSKRIFT_MANGLER', ark: 'MPS', felt: 'Antall ferdigprodukter' }
    }
  }
  if (felt === 'Varenummer') {
    if (raa.stykkliste === null) return { kode: 'ARK_MANGLER', ark: 'Stykkliste' }
    if ((raa.stykkliste.overskrifter['Varenummer'] ?? null) === null) {
      return { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', felt: 'Varenummer' }
    }
  }
  return null
}

/** 0 → A, 7 → H, 26 → AA. */
function kolonnebokstav(indeks: number): string {
  let bokstaver = ''
  for (let n = indeks + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    bokstaver = String.fromCharCode(65 + ((n - 1) % 26)) + bokstaver
  }
  return bokstaver
}
