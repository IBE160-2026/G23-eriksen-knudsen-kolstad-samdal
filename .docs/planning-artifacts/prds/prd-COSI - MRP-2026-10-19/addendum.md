---
title: COSI - MRP PRD – Addendum
status: draft
created: 2026-10-19
updated: 2026-10-26
---

# Addendum til PRD

Bakgrunn og tekniske innspill fra PRD-arbeidet som hører hjemme i arkitekturen eller senere dokumenter, ikke i selve PRD-en. Ved avvik gjelder `prd.md`.

## Innspill til arkitekturen

- **Lokal lagring av siste kjøring (FR-19):** Uten innlogging og serverlagring er nettleserens lokale lagring (for eksempel `localStorage` eller IndexedDB) det naturlige stedet. Arkitekturen bør velge og begrunne. En kjøring med 1000 rader i stykklisten og 12 uker er liten nok for begge.
- **Beregning skilt fra resten (NFR-1):** Beregningen bør være en ren funksjon med inndata (stykkliste, MPS, planlagte mottak) og utdata (resultattabell, eksepsjoner). Excel-lesing, lagring og visning kaller den. Da kan testene bruke fasiten direkte.
- **Samme beregning for fasit og app:** `testdata/lag_testdata.py` inneholder en referanseberegning (`beregn`). Appen bør ikke importere skriptet. Testene skal sammenligne med fasitfilene, som er kontrollert for hånd, ikke med skriptet.
- **Valideringsreglene (FR-3)** er de samme som datavalideringen og Kontroll-formlene i `lag_testdata.py` (`lag_mal` og `kontroll`). Endres malen, må begge oppdateres.
- **Flernivå beregning (FR-5, FR-28):** Stykklisten leses som en liste av rader der overordnet del er nærmeste rad over med ett nivå høyere. Bygg en graf fra varenummer til overordnede varenumre med antall, regn ut lavnivåkoden per varenummer og beregn delene sortert etter lavnivåkode. `beregn` i `lag_testdata.py` er foreløpig bare enkeltnivå og må utvides før fasiten for testeksempelet med tre nivåer kan lages.
- **Lesing av Excel-malen:** Nivå er lagret som tekst (`0`, `.1`, `..2`), og Excel kan ha lagret `0` som tall. Varenummer kan også være lagret som tall hvis brukeren har skrevet bare sifre. Les begge som tekst. Malen har formler i hjelpekolonnene og ferdige, tomme rader med formatering helt ned til rad 1001, så slutten på tabellen er første rad uten nivå og varenummer.
- **Eksport (FR-22):** Et Excel-bibliotek for skriving trengs. Det kan være det samme som brukes til lesing.
- **Tekster samlet (NFR-7):** Meldinger og etiketter bør ligge samlet, så engelsk kan legges til uten å endre beregningen.

## Bakgrunn for valg i PRD-en

- **Rask vei:** PRD-en er skrevet på rask vei 2026-10-19 med alt tilgjengelig materiale som bestemt. Gruppen går gjennom den på et møte og kan bruke coaching-veien senere ved store endringer.
- **Eksport i v1:** Sebastian ønsket at brukeren skal kunne lagre resultatet selv. Det dekker også behovet for å ta vare på flere kjøringer uten brukerkontoer.
- **Forfalte frigivelser:** Bestemt 2026-10-19. De legges i uke 1 sammen med vanlige frigivelser, og meldingen oppgir hvor mye som er forfalt. Forfalte ordremottak vises i uken behovet er (regel 6 og 7 i fasiten).
- **Språk:** Norsk i v1, deretter engelsk, så flere språk på lengre sikt.
- **Flernivå BOM i v1 (2026-10-26):** Briefen flyttet flernivå BOM inn i v1 2026-10-22. Malen har tre nivåer (0, .1, ..2), slik testeksempelet i briefen krever. Ferdigproduktet beregnes med full MRP, slik at lager, sikkerhetslager og ledetid på nivå 0 får betydning. Med 0 i alle tre blir resultatet det samme som når MPS ganges rett inn i nivå .1.
- **Typer:** Ferdigvare, Komponent (Kjøpes inn) og Komponent (Produseres selv). Delmontering og råvaretypene ble fjernet 2026-10-26, fordi de ikke endrer beregningen og gjorde listen lengre enn nødvendig.
- **Ingen innliming:** Excel kan ikke hindre innliming uten makroer, og malen skal være en vanlig `.xlsx`. Derfor står regelen i Veiledning, Kontroll-kolonnen fanger ugyldige nivåer og typer, og appen validerer alt på nytt (FR-3).
