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

### Oppfølging samme kveld: OneNote i stedet for PowerPoint
- Oda ville heller ha OneNote. Notatblokken «COSI - MRP G23» er opprettet i OneDrive (`C:\Users\odawk\OneDrive\Dokumenter\OneNote Notebooks\COSI - MRP G23`) med seksjonen Avklaringer. Den har 6 sider: Oversikt, Avklaring 1–4 og «Mal: ny avklaring». Hver avklaring har en statustabell, spørsmål, avklaring, begrunnelse, underlag og kommentarer fra gruppen.
- Laget med OneNote-COM. Sidene er kontrollert ved å eksportere dem til PDF.
- `avklaringer.pptx` er fjernet fra repoet (`b37c946`). Den finnes i git-historikken (`4af1c86`). Ordbankens «Avklaring» viser nå til OneNote.

### Åpne punkter
- Gruppen må bekrefte avklaring 1–4 i OneNote (seksjonen Avklaringer).
- Ordbanken definerer «Valideringstilfelle» som en fil med nøyaktig én feil, men V-F05 har tre feil og V-F06 to. Definisjonen bør justeres.
