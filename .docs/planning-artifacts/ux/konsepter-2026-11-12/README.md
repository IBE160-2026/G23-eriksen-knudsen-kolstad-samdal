---
title: COSI - MRP designkonsepter
status: forslag – ikke godkjent design
created: 2026-11-12
author: Carmen Kolstad
---

# Designkonsepter for COSI - MRP (konseptfase)

> **Forslag til diskusjon, ikke godkjent design.** Tre visuelle retninger for resultatsiden, laget som HTML-skisser. De erstatter ikke [designforslaget](../designforslag-2026-11-12.md) eller utkastene til [DESIGN.md](../ux-COSI%20-%20MRP-2026-11-12/DESIGN.md) og [EXPERIENCE.md](../ux-COSI%20-%20MRP-2026-11-12/EXPERIENCE.md), som er uendret.

**Åpne galleriet:** dobbeltklikk på `index.html` i Finder, eller kjør `open .docs/planning-artifacts/ux/konsepter-2026-11-12/index.html` fra prosjektroten. Alt virker uten nett, bortsett fra at ingen eksterne fonter lastes (konseptene bruker systemskrift).

| Fil | Innhold |
|---|---|
| `index.html` | Galleri: oversikt med forhåndsvisning, side om side, ett konsept i full bredde, og sammenligningstabell |
| `konsept-1-erp.html` | 1 · Profesjonelt ERP – kompakt, strukturert, datadrevet |
| `konsept-2-saas.html` | 2 · Moderne SaaS – minimalistisk, luftig, veiledende |
| `konsept-3-hybrid.html` | 3 · Hybrid – moderne ramme rundt en full MRP-tabell |
| `felles.js` | Felles data og forklaringer, så alle konseptene viser de samme tallene |

## Data

- **MRP-resultat, eksepsjoner og bestillingsforslag:** kopiert fra `testdata/testeksempel-01-fasit.xlsx` (kontrollert for hånd). Stykkliste og planlagte mottak fra `testdata/testeksempel-01.xlsx`.
- **Produksjonskapasitet:** testeksempel 01 har ingen kapasitetsfasit. Tallene er beregnet med referanseberegningen `kapasitet()` i `testdata/lag_testdata.py`, kjørt uendret 2026-11-12, og er **ikke manuelt kontrollert**. Resultat: 10 ferdigprodukter i alle uker på begge radene, begrenset av 300-003 Hjul (lager). Det stemmer med ledig beholdning (80 − 30) / 5 per stol = 10.
- Ingen beregning skjer i konseptene, og testdata og beregningskode er ikke endret.

## Felles for alle tre

Rekkefølgen følger PRD §4.4 (bestillingsforslag før endringer og kritiske deler). Alle har ukefilter (FR-17), hopp fra kritiske deler til tabellen (FR-16), eksepsjoner med farge og symbol (FR-15), forklaring ved klikk som lukkes med «Lukk» eller Esc og aldri vises ved peking (FR-18), og kapasitetspanel med to rader, begrensende del med årsak og grunnlag per del (FR-32–FR-34). Endringer viser «Første kjøring», fordi det ikke finnes en tidligere kjøring for testeksempel 01.

Sammenligning og risiko mot PRD-en står i galleriet.
