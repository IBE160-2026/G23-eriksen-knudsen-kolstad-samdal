# Avklaringer i PowerPoint

## 2026-11-05 kl. 19:02 — Odawol

### Oppgave
Samle avklaringen om testeksempler, altså om hvert dokument bør ta for seg én testdel eller større deler, i en PowerPoint gruppen kan dele, med én avklaring per lysbilde. Gruppen skal kunne legge til flere.

### Plan
- Dele svaret opp i fire avklaringer med fast struktur: spørsmål, avklaring, begrunnelse og status.
- Lage et eget oppsett, «Avklaring», med felt for nye avklaringer. Et oversiktslysbilde og et lysbilde om hvordan man legger til en avklaring kommer i tillegg.
- Bygge med pptxgenjs og sjekke resultatet ved å eksportere lysbildene fra PowerPoint.

### Resultat
- `.docs/prosjektstyring/avklaringer.pptx` har 7 lysbilder: tittel, oversikt, avklaring 1–4 og «Slik legger du til en avklaring».
  1. Én fil per testeksempel, med ett formål per fil
  2. Valideringsfilene tester én regel per fil (38 filer: V-S, V-M og V-P)
  3. Dekningstabell og fasit i tabellform holdes oppdatert
  4. Nytt formål gir nytt testeksempel (fast partistørrelse blir 05)
- Alle avklaringene har status «Forslag», foreslått 2026-11-05 av Oda.
- Testet at et nytt lysbilde fra oppsettet «Avklaring» får alle 8 feltene.
- Ordbank: «Avklaring» og «Dekningstabell» lagt til.
- Commit `4af1c86` (ikke pushet). Byggeskriptet ligger bare i scratchpad og er ikke i repoet.

### Åpne punkter
- Gruppen må bekrefte avklaring 1–4 i `avklaringer.pptx`.
- Ordbanken definerer «Valideringstilfelle» som en fil med nøyaktig én feil, men V-F05 har tre feil og V-F06 to. Definisjonen bør justeres.
