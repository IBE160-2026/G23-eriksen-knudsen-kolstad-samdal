# UX-prototype 22.11.2026, versjon 4

**Avklaringene er godkjent av gruppen 22.11.** Versjon 4 er [versjon 3 på `main`](../../ux-prototype-2026-11-17-v3/README.md) med alle de 16 avklaringene fra 22.11 lagt inn. Hva som er valgt, og hvilke dokumenter som er endret, står i [`../README.md`](../README.md) og på siden «Avklaringer 22.11» i prototypen. PRD-en og ordbanken er autoritative. Kopiene i arbeidsmappen viser hvordan de blir hvis gruppen godkjenner valgene.

## Slik åpner du den

Dobbeltklikk på `index.html`. Den virker rett fra disken. Lagrede kjøringer bruker egne nøkler (`cosi-oda-proto-2211avk-*`), så de blandes ikke med versjon 1–3.

## Endret fra versjon 3

- **Resultat:**
  - Tallboksene og deretter Kritiske deler, Bestillingsforslag, Endringer (når de finnes) og Resultattabell på én lang side
  - Uten kritiske deler vises bare en kort melding
  - Ingen ukeplan
  - Bare kritiske deler og forfalt mengde har fargede tall i tallboksene
- **Eksepsjoner:** typenavnet og uken først, så en setning i vanlig språk, «Melding:» og «Hvorfor:». Markøren følger Sebastians kobling.
- **Ny kjøring:** valgene heter Bestillingsplan, Produksjonskapasitet og Begge, og Bestillingsplan er forhåndsvalgt
- **Introduksjonssiden:** vises første gang. Teksten følger rekkefølgen i resultatet.
- **Lys og mørk:** knappen står nederst i sidemenyen, ikke i prototypeboksen
- **Prototypevalg:** bare simuleringene står igjen (valideringsfeil, blokkert lagring, ingen kritiske deler) og valget om å vise de gule merkene. Valgene som er avklart, er faste, også i nettlesere som har lagret noe annet.
- **Siden «Eksepsjonstekst: A og B» er fjernet.** «Uavklarte spørsmål» er erstattet av «Avklaringer 22.11».

## Hva som bare er simulert

Det samme som i versjon 1–3: ingen beregning (tallene er fra referanseberegningen bak fasitene), ingen ekte opplasting og ingen ekte eksport.

## Filer

| Fil | Innhold |
|---|---|
| `index.html` | Prototypen |
| `data.js` | Tallene fra referanseberegningen bak fasitene (samme som i versjon 1–3) |
| `lag_data.py` | Lager `data.js` på nytt |
| `avvik-mot-prd.md` | Avvikslisten fra 17.11, med avklaringene fra 22.11 merket |
