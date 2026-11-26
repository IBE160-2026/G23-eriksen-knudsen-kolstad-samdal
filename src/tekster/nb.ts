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
      // Antallene («59 bestillingsforslag, 4 kritiske deler») kommer når beregningen er bygd (Epic 2).
      // Til da sier meldingen ærlig at bare lesingen og kontrollen er gjort.
      ferdig: 'Kjøringen er ferdig. Filen er lest og har ingen feil. Bestillingsplanen beregnes ikke ennå.',
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
export const eksepsjoner = {} as const

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

  // Toppen av Resultat (Story 2.6, UX-DR14–UX-DR16).
  /** Seksjonene i fast rekkefølge (AD-14). Overskriftene er h2. */
  seksjoner: {
    kritiskeDeler: 'Kritiske deler',
    bestillingsforslag: 'Bestillingsforslag',
    resultattabell: 'Resultattabell',
  },
  seksjonsmenyNavn: 'Seksjoner i resultatet',
  /** Tilgjengelig navn på en knapp med antall: «Kritiske deler, 4». */
  seksjonsknapp: (navn: string, antall: number | null) => (antall === null ? navn : `${navn}, ${formaterTall(antall)}`),
  tallbokserNavn: 'Nøkkeltall for kjøringen',
  tallbokser: {
    kritiskeDeler: {
      tittel: 'Kritiske deler',
      forklaring: 'Deler der planen ikke går opp.',
      forklaringNull: 'Planen går opp for alle delene.',
    },
    forslagUke1: {
      tittel: 'Bestillingsforslag i uke 1',
      forklaring: 'Skal bestilles eller settes i produksjon denne uka.',
      forklaringNull: 'Ingenting skal bestilles eller settes i produksjon i uke 1.',
    },
    forslagIAlt: {
      tittel: 'Bestillingsforslag i alt',
      forklaring: 'Alle forslagene i horisonten.',
      forklaringNull: 'Kjøringen gir ingen bestillingsforslag.',
    },
    forslagForfalt: {
      tittel: 'Forslag med forfalt mengde',
      forklaring: 'Noe av mengden skulle vært bestilt før uke 1.',
      forklaringNull: 'Ingenting skulle vært bestilt før uke 1.',
    },
  },
  slikLeserDu: {
    overskrift: 'Slik leser du resultatet',
    kritiskeDeler: 'Kritiske deler er delene der planen ikke går opp. Start her.',
    bestillingsforslag: 'Bestillingsforslag viser hva du må bestille eller sette i produksjon, og i hvilken uke.',
    resultattabell: 'Resultattabellen viser hele planen per del og uke, med eksepsjonene markert der planen ikke går opp.',
  },

  // Resultattabellen (Story 2.7, UX-DR21–UX-DR24, FR-14–FR-16).
  tabell: {
    /** `<caption>`: ferdigproduktet og horisonten (FR-14). */
    bildetekst: (beskrivelse: string, varenummer: string, horisont: number) =>
      `Resultattabell for ${beskrivelse} (${varenummer}), horisont ${horisont} ${horisont === 1 ? 'uke' : 'uker'}`,
    ukeOrd: 'Uke',
    /** Radnavnene i rekkefølgen fra FR-14. */
    rader: {
      bruttobehov: 'Bruttobehov',
      planlagteMottak: 'Planlagte mottak',
      forventetLagerbeholdning: 'Forventet lagerbeholdning',
      nettobehov: 'Nettobehov',
      planlagteOrdremottak: 'Planlagte ordremottak',
      planlagteOrdrefrigivelser: 'Planlagte ordrefrigivelser',
    },
    delstyper: {
      FERDIGVARE: 'Ferdigvare',
      KJOPES_INN: 'Komponent (Kjøpes inn)',
      PRODUSERES_SELV: 'Komponent (Produseres selv)',
    } satisfies Record<Delstype, string>,
    /** Delens felt: kort for øyet, fullt navn for skjermleseren. */
    felt: {
      lager: (n: number) => ({ kort: `Lager ${formaterTall(n)}`, lang: `lagerbeholdning ${formaterTall(n)}` }),
      sikkerhetslager: (n: number) => ({ kort: `SS ${formaterTall(n)}`, lang: `sikkerhetslager ${formaterTall(n)}` }),
      ledetid: (n: number) => ({
        kort: `L ${formaterTall(n)}`,
        lang: `ledetid ${formaterTall(n)} ${n === 1 ? 'uke' : 'uker'}`,
      }),
      /** «Antall: 5 per 100-002». */
      antall: (antall: number, overordnet: string) => `Antall: ${formaterTall(antall)} per ${overordnet}`,
    },
    kritiskDel: 'Kritisk del',
    /** Typenavnene fra ordbanken, i rekkefølgen i PRD §4.3. */
    eksepsjonsnavn: {
      LEDETID_OVERSKRIDER_HORISONT: 'Ledetid overskrider horisont',
      BESTILLING_FORSINKET: 'Bestilling forsinket',
      BRUK_AV_SIKKERHETSLAGER: 'Bruk av sikkerhetslager',
      MOTTAK_FORSINKET: 'Mottak forsinket',
      KANSELLER_MOTTAK: 'Kanseller mottak',
    } satisfies Record<Eksepsjonskode, string>,
    /** Det tilgjengelige navnet på markøren: «Bestilling forsinket, uke 1» eller «…, hele delen» (FR-15). */
    markornavn: (navn: string, uke: number | null) => `${navn}, ${uke === null ? 'hele delen' : `uke ${uke}`}`,
    tegnforklaring: { navn: 'Tegnforklaring', kritiskDel: 'Kritisk del', valgtCelle: 'Valgt celle' },
    /**
     * Det skjermleseren leser når en celle får fokus (UX-DR22): del, rad, uke og verdi, for eksempel
     * «300-003 Hjul, Nettobehov, Uke 1, 50», med eksepsjonene til slutt.
     */
    celleNavn: (varenummer: string, beskrivelse: string, rad: string, uke: number, verdi: number, eksepsjoner: string[]) =>
      [`${varenummer} ${beskrivelse}`, rad, `Uke ${uke}`, formaterTall(verdi), ...eksepsjoner].join(', '),
    radnavnNavn: (varenummer: string, beskrivelse: string, rad: string) => `${varenummer} ${beskrivelse}, ${rad}`,
    feltNavn: (varenummer: string, beskrivelse: string, type: string, kritisk: boolean, eksepsjoner: string[]) =>
      [`${varenummer} ${beskrivelse}`, type, ...(kritisk ? ['Kritisk del'] : []), ...eksepsjoner].join(', '),
    filter: {
      bareKritiske: 'Vis bare kritiske deler',
      viser: (synlige: number, totalt: number) => `Viser ${formaterTall(synlige)} av ${formaterTall(totalt)} deler`,
      visAlle: 'Vis alle deler',
    },
  },
} as const

/**
 * Et heltall slik det skrives på siden (UX-DR2): hardt mellomrom (U+00A0) som tusenskille og ekte
 * minustegn «−» (U+2212). Desimaltegnet er komma. Sifrene står like brede i CSS (`tabular-nums`).
 */
export function formaterTall(verdi: number): string {
  if (!Number.isFinite(verdi)) return String(verdi)
  const [heltall = '0', desimaler] = String(Math.abs(verdi)).split('.')
  const gruppert = heltall.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const tekst = desimaler === undefined ? gruppert : `${gruppert},${desimaler}`
  return verdi < 0 && Number(tekst.replace(/ /g, '').replace(',', '.')) !== 0 ? `−${tekst}` : tekst
}

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
