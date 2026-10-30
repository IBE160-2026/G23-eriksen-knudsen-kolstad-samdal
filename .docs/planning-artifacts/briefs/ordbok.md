---
title: COSI - MRP Ordbok
status: draft
created: 2026-10-30
updated: 2026-10-30
---

# Ordbok: COSI - MRP

Forklaring av ord, uttrykk og forkortelser som brukes i product brief (`brief-COSI - MRP-2026-09-13/brief.md`) og addendumet. Engelsk fagbegrep står i parentes der det finnes, slik at det er lett å slå opp i MRP-litteraturen. Ordboken oppdateres når nye begreper tas i bruk.

## Forkortelser

| Forkortelse | Står for | Forklaring |
|---|---|---|
| **BOM** | Bill of Materials | Stykkliste: oversikt over hvilke komponenter et produkt består av, og hvor mange av hver. Se *Stykkliste*. |
| **BMAD** | – | Metoden og verktøysettet vi planlegger med: product brief → PRD → arkitektur → epics og stories. |
| **COSI - MRP** | – | Navnet på verktøyet vi lager. |
| **ERP** | Enterprise Resource Planning | Stort, integrert forretningssystem som dekker blant annet økonomi, lager, innkjøp og produksjon. MRP er bare én del av et ERP-system. |
| **IBE160** | – | Emnet ved Høgskolen i Molde som prosjektet er en del av. |
| **MPS** | Master Production Schedule | Hovedproduksjonsplan: hvor mange enheter av ferdigproduktet som skal være ferdige i hver uke. MPS er utgangspunktet for hele MRP-beregningen. |
| **MRP** | Material Requirements Planning | Materialbehovsplanlegging: metode som ut fra MPS, stykkliste, lagerstatus og ledetid beregner hva som må bestilles eller produseres, hvor mye og når. |
| **MRP II** | Manufacturing Resource Planning | Videreutvikling av MRP som også tar med kapasitet, økonomi og andre ressurser. Nevnt i tilbakemeldingen fra faglærer. |
| **PRD** | Product Requirements Document | Kravdokument som bygger på briefen og beskriver i detalj hva verktøyet skal gjøre. |
| **v1** | Versjon 1 | Første versjon av verktøyet, det vi leverer i kurset. |

## Begreper

| Begrep | Forklaring |
|---|---|
| **Addendum** | Tilleggsdokument til briefen med detaljer som hører hjemme i senere dokumenter (arkitektur, implementeringsplan), f.eks. faseplanen. Ved avvik gjelder briefen. |
| **Antall per enhet** (quantity per) | Hvor mange av en komponent som går med for å lage én enhet av komponenten eller produktet over i stykklisten. |
| **Avvik** | Situasjon der planen ikke går opp, f.eks. at lageret går under sikkerhetslager eller at en bestilling kommer for sent. Avvik fører til eksepsjonsmeldinger. |
| **Beregningsmotor** | Den delen av verktøyet som gjør selve MRP-beregningen. Holdes adskilt fra Excel-lesing og visning, slik at den kan testes alene. |
| **Bestillingsforslag** | Verktøyets forslag til en bestilling eller produksjonsordre: hvilken komponent, hvor mye, og i hvilken uke den må frigis. |
| **Bestillingsregel** (lot sizing rule) | Regelen som bestemmer hvor mye som bestilles når det er nettobehov. I v1: lot-for-lot, med fast partistørrelse som planlagt utvidelse. |
| **Bruttobehov** (gross requirements) | Det totale behovet for en komponent i en uke, før lager og mottak er trukket fra. For ferdigproduktet kommer det fra MPS. For komponenter lenger ned er det planlagte ordrefrigivelser for overordnet komponent ganget med antall per enhet. |
| **Datamodell** | Hvordan dataene i systemet er strukturert: hvilke typer data som finnes (produkt, komponent, BOM-linje, MPS osv.) og hvordan de henger sammen. |
| **Datatype** | Hva slags verdi en celle skal inneholde, f.eks. heltall, desimaltall eller tekst. Excel-malen valideres for riktige datatyper. |
| **Eksepsjonsmelding / varsel** (exception message) | Automatisk melding fra verktøyet om at noe i planen krever handling. V1 har fire typer, se *Eksepsjonstyper* under. |
| **Excel-mal** | Det faste Excel-arket brukeren fyller ut med grunnlagsdata og laster opp. Malen gir dataene en fast struktur som verktøyet kan lese. |
| **Falsk positiv / falsk negativ** | Feil i varslingen: et varsel som gis selv om det ikke er avvik (falsk positiv), eller et avvik som ikke gir varsel (falsk negativ). |
| **Fasit / fasitsvar / fasittabell** | Manuelt utregnede, kontrollerte resultater for testeksempelet. Verktøyets resultater sammenlignes med fasiten for å bevise at beregningen er riktig. |
| **Fast partistørrelse** (fixed order quantity) | Bestillingsregel der det alltid bestilles i hele partier av en fast størrelse. Bestilt mengde rundes opp, og overskuddet blir liggende på lager. Planlagt utvidelse i v1. |
| **Ferdigprodukt** (end item) | Produktet som selges til kunden, øverst i stykklisten. V1 håndterer ett ferdigprodukt. |
| **Flernivå BOM** (multi-level BOM) | Stykkliste der komponenter selv består av andre komponenter, i flere nivåer. Motsatt: *enkeltnivå BOM*, der alle komponenter ligger rett under ferdigproduktet. V1 testes med 3 nivåer. |
| **Forventet lagerbeholdning** (projected on-hand) | Hvor mye som forventes å ligge på lager ved slutten av hver uke: forrige ukes beholdning + mottak − bruttobehov. |
| **Frigi / ordrefrigivelse** | Å sende en ordre: bestille fra leverandør eller starte produksjon internt. |
| **Før/etter-sammenligning** | Visning som etter en ny opplasting viser hva som er endret mot forrige kjøring: nye, endrede og fjernede bestillingsforslag, og varsler som har kommet til eller forsvunnet. |
| **Grensetilfelle** (edge case) | Testtilfelle i ytterkanten av det normale, f.eks. behov i uke 1, eller ledetid lik eller lengre enn horisonten. |
| **Grunnlagsdata** | Inndataene beregningen bygger på: MPS, stykkliste, lagerstatus, planlagte mottak, ledetid og sikkerhetslager. |
| **Horisont / planleggingshorisont** (planning horizon) | Tidsrommet planen dekker. I v1: 8–12 uker. |
| **Hva-om-scenario** (what-if) | Alternativ versjon av planen der man endrer en forutsetning for å se konsekvensene. Sammenligning av flere scenarier side om side er videreutvikling. |
| **Innkjøpstid** | Tiden fra en bestilling sendes til leverandøren til varen er mottatt. En del av begrepet *ledetid*. |
| **Kjøring** | Én gjennomføring av beregningen på et opplastet datasett. |
| **Komponent** | En del, et råmateriale eller en delmontasje som inngår i ferdigproduktet. Kan kjøpes inn eller settes sammen internt. |
| **Kritisk komponent** | Komponent med minst ett varsel. Markeres i tabellen så brukeren raskt ser hvor det må handles. |
| **Lagerstatus** (on-hand inventory) | Hvor mye av hver komponent som ligger på lager ved starten av horisonten. |
| **Ledetid** (lead time) | Tiden fra en ordre frigis til den er klar: innkjøpstid for komponenter som kjøpes inn, produksjonstid for komponenter som settes sammen internt. |
| **Lot-for-lot** (L4L) | Bestillingsregel der det bestilles nøyaktig så mye som nettobehovet i uken. Bestillingsregelen i kjernen av v1. |
| **Nettobehov** (net requirements) | Det som mangler i en uke etter at lager og planlagte mottak er brukt, med hensyn til sikkerhetslageret. Nettobehov fører til en planlagt ordre. |
| **Nettobehovsberegning** | Selve utregningen fra bruttobehov til nettobehov, uke for uke og komponent for komponent. |
| **Nivå for nivå** | Beregningsrekkefølgen i flernivå BOM: man regner ferdig ett nivå før man går til nivået under, fordi behovet nedover kommer fra planlagte ordrefrigivelser over. |
| **Offset** | Tidsforskyvning bakover med ledetiden: en ordre som må være mottatt i uke 6 med ledetid 2 uker, må frigis i uke 4. |
| **Overordnet komponent** (parent) | Komponenten eller produktet rett over i stykklisten, som en komponent inngår i. |
| **Parse** | Å lese og tolke en fil (her Excel-malen) slik at programmet kan bruke dataene. |
| **Partistørrelse** (lot size) | Mengden som bestilles eller produseres i én ordre. |
| **Personavhengighet** | At viktig kunnskap eller arbeid bare finnes hos én person, så bedriften blir sårbar når personen er borte. Problemet verktøyet skal løse. |
| **Planlagt mottak** (scheduled receipt) | En ordre som allerede er sendt, og som kommer i en kjent uke. Ligger i grunnlagsdataene. |
| **Planlagt ordremottak** (planned order receipt) | Mottak verktøyet foreslår for å dekke nettobehov. Ikke bestilt ennå. |
| **Planlagt ordrefrigivelse** (planned order release) | Uken den foreslåtte ordren må frigis: planlagt ordremottak forskjøvet bakover med ledetiden. |
| **Produksjonstid** | Tiden det tar å sette sammen en komponent internt. En del av begrepet *ledetid*. |
| **Product brief** | Kort dokument som beskriver problemet, brukerne, løsningen og omfanget. Første steg i BMAD-flyten, før PRD og arkitektur. |
| **Sikkerhetslager** (safety stock) | Ekstra lagerbeholdning som buffer mot uventet høy etterspørsel eller forsinkede leveranser. Planen prøver å holde lageret over dette nivået. |
| **Stykkliste** | Norsk for BOM. Se *BOM* og *Flernivå BOM*. |
| **Testcase / testeksempel** | Konstruert datasett med kjent fasit, brukt til å teste verktøyet. Testeksempelet er en fiktiv produsent med 5–10 komponenter på 3 nivåer over 8–12 uker. |
| **Validering** | Kontroll av at Excel-malen har riktig struktur, ingen tomme påkrevde celler og riktige datatyper før beregningen starter. |
| **Videreutvikling** | Funksjonalitet som bevisst ikke er med i v1, men som verktøyet er designet for å kunne få senere. |

## Eksepsjonstyper i v1

| Eksepsjonstype | Forklaring |
|---|---|
| **Bruk av sikkerhetslager** | Lageret havner mellom 0 og sikkerhetslageret i en uke, på grunn av bruttobehovet eller forsinkede leveranser. |
| **Bestilling forsinket** | Bruttobehovet i en uke kan ikke dekkes i tide, fordi bestillingen måtte vært frigitt før første uke i horisonten. Lageret går under 0. |
| **Mottak forsinket** | Det er nettobehov i en uke, mens et planlagt mottak først kommer i en senere uke. Mottaket må fremskyndes. |
| **Ledetid overskrider horisont** | Ledetiden for en komponent er like lang som eller lengre enn horisonten, så ingen ny bestilling kan frigis i tide. Gjelder komponenten, uavhengig av uke. |
