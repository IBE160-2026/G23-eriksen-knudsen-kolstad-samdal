# Testeksempel 02: fasit med arket Materiell

## 2026-10-28 kl. 20:52 — Carmen Kolstad

### Oppgave
Legge fila `eksempel testeksempel-02-fasit.xlsx` fra Nedlastinger inn på `Carmen/Branch`, slik at resten av gruppen får tilgang til den.

### Plan
- Kopiere fila til en egen mappe i scratchpad og kontrollere den: ingen makroer eller eksterne lenker, og innholdet sammenlignet med `testdata/testeksempel-02-fasit.xlsx`.
- Carmen valgte plassering (egen fil i `testdata/`) og commit med push.

### Resultat
- Arkene Regler, Fasittabell, Eksepsjoner og Utregning er celle for celle identiske med `testdata/testeksempel-02-fasit.xlsx` på branchen. Det nye arket **Materiell** viser varenummer, beskrivelse og lavnivåkode for alle åtte varene.
- Lagt inn som `testdata/testeksempel-02-fasit-med-materiell.xlsx`, uendret og byte-identisk med fila i Nedlastinger. Den genererte fasiten er ikke endret.
- Commit `02f91e8` («Testdata: fasit for testeksempel 02 med arket Materiell») inneholder bare denne fila. Den er pushet til `origin/Carmen/Branch` med `git push origin HEAD:refs/heads/Carmen/Branch`, fordi `git push origin Carmen/Branch` ikke finner branchen: macOS lagrer den lokalt som `carmen/Branch`.

### Åpne punkter
- Fila bruker de gamle typene (Delmontering, Råvare (Kjøpes inn)) i Regler og Utregning, som resten av testdataene på branchen. Den lages ikke av `lag_testdata.py` og må oppdateres for hånd når testdataene går over til de nye typene.

## 2026-10-29 kl. 20:09 — Carmen Kolstad

### Oppgave
Kopiere `testdata/testeksempel-02.xlsx` og `testdata/testeksempel-02-fasit-med-materiell.xlsx` uendret fra `Carmen/Branch` direkte til `main`, uten å merge resten av branchen og uten ny branch eller pull request.

### Plan
- Hente `origin/main` og kontrollere at ingen av filene fantes der fra før.
- Sammenligne formatet med malen på `main` og med Odas testeksempel 02 i nytt format.
- Committe filene alene oppå `origin/main` i en midlertidig arbeidsmappe og pushe direkte til `origin/main`.

### Resultat
- **Formatforskjeller:**
  - Arket heter `Prognostiserte behov`, ikke `MPS`.
  - Type-nedtrekket har seks typer.
  - Type på 200-001 Sete og 200-002 Rygg er Delmontering, og på 300-003 Ryggtrekk Råvare (Kjøpes inn).
  - Øvrige data er like med Odas versjon i nytt format.
  - I fasiten er Fasittabell og Eksepsjoner like. Bare 3 tekstrader i Regler og 3 i Utregning har de gamle typenavnene.
- **Ingen konflikt på `main`:** Filene fantes ikke der fra før, og ingen kode på `main` leser dem.
- **Commit og push:** Commit `9e6ad38` («Testdata: testeksempel 02 og fasit med arket Materiell») inneholder bare de to filene, begge nye. Den er pushet til `origin/main` (`32c5eb9..9e6ad38`), og blob-ID-ene er like med `02f91e8`. Filene er bekreftet på GitHub via API-et.
- **Opprydding:** Den midlertidige arbeidsmappen og den lokale branchen `Carmen/testeksempel-02` er fjernet. Branchen ble aldri pushet.

### Åpne punkter
- Testeksempel 02 på `main` har arket `Prognostiserte behov` og gamle typer. En app bygd etter malen (arket `MPS`) vil ikke kunne lese fila.
- Odas branch har en egen `testdata/testeksempel-02.xlsx` i nytt format. Dette gir en konflikt på samme filnavn når Odas testdata skal inn i `main`, og gruppen må velge versjon.
- `testdata/README.md` på `main` beskriver ikke testeksempel 02.
