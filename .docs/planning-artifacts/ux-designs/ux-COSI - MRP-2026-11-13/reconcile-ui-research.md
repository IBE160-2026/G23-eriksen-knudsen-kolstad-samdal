---
title: Avstemming av UI-research mot DESIGN.md og EXPERIENCE.md
date: 2026-11-13
scope: bmad-ux Finalize (reconcile)
sources:
  - "{planning_artifacts}/research/reports/Brukergrensesnitt for COSI MRP.md"
  - "{planning_artifacts}/research/research_notes/Brukergrensesnitt for COSI MRP/mrp-tabell-og-datagrid.md"
  - "{planning_artifacts}/research/research_notes/Brukergrensesnitt for COSI MRP/eksepsjoner-forklaring-sammenligning.md"
  - "{planning_artifacts}/research/research_notes/Brukergrensesnitt for COSI MRP/opplasting-validering-tilgjengelighet.md"
  - "{planning_artifacts}/research/research_notes/Brukergrensesnitt for COSI MRP/design-systemer-og-layout.md"
  - DESIGN.md
  - EXPERIENCE.md
  - .memlog.md
---

# Avstemming: UI-research mot spine-dokumentene

Fila sammenligner anbefalingene i UI-rapporten og de fire notatene med DESIGN.md og EXPERIENCE.md (draft, 2026-11-13). Den skiller mellom:

- **(a)** det som er bevisst overstyrt av en beslutning i `.memlog.md`. Det krever ingen handling.
- **(b)** det som er falt bort, svekket eller motsagt uten beslutning. Det må vurderes før spine-dokumentene blir final.

Linjenumrene viser til filene slik de sto 2026-11-13 kl. 21:10. «Rapporten» er `Brukergrensesnitt for COSI MRP.md`. Notatene kalles ved filnavn.

**Oppsummering av (b):** 0 kritiske, 5 høye, 9 middels og 6 lave funn.

---

## (a) Bevisst overstyrt av brukerbeslutning

| # | Anbefaling fra researchen | Beslutning i `.memlog.md` | Status i spine |
|---|---|---|---|
| a1 | Terskler for å dempe små eksepsjoner (eksepsjoner-notatet §1, rapportens innspillstabell) | Avvist (memlog L35, FR-9–13, SM-2) | EXPERIENCE L158 |
| a2 | «Flyttet uke 8 → 9» som egen endringstype | Avvist. To linjer, Fjernet og Ny, rett under hverandre (L35) | EXPERIENCE L92, L158 |
| a3 | Kritiske deler sortert øverst i tabellen (design-notatet §2) | Avvist. Bare filteret «Vis bare kritiske deler» (L35, L36) | EXPERIENCE L94, L158 |
| a4 | Faner for Resultat / Endringer / Produksjonskapasitet (design-notatet §2) | Avvist. Ankerlenker på én side (L35, L19) | EXPERIENCE L29, L158 |
| a5 | Nøkkeltallene som tekstlinje i selve det faste toppfeltet | Tekstlinja står som statuslinje rett under toppfeltet (L23) | DESIGN L358, EXPERIENCE L89 |
| a6 | Tomme celler i stedet for 0 i inndataradene (valgfritt) | Nuller vises alltid som dempet «0» (L54) | DESIGN L368, L406 |
| a7 | Lett stegindikator (Last opp → Kontroll → Resultat) og egen kontrollside (design-notatet §2) | Startside med veiledning i tre steg. Valideringsfeil står øverst på startsiden, uten egen side (L37, L38) | EXPERIENCE L33–34 |
| a8 | «Prøv med eksempelfil» med ett klikk (opplasting-notatet §3, eksepsjoner-notatet §5) | Implisitt avvist. IA 1 fastsetter nedlasting av testeksempel 01 (L37, FR-27) | EXPERIENCE L33 |
| a9 | Ordlyden for lagring blokkert: «… Resultatet forsvinner når du lukker siden.» | Egen ordlyd er besluttet (L56) | EXPERIENCE L76 |
| a10 | «MPS» som arknavn i feilmeldinger | «Prognostiserte behov (arket MPS)» (L49) | EXPERIENCE L63, L99 |
| a11 | Dashbord eller bento med 3–4 nøkkeltallfliser | Avvist etter party-mode (L19). Lagergrafen er kuttet (L31), og researchen fant uansett ingen evidens for grafer | EXPERIENCE L157, L252 |
| a12 | Rammen skal ikke være grå med én aksentfarge (Impeccable, Operate) | Temaet «Salvie i to lag» (L32), som er i tråd med anbefalingen | DESIGN L262–270 |

**Presiseringer uten egen memlog-beslutning. Dette er ikke tap, og det krever ingen handling:**

- Fra kritiske deler-lista flyttes fokus til *cellen med eksepsjonen*, ikke til delens første celle (rapporten L74). Det er en forbedring.
- Kapasitetspanelet har ingen klikkbar forklaring i v1. Researchen kaller det en valgfri utvidelse.
- Bestillingsplan er forhåndsvalgt i radiogruppen. Notatet åpner for «det vanligste valget».

**Dette er dekket og stemmer med researchen:**

- tastaturkjernen i WAI-ARIA grid, med roving tabindex, piltaster, Home/End, Ctrl+Home/End, Enter/mellomrom og Esc med fokus tilbake
- ikke-modal `<aside>` som skyver hovedfeltet
- `role="alert"`, fokus til feiloppsummeringen og sidetittel som begynner med «Feil:»
- gruppering per ark i malens rekkefølge, sortert etter rad
- personvernsetningen ved slippsonen
- ingen toasts, og Beregn deaktiveres aldri
- ikke rødt og grønt i endringslista
- teksten for «Ingen endringer» i brettet
- U+2212 og mellomrom som tusenskille
- kapasitetsoverskrift som spørsmål og FR-34-setningen
- selvhostede skrifter
- lys modus og én fast radhøyde på 40 px

---

## (b) Falt bort, svekket eller motsagt

### Høy

#### H1. Ytelsesplanen for ~6000 tabellrader og ~90 000 celler mangler

- **Research:** Rapporten L76 sier: «Teamet bør derfor måle tidlig …». Utveiene er virtualisering med `aria-rowcount`/`aria-rowindex`, eller å slå sammen hver del til én oppsummeringslinje der eksepsjonsmarkøren fortsatt er synlig. I konklusjonen (L208, L212) er dette ett av tre problemer UX-steget må løse, og tabellen skal måles med 1000 rader før man binder seg. Se også mrp-tabell-notatet §3 og §5 (Gaps: ingen benchmark), om «Fold ut alle / Fold sammen alle».
- **Spine:**
  - EXPERIENCE L94 (Resultattabell) og L111 (Lasting) nevner NFR-5 bare for lasting.
  - DESIGN L368 legger fast strukturen: rygg med rowspan over seks rader, `<tbody>` per del og 8 px luft mellom blokkene.
  - DESIGN L346 toner inn brettene. EXPERIENCE L88 lar aktiv lenke følge rullingen.
  - Ingen fallback eller sammenslått tilstand er beskrevet.
- **Hvorfor det betyr noe:** Rygg med rowspan, `<tbody>` per del og roving tabindex er vanskelige å virtualisere i ettertid. Faller man tilbake til sammenslåtte deler, endres både utseendet og tastaturmodellen.
- **Forslag:**
  1. Legg et kort avsnitt «Ytelse» inn i EXPERIENCE › Resultattabell. Mål tidlig med en syntetisk fil på 1000 stykklisterader. Budsjettet er NFR-5 (< 3 s fra Beregn til synlig tabell).
  2. Fallback i denne rekkefølgen:
     - `content-visibility: auto` per `<tbody>`
     - virtualisering per delblokk med `aria-rowcount`/`aria-rowindex`, der roving tabindex tåler at den fokuserte cellen tas ut av DOM
     - sammenslått linje per del med beskrivelse, eksepsjonsmarkør og første uke med eksepsjon, pluss «Fold ut alle / Fold sammen alle»
  3. Beskriv den sammenslåtte tilstanden i State Patterns, så den ikke må designes under press.

#### H2. Fokus skjult bak faste lag (WCAG 2.4.11) og en motsigelse i rullemodellen

- **Research:**
  - Rapporten L74: den faste overskriften må ikke dekke cellen med fokus.
  - Opplasting-notatet §4: «Sticky table headers or banners must not hide the focused cell or link.»
  - Mrp-tabell-notatet §2: «Sticky columns cover the cells they overlap … focus order must still make sense.»
- **Spine:**
  - EXPERIENCE L88: `scroll-padding-top` lik høyden på toppfeltet og navigasjonsraden.
  - EXPERIENCE L94: ukeoverskriften og tre venstre kolonner står fast, og tabellen blar sideveis i sitt eget område.
  - EXPERIENCE L146: faste lag dekker aldri fokus.
  - DESIGN L338: kolonnebreddene 76 + 132 + 196 = 404 px.
- **Problem:**
  1. `scroll-padding-top` på siden dekker bare toppfeltet. Den dekker verken tabellens egen faste ukeoverskrift eller de faste kolonnene på 404 px når cellen ligger til venstre i det sideveis rullende området.
  2. Et område med `overflow-x: auto` blir rullecontainer for `position: sticky`. Da står ukeoverskriften ikke fast mot vinduet når *siden* rulles loddrett, med mindre området også har fast høyde og rulles loddrett selv. Kravet «ukeoverskriften står fast» (NFR-8) og «blar sideveis i sitt eget område» går altså ikke sammen uten et valg.
  3. På 1366 × 768 tar toppfeltet 108 px, brettoverskriften og tabellhodet kommer i tillegg, og med panelet åpent er hovedfeltet 400 px smalere. Da er det lite synlig areal igjen.
- **Forslag:**
  1. Velg rullemodell i EXPERIENCE. Anbefalt er at tabellområdet ruller i begge retninger med høyde `100vh − toppfelt − brettoverskrift` og en navngitt region.
  2. Sett `scroll-padding-top` lik høyden på tabellhodet og `scroll-padding-left` lik 404 px på tabellområdet.
  3. Ved hvert piltrykk kalles `scrollIntoView({block: 'nearest', inline: 'nearest'})`.
  4. Legg inn en akseptsjekk: 1366 × 768 med panelet åpent, Ctrl+End og Ctrl+Home, og cellen med fokus er hele tiden synlig.

#### H3. Fremskyndet mottak er svekket til én eksempelsetning

- **Research:** Rapporten L91 og konklusjonen L209 kaller dette «stedet der en planlegger uten MRP-bakgrunn mest sannsynlig stopper opp». Det er ett av tre problemer UX-steget skal løse.
- **Spine:** EXPERIENCE L95 (Forklaringspanel) og UJ-2 trinn 6 (L182) har én setning om gassfjær.
- **Problem:** Etter PRD FR-6/FR-7 (prd.md L214–221) og ordbanken (L85) viser forventet lagerbeholdning for gassfjær −40 i uke 3. Samtidig er nettobehovet 0, og det finnes ingen bestillingsforslag. Planlagte mottak viser 100 i uke 4, men regnes med som 0 der. Flere celler trenger altså forklaringen, ikke bare cellen med eksepsjonen. Mrp-tabell-notatet §1 sier dessuten at negativ forventet beholdning er nettopp «need to act»-signalet nybegynnere lærer å se etter. Spine sier ikke hvilke celler som får teksten, og har ingen generell mal.
- **Forslag:**
  1. Lag en mal i EXPERIENCE: «Mottaket på {antall} står i uke {u}, men er regnet med fra uke {t}. Derfor er forventet lagerbeholdning {x} i uke {t}, men det trengs ingen ny bestilling.»
  2. Fastsett hvilke celler som bruker malen: forventet lagerbeholdning og nettobehov fra uke t til u − 1, og planlagte mottak i uke u.
  3. Lag 4 lenker til ordbankbegrepet «Fremskyndet mottak».
  4. Vurder et diskret tegn med tilgjengelig navn i mottakscellen, for eksempel «regnet med fra uke 3». Prøv det mot SM-C3 i prøvetesten.

#### H4. Feiloppsummeringen mangler strukturfeil først og sammenslåing av systematiske feil

- **Research:** Opplasting-notatet §2, Inferences pkt. 3 og «How many errors to show»:
  - Strukturfeil står i en egen gruppe først, og verdikontrollen stoppes for et ark med ødelagt struktur.
  - Systematiske feil slås sammen, for eksempel «Kolonnen «Uke» mangler i arket Planlagte mottak» i stedet for 50 radfeil.
  - Grupper med mange feil foldes, og man unngår en vegg av tekst.
  - GOV.UK-malen «The selected file must use the template».
- **Spine:** EXPERIENCE L99 (Feiloppsummering) har bare gruppering per ark og sortering etter rad. DESIGN L389 legger kortene per ark to i bredden. UJ-4 (L198–207) er nettopp en kopiert fil, der følgefeil er sannsynlige.
- **Forslag:**
  1. Legg en gruppe «Fila følger ikke malen» øverst. Den samler manglende ark, manglende eller feilstavet kolonneoverskrift og tomt ark. Ark med strukturfeil verdikontrolleres ikke.
  2. Slå sammen like feil i samme kolonne med radintervall, så FR-4 «alle feilene» fortsatt er oppfylt, for eksempel «Planlagte mottak, rad 4–53, Uke: må være et heltall (50 rader).».
  3. En gruppe med mer enn ~20 linjer får antall og kan foldes (`<details>`).

#### H5. Gjenopplasting etter feil: filvalget må nullstilles

- **Research:** Opplasting-notatet §1: «Re-upload must keep working. After an error, keep the uploader active and clear the input value, so selecting the same filename again fires `change`.»
- **Spine:**
  - EXPERIENCE L99: under feiloppsummeringen står «Last opp den rettede fila» med navnet på forrige fil og slippsonen.
  - L96: «Ett slipp erstatter forrige valg».
  - UJ-4 trinn 5 (L204): Kari retter fila i Excel og laster opp samme fil.
- **Problem:** Velger hun samme filnavn med «Velg fil», utløses ikke `change`. Står den gamle fila fortsatt som valgt og hun trykker Beregn, leses en utdatert fil. I Chrome kan det også gi en lesefeil når fila er endret etter at den ble valgt. Det siste er bakgrunnskunnskap og er ikke kildebelagt i notatet. Dette rammer klimakset i UJ-4.
- **Forslag:**
  1. Etter valideringsfeil og feil i hele fila nullstilles `input.value` og valgt fil.
  2. Forrige filnavn vises bare som informasjon («Forrige fil: …»), ikke som valgt.
  3. Beregn uten ny fil gir «Velg den rettede fila først.».
  4. Skriv dette inn i EXPERIENCE › Slippsone og i State Patterns › Valideringsfeil.

### Middels

#### M1. Forklaringspanelet: kunngjøring, tastaturvei inn og plassering

- **Research:**
  - Rapporten L93: `aria-live="polite"`, fokus blir i tabellen.
  - Mrp-tabell-notatet §4 Inferences: «… or offer a keyboard shortcut and a "Gå til forklaring" link to move focus».
  - Rapporten L86 og eksepsjoner-notatet §2 pkt. 3: lenkene i lag 3 kan også vise kildecellen (som Trace Precedents).
- **Spine:** EXPERIENCE L95 og L145 (`aria-live="polite"` på panelet) og L146 (Tab-rekkefølgen er «… seksjonene i rekkefølge, så panelet»).
- **Problem:**
  1. Live-region på hele panelet leser fire lag for hvert piltrykk, og køen fylles opp.
  2. Det finnes ingen kort vei fra cellen til lenkene i lag 3. Med «Begge» ligger kapasitetspanelet mellom tabellen og panelet i Tab-rekkefølgen.
  3. Panelets loddrette plassering er ikke beskrevet. Står Kari langt nede i tabellen, må panelet stå fast under toppfeltet og rulle selv.
  4. Lenker i lag 3 har ingen «tilbake», og det står ikke om valgt celle følger med.
- **Forslag:**
  1. Live-regionen skal bare kunngjøre overskriften og lag 1, med en kort forsinkelse (~300 ms).
  2. Legg inn en tast eller lenke «Gå til forklaringen» som flytter fokus inn i panelet. Esc i panelet setter fokus tilbake til cellen.
  3. Panelet får `position: sticky; top: toppfelt` og egen rulling.
  4. Lag 3-lenker til en annen celle flytter valgt celle dit. Ellers får de «Tilbake til …».

#### M2. «Utregning» i lag 2 er tegnet som en sum, men formlene er ikke additive

- **Research:** Rapporten L85 bruker to linjer: «Disponibel beholdning = 80 + 0 − 100 = −20. Nettobehov = maks(0, 30 − (−20)) = 50». Eksepsjoner-notatet §2 (Evaluate Formula) beskriver steg for steg. Rapporten L182 foreslår at utregningen er appens særpreg.
- **Spine:** DESIGN L370: rutenett med etikett til venstre, tall til høyre og «en strek i `{colors.edge}` over summen».
- **Problem:** Nettobehov er `maks(0, SS − disponibel)`. Frigivelse er ledetidsforskyvning, FR-25 runder av til partistørrelse, og fremskyndet mottak regner nettobehovet om igjen (prd.md L220). Ingen av disse er en kolonnesum.
- **Forslag:** Skriv i DESIGN › Forklaringspanel at lag 2 er en ordnet liste med steg, ett per linje med tallene satt inn. Summeoppsettet brukes bare til additive steg. Bestem hvordan `maks(…)` og «regnes på nytt» vises.

#### M3. Hvilken rad eksepsjonsmarkøren står i, er ikke bestemt

- **Research:** Rapporten L101 sier én diskret markør per celle med eksepsjon. Mrp-tabell-notatet §1 Inferences begrenser fremhevingen til én eller to rader. PRD L333 bruker «En celle for en uke og del».
- **Spine:** DESIGN L368 (eksepsjonsmarkøren) og EXPERIENCE L93 («flytter fokus til cellen med eksepsjonen»). Ingen av dem sier hvilken av de seks radene.
- **Forslag:** Lag en kort tabell i EXPERIENCE med én fast rad per eksepsjonstype. Et forslag:
  - Bestilling forsinket og Bruk av sikkerhetslager → nettobehov eller forventet lagerbeholdning
  - Mottak forsinket → nettobehov i uke t
  - Kanseller mottak → planlagte mottak i mottaksuka
  - Ledetid overskrider horisont → ryggen
  
  Det må besluttes, og kritiske deler-lista og endringslista bruker samme mål.

#### M4. Sammenligningen: statuslinja mister nyansen, og endringslinjene lenker ikke

- **Research:**
  - Rapporten L111: «Ingen endringer» bør si at andre endringer kan være skjult.
  - Eksepsjoner-notatet §3: hver linje lenker til delen eller forklaringen (IBM-pilene), og begge versjoner identifiseres med filnavn og tidspunkt.
- **Spine:**
  - EXPERIENCE L116: brettet har nyansen, men statuslinja sier «ingen endringer siden forrige kjøring».
  - L92: «[ASSUMPTION: linjene lenker ikke til Resultattabell]».
  - DESIGN L364: overskriften har bare tidspunkt.
  - Brett-teksten nevner bestillingsforslag og eksepsjoner, men ikke deler (FR-20).
- **Forslag:**
  1. Statuslinja sier «ingen endringer i bestillingsforslag eller eksepsjoner».
  2. Brett-teksten blir «Ingen endringer i bestillingsforslag, eksepsjoner eller deler siden forrige kjøring (13.11 kl. 07:31). Endringer i resultattabellen som ikke påvirker dem, vises ikke.»
  3. Linjer med «Ny» eksepsjon og «Ny/Endret» bestillingsforslag får samme handling som kritiske deler-lista. «Borte» og «Fjernet» er fortsatt tekst.
  4. Vurder filnavnet i overskriften.

#### M5. Ordlyden i kapasitetspanelet: sikkerhetslageret og årsakene

- **Research:**
  - Rapportens innspillstabell (L194): «UX-oppgaven er å forklare regelen i panelet» (ledig beholdning = maks(0, lager − SS)).
  - Eksepsjoner-notatet §4: «state in the explanation whether safety stock counts as available». Den største risikoen er at kapasitet forveksles med planlagt produksjon.
- **Spine:**
  - EXPERIENCE L219–228 sier ingenting om at sikkerhetslageret holdes av.
  - Forslaget til hjelpetekst i L97, «Hvor mange ferdigprodukter lageret og planlagte mottak rekker til», tar ikke med SS eller ledetid.
  - Årsaken har to ordlyder: «for lite på lager og i planlagte mottak» (UJ-5, L214) og «(lager)»/«(ledetid)» (L226).
- **Forslag:**
  1. Legg en setning under FR-34-setningen: «Sikkerhetslageret holdes av og regnes ikke som ledig.»
  2. Hjelpeteksten blir «Hvor mange ferdigprodukter som kan være ferdige uke for uke, ut fra ledig lager og planlagte mottak.»
  3. Bruk ett ordforråd for årsaken, (lager) eller (ledetid), også i UJ-5.

#### M6. Opplastingen: talestyring, «Velg fil» og feil i hele fila

- **Research:**
  - Rapporten L127 og opplasting-notatet §1: Dragon-brukere fikk ikke aktivert *native filfelt* med stemmen. Løsningen er en synlig, ekte knapp.
  - Ikke bruk `required`, og hold knappeteksten kort.
  - Tekst som «eller» og «dra og slipp» er `aria-hidden` og kan ikke bære instruksjoner (Aksel).
  - Fokus går tilbake til knappen etter fildialogen (Carbon).
  - Etiketten starter med «Last opp».
  - Filnivåfeil omfatter «passordbeskyttet» og «må bruke malen».
- **Spine:**
  - EXPERIENCE L135 begrunner med at «bare dra og slipp ikke virker med talestyring». Det er en annen begrunnelse, og den treffer ikke risikoen.
  - L96 sier «Begge gir samme filvelger med `accept`». Det er uklart, siden et slipp ikke åpner noen filvelger.
  - L113 mangler passordbeskyttet fil.
- **Forslag:**
  1. «Velg fil» er en ekte `<button>` med synlig navn som er lik det tilgjengelige navnet, og den åpner et skjult `<input type="file" accept=".xlsx">`. Fokus går tilbake til knappen.
  2. Instruksjonen står i synlig hjelpetekst, ikke i «Slipp … her».
  3. Rett formuleringen til «Begge går gjennom samme kontroll av filtype og innhold».
  4. Legg passordbeskyttet fil og «fila følger ikke malen» inn i NFR-9-lista eller i H4-gruppen.

#### M7. Fokus og kunngjøring ved sidebytte

- **Research:** Opplasting-notatet §5:
  - Etter en vellykket beregning vises resultatet med en overskrift og kunngjøres med `role="status"` («Beregning ferdig: …»).
  - Det finnes én polite region fra sidelasting, og den gjenbrukes.
  - En region som settes inn senere, blir ikke kunngjort.
- **Spine:** EXPERIENCE L89 og L145. Regionen står «ved Beregn» på startsiden, og statusmeldingen på resultatsiden «kunngjøres én gang gjennom statusregionen» (L100). Ingenting er sagt om fokus eller sidetittel etter Beregn, etter «Last opp ny fil» eller etter Slett.
- **Problem:** Forsvinner regionen på startsiden når resultatsiden vises, blir «lagring blokkert» aldri kunngjort. Kari med skjermleser vet heller ikke at beregningen er ferdig.
- **Forslag:**
  1. Bruk én statusregion på appnivå, utenfor innholdet som byttes.
  2. Etter en vellykket beregning flyttes fokus til resultatsidens overskrift (`tabindex="-1"`). `document.title` blir «Kontorstol Pro (100-001) – Resultat – COSI - MRP», og regionen kunngjør «Beregningen er ferdig: 12 bestillingsforslag, 4 kritiske deler.».
  3. «Last opp ny fil» gir fokus på startsidens h1.

#### M8. Impeccable: PRODUCT.md og registeret «Operate» er ikke etablert

- **Research:** Rapporten L167: kjør `/impeccable init` med PRD-en. PRODUCT.md skal ha føringene ikke farge alene, ingen peking, fast rekkefølge, norsk, bare PC og SM-C2/C3. *Alle* flater, også startsiden, skal ha registeret «Operate», ikke «Persuade».
- **Spine:** Verken DESIGN.md eller EXPERIENCE.md nevner PRODUCT.md eller registeret, og det finnes ingen PRODUCT.md i repoet. Impeccable er brukt underveis (memlog L43).
- **Problem:** Startsiden (36 px display, oppsett fra «Objektside») er den flaten som lettest trekkes mot et landingsside-uttrykk. Impeccable-kommandoene ser ikke føringene.
- **Forslag:** Skriv én linje i DESIGN › Brand & Style: «Register: Operate på alle flater, også startsiden.» Legg til et åpent punkt om å lage PRODUCT.md med føringene over før `shape`/`craft`.

#### M9. Prototype, måling og testdekning før bygging

- **Research:**
  - Rapporten L212: lag en prototype av forklaringspanelet for de fire kritiske delene i testeksempel 01, og mål tabellen med 1000 rader før valget tas.
  - Rapporten L180: `audit` erstatter ikke en manuell test med bare tastatur *og med skjermleser*.
  - Innspillstabellen L201: testeksempel 01 utløser ikke «Kanseller mottak».
- **Spine:** EXPERIENCE L143 (manuell test med bare tastatur) og L232–246 (Brukertest). Ingen prototype eller måling er nevnt, og det står ikke hvordan forklaringene for alle fem eksepsjonstypene prøves (FR-18, testbar).
- **Forslag:**
  1. Legg en kort liste «Før bygging» inn i Brukertest: prototype av panelet for de fire kritiske delene (inkludert gassfjær, se H3), prøvd på 1–2 personer; ytelsesmålingen fra H1; og en kort sjekk av grid og panel med NVDA.
  2. Bekreft med SMR om skjermleser bevisst er utelatt (memlog L57 nevner bare tastatur).
  3. Pek på testeksempel 03 eller 04 for «Kanseller mottak» i prøvetesten.

### Lav

#### L1. Detaljer i tastaturmodellen

- **Research:**
  - APG grid (mrp-tabell-notatet §4): Page Up og Page Down flytter et antall rader som utvikleren velger.
  - Hver celle uten overskrift skal kunne få fokus.
  - Opplasting-notatet §4: `<caption>` og et navngitt rulleområde.
- **Spine:** EXPERIENCE L133 og L147, og DESIGN L368 (ryggen med rowspan, hintet «Klikk et tall for forklaring»).
- **Forslag:**
  - PgUp og PgDn går til forrige eller neste del. Det er nyttig med 1000 deler.
  - Venstre fra et radnavn går til ryggen. Opp og Ned fra ryggen går til forrige eller neste del.
  - Tabellen får `<caption>` med ferdigprodukt og horisont.
  - Hintet blir «Velg et tall (klikk eller Enter) for forklaring».

#### L2. Små visuelle avvik i Resultattabell

- **Research:**
  - Rapporten L66 og NN/g: en tynn skygge eller kant der de faste kolonnene slutter.
  - Rapporten L64: rad-hover i stedet for sebrastriper, og nivåtekst «.1»/«..2» med innrykk fra ordlisten.
- **Spine:** DESIGN L344 (box-shadow bare til fokus og valg) og L368 («nivå og type» uten notasjon, ingen hover-markering).
- **Forslag:**
  - Gi høyre kant av de faste kolonnene en strek på 1–2 px i `{colors.edge}`, som et alternativ til skygge.
  - Ryggen viser nivået med ordlistens notasjon.
  - Bestem om en svak hover på raden er tillatt. Den åpner ingenting, så den er forenlig med FR-18.

#### L3. Tallformat

- **Research:** Mrp-tabell-notatet §2: norsk tallformat med mellomrom som tusenskille og U+2212. Innspillstabellen i rapporten L199: testene må sjekke verdiene, ikke det som vises.
- **Spine:** DESIGN L328 og EXPERIENCE L80.
- **Forslag:**
  - Bruk hardt mellomrom (U+00A0 eller U+202F, slik `Intl.NumberFormat('nb-NO')` gir), så tall ikke brytes over to linjer.
  - Fortegn i differanser skrives «(+75)» og «(−75)».
  - Uke «–» (tankestrek) kan forveksles med minus «−». Gi den et tilgjengelig navn, «hele delen», eller bruk teksten «hele delen» i kritiske deler-lista.
  - Eksporten beholder tallverdier og ikke formaterte strenger.

#### L4. Detaljer i feiloppsummeringen

- **Research:** Opplasting-notatet §2:
  - Et rettehint der det ikke er åpenbart, for eksempel «Første uke i horisonten er uke 1.».
  - Excel-radnummeret, ikke dataradens nummer, og gjerne celleadressen.
  - Fokus på nytt når innholdet endres (Designsystemet).
  - `role="alert"` på et indre element (en JAWS-feil hos GOV.UK).
  - «Kopier/Last ned feilliste» etter v1.
- **Spine:** EXPERIENCE L71, L99 og «Senere» (L248–254).
- **Forslag:** Legg til «rettehint der det trengs» og «rad = Excel-radnummer» i Voice and Tone. Legg til fokus ved ny mislykket opplasting. Legg «Kopier feilliste» inn i «Senere».

#### L5. Vercel Web Analytics og Speed Insights

- **Research:** Rapporten L152: de bør ikke slås på uten en vurdering mot NFR-4, fordi de er datainnsamling via tredjepart.
- **Spine:** Ikke nevnt. EXPERIENCE L23 (Data) og løftet i slippsonen (L73) forutsetter at ingenting sendes.
- **Forslag:** Legg til i Foundation › Data: «Ingen analyse eller måling fra tredjepart i v1.» Alternativt føres det som et åpent punkt til arkitekturen.

#### L6. Lista over anti-mønstre mangler noen punkter fra researchen

- **Research:**
  - Rapporten L68: fortegn i radnavn som hos Odoo («− Bruttobehov», «= …») villeder.
  - Rapporten L58: shadcn Sheet og Drawer er modale som standard.
  - Rapporten L50: canvas-grid og betalte grid-motorer, og UI5.
  - Rapporten L76 og mrp-tabell-notatet: utvidbare rader som standard.
  - Rapporten L95: introveiviser og karusell.
- **Spine:** EXPERIENCE L151–159 og DESIGN L397–412.
- **Forslag:** Legg til fire linjer under «Avvist»:
  - fortegn i radnavnene
  - Sheet eller Drawer for forklaringspanelet
  - canvas-grid eller betalt grid-motor
  - introveiviser eller karusell på startsiden
