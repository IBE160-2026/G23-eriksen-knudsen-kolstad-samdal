---
name: COSI - MRP
status: draft
sources:
  - "{planning_artifacts}/prds/prd-COSI - MRP-2026-10-19/prd.md"
  - "{planning_artifacts}/prds/prd-COSI - MRP-2026-10-19/addendum.md"
  - "{planning_artifacts}/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md"
  - "{planning_artifacts}/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-09.md"
  - "{planning_artifacts}/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-13.md"
  - "{planning_artifacts}/prds/prd-COSI - MRP-2026-10-19/tilbakemelding-prd.md"
  - "{planning_artifacts}/briefs/brief-COSI - MRP-2026-09-13/brief.md"
  - "{planning_artifacts}/research/reports/Brukergrensesnitt for COSI MRP.md"
  - "{planning_artifacts}/ux-designs/ux-COSI - MRP-2026-11-13/.memlog.md"
  - "{project-root}/.docs/ordbank.md"
  - "{project-root}/testdata/README.md"
  - "{project-root}/testdata/testeksempel-01-fasit.xlsx"
  - "{project-root}/testdata/testeksempel-02-fasit.xlsx"
  - "{project-root}/testdata/testeksempel-03-fasit.xlsx"
  - "{project-root}/testdata/validering/README.md"
  - "{project-root}/testdata/lag_testdata.py"
  - DESIGN.md
updated: 2026-11-13
---

# COSI - MRP: EXPERIENCE

Visuelle referanser legges til ved Finalize; ved konflikt gjelder spine-dokumentene.

## Foundation

- **Form:** Webapp for PC i nyere Chrome, Edge og Firefox (NFR-6). Ikke tilpasset mobil i v1. Mus, tastatur og berøring skal likevel virke (FR-18). Minste skjerm er 1366 × 768, i praksis et vindu på cirka 1366 × 630 px ved 100 % zoom. I mindre vinduer og ved zoom opp til 200 % ruller siden loddrett, Resultattabell ruller i sitt eget område, og ingenting skjules (se Accessibility Floor › Reflow).
- **UI-system:** shadcn/ui + Tailwind, med Radix for tastatur og ARIA, til alt utenom **Resultattabell** og **forklaringspanel**. De to bygges selv: en semantisk `<table>` og en ikke-modal `<aside>`. Denne fila beskriver bare det som avviker fra shadcn-oppførselen.
- **Visuell identitet:** `DESIGN.md`. Tokenene vises til som `{colors.…}`, `{typography.…}`, `{spacing.…}` og `{rounded.…}`.
- **Data:** Alt skjer i nettleseren. Fila forlater aldri maskinen (NFR-4), og siste vellykkede kjøring lagres per ferdigprodukt (FR-19). Ingen analyse eller måling fra tredjepart i v1.
- **Omfang:** Kjernen er trinn 1–3. Kapasitetspanelet (trinn 4) kuttes først, så resten av opplevelsen avhenger ikke av det (addendum, «Innspill til UX»). Nøkkelskjermene for trinn 1–2 (Resultattabell, eksepsjoner, Bestillingsforslag, forklaringspanel) tegnes først og må være klare før prøvetesten rundt 27. november. Ved Finalize lenkes hver mock i seksjonen den illustrerer, med «→ Referanse: `mockups/…` (viser …)».
- **Språk:** All tekst er norsk bokmål (NFR-7). Ordene følger ordbanken.

## Information Architecture

Appen har få sider. Etter en vellykket kjøring kommer én resultatside med fast rekkefølge (§4.4). Navigasjonsraden ser ut som navigasjon, men er ankerlenker på samme side. Appen har ingen faner, ingen egne detaljsider og ingen veiviser etter opplastingen.

| Flate | Nås fra | Innhold | Reiser |
|---|---|---|---|
| **Startside** | Appen åpnes; «Last opp ny fil»; Tilbake fra resultatsiden | Veiledning i tre steg med nedlasting av Excel-malen og testeksempel 01 (FR-27); slippsone; radiogruppe «Hva vil du beregne?» (FR-30); Beregn | UJ-1, UJ-2, UJ-3, UJ-4, UJ-5 |
| Startside med valideringsfeil | Beregn med valideringsfeil (FR-4) | Feiloppsummering øverst, over opplastingen. Ingen egen side | UJ-4 |
| **Resultatside** | Beregn uten feil | Toppfelt, statuslinje og seksjonene under | UJ-1, UJ-2, UJ-3, UJ-5 (begge) |
| ↳ Bestillingsforslag | Alltid først | Bestillingsforslag-tabell med ukefilter (FR-17) | UJ-2 |
| ↳ Endringer | Bare når det finnes en tidligere kjøring for ferdigproduktet | Endringsliste (FR-20) | UJ-3 |
| ↳ Kritiske deler | Alltid | Kritiske deler-liste (FR-16) | UJ-2 |
| ↳ Resultattabell | Alltid | Resultattabell (FR-14, FR-15) | UJ-1, UJ-2 |
| ↳ Produksjonskapasitet | Bare når «Begge» er valgt | Kapasitetspanel (FR-34) | UJ-5 (unntak) |
| Resultatside, bare produksjonskapasitet | Beregn med «Produksjonskapasitet» | Bare kapasitetspanelet. Navigasjonsraden har bare den ene lenken | UJ-5 |
| **Forklaringspanel** | Klikk eller Enter på celle, radnavn eller rygg i Resultattabell; en linje i kritiske deler-lista eller endringslista; knappen «50 forfalt» i Bestillingsforslag | Eksepsjonene først, så fire lag, og Ordliste i samme panel (FR-18) | UJ-1, UJ-2 |
| **Bekreftelsesdialog** | «Slett lagret kjøring» i toppfeltet | Bekrefter sletting (FR-21) | UJ-3 (unntak) |

Rekkefølgen på resultatsiden er låst: Bestillingsforslag → Endringer → Kritiske deler → Resultattabell → Produksjonskapasitet. Navigasjonsraden viser bare lenker til seksjoner som finnes. §4.4 sier ikke hvor Endringer står. Den står rett etter Bestillingsforslag fordi det Kari oftest lurer på etter en ny opplasting, er hva som er endret i det hun skal bestille, og fordi en ny eksepsjon i Endringer leder rett videre til Kritiske deler. Når Endringer og Kritiske deler står side om side, står i `DESIGN.md` › Layout & Spacing.

**Adresse og historikk.** Startsiden og resultatsiden har samme adresse (URL). Når resultatsiden vises, legger appen inn ett historikkpunkt, så Tilbake i nettleseren går til startsiden. Ankerlenkene endrer ikke adressen og legger ikke inn historikk. Oppførselen ved reload og Tilbake står i State Patterns.

**Startsidens navigasjonsrad** har to lenker: «Slik gjør du det» og «Last opp». Har fila valideringsfeil, har den «Feil i fila» og «Last opp».

## Voice and Tone

Microcopy. Uttrykket og tonen for merkevaren står i `DESIGN.md`.

Kari tiltales med «du». Teksten er kort, vennlig og saklig, uten skyld og uten feilkoder. Statuslinja har et lite løft, men er aldri munter. Ordbanken bestemmer ordene, så «Resultattabell» kalles aldri «oversikt», og «eksepsjon» kalles aldri «varsel». «Del» brukes, ikke «komponent» (unntatt i typenavnene). «Ferdigprodukt» brukes, ikke «produkt». «Beskrivelse» brukes, ikke «navn». Arket skrives «Prognostiserte behov (arket MPS)», ikke «MPS» alene. «Kjøring» brukes om hele kjøringen, og «beregning» bare om selve regnestykket (knappen Beregn, «Beregner …»). Eksepsjonsnivåene «kritisk» og «advarsel» er interne og brukes bare i tokener og kode (ordbanken, «Eksepsjonsnivå»). De står aldri i tekst eller tilgjengelige navn, og «info» brukes aldri om en eksepsjon. Kari ser typenavnet, for eksempel «Bruk av sikkerhetslager». Om forfalte bestillinger brukes ikke «uke 0», «frigitt» eller «før horisonten» (ordbanken, «Forfalt frigivelse»). Der står «før uke 1» og «bestilt».

«fila» brukes i bestemt form overalt i appen. Overskriftene i Key Flows er sitert fra PRD og beholder «filen». Ordlyd som ikke er sitert fra memlog, PRD, fasit eller UI-rapporten, er forslag som prøves i prøvetesten.

| Situasjon | Do | Don't |
|---|---|---|
| Statuslinje | «12 bestillingsforslag · 4 kritiske deler trenger handling · 3 endringer siden forrige kjøring» | «Hurra! Alt er beregnet 🎉», store tallkort |
| Eksepsjon (hvem som er for sen, hva du kan gjøre, så tallene) | «Du er for sent ute med å bestille hjul: 50 hjul skulle vært bestilt før uke 1. Bestill nå, og avtal raskere levering hvis du kan. Uten de 50 blir lageret −20 i uke 1. De er lagt til forslaget på 175 i uke 1, men kommer tidligst i uke 2. Tabellen viser 30 i uke 1, fordi den regner med at de 50 kommer i tide. Kommer de ikke i tide, blir leveransen til kunde forsinket.» | «Bestilling forsinket. Bestill nå.» (mangler opplysningene FR-10 krever); «… måtte vært frigitt i uke 0, før horisonten …» (fagspråk); «Exception: SS breach» |
| Klartekstlinje i kritiske deler-lista | «Bestillingen skulle vært sendt før uke 1.» | Bare typenavnet («Bestilling forsinket»), som leses som at leverandøren er sen |
| Valideringsfeil (sted først, så årsak, rettehint der det trengs) | «rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.» under «Planlagte mottak» | «Ugyldig input i rad 4 (feilkode 17)» |
| Strukturfeil | «Arket Stykkliste mangler. Fila ser ut til å følge en gammel mal (arkene Produkt og Komponenter). Last ned malen fra startsiden og flytt dataene over.» | «The selected file must use the template» |
| Oppsummering av valideringsfeil | «Fila har 3 feil. Ingenting er beregnet.» / «Rett feilene i Excel, lagre fila og last den opp på nytt.» | «Du har gjort 3 feil» |
| Opplasting | «Du kan laste opp én Excel-fil (.xlsx).» / «Fila sendes ikke noe sted. Den leses bare i nettleseren din.» | «Maks 1 fil. Ikke-xlsx avvises.» |
| Flere filer sluppet | «Slipp bare én fil. Ingen av filene er lest.» | At den første fila brukes uten å si det |
| Veiledning | «Hver fil gjelder ett ferdigprodukt. Lageret for deler som brukes i flere ferdigprodukter, må du fordele mellom filene.» | «… flere produkter …» |
| Lasting | «Leser fila …» → «Beregner …» | «Vennligst vent», spinner uten tekst |
| Kjøring ferdig (kunngjøres) | «Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.» | Ingen kunngjøring |
| Lagring blokkert | «Kjøringen er ikke lagret i denne nettleseren, så neste opplasting kan ikke sammenlignes.» | «Feil: localStorage utilgjengelig» |
| Eksport feilet | «Excel-fila kunne ikke lages. Prøv Eksporter til Excel en gang til.» | «Export failed (500)» |
| Bekreftelse | «Slette lagret kjøring for Kontorstol Basic (100-002)? Neste opplasting vises uten sammenligning.» | «Er du sikker?» |
| Kapasitet | «Hvor mange ferdigprodukter kan være ferdige?» / «Sikkerhetslageret holdes av og regnes ikke som ledig.» | «Produksjon», «Produksjonsplan» |

**Eksepsjonsmeldinger.** Ordlyden er fri og kan forbedres fra fasiten, men opplysningene i FR-kravet i tabellen skal alltid med (FR-13). Meldingen begynner med hva som er galt og hvem som må handle, og handlingen står i første eller andre setning. For Bestilling forsinket og Bruk av sikkerhetslager forklarer meldingen hvorfor Resultattabell viser et annet tall for forventet lagerbeholdning (FR-7: tabellen regner med at forfalte mottak kommer i tide). Eksemplene er fra testeksempel 01, unntatt Kanseller mottak, som bare finnes i testeksempel 02. Meldinger for Ledetid overskrider horisont og Kanseller mottak sier at de bare gjelder innenfor horisonten. Klartekstlinja står i kritiske deler-lista.

| Type | Krav | Klartekstlinje | Melding (eksempel) |
|---|---|---|---|
| Bestilling forsinket | FR-10 | «Bestillingen skulle vært sendt før uke 1.» | Se Do-eksempelet over (300-003 Hjul, uke 1). |
| Bruk av sikkerhetslager | FR-11 | «Bestillingen skulle vært sendt før uke 1, så sikkerhetslageret brukes.» | «Du er for sent ute med å bestille armlene: 10 armlene skulle vært bestilt før uke 1. Bestill nå, så sikkerhetslageret fylles opp igjen. Uten dem blir lageret 10 i uke 1, under sikkerhetslageret på 20. De 10 er lagt til forslaget på 60 i uke 1, men kommer tidligst i uke 2. Tabellen viser 20 i uke 1, fordi den regner med at de 10 kommer i tide.» (300-004 Armlene) |
| Mottak forsinket | FR-12 | «Mottaket i uke 4 trengs allerede i uke 3.» | «Lageret blir 0 i uke 3, under sikkerhetslageret på 10, før mottaket kommer. Be leverandøren levere mottaket på 100 i uke 3 i stedet for uke 4. Det lages ingen ny bestilling for dette behovet.» (300-005 Gassfjær) |
| Ledetid overskrider horisont | FR-9 | «Planen er for kort til å vise alt som må bestilles nå.» | «Ledetiden fra ferdigproduktet er 10 uker (Kontorstol Basic 0 + Stolfot 10), like lang som horisonten. Delen mangler ikke, men behov etter uke 10 som må bestilles nå, vises ikke. Bruk en lengre horisont.» (300-006 Stolfot) |
| Kanseller mottak | FR-29 | «Mottaket i uke 5 trengs ikke innenfor horisonten.» | «Mottaket på 50 i uke 5 trengs ikke innenfor horisonten (uke 5–10). Kanseller eller utsett det. Behov etter uke 10 er ikke regnet med.» (300-005 Gassfjær, testeksempel 02) |

**Tall og datoer.** Tall skrives med hardt mellomrom som tusenskille og ekte minus «−». Differanser skrives «(+75)» og «(−75)». Datoer skrives «13.11.2026 kl. 08:04». Rad i valideringsfeil er alltid Excel-radnummeret, ikke dataradens nummer. Uke «–» for hele delen har det tilgjengelige navnet «hele delen», og i kritiske deler-lista står teksten «hele delen».

## Component Patterns

Oppførsel. Det visuelle står i `DESIGN.md` › Components. Navnene er de samme i begge filene.

| Element | Brukes på | Regler for oppførsel |
|---|---|---|
| **Toppfelt** (med navigasjonsrad) | Alle flater | Begge lagene står fast øverst når Kari blar (fast toppfelt etter UI-rapporten). Lag 1 på resultatsiden viser ferdigproduktet, horisonten og tidspunktet for kjøringen, og har handlingene Slett lagret kjøring, Last opp ny fil og Eksporter til Excel (FR-21, FR-22). Lag 2 er ankerlenker med antall. Klikk ruller mykt til brettet og flytter fokus til brettoverskriften. Aktiv lenke (`aria-current="location"`) følger seksjonen som er øverst i synsfeltet mens Kari blar. Antallene viser alltid totalen, også når et filter er aktivt. Siden har `scroll-padding-top` lik høyden på de to lagene, så toppfeltet aldri dekker et brett eller et element med fokus. |
| **Statuslinje** | Resultatside; startside | På resultatsiden er den en statisk tekstlinje med lenker til Bestillingsforslag, Kritiske deler og Endringer. Delen om endringer vises bare når det finnes en sammenligning. Uten kritiske deler står «Ingen kritiske deler» uten lenke. På startsiden viser den «Leser fila …» og så «Beregner …» ved Beregn. Kunngjøringene går gjennom statusregionen på appnivå (se Accessibility Floor). |
| **Brett og kort** | Alle seksjoner | Hver seksjon er ett brett med `<h2>` og anker-id. Filtre står i brettoverskriften. Brett kan ikke lukkes, foldes eller flyttes. |
| **Veiledning** | Startside | Tre steg etter FR-27: (1) «Fyll ut Excel-malen. Vil du prøve først, kan du bruke testeksempel 01.» med lenkene «Last ned Excel-malen» og «Last ned testeksempel 01»; (2) «Last opp fila og trykk Beregn.»; (3) «Les bestillingsforslagene og tabellen. Klikk på et tall for å se hvordan det er regnet ut.» Under stegene står setningen om ett ferdigprodukt per fil (se Voice and Tone). Nedlastingene er vanlige lenker med `download`, og de laster ned `COSI-MRP-mal.xlsx` (identisk med `testdata/COSI-MRP-mal.xlsx`, FR-27) og `testeksempel-01.xlsx`. Veiledningen er alltid synlig og kan ikke lukkes. |
| **Bestillingsforslag-tabell** (med ukefilter) | Bestillingsforslag | Alle forslag, sortert etter frigivelsesuke og innenfor uka i stykklisterekkefølgen, som i fasiten (FR-17). Ordretype er «Innkjøp» (Komponent (Kjøpes inn)) eller «Produksjonsordre» (Ferdigvare og Komponent (Produseres selv)). Over tabellen står hjelpeteksten «Frigivelsesuke er uka du må sende bestillingen. Varene kommer ledetiden senere. Forfalt: skulle vært bestilt før uke 1.» Forfalt mengde står som «175» og knappen «50 forfalt» (ekte `<button>`, tilgjengelig navn «50 forfalt: se eksepsjonen for 300-003 Hjul»). Knappen gjør det samme som linja for delen i kritiske deler-lista. Ellers gjør et klikk på en rad ingenting. Ukefilteret er en Select med «Alle uker» og «Uke 1» til «Uke H». Når et filter er aktivt, står «Viser 3 av 12 forslag · Vis alle uker» over tabellen, rett under filteret, og «Vis alle uker» nullstiller filteret. Filteret gjelder bare denne tabellen. Alle forslag vises alltid; lista kortes ikke ned med «vis alle» (FR-17, SM-3 oppgave 3). |
| **Endringsliste** | Endringer | Se «Endringsliste» under tabellen. |
| **Kritiske deler-liste** | Kritiske deler | Én linje per kritisk del i stykklisterekkefølgen (FR-16). Over lista står kolonneoverskriftene «Del · Eksepsjon · Uke», så ordet «eksepsjon» står der svaret er. Linja viser varenummer og beskrivelse, eksepsjonstypene i tekst og uka, og under det klartekstlinja (se Voice and Tone) og «Se forklaring →». Hele linja er én knapp; varenummeret og «Se forklaring →» ser ut som lenker, men er ikke egne Tab-stopp. Tilgjengelig navn: «300-003 Hjul, Bestilling forsinket, uke 1. Bestillingen skulle vært sendt før uke 1. Se forklaring». Klikk eller Enter ruller til delen i Resultattabell, flytter fokus til cellen med eksepsjonen (se «Eksepsjonsmarkør: hvilken celle») og åpner forklaringspanelet med eksepsjonskortet øverst. Har delen flere eksepsjoner, står alle typene i linja, og uka er den tidligste (uke «–», «hele delen», regnes som tidligst). Klartekstlinja og handlingen gjelder da den tidligste eksepsjonen. Ikon og farge følger delens mest alvorlige nivå, som merket i ryggen. Lista er statisk og dukker aldri opp av seg selv. |
| **Resultattabell** | Resultattabell | Seks rader per del i rekkefølgen fra FR-14, og delene i samme rekkefølge som stykklisten (FR-16). En felles del vises én gang, der den står første gang i stykklisten. En kritisk del har merket «Kritisk del» i ryggen. Den bygges som en WAI-ARIA grid på en ekte `<table>` med én Tab-stopp (se Interaction Primitives). Klikk, Enter eller mellomrom på en celle, et radnavn eller ryggen åpner forklaringspanelet. Peking (hover) åpner aldri noe (FR-18). Valgt celle beholdes til en annen celle velges. Filteret **«Vis bare kritiske deler»** er en Switch i brettoverskriften. Det beholder stykklisterekkefølgen, og over tabellen står «Viser 4 av 14 deler · Vis alle deler». Rulling og ytelse: se under tabellen. |
| **Forklaringspanel** | Resultatside | Se «Forklaringspanel» under tabellen. |
| **Slippsone** | Startside | Se «Slippsone» under tabellen. |
| **Radiogruppe «Hva vil du beregne?»** | Startside | Tre valg: Bestillingsplan, Produksjonskapasitet og Begge, med én linje hjelpetekst hvert (FR-30). Bestillingsplan er forhåndsvalgt. Ved «Last opp ny fil» og etter valideringsfeil står forrige valg igjen. Piltastene flytter valget (Radix). Hjelpetekster: «Bestillingsforslag, kritiske deler og resultattabellen.», «Hvor mange ferdigprodukter lageret og planlagte mottak rekker til, uke for uke.» og «Bestillingsplanen, med produksjonskapasitet som eget panel nederst.» Er trinn 4 kuttet, og i testbygget for brukertesten, vises ikke radiogruppen, og Beregn gir bestillingsplanen. |
| **Knapper** | Alle | Beregn deaktiveres aldri. Uten valgt fil gir Beregn meldingen «Velg en fil først.» i slippsonen og flytter fokus til «Velg fil». Etter en feil gir Beregn uten ny fil «Velg den rettede fila først.». Eksporter til Excel laster ned fila direkte, uten dialog (se Eksport). Last opp ny fil går til startsiden. Den lagrede kjøringen står urørt til en ny kjøring er vellykket. Slett lagret kjøring (lenkeknapp-toppfelt) vises bare når det finnes en lagret kjøring for ferdigproduktet, og åpner bekreftelsesdialogen. |
| **Feiloppsummering** | Startside med valideringsfeil | Se «Feiloppsummering» under tabellen. |
| **Statusmelding** | Resultatside (lagring blokkert, lagret kjøring slettet, eksport feilet) | Meldingen står under statuslinja, eller øverst i hovedfeltet når siden ikke har statuslinje (bare produksjonskapasitet). Lagring blokkert og lagret kjøring slettet står så lenge resultatsiden vises. Eksport feilet står til neste eksport lykkes. Den har ingen lukkeknapp, ingen popup og ingen toast (NFR-10). Teksten står i Voice and Tone. Den kunngjøres én gang gjennom statusregionen på appnivå. |
| **Bekreftelsesdialog** | Resultatside | shadcn AlertDialog, det eneste modale elementet i appen. Knappene er Slett og Avbryt. Fokus starter på Avbryt. Esc eller Avbryt lukker dialogen og setter fokus tilbake på «Slett lagret kjøring». Slett fjerner den lagrede kjøringen for dette ferdigproduktet, og ingen andre (FR-21). Resultatsiden står uendret. Etterpå forsvinner lenken «Slett lagret kjøring», fokus går til resultatsidens overskrift, og statusmeldingen viser «Lagret kjøring er slettet. Neste opplasting vises uten sammenligning.» |
| **Eksport** | Toppfelt (Eksporter til Excel) | Laster ned den viste kjøringen som `.xlsx` med innholdet FR-22 og FR-23 krever. Arket Sammenligning er med når det finnes en sammenligning, også når Endringer viser «Ingen endringer», og er bygd som arket i fasit 03. Filnavn: ferdigproduktets beskrivelse og dato, for eksempel «COSI-MRP Kontorstol Basic 2026-11-13.xlsx». Ukefilteret og «Vis bare kritiske deler» påvirker ikke eksporten. Tallene lagres som tall, ikke som formaterte tekster. Kapasiteten er aldri med (FR-30). Feiler eksporten, vises statusmeldingen «Eksport feilet» (Voice and Tone), og resultatsiden står uendret (NFR-9). |
| **Kapasitetspanel** | Produksjonskapasitet | Se «Produksjonskapasitet (trinn 4)». |

### Endringsliste

- Grupper i fast rekkefølge: Bestillingsforslag, Eksepsjoner, Deler (FR-20). Hver gruppe har antall i overskriften.
- Etikettene er de samme som i arket Sammenligning i fasit 03 og i eksporten (FR-23): **Nytt**, **Endret mengde** og **Fjernet** for bestillingsforslag, **Ny** og **Borte** for eksepsjoner, og **Ny** og **Fjernet** for deler.
- Et forslag som har flyttet uke, vises som to linjer, Fjernet og Nytt, rett under hverandre (FR-20, fasit 03). De slås aldri sammen til «Flyttet».
- Linjer med Nytt eller Endret mengde for et forslag og Ny for en eksepsjon kan velges. Klikk eller Enter gjør det samme som i kritiske deler-lista: for et forslag velges cellen Planlagte ordrefrigivelser i frigivelsesuka, for en eksepsjon cellen fra «Eksepsjonsmarkør: hvilken celle».
- Fjernet, Borte og deler er tekst.

### Slippsone

- Kari kan dra og slippe en fil eller bruke «Velg fil». «Velg fil» er en ekte `<button>` med synlig navn lik det tilgjengelige navnet. Den åpner et skjult `<input type="file" accept=".xlsx">` uten `required`. Fokus går tilbake til knappen etter fildialogen.
- Dra og slipp og «Velg fil» går gjennom samme kontroll av filtype og innhold (FR-1, NFR-9).
- Instruksjonene står i synlig hjelpetekst. «Slipp Excel-fila her» er pynt og bærer ingen instruksjon.
- Når en fil er valgt, viser sonen filnavnet og «Bytt fil». Ett slipp erstatter forrige valg. Slipper Kari flere filer samtidig, brukes ingen av dem (se Voice and Tone). Slipp utenfor sonen gjør ingenting.
- Feil som gjelder hele fila, vises i sonen, og sonen er fortsatt aktiv.
- Etter valideringsfeil og feil i hele fila nullstilles `input.value` og valgt fil, så samme filnavn kan velges på nytt. Forrige filnavn står bare som informasjon («Forrige fil: …»), ikke som valgt.

### Feiloppsummering

- Den vises øverst, over opplastingen, også ved bare én feil. Den har `tabindex="-1"` og får fokus, og `role="alert"` står på et indre element, ikke på hele brettet. Sidetittelen begynner med «Feil:».
- Gir en ny opplasting nye feil, oppdateres lista, og fokus flyttes dit på nytt. Alle feilene står i én liste (FR-4).
- **Strukturfeil først:** gruppen «Fila følger ikke malen» samler manglende ark, manglende eller feilstavet kolonneoverskrift og gammel mal, med sted som «Arket Stykkliste» eller «Arket Stykkliste, kolonnen Ledetid (uker)». Kontroller som avhenger av det som mangler, hoppes over, og gruppen sier hvilke. Andre verdier kontrolleres likevel (V-F06 i `testdata/validering/README.md`).
- **Så verdifeil**, gruppert per ark i malens rekkefølge (Stykkliste → Prognostiserte behov (arket MPS) → Planlagte mottak) med antall i overskriften, og sortert etter Excel-rad.
- Like feil i samme kolonne slås sammen med radintervall og antall: «Planlagte mottak, rad 4–53, Uke: må være et heltall (50 rader).» En gruppe med mer enn cirka 20 linjer viser antallet og kan foldes ut.
- Hver linje oppgir sted og felt først, så årsak.
- Under står brettet «Last opp den rettede fila» med slippsonen og «Forrige fil: …». Den lagrede kjøringen endres ikke.

### Forklaringspanel

- **Rolle:** en ikke-modal `<aside>` som skyver hovedfeltet og står fast under toppfeltet med egen rulling. Den står åpen til Kari lukker den (FR-18). Overskriften er for eksempel «Forklaring: 300-003 Hjul – Nettobehov, uke 1».
- **Eksepsjonen først:** har cellen eksepsjoner, står eksepsjonskortene øverst, over lag 1, alle sammen hvis det er flere (FR-15). Hvert kort har typenavnet, meldingen (handlingen i første eller andre setning) og «Hvorfor:». **Akseptsjekk:** på 1366 × 768 ved 100 % zoom er hele eksepsjonskortet for 300-003 Hjul synlig uten å rulle i panelet når det åpnes fra kritiske deler-lista.
- **Celle uten eksepsjon i en kritisk del:** øverst står linja «Hjul har 1 eksepsjon: Bestilling forsinket, uke 1 → Vis». «Vis» flytter valgt celle til eksepsjonens celle.
- **Ryggen og merket «Kritisk del»:** panelet viser alle delens eksepsjoner som kort, øverst.
- **Fire lag:** **1 Svar** i én setning, **2 Utregning** som steg med tallene satt inn i PRD-ens formler, **3 Tallene** der hvert tall er en lenke til sin egen forklaring, og **4 Regel** i én setning med lenken «Ordliste».
- **Bruttobehov:** for alle deler under ferdigproduktet viser lag 3 hvilke overordnede deler behovet kommer fra, og antallet per enhet (FR-18), for eksempel «Kontorstol Basic: 20 × 5 = 100» for 300-003 Hjul i uke 1. En felles del har én linje per overordnet del.
- **Fokus:** fokus blir i tabellen når panelet skifter innhold, så piltastene flytter cellen og panelet følger med. En lenke i lag 3 til en annen celle flytter valgt celle dit. Andre lenker i panelet får «Tilbake til forklaringen».
- **Ordliste** åpnes i samme panel med samme tilbakelenke. Valgt celle beholdes.
- «Gå til forklaringen» flytter fokus inn i panelet (se Interaction Primitives). «Lukk» eller Esc lukker panelet, eller går fra panelet tilbake til cellen, og setter fokus på cellen.

### Eksepsjonsmarkør: hvilken celle

Markøren står i én fast rad per type. Kritiske deler-lista, endringslista og knappen «50 forfalt» flytter fokus til samme celle. Nettobehov-raden bærer markøren for Bestilling forsinket, Bruk av sikkerhetslager og Mottak forsinket, som i PRD-eksempelet for hjul (FR-18: nettobehov = 50 i uke 1). Forventet lagerbeholdning i samme uke får ingen markør, men lag 1 forklarer avviket (se «Forklaringspanel: tekster»).

| Type | Celle |
|---|---|
| Bestilling forsinket | Nettobehov, uke t |
| Bruk av sikkerhetslager | Nettobehov, uke t |
| Mottak forsinket | Nettobehov, uka mottaket er fremskyndet til |
| Kanseller mottak | Planlagte mottak, mottaksuka |
| Ledetid overskrider horisont | Ryggen (uke «–», «hele delen») |

### Resultattabell: rulling og ytelse

**Rullemodell.** Resultattabell ruller i sitt eget område, både vannrett og loddrett. Siden ruller fram til brettet, og deretter ruller området. Området er en navngitt region (`role="region"` med `aria-labelledby` til brettoverskriften), og høyden er vinduet minus toppfelt, navigasjonsrad og brettoverskrift. Ukeoverskriften og de tre venstre kolonnene står fast inne i området (NFR-8). Området har `scroll-padding-top` lik høyden på tabellhodet og `scroll-padding-left` lik bredden av de faste kolonnene (`{spacing.col-varenummer}` + `{spacing.col-beskrivelse}` + `{spacing.col-rad}`). Ved hvert piltrykk og hvert hopp fra kritiske deler-lista, endringslista eller knappen «50 forfalt» kalles `scrollIntoView({block: 'nearest', inline: 'nearest'})`, så cellen med fokus aldri skjules bak faste lag (WCAG 2.4.11). **Akseptsjekk:** på 1366 × 768 med panelet åpent er cellen med fokus hele tiden synlig ved Ctrl+End, Ctrl+Home, PgUp, PgDn og piltaster.

**Ytelse (NFR-5).** Mål tidlig, før tabellstrukturen låses, med en syntetisk fil på 1000 stykklisterader, tre nivåer og 12 uker (lages med `testdata/lag_testdata.py`, addendum). Budsjett: under 3 sekunder fra opplasting til synlig Resultattabell (NFR-5). Opplastingen starter når Kari trykker Beregn, så målingen starter der. Piltastene skal flytte uten merkbar forsinkelse. Nås ikke målet, prøves dette i rekkefølge:

1. `content-visibility: auto` per `<tbody>`.
2. Virtualisering per delblokk med `aria-rowcount` og `aria-rowindex`. Roving tabindex må tåle at cellen med fokus tas ut av DOM.
3. Siste utvei: sammenslått visning med én linje per del (se State Patterns).

### Forklaringspanel: tekster

- **Hvorfor:** Hvert eksepsjonskort har en setning med regelen og tallene satt inn, uten «uke 0» og «horisonten», for eksempel «Hvorfor: Hjul har 1 ukes ledetid, så hjulene som trengs i uke 1, måtte vært bestilt før uke 1. Uten dem går lageret under 0 i uke 1.» Hver eksepsjonstype har også en oppføring i Ordliste (FR-18).
- **Forfalt ordremottak (FR-7):** For planlagt ordremottak med forfalt frigivelse sier lag 1 at mottaket er regnet med i uka, men kommer senere: «Mottaket på 50 er regnet med i uke 1, men kommer tidligst i uke 2. Se eksepsjonen.» (300-003 Hjul).
- **Forventet lagerbeholdning i en uke med forfalt ordremottak:** lag 1 forklarer avviket fra meldingen: «Tabellen viser 30, fordi den regner med at de 50 som er bestilt for sent, kommer i tide. Uten dem blir lageret −20 i uke 1. Se eksepsjonen.» (300-003 Hjul). Et diskret tegn i cellen med tilgjengelig navn («regner med 50 som kommer for sent») prøves mot SM-C3 i prøvetesten.
- **Planlagte ordrefrigivelser:** lag 1 sier hva Kari gjør og når varene kommer, for eksempel «Bestill 25 rygger i uke 2, så de kommer i uke 3.» (300-002 Rygg).
- **Fremskyndet mottak:** Malen er «Mottaket på ‹antall› står i uke ‹u›, men er regnet med fra uke ‹t›. Derfor er forventet lagerbeholdning ‹x› i uke ‹t›, men det trengs ingen ny bestilling.» For 300-005 Gassfjær: «Mottaket på 100 står i uke 4, men er regnet med fra uke 3. Derfor er forventet lagerbeholdning 0 i uke 3, under sikkerhetslageret på 10, men det trengs ingen ny bestilling.» Malen brukes i lag 1 for forventet lagerbeholdning og nettobehov i ukene t til u − 1, og for planlagte mottak i uke u. Lag 4 lenker til Ordliste-oppføringen «Fremskyndet mottak». Et diskret tegn i mottakscellen med tilgjengelig navn («regnet med fra uke 3») prøves mot SM-C3 i prøvetesten.
- **Slutten av horisonten:** Ordliste har en oppføring om at behov etter uke H ikke er med i beregningen, som Ledetid overskrider horisont og Kanseller mottak lenker til.

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Første besøk | Startside | Veiledningen er synlig og ikke skjult bak ikoner. Ingenting er valgt utover Bestillingsplan. Fokus starter øverst. Sidetittel: «COSI - MRP». |
| Fil valgt | Startside | Slippsonen viser filnavnet. Statuslinja er tom. |
| Fil dras over | Startside | Slippsonen får valgt-tone (`{colors.selected-cell}`). Slipp utenfor sonen gjør ingenting. |
| Lasting | Startside | Statuslinja viser og statusregionen kunngjør «Leser fila …» og så «Beregner …». Det er ingen overlegg og ingen spinner over siden. Beregn er fortsatt aktiv. Et nytt klikk på Beregn mens beregningen pågår, starter ikke en ny kjøring. Målet er under 3 sekunder (NFR-5). |
| Kjøring ferdig | Resultatside | Fokus flyttes til resultatsidens overskrift (`tabindex="-1"`). Sidetittelen blir «Kontorstol Basic (100-002) – Resultat – COSI - MRP». Statusregionen kunngjør «Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.» |
| Last opp ny fil | Startside | Fokus går til startsidens `<h1>`. Forrige valg i radiogruppen står igjen. |
| Reload på resultatsiden | Startside | Siden lastes på nytt som startside. Resultatet og fila finnes bare i minnet og vises ikke igjen. Den lagrede kjøringen er urørt og brukes til sammenligning ved neste opplasting (FR-19). |
| Tilbake i nettleseren | Resultatside → startside | Tilbake fra resultatsiden går til startsiden, som «Last opp ny fil». Frem viser resultatsiden igjen så lenge siden ikke er lastet på nytt; ellers står startsiden. Tilbake fra startsiden forlater appen. |
| Valideringsfeil | Startside | Feiloppsummeringen vises (se Component Patterns). Navigasjonsraden viser «Feil i fila · Last opp». Filvalget nullstilles. Ingen beregning, og den lagrede kjøringen er urørt (FR-4). |
| Feil i hele fila (NFR-9) | Startside | Meldingen står i slippsonen, ikke i feiloppsummeringen, fordi den ikke har rader. Filvalget nullstilles, og sonen er fortsatt aktiv, så Kari kan prøve en ny fil uten å laste siden på nytt. Den lagrede kjøringen er urørt. Én melding per tilfelle: **ikke .xlsx** (FR-1): «Appen tar bare imot Excel-malen (.xlsx).» **Skadet fil:** «Fila kan ikke leses. Den er kanskje skadet. Lagre den på nytt fra Excel og prøv igjen.» **Tom fil (0 byte):** «Fila er tom. Lagre malen i Excel og last den opp på nytt.» **Ikke en Excel-fil, selv om den heter .xlsx:** «Fila heter .xlsx, men er ikke en Excel-fil. Åpne malen i Excel og lagre den som Excel-arbeidsbok.» **Passordbeskyttet:** «Fila er beskyttet med passord. Fjern passordet i Excel og last den opp på nytt.» **Uventet feil:** «Noe gikk galt under beregningen. Ingenting er vist eller lagret. Prøv igjen, eller last opp fila på nytt.» |
| Første kjøring for ferdigproduktet | Resultatside | Endringer-brettet, lenken i navigasjonsraden og endringsdelen av statuslinja vises ikke (FR-20). Kritiske deler får full bredde. |
| Sammenligning finnes | Resultatside | Endringer står mellom Bestillingsforslag og Kritiske deler. Overskriften sier hvilke to kjøringer som sammenlignes, med tidspunkt. |
| «Ingen endringer» | Endringer | Brettet vises med «Ingen endringer i bestillingsforslag, eksepsjoner eller deler siden forrige kjøring (13.11 kl. 07:31). Endringer i resultattabellen som ikke påvirker dem, vises ikke.» Statuslinja sier «ingen endringer i bestillingsforslag eller eksepsjoner». |
| Ingen kritiske deler | Kritiske deler | Brettet vises med «Ingen kritiske deler i denne kjøringen.» Statuslinja sier «Ingen kritiske deler». Filteret «Vis bare kritiske deler» er skjult. |
| Ingen bestillingsforslag | Bestillingsforslag | «Kjøringen gir ingen bestillingsforslag.» Ukefilteret er skjult. |
| Ukefilter aktivt | Bestillingsforslag | «Viser 3 av 12 forslag · Vis alle uker» over tabellen. Gir filteret ingen treff: «Ingen bestillingsforslag skal frigis i uke 4. Vis alle uker». |
| Filteret for kritiske deler aktivt | Resultattabell | «Viser 4 av 14 deler · Vis alle deler». Rekkefølgen fra stykklisten beholdes. Valgt celle i en del som skjules, nullstilles, og panelet lukkes. |
| Sammenslått visning (bare hvis ytelsen krever det) | Resultattabell | Én linje per del med varenummer, beskrivelse, eksepsjonsmarkør og første uke med eksepsjon. «Fold ut alle» og «Fold sammen alle» står i brettoverskriften. Enter på linja folder ut delen til de seks radene. Et hopp fra kritiske deler-lista, endringslista eller knappen «50 forfalt» folder ut delen først. |
| Celle valgt | Resultattabell | Ring og tint på cellen. Ukeoverskriften og radnavnet blir fete. |
| Forklaringspanelet åpent | Resultatside | Hovedfeltet smalner, og Endringer og Kritiske deler stables (`DESIGN.md` › Layout & Spacing). Tabellen kan fortsatt brukes. Panelet følger valgt celle. |
| Forklaringspanelet lukket | Resultatside | Hovedfeltet får full bredde. Fokus går tilbake til cellen. |
| Ordliste i panelet | Forklaringspanel | Panelet viser begrepet med lenken tilbake. Valgt celle beholdes. |
| Lagring blokkert (NFR-10) | Resultatside | Statusmeldingen står fast. «Slett lagret kjøring» vises ikke, og Endringer vises aldri. Ellers virker alt som vanlig. |
| Eksport feilet | Resultatside | Statusmeldingen «Excel-fila kunne ikke lages. Prøv Eksporter til Excel en gang til.» står til neste eksport lykkes. Resultatsiden er ellers uendret. |
| Bare produksjonskapasitet | Resultatside | Bare kapasitetspanelet og navigasjonsraden med én lenke. Det er ingen statuslinje, så en statusmelding står øverst i hovedfeltet. «Eksporter til Excel» skjules (deaktiveres ikke), fordi kapasiteten ikke eksporteres (FR-30). «Slett lagret kjøring» vises bare når det finnes en lagret kjøring for ferdigproduktet. Kjøringen lagres ikke, og den lagrede kjøringen er urørt. |
| Begge valgt | Resultatside | Kapasitetspanelet står sist, med egen lenke i navigasjonsraden. Eksporten inneholder bare bestillingsplanen (FR-30). |
| Fokus | Alle | Synlig ring på alt som kan få fokus: `{colors.ring}` på lyse flater og `{colors.topbar-ring}` på toppfeltet og navigasjonsraden. Den skjules aldri, heller ikke bak faste lag. |

## Interaction Primitives

- **Klikk, trykk, Enter og mellomrom** gjør det samme. Peking (hover) åpner aldri forklaringer, verktøytips eller menyer, og endrer ikke utseendet på rader (FR-18).
- **Musepeker:** alt som kan klikkes, har `cursor: pointer`: celler, radnavn, rygg, linjene i kritiske deler-lista og endringslista, knappen «50 forfalt», lenker og knapper. Det er det eneste som endres ved peking.
- **Tastatur i Resultattabell (WAI-ARIA grid):** Roving tabindex gir én Tab-stopp. Piltastene flytter én celle og stopper ved kanten. Home og End går til første og siste celle i raden, og Ctrl+Home og Ctrl+End til første og siste celle i tabellen. PgUp og PgDn går til samme rad i forrige og neste del. Venstre fra et radnavn går til ryggen, og Opp og Ned fra ryggen går til forrige og neste del. Enter eller mellomrom åpner forklaringen. Esc lukker panelet og setter fokus tilbake. Radnavnene og ryggen kan få fokus og forklarer hele raden eller delen.
- **Gå til forklaringen:** Mens panelet er åpent, er neste Tab-stopp etter Resultattabell lenken «Gå til forklaringen», som vises ved fokus og flytter fokus til panelets overskrift. Esc i panelet setter fokus tilbake på cellen.
- **Ankerlenker** ruller mykt til brettet. Med `prefers-reduced-motion` hopper de. De endrer ikke adressen.
- **Fil:** dra og slipp, eller «Velg fil». Begge må virke. «Velg fil» er en ekte knapp, fordi talestyring (for eksempel Dragon) ikke kan aktivere et vanlig filfelt med stemmen.
- **Bevegelse:** Panelet glir inn og ut, og brettene tones inn første gang de vises (tidene står i `DESIGN.md`). Ingen bevegelse med `prefers-reduced-motion`.
- **Ikke tillatt:** toasts og meldinger som forsvinner av seg selv, overlegg ved lasting, deaktivert Beregn, modale paneler (bortsett fra bekreftelsesdialogen), faner, dra for å flytte, uendelig rulling og at noe skjer bare ved peking.

## Accessibility Floor

Oppførsel. Kontrasten står i `DESIGN.md` › Colors.

- **Mål:** WCAG 2.1 AA, og fokus som aldri skjules (2.4.11). Før prøvetesten testes appen manuelt med bare tastatur, og med en kort skjermlesertest med NVDA (cirka 15 minutter) i Chrome eller Firefox: navigasjonsraden, statuslinja, Resultattabell som grid (ukeoverskrift og radnavn leses), kritiske deler-lista, forklaringspanelet, feiloppsummeringen og kunngjøringen etter Beregn. Automatiske verktøy erstatter ikke de to manuelle testene.
- **Ikke farge alene:** Eksepsjoner, kritiske deler, forfalt mengde, endringer og begrensende deler har alltid tekst eller ikon i tillegg til farge (FR-15, FR-34, NFR-8). Eksepsjonsmarkøren har et tilgjengelig navn, for eksempel «1 eksepsjon: Bestilling forsinket». Merket i ryggen heter «Kritisk del», synlig og som tilgjengelig navn.
- **Kunngjøringer:** Én `role="status"`-region på appnivå, utenfor innholdet som byttes mellom startside og resultatside, som finnes fra siden lastes. Den kunngjør lasting, «Kjøringen er ferdig: …» og statusmeldingene. Feiloppsummeringen får fokus, og `role="alert"` står på et indre element. Forklaringspanelet har ikke `aria-live` på hele panelet. Et lite element i panelet (`aria-live="polite"`) kunngjør bare overskriften og det første kortet (eksepsjonen, ellers lag 1), cirka 300 ms etter at valgt celle har stoppet, så køen ikke fylles når Kari holder inne en piltast.
- **Fokus:** Tab-rekkefølgen følger lesingen: toppfelt, navigasjonsrad, seksjonene i rekkefølge, så panelet. Fokus går alltid tilbake dit det kom fra når panelet eller dialogen lukkes. Faste lag dekker aldri elementet som har fokus (se Resultattabell: rulling og ytelse).
- **Semantikk:** Resultattabell har `<caption>` med ferdigprodukt og horisont, `<th scope="col">` for ukene og `<th scope="row">` for radnavnene, og én `<tbody>` per del. Rulleområdet er en navngitt region. Navigasjonsraden er `<nav aria-label="Seksjoner på resultatsiden">` med `aria-current`. Radiogruppen er `fieldset` og `legend`. Panelet er `<aside aria-label="Forklaring">`.
- **Reflow:** Resultattabell ruller i sitt eget område (unntaket for datatabeller i WCAG 1.4.10). Overskrifter og knapper rundt tabellen tilpasser seg bredden.
- **Berøring:** Alt som kan klikkes, kan også trykkes på. Ingenting avhenger av peking.

## Inspiration & Anti-patterns

- **Hentet fra SAP S/4HANA (Fiori):** ankerlinja med understreket aktiv lenke, konteksten i toppfeltet (objekt, horisont, tidspunkt) og seksjoner som kort på én side. Fra retning 4 «Objektside» (`.working/direction-4-objektside.html`, historisk utkast) er bare oppsettet tatt med: toppfeltet og navigasjonsraden på startsiden, og opplasting og valg side om side.
- **Hentet fra modne planleggingsverktøy (via UI-rapporten):** handlingslista først, så eksepsjonene, så hele planen. Det er rekkefølgen i §4.4.
- **Hentet fra norske offentlige mønstre (Designsystemet, Aksel, GOV.UK):** feiloppsummeringen øverst med fokus, slippsonen med en vanlig knapp, og at innsendingsknappen ikke deaktiveres.
- **Avvist: gamle SAP GUI (MD04/MD06).** Lite brukervennlig og ikke fint å se på. Én del om gangen i master-detail koster muligheten til å sammenligne.
- **Avvist: dashbord, kort med store tall og grafer først.** Avvist til fordel for én arbeidsside. Det bryter §4.4 og mot-målet SM-C3.
- **Avvist: faner** (FR-34), **terskler for eksepsjoner** (FR-9–FR-13, SM-2), **«Flyttet» som egen endringstype** (FR-20) og **kritiske deler sortert øverst** (FR-16). Alle fire er valgfrie innspill fra UI-rapporten som ble avvist.
- **Avvist: farget sidekant, liten tekst over overskrifter og trange marger.**
- **Avvist fra UI-rapporten:** fortegn i radnavnene (som Odoo: «− Bruttobehov», «= …»); shadcn Sheet eller Drawer for forklaringspanelet (modale); canvas-grid eller betalt grid-motor; utvidbare rader som standard; introveiviser eller karusell på startsiden.

## Key Flows

### UJ-1. Kari tar i bruk COSI - MRP første gang

1. Kari åpner appen. **Startsiden** viser veiledningen i tre steg.
2. Hun laster ned testeksempel 01 fra steg 1, drar fila til **slippsonen**, lar Bestillingsplan stå valgt i **radiogruppen** og trykker Beregn. **Statuslinja** viser «Leser fila …» og så «Beregner …».
3. **Resultatsiden** åpnes uten Endringer, fordi det ikke finnes noen tidligere kjøring.
4. Hun klikker på noen celler i **Resultattabell** og leser **forklaringspanelet** lag for lag. Hun følger lenken «Ordliste» i lag 4.
5. Hun går tilbake med «Last opp ny fil», laster ned Excel-malen og fyller den ut i Excel. Kontroll-kolonnen viser at ledetiden mangler på én rad, og hun retter det der.
6. Hun laster opp sin egen fil.
7. **Klimaks:** Resultatsiden for stolen hennes viser bestillingsforslagene, de kritiske delene og tabellen, uten sammenligning. Forklaringene hun øvde på med testeksempelet, gjelder nå hennes egne tall.

Feil: fila har valideringsfeil, og hun følger UJ-4. Feil i hele fila gir en melding i slippsonen, og hun kan prøve igjen uten å laste siden på nytt.

### UJ-2. Kari oppdaterer planen og ser hva hun må bestille

1. Kari laster opp dagens fil fra **startsiden**.
2. **Resultatsiden** åpnes på Bestillingsforslag. **Statuslinja** sier at fire kritiske deler trenger handling.
3. Hun setter **ukefilteret** til Uke 1. **Bestillingsforslag-tabellen** viser «Viser … av … forslag», og hjul står med 175 og knappen «50 forfalt».
4. Hun følger lenken i statuslinja til **kritiske deler-lista** og velger Gassfjær – Mottak forsinket («Mottaket i uke 4 trengs allerede i uke 3.»).
5. **Resultattabell** ruller til gassfjær, fokus står på nettobehovet i uke 3, og **forklaringspanelet** åpnes med eksepsjonskortet øverst.
6. **Klimaks:** Panelet sier at mottaket på 100 står i uke 4, men er regnet med fra uke 3, og at leverandøren må levere det i uke 3. Kari vet hva hun skal si til leverandøren uten å regne selv.
7. Hun trykker Eksporter til Excel i **toppfeltet**.

Unntak: Hun lurer på hvorfor nettobehovet for hjul er 50 i uke 1. Hun klikker på cellen, og **forklaringspanelet** viser eksepsjonen først, så svaret, utregningen og tallene. Feil: lagring er blokkert, og **statusmeldingen** står under statuslinja. Resultatet er ellers det samme.

### UJ-3. Kari ser hva en ny kundeordre betyr

1. Kari endrer prognostiserte behov i uke 2 fra 30 til 45 i Excel og velger «Last opp ny fil» i **toppfeltet**.
2. På **startsiden** laster hun opp fila og trykker Beregn.
3. **Resultatsiden** har nå seksjonen Endringer mellom Bestillingsforslag og Kritiske deler, og **statuslinja** viser antall endringer.
4. **Endringslista** viser under Bestillingsforslag «Endret mengde» for hjul med «130 → 205 (+75)» og «Nytt» for 30 skruesett M6 i uke 1. Under Eksepsjoner står «Ny» for hjul – Bruk av sikkerhetslager, og for rygg – Mottak forsinket står «Borte» i uke 3 og «Ny» i uke 2.
5. **Klimaks:** Kari ser at endringen ga det hun ventet. Hun velger den nye eksepsjonen for hjul og havner rett i cellen, uten å lete i hele tabellen.
6. Hun justerer bestillingene.

Unntak: Hun vil starte på nytt og trykker Slett lagret kjøring. **Bekreftelsesdialogen** spør, og hun velger Slett. Neste opplasting vises uten Endringer. Uendret fil: Endringer viser «Ingen endringer …». Feil: den nye fila har valideringsfeil, og hun følger UJ-4. Er lagringen blokkert, vises ingen Endringer, og **statusmeldingen** sier at kjøringen ikke er lagret.

### UJ-4. Kari retter feil etter å ha kopiert filen

1. Mandag laster Kari opp den kopierte fila fra **startsiden**.
2. **Statuslinja** viser «Leser fila …». Ingen beregning skjer.
3. **Feiloppsummeringen** vises øverst og får fokus: «Fila har 3 feil. Ingenting er beregnet.» Navigasjonsraden viser «Feil i fila · Last opp».
4. Feilene står gruppert per ark med Excel-radnummer: under Prognostiserte behov (arket MPS) «uke 11, Antall ferdigprodukter: uke 10 er tom, så uke 11 kan ikke fylles ut.», og under Planlagte mottak «rad 4, Uke: …» og «rad 5, Antall: må være et heltall.»
5. Hun retter alle tre i Excel og slipper den rettede fila i **slippsonen** rett under. Filvalget var nullstilt, så den nye versjonen leses selv om filnavnet er det samme. Valget i radiogruppen står igjen.
6. **Klimaks:** **Resultatsiden** åpnes og sammenligner med den lagrede kjøringen, som var urørt hele tiden. Hun fikk alle feilene på én gang og trengte bare ett nytt forsøk.

Feil: fila er skadet eller tom, og meldingen står i **slippsonen**, ikke i feiloppsummeringen.

### UJ-5. Kari svarer på en hasteforespørsel

1. En kunde spør om 35 Kontorstol Kompakt i uke 5. Kari laster opp fila på **startsiden** og velger Produksjonskapasitet i **radiogruppen**.
2. **Resultatsiden** viser bare **kapasitetspanelet**. Navigasjonsraden har én lenke, og Eksporter til Excel vises ikke.
3. Under spørsmålet «Hvor mange ferdigprodukter kan være ferdige?» leser hun raden Fra lager: 30 i uke 5. Raden Med planlagte mottak viser 30 i uke 5 og 35 fra uke 7.
4. I uke 5 står «Begrenset av 300-033 Ryggplate (lager)» under raden Fra lager og «Begrenset av 300-033 Ryggplate (lager og planlagte mottak)» under raden Med planlagte mottak. I tabellen per del ser hun mottaket på 30 ryggplater i uke 5.
5. **Klimaks:** Kari svarer kunden at 30 stoler kan leveres i uke 5 og resten i uke 7, og hun ringer leverandøren om å få mottaket i uke 3. Den lagrede kjøringen er urørt.

Unntak: Hun velger Begge, og kapasitetspanelet står sist på resultatsiden med egen lenke i navigasjonsraden. Feil: som i UJ-4. Valideringen er den samme uansett valg (FR-30).

## Produksjonskapasitet (trinn 4)

Kuttes først. Navigasjonen har plass til panelet, men ingenting annet avhenger av det. Formålet med eget panel er at Kari ikke forveksler kapasitet med planlagt produksjon (FR-34).

- **Overskrift:** spørsmålet «Hvor mange ferdigprodukter kan være ferdige?», aldri «Produksjon».
- **Innledende tekst rett under:** FR-34-setningen om at produksjonskapasiteten tar med ledetid, men ikke prognostiserte behov, og «Sikkerhetslageret holdes av og regnes ikke som ledig.» Den står over radene, før noe tall.
- **Øverst:** to rader, «Fra lager» og «Med planlagte mottak», med én kolonne per uke (FR-32). Radene ser ikke ut som de seks radene i Resultattabell (se `DESIGN.md`).
- **Begrensende deler (FR-33):** står under hver rad, for hver uke, med årsaken i tekst. Har flere deler samme laveste verdi, står alle, skilt med komma. Årsaken skrives med samme ord overalt, også i UJ-5:
  - raden **Fra lager:** «(lager)» eller «(ledetid)», for eksempel «Begrenset av 300-033 Ryggplate (lager)»
  - raden **Med planlagte mottak:** «(lager og planlagte mottak)» eller «(ledetid)», for eksempel «Begrenset av 300-032 Skruesett M6 (lager og planlagte mottak)»
  - «(ledetid)» betyr at en ordre måtte vært frigitt før uke 1, for eksempel «Begrenset av 100-004 Kontorstol Kompakt (ledetid)» i uke 1.
- **Under:** tabellen per del med lagerbeholdning, sikkerhetslager, ledig beholdning, ledetid og planlagte mottak per uke (FR-34). Kolonnen Ledig beholdning har hjelpeteksten «Lagerbeholdning minus sikkerhetslager, aldri under 0.»
- **Klikkbar forklaring:** ingen i v1 (FR-18 gjelder Resultattabell).

[OPEN: avgjøres i kapasitetsskissen: det visuelle skillet fra bestillingsplanen utover overskriften og den innledende teksten, og hvordan begrensende deler vises per uke og rad.]

## Fast partistørrelse (trinn 5)

Med i v1, men kuttes først (PRD §7.1), og planlegges som et eget, senere epic (§4.7). UX-en lages i det epicet. Plassen er reservert nå:

- **Valideringsfeil i kolonnen «Partistørrelse» (FR-24)** vises i feiloppsummeringen under Stykkliste, med samme mønster som andre verdifeil.
- **Bestillingsregelen (FR-26)** står i ryggen under nivå og type, for eksempel «Fast partistørrelse: 50». Lag 2 i forklaringspanelet viser avrundingen for planlagte ordremottak.
- **Eksporten (FR-26)** viser bestillingsregelen og partistørrelsen per del.

## Brukertest

Gjelder SM-3 og §8.1, og er forslaget til svar på PRD §9 nr. 4. Gruppa er ansvarlig for §9 nr. 4, så introduksjonen, prosedyren, oppgavelappene og fasitsvarene sendes gruppa til godkjenning i neste gruppemelding. §9 nr. 4 lukkes i PRD først når gruppa har godkjent. Prøvetesten med en person utenfor gruppa avviker fra PRD §8.1 («et gruppemedlem») og føres inn i PRD-en når gruppa har godkjent.

**Før testuka.**

1. **Testbygg:** én fast deploy-URL for 2.–7.12, som ikke endres i testuka. Radiogruppen er skjult i testbygget, så Beregn gir bestillingsplanen (§8.1: bare trinn 1–2). Før første test bekreftes SM-1 og SM-2 for testeksempel 01 på akkurat den URL-en.
2. **Prøvetest** rundt 27.11 med én person utenfor gruppa, med full prosedyre og tidtaking. Introduksjonen, lappene og rubrikken låses etterpå og endres ikke i testuka.
3. **Rekruttering:** flytende norsk. Noter bakgrunn per testperson: innkjøp, Excel og MRP-erfaring.
4. **Samtykke:** skriftlig samtykke til opptak av skjerm og lyd. Opptaket slettes etter vurderingen.

**Oppsett per testperson.**

1. Samme nettleser for alle (Chrome eller Edge), maksimert vindu og 100 % zoom. Noter skjermoppløsning og Windows-skalering.
2. Et nytt privat vindu per testperson, eller en egen nettleserprofil for testen. Det erstatter «Slett lagret kjøring» før hver testperson.
3. Bare `testeksempel-01.xlsx` ligger på skrivebordet, og det er den samme fila som appen deler ut (lik kontrollsum). Fasiten ligger ikke på testmaskinen. Bruker testpersonen nedlastingen på startsiden i stedet, er det greit, og det noteres.
4. Testlederen leser introduksjonen ordrett fra et ark (cirka 1 minutt). Introduksjonen forklarer ikke «kritisk del» eller «eksepsjon».
5. Testpersonen starter på **startsiden** og laster selv opp testeksempel 01. Opplastingen tas ikke tid på.
6. **Kontroll før oppgave 1.** Testlederen krysser av: (1) Endringer vises ikke i navigasjonsraden, (2) det står ingen statusmelding under statuslinja, (3) toppfeltet viser «Kontorstol Basic (100-002)» og «Horisont: 10 uker». Er ett punkt feil, åpnes et nytt privat vindu (eller testprofilen), og fila lastes opp på nytt før klokka starter.

**Under oppgavene.**

1. Oppgavene gis én og én på en lapp. Lappen ligger synlig hele oppgaven.
2. **Nullstill før hver lapp:** testlederen lukker panelet (Esc), setter ukefilteret til Alle uker og slår av «Vis bare kritiske deler», og klikker «Bestillingsforslag» i navigasjonsraden. Det gjøres likt for alle og er ikke hjelp.
3. **Tidsregel:** klokka starter når testpersonen har lest lappen høyt. Den stopper når testpersonen sier at hun har svaret og begynner å si det. Svaret hun gir da, er det som teller. Ved 3:00 sier testlederen «Takk, da går vi videre», og oppgaven er feilet. Tiden leses av opptaket.
4. **Testlederen** sier bare to nøytrale setninger: «Hva ser du etter nå?» og «Fortsett slik du ville gjort selv.» Alt annet regnes som hjelp og noteres. Å lese lappen høyt én gang til er ikke hjelp.
5. **Notater:** svaret ordrett, veien (statuslinje, navigasjonsrad, rulling, tabell, panel) og tid.

**Vurdering og rapport.**

- Oppgave 1 og 3 vurderes av testlederen etter fasiten. Oppgave 2 vurderes etterpå fra opptaket av to gruppemedlemmer hver for seg etter rubrikken, og er de uenige, avgjør et tredje.
- Rapporten i `.docs/brukertest/brukertest-resultat.md` har per oppgave: løst eller feilet, tid, vei og feiltype. SM-3 rapporteres for testpersonene uten MRP-erfaring, og for alle i tillegg.
- Oppgave 1 brukes ikke som bevis for at markeringen i Resultattabell virker.
- Endringer etter testen prøves på 1–2 nye personer innen fristen for rettelser og føres som en egen runde i `brukertest-resultat.md`.

**Introduksjon (ordrett, endret 2026-11-13, til godkjenning av gruppa):**

> «Takk for at du vil hjelpe oss. Tenk deg at du er Kari. Hun er innkjøper i en liten møbelfabrikk, og hver morgen må hun finne ut hva som skal bestilles. Hun bruker COSI - MRP til dette: Hun laster opp en Excel-fil med stykklisten, lageret og behovene, og appen regner ut bestillingsplanen. Det er appen vi tester, ikke deg. Du kan klikke på det du vil vite mer om. Si gjerne høyt hva du tenker og ser etter mens du jobber. Jeg kan ikke hjelpe deg med selve oppgavene, bare hvis noe teknisk slutter å virke. Først laster du opp fila testeksempel 01, som ligger på skrivebordet. Deretter får du tre korte oppgaver, én om gangen.»

**Oppgavelapper og fasitsvar. Til godkjenning av gruppa.** Svarene er hentet fra den håndkontrollerte fasiten `testdata/testeksempel-01-fasit.xlsx`. En oppgave er løst når svaret er riktig innen 3 minutter (SM-3).

| Oppgave (SM-3) | Tekst på lappen (ordrett) | Riktig svar | Kilde i fasiten | Flater som skal bære den |
|---|---|---|---|---|
| 1 Finn en kritisk del | «Finn en kritisk del i planen. Si hvilken del det er.» | Én av 300-003 Hjul, 300-004 Armlene, 300-005 Gassfjær eller 300-006 Stolfot (beskrivelse eller varenummer). Ingen andre deler er kritiske. Svar med bare typen eller antallet er ikke løst, og testlederen leser da lappen høyt én gang til. Riktig del med feil begrunnelse er løst, men noteres som funn. Kjente feilsvar, som noteres som funn: 100-002 Kontorstol Basic (forventet lagerbeholdning 0 i alle uker) og 300-008 Trekk (0 fra uke 4). | Arket Eksepsjoner, A2:A5 (også PRD FR-13); feilsvarene i Fasittabell C4:L4 og F60:L60 | Statuslinje → Kritiske deler-liste; merket «Kritisk del» og eksepsjonsmarkør i Resultattabell |
| 2 Forklar en eksepsjon med egne ord | «Appen har funnet en eksepsjon for hjul. Forklar med dine egne ord hva som er galt, og hva Kari bør gjøre.» | Eksepsjonen er Bestilling forsinket i uke 1 for 300-003 Hjul. **Rubrikk, to krav.** **A, hva som er galt:** Kari (eller bedriften) er for sent ute med å bestille hjul, eller bestillingen skulle vært gjort tidligere, så det mangler hjul i uke 1. **B, hva hun bør gjøre:** bestille nå, be om raskere levering, eller si fra at leveransen til kunde blir forsinket. Løst når både A og B er dekket av svaret hun gir når klokka stopper, enten hun leser høyt fra skjermen eller sier det med egne ord. Tallene (−20 i uke 1, 50 for sent, tidligst uke 2) er godt, men ikke påkrevd. Ikke godkjent: «leverandøren er sen», «hjulene er ødelagt eller utgått», og en forklaring av bruttobehovet alene. Vurderes av to gruppemedlemmer hver for seg (se Vurdering og rapport). | Arket Eksepsjoner, A2:D2; Bestillingsforslag D3 (175) og F3 (50 forfalt); Fasittabell C25 (forventet lagerbeholdning 30), C26 (nettobehov 50), C27 (planlagt ordremottak 50); Utregning A45 (disponibel beholdning −20) | Kritiske deler-liste (klartekstlinja og «Se forklaring →»); forklaringspanelet med eksepsjonskortet først |
| 3 Les av mengde og frigivelsesuke for ett bestillingsforslag | «Appen foreslår å bestille rygger. Finn det første bestillingsforslaget for Rygg (det med tidligst uke). Hvor mange rygger gjelder det? I hvilken uke må Kari sende bestillingen til leverandøren?» | 25 rygger, frigivelsesuke 2 (300-002 Rygg). «Senest uke 2» godtas. Vanlig feilsvar: uke 3, som er uka ryggene kommer (planlagt ordremottak). | Arket Bestillingsforslag, rad 8 (A8:E8: C8 = 2, D8 = 25); Fasittabell D21 = 25 (planlagt ordrefrigivelse uke 2) og E20 = 25 (planlagt ordremottak uke 3) | Bestillingsforslag-tabell med hjelpeteksten om frigivelsesuke |

## Før bygging

Kort liste som skal være gjort før frontend-byggingen binder seg, og senest før prøvetesten rundt 27. november.

- **Prototype av forklaringspanelet** med tallene fra testeksempel 01 for de fire kritiske delene (hjul, armlene, gassfjær med fremskyndet mottak, og stolfot), prøvd på 1–2 personer, med eksepsjonskortet først og akseptsjekken for 1366 × 768. For Kanseller mottak, som testeksempel 01 ikke har, brukes testeksempel 02 (300-005, uke 5).
- **Ytelsesmåling** med en fil på 1000 stykklisterader mot NFR-5, før tabellstrukturen låses (se Resultattabell: rulling og ytelse).
- **Tastaturtest og NVDA-test** (se Accessibility Floor).
- **Kapasitetsskissen** (trinn 4) viser også tilstandene 0 i alle uker, uker uten begrensende del, mange uker (rulling og faste kolonner) og tastaturoppførsel uten klikkbar forklaring.
- **PRODUCT.md for Impeccable** lages når frontend-byggingen starter, med registeret «Operate» på alle flater og føringene fra PRD-en: ikke farge alene, ingen peking, fast rekkefølge, norsk, bare PC, SM-C2 og SM-C3. Ved konflikt gjelder BMAD-dokumentene (PRD, DESIGN.md og EXPERIENCE.md).
- **Vercel Analytics og Speed Insights** slås ikke på uten en vurdering mot NFR-4, fordi de samler data via tredjepart.

## Senere

Utsatt fra v1. Gjenopptas bare ved behov.

- **Graf over forventet lagerbeholdning** med sikkerhetslager som strek. Den er kuttet fra v1. Formen som var avtalt før kuttet: grafen viser ferdigproduktet som standard, Kari kan velge del ved klikk eller tastatur, og den vises aldri ved peking og aldri øverst på siden.
- **«Kopier feilliste» / «Last ned feilliste»** under feiloppsummeringen.
- **Mørk modus.** Lys modus er valgt ut fra bruksstedet (kontor på dagtid).
- **Bryter for tetthet.** Én fast radhøyde i v1.
