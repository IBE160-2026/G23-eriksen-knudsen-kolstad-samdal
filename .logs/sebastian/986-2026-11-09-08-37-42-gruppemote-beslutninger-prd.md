# Gruppemøtets beslutninger ført inn i PRD-en

## 2026-11-09 kl. 08:37 — Sebastian

### Oppgave
Sebastian ga videre beslutningene fra gruppemøtet og ba om at de føres inn i dokumentene på grenen hans: avvente Iduns produksjonskapasitet, ta inn NFR-05, NFR-09, NFR-11 og NFR-12 fra Carmens utkast, bekreftet byggerekkefølge, en tekst om testpersoner til brukertesten og F3 fra Iduns PRD-utkast.

### Plan
- Lese `prd-carmen-utkast.md` (`origin/Carmen/Branch`) og `prd-COSI - MRP-2026-11-04/prd.md` (`origin/Idun/Branch`), møtesiden og PRD, addendum, memlog og ordbank.
- Punkt 1 («avvent») og 5 («ta inn F3») gjelder det samme. De er lest slik at F3 beskrives i PRD-en nå, men som utvidelse etter v1.
- Føre inn ved Update (ikke Finalize). `status: final` settes ikke ennå.
- Forrige økt: [prd-sammenligning-grener](987-2026-11-05-16-30-36-prd-sammenligning-grener.md).

### Resultat
- **prd.md:**
  - Nye NFR-9 Robust feilhåndtering (Carmens NFR-05), NFR-10 Lagring i nettleseren (NFR-09, tilpasset lagring per ferdigprodukt) og NFR-11 Kompatibilitet med Excel (NFR-11).
  - Carmens NFR-12 er skrevet inn i NFR-1 og NFR-2, fordi kravene overlappet.
  - Ny §4.9 Produksjonskapasitet fra lager (FR-30–FR-34, fra Iduns F3) som utvidelse etter v1. Kapasiteten er regnet med nedbryting gjennom stykklisten, slik at felles deler og lager av deler som produseres selv gir riktig svar. Det nye begrepet «ledig beholdning» (lager minus SS) er brukt, fordi «disponibel beholdning» er opptatt.
  - Antagelser for F3 i §10. Ny §9 nr. 12 (når kapasiteten bygges) og ny linje i §7.2.
  - Ny §8.1 Brukertest. SM-3 sier nå «alle testpersonene» i stedet for «3 av 3». §9 nr. 4 er snevret inn til introduksjon, oppgaver og dokumentasjon.
  - Nye begreper i §3, og status i §0 er oppdatert.
- **addendum.md:** arkitekturinnspill (NFR-9, NFR-10, NFR-11, kapasitetsberegning med binærsøk), UX-innspill, en ny rad i faseplanen, bakgrunn med oversikt over hvilke av Carmens NFR-er som ble til hvilke av våre, og endringshistorikk for 2026-11-09.
- **Ny `beslutninger-2026-11-09.md`** i PRD-mappa: beslutningene, gruppens originaltekst om brukertesten og valgene jeg gjorde da de ble ført inn.
- **`.memlog.md`:** 6 nye linjer.
- **`.docs/ordbank.md`:** ny tabell Produksjonskapasitet (produksjonskapasitet, ledig beholdning, begrensende del), og Lokal lagring, Brukertest, Testperson og Testleder under App og test.
- Commit 2089e36, pushet til `Sebastian/Branch`. PRD-en er nå ca. 8 400 ord.
- Lukket i `issues.md`: punktet om endringene etter gruppemøtet, og delvis punktet om testpersoner til brukertesten.

### Åpne punkter
- Gruppa ser over valgene i `beslutninger-2026-11-09.md`: punkt 1 og 5 lest som F3 etter v1, «alle testpersonene» i SM-3, NFR-12 skrevet inn i NFR-1/NFR-2, «ledig beholdning», og antagelsene for F3 i PRD §10.
- Sett `status: final` (Finalize steg 7) og merge PRD-en til `main`.
- Bestem introduksjonen og oppgavene i brukertesten, og hvor resultatet dokumenteres (PRD §9 nr. 4, i UX-steget).
- Lag testfiler for NFR-9 med `lag_testdata.py`: en skadet `.xlsx`-fil, en fil på 0 byte med endelsen `.xlsx` og en tekstfil med endelsen `.xlsx`.
- Finn noen i gruppa med Mac og Excel til testen av NFR-11.
- Gruppa avgjør når produksjonskapasitet fra lager bygges (PRD §9 nr. 12, etter 15.12).

## 2026-11-09 kl. 08:53 — Sebastian

### Oppgave
Sebastian rettet punkt 1: produksjonskapasiteten (F3) skal være med i v1, ikke vente. Deretter skulle PRD-en settes til final, og det skulle lages en PR mot main.

### Plan
- Spørre om plassen i byggerekkefølgen og om de fem antagelsene for F3, én og én.
- Skrive §4.9 om etter svarene, kjøre Finalize steg 7, flette inn main og gjøre PR #3 klar. En ny PR kan ikke lages fra samme gren mens #3 er åpen.

### Resultat
- **Sebastians valg:** kapasiteten blir trinn 4 i §7.1, og fast partistørrelse blir trinn 5.
  - Bekreftet: MPS må fylles ut, en kjøring med bare kapasiteten lagres og eksporteres ikke, og lager av deler som produseres selv brukes først.
  - Endret: ledig beholdning av ferdigproduktet telles med, og ledetiden er med.
- **§4.9 skrevet om:** FR-31 regner kapasiteten i uke t med nettingen (ledig beholdning, SS 0, mottak fra mottaksuken uten fremskynding, ingen nye ordrer for deler uten underdeler og ingen forfalt frigivelse). FR-32 viser to rader per uke, fra lager og med planlagte mottak. FR-33 viser begrensende deler med årsak (lager eller ledetid). FR-34 er panelet.
- **Resten av PRD-en:** ny SM-7, nytt punkt i §1 og JTBD, §3 og §7.1/§7.2 oppdatert, §9 nr. 12 lukket, og §10 er tom. Eksemplene i FR-31–FR-33 er regnet gjennom for hånd.
- Addendum, `beslutninger-2026-11-09.md`, ordbanken og memlog er oppdatert. `prd.md` og `addendum.md` har `status: final`. Commit 4e1e872.
- **Main flettet inn (feb8dfe):** det var konflikt i `.docs/ordbank.md` mot df10324 (ordbanken per 30.10). Versjonen på grenen er beholdt. Den inneholder alle begrepene fra main, utenom gamle navn som er byttet ut bevisst (Underkomponent, Delmontering, gamle avviksrader).
- **PR #3** har fått ny tittel og beskrivelse og er markert klar for gjennomgang. Den kan merges: https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/pull/3
- Lukket i `issues.md`: gjennomgangen av valgene, status final og når kapasiteten bygges.

### Åpne punkter
- Merge PR #3 til main når gruppa har sett på den.
- Lag en referanseberegning for kapasiteten i `lag_testdata.py` og et testeksempel med fasit kontrollert for hånd (SM-7: sikkerhetslager, mottak, lager av ferdigproduktet og av en del som produseres selv, felles del, ledetid som begrenser).
- Vurder å ta kapasiteten inn i en brukerreise (UJ-2) i UX-steget.
