# Testeksempel 05: produksjonskapasitet

## 2026-11-09 kl. 09:02 — Sebastian

### Oppgave
Sebastian ba om et testeksempel med fasit for produksjonskapasiteten (PRD §4.9, FR-31–FR-33, SM-7), som manglet etter at F3 kom inn i v1.

### Plan
- Lage en referanseberegning `kapasitet()` i `testdata/lag_testdata.py`. Den bruker nettingen i `mrp_del()` med reglene i FR-31: ledig beholdning, SS 0, uten fremskynding, ingen nye ordrer for deler uten underdeler og ingen forfalt frigivelse. Kapasiteten finnes med binærsøk per uke og rad.
- Lage et lite testeksempel 05 som kan regnes for hånd og dekker alt i SM-7. Regne det for hånd først og legge tallene inn som forventet verdi i `kontroller()`.
- Forrige økt: [gruppemote-beslutninger-prd](986-2026-11-09-08-37-42-gruppemote-beslutninger-prd.md).

### Resultat
- **`lag_testdata.py`:**
  - Ny `kapasitet()` og `kapasitet_mangler()`. Den forfalte delen av en frigivelse sendes ikke videre til underdelene, så bare deler som selv mangler, regnes som begrensende.
  - `lag_fasit()` lager arket Kapasitet når det finnes en håndregning: kapasitet per uke på to rader, begrensende deler med årsak, grunnlag per del og håndregningen.
  - `kontroller()` sjekker kapasiteten, de begrensende delene, at kapasiteten aldri synker, og at raden med mottak aldri er lavere enn raden fra lager.
- **Testeksempel 05, Kontorstol Kompakt (100-004):** 7 deler på tre nivåer, 8 uker, mottak for 300-034 i uke 3 og 300-033 i uke 5.
  - Kapasitet fra lager: 10, 10, 18, 30, 30, 30, 30, 30.
  - Med planlagte mottak: 10, 10, 18, 30, 30, 30, 35, 35.
  - Begrensende deler: 100-004 / 200-021 / 200-020 (ledetid) i uke 1 / 2 / 3, 300-033 Ryggplate (lager) fra uke 4, og 300-032 Skruesett M6 (lager) i uke 7–8 med mottak. For skruesettet ville en enkel minimumsregel gitt 20 i stedet for 25.
  - MPS `[5, 5, 6, 6, 8, 8, 6, 6]` er valgt slik at MRP-beregningen bare gir én eksepsjon: 300-033 Mottak forsinket i uke 4.
- Skriptet ga de samme tallene som håndregningen. Fasitene for 01–04 og valideringsfilene er byte-like. Begge filene for 05 åpnes i Excel (sjekket via COM).
- **Dokumenter:** `testdata/README.md` har ny seksjon og nye rader i dekningstabellen. PRD SM-7 viser til testeksempel 05, addendumet viser til `kapasitet()`, og ordbanken sier testeksempel 01–05. Memlog er oppdatert.
- Commit 66e34e5, pushet til `Sebastian/Branch`, så det er med i PR #3.

### Åpne punkter
- Gruppa kontrollerer fasit 05 for hånd: MRP-tabellene, eksepsjonen for 300-033 og arket Kapasitet.
