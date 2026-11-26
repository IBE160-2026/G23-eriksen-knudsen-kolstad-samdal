# Story 2.1 Netting for én del

## 2026-11-26 kl. 21:18 — Carmen Kolstad

### Oppgave
Bygge en stabil beregningskjerne for én del (FR-6–FR-8, AD-7) som Story 2.2–2.5 og senere kapasitet og fast partistørrelse kan bruke. Arbeidet fulgte BMAD Build: plan, kontroll mot fasit, implementering, tre uavhengige kodegjennomganger, rettelser, commit og PR med Idun som reviewer.

### Plan
- BMAD Build startet ikke fordi `communication_language` manglet. Løst med den personlige fila `_bmad/custom/config.user.toml` (Norwegian, git-ignorert).
- Samlet bakgrunn for epic 2 i [epic-2-context.md](../../.docs/implementation-artifacts/epic-2-context.md) og spec i [spec-2-1-netting-for-en-del.md](../../.docs/implementation-artifacts/spec-2-1-netting-for-en-del.md).
- Carmens beslutninger: 1A typene i `netting.ts` så lenge de er interne (AD-3 avklares hvis kode utenfor domene/ trenger dem), 2A bare `fremskynding` av/på nå, spec-en beholdes hel.
- Reglene ble kontrollert mot fasit 01–05 med et skript i scratchpad før implementering: 0 avvik på 46 deler, lagerbalansen og SS holdt.
- Gjennomgang med Blind Hunter, Edge Case Hunter og Verification Gap. 14 funn ble vurdert, punkt 1–7 rettet etter godkjenning, resten avvist med begrunnelse (Review Triage Log i spec-en).

### Resultat
- `src/domene/netting.ts`: `beregnNetting(inndata, innstillinger?)`, `STANDARDINNSTILLINGER`, typene `NettingInndata`, `Nettinginnstillinger`, `NettingUke`, `Nettingsvar`, `FremskyndetMottak`.
- `tests/domene/netting.test.ts`: 90 tester (fasit 01 og 04, grensetilfeller, lagerbalanse, SS, forfalt mengde, innstillinger med `undefined`, stopp når nettobehovet er dekket, importtest). Rettelsene ble kontrollert med mutasjoner.
- Ordbanken: Netting og Nettinginnstillinger.
- `npm test` 1040/1040, lint 0 funn, `tsc -b` ok, `npm run build` ok.
- Commit `80dfcc8db9fb4a8063e45329ca6bebb50c041718` på `story/2.1-netting-for-en-del`. PR mot `main` med Idun-Samdal som reviewer, ikke merget.
- Punkt 14 fra gjennomgangen (uke som ikke er heltall) står ikke i `deferred-work.md`, fordi valideringen dekker det.

### Åpne punkter
- Story 2.3 må avgjøre om to planlagte mottak i samme uke som fremskyndes sammen, gir én eller to «Mottak forsinket» (nettingen gir én post per linje, fasitene avgjør det ikke).
- Story 2.2 må lage fasittester som leser Excel for testeksempel 01–05 (nettingen har bare enhetstester med tall fra 01 og 04).
- `_bmad/config.toml` mangler `communication_language`, så BMAD-skills stopper i nye worktrees. Bør rettes felles (installasjonen eller `_bmad/custom/config.toml`).
