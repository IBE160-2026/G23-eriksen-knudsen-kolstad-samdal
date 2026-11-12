---
name: COSI - MRP
description: Nettbasert MRP-verktøy for små produksjonsbedrifter. Planleggerens arbeidsbenk – rolige flater, tette tall, farge bare for handling og eksepsjoner.
status: utkast – må godkjennes av gruppen
author: Carmen Kolstad
created: 2026-11-12
updated: 2026-11-12
sources:
  - ../../prds/prd-COSI - MRP-2026-10-19/prd.md
  - ../../prds/prd-COSI - MRP-2026-10-19/addendum.md
  - ../../../ordbank.md
  - ../designforslag-2026-11-12.md
colors:
  # Lys modus er standard. Mørk modus (-dark) er med som tokens, men er ikke et v1-krav.
  surface-base: '#F4F6F7'
  surface-raised: '#FFFFFF'
  surface-sunken: '#EDF0F2'
  ink-primary: '#14202B'
  ink-secondary: '#596775'
  line: '#D9DFE4'
  line-faint: '#9AA6B1'
  accent: '#0D5C6E'
  accent-ink: '#FFFFFF'
  accent-soft: '#E1EEF1'
  exc-critical: '#B3261E'
  exc-critical-soft: '#FCEBEA'
  exc-warning: '#8F5A00'
  exc-warning-soft: '#FFF3D9'
  exc-info: '#1E5AA8'
  exc-info-soft: '#E7EFFA'
  exc-horizon: '#5A48A6'
  exc-horizon-soft: '#EEEBFA'
  change-new: '#2C6E3F'
  change-new-soft: '#E5F2E8'
  surface-base-dark: '#0E1317'
  surface-raised-dark: '#151C22'
  surface-sunken-dark: '#1B242B'
  ink-primary-dark: '#E4E9ED'
  ink-secondary-dark: '#98A6B2'
  line-dark: '#29343D'
  line-faint-dark: '#5F6C78'
  accent-dark: '#62B6C8'
  accent-ink-dark: '#0B1A1F'
  accent-soft-dark: '#16313A'
  exc-critical-dark: '#FF8C82'
  exc-critical-soft-dark: '#3A1A18'
  exc-warning-dark: '#F0B74E'
  exc-warning-soft-dark: '#36290F'
  exc-info-dark: '#8EB8F0'
  exc-info-soft-dark: '#15253A'
  exc-horizon-dark: '#B9AEF2'
  exc-horizon-soft-dark: '#241F40'
  change-new-dark: '#86CFA0'
  change-new-soft-dark: '#14301F'
typography:
  display:
    fontFamily: 'IBM Plex Sans Condensed'
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1.15'
  section:
    fontFamily: 'IBM Plex Sans Condensed'
    fontSize: 19px
    fontWeight: '700'
    lineHeight: '1.2'
  product:
    fontFamily: 'IBM Plex Sans Condensed'
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.2'
  body:
    fontFamily: 'IBM Plex Sans'
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.55'
  table:
    fontFamily: 'IBM Plex Sans'
    fontSize: 13.5px
    fontWeight: '400'
    lineHeight: '1.3'
  table-strong:
    fontFamily: 'IBM Plex Sans'
    fontSize: 13.5px
    fontWeight: '700'
    lineHeight: '1.3'
  label:
    fontFamily: 'IBM Plex Sans'
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.04em
  code:
    fontFamily: 'IBM Plex Mono'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.3'
rounded:
  sm: 3px
  md: 5px
  lg: 6px
  xl: 10px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  row-height: 32px
  panel-width: 340px
  gutter: 18px
components:
  button-primary:
    background: '{colors.accent}'
    foreground: '{colors.accent-ink}'
    radius: '{rounded.md}'
  button-secondary:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    border: '{colors.line}'
    radius: '{rounded.md}'
  week-chip:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-primary}'
    background-selected: '{colors.ink-primary}'
    foreground-selected: '{colors.surface-raised}'
    radius: '{rounded.full}'
  exception-badge-critical:
    background: '{colors.exc-critical-soft}'
    foreground: '{colors.exc-critical}'
    glyph: '!'
    radius: '{rounded.sm}'
  exception-badge-safety-stock:
    background: '{colors.exc-warning-soft}'
    foreground: '{colors.exc-warning}'
    glyph: 'S'
    radius: '{rounded.sm}'
  exception-badge-receipt-late:
    background: '{colors.exc-warning-soft}'
    foreground: '{colors.exc-warning}'
    glyph: 'M'
    radius: '{rounded.sm}'
  exception-badge-cancel-receipt:
    background: '{colors.exc-info-soft}'
    foreground: '{colors.exc-info}'
    glyph: 'K'
    radius: '{rounded.sm}'
  exception-badge-horizon:
    background: '{colors.exc-horizon-soft}'
    foreground: '{colors.exc-horizon}'
    glyph: '⧗'
    radius: '{rounded.sm}'
  overdue-tag:
    background: '{colors.exc-critical-soft}'
    foreground: '{colors.exc-critical}'
    radius: '{rounded.sm}'
  result-table-cell:
    height: '{spacing.row-height}'
    typography: '{typography.table}'
    zero-foreground: '{colors.ink-secondary}'
    negative-foreground: '{colors.exc-critical}'
    week-1-background: '{colors.accent-soft}'
    selected-ring: '{colors.accent}'
  part-header:
    background: '{colors.surface-sunken}'
    typography: '{typography.table-strong}'
    item-number: '{typography.code}'
  explanation-panel:
    background: '{colors.surface-raised}'
    width: '{spacing.panel-width}'
    border: '{colors.line}'
    result-row-background: '{colors.accent-soft}'
  capacity-panel:
    background: '{colors.surface-raised}'
    border: '{colors.line}'
    border-width: 2px
    radius: '{rounded.xl}'
  change-tag-new:
    background: '{colors.change-new-soft}'
    foreground: '{colors.change-new}'
    radius: '{rounded.sm}'
  change-tag-changed:
    background: '{colors.exc-info-soft}'
    foreground: '{colors.exc-info}'
    radius: '{rounded.sm}'
  change-tag-removed:
    background: '{colors.surface-sunken}'
    foreground: '{colors.ink-secondary}'
    radius: '{rounded.sm}'
  validation-summary:
    background: '{colors.exc-critical-soft}'
    foreground: '{colors.exc-critical}'
    radius: '{rounded.md}'
---

> **Utkast – må godkjennes av gruppen.** Destillert av Carmen Kolstad med `bmad-ux` (BMAD 6.12.0) fra [designforslaget](../designforslag-2026-11-12.md) og [prototypen](../designforslag-2026-11-12-prototype.html). Dette dokumentet og [EXPERIENCE.md](EXPERIENCE.md) går foran prototypen og designforslaget ved avvik. PRD-en går foran begge. `[ASSUMPTION]` markerer det gruppen ikke har bestemt. Beslutningene står i [`.memlog.md`](.memlog.md).

## Brand & Style

COSI - MRP er planleggerens arbeidsbenk, ikke et dashbord. Brukeren er en innkjøper eller planlegger uten MRP-bakgrunn, som skal finne det som krever handling og forstå hvorfor (PRD SM-3). Uttrykket er presist og rolig: kjølige, nesten nøytrale flater, tall som står tett og rett, og ingen pynt.

Bare to ting får farge. Petrol betyr «du kan gjøre noe her». De fem eksepsjonsfargene betyr «planen går ikke opp her». Alt annet er nøytralt. Det er slik mot-målet SM-C3 blir til design: tabellen skal ikke fylles med farger og symboler for å se informativ ut.

Skriften er IBM Plex, laget for teknisk dokumentasjon og industri. Den har tydelige tall og en smal variant til overskrifter som tar lite plass over brede tabeller.

## Colors

- **Flater (`{colors.surface-base}`, `{colors.surface-raised}`, `{colors.surface-sunken}`)** er kjølige gråtoner med et svakt blått skjær. Tabeller og paneler står på `surface-raised`. Delens hode og tabellhodet står på `surface-sunken`.
- **Tekst (`{colors.ink-primary}`, `{colors.ink-secondary}`)**. `ink-secondary` brukes til metadata, radnavn og nuller i tabellen.
- **Linjer (`{colors.line}`)** skiller rader og paneler. `{colors.line-faint}` er bare for ikke-tekst (deaktivert, svake skiller). Den har for lav kontrast til tekst.
- **Petrol (`{colors.accent}`)** er eneste aksent: primærknapp, valgt celle, aktiv seksjon i menyen, lenker. `{colors.accent-soft}` gir uke 1-kolonnen og resultatlinjen i forklaringspanelet en svak bakgrunn.
- **Eksepsjonsfarger.** Hver type har en fast farge og en lys bakgrunnsvariant:

  | Eksepsjon (ordbanken) | Farge | Symbol |
  |---|---|---|
  | Bestilling forsinket | `{colors.exc-critical}` | `!` |
  | Bruk av sikkerhetslager | `{colors.exc-warning}` | `S` |
  | Mottak forsinket | `{colors.exc-warning}` | `M` |
  | Kanseller mottak | `{colors.exc-info}` | `K` |
  | Ledetid overskrider horisont | `{colors.exc-horizon}` | `⧗` |

  `exc-critical` brukes også til negative tall, forfalt mengde og valideringsfeil. Ingen av disse fargene brukes til pynt.
- **Endringer (`{colors.change-new}`)** markerer «Nytt forslag» og «Ny eksepsjon» i før/etter-sammenligningen. «Endret» bruker `exc-info`, og «Fjernet»/«Borte» er nøytral og gjennomstreket. Rødt og grønt brukes aldri som motpar.

**Kontrast (WCAG 2.1 AA, lys / mørk modus):**

| Kombinasjon | Lys | Mørk |
|---|---|---|
| `ink-primary` på `surface-raised` | 16,5 | 14,1 |
| `ink-secondary` på `surface-raised` | 5,8 | 6,9 |
| `ink-secondary` på `surface-sunken` | 5,1 | 6,3 |
| `accent` på `surface-raised` (og omvendt) | 7,6 | 7,4 |
| `exc-critical` på `exc-critical-soft` | 5,7 | 7,0 |
| `exc-warning` på `exc-warning-soft` | 5,3 | 7,8 |
| `exc-info` på `exc-info-soft` | 5,9 | 7,6 |
| `exc-horizon` på `exc-horizon-soft` | 6,2 | 7,7 |
| `change-new` på `change-new-soft` | 5,3 | 7,8 |
| `line-faint` på `surface-raised` | 2,5 – **ikke til tekst** | 3,2 – **ikke til tekst** |

Prototypen viser nuller i `line-faint`. Det klarer ikke 4,5:1, så nuller bruker `ink-secondary` i denne spesifikasjonen.

## Typography

| Rolle | Token | Brukes til |
|---|---|---|
| Overskrift | `{typography.display}` | Sidetittel |
| Seksjon | `{typography.section}` | Bestillingsforslag, Kritiske deler, Resultattabell, Produksjonskapasitet |
| Ferdigprodukt | `{typography.product}` | Navnet i kjøringslinjen |
| Brødtekst | `{typography.body}` | Veiledning, meldinger, forklaringspanel |
| Tabell | `{typography.table}` / `{typography.table-strong}` | Alle tall. `table-strong` til planlagte ordrefrigivelser og mengder i bestillingsforslag |
| Etikett | `{typography.label}` | Kolonneoverskrifter, små etiketter |
| Varenummer | `{typography.code}` | Alle varenummer, så de skilles fra mengder |

Regler:

- Alle tall har like brede sifre (`font-variant-numeric: tabular-nums`), høyrejusteres og skrives med norsk tallformat (mellomrom som tusenskille, ekte minustegn «−»).
- Overskrifter er smale (Condensed). Brødtekst og tabeller er vanlig bredde.
- Ingen store tall i kort («hero numbers»), bortsett fra kapasitetstallet per uke i kapasitetspanelet.
- Reservefonter: `system-ui, -apple-system, "Segoe UI", sans-serif` og `ui-monospace, Menlo, monospace`.

## Layout & Spacing

Skala: 4 / 8 / 12 / 16 / 20 / 24 px (`{spacing.1}`–`{spacing.6}`). Søskengrupper legges ut med `gap`, ikke marger.

- **Siden:** full bredde for PC (NFR-6). Appmeny og kjøringslinje over hele bredden. Innholdet har `{spacing.gutter}` på sidene.
- **Resultatsiden:** én kolonne med seksjoner i fast rekkefølge (se EXPERIENCE.md). Når forklaringspanelet er åpent, blir arbeidsflaten to kolonner: tabellen tar resten, panelet er `{spacing.panel-width}` bredt og står fast til høyre mens brukeren blar. Panelet skyver tabellen til side og legger seg ikke over den.
- **Tabeller:** radhøyde `{spacing.row-height}`. Tynne skillelinjer og ingen sebrastriper. Delene skilles med en tykkere linje over delens hode. Radene i en del har bare tynne linjer.
- **Faste kolonner (NFR-8):** delens hode og radnavnene står fast ved sidescroll, med ugjennomsiktig bakgrunn. Ukeoverskriften står fast ved loddrett rulling i tabellområdet.
- **Smal skjerm** (under 900 px): panelet blir et ark nederst på skjermen (inntil 60 % av høyden). Tabellen ruller sideveis i sitt eget område. Mobil er ikke et mål (NFR-6), men siden skal ikke knekke.

## Elevation & Depth

Hierarki kommer fra flate og linje, ikke skygge. Paneler og tabeller står på `surface-raised` med `{colors.line}` rundt. Den eneste skyggen er på forklaringspanelet når det er et ark nederst på smal skjerm. Kapasitetspanelet skilles med tykkere ramme (2 px), ikke skygge.

## Shapes

Små, presise hjørner: `{rounded.sm}` (3 px) for merkelapper, `{rounded.md}` (5 px) for knapper og meldingsbokser, `{rounded.lg}` (6 px) for tabellrammer og paneler, `{rounded.xl}` (10 px) for kapasitetspanelet og hele arbeidsflaten. `{rounded.full}` brukes bare på ukefilterets chips og antall-tellere i seksjonsmenyen.

## Components

| Komponent | Visuell spesifikasjon |
|---|---|
| Primærknapp | `{components.button-primary}`. Bare én per område: «Eksporter til Excel» i kjøringslinjen, «Velg fil» på startsiden, «Last opp rettet fil» ved valideringsfeil |
| Sekundærknapp | `{components.button-secondary}`. «Last opp ny fil», «Lukk», «Slett» |
| Appmeny | Logo (petrolfirkant med to streker) og «COSI-MRP» i `section`. Lenker i `body`, aktiv side på `surface-sunken` med fet tekst |
| Kjøringslinje | Ferdigproduktets navn i `product`, varenummer i `code` ved siden av. Under: horisont, filnavn, tidspunkt og lagringsstatus i `label`-størrelse i `ink-secondary`. Knappene til høyre |
| Seksjonsmeny | Tekstknapper med understrek i `accent` for aktiv seksjon. Antall i en grå teller. Telleren for kritiske deler bruker `exc-critical-soft` / `exc-critical` |
| Ukefilter | `{components.week-chip}`. «Alle uker» først, deretter «Uke 1» til «Uke H», hver med antall i `ink-secondary` |
| Merke for forfalt mengde | `{components.overdue-tag}`. Tekst «! 50 forfalt». `[ASSUMPTION]` alternativ: «175 (50 forfalt)» i mengdekolonnen |
| Eksepsjonsmerke | `exception-badge-*`: symbol i en liten firkant i eksepsjonsfargen, med navnet fra ordbanken ved siden av. I tabellen vises bare symbolet (20 × 20 px) |
| Kritisk-flagg | «● Kritisk» i `exc-critical`, i delens hode |
| Delens hode | `{components.part-header}`: nivåmerkelapp (`0`, `.1`, `..2`) med tynn ramme, varenummer, beskrivelse i fet, så type, lager, SS, L og antall per overordnet del i `ink-secondary`. Innrykk 12 px per nivå |
| Resultattabellcelle | `{components.result-table-cell}`. Valgt celle får 2 px innvendig ramme i `accent` og `accent-soft` bakgrunn. Radnavn og ukeoverskrift for valgt celle blir fete |
| Eksepsjonsrad | `[ASSUMPTION]` Egen rad «Eksepsjoner» øverst i hver kritiske del, med symbolene i ukekolonnene. Radnavnet i `exc-critical`. Se åpne beslutninger |
| Forklaringspanel | `{components.explanation-panel}`. Overskrift: del og uke i `label`, verdien i `section`. Utregningen som en tabell med to kolonner; siste linje (resultatet) på `accent-soft` og fet. Regelen i en grå boks. Eksepsjonsmeldinger i boks med eksepsjonens lyse bakgrunn |
| Kapasitetspanel | `{components.capacity-panel}`. Overskrift i `section`. Forklarende setning i grå boks. Kapasitetstallet i 16 px fet; begrensende del under tallet i 11,5 px `ink-secondary`, med `⧗` (ledetid, `exc-horizon`) eller `▤` (lager, `exc-warning`). `↑` i `change-new` når mottakene gir mer enn lageret |
| Endringsmerke | `change-tag-new` (Nytt forslag, Ny eksepsjon, Ny del), `change-tag-changed` (Endret mengde), `change-tag-removed` (Fjernet, Borte – gjennomstreket). Mengde som «130 → 205» med pil i `ink-secondary` |
| Valideringsoppsummering | `{components.validation-summary}`: rød boks med «✕» og overskrift. Feillisten under som vanlig tabell |
| Opplastingssone | Stiplet ramme i `line`, 8 px hjørner, «Slipp Excel-malen her», «eller» og primærknappen «Velg fil». Under: «Filen blir i nettleseren din og sendes ikke til noen server.» |
| Informasjonsboks | Hvit flate med ramme og «ⓘ». Brukes til «Første kjøring …» og lagringsstatus |

→ Visuell referanse: [prototypen](../designforslag-2026-11-12-prototype.html) og [skjermbildet av resultatsiden](../designforslag-2026-11-12-resultatside.png). Dette dokumentet går foran ved avvik.

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Farge pluss symbol eller tekst for hver eksepsjon og status (FR-15, NFR-8) | Farge alene, eller farge på tall bare for å pynte |
| Petrol bare for det brukeren kan klikke på eller har valgt | Petrol som bakgrunn på store flater eller som dekor |
| Høyrejusterte tall med like brede sifre og norsk tallformat | Venstrejusterte tall eller proporsjonale sifre i tabeller |
| Nuller i `ink-secondary` | Nuller i `line-faint` (for lav kontrast) |
| Rolige flater, tynne linjer, ingen skygger | Kort med skygge rundt hver seksjon, sebrastriper, gradienter |
| Samme fem eksepsjonsnavn som ordbanken | Egne korte navn eller forkortelser for eksepsjonstypene |
| Kapasitetspanelet tydelig adskilt med ramme og overskrift (FR-34) | Samme utseende for kapasitet og bestillingsplan |
| Mørk modus bare hvis gruppen tar det inn i v1 `[ASSUMPTION]` | Mørk modus som ekstra testbyrde før kjernen er ferdig |
