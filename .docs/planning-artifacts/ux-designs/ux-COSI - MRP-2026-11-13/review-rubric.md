# Spine Pair Review — COSI - MRP

## Overall verdict

**Adekvat.** Spine-paret holder som kontrakt for arkitektur og story-dev. Alle 69 token-referanser finnes, alle åtte kildene finnes, UJ-1–UJ-5 har ordrett samme navn som i PRD-en og hver sin Key Flow med klimaks, og oppførselen er beskrevet svært grundig (tastaturmodell, fokus, kunngjøringer, feiltilstander). Det alvorligste funnet er fokusringen: `{colors.ring}` er ikke synlig nok på toppfeltet og navigasjonsraden, og kontrasttabellen nevner ikke disse parene. Ellers gjenstår noen beslutninger som bør låses før byggingen: hvilken rad eksepsjonsmarkøren står i (fortsatt merket `[ASSUMPTION]`), to kolonner med forklaringspanelet åpent, oppførsel ved reload og Tilbake, samt avvik mot ordbanken. At det ikke finnes mockups ennå, er ventet. Det samme gjelder `[OPEN]` for kapasitetspanelet.

## 1. Flow coverage — adekvat

Sjekket: UJ-1–UJ-5 fra PRD §2.3 mot Key Flows (Kari er protagonist, stegene er nummerert, hver flyt har **Klimaks** og Feil/Unntak), og FR-1–FR-34 mot flyter, mønstre og tilstander. Alle fem reisene er dekket. Navnene er ordrette, og tallene stemmer med PRD-ens fortelling (175/50 forfalt, 130 → 205, 30 i uke 5 og 35 fra uke 7).

### Findings
- **medium** Trinn 5 (FR-24–FR-26, fast partistørrelse) står under «Senere» med teksten «Utsatt fra v1». PRD §7.1 regner trinn 5 som «Med i v1» (kuttes først), og §4.7 planlegger det som et eget, senere epic. Det finnes ingen UX for valideringsfeil i kolonnen «Partistørrelse» (FR-24) eller for bestillingsregelen i eksporten (FR-26) (EXPERIENCE.md › Senere). *Fix:* Skriv at trinn 5 er med i v1, men kuttes først, og at UX-en for det lages i sitt eget epic. Behold plasseringen i ryggen og lag 2 som reservert plass, og nevn FR-24 og eksporten i FR-26.
- **low** UJ-3 har bare Unntak (Slett lagret kjøring, uendret fil) og ingen feilvei. Hva skjer hvis den nye fila har valideringsfeil, eller hvis lagringen er blokkert så Endringer aldri vises? (EXPERIENCE.md › Key Flows › UJ-3). *Fix:* Legg til én linje: «Feil: valideringsfeil → UJ-4; lagring blokkert → ingen Endringer, statusmelding.»
- **low** FR-18 krever at forklaringen av bruttobehov for *alle* deler under ferdigproduktet viser hvilke overordnede deler behovet kommer fra, og antallet per enhet. Spinen sier dette bare om felles deler (EXPERIENCE.md › Component Patterns › Forklaringspanel, «For bruttobehov til en felles del …»). *Fix:* Gjør regelen generell for lag 3, med antall per enhet. Felles del blir da bare tilfellet med flere bidrag.

## 2. Token completeness — adekvat

Sjekket: alle tokener i frontmatter (47 farger, 11 typografiroller, 3 radier, 19 avstander, 22 komponenter). Det er 64 unike `{path}`-referanser i DESIGN.md og 5 i EXPERIENCE.md, og alle finnes. Alle farger er gyldig sekssifret hex. Appen har bare lys modus etter beslutning, så det trengs ingen lys/mørk-par. Stikkprøver av kontrasttabellen stemmer (foreground/card 15,2, edge/band 3,5, brass-line/band 4,0, muted-foreground/card 6,5).

### Findings
- **high** Fokusringen `{colors.ring}` (#7D5B1E) gjelder «alle elementer», men får bare **1,93:1 på `topbar`** og **1,52:1 på `navrow`**. Kravet for ikke-tekst er 3:1 (WCAG 1.4.11/2.4.7). Ankerlenkene, Eksporter til Excel, Last opp ny fil og Slett lagret kjøring står alle på disse flatene. Kontrasttabellen har ikke parene, og fargen på avstanden (ring-offset) er ikke definert (DESIGN.md › Components › Knapper «Fokus på alle elementer …»; Colors, kontrasttabellen; EXPERIENCE.md › State Patterns › Fokus). *Fix:* Lag tokenet `topbar-ring`, for eksempel lys messing #C9A862 (5,3:1 på topbar og 4,2:1 på navrow), eller definer ring-offset i en lys farge. Legg parene til i tabellen.
- **medium** Flere skriftstørrelser i prosaen har ikke token: 20/28 vekt 300 (slippsone), 17/24 (etiketten i radiogruppen), 17 px og 11/28 luft (Beregn), 18/24 (arknavn i feiloppsummeringen) og 17/26 (steg i lag 2). Det gjelder også 9/16 px innvendig luft i knapper, sirkelen på 20 px og ikonet på 24 px (DESIGN.md › Components › Slippsone, Radiogruppe, Knapper, Feiloppsummering, Forklaringspanel). Den som bygger, må finne på tokener selv. *Fix:* Legg dem inn som typografiroller (for eksempel `drop-hint`, `option-label`, `sheet-heading`, `panel-step`) og avstandstokener, eller bruk eksisterende roller.
- **low** Noen par som bærer innhold, står ikke i kontrasttabellen, selv om alle består: `topbar-muted` på `navrow` (antallene, 5,0), `exception-critical`/`-warning` på `band` (merket «Kritisk» i ryggen, 5,5/5,0), `exception-critical` på `background` (statuslinja, 6,1) og `foreground` på `exception-*-soft`/`status-info-soft` (12,7–13,2) (DESIGN.md › Colors). *Fix:* Legg dem til i tabellen.
- **low** Bevegelse er skrevet som rå verdier i prosaen (260 ms, `cubic-bezier(.2,.7,.2,1)`, 8 px inntoning), og EXPERIENCE.md viser til «tidene i DESIGN.md» (DESIGN.md › Elevation & Depth). *Fix:* Valgfritt: legg dem i `components.forklaringspanel` og `components.brett` eller som en `note`, så de kan hentes ut maskinelt.

## 3. Component coverage — adekvat

Sjekket: alle navngitte elementer i begge filene mot DESIGN.md › Components (frontmatter og prosa) og EXPERIENCE.md › Component Patterns. Femten elementer har rader i begge filene med faktiske regler, og navnene er like i begge.

### Findings
- **medium** **Veiledning** på startsiden har ingen rad i noen av filene. Det gjelder de tre stegene med nedlasting av Excel-malen og testeksempel 01 (FR-27, UJ-1 trinn 2 og 5, prøvetesten). Det står ikke om nedlastingen er knapp eller lenke, hva filene heter eller hva stegene sier (EXPERIENCE.md › IA › Startside; State Patterns › Første besøk; DESIGN.md › Layout «Veiledningen står øverst»). *Fix:* Legg til raden «Veiledning» i begge filene: hvordan den ser ut, nedlastingselementene og teksten i de tre stegene, inkludert setningen fra FR-27 om ett ferdigprodukt per fil.
- **low** Ordliste-visningen i panelet har oppførsel (tilbakelenke, valgt celle beholdes), men ingen visuell spesifikasjon: overskrift, hvordan en oppføring ser ut og hvor «Tilbake til forklaringen» står (DESIGN.md › Forklaringspanel). *Fix:* Legg til to setninger under Forklaringspanel.
- **low** «Eksport» har en rad bare i EXPERIENCE.md. Den mangler i DESIGN.md, og formateringen av eksportarkene er ikke nevnt (EXPERIENCE.md › Component Patterns › Eksport). *Fix:* Skriv i DESIGN.md › Components at eksporten ikke har noen visuell spesifikasjon, og at arkformatet bestemmes i arkitekturen.
- **low** Noen små elementer mangler en visuell spesifikasjon eller en nøkkel i frontmatter: «lenkeknapp i toppfeltet», hopplenken «Gå til forklaringen» (vises ved fokus), tegnforklaringen under Resultattabell, lenkene «Vis alle uker / Vis alle deler», «Sammenslått visning» og tegnet for fremskyndet mottak som skal prøves (DESIGN.md › Components; EXPERIENCE.md › Interaction Primitives, State Patterns). *Fix:* Gi hvert element én linje i DESIGN.md. Elementer som skal prøves, merkes som det.
- **low** Kritiske deler-liste sier ikke hvilket ikon og hvilken farge raden får når delen har eksepsjoner på begge nivåene, eller hvordan flere uker vises. Ryggen har regelen «mest alvorlige nivå», men lista har den ikke (DESIGN.md › Kritiske deler-liste; EXPERIENCE.md › Kritiske deler-liste). *Fix:* Bruk regelen fra ryggen på lista, og skriv at lista viser den tidligste uka (eller alle ukene).

## 4. State coverage — adekvat

Sjekket: hver flate i IA-tabellen mot State Patterns. Startsiden, valideringsfeil, feil i hele fila (seks varianter), lasting, første kjøring, «Ingen endringer», tomme seksjoner, filtre uten treff, lagring blokkert, bekreftelse og fokus er godt dekket. Tilstander for offline og manglende tilgang gjelder ikke (alt skjer lokalt, én bruker).

### Findings
- **medium** Det står ikke hva som skjer ved **reload eller Tilbake i nettleseren** på resultatsiden. Startsiden og resultatsiden bytter innhold på samme side, så det er uklart om URL-en endres, om Tilbake går til startsiden og om reload viser den lagrede kjøringen eller startsiden. Arkitekturen trenger svaret for å velge ruting (EXPERIENCE.md › IA; State Patterns). *Fix:* Legg til to rader i State Patterns, for eksempel «Reload: startsiden, resultatet vises ikke på nytt» og «Tilbake: …».
- **medium** DESIGN sier at Endringer og Kritiske deler «**kan** stå side om side i to like kolonner». Det står ikke når de gjør det, eller hva som skjer på 1366 px med forklaringspanelet åpent (cirka 918 px igjen til hovedfeltet) (DESIGN.md › Layout & Spacing; EXPERIENCE.md › State Patterns › Forklaringspanelet åpent). *Fix:* Bestem regelen, for eksempel «side om side når hovedfeltet er ≥ X px, ellers stablet».
- **medium** Kapasitetspanelet har ingen egne tilstander: 0 i alle uker, ingen begrensende del, mange uker (rulling og faste kolonner?) og hvordan det oppfører seg på tastaturet uten klikkbar forklaring. Dette er kjent `[OPEN]` (EXPERIENCE.md › Produksjonskapasitet (trinn 4); DESIGN.md › Kapasitetspanel). *Fix:* Ta det med i kapasitetsskissen.
- **low** «Bare produksjonskapasitet» sier at «Slett lagret kjøring» vises likevel. Det står ikke hva som gjelder når det ikke finnes noen lagret kjøring for ferdigproduktet, eller hvor statusmeldingen (slettet eller lagring blokkert) står, når siden ikke har statuslinje (EXPERIENCE.md › State Patterns › Bare produksjonskapasitet; Statusmelding «under statuslinja»). *Fix:* Skriv at lenken bare vises når det finnes en lagret kjøring, og at statusmeldingen står øverst i hovedfeltet når statuslinja mangler.
- **low** Det finnes ingen tilstand for eksport som feiler (fila kan ikke bygges, eller nedlastingen blir blokkert). NFR-9 krever en forståelig melding (EXPERIENCE.md › Component Patterns › Eksport). *Fix:* Legg til en tekst for statusmeldingen.

## 5. Visual reference coverage — tynn (ventet på dette tidspunktet)

Sjekket: `mockups/` og `wireframes/` finnes ikke, og `imports/` er tom. Begge filene sier én gang at spine-dokumentene gjelder ved konflikt («Visuelle referanser legges til ved Finalize; ved konflikt gjelder spine-dokumentene.»). Nøkkelskjermene lages etter denne gjennomgangen, så kategorien er ikke vurdert som brutt bare av den grunn.

### Findings
- **low** Det finnes ingen visuelle referanser å lenke til ennå. Foundation sier hvilke nøkkelskjermer som tegnes først, men ikke hvilke filnavn de får eller hvilken seksjon de illustrerer (EXPERIENCE.md › Foundation › Omfang). *Fix:* Ved Finalize: lenk hver mock i den seksjonen den illustrerer, med «→ Referanse: `mockups/…` (viser …)».
- **low** Prosaen viser til bilder som ikke kan åpnes: «lånt fra retning 4», «retning 5 viste det ikke», «ikke tegnet i skissene», «Mockenes «Filen …» rettes» og «Impeccable-gjennomgangen av utkastene». Filene ligger bare i `.working/` og er ikke lenket (DESIGN.md › Layout & Spacing, Slippsone; EXPERIENCE.md › Component Patterns › Toppfelt; Voice and Tone; Inspiration). *Fix:* Lenk `.working/direction-4-objektside.html` og `direction-5-lag-paa-lag.html` som historiske referanser, eller fjern henvisningene.

## 6. Bloat & overspecification — adekvat

Sjekket: px-mål der tokener allerede dekker det, gjentakelse fra kildene, prosa der en tabell ville passet bedre, og seksjoner ingen bruker etterpå leser.

### Findings
- **medium** Seksjonen **Brukertest** er ingen UX-kontrakt for arkitektur eller story-dev. Den inneholder testprosedyre, introduksjonstekst, oppgavelapper og fasitsvar som venter på gruppas godkjenning, og den vil derfor endre seg uavhengig av spinen. Den gjentar også PRD §8.1 og SM-3 (EXPERIENCE.md › Brukertest). *Fix:* Flytt den til en egen fil, for eksempel `planning-artifacts/brukertest-2026-12.md`, og lenk til den. Behold bare kolonnen «Flater som skal bære den» som krav i spinen.
- **low** Noe er gjentatt fra kildene. «Opplysninger som alltid skal med» gjentar FR-9–FR-12 og FR-29, Eksport gjentar FR-22 og FR-23, og Feiloppsummering gjentar regler fra FR-2 og V-F06 (EXPERIENCE.md › Voice and Tone › Eksepsjonsmeldinger; Component Patterns › Eksport, Feiloppsummering). *Fix:* Behold eksemplene og ordlyden, og vis til FR-nummeret i stedet for å gjenta lista.
- **low** Noe historikk er ikke knyttet til en beslutning: «Det var SMRs første ønske … party-mode», «Disse verdiene erstatter 8 px fra fargetemaet», tabellen «Behov fra Discovery», «funn fra Impeccable-gjennomgangen» og råverdier gjentatt ved siden av tokenene («`{rounded.lg}` (14 px)») (EXPERIENCE.md › IA, Inspiration; DESIGN.md › Shapes). *Fix:* Flytt historikken til memlog, og fjern verdiene som står i parentes ved tokenene.
- **low** Flere celler i Component Patterns har 150–250 ord (Forklaringspanel, Feiloppsummering, Slippsone, Endringsliste). Det gjør det vanskelig å hente ut regel for regel (EXPERIENCE.md › Component Patterns). *Fix:* Del dem opp i `###`-underseksjoner med punktlister, slik «Resultattabell: rulling og ytelse» allerede gjør.

## 7. Inheritance discipline — adekvat

Sjekket: at kildene i `sources` finnes (8/8), at UJ-navnene er ordrette (5/5), at ordbruken er lik i spinene og i `.docs/ordbank.md`, at komponentnavnene er like, og at token-referansene i EXPERIENCE.md finnes i DESIGN.md (5/5).

### Findings
- **medium** Ordbanken og spinene er uenige om **Statusmelding** og **Statuslinje**. Ordbanken gir «Leser fila …» som eksempel på statusmelding og sier at statuslinja står «øverst på resultatsiden». I spinene vises «Leser fila …» i statuslinja på *startsiden*, og statusmeldingen brukes bare når lagringen er blokkert eller den lagrede kjøringen er slettet (ordbank.md › Brukergrensesnitt; EXPERIENCE.md › Component Patterns › Statuslinje, Statusmelding). Den som bygger, kan velge feil komponent. *Fix:* Rett ordbanken etter spinene.
- **medium** **Forfalt mengde** vises som «175 (50 forfalt)» i ordbanken, men som «175» pluss pillen «50 forfalt» i spinene (ordbank.md › Forfalt mengde; DESIGN.md › Bestillingsforslag-tabell). *Fix:* Rett eksempelet i ordbanken.
- **medium** **«advarsel»** står i ordbanken som et synonym som ikke skal brukes (under Bekreftelsesdialog), men spinene bruker det som internt nivånavn i tokener og kode (`exception-warning`, nivået «advarsel»). Ordbanken gjelder også kode, og nivåene «kritisk» og «advarsel» står ikke der (DESIGN.md › Colors; EXPERIENCE.md › Voice and Tone; ordbank.md › Bekreftelsesdialog). *Fix:* Legg til oppføringen «Eksepsjonsnivå (kritisk, advarsel), bare internt» og presiser forbudet under Bekreftelsesdialog.
- **medium** To `[ASSUMPTION]`-merker står igjen, selv om memlog sier at alle antakelser er godtatt og merkene fjernet. Det ene er bærende: hvilken rad eksepsjonsmarkøren står i, som bestemmer hvor hoppene fra Kritiske deler og Endringer lander, og hva testene sjekker (EXPERIENCE.md › Eksepsjonsmarkør: hvilken celle; Brukertest, oppsett pkt. 4). *Fix:* Bestem dem og fjern merkene.
- **low** `sources` mangler dokumenter som brukes eller vises til: beslutninger fra 11-05 og 11-09, `tilbakemelding-prd.md`, briefen, `testeksempel-02/03-fasit.xlsx`, `testdata/validering/README.md`, `testdata/lag_testdata.py` og memlog («som i beslutningene i memlog») (EXPERIENCE.md, frontmatter). *Fix:* Legg dem til.
- **low** Noen tekster som brukeren ser, står ikke i ordbanken, selv om «Ordbank-merknad» sier at alt står der: lagnavnene «Svar», «Utregning», «Tallene» og «Regel», «Bestillingsplan», «Fra lager», «Med planlagte mottak», «Begrenset av», «Lagret kjøring» og «Kritiske deler-liste» (EXPERIENCE.md › Ordbank-merknad). *Fix:* Legg dem inn og oppdater `updated`.
- **low** NFR-5 måles «fra Beregn til synlig Resultattabell» i spinen, men «fra opplasting til resultattabell» i PRD-en (EXPERIENCE.md › Resultattabell: rulling og ytelse). *Fix:* Bruk PRD-ens målepunkt, eller skriv at det tolkes slik.
- **low** Ordbanken sier at eksepsjonsmarkøren er «det lille ikonet med antall i en celle». I DESIGN er den en pille med ikon og antall, og den står også i ryggen når en eksepsjon gjelder hele delen (ordbank.md › Eksepsjonsmarkør; DESIGN.md › Resultattabell). *Fix:* Presiser definisjonen i ordbanken.

## 8. Shape fit — adekvat

Sjekket: DESIGN.md har seksjonene i kanonisk rekkefølge (Brand & Style → … → Do's and Don'ts). Alle obligatoriske seksjoner i EXPERIENCE.md finnes. Inspiration & Anti-patterns er utløst og finnes. Responsive & Platform er ikke utløst (bare PC, én flate). Seksjonene som er lagt til, er Produksjonskapasitet (trinn 4), Brukertest, Før bygging, Senere og Ordbank-merknad.

### Findings
- **low** «Brukertest» (se 6) og «Ordbank-merknad» fortjener ikke plassen. Ordbank-merknaden er prosessmerknader for ordbanken og hører hjemme i memlog. «Produksjonskapasitet», «Før bygging» og «Senere» fortjener plassen (EXPERIENCE.md › Brukertest, Ordbank-merknad). *Fix:* Flytt eller fjern dem.
- **low** Det er forsvarlig å utelate Responsive & Platform. Men den minste skjermen (1366 × 768) og oppførselen på mindre skjermer eller med 200 % zoom står spredt i DESIGN › Layout og EXPERIENCE › Accessibility Floor › Reflow. *Fix:* Legg én linje i Foundation › Form: «Minste skjerm 1366 × 768; under det …».

## Mechanical notes

- **Token-referanser:** DESIGN.md har 64 unike og EXPERIENCE.md 5, og ingen er brutte. Fire generiske mønstre (`{colors.…}`, `{typography.…}` osv.) i EXPERIENCE › Foundation er med vilje.
- **Farger:** Alle 47 er gyldig hex. Noen er bevisste alias med samme verdi: `muted` = `band`, `accent` = `selected-cell`, `input` = `edge`, `primary` = `selected-cell-ring`, `destructive` = `exception-critical`. *Merk:* Endres én, må partneren endres også. Vurder å skrive det i en kommentar.
- **Ubrukte tokener:** shadcn-rollene `popover`, `popover-foreground`, `card-foreground`, `accent`, `accent-foreground`, `input` og `muted` er ubrukte i prosaen, men shadcn bruker dem, så det er i orden. Avstandstrinnene `1`–`12` er Tailwind-skalaen. `typography.numerals` er et token som bare har en note, og det er i orden etter spesifikasjonen.
- **Kontrast:** Jeg regnet ut på nytt `foreground`/`card` 15,2, `edge`/`band` 3,5, `muted-foreground`/`card` 6,5 og `brass-line`/`band` 4,0, og alle stemmer med tabellen. Parene som mangler, står under 2. `ring` på `topbar` (1,93) og `navrow` (1,52) består ikke.
- **Frontmatter:** DESIGN.md har name, description, status (draft) og updated. EXPERIENCE.md har name, status (draft), sources (8, alle finnes, i anførselstegn) og updated. Begge er datert 2026-11-13.
- **Merker:** Det står 2 × `[ASSUMPTION]` i EXPERIENCE.md (l. 122 og l. 294) og 2 × `[OPEN]` om samme sak (kapasitetspanelet) i DESIGN.md › Kapasitetspanel og EXPERIENCE.md › Produksjonskapasitet.
- **Komponentnavn:** Navnene er like i begge filene, og nøklene i frontmatter er kebab-case-varianter (`kritiske-deler-liste`, `knapp-primaer`). «Lenkeknapp i toppfeltet» står i knappetabellen, men har ingen nøkkel i frontmatter.
- **UJ-navn:** UJ-1–UJ-5 er ordrett like i PRD §2.3 og Key Flows. Overskriftene beholder «filen» fordi de er sitert, og det står forklart i Voice and Tone.
- **Ordbank:** `updated: 2026-11-13`. `.docs/ordbank.md` har endringer som ikke er committet (git status).
- **Mermaid:** Ingen diagrammer.
