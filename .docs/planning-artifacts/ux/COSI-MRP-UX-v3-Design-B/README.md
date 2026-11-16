# COSI-MRP UX v3 – Design B

> **UX-prototype med simulerte MRP-resultater.** Carmen har valgt denne versjonen som retningen videre. Den er ikke formelt godkjent av hele gruppen ennå.

Mørkt Design B, med «Ny kjøring» fra Odas UX-prototype 16.11 v2 og én samlet resultatside etter PRD-en. Ingen innlogging eller bedriftskonto. Banneret i prototypen viser fortsatt arbeidsnavnet «Design B v2».

## Slik åpner du den

1. Hent branchen: `git fetch origin` og `git switch Carmen/Branch`, eller `git pull` hvis du allerede står på den.
2. Fra prosjektroten (`G23-eriksen-knudsen-kolstad-samdal`): `python3 -m http.server 8767 --bind 127.0.0.1`
3. Åpne http://127.0.0.1:8767/.docs/planning-artifacts/ux/COSI-MRP-UX-v3-Design-B/index.html
4. Stopp serveren med Ctrl+C. Er port 8767 opptatt, bruk et annet tall både i kommandoen og i adressen.

Prototypen må åpnes via serveren, ellers virker ikke testdataene og nedlastingene.

**Prøv:** Kom i gang → velg en fil (eller «Uten fil: testeksempel 01» → Bruk) → velg hva du vil beregne → **Beregn**. Last opp testeksempel 02 og så 03 for å se Endringer.

## Hva er nytt

- **Ny kjøring i tre steg** (fra Oda): 1 Fyll ut Excel-malen, 2 Last opp filen, 3 Velg og beregn. Å velge en fil starter ikke beregningen.
- **«Hva vil du beregne?»** (fra Oda, PRD FR-30): Bestillingsplan, Bare produksjonskapasitet, eller Bestillingsplan og produksjonskapasitet. Beregn står rett under valgene.
  - Bare produksjonskapasitet viser bare kapasitetspanelet. Kjøringen lagres ikke og eksporteres ikke.
  - Med begge valgt står kapasiteten i et eget panel nederst på resultatsiden (FR-34).
- **Forenklet Ny kjøring:** korte tekster, og filnavn og status vises først når en fil er valgt.
- **Resultatet** er én side (PRD §4.4): Bestillingsforslag med ukemeny → Endringer → Kritiske deler → Resultattabell med forklaringspanel → Ukeplan nederst.

## Simulert

- Filen som lastes opp, leses ikke, og ingenting beregnes. Filnavnet avgjør testeksempelet: «02» eller «03» i navnet gir Kontorstol Pro, alt annet gir testeksempel 01.
- Alle tall er ferdige data fra fasitene for testeksempel 01–03. Produksjonskapasitet har tall bare for 01.
- Valideringsfeil vises når de slås på under «Prototypevalg».
- Eksport til Excel er bare en melding.
- Kjøringene lagres bare i nettleseren (`localStorage`, nøkler som begynner med `cosi-b-v2-`).

## Uavklart

- Standardvalget under «Hva vil du beregne?». PRD-en sier det ikke, og prototypen bruker Bestillingsplan.
- Om valget skal vises i leveransen. Produksjonskapasitet er trinn 4 og kuttes først (PRD §7.1).
- Hvor Endringer skal stå, Ukeplan mot FR-17 («ingen egen ukevisning»), og om ordene «Ukeplan», «Ny kjøring» og «Introduksjon» skal inn i ordbanken.

## Filer

| Fil | Brukes til |
|---|---|
| `index.html` | Prototypen (én fil med HTML, CSS og JavaScript) |
| `../konsepter-2026-11-12/felles.js` | Testdata for testeksempel 01 |
| `../konsepter-2026-11-12/data-kontorstol-pro.js` | Testdata for testeksempel 02 og 03 |
| `testdata/COSI-MRP-mal.xlsx`, `testeksempel-01.xlsx`, `-02.xlsx`, `-03.xlsx` | Nedlastingene |

Bygger på `../design-b-prd-2026-11-16/` (Design B tilpasset PRD-en). Tidligere prototyper er ikke endret.
