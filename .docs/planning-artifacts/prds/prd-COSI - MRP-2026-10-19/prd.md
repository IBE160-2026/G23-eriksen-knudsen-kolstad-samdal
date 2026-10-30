---
title: COSI - MRP PRD
status: draft
created: 2026-10-19
updated: 2026-10-26
---

# PRD: COSI - MRP

## 0. Dokumentets formål

Denne PRD-en beskriver hva første versjon av COSI - MRP skal gjøre. Den er skrevet for gruppen G23 i IBE160, for sensor og for de neste stegene i BMAD (arkitektur, epics og stories). Den bygger på product brief (`.docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/brief.md`), faglærers tilbakemelding (`tilbakemelding-product-brief.md` i samme mappe) og testdataene i `testdata/`. Den gjentar ikke innholdet i dem.

Begrepene i §3 Ordliste brukes likt i hele dokumentet. Funksjonene står i §4, med funksjonskrav (FR-1 til FR-28) under hver funksjon. Kravene har faste nummer, så epics, stories og tester kan vise til dem. Antagelser er merket `[ASSUMPTION]` der de står og samlet i §10. Tekniske valg og bakgrunn står i `addendum.md` i denne mappen.

**Status:** Utkast laget på rask vei 2026-10-19. Alt som var tilgjengelig da, regnes som bestemt. Gruppen går gjennom utkastet på et felles møte og kan endre det.

**Oppdatert 2026-10-26:** Flernivå BOM er med i v1, slik briefen sier fra 2026-10-22. Excel-malen er bygd om: arkene Produkt og Komponenter er erstattet av arket Stykkliste, arket med ukebehov heter MPS, og «innkjøpstid» heter nå «ledetid».

## 1. Visjon

I små produksjonsbedrifter er MRP-planleggingen ofte et Excel-ark som bare én person forstår. Logikken for ledetid, sikkerhetslager og bestillinger ligger skjult i formler. Er personen borte, stopper planleggingen, eller den gjøres feil.

COSI - MRP er en nettbasert app som legger hele MRP-prosessen inn i verktøyet. Planleggeren fyller ut en fast Excel-mal og laster den opp. Appen sjekker dataene, beregner nettobehov og bestillingsforslag for hver uke og komponent, og varsler om avvik. Alt vises i én oversiktlig tabell. Hver tall har en forklaring av hvordan det er regnet ut, så en ny planlegger kan forstå planen uten å kunne formlene.

Første versjon dekker ett ferdigprodukt med flernivå BOM (stykkliste) på inntil tre nivåer. Behovet brytes ned nivå for nivå, fra ferdigproduktet via hovedkomponentene til delene de bygges av. Målet er at prosessen er korrekt, kan etterprøves og er lett å forstå. Bredden kommer senere: flere produkter, flere språk og flere bedrifter.

## 2. Målbruker

### 2.1 Jobs To Be Done

- **Funksjonelt:** Lage ukens bestillingsplan for komponentene raskt og uten regnefeil.
- **Funksjonelt:** Se med en gang hvilke komponenter som krever handling, og hva som må gjøres.
- **Funksjonelt:** Se konsekvensene når prognosen endres, uten å regne alt på nytt for hånd.
- **Kontekst:** Kunne overta planleggingen etter en kollega uten å måtte lære seg kollegaens regneark.
- **Emosjonelt:** Stole på tallene og kunne forklare dem for leder eller leverandør.

### 2.2 Ikke-brukere (v1)

- Bedrifter med flere ferdigprodukter som skal planlegges samlet, eller stykklister med mer enn tre nivåer.
- Brukere som trenger et fullt ERP-system med produksjon, økonomi og ordrehåndtering.
- Flere brukere som skal samarbeide om samme plan samtidig.

### 2.3 Viktige brukerreiser

- **UJ-1. Kari lager ukens bestillingsplan.**
  Kari er innkjøper i en liten møbelprodusent og har overtatt planleggingen etter en kollega som har sluttet. Mandag morgen fyller hun ut Excel-malen med ukens MPS, lagerbeholdning og planlagte mottak. Stykklisten for stolen ligger allerede i filen fra forrige uke. Hun åpner COSI - MRP i nettleseren og laster opp filen. Appen sjekker filen og viser resultattabellen. Øverst ser hun at to komponenter er merket kritiske. Hun klikker på den røde cellen for hjul i uke 1 og leser: «Lager blir -20 i uke 1. Bestillingen på 50 måtte vært frigitt i uke 0 …». Hun bestiller hjul samme dag, ringer leverandøren av gassfjær for å få mottaket fremskyndet, og eksporterer resultatet til Excel for å ha det lagret. **Unntak:** Hvis hun lurer på hvorfor nettobehovet er 50, åpner hun forklaringen på raden og ser hvordan det er regnet.

- **UJ-2. Kari ser hva en endret prognose betyr.**
  Onsdag får Kari beskjed om at salget venter 15 flere stoler i uke 5. Hun endrer MPS i Excel-filen og laster den opp på nytt. Appen husker mandagens kjøring og viser en før/etter-sammenligning. Hun ser hvilke bestillingsforslag som er nye, endret eller fjernet, og at det er kommet et nytt varsel for armlene. Hun justerer bestillingen uten å regne noe selv. **Unntak:** Hvis hun vil starte helt på nytt med et annet datasett, velger hun å se bort fra forrige kjøring, og da vises ingen sammenligning.

- **UJ-3. Kari retter feil i filen.**
  Kari laster opp en fil der hun har glemt sikkerhetslageret for én komponent og skrevet «ca. 40» i et antall. Appen gjør ingen beregning. Den viser en samlet liste: «Stykkliste, rad 5, Sikkerhetslager: mangler verdi» og «Planlagte mottak, rad 3, Antall: må være et heltall». Hun retter begge feilene i Excel, laster opp filen igjen og kommer videre til resultattabellen (UJ-1).

## 3. Ordliste

- **Excel-mal** – Den faste filen `COSI-MRP-mal.xlsx` som brukeren fyller ut og laster opp. Ark: Veiledning, Stykkliste, MPS, Planlagte mottak, Veien videre.
- **BOM (stykkliste)** – Ferdigproduktet og alle delene det består av, én rad per del ovenfra og ned, i arket Stykkliste. Kolonner: Nivå, Varenummer, Beskrivelse, Antall, Type, Lagerbeholdning, Sikkerhetslager og Ledetid (uker). Inntil 1000 rader.
- **Nivå** – Hvor i stykklisten en del står: 0 (ferdigproduktet), .1 (hovedkomponentene) eller ..2 (delene som trengs for å bygge hovedkomponenten rett over). Første rad er alltid 0, og det finnes bare én rad med nivå 0. Nivå ..2 står rett under en .1 eller en annen ..2.
- **Overordnet del** – Delen en rad hører til: nærmeste rad over med ett nivå høyere. For nivå .1 er det ferdigproduktet.
- **Varenummer** – Delens identitet. Samme varenummer betyr samme del. Malen foreslår varegruppe-løpenummer (100-xxx ferdigvare, 200-xxx produseres selv, 300-xxx kjøpes inn), men appen krever ikke et bestemt format.
- **Ferdigprodukt** – Det ene produktet planen gjelder for, på nivå 0 med type Ferdigvare.
- **Komponent** – En del på nivå .1 eller ..2. Har varenummer, beskrivelse, antall per enhet av overordnet del, type, lagerbeholdning, sikkerhetslager og ledetid.
- **Type** – Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv). Ferdigvare brukes bare på nivå 0. En del som kjøpes inn, kan ikke ha underkomponenter.
- **Felles del** – En del som står flere steder i stykklisten, for eksempel skruer som brukes både i setet og i ryggen. Den har samme varenummer, beskrivelse og type hver gang. Lagerbeholdning, sikkerhetslager og ledetid står bare første gang.
- **Lavnivåkode** – Det laveste nivået (største nivåtall) en del står på i stykklisten. En felles del beregnes én gang, på sin lavnivåkode, etter at alle overordnede deler er beregnet.
- **MPS (hovedplan)** – Antall ferdigprodukter som trengs per uke. Arket heter «MPS» i Excel-malen.
- **Horisont (H)** – Antall uker som er fylt ut sammenhengende fra uke 1 i MPS. Gyldig mellom 8 og 12.
- **Uke (t)** – Én periode i horisonten, nummerert 1 til H.
- **Lagerbeholdning** – Antall på lager før uke 1.
- **Sikkerhetslager (SS)** – Den laveste lagerbeholdningen planen skal holde.
- **Ledetid (L)** – Antall uker fra en ordre frigis til den mottas: innkjøpstid for deler som kjøpes inn, produksjonstid for deler som produseres selv. Minst 1 for komponenter. 0 er lov for ferdigproduktet.
- **Planlagt mottak** – Et innkjøp som allerede er bestilt, eller en produksjonsordre som allerede er startet, og som kommer i en bestemt uke. Oppgis i Excel-malen.
- **Bruttobehov** – Behovet for en del i en uke. For ferdigproduktet er det MPS. For en komponent er det summen av planlagte ordrefrigivelser for hver overordnet del × antall per enhet.
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
- **Eksepsjon** – Et varsel om avvik for en del, enten i en bestemt uke eller for hele delen. Det er fire eksepsjonstyper (§4.3).
- **Kritisk komponent** – En del med minst én eksepsjon. Gjelder alle nivåer, også ferdigproduktet.
- **Kjøring** – Én beregning fra én opplastet Excel-mal. Gir én resultattabell.
- **Resultattabell** – Visningen av en kjøring: radene bruttobehov, planlagte mottak, forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte ordrefrigivelser, per uke og del, med eksepsjonene markert.
- **Kontroll-kolonnen** – Hjelpekolonnen til høyre i arket Stykkliste i Excel-malen. Den viser hva som mangler eller ikke stemmer i hver rad, mens brukeren fyller ut. Appen leser den ikke inn.
- **Før/etter-sammenligning** – Visningen av forskjellene i bestillingsforslag og eksepsjoner mellom forrige kjøring og den nye.
- **Valideringsfeil** – En feil i den opplastede filen som hindrer beregningen. Har ark, rad eller celle og årsak.
- **Fasit** – Den manuelt kontrollerte forventede resultattabellen og eksepsjonslisten for et testeksempel (`testdata/testeksempel-01-fasit.xlsx`).

## 4. Funksjoner

### 4.1 Opplasting og validering av Excel-malen

**Beskrivelse:** Brukeren laster opp en utfylt Excel-mal. Før noe beregnes, sjekker appen at filen følger malen og at alle verdier er gyldige. Finnes det valideringsfeil, gjøres ingen beregning, og alle feilene vises samlet, så brukeren kan rette alt på én gang. Reglene er de samme som datavalideringen og Kontroll-kolonnen i Excel-malen. Appen sjekker dem likevel selv. Malen ber brukeren om ikke å lime inn i celler med nedtrekksliste (Nivå, Type og Varenummer i Planlagte mottak), men Excel kan ikke hindre det uten makroer, og innliming fjerner både listen og valideringen i cellen. Brukeren kan også ha brukt et annet regneark som ikke håndhever valideringen. Gjelder UJ-1 og UJ-3.

#### FR-1: Last opp Excel-mal

Brukeren kan velge og laste opp én `.xlsx`-fil fra sin egen maskin. Gjelder UJ-1.

**Konsekvenser (testbare):**
- `testdata/testeksempel-01.xlsx` lastes opp uten endringer og går videre til beregning.
- En fil som ikke er `.xlsx`, avvises med en melding om at appen bare tar imot Excel-malen.

#### FR-2: Kontroller malens struktur

Appen kontrollerer at filen har arkene Stykkliste, MPS og Planlagte mottak, med kolonneoverskriftene fra Excel-malen. Gjelder UJ-3.

**Konsekvenser (testbare):**
- Mangler et ark eller en overskrift, blir det en valideringsfeil som nevner arket og hva som mangler.
- Arkene Veiledning og Veien videre, Kontroll-kolonnen og de andre hjelpekolonnene til høyre for tabellene (lenker og skjulte lister) leses ikke inn og påvirker ikke valideringen.
- En fil laget etter den gamle malen (med arkene Produkt og Komponenter) gir en valideringsfeil om at arket Stykkliste mangler.

#### FR-3: Kontroller verdiene

Appen kontrollerer hver verdi etter disse reglene. Gjelder UJ-3.

| Ark | Felt | Regel |
|---|---|---|
| Stykkliste | Rader | Fra rad 2 og sammenhengende nedover, inntil 1000 rader. Minst én rad med nivå .1. |
| Stykkliste | Nivå | 0, .1 eller ..2. Første rad er 0, og ingen andre rader er 0. Nivå ..2 står rett under .1 eller ..2. |
| Stykkliste | Varenummer | Fylt ut. En del kan ikke stå under seg selv (samme varenummer som en overordnet del). |
| Stykkliste | Beskrivelse | Fylt ut. Lik for alle rader med samme varenummer. |
| Stykkliste | Antall | Tom for nivå 0. Ellers heltall ≥ 1 (antall per enhet av overordnet del). |
| Stykkliste | Type | Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv). Ferdigvare på nivå 0 og bare der. Lik for alle rader med samme varenummer. En del som kjøpes inn, har ingen rader under seg på lavere nivå. |
| Stykkliste | Lagerbeholdning, Sikkerhetslager | Heltall ≥ 0. Fylt ut første gang varenummeret står, og tom de neste gangene. |
| Stykkliste | Ledetid (uker) | Heltall ≥ 1 (≥ 0 for nivå 0). Fylt ut første gang varenummeret står, og tom de neste gangene. |
| MPS | Antall per uke | Heltall ≥ 0. Horisonten er antall sammenhengende utfylte uker fra uke 1 og må være 8–12. Er en uke fylt ut etter et hull, er det en feil. |
| Planlagte mottak | Varenummer | Finnes i Stykkliste |
| Planlagte mottak | Uke | Heltall fra 1 til H |
| Planlagte mottak | Antall | Heltall ≥ 1 |

**Konsekvenser (testbare):**
- Hver regel i tabellen har minst ett testtilfelle som gir nøyaktig én valideringsfeil.
- En verdi limt inn i en celle med nedtrekksliste, for eksempel nivå «3» eller typen «Delmontering», gir en valideringsfeil selv om Excel ikke stoppet den.
- Et tomt ark for planlagte mottak er gyldig.
- En del med lagerbeholdning 0 eller sikkerhetslager 0 er gyldig.
- Et varenummer som står flere steder med samme beskrivelse og type, og med lager, sikkerhetslager og ledetid bare første gang, er gyldig.

#### FR-4: Vis alle valideringsfeil samlet

Er det minst én valideringsfeil, vises alle feilene i én liste og ingen beregning gjøres. Hver feil oppgir ark, rad eller celle, felt og årsak på norsk. Gjelder UJ-3.

**Konsekvenser (testbare):**
- En fil med tre feil på tre forskjellige ark gir én liste med tre feil.
- Ingen resultattabell vises, og forrige kjøring endres ikke, når opplastingen har valideringsfeil.

### 4.2 MRP-beregning

**Beskrivelse:** Appen beregner én MRP-tabell for hvert varenummer over hele horisonten, også for ferdigproduktet. Beregningen er standard MRP for flernivå BOM med lot-for-lot. Den gjøres nivå for nivå ovenfra og ned: planlagte ordrefrigivelser for en del, ganget med antall per enhet, blir bruttobehov for delene rett under. Reglene per del (FR-6–FR-8) er de som er bekreftet i fasiten (`testdata/testeksempel-01-fasit.xlsx`, arket Regler). Gjelder UJ-1.

#### FR-5: Beregn bruttobehov

For ferdigproduktet (nivå 0) er bruttobehov(t) = MPS(t). For en komponent er bruttobehov(t) summen, over alle rader der varenummeret står, av planlagt ordrefrigivelse(t) for den overordnede delen × antall på raden.

**Konsekvenser (testbare):**
- Med lagerbeholdning, sikkerhetslager og ledetid 0 for ferdigproduktet er frigivelsene for ferdigproduktet lik MPS. Da er bruttobehovet for 300-003 Hjul (antall 5) i testeksempel 01 100, 125, 150, 100, 175, 150, 125, 200, 150, 100.
- Har ferdigproduktet ledetid 1, er bruttobehovet for delene på nivå .1 forskjøvet én uke tidligere enn MPS.
- En del på nivå ..2 får bruttobehov fra frigivelsene til delen på nivå .1 rett over, ikke fra MPS.

#### FR-28: Beregn felles deler én gang

En del som står flere steder i stykklisten, beregnes én gang, med samlet bruttobehov fra alle overordnede deler (FR-5). Den beregnes på sin lavnivåkode, etter at alle delene den står under er beregnet. Lagerbeholdning, sikkerhetslager og ledetid hentes fra første rad med varenummeret. Planlagte mottak for varenummeret gjelder den samlede tabellen.

**Konsekvenser (testbare):**
- Skruesett M6 brukt 4 per sete og 2 per rygg får bruttobehov(t) = 4 × frigivelse sete(t) + 2 × frigivelse rygg(t), i én tabell.
- En del som står både på nivå .1 og ..2, beregnes etter alle delene på nivå .1, med behov fra begge.
- Lageret til en felles del brukes bare én gang, ikke én gang per forekomst.

#### FR-6: Beregn disponibel beholdning og nettobehov

For hver del og uke beregner appen disponibel(t) = forventet lagerbeholdning(t−1) + planlagte mottak(t) − bruttobehov(t). Forventet lagerbeholdning før uke 1 er lagerbeholdningen. Deretter beregnes nettobehov(t) = maks(0, SS − disponibel(t)).

**Konsekvenser (testbare):**
- Nettobehov for alle komponenter i testeksempel 01 er identisk med fasiten.
- Flere planlagte mottak for samme varenummer og uke legges sammen.

#### FR-7: Beregn planlagte ordremottak og forventet lagerbeholdning

Med lot-for-lot er planlagt ordremottak(t) = nettobehov(t), og forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t). Et forfalt planlagt ordremottak vises likevel i uke t, der behovet er, selv om det fysisk kommer tidligst i uke 1 + L. Forventet lagerbeholdning forutsetter altså at behovet dekkes i tide. Avviket vises som eksepsjon (FR-10, FR-11).

**Konsekvenser (testbare):**
- Forventet lagerbeholdning er aldri under SS når lot-for-lot brukes.
- Planlagte ordremottak og forventet lagerbeholdning for alle komponenter i testeksempel 01 er identisk med fasiten.

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

**Beskrivelse:** Appen finner fire eksepsjonstyper under beregningen, for deler på alle nivåer. Hver eksepsjon har varenummer, uke (eller «–» for hele delen), type og en kort melding på norsk som forklarer hva som er galt og hva brukeren kan gjøre. En uke kan ha flere eksepsjoner. En del med minst én eksepsjon er kritisk. Definisjonene følger briefen og fasiten. Gjelder UJ-1.

#### FR-9: Ledetid overskrider horisont

Er L ≥ H, får delen eksepsjonen «Ledetid overskrider horisont» med uke «–», uansett behov.

**Konsekvenser (testbare):**
- 300-006 Stolfot (L = 10, H = 10) i testeksempel 01 får eksepsjonen selv om nettobehovet er 0 i alle uker.
- En del med L = H − 1 får ikke eksepsjonen.

#### FR-10: Bestilling forsinket

Har en uke t nettobehov > 0, forfalt frigivelse (t − L < 1) og disponibel(t) < 0, får uken eksepsjonen «Bestilling forsinket». Meldingen oppgir disponibel beholdning, forfalt mengde, uken frigivelsen skulle vært gjort, total frigivelse i uke 1 og tidligste mottaksuke (1 + L). Den sier også hva som blir forsinket: leveransen til kunde for ferdigproduktet, eller produksjonen av den overordnede delen for en komponent.

**Konsekvenser (testbare):**
- 300-003 Hjul får eksepsjonen i uke 1 med meldingen fra fasiten: «Lager blir -20 i uke 1. Bestillingen på 50 måtte vært frigitt i uke 0, før horisonten. De 50 er forfalt og tatt med i frigivelsen på 175 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket.»

#### FR-11: Bruk av sikkerhetslager

Har en uke t nettobehov > 0, forfalt frigivelse og 0 ≤ disponibel(t) < SS, får uken eksepsjonen «Bruk av sikkerhetslager». Meldingen inneholder de samme opplysningene om forfalt mengde som i FR-10.

**Konsekvenser (testbare):**
- 300-004 Armlene får eksepsjonen i uke 1 (disponibel 10, SS 20), med 10 forfalt av frigivelsen på 60.
- En uke kan ikke få både «Bestilling forsinket» og «Bruk av sikkerhetslager».

#### FR-12: Mottak forsinket

Har en uke t nettobehov > 0, og finnes det et planlagt mottak for varenummeret i en senere uke, får uken eksepsjonen «Mottak forsinket». Meldingen viser til det første senere mottaket og foreslår å fremskynde det: hos leverandøren for deler som kjøpes inn, i egen produksjon for deler som produseres selv.

**Konsekvenser (testbare):**
- 300-005 Gassfjær får eksepsjonen i uke 3, med henvisning til mottaket i uke 4.
- 300-007 Skruesett, med mottak i uke 2 før første nettobehov i uke 3, får ingen eksepsjon.

#### FR-13: Marker kritiske komponenter

En del med minst én eksepsjon markeres som kritisk, på alle nivåer.

**Konsekvenser (testbare):**
- I testeksempel 01 er nøyaktig 300-003, 300-004, 300-005 og 300-006 kritiske.
- Eksepsjonslisten for testeksempel 01 er identisk med fasiten: samme varenummer, uke, type og melding, og ingen andre.

### 4.4 Resultattabell

**Beskrivelse:** Etter en vellykket kjøring vises resultattabellen. Den skal være forståelig for en planlegger uten MRP-bakgrunn etter en kort introduksjon (SM-3). Det betyr tre ting: brukeren ser først hvor det må handles, kan lese bestillingsforslagene direkte, og kan få forklart ethvert tall. Gjelder UJ-1.

#### FR-14: Vis MRP-tabell per komponent

Appen viser, for hvert varenummer, radene bruttobehov, planlagte mottak, forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte ordrefrigivelser, med én kolonne per uke i horisonten. Hver del vises med varenummer, beskrivelse, nivå og type. Ferdigproduktets navn og horisonten vises over tabellen.

**Konsekvenser (testbare):**
- Alle tall i tabellen for testeksempel 01 er identisk med fasiten.
- Tabellen har nøyaktig H ukekolonner.
- En felles del vises med én tabell, ikke én per forekomst i stykklisten.

#### FR-15: Fremhev eksepsjoner i tabellen

En celle for en uke og komponent med en eksepsjon fremheves, og meldingen kan leses rett fra cellen. Eksepsjoner med uke «–» vises ved komponentnavnet. Fremhevingen bruker både farge og et symbol eller en tekst, ikke farge alene.

**Konsekvenser (testbare):**
- Alle eksepsjonene i fasiten for testeksempel 01 vises på riktig komponent og uke.
- En uke med flere eksepsjoner viser alle meldingene.

#### FR-16: Vis kritiske komponenter først

Appen viser et sammendrag over tabellen: antall kritiske komponenter og en liste over dem med eksepsjonstyper. Kritiske komponenter merkes tydelig i tabellen, og brukeren kan gå direkte fra sammendraget til komponenten. `[ASSUMPTION: kritiske komponenter står øverst i tabellen, og resten følger rekkefølgen i stykklisten.]`

**Konsekvenser (testbare):**
- For testeksempel 01 viser sammendraget 4 kritiske komponenter: 300-003, 300-004, 300-005 og 300-006.

#### FR-17: Vis bestillingsforslag

Appen viser en liste over alle bestillingsforslag i kjøringen: varenummer, beskrivelse, frigivelsesuke, mengde og om forslaget er et innkjøp (Komponent (Kjøpes inn)) eller en produksjonsordre (Ferdigvare og Komponent (Produseres selv)), sortert etter uke. Forslag med forfalt mengde merkes.

**Konsekvenser (testbare):**
- Listen for testeksempel 01 har én linje per planlagt ordrefrigivelse > 0 i fasiten, med samme mengde og uke.
- Alle forslagene for komponentene i testeksempel 01 er innkjøp.

#### FR-18: Forklar beregningen

Hver rad i MRP-tabellen har en kort forklaring på norsk av hvordan den er beregnet, med reglene fra §4.2. For hver celle kan brukeren se tallene som ga resultatet. For bruttobehov til en komponent viser forklaringen hvilke overordnede deler behovet kommer fra, og antallet per enhet. Hver eksepsjonstype har en forklaring av hvorfor den slo til. `[ASSUMPTION: forklaringen vises når brukeren peker på eller klikker på raden eller cellen, ikke som fast tekst.]`

**Konsekvenser (testbare):**
- For 300-003 Hjul, uke 1, kan brukeren se: forventet lagerbeholdning før uke 1 = 80, planlagte mottak = 0, bruttobehov = 100, disponibel = -20, SS = 30, nettobehov = 50.
- Alle seks radtypene og alle fire eksepsjonstypene har en forklaring.
- For en felles del viser forklaringen av bruttobehovet bidraget fra hver overordnet del.

### 4.5 Endringer og før/etter-sammenligning

**Beskrivelse:** Når noe endres midt i planen, for eksempel MPS, endrer brukeren Excel-filen og laster den opp på nytt. Appen husker siste vellykkede kjøring lokalt på brukerens maskin, uten innlogging, og sammenligner den nye kjøringen med den. Brukeren kan også starte på nytt uten sammenligning. Gjelder UJ-2.

#### FR-19: Husk siste kjøring lokalt

Etter en vellykket kjøring lagrer appen kjøringen lokalt på brukerens maskin, slik at den finnes ved neste opplasting, også etter at nettleseren er lukket. Bare siste vellykkede kjøring lagres.

**Konsekvenser (testbare):**
- Når appen lukkes og åpnes igjen, kan den siste kjøringen sammenlignes med en ny opplasting.
- En opplasting med valideringsfeil erstatter ikke den lagrede kjøringen.

#### FR-20: Vis før/etter-sammenligning

Finnes en tidligere kjøring når en ny kjøring er ferdig, viser appen en før/etter-sammenligning. Den viser:
- bestillingsforslag som er nye, endret i mengde eller uke, eller fjernet
- eksepsjoner som er nye eller borte

Gjelder UJ-2.

**Konsekvenser (testbare):**
- Lastes samme fil opp to ganger, vises «ingen endringer».
- Øker MPS for én uke i testeksempel 01, viser sammenligningen nøyaktig de bestillingsforslagene og eksepsjonene som er ulike mellom de to fasitene. Krever et eget testeksempel med fasit (se §9 Åpne spørsmål, nr. 2).
- Endringer i resultattabellen som ikke påvirker bestillingsforslag eller eksepsjoner, vises ikke som endringer. `[ASSUMPTION]`

#### FR-21: Start på nytt uten sammenligning

Brukeren kan slette den lagrede kjøringen. Neste opplasting vises da uten sammenligning. Gjelder UJ-2.

**Konsekvenser (testbare):**
- Etter sletting vises ingen før/etter-sammenligning ved neste opplasting.

**Notater:**
- Har den nye filen et annet ferdigprodukt eller andre varenumre enn forrige kjøring, viser sammenligningen nye og fjernede deler som egne linjer. `[ASSUMPTION]`

### 4.6 Eksport av resultater

**Beskrivelse:** Brukeren kan lagre resultatet av en kjøring som en fil, slik at hun kan ta vare på planen selv, dele den eller bruke den senere uten appen. Dette dekker også behovet for å ta vare på flere kjøringer, siden appen bare husker den siste. Gjelder UJ-1.

#### FR-22: Eksporter kjøring til fil

Brukeren kan laste ned resultatet av den viste kjøringen som en Excel-fil (`.xlsx`). Filen inneholder resultattabellen per del og uke, listen over bestillingsforslag, eksepsjonslisten med meldinger, og ferdigproduktets navn, horisont og tidspunkt for kjøringen. `[ASSUMPTION: formatet er .xlsx, siden brukeren allerede arbeider i Excel.]`

**Konsekvenser (testbare):**
- Tallene i den eksporterte filen for testeksempel 01 er identisk med fasiten.
- Den eksporterte filen kan åpnes i Excel uten feil.
- Filnavnet inneholder ferdigproduktets navn og dato.

#### FR-23: Eksporter før/etter-sammenligning

Når en før/etter-sammenligning vises, tas den med i eksporten. `[ASSUMPTION]`

**Konsekvenser (testbare):**
- Eksporten etter en ny opplasting med endringer inneholder en del med de samme endringene som vises i appen.

### 4.7 Fast partistørrelse (planlagt utvidelse)

**Beskrivelse:** Når kjernen (§4.1–4.6) er ferdig og testet mot fasit, legges fast partistørrelse til som valgbar bestillingsregel per del. Excel-malen får en valgfri kolonne «Partistørrelse» i arket Stykkliste, som fylles ut første gang varenummeret står, slik som lager, sikkerhetslager og ledetid. Er cellen tom, brukes lot-for-lot. Planlagt ordremottak rundes opp til et helt antall partier, og overskuddet føres videre i forventet lagerbeholdning. Planlegges som eget, senere epic, slik faglærer anbefaler.

#### FR-24: Les partistørrelse

Appen leser den valgfrie kolonnen «Partistørrelse». Verdien er tom eller et heltall ≥ 1. En fil uten kolonnen er gyldig og gir lot-for-lot for alle deler.

**Konsekvenser (testbare):**
- `testdata/testeksempel-01.xlsx` gir samme resultat før og etter at utvidelsen er laget.

#### FR-25: Beregn med fast partistørrelse

For en komponent med partistørrelse Q er planlagt ordremottak(t) = ⌈nettobehov(t) / Q⌉ × Q når nettobehov(t) > 0. Forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t), og overskuddet reduserer nettobehovet i senere uker.

**Konsekvenser (testbare):**
- Et nytt testeksempel med minst to komponenter med fast partistørrelse gir 100 % samsvar med en manuelt kontrollert fasit.
- Planlagt ordremottak er alltid et multiplum av Q.

#### FR-26: Vis bestillingsregel

Resultattabellen og eksporten viser hvilken bestillingsregel som er brukt for hver komponent, og partistørrelsen når den finnes. Forklaringen (FR-18) for planlagte ordremottak beskriver avrundingen.

**Konsekvenser (testbare):**
- En komponent med Q = 50 viser «Fast partistørrelse: 50».

### 4.8 Veiledning i appen

**Beskrivelse:** En ny bruker skal komme i gang uten hjelp fra utviklerne. Gjelder UJ-1.

#### FR-27: Last ned Excel-malen og testeksempelet

Fra appens startside kan brukeren laste ned den tomme Excel-malen og testeksempel 01, og lese en kort veiledning: fyll ut malen, last opp, les tabellen.

**Konsekvenser (testbare):**
- Malen som lastes ned, er identisk med `testdata/COSI-MRP-mal.xlsx`.

## 5. Tverrgående ikke-funksjonelle krav

- **NFR-1 Beregning skilt fra resten:** Beregningen (§4.2–4.3) kan kjøres og testes alene, uten Excel-lesing, lagring eller brukergrensesnitt. Det gjør automatiske tester mot fasiten mulig og følger faglærers råd.
- **NFR-2 Automatiske tester mot fasit:** Hvert testeksempel i `testdata/` har automatiske tester som sammenligner resultattabell og eksepsjoner med fasiten. Testene kjøres med én kommando som er beskrevet i README.
- **NFR-3 Kjørbar for sensor:** Appen kan startes lokalt etter README, uten nøkler, betalte kontoer eller tjenester som gruppen driver. Excel-malen og testeksemplene ligger i repoet.
- **NFR-4 Data blir på brukerens maskin:** Opplastede filer og lagrede kjøringer sendes ikke til eksterne tjenester. `[ASSUMPTION]`
- **NFR-5 Ytelse:** En kjøring med 1000 rader i stykklisten, tre nivåer og 12 uker, fra opplasting til resultattabell, tar under 3 sekunder på en vanlig bærbar PC. `[ASSUMPTION: grensen er satt av gruppen og ikke målt ennå.]`
- **NFR-6 Plattform:** Webapp for PC i nyere versjoner av Chrome, Edge og Firefox. Ikke tilpasset mobil i v1.
- **NFR-7 Språk:** All tekst i appen, også valideringsfeil og eksepsjonsmeldinger, er på norsk i v1. Tekstene samles slik at engelsk kan legges til senere uten å endre beregningen.
- **NFR-8 Lesbarhet:** Eksepsjoner og kritiske komponenter markeres ikke med farge alene (se FR-15). Tabellen kan leses uten å scrolle sideveis på en 1366 piksler bred skjerm når horisonten er 12 uker. `[ASSUMPTION]`

## 6. Ikke-mål

- COSI - MRP er ikke et ERP-system. Det dekker ikke produksjon, økonomi, kundeordrer eller selve innkjøpet hos leverandør.
- Appen sender ikke bestillinger. Den foreslår dem, og brukeren handler.
- Appen bruker ikke KI eller språkmodeller.
- Appen erstatter ikke Excel-malen som inndata i v1. Data skrives ikke inn i appen.
- Appen har ingen brukerkontoer og lagrer ikke data på en server.

## 7. MVP-omfang

### 7.1 Med i v1

- Opplasting og validering av Excel-malen (FR-1–FR-4)
- MRP-beregning for flernivå BOM (inntil tre nivåer, med felles deler) og ett ferdigprodukt med lot-for-lot (FR-5–FR-8, FR-28)
- Fire eksepsjonstyper og kritiske komponenter (FR-9–FR-13)
- Resultattabell med fremheving, sammendrag, bestillingsforslag og forklaringer (FR-14–FR-18)
- Lokal lagring av siste kjøring og før/etter-sammenligning (FR-19–FR-21)
- Eksport til Excel (FR-22–FR-23)
- Veiledning og nedlasting av mal (FR-27)
- **Planlagt utvidelse når kjernen er testet:** fast partistørrelse (FR-24–FR-26)

### 7.2 Ikke med i v1

- **Mer enn tre nivåer i stykklisten** – videreutvikling.
- **Flere ferdigprodukter samtidig** – videreutvikling.
- **Andre bestillingsregler** (f.eks. beregnet optimal bestillingsmengde) – videreutvikling.
- **Inntasting i appen** som alternativ til Excel – videreutvikling.
- **Innlogging, brukerkontoer og lagring av flere kjøringer** – videreutvikling. Eksport dekker behovet i v1.
- **Flere bedrifter med adskilte data** – videreutvikling.
- **Engelsk** – neste språk. Deretter flere språk på lengre sikt.
- **Mobiltilpasning** – ikke planlagt.
- **Testing hos reelle bedrifter** – utenfor kurset (se Vision i briefen).

## 8. Suksessmål

**Primære**
- **SM-1 Korrekt beregning:** 100 % samsvar mellom resultattabellen og fasiten for alle testeksempler i `testdata/`, for hver uke, del og rad. Minst ett testeksempel har 5–10 komponenter fordelt på 3 nivåer og minst én felles del. Gjelder FR-5–FR-8, FR-14, FR-28.
- **SM-2 Pålitelige eksepsjoner:** For hver av de fire eksepsjonstypene utløses riktig eksepsjon i hvert kjent avvikstilfelle, uten falske eller manglende eksepsjoner. Gjelder FR-9–FR-13.
- **SM-3 Forståelig uten forkunnskap:** Etter en kort introduksjon finner og forklarer 3 av 3 testpersoner en kritisk komponent, bestillingsmengde og bestillingsuke uten hjelp fra utviklerne. Gjelder FR-15–FR-18.

**Sekundære**
- **SM-4 Inndata kontrolleres:** Hver valideringsregel i FR-3 har en test der en fil med nøyaktig den feilen gir nøyaktig én valideringsfeil med riktig ark, rad og årsak. Gjelder FR-2–FR-4.
- **SM-5 Endringer håndteres:** En komplett kjøring over 8–12 uker med 5–10 komponenter fordelt på 3 nivåer og minst én endring midtveis (f.eks. endret MPS) gir en før/etter-sammenligning som viser nøyaktig de endrede bestillingsforslagene og eksepsjonene. Gjelder FR-19–FR-21.
- **SM-6 Kjørbar for sensor:** En person utenfor gruppen kan starte appen etter README og kjøre testeksempel 01 uten hjelp. Gjelder NFR-3.

**Mot-mål (skal ikke optimaliseres)**
- **SM-C1 Antall funksjoner:** Flere funksjoner er ikke et mål i seg selv. Fast partistørrelse startes først når SM-1 og SM-2 er nådd. Balanserer SM-1.
- **SM-C2 Antall eksepsjoner:** Flere varsler gir ikke bedre planlegging. Hver eksepsjon skal kreve handling, ellers lærer brukeren seg å overse dem. Balanserer SM-2.
- **SM-C3 Visuell fremheving:** Tabellen skal ikke fylles med farger og symboler for å se informativ ut. Det skal være raskt å finne det som krever handling. Balanserer SM-3.

## 9. Åpne spørsmål

1. Skal gruppemøtet bekrefte eller endre antagelsene i §10? Det gjelder særlig eksportformat, sortering og hvordan forklaringene vises.
2. Det trengs et testeksempel 02 med endret MPS og egen fasit for å teste før/etter-sammenligningen (FR-20, SM-5). Hvem lager det, og når?
3. Det trengs et testeksempel med fast partistørrelse og egen fasit (FR-25). Dette lages når utvidelsen starter.
4. Hvem er testpersonene til brukertesten (SM-3), og hvordan ser den korte introduksjonen ut?
5. Skal appen også vise en ukeoversikt per uke (alle bestillingsforslag i en uke), i tillegg til listen sortert etter uke (FR-17)?
6. Hvilken frist gjelder? Den er ikke kommunisert ennå, men ventes midt i desember 2026.
7. Det trengs et testeksempel med 5–10 komponenter fordelt på 3 nivåer, minst én felles del og egen fasit (FR-5, FR-28, SM-1). Testeksempel 01 har bare nivå 0 og .1. Det kan være det samme som testeksempel 02 i spørsmål 2. **Svar (2026-10-26):** Testeksempelet lages i løpet av noen dager.
8. Fasitmeldingen for «Bestilling forsinket» i testeksempel 01 sier «Leveranse til kunde blir forsinket» for 300-003 Hjul, som er en komponent på nivå .1. Etter FR-10 og briefen skal den si at produksjonen av ferdigproduktet blir forsinket. Skal fasiten endres? **Svar (2026-10-26):** Ordnes når de nye testeksemplene lages.

## 10. Antagelser

- §4.4 FR-16 – Kritiske komponenter står øverst i tabellen. Resten følger rekkefølgen i stykklisten.
- §4.4 FR-18 – Forklaringen vises når brukeren peker på eller klikker på raden eller cellen.
- §4.5 FR-20 – Endringer som ikke påvirker bestillingsforslag eller eksepsjoner, vises ikke som endringer.
- §4.5 Notater – Nye og fjernede komponenter vises som egne linjer i sammenligningen.
- §4.6 FR-22 – Eksportformatet er `.xlsx`.
- §4.6 FR-23 – Før/etter-sammenligningen tas med i eksporten.
- §5 NFR-4 – Data sendes ikke til eksterne tjenester.
- §5 NFR-5 – Grensen på 3 sekunder for 1000 rader og 12 uker.
- §5 NFR-8 – Tabellen kan leses uten å scrolle sideveis på en 1366 piksler bred skjerm.
