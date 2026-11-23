# Sebastian/Branch lik main

## 2026-11-23 kl. 17:55 — Sebastian

### Oppgave
Sebastian ba om at `Sebastian/Branch` skulle bli mest mulig lik main før han starter på stories. Valgt i økten: arkiver de gamle filene i en tagg og fjern dem, og behold Impeccable 4.9.0.

### Plan
- Sammenligne branchen med main. Branchen manglet 8 commits fra main (Story 1.1, avklaringene og Story 1.2), og hadde i tillegg UX 13.11, arkitektur-spinen 20.11 med reviews, `DESIGN.md` i rota, `.impeccable/config.json`, en eldre ordbank, Impeccable 4.9.0 og loggene. `technology.md` var slettet på branchen, men finnes i main.
- Kontrollere at ingen av loggene i `.logs/sebastian/` er nyere i main enn på branchen. Ingen var det.
- Tagg, så fletting av main der main sin versjon gjelder for alt unntatt `.logs/sebastian/` og Impeccable.

### Resultat
- Taggen `arkiv/sebastian-branch-2026-11-23` (c7752e1) er pushet. Den har branchen slik den var før, med UX 13.11 og spinen 20.11.
- ca06c02 «Gjør Sebastian/Branch lik main», pushet. Forskjellen mot main er nå bare `.logs/sebastian/` (loggene og `issues.md`) og Impeccable 4.9.0 i `.claude/`. Ordbanken, `technology.md`, Story 1.2 og CSP-vakten er hentet fra main. Tomme mapper er fjernet.
- Kontroll: `npm ci`, `npm test` 58/58, lint og build exit 0.
- Lukket fra issues: ryddingen av ordbanken på branchen, fordi branchen nå har ordbanken fra main.
- `story/1.5-les-excel` (lokal, fra main 89fed18) er ikke endret.

### Åpne punkter
- Main mangler loggene dine fra 13.–23.11 og Impeccable 4.9.0. Kan tas inn i main med en egen PR hvis branchen skal bli helt lik.
- `technology.md` (Pytagoras-siden, ikke COSI) ligger fortsatt i main og bør slettes der med en PR.
