// All norsk tekst brukeren ser, og formateringen av tall, står i denne fila (NFR-7, AD-9).
// Ordene følger ordbanken (.docs/ordbank.md).
//
// Nye tekster legges inn i sin egen seksjon nedenfor. Hver seksjon er et eget objekt,
// så flere kan legge til tekster samtidig uten flettekonflikter. Lag ikke nye seksjoner
// uten å avtale det i gruppen.

import type { Arknavn, Celleverdi, Feilsted, Valideringsfeil } from '../domene/typer.ts'

// --- Felles ---------------------------------------------------------------
export const felles = {
  appnavn: 'COSI - MRP',
} as const

// --- Filfeil og validering ------------------------------------------------
// Én mal per kode, i du-form og uten koden, med arket og stedet først (AD-9, EXPERIENCE.md › Voice and Tone).
// Korte setninger: først hva som er galt, så hva Kari gjør.
// Underobjektene: struktur (Story 1.6) og mpsOgMottak (Story 1.9). Story 1.8 lager sitt eget.

/** Arket slik Kari ser det. MPS skrives «Prognostiserte behov (arket MPS)» (EXPERIENCE.md). */
function arkTekst(ark: Arknavn): string {
  return ark === 'MPS' ? 'Prognostiserte behov (arket MPS)' : ark
}

/** Rad eller uke slik Kari ser den: «rad 4» (Excel-raden) eller «uke 3» (arket MPS). */
function stedTekst(sted: Feilsted): string {
  switch (sted.type) {
    case 'UKE':
      return `uke ${sted.uke}`
    case 'CELLE':
    case 'RAD':
      return `rad ${sted.excelRad}`
    case 'OVERSKRIFT':
      return 'rad 1'
    case 'ARK':
      return 'hele arket'
  }
}

/** Ark, sted og felt først, som i EXPERIENCE.md: «Planlagte mottak, rad 4, Uke:». */
function stedOgFelt(feil: Valideringsfeil): string {
  return `${arkTekst(feil.ark)}, ${stedTekst(feil.sted)}, ${feil.felt}:`
}

/** Verdien i cellen slik den skrives i en melding: 30,5 og −5 med norsk desimaltegn og minustegn. */
function verdiTekst(verdi: Celleverdi | undefined): string {
  if (typeof verdi === 'number') return String(verdi).replace('.', ',').replace('-', '−')
  if (typeof verdi === 'boolean') return verdi ? 'SANN' : 'USANN'
  return String(verdi ?? '').trim()
}

function erTom(verdi: Celleverdi | undefined): boolean {
  return verdi === null || verdi === undefined || (typeof verdi === 'string' && verdi.trim() === '')
}

function uker(antall: number): string {
  return antall === 1 ? '1 uke' : `${antall} uker`
}

export const filfeilOgValidering = {
  struktur: {
    ARK_MANGLER: (feil: Valideringsfeil): string =>
      `${feil.ark === 'MPS' ? arkTekst(feil.ark) : `Arket ${feil.ark}`} mangler. Legg det til slik det står i malen, med kolonneoverskriftene i rad 1.`,
    // Ordrett fra EXPERIENCE.md. Gjelder alltid arket Stykkliste.
    GAMMEL_MAL: (_feil: Valideringsfeil): string =>
      'Arket Stykkliste mangler. Filen ser ut til å følge en gammel mal (arkene Produkt og Komponenter). Last ned malen fra startsiden og flytt dataene over.',
    OVERSKRIFT_MANGLER: (feil: Valideringsfeil): string =>
      `${arkTekst(feil.ark)}, ${feil.sted.type === 'OVERSKRIFT' ? feil.sted.celle : 'rad 1'}: kolonneoverskriften «${feil.felt}» mangler. Skriv den inn slik den står i malen.`,
  },

  // Story 1.9: verdiene i MPS og Planlagte mottak (FR-3).
  mpsOgMottak: {
    MPS_ANTALL_UGYLDIG: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke et gyldig antall. Skriv et heltall som er 0 eller mer.`,
    MPS_UKE_ETTER_HULL: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} uken er fylt ut etter en tom uke. Fyll ut ukene uten hull fra uke 1, eller tøm denne uken.`,
    // Står på uke H + 1 når horisonten er for kort, og på uke 13 når den er for lang.
    MPS_HORISONT_UGYLDIG: (feil: Valideringsfeil): string => {
      const uke = feil.sted.type === 'UKE' ? feil.sted.uke : 0
      if (uke > 12) {
        return `${stedOgFelt(feil)} mer enn 12 uker er fylt ut. Horisonten må være 8 til 12 uker, så tøm uke 13 og ukene etter.`
      }
      const utfylt = uke - 1
      return utfylt <= 0
        ? `${stedOgFelt(feil)} ingen uker er fylt ut sammenhengende fra uke 1. Fyll ut 8 til 12 uker fra uke 1.`
        : `${stedOgFelt(feil)} bare ${uker(utfylt)} er fylt ut sammenhengende fra uke 1. Horisonten må være 8 til 12 uker, så fyll ut minst til uke 8.`
    },
    MOTTAK_VARENUMMER_UKJENT: (feil: Valideringsfeil): string =>
      erTom(feil.verdi)
        ? `${stedOgFelt(feil)} varenummeret mangler. Skriv et varenummer som står i Stykkliste.`
        : `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» finnes ikke i Stykkliste. Skriv et varenummer som står der.`,
    MOTTAK_UKE_IKKE_HELTALL: (feil: Valideringsfeil): string =>
      erTom(feil.verdi)
        ? `${stedOgFelt(feil)} uken mangler. Skriv uken som et heltall, for eksempel 4.`
        : `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke en uke. Skriv uken som et heltall, for eksempel 4.`,
    // «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.» (EXPERIENCE.md)
    MOTTAK_UKE_UTENFOR_HORISONT: (feil: Valideringsfeil): string => {
      const uke = typeof feil.verdi === 'number' ? feil.verdi : Number(String(feil.verdi ?? '').trim())
      return uke < 1
        ? `${stedOgFelt(feil)} uke ${verdiTekst(uke)} er før horisonten. Første uke i horisonten er uke 1.`
        : `${stedOgFelt(feil)} uke ${verdiTekst(uke)} er etter horisonten. Horisonten er ukene som er fylt ut i Prognostiserte behov (arket MPS).`
    },
    MOTTAK_ANTALL_UGYLDIG: (feil: Valideringsfeil): string =>
      erTom(feil.verdi)
        ? `${stedOgFelt(feil)} antallet mangler. Skriv et heltall som er 1 eller mer.`
        : `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.`,
  },
} as const

// --- Eksepsjoner ----------------------------------------------------------
export const eksepsjoner = {} as const

// --- Forklaringer ---------------------------------------------------------
export const forklaringer = {} as const

// --- Resultat -------------------------------------------------------------
export const resultat = {} as const

// --- Lagring og eksport ---------------------------------------------------
export const lagringOgEksport = {} as const

// --- Kapasitet ------------------------------------------------------------
export const kapasitet = {} as const
