# Testeksempel 02 og underdelskontroll

## 2026-11-05 kl. 11:22 — Sebastian

### Oppgave
Sebastian ba meg lese testeksempel 02 (flernivå, laget av Carmen 2026-10-29, commit 9e6ad38). Han ba også om å fikse Kontroll-kolonnen i Excel-malen, slik at den viser ulike underdeler når en del med underdeler står flere steder (PRD FR-3, valg B fra [994](994-2026-11-02-21-27-05-beregn-flerniva-og-fasit-01.md)).

### Plan
- Lese `testeksempel-02.xlsx` og `testeksempel-02-fasit-med-materiell.xlsx`, kjøre `beregn()` på dataene og sammenligne med fasiten.
- Legge underdelskontrollen inn i Kontroll-formelen med skjulte hjelpekolonner og teste den i ekte Excel via COM.

### Resultat
- **Testeksempel 02** (Kontorstol Pro, 3 nivåer, 8 deler, H = 10) dekker godt:
  - ferdigprodukt med lager og ledetid
  - forfalt frigivelse som går videre til nivå .1
  - felles del (Skruesett M6 under Sete og Rygg)
  - Mottak forsinket i egen produksjon
  - Bruk av sikkerhetslager på nivå ..2
  - Ledetid overskrider horisont
- Sammenlignet med `beregn()` er testeksempel 02 laget før reglene fra 2026-11-02:
  - **200-002 Rygg:** mottaket på 40 i uke 4 fremskyndes nå til uke 3 (FR-6), så ordren på 25 i uke 3 forsvinner. Frigivelsene flyttes fra uke 2 til uke 3. Det endrer bruttobehovet for 300-002 og 300-003.
  - **300-003 Ryggtrekk:** mister eksepsjonen «Bruk av sikkerhetslager» i uke 2. Behovet kommer nå i uke 3, og frigivelsen i uke 1 er ikke forfalt.
  - **200-001 Sete:** meldingen sier «Leveransen til produksjonen av delen over», men bekreftet regel er «Leveranse til kunde» når delen over er ferdigproduktet.
  - **300-005 Gassfjær:** ledetiden fra ferdigproduktet er 13 (1 + 12), og meldingen er ny (FR-9).
  - **Malformat:** filen bruker gammel mal: arket heter «Prognostiserte behov» (nå MPS), typene «Delmontering» og «Råvare (Kjøpes inn)» finnes ikke i typelisten, og Kontroll-formelen er den gamle.
  - **Regler-arket:** sier at en del med underdeler bare kan stå ett sted. Det strider mot valg B.
  - **Status-teksten:** viser til `testdata/kontroll/`, som ikke finnes i repoet.
- **Kontroll-kolonnen** (`testdata/lag_testdata.py`):
  - Ny `underdeler(n)` i Kontroll-formelen. Nye skjulte hjelpekolonner: AD (raden til nærmeste .1 over) og AC (overordnet varenummer for ..2-rader).
  - Meldingen er «Andre underdeler under <varenummer> enn første gang (rad N).»
  - Sammenligningen ser ikke på rekkefølgen: like mange rader, og hver kombinasjon av varenummer og antall like mange ganger.
- **Testet i Excel 16 via COM:**
  - Ingen feil når underdelene står bare første gang, eller likt i annen rekkefølge.
  - Feil når antallet er ulikt, en underdel mangler eller det er en ekstra underdel.
  - Ingen feil i tom mal eller i testeksempel 01. Omregningen tar under 0,1 sekund, som før.
- `COSI-MRP-mal.xlsx` og `testeksempel-01.xlsx` er laget på nytt. `testdata/README.md` beskriver kontrollen og AC/AD.
- **Testeksempel 02 laget på nytt** (etter Sebastians beskjed):
  - `lag_testdata.py` har fått `STYKKLISTE_02`, `MPS_02`, `MOTTAK_02`, `HENSIKT_02` og `STATUS_02`, og `TESTEKSEMPLER` lager begge eksemplene med `--alle`.
  - Typene er erstattet: Delmontering → Komponent (Produseres selv), Råvare (Kjøpes inn) → Komponent (Kjøpes inn).
  - 300-003 har lager 20 (før 40), slik at «Bruk av sikkerhetslager» kommer i uke 1.
  - Nytt mottak: 300-005, uke 5, 50 stk., som gir «Kanseller mottak».
  - Resultat: seks eksepsjoner. Kritiske deler er 100-001, 200-001, 200-002, 300-003 og 300-005.
- **Fasitene** har fått arkene Utregning (steg for steg, som i Carmens fasit) og Materiell (lavnivåkode).
  - `mrp_del()` gir nå et spor per uke, og `beregn(..., detaljer)` samler det.
  - Regler, Fasittabell og Eksepsjoner i fasit 01 er uendret.
- `testeksempel-02-fasit-med-materiell.xlsx` er erstattet av `testeksempel-02-fasit.xlsx`.
- Kontroll-kolonnen viser ingen feil i testeksempel 02 (testet i Excel).
- **Dokumenter:**
  - `testdata/README.md` har fått en egen seksjon for testeksempel 02.
  - PRD §9 spm. 7 er løst. Før/etter-sammenligningen trenger nå et eget testeksempel 03.
  - PRD §9 spm. 11 er delvis løst (FR-29 er dekket, FR-9 mangler).
  - Addendumet sier ikke lenger at `beregn` bare er enkeltnivå.
- Committet i f0b739d og pushet til `Sebastian/Branch`.

### Åpne punkter
- Kontroller for hånd endringene i testeksempel-02-fasit.xlsx mot Carmens kontrollerte fasit: 200-002 (fremskyndet mottak), 300-002 og 300-003 (nytt behov fra 200-002, lager 20), 300-005 (ledetid 13, Kanseller mottak) og meldingen for 200-001. Gi Carmen beskjed om at fila har nytt navn.
- Testeksempel 02 mangler et tilfelle for FR-9 der ingen enkelt ledetid er ≥ H (PRD §9 spm. 11), og en del med underdeler som står flere steder.
- Før/etter-sammenligningen (FR-20, SM-5) trenger testeksempel 03 med endret MPS (PRD §9 spm. 2).
