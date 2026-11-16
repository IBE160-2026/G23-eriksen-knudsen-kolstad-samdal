---
title: COSI - MRP PRD
status: final
created: 2026-10-19
updated: 2026-11-13
---

# PRD: COSI - MRP

## 0. Dokumentets formål

Denne PRD-en beskriver hva første versjon av COSI - MRP skal gjøre. Den er skrevet for gruppen G23 i IBE160, for sensor og for de neste stegene i BMAD (UX, arkitektur, epics og stories). Den bygger på product brief (`.docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/brief.md`), faglærers tilbakemelding (`tilbakemelding-product-brief.md` i samme mappe) og testdataene i `testdata/`, og gjentar ikke innholdet i dem. Innhold i briefen som PRD-en verken gjentar eller endrer, for eksempel problemet, posisjoneringen og visjonen, gjelder fortsatt. Briefen er frosset. Ved avvik gjelder PRD-en.

Begrepene i §3 Ordliste brukes likt i hele dokumentet og følger ordbanken (`.docs/ordbank.md`). Funksjonene står i §4, med funksjonskrav (FR-1 til FR-34) under hver funksjon. Kravene har faste nummer, så epics, stories og tester kan vise til dem. Begrunnelser, tekniske innspill, endringshistorikk og lukkede spørsmål står i `addendum.md` i denne mappen. Beslutningene fra 2026-11-05 står i `beslutninger-2026-11-05.md`, beslutningene fra gruppemøtet står i `beslutninger-2026-11-09.md`, og beslutningene etter faglærers tilbakemelding (`tilbakemelding-prd.md`) står i `beslutninger-2026-11-13.md`.

**Status:** Ferdig. Gjennomgått av gruppen, og beslutningene fra gruppemøtet og etter faglærers tilbakemelding er ført inn. Åpent spørsmål: §9 nr. 4 (introduksjonen til brukertesten), som ikke hindrer UX, arkitektur eller epics.

## 1. Visjon

I små produksjonsbedrifter er MRP-planleggingen ofte et Excel-ark som bare én person forstår. Logikken for ledetid, sikkerhetslager og bestillinger ligger skjult i formler. Er personen borte, stopper planleggingen, eller den gjøres feil.

COSI - MRP er en nettbasert app som legger hele MRP-prosessen inn i verktøyet. Planleggeren fyller ut en fast Excel-mal og laster den opp. Appen sjekker dataene, beregner nettobehov og bestillingsforslag for hver uke og del, og viser eksepsjoner der planen ikke går opp. Den viser også hvor mange ferdigprodukter lageret og de planlagte mottakene rekker til, og når de kan være ferdige. Alt vises i én oversiktlig tabell. Hvert tall har en forklaring av hvordan det er regnet ut, så en ny planlegger kan forstå planen uten å kunne formlene.

Første versjon dekker ett ferdigprodukt med flernivå BOM (stykkliste) på inntil tre nivåer. Behovet brytes ned nivå for nivå, fra ferdigproduktet via hovedkomponentene til delene de bygges av. Målet er at prosessen er korrekt, kan etterprøves og er lett å forstå. Bredden kommer senere: flere produkter, flere språk og flere bedrifter.

## 2. Målbruker

### 2.1 Jobs To Be Done

- **Funksjonelt:** Lage ukens bestillingsplan for delene raskt og uten regnefeil.
- **Funksjonelt:** Se med en gang hvilke deler som krever handling, og hva som må gjøres.
- **Funksjonelt:** Se konsekvensene når prognostiserte behov endres, uten å regne alt på nytt for hånd.
- **Funksjonelt:** Se hvor mange ferdigprodukter delene på lager og i bestilling rekker til, når de kan være ferdige, og hvilken del som begrenser.
- **Kontekst:** Kunne overta planleggingen etter en kollega uten å måtte lære seg kollegaens regneark.
- **Emosjonelt:** Stole på tallene og kunne forklare dem for leder eller leverandør.

### 2.2 Ikke-brukere (v1)

- Bedrifter med flere ferdigprodukter som skal planlegges samlet, eller stykklister med mer enn tre nivåer.
- Brukere som trenger et fullt ERP-system med produksjon, økonomi og ordrehåndtering.
- Flere brukere som skal samarbeide om samme plan samtidig.

### 2.3 Viktige brukerreiser

- **UJ-1. Kari tar i bruk COSI - MRP første gang.**
  Kari er innkjøper i en liten møbelprodusent og har nettopp overtatt planleggingen etter en kollega som brukte sitt eget regneark. Hun åpner COSI - MRP og leser den korte veiledningen på startsiden. For å se hvordan et resultat ser ut, laster hun opp testeksempel 01 uten endringer og klikker på noen celler for å lese forklaringene. Så laster hun ned den tomme malen og fyller ut stykklisten for stolen med tall fra kollegaens regneark. Kontroll-kolonnen viser at ledetiden mangler på én rad, og hun retter det. Hun fyller ut prognostiserte behov og planlagte mottak og laster opp filen. Det finnes ingen tidligere kjøring for stolen, så appen viser bestillingsforslagene, de kritiske delene og tabellen uten sammenligning.

- **UJ-2. Kari oppdaterer planen og ser hva hun må bestille.**
  Kundene sender bestillinger og endrede behov alle dager, også i helgene, så Kari oppdaterer planen hver arbeidsdag. Hun har én fil per produkt og kopierer forrige ukes fil i stedet for å begynne på nytt. Noen deler, som skruesett, brukes i flere av stolene, og lageret for dem fordeler hun selv mellom filene. Hun endrer prognostiserte behov, lagerbeholdning og planlagte mottak og laster opp filen. Først ser hun på bestillingsforslagene. Når hun filtrerer på uke 1, ser hun at hun må bestille 175 hjul, og at 50 av dem er forfalte. Sammendraget viser fire kritiske deler. Hun velger gassfjær og ser at mottaket på 100 i uke 4 må fremskyndes til uke 3. Hun bestiller hjulene, ringer leverandøren av gassfjær og eksporterer resultatet til Excel. **Unntak:** Lurer hun på hvorfor nettobehovet for hjul er 50 i uke 1, klikker hun på cellen og leser forklaringen i panelet.

- **UJ-3. Kari ser hva en ny kundeordre betyr.**
  Tirsdag ettermiddag bestiller en kunde 15 flere Kontorstol Pro i uke 2. Kari endrer prognostiserte behov i uke 2 fra 30 til 45 og laster opp filen på nytt. Appen sammenligner med morgenens kjøring for Kontorstol Pro. Kari bruker sammenligningen til å kontrollere at endringen ga det hun ventet, og til å se etter nye problemer. Flere forslag i uke 1 har økt, blant annet hjul fra 130 til 205. Det er kommet et nytt forslag på 30 skruesett M6, og hjul har fått eksepsjonen «Bruk av sikkerhetslager». Mottaket på 40 rygger må nå fremskyndes til uke 2 i stedet for uke 3. Hun justerer bestillingene uten å regne selv. **Unntak:** Vil hun starte på nytt for et produkt, sletter hun den lagrede kjøringen for det, og neste opplasting vises uten sammenligning.

- **UJ-4. Kari retter feil etter å ha kopiert filen.**
  Mandag morgen rykker planen én uke fram. Kari kopierer forrige ukes fil, flytter ukene i prognostiserte behov og planlagte mottak ett hakk og legger inn et nytt mottak som leverandøren har lovet. Stykklisten er uendret, så Kontroll-kolonnen viser ingen feil. Hun laster opp filen. Appen gjør ingen beregning, men viser alle feilene samlet:
  - «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten.» Mottaket av hjul kom forrige uke, og etter flyttingen står det i uke 0.
  - «MPS, uke 11, Antall ferdigprodukter: uke 10 er tom, så uke 11 kan ikke fylles ut.» Hun la den nye uka én kolonne for langt ut.
  - «Planlagte mottak, rad 5, Antall: må være et heltall.» Hun skrev «ca. 40» fordi mengden ikke er bekreftet.

  Den lagrede kjøringen for stolen er urørt. Hun sletter mottaket som er kommet, legger det inn på lagerbeholdningen, flytter den nye uka, skriver 40 og laster opp filen igjen.

- **UJ-5. Kari svarer på en hasteforespørsel.**
  En kunde spør om de kan få 35 Kontorstol Kompakt i uke 5. Kari laster opp filen for stolen og velger bare produksjonskapasitet, fordi hun ikke skal endre planen ennå. Panelet viser to rader. Fra lager kan 30 stoler være ferdige i uke 5. Med planlagte mottak er det også 30 i uke 5, men 35 fra uke 7. Begrensende del i uke 5 er ryggplate, med årsaken «for lite på lager og i planlagte mottak». I tabellen under ser hun at mottaket på 30 ryggplater står i uke 5, og at ryggplatene trengs før stolene kan settes sammen. Hun ringer leverandøren og spør om mottaket kan komme i uke 3, og hun svarer kunden at 30 stoler kan leveres i uke 5 og resten i uke 7. Den lagrede kjøringen for stolen er urørt. **Unntak:** Vil hun se kapasiteten og bestillingsplanen samtidig, velger hun begge, og kapasiteten vises i et eget panel på samme side som bestillingsplanen.

## 3. Ordliste

Ordlisten definerer begrepene. Reglene for dem står i kravene det vises til.

- **Excel-mal** – Den faste filen `COSI-MRP-mal.xlsx` som brukeren fyller ut og laster opp. Ark: Veiledning, Stykkliste, MPS, Planlagte mottak, Veien videre.
- **BOM (stykkliste)** – Ferdigproduktet og alle delene det består av, én rad per del ovenfra og ned, i arket Stykkliste (FR-3).
- **Del** – Én rad i stykklisten, uansett nivå og type.
- **Komponent** – Brukes alene bare i typenavnene Komponent (Kjøpes inn) og Komponent (Produseres selv). «Hovedkomponent» brukes om delene på nivå .1.
- **Nivå** – Hvor i stykklisten en del står: 0 (ferdigproduktet), .1 (hovedkomponentene) eller ..2 (delene under en hovedkomponent) (FR-3).
- **Overordnet del** – Nærmeste rad over som står ett nivå nærmere ferdigproduktet, for eksempel .1 over ..2. For nivå .1 er det ferdigproduktet.
- **Underdel** – En del som står rett under en annen del i stykklisten.
- **Varenummer** – Delens identitet. Samme varenummer betyr samme del. Malen foreslår 100-xxx for ferdigvare, 200-xxx for deler som produseres selv og 300-xxx for deler som kjøpes inn, men appen krever ikke et bestemt format.
- **Ferdigprodukt** – Delen på nivå 0, med type Ferdigvare. Ett per fil.
- **Type** – Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv) (FR-3).
- **Felles del** – En del som står flere steder i stykklisten, for eksempel skruer i både sete og rygg (FR-3, FR-28).
- **Lavnivåkode** – Det laveste nivået (største nivåtall) en del står på i stykklisten (FR-28).
- **Prognostiserte behov (MPS)** – Antall ferdigprodukter som trengs per uke. Fylles ut i arket MPS.
- **Horisont (H)** – Antall uker med prognostiserte behov, fylt ut sammenhengende fra uke 1 (FR-3).
- **Uke (t)** – Én periode i horisonten, nummerert 1 til H.
- **Lagerbeholdning** – Antall på lager før uke 1.
- **Sikkerhetslager (SS)** – Den laveste forventede lagerbeholdningen planen skal holde.
- **Ledetid (L)** – Antall uker fra en ordre frigis til den mottas: innkjøpstid for deler som kjøpes inn, produksjonstid for deler som produseres selv (FR-3).
- **Ledetid fra ferdigproduktet** – Den største summen av ledetider langs en sti fra ferdigproduktet ned til og med delen (FR-9).
- **Planlagt mottak** – Et innkjøp som allerede er bestilt, eller en produksjonsordre som allerede er startet, med uke og antall. Oppgis i Excel-malen.
- **Fremskyndet mottak** – Et planlagt mottak som beregningen regner med fra en tidligere uke enn det er lagt inn i, fordi det trengs da (FR-6).
- **Bruttobehov** – Behovet for en del i en uke (FR-5).
- **Disponibel beholdning** – Beholdningen i en uke før planlagt ordremottak (FR-6).
- **Nettobehov** – Det som mangler for å holde sikkerhetslageret (FR-6).
- **Bestillingsregel** – Regelen som gjør nettobehov om til planlagt ordremottak: lot-for-lot i v1, fast partistørrelse som utvidelse.
- **Lot-for-lot** – Planlagt ordremottak er lik nettobehovet (FR-7).
- **Fast partistørrelse** – Planlagt ordremottak rundes opp til et helt antall partier av en fast størrelse (FR-25).
- **Planlagt ordremottak** – Mengden en ny, foreslått ordre skal levere i en uke (FR-7).
- **Planlagt ordrefrigivelse** – Uken en foreslått ordre må frigis i, og mengden den gjelder (FR-8).
- **Forfalt frigivelse** – En planlagt ordrefrigivelse som skulle vært gjort før uke 1 (FR-8).
- **Forventet lagerbeholdning** – Lagerbeholdningen resultattabellen viser for en uke (FR-7).
- **Bestillingsforslag** – En planlagt ordrefrigivelse med del, uke og mengde. Det er dette brukeren handler på: et innkjøp eller en produksjonsordre (FR-17).
- **Eksepsjon** – En melding om avvik for en del, i en bestemt uke eller for hele delen. Det er fem typer (§4.3). Begrepet brukes også i appen.
- **Kritisk del** – En del med minst én eksepsjon, uansett nivå (FR-13).
- **Kjøring** – Én beregning fra én opplastet Excel-mal.
- **Resultattabell** – Visningen av en kjøring per del og uke, med eksepsjonene markert (FR-14).
- **Kontroll-kolonnen** – Hjelpekolonnen i arket Stykkliste som viser hva som mangler eller ikke stemmer i hver rad, mens brukeren fyller ut. Appen leser den ikke inn.
- **Før/etter-sammenligning** – Forskjellene i bestillingsforslag og eksepsjoner mellom forrige kjøring for samme ferdigprodukt og den nye (FR-20).
- **Valideringsfeil** – En feil i den opplastede filen som hindrer beregningen (FR-4).
- **Produksjonskapasitet** – Hvor mange hele ferdigprodukter som kan være ferdige innen en uke, ut fra ledig beholdning, planlagte mottak og ledetid, uavhengig av prognostiserte behov (FR-31).
- **Ledig beholdning** – Lagerbeholdning minus sikkerhetslager, men aldri under 0. Brukes bare i produksjonskapasiteten (FR-31). Ikke det samme som disponibel beholdning.
- **Begrensende del** – En del som ikke kan dekkes når behovet er ett ferdigprodukt mer enn produksjonskapasiteten i en uke, enten fordi lageret ikke strekker til, eller på grunn av ledetiden (FR-33).
- **Fasit** – Den manuelt kontrollerte forventede resultattabellen og eksepsjonslisten for et testeksempel (for eksempel `testdata/testeksempel-01-fasit.xlsx`).

## 4. Funksjoner

**Oversikt.** FR-numrene er faste, så noen krav som kom til senere, står ved funksjonen de hører til, og ikke i tallrekkefølge (FR-28 under §4.2, FR-29 under §4.3). Trinn viser byggerekkefølgen i §7.1. Trinn 1–3 er minstekravet for innlevering, og trinn 4–5 kuttes først.

| Avsnitt | Funksjon | FR | Trinn (§7.1) |
|---|---|---|---|
| §4.1 | Opplasting og validering av Excel-malen | FR-1–FR-4 | 1 |
| §4.2 | MRP-beregning | FR-5, FR-28, FR-6–FR-8 | 1 |
| §4.3 | Eksepsjoner | FR-9–FR-12, FR-29, FR-13 | 1 |
| §4.4 | Resultattabell | FR-14–FR-17 (1), FR-18 (2) | 1–2 |
| §4.5 | Endringer og før/etter-sammenligning | FR-19–FR-21 | 3 |
| §4.6 | Eksport av resultater | FR-22–FR-23 | 3 |
| §4.7 | Fast partistørrelse | FR-24–FR-26 | 5, kuttes først |
| §4.8 | Veiledning i appen | FR-27 | 1 |
| §4.9 | Produksjonskapasitet fra lager | FR-30–FR-34 | 4, kuttes først |

### 4.1 Opplasting og validering av Excel-malen

**Beskrivelse:** Brukeren laster opp en utfylt Excel-mal. Før noe beregnes, sjekker appen at filen følger malen og at alle verdier er gyldige. Finnes det valideringsfeil, gjøres ingen beregning, og alle feilene vises samlet, så brukeren kan rette alt på én gang. Reglene er de samme som i datavalideringen og Kontroll-kolonnen i malen, men appen sjekker dem selv, fordi innliming og andre regneark kan omgå valideringen i Excel (se addendum). Gjelder UJ-1, UJ-2 og UJ-4.

#### FR-1: Last opp Excel-mal

Brukeren kan velge og laste opp én `.xlsx`-fil fra sin egen maskin. Gjelder UJ-1 og UJ-2.

**Konsekvenser (testbare):**
- `testdata/testeksempel-01.xlsx` lastes opp uten endringer og går videre til beregning.
- En fil som ikke er `.xlsx`, avvises med en melding om at appen bare tar imot Excel-malen.

#### FR-2: Kontroller malens struktur

Appen kontrollerer at filen har arkene Stykkliste, MPS og Planlagte mottak, med kolonneoverskriftene fra Excel-malen. Gjelder UJ-4.

**Konsekvenser (testbare):**
- Mangler et ark eller en overskrift, blir det en valideringsfeil som nevner arket og hva som mangler.
- Arkene Veiledning og Veien videre leses ikke inn. Det gjør heller ikke Kontroll-kolonnen og de andre hjelpekolonnene til høyre for tabellene (lenker og skjulte lister). Ingen av dem påvirker valideringen.
- En fil laget etter den gamle malen (med arkene Produkt og Komponenter) gir en valideringsfeil om at arket Stykkliste mangler.
- Mangler et ark eller en overskrift, kontrolleres likevel de verdiene som ikke avhenger av det som mangler (FR-3), slik at alle feilene vises samlet (FR-4). Kontrollene som avhenger av det som mangler, hoppes over. Uten arket MPS er horisonten ukjent, så ukene i Planlagte mottak kontrolleres ikke. Uten en kolonne kontrolleres ikke verdiene i den. Slik blir det ingen følgefeil.
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
| Stykkliste | Type | Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv). Ferdigvare på nivå 0 og bare der. Lik for alle rader med samme varenummer. En del som kjøpes inn, har ingen underdeler. |
| Stykkliste | Underdeler | Står en del med underdeler flere steder, kan underdelene stå under bare én av forekomstene eller likt under hver forekomst (samme varenumre og antall, rekkefølgen spiller ingen rolle). Ulike underdeler under to forekomster er en feil. Beregningen bruker underdelene én gang (FR-28). |
| Stykkliste | Lagerbeholdning, Sikkerhetslager | Heltall ≥ 0. Fylt ut første gang varenummeret står, og tom de neste gangene. |
| Stykkliste | Ledetid (uker) | Heltall ≥ 1 (≥ 0 for nivå 0). Fylt ut første gang varenummeret står, og tom de neste gangene. |
| MPS | Antall ferdigprodukter | Heltall ≥ 0. Horisonten er antall sammenhengende utfylte uker fra uke 1 og må være 8–12. Er en uke fylt ut etter et hull, er det en feil. |
| Planlagte mottak | Varenummer | Finnes i Stykkliste |
| Planlagte mottak | Uke | Heltall fra 1 til H |
| Planlagte mottak | Antall | Heltall ≥ 1 |

**Konsekvenser (testbare):**
- Hver regel i tabellen har minst ett testtilfelle som gir nøyaktig én valideringsfeil (`testdata/validering/`).
- En verdi limt inn i en celle med nedtrekksliste, for eksempel nivå «3» eller typen «Delmontering», gir en valideringsfeil selv om Excel ikke stoppet den.
- Arket Planlagte mottak uten mottaksrader er gyldig.
- En del med lagerbeholdning 0 eller sikkerhetslager 0 er gyldig.
- Et varenummer som står flere steder med samme beskrivelse og type, og med lagerbeholdning, sikkerhetslager og ledetid bare første gang, er gyldig.
- En del som produseres selv og står to ganger, med de samme underdelene under begge forekomstene, er gyldig, og underdelene får samme bruttobehov som om de bare sto én gang.
- Den samme delen med underdeler under bare én av forekomstene, den første eller en senere, er gyldig og gir samme resultat.
- Står det et annet antall eller en annen underdel under andre forekomst, gir det én valideringsfeil som nevner varenummeret og begge radene.

#### FR-4: Vis alle valideringsfeil samlet

Er det minst én valideringsfeil, vises alle feilene i én liste og ingen beregning gjøres. Hver feil oppgir ark, rad eller celle, felt og årsak på norsk. Gjelder UJ-4.

**Konsekvenser (testbare):**
- En fil med tre feil på tre forskjellige ark gir én liste med tre feil.
- Ingen resultattabell vises, og den lagrede kjøringen endres ikke, når opplastingen har valideringsfeil.

### 4.2 MRP-beregning

**Beskrivelse:** Appen beregner én tabell for hvert varenummer over hele horisonten, også for ferdigproduktet. Beregningen er standard MRP for flernivå BOM med lot-for-lot. Den gjøres nivå for nivå ovenfra og ned: planlagte ordrefrigivelser for en del, ganget med antall per enhet, blir bruttobehov for delene rett under. Reglene per del (FR-6–FR-8) er de som er bekreftet i fasitene. Bakgrunnen og kildene står i addendum. Gjelder UJ-2.

#### FR-5: Beregn bruttobehov

For ferdigproduktet (nivå 0) er bruttobehov(t) = prognostiserte behov(t). For de andre delene er bruttobehov(t) summen av planlagt ordrefrigivelse(t) for den overordnede delen × antall på raden, over alle rader der varenummeret står.

**Konsekvenser (testbare):**
- Med lagerbeholdning, sikkerhetslager og ledetid 0 for ferdigproduktet er frigivelsene for ferdigproduktet lik prognostiserte behov. Da er bruttobehovet for 300-003 Hjul (antall 5) i testeksempel 01: 100, 125, 150, 100, 175, 150, 125, 200, 150, 100.
- Har ferdigproduktet ledetid 1, kommer bruttobehovet for delene på nivå .1 én uke tidligere enn prognostiserte behov.
- En del på nivå ..2 får bruttobehov fra frigivelsene til delen på nivå .1 rett over, ikke fra prognostiserte behov.

#### FR-28: Beregn felles deler én gang

En del som står flere steder i stykklisten, beregnes én gang, med samlet bruttobehov fra alle overordnede deler (FR-5). Den beregnes på sin lavnivåkode, etter at alle delene den står under, er beregnet. Lagerbeholdning, sikkerhetslager og ledetid hentes fra første rad med varenummeret. Planlagte mottak for varenummeret gjelder den samlede tabellen.

**Konsekvenser (testbare):**
- Skruesett M6 brukt 4 per sete og 2 per rygg får bruttobehov(t) = 4 × frigivelse sete(t) + 2 × frigivelse rygg(t), i én tabell.
- En del som står både på nivå .1 og ..2, beregnes etter alle delene på nivå .1, med behov fra begge.
- Lagerbeholdningen til en felles del brukes bare én gang, ikke én gang per forekomst.

#### FR-6: Beregn disponibel beholdning og nettobehov

For hver del og uke beregner appen disponibel(t) = beholdning(t−1) + planlagte mottak(t) − bruttobehov(t). Beholdning(t−1) er forventet lagerbeholdning(t−1) (FR-7) pluss fremskyndede mottak som ennå ikke er kommet. For t = 1 er beholdning(t−1) lik lagerbeholdningen. Planlagte mottak(t) tar ikke med mottak som allerede er fremskyndet til en tidligere uke. Et fremskyndet mottak regnes altså med én gang, fra uken det er fremskyndet til. Deretter beregnes nettobehov(t) = maks(0, SS − disponibel(t)).

Er nettobehov(t) > 0 og finnes det planlagte mottak for varenummeret i senere uker, regnes det første senere mottaket som fremskyndet til uke t. Hele mottaket regnes med fra uke t, og nettobehov(t) regnes på nytt. Er nettobehovet fortsatt > 0, fremskyndes neste senere mottak, og så videre. Et mottak kan fremskyndes fra hvilken som helst senere uke i horisonten. Bare et nettobehov som står igjen når det ikke finnes flere senere mottak, gir planlagt ordremottak (FR-7). Hvert fremskyndet mottak gir eksepsjonen «Mottak forsinket» (FR-12). Resultattabellen viser likevel mottaket i uken det er lagt inn i Excel-malen, og forventet lagerbeholdning regnes uten mottaket til det kommer (FR-7). Slik ser brukeren hva som skjer hvis mottaket ikke blir fremskyndet.

**Eksempel:** En del har lagerbeholdning 20, SS 0, bruttobehov 0, 0, 60 og 0 i uke 1–4 og et planlagt mottak på 100 i uke 4.
- Uke 1 og 2: disponibel = 20 og nettobehov 0.
- Uke 3: disponibel = 20 + 0 − 60 = −40, så nettobehovet blir først 40. Mottaket i uke 4 regnes som fremskyndet til uke 3: disponibel = −40 + 100 = 60, og nettobehovet regnes på nytt til 0. Uke 3 får ikke noe planlagt ordremottak, men får eksepsjonen «Mottak forsinket» (FR-12).
- Uke 4: beholdning(t−1) = −40 (forventet lagerbeholdning i uke 3) + 100 (fremskyndet mottak som ennå ikke er kommet) = 60. Planlagte mottak(4) = 0, fordi mottaket alt er regnet med. Disponibel = 60 og nettobehov 0.
- Resultattabellen viser nettobehov 0 i alle uker, planlagte mottak 100 i uke 4 og forventet lagerbeholdning 20, 20, −40 og 60 (FR-7).

Eksempelet er kontrollert mot referanseberegningen (`mrp_del` i `testdata/lag_testdata.py`) og for hånd.

**Konsekvenser (testbare):**
- Eksempelet over gir nøyaktig de radene som står i det.
- Nettobehov for alle deler i testeksempel 01 er identiske med fasiten.
- Flere planlagte mottak for samme varenummer og uke legges sammen.
- 300-005 Gassfjær i testeksempel 01: mottaket på 100 i uke 4 dekker behovet i uke 3. Uke 3 får da ikke noe planlagt ordremottak. Raden planlagte mottak viser 100 i uke 4, og forventet lagerbeholdning blir 0 i uke 3 og 80 i uke 4.
- Et planlagt mottak i uke H kan fremskyndes helt til uke 1, og hele mottaket fremskyndes.
- Et mottak som er fremskyndet mer enn én uke, gir ingen nye planlagte ordremottak i ukene mellom uken det er fremskyndet til og uken det opprinnelig skulle komme (200-002 i testeksempel 03, 300-028 i testeksempel 04).
- Det lages aldri både et planlagt ordremottak og et fremskyndet mottak for det samme nettobehovet, med mindre mottaket er for lite.

#### FR-7: Beregn planlagte ordremottak og forventet lagerbeholdning

Med lot-for-lot er planlagt ordremottak(t) = nettobehov(t), og forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak (FR-6) som ikke er kommet ennå. Det er denne verdien resultattabellen viser. Nettobehovet i FR-6 beregnes med de fremskyndede mottakene. Et planlagt ordremottak med forfalt frigivelse vises likevel i uke t, der behovet er, selv om det fysisk kommer tidligst i uke 1 + L. Forventet lagerbeholdning forutsetter altså at behovet dekkes i tide, og avviket vises som eksepsjon (FR-10, FR-11). Dette er en bevisst forenkling (se addendum).

**Konsekvenser (testbare):**
- Forventet lagerbeholdning er aldri under SS når lot-for-lot brukes, unntatt i ukene før et mottak som må fremskyndes (FR-6, FR-12).
- Planlagte ordremottak og forventet lagerbeholdning for alle deler i testeksempel 01 er identiske med fasiten.

#### FR-8: Beregn planlagte ordrefrigivelser

Hvert planlagt ordremottak i uke t gir en planlagt ordrefrigivelse i uke t − L. Er t − L < 1, er frigivelsen forfalt og legges i uke 1 sammen med vanlige frigivelser for uke 1. Behov innenfor horisonten som skulle vært frigitt før uke 1, tas med. Frigivelser for behov etter horisonten tas ikke med. Er L = 0 (bare lov for ferdigproduktet), frigis ordren i samme uke som den mottas.

**Konsekvenser (testbare):**
- 300-003 Hjul (L = 1) i testeksempel 01 har frigivelse 175 i uke 1 (50 forfalt + 125 vanlig).
- 300-008 Trekk (L = 3) med første nettobehov i uke 4 har frigivelse i uke 1 som ikke er forfalt, og den gir ingen eksepsjon.
- Alle planlagte ordrefrigivelser i testeksempel 01 er identiske med fasiten.
- En forfalt frigivelse for en del på nivå .1 gir bruttobehov i uke 1 for delene under den.

**Funksjonsspesifikke NFR-er:**
- Beregningen er deterministisk. Samme fil gir alltid samme resultat.

### 4.3 Eksepsjoner

**Beskrivelse:** Appen finner fem eksepsjonstyper under beregningen, for deler på alle nivåer. Hver eksepsjon har varenummer, uke (eller «–» for hele delen), type og en kort melding på norsk som forklarer hva som er galt og hva brukeren kan gjøre. En uke kan ha flere eksepsjoner. En del med minst én eksepsjon er kritisk. Definisjonene bygger på briefen. Endringene og kildene står i addendum. Gjelder UJ-2.

#### FR-9: Ledetid overskrider horisont

Er ledetiden fra ferdigproduktet ≥ H, får delen eksepsjonen «Ledetid overskrider horisont» med uke «–», uansett behov. Ledetiden fra ferdigproduktet er den største summen av L langs en sti i stykklisten fra ferdigproduktet ned til og med delen. Står delen flere steder, gjelder den lengste stien. Eksepsjonen sier ikke at delen mangler, men at planen er for kort til å vise de behovene etter uke H som må bestilles nå. Meldingen oppgir summen og stien den kommer fra, og foreslår lengre horisont.

**Konsekvenser (testbare):**
- 300-006 Stolfot (L = 10, H = 10) under et ferdigprodukt med L = 0 i testeksempel 01 får eksepsjonen selv om nettobehovet er 0 i alle uker.
- En del med ledetid fra ferdigproduktet lik H − 1 får ikke eksepsjonen.
- Med H = 10 og L = 1 for ferdigproduktet, L = 4 for en del på nivå .1 og L = 5 for en underdel av den på nivå ..2, får underdelen eksepsjonen (1 + 4 + 5 = 10), selv om ingen enkelt ledetid er ≥ H. Delen på nivå .1 (1 + 4 = 5) får den ikke.

#### FR-10: Bestilling forsinket

Har en uke t nettobehov > 0, forfalt frigivelse (t − L < 1) og disponibel(t) < 0, får uken eksepsjonen «Bestilling forsinket». Meldingen oppgir disponibel beholdning, forfalt mengde, uken frigivelsen skulle vært gjort, total frigivelse i uke 1 og tidligste mottaksuke (1 + L). Den slutter med hva som blir forsinket:
- for ferdigproduktet og delene rett under det (nivå .1): «Leveranse til kunde blir forsinket.»
- for deler lenger ned: «Produksjonen av \<overordnet del\> blir forsinket.» Står delen under flere overordnede deler, nevnes alle.

Står en felles del både rett under ferdigproduktet og lenger ned, gjelder «Leveranse til kunde blir forsinket.»

Disponibel beholdning i FR-10 og FR-11 er verdien etter at eventuelle mottak er fremskyndet til uken (FR-6). «Mottak forsinket» (FR-12) oppgir disponibel beholdning før mottaket er fremskyndet. Får en uke både «Mottak forsinket» og «Bestilling forsinket» eller «Bruk av sikkerhetslager», viser meldingene derfor ulike tall, som for 300-026 i uke 1 i testeksempel 04.

**Konsekvenser (testbare):**
- 300-003 Hjul får eksepsjonen i uke 1, med en melding som oppgir de samme opplysningene som meldingen i fasiten: «Lager blir -20 i uke 1. Bestillingen på 50 måtte vært frigitt i uke 0, før horisonten. De 50 er forfalt og tatt med i frigivelsen på 175 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket.»
- En del på nivå ..2 med eksepsjonen får en melding som slutter med «Produksjonen av \<overordnet del\> blir forsinket.», der \<overordnet del\> er navnet og varenummeret til delen over.

#### FR-11: Bruk av sikkerhetslager

Har en uke t nettobehov > 0, forfalt frigivelse og 0 ≤ disponibel(t) < SS, får uken eksepsjonen «Bruk av sikkerhetslager». Meldingen inneholder de samme opplysningene om forfalt mengde som i FR-10.

**Konsekvenser (testbare):**
- 300-004 Armlene får eksepsjonen i uke 1 (disponibel beholdning 10, SS 20), med 10 forfalt av frigivelsen på 60.
- En uke kan ikke få både «Bestilling forsinket» og «Bruk av sikkerhetslager».

#### FR-12: Mottak forsinket

Når et planlagt mottak regnes som fremskyndet til uke t (FR-6), får uke t eksepsjonen «Mottak forsinket». Meldingen oppgir mottaket (uke og antall), uken det må fremskyndes til, og hvor det må gjøres: hos leverandøren for deler som kjøpes inn, i egen produksjon for deler som produseres selv. Det lages ikke noe nytt bestillingsforslag for det behovet mottaket dekker.

**Konsekvenser (testbare):**
- 300-005 Gassfjær får eksepsjonen i uke 3: mottaket på 100 i uke 4 må fremskyndes til uke 3. Det lages ingen frigivelse for behovet i uke 3, og mottaket står fortsatt i uke 4 i tabellen.
- 300-007 Skruesett, med mottak i uke 2 før første nettobehov i uke 3, får ingen eksepsjon.
- Er mottaket for lite til å dekke nettobehovet, får uken både denne eksepsjonen og et planlagt ordremottak for resten.

#### FR-29: Kanseller mottak

Et planlagt mottak som ikke trengs noe sted i horisonten, får eksepsjonen «Kanseller mottak» i mottaksuken. Mottaket trengs ikke hvis delen ikke får noe nettobehov fra mottaksuken til og med uke H når mottaket tas bort fra beregningen. Under denne kontrollen fremskyndes ingen andre mottak (FR-6). Meldingen foreslår å kansellere eller utsette mottaket. Et mottak som kommer for tidlig, men som trengs senere i horisonten, gir ingen eksepsjon (se addendum).

**Konsekvenser (testbare):**
- 300-007 Skruesett (mottak i uke 2, nettobehov fra uke 3) får ikke eksepsjonen.
- En del der lagerbeholdningen alene holder sikkerhetslageret i hele horisonten, og som har et planlagt mottak, får eksepsjonen i mottaksuken.
- Et mottak som er regnet som fremskyndet (FR-6), kan ikke få eksepsjonen.

#### FR-13: Marker kritiske deler

En del med minst én eksepsjon markeres som kritisk, uansett nivå.

**Konsekvenser (testbare):**
- I testeksempel 01 er nøyaktig 300-003, 300-004, 300-005 og 300-006 kritiske.
- Eksepsjonslisten for testeksempel 01 er identisk med fasiten: samme varenummer, uke og type, og ingen andre.
- Hver melding inneholder opplysningene FR-9–FR-12 og FR-29 krever. Ordlyden trenger ikke være lik meldingen i fasiten.

### 4.4 Resultattabell

**Beskrivelse:** Etter en vellykket kjøring ser brukeren først bestillingsforslagene (FR-17), deretter sammendraget av kritiske deler (FR-16) og så resultattabellen (FR-14). Alt skal være forståelig for en planlegger uten MRP-bakgrunn etter en kort introduksjon (SM-3), og hvert tall kan forklares (FR-18). Gjelder UJ-1 og UJ-2.

#### FR-14: Vis resultattabell per del

Appen viser, for hvert varenummer, radene bruttobehov, planlagte mottak, forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte ordrefrigivelser, med én kolonne per uke i horisonten. Hver del vises med varenummer, beskrivelse, nivå og type. Ferdigproduktets navn og horisonten vises over tabellen.

**Konsekvenser (testbare):**
- Alle tall i tabellen for testeksempel 01 er identiske med fasiten.
- Tabellen har nøyaktig H ukekolonner.
- En felles del vises med én tabell, ikke én per forekomst i stykklisten.

#### FR-15: Fremhev eksepsjoner i tabellen

En celle for en uke og del med en eksepsjon fremheves, og meldingen åpnes ved klikk på cellen (FR-18). Eksepsjoner med uke «–» vises ved delens navn. Fremhevingen bruker både farge og et symbol eller en tekst, ikke farge alene.

**Konsekvenser (testbare):**
- Alle eksepsjonene i fasiten for testeksempel 01 vises på riktig del og uke.
- En uke med flere eksepsjoner viser alle meldingene.

#### FR-16: Vis sammendrag av kritiske deler

Appen viser et sammendrag over tabellen: antall kritiske deler og en liste over dem med eksepsjonstyper. Brukeren kan gå direkte fra sammendraget til delen i tabellen. Tabellen følger rekkefølgen i stykklisten. Kritiske deler markeres tydelig, men flyttes ikke øverst.

**Konsekvenser (testbare):**
- For testeksempel 01 viser sammendraget 4 kritiske deler: 300-003, 300-004, 300-005 og 300-006.
- Delene i tabellen står i samme rekkefølge som i arket Stykkliste. En felles del står der den står første gang.
- Velger brukeren en del i sammendraget, vises delens tabell.

#### FR-17: Vis bestillingsforslag

Appen viser en liste over alle bestillingsforslag i kjøringen, sortert etter frigivelsesuke. For hvert forslag vises varenummer, beskrivelse, frigivelsesuke, mengde og om forslaget er et innkjøp (Komponent (Kjøpes inn)) eller en produksjonsordre (Ferdigvare og Komponent (Produseres selv)). Forslag med forfalt mengde merkes. Brukeren kan filtrere listen på én uke og se bare forslagene som skal frigis den uken. Det er ingen egen ukevisning i tillegg til listen.

**Konsekvenser (testbare):**
- Listen for testeksempel 01 har én linje per planlagt ordrefrigivelse > 0 i fasiten, med samme mengde og uke.
- Alle forslagene for delene på nivå .1 i testeksempel 01 er innkjøp.
- Filtrert på uke 1 viser listen for testeksempel 01 bare forslagene med frigivelsesuke 1, også de med forfalt mengde.
- Fjernes filteret, vises alle forslagene igjen.

#### FR-18: Forklar beregningen

Hver rad i resultattabellen har en kort forklaring på norsk av hvordan den er beregnet, med reglene fra §4.2. For hver celle kan brukeren se tallene som ga resultatet. For bruttobehov til en del under ferdigproduktet viser forklaringen hvilke overordnede deler behovet kommer fra, og antallet per enhet. Hver eksepsjonstype har en forklaring av hvorfor den slo til.

Forklaringen åpnes når brukeren klikker på raden eller cellen, og vises i et panel ved siden av tabellen. Panelet står til brukeren lukker det. Det virker med mus, tastatur og berøring. Forklaringen vises ikke ved peking (hover).

**Konsekvenser (testbare):**
- For 300-003 Hjul, uke 1, kan brukeren se: lagerbeholdning = 80, planlagte mottak = 0, bruttobehov = 100, disponibel beholdning = -20, SS = 30, nettobehov = 50.
- Alle seks radtypene og alle fem eksepsjonstypene har en forklaring.
- For en felles del viser forklaringen av bruttobehovet bidraget fra hver overordnet del.
- Forklaringen kan åpnes og lukkes med tastaturet alene.
- Å holde musepekeren over en celle uten å klikke åpner ikke forklaringen.
- Panelet står åpent til brukeren lukker det.

### 4.5 Endringer og før/etter-sammenligning

**Beskrivelse:** Når noe endres, endrer brukeren Excel-filen og laster den opp på nytt. Appen sammenligner da den nye kjøringen med forrige kjøring for samme ferdigprodukt. Også når en ny uke blir uke 1, sammenlignes det med forrige kjøring. Ukeskiftet håndteres ikke særskilt. Gjelder UJ-3.

#### FR-19: Husk siste kjøring per ferdigprodukt i nettleseren

Etter en vellykket kjøring lagrer appen kjøringen i brukerens nettleser, slik at den finnes ved neste opplasting, også etter at nettleseren er lukket. For hvert ferdigprodukt lagres bare siste vellykkede kjøring. Ferdigproduktet kjennes igjen på varenummeret på nivå 0. Kjøringene finnes bare i nettleseren der de ble laget (NFR-4).

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
- Et bestillingsforslag er identifisert av varenummer og frigivelsesuke. Samme varenummer og uke med ny mengde er «endret mengde». Flytter et forslag uke, vises det som fjernet i den gamle uken og nytt i den nye. En eksepsjon er identifisert av varenummer, uke og type, og en endret melding alene er ingen endring.
- En endring i forventet lagerbeholdning som ikke endrer noe bestillingsforslag eller noen eksepsjon, vises ikke.
- Er en del lagt til i eller fjernet fra stykklisten, vises den som en egen linje i sammenligningen.
- Lastes en fil for ferdigprodukt X opp, så en for ferdigprodukt Y og så en ny for X, sammenlignes den tredje kjøringen (X) med den første (X). Kjøringen for Y vises uten sammenligning.

#### FR-21: Start på nytt uten sammenligning

Brukeren kan slette den lagrede kjøringen for et ferdigprodukt. Neste opplasting for det ferdigproduktet vises da uten sammenligning. Gjelder UJ-3.

**Konsekvenser (testbare):**
- Etter sletting vises ingen før/etter-sammenligning ved neste opplasting for det ferdigproduktet.
- Sletting for ett ferdigprodukt endrer ikke de lagrede kjøringene for andre ferdigprodukter.

### 4.6 Eksport av resultater

**Beskrivelse:** Brukeren kan lagre resultatet av en kjøring som en fil, for å ta vare på planen, dele den eller bruke den uten appen. Gjelder UJ-2.

#### FR-22: Eksporter kjøring til fil

Brukeren kan laste ned resultatet av den viste kjøringen som en Excel-fil (`.xlsx`), siden brukeren allerede arbeider i Excel. Filen inneholder resultattabellen per del og uke, listen over bestillingsforslag, eksepsjonslisten med meldinger, og ferdigproduktets navn, horisont og tidspunkt for kjøringen.

**Konsekvenser (testbare):**
- Tallene i den eksporterte filen for testeksempel 01 er identiske med fasiten.
- Den eksporterte filen kan åpnes i Excel uten feil.
- Filnavnet inneholder ferdigproduktets navn og dato.

#### FR-23: Eksporter før/etter-sammenligning

Når en før/etter-sammenligning vises, tas den med i eksporten som et eget ark «Sammenligning», bygd opp som arket Sammenligning i `testdata/testeksempel-03-fasit.xlsx`.

**Konsekvenser (testbare):**
- Eksporten etter at testeksempel 02 og så 03 er lastet opp, har et ark Sammenligning med de samme linjene som arket Sammenligning i fasit 03.
- Eksporten av en kjøring uten sammenligning har ikke arket Sammenligning.

### 4.7 Fast partistørrelse (planlagt utvidelse)

**Beskrivelse:** Når kjernen (§4.1–4.6) er ferdig og testet mot fasit, legges fast partistørrelse til som valgbar bestillingsregel per del. Excel-malen får en valgfri kolonne «Partistørrelse» i arket Stykkliste, som fylles ut første gang varenummeret står, slik som lagerbeholdning, sikkerhetslager og ledetid. Er cellen tom, brukes lot-for-lot. Planlagt ordremottak rundes opp til et helt antall partier, og overskuddet føres videre i forventet lagerbeholdning. Utvidelsen planlegges som et eget, senere epic, slik faglærer anbefaler. Testeksempelet med fast partistørrelse og fasit (FR-25) lages når utvidelsen starter. **Kuttes først** (trinn 5 i §7.1).

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

Fra appens startside kan brukeren laste ned den tomme Excel-malen og testeksempel 01, og lese en kort veiledning: fyll ut malen, last opp, les tabellen. Veiledningen sier også at hver fil gjelder ett ferdigprodukt, og at lageret for deler som brukes i flere ferdigprodukter, må fordeles mellom filene (§6).

**Konsekvenser (testbare):**
- Malen som lastes ned, er identisk med `testdata/COSI-MRP-mal.xlsx`.
- Veiledningen nevner at hver fil gjelder ett ferdigprodukt, og hvordan deler som brukes i flere ferdigprodukter, håndteres.

### 4.9 Produksjonskapasitet fra lager

**Beskrivelse:** Brukeren kan få beregnet hvor mange hele ferdigprodukter som kan være ferdige innen hver uke i horisonten, ut fra lageret av ferdigproduktet og delene og de planlagte mottakene, uavhengig av prognostiserte behov. Ledetiden er med, så kapasiteten viser både hva materialene rekker til, og når produktene kan være ferdige. Beregningen bruker den samme opplastede Excel-malen som bestillingsplanen og kan vises alene eller sammen med den. Den viser også hvilke deler som begrenser, og om det er lageret eller ledetiden som begrenser. Gjelder UJ-5. **Kuttes først** (trinn 4 i §7.1).

#### FR-30: Velg beregning

Brukeren velger om kjøringen skal vise bestillingsplanen (§4.2–4.6), produksjonskapasiteten eller begge. Valideringen er den samme uansett valg (FR-1–FR-4), så arket MPS må være utfylt også når bare kapasiteten vises. Horisonten trengs for ukene i Planlagte mottak og i kapasiteten. Gjelder UJ-5.

**Konsekvenser (testbare):**
- Velger brukeren bare produksjonskapasiteten, vises ingen resultattabell, bestillingsforslag eller eksepsjoner.
- Velger brukeren bare bestillingsplanen, er resultatet det samme som uten kapasiteten.
- En kjøring med bare kapasiteten lagres ikke og endrer verken den lagrede kjøringen eller før/etter-sammenligningen (FR-19, FR-20).
- Kapasiteten er ikke med i eksporten (FR-22).

#### FR-31: Beregn produksjonskapasitet

Ledig beholdning for en del er maks(0, lagerbeholdning − SS), så sikkerhetslageret holdes av. Produksjonskapasiteten i uke t er det største antallet hele ferdigprodukter N der et behov på N ferdigprodukter i uke t kan dekkes. Behovet brytes ned gjennom stykklisten som i MRP-beregningen (FR-5–FR-8, FR-28), med disse endringene:
- Lagerbeholdningen er den ledige beholdningen, og SS er 0. Det gjelder også ferdigproduktet, så ledig beholdning av ferdigproduktet telles med.
- Planlagte mottak regnes med fra mottaksuken og fremskyndes ikke (FR-6).
- Deler som kjøpes inn, og andre deler uten underdeler, kan ikke få planlagte ordremottak. De må dekkes av ledig beholdning og planlagte mottak.
- Ferdigproduktet og deler som produseres selv kan få planlagte ordremottak, men ingen planlagt ordrefrigivelse kan være forfalt (før uke 1).

Fordi behovet nettes nivå for nivå, brukes ledig beholdning av en del som produseres selv, før behovet går videre til underdelene. Appen beregner kapasiteten for hver uke på to måter: fra lager, uten planlagte mottak, og med planlagte mottak (FR-32). Gjelder UJ-5.

**Konsekvenser (testbare):**
- Kapasiteten er et heltall ≥ 0 og blir aldri lavere fra én uke til den neste.
- Et ferdigprodukt med ledig beholdning 10 og ledetid 1 har kapasitet 10 i uke 1, uansett lageret av delene.
- En del med lagerbeholdning 50 og SS 20 regnes med 30. En del med lagerbeholdning under SS regnes med 0.
- Har verken ferdigproduktet eller delene som produseres selv ledig beholdning, og er ledetiden fra ferdigproduktet mindre enn H for alle deler, er kapasiteten fra lager i uke H den minste verdien av ⌊ledig beholdning / antall per ferdigprodukt⌋ blant delene uten underdeler. Antall per ferdigprodukt er produktet av antallene langs stien fra ferdigproduktet, summert over alle stedene delen står (FR-28).
- Under et ferdigprodukt med ledetid 0 har en del på nivå .1 som produseres selv, med ledetid 2, uten lager og med nok underdeler på lager, kapasitet 0 i uke 1 og 2. Fra uke 3 rekker underdelene til hele kapasiteten.
- To filer som bare er ulike i arket MPS, gir samme kapasitet.

#### FR-32: Vis kapasitet fra lager og med planlagte mottak

Appen viser produksjonskapasiteten per uke på to rader: fra lager, der bare ledig beholdning er med, og med planlagte mottak, der mottakene regnes med fra mottaksuken. Slik ser brukeren hva lageret alene rekker til, og hva mottakene gir i tillegg. Gjelder UJ-5.

**Konsekvenser (testbare):**
- Under et ferdigprodukt med ledetid 0 øker et mottak i uke 4 for den begrensende delen på nivå .1 kapasiteten med planlagte mottak fra uke 4, ikke i uke 1–3. Raden fra lager endres ikke.
- Uten planlagte mottak er de to radene like.
- Raden med planlagte mottak er aldri lavere enn raden fra lager.

#### FR-33: Vis begrensende deler

For hver uke og rad i produksjonskapasiteten viser appen de begrensende delene: delene som ikke kan dekkes når behovet er N + 1 ferdigprodukter i uken (FR-31). For hver del vises årsaken: for lite på lager og i planlagte mottak, eller at en ordre måtte vært frigitt før uke 1 (ledetid). Gjelder UJ-5.

**Konsekvenser (testbare):**
- Har to deler den samme laveste verdien i FR-31, vises begge som begrensende.
- Får den begrensende delen et mottak som er stort nok, vises en annen del som begrensende fra mottaksuken på raden med planlagte mottak.
- Et ferdigprodukt med ledetid 1 er begrensende i uke 1 med årsaken ledetid.

#### FR-34: Vis kapasitetspanelet

Produksjonskapasiteten vises i et eget panel med egen overskrift, adskilt fra bestillingsplanen, så brukeren ikke forveksler kapasitet med planlagt produksjon. Øverst står de to radene fra FR-32, én kolonne per uke. Under dem står en tabell med én rad per del: lagerbeholdning, sikkerhetslager, ledig beholdning, ledetid og planlagte mottak per uke. Panelet sier at produksjonskapasiteten tar med ledetid, men ikke prognostiserte behov. Begrensende deler markeres med årsak, ikke med farge alene (NFR-8). Gjelder UJ-5.

**Konsekvenser (testbare):**
- Er begge beregningene valgt, vises bestillingsplanen og kapasitetspanelet på samme side, i hvert sitt panel.
- Et planlagt mottak står i tabellen i mottaksuken.
- Kapasitetsradene har nøyaktig H ukekolonner.

## 5. Tverrgående ikke-funksjonelle krav

- **NFR-1 Beregning skilt fra resten:** Beregningen (§4.2–4.3 og FR-31) kan kjøres og testes alene, uten Excel-lesing, lagring eller brukergrensesnitt. En test kan kalle den med stykkliste, prognostiserte behov og planlagte mottak som inndata. Det gjør automatiske tester mot fasiten mulig og følger faglærers råd.
- **NFR-2 Automatiske tester mot fasit:** Hvert testeksempel i `testdata/` har automatiske tester som sammenligner resultattabell og eksepsjoner med fasiten, og hver regel i FR-2 og FR-3 har en automatisk test (`testdata/validering/`). Testene kjøres med én kommando som er beskrevet i README, uten nøkler, betalte kontoer eller eksterne tjenester, og en person utenfor gruppen kan kjøre dem uten hjelp. Fasitene er kontrollert for hånd og lages ikke med appens egen beregningskode, så testene sammenligner med et uavhengig resultat. En endring som gir ett avvik fra en fasit, får minst én test til å feile.
- **NFR-3 Kjørbar for sensor:** Appen kan startes lokalt etter README, uten API-nøkler, betalte kontoer eller tjenester som gruppen driver. Excel-malen og testeksemplene ligger i repoet. I tillegg er appen publisert på nettet, så den kan åpnes fra en lenke uten installasjon (NFR-4).
- **NFR-4 Data blir i brukerens nettleser:** Opplastede filer forlater aldri brukerens maskin. Serveren som publiserer appen, leverer bare appens kode. Innlesing, validering, beregning og lagring av kjøringer skjer i brukerens nettleser. Opplastede filer og kjøringer sendes ikke til serveren eller til tredjepartstjenester. Derfor finnes lagrede kjøringer bare i nettleseren der de ble laget (FR-19). Publiseringstjeneste og rammeverk velges i arkitekturen (se addendum).
- **NFR-5 Ytelse:** Målet er at en kjøring med 1000 rader i stykklisten, tre nivåer og 12 uker tar under 3 sekunder fra opplasting til resultattabell på en vanlig bærbar PC (måling: se addendum).
- **NFR-6 Plattform:** Webapp for PC i nyere versjoner av Chrome, Edge og Firefox. Ikke tilpasset mobil i v1.
- **NFR-7 Språk:** All tekst i appen, også valideringsfeil og eksepsjoner, er på norsk i v1. Tekstene samles slik at engelsk kan legges til senere uten å endre beregningen.
- **NFR-8 Lesbarhet:** Eksepsjoner og kritiske deler markeres ikke med farge alene (se FR-15). Når tabellen er bredere enn skjermen, står kolonnene med varenummer, beskrivelse og radnavn fast mens brukeren blar sideveis.
- **NFR-9 Robust feilhåndtering:** Ingen fil kan få appen til å stoppe, henge eller vise et delvis resultat. En skadet fil, en tom fil, en fil som ikke er en Excel-fil selv om den heter `.xlsx`, og en uventet feil under beregningen gir hver en forståelig melding på norsk. Brukeren kan da laste opp en ny fil uten å laste siden på nytt, og den lagrede kjøringen endres ikke (FR-4, FR-19). Testbart: en skadet `.xlsx`-fil, en fil på 0 byte med endelsen `.xlsx` og en tekstfil med endelsen `.xlsx` (`testdata/validering/V-F07`–`V-F09`) gir hver sin melding, og etterpå gir testeksempel 01 riktig resultat uten at siden lastes på nytt.
- **NFR-10 Lagring i nettleseren:** Siste kjøring finnes etter at nettleseren er lukket og åpnet igjen. Bare siste vellykkede kjøring per ferdigprodukt lagres (FR-19), og bare i nettleseren på brukerens maskin. Den opplastede Excel-filen lagres ikke. Etter sletting (FR-21) finnes ingen data om det ferdigproduktet igjen i nettleseren. Er lagring i nettleseren blokkert eller ikke tilgjengelig, for eksempel i et privat vindu, virker appen som vanlig uten lagring og sier fra at kjøringen ikke blir lagret. Hvilken lagring i nettleseren som brukes, velges i arkitekturen (se addendum). Testbart: etter to kjøringer for samme ferdigprodukt inneholder appens lagring i nettleseren bare den siste og ingen Excel-fil. Med lagring blokkert gir testeksempel 01 riktig resultat og en melding om at kjøringen ikke lagres.
- **NFR-11 Kompatibilitet med Excel:** Appen leser `.xlsx`-filer laget fra Excel-malen og lagret i Microsoft Excel for Windows og macOS. Den leser verdiene i cellene, ikke formlene, og leser nivå og varenummer likt enten Excel har lagret dem som tall eller tekst. Malen er en vanlig `.xlsx` uten makroer. Eksporterte filer (FR-22, FR-23) kan åpnes i Excel uten feilmeldinger. Testbart: testeksempel 01 og 02, åpnet og lagret på nytt i Excel for Windows og i Excel for macOS, gir samme resultat som de opprinnelige filene. Et varenummer lagret som tallet 300001 leses som samme varenummer som teksten «300001».

## 6. Ikke-mål

- COSI - MRP er ikke et ERP-system. Det dekker ikke produksjon, økonomi, kundeordrer eller selve innkjøpet hos leverandør.
- Appen sender ikke bestillinger. Den foreslår dem, og brukeren handler.
- Appen bruker ikke KI eller språkmodeller.
- Appen lagrer ikke data på en server.
- Appen planlegger ikke flere ferdigprodukter samlet i v1. Hver fil gjelder ett ferdigprodukt, og lageret for deler som brukes i flere ferdigprodukter, må brukeren fordele selv (FR-27, §7.2).

## 7. MVP-omfang

**Frist:** Alt skal være ferdig og levert 15. desember 2026 kl. 15:00.

### 7.1 Med i v1

Funksjonene bygges i denne rekkefølgen. Strekker ikke tiden til, kuttes det som kommer sist, først.

1. **Kjernen:** opplasting og validering av Excel-malen (FR-1–FR-4), MRP-beregning for flernivå BOM med inntil tre nivåer, felles deler og lot-for-lot for ett ferdigprodukt (FR-5–FR-8, FR-28), fem eksepsjonstyper og kritiske deler (FR-9–FR-13, FR-29), resultattabell med fremheving, sammendrag og bestillingsforslag med ukefilter (FR-14–FR-17), og veiledning med nedlasting av malen (FR-27)
2. **Forklaringer** (FR-18)
3. **Lagring, sammenligning og eksport:** siste kjøring per ferdigprodukt i nettleseren og før/etter-sammenligning (FR-19–FR-21), og eksport til Excel (FR-22–FR-23)
4. **Produksjonskapasitet fra lager** (FR-30–FR-34)
5. **Planlagt utvidelse når kjernen er testet:** fast partistørrelse (FR-24–FR-26)

**Minstekrav for innlevering:** Trinn 1–3 (FR-1–FR-23 og FR-27–FR-29) skal være ferdige og bestå SM-1, SM-2 og SM-4. Trinn 4 og 5 kuttes først.

**Kuttbeslutning 30. november 2026:** Trinn 1–3 skal være testet innen 30. november. Gruppen avgjør da sammen på et møte om trinn 4 og 5 startes. Er trinn 1–3 ikke testet, startes de ikke, og tiden går til kjernen og brukertesten. Rettelser etter brukertesten (§8.1) går foran trinn 4.

### 7.2 Ikke med i v1

- **Mer enn tre nivåer i stykklisten** – videreutvikling.
- **Samlet planlegging av flere ferdigprodukter** – første utvidelse etter v1. Deler som brukes i flere ferdigprodukter, beregnes da én gang med felles lagerbeholdning. Det krever endringer i malen (flere rader med nivå 0 og prognostiserte behov per ferdigprodukt), i FR-3, FR-5 og FR-19–FR-21, og et nytt testeksempel.
- **Hva-om-scenarier side om side** – utvidelse etter samlet planlegging. Briefen nevnte dette som første utvidelse. I v1 erstatter et hva-om-forsøk den lagrede kjøringen for ferdigproduktet (FR-19).
- **Andre bestillingsregler** (f.eks. beregnet optimal bestillingsmengde) – videreutvikling.
- **Omplanleggingshorisont** (grense for hvor langt fram et planlagt mottak kan fremskyndes fra, FR-6) – mulig utvidelse.
- **Inntasting i appen** som alternativ til Excel-malen – videreutvikling.
- **Innlogging, brukerkontoer og lagring av flere kjøringer per ferdigprodukt** – videreutvikling. Eksport dekker behovet i v1.
- **Flere bedrifter med adskilte data** – videreutvikling.
- **Engelsk** – neste språk. Deretter flere språk på lengre sikt.
- **Mobiltilpasning** – ikke planlagt.
- **Testing hos reelle bedrifter** – utenfor kurset (se Vision i briefen).

## 8. Suksessmål

**Primære**
- **SM-1 Korrekt beregning:** 100 % samsvar mellom resultattabellen og fasiten for alle testeksempler i `testdata/`, for hver uke, del og rad. Minst ett testeksempel har 5–10 deler fordelt på 3 nivåer og minst én felles del. Gjelder FR-5–FR-8, FR-14, FR-28.
- **SM-2 Pålitelige eksepsjoner:** For hver av de fem eksepsjonstypene utløses riktig eksepsjon i hvert kjent avvikstilfelle, uten falske eller manglende eksepsjoner. Gjelder FR-9–FR-13, FR-29.
- **SM-3 Forståelig uten forkunnskap:** Etter den samme korte introduksjonen løser hver testperson tre oppgaver uten hjelp fra utviklerne: (1) finn en kritisk del, (2) forklar en eksepsjon med egne ord, og (3) les av mengden og frigivelsesuken for ett bestillingsforslag. En oppgave er løst når svaret er riktig innen 3 minutter. Målet er at alle testpersonene løser alle oppgavene. Feiler to eller flere testpersoner på samme oppgave, endres teksten eller layouten. Brukertesten gjennomføres som beskrevet i §8.1. Gjelder FR-15–FR-18.

**Sekundære**
- **SM-4 Inndata kontrolleres:** Hver valideringsregel i FR-3 har en test der en fil med nøyaktig den feilen gir nøyaktig én valideringsfeil med riktig ark, rad og årsak. Gjelder FR-2–FR-4.
- **SM-5 Endringer håndteres:** En komplett kjøring over 8–12 uker med 5–10 deler fordelt på 3 nivåer og minst én endring midtveis (f.eks. endrede prognostiserte behov) gir en før/etter-sammenligning som viser nøyaktig de endrede bestillingsforslagene og eksepsjonene. Gjelder FR-19–FR-21.
- **SM-6 Kjørbar for sensor:** En person utenfor gruppen kan starte appen etter README og kjøre testeksempel 01 uten hjelp. Gjelder NFR-3.
- **SM-7 Riktig kapasitet:** 100 % samsvar med en manuelt kontrollert fasit for kapasiteten per uke på begge radene og for de begrensende delene med årsak. Testeksempelet har sikkerhetslager, planlagte mottak, lager av ferdigproduktet og av en del som produseres selv, en felles del og et tilfelle der ledetiden begrenser (testeksempel 05). Gjelder FR-31–FR-33.

**Mot-mål (skal ikke optimaliseres)**
- **SM-C1 Antall funksjoner:** Flere funksjoner er ikke et mål i seg selv. Fast partistørrelse startes først når SM-1 og SM-2 er nådd. Balanserer SM-1.
- **SM-C2 Antall eksepsjoner:** Flere eksepsjoner gir ikke bedre planlegging. Hver eksepsjon skal kreve handling, ellers lærer brukeren seg å overse dem. Balanserer SM-2.
- **SM-C3 Visuell fremheving:** Tabellen skal ikke fylles med farger og symboler for å se informativ ut. Det skal være raskt å finne det som krever handling. Balanserer SM-3.

### 8.1 Brukertest (SM-3)

Hvert gruppemedlem rekrutterer 1–2 testpersoner, til sammen 4–8. Testpersonene skal ha ulik bakgrunn, blant annet i erfaring med innkjøp og produksjonsplanlegging, Excel-ferdigheter og fagkompetanse, så testen viser hvordan appen fungerer for brukere med ulik erfaring. Ingen trenger å ha brukt appen før, fordi SM-3 nettopp krever at brukeren finner en kritisk del, mengden og frigivelsesuken etter en kort introduksjon.

Testene gjennomføres hver for seg og etter samme prosedyre, så resultatene kan sammenlignes. Alle testpersonene får den samme introduksjonen og de samme oppgavene, og ingen veiledning mens de løser oppgavene. Testlederen kan hjelpe med tekniske problemer, men ikke med hvordan oppgavene løses.

Oppgavene og grensen for når en oppgave er løst, står i SM-3. Testen bruker bare trinn 1 og 2 i §7.1: opplasting, beregning, eksepsjoner, resultattabell, bestillingsforslag og forklaringer.

- **Tid:** Brukertesten gjennomføres 2.–7. desember 2026, etter kuttbeslutningen 30. november (§7.1). Da er det åtte dager igjen til fristen for rettelser.
- **Prøvetest:** Rundt 27. november løser et gruppemedlem oppgavene som en prøve, for å se at introduksjonen og oppgavene fungerer. Prøvetesten teller ikke med i resultatet.
- **Dokumentasjon:** Introduksjonen, oppgavene og resultatet per testperson (anonymisert) dokumenteres i `.docs/brukertest/brukertest-resultat.md`, sammen med endringene testen førte til.

## 9. Åpne spørsmål

Spørsmålene beholder nummeret sitt, så andre dokumenter kan vise til dem. De lukkede spørsmålene (1–3 og 5–12) står i addendum med samme nummer.

4. Hva inneholder den korte introduksjonen til brukertesten (SM-3)? Testpersonene og prosedyren (§8.1), oppgavene (SM-3), tidspunktet og hvor resultatet dokumenteres (§8.1) er besluttet. **Ansvarlig:** gruppen. **Tas opp:** i UX-steget, før prøvetesten rundt 27. november. Hindrer ikke arkitektur eller epics.

## 10. Antagelser

Ingen antagelser er igjen. Antagelsene fra de første utkastene ble besluttet 2026-11-05, og antagelsene om produksjonskapasiteten 2026-11-09. Oversikten over hva som ble bekreftet og endret, står i addendum.
