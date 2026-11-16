---
title: COSI - MRP designkonsepter
status: forslag – ikke godkjent design
created: 2026-11-12
author: Carmen Kolstad
---

# Designkonsepter for COSI - MRP (konseptfase)

> **Forslag til diskusjon, ikke godkjent design.** Tre visuelle retninger for resultatsiden, laget som HTML-skisser. De erstatter ikke [designforslaget](../designforslag-2026-11-12.md) eller utkastene til [DESIGN.md](../ux-COSI%20-%20MRP-2026-11-12/DESIGN.md) og [EXPERIENCE.md](../ux-COSI%20-%20MRP-2026-11-12/EXPERIENCE.md), som er uendret.

**Åpne galleriet:** dobbeltklikk på `index.html` i Finder, eller kjør `open .docs/planning-artifacts/ux/konsepter-2026-11-12/index.html` fra prosjektroten. Alt virker uten nett, bortsett fra at ingen eksterne fonter lastes (konseptene bruker systemskrift).

**Brukerreisen med nedlasting av Excel-filer:** åpne den via en lokal server, ikke som `file://`. Safari ser bort fra `download`-attributtet på `file://`-sider og prøver å vise Excel-filen i fanen i stedet for å laste den ned. Kjør fra prosjektroten:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Åpne deretter <http://localhost:8765/.docs/planning-artifacts/ux/konsepter-2026-11-12/brukerreise-startside.html>. Stopp serveren med Ctrl+C.

| Fil | Innhold |
|---|---|
| `index.html` | Galleri: oversikt med forhåndsvisning, side om side, ett konsept i full bredde, og sammenligningstabell |
| `konsept-1-erp.html` | 1 · Profesjonelt ERP – kompakt, strukturert, datadrevet |
| `konsept-2-saas.html` | 2 · Moderne SaaS – minimalistisk, luftig, veiledende |
| `konsept-3-hybrid.html` | 3 · Hybrid – moderne ramme rundt en full MRP-tabell |
| `felles.js` | Felles data og forklaringer, så alle konseptene viser de samme tallene |
| `brukerreise-startside.html` | Brukerreisen: startside, opplasting, valideringsfeil og resultat (versjon 2, 2026-11-14). Kort introduksjon, tre steg som kort, utfyllingsveiledning som kan åpnes og lukkes, sidemeny med Ny kjøring, Lagrede kjøringer og Veiledning |
| `konsept-4-hybrid-forbedret.html` | 4 · Hybrid forbedret – resultatsiden i brukerreisen (versjon 2: samme sidemeny som startsiden, ellers uendret) |
| `brukerreise-v3.html` | Brukerreisen versjon 3 (2026-11-14): minimalistisk retning med visninger i stedet for én lang side. Oversikt med bestillingsforslag som hovedinnhold, Del-visning ved klikk, full MRP-tabell i «Alle deler». Avklaringer i `brukerreise-v3-avklaringer.md` |
| `brukerreise-v3-avklaringer.md` | Avklaringer gruppen må godkjenne før v3 eventuelt føres inn i EXPERIENCE.md |
| `brukerreise-v4.html` | Brukerreisen versjon 4 (2026-11-14): som v3, men bestillingsforslagene er delt i Produksjon og Innkjøp (klassifisering etter FR-17), og ukene kan åpnes og lukkes. Avklaringer i `brukerreise-v4-avklaringer.md` |
| `brukerreise-v4-avklaringer.md` | Avklaringer gruppen må godkjenne for v4, i tillegg til avklaringene for v3 |
| `data-kontorstol-pro.js` | Data for testeksempel 02 og 03 (Kontorstol Pro), kopiert fra fasiten |
| `brukerreise-startside-2026-11-13.html`, `konsept-4-hybrid-forbedret-2026-11-13.html` | Versjon 1 fra 2026-11-13, tatt vare på uendret bortsett fra at de lenker til hverandre |

## Data

- **MRP-resultat, eksepsjoner og bestillingsforslag:** kopiert fra `testdata/testeksempel-01-fasit.xlsx` (kontrollert for hånd). Stykkliste og planlagte mottak fra `testdata/testeksempel-01.xlsx`.
- **Produksjonskapasitet:** testeksempel 01 har ingen kapasitetsfasit. Tallene er beregnet med referanseberegningen `kapasitet()` i `testdata/lag_testdata.py`, kjørt uendret 2026-11-12, og er **ikke manuelt kontrollert**. Resultat: 10 ferdigprodukter i alle uker på begge radene, begrenset av 300-003 Hjul (lager). Det stemmer med ledig beholdning (80 − 30) / 5 per stol = 10.
- Ingen beregning skjer i konseptene, og testdata og beregningskode er ikke endret.

## Felles for alle tre

Rekkefølgen følger PRD §4.4 (bestillingsforslag før endringer og kritiske deler). Alle har ukefilter (FR-17), hopp fra kritiske deler til tabellen (FR-16), eksepsjoner med farge og symbol (FR-15), forklaring ved klikk som lukkes med «Lukk» eller Esc og aldri vises ved peking (FR-18), og kapasitetspanel med to rader, begrensende del med årsak og grunnlag per del (FR-32–FR-34). Endringer viser «Første kjøring», fordi det ikke finnes en tidligere kjøring for testeksempel 01.

Sammenligning og risiko mot PRD-en står i galleriet.
