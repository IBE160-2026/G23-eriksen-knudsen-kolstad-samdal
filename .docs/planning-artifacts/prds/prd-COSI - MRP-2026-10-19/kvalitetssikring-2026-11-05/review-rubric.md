# PRD Quality Review — COSI - MRP

Gjennomgått 2026-11-05 mot `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`. Grunnlag: `prd.md`, `addendum.md`, `beslutninger-2026-11-05.md`, `.memlog.md`, og stikkprøver i `testdata/` (README, `validering/README.md`, `testeksempel-03-fasit.xlsx` ark Sammenligning, arket MPS i testeksempel 02, `mrp_del()` i `lag_testdata.py`).

## Overall verdict

PRD-en er god. Reglene for beregningen er presise. Nesten alle FR-er har testbare konsekvenser knyttet til konkrete fasitfiler. Beslutningene er daterte og har en eier, og omfanget er tydelig avgrenset. Det er to ting som truer kjernen. For det første sier formlene i FR-6/FR-7, lest bokstavelig, noe annet enn referanseberegningen når et mottak fremskyndes mer enn én uke, og nettopp denne beregningen bærer SM-1. For det andre planlegger Kari flere produkter hver for seg, men PRD-en sier ingenting om deler som produktene har felles. I tillegg mangler det plan for SM-3, som er det eneste målet på at appen er forståelig. Dokumentet er også omtrent dobbelt så langt som målet.

## Decision-readiness — strong

Beslutningene står som beslutninger, med dato og eier («Bestemt av Sebastian 2026-11-05», FR-2, FR-6, FR-20, §4.5). Det som er valgt bort, er navngitt. FR-7 sier rett ut at «Dette er en bevisst forenkling. De fleste ERP-systemene planlegger i stedet fremover fra i dag». FR-29 forklarer hvorfor «Utsett mottak» er utelatt (SM-C2). FR-6 og §7.2 utsetter omplanleggingshorisonten. Addendumet viser hvilke forslag fra researchen som ble avvist og hvorfor (FR-10/FR-11 «uansett årsak», én eksepsjon per uke). En som vil protestere, finner innvendingen sin allerede besvart. §9.1 har bare ett åpent spørsmål, og det er virkelig åpent.

Én beslutning mangler prisen sin. Ukeskiftet håndteres ikke, og hva det koster, står ikke.

### Findings

- **[medium]** Ukeskiftet gir en sammenligning som stort sett er støy, og det står ikke (§4.5, FR-20, UJ-4). §4.5 sier: «Når en ny uke blir uke 1, sammenlignes det likevel med forrige kjøring. Det gjøres ingen egen håndtering av ukeskiftet.» FR-20 identifiserer et bestillingsforslag på «varenummer og frigivelsesuke». Når alle uker rykker ett hakk, vises derfor nesten alle forslag som «fjernet» i én uke og «nytt» i en annen. UJ-4 slutter likevel med at Kari «kommer videre til bestillingsforslagene og sammenligningen», som om sammenligningen er nyttig mandag morgen. Dette strider mot tanken bak SM-C2: brukeren lærer seg å overse støy. *Fix:* Skriv i §4.5 hva som gis opp, nemlig at sammenligningen etter et ukeskifte ikke er til å lese. Skriv i UJ-4 og i veiledningen (FR-27) at Kari sletter den lagrede kjøringen (FR-21) når planen rykker fram.
- **[low]** Statuslinjen i §0 er utdatert (§0 «Status»). «Utkast laget på rask vei 2026-10-19 … Gruppen går gjennom utkastet på et felles møte og kan endre det» beskriver situasjonen før beslutningene 2026-11-05. *Fix:* Erstatt den med dagens status: alt er besluttet unntatt §9 spm. 4, og Finalize gjenstår.

## Substance over theater — strong

Her er lite pynt. Visjonen (§1) er knyttet til et konkret problem («et Excel-ark som bare én person forstår») og kan ikke flyttes til en hvilken som helst MRP-PRD. Det finnes én persona, Kari, og hun styrer beslutninger: lagring per ferdigprodukt kommer fra UJ-3, rekkefølgen på visningene fra UJ-2, og UJ-4 viser valideringen. JTBD-punktene i §2.1 svarer til funksjoner. «Stole på tallene og kunne forklare dem» blir FR-18. Det er ingen innovasjonsseksjon. De fleste NFR-ene har terskler (NFR-5: 1000 rader / 3 nivåer / 12 uker / 3 s; NFR-2: én kommando; NFR-8: konkrete faste kolonner).

### Findings

- **[low]** To NFR-er bruker adjektiver der det skulle stått grenser (NFR-5, NFR-6). «på en vanlig bærbar PC» og «nyere versjoner av Chrome, Edge og Firefox» kan ikke etterprøves. *Fix:* Angi målemaskinen (f.eks. «gruppens svakeste bærbare, navngitt i README») og en versjonsgrense (f.eks. «siste to hovedversjoner per 15.12.2026»).

## Strategic coherence — adequate

Tesen er tydelig og har to deler: MRP som er *korrekt og kan etterprøves*, og MRP som er *forståelig uten formlene* (§1). Den første delen er godt dekket. SM-1, SM-2 og SM-4 er knyttet til fasitfiler. Mot-målene SM-C1–C3 er ekte og hører til hvert sitt primærmål. SM-C1 er den egentlige prioriteringsregelen («Fast partistørrelse startes først når SM-1 og SM-2 er nådd»). MVP-en løser et problem, og rekkefølgen følger tesen: kjernen først, utvidelsen styres av korrekthet.

Den andre delen hviler på SM-3 alene, og SM-3 har ingen plan.

### Findings

- **[medium]** SM-3 er det eneste målet på forståelighet, og det har ingen plan, eier eller frist (§8 SM-3, §9.1 spm. 4). «Etter en kort introduksjon finner og forklarer 3 av 3 testpersoner …» bærer halve tesen og hele §4.4 («Den skal være forståelig … (SM-3)»). Likevel er testpersonene, introduksjonen og hvem som vurderer om noen «forklarer» riktig, ikke bestemt. Spørsmålet har heller ingen eier eller frist, og testen må kjøres på en fungerende app før 15.12. *Fix:* Gi spm. 4 en eier og en frist (senest når FR-15–FR-18 er ferdige). Definer introduksjonen som veiledningen på startsiden (FR-27) pluss et tidstak. Beskriv testpersonene (f.eks. tre studenter utenfor gruppen uten MRP-fag). Lag en enkel vurderingsnøkkel: riktig del, mengde og uke for en navngitt kritisk del i testeksempel 01.

## Done-ness clarity — adequate

Dette er PRD-ens sterkeste side, med ett viktig unntak. Konsekvensene viser til konkrete tall og filer: «175 i uke 1 (50 forfalt + 125 vanlig)» (FR-8), «nøyaktig to valideringsfeil» (FR-2, V-F06) og «nøyaktig linjene i arket Sammenligning» (FR-20). FR-3 har én valideringsfil per regel, og alle reglene er dekket (sjekket mot `validering/README.md`). Gråsoner er avgjort: hvordan forslag og eksepsjoner identifiseres i FR-20, følgefeil i FR-2, og at peking (hover) ikke åpner forklaringen i FR-18. Det finnes nesten ingen formuleringer som «gracefully» eller «brukervennlig».

Unntaket er selve nettoberegningen ved fremskynding, som er den regelen alle andre bygger på.

### Findings

- **[high]** FR-6 og FR-7 er i konflikt med hverandre når et mottak fremskyndes mer enn én uke (FR-6, FR-7, §3 «Disponibel beholdning»). FR-6 definerer «disponibel(t) = forventet lagerbeholdning(t−1) + planlagte mottak(t) − bruttobehov(t)». FR-7 definerer «forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak (FR-6) som ikke er kommet ennå». Lest bokstavelig starter da ukene mellom fremskyndingsuken og den opprinnelige mottaksuken fra en beholdning *uten* mottaket. Nettoberegningen ser mangelen på nytt og lager nye planlagte ordremottak. Det motsier «Hele mottaket regnes med fra uke t». `mrp_del()` i `lag_testdata.py` løser dette med en intern beholdning som tar med mottaket (`forrige = disponibel + nb`) og trekker det fra bare i raden som vises. Fasitene følger skriptet, ikke PRD-teksten. Tilfellet er med i testdataene: testeksempel 03 (200-002 Rygg, mottak i uke 4 fremskyndet til uke 2) og testeksempel 04 (300-028, uke 3 og 5 til uke 2). En utvikler som følger PRD-en, vil derfor feile SM-1 der. Det samme gjelder forklaringen (FR-18): i disse ukene går ikke tallene i tabellen opp (forventet lagerbeholdning under SS, men nettobehov 0), og PRD-en sier ikke hva forklaringen skal vise. *Fix:* Skill mellom to størrelser, for eksempel «beholdning i nettoberegningen» (tar med fremskyndede mottak fra uke t) og «forventet lagerbeholdning» (vises, uten mottaket til det kommer). Skriv om FR-6 og §3 slik at disponibel(t) bygger på den første. Legg til en konsekvens for 200-002 i uke 3 i testeksempel 03, og en FR-18-konsekvens om at forklaringen nevner det fremskyndede mottaket.
- **[medium]** FR-29 kan gi «Kanseller mottak» på to mottak som sammen trengs (FR-29). Hvert mottak kontrolleres for seg: «når mottaket tas bort fra beregningen». To mottak som hver for seg er overflødige, men ikke begge samtidig, får begge eksepsjonen. Følger brukeren rådet, blir det mangel. Det er en falsk eksepsjon etter SM-2. *Fix:* Bestem regelen. Enten kontrolleres mottakene ett om gangen fra det seneste, og et mottak som allerede er foreslått kansellert, tas bort i neste kontroll. Eller begrensningen skrives inn som bevisst. Legg i begge tilfeller til en konsekvens og et testtilfelle.
- **[medium]** Lagrede kjøringer kan ikke ses, og det står ikke hva som skjer når lagringen feiler (FR-19, FR-21). FR-21 sier at brukeren «kan slette den lagrede kjøringen for et ferdigprodukt», men ikke hvor. For å slette *før* neste opplasting (UJ-3 «Vil hun starte på nytt for et produkt …») må brukeren kunne velge et produkt hun ikke har kjøring for på skjermen. Det krever en oversikt over lagrede kjøringer som ingen FR beskriver. FR-19 sier heller ikke hva som skjer når lagringen er full eller blokkert (privat vindu, ca. 5 MB-grensen for `localStorage` som addendumet nevner) eller tømt av brukeren. *Fix:* Legg til i FR-21 «Brukeren ser en liste over ferdigproduktene med lagret kjøring (varenummer, navn, tidspunkt) og kan slette hver av dem». Legg til en konsekvens i FR-19: «Kan kjøringen ikke lagres, vises resultatet likevel, med en melding om at neste opplasting ikke får sammenligning.»
- **[low]** Noen FR-er mangler en detalj som gjør dem testbare (FR-17, FR-22, FR-27). FR-17 sier «sortert etter uke», men ikke hvordan forslag i samme uke sorteres (stykklisterekkefølge?). FR-22 sier «Tallene … identisk med fasiten», men ikke hvilke ark og hvilken utforming eksporten har. Konsekvensen i FR-27 dekker bare malen, ikke testeksempel 01 og veiledningen. *Fix:* Legg til sortering nummer to, en kort arkliste for eksporten og en konsekvens for nedlastingen av testeksempel 01.
- **[low]** Rekkefølgen på visningene står bare i en beskrivelse (§4.4). «brukeren ser først bestillingsforslagene (FR-17), deretter sammendraget … og så resultattabellen» er ikke et krav med en konsekvens. Det står heller ikke hvor før/etter-sammenligningen (FR-20) kommer i rekkefølgen. *Fix:* Gjør det til en konsekvens i FR-17 eller FR-14, og plasser FR-20 i rekkefølgen.

## Scope honesty — adequate

Avgrensningene står tydelig og flere steder: §2.2 Ikke-brukere, §6 Ikke-mål og §7.2 med en kort grunn per punkt. Det som er utsatt, er navngitt (omplanleggingshorisont, testeksempel for fast partistørrelse). Det er ingen `[ASSUMPTION]`-tagger igjen, og §10 viser hvor hver tidligere antagelse ble av. Det er lite som står åpent for en PRD som skal gi grønt lys til bygging. Ett gap kommer fra brukerreisene.

### Findings

- **[high]** Kari planlegger flere produkter hver for seg, men felles deler mellom produktene er ikke nevnt (§2.2, UJ-2, UJ-3, §4.5, FR-19). §2.2 sier at bedrifter med «flere ferdigprodukter som skal planlegges samlet» ikke er målbrukere. Samtidig planlegger Kari «for flere produkter» (§4.5). Hun laster opp «filen for et annet produkt» (UJ-3), og lagring per ferdigprodukt er begrunnet med akkurat dette. En møbelprodusent med flere stoler har nesten alltid felles innkjøpsdeler som hjul, gassfjær og skruer. Hver fil har da hele lagerbeholdningen og alle planlagte mottak for delen. Lageret telles to ganger, og bestillingsforslagene blir for lave. Det er nettopp regnefeilen JTBD-ene i §2.1 skal fjerne, og den svekker «Stole på tallene». Testdataene unngår problemet ved å bruke ulike varenumre, men PRD-en sier ikke at det er et vilkår. *Fix:* Skriv i §6/§7.2 at v1 forutsetter at ferdigproduktene ikke har felles deler, eller at brukeren selv fordeler lager og mottak mellom filene. Gjenta det i veiledningen (FR-27) og gjør det tydelig i UJ-2/UJ-3. En mulig utvidelse er en advarsel når et varenummer finnes i lagrede kjøringer for andre ferdigprodukter.
- **[low]** Det er uklart om fast partistørrelse er en del av leveransen 15.12 (§7.1). Den står under «Med i v1» som «Planlagt utvidelse når kjernen er testet». *Fix:* Skriv en setning om at FR-24–FR-26 ikke kreves for leveransen 15.12 og lages bare hvis SM-1 og SM-2 er nådd i tide (SM-C1).

## Downstream usability — adequate

Ordlisten (§3) er grundig og brukes konsekvent i FR-ene. ID-ene er sammenhengende og unike (FR-1–FR-29, NFR-1–NFR-8, SM-1–SM-6, SM-C1–C3). Henvisningene til UJ-er og FR-er stemmer etter omnummereringen 2026-11-05. Hver funksjon i §4 kan løftes ut alene, og fasitfilene gir story-skriverne ferdige akseptansekriterier. Addendumet skiller tydelig mellom innspill til arkitekturen og PRD-krav. To uoverensstemmelser vil likevel slå inn nedstrøms.

### Findings

- **[medium]** Addendumet beskriver lesingen av stykklisten i strid med FR-3 (addendum «Lesing av Excel-malen», FR-3 Rader). Addendumet sier: «slutten på tabellen er første rad uten nivå og varenummer». FR-3 krever at radene er «sammenhengende nedover», og V-S01 (tom rad midt i stykklisten) skal gi en feil på rad 9. Følger arkitekturen addendumet, blir radene etter den tomme raden ignorert uten feilmelding, og data forsvinner stille. *Fix:* Skriv om addendumet: les til siste rad med data (inntil rad 1001). En tom rad med utfylte rader under er en valideringsfeil (FR-3).
- **[medium]** Feltnavnet «Antall per uke» finnes ikke i malen (FR-3 MPS, UJ-4). Kolonneoverskriften i arket MPS heter «Antall ferdigprodukter» (sjekket i testeksempel 02). FR-2 kontrollerer «kolonneoverskriftene fra Excel-malen», og FR-4 krever at feilen oppgir «felt». Den eksempelmeldingen i UJ-4 som brukeren ser, nevner derfor en kolonne hun ikke finner. En utvikler som bruker FR-3 som kilde til overskriftene, vil avvise gyldige filer. *Fix:* Bruk «Antall ferdigprodukter» i FR-3, UJ-4 og `validering/README.md`, eller gi kolonnen nytt navn i malen.

## Shape fit — adequate

Dette er et verktøy med én bruker. Fire UJ-er kunne vært for mye, men her har de gjort jobben sin. De drev fram lagring per ferdigprodukt, rekkefølgen på visningene og valideringsscenariet i UJ-4. De er korte og bruker tall som er kontrollert mot fasiten (UJ-3 stemmer linje for linje med arket Sammenligning i fasit 03). Formen som en spesifikasjon av funksjoner passer produktet. Det som ikke passer, er lengden.

### Findings

- **[medium]** PRD-en er omtrent dobbelt så lang som målet (hele dokumentet). `prd.md` har ca. 7 800 ord, det vil si ca. 15 sider, mot målet på 5–8. Mye av lengden er historikk som allerede finnes i `beslutninger-2026-11-05.md`: tre daterte avsnitt i §0, ti merknader av typen «Endret/Bestemt/lagt til 2026-11-05» i kravteksten, §9.2 med ni lukkede spørsmål og §10-tabellen. I tillegg gjentar noen beskrivelser FR-ene, f.eks. forklaringen om innliming i §4.1, som også står i addendumet. For sensor gjør dette det vanskeligere å se kravene. *Fix:* Samle historikken i én kort endringslogg til slutt, eller vis til beslutningsfila. Behold «Bestemt av» bare der begrunnelsen trengs for å forstå kravet. Kort §9.2 og §10 ned til én henvisning.
- **[low]** Produktet har ikke navn i UJ-1 og UJ-2 (UJ-1, UJ-2, UJ-3). «stolen» i UJ-1/UJ-2 er testeksempel 01 (100-002 Kontorstol Basic, hjul = 300-003). UJ-3 bytter til Kontorstol Pro (hjul = 300-004, 130 → 205). En leser som tror det er samme stol, ser hjultall som ikke stemmer. *Fix:* Navngi Kontorstol Basic i UJ-1 og UJ-2.

## Mechanical notes

- **ID-er:** FR-1–FR-29 er sammenhengende og unike. FR-28 står etter FR-5 og FR-29 etter FR-12, med vilje og etter tema. Det er greit, men `bmad-create-epics-and-stories` bør følge rekkefølgen i dokumentet og ikke nummerrekkefølgen. NFR-, SM- og UJ-ID-ene er sammenhengende. §9 beholder nummereringen, og bare spm. 4 er åpent.
- **Antagelser:** Det er ingen `[ASSUMPTION]`- eller `[NOTE FOR PM]`-tagger i teksten. §10 sier «Ingen antagelser er igjen» og viser hvor hver av dem ble av. Det stemmer begge veier.
- **«Komponent» brukes fortsatt som samlebegrep, mot beslutning A1:** §1 «via hovedkomponentene», §3 Nivå «.1 (hovedkomponentene) … hovedkomponenten rett over», §3 Type «kan ikke ha underkomponenter». FR-3 bruker «Underdeler». Bytt til «hoveddeler/deler på nivå .1» og «underdeler», eller ta «hovedkomponent» inn i ordlisten som et uttrykk som er lov.
- **Synonymer:** «flyttet mottak» (FR-6 «Hvert flyttet mottak», konsekvensen «et flyttet mottak») og «fremskyndet mottak». «lager» i stedet for lagerbeholdning (FR-28 «Lageret til en felles del», FR-29 «lager over SS»).
- **Mangler i §3:** Omplanleggingshorisont (FR-6, §7.2, finnes i ordbanken), lagret kjøring, sammendrag av kritiske deler, ukefilter og forklaringspanel. Begrepene brukes i FR-16–FR-21 og vil bli brukt i UX.
- **Faktafeil i UJ-4:** «Hun la den nye uka én kolonne for langt ut.» Ukene i arket MPS er rader, så det skal være «én rad for langt ned».
- **Henvisninger:** FR-7 «(se addendum)» bør peke på avsnittet («Begrunnelse fra research», kulepunktet om forfalt ordremottak). §7.2 «se Vision i briefen» bruker en engelsk overskrift.
- **Utenfor PRD-en, men FR-konsekvensene bygger på det:** I `testdata/README.md` står 100-002 Kontorstol Basic i tabellen for testeksempel 01, mens statusavsnittet sier «en tabell for ferdigproduktet 100-001».
- **Frontmatter:** `status: draft`. Det stemmer med at Finalize ikke er kjørt.
