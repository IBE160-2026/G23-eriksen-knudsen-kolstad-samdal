# UX-prototype 16.11.2026

**Forslag, ikke godkjent av gruppen.** Ny klikkbar prototype som bygger på avklaringene fra gruppemøtene. PRD-en (`prds/prd-COSI - MRP-2026-10-19/prd.md`, final 13.11) og ordbanken (`.docs/ordbank.md`) er autoritative. Der de ikke avgjør et spørsmål, er spørsmålet merket med et gult «U»-merke i prototypen og står i lista under. Ingen eksisterende UX-filer er endret.

## Slik åpner du den

Dobbeltklikk på `index.html`. Den virker rett fra disken (`file://`). Skriftene hentes fra Google Fonts når maskinen er på nett, og ellers brukes systemskrift.

Forslag til gjennomgang:

1. **Introduksjon** → «Kom i gang».
2. **Ny kjøring**: velg en fil, eller trykk «01» under «Prototype: bruk testeksempel uten fil», og så **Beregn**.
3. Les **Resultat** ovenfra og ned: sammendrag, Bestillingsforslag (med ukefilter), Kritiske deler, Resultattabell med forklaringspanel og Ukeplan (valgfri).
4. Velg en kritisk del, eller klikk et tall i tabellen. Piltastene flytter, Enter forklarer og Esc lukker.
5. **Endringer:** kjør «02» og så «03». Da kommer seksjonen Endringer (UJ-3).
6. **Kapasitet:** velg «Bestillingsplan og produksjonskapasitet» og kjør «05» (UJ-5).
7. **Prototypevalg** (i sidemenyen): lys eller mørk, A eller B for eksepsjonsteksten, A eller B for «én resultatside» og de andre uavklarte valgene.
8. **Eksepsjonstekst: A og B** viser de to variantene side om side for alle fem eksepsjonstypene.

## Hva prototypen bygger på

| Ønske fra gruppen | Slik er det løst | Kilde |
|---|---|---|
| Introduksjonssiden fra Carmen | Egen introduksjonsside, som vises første gang appen åpnes | Carmens demo 16.11 |
| Oppbygningen fra Carmen | Sidemeny med Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer og Veiledning. Seksjonene i resultatet står som underlenker. | Carmens demo |
| Lyst og mørkt design | Begge, med Carmens tokens fra DESIGN.md | Carmens DESIGN.md |
| Momentene fra Sebastians resultattabell, med Carmens design | Faste venstrekolonner, «Kritisk del» i delens felt, markør i cellen, filteret «Vis bare kritiske deler», én tabulatorstopp med piltaster | Sebastians EXPERIENCE.md |
| Forklaringspanelet står åpent ved siden av tabellen (FR-18) med Carmens fire lag | Eksepsjonen først, så 1 Svaret, 2 Utregningen, 3 Tallene (lenker) og 4 Regelen. Åpnes ved klikk eller Enter, aldri ved peking, og står til det lukkes. | PRD FR-18, Carmens EXPERIENCE.md |
| Alle bestillingsforslag samlet, med ukefilter (FR-17) | Én liste sortert etter frigivelsesuke, med ukefilter og antall per uke | PRD FR-17 |
| Eksepsjoner og kritiske deler med tekst eller symbol og farge (FR-15) | Fem symboler og farger (Carmen), alltid med tekst eller et tilgjengelig navn | PRD FR-15, NFR-8 |
| Lett å forstå uten MRP-erfaring | Sammendrag øverst, «Slik leser du resultatet», en forklaring av frigivelsesuke over lista, klartekst ved hver eksepsjon og svaret i én setning i panelet | PRD SM-3 |
| Ukeplanen lenger ned, ikke et obligatorisk steg | Nederst i resultatet, merket valgfri. Den samlede lista gjelder. | Carmens konsept B |
| Ingen innlogging eller bedriftskonto | Ikke med | PRD §7.2, NFR-4 |

## Uavklarte spørsmål

Står også i prototypen under «Uavklarte spørsmål», med hva PRD-en sier og hva prototypen viser.

| Nr. | Spørsmål |
|---|---|
| U1 | Hva inngår i «én resultatside»? Prototypen viser A (én lang side) og B (utvidbare seksjoner). |
| U2 | Eksepsjonstekst: vanlig språk først (A) eller offisielt typenavn først (B)? Navnene i A står ikke i ordbanken. |
| U3 | «Kritiske deler» (PRD og ordbank) eller «Krever oppfølging»? |
| U4 | Starter ukefilteret på «Alle uker» eller «Uke 1»? |
| U5 | Ukeplanen går mot FR-17 («ingen egen ukevisning i tillegg til listen»). Krever en PRD-endring eller en avklart tolkning. |
| U6 | Introduksjonssiden finnes ikke i PRD-en. Hvilken side er «startsiden» i FR-27? |
| U7 | Lys eller mørk visuell retning? |
| U8 | Ord i grensesnittet som ikke står i ordbanken: Introduksjon (som side), Ny kjøring, Resultat, Lagrede kjøringer, Ukeplan og Sammendrag. Ingen ord er lagt inn i ordbanken. |
| U9 | Hvor står Endringer? PRD-en sier det ikke. Prototypen setter den etter Bestillingsforslag. |
| U10 | Filteret «Vis bare kritiske deler» står ikke i PRD-en. |
| U11 | Standardvalg for «Hva vil du beregne?» |
| U12 | Hvilken rad bærer eksepsjonsmarkøren? Prototypen bruker Sebastians kobling. |
| U13 | Endelig ordlyd i eksepsjonsmeldingene (FR-13). |

## Hva som bare er simulert

- **Ingen beregning.** Fila leses ikke. Filnavnet avgjør hvilket testeksempel som vises: «02», «03» eller «05» i navnet gir det eksempelet, og alt annet gir 01.
- **Tallene** kommer fra referanseberegningen bak fasitene (`testdata/lag_testdata.py`). `lag_data.py` lager `data.js`. Kjør den på nytt hvis testdataene endres:
  `uv run --with openpyxl python ".docs/planning-artifacts/ux-designs/ux-prototype-2026-11-16/lag_data.py"`
- **Valideringsfeil** og **blokkert lagring** slås på under Prototypevalg.
- **Eksport til Excel** er bare en knapp.
- **Lagrede kjøringer** ligger i nettleserens `localStorage` med egne nøkler (`cosi-oda-proto-1611-*`), så de blandes ikke med andre prototyper.
- Kapasitetstall finnes bare for testeksempel 05.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Prototypen: én fil med CSS og JavaScript |
| `data.js` | Tallene for testeksempel 01, 02, 03 og 05, sammenligningen 02 ↔ 03 og kapasiteten for 05 |
| `lag_data.py` | Lager `data.js` fra `testdata/lag_testdata.py` |
