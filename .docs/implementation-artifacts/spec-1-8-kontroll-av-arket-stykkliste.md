---
title: 'Story 1.8: Kontroll av arket Stykkliste'
type: 'feature'
created: '2026-11-23'
status: 'draft'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/planning-artifacts/epics.md'
  - '{project-root}/.docs/planning-artifacts/architecture/architecture-COSI - MRP-2026-11-22-vedtatt/arkitektur.md'
  - '{project-root}/testdata/validering/README.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen må finne hver feil i arket Stykkliste før beregningen, også verdier Excel ikke stoppet, for eksempel etter innliming (FR-3, Story 1.8). Ellers kan beregningen bygge på en stykkliste som ikke følger reglene.

**Approach:** En ren funksjon i `src/domene/` kontrollerer stykklisteradene fra `RaaArk` mot alle reglene for Stykkliste i FR-3 og gir `Valideringsfeil` med kode, sted og felt, aldri ferdig tekst (AD-5, AD-9). `tekster/nb.ts` får én mal per regel. Testene kjører `V-S01`–`V-S29` og `V-G04` mot `testdata/validering/README.md`.

## Boundaries & Constraints

**Always:**
- Kontrollen ligger i `src/domene/` og importerer bare fra `src/domene/` (AD-2). Ingen SheetJS, ingen DOM.
- Bruk typene i `src/domene/typer.ts` som de er (`Valideringsfeil`, `Feilsted`, `VALIDERINGSKODER`, `RaaArk`). Trengs en endring, går den i egen PR med koordinatorens godkjenning (AD-3).
- Alle feil samles før funksjonen svarer (FR-4, AD-5). Én feil i filen gir nøyaktig én valideringsfeil, uten følgefeil.
- Heltall lagret som tekst godtas etter regelen i FR-3 (`^-?[0-9]+$` etter trimming). Varenummer tolkes aldri som tall (AD-4).
- Reglene om underdeler bruker `Struktur` fra Story 1.7 (AD-6).
- Tekstmalene står i `tekster/nb.ts`, med sted og felt først (UX-DR5).

**Never:**
- Ikke les Excel-filen her. Det er Story 1.5 (`excel/les.ts`).
- Ikke kontroller MPS eller Planlagte mottak. Det er Story 1.9.
- Ikke kontroller at ark eller overskrifter mangler. Det er Story 1.6.
- Ikke sammenlign ordlyden i testene (AD-16).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig stykkliste | Testeksempel 01–05, `V-G04` | Ingen feil | – |
| Én regel brutt | `V-S01`–`V-S29` | Nøyaktig én feil med ark, sted og felt fra README-en | – |
| Tom rad midt i | `V-S01` (`tomRadMedInnholdUnder: 9`) | Én feil `RADER_IKKE_SAMMENHENGENDE` på rad 9. Radene under kontrolleres ikke | – |
| For mange rader | `V-S03` (1001 rader) | Én feil `RADER_FOR_MANGE` på rad 1002 | Se åpent spørsmål 1 |
| Ingen Ferdigvare | `V-S05`, `V-S19` | Bare feilen filen er laget for, ingen ekstra feil | – |
| Innlimt verdi | Nivå «3», type «Delmontering» | `NIVAA_UGYLDIG` / `TYPE_UGYLDIG` | – |
| Heltall som tekst | Antall «7» | Godtas som 7 | «fem» og 1,5 gir `ANTALL_UGYLDIG` |
| Felles del | Like underdeler under begge forekomster, eller bare under én | Gyldig | Ulikt antall eller ulik underdel: én `UNDERDELER_ULIKE` med varenummeret og begge radene (`V-S22`) |

</frozen-after-approval>

## Open Questions

- **1. Les Excel-delen forbi rad 1001?** AD-15 sier at Excel-delen leser «til og med rad 1001». Men `V-S03` har 1001 rader (rad 2–1002) og skal gi feil på rad 1002. Alternativer: A) Excel-delen leser hele det brukte området i kolonnene A–H, og AD-15 rettes (V-S03 kan testes som krevd) / B) Excel-delen leser til rad 1001 og melder at det finnes mer under (nytt felt i `RaaArk`, krever typeendring og koordinatorens godkjenning). **Anbefaling: A.** Avgjøres med den som tar Story 1.5.
- **2. Hvor bor tolkningen av heltall?** Story 1.9 trenger samme regel. Alternativer: A) `src/domene/heltall.ts`, som brukes av både 1.8 og 1.9 / B) en egen kopi i hver kontroll (to steder å rette). **Anbefaling: A.**
- **3. Underdeler når andre feil finnes?** `Struktur` (1.7) bygges av kontrollerte rader. Alternativer: A) Underdelene kontrolleres bare når nivå og varenummer er gyldige, så det ikke blir følgefeil / B) Kontrollen kjøres alltid. **Anbefaling: A**, fordi hver V-fil skal gi nøyaktig én feil.

## Code Map

- `src/domene/typer.ts` -- `RaaArk` (med `tomRadMedInnholdUnder`), `Valideringsfeil`, `Feilsted`, `VALIDERINGSKODER` (Stykkliste-kodene, linje 174–219). Endres ikke.
- `src/domene/valider-stykkliste.ts` -- ny: `validerStykkliste(ark): Valideringsfeil[]`
- `src/domene/heltall.ts` -- ny (åpent spørsmål 2): `tolkHeltall(verdi: Celleverdi)`
- `src/domene/struktur.ts` -- fra Story 1.7, brukes til underdelene
- `src/tekster/nb.ts` -- én mal per Stykkliste-kode
- `testdata/validering/README.md` -- fasit for antall feil, ark, sted og felt per fil

## Tasks & Acceptance

**Execution:**
- [ ] `src/domene/heltall.ts` -- tolkning av heltall etter FR-3, med enhetstester for «7», «007», «-5», 1,5, «30,5», «fem», «1 000», «+7» -- regelen deles med Story 1.9
- [ ] `src/domene/valider-stykkliste.ts` -- reglene for rader, nivå, varenummer, beskrivelse, antall, type, lager, SS og ledetid -- FR-3
- [ ] `src/domene/valider-stykkliste.ts` -- reglene for underdeler og «kjøpes inn har ingen underdeler» med `Struktur` -- AD-6, når Story 1.7 er flettet
- [ ] `src/tekster/nb.ts` -- én mal per Stykkliste-kode, sted og felt først -- UX-DR5
- [ ] `tests/domene/valider-stykkliste.test.ts` -- enhetstester med `RaaArk` bygd i koden, én per regel -- kan skrives før Story 1.5 er ferdig
- [ ] `tests/validering/stykkliste.test.ts` -- én test per fil `V-S01`–`V-S29` og `V-G04` gjennom `excel/les` og valideringen, mot README-en -- når Story 1.5 er flettet

**Acceptance Criteria:**
- Gitt hver fil `V-S01`–`V-S29`, når testen kjører, så gir den nøyaktig én valideringsfeil med ark, sted og felt som i `testdata/validering/README.md`.
- Gitt `V-G04` og testeksempel 01–05, når stykklisten valideres, så gir den ingen feil.
- Gitt formlene i hjelpekolonnene og de tomme, formaterte radene i malen, når stykklisten valideres, så regnes de ikke som innhold.
- `npm run build`, `npm test` og `npm run lint` er grønne.

## Implementation Notes

**Avhengigheter (23.11):** Story 1.2 (typer, PR #21) er godkjent av koordinatoren, men ikke flettet. Story 1.5 (les), 1.6 (kontroll av struktur) og 1.7 (stykklistestruktur) er ikke startet. Branchen bygger på `story/1.2-delte-typer`. Enhetstestene og `heltall.ts` kan lages nå. Testene med V-filene venter på 1.5, og underdelene venter på 1.7. Ifølge fremdriften gjøres 1.8 28.–30.11.
