# Kilder og sammenslåing 22.11.2026

Denne mappen har den sammenslåtte UX-en for COSI - MRP: [EXPERIENCE.md](EXPERIENCE.md) og [DESIGN.md](DESIGN.md). Den er laget for å kunne gå til `main` som gruppens felles UX-dokumenter. **Status:** utkast, må godkjennes av gruppen. Avklaringene fra 22.11 er godkjent. Det som må godkjennes nå, er selve sammenslåingen.

## Kildene

| Kilde | Hvor | Hva som er brukt |
|---|---|---|
| Carmens EXPERIENCE.md og DESIGN.md (12.11) med Odas endringer 22.11 | `ux-avklaringer-2026-11-22/ux-carmen/` på `Oda/Branch`. Originalen ligger i `ux/ux-COSI - MRP-2026-11-12/` på `Carmen/Branch` | **Grunnlaget.** Strukturen, alle tokens, farger, skrift, eksepsjonssymbolene, komponentene, tilstandene og brukerreisene |
| Avklaringene U1–U14, V3-a og V3-b (godkjent av gruppen 22.11) | `ux-avklaringer-2026-11-22/README.md` | Rekkefølgen i resultatet, tallboksene, seksjonsmenyen, introduksjonssiden og startsiden, lys og mørk, meldingene og ordene |
| Prototypene v1–v4 (Oda, 16.–22.11) | `ux-prototype-2026-11-16/`, `-16-v2/`, `-17-v3/` og `ux-avklaringer-2026-11-22/prototype/` | Startsiden med tre kort, veiledningssiden, «Slik leser du resultatet», første bestillingsforslag i kritiske deler, venstrekanten i eksepsjonsfargen, kolonnen Forfalt, kapasitetspanelet med fire punkter, tegnforklaring og symboler med ord, «filen» i stedet for «fila» |
| Sebastians EXPERIENCE.md og DESIGN.md (13.–14.11) | `ux-designs/ux-COSI - MRP-2026-11-13/` på `Sebastian/Branch` | Detaljene i oppførselen (se under), tekstforslagene, tilgjengeligheten, brukertesten og listen over hva som må gjøres før bygging |
| PRD-en, addendum og ordbanken | `main` (PR #16) | Kravene. UJ-5 og oppgavene i brukertesten står nå i PRD-en og er ikke lenger antagelser |

## Hva som er hentet fra Sebastian

Prototypene tok allerede inn noen av Sebastians momenter: faste venstrekolonner, «Kritisk del» i delens felt, markøren i cellen, filteret «Vis bare kritiske deler» og én tabulatorstopp i tabellen. I tillegg er dette hentet inn nå:

- **Foundation:** minste skjerm 1366 × 768 (vindu 1366 × 630), omfanget (kapasitet kuttes først) og at skjermene for trinn 1–2 må være klare før prøvetesten.
- **Voice and Tone:** reglene for ord, eksepsjonsmeldingene per type med eksempler, «Hvorfor:», meldingene for feil i hele filen, tall og datoer, og flere gjør/ikke gjør-eksempler. Meldingene følger variant B fra 22.11: typenavnet og uken først, så setningen.
- **Komponenter:** Beregn deaktiveres aldri, opplastingssonen (ekte knapp, flere filer, nullstilling etter feil), feiloppsummeringen (strukturfeil først, sammenslåtte feil, Excel-radnummer), seksjonsmenyen (antall bare der det sier noe om arbeid, `aria-current`), endringslisten (etikettene fra fasit 03, alle linjer vises, hvilke linjer som kan velges), eksporten (filnavn, arket Sammenligning, filtrene påvirker ikke), knappen for forfalt mengde som går til eksepsjonen, og «Viser … av …».
- **Eksepsjonsmarkøren:** tabellen over hvilken celle hver type står i (godkjent som U12).
- **Forklaringspanelet:** linjen for celle uten eksepsjon i en kritisk del, fokusreglene, tekstene for hvert lag og akseptsjekken for 1366 × 768.
- **Resultattabellen:** rullemodellen og tiltakene for ytelse ved 1000 rader.
- **Tilstander:** kjøring ferdig, reload, Tilbake, eksport feilet og sammenslått visning.
- **Interaksjon og tilgjengelighet:** hele tastaturmodellen (PgUp/PgDn, delens felt), «Gå til forklaringen», NVDA-testen, statusregionen og semantikken i tabellen.
- **Produksjonskapasitet og fast partistørrelse:** årsaksordene og plassen som er reservert for trinn 5.
- **Brukertest:** prosedyren, introduksjonen, oppgavelappene, fasitsvarene og rubrikken, tilpasset avklaringene 22.11.
- **Før bygging og Senere.**
- **DESIGN.md:** at skriften selvhostes (NFR-4), minste skjerm og tallformatet med hardt mellomrom.

## Hvordan motstridende forslag er løst

| Tema | Carmen | Sebastian | Valgt | Hvorfor |
|---|---|---|---|---|
| Visuell retning | Petrol, IBM Plex, kjølige flater | «Lag på lag»: salvie og messing, Source Sans 3, stein, brett og kort | Carmen | Prototypene v1–v4 og avklaringene 22.11 bygger på Carmens tokens |
| Lys og mørk | Lys, mørk utsatt | Bare lys | Begge, lys standard | U7, godkjent 22.11 |
| Eksepsjonsfarger | Fem typer med hver sin farge og symbol | To nivåer (kritisk og advarsel) med to ikoner | Carmen | Prototypene bruker Carmens fem. Nivåene finnes bare i kode, som Sebastian sier |
| Rekkefølgen i resultatet | Bestillingsforslag først | Bestillingsforslag først | Kritiske deler først | U14, PRD §4.4 er endret |
| Navigasjon | Seksjonsmeny i kjøringslinjen | To mørke lag øverst med ankerlenker | Runde knapper i kjøringslinjen, appmeny til venstre | V3-b og U6 |
| Tall øverst | Ingen store tall | Statuslinje med tall i tekst, ingen tallkort | Fire tallbokser | V3-a |
| Ukefilteret ved start | Alle uker (antagelse) | Uke 1 | Alle uker | U4 bekreftet Carmens forslag. Svaret på oppgave 3 i brukertesten er da synlig |
| Bekreftelse før sletting | I siden selv | Modal dialog | I siden | Ingen modale elementer, slik begge ellers sier |
| «Slett lagret kjøring» | På startsiden | I toppfeltet | På siden Lagrede kjøringer | U6 |
| Endringslisten | 5 linjer og «Vis alle» | Alle linjer | Alle linjer | U1: én lang side der alt er åpent |
| Begrensende deler i kapasiteten | Under tallet | Egen rad «Begrenset av» med celler over flere uker | Under tallet, med symbol og ord | Prototypen v2–v4 |
| Overskrift på kapasiteten | «Produksjonskapasitet fra lager» | «Hvor mange ferdigprodukter kan være ferdige?» | «Produksjonskapasitet» | Prototypen. Innledningen svarer på spørsmålet |
| Peking | – | Ingenting endres ved peking utenom pekeren | Rammen kan endres litt, men ingenting åpnes | Prototypen. FR-18 forbyr bare at noe åpnes |
| Venstrekant i farge | – | Forbudt | Brukes i kritiske deler og informasjonsbokser | Odas valg i prototypen v2 |
| Radhøyde | 32 px | 40 px | 32 px | Carmens tokens |
| Ordliste i panelet | – | I samme panel | Utsatt til «Senere» | PRD-en krever den ikke. Regelen i lag 4 og «Hvorfor:» dekker FR-18 |
| Graf, tetthetsbryter | – | Utsatt | Utsatt | Begge |
| «fila» eller «filen» | «filen» | «fila» | «filen» | Odas valg i prototypen v2 |

## Ordbanken

Disse ordene fra dokumentene er lagt inn i `.docs/ordbank.md` som forslag: Appmeny, Kjøringslinje, Opplastingssone, Feiloppsummering, Delens felt, Eksepsjonsmerke, Forklaringspanel, Ukefilter og Statusmelding. Ordene fra 22.11 (Tallboks, Seksjonsmeny, Introduksjonsside, Startside, Resultat og flere) står der fra før.

## Før dokumentene går til `main`

1. Gruppen godkjenner sammenslåingen, særlig valgene i tabellen over som ikke var en del av avklaringene 22.11.
2. Prototypen v4 bør følge med til `main`, fordi dokumentene viser til den. I dag ligger bare v3 på `main`.
3. Carmens og Sebastians egne mapper blir historikk. Det er greit å la dem ligge på sine brancher.
