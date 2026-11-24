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
  // Introduksjonssiden (Story 1.4, UX-DR6, FR-27). Teksten følger rekkefølgen i resultatet.
  introduksjon: {
    overskriftLinje1: 'Hele produksjonsplanen.',
    overskriftLinje2: 'Én Excel-mal.',
    avsnitt: [
      'COSI - MRP regner ut hva du må bestille og produsere, hvor mye og når. Du fyller ut en fast Excel-mal og laster den opp. Appen viser bestillingsforslagene, hvilke deler som krever handling, og hvordan hvert tall er regnet ut.',
      'Filen blir i nettleseren din og sendes ikke til noen server.',
    ],
    komIGang: 'Kom i gang',
    stegOverskrift: 'De tre stegene',
    steg: [
      { tittel: 'Fyll ut Excel-malen', tekst: 'Stykklisten, prognostiserte behov og planlagte mottak for ett ferdigprodukt.' },
      { tittel: 'Last opp filen', tekst: 'Appen kontrollerer filen og viser alle feil samlet før noe beregnes.' },
      {
        tittel: 'Les resultatet',
        tekst: 'Se hvilke deler som er kritiske, og hva som er foreslått bestilt. Klikk på et tall for å se hvordan det er regnet ut.',
      },
    ],
  },
  // Startsiden «Ny kjøring» (Story 1.4, UX-DR7, FR-27). Opplastingen og valget av beregning kommer i Story 1.11.
  nyKjoring: {
    ettFerdigprodukt:
      'Hver fil gjelder ett ferdigprodukt. Lageret for deler som brukes i flere ferdigprodukter, må du fordele mellom filene selv.',
    kort: {
      fyllUt: {
        tittel: 'Fyll ut Excel-malen',
        tekst:
          'Last ned den tomme malen og fyll den ut. Arket Veiledning i malen forklarer hvordan. Vil du se hvordan et resultat ser ut først, kan du laste opp testeksempel 01 uten endringer.',
        lastNedMalen: 'Last ned Excel-malen',
        lastNedTesteksempel: 'Last ned testeksempel 01',
      },
      lastOpp: {
        tittel: 'Last opp filen',
        tekst: 'Du kan laste opp én Excel-fil (.xlsx). Filen blir i nettleseren din.',
      },
      beregn: {
        tittel: 'Velg hva du vil beregne, og beregn',
        tekst: 'Du velger mellom bestillingsplan, produksjonskapasitet eller begge.',
      },
    },
  },
  // Veiledning (Story 1.4, UX-DR31): hvordan nettsiden brukes. Utfyllingen av malen står i malens ark Veiledning.
  veiledning: {
    ingress: 'Slik bruker du nettsiden. Hvordan Excel-malen fylles ut, står i arket Veiledning i malen.',
    deler: [
      {
        overskrift: '1. Start en ny kjøring',
        avsnitt: [
          'Gå til Ny kjøring. Last ned Excel-malen første gang. Når den er fylt ut, drar du filen inn i feltet eller trykker Velg fil. Velg hva du vil beregne, og trykk Beregn. Filen blir i nettleseren din og sendes ikke til noen server.',
        ],
      },
      {
        overskrift: '2. Hvis filen har feil',
        avsnitt: [
          'Finner appen feil i filen, beregnes ingenting. Alle feilene vises samlet øverst på siden, med ark, rad og felt. Rett dem i Excel, lagre filen og last den opp på nytt. Den lagrede kjøringen endres ikke.',
        ],
      },
      {
        overskrift: '3. Les resultatet',
        avsnitt: [
          'Resultatet står på én side. Knappene øverst tar deg til hver seksjon og viser hvor du er. «Slik leser du resultatet» forklarer hver av dem.',
        ],
        punkter: [
          { navn: 'Kritiske deler', tekst: 'delene der planen ikke går opp, og hva du kan gjøre.' },
          {
            navn: 'Bestillingsforslag',
            tekst: 'hva du må bestille eller sette i produksjon, hvor mye og i hvilken uke. Du kan velge en uke for å se bare den uka.',
          },
          { navn: 'Endringer', tekst: 'hva som er nytt eller endret siden forrige kjøring for samme ferdigprodukt.' },
          { navn: 'Resultattabell', tekst: 'hele utregningen per del og uke.' },
          {
            navn: 'Produksjonskapasitet',
            tekst: 'hvor mange ferdigprodukter lageret og planlagte mottak rekker til, uke for uke. Vises bare hvis du valgte det på Ny kjøring.',
          },
        ],
      },
      {
        overskrift: '4. Se hvordan et tall er regnet ut',
        avsnitt: [
          'Klikk på et tall, et radnavn eller en del i resultattabellen. Forklaringen åpnes ved siden av tabellen og står til du trykker Lukk. Med tastaturet flytter du med piltastene, åpner med Enter og lukker med Esc. Velger du en kritisk del, går appen rett til eksepsjonen i tabellen.',
        ],
      },
      {
        overskrift: '5. Last opp på nytt og sammenlign',
        avsnitt: [
          'Appen husker siste kjøring for hvert ferdigprodukt i denne nettleseren. Laster du opp en ny fil for samme ferdigprodukt, viser seksjonen Endringer hva som er endret. Under Lagrede kjøringer kan du slette en kjøring for å starte på nytt uten sammenligning.',
        ],
      },
      {
        overskrift: '6. Ta vare på resultatet',
        avsnitt: ['Trykk Eksporter til Excel øverst i resultatet for å lagre planen som en Excel-fil.'],
      },
    ],
  },
} as const

// --- Filfeil og validering ------------------------------------------------
// Én mal per kode, i du-form og uten koden, med arket og stedet først (AD-9, EXPERIENCE.md › Voice and Tone).
// Korte setninger: først hva som er galt, så hva Kari gjør.
// Underobjektene: struktur (Story 1.6), stykkliste (Story 1.8) og mpsOgMottak (Story 1.9).

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

/** Radene en feil gjelder, skrevet som «rad 3», «rad 3 og 11» eller «rad 4, 5 og 6». */
function radliste(rader: readonly number[] | undefined): string {
  const r = rader ?? []
  if (r.length <= 1) return `rad ${r[0] ?? ''}`
  return `rad ${r.slice(0, -1).join(', ')} og ${r[r.length - 1]}`
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

  // Story 1.8: verdiene i Stykkliste (FR-3).
  stykkliste: {
    RADER_IKKE_SAMMENHENGENDE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} raden er tom, men det står innhold under den. Stykklisten må stå sammenhengende fra rad 2. Fyll ut raden eller fjern den. Radene under er ikke kontrollert.`,
    RADER_FOR_MANGE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} stykklisten har mer enn 1000 rader. Fjern radene fra og med denne.`,
    RADER_INGEN_NIVAA_1: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} stykklisten har ingen del på nivå .1. Legg til minst én del rett under ferdigproduktet.`,

    NIVAA_UGYLDIG: (feil: Valideringsfeil): string =>
      erTom(feil.verdi)
        ? `${stedOgFelt(feil)} nivået mangler. Velg 0, .1 eller ..2.`
        : `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke et nivå. Velg 0, .1 eller ..2.`,
    NIVAA_FORSTE_RAD_IKKE_0: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} første rad er ferdigproduktet og må ha nivå 0. Her står «${verdiTekst(feil.verdi)}».`,
    NIVAA_FLERE_NIVAA_0: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} bare første rad kan ha nivå 0, siden hver fil gjelder ett ferdigprodukt. Bruk .1 eller ..2.`,
    NIVAA_2_UTEN_NIVAA_1_OVER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} nivå ..2 må stå rett under en rad med nivå .1 eller ..2. Flytt raden, eller bruk nivå .1.`,

    VARENUMMER_MANGLER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} varenummeret mangler. Skriv varenummeret til delen.`,
    VARENUMMER_UNDER_SEG_SELV: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» står under seg selv. En del kan ikke være en del av seg selv, verken direkte eller gjennom andre deler.${
        feil.andreRader && feil.andreRader.length > 0 ? ` Se ${radliste(feil.andreRader)}.` : ''
      }`,

    BESKRIVELSE_MANGLER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} beskrivelsen mangler. Skriv beskrivelsen av delen.`,
    BESKRIVELSE_ULIK: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er en annen beskrivelse enn i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Alle rader med samme varenummer må ha samme beskrivelse.`,

    ANTALL_FYLT_UT_FOR_NIVAA_0: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} ferdigproduktet har ikke antall. Tøm cellen.`,
    ANTALL_MANGLER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} antallet mangler. Skriv hvor mange av delen som går i den overordnede delen, som et heltall som er 1 eller mer.`,
    ANTALL_UGYLDIG: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.`,

    TYPE_UGYLDIG: (feil: Valideringsfeil): string =>
      erTom(feil.verdi)
        ? `${stedOgFelt(feil)} typen mangler. Velg Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv).`
        : `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke en type. Velg Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv).`,
    TYPE_FERDIGVARE_IKKE_NIVAA_0: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} Ferdigvare kan bare stå på nivå 0. Velg Komponent (Kjøpes inn) eller Komponent (Produseres selv).`,
    TYPE_NIVAA_0_IKKE_FERDIGVARE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} raden på nivå 0 er ferdigproduktet og må ha typen Ferdigvare.`,
    TYPE_ULIK: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} typen er en annen enn i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Alle rader med samme varenummer må ha samme type.`,
    TYPE_KJOPES_INN_HAR_UNDERDELER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${feil.varenummer ?? ''}» kjøpes inn, men har underdeler i ${radliste(feil.andreRader)}. Velg Komponent (Produseres selv), eller fjern radene under.`,

    UNDERDELER_ULIKE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${feil.varenummer ?? ''}» har ulike underdeler i ${radliste(feil.andreRader)}. Underdelene og antallene må være like under hver forekomst, eller stå under bare én. Rett radene under, eller fjern dem fra den ene.`,

    LAGERBEHOLDNING_MANGLER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} lagerbeholdningen mangler. Skriv den første gangen varenummeret står, også når den er 0.`,
    LAGERBEHOLDNING_UGYLDIG: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke en gyldig lagerbeholdning. Skriv et heltall som er 0 eller mer.`,
    LAGERBEHOLDNING_FYLT_UT_SENERE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} lagerbeholdningen er allerede fylt ut i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Tøm cellen her.`,

    SIKKERHETSLAGER_MANGLER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} sikkerhetslageret mangler. Skriv det første gangen varenummeret står, også når det er 0.`,
    SIKKERHETSLAGER_UGYLDIG: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke et gyldig sikkerhetslager. Skriv et heltall som er 0 eller mer.`,
    SIKKERHETSLAGER_FYLT_UT_SENERE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} sikkerhetslageret er allerede fylt ut i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Tøm cellen her.`,

    LEDETID_MANGLER: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} ledetiden mangler. Skriv antall uker første gangen varenummeret står.`,
    LEDETID_UGYLDIG: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} «${verdiTekst(feil.verdi)}» er ikke en gyldig ledetid. Skriv et helt antall uker som er 1 eller mer. Ferdigproduktet kan ha 0.`,
    LEDETID_FYLT_UT_SENERE: (feil: Valideringsfeil): string =>
      `${stedOgFelt(feil)} ledetiden er allerede fylt ut i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Tøm cellen her.`,
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
export const resultat = {
  utenKjoring: 'Det er ingen kjøring å vise. Resultatet finnes bare til siden lastes på nytt. Last opp filen på Ny kjøring.',
} as const

// --- Lagring og eksport ---------------------------------------------------
export const lagringOgEksport = {} as const

// --- Kapasitet ------------------------------------------------------------
export const kapasitet = {} as const
