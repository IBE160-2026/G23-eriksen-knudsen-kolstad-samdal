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
- **Avklart senere samme dag:** Idun valgte å beholde lengste vei for lavnivåkoden, og gruppen godkjente at PRD-en sier tydelig at samme del flere ganger under samme overordnede del legges sammen. Rettet i epics.md (Story 1.7), PRD (ordlisten og FR-28, med `updated` 2026-11-23) og arkitektur kap. 12. Kommentaren i `typer.ts` linje 323 sier fortsatt «største nivåtall» og rettes i en egen PR. Endringene i disse dokumentene er ikke committet.

### Åpne punkter
- Stykklister der to deler står under hverandre (A under B og B under A) er gyldige etter FR-3 slik regelen står, men gir ingen beregningsrekkefølge. `byggStruktur` hopper over kanten og stopper, men valideringen (Story 1.8) bør avvise slike filer med en egen kode. Det krever en endring i `typer.ts` og dermed egen PR.

## 2026-11-24 kl. 17:55 — Idun-Samdal

### Oppgave
Pull request for Story 1.7 (#26) ble åpnet, og Sebastian la inn en gjennomgang. Idun ba om å sjekke kommentarene og rette det som hørte til i PR-en.

### Plan
- Rette testvakten, legge til manglende tester og rette dokumentene på branchen `story/1.7-stykklistestruktur`.
- Svare Sebastian på PR-en, og føre punktene som hører til Story 1.8 inn i `issues.md`.

### Resultat
- Branchen `story/1.7-stykklistestruktur` er pushet med to nye commits, `dc2756d` (tester) og `7ea4d9f` (dokumenter). `struktur.ts` er uendret.
- Testvakten leter nå etter bygging av `Struktur` i stedet for feltnavnet. Fire nye tester dekker lengste sti fra en senere overordnet del, lik ledetid, underdeler bare under en senere forekomst og rekkefølgen på alle testeksemplene. To midlertidige brudd i koden ble fanget av hver sin test.
- AD-6, rekkefølgen i endringsloggen og ordbanken er rettet.
- `npm test` (127 grønne), `npm run lint` og `npm run build` er grønne.
- Svar til Sebastian: https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/pull/26#issuecomment-7138302302. Idun sjekket også Story 1.6 (PR #25) og la inn to kommentarer der.
- Vitest feilet med «Cannot read properties of undefined (reading 'config')» når shellet gikk inn i mappen med `/c/Users/…`. Med `c:/Users/…` virker alt. Forskjellen er stor/liten bokstav i stasjonsbokstaven.

### Åpne punkter
- Story 1.8 må hoppe over underdelsreglene når antall er ugyldig, ellers kan en rad uten antall (`V-S13`) gi to feil, siden tomt antall blir 0 i `Forekomst.underdeler`.
- Hva som er «like» underdeler må avklares i FR-3 før 1.8: `byggStruktur` regner `[X:1, X:1]` likt med `[X:2]`, mens `lag_testdata.py` sammenligner listene som de står.
- Avgjør om sløyfer skal rapporteres av `Struktur` (krever endring i `typer.ts`) eller av en ny valideringskode i 1.8.
- Kommentaren i `typer.ts:323` sier «største nivåtall» og må rettes i egen PR.
