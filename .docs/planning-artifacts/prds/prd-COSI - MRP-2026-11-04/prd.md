- Excel-malen skal ha et valgfritt område for åpne/fremtidige bestillinger, med materiale, bestilt mengde og forventet mottaksuke.
---
title: COSI - MRP PRD
status: draft
created: 2026-11-04
updated: 2026-11-04
language: norsk
---

# PRD-utkast: COSI - MRP

> **Status:** Arbeidsutkast under utarbeidelse med coaching path. Dette dokumentet inneholder foreløpig visjon og funksjonsområder, ikke en ferdig PRD. Punkter merket **[ÅPENT SPØRSMÅL]** må avklares før kravene ferdigstilles.

## 1. Produktvisjon

COSI - MRP skal bidra til bedre vareflyt i små produksjonsbedrifter ved å gjøre sammenhengen mellom produksjonsplan, materialbehov, lagerbeholdning og bestillingstidspunkt tydelig og forståelig.

Brukeren laster opp en Excel-fil som følger en fast mal, med både produksjonsplan (MPS) og material-/lagerbeholdning. Verktøyet validerer dataene og lar brukeren beregne MPS-basert materialplan, lagerbasert produksjonskapasitet eller begge resultatene i samme kjøring. Lagerkapasiteten beregnes uavhengig av MPS-planen.

Målet er å redusere personavhengig manuelt arbeid og gjøre det enklere å oppdage materialmangel tidsnok til å bestille eller følge opp leveranser.

## 2. Målbruker og brukssituasjon

**Primærbruker:** Produksjonsplanlegger eller innkjøper i en liten produksjonsbedrift. Brukeren trenger oversikt over hva som kan produseres med tilgjengelige materialer, hvilke materialer som mangler for planlagt produksjon, og når en bestilling må frigjøres.

**Brukssituasjon:** Brukeren oppdaterer grunnlagsdata i en Excel-mal, laster filen opp, kontrollerer eventuelle valideringsfeil og bruker beregningsresultatene til å vurdere produksjon og materialbestillinger.

## 3. Produktmål

- Gi brukeren en etterprøvbar materialplan for oppgitt MPS.
- Vise maksimal produksjonsmengde som kan støttes av materialbeholdningen, separat fra MPS.
- Synliggjøre begrensende materialer, materialmangel og relevante avvik.
- Gjøre beregningsresultatene forståelige uten at brukeren må tolke skjulte Excel-formler.
- La brukeren kontrollere beregningskorrekthet mot manuelt utregnede testeksempler.

## 4. Funksjonsområder

### F1. Import og validering av Excel-mal

Brukeren laster opp en Excel-fil med informasjon i avtalt mal. Malen skal kunne inneholde MPS, flernivå-BOM, lagerbeholdning, planlagte mottak, ledetid og sikkerhetslager.

**Foreløpige funksjonskrav:**

- Excel-malen skal la kunden oppgi både MPS og material-/lagerbeholdning.
- Excel-malen skal la kunden oppgi åpne/fremtidige bestillinger dersom slike finnes, med materiale, bestilt mengde og forventet mottaksuke.
- Systemet skal kontrollere at filen følger forventet mal før beregning starter.
- Systemet skal gi forståelige feilmeldinger for manglende obligatoriske data, ugyldige verdier og feil datatyper.
- Systemet skal ikke presentere beregningsresultater som gyldige når inputfila ikke består valideringen.
- Kunden skal kunne velge MPS-materialplan, lagerbasert produksjonskapasitet eller begge beregningene.
- Når begge beregningene velges, skal resultatene vises på samme resultatside i to tydelig adskilte visuelle paneler: ett for MPS-materialplanen og ett for lagerkapasiteten.
- MPS-panelet skal vise produksjonsplanen per uke som en graf. Detaljerte materialberegninger per komponent skal fortsatt kunne leses i tabell.
- Lagerkapasitetspanelet skal vise lagerbeholdning, reservert sikkerhetslager, åpne bestillinger og beregnet produksjonskapasitet i en tabell.

### F2. Materialplan basert på MPS

Brukeren legger inn MPS i Excel-malen som ønsket produksjonsplan for ferdigproduktet. MPS-en kan planlegge ferdigvarer selv om nødvendige materialer ikke finnes i disponibelt lager, sikkerhetslager eller planlagte mottak. Systemet beregner materialbehov per komponent og uke gjennom flernivå-BOM-en, og viser mangler, bestillingsforslag og avvik.

**Foreløpige funksjonskrav:**

- Systemet skal beregne bruttobehov, forventet beholdning, nettobehov, planlagte mottak og planlagte ordrefrigivelser per komponent og uke.
- Systemet skal sammenligne materialbehovet fra MPS med disponibel beholdning, der sikkerhetslageret er reservert, og med planlagte mottak innenfor planleggingshorisonten.
- Systemet skal eksplodere behov nivå for nivå gjennom flernivå-BOM.
- Systemet skal bruke lot-for-lot som bestillingsregel i kjernen.
- Systemet skal beregne bestillingsfrigivelse ut fra komponentens ledetid.
- Systemet skal vise varsler knyttet til aktuell uke og komponent og markere komponenter med avvik som kritiske.
- Systemet skal støtte ny opplasting etter en endret MPS og vise før/etter-forskjeller mot forrige kjøring.
- Når en ny eller endret ferdigvareplan legges inn i MPS, skal før/etter-resultatet vise hvilke materialmangler og bestillingsforslag som oppstår eller endres for å dekke planen, med mengder og nødvendige frigivelsesuker.
- Systemet skal varsle dersom ledetid eller planleggingshorisont gjør at materialer ikke kan skaffes tidsnok til planlagt produksjonsuke.
- MPS-grafen skal gjøre planlagt produksjonsmengde per uke synlig.

**Varseltyper fra gjeldende brief:** bruk av sikkerhetslager, bestilling forsinket, mottak forsinket og ledetid som overskrider planleggingshorisonten.

### F3. Lagerbasert produksjonskapasitet, uavhengig av MPS

Brukeren skal kunne få en egen beregning av hvor mange enheter av ferdigproduktet materialene på lager kan støtte, uten at resultatet bestemmes av MPS-planen. Beregningen skal kunne kjøres alene eller samtidig med MPS-materialplanen fra de samme opplastede grunnlagsdataene.

**Foreløpige funksjonskrav:**

- Systemet skal beregne mulig produksjonsmengde for ferdigproduktet ut fra materialbeholdning og flernivå-BOM.
- Kapasiteten skal oppgis som antall komplette ferdigvarer. Systemet skal beregne hvor mange hele enheter hvert materiale støtter gjennom hele flernivå-BOM-en, og la materialet med lavest kapasitet bestemme totalen.
- Systemet skal reservere sikkerhetslageret; bare beholdning utover sikkerhetslageret regnes som tilgjengelig for ny produksjon.
- Systemet skal vise kapasiteten som kan produseres fra fysisk beholdning nå separat fra den kapasiteten som blir tilgjengelig når åpne bestillinger mottas.
- Hvis kunden har registrert åpne bestillinger, skal systemet ta mengde og forventet mottaksuke med i den tidsavhengige kapasitetsberegningen. Bestilt materiale skal ikke regnes som tilgjengelig før mottaksuken.
- Hvis kunden ikke har åpne bestillinger å registrere, skal beregningen fortsatt kunne kjøres på fysisk beholdning alene.
- Systemet skal identifisere materialet eller materialene som begrenser produksjonsmengden.
- Lagerkapasitetsresultatet skal vises i sitt eget panel på samme resultatside som MPS-materialplanen når begge beregningene kjøres, slik at brukeren ikke forveksler lagerkapasitet med planlagt produksjon.
- Lagerkapasitetspanelet skal være en tabell som viser fysisk beholdning, sikkerhetslager, disponibel beholdning og innkommende mengde fra forventet mottaksuke.

- **Avklart:** Åpne/fremtidige bestillinger er valgfri input. De kan tas med fra forventet mottaksuke, mens kapasitet fra fysisk beholdning nå vises separat.
- **Avklart:** Sikkerhetslager reserveres; kun beholdning utover sikkerhetslager kan brukes til produksjon.

## 5. Foreløpige suksesskriterier

- MPS-beregningen samsvarer 100 % med manuelt kontrollerte fasitdata for godkjente testtilfeller.
- Kjente inputfeil oppdages før beregning og beskrives med forståelige feilmeldinger.
- Hver kjent eksepsjonstype utløses riktig i sine testtilfeller, uten falske positive eller oversette varsler.
- Lagerkapasitetsberegningen samsvarer med manuelt beregnede fasitverdier, og peker ut begrensende materiale.
- Lagerkapasiteten skal være et helt antall komplette ferdigvarer, begrenset av knappeste materiale på tvers av alle BOM-nivåer, og samsvare med manuelt kontrollerte testdata.
- Lagerkapasitetsberegningen trekker sikkerhetslageret fra tilgjengelig beholdning og samsvarer med fasit for tilfeller med og uten sikkerhetslager.
- Når åpne bestillinger er registrert, skal lagerkapasiteten øke fra forventet mottaksuke og ikke før; resultatet skal samsvare med manuelt kontrollerte testdata.
- MPS-grafen skal vise riktig planlagt produksjonsmengde per uke, og lagertabellen skal vise riktig disponibel beholdning etter fratrekk av sikkerhetslager og med mottak først fra forventet uke.
- Tre av tre testpersoner uten hjelp kan finne kritisk komponent, bestillingsmengde og bestillingsuke etter en kort introduksjon.
- Ved endret MPS viser før/etter-visningen nøyaktig hvilke bestillingsforslag og varsler som er nye, endret, fjernet, kommet til eller forsvunnet.
- Når MPS planlegger ferdigvarer uten tilstrekkelige materialer i disponibelt lager eller planlagte mottak, viser systemet korrekt materialmangel, bestillingsmengde og frigivelsesuke, eller varsler tydelig hvis materialene ikke kan skaffes til planlagt produksjonsuke.

## 6. Foreløpig omfang

**V1:** Ett ferdigprodukt, flernivå-BOM, Excel-mal som input, 8–12 ukers planleggingshorisont, MPS-basert materialplan med lot-for-lot, avviksmeldinger, før/etter-sammenligning og separat beregning av lagerbasert produksjonskapasitet.

**Planlagt utvidelse etter kjernen:** Fast partistørrelse som valgbar bestillingsregel, etter at kjernen er ferdig og testet.

**Utenfor V1 ifølge briefen:** Flere produkter samtidig, innlogging, flere bedrifter/datasett lagret i systemet og andre bestillingsregler enn de som uttrykkelig er tatt inn i V1.

## 7. Avklaringer før kravene ferdigstilles

Punktene om lagerkapasitet og resultatsidens oppsett som ble avklart i coaching-samtalen, er tatt inn i kravene over. V1 er avgrenset til ett ferdigprodukt ifølge product brief.

**Avklart:** MPS er ønsket plan for ferdigvareproduksjon og kan planlegge produksjon selv om nødvendige materialer ikke finnes i disponibelt lager, sikkerhetslager eller planlagte mottak. MRP skal vise materialmangler og foreslå hva og når som må bestilles. Åpne leverandørbestillinger registreres separat som planlagte mottak i Excel-malen.

---

## Kildegrunnlag

Dette delutkastet er basert på gjeldende product brief og addendum, faglærertilbakemeldingen, sensorveiledningen for del 1, brukerens presisering i denne PRD-sesjonen og researchfila `Downloads/research.md`. Researchens anbefalinger er ikke behandlet som vedtatte produktkrav uten bekreftelse.
