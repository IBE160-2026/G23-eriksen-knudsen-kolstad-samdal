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
