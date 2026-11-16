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
