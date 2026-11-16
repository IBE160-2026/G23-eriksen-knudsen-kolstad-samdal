# COSI-MRP – Design B tilpasset PRD-en (UX-prototype, 16.11.2026)

> **UX-prototype med simulerte MRP-resultater. Ikke godkjent av hele gruppen.**
> Fila som lastes opp, leses ikke, og ingenting beregnes. Alle tall er ferdige data fra de håndkontrollerte fasitene for testeksempel 01–03. Ekte lesing av Excel og MRP-beregning er ikke laget ennå.

Carmen og Oda har foreslått at Carmens mørke Design B skal være grunnlaget for appen. Denne prototypen er en kopi av `../demo-2026-11-16/cosi-mrp-b-mork-samlet.html`, tilpasset den gjeldende PRD-en på origin/main. Originalen er ikke endret.

## Slik åpner du nettsiden lokalt

Prototypen må åpnes via en lokal server, ellers virker ikke testdataene og nedlastingene. Du trenger bare Python 3, som finnes på Mac fra før.

1. Hent branchen (første gang: `git fetch origin` og `git switch Carmen/Branch`, ellers `git pull` på branchen).
2. Gå til prosjektroten (mappa `G23-eriksen-knudsen-kolstad-samdal`) i terminalen.
3. Start serveren:
   ```
   python3 -m http.server 8767 --bind 127.0.0.1
   ```
4. Åpne i nettleseren:
   http://127.0.0.1:8767/.docs/planning-artifacts/ux/design-b-prd-2026-11-16/cosi-mrp-b-prd.html
5. Stopp serveren med Ctrl+C når du er ferdig.

Er port 8767 opptatt, bruk et annet tall, for eksempel 8780, både i kommandoen og i adressen.

**Prøv dette:** «Kom i gang» → last ned testeksempel 01 → last det opp. Klikk på en kritisk del for å se eksepsjonen i tabellen, og velg en uke i bestillingsforslagene. Last opp testeksempel 02 og så 03 for å se Endringer. Under «Prototypevalg» øverst til høyre kan du slå på valideringsfeil og produksjonskapasitet.

## Filer prototypen bruker

Alle ligger i repoet:

| Fil | Brukes til |
|---|---|
| `cosi-mrp-b-prd.html` | Prototypen (én fil med HTML, CSS og JavaScript) |
| `../konsepter-2026-11-12/felles.js` | Testdata for testeksempel 01 (fasit) |
| `../konsepter-2026-11-12/data-kontorstol-pro.js` | Testdata for testeksempel 02 og 03 (fasit) |
| `testdata/COSI-MRP-mal.xlsx`, `testeksempel-01.xlsx`, `-02.xlsx`, `-03.xlsx` | Nedlastingene |

Kjøringene lagres bare i nettleseren din (`localStorage`, nøkler som begynner med `cosi-b-prd-`). Ingenting sendes til en server.

## Endret fra originalen

- Innlogging, bedriftskonto og delte kjøringer er fjernet. Introduksjonen har «Last ned testeksempel 01» som knapp nummer to.
- Resultatet er én side (PRD §4.4): Bestillingsforslag → Endringer (bare ved sammenligning) → Kritiske deler → Resultattabell → Ukeplan (valgfri) → Produksjonskapasitet (bare når valgt).
- Ny samlet liste over bestillingsforslag med ukefilter og knappen «forfalt» (FR-17).
- «Kritiske deler» brukes som i ordbanken. En kritisk del fører til riktig celle i resultattabellen og åpner forklaringen (FR-16).
- Eksepsjoner markeres i riktig tallcelle med farge og symbol, og med typenavn og «Kritisk del» ved delen (FR-15).
- Forklaringspanelet står ved siden av tabellen, med eksepsjonen først og kildekoblingene A, B og C (FR-18).
- Ukeplanen er en valgfri seksjon nederst. «Vis uka i bestillingsforslagene» setter ukefilteret.
- Simulert beregning er merket på Ny kjøring og på resultatsiden.

## Må fortsatt implementeres

Ekte Excel-lesing og validering (FR-1–FR-4, NFR-9, NFR-11), MRP-beregning og eksepsjoner med tester mot fasit (FR-5–FR-13, FR-28, FR-29, NFR-1, NFR-2), kapasitetsberegning (FR-31–FR-33), lagring av hele kjøringen, ekte sammenligning og eksport til .xlsx (FR-19, FR-20, FR-22, FR-23).

## Uavklart

- Hvor Endringer skal stå. PRD §4.4 plasserer den ikke.
- Om både eksepsjonsraden og markeringen i cellen skal beholdes (SM-C3).
- Om «Ukeplan», «Oversikt» og «Kildekobling» skal inn i ordbanken.
- Om introduksjonssiden skal inn i PRD-en eller EXPERIENCE.md.
