# Testdata

Denne mappen samler Excel-malen og testeksemplene for COSI - MRP.

- **Excel-mal:** den faste malen brukeren laster opp (prognostiserte behov/MPS, BOM, lagerstatus, planlagte mottak, innkjøpstid og sikkerhetslager).
- **Testeksempler med fasit:** fiktive datasett (5–10 komponenter, 8–12 uker) med manuelt utregnede fasittabeller per uke og komponent. Disse brukes som grunnlag for automatiske tester av beregningsmotoren og eksepsjonene.

Sensor kan bruke filene her for å prøve appen direkte etter README i roten av repoet.

## Filer

| Fil | Innhold |
|---|---|
| `COSI-MRP-mal.xlsx` | Tom mal. Ark: Veiledning, Produkt, Prognostiserte behov, Komponenter, Planlagte mottak, Veien videre. Brukeren fyller kun ut gule celler. |
| `testeksempel-01.xlsx` | Malen utfylt for en fiktiv kontorstolprodusent: 8 komponenter, 10 uker. Lastes opp som den er. Følger den nye malen. |
| `testeksempel-01-fasit.xlsx` | Fasit: beregningsregler, fasittabell per uke og komponent, og forventede eksepsjoner. |
| `lag_testdata.py` | Skriptet som lager filene. `uv run --with openpyxl python lag_testdata.py testdata` lager bare malen. Legg til `--alle` for også å lage testeksempel og fasit. |

## Malens struktur

- **Veiledning:** hvordan malen fylles ut. Arknavnene er lenker til arkene.
- **Produkt:** navnet på ferdigproduktet (A2) og antall komponenter (B2).
- **Prognostiserte behov** (tidligere «MPS»): uke 1–12 og antall ferdigprodukter. Åtte uker (minste horisont) vises fra start, og neste uke kommer frem når ukene over er fylt ut. Horisonten er antall sammenhengende utfylte uker fra uke 1 (8–12).
- **Komponenter:** Komponent-ID, Navn, Antall per ferdigprodukt, Lagerbeholdning, Sikkerhetslager, Innkjøpstid (uker). BOM, lagerstatus, sikkerhetslager og innkjøpstid er samlet i ett ark, med én rad per komponent. Antallet i Produkt bestemmer hvor mange rader som er åpne (inntil 500).
- **Planlagte mottak:** Komponent-ID, Uke, Antall. Én rad per mottak, og neste rad kommer frem når raden over er fylt ut (inntil 200). Arket kan stå tomt.
- **Veien videre:** hva brukeren gjør etter utfylling. Utkast, bygges ut etter hvert som appen utvikles.

Radene som «kommer frem» er laget med betinget formatering og datavalidering, ikke makroer, slik at malen forblir en vanlig `.xlsx`. Alle rader finnes i filen fra start, men ser blanke ut til de åpnes, og det går ikke an å skrive i dem før da. Kolonnene til høyre for tabellene (lenke tilbake til veiledningen, antall komponenter) er bare hjelpetekst og skal ikke leses inn av appen.

## Testeksempel 01 – hva det dekker

| Komponent | Tilfelle |
|---|---|
| K01 Sete, K02 Rygg | Normalforløp uten eksepsjoner |
| K03 Hjul | Bestilling forsinket i uke 1 (behov i uke 1, lageret går under 0) |
| K04 Armlene | Bruk av sikkerhetslager i uke 1 |
| K05 Gassfjær | Mottak forsinket (behov i uke 3, planlagt mottak i uke 4) |
| K06 Stolfot | Innkjøpstid = horisont (grensetilfelle) |
| K07 Skruesett | Planlagt mottak som kommer i tide |
| K08 Trekk | Sikkerhetslager 0 og frigivelse nøyaktig i uke 1 |

**Status:** utkast. Fasiten er beregnet med skriptet og må kontrolleres for hånd av gruppen før den brukes som fasit. Beregningsreglene i arket *Regler* (bl.a. at forfalte frigivelser legges i uke 1) må også bekreftes.
