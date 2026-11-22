# Sammenligning av de tre arkitekturforslagene

Laget 22.11.2026 som grunnlag for gruppens valg av arkitektur. Oversikten tar ikke stilling. Den viser hva forslagene er enige om, hvor de er ulike, og hva gruppen må bestemme.

**Forslagene:**

| Forslag | Hvor | Dato | Status |
|---|---|---|---|
| Carmen | `Carmen/Branch`: `architecture/architecture-COSI - MRP-2026-11-15/ARCHITECTURE-SPINE.md` | 21.11 | Final, individuelt, ikke gruppevedtak. AD-1–AD-9 og 11 åpne gruppeavklaringer. |
| Sebastian | `Sebastian/Branch`: `architecture/architecture-COSI - MRP-2026-11-20/ARCHITECTURE-SPINE.md` | 20.11 | Final, AD-1–AD-16. |
| Idun | `Idun/Branch`: `architecture/architecture-COSI - MRP-2026-11-22-idun/arkitektur.md` | 22.11 | Forslag, individuelt, ikke gruppevedtak. AB-1–AB-18. |

## 1. Kort fortalt

Alle tre bygger på samme grunnmur: en statisk nettapp i TypeScript og Vite, med en ren beregningskjerne og lagring i `localStorage`, testet med Vitest mot fasit og publisert på Vercel.

De største forskjellene:

1. **Rammeverk:** Carmen og Idun velger React. Sebastian velger Svelte.
2. **Excel-bibliotek:** Sebastian og Idun velger SheetJS. Carmen velger read-excel-file og write-excel-file.
3. **UI-komponenter:** Idun følger EXPERIENCE.md med shadcn/ui og Tailwind. Sebastian bruker vanlig HTML og porter Odas prototype v3. Carmen bruker ingen komponentbibliotek.
4. **Web Worker:** bare Idun har den med fra start. Carmen og Sebastian venter til ytelsesmålingen viser at den trengs.
5. **Planlagte mottak:** Carmen legger sammen mottak i samme uke og behandler dem som ett. Sebastian og Idun holder hvert mottak for seg. Dette kan gi ulike eksepsjoner, så det må avgjøres før beregningen bygges.

## 2. Det alle tre er enige om

- Én statisk nettapp på Vercel, uten serverfunksjoner, analyse eller skript fra tredjepart (NFR-3, NFR-4).
- Vite og TypeScript, Vite 8.3.8, Vitest 5.1.1 og Node 24.
- **Funksjonell kjerne med tynt skall:** all MRP-logikk og validering i en ren kjerne uten nettleser-API, som kan testes alene (NFR-1).
- Alle delte typer i én fil (`typer.ts`), som skrives først i en egen story før annet arbeid som bruker dem.
- **Feil er verdier:** lesing og kontroll gir enten et resultat eller en feilliste, og kaster ikke unntak for feil i brukerens data. Ved feil lagres ingenting (FR-4, NFR-9).
- Kjernen gir koder, og all norsk tekst lages i én mappe `tekster/` (NFR-7).
- `localStorage` med én nøkkel per ferdigprodukt, `cosi-mrp:kjoring:<varenummer>`. Bare et lite utdrag lagres, ikke Excel-filen. Én fil eier all bruk av `localStorage`, og alt står i `try/catch` (FR-19–FR-21, NFR-10).
- Sammenligningen er en ren funksjon i kjernen, i rekkefølgen fra arket Sammenligning i fasit 03 (FR-20, FR-23).
- Varenummer er alltid tekst, så `300001` og «300001» er samme del (NFR-11).
- Fasittestene leser fasitfilene i `testdata/`. `lag_testdata.py` importeres eller kopieres aldri inn i appen (NFR-2).
- `npm test` kjører alt uten nett, nøkler eller kontoer.
- Virtualisering av tabellen, IndexedDB og engelsk er utsatt.

## 3. Forskjellene

### 3.1 Teknologi

| Tema | Carmen | Sebastian | Idun |
|---|---|---|---|
| Rammeverk | React 19.3.1 | Svelte 5.59.1 | React 19.3.1 |
| UI-komponenter | Ingen bibliotek. shadcn/ui krever en ny AD | Vanlig HTML (`<dialog>`, `<select>`, radioknapper). Erstatter shadcn-valget i EXPERIENCE.md | shadcn/ui (Radix) og Tailwind, slik EXPERIENCE.md sier |
| UX-prototypen | Bare referanse. Koden flyttes ikke inn | HTML og CSS fra Odas v3 portes til Svelte | Ikke bestemt. Følger EXPERIENCE.md og DESIGN.md |
| Excel-bibliotek | read-excel-file 9.3.20 og write-excel-file 4.1.1 | SheetJS CE 0.20.3 (fra cdn.sheetjs.com) | SheetJS CE 0.20.3 (fra cdn.sheetjs.com) |
| TypeScript | 7.0.2 | 6.0.3 | 7.0.2 (6.x hvis et verktøy ikke støtter 7) |
| Kodekontroll | oxlint 1.94.0. Eksakte versjoner, som en test sjekker | svelte-check 4.7.8 | Ikke bestemt |
| Avhengigheter | Fast liste i AD-1. Alt annet krever en ny AD | Ikke låst | Ikke låst |
| Skrift | Ikke nevnt (CSP stopper eksterne skrifter) | Ingen eksterne skrifter | Source Sans 3 fra `@fontsource`, i bygget |

### 3.2 Oppbygging og lag

| Tema | Carmen | Sebastian | Idun |
|---|---|---|---|
| Lag (mapper i `src/`) | `kjerne/`, `inn/`, `lagring/`, `eksport/`, `tekster/`, `flyt/`, `ui/` | `core/`, `shell/` (excel, lagring, kjor), `tekster/`, `ui/` | `domene/`, `tekster/`, `excel/`, `lagring/`, `worker/`, `app/`, `ui/` |
| Mappenavn | Norsk | Engelsk for lagene, norsk inni | Norsk |
| Hvem styrer en kjøring | `flyt/kjorFil`, ren TypeScript uten React. Lagring og klokke sendes inn som parametere | `shell/kjor.ts` | `app/kjoring.ts`, med beregningen i en Web Worker |
| Web Worker | Utsatt til NFR-5 måles over 3 s | Utsatt til NFR-5 måles over 3 s | Med fra start (AB-12) |
| Én netting for bestillingsplan, kapasitet og partistørrelse | Ikke en egen regel | Ja (AD-9) | Ja (AB-7) |
| Én eier av stykklistestrukturen | Ikke en egen regel | Ja, `core/struktur.ts` (AD-15) | Ja, `domene/struktur.ts` (AB-6) |
| Forklaringen (FR-18) | `forklar(kjoring, celleId)` regner ut forklaringen når cellen klikkes, fra sporingsfelt i kjøringen | `Utregning` per del og uke ligger ferdig i resultatet | `Utregning` per del og uke ligger ferdig i resultatet |
| Arkitekturtest som sjekker importene | Ja, også at kjernen ikke bruker klokke eller tilfeldige tall, og at filnavn er ASCII | Ikke nevnt | Ja |

### 3.3 Navigasjon og tilstand

| Tema | Carmen | Sebastian | Idun |
|---|---|---|---|
| Navigasjon | Hash-ruting skrevet selv: én `#/…`-adresse per visning | Ingen ruter. Visningen ligger i en Svelte-store, og adressen endres ikke | Ingen ruter. React-kontekst med `useReducer`, og adressen endres ikke |
| Tilbake-knappen | Følger hash-adressene | `history.pushState` én gang når resultatet vises | `history.pushState` én gang når resultatet vises |
| Feil under tegning | React-feilgrense rundt visningene | Ikke nevnt | Ikke nevnt |

EXPERIENCE.md sier at startsiden og resultatsiden har samme adresse. Sebastian og Idun følger det. Carmen lar rutetabellen avhenge av gruppens UX-vedtak.

### 3.4 Excel og validering

| Tema | Carmen | Sebastian | Idun |
|---|---|---|---|
| Hvor stykklisten slutter | Siste rad med verdi, så en tom rad midt i gir feil. Carmen sier selv at dette avviker fra addendumet (gruppeavklaring 11) | Helt tomme rader hoppes over, og Excel-radnummeret beholdes | Første rad der både Nivå og Varenummer er tomme, slik addendumet sier |
| Heltall lagret som tekst («7») | Godtas som tallet 7 (midlertidig regel, må bekreftes av gruppen) | Ikke nevnt | Ikke nevnt |
| Grenser for filen | Over 10 MB eller over 15 sekunders innlesing avvises | Ikke nevnt | En worker som ikke svarer innen 30 sekunder, gir «uventet feil» |
| Kolonner | Faste celleplasser (Stykkliste A–H osv.), og overskriftene må stemme | Overskriftene finnes etter tekst | Overskriftene finnes etter navn, ikke plass |

### 3.5 Beregning og sammenligning

| Tema | Carmen | Sebastian | Idun |
|---|---|---|---|
| Planlagte mottak i samme uke | Legges sammen per varenummer og uke og behandles som ett mottak i FR-12 og FR-29 (gruppeavklaring 11) | Holdes som enkeltlinjer og legges aldri sammen på forhånd | Holdes som enkeltlinjer |
| Like eksepsjoner i sammenligningen | Sammenlignes som en multimengde, så to like eksepsjoner i samme celle ikke forsvinner | Kjennes igjen på varenummer, uke og type | Kjennes igjen på varenummer, uke og type |
| Eksepsjoner i den lagrede kjøringen | Med alle parametere | Bare varenummer, uke og type | Bare varenummer, uke og type |
| Lagringsgrensesnitt | Asynkront (`Promise`), så et bytte til IndexedDB blir enkelt | Synkront | Synkront |
| Klokke | Sendes inn til `flyt/`, så tester kan styre tiden | Ikke nevnt | Settes i `app/`, ikke i kjernen |

### 3.6 Testing, publisering og arbeidsflyt

| Tema | Carmen | Sebastian | Idun |
|---|---|---|---|
| Ende-til-ende-tester | Playwright i Chromium og Firefox (`npm run test:e2e`): brukerreiser, blokkert lagring, ny fil uten omlasting, tastatur og null CSP-brudd | Ingen | Noen få med Playwright (`npm run test:e2e`) |
| Content Security Policy (CSP) | Full CSP i `vercel.json`, og en test sjekker at den er lik i `vite preview` | Ikke nevnt | `default-src 'self'` og `connect-src 'self'` i `vercel.json` |
| Byggflagg for kapasiteten | Ikke nevnt | `VITE_KAPASITET` | `VITE_KAPASITET` |
| Brukertesten 2.–7.12 | Produksjon fra `main`, senest før brukertesten | Egen frossen branch `brukertest` med fast Vercel-adresse | Egen frossen branch `brukertest` |
| Rekkefølgen på resultatsiden | Gruppen avgjør. Rutetabellen kan endres uten ny AD | Fast: Bestillingsforslag → Endringer → Kritiske deler → Resultattabell → Kapasitet. Ingen ukeplan | Gruppen avgjør (U5, U6, U14) |
| Navn i koden | ASCII: æ, ø og å skrives ae, o og a (`LagretKjoring`) | Norske navn med æ, ø og å (`LagretKjøring`, `RåArk`) | ASCII: æ, ø og å skrives ae, o og a (`LagretKjoring`) |
| Datakontraktene | Story 0 (oppsett) og Story 1 (typer). Én koordinator, valgt av gruppen, eier `typer.ts` | En grunnstory skriver typene. Endringer går via en PR som endrer `typer.ts` først | Story 0 (oppsett) og 1 (typer). Endringer går via en egen PR |
| Kontroller før fletting | `npm test`, `npm run lint` og `npm run build` grønne. Minst én annen godkjenner | Ikke nevnt | Minst én i gruppen ser over |
| CI på GitHub | Gruppeavklaring 5 (anbefalt) | Utsatt | Utsatt |

## 4. Hva gruppen må bestemme

Rekkefølgen viser hva som må avgjøres først, fordi andre ting avhenger av det.

| Nr. | Spørsmål | Valgene | Merknad |
|---|---|---|---|
| 1 | Hvilken arkitektur gjelder | Én av de tre, eller en blanding | Carmen påpeker at fristen 18.11 i fremdriftsplanen er passert. Kuttbeslutningen er 30.11. |
| 2 | React eller Svelte | React (Carmen, Idun) eller Svelte (Sebastian) | Påvirker hele `ui/` og hvem som kan bygge den. |
| 3 | UI-komponenter | shadcn/ui og Tailwind, vanlig HTML eller ingen bibliotek | Velges noe annet enn shadcn/ui, må EXPERIENCE.md endres. shadcn/ui finnes bare for React. |
| 4 | Excel-bibliotek | SheetJS (Sebastian, Idun) eller read-/write-excel-file (Carmen) | Bør prøves tidlig på testeksempel 01 og 02 lagret i Excel for Windows og Mac (NFR-11). |
| 5 | Planlagte mottak i samme uke | Legges sammen (Carmen) eller holdes for seg (Sebastian, Idun) | Kan gi ulike eksepsjoner i FR-12 og FR-29. Sjekkes mot fasit 04 før beregningen bygges. |
| 6 | Hvor stykklisten slutter | Siste rad med verdi (Carmen), tomme rader hoppes over (Sebastian) eller første tomme rad (Idun, addendumet) | Avgjør om en tom rad midt i stykklisten er en feil. |
| 7 | Heltall lagret som tekst | Godta «7» som 7 (Carmen) eller ikke | Bør legges inn i FR-3 med en test. |
| 8 | Web Worker fra start | Fra start (Idun) eller når målingen krever det (Carmen, Sebastian) | Avhenger av ytelsesmålingen med 1000 rader. |
| 9 | Navigasjon | Hash-adresser (Carmen) eller samme adresse og `pushState` (Sebastian, Idun) | EXPERIENCE.md beskriver samme adresse. |
| 10 | TypeScript 6 eller 7 | 6.0.3 (Sebastian) eller 7.0.2 (Carmen, Idun) | Velg det verktøyene støtter. |
| 11 | Playwright og CSP | Med (Carmen, delvis Idun) eller uten (Sebastian) | CSP stopper teknisk at data sendes ut (NFR-4). Playwright gjør NFR-9 og NFR-10 testbare. |
| 12 | Navn i koden | ASCII (Carmen, Idun) eller med æ, ø og å (Sebastian) | Må være likt i hele koden. |
| 13 | Koordinator for `typer.ts` og hvem bygger hva | – | Gjelder uansett hvilken arkitektur som velges. |
