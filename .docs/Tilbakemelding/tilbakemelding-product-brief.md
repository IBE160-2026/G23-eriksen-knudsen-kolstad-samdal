# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G23 – G23-eriksen-knudsen-kolstad-samdal |
| **Product brief** | `.docs/planning-artifacts/briefs/brief-COSI - MRP-2026-09-13/brief.md` (commit `a022614`), med `addendum.md` i samme mappe |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Gruppen kan gå videre og innarbeide punktene under.

**Det som er bra:**

1. Avgrensningen av v1 er svært tydelig: enkeltnivå BOM, ett ferdigprodukt, 5–10 komponenter, 8–12 uker, lot-for-lot som eneste bestillingsregel og ingen innlogging. Det gjør MRP-ideen gjennomførbar for et semester.
2. Suksesskriteriene er blant de beste vi har sett: «100 % samsvar med manuelt kontrollerte testeksempler», riktig varsel i hvert kjent avvikstilfelle og validering av Excel-malen før beregning. Det fiktive testeksempelet med fasitsvar gir dere et konkret grunnlag for automatiske tester og for å kontrollere Claude Codes kode.

**De viktigste endringene:**

1. Beskriv brukerflyten for «endring midtveis» (for eksempel endret MPS). Skal brukeren laste opp en ny Excel-fil, redigere i appen, eller sammenligne før og etter? Dette står i suksesskriteriene, men ikke i løsningen.
2. List opp eksepsjonstypene i briefen, slik addendumet gjør («under sikkerhetslager», «bestilling forsinket», «innkjøpstid overskrider horisont»). Da blir kriteriet om pålitelig eksepsjonshåndtering testbart.
3. Vurder én planlagt utvidelse etter kjernen, for eksempel fast partistørrelse eller to-nivå BOM. Enkeltnivå med lot-for-lot er en ganske liten beregning, og dere trenger nok innhold å vise i funksjonalitet og testing.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Middels**

**Sammenlignbart med:** 4) KI-støttet MRP II, avgrenset til modul 4.5 Material Requirements Planning. Hele forslag 4 er vanskelig, men én modul med enkeltnivå BOM og lot-for-lot ligger på middels nivå.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | Middels | Bruttobehov, forventet beholdning, nettobehov, sikkerhetslager, planlagte mottak og frigivelser med offset for innkjøpstid. Standard teori dere kjenner fra faget, men alle tall må stemme. |
| Datamodell – antall entiteter og relasjoner mellom dem | Middels | Produkt, komponent, BOM-linje, MPS per uke, lagerstatus, planlagte mottak og resultatrader per uke og komponent. |
| Brukere, roller og innlogging | Lav | Én bruker og ingen innlogging i v1. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | Lav | Ingen KI i appen. Det er et helt greit valg: emnet handler om å styre KI i utviklingen, og appen blir enklere å teste og kjøre. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | Lav | Ingen eksterne tjenester. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | Lav | Ett datasett om gangen. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | Middels | Opplasting og validering av Excel-mal krever robust lesing og gode feilmeldinger ved feil format, tomme celler og feil datatyper. |
| Sikkerhet og personvern | Lav | Fiktive produksjonsdata uten personopplysninger. |

**Hva vanskelighetsgraden betyr for dere:**

- _Middels:_ Et godt balansert valg. Pass på at kjerneflyten – last opp mal, valider, beregn, vis tabell med varsler – blir ferdig og stabil før dere legger til mer. Når den er testet mot fasit, kan en utvidelse som fast partistørrelse eller to-nivå BOM løfte prosjektet.

### Gjennomførbarhet med BMAD og Claude Code

Dere skal planlegge med BMAD (product brief → PRD → arkitektur → epics og stories) og implementere med Claude Code. Vurderingen under tar hensyn til at det må være tid til hele denne flyten, og til testing, retting og README til slutt.

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | OK | Omfanget er godt tilpasset. Dere har ennå ikke PRD eller arkitektur i repoet, så det bør komme snart for å holde fremdriften. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | OK | Faseplanen i addendumet passer godt som utgangspunkt for epics. Merk at addendumet nevner fast partistørrelse og 3–5 komponenter, mens briefen sier lot-for-lot og 5–10. Avklar hva som gjelder. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | OK | En webapp med Excel-lesing (for eksempel Python med pandas/openpyxl eller JavaScript med et Excel-bibliotek) er godt kjent terreng for Claude Code. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | OK | Dere har MRP-faget og planlegger manuelt utregnede fasittabeller. Det er akkurat det som skal til for å kontrollere KI-generert kode. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | OK | Fasittabeller per uke og komponent kan brukes direkte som automatiske tester. Ta med grensetilfeller som behov i uke 1 og innkjøpstid lengre enn horisonten. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | OK | Ingen nøkler eller kontoer trengs. Legg ved Excel-malen og testeksempelet i repoet, slik at sensor kan prøve med en gang. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | OK | Ingen betalte tjenester. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart som beskrevet.**

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. Legg inn én tydelig utvidelse som neste trinn i v1 dersom kjernen blir ferdig tidlig, for eksempel fast partistørrelse som valgbar bestillingsregel. Det er lite ekstra datamodell, men gir flere testtilfeller og mer å vise.
2. Vurder en enkel før/etter-visning når MPS endres, slik at «dårlig oversikt ved endringer» fra problemet faktisk blir løst i appen.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | OK | Klart at COSI - MRP erstatter et personavhengig Excel-ark med en innebygd MRP-prosess. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | OK | De fire problemene (personavhengighet, manuelt arbeid, feil, dårlig oversikt ved endringer) er konkrete og troverdige. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | Juster | Opplasting, validering og tabell er beskrevet. Beskriv også hvordan brukeren håndterer en endring i MPS, og hvordan varslene vises i tabellen. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Ærlig om at MRP er standard teori, og at verdien ligger i at prosessen er bygget inn i verktøyet. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | OK | Produksjonsplanlegger eller innkjøper uten formell planleggingsbakgrunn. Fint skille mellom målgruppe og testeksempel. |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | OK | Konkrete og testbare, inkludert brukertesten med 3 av 3 testpersoner. |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | Juster | Svært tydelig, men eksepsjonstypene bør navngis, og avviket mot addendumet (partistørrelse, antall komponenter) bør ryddes. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | OK | Flernivå BOM, flere produkter og innlogging ligger tydelig etter v1. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | OK | Briefen er presis, og historikken viser PR og flere runder med forbedring. Fortsett med PRD og arkitektur i samme mappe. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | Juster | Realistisk kjerneflyt, men noe smal. Planlegg én utvidelse slik at det blir nok funksjonalitet å vise. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | OK | Fasitbaserte testeksempler er et svært godt grunnlag. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | Juster | Brukeren er tydelig. Skisser resultattabellen og hvordan varsler og kritiske komponenter fremheves, siden brukertesten skal måle om de forstås. |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | OK | Ingen innlogging, ingen eksterne tjenester. Hold beregningsmotoren adskilt fra Excel-lesing og visning, slik at den kan testes alene. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | OK | Ingen betalte avhengigheter. Husk å legge Excel-malen og testfilene i repoet. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | Juster | `test.txt` i roten bør fjernes. Bestem en egen mappe for Excel-mal og testeksempler med fasit. |

## 3. Neste steg for gruppen

1. Oppdater briefen med eksepsjonstypene og brukerflyten for endring i MPS, og rydd avviket mot addendumet.
2. Lag det fiktive testeksempelet med fasittabell nå, før implementeringen, og bruk det som grunnlag for PRD og de første testene.
3. Gå videre med PRD og arkitektur, og legg en eventuell utvidelse (fast partistørrelse eller to-nivå BOM) inn som eget, senere epic.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.
