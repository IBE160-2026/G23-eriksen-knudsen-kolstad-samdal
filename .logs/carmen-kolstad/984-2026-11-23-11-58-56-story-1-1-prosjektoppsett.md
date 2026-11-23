# Story 1.1: prosjektoppsett

## 2026-11-23 kl. 11:58 — Carmen Kolstad

### Oppgave
Carmen ba om å implementere Story 1.1 (prosjektoppsett) etter akseptkriteriene i `epics.md` og den vedtatte arkitekturen på main. Arbeidet skulle skje i en egen arbeidsmappe (git worktree) fra siste `origin/main`, på branchen `story/1.1-prosjektoppsett`, uten å røre `Carmen/Branch`. Hun sa det var avklart i gruppen at Sebastian legger `epics.md` i main. Hun ga lov til å installere avhengigheter i den nye arbeidsmappen, med eksakte versjoner og uten å bytte teknologi. Ingen commit, push eller pull request før hun har kontrollert resultatet, og ingen story 1.2.

### Plan
- Kontrollere at `epics.md` er i `origin/main` før arbeidsmappen lages, og stoppe hvis ikke.
- Lage arbeidsmappen `../G23-story-1.1` med `git worktree add`. Upstream fjernes, så en push ikke kan gå til main ved et uhell.
- Lage Vite-malen `react-ts` (create-vite 9.3.4) i scratchpad og kopiere inn bare det som trengs.
- Skrive oppsett, mappestruktur, `tekster/nb.ts`, `vercel.json` og testene (arkitektur, CSP, filene i `public/`, mappestruktur, røyktest i nettleser).
- Kjøre de fem kommandoene og prøve midlertidige regelbrudd for å vise at testene oppdager dem.

### Resultat
- **Grunnlag:** `epics.md` kom i main med PR #19 (`2dedb6b`) og er lik versjonen på `Sebastian/Branch` (`c46467a`). Arbeidsmappen er laget fra `2dedb6b`.
- **Filer** (ingen er committet):
  - `package.json` (eksakte versjoner fra arkitektur kap. 5, SheetJS fra cdn.sheetjs.com, `engines.node` 24.x), `package-lock.json`, `.npmrc` (`save-exact`, `engine-strict`)
  - `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.test.json` (alle med `strict`), `.oxlintrc.json`, `playwright.config.ts`, `vercel.json`
  - `src/main.tsx`, `src/ui/App.tsx` (midlertidig rotkomponent), `src/tekster/nb.ts` (sju faste seksjoner), `.gitkeep` i `domene/`, `excel/`, `lagring/`, `worker/`, `app/` og `ui/felles/`
  - `public/COSI-MRP-mal.xlsx` og `public/testeksempel-01.xlsx`, kopiert fra `testdata/`
  - `tests/arkitektur.test.ts`, `tests/hjelpere/arkitekturregler.ts`, `tests/csp.test.ts`, `tests/public-filer.test.ts`, `tests/mappestruktur.test.ts`, `e2e/oppstart.spec.ts`
  - `README.md`: «Kom i gang» og mappestrukturen er oppdatert
- **Valg som ikke står i arkitekturen:**
  - Typepakkene `@types/react` 19.3.0, `@types/react-dom` 19.3.0 og `@types/node` 24.19.2. Det er ingen ny teknologi, men de står ikke i kap. 5.
  - CSP-en står bare i `vercel.json`, og `vite.config.ts` leser den derfra til `preview.headers`. Den brukes ikke på `npm run dev`, fordi Reacts oppdatering under utvikling trenger inline-skript.
  - Arkitekturtesten leser importene med regulære uttrykk, fordi TypeScript 7 ikke har JavaScript-grensesnittet til kompilatoren.
  - `npm run lint` er `oxlint --deny-warnings`. Uten flagget avsluttet oxlint med kode 0 selv om den fant `debugger`.
- **Feil underveis:** den første kjøringen av `npm test` feilet. Arkitekturtesten leste eksempler i tekststrenger i sin egen testfil som SheetJS-importer. Den er rettet slik at strenger med mellomrom ikke regnes som kode, og det er lagt til en test for det.
- **Testresultater fra ren installasjon** (Node 24.20.0, npm 11.19.0):
  - `npm ci`: exit 0, 56 pakker. npm varsler at `fsevents` har installasjonsskript som ikke er godkjent.
  - `npm test`: exit 0, 4 testfiler, 32 tester grønne.
  - `npm run lint`: exit 0.
  - `npm run build`: exit 0. `tsc -b` kontrollerer app, konfig og tester.
  - `npm run test:e2e`: exit 0, 2 tester grønne (Chromium og Firefox).
- **Midlertidige regelbrudd** (alt fjernet og tilbakestilt etterpå, og filene i `public/` er kontrollert like):
  - Arkitekturtesten fant 10 brudd og sa hvilken fil og hvilken regel:
    - `domene/` som importerte `tekster/` og `xlsx`, og brukte `window`, `Date.now`, `new Date()` og `Math.random`
    - `ui/` som importerte `excel/`
    - en fil i `tests/` som importerte SheetJS
    - `^` og `~` i `package.json`
  - `csp.test.ts` feilet når CSP-en i `vercel.json` ble endret.
  - `public-filer.test.ts` feilet når `public/testeksempel-01.xlsx` fikk én ekstra byte.
  - `npm run lint` feilet (exit 1) på en fil med `debugger`.
  - `npm run test:e2e` feilet i både Chromium og Firefox med et inline-skript i `index.html`, fordi CSP-en blokkerte det.
- **Ikke kontrollert:** at `npm test` virker med nettet slått av. Testene leser bare lokale filer, men det er ikke prøvd uten nett.
- **Uendret:** main, `Carmen/Branch`, de lokale filene og loggene der, og stash-ene. Det er ikke gjort commit, push eller pull request. Ingen sesjonslogg-rutine som committer automatisk er brukt.

### Åpne punkter
- Carmen kontrollerer resultatet før commit og pull request.
- Gruppen eller Idun godkjenner de tre typepakkene som ikke står i arkitektur kap. 5, og om de skal føres inn der.
- Bare `tests/hjelpere/fasit-leser.ts` kan bruke SheetJS i testene (akseptkriteriet). Skal hele `tests/hjelpere/` få unntaket, så Story 1.5 kan lage små arbeidsbøker i testene? Sebastian eller gruppen avgjør.
- `vercel.json` setter bare CSP-en. Arkitektur kap. 2 nevner «CSP og andre sikkerhetshoder», uten å si hvilke.
- npm 11 varsler om installasjonsskriptet til `fsevents` (valgfri pakke for macOS). Det påvirker ikke kommandoene.
- Etter at PR-en er flettet, fjernes arbeidsmappen med `git worktree remove` (se tillegget under for ny plassering).

## 2026-11-23 kl. 12:12 — Carmen Kolstad (teknisk gjennomgang og rettelser)

### Oppgave
Carmen ba om en teknisk gjennomgang av Story 1.1 før commit og pull request: akseptkriteriene, arkitekturtesten, versjonene, sikkerhetsoppsettet mot AD-17, README og hva som ville bli med i en commit. Etterpå godkjente hun rettelsene 1–6, med rammene: rette H1 og H2 (og H3 hvis det er enkelt) med tester, rette bare de to setningene i README, utvide e2e-testen uten å sende data ut, flytte bare story-arbeidsmappen ut av iCloud med `git worktree move`, oppdatere denne loggen og forberede punktene til pull requesten. Ingen commit, push eller pull request, og ikke Story 1.2.

### Plan
- Gjennomgang uten endringer, med grensetilfeller prøvd i et skript i scratchpad.
- Rettelsene i godkjent rekkefølge, så midlertidige brudd for å vise at de nye kontrollene virker, og til slutt alle fem kommandoene på nytt.

### Resultat
- **Funn i gjennomgangen:**
  - 35 grensetilfeller ble prøvd mot arkitekturreglene, og 11 ga et annet resultat enn ventet:
    - **H1:** filer i en ukjent mappe i `src/` eller rett i `src/` ble ikke kontrollert.
    - **H2:** `import()` med backtick ble ikke oppdaget.
    - **H3:** `new URL(…, import.meta.url)` og `import.meta.glob` ble ikke kontrollert.
    - **Mindre hull som er godtatt:** et regulært uttrykk med anførselstegn foran en import på samme linje, og `Date['now']`.
    - **Mindre falske feil som er godtatt:** en streng uten mellomrom som ser ut som kode, JSX-tekst og `fil.document`.
  - README hadde to unøyaktige setninger: «`package-lock.json` er committet» og «samme CSP som på Vercel».
  - E2e-testen sammenlignet bare en del av CSP-hodet.
  - `~/Desktop` synkroniseres med iCloud Drive (`com.apple.CloudDocs.iCloudDriveFileProvider`). iCloud hadde laget 34 dubletter («… 2») i `node_modules`.
- **I orden ved gjennomgangen:**
  - `package.json`, `package-lock.json` (versjon 3) og de installerte versjonene er like for alle 15 pakkene. Lockfila henter bare fra registry.npmjs.org og cdn.sheetjs.com, og alle pakkene har `integrity`.
  - `preview` sender CSP-en ordrett på `/`, på filene i `/assets/` og på ukjente adresser. `dev` sender ingen CSP og har et inline-skript.
  - Bygget har ingen inline-skript eller stiler.
  - `npm test` er kjørt i macOS-sandkassen med nettet stengt: 32 av 32 grønne. `curl` i samme sandkasse ble stoppet.
- **Rettelser:**
  - `tests/hjelpere/arkitekturregler.ts`:
    - H1: en fil i `src/` som ikke hører til en del, er et brudd («kap. 2: hver fil i src/ hører til en del»).
    - H2: dynamiske importer med backtick oppdages.
    - H3: `new URL('…', import.meta.url)` og `import.meta.glob('…')` følger de samme reglene som importer.
  - `tests/arkitektur.test.ts`: tre nye tester for H1, H2 og H3.
  - `README.md`: «`package-lock.json` ligger i repoet» og «med den samme Content Security Policy som `vercel.json` setter». Resten er ikke endret.
  - `e2e/oppstart.spec.ts`:
    - Den første testen sammenligner hele CSP-hodet med `vercel.json`.
    - En ny test gjør `fetch` til `https://ekstern.example/cosi-mrp-test` (et reservert domene) og forventer at nettleseren stopper den med `connect-src`.
    - Playwright fanger adressen lokalt, så ingenting sendes ut selv om CSP-en skulle svikte.
  - Arbeidsmappen er flyttet med `git worktree move` til `~/Utvikling/G23-story-1.1`.
    - Før flyttingen ble det kontrollert at målmappen ikke fantes, og at verken `~` eller `~/Utvikling` har iCloud-merket.
    - Det opprinnelige repoet på `Carmen/Branch` er ikke flyttet eller endret.
- **Midlertidige brudd** (alle fjernet etterpå):
  - Arkitekturtesten fant alle tre:
    - `src/hjelp/midlertidig.ts`, som er H1
    - `src/ui/midlertidig-dyn.ts` med `import()` med backtick til `lagring/`, som er H2
    - `src/domene/midlertidig-url.ts` med `new URL` til `worker/`, som er H3
  - Med `connect-src *` i `vercel.json` feilet den nye e2e-testen i både Chromium og Firefox, og forespørselen ble fanget lokalt av Playwright. `vercel.json` er tilbakestilt og kontrollert lik kopien.
- **Testresultater etter rettelsene** (ren `npm ci` i `~/Utvikling/G23-story-1.1`, Node 24.20.0, npm 11.19.0):
  - `npm ci`: exit 0, 56 pakker, 0 dubletter i `node_modules`, og `npm ls` uten feil.
  - `npm test`: exit 0, 4 testfiler, 35 tester grønne. Også 35 av 35 i macOS-sandkassen med nettet stengt.
  - `npm run lint`: exit 0.
  - `npm run build`: exit 0.
  - `npm run test:e2e`: exit 0, 4 tester grønne (2 i Chromium og 2 i Firefox).
- **Uendret:** main, `Carmen/Branch` og de lokale filene og stash-ene der. Det er ikke gjort commit, push eller pull request.

### Åpne punkter
- Carmen godkjenner commit og pull request.
- Punktene til pull requesten (typepakkene, `engine-strict`, CSP bare på `preview`, andre sikkerhetshoder og SheetJS i `tests/hjelpere/`) må avklares med Idun og gruppen der.
- Repoet på `Carmen/Branch` ligger fortsatt på skrivebordet, som synkroniseres med iCloud. Carmen vurderer om det også skal flyttes.
- Når PR-en er flettet, fjernes arbeidsmappen med `git worktree remove ~/Utvikling/G23-story-1.1`.
