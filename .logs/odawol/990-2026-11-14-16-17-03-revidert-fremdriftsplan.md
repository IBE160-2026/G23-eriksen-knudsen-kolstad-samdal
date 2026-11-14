# Revidert fremdriftsplan

## 2026-11-14 kl. 16:17 — Odawol

### Oppgave
Gå gjennom fremdriftsplanen sammen og revidere den etter der prosjektet faktisk står. Briefen ble godkjent ca. 25.10 (dag 0), PRD-en med de siste endringene ble godkjent 13.11, og innleveringsfristen 15.12.2026 står fast.

### Plan
- Sammenlignet `.docs/prosjektstyring/fremdriftsplan.xlsx` med PRD §7.1 (trinn 1–5, kuttbeslutning 30.11) og §8.1 (prøvetest ca. 27.11, brukertest 2.–7.12 med 4–8 testpersoner).
- Med dag 0 = 25.10 blir levering dag 51 i stedet for 56, så alle stegene ble lagt om.
- Endret XML-en i fila direkte med et skript (formler, Gantt-formatering og nedtrekkslister er beholdt), kontrollerte kopien og åpnet den i Excel før den ble lagt inn i repoet.

### Resultat
- **Dag 0 (C2):** 25.10.2026. Datoer og Gantt regnes nå ut. LEVERING (H19) har formelen tilbake og gir 15.12.2026 (dag 51). Det løser Carmens åpne punkt om at H19 ikke fulgte dag 0.
- **Ny plan (dag → dato):**
  - Testeksempel 1–3 (Ferdig)
  - PRD 3–19, til 13.11 (Ferdig)
  - Arkitektur 19–24, til 18.11 (Pågår)
  - Epics og stories 24–26, 18.–20.11
  - Trinn 1a Excel-mal og validering 26–29, 20.–23.11
  - Trinn 1b Beregningsmotor 26–31, 20.–25.11
  - Trinn 1c og 2 Eksepsjoner, resultattabell og forklaringer 30–33, 24.–27.11 (prøvetest ca. 27.11)
  - Trinn 3 Lagring, sammenligning og eksport 32–35, 26.–29.11
  - MILEPÆL Kuttbeslutning 36, 30.11
  - Brukertest 38–43, 2.–7.12
  - Trinn 4 Produksjonskapasitet 37–43 og trinn 5 Fast partistørrelse 41–45 (kuttes først)
  - Full testing og rettinger 44–48
  - README og sporbarhet 46–50
  - LEVERING 51, 15.12 kl. 15:00
- **Rettet:** teknologi (nettapp på Vercel i stedet for Python), brukertest (4–8 testpersoner og SM-3), trinnene og FR-numrene fra PRD §7.1, merknaden (51 dager, trinn 4 og 5 kuttes først) og A3 (revisjonsnotat).
- **Feil i fila rettet:** «Pågår» var lagret som `P�g�r` i nedtrekkslisten og fargeregelen på begge arkene, så statusen fikk aldri farge. Det virker nå.
- **Arket Tilbakemelding:** punkt 1, 2, 3, 4, 6 og 8 er satt til Ferdig, og punkt 5 (skisse av resultattabell) og 7 (PRD og arkitektur) til Pågår.
- **Kontroll:** XML er gyldig, betinget formatering og validering er uendret (bortsett fra «Pågår»), og Gantt-cellene er uendret. Excel åpner fila uten reparasjon og viser riktige datoer. Fila er committet på `Oda/Branch` i `4b6a5d0` (ikke pushet).
- Lukket to punkter i `issues.md` som den godkjente PRD-en løser.

### Åpne punkter
- Statusene i arket Tilbakemelding og «Pågår» for arkitekturen er satt ut fra repoet. Gruppen bør bekrefte dem.
- Ansvarlig (kolonne J) mangler for de fleste stegene. Gruppen bør fordele trinn 1a, 1b og de neste stegene før 20.11.
