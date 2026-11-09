# Brukerreiser gjennomgått

## 2026-11-05 kl. 14:34 — Sebastian

### Oppgave
Sebastian spurte om noe i PRD-stegene mangler ut over Finalize, særlig brukerreisene, og om vi hadde gått rask eller treg vei. Deretter ba han om å gå gjennom brukerreisene, slik at de blir fanget fra hans beskrivelse og ikke bare skrevet av Claude.

### Plan
- Sammenligne stegene i `bmad-prd` og PRD-malen med PRD-en og memlog. Funn: rask vei (2026-10-19), Discovery er dekket, brukerreisene er skrevet av Claude og aldri gjennomgått for seg, gruppa har ikke sett beslutningene, og PRD-en er lengre enn målet på 5–8 sider.
- Gå gjennom brukerreisene én om gangen: vise teksten, peke på det som ikke stemmer med kravene, la Sebastian fortelle, og skrive om. Tallene hentes fra testeksemplene (01, og 02 → 03 fra arket Sammenligning i fasit 03).
- Forrige økt: [prd-oppdatert-med-beslutninger](990-2026-11-05-13-28-51-prd-oppdatert-med-beslutninger.md).

### Resultat
- **Sebastians beskrivelse:** Kari får endringer fra kundene alle dager, også i helgene, og oppdaterer planen hver arbeidsdag. Hun kopierer forrige ukes fil. Etter en kjøring vil hun først se hva hun må bestille, deretter de kritiske delene. Hun bruker sammenligningen både til kontroll og til å se etter nye problemer. Ukeskiftet håndteres ikke spesielt.
- **Ny beslutning (valg A):** Appen husker siste kjøring **per ferdigprodukt**, med varenummeret på nivå 0 som nøkkel. Det erstatter tillegget i beslutning #15 om at et annet ferdigprodukt bare gir en melding. FR-19, FR-20, FR-21, §3, §4.5, §4.6, §7.1, §7.2 og §10 er endret.
- **§4.4:** Etter en kjøring vises bestillingsforslagene først, deretter sammendraget av kritiske deler og så resultattabellen.
- **Brukerreisene nummerert om:**
  - UJ-1 (ny): første gangs bruk.
  - UJ-2 (var UJ-1): daglig oppdatering.
  - UJ-3 (var UJ-2): ny kundeordre.
  - UJ-4 (var UJ-3): feil etter kopiering (V-P02, V-M02, antall som tekst).
  - Henvisningene i §4.1, FR-1, §4.4 og §4.8 er oppdatert.
- Addendum (lagring per ferdigprodukt, grensen for `localStorage`), ordbank (Før/etter-sammenligning) og beslutningsfila er oppdatert. `.memlog.md` har 9 nye linjer, med oversikt over gamle og nye UJ-numre.
- PRD-endringene er committet og pushet som 5860337.
- **Testdata:** Testeksempel 01 (Kontorstol Basic) har fått varenummer 100-002 og testeksempel 04 (Kontorstol Ergo) 100-003 på nivå 0 i `lag_testdata.py`. 02 og 03 beholder 100-001. `lag_testdata.py . --alle` ga helt like filer før endringen, og etter endringen er tall og eksepsjoner uendret. Bare varenummer og hensiktstekster er nye. Malen, 02, 03 og valideringsfilene er uendret. `testdata/README.md` er oppdatert, med ny linje for FR-19/FR-20 i dekningstabellen. Committet og pushet som d131c51.
- Merk: Eksempelet på arket Veiledning i malen (alle filer) bruker fortsatt «100-001 Kontorstol Basic». Det er bare et eksempel, og det er ikke endret, så malen fortsatt er identisk med `COSI-MRP-mal.xlsx` (FR-27).

### Åpne punkter
- ~~Testeksempel 01 og 04 må få egne varenumre på nivå 0.~~ Løst samme dag (d131c51).
- Eksempelet «100-001 Kontorstol Basic» på arket Veiledning i malen har samme navn som testeksempel 01 (100-002). Vurder å gi eksempelet et annet navn når malen likevel endres.
- Gi gruppa beskjed om endringene fra gjennomgangen av brukerreisene: lagring per ferdigprodukt, bestillingsforslag først, nye numre på brukerreisene.
