# Sebastian/Branch lik main

## 2026-11-26 kl. 16:45 — Sebastian

### Oppgave
Hente siste versjon fra GitHub, bytte til `main` og oppdatere den, og så gjøre `Sebastian/Branch` lik `main` igjen, fordi den hang langt etter.

### Plan
- `git pull` på `story/1.9-kontroll-mps-mottak`, bytte til `main` og pulle.
- Rydde lokal `main` hvis pullen lager en unødvendig merge.
- Arkivere `Sebastian/Branch` i en tagg, sette den til `origin/main` og force-pushe med `--force-with-lease`, slik som 2026-11-23 (taggen `arkiv/sebastian-branch-2026-11-23`).

### Resultat
- `story/1.9-kontroll-mps-mottak` var allerede oppdatert. Story 1.9 er på main via PR #28 (`b635db8`). Nytt på main siden sist: PR #31 (1.4), #32 (1.13) og #34 (1.10).
- Lokal `main` hadde tre gamle merge-commits (PR #3, #8 og #9, blant annet `ebc62a7`) som ikke finnes i historikken til `origin/main`. Derfor laget `git pull` en merge (`33f9f3e`). Treet etter mergen var identisk med `origin/main`, så jeg kjørte `git reset --hard origin/main`. Lokal `main` er nå lik `origin/main` på `eeb021a`.
- `Sebastian/Branch` var 38 commits bak og 47 foran main. Det som lå foran var bare gammel historikk og logger fra 23.11. Jeg arkiverte den som taggen `arkiv/sebastian-branch-2026-11-26` (`9208582`, pushet), satte den til `origin/main` (`eeb021a`) og force-pushet med `--force-with-lease`.

### Åpne punkter
Ingen.
