# UX-utkast: EXPERIENCE.md

## 2026-11-15 kl. 21:59 — Odawol

### Oppgave
Oda ville sette Carmens og Sebastians UX-forslag opp mot hverandre og få notater til egen gjennomgang. Deretter ville hun begynne et eget UX-utkast i `Oda/Branch`: et helt nytt utkast bygget på den godkjente PRD-en, med struktur og flyt først. Den visuelle retningen tas senere, og utkastet skal gjennomgås sammen.

### Plan
- Sammenlignet forslagene ved å lese fra `origin/Carmen/Branch` og `origin/Sebastian/Branch` uten å merge (DESIGN.md, EXPERIENCE.md, README, vurdering og avstemming mot PRD-en). Sammenligningen og notatene ble gitt i chatten. Se også [gjennomgang-ux-forslag](988-2026-11-15-16-14-47-gjennomgang-ux-forslag.md).
- Avklarte med Oda: helt nytt utkast, utseendet senere, første utkast = struktur og flyt, et helt utkast som gjennomgås sammen.
- Leste PRD-en (final 13.11), «Innspill til UX» i addendumet og ordbanken, og kontrollerte eksempeltallene mot `testdata/fasit/testeksempel-01-tabell.csv`.

### Resultat
- Nytt utkast: `.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-15/EXPERIENCE.md`, med status «utkast – til gjennomgang med Oda». Innhold: grunnlag og prinsipper, skjermer og navigasjon (én resultatside med ankermeny i rekkefølgen fra PRD §4.4), startside, valideringsfeil, resultatsiden (bestillingsforslag med ukefilter, endringer, kritiske deler, resultattabell, forklaringspanel, kort om kapasitet og eksport), eksepsjonsmeldinger for alle fem typene, tilstander, UJ-1–UJ-5 gjennom skjermene, SM-3-oppgavene med klikkvei, forslag til introduksjon til brukertesten (PRD §9 nr. 4) og åtte åpne spørsmål.
- Ordbanken: lagt inn Startside, Resultatside, Kjøringslinje, Forklaringspanel og Ukefilter som forslag fra UX-utkastet, og `updated` er satt til 2026-11-15.
- Hverken utkastet eller ordbanken er committet. Begge venter på gjennomgangen med Oda.
- Gjennomgang med Oda: hun liker én resultatside med ankermeny og ukefilteret (notert i §10 nr. 1 og 4). Hun vil se alternativ A, der Endringer står etter Kritiske deler.
- Klikkbar skisse: `ux-designs/ux-COSI - MRP-2026-11-15/skisse-resultatside.html`. Den har startsiden med tre nummererte steg og valideringsfeil, og resultatsiden med nummererte seksjoner, bestillingsforslag gruppert per uke med ukefilter, kritiske deler, endringer, resultattabellen og forklaringspanelet. Knapper lar Oda bytte mellom utkastets rekkefølge og alternativ A, og mellom første kjøring og ny opplasting. Tallene er fra fasit-CSV-en for testeksempel 01. Kontrollert med en skjermdump i Chrome uten vindu.
- Ordbanken er committet i `Oda/Branch` (e111219) slik at gruppen kan gjennomgå de fem nye ordene. Den er ikke pushet og ikke på `main`.
- Oda syntes ukeoversikten ble for lang. Hun valgte en kompakt tabell: én liste uten ukebokser, uka i første kolonne, forfalt i egen kolonne og filteret på Uke 1. «Alle uker» blar i eget felt. Skissen og EXPERIENCE.md §5.1 og §10 nr. 4 er oppdatert. Nå vises Bestillingsforslag, Kritiske deler og Endringer på én skjerm (kontrollert med skjermdump).

### Åpne punkter
- Gå gjennom UX-utkastet sammen med Oda og avgjøre de åtte åpne spørsmålene i §10.
- Gruppen må godkjenne introduksjonen til brukertesten (utkastet §9, PRD §9 nr. 4) før prøvetesten rundt 27.11.
- De nye ordene i ordbanken (Startside, Resultatside, Kjøringslinje, Forklaringspanel, Ukefilter) må bekreftes av gruppen.
- Fasit-CSV-en for testeksempel 01 bruker 100-001 for ferdigproduktet, mens PRD-en bruker 100-002. Utkastet følger PRD-en.
- Oda skal vurdere alternativ A for plasseringen av Endringer i skissen og avgjøre §10 nr. 3.
- DESIGN.md (visuell retning) gjenstår til gruppen har valgt uttrykk.
