---
title: 'Story 1.5: Les Excel-filen'
type: 'feature'
created: '2026-11-24'
status: 'done'
baseline_commit: '89fed1857aa0b01485dc12db785b90149db09e66'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/.docs/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen kan ikke lese Excel-filen ennå. `src/excel/` er tom. Valideringen (1.6, 1.8, 1.9) og worker-en (1.10) trenger `RaaArk` eller en filfeil fra `excel/les.ts`.

**Approach:** `les(innhold, filnavn)` i `src/excel/les.ts` sjekker filnavn og de første bytene, leser arbeidsboka med SheetJS og gir `Utfall<RaaArk, Filfeil>` (typene står i `typer.ts`). Den kaster aldri unntak og avgjør aldri om en verdi er feil.

## Boundaries & Constraints

**Always:**
- Ark finnes på eksakt navn. Kolonner finnes ved at overskriften i rad 1, trimmet, er lik malens overskrift (`STYKKLISTE_KOLONNER` osv.). Første treff gjelder. Overskrifter som ikke finnes, får `null`, og ark som ikke finnes, blir `null`. `alleArk` er alle arknavnene i rekkefølge.
- Bare malens kolonner kommer med i `celler`. Kontroll-kolonnen, hjelpekolonnene og arkene Veiledning og Veien videre leses ikke.
- Lagrede verdier, aldri formler. En tom celle eller en tekst som er tom etter trimming, blir `null`. En feilverdi blir teksten sin, for eksempel «#N/A». Tall, tekst og sannhetsverdier beholdes som de er, bortsett fra Nivå og Varenummer: tall blir `String(tall)` (300001 → «300001», 0 → «0», 0.1 → «0.1»), og tekst trimmes.
- Stykkliste: radene leses fra rad 2 og ned til første rad der både Nivå og Varenummer er `null`, uten grense på 1001 (V-S03 har rad 1002). En kolonne som mangler, regnes som tom. `tomRadMedInnholdUnder` er nummeret på den tomme raden hvis noen av malens kolonner har innhold under den, ellers `null`. Lesingen fortsetter til arkets siste rad (minst rad 1001).
- MPS og Planlagte mottak: alle rader fra rad 2 der minst én av malens kolonner har innhold. Hver rad har sitt Excel-radnummer.
- Filfeil sjekkes i denne rekkefølgen: 1) filnavnet slutter ikke på `.xlsx` (uansett store og små bokstaver) gir `IKKE_XLSX`. 2) 0 byte gir `TOM_FIL`. 3) En CFB-fil (`D0 CF 11 E0`) med strømmen `EncryptedPackage` gir `PASSORDBESKYTTET`, og andre CFB-filer gir `IKKE_EXCEL`. 4) En ZIP-fil (`50 4B 03 04`) leses med SheetJS, og gir `SKADET_FIL` hvis SheetJS kaster. 5) Alt annet gir `IKKE_EXCEL`. Bytesjekken må komme før SheetJS, fordi SheetJS leser tomme filer og tekstfiler som CSV uten å feile.

**Never:** ingen validering, ingen tekster i `nb.ts`, ingen worker eller UI. Ingen endring i `typer.ts` (krever egen PR, AD-3). Bare `src/excel/` og `tests/hjelpere/lag-arbeidsbok.ts` importerer `xlsx`. `lag_testdata.py` brukes ikke.

## I/O & Edge-Case Matrix

| Scenario | Input | Forventet |
|---|---|---|
| Gyldig mal | `testeksempel-01`–`05`, `validering/*` utenom V-F04 og V-F07–V-F10 | `ok: true` med `RaaArk` |
| Gammel mal | V-F03 | `ok: true`, `stykkliste: null`, `alleArk` har Produkt og Komponenter |
| Innhold under tom rad | V-S01 | 7 rader (rad 2–8), `tomRadMedInnholdUnder: 9` |
| CSV | V-F04.csv | `IKKE_XLSX` |
| Skadet / tom / tekst | V-F07 / V-F08 / V-F09 | `SKADET_FIL` / `TOM_FIL` / `IKKE_EXCEL` |
| Passord | V-F10 | `PASSORDBESKYTTET` |

**Beslutninger (fattet i planleggingen):** De to filene som må være lagret fra Excel, lages med Excel for Windows via COM av et skript som committes. V-F10 er testeksempel 02 lagret med passordet «cosi». V-G05 er testeksempel 02 lagret på nytt i Excel med en formel i en tallcelle i A–H, som gir den samme verdien som før. Filen er gyldig og gir 0 feil. Nivå lagret som tallet 0.1 tolkes ikke om til «.1». Valideringen avviser det, og kolonne A i malen er formatert som tekst.

</frozen-after-approval>

## Code Map

- `src/domene/typer.ts` -- `RaaArk`, `RaaArkInnhold`, `RaaRad`, `Celleverdi`, `Utfall`, `Filfeil`, kolonnelistene. Brukes som de er.
- `tests/hjelpere/arkitekturregler.ts` -- `excel/` kan importere `domene/`, `tekster/` og `xlsx`. `lag-arbeidsbok.ts` er allerede unntatt i `SHEETJS_UNNTAK`.
- `node_modules/xlsx` (0.20.3) -- `read(data, { type: 'array', cellFormula: false, cellHTML: false, cellStyles: false, dense: true })`. Med `dense` ligger radene i `ws['!data'][r][c]`. `XLSX.CFB.read` brukes til å finne `EncryptedPackage`. `utils.encode_col` og `decode_range` finnes. Sjekket: V-F07 kaster «Bad compressed size», og en passordfil lagret fra Excel kaster «File is password-protected».
- `testdata/testeksempel-01.xlsx` -- Stykkliste har overskriftene i A1:H1, Kontroll i J og hjelpekolonnene Z–AD, og området er A1:AD1001. MPS har overskriftene A1:B1, og ukene 11–12 har Uke fylt ut men tomt antall. Planlagte mottak har A1:C1 og går til rad 201. Filene fra Python har ingen lagrede formelverdier.
- `vite.config.ts` -- Vitest kjører i Node med `tests/**/*.test.ts`. Testene leser filer med `node:fs`, som i `tests/domene/typer.test.ts`.

## Tasks & Acceptance

**Execution:**
- [x] `testdata/lag_excelfiler.ps1` -- PowerShell med Excel COM. Åpner `testeksempel-02.xlsx` og lagrer `validering/V-F10.xlsx` (FileFormat 51, passord «cosi») og `validering/V-G05.xlsx` (en celle byttet med en formel som gir samme verdi, for eksempel `=100+100` for 200). Kjør skriptet og commit filene -- AD-15 krever filer som er lagret fra Excel.
- [x] `testdata/validering/README.md` -- én tabellinje for V-F10 (avvist, NFR-9) og én for V-G05 (0 feil). Nevn skriptet og passordet -- hver valideringsfil står i README-en.
- [x] `tests/hjelpere/lag-arbeidsbok.ts` -- `lagArbeidsbok(ark: Record<string, Celleverdi[][]>): Uint8Array` med SheetJS `utils.aoa_to_sheet` og `write({ type: 'array', bookType: 'xlsx' })` -- små tilfeller for logikken.
- [x] `src/excel/les.ts` -- `export function les(innhold: ArrayBuffer | Uint8Array, filnavn: string): Utfall<RaaArk, Filfeil>` etter reglene over. Hele lesingen står i try/catch, og et uventet unntak gir `SKADET_FIL` -- AD-5, AD-15.
- [x] `tests/excel/les.test.ts` -- tabellen over og AC-ene under, med filer fra `testdata/` og arbeidsbøker fra hjelperen.
- [x] `.docs/ordbank.md` -- legg til «Filfeil» og «Hjelpekolonne» i «App og test», og oppdater `updated` -- CLAUDE.md.

**Acceptance Criteria:**
- Gitt en arbeidsbok der Nivå og Varenummer er lagret som tallene 0 og 300001, når den leses, så er cellene «0» og «300001».
- Gitt en arbeidsbok med kolonnene i en annen rekkefølge og en ekstra kolonne, når den leses, så peker `overskrifter` på riktig bokstav, og den ekstra kolonnen er ikke med i `celler`.
- Gitt en arbeidsbok uten arket MPS, eller uten overskriften «Ledetid (uker)», når den leses, så er `mps` `null`, eller overskriften `null`, og svaret er `ok: true`.
- Gitt V-G05, når den leses, så har formelcellen den lagrede verdien, og ingen `celler` har Kontroll eller hjelpekolonnene som nøkkel.
- Gitt testeksempel 01, når den leses, så har Stykkliste radene 2–10 og `tomRadMedInnholdUnder: null`, og MPS har 12 rader.
- Gitt en arbeidsbok med 1001 utfylte stykklisterader, når den leses, så er siste rad 1002.

## Implementation Notes

- `celler` har en nøkkel for hver av malens kolonner som finnes i arket (verdien kan være `null`). En kolonne som mangler, har ingen nøkkel.
- «Under den tomme raden» betyr radene etter den. En rad der Nivå og Varenummer er tomme, men en annen av malens kolonner er fylt ut, avslutter stykklisten. Innholdet i den raden er ikke med, og det gir bare `tomRadMedInnholdUnder` hvis noe står under den.
- En CFB-fil som SheetJS ikke kan lese (ødelagt), gir `SKADET_FIL` gjennom try/catch rundt hele lesingen.
- `lagArbeidsbok` har en valgfri `bokType` (`'xlsx'` | `'xls'`), så testen kan lage en CFB-fil uten `EncryptedPackage` uten å importere SheetJS.
- V-G05: formelen `=200+200` i Stykkliste!F5 (var 400). Excel lagrer verdiene i Kontroll-kolonnen og hjelpekolonnene Z–AD ned til rad 1001.
- `tests/domene/typer.test.ts` har fått V-F10 (`PASSORDBESKYTTET`) og V-G05 (0 feil), fordi den krever at hver fil i `testdata/validering/` har en kode.

## Spec Change Log

## Review Triage Log

Gjennomgang 1 (Blind Hunter, Edge Case Hunter, Verification Gap). Ruting: P = patch, D = defer, A = avvist.

| # | Funn | Dom | Bevis | Ruting |
|---|---|---|---|---|
| 1 | Testen for ødelagt CFB sjekker bare `ok: false`, ikke `SKADET_FIL` (VG, BH) | low | `les.test.ts` «en ødelagt CFB-fil» sjekker `.ok`. En endring til `IKKE_EXCEL` ville passert | P |
| 2 | Feilverdier («#N/A») er ikke testet (VG, BH) | medium | Ingen test lager en celle av typen `e`. `lagArbeidsbok` kan ikke lage en, og ingen fil i testdata/ har en | P |
| 3 | Radløkkene går til slutten av `!ref`, opptil rad 1 048 576 (ECH, BH) | low | `sisteRad = max(!ref, data.length)`. Rader etter `data.length` kan ikke ha innhold. BH målte omtrent 213 ms. Rettes med en enkel grense | P |
| 4 | Overskriftene normaliseres ikke med NFC (BH) | low | `verdi.trim() === navn`. «Nivå» i NFD gir `null`. Rettes med ett kall | P |
| 5 | epic-1-context lister V-G01–V-G04 (BH) | low | Testkrav-linja mangler V-G05 og nevner V-F10 bare indirekte. Rettes i teksten | P |
| 6 | En stopprad med innhold i andre kolonner forsvinner uten varsel (BH) | medium | Koden følger den frosne regelen og PRD-en («under den raden»). Regelen selv dekker ikke raden. Det gjelder kravet, ikke denne storyen | D |
| 7 | Varenummer som tall med formatet `000000` mister nullene (ECH, BH) | low | Kolonne B i malen er General, så egendefinert format er sjeldent. Rettingen gir nye greiner | A |
| 8 | Varenummer på mer enn 15 sifre mister sifre (ECH) | low | Presisjonen er alt tapt i Excel (double). Ingenting å hente | A |
| 9 | En dato i en tallkolonne leses som et heltall (ECH, BH) | low | Det er ekte (serienummer 46023), men en dato i Antall er lite sannsynlig, og tallet synes i resultatet. Rettingen krever en ny grein med `SSF.is_date` | A |
| 10 | En ukjent feilkode uten `w` blir «#N/A» (ECH) | false | SheetJS setter `w` for feilceller når `cellText` står på standard, så reserven nås ikke med .xlsx | A |
| 11 | En annen ZIP-fil (.docx) gir `SKADET_FIL`, og ODS eller XLSB gir `ok` (ECH, BH) | low | Det krever en omdøpt fil av et annet format. Rettingen trenger kontroll av innholdet i ZIP-fila | A |
| 12 | Uten både Nivå og Varenummer forsvinner alle radene (ECH) | low | Valideringen gir to strukturfeil (1.6) og hopper over kontrollene som avhenger av dem. Svært usannsynlig | A |
| 13 | COM-objektene frigis ikke ved feil i `lag_excelfiler.ps1` (ECH, BH) | low | Gjelder bare utviklere, og skriptet kjøres sjelden. Rettingen er en omstrukturering | A |
| 14 | Feilcelle og skrevet «#N/A» kan ikke skilles (BH) | false | Valideringen avviser begge som ugyldig verdi, så det får ingen følger | A |
| 15 | Kolonnene under den tomme raden følger overskriftene, ikke A–H (BH) | low | Det er bare annerledes når en overskrift mangler, og da gir valideringen alt en strukturfeil | A |
| 16 | V-G05-testen viser ikke at fila har en formel (BH) | low | Det er sant, men fila er lagret fra Excel og committet. Å sjekke XML-en uten SheetJS krever egen utpakking av ZIP | A |
| 17 | Kommentaren «AA–AD» skulle vært Z–AD (BH) | false | Z har faste verdier bare i rad 2–4. Det er AA–AD som har formler ned til rad 1001, så kommentaren stemmer | A |
| 18 | `lag_testdata.py --alle` sletter V-F10 og V-G05 og skriver README uten dem (BH) | low | Det står i skriptet og i README-en, og `git checkout` henter filene tilbake. Rettingen krever endring i README-genereringen | A |
| 19 | Spesifikasjonen: «=100+100» mot `=200+200`, og `fasit-leser.ts` mangler i «Never» (BH) | low | Rettingen er å endre spesifikasjonen | A |

## Verification

**Commands:**
- `npm test` -- alle grønne, også arkitekturtesten
- `npm run lint` -- ingen advarsler
- `npm run build` -- grønn
