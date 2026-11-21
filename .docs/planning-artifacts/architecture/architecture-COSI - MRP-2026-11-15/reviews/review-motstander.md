# Motstander-gjennomgang – ARCHITECTURE-SPINE.md (2026-11-21)

Uavhengig motstander-anmelder (BMAD reviewer gate, «adversary»), egen kontekst. Grunnlag: `ARCHITECTURE-SPINE.md` og `.memlog.md` i denne mappen, og PRD, addendum, `testdata/README.md` og `testdata/validering/README.md` på origin/main `8b3fba0`. Fasitarkene Sammenligning (fasit 03), Bestillingsforslag, Eksepsjoner og Kapasitet (fasit 05) er lest for å kontrollere formene. Ingen andre gruppemedlemmers arbeid er lest.

Metode: for hvert hull konstrueres to enheter (stories eller moduler bygd parallelt) som hver følger alle AD-er og konvensjoner bokstavelig, men som ikke passer sammen.

## Dom

Spinen låser lag og importretning godt, men de delte dataformene den selv kaller bindende (Rådata, Grunnlagsdata, Kjøring, LagretKjøring, Sammenligning, eksepsjonsparametere, kapasitetsresultat, Utfall) er bare navngitt og ikke formet. Derfor kan fire utviklere følge hver AD og likevel levere moduler som feiler fasittestene for FR-20, FR-23, FR-30 og V-F06 når de settes sammen.

## Oversikt

| # | Grad | Hull | Krasjer mot |
| --- | --- | --- | --- |
| 1 | Kritisk | Beregningsvalget (FR-30) er ikke inndata til `flyt/` | FR-30 (lagres ikke), FR-19, FR-20 |
| 2 | Kritisk | Eksepsjonsparametere er ikke selvbærende | FR-20 «Borte», FR-23, FR-10, FR-12, FR-13 |
| 3 | Kritisk | Uke «–» har ingen representasjon. Identiteten overlever ikke JSON | FR-20 «samme fil to ganger» |
| 4 | Kritisk | Malnavn og Plassering har tre eiere, og `kjerne/` og `tekster/` kan ikke nå dem | FR-2, FR-4, SM-4, AD-7 |
| 5 | Høy | To produsenter av strukturfeil (FR-2) og to steder som slår sammen og sorterer | V-F06 (2 feil), V-F01–F03 |
| 6 | Høy | Sammenligningen har ingen form, rekkefølge eller del-linje | FR-20, FR-23, fasit 03 |
| 7 | Høy | Eksepsjonsidentiteten er ikke unik (to «Mottak forsinket» i én celle) | FR-20, testeksempel 04 (300-028) |
| 8 | Høy | Forklaringer (FR-18) mangler mellomverdier i Kjøring | FR-18, AD-2 (én regel ett sted) |
| 9 | Høy | Bestillingsforslag: art, forfalt mengde og sortering har ingen eier | FR-17, FR-22 |
| 10 | Høy | Grunnlagsdata: rader eller deler, mottak per rad eller per uke, nivå for felles del | FR-6, FR-12, FR-14, FR-29 |
| 11 | Høy | `lagring/`: streng eller objekt inn og ut | FR-19, FR-20 |
| 12 | Middels | Filnavn og dato i eksporten | FR-22 |
| 13 | Middels | Eksportens oppsett og fasittesten bruker tekster | FR-22, NFR-7 |
| 14 | Middels | Kapasitetsresultatet har ingen form. Regelen for ledig beholdning kan havne i `ui/` | FR-31–FR-34, SM-7 |
| 15 | Middels | Ingen tabell over hvilke kontroller som hoppes over når noe mangler | FR-2 (fjerde konsekvens) |
| 16 | Middels | Valgt del og celle: format og eier (reducer, lokal tilstand eller hash) | FR-16, FR-18, FR-21 |
| 17 | Middels | Trimming og tekstlagrede tall er utsatt, men gir allerede ulik oppførsel | FR-3, AD-2 |
| 18 | Lav | Hvem setter `tidspunkt` i Kjøring | FR-8, AD-3 |
| 19 | Lav | Arkitekturtesten håndhever ikke «bare typer» eller forbudet mot klokke | AD-2, AD-8 |
| 20 | Lav | Uke utover 12 i MPS, og varenummer med ledende nuller | FR-3, FR-19 |

---

## Kritisk

### 1. Beregningsvalget (FR-30) er ikke inndata til `flyt/`

- **Enhet A (`flyt/`-utvikler):** AD-6 bestemmer signaturen: flyten tar «bytes + filnavn, lagringen og klokken» og kjører «les → valider → beregn → les forrige → sammenlign → lagre». Utvikleren gjør nøyaktig dette, alltid, og returnerer `vellykket` med kjøring, sammenligning og kapasitet.
- **Enhet B (`ui/`-utvikler):** AD-6 legger «beregningsvalg (FR-30)» i felles tilstand i `ui/`. Utvikleren skjuler resultattabellen når bare kapasiteten er valgt, og regner med at det er nok.
- **Krasj:** En kjøring der bare kapasiteten er valgt, blir lagret og sammenlignet. Det bryter FR-30 («lagres ikke og endrer verken den lagrede kjøringen eller før/etter-sammenligningen») og AD-3s egen regel. Kapasiteten (2 × H binærsøk) beregnes også når den ikke er valgt (NFR-5). Videre sier AD-6 at «en ny kjøring erstatter den gamle i tilstanden bare når den er vellykket». Hvis en kjøring med bare kapasiteten for fil B ikke regnes som en ny Kjøring, viser og eksporterer `ui/` bestillingsplanen fra fil A (kanskje et annet ferdigprodukt) sammen med kapasiteten for fil B. Det er heller ikke avgjort om et endret valg etter opplasting krever ny opplasting. Bytene er ikke tatt vare på noe sted.
- **Ny regel (AD-6):** `kjorFil({ bytes, filnavn, valg, lagring, naa })`, der `valg: { bestillingsplan: boolean; kapasitet: boolean }` og minst én er sann. `flyt/` avgjør alene om den beregner, sammenligner og lagrer: `lagre` og `sammenlign` kalles bare når `valg.bestillingsplan`. Utfallet `vellykket` har `kjoring: Kjoring | null` og `kapasitet: Kapasitet | null`, og et vellykket utfall erstatter alltid hele resultatet i tilstanden, også feltene som er `null`. Endres valget, kreves ny opplasting (eller: `flyt/` beholder siste bytes i minnet, men da må det besluttes). Flyttesten skal dekke FR-30s tredje konsekvens.

### 2. Eksepsjonsparametere er ikke selvbærende

- **Enhet A (`kjerne/`, eksepsjoner):** AD-7 sier «type + parametere» og at Grunnlagsdata ligger i Kjøring (K2). Utvikleren lager normaliserte parametere, for eksempel FR-10 `{ overordnede: ['200-001'] }`, FR-9 `{ sti: ['100-001','300-005'] }` og FR-12 `{ mottaksuke, antall, tilUke }`. Navn og type slås opp i `kjoring.grunnlag` ved visning.
- **Enhet B (`tekster/`):** Utvikleren skriver `tekstForEksepsjon(e, kjoring)`, som slår opp beskrivelse og type i Kjøring.
- **Krasj:** «Borte»-linjene i Sammenligning (fasit 03) viser den gamle meldingen, og den finnes bare i LagretKjøring. Der står bare `deler (varenummer, beskrivelse)`, ingen type, ingen overordnede deler og ingen ledetider. FR-12 kan da ikke si «hos leverandøren» eller «i egen produksjon». FR-9 kan ikke vise stien med ledetider («Kontorstol Pro 1 + Gassfjær 12»). FR-10 kan ikke avgjøre «Leveranse til kunde» eller «Produksjonen av <overordnet del>» for en del som er fjernet fra stykklisten. FR-13-testen i AD-7 går grønn for nye kjøringer og feiler for lagrede. Hvis en utvikler i stedet lagrer alt, vokser formatet uten versjonsregel.
- **Ny regel (AD-7):** Hver eksepsjonstype har én lukket parametertype i `kjerne/` med alle opplysningene som teksten krever, denormalisert: navn og varenummer for overordnede deler, `leveranseTilKunde: boolean`, `hvor: 'leverandor' | 'egenProduksjon'`, stien som `{ varenummer, beskrivelse, ledetid }[]`, og tall før og etter fremskynding. `tekster/` har signaturen `(e: Eksepsjon) => string` og får ingen tilgang til Kjøring eller Grunnlagsdata. Parametertypene er en del av LagretKjøring-versjonen. En test gjengir alle «Borte»-meldingene i fasit 03 fra et utdrag alene.

### 3. Uke «–» har ingen representasjon, og identiteten overlever ikke JSON

- **Enhet A (`kjerne/`, eksepsjoner):** Ukekonvensjonen sier at alle eksterne data bruker uke 1 til H, og hjelpefunksjonene avviser alt annet. For FR-9 skriver utvikleren `uke?: number` (feltet utelates).
- **Enhet B (`kjerne/`, sammenligning, eller `tekster/`):** Utvikleren skriver `uke: number | null`, eller strengen `'–'` slik fasiten gjør, og bygger nøkkelen `${varenummer}|${uke}|${type}`.
- **Krasj:** `JSON.stringify` dropper `undefined`, så etter en tur gjennom localStorage gir den lagrede eksepsjonen `undefined`, og den nye har `null` eller `'–'`. Nøklene blir ulike, og «Ledetid overskrider horisont» står både som «Ny» og som «Borte» ved hver opplasting. Testen «samme fil to ganger gir ingen endringer» (FR-20) feiler, og 300-005 i 02→03 gir to falske linjer. Ukehjelperen avviser uke «–», så sortering og eksport behandler den ulikt (`'–'` som tekst eller 0).
- **Ny regel (konvensjon Uker):** Eksepsjoner har `uke: number | null`. `null` betyr «hele delen» og skrives som `null` i JSON. Ingen andre former er lovlige. `'–'` finnes bare i `tekster/` og i eksportcellen. Identiteten lages bare av `eksepsjonsNokkel(e)` i `kjerne/`, og sorteringen plasserer `null` først for en del. En test sender en Kjøring gjennom utdrag, JSON og tolkning og krever null forskjeller.

### 4. Malnavn og Plassering har tre eiere, og `kjerne/` og `tekster/` kan ikke nå dem

- **Enhet A (`inn/`):** AD-2 sier at malens ark- og kolonnenavn er konstanter i `inn/`. Utvikleren leverer `Radata` nøklet på Excel-navnene (`'Planlagte mottak'`, `'Ledetid (uker)'`) og plassering som `{ rad: 7 }`, der 7 er indeksen i datalista (0-basert, uten overskrift).
- **Enhet B (`kjerne/`, validering):** `kjerne/` importerer ingenting. Utvikleren lager sine egne arknøkler (`'stykkliste' | 'mps' | 'planlagteMottak'`, ASCII etter navnekonvensjonen), egne feltnøkler og `Plassering = { ark, celle: 'D9' }`, og regner kolonnebokstaven fra en egen tabell. Sorteringen etter «ark, rad eller uke, kolonne» bruker sine egne nøkler.
- **Enhet C (`tekster/`):** Feilen må vise «Planlagte mottak, rad 4, Uke» (UJ-4). AD-7 sier at malnavnene ikke ligger i `tekster/`, og `tekster/` kan ikke importere `inn/`. Utvikleren skriver navnene på nytt.
- **Krasj:** Kontrakten med Excel-malen finnes tre steder (strid med AD-2 «hver regel ett sted»). `kjerne/` slår opp `'ledetidUker'` i en Rådata nøklet på `'Ledetid (uker)'` og finner ingenting. Radnumrene blir feil med én eller to, mens V-S01 krever «rad 9» og V-S03 «rad 1002». V-S22 bruker «rad 12», V-F02 «H1» (overskriften som mangler, så den finnes ikke i filen) og V-M02 «uke 10», så tre plasseringsformer skal sorteres mot hverandre uten noen regel.
- **Ny regel (AD-2 og AD-7):** Rådata-typen i `kjerne/` bestemmer ASCII-nøkler for ark og felt (`stykkliste.nivaa`, `stykkliste.ledetidUker` …). Malkontrakten (Excel-navn, kolonnebokstav og rekkefølge per nøkkel) er én ren datatabell i `kjerne/mal.ts`, som `inn/` bruker til å finne kolonnene og `tekster/` bruker til å vise navnene. `inn/` leverer `rad` som Excel-radnummer (1-basert, overskriften er rad 1) og `kolonne` som Excel-bokstav, også for en manglende overskrift. `Plassering = { ark } | { ark, rad } | { ark, rad, kolonne } | { ark, uke }` som diskriminert union med én sammenligningsfunksjon i `kjerne/`. Kolonnene finnes på fast plass (A–H, A–C), og overskriften sammenlignes eksakt etter trimming.

## Høy

### 5. To produsenter av strukturfeil og to steder som slår sammen

- **A (`inn/`):** AD-2 sier at `inn/` eier FR-2. Memlog sier at begge lag gir samme Valideringsfeil-form. `inn/` lager derfor en Valideringsfeil for overskriften som mangler.
- **B (`kjerne/`):** AD-2 sier også at `inn/` bare «rapporterer hvilke ark og kolonner som mangler» i Rådata. `kjerne/` ser `manglende` og lager feilen selv, slik at listen blir fullstendig.
- **Krasj:** V-F06 gir 3 feil i stedet for 2, og V-F01–F03 gir 2 i stedet for 1. Sammenslåingen er «samlet i `flyt/`» (kapabilitetskartet), mens sorteringen er en AD-7-regel som naturlig ligger i `kjerne/`. Begge sorterer, eller ingen gjør det.
- **Ny regel:** `inn/` lager aldri Valideringsfeil. Den fyller `Radata.manglendeArk` og `Radata.manglendeKolonner`. Én funksjon, `validerRadata(r)` i `kjerne/`, lager alle valideringsfeil (også FR-2) ferdig sortert. `flyt/` sender listen videre uendret. Avvisninger (FR-1, NFR-9) er en egen kode og aldri en Valideringsfeil.

### 6. Sammenligningen har ingen form, rekkefølge eller del-linje

- **A (`kjerne/`, sammenligning):** AD-3 sier «ren funksjon over to LagretKjøring». Utvikleren returnerer `{ forslag: { nye, endrede, fjernede }, eksepsjoner: { nye, borte }, deler: { nye, fjernede } }` som mengder uten rekkefølge.
- **B (`eksport/`, FR-23) og C (`ui/`):** Begge trenger linjene slik fasit 03 viser dem: `Hva, Endring, Varenummer, Uke, Før, Etter, Melding`. Forslagene kommer først, sortert etter stykklistens rekkefølge og deretter uke (100-001, 200-001, 300-001, 300-002/1, 300-002/2, 200-002/3, 300-003, 300-004), og for eksepsjoner står typen i Før eller Etter. `eksport/` og `ui/` bygger hver sin flatning og sortering.
- **Krasj:** To eiere av samme regel. Sorteringen bruker stykklistens rekkefølge, men for fjernede deler finnes den bare i det gamle utdraget, og ingen regel sier hvordan gammel og ny rekkefølge flettes. Ingen fasit viser en del-linje (FR-20 «deler som er nye eller fjernet»), så `eksport/` skriver `Hva = 'Del'` og `ui/` noe annet. FR-23-testen blir avhengig av hvem som skrev den.
- **Ny regel (AD-3):** `Sammenligning` er en ferdig sortert liste av `SammenligningLinje { hva: 'bestillingsforslag' | 'eksepsjon' | 'del'; endring; varenummer; uke: number | null; for; etter; eksepsjon?: Eksepsjon }`, laget bare i `kjerne/`. `LagretKjoring.deler` lagres i stykklistens rekkefølge. Rekkefølgen er: hva, deretter delens plass (ny rekkefølge, og fjernede deler etter sin gamle forgjenger), deretter uke. Del-linjens form besluttes og legges inn i ordbanken og testdata.

### 7. Eksepsjonsidentiteten er ikke unik

- **A (`kjerne/`, eksepsjoner):** FR-6 og testeksempel 04 (300-028) gir to «Mottak forsinket» i samme celle. Utvikleren lager to eksepsjoner.
- **B (`kjerne/`, sammenligning):** FR-20 og AD-7 sier at identiteten er varenummer + uke + type. Utvikleren bruker `Map<nøkkel, Eksepsjon>`.
- **Krasj:** Den ene forsvinner i Map-en. Forsvinner bare ett av de to fremskyndede mottakene i neste kjøring, viser sammenligningen ingen endring. Hvis utdraget dedupliserer på samme måte, mister «Borte»-meldingen også det andre mottaket.
- **Ny regel:** Eksepsjoner sammenlignes som multimengde: antall per nøkkel, og differansen gir «Ny» eller «Borte». Alternativt tas mottaksuken med i identiteten for «Mottak forsinket» og «Kanseller mottak», men det krever en PRD-avklaring. Legg til en test med to like nøkler.

### 8. Forklaringer (FR-18) mangler mellomverdier

- **A (`kjerne/`, MRP):** Utvikleren leverer resultattabellen med de seks radene i FR-14 og ingenting mer.
- **B (forklaring, `kjerne/` eller `ui/` – kartet tillater `ui → kjerne` med «rene hjelpere, f.eks. forklaringer»):** FR-18 krever for 300-003 uke 1: lagerbeholdning 80, disponibel −20, SS 30, nettobehov 50, bidraget fra hver overordnet del og hvilke mottak som er fremskyndet. Disponibel og beholdning(t−1) med fremskyndede mottak finnes ikke i de seks radene, så utvikleren regner FR-6 på nytt.
- **Krasj:** FR-6 finnes da to steder (strid med AD-2). Forklaringen viser andre tall enn tabellen i uker med fremskyndede mottak. FR-10 og FR-12 bruker også ulik disponibel (etter eller før fremskynding), og bare kjernen kjenner forskjellen.
- **Ny regel:** Kjøring har per del og uke et sporingsfelt (`beholdningForrige`, `disponibelFor`, `disponibelEtter`, `fremskyndet: { fraUke, antall }[]`, `forfaltMengde`, `bidrag: { overordnet, antall, frigivelse }[]`). `forklar(kjoring, celleId)` er en ren funksjon i `kjerne/` som bare leser Kjøring og returnerer strukturerte data. `tekster/` gjengir dem. `ui/` regner ingenting.

### 9. Bestillingsforslag: art, forfalt mengde og sortering har ingen eier

- **A (`ui/`):** Utvikleren utleder art fra typen i visningen: `type === 'Komponent (Produseres selv)' ? 'produksjonsordre' : 'innkjop'`, og Ferdigvare blir dermed innkjøp.
- **B (`eksport/`):** Utvikleren utleder art riktig (Ferdigvare er en produksjonsordre) og sorterer bare etter uke, i den rekkefølgen `Array.sort` gir.
- **Krasj:** Skjermen og eksporten viser ulik art for 100-001. Forfalt mengde (fasitkolonnen «Forfalt mengde») har ingen kilde i Kjøring. Rekkefølgen innenfor samme uke er udefinert, mens fasiten bruker stykklistens rekkefølge.
- **Ny regel:** `Bestillingsforslag { varenummer; frigivelsesuke; mengde; art: 'innkjop' | 'produksjonsordre'; forfaltMengde: number }` lages i `kjerne/`, sortert etter uke og deretter stykklistens rekkefølge. `ui/` og `eksport/` utleder aldri art.

### 10. Grunnlagsdata har ingen form

- **A (`kjerne/`, validering):** Utvikleren lager Grunnlagsdata som typede stykklisterader i filens rekkefølge og mottak per rad.
- **B (`kjerne/`, MRP):** Utvikleren forventer en delgraf (`Del` med `foreldre: { varenummer, antall }[]`, lavnivåkode) og mottak summert per varenummer og uke (FR-6 «legges sammen»).
- **Krasj:** Begge bygger grafen, eller ingen gjør det. FR-29 («et planlagt mottak») og FR-12 («mottaket, uke og antall») er tvetydige for 300-027 (to mottak i samme uke): gir de én eller to eksepsjoner, og med summen eller hvert antall? Utviklerne velger ulikt. For en felles del på .1 og ..2 (300-023) viser `ui/` nivået fra første forekomst og `eksport/` lavnivåkoden (FR-14 «nivå»).
- **Ny regel:** Grunnlagsdata = `{ ferdigprodukt, horisont, mps: number[], deler: Del[] (stykklistens rekkefølge, første forekomst), mottak: { varenummer, uke, antall, rad }[] }`. `Del` har `nivaa` (første forekomst, det som vises), `lavnivakode` (brukes i beregningen) og `foreldre`. Grafen bygges bare av valideringen. Det besluttes at mottak i samme uke er én enhet i FR-6, FR-12 og FR-29, og det testes med 300-027.

### 11. `lagring/`: streng eller objekt

- **A (`lagring/`):** AD-5 sier «returnerer rå JSON». Utvikleren tar et objekt i `lagre` og kaller `JSON.stringify` selv, og `hent` returnerer `JSON.parse`-et innhold («rå» betyr ikke tolket).
- **B (`flyt/`):** Tolkningen ligger i `kjerne/`, så utvikleren lar `kjerne/` lage strengen og sender den til `lagre`.
- **Krasj:** Strengen kodes to ganger. Tolkningen merker hver post som «ulesbar», og sammenligningen vises aldri. Med minnebaserte erstatninger i begge enhetstestene går alt grønt.
- **Ny regel (AD-5):** `lagring/` tar og gir bare `string`: `lagre(varenummer, tekst)`, `hent(varenummer) → { ok, tekst | null }` og `list() → { varenummer, tekst }[]`. Serialisering og tolkning (`tilLagringstekst` og `tolkLagret`) ligger bare i `kjerne/`. Flyttesten bruker en ekte Storage-erstatning og en runde gjennom JSON.

## Middels

### 12. Filnavn og dato i eksporten (FR-22)

`eksport/` returnerer bytes, og `ui/` starter nedlastingen. Ingen eier filnavnet. `ui/` bruker `new Date()` lokalt ved nedlasting, og `eksport/` foreslår et navn fra `kjoring.tidspunkt` (UTC). Etter midnatt norsk tid gir de ulik dato. En utvikler bruker ASCII-konvensjonen («filnavn er ASCII») på eksportfilen og skriver «Kontorstol-Gron», så filnavnet ikke lenger «inneholder ferdigproduktets navn». En annen bruker et navn med `/` og får et ugyldig filnavn på Windows.
**Regel:** `eksport/` returnerer `{ bytes, filnavn }`. Filnavnet lages av en funksjon i `tekster/`: navnet med æøå beholdt, bare `\/:*?"<>|` erstattes, og datoen er den lokale datoen for `kjoring.tidspunkt`. ASCII-konvensjonen gjelder bare kildefiler.

### 13. Eksportens oppsett og fasittesten

Etikettene i eksporten (arknavn, «Bruttobehov», «Uke 1») ligger i `tekster/` (AD-7). Testutvikleren leser eksportfila ved å matche fasitens norske strenger, mens eksportutvikleren legger radtypene som kolonner (en UX-variant). Tallene er «identiske», men testen finner dem ikke, og med engelsk (NFR-7) brytes fasittesten.
**Regel:** Eksportens oppsett for resultattabell, bestillingsforslag, eksepsjoner og Sammenligning er fasitens oppsett. Fasittesten finner celler etter posisjon eller etter ID-er fra `kjerne/mal.ts` eller tekstnøkler, ikke etter ordlyd.

### 14. Kapasitetsresultatet har ingen form

FR-34-tabellen viser ledig beholdning per del. `ui/` regner `max(0, lager − SS)` i visningen, og regelen finnes da to steder. FR-33: én utvikler gir én årsak per del, en annen gir begge når begge slår til. Ved likhet (FR-33 «vis begge») sorterer `kjerne/` etter varenummer, mens fasit 05 bruker stykklistens rekkefølge.
**Regel:** `Kapasitet { rader: { fraLager: number[]; medMottak: number[] }; begrensende: { rad, uke, varenummer, arsak: 'lager' | 'ledetid' }[]; grunnlag: { varenummer, lager, ss, ledig, ledetid, mottak: number[] }[] }` lages i `kjerne/`, i stykklistens rekkefølge, med en regel for hvilken årsak som går foran når begge slår til.

### 15. Ingen tabell over hvilke kontroller som hoppes over

FR-2 sier bare «kontroller som avhenger av det som mangler». Mangler Stykkliste (V-F03), kan ikke «Varenummer finnes i Stykkliste» kontrolleres for Planlagte mottak. Én utvikler hopper over kontrollen, en annen melder hvert mottak som ukjent, og da gir V-F03 flere enn 1 feil hvis den gamle malen har mottak. Det samme gjelder manglende «Type» og regelen «kjøpes inn har ingen underdeler».
**Regel:** En avhengighetstabell i `kjerne/` (regel → ark og felt den trenger), som `validerRadata` bruker, med én test per rad i tabellen.

### 16. Valgt del og celle: format og eier

FR-16 («gå fra sammendraget til delen») går på tvers av komponenter. Én utvikler legger valgt del i reduceren, en annen i hashen (`#/resultat/300-003`, med varenummer som kan inneholde `/` eller æøå mot ASCII-regelen for adresser), og en tredje bruker lokal tilstand (AD-6). Celle-ID-en for forklaringspanelet har ikke noe format (uke eller indeks?). Slettes den lagrede kjøringen for produktet som vises (FR-21), er det ikke bestemt om sammenligningen i tilstanden fjernes.
**Regel:** `celleId = { varenummer, rad: Radtype, uke: number | null }` er definert i `kjerne/`. Navigasjon til en del skjer gjennom én handling i reduceren, ikke gjennom hashen. Sletting oppdaterer tilstanden bare gjennom reduceren, og visningen avgjør om sammenligningen står.

### 17. Trimming og tekstlagrede tall gir allerede ulik oppførsel

Spinen sier at `inn/` leverer cellene «rått». `read-excel-file` trimmer som standard (memlog). Én `inn/`-utvikler slår av trimmingen for å være «rå», en annen beholder den, og da gir «300-001 » og «300-001» ulike deler eller samme del. Spinens egen rubrikk sier at det som er utsatt, ikke kan gi divergens, men dette punktet gjør det.
**Regel:** Avgjør nå, uten å vente på gruppen: `inn/` beholder bibliotekets trimming (lesing, ikke validering), og `kjerne/` avviser tekst i tallfelt. Valget kan endres når gruppen har bestemt noe annet.

## Lav

### 18. Hvem setter `tidspunkt`

AD-3 sier at Kjøring inneholder et tidspunkt, men `kjerne/` kan ikke bruke klokken. Én utvikler lar `beregn(grunnlag, tidspunkt)` ta tidspunktet som parameter, en annen lar `flyt/` lage `{ ...kjoring, tidspunkt }`. Signaturene passer ikke sammen, og fasittestene som sammenligner hele Kjøring, feiler på tidspunktet.
**Regel:** `beregn(grunnlag, valg, tidspunkt)`, og fasittestene ser bort fra `tidspunkt`.

### 19. Arkitekturtesten håndhever for lite

«lagring → kjerne (typer)» og «tekster → kjerne (typer)» håndheves ikke. `lagring/` kan kalle tolkningen selv, og da tolkes data to steder. Bruk av `Date`, `Math.random` og `window` i `kjerne/` fanges heller ikke.
**Regel:** Arkitekturtesten krever `import type` for kanter merket «typer» og avviser `Date.now`, `new Date(` uten argument, `Math.random`, `window`, `document` og `localStorage` i `src/kjerne/`.

### 20. Uke utover 12 i MPS, og varenummer med ledende nuller

Leser `inn/` «hele det brukte området», kan en uke 13 i MPS gi H = 13 og feilen «8–12» hos én utvikler, mens en annen leser bare malens 12 uker og ikke melder noe. Varenummeret `000123` som tekst og `123` som tall blir ulike nøkler i lagringen (NFR-11 nevner bare like sifre). Begge tilfeller bør avgjøres i én setning hver og få hver sin test.

---

## Konklusjon for Carmen

Hull 1–4 må lukkes før epics deles ut. De rammer akkurat grensene mellom `inn/`-, `kjerne/`-, `flyt/`- og `ui/`-arbeidet som skal gå parallelt fra trinn 1a og 1b. Det raskeste tiltaket er en ny AD-9 «Delte dataformer» med TypeScript-typene for Rådata, Plassering, Grunnlagsdata, Kjøring (med sporingsfelt), Bestillingsforslag, Eksepsjon (parametere per type), LagretKjøring, SammenligningLinje, Kapasitet og Utfall, skrevet som én fil `src/kjerne/typer.ts` før noen story starter. Typene skal ha runde-tester gjennom JSON og mot fasitarkene Sammenligning (03), Bestillingsforslag og Kapasitet (05).
