---
name: COSI - MRP
description: Nettbasert MRP-verktøy for små produksjonsbedrifter. Planleggerens arbeidsbenk – rolige flater, tette tall, farge bare for handling og eksepsjoner.
status: utkast – sammenslått 22.11, må godkjennes av gruppen
authors:
  - Carmen Kolstad (grunnlaget og tokens, 12.11)
  - Sebastian (regler for tall, skrift, minste skjerm og tilgjengelighet, 13.11)
  - Oda (prototypene v1–v4 og avklaringene 22.11)
created: 2026-11-12
updated: 2026-11-22
sources:
  - ../../prds/prd-COSI - MRP-2026-10-19/prd.md
  - ../../../ordbank.md
  - ../ux-avklaringer-2026-11-22/README.md
  - ../ux-avklaringer-2026-11-22/prototype/index.html (prototypen v4)
  - Carmens DESIGN.md 12.11 (Carmen/Branch, ux/ux-COSI - MRP-2026-11-12/)
  - Sebastians DESIGN.md 14.11 (Sebastian/Branch, ux-designs/ux-COSI - MRP-2026-11-13/)
  - EXPERIENCE.md
colors:
  # Lys visning er standard. Mørk visning (-dark) er med i v1, og brukeren bytter selv (godkjent 22.11).
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
  # Tallboksene (godkjent 22.11, verdiene fra prototypen v3 og v4)
  summary-bg: '#0D5C6E'
  summary-hover: '#0A4B5A'
  summary-ink: '#FFFFFF'
  summary-ink2: '#CFE6EC'
  summary-num-critical: '#FFC2BB'
  summary-num-overdue: '#FF8CC6' # sterkere rosa 22.11, kontrast 3,5:1 mot summary-bg (stor tekst)
  summary-bg-dark: '#0C2A2E'
  summary-hover-dark: '#11383D'
  summary-ink-dark: '#E8F6F5'
  summary-ink2-dark: '#A9C9C8'
  summary-num-critical-dark: '#FF8C82'
  summary-num-overdue-dark: '#FF7AB8' # kontrast 6,3:1
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
  min-viewport: 1366x630px # minste vindu, se Layout & Spacing
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
  summary-boxes:
    background: '{colors.summary-bg}'
    foreground: '{colors.summary-ink}'
    radius: 16px
    number-size: 40px
  section-button:
    background: '{colors.surface-raised}'
    foreground: '{colors.ink-secondary}'
    border: '{colors.line}'
    background-selected: '{colors.ink-primary}'
    foreground-selected: '{colors.surface-base}'
    radius: '{rounded.full}'
  validation-summary:
    background: '{colors.exc-critical-soft}'
    foreground: '{colors.exc-critical}'
    radius: '{rounded.md}'
  howto-box:
    background: '{colors.surface-raised}'
    border: '{colors.line}'
    radius: '{rounded.xl}'
  critical-line:
    background: '{colors.surface-raised}'
    border: '{colors.line}'
    edge-width: 4px
    edge: 'fargen til delens tidligste eksepsjon (exc-*)'
    radius: '{rounded.lg}'
  focus-ring:
    color: '{colors.accent}'
    width: 2px
    offset: 2px
    on-summary: '{colors.summary-ink}'
---

# COSI - MRP – Design

> **Utkast – sammenslått 22.11, må godkjennes av gruppen.** Dette dokumentet bygger på Carmens DESIGN.md (12.11), med avklaringene fra prototypene v1–v4 (godkjent av gruppen 22.11) og det fra Sebastians DESIGN.md (13.11) som passer med Carmens visuelle retning. Prototypene v1–v4 er bygget på Carmens tokens, og derfor er det hennes farger og skrift som gjelder. Hva som kommer fra hvem, står i [kilder.md](kilder.md). Dette dokumentet og [EXPERIENCE.md](EXPERIENCE.md) går foran prototypen ved avvik. PRD-en går foran begge. `[ASSUMPTION]` markerer det gruppen ikke har bestemt.
>
> Visuell referanse: [prototypen v4](../ux-avklaringer-2026-11-22/prototype/index.html).

## Brand & Style

COSI - MRP er planleggerens arbeidsbenk, ikke et dashbord. Tallboksene øverst i resultatet er det eneste unntaket. Brukeren er en innkjøper eller planlegger uten MRP-bakgrunn, som skal finne det som krever handling og forstå hvorfor (PRD SM-3). Uttrykket er presist og rolig: kjølige, nesten nøytrale flater, tall som står tett og rett, og ingen pynt. Også introduksjonssiden og startsiden er arbeidsflater, ikke landingssider som skal overtale.

Bare to ting får farge. Petrol betyr «du kan gjøre noe her». De fem eksepsjonsfargene betyr «planen går ikke opp her». Alt annet er nøytralt. Unntaket er tallboksene øverst i resultatet: de står på en mørk petrolflate. Bare tallene som krever handling, har farge: kritiske deler og forfalt mengde, begge med symbol (● og «!»), så de ikke skilles med farge alene. Bestillingsforslag i uke 1 og i alt står i nøytral `summary-ink`. Det er slik mot-målet SM-C3 blir til design: tabellen skal ikke fylles med farger og symboler for å se informativ ut.

Skriften er IBM Plex, laget for teknisk dokumentasjon og industri. Den har tydelige tall og en smal variant til overskrifter som tar lite plass over brede tabeller.

Merkevaren er fri: gruppen har ikke gitt logo eller farger. Logoen er en petrolfirkant med to streker og ordet «COSI-MRP».

## Colors

Lys visning er standard. Mørk visning er med i v1, og brukeren bytter selv nederst i appmenyen (godkjent 22.11). Alle farger har en `-dark`-variant, og kontrasten kontrolleres i begge.

- **Flater (`{colors.surface-base}`, `{colors.surface-raised}`, `{colors.surface-sunken}`)** er kjølige gråtoner med et svakt blått skjær. Tabeller, paneler og kort står på `surface-raised`. Delens felt og tabellhodet står på `surface-sunken`.
- **Tekst (`{colors.ink-primary}`, `{colors.ink-secondary}`)**. `ink-secondary` brukes til metadata, radnavn, hjelpetekst og nuller i tabellen.
- **Linjer (`{colors.line}`)** skiller rader og paneler. `{colors.line-faint}` er bare for ikke-tekst (deaktivert, svake skiller). Den har for lav kontrast til tekst.
- **Petrol (`{colors.accent}`)** er eneste aksent: primærknapp, valgt celle, aktiv seksjon, lenker og fokusring. `{colors.accent-soft}` gir uke 1-kolonnen, valgt valg i radiogruppen og resultatlinjen i forklaringspanelet en svak bakgrunn.
- **Eksepsjonsfarger.** Hver type har en fast farge, en lys bakgrunnsvariant og et symbol:

  | Eksepsjon (ordbanken) | Farge | Symbol |
  |---|---|---|
  | Bestilling forsinket | `{colors.exc-critical}` | `!` |
  | Bruk av sikkerhetslager | `{colors.exc-warning}` | `S` |
  | Mottak forsinket | `{colors.exc-warning}` | `M` |
  | Kanseller mottak | `{colors.exc-info}` | `K` |
  | Ledetid overskrider horisont | `{colors.exc-horizon}` | `⧗` |

  `exc-critical` brukes også til negative tall, forfalt mengde og valideringsfeil. Ingen av disse fargene brukes til pynt. Eksepsjonsnivåene «kritisk» og «advarsel» finnes bare i kode, aldri i teksten i appen.
- **Kapasitet.** Årsaken til en begrensende del bruker `exc-warning` for Lager (`▤`) og `exc-horizon` for Ledetid (`⧗`), alltid med ordet ved siden av.
- **Endringer (`{colors.change-new}`)** markerer Nytt og Ny i endringslisten. Endret mengde bruker `exc-info`, og Fjernet og Borte er nøytrale og gjennomstreket. Rødt og grønt brukes aldri som motpar.
- **Tallboksene (`summary-*`)** har egne tokens. `summary-num-critical` og `summary-num-overdue` brukes bare til tallene for kritiske deler og forfalt mengde.
- **Fokus.** Fokusringen er 2 px `{colors.accent}` med 2 px avstand. På tallboksene er den `summary-ink` og ligger inne i boksen.

**Kontrast (WCAG 2.1 AA, lys / mørk):**

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
| `summary-num-overdue` på `summary-bg` (stor tekst, krav 3:1) | 3,5 | 6,3 |
| `line-faint` på `surface-raised` | 2,5 – **ikke til tekst** | 3,2 – **ikke til tekst** |

Kontrasten for de øvrige `summary-*`-parene og for `exc-*`-fargene som tekst rett på `surface-raised` er ikke regnet ut. Det gjøres før bygging `[ASSUMPTION]`.

## Typography

| Rolle | Token | Brukes til |
|---|---|---|
| Overskrift | `{typography.display}` | Sidetittel (h1) |
| Seksjon | `{typography.section}` | Kritiske deler, Bestillingsforslag, Endringer, Resultattabell, Produksjonskapasitet |
| Ferdigprodukt | `{typography.product}` | Navnet i kjøringslinjen |
| Brødtekst | `{typography.body}` | Veiledning, meldinger, forklaringspanel, knapper |
| Tabell | `{typography.table}` / `{typography.table-strong}` | Alle tall. `table-strong` til planlagte ordrefrigivelser og mengder i bestillingsforslag |
| Etikett | `{typography.label}` | Kolonneoverskrifter, små etiketter |
| Varenummer | `{typography.code}` | Alle varenummer, så de skilles fra mengder |

Regler:

- Alle tall har like brede sifre (`font-variant-numeric: lining-nums tabular-nums`), høyrejusteres og skrives med norsk tallformat: hardt mellomrom som tusenskille (som `Intl.NumberFormat('nb-NO')` gir), så tall aldri brytes over to linjer, og ekte minustegn «−» (U+2212).
- Overskrifter er smale (Condensed) og skrives i vanlig skrift, ikke versaler. Brødtekst og tabeller er vanlig bredde.
- Store tall bare i tallboksene (40 px, `summary-boxes`), i overskriften på introduksjonssiden (40 px) og for kapasitetstallet per uke i kapasitetspanelet. Ellers ingen store tall i kort.
- **Skriften selvhostes i appen** (IBM Plex har lisensen SIL OFL), og hentes ikke fra Google Fonts eller en annen ekstern kilde (NFR-4). Prototypen henter den fra Google Fonts, og det er greit der.
- Reservefonter: `system-ui, -apple-system, "Segoe UI", sans-serif` og `ui-monospace, Menlo, monospace`.

## Layout & Spacing

Skala: 4 / 8 / 12 / 16 / 20 / 24 px (`{spacing.1}`–`{spacing.6}`). Søskengrupper legges ut med `gap`, ikke marger.

- **Minste skjerm** er 1366 × 768 (NFR-6). Med nettleserens faner og adresselinje og Windows' oppgavelinje gir det et vindu på cirka 1366 × 630 px ved 100 % zoom. Alle krav om «uten rulling» gjelder det vinduet.
- **Siden:** appmenyen står fast til venstre, og hovedfeltet tar resten av bredden med `{spacing.gutter}` på sidene.
- **Introduksjonsside:** én stor flate øverst med overskrift, to korte avsnitt og «Kom i gang», og under den de tre stegene som tre bokser i én rad.
- **Startside:** h1 og setningen om ett ferdigprodukt per fil øverst. Under står tre nummererte kort: «Fyll ut Excel-malen» og «Last opp filen» side om side, og «Velg hva du vil beregne, og beregn» over hele bredden, med radiogruppen til venstre og Beregn til høyre. Opplastingssonen, radiogruppen og Beregn er synlige uten rulling i et vindu på 1366 × 630 px. Med valideringsfeil står feiloppsummeringen over kortene.
- **Resultat:** kjøringslinjen med seksjonsmenyen står fast øverst i hovedfeltet. Under står tallboksene, «Slik leser du resultatet» og seksjonene i én kolonne i fast rekkefølge (se EXPERIENCE.md). Når forklaringspanelet er åpent, blir arbeidsflaten to kolonner: tabellen tar resten, og panelet er `{spacing.panel-width}` bredt og står fast til høyre mens brukeren blar. Panelet skyver tabellen til side og legger seg ikke over den.
- **Tabeller:** radhøyde `{spacing.row-height}`. Tynne skillelinjer og ingen sebrastriper. Delene skilles med en tykkere linje over delens felt. Radene i en del har bare tynne linjer.
- **Faste kolonner (NFR-8):** delens felt og radnavnene står fast ved sidescroll, med ugjennomsiktig bakgrunn. Ukeoverskriften står fast ved loddrett rulling i tabellområdet.
- **Smal skjerm** (under 900 px): appmenyen legger seg øverst, panelet blir et ark nederst på skjermen (inntil 60 % av høyden), knappene i seksjonsmenyen brytes over flere linjer, og tallboksene legger seg under hverandre. Tabellen ruller sideveis i sitt eget område. Mobil er ikke et mål (NFR-6), men siden skal ikke knekke.
- **Tetthet** er fast for hele appen. Det finnes ingen bryter for tetthet i v1.

## Elevation & Depth

Hierarki kommer fra flate og linje, ikke skygge. Paneler, kort og tabeller står på `surface-raised` med `{colors.line}` rundt. Den eneste skyggen er på forklaringspanelet når det er et ark nederst på smal skjerm. Kapasitetspanelet skilles med tykkere ramme (2 px), ikke skygge. Bekreftelsen før sletting står i siden og svever ikke.

Bevegelse: forklaringspanelet glir inn fra høyre, og delen markeres kort etter et hopp fra kritiske deler. Med `prefers-reduced-motion` skifter alt uten bevegelse.

## Shapes

Små, presise hjørner: `{rounded.sm}` (3 px) for merkelapper, `{rounded.md}` (5 px) for knapper og meldingsbokser, `{rounded.lg}` (6 px) for tabellrammer, paneler og linjene i kritiske deler, `{rounded.xl}` (10 px) for kapasitetspanelet, «Slik leser du resultatet» og hele arbeidsflaten. `{rounded.full}` brukes bare på ukefilterets knapper og de runde knappene i seksjonsmenyen. Tallboksene har 16 px hjørner rundt hele raden, og introduksjonssidens flate har 12 px.

## Components

| Komponent | Visuell spesifikasjon |
|---|---|
| Appmeny | Fast kolonne til venstre. Logo (petrolfirkant med to streker) og «COSI-MRP» i `section`. Lenkene Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer og Veiledning i `body`, aktiv side på `surface-sunken` med fet tekst. Nederst står knappen «Bytt til mørk» / «Bytt til lys» med samme utseende som lenkene |
| Primærknapp | `{components.button-primary}`. Bare én per område: «Kom i gang» på introduksjonssiden, «Velg fil» og Beregn på startsiden, «Eksporter til Excel» i kjøringslinjen, «Til Ny kjøring» i veiledningen |
| Sekundærknapp | `{components.button-secondary}`. «Last ned Excel-malen», «Last ned testeksempel 01», «Last opp ny fil», «Lukk», «Slett», «Avbryt» |
| Introduksjonsside | Én stor flate øverst med 12 px hjørner: lys `accent-soft` (mørk: `summary-bg-dark`). Overskrift i 40 px, der andre linje står i `accent`, så to korte avsnitt i `ink-secondary` og primærknappen «Kom i gang». Under står de tre stegene som nummererte bokser på `surface-raised` |
| Startsidens kort | Tre kort på `surface-raised` med ramme i `line` og `{rounded.lg}`. Overskriften i `section` har stegnummeret i en liten petrolfirkant foran |
| Opplastingssone | Stiplet ramme i `line`, 8 px hjørner, «Slipp Excel-filen her», «eller» og primærknappen «Velg fil». Under: valgt filnavn og «Du kan laste opp én Excel-fil (.xlsx). Filen blir i nettleseren din.» i `ink-secondary`. Når en fil dras over, får sonen `accent-soft` og hel ramme i `accent` |
| Radiogruppe | Tre valg stablet loddrett, hvert med ramme i `line` og `{rounded.lg}`. Etiketten i `body` og hjelpeteksten under i `ink-secondary`. Valgt valg får ramme i `accent` og bakgrunn i `accent-soft` |
| Feiloppsummering | `{components.validation-summary}`: rød boks med «✕» og overskrift (sidens h1) med antall feil. Strukturfeil først, så verdifeilene som en vanlig tabell med kolonnene Ark, Sted, Felt og Feil |
| Kjøringslinje | Ferdigproduktets navn i `product`, varenummer i `code` ved siden av. Under: horisont, filnavn, tidspunkt og lagringsstatus i `label`-størrelse i `ink-secondary`. Knappene til høyre. Statusmeldinger (lagring blokkert, eksport) står her som tekst med «ⓘ» |
| Seksjonsmeny | `{components.section-button}`. Runde knapper nederst i kjøringslinjen. Antallet står i liten skrift i knappen. Aktiv seksjon har mørk fylt bakgrunn og fet tekst. Antallet for kritiske deler står i `exc-critical` og i fet skrift |
| Tallbokser | `{components.summary-boxes}`. Én rad med bokser på `summary-bg`, skilt med en tynn lys linje, med 16 px hjørner rundt hele raden. I hver boks står tallet (40 px, fet, like brede sifre), tittelen (14 px, halvfet, `summary-ink`) og én linje forklaring (12,5 px, `summary-ink2`). Bare tall som krever handling, har farge: `summary-num-critical` med «●» og `summary-num-overdue` med «!». Bestillingsforslag i uke 1 og i alt, endringer og alle tall som er 0, står i `summary-ink`. Ved peking blir boksen `summary-hover`, og fokusringen ligger inne i boksen |
| «Slik leser du resultatet» | `{components.howto-box}`. Sammenleggbar boks med overskriften i fet `body` og en nummerert liste i 14 px `ink-secondary` |
| Informasjonsboks | Flate på `surface-raised` med ramme i `line` og 4 px venstrekant i `accent`. Brukes til «Ingen kritiske deler …», «Første kjøring …», «Ingen endringer …» og tomme filtre |
| Linje i kritiske deler | `{components.critical-line}`. Ett kort per del på `surface-raised` med ramme i `line` og 4 px venstrekant i fargen til delens tidligste eksepsjon. Tre kolonner: varenummer i `code`, beskrivelse i fet og type og nivå i `ink-secondary`; eksepsjonsmerkene med setningen i vanlig språk og «Første bestillingsforslag: …» i `ink-secondary`; «Se forklaring →» i `accent`. Ved peking får rammen `accent` |
| Kritisk-flagg | «● Kritisk del» i `exc-critical` på `exc-critical-soft`, i delens felt |
| Eksepsjonsmerke | `exception-badge-*`: symbol i en liten firkant i eksepsjonsfargen, med typenavnet fra ordbanken og uken ved siden av, for eksempel «Bestilling forsinket · uke 1». Setningen i vanlig språk står under merket i `body`, ikke i merket. I tabellen vises bare symbolet (20 × 20 px). Typenavnet står alltid først |
| Bestillingsforslag | Tabell i et område med fast høyde og egen rulling. Kolonnene Frigivelsesuke, Varenummer, Beskrivelse, Mengde (`table-strong`, høyrejustert), «Innkjøp eller produksjonsordre» (merkelapp) og Forfalt. Uke 1-radene har `accent-soft`. Hjelpeteksten over står i `ink-secondary` |
| Merke for forfalt mengde | `{components.overdue-tag}`. En knapp med teksten «! 50 forfalt» i kolonnen Forfalt. Ingen ramme, men fokusring som alle knapper |
| Ukefilter | `{components.week-chip}`. «Alle uker» først, deretter «Uke 1» til «Uke H», hver med antall i `ink-secondary`. Linjen «Viser 3 av 12 forslag · Vis alle uker» står under knappene i 13,5 px, med lenken i `accent` |
| Endringsmerke | `change-tag-new` (Nytt, Ny), `change-tag-changed` (Endret mengde), `change-tag-removed` (Fjernet, Borte – gjennomstreket). Mengde som «130 → 205 (+75)» med pil i `ink-secondary`. Gruppeoverskriftene har antall i `ink-secondary` |
| Tegnforklaring | Én linje over resultattabellen i 12,5 px `ink-secondary`: de fem eksepsjonsmerkene med navn, kritisk-flagget og et eksempel på valgt celle |
| Delens felt | `{components.part-header}`: nivåmerkelapp (`0`, `.1`, `..2`) med tynn ramme, varenummer, beskrivelse i fet, så type, lager, SS, L og antall per overordnet del i `ink-secondary`. Innrykk 12 px per nivå. Kritisk-flagget står under beskrivelsen |
| Resultattabellcelle | `{components.result-table-cell}`. Nuller i `ink-secondary`. Valgt celle får 2 px innvendig ramme i `accent` og `accent-soft` bakgrunn. Radnavn og ukeoverskrift for valgt celle blir fete. Har den valgte cellen også fokus, vises fokusringen i tillegg |
| Eksepsjonsmarkør | Symbolet (20 × 20 px, `exception-badge-*`) står til venstre for tallet i cellen eksepsjonen gjelder, og cellen får eksepsjonens lyse bakgrunn. Raden følger tabellen i EXPERIENCE.md (Eksepsjonsmarkør: hvilken celle). Ingen egen rad for eksepsjoner |
| Filter for kritiske deler | Avkrysningsboks med etiketten «Vis bare kritiske deler» i 13,5 px, til høyre over tabellen |
| Forklaringspanel | `{components.explanation-panel}`. Overskrift: del og uke i `label`, verdien i `section`, og «Lukk» som sekundærknapp. Eksepsjonsmeldingene øverst i bokser med eksepsjonens lyse bakgrunn: merket med typenavn og uke, så setningen i vanlig språk, så «Melding:» og «Hvorfor:» med fet ledetekst. Så de fire lagene: svaret i `body`, utregningen som en tabell med to kolonner der siste linje (resultatet) står på `accent-soft` og fet, tallene som lenker, og regelen i en grå boks |
| «Gå til forklaringen» | Hopplenke øverst til venstre over tabellen, vist som sekundærknapp bare ved fokus |
| Kapasitetspanel | `{components.capacity-panel}`. Overskrift i `section`. Innledningen som fire korte punkter. Tegnforklaringen som to bokser side om side, hver med symbolet i en fylt, farget firkant (28 px) og ordet Lager eller Ledetid i fet. Kapasitetstallet i 16 px fet. Under tallet står den begrensende delen med symbolet (20 px) og ordet i årsakens farge, og varenummer og beskrivelse i 11,5 px `ink-secondary`. «Grunnlaget per del» som en vanlig tabell |
| Lagrede kjøringer | Én linje per ferdigprodukt på `surface-raised`: beskrivelse, varenummer i `code`, tidspunkt i `ink-secondary` og «Slett». Bekreftelsen står i linjen, med tekst og knappene «Slett» og «Avbryt» |
| Veiledning | Vanlig tekstside med nummererte overskrifter i `section`, brødtekst i `body` og primærknappen «Til Ny kjøring» nederst |

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Farge pluss symbol eller tekst for hver eksepsjon og status (FR-15, NFR-8) | Farge alene, eller farge på tall bare for å pynte, også i tallboksene |
| Petrol bare for det brukeren kan klikke på eller har valgt. Unntak: flaten bak tallboksene, der hver boks er en lenke | Petrol som bakgrunn på andre store flater eller som dekor |
| Samme fem eksepsjonsnavn og symboler som ordbanken og tabellen over | Egne korte navn, forkortelser eller nivånavn («kritisk», «advarsel») i teksten |
| Høyrejusterte tall med like brede sifre og norsk tallformat | Venstrejusterte tall eller proporsjonale sifre i tabeller |
| Nuller som «0» i `ink-secondary` | Nuller i `line-faint` (for lav kontrast), tomme celler eller streker for 0 |
| Radnavn uten tegn («Bruttobehov») | Fortegn i radnavn («− Bruttobehov», «= …») |
| Rolige flater, tynne linjer, ingen skygger | Kort med skygge rundt hver seksjon, sebrastriper, gradienter |
| Endringsmerker der Nytt er grønt, Endret mengde blått og Fjernet nøytralt | Rødt og grønt som motpar |
| Peking kan endre en ramme eller bakgrunn litt | At noe åpnes, eller at et verktøytips vises, ved peking (FR-18) |
| Kapasitetspanelet tydelig adskilt med ramme og overskrift (FR-34) | Samme utseende for kapasitet og bestillingsplan |
| Ukefilteret på bestillingsforslagene som eneste ukevisning (FR-17) | Egen ukeplan eller ukeoversikt ved siden av listen (fjernet 22.11) |
| Tallboksene som den eneste raden med store tall | Dashbord, grafer eller flere rader med tallkort |
| Lys og mørk visning i v1, med lys som standard og kontrasten kontrollert i begge | Farger som bare er kontrollert i den ene visningen |
| Skriften selvhostet i appen | Google Fonts eller en annen ekstern skriftkilde i appen (NFR-4) |
