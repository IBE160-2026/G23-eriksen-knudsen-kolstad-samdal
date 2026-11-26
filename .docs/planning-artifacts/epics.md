---
title: 'COSI - MRP: epics og stories'
status: ferdig
created: '2026-11-23'
updated: '2026-11-23'
language: nb
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/prd.md'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/addendum.md'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-09.md'
  - '.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-13.md'
  - '.docs/planning-artifacts/architecture/architecture-COSI - MRP-2026-11-22-vedtatt/arkitektur.md'
  - '.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-22/DESIGN.md'
  - '.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-22/EXPERIENCE.md'
  - '.docs/planning-artifacts/ux-designs/ux-prototype-2026-11-17-v3/'
  - '.docs/ordbank.md'
  - 'testdata/ (README.md, testeksempel 01–05 med fasit, validering/README.md)'
---

# COSI - MRP – epics og stories

## Oversikt

Dette dokumentet deler kravene i PRD-en, UX-dokumentene og arkitekturen inn i epics og stories som kan bygges. Ved avvik gjelder PRD-en og ordbanken, så arkitekturen, så UX-dokumentene (arkitektur.md, innledningen). FR- og NFR-numrene er de faste numrene fra PRD-en. Ordene følger ordbanken (`.docs/ordbank.md`).

## Kravoversikt

### Funksjonskrav

**§4.1 Opplasting og validering (trinn 1)**

- **FR-1 Last opp Excel-mal:** Brukeren kan velge og laste opp én `.xlsx`-fil fra egen maskin. Testeksempel 01 går uendret videre til beregning. En fil som ikke er `.xlsx`, avvises med melding om at appen bare tar imot Excel-malen.
- **FR-2 Kontroller malens struktur:** Arkene Stykkliste, MPS og Planlagte mottak med kolonneoverskriftene fra malen må finnes. Manglende ark eller overskrift gir valideringsfeil som nevner arket og hva som mangler. Veiledning, Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke. Gammel mal (Produkt og Komponenter) gir feil om at Stykkliste mangler. Kontroller som ikke avhenger av det som mangler, kjøres likevel, så det blir ingen følgefeil (V-F06 gir nøyaktig to feil).
- **FR-3 Kontroller verdiene:** Hver verdi kontrolleres etter regeltabellen i PRD FR-3 (Stykkliste: rader, nivå, varenummer, beskrivelse, antall, type, underdeler, lagerbeholdning, sikkerhetslager, ledetid; MPS: antall og horisont 8–12 uten hull; Planlagte mottak: varenummer, uke 1–H, antall ≥ 1). Heltall lagret som tekst (`^-?[0-9]+$` etter trimming) godtas, alt annet gir feil. Stykklisten slutter ved første rad der Nivå og Varenummer er tomme, og innhold under gir én feil på den tomme raden. Hver regel har minst ett testtilfelle i `testdata/validering/` med nøyaktig én feil.
- **FR-4 Vis alle valideringsfeil samlet:** Ved minst én valideringsfeil vises alle feilene i én liste, og ingen beregning gjøres. Hver feil oppgir ark, rad eller celle, felt og årsak på norsk. Lagret kjøring endres ikke.

**§4.2 MRP-beregning (trinn 1)**

- **FR-5 Beregn bruttobehov:** Nivå 0: bruttobehov(t) = prognostiserte behov(t). Andre deler: summen av planlagt ordrefrigivelse(t) for overordnet del × antall, over alle rader med varenummeret.
- **FR-28 Beregn felles deler én gang:** En felles del beregnes én gang på sin lavnivåkode, etter alle delene den står under, med samlet bruttobehov. Lagerbeholdning, SS og ledetid fra første rad. Planlagte mottak gjelder den samlede tabellen.
- **FR-6 Beregn disponibel beholdning og nettobehov:** disponibel(t) = beholdning(t−1) + planlagte mottak(t) − bruttobehov(t), nettobehov(t) = maks(0, SS − disponibel(t)). Ved nettobehov > 0 fremskyndes første senere planlagte mottak (helt) til uke t, og så neste, til nettobehovet er dekket eller det ikke finnes flere. Fremskyndede mottak regnes med én gang, men vises i uken de er lagt inn.
- **FR-7 Beregn planlagte ordremottak og forventet lagerbeholdning:** Lot-for-lot: planlagt ordremottak(t) = nettobehov(t). Forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak som ikke er kommet ennå. Planlagt ordremottak med forfalt frigivelse vises i uke t.
- **FR-8 Beregn planlagte ordrefrigivelser:** Planlagt ordremottak i uke t gir frigivelse i uke t − L. Er t − L < 1, er frigivelsen forfalt og legges i uke 1. L = 0 (bare ferdigproduktet) frigis samme uke. Beregningen er deterministisk.

**§4.3 Eksepsjoner (trinn 1)**

- **FR-9 Ledetid overskrider horisont:** Ledetid fra ferdigproduktet (lengste sti) ≥ H gir eksepsjonen for hele delen (uke «–»), uansett behov. Meldingen oppgir summen og stien og foreslår lengre horisont.
- **FR-10 Bestilling forsinket:** Nettobehov > 0, forfalt frigivelse og disponibel(t) < 0. Meldingen oppgir disponibel beholdning, forfalt mengde, uken frigivelsen skulle vært gjort, total frigivelse i uke 1 og tidligste mottaksuke (1 + L), og slutter med «Leveranse til kunde blir forsinket.» (nivå 0 og .1) eller «Produksjonen av ‹overordnet del› blir forsinket.» (alle overordnede deler nevnes).
- **FR-11 Bruk av sikkerhetslager:** Nettobehov > 0, forfalt frigivelse og 0 ≤ disponibel(t) < SS. Samme opplysninger om forfalt mengde som FR-10. En uke kan ikke få både FR-10 og FR-11.
- **FR-12 Mottak forsinket:** Uke t får eksepsjonen når et planlagt mottak fremskyndes til den. Meldingen oppgir mottaket (uke, antall), uken det må fremskyndes til, og hvor (hos leverandøren eller i egen produksjon). Er mottaket for lite, får uken også et planlagt ordremottak for resten.
- **FR-29 Kanseller mottak:** Et planlagt mottak som ikke trengs i horisonten (ingen nettobehov fra mottaksuken til uke H når mottaket tas bort, uten annen fremskynding) får eksepsjonen i mottaksuken. Et fremskyndet mottak kan ikke få den.
- **FR-13 Marker kritiske deler:** En del med minst én eksepsjon er kritisk, uansett nivå. Eksepsjonslisten for testeksempel 01 er identisk med fasiten (varenummer, uke, type). Ordlyden er fri, men opplysningene er påkrevd.

**§4.4 Resultattabell (trinn 1, FR-18 trinn 2)**

- **FR-14 Vis resultattabell per del:** For hvert varenummer seks rader (bruttobehov, planlagte mottak, forventet lagerbeholdning, nettobehov, planlagte ordremottak, planlagte ordrefrigivelser), nøyaktig H ukekolonner, med varenummer, beskrivelse, nivå og type. Ferdigproduktets navn og horisont over tabellen. En felles del har én tabell.
- **FR-15 Fremhev eksepsjoner i tabellen:** Cellen for en eksepsjon fremheves med farge og symbol eller tekst, og åpner meldingen ved klikk. Uke «–» vises ved delens navn. Flere eksepsjoner i en uke viser alle meldingene.
- **FR-16 Vis sammendrag av kritiske deler:** Øverst, før bestillingsforslagene: antall kritiske deler og liste med eksepsjonstyper, med hopp til delen i tabellen. Uten kritiske deler bare en kort melding. Tabellen følger stykklisterekkefølgen. Filteret «Vis bare kritiske deler» skjuler de andre delene på skjermen, ikke i eksporten.
- **FR-17 Vis bestillingsforslag:** Alle bestillingsforslag sortert etter frigivelsesuke, med varenummer, beskrivelse, frigivelsesuke, mengde og innkjøp eller produksjonsordre. Forfalt mengde merkes. Filter på én uke. Ingen egen ukevisning.
- **FR-18 Forklar beregningen (trinn 2):** Hver rad og celle har en norsk forklaring med tallene bak, bruttobehov fordelt på overordnede deler, og hver eksepsjonstype har en forklaring. Åpnes ved klikk eller tastatur i et panel ved siden av tabellen, står til brukeren lukker det, aldri ved peking.

**§4.5 Endringer og før/etter-sammenligning (trinn 3)**

- **FR-19 Husk siste kjøring per ferdigprodukt:** Etter vellykket kjøring lagres siste kjøring per ferdigprodukt (nøkkel: varenummer på nivå 0) i nettleseren, også etter at den lukkes. Valideringsfeil erstatter ingen lagret kjøring.
- **FR-20 Vis før/etter-sammenligning:** Finnes forrige kjøring for samme ferdigprodukt: bestillingsforslag nye, endret mengde eller fjernet (identifisert av varenummer og frigivelsesuke), eksepsjoner nye eller borte (varenummer, uke, type), og deler nye eller fjernet. Andre endringer vises ikke. 02 → 03 og 03 → 02 gir nøyaktig linjene i arket Sammenligning i fasit 03.
- **FR-21 Start på nytt uten sammenligning:** Brukeren kan slette lagret kjøring for ett ferdigprodukt. Neste opplasting vises uten sammenligning. Andre ferdigprodukter berøres ikke.

**§4.6 Eksport (trinn 3)**

- **FR-22 Eksporter kjøring til fil:** Den viste kjøringen kan lastes ned som `.xlsx` med resultattabellen, bestillingsforslagene, eksepsjonene med meldinger, ferdigproduktets navn, horisont og tidspunkt. Tallene er lik fasiten. Filnavnet har ferdigproduktets navn og dato. Åpnes i Excel uten feil.
- **FR-23 Eksporter før/etter-sammenligning:** Når en sammenligning vises, har eksporten arket «Sammenligning» bygd som i fasit 03. Uten sammenligning finnes ikke arket.

**§4.7 Fast partistørrelse (trinn 5, kuttes først)**

- **FR-24 Les partistørrelse:** Valgfri kolonne «Partistørrelse» i Stykkliste, tom eller heltall ≥ 1, fylt ut første gang varenummeret står. Fil uten kolonnen er gyldig og gir lot-for-lot. Testeksempel 01 gir samme resultat før og etter.
- **FR-25 Beregn med fast partistørrelse:** Planlagt ordremottak(t) = ⌈nettobehov(t) / Q⌉ × Q. Overskuddet føres videre. Nytt testeksempel med minst to deler med Q og manuelt kontrollert fasit.
- **FR-26 Vis bestillingsregel:** Resultattabellen og eksporten viser bestillingsregel og partistørrelse per del («Fast partistørrelse: 50»). Forklaringen beskriver avrundingen.

**§4.8 Veiledning i appen (trinn 1)**

- **FR-27 Last ned Excel-malen og testeksempelet:** Startsiden («Ny kjøring») har nedlasting av tom mal (identisk med `testdata/COSI-MRP-mal.xlsx`) og testeksempel 01, og en kort veiledning som sier at hver fil gjelder ett ferdigprodukt og at lageret for felles deler må fordeles mellom filene. Første besøk i en nettleser viser introduksjonssiden, senere besøk startsiden. Introduksjonssiden kan alltid åpnes fra menyen.

**§4.9 Produksjonskapasitet (trinn 4, kuttes først)**

- **FR-30 Velg beregning:** Brukeren velger bestillingsplan, produksjonskapasitet eller begge. Samme validering uansett. Bare kapasitet: ingen resultattabell, bestillingsforslag eller eksepsjoner, ingen lagring, ingen sammenligning og ingen eksport av kapasiteten.
- **FR-31 Beregn produksjonskapasitet:** Ledig beholdning = maks(0, lagerbeholdning − SS). Kapasiteten i uke t er største N hele ferdigprodukter der et behov på N i uke t kan dekkes, brutt ned som i MRP-beregningen med ledig beholdning, SS 0, ingen fremskynding, ingen ordre på deler uten underdeler og ingen forfalte frigivelser. Heltall ≥ 0 og aldri lavere fra én uke til neste. Uavhengig av arket MPS.
- **FR-32 Vis kapasitet fra lager og med planlagte mottak:** To rader per uke: fra lager (bare ledig beholdning) og med planlagte mottak (fra mottaksuken). Raden med mottak er aldri lavere.
- **FR-33 Vis begrensende deler:** Per uke og rad: delene som ikke kan dekkes ved N + 1, med årsak (for lite på lager og i planlagte mottak, eller ledetid). Like laveste verdier viser alle.
- **FR-34 Vis kapasitetspanelet:** Eget panel med egen overskrift, adskilt fra bestillingsplanen. Øverst de to radene, under en tabell per del (lagerbeholdning, SS, ledig beholdning, ledetid, planlagte mottak per uke). Sier at kapasiteten tar med ledetid, men ikke prognostiserte behov. Begrensende deler med årsak, ikke farge alene.

### Ikke-funksjonelle krav

- **NFR-1 Beregning skilt fra resten:** Beregningen (§4.2–4.3 og FR-31) kan kjøres og testes alene, uten Excel-lesing, lagring eller UI.
- **NFR-2 Automatiske tester mot fasit:** Hvert testeksempel har tester mot fasiten (resultattabell og eksepsjoner), og hver regel i FR-2 og FR-3 har en test. Én kommando, uten nøkler, kontoer eller eksterne tjenester. Ett avvik fra fasit får minst én test til å feile.
- **NFR-3 Kjørbar for sensor:** Kan startes lokalt etter README uten nøkler eller betalte kontoer. Malen og testeksemplene ligger i repoet. Appen er også publisert på nettet.
- **NFR-4 Data blir i brukerens nettleser:** Opplastede filer og kjøringer forlater aldri maskinen. Serveren leverer bare appens kode. Ingen tredjepartstjenester.
- **NFR-5 Ytelse:** Mål: 1000 stykklisterader, tre nivåer og 12 uker under 3 sekunder fra opplasting til resultattabell på en vanlig bærbar PC.
- **NFR-6 Plattform:** PC i nyere Chrome, Edge og Firefox. Ikke mobil i v1.
- **NFR-7 Språk:** All tekst på norsk, også valideringsfeil og eksepsjoner, samlet så engelsk kan legges til uten å endre beregningen.
- **NFR-8 Lesbarhet:** Eksepsjoner og kritiske deler markeres ikke med farge alene. Varenummer, beskrivelse og radnavn står fast ved sidescroll.
- **NFR-9 Robust feilhåndtering:** Ingen fil kan få appen til å stoppe, henge eller vise et delvis resultat. Skadet fil, tom fil, ikke-Excel med endelsen `.xlsx` og uventet feil gir hver en norsk melding. Ny fil kan lastes opp uten omlasting, og lagret kjøring endres ikke (V-F07–V-F09).
- **NFR-10 Lagring i nettleseren:** Siste kjøring overlever at nettleseren lukkes. Bare siste vellykkede per ferdigprodukt, aldri Excel-filen. Etter sletting finnes ingen data om ferdigproduktet. Blokkert lagring: appen virker og sier at kjøringen ikke lagres.
- **NFR-11 Kompatibilitet med Excel:** Leser `.xlsx` fra malen lagret i Excel for Windows og macOS, verdier og ikke formler, nivå og varenummer likt som tall eller tekst. Eksporten åpnes uten feilmeldinger. Testeksempel 01 og 02 lagret på nytt i begge gir samme resultat.

### Tilleggskrav fra arkitekturen

**Oppstart (påvirker Epic 1, første stories)**

- **Startmal:** prosjektet starter fra Vite-malen `react-ts` med TypeScript `strict` (AD-1). Story 0 er prosjektoppsett: Vite, React, TypeScript, Vitest, oxlint, arkitekturtest, `vercel.json` og README med kommandoene (AD-3).
- **Story 1 er alle delte typer** i `src/domene/typer.ts` (`RaaArk`, `Inndata`, `Struktur`, `DelResultat`, `Utregning`, `Resultat`, `Eksepsjon`, `Valideringsfeil`, `Kapasitet`, `LagretKjoring`, `Sammenligning`, `Kjoring`). Story 0 og 1 flettes inn i `main` før annet arbeid som bruker typene, starter. Idun er koordinator og eier `typer.ts`. Endringer i delte typer skjer i egen PR som godkjennes av koordinatoren og minst én bruker av typene (AD-3, kap. 7).
- **Eksakte versjoner** (kap. 5): Node 24 LTS (`engines` godtar også 22.12+ og 26), TypeScript 7.0.2, Vite 8.3.8, React/react-dom 19.3.1, @vitejs/plugin-react 6.3.0, SheetJS CE 0.20.3, @fontsource/ibm-plex-* 5.3.0, Vitest 5.1.1, @playwright/test 1.65.1, oxlint 1.94.0, og bare til utvikling @types/react og @types/react-dom 19.3.0 og @types/node 24.19.2. Ingen `^` eller `~`, `package-lock.json` committes, `npm ci` brukes, og arkitekturtesten sjekker versjonene. `.npmrc` har `engine-strict=true` og `allow-remote=root` (AD-18).
- **SheetJS** installeres fra `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`, aldri `npm i xlsx` (AD-15).

**Oppbygging og grenser**

- **Mappestruktur og importregler** (kap. 2): `domene/`, `tekster/`, `excel/`, `lagring/`, `worker/`, `app/`, `ui/`, med tabellen over hva hver del kan importere. En arkitekturtest i Vitest leser importene og feiler ved brudd.
- **Ren kjerne** (AD-2): `src/domene/` bruker ikke React, SheetJS, `window`, `document`, `localStorage`, `Date.now`, `new Date()` eller `Math.random`. Tidspunktet settes i styringen.
- **Feil er verdier** (AD-5): `{ ok: true, verdi } | { ok: false, feil }`. Filfeilkoder for ikke Excel, tom og skadet fil. Valideringen samler alle feil. Worker-en svarer `UVENTET_FEIL` og sender aldri halvt resultat. Én React-feilgrense rundt visningene. Tidsgrense 30 sekunder med `terminate()`.
- **Én eier av stykklistestrukturen** (AD-6): bare `domene/struktur.ts` bygger `Struktur` (overordnede deler, lavnivåkode, ledetid fra ferdigproduktet, antall per ferdigprodukt). Valideringen bruker den til underdelsreglene. Deler beregnes etter stigende lavnivåkode, så stykklisterekkefølge.
- **Én netting** (AD-7): `domene/netting.ts` med ett innstillingsobjekt for bestillingsplan, kapasitet og fast partistørrelse. Eksepsjonene finnes etterpå i `domene/eksepsjoner.ts`. Kanseller mottak kjører nettingen én gang til uten mottaket.
- **Beregningen gir alt skjermen viser** (AD-8): `Utregning` per del og uke med tallene forklaringspanelet trenger. UI og eksport formaterer bare.
- **Koder i kjernen, tekst i `tekster/nb.ts`** (AD-9): eksepsjonskodene `LEDETID_OVERSKRIDER_HORISONT`, `BESTILLING_FORSINKET`, `BRUK_AV_SIKKERHETSLAGER`, `MOTTAK_FORSINKET`, `KANSELLER_MOTTAK`. All tekst, også i eksporten, lages i `tekster/`. Tall med `Intl.NumberFormat('nb-NO')`.
- **Data-konvensjoner** (AD-4): varenummer og nivå er trimmet tekst (tallet 300001 = «300001», «000123» beholdes). Uker 1..H som lister med lengde H. Forfalt mengde er eget felt. Planlagte mottak holdes som enkeltlinjer med Excel-rad.

**Kjøring, lagring og visninger**

- **Web Worker fra start** (AD-12): `worker/beregning.worker.ts` tar imot `ArrayBuffer` (overført) og valget, kjører les → valider → struktur → beregn → eksepsjoner → kapasitet og svarer med én melding. Ingen tilstand, ingen `localStorage`, ingen DOM. Meldingstyper i `worker/meldinger.ts`.
- **Fast rekkefølge i `app/kjoring.ts`** (AD-12): start worker og tidsgrense → vent på svar (feil stopper alt) → les forrige utdrag → lag utdrag og sammenlign (bare bestillingsplan) → lag `Kjoring` → lagre (bare bestillingsplan og alt gikk bra) → gi til tilstanden og gå til `#/resultat`. Nytt klikk på Beregn under kjøring starter ingen ny.
- **Lagring** (AD-10): bare `lagring/lagrede-kjoringer.ts` bruker `localStorage`, alt i `try/catch`. Nøkler: `cosi-mrp:kjoring:<varenummer>` (utdrag med `schemaVersjon`, varenummer og navn, tidspunkt, deler, bestillingsforslag, eksepsjoner), `cosi-mrp:intro-sett` og `cosi-mrp:visning`. Listen lages fra prefikset. Ukjent `schemaVersjon` regnes som ikke funnet. Kapasitet alene lagres ikke.
- **Sammenligning i kjernen** (AD-11): `domene/sammenlign.ts` sammenligner to utdrag. Gruppene Bestillingsforslag, Eksepsjoner, Deler i fast rekkefølge som i fasit 03. Kodene `NY`, `ENDRET_MENGDE`, `FJERNET`, `BORTE`. Skjerm og eksport bruker samme rekkefølge.
- **Ruting og tilstand** (AD-13): fem visninger med hash-adresser `#/introduksjon`, `#/ny-kjoring`, `#/resultat`, `#/lagrede-kjoringer`, `#/veiledning`. Egen ruting på `hashchange` i `ui/ruter.ts`. Ukjent adresse går til introduksjonen første gang, ellers Ny kjøring. Felles tilstand i React Context med `useReducer`. `#/resultat` uten kjøring i minnet viser melding med lenke til Ny kjøring. Seksjonsmenyen bruker `scrollIntoView`. Én `role="status"`-region i rotkomponenten.
- **Resultatet og tabellen** (AD-14): fast rekkefølge (kjøringslinje med seksjonsmeny, tallbokser, «Slik leser du resultatet», kritiske deler, bestillingsforslag, endringer, resultattabell, produksjonskapasitet). Én semantisk `<table>` med én memoisert `<tbody>` per del. Filtre, valgt celle og panel er lokal tilstand.
- **Excel-delen** (AD-15): bare `src/excel/` importerer SheetJS (pluss testhjelperne `tests/hjelpere/fasit-leser.ts` og `tests/hjelpere/lag-arbeidsbok.ts`). Ark og kolonner etter navn. Lagrede verdier, aldri formler. Excel-radnummer per rad. Leser kolonne A–H til rad 1001 for å se innhold under en tom rad. Avgjør aldri om noe er feil. Eksporten bygges fra `Kjoring`.

**Tester, publisering og arbeidsflyt**

- **Tester** (AD-16): fasittester leser `testdata/*-fasit.xlsx` og går samme vei som appen. Sammenligner tall per del, uke og rad, eksepsjoner, valideringsfeil og sammenligningslinjer, ikke ordlyd. Én test per fil i `testdata/validering/`. Test som sjekker at `public/` har samme mal og testeksempel 01 som `testdata/`. `npm test` (Vitest, uten nett) og `npm run test:e2e` (Playwright i Chromium og Firefox: testeksempel 01, NFR-9-filene, blokkert lagring, ny fil uten omlasting, ingen CSP-brudd). Alle e2e-testene bruker vakten i `e2e/csp-vakt.ts`, som feiler ved CSP-brudd, konsollfeil og unntak. `lag_testdata.py` importeres aldri i appen.
- **Excel for Windows og Mac** (AD-16, kap. 7): testeksempel 01 og 02 åpnes og lagres i Excel for Mac (Carmen og Idun) og Windows (Sebastian og Oda), legges inn som testfiler og skal gi samme resultat. Eksportfilen åpnes i begge.
- **Ytelsesfil** (AD-14, addendum): `testdata/ytelse-1000.xlsx` lages med `lag_testdata.py` (finnes ikke ennå), og ytelsen måles tidlig, før tabellstrukturen låses.
- **Statisk publisering** (AD-17): `npm run build` gir statiske filer på Vercel. Ingen serverfunksjoner, ingen Analytics eller Speed Insights, ingen tredjeparts skript eller skrifter. `vercel.json` setter CSP-en, `X-Content-Type-Options: nosniff` og `Referrer-Policy: no-referrer` fra AD-17, og `vite preview` bruker de samme (test sjekker at de er like). HSTS sender Vercel selv. `npm run dev` har ingen CSP. Miljøer: lokalt, forhåndsvisning per branch, produksjon fra `main`. Vercel-oppsett: Node 24, toolbar av på forhåndsvisninger (issues 2026-11-20).
- **Byggflagg og brukertest** (AD-17): `VITE_KAPASITET` skjuler produksjonskapasiteten hvis trinn 4 kuttes og i brukertestbygget. Brukertesten 2.–7.12 bruker branchen `brukertest`, frosset den uka, med fast alias.
- **Arbeidsflyt** (AD-18): én branch per story og PR inn i `main`, minst én annen i gruppen ser over. `npm test`, `npm run lint` og `npm run build` grønne før fletting, og `npm run test:e2e` når storyen endrer `ui/`, `worker/` eller `excel/`. CI er utsatt.
- **Skrifter** (AD-1): IBM Plex Sans, Sans Condensed og Mono via `@fontsource`, aldri fra Google Fonts.
- **Navn i koden** (kap. 4): norske fagord fra ordbanken i ASCII (æ, ø, å → ae, o, a). `kebab-case.ts`, `PascalCase.tsx`. Nye fagord legges først inn i ordbanken.
- **Byggerekkefølge** (kap. 8): 0 oppsett → 1 typer → 2 lesing og validering → 3 struktur, netting og beregning med fasit 01–04 → 4 eksepsjoner → 5 worker, styring, tilstand og ruting → 6 UI trinn 1 og ytelsesmåling → 7 forklaringspanel → 8 lagring, sammenligning, Lagrede kjøringer og eksport → 9 kapasitet med fasit 05 → 10 fast partistørrelse. Etter nr. 1 kan nr. 2–4 og 6 gå samtidig. UI kan bygges mot eksempeldata fra fasit 01.

**Datoer som styrer rekkefølgen** (PRD §7.1, §8.1)

- Skjermene for trinn 1–2 (resultattabell, eksepsjoner, bestillingsforslag, forklaringspanel) klare før prøvetesten rundt 27.11.
- Trinn 1–3 testet innen kuttmøtet 30.11. Gruppen avgjør da om trinn 4 og 5 startes.
- Brukertest 2.–7.12 med trinn 1–2. Rettelser etter brukertesten går foran trinn 4.
- Innlevering 15.12.2026 kl. 15:00.

### UX-designkrav

**Grunnlag**

- **UX-DR1 Tokens og visninger:** Alle tokens i DESIGN.md (farger med `-dark`-varianter, typografi, avstander, hjørner, komponenttokens) blir CSS-variabler i `ui/felles/tokens.css`. Mørk visning settes med `data-visning="mork"` på `<html>` og leses før første tegning, så siden ikke blinker. Kontrasten kontrolleres i begge visningene, også de `summary-*`- og `exc-*`-parene DESIGN.md ikke har regnet ut.
- **UX-DR2 Skrift og tall:** IBM Plex selvhostet. Alle tall med `tabular-nums`, høyrejustert, hardt mellomrom som tusenskille og ekte minus «−». Endret mengde «130 → 205 (+75)». Datoer «13.11.2026 kl. 08:04». Uke «–» har tilgjengelig navn «hele delen».
- **UX-DR3 Appmeny:** fast til venstre med logo, Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer og Veiledning, aktiv side markert. Nederst «Bytt til mørk» / «Bytt til lys». Valget huskes, og gjelder til siden lukkes hvis lagring er blokkert.
- **UX-DR4 Overskrifter, sidetittel og statusregion:** én h1 per side. Startside «Ny kjøring». Resultat: skjult h1 «Resultat for ‹beskrivelse›» med `tabindex="-1"` som får fokus etter Beregn, og sidetittel «‹beskrivelse› (‹varenummer›) – Resultat – COSI - MRP». Med valideringsfeil er feiloppsummeringens overskrift h1, og sidetittelen begynner med «Feil:». Én `role="status"`-region som finnes fra sidelasting og kunngjør lasting, «Kjøringen er ferdig: N bestillingsforslag, M kritiske deler.» og statusmeldinger.
- **UX-DR5 Meldingskatalog og ordlyd:** alle tekster i én katalog med én mal per valideringsregel og per eksepsjonstype. Ordene følger ordbanken og Voice and Tone (du-form, ingen unnskyldninger, utropstegn eller feilkoder. «Filen» i bestemt form, «før uke 1» i stedet for «uke 0». Knappetekster sier hva som skjer).

**Introduksjon, startside og opplasting**

- **UX-DR6 Introduksjonsside:** stor flate med overskrift (40 px), to korte avsnitt, primærknappen «Kom i gang» til startsiden, og de tre stegene i tre bokser. Vises første besøk (`cosi-mrp:intro-sett`), og ved hvert besøk hvis lagring er blokkert.
- **UX-DR7 Startside med veiledning:** h1 «Ny kjøring» og setningen om ett ferdigprodukt per fil rett under. Tre nummererte kort: (1) «Fyll ut Excel-malen» med «Last ned Excel-malen» og «Last ned testeksempel 01» som `download`-lenker, (2) «Last opp filen», (3) «Velg hva du vil beregne, og beregn». Opplastingssonen, radiogruppen og Beregn er synlige uten rulling i 1366 × 630 px når det ikke vises feil. Med feiloppsummering (UX-DR11) ruller Kari ned til opplastingen (vedtatt av gruppen 26.11).
- **UX-DR8 Opplastingssone:** dra og slipp pluss ekte `<button>` «Velg fil» som åpner skjult `<input type="file" accept=".xlsx">`, med fokus tilbake etter dialogen. Begge veier går gjennom samme kontroll. Valgt fil vises med navn. Flere filer sluppet: ingen brukes, med melding. Feil i hele filen vises i sonen, og filvalget nullstilles, så samme filnavn kan velges på nytt. Valgt-tone når en fil dras over.
- **UX-DR9 Valg av beregning:** `fieldset` «Hva vil du beregne?» med Bestillingsplan (forhåndsvalgt), Produksjonskapasitet og Begge, hver med én linje hjelpetekst fra EXPERIENCE.md. Forrige valg står igjen ved «Last opp ny fil» og etter valideringsfeil. Skjult når `VITE_KAPASITET` er av, og da gir Beregn bestillingsplanen.
- **UX-DR10 Beregn:** deaktiveres aldri. Uten fil: «Velg en fil først.» og fokus til «Velg fil». Under kjøring vises «Leser filen …» og så «Beregner …» i statusregionen, uten overlegg eller spinner, og nytt klikk starter ingen ny kjøring.
- **UX-DR11 Feiloppsummering:** øverst over kortene, også ved én feil. Brettet får fokus (`tabindex="-1"`, ingen `role="alert"`). Strukturfeil først i gruppen «Filen følger ikke malen», med hvilke kontroller som er hoppet over. Så verdifeil per ark i malens rekkefølge (Stykkliste → Prognostiserte behov (arket MPS) → Planlagte mottak) med antall per ark, sortert etter Excel-rad (MPS etter uke), i tabell med Ark, Sted, Felt og Feil. Like feil i samme kolonne slås sammen med radintervall og antall. Sier at lagret kjøring er urørt. Ny opplasting med nye feil oppdaterer listen og flytter fokus på nytt.
- **UX-DR12 Feil i hele filen:** én melding i opplastingssonen per tilfelle, med tekstene i EXPERIENCE.md: ikke `.xlsx`, skadet, tom (0 byte), ikke Excel selv om den heter `.xlsx`, passordbeskyttet og uventet feil.

**Resultat**

- **UX-DR13 Kjøringslinje:** fast øverst med ferdigproduktets beskrivelse og varenummer, horisont, filnavn, tidspunkt, lagringsstatus som tekst, «Last opp ny fil» (til startsiden, uten å røre forrige resultat eller lagret kjøring) og «Eksporter til Excel». Statusmeldinger med «ⓘ» står her. Med bare kapasitet: «Bare produksjonskapasitet. Kjøringen lagres ikke.», og eksportknappen er skjult.
- **UX-DR14 Seksjonsmeny:** `<nav aria-label="Seksjoner i resultatet">` med runde knapper nederst i kjøringslinjen: Kritiske deler (antall), Bestillingsforslag (antall), Endringer (antall), Resultattabell, Produksjonskapasitet. Endringer og Produksjonskapasitet bare når seksjonen vises. Klikk eller Enter ruller med `scrollIntoView` så overskriften står rett under kjøringslinjen, og flytter fokus dit. Aktiv seksjon med `aria-current="location"` oppdateres ved rulling. Antallene viser alltid totalen. Myk rulling, hopp med `prefers-reduced-motion`.
- **UX-DR15 Tallbokser:** fire bokser (kritiske deler, bestillingsforslag i uke 1, bestillingsforslag i alt, forslag med forfalt mengde), pluss en femte for endringer når de vises. Hver boks er én lenke til seksjonen. Bare kritiske deler (●) og forfalt mengde (!) har farge. Tallet 0 forklares i ord. Påvirkes ikke av filtre. Fokusring inne i boksen.
- **UX-DR16 «Slik leser du resultatet»:** nummerert liste med én linje per seksjon i samme rekkefølge. Åpen, kan felles sammen. Uten kritiske deler er punktet om dem borte.
- **UX-DR17 Kritiske deler:** én linje per kritisk del i stykklisterekkefølge med varenummer, beskrivelse, type, nivå, alle eksepsjonsmerker med uke og setningen i vanlig språk, «Første bestillingsforslag: …» og «Se forklaring →». Hele linjen er én knapp med tilgjengelig navn. Aktivering ruller til delen, flytter fokus til cellen med tidligste eksepsjon og åpner forklaringspanelet med eksepsjonen øverst. 4 px venstrekant i fargen til tidligste eksepsjon. Uten kritiske deler bare «Ingen kritiske deler. Planen går opp for alle delene.» i en informasjonsboks.
- **UX-DR18 Bestillingsforslag:** liste med fast høyde og egen rulling, sortert etter frigivelsesuke og så stykklisterekkefølge. Kolonnene Frigivelsesuke, Varenummer, Beskrivelse, Mengde, Innkjøp eller produksjonsordre, Forfalt. Hjelpeteksten om frigivelsesuke over. Uke 1-radene i `accent-soft`. Symbol for eksepsjon ved kritisk del. Knappen «! 50 forfalt» (tilgjengelig navn «50 forfalt: se eksepsjonen for ‹del›») gjør det samme som linjen i kritiske deler. Uten forslag: «Kjøringen gir ingen bestillingsforslag.»
- **UX-DR19 Ukefilter:** «Alle uker» (valgt ved start) og Uke 1–H, hver med antall. Med en uke valgt: «Viser X av Y forslag · Vis alle uker». Uke uten forslag: «Ingen bestillingsforslag skal frigis i uke N.» med «Vis alle uker». Gjelder bare listen.
- **UX-DR20 Endringsliste:** overskrift med de to tidspunktene («13.11 kl. 07:31 → 08:04»). Grupper Bestillingsforslag, Eksepsjoner, Deler med antall, og «ingen endringer» i tom gruppe. Etikettene Nytt, Endret mengde, Fjernet / Ny, Borte / Ny, Fjernet med `change-tag-*` (Fjernet og Borte gjennomstreket, aldri rødt mot grønt). Flyttet forslag som Fjernet og Nytt rett under hverandre. Nytt, Endret mengde og Ny eksepsjon kan velges og gjør det samme som i kritiske deler. Ingen endringer: teksten «Ingen endringer i bestillingsforslag, eksepsjoner eller deler siden forrige kjøring (…). Andre tall kan ha endret seg.» Første kjøring: ingen seksjon, ingen knapp og ingen tallboks.
- **UX-DR21 Resultattabell, oppbygging:** ekte `<table>` med `<caption>` (ferdigprodukt og horisont), `<th scope="col">` for uker, `<th scope="row">` for radnavn, `<th scope="rowgroup">` for delens felt og én `<tbody>` per del. Delens felt (nivåmerke, varenummer i Mono, beskrivelse, type, lager, SS, L, antall per overordnet del, innrykk 12 px per nivå, «● Kritisk del»). Radhøyde 32 px, nuller i `ink-secondary`, negative tall i `exc-critical`, uke 1-kolonnen i `accent-soft`. Egen rulleregion (`role="region"`) med fast ukeoverskrift og faste venstrekolonner (NFR-8). Tegnforklaring over tabellen.
- **UX-DR22 Resultattabell, tastatur:** WAI-ARIA grid med roving tabindex og én tabulatorstopp. Piler stopper ved kanten, Home/End i raden, Ctrl+Home/Ctrl+End, PgUp/PgDn til samme rad i forrige og neste del, venstre fra radnavn til delens felt, opp og ned fra delens felt til forrige og neste del, Enter eller mellomrom åpner forklaringen, Esc lukker. Cellen med fokus rulles alltid inn i bildet og skjules aldri bak faste lag (WCAG 2.4.11), også med panelet åpent på 1366 × 768. Valgt celle har ramme og fete overskrifter, også med panelet lukket.
- **UX-DR23 Eksepsjonsmarkør:** symbolet (20 × 20 px, `!`, `S`, `M`, `K`, `⧗`) til venstre for tallet og eksepsjonens lyse bakgrunn i cellen: Nettobehov uke t for Bestilling forsinket og Bruk av sikkerhetslager, Nettobehov i uka mottaket fremskyndes til for Mottak forsinket, Planlagte mottak i mottaksuka for Kanseller mottak, og delens felt for Ledetid overskrider horisont. Flere side om side. Tilgjengelig navn «‹type›, uke N».
- **UX-DR24 Filter for kritiske deler:** avkrysningsboks «Vis bare kritiske deler», av ved start, skjult uten kritiske deler. «Viser X av Y deler · Vis alle deler». Valgt celle i skjult del nullstilles og panelet lukkes. Påvirker ikke tallbokser eller eksport.
- **UX-DR25 Eksepsjonsmeldinger:** fire deler (variant B): typenavn og uke, én setning i vanlig språk, «Melding:» med opplysningene kravet krever og handlingen først, «Hvorfor:» med regel og tall. Tekstforslagene i EXPERIENCE.md brukes som grunnlag. Produksjonsordre bruker «starte produksjonen». Bestilling forsinket og Bruk av sikkerhetslager forklarer hvorfor tabellen viser et annet lagertall. Ledetid overskrider horisont og Kanseller mottak sier at de bare gjelder innenfor horisonten.
- **UX-DR26 Forklaringspanel:** ikke-modalt `<aside aria-label="Forklaring">` 340 px til høyre som skyver tabellen og står fast under kjøringslinjen med egen rulling. Overskrift «‹del› – ‹rad›, uke N» og «Lukk». Eksepsjonene øverst (alle). I en kritisk del uten eksepsjon i cellen står lenke «… → Vis». Fire lag: svaret, utregningen steg for steg, tallene som lenker til egen forklaring, regelen. Bruttobehov viser hver overordnet del («Kontorstol Basic: 20 × 5 = 100»). Tekstene for nettobehov, forfalt frigivelse, forventet lagerbeholdning, frigivelser og fremskyndet mottak fra EXPERIENCE.md. Fokus blir i tabellen mens piltaster flytter cellen. «Gå til forklaringen» vises ved fokus etter tabellen. Esc eller «Lukk» gir fokus tilbake til cellen. `aria-live="polite"` bare på overskrift og første kort, cirka 300 ms etter at cellen har stoppet. Hele meldingen for 300-003 Hjul synlig uten rulling på 1366 × 768. Glir inn, respekterer `prefers-reduced-motion`. Under 900 px blir panelet et ark nederst.
- **UX-DR27 Tomme og spesielle tilstander i Resultat:** `#/resultat` uten kjøring i minnet (reload, bokmerke) viser kort melding med lenke til Ny kjøring. Tilbake i nettleseren går til startsiden. Første kjøring: «Første kjøring for ‹beskrivelse›. Det finnes ingen tidligere kjøring å sammenligne med.» Lagring blokkert: statusmeldingen står fast i kjøringslinjen, og Endringer vises aldri.
- **UX-DR28 Eksport:** «Eksporter til Excel» laster ned direkte. Filnavn «COSI-MRP ‹beskrivelse› ‹ÅÅÅÅ-MM-DD›.xlsx». Tallene lagres som tall. Arket Sammenligning med når det finnes en sammenligning, også ved «Ingen endringer». Filtre påvirker ikke eksporten. Kapasiteten er aldri med. «Excel-filen er lastet ned.» eller «Excel-filen kunne ikke lages. Prøv Eksporter til Excel en gang til.» som statusmelding.
- **UX-DR29 Statusmelding:** står i kjøringslinjen til den ikke gjelder lenger, uten lukkeknapp, popup eller toast, og kunngjøres én gang gjennom statusregionen.

**Andre sider**

- **UX-DR30 Lagrede kjøringer:** én linje per ferdigprodukt med beskrivelse, varenummer, tidspunkt og «Slett». Bekreftelsen står i linjen («Slette lagret kjøring for ‹beskrivelse› (‹varenummer›)? Neste opplasting vises uten sammenligning.» med «Slett» og «Avbryt», fokus på «Avbryt»), aldri `confirm()`. Etter sletting: «Lagret kjøring er slettet. Neste opplasting vises uten sammenligning.» Tom: «Ingen lagrede kjøringer ennå.»
- **UX-DR31 Veiledning:** tekstside om hvordan nettsiden brukes, nummererte overskrifter og primærknappen «Til Ny kjøring». Utfyllingen av malen står i malens ark Veiledning.

**Produksjonskapasitet (trinn 4)**

- **UX-DR32 Kapasitetspanel:** overskrift «Produksjonskapasitet» i eget panel med 2 px ramme og 10 px hjørner. Innledning i fire punkter (hva tallet er, Fra lager, Med planlagte mottak, ledetid med og prognostiserte behov ikke). Tegnforklaring med to bokser, Lager (`▤`, `exc-warning`) og Ledetid (`⧗`, `exc-horizon`) med tekstene fra EXPERIENCE.md. To rader «Fra lager» og «Med planlagte mottak», én kolonne per uke, som ikke ligner de seks radene. Under hvert tall den begrensende delen med symbol og ordet Lager eller Ledetid (alle ved likhet), og tilgjengelig navn i hele setninger. «Grunnlaget per del» som tabell, med hjelpeteksten for Ledig beholdning koblet med `aria-describedby`. Ingen klikkbar forklaring i v1. Står sist i Resultat ved Begge. Prøves med 0 i alle uker og mange uker.

**Tilgjengelighet, ytelse og plattform**

- **UX-DR33 Tilgjengelighetsgulv:** WCAG 2.1 AA og 2.4.11. Ikke farge alene noe sted. Synlig fokus på alt interaktivt. Fokus tilbake dit det kom fra. Tab-rekkefølge appmeny → kjøringslinje → seksjonsmeny → tallbokser → kritiske deler → bestillingsforslag → endringer → resultattabell → forklaringspanel → kapasitet. Ingen forklaring ved peking, ingen toast, ingen overlegg ved lasting, ingen nettleserdialoger og ingen modaler. `cursor: pointer` på alt klikkbart. Manuell tastaturtest og cirka 15 minutters NVDA-test før prøvetesten.
- **UX-DR34 Responsiv:** minste vindu 1366 × 630 px ved 100 % zoom. Opp til 200 % zoom ruller siden loddrett, og ingenting skjules. Under 900 px: appmenyen øverst, panelet som ark nederst (inntil 60 % høyde), seksjonsmenyen bryter linjer, tallboksene stables. Ingen sideveis rulling utenom tabellene.
- **UX-DR35 Ytelsestiltak:** mål med 1000 rader før tabellstrukturen låses. Nås ikke 3 sekunder, prøv i rekkefølge: `content-visibility: auto` per `<tbody>`, virtualisering per del med `aria-rowcount` og `aria-rowindex`, og sist sammenslått visning (én linje per del, «Fold ut alle» og «Fold sammen alle», hopp fra kritiske deler folder ut delen).

**Brukertest**

- **UX-DR36 Brukertestbygg og forberedelser:** fast adresse (`brukertest`-branch med alias) for 2.–7.12, radiogruppen skjult, SM-1 og SM-2 bekreftet for testeksempel 01 på den adressen før første test. Prototype av forklaringspanelet med tallene fra testeksempel 01 for de fire kritiske delene, prøvd på 1–2 personer, med akseptsjekken for 1366 × 768. Prøvetest rundt 27.11 og rapport i `.docs/brukertest/brukertest-resultat.md`.

### Dekningskart for FR

| FR | Epic | Kort |
|---|---|---|
| FR-1 | Epic 1 | Last opp Excel-mal |
| FR-2 | Epic 1 | Kontroller malens struktur |
| FR-3 | Epic 1 | Kontroller verdiene |
| FR-4 | Epic 1 | Vis alle valideringsfeil samlet |
| FR-27 | Epic 1 | Introduksjonsside, veiledning og nedlasting av mal og testeksempel 01 |
| FR-5 | Epic 2 | Bruttobehov |
| FR-28 | Epic 2 | Felles deler én gang |
| FR-6 | Epic 2 | Disponibel beholdning, nettobehov og fremskynding |
| FR-7 | Epic 2 | Planlagte ordremottak og forventet lagerbeholdning |
| FR-8 | Epic 2 | Planlagte ordrefrigivelser og forfalt frigivelse |
| FR-9 | Epic 2 | Ledetid overskrider horisont |
| FR-10 | Epic 2 | Bestilling forsinket |
| FR-11 | Epic 2 | Bruk av sikkerhetslager |
| FR-12 | Epic 2 | Mottak forsinket |
| FR-29 | Epic 2 | Kanseller mottak |
| FR-13 | Epic 2 | Kritiske deler |
| FR-14 | Epic 2 | Resultattabell per del |
| FR-15 | Epic 2 | Eksepsjonsmarkør i tabellen (meldingen i panelet kommer i Epic 3) |
| FR-16 | Epic 2 | Kritiske deler øverst og filteret «Vis bare kritiske deler» |
| FR-17 | Epic 2 | Bestillingsforslag med ukefilter |
| FR-18 | Epic 3 | Forklaringspanelet |
| FR-19 | Epic 4 | Siste kjøring per ferdigprodukt i nettleseren |
| FR-20 | Epic 4 | Før/etter-sammenligning |
| FR-21 | Epic 4 | Slett lagret kjøring |
| FR-22 | Epic 4 | Eksport til Excel |
| FR-23 | Epic 4 | Arket Sammenligning i eksporten |
| FR-30 | Epic 5 | Valg av beregning |
| FR-31 | Epic 5 | Beregn produksjonskapasitet |
| FR-32 | Epic 5 | Fra lager og med planlagte mottak |
| FR-33 | Epic 5 | Begrensende deler med årsak |
| FR-34 | Epic 5 | Kapasitetspanelet |
| FR-24 | Epic 6 | Les partistørrelse |
| FR-25 | Epic 6 | Beregn med fast partistørrelse |
| FR-26 | Epic 6 | Vis bestillingsregel |

Alle 34 FR-ene er dekket, hver i nøyaktig ett epic. NFR-ene og UX-DR-ene fordeles på stories i hvert epic.

## Epic-liste

Epicene følger trinnene i PRD §7.1, så hvert epic slutter ved en milepæl: prøvetesten rundt 27.11 (Epic 1–3), kuttmøtet 30.11 (Epic 4) og brukertesten 2.–7.12. Ingen epic trenger et senere epic for å virke.

```text
Epic 1 → Epic 2 → Epic 3   (trinn 1–2, før prøvetesten rundt 27.11)
            ├──→ Epic 4    (trinn 3, testet innen 30.11)
            ├──→ Epic 5    (trinn 4, bruker struktur og netting fra Epic 2)
            └──→ Epic 6    (trinn 5, bruker nettingen. FR-26 berører også Epic 3 og 4)
```

Når Story 1.2 (delte typer) er flettet inn, kan lesing og validering i Epic 1 og beregningskjernen i Epic 2 bygges samtidig (arkitektur kap. 8).

### Epic 1: Kari kan sjekke Excel-filen sin i appen

Kari åpner appen, ser introduksjonssiden, laster ned malen og testeksempel 01 fra startsiden og leser Veiledning. Hun laster opp filen og får alle valideringsfeil og feil i hele filen samlet, eller beskjed om at filen er gyldig. Epicet legger også grunnlaget: prosjektoppsett (Story 0 i arkitekturen), delte typer (Story 1 i arkitekturen), appmeny med lys og mørk visning, ruting, worker og styring av kjøringen, og publisering på Vercel. Trinn 1.

**FR-er:** FR-1, FR-2, FR-3, FR-4, FR-27
**NFR-er:** NFR-3, NFR-4, NFR-6, NFR-7, NFR-9, NFR-11 (lesing)

### Epic 2: Kari ser bestillingsplanen og hva som krever handling

En gyldig fil gir en beregnet plan: kjøringslinje, tallbokser, «Slik leser du resultatet», kritiske deler, bestillingsforslag med ukefilter og resultattabell med eksepsjonsmarkører og filteret «Vis bare kritiske deler». Epicet har struktur, netting, beregning og eksepsjoner med fasittester for testeksempel 01–04, og ytelsesmåling med 1000 rader før tabellstrukturen låses. Trinn 1.

**FR-er:** FR-5, FR-6, FR-7, FR-8, FR-28, FR-9, FR-10, FR-11, FR-12, FR-29, FR-13, FR-14, FR-15, FR-16, FR-17
**NFR-er:** NFR-1, NFR-2, NFR-5, NFR-8

### Epic 3: Kari forstår hvert tall og hver eksepsjon

Forklaringspanelet med fire lag og eksepsjonen først, tastatur og fokus, og hopp fra kritiske deler, bestillingsforslag og tabellen. Epicet slutter med brukertestbygget (`brukertest`-branch), tastatur- og NVDA-testen og klargjøring til prøvetesten. Trinn 2.

**FR-er:** FR-18 (og meldingen ved klikk i FR-15 og hoppet i FR-16)
**UX:** UX-DR26, UX-DR33, UX-DR36

### Epic 4: Kari følger planen fra kjøring til kjøring og tar den med seg

Lagring av siste kjøring per ferdigprodukt, før/etter-sammenligning (Endringer), siden Lagrede kjøringer med sletting, blokkert lagring og eksport til Excel med arket Sammenligning. Med eksporttesten i Excel for Windows og Mac. Trinn 3, siste del av minstekravet for innlevering.

**FR-er:** FR-19, FR-20, FR-21, FR-22, FR-23
**NFR-er:** NFR-10, NFR-11 (eksport)

### Epic 5: Kari svarer på hasteforespørsler med produksjonskapasitet

Valg av beregning på startsiden, produksjonskapasitet fra lager og med planlagte mottak, begrensende deler med årsak og kapasitetspanelet, med fasittest mot testeksempel 05. Innfører byggflagget `VITE_KAPASITET`. Trinn 4, kuttes først.

**FR-er:** FR-30, FR-31, FR-32, FR-33, FR-34

### Epic 6: Kari planlegger med fast partistørrelse

Valgfri kolonne «Partistørrelse», avrunding til hele partier, og bestillingsregelen i tabellen, forklaringen og eksporten, med et nytt testeksempel og fasit. Eget, senere epic, slik faglærer anbefalte (PRD §4.7). Trinn 5, kuttes først.

**FR-er:** FR-24, FR-25, FR-26

### Rekkefølge mot prøvetesten

Laget med pre-mortem, subtraksjon og reverse engineering 23.11. Story-numrene viser rekkefølgen innen et epic. Tabellen viser hva som må være ferdig når.

**Det prøvetesten trenger:** introduksjonssiden i et privat vindu, opplasting av testeksempel 01, Resultat med «Kontorstol Basic (100-002)» og «Horisont: 10 uker», de tre oppgavene (finn en kritisk del, forklar eksepsjonen for hjul i panelet, les av første forslag for Rygg) og nullstillingen mellom lappene (Esc, ukefilteret, «Vis bare kritiske deler» og rulling til toppen).

**Korteste vei (25 stories):**

```text
1.1 → 1.2 ─┬→ 1.3 → 1.4 (introduksjonsside og startside)
           ├→ 1.5 → 1.6 → 1.9 ─┐
           ├→ 1.7 ─────────────┼→ 1.10 → 1.11
           └→ 2.1 → 2.2 → 2.3 → 2.4 → 2.5
1.11 + 2.5 → 2.6 → 2.7 → 2.8 → 2.9 → 2.10 og 2.11 → 3.1 → 3.2 → 3.3 → 3.5
```

2.8 og 2.9 er med før prøvetesten fordi 2.10, 3.2 og 3.3 bygger på tastaturstyringen i 2.9, og ytelsen skal måles før den låser tabellstrukturen (AD-14).

| Når | Stories |
|---|---|
| Før prøvetesten (23.–27.11) | 1.1–1.7, 1.9–1.11, hele Epic 2, 3.1–3.3, 3.5 |
| 28.–30.11, før kuttmøtet | 1.8, 1.12, 1.13, 3.4 og hele Epic 4 |
| Etter 30.11, hvis gruppen bestemmer det | Epic 5 og 6 |

**Tiltak mot det som kan stoppe prøvetesten:**

- **Story 1.1 og 1.2 tidsavgrenses til dag 1**, med én eller to personer. Typene kan justeres senere etter regelen i AD-3, så diskusjonen om dem skal ikke stoppe de andre.
- **Fasit 01 først.** Beregningen og eksepsjonene (2.2, 2.3) gjøres grønne mot fasit 01, som er filen i prøvetesten, før 02–04. `lag_testdata.py` kan leses som spesifikasjon, men importeres aldri (AD-16).
- **Faste seksjoner i `tekster/nb.ts`** fra Story 1.1, så flere kan legge til tekster samtidig uten flettekonflikter.
- **Gruppemeldingen sendes nå**, ikke i Story 3.5: introduksjonen til brukertesten (PRD §9 nr. 4) og hvem som gjør prøvetesten må være avgjort før 27.11.

**Til gruppen (ikke avgjort her):**

- EXPERIENCE.md sier at tastatur- og NVDA-testen (3.4) skal gjøres før prøvetesten. Med planen over kommer den etter prøvetesten, men før brukertesten 2.12. Tastaturstyringen (2.9) er bygd før prøvetesten. Gruppen godkjenner dette, eller 3.4 flyttes tilbake før prøvetesten.
- Planen har 25 stories før 27.11 og 9 stories, med hele Epic 4, fra 28. til 30.11. Gruppen vurderer om datoene for prøvetesten og kuttmøtet holder.

## Epic 1: Kari kan sjekke Excel-filen sin i appen

Kari åpner appen, ser introduksjonssiden, laster ned malen og testeksempel 01 fra startsiden og leser Veiledning. Hun laster opp filen og får alle valideringsfeil og feil i hele filen samlet, eller kommer til Resultat med kjøringslinjen når filen er gyldig. Epicet legger også grunnlaget for resten: prosjektoppsett, delte typer, appskall, stykklistestruktur, worker og publisering. Trinn 1.

**Parallelt arbeid:** når Story 1.2 er flettet inn, kan tre spor gå samtidig: skjermene (1.3 → 1.4), lesing og validering (1.5 → 1.6 → 1.8 og 1.9) og stykklistestrukturen (1.7).

### Story 1.1: Prosjektoppsett

Som utvikler i gruppen,
vil jeg ha et ferdig oppsatt prosjekt med kommandoene, testene og kontrollene arkitekturen krever,
slik at alle kan begynne på sin story med samme verktøy, og ingen kan bryte grensene i arkitekturen uten at en test feiler.

**Acceptance Criteria:**

**Gitt** et repo med `testdata/`
**Når** prosjektet settes opp fra Vite-malen `react-ts`
**Så** finnes mappestrukturen fra arkitektur kap. 2 (`src/domene/`, `tekster/`, `excel/`, `lagring/`, `worker/`, `app/`, `ui/`, `public/`, `tests/`, `e2e/`)
**Og** TypeScript kjører med `strict`, og `package.json` har `engines` med Node 22.12+, 24 og 26 (`^22.12.0 || ^24.0.0 || ^26.0.0`)
**Og** `.npmrc` har `engine-strict=true` og `allow-remote=root`, så bare SheetJS kan installeres fra en nettadresse (AD-18)

**Gitt** `package.json`
**Når** avhengighetene installeres
**Så** har alle eksakt versjon fra arkitektur kap. 5, uten `^` og `~`, og `package-lock.json` er committet (AD-18)
**Og** SheetJS er installert fra `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz`, ikke fra npm (AD-15)
**Og** IBM Plex Sans, Sans Condensed og Mono er installert via `@fontsource` (AD-1)

**Gitt** prosjektet er klonet på en ny maskin
**Når** utvikleren kjører `npm ci`, `npm run dev`, `npm test`, `npm run lint`, `npm run build` og `npm run test:e2e`
**Så** virker alle kommandoene, og README beskriver dem (NFR-3)
**Og** `npm test` kjører uten nett, nøkler eller kontoer, og `npm run test:e2e` er ikke med i `npm test`
**Og** Playwright er satt opp for Chromium og Firefox, som dekker Chrome, Edge og Firefox på PC (NFR-6)

**Gitt** arkitekturtesten i `tests/arkitektur.test.ts`
**Når** en fil i `src/` importerer noe tabellen i arkitektur kap. 2 ikke tillater, eller en avhengighet har `^` eller `~`
**Så** feiler `npm test` med en melding som sier hvilken fil og hvilken regel
**Og** testen feiler hvis en fil i `src/domene/` bruker `window`, `document`, `localStorage`, `Date.now`, `new Date()` eller `Math.random` (AD-2)
**Og** testen feiler hvis noe utenfor `src/excel/` importerer SheetJS, unntatt testhjelperne `tests/hjelpere/fasit-leser.ts` og `tests/hjelpere/lag-arbeidsbok.ts` (AD-15)

**Gitt** `vercel.json`
**Når** den leses
**Så** setter den nøyaktig Content Security Policy fra AD-17, så nettleseren selv stopper forsøk på å sende data ut (NFR-4)
**Og** den setter `X-Content-Type-Options: nosniff` og `Referrer-Policy: no-referrer`, og ingen andre hoder (AD-17)
**Og** `vite preview` bruker samme CSP og samme hoder, og en test feiler hvis de er ulike
**Og** alle e2e-testene bruker vakten i `e2e/csp-vakt.ts`, som feiler testen ved brudd på CSP-en, konsollfeil og unntak, og en test viser at vakten virker (AD-17)

**Gitt** `public/COSI-MRP-mal.xlsx` og `public/testeksempel-01.xlsx`
**Når** testene kjører
**Så** sjekker en test at de er byte for byte like filene i `testdata/` (FR-27, AD-16)

**Gitt** `src/tekster/nb.ts`
**Når** den lages
**Så** har den faste seksjoner per område (felles, filfeil og validering, eksepsjoner, forklaringer, resultat, lagring og eksport, kapasitet), så flere kan legge til tekster samtidig uten flettekonflikter (AD-9)
**Og** en kommentar øverst sier at nye tekster legges inn i sin egen seksjon

### Story 1.2: Delte typer

Som utvikler i gruppen,
vil jeg ha alle delte typer i én fil før noen bygger på dem,
slik at lesing, validering, beregning og UI kan bygges samtidig uten egne versjoner av de samme dataene.

**Acceptance Criteria:**

**Gitt** `src/domene/typer.ts`
**Når** storyen er ferdig
**Så** finnes typene fra AD-3: `RaaArk`, `Inndata`, `Struktur`, `DelResultat`, `Utregning`, `Resultat`, `Eksepsjon`, `Valideringsfeil`, `Filfeil`, `Kapasitet`, `LagretKjoring`, `Sammenligning`, `Kjoring` og valget (bestillingsplan, produksjonskapasitet eller begge)
**Og** typene følger datakonvensjonene i AD-4: varenummer og nivå er tekst, serier per uke har lengde H, forfalt mengde er eget felt, og planlagte mottak er enkeltlinjer med Excel-rad
**Og** svar som kan feile, har formen `{ ok: true, verdi } | { ok: false, feil }` (AD-5)

**Gitt** typen `Eksepsjon`
**Når** den leses
**Så** har den én variant per kode (`LEDETID_OVERSKRIDER_HORISONT`, `BESTILLING_FORSINKET`, `BRUK_AV_SIKKERHETSLAGER`, `MOTTAK_FORSINKET`, `KANSELLER_MOTTAK`), og hver variant har felt for alle opplysningene FR-9–FR-12 og FR-29 sier meldingen skal ha (AD-9)

**Gitt** typen `Filfeil`
**Når** den leses
**Så** har den kodene for ikke `.xlsx`, tom fil, skadet fil, ikke en Excel-fil og passordbeskyttet fil (NFR-9, EXPERIENCE.md › Feil i hele filen)
**Og** passordbeskyttet fil er en ny kode i tillegg til de tre i AD-5, og endringen er ført inn i arkitektur kap. 12 med dato

**Gitt** typen `Utregning`
**Når** den leses
**Så** har den alle tallene forklaringspanelet trenger (AD-8): beholdning forrige uke, planlagte mottak, bruttobehov fordelt på overordnede deler (varenummer, frigivelse, antall), disponibel beholdning før og etter fremskynding, SS, nettobehov, fremskyndede mottak og forfalt mengde

**Gitt** pull requesten for `typer.ts`
**Når** den skal flettes
**Så** er den godkjent av koordinatoren (Idun) og minst én som skal bruke typene (AD-3)
**Og** en kommentar øverst i `typer.ts` sier at endringer skjer i egen pull request med samme godkjenning
**Og** `npm run build` og `npm test` er grønne

### Story 1.3: Appskall med appmeny og ruting

Som Kari,
vil jeg åpne appen fra en lenke og flytte meg mellom sidene i appmenyen,
slik at jeg finner fram uten installasjon.

**Acceptance Criteria:**

**Gitt** DESIGN.md
**Når** `ui/felles/tokens.css` lages
**Så** er tokenene for lys visning CSS-variabler i én fil, og komponentene bruker bare variablene (AD-1, UX-DR1)
**Og** mørk visning og kontrollen av kontrasten kommer i Story 1.13

**Gitt** appen er åpnet
**Når** Kari ser på siden
**Så** står appmenyen fast til venstre med logo og Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer og Veiledning, og aktiv side er markert (UX-DR3)
**Og** hver visning har sin adresse (`#/introduksjon`, `#/ny-kjoring`, `#/resultat`, `#/lagrede-kjoringer`, `#/veiledning`), én synlig h1 og egen sidetittel (AD-13, UX-DR4)
**Og** Tilbake og Frem i nettleseren følger adressene, og en visning kan bokmerkes

**Gitt** appen åpnes uten adresse eller med en ukjent adresse
**Når** `cosi-mrp:intro-sett` ikke finnes i nettleseren
**Så** går appen til `#/introduksjon` og lagrer `cosi-mrp:intro-sett`
**Og** ved neste besøk går appen til `#/ny-kjoring` (FR-27, AD-10)

**Gitt** at lagring i nettleseren er blokkert
**Når** appen åpnes
**Så** virker appen som vanlig, og introduksjonssiden vises ved hvert besøk (AD-10)
**Og** bare `src/lagring/` bruker `localStorage`, og hver lesing og skriving står i `try/catch`

**Gitt** `#/resultat` åpnes uten en kjøring i minnet, for eksempel etter reload
**Når** siden vises
**Så** står en kort melding med lenke til Ny kjøring (AD-13, UX-DR27)

**Gitt** en feil under tegning av en visning
**Når** feilgrensen fanger den
**Så** vises en norsk reservemelding med lenke til Ny kjøring, og Kari kan fortsette uten å laste siden på nytt (AD-5)

**Gitt** rotkomponenten
**Når** appen er lastet
**Så** finnes én `role="status"`-region som aldri byttes ut, og felles tilstand ligger i React Context med `useReducer` i `app/tilstand.tsx` (AD-13)

**Gitt** prosjektet på Vercel
**Når** en branch pushes og `main` oppdateres
**Så** får branchen en forhåndsvisning, og `main` publiseres til produksjon som statiske filer (AD-17)
**Og** Vercel bruker Node 24 (se byggeloggen, og lås 24 i prosjektinnstillingene hvis Vercel velger en annen), Analytics og Speed Insights er av, og toolbaren er av på forhåndsvisningene
**Og** Vercel sender `Strict-Transport-Security` på forhåndsvisningen og i produksjon, i tillegg til hodene fra `vercel.json` (AD-17)
**Og** en Playwright-test åpner alle fem visningene i Chromium og Firefox uten brudd på CSP-en

### Story 1.4: Introduksjonsside, startside og Veiledning

Som Kari, som bruker appen for første gang,
vil jeg få vite hva appen gjør, laste ned malen og testeksempelet og lese en kort veiledning,
slik at jeg kommer i gang uten hjelp fra utviklerne.

**Acceptance Criteria:**

**Gitt** første besøk i en nettleser
**Når** introduksjonssiden vises
**Så** har den overskriften (40 px), to korte avsnitt om hva appen gjør, de tre stegene (fyll ut malen, last opp, les resultatet) i tre bokser og primærknappen «Kom i gang» (UX-DR6)
**Og** «Kom i gang» går til startsiden

**Gitt** startsiden (`#/ny-kjoring`)
**Når** den vises
**Så** er h1 «Ny kjøring», og rett under står «Hver fil gjelder ett ferdigprodukt. Lageret for deler som brukes i flere ferdigprodukter, må du fordele mellom filene selv.» (FR-27, UX-DR7)
**Og** under står de tre nummererte kortene «Fyll ut Excel-malen», «Last opp filen» og «Velg hva du vil beregne, og beregn»
**Og** det første kortet sier at arket Veiledning i malen forklarer utfyllingen

**Gitt** det første kortet
**Når** Kari klikker «Last ned Excel-malen» eller «Last ned testeksempel 01»
**Så** lastes `COSI-MRP-mal.xlsx` eller `testeksempel-01.xlsx` ned fra `public/` med vanlige lenker med `download` (FR-27)

**Gitt** Veiledning (`#/veiledning`)
**Når** siden vises
**Så** forklarer den hvordan nettsiden brukes, med nummererte overskrifter og primærknappen «Til Ny kjøring» nederst (UX-DR31)

**Gitt** et vindu på 1366 × 630 px ved 100 % zoom
**Når** startsiden vises
**Så** er alle tre kortene synlige uten rulling (DESIGN.md › Layout & Spacing)

**Gitt** all tekst på sidene
**Når** den vises
**Så** kommer den fra `tekster/nb.ts` og følger ordbanken (NFR-7, AD-9)

**Gitt** Playwright
**Når** testen åpner appen i en ny nettleserkontekst, og så på nytt i samme kontekst
**Så** vises introduksjonssiden første gang og startsiden andre gang (FR-27)

### Story 1.5: Les Excel-filen

Som Kari,
vil jeg at appen leser Excel-filen min slik Excel lagret den, og sier tydelig fra hvis filen ikke kan leses i det hele tatt,
slik at jeg vet om jeg må lagre filen på nytt før noe kan kontrolleres.

**Acceptance Criteria:**

**Gitt** `excel/les.ts` får filens innhold og filnavnet
**Når** filen er en lesbar `.xlsx`
**Så** gir den `RaaArk` med arkene Stykkliste, MPS og Planlagte mottak: overskrifter, rader som rå celleverdier og Excel-radnummeret for hver rad (AD-15)
**Og** ark og kolonner finnes etter navn, ikke plass, og et ark eller en overskrift som mangler, merkes som manglende uten at lesingen feiler
**Og** den leser lagrede verdier og aldri formler, og arkene Veiledning og Veien videre, Kontroll-kolonnen og hjelpekolonnene leses ikke (FR-2)

**Gitt** arket Stykkliste
**Når** det leses
**Så** slutter stykklisten ved første rad der både Nivå og Varenummer er tomme
**Og** Excel-delen leser likevel kolonne A–H til og med rad 1001 og merker om det står noe under den tomme raden, uten å telle formlene i hjelpekolonnene som innhold (AD-15)

**Gitt** nivå eller varenummer er lagret som tall
**Når** de leses
**Så** blir de trimmet tekst: tallet `300001` blir «300001», og `0` blir «0» (NFR-11, AD-4)

**Gitt** filer som ikke kan leses
**Når** `excel/les.ts` får dem
**Så** svarer den med en filfeil og kaster ikke unntak (AD-5): `V-F04.csv` gir ikke `.xlsx` (FR-1), `V-F07.xlsx` skadet fil, `V-F08.xlsx` (0 byte) tom fil, `V-F09.xlsx` (tekstfil) ikke en Excel-fil, og en passordbeskyttet `.xlsx` passordbeskyttet
**Og** en passordbeskyttet testfil lagret fra Excel er lagt inn som `testdata/validering/V-F10.xlsx`, og `testdata/validering/README.md` har en linje for den

**Gitt** `testeksempel-01.xlsx`–`testeksempel-05.xlsx` og alle filene i `testdata/validering/` utenom V-F04 og V-F07–V-F10
**Når** de leses
**Så** gir alle `RaaArk` uten filfeil
**Og** Excel-delen avgjør aldri om en verdi er feil. Det gjør valideringen

**Gitt** testhjelperen `tests/hjelpere/lag-arbeidsbok.ts`, som bare skriver arbeidsbøker med SheetJS (AD-15)
**Når** testene trenger små tilfeller for logikken, for eksempel varenummer og nivå lagret som tall, innhold under en tom rad, et ark eller en overskrift som mangler, eller kolonner i en annen rekkefølge
**Så** lager testen arbeidsboka med hjelperen og gir bytene til `excel/les.ts` som en opplastet fil
**Og** formler med lagret verdi, hjelpekolonnene, Kontroll-kolonnen, passordbeskyttet, skadet og tom fil testes med filer lagret fra Excel i `testdata/`, ikke med arbeidsbøker laget av SheetJS (NFR-11, AD-16)

### Story 1.6: Kontroll av malens struktur

Som Kari,
vil jeg få vite om filen min mangler et ark eller en kolonneoverskrift fra malen,
slik at jeg kan rette filen, eller bytte til den nye malen hvis jeg har brukt den gamle.

**Acceptance Criteria:**

**Gitt** `domene/valider.ts` får `RaaArk`
**Når** et av arkene Stykkliste, MPS eller Planlagte mottak mangler, eller en kolonneoverskrift fra malen mangler
**Så** gir valideringen én valideringsfeil som nevner arket og hva som mangler (FR-2)
**Og** valideringsfeilen har kode, ark, rad eller celle, felt og verdi, men ingen ferdig tekst (AD-9)
**Og** `tekster/nb.ts` har én mal per kode

**Gitt** en fil etter den gamle malen, med arkene Produkt og Komponenter
**Når** den valideres
**Så** gir den én feil om at arket Stykkliste mangler, med en kode som sier at filen ser ut til å følge den gamle malen (`V-F03.xlsx`)

**Gitt** et ark eller en kolonne mangler
**Når** resten av filen valideres
**Så** kontrolleres verdiene som ikke avhenger av det som mangler, og kontrollene som avhenger av det, hoppes over (FR-2)
**Og** uten arket MPS kontrolleres ikke ukene i Planlagte mottak, og uten en kolonne kontrolleres ikke verdiene i den
**Og** valideringen sier hvilke kontroller som er hoppet over, så feiloppsummeringen kan vise det (UX-DR11)

**Gitt** valideringstilfellene for strukturen
**Når** testene kjører
**Så** gir `V-F01.xlsx` (MPS mangler), `V-F02.xlsx` («Ledetid (uker)» mangler) og `V-F03.xlsx` hver nøyaktig én feil på arket og stedet i `testdata/validering/README.md`
**Og** `V-F06.xlsx` gir strukturfeilen på H1. Hele filen, med verdifeilen, testes i Story 1.12

**Gitt** en hjelpefunksjon for heltall
**Når** den får en celleverdi
**Så** godtar den et tall som er et heltall, og en tekst som etter trimming er `^-?[0-9]+$`, for eksempel «7» og «007» (AD-4, FR-3)
**Og** den avviser desimaltall (1,5, «30,5», `30.5`), ord («fem»), tusenskilletegn («1 000»), plusstegn og tekst som «ca. 40»
**Og** den har egne enhetstester for hvert av tilfellene over

**Gitt** valideringen
**Når** den er ferdig
**Så** har den samlet alle feilene før den svarer, og den kaster ikke unntak for feil i brukerens data (AD-5)

### Story 1.7: Stykklistestruktur

Som utvikler i gruppen,
vil jeg ha én funksjon som bygger stykklistestrukturen fra stykklisteradene,
slik at valideringen, beregningen, eksepsjonene og kapasiteten bruker de samme overordnede delene, lavnivåkodene og ledetidene fra ferdigproduktet.

**Acceptance Criteria:**

**Gitt** stykklisterader med gyldige nivåer
**Når** `domene/struktur.ts` bygger `Struktur`
**Så** er overordnet del nærmeste rad over med ett nivå høyere, og like varenumre er slått sammen til én del (AD-6)
**Og** delene står i stykklisterekkefølge, og en felles del står der den står første gang (FR-16)
**Og** lagerbeholdning, sikkerhetslager og ledetid hentes fra første rad med varenummeret (FR-28)

**Gitt** en del
**Når** strukturen er bygd
**Så** har den overordnede deler med antall, lavnivåkode (lengste vei fra ferdigproduktet, så en del alltid kommer etter delene den står under, FR-28; i vanlige stykklister det samme som største nivåtall delen står på), ledetid fra ferdigproduktet (lengste sti, FR-9) og antall per ferdigprodukt (produktet av antallene langs stien, summert over alle stedene delen står, FR-31)
**Og** en del med underdeler under flere forekomster har underdelene per forekomst, så valideringen kan sammenligne dem (FR-3)
**Og** underdeler som står likt under flere forekomster, eller bare under én, regnes én gang (FR-3, FR-28)

**Gitt** strukturen
**Når** beregningsrekkefølgen hentes
**Så** står delene etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge (AD-6)

**Gitt** testene
**Når** de kjører
**Så** stemmer strukturen for testeksempel 02 med skruesett M6 brukt 4 per sete og 2 per rygg (FR-28), og for testeksempel 04 med en del som står både på nivå .1 og ..2
**Og** 300-006 Stolfot i testeksempel 01 har ledetid fra ferdigproduktet 10
**Og** med L = 1 for ferdigproduktet, L = 4 på nivå .1 og L = 5 på nivå ..2 er ledetiden fra ferdigproduktet 10 for underdelen og 5 for delen på nivå .1 (FR-9)
**Og** `struktur.ts` importerer bare fra `src/domene/`, og ingen annen fil bygger `Struktur`

### Story 1.8: Kontroll av arket Stykkliste

Som Kari,
vil jeg at appen finner hver feil i stykklisten, også når Excel ikke stoppet den, for eksempel etter innliming,
slik at beregningen aldri bygger på en stykkliste som ikke følger reglene.

**Acceptance Criteria:**

**Gitt** arket Stykkliste
**Når** det valideres
**Så** kontrolleres alle reglene for Stykkliste i FR-3: rader, nivå, varenummer, beskrivelse, antall, type, underdeler, lagerbeholdning, sikkerhetslager og ledetid (uker)
**Og** reglene om underdeler bruker `Struktur` fra Story 1.7 (AD-6)
**Og** `tekster/nb.ts` har én mal per regel, med sted og felt først (UX-DR5)

**Gitt** hver av filene `V-S01.xlsx`–`V-S29.xlsx`
**Når** testen for filen kjører
**Så** gir filen nøyaktig én valideringsfeil med arket, stedet og feltet i `testdata/validering/README.md` (SM-4, AD-16)
**Og** `V-S01.xlsx` gir én feil på rad 9, fordi det står innhold under den tomme raden, og radene under leses ikke (FR-3)
**Og** `V-S03.xlsx` (1001 rader) gir én feil på rad 1002
**Og** `V-S05.xlsx` og `V-S19.xlsx` gir ingen ekstra feil for at det ikke finnes en rad med typen Ferdigvare

**Gitt** en verdi limt inn i en celle med nedtrekksliste, for eksempel nivå «3» eller typen «Delmontering»
**Når** den valideres
**Så** gir den en valideringsfeil (FR-3)

**Gitt** en del som produseres selv og står to ganger
**Når** underdelene er like under begge forekomstene, eller står under bare én av dem
**Så** er filen gyldig (`V-G04.xlsx` gir 0 feil)
**Og** et annet antall eller en annen underdel under andre forekomst gir én feil som nevner varenummeret og begge radene (`V-S22.xlsx`)

**Gitt** et antall lagret som teksten «7»
**Når** det valideres
**Så** godtas det som tallet 7, mens «fem» (`V-S16.xlsx`) og 1,5 (`V-S15.xlsx`) gir hver sin feil (FR-3, AD-4)

**Gitt** formlene i hjelpekolonnene og de tomme, formaterte radene ned til rad 1001 i malen
**Når** stykklisten valideres
**Så** regnes de ikke som innhold under stykklisten

### Story 1.9: Kontroll av MPS og Planlagte mottak

Som Kari,
vil jeg at appen kontrollerer prognostiserte behov og planlagte mottak, og at alle feilene i filen samles,
slik at jeg kan rette alt på én gang, også etter at jeg har kopiert forrige ukes fil.

**Acceptance Criteria:**

**Gitt** arket MPS
**Når** det valideres
**Så** er horisonten antall sammenhengende utfylte uker fra uke 1, og den må være 8–12 (FR-3)
**Og** antall ferdigprodukter er heltall ≥ 0, og en uke fylt ut etter et hull gir feil på den uken

**Gitt** arket Planlagte mottak
**Når** det valideres
**Så** finnes varenummeret i Stykkliste (tallet 300001 og teksten «300001» er samme varenummer), uke er heltall fra 1 til H, og antall er heltall ≥ 1 (FR-3, AD-4)
**Og** et tomt ark Planlagte mottak er gyldig

**Gitt** valideringstilfellene
**Når** testene kjører
**Så** gir `V-M01.xlsx`–`V-M05.xlsx` og `V-P01.xlsx`–`V-P04.xlsx` hver nøyaktig én feil på stedet i `testdata/validering/README.md`
**Og** `V-G01.xlsx` (H = 8), `V-G02.xlsx` (H = 12) og `V-G03.xlsx` (tomt ark Planlagte mottak) gir 0 feil
**Og** feilene i MPS og Planlagte mottak i `V-F05.xlsx` og `V-F06.xlsx` finnes. Hele filene, med feilene i Stykkliste, testes i Story 1.12

**Gitt** en fil uten valideringsfeil
**Når** valideringen er ferdig
**Så** gir den `Inndata`: stykklisterader med Excel-rad, horisont H, prognostiserte behov som en liste med lengde H, og planlagte mottak som enkeltlinjer med varenummer, uke, antall og Excel-rad, ikke lagt sammen (AD-4)
**Og** `testeksempel-01.xlsx`–`testeksempel-05.xlsx` gir `Inndata` uten feil
**Og** storyen bygger ikke på Story 1.8, så kjøringen (1.10) kan bygges før alle reglene for Stykkliste er ferdige

### Story 1.10: Kjøring i en Web Worker

Som Kari,
vil jeg at siden aldri fryser eller henger mens appen leser og kontrollerer filen,
slik at jeg alltid kan laste opp en ny fil, også når noe går galt.

**Acceptance Criteria:**

**Gitt** `worker/beregning.worker.ts`
**Når** styringen starter en kjøring
**Så** lages worker-en med `new Worker(new URL('./beregning.worker.ts', import.meta.url), { type: 'module' })`, og den får filens innhold som overført `ArrayBuffer`, filnavnet og valget (AD-12)
**Og** den kjører `excel/les` og `domene/valider` og svarer med én melding: gyldige data, valideringsfeilene, en filfeil eller `UVENTET_FEIL`
**Og** meldingstypene står i `worker/meldinger.ts` og bruker typene fra `domene/typer.ts`, med plass til resultatet og kapasiteten som Epic 2 og 5 fyller

**Gitt** en uventet feil i lesing eller validering
**Når** worker-en fanger den
**Så** svarer den med `UVENTET_FEIL` og sender aldri et halvt resultat (AD-5)
**Og** worker-en har ingen tilstand mellom kjøringer, rører ikke `localStorage` og har ingen tilgang til DOM-en

**Gitt** `app/kjoring.ts`
**Når** en kjøring pågår
**Så** starter et nytt kall ingen ny kjøring (AD-12)
**Og** har worker-en ikke svart innen 30 sekunder, stopper styringen den med `terminate()` og gir uventet feil (AD-5)
**Og** en worker som krasjer (`error` eller `messageerror`), gir uventet feil

**Gitt** et svar med gyldige data
**Når** styringen lager `Kjoring`
**Så** har den valget, filnavnet, tidspunktet (satt i styringen, ikke i kjernen, AD-2), ferdigproduktets varenummer og beskrivelse og horisonten
**Og** `Kjoring` gis til tilstanden, og appen går til `#/resultat`

**Gitt** enhetstestene for `app/kjoring.ts`
**Når** de kjører med en falsk worker og falske tidtakere
**Så** dekker de gyldig svar, valideringsfeil, filfeil, `UVENTET_FEIL`, krasj, tidsgrense og nytt kall under en kjøring

### Story 1.11: Opplasting og Beregn på startsiden

Som Kari,
vil jeg dra filen inn eller velge den med en knapp, trykke Beregn og se hva som skjer,
slik at jeg vet at filen er lest, og kommer til Resultat for ferdigproduktet mitt.

**Acceptance Criteria:**

**Gitt** kortet «Last opp filen» på startsiden
**Når** Kari drar en fil over opplastingssonen
**Så** får sonen valgt-tone, og et slipp utenfor sonen gjør ingenting (UX-DR8)
**Og** «Velg fil» er en ekte `<button>` som åpner et skjult `<input type="file" accept=".xlsx">`, og fokus går tilbake til knappen etter fildialogen
**Og** dra og slipp og «Velg fil» går gjennom samme kontroll, og valgt fil vises med navnet
**Og** slipper Kari flere filer, brukes ingen, og sonen sier «Slipp bare én fil. Ingen av filene er lest.»

**Gitt** Beregn i det tredje kortet
**Når** Kari trykker uten valgt fil
**Så** står «Velg en fil først.», og fokus flyttes til «Velg fil». Beregn deaktiveres aldri (UX-DR10)
**Og** med valgt fil viser statusregionen «Leser filen …» og så «Beregner …», uten overlegg eller spinner

**Gitt** en fil med feil i hele filen
**Når** Kari trykker Beregn
**Så** står én melding i opplastingssonen med teksten fra EXPERIENCE.md › Feil i hele filen (UX-DR12, NFR-9)
**Og** filvalget nullstilles, så samme filnavn kan velges på nytt, og sonen er fortsatt aktiv

**Gitt** en gyldig fil
**Når** kjøringen er ferdig
**Så** åpnes Resultat med kjøringslinjen øverst: ferdigproduktets beskrivelse og varenummer, «Horisont: H uker», filnavn, tidspunkt og «Last opp ny fil» (UX-DR13)
**Og** fokus flyttes til den skjulte h1 «Resultat for ‹beskrivelse›», sidetittelen blir «‹beskrivelse› (‹varenummer›) – Resultat – COSI - MRP», og statusregionen kunngjør at kjøringen er ferdig (UX-DR4)
**Og** «Last opp ny fil» og Tilbake i nettleseren går til startsiden

**Gitt** Playwright i Chromium og Firefox
**Når** e2e-testene kjører
**Så** gir opplasting av `testeksempel-01.xlsx` Resultat med «Kontorstol Basic (100-002)» og «Horisont: 10 uker»
**Og** `V-F04.csv`, `V-F07.xlsx`, `V-F08.xlsx` og `V-F09.xlsx` gir hver sin melding, og etterpå gir `testeksempel-01.xlsx` Resultat uten at siden lastes på nytt (NFR-9)
**Og** ingen side gir brudd på CSP-en (AD-16)

### Story 1.12: Feiloppsummering

Som Kari,
vil jeg se alle feilene i filen samlet, med ark, rad og hva som er galt,
slik at jeg kan rette alt i Excel på én gang og vet at den lagrede kjøringen ikke er rørt.

**Acceptance Criteria:**

**Gitt** en fil med minst én valideringsfeil
**Når** Kari trykker Beregn
**Så** gjøres ingen beregning, og feiloppsummeringen står øverst på startsiden over kortene, også ved én feil (FR-4, UX-DR11)
**Og** overskriften er sidens h1, for eksempel «Filen har 3 feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.», og sidetittelen begynner med «Feil:»
**Og** brettet får fokus (`tabindex="-1"`, ingen `role="alert"`)
**Og** den sier at den lagrede kjøringen er urørt

**Gitt** strukturfeil
**Når** feiloppsummeringen vises
**Så** står de først i gruppen «Filen følger ikke malen», og gruppen sier hvilke kontroller som er hoppet over (FR-2)

**Gitt** verdifeil
**Når** feiloppsummeringen vises
**Så** står de gruppert per ark i malens rekkefølge (Stykkliste → Prognostiserte behov (arket MPS) → Planlagte mottak) med antall per ark, sortert etter Excel-rad, og på arket MPS etter uke
**Og** hver linje viser ark, sted, felt og feil i en tabell, med Excel-radnummeret som rad
**Og** like feil i samme kolonne slås sammen med radintervall og antall, for eksempel «Planlagte mottak, rad 4–53, Uke: må være et heltall (50 rader).»
**Og** tekstene følger mønsteret i UJ-4, for eksempel «Planlagte mottak, rad 4, Uke: uke 0 er før horisonten. Første uke i horisonten er uke 1.»

**Gitt** feiloppsummeringen vises
**Når** Kari laster opp en ny fil med andre feil
**Så** oppdateres listen, og fokus flyttes dit på nytt
**Og** filvalget er nullstilt, så en rettet fil med samme navn leses
**Og** en gyldig fil gir Resultat, og feiloppsummeringen er borte

**Gitt** valideringen fra Story 1.6, 1.8 og 1.9
**Når** testene for hele filene kjører
**Så** gir `V-F05.xlsx` nøyaktig tre feil på tre ark (FR-4)
**Og** `V-F06.xlsx` gir nøyaktig to feil: strukturfeilen på H1 og antall 0 på C3 (FR-2, FR-4)

**Gitt** Playwright
**Når** `V-F05.xlsx` lastes opp
**Så** viser feiloppsummeringen tre feil i tre grupper: Stykkliste, Prognostiserte behov (arket MPS) og Planlagte mottak
**Og** `V-F06.xlsx` viser én strukturfeil og én verdifeil

### Story 1.13: Lys og mørk visning

Som Kari,
vil jeg kunne bytte mellom lys og mørk visning,
slik at jeg kan jobbe med det som er behagelig for øynene mine.

**Acceptance Criteria:**

**Gitt** DESIGN.md
**Når** mørk visning legges til i `ui/felles/tokens.css`
**Så** har alle tokenene en `-dark`-variant som settes med `data-visning="mork"` på `<html>`, med de samme variabelnavnene som lys visning (AD-1, UX-DR1)
**Og** kontrasten for parene DESIGN.md ikke har regnet ut (`summary-*` og `exc-*` som tekst på `surface-raised`), er regnet ut i begge visningene og ført inn i DESIGN.md, og par under WCAG 2.1 AA er rettet

**Gitt** knappen «Bytt til mørk» nederst i appmenyen
**Når** Kari trykker på den
**Så** bytter alle sidene til mørk visning, knappen heter «Bytt til lys», og valget lagres i `cosi-mrp:visning` (UX-DR3, AD-10)
**Og** valget leses før siden tegnes første gang, uten inline-skript (CSP), så siden ikke blinker i feil visning
**Og** mangler nøkkelen, er visningen lys

**Gitt** at lagring i nettleseren er blokkert
**Når** Kari bytter visning
**Så** gjelder valget til siden lukkes (AD-10)

**Gitt** Playwright
**Når** Kari bytter til mørk visning og laster siden på nytt
**Så** er visningen fortsatt mørk, og ingen side gir brudd på CSP-en

## Epic 2: Kari ser bestillingsplanen og hva som krever handling

En gyldig fil gir en beregnet plan: tallbokser, seksjonsmeny, «Slik leser du resultatet», kritiske deler, bestillingsforslag med ukefilter og resultattabell med eksepsjonsmarkører og filteret «Vis bare kritiske deler». Beregningen og eksepsjonene er testet mot fasitene for testeksempel 01–04, og ytelsen er målt med 1000 rader før tabellstrukturen låses. Trinn 1.

**Parallelt arbeid:** beregningskjernen (2.1 → 2.4) og skjermene (2.6 → 2.11) kan bygges samtidig. Skjermene bygges mot eksempeldata fra fasit 01 og godkjennes med testeksempel 01 når Story 2.5 er flettet inn (arkitektur kap. 8). Resultattabellen kommer før kritiske deler og bestillingsforslag, fordi hoppene derfra lander i tabellen.

### Story 2.1: Netting for én del

Som utvikler i gruppen,
vil jeg ha én funksjon som regner ut nettingen for én del uke for uke,
slik at bestillingsplanen, kapasiteten og fast partistørrelse bruker samme regler, og reglene kan testes alene.

**Acceptance Criteria:**

**Gitt** `domene/netting.ts` får lagerbeholdning, SS, ledetid, bruttobehov per uke, planlagte mottak som enkeltlinjer og et innstillingsobjekt
**Når** den regner med standardinnstillingene
**Så** gir den per uke disponibel beholdning, nettobehov, planlagt ordremottak, planlagt ordrefrigivelse, forventet lagerbeholdning og fremskyndede mottak etter FR-6–FR-8 (AD-7)
**Og** disponibel(t) = beholdning(t−1) + planlagte mottak(t) − bruttobehov(t), og nettobehov(t) = maks(0, SS − disponibel(t))
**Og** planlagt ordremottak er lik nettobehovet (lot-for-lot), og forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak som ikke er kommet ennå (FR-7)

**Gitt** nettobehov > 0 i uke t og planlagte mottak i senere uker
**Når** nettingen regner
**Så** fremskyndes det første senere mottaket helt til uke t, så det neste, til nettobehovet er dekket eller det ikke finnes flere (FR-6)
**Og** et fremskyndet mottak regnes med én gang, og står fortsatt i uken det er lagt inn i
**Og** et mottak i uke H kan fremskyndes helt til uke 1
**Og** det lages aldri både et planlagt ordremottak og et fremskyndet mottak for det samme nettobehovet, med mindre mottaket er for lite

**Gitt** eksempelet i FR-6 (lagerbeholdning 20, SS 0, bruttobehov 0, 0, 60, 0 og et mottak på 100 i uke 4)
**Når** testen kjører
**Så** er nettobehovet 0 i alle uker, og forventet lagerbeholdning er 20, 20, −40 og 60

**Gitt** et planlagt ordremottak i uke t og ledetid L
**Når** frigivelsen regnes ut
**Så** står den i uke t − L, og er t − L < 1, legges den i uke 1 og merkes med forfalt mengde som eget felt (FR-8, AD-4)
**Og** L = 0 gir frigivelse i samme uke
**Og** flere planlagte mottak for samme varenummer og uke legges sammen i beregningen, men holdes som enkeltlinjer i inndataene (AD-4)

**Gitt** enhetstestene
**Når** de kjører
**Så** dekker de tallene for 300-003 Hjul (uke 1: disponibel −20, nettobehov 50, frigivelse 175 med 50 forfalt) og 300-005 Gassfjær (forventet lagerbeholdning 0 i uke 3 og 80 i uke 4) i testeksempel 01
**Og** `netting.ts` er en ren funksjon i `src/domene/` som kan testes uten Excel-lesing, lagring eller UI (NFR-1), og innstillingsobjektet har plass til kapasitet (FR-31) og fast partistørrelse (FR-25) uten å endre signaturen

### Story 2.2: Beregning nivå for nivå

Som Kari,
vil jeg at appen beregner hele stykklisten fra ferdigproduktet og ned, med felles deler beregnet én gang,
slik at bestillingsplanen stemmer med det jeg ville fått ved å regne for hånd.

**Acceptance Criteria:**

**Gitt** `Inndata` og `Struktur`
**Når** `domene/beregn.ts` beregner
**Så** beregnes delene i rekkefølgen fra `Struktur` (stigende lavnivåkode, så stykklisterekkefølge) (AD-6)
**Og** bruttobehovet for ferdigproduktet er prognostiserte behov, og for de andre delene summen av planlagt ordrefrigivelse for hver overordnet del × antall (FR-5)
**Og** en felles del beregnes én gang med samlet bruttobehov, og lagerbeholdningen brukes én gang (FR-28)
**Og** en forfalt frigivelse for en del på nivå .1 gir bruttobehov i uke 1 for delene under den (FR-8)

**Gitt** beregningen er ferdig
**Når** `Resultat` lages
**Så** har hver del ett `DelResultat` med de seks radene fra FR-14 og en `Utregning` per uke med tallene fra AD-8, også bruttobehovet fordelt på overordnede deler (varenummer, frigivelse, antall)
**Og** `Resultat` har bestillingsforslagene (varenummer, frigivelsesuke, mengde, forfalt mengde, innkjøp eller produksjonsordre), sortert etter frigivelsesuke og så stykklisterekkefølge (FR-17, arkitektur kap. 4)
**Og** samme `Inndata` gir alltid samme `Resultat` (FR-8)

**Gitt** en testhjelper som leser `testdata/*-fasit.xlsx` med SheetJS (unntaket i AD-15)
**Når** fasittestene kjører for testeksempel 01–04 gjennom les, valider og beregn (AD-16)
**Så** er alle tall per del, uke og rad identiske med arket Fasittabell (SM-1)
**Og** bestillingsforslagene er identiske med arket Bestillingsforslag
**Og** bruttobehovet for 300-003 Hjul i testeksempel 01 er 100, 125, 150, 100, 175, 150, 125, 200, 150, 100 (FR-5)
**Og** mottak som er fremskyndet mer enn én uke, gir ingen nye planlagte ordremottak i ukene mellom (200-002 i testeksempel 03, 300-028 i testeksempel 04) (FR-6)

**Gitt** MRP-tabellene i fasit 05
**Når** fasittesten for testeksempel 05 kjører
**Så** sammenlignes de på samme måte, og et avvik meldes til gruppen, som ikke har kontrollert fasit 05 for hånd ennå

**Gitt** én endret regel i beregningen
**Når** fasittestene kjører
**Så** feiler minst én test (NFR-2)

### Story 2.3: Eksepsjoner og kritiske deler

Som Kari,
vil jeg at appen finner alle de fem eksepsjonene der planen ikke går opp, og ingen andre,
slik at jeg kan stole på at det som er merket, krever handling, og at ingenting er glemt.

**Acceptance Criteria:**

**Gitt** svaret fra nettingen for hver del
**Når** `domene/eksepsjoner.ts` finner eksepsjonene
**Så** finner den Ledetid overskrider horisont (FR-9), Bestilling forsinket (FR-10), Bruk av sikkerhetslager (FR-11), Mottak forsinket (FR-12) og Kanseller mottak (FR-29) etter reglene i PRD-en, for deler på alle nivåer (AD-7)
**Og** hver eksepsjon har kode, varenummer, uke (eller hele delen) og alle opplysningene kravet sier meldingen skal ha, men ingen ferdig tekst (AD-9)
**Og** en uke kan ikke få både Bestilling forsinket og Bruk av sikkerhetslager

**Gitt** Bestilling forsinket og Bruk av sikkerhetslager
**Når** opplysningene settes
**Så** er disponibel beholdning verdien etter at mottak er fremskyndet, mens Mottak forsinket oppgir den før (FR-10)
**Og** Bestilling forsinket sier om leveransen til kunde blir forsinket (ferdigproduktet og nivå .1, og en felles del som også står rett under ferdigproduktet), eller produksjonen av hvilke overordnede deler

**Gitt** Kanseller mottak
**Når** et planlagt mottak kontrolleres
**Så** kjøres nettingen for delen én gang til uten mottaket og uten annen fremskynding, og mottaket får eksepsjonen bare hvis delen da ikke får noe nettobehov fra mottaksuken til uke H (FR-29, AD-7)
**Og** et mottak som er fremskyndet, får den aldri

**Gitt** alle eksepsjonene
**Når** `Resultat` lages
**Så** er en del med minst én eksepsjon kritisk (FR-13)
**Og** eksepsjonene er sortert på stykklisterekkefølge, uke (hele delen først) og typen i rekkefølgen i PRD §4.3 (arkitektur kap. 4)

**Gitt** fasittestene for testeksempel 01–04
**Når** de kjører
**Så** er eksepsjonslisten identisk med arket Eksepsjoner (varenummer, uke, type), uten andre eksepsjoner (SM-2)
**Og** i testeksempel 01 er nøyaktig 300-003, 300-004, 300-005 og 300-006 kritiske
**Og** 300-006 Stolfot får Ledetid overskrider horisont selv om nettobehovet er 0 i alle uker, og 300-007 Skruesett og 300-008 Trekk får ingen eksepsjon
**Og** Kanseller mottak for 300-005 Gassfjær i uke 5 i testeksempel 02 finnes, og 300-026 i uke 1 i testeksempel 04 har både Mottak forsinket og en eksepsjon for forfalt frigivelse

### Story 2.4: Eksepsjonsmeldinger

Som Kari,
vil jeg lese hver eksepsjon i vanlig språk med tallene som gjelder, hva jeg bør gjøre og hvorfor den slo til,
slik at jeg forstår og kan handle uten å kunne MRP.

**Acceptance Criteria:**

**Gitt** en eksepsjon
**Når** `tekster/nb.ts` lager teksten
**Så** har den de fire delene fra EXPERIENCE.md (variant B): typenavnet fra ordbanken og uken, én setning i vanlig språk, «Melding:» med opplysningene kravet krever og handlingen i første eller andre setning, og «Hvorfor:» med regelen og tallene satt inn (UX-DR25)
**Og** setningen i vanlig språk er aldri bare typenavnet
**Og** uke for hele delen skrives «hele delen»

**Gitt** forfalte bestillinger
**Når** teksten lages
**Så** brukes «før uke 1» og «bestilt», aldri «uke 0», «frigitt» eller «før horisonten» (EXPERIENCE.md › Voice and Tone)
**Og** for Ferdigvare og Komponent (Produseres selv) skrives «starte produksjonen av» og «skulle vært satt i produksjon»

**Gitt** Bestilling forsinket og Bruk av sikkerhetslager
**Når** teksten lages
**Så** forklarer den hvorfor resultattabellen viser et annet tall for forventet lagerbeholdning (FR-7)
**Og** Bestilling forsinket slutter med «Leveranse til kunde blir forsinket.» eller «Produksjonen av ‹overordnet del› blir forsinket.» med alle overordnede deler (FR-10)

**Gitt** Ledetid overskrider horisont og Kanseller mottak
**Når** teksten lages
**Så** sier den at eksepsjonen bare gjelder innenfor horisonten, og Ledetid overskrider horisont oppgir summen og stien og foreslår lengre horisont (FR-9, FR-29)

**Gitt** eksepsjonene i testeksempel 01 og Kanseller mottak i testeksempel 02
**Når** testene kjører
**Så** inneholder meldingen de opplysningene fasitmeldingen har, for eksempel for 300-003 Hjul: −20 i uke 1, 50 forfalt, 175 i uke 1 og tidligst i uke 2 (FR-10, FR-13)
**Og** ordlyden sammenlignes ikke med fasiten (AD-16)
**Og** tekstforslagene i EXPERIENCE.md er brukt som grunnlag, og endringer i ordlyden prøves i prøvetesten

### Story 2.5: Beregningen i kjøringen

Som Kari,
vil jeg at Beregn gir en ferdig beregnet plan for filen min,
slik at jeg ser bestillingsplanen rett etter opplastingen.

**Acceptance Criteria:**

**Gitt** en gyldig fil og valget bestillingsplan
**Når** worker-en kjører
**Så** kjører den `domene/struktur`, `domene/beregn` og `domene/eksepsjoner` etter valideringen, og svarer med `Resultat` i én melding (AD-12)
**Og** en uventet feil i beregningen gir `UVENTET_FEIL`, ingen resultat og ingen lagring (AD-5, NFR-9)

**Gitt** svaret med `Resultat`
**Når** styringen lager `Kjoring`
**Så** har `Kjoring` resultatet i tillegg til feltene fra Story 1.10
**Og** statusregionen kunngjør «Kjøringen er ferdig: N bestillingsforslag, M kritiske deler.» (UX-DR4)

**Gitt** Playwright
**Når** `testeksempel-01.xlsx` lastes opp to ganger
**Så** kunngjøres 4 kritiske deler begge gangene, og resultatet er det samme (FR-8)

### Story 2.6: Toppen av Resultat

Som Kari,
vil jeg se de viktigste tallene øverst og hoppe rett til seksjonen jeg trenger,
slik at jeg straks ser om noe krever handling, og finner fram på en lang side.

**Acceptance Criteria:**

**Gitt** Resultat etter en kjøring med bestillingsplan
**Når** siden vises
**Så** står seksjonene i fast rekkefølge med hver sin h2: Kritiske deler, Bestillingsforslag og Resultattabell (AD-14)
**Og** innholdet i seksjonene kommer i Story 2.7–2.11, og seksjonene er tomme til da

**Gitt** kjøringslinjen
**Når** Kari ruller
**Så** står seksjonsmenyen fast nederst i kjøringslinjen som `<nav aria-label="Seksjoner i resultatet">` med runde knapper: Kritiske deler (antall), Bestillingsforslag (antall) og Resultattabell (UX-DR14)
**Og** klikk eller Enter ruller med `scrollIntoView` så overskriften står rett under kjøringslinjen, flytter fokus til overskriften og endrer ikke adressen (AD-13)
**Og** seksjonen som er i bildet, har `aria-current="location"`, og det oppdateres mens Kari ruller
**Og** antallene viser alltid totalen, og antallet for kritiske deler står i `exc-critical` og fet skrift

**Gitt** tallboksene under kjøringslinjen
**Når** de vises
**Så** er det fire bokser: kritiske deler, bestillingsforslag i uke 1, bestillingsforslag i alt og forslag med forfalt mengde (UX-DR15)
**Og** hver boks er én lenke til seksjonen tallet gjelder, med fokusringen inne i boksen
**Og** bare kritiske deler (●) og forfalt mengde (!) har farge, og et tall som er 0, forklares i ord, for eksempel «Planen går opp for alle delene.»

**Gitt** «Slik leser du resultatet»
**Når** den vises
**Så** er det en nummerert liste med én linje per seksjon i samme rekkefølge, åpen og mulig å felle sammen (UX-DR16)
**Og** uten kritiske deler er punktet om kritiske deler borte

**Gitt** tallene på siden
**Når** de formateres i `tekster/nb.ts`
**Så** har de hardt mellomrom som tusenskille og ekte minus «−» (U+2212), og like brede sifre (UX-DR2)
**Og** formateringen har enhetstester

**Gitt** et vindu smalere enn 900 px eller `prefers-reduced-motion`
**Når** siden vises
**Så** stables tallboksene, seksjonsmenyen bryter over flere linjer, og rullingen er et hopp uten bevegelse (UX-DR14, UX-DR34)

**Gitt** Playwright med `testeksempel-01.xlsx`
**Når** Resultat vises
**Så** viser tallboksen for kritiske deler 4, og klikk på knappen Bestillingsforslag i seksjonsmenyen setter fokus på overskriften Bestillingsforslag

### Story 2.7: Resultattabell

Som Kari,
vil jeg se hele MRP-tabellen per del og uke med eksepsjonene markert i riktig celle,
slik at jeg kan følge hvordan planen henger sammen, og se nøyaktig hvor den ikke går opp.

**Acceptance Criteria:**

**Gitt** seksjonen Resultattabell
**Når** den vises
**Så** er tabellen én `<table>` med `<caption>` (ferdigprodukt og horisont), `<th scope="col">` for ukene, `<th scope="row">` for radnavnene, `<th scope="rowgroup">` for delens felt og én memoisert `<tbody>` per del (AD-14, UX-DR21)
**Og** hver del har de seks radene fra FR-14 i den rekkefølgen og nøyaktig H ukekolonner
**Og** delene står i stykklisterekkefølge, og en felles del står én gang, der den står første gang (FR-14, FR-16)

**Gitt** delens felt
**Når** det vises
**Så** har det nivåmerke, varenummer i Mono, beskrivelse, type, lagerbeholdning, SS, L og antall per overordnet del, med 12 px innrykk per nivå (UX-DR21)
**Og** en kritisk del har merket «● Kritisk del», synlig og som tilgjengelig navn

**Gitt** en eksepsjon
**Når** tabellen vises
**Så** står eksepsjonsmarkøren i cellen fra tabellen i EXPERIENCE.md: Nettobehov uke t for Bestilling forsinket og Bruk av sikkerhetslager, Nettobehov i uka mottaket fremskyndes til for Mottak forsinket, Planlagte mottak i mottaksuka for Kanseller mottak, og delens felt for Ledetid overskrider horisont (UX-DR23)
**Og** markøren har symbol, eksepsjonens lyse bakgrunn og et tilgjengelig navn som «Bestilling forsinket, uke 1», aldri farge alene (FR-15, NFR-8)
**Og** flere eksepsjoner i samme celle står side om side
**Og** over tabellen står tegnforklaringen for de fem eksepsjonene, merket for kritisk del og valgt celle

**Gitt** tall i tabellen
**Når** de vises
**Så** er nuller i `ink-secondary`, negative tall i `exc-critical` med «−», og uke 1-kolonnen har `accent-soft`

**Gitt** tabellen er bredere eller høyere enn skjermen
**Når** Kari ruller i tabellområdet (`role="region"` med `aria-labelledby`)
**Så** står ukeoverskriften og venstrekolonnene (delens felt og radnavnene) fast med ugjennomsiktig bakgrunn (NFR-8)

**Gitt** en celle
**Når** Kari klikker på den
**Så** blir den valgt celle med ramme og fete radnavn og ukeoverskrift (forklaringen kommer i Epic 3)
**Og** peking gjør ingenting annet enn en liten endring i ramme eller bakgrunn (FR-18)

**Gitt** avkrysningsboksen «Vis bare kritiske deler» over tabellen
**Når** Kari krysser av
**Så** vises bare de kritiske delene i stykklisterekkefølge, og «Viser 4 av 9 deler · Vis alle deler» står over tabellen for testeksempel 01 (FR-16, UX-DR24)
**Og** valgt celle i en del som skjules, nullstilles
**Og** filteret er av når resultatet åpnes, skjult når det ikke finnes kritiske deler, og endrer ikke tallboksene eller `Resultat`

**Gitt** Playwright med `testeksempel-01.xlsx`
**Når** tabellen vises
**Så** viser 300-003 Hjul i uke 1 bruttobehov 100, forventet lagerbeholdning 30, nettobehov 50 og frigivelse 175, og alle eksepsjonene i fasiten står på riktig del og uke (FR-14, FR-15)

### Story 2.8: Ytelse med 1000 rader

Som Kari,
vil jeg at en stor stykkliste gir resultatet på under 3 sekunder,
slik at appen er rask nok til daglig bruk.

**Acceptance Criteria:**

**Gitt** `testdata/lag_testdata.py`
**Når** skriptet kjøres med et nytt valg for ytelse
**Så** lager det `testdata/ytelse-1000.xlsx` med 1000 stykklisterader, tre nivåer, felles deler og 12 uker, som valideres uten feil (NFR-5)
**Og** `testdata/README.md` beskriver filen og kommandoen

**Gitt** ytelsesfilen i Chrome på en vanlig bærbar PC
**Når** Kari trykker Beregn
**Så** er tiden fra Beregn til synlig resultattabell målt, minst tre ganger, med lesing og beregning i worker-en og tegningen av tabellen hver for seg
**Og** målingen er gjort før tastaturstyringen i Story 2.9 bygges, så tabellstrukturen ikke låses før tallene finnes (AD-14)

**Gitt** at målet på 3 sekunder ikke nås
**Når** tiltakene prøves
**Så** prøves de i rekkefølgen fra UX-DR35: `content-visibility: auto` per `<tbody>`, virtualisering per del med `aria-rowcount` og `aria-rowindex`, og sist sammenslått visning
**Og** tiltaket som tas i bruk, og målingene før og etter, står i pull requesten og i arkitektur kap. 12
**Og** nås ikke målet med noen av tiltakene, tas en endring av NFR-5 med begrunnelse opp med gruppen (addendum)

### Story 2.9: Tastatur i resultattabellen

Som Kari, som bruker tastaturet,
vil jeg flytte meg i tabellen med piltaster og snarveier,
slik at jeg kan lese hele planen uten mus.

**Acceptance Criteria:**

**Gitt** resultattabellen
**Når** Kari tabulerer inn i den
**Så** har hele tabellen én tabulatorstopp (WAI-ARIA grid med roving tabindex på den ekte `<table>`) (UX-DR22)

**Gitt** en celle med fokus
**Når** Kari bruker tastaturet
**Så** flytter piltastene én celle og stopper ved kanten
**Og** Home og End går til første og siste uke i raden, og Ctrl+Home og Ctrl+End til første og siste celle i tabellen
**Og** PgUp og PgDn går til samme rad i forrige og neste del
**Og** venstre fra et radnavn går til delens felt, og opp og ned fra delens felt går til forrige og neste del
**Og** Enter eller mellomrom velger cellen (forklaringen kommer i Epic 3)

**Gitt** et vindu på 1366 × 768
**Når** Kari bruker piltastene, PgUp, PgDn, Ctrl+Home og Ctrl+End
**Så** rulles cellen med fokus alltid inn i bildet og skjules aldri bak den faste ukeoverskriften, venstrekolonnene eller kjøringslinjen (WCAG 2.4.11)

**Gitt** filteret «Vis bare kritiske deler» er på
**Når** Kari bruker PgUp og PgDn
**Så** hopper fokus bare mellom delene som vises

**Gitt** en skjermleser
**Når** fokus står i en celle
**Så** leses del, rad, uke og verdi, for eksempel «300-003 Hjul, Nettobehov, Uke 1, 50»

### Story 2.10: Kritiske deler

Som Kari,
vil jeg se de kritiske delene øverst med hva som er galt, og hoppe rett til cellen,
slik at jeg ser først det som krever handling.

**Acceptance Criteria:**

**Gitt** en kjøring med kritiske deler
**Når** seksjonen Kritiske deler vises
**Så** står én linje per kritisk del i stykklisterekkefølge, før bestillingsforslagene (FR-16, UX-DR17)
**Og** linjen viser varenummer, beskrivelse, type og nivå, alle eksepsjonsmerkene med typenavn, uke og setningen i vanlig språk, delens første bestillingsforslag («Første bestillingsforslag: 175 i uke 1, 50 forfalt · 3 forslag i alt») og «Se forklaring →»
**Og** linjen har 4 px venstrekant i fargen til delens tidligste eksepsjon

**Gitt** en linje
**Når** Kari klikker eller trykker Enter
**Så** er hele linjen én knapp med tilgjengelig navn, for eksempel «300-003 Hjul, Bestilling forsinket, uke 1. Bestillingen skulle vært sendt før uke 1. Se forklaring»
**Og** tabellen ruller til delen, fokus flyttes til cellen med den tidligste eksepsjonen, og delen markeres kort (uten bevegelse med `prefers-reduced-motion`)
**Og** er filteret «Vis bare kritiske deler» av, sorteres tabellen ikke om

**Gitt** en kjøring uten eksepsjoner
**Når** Resultat vises
**Så** står bare «Ingen kritiske deler. Planen går opp for alle delene.» i en informasjonsboks, uten overskrift eller liste (FR-16)
**Og** tallboksen viser 0, og knappen Kritiske deler i seksjonsmenyen fører til meldingen

**Gitt** Playwright med `testeksempel-01.xlsx`
**Når** seksjonen vises
**Så** står 300-003, 300-004, 300-005 og 300-006 i denne rekkefølgen
**Og** valg av 300-005 Gassfjær flytter fokus til Nettobehov i uke 3

### Story 2.11: Bestillingsforslag med ukefilter

Som Kari,
vil jeg se alle bestillingsforslag sortert etter frigivelsesuke og filtrere på én uke,
slik at jeg vet hva jeg må bestille eller sette i produksjon denne uka.

**Acceptance Criteria:**

**Gitt** seksjonen Bestillingsforslag
**Når** den vises
**Så** står alle forslagene i én liste med fast høyde og egen rulling, sortert etter frigivelsesuke og så stykklisterekkefølge (FR-17, UX-DR18)
**Og** kolonnene er Frigivelsesuke, Varenummer, Beskrivelse, Mengde, Innkjøp eller produksjonsordre og Forfalt
**Og** over listen står «Frigivelsesuke er uka du må sende bestillingen eller starte produksjonen. Varene kommer ledetiden senere. Forfalt betyr at noe av mengden skulle vært bestilt før uke 1.»
**Og** radene i uke 1 har `accent-soft`, og en kritisk del har symbolet for eksepsjonen ved beskrivelsen

**Gitt** et forslag med forfalt mengde
**Når** det vises
**Så** står knappen «! 50 forfalt» i kolonnen Forfalt, med tilgjengelig navn «50 forfalt: se eksepsjonen for 300-003 Hjul»
**Og** knappen gjør det samme som linjen for delen i kritiske deler, og et klikk andre steder på raden gjør ingenting

**Gitt** ukefilteret over listen
**Når** Resultat åpnes
**Så** er «Alle uker» valgt, og knappene «Alle uker» og «Uke 1»–«Uke H» viser hver sitt antall (UX-DR19)
**Og** med én uke valgt står «Viser 3 av 12 forslag · Vis alle uker» over listen
**Og** en uke uten forslag viser «Ingen bestillingsforslag skal frigis i uke 6.» med «Vis alle uker»
**Og** filteret endrer verken tallboksene eller `Resultat`

**Gitt** en kjøring uten bestillingsforslag
**Når** seksjonen vises
**Så** står «Kjøringen gir ingen bestillingsforslag.», og ukefilteret er skjult

**Gitt** Playwright med `testeksempel-01.xlsx`
**Når** listen vises
**Så** har den én linje per planlagt ordrefrigivelse > 0 i fasiten, og alle forslagene for delene på nivå .1 er innkjøp (FR-17)
**Og** det første forslaget for 300-002 Rygg er 25 i frigivelsesuke 2 (brukertestens oppgave 3)
**Og** filtrert på uke 1 vises bare forslagene med frigivelsesuke 1, også 175 hjul med «! 50 forfalt», og «Vis alle uker» viser alle igjen

## Epic 3: Kari forstår hvert tall og hver eksepsjon

Kari klikker på et tall eller en eksepsjon og leser i forklaringspanelet hvordan tallet er regnet ut, og hvorfor eksepsjonen slo til, med tastatur, mus eller berøring. Epicet slutter med tastatur- og skjermlesertesten, brukertestbygget og prøvetesten rundt 27.11. Trinn 2.

### Story 3.1: Forklaringstekster

Som Kari,
vil jeg at hvert tall har en forklaring i vanlig språk med tallene som ga resultatet,
slik at jeg kan etterprøve planen uten å kunne formlene.

**Acceptance Criteria:**

**Gitt** `Utregning` for en del og uke (AD-8)
**Når** `tekster/nb.ts` lager forklaringen av en celle
**Så** har den fire lag: (1) svaret i én setning, (2) utregningen som steg med tallene satt inn i formlene fra PRD §4.2, (3) tallene som ga resultatet, hver med en henvisning til cellen sin, og (4) regelen i én setning (UX-DR26)
**Og** utregningen har ett steg per linje, for eksempel «Disponibel beholdning = 80 + 0 − 100 = −20» og «Nettobehov = maks(0, 30 − (−20)) = 50»
**Og** ingen kode utenfor kjernen regner MRP: tekstene bruker bare tallene i `Utregning` (AD-8)

**Gitt** de seks radtypene
**Når** forklaringen lages
**Så** har hver radtype både en forklaring av raden og en forklaring av cellen (FR-18)
**Og** lag 1 for nettobehov sier hva som mangler, for eksempel «I uke 1 mangler det 50 hjul for å holde sikkerhetslageret på 30.»
**Og** lag 1 for planlagte ordrefrigivelser sier hva Kari gjør og når varene kommer, for eksempel «Bestill 25 rygger i uke 2, så de kommer i uke 3.»

**Gitt** bruttobehov for en del under ferdigproduktet
**Når** forklaringen lages
**Så** viser lag 3 hver overordnet del med frigivelse × antall, for eksempel «Kontorstol Basic: 20 × 5 = 100», og en felles del har én linje per overordnet del (FR-18, FR-28)

**Gitt** de spesielle tilfellene i EXPERIENCE.md › Forklaringspanel
**Når** forklaringen lages
**Så** har planlagt ordremottak med forfalt frigivelse, forventet lagerbeholdning i samme uke som en forfalt frigivelse, og fremskyndet mottak (ukene t til u − 1 og mottaksuka u) tekstene derfra

**Gitt** enhetstestene
**Når** de kjører
**Så** viser forklaringen av 300-003 Hjul, uke 1, lagerbeholdning 80, planlagte mottak 0, bruttobehov 100, disponibel beholdning −20, SS 30 og nettobehov 50 (FR-18)
**Og** alle seks radtypene og alle fem eksepsjonstypene har en forklaring (eksepsjonene har «Hvorfor:» fra Story 2.4)
**Og** forklaringen av bruttobehovet for skruesett M6 i testeksempel 02 viser bidraget fra både sete og rygg

### Story 3.2: Forklaringspanelet

Som Kari,
vil jeg åpne forklaringen ved siden av tabellen og la den stå mens jeg flytter meg,
slik at jeg kan lese forklaringen og tallene samtidig.

**Acceptance Criteria:**

**Gitt** resultattabellen
**Når** Kari klikker, trykker eller bruker Enter eller mellomrom på en celle, et radnavn eller delens felt
**Så** åpnes forklaringspanelet som ikke-modalt `<aside aria-label="Forklaring">`, 340 px til høyre, og skyver tabellen til side uten å dekke den (FR-18, UX-DR26)
**Og** panelet står fast under kjøringslinjen med egen rulling og overskrift som «300-003 Hjul – Nettobehov, uke 1» og knappen «Lukk»
**Og** en celle forklarer cellen, et radnavn forklarer raden, og delens felt viser alle delens eksepsjoner øverst
**Og** peking åpner aldri panelet

**Gitt** en celle med én eller flere eksepsjoner
**Når** panelet åpnes
**Så** står alle eksepsjonsmeldingene øverst, med de fire delene fra Story 2.4, før de fire lagene (FR-15, FR-18)
**Og** på 1366 × 768 ved 100 % zoom er hele meldingen for 300-003 Hjul, Nettobehov uke 1, synlig uten å rulle i panelet

**Gitt** panelet er åpent
**Når** Kari bruker piltastene i tabellen
**Så** blir fokus i tabellen, og panelet følger valgt celle
**Og** en henvisning i lag 3 flytter valgt celle til cellen tallet kommer fra
**Og** panelet står åpent til Kari lukker det med «Lukk» eller Esc, og da går fokus tilbake til cellen

**Gitt** valgt celle endres
**Når** panelet oppdateres
**Så** kunngjør et lite element i panelet (`aria-live="polite"`) bare overskriften og det første kortet, cirka 300 ms etter at valgt celle har stoppet, og hele panelet har ikke `aria-live` (EXPERIENCE.md › Accessibility Floor)

**Gitt** filteret «Vis bare kritiske deler» skjuler delen med valgt celle
**Når** filteret slås på
**Så** nullstilles valgt celle, og panelet lukkes (UX-DR24)

**Gitt** et vindu smalere enn 900 px eller `prefers-reduced-motion`
**Når** panelet åpnes
**Så** blir det et ark nederst på skjermen på inntil 60 % av høyden med skygge, og med `prefers-reduced-motion` vises det uten å gli inn (UX-DR26, UX-DR34)

**Gitt** Playwright
**Når** Kari holder musepekeren over en celle uten å klikke
**Så** åpnes ingen forklaring (FR-18)
**Og** forklaringen kan åpnes og lukkes med bare tastaturet

### Story 3.3: Hopp rett til forklaringen

Som Kari,
vil jeg komme rett fra en kritisk del eller et forfalt forslag til forklaringen av eksepsjonen,
slik at jeg forstår hva som er galt med ett klikk.

**Acceptance Criteria:**

**Gitt** en linje i kritiske deler eller knappen «! forfalt» i bestillingsforslagene
**Når** Kari aktiverer den
**Så** ruller tabellen til delen, fokus flyttes til cellen med den tidligste eksepsjonen (som i Story 2.10), og panelet åpnes med eksepsjonen øverst (UX-DR17, UX-DR18)

**Gitt** en celle uten eksepsjon i en kritisk del
**Når** panelet viser cellen
**Så** står linjen «Hjul har 1 eksepsjon: Bestilling forsinket, uke 1 → Vis» øverst, og «Vis» flytter valgt celle til eksepsjonens celle (UX-DR26)

**Gitt** panelet er åpent
**Når** Kari tabulerer ut av tabellen
**Så** er neste stopp lenken «Gå til forklaringen», som bare vises ved fokus, og den flytter fokus til panelets overskrift
**Og** rekkefølgen for Tab følger EXPERIENCE.md: appmeny → kjøringslinje → seksjonsmeny → tallbokser → kritiske deler → bestillingsforslag → resultattabell → forklaringspanel (UX-DR33)

**Gitt** Playwright med `testeksempel-01.xlsx`
**Når** Kari velger 300-003 Hjul i kritiske deler
**Så** har panelet overskriften «300-003 Hjul – Nettobehov, uke 1» og Bestilling forsinket øverst
**Og** Esc lukker panelet og setter fokus på cellen Nettobehov, uke 1

### Story 3.4: Tastatur- og skjermlesertest

Som Kari, som bruker tastatur eller skjermleser,
vil jeg at appen er testet med bare tastatur og med NVDA før noen tester den med brukere,
slik at jeg kan løse oppgavene uten mus og uten å miste oversikten.

**Acceptance Criteria:**

**Gitt** appen med trinn 1 og 2
**Når** en i gruppen går gjennom UJ-1, UJ-2 og UJ-4 med bare tastatur
**Så** kan alle stegene gjøres: opplasting, feiloppsummering, seksjonsmeny, tallbokser, kritiske deler, bestillingsforslag, resultattabell og forklaringspanel (UX-DR33)
**Og** fokus er alltid synlig og skjules aldri bak faste lag (WCAG 2.4.11)

**Gitt** NVDA i Chrome eller Firefox
**Når** en i gruppen gjør en skjermlesertest på cirka 15 minutter
**Så** er seksjonsmenyen, tallboksene, resultattabellen som grid (ukeoverskrift og radnavn leses), kritiske deler, forklaringspanelet, feiloppsummeringen og kunngjøringen etter Beregn prøvd (EXPERIENCE.md › Accessibility Floor)

**Gitt** lys og mørk visning
**Når** alle flatene kontrolleres
**Så** er kontrasten WCAG 2.1 AA i begge, også for flater som er kommet til etter Story 1.13

**Gitt** et vindu på 1366 × 630 px og zoom opp til 200 %
**Når** sidene vises
**Så** ruller siden loddrett, tabellen ruller i sitt eget område, og ingenting skjules (UX-DR34)

**Gitt** funnene
**Når** testen er ferdig
**Så** er hvert funn rettet i denne storyen eller ført inn i `issues.md` med ansvarlig
**Og** resultatet står i `.docs/brukertest/tilgjengelighetstest.md`
**Og** automatiske verktøy er ikke brukt i stedet for de to manuelle testene

### Story 3.5: Brukertestbygg og prøvetest

Som gruppe,
vil vi ha en fast versjon av appen og en prøvet prosedyre før brukertesten,
slik at alle testpersonene tester det samme, og testen måler appen og ikke oppsettet.

**Acceptance Criteria:**

**Gitt** branchen `brukertest`
**Når** den lages fra `main`
**Så** har den en fast adresse på Vercel som ikke endres 2.–7.12, og branchen fryses den uka (AD-17, UX-DR36)
**Og** bygget viser bare bestillingsplanen (PRD §8.1: trinn 1–2), og er produksjonskapasiteten flettet inn, er den skjult med `VITE_KAPASITET`
**Og** SM-1 og SM-2 for testeksempel 01 er bekreftet på akkurat den adressen før første test, og testeksempelet appen deler ut, er samme fil som på testmaskinen

**Gitt** forklaringspanelet
**Når** det prøves på 1–2 personer med de fire kritiske delene i testeksempel 01
**Så** er akseptsjekken for 1366 × 768 gjort, og funnene er rettet eller ført inn i `issues.md` før prøvetesten

**Gitt** gruppen har godkjent introduksjonen, oppgavelappene, fasitrubrikken og hvem som gjør prøvetesten (PRD §9 nr. 4, EXPERIENCE.md › Åpne designbeslutninger 1 og 2)
**Når** prøvetesten gjøres rundt 27.11 med full prosedyre og tidtaking fra EXPERIENCE.md › Brukertest
**Så** er `.docs/brukertest/brukertest-resultat.md` opprettet med introduksjonen, oppgavene, rubrikken og prøvetesten, som ikke teller med i resultatet (PRD §8.1)
**Og** endringer i tekst eller layout som prøvetesten viser, er rettet eller ført inn i `issues.md` før testuka
**Og** PRD §9 nr. 4 er lukket, og §8.1 er rettet hvis gruppen valgte en person utenfor gruppen

## Epic 4: Kari følger planen fra kjøring til kjøring og tar den med seg

Appen husker siste kjøring per ferdigprodukt i nettleseren, viser hva som er endret siden forrige kjøring, lar Kari slette en lagret kjøring og eksportere resultatet til Excel. Trinn 3, siste del av minstekravet for innlevering.

**Parallelt arbeid:** 4.1 og 4.2 kan bygges samtidig. 4.4 kan starte når 4.1 er flettet inn, samtidig med 4.3.

### Story 4.1: Husk siste kjøring per ferdigprodukt

Som Kari,
vil jeg at appen husker siste kjøring for hvert ferdigprodukt i nettleseren,
slik at neste opplasting kan sammenlignes med den, også etter at nettleseren er lukket.

**Acceptance Criteria:**

**Gitt** en vellykket kjøring med bestillingsplan
**Når** `domene/utdrag.ts` lager utdraget
**Så** har det `schemaVersjon`, varenummer og navn på ferdigproduktet, tidspunkt, delene (varenummer, beskrivelse), bestillingsforslagene (varenummer, frigivelsesuke, mengde) og eksepsjonene (varenummer, uke, type) (AD-10)
**Og** Excel-filen og resultattabellen er aldri med (NFR-10)

**Gitt** `lagring/lagrede-kjoringer.ts`
**Når** utdraget lagres
**Så** lagres det under `cosi-mrp:kjoring:<varenummer på nivå 0>`, og et nytt utdrag erstatter det gamle for samme ferdigprodukt uten å endre andre ferdigprodukter (FR-19)
**Og** hver lesing og skriving står i `try/catch`, og et utdrag med ukjent `schemaVersjon` regnes som om det ikke finnes (AD-10)

**Gitt** `app/kjoring.ts`
**Når** en kjøring er ferdig
**Så** leses forrige utdrag for ferdigproduktet (steg 3), og det nye lagres bare når bestillingsplanen er valgt og alt annet gikk bra (steg 6) (AD-12)
**Og** valideringsfeil, filfeil og uventede feil endrer ingen lagret kjøring (FR-4, FR-19, NFR-9)

**Gitt** kjøringslinjen
**Når** Resultat vises
**Så** står lagringsstatus som tekst, ikke bare som ikon (UX-DR13)

**Gitt** at lagring i nettleseren er blokkert eller full
**Når** en kjøring er ferdig
**Så** vises resultatet som vanlig, og statusmeldingen «Kjøringen blir ikke lagret, fordi nettleseren ikke tillater lagring. Neste opplasting kan ikke sammenlignes. Eksporter til Excel for å ta vare på den.» står fast i kjøringslinjen så lenge resultatet vises (NFR-10, UX-DR29)
**Og** meldingen kunngjøres én gang gjennom statusregionen, uten toast eller popup

**Gitt** Playwright
**Når** testeksempel 01 lastes opp to ganger, og appen åpnes på nytt i samme nettleserkontekst
**Så** inneholder lagringen bare siste kjøring for 100-002 og ingen Excel-fil (NFR-10)
**Og** med lagring blokkert gir testeksempel 01 riktig resultat og meldingen om at kjøringen ikke lagres

### Story 4.2: Sammenligning i kjernen

Som Kari,
vil jeg at appen finner nøyaktig hvilke bestillingsforslag, eksepsjoner og deler som er endret siden forrige kjøring,
slik at jeg kan kontrollere at endringen ga det jeg ventet, og se nye problemer.

**Acceptance Criteria:**

**Gitt** to utdrag for samme ferdigprodukt
**Når** `domene/sammenlign.ts` sammenligner dem
**Så** gir den en `Sammenligning` med gruppene Bestillingsforslag, Eksepsjoner og Deler, i den rekkefølgen (AD-11, FR-20)
**Og** et bestillingsforslag kjennes igjen på varenummer og frigivelsesuke, og samme varenummer og uke med ny mengde er `ENDRET_MENGDE`
**Og** et forslag som har flyttet uke, gir `FJERNET` i den gamle uken og `NY` i den nye
**Og** en eksepsjon kjennes igjen på varenummer, uke og type, og en endret melding alene er ingen endring
**Og** deler som er lagt til i eller fjernet fra stykklisten, gir egne linjer
**Og** endringskodene er `NY`, `ENDRET_MENGDE`, `FJERNET` og `BORTE`, uten ferdig tekst

**Gitt** endringer i resultattabellen som ikke endrer bestillingsforslag eller eksepsjoner
**Når** utdragene sammenlignes
**Så** gir de ingen linjer (FR-20)

**Gitt** fasittesten
**Når** utdragene for testeksempel 02 og 03 sammenlignes, både 02 → 03 og 03 → 02
**Så** er linjene og rekkefølgen identiske med arket Sammenligning i `testdata/testeksempel-03-fasit.xlsx` (FR-20, SM-5)
**Og** samme fil sammenlignet med seg selv gir ingen linjer

### Story 4.3: Endringer på Resultat

Som Kari,
vil jeg se hva som er endret siden morgenens kjøring rett etter bestillingsforslagene,
slik at jeg ser konsekvensen av en ny kundeordre uten å sammenligne tabellene selv.

**Acceptance Criteria:**

**Gitt** en lagret kjøring for samme ferdigprodukt og valget bestillingsplan
**Når** den nye kjøringen er ferdig
**Så** lager `app/kjoring.ts` utdraget og sammenligner med det forrige (steg 4), og `Kjoring` har sammenligningen (AD-12)
**Og** seksjonen Endringer står etter Bestillingsforslag, med knapp og antall i seksjonsmenyen, en femte tallboks og en linje i «Slik leser du resultatet» (FR-20, UX-DR14–UX-DR16)

**Gitt** endringslisten
**Når** den vises
**Så** sier overskriften hvilke to kjøringer som sammenlignes, for eksempel «13.11 kl. 07:31 → 08:04» (UX-DR20)
**Og** gruppene Bestillingsforslag, Eksepsjoner og Deler har antall i overskriften, og en gruppe uten endringer viser «ingen endringer»
**Og** etikettene er Nytt, Endret mengde og Fjernet for bestillingsforslag, Ny og Borte for eksepsjoner, og Ny og Fjernet for deler, som i arket Sammenligning i fasit 03
**Og** Endret mengde skrives «130 → 205 (+75)», Fjernet og Borte er nøytrale og gjennomstreket, og rødt og grønt brukes aldri som motpar
**Og** et forslag som har flyttet uke, står som Fjernet og Nytt rett under hverandre

**Gitt** en linje med Nytt eller Endret mengde for et forslag, eller Ny for en eksepsjon
**Når** Kari velger den
**Så** gjør den det samme som en linje i kritiske deler: en eksepsjon flytter fokus til eksepsjonens celle, og et forslag til cellen for planlagte ordrefrigivelser i frigivelsesuka, og panelet åpnes (EXPERIENCE.md › Komponenter, Endringsliste)
**Og** Fjernet, Borte og alle linjene i gruppen Deler er bare tekst

**Gitt** ingen endringer i bestillingsforslag, eksepsjoner eller deler
**Når** Endringer vises
**Så** står «Ingen endringer i bestillingsforslag, eksepsjoner eller deler siden forrige kjøring (‹tidspunkt›). Andre tall kan ha endret seg.»

**Gitt** første kjøring for ferdigproduktet, eller blokkert lagring
**Når** Resultat vises
**Så** vises verken seksjonen Endringer, knappen i seksjonsmenyen eller tallboksen for endringer (UX-DR27)
**Og** ved første kjøring står «Første kjøring for ‹beskrivelse›. Det finnes ingen tidligere kjøring å sammenligne med.» i en informasjonsboks

**Gitt** Playwright
**Når** testeksempel 02 og så 03 lastes opp
**Så** viser Endringer «Endret mengde» for hjul med «130 → 205 (+75)», «Nytt» for 30 skruesett M6 i uke 1, «Ny» for hjul med Bruk av sikkerhetslager, og for rygg Mottak forsinket «Borte» i uke 3 og «Ny» i uke 2 (UJ-3)
**Og** lastes en fil for ferdigprodukt X opp, så en for Y og så en ny for X, sammenlignes den tredje kjøringen med den første, og kjøringen for Y vises uten sammenligning (FR-20)

### Story 4.4: Lagrede kjøringer

Som Kari,
vil jeg se hvilke ferdigprodukter appen husker, og slette en lagret kjøring,
slik at jeg kan starte på nytt uten sammenligning for ett produkt.

**Acceptance Criteria:**

**Gitt** siden Lagrede kjøringer (`#/lagrede-kjoringer`)
**Når** den vises
**Så** står én linje per ferdigprodukt med beskrivelse, varenummer i Mono, tidspunkt og «Slett», laget ved å gå gjennom nøklene med prefikset `cosi-mrp:kjoring:` (AD-10, UX-DR30)
**Og** uten lagrede kjøringer står «Ingen lagrede kjøringer ennå.»

**Gitt** «Slett» på en linje
**Når** Kari trykker på den
**Så** står bekreftelsen i linjen: «Slette lagret kjøring for ‹beskrivelse› (‹varenummer›)? Neste opplasting vises uten sammenligning.» med «Slett» og «Avbryt», og fokus starter på «Avbryt»
**Og** det brukes ikke `confirm()` eller en modal
**Og** «Avbryt» lukker bekreftelsen og setter fokus tilbake på «Slett»

**Gitt** bekreftelsen
**Når** Kari trykker «Slett»
**Så** fjernes nøkkelen for ferdigproduktet, og statusmeldingen «Lagret kjøring er slettet. Neste opplasting vises uten sammenligning.» vises (FR-21)
**Og** de lagrede kjøringene for andre ferdigprodukter er urørt
**Og** det finnes ingen data om ferdigproduktet igjen i nettleseren (NFR-10)

**Gitt** Playwright
**Når** kjøringen for et ferdigprodukt er slettet, og samme fil lastes opp på nytt
**Så** vises resultatet uten sammenligning (FR-21)

### Story 4.5: Eksport til Excel

Som Kari,
vil jeg laste ned den viste kjøringen som en Excel-fil,
slik at jeg kan ta vare på planen, dele den og bruke den uten appen.

**Acceptance Criteria:**

**Gitt** «Eksporter til Excel» i kjøringslinjen
**Når** Kari trykker på den
**Så** lager `excel/eksport.ts` en `.xlsx` fra `Kjoring` og laster den ned direkte (AD-15, UX-DR28)
**Og** filen har resultattabellen per del og uke, bestillingsforslagene, eksepsjonene med meldingene fra `tekster/nb.ts`, og ferdigproduktets navn, horisont og tidspunkt for kjøringen (FR-22)
**Og** tallene lagres som tall, ikke som tekst
**Og** filnavnet er «COSI-MRP ‹beskrivelse› ‹ÅÅÅÅ-MM-DD›.xlsx»

**Gitt** en kjøring med sammenligning
**Når** den eksporteres
**Så** har filen arket «Sammenligning», bygd som arket i fasit 03, også når Endringer viser «Ingen endringer» (FR-23)
**Og** en kjøring uten sammenligning har ikke arket

**Gitt** ukefilteret eller «Vis bare kritiske deler» er på
**Når** Kari eksporterer
**Så** har filen alle delene og alle forslagene (FR-16, FR-17)

**Gitt** eksporten
**Når** den lykkes eller feiler
**Så** står «Excel-filen er lastet ned.» til neste handling, eller «Excel-filen kunne ikke lages. Prøv Eksporter til Excel en gang til.» til neste eksport lykkes, som statusmelding i kjøringslinjen (UX-DR29)
**Og** en feil i eksporten endrer ikke resultatet eller den lagrede kjøringen (NFR-9)

**Gitt** fasittestene
**Når** eksportfilen for testeksempel 01 leses tilbake
**Så** er tallene identiske med fasiten (FR-22)
**Og** eksporten etter testeksempel 02 og så 03 har et ark Sammenligning med de samme linjene som fasit 03 (FR-23)

**Gitt** eksportfilen for testeksempel 01 med sammenligning
**Når** den åpnes i Excel for Windows (Sebastian og Oda) og Excel for macOS (Carmen og Idun)
**Så** åpnes den uten feilmeldinger (NFR-11, AD-16)

**Gitt** testeksempel 01 og 02, åpnet og lagret på nytt i Excel for Windows og i Excel for macOS av de samme personene
**Når** filene er lagt inn som egne testfiler i `testdata/`
**Så** gir de samme `Inndata` og samme resultat som de opprinnelige filene (NFR-11, AD-16)

## Epic 5: Kari svarer på hasteforespørsler med produksjonskapasitet

Kari velger produksjonskapasitet, alene eller sammen med bestillingsplanen, og ser hvor mange hele ferdigprodukter lageret og de planlagte mottakene rekker til uke for uke, og hvilken del som begrenser. Trinn 4, kuttes først. Startes bare hvis gruppen bestemmer det på kuttmøtet 30.11, og rettelser etter brukertesten går foran (PRD §7.1).

**Forutsetning:** gruppen har kontrollert fasit 05 for hånd før fasittestene i 5.1 og 5.2 regnes som godkjent.

### Story 5.1: Produksjonskapasitet per uke

Som Kari,
vil jeg vite hvor mange hele ferdigprodukter som kan være ferdige innen hver uke, fra lager og med planlagte mottak,
slik at jeg kan svare en kunde uten å endre planen.

**Acceptance Criteria:**

**Gitt** `Inndata` og `Struktur`
**Når** `domene/kapasitet.ts` beregner kapasiteten for uke t
**Så** er kapasiteten det største antallet hele ferdigprodukter N der et behov på N i uke t kan dekkes, brutt ned gjennom stykklisten som i beregningen (FR-31)
**Og** nettingen bruker kapasitetsinnstillingene i `domene/netting.ts`: ledig beholdning (maks(0, lagerbeholdning − SS)) som lager, SS 0, ingen fremskynding, ingen forfalte frigivelser og ingen planlagte ordremottak for deler uten underdeler (AD-7)
**Og** ledig beholdning av ferdigproduktet og av deler som produseres selv brukes før behovet går videre til underdelene
**Og** behovet for en felles del summeres før ledig beholdning trekkes fra, så lageret ikke telles to ganger (FR-28)

**Gitt** de to radene
**Når** kapasiteten beregnes
**Så** beregnes den for hver uke både fra lager (uten planlagte mottak) og med planlagte mottak fra mottaksuken (FR-32)
**Og** søket dobler N og bruker så binærsøk, fordi svaret er monotont i N (addendum)

**Gitt** enhetstestene
**Når** de kjører
**Så** er kapasiteten et heltall ≥ 0 som aldri blir lavere fra én uke til den neste, og raden med planlagte mottak er aldri lavere enn raden fra lager (FR-31, FR-32)
**Og** et ferdigprodukt med ledig beholdning 10 og ledetid 1 har kapasitet 10 i uke 1
**Og** en del med lagerbeholdning 50 og SS 20 regnes med 30, og en del med lagerbeholdning under SS med 0
**Og** under et ferdigprodukt med ledetid 0 gir en del på nivå .1 som produseres selv, med ledetid 2 og uten lager, kapasitet 0 i uke 1 og 2
**Og** et mottak i uke 4 for den begrensende delen på nivå .1 øker raden med planlagte mottak fra uke 4, ikke i uke 1–3, og raden fra lager endres ikke
**Og** uten planlagte mottak er de to radene like, og to filer som bare er ulike i arket MPS, gir samme kapasitet

**Gitt** fasittesten for testeksempel 05
**Når** den kjører
**Så** er kapasiteten per uke på begge radene identisk med arket Kapasitet i fasit 05 (SM-7)
**Og** raden fra lager er 30 i uke 5, og raden med planlagte mottak er 30 i uke 5 og 35 fra uke 7 (UJ-5)

### Story 5.2: Begrensende deler

Som Kari,
vil jeg se hvilken del som begrenser kapasiteten hver uke, og om det er lageret eller ledetiden,
slik at jeg vet hvilken leverandør jeg skal ringe.

**Acceptance Criteria:**

**Gitt** kapasiteten N for en uke og en rad
**Når** de begrensende delene finnes
**Så** er de delene som ikke kan dekkes når behovet er N + 1 (FR-33)
**Og** hver del har årsaken lager (for lite på lager og i planlagte mottak) eller ledetid (en ordre måtte vært frigitt før uke 1), som kode uten ferdig tekst (AD-9)
**Og** har flere deler den samme laveste verdien, er alle med
**Og** hver uke på hver rad har minst én begrensende del

**Gitt** enhetstestene
**Når** de kjører
**Så** er et ferdigprodukt med ledetid 1 begrensende i uke 1 med årsaken ledetid
**Og** får den begrensende delen et mottak som er stort nok, er en annen del begrensende fra mottaksuken på raden med planlagte mottak

**Gitt** fasittesten for testeksempel 05
**Når** den kjører
**Så** er de begrensende delene med årsak identiske med arket Kapasitet i fasit 05 (SM-7)
**Og** 300-033 Ryggplate er begrensende i uke 5 med årsaken lager (UJ-5)

### Story 5.3: Valg av beregning

Som Kari,
vil jeg velge om jeg vil se bestillingsplanen, produksjonskapasiteten eller begge,
slik at jeg kan sjekke kapasiteten uten å endre den lagrede kjøringen.

**Acceptance Criteria:**

**Gitt** det tredje kortet på startsiden
**Når** det vises
**Så** står radiogruppen «Hva vil du beregne?» som `fieldset` og `legend` med Bestillingsplan (forhåndsvalgt), Produksjonskapasitet og Begge, hver med hjelpeteksten fra EXPERIENCE.md (FR-30, UX-DR9)
**Og** piltastene flytter valget, og forrige valg står igjen ved «Last opp ny fil» og etter valideringsfeil

**Gitt** valget
**Når** worker-en kjører
**Så** kjører den `domene/kapasitet` når produksjonskapasitet eller begge er valgt, og `domene/beregn` og `domene/eksepsjoner` når bestillingsplan eller begge er valgt (AD-12)
**Og** valideringen er den samme uansett valg, så arket MPS må være utfylt også når bare kapasiteten vises (FR-30)

**Gitt** bare produksjonskapasitet
**Når** Resultat vises
**Så** står bare kjøringslinjen og seksjonen Produksjonskapasitet, og seksjonsmenyen, tallboksene og «Eksporter til Excel» er skjult, ikke deaktivert (FR-30, UX-DR13)
**Og** kjøringslinjen sier «Bare produksjonskapasitet. Kjøringen lagres ikke.»
**Og** kjøringen lagres ikke og sammenlignes ikke, og den lagrede kjøringen er urørt (FR-30, AD-10)

**Gitt** bare bestillingsplan
**Når** kjøringen er ferdig
**Så** er resultatet det samme som før produksjonskapasiteten fantes, uten seksjon eller knapp for kapasiteten (FR-30)

**Gitt** begge
**Når** kjøringen er ferdig
**Så** lagres og sammenlignes bestillingsplanen som vanlig, og eksporten har bare bestillingsplanen (FR-30)

**Gitt** byggflagget `VITE_KAPASITET` er av
**Når** appen bygges
**Så** vises ikke radiogruppen, og Beregn gir bestillingsplanen (AD-17)
**Og** README beskriver flagget

**Gitt** `testdata/ytelse-1000.xlsx` og valget begge
**Når** tiden fra Beregn til synlig resultat måles
**Så** er målingen ført inn sammen med målingen fra Story 2.8, og siden fryser ikke mens worker-en regner (NFR-5, AD-12)

### Story 5.4: Kapasitetspanelet

Som Kari,
vil jeg se produksjonskapasiteten i et eget panel som ikke kan forveksles med planlagt produksjon,
slik at jeg kan lese av svaret til kunden og se grunnlaget.

**Acceptance Criteria:**

**Gitt** seksjonen Produksjonskapasitet
**Når** den vises
**Så** står den i eget panel med overskriften «Produksjonskapasitet», 2 px ramme og 10 px hjørner, adskilt fra bestillingsplanen (FR-34, UX-DR32)
**Og** rett under står innledningen i fire korte punkter fra EXPERIENCE.md, blant annet at produksjonskapasiteten tar med ledetid, men ikke prognostiserte behov
**Og** tegnforklaringen har to bokser: Lager (`▤`) og Ledetid (`⧗`) med tekstene fra EXPERIENCE.md

**Gitt** de to radene
**Når** de vises
**Så** står «Fra lager» og «Med planlagte mottak» med nøyaktig H ukekolonner, og de ser ikke ut som de seks radene i resultattabellen (FR-32, FR-34)
**Og** under hvert tall står de begrensende delene med symbol og ordet Lager eller Ledetid, varenummer og beskrivelse, aldri farge alene (FR-33, NFR-8)
**Og** det tilgjengelige navnet sier årsaken i hele setninger

**Gitt** «Grunnlaget per del»
**Når** tabellen vises
**Så** har den én rad per del med lagerbeholdning, sikkerhetslager, ledig beholdning, ledetid og planlagte mottak per uke, og et mottak står i mottaksuken (FR-34)
**Og** kolonnen Ledig beholdning har hjelpeteksten «Lagerbeholdning minus sikkerhetslager, aldri under 0.» koblet med `aria-describedby`

**Gitt** valget begge
**Når** Resultat vises
**Så** står kapasitetspanelet sist, med egen knapp i seksjonsmenyen, og bestillingsplanen og kapasitetspanelet står på samme side i hvert sitt panel (FR-34)
**Og** panelet har ingen klikkbar forklaring i v1

**Gitt** en fil med kapasitet 0 i alle uker, og en fil med 12 uker
**Når** panelet vises
**Så** står tallene, de begrensende delene og de faste kolonnene riktig, også når panelet ruller sideveis

**Gitt** Playwright med `testeksempel-05.xlsx` og valget produksjonskapasitet
**Når** Resultat vises
**Så** viser «Fra lager» 30 i uke 5, «Med planlagte mottak» 30 i uke 5 og 35 fra uke 7, og 300-033 Ryggplate med Lager i uke 5 (UJ-5)

## Epic 6: Kari planlegger med fast partistørrelse

Kari kan oppgi en fast partistørrelse per del i malen. Appen runder planlagte ordremottak opp til hele partier, og viser bestillingsregelen i tabellen, forklaringen og eksporten. Eget, senere epic, slik faglærer anbefalte (PRD §4.7). Trinn 5, kuttes først. Startes først når SM-1 og SM-2 er nådd (SM-C1), og bare hvis gruppen bestemmer det 30.11.

### Story 6.1: Les partistørrelse

Som Kari,
vil jeg kunne fylle ut en partistørrelse for deler som må bestilles i faste partier,
slik at appen vet hvilke deler som har fast partistørrelse.

**Acceptance Criteria:**

**Gitt** Excel-malen
**Når** den lages på nytt med `lag_testdata.py`
**Så** har arket Stykkliste den valgfrie kolonnen «Partistørrelse», som fylles ut første gang varenummeret står, slik som lagerbeholdning, sikkerhetslager og ledetid (FR-24, PRD §4.7)
**Og** Kontroll-kolonnen og datavalideringen i malen dekker kolonnen, og arket Veiledning forklarer den
**Og** `public/COSI-MRP-mal.xlsx` er oppdatert, og testen fra Story 1.1 er grønn

**Gitt** kolonnen «Partistørrelse»
**Når** filen valideres
**Så** er verdien tom eller et heltall ≥ 1, fylt ut første gang varenummeret står og tom de neste gangene (FR-24)
**Og** en fil uten kolonnen er gyldig og gir lot-for-lot for alle deler, så FR-2 ikke krever den
**Og** hver ny regel har et valideringstilfelle i `testdata/validering/` med nøyaktig én feil, og en linje i `testdata/validering/README.md`
**Og** feilene vises i feiloppsummeringen under Stykkliste som andre verdifeil

**Gitt** `Inndata`
**Når** kolonnen er lest
**Så** har hver del partistørrelsen eller ingen, og endringen i `typer.ts` er godkjent av koordinatoren (AD-3)

**Gitt** `testeksempel-01.xlsx`
**Når** den beregnes før og etter storyen
**Så** er resultatet det samme (FR-24)

### Story 6.2: Beregn med fast partistørrelse

Som Kari,
vil jeg at planlagte ordremottak rundes opp til hele partier, og at overskuddet tas med i lageret,
slik at bestillingsforslagene passer med hvordan delene faktisk må bestilles.

**Acceptance Criteria:**

**Gitt** en del med partistørrelse Q og nettobehov(t) > 0
**Når** `domene/netting.ts` regner med fast partistørrelse som innstilling
**Så** er planlagt ordremottak(t) = ⌈nettobehov(t) / Q⌉ × Q (FR-25, AD-7)
**Og** forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t), og overskuddet reduserer nettobehovet i senere uker
**Og** planlagt ordremottak er alltid et multiplum av Q
**Og** `Utregning` har tallene for avrundingen, så forklaringen kan vise den

**Gitt** et nytt testeksempel med minst to deler med fast partistørrelse
**Når** det lages med `lag_testdata.py`, med fasit
**Så** er fasiten kontrollert for hånd av gruppen, og fasittesten gir 100 % samsvar (FR-25, NFR-2)
**Og** `testdata/README.md` beskriver testeksempelet og hva det dekker

**Gitt** delene uten partistørrelse
**Når** de beregnes
**Så** brukes lot-for-lot, og fasittestene for testeksempel 01–05 er fortsatt grønne

### Story 6.3: Vis bestillingsregel

Som Kari,
vil jeg se hvilken bestillingsregel som er brukt for hver del, og hvordan mengden er rundet opp,
slik at jeg forstår hvorfor et forslag er større enn nettobehovet.

**Acceptance Criteria:**

**Gitt** delens felt i resultattabellen
**Når** det vises
**Så** står bestillingsregelen under nivå og type: «Fast partistørrelse: 50» for en del med Q = 50, og «Lot-for-lot» ellers (FR-26, EXPERIENCE.md › Fast partistørrelse)

**Gitt** forklaringen av planlagte ordremottak for en del med fast partistørrelse
**Når** panelet viser den
**Så** viser lag 2 avrundingen med tallene satt inn, for eksempel «Planlagt ordremottak = ⌈45 / 50⌉ × 50 = 50» (FR-26)

**Gitt** eksporten
**Når** en kjøring med fast partistørrelse eksporteres
**Så** viser filen bestillingsregelen og partistørrelsen per del (FR-26)

**Gitt** Playwright med det nye testeksempelet
**Når** Resultat vises
**Så** viser en del med Q = 50 «Fast partistørrelse: 50»
