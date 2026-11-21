# Samlet demoprototype og arkitekturstart

## 2026-11-15 kl. 11:47 — Carmen Kolstad

### Oppgave
Fortsette COSI-MRP fra forrige økt:
- hente inn Odas fremdriftsplan fra origin/main uten å røre de fem lokale endringene
- starte BMAD Architecture (Coaching path, norsk)

BMAD Architecture ble satt på pause for å lage én samlet demonstrasjonsprototype av UX-retningen til gruppemøtet 16.11. Prototypen skal ha egne visninger for Introduksjon, Ny kjøring, Resultat og Ukeplan i samme nettside, med felles meny og delt tilstand. Det skal ikke gjøres commit, push eller merge uten godkjenning (merge av main ble godkjent), og PRD-en og arkitekturdokumentene skal ikke endres.

### Plan
- Ta sikkerhetskopi av de fire endrede filene i scratchpad, kjøre fetch, prøve sammenslåingen med `git merge-tree` og så merge med `--no-ff`. Kontrollere fremdriftsplanen, de lokale endringene og main etterpå.
- Starte BMAD Architecture: arbeidsmappe, memlog og første beslutning (teknologi). Deretter pause.
- Kopiere `brukerreise-v3.html` til en ny mappe og bygge videre der. Ukeplanen fra konsept B, introduksjonen og oppsummeringen legges til som egne visninger. Originalene røres ikke, og md5-sjekksummene kontrolleres før og etter.
- Teste i Chrome uten vindu via localhost (CDP-skript i scratchpad), og åpne prototypen i Safari.

### Resultat
- **Merge:** `3fc439e` Merge origin/main inn i Carmen/Branch (Odas reviderte fremdriftsplan, PR #14).
  - Commiten endrer bare `.docs/prosjektstyring/fremdriftsplan.xlsx`, som nå er lik fila på origin/main.
  - De fem lokale endringene er urørt. Sjekksummene for diffen og PDF-en er de samme som før merge.
  - Lokal `main` (`8a014e8`) og `origin/main` (`d5482d7`) er ikke endret. Ikke pushet.
- **Fremdriftsplanen (Oda, 14.11):** Arkitektur 13.–18.11 (står som «Pågår»), epics 18.–20.11, trinn 1a og 1b fra 20.11, trinn 1c og 2 ferdig 27.11, trinn 3 ferdig 29.11, kuttbeslutning 30.11, levering 15.12.
- **BMAD Architecture** er startet og står på pause.
  - Arbeidsmappe: `.docs/planning-artifacts/architecture/architecture-COSI - MRP-2026-11-15/` (`.memlog.md` og malen `ARCHITECTURE-SPINE.md`, ikke utfylt).
  - Memlog: begrensninger (NFR-1, NFR-2, NFR-4, Vercel, frister), UX-retning, npm-versjoner fra 2026-11-15 og den første beslutningen.
  - Første beslutning er lagt fram med alternativene A (Vite + React + TypeScript, anbefalt), B (Vite + TypeScript uten rammeverk), C (Next.js) og D (Pyodide). Den er ikke besluttet.
- **Samlet demonstrasjonsprototype:** `.docs/planning-artifacts/ux/demo-2026-11-16/cosi-mrp-demo.html` og `README.md`.
  - Visninger: `#/intro`, `#/start`, `#/resultat` (nøkkeltall, krever oppfølging, neste steg), `#/ukeplan` (konsept B, egen side), `#/tabell` (Detaljer: full MRP-tabell og forklaringspanel), `#/del/…`, `#/endringer`, `#/kapasitet`, `#/lagret` og `#/veiledning`.
  - Introduksjonen vises ved første besøk. Senere besøk går rett til Ny kjøring.
  - Valgt uke er en del av den delte tilstanden og beholdes ved navigasjon og ved oppdatering av siden.
  - Eksepsjonene vises med det offisielle navnet fra ordbanken og en setning i vanlig språk.
  - Det står tydelig flere steder at filen ikke leses og at tallene er testdata.
- **Test** (`test-demo.mjs` i scratchpad): 109 av 109 kontroller besto, uten konsollfeil. Den dekker:
  - introduksjonen ved første og senere besøk
  - nedlasting av malen
  - feil filtype og valideringsfeil
  - nøkkeltall for testeksempel 01 (1 produksjonsforslag, 4 innkjøpsforslag, 4 deler, 2 med forfalt mengde)
  - at Resultat og Ukeplan er egne visninger
  - ukevalg med klikk og Forrige/Neste, og at uken huskes
  - tilbake-knappen
  - Del-visningen med forklaringspanelet og Esc
  - Detaljer med 9 deler og piltaster
  - eksportdemoen, lagrede kjøringer og sletting, veiledningen og logoen
  - sammenligning 02 → 03 med 11 endringer
  - ingen sidelengs rulling på 1440, 1280, 1024, 800 og 390 px
  - ingen dupliserte ID-er
- **Rettet underveis:**
  - Skriptstiene til datafilene var feil i kopien.
  - «1 varer» i ukeplanen (arvet fra konsept B) er endret til riktig entall.
- **Originalene er uendret** (md5 kontrollert): v3, konsept B, `felles.js`, `data-kontorstol-pro.js` og `felles-resultat.js`. PRD-en, EXPERIENCE.md og arkitekturdokumentene er ikke endret.
- **Sikkerhetskontrollen** stoppet en Bash-kommando med et Python-heredoc for tekstbytte, fordi den ikke kunne tolkes sikkert. Kommandoen inneholdt ingen sletting. Den ble ikke overstyrt, og byttene ble gjort som enkeltstående Edit-operasjoner.
- Prototypen er åpnet i Safari via `http://localhost:8765/…`. Den lokale serveren kjører.
- Denne loggen er ikke committet. Carmen har bedt om ingen commit (gruppens regel går foran skillen).

### Åpne punkter
- Gruppen tar stilling til demonstrasjonsprototypen 16.11:
  - om appen skal ha en introduksjonsside (SM-3 og PRD §9 nr. 4)
  - om Resultat og Ukeplan skal være egne sider (EXPERIENCE.md og PRD §4.4 beskriver én resultatside)
  - om eksepsjonene skal vises med offisielt navn og vanlig språk
  - menyordene «Resultat», «Ukeplan», «Detaljer» og «Krever oppfølging» (inn i ordbanken når de er godkjent)
- Fortsett BMAD Architecture etter møtet:
  - Velg teknologi (A eller B), og avklar hva gruppen kan fra før og hvem arkitekturdokumentet er for.
  - Arkitekturen skal være godkjent 18.11 etter fremdriftsplanen.
- Gjør tastaturtesten av demonstrasjonsprototypen for hånd i Safari.

## 2026-11-15 kl. 12:05 — Carmen Kolstad

### Oppgave
Lage to nye visuelle designforslag for den samlede prototypen, med Linear, Vercel og Ramp som inspirasjon uten å kopiere dem:
- A er et moderne, minimalistisk SaaS-design.
- B er et mer eksklusivt dashboard med tydeligere nøkkeltall og en mer fremtredende ukeplan.

Brukerreisen, funksjonene og testdataene skal beholdes, og blågrønn skal være hovedfargen. Introduksjonen og Resultat skal prioriteres. Forslagene skal fungere på PC og mobil, og den eksisterende løsningen skal ikke overskrives. Ingen commit.

### Plan
- Kopiere `cosi-mrp-demo.html` til to filer og legge et eget designlag (`<style id="tema-a|b">`) til hver. Bare introduksjonen og nøkkeltallene i B får ny struktur. ID-er og JavaScript beholdes, så den samme testen kan kjøres mot begge.
- Gjøre testen i scratchpad gjenbrukbar (`PAGE`, `SEEN`) og ta skjermbilder på 1440 og 390 px.

### Resultat
- Nye filer i `ux/demo-2026-11-16/`: `design-a-minimal.html` og `design-b-dashboard.html`. `README.md` har fått et avsnitt om forslagene.
- **A:**
  - lys sidemeny med tynne skillelinjer og en diskret prototypelinje
  - sentrert introduksjon med en svak blågrønn glød, et produktbilde (dekor) og verdipunkter med skillelinjer
  - nøkkeltallene i én rad med skillelinjer
- **B:**
  - dyp blågrønn sidemeny
  - mørk introduksjon i to kolonner med et produktbilde
  - nøkkeltallene i et mørkt felt med små søylediagrammer per uke
  - ukeplanen som en mørk tavle der fargestyrken følger antall forslag
- Hver fil har egne lagringsnøkler (`cosi-design-a-*`, `cosi-design-b-*`).
- **Test:** 109 av 109 for både A og B, uten konsollfeil og uten sidelengs rulling på 1440, 1280, 1024, 800 og 390 px.
- **Rettet under arbeidet:**
  - Designlagene overstyrte mobilregelen for sidemenyen og rutenettet på resultatsiden, slik at siden fikk sidelengs rulling på 390 px.
  - Fargeforklaringen over ukeplanen i B var usynlig.
  - `calc()` i alfakanalen ble byttet ut med en verdi regnet ut i JavaScript, av hensyn til Safari.
- `cosi-mrp-demo.html`, v3, konsept B og datafilene er uendret (md5 kontrollert). PRD-en og arkitekturdokumentene er ikke endret.
- Begge forslagene er åpnet i Safari via localhost.
- Ingenting er committet.

### Åpne punkter
- Gruppen velger visuell retning (A eller B, eller en blanding) sammen med de andre spørsmålene om demonstrasjonsprototypen.
- Forslagene er bare kontrollert i Chrome uten vindu. Safari og mobil må kontrolleres for hånd (B bruker `backdrop-filter` og alfa fra CSS-variabler).

## 2026-11-15 kl. 12:17 — Carmen Kolstad

### Oppgave
Ingen av designene (originalen, A og B) traff ønsket kvalitet. Carmen ba om et nytt forslag, Design C – Premium SaaS: omtrent 70 % moderne programvareplattform og 30 % planleggingssystem. Introduksjonen skal være mørk med diskret gradient og en stor, realistisk forhåndsvisning av dashboardet og ukeplanen. Arbeidsflaten skal være lys, med fast navigasjon. Resultat og Ukeplan skal fortsatt være separate sider, og funksjonene skal være de samme. Eksisterende prototyper skal ikke endres, og det skal ikke gjøres commit.

### Plan
- Kopiere `cosi-mrp-demo.html` til `design-c-premium.html` og legge til et eget designlag (`tema-c`) og en ny introduksjon.
- Bygge forhåndsvisningen av dashboardet fra testdataene (`COSI`, testeksempel 01), så tallene stemmer med appen.
- Kjøre den samme testen (109 kontroller) og ta skjermbilder på 1440 og 390 px.

### Resultat
- Ny fil: `ux/demo-2026-11-16/design-c-premium.html`. README-en har fått en rad for C.
- **Introduksjonen:**
  - mørk øvre del med blågrønn gradient og et svakt rutenett
  - overskriften «Produksjon og innkjøp, planlagt uke for uke.» med «Kom i gang» og «Se veiledningen»
  - stort bilde av resultatdashboardet med sidemeny, fire nøkkeltall, ukeplan med tall for uke 1–10 og to forhold som krever oppfølging, bygd fra testeksempel 01
  - en prosesslinje med tre steg i stedet for informasjonsbokser
  - merket som UX-forslag med forhåndsdefinerte testdata i den øvre delen, i den gule linjen, nederst i sidemenyen og i bunnteksten
- **Arbeidsflaten:**
  - lys, fast sidemeny der aktiv side er et hvitt felt med kant
  - nøkkeltallskort med fargelinje øverst og en liten måler per uke
  - samlet liste over det som krever oppfølging
  - ukeplan der fargestyrken følger mengden
  - skrift med fast tegnbredde for ukenumre og tall i MRP-tabellen
- **Test:** 109 av 109, uten konsollfeil og uten sidelengs rulling på 1440, 1280, 1024, 800 og 390 px.
- **Rettet etter visuell kontroll:** ulik størrelse på seksjonsoverskriftene og svak fargeforklaring over ukeplanen.
- `cosi-mrp-demo.html`, A, B, v3, konsept B og datafilene er uendret (md5 kontrollert). PRD-en og arkitekturdokumentene er ikke endret.
- Design C er åpnet i Safari via localhost.
- Ingenting er committet.

### Åpne punkter
- Carmen vurderer Design C. Velges den, bør A og B arkiveres eller merkes som forkastet før gruppemøtet, så gruppen ikke må sammenligne fire varianter.
- Kontroller C for hånd i Safari og på mobil (`backdrop-filter`, `mask-image` og fargestyrke fra CSS-variabler).

## 2026-11-15 kl. 12:25 — Carmen Kolstad

### Oppgave
Design C ble for voldsomt: overskriftene var for store, kontrastene for sterke og de mørke flatene for mange. Carmen likte Design B best og ba om en ny, dempet variant av B:
- roligere turkis, brukt bare på viktige knapper og markeringer
- moderate overskrifter og en ryddig meny
- lyse arbeidsflater
- forhåndsvisningen av ukeplanen beholdes på introduksjonen
- ingen store mørke bokser og ingen unødvendige effekter

Funksjoner, sidestruktur og testdata skal være de samme. Ingen eksisterende prototype skal overskrives, og det skal ikke gjøres commit.

### Plan
- Kopiere `design-b-dashboard.html` til `design-b2-dempet.html` og legge til et ekstra designlag (`tema-b2`) etter B sitt.
- Endre bare formelen for fargestyrken i ukeplanen (svakere på lys flate), lagringsnøklene og merkingen.
- Kjøre den samme testen og ta skjermbilder på 1440 og 390 px.

### Resultat
- Ny fil: `ux/demo-2026-11-16/design-b2-dempet.html`. README-en har fått en rad for B2, merket som Carmens foretrukne retning.
- **Endringer fra B:**
  - roligere turkis (`#1E6F68`), brukt bare på hovedknapper, valgt uke og aktiv markering
  - overskrifter på 22–24 px i arbeidsflaten og 28–40 px på introduksjonen
  - lys introduksjon med et lyst bilde av nøkkeltallene og ukeplanen
  - nøkkeltallene på hvite kort i stedet for et mørkt felt
  - ukeplanen som en lys tavle med dempede farger
  - lys bakgrunn på det første neste steget
  - glød, uskarpe bakgrunner, prikkmønster og fargeovergang i logoen er tatt bort
- Sidemenyen beholder strukturen fra B, med en roligere mørk blågrønn farge. Carmen ba om en «ryddig toppmeny», og den er tolket som den eksisterende menyen, ikke som en ny vannrett meny på PC.
- **Test:** 109 av 109, uten konsollfeil og uten sidelengs rulling på 1440, 1280, 1024, 800 og 390 px.
- `cosi-mrp-demo.html`, A, B, C, v3, konsept B og datafilene er uendret (md5 kontrollert). PRD-en og arkitekturdokumentene er ikke endret.
- B2 er åpnet i Safari.
- Ingenting er committet.

### Åpne punkter
- Avklar med Carmen om «toppmeny» betyr en vannrett meny øverst også på PC. Da må B2 få et nytt navigasjonsoppsett.
- Velges B2: rydd i `demo-2026-11-16/` før gruppemøtet, for eksempel ved å flytte A, B og C til en arkivmappe. Kontroller B2 for hånd i Safari og på mobil.

## 2026-11-15 kl. 12:52 — Carmen Kolstad

### Oppgave
Carmen bekreftet at B sin sidemeny skal beholdes på PC, med tilpasset navigasjon på mobil, og ba om å fortsette med B2: god lesbarhet, moderate overskrifter, diskret fargebruk og lyse arbeidsflater. B2 skal åpnes i Safari, slik at hun kan vurdere Introduksjon, Ny kjøring, Resultat og Ukeplan. Ingen commit.

### Plan
- Gå gjennom skjermbildene av Ny kjøring og mobilvisningen og gjøre små, målrettede rettelser i `design-b2-dempet.html`.

### Resultat
- På mobil er prototypelinjen kortet ned til én linje: «UX-forslag B2 med forhåndsdefinerte testdata – ikke godkjent av gruppen». Den lange forklaringen og kildelenkene er skjult på smale skjermer. Teksten «Bygger på og .» som ble stående igjen, er rettet, og «Prototypevalg» brytes ikke lenger over to linjer.
- Ny kjøring har en lettere hovedoverskrift og ingress.
- **Test:** 109 av 109, uten konsollfeil og uten sidelengs rulling ned til 390 px.
- Tidligere prototyper er uendret (md5).
- B2 er åpnet i Safari på `#/intro`.
- Ingenting er committet.
- Avklaringen om «toppmeny» fra forrige seksjon er løst: sidemenyen fra B beholdes på PC.

### Åpne punkter
- Carmen avgjør om B2 blir UX-forslaget som presenteres for gruppen.

## 2026-11-15 kl. 12:59 — Carmen Kolstad

### Oppgave
Lage en enkel, separat UX-skisse for en fremtidig utvidelse med bedriftskontoer og innlogging. Den skal vise innlogging, opprettelse av bedriftskonto og hvordan bedriftsnavn og brukerprofil kan stå i navigasjonen. Skissen skal ikke være en del av MVP, og den eksisterende brukerreisen skal ikke endres. Det skal ikke lages autentisering, database eller lagring, PRD-en og arkitekturdokumentene skal ikke endres, og ingenting skal committes.

### Plan
- En frittstående side i en egen mappe, i samme stil som B2, med tre faner.
- Skjemaene skal ikke sende eller lagre noe. Testen kontrollerer at ingenting sendes over nettverket og at ingenting lagres i nettleseren.

### Resultat
- Ny mappe: `ux/framtid-bedriftskonto-2026-11-15/` med `skisse-bedriftskonto.html` og `README.md`.
- **Faner:**
  1. Innlogging med bedriftens Microsoft-konto (SSO) eller e-post og passord.
  2. Opprett bedriftskonto i tre steg: bedrift, profil og bekreft. Den som oppretter kontoen, blir administrator.
  3. Bedriftsnavnet øverst i sidemenyen, med meny for å bytte bedrift, åpne innstillinger og invitere kolleger. Profilen nederst, med meny for profil, varsler og «Logg ut». Bedriftsnavnet står også i brødsmulen, og det finnes en mobilskisse.
- Hver fane har notater med designvalg og åpne spørsmål. Nederst står hva utvidelsen ville kreve: server, database og personvern, i konflikt med NFR-4 og PRD §6 i v1.
- Siden er merket «Fremtidig forslag – ikke en del av MVP». Personene og bedriftene er fiktive.
- **Test** (`test-konto.mjs` i scratchpad): 37 av 37 kontroller besto. Den dekker:
  - fanene, skjemaene og stegene
  - at inndata vises trygt (ingen HTML-injeksjon)
  - menyene med Esc og `aria-expanded`
  - ingen lagring i nettleseren og ingen informasjonskapsler
  - ingen andre nettverkskall og ingen POST
  - ingen sidelengs rulling på 1440, 1024, 800 og 390 px
  - ingen konsollfeil
- Rettet under arbeidet: et tomt ikon er lagt inn, så nettleseren ikke henter `favicon.ico`.
- Eksisterende prototyper er uendret (md5), og B2 er ikke rørt siden kl. 12:51. PRD-en og arkitekturdokumentene er ikke endret.
- Skissen er åpnet i Safari.
- Ingenting er committet.

### Åpne punkter
- Gruppen tar stilling til de åpne spørsmålene om bedriftskontoer i README-en (bruk uten konto, flere bedrifter per bruker, roller) hvis utvidelsen blir aktuell etter v1.

## 2026-11-15 kl. 13:38 — Carmen Kolstad

### Oppgave
Carmen valgte å gå videre med Design B og ba om å få innlogging og bedriftskontoer integrert som UX-demonstrasjon i en ny prototype. Den skal ha:
- «Logg inn» på introduksjonen og en egen innloggingsside
- en side for å opprette bedriftskonto
- bedriftsnavn og profil i navigasjonen når man er innlogget
- en visning av at lagrede kjøringer tilhører bedriften og deles mellom ansatte

Brukerreisen skal være Introduksjon → Logg inn / Opprett bedriftskonto → Ny kjøring → Resultat → Ukeplan → Detaljer, og det skal fortsatt gå an å gå rett til Ny kjøring uten innlogging. Alt nytt skal merkes som fremtidig og utenfor MVP. Det skal ikke lages ekte autentisering, database eller lagring, det skal ikke samles inn ekte passord, og bare fiktive data skal brukes. Ingenting skal overskrives eller committes.

### Plan
- Bygge på B2. Det var den som var åpen i Safari, og Carmen beskrev den som «Design B». Antakelsen er sagt til Carmen. Skiftet til B sine farger er bare ett designlag.
- Kopiere B2 til `cosi-mrp-b-konto.html` og legge til et designlag (`tema-konto`), to nye visninger og innloggingstilstand som bare finnes i minnet.

### Resultat
- Ny fil: `ux/demo-2026-11-16/cosi-mrp-b-konto.html`. README-en har fått en rad for den.
- **Introduksjonen:** «Kom i gang» (går rett til Ny kjøring) og «Logg inn», pluss en linje merket Fremtidig med «Opprett bedriftskonto». «Ingen innlogging» er endret til «Prøv uten innlogging».
- **`#/logg-inn`:**
  - SSO-knapp og e-postfelt med den fiktive adressen `kari@eksempel.no`, skrivebeskyttet
  - passordfeltet er deaktivert og er ikke et ekte passordfelt
  - en merknad om demonstrasjon og et sidepanel om hva bedriftskontoen gir
  - lenken «Fortsett uten innlogging»
- **`#/ny-bedrift`:** Tre steg med skrivebeskyttede, fiktive felt. Etter steget «Opprett» er brukeren innlogget og kommer til Ny kjøring.
- **Innlogget:**
  - Bedriften (Eksempel Produksjon AS) står øverst i sidemenyen, med en meny for å bytte bedrift, åpne innstillinger og invitere kolleger.
  - Profilen (Kari Nordmann, innkjøper og administrator) står nederst, med «Min profil», «Varsler» og «Logg ut».
  - Kjøringslinjen viser «Delt med Eksempel Produksjon AS».
- **Lagrede kjøringer når man er innlogget:**
  - et banner om at kjøringene tilhører bedriften, med avatarer for fire ansatte
  - «Dine kjøringer» merket «Lagret av deg · Delt med bedriften»
  - «Delt av kolleger» med to fiktive kjøringer (Ola Hansen, Ingrid Berg) som bare kan vises
- «Logg ut» fører tilbake til introduksjonen, og appen virker som før.
- Alt nytt er merket «Fremtidig».
- **Test:**
  - Grunntesten (flyten uten innlogging): 109 av 109.
  - Ny test (`test-b-konto.mjs` i scratchpad): 46 av 46. Den dekker:
    - hele flyten med innlogging til Detaljer
    - opprettelse av bedriftskonto
    - delte kjøringer og menyene
    - utlogging og «Kom i gang» uten innlogging
    - at det ikke finnes noe passordfelt
    - ingen konto- eller passorddata i nettleserlagringen, ingen eksterne kall og ingen POST
    - ingen sidelengs rulling på 390 og 800 px
    - ingen konsollfeil
- **Rettet etter visuell kontroll:**
  - Lenkene hadde nettleserens standardblå.
  - Profilmenyen på mobil ble vist uten bakgrunn inne i den vannrette menyen. Menyene er flyttet ut og plasseres nå ut fra knappen.
- B2, B, A, C, `cosi-mrp-demo.html`, v3, konsept B og datafilene er uendret (md5). PRD-en, arkitekturdokumentene og beregningsgrunnlaget er ikke endret.
- Prototypen er åpnet i Safari på `#/intro`.
- Ingenting er committet.

### Åpne punkter
- Bekreft med Carmen at B2 (lyse arbeidsflater) var riktig grunnlag og ikke den mørkere B. Hvis ikke, bytt designlag.
- Kontroller innloggingsflyten for hånd i Safari og på mobil.
