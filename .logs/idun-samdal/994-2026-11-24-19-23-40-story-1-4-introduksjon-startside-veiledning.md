# Story 1.4: Introduksjonsside, startside og Veiledning

## 2026-11-24 kl. 19:23 — Idun-Samdal

### Oppgave
Idun ba om å gå videre til Story 1.4 (Introduksjonsside, startside og Veiledning) i `Idun/Branch`, etter at Story 1.1, 1.2, 1.3, 1.5, 1.6 og 1.7 var hentet inn fra main.

### Plan
- Lese akseptkriteriene (`epics.md`, Story 1.4), UX-DR6, UX-DR7 og UX-DR31, EXPERIENCE.md og DESIGN.md, og tekstene og utseendet i prototypen v3.
- Fylle plassholderne fra Story 1.3 for Introduksjon, Ny kjøring og Veiledning, med all tekst i `nb.ts` og stilen i en egen CSS-fil.
- Skrive enhetstester og e2e-tester, og kontrollere sidene med skjermbilder.

### Resultat
- **Ikke committet** (bare denne loggen er committet): `src/tekster/nb.ts` (tekster under `felles`), `src/ui/introduksjon/Introduksjon.tsx`, `src/ui/ny-kjoring/NyKjoring.tsx`, `src/ui/veiledning/Veiledning.tsx`, `src/ui/felles/sider.css` (ny) og én importlinje i `src/main.tsx`. Nye tester: `tests/ui/sider.test.ts` og `e2e/sider.spec.ts`. Endrede tester: `tests/ui/visninger.test.ts`, `e2e/appskall.spec.ts` og `e2e/oppstart.spec.ts`.
- **Introduksjon:** flate med overskriften «Hele produksjonsplanen. Én Excel-mal.» (40 px, andre linje i accent), to avsnitt, primærknappen «Kom i gang» til `#/ny-kjoring` og de tre stegene i tre bokser.
- **Ny kjøring:** h1, setningen om ett ferdigprodukt per fil rett under, og tre nummererte kort. Det første har «Last ned Excel-malen» og «Last ned testeksempel 01» som vanlige lenker med `download` til filene i `public/`. Kort 2 og 3 har bare overskrift og en kort tekst. Opplastingssonen og valget av beregning kommer i Story 1.11.
- **Veiledning:** seks nummererte overskrifter, brødtekst, en liste over seksjonene i resultatet og primærknappen «Til Ny kjøring» nederst.
- **Tester:** `npm test` 352 grønne (11 nye), `npm run lint` og `npm run build` grønne, `npm run test:e2e` 64 grønne i Chromium og Firefox (14 nye). Skjermbilder av alle tre sidene ved 1366 × 630 og av introduksjonen ved 390 px ble sett over.
- **Funn underveis:** ved 320 px rullet siden sideveis, fordi ordet «produksjonsplanen.» i 40 px-overskriften er for bredt. Rettet med `clamp(26px, 9vw, 40px)` og `overflow-wrap: anywhere` under 900 px.
- **Endring i Story 1.3-testene:** introduksjonssiden har ikke lenger h1 «Introduksjon». Menyvalget og sidetittelen heter fortsatt Introduksjon. De tre testfilene som lette etter h1 «Introduksjon», er rettet.

### Åpne punkter
- Gruppen må se over tekstene i `nb.ts`. Introduksjon og Ny kjøring er fra prototypen v3 (Carmen). Veiledning er tilpasset beslutningene 22.11 (uten Ukeplan). Teksten i kort 2 og 3 på Ny kjøring er ny og midlertidig til Story 1.11. Veiledning beskriver seksjonene i resultatet, som bygges i Epic 2.
- Overskriften på Introduksjon er endret fra «Introduksjon» til designets overskrift. Bekreft at det er riktig, siden Story 1.3 hadde menynavnet som h1.
- Tekstene ligger under `felles` i `nb.ts`. Det kan gi flettekonflikter hvis Story 1.11 legger til startsidetekster samme sted. Avtal om startsiden skal få en egen seksjon.
- Ordbanken er ikke oppdatert med nye begreper, siden siden bare bruker ord som allerede står der. Sjekk ved gjennomgang.
