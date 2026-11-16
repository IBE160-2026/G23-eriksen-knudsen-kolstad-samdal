---
title: Brukerreise v4 – avklaringer gruppen må godkjenne
status: forslag – ikke godkjent av gruppen
created: 2026-11-14
author: Carmen Kolstad
prototype: brukerreise-v4.html
---

# Brukerreise v4 – avklaringer

> **Forslag, ikke godkjent av gruppen.** Versjon 4 (`brukerreise-v4.html`) er versjon 3 med én forbedring: bestillingsforslagene deles i **Produksjon** og **Innkjøp**, og ukene kan åpnes og lukkes. Versjon 3 (`brukerreise-v3.html`) og versjon 2 står uendret til sammenligning. Avklaringene for versjon 3 (`brukerreise-v3-avklaringer.md`) gjelder fortsatt. PRD, EXPERIENCE.md, DESIGN.md og ordbanken er ikke endret.

**Åpne:** start serveren fra prosjektroten (`python3 -m http.server 8765 --bind 127.0.0.1`) og gå til <http://localhost:8765/.docs/planning-artifacts/ux/konsepter-2026-11-12/brukerreise-v4.html>. Kjør testeksempel 02 eller 03 under Prototypevalg for å se deler som produseres selv. I testeksempel 01 er ferdigproduktet det eneste som produseres.

## Hva som er endret fra versjon 3

- **Ukene kan åpnes og lukkes.**
  - Uke 1 («Bestill nå») er åpen fra start, de andre er lukket.
  - Ukeoverskriften viser antall produksjons- og innkjøpsforslag, og antall med forfalt mengde og deler som krever handling når det finnes.
  - «Åpne alle uker» og «Lukk alle uker» gjelder alle ukene på en gang.
  - Velger brukeren én uke i nedtrekkslisten (FR-17), vises bare den uken, og den er åpen.
- **En åpen uke har to grupper.** Hver gruppe har en diskret farge og et ikon:
  - **Produksjon** (petrol), med vare og antall.
  - **Innkjøp** (brun), med komponent, antall, forfalt mengde og eksepsjoner.
- **Klassifiseringen** er den samme som i PRD FR-17 og i dataene:
  - Komponent (Kjøpes inn) er innkjøp.
  - Ferdigvare og Komponent (Produseres selv) er produksjonsordre.

  Prototypen bruker den eksisterende funksjonen `art()` i `felles.js` og har ingen egne regler. Testen kontrollerer det mot typen i dataene for testeksempel 01 og 03:

  | Testeksempel | Produksjonsforslag | Innkjøpsforslag | Totalt |
  |---|---|---|---|
  | 01 | 10 (ferdigproduktet i hver uke) | 49 | 59 |
  | 03 | 23 | 27 | 50 |
- **Nøkkeltallene** er produksjonsforslag i uke 1, innkjøpsforslag i uke 1, forfalt mengde og deler som krever handling. Endringer kommer i tillegg ved sammenligning. Hvert tall går til det det gjelder.
- **Ordlyden** sier at dette er forslag:
  - «Forslag fra planen. Ingenting er bestilt eller satt i produksjon ennå.»
  - «foreslått satt i produksjon» og «foreslått bestilt hos leverandør».
  - Del-visningen sier «Foreslått innkjøp av …» eller «Foreslått produksjon av …».
- Klikk på en vare eller komponent åpner Del-visningen med beregningen, som i versjon 3.

## Avklaringer

| # | Avklaring | Forslag i v4 | Berører |
|---|---|---|---|
| 1 | Overskriftene «Produksjon» og «Innkjøp». PRD FR-17 kaller artene «innkjøp» og «produksjonsordre» | «Produksjon» brukes som gruppenavn, fordi det leses som en handling. Klassifiseringen er uendret | FR-17, ordbanken |
| 2 | Nye UI-ord «produksjonsforslag» og «innkjøpsforslag» (begge er bestillingsforslag i PRD-en) | Brukt i nøkkeltallene | Ordbanken: legges inn som undertyper av bestillingsforslag hvis v4 velges |
| 3 | Lukkede uker. FR-17 krever en liste over alle bestillingsforslag, sortert etter frigivelsesuke | Alle forslagene finnes i listen, og antallet står i hver ukeoverskrift. Bare uke 1 er åpen fra start. Gruppen må bekrefte at dette oppfyller FR-17 | FR-17, SM-3 oppgave 3 (les av mengde og uke) |
| 4 | Fire nøkkeltall i stedet for tre | Produksjon og innkjøp i uke 1 erstatter «bestillinger i uke 1». Forfalt mengde og «krever handling» er beholdt | EXPERIENCE.md |
| 5 | Farger for kategoriene: petrol for produksjon (samme som aksentfargen) og brun for innkjøp | Diskret: venstrekant, ikon og tall. Ikke de samme fargene som eksepsjonene | DESIGN.md (ny farge for innkjøp) |
| 6 | Rekkefølge i en uke: Produksjon før Innkjøp | Produksjon først, fordi det vanligvis er få linjer og ferdigproduktet står der | – |
| 7 | Del-visningen bruker «Foreslått innkjøp av …» og «Foreslått produksjon av …» i stedet for «Bestillinger for …» | Ja | FR-17, ordlyd |

## Hva som bare er prototype

Det samme som i versjon 3:

- Filen leses ikke, og ingenting beregnes.
- Alle tall er forhåndsdefinerte testdata fra fasitene, merket i den gule linjen og i kjøringslinjen.
- Eksporten og valideringsfeilene er demonstrasjoner.

Versjon 4 lagrer kjøringer under en egen nøkkel i nettleseren (`cosi-proto-v4-runs`).
