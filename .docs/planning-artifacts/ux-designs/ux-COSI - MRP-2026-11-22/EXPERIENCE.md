---
name: COSI - MRP
status: gjeldende – lagt på main 22.11 etter Odas godkjenning, med åpne spørsmål nederst i EXPERIENCE.md
authors:
  - Carmen Kolstad (grunnlaget, 12.11)
  - Sebastian (resultattabell, tekster, tilgjengelighet og brukertest, 13.11)
  - Oda (prototypene v1–v4 og avklaringene 22.11)
created: 2026-11-12
updated: 2026-11-22
sources:
  - ../../prds/prd-COSI - MRP-2026-10-19/prd.md
  - ../../prds/prd-COSI - MRP-2026-10-19/addendum.md
  - ../../../ordbank.md
  - Oda/Branch: ux-designs/ux-avklaringer-2026-11-22/README.md (avklaringene U1–U14, V3-a og V3-b, godkjent av gruppen 22.11)
  - Oda/Branch: ux-designs/ux-avklaringer-2026-11-22/prototype/index.html (prototypen v4)
  - Carmens EXPERIENCE.md 12.11 (Carmen/Branch, ux/ux-COSI - MRP-2026-11-12/)
  - Sebastians EXPERIENCE.md 14.11 (Sebastian/Branch, ux-designs/ux-COSI - MRP-2026-11-13/)
  - DESIGN.md
---

# COSI - MRP – Experience

> **Gjeldende UX-dokument, lagt på `main` 22.11.** Spørsmålene som fortsatt er åpne, står nederst i EXPERIENCE.md. Dette dokumentet slår sammen Carmens og Sebastians EXPERIENCE.md med avklaringene fra prototypene v1–v4. Hva som kommer fra hvem, og hvordan motstridende forslag er løst, står i [kilder.md](kilder.md). Visuelle valg står i [DESIGN.md](DESIGN.md), og tokennavn som `{colors.accent}` viser dit. Krav og begreper står i PRD-en og ordbanken og gjentas ikke her. PRD-en går foran alt. Dette dokumentet og DESIGN.md går foran prototypen ved avvik. `[ASSUMPTION]` markerer det gruppen ikke har bestemt. Se [Åpne designbeslutninger](#åpne-designbeslutninger) nederst.

## Foundation

- **Form:** én nettside for PC i nyere Chrome, Edge og Firefox (NFR-6). Ikke tilpasset mobil i v1, men mus, tastatur og berøring skal virke (FR-18). Minste skjerm er 1366 × 768, i praksis et vindu på cirka 1366 × 630 px ved 100 % zoom. I mindre vinduer og ved zoom opp til 200 % ruller siden loddrett, resultattabellen ruller i sitt eget område, og ingenting skjules.
- **Data:** alt skjer i brukerens nettleser. Ingen innlogging og ingen server for data (NFR-4). Filen forlater aldri maskinen. Siste vellykkede kjøring per ferdigprodukt lagres lokalt (FR-19, NFR-10). Ingen analyse eller måling fra tredjepart i v1.
- **Omfang:** kjernen er trinn 1–3 i PRD §7.1. Produksjonskapasiteten (trinn 4) kuttes først, så resten av opplevelsen avhenger ikke av den. Skjermene for trinn 1–2 (resultattabellen, eksepsjonene, bestillingsforslagene og forklaringspanelet) må være klare før prøvetesten rundt 27. november.
- **Språk:** all tekst på norsk bokmål, samlet slik at engelsk kan legges til (NFR-7). Begrepene følger ordbanken ordrett.
- **UI-system:** vanlig HTML og CSS fra UX-prototypen v3, skrevet om til React-komponenter, uten komponentbibliotek (ikke shadcn/ui, Radix eller Tailwind). Avgjort i arkitekturen 22.11 (AD-1). Dialoger, nedtrekkslister og radioknapper er vanlig HTML, med tastatur- og fokusoppførselen i dette dokumentet. Tokenene i DESIGN.md blir CSS-variabler.
- **Visuell identitet:** [DESIGN.md](DESIGN.md). Visuell referanse: [prototypen v4](https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/blob/Oda/Branch/.docs/planning-artifacts/ux-designs/ux-avklaringer-2026-11-22/prototype/index.html) (på `Oda/Branch`, last ned og åpne lokalt).

## Information Architecture

Appen har få sider, og de nås fra appmenyen til venstre. Etter en vellykket kjøring står alt om kjøringen på siden Resultat, i fast rekkefølge. Seksjonsmenyen ser ut som navigasjon, men er ankerlenker på samme side. Appen har ingen faner, ingen egne detaljsider og ingen veiviser etter opplastingen.

| Flate | Nås fra | Formål | Krav |
|---|---|---|---|
| Introduksjonsside | Første gang appen åpnes i en nettleser, og «Introduksjon» i appmenyen | Hva appen gjør, de tre stegene og «Kom i gang», som går til startsiden | FR-27 |
| Startside (menyvalget «Ny kjøring») | Senere besøk, «Ny kjøring» i appmenyen, «Kom i gang» og «Last opp ny fil» | Kort veiledning i tre steg, nedlasting av malen og testeksempel 01, opplasting, valg av beregning og Beregn | FR-1, FR-27, FR-30 |
| Startside med valideringsfeil | Beregn med valideringsfeil | Feiloppsummering øverst, ingen beregning. Ingen egen side | FR-2–FR-4, NFR-9 |
| Resultat | Beregn uten feil | Alt om én kjøring, i fast rekkefølge (under). Én lang side der alle seksjonene er åpne, og brukeren ruller | FR-14–FR-23, FR-30–FR-34 |
| Forklaringspanel (på siden Resultat) | Klikk eller Enter på en celle, et radnavn eller delens felt i tabellen, en linje i kritiske deler, en linje i endringslisten eller knappen for forfalt mengde | Hvordan et tall er regnet ut, og hvorfor en eksepsjon slo til | FR-18 |
| Lagrede kjøringer | «Lagrede kjøringer» i appmenyen | Siste kjøring per ferdigprodukt, med «Slett» | FR-19, FR-21 |
| Veiledning | «Veiledning» i appmenyen | Hvordan nettsiden brukes. Utfyllingen av malen står i arket Veiledning i malen | FR-27 |

**Resultat, ovenfra og ned** (PRD §4.4):

1. **Kjøringslinje** – ferdigprodukt, horisont, fil, tidspunkt, lagringsstatus, «Last opp ny fil» og «Eksporter til Excel». Står fast øverst når brukeren ruller. Nederst i linjen står **seksjonsmenyen**: én rund knapp per seksjon, i samme rekkefølge som seksjonene: Kritiske deler (antall) · Bestillingsforslag (antall) · Endringer (antall) · Resultattabell · Produksjonskapasitet. Knappene er ankerlenker, ikke faner (FR-34 krever at panelene står på samme side). Seksjonene er ikke lenker i appmenyen.
2. **Tallbokser** – fire bokser med et stort tall, en tittel og én kort forklaring: kritiske deler, bestillingsforslag i uke 1, bestillingsforslag i alt og forslag med forfalt mengde. Når Endringer vises, kommer en femte boks med antall endringer. Boksene følger rekkefølgen i resultatet.
3. **«Slik leser du resultatet»** – en kort, nummerert forklaring av seksjonene i samme rekkefølge. Den står åpen og kan felles sammen.
4. **Kritiske deler** (FR-16). Brukeren ser først det som krever handling. Er det ingen kritiske deler, står bare en kort melding her, ikke hele seksjonen.
5. **Bestillingsforslag** (FR-17): hva som skal bestilles eller settes i produksjon.
6. **Endringer siden forrige kjøring** (FR-20), bare når det finnes en tidligere kjøring for ferdigproduktet. PRD-en sier ikke hvor den står. Den står etter bestillingsforslagene, fordi §4.4 sier at brukeren ser kritiske deler og bestillingsforslag først.
7. **Resultattabell** (FR-14, FR-15), med forklaringspanelet til høyre når det er åpent.
8. **Produksjonskapasitet** (FR-34), eget panel. Bare når kapasiteten er valgt.

Når brukeren har valgt bare bestillingsplanen, finnes ikke punkt 8. Når brukeren har valgt bare produksjonskapasiteten, finnes bare punkt 1 og 8 (FR-30), og seksjonsmenyen og tallboksene skjules.

**Adresse og historikk.** Startsiden og Resultat har hver sin adresse i appen. Tilbake i nettleseren fra Resultat går til startsiden. Ankerlenkene i seksjonsmenyen endrer ikke adressen og legger ikke inn historikk. Oppførselen ved reload står i State Patterns.

**Lukket overflate:** hver flate har en brukerreise som lander der (se Key Flows).

## Voice and Tone

Tekstene er korte, saklige og på brukerens side. Kari tiltales med «du». De sier hva som skjedde og hva brukeren kan gjøre. Ingen unnskyldninger, ingen utropstegn, ingen feilkoder og ingen KI-preg.

**Ord.** Ordbanken bestemmer ordene:

- «Resultattabell» kalles aldri «oversikt», og «eksepsjon» kalles aldri «varsel».
- «Kritiske deler» brukes, ikke «Krever oppfølging».
- «Del» brukes, ikke «komponent» (unntatt i typenavnene). «Ferdigprodukt» brukes, ikke «produkt». «Beskrivelse» brukes, ikke «navn».
- Arket skrives «Prognostiserte behov (arket MPS)» første gang, ikke «MPS» alene.
- «Kjøring» brukes om hele kjøringen, og «beregning» bare om selve regnestykket (knappen Beregn, «Beregner …»).
- «Resultat» er siden. «Resultatside» brukes ikke.
- «Filen» brukes i bestemt form overalt, ikke «fila».
- Eksepsjonsnivåene «kritisk» og «advarsel» er interne og brukes bare i tokener og kode. Kari ser typenavnet, for eksempel «Bruk av sikkerhetslager».
- Om forfalte bestillinger brukes «før uke 1» og «bestilt», ikke «uke 0», «frigitt» eller «før horisonten».

| Gjør | Ikke gjør |
|---|---|
| «Filen har 3 feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.» | «Oops! Noe gikk galt med filen din.», «Du har gjort 3 feil» |
| «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.» (sted og felt først, som UJ-4) | «Ugyldig verdi i celle C5.», «feilkode 17» |
| «Arket Stykkliste mangler. Filen ser ut til å følge en gammel mal (arkene Produkt og Komponenter). Last ned malen fra startsiden og flytt dataene over.» | «The selected file must use the template» |
| «Du kan laste opp én Excel-fil (.xlsx).» / «Filen blir i nettleseren din og sendes ikke til noen server.» (NFR-4) | «Maks 1 fil. Ikke-xlsx avvises.», juridisk språk om personvern |
| «Slipp bare én fil. Ingen av filene er lest.» | At den første filen brukes uten å si det |
| «Leser filen …» → «Beregner …» | «Vennligst vent», spinner uten tekst |
| «Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.» (kunngjøres) | Ingen kunngjøring |
| «Første kjøring for Kontorstol Basic. Det finnes ingen tidligere kjøring å sammenligne med.» | «Ingen data tilgjengelig.» |
| «Ingen endringer i bestillingsforslag, eksepsjoner eller deler siden forrige kjøring (13.11 kl. 07:31). Andre tall kan ha endret seg.» (FR-20) | «Ingen endringer.» alene – brukeren kan tro at ingenting er endret |
| «Kjøringen blir ikke lagret, fordi nettleseren ikke tillater lagring. Neste opplasting kan ikke sammenlignes. Eksporter til Excel for å ta vare på den.» (NFR-10) | «Feil: localStorage utilgjengelig», varsel som forsvinner av seg selv |
| «Lagret kjøring er slettet. Neste opplasting vises uten sammenligning.» | «Slettet.» |
| «Excel-filen kunne ikke lages. Prøv Eksporter til Excel en gang til.» | «Export failed (500)» |
| «Slette lagret kjøring for Kontorstol Basic (100-002)? Neste opplasting vises uten sammenligning.» | «Er du sikker?» |
| «Hver fil gjelder ett ferdigprodukt. Lageret for deler som brukes i flere ferdigprodukter, må du fordele mellom filene selv.» | «… flere produkter …» |
| Knappetekster sier hva som skjer: «Last opp ny fil», «Eksporter til Excel», «Slett», «Lukk», «Kom i gang» | «OK», «Send», «Fortsett» |
| Typenavnet fra ordbanken først, med uke, og én setning i vanlig språk under | Andre navn på eksepsjonene enn ordbankens, eller bare typenavnet uten setning |

### Eksepsjonsmeldinger

Ordlyden er fri og kan forbedres fra fasiten, men opplysningene i FR-kravet skal alltid med (FR-13). Hver melding har fire deler i denne rekkefølgen (variant B, godkjent 22.11):

1. **Typenavnet** fra ordbanken og uken, for eksempel «Bestilling forsinket · uke 1».
2. **Én setning i vanlig språk** som sier hva som er galt. Den er aldri bare typenavnet, fordi «Bestilling forsinket» alene kan leses som at leverandøren er sen.
3. **«Melding:»** med opplysningene kravet krever. Handlingen står i første eller andre setning.
4. **«Hvorfor:»** med regelen og tallene satt inn, uten «uke 0» og «horisonten».

For Bestilling forsinket og Bruk av sikkerhetslager forklarer meldingen hvorfor resultattabellen viser et annet tall for forventet lagerbeholdning (FR-7: tabellen regner med at forfalte mottak kommer i tide). Meldingene for Ledetid overskrider horisont og Kanseller mottak sier at de bare gjelder innenfor horisonten (addendum). For Produksjonsordre skrives «å bestille» som «å starte produksjonen av», og «skulle vært bestilt» som «skulle vært satt i produksjon».

Forslag til tekst (fra Sebastian, prøves i prøvetesten). Eksemplene er fra testeksempel 01, unntatt Kanseller mottak, som bare finnes i testeksempel 02:

| Type | Krav | Setning i vanlig språk | Melding (eksempel) |
|---|---|---|---|
| Bestilling forsinket | FR-10 | «Bestillingen skulle vært sendt før uke 1.» (Produksjonsordre: «Produksjonen skulle vært startet før uke 1.») | «Du er for sent ute med å bestille hjul, så lageret blir −20 i uke 1. Bestill nå, og avtal raskere levering hvis du kan: 50 hjul skulle vært bestilt før uke 1. De 50 er lagt til forslaget på 175 i uke 1, men kommer tidligst i uke 2. Tabellen viser 30 i uke 1 fordi den regner med at de kommer i tide.» (300-003 Hjul) |
| Bruk av sikkerhetslager | FR-11 | «Bestillingen skulle vært sendt før uke 1, så sikkerhetslageret brukes.» | «Sikkerhetslageret for armlener brukes i uke 1 fordi du er for sent ute med å bestille dem. Bestill nå, så sikkerhetslageret fylles opp igjen: 10 armlener skulle vært bestilt før uke 1. De 10 er lagt til forslaget på 60 i uke 1, men kommer tidligst i uke 2.» (300-004 Armlene) |
| Mottak forsinket | FR-12 | «Mottaket i uke 4 trengs allerede i uke 3.» | «Lageret blir 0 i uke 3, under sikkerhetslageret på 10, før mottaket kommer. Be leverandøren levere mottaket på 100 i uke 3 i stedet for uke 4. Det lages ingen ny bestilling for dette behovet.» (300-005 Gassfjær) |
| Ledetid overskrider horisont | FR-9 | «Planen er for kort til å vise alt som må bestilles nå.» | «Ledetiden fra ferdigproduktet er 10 uker, like lang som horisonten. Bruk en lengre horisont: behov etter uke 10 som må bestilles nå, vises ikke. Delen mangler ikke.» (300-006 Stolfot) |
| Kanseller mottak | FR-29 | «Mottaket i uke 5 trengs ikke innenfor horisonten.» | «Mottaket på 50 i uke 5 trengs ikke innenfor horisonten (uke 5–10). Kanseller eller utsett det. Behov etter uke 10 er ikke regnet med.» (300-005 Gassfjær, testeksempel 02) |

Eksempel på «Hvorfor:»: «Hjul har 1 ukes ledetid, så hjulene som trengs i uke 1, skulle vært bestilt før uke 1. Uten dem går lageret under 0 i uke 1.»

### Feil i hele filen (NFR-9)

Én melding per tilfelle, ved opplastingen:

- **Ikke .xlsx** (FR-1): «Appen tar bare imot Excel-malen (.xlsx).»
- **Skadet fil:** «Filen kan ikke leses. Den er kanskje skadet. Lagre den på nytt fra Excel og prøv igjen.»
- **Tom fil (0 byte):** «Filen er tom. Lagre malen i Excel og last den opp på nytt.»
- **Ikke en Excel-fil, selv om den heter .xlsx:** «Filen heter .xlsx, men er ikke en Excel-fil. Åpne malen i Excel og lagre den som Excel-arbeidsbok.»
- **Passordbeskyttet:** «Filen er beskyttet med passord. Fjern passordet i Excel og last den opp på nytt.»
- **Uventet feil:** «Noe gikk galt under beregningen. Ingenting er vist eller lagret. Prøv igjen, eller last opp filen på nytt.»

### Tall og datoer

Tall skrives med hardt mellomrom som tusenskille og ekte minus «−». Endret mengde skrives «130 → 205 (+75)». Datoer skrives «13.11.2026 kl. 08:04». Uke «–» for hele delen har det tilgjengelige navnet «hele delen».

Alle tekster ligger samlet i én meldingskatalog, med én mal per valideringsregel i FR-3 og én per eksepsjonstype (NFR-7).

## Component Patterns

Oppførsel. Det visuelle står i DESIGN.md › Components, med de samme navnene.

| Komponent | Brukes | Regler for oppførsel |
|---|---|---|
| Appmeny | Alle sider | Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer og Veiledning. Nederst står knappen for lys og mørk visning |
| Lys og mørk visning | Appmenyen, nederst | Knappen «Bytt til mørk» / «Bytt til lys». Lys er standard. Valget huskes i nettleseren og gjelder alle sidene. Kan appen ikke lagre i nettleseren, gjelder valget til siden lukkes |
| h1 | Alle sider | Én synlig h1 per side, øverst i hovedfeltet. Startsiden: «Ny kjøring». Resultat: «Resultat for ‹beskrivelse›», skjult for øyet fordi kjøringslinjen viser ferdigproduktet, men lest av skjermleseren. Den har `tabindex="-1"` og får fokus etter Beregn. Med valideringsfeil er overskriften i feiloppsummeringen sidens h1. Logoen i appmenyen er ikke overskrift |
| Introduksjonsside | Introduksjonsside | Kort tekst om hva appen gjør, de tre stegene (fyll ut malen, last opp, les resultatet) og primærknappen «Kom i gang». Teksten følger rekkefølgen i resultatet |
| Veiledning på startsiden | Startside | Tre nummererte steg etter FR-27: (1) «Fyll ut Excel-malen», med «Last ned Excel-malen» og «Last ned testeksempel 01», og at arket Veiledning i malen forklarer utfyllingen; (2) «Last opp filen»; (3) «Velg hva du vil beregne, og beregn». Setningen om ett ferdigprodukt per fil står rett under h1. Nedlastingene er vanlige lenker med `download` og laster ned `COSI-MRP-mal.xlsx` (identisk med `testdata/COSI-MRP-mal.xlsx`, FR-27) og `testeksempel-01.xlsx`. Veiledningen kan felles sammen ved senere besøk `[ASSUMPTION]` |
| Opplastingssone | Startside | Dra og slipp, og alltid en vanlig «Velg fil»-knapp: en ekte `<button>` som åpner et skjult `<input type="file" accept=".xlsx">`. Fokus går tilbake til knappen etter fildialogen. Dra og slipp og «Velg fil» går gjennom samme kontroll av filtype og innhold (FR-1, NFR-9). Instruksjonene står i synlig hjelpetekst, og «Slipp Excel-filen her» er pynt. Valgt fil vises med navnet. Ett slipp erstatter forrige valg. Slipper Kari flere filer, brukes ingen. Feil i hele filen vises i sonen, og sonen er fortsatt aktiv. Etter en feil nullstilles valgt fil, så samme filnavn kan velges på nytt |
| Valg av beregning | Startside | Radiogruppe «Hva vil du beregne?» i denne rekkefølgen: Bestillingsplan (forhåndsvalgt) · Produksjonskapasitet · Begge, med én linje hjelpetekst hver (FR-30): «Bestillingsforslag, kritiske deler og resultattabellen.», «Hvor mange ferdigprodukter lageret og planlagte mottak rekker til, uke for uke. Kjøringen lagres ikke.» og «Bestillingsplanen, med produksjonskapasitet som eget panel nederst.» Ved «Last opp ny fil» og etter valideringsfeil står forrige valg igjen. Piltastene flytter valget. Radiogruppen vises ikke når trinn 4 er kuttet, og heller ikke i testbygget for brukertesten. Da gir Beregn bestillingsplanen |
| Beregn | Startside | Deaktiveres aldri. Uten valgt fil gir Beregn meldingen «Velg en fil først.» og flytter fokus til «Velg fil». Et nytt klikk mens beregningen pågår, starter ikke en ny kjøring |
| Feiloppsummering | Startside med valideringsfeil | Vises øverst, over opplastingen, også ved bare én feil. Overskriften er sidens h1, og brettet får fokus (`tabindex="-1"`, ingen `role="alert"`). Sidetittelen begynner med «Feil:». **Strukturfeil først:** gruppen «Filen følger ikke malen» samler manglende ark, manglende eller feilstavet kolonneoverskrift og gammel mal. Kontroller som avhenger av det som mangler, hoppes over, og gruppen sier hvilke. **Så verdifeil**, gruppert per ark i malens rekkefølge (Stykkliste → Prognostiserte behov (arket MPS) → Planlagte mottak) med antall per ark, sortert etter Excel-rad (på arket MPS etter uke). Hver linje: ark, rad eller uke, felt, årsak (FR-4). Like feil i samme kolonne slås sammen med radintervall og antall: «Planlagte mottak, rad 4–53, Uke: må være et heltall (50 rader).» Rad er alltid Excel-radnummeret. Sier at den lagrede kjøringen er urørt. Gir en ny opplasting nye feil, oppdateres lista, og fokus flyttes dit på nytt |
| Kjøringslinje | Resultat | Alltid synlig øverst. Lagringsstatus er tekst, ikke ikon alene. «Last opp ny fil» går til startsiden, og forrige resultat og den lagrede kjøringen står urørt til en ny kjøring er vellykket (NFR-9). «Eksporter til Excel» laster ned direkte |
| Seksjonsmeny | Kjøringslinje | Runde knapper, én per seksjon, i samme rekkefølge som seksjonene. Står fast med kjøringslinjen. Klikk eller Enter ruller til seksjonen, slik at overskriften står rett under kjøringslinjen, og flytter fokus til seksjonsoverskriften. Seksjonen som er i bildet, er markert som aktiv (`aria-current="location"`), og det oppdateres mens brukeren ruller. Antall står bare der det sier noe om arbeid: Kritiske deler, Bestillingsforslag og Endringer. Antallene viser alltid totalen, også når et filter er aktivt. Endringer og Produksjonskapasitet får knapp bare når seksjonen vises |
| Tallbokser | Resultat, over seksjonene | Fire bokser: kritiske deler, bestillingsforslag i uke 1, bestillingsforslag i alt og forslag med forfalt mengde, pluss en femte for Endringer når seksjonen vises. Hver boks er én lenke: klikk eller Enter går til seksjonen tallet gjelder. Er tallet 0, sier forklaringen det i ord, for eksempel «Planen går opp for alle delene.» Tallboksene endres ikke av filtrene |
| «Slik leser du resultatet» | Resultat, under tallboksene | Nummerert liste med én linje per seksjon, i samme rekkefølge som seksjonene. Står åpen og kan felles sammen. Uten kritiske deler er punktet om kritiske deler borte |
| Liste over kritiske deler | Kritiske deler | Statisk arbeidsliste, én linje per kritisk del i stykklisterekkefølgen (FR-16). Linjen viser varenummer, beskrivelse, type og nivå, alle eksepsjonene med typenavn og uke og setningen i vanlig språk, delens første bestillingsforslag («Første bestillingsforslag: 175 i uke 1, 50 forfalt · 3 forslag i alt») og «Se forklaring →». Hele linjen er én knapp med tilgjengelig navn, for eksempel «300-003 Hjul, Bestilling forsinket, uke 1. Bestillingen skulle vært sendt før uke 1. Se forklaring». Klikk eller Enter ruller til delen i tabellen, flytter fokus til cellen med den tidligste eksepsjonen (se Eksepsjonsmarkør) og åpner forklaringspanelet med eksepsjonen øverst. Tabellen sorteres ikke om |
| Bestillingsforslag | Bestillingsforslag | Alle forslag i én liste, sortert etter frigivelsesuke og innenfor uka i stykklisterekkefølgen (FR-17). Kolonner: Frigivelsesuke, Varenummer, Beskrivelse, Mengde, Innkjøp eller produksjonsordre, Forfalt. Over listen står hjelpeteksten «Frigivelsesuke er uka du må sende bestillingen eller starte produksjonen. Varene kommer ledetiden senere. Forfalt betyr at noe av mengden skulle vært bestilt før uke 1.» En kritisk del har symbolet for eksepsjonen ved beskrivelsen. Forfalt mengde er en knapp «! 50 forfalt» (tilgjengelig navn «50 forfalt: se eksepsjonen for 300-003 Hjul») som gjør det samme som linjen for delen i kritiske deler. Ellers gjør et klikk på en rad ingenting. Listen har fast høyde med egen rulling og kortes aldri ned |
| Ukefilter | Bestillingsforslag | Ett valg om gangen: «Alle uker» eller én uke, hver med antall (FR-17). «Alle uker» er første knapp og er valgt når resultatet åpnes. Når en uke er valgt, står «Viser 3 av 12 forslag · Vis alle uker» over listen. Uke uten forslag viser «Ingen bestillingsforslag skal frigis i uke 6.» med «Vis alle uker». Filteret gjelder bare denne listen, ikke tallboksene eller eksporten |
| Endringsliste | Endringer | Overskriften sier hvilke to kjøringer som sammenlignes, for eksempel «13.11 kl. 07:31 → 08:04». Grupper i fast rekkefølge: Bestillingsforslag, Eksepsjoner, Deler (FR-20), med antall i hver gruppeoverskrift. En gruppe uten endringer vises med «ingen endringer». Etikettene er de samme som i arket Sammenligning i fasit 03 og i eksporten (FR-23): **Nytt**, **Endret mengde** og **Fjernet** for bestillingsforslag, **Ny** og **Borte** for eksepsjoner, **Ny** og **Fjernet** for deler. Et forslag som har flyttet uke, vises som Fjernet og Nytt rett under hverandre, ikke som én linje. Alle linjene vises. Nytt og Endret mengde for et forslag, og Ny for en eksepsjon, kan velges og gjør det samme som i kritiske deler. Fjernet, Borte og alle linjer i gruppen Deler er bare tekst |
| Resultattabell | Resultattabell | Delene i stykklisterekkefølge. En felles del står der den står første gang (FR-16). Seks rader per del i rekkefølgen fra FR-14. Delens felt (varenummer, beskrivelse, nivå og type) spenner over de seks radene, og en kritisk del har merket «● Kritisk del» der. WAI-ARIA grid på en ekte `<table>` med én tabulatorstopp (se Interaction Primitives). Klikk, Enter eller mellomrom på en celle åpner eller oppdaterer forklaringspanelet. Klikk på radnavn eller delens felt forklarer hele raden eller delen. Peking åpner aldri noe (FR-18). Valgt celle beholdes til en annen velges. Over tabellen står tegnforklaringen for de fem eksepsjonene, merket for kritisk del og valgt celle |
| Filter for kritiske deler | Resultattabell | Avkrysningsboks «Vis bare kritiske deler» over tabellen, av når resultatet åpnes. Skjuler delene uten eksepsjon, og rekkefølgen fra stykklisten beholdes (FR-16). Over tabellen står «Viser 4 av 14 deler · Vis alle deler». Valgt celle i en del som skjules, nullstilles, og panelet lukkes. Endrer ikke tallboksene eller eksporten |
| Eksepsjonsmarkør | Resultattabell | Står i cellen eksepsjonen gjelder (Sebastians kobling, se tabellen under). Det er ingen egen rad for eksepsjoner, så hver del har seks rader (FR-14). Flere eksepsjoner i samme celle står side om side. Aktivering åpner alle meldingene for cellen i panelet. Markøren har et tilgjengelig navn, for eksempel «Bestilling forsinket, uke 1» |
| Forklaringspanel | Resultat | Se «Forklaringspanel» under tabellen |
| Lagrede kjøringer | Lagrede kjøringer | Én linje per ferdigprodukt: beskrivelse, varenummer, tidspunkt og «Slett». «Slett» spør i siden selv («Slette lagret kjøring for Kontorstol Pro (100-001)? Neste opplasting vises uten sammenligning.» med «Slett» og «Avbryt»), ikke med en nettleserdialog. Fokus starter på «Avbryt». Slett fjerner bare kjøringen for dette ferdigproduktet (FR-21), og statusmeldingen «Lagret kjøring er slettet …» vises |
| Statusmelding | Resultat (lagring blokkert, eksport feilet, eksport ferdig) | Står i kjøringslinjen. Lagring blokkert står så lenge resultatet vises. Eksport feilet står til neste eksport lykkes. «Excel-filen er lastet ned.» står til neste handling. Ingen lukkeknapp, ingen popup og ingen toast (NFR-10). Kunngjøres én gang gjennom statusregionen |
| Eksport | Kjøringslinje | Laster ned den viste kjøringen som `.xlsx` med innholdet FR-22 og FR-23 krever. Arket Sammenligning er med når det finnes en sammenligning, også når Endringer viser «Ingen endringer», og er bygd som arket i fasit 03. Filnavn: ferdigproduktets beskrivelse og dato, for eksempel «COSI-MRP Kontorstol Basic 2026-11-13.xlsx». Ukefilteret og «Vis bare kritiske deler» påvirker ikke eksporten. Tallene lagres som tall. Kapasiteten er aldri med (FR-30) |
| Kapasitetspanel | Produksjonskapasitet | Se «Produksjonskapasitet (trinn 4)» |

### Eksepsjonsmarkør: hvilken celle

Godkjent 22.11 (U12). Kritiske deler, endringslisten og knappen for forfalt mengde flytter fokus til samme celle. Forventet lagerbeholdning i samme uke får ingen markør, men forklaringen av den cellen forklarer avviket.

| Type | Celle |
|---|---|
| Bestilling forsinket | Nettobehov, uke t |
| Bruk av sikkerhetslager | Nettobehov, uke t |
| Mottak forsinket | Nettobehov, uka mottaket er fremskyndet til |
| Kanseller mottak | Planlagte mottak, mottaksuka |
| Ledetid overskrider horisont | Delens felt (uke «–», «hele delen») |

### Forklaringspanel

- **Rolle:** ikke-modalt panel (`<aside aria-label="Forklaring">`) som skyver tabellen til side og står fast under kjøringslinjen med egen rulling. Åpnes ved aktivering, aldri ved peking, og står til brukeren lukker det med «Lukk» eller Esc (FR-18). Overskriften er for eksempel «300-003 Hjul – Nettobehov, uke 1».
- **Eksepsjonen først:** har cellen eksepsjoner, står meldingene øverst, alle sammen hvis det er flere (FR-15), med de fire delene fra Voice and Tone. På 1366 × 768 ved 100 % zoom skal hele meldingen for 300-003 Hjul være synlig uten å rulle i panelet når det åpnes fra kritiske deler.
- **Celle uten eksepsjon i en kritisk del:** øverst står linjen «Hjul har 1 eksepsjon: Bestilling forsinket, uke 1 → Vis». «Vis» flytter valgt celle til eksepsjonens celle.
- **Delens felt og merket «Kritisk del»:** panelet viser alle delens eksepsjoner øverst.
- **Fire lag:** (1) **svaret** i én setning, (2) **utregningen** som steg med tallene satt inn i PRD-ens formler, (3) **tallene** som lenker til sin egen forklaring, (4) **regelen** i én setning.
- **Bruttobehov:** for deler under ferdigproduktet viser lag 3 hvilke overordnede deler behovet kommer fra, og antallet per enhet (FR-18, FR-28), for eksempel «Kontorstol Basic: 20 × 5 = 100». En felles del har én linje per overordnet del.
- **Fokus:** mens panelet er åpent, blir fokus i tabellen, så piltastene flytter cellen og panelet følger med. En lenke i lag 3 til en annen celle flytter valgt celle dit. «Gå til forklaringen» flytter fokus inn i panelet (se Interaction Primitives). «Lukk» eller Esc lukker panelet og setter fokus tilbake på cellen.

**Tekster i panelet:**

- **Utregning (lag 2):** ett steg per linje, for eksempel «Disponibel beholdning = 80 + 0 − 100 = −20» og så «Nettobehov = maks(0, 30 − (−20)) = 50».
- **Nettobehov:** lag 1 sier hva som mangler, for eksempel «I uke 1 mangler det 50 hjul for å holde sikkerhetslageret på 30.»
- **Planlagt ordremottak med forfalt frigivelse (FR-7):** «De 50 er regnet med i uke 1, men kommer tidligst i uke 2. Se eksepsjonen.»
- **Forventet lagerbeholdning i samme uke:** «Tabellen viser 30 fordi den regner med at de 50 som skulle vært bestilt før uke 1, kommer i tide. Uten dem blir lageret −20 i uke 1. Se eksepsjonen.»
- **Planlagte ordrefrigivelser:** lag 1 sier hva Kari gjør og når varene kommer, for eksempel «Bestill 25 rygger i uke 2, så de kommer i uke 3.»
- **Fremskyndet mottak:** «Mottaket på 100 står i uke 4, men er regnet med fra uke 3. Derfor er forventet lagerbeholdning 0 i uke 3, under sikkerhetslageret på 10, men det trengs ingen ny bestilling.» Brukes i lag 1 for forventet lagerbeholdning og nettobehov i ukene t til u − 1, og for planlagte mottak i uke u.
- Et diskret tegn i cellen for fremskyndet mottak og for mottak med forfalt frigivelse prøves mot SM-C3 i prøvetesten `[ASSUMPTION]`.

### Resultattabell: rulling og ytelse

**Rullemodell.** Resultattabellen ruller i sitt eget område, både vannrett og loddrett. Området er en navngitt region (`role="region"` med `aria-labelledby` til seksjonsoverskriften). Ukeoverskriften og de faste venstrekolonnene (delens felt og radnavnene) står fast inne i området (NFR-8). Ved hvert piltrykk og hvert hopp fra kritiske deler, endringslisten eller knappen for forfalt mengde rulles cellen inn i bildet, så cellen med fokus aldri skjules bak faste lag (WCAG 2.4.11). Akseptsjekk: på 1366 × 768 med panelet åpent er cellen med fokus hele tiden synlig ved Ctrl+End, Ctrl+Home, PgUp, PgDn og piltaster.

**Ytelse (NFR-5).** Mål tidlig, før tabellstrukturen låses, med en syntetisk fil på 1000 stykklisterader, tre nivåer og 12 uker (lages med `testdata/lag_testdata.py`). Budsjett: under 3 sekunder fra Beregn til synlig resultattabell. Nås ikke målet, prøves dette i rekkefølge:

1. `content-visibility: auto` per `<tbody>`.
2. Virtualisering per del med `aria-rowcount` og `aria-rowindex`. Cellen med fokus må tåle å bli tatt ut av siden.
3. Siste utvei: sammenslått visning med én linje per del (se State Patterns).

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Første besøk | Introduksjonsside | Vises i stedet for startsiden. «Kom i gang» går til startsiden. Kan appen ikke bruke lagringen i nettleseren, vises introduksjonssiden ved hvert besøk |
| Senere besøk | Startside | Appen åpner startsiden direkte |
| Fil valgt | Startside | Opplastingssonen viser filnavnet |
| Fil dras over | Startside | Opplastingssonen får valgt-tone. Slipp utenfor sonen gjør ingenting |
| Leser og beregner | Startside | «Leser filen …» og så «Beregner …» i en `role="status"`-region. Ingen overlegg og ingen spinner over siden. Mål: under 3 sekunder (NFR-5) |
| Feil i hele filen | Startside | Én melding i opplastingssonen (NFR-9), ikke i feiloppsummeringen. Ny opplasting mulig uten å laste siden på nytt. Lagret kjøring urørt |
| Valideringsfeil | Startside | Feiloppsummering øverst. Ingen beregning. Lagret kjøring urørt (FR-4). Filvalget nullstilles |
| Kjøring ferdig | Resultat | Fokus flyttes til h1. Sidetittelen blir «Kontorstol Basic (100-002) – Resultat – COSI - MRP». Statusregionen kunngjør «Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.» |
| Reload på Resultat | Startside | Resultatet og filen finnes bare i minnet og vises ikke igjen. Den lagrede kjøringen er urørt og brukes til sammenligning ved neste opplasting (FR-19) |
| Tilbake i nettleseren | Resultat → startside | Som «Last opp ny fil» |
| Første kjøring for ferdigproduktet | Resultat | Endringer, knappen i seksjonsmenyen og tallboksen for endringer vises ikke (FR-20) |
| Sammenligning finnes | Endringer | Seksjonen står etter Bestillingsforslag, med de to tidspunktene i overskriften |
| Ingen endringer | Endringer | «Ingen endringer i bestillingsforslag, eksepsjoner eller deler siden forrige kjøring (…). Andre tall kan ha endret seg.» |
| Ingen kritiske deler | Kritiske deler | Bare én kort melding i stedet for seksjonen: «Ingen kritiske deler. Planen går opp for alle delene.» Ingen overskrift eller liste. Tallboksen viser 0. Filteret «Vis bare kritiske deler» er skjult |
| Ingen bestillingsforslag | Bestillingsforslag | «Kjøringen gir ingen bestillingsforslag.» Ukefilteret er skjult |
| Ukefilter uten treff | Bestillingsforslag | «Ingen bestillingsforslag skal frigis i uke 6.» og «Vis alle uker» |
| Valgt celle | Resultattabell | Ramme rundt cellen, radnavn og ukeoverskrift fete. Synlig også når panelet er lukket |
| Felles del | Resultattabell | Én tabell der delen står første gang. Forklaringen av bruttobehovet viser hver overordnet del |
| Forklaringspanelet åpent | Resultat | Tabellen smalner og kan fortsatt brukes. Panelet følger valgt celle |
| Lagring blokkert (NFR-10) | Resultat | Statusmeldingen står fast i kjøringslinjen. Endringer vises aldri. Ellers virker alt |
| Eksport feilet | Resultat | Statusmeldingen står til neste eksport lykkes. Resultatet er ellers uendret (NFR-9) |
| Bare produksjonskapasitet | Resultat | Bare kjøringslinjen og kapasitetspanelet. «Eksporter til Excel» skjules (deaktiveres ikke). Kjøringslinjen sier «Bare produksjonskapasitet. Kjøringen lagres ikke.» Den lagrede kjøringen er urørt (FR-30) |
| Bare bestillingsplan | Resultat | Ingen kapasitetsseksjon og ingen knapp for den i seksjonsmenyen |
| Begge valgt | Resultat | Kapasitetspanelet står sist, med egen knapp i seksjonsmenyen. Eksporten inneholder bare bestillingsplanen (FR-30) |
| Ingen lagrede kjøringer | Lagrede kjøringer | «Ingen lagrede kjøringer ennå.» |
| Sammenslått visning (bare hvis ytelsen krever det) | Resultattabell | Én linje per del med varenummer, beskrivelse, eksepsjonsmarkør og første uke med eksepsjon. «Fold ut alle» og «Fold sammen alle». Et hopp fra kritiske deler folder ut delen først |

## Interaction Primitives

- **Klikk, trykk, Enter og mellomrom** gjør det samme. Peking åpner aldri forklaringer, verktøytips eller menyer (FR-18). Alt som kan klikkes, har `cursor: pointer`.
- **Tastatur på siden:** Tab følger lesrekkefølgen: appmeny → kjøringslinje → seksjonsmeny → tallbokser → kritiske deler → bestillingsforslag → endringer → resultattabell → forklaringspanel → kapasitet.
- **Tastatur i resultattabellen** (WAI-ARIA grid på en ekte `<table>`): roving tabindex gir én tabulatorstopp for hele tabellen. Piltastene flytter én celle og stopper ved kanten. Home og End går til første og siste uke i raden, Ctrl+Home og Ctrl+End til første og siste celle i tabellen. PgUp og PgDn går til samme rad i forrige og neste del. Venstre fra et radnavn går til delens felt, og Opp og Ned fra delens felt går til forrige og neste del. Enter eller mellomrom åpner forklaringen. Esc lukker panelet og setter fokus tilbake på cellen.
- **Gå til forklaringen:** mens panelet er åpent, er neste tabulatorstopp etter tabellen lenken «Gå til forklaringen», som vises ved fokus og flytter fokus til panelets overskrift.
- **Fokus etter hopp:** fra kritiske deler til cellen med eksepsjonen. Fra «Lukk» i panelet tilbake til cellen. Fra opplasting med feil til feiloppsummeringen. Fra seksjonsmenyen til seksjonsoverskriften.
- **Ankerlenker** ruller mykt til seksjonen. Med `prefers-reduced-motion` hopper de.
- **Fil:** dra og slipp, eller «Velg fil». Begge må virke. «Velg fil» er en ekte knapp, fordi talestyring ikke kan aktivere et vanlig filfelt.
- **Forbudt:** forklaring ved peking, toasts og meldinger som forsvinner av seg selv, overlegg ved lasting, deaktivert Beregn, nettleserdialoger (`confirm`), modale paneler, faner som skjuler kapasitetspanelet, kritiske deler flyttet øverst i tabellen (FR-16), egen ukevisning ved siden av listen (FR-17), dra for å flytte og uendelig rulling.

## Accessibility Floor

Oppførsel. Kontrasten står i DESIGN.md › Colors.

- **Mål:** WCAG 2.1 AA, og fokus som aldri skjules (2.4.11). Før prøvetesten testes appen manuelt med bare tastatur, og med en kort skjermlesertest med NVDA (cirka 15 minutter) i Chrome eller Firefox: seksjonsmenyen, tallboksene, resultattabellen som grid (ukeoverskrift og radnavn leses), kritiske deler, forklaringspanelet, feiloppsummeringen og kunngjøringen etter Beregn. Automatiske verktøy erstatter ikke de to manuelle testene.
- **Ikke farge alene:** eksepsjoner, kritiske deler, forfalt mengde, endringer og begrensende deler har alltid tekst eller symbol i tillegg til farge (FR-15, FR-34, NFR-8). Symbolene har tilgjengelige navn, for eksempel «Bestilling forsinket, uke 1». Merket ved delen heter «Kritisk del», synlig og som tilgjengelig navn.
- **Kunngjøringer:** én `role="status"`-region på appnivå, som finnes fra siden lastes. Den kunngjør lasting, «Kjøringen er ferdig: …» og statusmeldingene. Feiloppsummeringen leses ved at den får fokus. Forklaringspanelet har ikke `aria-live` på hele panelet. Et lite element i panelet (`aria-live="polite"`) kunngjør bare overskriften og det første kortet (eksepsjonen, ellers lag 1), cirka 300 ms etter at valgt celle har stoppet, så køen ikke fylles når Kari holder inne en piltast.
- **Fokus:** synlig fokusmarkering på alle interaktive elementer. Fokus går alltid tilbake dit det kom fra når panelet eller en bekreftelse lukkes. Faste lag dekker aldri elementet som har fokus.
- **Semantikk:** hver side har én h1, og hver seksjon har `<h2>`. Resultattabellen har `<caption>` med ferdigprodukt og horisont, `<th scope="col">` for ukene, `<th scope="row">` for radnavnene, `<th scope="rowgroup">` for delens felt og én `<tbody>` per del, så skjermleseren leser «300-003 Hjul, Nettobehov, Uke 1, 50». Seksjonsmenyen er `<nav aria-label="Seksjoner i resultatet">` med `aria-current`. Radiogruppen er `fieldset` og `legend`.
- **Reflow:** resultattabellen ruller sideveis i sitt eget område (unntaket for datatabeller i WCAG 1.4.10). Resten av siden tilpasser seg bredden.
- **Bevegelse:** kort markering av delen etter hopp og panelet som glir inn respekterer `prefers-reduced-motion`.

## Responsive & Platform

PC er eneste mål (NFR-6). Under 900 px blir forklaringspanelet et ark nederst på skjermen, knappene i seksjonsmenyen brytes over flere linjer, og tallboksene legger seg under hverandre. Siden skal ikke rulle sideveis utenom tabellene. Ingen egen mobilvisning.

## Inspiration & Anti-patterns

- **Hentet fra lærebøkene og Odoo MPS:** én blokk per del med seks rader og én kolonne per uke.
- **Hentet fra MRPeasy, Odoo og SAP:** eksepsjoner og handlingsliste før hele planen. PRD §4.4 setter kritiske deler først og bestillingsforslagene etter.
- **Hentet fra SAP S/4HANA (Fiori):** konteksten i en fast linje øverst (ferdigprodukt, horisont, tidspunkt) og seksjoner på én side med en meny som viser hvor brukeren er.
- **Hentet fra formelrevisjon i Excel:** forklaringen viser hvilke tall som ga resultatet, ett ledd om gangen. Brukerne kommer fra Excel.
- **Hentet fra Designsystemet, GOV.UK og Aksel:** feiloppsummering øverst med fokus, opplasting med både opplastingssone og knapp, innsendingsknapp som ikke deaktiveres, og ordlyd som ikke skylder på brukeren.
- **Hentet fra Carmens samlede prototype 16.11:** tallboksene øverst og de runde knappene i seksjonsmenyen (godkjent 22.11). Et fullt dashbord med kort i stedet for listene er fortsatt forkastet, fordi det sprer informasjonen og bryter rekkefølgen i §4.4.
- **Forkastet 22.11 – ukeplan** (Carmens konsept B, prøvd i prototypen v1–v3): antall forslag og eksepsjoner uke for uke. Den gjentok det ukefilteret og tabellen allerede viser. FR-17: ingen egen ukevisning i tillegg til listen.
- **Forkastet 22.11 – utvidbare seksjoner** (variant B av U1): alle seksjonene er åpne på én lang side.
- **Forkastet – master-detail (én del om gangen, som SAP MD04):** gjør det vanskelig å sammenligne overordnet del og underdel, og FR-16 krever hopp til delen i tabellen.
- **Forkastet – terskler som demper små avvik:** strider mot FR-9–FR-13 og SM-2.
- **Forkastet – fortegn i radnavn («− Bruttobehov», «= Forventet lagerbeholdning»):** radene i FR-14 er ingen løpende sum. Regnestykket hører hjemme i forklaringspanelet.
- **Forkastet – «Flyttet» som egen endringstype** (FR-20), **faner** (FR-34), **modale skuffer for forklaringspanelet**, **introveiviser eller karusell**, **utvidbare rader som standard** og **grafer øverst**.

## Key Flows

Brukerreisene er fra PRD §2.3. Kari er innkjøper i en liten møbelprodusent. Testdataene er Kontorstol Basic (testeksempel 01), Kontorstol Pro (testeksempel 02 og 03) og Kontorstol Kompakt (testeksempel 05).

### UJ-1. Kari tar i bruk COSI - MRP første gang.

1. Kari åpner appen for første gang. **Introduksjonssiden** forteller hva appen gjør, i tre steg. Hun klikker «Kom i gang» og kommer til **startsiden** med veiledningen.
2. Hun laster ned testeksempel 01, drar filen til **opplastingssonen**, lar Bestillingsplan stå valgt og trykker Beregn. Statusen viser «Leser filen …» og så «Beregner …».
3. **Resultat** åpnes uten Endringer, fordi det ikke finnes noen tidligere kjøring.
4. Hun klikker på hjul, uke 1, i tabellen. **Forklaringspanelet** viser at nettobehovet er 50: lager 80 + mottak 0 − bruttobehov 100 = −20, og SS 30 − (−20) = 50.
5. Hun går tilbake til startsiden, laster ned den tomme malen og fyller ut stolen. Kontroll-kolonnen i Excel viser at ledetiden mangler på én rad, og hun retter det.
6. **Høydepunkt:** Hun laster opp sin egen fil og ser de kritiske delene, bestillingsforslagene og tabellen for sin egen stol, uten sammenligning.

Feilsti: filen er en `.xls` → meldingen i opplastingssonen sier at appen bare tar imot Excel-malen (`.xlsx`) (FR-1).

### UJ-2. Kari oppdaterer planen og ser hva hun må bestille.

1. Kari laster opp ukens fil. Tallboksen viser 4 kritiske deler, og de kritiske delene står øverst.
2. Hun velger gassfjær i listen («Mottaket i uke 4 trengs allerede i uke 3.»). Tabellen ruller til nettobehovet i uke 3, og panelet åpnes med eksepsjonen øverst.
3. Panelet sier at mottaket på 100 står i uke 4, men er regnet med fra uke 3, og at leverandøren må levere det i uke 3.
4. Hun går til **bestillingsforslagene**, velger «Uke 1» i filteret og ser at hun må bestille 175 hjul, merket «! 50 forfalt».
5. Hun bestiller hjulene, ringer leverandøren av gassfjær og klikker «Eksporter til Excel».
6. **Høydepunkt:** Hun har handlet på alt i uke 1 uten å regne selv, og har planen som Excel-fil.

Unntak: hun lurer på hvorfor nettobehovet for hjul er 50 i uke 1 → hun aktiverer cellen og leser forklaringen. Feilsti: lagring er blokkert → kjøringslinjen sier at kjøringen ikke lagres, og at hun kan eksportere.

### UJ-3. Kari ser hva en ny kundeordre betyr.

1. Kari endrer prognostiserte behov i uke 2 fra 30 til 45 og klikker «Last opp ny fil».
2. Tallboksen og seksjonsmenyen viser antall endringer. Hun leser bestillingsforslagene og går så til **Endringer**.
3. Endringslisten sammenligner med morgenens kjøring for Kontorstol Pro: «Endret mengde» for hjul med «130 → 205 (+75)», «Nytt» for 30 skruesett M6 i uke 1, «Ny» for hjul – Bruk av sikkerhetslager, og for rygg – Mottak forsinket «Borte» i uke 3 og «Ny» i uke 2.
4. **Høydepunkt:** Hun ser at endringen ga det hun ventet. Hun velger den nye eksepsjonen for hjul og havner rett i cellen, uten å sammenligne tabellene selv.

Unntak: hun vil starte på nytt → «Slett» på siden Lagrede kjøringer, og neste opplasting vises uten sammenligning (FR-21). Uendret fil: Endringer viser «Ingen endringer …».

### UJ-4. Kari retter feil etter å ha kopiert filen.

1. Mandag laster Kari opp forrige ukes fil etter å ha flyttet ukene ett hakk.
2. Ingen beregning. **Feiloppsummeringen** øverst får fokus: «Filen har 3 feil. Ingenting er beregnet.» og at den lagrede kjøringen er urørt.
3. Feilene står per ark med Excel-radnummer: Prognostiserte behov (arket MPS), uke 11; Planlagte mottak, rad 4 (uke 0); Planlagte mottak, rad 5 («ca. 40»).
4. Hun retter alle tre i Excel og laster opp igjen rett under. Filvalget var nullstilt, så den nye versjonen leses selv om filnavnet er det samme.
5. **Høydepunkt:** Andre forsøk går gjennom, og sammenligningen bruker den lagrede kjøringen fra før feilen. Hun fikk alle feilene på én gang.

Feilsti: filen er skadet eller tom → meldingen står i opplastingssonen, ikke i feiloppsummeringen.

### UJ-5. Kari svarer på en hasteforespørsel.

1. En kunde spør om 35 Kontorstol Kompakt i uke 5. Kari laster opp filen og velger Produksjonskapasitet.
2. Resultat viser bare kjøringslinjen og **kapasitetspanelet**. Kjøringslinjen sier at kjøringen ikke lagres, og «Eksporter til Excel» vises ikke.
3. Hun leser raden «Fra lager»: 30 i uke 5. Raden «Med planlagte mottak» viser 30 i uke 5 og 35 fra uke 7.
4. Under tallene står den begrensende delen: 300-033 Ryggplate, med symbolet for Lager. I grunnlaget per del ser hun mottaket på 30 ryggplater i uke 5.
5. **Høydepunkt:** Kari svarer kunden at 30 stoler kan leveres i uke 5 og resten i uke 7, og hun ringer leverandøren om å få mottaket tidligere. Den lagrede kjøringen er urørt.

Unntak: hun velger Begge, og kapasitetspanelet står sist i resultatet med egen knapp i seksjonsmenyen. Valideringen er den samme uansett valg (FR-30).

## Produksjonskapasitet (trinn 4)

Kuttes først. Seksjonsmenyen har plass til panelet, men ingenting annet avhenger av det. Formålet med eget panel er at Kari ikke forveksler kapasitet med planlagt produksjon (FR-34).

- **Overskrift:** «Produksjonskapasitet», aldri «Produksjon» eller «Produksjonsplan».
- **Innledning rett under,** i fire korte punkter før noe tall: tallet er hvor mange hele ferdigprodukter som kan være ferdige innen uka; «Fra lager» er bare ledig beholdning (lagerbeholdning minus sikkerhetslager); «Med planlagte mottak» tar også med mottakene fra uka de kommer; produksjonskapasiteten tar med ledetid, men ikke prognostiserte behov (FR-34).
- **Tegnforklaring:** to bokser som forklarer symbolene for årsaken: **Lager** («Delen har for lite på lager og i planlagte mottak til ett ferdigprodukt til.») og **Ledetid** («En ordre for delen måtte vært frigitt før uke 1 for å bli ferdig i tide.»).
- **Øverst:** to rader, «Fra lager» og «Med planlagte mottak», med én kolonne per uke (FR-32). Radene ser ikke ut som de seks radene i resultattabellen.
- **Begrensende deler (FR-33):** under hvert tall står den begrensende delen med symbolet for årsaken og ordet Lager eller Ledetid, så årsaken ikke vises med farge alene. Har flere deler samme laveste verdi, står alle. Hver uke har minst én begrensende del (FR-31, FR-33). Det tilgjengelige navnet sier årsaken i hele setninger.
- **Under:** «Grunnlaget per del», en tabell med lagerbeholdning, sikkerhetslager, ledig beholdning, ledetid og planlagte mottak per uke (FR-34). Kolonnen Ledig beholdning har hjelpeteksten «Lagerbeholdning minus sikkerhetslager, aldri under 0.», koblet til kolonneoverskriften med `aria-describedby`.
- **Klikkbar forklaring:** ingen i v1 (FR-18 gjelder resultattabellen).
- **Før bygging prøves** tilstandene 0 i alle uker og mange uker (rulling og faste kolonner).

## Fast partistørrelse (trinn 5)

Med i v1, men kuttes først (PRD §7.1), og planlegges som et eget, senere epic (§4.7). UX-en lages i det epicet. Plassen er reservert nå:

- **Valideringsfeil i kolonnen «Partistørrelse» (FR-24)** vises i feiloppsummeringen under Stykkliste, med samme mønster som andre verdifeil.
- **Bestillingsregelen (FR-26)** står i delens felt under nivå og type, for eksempel «Fast partistørrelse: 50». Lag 2 i forklaringspanelet viser avrundingen for planlagte ordremottak.
- **Eksporten (FR-26)** viser bestillingsregelen og partistørrelsen per del.

## Brukertest (SM-3)

Oppgavene og grensen på 3 minutter står i SM-3, og testpersonene, prosedyren og tidspunktet i PRD §8.1. Introduksjonen er åpen (PRD §9 nr. 4) og skal avgjøres av gruppen før prøvetesten rundt 27.11. Forslaget under er Sebastians, tilpasset avklaringene 22.11. `[ASSUMPTION]` til gruppen har godkjent det.

**Før testuka.**

1. **Testbygg:** én fast adresse for 2.–7.12, som ikke endres i testuka. Radiogruppen er skjult, så Beregn gir bestillingsplanen (§8.1: bare trinn 1–2). Før første test bekreftes SM-1 og SM-2 for testeksempel 01 på akkurat den adressen.
2. **Prøvetest** rundt 27.11 med full prosedyre og tidtaking. PRD §8.1 sier at et gruppemedlem løser oppgavene. Sebastian foreslår en person utenfor gruppen (se Åpne designbeslutninger). Introduksjonen og oppgavelappene låses etterpå.
3. **Samtykke:** skriftlig samtykke til opptak av skjerm og lyd. Opptaket slettes etter vurderingen.

**Oppsett per testperson.**

1. Samme nettleser for alle (Chrome eller Edge), maksimert vindu og 100 % zoom.
2. Et nytt privat vindu per testperson, så ingen lagret kjøring eller introduksjonsside henger igjen. Testpersonen ser da introduksjonssiden først (FR-27).
3. Bare `testeksempel-01.xlsx` ligger på skrivebordet, og det er den samme filen som appen deler ut. Fasiten ligger ikke på testmaskinen.
4. Testlederen leser introduksjonen ordrett fra et ark (cirka 1 minutt). Den forklarer ikke «kritisk del» eller «eksepsjon».
5. Testpersonen laster selv opp testeksempel 01. Opplastingen tas ikke tid på.
6. **Kontroll før oppgave 1:** Endringer vises ikke i seksjonsmenyen, det står ingen statusmelding i kjøringslinjen, og kjøringslinjen viser «Kontorstol Basic (100-002)» og «Horisont: 10 uker».

**Under oppgavene.**

1. Oppgavene gis én og én på en lapp, som ligger synlig hele oppgaven.
2. **Nullstill før hver lapp:** lukk panelet (Esc), sett ukefilteret til «Alle uker», slå av «Vis bare kritiske deler» og rull til toppen av resultatet. Det gjøres likt for alle og er ikke hjelp.
3. **Tidsregel:** klokka starter når testpersonen har lest lappen høyt, og stopper når hun sier at hun har svaret og begynner å si det. Ved 3:00 er oppgaven feilet.
4. **Testlederen** sier bare «Hva ser du etter nå?» og «Fortsett slik du ville gjort selv.» Alt annet regnes som hjelp og noteres.
5. **Notater:** svaret ordrett, veien (tallbokser, seksjonsmeny, rulling, tabell, panel) og tid.

**Introduksjon (forslag):**

> «Takk for at du vil hjelpe oss. Tenk deg at du er Kari. Hun er innkjøper i en liten møbelfabrikk, og hver morgen må hun finne ut hva som skal bestilles. Hun bruker COSI - MRP til dette: Hun laster opp en Excel-fil med stykklisten, lageret og behovene, og appen regner ut bestillingsplanen. Det er appen vi tester, ikke deg. Du kan klikke på det du vil vite mer om. Si gjerne høyt hva du tenker og ser etter mens du jobber. Jeg kan ikke hjelpe deg med selve oppgavene, bare hvis noe teknisk slutter å virke. Først laster du opp filen testeksempel 01, som ligger på skrivebordet. Deretter får du tre korte oppgaver, én om gangen.»

**Oppgavelapper og fasitsvar** (fra `testdata/testeksempel-01-fasit.xlsx`):

| Oppgave (SM-3) | Tekst på lappen | Riktig svar | Flater som skal bære den |
|---|---|---|---|
| 1 Finn en kritisk del | «Finn en kritisk del i planen. Si hvilken del det er.» | Én av 300-003 Hjul, 300-004 Armlene, 300-005 Gassfjær eller 300-006 Stolfot. Svar med bare typen eller antallet er ikke løst. Kjente feilsvar som noteres: 100-002 Kontorstol Basic og 300-008 Trekk | Tallboksen og Kritiske deler øverst; merket «Kritisk del» og markøren i tabellen |
| 2 Forklar en eksepsjon med egne ord | «Appen har funnet en eksepsjon for hjul. Forklar med dine egne ord hva som er galt, og hva Kari bør gjøre.» | Bestilling forsinket i uke 1 for 300-003 Hjul. Løst når både A og B i rubrikken er dekket | Linjen i kritiske deler og forklaringspanelet med eksepsjonen først |
| 3 Les av mengde og frigivelsesuke | «Appen foreslår å bestille rygger. Finn det første bestillingsforslaget for Rygg (det med tidligst uke). Hvor mange rygger gjelder det? I hvilken uke må Kari sende bestillingen til leverandøren?» | 25 rygger, frigivelsesuke 2 (300-002 Rygg). Vanlig feilsvar: uke 3, som er uka ryggene kommer | Bestillingsforslag med hjelpeteksten om frigivelsesuke. Med «Alle uker» som startvalg er svaret synlig uten å endre filteret |

**Rubrikk for oppgave 2:** **A, hva som er galt:** Kari er for sent ute med å bestille hjul, så det mangler hjul i uke 1. **B, hva hun bør gjøre:** bestille nå, be om raskere levering eller si fra at leveransen blir forsinket. Ikke godkjent: «leverandøren er sen», «hjulene er ødelagt» og en forklaring av bruttobehovet alene. Vurderes av to gruppemedlemmer hver for seg.

**Rapport:** `.docs/brukertest/brukertest-resultat.md`, per oppgave løst eller feilet, tid, vei og feiltype (PRD §8.1).

## Før bygging

- **Prototype av forklaringspanelet** med tallene fra testeksempel 01 for de fire kritiske delene, prøvd på 1–2 personer, med akseptsjekken for 1366 × 768. For Kanseller mottak brukes testeksempel 02.
- **Ytelsesmåling** med en fil på 1000 stykklisterader mot NFR-5, før tabellstrukturen låses.
- **Tastaturtest og NVDA-test** (se Accessibility Floor).
- **Kontrast i mørk visning** for alle nye flater, ikke bare i lys.
- **Analyse og måling fra tredjepart** (for eksempel Vercel Analytics) slås ikke på uten en vurdering mot NFR-4.

## Senere

Utsatt fra v1. Gjenopptas bare ved behov.

- **Graf over forventet lagerbeholdning** med sikkerhetslager som strek. Aldri ved peking og aldri øverst på siden.
- **Ordliste i forklaringspanelet**, med en oppføring per eksepsjonstype og om slutten av horisonten.
- **«Kopier feilliste» / «Last ned feilliste»** under feiloppsummeringen.
- **Kompakt tabellvisning** (bare forventet lagerbeholdning og frigivelser).
- **Bryter for tetthet.** Én fast radhøyde i v1.

## Åpne designbeslutninger

Bare spørsmål 1 og 2 må avgjøres snart. Ingen av spørsmålene stopper arkitekturen eller epics (PRD §9).

Besluttet 22.11 og ikke lenger åpent: rekkefølgen (U14), én lang side (U1), ukefilteret starter på «Alle uker» (U4), ingen ukeplan (U5), introduksjonsside og startside (U6), lys og mørk (U7), ordene (U3, U8), Endringer etter bestillingsforslagene (U9), filteret for kritiske deler (U10), valg av beregning (U11), eksepsjonsmarkøren (U12), meldingene (U2, U13), tallboksene og seksjonsmenyen. Spørsmål 3 og 7 er avgjort i arkitekturen 22.11 (se tabellen).

| # | Spørsmål | Forslag i dette utkastet | Frist | Ansvarlig | Kilde |
|---|---|---|---|---|---|
| 1 | Introduksjonen til brukertesten (PRD §9 nr. 4) | Sebastians tekst, tilpasset (se Brukertest). Den er kort, som gruppen bestemte 9.11 | **Før prøvetesten, rundt 27.11** | Gruppen | PRD §9 nr. 4 |
| 2 | Prøvetest med et gruppemedlem (PRD §8.1) eller en person utenfor gruppen? | Følg PRD-en, eller endre §8.1 hvis gruppen vil ha en utenfor gruppen | **Før prøvetesten, rundt 27.11** | Gruppen | Sebastian mot PRD §8.1 |
| ~~3~~ | ~~Skriften: selvhostet (NFR-4) eller fra Google Fonts som i prototypen?~~ | **Avgjort i arkitekturen 22.11 (AD-1):** IBM Plex Sans, IBM Plex Sans Condensed og IBM Plex Mono selvhostes i appen via `@fontsource`. Prototypen kan beholde Google Fonts | Lukket | Arkitekturen | DESIGN.md, Sebastian |
| 4 | Endelig ordlyd i meldingene (FR-13) | Tekstene over prøves i prøvetesten og språkvaskes etterpå | Etter prøvetesten | Gruppen | Sebastian, fasitene |
| 5 | Diskret tegn i cellen for fremskyndet mottak og mottak med forfalt frigivelse | Prøves mot SM-C3 i prøvetesten | Etter prøvetesten eller brukertesten | Gruppen | Sebastian |
| 6 | Ytelse ved 1000 rader | Mål først, så tiltakene i rekkefølge | Tidlig i utviklingen, før tabellstrukturen låses | Den som bygger | NFR-5 |
| ~~7~~ | ~~UI-bibliotek (shadcn/ui eller annet)~~ | **Avgjort i arkitekturen 22.11 (AD-1):** ingen komponentbibliotek. Vanlig HTML og CSS fra UX-prototypen v3, skrevet om til React-komponenter | Lukket | Arkitekturen | Sebastian, arkitektur |