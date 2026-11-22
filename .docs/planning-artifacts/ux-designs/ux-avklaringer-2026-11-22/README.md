# UX-avklaringer 22.11.2026: arbeidsmappe

Odas arbeidsmappe for å gå gjennom de uavklarte spørsmålene i UX-prototypen versjon 3 (på `main`). Her kan du gjøre endringene i ett punkt og ett dokument om gangen.

**Status 22.11:** Gruppen har godkjent alle de 16 punktene. Endringene i PRD-en, addendum og ordbanken er ført over til `main` med [PR #16](https://github.com/IBE160-2026/G23-eriksen-knudsen-kolstad-samdal/pull/16). Carmens EXPERIENCE.md og DESIGN.md (`ux-carmen/`) venter, fordi det ikke er avklart om de skal til `main`.

**Kontroll:** [`endringsliste.md`](endringsliste.md) viser hver endring med nummer, dokument, avsnitt og linjenummer. På GitHub viser commiten «UX-avklaringer 22.11: Odas endringer» alle endringene i rødt og grønt.

**Alt her er kopier.** Originalene er ikke endret. Når gruppen har godkjent et punkt, må endringen føres over til originalen (se tabellen nederst).

## Slik bruker du mappen

1. Gå gjennom punktene under. Skriv valget og begrunnelsen i feltet **Valg**, og sett status til «Avklart» eller «Avvist».
2. Gjør endringen i kopiene som står under **Endres i**. Skriv i loggen under hvert punkt hva som er endret.
3. Prøv endringen i `prototype/index.html`. Siden 22.11 er det versjon 4 med alle avklaringene. Se `prototype/README.md`. Den virker rett fra disken og lagrer kjøringene sine for seg selv (`cosi-oda-proto-2211avk-*`).

Status: **Åpen** · **Avklart** · **Avvist** · **Venter på gruppen**

## Punktene

Rekkefølgen er foreslått: først de som krever endringer i PRD-en, ordbanken eller UX-dokumentene. Detaljene og kildene står i `prototype/avvik-mot-prd.md`.

### U14: Kritiske deler før Bestillingsforslag?
- **Prototypen nå:** Kritiske deler står først. Boksene og knappene følger samme rekkefølge. PRD-rekkefølgen kan prøves under Prototypevalg → «Rekkefølge i resultatet».
- **Endres i:** `prd/prd.md` §4.4, UJ-1 og UJ-2, og `ux-carmen/EXPERIENCE.md`, hvis Kritiske deler skal stå først
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Kritiske deler først, deretter Bestillingsforslag. Hensikten er at brukeren først ser det som krever oppfølging, og så hva som skal bestilles. Er det ingen kritiske deler, vises bare en kort melding («Ingen kritiske deler. Planen går opp for alle delene.»), ikke hele seksjonen.
- **Endret:**
  - `prd/prd.md`: `updated`, UJ-1 (rekkefølgen), UJ-2 (Kari ser de kritiske delene først, så bestillingsforslagene), §4.4 (ny rekkefølge og hensikt), FR-16 (står før bestillingsforslagene, kort melding uten kritiske deler, og to nye testbare konsekvenser)
  - `prd/addendum.md`: ny linje 2026-11-22 i endringshistorikken, merket som forslag
  - `ux-carmen/EXPERIENCE.md`: `updated`, rekkefølgen på resultatsiden, seksjonsmenyen, tomtilstanden «Ingen kritiske deler», tabulatorrekkefølgen, MRPeasy/Odoo/SAP-linjen, UJ-1 trinn 6 og UJ-2 trinn 1–4
  - `prototype/index.html`: Kritiske deler først er valgt (PRD-rekkefølgen kan fortsatt prøves). Uten kritiske deler vises bare en kort melding uten nummer, boksen sier «Planen går opp for alle delene», og punktet er borte fra «Slik leser du resultatet». Nytt prototypevalg: «Simuler at det ikke er noen kritiske deler (U14)».
  - `prototype/avvik-mot-prd.md`: U14 er merket som avklart

### V3-a: Fire bokser øverst eller sammendraget fra v2?
- **Prototypen nå:** fire bokser: kritiske deler, forslag i uke 1, forslag i alt og forfalt mengde. En femte boks vises når det finnes endringer.
- **Endres i:** `ux-carmen/EXPERIENCE.md` (komponentene). Vurder om de fargede tallene går mot SM-C3 i `prd/prd.md`.
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Fire bokser øverst, som i prototypen.
- **SM-C3:** Mot-målet lyder: «Tabellen skal ikke fylles med farger og symboler for å se informativ ut. Det skal være raskt å finne det som krever handling. Balanserer SM-3.» Det gjelder tabellen, og boksene står over seksjonene, ikke i tabellen. PRD-en trenger derfor ingen endring. Det er DESIGN.md som var i konflikt («ikke et dashbord», «ingen store tall i kort», «bare to ting får farge», «ikke petrol på store flater»), og den er endret. Oda bestemte 22.11 at bare tallene som krever handling, skal ha farge: kritiske deler (●) og forfalt mengde («!»). Tallene for uke 1 og i alt er nøytrale (hvite). Rosa for forfalt mengde er gjort sterkere (lys `#FF8CC6`, mørk `#FF7AB8`).
- **Endret:**
  - `ux-carmen/EXPERIENCE.md`: tallboksene er punkt 2 på resultatsiden, med egen komponentrad, tabulatorrekkefølge og smal skjerm. «Forkastet – dashbord» er endret til «Delvis tatt inn». UJ-2 og UJ-3 nevner tallboksen.
  - `ux-carmen/DESIGN.md`: tokens for `summary-*` (lys og mørk) og komponenten `summary-boxes`. Unntakene er skrevet inn i Brand & Style, regelen om store tall, Shapes og Do's and Don'ts. Ny komponentrad «Tallbokser».
  - `ordbank.md`: nytt ord «Tallboks» (ikke bruk «sammendrag», «kort» eller «dashbord»). `updated` er satt til 2026-11-22.
  - `prototype/index.html`: valget er merket «valgt av Oda 22.11», og boksraden heter «Tallbokser» for skjermlesere. Tallene for uke 1 og i alt er nøytrale.
  - `ux-carmen/DESIGN.md` (fargene): tokenene for uke 1 og i alt er fjernet, og regelen «bare tall som krever handling, har farge» er skrevet inn i Brand & Style, Tallbokser og Do's and Don'ts.

### V3-b: Runde knapper eller lenker i sidemenyen?
- **Prototypen nå:** runde knapper i den faste linjen øverst. Lenkene i sidemenyen er skjult.
- **Endres i:** `ux-carmen/EXPERIENCE.md` (seksjonsmenyen)
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Runde knapper i den faste linjen øverst. Seksjonene er ikke lenker i sidemenyen.
- **Endret:**
  - `ux-carmen/EXPERIENCE.md`: seksjonsmenyen står nå i kjøringslinjen (punkt 1) med runde knapper i samme rekkefølge som seksjonene. Komponentraden er skrevet om: aktiv seksjon følger rullingen, og Endringer og Produksjonskapasitet får knapp bare når seksjonen vises (før sto det «–»). Knappene brytes over flere linjer på smal skjerm. Ny linje under Inspiration.
  - `ux-carmen/DESIGN.md`: komponenten `section-button` og komponentraden «Seksjonsmeny» (før: tekstknapper med understrek)
  - `ordbank.md`: nytt ord «Seksjonsmeny» (ikke bruk «faner» eller «seksjonslenker»)
  - `prototype/index.html`: valgene for runde knapper og sidemenylenker er merket «valgt av Oda 22.11»

### U5: Ukeplanen
- **Prototypen nå:** står nederst i resultatet og kan skjules
- **Endres i:** `prd/prd.md` FR-17 («ingen egen ukevisning») og `ux-carmen/EXPERIENCE.md`, eller så fjernes ukeplanen fra prototypen
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Ukeplanen fjernes. Oda testet begge variantene, og ukeplanen ble bare fyll. FR-17 står uendret, og ukefilteret på bestillingsforslagene er den eneste ukevisningen.
- **Endret:**
  - `prototype/index.html`: ukeplanen er tatt ut av resultatet, Prototypevalg og veiledningen. Seksjonsmenyen og «Slik leser du resultatet» følger etter. U5 i listen over uavklarte spørsmål er merket avklart.
  - `ux-carmen/DESIGN.md`: ny linje i Do's and Don'ts («Egen ukeplan …» under «Ikke gjør»)
  - `ux-carmen/EXPERIENCE.md`: ny linje «Forkastet 22.11 – ukeplan» under Inspiration & Anti-patterns. Ukeplanen var allerede forbudt under Interaction Primitives.
  - `prd/addendum.md`: lukket spørsmål 5 er bekreftet
  - `prd/prd.md`: ingen endring

### U6: Introduksjonsside og startside
- **Prototypen nå:** Introduksjonen vises første gang appen åpnes. Malen, testeksempel 01 og den korte veiledningen står på Ny kjøring. Lagrede kjøringer er en egen side.
- **Endres i:** `prd/prd.md` FR-27 og UJ-1 (hvilken side er «startsiden»?) og skjermlisten i `ux-carmen/EXPERIENCE.md`
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** A: introduksjonssiden beholdes og vises første gang appen åpnes i en nettleser. Startsiden er «Ny kjøring» og åpnes direkte ved senere besøk. Lagrede kjøringer og Veiledning er egne sider, som i prototypen.
- **Endret:**
  - `prd/prd.md`: FR-27 sier at startsiden er «Ny kjøring», og har et nytt avsnitt om introduksjonssiden (skilt fra introduksjonen til brukertesten, §8.1) og en ny testbar konsekvens. UJ-1: Kari ser introduksjonssiden først.
  - `prd/addendum.md`: linje i endringshistorikken, merket som forslag
  - `ux-carmen/EXPERIENCE.md`: skjermlisten har Introduksjonsside, Startside, Lagrede kjøringer og Veiledning. Tilstandene «Første besøk», «Senere besøk» og «Ingen lagrede kjøringer» er oppdatert, og det samme er UJ-1 trinn 1 og Slett i UJ-3.
  - `ux-carmen/DESIGN.md`: ny komponentrad «Introduksjonsside», og «Kom i gang» som primærknapp
  - `ordbank.md`: nye ord «Introduksjonsside» og «Startside» (som forslag)
  - `prototype/index.html`: teksten på introduksjonssiden følger U14 (kritiske deler før bestillingsforslag), og U6 er merket avklart

### U2: Eksepsjonstekst: A (vanlig språk først) eller B (typenavn først)?
- **Prototypen nå:** A
- **Endres i:** `ordbank.md` (merknad 3), hvis A velges. Med B trengs ingen endring.
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** B. Typenavnet fra ordbanken står først, med uke, for eksempel «Bestilling forsinket · uke 1», og en setning i vanlig språk under. Carmens korte navn («Kommer for sent» osv.) brukes ikke.
- **Endret:**
  - `prd/prd.md` og `ordbank.md`: ingen endring. Begge bruker allerede de fem typenavnene.
  - `ux-carmen/EXPERIENCE.md`: regelen står i tabellen for ordlyd (Voice)
  - `ux-carmen/DESIGN.md`: komponentraden Eksepsjonsmerke sier at typenavnet og uken står først og setningen under. «Egne korte navn» var allerede under «Ikke gjør».
  - `prototype/index.html`: B er standard, også i nettlesere som har lagret A fra før. A kan fortsatt sammenlignes på siden «Eksepsjonstekst: A og B».

### U3: «Kritiske deler» eller «Krever oppfølging»?
- **Prototypen nå:** Kritiske deler
- **Endres i:** `ordbank.md` og `prd/prd.md` FR-13 og FR-16, bare hvis «Krever oppfølging» velges
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** «Kritiske deler», som i PRD-en (FR-13, FR-16) og ordbanken.
- **Endret:**
  - `ordbank.md`: «krever oppfølging» står under «Ikke bruk» for Kritisk del
  - `prd/prd.md` §4.4 og `prd/addendum.md`: setningen fra U14 sa «det som krever oppfølging». Nå står det «det som krever handling», som i SM-C3. FR-13 og FR-16 er ikke endret.
  - `ux-carmen/EXPERIENCE.md`: den samme setningen i punkt 3 på resultatsiden. «Krever oppfølging» står under «Ikke gjør» i tabellen for ordlyd.
  - `prototype/index.html`: valget er tatt ut av Prototypevalg, og «Kritiske deler» brukes alltid, også i nettlesere som har lagret det andre valget. U3 er merket avklart.

### U8: Ord i grensesnittet som mangler i ordbanken
- **Ordene:** Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer, Sammendrag, Frigivelsesuke og Bestillingsplan. «Introduksjonsside» og «Startside» (menyvalgene «Introduksjon» og «Ny kjøring») står i ordbanken etter U6, 22.11. «Ukeplan» trengs ikke lenger (U5, 22.11). Frigivelsesuke og Bestillingsplan brukes allerede i PRD-en.
- **Merk:** «Sammendrag» betyr sammendraget av kritiske deler i FR-16. Boksene øverst heter nå «Tallbokser» (V3-a, 22.11), så den kollisjonen er løst. «Tallboks» og «Seksjonsmeny» står i ordbanken som forslag.
- **Endres i:** `ordbank.md` (og `updated` i frontmatter). Eventuelt FR-16 i `prd/prd.md`.
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Alle ordene legges inn i ordbanken. FR-16 trenger ingen endring, fordi boksene heter «Tallbokser».
- **Endret:** i `ordbank.md`:
  - **Frigivelsesuke** (Beregning, PRD FR-17). Ikke bruk: bestillingsuke, ordreuke, startuke.
  - **Bestillingsplan** (App og test, PRD FR-30). Ikke bruk: MRP-plan, innkjøpsplan.
  - **Resultat**, siden og menyvalget. Ikke bruk: resultatside, oversikt, dashbord.
  - **Lagret kjøring**, med siden «Lagrede kjøringer». Ikke bruk: historikk, arkiv, tidligere resultater.
  - **Introduksjonsside** (menyvalget «Introduksjon») og **Startside** (menyvalget «Ny kjøring») fra U6, og **Tallboks** og **Seksjonsmeny** fra V3-a og V3-b, var lagt inn tidligere.
  - «Ukeplan» (U5) og «Sammendrag» (V3-a) trengs ikke lenger.
  - `prototype/index.html`: U8 er merket avklart.
  - `ux-carmen/EXPERIENCE.md` og `ux-carmen/DESIGN.md`: «Resultatside» og «resultatsiden» er byttet til «Resultat» og «siden Resultat», fordi ordbanken sier «Ikke bruk» om resultatside. Filnavnene i lenkene er ikke endret.

### U11: Hva er forhåndsvalgt under «Hva vil du beregne?»
- **Prototypen nå:** Bestillingsplan. Carmens EXPERIENCE.md har Begge.
- **Endres i:** `ux-carmen/EXPERIENCE.md`
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Valgene står i rekkefølgen **Bestillingsplan · Produksjonskapasitet · Begge**, og Bestillingsplan er forhåndsvalgt.
- **Endret:**
  - `ux-carmen/EXPERIENCE.md`: komponenten «Valg av beregning» har ny rekkefølge og nye navn (før: «Bestillingsplan og produksjonskapasitet (standard) · Bare bestillingsplan · Bare produksjonskapasitet»)
  - `prototype/index.html`: valgene heter Bestillingsplan, Produksjonskapasitet og Begge. Standardvalget er tatt ut av Prototypevalg, og Bestillingsplan er alltid forhåndsvalgt.
  - `prd/prd.md`: ingen endring. FR-30 sier ikke hvilket valg som er forhåndsvalgt.

### U7: Lys eller mørk?
- **Prototypen nå:** Lys er standard, mørk kan velges
- **Endres i:** `ux-carmen/DESIGN.md`, hvis mørk velges
- **Status:** Godkjent av gruppen 22.11.
- **Valg:** Begge visningene er med i v1. Lys er standard, og brukeren bytter selv.
- **Endret:**
  - `ux-carmen/DESIGN.md`: kommentaren over fargetokenene, Appmeny (knappen nederst) og Do's and Don'ts. Mørk modus er ikke lenger «ikke et v1-krav», og kontrasten skal kontrolleres i begge.
  - `ux-carmen/EXPERIENCE.md`: ny komponentrad «Lys og mørk visning», og åpen beslutning 8 er besluttet
  - `prototype/index.html`: knappen er flyttet fra den gule prototypeboksen og nederst i sidemenyen, slik den skal være i appen
  - `prd/prd.md`: ingen endring. Merk at mørk modus gir mer å teste (kontrast i begge). Gruppen kan vurdere å nevne det i PRD-en, for eksempel i NFR-8.

### Valg som ikke krever endring i dokumentene

| Nr. | Spørsmål | Prototypen nå | Status | Valg |
|---|---|---|---|---|
| U1 | Én lang side eller utvidbare seksjoner? | A: én lang side | Godkjent 22.11 | A, én lang side. Ført inn i EXPERIENCE.md (Resultat). Valget er fjernet fra Prototypevalg. |
| U4 | Starter ukefilteret på «Alle uker» eller «Uke 1»? | Alle uker. Uke 1 skjuler svaret på oppgave 3 i brukertesten. | Godkjent 22.11 | Alle uker. `[ASSUMPTION]` er fjernet i EXPERIENCE.md, og åpen beslutning 3 er besluttet. Valget er fjernet fra Prototypevalg. |
| U9 | Hvor står Endringer? | Etter Bestillingsforslag | Godkjent 22.11 | Står som nå. EXPERIENCE.md har den samme plasseringen. |
| U10 | Filteret «Vis bare kritiske deler» | Vises | Godkjent 22.11 | Beholdes. Ført inn i `prd/prd.md` FR-16 (tekst og ny konsekvens), `prd/addendum.md` og EXPERIENCE.md (ny komponentrad). Filteret endrer ikke eksporten. |
| U12 | Hvilken rad får eksepsjonsmarkøren? | Sebastians kobling | Godkjent 22.11 | Sebastians kobling: Nettobehov, Planlagte mottak (Kanseller mottak) og delens navn (Ledetid overskrider horisont). Carmens «Eksepsjonsrad» er erstattet i EXPERIENCE.md (Eksepsjonsmarkering, åpen beslutning 1) og DESIGN.md (ny rad «Eksepsjonsmarkør»). «Eksepsjonsmarkør» står i ordbanken som forslag. |
| U13 | Ordlyden i eksepsjonsmeldingene | Fasitens melding med «Hvorfor:» | Godkjent 22.11 | Variant B: typenavn og uke, én setning i vanlig språk, «Melding:» og «Hvorfor:». Ført inn i EXPERIENCE.md (Eksepsjonsmarkering) og DESIGN.md (Forklaringspanel). |

## Filer og originaler

| Kopi | Original | Hentet fra |
|---|---|---|
| `prd/prd.md`, `prd/addendum.md`, `prd/beslutninger-2026-11-13.md` | `.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/` | `Oda/Branch` (lik `main`) |
| `ordbank.md` | `.docs/ordbank.md` | `Oda/Branch`. Den er nyere enn `main`, som mangler FR, NFR, SM, Dekningstabell, Tomtilstand og Avklaring. |
| `ux-carmen/DESIGN.md`, `ux-carmen/EXPERIENCE.md` | `.docs/planning-artifacts/ux/ux-COSI - MRP-2026-11-12/` | `origin/Carmen/Branch`, commit `f409dec` (12.11, utkast) |
| `prototype/` (index.html, data.js, lag_data.py, README.md, avvik-mot-prd.md) | `.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/` | `main`. Den eneste endringen er nøkkelen for lagrede kjøringer. |
