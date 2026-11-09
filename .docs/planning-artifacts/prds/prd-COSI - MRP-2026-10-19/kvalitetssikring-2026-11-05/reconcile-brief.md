---
title: COSI - MRP Avstemming PRD mot brief
status: draft
created: 2026-11-05
updated: 2026-11-05
---

# Avstemming: PRD mot product brief

**Kilde:** `.docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/brief.md` (frosset) og `addendum.md` i samme mappe.
**Avstemt mot:** `prd.md` og `addendum.md` i denne mappen.
**Bakgrunn brukt for å skille bevisste avvik fra gap:** `beslutninger-2026-11-05.md` og `.memlog.md` i denne mappen, og merknadene øverst i briefen og briefens addendum. Ordbanken og `testdata/README.md` er sjekket der et gap kunne være dekket der.

**Metode:** Hver seksjon i briefen og hver fase i briefens addendum er sammenlignet med PRD-en. Et gap er innhold som PRD-en mangler, dekker for tynt eller motsier uten at avviket er begrunnet. Ordlyd og bevisste endringer er ikke tatt med (se siste avsnitt).

## Sammendrag

| # | Gap | Alvor | Vurdering |
|---|---|---|---|
| G-1 | Hva-om-scenarier side om side mangler i PRD-ens visjon og videreutvikling | Middels | Bør inn i PRD (§1, §7.2) |
| G-2 | Forutsetningene i beregningen er ikke synlige samlet i appen | Middels | Bør inn i PRD (FR-18 eller FR-27) |
| G-3 | Faseplanen og prinsippet om målbare leveranser per fase er ikke ført videre | Middels | Bør inn i PRD-addendum |
| G-4 | Primærbrukeren er ikke beskrevet, bare personaen Kari | Middels | Bør inn i PRD (§2) |
| G-5 | Briefens føring for testpersonene er ikke koblet til åpent spm. 4 | Lav | Bør inn i PRD (§9 spm. 4) |
| G-6 | Rekkefølgen i vekstplanen og «designet for å kunne vokse» mangler som innspill til arkitekturen | Lav | Bør inn i PRD-addendum |
| G-7 | Posisjoneringen mot Excel og ERP («enklere å ta i bruk») er bare delvis med | Lav | Greit som det er (evt. én setning i §1) |
| G-8 | Kunnskapen bak parameterverdiene (hvorfor SS og ledetid er satt som de er) | Lav | Greit som det er (evt. ikke-mål i §6) |
| G-9 | Tidsbesparelse har ikke noe suksessmål | Lav | Greit som det er |
| G-10 | §0 sier at PRD-en ikke gjentar briefen, men briefen er frosset | Lav | Bør inn i PRD (§0, én setning) |

---

## G-1: Hva-om-scenarier side om side

**Briefen sier:**
- Executive Summary (linje 16): «Lykkes dette, er neste steg flere produkter og sammenligning av flere hva-om-scenarier side om side, deretter innlogging og støtte for flere bedrifter.»
- Vision (linje 96): «neste steg flere produkter og sammenligning av flere hva-om-scenarier side om side, utover før/etter-sammenligningen i første versjon.»

**PRD-en sier:** §1 Visjon: «Bredden kommer senere: flere produkter, flere språk og flere bedrifter.» §7.2 har flere ferdigprodukter, innlogging og flere bedrifter, men ikke hva-om-scenarier. Ordbanken (`.docs/ordbank.md`, linje 129) har «Hva-om-scenario» og sier at sammenligning side om side er videreutvikling, så begrepet er besluttet, men står ikke i PRD-en. Ingenting i beslutningsfila eller memlog sier at det er tatt ut.

**Merk:** I v1 husker appen bare siste kjøring per ferdigprodukt (FR-19). Laster brukeren opp et hva-om-forsøk, erstatter det den lagrede kjøringen, og neste sammenligning skjer mot forsøket i stedet for den virkelige planen. Det er en naturlig grunn til å nevne hva-om-scenarier i §7.2, og eventuelt en setning i §4.5 om at v1 ikke er laget for hva-om-forsøk (brukeren kan eksportere først, FR-22).

**Vurdering:** Bør inn i PRD: én linje i §7.2 («Sammenligning av flere hva-om-scenarier side om side – videreutvikling, neste steg sammen med flere produkter») og med i oppramsingen i §1.

**Alvor:** Middels. Det er briefens første utvidelse, nevnt to ganger, og den påvirker hvordan lagringen bør designes.

## G-2: Forutsetningene skal være synlige og dokumentert i verktøyet

**Briefen sier:**
- Who This Serves (linje 33): «Verktøyet skal gjøre beregningsgrunnlag, forutsetninger og resultater synlige og lette å forstå.»
- What Makes This Different (linje 49): «Beregningslogikken og forutsetningene forblir dokumentert i verktøyet selv om en ansatt slutter eller er fraværende.»

**PRD-en sier:** FR-18 gir forklaring per rad, celle og eksepsjonstype, «med reglene fra §4.2». Det dekker beregningsgrunnlaget. Men PRD-en har flere bevisste forenklinger som brukeren må kjenne for å lese tabellen riktig, og ingen krav om at de forklares samlet i appen:
- FR-7: forventet lagerbeholdning forutsetter at behovet dekkes i tide, og et forfalt ordremottak vises i behovsuken selv om det kommer tidligst i uke 1 + L. Addendum kaller forventet lagerbeholdning «en målplan som krever fremskynding, ikke en prognose».
- FR-6: planlagte mottak antas å kunne fremskyndes fra hvilken som helst senere uke, og hele mottaket flyttes.
- FR-8: forfalte frigivelser legges i uke 1.
- §4.2: bestillingsregelen er lot-for-lot.

FR-18-konsekvensene tester tallene i en celle, ikke at forutsetningene står forklart. FR-27 (veiledning) sier bare «fyll ut malen, last opp, les tabellen».

**Vurdering:** Bør inn i PRD, enten som en testbar konsekvens i FR-18 («Forklaringen av forventet lagerbeholdning sier at den forutsetter at forfalte ordrer og fremskyndede mottak kommer i tide») eller som en kort side «Slik regner appen» i FR-27 som lister forutsetningene. Dette er kjernen i briefens verdiløfte (kunnskapen skal ligge i verktøyet, ikke hos én person).

**Alvor:** Middels. Uten det kan en ny planlegger lese forventet lagerbeholdning som en prognose og tro at planen holder.

## G-3: Faseplanen og målbare leveranser per fase

**Briefens addendum sier:**
- Fase 1–7 (linje 24–63): datamodell og testdata, nettobehov nivå for nivå, bestillingsforslag, eksepsjoner, brukergrensesnitt, realistisk scenario, fast partistørrelse. Hver fase har mål og test.
- Linje 65: «**Målbare leveranser per fase:** kode + testdata + testresultat (dokumentert avvik/samsvar) — konkret bevis på fremgang og noe å vise til emneansvarlig underveis, ikke bare et ferdig produkt til slutt.»
- Fase 6 (linje 58): «**Test:** Dokumenter hvordan systemet håndterer endringen».
- Linje 12: innholdet «belongs in downstream documents (architecture / implementation plan / sprint planning)».

**PRD-en sier:** §7 har bare fristen (15.12.2026). SM-C1 sier at fast partistørrelse startes først når SM-1 og SM-2 er nådd, og §4.7 sier at den planlegges som eget epic. Rekkefølgen for resten av kjernen, prinsippet om bevis per fase og at fremgang skal kunne vises til faglærer underveis, står ikke i PRD-en eller PRD-addendumet. Briefens addendum sier selv at dette skal videre til senere dokumenter, men PRD-en er neste ledd og fører det ikke videre. Det er et læringsmål og en arbeidsform for kurset, og det går lett tapt fordi FR-strukturen ikke har plass til det.

**Vurdering:** Bør inn i PRD-addendum, som et avsnitt «Innspill til epics og sprintplanlegging»: rekkefølgen i fasene (justert til PRD-ens FR-numre, for eksempel fase 2 = FR-5–FR-8 og FR-28, fase 4 = FR-9–FR-13 og FR-29), kravet om kode + testdata + dokumentert testresultat per leveranse, og at fase 6 gir en kort skriftlig dokumentasjon av endringsscenariet (02 → 03). Faseplanen hører ikke hjemme i selve PRD-en.

**Alvor:** Middels. Det påvirker ikke hva appen gjør, men det er det som gjør prosjektet vurderbart underveis, og epics-steget kommer rett etter PRD-en.

## G-4: Primærbrukeren er ikke beskrevet

**Briefen sier:** Who This Serves (linje 33): «**Primærbruker:** en produksjonsplanlegger eller innkjøper i en liten produksjonsbedrift, ofte uten formell planleggingsbakgrunn. Personen "eier" i dag Excel-arket, eller må overta det når eieren er borte.»

**PRD-en sier:** §2 Målbruker har Jobs To Be Done, ikke-brukere og brukerreiser, men ingen setning om hvem målbrukeren er. Det står bare indirekte: Kari er innkjøper som har overtatt arket (UJ-1), og §4.4 nevner «en planlegger uten MRP-bakgrunn». To deler av briefens målgruppe er borte:
- **Produksjonsplanleggeren** (ikke bare innkjøperen). PRD-en dekker produksjonsordrer (FR-17), men ingen brukerreise eller tekst nevner rollen.
- **Eieren av arket i dag**, som selv vil ut av sitt eget regneark. Alle brukerreisene handler om den som overtar. JTBD «Kontekst» handler også om overtakelse.

**Vurdering:** Bør inn i PRD: et kort avsnitt «2.0 Primærbruker» (eller første linje i §2) med briefens definisjon, inkludert «ofte uten formell planleggingsbakgrunn». Ingen ny brukerreise trengs. Dette er også grunnlaget for SM-3 og G-5.

**Alvor:** Middels. Målgruppen er grunnlaget for designvalg (forklaringer, språk, ingen forkunnskap), og arkitekt og UX-designer leser §2 først.

## G-5: Føring for testpersonene i brukertesten

**Briefen sier:**
- Who This Serves (linje 33): primærbrukeren er «ofte uten formell planleggingsbakgrunn».
- Success Criteria (linje 91): «etter en kort introduksjon finner og forklarer 3 av 3 testpersoner hovedresultatene ... uten hjelp fra utviklerne».
- Briefens addendum, fase 5 (linje 52): «Brukertest – kan en person uten forkunnskap om koden forstå outputen?»

**PRD-en sier:** SM-3 har samme mål. §9 spm. 4 (åpent) spør hvem testpersonene er og hvordan introduksjonen ser ut. Spørsmålet nevner ikke føringene i briefen.

**Vurdering:** Bør inn i PRD som føring i §9 spm. 4: testpersonene bør ligne primærbrukeren (ikke med i gruppen, ikke kjent med koden, uten formell MRP-bakgrunn), og introduksjonen bør være den samme som veiledningen i appen (FR-27), slik at testen også tester veiledningen. Spørsmålet står fortsatt åpent (beslutning #9).

**Alvor:** Lav. Spørsmålet er allerede åpent, men føringen gjør det lettere å lukke og gjør SM-3 mer etterprøvbart.

## G-6: Rekkefølgen i vekstplanen og arkitektur som kan vokse

**Briefen sier:** Vision (linje 96): «Lykkes første versjon, er neste steg flere produkter og sammenligning av flere hva-om-scenarier side om side ... Deretter følger innlogging med lagrede data og støtte for flere bedrifter. Derfra åpner muligheten for å teste verktøyet mot reelle små bedrifter ... Dette er ikke en del av kursets formelle omfang, men en retning verktøyet er designet for å kunne vokse inn i.»

**PRD-en sier:** §7.2 lister videreutviklingene uten rekkefølge. §1 nevner flere produkter, språk og bedrifter. PRD-addendumet har ett innspill for vekst (NFR-7, tekster samlet for engelsk), men ingenting om at datamodellen og lagringen bør tåle flere ferdigprodukter i samme kjøring, flere scenarier per ferdigprodukt eller senere serverlagring med innlogging. Rekkefølgen (produkter og scenarier → innlogging og flere bedrifter → test hos reelle bedrifter) er borte.

**Vurdering:** Bør inn i PRD-addendum, som et innspill til arkitekturen: «Briefen sier at verktøyet skal kunne vokse i denne rekkefølgen. Arkitekturen bør ikke låse seg til ett ferdigprodukt per kjøring eller én kjøring per ferdigprodukt, og lagringen (FR-19) bør kunne byttes ut med serverlagring.» Rekkefølgen kan eventuelt også stå i §7.2.

**Alvor:** Lav. Det er utenfor v1, men det er billigere å ta hensyn til nå enn å bygge om senere.

## G-7: Posisjonering mot Excel og ERP

**Briefen sier:** What Makes This Different (linje 49–53): sammenlignet med ERP er COSI - MRP «avgrenset til selve MRP-beregningen, og dermed enklere å ta i bruk for en liten bedrift», og «Dette er ikke en hemmelig metode — MRP-logikken er standard teori i faget. Fordelen er at verktøyet gjør riktig prosess tilgjengelig for noen uten planleggingsbakgrunn».

**PRD-en sier:** §6 og §2.2 sier at appen ikke er et ERP-system, og §1 sier at prosessen ligger i verktøyet. At appen skal være enkel å ta i bruk (ingen installasjon, ingen konto, en fast mal) følger av NFR-3, NFR-4 og FR-27, men står ikke som et mål. At metoden er standard teori, er med indirekte gjennom research-avsnittet i addendumet.

**Vurdering:** Greit som det er. Eventuelt én setning i §1 om at verdien er at riktig standardprosess blir tilgjengelig for en liten bedrift uten ERP og uten en ekspert.

**Alvor:** Lav.

## G-8: Kunnskapen bak parameterverdiene

**Briefen sier:** The Problem (linje 24): «logikken bak innkjøpstid, sikkerhetslager og partistørrelse er sjelden dokumentert andre steder enn i formlene. Forsvinner personen, forsvinner kunnskapen.»

**PRD-en sier:** PRD-en løser beregningslogikken (FR-18), men verdiene for ledetid og sikkerhetslager kommer fortsatt fra brukeren (UJ-1: «med tall fra kollegaens regneark»). Hvorfor sikkerhetslageret for en del er 30, dokumenteres ikke noe sted. Briefens løsning gjør heller ikke det, så dette er ikke en motsigelse, men problemet i briefen er bredere enn løsningen.

**Vurdering:** Greit som det er for v1. Eventuelt et punkt i §6 Ikke-mål: «Appen dokumenterer ikke hvorfor ledetid og sikkerhetslager har de verdiene de har», så avgrensningen er bevisst.

**Alvor:** Lav.

## G-9: Tidsbesparelse uten suksessmål

**Briefen sier:** The Problem (linje 25): «**Tidkrevende manuelt arbeid:** den ukentlige oppdateringen av nettobehov og bestillingsforslag gjøres for hånd.»

**PRD-en sier:** JTBD «raskt og uten regnefeil» (§2.1) og NFR-5 (under 3 sekunder per kjøring). Ingen av suksessmålene måler tiden brukeren sparer, og det gjør heller ikke briefen.

**Vurdering:** Greit som det er. Et tidsmål ville krevd en sammenligning med et ekte regneark, som kurset ikke har. Kan nevnes som noe utprøvingen hos reelle bedrifter (§7.2) bør måle.

**Alvor:** Lav.

## G-10: §0 «gjentar ikke innholdet» og frosset brief

**Briefen sier:** Merknaden øverst (linje 10): briefen er frosset, og PRD-en gjelder foran briefen der de er ulike.

**PRD-en sier:** §0: «Den bygger på product brief ... Den gjentar ikke innholdet i dem. Briefen er frosset. Ved avvik mellom briefen og PRD-en gjelder PRD-en.» §7.2 viser til «Vision i briefen».

**Problem:** Det er ikke sagt hva som gjelder for innhold i briefen som PRD-en verken gjentar eller endrer (problembeskrivelsen, posisjoneringen, visjonen, faseplanen i addendumet). En leser av PRD-en kan tro at det som ikke står i PRD-en, ikke gjelder lenger. G-1 til G-8 er eksempler på slikt innhold.

**Vurdering:** Bør inn i PRD, én setning i §0: «Det briefen sier som PRD-en ikke endrer (problemet, målgruppen, posisjoneringen og visjonen), gjelder fortsatt.» Alternativt tas G-1, G-2 og G-4 inn i PRD-en, så det viktigste står der uansett.

**Alvor:** Lav.

---

## Kontrollert uten gap (bevisste avvik eller dekket)

Disse forskjellene er begrunnet i PRD-en, beslutningsfila eller memlog og er ikke gap:

- **Fire → fem eksepsjonstyper, nye regler for FR-6, FR-9, FR-10–FR-12 og ny FR-29:** begrunnet i PRD-addendumet (research 2026-11-02) og briefens merknad. Briefens «på grunn av ... forsinkede leveranser» for «Bruk av sikkerhetslager» er bevisst erstattet av koblingen til forfalt frigivelse (addendum, FR-10/FR-11).
- **Ledetid overskrider horisont** gjelder ledetid fra ferdigproduktet, ikke delens egen ledetid: begrunnet (FR-9, addendum). Briefens grensetilfelle «ledetid > horisont» (addendum fase 3) er dekket av testeksempel 02 (300-005, `testdata/README.md`).
- **«Bestillingsforslag alltid før behovsuken»** (briefens addendum fase 3) gjelder ikke forfalte frigivelser og ferdigprodukt med L = 0: bevisst (FR-8).
- **Inntil 500 komponenter → inntil 1000 rader:** beslutning #6.
- **Tre nivåer som grense:** briefen sier «flernivå» og tester med 3 nivåer. PRD-en begrenser til tre nivåer etter malen (memlog 2026-10-26, addendum) og har resten i §7.2.
- **Ukentlig → daglig bruk:** memlog (UJ-gjennomgang 2026-11-05).
- **Meldingen vises ved klikk, ikke direkte i cellen:** beslutning #13 (FR-15, FR-18).
- **Én lagret kjøring → én per ferdigprodukt:** memlog og beslutningsfila (UJ-3). Ferdigprodukter planlegges fortsatt hver for seg, som i briefen.
- **Begreper** (varsel → eksepsjon, komponent → del, MPS → prognostiserte behov, innkjøpstid → ledetid, typelisten): beslutning #1–#5.
- **«100 % match på minst 3 testcase»** (briefens addendum fase 2): SM-1 krever alle testeksempler, og det finnes fire.
- **SM-5 «håndteres korrekt»:** den nye kjøringen dekkes av SM-1, siden testeksempel 03 har egen fasit.
- **Ikke med i v1** (flere produkter, andre bestillingsregler, manuell inntasting, innlogging, flere bedrifter, testing hos reelle bedrifter, mobil): alt står i §7.2 og NFR-6.
- **Fast partistørrelse som planlagt utvidelse:** §4.7, FR-24–FR-26 og SM-C1.
