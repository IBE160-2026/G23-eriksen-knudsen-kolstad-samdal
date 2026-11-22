# UX-prototype etter avklaringene

## 2026-11-16 kl. 20:07 — Odawol

### Oppgave
Oda ville ha en ny klikkbar UX-prototype bygd på gruppens avklaringer fra møtene: Carmens introduksjonsside og oppbygning, lyst og mørkt design, momentene fra Sebastians resultattabell med Carmens design, forklaringspanelet ved siden av tabellen (FR-18) med Carmens fire lag, alle bestillingsforslag samlet med ukefilter (FR-17), merking med tekst eller symbol og farge (FR-15), en resultatvisning som er lett å forstå uten MRP-erfaring, ukeplanen lenger ned som valgfri, og ingen innlogging. Hun ville se forskjellen på vanlig språk og offisielt typenavn først i eksepsjonene. PRD-en og ordbanken er autoritative, uavklarte spørsmål skal merkes, og ingen eksisterende UX-filer skal endres.

### Plan
- Bygde videre på sammenligningen i [gjennomgang-ux-forslag](988-2026-11-15-16-14-47-gjennomgang-ux-forslag.md) og leste ordbanken og Carmens DESIGN.md (tokens for lys og mørk).
- Hentet tallene fra referanseberegningen bak fasitene (`testdata/lag_testdata.py`) med et nytt skript, `lag_data.py`, i stedet for de utdaterte CSV-ene i `testdata/fasit/` (de bruker 100-001 for testeksempel 01).
- Skrev prototypen som én HTML-fil. Testet den i Edge uten vindu med Playwright: 01, 02 → 03 (Endringer), 05 med kapasitet, mørk og lys, variant A og B, valideringsfeil og tastatur i tabellen. Ingen feil i konsollen.

### Resultat
- Ny mappe på `Oda/Branch`: `.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-16/` med `index.html`, `data.js`, `lag_data.py` og `README.md`. Den er ikke committet.
- Prototypen har Introduksjon, Ny kjøring, Resultat (sammendrag, Bestillingsforslag, Endringer, Kritiske deler, Resultattabell med forklaringspanel, Ukeplan og Produksjonskapasitet), Lagrede kjøringer, Veiledning, en side med eksepsjonstekst A og B og en liste over uavklarte spørsmål.
- Under Prototypevalg kan man bytte mellom lys og mørk, A og B for eksepsjonsteksten, A (lang side) og B (utvidbare seksjoner) for «én resultatside», ordet for kritiske deler, startvalget for ukefilteret, ukeplanen av eller på, filteret for kritiske deler, standardvalget for beregning, og simulert valideringsfeil eller blokkert lagring.
- Tallene er kontrollert mot PRD-en: Endringer viser hjul 130 → 205 og et nytt forslag på 30 skruesett M6 (UJ-3). Kapasiteten viser 30 i uke 5 og 35 fra uke 7, begrenset av ryggplate (UJ-5). Nettobehovet for hjul i uke 1 er 50 (80 + 0 − 100 = −20, SS 30).
- Ordbanken er ikke endret. Ord som ikke står der, er merket som uavklart (U8).
- Prototypen er åpnet i standardnettleseren og mappen i Utforsker.

### Åpne punkter
- Gruppen må gå gjennom de 13 uavklarte spørsmålene (U1–U13) i prototypen og i `README.md`, særlig U1 (hva «én resultatside» betyr), U2 (eksepsjonstekst A eller B) og U5 (ukeplanen mot FR-17).
- Velger gruppen ukeplanen, introduksjonssiden eller nye ord i grensesnittet, må PRD-en og ordbanken oppdateres (U5, U6, U8).

## 2026-11-16 kl. 20:43 — Odawol

### Oppgave
Oda kom med presiseringer til prototypen og ville ha et nytt forslag: «filen» i stedet for «fila», ikke noe utklipp og ingen «Les veiledningen» på introduksjonssiden, en veiledning om nettsiden og ikke om Excel-malen, ukeplan uten «valgfri», kritiske deler før bestillingsforslag, tydeligere symboler og forklaring i produksjonskapasiteten, eksepsjonssymboler som hos Carmen, og at prototypevalgene beholdes.

### Plan
- Kopierte versjon 1 til en ny mappe, så versjon 1 står urørt til sammenligning, og gjorde endringene med et skript som stopper hvis en tekst ikke finnes nøyaktig én gang.
- Hentet symbolstilen fra Carmens prototype (`origin/Carmen/Branch`): fylte fargede firkanter med symbolet og typenavnet i en myk merkelapp.
- Testet i Edge uten vindu med Playwright, i lys og mørk, med testeksempel 01, 02 → 03 og 05. Ingen feil i konsollen.

### Resultat
- Ny mappe: `.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-16-v2/` med `index.html`, `data.js`, `lag_data.py` og `README.md` (endringslisten står der). Den er ikke committet. Versjon 1 er ikke endret.
- Kritiske deler står først i resultatet. Hver kritisk del viser sitt første bestillingsforslag, og forslagene for kritiske deler har samme symbol som eksepsjonen. Dette går mot PRD §4.4 og er merket U14. Rekkefølgen fra PRD-en er et nytt valg under Prototypevalg.
- Veiledningssiden forklarer nå hvordan nettsiden brukes. Den korte veiledningen på Ny kjøring, som FR-27 krever, står fortsatt.
- Produksjonskapasiteten har en egen forklaringsboks for symbolene Lager og Ledetid, og innledningen er delt i fire punkter.
- Prototypen er åpnet i nettleseren og mappen i Utforsker.

### Åpne punkter
- Rekkefølgen med kritiske deler først krever en endring i PRD §4.4 hvis gruppen velger den (U14).

## 2026-11-16 kl. 21:12 — Odawol

### Oppgave
Oda ba om å committe og pushe prototypemappene, så de ligger i `Oda/Branch` på GitHub.

### Plan
- Kontrollerte at `Oda/Branch` var aktiv, og at GitHub ikke hadde nye commits i branchen.
- Committet bare mappen `.docs/planning-artifacts/ux-designs/` med en commit som er begrenset til den stien. Andre ukommitterte filer (BMAD-konfig, brainstorming, Odas PRD-utkast og Word-filene) ble ikke tatt med.

### Resultat
- `4cfb393` «UX: klikkbare prototyper 16.11 (versjon 1 og 2)», 8 filer i `ux-prototype-2026-11-16/` og `ux-prototype-2026-11-16-v2/`.
- Pushet `6211a2f..4cfb393` til `origin/Oda/Branch`, sammen med loggcommitene fra i dag. `main` er ikke rørt.

### Åpne punkter
Ingen nye.

## 2026-11-17 kl. 11:17 — Odawol

### Oppgave
Oda åpnet Carmens nyeste UX (v3 Design B) og ba deretter om et tillegg med to tips fra Sebastian: Carmens fire bokser øverst i resultatet og Carmens runde knapper for seksjonene. Forrige UX skulle ikke endres, og hvor endringene skal inn skulle forklares før noe ble laget.

### Plan
- Åpnet `COSI-MRP-UX-v3-Design-B` fra `Carmen/Branch` (commit `cb65aea`) via en midlertidig kopi og lokal server i scratchpad. Serveren ble stoppet etterpå.
- Fant at tipsene kommer fra `ux/samlet-prototype-2026-11-16/cosi-mrp-samlet.html`, ikke fra v3, og viste skjermbilder av Carmens topp og v2-toppen.
- Oda godkjente forslagene 17.11:
  - boksene og knappene følger «Rekkefølge i resultatet» (U14)
  - ingen «Oversikt»-knapp, fordi ordbanken sier «Ikke bruk»
  - lenkene i sidemenyen skjules som standard, men kan slås på under Prototypevalg
  - Endringer får en femte boks når seksjonen vises
- Laget `ux-prototype-2026-11-17-v3/` som kopi av v2 og la inn endringene med et patch-skript.

### Resultat
- Ny mappe `.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/` med `index.html`, `data.js`, `lag_data.py` og `README.md`. v1 og v2 er ikke endret.
- Sammendraget har fire bokser med store fargede tall og en forklaring per boks (`sumCardsK4`), med en femte boks for Endringer. Symbolene er ● for kritiske deler og «!» for forfalt mengde, ikke Carmens ⚠ og ⧗, fordi ⧗ allerede betyr «Ledetid overskrider horisont».
- Runde knapper i den faste linjen øverst (`#secnav`) markerer seksjonen man er i. Lenkene i sidemenyen vises bare når valget er slått på.
- Tre nye valg under Prototypevalg: sammendrag (fire bokser eller som v2), runde knapper av/på og sidemenylenker av/på. Lagringsnøklene er `cosi-oda-proto-1711v3-`.
- Testet med Playwright i Edge, uten feil i konsollen:
  - lys og mørk utgave
  - testeksempel 01, 02→03 (Endringer), 05 med begge valg og 05 med bare kapasitet
  - begge valgene for rekkefølge og alle de nye valgene
  - at et klikk på en knapp legger seksjonen rett under den faste linjen
  - mobilbredde uten sidelengs rulling
- Ikke committet.

### Åpne punkter
- Gruppen må velge mellom fire bokser og sammendraget fra v2, og mellom runde knapper og lenker i sidemenyen (v3).

## 2026-11-17 kl. 11:43 — Odawol

### Oppgave
Oda ba om en liste over hvor UX-prototypen v3 avviker fra PRD-en og andre relevante dokumenter, med «!» der viktige dokumenter må oppdateres.

### Plan
- Sammenlignet v3 (standardvalgene) med PRD final 13.11, addendum, beslutninger 13.11, ordbanken og Carmens DESIGN.md og EXPERIENCE.md (12.11, på `Carmen/Branch`).
- Kontrollerte påstandene mot koden i `index.html`.

### Resultat
- Ny fil `.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/avvik-mot-prd.md`: avvikstabell (U1–U14 og bokser/knapper fra v3), krav kontrollert uten avvik, og andre funn.
- Avvik merket «!»:
  - rekkefølgen (PRD §4.4, UJ-1, UJ-2)
  - ukeplanen (FR-17)
  - introduksjonsside og startside (FR-27, UJ-1)
  - ord som mangler i ordbanken, blant annet «Frigivelsesuke» og «Bestillingsplan», som PRD-en bruker uten at ordbanken har dem
  - «Sammendrag», som kolliderer med FR-16
  - eksepsjonstekst A og «Krever oppfølging», hvis de velges
  - standardvalg for beregning, fire bokser og runde knapper (EXPERIENCE.md)
  - mørk retning (DESIGN.md)
- Funn: `architecture/technology.md` beskriver et annet prosjekt (Pytagoras-nettsiden).
- Ikke committet.

### Åpne punkter
- `architecture/technology.md` gjelder et annet prosjekt og bør fjernes eller erstattes før arkitektursteget.
- «Frigivelsesuke» og «Bestillingsplan» brukes i PRD-en, men står ikke i ordbanken.

## 2026-11-17 kl. 11:58 — Odawol

### Oppgave
Oda ba om å committe og pushe v3-prototypen og avvikslisten til `Oda/Branch`.

### Plan
- Commit begrenset til `ux-designs/ux-prototype-2026-11-17-v3/`. Andre ukommitterte filer ble ikke tatt med.

### Resultat
- `0200f22` «UX: klikkbar prototype 17.11 versjon 3 og avvik mot PRD», 5 filer: `index.html`, `data.js`, `lag_data.py`, `README.md` og `avvik-mot-prd.md`.
- Pushet `5263354..0200f22` til `origin/Oda/Branch`, sammen med loggcommitene fra i dag. `main` er ikke rørt.

### Åpne punkter
Ingen nye.

## 2026-11-19 kl. 21:34 — Odawol

### Oppgave
Oda ba om å få det nyeste UX-forslaget (prototype versjon 3 fra 17.11) pushet til `main`.

### Plan
- `Oda/Branch` har mange commits som ikke er på `main` (logger, testdata, øvingseksempel), så samme framgangsmåte som for PR #14 ble brukt: egen gren fra `origin/main` med bare v3-commiten.

### Resultat
- Ny gren `Oda/ux-prototype-v3` fra `origin/main`, med `0200f22` plukket over (ny hash `e07158e`). 5 filer i `.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/`.
- [PR #15](https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/pull/15) mot `main` er merget (`8b3fba0`). Grenen er slettet lokalt og på GitHub.
- Loggcommitene for versjon 3 ble ikke tatt med til `main`. Tilbake på `Oda/Branch`, og config-endringene i `_bmad/` er urørt.

### Åpne punkter
Ingen nye.

## 2026-11-22 kl. 18:52 — Odawol

### Oppgave
Oda ville gå gjennom UX-forslaget på `main` (prototype versjon 3) og avklaringene, med prototypen åpen i nettleseren. Hun ba deretter om at de relevante dokumentene kopieres til en egen mappe på `Oda/Branch`, slik at hun kan endre ett punkt og ett dokument om gangen.

### Plan
- Kontrollerte at v3-mappen på `Oda/Branch` er lik den på `main`, og åpnet `index.html` i standardnettleseren.
- Hentet U1–U14 fra prototypen og avvikslisten, og foreslo en rekkefølge for gjennomgangen. Punktene som krever endringer i PRD-en, ordbanken eller UX-dokumentene, tas først, og U14 aller først.
- Laget en arbeidsmappe med kopier og en arbeidsliste i `README.md`. Originalene er ikke endret.

### Resultat
- Ny mappe `.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/` (ikke committet):
  - `README.md`: arbeidsliste med ett avsnitt per punkt (U14, fire bokser, runde knapper, U5, U6, U2, U3, U8, U11, U7), med feltene Status, Valg, Endret og Endres i. U1, U4, U9, U10, U12 og U13 står i en tabell. Nederst står en tabell over kopiene og hvor originalene ligger.
  - `prd/`: `prd.md`, `addendum.md` og `beslutninger-2026-11-13.md` (PRD final 13.11)
  - `ordbank.md`: fra `Oda/Branch`, som er nyere enn `main`. `main` mangler FR, NFR, SM, Dekningstabell, Tomtilstand og Avklaring.
  - `ux-carmen/`: `DESIGN.md` og `EXPERIENCE.md` fra `origin/Carmen/Branch` (`f409dec`, 12.11)
  - `prototype/`: kopi av v3 med `avvik-mot-prd.md`. Lagringsnøkkelen er endret til `cosi-oda-proto-2211avk-`, slik at kjøringene ikke blandes med v3.
- Mappen er åpnet i Utforsker, og prototypekopien er åpnet i nettleseren.

### Åpne punkter
- Endringene i arbeidsmappen `ux-avklaringer-2026-11-22/` må føres over til originalene (PRD, ordbanken og EXPERIENCE.md/DESIGN.md) når gruppen har godkjent dem.

## 2026-11-22 kl. 19:09 — Odawol

### Oppgave
Oda valgte U14: kritiske deler skal stå før bestillingsforslagene. Hensikten er at brukeren først ser det som krever oppfølging, og deretter hva som skal bestilles. Er det ingen kritiske deler, skal det bare stå en kort melding, ikke hele seksjonen. Endringene skulle gjøres i de relevante dokumentene i arbeidsmappen.

### Plan
- Fant stedene i PRD-kopien og Carmens EXPERIENCE.md som beskriver rekkefølgen (§4.4, FR-16, UJ-1, UJ-2, seksjonsmenyen, tomtilstanden og tabulatorrekkefølgen).
- Gjorde endringene med et skript som stopper hvis en tekst ikke finnes nøyaktig én gang.
- Ingen testeksempler mangler kritiske deler, så prototypen fikk et valg som simulerer det.

### Resultat
Alt er endret i `.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/`. Originalene er ikke endret.
- `prd/prd.md`:
  - §4.4: kritiske deler først, så bestillingsforslag og så tabellen, med hensikten
  - FR-16: sammendraget står før bestillingsforslagene, og uten kritiske deler vises bare en kort melding. To nye testbare konsekvenser.
  - UJ-1 og UJ-2 har ny rekkefølge
  - `updated` er satt til 2026-11-22
- `prd/addendum.md`: linje for 2026-11-22 i endringshistorikken, merket som forslag fra Oda som gruppen ikke har godkjent.
- `ux-carmen/EXPERIENCE.md`: rekkefølgen på resultatsiden, seksjonsmenyen, tomtilstanden (bare én kort melding), tabulatorrekkefølgen, UJ-1 og UJ-2.
- `prototype/index.html`:
  - Uten kritiske deler vises bare meldingen «Ingen kritiske deler. Planen går opp for alle delene.», uten nummer, overskrift eller liste.
  - Boksen og «Slik leser du resultatet» er tilpasset.
  - Nytt valg: «Simuler at det ikke er noen kritiske deler (U14)».
- `README.md` (U14 avklart, venter på gruppen) og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge med testeksempel 01, med og uten simulering. Rekkefølgen er Kritiske deler, Bestillingsforslag, Resultattabell og Ukeplan. Ingen feil i konsollen.
- Ordbanken er ikke endret, fordi ingen nye begreper er tatt i bruk.

### Åpne punkter
- U14 er Odas valg og må godkjennes av gruppen før PRD-en og EXPERIENCE.md på `main` endres.
- Simuleringen uten kritiske deler fjerner bare eksepsjonene. Boksen «forslag med forfalt mengde» viser fortsatt 2, selv om forfalt mengde ellers gir eksepsjonen «Bestilling forsinket». Det er en svakhet i prototypen, ikke i løsningen.

## 2026-11-22 kl. 19:22 — Odawol

### Oppgave
Oda valgte fire bokser øverst i resultatet (V3-a) og runde knapper for seksjonene øverst (V3-b). Hun ville ha det ført inn i EXPERIENCE.md og andre relevante filer, og få vite hva SM-C3 sier hvis det må endres.

### Plan
- Sammenlignet med SM-C3 i PRD-kopien og med reglene i DESIGN.md.
- Gjorde endringene med et skript som stopper hvis en tekst ikke finnes nøyaktig én gang. Hentet verdiene for farger og størrelser fra CSS-en i prototypen.

### Resultat
Alt er endret i `.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/`.
- **SM-C3** («Tabellen skal ikke fylles med farger og symboler for å se informativ ut …») gjelder tabellen, så PRD-en er ikke endret. Det er DESIGN.md som var i konflikt («ikke et dashbord», «ingen store tall i kort», «bare to ting får farge», «ikke petrol på store flater»).
- `ux-carmen/EXPERIENCE.md`:
  - Kjøringslinjen har seksjonsmenyen med runde knapper, og tallboksene er nytt punkt 2 på resultatsiden.
  - Komponentradene Seksjonsmeny og Tallbokser, tabulatorrekkefølgen og smal skjerm er oppdatert.
  - «Forkastet – dashbord» er endret til «Delvis tatt inn», og UJ-2 og UJ-3 er endret.
- `ux-carmen/DESIGN.md`:
  - tokens `summary-*` for lys og mørk, og komponentene `summary-boxes` og `section-button`
  - unntak i Brand & Style, regelen om store tall, Shapes og Do's and Don'ts
  - komponentradene Seksjonsmeny og Tallbokser
- `ordbank.md`: «Tallboks» og «Seksjonsmeny» er lagt inn som forslag, og `updated` er satt til 2026-11-22. Dermed er kollisjonen med «Sammendrag» (FR-16) i U8 løst.
- `prototype/index.html`: valgene er merket «valgt av Oda 22.11», og boksraden heter «Tallbokser» for skjermlesere.
- `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet på nytt med Playwright i Edge. Ingen feil i konsollen.

### Åpne punkter
- V3-a og V3-b er Odas valg og må godkjennes av gruppen.
- Gruppen bør vurdere om tallene for uke 1 og i alt trenger egne farger i tallboksene, eller om bare kritiske deler og forfalt mengde skal ha farge (DESIGN.md, ånden i SM-C3).

## 2026-11-22 kl. 19:25 — Odawol

### Oppgave
Oda godtok anbefalingen: i tallboksene skal bare tallene som krever handling, ha farge. Hun spurte også hva en «tallboks» er.

### Plan
- Gjorde endringene med samme type skript som stopper hvis en tekst ikke finnes nøyaktig én gang.

### Resultat
- `prototype/index.html`: tallene for bestillingsforslag i uke 1 og i alt er nøytrale (hvite). Kritiske deler (●) og forfalt mengde («!») har fortsatt farge.
- `ux-carmen/DESIGN.md`: tokenene `summary-num-week1` og `summary-num-all` er fjernet for lys og mørk. Regelen «bare tall som krever handling, har farge» står i Brand & Style, i raden Tallbokser og i Do's and Don'ts.
- `README.md` (V3-a) er oppdatert.
- Testet med Playwright i Edge, med skjermbilde. Ingen feil i konsollen.
- Svarte at «Tallboks» er et nytt ord fra økten for boksene øverst i resultatet, og at det står i ordbanken som forslag.

### Åpne punkter
Ingen nye.

## 2026-11-22 kl. 19:31 — Odawol

### Oppgave
Oda så tallboksene i Edge og ville ha en sterkere rosa. Hun spurte også om de relevante dokumentene er oppdatert, så gruppen kan gå videre.

### Plan
- Det første forsøket på å åpne prototypen i Edge feilet, fordi `#/start` ble lagt på filstien. Den ble åpnet på nytt med `file:///`-adressen.
- Valgte ny rosa ut fra kontrasten mot petrolflaten: minst 3:1, siden tallet er stor tekst (40 px, fet).
- Søkte etter rester av «Sammendrag» og gamle beskrivelser i kopiene.

### Resultat
- Rosa for forfalt mengde: lys `#F7CBE0` → `#FF8CC6` (3,5:1 mot `#0D5C6E`), mørk `#E9A6C6` → `#FF7AB8` (6,3:1 mot `#0C2A2E`). Endret i `prototype/index.html` og som token i `ux-carmen/DESIGN.md`.
- `prototype/avvik-mot-prd.md`: raden om «Sammendrag» (U8) er merket løst med «Tallbokser».
- `README.md` er oppdatert. U14, V3-a og V3-b står som «Avklart av Oda 22.11. Venter på gruppen.» De andre punktene er åpne.
- Testet på nytt i Edge. Ingen feil i konsollen.

### Åpne punkter
Ingen nye.
