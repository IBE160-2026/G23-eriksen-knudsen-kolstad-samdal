---
title: Reconcile review — ARCHITECTURE-SPINE (COSI - MRP)
reviewed: ARCHITECTURE-SPINE.md (draft, 2026-11-20)
date: 2026-11-20
inputs:
  - prds/prd-COSI - MRP-2026-10-19/prd.md (FR-1–FR-34, NFR-1–NFR-11)
  - prds/prd-COSI - MRP-2026-10-19/addendum.md («Innspill til arkitekturen»)
  - ux-designs/ux-COSI - MRP-2026-11-13/EXPERIENCE.md
  - ux-designs/ux-prototype-2026-11-17-v3/avvik-mot-prd.md (+ index.html for the port risk)
  - .logs/sebastian/974-2026-11-19-21-47-06-ux-valg-oda-v3.md (group decision on Oda v3)
---

# Reconcile review

**Verdict:** Sound paradigm and mostly enforceable ADs, but not ready to bind. One AD contradicts the PRD and EXPERIENCE (result order), one contradicts NFR-9 (one message for all file errors), and several quiet constraints (storage write ordering, Excel row numbers, list ordering for Sammenligning, the URL/history model, build variants) are left for two units to settle differently.

Severity: critical = contradicts a binding requirement; high = likely divergence or test failure; medium = gap two builders can fill differently; low = wording/hygiene.

## Findings

### F1 — AD-13 result order contradicts PRD/EXPERIENCE and the group's decision (critical)

- **Spine:** AD-13 fixes «Bestillingsforslag → Kritiske deler → Endringer (when present) → Resultattabell».
- **Sources:** EXPERIENCE.md › Information Architecture: «Rekkefølgen på resultatsiden er låst: Bestillingsforslag → Endringer → Kritiske deler → Resultattabell → Produksjonskapasitet». The prototype's PRD option (`rekkefolge:"prd"`, index.html l. 733) is `forslag, endringer, kritiske`. The 2026-11-19 log says only «Bestillingsforslag først (U14, PRD §4.4)», which the prototype implements as forslag → endringer → kritiske. EXPERIENCE State Patterns «Sammenligning finnes»: «Endringer står mellom Bestillingsforslag og Kritiske deler»; UJ-3 step 3 says the same.
- **Effect:** the nav row, Statuslinje links, tab order and the user test's «nullstill» procedure are all built against the EXPERIENCE order. A builder following the spine produces a different page.
- **Fix:** change AD-13 to «Bestillingsforslag → Endringer (when present) → Kritiske deler → Resultattabell → Produksjonskapasitet (when chosen)», i.e. the prototype's `rekkefolge:"prd"` order.

### F2 — AD-4 collapses whole-file errors into one message, which contradicts NFR-9 (critical)

- **Spine:** AD-4: the shell's try/catch «turns any thrown error into a single Norwegian message … Reading a corrupt, empty or non-xlsx file is handled the same way.»
- **Sources:** NFR-9 testable: V-F07, V-F08 and V-F09 «gir hver sin melding». FR-1: a non-.xlsx file gets its own message. EXPERIENCE › Feil i hele fila lists six distinct cases (ikke .xlsx, skadet, tom 0 byte, ikke Excel selv om .xlsx, passordbeskyttet, uventet), and they are shown in the slippsone, not in the feiloppsummering.
- **Effect:** read failures that come out as thrown SheetJS errors can't be told apart. Tests for V-F07–V-F09 can't assert different messages, and the «uventet feil» text («Noe gikk galt under beregningen») would show for a 0-byte file.
- **Fix:** make file-level failures values too. `les` returns `{ ok: false, filfeil: { kode: 'IKKE_XLSX' | 'TOM' | 'SKADET' | 'IKKE_EXCEL' | 'PASSORD' } }`, with the type in `typer.ts` and the text in `tekster/nb.ts`. It classifies before and around the SheetJS call: check byte length and the zip signature before parsing, and recognise the encryption/CFB container as PASSORD. Only truly unexpected exceptions reach the outer catch as `UVENTET`. Add the mapping to the Capability map under NFR-9, and test V-F07–V-F09 on `kode`.

### F3 — Storage write ordering and «storage untouched» are not pinned (high)

- **Spine:** AD-7 says when to write. AD-4 says a thrown error «leaves storage untouched». The seed has `kjor.ts: les → valider → beregn/kapasitet → snapshot`. Nothing says the previous snapshot is **read before** the new one is written, or that the write is the **last** step.
- **Sources:** FR-19/FR-20 (compare with the previous run, then replace it). NFR-9 and addendum «Feil under lesing og beregning»: «den lagrede kjøringen skal stå urørt». FR-4.
- **Effect:** if the write comes before `sammenlign`, or before something else that can throw (for example building `Statuslinje` data or the view-model), a crash leaves storage changed with no result shown, or the comparison is made against itself and always says «ingen endringer». Two builders of `kjor.ts` and `snapshot-lager.ts` can order this differently.
- **Fix:** add to AD-7 or AD-4 the order: «read forrige → beregn → lag ny Snapshot → sammenlign(forrige, ny) → build everything the view needs → write ny (last, inside its own try) → render». Also state that a read failure (blocked or corrupt JSON) means «no previous run», and whether a *write-only* failure (storage full but readable) still shows Endringer. EXPERIENCE says «Lagring blokkert: Endringer vises aldri», so decide the full-but-readable case explicitly.

### F4 — URL/history model is ambiguous, and the v3 port pulls the other way (high)

- **Spine:** AD-14: «There is no router library. A reload always returns to the start page.»
- **Sources:** EXPERIENCE › «Adresse og historikk»: start and result pages have the same URL. Showing the result page pushes **one** history entry, so Back goes to the start page, Forward shows the result again until a reload, and anchors don't change the URL. Oda's v3 (which AD-13 says to port) uses hash routes `#/intro`, `#/start`, `#/resultat`, `#/lagret` with `hashchange` (index.html l. 616–620, 680, 1221). It also has a separate «Lagrede kjøringer» view.
- **Effect:** «no router library» doesn't forbid hand-rolled hash routing, and a straight port keeps it. That breaks «same URL» and lets `#/resultat` survive a reload into an empty state. A builder who follows only AD-14 may instead ignore Back, so Back leaves the app. The list of views is open, so `lagret` and `intro` may or may not exist.
- **Fix:** AD-14 Rule: «The URL never encodes the view (no hash or path routes). Showing the result page calls `history.pushState` once, and `popstate` moves the store to the start page (Back) or back to the in-memory result (Forward). The views are exactly: start, resultat (+ the views decided under U6).» List the prototype's hash router under what AD-13 does not port.

### F5 — Deferred U6 (intro page) needs a storage key that AD-7 forbids (medium)

- **Spine:** Deferred: «Intro page vs. FR-27 start page (U6) … AD-13 and AD-14 hold whichever is chosen.» AD-7: «Nothing else is stored.»
- **Sources:** Oda's v3 shows the intro «første gang» via `localStorage` `sett-intro`, and persists prototype options under `valg` (index.html l. 590, 619–620). It also stores **all** runs in one `lagret` object, not one key per product (l. 676, 1181).
- **Effect:** if the group picks the intro page, a builder adds a flag key outside AD-7, with no namespace or failure rule. A straight port of `lagret` breaks AD-7's per-product key and NFR-10's «etter sletting finnes ingen data om det ferdigproduktet».
- **Fix:** in AD-7, allow exactly one more key (for example `cosi-mrp:intro-sett`, boolean, same wrapped access, its absence means «show intro») only if U6 picks the intro page. State that deletion removes the product's key with `removeItem`. Say explicitly that the prototype's `lagret`/`valg` storage is not ported. If the Lagrede kjøringer view stays, add a `list()` to `snapshot-lager.ts` that enumerates the `cosi-mrp:kjoring:` prefix.

### F6 — Excel row numbers and the read-stop rule are not owned (medium)

- **Spine:** AD-10: «`RåArk` (sheets as rows of raw cell values, columns located by header text)». The convention says validation errors carry `rad?`.
- **Sources:** EXPERIENCE › Feiloppsummering: «Rad er alltid Excel-radnummeret, ikke dataradens nummer»; MPS errors are located by uke (column). SM-4 tests on «riktig ark, rad». Addendum › Excel inn og ut: the template is formatted down to row 1001, and «stykklisten slutter ved første rad der både Nivå og Varenummer er tomme». FR-3: rows «fra rad 2 og sammenhengende … inntil 1000 rader».
- **Effect:** `les` (shell) and `valider` (core) are separate units. One can strip the header and index rows from 0 while the other reports `index + 2`. One can read all 1000 formatted rows while the other expects a trimmed list, which leads to spurious «hull» errors or silently dropped rows. SM-4 tests then fail by ±1 or ±2.
- **Fix:** in AD-2/AD-10, each `RåArk` row carries `excelRad: number` (1-based, as in Excel), and the header row number is kept. `les` stops Stykkliste at the first row where both Nivå and Varenummer are empty. Whether rows after that gap are an error (FR-3 «sammenhengende») is `valider`'s call, and `les` passes up to N trailing non-empty rows so it can make it. Do the same for MPS columns → `uke`.

### F7 — Comparison line order and labels are not owned (medium)

- **Spine:** AD-8: UI and export render the same `Sammenligning`. The Ordering convention covers parts and bestillingsforslag only.
- **Sources:** FR-20/FR-23: the export sheet must be «bygd opp som arket Sammenligning i fasit 03», and the test compares against «nøyaktig linjene». EXPERIENCE › Endringsliste: groups in the fixed order Bestillingsforslag, Eksepsjoner, Deler; lines in fasit-03 order; a moved forslag is two lines, Fjernet directly followed by Nytt; labels Nytt / Endret mengde / Fjernet / Ny / Borte.
- **Effect:** if `sammenlign` returns an unordered set, the UI and `eksport.ts` each sort, possibly differently. The labels may be hard-coded in two places.
- **Fix:** add to Conventions → Ordering: `sammenlign` returns groups and lines already in fasit-03 order (state the sort key), and change kinds are codes (`NY`, `ENDRET_MENGDE`, `FJERNET`, `BORTE`) whose text lives in `tekster/nb.ts` and is used by both UI and export. Add a fasit test on the exported sheet.

### F8 — Exception parameters are underspecified for the message content FR-9–FR-12/FR-29 require (medium)

- **Spine:** AD-6: «a `kode` plus typed parameters (varenummer, uke, ark, rad, felt, quantities, path)».
- **Sources:** FR-10 needs disponibel (after fremskynding), forfalt mengde, the week the release should have been made, total frigivelse in week 1, tidligste mottaksuke (1 + L), and the consequence target: «Leveranse til kunde» for level 0/.1 or a shared part that also sits directly under the finished product, otherwise a list of every parent part. FR-12 needs disponibel **before** fremskynding, mottak uke/antall, the target week, and kjøpes inn vs produseres. EXPERIENCE varies the text by ordretype (Innkjøp vs Produksjonsordre). FR-9 needs the sum and the path. FR-13 testable: «Hver melding inneholder opplysningene FR-9–FR-12 og FR-29 krever».
- **Effect:** «quantities» lets the core author and the `nb.ts` author disagree on what is computed where. For example, `nb.ts` might derive «Leveranse til kunde» from level, or take disponibel from `Utregning` and pick the wrong side of fremskynding. That is MRP logic leaking into text, which AD-5 forbids.
- **Fix:** in AD-6, `Eksepsjon` is a discriminated union per `kode` in `typer.ts`, with the required fields listed per FR (including `konsekvens: { type: 'kunde' } | { type: 'produksjon', overordnede: {varenummer, beskrivelse}[] }` and `ordretype`). `nb.ts` only formats. Add a unit test that every field is non-null for fasit 01/02/04 exceptions.

### F9 — UI system: the v3 port contradicts EXPERIENCE's Foundation without saying so (medium)

- **Spine:** AD-13 ports Oda's HTML/CSS to Svelte. The stack has no component library.
- **Sources:** EXPERIENCE › Foundation: «shadcn/ui + Tailwind, med Radix for tastatur og ARIA» for everything except Resultattabell and forklaringspanel. Behaviour depends on Radix: the radio group's arrow keys, the AlertDialog focus trap with focus starting on Avbryt and returning to the trigger, and the Select for the ukefilter.
- **Effect:** each builder hand-rolls these, or pulls in a different Svelte headless library (bits-ui, melt-ui), so keyboard and ARIA behaviour diverge across components. The NVDA/keyboard acceptance in EXPERIENCE › Accessibility Floor is then tested against inconsistent primitives.
- **Fix:** add a line to AD-13 (or a new AD): «EXPERIENCE's shadcn/Radix choice is superseded by the v3 port. Interactive primitives (radio group, dialog, select, switch) use native elements (`<dialog>`, `<select>`, `fieldset`/radio) with the keyboard behaviour in EXPERIENCE; no headless component library.» Or pin one library. Either way, one rule.

### F10 — Operational envelope: build variants and the frozen test URL are missing (medium)

- **Spine:** AD-12 covers static Vercel. The deployment diagram shows `git push main → vite build`. CI is deferred.
- **Sources:** EXPERIENCE › Brukertest › Før testuka: «én fast deploy-URL for 2.–7.12, som ikke endres i testuka. Radiogruppen er skjult i testbygget.» EXPERIENCE › Radiogruppe: hidden when trinn 4 is cut and in the test build. PRD §7.1 cut decision 30.11 (trinn 4/5 may be cut). EXPERIENCE › Før bygging: Vercel Analytics/Speed Insights not switched on (AD-12 covers this).
- **Effect:** nothing says how «trinn 4 cut» or «testbygg» is expressed. One builder adds a runtime flag in `localStorage`, another a build env var, a third deletes code. Vercel preview URLs change on every push, so «fast URL» needs a decision (a branch alias or a separate project).
- **Fix:** add to AD-12 (or Conventions): environments are `dev` (local), `preview` (Vercel per branch/PR) and `production` (main). One build-time flag, for example `import.meta.env.VITE_KAPASITET` (default on), hides the radio group and the capacity code paths. The test week uses a fixed Vercel alias, for example a `brukertest` branch, frozen 2.–7.12. Also list the README commands (`npm install`, `npm run dev`, `npm test`, `npm run build`) for NFR-3/SM-6.

### F11 — NFR-5 measurement has no owner and ignores «Begge» (medium)

- **Spine:** Deferred: Web Worker «if the 1000-row measurement misses the 3 s NFR-5 target». There is no rule for how or where it is measured.
- **Sources:** Addendum › Ytelse: measure early with a 1000-row file made by `lag_testdata.py` (which doesn't make one yet); if the target is missed, the requirement is changed with a reason. Addendum › Produksjonskapasitet: 2 × H binary searches, measure «sammen med NFR-5 når begge beregningene er valgt». EXPERIENCE: the clock runs from Beregn to visible Resultattabell, before the table structure is locked.
- **Effect:** each person measures differently (core only, or with or without rendering, or plan only). The capacity search on the main thread is the likeliest thing to blow 3 s and can also look like a «hang» (NFR-9).
- **Fix:** add a short convention: the perf file is `testdata/ytelse-1000.xlsx`, generated by `lag_testdata.py` (generation is allowed, and AD-11 only forbids porting). The measurement runs from the Beregn click to the first paint of Resultattabell (`performance.mark`), with «Begge» chosen, in Chrome on a normal laptop, and is recorded in a test note. A core-only Vitest benchmark guards against regressions. Keep the Worker deferred, but name the threshold: if it misses, the Worker comes before the virtualisation steps.

### F12 — Smaller items (low)

- **AD-9 and lot size:** say whether `kapasitet` applies FR-25 lot size when trinn 5 exists. Otherwise two implementations of the option guess.
- **AD-3:** «Week numbers in data are 1..H» applies to `Input`/`Resultat`, not `RåArk`. Validation must still see out-of-range weeks (UJ-4 «uke 0», «uke 11»). One clause avoids `les` clamping them.
- **AD-7 sizing:** the addendum asks the architecture to «sjekke grensen … velger og begrunner». Add a one-line estimate, for example ≤ 1000 parts × (varenummer + beskrivelse) + forslag ≈ < 150 kB per product, so about 30 products under 5 MB, and what happens at quota (the existing «ikke lagret» path).
- **Accessibility, structural:** EXPERIENCE requires one `role="status"` region at app level, *outside* the content swapped between start and result. AD-14's view store should say the live region lives in the root component and is never re-mounted. Otherwise announcements are lost on swap.
- **Deferred U11:** EXPERIENCE (final) already says «Bestillingsplan er forhåndsvalgt», and v3's default `valgStd:"plan"` agrees, so this is not open. Remove it from Deferred or mark it decided.
- **Theme toggle:** v3 has light/dark. DESIGN says light only in v1 (EXPERIENCE › Senere: mørk modus). AD-13 should list the theme toggle with the Prototypevalg panel as not ported.

## Rubric walk

| Check | Result |
| --- | --- |
| Every AD Rule enforceable | Mostly. AD-1, AD-2, AD-10, AD-11 and AD-12 can be checked by import lint or review. AD-13's order is enforceable but wrong (F1). AD-14 is too loose to enforce (F4). AD-6's «quantities» is not checkable (F8). |
| Rule prevents its stated divergence | AD-4 fails for file errors (F2). AD-7 leaves the ordering divergence open (F3). AD-8 leaves line order open (F7). AD-14 doesn't prevent URL routes by hand (F4). |
| Deferred lets units diverge | U6 does (storage key, F5). U11 is already decided (F12). CI deferral is fine, since `npm test` is the contract. Worker deferral is fine once the measurement is pinned (F11). |
| Operational envelope | Prod deploy is covered. Environments, build flags, the frozen test URL and README commands are missing (F10). |
| Tone/voice | AD-6 centralises text. Fine, provided F8 makes the parameters complete. |
| Accessibility | Conventions cover colour + symbol and click/Enter. The live-region placement is a small gap (F12). |
| Storage semantics | Per-product key, compact snapshot and fail-safe are good. Gaps: write order (F3), delete via `removeItem` and the prototype's storage not ported (F5). |
| Ordering | Parts and forslag are covered. Sammenligning (F7) and the result-page section order (F1) are not right yet. |
| NFR coverage | NFR-1–4, 6, 7, 10 and 11 are covered. NFR-5 is partial (F11), NFR-8 partial (sticky columns live in EXPERIENCE, fine), NFR-9 is contradicted (F2). |
