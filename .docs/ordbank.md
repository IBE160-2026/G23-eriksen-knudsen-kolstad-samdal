---
title: COSI - MRP Ordbank
status: forslag
created: 2026-10-21
updated: 2026-10-30
---

# Ordbank: COSI - MRP

Felles begreper for brief, PRD, arkitektur, stories, Excel-mal, kode og app. Bruk begrepet i første kolonne. Ordene i «Ikke bruk» er synonymer som finnes i dokumentene i dag. Engelsk fagbegrep står i kursiv i parentes, så det er lett å slå opp i MRP-litteraturen. Bruk det norske begrepet i dokumenter og kode.

Forslaget bygger på Excel-malen for flernivå stykkliste (Sebastian, 2026-10-23) og på testdataene med fasit for testeksempel 01 og 02 (fasit for 02 kontrollert for hånd 2026-10-24). Punkter merket **[BESLUTNING]** må gruppen avgjøre. Forkortelser og begreper om prosjektet og verktøyet er hentet fra ordboken til product brief (Sebastian, 2026-10-30), som er slått sammen inn her.

## Forkortelser

| Forkortelse | Står for | Forklaring |
|---|---|---|
| BMAD | – | Metoden og verktøysettet vi planlegger med: product brief → PRD → arkitektur → epics og stories. |
| BOM | Bill of Materials | Stykkliste. Se *Stykkliste*. |
| COSI - MRP | – | Navnet på verktøyet vi lager. |
| ERP | Enterprise Resource Planning | Stort, integrert forretningssystem som dekker blant annet økonomi, lager, innkjøp og produksjon. MRP er bare én del av et ERP-system. |
| H | Horisont | Se *Horisont*. |
| IBE160 | – | Emnet ved Høgskolen i Molde som prosjektet er en del av. |
| L | Ledetid | Se *Ledetid*. |
| L4L | Lot-for-lot | Se *Lot-for-lot*. |
| MPS | Master Production Schedule | Hovedproduksjonsplan: hvor mange ferdigprodukter som skal være ferdige hver uke. Brukes ikke lenger i malen, se *Prognostiserte behov* og merknad 2. |
| MRP | Material Requirements Planning | Materialbehovsplanlegging: metode som ut fra prognostiserte behov, stykkliste, lagerbeholdning og ledetid beregner hva som må bestilles eller produseres, hvor mye og når. |
| MRP II | Manufacturing Resource Planning | Videreutvikling av MRP som også tar med kapasitet, økonomi og andre ressurser. Nevnt i tilbakemeldingen fra faglærer. |
| PRD | Product Requirements Document | Kravdokument som bygger på briefen og beskriver i detalj hva verktøyet skal gjøre. |
| SS | Sikkerhetslager (safety stock) | Se *Sikkerhetslager*. |
| v1 | Versjon 1 | Første versjon av verktøyet, det vi leverer i kurset. |

## Inndata

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Excel-mal | Den faste filen `COSI-MRP-mal.xlsx` som brukeren fyller ut og laster opp. Arkene er Stykkliste, Prognostiserte behov og Planlagte mottak. | fil, regneark (om malen) |
| Stykkliste (BOM, *multi-level BOM*) | Ferdigproduktet og alle delene det består av, én rad per del, ovenfra og ned. Flernivå (deler kan selv bestå av andre deler), med nivå 0, .1 og ..2 i v1. | – |
| Del | Én rad i stykklisten, uansett nivå og type. **[BESLUTNING]** Se merknad 1. | komponent (som samlebegrep), vare |
| Ferdigprodukt (*end item*) | Delen på nivå 0, med type Ferdigvare. Ett per fil. | produkt, Produkt A |
| Varenummer | Unik ID for en del, f.eks. 300-002 (varegruppe-løpenummer). Samme del har samme varenummer overalt i stykklisten. | Komponent-ID, komponent_id, K01 |
| Beskrivelse | Navnet på delen, f.eks. «Skruesett M6». | navn |
| Nivå | Hvor i stykklisten delen står: 0 = ferdigproduktet, .1 = hovedkomponent, ..2 = del under en hovedkomponent. | – |
| Delen over (overordnet del) | Nærmeste del på nivået over. En del på ..2 tilhører nærmeste .1 over seg. | forelder, parent |
| Underkomponent | En del som står rett under en annen del i stykklisten. | barn, child |
| Antall (*quantity per*) | Hvor mange av delen som trengs per enhet av delen over. Heltall ≥ 1. Fylles ikke ut for nivå 0. | antall per ferdigprodukt, antall per A, antall per produkt |
| Type | Ferdigvare, Delmontering, Komponent (Kjøpes inn), Komponent (Produseres selv), Råvare (Kjøpes inn) eller Råvare (Produseres selv). En del som kjøpes inn kan ikke ha underkomponenter. | – |
| Delmontering | En del som settes sammen internt av underkomponenter, f.eks. Sete. | sammenstilling, modul |
| Prognostiserte behov | Antall ferdigprodukter per uke (arket i malen). **[BESLUTNING]** Se merknad 2. | MPS, prognose, produksjonsplan |
| Lagerbeholdning (*on-hand inventory*) | Antall på lager ved starten av uke 1. Fylles ut første gang varenummeret står. | startlager, lagerstatus |
| Sikkerhetslager (SS, *safety stock*) | Laveste forventede lagerbeholdning planen skal holde. Fylles ut første gang varenummeret står. | buffer |
| Ledetid (L, *lead time*) | Hele uker fra en ordre frigis til den mottas: innkjøpstid for deler som kjøpes inn, produksjonstid for deler som produseres selv. Heltall ≥ 1, 0 er lov for ferdigproduktet. | innkjøpstid (alene), leveringstid |
| Planlagt mottak (*scheduled receipt*) | Et mottak som allerede er bestilt hos leverandør, eller en produksjonsordre som allerede er startet, med varenummer, uke og antall. | registrert mottak, innkommende ordre |
| Grunnlagsdata | Alle inndataene beregningen bygger på: stykkliste, prognostiserte behov, lagerbeholdning, sikkerhetslager, ledetid og planlagte mottak. | – |

## Tid

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Uke (t) | Én periode, nummerert 1 til H. | periode |
| Uke 1 | Første uke i horisonten. | planstart |
| Horisont (H, *planning horizon*) | Antall sammenhengende utfylte uker i Prognostiserte behov fra uke 1. 8–12. | planhorisont, planleggingshorisont |

## Beregning (per del og uke)

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Nivå-for-nivå-beregning | Beregningen gjøres ovenfra og ned. Planlagte ordrefrigivelser for en del, ganget med antall, blir bruttobehov for underkomponentene. | eksplosjon (alene) |
| Bruttobehov (*gross requirements*) | Nivå 0: prognostiserte behov(t). Andre nivåer: summen av planlagt ordrefrigivelse(t) × antall for alle stedene delen står i stykklisten. | behov (alene) |
| Disponibel beholdning | Forventet lagerbeholdning(t−1) + planlagte mottak(t) − bruttobehov(t). | tilgjengelig, disponibel (alene) |
| Nettobehov (*net requirements*) | maks(0, SS − disponibel beholdning). | – |
| Planlagt ordremottak (*planned order receipt*) | Mengden en foreslått ordre skal levere i uke t. Beregnet, ikke bestilt. | planlagt mottak (om beregnet mengde) |
| Planlagt ordrefrigivelse (*planned order release*) | Mengden som må bestilles eller settes i produksjon i uke t − L. | planlagt frigivelse, planlagt bestilling |
| Frigi | Å sende en ordre: bestille fra leverandør eller starte produksjon internt. | – |
| Offset | Tidsforskyvning bakover med ledetiden: en ordre som må være mottatt i uke 6 med ledetid 2, må frigis i uke 4. | – |
| Forventet lagerbeholdning (*projected on-hand*) | Disponibel beholdning + planlagt ordremottak. | forventet lager, forventet beholdning, beregnet lager |
| Forfalt frigivelse | En planlagt ordrefrigivelse der t − L < 1. Den legges i uke 1 og blir bruttobehov i uke 1 for underkomponentene. | bestilling før planstart, uke 0 |
| Bestillingsforslag | Det brukeren handler på: del, frigivelsesuke og mengde. | – |
| Bestillingsregel (*lot sizing rule*) | Regelen som gjør nettobehov om til planlagt ordremottak. | – |
| Lot-for-lot (L4L) | Planlagt ordremottak = nettobehov. | – |
| Fast partistørrelse (*fixed order quantity*) | Planlagt ordremottak rundes opp til et helt antall partier. Planlagt utvidelse. | partistørrelse (alene) |

## Eksepsjoner

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Eksepsjon (*exception message*) | Et varsel om avvik for en del, i en uke eller for hele delen. **[BESLUTNING]** Se merknad 3. | eksepsjonsmelding, exception |
| Bestilling forsinket | Forfalt frigivelse og disponibel beholdning < 0. Leveransen blir forsinket til kunden (ferdigproduktet) eller til produksjonen av delen over. | Bestilling forsinket – nytt bestillingsforslag |
| Bruk av sikkerhetslager | Forfalt frigivelse og 0 ≤ disponibel beholdning < SS. | Under sikkerhetslager |
| Mottak forsinket | Nettobehov > 0 og et planlagt mottak ligger i en senere uke. | – |
| Ledetid overskrider horisont | L ≥ H. Gjelder hele delen. | Innkjøpstid overskrider horisont |
| Kritisk del | En del med minst én eksepsjon. Markeres i resultattabellen, så brukeren raskt ser hvor det må handles. | kritisk komponent (se merknad 1) |
| Avvik | At planen ikke går opp for en del, f.eks. at lageret går under sikkerhetslager eller at en bestilling kommer for sent. Avvik gir eksepsjoner. | – |
| Falsk positiv / falsk negativ | Feil i eksepsjonene: en eksepsjon uten avvik (falsk positiv), eller et avvik uten eksepsjon (falsk negativ). | – |

## App og test

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Beregningsmotor | Delen av appen som gjør selve MRP-beregningen. Holdes adskilt fra Excel-lesing og visning, så den kan testes alene. | – |
| Datamodell | Hvordan dataene i appen er strukturert: hvilke typer data som finnes (del, stykklisterad, prognostiserte behov osv.) og hvordan de henger sammen. | – |
| Datatype | Hva slags verdi en celle skal inneholde, f.eks. heltall eller tekst. Excel-malen valideres for riktige datatyper. | – |
| Parse | Å lese og tolke en fil (her Excel-malen) så appen kan bruke dataene. | – |
| Validering | Kontrollen av at Excel-malen har riktig struktur, ingen tomme påkrevde celler og riktige datatyper før beregningen starter. Feil gir valideringsfeil. | – |
| Kontroll | Kolonnen i Stykkliste som viser hva som mangler eller ikke stemmer i hver rad, før opplasting. | – |
| Kjøring | Én beregning fra én opplastet Excel-mal. | beregning (om hele kjøringen) |
| Valideringsfeil | En feil i filen som appen finner, og som stopper beregningen. Oppgir ark, rad og årsak. | feilmelding |
| Resultattabell | MRP-tabellen per del og uke, med eksepsjonene markert. | MRP-tabell, resultatside, oversikt |
| Før/etter-sammenligning | Forskjellen i bestillingsforslag og eksepsjoner mellom forrige og ny kjøring. | – |
| Testeksempel | Et utfylt datasett med fasit, i `testdata/`. | øvingseksempel (se merknad 4) |
| Fasit | Manuelt kontrollert forventet resultattabell og eksepsjonsliste for et testeksempel. | – |
| Grensetilfelle (*edge case*) | Testtilfelle i ytterkanten av det normale, f.eks. behov i uke 1, eller ledetid lik eller lengre enn horisonten. | – |

## Prosjekt og omfang

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Product brief | Kort dokument som beskriver problemet, brukerne, løsningen og omfanget. Første steg i BMAD-flyten, før PRD og arkitektur. | – |
| Addendum | Tilleggsdokument til briefen med detaljer som hører hjemme i senere dokumenter (arkitektur, implementeringsplan), f.eks. faseplanen. Ved avvik gjelder briefen. | – |
| Personavhengighet | At viktig kunnskap eller arbeid bare finnes hos én person, så bedriften blir sårbar når personen er borte. Problemet verktøyet skal løse. | – |
| Videreutvikling | Funksjonalitet som bevisst ikke er med i v1, men som verktøyet er designet for å kunne få senere. | – |
| Hva-om-scenario (*what-if*) | Alternativ versjon av planen der en forutsetning endres for å se konsekvensene. Sammenligning av flere scenarier side om side er videreutvikling. | – |

## Merknader

1. **Del eller komponent?** Malen og testdataene bruker «del» om alle radene, fordi «Komponent» er en av verdiene i Type. Brief, PRD og Veien videre i malen bruker «komponent» som samlebegrep («per uke og komponent», «kritisk komponent»). Forslag: «del» som samlebegrep og «komponent» bare om typen.
2. **Prognostiserte behov eller MPS?** Malen og testdataene har gått over til «Prognostiserte behov» (tidligere MPS). Brief bruker fortsatt MPS. Forslag: følge malen og oppdatere brief og PRD.
3. **Eksepsjon eller varsel?** «Eksepsjon» er fagbegrepet og brukes i PRD og fasit. Brief og Veien videre i malen bruker «varsel» om det brukeren ser. Forslag: «eksepsjon» i dokumenter og kode, «varsel» bare i appens tekst.
4. **Øvingseksempelet** (3 komponenter, 4 uker) er utenfor omfanget og bruker gamle begreper (tilgjengelig, registrert mottak, innkjøpstid, uke 0). Det kan kalles testeksempel 00 hvis det beholdes.

## Avvik mellom malen og PRD-en

PRD-en (Sebastian, 2026-10-19) ble skrevet før malen ble bygd om for flernivå, og må oppdateres:

| Tema | PRD | Mal og testdata |
|---|---|---|
| Stykkliste | Enkeltnivå, ark Produkt og Komponenter | Flernivå, ett ark Stykkliste |
| ID | Komponent-ID (K01 …) | Varenummer (300-001 …) |
| Tid | Innkjøpstid | Ledetid (innkjøps- eller produksjonstid) |
| Eksepsjon | Innkjøpstid overskrider horisont | Ledetid overskrider horisont |
| Antall | Antall per ferdigprodukt | Antall per enhet av delen over |
| Antall deler | 1–500, oppgitt i Produkt-arket | Inntil 1000 rader i Stykkliste, ikke oppgitt |
