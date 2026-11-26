# Epic 2 Context: Kari ser bestillingsplanen og hva som krever handling

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

En gyldig fil gir en beregnet bestillingsplan: kjøringslinje, tallbokser, «Slik leser du resultatet», kritiske deler, bestillingsforslag med ukefilter og resultattabell med eksepsjonsmarkører og filteret «Vis bare kritiske deler». Epicet bygger beregningskjernen (netting, beregning nivå for nivå, eksepsjoner) med fasittester for testeksempel 01–04, kobler den inn i worker-kjøringen, og måler ytelsen med 1000 rader før tabellstrukturen låses. Kjernen (2.1 → 2.5) og skjermene (2.6 → 2.11) kan bygges samtidig. Skjermene bygges mot eksempeldata fra fasit 01. Trinn 1, og hele epicet skal være klart før prøvetesten rundt 27.11.

## Stories

- Story 2.1: Netting for én del
- Story 2.2: Beregning nivå for nivå
- Story 2.3: Eksepsjoner og kritiske deler
- Story 2.4: Eksepsjonsmeldinger
- Story 2.5: Beregningen i kjøringen
- Story 2.6: Toppen av Resultat
- Story 2.7: Resultattabell
- Story 2.8: Ytelse med 1000 rader
- Story 2.9: Tastatur i resultattabellen
- Story 2.10: Kritiske deler
- Story 2.11: Bestillingsforslag med ukefilter

## Requirements & Constraints

- **Bruttobehov (FR-5):** ferdigproduktet (nivå 0) får prognostiserte behov (MPS). Andre deler får summen av planlagt ordrefrigivelse(t) for hver overordnet del × antall. Står samme del flere ganger rett under samme overordnede del, legges antallene sammen. Underdelene regnes én gang.
- **Felles deler (FR-28):** beregnes én gang på lavnivåkoden, etter alle overordnede deler, med samlet bruttobehov. Lagerbeholdning, SS og ledetid fra første rad. Planlagte mottak gjelder den samlede tabellen.
- **Netting (FR-6):** disponibel(t) = beholdning(t−1) + planlagte mottak(t) − bruttobehov(t). Beholdning(t−1) = forventet lagerbeholdning(t−1) + fremskyndede mottak som ikke er kommet, og lagerbeholdningen for t = 1. Nettobehov(t) = maks(0, SS − disponibel(t)). Ved nettobehov > 0 fremskyndes første senere uke med planlagte mottak helt til uke t, så neste, til nettobehovet er dekket eller det ikke finnes flere. Fremskyndede mottak regnes med fra uken de er fremskyndet til, men raden Planlagte mottak viser dem i uken de er lagt inn.
- **Ordremottak og lager (FR-7):** lot-for-lot: planlagt ordremottak = nettobehov. Forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak som ikke er kommet ennå.
- **Frigivelse (FR-8):** ordremottak i uke t gir frigivelse i uke t − L. Er t − L < 1, er den forfalt og legges i uke 1 (forfalt mengde er eget felt). L = 0 (bare ferdigproduktet) frigis samme uke. Behov etter horisonten tas ikke med. Beregningen er deterministisk.
- **Eksepsjoner (FR-9–FR-13, FR-29):** Ledetid overskrider horisont (ledetid fra ferdigproduktet ≥ H, uke «–»), Bestilling forsinket (nettobehov > 0, forfalt, disponibel < 0), Bruk av sikkerhetslager (nettobehov > 0, forfalt, 0 ≤ disponibel < SS), Mottak forsinket (ett per fremskyndet mottak, i uken det fremskyndes til), Kanseller mottak (ingen nettobehov fra mottaksuken til H når mottaket tas bort og ingenting fremskyndes; aldri for fremskyndede mottak). Disponibel i FR-10/11 er etter fremskynding, i FR-12 før. En del med minst én eksepsjon er kritisk.
- **Resultatet (FR-14–FR-17):** seks rader per del, nøyaktig H uker, stykklisterekkefølge, felles del én gang. Bestillingsforslag sortert på frigivelsesuke og så stykklisterekkefølge, med forfalt mengde og innkjøp/produksjonsordre.
- **NFR-1:** beregningen (§4.2–4.3 og kapasiteten) kan kjøres og testes alene, uten Excel-lesing, lagring eller UI.
- **NFR-2:** fasittester for hvert testeksempel. Én endret regel får minst én test til å feile. Fasitene er laget uavhengig av appens kode.
- **NFR-5:** 1000 rader, tre nivåer, 12 uker under 3 sekunder fra opplasting til resultattabell.
- **NFR-8:** eksepsjoner og kritiske deler markeres ikke med farge alene. Varenummer, beskrivelse og radnavn står fast ved sidescroll.

## Technical Decisions

- **Én netting (AD-7):** beregningen for én del (disponibel, fremskynding, nettobehov, planlagt ordremottak, frigivelse) finnes bare i `src/domene/netting.ts`, med ett innstillingsobjekt. Bestillingsplanen bruker standardinnstillingene. Kapasiteten (FR-31) bruker ledig beholdning, SS 0, ingen fremskynding, ingen forfalte frigivelser og ingen ordre på deler uten underdeler. Fast partistørrelse (FR-25) er én innstilling til. Kanseller mottak kjører nettingen én gang til uten mottaket.
- **Struktur (AD-6):** bare `domene/struktur.ts` (`byggStruktur`) bygger `Struktur`. Beregningen leser bare `Struktur`, aldri stykklisteradene. Rekkefølgen er `Struktur.beregningsrekkefolge` (stigende lavnivåkode, så stykklisterekkefølge).
- **Beregningen gir alt skjermen viser (AD-8):** `DelResultat` med seks serier og én `Utregning` per uke (beholdning forrige uke, planlagte mottak, bruttobehov fordelt på overordnede deler, disponibel før og etter fremskynding, SS, nettobehov, fremskyndede mottak, fremskyndet ikke kommet, forfalt mengde). UI og eksport formaterer bare.
- **Koder, ikke tekst (AD-9):** kjernen gir eksepsjonskoder og tall. All norsk tekst lages i `src/tekster/nb.ts`.
- **Data (AD-4):** serier per uke har lengde H (plass i = uke i + 1), ingen uke 0. Alle mengder er heltall. Bare disponibel og forventet lagerbeholdning kan være negative. Planlagte mottak er enkeltlinjer med Excel-rad, ikke summert på forhånd. `forfaltMengde` er 0 når ingenting er forfalt.
- **Delte typer (AD-3):** `src/domene/typer.ts` har `Utregning`, `DelResultat`, `Bestillingsforslag`, `Eksepsjon`, `Resultat`. Endringer i egen PR godkjent av koordinatoren (Idun) og minst én bruker.
- **Ren kjerne (AD-2):** `src/domene/` importerer bare `src/domene/`, og bruker ikke React, SheetJS, `window`, `Date`, `Math.random`. Arkitekturtesten håndhever det.
- **Worker (AD-12):** worker-en kjører les → valider → struktur → beregn → eksepsjoner (→ kapasitet) og svarer med én melding. Uventet feil gir `UVENTET_FEIL`, aldri halvt resultat (AD-5).
- **Tester (AD-16):** Vitest i `tests/` speiler `src/`. Fasittestene leser `testdata/*-fasit.xlsx` via en testhjelper med SheetJS (unntaket i AD-15) og sammenligner tall per del, uke og rad, og eksepsjoner (varenummer, uke, type), ikke ordlyd. `lag_testdata.py` kan leses som spesifikasjon, men importeres eller oversettes aldri.
- **Navn (kap. 4):** norske fagord fra ordbanken i ASCII. Nye fagord legges inn i `.docs/ordbank.md` først.

## UX & Interaction Patterns

- Resultat har fast rekkefølge: kjøringslinje med seksjonsmeny, tallbokser, «Slik leser du resultatet», kritiske deler, bestillingsforslag, (endringer), resultattabell.
- Resultattabellen er én semantisk `<table>` med én memoisert `<tbody>` per del. Eksepsjonsceller har farge og symbol/tekst. Uke «–» vises ved delens navn.
- Eksepsjonsmeldinger følger variant B i EXPERIENCE.md: typenavn og uke, én setning i vanlig språk, «Melding:», «Hvorfor:». Forfalte bestillinger skrives «før uke 1» og «bestilt», aldri «uke 0».
- Statusregionen kunngjør «Kjøringen er ferdig: N bestillingsforslag, M kritiske deler.»

## Cross-Story Dependencies

- 2.1 (netting) → 2.2 (beregn bruker nettingen per del) → 2.3 (eksepsjoner bruker svaret fra nettingen og kjører den på nytt for Kanseller mottak) → 2.4 (tekster fra eksepsjonene) → 2.5 (worker kobler inn struktur, beregn, eksepsjoner).
- Kjernen bygger på Epic 1: `Inndata` fra valideringen og `Struktur` fra Story 1.7.
- Skjermene (2.6–2.11) bruker `Resultat` og godkjennes med testeksempel 01 når 2.5 er flettet inn. 2.10 og 2.11 bygger på tastaturstyringen i 2.9.
- Epic 5 (kapasitet) og Epic 6 (fast partistørrelse) gjenbruker nettingen fra 2.1 via innstillingsobjektet. Signaturen skal ikke endres.
