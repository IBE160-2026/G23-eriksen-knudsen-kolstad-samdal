# Testdata: full dekning og testeksempel 03

## 2026-11-05 kl. 12:04 — Sebastian

### Oppgave
Sebastian har kontrollert fasit 02. Han ba om at testdataene skal dekke alle tilfellene, slik at det går an å kontrollere at alt fungerer. Han ba også om testeksempel 03 med endret MPS for å teste før/etter-sammenligningen (FR-20). Fortsetter [993](993-2026-11-05-11-22-43-testeksempel-02-og-underdelskontroll.md).

### Plan
- Gå gjennom de testbare konsekvensene i PRD FR-1–FR-29 og finne tilfellene som ikke er dekket av testeksempel 01 og 02.
- **Testeksempel 03:** testeksempel 02 med MPS økt i én uke. Jeg prøvde flere endringer med skript og valgte uke 2: 30 → 45. Den gir endret mengde, nytt forslag, ny eksepsjon og borte eksepsjon. Sammenligningen motsatt vei (03 → 02) gir et fjernet forslag.
- **Testeksempel 04:** grensetilfellene som manglet. Tallene ble justert med skript til hver del ga nøyaktig de eksepsjonene den skal teste.
- **Valideringstilfeller:** én fil per regel i FR-1–FR-4.
- **Selvkontroll** i skriptet, og fast tid i filene, så en ny kjøring ikke gir endringer i git.
- Sjekke alle filene i ekte Excel.

### Resultat
- **Fasit 02:** status satt til kontrollert (Carmen 2026-10-24, Sebastian 2026-11-05) i `STATUS_02` og i `testdata/README.md`.
- **Testeksempel 03** (`testeksempel-03.xlsx` og `-fasit.xlsx`): testeksempel 02 med MPS i uke 2 økt fra 30 til 45. Fasiten har arket **Sammenligning** for begge retninger.
  - 02 → 03:
    - 7 forslag med endret mengde og 1 nytt (300-002 uke 1)
    - ny eksepsjon: 200-002 Mottak forsinket uke 2
    - ny eksepsjon: 300-004 Bruk av sikkerhetslager uke 1
    - borte: 200-002 Mottak forsinket uke 3
  - 03 → 02: det motsatte, med 1 fjernet forslag.
  - Ingen endring i MPS i én uke gir et forslag som flytter uke. Det er sjekket med skript for alle uker og endringer fra −40 til +60.
- **Testeksempel 04** (Kontorstol Ergo, 14 deler, 3 nivåer, H = 12, MPS 0 i uke 4 og 7) dekker:
  - FR-9 langs den lengste av to stier: 1 + 4 + 7 = 12 = H, uten at noen enkelt ledetid er ≥ H (300-022)
  - H − 1 uten eksepsjon (300-021)
  - Bestilling forsinket på nivå ..2 med to deler over i meldingen
  - felles del på både .1 og ..2 (300-023)
  - del med underdeler to ganger: like i ulik rekkefølge (200-012), og bare første gang (200-013)
  - for lite mottak, med Mottak forsinket og Bestilling forsinket i samme celle (300-026)
  - to mottak i samme uke legges sammen (300-027)
  - to mottak fremskyndet til samme uke (300-028)
  - mottak på ferdigproduktet
- **Alle fasitene** har fått arket **Bestillingsforslag** (FR-17): varenummer, uke, mengde, innkjøp eller produksjonsordre, og forfalt mengde.
- **`testdata/validering/`:** 47 filer (48 med V-F06, se under) og en README med forventet resultat:
  - V-S01–S29 (Stykkliste), V-M01–M05 (MPS), V-P01–P04 (Planlagte mottak)
  - V-F01–F03 (struktur), V-F04 (CSV), V-F05 (tre feil på tre ark)
  - V-G01–G04 (gyldige grenseverdier)
  - Hver fil bygger på testeksempel 02 og har nøyaktig én feil, unntatt F05 og G-filene. Antagelsene står i README.
- **`lag_testdata.py`:**
  - Ny `kontroller()` stopper `--alle` hvis eksepsjonene ikke er nøyaktig `FORVENTET_01–04`. Den sjekker også bruttobehovet for flernivå-tilfellene i 04, og at samme kjøring to ganger gir ingen endringer.
  - Nye funksjoner: `bestillingsforslag()`, `sammenligning()` og `kjoring()`.
  - Ny `lagre()` skriver med fast tid i dokumentegenskaper og zip, og bare når innholdet er endret. Sjekket: to kjøringer etter hverandre gir like md5-summer for alle filene.
- **Kontroll-kolonnen:** «Har underkomponenter, men kjøpes inn» slo til feilaktig ved ugyldig nivå (V-S04). Den sjekker nå bare gyldige nivåer.
- **Excel 16 via COM:**
  - Alle filene åpnes.
  - Kontroll-kolonnen er tom for testeksempel 01–04, malen og G-filene.
  - For V-S-filene viser Kontroll én melding der malen sjekker regelen. Tall, ledetid og lager fylt andre gang og «del under seg selv» fanges ikke av Kontroll, bare av appen.
- **Fasit 01 og 02:** Fasittabell, Eksepsjoner, Utregning og Materiell er uendret mot HEAD. Bare arket Bestillingsforslag og statusen for 02 er nye.
- **PRD:**
  - FR-20 viser til testeksempel 03 og har regelen for hvordan forslag og eksepsjoner identifiseres `[ASSUMPTION]`.
  - FR-3 viser til `testdata/validering/`.
  - §9 spm. 2 og 11 er løst.
- **Ordbank:** ny «Valideringstilfelle», `updated` 2026-11-05.
- **README:** `testdata/README.md` har nye seksjoner for 03 og 04 og en dekningstabell (krav → tilfelle → hvor).
- **Etter Sebastians svar:**
  - Fasit 03 og 04 er kontrollert for hånd. Status er satt i `STATUS_03`, `STATUS_04` og README.
  - Regelen for sammenligningen er bestemt (FR-20, ikke lenger `[ASSUMPTION]`).
  - Ingen egen feil for manglende Ferdigvare er godkjent.
  - **Valg B for strukturfeil:** verdier som ikke avhenger av arket eller kolonnen som mangler, kontrolleres likevel, og kontroller som avhenger av det, hoppes over. Regelen er skrevet inn i PRD FR-2 og i `validering/README.md`.
  - Ny V-F06: overskriften «Ledetid (uker)» mangler, og et mottak har antall 0. Skal gi 2 feil.
- Committet i 15126fa og pushet til `Sebastian/Branch`. Commit-meldingen sier «49 valideringstilfeller», men det riktige tallet er 48 filer pluss README.

### Åpne punkter
- Gi Carmen beskjed om at fasitfila for 02 har nytt navn og at testdataene nå lages av `lag_testdata.py`.
- Valgfritt: Kontroll-kolonnen kan også sjekke heltall, felt fylt ut andre gang og «del under seg selv», som i dag bare appen fanger.
- Fast partistørrelse (FR-24–26) har ingen testdata ennå (planlagt utvidelse).
