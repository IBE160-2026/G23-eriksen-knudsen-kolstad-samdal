# PRD oppdatert med beslutninger

## 2026-11-05 kl. 13:28 — Sebastian

### Oppgave
Oppdatere PRD-en for COSI - MRP med beslutningene i `beslutninger-2026-11-05.md`. Sebastian ba uttrykkelig om at Finalize **ikke** skulle kjøres.

### Plan
- `bmad-prd`, Update-modus: les beslutningsfila, PRD-en, addendum og memlog, og se etter konflikter med tidligere beslutninger.
- Konflikt funnet: beslutning 2 sier «Prognostiserte behov» i malen, men arket i malen heter fortsatt MPS (`lag_testdata.py`, V-F01), mens ordbanken sa at arket het «Prognostiserte behov». Sebastian valgte at **arket heter fortsatt MPS**.
- Skrive `prd.md` på nytt (begrepsbyttet går gjennom hele dokumentet), og deretter oppdatere addendum, ordbank, beslutningsfila og memlog.
- Kilde: `.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md`.

### Resultat
- `prd.md` (status fortsatt `draft`, updated 2026-11-05):
  - Begreper: «del» som samlebegrep, «komponent» bare i typenavnene, «kritisk del» (FR-13, FR-14, FR-16), «Prognostiserte behov (MPS)» første gang og «prognostiserte behov» etterpå, «eksepsjon» i stedet for «varsel» (§1, UJ-2, FR-29, SM-C2). Arknavnet MPS er beholdt i FR-2, FR-3 og §3.
  - FR-6: fremskynding fra hvilken som helst senere uke er bekreftet, og omplanleggingshorisont står i §7.2 som mulig utvidelse.
  - FR-10: meldingsregelen («Leveranse til kunde» rett under ferdigproduktet, «Produksjonen av …» lenger ned).
  - FR-15/FR-18: forklaringen åpnes ved klikk i et panel ved siden av tabellen, virker med mus, tastatur og berøring, ikke ved peking.
  - FR-16: tabellen følger stykklisten. FR-17: ukefilter. FR-19: lagring i nettleseren.
  - FR-20: nye og fjernede deler, og en egen melding når ferdigproduktet er et annet. FR-22: `.xlsx`. FR-23: arket «Sammenligning».
  - NFR-4: Vercel, data i nettleseren. NFR-5: mål som måles tidlig. NFR-8: faste kolonner ved sidescroll.
  - Frist 15.12.2026 kl. 15:00 i §7. §9 delt i 9.1 Åpne (bare spm. 4) og 9.2 Lukket. §10 er en tabell over beslutningene, uten antagelser igjen.
- `addendum.md`: innspill om Vercel/nettleser, ytelsesmåling og forklaringspanel, og bakgrunn om beslutningene.
- `.docs/ordbank.md`: Excel-mal og Prognostiserte behov rettet (arket heter MPS), nytt begrep Omplanleggingshorisont.
- `beslutninger-2026-11-05.md`: merknad om at beslutningene er ført inn ved Update.
- `.memlog.md`: 7 nye linjer (event, decision, 4× change, assumption).
- Committet og pushet til `Sebastian/Branch` som f0b1024 (prd.md, addendum.md, beslutninger-2026-11-05.md, .memlog.md, ordbank.md).

### Åpne punkter
- ~~Bekreft tre tolkninger som ble utledet ved innføringen (FR-16, FR-20, FR-23).~~ Bekreftet av Sebastian 2026-11-05 og ført i `.memlog.md`.
- Seksjonen «Avvik mellom malen og PRD-en» i `.docs/ordbank.md` er utdatert (PRD-en ble oppdatert 2026-10-26) og bør fjernes eller merkes som løst.
- Kjør Finalize i `bmad-prd` (memlog-revisjon, avstemming mot kildene, gjennomgang, polering, `status: final`).
- Testpersoner og introduksjon for brukertesten (SM-3, §9 spm. 4) står fortsatt åpent (allerede i `issues.md`).
