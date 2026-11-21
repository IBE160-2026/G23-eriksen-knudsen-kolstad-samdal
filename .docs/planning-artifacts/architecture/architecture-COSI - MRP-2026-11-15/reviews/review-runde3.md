---
title: Reviewer gate runde 3 (verifisering) – ARCHITECTURE-SPINE.md (COSI - MRP v1)
type: review
reviewer: 'Uavhengig kontrollør (BMAD reviewer gate, tredje runde), egen kontekst'
reviewed: 'ARCHITECTURE-SPINE.md (AD-1–AD-9, status draft, updated 2026-11-21), mot reviews/review-runde2.md (N1–N14)'
basis: 'origin/main 8b3fba0: prd.md (FR-9–FR-12, FR-18, FR-20, FR-22, FR-23, FR-29, FR-30, NFR-8–NFR-11); fasit 01–05 lest med openpyxl i scratchpad (arkene Fasittabell, Eksepsjoner, Bestillingsforslag, Sammenligning, arkliste og overskrifter); .docs/ordbank.md på Carmen/Branch'
date: '2026-11-21'
---

# Reviewer gate runde 3 – verifisering av Architecture Spine COSI - MRP v1

## Dom

**Godkjent som Carmens individuelle, byggeklare utkast.** Det er ingen åpne kritiske eller høye funn. N1 og N2, de to høye funnene fra runde 2, er lukket, og regelen for rekkefølgen på eksepsjoner stemmer med alle de fem fasitene. Det som gjenstår, er presiseringer på middels og lavt nivå. De fleste av dem hører naturlig hjemme i Story 1, der AD-9 uansett låser typene og grensesnittene. Spinen er fortsatt ikke et gruppevedtak, og det står tydelig i frontmatter, i innledningen og under «Åpne gruppeavklaringer».

## Avgrensning og metode

- Lest: spinen med linjenummer, `review-runde2.md` og PRD-en på `8b3fba0` (de aktuelle FR-ene og NFR-ene).
- Fasit 01–05 er kopiert til scratchpad og lest med openpyxl (bare lesing). Kontrollert:
  - rekkefølgen på eksepsjoner mot stykklistens rekkefølge, uke («–» først) og typerekkefølgen i PRD §4.3
  - rekkefølgen og kolonnene i Sammenligning (fasit 03)
  - kolonnene i Fasittabell, Bestillingsforslag og Eksepsjoner, og hvilke ark fasitene har
- Antall `|` per rad er talt i alle markdown-tabellene.
- `.docs/ordbank.md` er sjekket for de nye begrepene.
- Ingen andre brancher eller arkitekturmapper er åpnet. Ingen filer er endret, bortsett fra denne rapporten.

## 1. Funn N1–N14 – status

| Funn | Grad (runde 2) | Status | Sitat fra spinen / kommentar |
| --- | --- | --- | --- |
| N1 – to former for utfall | Høy | **Lukket** (rest: lav) | Konvensjonen: «Én generisk type i `kjerne/`: `Utfall<T, K>`: enten `{ ok: true, verdi: T }` eller `{ ok: false, kode: K, … }`». AD-5: «alle som `Promise<Utfall>` … feilkodene er `blokkert`, `full` og `ukjentFeil`». AD-6: «`ok: true` med `kjoring \| null` … eller `ok: false` med koden `avvist`, `valideringsfeil` … eller `uventetFeil`». AD-4: «`Promise<Utfall<{ bytes, filnavn }>>`». Alle fire bruker nå samme form. Restene er ordlyd (R1). |
| N2 – rekkefølgen på eksepsjoner | Høy | **Lukket** | AD-3: «Eksepsjonslisten sorteres i `kjerne/` som i fasit 01–05: stykklistens rekkefølge, så uke (`null` først), så typen i rekkefølgen i PRD §4.3 (…), så mottaksuken.» Kontrollert: alle fem fasitarkene Eksepsjoner er sortert etter denne nøkkelen (også 300-022 «–» før uke 7 og 300-026 Bestilling forsinket før Mottak forsinket i fasit 04). Konvensjonen «Rekkefølge» viser til AD-3. |
| N3 – `beregn` og Kjøring når bare kapasiteten er valgt | Middels | **Lukket** | AD-3: «**Kjøring** (bare i minnet, bare når bestillingsplanen er valgt)» og «`beregnBestillingsplan(grunnlag, tidspunkt)` lager kjøringen og `beregnKapasitet(grunnlag)` kapasiteten; `flyt/` kaller dem etter valget i FR-30». «Valg» er fjernet fra Kjøring. FR-30 håndteres i `kjorFil({ …, valg, … })` (AD-6), og beregningsvalget ligger i den felles tilstanden. Det er ingen motsigelse. |
| N4 – arkitekturtesten kan ikke håndheves | Middels | **Delvis** | AD-1: «`strict`, `noUncheckedIndexedAccess` og `verbatimModuleSyntax`». AD-8: «skrevet som enkel tekstsøking …, uten parser, med `verbatimModuleSyntax` … så typeimporter alltid skrives `import type` på toppnivå». Det mangler fortsatt at tekstmønsteret også skal dekke `export … from` og dynamisk `import()`, og det står ikke om `src/kjerne/**/*.test.ts` omfattes (R3). |
| N5 – grensesnitt som ikke er datatyper, står ikke i Story 1 | Middels | **Delvis** | AD-9 har nå med `Forklaring`, `CelleId`, `Utfall`, «lagringsgrensesnittet i AD-5, signaturen til `kjorFil` i AD-6, eksportfunksjonen i AD-4 og innlesingsfunksjonen». Eksporten er asynkron (AD-4). Tre ting mangler: `Avvisning` står i «Domenenavn», men ikke i listen i AD-9; formen på `Forklaring` er fortsatt bare «strukturerte data»; og det står ikke om `naa` er en verdi eller en funksjon (R2). |
| N6 – dellinjer og endringskoder i Sammenligning | Middels | **Lukket** (rest: lav) | AD-3: «Endringskodene er `nytt`, `endretMengde` og `fjernet` for bestillingsforslag, `ny` og `borte` for eksepsjoner, og `ny` og `fjernet` for deler; en dellinje har varenummer og beskrivelse og ingen uke eller tall.» Det er ikke bestemt hva «etter sin gamle plass» betyr når den gamle forgjengeren også er fjernet (R6). |
| N7 – eksportens ark og oppsett | Middels | **Lukket i hovedsak** (rest: lav) | AD-4: «Eksporten har arkene Kjøring (ferdigproduktets navn, horisont, tidspunkt), Resultattabell (kolonnene Varenummer, Rad, Uke 1 … Uke H som fasitarket Fasittabell), Bestillingsforslag og Eksepsjoner (samme kolonner som fasitarkene, uke «–» for hele delen) og, når en sammenligning finnes, Sammenligning (som i fasit 03). … forfalt mengde 0 og andre tomme verdier i fasiten skrives som tomme celler.» Dette stemmer med fasitarkene (Fasittabell A1 `Varenummer, Rad, Uke 1…`, Bestillingsforslag A1 `Varenummer, Beskrivelse, Frigivelsesuke, Mengde, Art, Forfalt mengde`, Eksepsjoner A1 `Varenummer, Uke, Eksepsjonstype, Melding`). Det står ikke hvor arket Sammenligning starter: i fasit 03 står fem rader med tittel og forklaring før overskriftsraden `Hva, Endring, Varenummer, Uke, Før, Etter, Melding` (R4). |
| N8 – feilgrensen fanger ikke hendelser | Lav | **Lukket** | Konvensjonen: «kjernefunksjoner som `ui/` kaller direkte (for eksempel `forklar`), kalles under tegning (`useMemo`) eller gjennom én felles hjelper i `ui/`». |
| N9 – grenser som bare sto i memloggen | Lav | **Lukket** | AD-2: «avviser filer over 10 MB og innlesinger som tar mer enn 15 sekunder», «malkolonne-uke regnes ut fra radnummeret som rad − 1», «MPS med flere enn 12 utfylte uker gir horisontfeil». AD-7: «tegnene `\ / : * ? " < > \|` byttes ut». |
| N10 – årsak når begge gjelder | Lav | **Lukket** | AD-3 Kapasitet: «en liste over årsaker (lager, ledetid – i den rekkefølgen, begge når begge gjelder)». Tolkningen står også i gruppeavklaring nr. 11. |
| N11 – hvilken like eksepsjon som blir «Borte» | Lav | **Lukket** | AD-3: «innenfor en nøkkel pares de i den sorterte rekkefølgen, og de siste uten partner blir «Ny» eller «Borte» med sin egen melding». |
| N12 – tolkninger av PRD-en står ikke som gruppeavklaringer | Lav | **Lukket** | Gruppeavklaring nr. 11: summering av mottak i FR-12 og FR-29, multimengde, slutten av stykklisten og begge årsakene i FR-33. |
| N13 – mellomtid og eierskap | Lav | **Lukket** | Frontmatter: «owner: 'Carmen Kolstad – individuell arkitektur, ikke gruppevedtak'». Innledningen: «Til gruppeavklaring nr. 1 er avgjort, binder spinen bare Carmens egne stories, og reglene for arbeidsflyt i AD-8 og AD-9 … er Carmens forslag til gruppeavklaring nr. 6 og nr. 10.» |
| N14 – kartet, Deferred og ordbanken | Lav | **Lukket i spinen** (rest: middels, prosess) | Kartet: «NFR-8 … styres direkte av PRD NFR-8 og FR-15 … PRD (ingen AD)». Deferred: «Kravet om ikke farge alene (NFR-8) gjelder fra trinn 1» og nettskjemaet «oppgir sin egen plassering og sine egne feltnavn i de samme feltene». Listen over begreper i «Domenenavn» er fullført. De nye begrepene står likevel ikke i `.docs/ordbank.md` (R5). |

**Antall åpne kritiske og høye funn: 0.** Status: 10 lukket, 2 lukket i hovedsak med en lav rest (N6, N7), og 2 delvis lukket på middels nivå (N4, N5). N1 og N14 er lukket, men har hver sin rest (R1 og R5).

## 2. Nye motsigelser, gamle regler og brudd mot PRD og fasit

Kontrollert etter oppdraget:

- **Formen på utfall i AD-5, AD-6 og konvensjonen:** Formen er den samme i alle tre og i AD-4. Det er ingen gamle formuleringer med `ok` som kode, og heller ikke varianter som `vellykket` eller `avvist` uten `ok: false`. Restene står i R1.
- **Kjøring uten «valg», mens FR-30 fortsatt håndteres:** Dette henger sammen:
  - `kjorFil` tar `valg` (AD-6).
  - Kjøring finnes bare når bestillingsplanen er valgt (AD-3), og derfor er `kjoring | null`.
  - Lagring og sammenligning skjer bare når bestillingsplanen er valgt (AD-3, AD-6).
  - Kapasiteten eksporteres ikke (AD-3), som FR-30 krever («Kapasiteten er ikke med i eksporten»).
  - Beregningsvalget ligger i den felles tilstanden (AD-6).

  Structural Seed sier fortsatt «beregn MRP og/eller kapasitet». Det er en samlebetegnelse for de to funksjonene og ikke en motsigelse.
- **Eksportoppsettet mot fasitarkene:** Kolonnene stemmer med Fasittabell, Bestillingsforslag og Eksepsjoner (se N7). At forfalt mengde skrives som tom celle, stemmer med fasit 01 og 04, der cellen er tom når det ikke er noe forfalt. Arket Kjøring er nytt i forhold til fasitene. Det dekker metadataene FR-22 krever, uten å flytte cellene i resultatarkene. FR-23 sier at eksporten av en kjøring uten sammenligning ikke har arket Sammenligning, og «når en sammenligning finnes» dekker det. Den eneste uklarheten er startraden for Sammenligning (R4).
- **Rekkefølgen i Sammenligning:** AD-3 sier: bestillingsforslag, så eksepsjoner, hver gruppe i stykklistens rekkefølge og så etter uke. Fasit 03 følger dette i begge retninger. Eksempel: `300-002` uke 1 og 2 kommer før `200-002` uke 3, som er stykklistens rekkefølge (100-001, 200-001, 300-001, 300-002, 200-002 …). Kolonnene `hva; endring; varenummer; uke; før; etter; eksepsjon` svarer til `Hva, Endring, Varenummer, Uke, Før, Etter, Melding`.
- **Markdown-tabellene:** Alle tabellene er gyldige. Alle radene i en tabell har like mange `|`:
  - Lagtabellen har 4 kolonner (9 rader).
  - Konvensjonene og Stack har 2 kolonner (15 og 13 rader).
  - Kapabilitetskartet, Deferred og gruppeavklaringene har 3 kolonner (27, 9 og 13 rader).

  `|` står bare inne i kodespenn utenfor tabellene (AD-3, AD-6, AD-7), og der er tegnet ufarlig.
- **Gamle eller dupliserte regler:** Ingen funnet. Konvensjonen «Rekkefølge» viser nå til AD-3 og gjentar ikke regelen. Grensene (10 MB, 15 s) står bare i AD-2, og AD-8 viser til dem.
- **PRD:** Ingen brudd funnet. Typerekkefølgen i AD-3 er den samme som rekkefølgen i PRD §4.3: FR-9 Ledetid overskrider horisont, FR-10 Bestilling forsinket, FR-11 Bruk av sikkerhetslager, FR-12 Mottak forsinket og FR-29 Kanseller mottak. Endringskodene dekker FR-20 («Flytter et forslag uke, vises det som fjernet i den gamle uken og nytt i den nye»).

### Gjenstående funn (ingen kritiske eller høye)

**R1 – Lav: Utfall er ikke formulert likt overalt**
- AD-6 lister `kjoring | null`, `sammenligning | null`, `kapasitet | null`, lagringsutfall og meldinger rett under `ok: true`. Konvensjonen legger nyttelasten i `verdi`. Det er derfor uklart om koden skal lese `r.verdi.kjoring` eller `r.kjoring`.
- AD-6 sier at «`eksport/` … returnerer `{ bytes, filnavn }` eller et feilutfall», mens AD-4 sier `Promise<Utfall<{ bytes, filnavn }>>`.
- Konvensjonen «Strukturerte meldinger» sier at «lagringsutfall … har feltet `kode`», men et vellykket `Utfall` har ingen `kode`.
- Structural Seed bruker merkelappene «Utfall: vellykket» og «Utfall: valideringsfeil», og `vellykket` er ikke lenger en kode.

*Retting:* Skriv i AD-6 at feltene ligger i `verdi`, og bruk `Utfall` også i eksportsetningen i AD-6. Skriv «feilutfall har feltet `kode`» i «Strukturerte meldinger». Story 1 låser uansett typen, så dette kan ikke gi to inkompatible implementeringer etter Story 1.

**R2 – Middels: N5-resten – `Forklaring`, `naa` og `Avvisning`**
- Formen på `Forklaring` er ikke beskrevet. Det trengs minst radtype, tallene med navn og bidrag per overordnet del (FR-18: «lagerbeholdning = 80, planlagte mottak = 0, …»).
- Det står ikke om `naa` er en funksjon. Ordet «systemklokken» i AD-6 tyder på det.
- `Avvisning` står i «Domenenavn», men ikke i Story 1-listen i AD-9.

*Retting:* Legg `Avvisning` inn i AD-9, skriv `naa: () => string` (ISO i UTC), og gi `Forklaring` en kort form, eller skriv eksplisitt at formen fastsettes i Story 1.

**R3 – Middels: N4-resten – arkitekturtesten**
- Tekstsøket må også fange `export … from '…'` og `import('…')`, ellers kan grafen omgås uten at testen feiler.
- Det står ikke om enhetstester under `src/kjerne/` er omfattet av forbudene (for eksempel `new Date()` i en test).

*Retting:* Én setning i AD-8 som sier at mønsteret dekker `import`, `export … from` og `import()`, og om `*.test.ts` i `kjerne/` er med eller unntatt. Anbefalt: med.

**R4 – Lav: Hvor arket Sammenligning starter**
- «Sammenligning (som i fasit 03)» sier ikke om eksporten skal ha tittel- og forklaringsradene (A1–A5 i fasit 03) eller starte med overskriftsraden i A1.
- FR-23 krever «de samme linjene», så en test som sammenligner linjer, består uansett. En test som finner celler etter posisjon, gjør ikke det.

*Retting:* «Arket Sammenligning starter med overskriftsraden i A1. Fasitens tittel og forklaringer tas ikke med.» Eller det motsatte, men bestemt.

**R5 – Middels (prosess, ikke arkitektur): Ordbanken er ikke oppdatert**
- Prosjektets CLAUDE.md krever at nye begreper legges inn i `.docs/ordbank.md` når de tas i bruk i dokumenter eller kode.
- Ingen av begrepene i «Domenenavn» finnes der i dag (Rådata, LagretKjøring, Kjøringsflyt, Utfall, Avvisning, Plassering, feltkatalog, horisontuke, malkolonne-uke, ukeverdi, sporingsfelt, celleId, komposisjonsrot, koordinator). Ordbanken er sist oppdatert 2026-11-13.
- Spinen legger dette under gruppeavklaring nr. 4. Det er forsvarlig for godkjenningen, men ikke for selve innføringen.

*Retting:* Legg begrepene inn som forslag i ordbanken, og oppdater `updated`, før kode tar dem i bruk. Dette hindrer ikke spinen som utkast.

**R6 – Lav: Små hull**
- **Fjernede deler:** «fjernede deler etter sin gamle plass» sier ikke hva som skjer når forgjengeren også er fjernet. Testdata har ikke tilfellet.
- **`hent`:** AD-5 sier ikke hva `hent` returnerer når det ikke finnes noen lagret kjøring for varenummeret, for eksempel `ok: true` med `verdi: null`.
- **Uke `null` i Sammenligning:** AD-3 sier ikke eksplisitt hvor uke `null` står innenfor gruppen Eksepsjoner. Det følger trolig av eksepsjonsrekkefølgen, men det står ikke.
- **`companions`:** I frontmatter står fortsatt bare «rubrikk, versjoner, motstander» under `companions`, ikke runde 2 og runde 3.
- **Tidsgrensen på 15 sekunder:** AD-2 avviser innlesinger som tar mer enn 15 sekunder. Det virker bare når innlesingen venter asynkront, slik som i tilfellet med Web Worker som AD-8 beskriver. Synkron tolkning av XML i hovedtråden kan ikke avbrytes med et `Promise.race`. Det bør måles med 1000-radersfilen før NFR-9 regnes som dekket.

## 3. Hindrer noe at spinen står som Carmens individuelle, byggeklare utkast?

**Nei.** Det er ingen kritiske eller høye funn igjen:

- Kontraktene som parallelle spor kunne bygget inkompatibelt, er nå bestemt i AD-3–AD-7, og AD-9 krever at de låses i Story 1 før parallell utvikling: formen på utfall, rekkefølgen på eksepsjoner, signaturene for beregning, endringskodene og eksportarkene.
- R2 og R3 bør rettes i Story 0 og Story 1.
- R5 bør gjøres før koden bruker begrepene.
- R1, R4 og R6 kan tas i samme omgang.

Spinen er Carmens individuelle arkitektur. Gruppeavklaringene 1–11 står fortsatt åpne, og den er ikke gruppevedtatt.
