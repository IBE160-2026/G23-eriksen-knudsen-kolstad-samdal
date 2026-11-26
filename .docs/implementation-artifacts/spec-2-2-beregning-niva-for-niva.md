---
title: 'Story 2.2: Beregning nivå for nivå'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: '8c85e51cc0d68098627cc5472aa6db01215b1dda'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Nettingen (Story 2.1, PR #43) regner én del. Det finnes ingen beregning av hele stykklisten, ingen `Resultat` og ingen fasittest som leser Excel, så appen kan ikke vise en bestillingsplan, og SM-1 er ikke kontrollert.

**Approach:** Ny ren funksjon `beregnBestillingsplan(inndata, struktur): Resultat` i `src/domene/beregn.ts`. Den går gjennom `struktur.beregningsrekkefolge`, lager bruttobehovet for hver del fra MPS eller fra frigivelsene til de overordnede delene, kaller `beregnNetting` med standardinnstillingene og setter sammen `DelResultat`, `Utregning` og bestillingsforslagene. En testhjelper leser fasitene, og fasittestene kjører les → valider → byggStruktur → beregn for testeksempel 01–05.

## Boundaries & Constraints

**Always:**
- **Rekkefølge (AD-6):** delene beregnes i `struktur.beregningsrekkefolge`. Stykklisteradene leses aldri. Mangler resultatet for en overordnet del når en del skal beregnes, kastes en `Error` (programfeil, blir `UVENTET_FEIL` i worker-en i Story 2.5).
- **Bruttobehov (FR-5, FR-28):** del uten overordnede (ferdigproduktet) = `inndata.prognostiserteBehov`. Ellers bruttobehov(t) = Σ over `del.overordnede` av frigivelse_p(t) × antall. `overordnede` er allerede slått sammen av `byggStruktur` (en felles del én gang, to forekomster under samme del summert), så beregn summerer bare. Frigivelsen i uke 1 har den forfalte mengden i seg, så en forfalt frigivelse gir bruttobehov i uke 1 for delene under (FR-8).
- **Netting (AD-7):** `beregnNetting({ lagerbeholdning, sikkerhetslager, ledetid, bruttobehov, planlagteMottak })` fra `netting.ts` uten innstillinger. Mottakene filtreres på varenummer og holder rekkefølgen fra inndataene. Ingen nettingregler i `beregn.ts`.
- **DelResultat (AD-8, FR-14):** seks serier med lengde H. `forfaltMengde` = nettingens totale. `utregning[t]` = nettingens uketrinn uten `planlagtOrdremottak` og `forventetLagerbeholdning`, pluss `prognostiserteBehov` (MPS(t) for ferdigproduktet, ellers null) og `bruttobehovFra` med én post per overordnet del i rekkefølgen i `del.overordnede`: `{ varenummer, frigivelse: frigivelse_p(t), antall }`, også når frigivelsen er 0. Tom liste for ferdigproduktet.
- **Resultat:** `deler` i rekkefølgen i `struktur.deler` (stykklisterekkefølge). `bestillingsforslag`: én per del og uke med frigivelse > 0, `forfaltMengde` = delens forfalte mengde i uke 1 og 0 ellers, `art` INNKJOP for KJOPES_INN og ellers PRODUKSJONSORDRE. Sortert stabilt etter frigivelsesuke og så stykklisterekkefølge (FR-17).
- Ren og deterministisk (AD-2). `beregn.ts` importerer bare `./typer.ts` og `./netting.ts`. `typer.ts` endres ikke.
- **Fasittester (AD-15, AD-16):** `tests/hjelpere/fasit-leser.ts` er den eneste nye filen med SheetJS (står alt i `SHEETJS_UNNTAK`). Den leser Fasittabell (varenummer, radnavn, H tall) og Bestillingsforslag (tom forfalt mengde → 0, «Innkjøp»/«Produksjonsordre» → kode). Testene sammenligner hvert tall per del, rad og uke, rekkefølgen på delene og hele listen med bestillingsforslag.
- Nye fagord (Fasittest, Beregningsrekkefølge) legges inn i `.docs/ordbank.md`, og `updated` oppdateres.

**Beslutninger (Carmen, 26.11.2026):**
- **1A – komplett `Resultat` nå:** `beregnBestillingsplan` gir `eksepsjoner: []`, `kritiskeDeler: []` og `kritisk: false` på hver `DelResultat`. Story 2.3 fyller dem inn med en egen funksjon i `eksepsjoner.ts`. `typer.ts` endres ikke.
- **2A – fasit 04 gjelder:** AK-et i epics.md sier at fremskynding over flere uker ikke gir nye planlagte ordremottak i ukene mellom (200-002 i 03, 300-028 i 04). For 300-028 har fasit 04 et planlagt ordremottak på 30 i uke 4. Det er et nytt behov etter at mottaket fra uke 5 er regnet med i uke 2, så det står i motstrid med ordlyden. Testen følger fasiten: planlagt ordremottak er 0 i uke 2–3 for 200-002 (03) og 300-028 (04), og alle tall ellers sammenlignes med Fasittabell. Motstriden står i en kommentar i testen og i Implementation Notes, merket «ordlyden må avklares med gruppen». Akseptkriteriene i epics.md endres ikke.
- **3A – harde fasittester for alle fem:** fasit 05 testes som 01–04. Testnavnet sier at fasit 05 ikke er kontrollert for hånd. Feiler den, meldes avviket til gruppen.
- **4A – branch:** implementeringen starter først når PR #43 er flettet og denne branchen er oppdatert fra `origin/main`. (#43 ble flettet 26.11 som `8c85e51`.)
- **Spec-en beholdes samlet** (over 1600 tokens). Den har ett mål, og lengden kommer av matrisen og beslutningene.

**Never:** ingen eksepsjoner eller kritiske deler (2.3), ingen tekst i `tekster/` (2.4), ingen endring i worker, `kjor.ts`, styring eller UI (2.5), ingen endring i `netting.ts`, `struktur.ts` eller `typer.ts`, ingen sammenligning av arkene Eksepsjoner, Utregning eller Kapasitet, ingen import eller oversettelse av `lag_testdata.py`.

## I/O & Edge-Case Matrix

| Scenario | Input | Forventet |
|---|---|---|
| Ferdigprodukt L = 0 (01) | 100-002, MPS | Bruttobehov = MPS, frigivelser = MPS |
| Bruttobehov ×antall (01) | 300-003 Hjul, antall 5 | 100, 125, 150, 100, 175, 150, 125, 200, 150, 100 |
| Forfalt på nivå 0 gir behov i uke 1 (02) | 100-001: frigivelse uke 1 = 45 (15 forfalt) | 200-001 bruttobehov uke 1 = 45 |
| Felles del, to overordnede (02) | 300-002: 4 per sete + 2 per rygg | Én `DelResultat`, `bruttobehovFra` med to poster per uke |
| Del på .1 og ..2 (04) | 300-023 | Beregnes på lavnivåkode 2, etter overordnet ..2-del, med behov fra begge |
| To forekomster, underdeler én gang (04) | 200-012, 200-013 | Underdelene får behov fra delen én gang |
| Fremskyndet over flere uker (2A) | 200-002 (03): mottak uke 4 → uke 2. 300-028 (04): mottak uke 5 → uke 2 | Planlagt ordremottak 0 i uke 2–3 for begge. 300-028 har 30 i uke 4 (nytt behov, fasit 04) |
| Alle tall (01–05) | testeksempel-0N.xlsx | Identisk med Fasittabell og Bestillingsforslag (kontrollert i planleggingen: 276/276 rader, 0 avvik) |

</frozen-after-approval>

## Code Map

- `src/domene/typer.ts` -- `Inndata`, `Struktur`/`StrukturDel` (`overordnede`, `beregningsrekkefolge`), `Utregning`, `DelResultat`, `Bestillingsforslag`, `Resultat`. Endres ikke.
- `src/domene/struktur.ts` -- `byggStruktur(rader)`. Slår alt sammen like varenumre og underdeler. Endres ikke.
- `src/domene/netting.ts` (fra PR #43, flettet i `origin/main` som `8c85e51cc0d68098627cc5472aa6db01215b1dda`, identisk med PR-committen `d5fd25e2d109b4fd8c3cd5939400d9d1171680bb`; finnes her etter oppdateringen fra `origin/main`) -- `beregnNetting(inndata, innstillinger?)`, `NettingInndata`, `NettingUke` (= `Utregning` uten `bruttobehovFra`/`prognostiserteBehov`, pluss `planlagtOrdremottak`, `forventetLagerbeholdning`), `Nettingsvar` (fem serier, `forfaltMengde`, `uker`). Frigivelsen i uke 1 har den forfalte mengden i seg.
- `src/domene/valider.ts:114` -- `valider(raa): Utfall<Inndata, Valideringsresultat>`. `src/excel/les.ts:50` -- `les(innhold, filnavn)`.
- `tests/validering/struktur.test.ts` -- mønsteret for å lese filer i `testdata/` med `les`.
- `tests/hjelpere/arkitekturregler.ts` -- `SHEETJS_UNNTAK` har allerede `tests/hjelpere/fasit-leser.ts`.
- `testdata/testeksempel-0N-fasit.xlsx` -- Fasittabell: rad 1 overskrift (`Varenummer`, `Rad`, `Uke 1..H`), seks rader per del og en tom rad mellom. Bestillingsforslag: `Varenummer, Beskrivelse, Frigivelsesuke, Mengde, Art, Forfalt mengde` (tom = 0).

## Tasks & Acceptance

**Execution:**
- [x] `.docs/ordbank.md` -- Fasittest (App og test) og Beregningsrekkefølge (Beregning), `updated` -- CLAUDE.md
- [x] `src/domene/beregn.ts` -- `beregnBestillingsplan` etter reglene over -- FR-5, FR-8, FR-17, FR-28, AD-6–AD-8
- [x] `tests/domene/beregn.test.ts` -- små strukturer skrevet inn i testen (uten SheetJS): matrisen, rekkefølge-feil som kaster, determinisme, inndataene endres ikke, lengde H, sortering ved lik uke, art, importtest (bare `./typer.ts` og `./netting.ts`) -- NFR-1
- [x] `tests/hjelpere/fasit-leser.ts` -- `lesFasit(nr)`: `{ horisont, deler: string[], tabell: Map<varenummer, Record<rad, number[]>>, bestillingsforslag }` -- AD-15
- [x] `tests/fasit/bestillingsplan.test.ts` -- `describe.each` for 01–05: les → valider (ok) → byggStruktur → beregn. Sammenlign delene, alle 6 × H tall per del og bestillingsforslagene. I tillegg Hjul (01) og spørsmål 2 -- SM-1, NFR-2

**Acceptance Criteria:**
- Gitt testeksempel 01–05, når `npm test` kjører, så er alle tall og bestillingsforslag identiske med fasiten, og testnavnet sier hvilket eksempel, hvilken del og hvilken rad som avviker.
- Gitt én regel ødelagt om gangen i `beregn.ts` (MPS for alle deler, antall ignorert, stykklisterekkefølge i stedet for beregningsrekkefølge, bare første overordnede del, forfalt ikke med, feil sortering, feil art), når testene kjører, så feiler minst én test hver gang (mutasjonskontroll for hånd, ført i Implementation Notes).

## Implementation Notes

- 26.11: Branchen ble fast-forwardet til `origin/main` (`8c85e51`) med `git merge --ff-only`. Spec-en lå ucommittet og ble ikke rørt. `src/domene/netting.ts` og `epic-2-context.md` finnes, og grensesnittet er brukt uendret.
- Implementert direkte i hovedsesjonen, uten underagent (all kontekst var alt lastet). `typer.ts`, `netting.ts`, `struktur.ts`, worker, styring og UI er ikke endret.
- **Endrede filer:** nye `src/domene/beregn.ts`, `tests/domene/beregn.test.ts` (29 tester), `tests/hjelpere/fasit-leser.ts` og `tests/fasit/bestillingsplan.test.ts` (33 tester). I `.docs/ordbank.md` er Beregningsrekkefølge og Fasittest lagt inn (`updated` var alt 2026-11-26).
- **Fasittestene:** for hvert av testeksempel 01–05 sammenlignes rekkefølgen på delene, alle 6 × H tall per del (276 serier i alt) og hele listen med bestillingsforslag (59, 49, 50, 73 og 21). Alle er identiske med fasitene, også fasit 05. Matriseradene fra 02 og 04 (300-002, 300-023, 200-012/200-013) har egne tester i tillegg.
- **Kravkonflikt for 300-028 (beslutning 2A), ORDLYDEN MÅ AVKLARES MED GRUPPEN:** AK-et i epics.md sier at mottak fremskyndet mer enn én uke ikke gir nye planlagte ordremottak i ukene mellom. Fasit 04 har 30 i uke 4 for 300-028: mottaket i uke 5 er regnet med i uke 2, beholdningen inn i uke 4 er 0, og bruttobehovet er 30. Testen følger fasiten (0 i uke 2–3, 30 i uke 4) og har en kommentar om konflikten. `epics.md` er ikke endret.
- **Mutasjonskontroll for hånd** (kjørt i scratchpad, ikke lagret; `beregn.ts` ble gjenopprettet etter hver runde): 1 MPS for alle deler (25 feilende tester), 2 antall ignorert (21), 3 stykklisterekkefølge i stedet for beregningsrekkefølge (27, og hele `beregn.test.ts` feiler), 4 bare første overordnede del (13), 5 forfalt mengde ikke med i behovet for delene under (13), 6 ingen sortering av forslagene (6), 7 feil art (6), 8 forfalt mengde på alle forslag (5), 9 mottak ikke filtrert på varenummer (15), 10 forslag med mengde 0 tatt med (6).
- `bruttobehovFra` har én post per overordnet del i rekkefølgen i `StrukturDel.overordnede`, også med frigivelse 0 (forklaringspanelet kan filtrere). Ferdigproduktets bruttobehov er en kopi av prognostiserte behov.
- **Verifisering:** `npm test` 1102/1102 (35 filer), `npm run lint` 0 funn, `tsc -b` uten feil, `npm run build` ok. Ingen e2e, fordi `ui/`, `worker/` og `excel/` ikke er endret (AD-18).

- **26.11, rettelser etter gjennomgang 1 (#1, #4–#9, godkjent av Carmen):**
  - `src/domene/beregn.ts`: `lagBestillingsforslag` sorterer eksplisitt på (frigivelsesuke, plass i stykklisten). Beregningsformlene, `beregnBestillingsplan`-signaturen og resultatene er uendret.
  - `tests/hjelpere/fasit-leser.ts`: skrevet om til rene funksjoner `tolkFasittabell` og `tolkBestillingsforslag`, som `lesFasit` bruker. Leseren avviser en rad som står to ganger, ukekolonner som ikke er Uke 1 … Uke H rett etter Rad, og feil antall uker. Ny `tests/fasit/fasit-leser.test.ts` (13 tester, uten SheetJS) tester avvisningene og at hver ekte fasit har ett forslag per frigivelse > 0.
  - `tests/fasit/bestillingsplan.test.ts`: `expect.soft` i sammenligningen av alle tall. Testene for 300-002, 300-023 og 200-012/200-013 bruker faste tall fra fasitene, ikke motorens egne tall. KRAVKONFLIKT-kommentaren for 300-028 nevner begge mottakene.
  - `tests/domene/beregn.test.ts`: håndregnede tall i stedet for relasjoner i testene for ..2, felles del, rekkefølge og to forekomster. Ny describe «håndregnet eksempel med tre nivåer» (7 tester, beregn.test.ts har nå 36) med alle seks rader og forfalt mengde for FP, A, B og C, Utregning for C, rekkefølgen og hele listen med bestillingsforslag. Tallene er regnet for hånd og kontrollert med et eget Python-skript i scratchpad, som ikke bruker appens kode.
  - **Mutasjonskontroll av den håndregnede testen alene** (kjørt med `-t håndregnet`, filene gjenopprettet etter hver runde): 12 mutasjoner i `beregn.ts` og 4 i `netting.ts` (forfalt ikke i uke 1, SS ignorert, beholdning uten fremskyndede mottak som ikke er kommet, grensen t − L). 15 av 16 får testen til å feile. B6 (fjerne den nye andre sorteringsnøkkelen) gir samme resultat, fordi `deler` alt står i stykklisterekkefølge og sorteringen er stabil. Den er altså ekvivalent og viser at #9 ikke endrer resultatene. B12 (`bruttobehovFra` uten poster med frigivelse 0) ble fanget først etter at en sjekk av uke 5 ble lagt til.
  - `.docs/ordbank.md`: «Fasittest» sier at eksepsjonene sammenlignes fra Story 2.3.
  - #21 er ikke lagt i `deferred-work.md`, fordi Story 2.3 og Epic 5 alt sammenligner arkene Eksepsjoner og Kapasitet.
  - **Verifisering:** `npm test` 1122/1122 (36 filer), `oxlint --deny-warnings` 0 funn, `tsc -b` uten feil, `npm run build` ok.

## Spec Change Log

## Review Triage Log

Gjennomgang 1 (26.11, Blind Hunter = BH, Edge Case Hunter = ECH, Verification Gap = VG, med Carmens prioriteringer). Ingen fant reelle feil i `beregn.ts`. VG kjørte 16 mutasjoner på en kopi, og alle ble fanget. Carmen godkjente 26.11 å rette #1 og #4–#9. Alt er rettet uten å endre beregningsformlene eller signaturen (se Implementation Notes).

| # | Funn | Kilde | Type | Vurdering | Bevis | Rute |
|---|---|---|---|---|---|---|
| 1 | Enkelttestene for 300-023 og 300-002 og de fleste enhetstestene regner forventningen fra motorens egne tall (relasjonelle). En feil i netting eller struktur fanges bare av fasittestene | BH, ECH | testhull | medium | `bestillingsplan.test.ts` (300-023: `forventet` fra `frigivelser()`, 300-002: `sete[i]*4`). `beregn.test.ts` felles del: `a.map(...)`. Fasitsammenligningen er uavhengig | rettet: faste fasittall i testene for 300-002, 300-023 og 200-012/200-013. Enhetstestene for ..2, felles del, rekkefølge og to forekomster har håndregnede tall. Ny håndregnet tre-nivå-test (16 mutasjoner: 16 fanget, B6 gir samme resultat) |
| 2 | En forfalt frigivelse som gjør delen under forfalt også, og ledetid ≥ H, er ikke enhetstestet | BH, ECH, VG | testhull | low | Enhetstesten gir B lager 1000. Fasit 02 dekker kaskaden 100-001 → 200-001 (forfalt 20), så tilfellet er dekket i fasittesten | rettet: A er forfalt (15) og gjør C forfalt (35) i den håndregnede testen |
| 3 | Felles del med planlagte mottak, og ferdigproduktet med lager, SS og mottak, uten absolutte tall i enhetstestene | BH | testhull | low | Ferdigproduktet med lager/SS (02) og mottak (04 100-003) er dekket av fasittestene. Felles del med mottak finnes ikke i noen fasit | rettet: felles del C med mottak og ferdigproduktet med lager, SS og mottak i den håndregnede testen |
| 4 | Fasitleseren overskriver en (varenummer, rad) som står to ganger uten å si fra | BH, ECH, VG | testhull | low | `fasit-leser.ts` `del[radnavn] = tall`. Ingen fasit i dag har det (6 × antall deler stemmer) | rettet: `tolkFasittabell` kaster ved duplikat, testet i `tests/fasit/fasit-leser.test.ts` |
| 5 | Fasitleseren kontrollerer ikke at ukekolonnene er `Uke 1..H` rett etter kolonne B | BH, ECH, VG | testhull | low | `uker` filtreres, men `slice(2, 2 + H)` forutsetter rekkefølgen | rettet: kontrollen er lagt inn og testet (hull og byttede kolonner) |
| 6 | AK-et sier at testen viser eksempel, del og rad som avviker, men løkka stopper ved første avvik | ECH | testhull | low | Meldingen har eksempel, del og rad, men bare første avvik vises | rettet: `expect.soft`. Med `× antall` fjernet ble 79 avvik meldt i én kjøring |
| 7 | KRAVKONFLIKT-kommentaren nevner bare mottaket i uke 5, mens testen sjekker `[3, 5]` | BH | dokumentasjon | low | `bestillingsplan.test.ts`, kommentaren over 200-002-testen | rettet: kommentaren nevner begge mottakene (uke 3 og 5) |
| 8 | Ordbankens «Fasittest» sier at eksepsjonene sammenlignes, og det gjør de først fra Story 2.3 | BH | dokumentasjon | low | `.docs/ordbank.md`. AD-16 beskriver fasittesten for hele kjeden | rettet: «og fra Story 2.3 også eksepsjonene» |
| 9 | Sorteringen av forslagene har stykklisterekkefølgen bare implisitt (stabil sortering av `deler`) | BH | forbedring | low | Riktig i dag. Fanget av enhetstesten FP, S, K2, K1 og av fasit 01–04 (VG-mutasjonen) | rettet: sorteres på (frigivelsesuke, plass i stykklisten). Resultatene er uendret, og alle fasittestene er grønne |
| 10 | Fasitleseren gir TypeError ved tomt ark, og trimmer ikke beskrivelse | ECH, BH | forbedring | low | Begge gir en synlig feil, ikke en falsk grønn test | avvist |
| 11 | MPS kortere enn H gir NaN | BH, ECH | – | false | `valider.ts:130-131` lager alltid `prognostiserteBehov` med lengde `horisont` | avvist |
| 12 | En del uten overordnet del (foreldreløs eller ny rot) får hele MPS | ECH | – | false | Valideringen krever at første rad er 0, bare én 0, og at ..2 står under .1 (V-S05–V-S07). `byggStruktur` får bare kontrollerte rader | avvist |
| 13 | Varenummer i mottak med mellomrom eller annen form blir ikke filtrert | ECH | – | false | `valider.ts:135` og `:308-309` bruker `varenummerTekst` både for `Inndata` og V-P01, likt stykklisten | avvist |
| 14 | Samme underdel to ganger under samme del gir to poster i `bruttobehovFra` | BH | – | false | Probe på `byggStruktur`: C (2) og C (3) under A gir `[{"varenummer":"A","antall":5}]` | avvist |
| 15 | Mottak for ukjent del, uke utenfor 1..H, horisont 12 | BH | – | false | V-P01–V-P03 stopper mottakene. Testeksempel 04 har H = 12 | avvist |
| 16 | Fasitens horisont sammenlignes ikke direkte med `inndata.horisont` | BH, VG | – | false | Lengdetesten og `toEqual` per serie feiler ved ulik H | avvist |
| 17 | Uavgjort i sorteringen mellom en felles del og en senere del er ikke testet | ECH | – | false | Fasit 04 uke 1: 300-022 (felles, første forekomst under Sete) står før 200-011. Dekket av forslagstesten | avvist |
| 18 | Duplikat i `beregningsrekkefolge` blir ikke stoppet | BH | forbedring | low | `byggStruktur` kan ikke lage det. En vakt gir bare mer kode | avvist |
| 19 | `frigivelserFor` slås opp per uke og overordnet del | BH | forbedring | low | Map-oppslag, H ≤ 12. Ytelsen måles i Story 2.8 | avvist |
| 20 | `beregnBestillingsplan` har ingen innstillinger | BH | senere story | low | AD-7: Kanseller mottak kjører nettingen per del i `eksepsjoner.ts`, og kapasiteten har sin egen vei | avvist (2.3 og Epic 5) |
| 21 | Arkene Utregning, Eksepsjoner og Kapasitet sammenlignes ikke | ECH, VG, BH | senere story | – | Eksepsjoner: AK i Story 2.3 (epics.md:944). Kapasitet: AK i Epic 5 (epics.md:1600, 1625). Utregning er tekst steg for steg, og ordlyd sammenlignes ikke (AD-16). Tallene i den er radene i Fasittabell, og nettingfeltene er testet i Story 2.1 | avvist (alt planlagt, ikke lagt i deferred-work.md) |
| 22 | Fasitene er laget med `lag_testdata.py` av gruppen, og fasit 05 er ikke kontrollert for hånd | BH, VG | begrensning | – | README. 01–04 er kontrollert for hånd. Gjelder ikke koden | ingen kodeendring (står i spec og testnavn) |
| 23 | Kravkonflikten for 300-028 må inn i `issues.md` | BH, VG | prosess | – | Gjøres i sesjonsloggen ved slutten av økten | sesjonslogg |

## Design Notes

Kontroll i planleggingen (26.11, skript i scratchpad, ikke i repoet): reglene over, med strukturen bygd som i `byggStruktur` og nettingen fra spec 2.1, ble kjørt fra inndatafilene. Det ga 0 avvik på 276 rader (46 deler × 6) i fasit 01–05, delene stod i samme rekkefølge som i Fasittabell, og bestillingsforslagene var identiske (59, 49, 50, 73 og 21 forslag).

Grensesnittet kontrollert på nytt 26.11 etter flettingen av #43: `netting.ts`, `netting.test.ts` og `epic-2-context.md` er uendret mellom PR-committen og `origin/main`, og `typer.ts` er ikke endret. Signaturen, `NettingInndata` (lager, SS, ledetid, bruttobehov, mottak som `PlanlagtMottak[]`), `NettingUke` og `Nettingsvar` passer med planen uten endring.

```ts
for (const vnr of struktur.beregningsrekkefolge) {
  const del = delMap.get(vnr)!
  const bb = del.overordnede.length === 0 ? inndata.prognostiserteBehov
    : sumPerUke(del.overordnede.map(p => frigivelser(p.varenummer).map(f => f * p.antall)))
  svar.set(vnr, beregnNetting({ ...lagerSsLedetid(del), bruttobehov: bb, planlagteMottak: mottakFor(vnr) }))
}
```

## Verification

**Commands:**
- `git merge --ff-only origin/main` (før implementeringen, 4A) -- forventet: `src/domene/netting.ts` og `epic-2-context.md` finnes
- `npm ci` -- forventet: installert (worktreen har ikke `node_modules`)
- `npm test` -- forventet: alle grønne, også arkitekturtesten og de fem fasittestene
- `npm run lint` og `npm run build` -- forventet: ingen feil eller advarsler
