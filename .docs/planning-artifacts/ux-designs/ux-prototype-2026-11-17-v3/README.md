# UX-prototype 17.11.2026, versjon 3

**Forslag, ikke godkjent av gruppen.** Versjon 3 er [versjon 2](../ux-prototype-2026-11-16-v2/README.md) med to tips fra Sebastian, hentet fra Carmens samlede prototype 16.11 (`ux/samlet-prototype-2026-11-16/cosi-mrp-samlet.html` på `Carmen/Branch`). Resten er som i versjon 2. Versjon 1 og 2 er ikke endret. PRD-en (`prds/prd-COSI - MRP-2026-10-19/prd.md`) og ordbanken (`.docs/ordbank.md`) er autoritative.

## Slik åpner du den

Dobbeltklikk på `index.html`. Den virker rett fra disken. Under «Prototypevalg» kan du slå hvert av tipsene av og på og sammenligne med versjon 2.

## Endret fra versjon 2

Begge endringene gjelder bare toppen av Resultat.

| Tips | Endring |
|---|---|
| Carmens bokser øverst | Sammendraget har fire bokser: kritiske deler, bestillingsforslag i uke 1, bestillingsforslag i alt og forslag med forfalt mengde. Hver boks har et stort farget tall, en tittel og én kort forklaring. Forfalt mengde har fått sin egen boks. I versjon 2 sto den i boksen for uke 1. Når Endringer vises, kommer en femte boks med antall endringer. |
| Carmens runde knapper | En rad med runde knapper, én per seksjon, i den faste linjen øverst. Knappene blir stående når man ruller, og den aktive seksjonen er markert. Endringer og Produksjonskapasitet får knapp bare når seksjonen vises. |
| Lenkene i sidemenyen | Seksjonslenkene under «Resultat» i sidemenyen er skjult som standard. De kan slås på igjen under Prototypevalg. |

Avklart med Oda 17.11:

- Boksene og knappene følger valget «Rekkefølge i resultatet» (U14). Standard er Kritiske deler først.
- Carmens knapp «Oversikt» er ikke med, fordi ordbanken sier «Ikke bruk» om «oversikt».

Avvik fra Carmens utgave:

- **Symbolene.** Carmen bruker ⚠ for kritiske deler og ⧗ for forfalt. Her brukes ● som i merket «Kritisk del», og det røde «!»-merket som forslagslisten allerede bruker for forfalt mengde. ⧗ betyr allerede «Ledetid overskrider horisont» i denne prototypen.
- **Forklaringen under forfalt.** Den er «Skulle vært bestilt før uke 1. Mengden er lagt i uke 1.» i stedet for Carmens «… Bestill dem først», som ikke står i PRD-en.

## Nye valg under Prototypevalg

| Valg | Standard | Alternativ |
|---|---|---|
| Sammendraget øverst i resultatet | Fire bokser (Carmen, Sebastians tips) | Som i versjon 2 |
| Runde knapper for seksjonene | Vis | Skjul |
| Seksjonene som lenker i sidemenyen | Skjul | Vis (som i versjon 2) |

## Uavklarte spørsmål

U1–U14 er som i versjon 2. Det er ingen nye spørsmål.

## Hva som bare er simulert

Det samme som i versjon 1 og 2. Lagrede kjøringer bruker egne nøkler (`cosi-oda-proto-1711v3-*`), så de blandes ikke med versjon 1 og 2.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Prototypen |
| `data.js` | Tallene fra referanseberegningen bak fasitene (samme som i versjon 1 og 2) |
| `lag_data.py` | Lager `data.js` på nytt: `uv run --with openpyxl python ".docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/lag_data.py"` |
