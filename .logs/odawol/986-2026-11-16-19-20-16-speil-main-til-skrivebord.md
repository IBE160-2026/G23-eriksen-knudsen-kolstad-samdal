# Speil main til skrivebord

## 2026-11-16 kl. 19:20 — Odawol

### Oppgave
Lage en mappe på skrivebordet som automatisk holdes oppdatert med alt som ligger i `main`, slik at innholdet kan lastes opp når prosjektet skal diskuteres med ChatGPT.

### Plan
- Skript utenfor repoet som henter `origin/main` (`git fetch`) og eksporterer med `git archive` (uten `.git`-mappa).
- Eksporterer bare når `main` har fått en ny commit (sammenligner med commit-hashen i `_SIST_OPPDATERT.txt`).
- Lager både en mappe og en zip, siden ChatGPT tar imot zip-filer.
- Planlagt oppgave i Windows kjører skriptet ved pålogging og hvert 30. minutt.

### Resultat
- Skript: `C:\Users\odawk\Scripts\sync-ibe160-main.ps1` (`-Force` eksporterer på nytt). Logg: `C:\Users\odawk\Scripts\sync-ibe160-main.log`.
- Planlagt oppgave: «IBE160 - speil main til skrivebord» (ved pålogging + hvert 30. min, skjult vindu).
- Resultat på skrivebordet (OneDrive): mappa `IBE160 - main` (461 filer + `_SIST_OPPDATERT.txt`) og `IBE160 - main.zip` (ca. 7 MB).
- Testet: kjørt manuelt og via oppgaveplanleggeren (resultatkode 0). Eksporten tilsvarer `main` på `d5482d7`.
- Ingen endringer i repoet bortsett fra denne loggen.

### Åpne punkter
- `.claude/` (305 skill-filer) og `_bmad/` er med i eksporten og kan være støy for ChatGPT. Vurder å filtrere dem bort.
- Mappa oppdateres bare når PC-en er på og `git fetch` mot GitHub virker. Feil skrives i `sync-ibe160-main.log`.
