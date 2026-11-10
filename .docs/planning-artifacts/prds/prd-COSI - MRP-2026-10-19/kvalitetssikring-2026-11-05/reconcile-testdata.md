---
title: Avstemming av PRD mot testdata
created: 2026-11-05
prd: prd.md (updated 2026-11-05)
---

# Avstemming: PRD COSI - MRP mot testdata

**Kilder:**
- PRD: `prd.md` i denne mappen (linjenumre «PRD l.»)
- `testdata/README.md` (linjenumre «TR l.»)
- `testdata/validering/README.md` (linjenumre «VR l.»)
- `testdata/lag_testdata.py` (linjenumre «skript l.»). Skriptet er lest, men ikke kjørt.
- Fasitene `testdata/testeksempel-01…04-fasit.xlsx`. De er lest med openpyxl for å kontrollere tall, arknavn og eksepsjoner. Ingen filer er endret.

**Forutsetning:** Varenumrene på ferdigproduktet er 100-002 (01), 100-001 (02 og 03) og 100-003 (04), som endret 2026-11-05.

**Alvor:** *Høy* betyr at en test ikke kan lages eller vil gi feil utfall før PRD-en er rettet. *Middels* betyr at kravet er tvetydig eller mangler et testtilfelle som implementasjonen trenger. *Lav* betyr ordlyd, opprydding eller et grensetilfelle med liten risiko.

## Sammendrag

De aller fleste tallene, varenumrene, ukene, filnavnene og arknavnene i PRD-en stemmer med testdataene. Det gjelder også tallene i UJ-2 og UJ-3 (175 hjul med 50 forfalt, hjul 130 → 205, nytt forslag på 30 skruesett M6, mottaket på 40 rygger som fremskyndes til uke 2). De viktigste gapene:

| # | Funn | Alvor |
|---|---|---|
| D1 | Det er uklart om ordlyden i eksepsjonsmeldingene er et krav. FR-13 krever «samme melding» som fasiten, men det er bare skriptet som bestemmer ordlyden. | Høy |
| A2 | FR-20 og FR-23 krever egne linjer for nye og fjernede deler. Ingen testdata dekker det, og formatet på arket Sammenligning har ikke plass til det. | Høy |
| D3 | PRD-en sier at underdelene bare kan stå under *første* forekomst. Skriptet og Kontroll-kolonnen godtar underdeler under en senere forekomst. Ingen valideringsfil tester dette. | Middels |
| D2 | PRD-en sier ikke hvilken disponibel beholdning som avgjør Bestilling forsinket eller Bruk av sikkerhetslager når et mottak er fremskyndet i samme uke. Skriptet bruker verdien etter fremskyndingen. | Middels |
| B3 | NFR-5 viser til en testfil på 1000 rader laget med `lag_testdata.py`, men skriptet lager ingen slik fil. | Middels |

---

## 1. Avstemming av testbare konsekvenser

### 1.1 Det som stemmer

| PRD | Konsekvens | Testdata | Status |
|---|---|---|---|
| FR-1 l.117 | `testeksempel-01.xlsx` går til beregning | Filen finnes (TR l.15) | Stemmer |
| FR-1 l.118 | Fil som ikke er .xlsx, avvises | V-F04.csv «avvist» (VR l.57) | Stemmer |
| FR-2 l.125, l.127 | Ark eller overskrift mangler, gammel mal gir «Stykkliste mangler» | V-F01, V-F02, V-F03 med 1 feil hver (VR l.54–56) | Stemmer |
| FR-2 l.128–129 | Ingen følgefeil, V-F06 gir nøyaktig 2 feil | VR l.9, l.59 | Stemmer |
| FR-3 l.152 | Hver regel har en fil med nøyaktig én feil | V-S01–S29, V-M01–M05, V-P01–P04 (VR l.16–53). Se 2.2 for deler av regler uten fil. | Stemmer i hovedsak |
| FR-3 l.154 | Tomt ark Planlagte mottak er gyldig | V-G03 (VR l.62) | Stemmer |
| FR-3 l.155 | Lager 0 eller SS 0 er gyldig | 01: 100-002 (0/0/0), 300-008 (SS 0) (TR l.49, l.56) | Stemmer |
| FR-3 l.156 | Felles del med data bare første gang er gyldig | 02: 300-002 (TR l.72) | Stemmer |
| FR-3 l.157–158 | Like underdeler, eller underdeler bare første gang, er gyldig | 04: 200-012, 200-013. V-G04 (TR l.102–103, VR l.63) | Stemmer |
| FR-4 l.166 | Tre feil på tre ark | V-F05: D9, uke 3, B2 (VR l.58) | Stemmer |
| FR-5 l.178 | Hjul (antall 5) i 01: 100, 125, 150, 100, 175, 150, 125, 200, 150, 100 | MPS 01 × 5 (skript l.79) | Stemmer |
| FR-5 l.180 | ..2 får behov fra delen over | 02, 04 (TR l.124) | Stemmer |
| FR-28 l.187–188 | Skruesett M6 4 + 2, del på .1 og ..2 | 02 300-002, 04 300-023 (TR l.72, l.101) | Stemmer |
| FR-6 l.198, l.199 | Nettobehov 01 lik fasit, mottak i samme uke legges sammen | Fasit 01, 04 300-027 (TR l.105) | Stemmer |
| FR-6 l.200 | Gassfjær 01: mottak 100 i uke 4, forventet lager 0 i uke 3 og 80 i uke 4, ingen ordre i uke 3 | Fasittabell 01: 55, 30, **0**, **80**. Planlagte mottak 100 i uke 4. Nettobehov 0 i uke 3 | Stemmer |
| FR-6 l.202 | For lite mottak gir både flyttet mottak og ny ordre | 04 300-026 (TR l.104) | Stemmer |
| FR-7 l.209 | Lager under SS bare før et fremskyndet mottak | 01 300-005 (0 < 10), 04 300-026 (−30), 300-028 (−25/−15) | Stemmer |
| FR-8 l.217 | Hjul 175 i uke 1 (50 + 125) | Bestillingsforslag 01: 175, forfalt 50 | Stemmer |
| FR-8 l.218 | Trekk L = 3, første nettobehov i uke 4, frigivelse i uke 1 som ikke er forfalt | 01 300-008: 5 i uke 1, ingen forfalt mengde | Stemmer |
| FR-8 l.220 | Forfalt frigivelse på .1 gir behov i uke 1 under | 02 200-001 (forfalt 20) → 300-001/300-002. Se A7 | Stemmer |
| FR-9 l.235 | Stolfot L = 10 = H, nettobehov 0 | 01 300-006, melding «Kontorstol Basic 0 + Stolfot 10» | Stemmer |
| FR-9 l.236 | H − 1 gir ingen eksepsjon | 04 300-021 (11 = 12 − 1) | Stemmer |
| FR-10 l.248 | Ordlyden i Hjul-meldingen | Fasit 01, Eksepsjoner: tegn for tegn lik | Stemmer |
| FR-10 l.249 | ..2-melding slutter med «Produksjonen av …» | 04 300-022: «Produksjonen av Sete (200-010) og Rygg (200-011) blir forsinket.» | Stemmer |
| FR-11 l.256 | Armlene: disponibel 10, SS 20, 10 forfalt av 60 | Fasit 01: «Lager blir 10 … sikkerhetslager 20 … 10 … 60» | Stemmer |
| FR-12 l.264–265 | Gassfjær uke 3, Skruesett uten eksepsjon | Fasit 01 | Stemmer |
| FR-12 l.266 | For lite mottak gir eksepsjon og ordre | 04 300-026 | Stemmer |
| FR-29 l.273–274 | Skruesett får ikke eksepsjonen. Lager over SS hele horisonten gir eksepsjonen | 01 300-007. 02 300-005: lager 400 − 320 = 80 > 10, mottak i uke 5 | Stemmer |
| FR-13 l.282 | 01: nøyaktig 300-003/004/005/006 er kritiske | Fasit 01, Eksepsjoner | Stemmer |
| FR-16 l.311 | 4 kritiske deler i 01 | Som over | Stemmer |
| FR-17 l.320–321 | Én linje per frigivelse > 0. Nivå .1 i 01 er innkjøp | Arket Bestillingsforslag (TR l.16). Ferdigproduktet 100-002 står som produksjonsordre, som i FR-17 | Stemmer |
| FR-18 l.332 | Hjul uke 1: 80, 0, 100, −20, 30, 50 | Skript l.87, fasit 01 Utregning | Stemmer |
| FR-20 l.363–365 | Ingen endringer ved samme fil, 02 ↔ 03, identitetsregler | TR l.81–88, fasit 03 Sammenligning (7 endret + 1 nytt/fjernet, 2 + 1 eksepsjoner) | Stemmer |
| FR-20 l.368 | X → Y → X | TR l.145 (01 = 100-002, 02/03 = 100-001, 04 = 100-003) | Stemmer |
| FR-23 l.393 | Arket heter «Sammenligning» i fasit 03 | Arknavnet stemmer (bare i fasit 03) | Stemmer |
| FR-27 l.434 | `testdata/COSI-MRP-mal.xlsx` | Filen finnes. Arkene Veiledning, Stykkliste, MPS, Planlagte mottak og Veien videre stemmer med §3 l.67 | Stemmer |
| §4.2 l.171 | Arket Regler i fasit 01 | Finnes | Stemmer |
| UJ-2 l.52 | 175 hjul, 50 forfalt, fire kritiske deler, gassfjær 100 fra uke 4 til uke 3, hjul nettobehov 50 | Fasit 01 | Stemmer |
| UJ-3 l.55 | Uke 2 30 → 45, hjul 130 → 205, nytt forslag på 30 skruesett M6 i uke 1, hjul Bruk av sikkerhetslager, rygg fra uke 3 til uke 2 | Fasit 03 Sammenligning | Stemmer |
| UJ-4 l.59–60 | Uke 0 i Planlagte mottak, uke fylt ut etter et hull i MPS | V-P02, V-M02 (som tilfeller, med andre rader og uker) | Stemmer |
| §9.2 l.515, l.519 | 02: 8 deler på 3 nivåer med felles del 300-002. 02 300-005 i uke 5. 04 300-022 1 + 4 + 7 = 12 | TR l.17, l.75, l.99 | Stemmer |
| SM-1 l.486 | Minst ett testeksempel har 5–10 deler på 3 nivåer med felles del | 02 (8 deler) | Stemmer |

### 1.2 Avvik

**A1. FR-9: eksempelet bruker tall som ikke finnes i testdataene** (middels)
- *Hvor:* PRD l.237. TR l.99, l.138.
- *Funn:* Konsekvensen bruker H = 10 og 1 + 4 + 5 = 10. Det eneste testtilfellet er 04 300-022 med H = 12 og 1 + 4 + 7 = 12. Delen på nivå .1 (200-010, 1 + 4 = 5) stemmer. Konsekvensen nevner heller ikke at 04 tester den *lengste* av to stier (via Rygg er summen 1 + 3 + 7 = 11), selv om regelen står i l.232.
- *Vurdering:* Skriv konsekvensen om til tallene i 04 og legg til lengste sti. Ellers må noen lage et testtilfelle som ikke finnes.

**A2. FR-20 og FR-23: nye og fjernede deler har ingen testdata og ingen plass i formatet** (høy)
- *Hvor:* PRD l.358, l.367, l.393, l.396. TR l.146. Skript l.985–1012.
- *Funn:* FR-20 krever en egen linje i sammenligningen for en del som er lagt til eller fjernet. Testeksempel 03 har samme stykkliste som 02. Funksjonen `sammenligning()` lager bare linjer av typen Bestillingsforslag og Eksepsjon. Arket Sammenligning har kolonnene Hva, Endring, Varenummer, Uke, Før, Etter og Melding, uten noen type for deler. FR-23 sier at eksporten bygges som dette arket.
- *Vurdering:* Kravet kan verken testes mot fasit eller vises i eksportformatet. Lag et testtilfelle, for eksempel 02 med én del fjernet og én lagt til, og bestem hvordan linjen ser ut (Hva = «Del», Endring = «Ny»/«Fjernet»). Ellers bør konsekvensen strykes.

**A3. FR-20: kulepunktet strider mot identitetsregelen** (middels)
- *Hvor:* PRD l.356 mot l.365 og TR l.88.
- *Funn:* Kulepunktet sier bestillingsforslag «endret i mengde eller uke». Konsekvensen og testdataene sier at et forslag som flytter uke, vises som Fjernet og Nytt. «Endret uke» finnes ikke.
- *Vurdering:* Skriv l.356 om til «nye, endret i mengde, eller fjernet».

**A4. FR-3: eksempelet på innlimt type finnes ikke som testfil** (lav)
- *Hvor:* PRD l.153. VR l.33.
- *Funn:* PRD-en bruker «Delmontering» som eksempel. V-S17 bruker «Råvare (Kjøpes inn)». Begge er ugyldige typer.
- *Vurdering:* Bytt eksempelet i PRD-en til «Råvare (Kjøpes inn)», så det kan vises direkte til V-S17.

**A5. FR-3: feilen for ulike underdeler har tre forskjellige steder** (middels)
- *Hvor:* PRD l.159. VR l.37. Skript l.288, l.619–620.
- *Funn:* PRD-en krever at feilen nevner varenummeret og «begge radene». V-S22 oppgir sted «rad 12», som er underdelsraden. Skriptet melder rad 3 og rad 11, som er de to forekomstene av 200-001. Kontroll-kolonnen viser feilen i rad 12 og viser til rad 3.
- *Vurdering:* Bestem hvilke rader feilen skal nevne, helst de to forekomstene (3 og 11), og rett Sted i VR l.37 eller ordlyden i PRD-en så de stemmer.

**A6. FR-5: «forskjøvet én uke» stemmer ikke helt med 02 og 04** (lav)
- *Hvor:* PRD l.179. TR l.123.
- *Funn:* I 02 og 04 har ferdigproduktet lager, SS og (i 04) et planlagt mottak. Bruttobehovet på nivå .1 er derfor netto og forskjøvet, ikke bare prognostiserte behov forskjøvet. I 02 er bruttobehovet i uke 1 45 (15 forfalt + 30), deretter prognostiserte behov(t+1), og 0 i uke 10. Ingen testdata har bare en ren forskyvning (L = 1, lager 0, SS 0).
- *Vurdering:* Skriv at bruttobehovet på .1 er frigivelsene for ferdigproduktet, og vis til tallene i 02. Alternativt kan et rent tilfelle legges til.

**A7. Dekningstabellen viser feil nivå for FR-8** (lav)
- *Hvor:* TR l.134 mot PRD l.220.
- *Funn:* Dekningstabellen oppgir «02 (100-001 → 200-001)», som er nivå 0 → .1. Konsekvensen i PRD-en gjelder nivå .1 → delene under. 02 dekker det likevel: 200-001 har 20 forfalt, og det blir bruttobehov for 300-001 og 300-002 i uke 1.
- *Vurdering:* Legg til «200-001 → 300-001/300-002» i dekningstabellen.

**A8. TR l.58: gammelt varenummer for testeksempel 01** (lav)
- *Hvor:* TR l.58 mot TR l.49, skript l.84 og l.110 og fasit 01 (Status).
- *Funn:* «Den har nå også en tabell for ferdigproduktet 100-001.» Ferdigproduktet i 01 er 100-002.
- *Vurdering:* Rett til 100-002. Feilen er viktig for FR-19, der ferdigproduktet kjennes igjen på varenummeret.

**A9. TR l.6 og l.15: antall og begrep** (lav)
- *Funn:* TR l.6 sier «5–10 komponenter», men 04 har 14 deler (TR l.21). TR l.6 og l.15 bruker «komponenter» som samlebegrep, som ordbanken (merknad 1) sier ikke skal brukes.
- *Vurdering:* Skriv «deler» og «5–14 deler» (eller «02 har 5–10 deler, som SM-1 krever»).

---

## 2. Dekningsgap

### 2.1 FR-er og NFR-er med testbare konsekvenser uten testtilfelle i dekningstabellen

**B1. FR-10: felles del både rett under ferdigproduktet og lenger ned** (middels)
- *Hvor:* PRD l.245. Skript l.397.
- *Funn:* Regelen om at «Leveranse til kunde blir forsinket» gjelder, er bestemt (2026-11-02, bekreftet 2026-11-05), men ikke testet. 04 300-023 har nettopp denne strukturen (.1 og ..2), men får ingen eksepsjon (fasit 04).
- *Vurdering:* Juster 300-023 i 04, for eksempel med lavere lager, så delen får Bestilling forsinket, eller legg til en egen del.

**B2. FR-4 og FR-19: valideringsfeil endrer ikke den lagrede kjøringen** (middels)
- *Hvor:* PRD l.167, l.350.
- *Funn:* Dekningstabellen har ingen rad for dette. Det kan testes med testdata som allerede finnes: 02 → V-F05 → 03 skal vise sammenligningen 02 → 03 fra fasit 03.
- *Vurdering:* Legg til en rad i dekningstabellen. Ingen nye filer trengs.

**B3. NFR-5: ytelsesfilen finnes ikke** (middels)
- *Hvor:* PRD l.442. Skript l.1361–1388.
- *Funn:* PRD-en sier at testfilen med 1000 rader lages med `lag_testdata.py`. Skriptet har ingen slik funksjon. Den eneste store filen er V-S03 med 1001 rader, og den er ugyldig med vilje. Det finnes ingen gyldig fil med 1000 rader, tre nivåer og 12 uker, og ingen rad for NFR-5 i dekningstabellen.
- *Vurdering:* Legg til en gyldig ytelsesfil i skriptet, eller skriv i NFR-5 hvem som lager den og når.

**B4. FR-6: mottak i uke H fremskyndet helt til uke 1** (lav)
- *Hvor:* PRD l.201.
- *Funn:* Den lengste fremskyndingen i testdataene er fra uke 5 til uke 2 (04 300-028) og fra uke 3 til uke 1 (04 300-026). Ingen mottak flyttes fra uke H.
- *Vurdering:* Et lite tilfelle i 04 (mottak i uke 12, behov i uke 1) dekker det.

**B5. FR-29: et fremskyndet mottak kan ikke få Kanseller mottak** (lav)
- *Hvor:* PRD l.275.
- *Funn:* Ingen del er laget for å teste dette. Det dekkes bare indirekte, fordi `kontroller()` krever nøyaktig de forventede eksepsjonene (skript l.1340–1346).
- *Vurdering:* Kan stå som det er, eller legges i dekningstabellen med 04 300-026/300-028 som henvisning.

**B6. Konsekvenser som viser til testdata, men mangler i dekningstabellen** (lav)
- FR-14 l.294–296 (H ukekolonner, én tabell for felles del): fasittabellene.
- FR-16 l.312 (rekkefølgen i stykklisten, felles del der den står første gang): fasittabell 04, der 300-023 står under Sete.
- FR-18 l.332–334 (tallene i forklaringen, bidrag per overordnet del): arket Utregning i fasitene, som allerede viser «4 × … + 2 × …».
- FR-22 l.387, FR-23 l.396–397, FR-24 l.408, FR-27 l.434.
- *Vurdering:* Legg dem til i dekningstabellen så stories kan vise til dem. Ingen nye filer trengs.

**B7. FR-23: arket Sammenligning i fasiten har to retninger** (lav)
- *Hvor:* PRD l.396. TR l.20.
- *Funn:* Fasit 03 har to seksjoner (02 → 03 og 03 → 02). En eksport har bare én retning.
- *Vurdering:* Presiser at eksporten etter 02 → 03 skal ha linjene fra den første seksjonen.

**B8. FR-2: hjelpekolonnene er ikke testet med verdier fra Excel** (middels)
- *Hvor:* PRD l.126. TR l.43. Skript l.719–727.
- *Funn:* Alle testfilene er laget med openpyxl. Formlene i Kontroll og AA–AD finnes i alle 1000 rader, men har ingen lagrede verdier. Når appen leser filene, er hjelpekolonnene derfor tomme. En fil brukeren har lagret i Excel har tekst i Kontroll og tall eller "" i AA–AD i alle rader. Den ser annerledes ut for en leser som avgjør «tom rad» eller «antall rader» ut fra alle kolonner.
- *Vurdering:* Legg testeksempel 01 lagret i Excel inn som egen valideringsfil (gyldig, 0 feil), eller skriv i PRD-en at bare kolonnene A–H (A–C i Planlagte mottak, A–B i MPS) avgjør om en rad er tom.

**B9. FR-25 og FR-26: fast partistørrelse** (lav, kjent)
- *Hvor:* TR l.147, PRD l.401.
- *Funn:* Ikke laget ennå. PRD-en sier det samme. Ingen handling nå.

### 2.2 Regler i FR-3 uten valideringsfil

Alle radene i FR-3-tabellen har minst én fil. Noen deler av reglene har likevel ingen fil:

| # | Regel (PRD l.) | Hva mangler | Alvor |
|---|---|---|---|
| C1 | Nivå (l.138) | Nivå tomt i en rad som ellers er fylt ut. Kontroll har «Mangler nivå» (skript l.581) | Lav |
| C2 | Type (l.142) | Type tom. V-S17 er en ugyldig verdi, ikke en tom celle | Lav |
| C3 | Lagerbeholdning, Sikkerhetslager (l.144) | SS mangler første gang, SS fylt ut andre gang, lager eller SS som tekst. Bare lager er testet (S23, S25, S26), SS bare med desimal (S24) | Lav |
| C4 | Ledetid (l.145) | Negativ ledetid på nivå 0 (delen «≥ 0 for nivå 0»), ledetid med desimal eller tekst | Lav |
| C5 | MPS (l.146) | Horisont over 12 (13 uker). Bare 7 uker er testet (V-M03). Malen har 12 rader, men brukeren kan skrive i rad 14 eller bruke et annet regneark | Middels |
| C6 | Planlagte mottak, Uke (l.148) | Uke som ikke er et heltall (2,5 eller tekst). V-P02 og V-P03 tester bare området | Lav |
| C7 | Planlagte mottak, Antall (l.149) | Antall som tekst. UJ-4 (l.61) bruker nettopp «ca. 40», men V-P04 tester bare 0 | Middels |
| C8 | Underdeler (l.143, l.159) | Annet antall alene og annen underdel alene. V-S22 har begge feilene samtidig (300-001 × 2, og 300-002 mangler) | Lav |
| C9 | Rader (l.137) | Stykklisten starter i rad 3 (rad 2 tom). V-S01 tester bare en tom rad midt i | Lav |

---

## 3. Det testdataene dekker eller forutsetter, men PRD-en ikke sier

**D1. Er ordlyden i eksepsjonsmeldingene et krav?** (høy)
- *Hvor:* PRD l.283 (FR-13: «samme … melding»), l.439 (NFR-2). Skript l.391–434. VR l.5.
- *Funn:* For valideringsfeil sier VR l.5 at appen bestemmer ordlyden. For eksepsjoner krever FR-13 at meldingen er identisk med fasit 01, og NFR-2 tester alle fasitene. Da blir ordlyden fra skriptet et krav, selv om PRD-en bare sier hva meldingen skal inneholde. Eksempler på ordlyd som bare står i skriptet:
  - Mottak forsinket starter med «Lager blir X i uke t, under sikkerhetslager SS, før mottaket kommer» (FR-12, l.261, nevner ikke lageret).
  - Bruk av sikkerhetslager mangler «, før horisonten», som Bestilling forsinket har, selv om frigivelsen er forfalt i begge (skript l.404).
  - Ledetid overskrider horisont bruker formatet «(10 uker: Kontorstol Basic 0 + Stolfot 10)».
- *Vurdering:* Bestem ett av to: (a) fasitens melding er ordlyden appen skal ha, og PRD-en sier det i FR-9–FR-12 og FR-29, eller (b) testene sammenligner varenummer, uke og type og sjekker bare at meldingen har innholdet PRD-en krever. I begge tilfeller bør meldingen for Bruk av sikkerhetslager vurderes på nytt.

**D2. Hvilken disponibel beholdning avgjør Bestilling forsinket eller Bruk av sikkerhetslager når et mottak er fremskyndet i samme uke?** (middels)
- *Hvor:* PRD l.241, l.253. Skript l.319–343 og l.403–420. Fasit 04 300-026.
- *Funn:* Skriptet bruker disponibel *etter* fremskyndingen. 300-026 i uke 1 har −40 før og −10 etter. Meldingen for Bestilling forsinket sier «Lager blir −10», og meldingen for Mottak forsinket i samme celle sier «Lager blir −40». Hadde fremskyndingen løftet disponibel til mellom 0 og SS, ville typen blitt Bruk av sikkerhetslager i stedet for Bestilling forsinket. PRD-en sier bare «disponibel(t)».
- *Vurdering:* Skriv i FR-10 og FR-11 at det er disponibel etter fremskyndede mottak. Vurder om to ulike «Lager blir»-tall i samme celle er forståelig (SM-3).

**D3. Underdeler bare under en senere forekomst** (middels)
- *Hvor:* PRD l.143. TR l.34. Skript l.281–289 og l.606–620.
- *Funn:* PRD-en og TR sier «bare under første forekomst eller likt under hver forekomst». Skriptet bruker den første forekomsten *som har* underdeler som mal. Kontroll-formelen sammenligner med den første ..2-raden med samme overordnede del. Begge godtar derfor underdeler bare under andre forekomst. De godtar også underdeler under første og tredje forekomst, men ikke under andre. Ingen valideringsfil tester dette.
- *Vurdering:* Bestem regelen. Enten skriver PRD-en «under én av forekomstene eller likt under alle», eller skriptet og Kontroll strammes inn. Legg til en valideringsfil uansett.

**D4. Hva er en «utfylt» uke når verdien er ugyldig?** (middels)
- *Hvor:* PRD l.79, l.146. VR l.48. Skript l.788, l.816.
- *Funn:* V-M04 har «tretti» i uke 2 og forventer én feil. Det forutsetter at appen regner en celle med tekst som utfylt når horisonten telles. Ellers blir H = 1, og det blir følgefeil (horisont under 8, hull, mottak etter horisonten). Malen teller horisonten med `COUNT`, som bare teller tall, og ville gitt H = 1.
- *Vurdering:* Skriv i FR-3 at en uke er utfylt når cellen ikke er tom, uansett verdi. Horisonten (l.79) avgjøres av ikke-tomme celler.

**D5. Regel om følgefeil utenfor FR-2** (middels)
- *Hvor:* PRD l.128 (bare ark eller overskrift som mangler). VR l.9–11.
- *Funn:* Valideringsfilene forutsetter at det ikke blir følgefeil i flere tilfeller som PRD-en ikke nevner:
  - V-S05 og V-S19 har ingen rad med Ferdigvare. Det gir ikke en egen feil.
  - V-S07 (..2 rett under 0) har rader på ..2 uten noen .1 over seg. Det gir én feil.
  - V-S01 (tom rad) virker likt enten appen slutter å lese ved den tomme raden eller ikke. PRD-en bestemmer ikke hva som gjelder.
  - V-F03 (Stykkliste mangler) forutsetter at varenumrene i Planlagte mottak ikke kontrolleres.
- *Vurdering:* Legg til en generell regel i FR-3 eller FR-4: én feil per årsak og ingen følgefeil. Bestem om appen leser videre etter en tom rad i Stykkliste.

**D6. Planlagte mottak: tomme og halvt utfylte rader** (middels)
- *Hvor:* PRD l.147–149. Skript l.814.
- *Funn:* FR-3 har ingen regel for en tom rad midt i Planlagte mottak, eller for en rad med varenummer uten uke eller antall. Malen viser neste rad bare når raden over er fylt ut, men det kan omgås med innliming eller et annet regneark (PRD l.110). Ingen testfil dekker det.
- *Vurdering:* Legg til en regel for rader i Planlagte mottak, tilsvarende Stykkliste-raden i l.137 («alle tre feltene fylt ut, tomme rader …»), og minst én valideringsfil.

**D7. Samme underdel to ganger under samme overordnede del** (lav)
- *Hvor:* VR l.18 (V-S03). Skript l.1170, l.1179, l.290.
- *Funn:* V-S03 har 993 rader 300-001 under Sete og forventer bare feilen om over 1000 rader. Det forutsetter at gjentatte rader under samme overordnede del er gyldige. Skriptet summerer dem (antall × antall rader). PRD-en sier ikke noe om dette.
- *Vurdering:* Skriv i FR-3 (Underdeler) om det er gyldig og legges sammen, eller lag V-S03 med ulike varenumre.

**D8. Nivå og varenummer som tekst eller tall** (lav)
- *Hvor:* Skript l.718 (Nivå er formatert som tekst, «ellers gjør Excel .1 om til tallet 0,1») og l.583 (`&""`). Veiledning: «Bindestreken gjør at Excel lagrer nummeret som tekst.»
- *Funn:* PRD-en sier ikke hvordan appen tolker en tallcelle 0 eller 0,1 i Nivå, eller et varenummer lagret som tall (for eksempel 1001) i det ene arket og som tekst i det andre.
- *Vurdering:* Skriv i FR-3 at Nivå og Varenummer leses som tekst (tallet 0 = «0»), og at varenumrene sammenlignes som tekst.

**D9. Sortering av eksepsjoner og bestillingsforslag** (lav)
- *Hvor:* PRD l.283, l.317. Skript l.435–440, l.982.
- *Funn:* Fasitene sorterer eksepsjonene etter stykklisten, med «–» først og så uke. I samme uke kommer Bestilling forsinket eller Bruk av sikkerhetslager før Mottak forsinket, og Mottak forsinket før Kanseller mottak. Bestillingsforslagene sorteres etter uke og så etter stykklisten. PRD-en sier bare «sortert etter uke», og FR-13 sier ikke om rekkefølgen teller.
- *Vurdering:* Skriv rekkefølgen i FR-17, eller skriv at testene ikke sjekker rekkefølgen.

**D10. Hvilket nivå vises for en del som står på to nivåer?** (lav)
- *Hvor:* PRD l.291. TR l.101.
- *Funn:* FR-14 sier at hver del vises med nivå. 04 300-023 står på både .1 og ..2. Fasittabellen viser ikke nivå.
- *Vurdering:* Bestem første forekomst, lavnivåkoden eller begge nivåene.

**D11. Hvilken celle fremheves** (lav)
- *Hvor:* PRD l.300. Skript l.1063.
- *Funn:* Fasittabellen farger cellen for Nettobehov i eksepsjonsuken. PRD-en sier bare «en celle for en uke og del».
- *Vurdering:* Presiser raden, eller la det stå til UX.

**D12. Teksten i malen bryter med PRD-en og ordbanken** (middels)
- *Hvor:* Skript l.850–860 (Veien videre), l.65–73 (Veiledning-eksempelet). PRD l.20, l.434. Ordbanken l.91, l.137.
- *Funn:* Veien videre bruker «varsel» og «komponent» og lister bare fire eksepsjonstyper (Kanseller mottak mangler). PRD-en og ordbanken bestemte 2026-11-05 at det skal være «eksepsjon» og «del» overalt, med fem typer. Eksempelet i Veiledning bruker 100-001 «Kontorstol Basic». I testdataene er 100-002 Kontorstol Basic og 100-001 Kontorstol Pro. FR-27 krever at malen appen tilbyr, er identisk med filen, så teksten når brukeren.
- *Vurdering:* Oppdater teksten i malen (skriptet), og bytt varenummer eller navn i eksempelet så det ikke kolliderer med testeksemplene.

**D13. Planlagt mottak på ferdigproduktet** (lav)
- *Hvor:* TR l.98 (04 100-003, produksjonsordre). PRD l.85, l.147.
- *Funn:* PRD-en tillater det indirekte (varenummeret finnes i Stykkliste, og planlagt mottak omfatter produksjonsordrer), men sier det ikke.
- *Vurdering:* Gjerne én setning i FR-6 eller i ordlisten.

---

## 4. Forslag til rekkefølge

1. D1 og A2 (høy): bestem hvordan meldingene testes, og løs eller stryk nye og fjernede deler i FR-20 og FR-23.
2. D2, D3, D4, D5, D6 (middels): presiser reglene i FR-3, FR-10 og FR-11, og legg til valideringsfiler for D3, D6, C5 og C7.
3. A1, A3, A5, B1, B2, B3, B8, D12 (middels): rett PRD-teksten, dekningstabellen og malen.
4. Resten (lav) ved neste gjennomgang av PRD-en og README.
