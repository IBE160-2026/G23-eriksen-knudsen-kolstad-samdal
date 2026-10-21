---
title: COSI - MRP Ordbank
status: forslag
created: 2026-10-21
---

# Ordbank: COSI - MRP

Felles begreper for brief, PRD, arkitektur, stories, Excel-mal, kode og app. Bruk begrepet i første kolonne. Ordene i «Ikke bruk» er synonymer som finnes i dokumentene i dag.

Forslaget bygger på fasiten til testeksempel 01, som gruppen har kontrollert (2026-10-19), og på Excel-malen. Punkter merket **[BESLUTNING]** må gruppen avgjøre.

## Inndata

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Excel-mal | Den faste filen `COSI-MRP-mal.xlsx` som brukeren fyller ut og laster opp. | fil, regneark (om malen) |
| Ferdigprodukt | Det ene produktet planen gjelder for. | produkt, Produkt A |
| Komponent | En del som inngår i ferdigproduktet. Har Komponent-ID (K01, K02 …). | vare, del |
| Antall per ferdigprodukt | Hvor mange av komponenten som går med i ett ferdigprodukt. | antall per A, antall per produkt |
| BOM (stykkliste) | Listen over komponenter med antall per ferdigprodukt. Ett nivå i v1. | – |
| MPS | Antall ferdigprodukter som skal produseres per uke. **[BESLUTNING]** Malen kaller arket «Prognostiserte behov». Velg ett navn. | prognose, produksjonsplan |
| Lagerbeholdning | Antall på lager før uke 1. | startlager, lagerstatus |
| Sikkerhetslager (SS) | Laveste forventede lagerbeholdning planen skal holde. | buffer |
| Innkjøpstid (L) | Antall hele uker fra en bestilling frigis til den mottas. | ledetid, leveringstid |
| Planlagt mottak | Et mottak som allerede er bestilt, med uke og antall. Leses fra Excel-malen. **[BESLUTNING]** Se merknad 1. | registrert mottak, innkommende ordre |

## Tid

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Uke (t) | Én periode, nummerert 1 til H. | periode |
| Uke 1 | Første uke i horisonten. | planstart |
| Horisont (H) | Antall sammenhengende utfylte uker i MPS fra uke 1. 8–12. | planhorisont |

## Beregning (per komponent og uke)

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Bruttobehov | MPS(t) × antall per ferdigprodukt. | behov (alene) |
| Disponibel beholdning | Forventet lagerbeholdning(t−1) + planlagte mottak(t) − bruttobehov(t). | tilgjengelig (se merknad 2), disponibel (alene) |
| Nettobehov | maks(0, SS − disponibel beholdning). | – |
| Planlagt ordremottak | Mengden en foreslått bestilling skal levere i uke t. Beregnet, ikke bestilt. | planlagt mottak (om beregnet mengde) |
| Planlagt ordrefrigivelse | Mengden som må bestilles i uke t − L. | planlagt frigivelse, planlagt bestilling |
| Forventet lagerbeholdning | Disponibel beholdning + planlagt ordremottak. | forventet lager, forventet beholdning, beregnet lager |
| Forfalt frigivelse | En planlagt ordrefrigivelse der t − L < 1. **[BESLUTNING]** Se merknad 3. | bestilling før planstart |
| Bestillingsforslag | Det brukeren handler på: komponent, frigivelsesuke og mengde. | – |
| Bestillingsregel | Regelen som gjør nettobehov om til planlagt ordremottak. | – |
| Lot-for-lot | Planlagt ordremottak = nettobehov. | – |
| Fast partistørrelse | Planlagt ordremottak rundes opp til et helt antall partier. Planlagt utvidelse. | partistørrelse (alene) |

## Eksepsjoner

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Eksepsjon | Et varsel om avvik for en komponent, i en uke eller for hele komponenten. **[BESLUTNING]** Se merknad 4. | varsel, eksepsjonsmelding, exception |
| Bestilling forsinket | Forfalt frigivelse og disponibel beholdning < 0. | Bestilling forsinket – nytt bestillingsforslag |
| Bruk av sikkerhetslager | Forfalt frigivelse og 0 ≤ disponibel beholdning < SS. | Under sikkerhetslager |
| Mottak forsinket | Nettobehov > 0 og et planlagt mottak ligger i en senere uke. | – |
| Innkjøpstid overskrider horisont | L ≥ H. Gjelder hele komponenten. | – |
| Kritisk komponent | En komponent med minst én eksepsjon. | – |

## App og test

| Begrep | Definisjon | Ikke bruk |
|---|---|---|
| Kjøring | Én beregning fra én opplastet Excel-mal. | beregning (om hele kjøringen) |
| Valideringsfeil | En feil i filen som stopper beregningen. Oppgir ark, rad og årsak. | feilmelding |
| Resultattabell | MRP-tabellen per komponent og uke, med eksepsjonene markert. | MRP-tabell, resultatside, oversikt |
| Før/etter-sammenligning | Forskjellen i bestillingsforslag og eksepsjoner mellom forrige og ny kjøring. | – |
| Testeksempel | Et utfylt datasett med fasit, i `testdata/`. | øvingseksempel (se merknad 5) |
| Fasit | Manuelt kontrollert forventet resultattabell og eksepsjonsliste for et testeksempel. | – |

## Merknader

1. **Planlagt mottak betyr to ting i dag.** Brief, mal og fasit bruker det om mottak som allerede er bestilt. Carmen og Odas PRD bruker det om beregnet mengde og kaller de bestilte for «registrert mottak». Forslaget følger malen og fasiten. Alternativet er å endre til «registrert mottak» overalt, også i malen.
2. **Disponibel og tilgjengelig er ikke det samme tallet.** Tilgjengelig (Carmen, Odas PRD) er *før* bruttobehovet trekkes fra. Disponibel beholdning (fasiten) er *etter*. Nettobehovet blir likt, men raden i tabellen blir ulik.
3. **Forfalte frigivelser: uke 1 eller uke 0?** Fasiten legger dem i uke 1. Carmen viser dem i uke 0, −1 osv. Gruppen må velge én regel.
4. **Eksepsjon eller varsel?** «Eksepsjon» er fagbegrepet og brukes i brief og fasit. «Varsel» er lettere for brukeren. Forslag: «eksepsjon» i dokumenter og kode, «varsel» bare i appens tekst. Velg ellers ett ord for alt.
5. **Øvingseksempelet** (3 komponenter, 4 uker) er utenfor omfanget (5–10, 8–12). Det kan kalles testeksempel 00 hvis det beholdes.

## Andre avvik å avklare

| Tema | Avvik |
|---|---|
| Antall komponenter | Malen og Sebastians PRD: 1–500. Odas PRD: 5–10. |
| Minste innkjøpstid | Sebastians PRD: 1 uke. Odas PRD: 0 uker. |
| Kontrollberegning | Bare hos Carmen og i Odas PRD. Med eller ikke? |
| Før/etter-sammenligning | Brief og PRD-ene: med. Carmen: utenfor v1. |
| Eksport | Sebastians PRD: med (.xlsx). Odas PRD: ikke med. |
