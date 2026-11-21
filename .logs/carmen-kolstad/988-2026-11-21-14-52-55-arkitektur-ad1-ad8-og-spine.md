# Arkitektur AD-1–AD-8 og spine

## 2026-11-21 kl. 14:52 — Carmen Kolstad

### Oppgave
Carmen ville gjennomføre sin egen BMAD Architecture for COSI-MRP i Coaching-modus, med ett beslutningsspørsmål om gangen, Party Mode for å utfordre valgene og dokumentasjon i sin egen arkitekturmappe. Grunnlaget skulle være den vedtatte PRD-en på origin/main og den nyeste UX-retningen. Andre gruppemedlemmers arkitekturarbeid skulle ikke leses eller brukes. Til slutt skulle beslutningene samles i en fullstendig ARCHITECTURE-SPINE.md. Ingen appkode, og ingen commit, push eller merge uten godkjenning.

### Plan
- Fortsette Carmens påbegynte kjøring fra 15.11: `.docs/planning-artifacts/architecture/architecture-COSI - MRP-2026-11-15/` (`.memlog.md`).
- Ta beslutningene i rekkefølge: teknologi, mønster og lag, datamodell, Excel-bibliotek, lagring, visninger og tilstand, tekster og feil, test og publisering.
- Kvalitetssikre hver beslutning mot PRD-en, addendumet og testfasitene. Prøve Excel-bibliotekene mot testdataene i et skript i scratchpad.
- Lage oversikt over dokumentene på origin/main underveis, på Carmens forespørsel.
- Destillere spinen fra memloggen, kjøre `lint_spine.py`, avstemme mot kravene og kjøre en gjennomgang (reviewer gate).

### Resultat
- **Dokumentgrunnlag:** origin/main på `8b3fba0`. Bindende: PRD (final 13.11), addendum, beslutningsdokumentene 05.11, 09.11 og 13.11, og `testdata/`. UX-prototyper og UX-research er rådgivende. Oversikten fant blant annet at UX-researchen anbefaler shadcn/ui (i strid med AD-1), at det ikke finnes noen godkjent UX-spesifikasjon på main, og at ordbanken har status «forslag».
- **Carmens beslutninger** (alle i `.memlog.md` med begrunnelse):
  - **AD-1:** Vite + React + TypeScript, minimalt oppsett. Party Mode gjennomført. shadcn/ui krever egen AD.
  - **AD-2:** Funksjonell kjerne med tynt skall. `inn/` eier fil og struktur (FR-1, FR-2), `kjerne/` eier alle reglene i FR-3. Party Mode gjennomført.
  - **AD-3:** Tre dataformer (Rådata → Grunnlagsdata → Kjøring). Bare et utdrag, LagretKjøring, lagres. Kontrollert mot arket Sammenligning i fasit 03.
  - **AD-4:** read-excel-file 9.3.20 og write-excel-file 4.1.1. Prøvd mot testdata: V-S01, V-S03, V-M04, V-M05, V-F01–F09, eksport av 6000 rader på 131 ms (bare Node).
  - **AD-5:** localStorage bak et asynkront grensesnitt, med feiltilfeller avklart. Flere faner er en avgrensning.
  - **AD-6:** Hash-ruting, felles og lokal tilstand, og `flyt/` i ren TypeScript.
  - **AD-7:** Strukturerte koder og parametere, med all norsk tekst i `tekster/`.
  - **AD-8:** Vitest (`npm test`) og Playwright (`npm run test:e2e`), Node 24, Vercel med CSP. CSP-en er kontrollert: read-excel-file trenger `worker-src blob:`.
- **Spine:** `ARCHITECTURE-SPINE.md` er skrevet med status `draft`. Den har AD-1–AD-8, konvensjoner, stack, tre mermaid-diagrammer, et kapabilitetskart for alle FR- og NFR-kravene og en Deferred-liste. `lint_spine.py` fant 0 feil.
- **Avstemming og gjennomgang:** Funnene er skrevet i `reviews/review-gate-2026-11-21.md` og rettet i spinen. Gjennomgangen ble kjørt i samme kontekst, ikke med uavhengige subagenter.
- **Andre filer:** `.docs/party-mode/memories/installed/.memlog.md` er opprettet (Party Mode-minne). Minnet om UX-retning i Claude er oppdatert til `ux/Nyeste-UX/`.
- **Uendret:** PRD-en, addendumet, ordbanken, UX-dokumentene og prototypene. Det er ikke laget appkode. Prøveskriptene ligger bare i scratchpad.
- **Fortsettelse samme dag:**
  - Carmen bekreftet ukekonvensjonen: tre slags uker og 0-basert indeks internt.
  - Carmen bekreftet ASCII-navn i kode, filnavn, adresser og nøkler. Ark- og kolonnenavnene i Excel-malen beholdes nøyaktig.
  - Q1: `inn/` eier Excel-kontrakten, og kildeinformasjonen følger med i Rådata. Kontrollert at V-F05 gir 3 feil og V-F06 gir 2.
  - Q2: Midlertidig regel for trimming og heltall lagret som tekst (i `kjerne/`), som gruppen må bekrefte.
  - Q3, **AD-9**: Story 0 og Story 1 (`src/kjerne/typer.ts`) kommer først, og datakontraktene har én koordinator.
- **Reviewer gate med uavhengige subagenter i tre runder:**
  - Runde 1: rubrikk, versjoner og motstander. Rapportene ligger i `reviews/review-rubrikk.md`, `review-versjoner.md` og `review-motstander.md`, og 27 autorettinger (R1–R27) er gjort.
  - Runde 2 (`review-runde2.md`): N1–N14 er rettet.
  - Runde 3 (`review-runde3.md`): 0 åpne kritiske eller høye funn, og restene R1–R4 er rettet.
- **Status:** `ARCHITECTURE-SPINE.md` er satt til **final** som Carmens individuelle arkitektur (`owner` står i frontmatter). Den er ikke et gruppevedtak, og gruppeavklaring nr. 1–11 er åpne. Linteren fant 0 feil, og det er ingen plassholdere eller doble overskrifter.
- Ingenting er committet, pushet eller merget. Carmen har bedt om det, og gruppens regel går foran skillen.

### Åpne punkter
- Gruppen behandler «Åpne gruppeavklaringer» nr. 1–11 i spinen. Blant dem er koordinatoren for datakontraktene (nr. 10) og Carmens tolkninger av PRD-en (nr. 11).
- Gruppen tolker FR-3: skal heltall lagret som tekst («7») godtas, og skal mellomrom trimmes? Det må avklares før valideringen i `kjerne/` bygges, og gir en ny valideringstest.
- Gruppen avgjør hvilken arkitektur som gjelder for G23. Fristen 18.11 i fremdriftsplanen er passert.
- Nye begreper må inn i ordbanken: Rådata, LagretKjøring, Kjøringsflyt, Utfall, Avvisning, Plassering.
- Gruppen avgjør om GitHub Actions skal kjøre `npm ci`, `npm test` og `npm run build` på pull requests, og hvem som eier Vercel-kontoen.
- En testfil med 1000 rader må lages med `lag_testdata.py` for å måle NFR-5.
- Godkjenningstester for AD-4: kjøring i nettleseren, testeksempel 01 og 02 lagret i Excel for Windows og Mac, og eksportfilen åpnet i ekte Excel. Noen med Excel for Windows må gjøre Windows-delen.
- Hvem i gruppen har React-erfaring og tar `ui/`? Det påvirker hvordan epics fordeles.
- Tilby en uavhengig gjennomgang av spinen med egne subagenter hvis Carmen ønsker det.
