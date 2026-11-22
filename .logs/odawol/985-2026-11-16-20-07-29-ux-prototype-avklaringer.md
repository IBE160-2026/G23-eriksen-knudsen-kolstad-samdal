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

## 2026-11-22 kl. 19:44 — Odawol

### Oppgave
Oda testet resultatsiden med og uten ukeplan og opplevde ukeplanen som bare fyll. Hun bestemte at ukeplanen skal fjernes, og at dette skal oppdateres i UX-dokumentene (U5).

### Plan
- Søkte etter «ukeplan», «ukevisning» og «ukeoversikt» i alle kopiene. DESIGN.md nevnte ikke ukeplanen, og EXPERIENCE.md forbød den allerede. FR-17 sier «ingen egen ukevisning», så PRD-en trenger ingen endring.

### Resultat
Alt er endret i `.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/`.
- `prototype/index.html`: ukeplanen er tatt ut av resultatet (`planOrder`), av Prototypevalg og av veiledningssiden. Seksjonsmenyen og «Slik leser du resultatet» følger etter. U5 er merket avklart i listen over uavklarte spørsmål. Funksjonen `secUkeplan` og CSS-en for den står igjen, men brukes ikke.
- `ux-carmen/DESIGN.md`: ny linje i Do's and Don'ts: «Egen ukeplan eller ukeoversikt ved siden av listen» under «Ikke gjør».
- `ux-carmen/EXPERIENCE.md`: ny linje «Forkastet 22.11 – ukeplan» med begrunnelse.
- `prd/addendum.md`: lukket spørsmål 5 er bekreftet 22.11. `prd/prd.md` er ikke endret.
- `README.md` (U5 avklart, og «Ukeplan» er tatt ut av U8-listen) og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge. Resultatet har nå Kritiske deler, Bestillingsforslag og Resultattabell. Ingen feil i konsollen.

### Åpne punkter
- U5 (ukeplanen fjernes) er Odas valg og må godkjennes av gruppen.

## 2026-11-22 kl. 19:50 — Odawol

### Oppgave
Oda valgte A for U6: introduksjonssiden beholdes og vises første gang. Startsiden er «Ny kjøring».

### Plan
- Søkte etter «startside» og «introduksjon» i PRD-kopien, EXPERIENCE.md, DESIGN.md og ordbanken. Holdt introduksjonssiden atskilt fra introduksjonen til brukertesten (PRD §8.1 og §9 nr. 4).
- EXPERIENCE.md ble tilpasset prototypen: Lagrede kjøringer og Veiledning er egne sider.

### Resultat
Alt er endret i `.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/`.
- `prd/prd.md`:
  - FR-27: startsiden er menyvalget «Ny kjøring». Nytt avsnitt om introduksjonssiden og en ny testbar konsekvens: første besøk viser introduksjonssiden, og neste besøk viser startsiden.
  - UJ-1: Kari ser introduksjonssiden først.
- `prd/addendum.md`: linje 2026-11-22 i endringshistorikken, merket som forslag.
- `ordbank.md`: «Introduksjonsside» og «Startside» er lagt inn som forslag.
- `ux-carmen/EXPERIENCE.md`:
  - skjermlisten (Introduksjonsside, Startside, Lagrede kjøringer, Veiledning)
  - komponenten Lagrede kjøringer
  - tilstandene for første og senere besøk og for ingen lagrede kjøringer
  - UJ-1 trinn 1 og Slett i UJ-3
- `ux-carmen/DESIGN.md`: komponentraden «Introduksjonsside», og «Kom i gang» som primærknapp.
- `prototype/index.html`: teksten på introduksjonssiden er rettet etter U14 (først kritiske deler, så bestillingsforslag), og U6 er merket avklart.
- `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge. Første besøk gir `#/intro` og andre besøk `#/start`. Ingen feil i konsollen.

### Åpne punkter
- U6 (introduksjonsside, startsiden er «Ny kjøring», og Lagrede kjøringer er en egen side) er Odas valg og må godkjennes av gruppen.

## 2026-11-22 kl. 19:56 — Odawol

### Oppgave
Oda valgte B for U2: det offisielle typenavnet fra ordbanken står først i eksepsjonsteksten.

### Plan
- Kontrollerte at PRD-en og ordbanken allerede bruker de fem typenavnene, og at DESIGN.md forbyr egne korte navn. Bare UX-dokumentene og prototypen måtte endres.
- Oda hadde prøvd valgene i Edge, og prototypen lagrer dem. Derfor fikk prototypen en engangsoverstyring, så B blir valgt også der A var lagret.

### Resultat
- `prototype/index.html`: B er standard. B blir også valgt én gang i nettlesere der A var lagret (nøkkelen `u2b`). Valget er merket «valgt av Oda 22.11», og U2 er merket avklart. A kan fortsatt sammenlignes på siden «Eksepsjonstekst: A og B».
- `ux-carmen/EXPERIENCE.md`: regelen står i tabellen for ordlyd. Typenavnet og uken står først, og en setning i vanlig språk under.
- `ux-carmen/DESIGN.md`: komponentraden Eksepsjonsmerke har fått den samme regelen.
- `prd/prd.md` og `ordbank.md` er ikke endret.
- `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge, med A lagret på forhånd. Den første kritiske delen viser «Bestilling forsinket · uke 1». Ingen feil i konsollen.

### Åpne punkter
- U2 (B: typenavnet først) er Odas valg og må godkjennes av gruppen.

## 2026-11-22 kl. 19:58 — Odawol

### Oppgave
Oda valgte «Kritiske deler» for U3 og ba om at de relevante dokumentene ble oppdatert.

### Plan
- Søkte etter «oppfølging» i alle kopiene. Setningen fra U14 brukte «det som krever oppfølging», som ville kollidert med valget. Den ble byttet til «krever handling», som SM-C3 bruker.

### Resultat
- `ordbank.md`: «krever oppfølging» står under «Ikke bruk» for Kritisk del.
- `prd/prd.md` (§4.4) og `prd/addendum.md`: «krever oppfølging» er byttet til «krever handling». FR-13 og FR-16 er ikke endret.
- `ux-carmen/EXPERIENCE.md`: den samme byttingen i punkt 3 på resultatsiden, og «Krever oppfølging» er lagt inn under «Ikke gjør» i tabellen for ordlyd.
- `prototype/index.html`: valget «Ord for deler med eksepsjon» er fjernet, og `O.kritOrd` er alltid «kritiske», også der det andre valget var lagret. U3 er merket avklart.
- `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge. Ingen feil i konsollen.

### Åpne punkter
- U3 («Kritiske deler») er Odas valg og må godkjennes av gruppen.

## 2026-11-22 kl. 20:00 — Odawol

### Oppgave
Oda ba om at ordene fra U8 legges inn i ordbanken.

### Plan
- Satte hvert ord i riktig tabell i ordbanken og la inn synonymer under «Ikke bruk». Ord fra PRD-en ble merket med kravet. Nye UX-ord ble merket «Forslag fra Oda 22.11».
- Søkte etter ord i kopiene som nå står under «Ikke bruk», og fant «resultatside» i EXPERIENCE.md og DESIGN.md.

### Resultat
- `ordbank.md` i arbeidsmappen:
  - Frigivelsesuke (Beregning, FR-17)
  - Bestillingsplan (App og test, FR-30)
  - Resultat og Lagret kjøring (App og test, som forslag)
  - Introduksjonsside, Startside, Tallboks og Seksjonsmeny var lagt inn tidligere i dag
- `ux-carmen/EXPERIENCE.md` og `ux-carmen/DESIGN.md`: «Resultatside» og «resultatsiden» er byttet til «Resultat» og «siden Resultat». Filnavnene i lenkene er ikke endret.
- `prototype/index.html` (U8 avklart), `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.

### Åpne punkter
- U8 (de nye ordene i ordbanken) er Odas valg og må godkjennes av gruppen.

## 2026-11-22 kl. 20:11 — Odawol

### Oppgave
Oda bestemte U11 og U7:
- **U11:** Valgene under «Hva vil du beregne?» skal stå i rekkefølgen Bestillingsplan, Produksjonskapasitet og Begge, og Bestillingsplan skal være det første valget.
- **U7:** Brukeren skal fortsatt kunne velge mellom lys og mørk visning.

### Plan
- Tolket «det første forslaget» slik at Bestillingsplan står først og er forhåndsvalgt. Det samsvarer med brukertesten (§8.1).
- Flyttet knappen for lys og mørk ut av den gule prototypeboksen, fordi den nå er en del av appen.

### Resultat
- `prototype/index.html`:
  - Valgene heter Bestillingsplan, Produksjonskapasitet og Begge, og Bestillingsplan er alltid forhåndsvalgt. Valget for standard er fjernet fra Prototypevalg.
  - «Bytt til mørk» / «Bytt til lys» står nederst i sidemenyen.
  - U7 og U11 er merket avklart.
- `ux-carmen/EXPERIENCE.md`:
  - komponenten «Valg av beregning» har ny rekkefølge
  - ny komponentrad «Lys og mørk visning»
  - åpen beslutning 8 (mørk modus i v1) er besluttet: ja
- `ux-carmen/DESIGN.md`: kommentaren over fargetokenene, Appmeny og Do's and Don'ts sier at lys og mørk er med i v1, med lys som standard, og at kontrasten skal kontrolleres i begge.
- `prd/prd.md` er ikke endret.
- `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge, også med «Begge» lagret fra før. Bestillingsplan er forhåndsvalgt, rekkefølgen er riktig, og knappen bytter til mørk. Valget huskes når siden lastes på nytt. Ingen feil i konsollen.

### Åpne punkter
- U11 og U7 er Odas valg og må godkjennes av gruppen.
- Mørk modus gir mer å teste (kontrast i begge). Gruppen kan vurdere å nevne det i PRD-en, for eksempel i NFR-8.

## 2026-11-22 kl. 20:17 — Odawol

### Oppgave
Oda gikk gjennom punktene som bare krever et valg:
- **U1:** én lang side
- **U4:** «Alle uker» høres bra ut. Hun spurte hva de andre dokumentene sier.
- **U9:** la det stå som det er
- **U10:** behold filteret og før det inn i de relevante dokumentene
- **U12:** hun spurte hva «Sebastians kobling» betyr

### Plan
- U4: sammenlignet PRD-en (FR-17 og UJ-2), Carmens EXPERIENCE.md og Sebastians forslag. Alle unntatt Sebastians forslag («Uke 1») peker mot «Alle uker», så det ble ført inn.
- U12: tok et skjermbilde av tabellen for hjul for å forklare punktet. Ingenting er endret for U12.

### Resultat
Alt er endret i `.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/`.
- `prd/prd.md` FR-16: nytt avsnitt om «Vis bare kritiske deler» (stykklisterekkefølgen beholdes, og eksporten endres ikke) og en ny konsekvens: testeksempel 01 viser bare 300-003–300-006. `prd/addendum.md` har fått en linje i endringshistorikken.
- `ux-carmen/EXPERIENCE.md`:
  - Resultat er én lang side (U1)
  - ukefilteret starter på «Alle uker» (U4). `[ASSUMPTION]` er fjernet, og åpen beslutning 3 er besluttet.
  - ny komponentrad «Filter for kritiske deler» (U10)
- `prototype/index.html`: valgene for U1, U4 og U10 er fjernet fra Prototypevalg og har faste verdier, også der andre verdier var lagret. U1, U4, U9 og U10 er merket avklart.
- `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- Testet med Playwright i Edge, med motsatte verdier lagret fra før. Resultatet er én lang side, filteret starter på «Alle uker», og «Vis bare kritiske deler» viser 300-003–300-006. Ingen feil i konsollen.

### Åpne punkter
- U1, U4, U9 og U10 er Odas valg og må godkjennes av gruppen.
- U12 venter på Odas valg mellom Sebastians kobling (markør i den raden eksepsjonen gjelder) og Carmens egen rad «Eksepsjoner». Carmens EXPERIENCE.md og DESIGN.md beskriver i dag Carmens løsning som `[ASSUMPTION]`.

## 2026-11-22 kl. 20:22 — Odawol

### Oppgave
Oda valgte «forslag B» for U13 og Sebastians kobling for eksepsjonsmarkøren (U12), og ba om at Carmens eksepsjonsrad oppdateres etter det.

### Plan
- U13 har ingen egen A/B i prototypen. «B» er tolket som variant B av eksepsjonsteksten, slik den vises i forklaringspanelet: typenavn og uke, én setning i vanlig språk, «Melding:» og «Hvorfor:». Tolkningen ble sagt til Oda.
- Erstattet Carmens `[ASSUMPTION]` om en egen rad «Eksepsjoner» med Sebastians kobling, slik `markCell` i prototypen gjør det.

### Resultat
- `ux-carmen/EXPERIENCE.md`: komponentraden Eksepsjonsmarkering er skrevet om (Sebastians kobling, seks rader per del, og de fire delene i en melding), og åpen beslutning 1 er besluttet.
- `ux-carmen/DESIGN.md`: raden «Eksepsjonsrad» er erstattet med «Eksepsjonsmarkør», og Forklaringspanel beskriver hvordan en melding er bygd opp.
- `ordbank.md`: «Eksepsjonsmarkør» er lagt inn som forslag. Ikke bruk: eksepsjonsrad, varsel, flagg.
- `prototype/index.html` (U12 og U13 avklart), `README.md` og `prototype/avvik-mot-prd.md` er oppdatert.
- `prd/prd.md` er ikke endret, fordi FR-13 og FR-15 allerede gir rom for dette.
- Testet med Playwright i Edge. Ingen feil i konsollen.
- Alle de 16 punktene er nå avklart av Oda og venter på gruppen.

### Åpne punkter
- U12 og U13 er Odas valg og må godkjennes av gruppen. Oda må bekrefte at «B» for U13 betyr variant B av eksepsjonsteksten.

## 2026-11-22 kl. 20:26 — Odawol

### Oppgave
Oda ba om en versjon som kan åpnes i nettleseren, med alle endringene fra avklaringene. Prototypevalg og «Uavklarte spørsmål» skulle oppdateres, og siden «Eksepsjonstekst: A og B» skulle fjernes.

### Plan
- Gjorde prototypen i arbeidsmappen om til versjon 4, i stedet for å lage en ny kopi. Den inneholdt allerede alle endringene fra i dag. Versjon 3 på `main` er ikke endret.
- Gjorde endringene med et skript som stopper hvis en tekst ikke finnes nøyaktig én gang.

### Resultat
- `prototype/index.html` (versjon 4):
  - **Prototypevalg:** bare simuleringene står igjen (valideringsfeil, blokkert lagring og ingen kritiske deler), og valget om å vise de gule merkene. Alle avklarte valg er faste, også der andre verdier var lagret.
  - **A og B:** siden «Eksepsjonstekst: A og B» er fjernet, med lenke, seksjon, ruting og `renderAB`.
  - **Avklaringer 22.11:** erstatter «Uavklarte spørsmål». Tabellen har alle 16 punktene med valg, hva som er endret i kopiene, og status «Venter på gruppen». De gule merkene sier «avklart».
  - **Banneret:** «Prototype 22.11, versjon 4 – Odas avklaringer, ikke godkjent av gruppen.»
- `prototype/README.md` er skrevet om for versjon 4. `README.md` i arbeidsmappen viser til den.
- Testet med Playwright i Edge, med motsatte valg lagret fra før:
  - testeksempel 02 → 03 gir Kritiske deler, Bestillingsforslag, Endringer og Resultattabell, med fem tallbokser
  - eksepsjonen vises som «Bestilling forsinket · uke 1»
  - 05 med Begge viser kapasiteten
  - siden Avklaringer har 16 rader
  - ingen feil i konsollen
- Prototypen er åpnet i Edge.

### Åpne punkter
Ingen nye.

## 2026-11-22 kl. 20:52 — Odawol

### Oppgave
Oda ville ha kontrollert at alle endringene fra gjennomgangen står i dokumentene, ha det pushet til `Oda/Branch` og vite om endringene kan gjøres synlige. Hvis ikke ville hun ha en nummerert liste som viser til dokumentet.

### Plan
- Hentet originalene uendret fra git og sammenlignet dem med kopiene, fil for fil. Søkte etter rester av gamle formuleringer.
- Gjorde endringene synlige ved å committe i to steg: først originalene uendret, så endringene. GitHub viser da den andre commiten som diff.
- Lagde `endringsliste.md` med et skript som finner linjenummeret til hver endring og stopper hvis en tekst ikke finnes nøyaktig én gang.

### Resultat
- **Kontrollert:** alle de 16 avklaringene står i de relevante kopiene. Treffene på gamle ord som er igjen, er bevisste: ord under «Ikke bruk», linjer om noe som er forkastet, og filnavn i lenker. `beslutninger-2026-11-13.md`, `data.js` og `lag_data.py` er like originalene.
- **Endrede linjer:** `prd.md` 18, `addendum.md` 5, `ordbank.md` 13, `DESIGN.md` 62 og `EXPERIENCE.md` 93.
- **`endringsliste.md`:** 78 nummererte punkter (P1–P8 PRD, A1–A4 addendum, O1–O11 ordbank, E1–E34 EXPERIENCE, D1–D21 DESIGN), hver med avsnitt, linjenummer, avklaring og en kolonne for avkryssing. Den er lenket fra `README.md`.
- **Commits:**
  - `ef8598b` «UX-avklaringer 22.11: originalene uendret (grunnlag for sammenligning)»
  - `77b9074` «UX-avklaringer 22.11: Odas endringer»
- Pushet til `origin/Oda/Branch` sammen med loggcommitene fra i dag. `main` er ikke rørt. BMAD-konfigurasjonen og de andre filene som ikke var committet, ble ikke tatt med.

### Åpne punkter
Ingen nye.

## 2026-11-22 kl. 21:04 — Odawol

### Oppgave
Gruppen har godkjent alle de 16 avklaringene. Oda ba om å føre dem over til originalene på `main`, men å vente med Carmens EXPERIENCE.md og DESIGN.md, fordi de bare finnes på `Carmen/Branch`. Hun spurte også om det anbefales å ta dem inn på `main`.

### Plan
- Lagde grenen `Oda/ux-avklaringer-til-main` fra `origin/main` i et eget worktree, slik at `Oda/Branch` med alle de andre filene ikke ble tatt med.
- PRD og addendum: kopiert fra arbeidsmappen. Først sjekket jeg at `prd.md` på `main` var lik originalen kopien bygger på. Merkingen «forslag fra Oda, ikke godkjent» ble endret til «godkjent av gruppen 22.11».
- Ordbanken på `main` er en eldre utgave enn på `Oda/Branch`. Derfor ble bare radene fra 22.11 satt inn, ikke hele fila.

### Resultat
- **PRD og ordbank på `main`:** commit `2abe679` («PRD og ordbank: UX-avklaringene 22.11, godkjent av gruppen»), merget med PR #16 (`404004b`). Endret: `prd.md` (18 linjer), `addendum.md` (5) og `.docs/ordbank.md` (13). Grenen og worktreet er slettet etterpå.
- **`Oda/Branch`:** `main` er merget inn (`1686d02`). Arbeidsmappen er markert som godkjent: README (status og tabell), prototypen v4 (banner og siden Avklaringer 22.11) og `prototype/README.md`.
- **Ikke gjort:** EXPERIENCE.md og DESIGN.md er ikke endret, verken på `main` eller på `Carmen/Branch`.
- **`issues.md`:** 19 punkter er lukket (godkjenning av U-punktene, overføring til PRD og ordbank, Frigivelsesuke og Bestillingsplan i ordbanken, menyord). Ett er delvis løst. Det er lagt til to nye.
- **Anbefaling til Oda:** ta EXPERIENCE.md og DESIGN.md inn på `main` i en egen PR fra Carmen, med 22.11-endringene lagt inn. Begrunnelse i sluttsvaret.

### Åpne punkter
- Oda avklarer om Carmens EXPERIENCE.md og DESIGN.md skal til `main`. Endringene står klare i `ux-carmen/`.
- Vurder om lys og mørk visning (U7) skal nevnes i NFR-8.
