# Story 1.13: Lys og mørk visning

## 2026-11-24 kl. 19:55 — Idun-Samdal

### Oppgave
Idun ba om å starte på Story 1.13 (lys og mørk visning) i `Idun/Branch`, etter at Story 1.4 var flettet inn i main. Idun godkjente to valg: en ekstern fil `public/visning.js` for å unngå blinking uten inline-skript, og et eget `accent-hover`-token.

### Plan
- Lese akseptkriteriene for 1.13, AD-1 og AD-10, DESIGN.md (mørke farger og kontrasttabell) og Carmens punkter fra gjennomgangen av 1.4.
- Regne ut kontrasten for parene DESIGN.md ikke hadde regnet ut, i begge visningene.
- Legge mørke tokens i `tokens.css`, nøkkelen `cosi-mrp:visning` i `lagring/`, knappen i appmenyen og skriptet som setter visningen før første tegning.
- Skrive enhetstester og e2e-tester, og se mørk visning i nettleseren.

### Resultat
- **Ikke committet** (bare denne loggen er committet): `src/ui/felles/tokens.css` (mørkt fargesett og `--accent-hover`), `src/lagring/lagrede-kjoringer.ts` (`NOKKEL_VISNING`, `lesVisning`, `lagreVisning`), `src/app/visning.ts` (ny), `src/ui/appmeny/Appmeny.tsx` og `app.css` (knappen nederst), `src/tekster/nb.ts` («Bytt til mørk» og «Bytt til lys»), `public/visning.js` (ny) og `index.html`, `src/ui/felles/sider.css` (hover på primærknappen). Dokumenter: DESIGN.md (`accent-hover`, kontrasttabellen) og arkitekturen (AD-10 og kap. 12).
- **Kontrast:** alle parene som manglet, består AA i begge visningene. Eneste feil var tekst på primærknappen ved hover i mørk visning (`summary-hover`, 1,4:1). Rettet med eget `accent-hover` (lys `#0A4B5A`, mørk `#7BC4D4`, 9,7:1 og 9,0:1). Tabellen i DESIGN.md er utvidet med 14 rader.
- **Tester:** `npm test` 552 grønne (83 nye, blant annet `tests/ui/tokens.test.ts` som sjekker at begge visningene har samme variabler, at verdiene stemmer med DESIGN.md, kontrasten for 31 par i begge visningene og at ingen komponent-CSS har fargeverdier). `npm run lint` og `npm run build` grønne, `npm run test:e2e` 78 grønne i Chromium og Firefox (14 nye i `e2e/visning.spec.ts`: bytte, omlasting, ingen blinking, tastatur og blokkert lagring). Tre midlertidige brudd i tokenene ble fanget av testene.
- **Endret test fra Story 1.3:** sjekken av at appmenyen ikke strekkes under 900 px, bruker nå bunnen av den nye knappen i stedet for siste menyvalg.
- Mørk visning er sett i skjermbilder av Introduksjon og Ny kjøring ved 1366 × 630.

### Åpne punkter
- `public/visning.js` er et unntak fra regelen i AD-10 om at bare `lagring/` bruker `localStorage`. Det er ført inn i AD-10 og kap. 12, men gruppen bør se på det.
- `accent-hover` er et nytt token i DESIGN.md. Gruppen bør vite om det.
- Resultatsiden, tabellene, panelene og eksepsjonsmarkørene finnes ikke ennå. Mørk visning må kontrolleres på dem når de bygges i Epic 2, og kontrasttesten bør få med nye par som kommer til.
- Teksten «Bytt til mørk» og «Bytt til lys» er ny og bør ses over av gruppen. Knappen sier ikke fra til skjermleseren utover at navnet endres.
