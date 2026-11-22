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
  - '.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-13/DESIGN.md og EXPERIENCE.md'
  - '.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/'
  - 'testdata/'
---

# Arkitektur for COSI - MRP

**Vedtatt av gruppen 22.11.2026.** Dette er arkitekturen appen bygges etter. Ved avvik gjelder PRD-en og ordbanken. En endring i arkitekturen avtales i gruppen og føres inn her med dato.

## 1. Sammendrag

COSI - MRP er én statisk nettapp som kjører helt i brukerens nettleser. Vercel leverer bare filene. Excel-filen leses, kontrolleres og beregnes på brukerens maskin, og siste kjøring per ferdigprodukt lagres i nettleseren. Ingen data sendes ut.

| Område | Valg |
|---|---|
| Språk og bygg | TypeScript 7 (strict) og Vite 8 |
| Rammeverk | React 19 |
| UI | Vanlig HTML og CSS fra UX-prototypen v3, skrevet om til React-komponenter. Ingen komponentbibliotek |
| Excel | SheetJS Community Edition 0.20.3, bare i Excel-delen |
| Oppbygging | Ren beregningskjerne uten nettleser-API, med et tynt skall rundt |
| Visninger | Introduksjon, Ny kjøring, Resultat og Lagrede kjøringer, hver med sin egen hash-adresse |
| Tilstand | React Context med `useReducer`, uten eget bibliotek |
| Lagring | `localStorage`, ett lite utdrag per ferdigprodukt |
| Web Worker | Ikke i starten. Legges til hvis 1000 rader tar over 3 sekunder |
| Tester | Vitest mot fasit (`npm test`) og Playwright (`npm run test:e2e`) |
| Kvalitet | oxlint. Test, lint og build må være grønne før fletting. Eksakte versjoner |
| Publisering | Statiske filer på Vercel med en streng Content Security Policy |
| Navn i koden | Norske fagord fra ordbanken, i ASCII (æ, ø, å → ae, o, a) |

## 2. Oppbygging

```text
 Brukerens nettleser (alt skjer her)
 ┌───────────────────────────────────────────────────────────────────┐
 │  ui/ (React)  ──▶  app/ (styring)  ──▶  lagring/ (localStorage)     │
 │      ▲                  │                                           │
 │      │ Kjoring          ▼                                           │
 │      │      excel/ (SheetJS)  →  domene/ (ren TypeScript)           │
 │      │      les fil → rådata     valider → struktur → beregn →      │
 │      └────────────────────────── eksepsjoner → kapasitet →          │
 │                                  utdrag → sammenlign                │
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
| Lagring | `src/lagring/` | Lese, skrive, liste og slette lagrede kjøringer, og intro-nøkkelen | Typer fra `domene/` |
| Styring | `src/app/` | Kjøre én kjøring fra fil til resultat i fast rekkefølge, og holde felles tilstand | `domene/`, `excel/`, `lagring/`, `tekster/` |
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
    app/         kjoring.ts (rekkefølgen i AD-12), tilstand.tsx
    ui/          ruter.ts, introduksjon/, ny-kjoring/, resultat/, lagrede-kjoringer/,
                 resultattabell/, forklaringspanel/, kapasitet/, felles/
    main.tsx
  public/        COSI-MRP-mal.xlsx, testeksempel-01.xlsx (like filene i testdata/)
  tests/         samme mappestruktur som src/, pluss fasit/, validering/, arkitektur.test.ts
  e2e/           Playwright
  testdata/      malen, testeksemplene, fasitene, validering/, lag_testdata.py
  vercel.json    CSP og andre sikkerhetshoder
```

`src/worker/` lages først når Web Worker innføres (AD-14).

## 3. Beslutninger

Hver beslutning har nummer (AD-1 osv.), kravene den gjelder, og regelen.

### AD-1: React, Vite og TypeScript, med UI fra prototypen

- **Gjelder:** NFR-3, NFR-4, NFR-6, NFR-8, FR-14–FR-18, FR-27
- **Regel:**
  - Prosjektet starter fra Vite-malen `react-ts`. TypeScript kjøres med `strict`.
  - UI-et lages med vanlig HTML og CSS fra UX-prototypen (`ux-prototype-2026-11-17-v3/index.html`), skrevet om til React-komponenter. Prototypefilene endres ikke.
  - Det brukes ikke noe komponentbibliotek. Dialoger, nedtrekkslister og radioknapper er vanlig HTML (`<dialog>`, `<select>`, `<fieldset>` med radioknapper), med tastatur- og fokusoppførselen i EXPERIENCE.md.
  - Fra prototypen tas ikke med: panelet Prototypevalg, prototypens egen ruting (erstattes av AD-13), mørk modus (bare lys i v1) og prototypens nøkler i `localStorage`.
  - Der prototypen og PRD-en eller ordbanken er ulike, gjelder PRD-en og ordbanken, for eksempel rekkefølgen i resultatet (AD-14) og navnene «Tallboks» og «Seksjonsmeny».
  - Skriften Source Sans 3 (DESIGN.md) ligger i bygget via `@fontsource` og hentes aldri fra Google eller andre (NFR-4).

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
  - Excel-delen gir én kode for hver feil i hele filen: ikke en Excel-fil, tom fil og skadet fil. Hver kode får sin egen melding (NFR-9).
  - Valideringen samler alle feilene før den svarer, også etter FR-2-regelen om å hoppe over kontroller som avhenger av noe som mangler.
  - Styringen har den ene `try/catch` som gjør en uventet feil om til en norsk melding. Ved feil vises ingen resultat, og ingenting lagres.
  - Én React-feilgrense rundt visningene fanger feil under tegning. Den viser en norsk reservemelding og lar brukeren gå til Ny kjøring og laste opp på nytt uten å laste siden på nytt.
  - **Tidsgrense på 30 sekunder.** Tar lesing og beregning mer enn 30 sekunder, gir det «uventet feil», og brukeren kan laste opp en ny fil. Det er ingen grense for filstørrelse. Grensen kan bare håndheves helt i en Web Worker, fordi hovedtråden ikke kan avbryte SheetJS midt i en fil. Til worker-en innføres (AD-14), måler styringen tiden og gir feilen når arbeidet er ferdig.

### AD-6: Én eier av stykklistestrukturen

- **Gjelder:** FR-3, FR-5, FR-9, FR-10, FR-28, FR-31
- **Regel:** Bare `domene/struktur.ts` bygger `Struktur` fra stykklisteradene. Overordnet del er nærmeste rad over med ett nivå høyere, og like varenumre slås sammen. Den regner ut lavnivåkode, ledetid fra ferdigproduktet (lengste sti) og antall per ferdigprodukt. Valideringen bruker den til reglene om underdeler. Beregningen, eksepsjonene og kapasiteten leser bare `Struktur`, aldri radene direkte. Deler beregnes etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge.

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
  - Bare `lagring/lagrede-kjoringer.ts` bruker `localStorage`. Hver lesing og skriving står i `try/catch`.
  - Nøkkelen er `cosi-mrp:kjoring:<varenummer på nivå 0>`. Det lagres én kjøring per ferdigprodukt, og en ny erstatter den gamle.
  - Utdraget har `schemaVersjon`, varenummer og navn på ferdigproduktet, tidspunkt, delene (varenummer, beskrivelse), bestillingsforslagene (varenummer, frigivelsesuke, mengde) og eksepsjonene (varenummer, uke, type). Excel-filen og resultattabellen lagres aldri.
  - Siden Lagrede kjøringer lager listen ved å gå gjennom nøklene med prefikset `cosi-mrp:kjoring:`. Det er ingen egen indeks.
  - Den eneste andre nøkkelen er `cosi-mrp:intro-sett`, som sier om introduksjonssiden er vist i denne nettleseren.
  - Er lagringen blokkert eller full, vises kjøringen som vanlig med en melding om at den ikke er lagret, og introduksjonssiden vises ved hvert besøk. Et utdrag med ukjent `schemaVersjon` regnes som om det ikke finnes.
  - Sletting (FR-21) fjerner nøkkelen. En kjøring med bare produksjonskapasitet lagres ikke (FR-30).

### AD-11: Sammenligning i kjernen

- **Gjelder:** FR-20, FR-23
- **Regel:** `domene/sammenlign.ts` sammenligner to utdrag og gir en `Sammenligning`.
  - Et bestillingsforslag kjennes igjen på varenummer og frigivelsesuke, og en eksepsjon på varenummer, uke og type.
  - Gruppene kommer i rekkefølgen Bestillingsforslag, Eksepsjoner, Deler, og linjene i samme rekkefølge som arket Sammenligning i `testeksempel-03-fasit.xlsx`.
  - Endringstypene er kodene `NY`, `ENDRET_MENGDE`, `FJERNET` og `BORTE`. Teksten lages i `tekster/`.
  - Skjermen og eksporten bruker samme `Sammenligning` uten å sortere den på nytt.

### AD-12: Én kjøring, fast rekkefølge

- **Gjelder:** FR-4, FR-19, FR-20, FR-30, NFR-9, NFR-10
- **Regel:** Bare `app/kjoring.ts` kjører en kjøring, i denne rekkefølgen:
  1. Les filen med Excel-delen.
  2. Valider og bygg strukturen.
  3. Ved feil: vis feilene og stopp. Ingenting lagres.
  4. Les forrige utdrag for ferdigproduktet.
  5. Kjør beregningene som er valgt (bestillingsplan, produksjonskapasitet eller begge).
  6. Sammenlign med forrige utdrag (bare når bestillingsplanen er valgt).
  7. Lag én `Kjoring` med alt skjermen trenger.
  8. Lagre det nye utdraget (bare når bestillingsplanen er valgt og alt over gikk bra).
  9. Gi `Kjoring` til tilstanden og gå til `#/resultat`.

### AD-13: Visninger, ruting og tilstand

- **Gjelder:** FR-1, FR-19–FR-21, FR-27, FR-30
- **Regel:**
  - Appen har fire visninger med menyvalgene fra ordbanken, og hver har sin egen hash-adresse i ASCII:

    | Visning | Adresse |
    |---|---|
    | Introduksjon | `#/introduksjon` |
    | Ny kjøring (startsiden) | `#/ny-kjoring` |
    | Resultat | `#/resultat` |
    | Lagrede kjøringer | `#/lagrede-kjoringer` |

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
  - Resultatet vises i denne rekkefølgen (PRD §4.4 og ordbanken): tallboksene, kritiske deler, bestillingsforslag, endringer (når de finnes), resultattabellen og produksjonskapasiteten (når den er valgt). Uten kritiske deler vises bare en kort melding (FR-16). Det er ingen ukeplan.
  - Resultattabell er én semantisk `<table>` med én `<tbody>` per del. Hver del er memoisert, så bare delen som endres, tegnes på nytt.
  - Valgt celle, ukefilter, filteret «Vis bare kritiske deler» (FR-16) og åpent forklaringspanel er lokal tilstand i visningen. Filteret skjuler bare deler på skjermen og endrer ikke `Resultat` eller eksporten.
  - Ytelsen måles tidlig med en fil på 1000 rader, laget med `testdata/lag_testdata.py`. Nås ikke 3 sekunder, prøves først Web Worker for lesing og beregning (i `src/worker/`), deretter tiltakene i EXPERIENCE.md: `content-visibility: auto`, virtualisering og sammenslått visning.

### AD-15: Excel inn og ut med SheetJS

- **Gjelder:** FR-1, FR-2, FR-3, FR-22, FR-23, FR-27, NFR-11
- **Regel:**
  - Bare `src/excel/` importerer SheetJS, i tillegg til en hjelpefunksjon i testene som leser fasitfilene.
  - SheetJS installeres fra `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`, aldri med `npm i xlsx`. Pakken på npm er en gammel versjon med kjente sikkerhetshull.
  - Ark og kolonner finnes etter navn, ikke plass. Excel-delen leser lagrede verdier og aldri formler. Hver rad får sitt Excel-radnummer.
  - Arkene Veiledning og Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke.
  - Excel-delen avgjør aldri om noe er feil. Det gjør valideringen i kjernen.
  - **Hvor stykklisten slutter:** ved første rad der både Nivå og Varenummer er tomme, slik addendumet sier.
    - Excel-delen leser likevel videre i malens kolonner A–H til og med rad 1001 og tar med om det står noe under den tomme raden. Formlene i hjelpekolonnene telles ikke som innhold.
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

  - `vite preview` bruker den samme CSP-en, og en test sjekker at de to er like.
  - Miljøer: lokalt (`npm run dev`), forhåndsvisning på Vercel per branch, og produksjon fra `main`.
  - Ett byggflagg, `VITE_KAPASITET`, skjuler produksjonskapasiteten hvis trinn 4 kuttes, og i bygget til brukertesten.
  - Brukertesten 2.–7. desember bruker en egen branch `brukertest`, som fryses den uka.

### AD-18: Arbeidsflyt og kvalitet

- **Gjelder:** NFR-2, NFR-3
- **Regel:**
  - Én branch per story og pull request inn i `main`. Minst én annen i gruppen ser over før fletting.
  - `npm test`, `npm run lint` (oxlint) og `npm run build` må være grønne før fletting.
  - Alle avhengigheter i `package.json` har eksakt versjon, uten `^` og `~`. `package-lock.json` committes, og `npm ci` brukes. Arkitekturtesten sjekker at ingen versjon har `^` eller `~`.
  - Automatiske kontroller på GitHub (CI) er utsatt, men kan legges til uten å endre noe her.

## 4. Konvensjoner

| Område | Konvensjon |
|---|---|
| Navn i koden | Norske fagord fra ordbanken. Æ, ø og å skrives ae, o og a (`LagretKjoring`, `lagret-kjoring.ts`). camelCase for verdier og funksjoner, PascalCase for typer og komponenter. Nye fagord legges først inn i ordbanken. |
| Filnavn | `kebab-case.ts` for kode, `PascalCase.tsx` for React-komponenter |
| Rekkefølge | Deler følger stykklisten, og en felles del står der den står første gang (FR-16). Bestillingsforslag sorteres på frigivelsesuke og så stykklisterekkefølge. Eksepsjoner sorteres på stykklisterekkefølge, uke («–» først) og typen i rekkefølgen i PRD §4.3. |
| Tall | Heltall uten desimaler, formatert med `Intl.NumberFormat('nb-NO')` i `tekster/` |
| Tilgjengelighet | Markeringer har alltid farge og tekst eller symbol (NFR-8). Forklaringspanelet åpnes ved klikk, trykk eller Enter, aldri ved peking (FR-18). Ingen `alert()`. |
| Ord i grensesnittet | Ordbanken gjelder, blant annet Tallboks, Seksjonsmeny, Resultat, Lagret kjøring, Introduksjonsside og Startside. |
| Kommandoer | `npm ci`, `npm run dev`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`. De står i README (NFR-3). |

## 5. Teknologi og versjoner

Versjonene er sjekket 22.11.2026 og låses eksakt i `package.json`.

| Navn | Versjon |
|---|---|
| Node.js | 24 LTS (i `engines` og på Vercel) |
| TypeScript | 7.0.2 |
| Vite | 8.3.8 |
| React og react-dom | 19.3.1 |
| @vitejs/plugin-react | 6.3.0 |
| SheetJS Community Edition | 0.20.3 (fra cdn.sheetjs.com) |
| @fontsource/source-sans-3 | 5.3.1 |
| Vitest | 5.1.1 |
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
| FR-27 introduksjonsside, veiledning og nedlasting | `ui/introduksjon/`, `ui/ny-kjoring/`, `lagring/`, `public/` | AD-10, AD-13, AD-17 |
| FR-30–FR-34 produksjonskapasitet | `domene/kapasitet.ts`, `ui/kapasitet/` | AD-7, AD-8, AD-12, AD-17 |
| NFR-1 beregning skilt fra resten | `src/domene/` | AD-2 |
| NFR-2 tester mot fasit | `tests/` | AD-16 |
| NFR-3 kjørbar for sensor | README, `package.json` | AD-16, AD-17, AD-18 |
| NFR-4 data blir i nettleseren | bygg, `vercel.json` | AD-1, AD-17 |
| NFR-5 ytelse | `ui/resultattabell/`, måling med 1000 rader | AD-14 |
| NFR-6 Chrome, Edge og Firefox på PC | `e2e/` | AD-16, AD-17 |
| NFR-7 språk | `tekster/` | AD-9 |
| NFR-8 lesbarhet | `ui/` | AD-1, AD-14, konvensjonene |
| NFR-9 robust feilhåndtering | `excel/les.ts`, `app/kjoring.ts`, feilgrensen i `ui/` | AD-5, AD-12 |
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
| 5 | Styringen, tilstanden og rutingen | 1 |
| 6 | Introduksjon, Ny kjøring, Resultat og Resultattabell med filteret «Vis bare kritiske deler». Ytelsesmåling med 1000 rader | 1 |
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

- **Web Worker:** når målingen med 1000 rader viser over 3 sekunder (AD-14). Da håndheves også tidsgrensen fullt ut (AD-5).
- **IndexedDB:** først hvis hele kjøringer eller flere kjøringer per ferdigprodukt skal lagres. All lagring ligger i én fil, så et bytte endrer bare den.
- **Virtualisering av tabellen:** først hvis målingen viser at det trengs.
- **Engelsk tekst:** `tekster/` er forberedt, men bare norsk lages i v1.
- **CI på GitHub:** kan legges til senere (AD-18).
- **Flere ferdigprodukter samlet, hva-om-scenarier og mer enn tre nivåer:** utenfor v1 (PRD §7.2). Lagringsnøkkelen per ferdigprodukt (AD-10) må endres når flere produkter planlegges samlet.

## 11. Dokumenter som må oppdateres

| Dokument | Hva |
|---|---|
| EXPERIENCE.md | UI-system: vanlig HTML og CSS fra prototypen, ikke shadcn/ui, Radix og Tailwind (AD-1). Navigasjon: egen hash-adresse per visning, ikke samme adresse (AD-13). De fire visningene og den nye rekkefølgen i resultatet. |
| PRD FR-3 | Regelen om tom rad midt i stykklisten (AD-15) og heltall lagret som tekst (AD-4) |
