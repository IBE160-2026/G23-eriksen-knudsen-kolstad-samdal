---
title: Kontroll av produksjonskapasiteten i testeksempel 05
status: analytisk kontroll (ikke menneskelig verifisert)
created: 2026-11-09
updated: 2026-11-09
---

# Kontroll av produksjonskapasiteten i testeksempel 05

> **Viktig:** Dette er en **analytisk kontroll utført av Claude Code** (KI-agent) på oppdrag fra Carmen Kolstad, 2026-11-09. Det er **ikke** en uavhengig menneskelig verifikasjon. Det åpne punktet «gruppa kontrollerer fasit 05 for hånd» i `.logs/sebastian/issues.md` er derfor fortsatt åpent. Dokumentet kan brukes som grunnlag for den menneskelige kontrollen: hver mellomregning kan regnes etter med tallene og cellene som er oppgitt.

## 1. Hva som er kontrollert

| Fil | Brukt til |
|---|---|
| `testdata/testeksempel-05.xlsx` | Inndata: arkene Stykkliste, MPS og Planlagte mottak |
| `testdata/testeksempel-05-fasit.xlsx` | Fasiten som kontrolleres: arket Kapasitet |
| `.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/prd.md` | Reglene (status `final`, oppdatert 2026-11-09) |

**PRD-krav som er kontrollert:**

- **FR-31 Beregn produksjonskapasitet:** ledig beholdning, nedbryting gjennom stykklisten, SS 0, ingen fremskynding av mottak, deler uten underdeler kan ikke få nye ordrer, ingen forfalt frigivelse for ferdigproduktet og deler som produseres selv, ledig beholdning av en del som produseres selv brukes før underdelene.
- **FR-32 Kapasitet fra lager og med planlagte mottak:** begge radene, og at raden med mottak aldri er lavere enn raden fra lager.
- **FR-33 Begrensende deler:** delene som ikke kan dekkes ved N + 1, med årsak (lager eller ledetid).
- **SM-7 Riktig kapasitet:** samsvar per uke på begge radene og for de begrensende delene med årsak.
- **FR-28** (felles del) og **FR-34** (grunnlaget per del i tabellen) så langt de påvirker tallene over.

**Ikke kontrollert her:** MRP-tabellene for testeksempel 05 (Fasittabell, Eksepsjoner, Utregning, Bestillingsforslag) og eksepsjonen for 300-033. Arkene Regler og Materiell. Tekstene i fasiten under «Håndregning» (A41:A51) er ikke brukt som grunnlag, bare lest til slutt for sammenligning. Fasitgeneratoren `testdata/lag_testdata.py` er ikke brukt.

## 2. Inndata og sporbarhet

Alle tall under er lest direkte fra cellene i `testdata/testeksempel-05.xlsx`.

### 2.1 Stykkliste (kolonne A–H, rad 2–9)

| Excel-rad | Nivå (A) | Varenummer (B) | Beskrivelse (C) | Antall (D) | Type (E) | Lager (F) | SS (G) | Ledetid (H) |
|---|---|---|---|---|---|---|---|---|
| 2 | 0 | 100-004 | Kontorstol Kompakt | – | Ferdigvare | 12 | 2 | 1 |
| 3 | .1 | 200-020 | Sete | 1 | Komponent (Produseres selv) | 8 | 0 | 2 |
| 4 | ..2 | 300-031 | Seteplate | 1 | Komponent (Kjøpes inn) | 40 | 10 | 2 |
| 5 | ..2 | 300-032 | Skruesett M6 | 4 | Komponent (Kjøpes inn) | 140 | 20 | 1 |
| 6 | .1 | 200-021 | Rygg | 1 | Komponent (Produseres selv) | 0 | 0 | 1 |
| 7 | ..2 | 300-033 | Ryggplate | 1 | Komponent (Kjøpes inn) | 25 | 5 | 3 |
| 8 | ..2 | 300-032 | Skruesett M6 | 2 | Komponent (Kjøpes inn) | tom | tom | tom |
| 9 | .1 | 300-034 | Hjul | 5 | Komponent (Kjøpes inn) | 150 | 30 | 1 |

Struktur som følger av nivåene:

```text
100-004 Kontorstol Kompakt (L 1)
├── 200-020 Sete × 1 (produseres selv, L 2)
│   ├── 300-031 Seteplate × 1
│   └── 300-032 Skruesett M6 × 4
├── 200-021 Rygg × 1 (produseres selv, L 1)
│   ├── 300-033 Ryggplate × 1
│   └── 300-032 Skruesett M6 × 2      (felles del, FR-28)
└── 300-034 Hjul × 5
```

300-032 står to steder (rad 5 og 8). Lager, SS og ledetid hentes fra første rad, rad 5 (FR-28), og rad 8 er tom i F–H som FR-3 krever.

### 2.2 MPS og Planlagte mottak

- **MPS:** B2:B9 er fylt ut (5, 5, 6, 6, 8, 8, 6, 6), og B10 er tom. Horisonten er derfor **H = 8**. MPS påvirker ikke kapasiteten (FR-31, siste konsekvens), bare antall uker.
- **Planlagte mottak:**
  - Rad 2 (A2:C2): **300-034 Hjul, uke 3, 100**
  - Rad 3 (A3:C3): **300-033 Ryggplate, uke 5, 30**

### 2.3 Ledig beholdning (FR-31)

Ledig beholdning = maks(0, lagerbeholdning − SS).

| Del | Celler | Utregning | Ledig |
|---|---|---|---|
| 100-004 | F2 − G2 | 12 − 2 | **10** |
| 200-020 | F3 − G3 | 8 − 0 | **8** |
| 300-031 | F4 − G4 | 40 − 10 | **30** |
| 300-032 | F5 − G5 | 140 − 20 | **120** |
| 200-021 | F6 − G6 | 0 − 0 | **0** |
| 300-033 | F7 − G7 | 25 − 5 | **20** |
| 300-034 | F9 − G9 | 150 − 30 | **120** |

## 3. Beregningsmetode

Kapasiteten i uke t er det største antallet hele ferdigprodukter N som kan være ferdige innen uke t (FR-31). Behovet på N i uke t brytes ned slik:

1. **Ferdigproduktet 100-004** dekker opptil 10 stoler fra ledig beholdning. Resten, **P = N − 10**, må produseres. Med ledetid 1 (H2) frigis produksjonen i **uke t − 1**, og det krever t − 1 ≥ 1. Ellers er frigivelsen forfalt, og det er ikke lov i kapasiteten.
2. Frigivelsen av P stoler i uke t − 1 gir bruttobehov i **uke t − 1** for P seter (D3 = 1), P rygger (D6 = 1) og 5P hjul (D9 = 5).
3. **200-020 Sete** (ledig 8, ledetid 2 i H3): 8 dekkes fra lager. Resten, **P − 8**, frigis i **uke t − 3**, og det krever t ≥ 4. Den frigivelsen gir behov for P − 8 seteplater (D4 = 1) og 4(P − 8) skruesett (D5 = 4).
4. **200-021 Rygg** (ledig 0, ledetid 1 i H6): alle P frigis i **uke t − 2**, og det krever t ≥ 3. Den frigivelsen gir behov for P ryggplater (D7 = 1) og 2P skruesett (D8 = 2).
5. **Deler som kjøpes inn** (300-031, 300-032, 300-033, 300-034) kan ikke få nye ordrer i kapasiteten. Behovet må dekkes av ledig beholdning pluss planlagte mottak som kommer **senest i uken behovet oppstår**. Et mottak i uke w hjelper bare behov i uke w eller senere, og fremskyndes ikke. Ledetiden for disse delene brukes derfor ikke.
6. **300-032 Skruesett** er en felles del med én samlet ledig beholdning på 120 og ingen mottak. Betingelsen er summen av begge behovene: **4(P − 8) + 2P ≤ 120**, selv om behovene kommer i ulike uker.
7. **Kapasiteten** er 10 + den største P som oppfyller alle betingelsene.
8. **Begrensende deler (FR-33)** finnes ved å sette inn N + 1 (P + 1) og notere hver del som da ikke kan dekkes:
   - Årsak **ledetid** når en frigivelse havner før uke 1.
   - Årsak **lager** når ledig beholdning pluss mottak ikke strekker til.

   En forfalt mengde sendes ikke videre til underdelene, så bare delen som selv får den forfalte frigivelsen, står som begrensende.

**Når mottakene kan brukes** (bare raden «Med planlagte mottak»):

| Mottak | Behovet for delen oppstår i | Mottaket kan brukes når |
|---|---|---|
| 300-034 Hjul, 100 i uke 3 | uke t − 1 | t − 1 ≥ 3, altså **t ≥ 4** |
| 300-033 Ryggplate, 30 i uke 5 | uke t − 2 (frigivelsen av rygg) | t − 2 ≥ 5, altså **t ≥ 7** |

## 4. Raden «Fra lager» (uten planlagte mottak)

Tilgjengelig for de innkjøpte delene: Seteplate 30, Skruesett 120, Ryggplate 20, Hjul 120.

### Uke 1

- Ferdigproduktet måtte vært frigitt i uke 0, så P = 0.
- **Kapasitet = 10.**
- N + 1 = 11 (P = 1): 100-004 får en forfalt frigivelse, og årsaken er ledetid.
- **Begrensende: 100-004 (ledetid).**

### Uke 2

- Ferdigproduktet frigis i uke 1. Ryggen har ledig 0 og må frigis i uke 0, så P = 0.
- **Kapasitet = 10.**
- N + 1 = 11 (P = 1):
  - Sete 1 ≤ 8 fra lager går.
  - Hjul 5 ≤ 120 går.
  - Rygg får forfalt frigivelse.
- **Begrensende: 200-021 (ledetid).**

### Uke 3

- Ferdigproduktet frigis i uke 2, og ryggen i uke 1.
- Setet må dekkes fra lager, fordi resten måtte vært frigitt i uke 0: **P ≤ 8**.
- Ryggplate P ≤ 20 og hjul 5P ≤ 120 (P ≤ 24) binder ikke.
- Skruesett: bare 2P = 16 ≤ 120.
- P = 8, så **kapasitet = 10 + 8 = 18**.
- N + 1 = 19 (P = 9):
  - Setet mangler 1, som måtte vært frigitt i uke 0.
  - Ryggplate 9 ≤ 20 går.
  - Hjul 45 ≤ 120 går.
  - Skruesett 2 × 9 = 18 ≤ 120 går.
- **Begrensende: 200-020 (ledetid).**

### Uke 4–8

Ingen ledetid binder lenger (t ≥ 4). Betingelsene er:

| Del | Betingelse | Største P |
|---|---|---|
| 300-033 Ryggplate | P ≤ 20 | **20** |
| 300-034 Hjul | 5P ≤ 120 | 24 |
| 300-031 Seteplate | P − 8 ≤ 30 | 38 |
| 300-032 Skruesett | 4(P − 8) + 2P ≤ 120, altså 6P ≤ 152 | 25 |

P = 20, så **kapasitet = 10 + 20 = 30** i uke 4, 5, 6, 7 og 8.

N + 1 = 31 (P = 21):
- Ryggplate 21 > 20 feiler.
- Hjul 105 ≤ 120 går.
- Seteplate 13 ≤ 30 går.
- Skruesett 4 × 13 + 2 × 21 = 94 ≤ 120 går.

**Begrensende: 300-033 (lager)** i uke 4–8.

## 5. Raden «Med planlagte mottak»

### Uke 1–3

Ingen mottak kan brukes. Hjulmottaket kommer i uke 3, men i uke 3 trengs hjulene i uke 2. Mellomregningene er derfor de samme som i kapittel 4:

| Uke | Kapasitet | Begrensende |
|---|---|---|
| 1 | 10 | 100-004 (ledetid) |
| 2 | 10 | 200-021 (ledetid) |
| 3 | 18 | 200-020 (ledetid) |

### Uke 4–6

Hjulmottaket kan brukes: 120 + 100 = 220. Ryggplatemottaket kan ikke brukes ennå, fordi ryggplatene trengs i uke 2–4.

| Del | Betingelse | Største P |
|---|---|---|
| 300-033 Ryggplate | P ≤ 20 | **20** |
| 300-034 Hjul | 5P ≤ 220 | 44 |
| 300-031 Seteplate | P − 8 ≤ 30 | 38 |
| 300-032 Skruesett | 6P ≤ 152 | 25 |

P = 20, så **kapasitet = 30**.

N + 1 = 31 (P = 21): ryggplate 21 > 20 feiler. Hjul 105, seteplate 13 og skruesett 94 går.

**Begrensende: 300-033 (lager).**

### Uke 7–8

Begge mottakene kan brukes: hjul 220 og ryggplate 20 + 30 = 50.

| Del | Betingelse | Største P |
|---|---|---|
| 300-033 Ryggplate | P ≤ 50 | 50 |
| 300-034 Hjul | 5P ≤ 220 | 44 |
| 300-031 Seteplate | P − 8 ≤ 30 | 38 |
| 300-032 Skruesett | 4(P − 8) + 2P ≤ 120, altså 6P ≤ 152 | **25** |

P = 25, så **kapasitet = 10 + 25 = 35**.

- Kontroll for P = 25: 4 × 17 + 2 × 25 = 68 + 50 = 118 ≤ 120 skruesett.
- N + 1 = 36 (P = 26): skruesett 4 × 18 + 2 × 26 = 72 + 52 = **124 > 120**, som feiler. Ryggplate 26 ≤ 50, hjul 130 ≤ 220 og seteplate 18 ≤ 30 går.
- **Begrensende: 300-032 (lager).**

Skruesettet krever regning gjennom stykklisten. Den enkle regelen ⌊120 / (4 + 2)⌋ = 20 nye stoler ville gitt kapasitet 30, som er feil. De 8 setene på lager trenger ikke nye skruesett, så riktig svar er 25 nye stoler.

## 6. Sammenligning med fasiten

Fasiten er arket Kapasitet i `testdata/testeksempel-05-fasit.xlsx`.

### 6.1 Kapasitet per uke (C8:J9)

| Rad | Kilde | Uke 1 (C) | Uke 2 (D) | Uke 3 (E) | Uke 4 (F) | Uke 5 (G) | Uke 6 (H) | Uke 7 (I) | Uke 8 (J) |
|---|---|---|---|---|---|---|---|---|---|
| Fra lager (rad 8) | Kontroll | 10 | 10 | 18 | 30 | 30 | 30 | 30 | 30 |
| | Fasit | 10 | 10 | 18 | 30 | 30 | 30 | 30 | 30 |
| Med planlagte mottak (rad 9) | Kontroll | 10 | 10 | 18 | 30 | 30 | 30 | 35 | 35 |
| | Fasit | 10 | 10 | 18 | 30 | 30 | 30 | 35 | 35 |

**16 av 16 celler stemmer.**

### 6.2 Begrensende deler (A13:F28)

| Fasitrader | Rad | Uke | Kontroll | Fasit | Samsvar |
|---|---|---|---|---|---|
| 13, 21 | begge | 1 | 100-004, ledetid | 100-004, ledetid | Ja |
| 14, 22 | begge | 2 | 200-021, ledetid | 200-021, ledetid | Ja |
| 15, 23 | begge | 3 | 200-020, ledetid | 200-020, ledetid | Ja |
| 16–20 | Fra lager | 4–8 | 300-033, lager | 300-033, lager | Ja |
| 24–26 | Med planlagte mottak | 4–6 | 300-033, lager | 300-033, lager | Ja |
| 27–28 | Med planlagte mottak | 7–8 | 300-032, lager | 300-032, lager | Ja |

**16 av 16 rader stemmer**, både del og årsak, og det er ingen andre begrensende deler. Kapasiteten i kolonne C (rad 13–28) stemmer også med 6.1.

### 6.3 Grunnlag per del (A32:O38)

Lager (D), SS (E), Ledig (F), Ledetid (G) og mottak per uke (H–O) stemmer med inndataene i kapittel 2 for alle sju delene:
- J38 = 100 (hjul, uke 3)
- L37 = 30 (ryggplate, uke 5)
- ingen andre mottak

**7 av 7 rader stemmer.**

### 6.4 Egenskaper FR-31 og FR-32 krever

- Kapasiteten er et heltall ≥ 0 og blir aldri lavere fra én uke til den neste, på begge radene. **Oppfylt.**
- Raden med planlagte mottak er aldri lavere enn raden fra lager. **Oppfylt.**
- Raden fra lager endres ikke av mottakene. **Oppfylt**, siden rad 8 ikke bruker mottak.
- Et mottak øker kapasiteten først fra uken det kan brukes, med ledetiden tatt med. **Oppfylt:** ryggplatemottaket i uke 5 hever kapasiteten først fra uke 7. Hjulmottaket gir ingen økning, fordi hjul aldri begrenser.

### 6.5 Tilleggskontroll

I tillegg til håndregningen kjørte Claude Code en egen kontrollberegning, skrevet ut fra PRD-teksten for FR-31–FR-33 og uten fasitgeneratoren. Den leste inndataene celle for celle og fant N ved å prøve N = 1, 2, 3, … med full nedbryting uke for uke. Den ga **0 avvik** mot C8:J9, A13:F28 og A32:O38. Skriptet var et midlertidig arbeidsverktøy og ligger ikke i repoet.

## 7. Konklusjon

Den analytiske kontrollen fant **ingen avvik** mellom fasiten for produksjonskapasiteten i testeksempel 05 og en beregning ut fra inndataene i `testeksempel-05.xlsx` og reglene i FR-31–FR-33:
- kapasitet per uke på begge radene
- begrensende deler med årsak
- grunnlaget per del

Alle tallene i dette dokumentet kan spores til cellene i kapittel 2. Fasiten ser derfor ut til å oppfylle SM-7 for det testeksempel 05 dekker.

**Forbehold:**

1. **Ikke menneskelig verifisert.** Kontrollen er gjort av en KI-agent. Fasiten ble også laget med hjelp fra Claude Code, så kontrollen er ikke helt uavhengig av verktøyet. Gruppen bør regne etter minst ett regneeksempel per årsak for hånd, for eksempel uke 3 (ledetid, sete), uke 4 (lager, ryggplate) og uke 7 med mottak (lager, felles skruesett), før det åpne punktet lukkes.
2. **Tolkning av FR-33.** Både fasiten og kontrollen regner bare delen som selv får en forfalt frigivelse, som begrensende. Den forfalte mengden sendes ikke videre til underdelene. Det følger PRD-teksten («en ordre måtte vært frigitt før uke 1»), men gruppen bør bekrefte tolkningen bevisst.
3. **SM-7 er dekket, men noen testbare konsekvenser i FR-31–FR-33 mangler egne tester.** Testeksempel 05 har alt SM-7 krever: sikkerhetslager, planlagte mottak, lager av ferdigproduktet og av en del som produseres selv, en felles del og et tilfelle der ledetiden begrenser. Disse konsekvensene i PRD-en prøves ikke:
   - FR-31: del som produseres selv, under et ferdigprodukt med ledetid 0
   - FR-31: minimumsregelen når verken ferdigproduktet eller delene som produseres selv har ledig beholdning
   - FR-31: lik kapasitet for filer som bare er ulike i MPS
   - FR-31: en del med lagerbeholdning under SS regnes med 0
   - FR-32: mottak under et ferdigprodukt med ledetid 0, og like rader uten mottak
   - FR-33: to begrensende deler med samme laveste verdi

   Dette er ikke feil i fasiten.
4. **Mulig uklar ordlyd i FR-33. Det er ikke påvist noen feil i testeksempel 05.** Den andre konsekvensen i FR-33 sier at en annen del vises som begrensende «fra mottaksuken». Det stemmer bare når delen trengs i samme uke som ferdigproduktet, for eksempel under et ferdigprodukt med ledetid 0. I testeksempel 05 skjer skiftet fra 300-033 til 300-032 i uke 7, ikke i mottaksuken 5, fordi ryggplaten trengs to uker før stolen er ferdig. Det er riktig etter FR-31, og `testdata/README.md` bruker nettopp dette skiftet som dekning for FR-33. Gruppen bør vurdere å presisere PRD-teksten.
5. **Utenfor omfanget.** MRP-delen av fasit 05 (tabellene og eksepsjonen «Mottak forsinket» for 300-033 i uke 4) er ikke kontrollert her.
