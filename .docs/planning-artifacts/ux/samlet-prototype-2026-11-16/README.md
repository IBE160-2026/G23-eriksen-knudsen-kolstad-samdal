# Samlet UX-prototype (Carmen + Sebastian), 16.11.2026

**Foreløpig UX-forslag, ikke godkjent av gruppen.** På gruppemøtet 16.11.2026 besluttet gruppen å undersøke om Carmens og Sebastians UX-forslag kan slås sammen til én felles COSI-MRP-prototype. Denne prototypen er det første forsøket. Den skal gjøre det lettere å diskutere og prøve ut en felles løsning før UX-spesifikasjonen (DESIGN.md og EXPERIENCE.md) og arkitekturen oppdateres. Originalene er ikke endret.

Fil: `cosi-mrp-samlet.html` (én fil, ingen eksterne skript eller nettilgang).

## Slik åpner du den

Fra prosjektroten: `python3 -m http.server 8767 --bind 127.0.0.1`, og åpne
http://127.0.0.1:8767/.docs/planning-artifacts/ux/samlet-prototype-2026-11-16/cosi-mrp-samlet.html

Serveren trengs for at nedlasting av malen og testeksempel 01 skal virke i Safari.

## Kilder

- Carmen: `ux/demo-2026-11-16/cosi-mrp-b-mork-samlet.html` og `ux/ux-COSI - MRP-2026-11-12/` (Carmen/Branch, 9d528d4)
- Sebastian: `ux-designs/ux-COSI - MRP-2026-11-13/` med DESIGN.md, EXPERIENCE.md og `mockups/` (origin/Sebastian/Branch, af5dadd)
- PRD, addendum og ordbank på origin/main (d5482d7). De gjelder ved avvik.

## Hva som er tatt fra hvem

| Del | Fra | Merknad |
|---|---|---|
| Introduksjon, sidemeny, mørkt Design B, nøkkeltall i mørkt felt | Carmen | Innlogging og bedriftskonto er fjernet (punkt 10 fra møtet) |
| Ukeplan (tavle og uke-detaljer) | Carmen | Valgfri seksjon nederst på resultatsiden, ikke et eget steg |
| Startside: veiledning i tre steg, slippsone, Beregn, feiloppsummering | Sebastian | |
| Resultattabell med faste venstrekolonner, «Kritisk del» i ryggen og eksepsjonsmerke i cellen | Sebastian | |
| Forklaringspanel med eksepsjonen først og fire lag | Sebastian | Står ved siden av tabellen til det lukkes (FR-18) |
| Bestillingsforslag med ukefilter og «forfalt»-knapp, liste over kritiske deler | Sebastian | |
| Eksepsjonsmeldinger | Sebastian (EXPERIENCE.md) | Setningen i vanlig språk er fra Carmen |

## Simulert

Fila leses ikke, og ingenting beregnes. Alle tall er fra fasiten for testeksempel 01 (Kontorstol Basic). Eksporten er bare en melding. Valideringsfeil vises når de slås på under «Prototypevalg». Endringer (FR-20), produksjonskapasitet (trinn 4) og lagrede kjøringer er ikke med.

## Uavklart (velges under «Prototypevalg»)

1. «Kritiske deler» (PRD og ordbank) eller «Krever oppfølging»
2. Offisielt typenavn eller vanlig språk først i eksepsjonene
3. Mørk (Carmen) eller lys (Sebastian) visuell retning
4. Om ukefilteret starter på «Alle uker» eller på «Uke 1»

Også uavklart: hvordan «én resultatside» i PRD §4.4 skal tolkes, om Ukeplan er innenfor FR-17 («ingen egen ukevisning»), og om introduksjonssiden og ordene «Ukeplan» og «Oversikt» skal inn i PRD og ordbank.
