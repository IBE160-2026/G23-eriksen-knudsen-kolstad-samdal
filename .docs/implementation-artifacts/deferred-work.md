# Utsatt arbeid

- source_spec: `.docs/implementation-artifacts/spec-1-5-les-excel-filen.md`
  summary: En stykklisterad der Nivå og Varenummer er tomme, men en annen av malens kolonner er fylt ut (for eksempel Beskrivelse eller Antall), avslutter stykklisten. Innholdet i raden forsvinner uten valideringsfeil hvis ingenting står under den.
  evidence: PRD FR-3 og AD-15 sier at det bare er innhold «under» den tomme raden som gir feil, og `les.ts` følger det. Gjennomgang 1 av Story 1.5 (Blind Hunter) viste at en siste rad med bare Beskrivelse og Antall gir en gyldig kjøring uten den delen (medium). Gruppen avgjør om innhold i selve stopperaden også skal gi feil. Det kan løses i Story 1.8 eller med et nytt felt i `RaaArk`, som krever en egen PR for `typer.ts`. Story 1.8 løste det ikke (Sebastians gjennomgang av PR #33, 26.11): det krever fortsatt et valg i gruppen og et nytt felt i `RaaArk`.

- source_spec: `.docs/implementation-artifacts/spec-1-9-kontroll-av-mps-og-planlagte-mottak.md`
  summary: Meldingen for `MOTTAK_UKE_UTENFOR_HORISONT` etter horisonten sier ikke hva horisonten H er, så Kari må telle ukene i Prognostiserte behov selv.
  evidence: Gjennomgang 1 av Story 1.9 (Blind Hunter), low. `Valideringsfeil` har ikke et felt for H, og `typer.ts` endres bare i egen PR (AD-3). Kan løses med et valgfritt felt `horisont`, eller ved at feiloppsummeringen i 1.12 viser H. Story 1.12 løste det ikke: `Valideringsresultat` har ikke H, så feiloppsummeringen kan ikke vise den uten en endring i `typer.ts` (egen PR, AD-3).

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

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.11)
  summary: Ved valideringsfeil viser startsiden bare den foreløpige meldingen «Filen har N feil. Ingenting er beregnet.» over kortene (`.valideringsboks` i `ui/ny-kjoring/NyKjoring.tsx`, `felles.nyKjoring.beregning.valideringsfeil` i `nb.ts`). Den får fokus, men er ikke h1, og sidetittelen begynner ikke med «Feil:».
  evidence: Story 1.11, beslutning av Carmen 25.11. Story 1.12 erstatter boksen med feiloppsummeringen (UX-DR11): overskriften som sidens h1, gruppene, tabellen og teksten om at den lagrede kjøringen er urørt. `filvalg.ts` har bare antallet (`valideringsfeil: number`), så 1.12 må ta vare på hele `Valideringsresultat` fra utfallet `VALIDERINGSFEIL`.
  status: Løst i Story 1.12 (26.11). Boksen og teksten er fjernet. `filvalg.ts` tar vare på hele `Valideringsresultat`, og `ui/ny-kjoring/Feiloppsummering.tsx` viser feiloppsummeringen.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.11)
  summary: Resultat og kunngjøringen sier at bestillingsplanen ikke er beregnet ennå. `resultat.ikkeBeregnet` står i en informasjonsboks under kjøringslinjen, og `felles.nyKjoring.beregning.ferdig` er «Kjøringen er ferdig. Filen er lest og har ingen feil. Bestillingsplanen beregnes ikke ennå.» uten antallene fra UX-DR4.
  evidence: Story 1.11, krav fra Carmen 25.11: Resultat skal ikke se ut som en ferdig MRP-beregning så lenge `Kjoring.resultat` er `null`. Når Epic 2 fyller `resultat` (Story 2.5), fjernes informasjonsboksen, og kunngjøringen blir «Kjøringen er ferdig: N bestillingsforslag, M kritiske deler.» (EXPERIENCE.md › State Patterns).

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.11)
  summary: Tekstene på Ny kjøring og Veiledning beskriver det appen gjør nå. Kort 3 har tittelen fra Story 1.4 («Velg hva du vil beregne, og beregn»), men teksten sier at appen foreløpig bare leser og kontrollerer filen. I Veiledning sier del 1–3 hva appen gjør nå, del 3–6 sier «Kommer i en senere versjon av appen.», og punktet om produksjonskapasitet er tatt ut. Introduksjonssiden beskriver fortsatt sluttproduktet, fordi de to avsnittene og de tre stegene er låst av akseptkriteriene (UX-DR6).
  evidence: Story 1.11, krav fra Carmen 25.11: ingen tekst skal gi inntrykk av at brukeren kan velge produksjonskapasitet eller se en ferdig bestillingsplan. Tekstene i `nb.ts` (`felles.nyKjoring.kort.beregn.tekst` og `felles.veiledning`) må skrives tilbake når funksjonene kommer: Epic 2 (resultatet, del 3–4), Story 1.12 (feiloppsummeringen med ark, rad og felt, del 2, skrevet om 26.11), Epic 4 (lagring, sammenligning og eksport, del 2, 5 og 6, og «Den lagrede kjøringen endres ikke.») og Epic 5 (valget av beregning i kort 3 og punktet Produksjonskapasitet i del 3).

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.11)
  summary: Når radiogruppen kommer i Epic 5, blir kort 3 høyere, og kravet om at opplastingssonen, radiogruppen og Beregn er synlige uten rulling i 1366 × 630 (UX-DR7) kan brytes.
  evidence: Story 1.11, målt i Chromium og Firefox 25.11: kort 3 slutter på 548 px uten fil, 579 px med valgt fil, 618,5 px med den lengste meldingen om feil i hele filen (V-F09), og 626,5 px med den foreløpige meldingen om valideringsfeil og en ny fil valgt. Radiogruppen fra prototypen er omtrent 130–150 px høy, så startsiden kommer over 630 px uten tiltak. Epic 5 må måle på nytt og ta stilling til en mer kompakt sone eller annen plassering. Story 1.12 må også måle på nytt, fordi feiloppsummeringen står over kortene og er høyere enn den foreløpige meldingen. `e2e/opplasting.spec.ts` kontrollerer alle tilstandene.
  status: Story 1.12 har målt (se punktet under om avklaringen). Uten feiloppsummering er alt fortsatt synlig i 1366 × 630. Epic 5 må fortsatt måle med radiogruppen.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.11)
  summary: Hele flyten fra skjermen via `app/kjoring.ts` til worker-en er nå testet i nettleseren (punktet fra Story 1.10 over). Tidsgrensen på 30 sekunder er fortsatt bare testet med falske tidtakere.
  evidence: `e2e/opplasting.spec.ts` laster opp testeksempel 01 og V-F04, V-F07, V-F08 og V-F09 gjennom «Velg fil» og dra og slipp, og teller at et dobbeltklikk på Beregn lager én worker. En test av tidsgrensen i nettleseren trenger fortsatt en testkrok som får worker-en til å henge.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.8)
  summary: Story 1.8 er rettet etter Sebastians gjennomgang av PR #33, men fire ting er bevisst ikke gjort. (1) En tom stykkliste får meldingen om at nivå .1 mangler (`RADER_INGEN_NIVAA_1`), ikke at stykklisten er tom. (2) `erTom` finnes både i `nb.ts` og `les.ts`: `tekster/` kan bare importere typer fra `domene/` (arkitekturtesten), så `nb.ts` kan ikke bruke `domene/celler.ts`. `les.ts` kan flyttes til `celler.ts` senere. (3) En feil i Nivå eller Varenummer, hvor som helst i filen, slår av sløyfekontrollen og underdelsreglene for hele filen, fordi hierarkiet da ikke er til å stole på. (4) Antall og Type sperrer bare delen de gjelder.
  evidence: Story 1.8, PR #33, Sebastians gjennomgang 26.11 (punkt 12 og 14, og beslutningen i punkt 3 om sperring). Punkt 1 kan løses med en egen kode i `typer.ts` (egen PR). Punkt 3 kan løses ved å bygge strukturen av radene som er gyldige, men da må underdelene til en rad med ugyldig nivå utelates riktig.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.12)
  summary: **Avklaring som gruppen må bekrefte.** Kravet om at opplastingssonen, radiogruppen og Beregn er synlige uten rulling i et vindu på 1366 × 630 px (DESIGN.md › Layout & Spacing, UX-DR7) gjelder startsiden uten feiloppsummering. Med valideringsfeil står feiloppsummeringen øverst, overskriften (sidens h1) er synlig og har fokus, og Kari ruller til opplastingen og Beregn. DESIGN.md sier både at alt skal være synlig uten rulling og at feiloppsummeringen står over kortene. Begge deler går ikke samtidig.
  evidence: Beslutning av Carmen 26.11 i Story 1.12. Målt i Chromium og Firefox 26.11: kort 3 slutter på 548 px uten feiloppsummering. Med V-F05 er oppsummeringen 472 px høy (h1 over to linjer, teksten om lagret kjøring og tre grupper med tabell), og kort 3 slutter på 1037 px. En egen rullbar boks med maks høyde ville gitt dårligere tilgjengelighet og løser det likevel ikke. `e2e/feiloppsummering.spec.ts` kontrollerer at overskriften er synlig med fokus og at sonen og Beregn nås ved rulling, og `e2e/opplasting.spec.ts` at alt er synlig uten oppsummering. Når gruppen har bekreftet, bør DESIGN.md › Layout & Spacing få setningen inn.

- source_spec: `.docs/planning-artifacts/epics.md` (Story 1.12)
  summary: Feiloppsummeringen nevner ikke to kontroller som valideringen hopper over uten å si det i `hoppetOver`: sløyfekontrollen og underdelsreglene når Nivå eller Varenummer har feil (Story 1.8, punkt 3 over), og ukene i Planlagte mottak mot H når horisonten selv er ugyldig (Story 1.9). Gruppen «Filen følger ikke malen» viser bare det som er hoppet over fordi et ark eller en overskrift mangler (FR-2).
  evidence: Funnet i analysen til Story 1.12 (26.11). Kravet i FR-2 og UX-DR11 gjelder kontroller som hoppes over fordi noe mangler, og det er oppfylt. De to andre kan vises hvis `HoppetOverKontroll` får flere grunner, som krever en egen PR for `typer.ts` (AD-3).
