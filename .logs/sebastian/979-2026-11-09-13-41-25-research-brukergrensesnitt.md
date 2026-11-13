# Research: brukergrensesnitt

## 2026-11-09 kl. 13:41 — Sebastian

### Oppgave
Sjekke om noe manglet å committe, og deretter committe og pushe det. Det som lå igjen, var UI-researchen «Brukergrensesnitt for COSI MRP» (rapport og fire notater) og en loggcommit som ikke var pushet.

### Plan
- Gå gjennom `git status` og upushede commits.
- Committe rapporten og notatene, logge økten og pushe `Sebastian/Branch`.

### Resultat
- Commit `e9fcfc7` på `Sebastian/Branch`:
  - `.docs/planning-artifacts/research/reports/Brukergrensesnitt for COSI MRP.md`
  - `.docs/planning-artifacts/research/research_notes/Brukergrensesnitt for COSI MRP/` (design-systemer-og-layout, eksepsjoner-forklaring-sammenligning, mrp-tabell-og-datagrid, opplasting-validering-tilgjengelighet)
- Rapporten anbefaler en rolig arbeidsflate i PRD-ens faste rekkefølge, et ikke-modalt forklaringspanel, en egen semantisk MRP-tabell og shadcn/ui, med DESIGN.md fra Impeccable.
- Pushet sammen med `7d950c2` (logg for impeccable-skill).
- Researchen ligger i `reports/` og `research_notes/`, ikke i en datert mappe slik som tidligere research (`academic-lit-…-2026-11-02/`).

### Åpne punkter
- Vurder rapportens valgfrie innspill i UX-steget: terskler for eksepsjoner, «flyttet» som egen endringstype i sammenligningen, kritiske deler sortert øverst og faner som skjuler kapasitetspanelet. Alle går lenger enn PRD-en eller strider mot den.
