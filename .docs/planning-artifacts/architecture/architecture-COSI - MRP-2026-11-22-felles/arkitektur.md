---
title: 'COSI - MRP: felles arkitektur (sammenstilling, vedtatt)'
type: architecture
status: vedtatt – erstattet av architecture-COSI - MRP-2026-11-22-vedtatt/arkitektur.md
owner: 'Sammenstilt fra tre forslag, vedtatt av gruppen 22.11'
created: '2026-11-22'
updated: '2026-11-22'
binds: [FR-1–FR-34, NFR-1–NFR-11]
sources:
  - 'Carmen/Branch: architecture/architecture-COSI - MRP-2026-11-15/ARCHITECTURE-SPINE.md (21.11)'
  - 'Sebastian/Branch: architecture/architecture-COSI - MRP-2026-11-20/ARCHITECTURE-SPINE.md (20.11)'
  - 'Idun/Branch: architecture/architecture-COSI - MRP-2026-11-22-idun/arkitektur.md (22.11)'
  - 'architecture/sammenligning-arkitekturforslag-2026-11-22.md'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/prd.md og addendum.md'
---

# Felles arkitektur for COSI - MRP (sammenstilling)

**Vedtatt av gruppen 22.11.2026.** Dette er sammenstillingen som viser hvor hvert valg kom fra. Arkitekturen som gjelder, står samlet i [../architecture-COSI - MRP-2026-11-22-vedtatt/arkitektur.md](../architecture-COSI%20-%20MRP-2026-11-22-vedtatt/arkitektur.md). Arkitekturen er satt sammen fra de tre forslagene til Carmen, Sebastian og Idun. Ved avvik gjelder PRD-en.

**Oppdatert 22.11 etter UX-avklaringene gruppen godkjente samme dag** (PRD §4.4, FR-16, FR-27 og ordbanken). Kritiske deler står først i resultatet, appen har en introduksjonsside og fire menyvalg, resultattabellen har filteret «Vis bare kritiske deler», og ukeplanen er fjernet. G-5 og E-7 er dermed avgjort (kapittel 8 og 9), og FA-10, FA-13 og FA-14 er utvidet.

**E-1 til E-6 avgjort av gruppen 22.11:** alle er godtatt, og Idun er koordinator for `typer.ts`. Svarene er ført inn i FA-3, FA-4, FA-5, FA-16, FA-17 og FA-18 (kapittel 9).

**G-1 til G-7 avgjort av hele gruppen 22.11** (kapittel 8): UI-et lages med vanlig HTML og CSS fra Odas prototype v3 (G-1). Stykklisten slutter ved første tomme rad, og innhold under den gir én feil (G-2). Mappene er Iduns (G-3), og tidsgrensen er 30 sekunder (G-4). Excel-testene er fordelt (G-6), og hver visning får sin egen hash-adresse (G-7). Ført inn i kapittel 3, FA-1, FA-5, FA-13, FA-15 og FA-16. Bare fordelingen av byggearbeidet i G-6 står igjen.

## 1. Slik er dokumentet laget

| Regel | Hva det betyr her |
|---|---|
| **Valgt på forhånd** | React og SheetJS CE |
| **To av tre er like** | Det valget gjelder. Hver beslutning viser hvem valget kommer fra. |
| **Alle tre er ulike** | Avgjort av gruppen 22.11. Står i kapittel 8. |
| **Bare ett forslag tar stilling** | Tatt med først når gruppen har avgjort det. Svarene står i kapittel 9. |
| **Avgjort av gruppen** | Gruppens vedtak i PRD-en og ordbanken går foran alle tre forslagene. |

Merkingen bak hver beslutning: **Alle** = alle tre forslagene, **C** = Carmen, **S** = Sebastian, **I** = Idun.

## 2. Sammendrag

| Område | Valg | Grunnlag |
|---|---|---|
| Rammeverk | React 19 | Valgt på forhånd (C + I) |
| Bygg og språk | Vite 8 og TypeScript 7 (strict) | Alle / C + I |
| Excel | SheetJS CE 0.20.3 | Valgt på forhånd (S + I) |
| Oppbygging | Ren beregningskjerne med tynt skall | Alle |
| Web Worker | Ikke i starten. Legges til hvis målingen med 1000 rader viser over 3 sekunder | C + S |
| Navigasjon | Egen hash-adresse per visning (`#/resultat` osv.), skrevet selv | G-7 (C) |
| UI-komponenter | Vanlig HTML og CSS fra Odas prototype v3, uten komponentbibliotek | G-1 (S) |
| Mapper | `domene/`, `tekster/`, `excel/`, `lagring/`, `app/`, `ui/` | G-3 (I) |
| Tilstand | React Context med `useReducer`, uten eget bibliotek | C + I |
| Lagring | `localStorage`, ett lite utdrag per ferdigprodukt, synkront grensesnitt | Alle / S + I |
| Planlagte mottak | Hvert mottak holdes for seg og legges ikke sammen på forhånd | S + I |
| Forklaringer (FR-18) | Grunnlaget ligger ferdig i resultatet | S + I |
| Tester | Vitest (`npm test`) og noen Playwright-tester (`npm run test:e2e`) | Alle / C + I |
| Kvalitet før fletting | oxlint, og test, lint og build grønne. Eksakte versjoner | E-3, E-4 |
| Feil under tegning | React-feilgrense med norsk reservemelding | E-5 |
| Publisering | Statisk på Vercel med full, streng CSP | Alle / C + I / E-6 |
| Koordinator for `typer.ts` | Idun | E-2 |
| Navn i koden | ASCII: æ, ø og å skrives ae, o og a | C + I |
| Visninger | Introduksjon, Ny kjøring, Resultat og Lagrede kjøringer | Avgjort av gruppen 22.11 (PRD FR-27, ordbanken) |
| Rekkefølgen i resultatet | Tallbokser, kritiske deler, bestillingsforslag, endringer, resultattabell, kapasitet. Ingen ukeplan | Avgjort av gruppen 22.11 (PRD §4.4) |
| Slutten av stykklisten | Første rad der Nivå og Varenummer er tomme. Innhold under gir én valideringsfeil (V-S01) | G-2 (I) |
| Tidsgrense | 30 sekunder for lesing og beregning. Ingen grense for filstørrelse | G-4 (I) |
| Excel-testing (NFR-11) | Mac: Carmen og Idun. Windows: Sebastian og Oda | G-6 |
| **Åpent** | Hvem bygger hva (resten av G-6) | Kapittel 8 |

## 3. Oppbygging

Appen har seks deler i hver sin mappe under `src/` (G-3, avgjort av gruppen 22.11). Teksten bruker navnet på delen, og tabellen viser mappen.

```text
 Brukerens nettleser (alt skjer her)
 ┌──────────────────────────────────────────────────────────────────┐
 │  UI (React)  ──▶  Styring av kjøringen  ──▶  Lagring (localStorage)│
 │      ▲                    │                                        │
 │      │ Kjoring            ▼                                        │
 │      │        Excel-delen (SheetJS)  →  Kjernen (ren TypeScript)   │
 │      │        les fil → rådata          valider → struktur →       │
 │      │                                  beregn → eksepsjoner →     │
 │      └───────────────────────────────── kapasitet → sammenlign     │
 │  Tekster: all norsk tekst                                          │
 └──────────────────────────────────────────────────────────────────┘
        ▲ bare statiske filer
 ┌──────┴──────┐
 │ Vercel      │  ingen serverfunksjoner, ingen analyse
 └─────────────┘
```

| Del | Mappe | Ansvar | Kan bruke |
|---|---|---|---|
| Kjernen | `src/domene/` | Typer, validering, stykklistestruktur, MRP-beregning, eksepsjoner, kapasitet, utdrag og sammenligning | Bare seg selv |
| Tekster | `src/tekster/` | All norsk tekst og tallformatering | Typer fra kjernen |
| Excel-delen | `src/excel/` | Lese `.xlsx` til rådata og skrive eksportfilen | Kjernen, tekster, SheetJS |
| Lagring | `src/lagring/` | Lese, skrive og slette lagrede kjøringer og intro-nøkkelen | Typer fra kjernen |
| Styring | `src/app/` | Kjøre én kjøring fra fil til resultat i fast rekkefølge, og holde tilstanden | Kjernen, Excel-delen, lagring |
| UI | `src/ui/` | React-komponenter, visninger, hash-ruting, tastatur og fokus | Styring, tekster, typer fra kjernen |

Iduns forslag hadde også `src/worker/`. Den lages først når Web Worker innføres (FA-14).

```text
/
  src/
    domene/      typer.ts, valider.ts, struktur.ts, netting.ts, beregn.ts,
                 eksepsjoner.ts, kapasitet.ts, utdrag.ts, sammenlign.ts
    tekster/     nb.ts (all norsk tekst og formatering)
    excel/       les.ts (xlsx → rådata eller filfeil), eksport.ts
    lagring/     lagrede-kjoringer.ts (eneste bruk av localStorage)
    app/         kjoring.ts (rekkefølgen i FA-12), tilstand.tsx
    ui/          ruter.ts, introduksjon/, ny-kjoring/, resultat/, lagrede-kjoringer/,
                 resultattabell/, forklaringspanel/, kapasitet/, felles/
    main.tsx
  public/        COSI-MRP-mal.xlsx, testeksempel-01.xlsx (like filene i testdata/)
  tests/         samme mappestruktur som src/, pluss fasit/, validering/, arkitektur.test.ts
  e2e/           Playwright
  testdata/      malen, testeksemplene, fasitene, validering/, lag_testdata.py
  vercel.json    CSP og andre sikkerhetshoder
```

## 4. Beslutninger

Hver beslutning har nummer (FA-1 osv.), kravene den gjelder, og grunnlaget.

### FA-1: React, Vite og TypeScript

- **Grunnlag:** valgt på forhånd (C + I). Vite og TypeScript: alle. UI-komponenter: G-1, avgjort av gruppen 22.11 (S).
- **Gjelder:** NFR-3, NFR-6, NFR-8, FR-14–FR-18, FR-27
- **Regel:**
  - Prosjektet starter fra Vite-malen `react-ts`. TypeScript kjøres med `strict`. Skriften Source Sans 3 (DESIGN.md) ligger i bygget og hentes ikke fra Google eller andre (NFR-4).
  - **UI-et lages med vanlig HTML og CSS fra Odas prototype v3** (`ux-prototype-2026-11-17-v3/index.html`), skrevet om til React-komponenter. Prototypefilene endres ikke.
  - Det brukes **ikke noe komponentbibliotek** (ikke shadcn/ui, Radix eller Tailwind). Dialoger, nedtrekkslister og radioknapper er vanlig HTML (`<dialog>`, `<select>`, `<fieldset>` med radioknapper), med tastatur- og fokusoppførselen i EXPERIENCE.md.
  - **Disse delene av prototypen tas ikke med:** panelet Prototypevalg, prototypens egen ruting (erstattes av FA-13), mørk modus (bare lys i v1) og prototypens nøkler i `localStorage`.
  - Der prototypen og PRD-en eller ordbanken er ulike, gjelder PRD-en og ordbanken. Det gjelder for eksempel rekkefølgen i resultatet (FA-14) og navnene «Tallboks» og «Seksjonsmeny».
  - EXPERIENCE.md sier shadcn/ui, Radix og Tailwind, og må oppdateres med dette valget.

### FA-2: Ren kjerne og faste lag

- **Grunnlag:** ren kjerne: alle. Arkitekturtest: C + I.
- **Gjelder:** NFR-1, NFR-2, FR-3–FR-13, FR-20, FR-28, FR-29, FR-31–FR-33
- **Regel:**
  - Kjernen bruker ikke React, SheetJS, `window`, `document`, `localStorage` eller klokka. Samme inndata gir alltid samme svar (FR-8).
  - Tidspunktet for kjøringen settes utenfor kjernen, i styringen.
  - Delene kan bare bruke det tabellen i kapittel 3 tillater.
  - En arkitekturtest i Vitest leser importene i `src/` og feiler hvis en del bruker noe den ikke har lov til.

### FA-3: Datakontraktene skrives først

- **Grunnlag:** én fil for typene: alle. Story 0 og 1: C + I.
- **Gjelder:** alle FR
- **Regel:** Alle delte typer står i `typer.ts` i kjernen. To stories flettes inn i `main` før annet arbeid som bruker typene starter:
  - **Story 0:** prosjektoppsett med Vite, React, TypeScript, Vitest, arkitekturtest, `vercel.json` og README med kommandoene.
  - **Story 1:** alle delte typer.
- Senere endringer i en type skjer i en egen pull request som endrer `typer.ts` først. Ingen lager egne versjoner av delte typer.
- **Koordinator: Idun** (E-2, avgjort av gruppen 22.11). Koordinatoren eier `typer.ts`. En endring i delte typer flettes bare når koordinatoren og minst én som bruker typene, har godkjent den.

### FA-4: Data-konvensjoner

- **Grunnlag:** varenummer og uker: alle. Mottak for seg: S + I.
- **Gjelder:** FR-3, FR-5–FR-8, FR-12, FR-14, FR-17, FR-20, FR-29, NFR-11
- **Regel:**
  - Varenummer og nivå er tekst, uten mellomrom foran og bak. Tallet `300001` og teksten «300001» er samme varenummer.
  - Uker er nummerert 1 til H. En serie per uke er en liste med lengde H, der plass `i` er uke `i + 1`. Det finnes aldri en uke 0 i resultatet. Forfalt mengde er et eget felt.
  - Alle mengder er heltall. Bare disponibel beholdning og forventet lagerbeholdning kan være negative.
  - **Planlagte mottak holdes som enkeltlinjer** med varenummer, uke, antall og Excel-rad, og legges ikke sammen på forhånd. Kontrolleres mot fasit 04 når beregningen bygges.
  - **Heltall lagret som tekst godtas** (E-1, avgjort av gruppen 22.11). I et heltallsfelt godtas et tall som er et heltall, og en tekst som etter trimming bare er et valgfritt minustegn og sifre (`^-?[0-9]+$`), for eksempel «7» eller «007». Alt annet gir valideringsfeil: desimaltall (`30.5`, «30,5»), ord, tusenskilletegn («1 000»), plusstegn og tekst som «ca. 40». Etter tolkningen gjelder grensene i FR-3 som vanlig. Varenummer tolkes aldri som tall. Regelen får egne enhetstester og bør føres inn i FR-3.

### FA-5: Feil er verdier

- **Grunnlag:** alle.
- **Gjelder:** FR-1, FR-4, NFR-9, FR-19
- **Regel:**
  - Excel-delen og valideringen gir svar som `{ ok: true, verdi }` eller `{ ok: false, feil }`, og kaster ikke unntak for feil i brukerens data.
  - Excel-delen gir én kode for hver feil i hele filen (ikke en Excel-fil, tom fil, skadet fil). Hver kode får sin egen melding (NFR-9).
  - Valideringen samler alle feilene før den svarer, også etter FR-2-regelen om å hoppe over kontroller som avhenger av noe som mangler.
  - Styringen har den ene `try/catch` som gjør en uventet feil om til en norsk melding. Ved feil vises ingen resultat, og ingenting lagres.
  - **Tidsgrense på 30 sekunder** (G-4, avgjort av gruppen 22.11): tar lesing og beregning mer enn 30 sekunder, gir det «uventet feil», og brukeren kan laste opp en ny fil (NFR-9). Det er ingen grense for filstørrelse. Grensen kan bare håndheves helt når lesingen og beregningen kjører i en Web Worker, fordi hovedtråden ikke kan avbryte SheetJS midt i en fil. Til worker-en innføres (FA-14), måler styringen tiden og gir feilen når arbeidet er ferdig.
  - **React-feilgrense** (E-5, avgjort av gruppen 22.11): én feilgrense rundt visningene fanger feil under tegning, som `try/catch` i styringen ikke fanger. Den viser en norsk reservemelding og lar brukeren gå til Ny kjøring og laste opp på nytt uten å laste siden på nytt (NFR-9).

### FA-6: Én eier av stykklistestrukturen

- **Grunnlag:** S + I.
- **Gjelder:** FR-3, FR-5, FR-9, FR-10, FR-28, FR-31
- **Regel:** Bare `struktur.ts` i kjernen bygger `Struktur` fra stykklisteradene: unike deler i stykklisterekkefølge, overordnede deler med antall, lavnivåkode, ledetid fra ferdigproduktet (lengste sti) og antall per ferdigprodukt. Valideringen, beregningen, eksepsjonene og kapasiteten leser bare `Struktur`. Deler beregnes etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge.

### FA-7: Én implementasjon av nettingen

- **Grunnlag:** S + I.
- **Gjelder:** FR-6–FR-8, FR-24–FR-26, FR-31–FR-33
- **Regel:**
  - Beregningen for én del (disponibel beholdning, fremskynding, nettobehov, planlagt ordremottak, frigivelse) finnes bare i `netting.ts`, med et innstillingsobjekt.
  - Kapasiteten (FR-31) bruker den med ledig beholdning, SS 0, uten fremskynding, uten forfalte frigivelser og uten ordre på deler uten underdeler. Fast partistørrelse (FR-25) er én innstilling til.
  - Eksepsjonene finnes etterpå, ut fra svaret fra nettingen, aldri inne i den.

### FA-8: Beregningen gir alt skjermen viser

- **Grunnlag:** S + I.
- **Gjelder:** FR-13–FR-18, FR-22, FR-32–FR-34
- **Regel:**
  - For hver del og uke gir beregningen de seks radene og en `Utregning` med tallene bak: beholdning forrige uke, planlagte mottak, bruttobehov fordelt på overordnede deler, disponibel beholdning før og etter fremskynding, SS, nettobehov, fremskyndede mottak og forfalt mengde. Forklaringspanelet (FR-18) viser disse.
  - `Resultat` har også bestillingsforslagene, eksepsjonene og de kritiske delene, ferdig sortert.
  - UI-et og eksporten formaterer bare. Ingen kode utenfor kjernen regner MRP.

### FA-9: Koder i kjernen, norsk tekst på ett sted

- **Grunnlag:** alle. Kodenavnene: S + I.
- **Gjelder:** NFR-7, FR-4, FR-9–FR-13, FR-18, FR-29, FR-33
- **Regel:**
  - Kjernen gir koder og tall, aldri ferdig tekst. Eksepsjonskodene er `LEDETID_OVERSKRIDER_HORISONT`, `BESTILLING_FORSINKET`, `BRUK_AV_SIKKERHETSLAGER`, `MOTTAK_FORSINKET` og `KANSELLER_MOTTAK`.
  - Hver eksepsjon har alle opplysningene kravet sier meldingen skal ha, så teksten kan lages fra eksepsjonen alene.
  - All tekst brukeren ser, også i eksporten, lages i tekst-delen. Ordene følger ordbanken.

### FA-10: Lagring av siste kjøring

- **Grunnlag:** `localStorage`, nøkkel og utdrag: alle. Innholdet og synkront grensesnitt: S + I.
- **Gjelder:** FR-19–FR-21, FR-30, NFR-10
- **Regel:**
  - Bare én fil i lagringsdelen bruker `localStorage`. Hver lesing og skriving står i `try/catch`.
  - Nøkkelen er `cosi-mrp:kjoring:<varenummer på nivå 0>`. Én kjøring per ferdigprodukt, og en ny erstatter den gamle.
  - Utdraget har `schemaVersjon`, varenummer og navn på ferdigproduktet, tidspunkt, delene (varenummer, beskrivelse), bestillingsforslagene (varenummer, frigivelsesuke, mengde) og eksepsjonene (varenummer, uke, type). Excel-filen lagres aldri.
  - Er lagringen blokkert eller full, vises kjøringen som vanlig med en melding om at den ikke er lagret. Et utdrag med ukjent `schemaVersjon` regnes som om det ikke finnes.
  - Sletting (FR-21) fjerner nøkkelen. En kjøring med bare produksjonskapasitet lagres ikke (FR-30).
  - Siden «Lagrede kjøringer» lager listen ved å gå gjennom nøklene med prefikset `cosi-mrp:kjoring:`. Det er ingen egen indeks (C + S).
  - Den eneste andre nøkkelen er `cosi-mrp:intro-sett`, som sier om introduksjonssiden er vist i denne nettleseren (S, gjelder nå fordi gruppen valgte introduksjonsside 22.11). Er lagringen blokkert, vises introduksjonssiden ved hvert besøk.

### FA-11: Sammenligning i kjernen

- **Grunnlag:** ren funksjon og rekkefølge: alle. Identiteter og koder: S + I.
- **Gjelder:** FR-20, FR-23
- **Regel:** `sammenlign.ts` i kjernen sammenligner to utdrag og gir en `Sammenligning`.
  - Et bestillingsforslag kjennes igjen på varenummer og frigivelsesuke, og en eksepsjon på varenummer, uke og type.
  - Gruppene kommer i rekkefølgen Bestillingsforslag, Eksepsjoner, Deler, og linjene i samme rekkefølge som arket Sammenligning i `testeksempel-03-fasit.xlsx`.
  - Endringstypene er kodene `NY`, `ENDRET_MENGDE`, `FJERNET` og `BORTE`. Teksten lages i tekst-delen.
  - Skjermen og eksporten bruker samme `Sammenligning` uten å sortere den på nytt.

### FA-12: Én kjøring, fast rekkefølge

- **Grunnlag:** alle.
- **Gjelder:** FR-4, FR-19, FR-20, FR-30, NFR-9, NFR-10
- **Regel:** Bare styringen kjører en kjøring, i denne rekkefølgen:
  1. Les filen med Excel-delen.
  2. Valider og bygg strukturen.
  3. Ved feil: vis feilene og stopp. Ingenting lagres.
  4. Les forrige utdrag for ferdigproduktet.
  5. Kjør beregningene som er valgt (bestillingsplan, kapasitet eller begge).
  6. Sammenlign med forrige utdrag (bare når bestillingsplanen er valgt).
  7. Lag én `Kjoring` med alt skjermen trenger.
  8. Lagre det nye utdraget (bare når bestillingsplanen er valgt og alt over gikk bra).
  9. Gi `Kjoring` til tilstanden, så Resultat vises.

### FA-13: Tilstand og navigasjon

- **Grunnlag:** Context og `useReducer`: C + I. Hash-ruting: G-7, avgjort av gruppen 22.11 (C).
- **Gjelder:** FR-1, FR-19–FR-21, FR-27, FR-30, EXPERIENCE › Adresse og historikk
- **Regel:**
  - Appen har fire visninger med menyvalgene fra ordbanken: **Introduksjon**, **Ny kjøring** (startsiden), **Resultat** og **Lagrede kjøringer** (PRD FR-27 og ordbanken, avgjort 22.11).
  - Felles tilstand ligger i React Context med `useReducer`: den viste kjøringen og statusmeldinger. Det brukes ikke noe tilstands- eller rutebibliotek.
  - **Hver visning har sin egen hash-adresse** i ASCII: `#/introduksjon`, `#/ny-kjoring`, `#/resultat` og `#/lagrede-kjoringer`. Rutingen skrives selv. Den lytter på `hashchange`, og rutetabellen ligger i `ui/ruter.ts`. Tilbake og Frem i nettleseren følger adressene, og en visning kan bokmerkes.
  - Uten adresse eller med en ukjent adresse går appen til `#/introduksjon` første gang i en nettleser og ellers til `#/ny-kjoring` (FA-10, `cosi-mrp:intro-sett`).
  - Etter en vellykket kjøring setter styringen adressen til `#/resultat`.
  - Resultatet og filen finnes bare i minnet. Åpnes `#/resultat` uten en kjøring i minnet, for eksempel etter reload eller fra et bokmerke, vises en kort melding med lenke til Ny kjøring.
  - Lokal tilstand som filtre, valgt celle og åpent panel legges ikke i adressen.
  - Seksjonsmenyen på Resultat ruller til seksjonen med `scrollIntoView` og bruker ikke `href="#…"`, fordi det ville endret ruten.
  - EXPERIENCE.md sier at startsiden og resultatsiden har samme adresse, og må oppdateres med dette valget.
  - Én `role="status"`-region ligger i rotkomponenten og byttes aldri ut.

### FA-14: Resultattabell og ytelse

- **Grunnlag:** memo per del og lokal tilstand: C + I. Tiltakene ved treghet: EXPERIENCE.md.
- **Gjelder:** FR-14–FR-18, NFR-5, NFR-8
- **Regel:**
  - Resultatet vises i denne rekkefølgen (PRD §4.4 og ordbanken, avgjort 22.11): tallboksene, kritiske deler, bestillingsforslag, endringer (når de finnes), resultattabellen og produksjonskapasiteten (når den er valgt). Uten kritiske deler vises bare en kort melding (FR-16). Det er ingen ukeplan.
  - Resultattabell er én semantisk `<table>` med én `<tbody>` per del. Hver del er memoisert, så bare delen som endres, tegnes på nytt.
  - Valgt celle, ukefilter, filteret «Vis bare kritiske deler» (FR-16) og åpent forklaringspanel er lokal tilstand i visningen, ikke felles tilstand. Filteret skjuler bare deler på skjermen og endrer ikke `Resultat` eller eksporten.
  - Ytelsen måles tidlig med en fil på 1000 rader. Nås ikke 3 sekunder, prøves først Web Worker for lesing og beregning (C + S), deretter tiltakene i EXPERIENCE.md: `content-visibility: auto`, virtualisering, sammenslått visning.

### FA-15: Excel inn og ut med SheetJS

- **Grunnlag:** valgt på forhånd (S + I).
- **Gjelder:** FR-1, FR-2, FR-22, FR-23, FR-27, NFR-11
- **Regel:**
  - Bare Excel-delen importerer SheetJS (og en hjelpefunksjon i testene som leser fasitfilene).
  - SheetJS installeres fra `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`, aldri med `npm i xlsx`. Pakken på npm er en gammel versjon med kjente sikkerhetshull.
  - Ark og kolonner finnes etter navn, ikke plass (S + I). Excel-delen leser lagrede verdier og aldri formler. Hver rad får sitt Excel-radnummer.
  - **Hvor stykklisten slutter** (G-2, avgjort av gruppen 22.11, I): stykklisten slutter ved første rad der både Nivå og Varenummer er tomme, slik addendumet sier.
    - Excel-delen leser likevel videre i malens kolonner A–H til og med rad 1001 og tar med om det står noe under den tomme raden.
    - Står det innhold under, gir valideringen **én** feil på den tomme raden (FR-3: «Fra rad 2 og sammenhengende nedover»). Radene under leses ikke inn.
    - Formlene i hjelpekolonnene telles ikke som innhold.
    - Slik gir `testdata/validering/V-S01.xlsx` nøyaktig én feil på rad 9, slik `testdata/validering/README.md` krever.
  - Arkene Veiledning og Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke (alle).
  - Excel-delen avgjør aldri om noe er feil. Det gjør valideringen i kjernen (alle).
  - Eksporten bygger arbeidsboka fra `Kjoring`, med arket Sammenligning når det finnes (FR-22, FR-23).

### FA-16: Tester

- **Grunnlag:** Vitest og fasit: alle. Arkitekturtest og Playwright: C + I.
- **Gjelder:** NFR-2, NFR-5, SM-1, SM-2, SM-4, SM-5, SM-7
- **Regel:**
  - `testdata/lag_testdata.py` importeres, oversettes eller kopieres aldri inn i appen. Det kan brukes til å lage inndatafiler, for eksempel filen med 1000 rader.
  - Fasittestene leser `testdata/*-fasit.xlsx` og kjører samme vei som appen. Tall, eksepsjoner (varenummer, uke, type), valideringsfeil (ark, rad, felt, kode) og linjene i sammenligningen sammenlignes. Ordlyden sammenlignes ikke.
  - Hver fil i `testdata/validering/` har sin egen test, med antall feil og stedet fra `testdata/validering/README.md`. `V-S01.xlsx` (tom rad midt i stykklisten) skal gi nøyaktig én feil på rad 9 (G-2).
  - **Excel for Windows og Mac** (NFR-11, G-6): testeksempel 01 og 02 åpnes og lagres på nytt i Excel for Mac av Carmen og Idun, og i Excel for Windows av Sebastian og Oda. Filene legges inn som egne testfiler og skal gi samme resultat som de opprinnelige. Eksportfilen åpnes i Excel på begge.
  - `npm test` kjører alt i Vitest, inkludert arkitekturtesten, uten nett, nøkler eller kontoer.
  - En test sjekker at malen og testeksempel 01 i `public/` er like filene i `testdata/` (FR-27).
  - `npm run test:e2e` kjører Playwright: opplasting av testeksempel 01, de tre filene i NFR-9 og blokkert lagring (NFR-10). Den er ikke med i `npm test`.
  - Testene ligger i `tests/` med samme mappestruktur som `src/` (S + I).
  - **Eksakte versjoner** (E-4, avgjort av gruppen 22.11): alle avhengigheter i `package.json` har eksakt versjon, uten `^` og `~`. `package-lock.json` committes, og `npm ci` brukes. Arkitekturtesten sjekker at ingen versjon har `^` eller `~`.
  - `npm run test:e2e` sjekker også at ingen side gir brudd på CSP-en (FA-17).

### FA-17: Statisk publisering uten datautgang

- **Grunnlag:** statisk Vercel: alle. CSP: C + I. Byggflagg og brukertest-branch: S + I.
- **Gjelder:** NFR-3, NFR-4, NFR-6, §8.1
- **Regel:**
  - `npm run build` lager statiske filer, og Vercel publiserer dem. Ingen serverfunksjoner, ingen Vercel Analytics eller Speed Insights, og ingen skript eller skrifter fra tredjepart.
  - **Full CSP** (E-6, avgjort av gruppen 22.11). `vercel.json` setter denne Content Security Policy, så nettleseren selv stopper forsøk på å sende data ut:
    `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; worker-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`
  - `vite preview` bruker den samme CSP-en, og en test sjekker at de to er like. Da finner `npm run test:e2e` brudd før publisering.
  - I Carmens forslag hadde `worker-src` også `blob:`. Det trengtes for read-excel-file. SheetJS trenger det ikke, så `blob:` er tatt ut av `worker-src`.
  - Miljøer: lokalt (`npm run dev`), forhåndsvisning på Vercel per branch, og produksjon fra `main`.
  - Ett byggflagg, `VITE_KAPASITET`, skjuler produksjonskapasiteten hvis trinn 4 kuttes, og i bygget til brukertesten.
  - Brukertesten 2.–7. desember bruker en egen branch `brukertest` som fryses den uka.

### FA-18: Arbeidsflyt

- **Grunnlag:** branch og pull request: C + I. CI utsatt: S + I. Kontrollene før fletting: E-3, avgjort av gruppen 22.11.
- **Regel:**
  - Én branch per story og pull request inn i `main`. Minst én annen i gruppen ser over før fletting.
  - **Grønne kontroller før fletting** (E-3): `npm test`, `npm run lint` og `npm run build` må være grønne. `npm run lint` kjører oxlint.
  - Automatiske kontroller på GitHub (CI) er utsatt, men kan legges til uten å endre noe her.

## 5. Konvensjoner

| Område | Konvensjon | Grunnlag |
|---|---|---|
| Navn i koden | Norske fagord fra ordbanken. Æ, ø og å skrives ae, o og a (`LagretKjoring`, `lagret-kjoring.ts`). camelCase for verdier og funksjoner, PascalCase for typer og komponenter. Nye fagord legges først inn i ordbanken. | C + I |
| Filnavn | `kebab-case.ts` for kode, `PascalCase.tsx` for React-komponenter | S + I |
| Rekkefølge | Deler følger stykklisten, og en felles del står der den står første gang (FR-16). Bestillingsforslag sorteres på frigivelsesuke og så stykklisterekkefølge. Eksepsjoner sorteres på stykklisterekkefølge, uke («–» først) og typen i rekkefølgen i PRD §4.3. | Alle |
| Tall | Heltall uten desimaler, formatert med `Intl.NumberFormat('nb-NO')` i tekst-delen | Alle |
| Tilgjengelighet | Markeringer har alltid farge og tekst eller symbol (NFR-8). Forklaringspanelet åpnes ved klikk, trykk eller Enter, aldri ved peking (FR-18). Ingen `alert()`. | Alle |
| Kommandoer | `npm ci`, `npm run dev`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`. De står i README (NFR-3). | C + I, E-3, E-4 |

## 6. Teknologi og versjoner

Versjonene er sjekket 22.11.2026 og låses eksakt i `package.json` (E-4).

| Navn | Versjon | Grunnlag |
|---|---|---|
| Node.js | 24 LTS (i `engines` og på Vercel) | Alle |
| TypeScript | 7.0.2 | C + I |
| Vite | 8.3.8 | Alle |
| React og react-dom | 19.3.1 | Valgt på forhånd |
| @vitejs/plugin-react | 6.3.0 | C + I |
| SheetJS Community Edition | 0.20.3 (fra cdn.sheetjs.com) | Valgt på forhånd |
| Vitest | 5.1.1 | Alle |
| @playwright/test | 1.65.1 | C + I |
| oxlint | 1.94.0 | E-3 |
| UI-komponenter og CSS | Ingen bibliotek. Vanlig HTML og CSS fra Odas prototype v3 | G-1 |
| @fontsource/source-sans-3 | 5.3.1 | FA-1 (skrift i bygget) |

## 7. Byggerekkefølge

Rekkefølgen følger PRD §7.1, så trinn 1–3 kan være testet før kuttbeslutningen 30. november.

| Nr. | Arbeid | Trinn |
|---|---|---|
| 0 | Story 0: prosjektoppsett | – |
| 1 | Story 1: alle delte typer | – |
| 2 | Excel-delen (lesing) og valideringen, med testene i `testdata/validering/` | 1 |
| 3 | Struktur, netting og beregning, med fasittester for testeksempel 01–04 | 1 |
| 4 | Eksepsjoner, med fasittester | 1 |
| 5 | Styringen og tilstanden | 1 |
| 6 | Introduksjon, Ny kjøring, Resultat og Resultattabell med filteret «Vis bare kritiske deler». Ytelsesmåling med 1000 rader | 1 |
| 7 | Forklaringspanelet | 2 |
| 8 | Lagring, sammenligning, siden Lagrede kjøringer og eksport | 3 |
| 9 | Produksjonskapasitet, med fasittest for testeksempel 05 | 4 |
| 10 | Fast partistørrelse | 5 |

Når nr. 1 er flettet inn, kan nr. 2–4 og nr. 6 gjøres samtidig. UI-et kan bygges mot eksempeldata hentet fra fasit 01.

## 8. Gruppens avgjørelser 22.11 (der forslagene var ulike)

Alle avgjørelsene her er godkjent av hele gruppen 22.11.

| Nr. | Spørsmål | Carmen | Sebastian | Idun | **Avgjort** | Ført inn i |
|---|---|---|---|---|---|---|
| G-1 | UI-komponenter | Ingen bibliotek | Vanlig HTML, og HTML og CSS fra Odas v3 portes | shadcn/ui og Tailwind | **Sebastians**: vanlig HTML og CSS fra Odas v3 | FA-1 |
| G-2 | Hvor stykklisten slutter | Siste rad med verdi | Helt tomme rader hoppes over | Første rad der Nivå og Varenummer er tomme (addendumet) | **Iduns**, med en valideringstest mot PRD-en: innhold under den tomme raden gir én feil (V-S01) | FA-15, FA-16 |
| G-3 | Mappestruktur og navn | `kjerne/`, `inn/`, `flyt/` … | `core/`, `shell/` … | `domene/`, `excel/`, `app/` … | **Iduns**, uten `worker/` til worker-en innføres | Kapittel 3 |
| G-4 | Grenser for filstørrelse og tid | 10 MB / 15 s | Ingen | 30 s | **Iduns**: 30 sekunder, ingen grense for størrelse | FA-5 |
| ~~G-5~~ | Resultatsiden (U5, U6, U14) | | | | **Avgjort i PRD-en 22.11**: kritiske deler først, introduksjonsside, ingen ukeplan | FA-13, FA-14 |
| G-6 | Hvem tester med Excel (NFR-11) | | | | **Mac: Carmen og Idun. Windows: Sebastian og Oda** | FA-16 |
| G-7 | Navigasjon med fire visninger | Hash-adresser | Samme adresse | Samme adresse | **Carmens**: egen hash-adresse per visning | FA-13 |

**Står igjen:**

| Nr. | Spørsmål | Merknad |
|---|---|---|
| G-6 | Hvem bygger hva | Fordelingen av nr. 2–10 i kapittel 7. Testing med Excel og koordinator for `typer.ts` (Idun) er avgjort. |

**Dokumenter som må oppdateres etter avgjørelsene:**
- **EXPERIENCE.md:** shadcn/ui, Radix og Tailwind (G-1), samme adresse for alle visninger (G-7), og de fire visningene fra 22.11.
- **PRD FR-3:** regelen om tom rad (G-2) og heltall lagret som tekst (E-1) bør stå i kravet.

## 9. Bare ett forslag tok stilling (avgjort av gruppen 22.11)

De andre forslagene sa ingenting om disse punktene. Gruppen avgjorde dem 22.11, og svarene er ført inn i beslutningene.

| Nr. | Forslag | Fra | Svar | Ført inn i |
|---|---|---|---|---|
| E-1 | Heltall lagret som tekst («7») godtas som tallet 7 | C | **Ja** | FA-4. Bør også føres inn i FR-3. |
| E-2 | Én koordinator eier `typer.ts` og godkjenner endringer | C | **Idun** | FA-3 |
| E-3 | oxlint, og `npm test`, `npm run lint` og `npm run build` grønne før fletting | C | **Ja** | FA-18, kapittel 6 |
| E-4 | Eksakte versjoner i `package.json`, sjekket av en test | C | **Ja** | FA-16, kapittel 6 |
| E-5 | React-feilgrense med norsk reservemelding | C | **Ja** | FA-5 |
| E-6 | Full, streng CSP med test | C | **Ja** | FA-17. `blob:` er tatt ut av `worker-src`, fordi bare read-excel-file trengte det. |
| ~~E-7~~ | ~~Elementet øverst på resultatsiden heter `Statuslinje` i koden, aldri «Sammendrag»~~ | S | **Løst av ordbanken 22.11:** boksene øverst heter «Tallboks» (i koden `Tallboks`), og «sammendrag» er sammendraget av kritiske deler (FR-16). Raden med knapper heter «Seksjonsmeny». |

## 10. Utsatt

- **Web Worker:** når målingen med 1000 rader viser over 3 sekunder (FA-14).
- **IndexedDB:** først hvis hele kjøringer eller flere kjøringer per ferdigprodukt skal lagres.
- **Virtualisering av tabellen:** først hvis målingen viser at det trengs.
- **Engelsk tekst:** tekst-delen er forberedt, men bare norsk lages i v1.
- **CI på GitHub:** kan legges til senere (FA-18).
- **Flere ferdigprodukter samlet, hva-om-scenarier og mer enn tre nivåer:** utenfor v1 (PRD §7.2).
