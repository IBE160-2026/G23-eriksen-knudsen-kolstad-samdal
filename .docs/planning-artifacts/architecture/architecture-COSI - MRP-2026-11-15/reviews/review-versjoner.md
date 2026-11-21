---
type: review
gate: 'BMAD reviewer gate – kontroll av versjoner og teknologipåstander'
target: 'ARCHITECTURE-SPINE.md (COSI - MRP v1)'
reviewer: 'Uavhengig anmelder (subagent), ikke forfatteren av spinen'
date: '2026-11-21'
---

# Kontroll av versjoner og teknologipåstander – ARCHITECTURE-SPINE.md

## Dom

**Godkjent med rettinger.** Alle versjonsnumrene i Stack-tabellen finnes i npm-registeret, og hovedvalgene (Vite + React + TypeScript, read-excel-file og write-excel-file, CSP-en, Vercel og Playwright) holder når de prøves i praksis. Men fire påstander er unøyaktige eller utdaterte og bør rettes før spinen brukes til epics og stories:

1. **Middels:** Reserven i AD-4 («SheetJS 0.19.3 eller nyere») slipper gjennom en kjent sårbarhet. Versjon 0.19.3 er fortsatt berørt av CVE-2024-22363 (ReDoS). Kravet bør være minst 0.20.2. Nyeste versjon på cdn.sheetjs.com er 0.20.3.
2. **Middels:** To versjoner i Stack-tabellen er ikke de nyeste, og de stemmer ikke med det `npm install` gir fra malen. @vitejs/plugin-react 6.1.2 og oxlint 1.90.0 er minimumsversjonene i malen (`^6.1.2`, `^1.90.0`). En ny installasjon gir 6.3.0 og 1.94.0. Setningen «kontrollert mot npm-registeret» stemmer derfor ikke for disse to.
3. **Lav til middels:** Node 24 er ikke lenger Active LTS. Linjen gikk over i Maintenance LTS 2026-10-20, og Node 26 har vært Active LTS siden 2026-10-28. Node 24 er støttet til 2028-04-30 og passer fortsatt for prosjektet, men spinen bør si dette presist.
4. **Lav:** Begrunnelsen for `worker-src blob:` peker på feil bibliotek. Konklusjonen er riktig, for `blob:` trengs. Men i nettleserinngangen `read-excel-file/browser` 9.3.20 lages workerne av **fflate** (asynkron unzip av filoppføringer på 320 000 byte eller mer, komprimert), ikke av worker-f. worker-f er med i bygget, men koden som bruker den kjøres ikke (`parseSpreadsheetContents.js`: «createWorkerFunction — Not used»).

## Metode

- `npm view <pakke> version` og `npm view <pakke> time --json` mot registry.npmjs.org, kjørt 2026-11-21.
- `npm pack create-vite@9.3.4` i scratchpad. Malen `template-react-ts` ble kopiert dit, installert og bygget med `npm run build`, med read-excel-file 9.3.20 og write-excel-file 4.1.1 lagt til. Ingenting ble installert i prosjektmappen.
- **Prøve i nettleser:** `vite preview` med spinens CSP i `preview.headers`, og Playwright 1.65.1 med `channel: 'chrome'` i headless modus. Siden skrev en `.xlsx` med write-excel-file, leste den med read-excel-file og registrerte alle `securitypolicyviolation`-hendelser og alle kall til `new Worker`. Prøven ble kjørt med en liten fil og med en stor fil (40 002 rader, 1,14 MB), og for hver fil både med og uten `blob:` i `worker-src`.
- Nettkilder for Node, SheetJS, CVE, Vercel, Playwright og Vite er lenket i tabellen.
- **Ikke prøvd:** Firefox og Edge er ikke installert på maskinen. CSP-prøven er derfor bare kjørt i Chrome.

## Funn

| # | Påstand i spinen | Kilde brukt | Status | Anbefalt retting |
| --- | --- | --- | --- | --- |
| 1 | Node.js 24 (LTS; v24.20.0 lokalt) | https://raw.githubusercontent.com/nodejs/Release/main/schedule.json, https://nodejs.org/dist/index.json, `node -v` | **Delvis bekreftet.** v24 «Krypton» er LTS, men i Maintenance siden 2026-10-20 og støttet til 2028-04-30. Node 26 «Lithium» er Active LTS (26.13.1). Nyeste 24.x er 24.22.3; lokalt er det v24.20.0. Node 24 tilfredsstiller `engines` i vite (`^20.19.0 \|\| >=22.12.0`), vitest (`^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`) og @playwright/test (`>=20`). | Skriv «Node 24 (Maintenance LTS, støttet til 2028-04-30)», og sett `.nvmrc` til nyeste 24.x. Det er ikke nødvendig å bytte til Node 26, men gruppen kan vurdere det, siden Node 26 har lengre støtte (til 2029-04-30). Malen bruker `@types/node ^24.19.2`, som passer med Node 24. |
| 2 | TypeScript 7.0.2 | `npm view typescript version` → 7.0.2. Malen har `~7.0.2`. `npx tsc -v` → 7.0.2, og `tsc -b` fungerte i prøvebygget. | **Bekreftet.** Nyere versjoner er bare `7.1.0-dev`. | Ingen. |
| 3 | Vite 8.3.8 | `npm view vite version` → 8.3.8 (2026-11-11). Malen har `^8.3.6`. | **Bekreftet.** 8.4.0-beta.1 finnes, men er ikke stabil. | Ingen. |
| 4 | @vitejs/plugin-react 6.1.2 | `npm view` → **6.3.0** (2026-11-09). 6.1.2 er fra 2026-10-05. Malen har `^6.1.2`, og ny installasjon gav 6.3.0. | **Ikke nyeste** (versjonen finnes, men er utdatert) | Endre til 6.3.0, eller skriv at tabellen viser malens minimumsversjoner og at eksakt versjon låses ved installasjon. Begge har peer `vite ^8.0.0`. |
| 5 | React / react-dom 19.3.1 | `npm view react version`, `npm view react-dom version` → 19.3.1. Malen har `^19.3.1`. | **Bekreftet.** | Ingen. |
| 6 | oxlint 1.90.0 | `npm view` → **1.94.0** (2026-11-16). 1.90.0 er fra 2026-10-27. Malen har `^1.90.0`, og ny installasjon gav 1.94.0. | **Ikke nyeste** | Endre til 1.94.0, eller bruk samme formulering som i #4. |
| 7 | Vitest 5.1.1 | `npm view vitest version` → 5.1.1 (2026-11-18). Peer `vite ^6.4.0 \|\| ^7 \|\| ^8`. | **Bekreftet.** | Ingen. |
| 8 | @playwright/test 1.65.1 | `npm view` → 1.65.1. | **Bekreftet.** | Ingen. |
| 9 | read-excel-file 9.3.20 | `npm view` → 9.3.20 (2026-11-19). | **Bekreftet.** Merk: pakken har ingen rotinngang (`"."` mangler i `exports`). Koden må importere fra `read-excel-file/browser` i appen og `read-excel-file/node` i Vitest. | Skriv importstiene i AD-4, så ingen prøver `import … from 'read-excel-file'`. |
| 10 | write-excel-file 4.1.1 | `npm view` → 4.1.1 (2026-06-08). | **Bekreftet.** Nettleserinngangen returnerer `{ toBlob, toFile }`. | Hvis eksport/ skal «returnere bytes» (AD-6), må den bruke `toBlob()` og konvertere, eller bruke `/universal`. Skriv dette inn i AD-4 eller AD-6. |
| 11 | AD-1: malen `react-ts` inneholder react, react-dom, @vitejs/plugin-react, typescript, vite, oxlint og @types/* | `npm pack create-vite@9.3.4` → `template-react-ts/package.json` | **Bekreftet.** Avhengigheter: react, react-dom. Utviklingsavhengigheter: @types/node, @types/react, @types/react-dom, @vitejs/plugin-react, oxlint, typescript, vite. Skript: `build: "tsc -b && vite build"`, `lint: "oxlint"`, `preview: "vite preview"`. | Ingen. Spinen kan gjerne nevne at create-vite-versjonen er 9.3.4. |
| 12 | SheetJS: xlsx 0.18.5 på npm er berørt av CVE-2023-30533, rettet i 0.19.3 | `npm view xlsx version` → 0.18.5. NVD API: https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2023-30533 («before 0.19.3 allows Prototype Pollution … 0.19.3 and later are unaffected»). https://cdn.sheetjs.com/advisories/CVE-2023-30533.html | **Bekreftet** | Ingen. |
| 13 | AD-4-reserve: «SheetJS CE fra cdn.sheetjs.com (versjon 0.19.3 eller nyere)» | https://cdn.sheetjs.com/advisories/ lister også **CVE-2024-22363**. NVD: «SheetJS Community Edition before 0.20.2 is vulnerable to ReDoS». Nyeste versjon er bekreftet ved å laste ned https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz: `package.json` sier `"version": "0.20.3"`. | **Feil.** Grensen 0.19.3 er for lav. | Endre til «0.20.3 (nyeste per 2026-11-21), aldri eldre enn 0.20.2 (CVE-2024-22363) og aldri npm-versjonen 0.18.5 (CVE-2023-30533 og CVE-2024-22363)». Oppdater også .memlog-linje 42. |
| 14 | AD-4: `InvalidInputError`-kodene er `FILE_NOT_SUPPORTED`, `INVALID_ZIP`, `NO_DATA` og `XLS_FILE_NOT_SUPPORTED` | `node_modules/read-excel-file/types/InvalidInputError.d.ts` (9.3.20) | **Ufullstendig.** Det finnes også `INPUT_TYPE_NOT_SUPPORTED`. I tillegg kan biblioteket kaste `InvalidSpreadsheetError` og `SheetNotFoundError`. | Ta med alle fem kodene og de to andre feilklassene i avvisningskartet i `inn/`. Ukjente feil går til `uventetFeil`. |
| 15 | AD-4: `schema`/`parseSheetData` brukes ikke | `browser/index.d.ts` eksporterer `parseSheetData` og `readSheet(…, { schema })` | **Bekreftet** (navnene finnes i 9.3.20) | Ingen. |
| 16 | AD-8/memlog: read-excel-file lager Web Worker fra `blob:`-URL **via worker-f** | Kildekode i 9.3.20: `modules/export/readXlsxFileBrowser.js` → `parseSpreadsheetContents.js`, der worker-f-parameteren er merket «Not used». `unzipFromUint8Array.js` bruker `unzip` fra fflate 0.8.3, og den lager `new Worker(URL.createObjectURL(new Blob(...)))` når en oppføring er minst 320 000 byte. Prøven i nettleseren: med en liten fil ble ingen worker laget. Med 1,14 MB ble det laget workere fra `blob:http://localhost:4789/…`. | **Konklusjonen er bekreftet, men mekanismen er feil.** Det er fflate som lager blob-workerne, ikke worker-f. Workere lages bare for store filer. | Rett begrunnelsen i AD-8 og memlog-linje 74: «read-excel-file pakker ut med fflate, som lager Web Worker fra `blob:`-URL for store filoppføringer». |
| 17 | `worker-src 'self' blob:` er nødvendig | Prøve med 1,14 MB-filen: med `blob:` var resultatet `ok`, med 40 002 rader og 0 CSP-brudd. Uten `blob:` kom bruddet «Creating a worker from 'blob:…' violates … worker-src 'self'», og `readXlsxFile`-løftet **ble verken oppfylt eller avvist** (fortsatt «klar» etter 15 s). | **Bekreftet** | Behold `blob:`. Viktig for NFR-9: dersom workeren blokkeres, henger innlesingen uten feilmelding. Vurder en tidsgrense i `inn/` eller `flyt/`, og en e2e-test med en stor fil (1000-radersfilen kan være under grensen på 320 kB). |
| 18 | Den foreslåtte CSP-en bryter ikke et produksjonsbygg av Vite + React | Prøvebygg med Vite 8.3.8: `dist/index.html` har bare `<script type="module" crossorigin src="/assets/…js">` og `<link rel="stylesheet" href="/assets/…css">`, uten innebygde skript eller stiler. Modulepreload-polyfillen ligger i JS-pakken, ikke i HTML. React-`style={{…}}` gikk gjennom (CSSOM). Prøven gav **null** CSP-brudd i Chrome. | **Bekreftet** (Chrome; Firefox og Edge er ikke prøvd) | To fallgruver å nevne: (a) Vite legger filer under 4 KiB inn som `data:` (`build.assetsInlineLimit`). Det gjelder bilder (`img-src data:` er tillatt), men en innebygd **font** blir blokkert av `default-src 'self'`. Sett `assetsInlineLimit: 0` eller legg til `font-src 'self'`. (b) Innebygde `<style>`-elementer, for eksempel fra React 19-stilhoisting eller kode som legger inn `<style>`, blir blokkert av `style-src 'self'`. `npm run dev` har ikke CSP (React refresh-preamble er inline), og det er i tråd med spinen. |
| 19 | `vite preview` støtter `preview.headers` | https://vite.dev/config/preview-options («Specify server response headers», type `OutgoingHttpHeaders`). `vite/dist/node/index.d.ts`: `PreviewOptions extends CommonServerOptions { headers?: OutgoingHttpHeaders }`. CSP-headeren ble returnert i prøven (`curl -I`). | **Bekreftet** | Ingen. |
| 20 | Vercel kan sette CSP via `vercel.json` | https://vercel.com/docs/project-configuration/vercel-json: egenskapen `headers` med `source` og `headers: [{ key, value }]` gjelder statiske filer. | **Bekreftet** | Bruk `"source": "/(.*)"`. Med hash-ruting trengs ingen `rewrites`. |
| 21 | Playwright har kanalen `msedge` | https://playwright.dev/docs/browsers (`channel: 'msedge'`, også `msedge-beta/dev/canary`; Edge må finnes på maskinen, eller installeres med `npx playwright install msedge`). Strengen `"msedge"` finnes også i playwright-core 1.65.1. | **Bekreftet** | Ingen. «Edge der den er installert» stemmer. |
| 22 | Versjonene er «kontrollert mot npm-registeret og create-vite-malen 2026-11-21» | Se #4 og #6 | **Delvis feil.** For to av pakkene er tallene malens minimumsversjoner, ikke registerets nyeste. | Skill mellom «malens minimum» og «nyeste i registeret», eller oppdater tallene. |
| 23 | Memlog-linje 16/20: «create-vite 9.3.4», «exceljs 4.4.0» | `npm view` → create-vite 9.3.4 (2026-11-05), exceljs 4.4.0 | **Bekreftet** | Ingen. |

## Andre merknader (ikke feil)

- read-excel-file 9.3.20 avhenger av `fflate ^0.8.3`, `saxen`, `unzipper-esm` og `worker-f ^0.1.12` (0.1.25 ble installert). `package-lock.json` låser disse, slik spinen sier. Biblioteket kom ut 2026-11-19 (9.3.18–9.3.20 samme uke), så det oppdateres ofte. Lås versjonen eksakt, som spinen allerede sier.
- `/web-worker`-inngangen i read-excel-file er merket som utdatert (CHANGELOG 9.3.14). Bruk `/browser`.
- CSP-prøven i Chrome beviser ikke at Firefox oppfører seg likt. e2e-testen «null CSP-brudd» i Firefox som AD-8 krever, dekker dette. Ta med en stor fil i den testen, ellers blir workeren aldri laget (se #16 og #17).

## Kilder

- npm-registeret (`npm view`), kjørt 2026-11-21
- https://raw.githubusercontent.com/nodejs/Release/main/schedule.json
- https://nodejs.org/dist/index.json
- https://cdn.sheetjs.com/ og https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz (0.20.3)
- https://cdn.sheetjs.com/advisories/, https://cdn.sheetjs.com/advisories/CVE-2023-30533.html, https://cdn.sheetjs.com/advisories/CVE-2024-22363.html
- https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2023-30533 og ?cveId=CVE-2024-22363
- https://vercel.com/docs/project-configuration/vercel-json
- https://playwright.dev/docs/browsers
- https://vite.dev/config/preview-options
- Kildekode i npm-pakkene create-vite 9.3.4, read-excel-file 9.3.20, worker-f 0.1.25, fflate 0.8.3, vite 8.3.8 og playwright-core 1.65.1 (lastet ned i scratchpad)
