---
title: COSI - MRP PRD
status: draft
created: 2026-10-18
updated: 2026-10-18
---

# PRD: COSI - MRP

> **Utkast til gruppens gjennomgang.** Punkter merket **[BESLUTNING]** må avgjøres av gruppen før PRD-en settes til `final`. Punkter merket **[ANTAKELSE]** er utledet fra grunnlaget, men ikke bekreftet. Alle er samlet i avsnitt 9 og 10.

## 0. Om dokumentet

PRD-en beskriver **hva** COSI - MRP skal gjøre i første versjon, og er grunnlaget for arkitektur, epics og stories. Den bygger på:

- Product brief: `.docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/brief.md` (versjon 2026-10-06), med `addendum.md` og tilbakemeldingen fra faglærer
- Carmens øvingseksempel og skisse: `testeksempler/ovingseksempel-3-komponenter-4-uker.md` og `testeksempler/skisse-resultatside.md` (grenen `Carmen/Branch`)
- Excel-malen og testeksempel 01: `testdata/` (grenen `Sebastian/Branch`)

Begrepene i avsnitt 3 brukes ordrett i hele dokumentet. Kravene er nummerert globalt (FR-1, FR-2 …) og brukerreisene som UJ-1, UJ-2 …, slik at stories og tester kan vise til dem. Teknologivalg hører hjemme i arkitekturdokumentet, ikke her.

## 1. Visjon

I små produksjonsbedrifter ligger MRP-planleggingen ofte i et Excel-ark som bare én person forstår. COSI - MRP flytter beregningslogikken ut av personavhengige formler og inn i et verktøy: brukeren laster opp en fast Excel-mal, verktøyet kontrollerer dataene, beregner MRP-planen for hver komponent og varsler om det planleggeren må handle på.

Verdien ligger ikke i ny teori, men i at riktig rekkefølge, regler og forutsetninger er bygget inn og synlige. En planlegger uten formell planleggingsbakgrunn skal kunne se hvilke komponenter som er kritiske, hvor mye som må bestilles og når – og forstå hvorfor.

## 2. Målbruker

### 2.1 Jobs to be done

- **Funksjonelt:** Få en korrekt, ukentlig MRP-plan (bestillingsforslag og varsler) uten å regne for hånd.
- **Funksjonelt:** Se konsekvensene av en endring i MPS uten å regne hele planen på nytt.
- **Kontekst:** Overta planleggingen fra en kollega uten å måtte tolke udokumenterte formler.
- **Trygghet:** Stole på tallene, fordi forutsetningene og beregningen er synlige.

### 2.2 Ikke-brukere i v1

- Bedrifter med flernivå BOM eller flere ferdigprodukter.
- Brukere som trenger lagring over tid, flere brukere eller tilgangsstyring.
- Brukere som vil at verktøyet skal sende bestillinger til leverandører.

### 2.3 Brukerreiser

- **UJ-1. Kari lager ukens plan for første gang.**
  - **Person og kontekst:** Kari er innkjøper i en liten kontorstolprodusent og har nettopp overtatt planleggingen etter en kollega som sluttet.
  - **Start:** Hun har fylt ut Excel-malen med MPS, komponenter og registrerte mottak, og åpner COSI - MRP i nettleseren. Ingen innlogging.
  - **Forløp:** Hun laster opp filen → filen godkjennes → hun klikker «Beregn» → oversikten viser alle komponenter, med kritiske komponenter øverst.
  - **Høydepunkt:** Hun ser at K03 Hjul er kritisk, åpner komponenten og leser at 20 stk skulle vært bestilt før planstart.
  - **Avslutning:** Hun vet hva som må bestilles denne uken, og hvilken komponent som krever en hasteleveranse.

- **UJ-2. Kari oppdaterer planen etter endret MPS.**
  - **Person og kontekst:** Salg har økt produksjonen av stoler i uke 4.
  - **Start:** Resultatsiden viser forrige beregning.
  - **Forløp:** Hun endrer MPS i Excel, lagrer, klikker «Last opp endret fil» og deretter «Beregn på nytt».
  - **Høydepunkt:** Hun ser hvilke bestillingsforslag og varsler som er nye, endret eller fjernet (se [BESLUTNING B2]).
  - **Avslutning:** «Datagrunnlag» øverst viser den nye filen, og planen er oppdatert.

- **UJ-3. Kari laster opp en fil med feil.**
  - **Forløp:** Hun har glemt «Antall per ferdigprodukt» for én komponent og laster opp filen.
  - **Høydepunkt:** Verktøyet viser hvilket ark, hvilken rad og hvilket felt som er feil, og at tabellen fortsatt viser resultatene fra forrige fil.
  - **Avslutning:** Hun retter feilen i Excel og laster opp på nytt.

- **UJ-4. Kari vurderer en forsinket bestilling.**
  - **Forløp:** Hun åpner varselet for en komponent med «Bestilling forsinket» og klikker «Vis kontrollberegning».
  - **Høydepunkt:** Hun ser hvor stort det udekkede behovet blir hvis det planlagte mottaket ikke kommer, og hvor langt under sikkerhetslageret lageret havner.
  - **Avslutning:** Hun bestemmer selv om hun skal be om hasteleveranse. Verktøyet flytter ingenting.

## 3. Ordliste

Disse begrepene brukes ordrett i grensesnittet, i dokumentasjonen, i Excel-malen og i koden. Ingen synonymer.

- **Ferdigprodukt** – Produktet i MPS. Nøyaktig ett per datasett i v1.
- **Komponent** – En vare som inngår i ferdigproduktet. 5–10 per datasett.
- **Antall per ferdigprodukt** – Hvor mange enheter av komponenten som går med per ferdigprodukt (enkeltnivå BOM).
- **MPS** – Hvor mange ferdigprodukter som produseres per uke.
- **Uke / planstart / horisont** – Uke 1 er **planstart**. **Horisonten** er antall sammenhengende utfylte uker i MPS fra uke 1 (8–12).
- **Startlager** – Lagerbeholdning for komponenten ved planstart.
- **Sikkerhetslager** – Minste ønskede forventede lager for komponenten.
- **Innkjøpstid** – Antall hele uker fra en bestilling frigis til den mottas.
- **Registrert mottak** – En leveranse fra en bestilling som allerede er lagt inn. Leses fra Excel-filen. *(Erstatter «planlagte mottak» i dagens mal og brief.)*
- **Bruttobehov** – MPS(uke) × antall per ferdigprodukt.
- **Tilgjengelig** – Forventet lager forrige uke + registrerte mottak denne uken.
- **Nettobehov** – maks(0, bruttobehov + sikkerhetslager − tilgjengelig).
- **Planlagt mottak** – Mengden verktøyet foreslår mottatt i en uke. Beregnet, ikke bestilt.
- **Planlagt frigivelse** – Det planlagte mottaket flyttet innkjøpstiden bakover. Dette er **bestillingsforslaget**: hvor mye som må bestilles, og i hvilken uke.
- **Forventet lager** – Tilgjengelig + planlagt mottak − bruttobehov.
- **Varsel** – En av de fire varseltypene i avsnitt 4.3, knyttet til en komponent og eventuelt en uke.
- **Kritisk komponent** – En komponent med minst ett varsel.
- **Kontrollberegning** – En beregning for én uke som viser forventet lager *uten* et planlagt mottak som er forsinket.
- **Kjøring** – Én beregning basert på én opplastet fil.

## 4. Funksjoner

### 4.1 Opplasting og validering

**Beskrivelse:** Brukeren laster opp en utfylt Excel-mal. Verktøyet kontrollerer struktur og verdier før beregningen, og forklarer feil så presist at brukeren kan rette dem i Excel. Realiserer UJ-1 og UJ-3.

#### FR-1: Last opp Excel-mal

Brukeren kan laste opp en `.xlsx`-fil som følger malen `testdata/COSI-MRP-mal.xlsx`.

**Konsekvenser (testbare):**
- Andre filtyper enn `.xlsx` avvises med meldingen «Filen må være en Excel-fil (.xlsx).»
- Testeksempel 01 og øvingseksempelet lastes opp uten feil.

#### FR-2: Valider struktur

Verktøyet kontrollerer at arkene Produkt, MPS, Komponenter og Registrerte mottak finnes, og at de har de påkrevde kolonnene.

**Konsekvenser (testbare):**
- Et ark eller en kolonne som mangler gir en feilmelding som navngir arket eller kolonnen.
- Arket Registrerte mottak kan være tomt.

#### FR-3: Valider verdier

Verktøyet avviser filen hvis noe av dette gjelder:

| Regel | Eksempel på melding |
|---|---|
| Påkrevd celle er tom | Arket «Komponenter», rad 4: «Antall per ferdigprodukt» mangler. |
| Tall er negativt eller ikke et heltall | Arket «MPS», uke 3: «Antall» må være et heltall ≥ 0. |
| Horisonten er ikke 8–12 uker | MPS må ha 8–12 sammenhengende uker fra uke 1. Filen har 6. |
| Antall komponenter er ikke 5–10 | Filen må ha 5–10 komponenter. Den har 12. |
| Komponent-ID finnes flere ganger | Komponent-ID «K03» finnes på rad 4 og 7. |
| Registrert mottak viser til ukjent komponent | Arket «Registrerte mottak», rad 2: Komponent-ID «K11» finnes ikke. |
| Registrert mottak ligger utenfor horisonten | Arket «Registrerte mottak», rad 3: uke 14 er utenfor horisonten (uke 1–10). |

**Konsekvenser (testbare):**
- Hver regel har minst én testfil som utløser nøyaktig den feilmeldingen.
- Alle feil i filen vises samlet, ikke bare den første. [ANTAKELSE A1]

#### FR-4: Behold forrige resultat ved feil

Hvis en ny fil avvises, beholdes resultatene og «Datagrunnlag» fra forrige godkjente fil. Realiserer UJ-3.

**Konsekvenser (testbare):**
- Etter en avvist opplasting viser siden meldingen «Den nye filen kunne ikke brukes. Tabellen viser fortsatt resultatene fra forrige fil.»
- Tabell, varsler og filnavn er uendret.

#### FR-5: Vis datagrunnlag

Øverst på resultatsiden står navnet på filen resultatene gjelder, og tidspunktet den ble lastet opp.

**Konsekvenser (testbare):**
- Etter ny godkjent kjøring endres filnavn og tidspunkt. Etter avvist opplasting endres de ikke.

### 4.2 Beregningsmotor

**Beskrivelse:** Standard MRP for enkeltnivå BOM med lot-for-lot. Beregningsmotoren er adskilt fra Excel-lesing og visning, slik at den kan testes alene mot fasit. Hele horisonten beregnes alltid.

**Forutsetninger (vises også på resultatsiden):**
- Mottak (registrerte og planlagte) er tilgjengelige før ukens bruttobehov trekkes fra.
- Komponentene brukes i samme uke som ferdigproduktet produseres i MPS.
- Verktøyet flytter aldri mottak eller bestillinger. Det varsler, og planleggeren bestemmer.

#### FR-6: Beregn MRP-tabell per komponent

For hver komponent og hver uke *t* i horisonten beregner verktøyet, i denne rekkefølgen:

1. Bruttobehov = MPS(*t*) × antall per ferdigprodukt
2. Tilgjengelig = forventet lager(*t* − 1) + registrerte mottak(*t*), der forventet lager(0) = startlager
3. Nettobehov = maks(0, bruttobehov + sikkerhetslager − tilgjengelig)
4. Planlagt mottak = nettobehov (lot-for-lot)
5. Planlagt frigivelse i uke *t* − innkjøpstid = planlagt mottak(*t*)
6. Forventet lager = tilgjengelig + planlagt mottak − bruttobehov

**Konsekvenser (testbare):**
- 100 % samsvar med fasit for øvingseksempelet (3 komponenter, 4 uker) og testeksempel 01 (8 komponenter, 10 uker).
- Innkjøpstid 0 gir planlagt frigivelse i samme uke som det planlagte mottaket. [ANTAKELSE A2]

#### FR-7: Planlagte frigivelser før planstart

En planlagt frigivelse som havner i uke 0 eller tidligere, beholdes i riktig uke og flyttes ikke til uke 1. [BESLUTNING B1]

**Konsekvenser (testbare):**
- K3 i øvingseksempelet har en planlagt frigivelse på 20 i uke 0.
- Testeksempel 01 og fasiten bruker samme regel.

#### FR-8: Endret periode gir ikke ny beregning

Beregningen gjøres alltid for hele horisonten. Valg av periode påvirker bare hvilke uker som vises (FR-18).

**Konsekvenser (testbare):**
- Forventet lager i uke 5 er det samme om perioden er uke 1–10 eller uke 5–10.

### 4.3 Varsler

**Beskrivelse:** Fire varseltyper forteller planleggeren hvor det må handles. Hvert varsel har komponent, eventuelt uke, og en kort tekst som forklarer hva som er galt. Utløsningsreglene under er presisert ut fra briefen og Carmens øvingseksempel. [BESLUTNING B3]

#### FR-9: Bestilling forsinket

Utløses for komponent *k* i uke *t* når den planlagte frigivelsen for det planlagte mottaket i uke *t* ligger i uke 0 eller tidligere, **og** kontrollberegningen (FR-13) gir forventet lager under 0 i uke *t*.

**Konsekvenser (testbare):**
- K3 i øvingseksempelet, uke 2: kontrollberegningen gir −10 → «Bestilling forsinket».
- K03 Hjul i testeksempel 01, uke 1: kontrollberegningen gir −20 → «Bestilling forsinket».
- Teksten oppgir mengde, uken mottaket trengs, og nødvendig bestillingsuke. Eksempel: «20 stk må være mottatt i uke 2. Nødvendig bestillingsuke: uke 0 – før planstart.»

#### FR-10: Bruk av sikkerhetslager

Utløses for komponent *k* i uke *t* når den planlagte frigivelsen ligger i uke 0 eller tidligere, **og** kontrollberegningen gir forventet lager fra og med 0 og under sikkerhetslageret. Behovet dekkes altså, men sikkerhetslageret brukes.

**Konsekvenser (testbare):**
- Hver planlagt frigivelse i uke 0 eller tidligere gir nøyaktig ett varsel: enten FR-9 eller FR-10, aldri begge.
- K04 Armlene i testeksempel 01: kontrollberegningen gir 10 i uke 1 (sikkerhetslager 20) → «Bruk av sikkerhetslager».

#### FR-11: Mottak forsinket

Utløses for komponent *k* i uke *t* når nettobehovet i uke *t* er større enn 0 og komponenten har et registrert mottak i en senere uke. Meldingen peker på det første senere mottaket, som bør fremskyndes. (Samme regel som i fasiten til testeksempel 01.)

**Konsekvenser (testbare):**
- K05 Gassfjær i testeksempel 01 (nettobehov 10 i uke 3, registrert mottak i uke 4) gir «Mottak forsinket» i uke 3, og bare der.
- K07 Skruesett (mottak kommer i tide) gir ingen varsel.

#### FR-12: Innkjøpstid overskrider horisont

Utløses for komponenten (ikke en bestemt uke) når innkjøpstiden er lik eller lengre enn horisonten, uavhengig av behov.

**Konsekvenser (testbare):**
- K06 Stolfot i testeksempel 01 (innkjøpstid = horisont) gir varselet.
- Ingen komponent i øvingseksempelet gir varselet.

#### FR-13: Kontrollberegning

For hver uke med et varsel fra FR-9 eller FR-10 beregner verktøyet forventet lager for den uken *uten* det planlagte mottaket:
forventet lager(*t* − 1) + registrerte mottak(*t*) − bruttobehov(*t*).
Kontrollberegningen gjelder bare den ene uken. Den endrer ikke MRP-tabellen, og senere uker beregnes ikke på nytt.

**Konsekvenser (testbare):**
- K3, uke 2: 20 + 30 − 60 = −10, altså 10 stk udekket behov og 20 under sikkerhetslageret.

#### FR-14: Kritisk komponent

En komponent med minst ett varsel er kritisk.

**Konsekvenser (testbare):**
- K3 er kritisk i øvingseksempelet. K1 og K2 er det ikke.

### 4.4 Resultatside

**Beskrivelse:** Bygger på Carmens skisse. Rekkefølge fra toppen: datagrunnlag og valg → oversikt over alle komponenter → varsler for valgt komponent → MRP-tabell. Realiserer UJ-1 og UJ-4.

#### FR-15: Oversikt over alle komponenter

Oversikten viser alle komponenter med status («⚠ Kritisk» eller «✓ OK») og en kort liste over varslene.

**Konsekvenser (testbare):**
- Kritiske komponenter står øverst. Innenfor hver gruppe sorteres komponentene etter komponent-ID. [ANTAKELSE A3]
- Status vises alltid med både symbol og tekst.

#### FR-16: Velg komponent

Brukeren velger komponent i en nedtrekksliste. Kritiske komponenter står øverst og er merket «⚠». Brukeren kan også klikke på en komponent i oversikten.

#### FR-17: MRP-tabell for valgt komponent

Tabellen viser radene bruttobehov, registrerte mottak, tilgjengelig, nettobehov, planlagte mottak, forventet lager og planlagte frigivelser per uke. Over tabellen står komponentens data (antall per ferdigprodukt, startlager, sikkerhetslager og innkjøpstid).

**Konsekvenser (testbare):**
- Har komponenten planlagte frigivelser i uke 0 eller tidligere, får tabellen én kolonne for hver slik uke. Bare raden for planlagte frigivelser har tall der.
- Celler med varsel er merket med «⚠» og en fotnote som forklarer varselet.

#### FR-18: Velg periode

Brukeren kan begrense hvilke uker tabellen viser. Se FR-8.

#### FR-19: Varsler over tabellen

Varslene for valgt komponent vises over tabellen, slik at brukeren ser dem før tallene. Den korte varselteksten vises alltid. Kontrollberegningen (FR-13) åpnes med «Vis kontrollberegning for uke *t*» og vises under tabellen. Realiserer UJ-4.

#### FR-20: Vis forutsetningene

Forutsetningene fra avsnitt 4.2 er tilgjengelige på resultatsiden, slik at brukeren kan se hvordan tallene er beregnet.

### 4.5 Endring midt i planen

**Beskrivelse:** Endringer gjøres i Excel og lastes opp på nytt. Appen har ingen redigering av data i v1. Realiserer UJ-2.

#### FR-21: Last opp endret fil og beregn på nytt

Fra resultatsiden kan brukeren laste opp en endret fil. Etter godkjent validering klikker brukeren «Beregn på nytt», og tabell, varsler og datagrunnlag erstattes.

**Konsekvenser (testbare):**
- Endret MPS i uke 2 fra 30 til 20 i øvingseksempelet gir nye tall for alle tre komponentene, som samsvarer med en egen fasit.

#### FR-22: Før/etter-sammenligning [BESLUTNING B2]

Etter en ny kjøring viser verktøyet hva som er endret mot forrige kjøring:
- planlagte frigivelser som er nye, endret (med gammel og ny mengde) eller fjernet, per komponent og uke
- varsler som har kommet til eller forsvunnet

**Konsekvenser (testbare):**
- Ved uendret fil vises «Ingen endringer».
- Sammenligningen for endringsscenarioet i testeksempel 01 viser nøyaktig de radene som er endret i fasiten.

### 4.6 Planlagt utvidelse: fast partistørrelse

**Beskrivelse:** Lages som eget epic etter at kjernen (4.1–4.5) er ferdig og testet mot fasit.

#### FR-23: Fast partistørrelse per komponent

Brukeren kan oppgi en fast partistørrelse for en komponent i Excel-malen. Er feltet tomt, brukes lot-for-lot.

**Konsekvenser (testbare):**
- Planlagt mottak = nettobehovet rundet opp til nærmeste hele antall partier. Overskuddet føres videre i forventet lager.
- Fasiten utvides med minst to komponenter med fast partistørrelse, og kravet er 100 % samsvar.

## 5. Ikke-funksjonelle krav

- **NFR-1 Ytelse:** Validering og beregning av 10 komponenter over 12 uker tar under 2 sekunder på en vanlig bærbar PC.
- **NFR-2 Kjørbarhet:** Appen kan startes lokalt etter README uten nøkler, betalte kontoer eller nettverkstjenester. Excel-malen og testfilene ligger i `testdata/`.
- **NFR-3 Testbarhet:** Beregningsmotoren og varsellogikken kan kjøres og testes uten Excel-lesing og grensesnitt. Fasittabellene brukes som automatiske tester.
- **NFR-4 Tilgjengelighet:** Status og varsler skilles aldri bare med farge. Symbol og tekst brukes alltid.
- **NFR-5 Språk:** Grensesnitt, feilmeldinger og varsler er på norsk og bruker begrepene i avsnitt 3.
- **NFR-6 Plattform:** Siste versjon av Chrome, Edge og Firefox på PC. Ikke mobiltilpasset.
- **NFR-7 Tilstand:** Forrige kjøring holdes bare så lenge nettleserfanen er åpen. Ingen lagring på server mellom økter. [ANTAKELSE A4]

## 6. Ikke-mål

- Verktøyet sender ikke bestillinger og kobles ikke til leverandører eller ERP.
- Verktøyet flytter aldri mottak eller bestillinger automatisk.
- Ingen redigering av data i appen. Endringer gjøres i Excel.
- Ingen KI-funksjonalitet i appen.
- Ingen eksport av resultater i v1. [ANTAKELSE A5]

## 7. Omfang for v1

### 7.1 Med

- Opplasting og validering av Excel-mal (4.1)
- Beregningsmotor for enkeltnivå BOM, ett ferdigprodukt, 5–10 komponenter, 8–12 uker, lot-for-lot (4.2)
- Fire varseltyper og kontrollberegning (4.3)
- Resultatside med oversikt, MRP-tabell og varsler (4.4)
- Ny opplasting ved endringer, med før/etter-sammenligning (4.5) [BESLUTNING B2]
- Fast partistørrelse som planlagt utvidelse (4.6)

### 7.2 Ikke med (videreutvikling)

- Flernivå BOM og flere ferdigprodukter
- Andre bestillingsregler, f.eks. økonomisk ordrestørrelse
- Manuell inntasting i appen
- Innlogging, lagring og flere bedrifter
- Testing hos reelle bedrifter

## 8. Suksessmål

**Primære**
- **SM-1 Korrekt beregning:** 100 % samsvar med manuelt kontrollert fasit for øvingseksempelet og testeksempel 01. Validerer FR-6 og FR-7.
- **SM-2 Pålitelige varsler:** Alle kjente avvik i testeksemplene gir riktig varseltype i riktig uke, uten falske varsler. Alle fire varseltypene er dekket. Validerer FR-9 til FR-14.
- **SM-3 Forståelig uten forkunnskap:** Etter en kort introduksjon finner og forklarer 3 av 3 testpersoner kritisk komponent, bestillingsmengde og bestillingsuke uten hjelp. Validerer FR-15 til FR-20.

**Sekundære**
- **SM-4 Inndatakontroll:** Hver valideringsregel i FR-3 har en testfil som gir riktig feilmelding. Validerer FR-1 til FR-4.
- **SM-5 Realistisk scenario:** En komplett kjøring over 8–12 uker med én endret MPS midtveis gir riktig ny plan, og sammenligningen viser nøyaktig det som er endret. Validerer FR-21 og FR-22.

**Motmål (skal ikke optimaliseres)**
- **SM-C1 Antall funksjoner:** Flere funksjoner er ikke et mål i seg selv. Utvidelsen i 4.6 starter først når SM-1 og SM-2 er nådd. Motvekt til fristelsen å utvide før kjernen er stabil.
- **SM-C2 Antall varsler:** Flere varsler gjør ikke verktøyet bedre. Et varsel som ikke krever handling, svekker tilliten. Motvekt til SM-2.

## 9. Beslutninger gruppen må ta

1. **[BESLUTNING B1] Planlagte frigivelser før planstart.** Carmens skisse viser riktig uke (0, −1 …). Reglene i testeksempel 01 legger forfalte frigivelser i uke 1. *Forslag:* Følg Carmen (FR-7) og oppdater fasiten til testeksempel 01. Det er mer korrekt, og brukeren ser hvor sent bestillingen faktisk er.
2. **[BESLUTNING B2] Før/etter-sammenligning i v1.** Briefen og faglærer har den med. Carmen foreslår å utelate den. *Forslag:* Ta den med i den enkle formen i FR-22 (en endringsliste, ikke to tabeller ved siden av hverandre). Hvis den utelates, må briefen og SM-5 endres.
3. **[BESLUTNING B3] Utløsningsreglene for varsler.** FR-9 til FR-12 følger reglene i fasiten til testeksempel 01. FR-9 og FR-10 skiller «bestilling forsinket» (udekket behov) fra «bruk av sikkerhetslager» (behovet dekkes, men sikkerhetslageret brukes), slik at hver forsinket frigivelse gir nøyaktig ett varsel. Carmens øvingseksempel gir derimot begge varslene for K3 i uke 2. *Forslag:* Godta reglene og oppdater oppsummeringen i øvingseksempelet.
4. **[BESLUTNING B4] Navn på ark i malen.** Arket «Planlagte mottak» får nytt navn, «Registrerte mottak», og briefen oppdateres tilsvarende.
5. **[BESLUTNING B5] Begrepsnavn.** «Bruk av sikkerhetslager» (briefen og fasiten) brukes, ikke «Under sikkerhetslager» (Carmen). Radnavnene i fasiten (`Planlagte mottak`, `Planlagte ordremottak`, `Planlagte ordrefrigivelser`, `Disponibel`) endres til ordlisten i avsnitt 3 (`Registrerte mottak`, `Planlagte mottak`, `Planlagte frigivelser`, `Tilgjengelig`). Merk: «Disponibel» i fasiten er tilgjengelig *minus* bruttobehov, altså det samme som kontrollberegningen.

## 10. Antakelser

- **A1** (FR-3) – Alle valideringsfeil vises samlet.
- **A2** (FR-6) – Innkjøpstid kan være 0 uker.
- **A3** (FR-15) – Sortering etter komponent-ID innenfor kritisk/OK.
- **A4** (NFR-7) – Ingen lagring mellom økter.
- **A5** (Ikke-mål) – Ingen eksport i v1.

## 11. Åpne spørsmål

1. Skal kontrollberegningen også vises for «mottak forsinket», altså lager i uke *t* uten det registrerte mottaket som kommer for sent?
2. Trenger testeksempel 01 et eget endringsscenario (fil før og etter) med fasit for SM-5, eller holder det med øvingseksempelet?
3. Skal øvingseksempelet få to komponenter til, slik at alle fire varseltypene dekkes også der?
