# Merge main: vedtatt arkitektur og felles UX

## 2026-11-22 kl. 23:16 — Sebastian

### Oppgave
Hente det siste fra GitHub og merge `main` inn i `Sebastian/Branch`, slik at grenen bygger på arkitekturen og UX-dokumentene gruppa har vedtatt.

### Plan
- `git pull` på `Sebastian/Branch`. Grenen var allerede à jour, men `main` hadde 5 nye commits.
- `git merge origin/main` og løs konfliktene.

### Resultat
- Merge-commit `2df41ad` på `Sebastian/Branch`, pushet til `origin` (`bce4ffb..7fddb85`).
- Fra `main`: vedtatt arkitektur 22.11 (`architecture-COSI - MRP-2026-11-22-vedtatt/`, `bc2615d`), felles `DESIGN.md`, `EXPERIENCE.md` og `kilder.md` (`ux-COSI - MRP-2026-11-22/`, PR #17) og ni UI-ord i ordbanken (PR #18).
- Konflikten i `.docs/ordbank.md` gjaldt raden Seksjonsmeny. Versjonen fra `main` ble beholdt, så «navigasjonsrad» står nå under «Ikke bruk» for Appmeny og ikke for Seksjonsmeny. De nye radene fra `main` (Appmeny til Statusmelding) er med.

### Åpne punkter
Ingen.

## 2026-11-22 kl. 23:19 — Sebastian

### Oppgave
Ny `git pull` og merge av `main` inn i `Sebastian/Branch`.

### Plan
- `git pull`: grenen var à jour, `main` hadde én ny commit (`de99c44`).
- `git merge origin/main`.

### Resultat
- Merge-commit `83f65be` uten konflikter. Den er ikke pushet.
- Fra `main` (`de99c44`): PRD FR-3, addendum, EXPERIENCE.md, arkitekturen og ordbanken oppdatert etter den vedtatte arkitekturen.

### Åpne punkter
Ingen.
