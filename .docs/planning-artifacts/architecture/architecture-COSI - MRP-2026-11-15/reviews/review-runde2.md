---
title: Reviewer gate runde 2 – ARCHITECTURE-SPINE.md (COSI - MRP v1)
type: review
reviewer: 'Uavhengig arkitekturanmelder (BMAD reviewer gate, andre runde), egen kontekst'
reviewed: 'ARCHITECTURE-SPINE.md (AD-1–AD-9, status draft, updated 2026-11-21) med .memlog.md'
basis: 'origin/main 8b3fba0: prd.md, addendum.md, testdata/README.md, testdata/validering/README.md; fasit 01–05 (arkene Eksepsjoner, Bestillingsforslag, Sammenligning, Kapasitet, Fasittabell, Materiell) og testeksempel 04 og malen lest med openpyxl i scratchpad'
date: '2026-11-21'
---

# Reviewer gate runde 2 – Architecture Spine COSI - MRP v1

## Dom

Alle kritiske og høye funn fra runde 1 er lukket i spinen, og K1 er bevisst lagt under «Åpne gruppeavklaringer». Spinen har likevel to nye høye hull som bør rettes før Story 1: to regler for formen på utfall over laggrenser som ikke stemmer med hverandre, og ingen regel for rekkefølgen på eksepsjoner, mens fasittestene sammenligner etter posisjon. Etter disse rettingene er den byggeklar som Carmens individuelle utkast, men ikke som gruppevedtak.

## Avgrensning og metode

- Lest: spinen, `.memlog.md`, de tre rapportene fra runde 1 (`review-rubrikk.md`, `review-versjoner.md`, `review-motstander.md`) og `review-gate-2026-11-21.md`. Kravgrunnlaget er lest fra `8b3fba0` med `git show`.
- Fasitfilene og testeksempel 04 er kopiert til scratchpad og lest med openpyxl (bare lesing). Ingen andre brancher eller arkitekturmapper er åpnet.
- `npm view typescript@7.0.2` er kjørt mot det offentlige npm-registeret for å kontrollere om arkitekturtesten kan håndheves (N4).
- Ingen filer er endret, bortsett fra denne rapporten.

## 1. Funn fra runde 1 – status

Med «kritisk» og «høy» menes graderingen i runde 1. Rapporten om versjoner hadde ingen kritiske eller høye funn. Tabellen viser bare de kritiske og høye funnene. Middels og lave funn er kort kommentert under tabellen.

| Funn (runde 1) | Grad | Status | Hvor i spinen / hva som mangler |
| --- | --- | --- | --- |
| Rubrikk K1 – arkitekturen binder ikke før gruppen har valgt | Kritisk | **Delvis (bevisst gruppeavklaring)** | Innledningen og «Åpne gruppeavklaringer» nr. 1. Mellomtidsregelen runde 1 foreslo, mangler: «Til de er avgjort, gjelder PRD-en» svarer ikke på hvilken kode som kan bygges mot spinen i mellomtiden, for PRD-en avgjør ikke nr. 1, 5–8 eller 10. Se N13. |
| Rubrikk H1 – kontraktene mellom lagene er ikke fastsatt | Høy | Lukket | AD-3 gir formene, og AD-9 krever Story 0 og 1 med én koordinator. Grensesnitt som ikke er datatyper, mangler fortsatt i Story 1 (N5). |
| Rubrikk H2 – ukekonvensjonen motsier PRD og testdata | Høy | Lukket | Tre slags uker i konvensjonen «Uker». Testene for V-M02, V-M03, V-P02, V-P03 og 300-003 er nevnt. |
| Rubrikk H3 – Kjøring mangler data til forklaringene (FR-18) | Høy | Lukket | Sporingsfelt i AD-3, og `forklar(kjoring, celleId)` er en ren funksjon i `kjerne/`. Formen på Forklaring står ikke i Story 1 (N5). |
| Rubrikk H4 – eksepsjonsparameterne må være selvbærende | Høy | Lukket | Selvbærende parametere i AD-3. AD-7 sier at teksten lages fra eksepsjonen alene, og en test gjengir «Borte»-meldingene i fasit 03. |
| Rubrikk H5 – trimming og tall lagret som tekst | Høy | Lukket (midlertidig) | Midlertidig regel i AD-2, og gruppen må bekrefte den (gruppeavklaring nr. 2). |
| Motstander 1 – FR-30-valget er ikke inndata til `flyt/` | Kritisk | Lukket | `kjorFil({ …, valg, … })` i AD-6, og utfallet har feltene `kjoring`, `sammenligning` og `kapasitet`, som kan være `null`. Se også N3. |
| Motstander 2 – eksepsjonsparameterne er ikke selvbærende | Kritisk | Lukket | Som rubrikk H4. |
| Motstander 3 – uke «–» og identitet gjennom JSON | Kritisk | Lukket | `uke: number \| null` og rundturtest gjennom JSON i AD-3. Hvor `null` sorteres, er ikke bestemt (N2). |
| Motstander 4 – malnavn og Plassering har tre eiere | Kritisk | Lukket | `inn/` eier Excel-kontrakten. Rådata har ASCII-feltnøkler og kildeinformasjon per ark, og Plassering er en diskriminert union (AD-2, AD-3, AD-7). |
| Motstander 5 – to steder lager strukturfeil | Høy | Lukket | AD-2: «`inn/` lager aldri valideringsfeil», og én funksjon i `kjerne/` lager dem ferdig sortert. |
| Motstander 6 – Sammenligningen mangler form og rekkefølge | Høy | Lukket (med rest) | AD-3 definerer linjene og rekkefølgen som i fasit 03. Linjene for deler og verdiene i «endring» er ikke definert (N6). |
| Motstander 7 – eksepsjonsidentiteten er ikke unik | Høy | Lukket | Eksepsjonene sammenlignes som multimengde (AD-3). Hvilken melding som vises som «Borte», er ikke bestemt (N11). |
| Motstander 8 – forklaringene mangler mellomverdier | Høy | Lukket | Som rubrikk H3. |
| Motstander 9 – bestillingsforslag: art, forfalt mengde og sortering | Høy | Lukket | AD-3 og konvensjonen «Rekkefølge». Kontrollert mot fasit 03: sortert etter uke og så stykklistens rekkefølge. |
| Motstander 10 – Grunnlagsdata har ingen form | Høy | Lukket | AD-3. At mottak i samme uke summeres i FR-12 og FR-29, er en tolkning av PRD-en (N12). |
| Motstander 11 – `lagring/` tar streng eller objekt | Høy | Lukket | AD-5: bare tekst. Serialisering og tolkning ligger i `kjerne/`. |

**Antall åpne kritiske og høye funn fra runde 1: 0.** K1 er delvis lukket og står som gruppeavklaring.

**Middels og lave funn fra runde 1, kort:**

- Lukket: M1–M6, L1, L2, L4, L5, L8–L12, motstander 13, 15–19, og versjonsfunnene 1–4, 9 og 14.
- Delvis lukket:
  - L3 og motstander 12: at ulovlige tegn i filnavnet erstattes, står i memloggen (R18), men ikke i spinen.
  - L6: hvilken feil som gjelder når et hull kombineres med data etter rad 1001, er ikke bestemt.
  - L7: filstørrelsen og tidsgrensen har ingen verdier.
  - Motstander 14: hvilken årsak som går foran når begge slår til, er ikke bestemt.
  - Motstander 20: at MPS med mer enn 12 uker gir horisontfeil, står i memloggen (R27), men ikke i spinen.
  - Versjonsfunn 10 (`toBlob` i stedet for bytes) og 18 (`assetsInlineLimit` og `font-src`) er ikke tatt inn.

  Se N9–N11.

## 2. Nye funn

### Kritisk

Ingen.

### Høy

**N1 – To regler for formen på utfall over laggrenser som ikke stemmer med hverandre**
- **Sted:** konvensjonen «Feil over laggrenser» («`inn/`, `lagring/`, `flyt/` og `eksport/` returnerer `{ ok: true, … }` eller `{ ok: false, kode, … }`»), AD-5 (utfallene `ok`, `blokkert`, `full`, `ulesbar`, `ukjentFeil`), AD-6 (utfallene `avvist`, `valideringsfeil`, `vellykket`, `uventetFeil`) og konvensjonen «Strukturerte meldinger» («lagringsutfall … har feltet `kode`»).
- **Problem:** Spinen gir to former for de samme grensene. Ifølge konvensjonen er `ok` en boolsk diskriminant. Ifølge AD-5 er `ok` en av fem kodeverdier. AD-6 har fire varianter, og ingen av dem passer med `{ ok, kode }`. Én utvikler lager derfor `lagre()` som returnerer `{ kode: 'ok' }`, en annen lar `flyt/` sjekke `if (r.ok)`. Resultatet er at alt blir behandlet som en feil, eller som vellykket. Feilen kompilerer bare hvis typene er felles, og AD-9 sier ikke hvilken av reglene Story 1 skal følge.
- **Retting:** Bestem én form og stryk den andre. For eksempel: alle utfall over laggrenser er diskriminerte unioner på feltet `kode`, og `vellykket` eller `ok` er en av kodene. Konvensjonen «Feil over laggrenser» endres til «returnerer et utfall med feltet `kode` (AD-5, AD-6) og kaster ikke». Ta `Lagringsutfall` og `Eksportutfall` med i listen over typer i Story 1 (AD-9).

**N2 – Ingen regel for rekkefølgen på eksepsjoner, mens fasittestene sammenligner etter posisjon**
- **Sted:** konvensjonen «Rekkefølge» (nevner deler, bestillingsforslag, valideringsfeil og sammenligning, men ikke eksepsjoner), AD-8 («celler finnes etter posisjon»), AD-4 («Eksportens ark og oppsett følger fasitens ark»), AD-3 Sammenligning («hver gruppe i stykklistens rekkefølge … og så etter uke»).
- **Problem:** Fasitarkene Eksepsjoner i 01–05 er sortert etter delens første forekomst i stykklisten. Innenfor en del står uke «–» først, så kommer ukene i stigende rekkefølge. Innenfor samme celle følger typene rekkefølgen i PRD §4.3 (Bestilling forsinket før Mottak forsinket for 300-026 uke 1 i fasit 04), og to «Mottak forsinket» står etter den opprinnelige mottaksuken (300-028: uke 3 før uke 5). Beregningen går i lavnivåkoderekkefølge (FR-28) og gir naturlig en annen rekkefølge. I fasit 04 kommer da 300-026 (lavnivåkode 1) før 300-022 (lavnivåkode 2), mens fasiten har det motsatte. Utvikleren av `kjerne/` beholder rekkefølgen fra beregningen, og utvikleren av eksportens fasittest sammenligner etter posisjon. FR-22-testen feiler, og `ui/` kan sortere på en tredje måte (FR-15). Det samme gjelder sammenligningen: AD-3 sier ikke hvor `null` står, eller hvordan to eksepsjoner med samme del og uke sorteres.
- **Retting:** Legg til i «Rekkefølge»: «Eksepsjoner sorteres i `kjerne/` etter delens første forekomst i stykklisten, så uke (`null` først), så typen i rekkefølgen fra PRD §4.3 (FR-9, FR-10, FR-11, FR-12, FR-29), og så den opprinnelige mottaksuken. Den samme rekkefølgen gjelder innenfor gruppen Eksepsjoner i Sammenligning. `ui/` og `eksport/` sorterer ikke på nytt.» Legg til en test mot fasit 04, som har alle tilfellene der rekkefølgen kan bli ulik.

### Middels

**N3 – `beregn` og Kjøring stemmer ikke med hverandre når bare kapasiteten er valgt**
- **Sted:** AD-3 («Kjøring: Grunnlagsdata, valg, tidspunkt …», «`beregn(grunnlag, valg, tidspunkt)` lager kjøringen», «Kapasitet … Lages, lagres ikke»), AD-6 (`vellykket` med `kjoring | null` og `kapasitet | null`), Structural Seed («kjerne/: beregn MRP og/eller kapasitet»).
- **Problem:** Ifølge AD-3 tar `beregn` imot valget og lager en Kjøring som inneholder valget. Det taler for at det alltid finnes en Kjøring. Ifølge AD-6 er `kjoring` `null` når bestillingsplanen ikke er valgt. Det står ikke om Kapasitet er en del av Kjøring eller lages av en egen funksjon. Utvikleren av `kjerne/` lager `beregn(...) → Kjoring` med et valgfritt felt `kapasitet`. Utvikleren av `flyt/` venter `{ kjoring | null, kapasitet | null }`, eller kaller `beregnKapasitet(grunnlag)` selv.
- **Retting:** Bestem for eksempel to rene funksjoner: `beregn(grunnlag, tidspunkt) → Kjoring` og `beregnKapasitet(grunnlag) → Kapasitet`. `flyt/` kaller dem etter valget. Valget ligger da i utfallet, ikke i Kjøring. Rett signaturen i AD-3 og pilen i Structural Seed.

**N4 – Arkitekturtesten kan ikke bygges slik AD-1 og AD-8 beskriver den**
- **Sted:** AD-8 (arkitekturtesten kontrollerer importgrafen «med `import type` for stiplede kanter» og globale navn i `kjerne/`), AD-1 (bare malens avhengigheter, TypeScript 7.0.2).
- **Problem:** `typescript@7.0.2` eksporterer bare `./lib/version.cjs` og API-er under `./unstable/*` (kontrollert med `npm view`). Det finnes ikke noe stabilt kompilator-API å analysere importer med, og AD-1 forbyr å legge til en egen parser. Testen må da bygge på tekstsøk. Søket bommer på `import { type X }` (som under `verbatimModuleSyntax` blir en import med sideeffekt), `export … from` og dynamisk `import()`. Det står heller ikke om `*.test.ts` under `src/kjerne/` omfattes av testen. To utviklere kan lage hver sin variant, og regelen «bare typer» kan brytes uten at testen feiler.
- **Retting:**
  - Sett `verbatimModuleSyntax: true` i tsconfig.
  - Krev at kanter som bare gjelder typer, skrives som `import type …` på toppnivå, og at `import { type … }` ikke brukes.
  - La arkitekturtesten bruke et dokumentert tekstmønster som også dekker `export … from` og `import()`, eller håndhev grafen med `no-restricted-imports` i oxlint per mappe.
  - Skriv om `*.test.ts` i `src/kjerne/` følger de samme reglene. Anbefalt: ja, og bare fasittestene i `tests/` leser Excel.

**N5 – Grensesnitt som ikke er datatyper, står ikke i Story 1**
- **Sted:** AD-9 (Story 1-listen), AD-3 (`Forklaring`, `celleId`), AD-5 (`lagre`, `hent`, `list`, `slett`, der «lagringsobjektet sendes inn som parameter»), AD-6 (`kjorFil({ … lagring, naa })`, eksportens `{ bytes, filnavn }`).
- **Problem:** Story 1 låser datatypene, men ikke disse grensesnittene:
  - **Forklaring:** ui/ og kjerne/ møtes i resultatet fra `forklar`, men det er bare beskrevet som «strukturerte data».
  - **lagring/ og flyt/:** Det er uklart om `lagring` i `kjorFil` er Storage-objektet eller modulen med `lagre`, `hent`, `list` og `slett`.
  - **naa:** Det er uklart om `naa` er en verdi eller en funksjon.
  - **eksport/:** write-excel-file gir `toBlob()`, som er asynkron. Derfor må eksporten enten være asynkron eller bruke `/universal`, men det står ikke hvilken.

  Konvensjonen «Domenenavn» nevner `Avvisning`, men AD-9 tar den ikke med. Uten disse grensesnittene i Story 1 kan to spor bygge hver sin versjon. Det er det AD-9 skal hindre.
- **Retting:** Utvid Story 1 med `Avvisning`, `CelleId`, `Forklaring`, grensesnittet `Lagring` (`lagre`, `hent`, `list`, `slett`, alle med `Promise<Lagringsutfall>`), signaturen til `kjorFil` (der `naa: () => string` gir ISO-tid i UTC) og `eksporter(kjoring, sammenligning | null): Promise<Eksportutfall>`.

**N6 – Linjene for deler og verdiene i «endring» i Sammenligning er ikke definert**
- **Sted:** AD-3 Sammenligning («hva: bestillingsforslag, eksepsjon eller del; endring; …»), FR-20 («Er en del lagt til i eller fjernet fra stykklisten, vises den som en egen linje»).
- **Problem:** Fasit 03 bruker `Nytt`, `Endret mengde` og `Fjernet` for forslag og `Ny` og `Borte` for eksepsjoner. Ingen fasit viser en linje for en del. Det er ikke bestemt hvilke verdier «endring» har for en del, hva uke, før og etter skal være for en del, og hva «etter sin gamle plass» betyr når den gamle forgjengeren også er fjernet. Utvikleren av `kjerne/` og utvikleren av eksporten (FR-23) velger da hver sin form.
- **Retting:** Skriv «endring» som en lukket kodeliste per `hva`. For eksempel kan en linje for en del ha `endring: 'ny' | 'fjernet'`, `uke: null`, `for` og `etter` lik beskrivelsen eller `null`, og fjernede deler kan stå rett etter nærmeste del før dem i den gamle stykklisten som fortsatt finnes. Legg begrepet inn i ordbanken og en egen enhetstest i `kjerne/`, for testdata har ikke tilfellet.

**N7 – «Eksportens ark og oppsett følger fasitens ark» er ikke entydig**
- **Sted:** AD-4, AD-8 («celler finnes etter posisjon»), FR-22.
- **Problem:** Fasitene har arkene Regler, Fasittabell, Eksepsjoner, Utregning, Materiell og Bestillingsforslag, men ikke noe sted for ferdigproduktets navn, horisonten og tidspunktet, som FR-22 krever i filen. Det står ikke hvilke ark eksporten skal ha, eller hvor metadataene skal stå. Legger én utvikler dem øverst i resultattabellen, flytter alle cellene seg, og den posisjonelle testen feiler. I fasitens Bestillingsforslag er «Forfalt mengde» tom når det ikke er noe forfalt. Skriver eksporten 0 («tall skrives som tall»), feiler testen eller må tolke tom som 0, og det er ikke bestemt hvilken.
- **Retting:** Bestem eksportens ark og startceller i AD-4. For eksempel: Resultattabell, Bestillingsforslag og Eksepsjoner har samme kolonner som fasitarkene og starter i A1, Sammenligning har samme oppsett som fasit 03 fra overskriftsraden, og et eget ark Kjøring har navn, horisont og tidspunkt. Skriv at forfalt mengde 0 eksporteres som tom celle, slik fasiten har det.

### Lav

**N8 – Feilgrensen i React fanger ikke feil i hendelseshåndterere**
- **Sted:** AD-6 og konvensjonen «Feil over laggrenser» («Uventede unntak fanges i … React-feilgrensen»).
- **Problem:** En feilgrense fanger bare feil under tegning, ikke i `onClick`. Kaller `ui/` `forklar()` eller en annen kjernefunksjon fra en hendelseshåndterer, blir et unntak ikke fanget (NFR-9).
- **Retting:** Skriv at kjernefunksjoner som `ui/` kaller direkte, kalles under tegning, for eksempel i `useMemo`, eller pakkes inn i én felles hjelper i `ui/` som fanger feilen og viser reservemeldingen.

**N9 – Grenser og regler som står i memloggen, men ikke i spinen**
- **Sted:** AD-2 (filstørrelse og tidsgrense uten verdier, ingenting om MPS med mer enn 12 uker), konvensjonen «Tidspunkt» og AD-7 (filnavn), Structural Seed (`public/`).
- **Problem:**
  - R27 sier at MPS med mer enn 12 utfylte uker gir horisontfeil, men det står ikke i spinen.
  - R18 sier at ulovlige tegn (`\/:*?"<>|`) i filnavnet erstattes, men det står ikke i spinen.
  - Det er ikke bestemt om malkolonne-uken leses fra kolonne A i MPS eller regnes ut fra radnummeret.
  - Uten verdier for filstørrelse og tidsgrense kan e2e-testen med en stor fil (AD-8) og NFR-5-målingen havne over grensen.
- **Retting:** Flytt R18 og R27 inn i AD-2 og AD-7. Sett verdier, for eksempel 10 MB og 15 s, og krev at 1000-radersfilen og e2e-filen er godt under dem. Bestem at uken regnes ut fra radnummeret (rad − 1), så kolonne A bare er hjelpetekst.

**N10 – Hvilken årsak som går foran når en del begrenser både på grunn av lager og ledetid**
- **Sted:** AD-3 Kapasitet («begrensende deler per uke og rad med årsak (lager eller ledetid)»).
- **Problem:** Gjelder rest fra motstander 14. Fasit 05 har ikke dette tilfellet. Én utvikler gir én årsak, en annen gir begge.
- **Retting:** Bestem for eksempel at årsak er en liste med begge når begge gjelder, med ledetid først, og ta det med i enhetstestene for `kjerne/`.

**N11 – Hvilken melding som vises når én av to like eksepsjoner er «Borte»**
- **Sted:** AD-3 (multimengde).
- **Problem:** For 300-028, med to «Mottak forsinket» i samme celle, gir sammenligningen med multimengde én «Borte», men det står ikke hvilken av de to meldingene som skal vises.
- **Retting:** Bestem at eksepsjonene innenfor en nøkkel pares i rekkefølgen fra N2, og at de siste som ikke får noen partner, blir «Borte» eller «Ny».

**N12 – Tolkninger av PRD-en står ikke som gruppeavklaringer**
- **Sted:** AD-3 Grunnlagsdata («FR-12 og FR-29 behandler summen som ett mottak»), AD-2 (stykklisten slutter ved siste rad med verdi, et bevisst avvik fra addendum).
- **Problem:** PRD-en sier at mottak i samme uke «legges sammen» (FR-6), men FR-29 snakker om «et planlagt mottak». Når ett av to mottak i samme uke ikke trengs, gir PRD-en et annet svar enn summeringen. Fasit 04 (300-027) har ikke dette tilfellet. Begge avvikene er Carmens tolkninger og ikke vedtatt av gruppen, men bare trimmingen og talltolkningen (nr. 2) står under gruppeavklaringer.
- **Retting:** Legg disse to tolkningene inn i nr. 2 eller i et nytt punkt under «Åpne gruppeavklaringer».

**N13 – Hva som gjelder i mellomtiden, og hvem som eier spinen**
- **Sted:** innledningen, «Åpne gruppeavklaringer», frontmatter (`purpose: build-substrate`, `binds: [FR-1 …]`).
- **Problem:** Skillet mellom Carmens individuelle arkitektur og gruppevedtak er tydelig i teksten:
  - innledningen sier det,
  - «Bekreftet av Carmen» og «midlertidig regel» er merket,
  - bare Vercel-delen av AD-8 er [ADOPTED].

  Men frontmatter sier ingenting om eierskap. AD-9 (koordinator og krav om pull request) og AD-8 («grønne før fletting») foreskriver arbeidsflyt for gruppen, mens nr. 6 og nr. 10 sier at arbeidsflyten er åpen. Det står fortsatt ikke hva som gjelder for kode i mellomtiden (rest fra K1).
- **Retting:** Legg til `owner: 'Carmen Kolstad (individuell, ikke gruppevedtak)'` i frontmatter. Skriv én setning i innledningen: «Til nr. 1 er avgjort, binder spinen bare Carmens egne stories. Reglene for arbeidsflyt i AD-8 og AD-9 er forslag til nr. 6 og nr. 10.»

**N14 – Kapabilitetskartet, Deferred og ordbanken er ikke helt avstemt**
- **Sted:** kapabilitetskartet (NFR-8 → AD-6), Deferred («Utforming av visninger og fargebruk (FR-15)»), konvensjonen «Domenenavn».
- **Problem:**
  - AD-6 har ingen regel om NFR-8 (faste kolonner, ikke farge alene), selv om kartet viser til den.
  - Deferred kan leses som om FR-15 er utsatt, men kravet om «ikke farge alene» gjelder i trinn 1.
  - Listen over nye begreper mangler horisontuke, malkolonne-uke, ukeverdi, sporingsfelt, art, celleId, feltkatalog, komposisjonsrot og koordinator. CLAUDE.md krever at nye begreper legges inn i ordbanken.
  - Deferred sier at et nettskjema bare er et nytt innlag, men Rådata har Excel-radnummer og kolonnebokstav i typen.
- **Retting:**
  - Skriv NFR-8 som et krav til `ui/` uten AD («styres av PRD NFR-8»).
  - Endre Deferred-raden til «utforming og fargevalg (FR-15). Kravet om ikke farge alene gjelder».
  - Fullfør listen over begreper og legg den inn i gruppeavklaring nr. 4.
  - Skriv i Deferred at nettskjemaet må oppgi sin egen plassering i de samme feltene.

## 3. Konsistens og samsvar med kravgrunnlaget (oppsummert)

- **Én regel per AD (spørsmål 2):** Bare N1 (formen på utfall) er en motsigelse mellom to regler. N3 er en tvetydighet mellom AD-3 og AD-6. N4 er en regel som ikke kan håndheves slik den er skrevet. Ingen gamle regler fra runde 1 henger igjen i spinen. Memloggen har gamle linjer (for eksempel linje 31 og 82), men den er en historikk der det nyeste gjelder, og spinen viser riktig til de nye beslutningene.
- **AD, konvensjoner, graf, kart og Deferred (spørsmål 3):** Lagtabellen og avhengighetsgrafen stemmer, kant for kant. Kartet dekker FR-1–FR-34 og NFR-1–NFR-11. Avvikene er N3, N5 og N14.
- **PRD, addendum og testdata (spørsmål 4):** Ingen direkte motsigelser. Følgende er kontrollert mot fasit:
  - rekkefølgen på bestillingsforslag (fasit 03),
  - rekkefølgen og kolonnene i Sammenligning (fasit 03),
  - V-S01 (rad 9) og V-S03 (rad 1002) med regelen om siste rad med verdi (malen har ingen verdier i A–H på rad 2–1001),
  - MPS-oppsettet (A2–A13, uke 1–12),
  - kapasitetstabellen i stykklistens rekkefølge (fasit 05).

  To tolkninger av PRD-en er ikke lagt fram for gruppen (N12). Avviket fra addendumets regel om tabellslutt er bevisst og tillatt, fordi PRD-en gjelder foran addendum og README for V-S01 godtar begge.
- **Motstanderhull (spørsmål 5):** N1, N2, N3, N5, N6 og N7 er reelle hull der to utviklere kan følge alle reglene og bygge inkompatibelt. Alle rammer kontraktene som Story 1 skal låse, så det er billigst å rette dem før Story 1.
- **Individuell og gruppegodkjent (spørsmål 6):** Skillet er tydelig i teksten. Det som mangler, er en markering i frontmatter og en setning om hva som gjelder i mellomtiden (N13).

## 4. Anbefalt rekkefølge

1. N1 og N2 (høy), før Story 1 starter.
2. N3, N5, N6 og N7, som del av Story 1.
3. N4, i Story 0.
4. N8–N14 kan rettes i samme omgang eller legges under gruppeavklaringene.
