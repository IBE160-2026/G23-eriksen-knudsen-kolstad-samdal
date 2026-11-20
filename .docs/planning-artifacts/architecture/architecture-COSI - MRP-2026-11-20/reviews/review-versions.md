---
title: Review – Stack and versions (ARCHITECTURE-SPINE.md)
date: 2026-11-20
scope: Stack table (lines 162–172), AD-rules on SheetJS (line 121), Vercel (line 133), open item line 227
method: npm registry (`npm view`), cdn.sheetjs.com (curl), svelte-check README 4.7.8, web search, inspection of testdata/*.xlsx
---

# Review: Stack and versions

## Verdict

**Revise before scaffold (one blocking pin).** Every named package exists and its pinned version is the current `latest` on npm as of 2026-11-20, so the versions were not invented from training data. One pin does not fit, though: **TypeScript 7.0.2 is outside svelte-check 4.7.8's peer range**. Two other rows need tightening: the Node floor, and how the SheetJS install is written. Vercel and SheetJS behaviour fit the architecture.

## Registry check (2026-11-20)

| Package | Spine | npm `latest` | Peers / engines | Status |
|---|---|---|---|---|
| typescript | 7.0.2 | 7.0.2 (published 2026-07-08); 6.0.3 is the newest 6.x, 5.9.3 the newest 5.x | – | Exists, current. **Does not fit svelte-check** (see F1) |
| vite | 8.3.8 | 8.3.8 | engines `node ^20.19.0 \|\| >=22.12.0` | OK |
| svelte | 5.59.1 | 5.59.1 | – | OK |
| @sveltejs/vite-plugin-svelte | 7.3.1 | 7.3.1 | peers `vite ^8.0.0`, `svelte ^5.46.4`; engines `node ^20.19 \|\| ^22.12 \|\| >=24` | OK |
| svelte-check | 4.7.8 | 4.7.8 (2026-11-01) | peers **`typescript ^5.0.0 \|\| ^6.0.0`**, `svelte ^4 \|\| ^5` | OK itself; rejects TS 7 |
| svelte2tsx (dep. of svelte-check) | – | 0.7.63 | peers **`typescript ^4.9.4 \|\| ^5 \|\| ^6`** | Confirms the TS 7 gap |
| vitest | 5.1.1 | 5.1.1 | peers **`vite ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`**, `@types/node ^22 \|\| >=24`; engines **`node ^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`** | OK with Vite 8.3.8 |
| xlsx (npm) | – | 0.18.5 (stale) | – | Correctly avoided by the spine |
| xlsx (cdn.sheetjs.com) | 0.20.3 | 0.20.3 (last line of `https://cdn.sheetjs.com/xlsx.lst`) | – | OK. Tarball URL answers HTTP 200; its `package.json` says `"version": "0.20.3"` |

## Findings

### F1 – TypeScript 7.0.2 does not work with svelte-check 4.7.8 out of the box (blocking)

- svelte-check 4.7.8 declares `peerDependencies.typescript: ^5.0.0 || ^6.0.0`, and svelte2tsx does the same. npm will raise an ERESOLVE peer conflict, or the peer will be unmet, if `typescript@7.0.2` is the only TypeScript installed.
- The cause is a real API gap, not just packaging. The `typescript@7.0.2` package exports only `./lib/version.cjs` plus `./unstable/*` (sync/async API, AST). It has no classic `ts.createProgram` / LanguageService JS API, and svelte2tsx and svelte-check depend on that API.
- The svelte-check 4.7.8 README says: "TypeScript 7 support currently requires the `--tsgo` or `--tsgo-experimental-api` flag. You need to install both TypeScript 7 and TypeScript 6", via `npm install --save-dev typescript@~6 @typescript/native@npm:typescript@7`. The same README's flag table instead says `--tsgo` "needs `@typescript/native-preview`" and is "subject to the same limitations as `--incremental`" (Svelte files outside the tsconfig root dir are not type-checked). The docs contradict themselves, which shows the TS 7 path is still experimental.
- Vite 8, vite-plugin-svelte and Vitest only strip types, so none of them depend on the `typescript` package version. svelte-check is the only blocker.
- The spine's fallback "5.9.x" is outdated: 6.0.3 satisfies every peer and is closer to TS 7 semantics.

**Corrected pin:** `typescript` **6.0.3** (exact). Do not use TS 7 in v1. Optional later: add `@typescript/native@npm:typescript@7.0.2` next to it and try `svelte-check --tsgo`, but only as an experiment outside the CI gate. Update the open item on line 227 ("TypeScript 7 toolchain fit"): it is now resolved, with the answer no.

### F2 – Node floor is too loose (minor, but causes real breakage)

"22 LTS or newer" includes 22.0–22.11. Vite 8 needs ≥ 22.12, and Vitest 5.1.1 needs `^22.12.0 || ^24.0.0 || >=26.0.0`, which excludes Node 23 and 25. **Corrected pin:** Node.js **≥ 22.12, recommended 24 LTS**. Put this in `package.json` as `"engines": { "node": "^22.12.0 || ^24.0.0 || >=26.0.0" }` and in the Vercel project's Node version setting (24.x). If a `.nvmrc` is used, set it to `24`.

### F3 – SheetJS row: write the install form, not just the version (minor)

- 0.20.3 is still the latest CE release on cdn.sheetjs.com (`xlsx.lst` ends at 0.20.3). The URLs for 0.20.4, 0.20.5, 0.21.0, 0.21.1 and 0.22.0 return 404.
- Write it out explicitly: `npm i --save https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`. This puts `"xlsx": "https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz"` in `package.json`, and the lockfile records it. Never use `npm i xlsx`, which installs the stale 0.18.5 with known advisories (prototype pollution, ReDoS) that later CE releases fixed.
- Optional for robustness: vendor the tarball into the repo (e.g. `vendor/xlsx-0.20.3.tgz`, referenced as `file:vendor/xlsx-0.20.3.tgz`). Then `npm ci` on Vercel and on group laptops does not depend on cdn.sheetjs.com being up.

### F4 – SheetJS behaviour fits AD on reading and export (confirmation)

- **No formula evaluation:** SheetJS CE has no calculation engine (that is SheetJS Pro only). `XLSX.read` returns the cached value `<v>` as the cell's `v`, and the formula as `f` (with `cellFormula`). This matches the rule "reads stored cell values only".
- **Export:** `XLSX.utils.book_new` / `aoa_to_sheet` / `json_to_sheet` + `XLSX.writeFile(wb, "x.xlsx")` writes xlsx in the browser (download). CE writes values and basic number formats. Cell styling (fills, bold) is not supported in CE, so check that the export requirements expect no colours.
- **Checked in testdata:** `COSI-MRP-mal.xlsx` and `testeksempel-01.xlsx` have 5,000 formula cells, all without cached `<v>` (openpyxl writes none). They sit only on the Stykkliste sheet in columns J (Kontroll) and AA–AD (helper columns), which the spine already says must be ignored. The input columns are literal values, and the fasit files contain no formulas. The design holds, but the "never read Kontroll or helper columns" rule is load-bearing: the reader would see empty cells there in files generated by openpyxl. Pin it with a test.
- Residual risk: if a user types their own formula into an input cell and saves with a tool that does not cache values, the reader gets an empty cell. Excel and LibreOffice cache values on save, so this rarely happens. Validation then reports a missing value, which is acceptable.

### F5 – Vercel static hosting still fits; no default telemetry in production (confirmation + one caveat)

- Vercel serves a Vite `dist/` without functions as long as there is no `api/` folder and no server framework. Framework preset "Vite", output `dist`.
- Web Analytics and Speed Insights are **opt-in**. They need to be enabled in the dashboard **and** need `@vercel/analytics` / `@vercel/speed-insights` (or their script) in the code. Neither happens unless the group adds it, so NFR-4 holds.
- **Caveat:** the **Vercel Toolbar** is enabled by default on *preview* deployments (branch/PR URLs) and loads a script from `vercel.live` (comments, feedback). It is not on production. To make the "no third-party scripts" rule (line 133) hold for preview URLs too, turn the toolbar off under Project Settings → General → Vercel Toolbar (Preview: Off), or set the env var `VERCEL_PREVIEW_FEEDBACK_ENABLED=0`. Add this as a line in the rule or in the scaffold checklist.
- Vercel's own access logs (IP, URL) are a hosting matter and contain no plan data, because the file never leaves the browser.

## Proposed corrections to the Stack table

| Name | Version |
|---|---|
| TypeScript | **6.0.3** (TS 7 not until svelte-check supports it without flags; svelte-check 4.7.8 peer is `^5 \|\| ^6`) |
| Vite | 8.3.8 |
| Svelte | 5.59.1 |
| @sveltejs/vite-plugin-svelte | 7.3.1 |
| svelte-check | 4.7.8 |
| Vitest | 5.1.1 (peer `vite ^6.4 \|\| ^7 \|\| ^8`, OK) |
| SheetJS CE | 0.20.3, `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` (never `npm i xlsx`) |
| Node.js (dev + Vercel) | **^22.12.0 \|\| ^24 (recommended) \|\| >=26** |
| Hosting | Vercel, static; Vercel Toolbar off for previews |

## Sources

- npm registry, `npm view` run 2026-11-20 (typescript, vite, svelte, @sveltejs/vite-plugin-svelte, svelte-check, svelte2tsx, vitest, xlsx)
- https://cdn.sheetjs.com/xlsx.lst and https://cdn.sheetjs.com/xlsx-0.20.3/package/package.json
- [svelte-check 4.7.8 README](https://unpkg.com/svelte-check@4.7.8/README.md) – "TypeScript 7 supports"
- [Announcing TypeScript 7.0 Beta](https://devblogs.microsoft.com/TypeScript/announcing-TypeScript-7-0-beta/), [Progress on TypeScript 7 – Dec 2025](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025)
- [svelte-check-rs README](https://cdn.jsdelivr.net/npm/svelte-check-rs@0.11.2/README.md) – "keep TypeScript 6 installed for tooling that uses its JS API"
- [SheetJS issue #3218](https://git.sheetjs.com/sheetjs/sheetjs/issues/3218) – CE does not calculate; read gives cached values
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights), [Vercel Academy – observability](https://vercel.com/academy/optimize-your-vercel-account/observability-sampling) – opt-in
- Vercel Toolbar on previews: from Vercel docs knowledge, not re-fetched in this review. Confirm in Project Settings at scaffold.
