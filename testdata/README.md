# Testdata

Denne mappen samler Excel-malen og testeksemplene for COSI - MRP.

- **Excel-mal:** den faste malen brukeren laster opp (prognostiserte behov/MPS, flernivå BOM, lagerstatus, planlagte mottak, ledetid og sikkerhetslager).
- **Testeksempler med fasit:** fiktive datasett (5–10 komponenter, 8–12 uker) med manuelt utregnede fasittabeller per uke og komponent. Disse brukes som grunnlag for automatiske tester av beregningsmotoren og eksepsjonene.

Sensor kan bruke filene her for å prøve appen direkte etter README i roten av repoet.

## Filer

| Fil | Innhold |
|---|---|
| `COSI-MRP-mal.xlsx` | Tom mal. Ark: Veiledning, Stykkliste, Prognostiserte behov, Planlagte mottak, Veien videre. Brukeren fyller kun ut gule celler. |
| `testeksempel-01.xlsx` | Malen utfylt for en fiktiv kontorstolprodusent: 8 komponenter på ett nivå, 10 uker. Følger den eldre malen fra 2026-10-18 (Produkt- og Komponenter-ark, varenummer K01–K08) og må lages på nytt med `--alle` for å passe den nye malen. |
| `testeksempel-01-fasit.xlsx` | Fasit: beregningsregler, fasittabell per uke og komponent, og forventede eksepsjoner. |
| `lag_testdata.py` | Skriptet som lager filene. `uv run --with openpyxl python lag_testdata.py testdata` lager bare malen. Legg til `--alle` for også å lage testeksempel og fasit. |

## Malens struktur

- **Veiledning:** hvordan malen fylles ut. Arknavnene er lenker til arkene.
- **Stykkliste:** Nivå, Varenummer, Beskrivelse, Antall, Type, Lagerbeholdning, Sikkerhetslager, Ledetid (uker). Én rad per del ovenfra og ned (inntil 1000). Erstatter de tidligere arkene Produkt og Komponenter.
  - Nivå velges fra en nedtrekksliste: 0 (ferdigproduktet, alltid første rad og bare én), .1 (hovedkomponenter) og ..2 (delene som trengs for å bygge hovedkomponenten rett over). Rett under 0 kan bare .1 velges, og ..2 kan bare stå under .1 eller ..2. Fra ..2 kan man gå opp igjen til .1. Listen ligger i den skjulte kolonnen Z.
  - De skjulte kolonnene AA og AB lager en liste over varenumrene uten dubletter. Navnet `Varenumre` peker på den og vokser med antall ulike varenumre.
  - Antall er antall per enhet av delen over, og står tomt (grått) for nivå 0. Type velges fra en liste: Ferdigvare, Delmontering, Komponent (Kjøpes inn), Komponent (Produseres selv), Råvare (Kjøpes inn) og Råvare (Produseres selv). Ferdigvare brukes bare på nivå 0.
  - Samme del kan stå flere steder (f.eks. skruer). Lagerbeholdning, sikkerhetslager og ledetid fylles bare ut første gang varenummeret står, og cellene er grå de neste gangene.
  - Kolonnen «Kontroll» viser hva som mangler eller ikke stemmer i hver rad, bl.a. ulik beskrivelse eller type for samme varenummer og deler som kjøpes inn og likevel har underkomponenter.
  - Neste rad kommer frem når nivå og varenummer i raden over er fylt ut.
  - Varenummer: forslaget er varegruppe-løpenummer, f.eks. 100-001 (ferdigvare), 200-001 (delmontering eller del som produseres selv), 300-001 (komponent eller råvare som kjøpes inn).
- **Prognostiserte behov** (tidligere «MPS»): uke 1–12 og antall ferdigprodukter. Åtte uker (minste horisont) vises fra start, og neste uke kommer frem når ukene over er fylt ut. Horisonten er antall sammenhengende utfylte uker fra uke 1 (8–12).
- **Planlagte mottak:** Varenummer, Uke, Antall. Varenummer velges fra en nedtrekksliste med varenumrene i Stykkliste, som oppdateres av seg selv. Én rad per mottak (innkjøp eller produksjonsordre som allerede er startet), og neste rad kommer frem når raden over er fylt ut (inntil 200). Arket kan stå tomt.
- **Veien videre:** hva brukeren gjør etter utfylling. Utkast, bygges ut etter hvert som appen utvikles.

Radene som «kommer frem» er laget med betinget formatering og datavalidering, ikke makroer, slik at malen forblir en vanlig `.xlsx`. Alle rader finnes i filen fra start, men ser blanke ut til de åpnes, og det går ikke an å skrive i dem før da. Kolonnene til høyre for tabellene (Kontroll, lenke tilbake til veiledningen og de skjulte listekolonnene) er bare hjelpetekst og skal ikke leses inn av appen.

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

**Status:** kontrollert. Fasiten er beregnet med skriptet og kontrollert for hånd (2026-10-19). Beregningsreglene i arket *Regler* er bekreftet. Forfalte frigivelser legges i uke 1, og eksepsjonsmeldingen oppgir hvor mye av uke 1 som er forfalt. Forfalte ordremottak vises i uken behovet er, selv om de fysisk kommer senere.
