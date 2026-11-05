---
title: COSI - MRP PRD
status: draft
created: 2026-10-19
updated: 2026-11-05
---

# PRD: COSI - MRP

## 0. Dokumentets formål

Denne PRD-en beskriver hva første versjon av COSI - MRP skal gjøre. Den er skrevet for gruppen G23 i IBE160, for sensor og for de neste stegene i BMAD (arkitektur, epics og stories). Den bygger på product brief (`.docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/brief.md`), faglærers tilbakemelding (`tilbakemelding-product-brief.md` i samme mappe) og testdataene i `testdata/`. Den gjentar ikke innholdet i dem. Briefen er frosset. Ved avvik mellom briefen og PRD-en gjelder PRD-en.

Begrepene i §3 Ordliste brukes likt i hele dokumentet og følger ordbanken (`.docs/ordbank.md`). Funksjonene står i §4, med funksjonskrav (FR-1 til FR-29) under hver funksjon. Kravene har faste nummer, så epics, stories og tester kan vise til dem. Alle antagelser fra utkastet er bekreftet eller endret (§10). Tekniske valg og bakgrunn står i `addendum.md` i denne mappen.

**Status:** Utkast laget på rask vei 2026-10-19. Alt som var tilgjengelig da, regnes som bestemt. Gruppen går gjennom utkastet på et felles møte og kan endre det.

**Oppdatert 2026-10-26:** Flernivå BOM er med i v1, slik briefen sier fra 2026-10-22. Excel-malen er bygd om: arkene Produkt og Komponenter er erstattet av arket Stykkliste, arket med Prognostiserte behov (MPS) heter MPS, og «innkjøpstid» heter nå «ledetid».

**Oppdatert 2026-11-05:** Alle åpne spørsmål og antagelser er besluttet (`beslutninger-2026-11-05.md` i denne mappen). «Del» er samlebegrepet for radene i stykklisten, og «komponent» brukes bare i typenavnene. «Prognostiserte behov» erstatter «MPS» i teksten, men arket i malen heter fortsatt MPS. «Eksepsjon» brukes overalt, også i appen. FR-16, FR-17, FR-18, NFR-4 og NFR-8 er endret, og fristen er satt (§7).

## 1. Visjon

I små produksjonsbedrifter er MRP-planleggingen ofte et Excel-ark som bare én person forstår. Logikken for ledetid, sikkerhetslager og bestillinger ligger skjult i formler. Er personen borte, stopper planleggingen, eller den gjøres feil.

COSI - MRP er en nettbasert app som legger hele MRP-prosessen inn i verktøyet. Planleggeren fyller ut en fast Excel-mal og laster den opp. Appen sjekker dataene, beregner nettobehov og bestillingsforslag for hver uke og del, og viser eksepsjoner der planen ikke går opp. Alt vises i én oversiktlig tabell. Hvert tall har en forklaring av hvordan det er regnet ut, så en ny planlegger kan forstå planen uten å kunne formlene.

Første versjon dekker ett ferdigprodukt med flernivå BOM (stykkliste) på inntil tre nivåer. Behovet brytes ned nivå for nivå, fra ferdigproduktet via hovedkomponentene til delene de bygges av. Målet er at prosessen er korrekt, kan etterprøves og er lett å forstå. Bredden kommer senere: flere produkter, flere språk og flere bedrifter.

## 2. Målbruker

### 2.1 Jobs To Be Done

- **Funksjonelt:** Lage ukens bestillingsplan for delene raskt og uten regnefeil.
- **Funksjonelt:** Se med en gang hvilke deler som krever handling, og hva som må gjøres.
- **Funksjonelt:** Se konsekvensene når prognosen endres, uten å regne alt på nytt for hånd.
- **Kontekst:** Kunne overta planleggingen etter en kollega uten å måtte lære seg kollegaens regneark.
- **Emosjonelt:** Stole på tallene og kunne forklare dem for leder eller leverandør.

### 2.2 Ikke-brukere (v1)

- Bedrifter med flere ferdigprodukter som skal planlegges samlet, eller stykklister med mer enn tre nivåer.
- Brukere som trenger et fullt ERP-system med produksjon, økonomi og ordrehåndtering.
- Flere brukere som skal samarbeide om samme plan samtidig.

### 2.3 Viktige brukerreiser

- **UJ-1. Kari tar i bruk COSI - MRP første gang.**
  Kari er innkjøper i en liten møbelprodusent og har nettopp overtatt planleggingen etter en kollega som har sluttet. Kollegaen brukte sitt eget regneark, som Kari ikke forstår. Hun åpner COSI - MRP i nettleseren og leser den korte veiledningen på startsiden: fyll ut malen, last opp, les tabellen. For å se hvordan et resultat ser ut, laster hun ned testeksempel 01 og laster det opp uten endringer. Hun klikker på noen celler og leser forklaringene i panelet. Deretter laster hun ned den tomme malen og fyller ut stykklisten for stolen med tall fra kollegaens regneark. Underveis viser Kontroll-kolonnen at ledetiden mangler på én rad, og hun retter det før hun laster opp. Så fyller hun ut prognostiserte behov og planlagte mottak og laster opp filen. Appen har ingen tidligere kjøring for stolen, så den viser ingen sammenligning, bare bestillingsforslagene, de kritiske delene og tabellen. Fra nå av kopierer hun denne filen når hun planlegger (UJ-2).

- **UJ-2. Kari oppdaterer planen og ser hva hun må bestille.**
  Kundene sender bestillinger og endrede behov alle dager i uka, også i helgene, så Kari oppdaterer planen hver arbeidsdag. Hun selger få forskjellige produkter, så hun kopierer forrige ukes fil i stedet for å lage planen på nytt. Hun endrer prognostiserte behov, lagerbeholdning og planlagte mottak, og stykklisten for stolen står som før. Hun laster opp filen i COSI - MRP. Først ser hun på bestillingsforslagene. Hun filtrerer på uke 1 og ser at hun må bestille 175 hjul denne uka, og at 50 av dem er forfalte. Deretter går hun til sammendraget av kritiske deler, som viser fire deler. Hun velger gassfjær og ser at mottaket på 100 i uke 4 må fremskyndes til uke 3. Hun bestiller hjulene, ringer leverandøren av gassfjær og eksporterer resultatet til Excel. **Unntak:** Lurer hun på hvorfor nettobehovet for hjul er 50 i uke 1, klikker hun på cellen, og forklaringen åpnes i panelet ved siden av tabellen.

- **UJ-3. Kari ser hva en ny kundeordre betyr.**
  Tirsdag ettermiddag bestiller en kunde 15 flere Kontorstol Pro i uke 2. Kari endrer prognostiserte behov i uke 2 fra 30 til 45 i filen fra morgenens kjøring og laster den opp på nytt. Appen husker morgenens kjøring for Kontorstol Pro og viser en før/etter-sammenligning. Kari bruker den til to ting: å kontrollere at endringen ga det hun ventet, og å se om det er kommet nye problemer. Hun ser at flere bestillingsforslag i uke 1 har økt, blant annet hjul fra 130 til 205, at det er kommet et nytt forslag på 30 skruesett M6 i uke 1, og at hjul har fått eksepsjonen «Bruk av sikkerhetslager». Mottaket på 40 rygger må nå fremskyndes til uke 2 i stedet for uke 3. Hun justerer bestillingene uten å regne noe selv. **Unntak:** Laster hun deretter opp filen for et annet produkt, sammenlignes den med forrige kjøring for det produktet. Vil hun starte på nytt for et produkt, sletter hun den lagrede kjøringen for det, og da vises ingen sammenligning neste gang.

- **UJ-4. Kari retter feil etter å ha kopiert filen.**
  Mandag morgen rykker planen én uke fram. Kari kopierer forrige ukes fil og flytter ukene i prognostiserte behov og planlagte mottak ett hakk. I tillegg legger hun inn et nytt mottak som leverandøren har lovet. Stykklisten er uendret, så Kontroll-kolonnen viser ingen feil. Hun laster opp filen. Appen gjør ingen beregning, men viser alle feilene samlet:
  - «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten.» Mottaket av hjul kom forrige uke, og etter flyttingen står det i uke 0.
  - «MPS, uke 11, Antall per uke: uke 10 er tom, så uke 11 kan ikke fylles ut.» Hun la den nye uka én kolonne for langt ut.
  - «Planlagte mottak, rad 5, Antall: må være et heltall.» Hun skrev «ca. 40» fordi mengden ikke er bekreftet.

  Forrige kjøring for stolen er fortsatt lagret. Hun sletter raden for mottaket som er kommet, legger det inn på lagerbeholdningen, flytter den nye uka og skriver 40. Hun laster opp filen igjen og kommer videre til bestillingsforslagene og sammenligningen (UJ-2, UJ-3).

## 3. Ordliste

- **Excel-mal** – Den faste filen `COSI-MRP-mal.xlsx` som brukeren fyller ut og laster opp. Ark: Veiledning, Stykkliste, MPS, Planlagte mottak, Veien videre.
- **BOM (stykkliste)** – Ferdigproduktet og alle delene det består av, én rad per del ovenfra og ned, i arket Stykkliste. Kolonner: Nivå, Varenummer, Beskrivelse, Antall, Type, Lagerbeholdning, Sikkerhetslager og Ledetid (uker). Inntil 1000 rader.
- **Del** – Én rad i stykklisten, uansett nivå og type. Har varenummer, beskrivelse, antall per enhet av overordnet del (ikke på nivå 0), type, lagerbeholdning, sikkerhetslager og ledetid. Samlebegrepet i dokumenter, kode og app.
- **Komponent** – Brukes bare i typenavnene Komponent (Kjøpes inn) og Komponent (Produseres selv), ikke som samlebegrep for deler.
- **Nivå** – Hvor i stykklisten en del står: 0 (ferdigproduktet), .1 (hovedkomponentene) eller ..2 (delene som trengs for å bygge hovedkomponenten rett over). Første rad er alltid 0, og det finnes bare én rad med nivå 0. Nivå ..2 står rett under en .1 eller en annen ..2.
- **Overordnet del** – Delen en rad hører til: nærmeste rad over med ett nivå høyere. For nivå .1 er det ferdigproduktet.
- **Varenummer** – Delens identitet. Samme varenummer betyr samme del. Malen foreslår varegruppe-løpenummer (100-xxx ferdigvare, 200-xxx produseres selv, 300-xxx kjøpes inn), men appen krever ikke et bestemt format.
- **Ferdigprodukt** – Det ene produktet planen gjelder for, på nivå 0 med type Ferdigvare.
- **Type** – Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv). Ferdigvare brukes bare på nivå 0. En del som kjøpes inn, kan ikke ha underkomponenter.
- **Felles del** – En del som står flere steder i stykklisten, for eksempel skruer som brukes både i setet og i ryggen. Den har samme varenummer, beskrivelse og type hver gang. Lagerbeholdning, sikkerhetslager og ledetid står bare første gang.
- **Lavnivåkode** – Det laveste nivået (største nivåtall) en del står på i stykklisten. En felles del beregnes én gang, på sin lavnivåkode, etter at alle overordnede deler er beregnet.
- **Prognostiserte behov (MPS)** – Antall ferdigprodukter som trengs per uke. Fylles ut i arket MPS i Excel-malen.
- **Horisont (H)** – Antall uker med prognostiserte behov som er fylt ut sammenhengende fra uke 1. Gyldig mellom 8 og 12.
- **Uke (t)** – Én periode i horisonten, nummerert 1 til H.
- **Lagerbeholdning** – Antall på lager før uke 1.
- **Sikkerhetslager (SS)** – Den laveste lagerbeholdningen planen skal holde.
- **Ledetid (L)** – Antall uker fra en ordre frigis til den mottas: innkjøpstid for deler som kjøpes inn, produksjonstid for deler som produseres selv. Minst 1 for alle deler unntatt ferdigproduktet, der 0 er lov.
- **Ledetid fra ferdigproduktet** – For en del: den største summen av ledetider langs en sti i stykklisten fra ferdigproduktet ned til og med delen. Sier hvor mange uker før behovet for ferdigproduktet delen må bestilles (FR-9).
- **Planlagt mottak** – Et innkjøp som allerede er bestilt, eller en produksjonsordre som allerede er startet, og som kommer i en bestemt uke. Oppgis i Excel-malen. Beregningen kan regne det som fremskyndet (FR-6).
- **Bruttobehov** – Behovet for en del i en uke. For ferdigproduktet er det prognostiserte behov. For de andre delene er det summen av planlagte ordrefrigivelser for hver overordnet del × antall per enhet.
- **Disponibel beholdning** – Forventet lagerbeholdning fra uken før + planlagte mottak − bruttobehov. Regnes før nye ordrer.
- **Nettobehov** – Det som mangler for å holde sikkerhetslageret: maks(0, SS − disponibel beholdning).
- **Bestillingsregel** – Regelen som gjør nettobehov om til bestilt mengde. I v1 lot-for-lot, med fast partistørrelse som utvidelse.
- **Lot-for-lot** – Bestilt mengde er lik nettobehovet.
- **Fast partistørrelse** – Bestilt mengde rundes opp til et helt antall partier av en fast størrelse.
- **Planlagt ordremottak** – Mengden en ny, foreslått bestilling skal levere i en uke.
- **Planlagt ordrefrigivelse** – Uken og mengden en foreslått bestilling må frigis: uke t − L.
- **Forfalt frigivelse** – En planlagt ordrefrigivelse der t − L < 1. Den legges i uke 1.
- **Forventet lagerbeholdning** – Disponibel beholdning + planlagt ordremottak.
- **Bestillingsforslag** – En planlagt ordrefrigivelse med del, uke og mengde. Det er dette brukeren handler på. For deler som kjøpes inn er det et innkjøp, for deler som produseres selv en produksjonsordre.
- **Eksepsjon** – En melding om avvik for en del, enten i en bestemt uke eller for hele delen. Det er fem eksepsjonstyper (§4.3). Begrepet brukes også i teksten i appen.
- **Kritisk del** – En del med minst én eksepsjon. Gjelder alle nivåer, også ferdigproduktet.
- **Kjøring** – Én beregning fra én opplastet Excel-mal. Gir én resultattabell.
- **Resultattabell** – Visningen av en kjøring: radene bruttobehov, planlagte mottak, forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte ordrefrigivelser, per uke og del, med eksepsjonene markert.
- **Kontroll-kolonnen** – Hjelpekolonnen til høyre i arket Stykkliste i Excel-malen. Den viser hva som mangler eller ikke stemmer i hver rad, mens brukeren fyller ut. Appen leser den ikke inn.
- **Før/etter-sammenligning** – Visningen av forskjellene i bestillingsforslag og eksepsjoner mellom forrige kjøring for samme ferdigprodukt og den nye.
- **Valideringsfeil** – En feil i den opplastede filen som hindrer beregningen. Har ark, rad eller celle og årsak.
- **Fasit** – Den manuelt kontrollerte forventede resultattabellen og eksepsjonslisten for et testeksempel (for eksempel `testdata/testeksempel-01-fasit.xlsx`).

## 4. Funksjoner

### 4.1 Opplasting og validering av Excel-malen

**Beskrivelse:** Brukeren laster opp en utfylt Excel-mal. Før noe beregnes, sjekker appen at filen følger malen og at alle verdier er gyldige. Finnes det valideringsfeil, gjøres ingen beregning, og alle feilene vises samlet, så brukeren kan rette alt på én gang. Reglene er de samme som datavalideringen og Kontroll-kolonnen i Excel-malen. Appen sjekker dem likevel selv. Malen ber brukeren om ikke å lime inn i celler med nedtrekksliste (Nivå, Type og Varenummer i Planlagte mottak), men Excel kan ikke hindre det uten makroer, og innliming fjerner både listen og valideringen i cellen. Brukeren kan også ha brukt et annet regneark som ikke håndhever valideringen. Gjelder UJ-1, UJ-2 og UJ-4.

#### FR-1: Last opp Excel-mal

Brukeren kan velge og laste opp én `.xlsx`-fil fra sin egen maskin. Gjelder UJ-1 og UJ-2.

**Konsekvenser (testbare):**
- `testdata/testeksempel-01.xlsx` lastes opp uten endringer og går videre til beregning.
- En fil som ikke er `.xlsx`, avvises med en melding om at appen bare tar imot Excel-malen.

#### FR-2: Kontroller malens struktur

Appen kontrollerer at filen har arkene Stykkliste, MPS og Planlagte mottak, med kolonneoverskriftene fra Excel-malen. Gjelder UJ-4.

**Konsekvenser (testbare):**
- Mangler et ark eller en overskrift, blir det en valideringsfeil som nevner arket og hva som mangler.
- Arkene Veiledning og Veien videre, Kontroll-kolonnen og de andre hjelpekolonnene til høyre for tabellene (lenker og skjulte lister) leses ikke inn og påvirker ikke valideringen.
- En fil laget etter den gamle malen (med arkene Produkt og Komponenter) gir en valideringsfeil om at arket Stykkliste mangler.
- Mangler et ark eller en overskrift, kontrolleres likevel de verdiene som ikke avhenger av det som mangler (FR-3), slik at alle feilene vises samlet (FR-4). Kontroller som avhenger av det som mangler, hoppes over: uten arket MPS er horisonten ukjent, så ukene i Planlagte mottak kontrolleres ikke, og uten en kolonne kontrolleres ikke verdiene i den. Slik blir det ingen følgefeil. Bestemt av Sebastian 2026-11-05.
- `testdata/validering/V-F06.xlsx` (overskriften «Ledetid (uker)» mangler og et mottak har antall 0) gir nøyaktig to valideringsfeil.

#### FR-3: Kontroller verdiene

Appen kontrollerer hver verdi etter disse reglene. Gjelder UJ-4.

| Ark | Felt | Regel |
|---|---|---|
| Stykkliste | Rader | Fra rad 2 og sammenhengende nedover, inntil 1000 rader. Minst én rad med nivå .1. |
| Stykkliste | Nivå | 0, .1 eller ..2. Første rad er 0, og ingen andre rader er 0. Nivå ..2 står rett under .1 eller ..2. |
| Stykkliste | Varenummer | Fylt ut. En del kan ikke stå under seg selv (samme varenummer som en overordnet del). |
| Stykkliste | Beskrivelse | Fylt ut. Lik for alle rader med samme varenummer. |
| Stykkliste | Antall | Tom for nivå 0. Ellers heltall ≥ 1 (antall per enhet av overordnet del). |
| Stykkliste | Type | Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv). Ferdigvare på nivå 0 og bare der. Lik for alle rader med samme varenummer. En del som kjøpes inn, har ingen rader under seg på lavere nivå. |
| Stykkliste | Underdeler | Står en del med underdeler flere steder, kan underdelene stå bare under første forekomst eller likt under hver forekomst (samme varenumre og antall, rekkefølgen spiller ingen rolle). Ulike underdeler under to forekomster er en feil. Beregningen bruker underdelene én gang (FR-28). |
| Stykkliste | Lagerbeholdning, Sikkerhetslager | Heltall ≥ 0. Fylt ut første gang varenummeret står, og tom de neste gangene. |
| Stykkliste | Ledetid (uker) | Heltall ≥ 1 (≥ 0 for nivå 0). Fylt ut første gang varenummeret står, og tom de neste gangene. |
| MPS | Antall per uke | Heltall ≥ 0. Horisonten er antall sammenhengende utfylte uker fra uke 1 og må være 8–12. Er en uke fylt ut etter et hull, er det en feil. |
| Planlagte mottak | Varenummer | Finnes i Stykkliste |
| Planlagte mottak | Uke | Heltall fra 1 til H |
| Planlagte mottak | Antall | Heltall ≥ 1 |

**Konsekvenser (testbare):**
- Hver regel i tabellen har minst ett testtilfelle som gir nøyaktig én valideringsfeil (`testdata/validering/`).
- En verdi limt inn i en celle med nedtrekksliste, for eksempel nivå «3» eller typen «Delmontering», gir en valideringsfeil selv om Excel ikke stoppet den.
- Et tomt ark for planlagte mottak er gyldig.
- En del med lagerbeholdning 0 eller sikkerhetslager 0 er gyldig.
- Et varenummer som står flere steder med samme beskrivelse og type, og med lager, sikkerhetslager og ledetid bare første gang, er gyldig.
- En del som produseres selv og står to ganger, med de samme underdelene under begge forekomstene, er gyldig, og underdelene får samme bruttobehov som om de bare sto én gang.
- Den samme delen med underdeler bare under første forekomst er gyldig og gir samme resultat.
- Står det et annet antall eller en annen underdel under andre forekomst, gir det én valideringsfeil som nevner varenummeret og begge radene.

#### FR-4: Vis alle valideringsfeil samlet

Er det minst én valideringsfeil, vises alle feilene i én liste og ingen beregning gjøres. Hver feil oppgir ark, rad eller celle, felt og årsak på norsk. Gjelder UJ-4.

**Konsekvenser (testbare):**
- En fil med tre feil på tre forskjellige ark gir én liste med tre feil.
- Ingen resultattabell vises, og forrige kjøring endres ikke, når opplastingen har valideringsfeil.

### 4.2 MRP-beregning

**Beskrivelse:** Appen beregner én MRP-tabell for hvert varenummer over hele horisonten, også for ferdigproduktet. Beregningen er standard MRP for flernivå BOM med lot-for-lot. Den gjøres nivå for nivå ovenfra og ned: planlagte ordrefrigivelser for en del, ganget med antall per enhet, blir bruttobehov for delene rett under. Reglene per del (FR-6–FR-8) er de som er bekreftet i fasiten (`testdata/testeksempel-01-fasit.xlsx`, arket Regler), med én endring fra 2026-11-02: planlagte mottak som kommer for sent, regnes som fremskyndet før nye ordrer lages (FR-6). Reglene er sjekket mot litteraturen og ERP-systemer i `.docs/planning-artifacts/research/academic-lit-mrp-regler-forfalte-ordrer-eksepsjoner-h-2026-11-02/research.md`. Gjelder UJ-2.

#### FR-5: Beregn bruttobehov

For ferdigproduktet (nivå 0) er bruttobehov(t) = prognostiserte behov(t). For de andre delene er bruttobehov(t) summen, over alle rader der varenummeret står, av planlagt ordrefrigivelse(t) for den overordnede delen × antall på raden.

**Konsekvenser (testbare):**
- Med lagerbeholdning, sikkerhetslager og ledetid 0 for ferdigproduktet er frigivelsene for ferdigproduktet lik prognostiserte behov. Da er bruttobehovet for 300-003 Hjul (antall 5) i testeksempel 01 100, 125, 150, 100, 175, 150, 125, 200, 150, 100.
- Har ferdigproduktet ledetid 1, er bruttobehovet for delene på nivå .1 forskjøvet én uke tidligere enn prognostiserte behov.
- En del på nivå ..2 får bruttobehov fra frigivelsene til delen på nivå .1 rett over, ikke fra prognostiserte behov.

#### FR-28: Beregn felles deler én gang

En del som står flere steder i stykklisten, beregnes én gang, med samlet bruttobehov fra alle overordnede deler (FR-5). Den beregnes på sin lavnivåkode, etter at alle delene den står under er beregnet. Lagerbeholdning, sikkerhetslager og ledetid hentes fra første rad med varenummeret. Planlagte mottak for varenummeret gjelder den samlede tabellen.

**Konsekvenser (testbare):**
- Skruesett M6 brukt 4 per sete og 2 per rygg får bruttobehov(t) = 4 × frigivelse sete(t) + 2 × frigivelse rygg(t), i én tabell.
- En del som står både på nivå .1 og ..2, beregnes etter alle delene på nivå .1, med behov fra begge.
- Lageret til en felles del brukes bare én gang, ikke én gang per forekomst.

#### FR-6: Beregn disponibel beholdning og nettobehov

For hver del og uke beregner appen disponibel(t) = forventet lagerbeholdning(t−1) + planlagte mottak(t) − bruttobehov(t). Forventet lagerbeholdning før uke 1 er lagerbeholdningen. Deretter beregnes nettobehov(t) = maks(0, SS − disponibel(t)).

Er nettobehov(t) > 0 og finnes det planlagte mottak for varenummeret i senere uker, regnes det første senere mottaket som fremskyndet til uke t. Hele mottaket regnes med fra uke t, og nettobehov(t) regnes på nytt. Er nettobehovet fortsatt > 0, fremskyndes neste senere mottak, og så videre. Et mottak kan fremskyndes fra hvilken som helst senere uke i horisonten. En omplanleggingshorisont som begrenser hvor langt fram et mottak kan hentes fra, er ikke med i v1 (§7.2). Bare et nettobehov som står igjen når det ikke finnes flere senere mottak, gir planlagt ordremottak (FR-7). Hvert flyttet mottak gir eksepsjonen «Mottak forsinket» (FR-12). Dette følger standardregelen i MRP om at åpne ordrer fremskyndes før nye ordrer lages. Resultattabellen viser likevel mottaket i uken det er lagt inn i Excel-malen, og forventet lagerbeholdning regnes uten mottaket til det kommer (FR-7). Slik ser brukeren hva som skjer hvis mottaket ikke blir fremskyndet. Bestemt av Sebastian 2026-11-02, bekreftet 2026-11-05.

**Konsekvenser (testbare):**
- Nettobehov for alle deler i testeksempel 01 er identisk med fasiten.
- Flere planlagte mottak for samme varenummer og uke legges sammen.
- 300-005 Gassfjær i testeksempel 01: mottaket på 100 i uke 4 dekker behovet i uke 3. Uke 3 får da ikke noe planlagt ordremottak. Planlagte mottak viser 100 i uke 4, og forventet lagerbeholdning blir 0 i uke 3 og 80 i uke 4.
- Et planlagt mottak i uke H kan fremskyndes helt til uke 1, og hele mottaket flyttes.
- Det lages aldri både et planlagt ordremottak og et flyttet mottak for det samme nettobehovet, med mindre mottaket er for lite.

#### FR-7: Beregn planlagte ordremottak og forventet lagerbeholdning

Med lot-for-lot er planlagt ordremottak(t) = nettobehov(t), og forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak (FR-6) som ikke er kommet ennå. Et forfalt planlagt ordremottak vises likevel i uke t, der behovet er, selv om det fysisk kommer tidligst i uke 1 + L. Forventet lagerbeholdning forutsetter altså at behovet dekkes i tide. Avviket vises som eksepsjon (FR-10, FR-11). Dette er en bevisst forenkling. De fleste ERP-systemene planlegger i stedet fremover fra i dag og viser mangelen i forventet lagerbeholdning (se addendum).

**Konsekvenser (testbare):**
- Forventet lagerbeholdning er aldri under SS når lot-for-lot brukes, unntatt i ukene før et mottak som må fremskyndes (FR-6, FR-12).
- Planlagte ordremottak og forventet lagerbeholdning for alle deler i testeksempel 01 er identisk med fasiten.

#### FR-8: Beregn planlagte ordrefrigivelser

Hvert planlagt ordremottak i uke t gir en planlagt ordrefrigivelse i uke t − L. Er t − L < 1, er frigivelsen forfalt og legges i uke 1 sammen med vanlige frigivelser for uke 1. Behov innenfor horisonten som skulle vært frigitt før uke 1, tas med. Frigivelser for behov etter horisonten tas ikke med. Er L = 0 (bare lov for ferdigproduktet), frigis ordren i samme uke som den mottas.

**Konsekvenser (testbare):**
- 300-003 Hjul (L = 1) i testeksempel 01 har frigivelse 175 i uke 1 (50 forfalt + 125 vanlig).
- 300-008 Trekk (L = 3) med første nettobehov i uke 4 har frigivelse i uke 1 som ikke er forfalt, og den gir ingen eksepsjon.
- Alle planlagte ordrefrigivelser i testeksempel 01 er identisk med fasiten.
- En forfalt frigivelse for en del på nivå .1 gir bruttobehov i uke 1 for delene under den.

**Funksjonsspesifikke NFR-er:**
- Beregningen er deterministisk. Samme fil gir alltid samme resultat.
- Beregningen kan testes uten opplasting og uten brukergrensesnitt (se NFR-1).

### 4.3 Eksepsjoner

**Beskrivelse:** Appen finner fem eksepsjonstyper under beregningen, for deler på alle nivåer. Hver eksepsjon har varenummer, uke (eller «–» for hele delen), type og en kort melding på norsk som forklarer hva som er galt og hva brukeren kan gjøre. En uke kan ha flere eksepsjoner. En del med minst én eksepsjon er kritisk. Definisjonene følger briefen og fasiten, med endringene fra 2026-11-02 (FR-9, FR-12, FR-29). Gjelder UJ-2.

#### FR-9: Ledetid overskrider horisont

Er ledetiden fra ferdigproduktet ≥ H, får delen eksepsjonen «Ledetid overskrider horisont» med uke «–», uansett behov. Ledetiden fra ferdigproduktet er den største summen av L langs en sti i stykklisten fra ferdigproduktet ned til og med delen. Står delen flere steder, gjelder den lengste stien. Eksepsjonen sier ikke at delen mangler, men at planen er for kort til å vise behov etter uke H som må bestilles nå. Meldingen oppgir summen og stien den kommer fra, og foreslår lengre horisont.

**Konsekvenser (testbare):**
- 300-006 Stolfot (L = 10, H = 10) under et ferdigprodukt med L = 0 i testeksempel 01 får eksepsjonen selv om nettobehovet er 0 i alle uker.
- En del med ledetid fra ferdigproduktet H − 1 får ikke eksepsjonen.
- Med H = 10, ferdigprodukt L = 1, del på nivå .1 L = 4 og del under den på nivå ..2 L = 5, får delen på nivå ..2 eksepsjonen (1 + 4 + 5 = 10), selv om ingen enkelt ledetid er ≥ H. Delen på nivå .1 (1 + 4 = 5) får den ikke.

#### FR-10: Bestilling forsinket

Har en uke t nettobehov > 0, forfalt frigivelse (t − L < 1) og disponibel(t) < 0, får uken eksepsjonen «Bestilling forsinket». Meldingen oppgir disponibel beholdning, forfalt mengde, uken frigivelsen skulle vært gjort, total frigivelse i uke 1 og tidligste mottaksuke (1 + L). Den slutter med hva som blir forsinket:
- for ferdigproduktet og delene rett under det (nivå .1): «Leveranse til kunde blir forsinket.»
- for deler lenger ned: «Produksjonen av \<overordnet del\> blir forsinket.» Står delen under flere overordnede deler, nevnes alle.

Står en felles del både rett under ferdigproduktet og lenger ned, gjelder «Leveranse til kunde blir forsinket.» Regelen ble bestemt 2026-11-02 og bekreftet 2026-11-05.

**Konsekvenser (testbare):**
- 300-003 Hjul får eksepsjonen i uke 1 med meldingen fra fasiten: «Lager blir -20 i uke 1. Bestillingen på 50 måtte vært frigitt i uke 0, før horisonten. De 50 er forfalt og tatt med i frigivelsen på 175 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket.»
- En del på nivå ..2 med eksepsjonen får en melding som slutter med «Produksjonen av» og navnet og varenummeret til delen over.

#### FR-11: Bruk av sikkerhetslager

Har en uke t nettobehov > 0, forfalt frigivelse og 0 ≤ disponibel(t) < SS, får uken eksepsjonen «Bruk av sikkerhetslager». Meldingen inneholder de samme opplysningene om forfalt mengde som i FR-10.

**Konsekvenser (testbare):**
- 300-004 Armlene får eksepsjonen i uke 1 (disponibel 10, SS 20), med 10 forfalt av frigivelsen på 60.
- En uke kan ikke få både «Bestilling forsinket» og «Bruk av sikkerhetslager».

#### FR-12: Mottak forsinket

Når et planlagt mottak regnes som fremskyndet til uke t (FR-6), får uke t eksepsjonen «Mottak forsinket». Meldingen oppgir mottaket (uke og antall), uken det må fremskyndes til, og hvor det må gjøres: hos leverandøren for deler som kjøpes inn, i egen produksjon for deler som produseres selv. Det lages ikke noe nytt bestillingsforslag for den delen av behovet mottaket dekker.

**Konsekvenser (testbare):**
- 300-005 Gassfjær får eksepsjonen i uke 3: mottaket på 100 i uke 4 må fremskyndes til uke 3. Det lages ingen frigivelse for uke 3-behovet, og mottaket står fortsatt i uke 4 i tabellen.
- 300-007 Skruesett, med mottak i uke 2 før første nettobehov i uke 3, får ingen eksepsjon.
- Er mottaket for lite til å dekke nettobehovet, får uken både denne eksepsjonen og et planlagt ordremottak for resten.

#### FR-29: Kanseller mottak

Et planlagt mottak som ikke trengs noe sted i horisonten, får eksepsjonen «Kanseller mottak» i mottaksuken. Mottaket trengs ikke hvis delen ikke får noe nettobehov fra mottaksuken til og med uke H når mottaket tas bort fra beregningen. Under denne kontrollen fremskyndes ingen andre mottak (FR-6). Ellers kunne appen rådet til å kansellere et tidlig mottak og samtidig fremskynde et senere (bestemt av Sebastian 2026-11-02). Meldingen foreslår å kansellere eller utsette mottaket. Et mottak som kommer for tidlig, men som trengs senere i horisonten, gir ingen eksepsjon. Grunnen er at det ville gitt mange eksepsjoner uten reell handling (SM-C2).

**Konsekvenser (testbare):**
- 300-007 Skruesett (mottak i uke 2, nettobehov fra uke 3) får ikke eksepsjonen.
- En del med lager over SS i hele horisonten og et planlagt mottak får eksepsjonen i mottaksuken.
- Et mottak som er regnet som fremskyndet (FR-6), kan ikke få eksepsjonen.

#### FR-13: Marker kritiske deler

En del med minst én eksepsjon markeres som kritisk, på alle nivåer.

**Konsekvenser (testbare):**
- I testeksempel 01 er nøyaktig 300-003, 300-004, 300-005 og 300-006 kritiske.
- Eksepsjonslisten for testeksempel 01 er identisk med fasiten: samme varenummer, uke, type og melding, og ingen andre.

### 4.4 Resultattabell

**Beskrivelse:** Etter en vellykket kjøring vises resultattabellen. Den skal være forståelig for en planlegger uten MRP-bakgrunn etter en kort introduksjon (SM-3). Det betyr tre ting: brukeren ser først hvor det må handles, kan lese bestillingsforslagene direkte, og kan få forklart ethvert tall. Etter en kjøring ser brukeren først bestillingsforslagene (FR-17), deretter sammendraget av kritiske deler (FR-16) og så resultattabellen. Appen kaller avvikene eksepsjoner, og forklaringene (FR-18) gjør begrepet forståelig. Gjelder UJ-1 og UJ-2.

#### FR-14: Vis MRP-tabell per del

Appen viser, for hvert varenummer, radene bruttobehov, planlagte mottak, forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte ordrefrigivelser, med én kolonne per uke i horisonten. Hver del vises med varenummer, beskrivelse, nivå og type. Ferdigproduktets navn og horisonten vises over tabellen.

**Konsekvenser (testbare):**
- Alle tall i tabellen for testeksempel 01 er identisk med fasiten.
- Tabellen har nøyaktig H ukekolonner.
- En felles del vises med én tabell, ikke én per forekomst i stykklisten.

#### FR-15: Fremhev eksepsjoner i tabellen

En celle for en uke og del med en eksepsjon fremheves, og meldingen åpnes ved klikk på cellen (FR-18). Eksepsjoner med uke «–» vises ved delens navn. Fremhevingen bruker både farge og et symbol eller en tekst, ikke farge alene.

**Konsekvenser (testbare):**
- Alle eksepsjonene i fasiten for testeksempel 01 vises på riktig del og uke.
- En uke med flere eksepsjoner viser alle meldingene.

#### FR-16: Vis sammendrag av kritiske deler

Appen viser et sammendrag over tabellen: antall kritiske deler og en liste over dem med eksepsjonstyper. Brukeren kan gå direkte fra sammendraget til delen i tabellen. Tabellen følger rekkefølgen i stykklisten. Kritiske deler markeres tydelig, men flyttes ikke øverst. Endret 2026-11-05.

**Konsekvenser (testbare):**
- For testeksempel 01 viser sammendraget 4 kritiske deler: 300-003, 300-004, 300-005 og 300-006.
- Delene i tabellen står i samme rekkefølge som i arket Stykkliste. En felles del står der den står første gang.
- Velger brukeren en del i sammendraget, vises delens tabell.

#### FR-17: Vis bestillingsforslag

Appen viser en liste over alle bestillingsforslag i kjøringen: varenummer, beskrivelse, frigivelsesuke, mengde og om forslaget er et innkjøp (Komponent (Kjøpes inn)) eller en produksjonsordre (Ferdigvare og Komponent (Produseres selv)), sortert etter uke. Forslag med forfalt mengde merkes. Brukeren kan filtrere listen på én uke og se bare forslagene som skal frigis den uken. Det er ingen egen ukevisning i tillegg til listen. Ukefilteret ble lagt til 2026-11-05.

**Konsekvenser (testbare):**
- Listen for testeksempel 01 har én linje per planlagt ordrefrigivelse > 0 i fasiten, med samme mengde og uke.
- Alle forslagene for delene på nivå .1 i testeksempel 01 er innkjøp.
- Filtrert på uke 1 viser listen for testeksempel 01 bare forslagene med frigivelsesuke 1, også de med forfalt mengde.
- Fjernes filteret, vises alle forslagene igjen.

#### FR-18: Forklar beregningen

Hver rad i MRP-tabellen har en kort forklaring på norsk av hvordan den er beregnet, med reglene fra §4.2. For hver celle kan brukeren se tallene som ga resultatet. For bruttobehov til en del under ferdigproduktet viser forklaringen hvilke overordnede deler behovet kommer fra, og antallet per enhet. Hver eksepsjonstype har en forklaring av hvorfor den slo til.

Forklaringen åpnes når brukeren klikker på raden eller cellen, og vises i et panel ved siden av tabellen. Panelet står til brukeren lukker det. Det virker med mus, tastatur og berøring. Forklaringen vises ikke ved peking (hover). Endret 2026-11-05.

**Konsekvenser (testbare):**
- For 300-003 Hjul, uke 1, kan brukeren se: forventet lagerbeholdning før uke 1 = 80, planlagte mottak = 0, bruttobehov = 100, disponibel = -20, SS = 30, nettobehov = 50.
- Alle seks radtypene og alle fem eksepsjonstypene har en forklaring.
- For en felles del viser forklaringen av bruttobehovet bidraget fra hver overordnet del.
- Forklaringen kan åpnes og lukkes med tastaturet alene.
- Å holde musepekeren over en celle uten å klikke åpner ikke forklaringen.
- Panelet står åpent til brukeren lukker det.

### 4.5 Endringer og før/etter-sammenligning

**Beskrivelse:** Når noe endres midt i planen, for eksempel prognostiserte behov, endrer brukeren Excel-filen og laster den opp på nytt. Brukeren planlegger fortløpende, ofte flere ganger i uka og for flere produkter (UJ-2). Appen husker derfor siste vellykkede kjøring for hvert ferdigprodukt i brukerens nettleser, uten innlogging, og sammenligner en ny kjøring med forrige kjøring for samme ferdigprodukt. Brukeren kan også starte på nytt uten sammenligning. Når en ny uke blir uke 1, sammenlignes det likevel med forrige kjøring. Det gjøres ingen egen håndtering av ukeskiftet (bestemt av Sebastian 2026-11-05). Gjelder UJ-3.

#### FR-19: Husk siste kjøring per ferdigprodukt i nettleseren

Etter en vellykket kjøring lagrer appen kjøringen i brukerens nettleser, slik at den finnes ved neste opplasting, også etter at nettleseren er lukket. For hvert ferdigprodukt lagres bare siste vellykkede kjøring. Ferdigproduktet kjennes igjen på varenummeret på nivå 0. Kjøringene finnes bare i nettleseren der de ble laget (NFR-4). Endret 2026-11-05 (UJ-3).

**Konsekvenser (testbare):**
- Når appen lukkes og åpnes igjen i samme nettleser, kan den siste kjøringen for et ferdigprodukt sammenlignes med en ny opplasting for det samme ferdigproduktet.
- En ny vellykket kjøring for et ferdigprodukt erstatter den lagrede kjøringen for det ferdigproduktet og endrer ikke de lagrede kjøringene for andre ferdigprodukter.
- En opplasting med valideringsfeil erstatter ingen lagret kjøring.
- Åpnes appen i en annen nettleser eller på en annen maskin, finnes ingen lagret kjøring.

#### FR-20: Vis før/etter-sammenligning

Finnes en tidligere kjøring for samme ferdigprodukt når en ny kjøring er ferdig, viser appen en før/etter-sammenligning. Den viser:
- bestillingsforslag som er nye, endret i mengde eller uke, eller fjernet
- eksepsjoner som er nye eller borte
- deler som er nye eller fjernet

Endringer i resultattabellen som ikke påvirker bestillingsforslag eller eksepsjoner, vises ikke. Finnes ingen tidligere kjøring for ferdigproduktet, vises ingen sammenligning. Gjelder UJ-3.

**Konsekvenser (testbare):**
- Lastes samme fil opp to ganger, vises «ingen endringer».
- Lastes testeksempel 02 og så 03 opp (prognostiserte behov i uke 2 økt fra 30 til 45), eller 03 og så 02, viser sammenligningen nøyaktig linjene i arket Sammenligning i `testdata/testeksempel-03-fasit.xlsx`.
- Et bestillingsforslag er identifisert av varenummer og frigivelsesuke. Samme varenummer og uke med ny mengde er «endret mengde». Flytter et forslag uke, vises det som fjernet i den gamle uken og nytt i den nye. En eksepsjon er identifisert av varenummer, uke og type, og en endret melding alene er ingen endring. Bestemt av Sebastian 2026-11-05.
- En endring i forventet lagerbeholdning som ikke endrer noe bestillingsforslag eller noen eksepsjon, vises ikke.
- Er en del lagt til i eller fjernet fra stykklisten, vises den som en egen linje i sammenligningen.
- Lastes en fil for ferdigprodukt X opp, så en for ferdigprodukt Y og så en ny for X, sammenlignes den siste kjøringen med den første. Kjøringen for Y vises uten sammenligning.

#### FR-21: Start på nytt uten sammenligning

Brukeren kan slette den lagrede kjøringen for et ferdigprodukt. Neste opplasting for det ferdigproduktet vises da uten sammenligning. Gjelder UJ-3.

**Konsekvenser (testbare):**
- Etter sletting vises ingen før/etter-sammenligning ved neste opplasting for det ferdigproduktet.
- Sletting for ett ferdigprodukt endrer ikke de lagrede kjøringene for andre ferdigprodukter.

### 4.6 Eksport av resultater

**Beskrivelse:** Brukeren kan lagre resultatet av en kjøring som en fil, slik at hun kan ta vare på planen selv, dele den eller bruke den senere uten appen. Dette dekker også behovet for å ta vare på flere kjøringer, siden appen bare husker den siste for hvert ferdigprodukt. Gjelder UJ-2.

#### FR-22: Eksporter kjøring til fil

Brukeren kan laste ned resultatet av den viste kjøringen som en Excel-fil (`.xlsx`), siden brukeren allerede arbeider i Excel. Filen inneholder resultattabellen per del og uke, listen over bestillingsforslag, eksepsjonslisten med meldinger, og ferdigproduktets navn, horisont og tidspunkt for kjøringen.

**Konsekvenser (testbare):**
- Tallene i den eksporterte filen for testeksempel 01 er identisk med fasiten.
- Den eksporterte filen kan åpnes i Excel uten feil.
- Filnavnet inneholder ferdigproduktets navn og dato.

#### FR-23: Eksporter før/etter-sammenligning

Når en før/etter-sammenligning vises, tas den med i eksporten som et eget ark «Sammenligning», bygd opp som arket Sammenligning i `testdata/testeksempel-03-fasit.xlsx`.

**Konsekvenser (testbare):**
- Eksporten etter at testeksempel 02 og så 03 er lastet opp, har et ark Sammenligning med de samme linjene som arket Sammenligning i fasit 03.
- Eksporten av en kjøring uten sammenligning har ikke arket Sammenligning.

### 4.7 Fast partistørrelse (planlagt utvidelse)

**Beskrivelse:** Når kjernen (§4.1–4.6) er ferdig og testet mot fasit, legges fast partistørrelse til som valgbar bestillingsregel per del. Excel-malen får en valgfri kolonne «Partistørrelse» i arket Stykkliste, som fylles ut første gang varenummeret står, slik som lager, sikkerhetslager og ledetid. Er cellen tom, brukes lot-for-lot. Planlagt ordremottak rundes opp til et helt antall partier, og overskuddet føres videre i forventet lagerbeholdning. Planlegges som eget, senere epic, slik faglærer anbefaler. Testeksempelet med fast partistørrelse og fasit (FR-25) lages når utvidelsen starter.

#### FR-24: Les partistørrelse

Appen leser den valgfrie kolonnen «Partistørrelse». Verdien er tom eller et heltall ≥ 1. En fil uten kolonnen er gyldig og gir lot-for-lot for alle deler.

**Konsekvenser (testbare):**
- `testdata/testeksempel-01.xlsx` gir samme resultat før og etter at utvidelsen er laget.

#### FR-25: Beregn med fast partistørrelse

For en del med partistørrelse Q er planlagt ordremottak(t) = ⌈nettobehov(t) / Q⌉ × Q når nettobehov(t) > 0. Forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t), og overskuddet reduserer nettobehovet i senere uker.

**Konsekvenser (testbare):**
- Et nytt testeksempel med minst to deler med fast partistørrelse gir 100 % samsvar med en manuelt kontrollert fasit.
- Planlagt ordremottak er alltid et multiplum av Q.

#### FR-26: Vis bestillingsregel

Resultattabellen og eksporten viser hvilken bestillingsregel som er brukt for hver del, og partistørrelsen når den finnes. Forklaringen (FR-18) for planlagte ordremottak beskriver avrundingen.

**Konsekvenser (testbare):**
- En del med Q = 50 viser «Fast partistørrelse: 50».

### 4.8 Veiledning i appen

**Beskrivelse:** En ny bruker skal komme i gang uten hjelp fra utviklerne. Gjelder UJ-1.

#### FR-27: Last ned Excel-malen og testeksempelet

Fra appens startside kan brukeren laste ned den tomme Excel-malen og testeksempel 01, og lese en kort veiledning: fyll ut malen, last opp, les tabellen.

**Konsekvenser (testbare):**
- Malen som lastes ned, er identisk med `testdata/COSI-MRP-mal.xlsx`.

## 5. Tverrgående ikke-funksjonelle krav

- **NFR-1 Beregning skilt fra resten:** Beregningen (§4.2–4.3) kan kjøres og testes alene, uten Excel-lesing, lagring eller brukergrensesnitt. Det gjør automatiske tester mot fasiten mulig og følger faglærers råd.
- **NFR-2 Automatiske tester mot fasit:** Hvert testeksempel i `testdata/` har automatiske tester som sammenligner resultattabell og eksepsjoner med fasiten. Testene kjøres med én kommando som er beskrevet i README.
- **NFR-3 Kjørbar for sensor:** Appen kan startes lokalt etter README, uten nøkler, betalte kontoer eller tjenester som gruppen driver. Excel-malen og testeksemplene ligger i repoet. I tillegg er appen publisert på Vercel (NFR-4).
- **NFR-4 Data blir i brukerens nettleser:** Appen publiseres på Vercel, som bare leverer appens kode. Innlesing, validering, beregning og lagring av kjøringer skjer i brukerens nettleser. Opplastede filer og kjøringer sendes ikke til serveren eller til tredjepartstjenester. Derfor finnes lagrede kjøringer bare i nettleseren der de ble laget (FR-19). Valg av rammeverk avgjøres i arkitekturen. Endret 2026-11-05.
- **NFR-5 Ytelse:** Målet er at en kjøring med 1000 rader i stykklisten, tre nivåer og 12 uker, fra opplasting til resultattabell, tar under 3 sekunder på en vanlig bærbar PC. Det måles tidlig i utviklingen med en testfil på 1000 rader laget med `testdata/lag_testdata.py`. Holder ikke målet, endres kravet med begrunnelse.
- **NFR-6 Plattform:** Webapp for PC i nyere versjoner av Chrome, Edge og Firefox. Ikke tilpasset mobil i v1.
- **NFR-7 Språk:** All tekst i appen, også valideringsfeil og eksepsjonsmeldinger, er på norsk i v1. Tekstene samles slik at engelsk kan legges til senere uten å endre beregningen.
- **NFR-8 Lesbarhet:** Eksepsjoner og kritiske deler markeres ikke med farge alene (se FR-15). Når tabellen er bredere enn skjermen, står kolonnene med varenummer, beskrivelse og radnavn fast mens brukeren scroller sideveis. Endret 2026-11-05.

## 6. Ikke-mål

- COSI - MRP er ikke et ERP-system. Det dekker ikke produksjon, økonomi, kundeordrer eller selve innkjøpet hos leverandør.
- Appen sender ikke bestillinger. Den foreslår dem, og brukeren handler.
- Appen bruker ikke KI eller språkmodeller.
- Appen erstatter ikke Excel-malen som inndata i v1. Data skrives ikke inn i appen.
- Appen har ingen brukerkontoer og lagrer ikke data på en server.

## 7. MVP-omfang

**Frist:** Alt skal være ferdig og levert 15. desember 2026 kl. 15:00.

### 7.1 Med i v1

- Opplasting og validering av Excel-malen (FR-1–FR-4)
- MRP-beregning for flernivå BOM (inntil tre nivåer, med felles deler) og ett ferdigprodukt med lot-for-lot (FR-5–FR-8, FR-28)
- Fem eksepsjonstyper og kritiske deler (FR-9–FR-13, FR-29)
- Resultattabell med fremheving, sammendrag, bestillingsforslag med ukefilter og forklaringer (FR-14–FR-18)
- Lagring av siste kjøring per ferdigprodukt i nettleseren og før/etter-sammenligning (FR-19–FR-21)
- Eksport til Excel (FR-22–FR-23)
- Veiledning og nedlasting av mal (FR-27)
- **Planlagt utvidelse når kjernen er testet:** fast partistørrelse (FR-24–FR-26)

### 7.2 Ikke med i v1

- **Mer enn tre nivåer i stykklisten** – videreutvikling.
- **Flere ferdigprodukter samtidig** – videreutvikling.
- **Andre bestillingsregler** (f.eks. beregnet optimal bestillingsmengde) – videreutvikling.
- **Omplanleggingshorisont** (grense for hvor langt fram et planlagt mottak kan fremskyndes fra, FR-6) – mulig utvidelse.
- **Inntasting i appen** som alternativ til Excel – videreutvikling.
- **Innlogging, brukerkontoer og lagring av flere kjøringer per ferdigprodukt** – videreutvikling. Eksport dekker behovet i v1.
- **Flere bedrifter med adskilte data** – videreutvikling.
- **Engelsk** – neste språk. Deretter flere språk på lengre sikt.
- **Mobiltilpasning** – ikke planlagt.
- **Testing hos reelle bedrifter** – utenfor kurset (se Vision i briefen).

## 8. Suksessmål

**Primære**
- **SM-1 Korrekt beregning:** 100 % samsvar mellom resultattabellen og fasiten for alle testeksempler i `testdata/`, for hver uke, del og rad. Minst ett testeksempel har 5–10 deler fordelt på 3 nivåer og minst én felles del. Gjelder FR-5–FR-8, FR-14, FR-28.
- **SM-2 Pålitelige eksepsjoner:** For hver av de fem eksepsjonstypene utløses riktig eksepsjon i hvert kjent avvikstilfelle, uten falske eller manglende eksepsjoner. Gjelder FR-9–FR-13, FR-29.
- **SM-3 Forståelig uten forkunnskap:** Etter en kort introduksjon finner og forklarer 3 av 3 testpersoner en kritisk del, bestillingsmengde og bestillingsuke uten hjelp fra utviklerne. Gjelder FR-15–FR-18.

**Sekundære**
- **SM-4 Inndata kontrolleres:** Hver valideringsregel i FR-3 har en test der en fil med nøyaktig den feilen gir nøyaktig én valideringsfeil med riktig ark, rad og årsak. Gjelder FR-2–FR-4.
- **SM-5 Endringer håndteres:** En komplett kjøring over 8–12 uker med 5–10 deler fordelt på 3 nivåer og minst én endring midtveis (f.eks. endrede prognostiserte behov) gir en før/etter-sammenligning som viser nøyaktig de endrede bestillingsforslagene og eksepsjonene. Gjelder FR-19–FR-21.
- **SM-6 Kjørbar for sensor:** En person utenfor gruppen kan starte appen etter README og kjøre testeksempel 01 uten hjelp. Gjelder NFR-3.

**Mot-mål (skal ikke optimaliseres)**
- **SM-C1 Antall funksjoner:** Flere funksjoner er ikke et mål i seg selv. Fast partistørrelse startes først når SM-1 og SM-2 er nådd. Balanserer SM-1.
- **SM-C2 Antall eksepsjoner:** Flere eksepsjoner gir ikke bedre planlegging. Hver eksepsjon skal kreve handling, ellers lærer brukeren seg å overse dem. Balanserer SM-2.
- **SM-C3 Visuell fremheving:** Tabellen skal ikke fylles med farger og symboler for å se informativ ut. Det skal være raskt å finne det som krever handling. Balanserer SM-3.

## 9. Åpne spørsmål

Spørsmålene beholder nummeret sitt, så andre dokumenter kan vise til dem. Beslutningene fra 2026-11-05 står i `beslutninger-2026-11-05.md`.

### 9.1 Åpne

4. Hvem er testpersonene til brukertesten (SM-3), og hvordan ser den korte introduksjonen ut? Ikke bestemt per 2026-11-05.

### 9.2 Lukket

1. Bekrefte eller endre antagelsene i §10. **Løst 2026-11-05:** alle er bekreftet eller endret (§10).
2. Testeksempel med endrede prognostiserte behov for før/etter-sammenligningen (FR-20, SM-5). **Løst 2026-11-05:** testeksempel 03 med fasit og arket Sammenligning.
3. Testeksempel med fast partistørrelse (FR-25). **Flyttet 2026-11-05** til utvidelsen (§4.7). Lages når utvidelsen starter.
5. Egen ukeoversikt over bestillingsforslag. **Løst 2026-11-05:** ukefilter på listen over bestillingsforslag (FR-17), ingen egen visning.
6. Frist. **Løst 2026-11-05:** 15. desember 2026 kl. 15:00 (§7).
7. Testeksempel med 5–10 deler på 3 nivåer og felles del (FR-5, FR-28, SM-1). **Løst 2026-11-05:** testeksempel 02 (Kontorstol Pro, 8 deler på 3 nivåer, felles del 300-002) med fasit.
8. Meldingen i «Bestilling forsinket» for 300-003 Hjul. **Løst 2026-11-05:** regelen fra 2026-11-02 gjelder (FR-10). Hjul står rett under ferdigproduktet og får «Leveranse til kunde blir forsinket». Fasit 01 følger regelen.
9. Fasit for 300-005 Gassfjær etter FR-6/FR-12. **Løst 2026-11-02:** `beregn()` og fasiten er oppdatert.
10. Oppdatere briefen med de nye eksepsjonsreglene. **Løst 2026-11-05:** briefen er frosset, og en merknad øverst sier at PRD-en gjelder ved avvik.
11. Testtilfeller for FR-9 (ledetid fra ferdigproduktet) og FR-29. **Løst 2026-11-05:** testeksempel 02 har et mottak som ikke trengs (300-005 i uke 5), og testeksempel 04 har tilfellet for FR-9 (300-022, 1 + 4 + 7 = 12 = H).

## 10. Antagelser

Ingen antagelser er igjen. Alle antagelsene fra utkastet ble besluttet 2026-11-05 og står nå som krav:

| Krav | Beslutning |
|---|---|
| FR-6 Fremskynding fra hvilken som helst senere uke | Bekreftet. Omplanleggingshorisont er en mulig utvidelse (§7.2). |
| FR-16 Kritiske deler øverst | Endret. Tabellen følger stykklisten, og sammendraget leder til de kritiske delene. |
| FR-18 Forklaring ved peking eller klikk | Endret. Klikk, panel ved siden av tabellen, mus, tastatur og berøring, ikke peking. |
| FR-20 Endringer uten betydning vises ikke | Bekreftet. |
| FR-20 Nye og fjernede deler | Bekreftet. Tillegget om at et annet ferdigprodukt bare gir en melding, ble erstattet samme dag av lagring per ferdigprodukt (FR-19) ved gjennomgangen av UJ-3. |
| FR-22 Eksportformat | Bekreftet: `.xlsx`. |
| FR-23 Sammenligning i eksporten | Bekreftet: eget ark «Sammenligning». |
| NFR-4 Data sendes ikke ut | Endret. Vercel, alt skjer i nettleseren. |
| NFR-5 Under 3 sekunder | Bekreftet som mål, måles tidlig. |
| NFR-8 Ingen sidescroll på 1366 px | Del 1 bekreftet. Del 2 endret til faste kolonner ved sidescroll. |
