---
title: Resultatkonsepter A, B og C – vurdering og konflikter med PRD-en
status: forslag – ikke godkjent av gruppen
created: 2026-11-15
author: Carmen Kolstad
---

# Resultatkonsepter A, B og C

> **Forslag til diskusjon, ikke godkjent av gruppen.** Tre selvstendige prototyper av resultatvisningen for brukere uten MRP-erfaring. De bruker de samme testdataene (fasit for testeksempel 01–03), samme klassifisering av produksjon og innkjøp (PRD FR-17), og samme detaljpanel med beregningen. PRD, EXPERIENCE.md, DESIGN.md, ordbanken, arkitekturen og alle tidligere prototyper (versjon 1–4 og konsept 1–3) er ikke endret.

**Åpne:** start serveren fra prosjektroten (`python3 -m http.server 8765 --bind 127.0.0.1`) og gå til <http://localhost:8765/.docs/planning-artifacts/ux/resultatkonsepter-2026-11-15/index.html>. Velg et konsept eller «Side om side», og velg testdata 01, 02 eller 03.

## De tre konseptene

| | A · Handlingsorientert | B · Visuell ukeplan | C · Produksjon og innkjøp |
|---|---|---|---|
| Struktur | Oppgaveliste etter hastegrad | Kalender: én kolonne per uke, tre spor | To arbeidsområder (faner), én rad per vare |
| Første inntrykk | «Dette bør du gjøre nå»: forslagene for uke 1 som setninger («Bestill 175 Hjul») | Ti uker med antall produksjon, innkjøp og forhold som krever oppfølging | «Dette bør produseres»: varene og mengden per uke |
| Senere uker | «Følg med på» og lukkede uker under | Velg en uke i kalenderen. Forrige og neste uke | Kolonner for uke 1–10 i samme rad |
| Kritiske forhold | Merket ved oppgaven og i «Følg med på» | Eget spor i kalenderen og i ukens detaljer | Merket ved varen og med rød ramme i uken |
| Detaljer | Klikk på en oppgave | Klikk på en linje i ukens detaljer | Klikk på en rad |

Felles for alle tre:

- **Detaljpanelet** viser:
  - delens type i enkelt språk, lager, sikkerhetslager og tid å skaffe
  - forholdene i enkelt språk, med PRD-navnet under «Mer om dette»
  - alle forslagene for delen
  - «Vis beregningen» (skjult som standard), som viser de seks radene for delen. Hvert tall forklares ved klikk.
- **«Vis hele beregningen for alle deler»** viser hele tabellen (FR-14).
- **Hver side sier** «Dette er forslag fra planen. Ingenting er bestilt eller satt i produksjon ennå.», og den gule linjen sier hvilke testdata som vises.

## Konflikter med PRD-en og andre beslutninger

| # | Krav eller beslutning | A | B | C | Hva gruppen må avgjøre |
|---|---|---|---|---|---|
| 1 | **FR-17**: liste over alle bestillingsforslag, sortert etter frigivelsesuke, med filter på én uke | Uke 1 åpen, senere uker lukket. Ingen nedtrekksliste | Én uke om gangen (valg av uke er filteret). Ingen samlet liste | Sortert per vare, ikke per uke. Ingen ukefilter | Om kravet kan oppfylles på andre måter, eller om konseptet må få en ukeliste med filter |
| 2 | **FR-16**: sammendrag over tabellen med antall kritiske deler, og hopp til delens tabell | «Følg med på» og merker. Ingen samlet telling | Telling per uke i et eget spor | Telling i fanene | Hvor sammendraget står. Hoppet til delens tabell virker i alle tre (detaljpanelet) |
| 3 | **FR-18**: forklaringen står i et panel *ved siden av* tabellen og er åpen til brukeren lukker den | Forklaringen står under tabellen i detaljpanelet | Samme | Samme | Om «under» er godt nok i et smalt panel |
| 4 | **EXPERIENCE.md**: tabellen er et WAI-ARIA-rutenett med én tabulatorstopp og piltaster | Hvert tall er en egen knapp (mange tabulatorstopp) | Samme | Samme | Prototypeforenkling. Rutenettet fra v3/v4 kan gjenbrukes |
| 5 | **Ordbanken (2026-11-05)**: eksepsjonene har faste navn som brukes i appen («Bestilling forsinket» osv.) | Enkelt språk på overflaten («Kommer for sent», «Sikkerhetslageret brukes», «Leveransen må komme tidligere», «Leveransen trengs kanskje ikke», «Planen er for kort for denne delen»). PRD-navnet står i detaljene | Samme | Samme | Om appen skal bruke enkle formuleringer på overflaten. Det endrer beslutningen fra 2026-11-05 |
| 6 | **Nytt UI-uttrykk** «Krever oppfølging» (v3/v4 brukte «Krever handling») | Ja | Ja | Ja | Ett uttrykk velges og legges i ordbanken |
| 7 | **FR-15**: eksepsjonen er markert i tabellcellen med farge *og* symbol eller tekst | Rød ramme om nettobehovet i uken, og skjermlesertekst. Symbol i delens overskrift | Samme | Samme, og «!» i uken i arbeidsområdet | Om rød ramme og tekst er nok |
| 8 | **FR-19–FR-23, FR-27, FR-30–FR-34**: lagring, sammenligning, eksport, veiledning, kapasitet | Ikke med | Ikke med | Ikke med | Utenfor oppdraget (bare resultatvisningen). Finnes i v3/v4 og må legges rundt det valgte konseptet |

**Brukertesten (SM-3)** i hvert konsept:

| Oppgave | A | B | C |
|---|---|---|---|
| 1. Finn en kritisk del | Merket i oppgavelisten og i «Følg med på» | Sporet «Krever oppfølging» | Merket på raden og telt i fanen |
| 2. Forklar en eksepsjon | Klikk, og les én setning i enkelt språk | Samme | Samme |
| 3. Les av mengde og uke | Står som setning («Bestill 175 Hjul» i uke 1) | Velg uke, og les av raden | Les av cellen eller «Neste forslag» |

## Tester (2026-11-15)

Automatisk test i Chrome uten vindu via localhost: 103 kontroller etter rettelsene.

- **Forventede tall** er regnet direkte fra datafilene, uavhengig av konseptenes egen kode:
  - antall per uke for produksjon, innkjøp og eksepsjoner
  - forslagene i uke 1, «Følg med på» og senere uker
  - rader og faner
  - at alle forslagene finnes
  - at klassifiseringen følger typen i dataene
- **Testeksemplene:** alle tallene er kontrollert for 01, 02 og 03.
- **Samspill:** detaljpanelet (åpnes ved klikk, Esc lukker, fokus går tilbake), at beregningen er skjult til brukeren ber om den, forklaringen for nettobehovet til Hjul i uke 1 (80, 100, −20, 30 → 50), merket celle for eksepsjonen, hele beregningen med 9 deler, valg av uke og forrige og neste uke i B, og fanebytte med mus og piltaster i C.
- **Bredder:** ingen sidelengs rulling på 1280, 1024, 800 og 390 px. Tabellene i B og C ruller innenfor sin egen boks.
- **Sammenligningssiden:** bytte mellom konseptene, valg av testdata for rammen og lenkene, side om side med alle tre lastet, og at valget huskes i adressen.
- **Visuell kontroll** på 1440 px. Rettet:
  - ikonet i ukeplanen
  - grå i stedet for rød strek i tomme celler i B
  - markeringen av en eksepsjon i en uke uten forslag i C
- **Safari:** ikke automatisert (krever at Safari tillater fjernstyring). Sidene er åpnet i Safari via localhost for manuell testing.

## Vurdering

**A · Handlingsorientert**

- **Styrker:**
  - Svarer direkte på «hva gjør jeg nå?», med setninger som ikke krever MRP-kunnskap («Bestill 175 Hjul», «50 skulle vært bestilt før uke 1»).
  - Kortest vei til SM-3-oppgavene.
  - Kritiske forhold står der handlingen er.
- **Svakheter:**
  - Svakest oversikt over hele planperioden.
  - Lengst unna FR-17 (ingen samlet liste eller ukefilter).
  - «Følg med på» kan bli lang med mange eksepsjoner.

**B · Visuell ukeplan**

- **Styrker:**
  - Best oversikt: brukeren ser på et blikk når det er mye å gjøre, og når noe krever oppfølging.
  - Valg av uke er intuitivt og er i praksis ukefilteret.
- **Svakheter:**
  - Kalenderen viser antall, ikke hva som skal gjøres. Brukeren må velge en uke for å se varene og mengdene, altså ett ekstra steg.
  - Tallene i cellene («5 komponenter») kan misforstås som mengder.

**C · Produksjon og innkjøp**

- **Styrker:**
  - Tydeligst skille mellom produksjon og innkjøp, og hvem som gjør hva.
  - Hver vare har hele planen sin på én rad, så det er lett å se rytmen i bestillingene.
  - Passer en innkjøper eller produksjonsplanlegger.
- **Svakheter:**
  - Tettest visning, nærmest et regneark.
  - Ukene er kolonner, så uke 1 konkurrerer visuelt med resten.
  - Ingen ukeliste (FR-17).

**Anbefaling for målgruppen (uten MRP-erfaring):** **A som hovedvisning.** Den gir brukeren noe å gjøre før den gir noe å forstå. Den er nærmest SM-3-oppgavene, og den har minst MRP-språk.

To grep fra de andre gjør den mer komplett:

- Ukeplanen fra B som en kompakt oversikt over senere uker, i stedet for de lukkede ukelistene. Det dekker også ukefilteret i FR-17.
- Skillet mellom produksjon og innkjøp fra C, som A allerede har.

Konfliktene 1–7 må avgjøres av gruppen før retningen føres inn i EXPERIENCE.md.
