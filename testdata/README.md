# Testdata

Denne mappen samler Excel-malen og testeksemplene for COSI - MRP.

- **Excel-mal:** den faste malen brukeren laster opp (MPS, flernivå BOM, lagerstatus, planlagte mottak, ledetid og sikkerhetslager).
- **Testeksempler med fasit:** fiktive datasett (5–10 komponenter, 8–12 uker) med manuelt utregnede fasittabeller per uke og komponent. Disse brukes som grunnlag for automatiske tester av beregningsmotoren og eksepsjonene.

Sensor kan bruke filene her for å prøve appen direkte etter README i roten av repoet.

## Filer

| Fil | Innhold |
|---|---|
| `COSI-MRP-mal.xlsx` | Tom mal. Ark: Veiledning, Stykkliste, MPS, Planlagte mottak, Veien videre. Brukeren fyller kun ut gule celler. |
| `testeksempel-01.xlsx` | Malen utfylt for en fiktiv kontorstolprodusent: 8 komponenter (300-001–300-008) på nivå .1, alle innkjøpt, 10 uker. Laget med den gjeldende malen. |
| `testeksempel-01-fasit.xlsx` | Fasit med arkene Regler, Fasittabell (per uke og del), Eksepsjoner, Utregning (steg for steg), Materiell (lavnivåkode per del) og Bestillingsforslag (FR-17). |
| `testeksempel-02.xlsx` | Malen utfylt for Kontorstol Pro: 8 deler på tre nivåer (0, .1, ..2), felles del, 10 uker. Laget med den gjeldende malen. |
| `testeksempel-02-fasit.xlsx` | Fasit for testeksempel 02, med de samme arkene som fasit 01. |
| `testeksempel-03.xlsx` | Testeksempel 02 med MPS i uke 2 økt fra 30 til 45. Brukes til før/etter-sammenligningen (FR-20). |
| `testeksempel-03-fasit.xlsx` | Fasit for testeksempel 03, med et ekstra ark Sammenligning: forskjellene mellom 02 og 03 begge veier. |
| `testeksempel-04.xlsx` | Grensetilfeller: Kontorstol Ergo, 14 deler på tre nivåer, 12 uker. |
| `testeksempel-04-fasit.xlsx` | Fasit for testeksempel 04, med de samme arkene som fasit 01. |
| `validering/` | Valideringstilfeller: én fil per regel i FR-1–FR-4, med forventet resultat i `validering/README.md`. |
| `lag_testdata.py` | Skriptet som lager filene. `uv run --with openpyxl python lag_testdata.py testdata` lager bare malen. Legg til `--alle` for også å lage testeksemplene, fasitene og valideringstilfellene. Med `--alle` kontrollerer skriptet først at hvert testeksempel gir nøyaktig de eksepsjonene det skal teste, og stopper ellers. Filene lagres med fast tid, så en ny kjøring gir like filer når innholdet er likt. |

## Malens struktur

- **Veiledning:** hvordan malen fylles ut. Arknavnene er lenker til arkene.
- **Stykkliste:** Nivå, Varenummer, Beskrivelse, Antall, Type, Lagerbeholdning, Sikkerhetslager, Ledetid (uker). Én rad per del ovenfra og ned (inntil 1000). Erstatter de tidligere arkene Produkt og Komponenter.
  - Nivå velges fra en nedtrekksliste: 0 (ferdigproduktet, alltid første rad og bare én), .1 (hovedkomponenter) og ..2 (delene som trengs for å bygge hovedkomponenten rett over). Rett under 0 kan bare .1 velges, og ..2 kan bare stå under .1 eller ..2. Fra ..2 kan man gå opp igjen til .1. Listen ligger i den skjulte kolonnen Z.
  - De skjulte kolonnene AA og AB lager en liste over varenumrene uten dubletter. Navnet `Varenumre` peker på den og vokser med antall ulike varenumre. De skjulte kolonnene AC og AD brukes av underdelskontrollen: AD er raden til nærmeste .1 over, og AC er varenummeret til delen over for en ..2-rad.
  - Antall er antall per enhet av delen over, og står tomt (grått) for nivå 0. Type velges fra en liste: Ferdigvare, Komponent (Kjøpes inn) og Komponent (Produseres selv). Ferdigvare brukes bare på nivå 0.
  - Samme del kan stå flere steder (f.eks. skruer). Lagerbeholdning, sikkerhetslager og ledetid fylles bare ut første gang varenummeret står, og cellene er grå de neste gangene.
  - Kolonnen «Kontroll» viser hva som mangler eller ikke stemmer i hver rad, bl.a. brudd på nivåreglene (første rad er 0, bare ett nivå 0, ..2 rett under .1 eller ..2), verdier i Nivå og Type som ikke finnes i nedtrekkslistene (f.eks. etter innliming), ulik beskrivelse eller type for samme varenummer, deler som kjøpes inn og likevel har underkomponenter, og ulike underdeler når en del med underdeler står flere steder (PRD FR-3). Underdelene kan stå bare under første forekomst eller likt under hver forekomst, i hvilken som helst rekkefølge.
  - Neste rad kommer frem når nivå og varenummer i raden over er fylt ut.
  - Varenummer: forslaget er varegruppe-løpenummer, f.eks. 100-001 (ferdigvare), 200-001 (komponent som produseres selv), 300-001 (komponent som kjøpes inn).
- **MPS** (en periode kalt «Prognostiserte behov»): uke 1–12 og antall ferdigprodukter. Åtte uker (minste horisont) vises fra start, og neste uke kommer frem når ukene over er fylt ut. Horisonten er antall sammenhengende utfylte uker fra uke 1 (8–12).
- **Planlagte mottak:** Varenummer, Uke, Antall. Varenummer velges fra en nedtrekksliste med varenumrene i Stykkliste, som oppdateres av seg selv. Én rad per mottak (innkjøp eller produksjonsordre som allerede er startet), og neste rad kommer frem når raden over er fylt ut (inntil 200). Arket kan stå tomt.
- **Veien videre:** hva brukeren gjør etter utfylling. Utkast, bygges ut etter hvert som appen utvikles.

Det skal ikke limes inn data i celler med nedtrekksliste (Nivå og Type i Stykkliste, Varenummer i Planlagte mottak). Innliming fjerner listen og valideringen i cellen. Regelen står i Veiledning, og Kontroll-kolonnen fanger opp ugyldige nivåer og typer.

Radene som «kommer frem» er laget med betinget formatering og datavalidering, ikke makroer, slik at malen forblir en vanlig `.xlsx`. Alle rader finnes i filen fra start, men ser blanke ut til de åpnes, og det går ikke an å skrive i dem før da. Kolonnene til høyre for tabellene (Kontroll, lenke tilbake til veiledningen og de skjulte listekolonnene) er bare hjelpetekst og skal ikke leses inn av appen.

## Testeksempel 01 – hva det dekker

| Del | Tilfelle |
|---|---|
| 100-002 Kontorstol Basic | Ferdigproduktet uten lager, sikkerhetslager og ledetid, så frigivelsene er lik MPS |
| 300-001 Sete, 300-002 Rygg | Normalforløp uten eksepsjoner |
| 300-003 Hjul | Bestilling forsinket i uke 1 (behov i uke 1, lageret går under 0) |
| 300-004 Armlene | Bruk av sikkerhetslager i uke 1 |
| 300-005 Gassfjær | Mottak forsinket: behov i uke 3, planlagt mottak i uke 4 må fremskyndes til uke 3. Mottaket står i uke 4 i tabellen, lageret er 0 i uke 3, og det lages ingen ny ordre for uke 3 |
| 300-006 Stolfot | Ledetid fra ferdigproduktet = horisont (grensetilfelle). Eksepsjonen slår til selv om lageret holder hele horisonten, fordi planen er for kort til å vise behov etter uke 10 |
| 300-007 Skruesett | Planlagt mottak som kommer i tide og trengs (verken Mottak forsinket eller Kanseller mottak) |
| 300-008 Trekk | Sikkerhetslager 0 og frigivelse nøyaktig i uke 1 |

**Status:** kontrollert. Fasiten følger PRD-reglene fra 2026-11-02 (FR-6/FR-12 fremskynding, FR-9 ledetid fra ferdigproduktet, FR-29 Kanseller mottak). Den har nå også en tabell for ferdigproduktet 100-002. Fasiten er beregnet med skriptet og kontrollert for hånd (2026-10-19, endringene for 300-005, 300-006 og 100-001 2026-11-02). Forfalte frigivelser legges i uke 1, og eksepsjonsmeldingen oppgir hvor mye av uke 1 som er forfalt. Forfalte ordremottak vises i uken behovet er, selv om de fysisk kommer senere.

`beregn()` i skriptet regner flernivå (nivå for nivå, felles deler én gang på lavnivåkoden). Testeksempel 01 har bare to nivåer. Testeksempel 02 har tre.

## Testeksempel 02 – hva det dekker

Carmen laget testeksempelet 2026-10-29 og kontrollerte fasiten for hånd 2026-10-24. Det ble laget på nytt med gjeldende mal og regler 2026-11-05. Typene Delmontering og Råvare (Kjøpes inn) er erstattet med Komponent (Produseres selv) og Komponent (Kjøpes inn). Lageret for 300-003 er 20 i stedet for 40, slik at tilfellet med sikkerhetslager er med. Et mottak på 50 i uke 5 for 300-005 er lagt til for Kanseller mottak.

| Del | Tilfelle |
|---|---|
| 100-001 Kontorstol Pro | Ferdigprodukt med lager, sikkerhetslager og ledetid 1. Bestilling forsinket i uke 1, og den forfalte frigivelsen blir behov på nivå .1 i uke 1 |
| 200-001 Sete | Produseres selv. Bestilling forsinket i uke 1 på grunn av den forfalte frigivelsen fra ferdigproduktet |
| 200-002 Rygg | Produseres selv. Planlagt mottak i uke 4 fremskyndes til uke 3 i egen produksjon (Mottak forsinket) |
| 300-001 Seteplate | Nivå ..2 under Sete, normalforløp |
| 300-002 Skruesett M6 | Felles del: 4 per sete + 2 per rygg, én tabell |
| 300-003 Ryggtrekk | Lageret er under sikkerhetslageret fra start (Bruk av sikkerhetslager i uke 1) |
| 300-004 Hjul | Normalforløp på nivå .1, ingen falske varsler |
| 300-005 Gassfjær | Ledetid fra ferdigproduktet 13 ≥ horisont 10, og et planlagt mottak som ikke trengs (Kanseller mottak) |

**Status:** kontrollert. Fasiten er beregnet med skriptet og kontrollert for hånd (Carmen 2026-10-24, endringene for 200-002, 300-002, 300-003, 300-005 og 200-001 Sebastian 2026-11-05).

## Testeksempel 03 – før/etter-sammenligning

Testeksempel 03 er testeksempel 02 med MPS i uke 2 økt fra 30 til 45. Det tester FR-20: last opp 02 og så 03, eller 03 og så 02. Arket Sammenligning i fasiten viser nøyaktig hva sammenligningen skal vise i begge retninger. Lastes samme fil opp to ganger, skal den vise «ingen endringer».

| Retning | Bestillingsforslag | Eksepsjoner |
|---|---|---|
| 02 → 03 | 7 med endret mengde, 1 nytt (300-002 uke 1) | Ny: 200-002 Mottak forsinket uke 2 og 300-004 Bruk av sikkerhetslager uke 1. Borte: 200-002 Mottak forsinket uke 3 |
| 03 → 02 | 7 med endret mengde, 1 fjernet (300-002 uke 1) | Det motsatte |

Regler for sammenligningen (bestemt 2026-11-05, PRD FR-20): Et bestillingsforslag er identifisert av varenummer og frigivelsesuke. Samme varenummer og uke med ny mengde er «Endret mengde». Flytter et forslag uke, vises det som «Fjernet» i den gamle uken og «Nytt» i den nye. En eksepsjon er identifisert av varenummer, uke og type. En endret melding alene er ingen endring.

**Status:** kontrollert. Beregnet med skriptet og kontrollert for hånd 2026-11-05.

## Testeksempel 04 – grensetilfeller

Testeksempel 04 samler tilfellene som ikke er dekket av 01–03. Horisonten er 12 uker (største), og MPS er 0 i uke 4 og 7.

| Del | Tilfelle |
|---|---|
| 100-003 Kontorstol Ergo | Planlagt mottak (produksjonsordre) på ferdigproduktet som kommer i tide |
| 300-022 Skruesett M8 | Under Sete og Rygg. Ledetid fra ferdigproduktet 1 + 4 + 7 = 12 = H langs den lengste stien, uten at noen enkelt ledetid er ≥ H. Bestilling forsinket i uke 7 med begge delene over i meldingen |
| 300-021 Ryggplate | Ledetid fra ferdigproduktet 11 = H − 1: ingen eksepsjon |
| 300-023 Monteringsbrakett | Står både på nivå .1 og ..2: én tabell på lavnivåkode 2, behov fra begge |
| 200-012 Armlene, 300-024, 300-025 | Del med underdeler som står to ganger med de samme underdelene i ulik rekkefølge. Underdelene telles én gang |
| 200-013 Fotkryss, 300-029 | Del med underdeler som står to ganger, med underdelene bare under første forekomst |
| 300-026 Låseskive | Mottaket er for lite: Mottak forsinket og Bestilling forsinket i samme uke |
| 300-027 Trekk | To planlagte mottak i samme uke legges sammen |
| 300-028 Hodestøtte | To planlagte mottak fremskyndes til samme uke: to Mottak forsinket i én celle |

**Status:** kontrollert. Beregnet med skriptet og kontrollert for hånd 2026-11-05.

## Dekning

Hvor hvert tilfelle i PRD-en testes. «Validering» betyr `validering/` (se README der).

| Krav | Tilfelle | Testes i |
|---|---|---|
| FR-1 | `.xlsx` godtas, annen fil avvises | 01–04, validering V-F04 |
| FR-2 | Ark eller overskrift mangler, gammel mal | validering V-F01–F03 |
| FR-2 / FR-4 | Strukturfeil og verdifeil i samme fil gir begge feilene | validering V-F06 |
| FR-3 | Hver regel i tabellen gir nøyaktig én feil | validering V-S01–S29, V-M01–M05, V-P01–P04 |
| FR-3 | Gyldige grenseverdier: horisont 8 og 12, tomt mottaksark, like underdeler | validering V-G01–G04, 01 (lager og SS 0), 04 (H = 12) |
| FR-4 | Tre feil på tre ark vises samlet | validering V-F05 |
| FR-5 | Ferdigprodukt uten lager og ledetid (frigivelse = MPS) | 01 |
| FR-5 | Ferdigprodukt med lager og ledetid 1 (behovet forskyves) | 02, 04 |
| FR-5 | Behov på nivå ..2 fra delen over, ikke fra MPS | 02, 04 |
| FR-28 | Felles del under to deler på samme nivå | 02 (300-002), 04 (300-022) |
| FR-28 | Felles del på både nivå .1 og ..2 | 04 (300-023) |
| FR-28 / FR-3 | Del med underdeler flere steder: like underdeler eller bare første gang | 04 (200-012, 200-013) |
| FR-6 / FR-12 | Mottak fremskyndes, innkjøp og egen produksjon | 01 (300-005), 02 (200-002) |
| FR-6 / FR-12 | Mottaket for lite: fremskyndet mottak og ny ordre i samme uke | 04 (300-026) |
| FR-6 / FR-12 | To mottak fremskyndes til samme uke | 04 (300-028) |
| FR-6 | To mottak i samme uke legges sammen | 04 (300-027) |
| FR-6 / FR-29 | Mottak i tide som trengs: ingen eksepsjon | 01 (300-007), 04 (100-003, 300-027) |
| FR-7 | Lager under SS før et fremskyndet mottak | 01 (300-005), 02 (200-002), 04 (300-028) |
| FR-8 | Forfalt frigivelse legges i uke 1, også på nivå .1 som behov for delene under | 01, 02 (100-001 → 200-001) |
| FR-8 | Frigivelse nøyaktig i uke 1 er ikke forfalt | 01 (300-008) |
| FR-9 | Én ledetid = H | 01 (300-006) |
| FR-9 | Ledetid fra ferdigproduktet > H | 02 (300-005) |
| FR-9 | Summen langs stien = H, ingen enkelt ledetid ≥ H, lengste sti av to | 04 (300-022) |
| FR-9 | Ledetid fra ferdigproduktet = H − 1: ingen eksepsjon | 04 (300-021) |
| FR-10 | Bestilling forsinket: ferdigprodukt, del rett under (til kunde), del på ..2 (produksjonen av delene over) | 02, 01, 04 |
| FR-11 | Bruk av sikkerhetslager på nivå .1 og ..2 | 01 (300-004), 02 (300-003), 03 (300-004) |
| FR-29 | Kanseller mottak | 02 (300-005) |
| FR-13 / FR-15 | Flere eksepsjoner på én del og i én celle | 02 (300-005), 04 (300-022, 300-026, 300-028) |
| FR-17 | Bestillingsforslag med innkjøp, produksjonsordre og forfalt mengde | arket Bestillingsforslag i alle fasitene |
| FR-19 / FR-20 | Siste kjøring per ferdigprodukt: hvert testeksempel har eget varenummer på nivå 0, så 02 → 01 → 03 skal sammenligne 03 med 02 | 01 (100-002), 02 og 03 (100-001), 04 (100-003) |
| FR-20 | Nye, endrede og fjernede forslag, nye og borte eksepsjoner, ingen endringer | 03 (arket Sammenligning) |
| FR-24–FR-26 | Fast partistørrelse | ikke laget ennå (planlagt utvidelse) |
