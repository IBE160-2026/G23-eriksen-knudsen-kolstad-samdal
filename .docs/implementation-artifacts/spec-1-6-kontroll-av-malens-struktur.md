---
title: 'Story 1.6: Kontroll av malens struktur'
type: 'feature'
created: '2026-11-24'
status: 'done'
baseline_commit: 'd8237fd82bdd20827b32bc393df7d0922a71a44e'
route: 'dispatch'
review_loop_iteration: 1
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen sier ikke fra når filen mangler et ark eller en kolonneoverskrift fra malen, eller når den følger den gamle malen. Story 1.8 og 1.9 trenger også å vite hvilke kontroller som skal hoppes over, og de trenger én felles regel for heltall.

**Approach:** `validerStruktur(raa: RaaArk): Valideringsresultat` i `src/domene/valider.ts` gir én valideringsfeil per ark eller overskrift som mangler, og en liste over kontrollene som hoppes over. `tolkHeltall` i `src/domene/heltall.ts` er den felles heltallsregelen (AD-4). `tekster/nb.ts` får én mal per strukturkode.

## Boundaries & Constraints

**Always:**
- Ren kjerne (AD-2): ingen unntak for feil i brukerens data, alle feil samles før svaret, og ingen ferdig tekst i `domene/` (AD-5, AD-9). Typene i `typer.ts` brukes som de er.
- Arkene kontrolleres i rekkefølgen i `ARKNAVN`. Mangler et ark, gir det `ARK_MANGLER` med `sted: { type: 'ARK' }` og `felt: 'Ark'`, og overskriftene i arket kontrolleres ikke.
- Mangler Stykkliste og `alleArk` har «Produkt» eller «Komponenter», gir det i stedet én `GAMMEL_MAL` på arket Stykkliste.
- Hver overskrift som er `null` i et ark som finnes, gir `OVERSKRIFT_MANGLER`, i malens kolonnerekkefølge. Feltet er kolonnenavnet, og stedet er `{ type: 'OVERSKRIFT', celle }`, der cellen er malens plass (indeks i `*_KOLONNER` → bokstav, rad 1). For eksempel er «Ledetid (uker)» H1.
- `hoppetOver` har én linje per (ark, felt) som ikke kan kontrolleres:
  - alle kolonnene i et ark som mangler (`fordi: ARK_MANGLER`), også ved gammel mal
  - hver overskrift som mangler (`fordi: OVERSKRIFT_MANGLER`)
  - Planlagte mottak › Uke når MPS eller «Antall ferdigprodukter» mangler (horisonten er ukjent)
  - Planlagte mottak › Varenummer når Stykkliste eller Stykkliste › Varenummer mangler

  Ingen linje gjentas.
- `tolkHeltall(verdi: Celleverdi): number | null` godtar et tall som er et trygt heltall, og en tekst som etter trimming er `^-?[0-9]+$`, der verdien er et trygt heltall («7», «007», «-3»). `-0` gir 0. Alt annet gir `null`: desimaltall (1,5, «30,5», `30.5`), ord («fem»), «1 000», «+5», «ca. 40», tom tekst, sannhetsverdier og `null`. Grensene (≥ 0, ≥ 1) avgjør den som kaller funksjonen.
- Malene i `nb.ts` legges i underobjektet `filfeilOgValidering.struktur` (1.8 og 1.9 lager sine egne underobjekter). Hver mal er en funksjon av `Valideringsfeil` som gir norsk tekst i du-form, uten kode, med arket og stedet først. Teksten følger EXPERIENCE.md (avgjort av Sebastian 24.11, etter gjennomgang 1):
  - korte setninger, først hva som er galt og så hva Kari gjør
  - MPS skrives «Prognostiserte behov (arket MPS)»
  - `GAMMEL_MAL` gir ordrett «Arket Stykkliste mangler. Filen ser ut til å følge en gammel mal (arkene Produkt og Komponenter). Last ned malen fra startsiden og flytt dataene over.»

**Never:** ingen verdikontroller (1.8, 1.9), ingen `Inndata`, ingen samlet `valider()`, ingen UI, ingen endring i `typer.ts` eller `les.ts`.

## I/O & Edge-Case Matrix

| Scenario | Input | Forventet |
|---|---|---|
| Gyldig | testeksempel 01–05, V-G01–V-G05 | 0 feil, `hoppetOver` er tom |
| MPS mangler | V-F01 | 1 feil `ARK_MANGLER` på MPS, og `hoppetOver` har begge MPS-kolonnene og Planlagte mottak › Uke |
| Overskrift mangler | V-F02, V-F06 | 1 feil `OVERSKRIFT_MANGLER` på Stykkliste H1, felt «Ledetid (uker)» |
| Gammel mal | V-F03 | 1 feil `GAMMEL_MAL` på Stykkliste. Ingen `ARK_MANGLER` |
| Alt mangler | `RaaArk` med tre `null`-ark og `alleArk: []` | 3 feil `ARK_MANGLER` i rekkefølgen Stykkliste, MPS, Planlagte mottak |

</frozen-after-approval>

## Code Map

- `src/domene/typer.ts` -- `RaaArk`, `Valideringsfeil`, `Feilsted`, `HoppetOverKontroll`, `Valideringsresultat`, `ARKNAVN`, `*_KOLONNER`, `Celleverdi`. Endres ikke.
- `src/excel/les.ts` (Story 1.5, på grenen vi bygger på) -- gir `RaaArk`: et ark som mangler, er `null`, og en overskrift som mangler, er `null`. Testene leser V-filene med `les(readFileSync(sti), filnavn)`.
- `src/tekster/nb.ts` -- seksjonen `filfeilOgValidering = {} as const` er tom. `tekster/` kan bare importere typer fra `domene/` (arkitekturtesten).
- `tests/domene/typer.test.ts:176-270` -- kodene per V-fil og lesingen av README-linjene (`| \`V-…\` |`, kolonne 3 er antall feil). Gjenbruk mønsteret.
- `testdata/validering/README.md` -- fasit: kolonnene Fil, Tilfelle, Feil, Ark, Sted, Felt, Regel. Sted «–» betyr hele arket. Felt er «Ark» eller «Overskrift».
- Iduns spesifikasjon for 1.8 (`origin/story/1.8-kontroll-stykkliste`) bruker `domene/valider-stykkliste.ts` og planla `heltall.ts`. Sebastian bestemte 24.11 at heltallsfunksjonen lages her.

## Tasks & Acceptance

**Execution:**
- [x] `src/domene/heltall.ts` -- `tolkHeltall` etter reglene over -- AD-4, felles for 1.6, 1.8 og 1.9.
- [x] `src/domene/valider.ts` -- `validerStruktur` og eksporten `hoppesOver(resultat, ark, felt): boolean`, så 1.8 og 1.9 kan spørre -- FR-2.
- [x] `src/tekster/nb.ts` -- `filfeilOgValidering.struktur` med maler for `ARK_MANGLER`, `GAMMEL_MAL` og `OVERSKRIFT_MANGLER`. Gammel mal ber Kari laste ned den nye malen -- AD-9, NFR-7.
- [x] `tests/hjelpere/valideringsfasit.ts` -- leser én linje i `testdata/validering/README.md` og gir `{ antall, ark, sted, felt }`. Gjenbrukes av 1.8 og 1.9.
- [x] `tests/domene/heltall.test.ts` -- én test per tilfelle i reglene for `tolkHeltall`.
- [x] `tests/domene/valider.test.ts` -- matrisen med `RaaArk` bygd i koden, og hoppetOver-reglene, også uten Stykkliste › Varenummer.
- [x] `tests/validering/struktur.test.ts` -- V-F01, V-F02, V-F03, V-F06 og de gyldige filene gjennom `les` og `validerStruktur`, sammenlignet med README-en via hjelperen.
- [x] `tests/tekster/nb.test.ts` -- hver strukturkode har en mal som gir tekst uten koden, og malen nevner arket. For `OVERSKRIFT_MANGLER` nevner den også overskriften.
- [x] `.docs/ordbank.md` -- legg til «Gammel mal» (filen med arkene Produkt og Komponenter) hvis det mangler, og oppdater `updated`.

**Acceptance Criteria:**
- Gitt V-F06, når strukturen valideres, så er det bare H1-feilen. Verdifeilen i C3 er 1.9 sin.
- Gitt en `RaaArk` der både Stykkliste › Nivå og › Antall mangler, når den valideres, så kommer feilene i malens rekkefølge (A1 før D1).
- Gitt `npm test`, når arkitekturtesten kjører, så bruker `domene/` ingen SheetJS og ingen globale objekter, og `tekster/` importerer bare typer.

## Implementation Notes

## Spec Change Log

- **Gjennomgang 1, funn 1–3 (intent_gap):**
  - **Problemet:** regelen om én setning i den låste delen stred mot EXPERIENCE.md, som har den godkjente teksten for `GAMMEL_MAL` i tre setninger og sier at MPS skrives «Prognostiserte behov (arket MPS)».
  - **Endringen:** Sebastian avgjorde at regelen for malene skal følge EXPERIENCE.md. Han valgte også å beholde koden og bare skrive om malene i `nb.ts` og `tests/tekster/nb.test.ts`, i stedet for å tilbakestille alt slik BMAD sier.
  - **Dette unngås:** meldinger som avviker fra den godkjente teksten.
  - **KEEP:** `validerStruktur`, `hoppesOver`, `tolkHeltall`, `valideringsfasit.ts` og testene for dem. Alle besto gjennomgangen.

## Review Triage Log

Gjennomgang 1 (Blind Hunter, Edge Case Hunter, Verification Gap, som ikke fant noe). Ruting: I = intent_gap, P = patch, D = defer, A = avvist.

| # | Funn | Dom | Bevis | Ruting |
|---|---|---|---|---|
| 1 | `GAMMEL_MAL` bruker ikke den godkjente teksten (BH) | medium | EXPERIENCE.md linje 85 gir teksten ordrett, i tre setninger. Den låste regelen «én norsk setning» hindrer den | I |
| 2 | Setningene med «…, så legg det til» leses dårlig (BH) | low | Samme årsak som 1: regelen om én setning | I |
| 3 | Malene skriver «MPS» alene (BH) | medium | EXPERIENCE.md linje 74: «Prognostiserte behov (arket MPS)» første gang. `nb.ts` skriver `feil.ark` som det er. Grupperes med 1 og 2, fordi malene skrives om samlet | I |
| 4 | Avhengigheter inne i Stykkliste står ikke i `hoppetOver` (BH) | medium | Uten Varenummer eller Nivå kan flere regler i 1.8 ikke brukes. `HoppetOverKontroll` har bare (ark, felt), så en delregel kan ikke uttrykkes uten endring i `typer.ts` | D |
| 5 | Horisonten uten MPS › Uke (BH) | false | FR-3 utleder horisonten fra «Antall ferdigprodukter» (sammenhengende utfylte rader fra uke 1). Uke-kolonnen trengs ikke | A |
| 6 | Ingen tekst for kontroller som hoppes over, og ingen gruppeoverskrift (BH) | false | AC-en i 1.6 krever bare dataene («så feiloppsummeringen kan vise det»). Tekstene hører til 1.12 | A |
| 7 | Ingen test for en fil med både Stykkliste og Produkt (BH) | low | Koden ser bare etter gamle ark når Stykkliste mangler, så den er riktig. Testen er lett å legge til | P |
| 8 | Arknavn som nesten stemmer, gir ikke et hint (BH, ECH) | low | Arknavnene i malen ligger fast. Rettingen krever ny logikk for navn som ligner | A |
| 9 | `hoppesOver` godtar par som ikke finnes, for eksempel MPS og «Ledetid (uker)» (BH) | low | En skrivefeil i 1.8 eller 1.9 gir stille `false`. Typen kan strammes med en generisk parameter | P |
| 10 | Endringer i epic-1-context er med i diffen (BH) | false | Konteksten ble laget på nytt i steg 1, fordi AD-15 var nyere. Det var med vilje | A |
| 11 | «Strukturfeil» mangler i ordbanken (BH) | low | Ordet brukes i kode og UX. En linje i ordbanken | P |
| 12 | Tomme seksjoner i spesifikasjonen, og `nb.test` velger tilfeller etter plass i lista (BH) | low | Rettingen er å endre spesifikasjonen. `nb.test` skrives om med malene (1) | A |
| 13 | Et flyttall nær et heltall fra en formel (3,0000000000000004) (ECH) | low | Det er sjeldent i malen, og det er ikke et heltall etter regelen | A |
| 14 | `valideringsfasit`: en tom Feil-celle blir 0 (ECH) | low | `Number('')` gir 0. Rettes med en kontroll som kaster | P |
| 15 | `valideringsfasit`: listene har en annen lengde enn antallet (ECH) | low | Kan gi misvisende tester i 1.8 og 1.9. Rettes med en kontroll som kaster | P |

## Verification

**Commands:**
- `npm test` -- alle grønne
- `npm run lint` -- ingen advarsler
- `npm run build` -- grønn
