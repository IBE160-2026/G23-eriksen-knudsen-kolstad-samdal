# Story 1.9: Kontroll av MPS og Planlagte mottak

## 2026-11-24 kl. 17:47 — Sebastian

### Oppgave
Start Story 1.9 (kontroll av MPS og Planlagte mottak) med `bmad-build`.

### Plan
- Grenen `story/1.9-kontroll-mps-mottak` ble laget fra `story/1.6-kontroll-struktur`, siden 1.9 bruker `valider.ts`, `heltall.ts` og `hoppesOver`, og PR #25 ikke er flettet.
- Epic 1-konteksten var fortsatt gyldig.
- Spesifikasjon: [spec-1-9-kontroll-av-mps-og-planlagte-mottak.md](../../.docs/implementation-artifacts/spec-1-9-kontroll-av-mps-og-planlagte-mottak.md). Godkjent av Sebastian, og beholdt samlet selv om den er over 1 600 tokens.
- Beslutninger i planen:
  - Uken leses fra Excel-raden (rad 2 = uke 1).
  - «Uke fylt ut etter et hull» gir feil for hver utfylt uke etter hullet.
  - Et sikkerhetsnett gjør stykklisteradene om til riktige typer før Stykkliste-reglene i 1.8 finnes.
- Implementering ved en subagent, deretter gjennomgang med tre reviewere og vurdering av funnene.

### Resultat
- `src/domene/valider.ts`:
  - `validerMpsOgMottak` kontrollerer MPS (horisont 8–12, antall heltall ≥ 0, uker etter et hull) og Planlagte mottak (varenummer finnes i Stykkliste, uke 1..H, antall ≥ 1).
  - Er horisonten ugyldig, hoppes uke-kontrollen mot H over, så det ikke blir følgefeil.
  - `valider(raa)` samler alle feilene og gir `Inndata` når filen er gyldig.
  - Stykkliste-reglene er en plassholder som Idun bytter ut med `validerStykkliste` fra 1.8, med én linje.
  - Sikkerhetsnettet gir koden for en celle (for eksempel `NIVAA_UGYLDIG`) i stedet for et unntak.
- `src/tekster/nb.ts`: `filfeilOgValidering.mpsOgMottak` med sju maler i formen «Planlagte mottak, rad 4, Uke: …».
- Testene:
  - V-M01–V-M05 og V-P01–V-P04 gir hver nøyaktig feilen README-en oppgir.
  - V-F05 og V-F06 gir feilene i MPS og Planlagte mottak.
  - V-G01–V-G03 og testeksempel 01–05 gir `Inndata`.
- Ordbanken har fått «Hull» og «Følgefeil».
- Gjennomgangen ga 19 funn:
  - 8 er rettet, blant annet tester som ellers ville feilet når 1.8 flettes, og en feil i teksten om horisonten når det er et hull.
  - 2 er utsatt: H mangler i meldingen «etter horisonten», og en test som sjekker at alle kodene har en mal, bør komme når 1.8 er flettet.
  - Resten er avvist med begrunnelse i spesifikasjonen.
- `npm test` (292 tester), lint og bygg er grønne. Commit `c068b87` på `story/1.9-kontroll-mps-mottak`.
- Etter at Idun hadde godkjent, ble PR #25 (Story 1.6) flettet til `main` (`717e751`). Grenen for 1.9 er pushet, og [PR #28](https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/pull/28) er opprettet med Carmen som reviewer. Beskrivelsen har fire punkter hun skal svare på, blant annet om `valider()` passer til worker-en i 1.10.
- Mens 1.9 ble implementert, la en annen Claude-økt i samme mappe tre loggcommits for PR #26 (Story 1.7, Idun) på denne grenen (`408adbb`, `d75d526`, `ed8092c`). De gjelder bare `.logs/` og blir med i PR-en for 1.9.

- Carmen kommenterte PR #28 med fire spørsmål før godkjenning. Sebastian fulgte anbefalingen:
  - Punkt 4 (uke 0 og negative uker slapp gjennom når horisonten var ugyldig) er rettet i `ba47857`, med en ny test. Testene (293), lint og bygg er grønne.
  - Punkt 1–3 (plassholderen for 1.8, kolonnen Uke og flere feil ved et hull) er besvart i en kommentar på PR-en. De er med vilje eller beholdes.
  - Forslaget om å nevne uken som mangler ved et hull, tas sammen med punktet om H i meldingen.
- Carmen godkjente PR #28 etter svarene, og den er flettet til `main` (`b635db8`). Sebastians del av Epic 1 (1.5, 1.6 og 1.9) er dermed i `main`.

### Åpne punkter
- Idun må vite at `valider()` har en plassholder for Stykkliste-reglene som 1.8 bytter ut, og at sikkerhetsnettet gir Stykkliste-koder uten tekstmal til 1.8 legger dem inn (`deferred-work.md`).
- Meldingen «etter horisonten» sier ikke hva H er. Krever et felt i `Valideringsfeil` (PR for `typer.ts`), eller at 1.12 viser H (`deferred-work.md`).
