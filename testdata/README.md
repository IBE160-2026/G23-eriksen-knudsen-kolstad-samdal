# Testdata

Denne mappen samler Excel-malen og testeksemplene for COSI - MRP.

- **Excel-mal:** den faste malen brukeren laster opp (MPS, BOM, lagerstatus, planlagte mottak, innkjøpstid og sikkerhetslager).
- **Testeksempler med fasit:** fiktive datasett (5–10 komponenter, 8–12 uker) med manuelt utregnede fasittabeller per uke og komponent. Disse brukes som grunnlag for automatiske tester av beregningsmotoren og eksepsjonene.

Sensor kan bruke filene her for å prøve appen direkte etter README i roten av repoet.

## Filer

| Fil | Innhold |
|---|---|
| `COSI-MRP-mal.xlsx` | Tom mal. Ark: Veiledning, Produkt, MPS, Komponenter, Planlagte mottak. Brukeren fyller kun ut gule celler. |
| `testeksempel-01.xlsx` | Malen utfylt for en fiktiv kontorstolprodusent: 8 komponenter, 10 uker. Lastes opp som den er. |
| `testeksempel-01-fasit.xlsx` | Fasit: beregningsregler, fasittabell per uke og komponent, og forventede eksepsjoner. |
| `lag_testdata.py` | Skriptet som lager de tre filene. Kjøres med `uv run --with openpyxl python lag_testdata.py testdata`. |

## Malens struktur

- **Produkt:** navnet på ferdigproduktet.
- **MPS:** uke 1–12 og antall ferdigprodukter. Horisonten er antall sammenhengende utfylte uker fra uke 1 (8–12).
- **Komponenter:** Komponent-ID, Navn, Antall per ferdigprodukt, Lagerbeholdning, Sikkerhetslager, Innkjøpstid (uker). BOM, lagerstatus, sikkerhetslager og innkjøpstid er samlet i ett ark, med én rad per komponent.
- **Planlagte mottak:** Komponent-ID, Uke, Antall. Én rad per mottak. Arket kan stå tomt.

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
