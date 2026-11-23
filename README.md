# G23 — COSI - MRP

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

COSI - MRP er en nettbasert app for materialbehovsplanlegging (MRP) i små produksjonsbedrifter. I mange slike bedrifter ligger planleggingen i et regneark som bare én person forstår. Appen legger hele MRP-prosessen inn i verktøyet, så en ny planlegger kan forstå planen uten å kunne formlene.

> **Utkast.** Appen er ikke laget ennå. Planleggingen er ferdig (PRD-en er `final`), og utviklingen starter nå. Delene merket *Kommer* fylles ut når koden finnes. Fristen er 15. desember 2026 kl. 15:00.

## Hva appen gjør

Brukeren fyller ut en fast Excel-mal med stykkliste, prognostiserte behov (MPS), lagerbeholdning, sikkerhetslager, ledetid og planlagte mottak, og laster den opp. Appen

- kontrollerer filen og viser alle feilene samlet før noe beregnes
- beregner bruttobehov, nettobehov og bestillingsforslag per uke og del, for en stykkliste med inntil tre nivåer
- viser fem typer eksepsjoner der planen ikke går opp, og markerer de kritiske delene
- forklarer hvordan hvert tall er regnet ut
- husker siste kjøring per ferdigprodukt i nettleseren og viser hva som er endret siden sist
- eksporterer resultatet til Excel
- viser hvor mange ferdigprodukter lageret og de planlagte mottakene rekker til, og hvilken del som begrenser

Alt skjer i brukerens nettleser. Appen publiseres på Vercel, men ingen data sendes til en server. Hele kravspesifikasjonen står i [PRD-en](.docs/planning-artifacts/prds/prd-COSI%20-%20MRP-2026-10-19/prd.md).

## Kom i gang

**Forutsetninger:** [Node.js](https://nodejs.org/) 24 eller 26 (LTS), eller 22.12 eller nyere i 22-serien, og Git. Prosjektet bygges og testes på Node 24. Node 23 og 25 støttes ikke av Vitest, og `npm ci` stopper på dem. Appen trenger ingen API-nøkler, betalte kontoer eller tjenester som gruppen driver (PRD NFR-3).

**Installasjon:**

```sh
npm ci                                    # installerer de låste versjonene fra package-lock.json
npx playwright install chromium firefox   # én gang: nettleserne til testene i nettleser
```

**Kommandoer:**

| Kommando | Hva den gjør |
|---|---|
| `npm run dev` | Starter appen lokalt på http://localhost:5173 |
| `npm test` | Kjører alle testene i Vitest, også arkitekturtesten. Trenger ikke nett, nøkler eller kontoer (PRD NFR-2) |
| `npm run lint` | Kontrollerer koden med oxlint. Advarsler gir også feil |
| `npm run build` | Kontrollerer typene og lager de statiske filene i `dist/` |
| `npm run preview` | Viser bygget fra `dist/` lokalt, med den samme Content Security Policy og de samme sikkerhetshodene som `vercel.json` setter |
| `npm run test:e2e` | Bygger appen og kjører testene i nettleser (Playwright) i Chromium og Firefox. Er ikke med i `npm test` |

`npm test`, `npm run lint` og `npm run build` må være grønne før en pull request flettes. Endrer storyen `src/ui/`, `src/worker/` eller `src/excel/`, må også `npm run test:e2e` være grønn (arkitektur AD-18). `npm run dev` har ingen CSP, fordi utviklingsserveren trenger inline-skript, så brudd på CSP-en viser seg først i `npm run test:e2e`, der alle testene feiler ved brudd. Lenken til appen på Vercel kommer når publiseringen er satt opp (Story 1.3).

**Avhengigheter** har eksakte versjoner, uten `^` og `~`, og `package-lock.json` ligger i repoet. Bruk `npm ci`, ikke `npm install`, når du bare skal kjøre prosjektet. SheetJS installeres fra `cdn.sheetjs.com`, ikke fra npm (arkitektur AD-15).

## Testdata

[`testdata/`](testdata/README.md) har Excel-malen, fem testeksempler med fasit (01–04 er kontrollert for hånd, 05 venter på kontroll) og valideringsfiler for feil i opplastede filer. Prøv appen med `testdata/testeksempel-01.xlsx`, og sammenlign med `testdata/testeksempel-01-fasit.xlsx`.

| Testeksempel | Tester |
|---|---|
| 01 | Grunnleggende beregning og eksepsjonene på ett nivå |
| 02 | Tre nivåer, felles del, eksepsjoner på alle nivåer |
| 03 | Før/etter-sammenligning (02 med endrede prognostiserte behov) |
| 04 | Grensetilfeller, 12 uker |
| 05 | Produksjonskapasitet fra lager |

Filene lages av `testdata/lag_testdata.py`. For å lage dem på nytt trengs [uv](https://docs.astral.sh/uv/):

```sh
uv run --with openpyxl python testdata/lag_testdata.py testdata --alle
```

Skriptet kontrollerer først at hvert testeksempel gir de eksepsjonene og den kapasiteten det skal teste, og stopper ellers. Uten `--alle` lages bare den tomme malen.

## Mappestruktur

```text
.
├── README.md                   denne filen
├── CLAUDE.md                   instrukser til KI-agenten (sesjonslogg og ordbank)
├── .docs/
│   ├── ordbank.md              felles begreper for dokumenter, mal, kode og app
│   ├── kurs/                   sensorveiledningen for del 1
│   ├── prosjektstyring/        fremdriftsplanen
│   └── planning-artifacts/
│       ├── briefs/             product brief, addendum og faglærers tilbakemelding
│       ├── prds/               PRD, addendum, beslutninger og kvalitetssikring
│       └── research/           research om MRP-reglene, med kilder
├── src/                        koden til appen (arkitektur kap. 2)
│   ├── domene/                 kjernen: typer, validering, beregning, eksepsjoner, sammenligning
│   ├── tekster/                all norsk tekst (nb.ts)
│   ├── excel/                  lesing og eksport med SheetJS
│   ├── lagring/                lagrede kjøringer i nettleseren
│   ├── worker/                 kjøringen i en Web Worker
│   ├── app/                    styring av kjøringen og felles tilstand
│   └── ui/                     React-komponentene
├── public/                     Excel-malen og testeksempel 01, like filene i testdata/
├── tests/                      Vitest, med samme mapper som src/, og arkitekturtesten
├── e2e/                        Playwright-testene
├── vercel.json                 Content Security Policy for Vercel
├── testdata/                   Excel-mal, testeksempler, fasiter og valideringsfiler
├── .logs/<bruker>/             sesjonslogger fra arbeidet med KI, og åpne punkter (issues.md)
├── .claude/skills/             BMAD-ferdighetene og sesjonslogg-ferdigheten
└── _bmad/                      oppsett og skript for BMAD
```

Hvilke mapper som kan importere fra hvilke, står i arkitekturen (`.docs/planning-artifacts/architecture/architecture-COSI - MRP-2026-11-22-vedtatt/arkitektur.md`, kapittel 2). Arkitekturtesten i `tests/arkitektur.test.ts` feiler hvis en fil bryter reglene.

## Planlegging og prosess

Vi planlegger med [BMAD](https://github.com/bmad-code-org/BMAD-METHOD): product brief → PRD → UX og arkitektur → epics og stories → kode. Dokumentene er oppdatert underveis, og beslutningene er begrunnet.

| Dokument | Innhold |
|---|---|
| [Product brief](.docs/planning-artifacts/briefs/brief-COSI%20-%20MRP-2026-09-13/brief.md) | Problemet, brukerne, løsningen og omfanget. Frosset: ved avvik gjelder PRD-en. |
| [Faglærers tilbakemelding](.docs/planning-artifacts/briefs/brief-COSI%20-%20MRP-2026-09-13/tilbakemelding-product-brief.md) | Tilbakemeldingen på briefen, som PRD-en bygger på |
| [PRD](.docs/planning-artifacts/prds/prd-COSI%20-%20MRP-2026-10-19/prd.md) | Krav (FR-1–FR-34, NFR-1–NFR-11), brukerreiser, omfang og suksessmål |
| [Addendum til PRD](.docs/planning-artifacts/prds/prd-COSI%20-%20MRP-2026-10-19/addendum.md) | Begrunnelser, innspill til arkitektur og UX, endringshistorikk |
| [Beslutninger 05.11](.docs/planning-artifacts/prds/prd-COSI%20-%20MRP-2026-10-19/beslutninger-2026-11-05.md) og [09.11](.docs/planning-artifacts/prds/prd-COSI%20-%20MRP-2026-10-19/beslutninger-2026-11-09.md) | Åpne spørsmål og gruppemøtets beslutninger |
| [Kvalitetssikring av PRD-en](.docs/planning-artifacts/prds/prd-COSI%20-%20MRP-2026-10-19/kvalitetssikring-2026-11-05/README.md) | Avstemming mot kildene og gjennomgang mot sjekklisten |
| [Research om MRP-reglene](.docs/planning-artifacts/research/academic-lit-mrp-regler-forfalte-ordrer-eksepsjoner-h-2026-11-02/research.md) | Reglene sjekket mot lærebøker og ERP-systemer |
| [Ordbank](.docs/ordbank.md) | Begrepene vi bruker, og synonymene vi ikke bruker |
| [Fremdriftsplan](.docs/prosjektstyring/fremdriftsplan.xlsx) | Plan for prosjektet |

## Bruk av KI

Vi bruker Claude Code med BMAD-ferdighetene i `.claude/skills/`. Sporene etter arbeidet ligger i repoet:

- **Sesjonslogger** i `.logs/<bruker>/`: hva vi ba om, planen, resultatet og åpne punkter for hver økt, med lenke til commits. `issues.md` samler det som gjenstår.
- **Beslutningslogger** (`.memlog.md`) i hver BMAD-mappe: hver beslutning og endring i PRD-en og researchen, med begrunnelse.
- **Kvalitetssikring:** fasitene kontrolleres for hånd, referanseberegningen i `lag_testdata.py` stopper hvis den avviker fra dem, og PRD-en er avstemt mot kildene.

## Medlemmer

- Sebastian M Eriksen
- Oda Wølstad-Knudsen
- Carmen Kolstad
- Idun Samdal
