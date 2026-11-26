---
title: 'Story 2.1: Netting for én del'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: 'bc80ff7d6ddcdbb777cb5ea383608ede442de017'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Det finnes ingen MRP-beregning ennå. Story 2.2 (beregn), 2.3 (eksepsjoner og Kanseller mottak), Epic 5 (kapasitet) og Epic 6 (fast partistørrelse) trenger samme regler for én del, uke for uke, og AD-7 sier at reglene bare skal finnes ett sted.

**Approach:** Ny ren funksjon `beregnNetting(inndata, innstillinger = STANDARDINNSTILLINGER)` i `src/domene/netting.ts`. Den tar lagerbeholdning, SS, ledetid, bruttobehov (lengde H) og planlagte mottak som enkeltlinjer, og gir de fem beregnede seriene, forfalt mengde og ett uketrinn per uke med tallene `Utregning` trenger (unntatt `bruttobehovFra` og `prognostiserteBehov`, som 2.2 legger til).

## Boundaries & Constraints

**Always:**
- **Regler per uke t = 1..H** (FR-6–FR-8, kontrollert mot `mrp_del` i `lag_testdata.py` og fasit 01/04):
  1. `beholdningForrigeUke` = lagerbeholdning for t = 1, ellers forventet(t−1) + `fremskyndetIkkeKommet`(t−1).
  2. `planlagteMottak`(t) = summen av linjene i uke t som ikke alt er fremskyndet.
  3. `disponibelForFremskynding` = beholdning + planlagteMottak(t) − bruttobehov(t). nettobehov = maks(0, SS − disponibel).
  4. Fremskynding (når innstillingen er på): så lenge nettobehov > 0, ta første senere uke u > t som har mottak igjen, flytt **alle linjene i uke u** til t, legg summen til disponibel og regn nettobehov på nytt. Hver flyttet linje blir én post `{ mottaksuke, antall, excelRad }` i uke t. Gir `disponibelEtterFremskynding`.
  5. Planlagt ordremottak = nettobehov (lot-for-lot).
  6. `fremskyndetIkkeKommet`(t) = summen av alle fremskyndede linjer med mottaksuke > t. Forventet lagerbeholdning = disponibelEtter + ordremottak − fremskyndetIkkeKommet.
  7. Frigivelse i uke t − L. Er t − L < 1: legg i uke 1, og `forfaltMengde`(t) = ordremottaket. Ellers 0. L = 0 gir samme uke.
- **Raden Planlagte mottak** (visning) er summen per uke av alle linjene, også de som er fremskyndet. Linjer med samme uke legges sammen (AD-4).
- Svaret har `forfaltMengde` totalt (summen av ukene, alltid ≤ frigivelse i uke 1). Alle serier har lengde H. Ingen uke 0.
- Ren og deterministisk: endrer ikke inndataene, importerer bare `./typer.ts`, ingen unntak for gyldige data.
- Innstillingsobjektet er et eget parameter med standardverdier. Nye innstillinger skal kunne legges til uten å endre signaturen (AD-7).
- Nye fagord (Netting, Nettinginnstillinger) legges inn i `.docs/ordbank.md` først.

**Beslutninger (Carmen, 26.11.2026):**
- **Typene står i `netting.ts`** (`NettingInndata`, `Nettinginnstillinger`, `NettingUke`, `Nettingsvar`) så lenge bare `src/domene/` bruker dem. `NettingUke` bygger på den delte `Utregning`. Trenger kode utenfor `domene/` (worker, app, ui, tekster) dem som delt kontrakt, følges AD-3: plasseringen avklares med Idun før den storyen implementeres.
- **Bare `fremskynding` (standard `true`) bygges nå.** Det som trengs til produksjonskapasitet (FR-31) og fast partistørrelse (FR-25), bygges ikke. Utvidelsen gjøres med nye valgfrie felt i `Nettinginnstillinger`, der standardverdien gir dagens oppførsel, uten å endre signaturen.
- **Spec-en beholdes hel** (over 1600 tokens). Den har ett mål, og lengden kommer av matrisen med testtilfeller.

**Never:** ingen innstillinger for produksjonskapasitet eller fast partistørrelse, ingen nivå-for-nivå-beregning eller bruttobehov fra overordnede deler (2.2), ingen eksepsjoner eller kritiske deler (2.3), ingen tekst i `tekster/` (2.4), ingen worker (2.5), ingen fasittest som leser Excel (2.2), ingen bruk av `Struktur` eller varenummer i nettingen (den som kaller, filtrerer mottakene), ingen import eller oversettelse av `lag_testdata.py`.

## I/O & Edge-Case Matrix

| Scenario | Inndata (lager, SS, L, bruttobehov, mottak) | Forventet |
|---|---|---|
| FR-6-eksempelet | 20, 0, 1, [0,0,60,0], 100 i uke 4 | nettobehov 0 overalt. Forventet [20,20,−40,60]. Vist mottak [0,0,0,100]. Uke 3: før −40, etter 60, fremskyndet {4,100}. Uke 4: beholdning 60, mottak 0 |
| 300-003 Hjul (fasit 01) | 80, 30, 1, [100,125,150,100,175,150,125,200,150,100], ingen | Uke 1: disponibel −20, nettobehov 50. Frigivelser [175,150,100,175,150,125,200,150,100,0]. forfaltMengde 50. Forventet 30 overalt |
| 300-005 Gassfjær | 75, 10, 2, [20,25,30,20,35,30,25,40,30,20], 100 i uke 4 | Forventet [55,30,0,80,45,15,10,10,10,10]. Nettobehov [0,0,0,0,0,0,20,40,30,20]. Frigivelser [0,0,0,0,20,40,30,20,0,0] |
| 300-004 Armlene | 50, 20, 1, [40,50,…] | Uke 1: disponibel 10, nettobehov 10, forfalt 10, frigivelse uke 1 = 60 |
| 300-007 Skruesett | 150, 40, 2, [80,100,120,…], 120 i uke 2 | Mottaket blir ikke fremskyndet. Nettobehov fra uke 3 (70). Frigivelse 70 i uke 1 er ikke forfalt |
| Ferdigprodukt, L = 0 | 0, 0, 0, MPS | Frigivelse = ordremottak = MPS i samme uke |
| To mottak fremskyndes til samme uke (300-028, fasit 04) | 10, 0, 1, [10,25,0,30,35,0,20,25,30,40,30,0], 10 i uke 3 og 15 i uke 5 | Uke 2: to poster, før −25. Forventet [0,−25,−15,−15,0,…]. Ordremottak 30 i uke 4 |
| Mottaket er for lite, og frigivelsen er forfalt (300-026) | 0, 0, 1, [40,100,0,120,140,0,80,100,120,160,120,0], 30 i uke 3 | Uke 1: før −40, etter −10, nettobehov 10, forfalt 10. Forventet [−30,−30,0,…]. Frigivelser [110,0,120,140,0,80,100,120,160,120,0,0]. Vist mottak 30 i uke 3, men uke 3 regner 0 mottak |
| Forfalt senere enn uke 1 (300-022, fasit 04) | 1000, 0, 7, [200,70,80,140,170,220,200,60,0,0,0,0], ingen | Nettobehov 80 i uke 7 (7 − 7 = 0, forfalt) og 60 i uke 8 (ikke forfalt). Frigivelser [140,0,…]. forfaltMengde 80 |
| Flere uker forfalt | L = 3, nettobehov i uke 1, 2, 3 og 4 | Ukene 1–3 er forfalte. forfaltMengde = summen av dem. Uke 1 har i tillegg den vanlige frigivelsen for uke 4 |
| SS holdes i beregningen | alle tilfellene | `disponibelEtterFremskynding + nettobehov ≥ SS` hver uke. Forventet ≥ SS, unntatt når `fremskyndetIkkeKommet > 0` (FR-7) |
| Ingen dobbel telling | alle tilfellene med mottak | lager + Σ mottak + Σ ordremottak − Σ bruttobehov = forventet(H) + fremskyndetIkkeKommet(H) |
| Mottak i uke H | behov i uke 1, mottak i uke H | Hele mottaket fremskyndes til uke 1 |
| To linjer i samme uke | 20 + 30 i uke 4 | Vist 50 i uke 4. Fremskyndes sammen, som to poster |
| Fremskynding av | `fremskynding: false` | Ingen flytting. Mottaket regnes med i sin egen uke, og nettobehovet blir ordremottak |

</frozen-after-approval>

## Code Map

- `src/domene/typer.ts` -- `Utregning` (feltene uketrinnet skal ha), `PlanlagtMottak` (enkeltlinje med `excelRad`), `DelResultat` (2.2 fyller den fra svaret). Endres ikke.
- `src/domene/struktur.ts` -- `byggStruktur`. `StrukturDel` har lagerbeholdning, SS og ledetid. Brukes av 2.2, ikke av nettingen.
- `testdata/lag_testdata.py:387` `mrp_del` -- referansen. Leses som spesifikasjon, flytter hele uken, `frigivelse[0] += nb` ved forfalt.
- `testdata/testeksempel-01-fasit.xlsx` (Fasittabell, Utregning) og `-04-fasit.xlsx` -- tallene i matrisen er skrevet av herfra.
- `tests/domene/struktur.test.ts` -- mønster: data skrevet inn i testen, ingen SheetJS (AD-15).
- `tests/arkitektur.test.ts` -- fanger ulovlige importer i `src/domene/`. Ingen endring.
- `.docs/ordbank.md` -- tabellen «Beregning (per del og uke)».

## Tasks & Acceptance

**Execution:**
- [x] `.docs/ordbank.md` -- legg inn Netting og Nettinginnstillinger i «Beregning (per del og uke)», og oppdater `updated` -- regelen i CLAUDE.md
- [x] `src/domene/netting.ts` -- typer, `STANDARDINNSTILLINGER` og `beregnNetting` etter reglene over, med kommentarer som viser til FR-6–FR-8 -- AD-7
- [x] `tests/domene/netting.test.ts` -- én test per rad i matrisen. SS- og balansekontrollene går som en løkke over alle tilfellene. I tillegg: inndataene endres ikke, samme inndata gir samme svar, alle serier har lengde H, og ingen planlagt ordremottak i ukene mellom ved fremskynding over flere uker -- NFR-1, NFR-2

**Acceptance Criteria:**
- Gitt at `netting.ts` importerer noe annet enn `./typer.ts`, når `npm test` kjører, så feiler arkitekturtesten.
- Gitt standardinnstillingene, når en test kaller `beregnNetting` med tall og uten Excel, lagring eller UI, så gir den de seks radene (bruttobehov uendret) og H uketrinn.
- Gitt én endret regel (for eksempel at frigivelsen ikke legges i uke 1 ved forfalt), når testene kjører, så feiler minst én test.

## Implementation Notes

- 26.11: Implementert direkte i hovedsesjonen, uten underagent. Signaturen følger Design Notes. I tillegg eksporteres `FremskyndetMottak` (= ett element i `Utregning['fremskyndedeMottak']`). `STANDARDINNSTILLINGER` er frosset.
- Mottakslinjer med uke utenfor 1..H eller med uke som ikke er heltall, hoppes over (valideringen stopper dem før nettingen).
- Endrede filer: `src/domene/netting.ts`, `tests/domene/netting.test.ts` (79 tester) og `.docs/ordbank.md` (Netting, Nettinginnstillinger).
- Mutasjonskontroll (utført for hånd, ikke lagret): seks regler ble ødelagt én om gangen (forfalt ikke i uke 1, grensen t − L, beholdning uten mottak som ikke er kommet, dobbel telling, SS ignorert, forventet uten fratrekk). Hver gang feilet 9–13 tester.
- `npm test` 1029/1029, `npm run lint` 0 funn, `tsc -b` uten feil, `npm run build` ok.
- 26.11 etter gjennomgang 1: `beregnNetting` slår nå sammen innstillingene felt for felt (`innstillinger.fremskynding ?? STANDARDINNSTILLINGER.fremskynding`), så `{ fremskynding: undefined }` gir standardverdien. Bare dette er endret i beregningen. Formlene, typene og signaturen mot 2.2 er uendret.
- Nye regresjonstester: fremskyndingen stopper når nettobehovet er dekket (nytt tilfelle «første senere mottak er nok», SS 5), uten fremskynding med SS > 0, innstillingene (uten, `{}`, `STANDARDINNSTILLINGER`, `undefined`, frosset), importtest for AD-7, og at svaret ikke deler objekter med inndataene. Hver av rettelse 1–3 ble lagt inn igjen som feil én om gangen, og hver gang feilet én test.
- Etter rettelsene: `npm test` 1040/1040 (netting 90), `npm run lint` 0 funn, `tsc -b` uten feil, `npm run build` ok. Ikke committet (Carmen vil se resultatet først).

## Review Triage Log

Gjennomgang 1 (26.11, Blind Hunter, Edge Case Hunter og Verification Gap). Carmen godkjente å rette punkt 1–7. Alle er rettet (se Implementation Notes).

| # | Funn | Kilde | Vurdering | Bevis | Rute |
|---|---|---|---|---|---|
| 1 | Når fremskyndingen ikke stopper ved dekket nettobehov, feiler ingen test | BH | medium | Mutasjonen `disponibelForFremskynding < SS` i stedet for `nettobehov > 0`: 79/79 grønne. Ingen test har to senere mottaksuker der den første er nok | rettet: ny test «fremskyndingen stopper …» |
| 2 | `{ fremskynding: undefined }` slår fremskyndingen av | BH, VG | medium | Spredningen gir `{ fremskynding: undefined }` (sjekket i Node). `Partial` tillater det, og `exactOptionalPropertyTypes` er ikke på. 2.3 kan videresende et valgfritt felt | rettet: `??` per felt og test for `undefined` |
| 3 | Arkitekturtesten håndhever ikke «bare `./typer.ts`», som AC 1 sier | ECH | medium | `arkitekturregler.ts:25` lar domene/ importere alt i domene/. AC-en er ikke oppfylt | rettet: importtest i `netting.test.ts` |
| 4 | Testen «tomme innstillinger» kan ikke feile | BH | low | `kjor` sender også `{}` via standardparameteren | rettet: egen describe for innstillingene |
| 5 | Kommentaren øverst sier «kontrollert mot fasit 01–05», men testene bruker 01 og 04 | BH | low | Kontrollen av 01–05 ble gjort i scratchpad i planleggingen | rettet: kommentaren øverst presisert |
| 6 | Testen «deler ikke lister» tester ikke det navnet sier | BH | low | Den viser bare at det ikke finnes noen buffer mellom kall | rettet: nytt navn og ny test for delte objekter |
| 7 | Ugyldig ledetid, bruttobehov, lager eller SS (NaN, desimal, negativ) gir stille feil | BH, ECH | low | Valideringen (FR-3, `valider-stykkliste.ts`) stopper det for Inndata, og bruttobehov regnes fra heltall. Ingen vei inn i dag | rettet: forutsetningen dokumentert i `NettingInndata` |
| 8 | Mottak utenfor 1..H forsvinner uten spor | BH | false | `valider.ts:312-314` gir `MOTTAK_UKE_UTENFOR_HORISONT`, og ingen beregning skjer da | avvist |
| 9 | Antall ≤ 0 eller NaN i mottak | BH, ECH | false | `valider.ts:317-318` krever heltall ≥ 1 | avvist |
| 10 | Fremskynding utløst av SS alene er ikke testet | BH | false | 300-005 Gassfjær: disponibel 0 ≥ 0, men under SS 10, fremskyndes (testet) | avvist (valgfritt: `fremskynding: false` med SS > 0) |
| 11 | Objekter deles mellom ukene i `fremskyndedeMottak` | BH | false | Hver post står i bare én ukes liste. `alleFremskyndede` returneres ikke. Objektene lages nye fra inndataene | avvist |
| 12 | `forfaltMengde` betyr både per uke og totalt | BH | false | Speiler de delte typene: `Utregning.forfaltMengde` (uke) og `DelResultat.forfaltMengde` (total) | avvist |
| 13 | Ordbanken mangler «Forfalt mengde», og Netting-raden nevner en filsti | BH | low | Begrepet kom med typene i Story 1.2, ikke med denne storyen. Filstien er ufarlig | avvist (kan tas i egen ordbank-runde) |
| 14 | Uke som ikke er heltall, er ikke testet | VG | low | Valideringen stopper den (`MOTTAK_UKE_IKKE_HELTALL`) | avvist (valideringen dekker det. Carmen 26.11: ingen utsatte punkter som valideringen alt dekker, så det står ikke i deferred-work.md) |

## Design Notes

Signaturen (navnene kan justeres i implementeringen):

```ts
export type NettingInndata = { lagerbeholdning: number; sikkerhetslager: number; ledetid: number
  bruttobehov: readonly number[]; planlagteMottak: readonly PlanlagtMottak[] }
export type NettingUke = Omit<Utregning, 'bruttobehovFra' | 'prognostiserteBehov'>
  & { planlagtOrdremottak: number; forventetLagerbeholdning: number }
export type Nettingsvar = { planlagteMottak: number[]; forventetLagerbeholdning: number[]; nettobehov: number[]
  planlagteOrdremottak: number[]; planlagteOrdrefrigivelser: number[]; forfaltMengde: number; uker: NettingUke[] }
export type Nettinginnstillinger = { fremskynding: boolean }  // senere: nye valgfrie felt
export const STANDARDINNSTILLINGER: Nettinginnstillinger = { fremskynding: true }
export function beregnNetting(inndata: NettingInndata, innstillinger?: Partial<Nettinginnstillinger>): Nettingsvar
```

**Kontroll før implementering (26.11.2026):** reglene i denne spec-en ble kjørt i et eget skript i scratchpad, ikke i repoet. Skriptet tok bruttobehovet fra Fasittabell og lager, SS, L og mottakslinjene fra inndatafilene. Alle 46 delene i testeksempel 01–05 ga 0 avvik på radene Planlagte mottak, Forventet lagerbeholdning, Nettobehov, Planlagte ordremottak og Planlagte ordrefrigivelser. Lagerbalansen og SS-kontrollene i matrisen holdt for alle delene. Disponibel før og etter fremskynding stemmer med fasitmeldingene (300-026: −40 og −10, 300-028: −25, 300-005: 0). Arket Utregning bruker samme beholdning forrige uke (300-005 uke 4: 0 + 100).

Hele uken flyttes samlet, fordi mottak i samme uke legges sammen i beregningen (AD-4, `mrp_del`). Hver linje står likevel som egen post, så 2.3 selv kan avgjøre om to linjer i samme uke gir én eller to «Mottak forsinket».

## Verification

**Commands:**
- `npm ci` (worktreen har ikke `node_modules`) -- forventet: installert
- `npm test` -- forventet: alle grønne, også arkitekturtesten
- `npm run lint` og `npm run build` -- forventet: ingen feil eller advarsler
