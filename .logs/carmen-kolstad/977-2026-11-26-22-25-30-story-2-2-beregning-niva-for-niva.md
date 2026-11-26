# Story 2.2 Beregning nivå for nivå

## 2026-11-26 kl. 22:25 — Carmen Kolstad

### Oppgave
BMAD Build for Story 2.2: beregne hele stykklisten fra ferdigproduktet og ned, med felles deler én gang, bygd på `beregnNetting` fra Story 2.1 (PR #43), og med harde fasittester mot alle fem Excel-eksemplene. Carmen har ansvar for beregningskjernen i Epic 2.

### Plan
- Plan og spec: [spec-2-2-beregning-niva-for-niva.md](../../.docs/implementation-artifacts/spec-2-2-beregning-niva-for-niva.md) (status `done`, med beslutninger, Implementation Notes og Review Triage Log).
- Beslutninger fra Carmen: 1A komplett `Resultat` med tomme eksepsjoner til Story 2.3. 2A fasit 04 gjelder ved kravkonflikten for 300-028. 3A harde fasittester også for fasit 05. 4A vente til PR #43 var flettet. Spec-en beholdt samlet.
- Kontroll før implementering: reglene ble kjørt i et skript i scratchpad mot inndatafilene. Det ga 0 avvik på 276 rader (46 deler × 6) og like bestillingsforslag i fasit 01–05.
- PR #43 ble analysert uten å hente inn koden. Den ble flettet underveis (`8c85e51`), og branchen ble fast-forwardet før implementeringen. Grensesnittet var uendret.
- Implementering, så tre uavhengige kodegjennomganger (Blind Hunter, Edge Case Hunter, Verification Gap), så rettelser av godkjente funn.

### Resultat
- Commit `96e9df00ba2f648f44335ca2042d825cd3028af8` (Story 2.2: Beregning nivå for nivå) på `story/2.2-beregning-niva-for-niva`:
  - `src/domene/beregn.ts`: `beregnBestillingsplan(inndata, struktur): Resultat`. `typer.ts`, `netting.ts` og `struktur.ts` er uendret.
  - `tests/fasit/bestillingsplan.test.ts`: testeksempel 01–05 gjennom les → valider → byggStruktur → beregn, sammenlignet med Fasittabell (alle tall og delrekkefølgen) og Bestillingsforslag. Alt er identisk, også fasit 05.
  - `tests/hjelpere/fasit-leser.ts` og `tests/fasit/fasit-leser.test.ts`: streng fasitleser som avviser dupliserte rader og feil ukekolonner.
  - `tests/domene/beregn.test.ts`: håndregnede tall, blant annet et tre-nivå-eksempel. Det fanger 15 av 16 mutasjoner alene, og den siste er ekvivalent.
  - `.docs/ordbank.md`: Beregningsrekkefølge og Fasittest.
- Kodegjennomgangene fant ingen reelle feil i beregningen. Testhull og forbedringer #1 og #4–#9 er rettet. #21 er ikke utsatt, fordi Story 2.3 og Epic 5 dekker det.
- Verifisering: `npm test` 1122/1122, `oxlint` 0 funn, `tsc -b` uten feil, `npm run build` ok.
- Lukket i issues.md: «Story 2.2: fasittester som leser Excel for testeksempel 01–05».

### Åpne punkter
- Kravkonflikt for 300-028: AK-et i Story 2.2 i epics.md sier at mottak som er fremskyndet mer enn én uke, ikke gir nye planlagte ordremottak i ukene mellom. Fasit 04 har 30 i uke 4 (et nytt behov). Ordlyden må avklares med gruppen. epics.md er ikke endret.
