---
title: 'COSI - MRP: arkitekturforslag'
type: architecture
status: forslag
owner: 'Idun Samdal – individuelt forslag, ikke gruppevedtak'
created: '2026-11-22'
updated: '2026-11-22'
binds: [FR-1–FR-34, NFR-1–NFR-11]
sources:
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/prd.md (final, oppdatert 22.11)'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/addendum.md (Innspill til arkitekturen)'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md, -09.md, -13.md'
  - '.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-13/EXPERIENCE.md og DESIGN.md'
  - '.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/'
  - '.docs/ordbank.md'
  - 'testdata/'
---

# Arkitekturforslag for COSI - MRP

**Forslag fra Idun, ikke vedtatt av gruppen.** Dokumentet bygger på PRD-en (final, oppdatert 22.11), addendumet, ordbanken, UX-dokumentene og testdataene. Ved avvik gjelder PRD-en.

**Oppdatert 22.11 etter UX-avklaringene gruppen godkjente samme dag** (PRD §4.4, FR-16, FR-27 og ordbanken): kritiske deler står først i resultatet, appen har en introduksjonsside ved første besøk og fire menyvalg, resultattabellen har filteret «Vis bare kritiske deler», og ukeplanen er fjernet. Endret i AB-10, AB-14, AB-15 og kapittel 11.

## 1. Sammendrag

COSI - MRP blir én statisk nettapp som kjører helt i brukerens nettleser. Vercel leverer bare filene. Excel-filen leses, kontrolleres og beregnes på brukerens maskin, og siste kjøring per ferdigprodukt lagres i nettleseren.

De viktigste valgene:

| Område | Forslag | Hvorfor, kort |
|---|---|---|
| Språk og bygg | TypeScript (strict) og Vite | Typene fanger feil i dataformene. Vite gir en enkel statisk build. |
| Brukergrensesnitt | React med shadcn/ui og Tailwind | UX-dokumentene har valgt shadcn/ui og Radix, og de finnes bare for React. |
| Beregning | Ren TypeScript-kjerne uten nettleser-API | NFR-1: beregningen kan testes alene mot fasit. |
| Kjøring | Lesing, kontroll og beregning i en Web Worker | Siden henger ikke mens appen regner, og en krasj i beregningen tar ikke ned siden (NFR-9). |
| Excel | SheetJS Community Edition, bare i én mappe | Ett bibliotek leser og skriver. Det leser lagrede verdier og ikke formler (NFR-11). |
| Lagring | `localStorage` med et lite utdrag per ferdigprodukt | Nok plass, enkelt å teste, og sletting er én linje (FR-19–FR-21, NFR-10). |
| Tester | Vitest mot fasitfilene, med `npm test` | NFR-2: én kommando, uten nøkler og nett. |
| Publisering | Statiske filer på Vercel, med en streng CSP | CSP-en hindrer teknisk at data sendes ut (NFR-4). |

## 2. Overordnet oppbygging

Appen er delt i lag. Innerst ligger domenet, som bare regner. Ytterst ligger det som har sideeffekter: fil, lagring, worker og skjerm.

```text
 Brukerens nettleser
 ┌──────────────────────────────────────────────────────────────────┐
 │  Hovedtråd                                                        │
 │  ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐     │
 │  │ ui/ React  │──▶│ app/kjoring  │──▶│ lagring/ localStorage│     │
 │  └────────────┘   └──────┬───────┘   └──────────────────────┘     │
 │        ▲                 │ ArrayBuffer + valg                     │
 │        │ Kjoring         ▼                                        │
 │        │          ┌─────────────────────────────────────────┐     │
 │        │          │ Web Worker                               │     │
 │        │          │ excel/les → domene/valider → struktur    │     │
 │        └──────────│ → beregn → eksepsjoner → kapasitet       │     │
 │                   └─────────────────────────────────────────┘     │
 │  excel/eksport (hovedtråd, ved klikk) → nedlasting av .xlsx       │
 └──────────────────────────────────────────────────────────────────┘
        ▲ bare statiske filer (HTML, JS, CSS, malen, testeksempel 01)
 ┌──────┴──────┐
 │ Vercel      │  ingen serverfunksjoner, ingen analyse
 └─────────────┘
```

### Lag og hva de kan bruke

| Lag | Mappe | Ansvar | Kan importere |
|---|---|---|---|
| Domene | `src/domene/` | Typer, kontroll, stykklistestruktur, MRP-beregning, eksepsjoner, kapasitet, sammenligning | Bare `src/domene/` |
| Tekster | `src/tekster/` | All norsk tekst og tallformatering | Typer fra `domene/` |
| Excel | `src/excel/` | Lese `.xlsx` til rådata, skrive eksportfilen | `domene/`, `tekster/`, SheetJS |
| Lagring | `src/lagring/` | Lese, skrive og slette lagrede kjøringer | Typer fra `domene/` |
| Worker | `src/worker/` | Kjøre lesing, kontroll og beregning utenfor hovedtråden | `domene/`, `excel/` |
| App | `src/app/` | Styre én kjøring fra fil til resultat, og holde tilstanden | Alt over |
| UI | `src/ui/` | React-komponenter, visninger, tastatur og fokus | `app/`, `tekster/`, typer fra `domene/` |

En egen arkitekturtest i Vitest leser importene i `src/` og feiler hvis et lag importerer noe det ikke har lov til. Da er regelen sjekket hver gang testene kjøres.

## 3. Arkitekturbeslutninger

Hver beslutning har et nummer (AB-1 osv.), kravene den gjelder, problemet den hindrer, og regelen.

### AB-1: React, Vite og TypeScript

- **Gjelder:** NFR-3, NFR-6, FR-14–FR-18
- **Hindrer:** et UI-bibliotek som ikke passer UX-valgene, og et oppsett som krever server.
- **Regel:** Prosjektet starter fra Vite-malen `react-ts` med `strict` i TypeScript. UI-komponenter utenom Resultattabell og forklaringspanel lages med shadcn/ui (Radix) og Tailwind, slik EXPERIENCE.md sier. Resultattabell (semantisk `<table>`) og forklaringspanel (ikke-modal `<aside>`) lages selv. Skriften Source Sans 3 legges i bygget med `@fontsource`, så ingen skrift hentes fra Google eller andre (NFR-4).
- **Hvorfor React:** shadcn/ui og Radix finnes bare for React, og UX-dokumentene bygger på dem. React har også mest dokumentasjon og eksempler, og det gjør det lettere å styre KI-verktøyene og å få hjelp.

### AB-2: Ren beregningskjerne

- **Gjelder:** NFR-1, NFR-2, FR-3–FR-13, FR-20, FR-28, FR-29, FR-31–FR-33
- **Hindrer:** MRP-regler i React-komponenter, og en beregning som bare kan testes gjennom nettleseren.
- **Regel:** `src/domene/` bruker ikke React, SheetJS, `window`, `document`, `localStorage` eller klokka. Funksjonene tar inn vanlige data og gir vanlige data tilbake. Samme inndata gir alltid samme svar (FR-8). Tidspunktet for kjøringen settes i `app/`, ikke i domenet.

### AB-3: Datakontraktene skrives først

- **Gjelder:** alle FR
- **Hindrer:** at to deler av koden har hver sin form på det samme, for eksempel en «del» som én rad i stykklisten ett sted og én unik del et annet sted.
- **Regel:** Alle delte typer står i `src/domene/typer.ts`. Den første story-en i utviklingen skriver dem ferdig og flettes inn i `main` før noen story som bruker dem starter. Senere endringer i en type skjer i en egen pull request som endrer `typer.ts` først.

De viktigste typene:

| Type | Innhold |
|---|---|
| `RaaArk` | Arkene i filen med overskrifter og rader som rå celleverdier, og Excel-radnummeret for hver rad |
| `Inndata` | Kontrollerte data: stykklisterader, horisont H, prognostiserte behov per uke, planlagte mottak som enkeltlinjer |
| `Struktur` | Unike deler i stykklisterekkefølge, overordnede deler med antall, lavnivåkode og ledetid fra ferdigproduktet |
| `DelResultat` | De seks radene per uke for én del, og grunnlaget for forklaringen per uke (`Utregning`) |
| `Resultat` | Alle `DelResultat`, bestillingsforslag, eksepsjoner og kritiske deler, ferdig sortert |
| `Eksepsjon` | Én variant per type med alle opplysningene kravet sier meldingen skal ha |
| `Valideringsfeil` | Kode, ark, rad, felt og verdi |
| `Kapasitet` | De to radene per uke, tabellen per del og begrensende deler med årsak |
| `LagretKjoring` | Utdraget som lagres (se AB-10) |
| `Sammenligning` | Endringslinjene i fast rekkefølge |
| `Kjoring` | Alt UI-et viser etter én kjøring: valg, resultat, kapasitet, sammenligning og lagringsstatus |

### AB-4: Data-konvensjoner

- **Gjelder:** FR-3, FR-5–FR-8, FR-14, FR-17, FR-20, NFR-11
- **Hindrer:** feil med ukenummer, og at varenummeret `300001` og teksten «300001» blir to deler.
- **Regel:**
  - Varenummer og nivå er alltid tekst, uten mellomrom foran og bak, etter kontrollen.
  - Uker er nummerert 1 til H. En serie per uke er en liste med lengde H, der plass `i` er uke `i + 1`. Det finnes aldri en uke 0 i resultatet. Forfalt mengde står som eget felt.
  - Alle mengder er heltall. Bare disponibel beholdning og forventet lagerbeholdning kan være negative.
  - Planlagte mottak holdes som enkeltlinjer med uke og antall, og legges ikke sammen per uke før beregningen trenger det. Da kan eksepsjonen «Mottak forsinket» vise hvilket mottak det gjelder.

### AB-5: Feil er verdier, ikke unntak

- **Gjelder:** FR-1, FR-4, NFR-9, FR-19
- **Hindrer:** halve resultater, at én del av koden kaster unntak mens en annen gir en feilliste, og at en feil endrer den lagrede kjøringen.
- **Regel:**
  - Alle lag over domenet gir svar som `{ ok: true, verdi }` eller `{ ok: false, feil }`.
  - `excel/les` gir én `Filfeil`-kode for hver feil i hele filen: ikke en Excel-fil, tom fil, skadet fil og passordbeskyttet fil. Hver kode får sin egen melding (NFR-9).
  - `domene/valider` samler alle valideringsfeil før den svarer, også etter FR-2-regelen om å hoppe over kontroller som avhenger av noe som mangler.
  - Domenet kaster bare ved programmeringsfeil. Worker-en fanger alt og svarer med «uventet feil». Hovedtråden behandler også en worker som krasjer eller ikke svarer innen 30 sekunder, som «uventet feil». Ved alle feil vises ingen resultat, og ingenting lagres.

### AB-6: Én eier av stykklistestrukturen

- **Gjelder:** FR-3, FR-5, FR-9, FR-10, FR-28, FR-31
- **Hindrer:** at kontroll, beregning, eksepsjoner og kapasitet bygger hvert sitt tre med ulike svar.
- **Regel:** Bare `domene/struktur.ts` bygger `Struktur` fra stykklisteradene: overordnet del er nærmeste rad over med ett nivå høyere, og like varenumre slås sammen. Den regner ut lavnivåkode, ledetid fra ferdigproduktet (lengste sti) og antall per ferdigprodukt. Kontrollen bruker den til reglene om underdeler. Beregningen, eksepsjonene og kapasiteten leser bare `Struktur`, aldri radene direkte. Deler beregnes etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge.

### AB-7: Én implementasjon av nettingen

- **Gjelder:** FR-6–FR-8, FR-24–FR-26, FR-31–FR-33
- **Hindrer:** en egen kopi av MRP-reglene i kapasiteten eller i fast partistørrelse.
- **Regel:**
  - Beregningen for én del (disponibel beholdning, fremskynding av mottak, nettobehov, planlagt ordremottak og frigivelse) finnes bare i `domene/netting.ts`.
  - Den tar et innstillingsobjekt: `{ fremskynd, sikkerhetslager, kanBestille, tillatForfalt, partistorrelse }`.
  - Bestillingsplanen kaller den med standardinnstillingene. Kapasiteten (FR-31) kaller den med ledig beholdning, SS 0, uten fremskynding, uten forfalte frigivelser og uten ordre på deler uten underdeler. Fast partistørrelse (FR-25) er én innstilling til.
  - Eksepsjonene finnes etterpå, ut fra svaret fra nettingen, i `domene/eksepsjoner.ts`. «Kanseller mottak» (FR-29) kjører nettingen for delen én gang til uten mottaket.

### AB-8: Beregningen gir alt skjermen viser

- **Gjelder:** FR-13–FR-18, FR-22, FR-32–FR-34
- **Hindrer:** at forklaringspanelet, listene eller eksporten regner tallene på nytt og får andre svar enn tabellen.
- **Regel:**
  - For hver del og uke gir beregningen de seks radene og en `Utregning` med tallene bak: beholdning forrige uke, planlagte mottak, bruttobehov fordelt på overordnede deler (varenummer, frigivelse, antall), disponibel beholdning før og etter fremskynding, SS, nettobehov, fremskyndede mottak og forfalt mengde. Det er grunnlaget for forklaringspanelet (FR-18).
  - `Resultat` inneholder også bestillingsforslagene, eksepsjonene og de kritiske delene, ferdig sortert.
  - UI-et og eksporten formaterer bare. Ingen kode utenfor domenet regner MRP.

### AB-9: Koder i domenet, norsk tekst på ett sted

- **Gjelder:** NFR-7, FR-4, FR-9–FR-13, FR-18, FR-29, FR-33
- **Hindrer:** norsk tekst spredt i komponentene, og tester som feiler fordi en setning er skrevet om.
- **Regel:**
  - Domenet gir koder og tall, aldri ferdig tekst. Eksepsjonskodene er `LEDETID_OVERSKRIDER_HORISONT`, `BESTILLING_FORSINKET`, `BRUK_AV_SIKKERHETSLAGER`, `MOTTAK_FORSINKET` og `KANSELLER_MOTTAK`.
  - All tekst brukeren ser, også i eksporten, lages i `src/tekster/nb.ts`. Ordene følger ordbanken.
  - Engelsk (videreutvikling) blir en ny fil `en.ts` med de samme funksjonene.

### AB-10: Lagring av siste kjøring

- **Gjelder:** FR-19–FR-21, FR-30, NFR-10
- **Hindrer:** at Excel-filen lagres, at lagringen blir full, og at en blokkert lagring stopper appen.
- **Regel:**
  - Bare `src/lagring/lagrede-kjoringer.ts` bruker `localStorage`. Hver lesing og skriving står i `try/catch`.
  - Nøkkelen er `cosi-mrp:kjoring:<varenummer på nivå 0>`. Det lagres én kjøring per ferdigprodukt, og en ny kjøring erstatter den gamle.
  - Det lagres bare det sammenligningen trenger: `schemaVersjon`, varenummer og navn på ferdigproduktet, tidspunkt, delene (varenummer, beskrivelse), bestillingsforslagene (varenummer, frigivelsesuke, mengde) og eksepsjonene (varenummer, uke, type). Selve Excel-filen og resultattabellen lagres ikke.
  - Selv med 1000 deler og forslag i alle 12 uker blir utdraget noen hundre kB. Det gir plass til mange ferdigprodukter innenfor grensen på cirka 5 MB.
  - Er lagringen blokkert eller full, vises kjøringen som vanlig med meldingen om at den ikke er lagret. En lagret kjøring med ukjent `schemaVersjon` regnes som om den ikke finnes.
  - Sletting (FR-21) fjerner nøkkelen. En kjøring med bare produksjonskapasitet lagres ikke (FR-30).
  - Siden «Lagrede kjøringer» lager listen ved å gå gjennom nøklene med prefikset `cosi-mrp:kjoring:`. Det finnes ingen egen indeks som kan komme i utakt.
  - Den eneste andre nøkkelen er `cosi-mrp:intro-sett` (sann eller usann). Den sier om introduksjonssiden er vist i denne nettleseren (FR-27). Er lagringen blokkert, vises introduksjonssiden ved hvert besøk. Det er greit, fordi den alltid har en knapp videre til startsiden.
- **Hvorfor ikke IndexedDB:** Utdraget er lite, og `localStorage` er enklere å bruke og å teste. Hele lagringen ligger i én fil, så et bytte senere endrer bare den.

### AB-11: Sammenligning i domenet

- **Gjelder:** FR-20, FR-23
- **Hindrer:** at skjermen og eksporten viser endringene i ulik rekkefølge eller med ulike regler.
- **Regel:** `domene/sammenlign.ts` sammenligner to `LagretKjoring` og gir en `Sammenligning`.
  - Et bestillingsforslag kjennes igjen på varenummer og frigivelsesuke, og en eksepsjon på varenummer, uke og type (FR-20).
  - Gruppene kommer i rekkefølgen Bestillingsforslag, Eksepsjoner, Deler, og linjene i samme rekkefølge som arket Sammenligning i `testeksempel-03-fasit.xlsx`.
  - Endringstypene er koder (`NY`, `ENDRET_MENGDE`, `FJERNET`). Teksten lages i `tekster/`.
  - Skjermen og eksporten bruker samme `Sammenligning` uten å sortere den på nytt.

### AB-12: Beregningen kjører i en Web Worker

- **Gjelder:** NFR-5, NFR-9, EXPERIENCE › State Patterns (Lasting)
- **Hindrer:** at siden fryser mens en stor fil regnes, og at en uventet feil i beregningen tar ned hele siden.
- **Regel:**
  - Hovedtråden sender filens innhold (`ArrayBuffer`) og valget (bestillingsplan, kapasitet eller begge) til worker-en.
  - Worker-en kjører `les`, `valider`, `byggStruktur`, `beregn` og `kapasitet`, og sender svaret tilbake som vanlige data.
  - Worker-en har ingen tilstand mellom kjøringer og rører ikke lagringen. Lagring og sammenligning skjer i hovedtråden etterpå (AB-13).
  - Testene kaller domenefunksjonene direkte, så de trenger ikke worker-en.
- **Hvorfor:** UX-dokumentene sier at statuslinja skal vise «Leser fila …» og «Beregner …», uten overlegg, og at Beregn ikke skal starte en ny kjøring mens beregningen pågår. Det krever at siden er levende mens appen regner. Kapasiteten (FR-31) gjør 2 × H søk med mange nettinger, så den kan ta tid med 1000 rader. Vite støtter Web Worker uten ekstra oppsett.

### AB-13: Én kjøring, fast rekkefølge

- **Gjelder:** FR-4, FR-19, FR-20, FR-30, NFR-9, NFR-10
- **Hindrer:** at en kjøring sammenlignes med seg selv, at en feilet kjøring endrer lagringen, og at en kjøring med bare kapasitet lagres.
- **Regel:** Bare `src/app/kjoring.ts` kjører en kjøring, i denne rekkefølgen:
  1. Send filen og valget til worker-en, og vent på svar.
  2. Ved feil: vis feilene, og stopp. Ingenting lagres.
  3. Les forrige `LagretKjoring` for ferdigproduktet.
  4. Lag utdraget av den nye kjøringen, og sammenlign med den forrige (bare når bestillingsplanen er valgt).
  5. Lag én `Kjoring` med alt skjermen trenger.
  6. Skriv den nye `LagretKjoring` (bare når bestillingsplanen er valgt og alt over gikk bra).
  7. Gi `Kjoring` til tilstanden, så resultatsiden vises.

### AB-14: Tilstand og navigasjon uten ruter

- **Gjelder:** FR-1, FR-19–FR-21, FR-27, FR-30, EXPERIENCE › Adresse og historikk
- **Hindrer:** at hver visning har sin egen kopi av kjøringen, og at adressen og tilstanden går i utakt.
- **Regel:**
  - Appen har fire visninger, med menyvalgene fra ordbanken: **Introduksjon** (introduksjonssiden), **Ny kjøring** (startsiden), **Resultat** og **Lagrede kjøringer** (FR-27, endret 22.11).
  - Tilstanden ligger i én React-kontekst med `useReducer`: visningen, den viste kjøringen og statusmeldinger. Det brukes ikke noe eget tilstandsbibliotek eller ruter.
  - Første besøk i en nettleser viser Introduksjon. Senere besøk og reload viser Ny kjøring. Det avgjøres av nøkkelen `cosi-mrp:intro-sett` (AB-10).
  - Alle visningene har samme adresse. Hvert bytte av visning legger inn ett historikkpunkt med `history.pushState`, med visningen i `state`, så Tilbake og Frem i nettleseren går mellom visningene.
  - Resultatet og filen finnes bare i minnet. Åpnes Resultat uten en kjøring i minnet, for eksempel etter reload, viser visningen en kort melding med lenke til Ny kjøring.
  - Én `role="status"`-region ligger i rotkomponenten og byttes aldri ut når visningen endres.

### AB-15: Resultattabell og ytelse

- **Gjelder:** FR-14, FR-15, FR-18, NFR-5, NFR-8
- **Hindrer:** en tabell som blir treg med 1000 deler, og tilgjengelighet som forsvinner ved optimalisering.
- **Regel:**
  - Resultattabell er én `<table>` med én `<tbody>` per del, slik EXPERIENCE.md beskriver. Hver del er en egen React-komponent med `React.memo`, så bare delen som endres, tegnes på nytt når en celle velges.
  - Valgt celle, tastaturfokus og filteret «Vis bare kritiske deler» (FR-16, nytt 22.11) styres i visningen, ikke i den globale tilstanden. Filteret skjuler bare deler på skjermen. Det endrer ikke `Resultat` og ikke eksporten.
  - Resultatet vises i denne rekkefølgen (PRD §4.4 og ordbanken, endret 22.11): tallboksene, kritiske deler, bestillingsforslag, endringer (når de finnes), resultattabellen og produksjonskapasiteten (når den er valgt). Uten kritiske deler vises bare en kort melding (FR-16). Det er ingen ukeplan.
  - Ytelsen måles tidlig med en fil på 1000 rader. Nås ikke 3 sekunder, prøves tiltakene i EXPERIENCE.md i rekkefølge: `content-visibility: auto`, så virtualisering, så sammenslått visning.

### AB-16: Excel inn og ut

- **Gjelder:** FR-1, FR-2, FR-22, FR-23, NFR-11
- **Hindrer:** antakelser om kolonneplassering, at formler regnes ut, og at Excel-detaljer lekker inn i domenet.
- **Regel:**
  - Bare `src/excel/` importerer SheetJS.
  - `les` finner arkene og overskriftene etter navn, ikke plass. Den leser lagrede verdier og aldri formler. Hver rad får sitt Excel-radnummer. Arkene Veiledning og Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke. Stykklisten slutter ved første rad der både Nivå og Varenummer er tomme.
  - `les` avgjør aldri om noe er feil. Det gjør `domene/valider`.
  - `eksport` bygger arbeidsboka fra `Kjoring`: resultattabellen, bestillingsforslagene, eksepsjonene, ferdigproduktets navn, horisont og tidspunkt, og arket Sammenligning når den finnes (FR-22, FR-23). Filnavnet har ferdigproduktets navn og dato.
  - SheetJS installeres fra SheetJS sin egen adresse (`https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`), ikke med `npm i xlsx`. Pakken `xlsx` på npm er en gammel versjon med kjente sikkerhetshull.

### AB-17: Tester mot fasit

- **Gjelder:** NFR-2, NFR-5, SM-1, SM-2, SM-4, SM-5, SM-7
- **Hindrer:** tester som sammenligner appen med seg selv.
- **Regel:**
  - `testdata/lag_testdata.py` importeres, oversettes eller kopieres aldri inn i `src/`. Skriptet kan fortsatt brukes til å lage inndatafiler, for eksempel filen med 1000 rader for NFR-5.
  - Fasittestene leser `testdata/*-fasit.xlsx` med en hjelpefunksjon som bare finnes i `tests/`, og kjører den samme veien som appen: `les` → `valider` → `beregn`/`kapasitet` → `sammenlign` → `eksport`.
  - Det som sammenlignes: tallene per del, uke og rad; eksepsjonene på varenummer, uke og type; valideringsfeilene på ark, rad, felt og kode; og linjene i sammenligningen i rekkefølge. Ordlyden sammenlignes ikke.
  - Hver fil i `testdata/validering/` har sin egen test.
  - `npm test` kjører alt med Vitest, uten nett, nøkler eller kontoer. Arkitekturtesten (kapittel 2) er med.
  - Noen få ende-til-ende-tester med Playwright (opplasting av testeksempel 01, de tre filene i NFR-9 og lagring blokkert) kjøres med `npm run test:e2e`. De er ikke med i `npm test`, så den kommandoen holder seg enkel for sensor.

### AB-18: Statisk publisering uten datautgang

- **Gjelder:** NFR-3, NFR-4, NFR-6, §8.1
- **Hindrer:** at noen del av løsningen sender data ut av nettleseren.
- **Regel:**
  - `npm run build` lager statiske filer, og Vercel publiserer dem. Det er ingen serverfunksjoner, ingen Vercel Analytics eller Speed Insights og ingen skript fra tredjepart.
  - `vercel.json` setter en Content Security Policy med `default-src 'self'` og `connect-src 'self'`. Da stopper nettleseren selv et forsøk på å sende data til en annen adresse, også fra et bibliotek.
  - Malen og testeksempel 01 kopieres fra `testdata/` til `public/` i bygget (FR-27). En test sjekker at de er like.
  - Miljøer: lokalt (`npm run dev`), forhåndsvisning på Vercel per branch og produksjon fra `main`. Til brukertesten 2.–7. desember brukes en egen branch `brukertest`, som fryses den uka.
  - Ett byggflagg, `VITE_KAPASITET`, skjuler produksjonskapasiteten hvis trinn 4 kuttes, og i bygget til brukertesten.

## 4. Konvensjoner

| Område | Konvensjon |
|---|---|
| Navn i koden | Norske fagord fra ordbanken (`bruttobehov`, `nettobehov`, `planlagtOrdremottak`, `frigivelsesuke`, `eksepsjon`, `kritiskDel`). Æ, ø og å skrives ae, o og a i navn i koden og i filnavn. camelCase for verdier og funksjoner, PascalCase for typer og komponenter. Nye fagord legges først inn i ordbanken. |
| Filer | `kebab-case.ts` for kode, `PascalCase.tsx` for React-komponenter. Tester i `tests/` med samme mappestruktur som `src/`, og navn `*.test.ts`. |
| Rekkefølge | Deler følger stykklisten, og en felles del står der den står første gang (FR-16). Bestillingsforslag sorteres på frigivelsesuke og så stykklisterekkefølge. Eksepsjoner sorteres på stykklisterekkefølge, uke («–» først) og kodene i rekkefølgen i AB-9. |
| Tall | Heltall uten desimaler, formatert med `Intl.NumberFormat('nb-NO')` i `tekster/`. |
| Tilgjengelighet | Markeringer har alltid farge og tekst eller symbol (NFR-8). Forklaringspanelet åpnes ved klikk, trykk eller Enter, aldri ved peking (FR-18). Ingen `alert()`. |
| Kommandoer | `npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run test:e2e`. De står i README (NFR-3). |
| Git | Én branch per story, pull request inn i `main`, og minst én i gruppen ser over før fletting. |

## 5. Teknologi og versjoner

Versjonene er sjekket 22.11.2026.

| Navn | Versjon |
|---|---|
| Node.js | 24 LTS (satt i `engines` og på Vercel) |
| TypeScript | 7.0.2 |
| Vite | 8.3.8 |
| React og react-dom | 19.3.1 |
| @vitejs/plugin-react | 6.3.0 |
| Tailwind CSS og @tailwindcss/vite | 4.3.5 |
| shadcn (CLI) og radix-ui | 4.23.0 og 1.8.1 |
| @fontsource/source-sans-3 | 5.3.1 |
| SheetJS Community Edition | 0.20.3 (fra cdn.sheetjs.com) |
| Vitest | 5.1.1 |
| @playwright/test | 1.65.1 |
| Publisering | Vercel, bare statiske filer |

TypeScript 7 er ny. Viser det seg at et verktøy ikke støtter den, brukes siste versjon 6.x i stedet.

## 6. Mappestruktur

```text
/
  src/
    domene/      typer.ts, valider.ts, struktur.ts, netting.ts, beregn.ts,
                 eksepsjoner.ts, kapasitet.ts, utdrag.ts, sammenlign.ts
    tekster/     nb.ts (all norsk tekst og formatering)
    excel/       les.ts (xlsx → RaaArk eller Filfeil), eksport.ts (Kjoring → xlsx)
    lagring/     lagrede-kjoringer.ts (eneste bruk av localStorage)
    worker/      beregning.worker.ts
    app/         kjoring.ts (rekkefølgen i AB-13), tilstand.tsx (kontekst og reducer)
    ui/          introduksjon/, ny-kjoring/, resultat/, lagrede-kjoringer/,
                 resultattabell/, forklaringspanel/,
                 kapasitet/, felles/ (shadcn-komponenter)
    main.tsx
  public/        COSI-MRP-mal.xlsx, testeksempel-01.xlsx (kopiert fra testdata/ ved bygg)
  tests/         domene/, excel/, fasit/, validering/, arkitektur.test.ts,
                 hjelpere/fasit-leser.ts, ytelse.bench.ts
  e2e/           Playwright
  testdata/      malen, testeksemplene, fasitene, validering/, lag_testdata.py
  vercel.json    CSP og andre sikkerhetshoder
```

## 7. Kravene og hvor de løses

| Krav | Ligger i | Styres av |
|---|---|---|
| FR-1–FR-2 opplasting og struktur | `excel/les.ts`, `domene/valider.ts` | AB-5, AB-16 |
| FR-3–FR-4 kontroll av verdier, alle feil samlet | `domene/valider.ts`, `domene/struktur.ts`, `tekster/` | AB-5, AB-6, AB-9 |
| FR-5–FR-8, FR-28 MRP-beregning | `domene/beregn.ts`, `domene/netting.ts` | AB-4, AB-6, AB-7 |
| FR-9–FR-13, FR-29 eksepsjoner og kritiske deler | `domene/eksepsjoner.ts` | AB-7, AB-9 |
| FR-14–FR-17 resultatet, med filteret for kritiske deler | `ui/resultat/`, `ui/resultattabell/` | AB-8, AB-14, AB-15 |
| FR-18 forklaringer | `domene/beregn.ts` (Utregning), `tekster/`, `ui/forklaringspanel/` | AB-8, AB-9 |
| FR-19–FR-21 lagring, sammenligning og Lagrede kjøringer | `domene/utdrag.ts`, `domene/sammenlign.ts`, `lagring/`, `app/kjoring.ts`, `ui/lagrede-kjoringer/` | AB-10, AB-11, AB-13, AB-14 |
| FR-22–FR-23 eksport | `excel/eksport.ts` | AB-8, AB-11, AB-16 |
| FR-24–FR-26 fast partistørrelse | innstilling i `domene/netting.ts` | AB-7 |
| FR-27 introduksjonsside, veiledning og nedlasting | `ui/introduksjon/`, `ui/ny-kjoring/`, `lagring/` (intro-nøkkelen), `public/` | AB-10, AB-14, AB-18 |
| FR-30–FR-34 produksjonskapasitet | `domene/kapasitet.ts`, `ui/kapasitet/` | AB-7, AB-8, AB-13, AB-18 |
| NFR-1 beregning skilt fra resten | `src/domene/` | AB-2 |
| NFR-2 tester mot fasit | `tests/` | AB-17 |
| NFR-3 kjørbar for sensor | README, `package.json` | AB-17, AB-18 |
| NFR-4 data blir i nettleseren | bygg, `vercel.json` | AB-1, AB-18 |
| NFR-5 ytelse | `worker/`, `ui/resultattabell/`, `tests/ytelse.bench.ts` | AB-12, AB-15 |
| NFR-7 språk | `tekster/` | AB-9 |
| NFR-8 lesbarhet | `ui/` | AB-15, konvensjonene |
| NFR-9 robust feilhåndtering | `excel/les.ts`, `worker/`, `app/kjoring.ts` | AB-5, AB-12, AB-13 |
| NFR-10 lagring i nettleseren | `lagring/` | AB-10 |
| NFR-11 kompatibilitet med Excel | `excel/` | AB-4, AB-16 |

## 8. Forslag til byggerekkefølge

Rekkefølgen følger trinnene i PRD §7.1, så trinn 1–3 kan være testet før kuttbeslutningen 30. november.

| Nr. | Arbeid | Trinn |
|---|---|---|
| 0 | Prosjektoppsett: Vite, React, TypeScript, Vitest, arkitekturtest, `vercel.json`, README med kommandoene | – |
| 1 | `domene/typer.ts` med alle delte typer (AB-3) | – |
| 2 | `excel/les.ts` og `domene/valider.ts` med testene i `testdata/validering/` | 1 |
| 3 | `domene/struktur.ts`, `netting.ts` og `beregn.ts` med fasittester for testeksempel 01–04 | 1 |
| 4 | `domene/eksepsjoner.ts` med fasittester | 1 |
| 5 | Worker, `app/kjoring.ts` og tilstanden | 1 |
| 6 | Introduksjon, Ny kjøring, Resultat og Resultattabell med filteret «Vis bare kritiske deler». Ytelsesmåling med 1000 rader | 1 |
| 7 | Forklaringspanelet | 2 |
| 8 | Lagring, sammenligning, siden Lagrede kjøringer og eksport | 3 |
| 9 | Produksjonskapasitet med fasittest for testeksempel 05 | 4 |
| 10 | Fast partistørrelse | 5 |

Nr. 2–4 og nr. 6 kan gjøres samtidig av ulike personer når nr. 1 er flettet inn, fordi de bare møtes i typene.

## 9. Risikoer

| Risiko | Hva vi gjør |
|---|---|
| Beregningen gir feil svar i spesialtilfeller (fremskynding, felles deler, forfalte frigivelser) | Fasittestene for alle fem testeksemplene skrives før UI-et. Avvik rettes i domenet, aldri i UI-et. |
| Tabellen blir treg med 1000 deler | Måles i nr. 6, før tabellen låses. Tiltakene står i AB-15. |
| Excel for Mac lagrer verdier annerledes | Testeksempel 01 og 02 lagres på nytt i Excel for Windows og for Mac og legges inn som egne testfiler (NFR-11). |
| KI-verktøy legger logikk på feil sted | Arkitekturtesten feiler hvis et lag importerer noe det ikke har lov til. Mappestrukturen og reglene her gis til KI-verktøyet i hver økt. |
| Tiden blir knapp | Trinn 4 og 5 kan slås av med byggflagget og kuttes uten å endre resten. |

## 10. Utsatt

- **IndexedDB:** først hvis vi skal lagre hele kjøringer eller flere kjøringer per ferdigprodukt.
- **Virtualisering av tabellen:** først hvis målingen i nr. 6 viser at det trengs.
- **Engelsk tekst:** `tekster/` er forberedt, men bare norsk lages i v1.
- **Automatiske tester på GitHub (CI):** kan legges til uten å endre noe her. `npm test` lokalt er kravet (NFR-2).
- **Flere ferdigprodukter samlet, hva-om-scenarier og mer enn tre nivåer:** utenfor v1 (PRD §7.2). Lagringsnøkkelen per ferdigprodukt (AB-10) må endres når flere produkter planlegges samlet.

## 11. Spørsmål gruppen må avgjøre

1. **React eller et annet rammeverk.** Forslaget velger React fordi UX-dokumentene bygger på shadcn/ui. Velger gruppen noe annet, må EXPERIENCE.md endres.
2. **Web Worker fra start.** Forslaget har worker-en med fra starten. Alternativet er å kjøre alt i hovedtråden og legge til worker-en bare hvis målingen krever det. Det er enklere, men statuslinja kan da fryse under beregningen.
3. **Hvem bygger hva.** Fordelingen av nr. 2–10 i kapittel 8, og hvem som tester med Excel for Windows og for Mac.
4. ~~**Åpne UX-spørsmål som påvirker resultatsiden** (U5, U6 og U14).~~ **Avgjort av gruppen 22.11** og ført inn i PRD-en: kritiske deler først, introduksjonsside ved første besøk, og ingen ukeplan. Arkitekturen er oppdatert i AB-10, AB-14 og AB-15.
5. **Navigasjon med fire menyvalg.** Forslaget holder samme adresse for alle visningene (AB-14). Med fire menyvalg kan gruppen vurdere egne adresser per visning (for eksempel `#/resultat`), så en visning kan bokmerkes. EXPERIENCE.md må uansett oppdateres med de nye visningene.
