// All norsk tekst brukeren ser, og formateringen av tall, står i denne fila (NFR-7, AD-9).
// Ordene følger ordbanken (.docs/ordbank.md).
//
// Nye tekster legges inn i sin egen seksjon nedenfor. Hver seksjon er et eget objekt,
// så flere kan legge til tekster samtidig uten flettekonflikter. Lag ikke nye seksjoner
// uten å avtale det i gruppen.

// --- Felles ---------------------------------------------------------------
export const felles = {
  appnavn: 'COSI - MRP',
  appmeny: 'Appmeny',
  visninger: {
    introduksjon: 'Introduksjon',
    nyKjoring: 'Ny kjøring',
    resultat: 'Resultat',
    lagredeKjoringer: 'Lagrede kjøringer',
    veiledning: 'Veiledning',
  },
  /** Sidetittelen i nettleserens fane, for eksempel «Veiledning – COSI - MRP». */
  sidetittel: (visning: string) => `${visning} – COSI - MRP`,
  tilNyKjoring: 'Til Ny kjøring',
  feilgrense: {
    overskrift: 'Noe gikk galt',
    tekst: 'Siden kunne ikke vises. Du kan gå til Ny kjøring og laste opp filen på nytt.',
  },
} as const

// --- Filfeil og validering ------------------------------------------------
export const filfeilOgValidering = {} as const

// --- Eksepsjoner ----------------------------------------------------------
export const eksepsjoner = {} as const

// --- Forklaringer ---------------------------------------------------------
export const forklaringer = {} as const

// --- Resultat -------------------------------------------------------------
export const resultat = {
  utenKjoring: 'Det er ingen kjøring å vise. Resultatet finnes bare til siden lastes på nytt. Last opp filen på Ny kjøring.',
} as const

// --- Lagring og eksport ---------------------------------------------------
export const lagringOgEksport = {} as const

// --- Kapasitet ------------------------------------------------------------
export const kapasitet = {} as const
