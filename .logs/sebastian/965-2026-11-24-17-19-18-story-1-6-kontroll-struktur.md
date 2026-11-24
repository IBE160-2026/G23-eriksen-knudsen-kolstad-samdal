# Story 1.6: Kontroll av malens struktur

## 2026-11-24 kl. 17:19 — Sebastian

### Oppgave
Start Story 1.6 (kontroll av malens struktur) med `bmad-build`, når alt var klart. Heltallsfunksjonen skulle lages her (Sebastians beslutning 24.11).

### Plan
- Grenen `story/1.6-kontroll-struktur` ble laget fra `story/1.5-les-excel`, siden testene trenger `les.ts` og PR #24 ikke var flettet ennå.
- Epic 1-konteksten ble laget på nytt av en subagent, fordi AD-15 var endret etter forrige gang.
- Spesifikasjon: [spec-1-6-kontroll-av-malens-struktur.md](../../.docs/implementation-artifacts/spec-1-6-kontroll-av-malens-struktur.md). Godkjent av Sebastian, og beholdt samlet selv om den er over 1 600 tokens.
- Implementering ved en subagent, deretter gjennomgang med tre reviewere og vurdering av funnene.

### Resultat
- `src/domene/valider.ts`:
  - `validerStruktur(raa)` gir `ARK_MANGLER`, `GAMMEL_MAL` (når arket Produkt eller Komponenter finnes og Stykkliste mangler) og `OVERSKRIFT_MANGLER` på malens plass (for eksempel H1).
  - Lista `hoppetOver` har kolonnene i ark som mangler, overskrifter som mangler, og to avhengigheter mellom arkene: Planlagte mottak › Uke uten MPS eller «Antall ferdigprodukter», og Planlagte mottak › Varenummer uten Stykkliste › Varenummer.
  - `hoppesOver(resultat, ark, felt)` godtar bare kolonner som hører til arket.
- `src/domene/heltall.ts`: `tolkHeltall` er den felles heltallsregelen (AD-4), med én test per tilfelle.
- `src/tekster/nb.ts`: `filfeilOgValidering.struktur` med maler for de tre kodene, etter EXPERIENCE.md. `GAMMEL_MAL` står ordrett som der, og MPS skrives «Prognostiserte behov (arket MPS)».
- `tests/hjelpere/valideringsfasit.ts` leser README-en for valideringsfilene, og 1.8 og 1.9 kan bruke den.
- Testene: V-F01, V-F02, V-F03 og V-F06 gir feilen README-en sier. Testeksempel 01–05 og V-G01–V-G05 gir 0 feil.
- Ordbanken har fått «Gammel mal» og «Strukturfeil».
- Gjennomgangen (Verification Gap fant ingenting) ga 15 funn:
  - **Malene:** min regel om én setning i den låste delen stred mot EXPERIENCE.md. Sebastian avgjorde at malene skal følge EXPERIENCE.md, og at koden beholdes og bare malene skrives om, i stedet for å tilbakestille alt som BMAD sier.
  - **5 rettet:** en test for en fil med et gammelt ark ved siden av Stykkliste, en strengere type for `hoppesOver`, «Strukturfeil» i ordbanken og to kontroller i testhjelperen.
  - **1 utsatt:** avhengighetene inne i Stykkliste, se `deferred-work.md`.
  - **Resten avvist,** med begrunnelse i spesifikasjonen.
- `npm test` (176 tester), lint og bygg er grønne. Commit `8061b12` på `story/1.6-kontroll-struktur`. Grenen er pushet til origin, men har ingen PR ennå (venter på at PR #24 for 1.5 blir flettet).

### Åpne punkter
- Story 1.8 (Idun) må avgjøre hvilke Stykkliste-regler som hoppes over når overskriften Nivå eller Varenummer mangler. `HoppetOverKontroll` har bare (ark, felt), så delregler krever en endring i `typer.ts`. Se `deferred-work.md`.
- Gi Idun beskjed om at `heltall.ts`, `hoppesOver`, `valideringsfasit.ts` og underobjektene i `nb.ts` ligger i 1.6. Story 1.8 bør bygge på `story/1.6-kontroll-struktur`, eller på main når 1.5 og 1.6 er flettet.
