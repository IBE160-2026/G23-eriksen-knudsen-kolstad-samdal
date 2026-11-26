# Story 1.12 Feiloppsummering

## 2026-11-26 kl. 19:01 — Carmen Kolstad

### Oppgave
Analysere og implementere Story 1.12: feiloppsummeringen øverst på startsiden med alle valideringsfeilene samlet
(ark, sted, felt, årsak), V-F05 og V-F06 testet som hele filer, og så committe, pushe og opprette PR mot main med
Idun-Samdal som reviewer.

### Plan
- Analyse først (bare lesing): akseptkriteriene i epics.md, PRD FR-2/FR-4/UJ-4, DESIGN.md, EXPERIENCE.md,
  arkitekturen (AD-5, AD-9, AD-12), prototypen v3, flyten valider → worker → kjoring.ts → filvalg.ts, og deferred-work.md.
- Carmens beslutninger 26.11:
  1. Høydekravet 1366 × 630 gjelder startsiden uten feiloppsummering. Med feil står oppsummeringen øverst med fokus,
     og Kari ruller til resten. Føres inn som avklaring gruppen må bekrefte.
  2. Tekstmalene deles i årsak og prefiks, med uendrede fullstendige meldinger og Sebastians tester urørt.
  3. Sammenslåing bare for sammenhengende rader eller uker med samme ark, felt og kode, og aldri når opplysninger går tapt.
  4. Sidetittel «Feil: Ny kjøring – COSI - MRP» og «Den lagrede kjøringen er ikke endret.»
- Ren modell (`feiloppsummering.ts`) for gruppering, sortering og sammenslåing, komponent (`Feiloppsummering.tsx`),
  tekster i `nb.ts`, CSS etter `validation-summary` i DESIGN.md, enhetstester og e2e.

### Resultat
- Commit `922bfdc` på `story/1.12-feiloppsummering` (fra `origin/main` 3f87c98):
  - Nye filer: `src/ui/ny-kjoring/feiloppsummering.ts`, `src/ui/ny-kjoring/Feiloppsummering.tsx`,
    `tests/ui/feiloppsummering.test.ts` (26 tester) og `e2e/feiloppsummering.spec.ts`.
  - Endret: `src/tekster/nb.ts` (årsaksmaler, `filfeilOgValidering.feiloppsummering`, `samletAarsak`, Veiledning del 2),
    `filvalg.ts` (hele `Valideringsresultat`, står til neste svar), `NyKjoring.tsx` («Ny kjøring» blir h2 med feil),
    `sider.css` (`.valideringsboks` fjernet), testene for filvalg og tokens, og `e2e/opplasting.spec.ts`.
  - Dokumentasjon: `deferred-work.md` (punktet om den foreløpige boksen er løst, avklaringen om høyden, to kontroller
    som hoppes over uten å vises) og ordbanken (Verdifeil, Sammenslått feillinje).
- V-F05: 3 feil i 3 grupper (Stykkliste rad 9, MPS uke 3, Planlagte mottak rad 2). V-F06: én strukturfeil (H1) med
  linjen om ledetid som er hoppet over, og én verdifeil (Planlagte mottak rad 3).
- Tester før commit: vitest 949/949, Playwright 160/160 i Chromium og Firefox (CSP-vakttesten er `test.fail()` og skal
  feile), typesjekk, oxlint og bygg uten feil. Kontrasten i oppsummeringen er målt i begge visningene (minst 4,5:1).
- Målt i Chromium og Firefox: oppsummeringen for V-F05 er 472 px høy i 1366 × 630.
- Carmen testet visuelt i utviklingsserveren (localhost:5173) med V-F05, V-F06 og testeksempel 01 i lys og mørk visning.
- PR #36 viste seg å være Iduns PR for Story 1.8 og ble ikke endret. Story 1.12 får sin egen PR.

### Åpne punkter
- Gruppen må bekrefte avklaringen: kravet om 1366 × 630 uten rulling gjelder startsiden uten feiloppsummering.
  Etterpå bør setningen inn i DESIGN.md › Layout & Spacing.
- Feiloppsummeringen nevner ikke sløyfekontrollen (feil i Nivå/Varenummer) eller ukene mot H når horisonten er ugyldig.
  Krever flere grunner i `HoppetOverKontroll` (egen PR for `typer.ts`).
- Meldingen for uke etter horisonten sier ikke hva H er (fra Story 1.9). Krever også en endring i `typer.ts`.
- Kort skjermlesertest med NVDA av feiloppsummeringen er ikke gjort (EXPERIENCE.md › Accessibility).
