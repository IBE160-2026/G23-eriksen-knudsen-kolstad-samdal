---
title: 'Story 1.9: Kontroll av MPS og Planlagte mottak'
type: 'feature'
created: '2026-11-24'
status: 'done'
baseline_commit: 'e0c2f1bae6c7441f60c31acd17555c21b0c0b574'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Verdiene i arkene MPS og Planlagte mottak kontrolleres ikke, og ingenting gir `Inndata`. Worker-en (1.10) trenger en samlet `valider()` som gir `Inndata` eller alle valideringsfeilene. Den skal ikke vente på Stykkliste-reglene (1.8).

**Approach:** I `src/domene/valider.ts` kommer `validerMpsOgMottak` og den samlede `valider(raa): Utfall<Inndata, Valideringsresultat>`. Den kjører strukturen (1.6), en plass til Stykkliste-reglene (1.8), MPS og Planlagte mottak, samler feilene og lager `Inndata` når filen er gyldig.

## Boundaries & Constraints

**Always:**
- **Horisonten (MPS):** uken er `excelRad − 1` (rad 2 = uke 1, som i malen). H er antall sammenhengende uker fra uke 1 der «Antall ferdigprodukter» ikke er tom.
  - H utenfor 8–12 gir én `MPS_HORISONT_UGYLDIG` på uke H + 1 når H < 8, og på uke 13 når H > 12.
  - Hver uke med antall etter den første tomme uken gir `MPS_UKE_ETTER_HULL` på den uken.
  - Hvert antall som ikke er `tolkHeltall` ≥ 0, gir `MPS_ANTALL_UGYLDIG` på uken, også innenfor H.
  - Stedet er `{ type: 'UKE', uke }` og feltet «Antall ferdigprodukter».
- **Planlagte mottak**, per rad med innhold. Stedet er cellen, med bokstaven fra `overskrifter`:
  - Varenummeret må finnes blant varenumrene i Stykkliste (tekst mot tekst, som `les` har gjort om), ellers `MOTTAK_VARENUMMER_UKJENT`. Det gjelder også et tomt varenummer.
  - En uke som ikke er heltall, gir `MOTTAK_UKE_IKKE_HELTALL`. En uke utenfor 1..H gir `MOTTAK_UKE_UTENFOR_HORISONT`.
  - Et antall som ikke er heltall ≥ 1, gir `MOTTAK_ANTALL_UGYLDIG`.
  - Et tomt ark er gyldig.
- **Hopp over:** kontroller som `hoppesOver(struktur, …)` sier skal hoppes over, kjøres ikke. Er horisonten ugyldig, hoppes uke-kontrollen mot H over (ingen følgefeil), men kontrollen av at uken er et heltall kjøres.
- **`valider`:** feilene er strukturfeil, så Stykkliste-reglene, så MPS og så Planlagte mottak. Stykkliste-reglene er en lokal funksjon som gir `[]`, med kommentaren «byttes ut med validerStykkliste fra Story 1.8».
- **Fra stykklisterad til `Stykklisterad`:** når Stykkliste-reglene gir 0 feil, gjøres hver rad om:
  - Nivå blir `'0' | '.1' | '..2'`.
  - Type blir kode: «Ferdigvare» gir FERDIGVARE, «Komponent (Kjøpes inn)» gir KJOPES_INN, og «Komponent (Produseres selv)» gir PRODUSERES_SELV.
  - Tallfeltene går gjennom `tolkHeltall`, og en tom celle blir `null`.

  En celle som ikke kan gjøres om, gir sikkerhetsnettet: koden for cellen (`NIVAA_UGYLDIG`, `VARENUMMER_MANGLER`, `BESKRIVELSE_MANGLER`, `TYPE_UGYLDIG`, `ANTALL_UGYLDIG`, `LAGERBEHOLDNING_UGYLDIG`, `SIKKERHETSLAGER_UGYLDIG` eller `LEDETID_UGYLDIG`) i stedet for et unntak.
- **Gyldig fil:** `valider` gir `Inndata` med stykklisteradene og Excel-radene, `horisont: H`, `prognostiserteBehov` med lengde H og planlagte mottak som enkeltlinjer, ikke lagt sammen (AD-4). Ellers `{ ok: false, feil: { feil, hoppetOver } }`.
- **Maler:** én mal per kode i `filfeilOgValidering.mpsOgMottak` i `nb.ts`, etter EXPERIENCE.md: «Planlagte mottak, rad 4, Uke: …» (sted og felt først, korte setninger), og MPS skrives «Prognostiserte behov (arket MPS)».

**Never:** ingen Stykkliste-regler utover sikkerhetsnettet (de hører til 1.8), ingen endring i `typer.ts` eller `les.ts`, ingen worker eller UI.

## I/O & Edge-Case Matrix

| Scenario | Input | Forventet |
|---|---|---|
| Gyldig | testeksempel 01–05, V-G01 (H = 8), V-G02 (H = 12), V-G03 (tomt ark Planlagte mottak) | `ok: true`. Testeksempel 01 gir H = 10 og `prognostiserteBehov[0] = 20` |
| Én feil | V-M01–V-M05, V-P01–V-P04 | Nøyaktig én feil, på stedet README-en oppgir |
| Flere feil | V-F05, V-F06 | MPS- og mottaksfeilene fra README-en finnes (uke 3 og B2, og C3) |
| Ugyldig horisont | MPS med 7 uker og et mottak i uke 9 | `MPS_HORISONT_UGYLDIG` på uke 8, og ingen `MOTTAK_UKE_UTENFOR_HORISONT` |
| Sikkerhetsnett | Nivå «3», resten gyldig | `ok: false` med `NIVAA_UGYLDIG`, ikke et unntak |

**Beslutninger (fattet i planleggingen):** uken leses fra Excel-raden og ikke fra kolonnen Uke. `MPS_UKE_ETTER_HULL` gis for hver utfylt uke etter hullet. Sikkerhetsnettet gjør at `valider` aldri kaster før 1.8 er flettet, og når 1.8 finnes, gir 1.8 feilene først.

</frozen-after-approval>

## Code Map

- `src/domene/valider.ts` (1.6) -- `validerStruktur`, `hoppesOver` (tar bare kolonnene i arket) og `kolonnebokstav`. Utvides her.
- `src/domene/heltall.ts` (1.6) -- `tolkHeltall(verdi): number | null`. Grensene avgjør den som kaller.
- `src/domene/typer.ts` -- `Inndata`, `Stykklisterad`, `PlanlagtMottak`, `Valideringsresultat`, `Feilsted` (`UKE`, `CELLE`), `Utfall`, `DELSTYPER`. Endres ikke.
- `src/excel/les.ts` -- MPS og Planlagte mottak har bare rader med innhold, med `excelRad`. Varenummer er alt trimmet tekst.
- `src/tekster/nb.ts` -- `filfeilOgValidering.struktur` og hjelperen `arkTekst` finnes. Legg til underobjektet `mpsOgMottak`.
- `tests/hjelpere/valideringsfasit.ts` -- `lesFasit` og `somIFasit`. `somIFasit` må lære at MPS-feltet heter «Antall per uke» i README-en, og at `UKE` blir «uke N».
- `tests/validering/struktur.test.ts` -- mønster for testene med V-filene gjennom `les`.
- `testdata/testeksempel-01.xlsx` -- MPS har ukene 1–12, og antall er utfylt for uke 1–10 (20, 25, 30 …).

## Tasks & Acceptance

**Execution:**
- [x] `src/domene/valider.ts` -- `validerMpsOgMottak(raa, struktur): Valideringsfeil[]`, `valider(raa)`, plassen for Stykkliste-reglene og omgjøringen til `Stykklisterad` med sikkerhetsnettet -- FR-3, FR-4, AD-4, AD-5.
- [x] `src/tekster/nb.ts` -- `filfeilOgValidering.mpsOgMottak` med maler for de sju MPS- og mottakskodene -- AD-9.
- [x] `tests/hjelpere/valideringsfasit.ts` -- utvid `somIFasit` for MPS (feltet «Antall per uke» og stedet «uke N»).
- [x] `tests/domene/valider-mps-og-mottak.test.ts` -- matrisen og hver regel med `RaaArk` bygd i koden. Det gjelder også `null`, «tretti», 30,5, −5, et tomt varenummer, tallet 300001 mot «300001», og et mottak når Stykkliste › Varenummer mangler.
- [x] `tests/validering/mps-og-mottak.test.ts` -- V-M01–V-M05, V-P01–V-P04, V-G01–V-G03, V-F05, V-F06 og testeksempel 01–05 gjennom `les` og `valider`, sammenlignet med README-en.
- [x] `tests/tekster/nb.test.ts` -- hver av de sju kodene har en mal som gir tekst uten koden, med arket og stedet først.

**Acceptance Criteria:**
- Gitt testeksempel 01, når den valideres, så har `Inndata` 9 stykklisterader med `excelRad` 2–10 og typene som koder, `horisont` 10 og planlagte mottak som to enkeltlinjer med `excelRad`.
- Gitt en fil med to mottak for samme del og uke, når den valideres, så er de to linjer i `Inndata`.
- Gitt `npm test`, når arkitekturtesten kjører, så er `domene/` fortsatt ren.

## Implementation Notes

## Spec Change Log

## Review Triage Log

Gjennomgang 1 (Blind Hunter, Edge Case Hunter, Verification Gap). Ruting: P = patch, D = defer, A = avvist. Ingen funn krevde en beslutning fra Sebastian. Under gjennomgangen la en annen Claude-økt tre loggcommits for PR #26 på grenen. De gjelder ikke 1.9 og holdes utenfor vurderingen.

| # | Funn | Dom | Bevis | Ruting |
|---|---|---|---|---|
| 1 | Tester som vil feile når 1.8 erstatter plassholderen (V-F05, grensene, Nivå «3» med eksakt `toEqual`) (ECH, BH) | medium | Når 1.8 flettes, gir D9 og grensereglene nye Stykkliste-feil, og de tre testene feiler uten forklaring | P |
| 2 | Malen for `MOTTAK_UKE_UTENFOR_HORISONT` finner uken ved å tolke sin egen tekst (BH, VG) | low | `Number(verdiTekst(...).replace('−','-'))` er skjørt, og bare uke 0 er testet ordrett | P |
| 3 | Teksten i `MPS_HORISONT_UGYLDIG` er feil når det er et hull (BH) | low | Er uke 1–5 og 7–9 fylt ut, sier den «bare 5 uker» selv om 8 er fylt ut | P |
| 4 | Beskrivelse trimmes ikke i sikkerhetsnettet (BH) | low | Varenummer trimmes, men Beskrivelse gjør ikke, så `' Stol '` beholder mellomrommene i `Inndata` | P |
| 5 | Ingen test av verdier sikkerhetsnettet skal godta (tall i Beskrivelse, Type med mellomrom bak) (VG) | low | Grenene for tall og trimming er ikke testet | P |
| 6 | Rekkefølgen for mottaksfeil i flere rader er ikke testet (VG) | low | Bare én rad med flere feil er testet | P |
| 7 | Ingen test for en overskrift i Planlagte mottak som mangler (BH) | low | Hoppe over-grenen for Uke i mottak har ingen test i domenet | P |
| 8 | «Følgefeil» og «Hull» mangler i ordbanken (BH) | low | Ordene brukes i kode og meldinger (CLAUDE.md) | P |
| 9 | Plassholderen for Stykkliste-reglene gir `ok: true` for en Stykkliste som bryter FR-3 (ECH) | false | Det er med vilje (den låste beslutningen): 1.9 skal ikke vente på 1.8 | A |
| 10 | Uten MPS hoppes også kontrollen av at uken er et heltall over (BH) | low | Det følger regelen i den låste delen (`hoppesOver` gjelder hele feltet). MPS som mangler er sjeldent, og Kari ser feilen etter å ha rettet MPS | A |
| 11 | Nivå `.1` lagret som tallet 0.1 avvises (BH) | false | Sebastian godtok dette 24.11 (Story 1.5) | A |
| 12 | Meldingen «etter horisonten» sier ikke hva H er (BH) | low | `Valideringsfeil` har ikke plass til H. Krever en endring i `typer.ts` | D |
| 13 | Sikkerhetsnettets Stykkliste-koder har ingen tekstmal, og ingen test sjekker at alle koder har en mal (BH) | medium | `nb.ts` har bare `struktur` og `mpsOgMottak`. Malene for Stykkliste hører til 1.8 | D |
| 14 | En sannhetsverdi i Beskrivelse gir «mangler» (ECH, BH) | low | Det er svært sjeldent, og 1.8 tar over kontrollen | A |
| 15 | Tall i eksponentform i meldinger (ECH) | low | 1e-7 og 1e21 er urealistiske i malen | A |
| 16 | `lesMps` kjøres to ganger, og det finnes stille reserveverdier (`?? ''`, `?? 0`) (BH) | low | Liten kostnad. Reserveverdiene nås ikke når valideringen ikke har gitt feil | A |
| 17 | `return undefined as T` i `celle` (BH) | low | Det er bare en risiko ved omskriving. Flagget `fullstendig` hindrer feil i dag | A |
| 18 | Diffen har loggene for PR #26 og mangler spesifikasjonen (BH) | false | Loggene er fra en annen økt. Spesifikasjonen er holdt utenfor diffen med vilje (den er påstandsfila) | A |
| 19 | `kort()` gjentar `stedSomIFasit` (BH) | low | Det gjelder bare testkode, og det er ingen feil | A |

## Verification

**Commands:**
- `npm test` -- alle grønne
- `npm run lint` -- ingen advarsler
- `npm run build` -- grønn
