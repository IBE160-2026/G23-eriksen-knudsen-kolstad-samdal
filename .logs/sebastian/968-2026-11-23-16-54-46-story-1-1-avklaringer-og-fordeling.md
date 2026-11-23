# Story 1.1: avklaringer og fordeling av Epic 1

## 2026-11-23 kl. 16:54 — Sebastian

### Oppgave
Gå gjennom de åpne avklaringene fra Carmens Story 1.1 (branch `story/1.1-prosjektoppsett`, ffcc70c), gi en anbefaling for hver, og fordele storyene i Epic 1 med rekkefølgen de må lages og flettes til main i. Fordelingen skulle bli et Word-dokument med en kort melding til gruppen.

### Plan
- Lese arkitektur kap. 2, 5, AD-15, AD-17, AD-18 og `epics.md`, og Carmens `package.json`, `.npmrc`, `vite.config.ts`, `vercel.json`, `tests/csp.test.ts`, `tests/hjelpere/arkitekturregler.ts` og `e2e/oppstart.spec.ts`.
- Én anbefaling per punkt, med begrunnelse og hva som må endres.
- Avhengighetene mellom Story 1.1–1.13 hentet fra akseptkriteriene i `epics.md`.

### Resultat
Anbefalingene (ingen er gjennomført ennå):
1. **Typepakkene** (@types/react og @types/react-dom 19.3.0, @types/node 24.19.2): godkjenn og før inn i kap. 5 og `epics.md:113`. AC i `epics.md:366` krever at alle versjoner står i kap. 5. Arkitekturtesten sjekker bare at versjonene er eksakte, så ingen kode endres.
2. **Node**: behold `engine-strict=true`, sett `engines.node` til `^22.12.0 || ^24.0.0 || ^26.0.0`. Node 26 er LTS nå (sensor, NFR-3/SM-6), og Vitest 5.1.1 støtter ikke 23 og 25. Endre README, kap. 5, `epics.md:113` og `:362`. Sjekk Node-versjonen i byggeloggen på Vercel.
3. **CSP bare på preview**: behold. Felles Playwright-fixture som feiler ved `securitypolicyviolation`/konsollfeil i alle e2e-tester (Story 1.3), `npm run test:e2e` før fletting for `ui/`, `worker/`, `excel/` (AD-18), én setning i AD-17.
4. **Sikkerhetshoder**: legg til `X-Content-Type-Options: nosniff` og `Referrer-Policy: no-referrer` i `vercel.json`, AD-17 og kap. 2 (`arkitektur.md:101`), med tester i `tests/csp.test.ts` og `e2e/oppstart.spec.ts`. HSTS fra Vercel kontrolleres i Story 1.3. Ikke X-Frame-Options, Permissions-Policy eller COOP.
5. **SheetJS i testhjelpere**: ikke hele `tests/hjelpere/`. Legg til `tests/hjelpere/lag-arbeidsbok.ts` (bare skriving) i `SHEETJS_UNNTAK`, og endre AD-15 (`arkitektur.md:283`), `epics.md:135`, `:380`. Story 1.5 får en setning om at formler, hjelpekolonner, passord, skadet og tom fil testes med filer fra Excel.

Fordeling av Epic 1 (forslag): Carmen 1.1, 1.2, 1.10, 1.11. Oda 1.3, 1.4, 1.13, 1.12. Sebastian 1.5, 1.6, 1.9. Idun 1.7, 1.8. Rekkefølge i åtte steg. Kjeden som bestemmer når Epic 1 er ferdig: 1.1 → 1.2 → 1.5 → 1.6 → 1.9 → 1.10 → 1.11 → 1.12.

Word-dokument med melding og tabell: `C:\Users\sebas\Personlig mappe\Epic 1 - fordeling og rekkefølge.docx` (én side, A4 liggende, kontrollert som PDF via Word). Ingen filer i repoet er endret.

### Åpne punkter
- Idun (punkt 1–3, og 4 sammen med gruppen) og gruppen (punkt 5) avgjør de fem avklaringene fra Story 1.1. Deretter alle endringene i én branch og én PR.
- Gruppen godtar fordelingen og rekkefølgen i Epic 1. Deretter føres den inn i arkitektur kap. 7 og 8, i samme PR som avklaringene.
- Sebastians maskin har Node 26.7.0, så `npm ci` stopper på Story 1.1 til `engines` er endret (punkt 2) eller Node 24 er installert.
