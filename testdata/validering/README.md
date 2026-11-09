# Valideringstilfeller

Filene her tester valideringen før beregningen (PRD FR-1–FR-4). De lages av `lag_testdata.py` (`--alle`) og bygger på testeksempel 02. Hver fil har nøyaktig én feil, unntatt V-F05 (tre feil på tre ark, FR-4), V-F06 (en strukturfeil og en verdifeil) og G-filene (gyldige grenseverdier, ingen feil). V-F04 er ikke en Excel-fil og skal avvises (FR-1).

V-F07–F09 tester robust feilhåndtering (PRD NFR-9): en skadet `.xlsx`-fil, en tom fil på 0 byte og en tekstfil, alle med endelsen `.xlsx`. Hver av dem skal gi en forståelig melding på norsk, ikke en liste over valideringsfeil. Appen skal ikke stoppe eller henge, ingen beregning gjøres, og den lagrede kjøringen endres ikke. Etterpå skal testeksempel 01 kunne lastes opp og gi riktig resultat uten at siden lastes på nytt.

Kolonnen «Feil» er antall valideringsfeil appen skal vise. Sted er cellen eller raden feilen gjelder. Ordlyden i feilmeldingen bestemmer appen, men den skal oppgi ark, rad eller celle, felt og årsak (FR-4).

Antagelser:

- Mangler et ark eller en overskrift (FR-2), kontrolleres likevel de verdiene som ikke avhenger av det som mangler (FR-3). Kontroller som avhenger av det, hoppes over: uten MPS er horisonten ukjent, så ukene i Planlagte mottak kontrolleres ikke, og uten overskriften «Ledetid (uker)» kontrolleres ikke ledetidene. V-F01–F03 har ingen andre feil og gir én feil. V-F06 har i tillegg en verdifeil og gir to (bestemt av Sebastian 2026-11-05).
- V-S05 og V-S19 har ingen rad med typen Ferdigvare. Det regnes ikke som en egen feil.
- V-S01 har ingen planlagte mottak for delene under den tomme raden, så det blir ikke en ekstra feil om appen slutter å lese ved den tomme raden.
- V-S03 har 1001 rader, så rad 1002 ligger utenfor malens 1000 rader.

| Fil | Tilfelle | Feil | Ark | Sted | Felt | Regel |
|---|---|---|---|---|---|---|
| `V-S01.xlsx` | Tom rad midt i stykklisten | 1 | Stykkliste | rad 9 | Rader | FR-3: rader sammenhengende fra rad 2 |
| `V-S02.xlsx` | Ingen rad med nivå .1 | 1 | Stykkliste | rad 2 | Rader | FR-3: minst én rad med nivå .1 |
| `V-S03.xlsx` | 1001 rader i stykklisten | 1 | Stykkliste | rad 1002 | Rader | FR-3: inntil 1000 rader |
| `V-S04.xlsx` | Ugyldig nivå «3» | 1 | Stykkliste | A8 | Nivå | FR-3: nivå er 0, .1 eller ..2 |
| `V-S05.xlsx` | Første rad er nivå .1 | 1 | Stykkliste | A2 | Nivå | FR-3: første rad er 0 |
| `V-S06.xlsx` | To rader med nivå 0 | 1 | Stykkliste | A11 | Nivå | FR-3: ingen andre rader er 0 |
| `V-S07.xlsx` | Nivå ..2 rett under nivå 0 | 1 | Stykkliste | A3 | Nivå | FR-3: ..2 står rett under .1 eller ..2 |
| `V-S08.xlsx` | Varenummer mangler | 1 | Stykkliste | B8 | Varenummer | FR-3: varenummer fylt ut |
| `V-S09.xlsx` | Del står under seg selv | 1 | Stykkliste | B6 | Varenummer | FR-3: en del kan ikke stå under seg selv |
| `V-S10.xlsx` | Beskrivelse mangler | 1 | Stykkliste | C9 | Beskrivelse | FR-3: beskrivelse fylt ut |
| `V-S11.xlsx` | Annen beskrivelse for samme varenummer | 1 | Stykkliste | C7 | Beskrivelse | FR-3: lik beskrivelse for samme varenummer |
| `V-S12.xlsx` | Antall fylt ut for nivå 0 | 1 | Stykkliste | D2 | Antall | FR-3: antall tom for nivå 0 |
| `V-S13.xlsx` | Antall mangler | 1 | Stykkliste | D9 | Antall | FR-3: antall heltall ≥ 1 |
| `V-S14.xlsx` | Antall 0 | 1 | Stykkliste | D9 | Antall | FR-3: antall heltall ≥ 1 |
| `V-S15.xlsx` | Antall med desimal (1,5) | 1 | Stykkliste | D4 | Antall | FR-3: antall heltall ≥ 1 |
| `V-S16.xlsx` | Antall er tekst («fem») | 1 | Stykkliste | D9 | Antall | FR-3: antall heltall ≥ 1 |
| `V-S17.xlsx` | Type som ikke finnes i listen («Råvare (Kjøpes inn)») | 1 | Stykkliste | E8 | Type | FR-3: type fra listen |
| `V-S18.xlsx` | Ferdigvare på nivå .1 | 1 | Stykkliste | E9 | Type | FR-3: Ferdigvare bare på nivå 0 |
| `V-S19.xlsx` | Nivå 0 er ikke Ferdigvare | 1 | Stykkliste | E2 | Type | FR-3: Ferdigvare på nivå 0 |
| `V-S20.xlsx` | Annen type for samme varenummer | 1 | Stykkliste | E7 | Type | FR-3: lik type for samme varenummer |
| `V-S21.xlsx` | Del som kjøpes inn, har underdeler | 1 | Stykkliste | E3 | Type | FR-3: en del som kjøpes inn, har ingen rader under seg |
| `V-S22.xlsx` | Ulike underdeler under samme del | 1 | Stykkliste | rad 12 | Underdeler | FR-3: underdelene er like under hver forekomst |
| `V-S23.xlsx` | Negativ lagerbeholdning | 1 | Stykkliste | F9 | Lagerbeholdning | FR-3: heltall ≥ 0 |
| `V-S24.xlsx` | Sikkerhetslager med desimal (2,5) | 1 | Stykkliste | G4 | Sikkerhetslager | FR-3: heltall ≥ 0 |
| `V-S25.xlsx` | Lagerbeholdning mangler første gang varenummeret står | 1 | Stykkliste | F8 | Lagerbeholdning | FR-3: fylt ut første gang |
| `V-S26.xlsx` | Lagerbeholdning fylt ut andre gang varenummeret står | 1 | Stykkliste | F7 | Lagerbeholdning | FR-3: tom de neste gangene |
| `V-S27.xlsx` | Ledetid 0 for en komponent | 1 | Stykkliste | H9 | Ledetid (uker) | FR-3: heltall ≥ 1 (≥ 0 for nivå 0) |
| `V-S28.xlsx` | Ledetid mangler | 1 | Stykkliste | H10 | Ledetid (uker) | FR-3: fylt ut første gang |
| `V-S29.xlsx` | Ledetid fylt ut andre gang varenummeret står | 1 | Stykkliste | H7 | Ledetid (uker) | FR-3: tom de neste gangene |
| `V-M01.xlsx` | Negativt antall i MPS | 1 | MPS | uke 3 | Antall per uke | FR-3: heltall ≥ 0 |
| `V-M02.xlsx` | Uke fylt ut etter et hull (uke 9 tom, uke 10 fylt) | 1 | MPS | uke 10 | Antall per uke | FR-3: ingen uke fylt ut etter et hull |
| `V-M03.xlsx` | Horisont på 7 uker | 1 | MPS | uke 8 | Antall per uke | FR-3: horisonten er 8–12 uker |
| `V-M04.xlsx` | Antall er tekst («tretti») | 1 | MPS | uke 2 | Antall per uke | FR-3: heltall ≥ 0 |
| `V-M05.xlsx` | Antall med desimal (30,5) | 1 | MPS | uke 2 | Antall per uke | FR-3: heltall ≥ 0 |
| `V-P01.xlsx` | Varenummer som ikke finnes i Stykkliste | 1 | Planlagte mottak | A3 | Varenummer | FR-3: varenummer finnes i Stykkliste |
| `V-P02.xlsx` | Uke 0 | 1 | Planlagte mottak | B3 | Uke | FR-3: uke fra 1 til H |
| `V-P03.xlsx` | Uke etter horisonten (uke 11, H = 10) | 1 | Planlagte mottak | B3 | Uke | FR-3: uke fra 1 til H |
| `V-P04.xlsx` | Antall 0 | 1 | Planlagte mottak | C3 | Antall | FR-3: antall heltall ≥ 1 |
| `V-F01.xlsx` | Arket MPS mangler | 1 | MPS | – | Ark | FR-2: arkene Stykkliste, MPS og Planlagte mottak finnes |
| `V-F02.xlsx` | Kolonneoverskriften «Ledetid (uker)» mangler | 1 | Stykkliste | H1 | Overskrift | FR-2: kolonneoverskriftene fra malen |
| `V-F03.xlsx` | Fil etter den gamle malen (arkene Produkt og Komponenter) | 1 | Stykkliste | – | Ark | FR-2: gammel mal gir feil om at Stykkliste mangler |
| `V-F04.csv` | Fil som ikke er .xlsx (CSV) | avvist | – | – | Fil | FR-1: bare .xlsx tas imot |
| `V-F07.xlsx` | Skadet .xlsx-fil: testeksempel 02 kuttet på midten | avvist | – | – | Fil | NFR-9: forståelig melding, ingen beregning, ny fil kan lastes opp |
| `V-F08.xlsx` | Tom fil (0 byte) med endelsen .xlsx | avvist | – | – | Fil | NFR-9: forståelig melding, ingen beregning, ny fil kan lastes opp |
| `V-F09.xlsx` | Tekstfil med endelsen .xlsx | avvist | – | – | Fil | NFR-9: forståelig melding, ingen beregning, ny fil kan lastes opp |
| `V-F05.xlsx` | Tre feil på tre ark | 3 | Stykkliste, MPS, Planlagte mottak | D9, uke 3, B2 | Antall, Antall per uke, Uke | FR-4: alle feilene vises samlet (3 feil) |
| `V-F06.xlsx` | Strukturfeil og verdifeil i samme fil: overskriften «Ledetid (uker)» mangler, og et mottak har antall 0 | 2 | Stykkliste, Planlagte mottak | H1, C3 | Overskrift, Antall | FR-2 og FR-4: verdier som ikke avhenger av kolonnen som mangler, kontrolleres likevel (2 feil) |
| `V-G01.xlsx` | Gyldig: horisont 8 uker | 0 | – | – | – | FR-3: grenseverdi, ingen feil |
| `V-G02.xlsx` | Gyldig: horisont 12 uker | 0 | – | – | – | FR-3: grenseverdi, ingen feil |
| `V-G03.xlsx` | Gyldig: tomt ark Planlagte mottak | 0 | – | – | – | FR-3: tomt ark er gyldig, ingen feil |
| `V-G04.xlsx` | Gyldig: del med underdeler to ganger, likt og bare første gang | 0 | – | – | – | FR-3: underdeler like eller bare første gang, ingen feil |
