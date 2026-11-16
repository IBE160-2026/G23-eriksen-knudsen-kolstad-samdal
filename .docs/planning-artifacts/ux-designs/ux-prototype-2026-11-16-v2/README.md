# UX-prototype 16.11.2026, versjon 2

**Forslag, ikke godkjent av gruppen.** Versjon 2 bygger på [versjon 1](../ux-prototype-2026-11-16/README.md) og Odas presiseringer 16.11. Versjon 1 er ikke endret og kan brukes til sammenligning. PRD-en (`prds/prd-COSI - MRP-2026-10-19/prd.md`) og ordbanken (`.docs/ordbank.md`) er autoritative. Uavklarte spørsmål er merket med gule «U»-merker i prototypen.

## Slik åpner du den

Dobbeltklikk på `index.html`. Den virker rett fra disken. Under «Prototypevalg» i sidemenyen kan dere bytte mellom variantene og prøve dere fram. Valgene huskes i nettleseren.

## Endret fra versjon 1

| Presisering | Endring |
|---|---|
| «filen», ikke «fila» | All tekst bruker «filen». |
| Utklippet på introduksjonssiden | Fjernet. Det var bare en illustrasjon, ikke data fra en kjøring. |
| «Les veiledningen» | Fjernet fra introduksjonssiden, sammen med lenken «Slik fyller du ut malen» på Ny kjøring. Siden Veiledning forklarer nå hvordan nettsiden brukes, ikke Excel-malen. Ny kjøring sier at arket Veiledning i malen forklarer utfyllingen. |
| «Slik leser du resultatet» | Beholdt. Rekkefølgen følger seksjonene. |
| Ukeplan | Overskriften er bare «Ukeplan», uten «valgfri» og uten beskrivelsen etter overskriften. |
| Kritiske deler før Bestillingsforslag | Kritiske deler står først i resultatet, i sammendraget, i menyen og i «Slik leser du resultatet». Hver kritisk del viser sitt første bestillingsforslag, og forslagene for kritiske deler har samme symbol som eksepsjonen. Dette går mot PRD §4.4 og er merket U14. Rekkefølgen fra PRD-en kan prøves under Prototypevalg. |
| Produksjonskapasitet | Symbolene er fylte, fargede firkanter med ordet Lager eller Ledetid ved siden av. En forklaringsboks over tabellen forklarer begge symbolene, og innledningen er delt i fire korte punkter. |
| Symboler for eksepsjoner og kritiske deler | Som i Carmens prototype: fylt farget firkant med symbolet (!, S, M, K, ⧗) og typenavnet i en myk farget merkelapp. Kritiske deler har en farget kant til venstre etter typen, og merket «● Kritisk del». |
| Forklaringspanel som kan lukkes | Beholdt. |
| Eksepsjonstekst A og B, uavklarte spørsmål | Ikke endret. Oda tar dem med gruppen. |
| Prototypevalg | Beholdt, med det nye valget «Rekkefølge i resultatet». |

## Uavklarte spørsmål

U1–U13 er som i versjon 1 (se README der og siden «Uavklarte spørsmål» i prototypen). Nytt:

| Nr. | Spørsmål |
|---|---|
| U14 | Kritiske deler før Bestillingsforslag. PRD §4.4 sier at brukeren ser bestillingsforslagene først. Gruppens ønske krever en endring i PRD-en. |

## Hva som bare er simulert

Som i versjon 1: ingen beregning, filnavnet avgjør testeksempelet (01, 02, 03 eller 05), eksport er bare en knapp, og valideringsfeil og blokkert lagring slås på under Prototypevalg. Lagrede kjøringer bruker egne nøkler (`cosi-oda-proto-1611v2-*`), så de blandes ikke med versjon 1.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Prototypen |
| `data.js` | Tallene fra referanseberegningen bak fasitene (samme som i versjon 1) |
| `lag_data.py` | Lager `data.js` på nytt: `uv run --with openpyxl python ".docs/planning-artifacts/ux-designs/ux-prototype-2026-11-16-v2/lag_data.py"` |
