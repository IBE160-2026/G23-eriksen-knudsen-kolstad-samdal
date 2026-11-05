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
- Ikke committet ved loggføring.

### Åpne punkter
- Testeksempel 01 og 04 bruker samme varenummer på nivå 0 (100-001) som 02 og 03, men er andre produkter. De må få egne varenumre (f.eks. 100-002 og 100-003) i `lag_testdata.py`, og fasitene må lages på nytt. Da kan lagring per ferdigprodukt (FR-19) testes.
- Gi gruppa beskjed om endringene fra gjennomgangen av brukerreisene: lagring per ferdigprodukt, bestillingsforslag først, nye numre på brukerreisene.
