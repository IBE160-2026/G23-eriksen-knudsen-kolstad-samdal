# Story 1.8: Kontroll av arket Stykkliste

## 2026-11-24 kl. 20:14 — Idun-Samdal

### Oppgave
Idun ba om å starte på Story 1.8 (kontroll av arket Stykkliste) i `Idun/Branch`. Den gamle spesifikasjonen på `origin/story/1.8-kontroll-stykkliste` ble ikke brukt. Siden den ble skrevet er Story 1.5, 1.6, 1.7 og 1.9 flettet, så åpne spørsmål om lesing forbi rad 1001 og om hvor heltallsfunksjonen skulle bo, var alt avklart.

### Plan
- Lese akseptkriteriene, FR-3, valideringsfilene V-S01–V-S29 og V-G04 med README-en, og hvordan 1.9 koblet seg inn i `valider.ts` (en tom `validerStykkliste` som ventet på 1.8).
- Skrive reglene i en egen fil og la `valider.ts` bare kalle dem, så filen til Sebastian endres minst mulig.
- Tekstmaler i `nb.ts`, og tester mot filene og med `RaaArk` bygd i koden.

### Resultat
- **Ikke committet** (bare denne loggen er committet): `src/domene/valider-stykkliste.ts` (ny, reglene), `src/domene/celler.ts` (ny, felles tolkning av nivå, type, varenummer og celleplassering), `src/domene/valider.ts` (stubben byttet ut, og de dupliserte hjelperne flyttet til `celler.ts`), `src/tekster/nb.ts` (29 maler under `filfeilOgValidering.stykkliste`). Tester: `tests/validering/stykkliste.test.ts`, `tests/domene/valider-stykkliste.test.ts` og 36 nye maltester i `tests/tekster/nb.test.ts`. `typer.ts` er ikke endret.
- **Reglene:** alle 29 kodene for Stykkliste. Hver V-S-fil gir nøyaktig én feil med ark, sted, felt og kode som i README-en, V-G04 og testeksempel 01–05 gir 0 feil, og V-F05 gir nå alle tre feilene (D9, uke 3, B2). V-F06 hopper over ledetid når overskriften mangler.
- **Underdeler** bruker `Struktur` fra 1.7: `TYPE_KJOPES_INN_HAR_UNDERDELER` og `UNDERDELER_ULIKE` (stedet er første underdel i den avvikende forekomsten, og begge forekomstene står i `andreRader`).
- **Valg tatt underveis:**
  - Sløyfer (A under B og B under A) gir `VARENUMMER_UNDER_SEG_SELV`, samme kode som for en del rett under seg selv (V-S09), så `typer.ts` er uendret. Det løser punktet om sløyfer fra 1.7.
  - Underdelsreglene kjøres bare når nivå, varenummer, antall og type er gyldige i alle radene, og et tomt eller ugyldig antall gir bare antallsfeilen (ikke to feil). Det løser punktet om tomt antall fra 1.7.
  - Kolonner som `hoppesOver` sier mangler, gir ukjente verdier, så ingen regel bygger på dem. Det dekker også Sebastians punkt om `hoppetOver` for Varenummer og Nivå uten å endre 1.6.
  - Rader over 1000 telles, men kontrolleres ikke.
  - Feilene står i rekkefølgen de har i arket.
- **Endrede tester fra 1.9:** V-F05-testen tar nå med Stykkliste-feilen, og to tester i `valider-mps-og-mottak.test.ts` forutsatte at reglene var tomme (en fixtur la en underdel under en del som kjøpes inn, og en test sjekket at grensene *ikke* ble kontrollert).
- **Kontroll:** `npm test` 693 grønne (91 nye), `npm run lint`, `tsc -b` og `npm run build` grønne. Fem midlertidige brudd i reglene (sperren for underdeler, ledetid for ferdigproduktet, summering innenfor en forekomst, sammenligning mellom forekomster og sløyfedeteksjon) ble fanget av testene.

### Åpne punkter
- `lag_testdata.py` (linje 362–372) sammenligner underdeler som sorterte lister slik de står og kaster feil for ulike. Appen legger sammen en underdel som står to ganger rett under samme del, og regner `[X:1, X:1]` likt med `[X:2]`. Ingen testfil har et slikt tilfelle, men generatoren og FR-3 bør bruke samme regel.
- `UNDERDELER_ULIKE` peker på første underdel i den avvikende forekomsten (V-S22: rad 12). Står en senere forekomst med færre underdeler enn den første, peker den likevel på sin første underdel. Det er greit, men ikke avklart i FR-3.
- Hjelperne i `celler.ts` kan brukes av neste story som trenger nivå eller type (blant annet Story 2.x).
