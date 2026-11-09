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
