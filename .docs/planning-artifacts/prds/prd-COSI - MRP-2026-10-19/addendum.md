---
title: COSI - MRP PRD – Addendum
status: draft
created: 2026-10-19
updated: 2026-10-19
---

# Addendum til PRD

Bakgrunn og tekniske innspill fra PRD-arbeidet som hører hjemme i arkitekturen eller senere dokumenter, ikke i selve PRD-en. Ved avvik gjelder `prd.md`.

## Innspill til arkitekturen

- **Lokal lagring av siste kjøring (FR-19):** Uten innlogging og serverlagring er nettleserens lokale lagring (for eksempel `localStorage` eller IndexedDB) det naturlige stedet. Arkitekturen bør velge og begrunne. En kjøring med 500 komponenter og 12 uker er liten nok for begge.
- **Beregning skilt fra resten (NFR-1):** Beregningen bør være en ren funksjon med inndata (ferdigprodukt, MPS, komponenter, planlagte mottak) og utdata (resultattabell, eksepsjoner). Excel-lesing, lagring og visning kaller den. Da kan testene bruke fasiten direkte.
- **Samme beregning for fasit og app:** `testdata/lag_testdata.py` inneholder en referanseberegning (`beregn`). Appen bør ikke importere skriptet. Testene skal sammenligne med fasitfilene, som er kontrollert for hånd, ikke med skriptet.
- **Valideringsreglene (FR-3)** er de samme som datavalideringen i `lag_testdata.py` (`lag_mal`). Endres malen, må begge oppdateres.
- **Eksport (FR-22):** Et Excel-bibliotek for skriving trengs. Det kan være det samme som brukes til lesing.
- **Tekster samlet (NFR-7):** Meldinger og etiketter bør ligge samlet, så engelsk kan legges til uten å endre beregningen.

## Bakgrunn for valg i PRD-en

- **Rask vei:** PRD-en er skrevet på rask vei 2026-10-19 med alt tilgjengelig materiale som bestemt. Gruppen går gjennom den på et møte og kan bruke coaching-veien senere ved store endringer.
- **Eksport i v1:** Sebastian ønsket at brukeren skal kunne lagre resultatet selv. Det dekker også behovet for å ta vare på flere kjøringer uten brukerkontoer.
- **Forfalte frigivelser:** Bestemt 2026-10-19. De legges i uke 1 sammen med vanlige frigivelser, og meldingen oppgir hvor mye som er forfalt. Forfalte ordremottak vises i uken behovet er (regel 6 og 7 i fasiten).
- **Språk:** Norsk i v1, deretter engelsk, så flere språk på lengre sikt.
