# PRD-sammenligning mellom grenene

## 2026-11-05 kl. 16:30 — Sebastian

### Oppgave
Sebastian ville ha en kort oppsummering av hvordan hans PRD skiller seg fra PRD-ene på de andre grenene: detaljnivå, hvor langt de er kommet og de største forskjellene. Han ba så om en enkel side å vise på gruppemøtet.

### Plan
- Hente alle grenene, finne PRD-filene og sammenligne status, lengde, krav, testbarhet og eksepsjoner.
- Publisere en enkel side som privat Artifact.
- Forrige økt: [prd-finalize-uten-final](988-2026-11-05-16-17-25-prd-finalize-uten-final.md).

### Resultat
- **Carmen og Oda:** `prd-COSI - MRP-2026-10-19/prd.md` på `origin/Carmen/Branch` og `origin/Oda/Branch` er Sebastians første utkast fra 19.10 (commit 715034d).
- **Carmen** har i tillegg sitt eget `prd-carmen-utkast.md` (27.10, ca. 9 300 ord, FR-01–26, NFR-01–12). Det er skrevet før research og har fire eksepsjonstyper. Lagring, sammenligning og eksport står som tillegg.
- **Idun** har `prd-COSI - MRP-2026-11-04/prd.md` (04.11, ca. 1 300 ord, coaching-veien). Det har ingen nummererte krav. Ny idé: produksjonskapasitet fra lager, med eget panel og graf for prognostiserte behov.
- **Oda** har ingen egen PRD.
- **Møtesiden** er publisert som privat Artifact: https://claude.ai/artifact/83NFSnwVy3SsTA9hpZK321. Den må deles fra Share-menyen for at gruppa skal kunne åpne den.
- Ingen filer i repoet er endret.

### Åpne punkter
- Venter på beslutningene fra gruppemøtet: Iduns produksjonskapasitet i v1 eller senere, Carmens ekstra NFR-er, byggerekkefølgen og brukertesten (SM-3). Deretter føres de inn, PRD-en settes til `status: final` og merges til `main`. Dette står allerede i `issues.md`.

## 2026-11-05 kl. 18:00 — Sebastian

### Oppgave
Sebastian ville ha en kort oppsummering av de viktigste endringene fra første utkast av product brief til den nyeste PRD-en på sin gren, lagt inn på samme møteside.

### Plan
- Bruke første ferdige brief (13.09, commit a022614) og `prd.md` slik den står på `Sebastian/Branch` (05.11).
- Legge en ny seksjon på møtesiden, mellom «Største forskjeller» og «Til avgjørelse på møtet».

### Resultat
- Ny seksjon «Fra første product brief til PRD-en nå» med sju punkter: flernivå BOM i v1, fem navngitte eksepsjoner, sammenligning/lagring/eksport i v1, forklaringer og bestillingsforslag, fast partistørrelse som planlagt utvidelse, nummererte krav og testeksempel 01–04, tekniske rammer og frist. En merknad om byttede begreper.
- Ingressen og kildelisten er oppdatert. Siden er publisert på nytt til samme adresse (versjon 2): https://claude.ai/artifact/83NFSnwVy3SsTA9hpZK321. Den er nå delt med alle som har lenken.
- Ingen filer i repoet er endret.

### Åpne punkter
Ingen.
