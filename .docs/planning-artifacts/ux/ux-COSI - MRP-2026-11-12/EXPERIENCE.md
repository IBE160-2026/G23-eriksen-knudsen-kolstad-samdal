---
name: COSI - MRP
status: utkast – må godkjennes av gruppen
author: Carmen Kolstad
created: 2026-11-12
updated: 2026-11-12
sources:
  - ../../prds/prd-COSI - MRP-2026-10-19/prd.md
  - ../../prds/prd-COSI - MRP-2026-10-19/addendum.md
  - ../../prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md
  - ../../prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-09.md
  - ../../../ordbank.md
  - ../designforslag-2026-11-12.md
  - tilbakemelding-prd.md (origin/main, 2026-11-12, ikke merget til Carmen/Branch)
  - Brukergrensesnitt for COSI MRP.md (Sebastians research, origin/Sebastian/Branch, 2026-11-09)
---

# COSI - MRP – Experience Spine

> **Utkast – må godkjennes av gruppen.** Destillert av Carmen Kolstad med `bmad-ux` (BMAD 6.12.0). Visuelle valg står i [DESIGN.md](DESIGN.md), og token-navn som `{colors.accent}` viser dit. Krav og begreper står i PRD-en og ordbanken og gjentas ikke her. Dette dokumentet og DESIGN.md går foran [prototypen](../designforslag-2026-11-12-prototype.html) og [designforslaget](../designforslag-2026-11-12.md) ved avvik. PRD-en går foran alt. `[ASSUMPTION]` markerer det gruppen ikke har bestemt. Se [Åpne designbeslutninger](#åpne-designbeslutninger) nederst.

## Foundation

- **Form:** én nettside for PC i nyere Chrome, Edge og Firefox (NFR-6). Ikke tilpasset mobil i v1.
- **Data:** alt skjer i brukerens nettleser. Ingen innlogging, ingen server for data (NFR-4). Siste vellykkede kjøring per ferdigprodukt lagres lokalt (FR-19, NFR-10).
- **Språk:** all tekst på norsk, samlet slik at engelsk kan legges til (NFR-7). Begrepene følger ordbanken ordrett.
- **UI-system:** ikke valgt. Avgjøres i arkitekturen. `[ASSUMPTION]` Sebastians research foreslår shadcn/ui for skjemaelementer og knapper, og en egenbygd resultattabell. Velges et bibliotek, gjelder DESIGN.md som lag oppå det, og dette dokumentet beskriver bare avvikene fra bibliotekets atferd.
- **Visuell identitet:** [DESIGN.md](DESIGN.md).

## Information Architecture

| Flate | Nås fra | Formål | Krav |
|---|---|---|---|
| Startside | Åpne appen, «Ny kjøring», «Veiledning», «Lagrede kjøringer» | Veiledning i tre steg, nedlasting av mal og testeksempel 01, valg av beregning, opplasting, lagrede kjøringer | FR-1, FR-27, FR-30, FR-21 |
| Valideringsfeil (på startsiden) | Opplasting med feil | Alle feil samlet, ingen beregning | FR-2–FR-4, NFR-9 |
| Resultatside | Vellykket opplasting | Alt om én kjøring, i fast rekkefølge (under) | FR-14–FR-23, FR-30–FR-34 |
| Forklaringspanel (på resultatsiden) | Klikk eller Enter på celle, radnavn eller eksepsjonssymbol | Hvordan et tall er regnet ut, og hvorfor en eksepsjon slo til | FR-18 |

**Resultatsiden, ovenfra og ned** (rekkefølge etter PRD §4.4):

1. **Kjøringslinje** – ferdigprodukt, horisont, fil, tidspunkt, lagringsstatus, «Last opp ny fil», «Eksporter til Excel».
2. **Seksjonsmeny** – Bestillingsforslag (antall) · Endringer (antall) · Kritiske deler (antall) · Resultattabell · Produksjonskapasitet. Ankerlenker, ikke faner (FR-34 krever at begge panelene står på samme side).
3. **Bestillingsforslag** (FR-17).
4. **Endringer siden forrige kjøring** (FR-20). PRD-en sier ikke hvor den står. Den står etter bestillingsforslagene fordi §4.4 sier at brukeren ser dem først.
5. **Kritiske deler** (FR-16).
6. **Resultattabell** (FR-14, FR-15) med forklaringspanelet til høyre når det er åpent.
7. **Produksjonskapasitet** (FR-34), eget panel. Bare når kapasiteten er valgt.

Når brukeren har valgt bare bestillingsplanen, finnes ikke punkt 7. Når brukeren har valgt bare kapasiteten, finnes bare punkt 1 og 7 (FR-30), og seksjonsmenyen skjules.

**Lukket overflate:** hver flate har en brukerreise som lander der (se Key Flows). Kapasitetspanelet har ingen brukerreise i PRD-en. UJ-5 er derfor `[ASSUMPTION]`.

→ Visuell referanse for resultatsiden: [prototypen](../designforslag-2026-11-12-prototype.html), [skjermbildet](../designforslag-2026-11-12-resultatside.png). Startsiden og valideringsfeilene er skissert i prototypens del «4b». Dokumentene går foran ved avvik.

## Voice and Tone

Tekstene er korte, saklige og på brukerens side. De sier hva som skjedde og hva brukeren kan gjøre. Ingen unnskyldninger, ingen utropstegn, ingen KI-preg.

| Gjør | Ikke gjør |
|---|---|
| «Filen har 3 feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.» | «Oops! Noe gikk galt med filen din.» |
| «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten.» (sted og felt først, som UJ-4) | «Ugyldig verdi i celle C5.» |
| «Filen kunne ikke leses. Den er kanskje skadet, eller den er ikke en Excel-fil. Prøv å lagre den på nytt i Excel.» (NFR-9) | «Feil: ParseException» |
| «Første kjøring for Kontorstol Basic. Det finnes ingen tidligere kjøring å sammenligne med.» | «Ingen data tilgjengelig.» |
| «Ingen endringer i bestillingsforslag eller eksepsjoner. Andre tall kan ha endret seg.» (FR-20) | «Ingen endringer.» alene – brukeren kan tro at ingenting er endret |
| «Kjøringen blir ikke lagret, fordi nettleseren ikke tillater lagring. Eksporter til Excel for å ta vare på den.» (NFR-10) | Varsel som forsvinner av seg selv |
| «Filen blir i nettleseren din og sendes ikke til noen server.» (NFR-4) | Juridisk språk om personvern |
| Eksepsjonsmeldinger: hva + når + hva du kan gjøre, med opplysningene FR-9–FR-12 og FR-29 krever. Ordlyden kan forbedres fra fasiten (FR-13) | Andre navn på eksepsjonene enn ordbankens |
| Knappetekster sier hva som skjer: «Last opp ny fil», «Eksporter til Excel», «Slett lagret kjøring», «Lukk» | «OK», «Send», «Fortsett» |
| Meldingene for «Ledetid overskrider horisont» og «Kanseller mottak» sier at de bare gjelder innenfor horisonten (addendum) | Å la brukeren tro at planen dekker tiden etter uke H |

Alle tekster ligger samlet i én meldingskatalog, med én mal per valideringsregel i FR-3 og én per eksepsjonstype (NFR-7).

## Component Patterns

Atferd. Visuelle spesifikasjoner står i DESIGN.md.Components.

| Komponent | Brukes | Atferdsregler |
|---|---|---|
| Opplastingssone | Startside, og bak «Last opp ny fil» | Dra og slipp, og alltid en vanlig «Velg fil»-knapp. Bare én fil. Filtypen kontrolleres uansett hvordan filen kom inn (FR-1). Under lesing og beregning står en statuslinje «Leser filen …» / «Beregner …». Ved feil i selve filen (NFR-9) vises meldingen ved opplastingen, og brukeren kan prøve igjen uten å laste siden på nytt |
| Valg av beregning | Startside | Radiogruppe «Hva vil du beregne?»: Bestillingsplan og produksjonskapasitet (standard) · Bare bestillingsplan · Bare produksjonskapasitet. Én linje hjelpetekst per valg (FR-30). Valget huskes til neste opplasting i samme økt `[ASSUMPTION]` |
| Lagrede kjøringer | Startside | Én linje per ferdigprodukt: navn, varenummer, tidspunkt, «Slett». «Slett» spør i siden selv («Slette lagret kjøring for Kontorstol Pro? Neste opplasting vises uten sammenligning.» med «Slett» og «Avbryt»), ikke med en nettleserdialog (FR-21) |
| Valideringsoppsummering | Startside | Vises alltid ved minst én feil. Står øverst, fokus flyttes dit, og sidetittelen starter med «Feil:». Gruppert per ark i malens rekkefølge (Stykkliste → MPS → Planlagte mottak) med antall per ark, sortert etter rad. Hver linje: ark, rad eller celle, felt, årsak (FR-4). Sier at lagret kjøring er urørt |
| Kjøringslinje | Resultatside | Alltid synlig øverst. Lagringsstatus er tekst, ikke ikon alene. «Last opp ny fil» åpner opplastingen uten å forlate resultatet; ved feil står forrige resultat urørt (NFR-9) |
| Seksjonsmeny | Resultatside | Klikk ruller til seksjonen og setter aktiv seksjon. Antallene oppdateres med kjøringen. «Endringer» viser «–» uten tidligere kjøring |
| Ukefilter | Bestillingsforslag | Ett valg om gangen: «Alle uker» eller én uke (FR-17). Valgt filter er tydelig, og «Alle uker» er alltid første knapp. Uke uten forslag viser «Ingen bestillingsforslag i uke 6.» `[ASSUMPTION]` standard er «Alle uker» |
| Liste over bestillingsforslag | Bestillingsforslag | Sortert etter frigivelsesuke, deretter stykklisterekkefølge. Fast høyde med egen rulling. Forfalt mengde merkes i tekst. Linjene er ikke klikkbare i v1 `[ASSUMPTION]` |
| Endringsliste | Endringer | Gruppert: bestillingsforslag, eksepsjoner, deler, med antall i hver gruppeoverskrift. Linjene følger fasit 03 nøyaktig: en flyttet uke er «Fjernet» + «Nytt», ikke én linje (FR-20). Endret mengde som «130 → 205». De første 5 linjene vises; «Vis alle (11)» utvider |
| Liste over kritiske deler | Kritiske deler | Statisk arbeidsliste, én linje per kritisk del: varenummer, beskrivelse, eksepsjonstyper med uke. Klikk eller Enter ruller til delen i tabellen, markerer delens hode kort og flytter fokus til delens første celle (FR-16). Tabellen sorteres ikke om |
| Resultattabell | Resultattabell | Delene i stykklisterekkefølge; felles del der den står første gang (FR-16). Seks rader per del i rekkefølgen fra FR-14. Én tabulatorstopp for hele tabellen (se Interaction Primitives). Enter, mellomrom eller klikk på en celle åpner eller oppdaterer forklaringspanelet. Klikk på radnavn gir forklaring av hele raden |
| Eksepsjonsmarkering | Resultattabell | `[ASSUMPTION]` Egen rad «Eksepsjoner» i kritiske deler, symbol i ukens kolonne. Flere eksepsjoner i samme uke står side om side. Uke «–» som merke i delens hode (FR-15). Aktivering åpner alle meldingene for uken i panelet |
| Forklaringspanel | Resultattabell | Ikke-modalt. Åpnes ved aktivering, aldri ved peking (FR-18). Står til brukeren lukker det med «Lukk» eller Esc; da går fokuset tilbake til cellen. Mens panelet er åpent, blir fokuset i tabellen, så piltastene flytter til neste celle og panelet følger med. Endringer kunngjøres med `aria-live="polite"`. Innhold i fire lag: (1) svaret i én setning, (2) utregningen med tallene, (3) tallene som lenker til sin egen forklaring, (4) regelen i én setning. Bruttobehov viser bidraget fra hver overordnet del (FR-18, FR-28). Fremskyndet mottak sier eksplisitt «Mottaket på 100 står i uke 4, men er regnet med fra uke 3.» |
| Kapasitetspanel | Produksjonskapasitet | Egen overskrift og ramme (FR-34). Første setning sier at kapasiteten tar med ledetid, men ikke prognostiserte behov. To rader per uke (FR-32), begrensende del med årsak under hvert tall (FR-33). Grunnlaget per del i et utvidbart panel, lukket som standard |
| Eksport | Kjøringslinje | Ett klikk laster ned `.xlsx` med ferdigproduktets navn og dato i filnavnet (FR-22). Med sammenligning: arket «Sammenligning» (FR-23). Kapasiteten er ikke med (FR-30). Statusmelding «Excel-filen er lastet ned.» blir stående til neste handling |

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Første besøk | Startside | Veiledningen i tre steg er åpen. Ingen lagrede kjøringer: «Ingen lagrede kjøringer ennå.» |
| Senere besøk | Startside | Veiledningen kan felles sammen `[ASSUMPTION]`. Lagrede kjøringer vises |
| Leser og beregner | Startside | Statuslinje i en `role="status"`-region. Opplastingen er låst til den er ferdig. Mål: under 3 sekunder (NFR-5) |
| Feil filtype, tom fil, skadet fil, uventet feil | Startside | Én melding ved opplastingen (NFR-9). Ny opplasting mulig uten å laste siden på nytt. Lagret kjøring urørt |
| Valideringsfeil | Startside | Oppsummering øverst (se Component Patterns). Ingen resultattabell. Lagret kjøring urørt (FR-4) |
| Ny fil med feil mens et resultat vises | Resultatside | Feilene vises i opplastingen. Forrige resultat og kjøringslinjen står urørt, og det sies tydelig at tallene gjelder den forrige filen |
| Lagring blokkert | Resultatside | Melding i kjøringslinjen som blir stående (NFR-10). Alt annet virker |
| Første kjøring for ferdigproduktet | Endringer | Informasjonsboks: «Første kjøring for …» (FR-20) |
| Ingen endringer | Endringer | «Ingen endringer i bestillingsforslag eller eksepsjoner.» pluss at andre tall kan ha endret seg |
| Ingen bestillingsforslag | Bestillingsforslag | «Ingen bestillingsforslag i horisonten.» |
| Ingen kritiske deler | Kritiske deler | «Ingen kritiske deler. Planen går opp for alle delene.» Telleren viser 0 |
| Ukefilter uten treff | Bestillingsforslag | «Ingen bestillingsforslag i uke 6.» og «Alle uker» er synlig |
| Bare kapasitet valgt | Resultatside | Bare kjøringslinje og kapasitetspanel. «Eksporter til Excel» er skjult. Lagres ikke (FR-30). Kjøringslinjen sier «Bare produksjonskapasitet. Kjøringen lagres ikke.» |
| Bare bestillingsplan valgt | Resultatside | Ingen kapasitetsseksjon og ingen lenke til den i seksjonsmenyen |
| Ingen begrensende del | Kapasitetspanel | Kan ikke skje når N + 1 alltid kan testes (FR-33). Ingen egen tilstand |
| Felles del | Resultattabell | Én tabell der delen står første gang. Forklaringen av bruttobehov viser hver overordnet del |
| Valgt celle | Resultattabell | Ramme rundt cellen; radnavn og ukeoverskrift fete. Synlig også når panelet er lukket |
| Stor stykkliste (1000 rader) | Resultattabell | `[ASSUMPTION]` Må måles. Utveier hvis for tregt: virtualisering med `aria-rowcount`, eller sammenslåtte deler der eksepsjonsmarkøren fortsatt vises |

## Interaction Primitives

- **Mus og berøring:** klikk eller trykk for å handle. Ingen hover-avhengighet (FR-18). Ingen dra og slipp utenom opplastingen.
- **Tastatur på siden:** Tab følger lesrekkefølgen: appmeny → kjøringslinje → seksjonsmeny → bestillingsforslag → endringer → kritiske deler → resultattabell → forklaringspanel → kapasitet.
- **Tastatur i resultattabellen** `[ASSUMPTION]` (WAI-ARIA grid på en ekte `<table>`): én tabulatorstopp for hele tabellen. Piltastene flytter én celle og stopper ved kanten. Home/End går til første/siste uke i raden, Ctrl+Home/Ctrl+End til første/siste celle i tabellen. Enter eller mellomrom åpner forklaringen. Esc lukker panelet. Avviker fra prototypen, som har én knapp per celle.
- **Fokus etter hopp:** fra kritiske deler til delens første celle. Fra «Lukk» i panelet tilbake til cellen. Fra opplasting med feil til valideringsoppsummeringen.
- **Forbudt:** forklaring ved peking, varsler som forsvinner av seg selv for noe viktig, nettleserdialoger (`confirm`), faner som skjuler kapasitetspanelet, kritiske deler flyttet øverst i tabellen (FR-16), egen ukevisning ved siden av listen (FR-17).

## Accessibility Floor

Atferd. Kontrast står i DESIGN.md.Colors.

- Mål: WCAG 2.1 AA `[ASSUMPTION]`.
- Eksepsjoner, kritiske deler, endringer og begrensende deler vises aldri med farge alene (FR-15, NFR-8). Symbolene har tilgjengelige navn, for eksempel «Bestilling forsinket, uke 1».
- Alt kan gjøres med tastatur alene, også å åpne og lukke forklaringen (FR-18).
- Synlig fokusmarkering på alle interaktive elementer. Faste kolonner og fast tabellhode dekker ikke cellen som har fokus.
- Resultattabellen er en ekte tabell med kolonne- og radoverskrifter. Delens hode er en radgruppe-overskrift, så skjermleseren leser «300-003 Hjul, Nettobehov, Uke 1, 50».
- Statusmeldinger (lesing, beregning, eksport, lagring) kunngjøres i én `role="status"`-region. Forklaringspanelet bruker `aria-live="polite"`.
- Resultattabellen kan rulle sideveis i sitt eget område (unntaket for datatabeller i WCAG 1.4.10), mens resten av siden tilpasser seg bredden.
- Animasjon (kort markering av delen etter hopp) respekterer `prefers-reduced-motion`.

## Responsive & Platform

PC er eneste mål (NFR-6). Under 900 px blir forklaringspanelet et ark nederst på skjermen, og seksjonsmenyen ruller sideveis. Siden skal ikke rulle sideveis utenom tabellene. Ingen egen mobilvisning.

## Inspiration & Anti-patterns

- **Hentet fra lærebøkene og Odoo MPS:** én blokk per del med seks rader og én kolonne per uke.
- **Hentet fra MRPeasy, Odoo og SAP:** handlingsliste og eksepsjoner før hele planen. Det er rekkefølgen i PRD §4.4.
- **Hentet fra formelrevisjon i Excel:** forklaringen viser hvilke tall som ga resultatet, ett ledd om gangen. Brukerne kommer fra Excel.
- **Hentet fra Designsystemet, GOV.UK og Aksel:** feiloppsummering øverst, opplasting med både slippsone og knapp, ordlyd som ikke skylder på brukeren.
- **Forkastet – dashbord med kort og store tall:** sprer informasjonen og bryter rekkefølgen i §4.4.
- **Forkastet – master-detail (én del om gangen, som SAP MD04):** gjør det vanskelig å sammenligne overordnet del og underdel, og FR-16 krever hopp til delen i tabellen.
- **Forkastet – terskler som demper små avvik:** strider mot FR-9–FR-13 og SM-2.
- **Forkastet – fortegn i radnavn («− Bruttobehov», «= Forventet lagerbeholdning»):** radene i FR-14 er ingen løpende sum. Regnestykket hører hjemme i forklaringspanelet.

## Key Flows

Brukerreisene UJ-1 til UJ-4 er fra PRD §2.3. Kari er innkjøper i en liten møbelprodusent. Testdataene er Kontorstol Basic (testeksempel 01) og Kontorstol Pro (testeksempel 02 og 03).

### UJ-1. Kari tar i bruk COSI - MRP første gang.

1. Kari åpner appen. Startsiden viser veiledningen i tre steg og «Ingen lagrede kjøringer ennå.»
2. Hun laster ned testeksempel 01 og laster det opp uendret, med standardvalget «Bestillingsplan og produksjonskapasitet».
3. Resultatsiden åpnes. Endringer viser «Første kjøring for Kontorstol Basic.»
4. Hun klikker på hjul, uke 1, i tabellen. Panelet viser at nettobehovet er 50: lager 80 + mottak 0 − bruttobehov 100 = −20, og SS 30 − (−20) = 50.
5. Hun går tilbake til startsiden, laster ned den tomme malen og fyller ut stolen. Kontroll-kolonnen i Excel viser at ledetiden mangler på én rad, og hun retter det.
6. **Høydepunkt:** Hun laster opp sin egen fil og ser bestillingsforslagene, de kritiske delene og tabellen for sin egen stol, uten sammenligning.

Feilsti: filen er en `.xls` → meldingen ved opplastingen sier at appen bare tar imot Excel-malen (`.xlsx`) (FR-1).

### UJ-2. Kari oppdaterer planen og ser hva hun må bestille.

1. Kari laster opp ukens fil. Bestillingsforslagene står øverst.
2. Hun velger «Uke 1» i filteret og ser at hun må bestille 175 hjul, merket «50 forfalt».
3. Seksjonsmenyen viser 4 kritiske deler. Hun velger gassfjær i listen, og tabellen ruller til delen.
4. Eksepsjonen i uke 3 viser at mottaket på 100 i uke 4 må fremskyndes til uke 3.
5. Hun bestiller hjulene, ringer leverandøren av gassfjær og klikker «Eksporter til Excel».
6. **Høydepunkt:** Hun har handlet på alt i uke 1 uten å regne selv, og har planen som Excel-fil.

Unntak: hun lurer på hvorfor nettobehovet for hjul er 50 i uke 1 → hun aktiverer cellen og leser forklaringen i panelet. Feilsti: lagring er blokkert → kjøringslinjen sier at kjøringen ikke lagres, og at hun kan eksportere.

### UJ-3. Kari ser hva en ny kundeordre betyr.

1. Kari endrer prognostiserte behov i uke 2 fra 30 til 45 og klikker «Last opp ny fil».
2. Seksjonsmenyen viser antall endringer. Hun leser bestillingsforslagene og går så til Endringer.
3. Endringslisten sammenligner med morgenens kjøring for Kontorstol Pro: hjul 130 → 205, nytt forslag på 30 skruesett M6, ny eksepsjon «Bruk av sikkerhetslager» for hjul, og mottaket på 40 rygger må nå fremskyndes til uke 2 i stedet for uke 3.
4. **Høydepunkt:** Hun ser at endringen ga det hun ventet, og hvilke nye problemer den skapte, uten å sammenligne tabellene selv.

Unntak: hun vil starte på nytt → «Slett lagret kjøring» på startsiden; neste opplasting vises uten sammenligning (FR-21).

### UJ-4. Kari retter feil etter å ha kopiert filen.

1. Kari laster opp forrige ukes fil etter å ha flyttet ukene ett hakk.
2. Ingen beregning. Valideringsoppsummeringen øverst sier «Filen har 3 feil. Ingenting er beregnet.» og at den lagrede kjøringen er urørt.
3. Feilene står per ark: MPS, uke 11; Planlagte mottak, rad 4 (uke 0); Planlagte mottak, rad 5 («ca. 40»).
4. Hun retter alle tre i Excel og laster opp igjen fra samme side.
5. **Høydepunkt:** Andre forsøk går gjennom, og sammenligningen bruker den lagrede kjøringen fra før feilen.

### UJ-5. Kari får en hasteforespørsel. `[ASSUMPTION]`

Ikke i PRD-en. Foreslått i `tilbakemelding-prd.md` §4.2. Bruker testeksempel 05 (Kontorstol Kompakt).

1. En kunde spør hvor mange Kontorstol Kompakt som kan være ferdige innen uke 4.
2. Kari laster opp filen og velger «Bare produksjonskapasitet».
3. Kjøringslinjen sier at kjøringen ikke lagres. Kapasitetspanelet sier at kapasiteten tar med ledetid, men ikke prognostiserte behov.
4. Hun leser raden «Fra lager»: 30 i uke 4, begrenset av 300-033 Ryggplate (lager). Raden med planlagte mottak gir også 30 i uke 4, men 35 fra uke 7.
5. **Høydepunkt:** Hun kan svare kunden «30 innen uke 4», og vet at ryggplatene er det hun må skaffe flere av for å love mer.

## Brukertest (SM-3)

`[ASSUMPTION]` PRD §9 nr. 4 er åpen. Forslag fra `tilbakemelding-prd.md` §4.3, som passer med flatene over:

1. Finn en kritisk del.
2. Forklar en eksepsjon med egne ord.
3. Les av mengde og frigivelsesuke for ett bestillingsforslag.

Løst betyr riktig svar innen 3 minutter uten hjelp. Testeksempel 01 utløser fire av fem eksepsjonstyper (ingen «Kanseller mottak»). Introduksjonen, datoen og hvor resultatet dokumenteres, bestemmer gruppen.

## Åpne designbeslutninger

| # | Spørsmål | Forslag i dette utkastet | Kilde til uenighet |
|---|---|---|---|
| 1 | Eksepsjonsrad per kritisk del, eller én markør i en tallcelle? | Eksepsjonsrad | Prototypen mot Sebastians research |
| 2 | Tastatur i tabellen: én knapp per celle eller WAI-ARIA grid? | Grid med én tabulatorstopp | Prototypen mot research, NFR-5 |
| 3 | Standardfilter for bestillingsforslag: alle uker eller uke 1? | Alle uker | UJ-2 mot FR-17 |
| 4 | Kompakt tabellvisning (bare forventet lagerbeholdning og frigivelser)? | Ikke i v1 | Designforslaget §7 |
| 5 | Overskrift for kapasiteten: «Produksjonskapasitet fra lager» eller et spørsmål som «Hvor mange ferdigprodukter kan være ferdige?» | «Produksjonskapasitet fra lager», med forklarende setning under | Designforslaget mot research |
| 6 | Forfalt mengde: egen merkelapp eller «175 (50 forfalt)»? | Egen merkelapp | Prototypen mot research |
| 7 | 0 som tall eller tom celle? | Tall i `ink-secondary` | Research: ingen kilde avgjør |
| 8 | Mørk modus i v1? | Nei, tokens beholdes | Research: utsett |
| 9 | UJ-5 og brukertestens oppgaver inn i PRD-en? | Skissert her som `[ASSUMPTION]` | tilbakemelding-prd.md |
| 10 | Ytelse ved 1000 rader: virtualisering eller sammenslåtte deler? | Mål først | NFR-5 |
| 11 | Hvor skal UX-dokumentene ligge: `ux/` (her) eller BMADs standard `ux-designs/`? | `ux/` | BMAD-config |
