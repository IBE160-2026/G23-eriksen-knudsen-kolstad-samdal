// Delte typer for COSI - MRP (Story 1.2, arkitektur AD-3).
//
// Regler for denne fila (AD-3):
// - Alle delte typer står her. Ingen lager egne versjoner av dem andre steder.
// - En endring skjer i en egen pull request som endrer denne fila først. Den flettes bare når
//   koordinatoren (Idun) og minst én som bruker typene, har godkjent den.
// - Fila importerer ingenting, og kjernen er ren (AD-2).
//
// Konvensjoner (AD-4):
// - Varenummer og nivå er tekst uten mellomrom foran og bak. Varenummer tolkes aldri som tall.
// - Uker er nummerert 1 til H. En serie per uke er en liste med lengde H, der plass i er uke i + 1.
//   Det finnes aldri en uke 0 i resultatet. Forfalt mengde er et eget felt.
// - Alle mengder er heltall. Bare disponibel beholdning og forventet lagerbeholdning kan være negative.
// - Planlagte mottak er enkeltlinjer med Excel-rad og legges ikke sammen på forhånd.
//
// Kjernen gir koder og tall, aldri ferdig tekst (AD-9). All tekst lages i src/tekster/.
//
// ---------------------------------------------------------------------------
// Godkjent av koordinatoren (Idun) 23.11.2026
// ---------------------------------------------------------------------------
// Typene bygger på PRD-en, arkitekturen (AD-3–AD-11) og epics.md (Story 1.2). Disse valgene i
// Story 1.2 er godkjent:
//   - Filfeilkoden PASSORDBESKYTTET. Ført inn i arkitekturen (AD-5 og kap. 12).
//   - «Borte»-linjer i sammenligningen og eksporten viser bare typenavnet til eksepsjonen, laget i
//     tekster/. Utdraget (AD-10) endres ikke.
//   - Navnet Utfall. UventetFeil står her, fordi både worker-en og styringen bruker den.
//   - Tidspunkt er ISO 8601-tekst. Navnene i Lagringsstatus.
//   - Navnene på de 40 valideringskodene, og at hver del av en regel har sin egen kode.
//   - Kodene i Delstype og Bestillingsforslag.art (i stedet for teksten fra Excel).
//   - Formen på RaaArk: ett felt per ark, kolonnebokstav i overskrifter, alleArk og tomRadMedInnholdUnder.
//   - Feilsted, feltene varenummer og andreRader i Valideringsfeil, HoppetOverKontroll og Valideringsresultat.
//   - forfaltMengde er 0 (ikke null) når ingenting er forfalt.
//   - beskrivelse og delstype på alle eksepsjoner (så teksten kan lages fra eksepsjonen alene, AD-9),
//     og sikkerhetslager i MOTTAK_FORSINKET (står i fasitmeldingene).
//   - To felt i Utregning i tillegg til AD-8: prognostiserteBehov og fremskyndetIkkeKommet.

// ===========================================================================
// Felles
// ===========================================================================

/** Svar som kan feile (AD-5). Ingen funksjon kaster unntak for feil i brukerens data. */
export type Utfall<T, F> = { ok: true; verdi: T } | { ok: false; feil: F }

/** En lagret verdi i en celle, slik Excel-delen leser den (AD-15: verdier, aldri formler). */
export type Celleverdi = string | number | boolean | null

/** Arkene appen leser (FR-2). */
export const ARKNAVN = ['Stykkliste', 'MPS', 'Planlagte mottak'] as const
export type Arknavn = (typeof ARKNAVN)[number]

/** Kolonneoverskriftene i Excel-malen, nøyaktig som i malen (FR-2, AD-15). */
export const STYKKLISTE_KOLONNER = [
  'Nivå',
  'Varenummer',
  'Beskrivelse',
  'Antall',
  'Type',
  'Lagerbeholdning',
  'Sikkerhetslager',
  'Ledetid (uker)',
] as const
export const MPS_KOLONNER = ['Uke', 'Antall ferdigprodukter'] as const
export const PLANLAGTE_MOTTAK_KOLONNER = ['Varenummer', 'Uke', 'Antall'] as const

export type StykklisteKolonne = (typeof STYKKLISTE_KOLONNER)[number]
export type MpsKolonne = (typeof MPS_KOLONNER)[number]
export type PlanlagteMottakKolonne = (typeof PLANLAGTE_MOTTAK_KOLONNER)[number]
export type Kolonnenavn = StykklisteKolonne | MpsKolonne | PlanlagteMottakKolonne

/** Nivå i stykklisten (FR-3). Lagret som tekst (AD-4). */
export type Nivaa = '0' | '.1' | '..2'

/**
 * Typen til en del (FR-3), som kode (AD-9). Teksten i Excel og i appen lages i tekster/:
 * FERDIGVARE = «Ferdigvare», KJOPES_INN = «Komponent (Kjøpes inn)»,
 * PRODUSERES_SELV = «Komponent (Produseres selv)».
 */
export const DELSTYPER = ['FERDIGVARE', 'KJOPES_INN', 'PRODUSERES_SELV'] as const
export type Delstype = (typeof DELSTYPER)[number]

/** Valget under «Hva vil du beregne?» (FR-30). */
export const VALG = ['BESTILLINGSPLAN', 'PRODUKSJONSKAPASITET', 'BEGGE'] as const
export type Valg = (typeof VALG)[number]

/** Varenummer og beskrivelse, brukt der en del bare skal nevnes. */
export type DelNavn = { varenummer: string; beskrivelse: string }

// ===========================================================================
// Lesing av Excel-filen (Excel-delen → kjernen)
// ===========================================================================

/** Én rad i et ark, med rå celleverdier og Excel-radnummeret (AD-3, AD-15). */
export type RaaRad<K extends Kolonnenavn> = {
  excelRad: number
  /** Bare kolonnene fra malen. Kontroll-kolonnen og hjelpekolonnene leses ikke (FR-2). */
  celler: Partial<Record<K, Celleverdi>>
}

/** Ett ark slik Excel-delen fant det. En overskrift som mangler, har verdien null (FR-2). */
export type RaaArkInnhold<K extends Kolonnenavn> = {
  /** Kolonnebokstaven der overskriften står, for eksempel «H», eller null hvis den mangler. */
  overskrifter: Record<K, string | null>
  rader: RaaRad<K>[]
}

/**
 * Hele filen slik Excel-delen leste den (AD-3, AD-15). Et ark som mangler, er null.
 * Excel-delen avgjør aldri om en verdi er feil. Det gjør valideringen.
 */
export type RaaArk = {
  filnavn: string
  /** Navnene på alle arkene i filen, så valideringen kan kjenne igjen den gamle malen (FR-2). */
  alleArk: string[]
  stykkliste:
    | (RaaArkInnhold<StykklisteKolonne> & {
        /**
         * Stykklisten slutter ved første rad der både Nivå og Varenummer er tomme (FR-3, AD-15).
         * Står det noe i malens kolonner under den raden, er dette radnummeret til den tomme raden.
         * Ellers null. Radene under er ikke med i `rader`.
         */
        tomRadMedInnholdUnder: number | null
      })
    | null
  mps: RaaArkInnhold<MpsKolonne> | null
  planlagteMottak: RaaArkInnhold<PlanlagteMottakKolonne> | null
}

// ===========================================================================
// Feil i hele filen (NFR-9, AD-5)
// ===========================================================================

/**
 * Kodene for feil i hele filen. Hver kode får sin egen melding (NFR-9, EXPERIENCE.md › Feil i hele filen).
 * FR-1 gir «ikke .xlsx», og AD-5 gir resten. PASSORDBESKYTTET kom til i Story 1.2 og er ført inn
 * i arkitekturen (AD-5 og kap. 12, 23.11.2026).
 */
export const FILFEILKODER = ['IKKE_XLSX', 'TOM_FIL', 'SKADET_FIL', 'IKKE_EXCEL', 'PASSORDBESKYTTET'] as const
export type Filfeilkode = (typeof FILFEILKODER)[number]
export type Filfeil = { kode: Filfeilkode }

/**
 * En uventet feil i lesing, validering eller beregning (AD-5, AD-12). Gir ingen resultat og ingen lagring.
 * Står her, fordi både worker-en (Story 1.10) og styringen bruker den.
 */
export type UventetFeil = { kode: 'UVENTET_FEIL' }

// ===========================================================================
// Validering (FR-2, FR-3, FR-4)
// ===========================================================================

/**
 * Én kode per regel i FR-2 og FR-3. Kodene følger tabellen i FR-3 og testdata/validering/README.md.
 * Der regelen har flere deler (for eksempel «fylt ut første gang, tom de neste»), har hver del sin kode,
 * så tekster/ kan gi en presis melding (AD-9).
 */
export const VALIDERINGSKODER = [
  // FR-2: malens struktur
  'ARK_MANGLER', // V-F01
  'GAMMEL_MAL', // V-F03: arkene Produkt og Komponenter, arket Stykkliste mangler
  'OVERSKRIFT_MANGLER', // V-F02, V-F06

  // FR-3: Stykkliste › Rader
  'RADER_IKKE_SAMMENHENGENDE', // V-S01: innhold under første tomme rad
  'RADER_FOR_MANGE', // V-S03: mer enn 1000 rader
  'RADER_INGEN_NIVAA_1', // V-S02: minst én rad med nivå .1

  // FR-3: Stykkliste › Nivå
  'NIVAA_UGYLDIG', // V-S04: 0, .1 eller ..2
  'NIVAA_FORSTE_RAD_IKKE_0', // V-S05
  'NIVAA_FLERE_NIVAA_0', // V-S06
  'NIVAA_2_UTEN_NIVAA_1_OVER', // V-S07: ..2 står rett under .1 eller ..2

  // FR-3: Stykkliste › Varenummer
  'VARENUMMER_MANGLER', // V-S08
  'VARENUMMER_UNDER_SEG_SELV', // V-S09

  // FR-3: Stykkliste › Beskrivelse
  'BESKRIVELSE_MANGLER', // V-S10
  'BESKRIVELSE_ULIK', // V-S11: lik for alle rader med samme varenummer

  // FR-3: Stykkliste › Antall
  'ANTALL_FYLT_UT_FOR_NIVAA_0', // V-S12
  'ANTALL_MANGLER', // V-S13
  'ANTALL_UGYLDIG', // V-S14 (0), V-S15 (1,5), V-S16 («fem»): heltall ≥ 1

  // FR-3: Stykkliste › Type
  'TYPE_UGYLDIG', // V-S17: en av de tre typene
  'TYPE_FERDIGVARE_IKKE_NIVAA_0', // V-S18
  'TYPE_NIVAA_0_IKKE_FERDIGVARE', // V-S19
  'TYPE_ULIK', // V-S20: lik for alle rader med samme varenummer
  'TYPE_KJOPES_INN_HAR_UNDERDELER', // V-S21

  // FR-3: Stykkliste › Underdeler
  'UNDERDELER_ULIKE', // V-S22: nevner varenummeret og begge radene

  // FR-3: Stykkliste › Lagerbeholdning og Sikkerhetslager: heltall ≥ 0, fylt ut første gang, tom de neste
  'LAGERBEHOLDNING_UGYLDIG', // V-S23
  'LAGERBEHOLDNING_MANGLER', // V-S25
  'LAGERBEHOLDNING_FYLT_UT_SENERE', // V-S26
  'SIKKERHETSLAGER_UGYLDIG', // V-S24
  'SIKKERHETSLAGER_MANGLER', // samme regel som lagerbeholdning (FR-3)
  'SIKKERHETSLAGER_FYLT_UT_SENERE', // samme regel som lagerbeholdning (FR-3)

  // FR-3: Stykkliste › Ledetid (uker): heltall ≥ 1 (≥ 0 for nivå 0), fylt ut første gang, tom de neste
  'LEDETID_UGYLDIG', // V-S27
  'LEDETID_MANGLER', // V-S28
  'LEDETID_FYLT_UT_SENERE', // V-S29

  // FR-3: MPS › Antall ferdigprodukter
  'MPS_ANTALL_UGYLDIG', // V-M01 (−5), V-M04 («tretti»), V-M05 (30,5): heltall ≥ 0
  'MPS_UKE_ETTER_HULL', // V-M02
  'MPS_HORISONT_UGYLDIG', // V-M03: horisonten må være 8–12 uker

  // FR-3: Planlagte mottak
  'MOTTAK_VARENUMMER_UKJENT', // V-P01: finnes i Stykkliste
  'MOTTAK_UKE_IKKE_HELTALL', // uke er et heltall (FR-3)
  'MOTTAK_UKE_UTENFOR_HORISONT', // V-P02 (uke 0), V-P03 (uke 11): fra 1 til H
  'MOTTAK_ANTALL_UGYLDIG', // V-P04: heltall ≥ 1
] as const
export type Valideringskode = (typeof VALIDERINGSKODER)[number]

/** Hvor en valideringsfeil er. Valideringsfilenes README bruker celle, rad, uke eller hele arket. */
export type Feilsted =
  | { type: 'CELLE'; celle: string; excelRad: number } // for eksempel D9
  | { type: 'RAD'; excelRad: number } // for eksempel V-S01, rad 9
  | { type: 'UKE'; uke: number } // arket MPS, for eksempel uke 3
  | { type: 'OVERSKRIFT'; celle: string } // for eksempel H1
  | { type: 'ARK' } // hele arket mangler

/** Én valideringsfeil: kode, ark, sted, felt og verdi, men ingen ferdig tekst (FR-4, AD-9). */
export type Valideringsfeil = {
  kode: Valideringskode
  ark: Arknavn
  sted: Feilsted
  /** Kolonnen feilen gjelder, eller «Rader», «Underdeler» eller «Ark» når den gjelder noe annet. */
  felt: Kolonnenavn | 'Rader' | 'Underdeler' | 'Ark'
  /** Verdien i cellen, når feilen gjelder en verdi. */
  verdi?: Celleverdi
  /** Varenummeret feilen gjelder, når regelen handler om et varenummer (for eksempel V-S11, V-S20, V-S22). */
  varenummer?: string
  /** Andre rader feilen gjelder, for eksempel begge forekomstene i V-S22 (FR-3). */
  andreRader?: number[]
}

/** En kontroll som er hoppet over fordi et ark eller en kolonne mangler (FR-2, Story 1.6). */
export type HoppetOverKontroll = {
  ark: Arknavn
  felt: Kolonnenavn
  fordi: { kode: 'ARK_MANGLER'; ark: Arknavn } | { kode: 'OVERSKRIFT_MANGLER'; ark: Arknavn; felt: Kolonnenavn }
}

/** Svaret fra valideringen når filen har feil (FR-2, FR-4, Story 1.6). */
export type Valideringsresultat = {
  feil: Valideringsfeil[]
  hoppetOver: HoppetOverKontroll[]
}

// ===========================================================================
// Kontrollerte data (valideringen → beregningen)
// ===========================================================================

/** Én kontrollert rad i stykklisten (FR-3, AD-4). */
export type Stykklisterad = {
  excelRad: number
  nivaa: Nivaa
  varenummer: string
  beskrivelse: string
  /** Tom (null) for nivå 0 (FR-3). */
  antall: number | null
  type: Delstype
  /** Fylt ut første gang varenummeret står, ellers null (FR-3). Det samme gjelder SS og ledetid. */
  lagerbeholdning: number | null
  sikkerhetslager: number | null
  ledetid: number | null
}

/** Et planlagt mottak, som enkeltlinje med Excel-rad (AD-4). */
export type PlanlagtMottak = {
  varenummer: string
  uke: number
  antall: number
  excelRad: number
}

/** Kontrollerte data fra en fil uten valideringsfeil (AD-3, AD-4). */
export type Inndata = {
  stykkliste: Stykklisterad[]
  /** Antall sammenhengende utfylte uker fra uke 1, 8–12 (FR-3). */
  horisont: number
  /** Prognostiserte behov per uke, lengde H. */
  prognostiserteBehov: number[]
  planlagteMottak: PlanlagtMottak[]
}

// ===========================================================================
// Stykklistestrukturen (AD-6)
// ===========================================================================

/** Én forekomst av en del i stykklisten, med underdelene rett under den (FR-3 › Underdeler). */
export type Forekomst = {
  excelRad: number
  nivaa: Nivaa
  /** Varenummeret til den overordnede delen, eller null for ferdigproduktet. */
  overordnet: string | null
  antall: number | null
  underdeler: { varenummer: string; antall: number; excelRad: number }[]
}

/** Én unik del i strukturen. Like varenumre er slått sammen (AD-6). */
export type StrukturDel = {
  varenummer: string
  beskrivelse: string
  type: Delstype
  /** Nivået der delen står første gang, som vises i tabellen (FR-16). */
  nivaa: Nivaa
  /** Fra første rad med varenummeret (FR-28). */
  lagerbeholdning: number
  sikkerhetslager: number
  ledetid: number
  /** Overordnede deler med antall per enhet (FR-5). */
  overordnede: { varenummer: string; antall: number }[]
  forekomster: Forekomst[]
  /** Største nivåtall delen står på (AD-6). */
  lavnivaakode: number
  /** Lengste sum av ledetid fra ferdigproduktet ned til og med delen (FR-9). */
  ledetidFraFerdigproduktet: number
  /** Stien som gir ledetiden fra ferdigproduktet, fra ferdigproduktet til delen (FR-9: meldingen oppgir stien). */
  stiForLedetid: string[]
  /** Produktet av antallene langs stien, summert over alle stedene delen står (FR-31). */
  antallPerFerdigprodukt: number
}

export type Struktur = {
  /** Unike deler i stykklisterekkefølge. En felles del står der den står første gang (FR-16). */
  deler: StrukturDel[]
  /** Varenumrene etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge (AD-6). */
  beregningsrekkefolge: string[]
}

// ===========================================================================
// Beregningen (AD-7, AD-8)
// ===========================================================================

/** Tallene bak forklaringen av én del og én uke (AD-8, FR-18). Alle mengder er for denne uken. */
export type Utregning = {
  uke: number
  /** Forventet lagerbeholdning forrige uke pluss fremskyndede mottak som ikke er kommet (FR-6). Lagerbeholdningen for uke 1. */
  beholdningForrigeUke: number
  /** Planlagte mottak i uken, uten mottak som alt er fremskyndet til en tidligere uke (FR-6). */
  planlagteMottak: number
  bruttobehov: number
  /** Ferdigproduktet: prognostiserte behov i uken. Ellers null (FR-5). Tillegg til AD-8. */
  prognostiserteBehov: number | null
  /** Bruttobehovet fordelt på overordnede deler: frigivelse × antall (FR-5, FR-18, FR-28). */
  bruttobehovFra: { varenummer: string; frigivelse: number; antall: number }[]
  disponibelForFremskynding: number
  disponibelEtterFremskynding: number
  sikkerhetslager: number
  nettobehov: number
  /** Mottak som er fremskyndet til denne uken, med uken de er lagt inn i (FR-6). */
  fremskyndedeMottak: { mottaksuke: number; antall: number; excelRad: number }[]
  /** Fremskyndede mottak som er regnet med, men ikke er kommet ennå (FR-6, FR-7). Tillegg til AD-8. */
  fremskyndetIkkeKommet: number
  /** Den delen av planlagt ordremottak som skulle vært frigitt før uke 1 (FR-8). 0 når ingenting er forfalt. */
  forfaltMengde: number
}

/** De seks radene i resultattabellen for én del (FR-14), og tallene bak forklaringen (AD-8). */
export type DelResultat = {
  del: StrukturDel
  /** Alle seriene har lengde H. */
  bruttobehov: number[]
  planlagteMottak: number[]
  forventetLagerbeholdning: number[]
  nettobehov: number[]
  planlagteOrdremottak: number[]
  planlagteOrdrefrigivelser: number[]
  /** Forfalt mengde som er lagt i frigivelsen i uke 1 (FR-8, AD-4). 0 når ingenting er forfalt. */
  forfaltMengde: number
  /** Én per uke, lengde H. */
  utregning: Utregning[]
  /** En del med minst én eksepsjon er kritisk (FR-13). */
  kritisk: boolean
}

/** Et bestillingsforslag (FR-17, arket Bestillingsforslag i fasitene). */
export type Bestillingsforslag = {
  varenummer: string
  beskrivelse: string
  frigivelsesuke: number
  mengde: number
  /** 0 når ingenting er forfalt. */
  forfaltMengde: number
  /** Innkjøp for Komponent (Kjøpes inn). Produksjonsordre for Ferdigvare og Komponent (Produseres selv) (FR-17). */
  art: 'INNKJOP' | 'PRODUKSJONSORDRE'
}

// ===========================================================================
// Eksepsjoner (FR-9–FR-13, FR-29, AD-9)
// ===========================================================================

/** Eksepsjonskodene i rekkefølgen i PRD §4.3, som også er sorteringsrekkefølgen (arkitektur kap. 4). */
export const EKSEPSJONSKODER = [
  'LEDETID_OVERSKRIDER_HORISONT',
  'BESTILLING_FORSINKET',
  'BRUK_AV_SIKKERHETSLAGER',
  'MOTTAK_FORSINKET',
  'KANSELLER_MOTTAK',
] as const
export type Eksepsjonskode = (typeof EKSEPSJONSKODER)[number]

/** Felles for alle eksepsjonene. Beskrivelse og type trengs for at teksten kan lages fra eksepsjonen alene (AD-9). */
type EksepsjonFelles = {
  varenummer: string
  beskrivelse: string
  delstype: Delstype
}

/** Opplysningene om forfalt mengde som FR-10 og FR-11 krever. */
type ForfaltFrigivelse = {
  /** Disponibel beholdning etter at mottak er fremskyndet til uken (FR-10). */
  disponibel: number
  forfaltMengde: number
  /** Uken frigivelsen skulle vært gjort: t − L, alltid ≤ 0. Teksten skriver «før uke 1» (EXPERIENCE.md). */
  skulleFrigis: number
  /** Total planlagt ordrefrigivelse i uke 1, med den forfalte mengden. */
  frigivelseUke1: number
  /** 1 + L. */
  tidligsteMottaksuke: number
}

export type Eksepsjon =
  | (EksepsjonFelles & {
      kode: 'LEDETID_OVERSKRIDER_HORISONT'
      /** Gjelder hele delen (uke «–»). */
      uke: null
      ledetidFraFerdigproduktet: number
      /** Stien fra ferdigproduktet til delen, med ledetiden for hver del (FR-9). */
      sti: (DelNavn & { ledetid: number })[]
      horisont: number
    })
  | (EksepsjonFelles &
      ForfaltFrigivelse & {
        kode: 'BESTILLING_FORSINKET'
        uke: number
        /**
         * Hva som blir forsinket (FR-10): leveransen til kunde for ferdigproduktet, delene på nivå .1
         * og en felles del som også står rett under ferdigproduktet. Ellers produksjonen av alle de overordnede delene.
         */
        forsinker: { type: 'LEVERANSE_TIL_KUNDE' } | { type: 'PRODUKSJON'; av: DelNavn[] }
      })
  | (EksepsjonFelles &
      ForfaltFrigivelse & {
        kode: 'BRUK_AV_SIKKERHETSLAGER'
        uke: number
        sikkerhetslager: number
      })
  | (EksepsjonFelles & {
      kode: 'MOTTAK_FORSINKET'
      /** Uken mottaket må fremskyndes til. */
      uke: number
      mottaksuke: number
      antall: number
      excelRad: number
      /** Disponibel beholdning før mottaket er fremskyndet (FR-10, FR-12). */
      disponibelForFremskynding: number
      /** Står i fasitmeldingene («under sikkerhetslager 10»), i tillegg til FR-12. */
      sikkerhetslager: number
    })
  | (EksepsjonFelles & {
      kode: 'KANSELLER_MOTTAK'
      /** Mottaksuken. */
      uke: number
      antall: number
      excelRad: number
      /** Meldingen sier at mottaket ikke trengs fra mottaksuken til uke H (FR-29). */
      horisont: number
    })

// ===========================================================================
// Resultatet av beregningen (AD-8)
// ===========================================================================

/** Alt bestillingsplanen viser, ferdig sortert (AD-8, arkitektur kap. 4). */
export type Resultat = {
  /** I stykklisterekkefølge. En felles del står der den står første gang (FR-14, FR-16). */
  deler: DelResultat[]
  /** Sortert på frigivelsesuke og så stykklisterekkefølge (FR-17). */
  bestillingsforslag: Bestillingsforslag[]
  /** Sortert på stykklisterekkefølge, uke («–» først) og så EKSEPSJONSKODER (kap. 4). */
  eksepsjoner: Eksepsjon[]
  /** Varenumrene til de kritiske delene, i stykklisterekkefølge (FR-13, FR-16). */
  kritiskeDeler: string[]
}

// ===========================================================================
// Produksjonskapasitet (FR-30–FR-34)
// ===========================================================================

export type Kapasitetsrad = 'FRA_LAGER' | 'MED_PLANLAGTE_MOTTAK'

/** En del som ikke kan dekkes når behovet er N + 1 ferdigprodukter (FR-33). */
export type BegrensendeDel = DelNavn & {
  rad: Kapasitetsrad
  uke: number
  /** For lite på lager og i planlagte mottak, eller at en ordre måtte vært frigitt før uke 1. */
  aarsak: 'LAGER' | 'LEDETID'
}

/** Grunnlaget per del i kapasitetspanelet (FR-34). */
export type KapasitetGrunnlag = DelNavn & {
  type: Delstype
  lagerbeholdning: number
  sikkerhetslager: number
  /** maks(0, lagerbeholdning − SS) (FR-31). */
  ledig: number
  ledetid: number
  /** Planlagte mottak per uke, lengde H. */
  planlagteMottak: number[]
}

export type Kapasitet = {
  /** Kapasiteten per uke fra lager, lengde H (FR-32). */
  fraLager: number[]
  /** Kapasiteten per uke med planlagte mottak, lengde H (FR-32). */
  medPlanlagteMottak: number[]
  /** Alle begrensende deler per rad og uke. To deler med samme laveste verdi står begge (FR-33). */
  begrensende: BegrensendeDel[]
  grunnlag: KapasitetGrunnlag[]
}

// ===========================================================================
// Lagring og sammenligning (AD-10, AD-11)
// ===========================================================================

/** Utdraget som lagres per ferdigprodukt (AD-10). Excel-filen og resultattabellen lagres aldri. */
export type LagretKjoring = {
  schemaVersjon: 1
  ferdigprodukt: DelNavn
  /** Tidspunktet for kjøringen som ISO 8601-tekst. */
  tidspunkt: string
  deler: DelNavn[]
  bestillingsforslag: { varenummer: string; frigivelsesuke: number; mengde: number }[]
  /** En eksepsjon kjennes igjen på varenummer, uke og type (FR-20). uke er null for hele delen. */
  eksepsjoner: { varenummer: string; uke: number | null; kode: Eksepsjonskode }[]
}

/** Endringstypene i sammenligningen (AD-11). Teksten («Nytt», «Ny», «Endret mengde», «Fjernet», «Borte») lages i tekster/. */
export const ENDRINGSKODER = ['NY', 'ENDRET_MENGDE', 'FJERNET', 'BORTE'] as const
export type Endringskode = (typeof ENDRINGSKODER)[number]

/** Gruppene i fast rekkefølge (AD-11). */
export const SAMMENLIGNINGSGRUPPER = ['BESTILLINGSFORSLAG', 'EKSEPSJON', 'DEL'] as const
export type Sammenligningsgruppe = (typeof SAMMENLIGNINGSGRUPPER)[number]

/** Én linje i sammenligningen, som arket Sammenligning i testeksempel-03-fasit.xlsx (FR-20, FR-23). */
export type Sammenligningslinje =
  // Et bestillingsforslag kjennes igjen på varenummer og frigivelsesuke (AD-11). uke er frigivelsesuken.
  | { gruppe: 'BESTILLINGSFORSLAG'; endring: 'NY'; varenummer: string; uke: number; mengdeEtter: number }
  | {
      gruppe: 'BESTILLINGSFORSLAG'
      endring: 'ENDRET_MENGDE'
      varenummer: string
      uke: number
      mengdeFor: number
      mengdeEtter: number
    }
  | { gruppe: 'BESTILLINGSFORSLAG'; endring: 'FJERNET'; varenummer: string; uke: number; mengdeFor: number }
  // Sammenligningen lages fra to utdrag (AD-11), så linjen har bare det utdraget har.
  // Meldingen til en ny eksepsjon finnes i den nye kjøringens Resultat (samme varenummer, uke og kode).
  | { gruppe: 'EKSEPSJON'; endring: 'NY'; varenummer: string; uke: number | null; kode: Eksepsjonskode }
  | {
      gruppe: 'EKSEPSJON'
      endring: 'BORTE'
      varenummer: string
      uke: number | null
      kode: Eksepsjonskode
      // Meldingen på en «Borte»-linje er bare typenavnet til eksepsjonen, laget i tekster/
      // (godkjent av koordinatoren 23.11.2026). Utdraget lagrer bare varenummer, uke og type
      // (AD-10), og testene sammenligner ikke ordlyden (AD-16).
    }
  | { gruppe: 'DEL'; endring: 'NY' | 'FJERNET'; varenummer: string; beskrivelse: string }

/** Endringslinjene i fast rekkefølge (AD-11). Ingen linjer betyr «ingen endringer» (FR-20). */
export type Sammenligning = { linjer: Sammenligningslinje[] }

// ===========================================================================
// Kjøringen (AD-3, AD-12)
// ===========================================================================

/**
 * Om utdraget ble lagret (AD-10, FR-30). Er lagringen blokkert eller full, vises kjøringen med en melding.
 * En kjøring med bare produksjonskapasitet lagres ikke.
 */
export type Lagringsstatus = 'LAGRET' | 'IKKE_LAGRET_BLOKKERT' | 'IKKE_LAGRET_FULL' | 'IKKE_LAGRET_BARE_KAPASITET'

/** Alt UI-et viser etter én kjøring (AD-3, AD-12). */
export type Kjoring = {
  valg: Valg
  filnavn: string
  /** Settes i styringen, ikke i kjernen (AD-2). ISO 8601-tekst. */
  tidspunkt: string
  ferdigprodukt: DelNavn
  horisont: number
  /** Null når bare produksjonskapasiteten er valgt (FR-30). */
  resultat: Resultat | null
  /** Null når bare bestillingsplanen er valgt (FR-30). */
  kapasitet: Kapasitet | null
  /** Null når det ikke finnes en tidligere kjøring for ferdigproduktet, eller bestillingsplanen ikke er valgt (FR-20). */
  sammenligning: Sammenligning | null
  lagring: Lagringsstatus
}
