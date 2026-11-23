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

## 2026-11-23 kl. 17:17 — Sebastian

### Oppgave
Sebastian ba om å hente Story 1.1 fra Carmens branch til `Sebastian/Branch`, gjennomføre de fem anbefalingene fra forrige seksjon og oppdatere de andre dokumentene samtidig.

### Plan
- Flette `origin/story/1.1-prosjektoppsett` (PR #20, ffcc70c) inn i `Sebastian/Branch`. «Åpne avklaringer» står i beskrivelsen til PR #20, ikke på `Carmen/Branch`.
- Endre kode og tester, kjøre `npm ci`, `test`, `lint`, `build` og `test:e2e`, og deretter arkitekturen, `epics.md`, README og ordbanken.

### Resultat
- Story 1.1 er flettet inn i `Sebastian/Branch` (7a7ed0a).
- **Kode og tester** (ikke committet):
  - `package.json` og `package-lock.json`: `engines.node` er `^22.12.0 || ^24.0.0 || ^26.0.0`.
  - `.npmrc`: `allow-remote=root`. Dette er nytt: npm 12 (installert globalt på denne maskinen, 12.2.2) har `allow-remote=none` som standard og stoppet `npm ci` på SheetJS fra cdn.sheetjs.com med `EALLOWREMOTE`. Med `root` godtas bare nettadresser som står i `package.json`. Node 26.7 leveres med npm 11.19.0, der standarden er `all`.
  - `vercel.json`: `X-Content-Type-Options: nosniff` og `Referrer-Policy: no-referrer`. Kommentaren i `vite.config.ts` er oppdatert.
  - `tests/csp.test.ts`: tester at `vercel.json` har nøyaktig CSP-en og de to hodene, og at `vite preview` sender de samme.
  - `e2e/csp-vakt.ts` (ny): felles fixture med `auto: true` som feiler hver e2e-test ved `securitypolicyviolation`, konsollfeil og unntak. Valget `forventerCspBrudd` slår den av for testen med `connect-src`.
  - `e2e/oppstart.spec.ts`: bruker vakten, sjekker at nettleseren mottar alle hodene fra `vercel.json`, og har en selvtest med `test.fail()` som viser at vakten stopper en inline-stil. Uten `test.fail()` feilet den med «style-src-elem: inline» i begge nettleserne.
  - `tests/hjelpere/arkitekturregler.ts`: `SHEETJS_UNNTAK` har også `tests/hjelpere/lag-arbeidsbok.ts`. `tests/arkitektur.test.ts` tester at en annen hjelper fortsatt gir brudd.
- **Dokumenter:**
  - `arkitektur.md`: kap. 2 (`vercel.json`), AD-15 (to testhjelpere, og hva som må testes med filer fra Excel), AD-17 (hodene, HSTS fra Vercel, ingen CSP på dev, CSP-vakten), AD-18 (`test:e2e` når `ui/`, `worker/` eller `excel/` endres, og `.npmrc`), kap. 5 (Node og typepakkene) og en rad i kap. 12 merket «til godkjenning hos Idun og gruppen».
  - `epics.md`: tekniske føringer (versjoner, Excel-delen, tester, publisering, arbeidsflyt), Story 1.1 (engines, `.npmrc`, SheetJS-unntaket, hodene, CSP-vakten), Story 1.3 (Node 24 på Vercel og HSTS) og Story 1.5 (ny Gitt-blokk for `lag-arbeidsbok.ts` og filer fra Excel).
  - README: forutsetningene for Node, `preview` med hodene, `test:e2e` før fletting, og at dev ikke har CSP.
  - Ordbanken: CSP, E2e og HSTS under Forkortelser, og Sikkerhetshode og CSP-vakt under App og test. `updated` er 2026-11-23.
- **Kontroll** (Node 26.7.0, npm 12.2.2, ren `npm ci`): `npm test` 37/37, `npm run lint` exit 0, `npm run build` exit 0, `npm run test:e2e` 6/6 (Chromium og Firefox). Selvtesten vises som ✘ i listen, men telles som bestått, fordi den skal feile.
- Endringene er ikke committet. Arbeidet ligger på `Sebastian/Branch`, som ikke kan flettes til main i sin helhet.

### Åpne punkter
- Endringene må inn i PR #20 eller en egen PR fra en ren branch fra `story/1.1-prosjektoppsett`, ikke via `Sebastian/Branch`. Avklar med Carmen.
- Idun og gruppen godkjenner endringene (kap. 12 er merket «til godkjenning»), også `allow-remote=root`, som ikke var blant de fem punktene.
- Ordbanken på `Sebastian/Branch` er eldre enn den på main. De fem nye ordene må føres inn i main-versjonen når endringene flyttes.

## 2026-11-23 kl. 17:23 — Sebastian

### Oppgave
Sebastian ba om en ren branch med endringene og en PR inn i Carmens branch for Story 1.1.

### Plan
- Egen arbeidsmappe (`git worktree`) i `C:/IBE160/G23-story-1.1-avklaringer` på den nye branchen `story/1.1-avklaringer`, laget fra `origin/story/1.1-prosjektoppsett`.
- Endringene fra `Sebastian/Branch` lagt inn som patch, unntatt ordbanken. De fem ordene ble ført inn i main-versjonen av ordbanken i stedet.

### Resultat
- Commit aeb139d på `story/1.1-avklaringer` (14 filer), pushet.
- PR #22 inn i `story/1.1-prosjektoppsett`: https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/pull/22
- Kontroll i den rene branchen (Node 26.7.0, npm 12.2.2, ren `npm ci`): `npm test` 37/37, lint og build exit 0, `test:e2e` 6/6.
- Lukket fra issues: flytte endringene til en ren branch, og de fem ordene i main-versjonen av ordbanken.
- De samme endringene ligger fortsatt ukommittert i arbeidskopien på `Sebastian/Branch`.

### Åpne punkter
- Carmen ser over og fletter PR #22 inn i `story/1.1-prosjektoppsett`, og Idun og gruppen godkjenner endringene (står allerede i issues).
- Arbeidsmappen `C:/IBE160/G23-story-1.1-avklaringer` fjernes med `git worktree remove` når PR #22 er flettet.

## 2026-11-23 kl. 17:40 — Sebastian

### Oppgave
Sebastian godkjente PR #22, #20 og #21 og ba om at de ble flettet til main i riktig rekkefølge, etter en gjennomgang og med tillatelse før fletting. Raden for avklaringene i arkitektur kap. 12 skulle endres til «godkjent av Sebastian».

### Plan
- Gjennomgang: status, Vercel og prøvefletting av main + #22 + #20 + #21 i arbeidsmappen.
- Rekkefølge: #22 inn i `story/1.1-prosjektoppsett` → #20 til main → målbranch for #21 byttes til main, main flettes inn i `story/1.2-delte-typer` med konflikten løst → #21 til main. Merge commits, ikke squash. Ingen brancher slettet.

### Resultat
- **Funn i gjennomgangen:** én konflikt i arkitektur kap. 12, der #21 (PASSORDBESKYTTET) og #22 begge la til en rad 23.11. Ingen hadde godkjent #20 og #22 på GitHub, og #21 var et utkast med målbranch `story/1.1-prosjektoppsett`. Prøveflettingen var grønn: `npm test` 58/58, lint, build og `test:e2e` 6/6.
- 6154eae: raden i kap. 12 sier «godkjent av Sebastian 23.11.2026» (PR #20 og #22).
- PR #22 flettet inn i `story/1.1-prosjektoppsett` (10757c0).
- PR #20 godkjent av Sebastian og flettet til main (ea73bf0).
- PR #21: målbranch byttet til main, main flettet inn i `story/1.2-delte-typer` med begge radene i kap. 12 beholdt (233492e, pushet), merket klar, godkjent av Sebastian og flettet til main (89fed18).
- **Kontroll på main 89fed18** (ren `npm ci`, Node 26.7.0, npm 12.2.2): `npm test` 58/58, lint og build exit 0, `test:e2e` 6/6. Vercel-status på main: success.
- Lukket fra issues: Carmen fletter PR #22, godkjenning av avklaringene og av `allow-remote=root`.

### Åpne punkter
- `Sebastian/Branch` har fortsatt de samme endringene ukommittert i arbeidskopien. De ligger nå i main og bør forkastes før main flettes inn i branchen.
- Arbeidsmappen `C:/IBE160/G23-story-1.1-avklaringer` (står på main i detached HEAD) og den lokale prøvebranchen `proeve/samlet` kan fjernes. Branchene `story/1.1-prosjektoppsett`, `story/1.1-avklaringer` og `story/1.2-delte-typer` er flettet og kan slettes på GitHub.
- Idun og gruppen har ikke sett over #22 selv. Raden i kap. 12 sier at Sebastian godkjente.
