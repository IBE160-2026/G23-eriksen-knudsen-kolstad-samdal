// All norsk tekst brukeren ser, og formateringen av tall, står i denne fila (NFR-7, AD-9).
// Ordene følger ordbanken (.docs/ordbank.md).
//
// Nye tekster legges inn i sin egen seksjon nedenfor. Hver seksjon er et eget objekt,
// så flere kan legge til tekster samtidig uten flettekonflikter. Lag ikke nye seksjoner
// uten å avtale det i gruppen.

import type {
  Arknavn,
  Celleverdi,
  Delstype,
  Eksepsjon,
  Eksepsjonskode,
  Feilsted,
  Filfeilkode,
  HoppetOverKontroll,
  Valideringsfeil,
  Valideringskode,
} from '../domene/typer.ts'

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
  /** Knappen nederst i appmenyen (Story 1.13, UX-DR3). Teksten sier hva som skjer ved klikk. */
  visningsknapp: { tilMork: 'Bytt til mørk', tilLys: 'Bytt til lys' },
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
  // Startsiden «Ny kjøring» (Story 1.4 og 1.11, UX-DR7, FR-27). Valget av beregning kommer i Epic 5.
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
        // Tittelen er fra akseptkriteriene (Story 1.4). Teksten sier hva Beregn gjør nå: valget av beregning
        // kommer i Epic 5 og selve beregningen i Epic 2 (deferred-work.md, Story 1.11).
        tittel: 'Velg hva du vil beregne, og beregn',
        tekst: 'Trykk Beregn når filen er valgt. Foreløpig leser og kontrollerer appen filen. Bestillingsplanen beregnes ikke ennå.',
      },
    },
    // Opplastingssonen (Story 1.11, UX-DR8, EXPERIENCE.md › Component Patterns og Voice and Tone).
    // «Slipp Excel-filen her» er pynt. Instruksjonen står i hjelpeteksten (kort.lastOpp.tekst).
    opplasting: {
      slippHer: 'Slipp Excel-filen her',
      eller: 'eller',
      velgFil: 'Velg fil',
      valgtFil: (filnavn: string) => `Valgt fil: ${filnavn}`,
      flereFiler: 'Slipp bare én fil. Ingen av filene er lest.',
      velgFilForst: 'Velg en fil først.',
    },
    // Beregn og statusene (Story 1.11, UX-DR10). «…» er U+2026 med vanlig mellomrom foran.
    beregning: {
      beregn: 'Beregn',
      leserFilen: 'Leser filen …',
      beregner: 'Beregner …',
      /** «Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.» Kunngjøres etter Beregn (Story 2.5, UX-DR4). */
      ferdig: (bestillingsforslag: number, kritiskeDeler: number) =>
        `Kjøringen er ferdig: ${bestillingsforslag} bestillingsforslag, ${kritiskeDeler} kritiske deler.`,
      /** Når bestillingsplanen ikke er beregnet (bare produksjonskapasitet er valgt, Epic 5). */
      ferdigUtenPlan: 'Kjøringen er ferdig. Filen er lest og har ingen feil.',
    },
  },
  // Veiledning (Story 1.4, UX-DR31): hvordan nettsiden brukes. Utfyllingen av malen står i malens ark Veiledning.
  veiledning: {
    ingress: 'Slik bruker du nettsiden. Hvordan Excel-malen fylles ut, står i arket Veiledning i malen.',
    deler: [
      {
        // Del 1–3 beskriver det appen gjør nå (Story 1.11, del 2 oppdatert i Story 1.12). Del 3–6 beskriver også resultatet slik det blir,
        // og sier at det kommer senere. Teksten oppdateres når Epic 2–5 bygges (deferred-work.md).
        overskrift: '1. Start en ny kjøring',
        avsnitt: [
          'Gå til Ny kjøring. Last ned Excel-malen første gang. Når den er fylt ut, drar du filen inn i feltet eller trykker Velg fil, og så trykker du Beregn. Appen leser filen og kontrollerer den. Filen blir i nettleseren din og sendes ikke til noen server.',
        ],
      },
      {
        overskrift: '2. Hvis filen har feil',
        avsnitt: [
          'Finner appen feil i filen, beregnes ingenting. Øverst på Ny kjøring står alle feilene samlet, per ark, med rad eller uke, kolonnen og hva som er galt. Rader er radnumrene i Excel. Kan ikke filen leses i det hele tatt, for eksempel fordi den er tom eller skadet, står meldingen ved opplastingen. Rett filen i Excel, lagre den og last den opp på nytt.',
        ],
      },
      {
        overskrift: '3. Les resultatet',
        avsnitt: [
          'Når filen ikke har feil, går appen til Resultat. Linjen øverst viser ferdigproduktet, horisonten, filen og når den ble lest. «Last opp ny fil» tar deg tilbake til Ny kjøring.',
          'Selve bestillingsplanen beregnes ikke ennå. Disse seksjonene kommer i en senere versjon av appen:',
        ],
        punkter: [
          { navn: 'Kritiske deler', tekst: 'delene der planen ikke går opp, og hva du kan gjøre.' },
          {
            navn: 'Bestillingsforslag',
            tekst: 'hva du må bestille eller sette i produksjon, hvor mye og i hvilken uke. Du kan velge en uke for å se bare den uka.',
          },
          { navn: 'Endringer', tekst: 'hva som er nytt eller endret siden forrige kjøring for samme ferdigprodukt.' },
          { navn: 'Resultattabell', tekst: 'hele utregningen per del og uke.' },
          // Produksjonskapasitet legges til igjen når valget av beregning finnes (Epic 5).
        ],
      },
      {
        overskrift: '4. Se hvordan et tall er regnet ut',
        avsnitt: [
          'Kommer i en senere versjon av appen. Klikk på et tall, et radnavn eller en del i resultattabellen. Forklaringen åpnes ved siden av tabellen og står til du trykker Lukk. Med tastaturet flytter du med piltastene, åpner med Enter og lukker med Esc. Velger du en kritisk del, går appen rett til eksepsjonen i tabellen.',
        ],
      },
      {
        overskrift: '5. Last opp på nytt og sammenlign',
        avsnitt: [
          'Kommer i en senere versjon av appen. Appen husker siste kjøring for hvert ferdigprodukt i denne nettleseren. Laster du opp en ny fil for samme ferdigprodukt, viser seksjonen Endringer hva som er endret. Under Lagrede kjøringer kan du slette en kjøring for å starte på nytt uten sammenligning.',
        ],
      },
      {
        overskrift: '6. Ta vare på resultatet',
        avsnitt: [
          'Kommer i en senere versjon av appen. Trykk Eksporter til Excel øverst i resultatet for å lagre planen som en Excel-fil.',
        ],
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

/** Flere enn dette nevnes ikke enkeltvis i en melding: «rad 4, 5, 6, 7, 8 og 3 til». */
const MAKS_NEVNTE_RADER = 5

/**
 * Radene en feil gjelder, sortert og skrevet som «rad 3», «rad 3 og 11» eller «rad 4, 5 og 6».
 * Over fem rader nevnes de fem første og så hvor mange som står igjen. Uten rader står «andre rader».
 */
function radliste(rader: readonly number[] | undefined): string {
  const r = [...(rader ?? [])].sort((a, b) => a - b)
  if (r.length === 0) return 'andre rader'
  if (r.length === 1) return `rad ${r[0]}`
  if (r.length > MAKS_NEVNTE_RADER + 1) return `rad ${r.slice(0, MAKS_NEVNTE_RADER).join(', ')} og ${r.length - MAKS_NEVNTE_RADER} til`
  return `rad ${r.slice(0, -1).join(', ')} og ${r[r.length - 1]}`
}

/** En mal som gir bare årsaken, uten ark, sted og felt: «uke 0 er før horisonten. …». */
type Aarsak = (feil: Valideringsfeil) => string

// Story 1.8: verdiene i Stykkliste (FR-3). Bare årsaken. Ark, sted og felt settes foran i medStedOgFelt.
const stykklisteAarsak = {
  RADER_IKKE_SAMMENHENGENDE: (_feil: Valideringsfeil): string =>
    `raden er tom, men det står innhold under den. Stykklisten må stå sammenhengende fra rad 2. Fyll ut raden eller fjern den. Radene under er ikke kontrollert.`,
  RADER_FOR_MANGE: (_feil: Valideringsfeil): string =>
    `stykklisten har mer enn 1000 rader. Fjern radene fra og med denne.`,
  RADER_INGEN_NIVAA_1: (_feil: Valideringsfeil): string =>
    `stykklisten har ingen del på nivå .1. Legg til minst én del rett under ferdigproduktet.`,

  NIVAA_UGYLDIG: (feil: Valideringsfeil): string =>
    erTom(feil.verdi)
      ? `nivået mangler. Velg 0, .1 eller ..2.`
      : `«${verdiTekst(feil.verdi)}» er ikke et nivå. Velg 0, .1 eller ..2.`,
  NIVAA_FORSTE_RAD_IKKE_0: (feil: Valideringsfeil): string =>
    `første rad er ferdigproduktet og må ha nivå 0. Her står «${verdiTekst(feil.verdi)}».`,
  NIVAA_FLERE_NIVAA_0: (_feil: Valideringsfeil): string =>
    `bare første rad kan ha nivå 0, siden hver fil gjelder ett ferdigprodukt. Bruk .1 eller ..2.`,
  NIVAA_2_UTEN_NIVAA_1_OVER: (_feil: Valideringsfeil): string =>
    `nivå ..2 må stå rett under en rad med nivå .1 eller ..2. Flytt raden, eller bruk nivå .1.`,

  VARENUMMER_MANGLER: (_feil: Valideringsfeil): string =>
    `varenummeret mangler. Skriv varenummeret til delen.`,
  VARENUMMER_UNDER_SEG_SELV: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» står under seg selv. En del kan ikke være en del av seg selv, verken direkte eller gjennom andre deler.${
      feil.andreRader && feil.andreRader.length > 0 ? ` Se ${radliste(feil.andreRader)}.` : ''
    }`,

  BESKRIVELSE_MANGLER: (_feil: Valideringsfeil): string =>
    `beskrivelsen mangler. Skriv beskrivelsen av delen.`,
  BESKRIVELSE_ULIK: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» er en annen beskrivelse enn i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Alle rader med samme varenummer må ha samme beskrivelse.`,

  ANTALL_FYLT_UT_FOR_NIVAA_0: (_feil: Valideringsfeil): string =>
    `ferdigproduktet har ikke antall. Tøm cellen.`,
  ANTALL_MANGLER: (_feil: Valideringsfeil): string =>
    `antallet mangler. Skriv hvor mange av delen som går i den overordnede delen, som et heltall som er 1 eller mer.`,
  ANTALL_UGYLDIG: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.`,

  TYPE_UGYLDIG: (feil: Valideringsfeil): string =>
    erTom(feil.verdi)
      ? `typen mangler. Velg Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv).`
      : `«${verdiTekst(feil.verdi)}» er ikke en type. Velg Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv).`,
  TYPE_FERDIGVARE_IKKE_NIVAA_0: (_feil: Valideringsfeil): string =>
    `Ferdigvare kan bare stå på nivå 0. Velg Komponent (Kjøpes inn) eller Komponent (Produseres selv).`,
  TYPE_NIVAA_0_IKKE_FERDIGVARE: (_feil: Valideringsfeil): string =>
    `raden på nivå 0 er ferdigproduktet og må ha typen Ferdigvare.`,
  TYPE_ULIK: (feil: Valideringsfeil): string =>
    `typen er en annen enn i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Alle rader med samme varenummer må ha samme type.`,
  TYPE_KJOPES_INN_HAR_UNDERDELER: (feil: Valideringsfeil): string =>
    `«${feil.varenummer ?? ''}» kjøpes inn, men har underdeler i ${radliste(feil.andreRader)}. Velg Komponent (Produseres selv), eller fjern radene under.`,

  UNDERDELER_ULIKE: (feil: Valideringsfeil): string =>
    `«${feil.varenummer ?? ''}» har ulike underdeler i ${radliste(feil.andreRader)}. Underdelene og antallene må være like under hver forekomst, eller stå under bare én. Rett radene under, eller fjern dem fra den ene.`,

  LAGERBEHOLDNING_MANGLER: (_feil: Valideringsfeil): string =>
    `lagerbeholdningen mangler. Skriv den første gangen varenummeret står, også når den er 0.`,
  LAGERBEHOLDNING_UGYLDIG: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» er ikke en gyldig lagerbeholdning. Skriv et heltall som er 0 eller mer.`,
  LAGERBEHOLDNING_FYLT_UT_SENERE: (feil: Valideringsfeil): string =>
    `lagerbeholdningen er allerede fylt ut i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Tøm cellen her.`,

  SIKKERHETSLAGER_MANGLER: (_feil: Valideringsfeil): string =>
    `sikkerhetslageret mangler. Skriv det første gangen varenummeret står, også når det er 0.`,
  SIKKERHETSLAGER_UGYLDIG: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» er ikke et gyldig sikkerhetslager. Skriv et heltall som er 0 eller mer.`,
  SIKKERHETSLAGER_FYLT_UT_SENERE: (feil: Valideringsfeil): string =>
    `sikkerhetslageret er allerede fylt ut i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Tøm cellen her.`,

  LEDETID_MANGLER: (_feil: Valideringsfeil): string =>
    `ledetiden mangler. Skriv antall uker første gangen varenummeret står.`,
  LEDETID_UGYLDIG: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» er ikke en gyldig ledetid. Skriv et helt antall uker som er 1 eller mer. Ferdigproduktet kan ha 0.`,
  LEDETID_FYLT_UT_SENERE: (feil: Valideringsfeil): string =>
    `ledetiden er allerede fylt ut i ${radliste(feil.andreRader)} for varenummer ${feil.varenummer ?? ''}. Tøm cellen her.`,
} satisfies Record<string, Aarsak>

// Story 1.9: verdiene i MPS og Planlagte mottak (FR-3). Bare årsaken.
const mpsOgMottakAarsak = {
  MPS_ANTALL_UGYLDIG: (feil: Valideringsfeil): string =>
    `«${verdiTekst(feil.verdi)}» er ikke et gyldig antall. Skriv et heltall som er 0 eller mer.`,
  MPS_UKE_ETTER_HULL: (_feil: Valideringsfeil): string =>
    `uken er fylt ut etter en tom uke. Fyll ut ukene uten hull fra uke 1, eller tøm denne uken.`,
  // Står på uke H + 1 når horisonten er for kort, og på uke 13 når den er for lang.
  MPS_HORISONT_UGYLDIG: (feil: Valideringsfeil): string => {
    const uke = feil.sted.type === 'UKE' ? feil.sted.uke : 0
    if (uke > 12) {
      return `mer enn 12 uker er fylt ut. Horisonten må være 8 til 12 uker, så tøm uke 13 og ukene etter.`
    }
    const utfylt = uke - 1
    return utfylt <= 0
      ? `ingen uker er fylt ut sammenhengende fra uke 1. Fyll ut 8 til 12 uker fra uke 1.`
      : `bare ${uker(utfylt)} er fylt ut sammenhengende fra uke 1. Horisonten må være 8 til 12 uker, så fyll ut minst til uke 8.`
  },
  MOTTAK_VARENUMMER_UKJENT: (feil: Valideringsfeil): string =>
    erTom(feil.verdi)
      ? `varenummeret mangler. Skriv et varenummer som står i Stykkliste.`
      : `«${verdiTekst(feil.verdi)}» finnes ikke i Stykkliste. Skriv et varenummer som står der.`,
  MOTTAK_UKE_IKKE_HELTALL: (feil: Valideringsfeil): string =>
    erTom(feil.verdi)
      ? `uken mangler. Skriv uken som et heltall, for eksempel 4.`
      : `«${verdiTekst(feil.verdi)}» er ikke en uke. Skriv uken som et heltall, for eksempel 4.`,
  // «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.» (EXPERIENCE.md)
  MOTTAK_UKE_UTENFOR_HORISONT: (feil: Valideringsfeil): string => {
    const uke = typeof feil.verdi === 'number' ? feil.verdi : Number(String(feil.verdi ?? '').trim())
    return uke < 1
      ? `uke ${verdiTekst(uke)} er før horisonten. Første uke i horisonten er uke 1.`
      : `uke ${verdiTekst(uke)} er etter horisonten. Horisonten er ukene som er fylt ut i Prognostiserte behov (arket MPS).`
  },
  MOTTAK_ANTALL_UGYLDIG: (feil: Valideringsfeil): string =>
    erTom(feil.verdi)
      ? `antallet mangler. Skriv et heltall som er 1 eller mer.`
      : `«${verdiTekst(feil.verdi)}» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.`,
} satisfies Record<string, Aarsak>

/** Årsaken når en kolonneoverskrift mangler, uten ark og celle (FR-2). */
function overskriftAarsak(feil: Valideringsfeil): string {
  return `kolonneoverskriften «${feil.felt}» mangler. Skriv den inn slik den står i malen.`
}

/** Setter ark, sted og felt foran årsaken, så malen gir hele setningen som i UJ-4. */
function medStedOgFelt<T extends Record<string, Aarsak>>(aarsaker: T): { readonly [K in keyof T]: Aarsak } {
  const maler = {} as Record<keyof T, Aarsak>
  for (const kode of Object.keys(aarsaker) as (keyof T)[]) {
    const aarsak = aarsaker[kode]
    maler[kode] = (feil) => `${stedOgFelt(feil)} ${aarsak(feil)}`
  }
  return maler
}

export const filfeilOgValidering = {
  // Story 1.11: feil i hele filen og uventet feil, én melding i opplastingssonen (NFR-9, UX-DR12).
  // Ordrett fra EXPERIENCE.md › Feil i hele filen.
  heleFilen: {
    IKKE_XLSX: 'Appen tar bare imot Excel-malen (.xlsx).',
    SKADET_FIL: 'Filen kan ikke leses. Den er kanskje skadet. Lagre den på nytt fra Excel og prøv igjen.',
    TOM_FIL: 'Filen er tom. Lagre malen i Excel og last den opp på nytt.',
    IKKE_EXCEL: 'Filen heter .xlsx, men er ikke en Excel-fil. Åpne malen i Excel og lagre den som Excel-arbeidsbok.',
    PASSORDBESKYTTET: 'Filen er beskyttet med passord. Fjern passordet i Excel og last den opp på nytt.',
    UVENTET_FEIL: 'Noe gikk galt under beregningen. Ingenting er vist eller lagret. Prøv igjen, eller last opp filen på nytt.',
  } satisfies Record<Filfeilkode | 'UVENTET_FEIL', string>,

  struktur: {
    ARK_MANGLER: (feil: Valideringsfeil): string =>
      `${feil.ark === 'MPS' ? arkTekst(feil.ark) : `Arket ${feil.ark}`} mangler. Legg det til slik det står i malen, med kolonneoverskriftene i rad 1.`,
    // Ordrett fra EXPERIENCE.md. Gjelder alltid arket Stykkliste.
    GAMMEL_MAL: (_feil: Valideringsfeil): string =>
      'Arket Stykkliste mangler. Filen ser ut til å følge en gammel mal (arkene Produkt og Komponenter). Last ned malen fra startsiden og flytt dataene over.',
    OVERSKRIFT_MANGLER: (feil: Valideringsfeil): string =>
      `${arkTekst(feil.ark)}, ${feil.sted.type === 'OVERSKRIFT' ? feil.sted.celle : 'rad 1'}: ${overskriftAarsak(feil)}`,
  },

  // Story 1.8: verdiene i Stykkliste (FR-3). Hele setningen: «Stykkliste, rad 9, Antall: …».
  stykkliste: medStedOgFelt(stykklisteAarsak),

  // Story 1.9: verdiene i MPS og Planlagte mottak (FR-3). Hele setningen, som i UJ-4.
  mpsOgMottak: medStedOgFelt(mpsOgMottakAarsak),

  // Story 1.12: feiloppsummeringen øverst på startsiden (FR-2, FR-4, UX-DR11, EXPERIENCE.md › Component Patterns).
  // Tabellen har kolonnene Ark, Sted, Felt og Feil. Feil er årsaken med stor forbokstav, uten ark, sted og felt.
  feiloppsummering: {
    /** Sidens h1 (EXPERIENCE.md › Voice and Tone). Antallet er alle feilene, også de som er slått sammen. */
    overskrift: (antall: number) =>
      `Filen har ${antall} feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.`,
    urort: 'Den lagrede kjøringen er ikke endret.',
    /** Sidetittelen begynner med «Feil:» når feiloppsummeringen vises (UX-DR11). */
    sidetittel: `Feil: ${felles.sidetittel(felles.visninger.nyKjoring)}`,
    strukturgruppe: 'Filen følger ikke malen',
    hoppetOverIngress: 'Disse kontrollene er hoppet over, så det kan være flere feil i filen:',
    /** «Planlagte mottak (2 feil)». MPS skrives «Prognostiserte behov (arket MPS)». */
    arkgruppe: (ark: Arknavn, antall: number) => `${arkTekst(ark)} (${antall} feil)`,
    kolonner: { ark: 'Ark', sted: 'Sted', felt: 'Felt', feil: 'Feil' },
    ark: arkTekst,
    /** Sted i tabellen: «rad 9» (Excel-raden), «uke 3», «H1» for en overskrift, «hele arket» eller «rad 4–53». */
    sted: (feil: Valideringsfeil, samlet: SamletFeil | null): string => {
      if (samlet !== null) return `${feil.sted.type === 'UKE' ? 'uke' : 'rad'} ${samlet.fra}–${samlet.til}`
      return feil.sted.type === 'OVERSKRIFT' ? feil.sted.celle : stedTekst(feil.sted)
    },
    felt: (feil: Valideringsfeil): string => feil.felt,
    /** Cellen Feil: årsaken med stor forbokstav, for eksempel «Uke 0 er før horisonten. …». */
    aarsak: (feil: Valideringsfeil, samlet: SamletFeil | null): string => storForbokstav(aarsakTekst(feil, samlet)),
    /** Hele setningen som i UJ-4: «Planlagte mottak, rad 4–53, Uke: må være et heltall (50 rader).» */
    melding: (feil: Valideringsfeil, samlet: SamletFeil | null): string => {
      if (samlet === null) return alleMaler[feil.kode](feil)
      return `${arkTekst(feil.ark)}, ${filfeilOgValidering.feiloppsummering.sted(feil, samlet)}, ${feil.felt}: ${aarsakTekst(feil, samlet)}`
    },
    /** Et ark som mangler: ingenting i det er kontrollert. */
    hoppetOverArk: (ark: Arknavn): string => `Verdiene i ${arkMedOrdetArket(ark)} er ikke kontrollert, fordi arket mangler.`,
    /** En kolonne som ikke er kontrollert, fordi overskriften mangler eller den avhenger av noe som mangler (FR-2). */
    hoppetOverKolonne: ({ ark, felt, fordi }: HoppetOverKontroll): string => {
      if (fordi.kode === 'OVERSKRIFT_MANGLER' && fordi.ark === ark && fordi.felt === felt) {
        return `Verdiene i kolonnen «${felt}» i ${arkMedOrdetArket(ark)} er ikke kontrollert, fordi overskriften mangler.`
      }
      const grunn =
        fordi.kode === 'ARK_MANGLER'
          ? `${arkMedOrdetArket(fordi.ark)} mangler`
          : `overskriften «${fordi.felt}» mangler i ${arkMedOrdetArket(fordi.ark)}`
      return `Kolonnen «${felt}» i ${arkMedOrdetArket(ark)} er ikke kontrollert, fordi ${grunn}.`
    },
  },
} as const

/** Flere like feil i samme kolonne på rader eller uker som følger hverandre (Story 1.12). */
export type SamletFeil = { fra: number; til: number; antall: number }

/**
 * Felles årsak for like feil som slås sammen til én linje (Story 1.12, UX-DR11). Bare kodene her kan slås
 * sammen. Meldinger som nevner et varenummer, andre rader eller en uke utenfor horisonten, står alltid
 * enkeltvis, så ingenting går tapt. Verdien i cellen nevnes ikke i en samlet linje. Den står i Excel.
 * Uten punktum: antallet settes inn bak, «… (50 rader).»
 */
export const samletAarsak = {
  NIVAA_UGYLDIG: 'må være 0, .1 eller ..2',
  NIVAA_FLERE_NIVAA_0: 'bare første rad kan ha nivå 0',
  NIVAA_2_UTEN_NIVAA_1_OVER: 'nivå ..2 må stå rett under en rad med nivå .1 eller ..2',
  VARENUMMER_MANGLER: 'varenummeret mangler',
  BESKRIVELSE_MANGLER: 'beskrivelsen mangler',
  ANTALL_MANGLER: 'antallet mangler',
  ANTALL_UGYLDIG: 'må være et heltall som er 1 eller mer',
  TYPE_UGYLDIG: 'må være Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv)',
  TYPE_FERDIGVARE_IKKE_NIVAA_0: 'Ferdigvare kan bare stå på nivå 0',
  LAGERBEHOLDNING_MANGLER: 'lagerbeholdningen mangler',
  LAGERBEHOLDNING_UGYLDIG: 'må være et heltall som er 0 eller mer',
  SIKKERHETSLAGER_MANGLER: 'sikkerhetslageret mangler',
  SIKKERHETSLAGER_UGYLDIG: 'må være et heltall som er 0 eller mer',
  LEDETID_MANGLER: 'ledetiden mangler',
  LEDETID_UGYLDIG: 'må være et helt antall uker som er 1 eller mer',
  MPS_ANTALL_UGYLDIG: 'må være et heltall som er 0 eller mer',
  MPS_UKE_ETTER_HULL: 'ukene er fylt ut etter en tom uke',
  MOTTAK_UKE_IKKE_HELTALL: 'må være et heltall',
  MOTTAK_ANTALL_UGYLDIG: 'må være et heltall som er 1 eller mer',
} as const satisfies Partial<Record<Valideringskode, string>>

/** Alle de fullstendige malene, én per kode (AD-9). */
const alleMaler: Record<Valideringskode, Aarsak> = {
  ...filfeilOgValidering.struktur,
  ...filfeilOgValidering.stykkliste,
  ...filfeilOgValidering.mpsOgMottak,
}

/** Årsaken uten ark, sted og felt. Strukturfeil om et ark som mangler, har hele teksten, fordi den er årsaken. */
function aarsakTekst(feil: Valideringsfeil, samlet: SamletFeil | null): string {
  if (samlet !== null && feil.kode in samletAarsak) {
    const enhet = feil.sted.type === 'UKE' ? 'uker' : 'rader'
    return `${samletAarsak[feil.kode as keyof typeof samletAarsak]} (${samlet.antall} ${enhet}).`
  }
  if (feil.kode in stykklisteAarsak) return stykklisteAarsak[feil.kode as keyof typeof stykklisteAarsak](feil)
  if (feil.kode in mpsOgMottakAarsak) return mpsOgMottakAarsak[feil.kode as keyof typeof mpsOgMottakAarsak](feil)
  if (feil.kode === 'OVERSKRIFT_MANGLER') return overskriftAarsak(feil)
  return alleMaler[feil.kode](feil)
}

/** «arket Stykkliste», «arket Planlagte mottak» eller «Prognostiserte behov (arket MPS)». */
function arkMedOrdetArket(ark: Arknavn): string {
  return ark === 'MPS' ? arkTekst(ark) : `arket ${ark}`
}

function storForbokstav(tekst: string): string {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1)
}

// --- Eksepsjoner ----------------------------------------------------------

/** Typenavnene fra ordbanken, i rekkefølgen i PRD §4.3. */
const TYPENAVN: Record<Eksepsjonskode, string> = {
  LEDETID_OVERSKRIDER_HORISONT: 'Ledetid overskrider horisont',
  BESTILLING_FORSINKET: 'Bestilling forsinket',
  BRUK_AV_SIKKERHETSLAGER: 'Bruk av sikkerhetslager',
  MOTTAK_FORSINKET: 'Mottak forsinket',
  KANSELLER_MOTTAK: 'Kanseller mottak',
}

/** En eksepsjon som tekst i de fire delene fra EXPERIENCE.md (variant B, UX-DR25). */
export type Eksepsjonstekst = {
  /** Typenavnet fra ordbanken, for eksempel «Bestilling forsinket». */
  typenavn: string
  /** «uke 1», eller «hele delen» for en eksepsjon som gjelder hele delen. */
  uke: string
  /** Typenavnet og uken, for eksempel «Bestilling forsinket · uke 1». */
  merke: string
  /** Én setning i vanlig språk som sier hva som er galt. Aldri bare typenavnet. */
  setning: string
  /** «Melding:» med opplysningene kravet krever. Handlingen står i første eller andre setning. */
  melding: string
  /** «Hvorfor:» med regelen og tallene satt inn. */
  hvorfor: string
}

/**
 * Tall i teksten (UX-DR2): hardt mellomrom (U+00A0) som tusenskille og ekte minus (U+2212). Heltall. Samme regel som
 * `formaterTall` i Story 2.6 (#38). Når den er på `main`, kan denne byttes ut med den.
 */
const tall = (verdi: number): string => {
  const heltall = String(Math.abs(verdi)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
  return verdi < 0 ? `\u2212${heltall}` : heltall
}
const ukerTekst = (n: number): string => `${tall(n)} ${n === 1 ? 'uke' : 'uker'}`

/** «Sete (200-010)», «Sete (200-010) og Rygg (200-011)» og «A, B og C». */
function delliste(deler: readonly { varenummer: string; beskrivelse: string }[]): string {
  const navn = deler.map((d) => `${d.beskrivelse} (${d.varenummer})`)
  return navn.length <= 1 ? (navn[0] ?? '') : `${navn.slice(0, -1).join(', ')} og ${navn[navn.length - 1]}`
}

/** Ordene for delene som kjøpes inn, og for ferdigvarer og delene som produseres selv (EXPERIENCE.md › Voice and Tone). */
function ordFor(delstype: Delstype) {
  return delstype === 'KJOPES_INN'
    ? {
        produksjon: false,
        sendtSetning: 'Bestillingen skulle vært sendt før uke 1',
        handling: (beskrivelse: string) => `Du må bestille ${beskrivelse} nå`,
        raskere: 'og bør avtale raskere levering hvis du kan',
        opp: 'så sikkerhetslageret fylles opp igjen',
        skulleVaert: 'skulle vært bestilt før uke 1',
        kommer: 'kommer tidligst i uke',
        varene: 'kommer varene tidligst i uke',
        nyOrdre: 'ny bestilling',
      }
    : {
        produksjon: true,
        sendtSetning: 'Produksjonen skulle vært startet før uke 1',
        handling: (beskrivelse: string) => `Du må starte produksjonen av ${beskrivelse} nå`,
        raskere: 'og bør prioritere den hvis du kan',
        opp: 'så sikkerhetslageret fylles opp igjen',
        skulleVaert: 'skulle vært satt i produksjon før uke 1',
        kommer: 'er ferdige tidligst i uke',
        varene: 'er varene ferdige tidligst i uke',
        nyOrdre: 'ny produksjonsordre',
      }
}

/**
 * Forklaringen på at resultattabellen viser et annet tall for forventet lagerbeholdning enn disponibel beholdning (FR-7).
 * Tabellen regner med at de forfalte mengdene kommer i tide (+ forfalt), og trekker fra mottak som er fremskyndet til uken
 * og ikke er kommet ennå (− R). Tallet kan derfor være både høyere og lavere enn disponibel beholdning.
 *
 * Er tallet fra tabellen kjent (`tabellverdi`, forventet lagerbeholdning i uken), sier forklaringen om det er høyere eller
 * lavere og hvorfor, og R er disponibel + forfalt − tabellverdi. Ellers sier den bare at tallet kan avvike.
 */
function tabellforklaring(uke: number, disponibel: number, forfalt: number, tabellverdi: number | undefined): string {
  if (tabellverdi === undefined) {
    return (
      `Tabellen viser forventet lagerbeholdning i uke ${uke}. Den regner med at de ${tall(forfalt)} kommer i tide, og trekker fra ` +
      `mottak som er fremskyndet til uken og ikke er kommet ennå. Tallet i tabellen kan derfor avvike fra ${tall(disponibel)}.`
    )
  }
  const ikkeKommet = disponibel + forfalt - tabellverdi
  const trekker = `de ${tall(ikkeKommet)} som er fremskyndet og ikke er kommet ennå`
  if (tabellverdi > disponibel) {
    return (
      `Tabellen viser ${tall(tabellverdi)} i uke ${uke}, høyere enn ${tall(disponibel)}, fordi den regner med at de ${tall(forfalt)} kommer i tide.` +
      (ikkeKommet > 0 ? ` Den trekker samtidig fra ${trekker}.` : '')
    )
  }
  if (tabellverdi < disponibel) {
    return (
      `Tabellen viser ${tall(tabellverdi)} i uke ${uke}, lavere enn ${tall(disponibel)}. Den regner med at de ${tall(forfalt)} kommer i tide, ` +
      `men trekker fra ${trekker}.`
    )
  }
  return (
    `Tabellen viser det samme tallet, ${tall(tabellverdi)}, i uke ${uke}: den regner med at de ${tall(forfalt)} kommer i tide, ` +
    `og trekker fra ${trekker}.`
  )
}

function lagMelding(e: Eksepsjon, tabellverdi: number | undefined): Pick<Eksepsjonstekst, 'setning' | 'melding' | 'hvorfor'> {
  const navn = `${e.beskrivelse} (${e.varenummer})`
  const ord = ordFor(e.delstype)
  switch (e.kode) {
    case 'BESTILLING_FORSINKET': {
      const sluttsetning =
        e.forsinker.type === 'LEVERANSE_TIL_KUNDE'
          ? 'Leveranse til kunde blir forsinket.'
          : `Produksjonen av ${delliste(e.forsinker.av)} blir forsinket.`
      const ledetid = e.tidligsteMottaksuke - 1
      return {
        setning: `${ord.sendtSetning}.`,
        melding:
          `Lageret for ${navn} blir ${tall(e.disponibel)} i uke ${e.uke}. ${ord.handling(e.beskrivelse)}, ${ord.raskere}: ` +
          `${tall(e.forfaltMengde)} ${e.beskrivelse} ${ord.skulleVaert}. De ${tall(e.forfaltMengde)} er lagt til forslaget på ${tall(e.frigivelseUke1)} i uke 1, ` +
          `men ${ord.kommer} ${e.tidligsteMottaksuke}. ${sluttsetning}`,
        hvorfor:
          `Disponibel beholdning i uke ${e.uke} er ${tall(e.disponibel)}, så behovet er større enn lageret og de planlagte mottakene. ` +
          `Nettobehovet ${ord.skulleVaert}, men planen starter i uke 1, og ledetiden er ${ukerTekst(ledetid)}. ` +
          `Derfor ${ord.varene} ${e.tidligsteMottaksuke} (uke 1 + ledetid ${tall(ledetid)}). ` +
          tabellforklaring(e.uke, e.disponibel, e.forfaltMengde, tabellverdi),
      }
    }
    case 'BRUK_AV_SIKKERHETSLAGER': {
      const ledetid = e.tidligsteMottaksuke - 1
      return {
        setning: `${ord.sendtSetning}, så sikkerhetslageret brukes.`,
        melding:
          `Sikkerhetslageret for ${navn} brukes i uke ${e.uke}: lageret blir ${tall(e.disponibel)}, under sikkerhetslageret på ${tall(e.sikkerhetslager)}. ` +
          `${ord.handling(e.beskrivelse)}, ${ord.opp}: ${tall(e.forfaltMengde)} ${e.beskrivelse} ${ord.skulleVaert}. ` +
          `De ${tall(e.forfaltMengde)} er lagt til forslaget på ${tall(e.frigivelseUke1)} i uke 1, men ${ord.kommer} ${e.tidligsteMottaksuke}.`,
        hvorfor:
          `Disponibel beholdning i uke ${e.uke} er ${tall(e.disponibel)}. Den er ikke under 0, men under sikkerhetslageret på ${tall(e.sikkerhetslager)}, ` +
          `og nettobehovet ${ord.skulleVaert}. Derfor ${ord.varene} ${e.tidligsteMottaksuke} (uke 1 + ledetid ${tall(ledetid)}). ` +
          tabellforklaring(e.uke, e.disponibel, e.forfaltMengde, tabellverdi),
      }
    }
    case 'MOTTAK_FORSINKET': {
      const under = e.sikkerhetslager > 0 && e.disponibelForFremskynding < e.sikkerhetslager ? `, under sikkerhetslageret på ${tall(e.sikkerhetslager)}` : ''
      // Hva som utløser behovet: lageret under 0, eller bare under sikkerhetslageret (nettobehovet er maks(0, SS − disponibel)).
      const behov =
        e.disponibelForFremskynding < 0
          ? `Lageret ville gått under 0 i uke ${e.uke} (disponibel beholdning ${tall(e.disponibelForFremskynding)}).`
          : `Lageret ville kommet under sikkerhetslageret på ${tall(e.sikkerhetslager)} i uke ${e.uke} (disponibel beholdning ${tall(e.disponibelForFremskynding)}).`
      const handling = ord.produksjon
        ? `Flytt produksjonen av mottaket på ${tall(e.antall)} fra uke ${e.mottaksuke} til uke ${e.uke}`
        : `Be leverandøren levere mottaket på ${tall(e.antall)} i uke ${e.uke} i stedet for uke ${e.mottaksuke}`
      return {
        setning: `Mottaket i uke ${e.mottaksuke} trengs allerede i uke ${e.uke}.`,
        melding:
          `Lageret for ${navn} blir ${tall(e.disponibelForFremskynding)} i uke ${e.uke}${under}, før mottaket kommer. ${handling}. ` +
          `Det lages ingen ${ord.nyOrdre} for behovet mottaket dekker.`,
        hvorfor:
          `${behov} ` +
          `Planen bruker et planlagt mottak før den foreslår en ${ord.nyOrdre}, så mottaket på ${tall(e.antall)} i uke ${e.mottaksuke} er regnet med i uke ${e.uke}. ` +
          `I tabellen står mottaket fortsatt i uke ${e.mottaksuke}.`,
      }
    }
    case 'LEDETID_OVERSKRIDER_HORISONT': {
      const sti = e.sti.map((d) => `${d.beskrivelse} ${tall(d.ledetid)}`).join(' + ')
      const lengde = e.ledetidFraFerdigproduktet === e.horisont ? 'like lang som' : 'lengre enn'
      return {
        setning: 'Planen er for kort til å vise alt som må bestilles nå.',
        melding:
          `Ledetiden fra ferdigproduktet er ${ukerTekst(e.ledetidFraFerdigproduktet)} (${sti}), ${lengde} horisonten på ${ukerTekst(e.horisont)}. ` +
          `Bruk en lengre horisont: behov etter uke ${e.horisont} som må bestilles nå, vises ikke. Delen mangler ikke. ` +
          `Eksepsjonen gjelder bare innenfor horisonten.`,
        // «Hvorfor:» bruker ikke «horisonten» (EXPERIENCE.md › Voice and Tone).
        hvorfor:
          `Ledetiden fra ferdigproduktet er summen av ledetidene langs den lengste stien, og her er den minst like lang som planen (${ukerTekst(e.horisont)}). ` +
          `En bestilling i uke 1 kommer tidligst i uke ${e.ledetidFraFerdigproduktet + 1}, etter siste uke i planen (uke ${e.horisont}). ` +
          `Eksepsjonen gjelder hele delen, uansett behov, og bare for ukene planen viser.`,
      }
    }
    case 'KANSELLER_MOTTAK': {
      const periode = e.uke === e.horisont ? `uke ${e.horisont}` : `uke ${e.uke}–${e.horisont}`
      return {
        setning: `Mottaket i uke ${e.uke} trengs ikke innenfor horisonten.`,
        melding:
          `Det planlagte mottaket på ${tall(e.antall)} i uke ${e.uke} trengs ikke innenfor horisonten (${periode}). ` +
          `Vurder å kansellere eller utsette det. Behov etter uke ${e.horisont} er ikke regnet med.`,
        hvorfor:
          `Uten mottaket blir det ikke nettobehov fra uke ${e.uke} til uke ${e.horisont}, og mottaket er ikke brukt til å dekke behov før det. ` +
          `Eksepsjonen gjelder bare ukene planen viser.`,
      }
    }
  }
}

export const eksepsjoner = {
  /** Typenavnene fra ordbanken. Resultattabellen, kritiske deler og meldingene bruker de samme. */
  typenavn: TYPENAVN,
  /**
   * Meldingen for én eksepsjon, i de fire delene fra EXPERIENCE.md (variant B, UX-DR25): typenavnet og uken, én setning i
   * vanlig språk, «Melding:» og «Hvorfor:». Kjernen gir bare koder og tall (AD-9), så all tekst lages her.
   * Ordlyden er Sebastians forslag fra EXPERIENCE.md og prøves i prøvetesten. Opplysningene kravene sier, skal alltid med.
   *
   * @param tabellverdi forventet lagerbeholdning i uken slik resultattabellen viser den (\`DelResultat.forventetLagerbeholdning\`),
   *   til Bestilling forsinket og Bruk av sikkerhetslager. Med den sier «Hvorfor:» om tabellen viser et høyere eller lavere tall enn
   *   disponibel beholdning, og hvorfor (fremskyndede mottak trekkes fra). Uten den sier teksten bare at tallet kan avvike (FR-7).
   */
  melding: (e: Eksepsjon, tabellverdi?: number): Eksepsjonstekst => {
    const uke = e.uke === null ? 'hele delen' : `uke ${e.uke}`
    return { typenavn: TYPENAVN[e.kode], uke, merke: `${TYPENAVN[e.kode]} · ${uke}`, ...lagMelding(e, tabellverdi) }
  },
  /** Bare setningen i vanlig språk, til listen over kritiske deler (Story 2.10). */
  setning: (e: Eksepsjon): string => lagMelding(e, undefined).setning,
} as const

// --- Forklaringer ---------------------------------------------------------
export const forklaringer = {} as const

// --- Resultat -------------------------------------------------------------
export const resultat = {
  utenKjoring: 'Det er ingen kjøring å vise. Resultatet finnes bare til siden lastes på nytt. Last opp filen på Ny kjøring.',
  // Kjøringslinjen og overskriftene (Story 1.11, UX-DR4, UX-DR13).
  /** Den skjulte h1-en, som får fokus etter Beregn. */
  overskrift: (beskrivelse: string) => `Resultat for ${beskrivelse}`,
  /** «Kontorstol Basic (100-002) – Resultat – COSI - MRP». */
  sidetittel: (beskrivelse: string, varenummer: string) =>
    felles.sidetittel(`${beskrivelse} (${varenummer}) – ${felles.visninger.resultat}`),
  horisont: (uker: number) => `Horisont: ${uker} ${uker === 1 ? 'uke' : 'uker'}`,
  kjort: (tidspunkt: string) => `Kjørt ${tidspunkt}`,
  lastOppNyFil: 'Last opp ny fil',
  // Midlertidig til beregningen er bygd (Epic 2, deferred-work.md). Resultat skal ikke se ut som en ferdig plan.
  ikkeBeregnet: [
    'Filen er lest og kontrollert, og den har ingen feil.',
    'Bestillingsplanen beregnes ikke ennå. Bestillingsforslag, kritiske deler og resultattabellen kommer i en senere versjon av appen.',
  ],
} as const

/** Tidspunktet som «13.11.2026 kl. 08:04» i nettleserens tidssone (UX-DR2). Tar ISO 8601-tekst. */
export function formaterTidspunkt(iso: string): string {
  const d = new Date(iso)
  const to = (n: number) => String(n).padStart(2, '0')
  return `${to(d.getDate())}.${to(d.getMonth() + 1)}.${d.getFullYear()} kl. ${to(d.getHours())}:${to(d.getMinutes())}`
}

// --- Lagring og eksport ---------------------------------------------------
export const lagringOgEksport = {} as const

// --- Kapasitet ------------------------------------------------------------
export const kapasitet = {} as const
