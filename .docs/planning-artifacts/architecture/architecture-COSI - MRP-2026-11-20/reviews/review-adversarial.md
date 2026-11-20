---
type: review
lens: adversarial (compatible-by-the-letter, incompatible-in-fact)
target: ARCHITECTURE-SPINE.md (draft, 2026-11-20)
sources: [ARCHITECTURE-SPINE.md, prd.md FR-1–FR-34, NFR-1–NFR-11]
created: '2026-11-20'
---

# Adversarial review: Architecture Spine, COSI - MRP

## Verdict

**Not ready to fan out to parallel stories yet. It needs one tightening pass.**

The layering (AD-1, AD-10, AD-12), error handling (AD-4) and test independence (AD-11) are solid. The weak point is AD-2. It names twelve shared types but defines none of them, and it doesn't say who writes `typer.ts` first. Several derived facts (BOM structure, lavnivåkode, ledetid from the finished product, bestillingsforslag, kritiske deler, exception context) have no owner. A rule makes them "core" but doesn't say which core function. Every pair below can obey all 14 ADs to the letter and still fail to fit together at merge time. Most holes close with one sentence each (proposed rules R1–R14 at the end). Holes H1–H5 block parallel work. H6–H14 cause rework if left open.

---

## H1: Nobody owns the content of `typer.ts` (AD-2)

**Pair:** *Validation story* vs *Calculation story*, started the same day.

- Validation story: declares `Input.stykkliste: Del[]`, where a `Del` is one Stykkliste **row** (`nivå`, `varenummer`, `antall`, `rad`, with fields that may be empty on repeat rows).
- Calculation story: declares `Input.deler: Del[]`, where a `Del` is one **part**, de-duplicated by varenummer, with `barn: {varenummer, antall}[]`.

Both edit `src/core/typer.ts` and neither redeclares anything locally, so AD-2 holds. The first branch to merge decides what `Del` means. The second branch must rewrite. Five people plus agents working in parallel make this certain to happen, not just possible.

AD-2 also bans "extending locally", but UI stories need view models (a row with `kritisk`, `åpen`, `valgt`). One builder reads the ban as covering `type Rad = DelResultat & {…}`, and another doesn't.

**Proposed rule R1:** A foundation story merged before any other story writes every AD-2 type in full (fields, optionality, discriminated unions per `kode`). Later stories change a shared type only through a PR that touches `typer.ts` alone. UI-only view-model types may live in `src/ui/` but must not carry domain fields that the core does not produce.

## H2: The valider → beregn contract is undefined. Where are the BOM structure, lavnivåkode and paths computed?

**Pair:** *Validation story (FR-3)* vs *MRP story (FR-5, FR-28)* vs *Exception story (FR-9, FR-10)* vs *Capacity story (FR-31)*.

To check the "Underdeler" rule (FR-3), valider must already group occurrences and compare child sets. Each of the following needs a resolved structure:

- FR-28: merged children, lavnivåkode, parameters from the first row.
- FR-9: longest ledetid path, plus **the path itself** for the message.
- FR-10: the list of parents, and whether a part sits directly under the finished product anywhere.
- FR-31: antall per ferdigprodukt summed over all paths.
- FR-16 and the ordering convention: order of first occurrence.
- FR-14: "nivå" shown for a shared part.

None of this is assigned to anyone. The following all follow AD-1 and AD-2 to the letter:

- valider returns raw rows in `Input` (it only checks).
- beregn builds its own tree and lavnivåkode.
- kapasitet builds a second tree with a different rule for "a subpart under only one occurrence".
- the exception story walks rows a third time to find paths.

The result is three structure builders, each with its own edge cases (subparts under a *later* occurrence, FR-3).

Also undefined:

- Which **nivå** is shown for a part that sits on both .1 and ..2? The first occurrence or the lavnivåkode?
- Is "level-by-level top-down" (FR-5) ordered by lavnivåkode or by nivå?

**Proposed rule R2:** `core/struktur.ts` is the only code that builds the part structure. It turns validated rows into `Input.struktur`:

- parts de-duplicated by varenummer, in order of first occurrence, with first-row parameters
- merged edges `{forelder, barn, antall}` and parent lists
- `lavnivåkode`, and `visningsnivå` = nivå of the first occurrence
- longest `ledetidFraFerdigprodukt` with its path
- `antallPerFerdigprodukt`

`valider` returns this inside `Input`. `beregn`, `kapasitet` and the exception code never read raw rows.

**Proposed rule R3:** Calculation order is ascending lavnivåkode, and Stykkliste order breaks ties inside a level. No unit sorts parts any other way.

## H3: Derived result lists have no owner (bestillingsforslag, kritiske deler, exception list)

**Pair:** *Bestillingsforslag UI story (FR-17)* vs *Snapshot story (FR-19)* vs *Export story (FR-22)*.

`Bestillingsforslag` is a declared type, but no AD says who produces it.

- The UI story derives it from `DelResultat.frigivelse[i] > 0`. It labels innkjøp/produksjonsordre from `type` and the forfalt flag from `forfaltMengde > 0`.
- The snapshot story derives it again inside `snapshot.ts`, but filters `>= 0` and leaves out the forfalt flag.
- The export story derives it a third time and sorts by varenummer.

The ordering convention exists, but each derivation can apply it differently, for example using Stykkliste *row* order instead of first-occurrence order. FR-20 identity (varenummer + frigivelsesuke) then compares lists that were built differently.

Kritiske deler (FR-13, FR-16, Statuslinje) have the same problem: the UI counts `new Set(eksepsjoner.map(v))`, and export counts parts with a marker. The exceptions themselves are similar: one story attaches them per `DelResultat`, another expects a flat `Resultat.eksepsjoner`.

**Proposed rule R4:** `beregn` returns `Resultat.bestillingsforslag` (one entry per frigivelse > 0, with `art`, `forfaltMengde`, already sorted per the convention), `Resultat.eksepsjoner` (one flat list, the only source) and `Resultat.kritiskeDeler` (varenummer in Stykkliste order). UI, snapshot and export never derive these from the per-week series.

## H4: State-mutation order for snapshot, comparison and storage (AD-7, AD-8, AD-14)

**Pair:** *Storage story (FR-19)* vs *Comparison story (FR-20)*.

- The storage story puts `lagre(snapshot)` in `kjor.ts` right after `beregn`, which AD-7 says is "after a successful run".
- The comparison story's UI component, after it receives the result, calls `lagring.hent(varenummer)` and then `sammenlign(forrige, ny)`.

`forrige` is now the snapshot that was just written, so every run shows "ingen endringer". Both units follow AD-7 and AD-8 to the letter.

More gaps:

- If `beregn` succeeds and `kapasitet` then throws in a "both" run, the snapshot is already written. That breaks AD-4's "leaves storage untouched".
- AD-14 says one store holds the result, but not who writes it (kjor.ts or the upload component).
- AD-14 doesn't say whether a *failed* upload clears the previous in-memory result or leaves it on screen. NFR-9 forbids a partial result. It doesn't decide whether a stale old result may stay visible.

**Proposed rule R5:** Only `shell/kjor.ts` runs a run, in this fixed order: `les → valider → beregn/kapasitet → hent forrige → lag ny Snapshot → sammenlign → lagre ny`. Storage is written last, only after every chosen calculation has succeeded. It returns one `Kjøring` value `{valg, resultat?, kapasitet?, sammenligning?, lagringsstatus}`, which the UI puts into the store unchanged. A failed run replaces the stored in-memory result with the error state. Only `slett` (FR-21) may call `snapshot-lager` from outside kjor.ts.

## H5: les vs valider. Who decides "missing header", and what does RåArk look like? (AD-10, AD-4)

**Pair:** *Excel-reading story (FR-1, NFR-11)* vs *Validation story (FR-2)*.

AD-10 says that **les** "locates columns by header text". The reading story therefore throws (or returns `null`) when "Ledetid (uker)" is not found. AD-4 turns a throw into one whole-file message, so V-F06 gives 1 error instead of 2.

Other open points:

- Rows can be keyed by header or by position.
- `rad` can be the Excel row number or an array index. AD-11 compares on `rad`, so off-by-one shows up as test failures in someone else's story.
- AD-3 says varenummer is trimmed "from the moment it is read" without saying whether that happens in les or valider.
- Nivå `.1` saved by Excel as the number `0.1` (NFR-11) has no owner for normalization. The validation story might reject 0.1 as "not .1", while les converts it.

**Proposed rule R6:** `RåArk` is per sheet `{finnes, overskrifter, rader: {excelRad, celler: Record<overskrift, råverdi>}[]}`, where `excelRad` is the 1-based Excel row number. les never judges missing sheets or headers and never normalizes values. `valider` alone reports missing parts (FR-2), trims varenummer and normalizes nivå (`0`/`0.1`/`".1"` → `1`).

## H6: Exception messages need facts the core doesn't promise (AD-6)

**Pair:** *Exception core story* vs *tekster/nb.ts story*.

To phrase "Leveranse til kunde blir forsinket" vs "Produksjonen av \<navn varenummer\> blir forsinket" (FR-10), nb.ts needs:

- the parents' names
- whether any occurrence is on .1
- the path for FR-9
- innkjøp/egen produksjon for FR-12
- total frigivelse in week 1 and the earliest receipt week (1+L)

AD-6 lists generic parameters (varenummer, uke, quantities, path), and AD-2 lets nb.ts import core *types* only. One builder puts the parent lookup and the "kunde vs. parent" decision in nb.ts, which then needs `Input`. That is domain logic in the text module, and it is untestable against fasit by code. The other builder emits only `{kode, varenummer, uke}`.

**Proposed rule R7:** `Eksepsjon` is a discriminated union per `kode`, and each variant carries every fact its message needs, already resolved in the core (names, `konsekvens: {kunde} | {foreldre: {varenummer, beskrivelse}[]}`, path, `skaffes: 'leverandør' | 'egen produksjon'`, disponibel before/after, forfalt quantities, total frigivelse, earliest week). nb.ts does no lookups and makes no decisions beyond wording.

## H7: Forfalt mengde as one week-1 field vs per-week facts (AD-3, AD-5)

**Pair:** *MRP story (FR-8)* vs *Exception story (FR-10, FR-11)* vs *Explanation panel (FR-18)*.

AD-3: "Forfalt mengde is a separate field on the week-1 release." FR-10 and FR-11 fire per **week t** with t−L<1. With L=3, weeks 1–3 can each be forfalt, and each message must state *its own* forfalt quantity and the week the release should have happened (t−L, possibly ≤ 0). The MRP story stores only the week-1 total (per AD-3). The exception story then cannot rebuild per-week amounts without redoing the arithmetic, which is exactly what AD-5 is meant to prevent.

**Proposed rule R8:** Each `Utregning` for week t carries `forfalt: {mengde, skulleFrigisUke} | null`, and the week-1 release carries `forfaltMengde` = the sum. Both come from the netting step, and nobody recomputes them.

## H8: The netting step's interface doesn't cover FR-29 or kapasitet's infeasibility (AD-9)

**Pair:** *MRP story* vs *Kanseller mottak story (FR-29)* vs *Capacity story (FR-31, FR-33)*.

- FR-29 needs a **counterfactual** run of the step with one receipt removed and no fremskynding. AD-9's listed options (SS 0, no fremskynding, no orders for leaves, no forfalt) are kapasitet's set. The FR-29 builder adds `utenMottak` and reuses "no fremskynding", or writes a small private re-netting loop. AD-9 forbids only the second, and in practice can't detect it.
- Kapasitet needs the step to **report infeasibility with a reason** (leaf shortfall, forfalt not allowed) so that FR-33 can name limiting parts with the cause "lager" vs "ledetid". In the MRP mode the step instead **produces** a forfalt release or an order. Two builders will give the step two different return types.
- Are exceptions detected inside the step or after it?

**Proposed rule R9:** The netting step has one typed signature, `nett(del, bruttobehov, valg) → {uker: Utregning[], mangel: {uke, årsak: 'lager' | 'ledetid'}[]}`. Options are a closed union defined in `typer.ts` (`kapasitet`, `utenMottak(uke)`, `partistørrelse`). Exceptions are a pure function applied afterwards to those weeks plus the structure, never computed inside the step.

## H9: The capacity panel would do arithmetic in the UI (AD-5 only covers beregn)

**Pair:** *Capacity core story* vs *Capacity panel UI story (FR-34)*.

FR-34 shows ledig beholdning per part. The core story returns only `{fraLager: number[], medMottak: number[], begrensende}` because that is "the capacity". The UI story then computes `Math.max(0, lager - ss)`, which AD-5 does not forbid because AD-5 is scoped to beregn. The same thing happens with "does the explanation say it includes ledetid".

**Proposed rule R10:** AD-5 applies to every core output. `Kapasitet` carries the per-part rows FR-34 shows (`ledigBeholdning`, receipts per week) and `begrensende[rad][uke]` with årsak, and UI code does no arithmetic on any domain number.

## H10: Run choice (FR-30) has no defined home and does not reach storage/export

**Pair:** *Calculation-choice UI story* vs *Export story* vs *Storage story*.

AD-7 says capacity-only runs never write. If the choice lives only in a UI component, kjor.ts can't know it. Export (FR-30: capacity not exported) may read the store and export whatever is present. A "both" run that becomes "plan only" after a filter toggle could re-export or re-store.

**Proposed rule R11:** The calculation choice is an argument to `kjor(fil, valg)` and is recorded on the `Kjøring` value. Storage and export read `Kjøring.valg`, and changing the choice means a new run.

## H11: The Snapshot is too thin for the comparison sheet and export

**Pair:** *Comparison story (FR-20, FR-23)* vs *Export story*.

The FR-23 "Sammenligning" sheet mirrors fasit 03. If its lines show description or exception-type names, `Sammenligning` must carry them. AD-7 stores parts with description, but `sammenlign` returns a value whose fields are unspecified, so export may look descriptions up in the *new* `Resultat`, which fails for removed parts.

Also unspecified:

- the line order in `Sammenligning`, which fasit 03 compares "exactly"
- that `uke: null` equals `uke: null` in exception identity
- whether a part's description change is a change

**Proposed rule R12:** `Sammenligning` is an ordered list of self-contained lines (kind, varenummer, beskrivelse, uke, old/new quantity, exception type) in the line order of fasit 03's sheet. `uke: null` is a valid identity value. Neither UI nor export enriches lines from `Resultat`.

## H12: Horizon and per-week arrays on `Input`

**Pair:** *Validation story* vs *Calculation story*.

AD-3 fixes arrays at length H, but not whether `Input` carries `H` explicitly or whether planned receipts are an array per part or a list of `{varenummer, uke, antall}`. FR-6 needs receipts as **distinct events** (each one is pulled forward whole, and each gives its own FR-12/FR-29 exception), so a per-week summed array loses the information.

**Proposed rule R13:** `Input` carries `horisont: number`, `prognostisertBehov: number[H]` and `planlagteMottak: {varenummer, uke, antall, excelRad}[]` as separate events, never summed per week before beregn.

## H13: The explanation panel's row/cell addressing

**Pair:** *Utregning core* vs *UI explanation panel*.

AD-5 lists inputs but not how a cell maps to an explanation. FR-18 wants per-*row* explanations (six row types) and per-*cell* numbers, plus exception explanations. The core story returns `Utregning[]` per part. The UI story expects `utregning[varenummer][uke][radtype]`.

**Proposed rule R14:** `DelResultat` holds `uker: Utregning[H]` (index i = week i+1), each holding all six row values and their inputs. Row-type identifiers are a fixed union in `typer.ts` that the table, explanation panel, nb.ts and export all share.

---

## Proposed rule set (one sentence each)

| # | Rule | Tightens |
| --- | --- | --- |
| R1 | A foundation story merged first writes every AD-2 type in full; later shape changes go through a `typer.ts`-only PR; UI view models may not add domain fields. | AD-2 |
| R2 | `core/struktur.ts` alone builds `Input.struktur` (de-duplicated parts in first-occurrence order, merged edges, parent lists, lavnivåkode, visningsnivå, longest ledetid path, antall per ferdigprodukt), and no other unit reads raw rows. | new |
| R3 | Calculation order is ascending lavnivåkode with Stykkliste order breaking ties. | AD-9 / Conventions |
| R4 | `beregn` returns the sorted `bestillingsforslag`, the flat `eksepsjoner` and `kritiskeDeler`, and nobody re-derives them. | AD-5 |
| R5 | Only `kjor.ts` runs a run, in the order hent forrige → sammenlign → lagre ny, after all chosen calculations succeed; it returns one `Kjøring` value that replaces the store, failed runs included. | AD-4, AD-7, AD-14 |
| R6 | `RåArk` keeps every sheet/header found plus the Excel row number; only `valider` judges missing items, trims and normalizes nivå. | AD-3, AD-10 |
| R7 | `Eksepsjon` is a union per `kode` carrying every resolved fact its message needs; nb.ts only words them. | AD-6 |
| R8 | Every week-`Utregning` carries its own forfalt `{mengde, skulleFrigisUke}`; week 1 also carries the sum. | AD-3 |
| R9 | One typed netting-step signature with a closed options union and a `mangel` output; exceptions are computed after the step. | AD-9 |
| R10 | AD-5 covers every core output, including `Kapasitet` per-part rows and limiting reasons. | AD-5 |
| R11 | The calculation choice is a `kjor` argument recorded on `Kjøring`; storage and export read it from there. | AD-7, AD-14 |
| R12 | `Sammenligning` is an ordered list of self-contained lines in fasit 03 order; `uke: null` is a valid identity value. | AD-8 |
| R13 | `Input` carries `horisont`, `prognostisertBehov[H]` and planned receipts as separate events. | AD-3 |
| R14 | `DelResultat.uker[i]` holds all six row values with inputs, keyed by a shared row-type union. | AD-5 |
