---
title: Avstemming av PRD mot faglærers tilbakemelding
created: 2026-11-05
kilde: .docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/tilbakemelding-product-brief.md
prd: prd.md og addendum.md (oppdatert 2026-11-05)
---

# Avstemming: PRD mot tilbakemeldingen på product brief

Tilbakemeldingen er fra 2026-10-06 og gjelder briefen (commit `a022614`). Her sjekkes hvert råd, krav, vurderingskriterium og hver bekymring mot `prd.md` og `addendum.md` per 2026-11-05. Bakgrunnen for bevisste valg er hentet fra `beslutninger-2026-11-05.md` og `.memlog.md`. Repoet er også sjekket der et punkt gjelder noe utenfor PRD-en (testdata, rotmappa, historikk).

Status: **Fulgt opp**, **Delvis** eller **Ikke fulgt opp**.

## 1. Gjennomgang punkt for punkt

### 1.1 De viktigste endringene

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 1 | «Beskriv brukerflyten for «endring midtveis» (for eksempel endret MPS). Skal brukeren laste opp en ny Excel-fil, redigere i appen, eller sammenligne før og etter?» | Fulgt opp | §4.5, UJ-3, FR-19–FR-21, SM-5, §6 (ingen inntasting i appen) | Ingen. Valget (ny opplasting + automatisk sammenligning per ferdigprodukt) er tydelig og har fasit (testeksempel 03). |
| 2 | «List opp eksepsjonstypene i briefen […] Da blir kriteriet om pålitelig eksepsjonshåndtering testbart.» | Fulgt opp | §3 Eksepsjon, §4.3 (FR-9–FR-12, FR-29), FR-13, SM-2, dekningstabellen i `testdata/README.md` | Navnene er endret fra tilbakemeldingen («under sikkerhetslager» → «Bruk av sikkerhetslager», «innkjøpstid» → «Ledetid overskrider horisont»), og «Kanseller mottak» er ny. Vurder én setning i §4.3 som sier at de tre typene sensor kjenner fra briefen er de samme, med nye navn, slik at sporet brief → PRD er lett å følge. |
| 3 | «Vurder én planlagt utvidelse etter kjernen, for eksempel fast partistørrelse eller to-nivå BOM.» | Fulgt opp (mer enn det) | §1, §7.1 (flernivå BOM i kjernen), §4.7 FR-24–FR-26 (fast partistørrelse som utvidelse), SM-C1 | Begge forslagene er tatt med: flernivå BOM er flyttet inn i kjernen, og fast partistørrelse er utvidelsen. PRD-en sier ikke selv at flernivå BOM var en av utvidelsene faglærer foreslo. Si det i §0 eller §7, med begrunnelse, så sensor ser at kjernen bevisst er gjort større (se også gap G2). |

### 1.2 Vanskelighetsgrad og faktorer

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 4 | Domenelogikk: «Bruttobehov, forventet beholdning, nettobehov, sikkerhetslager, planlagte mottak og frigivelser med offset for innkjøpstid. […] alle tall må stemme.» | Fulgt opp | §3, §4.2 FR-5–FR-8, FR-28, SM-1, research i addendum | Ingen. Merk at domenelogikken nå er vesentlig tyngre enn faglærer vurderte (flernivå, felles deler, lavnivåkode, fremskynding, Kanseller mottak). Det styrker funksjonalitet, men øker risikoen (G2). |
| 5 | Datamodell: «Produkt, komponent, BOM-linje, MPS per uke, lagerstatus, planlagte mottak og resultatrader per uke og komponent.» | Delvis | §3 Ordliste, FR-3, addendum (graf og lavnivåkode) | Datamodellen er beskrevet som begreper, ikke som entiteter. Det er arkitekturens jobb, men den må lages (G1). |
| 6 | KI i appen: «Ingen KI i appen. Det er et helt greit valg.» | Fulgt opp | §6 Ikke-mål | Ingen. |
| 7 | Filhåndtering: «Opplasting og validering av Excel-mal krever robust lesing og gode feilmeldinger ved feil format, tomme celler og feil datatyper.» | Fulgt opp | §4.1 FR-1–FR-4, SM-4, `testdata/validering/`, addendum (lesing av nivå og varenummer som tekst) | Mangler ett tilfelle: en `.xlsx` som er skadet, passordbeskyttet eller ikke kan åpnes. Legg til en konsekvens i FR-1 (lav). |
| 8 | Sikkerhet og personvern: «Fiktive produksjonsdata uten personopplysninger.» | Fulgt opp | NFR-4 (alt i nettleseren), §6 | Ingen. |
| 9 | «Pass på at kjerneflyten – last opp mal, valider, beregn, vis tabell med varsler – blir ferdig og stabil før dere legger til mer.» | Delvis | SM-C1 (partistørrelse først når SM-1 og SM-2 er nådd), §7.1 | Gjelder bare partistørrelse. Kjernen i §7.1 har nå sju funksjonsområder, blant dem lagring per ferdigprodukt, før/etter-sammenligning, eksport med sammenligningsark og forklaringspanel. PRD-en sier ikke hvilken rekkefølge de bygges i, eller hva som kuttes hvis tiden ikke strekker til. Legg inn en prioritert rekkefølge og en kuttlinje (G2). |

### 1.3 Gjennomførbarhet med BMAD og Claude Code

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 10 | «Dere har ennå ikke PRD eller arkitektur i repoet, så det bør komme snart for å holde fremdriften.» | Delvis | PRD finnes (2026-10-19), men står som `status: draft`, og Finalize er ikke kjørt (`.memlog.md`). Arkitektur finnes ikke. | Kjør Finalize av PRD-en og start arkitekturen nå. Med frist 15.12 (§7) er det ca. seks uker igjen til arkitektur, epics, kode, tester, brukertest og README (G1). |
| 11 | «Faseplanen i addendumet passer godt som utgangspunkt for epics.» | Delvis | Ikke i PRD-en. Faseplanen står bare i briefens addendum (fase 1–7). §4-inndelingen (4.1–4.8) kan brukes som epics. | PRD-en tar ikke faseplanen med seg, og briefen er frosset. Legg en kort faseplan eller rekkefølge i §7 (eller vis til briefens addendum og si hva som er endret), slik at epics kan spores tilbake (G3). |
| 12 | «Merk at addendumet nevner fast partistørrelse og 3–5 komponenter, mens briefen sier lot-for-lot og 5–10. Avklar hva som gjelder.» | Fulgt opp | §3 Bestillingsregel, §4.7, SM-1 (5–10 deler på 3 nivåer), merknad 2026-10-06 i briefens addendum, beslutning #6 (1000 rader) | Ingen. |
| 13 | «En webapp med Excel-lesing (for eksempel Python med pandas/openpyxl eller JavaScript med et Excel-bibliotek) er godt kjent terreng for Claude Code.» | Delvis (bevisst utsatt) | NFR-4 (Vercel, alt i nettleseren, rammeverk avgjøres i arkitekturen), addendum | Kravet om at alt skjer i nettleseren betyr i praksis JavaScript/TypeScript. Arkitekturen må velge og begrunne stakken (kriterium 5). |
| 14 | «Dere har MRP-faget og planlegger manuelt utregnede fasittabeller. Det er akkurat det som skal til for å kontrollere KI-generert kode.» | Fulgt opp | NFR-2, SM-1, SM-2, fasit 01–04 kontrollert for hånd (`testdata/README.md`), addendum («Testene skal sammenligne med fasitfilene […] ikke med skriptet») | Ingen. Godt punkt å løfte fram i mappen. |
| 15 | «Fasittabeller per uke og komponent kan brukes direkte som automatiske tester. Ta med grensetilfeller som behov i uke 1 og innkjøpstid lengre enn horisonten.» | Fulgt opp | NFR-1, NFR-2, FR-8 (300-003 behov i uke 1), FR-9 (300-006 L = H, 300-005 i 02 med 13 > 10, 300-022 i 04), testeksempel 04 | Ingen. Dekningstabellen i `testdata/README.md` er et sterkt bevis. Vurder å vise til den fra NFR-2. |
| 16 | «Legg ved Excel-malen og testeksempelet i repoet, slik at sensor kan prøve med en gang.» | Fulgt opp | NFR-3, FR-27, `testdata/` | Ingen. |
| 17 | Avhengigheter og kostnader: «Ingen betalte tjenester.» | Fulgt opp | NFR-3, NFR-4 | Vercel brukes i tillegg, men NFR-3 krever at appen kan kjøres lokalt uten kontoer. Ingen endring. |
| 18 | «Det må være tid til hele denne flyten, og til testing, retting og README til slutt.» | Delvis | §7 frist 15.12.2026 kl. 15:00 | Bare sluttfristen står. Ingen milepæler for arkitektur, epics, kjernen ferdig, brukertest, README og frys. Legg inn 4–6 datoer i §7 (G3). |

### 1.4 Forslag til justering av omfang

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 19 | «Legg inn én tydelig utvidelse som neste trinn i v1 dersom kjernen blir ferdig tidlig, for eksempel fast partistørrelse som valgbar bestillingsregel.» | Fulgt opp | §4.7 FR-24–FR-26, §7.1, SM-C1 | Testeksempel og fasit for partistørrelse lages først når utvidelsen starter (§9.2 spm. 3). Det er greit, men da kan FR-25 ikke testes før sent. Lag fasiten tidlig nok til at utvidelsen kan bli ferdig før fristen, eller si eksplisitt at den kan droppes (lav). |
| 20 | «Vurder en enkel før/etter-visning når MPS endres, slik at «dårlig oversikt ved endringer» fra problemet faktisk blir løst i appen.» | Fulgt opp | FR-20, FR-23, UJ-3, SM-5, testeksempel 03 med arket Sammenligning | Ingen. |

### 1.5 Gjennomgang av briefens deler (status «Juster»)

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 21 | The Solution: «Beskriv også hvordan brukeren håndterer en endring i MPS, og hvordan varslene vises i tabellen.» | Fulgt opp | §4.5 (endring), FR-15 (fremheving med farge og symbol), FR-16, FR-18, NFR-8, UJ-2 | Ingen for teksten. Se punkt 26 om skisse. |
| 22 | Scope: «eksepsjonstypene bør navngis, og avviket mot addendumet (partistørrelse, antall komponenter) bør ryddes.» | Fulgt opp | Se punkt 2 og 12 | Ingen. |
| 23 | Success Criteria: «Konkrete og testbare, inkludert brukertesten med 3 av 3 testpersoner.» | Delvis | SM-3, §9.1 spm. 4 (åpent: testpersoner og introduksjon ikke bestemt) | Det eneste åpne spørsmålet i PRD-en gjelder et suksessmål sensor har trukket fram. Bestem hvem testpersonene er, hva den korte introduksjonen er, hvilke oppgaver de får (f.eks. de tre i SM-3 på testeksempel 02), når testen kjøres og hvor resultatet dokumenteres (G4). |

### 1.6 Kriteriene for del 1 av mappen

| # | Kriterium og råd (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 24 | **1. Prosess og KI-styring (30 %):** «Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. […] Fortsett med PRD og arkitektur i samme mappe.» | Delvis | §0 (kilder, faste FR-nummer), UJ-referanser i hver FR, SM → FR, `beslutninger-2026-11-05.md`, `.memlog.md`, research | Sporbarheten brief → PRD → testdata er god. Det mangler: (a) arkitektur og epics (G1), (b) en setning om hvordan sporingen videre skal gjøres (FR-nummer i stories, tester og commit-meldinger), og (c) hvordan gruppen kontrollerer Claude Codes arbeid utover fasitene (kodegjennomgang, sesjonslogg, testrapport). Legg inn et kort avsnitt om kvalitetssikring og sporbarhet, f.eks. i §0 eller en ny §5-NFR (G5). |
| 25 | **2. Funksjonalitet og omfang (20 %):** «Realistisk kjerneflyt, men noe smal. Planlegg én utvidelse slik at det blir nok funksjonalitet å vise.» | Fulgt opp | §7.1, §4.7 | Omfanget er ikke lenger smalt. Risikoen er nå motsatt: for mye til seks uker (G2). |
| 26 | **3. Kvalitetssikring og testing (15 %):** «Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller.» | Fulgt opp | «Konsekvenser (testbare)» under hver FR, NFR-2, SM-1–SM-6, `testdata/validering/` | NFR-2 krever automatiske tester bare for beregning og eksepsjoner. Det står ikke hvordan FR-14–FR-23 (visning, lagring, sammenligning, eksport) testes, eller om testresultatene dokumenteres. Briefens addendum lovet «kode + testdata + testresultat (dokumentert avvik/samsvar)» per fase. Legg inn hvilke testnivåer som brukes (enhetstester for beregning og validering, noen ende-til-ende-tester for opplasting → tabell → sammenligning → eksport) og hvor testresultatene dokumenteres (middels, del av G5). |
| 27 | **4. Design og brukeropplevelse (10 %):** «Skisser resultattabellen og hvordan varsler og kritiske komponenter fremheves, siden brukertesten skal måle om de forstås.» | Delvis | FR-14–FR-18, NFR-8, §4.4 (rekkefølge: bestillingsforslag, sammendrag, tabell), addendum («Hører hjemme i UX-spesifikasjonen») | Beskrevet i tekst, men ingen skisse. Lag en enkel skisse av startsiden og resultatsiden (bestillingsforslag, sammendrag, tabell med fremheving og forklaringspanel, sammenligning), enten i PRD-en eller i en UX-spesifikasjon (`bmad-ux`) som PRD-en viser til (G4). |
| 28 | **5. Kodekvalitet og arkitektur (10 %):** «Hold beregningsmotoren adskilt fra Excel-lesing og visning, slik at den kan testes alene.» | Fulgt opp | NFR-1, funksjonsspesifikke NFR-er under FR-8, addendum (ren funksjon) | Ingen. |
| 29 | **5. Kodekvalitet og arkitektur:** «Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger.» | Delvis (utsatt) | NFR-4, NFR-6, addendum | Avgjøres i arkitekturen. Pass på at Vercel, rammeverk og lagring (localStorage eller IndexedDB) begrunnes der. |
| 30 | **6. README og kjørbarhet (10 %):** «Løsning som andre kan kjøre lokalt uten betalte kontoer […]. Husk å legge Excel-malen og testfilene i repoet.» | Fulgt opp | NFR-2 (testkommando i README), NFR-3, SM-6, FR-27 | README i roten har i dag bare navn og medlemmer, som ventet før koden finnes. Vurder å liste i NFR-3 hva README minst skal inneholde: krav til verktøy, installasjon, start, testkommando, Vercel-lenke, hvor malen og testeksemplene ligger, og hvordan testeksempel 01 kjøres (lav). |
| 31 | **7. Ryddighet i repoet (5 %):** «`test.txt` i roten bør fjernes. Bestem en egen mappe for Excel-mal og testeksempler med fasit.» | Fulgt opp | §0, NFR-3, `testdata/` | `test.txt` er borte, `testdata/` er på plass, og `.gitignore` dekker hemmeligheter og byggfiler. Ingen endring. |

### 1.7 Neste steg for gruppen

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 32 | «Oppdater briefen med eksepsjonstypene og brukerflyten for endring i MPS, og rydd avviket mot addendumet.» | Fulgt opp | Briefen er oppdatert (commit `287e3d8`, `4146014`, `e26df97`) og frosset med merknad om at PRD-en gjelder (§0, §9.2 spm. 10) | Ingen. |
| 33 | «Lag det fiktive testeksempelet med fasittabell nå, før implementeringen, og bruk det som grunnlag for PRD og de første testene.» | Fulgt opp | Testeksempel 01–04 og 33 valideringsfiler, brukt i konsekvensene i FR-1–FR-23 | Ingen. |
| 34 | «Gå videre med PRD og arkitektur, og legg en eventuell utvidelse (fast partistørrelse eller to-nivå BOM) inn som eget, senere epic.» | Delvis | §4.7 sier «eget, senere epic». Arkitektur mangler. | Se G1. |
| 35 | «Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg.» | Fulgt opp | Git-historikken for briefen, merknadene øverst i brief og addendum, oppdateringslinjene i PRD §0 | Ingen. Beslutningsfila og `.memlog.md` viser også hvordan PRD-en utviklet seg. |

### 1.8 Generelle krav til mappen

| # | Punkt fra tilbakemeldingen (sitat) | Status | Hvor i PRD-en | Forslag |
|---|---|---|---|---|
| 36 | «sensor kan følge en sporbar vei fra plan til ferdig app» | Delvis | Se punkt 24 | Veien er sporbar fram til testdata. Arkitektur, epics og stories mangler (G1, G5). |
| 37 | «om appen gjør det dere har beskrevet» | Fulgt opp (forutsetning) | Testbare konsekvenser per FR | Ingen. |
| 38 | «om den er testet» | Delvis | NFR-2, SM-1–SM-6 | Se punkt 26. |
| 39 | «om den er godt designet» | Delvis | §4.4, NFR-8 | Se punkt 27. |
| 40 | «om den kan kjøres etter README» | Fulgt opp | NFR-3, SM-6 | Se punkt 30. |

## 2. Gap etter alvor

| ID | Gap | Alvor | Kriterium | Tiltak |
|---|---|---|---|---|
| G1 | Arkitektur, epics og stories finnes ikke, og PRD-en er ikke ferdigstilt (Finalize ikke kjørt). Ca. seks uker til fristen 15.12. Faglærer ba om PRD og arkitektur «snart» allerede 2026-10-06. | Høy | 1 (30 %), 5 | Kjør Finalize av PRD-en nå, deretter `bmad-architecture` og `bmad-create-epics-and-stories`. |
| G2 | Kjernen er gjort betydelig større enn faglærer vurderte (flernivå BOM, felles deler, lagring per ferdigprodukt, sammenligning, eksport, forklaringspanel), uten prioritert rekkefølge eller kuttlinje. Faglærer sa «ferdig og stabil før dere legger til mer». SM-C1 gjelder bare partistørrelse. | Høy | 2 (20 %), 3 | Legg inn i §7.1 en prioritert byggerekkefølge (f.eks. beregning + validering → tabell og eksepsjoner → bestillingsforslag og forklaring → lagring og sammenligning → eksport → partistørrelse) og si hva som kuttes først hvis tiden ikke strekker til. Si også at flernivå BOM er utvidelsen faglærer foreslo, nå tatt inn i kjernen. |
| G3 | Ingen faseplan eller milepæler i PRD-en. Faseplanen fra briefens addendum er ikke ført videre, og bare sluttfristen står. Faglærer pekte på faseplanen som grunnlag for epics og på tid til testing, retting og README til slutt. | Middels | 1, 2 | Legg 4–6 milepæler i §7 (arkitektur, kjerne testet mot fasit, brukertest, README og kjørbarhetstest, frys før 15.12) og vis til briefens faseplan. |
| G4 | Design og brukertest er ikke konkretisert: ingen skisse av resultatsiden, og SM-3 (testpersoner, introduksjon, oppgaver, dokumentasjon) er fortsatt åpent (§9.1 spm. 4). Faglærer koblet skissen direkte til brukertesten. | Middels | 4 (10 %), 3 | Lag en enkel skisse eller UX-spesifikasjon (`bmad-ux`) og bestem brukertesten før epics, så den kan få en egen story. |
| G5 | Kvalitetssikring av KI-arbeidet og testdokumentasjon er ikke beskrevet utover fasitene: ingen testnivåer for visning, lagring, sammenligning og eksport, ingen plan for testrapport, og ingen regel for sporing fra FR til story, test og commit. | Middels | 1 (30 %), 3 (15 %) | Legg inn et kort avsnitt (eller NFR-9) om testnivåer, hvor testresultater dokumenteres og hvordan FR-nummer følges gjennom stories, tester og commits. |
| G6 | Små hull: FR-1 dekker ikke skadet eller passordbeskyttet `.xlsx`. NFR-3 sier ikke hva README skal inneholde. Fasit for partistørrelse lages sent. §4.3 forklarer ikke at eksepsjonsnavnene fra briefen er endret. | Lav | 3, 6 | Legg til én konsekvens i FR-1, en README-sjekkliste i NFR-3, en setning om navneendringene i §4.3 og en dato for fasiten til FR-25. |
| G7 | Utenfor PRD-en: `testdata/README.md` bruker «komponenter» og «varsler» mot ordbanken, og sier at fasit 01 har en tabell for ferdigproduktet 100-001, mens dekningstabellen og FR-19 sier 100-002. | Lav | 7, 1 | Rett ordbruken og varenummeret i `testdata/README.md`. |
