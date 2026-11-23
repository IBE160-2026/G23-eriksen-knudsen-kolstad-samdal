# Story 1.7: Stykklistestruktur

## 2026-11-23 kl. 20:35 — Idun-Samdal

### Oppgave
Idun ba om hjelp til å starte på Story 1.7 (`domene/struktur.ts`) i sin egen branch `Idun/Branch`, etter at Story 1.1 og 1.2 var hentet inn fra main. Story 1.8 skulle ikke være med.

### Plan
- Hente main inn i `Idun/Branch` (konflikt i `.docs/ordbank.md`, løst ved å beholde begge sider) og kjøre `npm install`.
- Lese akseptkriteriene i `.docs/planning-artifacts/epics.md` (Story 1.7), AD-6 i arkitekturen og FR-3, FR-5, FR-9, FR-28 og FR-31 i PRD-en.
- Lese stykklistene i testeksempel 01, 02 og 04 og fasit 04 (Materiell, Regler, Utregning) for å se hvordan delene skal telles.
- Skrive `byggStruktur` og tester fra fasitene, uten å endre `typer.ts`.

### Resultat
- **Nye filer** (ikke committet): `src/domene/struktur.ts` og `tests/domene/struktur.test.ts`. `typer.ts` er ikke endret.
- **`byggStruktur(rader)`** bygger `Struktur`: unike deler i stykklisterekkefølge, overordnede deler med antall, forekomster med underdeler per forekomst, lavnivåkode, ledetid fra ferdigproduktet med stien den kommer fra, antall per ferdigprodukt og beregningsrekkefølge.
- **Hvordan delene telles** (fra fasit 04):
  - En del som står to ganger under samme overordnede del, teller to ganger (200-012 og 200-013: 2 × frigivelsene til 100-003).
  - Underdeler teller én gang, enten de står likt under hver forekomst eller bare under én (300-024 og 300-025 under 200-012, 300-029 under 200-013).
- **Kontroll mot fasitene:** lavnivåkodene stemmer med kolonnen Lavnivåkode i Materiell i fasit 04. Ledetiden for 300-006 i testeksempel 01 er 10, 300-022 i testeksempel 04 er 12 (via Sete, 1 + 4 + 7), 300-005 i testeksempel 02 er 13, og eksempelet med L = 1, 4 og 5 gir 10 og 5. Skruesett M6 i testeksempel 02 er 6 per ferdigprodukt.
- **Testresultater:** `npm test` gir 82 grønne tester i 6 filer (26 er nye), `npm run lint` og `npm run build` er grønne.
- **Underveis:** en ny lokal branch ble laget ved en feil og slettet med en gang, uten commits. Story 1.8 ligger fortsatt bare på GitHub-branchen `story/1.8-kontroll-stykkliste` og er ikke rørt.

### Åpne punkter
- Lavnivåkoden er regnet som lengste vei i strukturen, ikke «største nivåtall delen står på» som i akseptkriteriene. Forskjellen vises bare i et sjeldent tilfelle (en del står på ..2 et sted og på .1 med underdeler et annet), der nivåtallet kan regne en underdel før delen over. Avviket må godkjennes og føres inn i arkitektur kap. 12 og i epics.md.
- Stykklister der to deler står under hverandre (A under B og B under A) er gyldige etter FR-3 slik regelen står, men gir ingen beregningsrekkefølge. `byggStruktur` hopper over kanten og stopper, men valideringen (Story 1.8) bør avvise slike filer med en egen kode. Det krever en endring i `typer.ts` og dermed egen PR.
- To like underdeler på rader rett under samme overordnede forekomst legges sammen (FR-5: summen over alle rader). PRD-en sier ikke tydelig at det er riktig. Bør bekreftes.
