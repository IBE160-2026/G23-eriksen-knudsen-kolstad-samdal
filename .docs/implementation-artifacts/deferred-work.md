# Utsatt arbeid

- source_spec: `.docs/implementation-artifacts/spec-1-5-les-excel-filen.md`
  summary: En stykklisterad der Nivå og Varenummer er tomme, men en annen av malens kolonner er fylt ut (for eksempel Beskrivelse eller Antall), avslutter stykklisten. Innholdet i raden forsvinner uten valideringsfeil hvis ingenting står under den.
  evidence: PRD FR-3 og AD-15 sier at det bare er innhold «under» den tomme raden som gir feil, og `les.ts` følger det. Gjennomgang 1 av Story 1.5 (Blind Hunter) viste at en siste rad med bare Beskrivelse og Antall gir en gyldig kjøring uten den delen (medium). Gruppen avgjør om innhold i selve stopperaden også skal gi feil. Det kan løses i Story 1.8 eller med et nytt felt i `RaaArk`, som krever en egen PR for `typer.ts`.

- source_spec: `.docs/implementation-artifacts/spec-1-6-kontroll-av-malens-struktur.md`
  summary: Avhengigheter inne i Stykkliste står ikke i `hoppetOver`. Uten overskriften Varenummer kan reglene «fylt ut første gang, tom de neste», `TYPE_ULIK` og `UNDERDELER_ULIKE` ikke brukes, og uten Nivå kan reglene om nivå, underdeler og ledetid ≥ 0 for nivå 0 ikke brukes.
  evidence: Gjennomgang 1 av Story 1.6 (Blind Hunter), medium. `HoppetOverKontroll` har bare (ark, felt), så en delregel kan ikke beskrives uten endring i `typer.ts`. Story 1.8 (Idun) må hoppe over disse reglene for å unngå følgefeil (FR-2), og avgjøre om feiloppsummeringen skal nevne dem.

- source_spec: `.docs/implementation-artifacts/spec-1-9-kontroll-av-mps-og-planlagte-mottak.md`
  summary: Meldingen for `MOTTAK_UKE_UTENFOR_HORISONT` etter horisonten sier ikke hva horisonten H er, så Kari må telle ukene i Prognostiserte behov selv.
  evidence: Gjennomgang 1 av Story 1.9 (Blind Hunter), low. `Valideringsfeil` har ikke et felt for H, og `typer.ts` endres bare i egen PR (AD-3). Kan løses med et valgfritt felt `horisont`, eller ved at feiloppsummeringen i 1.12 viser H.

- source_spec: `.docs/implementation-artifacts/spec-1-9-kontroll-av-mps-og-planlagte-mottak.md`
  summary: Sikkerhetsnettet i `valider()` kan gi Stykkliste-koder (`NIVAA_UGYLDIG`, `TYPE_UGYLDIG` med flere) som ikke har en tekstmal i `nb.ts`. Ingen test sjekker at alle kodene `valider` kan gi, har en mal.
  evidence: Gjennomgang 1 av Story 1.9 (Blind Hunter), medium. Malene for Stykkliste hører til 1.8 (Idun). Når 1.8 er flettet, bør en test sjekke at hver kode i `VALIDERINGSKODER` har en mal i `filfeilOgValidering`, før 1.12 viser feilene.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.10)
  summary: `Kjoring.resultat` og `Kjoring.kapasitet` er `null` for alle kjøringer, og worker-en kjører bare lesing og validering. Typen sier at `resultat` bare er `null` når bare produksjonskapasitet er valgt, så dette er en midlertidig avvikelse.
  evidence: Story 1.10 (PR #34), gjennomgang av Carmen. Akseptkriteriene ber om plass til resultatet og kapasiteten, som Epic 2 og 5 fyller. Story 2.5 legger `domene/struktur`, `beregn` og `eksepsjoner` inn i worker-en og fyller `resultat`, og Epic 5 (Story 5.1–5.3) fyller `kapasitet`. Til da må ingen visning anta at `resultat` finnes.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.10)
  summary: `Kjoring.lagring` er `IKKE_LAGRET_BLOKKERT` (`IKKE_LAGRET_BARE_KAPASITET` for bare kapasitet) selv om ingenting er forsøkt lagret, og `Kjoring.sammenligning` er alltid `null`. Punkt 3–6 i AD-12 (forrige utdrag, utdrag, sammenligning og lagring) er ikke med i `app/kjoring.ts`.
  evidence: Story 1.10 (PR #34), gjennomgang av Carmen. Lagring og utdrag kommer i Story 4.1, og sammenligningen i Story 4.2 og 4.3. Story 4.1 må sette `lagring` etter om lagringen lyktes, og meldingen om at kjøringen ikke er lagret (NFR-10) må ikke vises før da. Kjøringslinjen i Story 1.11 viser ikke lagringsstatus, så den midlertidige verdien synes ikke.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.10)
  summary: Ingen nettlesertest går gjennom hele flyten fra skjermen via `app/kjoring.ts` til worker-en. `e2e/worker.spec.ts` starter worker-filen direkte, og `tests/app/kjoring.test.ts` bruker en falsk worker.
  evidence: Story 1.10 (PR #34), gjennomgang av Carmen. Avhengigheten er Story 1.11: e2e-testen der laster opp `testeksempel-01.xlsx` og får Resultat med «Kontorstol Basic (100-002)» og «Horisont: 10 uker», og går dermed gjennom skjermen, `useTilstand().kjorer`, `app/kjoring.ts` og worker-en. Den må også dekke at siden ikke henger ved feil (`V-F04`, `V-F07`–`V-F09`) og at en ny opplasting virker etterpå. Story 1.11 må hente styringen fra `useTilstand().kjorer`, og vite at filens `innhold` overføres til worker-en, så bufferen er tom hos den som kaller, etterpå.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.10)
  summary: Tidsgrensen på 30 sekunder er bare testet med falske tidtakere, ikke i nettleseren med en worker som henger.
  evidence: Story 1.10 (PR #34). `tests/app/kjoring.test.ts` dekker utløp, `terminate()` og at et sent svar ignoreres. En nettlesertest trenger en måte å få worker-en til å henge, som ikke finnes uten en testkrok. Vurder det sammen med e2e-testene i Story 1.11.
