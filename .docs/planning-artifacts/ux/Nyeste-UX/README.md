# Nyeste UX – COSI-MRP

> **UX-prototype med simulerte MRP-resultater. Forslag, ikke godkjent av gruppen.** Lagt inn 19.11.2026 av Carmen.

Prototypen bygger på Odas UX-prototype 17.11 versjon 3 (`origin/Oda/Branch`, commit `0200f22`) med Carmens mørke Design B (`COSI-MRP-UX-v3-Design-B`). Odas originalfiler og tidligere UX-versjoner er ikke endret. PRD-en og ordbanken er autoritative.

- **Fra Oda:** struktur, sider, tekster, valg og logikk: Introduksjon, Ny kjøring i tre steg, Resultat med fire bokser og runde knapper for seksjonene, forklaringspanel, Endringer, Ukeplan, Lagrede kjøringer, Veiledning og Prototypevalg (U1–U14). `data.js` er en uendret kopi av tallene fra referanseberegningen.
- **Fra Carmen:** mørkt tema i hele appen med fargene fra Design B: dyp blågrønn `#0B2725`, glow `#2DD4BF`, koral `#FF8F7E` og sand `#F2C27B`. Sidemenyen har gradient og en glødende markør, introduksjonen et mørkt felt med lys og prikkmønster, kortene er avrundet, og skriften er systemskriften fra Design B. Lys variant kan velges under Prototypevalg → Visuell retning (U7).

Ingen innlogging eller bedriftskonto. Ingen ekte beregning: tallene er ferdige data fra testeksempel 01, 02, 03 og 05.

## Slik åpner du den

1. Fra prosjektroten: `python3 -m http.server 8765 --bind 127.0.0.1`
2. Åpne http://127.0.0.1:8765/.docs/planning-artifacts/ux/Nyeste-UX/index.html
3. Er porten opptatt, bruk et annet tall både i kommandoen og i adressen.

Nedlasting av malen og testeksempel 01 bruker filene i `testdata/` i prosjektroten.

**Prøv:** Kom i gang → under «Prototype: bruk testeksempel uten fil» velger du 01 → Beregn. Kjør så 02 og deretter 03 for å se Endringer.

## Avklares med gruppen

- Om appen skal være helt mørk, eller ha lys bakgrunn med mørke flater som i Design B v3
- Mørk som standard (U7) går mot `DESIGN.md`, der lys er standard
- Avvikene mot PRD-en fra Odas versjon 3 gjelder fortsatt, blant annet U14 (rekkefølge), U5 (ukeplan mot FR-17) og ord som mangler i ordbanken
