# Epic 1 Context: Kari kan sjekke Excel-filen sin i appen

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Kari åpner appen, ser introduksjonssiden, laster ned malen og testeksempel 01, leser Veiledning og laster opp den utfylte Excel-filen. Hun får enten alle feil i filen samlet på ett sted, eller kommer til Resultat med kjøringslinjen når filen er gyldig. Epicet legger samtidig grunnlaget alle senere epics bygger på: prosjektoppsett, delte typer, appskall med ruting og lys/mørk visning, lesing og validering, stykklistestrukturen, kjøring i en Web Worker og statisk publisering på Vercel. Det er trinn 1 og må i hovedsak være ferdig før prøvetesten rundt 27.11 (1.8, 1.12 og 1.13 kan komme 28.–30.11).

## Stories

- Story 1.1: Prosjektoppsett
- Story 1.2: Delte typer
- Story 1.3: Appskall med appmeny og ruting
- Story 1.4: Introduksjonsside, startside og Veiledning
- Story 1.5: Les Excel-filen
- Story 1.6: Kontroll av malens struktur
- Story 1.7: Stykklistestruktur
- Story 1.8: Kontroll av arket Stykkliste
- Story 1.9: Kontroll av MPS og Planlagte mottak
- Story 1.10: Kjøring i en Web Worker
- Story 1.11: Opplasting og Beregn på startsiden
- Story 1.12: Feiloppsummering
- Story 1.13: Lys og mørk visning

## Requirements & Constraints

- **Opplasting (FR-1):** én `.xlsx` fra egen maskin. Annen filtype avvises med melding om at appen bare tar imot Excel-malen. Testeksempel 01 skal gå uendret gjennom.
- **Struktur (FR-2):** arkene Stykkliste, MPS og Planlagte mottak med malens kolonneoverskrifter må finnes. Mangler noe, gir det én feil som nevner arket og hva som mangler. Gammel mal (Produkt og Komponenter) gir feil om at Stykkliste mangler. Kontroller som avhenger av det som mangler, hoppes over (uten MPS kontrolleres ikke ukene i Planlagte mottak), så det blir ingen følgefeil. Veiledning, Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke.
- **Verdier (FR-3):** regeltabellen for Stykkliste (rader, nivå 0/.1/..2, varenummer, beskrivelse, antall, type, underdeler, lagerbeholdning, SS, ledetid), MPS (heltall ≥ 0, horisont 8–12 sammenhengende uker, ingen hull) og Planlagte mottak (varenummer finnes, uke 1..H, antall ≥ 1). Heltall lagret som tekst (`^-?[0-9]+$` etter trimming) godtas, alt annet (desimal, ord, «1 000», «+», «ca. 40») er feil. Stykklisten har inntil 1000 rader fra rad 2 og slutter ved første rad der Nivå og Varenummer er tomme; innhold i malens kolonner under gir én feil på den tomme raden, og radene under leses ikke. Hjelpekolonnenes formler og malens tomme, formaterte rader regnes ikke som innhold. Innlimte verdier som Excel ikke stoppet, skal fanges. Tomt ark Planlagte mottak er gyldig.
- **Samlet feilvisning (FR-4):** minst én valideringsfeil gir ingen beregning, alle feil i én liste med ark, rad/celle, felt og årsak på norsk, og lagret kjøring endres ikke.
- **Veiledning og nedlasting (FR-27):** startsiden har nedlasting av tom mal og testeksempel 01 (byte for byte like filene i `testdata/`). Første besøk viser introduksjonssiden, senere besøk startsiden.
- **Robusthet (NFR-9):** ingen fil kan stoppe, henge eller gi delvis resultat. Skadet, tom, ikke-Excel med `.xlsx`-endelse, passordbeskyttet og uventet feil gir hver sin norske melding. Ny fil kan lastes opp uten omlasting.
- **Øvrige NFR:** data forlater aldri nettleseren, ingen tredjepart (NFR-4); kjørbar lokalt etter README uten nøkler (NFR-3); Chrome, Edge, Firefox på PC (NFR-6); all tekst på norsk, samlet (NFR-7); leser verdier og ikke formler fra Excel for Windows og Mac, nivå og varenummer likt som tall eller tekst (NFR-11).
- **Testkrav:** hver fil i `testdata/validering/` har egen test med antall feil og sted fra `testdata/validering/README.md` (V-F01–V-F10, V-S01–V-S29, V-M01–V-M05, V-P01–V-P04, V-G01–V-G05). V-F10 (passordbeskyttet) og V-G05 (formel i tallcelle, lagrede formelverdier i Kontroll- og hjelpekolonnene, 0 feil) er lagret fra Excel. `npm test` uten nett eller kontoer.

## Technical Decisions

- **Stakk:** Vite `react-ts`, TypeScript `strict`, React 19, SheetJS CE 0.20.3 (bare fra `https://cdn.sheetjs.com/...tgz`), Vitest, Playwright (Chromium og Firefox), oxlint, IBM Plex via `@fontsource`. Eksakte versjoner uten `^`/`~`, `npm ci`, `.npmrc` med `engine-strict=true` og `allow-remote=root` (AD-1, AD-15, AD-18).
- **Grenser (AD-2):** mappene `domene/`, `tekster/`, `excel/`, `lagring/`, `worker/`, `app/`, `ui/` med faste importregler som arkitekturtesten håndhever. `src/domene/` er ren: ingen React, SheetJS, `window`, `document`, `localStorage`, `Date.now`, `new Date()`, `Math.random`. Tidspunktet settes i `app/`.
- **Delte typer (AD-3):** alle i `src/domene/typer.ts` (`RaaArk`, `Inndata`, `Struktur`, `Valideringsfeil`, `Filfeil`, `Kjoring` m.fl.). Endringer i egen PR godkjent av koordinatoren (Idun) og minst én bruker.
- **Data (AD-4):** varenummer og nivå er trimmet tekst (300001 → «300001», «000123» beholdes). Serier per uke har lengde H. Planlagte mottak er enkeltlinjer med Excel-rad, ikke summert.
- **Feil er verdier (AD-5):** `{ ok: true, verdi } | { ok: false, feil }`, aldri unntak for brukerdata. Filfeilkoder `IKKE_XLSX`, `TOM_FIL`, `SKADET_FIL`, `IKKE_EXCEL`, `PASSORDBESKYTTET`. Valideringen samler alle feil før den svarer. Én React-feilgrense rundt visningene.
- **Excel-delen (AD-15):** bare `src/excel/` (og testhjelperne `tests/hjelpere/fasit-leser.ts` og `lag-arbeidsbok.ts`) importerer SheetJS. `excel/les.ts` gir `RaaArk` eller filfeil, finner ark og kolonner etter navn, leser lagrede verdier, gir Excel-radnummer per rad, leser i malens kolonner til siste rad med innhold og merker om det står noe under den tomme raden (formler i hjelpekolonnene teller ikke), og avgjør aldri om en verdi er feil. Radene over den tomme raden leses uten grense på 1000, så valideringen kan gi feilen for mer enn 1000 rader på rad 1002 (V-S03). Ingen fast stopp ved rad 1001.
- **Validering:** `domene/valider.ts` tar `RaaArk` og gir `Inndata` eller valideringsfeil med kode, ark, rad/celle, felt og verdi, men ingen ferdig tekst. Teksten lages fra én mal per kode i `tekster/nb.ts` (AD-9), som har faste seksjoner per område.
- **Struktur (AD-6):** bare `domene/struktur.ts` bygger `Struktur`: overordnet del = nærmeste rad over med ett nivå høyere, like varenumre slås sammen, lavnivåkode, ledetid fra ferdigproduktet (lengste sti), antall per ferdigprodukt, underdeler per forekomst (for underdelsreglene). Beregningsrekkefølge: stigende lavnivåkode, så stykklisterekkefølge.
- **Worker og styring (AD-12):** `worker/beregning.worker.ts` (lages med `new Worker(new URL(...), { type: 'module' })`) får overført `ArrayBuffer`, filnavn og valg, kjører les → valider og svarer med én melding (data, valideringsfeil, filfeil eller `UVENTET_FEIL`). Ingen tilstand, `localStorage` eller DOM. Meldingstyper i `worker/meldinger.ts`, med plass til resultat og kapasitet fra Epic 2 og 5. `app/kjoring.ts` er eneste vei inn: avviser nytt kall under kjøring, 30 s tidsgrense med `terminate()`, krasj (`error`/`messageerror`) gir uventet feil.
- **Ruting og tilstand (AD-13):** egen hash-ruting i `ui/ruter.ts` (`#/introduksjon`, `#/ny-kjoring`, `#/resultat`, `#/lagrede-kjoringer`, `#/veiledning`). Ukjent adresse → introduksjon første gang, ellers Ny kjøring. Felles tilstand i React Context med `useReducer` (`app/tilstand.tsx`). Én `role="status"`-region i rotkomponenten.
- **Lagring (AD-10):** bare `lagring/lagrede-kjoringer.ts` bruker `localStorage`, alt i `try/catch`. Nøkler i dette epicet: `cosi-mrp:intro-sett` og `cosi-mrp:visning` (`lys`/`mork`, mangler = lys). Blokkert lagring: appen virker, introduksjonen vises hver gang, visningsvalget gjelder til siden lukkes.
- **Publisering (AD-17):** statiske filer på Vercel, ingen serverfunksjoner eller analyse. `vercel.json` setter nøyaktig CSP-en fra AD-17 pluss `nosniff` og `Referrer-Policy: no-referrer`; `vite preview` bruker de samme (test sjekker). Alle e2e-tester bruker `e2e/csp-vakt.ts`. Ingen inline-skript.
- **Tester (AD-16):** Vitest i `tests/` med samme struktur som `src/`. Små lesetilfeller lages med `lag-arbeidsbok.ts`; formler, hjelpekolonner, passordbeskyttede, skadede og tomme filer testes med ekte Excel-filer i `testdata/`. `lag_testdata.py` importeres aldri.
- **Navn (kap. 4):** norske fagord fra ordbanken i ASCII (æ/ø/å → ae/o/a), `kebab-case.ts`, `PascalCase.tsx`. Nye fagord legges først i ordbanken.
- **Arbeidsflyt (AD-18):** én branch per story, PR til `main` med minst én reviewer. `npm test`, `npm run lint`, `npm run build` grønne, og `npm run test:e2e` når `ui/`, `worker/` eller `excel/` endres.

## UX & Interaction Patterns

- **Tokens og visning:** alle tokens fra DESIGN.md som CSS-variabler i `ui/felles/tokens.css`. Mørk visning med `data-visning="mork"` på `<html>`, lest før første tegning uten inline-skript, kontrast sjekket i begge.
- **Appmeny:** fast til venstre med logo og de fem sidene, aktiv side markert, «Bytt til mørk»/«Bytt til lys» nederst. Én h1 og egen sidetittel per visning.
- **Introduksjonsside:** overskrift 40 px, to korte avsnitt, tre steg i bokser, primærknappen «Kom i gang».
- **Startside «Ny kjøring»:** setningen om ett ferdigprodukt per fil, og tre nummererte kort (Fyll ut Excel-malen med `download`-lenker, Last opp filen, Velg hva du vil beregne, og beregn). Alle synlige uten rulling i 1366 × 630.
- **Opplastingssone:** dra og slipp pluss ekte `<button>` «Velg fil» som åpner skjult `<input type="file" accept=".xlsx">`, fokus tilbake etter dialogen. Begge veier gjennom samme kontroll. Flere filer: ingen brukes. Feil i hele filen vises som én melding i sonen (tekstene i EXPERIENCE.md › Feil i hele filen), og filvalget nullstilles.
- **Beregn:** deaktiveres aldri. Uten fil: «Velg en fil først.» og fokus til «Velg fil». Statusregionen viser «Leser filen …» og «Beregner …», uten overlegg eller spinner.
- **Feiloppsummering:** øverst over kortene, også ved én feil, overskriften er h1, sidetittel starter med «Feil:», brettet får fokus (`tabindex="-1"`, ikke `role="alert"`). Strukturfeil først i «Filen følger ikke malen» med overhoppede kontroller, så verdifeil per ark i malens rekkefølge (Stykkliste → Prognostiserte behov (arket MPS) → Planlagte mottak), sortert etter Excel-rad, i tabell med Ark, Sted, Felt, Feil. Like feil i samme kolonne slås sammen med radintervall og antall. Sier at lagret kjøring er urørt.
- **Gyldig fil:** Resultat med kjøringslinjen (beskrivelse og varenummer, «Horisont: H uker», filnavn, tidspunkt, «Last opp ny fil»), fokus til skjult h1 «Resultat for ‹beskrivelse›», sidetittel «‹beskrivelse› (‹varenummer›) – Resultat – COSI - MRP». `#/resultat` uten kjøring i minnet viser melding med lenke til Ny kjøring.
- **Språk:** du-form, ingen unnskyldninger, utropstegn eller feilkoder, «filen» i bestemt form, sted og felt først i feilmeldinger. Ord fra ordbanken.

## Cross-Story Dependencies

- 1.1 og 1.2 er flettet til `main` før alt annet. Deretter tre parallelle spor: skjermene (1.3 → 1.4), lesing og validering (1.5 → 1.6 → 1.8 og 1.9) og strukturen (1.7).
- 1.8 bruker `Struktur` fra 1.7 til underdelsreglene. 1.9 bygger ikke på 1.8, så 1.10 kan bygges før alle Stykkliste-reglene er ferdige.
- 1.10 trenger 1.5, 1.6, 1.9 og 1.7. 1.11 trenger 1.10 og skjermene fra 1.3/1.4. 1.12 trenger valideringen fra 1.6, 1.8 og 1.9 (V-F05 gir tre feil, V-F06 to).
- 1.13 bygger videre på tokenene fra 1.3.
- Epic 2 starter parallelt etter 1.2: beregningskjernen bruker `Struktur` (1.7) og `Inndata` (1.9), og worker-meldingene (1.10) må ha plass til `Resultat`. Resultat-siden i Epic 2 bygger på kjøringslinjen fra 1.11. Lagring av kjøringer (Epic 4) og valg av beregning (Epic 5) gjenbruker styringen i `app/kjoring.ts`.
