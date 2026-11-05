# PRD Finalize uten final

## 2026-11-05 kl. 16:17 — Sebastian

### Oppgave
Sebastian vil legge fram en ferdig PRD for gruppen på møtet i dag. Han ba om å kjøre Finalize i `bmad-prd`, men stoppe før `status: final`, slik at gruppen kan endre før PRD-en låses.

### Plan
- **Steg 1, memlog-revisjon:** 44 av 46 linjer er dekket. Innlevering via GitHub holdes utenfor PRD-en.
- **Steg 2–3, avstemming og kvalitetsgjennomgang:** Avstemming mot brief, faglærers tilbakemelding, research, testdata og ordbank/beslutninger, pluss kvalitetsgjennomgang mot sjekklista. Rapportene ligger i PRD-mappa (`reconcile-*.md`, `review-rubric.md`).
- **Steg 4, åpne punkter:** §9 spm. 4 har fått en ansvarlig (gruppen) og et tidspunkt (møtet i dag, senest før brukertesten planlegges i UX-steget).
- **Steg 5, polering:** `bmad-review` med linsene struktur og språk på `prd.md` og `addendum.md`.
- Forrige økt: [brukerreiser-gjennomgatt](989-2026-11-05-14-34-31-brukerreiser-gjennomgatt.md).

### Resultat
- **Kvalitetsgjennomgangen:** karakter god, 0 kritiske og 2 høye funn.
- **Rettet etter avstemmingen:**
  - FR-6/FR-7 ga dobbeltdekning når teksten leses bokstavelig. Det er kontrollert mot `mrp_del` og rettet: disponibel beholdning regnes med fremskyndede mottak.
  - FR-10/FR-11 bruker disponibel beholdning etter fremskynding.
  - FR-3 godtar underdeler under bare én forekomst, og feltet heter «Antall ferdigprodukter».
  - Begreper er rettet: resultattabell, underdel, planlagt ordremottak og fremskyndet mottak.
  - Addendumet har fått nytt om slutten av horisonten, ukeskiftet og faseplanen.
  - Avvikseksjonen i ordbanken er skrevet om.
  - `testdata/README.md` linje 58 sier nå 100-002.
- **Sebastians beslutninger:**
  - Ordlyden i eksepsjonsmeldingene er ikke et krav (FR-13).
  - Byggerekkefølgen står i §7.1: kjernen, så forklaringer, så lagring, sammenligning og eksport, så fast partistørrelse.
  - Testdata for nye og fjernede deler (FR-20) blir et åpent punkt.
  - **Samlet planlegging av flere ferdigprodukter blir første utvidelse etter v1.** v1 har én fil per ferdigprodukt, og brukeren fordeler selv lageret for deler som brukes i flere produkter. Det står i §6, FR-27, UJ-2 og §7.2.
- **Struktur:** PRD-en er gått fra 8 275 til ca. 7 100 ord.
  - §3 har bare definisjoner, med henvisning til kravene.
  - Begrunnelser, endringshistorikk, lukkede spørsmål og antagelsestabellen er flyttet til addendumet.
  - Merkene om hvem som bestemte og når er fjernet fra kravteksten.
  - §7.1 er én liste i byggerekkefølge.
  - Brukerreisene er strammet inn.
  - Addendumet har fått et leserkart, gruppert innspill til arkitekturen og en ny del «Innspill til UX».
- **Språk:** Rundt 70 rettelser i begge dokumentene. Numrene på lukkede spørsmål vises nå riktig i Markdown. Tre nye begreper er lagt inn i ordbanken: frysing, dempingsterskel og nervøsitet i planen.
- PRD-en er fortsatt `status: draft`. Endringene var ikke committet da loggen ble skrevet.

### Åpne punkter
- Etter gruppemøtet: før inn gruppens endringer, sett `status: final` (Finalize steg 7) og merge til `main`.
- Lag testdata for nye og fjernede deler i før/etter-sammenligningen (FR-20). Det trengs også en linjetype for deler i `sammenligning()` i `lag_testdata.py`.
- Rett arket «Veien videre» i malen neste gang malen endres. Det bruker «varsel» og «komponent», lister fire eksepsjonstyper og har den gamle regelen for Ledetid overskrider horisont (se ordbanken).
