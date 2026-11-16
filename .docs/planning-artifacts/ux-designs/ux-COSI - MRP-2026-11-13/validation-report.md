# Valideringsrapport — COSI - MRP

- **DESIGN.md:** `C:\IBE160\Logistics solutions\.docs\planning-artifacts\ux-designs\ux-COSI - MRP-2026-11-13\DESIGN.md`
- **EXPERIENCE.md:** `C:\IBE160\Logistics solutions\.docs\planning-artifacts\ux-designs\ux-COSI - MRP-2026-11-13\EXPERIENCE.md`
- **Kjørt:** 2026-11-13
- **Funn totalt:** 4 kritisk · 12 høy · 28 middels · 29 lav (rubrikk: 1 høy · 11 middels · 21 lav; pre-mortem: 4 kritisk · 11 høy · 17 middels · 8 lav)

## Samlet vurdering

**Adekvat.** Spine-paret holder som kontrakt for arkitektur og story-dev. Alle 69 token-referanser finnes, alle åtte kildene finnes, UJ-1–UJ-5 har ordrett samme navn som i PRD-en og hver sin Key Flow med klimaks, og oppførselen er beskrevet svært grundig (tastaturmodell, fokus, kunngjøringer, feiltilstander). Det alvorligste funnet i rubrikken er fokusringen: `{colors.ring}` er ikke synlig nok på toppfeltet og navigasjonsraden, og kontrasttabellen nevner ikke disse parene. Ellers gjenstår noen beslutninger som bør låses før byggingen: hvilken rad eksepsjonsmarkøren står i (fortsatt merket `[ASSUMPTION]`), to kolonner med forklaringspanelet åpent, oppførsel ved reload og Tilbake, og avvik mot ordbanken. At det ikke finnes mockups ennå, er ventet, og det samme gjelder `[OPEN]` for kapasitetspanelet.

**Pre-mortem for brukertesten endrer bildet.** Spinen kan være en god byggekontrakt og likevel la SM-3 feile. Pre-mortem har 4 kritiske og 11 høye funn, og ingen av dem skyldes beregningen. Tre av de kritiske gjelder ord, fasit og oppgavevalg: «Bestilling forsinket» leses som at leverandøren er sen, fasiten for oppgave 2 krever tall som SM-3 ikke krever, og oppgave 3 har mengde og uke begge lik 5, så den kan ikke oppdage forvekslingen den skal måle (det fjerde kritiske er samme sak sett fra målingen). Flere høye funn treffer spinen direkte: meldingen bruker «uke 0» og «frigitt», eksepsjonskortet står etter lag 1, «50 forfalt»-pillen er en blindvei, og tabellen viser 30 der meldingen sier −20. Disse bør rettes i EXPERIENCE.md før prototypen prøves, ellers tester gruppa fasiten og ikke appen. Resten er prosedyre (klokke, nullstilling, sletting av lagret kjøring, testmaskiner) som hører hjemme i testlederarket, og det støtter rubrikkens råd om å flytte Brukertest ut av spinen.

## Vurdering per kategori

- Flow coverage — adekvat
- Token completeness — adekvat
- Component coverage — adekvat
- State coverage — adekvat
- Visual reference coverage — tynn
- Bloat & overspecification — adekvat
- Inheritance discipline — adekvat
- Shape fit — adekvat

## Funn etter alvorlighet

### Kritisk (4)

**[Brukertest pre-mortem (SM-3)]** — «Bestilling forsinket» leses som at leverandøren er sen (§ Oppgave 2 · EXP/DES › Kritiske deler-liste; PRD FR-10)

Ordet brukes slik om pakker og nettbutikker, og det er det motsatte av eksepsjonen: Kari er for sent ute med å bestille. Etter oppgave 1 står testpersonen allerede ved linja «300-003 Hjul – Bestilling forsinket uke 1» og svarer ut fra typenavnet uten å åpne panelet: «Hjulene er forsinket fra leverandøren, Kari må purre.» Det feiler på (a). Sannsynlighet: høy.

Rettelse: (1) Kritiske deler-lista får en kort klartekstlinje under typen, for eksempel «Bestillingen skulle vært sendt før uke 1», og en synlig handling «Se forklaring →». (2) Første setning i meldingen sier hvem som er for sen: «Du er for sent ute med å bestille hjul.» Typenavnet beholdes etter FR-10, men det er ikke typenavnet som skal forklare.

**[Brukertest pre-mortem (SM-3)]** — Fasiten for oppgave 2 krever mer enn SM-3 (§ Oppgave 2 · EXP › Brukertest, «Riktig svar»; PRD SM-3)

(a) krever fire opplysninger: for sen, 50 før uke 1, −20 i uke 1, tidligst uke 2. Et godt lekmannssvar som «Hjulene skulle vært bestilt tidligere, så det mangler hjul i uke 1. Kari må bestille med en gang og be om rask levering» har ingen tall og feiler hvis vurdereren leser fasiten bokstavelig. SM-3 sier bare «forklar en eksepsjon med egne ord». Sannsynlighet: høy.

Rettelse: Skriv fasiten som en rubrikk med to krav og godkjente formuleringer. A: Kari er for sent ute med å bestille, så det blir mangel på hjul i uke 1. B: bestill nå, be om raskere levering, eller si fra om at leveransen blir forsinket. −20, 50 og uke 2 er «godt, men ikke påkrevd». Ikke godkjent: «leverandøren er sen», «hjulene er ødelagt eller utgått» og forklaringer av bruttobehov.

**[Brukertest pre-mortem (SM-3)]** — Mengde og uke er begge 5 (§ Oppgave 3 · F01 Bestillingsforslag C26/D26; Fasittabell G14, I12–I13)

«5 seter i uke 5» blir riktig også om testpersonen har byttet om kolonnene Mengde og Frigivelsesuke, eller leste samme kolonne to ganger. Oppgaven kan ikke oppdage forvekslingen den skal måle, og «5 og 5, hvilken er hvilken?» koster tid. For målingen er dette en sikker svakhet.

Rettelse: Bytt til et forslag der uke, mengde og mottaksuke er tre ulike tall. Anbefalt: 300-002 Rygg, frigivelsesuke 2, mengde 25, mottak uke 3 (F01 Bestillingsforslag A8:E8; Fasittabell D21, E20). Alternativ: 300-008 Trekk (uke 1, 5, mottak uke 4). Skriv lapp og fasit om.

**[Brukertest pre-mortem (SM-3)]** — Oppgave 3 kan ikke gi gyldig bevis for SM-3 (3) (§ Måleteknisk gyldighet · se Oppgave 3)

Mengde og uke er begge 5, så et «løst» er ikke bevis, uansett hvor mange som løser den.

Rettelse: Bytt til Rygg (uke 2 / 25 stk / mottak uke 3) før prøvetesten.

### Høy (12)

**[Token completeness]** — Fokusringen er for svak på toppfelt og navigasjonsrad (§ DESIGN.md › Components › Knapper; Colors (kontrasttabellen); EXPERIENCE.md › State Patterns › Fokus)

`{colors.ring}` (#7D5B1E) gjelder «alle elementer», men får bare 1,93:1 på `topbar` og 1,52:1 på `navrow`. Kravet for ikke-tekst er 3:1 (WCAG 1.4.11/2.4.7). Ankerlenkene, Eksporter til Excel, Last opp ny fil og Slett lagret kjøring står på disse flatene. Kontrasttabellen har ikke parene, og fargen på ring-offset er ikke definert.

Rettelse: Lag tokenet `topbar-ring`, for eksempel lys messing #C9A862 (5,3:1 på topbar og 4,2:1 på navrow), eller definer ring-offset i en lys farge. Legg parene til i kontrasttabellen.

**[Brukertest pre-mortem (SM-3)]** — Tabellen viser 30, meldingen sier −20 (§ Oppgave 2 · EXP › Forklaringspanel: tekster › Forfalt ordremottak; F01 Fasittabell C25–C27)

Forventet lagerbeholdning for hjul i uke 1 er 30, og ingen rad viser −20 fordi disponibel beholdning ikke er en av de seks radene. Testpersonen peker på 30 og sier «lageret er jo fint» eller «appen tar feil». Forklaringen av forfalt ordremottak står bare på cellen Planlagte ordremottak. Sannsynlighet: middels–høy for dem som åpner panelet.

Rettelse: (1) Meldingen forklarer forskjellen: «Uten de 50 som kommer for sent, blir lageret −20 i uke 1. Tabellen viser 30, fordi den regner med at de 50 kommer i tide.» (2) Samme lag 1-setning på forventet lagerbeholdning i uker med forfalt ordremottak, og et diskret tegn i cellen med tilgjengelig navn, prøvd mot SM-C3.

**[Brukertest pre-mortem (SM-3)]** — Meldingen er fagspråk og bryter ordbanken (§ Oppgave 2 · EXP › Voice and Tone; Forklaringspanel: tekster › Hvorfor; ordbank l. 88)

«frigitt», «frigivelsen på 175», «uke 0», «før horisonten», «lageret blir under 0». Ordbanken sier selv at «uke 0» ikke skal brukes om forfalt frigivelse, men både Do-eksempelet i Voice and Tone og «Hvorfor:»-eksempelet bruker det. Sannsynlighet: høy.

Rettelse: Skriv meldingen om til hverdagsspråk og behold opplysningene FR-10 krever: «Du er for sent ute med å bestille hjul. 50 hjul skulle vært bestilt før uke 1 for å komme i tide. Uten dem blir lageret −20 i uke 1. De 50 er lagt til forslaget på 175 i uke 1, men kommer tidligst i uke 2. Bestill nå, og avtal raskere levering hvis du kan. Ellers blir leveransen til kunde forsinket.» «Hvorfor:» bruker «før uke 1». Prøv meldingen i prøvetesten.

**[Brukertest pre-mortem (SM-3)]** — Eksepsjonen er ikke det man ser først i panelet (§ Oppgave 2 · EXP › Component Patterns › Forklaringspanel; DES › `panel-answer`, `spacing.panel-width`)

Lag 1 Svar står i 21 px lett skrift og handler om nettobehovet på 50, og eksepsjonskortet kommer etter. Meldingen er cirka 280 tegn i et panel på 400 px (6–7 linjer), og handlingen (b) står helt til slutt og kan havne under panelets fold (cirka 520 px). Testpersonen forklarer «de mangler 50 hjul» og stopper der. Sannsynlighet: middels.

Rettelse: Når cellen har en eksepsjon, står eksepsjonskortet først, over lag 1, og handlingen kommer i første eller andre setning. Akseptsjekk: på 1366 × 768 er hele eksepsjonskortet synlig uten rulling når panelet åpnes fra kritiske deler-lista.

**[Brukertest pre-mortem (SM-3)]** — Første treff på «hjul» er en blindvei (§ Oppgave 2 · EXP/DES › Bestillingsforslag-tabell)

Første hjul-rad i Bestillingsforslag-tabellen står over folden med den fargede pillen «50 forfalt». Spinen sier «Klikk på en rad gjør ingenting», og pillen kan heller ikke klikkes. Testpersonen klikker, ingenting skjer, og hun tror appen ikke har mer å si. Sannsynlighet: høy.

Rettelse: Pillen «50 forfalt» blir en knapp som gjør det samme som hjul-linja i kritiske deler-lista (ruller til cellen og åpner panelet med eksepsjonen). Alternativt får hver rad med forfalt mengde lenken «Se eksepsjon».

**[Brukertest pre-mortem (SM-3)]** — Tilstanden fra oppgave 2 henger igjen (§ Oppgave 3 · EXP › Brukertest, «Vanlig feilsvar»; Forklaringspanel; F01 G14, I12, I13)

Testpersonen står i Resultattabell med panelet åpent og leter der. Seteblokka har 5 i uke 5 (Planlagte ordrefrigivelser) og 5 i uke 7 (Nettobehov og Planlagte ordremottak): to av tre rader peker på feilsvaret uke 7. Bestillingsforslag-tabellen beskytter bare hvis hun bruker den. Sannsynlighet: middels–høy.

Rettelse: (1) Nullstill tilstanden før hver lapp. (2) Lappen peker mot riktig flate uten å avsløre svaret: «Finn det første bestillingsforslaget for rygg …». (3) Radnavnet «Planlagte ordrefrigivelser» får hjelpeteksten «= bestill i denne uka» i ryggen eller i lag 1.

**[Brukertest pre-mortem (SM-3)]** — «Du kan ikke svare feil» stemmer ikke (§ Introduksjon · EXP › Brukertest › Introduksjon)

Svarene vurderes som riktige eller gale. Testpersonene tar setningen bokstavelig og gir vage svar («noe er galt med hjulene, hun bør sjekke det»), og det feiler i oppgave 2.

Rettelse: Endre til: «Oppgavene har riktige svar, men finner du dem ikke, er det appen som har feil, ikke du.» Introduksjonen er ikke godkjent av gruppa ennå (§9 nr. 4), så endringen kan tas med i samme gruppemelding.

**[Brukertest pre-mortem (SM-3)]** — Introduksjonen sier ikke at noe kan klikkes (§ Introduksjon · EXP › Brukertest › Introduksjon, oppgave 2)

Sammen med at peking ikke gir noe tegn finner flere testpersoner aldri forklaringspanelet, som oppgave 2 er bygd på (FR-18).

Rettelse: Legg til: «Du kan klikke på det du vil vite mer om.» Setningen forklarer ikke «kritisk del» eller «eksepsjon» og holder seg innenfor beslutningen.

**[Brukertest pre-mortem (SM-3)]** — Det er ikke bestemt når klokka starter og stopper (§ Prosedyre · EXP › Brukertest › Oppsett pkt. 5; PRD SM-3)

Starter den når lappen gis, når den er lest, eller når testpersonen sier «ok»? Stopper den ved første svar, siste svar eller ferdig forklaring? Hvert gruppemedlem løser det på sin måte, og 3-minuttersgrensen blir ulik.

Rettelse: Testlederarket: klokka starter når testpersonen har lest lappen høyt, og stopper når hun sier at hun har svaret og begynner å si det. Det svaret teller. Ved 3:00 sier testlederen «Takk, da går vi videre» (feilet). Lappen ligger synlig hele oppgaven.

**[Brukertest pre-mortem (SM-3)]** — Sletting av lagret kjøring har et hull (§ Prosedyre · EXP › Brukertest › Oppsett pkt. 1–2; State Patterns)

«Slett lagret kjøring» finnes bare på resultatsiden. Er nettleseren lukket mellom testpersonene, må testlederen laste opp, kjøre og så slette. Glemmes det, får testpersonen Endringer-brettet, en ekstra lenke i statuslinja og en annen layout. Spinen forbyr privat vindu uten å si hvorfor.

Rettelse: Tillat og anbefal et nytt privat vindu eller en egen nettleserprofil per testperson (localStorage virker i private vinduer i Chrome, Edge og Firefox). Avkrysning før oppgave 1: Endringer vises ikke, ingen statusmelding, toppfeltet viser «Kontorstol Basic (100-002)» og «Horisont: 10 uker». Er ett punkt feil, nullstill før klokka starter.

**[Brukertest pre-mortem (SM-3)]** — Vurderingen er ikke lik på tvers av testerne (§ Måleteknisk gyldighet · EXP › Brukertest; PRD §8.1)

Hvert gruppemedlem vurderer sine egne testpersoner med en gang, uten rubrikk og uten opptak. Oppgave 2 er åpen tekst, så «alle løser alle» og «2 eller flere feiler» avhenger av hvem som testet.

Rettelse: Ta opp skjerm og lyd med skriftlig samtykke (slettes etter vurdering). Skriv svaret ordrett. Oppgave 2 vurderes etterpå av to gruppemedlemmer hver for seg etter rubrikken, og en tredje avgjør uenighet. Tid leses av opptaket.

**[Brukertest pre-mortem (SM-3)]** — Fasiten forutsetter at bygget regner riktig (§ Måleteknisk gyldighet · EXP › State Patterns › Kjøring ferdig; .working/direction-5-lag-paa-lag.html)

En feil i bygget, eller en deploy midt i testuka, gjør at svar vurderes mot noe testpersonen aldri så. Spinen bruker allerede andre tall: retning 5 har «Du mangler 175 hjul i uke 1» (F01: nettobehov 50), og State Patterns blander Kontorstol Pro (100-001) med tallene fra testeksempel 01, som er Kontorstol Basic (100-002).

Rettelse: Frys en deploy-URL for 2.–7.12, og bekreft SM-1 og SM-2 for testeksempel 01 på den før første test. Rett eksempelet i EXP til «Kontorstol Basic (100-002)», og bruk tall fra F01 i prototypen av panelet.

### Middels (28)

**[Flow coverage]** — Trinn 5 (fast partistørrelse) står som «Utsatt fra v1» (§ EXPERIENCE.md › Senere)

PRD §7.1 regner trinn 5 som «Med i v1» (kuttes først), og §4.7 planlegger det som et eget, senere epic. Det finnes ingen UX for valideringsfeil i kolonnen «Partistørrelse» (FR-24) eller for bestillingsregelen i eksporten (FR-26).

Rettelse: Skriv at trinn 5 er med i v1, men kuttes først, og at UX-en lages i sitt eget epic. Behold plassen i ryggen og lag 2 som reservert plass, og nevn FR-24 og eksporten i FR-26.

**[Token completeness]** — Skriftstørrelser og mål i prosaen uten token (§ DESIGN.md › Components › Slippsone, Radiogruppe, Knapper, Feiloppsummering, Forklaringspanel)

20/28 vekt 300 (slippsone), 17/24 (etikett i radiogruppen), 17 px og 11/28 luft (Beregn), 18/24 (arknavn i feiloppsummeringen), 17/26 (steg i lag 2), 9/16 px innvendig luft i knapper, sirkel på 20 px og ikon på 24 px. Den som bygger, må finne på tokener selv.

Rettelse: Legg dem inn som typografiroller (for eksempel `drop-hint`, `option-label`, `sheet-heading`, `panel-step`) og avstandstokener, eller bruk eksisterende roller.

**[Component coverage]** — Veiledning på startsiden har ingen komponentrad (§ EXPERIENCE.md › IA › Startside; State Patterns › Første besøk; DESIGN.md › Layout)

De tre stegene med nedlasting av Excel-malen og testeksempel 01 (FR-27, UJ-1 trinn 2 og 5, prøvetesten) har ingen rad i noen av filene. Det står ikke om nedlastingen er knapp eller lenke, hva filene heter eller hva stegene sier.

Rettelse: Legg til raden «Veiledning» i begge filene: utseende, nedlastingselementene og teksten i de tre stegene, inkludert setningen fra FR-27 om ett ferdigprodukt per fil.

**[State coverage]** — Reload og Tilbake på resultatsiden er ikke beskrevet (§ EXPERIENCE.md › IA; State Patterns)

Startsiden og resultatsiden bytter innhold på samme side. Det er uklart om URL-en endres, om Tilbake går til startsiden og om reload viser den lagrede kjøringen eller startsiden. Arkitekturen trenger svaret for å velge ruting.

Rettelse: Legg til to rader i State Patterns, for eksempel «Reload: startsiden, resultatet vises ikke på nytt» og «Tilbake: …».

**[State coverage]** — Ingen regel for når Endringer og Kritiske deler står i to kolonner (§ DESIGN.md › Layout & Spacing; EXPERIENCE.md › State Patterns › Forklaringspanelet åpent)

DESIGN sier at brettene «kan» stå side om side i to like kolonner, men ikke når, eller hva som skjer på 1366 px med forklaringspanelet åpent (cirka 918 px igjen til hovedfeltet).

Rettelse: Bestem regelen, for eksempel «side om side når hovedfeltet er ≥ X px, ellers stablet».

**[State coverage]** — Kapasitetspanelet har ingen egne tilstander (§ EXPERIENCE.md › Produksjonskapasitet (trinn 4); DESIGN.md › Kapasitetspanel)

0 i alle uker, ingen begrensende del, mange uker (rulling og faste kolonner?) og tastaturoppførsel uten klikkbar forklaring. Dette er kjent `[OPEN]`.

Rettelse: Ta det med i kapasitetsskissen.

**[Bloat & overspecification]** — Brukertest-seksjonen er ingen UX-kontrakt (§ EXPERIENCE.md › Brukertest)

Seksjonen inneholder testprosedyre, introduksjonstekst, oppgavelapper og fasitsvar som venter på gruppas godkjenning, og vil endre seg uavhengig av spinen. Den gjentar også PRD §8.1 og SM-3.

Rettelse: Flytt den til en egen fil, for eksempel `planning-artifacts/brukertest-2026-12.md`, og lenk til den. Behold bare kolonnen «Flater som skal bære den» som krav i spinen.

**[Inheritance discipline]** — Ordbanken og spinene er uenige om Statusmelding og Statuslinje (§ ordbank.md › Brukergrensesnitt; EXPERIENCE.md › Component Patterns › Statuslinje, Statusmelding)

Ordbanken gir «Leser fila …» som eksempel på statusmelding og sier at statuslinja står «øverst på resultatsiden». I spinene vises «Leser fila …» i statuslinja på *startsiden*, og statusmeldingen brukes bare når lagringen er blokkert eller den lagrede kjøringen er slettet. Den som bygger, kan velge feil komponent.

Rettelse: Rett ordbanken etter spinene.

**[Inheritance discipline]** — Forfalt mengde vises ulikt (§ ordbank.md › Forfalt mengde; DESIGN.md › Bestillingsforslag-tabell)

Ordbanken viser «175 (50 forfalt)», spinene viser «175» pluss pillen «50 forfalt».

Rettelse: Rett eksempelet i ordbanken.

**[Inheritance discipline]** — «advarsel» er forbudt i ordbanken, men brukes i tokener og kode (§ DESIGN.md › Colors; EXPERIENCE.md › Voice and Tone; ordbank.md › Bekreftelsesdialog)

Ordbanken har «advarsel» som synonym som ikke skal brukes (under Bekreftelsesdialog), men spinene bruker det som internt nivånavn (`exception-warning`, nivået «advarsel»). Ordbanken gjelder også kode, og nivåene «kritisk» og «advarsel» står ikke der.

Rettelse: Legg til oppføringen «Eksepsjonsnivå (kritisk, advarsel), bare internt» og presiser forbudet under Bekreftelsesdialog.

**[Inheritance discipline]** — To `[ASSUMPTION]`-merker står igjen (§ EXPERIENCE.md › Eksepsjonsmarkør: hvilken celle; Brukertest, oppsett pkt. 4)

Memlog sier at alle antakelser er godtatt og merkene fjernet. Det ene er bærende: hvilken rad eksepsjonsmarkøren står i bestemmer hvor hoppene fra Kritiske deler og Endringer lander, og hva testene sjekker.

Rettelse: Bestem dem og fjern merkene.

**[Brukertest pre-mortem (SM-3)]** — Lokkedeler med lager 0 i Resultattabell (§ Oppgave 1 · F01 Fasittabell C4:L4, F60:L60; DES › Resultattabell)

100-002 Kontorstol Basic har forventet lagerbeholdning 0 i alle uker, og 300-008 Trekk har 0 fra uke 4. For en lekperson ser «lageret er 0» kritisk ut, men begge er feil svar. Sannsynlighet: lav–middels, høyest for testpersoner med Excel-vane som går rett til tabellen.

Rettelse: Merket «Kritisk del» i ryggen må vises på hver kritisk del, også når den ikke er rullet fram. Før Trekk og Kontorstol Basic inn i fasiten som kjente feilsvar, så testlederen noterer dem som funn og ikke diskuterer dem.

**[Brukertest pre-mortem (SM-3)]** — «Forfalt» leses som ødelagt eller utgått (§ Oppgave 2 · DES › Bestillingsforslag-tabell; ordbank l. 91)

Bare på regninger betyr «forfalt» «skulle vært betalt». Under «175» leses «50 forfalt» som at 50 hjul er ødelagt. Ordbanken viser «175 (50 forfalt)», ikke en frittstående pille. Sannsynlighet: middels.

Rettelse: Pilleteksten «50 for sent» eller «50 skulle vært bestilt før uke 1», eller behold «forfalt» og legg hjelpeteksten «Forfalt = skulle vært bestilt før uke 1» under tabellen. Før valget inn i ordbanken.

**[Brukertest pre-mortem (SM-3)]** — Celle uten eksepsjon gir forklaring uten eksepsjon (§ Oppgave 2 · EXP › Eksepsjonsmarkør: hvilken celle; Interaction Primitives)

Klikk på Bruttobehov uke 1 = 100 gir «Kari trenger 100 hjul fordi 20 stoler × 5». Markøren står bare i Nettobehov uke 1, og det står ikke om forklaringen av ryggen og radnavnet viser delens eksepsjoner. Sannsynlighet: middels.

Rettelse: For alle celler i en kritisk del viser panelet øverst «Hjul har 1 eksepsjon: Bestilling forsinket, uke 1 → Vis.» Forklaringen av ryggen eller merket «Kritisk del» viser alltid alle delens eksepsjoner.

**[Brukertest pre-mortem (SM-3)]** — Det er vanskelig å se hva som kan klikkes (§ Oppgave 2 · DES › Resultattabell, Kritiske deler-liste; EXP › Interaction Primitives)

Peking endrer ingenting, og kritiske deler-lista har verken lenkefarge eller pil. Eneste hint er «Velg et tall (klikk eller Enter) for forklaring» i liten tekst over tabellen. Sannsynlighet: middels.

Rettelse: FR-18 forbyr at noe *åpnes* ved peking, ikke at markøren endrer seg. Bruk `cursor: pointer` på celler, radnavn, rygg og listelinjer. Varenummer og beskrivelse i kritiske deler-lista blir lenke i `{colors.primary}`, som i endringslista.

**[Brukertest pre-mortem (SM-3)]** — Ordet «eksepsjon» står på lappen, men nesten ikke på skjermen (§ Oppgave 2 · EXP › Brukertest; DES › Resultattabell)

Statuslinja sier «kritiske deler», lista viser typenavn, og «eksepsjon» står bare i tegnforklaringen under Resultattabell. Ctrl+F leder dit. Introduksjonen forklarer ikke ordet med vilje. Sannsynlighet: middels.

Rettelse: Gi kritiske deler-lista en ingress eller kolonneoverskrift «Del · Eksepsjon · Uke». Alternativt: lappen sier «Appen har funnet et problem (en eksepsjon) for hjul.»

**[Brukertest pre-mortem (SM-3)]** — «Med dine egne ord» er tvetydig (§ Oppgave 2 · EXP › Brukertest, oppgave 2)

Leser testpersonen meldingen høyt ord for ord, vil to vurderere svare ulikt på om det er løst.

Rettelse: Regel i rubrikken: å lese høyt er greit. Løst når A og B er dekket av det testpersonen sier til slutt, sitert eller omformulert. Testlederen sier ikke «med egne ord, takk».

**[Brukertest pre-mortem (SM-3)]** — «Den første bestillingen» kan bety tre ting (§ Oppgave 3 · F01 Bestillingsforslag A26, A34, A42, A50; EXP › Ukefilter)

Den første i lista, den Kari må sende først, eller alle bestillingene av seter (5 + 40 + 30 + 20 = 95). Den som setter ukefilteret til Uke 1 for å finne «den første», finner ingen seter. Sannsynlighet: middels.

Rettelse: Lappen: «Finn det første bestillingsforslaget for rygg (det med tidligst uke). Hvor mange rygger gjelder det, og i hvilken uke må Kari sende bestillingen til leverandøren?» Fasiten godtar «senest uke 2».

**[Brukertest pre-mortem (SM-3)]** — «Bestillingen sendes» kan leses som at varene sendes (§ Oppgave 3 · DES › Bestillingsforslag-tabell; ordbank l. 90)

Da svarer testpersonen med mottaksuka. Kolonneoverskriften «FRIGIVELSESUKE» står i 13 px dempede versaler og forklarer ikke at varene kommer senere. Sannsynlighet: middels.

Rettelse: Lappen: «… i hvilken uke må Kari sende bestillingen til leverandøren?» Under brettoverskriften ordbankens definisjon: «Frigivelsesuke er uka du må sende bestillingen. Varene kommer ledetiden senere.»

**[Brukertest pre-mortem (SM-3)]** — Filtre fra tidligere oppgaver skjuler svaret (§ Oppgave 3 · EXP › State Patterns; Bestillingsforslag-tabell)

Med ukefilter Uke 1 eller «Vis bare kritiske deler» fra oppgave 1 eller 2 finnes ikke sete (eller rygg) på flata. «Viser 5 av 59 forslag · Vis alle uker» står *under* tabellen og ses ikke. Sannsynlighet: lav–middels, følge: høy.

Rettelse: Flytt «Viser X av Y forslag · Vis alle uker» over tabellen ved filteret, slik Resultattabell har det. Nullstill filtrene før hver lapp.

**[Brukertest pre-mortem (SM-3)]** — Radiogruppen gir et nytt problem (§ Prosedyre · EXP › Brukertest pkt. 4 [ASSUMPTION]; State Patterns; PRD §8.1)

Velger testpersonen «Begge», lagres kjøringen, og neste opplasting viser Endringer. Velger hun «Produksjonskapasitet», mangler alle tre flatene oppgavene trenger. §8.1 sier at testen bare bruker trinn 1–2.

Rettelse: Testbygget skjuler radiogruppen (som når trinn 4 er kuttet). Går ikke det, sletter testlederen den lagrede kjøringen før ny opplasting, og funnet noteres.

**[Brukertest pre-mortem (SM-3)]** — Feil fil kan bli lastet opp (§ Prosedyre · EXP › Brukertest › Introduksjon; IA › Startside)

Både `testeksempel-01.xlsx` og `testeksempel-01-fasit.xlsx` kan ligge på skrivebordet. Fasiten gir strukturfeil, og testpersonen kan se svarene. Maksimert vindu hindrer dra-og-slipp fra skrivebordet, og med OneDrive ligger skrivebordet et annet sted i fildialogen.

Rettelse: Bare `testeksempel-01.xlsx` på skrivebordet, fasiten ikke på testmaskinen, og fila er den samme som appen deler ut (kontrollsum). Introduksjonen sier at fila «heter testeksempel-01». Bruker testpersonen nedlastingen på startsiden, er det greit, og det noteres.

**[Brukertest pre-mortem (SM-3)]** — Testmaskinene er ulike (§ Prosedyre · DES › Layout & Spacing › Startsiden; EXP › Resultattabell: rulling og ytelse)

Hvert gruppemedlem tester på egen PC med egen nettleser, skalering (125 % er vanlig) og zoom. DES sier at startsiden får plass «uten rulling» fra 1366 × 768, men i praksis er høyden cirka 630 px.

Rettelse: Samme nettleser (Chrome eller Edge), 100 % zoom, maksimert vindu, og noter oppløsning og skalering. Mål fra viewporten (1366 × cirka 630), ikke fra skjermen, og rett påstanden i DES.

**[Brukertest pre-mortem (SM-3)]** — Tilstanden nullstilles ikke mellom oppgavene (§ Prosedyre · EXP › Brukertest pkt. 5; State Patterns)

Panelet er åpent, filtre er satt, og rulleposisjonen er tilfeldig. Hver testperson starter oppgave 2 og 3 fra forskjellige steder, og det påvirker tid og feilsvar.

Rettelse: Testlederarket: før hver lapp lukkes panelet (Esc), filtrene settes tilbake, og testlederen klikker «Bestillingsforslag» i navigasjonsraden. Likt for alle, og ikke hjelp.

**[Brukertest pre-mortem (SM-3)]** — Tenke høyt er valgfritt og glir over i hjelp (§ Prosedyre · EXP › Brukertest › Introduksjon, Oppsett pkt. 5)

«Si gjerne høyt» gjør det valgfritt. De som snakker mye, bruker mer tid, og «hva tenker du nå?» blir fort til hjelp («hva tror du skjer om du klikker der?»).

Rettelse: Testlederen får bare bruke «Hva ser du etter nå?» og «Fortsett slik du ville gjort selv.» Alt annet regnes som hjelp og noteres med tidsstempel.

**[Brukertest pre-mortem (SM-3)]** — Fast rekkefølge forklarer mye av utfallet (§ Måleteknisk gyldighet · EXP › Brukertest)

Oppgave 1 setter testpersonen ved kritiske deler-lista, rett ved feiltolkningen i oppgave 2. Oppgave 2 setter henne i Resultattabell, rett ved feilsvaret i oppgave 3.

Rettelse: Behold rekkefølgen (SM-3 nummererer oppgavene), men nullstill visningen mellom oppgavene og noter veien hver gang.

**[Brukertest pre-mortem (SM-3)]** — Fagbakgrunn gir skjevhet (§ Måleteknisk gyldighet · PRD SM-3; §8.1)

§8.1 ber om ulik bakgrunn, også fagkompetanse, men SM-3 heter «uten forkunnskap». Medstudenter med MRP-kurs løser oppgave 2 og 3 med det de kan fra før.

Rettelse: Noter MRP-erfaring per testperson. Rapporter SM-3 for dem uten MRP-erfaring, og vis alle i tillegg.

**[Brukertest pre-mortem (SM-3)]** — Lapper og rubrikk kan endres underveis (§ Måleteknisk gyldighet · PRD SM-3; §8.1)

Endringer midt i testuka gjør resultatene umulige å sammenligne (§8.1 krever samme prosedyre). Det er heller ingen ny test etter rettelsene, så «2 eller flere feiler → endre» ender i en endring ingen har prøvd.

Rettelse: Lås lapper, introduksjon og rubrikk etter prøvetesten. Endringer etter testen prøves på 1–2 nye personer i rettefristen og føres som egen runde i `brukertest-resultat.md`.

### Lav (29)

**[Flow coverage]** — UJ-3 har ingen feilvei (§ EXPERIENCE.md › Key Flows › UJ-3)

UJ-3 har bare Unntak (Slett lagret kjøring, uendret fil). Det står ikke hva som skjer hvis den nye fila har valideringsfeil, eller hvis lagringen er blokkert så Endringer aldri vises.

Rettelse: Legg til én linje: «Feil: valideringsfeil → UJ-4; lagring blokkert → ingen Endringer, statusmelding.»

**[Flow coverage]** — FR-18-regelen for bruttobehov gjelder bare felles deler (§ EXPERIENCE.md › Component Patterns › Forklaringspanel)

FR-18 krever at forklaringen av bruttobehov for *alle* deler under ferdigproduktet viser hvilke overordnede deler behovet kommer fra, og antallet per enhet. Spinen sier dette bare om felles deler.

Rettelse: Gjør regelen generell for lag 3, med antall per enhet. Felles del blir da bare tilfellet med flere bidrag.

**[Token completeness]** — Bærende fargepar mangler i kontrasttabellen (§ DESIGN.md › Colors)

`topbar-muted` på `navrow` (5,0), `exception-critical`/`-warning` på `band` (5,5/5,0), `exception-critical` på `background` (6,1) og `foreground` på `exception-*-soft`/`status-info-soft` (12,7–13,2). Alle består.

Rettelse: Legg dem til i tabellen.

**[Token completeness]** — Bevegelse står som råverdier i prosaen (§ DESIGN.md › Elevation & Depth)

260 ms, `cubic-bezier(.2,.7,.2,1)` og 8 px inntoning står i prosa, og EXPERIENCE.md viser til «tidene i DESIGN.md».

Rettelse: Valgfritt: legg dem i `components.forklaringspanel` og `components.brett` eller som en `note`, så de kan hentes ut maskinelt.

**[Component coverage]** — Ordliste-visningen i panelet mangler visuell spesifikasjon (§ DESIGN.md › Forklaringspanel)

Oppførselen finnes (tilbakelenke, valgt celle beholdes), men ikke overskrift, hvordan en oppføring ser ut eller hvor «Tilbake til forklaringen» står.

Rettelse: Legg til to setninger under Forklaringspanel.

**[Component coverage]** — Eksport har rad bare i EXPERIENCE.md (§ EXPERIENCE.md › Component Patterns › Eksport)

Eksport mangler i DESIGN.md, og formateringen av eksportarkene er ikke nevnt.

Rettelse: Skriv i DESIGN.md › Components at eksporten ikke har visuell spesifikasjon, og at arkformatet bestemmes i arkitekturen.

**[Component coverage]** — Små elementer uten visuell spesifikasjon eller nøkkel (§ DESIGN.md › Components; EXPERIENCE.md › Interaction Primitives, State Patterns)

Lenkeknapp i toppfeltet, hopplenken «Gå til forklaringen», tegnforklaringen under Resultattabell, «Vis alle uker / Vis alle deler», «Sammenslått visning» og tegnet for fremskyndet mottak som skal prøves.

Rettelse: Gi hvert element én linje i DESIGN.md. Elementer som skal prøves, merkes som det.

**[Component coverage]** — Kritiske deler-liste mangler regel for flere eksepsjoner (§ DESIGN.md › Kritiske deler-liste; EXPERIENCE.md › Kritiske deler-liste)

Det står ikke hvilket ikon og hvilken farge raden får når delen har eksepsjoner på begge nivåene, eller hvordan flere uker vises. Ryggen har regelen «mest alvorlige nivå», lista har den ikke.

Rettelse: Bruk regelen fra ryggen på lista, og skriv at lista viser den tidligste uka (eller alle ukene).

**[State coverage]** — «Bare produksjonskapasitet»: Slett-lenke og statusmelding er uklare (§ EXPERIENCE.md › State Patterns › Bare produksjonskapasitet)

«Slett lagret kjøring» vises likevel, men det står ikke hva som gjelder når det ikke finnes en lagret kjøring, eller hvor statusmeldingen står når siden ikke har statuslinje.

Rettelse: Lenken vises bare når det finnes en lagret kjøring, og statusmeldingen står øverst i hovedfeltet når statuslinja mangler.

**[State coverage]** — Ingen tilstand for eksport som feiler (§ EXPERIENCE.md › Component Patterns › Eksport)

Fila kan ikke bygges, eller nedlastingen blir blokkert. NFR-9 krever en forståelig melding.

Rettelse: Legg til en tekst for statusmeldingen.

**[Visual reference coverage]** — Ingen visuelle referanser å lenke til ennå (§ EXPERIENCE.md › Foundation › Omfang)

Foundation sier hvilke nøkkelskjermer som tegnes først, men ikke hvilke filnavn de får eller hvilken seksjon de illustrerer.

Rettelse: Ved Finalize: lenk hver mock i seksjonen den illustrerer, med «→ Referanse: `mockups/…` (viser …)».

**[Visual reference coverage]** — Prosaen viser til skisser som ikke er lenket (§ DESIGN.md › Layout & Spacing, Slippsone; EXPERIENCE.md › Toppfelt, Voice and Tone, Inspiration)

«lånt fra retning 4», «retning 5 viste det ikke», «ikke tegnet i skissene», «Mockenes «Filen …» rettes» og «Impeccable-gjennomgangen av utkastene». Filene ligger bare i `.working/`.

Rettelse: Lenk `.working/direction-4-objektside.html` og `direction-5-lag-paa-lag.html` som historiske referanser, eller fjern henvisningene.

**[Bloat & overspecification]** — Gjentakelse fra kildene (§ EXPERIENCE.md › Voice and Tone › Eksepsjonsmeldinger; Component Patterns › Eksport, Feiloppsummering)

«Opplysninger som alltid skal med» gjentar FR-9–FR-12 og FR-29, Eksport gjentar FR-22 og FR-23, og Feiloppsummering gjentar regler fra FR-2 og V-F06.

Rettelse: Behold eksemplene og ordlyden, og vis til FR-nummeret i stedet for å gjenta lista.

**[Bloat & overspecification]** — Historikk som ikke er knyttet til en beslutning (§ EXPERIENCE.md › IA, Inspiration; DESIGN.md › Shapes)

«Det var SMRs første ønske … party-mode», «Disse verdiene erstatter 8 px fra fargetemaet», tabellen «Behov fra Discovery», funn fra Impeccable-gjennomgangen og råverdier ved siden av tokenene («`{rounded.lg}` (14 px)»).

Rettelse: Flytt historikken til memlog, og fjern verdiene i parentes ved tokenene.

**[Bloat & overspecification]** — Lange celler i Component Patterns (§ EXPERIENCE.md › Component Patterns)

Forklaringspanel, Feiloppsummering, Slippsone og Endringsliste har 150–250 ord per celle. Det gjør det vanskelig å hente ut regel for regel.

Rettelse: Del dem opp i `###`-underseksjoner med punktlister, slik «Resultattabell: rulling og ytelse» allerede gjør.

**[Inheritance discipline]** — `sources` mangler dokumenter som brukes (§ EXPERIENCE.md › frontmatter)

Beslutninger fra 11-05 og 11-09, `tilbakemelding-prd.md`, briefen, `testeksempel-02/03-fasit.xlsx`, `testdata/validering/README.md`, `testdata/lag_testdata.py` og memlog («som i beslutningene i memlog»).

Rettelse: Legg dem til.

**[Inheritance discipline]** — Synlige tekster mangler i ordbanken (§ EXPERIENCE.md › Ordbank-merknad)

Ordbank-merknaden sier at alt står der, men lagnavnene «Svar», «Utregning», «Tallene» og «Regel», og «Bestillingsplan», «Fra lager», «Med planlagte mottak», «Begrenset av», «Lagret kjøring» og «Kritiske deler-liste» mangler.

Rettelse: Legg dem inn og oppdater `updated`.

**[Inheritance discipline]** — NFR-5 måles fra et annet punkt enn i PRD-en (§ EXPERIENCE.md › Resultattabell: rulling og ytelse)

Spinen måler «fra Beregn til synlig Resultattabell», PRD-en «fra opplasting til resultattabell».

Rettelse: Bruk PRD-ens målepunkt, eller skriv at det tolkes slik.

**[Inheritance discipline]** — Ordbankens definisjon av eksepsjonsmarkør er for smal (§ ordbank.md › Eksepsjonsmarkør; DESIGN.md › Resultattabell)

Ordbanken sier «det lille ikonet med antall i en celle». I DESIGN er markøren en pille med ikon og antall, og den står også i ryggen når en eksepsjon gjelder hele delen.

Rettelse: Presiser definisjonen i ordbanken.

**[Shape fit]** — Brukertest og Ordbank-merknad fortjener ikke plassen (§ EXPERIENCE.md › Brukertest, Ordbank-merknad)

Brukertest: se Bloat & overspecification. Ordbank-merknaden er prosessmerknader for ordbanken og hører hjemme i memlog.

Rettelse: Flytt eller fjern dem.

**[Shape fit]** — Minste skjerm står spredt (§ DESIGN.md › Layout; EXPERIENCE.md › Accessibility Floor › Reflow)

Det er forsvarlig å utelate Responsive & Platform, men minste skjerm (1366 × 768) og oppførselen på mindre skjermer eller med 200 % zoom står spredt.

Rettelse: Legg én linje i Foundation › Form: «Minste skjerm 1366 × 768; under det …».

**[Brukertest pre-mortem (SM-3)]** — Oppgave 1 måler nesten ingenting (§ Oppgave 1 · EXP › Statuslinje; DES › Statuslinje)

Lappen sier «kritisk del», og samme ord står over folden tre steder: statuslinja («4 kritiske deler trenger handling»), navigasjonsraden («Kritiske deler 4») og brettoverskriften. Testpersonen matcher ord og trenger ikke forstå hva en kritisk del er. Sannsynlighet for å feile: lav.

Rettelse: Behold oppgaven, siden SM-3 krever den, men noter veien testpersonen brukte (statuslinje, navigasjonsrad, rulling, tabell). Ikke bruk oppgave 1 som bevis for at markeringen i Resultattabell virker.

**[Brukertest pre-mortem (SM-3)]** — Svar med type eller antall i stedet for del (§ Oppgave 1 · EXP › Kritiske deler-liste)

Testpersonen kan svare «Bestilling forsinket» eller «det er fire». Testlederen kan ikke spørre igjen uten at det blir hjelp.

Rettelse: Fasitsvaret: «Svar med type eller antall alene er ikke løst. Testlederen leser lappen høyt én gang til, og det regnes ikke som hjelp.» Skriv regelen i testlederarket.

**[Brukertest pre-mortem (SM-3)]** — «Kritisk del» betyr «viktig del» i dagligspråket (§ Oppgave 1 · PRD §3; F01 Bestillingsforslag A3)

En innkjøper kan svare «hjul, fordi det er den største bestillingen» eller «stolfot, fordi den har lengst ledetid». Riktig, men av feil grunn.

Rettelse: Noter begrunnelsen. Riktig del med feil begrunnelse teller som løst etter SM-3, men skal stå som funn i `brukertest-resultat.md`.

**[Brukertest pre-mortem (SM-3)]** — Muntlig forklaring sprenger tidsgrensen (§ Oppgave 2 · PRD SM-3; EXP › Brukertest › Oppsett pkt. 5)

Med 2:30 til å finne fram og 45 sekunder til å forklare går testpersonen over 3 minutter.

Rettelse: Klokka stopper når testpersonen begynner på svaret (se klokkeregelen under prosedyre).

**[Brukertest pre-mortem (SM-3)]** — «seter» på lappen, «Sete» i appen (§ Oppgave 3 · F01 Bestillingsforslag A2:A60; DES › `row-height`)

Ctrl+F på «seter» finner ingenting. Tabellen er cirka 2 360 px høy, og første sete står cirka 1 000 px ned. Det tar tid, men holder innen 3 minutter.

Rettelse: Med Rygg (rad 7) forsvinner rulleproblemet. Bruk entall som i appen på lappen.

**[Brukertest pre-mortem (SM-3)]** — Ulik bakgrunn betyr også ulik norsk (§ Prosedyre · PRD §8.1; NFR-7)

En utvekslingsstudent feiler på «frigivelsesuke» og «forfalt» av språklige grunner, ikke på grunn av designet.

Rettelse: Rekrutteringskrav: flytende norsk. Noter bakgrunn (innkjøp, Excel, MRP) per testperson.

**[Brukertest pre-mortem (SM-3)]** — Prøvetesten bruker et gruppemedlem (§ Prosedyre · PRD §8.1 Prøvetest; EXP › Før bygging)

Et gruppemedlem som kan appen og begrepene, viser om prosedyren henger sammen, men ikke om en lekperson forstår lappene.

Rettelse: Kjør prøvetesten med én person utenfor gruppa, med full prosedyre og tidtaking. Lås lapper og rubrikk først etterpå.

**[Brukertest pre-mortem (SM-3)]** — Utvalget er lite (§ Måleteknisk gyldighet · PRD SM-3; §8.1)

Med 4–8 personer gjør én dårlig dag at «alle løser alle» ryker. «2 eller flere» betyr 50 % ved 4 personer og 25 % ved 8.

Rettelse: Rapporter per oppgave (løst/feilet, tid, vei, feiltype) i tillegg til ja/nei.

## Pre-mortem: sammendrag og topp 5

Det er 8. desember 2026. Brukertesten (2.–7.12) gikk dårlig. Seks testpersoner, og ingen av dem løste alle tre oppgavene. Oppgave 1 gikk greit, men bare fordi lappen og statuslinja bruker samme ord. Oppgave 2 feilet for fire av seks: de leste «Hjul – Bestilling forsinket» i kritiske deler-lista og svarte at leverandøren var sen. De to som åpnet forklaringspanelet, så tallet 30 i tabellen og «−20» i meldingen og ga opp. Oppgave 3 ble «løst» av alle, men svaret «5 seter i uke 5» kan ikke skille frigivelsesuke fra mengde, så tallet måler ingenting. To av svarene var dessuten «uke 7» fra Resultattabell, fordi panelet fra oppgave 2 fortsatt var åpent. To gruppemedlemmer vurderte oppgave 2 ulikt for nesten like svar. Én testperson fikk Endringer-brettet, fordi den lagrede kjøringen ikke var slettet.

Ingen av disse feilene skyldes beregningen. De skyldes ord, rekkefølge i panelet, en dårlig valgt oppgave 3, en fasit for oppgave 2 som krever mer enn SM-3 og en prosedyre med hull.

1. **Gjør oppgave 2 forståelig der testpersonen faktisk er.** Klartekstlinje og synlig «Se forklaring →» i kritiske deler-lista; meldingen sier «Du er for sent ute med å bestille …», uten «uke 0», «frigitt» og «horisonten», og forklarer hvorfor tabellen viser 30 og ikke −20.
2. **Gjør fasiten for oppgave 2 om til en rubrikk med to krav** (A: for sent ute, mangler hjul i uke 1; B: bestill nå eller be om raskere levering). Tallene er ikke påkrevd. To vurderere etter opptak.
3. **Bytt oppgave 3 fra Sete (uke 5, 5 stk) til Rygg (uke 2, 25 stk, mottak uke 3)**, og skriv lapp og fasit om.
4. **Eksepsjonen først og synlige klikkmål.** Eksepsjonskortet over lag 1, `cursor: pointer` på alt som kan klikkes, «50 forfalt»-pillen blir en knapp, og introduksjonen sier «Du kan klikke på det du vil vite mer om».
5. **Stram inn prosedyren.** Privat vindu eller egen profil per testperson med avkrysning før oppgave 1, skjult radiogruppe, frosset bygg, samme nettleser og 100 % zoom, nullstilling før hver lapp, skriftlig klokkeregel, og prøvetest med en person utenfor gruppa.

## Mekaniske merknader

- **Token-referanser:** 64 unike i DESIGN.md og 5 i EXPERIENCE.md, ingen brutte. Fire generiske mønstre (`{colors.…}`, `{typography.…}` osv.) i EXPERIENCE › Foundation er med vilje.
- **Farger:** Alle 47 er gyldig hex. Bevisste alias med samme verdi: `muted` = `band`, `accent` = `selected-cell`, `input` = `edge`, `primary` = `selected-cell-ring`, `destructive` = `exception-critical`. Endres én, må partneren endres også. Vurder en kommentar.
- **Ubrukte tokener:** shadcn-rollene `popover`, `popover-foreground`, `card-foreground`, `accent`, `accent-foreground`, `input` og `muted` er ubrukte i prosaen, men brukes av shadcn. Avstandstrinnene `1`–`12` er Tailwind-skalaen. `typography.numerals` har bare en note, som er i orden.
- **Kontrast:** Regnet ut på nytt: `foreground`/`card` 15,2, `edge`/`band` 3,5, `muted-foreground`/`card` 6,5 og `brass-line`/`band` 4,0 stemmer. `ring` på `topbar` (1,93) og `navrow` (1,52) består ikke.
- **Frontmatter:** DESIGN.md har name, description, status (draft) og updated. EXPERIENCE.md har name, status (draft), sources (8, alle finnes) og updated. Begge er datert 2026-11-13.
- **Merker:** 2 × `[ASSUMPTION]` i EXPERIENCE.md (l. 122 og l. 294) og 2 × `[OPEN]` om kapasitetspanelet (DESIGN.md › Kapasitetspanel og EXPERIENCE.md › Produksjonskapasitet).
- **Komponentnavn:** Like i begge filene; frontmatter-nøklene er kebab-case (`kritiske-deler-liste`, `knapp-primaer`). «Lenkeknapp i toppfeltet» har ingen nøkkel i frontmatter.
- **UJ-navn:** UJ-1–UJ-5 er ordrett like i PRD §2.3 og Key Flows. Overskriftene beholder «filen» fordi de er sitert, og det er forklart i Voice and Tone.
- **Ordbank:** `updated: 2026-11-13`. `.docs/ordbank.md` har endringer som ikke er committet.
- **Mermaid:** Ingen diagrammer.

## Reviewer-filer

- `review-rubric.md`
- `review-brukertest-premortem.md`
