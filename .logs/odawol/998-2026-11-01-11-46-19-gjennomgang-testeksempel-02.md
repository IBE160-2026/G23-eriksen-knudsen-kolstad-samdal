# Gjennomgang av testeksempel 02

## 2026-11-01 kl. 11:46 — Odawol

### Oppgave
Oda ville se over `testeksempel-02.xlsx` og `testeksempel-02-fasit-med-materiell.xlsx`, som skal være laget av Carmen. Gjennomgangen er kun lesing.

### Plan
- Sjekke opphavet i git og filmetadata.
- Regne fasiten på nytt fra inndataene med reglene i arket Regler.
- Sammenligne med `testeksempel-02-fasit.xlsx`, CSV-fasiten og Carmens kontroll.

### Resultat
Ingen testdata er endret.

**Tall:** Omregningen gir null avvik mot fasittabellen og eksepsjonene (8 deler, 10 uker, 5 eksepsjoner). `testeksempel-02-fasit.xlsx` og CSV-fasiten stemmer også. Carmens kontroll stemmer for alle 8 deler, med samme uke og type på varslene.

**Opphav:**
- `testeksempel-02.xlsx` på `Oda/Branch` er ikke Carmens fil. Den ble laget på nytt med `lag_testdata.py` i fletten `8635bb9` (Odawol, 2026-10-26), med arket MPS og tre typer. Tallene er de samme som i Carmens versjon.
- Carmens versjon (`0cb38cc0fa`) ligger på `origin/main` og `origin/Carmen/Branch`, med arket Prognostiserte behov og typene Delmontering og Råvare.
- `testeksempel-02-fasit-med-materiell.xlsx` er committet av Carmen (`02f91e8`, 2026-10-28) og er identisk med versjonen på `origin/main`. Filmetadata viser at den sist ble lagret av Idun Samdal 2026-10-28.
- Filene er opprinnelig generert med openpyxl fra skriptet, ikke skrevet for hånd. Håndkontrollen er den egne kontrollfila.

### Åpne punkter
- Fasiten med Materiell bruker Delmontering og Råvare i arkene Regler og Utregning (rad 31, 32 og 37 i Regler, rad 20, 34 og 101 i Utregning), mens `testeksempel-02.xlsx` på `Oda/Branch` bruker Komponent (Produseres selv) og Komponent (Kjøpes inn).
- Regel 1–3 for flernivå BOM og avklaringene står som «ikke bekreftet ennå» i Regler, selv om fasiten er merket som kontrollert for hånd. Gruppen må bekrefte dem.
- Arket Materiell er ikke beskrevet i `testdata/README.md`, skriptet lager det ikke, og ingen tester bruker det. Gruppen må avgjøre om fila skal beholdes eller om arket skal inn i `lag_testdata.py`.
