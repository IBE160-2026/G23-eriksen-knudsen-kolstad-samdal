---
title: Rubrikkgjennomgang av ARCHITECTURE-SPINE.md (COSI - MRP v1)
type: review
reviewer: uavhengig arkitekturanmelder (BMAD reviewer gate, rubric walker)
reviewed: 'ARCHITECTURE-SPINE.md (status draft, updated 2026-11-21) med .memlog.md'
basis: 'origin/main 8b3fba0: prd.md, addendum.md, testdata/README.md, testdata/validering/README.md; fasit 01 og 03 (arkene Eksepsjoner, Bestillingsforslag og Sammenligning) lest for kontroll'
date: '2026-11-21'
---

# Rubrikkgjennomgang – Architecture Spine COSI - MRP v1

## Dom

Spinen er et gjennomarbeidet og ærlig merket individuelt utkast der lagdelingen, lagringen og meldingsmodellen holder. Den er likevel ikke byggeklar for fire parallelle utviklere. Kontraktene mellom lagene er ikke fastsatt, ukenummer-konvensjonen motsier PRD-en og testdataene, dataene til forklaringene (FR-18) og eksepsjonsparameterne for lagrede kjøringer mangler, og gruppen har ikke vedtatt arkitekturen.

## Avgrensning

- Jeg har lest bare spinen, `.memlog.md` i samme mappe og kravgrunnlaget på `8b3fba0`. Den tidligere rapporten `reviews/review-gate-2026-11-21.md` har jeg ikke lest, så vurderingen er uavhengig av den.
- Jeg har ikke åpnet andre brancher eller andre arkitekturmapper.
- For å kontrollere AD-3 og AD-7 leste jeg arkene Sammenligning, Eksepsjoner og Bestillingsforslag i `testeksempel-01-fasit.xlsx` og `testeksempel-03-fasit.xlsx` fra `8b3fba0` (kopiert til scratchpad, ikke til repoet).

## Oppsummering per sjekkpunkt

| # | Sjekkpunkt | Vurdering | Funn |
|---|---|---|---|
| 1 | Fikser de reelle divergenspunktene | Delvis. Lag, importgraf, lagring, meldingsform og tester er låst. Datakontraktene mellom lagene og rekkefølgen for å bygge dem mangler. | H1, H3, H4, M1, M3, M5 |
| 2 | Er hver Rule håndhevbar, og hindrer den det Prevents sier | For det meste. Importgrafen og tekstkodene håndheves. Kravet om ren kjerne, eksakte versjoner og «bare ett sted» for localStorage håndheves ikke automatisk, og testene kjører ikke av seg selv (ingen CI). | M4, L1 |
| 3 | Kan Deferred eller åpne avklaringer gi inkompatible enheter | Ja: tall lagret som tekst og trimming (inn/ mot kjerne/), manglende CI, og at gruppen ikke har avgjort hvilken arkitektur som gjelder. | K1, H5, M4 |
| 4 | Dekker kapabilitetskartet FR-1–FR-34 og NFR-1–NFR-11 | Alle nummer finnes i kartet. Noen rader peker på feil sted eller på en AD som ikke gir det som trengs (FR-18, FR-26, FR-30, NFR-8). | H3, L4 |
| 5 | Er hver dimensjon avgjort, utsatt eller åpen | Integrasjon og branching, kodeformat, lint-skript, TypeScript-strenghet og eierskap til kontrakter er tause dimensjoner. | M6 |
| 6 | Motsier spinen PRD, addendum eller testdata | Ja: ukenummer-konvensjonen mot FR-8/FR-10 og V-M02/V-M03/V-P02/V-P03. Avviket fra addendumets regel om tabellslutt er bevisst og begrunnet. | H2, L6 |
| 7 | Intern konsistens | Stort sett god. Avvik: hvor lagringen opprettes (komposisjonsrot) og AD-5/AD-6, «bare flyt/ fanger» mot eksport/ og ui/, kopiene i `public/` mot testkonvensjonen, og Web Worker-begrunnelsen. | M2, M3, L1, L2, L5 |
| 8 | Ærlig som individuell og ikke gruppegodkjent | Ja, tydelig i innledningen og i «Åpne gruppeavklaringer». Merket [ADOPTED] på AD-1 sier mer enn grunnlaget gir. | K1, L12 |

## Funn

### Kritisk

**K1 – Arkitekturen kan ikke binde fire utviklere før gruppen har valgt den**
- **Sted:** innledningen, «Åpne gruppeavklaringer» nr. 1, frontmatter `purpose: build-substrate`. `.memlog.md` (fremdriftsplan: arkitektur godkjent 18.11, trinn 1a/1b fra 20.11).
- **Problem:** Spinen sier selv, og ærlig, at den ikke er godkjent av gruppen, og at det er åpent hvilken arkitektur som gjelder. Dette er ingen feil i dokumentet, men så lenge spørsmålet står åpent, binder ingen av AD-1–AD-8 de andre utviklerne. Formålet, at fire skal bygge parallelt uten å gå i hver sin retning, nås da ikke. Fristen 18.11 er passert, og kuttbeslutningen 30.11 (PRD §7.1) krever at trinn 1–3 er testet innen da.
- **Forslag:** Legg nr. 1 fram for gruppen som en egen beslutning med frist (helst før epics skrives). Spinen bør si hva som gjelder i mellomtiden, for eksempel: «Til gruppen har valgt, bygges ingen kode mot denne spinen utenfor Carmens egne stories.» Når den er vedtatt: sett `status` til godkjent og før dato og deltakere inn i frontmatter.

### Høy

**H1 – Kontraktene mellom lagene er ikke fastsatt, og det står ikke at de skal lages først**
- **Sted:** AD-2 (Rådata), AD-3 (Grunnlagsdata, Kjøring, LagretKjøring), AD-6 (Utfall), AD-7 (Valideringsfeil, eksepsjoner), «Consistency Conventions».
- **Problem:** Spinen navngir dataformene, men fastsetter ikke feltene der fire personer møtes:
  - inn/ og kjerne/-validering: hvordan Rådata viser celle, plassering og manglende ark og kolonner.
  - kjerne/-validering og kjerne/-MRP: hvordan Grunnlagsdata viser rader, deler, felles deler, overordnede deler og lavnivåkode. Det er heller ikke bestemt hvilket nivå en felles del på både .1 og ..2 vises med (FR-14, 300-023 i testeksempel 04).
  - kjerne/ og ui/, tekster/ og eksport/: hvordan Kjøring viser de seks radtypene per del og uke, hva bestillingsforslag og forfalt mengde inneholder (FR-17), og hvilke parametere hver av de fem eksepsjonstypene har.
  - Hvordan uke «–» skal representeres (`null`, egen verdi eller noe annet).

  Hver utvikler kan følge alle AD-ene og likevel lage former som ikke passer sammen. AD-7 sin uttømmende typesjekk virker bare hvis unionen er definert før tekster/ skrives.
- **Forslag:** Legg til en AD eller konvensjon, «Kontrakter først». Typene i `src/kjerne/typer/` (Radata, Grunnlagsdata, Kjoring, LagretKjoring, Valideringsfeil, Eksepsjon per type med parametere, Utfall) skrives i én første story med én eier, sammen med arkitekturtesten. Først etterpå starter de parallelle storyene. Endringer i typene krever en pull request som de berørte eierne godkjenner. Ta med minst ett utfylt eksempel per form, for eksempel 300-003 uke 1 fra fasit 01.

**H2 – Ukenummer-konvensjonen motsier PRD-en og testdataene**
- **Sted:** «Consistency Conventions», raden «Uker»: «Alle eksterne data og resultater – … meldinger, valideringsfeil … – bruker ukenummer 1 til H» og hjelpefunksjonene «avviser ukenummer utenfor 1 til H».
- **Problem:**
  - FR-8 og FR-10 krever at meldingen oppgir «uken frigivelsen skulle vært gjort», som er uke 0 eller lavere. Fasit 01 for 300-003 har «måtte vært frigitt i uke 0», og fasit 03 for 300-004 har det samme. «Tidligste mottaksuke (1 + L)» kan også bli større enn H.
  - Valideringsfeilene peker på uker utenfor 1..H. V-M02 har feilen i uke 10 når H = 8, V-M03 i uke 8 når H = 7, V-P02 har uke 0 og V-P03 uke 11 når H = 10. Når horisonten er ugyldig, finnes det ingen H å kontrollere mot (V-M03).

  En utvikler som følger konvensjonen, kan altså ikke lage disse meldingene og feilene med de felles hjelpefunksjonene, og hver utvikler finner sin egen løsning. Det er nettopp den divergensen konvensjonen skulle hindre.
- **Forslag:** Skill mellom tre slags uker:
  1. **Horisontuke** 1..H for resultater (tabell, forslag, eksepsjonens `uke`), der hjelpefunksjonene gjelder.
  2. **Malkolonne-uke** 1..12 for plassering i MPS, uavhengig av H.
  3. **Ukeverdi i melding eller parameter**, et vilkårlig heltall som ikke valideres, for eksempel forfalt uke ≤ 0, 1 + L > H og verdien brukeren skrev i Planlagte mottak.

  Legg testtilfellene V-M02, V-M03, V-P02, V-P03 og 300-003 i fasit 01 inn i konvensjonen.

**H3 – Kjøring har ikke dataene forklaringene trenger (FR-18)**
- **Sted:** AD-3 (Kjøring = «Grunnlagsdata + resultattabell per del, eksepsjoner, bestillingsforslag, kritiske deler, tidspunkt»), kapabilitetskartet «FR-18 Forklaringer | kjerne/ (innhold) | AD-3, AD-6, AD-7».
- **Problem:** FR-18 krever at forklaringen viser disponibel beholdning (−20 for Hjul i uke 1), som ikke er en av de seks radene. Den må også vise beholdning(t−1) med fremskyndede mottak, nettobehovet før og etter fremskynding (eksempelet i FR-6: 40 og 0), hvilke mottak som er fremskyndet, og hva hver overordnet del bidrar med til bruttobehovet. Ingenting av dette er med i Kjøring. Forklaringsutvikleren må da enten regne MRP på nytt i forklaringsmodulen, og da finnes samme regel to steder (mot AD-2), eller avtale et nytt format med MRP-utvikleren uten at spinen sier hvordan.
- **Forslag:** Legg inn i AD-3 at MRP-beregningen leverer mellomverdier per del og uke: disponibel, beholdning(t−1), nettobehov før fremskynding, fremskyndede mottak (fra uke, til uke, antall), bidrag per overordnet del og forfalt mengde. Lag forklaringen som en ren funksjon `forklar(kjoring, del, rad, uke)` over Kjøring. Mellomverdiene lagres ikke (AD-3 gjelder fortsatt).

**H4 – Eksepsjonsparameterne må kunne gjengis uten Grunnlagsdata**
- **Sted:** AD-3 (LagretKjøring: «deler (varenummer, beskrivelse)», «eksepsjoner (… type, parametere)»), AD-7 («LagretKjøring lagrer eksepsjoner som type + parametere»).
- **Problem:** Fasit 03, arket Sammenligning, viser at en «Borte»-eksepsjon står med den gamle meldingen, for eksempel «… må fremskyndes til uke 3 i egen produksjon …». For å gjengi den trenger tekster/ delens type (hos leverandøren eller i egen produksjon, FR-12), og for FR-10 navn og varenummer på alle overordnede deler. Den gamle kjøringen finnes bare som LagretKjøring, der delene har bare varenummer og beskrivelse. Henter tekster/ disse opplysningene fra `kjoring.grunnlagsdata`, virker det for nye eksepsjoner, men ikke for borte eksepsjoner, i FR-20 og i eksporten (FR-23).
- **Forslag:** Legg til i AD-7: «Parameterne til en eksepsjon inneholder alt meldingen trenger (tall, uker, delens type eller sted, overordnede deler med navn og varenummer). tekster/ gjengir en eksepsjon bare fra type og parametere, aldri ved å slå opp i Grunnlagsdata.» Legg til en test som gjengir «Borte»-linjene i fasit 03 fra en LagretKjøring alene.

**H5 – Tall lagret som tekst og trimming er utsatt, uten noen midlertidig regel, mens biblioteket allerede velger**
- **Sted:** Deferred («Tall lagret som tekst og trimming av mellomrom … Må avklares før validering i kjerne/ bygges»), «Åpne gruppeavklaringer» nr. 2, AD-2 («inn/ … tolker ingen verdier»), konvensjonen «Varenummer: Alltid string, trimmet». `.memlog.md`: «trim er på som standard» i read-excel-file.
- **Problem:** Validering er trinn 1, så dette blokkerer arbeid som skal begynne nå. Biblioteket trimmer allerede som standard, så den som skriver inn/, gjør et valg uten å vite det, mens den som skriver kjerne/ tror at kjerne/ eier regelen. Varenummer er avgjort (trimmet), men de andre feltene er ikke det. Til dette er avgjort, kan to utviklere bygge inn/ og kjerne/ på hver sin måte.
- **Forslag:** Sett en midlertidig regel nå, som kan endres:
  - inn/ slår av trimming i biblioteket og leverer rå tekst.
  - kjerne/ trimmer tekstfelt (varenummer, beskrivelse, type, nivå) i én felles hjelpefunksjon.
  - Tekst som «7» i et tallfelt gir valideringsfeil (streng tolkning av FR-3 «heltall»), til gruppen bestemmer noe annet.

  Legg til en valideringstest for hvert av valgene, slik at en senere endring blir synlig.

### Middels

**M1 – Beregningsvalget (FR-30) mangler i kjøringsflyten**
- **Sted:** AD-6 (flyt/ «tar filinnhold som bytes + filnavn, lagringen og klokken som parametere … returnerer … vellykket med kjøring, sammenligning, kapasitet»), AD-3 (det lagres bare når bestillingsplanen er valgt), kapabilitetskartet for FR-30 (flyt/ er ikke med).
- **Problem:** Beregningsvalget er ikke en parameter til flyten, men flyten må vite det for å avgjøre om den skal sammenligne og lagre. Det står ikke om MRP beregnes når bare kapasiteten er valgt, om `kjoring` da er `null`, om et resultat med bare kapasitet erstatter gjeldende kjøring i tilstanden, eller om et nytt valg krever at filen lastes opp på nytt (bytes beholdes ikke). Den som lager flyten, og den som lager brukergrensesnittet, vil svare forskjellig.
- **Forslag:** La AD-6 ta inn `valg: { bestillingsplan: boolean; kapasitet: boolean }` (minst én av dem sann) og gjøre `kjoring`, `sammenligning` og `kapasitet` til `null` når de ikke er valgt. Ta med regelen fra FR-30 «bare kapasitet → ingen lagring og ingen sammenligning» i flyttestene. Bestem at et nytt valg betyr ny opplasting (eller at bytes beholdes i minnet). Legg flyt/ inn i kapabilitetskartet for FR-30.

**M2 – Uventede feil utenfor flyt/ er ikke håndtert**
- **Sted:** AD-7 («Uventede tekniske feil fanges i flyt/»), konvensjonen «Feil over laggrenser» («Bare flyt/ fanger uventede unntak»), AD-6 (ui/ kaller eksport/ og kjerne/ direkte).
- **Problem:** Eksport (FR-22, FR-23) og forklaringer (FR-18) kalles fra ui/ uten å gå gjennom flyt/. Et unntak i write-excel-file eller i en kjernefunksjon, eller en feil under tegning i React, blir ikke fanget. NFR-9 krever at appen ikke stopper og ikke viser delvise resultater. I tillegg sier konvensjonen at «skallet» (inkludert eksport/) ikke skal kaste, mens «bare flyt/ fanger». Begge kan ikke gjelde samtidig for eksport/.
- **Forslag:** Endre konvensjonen til: «flyt/ og eksport/ fanger unntak og returnerer utfall. ui/ har én feilgrense (React error boundary) rundt visningene, som viser en norsk reservemelding og lar brukeren laste opp på nytt.» Legg til en e2e- eller enhetstest for en eksport som feiler.

**M3 – Det står ikke hvor lagringen og klokken kobles til appen**
- **Sted:** AD-5 («Bare lagring/ rører window.localStorage … lagringsobjektet sendes inn som parameter»), AD-6 (flyt/ tar «lagringen» som parameter, og «ui/ importerer ikke … lagring/»), avhengighetsgrafen.
- **Problem:** Noen må lage den ekte lagringen fra `window.localStorage` og gi den til flyt/. ui/ har ikke lov til å importere lagring/, og flyt/ får lagringen som parameter, så ingen lag har klart ansvar. Utviklerne vil løse det ulikt: ett unntak i arkitekturtesten, en global, eller en standardverdi i flyt/. Det svekker regelen «bare på ett sted».
- **Forslag:** Bestem ett sted. For eksempel kan `flyt/oppsett.ts` eksportere `lagNettleserflyt()`, som kaller `lagring/nettleser.ts` (det eneste stedet som rører `window.localStorage`, inne i try/catch fordi tilgangen selv kan kaste i privat vindu) og binder klokken. ui/ kaller bare `lagNettleserflyt()`. Testene bruker flyten med minnelagring og fast klokke. Legg regelen inn i AD-5 og AD-6.

**M4 – Flere regler håndheves ikke automatisk, og testene kjører ikke av seg selv**
- **Sted:** AD-1 («Alle versjoner låses eksakt», listen over tillatte avhengigheter), AD-2 («kjerne/ bruker ingen DOM-, nettleser-, Excel- eller klokke-API»), AD-5 («bare på ett sted»), Deferred «GitHub Actions», «Åpne gruppeavklaringer» nr. 5.
- **Problem:** Arkitekturtesten kontrollerer importer, men ikke globale navn som `window`, `document`, `Date`, `Math.random` eller `localStorage` i kjerne/. TypeScript-malen har DOM-typene på for hele `src/`. Ingenting kontrollerer at `package.json` bare har tillatte pakker med eksakte versjoner. Uten CI håndhever arkitekturtesten bare det utviklerne husker å kjøre før de fletter, så Prevents i AD-1, AD-2 og AD-5 blir avhengig av disiplin.
- **Forslag:**
  1. Lag en egen `tsconfig` for `src/kjerne/` med `lib: ["ES2023"]` uten DOM, eventuelt også oxlint `no-restricted-globals` per mappe.
  2. Utvid arkitekturtesten slik at den sjekker at `package.json` bare har avhengighetene i AD-1 og AD-8, uten `^` eller `~`, og at `localStorage` bare forekommer i én fil.
  3. Gjør det til en regel at `npm test` og `npm run build` skal være grønne før fletting til `main`, også før gruppen har bestemt CI. Anbefal CI med høy prioritet.

**M5 – Det står ikke hvordan kolonner og ark skal finnes**
- **Sted:** AD-2 («Malens ark- og kolonnenavn er en kontrakt … konstanter i inn/»), FR-2, V-F02 (feil i H1).
- **Problem:** Det står ikke om inn/ finner kolonnene etter overskrift eller etter fast plassering (A–H). Det står heller ikke om navnene sammenlignes nøyaktig eller uten hensyn til store og små bokstaver og mellomrom, eller hva som skjer når kolonnene står i annen rekkefølge eller det er en ekstra kolonne mellom dem. V-F02 forventer feilen i H1, altså en fast plassering. Den som skriver inn/, og den som skriver valideringstestene, kan velge ulikt, og da faller V-F02 og V-F06 ulikt ut.
- **Forslag:** Bestem i AD-2: overskriftene på rad 1 sammenlignes nøyaktig (etter trimming, se H5) med konstantene på faste plasser (Stykkliste A–H, Planlagte mottak A–C og MPS-oppsettet). Mangler en overskrift eller er den feil, gir det en strukturfeil med malens celle (for eksempel H1). Når FR-24 kommer, brukes I1 «Partistørrelse» som valgfri kolonne.

**M6 – Tause dimensjoner: integrasjon, kodeformat og TypeScript-strenghet**
- **Sted:** hele spinen. AD-1 («Ingen … bibliotek» utenom listen), AD-8 (skriptene `test`, `test:e2e`, `build`).
- **Problem:** Spinen sier ikke hvordan fire utviklere integrerer: branch per person eller per story, pull request mot `main`, hvem som godkjenner, og at `main` også er produksjon på Vercel. Det finnes ingen formaterer (AD-1 utelukker Prettier), og spinen har ikke noe `npm run lint`-skript eller oxlint-oppsett. TypeScript-innstillingene er ikke fastsatt (`strict`, `noUncheckedIndexedAccess`, som er viktig når listene per uke er 0-baserte). Disse dimensjonene er verken avgjort, utsatt eller åpne, og ulike oppsett gir støy i diffene og flettekonflikter.
- **Forslag:**
  - Legg til en kort konvensjon: én branch per story, pull request mot `main`, minst én annen godkjenner, og `npm test` og `npm run build` grønne før fletting.
  - Legg skriptet `npm run lint` (oxlint) til i AD-8.
  - Fastsett `strict: true` og `noUncheckedIndexedAccess: true`.
  - Velg enten oxlints formateringsregler eller ta inn Prettier med en ny AD, eller før formatering opp under «Åpne gruppeavklaringer».

### Lav

**L1 – Kopiene i `public/` bryter testkonvensjonen**
- **Sted:** Structural Seed (`public/ # COSI-MRP-mal.xlsx og testeksempel-01.xlsx`), konvensjonen «Tester» («Testdata leses fra `testdata/` og kopieres ikke»).
- **Problem:** Malen og testeksempel 01 kopieres til `public/`. Byte-testen i AD-8 fanger avvik, men regelen og strukturen sier imot hverandre, og en ny `lag_testdata.py`-kjøring gjør testen rød uten at noen har endret appen.
- **Forslag:** Importer filene fra `testdata/` som eiendeler i Vite (`?url`) slik at de ikke kopieres, eller skriv inn i konvensjonen at `public/` er et bevisst unntak. Si da også hvem som oppdaterer kopiene når malen endres.

**L2 – Begrunnelsen for å utsette Web Worker stemmer ikke**
- **Sted:** Deferred, raden «Web Worker»: «Flyten er allerede uten React, så den kan flyttes».
- **Problem:** flyt/ bruker lagringen (localStorage), og localStorage finnes ikke i en Web Worker. Hele flyten kan derfor ikke flyttes. Bare innlesing og beregning (inn/ og kjerne/) kan det.
- **Forslag:** Skriv: «Innlesing og beregning (inn/ og kjerne/) kan flyttes til en worker. Lesing og lagring av forrige kjøring blir i hovedtråden.» Det passer med at flyt/ er delt i rene steg.

**L3 – Datoen i filnavnet ved eksport (FR-22)**
- **Sted:** konvensjonen «Tidspunkt» (ISO 8601 i UTC), FR-22 («Filnavnet inneholder ferdigproduktets navn og dato»).
- **Problem:** En kjøring kl. 00:30 norsk tid får forrige dags dato hvis datoen tas fra UTC-strengen. Ferdigproduktets navn kan også inneholde tegn som ikke er lov i filnavn (`/`, `:`).
- **Forslag:** Bestem at datoen i filnavnet lages i tekster/ eller eksport/ i brukerens lokale tidssone, og at ulovlige tegn i filnavnet byttes ut.

**L4 – Unøyaktigheter i kapabilitetskartet**
- **Sted:** «Capability → Architecture Map».
- **Problem:**
  - FR-24–FR-26 mangler eksport/ og tekster/. FR-26 krever at eksporten viser bestillingsregelen, og forklaringen til FR-18 skal beskrive avrundingen.
  - FR-30 mangler flyt/ (se M1).
  - NFR-8 står som «Deferred», men er et krav i trinn 1 (de faste kolonnene gjelder resultattabellen, og den er med i brukertesten).
  - FR-18 peker på AD-3, men AD-3 gir ikke dataene som trengs (se H3).
- **Forslag:** Rett radene. For NFR-8: «ui/, styrt av PRD NFR-8 og gruppens UX-vedtak; kan ikke kuttes». Se H3 for FR-18.

**L5 – Navnekonvensjonen i ASCII kan ikke testes og avviker fra vanlig norsk translitterasjon**
- **Sted:** konvensjonen «Identifikatorer og filnavn» (æ→ae, ø→o, å→a).
- **Problem:** Mange skriver ø som «oe» og å som «aa» (`Kjoering`, `Raadata`). Arkitekturtesten fanger bare filnavn som ikke er ASCII, ikke en feil translitterasjon. Spinen bruker i tillegg æøå-navnene (LagretKjøring, Rådata) i AD-ene, så ASCII-navnet må gjettes.
- **Forslag:** Legg til en kolonne «navn i kode» i ordbanken (eller en liten tabell i spinen) for de sentrale typene: `Radata`, `Grunnlagsdata`, `Kjoring`, `LagretKjoring`, `Valideringsfeil`, `Eksepsjon`, `Bestillingsforslag`, `Utfall`, `Avvisning`, `Plassering`.

**L6 – Avviket fra addendumets regel om tabellslutt kan gi uklare tilfeller**
- **Sted:** AD-2 («`kjerne/` finner selv hvor stykklisten slutter (siste rad med nivå eller varenummer)»).
- **Problem:** Avviket er bevisst og forenlig med V-S01. Men en rad etter slutten der bare Beskrivelse, Antall eller andre felt er fylt ut, blir ignorert uten at brukeren får vite det. Det står heller ikke hva som skjer når data ligger langt etter rad 1001: er det V-S01 (hull) eller V-S03 (for mange rader)?
- **Forslag:** Definer en rad som ikke-tom når en hvilken som helst av malens kolonner A–H har verdi, og bestem hvilken feil som gjelder når det er et hull og data etter rad 1001 (for eksempel én V-S03-feil).

**L7 – Ingen øvre grense for hvor mye inn/ leser (NFR-9 «henge»)**
- **Sted:** AD-2 («`inn/` leser hele det brukte området i arkene (stopper ikke … ved rad 1001)»).
- **Problem:** En fil med svært stort brukt område eller en svært stor fil kan gjøre at appen henger, og NFR-9 sier at ingen fil skal få appen til å henge. Risikoen i praksis er moderat.
- **Forslag:** Sett en øvre grense (for eksempel filstørrelse og et høyeste radnummer som leses, som 5000) som gir en strukturert avvisning, og legg til en test for den.

**L8 – Plassering med flere rader**
- **Sted:** AD-7 (Valideringsfeil: «plassering (ark + rad, celle eller uke)»).
- **Problem:** FR-3 krever at feilen for ulike underdeler «nevner varenummeret og begge radene» (V-S22). Spinen sier ikke om den andre raden skal i plasseringen eller i parameterne.
- **Forslag:** Bestem at plasseringen er den første raden, og at de andre radene står i parameterne. Ta V-S22 med som eksempel.

**L9 – Rekkefølgen i sammenligningen er ikke fastsatt**
- **Sted:** konvensjonen «Rekkefølge» (nevner ikke sammenligningen), FR-20 og FR-23 («nøyaktig linjene i arket Sammenligning»).
- **Problem:** Fasit 03 viser forslagene i stykklistens rekkefølge og så etter uke (200-002 uke 3 kommer før 300-003 uke 1), og deretter eksepsjonene. Den som skriver kjerne/sammenligning, og den som skriver eksport/, kan sortere ulikt.
- **Forslag:** Legg til i «Rekkefølge»: sammenligningen viser først bestillingsforslag, så eksepsjoner, så deler, hver gruppe i stykklistens rekkefølge og deretter etter uke, som i fasit 03.

**L10 – Policy for filendelse (FR-1)**
- **Sted:** AD-4 (bibliotekets feilkoder), AD-6 (flyt/ tar inn filnavnet).
- **Problem:** Det står ikke om endelsen kontrolleres før filen tolkes, eller om det skjer uten hensyn til store og små bokstaver. V-F04 (`.csv`) og V-F09 (tekstfil med endelsen `.xlsx`) gir samme bibliotekkode.
- **Forslag:** Skriv i AD-4 at inn/ først sjekker at endelsen er `.xlsx` (uansett store og små bokstaver) og gir egen kode for `.xls` og andre endelser. Deretter tolkes innholdet.

**L11 – Grunnlag og frister som bør med**
- **Sted:** AD-8 (fasittester for 01–05), Structural Seed «Miljøer».
- **Problem:** `testdata/README.md` sier at testeksempel 05 «Må kontrolleres for hånd av gruppen». NFR-2 krever håndkontrollerte fasiter. NFR-3 krever en publisert app, men spinen sier bare «produksjon … når gruppen er klar».
- **Forslag:** Legg «håndkontroll av fasit 05» til under åpne avklaringer. Sett en frist for publisering i produksjon (senest før brukertesten 2.12 hvis testpersonene skal bruke lenken, og uansett før 15.12).

**L12 – Merket [ADOPTED] på AD-1 sier mer enn grunnlaget gir**
- **Sted:** overskriften til AD-1. `.memlog.md` linje 17 («Anbefaling A; venter på gruppens valg») og linje 23 (Carmens beslutning etter Party Mode).
- **Problem:** [ADOPTED] betyr vanligvis en beslutning som allerede er tatt og som spinen overtar. AD-1 er Carmens egen beslutning, ikke et gruppevedtak eller noe som fantes fra før. For AD-8 er merkingen riktig for Vercel-delen (addendum, besluttet 2026-11-05).
- **Forslag:** Fjern [ADOPTED] fra AD-1, eller skriv «[FORESLÅTT – Carmen]», slik at bare Vercel-delen i AD-8 står som vedtatt av gruppen.

## Det som fungerer godt

- Lagene og importgrafen er tydelige, tabellen og diagrammet stemmer overens, og arkitekturtesten gjør grafen håndhevbar.
- Valideringen er delt rent: inn/ håndterer avvisning og struktur, kjerne/ håndterer FR-3. Skillet mellom manglende og tomme kolonner dekker V-F06.
- Lagringsmodellen (AD-3, AD-5) er gjennomtenkt mot FR-19–FR-21 og NFR-10: rekkefølgen «les → sammenlign → lagre», ingen lagring når bare kapasiteten er valgt, utfall i stedet for unntak, og innstillinger uten produktdata.
- AD-7 med strukturerte meldinger, uttømmende typesjekk og tester av innhold i stedet for ordlyd passer godt med FR-13 og NFR-7.
- AD-8 gjør NFR-2, NFR-3 og NFR-4 konkrete (`npm test` uten nettlesere, lik CSP i preview og på Vercel, null CSP-brudd i e2e).
- Spinen er åpen om at den er individuell, og de åpne gruppeavklaringene står samlet.
