# Testdata

Denne mappen samler Excel-malen og testeksemplene for COSI - MRP.

- **Excel-mal:** den faste malen brukeren laster opp (MPS, flernivå BOM, lagerstatus, planlagte mottak, ledetid og sikkerhetslager).
- **Testeksempler med fasit:** fiktive datasett (5–10 deler, 8–12 uker) i malens format, med fasittabeller per uke og del og forventede eksepsjoner. Fasitene finnes også som CSV, slik at automatiske tester av beregningsmotoren og eksepsjonene kan lese dem.

Sensor kan bruke filene her for å prøve appen direkte etter README i roten av repoet.

## Filer

| Fil | Innhold |
|---|---|
| `COSI-MRP-mal.xlsx` | Tom mal. Ark: Veiledning, Stykkliste, MPS, Planlagte mottak, Veien videre. Brukeren fyller kun ut gule celler. |
| `testeksempel-01.xlsx` | Malen utfylt for en fiktiv kontorstolprodusent: ferdigvaren 100-001 og 8 innkjøpte deler (300-001–300-008) på nivå .1, 10 uker. |
| `testeksempel-01-fasit.xlsx` | Fasit: arkene Regler (beregningsregler og hva hver del tester), Fasittabell (per uke og del, også ferdigvaren) og Eksepsjoner. |
| `testeksempel-02.xlsx` | Malen utfylt for en fiktiv kontorstolprodusent med stykkliste på 3 nivåer: ferdigvaren 100-001 og 7 deler, 10 uker. |
| `testeksempel-02-fasit.xlsx` | Som fasiten for 01, pluss arket Utregning: hele beregningen steg for steg, del for del og uke for uke, slik at den kan regnes etter for hånd. |
| `fasit/testeksempel-NN-tabell.csv` | Fasittabellen som CSV: `varenummer,rad,uke,verdi`. |
| `fasit/testeksempel-NN-eksepsjoner.csv` | Eksepsjonene som CSV: `varenummer,uke,type,melding`. Uke er «–» for «Ledetid overskrider horisont». |
| `lag_testdata.py` | Skriptet som lager filene, med lesing av utfylt mal (`les_eksempel`) og MRP-beregning nivå for nivå (`beregn_flerniva`). Se under. |
| `kontroll/testeksempel-02-kontroll-carmen.xlsx` | Kontrollen for hånd av fasiten for testeksempel 02: ett ark per del med beregningen uke for uke, og arket Forklaring med formlene. |
| `tests/test_mrp.py` | Tester (pytest) av beregningen mot fasitene. |
| `tests/data/testeksempel-01-fasit-2026-10-19-*.csv` | Tallene og eksepsjonene fra fasiten for testeksempel 01 fra 2026-10-19 (gammelt format, K01–K08 oversatt til 300-001–300-008). Brukes til å sjekke at det nye formatet gir de samme tallene. |

## Slik lages filene og kjøres testene

Kjør fra mappen `testdata/`:

```
uv run --with openpyxl python lag_testdata.py . --alle     # testeksempler, fasiter og CSV
uv run --with openpyxl --with pytest pytest tests -v       # testene
uv run --with openpyxl python lag_testdata.py . --mal      # bare hvis malen skal lages på nytt
```

`--alle` rører ikke `COSI-MRP-mal.xlsx`. Hvert testeksempel lages i malens format, leses tilbake fra xlsx-filen slik appen skal lese den, og fasiten regnes ut fra det som ble lest.

## Malens struktur

- **Veiledning:** hvordan malen fylles ut. Arknavnene er lenker til arkene. Eksempelet i arket (grønne celler) er bare en utfyllingshjelp og henger ikke sammen med testeksemplene.
- **Stykkliste:** Nivå, Varenummer, Beskrivelse, Antall, Type, Lagerbeholdning, Sikkerhetslager, Ledetid (uker). Én rad per del ovenfra og ned (inntil 1000). Erstatter de tidligere arkene Produkt og Komponenter.
  - Nivå velges fra en nedtrekksliste: 0 (ferdigproduktet, alltid første rad og bare én), .1 (hovedkomponenter) og ..2 (delene som trengs for å bygge hovedkomponenten rett over). Rett under 0 kan bare .1 velges, og ..2 kan bare stå under .1 eller ..2. Fra ..2 kan man gå opp igjen til .1. Listen ligger i den skjulte kolonnen Z.
  - De skjulte kolonnene AA og AB lager en liste over varenumrene uten dubletter. Navnet `Varenumre` peker på den og vokser med antall ulike varenumre.
  - Antall er antall per enhet av delen over, og står tomt (grått) for nivå 0. Type velges fra en liste: Ferdigvare, Komponent (Kjøpes inn) og Komponent (Produseres selv). Ferdigvare brukes bare på nivå 0.
  - Samme del kan stå flere steder (f.eks. skruer). Lagerbeholdning, sikkerhetslager og ledetid fylles bare ut første gang varenummeret står, og cellene er grå de neste gangene.
  - Kolonnen «Kontroll» viser hva som mangler eller ikke stemmer i hver rad, bl.a. brudd på nivåreglene (første rad er 0, bare ett nivå 0, ..2 rett under .1 eller ..2), verdier i Nivå og Type som ikke finnes i nedtrekkslistene (f.eks. etter innliming), ulik beskrivelse eller type for samme varenummer og deler som kjøpes inn og likevel har underkomponenter.
  - Neste rad kommer frem når nivå og varenummer i raden over er fylt ut.
  - Varenummer: forslaget er varegruppe-løpenummer, f.eks. 100-001 (ferdigvare), 200-001 (komponent som produseres selv), 300-001 (komponent som kjøpes inn).
- **MPS** (en periode kalt «Prognostiserte behov»): uke 1–12 og antall ferdigprodukter. Åtte uker (minste horisont) vises fra start, og neste uke kommer frem når ukene over er fylt ut. Horisonten er antall sammenhengende utfylte uker fra uke 1 (8–12).
- **Planlagte mottak:** Varenummer, Uke, Antall. Varenummer velges fra en nedtrekksliste med varenumrene i Stykkliste, som oppdateres av seg selv. Én rad per mottak (innkjøp eller produksjonsordre som allerede er startet), og neste rad kommer frem når raden over er fylt ut (inntil 200). Arket kan stå tomt.
- **Veien videre:** hva brukeren gjør etter utfylling. Utkast, bygges ut etter hvert som appen utvikles.

Det skal ikke limes inn data i celler med nedtrekksliste (Nivå og Type i Stykkliste, Varenummer i Planlagte mottak). Innliming fjerner listen og valideringen i cellen. Regelen står i Veiledning, og Kontroll-kolonnen fanger opp ugyldige nivåer og typer.

Radene som «kommer frem» er laget med betinget formatering og datavalidering, ikke makroer, slik at malen forblir en vanlig `.xlsx`. Alle rader finnes i filen fra start, men ser blanke ut til de åpnes, og det går ikke an å skrive i dem før da. Kolonnene til høyre for tabellene (Kontroll, lenke tilbake til veiledningen og de skjulte listekolonnene) er bare hjelpetekst og skal ikke leses inn av appen.

## Beregningsregler i korte trekk

Reglene står i arket *Regler* i fasitene.

- Ferdigvaren (nivå 0) har prognosen som bruttobehov. For deler lenger ned er bruttobehovet planlagte ordrefrigivelser for delen over × antall. Står en del flere steder, summeres bidragene.
- Delene regnes i rekkefølge etter lavnivåkode (det dypeste nivået delen står på).
- Forfalte frigivelser legges i uke 1, og eksepsjonsmeldingen oppgir hvor mye av uke 1 som er forfalt. En forfalt frigivelse blir dermed bruttobehov i uke 1 for delene under. Forfalte ordremottak vises i uken behovet er, selv om de fysisk kommer senere.
- Det finnes fire eksepsjoner:
  - **Bestilling forsinket:** til kunde for ferdigvaren, til produksjonen av delen over ellers.
  - **Bruk av sikkerhetslager.**
  - **Mottak forsinket:** fra leverandør eller fra egen produksjon.
  - **Ledetid overskrider horisont** (L ≥ H).
- En del med underdeler kan bare stå ett sted i stykklisten. Antall er heltall ≥ 1.

## Testeksempel 01 – hva det dekker

Ferdigvaren 100-001 har lager, sikkerhetslager og ledetid 0. Frigivelsene blir derfor lik prognosen, og delene på nivå .1 får de samme tallene som i fasiten fra 2026-10-19. Testene sjekker dette.

| Del | Tilfelle |
|---|---|
| 100-001 Kontorstol Basic | Ferdigvare som sender prognosen uendret videre (ingen eksepsjoner) |
| 300-001 Sete, 300-002 Rygg | Normalforløp uten eksepsjoner |
| 300-003 Hjul | Bestilling forsinket i uke 1 (behov i uke 1, lageret går under 0) |
| 300-004 Armlene | Bruk av sikkerhetslager i uke 1 |
| 300-005 Gassfjær | Mottak forsinket (behov i uke 3, planlagt mottak fra leverandør i uke 4) |
| 300-006 Stolfot | Ledetid = horisont (grensetilfelle) |
| 300-007 Skruesett | Planlagt mottak som kommer i tide |
| 300-008 Trekk | Sikkerhetslager 0 og frigivelse nøyaktig i uke 1 |

## Testeksempel 02 – hva det dekker

Kontorstol Pro, 10 uker, stykkliste på 3 nivåer:

| Nivå | Del | Tilfelle |
|---|---|---|
| 0 | 100-001 Kontorstol Pro (Ferdigvare) | Egen lagerbeholdning, sikkerhetslager og ledetid 1. Bestilling forsinket i uke 1 (til kunde). Den forfalte frigivelsen blir bruttobehov på nivå .1 i uke 1 |
| .1 | 200-001 Sete (Produseres selv) | Produseres selv, med deler under seg. Den forfalte frigivelsen fra ferdigvaren gir Bestilling forsinket i uke 1 (til produksjonen av delen over) |
| ..2 | 300-001 Seteplate | Bruttobehov fra setets frigivelser, normalforløp |
| ..2 | 300-002 Skruesett M6 | Står under både Sete (4 stk.) og Rygg (2 stk.). Behovet summeres |
| .1 | 200-002 Rygg (Produseres selv) | Planlagt mottak fra egen produksjon i uke 4, nettobehov i uke 3: Mottak forsinket |
| ..2 | 300-003 Ryggtrekk (Kjøpes inn) | Bruk av sikkerhetslager i uke 2 |
| .1 | 300-004 Hjul | Normalforløp, ingen falske varsler |
| .1 | 300-005 Gassfjær | Ledetid 12 > horisont 10: Ledetid overskrider horisont, uten behov i horisonten |

**Status:** Kontrollert for hånd av Carmen 2026-10-24 (testeksempel 02, alle 8 deler, tall og eksepsjoner, se testdata/kontroll/). Testeksempel 01 samsvarer med fasiten fra 2026-10-19.
