# Excel-mal (MPS, typer, Kontroll) og PRD for flernivå

## 2026-10-26 kl. 18:15 — Sebastian

### Oppgave
Få main i takt med `Sebastian/Branch` (avtalt i gruppen at den er gjeldende), gjøre endringer i Excel-malen (MPS, færre typer, regel mot innliming, Kontroll for nivåregelen), oppdatere PRD-en etter de nye endringene, legge sensorveiledningen i repoet og rydde rotmappen. PRD og addendum skal holdes utenfor main til Sebastian er ferdig med dem.

### Plan
- Flette main inn i `Sebastian/Branch` (beholde Odas `fremdriftsplan.xlsx`) og flette til main via PR.
- Endre malen i `testdata/lag_testdata.py`, lage malen og testeksempel 01 på nytt, teste Kontroll-formlene i ekte Excel via COM.
- Oppdatere PRD med `bmad-prd` (Update, rask vei); fire avklaringer fra Sebastian logget i PRD-ens `.memlog.md`.
- Ta bare utvalgte filer til main via egne hjelpebrancher og PR-er.

### Resultat
- **Malen** (commit `1b5ca4b`): arket «Prognostiserte behov» heter «MPS»; typer er nå Ferdigvare, Komponent (Kjøpes inn), Komponent (Produseres selv); ny regel i Veiledning om ikke å lime inn i nedtrekkslister; Kontroll-kolonnen sjekker nivåregelen (første rad 0, bare én 0, ..2 under .1/..2) og ugyldige nivåer/typer. Testet i Excel med sju rader: alle regler slo ut riktig. Testeksempel 01 og fasit laget på nytt med gjeldende mal; fasittallene er uendret (bare K01–K08 → 300-001–300-008 og innkjøpstid → ledetid).
- **Main:** PR #4 (malen og testdata uten PRD), PR #5 (sensorveiledning), PR #6 (sensorveiledning til `.docs/kurs/`, fremdriftsplan til `.docs/prosjektstyring/`). Hjelpebranchene er slettet, unntatt `Sebastian/flytt-filer`.
- **PRD** (commit `0161dee`, bare på `Sebastian/Branch`, PR #3 er utkast): flernivå BOM i v1, Stykkliste erstatter Produkt/Komponenter, full MRP også for nivå 0, ny FR-28 (felles deler på lavnivåkode), inntil 1000 rader, Type brukes til validering og innkjøp/produksjonsordre, nye valideringsregler i FR-3. Addendum oppdatert.
- Main flettet inn i `Sebastian/Branch` (commit `4e93b1e`); eneste forskjell mot main er nå PRD-mappen.
- Sensorveiledningen ble lest via tekstuttrekk med `pypdf` (Poppler mangler for bildevisning).

### Åpne punkter
- Testeksempel med 5–10 komponenter på 3 nivåer, minst én felles del og egen fasit (PRD §9 nr. 7). Gruppen lager det i løpet av noen dager. `beregn()` i `lag_testdata.py` regner bare ett nivå og må utvides.
- Fasitmeldingen «Leveranse til kunde blir forsinket» for 300-003 Hjul (nivå .1) bør si at produksjonen av ferdigproduktet blir forsinket (PRD §9 nr. 8). Ordnes når nye testeksempler lages.
- PRD-en har status draft; avslutningsrunden i `bmad-prd` (anmeldelse og språkvask) er ikke kjørt. Sebastian jobber videre med den selv før den flettes til main.
- Issues er ikke opprettet: `book`-CLI-en og `book-cli`-skillen finnes ikke i repoet.
