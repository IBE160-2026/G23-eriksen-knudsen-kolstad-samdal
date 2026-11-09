---
title: COSI - MRP Ordbank
status: forslag
created: 2026-10-21
updated: 2026-11-09
---

# Ordbank: COSI - MRP

Felles begreper for brief, PRD, arkitektur, stories, Excel-mal, kode og app. Bruk begrepet i første kolonne. Ordene i «Ikke bruk» er synonymer som finnes i dokumentene i dag. Engelsk fagbegrep står i kursiv i parentes, så det er lett å slå opp i MRP-litteraturen. Bruk det norske begrepet i dokumenter og kode.

Forslaget bygger på Excel-malen for flernivå stykkliste (Sebastian, 2026-10-23) og på testdataene med fasit for testeksempel 01 og 02 (fasit for 02 kontrollert for hånd 2026-10-24). Punktene som var merket **[BESLUTNING]**, ble avgjort 2026-11-05 (se Merknader og `prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md`). Forkortelser og begreper om prosjektet og verktøyet er hentet fra ordboken til product brief (Sebastian, 2026-10-30), som er slått sammen inn her.

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
| MPS | Master Production Schedule | Hovedproduksjonsplan: hvor mange ferdigprodukter som skal være ferdige hver uke. Står bare i parentes første gang i et dokument: «Prognostiserte behov (MPS)». Se *Prognostiserte behov* og merknad 2. |
| MRP | Material Requirements Planning | Materialbehovsplanlegging: metode som ut fra prognostiserte behov, stykkliste, lagerbeholdning og ledetid beregner hva som må bestilles eller produseres, hvor mye og når. |
| MRP II | Manufacturing Resource Planning | Videreutvikling av MRP som også tar med kapasitet, økonomi og andre ressurser. Nevnt i tilbakemeldingen fra faglærer. |
| PRD | Product Requirements Document | Kravdokument som bygger på briefen og beskriver i detalj hva verktøyet skal gjøre. |
| SS | Sikkerhetslager (safety stock) | Se *Sikkerhetslager*. |
| v1 | Versjon 1 | Første versjon av verktøyet, det vi leverer i kurset. |

## Inndata

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Excel-mal | Den faste filen `COSI-MRP-mal.xlsx` som brukeren fyller ut og laster opp. Arkene som leses inn, er Stykkliste, MPS og Planlagte mottak. | fil, regneark (om malen) |
| Stykkliste (BOM, *multi-level BOM*) | Ferdigproduktet og alle delene det består av, én rad per del, ovenfra og ned. Flernivå (deler kan selv bestå av andre deler), med nivå 0, .1 og ..2 i v1. | – |
| Del | Én rad i stykklisten, uansett nivå og type. Samlebegrepet i dokumenter, kode og app (besluttet 2026-11-05, se merknad 1). | komponent (som samlebegrep), vare |
| Ferdigprodukt (*end item*) | Delen på nivå 0, med type Ferdigvare. Ett per fil. | produkt, Produkt A |
| Varenummer | Unik ID for en del, f.eks. 300-002 (varegruppe-løpenummer). Samme del har samme varenummer overalt i stykklisten. | Komponent-ID, komponent_id, K01 |
| Beskrivelse | Navnet på delen, f.eks. «Skruesett M6». | navn |
| Nivå | Hvor i stykklisten delen står: 0 = ferdigproduktet, .1 = hovedkomponent, ..2 = del under en hovedkomponent. | – |
| Delen over (overordnet del) | Nærmeste del på nivået over. En del på ..2 tilhører nærmeste .1 over seg. | forelder, parent |
| Underdel | En del som står rett under en annen del i stykklisten. | underkomponent, barn, child |
| Felles del | En del som står flere steder i stykklisten, f.eks. skruer i både sete og rygg. Samme varenummer, beskrivelse og type hver gang. Lager, sikkerhetslager og ledetid står bare første gang, og delen beregnes én gang (PRD FR-28). | – |
| Antall (*quantity per*) | Hvor mange av delen som trengs per enhet av delen over. Heltall ≥ 1. Fylles ikke ut for nivå 0. | antall per ferdigprodukt, antall per A, antall per produkt |
| Type | Ferdigvare, Komponent (Kjøpes inn) eller Komponent (Produseres selv). Ferdigvare brukes bare på nivå 0. En del som kjøpes inn, kan ikke ha underkomponenter. «Komponent» brukes bare om typen (besluttet 2026-11-05, se merknad 1 og 5). | Delmontering, Råvare (som typer) |
| Prognostiserte behov | Antall ferdigprodukter per uke. Fylles ut i arket MPS i malen (arket beholder navnet, besluttet 2026-11-05). Brukes i malen og appen. I dokumenter skrives «Prognostiserte behov (MPS)» første gang (besluttet 2026-11-05, se merknad 2). | MPS (alene), prognose, produksjonsplan |
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
| Disponibel beholdning | Beholdning(t−1) + planlagte mottak(t) − bruttobehov(t), der beholdningen er forventet lagerbeholdning(t−1) pluss fremskyndede mottak som ennå ikke er kommet (PRD FR-6). | tilgjengelig, disponibel (alene) |
| Nettobehov (*net requirements*) | maks(0, SS − disponibel beholdning). | – |
| Planlagt ordremottak (*planned order receipt*) | Mengden en foreslått ordre skal levere i uke t. Beregnet, ikke bestilt. | planlagt mottak (om beregnet mengde) |
| Planlagt ordrefrigivelse (*planned order release*) | Mengden som må bestilles eller settes i produksjon i uke t − L. | planlagt frigivelse, planlagt bestilling |
| Frigi | Å sende en ordre: bestille fra leverandør eller starte produksjon internt. | – |
| Offset | Tidsforskyvning bakover med ledetiden: en ordre som må være mottatt i uke 6 med ledetid 2, må frigis i uke 4. | – |
| Ledetid fra ferdigproduktet | For en del: den største summen av L langs en sti i stykklisten fra ferdigproduktet ned til og med delen. Brukes i «Ledetid overskrider horisont» (PRD FR-9). Ikke det samme som kumulativ ledetid, som regnes nedover fra delen. | ledetid fra toppen |
| Kumulativ ledetid (*cumulative lead time*) | Den lengste summen av ledetider langs en sti fra delen ned gjennom stykklisten: delens egen L pluss den største kumulative ledetiden blant underkomponentene. For en del uten underkomponenter er den lik L. Kilde: ASCM Dictionary, 18. utg., s. 47. | samlet ledetid, stablet ledetid, kritisk sti |
| Lavnivåkode (*low-level code*) | Det laveste nivået en del står på i stykklisten. Nettobehovet for delen beregnes først når alle bruttobehov ned til dette nivået er beregnet, så en felles del beregnes én gang. Kilde: ASCM Dictionary, 18. utg., s. 109. | laveste nivå (alene) |
| Omplanleggingsantakelse (*rescheduling assumption*) | MRP antar at et planlagt mottak kan fremskyndes lettere enn en ny ordre kan frigis og mottas. Planlagt ordremottak lages derfor først når alle planlagte mottak er brukt. Kilde: ASCM Dictionary, 18. utg., s. 164. Se research om MRP-regler (2026-11-02). | – |
| Omplanleggingshorisont (*rescheduling horizon*) | Grense for hvor langt fram i horisonten et planlagt mottak kan fremskyndes fra. Ikke med i v1, der et mottak kan fremskyndes fra hvilken som helst senere uke (PRD FR-6, §7.2). | – |
| Frysing (*time fence*) | En periode nærmest i tid der planen ikke endres automatisk. Ikke med i v1, fordi appen gjør én kjøring om gangen (PRD addendum). | – |
| Dempingsterskel (*dampener*) | En grense som hindrer eksepsjoner for små avvik, f.eks. et mottak som kommer bare litt tidlig. Ikke med i v1 (PRD addendum). | – |
| Nervøsitet i planen (*system nervousness*) | At planen endrer seg mye fra kjøring til kjøring på grunn av små endringer i inndataene. | – |
| Fremskyndet mottak | Et planlagt mottak som beregningen regner med fra en tidligere uke enn det er lagt inn i, fordi det trengs da. Regnes med én gang, fra uken det er fremskyndet til (PRD FR-6). | – |
| Forventet lagerbeholdning (*projected on-hand*) | Disponibel beholdning + planlagt ordremottak − fremskyndede mottak som ennå ikke er kommet. Det er lagerbeholdningen resultattabellen viser (PRD FR-7). | forventet lager, forventet beholdning, beregnet lager |
| Forfalt frigivelse | En planlagt ordrefrigivelse der t − L < 1. Den legges i uke 1 og blir bruttobehov i uke 1 for underkomponentene. | bestilling før planstart, uke 0 |
| Bestillingsforslag | Det brukeren handler på: del, frigivelsesuke og mengde. | – |
| Bestillingsregel (*lot sizing rule*) | Regelen som gjør nettobehov om til planlagt ordremottak. | – |
| Lot-for-lot (L4L) | Planlagt ordremottak = nettobehov. | – |
| Fast partistørrelse (*fixed order quantity*) | Planlagt ordremottak rundes opp til et helt antall partier. Planlagt utvidelse. Kolonnen i malen og verdien Q heter «Partistørrelse». | partistørrelse (alene, om regelen) |

## Eksepsjoner

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Eksepsjon (*exception message*) | En melding om avvik for en del, i en uke eller for hele delen. Brukes i dokumenter, kode og i teksten i appen (besluttet 2026-11-05, se merknad 3). | varsel, eksepsjonsmelding, exception |
| Bestilling forsinket | Forfalt frigivelse og disponibel beholdning < 0. Leveransen blir forsinket til kunden (ferdigproduktet) eller til produksjonen av delen over. | Bestilling forsinket – nytt bestillingsforslag |
| Bruk av sikkerhetslager | Forfalt frigivelse og 0 ≤ disponibel beholdning < SS. | Under sikkerhetslager |
| Mottak forsinket | Nettobehov > 0 og et planlagt mottak ligger i en senere uke. Mottaket regnes som fremskyndet til uken med nettobehovet, og det lages planlagt ordremottak bare for et eventuelt restbehov. Resultattabellen viser mottaket i uken det er lagt inn (PRD FR-6, FR-12, endret 2026-11-02). | – |
| Kanseller mottak | Et planlagt mottak som ikke trengs noe sted i horisonten: delen får ikke noe nettobehov fra mottaksuken til uke H når mottaket tas bort og ingen andre mottak fremskyndes (PRD FR-29, ny 2026-11-02). | Utsett mottak (ikke en egen eksepsjon) |
| Ledetid overskrider horisont | Ledetid fra ferdigproduktet ≥ H. Gjelder hele delen, uansett lager: planen er for kort til å vise behov som må bestilles nå (PRD FR-9, endret 2026-11-02). | Innkjøpstid overskrider horisont |
| Kritisk del | En del med minst én eksepsjon. Markeres i resultattabellen, så brukeren raskt ser hvor det må handles. | kritisk komponent (se merknad 1) |
| Avvik | At planen ikke går opp for en del, f.eks. at lageret går under sikkerhetslager eller at en bestilling kommer for sent. Avvik gir eksepsjoner. | – |
| Falsk positiv / falsk negativ | Feil i eksepsjonene: en eksepsjon uten avvik (falsk positiv), eller et avvik uten eksepsjon (falsk negativ). | – |

## Produksjonskapasitet

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Produksjonskapasitet | Hvor mange hele ferdigprodukter som kan være ferdige innen en uke, ut fra ledig beholdning, planlagte mottak og ledetid, uavhengig av prognostiserte behov. Vises per uke fra lager og med planlagte mottak (PRD §4.9, FR-31–FR-32, fra Iduns utkast, med i v1 fra 2026-11-09). | lagerkapasitet, lagerbasert produksjonskapasitet |
| Ledig beholdning | Lagerbeholdning minus sikkerhetslager, men aldri under 0. Brukes bare i produksjonskapasiteten (PRD FR-31). | disponibel beholdning (om lager minus SS), tilgjengelig beholdning |
| Begrensende del | En del som ikke kan dekkes når behovet er ett ferdigprodukt mer enn produksjonskapasiteten i en uke, fordi lageret ikke strekker til eller på grunn av ledetiden (PRD FR-33). | begrensende materiale, knappeste materiale, flaskehals |

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
| Før/etter-sammenligning | Forskjellen i bestillingsforslag og eksepsjoner mellom forrige og ny kjøring for samme ferdigprodukt. Appen husker siste kjøring per ferdigprodukt (PRD FR-19, besluttet 2026-11-05). | – |
| Testeksempel | Et utfylt datasett med fasit, i `testdata/` (01–05). | øvingseksempel (slettet, se merknad 4) |
| Fasit | Manuelt kontrollert forventet resultattabell og eksepsjonsliste for et testeksempel. | – |
| Valideringstilfelle | En fil i `testdata/validering/` med nøyaktig én kjent valideringsfeil, eller ingen feil for gyldige grenseverdier. | feilfil |
| Vercel | Tjenesten appen publiseres på, med en lenke som kan åpnes uten installasjon. Vercel leverer bare appens kode. Innlesing, validering, beregning og lagring av kjøringer skjer i brukerens nettleser (PRD NFR-4, besluttet 2026-11-05). | – |
| Lokal lagring | Nettleserens lagring på brukerens maskin, der appen husker siste kjøring per ferdigprodukt. Den opplastede Excel-filen lagres ikke (PRD FR-19, NFR-10). | – |
| Brukertest | Test der testpersoner løser de samme oppgavene i appen etter en kort introduksjon, hver for seg og uten veiledning (PRD SM-3, §8.1). | brukstest, brukstesting, brukertesting |
| Testperson | En person som deltar i brukertesten. Trenger ikke ha brukt appen før. 4–8 i alt, 1–2 per gruppemedlem (PRD §8.1). | testbruker |
| Testleder | Gruppemedlemmet som gjennomfører brukertesten med en testperson. Kan hjelpe med tekniske problemer, men ikke med oppgavene (PRD §8.1). | – |
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

Besluttet av Sebastian 2026-11-05 (se `prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md`).

1. **Del eller komponent?** «Del» er samlebegrepet for alle rader i stykklisten, som i malen og testdataene. «Komponent» brukes bare om typen. «Kritisk komponent» blir «kritisk del».
2. **Prognostiserte behov eller MPS?** «Prognostiserte behov» i malen og appen. I dokumenter skrives «Prognostiserte behov (MPS)» første gang, så fagbegrepet er lett å kjenne igjen.
3. **Eksepsjon eller varsel?** «Eksepsjon» overalt, også i appen. Forklaringene i appen gjør begrepet forståelig.
4. **Øvingseksempelet** (3 komponenter, 4 uker) slettes. Det finnes bare på grenene til Carmen og Oda, ikke på `main`.
5. **Typelisten:** tre typer (Ferdigvare, Komponent (Kjøpes inn), Komponent (Produseres selv)), som i malen, PRD-en og testdataene. Delmontering og Råvare er ikke egne typer.

## Avvik mellom malen og PRD-en

Avvikene fra 2026-10-19 (enkeltnivå, Komponent-ID, innkjøpstid, antall per ferdigprodukt, 1–500 deler) ble rettet i PRD-en 2026-10-26. Disse gjelder per 2026-11-05 og rettes neste gang malen endres:

| Tema | PRD og ordbank | Malen |
|---|---|---|
| Arknavn | «Prognostiserte behov (MPS)» i teksten | Arket heter MPS. Besluttet å beholde (2026-11-05) |
| Arket Veien videre | «Eksepsjon», «del», fem eksepsjonstyper, ledetid fra ferdigproduktet (FR-9) | Bruker «varsel» og «komponent», lister fire eksepsjonstyper og den gamle regelen for Ledetid overskrider horisont |
| Eksempel i Veiledning | Testeksempel 01 er 100-002 Kontorstol Basic | Eksempelet er 100-001 Kontorstol Basic |
