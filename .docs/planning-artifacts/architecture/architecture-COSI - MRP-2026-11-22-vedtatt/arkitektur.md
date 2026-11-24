---
title: 'COSI - MRP: arkitektur'
type: architecture
status: vedtatt
approved: 'Vedtatt av gruppen G23 2026-11-22'
created: '2026-11-22'
updated: '2026-11-22'
binds: [FR-1–FR-34, NFR-1–NFR-11]
sources:
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/prd.md (final, oppdatert 22.11)'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/addendum.md'
  - '.docs/ordbank.md (oppdatert 22.11)'
  - '.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-22/DESIGN.md og EXPERIENCE.md (felles, 22.11)'
  - '.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/'
  - 'testdata/'
---

# Arkitektur for COSI - MRP

**Vedtatt av gruppen 22.11.2026.** Dette er arkitekturen appen bygges etter. Ved avvik gjelder PRD-en og ordbanken. En endring i arkitekturen avtales i gruppen og føres inn her med dato (se kapittel 12, Endringer).

## 1. Sammendrag

COSI - MRP er én statisk nettapp som kjører helt i brukerens nettleser. Vercel leverer bare filene. Excel-filen leses, kontrolleres og beregnes på brukerens maskin, og siste kjøring per ferdigprodukt lagres i nettleseren. Ingen data sendes ut.

| Område | Valg |
|---|---|
| Språk og bygg | TypeScript 7 (strict) og Vite 8 |
| Rammeverk | React 19 |
| UI | Vanlig HTML og CSS fra UX-prototypen v3, skrevet om til React-komponenter. Ingen komponentbibliotek |
| Excel | SheetJS Community Edition 0.20.3, bare i Excel-delen |
| Oppbygging | Ren beregningskjerne uten nettleser-API, med et tynt skall rundt |
| Visninger | Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer og Veiledning, hver med sin egen hash-adresse |
| Visning | Lys og mørk, valgt av brukeren og husket i nettleseren |
| Tilstand | React Context med `useReducer`, uten eget bibliotek |
| Lagring | `localStorage`, ett lite utdrag per ferdigprodukt |
| Web Worker | Fra start: lesing, validering og beregning kjører i en Web Worker, så siden aldri fryser |
| Tester | Vitest mot fasit (`npm test`) og Playwright (`npm run test:e2e`) |
| Kvalitet | oxlint. Test, lint og build må være grønne før fletting. Eksakte versjoner |
| Publisering | Statiske filer på Vercel med en streng Content Security Policy |
| Navn i koden | Norske fagord fra ordbanken, i ASCII (æ, ø, å → ae, o, a) |

## 2. Oppbygging

```text
 Brukerens nettleser (alt skjer her)
 ┌───────────────────────────────────────────────────────────────────┐
 │  Hovedtråden                                                       │
 │  ui/ (React)  ──▶  app/ (styring)  ──▶  lagring/ (localStorage)     │
 │      ▲                  │  ▲     sammenlign + utdrag (domene/)      │
 │      │ Kjoring          │  │                                        │
 │      │    ArrayBuffer   │  │ resultat eller feil                    │
 │      │    + valg        ▼  │                                        │
 │      │   ┌──────────────────────────────────────────────┐          │
 │      │   │ Web Worker  worker/                          │          │
 │      │   │ excel/les (SheetJS) → domene/: valider →     │          │
 │      │   │ struktur → beregn → eksepsjoner → kapasitet  │          │
 │      │   └──────────────────────────────────────────────┘          │
 │      └── excel/eksport ved klikk på Eksporter                      │
 │  tekster/: all norsk tekst                                          │
 └───────────────────────────────────────────────────────────────────┘
        ▲ bare statiske filer
 ┌──────┴──────┐
 │ Vercel      │  ingen serverfunksjoner, ingen analyse, streng CSP
 └─────────────┘
```

### Delene og hva de kan bruke

| Del | Mappe | Ansvar | Kan importere |
|---|---|---|---|
| Kjernen | `src/domene/` | Typer, validering, stykklistestruktur, MRP-beregning, eksepsjoner, kapasitet, utdrag og sammenligning | Bare `src/domene/` |
| Tekster | `src/tekster/` | All norsk tekst og tallformatering | Typer fra `domene/` |
| Excel-delen | `src/excel/` | Lese `.xlsx` til rådata, og skrive eksportfilen | `domene/`, `tekster/`, SheetJS |
| Lagring | `src/lagring/` | Lese, skrive, liste og slette lagrede kjøringer, og nøklene for introduksjonen og visningen | Typer fra `domene/` |
| Worker | `src/worker/` | Kjøre lesing, validering og beregning utenfor hovedtråden | `domene/`, `excel/` |
| Styring | `src/app/` | Starte worker-en, holde tidsgrensen, sammenligne, lagre og holde felles tilstand | `domene/`, `excel/` (bare eksport), `lagring/`, `tekster/`, `worker/` |
| UI | `src/ui/` | React-komponenter, visninger, ruting, tastatur og fokus | `app/`, `tekster/`, typer fra `domene/` |

En arkitekturtest i Vitest leser importene i `src/` og feiler hvis en del importerer noe den ikke har lov til.

### Mappestruktur

```text
/
  src/
    domene/      typer.ts, valider.ts, struktur.ts, netting.ts, beregn.ts,
                 eksepsjoner.ts, kapasitet.ts, utdrag.ts, sammenlign.ts
    tekster/     nb.ts (all norsk tekst og formatering)
    excel/       les.ts (xlsx → rådata eller filfeil), eksport.ts
    lagring/     lagrede-kjoringer.ts (eneste bruk av localStorage)
    worker/      beregning.worker.ts, meldinger.ts (typene for meldingene inn og ut)
    app/         kjoring.ts (rekkefølgen i AD-12), tilstand.tsx
    ui/          ruter.ts, appmeny/, introduksjon/, ny-kjoring/, resultat/, lagrede-kjoringer/, veiledning/,
                 resultattabell/, forklaringspanel/, kapasitet/, felles/
    main.tsx
  public/        COSI-MRP-mal.xlsx, testeksempel-01.xlsx (like filene i testdata/)
  tests/         samme mappestruktur som src/, pluss fasit/, validering/, arkitektur.test.ts
  e2e/           Playwright
  testdata/      malen, testeksemplene, fasitene, validering/, lag_testdata.py
  vercel.json    CSP, X-Content-Type-Options og Referrer-Policy (AD-17)
```

## 3. Beslutninger

Hver beslutning har nummer (AD-1 osv.), kravene den gjelder, og regelen.

### AD-1: React, Vite og TypeScript, med UI fra prototypen

- **Gjelder:** NFR-3, NFR-4, NFR-6, NFR-8, FR-14–FR-18, FR-27
- **Regel:**
  - Prosjektet starter fra Vite-malen `react-ts`. TypeScript kjøres med `strict`.
  - UI-et lages med vanlig HTML og CSS fra UX-prototypen (`ux-prototype-2026-11-17-v3/index.html`), skrevet om til React-komponenter. Prototypefilene endres ikke.
  - **UX-dokumentene gjelder** (`ux-designs/ux-COSI - MRP-2026-11-22/`): DESIGN.md for farger, skrift og avstander, og EXPERIENCE.md for sider, tilstander og oppførsel. Tokenene i DESIGN.md blir CSS-variabler i én fil, `ui/felles/tokens.css`. Der prototypen og UX-dokumentene, PRD-en eller ordbanken er ulike, gjelder dokumentene, for eksempel rekkefølgen i resultatet (AD-14) og navnene «Tallboks», «Seksjonsmeny», «Kjøringslinje» og «Appmeny».
  - Det brukes ikke noe komponentbibliotek. Dialoger, nedtrekkslister og radioknapper er vanlig HTML (`<dialog>`, `<select>`, `<fieldset>` med radioknapper), med tastatur- og fokusoppførselen i EXPERIENCE.md.
  - Fra prototypen tas ikke med: panelet Prototypevalg, prototypens egen ruting (erstattes av AD-13) og prototypens nøkler i `localStorage`.
  - **Lys og mørk visning** (DESIGN.md og EXPERIENCE.md, avgjort 22.11): lys er standard, og brukeren bytter med knappen nederst i appmenyen. Begge visningene bruker de samme CSS-variablene, og den mørke settes med `data-visning="mork"` på `<html>`. Valget lagres i nettleseren (AD-10) og leses før siden tegnes første gang, så siden ikke blinker i feil visning. Kontrasten kontrolleres i begge visningene.
  - **Skriftene** IBM Plex Sans, IBM Plex Sans Condensed og IBM Plex Mono (DESIGN.md) ligger i bygget via `@fontsource` og hentes aldri fra Google Fonts eller andre (NFR-4).

### AD-2: Ren kjerne og faste deler

- **Gjelder:** NFR-1, NFR-2, FR-3–FR-13, FR-20, FR-28, FR-29, FR-31–FR-33
- **Regel:**
  - `src/domene/` bruker ikke React, SheetJS, `window`, `document`, `localStorage`, `Date.now`, `new Date()` eller `Math.random`. Samme inndata gir alltid samme svar (FR-8).
  - Tidspunktet for kjøringen settes i styringen, ikke i kjernen.
  - Delene kan bare importere det tabellen i kapittel 2 tillater. Arkitekturtesten sjekker det.

### AD-3: Datakontraktene skrives først, med én koordinator

- **Gjelder:** alle FR
- **Regel:**
  - Alle delte typer står i `src/domene/typer.ts`. Ingen lager egne versjoner av delte typer. Typer som bare brukes inne i én del, er tillatt der.
  - To stories flettes inn i `main` før annet arbeid som bruker typene starter:
    - **Story 0:** prosjektoppsett med Vite, React, TypeScript, Vitest, oxlint, arkitekturtest, `vercel.json` og README med kommandoene.
    - **Story 1:** alle delte typer.
  - **Koordinatoren** (se kapittel 7) eier `typer.ts`. En endring i delte typer skjer i en egen pull request som endrer `typer.ts` først. Den flettes bare når koordinatoren og minst én som bruker typene, har godkjent den.

De viktigste typene:

| Type | Innhold |
|---|---|
| `RaaArk` | Arkene i filen med overskrifter og rader som rå celleverdier, og Excel-radnummeret for hver rad |
| `Inndata` | Kontrollerte data: stykklisterader, horisont H, prognostiserte behov per uke og planlagte mottak som enkeltlinjer |
| `Struktur` | Unike deler i stykklisterekkefølge, overordnede deler med antall, lavnivåkode, ledetid fra ferdigproduktet og antall per ferdigprodukt |
| `DelResultat` | De seks radene per uke for én del, og grunnlaget for forklaringen per uke (`Utregning`) |
| `Resultat` | Alle `DelResultat`, bestillingsforslag, eksepsjoner og kritiske deler, ferdig sortert |
| `Eksepsjon` | Én variant per type, med alle opplysningene kravet sier meldingen skal ha |
| `Valideringsfeil` | Kode, ark, rad, felt og verdi |
| `Kapasitet` | De to radene per uke, tabellen per del og begrensende deler med årsak |
| `LagretKjoring` | Utdraget som lagres (AD-10) |
| `Sammenligning` | Endringslinjene i fast rekkefølge |
| `Kjoring` | Alt UI-et viser etter én kjøring: valg, resultat, kapasitet, sammenligning og lagringsstatus |

### AD-4: Data-konvensjoner

- **Gjelder:** FR-3, FR-5–FR-8, FR-12, FR-14, FR-17, FR-20, FR-29, NFR-11
- **Regel:**
  - Varenummer og nivå er tekst, uten mellomrom foran og bak. Tallet `300001` og teksten «300001» er samme varenummer. Varenummer tolkes aldri som tall, så «000123» beholdes.
  - Uker er nummerert 1 til H. En serie per uke er en liste med lengde H, der plass `i` er uke `i + 1`. Det finnes aldri en uke 0 i resultatet. Forfalt mengde er et eget felt.
  - Alle mengder er heltall. Bare disponibel beholdning og forventet lagerbeholdning kan være negative.
  - Planlagte mottak holdes som enkeltlinjer med varenummer, uke, antall og Excel-rad, og legges ikke sammen på forhånd. Kontrolleres mot fasit 04 når beregningen bygges.
  - **Heltall lagret som tekst godtas.** I et heltallsfelt godtas et tall som er et heltall, og en tekst som etter trimming bare er et valgfritt minustegn og sifre (`^-?[0-9]+$`), for eksempel «7» eller «007». Alt annet gir valideringsfeil: desimaltall (`30.5`, «30,5»), ord, tusenskilletegn («1 000»), plusstegn og tekst som «ca. 40». Etter tolkningen gjelder grensene i FR-3 som vanlig. Regelen har egne enhetstester.

### AD-5: Feil er verdier

- **Gjelder:** FR-1, FR-4, FR-19, NFR-9
- **Regel:**
  - Excel-delen og valideringen gir svar som `{ ok: true, verdi }` eller `{ ok: false, feil }`, og kaster ikke unntak for feil i brukerens data.
  - Excel-delen gir én kode for hver feil i hele filen: ikke `.xlsx` (FR-1), tom fil, skadet fil, ikke en Excel-fil og passordbeskyttet fil (`IKKE_XLSX`, `TOM_FIL`, `SKADET_FIL`, `IKKE_EXCEL`, `PASSORDBESKYTTET`). Hver kode får sin egen melding (NFR-9, EXPERIENCE.md › Feil i hele filen).
  - Valideringen samler alle feilene før den svarer, også etter FR-2-regelen om å hoppe over kontroller som avhenger av noe som mangler.
  - Worker-en fanger alle uventede feil i lesing, validering og beregning og svarer med koden `UVENTET_FEIL`. Den sender aldri et halvt resultat.
  - Styringen gjør en uventet feil om til en norsk melding. Det gjelder svar med `UVENTET_FEIL`, en worker som krasjer (`error` eller `messageerror`), og feil i sammenligning og lagring. Ved feil vises ingen resultat, og ingenting lagres.
  - Én React-feilgrense rundt visningene fanger feil under tegning. Den viser en norsk reservemelding og lar brukeren gå til Ny kjøring og laste opp på nytt uten å laste siden på nytt.
  - **Tidsgrense på 30 sekunder.** Har worker-en ikke svart innen 30 sekunder, stopper styringen den med `terminate()` og gir «uventet feil». Brukeren kan straks laste opp en ny fil. Det er ingen grense for filstørrelse.

### AD-6: Én eier av stykklistestrukturen

- **Gjelder:** FR-3, FR-5, FR-9, FR-10, FR-28, FR-31
- **Regel:** Bare `domene/struktur.ts` bygger `Struktur` fra stykklisteradene. Overordnet del er nærmeste rad over med ett nivå høyere, og like varenumre slås sammen. Den regner ut lavnivåkode (lengste vei ned fra ferdigproduktet, så en del alltid beregnes etter delene den står under), ledetid fra ferdigproduktet (lengste sti) og antall per ferdigprodukt. Valideringen bruker den til reglene om underdeler. Beregningen, eksepsjonene og kapasiteten leser bare `Struktur`, aldri radene direkte. Deler beregnes etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge.

### AD-7: Én implementasjon av nettingen

- **Gjelder:** FR-6–FR-8, FR-24–FR-26, FR-31–FR-33
- **Regel:**
  - Beregningen for én del (disponibel beholdning, fremskynding, nettobehov, planlagt ordremottak og frigivelse) finnes bare i `domene/netting.ts`, med ett innstillingsobjekt.
  - Bestillingsplanen bruker standardinnstillingene. Kapasiteten (FR-31) bruker ledig beholdning, SS 0, ingen fremskynding, ingen forfalte frigivelser og ingen ordre på deler uten underdeler. Fast partistørrelse (FR-25) er én innstilling til.
  - Eksepsjonene finnes etterpå, ut fra svaret fra nettingen, i `domene/eksepsjoner.ts`. «Kanseller mottak» (FR-29) kjører nettingen for delen én gang til uten mottaket.

### AD-8: Beregningen gir alt skjermen viser

- **Gjelder:** FR-13–FR-18, FR-22, FR-32–FR-34
- **Regel:**
  - For hver del og uke gir beregningen de seks radene og en `Utregning` med tallene bak: beholdning forrige uke, planlagte mottak, bruttobehov fordelt på overordnede deler (varenummer, frigivelse, antall), disponibel beholdning før og etter fremskynding, SS, nettobehov, fremskyndede mottak og forfalt mengde. Forklaringspanelet (FR-18) viser disse.
  - `Resultat` har også bestillingsforslagene, eksepsjonene og de kritiske delene, ferdig sortert.
  - UI-et og eksporten formaterer bare. Ingen kode utenfor kjernen regner MRP.

### AD-9: Koder i kjernen, norsk tekst på ett sted

- **Gjelder:** NFR-7, FR-4, FR-9–FR-13, FR-18, FR-29, FR-33
- **Regel:**
  - Kjernen gir koder og tall, aldri ferdig tekst. Eksepsjonskodene er `LEDETID_OVERSKRIDER_HORISONT`, `BESTILLING_FORSINKET`, `BRUK_AV_SIKKERHETSLAGER`, `MOTTAK_FORSINKET` og `KANSELLER_MOTTAK`.
  - Hver eksepsjon har alle opplysningene kravet sier meldingen skal ha, så teksten kan lages fra eksepsjonen alene.
  - All tekst brukeren ser, også i eksporten, lages i `src/tekster/nb.ts`. Ordene følger ordbanken. Engelsk blir senere en ny fil `en.ts` med de samme funksjonene.

### AD-10: Lagring i nettleseren

- **Gjelder:** FR-19–FR-21, FR-27, FR-30, NFR-10
- **Regel:**
  - Bare `lagring/lagrede-kjoringer.ts` bruker `localStorage`. Hver lesing og skriving står i `try/catch`. Det eneste unntaket er `public/visning.js`, et lite skript som leser `cosi-mrp:visning` i `<head>` og setter `data-visning` før siden tegnes første gang (AD-1). Det kan ikke ligge i `src/` fordi det må kjøre før stilarket tegnes, og CSP-en tillater ikke inline-skript. `tests/ui/visning.test.ts` sjekker at det bruker samme nøkkel.
  - Nøkkelen er `cosi-mrp:kjoring:<varenummer på nivå 0>`. Det lagres én kjøring per ferdigprodukt, og en ny erstatter den gamle.
  - Utdraget har `schemaVersjon`, varenummer og navn på ferdigproduktet, tidspunkt, delene (varenummer, beskrivelse), bestillingsforslagene (varenummer, frigivelsesuke, mengde) og eksepsjonene (varenummer, uke, type). Excel-filen og resultattabellen lagres aldri.
  - Siden Lagrede kjøringer lager listen ved å gå gjennom nøklene med prefikset `cosi-mrp:kjoring:`. Det er ingen egen indeks.
  - I tillegg finnes bare to nøkler, og ingen av dem inneholder varenummer eller andre produktdata:
    - `cosi-mrp:intro-sett` sier om introduksjonssiden er vist i denne nettleseren.
    - `cosi-mrp:visning` er `lys` eller `mork` (AD-1). Mangler den, er visningen lys.
  - Er lagringen blokkert eller full, vises kjøringen som vanlig med en melding om at den ikke er lagret. Introduksjonssiden vises ved hvert besøk, og valget av lys eller mørk visning gjelder til siden lukkes. Et utdrag med ukjent `schemaVersjon` regnes som om det ikke finnes.
  - Sletting (FR-21) fjerner nøkkelen. En kjøring med bare produksjonskapasitet lagres ikke (FR-30).

### AD-11: Sammenligning i kjernen

- **Gjelder:** FR-20, FR-23
- **Regel:** `domene/sammenlign.ts` sammenligner to utdrag og gir en `Sammenligning`.
  - Et bestillingsforslag kjennes igjen på varenummer og frigivelsesuke, og en eksepsjon på varenummer, uke og type.
  - Gruppene kommer i rekkefølgen Bestillingsforslag, Eksepsjoner, Deler, og linjene i samme rekkefølge som arket Sammenligning i `testeksempel-03-fasit.xlsx`.
  - Endringstypene er kodene `NY`, `ENDRET_MENGDE`, `FJERNET` og `BORTE`. Teksten lages i `tekster/`.
  - Skjermen og eksporten bruker samme `Sammenligning` uten å sortere den på nytt.

### AD-12: Én kjøring i en Web Worker, fast rekkefølge

- **Gjelder:** FR-4, FR-19, FR-20, FR-30, NFR-5, NFR-9, NFR-10, EXPERIENCE › State Patterns (Lasting)
- **Hvorfor worker fra start:** Siden fryser ikke mens appen regner. Statuslinja kan vise «Leser fila …» og «Beregner …», og et nytt klikk på Beregn kan avvises mens en kjøring pågår. Kapasiteten (FR-31) gjør mange nettinger og kan ta tid med 1000 rader. Tidsgrensen i AD-5 virker fullt ut, fordi en worker kan stoppes.
- **Regel for worker-en (`worker/beregning.worker.ts`):**
  - Den lages med `new Worker(new URL('./beregning.worker.ts', import.meta.url), { type: 'module' })`, som Vite støtter uten ekstra oppsett.
  - Den tar imot én melding: filens innhold som `ArrayBuffer` (overført, ikke kopiert) og valget (bestillingsplan, produksjonskapasitet eller begge).
  - Den kjører `excel/les`, `domene/valider`, `domene/struktur`, `domene/beregn`, `domene/eksepsjoner` og `domene/kapasitet`, og svarer med én melding: resultatet, valideringsfeilene, en filfeil eller `UVENTET_FEIL`.
  - Den har ingen tilstand mellom kjøringer, rører ikke `localStorage` og har ingen tilgang til DOM-en.
  - Meldingstypene inn og ut står i `worker/meldinger.ts` og bruker typene fra `domene/typer.ts`.
  - Testene kaller funksjonene i `domene/` og `excel/` direkte og trenger ikke worker-en. Playwright-testene går gjennom worker-en.
- **Regel for kjøringen:** Bare `app/kjoring.ts` kjører en kjøring, i denne rekkefølgen:
  1. Start worker-en med filen og valget, og start tidsgrensen på 30 sekunder (AD-5). Statuslinja viser at appen leser og beregner. Et nytt klikk på Beregn starter ikke en ny kjøring.
  2. Vent på svar. Ved valideringsfeil, filfeil, uventet feil eller tidsgrense: vis feilen og stopp. Ingenting lagres.
  3. Les forrige utdrag for ferdigproduktet fra `lagring/`.
  4. Lag utdraget av den nye kjøringen og sammenlign med det forrige (bare når bestillingsplanen er valgt).
  5. Lag én `Kjoring` med alt skjermen trenger.
  6. Lagre det nye utdraget (bare når bestillingsplanen er valgt og alt over gikk bra).
  7. Gi `Kjoring` til tilstanden og gå til `#/resultat`.

### AD-13: Visninger, ruting og tilstand

- **Gjelder:** FR-1, FR-19–FR-21, FR-27, FR-30
- **Regel:**
  - Appen har fem visninger, som nås fra appmenyen til venstre (EXPERIENCE.md). Hver har sin egen hash-adresse i ASCII:

    | Visning | Adresse |
    |---|---|
    | Introduksjon | `#/introduksjon` |
    | Ny kjøring (startsiden) | `#/ny-kjoring` |
    | Resultat | `#/resultat` |
    | Lagrede kjøringer | `#/lagrede-kjoringer` |
    | Veiledning (hvordan nettsiden brukes) | `#/veiledning` |

  - Rutingen skrives selv uten bibliotek. Den lytter på `hashchange`, og rutetabellen ligger i `ui/ruter.ts`. Tilbake og Frem i nettleseren følger adressene, og en visning kan bokmerkes.
  - Uten adresse eller med en ukjent adresse går appen til `#/introduksjon` første gang i en nettleser, og ellers til `#/ny-kjoring` (AD-10, `cosi-mrp:intro-sett`).
  - Felles tilstand ligger i React Context med `useReducer`: den viste kjøringen og statusmeldinger. Det brukes ikke noe tilstandsbibliotek.
  - Resultatet og filen finnes bare i minnet. Åpnes `#/resultat` uten en kjøring i minnet, for eksempel etter reload eller fra et bokmerke, vises en kort melding med lenke til Ny kjøring.
  - Lokal tilstand som filtre, valgt celle og åpent panel legges ikke i adressen.
  - Seksjonsmenyen på Resultat ruller til seksjonen med `scrollIntoView` og bruker ikke `href="#…"`, fordi det ville endret ruten.
  - Én `role="status"`-region ligger i rotkomponenten og byttes aldri ut.

### AD-14: Resultatet, Resultattabell og ytelse

- **Gjelder:** FR-14–FR-18, NFR-5, NFR-8
- **Regel:**
  - Resultatet vises i denne rekkefølgen (PRD §4.4 og EXPERIENCE.md): kjøringslinjen med seksjonsmenyen, tallboksene, «Slik leser du resultatet», kritiske deler, bestillingsforslag, endringer (når de finnes), resultattabellen og produksjonskapasiteten (når den er valgt). Uten kritiske deler vises bare en kort melding (FR-16). Med bare produksjonskapasitet vises bare kjøringslinjen og kapasiteten (FR-30). Det er ingen ukeplan.
  - Resultattabell er én semantisk `<table>` med én `<tbody>` per del. Hver del er memoisert, så bare delen som endres, tegnes på nytt.
  - Valgt celle, ukefilter, filteret «Vis bare kritiske deler» (FR-16) og åpent forklaringspanel er lokal tilstand i visningen. Filteret skjuler bare deler på skjermen og endrer ikke `Resultat` eller eksporten.
  - Ytelsen måles tidlig med en fil på 1000 rader, laget med `testdata/lag_testdata.py`. Lesing og beregning går i worker-en (AD-12), så målingen gjelder mest tegningen av tabellen. Nås ikke 3 sekunder, prøves tiltakene i EXPERIENCE.md: `content-visibility: auto`, virtualisering og sammenslått visning.

### AD-15: Excel inn og ut med SheetJS

- **Gjelder:** FR-1, FR-2, FR-3, FR-22, FR-23, FR-27, NFR-11
- **Regel:**
  - Bare `src/excel/` importerer SheetJS, i tillegg til to testhjelpere: `tests/hjelpere/fasit-leser.ts`, som leser fasitfilene, og `tests/hjelpere/lag-arbeidsbok.ts`, som bare skriver små arbeidsbøker til testene. Ingen andre filer i `tests/` eller `e2e/`.
  - Arbeidsbøker laget med SheetJS tester logikken i lesingen. Formler med lagret verdi, hjelpekolonnene, Kontroll-kolonnen, passordbeskyttede, skadede og tomme filer testes med filer lagret fra Excel i `testdata/` (NFR-11, AD-16).
  - SheetJS installeres fra `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`, aldri med `npm i xlsx`. Pakken på npm er en gammel versjon med kjente sikkerhetshull.
  - Ark og kolonner finnes etter navn, ikke plass. Excel-delen leser lagrede verdier og aldri formler. Hver rad får sitt Excel-radnummer.
  - Arkene Veiledning og Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke.
  - Excel-delen avgjør aldri om noe er feil. Det gjør valideringen i kjernen.
  - **Hvor stykklisten slutter:** ved første rad der både Nivå og Varenummer er tomme, slik addendumet sier.
    - Excel-delen leser likevel videre i malens kolonner til siste rad med innhold og tar med om det står noe under den tomme raden. Formlene i hjelpekolonnene telles ikke som innhold.
    - Radene over den tomme raden leses uten grense på 1000 rader, så valideringen kan gi feilen for mer enn 1000 rader på rad 1002 (`testdata/validering/V-S03.xlsx`).
    - Står det innhold under, gir valideringen én feil på den tomme raden (FR-3: «Fra rad 2 og sammenhengende nedover»). Radene under leses ikke inn.
    - Slik gir `testdata/validering/V-S01.xlsx` nøyaktig én feil på rad 9, slik `testdata/validering/README.md` krever.
  - Eksporten bygger arbeidsboka fra `Kjoring`: resultattabellen, bestillingsforslagene, eksepsjonene, ferdigproduktets navn, horisont og tidspunkt, og arket Sammenligning når det finnes (FR-22, FR-23). Filnavnet har ferdigproduktets navn og dato.

### AD-16: Tester

- **Gjelder:** NFR-2, NFR-5, NFR-9–NFR-11, SM-1, SM-2, SM-4, SM-5, SM-7
- **Regel:**
  - `testdata/lag_testdata.py` importeres, oversettes eller kopieres aldri inn i appen. Det kan brukes til å lage inndatafiler, for eksempel filen med 1000 rader.
  - Fasittestene leser `testdata/*-fasit.xlsx` og kjører samme vei som appen: les, valider, beregn eller kapasitet, sammenlign og eksport. Tallene per del, uke og rad, eksepsjonene (varenummer, uke, type), valideringsfeilene (ark, rad, felt, kode) og linjene i sammenligningen sammenlignes. Ordlyden sammenlignes ikke.
  - Hver fil i `testdata/validering/` har sin egen test, med antall feil og stedet fra `testdata/validering/README.md`.
  - `npm test` kjører alt i Vitest, inkludert arkitekturtesten, uten nett, nøkler eller kontoer.
  - En test sjekker at malen og testeksempel 01 i `public/` er like filene i `testdata/` (FR-27).
  - `npm run test:e2e` kjører Playwright i Chromium og Firefox: opplasting av testeksempel 01, de tre filene i NFR-9, blokkert lagring (NFR-10), ny fil uten omlasting, og at ingen side gir brudd på CSP-en. Den er ikke med i `npm test`.
  - **Excel for Windows og Mac (NFR-11):** testeksempel 01 og 02 åpnes og lagres på nytt i Excel for Mac og i Excel for Windows (se kapittel 7). Filene legges inn som egne testfiler og skal gi samme resultat som de opprinnelige. Eksportfilen åpnes i Excel på begge.
  - Testene ligger i `tests/` med samme mappestruktur som `src/`.

### AD-17: Statisk publisering uten datautgang

- **Gjelder:** NFR-3, NFR-4, NFR-6, PRD §8.1
- **Regel:**
  - `npm run build` lager statiske filer, og Vercel publiserer dem. Det er ingen serverfunksjoner, ingen Vercel Analytics eller Speed Insights, og ingen skript eller skrifter fra tredjepart.
  - `vercel.json` setter denne Content Security Policy, så nettleseren selv stopper forsøk på å sende data ut:

    `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; worker-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`

  - `vercel.json` setter også `X-Content-Type-Options: nosniff` og `Referrer-Policy: no-referrer`. HSTS sender Vercel selv, og det kontrolleres i Story 1.3. `X-Frame-Options` trengs ikke, fordi `frame-ancestors 'none'` gjør det samme.
  - `vite preview` bruker den samme CSP-en og de samme hodene, og en test sjekker at de er like.
  - `npm run dev` har ingen CSP, fordi utviklingsserveren trenger inline-skript og -stiler. Alle e2e-testene bruker vakten i `e2e/csp-vakt.ts`, som feiler testen ved brudd på CSP-en, konsollfeil og unntak som ikke fanges.
  - Miljøer: lokalt (`npm run dev`), forhåndsvisning på Vercel per branch, og produksjon fra `main`.
  - Ett byggflagg, `VITE_KAPASITET`, skjuler produksjonskapasiteten hvis trinn 4 kuttes, og i bygget til brukertesten.
  - Brukertesten 2.–7. desember bruker en egen branch `brukertest`, som fryses den uka.

### AD-18: Arbeidsflyt og kvalitet

- **Gjelder:** NFR-2, NFR-3
- **Regel:**
  - Én branch per story og pull request inn i `main`. Minst én annen i gruppen ser over før fletting.
  - `npm test`, `npm run lint` (oxlint) og `npm run build` må være grønne før fletting. Endrer storyen `src/ui/`, `src/worker/` eller `src/excel/`, må også `npm run test:e2e` være grønn.
  - Alle avhengigheter i `package.json` har eksakt versjon, uten `^` og `~`. `package-lock.json` committes, og `npm ci` brukes. Arkitekturtesten sjekker at ingen versjon har `^` eller `~`.
  - `.npmrc` har `engine-strict=true`, så `npm ci` stopper på en Node-versjon utenfor `engines`, og `allow-remote=root`, så bare nettadresser som står i `package.json` (SheetJS) kan installeres. npm 12 stopper nettadresser som standard.
  - Automatiske kontroller på GitHub (CI) er utsatt, men kan legges til uten å endre noe her.

## 4. Konvensjoner

| Område | Konvensjon |
|---|---|
| Navn i koden | Norske fagord fra ordbanken. Æ, ø og å skrives ae, o og a (`LagretKjoring`, `lagret-kjoring.ts`). camelCase for verdier og funksjoner, PascalCase for typer og komponenter. Nye fagord legges først inn i ordbanken. |
| Filnavn | `kebab-case.ts` for kode, `PascalCase.tsx` for React-komponenter |
| Rekkefølge | Deler følger stykklisten, og en felles del står der den står første gang (FR-16). Bestillingsforslag sorteres på frigivelsesuke og så stykklisterekkefølge. Eksepsjoner sorteres på stykklisterekkefølge, uke («–» først) og typen i rekkefølgen i PRD §4.3. |
| Tall | Heltall uten desimaler, formatert med `Intl.NumberFormat('nb-NO')` i `tekster/` |
| Tilgjengelighet | Markeringer har alltid farge og tekst eller symbol (NFR-8). Forklaringspanelet åpnes ved klikk, trykk eller Enter, aldri ved peking (FR-18). Ingen `alert()`. |
| Ord i grensesnittet | Ordbanken gjelder, blant annet Appmeny, Kjøringslinje, Tallboks, Seksjonsmeny, Resultat, Lagret kjøring, Introduksjonsside, Startside og Opplastingssone. |
| Kommandoer | `npm ci`, `npm run dev`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`. De står i README (NFR-3). |

## 5. Teknologi og versjoner

Versjonene er sjekket 22.11.2026 og låses eksakt i `package.json`.

| Navn | Versjon |
|---|---|
| Node.js | 24 LTS: versjonen vi bygger og tester på, og den Vercel bruker. `engines` er `^22.12.0 \|\| ^24.0.0 \|\| ^26.0.0`, fordi Vitest ikke støtter 23 og 25 |
| TypeScript | 7.0.2 |
| Vite | 8.3.8 |
| React og react-dom | 19.3.1 |
| @vitejs/plugin-react | 6.3.0 |
| SheetJS Community Edition | 0.20.3 (fra cdn.sheetjs.com) |
| @fontsource/ibm-plex-sans, -sans-condensed og -mono | 5.3.0 |
| Vitest | 5.1.1 |
| @types/react og @types/react-dom | 19.3.0 (bare utvikling) |
| @types/node | 24.19.2 (bare utvikling) |
| @playwright/test | 1.65.1 |
| oxlint | 1.94.0 |
| UI-komponenter og CSS | Ingen bibliotek. Vanlig HTML og CSS fra UX-prototypen v3 |
| Publisering | Vercel, bare statiske filer |

## 6. Kravene og hvor de løses

| Krav | Ligger i | Styres av |
|---|---|---|
| FR-1–FR-2 opplasting og struktur | `excel/les.ts`, `domene/valider.ts` | AD-5, AD-15 |
| FR-3–FR-4 kontroll av verdier, alle feil samlet | `domene/valider.ts`, `domene/struktur.ts`, `tekster/` | AD-4, AD-5, AD-6, AD-9, AD-15 |
| FR-5–FR-8, FR-28 MRP-beregning | `domene/beregn.ts`, `domene/netting.ts` | AD-4, AD-6, AD-7 |
| FR-9–FR-13, FR-29 eksepsjoner og kritiske deler | `domene/eksepsjoner.ts` | AD-7, AD-9 |
| FR-14–FR-17 resultatet, med filteret for kritiske deler | `ui/resultat/`, `ui/resultattabell/` | AD-8, AD-13, AD-14 |
| FR-18 forklaringer | `domene/beregn.ts` (Utregning), `tekster/`, `ui/forklaringspanel/` | AD-8, AD-9 |
| FR-19–FR-21 lagring, sammenligning og Lagrede kjøringer | `domene/utdrag.ts`, `domene/sammenlign.ts`, `lagring/`, `app/kjoring.ts`, `ui/lagrede-kjoringer/` | AD-10, AD-11, AD-12, AD-13 |
| FR-22–FR-23 eksport | `excel/eksport.ts` | AD-8, AD-11, AD-15 |
| FR-24–FR-26 fast partistørrelse | innstilling i `domene/netting.ts` | AD-7 |
| FR-27 introduksjonsside, veiledning og nedlasting | `ui/introduksjon/`, `ui/ny-kjoring/`, `ui/veiledning/`, `lagring/`, `public/` | AD-10, AD-13, AD-17 |
| FR-30–FR-34 produksjonskapasitet | `domene/kapasitet.ts`, `ui/kapasitet/` | AD-7, AD-8, AD-12, AD-17 |
| NFR-1 beregning skilt fra resten | `src/domene/` | AD-2 |
| NFR-2 tester mot fasit | `tests/` | AD-16 |
| NFR-3 kjørbar for sensor | README, `package.json` | AD-16, AD-17, AD-18 |
| NFR-4 data blir i nettleseren | bygg, `vercel.json` | AD-1, AD-17 |
| NFR-5 ytelse | `worker/`, `ui/resultattabell/`, måling med 1000 rader | AD-12, AD-14 |
| NFR-6 Chrome, Edge og Firefox på PC | `e2e/` | AD-16, AD-17 |
| NFR-7 språk | `tekster/` | AD-9 |
| NFR-8 lesbarhet | `ui/` | AD-1, AD-14, konvensjonene |
| NFR-9 robust feilhåndtering | `excel/les.ts`, `worker/`, `app/kjoring.ts`, feilgrensen i `ui/` | AD-5, AD-12 |
| NFR-10 lagring i nettleseren | `lagring/` | AD-10 |
| NFR-11 kompatibilitet med Excel | `excel/`, testfilene fra Excel for Windows og Mac | AD-4, AD-15, AD-16 |

## 7. Roller og ansvar

| Ansvar | Hvem |
|---|---|
| Koordinator for `src/domene/typer.ts` (AD-3) | Idun |
| Tester med Excel for Mac (NFR-11, AD-16) | Carmen og Idun |
| Tester med Excel for Windows (NFR-11, AD-16) | Sebastian og Oda |
| Hvem bygger hva (kapittel 8) | Fordeles når epics og stories lages |

## 8. Byggerekkefølge

Rekkefølgen følger PRD §7.1, så trinn 1–3 kan være testet før kuttbeslutningen 30. november.

| Nr. | Arbeid | Trinn |
|---|---|---|
| 0 | Story 0: prosjektoppsett (AD-3) | – |
| 1 | Story 1: alle delte typer i `typer.ts` | – |
| 2 | Lesing i `excel/` og validering i `domene/`, med testene i `testdata/validering/` | 1 |
| 3 | Struktur, netting og beregning, med fasittester for testeksempel 01–04 | 1 |
| 4 | Eksepsjoner, med fasittester | 1 |
| 5 | Worker-en, styringen, tilstanden og rutingen | 1 |
| 6 | Appmenyen med lys og mørk visning, Introduksjon, Ny kjøring, Veiledning, Resultat og Resultattabell med filteret «Vis bare kritiske deler». Ytelsesmåling med 1000 rader | 1 |
| 7 | Forklaringspanelet | 2 |
| 8 | Lagring, sammenligning, Lagrede kjøringer og eksport | 3 |
| 9 | Produksjonskapasitet, med fasittest for testeksempel 05 | 4 |
| 10 | Fast partistørrelse | 5 |

Når nr. 1 er flettet inn, kan nr. 2–4 og nr. 6 gjøres samtidig. UI-et kan bygges mot eksempeldata hentet fra fasit 01.

## 9. Risikoer

| Risiko | Hva vi gjør |
|---|---|
| Beregningen gir feil svar i spesialtilfeller (fremskynding, felles deler, forfalte frigivelser) | Fasittestene for alle fem testeksemplene skrives før UI-et. Avvik rettes i kjernen, aldri i UI-et. |
| Tabellen blir treg med 1000 deler | Måles i nr. 6, før tabellen låses. Tiltakene står i AD-14. |
| Excel for Mac og Windows lagrer verdier ulikt | Testfilene fra begge legges inn og testes (AD-16). |
| KI-verktøy legger logikk på feil sted | Arkitekturtesten feiler hvis en del importerer noe den ikke har lov til. Dette dokumentet gis til KI-verktøyet i hver økt. |
| Tiden blir knapp | Trinn 4 og 5 kan slås av med byggflagget og kuttes uten å endre resten. |

## 10. Utsatt

- **IndexedDB:** først hvis hele kjøringer eller flere kjøringer per ferdigprodukt skal lagres. All lagring ligger i én fil, så et bytte endrer bare den.
- **Virtualisering av tabellen:** først hvis målingen viser at det trengs.
- **Engelsk tekst:** `tekster/` er forberedt, men bare norsk lages i v1.
- **CI på GitHub:** kan legges til senere (AD-18).
- **Flere ferdigprodukter samlet, hva-om-scenarier og mer enn tre nivåer:** utenfor v1 (PRD §7.2). Lagringsnøkkelen per ferdigprodukt (AD-10) må endres når flere produkter planlegges samlet.

## 11. Dokumenter som er oppdatert etter arkitekturen

Alle ble oppdatert 22.11, etter gruppens ja.

| Dokument | Hva |
|---|---|
| PRD FR-3 og addendum | Regelen om tom rad midt i stykklisten (AD-15) og heltall lagret som tekst (AD-4), med nye testbare konsekvenser |
| EXPERIENCE.md (`ux-COSI - MRP-2026-11-22`) | UI-systemet er ført inn (AD-1), og spørsmål 3 (skriften) og 7 (UI-bibliotek) er lukket |
| Ordbanken | De ni UI-ordene fra 22.11 (Appmeny, Kjøringslinje, Opplastingssone, Feiloppsummering, Delens felt, Eksepsjonsmerke, Forklaringspanel, Ukefilter, Statusmelding) er godkjent |

## 12. Endringer

| Dato | Endring | Berører |
|---|---|---|
| 22.11.2026 | Arkitekturen vedtatt av gruppen. | Hele dokumentet |
| 22.11.2026 | Web Worker fra start, i stedet for først når målingen krever det. Lesing, validering og beregning kjører i `src/worker/`, og tidsgrensen på 30 sekunder håndheves med `terminate()`. Navigasjonen med egen hash-adresse per visning (AD-13) er bekreftet uendret. | Kapittel 1 og 2, AD-5, AD-12, AD-14, kapittel 6, 8 og 10 |
| 22.11.2026 | Tilpasset de felles UX-dokumentene (`ux-COSI - MRP-2026-11-22`): femte visning Veiledning (`#/veiledning`) og appmeny, lys og mørk visning med nøkkelen `cosi-mrp:visning`, seksjonen «Slik leser du resultatet» og kjøringslinjen i resultatet, skriftene IBM Plex i stedet for Source Sans 3, og tokenene i DESIGN.md som CSS-variabler. | Kapittel 1, 2, 4, 5, 6, 8 og 11, AD-1, AD-10, AD-13, AD-14 |
| 22.11.2026 | PRD FR-3, EXPERIENCE.md og ordbanken oppdatert etter arkitekturen (kapittel 11). | Kapittel 11 |
| 23.11.2026 | De fem åpne avklaringene fra Story 1.1 (PR #20 og #22), godkjent av Sebastian 23.11.2026: typepakkene står i kap. 5. `engines` godtar Node 22.12+, 24 og 26, og `.npmrc` har `allow-remote=root`. Alle e2e-tester bruker CSP-vakten, og `test:e2e` kreves før fletting når `ui/`, `worker/` eller `excel/` endres. `vercel.json` setter også `nosniff` og `Referrer-Policy`. SheetJS-unntaket i testene gjelder også `tests/hjelpere/lag-arbeidsbok.ts`. | Kapittel 2 og 5, AD-15, AD-17, AD-18 |
| 23.11.2026 | Ny filfeilkode `PASSORDBESKYTTET` for passordbeskyttet fil, og alle fem kodene for feil i hele filen er listet i AD-5 (Story 1.2, godkjent av koordinatoren). | AD-5 |
| 23.11.2026 | Lavnivåkoden i `Struktur` er lengste vei fra ferdigproduktet, ikke største nivåtall delen står på. Det gir samme svar i alle testeksemplene, men sørger for at en del alltid beregnes etter delene den står under, også når en del står på ..2 et sted og på .1 med underdeler et annet (FR-28). PRD FR-28 og ordlisten er oppdatert, og FR-28 har fått en testbar konsekvens om del som står flere ganger under samme overordnede del (Story 1.7, godkjent av gruppen). | AD-6 |
| 24.11.2026 | Hvor stykklisten slutter (Story 1.5): Excel-delen leser til siste rad med innhold, ikke bare til og med rad 1001, og radene over den tomme raden leses uten grense. Ellers kan ikke V-S03 (1001 rader, feil på rad 1002) testes. Svarer på åpent spørsmål 1 i spesifikasjonen for Story 1.8 (alternativ A). | AD-15 |
| 24.11.2026 | `public/visning.js` leser `cosi-mrp:visning` før første tegning og er unntaket fra at bare `lagring/` bruker `localStorage`. Primærknappen har fått egen hover-farge, `accent-hover`, i DESIGN.md og `tokens.css`, fordi `summary-hover` ga 1,4:1 i mørk visning. Kontrasten er regnet ut for alle tekstpar i begge visningene (Story 1.13). | AD-1, AD-10 |
