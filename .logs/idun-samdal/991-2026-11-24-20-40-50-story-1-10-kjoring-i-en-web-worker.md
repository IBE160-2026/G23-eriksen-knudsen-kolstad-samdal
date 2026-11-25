# Story 1.10: Kjøring i en Web Worker

## 2026-11-24 kl. 20:40 — Idun-Samdal

### Oppgave
Idun ba om å se på og så starte på Story 1.10 (kjøring i en Web Worker) i `Idun/Branch`. Idun godkjente tre valg: `kjoring.ts` gir `Kjoring` til tilstanden og navigerer selv ved gyldig svar (med parametre, så den kan testes), `resultat` og `kapasitet` er `null` til Epic 2 og 5, og `lagring` har en midlertidig verdi til lagring er bygd.

### Plan
- Lese akseptkriteriene, AD-12 og AD-5, og avgrense mot Story 1.11 (opplasting, Beregn-knapp og statusmeldinger).
- Skrive worker-en, meldingstypene og styringen, og teste worker-logikken med de ekte filene og styringen med en falsk worker og falske tidtakere.
- Kontrollere i nettleseren at bygget lager worker-filen, at CSP-en tillater den, og at SheetJS virker inne i den.

### Resultat
- **Ikke committet** (bare denne loggen er committet): `src/worker/meldinger.ts` (meldingstypene og `erWorkerSvar`), `src/worker/kjor.ts` (det worker-en gjør, som ren funksjon), `src/worker/beregning.worker.ts` (selve worker-en), `src/app/kjoring.ts` (styringen), og `kjorer` lagt til i `TilstandKontekst` (`tilstand-handlinger.ts` og `tilstand.tsx`), så 1.11 henter den med `useTilstand()`. `src/worker/.gitkeep` er fjernet. `typer.ts` er ikke endret.
- **Styringen:** én kjøring om gangen (`OPPTATT` ved nytt kall), 30 sekunder tidsgrense med `terminate()`, `error`, `messageerror` og et svar den ikke forstår gir uventet feil. Ved gyldig svar lages `Kjoring` (tidspunktet settes i styringen), den gis til tilstanden, og appen går til `#/resultat`. Feil gis tilbake som en verdi (`VALIDERINGSFEIL`, `FILFEIL`, `UVENTET_FEIL`), så 1.11 kan vise dem.
- **Midlertidig:** `resultat` og `kapasitet` er `null`, og `lagring` er `IKKE_LAGRET_BLOKKERT` (`IKKE_LAGRET_BARE_KAPASITET` for bare kapasitet) til lagring av kjøringer er bygd i Epic 4 (Story 4.1).
- **Tester:** `npm test` 795 grønne (stabilt i tre kjøringer, 59 nye), `npm run lint`, `tsc -b` og `npm run build` grønne, `npm run test:e2e` 88 grønne i Chromium og Firefox (10 nye i `e2e/worker.spec.ts`, som starter den ekte worker-filen fra bygget med ekte filer under CSP-vakten). Bygget lager `beregning.worker-*.js` (380 kB inkludert SheetJS), som bare lastes når en kjøring starter.
- **Mutasjonskontroll:** fem midlertidige brudd i styringen (nytt kall avvises ikke, worker stoppes ikke, tidtakeren stoppes ikke, sperren mot dobbel avslutning, `messageerror` ignoreres) fanges av testene. Det siste fanges først etter at en test for en gammel tidtaker ble lagt til.
- **Underveis:** en test med en løkke over alle valideringsfilene gikk av og til over 5000 ms (samme feil som PR #30). Den er byttet til én test per fil.

### Åpne punkter
- Story 1.11 må bruke `useTilstand().kjorer`, vise «Leser filen …» og «Beregner …» og feilmeldingene, og vite at `innhold` overføres til worker-en: bufferen er tom hos kalleren etterpå.
- Punkt 3–6 i AD-12 (forrige utdrag, sammenligning og lagring) er ikke med, og kommer i Epic 4 (Story 4.1 og 4.2).
- Tidsgrensen på 30 sekunder er bare testet med falske tidtakere, ikke i nettleseren med en worker som henger.

## 2026-11-25 kl. 16:30 — Idun-Samdal

### Oppgave
Carmen ga fire punkter på PR #34 (Story 1.10): feil epic-nummer, midlertidige løsninger som må ned i `deferred-work.md`, begreper som mangler i ordbanken, og at test av hele flyten må knyttes til Story 1.11.

### Resultat
- Rettet på branchen `story/1.10-kjoring-i-en-web-worker` (`a08b314`): «Epic 3» er byttet til Epic 4 (Story 4.1 og 4.2) i `kjoring.ts` og PR-beskrivelsen, fire oppføringer i `deferred-work.md` (`resultat` og `kapasitet` er null, `lagring` og sammenligning, test av hele flyten i Story 1.11, og tidsgrensen), og fire begreper i ordbanken (Worker, Kjøringsstyring, Tidsgrense, Uventet feil). Koden er uendret. Carmen er varslet i en kommentar.
- Epic-nummeret er rettet i denne loggen også.

### Åpne punkter
- Rettelsene ligger bare på PR-branchen, ikke i `Idun/Branch`. Når PR #34 er flettet, kan det komme en konflikt i `deferred-work.md` og ordbanken når main hentes inn.
