# Oppdatering, kvalitetssikring og Git-rydding

## 2026-11-09 kl. 21:35 — Carmen Kolstad

### Oppgave
Carmen ville gjøre Carmen/Branch klar etter at PRD-en ble `final`:
- få main inn i branchen
- sjekke hvordan PRD-kravene står i forhold til koden og testene
- kvalitetssikre kapasiteten i testeksempel 05
- sjekke at Impeccable-skillen virker på Macen hennes
- rydde gamle brancher og Git-referanser

Ingen endringer i PRD, testdata eller prosjektkode. Ingen commit eller push uten hennes godkjenning.

### Plan
- Fortsettelse av [merge-main-inn-i-carmen-branch](995-2026-11-05-15-51-09-merge-main-inn-i-carmen-branch.md): Carmen merget main inn i Carmen/Branch på nytt kl. 19:22, før Claude-økten. I økten kontrollerte Claude Code bare resultatet av mergen, ikke hvordan konfliktene ble løst underveis.
- Kartla FR-1–FR-34 mot koden og testene (bare i samtalen, ingen fil).
- Kontrollerte testeksempel 05 (FR-31–FR-33, SM-7) for hånd og med en egen beregning skrevet ut fra PRD-teksten. Fasitgeneratoren `testdata/lag_testdata.py` ble ikke brukt som bevis.
- Kontrollerte Impeccable etter `.claude/skills/impeccable/SKILL.md` og launcheren `scripts/impeccable`. Sebastian la skillen inn i prosjektet: [impeccable-skill](../sebastian/980-2026-11-09-10-22-27-impeccable-skill.md).
- Kontrollerte at branchen carmen/product-brief-forbedringer var merget, slettet den og ryddet Git-referansene.

### Resultat
1. **Main merget inn i Carmen/Branch** av Carmen (`4e9dd40`, 19:22, forelder `762bfed` fra main).
   - Fire konflikter: `testdata/COSI-MRP-mal.xlsx`, `testdata/README.md`, `testdata/testeksempel-01.xlsx` og `testdata/testeksempel-01-fasit.xlsx`. Etter mergen er alle fire like main sin versjon. Claude Code kontrollerte dette med `git show --remerge-diff` og `git diff` mot `762bfed`.
   - Carmen/Branch er 0 commits bak og 16 foran main, og er pushet.
2. **Status for kravene:** Det finnes ingen appkode ennå, så ingen FR er implementert i appen. `testdata/lag_testdata.py` har referanselogikk for FR-5–FR-12, FR-17, FR-20, FR-28, FR-29 og FR-31–FR-33, og delvis for FR-13 (deler med eksepsjoner, men ingen markering). Skriptet lager fasitene og er ikke appen.
   - Den eneste pytest-filen, `testdata/arkiv-carmen-flerniva/tests/test_mrp.py`, tester den arkiverte motoren.
   - Valideringsfilene i `testdata/validering/` blir ikke lest av noen test.
3. **Impeccable v4.8.1 er kontrollert og klar til bruk.**
   - Motoren (engine) 0.1.19 for macOS arm64 manglet. Med Carmens godkjenning ble den lastet ned med `scripts/impeccable engine-probe` til `~/.impeccable/bin/0.1.19/`, utenfor prosjektet.
   - SHA-256 (`c35d0b0b…df818`) er lik `engine-checksums.txt`.
   - `engine-probe` svarer `impeccable-engine 0.1.19`, og `--version` svarer `4.8.1`.
   - `context` virket i en tom testmappe utenfor prosjektet og opprettet ingen filer der. Den sjekket om det fantes en nyere versjon og skrev svaret til `~/.impeccable/update-check.json` (siste versjon er 4.8.1).
   - Ikke kjørt i selve prosjektet: `context`, `init` og `hooks on`.
4. **Telemetrien for Impeccable er slått av** med `impeccable telemetry off`. `telemetry status` bekrefter `"telemetry": false` i `~/.impeccable/config.json`. Innstillingen gjelder hele Macen.
5. **Testeksempel 05 er kontrollert analytisk av Claude Code.** Kontrollen brukte inndataene i `testdata/testeksempel-05.xlsx` og reglene i FR-31–FR-33.
   - Ingen avvik mot arket Kapasitet i `testdata/testeksempel-05-fasit.xlsx`:
     - kapasitet per uke, begge radene (C8:J9): 16 av 16
     - begrensende deler med årsak (A13:F28): 16 av 16
     - grunnlag per del (A32:O38): 7 av 7
   - Dokumentert i `.docs/kvalitetssikring/kontroll-testeksempel-05-kapasitet.md`, som er committet sammen med denne loggen. Etter en ny gjennomgang ble formuleringene om SM-7 og FR-33 rettet i dokumentet før commit.
   - **Dette er ikke en uavhengig menneskelig verifikasjon.** Fasiten ble også laget med hjelp fra Claude Code. Gruppen må fortsatt regne den etter for hånd.
6. **Branchen carmen/product-brief-forbedringer er slettet fra GitHub.**
   - Før sletting: branchen pekte på `a022614`. Den commiten finnes i main (merget med PR #1, `b746bcf`), og ingen commits manglet i main.
   - Slettet med `git push origin --delete carmen/product-brief-forbedringer`. `git ls-remote --heads` bekrefter at den er borte, og at de andre branchene er urørt.
7. **Gamle Git-referanser er ryddet** med `git fetch --prune origin`:
   - fjernet `origin/Sebastian/flytt-filer` og `origin/carmen/Branch` (gammel skrivemåte med liten «c»)
   - lagt til `origin/Carmen/Branch`
   - oppdatert `origin/Sebastian/Branch` (`504f4d2..0d2557e`)
8. **Carmen/Branch og origin/Carmen/Branch er like** (`4e9dd40`), verken foran eller bak.

Lukkede punkter i issues.md, fordi main nå har løst dem:
- `testdata/README.md` bruker 300-001–300-008 og beskriver testeksempel 02.
- `testdata/testeksempel-02.xlsx` har arket MPS og de nye typene.

### Åpne punkter
- **Neste steg:** Gruppen starter UX-arbeidet. Deretter følger arkitektur og utvikling.
- **Fasit 05 er ikke kontrollert for hånd av et menneske.** Gruppen må fortsatt kontrollere kapasiteten (samme punkt som i Sebastians issues.md). Forslag: regn etter uke 3 (ledetid, sete), uke 4 (lager, ryggplate) og uke 7 med mottak (lager, felles skruesett) etter `.docs/kvalitetssikring/kontroll-testeksempel-05-kapasitet.md`.
- **Mulig uklar ordlyd i FR-33. Det er ikke påvist noen feil i testeksempel 05.** Den andre konsekvensen i FR-33 sier at en annen del vises som begrensende «fra mottaksuken». Det stemmer bare når delen trengs i samme uke som ferdigproduktet, for eksempel under et ferdigprodukt med ledetid 0. I testeksempel 05 skjer skiftet fra 300-033 til 300-032 i uke 7, ikke i mottaksuken 5, fordi ledetiden forsinker effekten. Det er riktig etter FR-31, og `testdata/README.md` bruker nettopp dette skiftet som dekning for FR-33. Vurder å presisere PRD-teksten.
- **SM-7 er dekket, men noen testbare konsekvenser i FR-31–FR-33 mangler egne tester.** Testeksempel 05 har alt SM-7 krever: sikkerhetslager, planlagte mottak, lager av ferdigproduktet og av en del som produseres selv, en felles del og et tilfelle der ledetiden begrenser. Disse konsekvensene prøves ikke:
  - FR-31: del som produseres selv, under et ferdigprodukt med ledetid 0
  - FR-31: minimumsregelen når verken ferdigproduktet eller delene som produseres selv har ledig beholdning
  - FR-31: lik kapasitet for filer som bare er ulike i MPS
  - FR-31: en del med lagerbeholdning under SS regnes med 0
  - FR-32: mottak under et ferdigprodukt med ledetid 0, og like rader uten mottak
  - FR-33: to begrensende deler med samme laveste verdi
