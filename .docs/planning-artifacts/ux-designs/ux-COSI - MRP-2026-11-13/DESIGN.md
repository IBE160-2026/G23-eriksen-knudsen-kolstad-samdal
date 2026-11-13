---
name: COSI - MRP
description: Rolig, lys arbeidsflate for MRP-planlegging i nettleseren. shadcn/ui + Tailwind; denne fila gir merkevarelaget og produktets egne elementer. Bare lys modus i v1.
status: draft
updated: 2026-11-13
colors:
  # shadcn-roller (overstyrer shadcn-standardene)
  background: '#EFEDE4'            # stein: gulvet under brettene
  foreground: '#1D2420'
  card: '#FBFAF5'                  # kort: innholdet hviler her
  card-foreground: '#1D2420'
  popover: '#FBFAF5'
  popover-foreground: '#1D2420'
  primary: '#2F5A43'               # salviegrønn: lenker, primærknapper, valgt-ring (= selected-cell-ring)
  primary-foreground: '#FFFFFF'
  muted: '#E4E2D6'                 # = band
  muted-foreground: '#535E57'      # dempet tekst og nuller i Resultattabell
  accent: '#E3ECE0'                # = selected-cell (valgt tilstand i lister og radiogruppe)
  accent-foreground: '#1D2420'
  border: '#DAD8CC'                # skillelinje, bare pynt (1,4:1)
  input: '#74776B'                 # = edge: kanter som MÅ sees
  ring: '#7D5B1E'                  # fokusring på lyse flater
  destructive: '#A0302A'           # = exception-critical
  destructive-foreground: '#FFFFFF'
  # Produktets egne flater
  band: '#E4E2D6'                  # brett: seksjonens flate, overskriften ligger her
  edge: '#74776B'                  # 3:1-kant på brett, kort, stein, valgt og eksepsjonstint
  border-control: '#86887C'        # 3:1-kant på kort og stein, IKKE på brett
  divider-subtle: '#ECEADF'        # linjer mellom rader inne i et kort
  brass-line: '#8A6726'            # mørk messing som strek på lyst
  # Toppfelt (lag 1) og navigasjonsrad (lag 2)
  topbar: '#2C3A31'
  topbar-foreground: '#EEF0E8'
  topbar-muted: '#B4C0B5'
  topbar-divider: '#56655A'
  topbar-button: '#C9A862'         # lys messing, bare på mørkt
  topbar-button-foreground: '#1F2620'
  topbar-ghost-border: '#8C9A8F'
  topbar-ring: '#C9A862'           # fokusring på toppfelt og navigasjonsrad (5,3 / 4,2:1)
  navrow: '#3A4A3F'
  navrow-foreground: '#D2DBD1'
  navrow-active: '#FFFFFF'
  navrow-indicator: '#C9A862'
  # Valgt celle
  selected-cell: '#E3ECE0'
  selected-cell-ring: '#2F5A43'    # = primary
  # Eksepsjoner: to nivåer (alltid med ikon eller tekst, aldri farge alene)
  exception-critical: '#A0302A'    # nivå kritisk: Bestilling forsinket, Mottak forsinket (= destructive)
  exception-critical-soft: '#F6E2DE'
  exception-warning: '#8A4F0B'     # nivå advarsel (bare internt): Bruk av sikkerhetslager, Ledetid overskrider horisont, Kanseller mottak
  exception-warning-soft: '#F7E8D6'
  # Status: bare statusmeldinger, aldri eksepsjoner
  status-info: '#45586A'
  status-info-soft: '#E3EAEE'
  overdue: '#7E2F55'               # forfalt mengde
  overdue-soft: '#F2E2EA'
typography:
  display:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 36px
    fontWeight: '300'
    lineHeight: 44px
  error-heading:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 28px
    fontWeight: '300'
    lineHeight: 36px
  tray-heading:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: 0.01em
  panel-answer:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 21px
    fontWeight: '300'
    lineHeight: 30px
  drop-hint:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: '300'
    lineHeight: 28px
  brand:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 19px
    fontWeight: '700'
    letterSpacing: 0.06em
  topbar-context:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 18px
    fontWeight: '400'
  sheet-heading:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 24px
  status-line:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
  option-label:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
  panel-step:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
  button-large:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 17px
    fontWeight: '700'
  body:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  table:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
  small:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label:
    fontFamily: "'Source Sans 3', Corbel, Candara, 'Segoe UI', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
  numerals:
    note: 'Alle tall: font-variant-numeric: lining-nums tabular-nums. Høyrejustert i tabeller. Tall i lette overskrifter (300) settes i 400, fordi reserveskriften Corbel Light bare har gammeldagse tall.'
rounded:
  DEFAULT: 10px                    # shadcn --radius: kort, knapper, felt, slippsone
  lg: 14px                         # brett, forklaringspanel, feiloppsummering
  full: 9999px                     # merker og piller
spacing:
  # Tailwind-skalaen arves; dette er trinnene som brukes
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '6': 24px
  '8': 32px
  '12': 48px
  page-margin: 24px
  tray-gap: 16px
  tray-inset: 6px
  tray-head-top: 18px
  block-gap: 8px
  row-height: 40px
  topbar-height: 60px
  navrow-height: 48px
  panel-width: 400px
  col-varenummer: 76px
  col-beskrivelse: 132px
  col-rad: 196px
  col-uke: 76px
  button-pad-y: 9px
  button-pad-x: 16px
  button-large-pad-y: 11px
  button-large-pad-x: 28px
  radio-dot: 20px
  icon-lg: 24px
components:
  toppfelt:
    background: '{colors.topbar}'
    foreground: '{colors.topbar-foreground}'
    meta: '{colors.topbar-muted}'
    focus-ring: '{colors.topbar-ring}'
    height: '{spacing.topbar-height}'
  navigasjonsrad:
    background: '{colors.navrow}'
    foreground: '{colors.navrow-foreground}'
    active-foreground: '{colors.navrow-active}'
    indicator: '{colors.navrow-indicator}'
    focus-ring: '{colors.topbar-ring}'
    height: '{spacing.navrow-height}'
  statuslinje:
    foreground: '{colors.foreground}'
    link-underline: '{colors.brass-line}'
    critical-link: '{colors.exception-critical}'
    typography: '{typography.status-line}'
  brett:
    background: '{colors.band}'
    radius: '{rounded.lg}'
    inset: '{spacing.tray-inset}'
    heading: '{typography.tray-heading}'
    enter-offset: 8px
  kort:
    background: '{colors.card}'
    radius: '{rounded.DEFAULT}'
  veiledning:
    background: '{colors.card}'
    step-number-border: '{colors.brass-line}'
    step: '{typography.panel-step}'
    download-link: '{colors.primary}'
  bestillingsforslag-tabell:
    row-height: '{spacing.row-height}'
    header: '{typography.label}'
    hint: '{typography.small}'
    overdue-pill: '{colors.overdue}'
    overdue-pill-background: '{colors.overdue-soft}'
    overdue-pill-radius: '{rounded.full}'
  ukefilter:
    background: '{colors.card}'
    border: '{colors.edge}'
    radius: '{rounded.DEFAULT}'
  endringsliste:
    label-border: '{colors.border-control}'
    label-radius: '{rounded.full}'
  kritiske-deler-liste:
    row-divider: '{colors.divider-subtle}'
    critical-icon: '{colors.exception-critical}'
    warning-icon: '{colors.exception-warning}'
    link: '{colors.primary}'
    column-header: '{typography.label}'
  resultattabell:
    row-height: '{spacing.row-height}'
    typography: '{typography.table}'
    spine-background: '{colors.band}'
    block-separator: '{colors.edge}'
    block-gap-background: '{colors.background}'
    frozen-edge: '{colors.edge}'
    zero: '{colors.muted-foreground}'
    selected-background: '{colors.selected-cell}'
    selected-ring: '{colors.selected-cell-ring}'
    exception-marker-critical: '{colors.exception-critical}'
    exception-marker-critical-background: '{colors.exception-critical-soft}'
    exception-marker-warning: '{colors.exception-warning}'
    exception-marker-warning-background: '{colors.exception-warning-soft}'
  forklaringspanel:
    background: '{colors.band}'
    layer-background: '{colors.card}'
    width: '{spacing.panel-width}'
    radius: '{rounded.lg}'
    answer: '{typography.panel-answer}'
    step: '{typography.panel-step}'
    step-number-border: '{colors.brass-line}'
    motion-duration: 260ms
    motion-easing: 'cubic-bezier(.2,.7,.2,1)'
  slippsone:
    background: '{colors.card}'
    border: '{colors.edge}'
    radius: '{rounded.DEFAULT}'
    hint: '{typography.drop-hint}'
  radiogruppe:
    option-background: '{colors.card}'
    selected-background: '{colors.selected-cell}'
    selected-ring: '{colors.selected-cell-ring}'
    dot-border: '{colors.edge}'
    dot-selected: '{colors.primary}'
    dot-size: '{spacing.radio-dot}'
    label: '{typography.option-label}'
  knapp-primaer:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.DEFAULT}'
    padding-y: '{spacing.button-pad-y}'
    padding-x: '{spacing.button-pad-x}'
    large-typography: '{typography.button-large}'
    large-padding-y: '{spacing.button-large-pad-y}'
    large-padding-x: '{spacing.button-large-pad-x}'
  knapp-toppfelt:
    background: '{colors.topbar-button}'
    foreground: '{colors.topbar-button-foreground}'
    radius: '{rounded.DEFAULT}'
  knapp-toppfelt-ghost:
    background: 'transparent'
    foreground: '{colors.topbar-foreground}'
    border: '{colors.topbar-ghost-border}'
    radius: '{rounded.DEFAULT}'
  lenkeknapp-toppfelt:
    background: 'transparent'
    foreground: '{colors.topbar-muted}'
  knapp-dempet:
    background: '{colors.card}'
    foreground: '{colors.foreground}'
    border: '{colors.edge}'
    radius: '{rounded.DEFAULT}'
  knapp-destruktiv:
    background: '{colors.destructive}'
    foreground: '{colors.destructive-foreground}'
    radius: '{rounded.DEFAULT}'
  feiloppsummering:
    background: '{colors.exception-critical-soft}'
    radius: '{rounded.lg}'
    sheet-card: '{colors.card}'
    sheet-heading: '{typography.sheet-heading}'
    icon: '{colors.exception-critical}'
    icon-size: '{spacing.icon-lg}'
    heading: '{typography.error-heading}'
  statusmelding:
    background: '{colors.status-info-soft}'
    icon: '{colors.status-info}'
    foreground: '{colors.foreground}'
    radius: '{rounded.DEFAULT}'
  bekreftelsesdialog:
    background: '{colors.card}'
    radius: '{rounded.lg}'
  kapasitetspanel:
    background: '{colors.band}'
    radius: '{rounded.lg}'
    row-height: '{spacing.row-height}'
    intro: '{typography.body}'
---

# COSI - MRP: DESIGN

Visuelle referanser legges til ved Finalize; ved konflikt gjelder spine-dokumentene. Historiske utkast, ikke referanse: `.working/direction-4-objektside.html` (oppsettet på startsiden) og `.working/direction-5-lag-paa-lag.html` (uttrykket på resultatsiden).

## Brand & Style

COSI - MRP er et arbeidsverktøy for planleggere som sitter mye ved PC. Det skal være lett å jobbe i, lyst og innbydende, og det skal føles kult uten å være lekent. «Kult» betyr her rolig og eksklusivt: en varm lounge, ikke en hvit og kjedelig skjermside og ikke energisk. Første inntrykk skal ikke overvelde, og det viktige skal skilles fra støyen.

Uttrykket heter **Lag på lag**. Siden bygges av tre lyse toner som ligger oppå hverandre, stein, brett og kort, under en ramme i to mørke salvielag. Seksjoner skilles med flater, ikke med streker. Skriften er en humanistisk sans med lette overskrifter, og tallene står rett og like brede. Farge i selve arbeidsflaten betyr alltid noe (eksepsjon, forfalt, valgt), mens rammen rundt får bære temaet.

Merkevaren er helt fri: gruppa har ikke gitt logo, farger eller navn. Ordmerket er «COSI - MRP», som i ordbanken, med «MRP» i lys messing og lett vekt.

shadcn/ui + Tailwind er UI-systemet. Tokenene her utvider shadcn-standardene: shadcn-rollene får våre verdier, og produktets egne flater får egne tokener. Resultattabell og forklaringspanel bygges selv. Bare lys modus i v1, og mørk modus er utsatt (se EXPERIENCE.md, «Senere»).

**Register: Operate på alle flater, også startsiden.** Startsiden er en arbeidsflate, ikke en landingsside som skal overtale (Impeccable-registeret «Operate», ikke «Persuade»).

## Colors

Temaet heter **Salvie i to lag**: salvie- og messingpaletten i en ramme av to mørke lag over varm stein. Alle par under er sjekket mot WCAG 2.1 AA.

**Flatene.** `{colors.background}` (stein) er gulvet. `{colors.band}` (brett) er seksjonens flate, der overskriften ligger. `{colors.card}` (kort) er der innholdet hviler. De tre tonene har bevisst lav kontrast seg imellom (1,1–1,2:1) og er bare rytme. Alt som *må* sees, får en kant på minst 3:1.

**Kantene.** `{colors.edge}` er kanten som virker på alle lyse flater, også på brett, og brukes på felt, knapper, slippsone og mellom delblokkene i Resultattabell. `{colors.border-control}` holder 3:1 på kort og stein, men ikke på brett (2,77:1), så den brukes bare der. `{colors.border}` og `{colors.divider-subtle}` er pynt uten kontrastkrav.

**Rammen.** `{colors.topbar}` er lag 1 og `{colors.navrow}` er lag 2. Lys messing (`{colors.topbar-button}`, `{colors.navrow-indicator}`, `{colors.topbar-ring}`) brukes bare på mørkt. Mørk messing (`{colors.brass-line}`) er streken på lyst: stegnummer, understreking i statuslinja, nummer på lagene i forklaringspanelet.

**Fokus.** `{colors.ring}` er fokusringen på alle lyse flater. På toppfeltet og navigasjonsraden gir den bare 1,9:1 og 1,5:1, så der brukes `{colors.topbar-ring}` (5,3:1 og 4,2:1).

**Primær.** `{colors.primary}` er lenker, primærknapper og ringen rundt valgt celle og valgt radioknapp.

**Alias.** Noen tokener har bevisst samme verdi: `muted` = `band`, `accent` = `selected-cell`, `input` = `edge`, `primary` = `selected-cell-ring`, `destructive` = `exception-critical` og `topbar-ring` = `topbar-button` = `navrow-indicator`. Endres én, endres partneren også.

**Semantikk.** Fargene for eksepsjoner og status brukes aldri som pynt, og aldri alene: de står alltid sammen med ikon eller tekst (FR-15, NFR-8, SM-C3). Eksepsjoner har nøyaktig to nivåer, kritisk og advarsel. Alle fem typene krever handling (SM-C2), så ingen eksepsjon får en nøytral tone. Hver farge har én betydning:

| Token (tekst / tint) | Nivå | Betyr |
|---|---|---|
| `exception-critical` / `-soft` | kritisk | Bestilling forsinket, Mottak forsinket; feiloppsummering |
| `exception-warning` / `-soft` | advarsel | Bruk av sikkerhetslager, Ledetid overskrider horisont, Kanseller mottak |
| `status-info` / `-soft` | – | Bare statusmeldinger (lagring blokkert, lagret kjøring slettet, eksport feilet). Aldri eksepsjoner |
| `overdue` / `-soft` | – | Forfalt mengde i bestillingsforslag |

Nivånavnene «kritisk» og «advarsel» er interne og brukes bare i tokener og kode. De står aldri i teksten i appen eller i tilgjengelige navn. Der står typenavnet (se EXPERIENCE.md, Voice and Tone, og ordbanken, «Eksepsjonsnivå»).

Endringsliste bruker ingen farge for etikettene, og aldri rødt og grønt.

**Kontrast for de viktigste parene (WCAG 2.1 AA):**

| Par | Forhold | Krav |
|---|---|---|
| `foreground` på `card` / `background` / `band` | 15,2 / 13,5 / 12,2 | 4,5 |
| `foreground` på `exception-critical-soft` / `exception-warning-soft` / `status-info-soft` / `overdue-soft` | 12,7 / 13,2 / 13,0 / 12,7 | 4,5 |
| `muted-foreground` på `card` / `background` / `band` | 6,5 / 5,8 / 5,2 | 4,5 |
| `primary` på `card` / `band` | 7,5 / 6,1 | 4,5 |
| `primary` på `exception-critical-soft` / `exception-warning-soft` | 6,3 / 6,6 | 4,5 |
| `primary-foreground` på `primary` | 7,9 | 4,5 |
| `topbar-foreground` / `topbar-muted` på `topbar` | 10,4 / 6,4 | 4,5 |
| `topbar-muted` på `navrow` | 5,0 | 4,5 |
| `topbar-button-foreground` på `topbar-button` | 6,8 | 4,5 |
| `topbar-ghost-border` på `topbar` | 4,1 | 3 |
| `navrow-foreground` / `navrow-active` på `navrow` | 6,6 / 9,4 | 4,5 |
| `navrow-indicator` på `navrow` | 4,2 | 3 |
| `ring` på `card` / `band` / `background` / `selected-cell` | 5,9 / 4,8 / 5,3 / 5,1 | 3 |
| `ring` på `exception-critical-soft` / `exception-warning-soft` / `overdue-soft` | 5,0 / 5,2 / 5,0 | 3 |
| `topbar-ring` på `topbar` / `navrow` | 5,3 / 4,2 | 3 |
| `edge` på `band` / `card` / `exception-critical-soft` | 3,5 / 4,4 / 3,7 | 3 |
| `border-control` på `card` | 3,5 | 3 |
| `foreground` på `selected-cell`; `selected-cell-ring` på `selected-cell` | 13,1; 6,5 | 4,5; 3 |
| `exception-critical` på `-soft` / `card` / `band` / `background` | 5,7 / 6,8 / 5,5 / 6,1 | 4,5 |
| `exception-warning` på `-soft` / `card` / `band` | 5,5 / 6,3 / 5,0 | 4,5 |
| `status-info` på `-soft` / `card` | 6,0 / 7,0 | 4,5 |
| `overdue` på `-soft` / `card` | 7,0 / 8,3 | 4,5 |
| `destructive-foreground` på `destructive` | 7,1 | 4,5 |
| `brass-line` på `card` / `band` | 5,0 / 4,0 | 3 |

## Typography

Én familie: **Source Sans 3** (SIL OFL 1.1), selvhostet som variabel fil (vekt 200–900), aldri hentet fra Google Fonts (NFR-4). Den er humanistisk som Corbel, har ekte lette vekter, OpenType `tnum` og `lnum` og fullt norsk tegnsett. Reserveskrifter: Corbel, Candara, Segoe UI, system-ui.

| Rolle | Token | Brukes til |
|---|---|---|
| Display | `{typography.display}` | h1 på startsiden |
| Feiloverskrift | `{typography.error-heading}` | overskriften i feiloppsummering |
| Brettoverskrift | `{typography.tray-heading}` | h2 i hvert brett |
| Svar | `{typography.panel-answer}` | lag 1 i forklaringspanelet |
| Slipphint | `{typography.drop-hint}` | «Slipp Excel-fila her» i slippsonen |
| Ordmerke / kontekst | `{typography.brand}`, `{typography.topbar-context}` | toppfeltet |
| Arknavn | `{typography.sheet-heading}` | arknavnet i kortene i feiloppsummering |
| Statuslinje | `{typography.status-line}` | statuslinja på resultatsiden |
| Valgetikett | `{typography.option-label}` | etiketten i radiogruppen |
| Steg | `{typography.panel-step}` | lag 2 i forklaringspanelet, stegene i veiledningen |
| Stor knapp | `{typography.button-large}` | Beregn |
| Brødtekst | `{typography.body}` | tekst, navigasjonsrad, knapper |
| Tabell | `{typography.table}` | alle tabeller |
| Liten | `{typography.small}` | hjelpetekst, tabellhint |
| Etikett | `{typography.label}` | merker, piller, tabellhoder |

Vekter: 300 for store overskrifter og svarsetningen, 400 for brødtekst, 700 bare for valgspeiling (aktiv lenke, valgt celle, valgt radioknapp) og tall som skal fram. Overskrifter skrives i vanlig skrift, ikke versaler. Alle tall bruker `{typography.numerals}`. Tallformat: hardt mellomrom som tusenskille (som `Intl.NumberFormat('nb-NO')` gir), så tall aldri brytes over to linjer, og ekte minus «−» (U+2212). Differanser skrives med fortegn i parentes: «(+75)», «(−75)».

## Layout & Spacing

Tailwind-skalaen arves. Trinnene som brukes, er 4 · 8 · 12 · 16 · 24 · 32 · 48. Hovedfeltet har `{spacing.page-margin}` marg, brettene står `{spacing.tray-gap}` fra hverandre, og kortet ligger `{spacing.tray-inset}` inne i brettet. Overskriften har `{spacing.tray-head-top}` luft over seg.

**Minste skjerm** er 1366 × 768 (NFR-6). Med nettleserens felt og Windows' oppgavelinje gir det i praksis et vindu (viewport) på cirka 1366 × 630 px ved 100 % zoom, og alle mål på «uten rulling» gjelder det vinduet, ikke skjermen.

**Resultatsiden** er én kolonne med brett i fast rekkefølge. Bestillingsforslag, Resultattabell og Kapasitetspanel får alltid full bredde. **Endringer og Kritiske deler** står side om side i to like kolonner bare når forklaringspanelet er lukket og vinduet er minst 1366 px bredt. Med panelet åpent, i smalere vinduer og ved zoom over 100 % stables de, Endringer først. Uten Endringer får Kritiske deler full bredde. Forklaringspanelet (`{spacing.panel-width}`) står til høyre og skyver hovedfeltet. Det legger seg ikke over. Panelet står fast under toppfeltet og ruller selv.

**Startsiden** har en smalere kolonne. Veiledningen står øverst. Under den står slippsonen og radiogruppen «Hva vil du beregne?» side om side. Målet er at slippsonen, radiogruppen og Beregn ses uten rulling i et vindu på 1366 × 630 px. Veiledningen kan delvis ligge over dem i rulleposisjon. Det sjekkes i nøkkelskjermene.

**Tabellmål.** Radhøyden er `{spacing.row-height}` i alle tabeller. Faste kolonner i Resultattabell: `{spacing.col-varenummer}`, `{spacing.col-beskrivelse}` og `{spacing.col-rad}`, deretter `{spacing.col-uke}` per uke. Toppfeltet er `{spacing.topbar-height}` høyt og navigasjonsraden `{spacing.navrow-height}`.

**Rulleområdet for Resultattabell.** Tabellen ligger i sitt eget rulleområde i brettets kort, som ruller i begge retninger. Området fyller høyden fra under brettoverskriften til bunnen av vinduet (vinduet minus toppfelt, navigasjonsrad og brettoverskrift). Ukeoverskriften og de faste kolonnene står fast inne i området. Oppførselen står i EXPERIENCE.md, Component Patterns › Resultattabell.

Tettheten er fast for hele appen. Det finnes ingen bryter for tetthet i v1.

## Elevation & Depth

Dybden kommer fra lagene, ikke fra skygger: stein, så brett, så kort. `box-shadow` brukes bare som innfelt ring for fokus og valg. Toppfeltet og navigasjonsraden er de to mørke lagene over alt det lyse. Bekreftelsesdialogen er det eneste som svever, og den beholder shadcn-standardens skygge og overlegg.

Bevegelse følger lagene. Forklaringspanelet glir inn fra høyre (`components.forklaringspanel.motion-duration` og `motion-easing`) mens hovedfeltet trekker seg sammen like mykt. Brettene tones inn `components.brett.enter-offset` nedenfra første gang de vises. Messingstreken i navigasjonsraden glir mellom lenkene. Med `prefers-reduced-motion` skifter alt uten bevegelse.

## Shapes

Store, myke hjørner gir loungepreget. `{rounded.lg}` brukes på brett, forklaringspanel, feiloppsummering og dialog. `{rounded.DEFAULT}` (shadcn `--radius`) brukes på kort, knapper, felt og slippsone. `{rounded.full}` brukes på små merker: eksepsjonsmarkør, forfalt-knappen og endringsetiketter. Forklaringspanelet har runde hjørner bare mot hovedfeltet.

## Components

shadcn-elementer som brukes med våre tokener og ellers uendret: Button, RadioGroup, Select, Switch, Collapsible, AlertDialog. Sheet og Drawer brukes ikke (de er modale). Resultattabell og forklaringspanel bygges selv.

**Toppfelt (med navigasjonsrad).** Lag 1 (`{colors.topbar}`): ordmerket, en tynn skillestrek i `{colors.topbar-divider}` og konteksten, det vil si ferdigproduktets beskrivelse og varenummer i `{typography.topbar-context}`, for eksempel «Kontorstol Basic (100-002)», og «Horisont: 10 uker» og «Beregnet 13.11.2026 kl. 08:04» i `{colors.topbar-muted}`. Handlingene står til høyre: «Slett lagret kjøring» som lenkeknapp-toppfelt, «Last opp ny fil» som knapp-toppfelt-ghost og «Eksporter til Excel» som knapp-toppfelt, begge med ikon. Lag 2 er **navigasjonsraden** (`{colors.navrow}`) med ankerlenker i `{colors.navrow-foreground}`. Antallet står etter lenketeksten i `{typography.label}` og `{colors.topbar-muted}`. Aktiv lenke får `{colors.navrow-active}`, vekt 700 og en 3 px messingstrek (`{colors.navrow-indicator}`) med runde topphjørner nederst. Fokus i begge lagene vises med `{colors.topbar-ring}`. På startsiden har lag 1 bare ordmerket.

**Statuslinje.** Én linje i `{typography.status-line}` rett under toppfeltet, med lenker skilt av «·» i `{colors.muted-foreground}`. Lenkene står i tekstfarge med 2 px understreking i `{colors.brass-line}`. Lenken til kritiske deler står i `{colors.exception-critical}` med understreking i samme farge. På startsiden er statuslinja en enkel tekstlinje i `{colors.muted-foreground}` ved siden av «Beregn».

**Brett og kort.** Brettet er `{colors.band}` med `{rounded.lg}`. Overskriften i `{typography.tray-heading}` ligger i brettet, med antallet i parentes i `{colors.muted-foreground}` og vekt 400. Til høyre i brettoverskriften står eventuelle filtre. Kortet (`{colors.card}`, `{rounded.DEFAULT}`) ligger `{spacing.tray-inset}` inne i brettet. Brett og kort har ingen kant og ingen skygge.

**Veiledning.** Øverst på startsiden: et brett med overskriften «Slik gjør du det» og ett kort med tre nummererte steg. Nummeret står i en sirkel med kant i `{colors.brass-line}`, som lagene i forklaringspanelet, og stegteksten i `{typography.panel-step}`. Nedlastingene står i steg 1 som lenker i `{colors.primary}` med nedlastingsikon og filnavnet i `{colors.muted-foreground}`: «Last ned Excel-malen» (`COSI-MRP-mal.xlsx`) og «Last ned testeksempel 01» (`testeksempel-01.xlsx`). Setningen om ett ferdigprodukt per fil står under stegene i `{typography.small}`.

**Bestillingsforslag-tabell (med ukefilter).** En enkel tabell i kortet: Varenummer, Beskrivelse, Frigivelsesuke, Mengde, Ordretype («Innkjøp» eller «Produksjonsordre», i tekst). Øverst i kortet, over tabellen, står hjelpeteksten i `{typography.small}` og `{colors.muted-foreground}` (teksten står i EXPERIENCE.md). Tabellhodet står i `{typography.label}`, versaler med 0,04 em sperring i `{colors.muted-foreground}`, over en linje i `{colors.border}`. Radene skilles med `{colors.divider-subtle}`. Tall er høyrejustert. Forfalt mengde vises som en liten knapp etter mengden: en pille med ikon og teksten «50 forfalt» i `{colors.overdue}` på `{colors.overdue-soft}`, `{rounded.full}`. Den har ingen kant, men har fokusring som alle knapper. **Ukefilteret** er en shadcn Select i brettoverskriften med etiketten «Vis» foran, `{colors.card}`-flate og kant i `{colors.edge}`. Når filteret er aktivt, står «Viser 3 av 12 forslag · Vis alle uker» i `{typography.small}` over tabellen, rett under filteret.

**Endringsliste.** Kortet har én gruppe per type (Bestillingsforslag, Eksepsjoner, Deler). Gruppeoverskriften står i `{typography.table}`, vekt 700, med antallene i vekt 400 og `{colors.muted-foreground}` («1 nytt, 7 endret mengde»). Hver linje begynner med en etikett: en pille med kant i `{colors.border-control}`, tekst i `{colors.foreground}` og ingen fylling. Etikettene i en gruppe er like brede (bredden til den lengste, «Endret mengde»), så linjene står på linje. Endret mengde skrives «130 → 205 (+75)». Linjer som kan velges (se EXPERIENCE.md), har varenummer og beskrivelse som lenke i `{colors.primary}`. Uketekst står i `{colors.muted-foreground}`. Brettoverskriften sier hvilke kjøringer som sammenlignes («13.11 kl. 07:31 → 08:04»).

**Kritiske deler-liste.** Over lista står kolonneoverskriftene «Del · Eksepsjon · Uke» i `{typography.label}` og `{colors.muted-foreground}`. Én rad per del (minst 44 px), i to linjer. Første linje: ikon, varenummer og beskrivelse som lenke i `{colors.primary}`, eksepsjonstypene i typens farge, og uka til høyre i `{colors.muted-foreground}`. For uke «–» står teksten «hele delen». Andre linje: klartekstlinja i `{typography.table}` og `{colors.foreground}`, og «Se forklaring →» til høyre i `{colors.primary}`. Radene skilles med `{colors.divider-subtle}`. Ikonene er forskjellige for de to nivåene (trekant for kritisk i `{colors.exception-critical}`, skjold for advarsel i `{colors.exception-warning}`), så nivået ikke leses av fargen alene. Har delen eksepsjoner på begge nivåene, får raden ikonet og fargen til kritisk, som merket i ryggen. Sirkelikonet er forbeholdt statusmeldingen.

**Resultattabell.** En semantisk tabell i `{typography.table}`, radhøyde `{spacing.row-height}`, i sitt eget rulleområde (se Layout & Spacing). Over tabellen står ferdigproduktets beskrivelse og horisonten (også som `<caption>`) og hintet «Velg et tall (klikk eller Enter) for forklaring». Under tabellen står tegnforklaringen i `{typography.small}`: markøren med «1 eksepsjon i cellen», merket «Kritisk del» og en valgt celle, hver med sitt eget tegn. Filteret «Vis bare kritiske deler» står i brettoverskriften.

Hver del er én blokk på seks rader. Varenummer og beskrivelse står i en **rygg** i `{colors.band}` som spenner over alle seks radene. Under beskrivelsen står nivået med ordlistens notasjon («0», «.1», «..2») og typen, i `{typography.label}` og `{colors.muted-foreground}`. **En kritisk del** får merket «Kritisk del» i ryggen: ikon og tekst i `{typography.label}` vekt 700, i fargen til delens mest alvorlige nivå (kritisk foran advarsel). Merket står på delnivå i tillegg til markørene i cellene (FR-16). Radnavnene står i `{colors.card}`. Mellom blokkene er det en 2 px strek i `{colors.edge}` og `{spacing.block-gap}` luft i `{colors.background}`. Inne i blokken er det ingen streker og ingen sebrastriper. Peking endrer bare musepekeren (`cursor: pointer` på celler, radnavn og rygg), ikke bakgrunnen på raden.

Ukeoverskriften står fast øverst i rulleområdet, med 2 px strek i `{colors.edge}` under seg. Varenummer, beskrivelse og radnavn står fast til venstre, og høyre kant av de faste kolonnene har en 2 px strek i `{colors.edge}` (ingen skygge). Faste celler har ugjennomsiktig bakgrunn. **Nuller** vises som «0» i `{colors.muted-foreground}`. Negative tall står i tekstfarge.

**Eksepsjonsmarkøren** er en liten pille til venstre i cellen, med nivåets ikon og antall i `{typography.label}` vekt 700, i nivåets farge på nivåets tint: `{colors.exception-critical}` på `{colors.exception-critical-soft}` eller `{colors.exception-warning}` på `{colors.exception-warning-soft}`. Markøren står i nettobehov-raden for Bestilling forsinket, Bruk av sikkerhetslager og Mottak forsinket, og i raden Planlagte mottak for Kanseller mottak (tabellen står i EXPERIENCE.md). Eksepsjoner for hele delen (uke «–») får markøren i ryggen ved beskrivelsen. Har cellen flere eksepsjoner med ulike nivåer, får markøren fargen til kritisk. **Valgt celle** får `{colors.selected-cell}` og en 3 px innfelt ring i `{colors.selected-cell-ring}`. Tallet står i vekt 700, og ukeoverskriften og radnavnet speiler valget med vekt 700.

**Forklaringspanel.** En `<aside>`, `{spacing.panel-width}` bred, i `{colors.band}` med `{rounded.lg}` mot hovedfeltet. Overskriften står i `{typography.tray-heading}`, og «Lukk» med tasten `Esc` vist som knapp-dempet. Overskriften har ingen liten tekst over seg. Har cellen en eksepsjon, står **eksepsjonskortet først**, rett under overskriften og over lag 1: et eget kort i nivåets tint, med ikon og typenavnet i vekt 700 i nivåets farge, så meldingen i `{typography.body}` og en linje som begynner med «Hvorfor:» i vekt 700. Kortet har ingen farget sidekant. Er cellen uten eksepsjon, men delen er kritisk, står i stedet én linje i nivåets tint øverst: ikon, «Hjul har 1 eksepsjon: Bestilling forsinket, uke 1» i `{colors.foreground}` og lenken «Vis» i `{colors.primary}`.

Så følger fire lag i hvert sitt kort: et nummer i en sirkel med kant i `{colors.brass-line}`, lagets navn i `{typography.label}`, og så innholdet. Lag 1 Svar står i `{typography.panel-answer}`, med nøkkeltallet i vekt 700. Lag 2 Utregning er en nummerert liste med steg i `{typography.panel-step}`, ett steg per linje med tallene satt inn, for eksempel «Disponibel beholdning = 80 + 0 − 100 = −20» og så «Nettobehov = maks(0, 30 − (−20)) = 50». Etiketten står til venstre og resultatet til høyre. Bare steg som faktisk er en sum, får en strek i `{colors.edge}` over summen. `maks(…)` skrives ut som i PRD-formelen, og «regnes på nytt» (fremskyndet mottak) er et eget steg med den nye verdien. Lag 3 Tallene er en liste med lenker og verdier. Lag 4 Regel er én setning og lenken «Ordliste».

**Ordliste** vises i samme panel: lenken «← Tilbake til forklaringen» i `{colors.primary}` øverst, overskriften «Ordliste» i `{typography.tray-heading}`, og én oppføring per begrep i et kort, med begrepet i vekt 700 og forklaringen i `{typography.body}`. Oppføringen som ble valgt, står øverst.

**Slippsone.** Et kort med 2 px stiplet kant i `{colors.edge}` og `{rounded.DEFAULT}`. Innholdet står midtstilt: filikon i `{colors.primary}`, «Slipp Excel-fila her» i `{typography.drop-hint}` (pynt, ikke instruksjon), knapp-primaer «Velg fil», og to linjer synlig hjelpetekst i `{typography.small}` og `{colors.muted-foreground}`. Når en fil dras over, får sonen `{colors.selected-cell}` og hel kant i `{colors.selected-cell-ring}`.

**Radiogruppe «Hva vil du beregne?».** Tre valgkort i rad, hvert i `{colors.card}` med `{rounded.DEFAULT}`. Hvert kort har en sirkel (`{spacing.radio-dot}`, 2 px kant i `{colors.edge}`), en etikett i `{typography.option-label}` og én linje hjelpetekst i `{typography.small}`. Valgt kort får `{colors.selected-cell}`, en 2 px innfelt ring i `{colors.selected-cell-ring}`, fylt prikk i `{colors.primary}` og etikett i vekt 700.

**Knapper.** Alle knapper har `{rounded.DEFAULT}`, `{typography.body}` og innvendig luft `{spacing.button-pad-y}` / `{spacing.button-pad-x}`:

| Variant | Utseende | Brukes til |
|---|---|---|
| knapp-primaer | `{colors.primary}`, hvit tekst, vekt 700 | Beregn (større: `{typography.button-large}`, luft `{spacing.button-large-pad-y}` / `{spacing.button-large-pad-x}`), Velg fil |
| knapp-toppfelt | lys messing, mørk tekst, vekt 700, ikon | Eksporter til Excel |
| knapp-toppfelt-ghost | gjennomsiktig, kant i `{colors.topbar-ghost-border}`, ikon | Last opp ny fil |
| lenkeknapp-toppfelt | understreket tekst i `{colors.topbar-muted}` | Slett lagret kjøring |
| knapp-dempet | `{colors.card}`, kant i `{colors.edge}` | Lukk (panel), Avbryt (dialog) |
| knapp-destruktiv | `{colors.destructive}`, hvit tekst | Slett (dialog) |

Fokus på alle elementer: 2–3 px ring med 2–3 px avstand i flatens egen farge (`ring-offset-color` = flaten under). På lyse flater er ringen `{colors.ring}`. På toppfeltet og navigasjonsraden er den `{colors.topbar-ring}`, og avstanden i `{colors.topbar}` eller `{colors.navrow}` skiller ringen fra den messingfargede knappen Eksporter til Excel. Alt som kan klikkes, har `cursor: pointer`.

**Små elementer.**
- **«Gå til forklaringen»:** en hopplenke som bare vises ved fokus, som knapp-dempet øverst til venstre i Resultattabell-brettet.
- **«Vis alle uker» og «Vis alle deler»:** tekstlenker i `{colors.primary}` i linja «Viser … av …», i `{typography.small}`.
- **Tegn for fremskyndet mottak og forfalt ordremottak:** et lite tegn i cellen med tilgjengelig navn. Formen prøves i prototypen mot SM-C3 og er ikke låst.
- **Sammenslått visning** (bare hvis ytelsen krever det): én rad per del i `{spacing.row-height}`, med ryggen, eksepsjonsmarkøren og første uke med eksepsjon. Knappene «Fold ut alle» og «Fold sammen alle» er knapp-dempet i brettoverskriften.

**Feiloppsummering.** Et brett i `{colors.exception-critical-soft}` med `{rounded.lg}`. Øverst står et feilikon (`{spacing.icon-lg}`) i `{colors.exception-critical}` og overskriften i `{typography.error-heading}`, med antall feil i vekt 700 og `{colors.exception-critical}`, og en linje brødtekst under. Strukturfeil står først, i et kort med full bredde og overskriften «Fila følger ikke malen». Under det ligger verdifeilene i lyse kort, ett per ark, to i bredden. Kortet har arknavnet i `{typography.sheet-heading}` med antallet i `{colors.muted-foreground}`, og så én linje per feil: et lite ikon, stedet i vekt 700 og årsaken. Et kort med mange linjer foldes som shadcn Collapsible med antallet i knappen. Brettet har ingen farget sidekant.

**Statusmelding.** En rolig linje i et kort i `{colors.status-info-soft}` med sirkelikon i `{colors.status-info}` og tekst i `{colors.foreground}`. Den står rett under statuslinja, eller øverst i hovedfeltet når siden ikke har statuslinje. Den har ingen lukkeknapp, ingen skygge og ingen bevegelse. Statusmeldingen er det eneste som bruker denne tonen.

**Bekreftelsesdialog.** shadcn AlertDialog med `{colors.card}`, `{rounded.lg}`, tittelen i `{typography.tray-heading}`, én setning brødtekst og knappene Slett (knapp-destruktiv) og Avbryt (knapp-dempet).

**Eksport.** Ingen visuell spesifikasjon i appen utover knappen Eksporter til Excel. Formateringen av arkene i Excel-fila bestemmes i arkitekturen.

**Kapasitetspanel.** Samme farger, skrift og tokener som resten, men det skal ikke kunne forveksles med bestillingsplanen (FR-34). Et eget brett med overskriften som spørsmål («Hvor mange ferdigprodukter kan være ferdige?»). Under overskriften står en innledende tekst i `{typography.body}`, ikke bare i liten skrift: FR-34-setningen og setningen om at sikkerhetslageret holdes av. Første kort viser de to radene «Fra lager» og «Med planlagte mottak», én kolonne per uke, med radhøyde `{spacing.row-height}` og samme tallformat som Resultattabell. Radnavnene har en annen stil enn de seks radene i Resultattabell, og panelet har ingen rygg, så de to radene aldri ser ut som MRP-rader. Begrensende deler står med årsaken i tekst under hver rad. Andre kort viser tabellen per del. [OPEN: avgjøres i kapasitetsskissen: det visuelle skillet fra bestillingsplanen og hvordan begrensende deler markeres per uke og rad.]

## Do's and Don'ts

| Do | Don't |
|---|---|
| Skill seksjoner med flatene stein, brett og kort | Streker, rammer eller skygger rundt brett og kort |
| Bruk `{colors.edge}` på alt som må sees på brett | `{colors.border-control}` på brett (2,77:1) |
| Lys messing bare på mørkt, mørk messing som strek på lyst | Messing som fyllfarge på lyse flater |
| `{colors.topbar-ring}` for fokus på toppfelt og navigasjonsrad | `{colors.ring}` på mørke flater (under 3:1) |
| Semantisk farge alltid med ikon eller tekst | Farge alene for eksepsjon, kritisk del eller endring |
| Rolige etiketter (Nytt, Endret mengde, Fjernet, Ny, Borte) uten farge | Rødt og grønt i endringslista |
| To eksepsjonsnivåer, kritisk og advarsel, bare i tokener og kode | Nøytral eller blågrå tone på en eksepsjon, nivånavn i teksten i appen |
| `cursor: pointer` på alt som kan klikkes | Endret bakgrunn, verktøytips eller noe som åpnes ved peking |
| Nuller som dempet «0» | Tomme celler eller streker for 0 |
| Tall med `lining-nums tabular-nums`, høyrejustert | Gammeldagse tall eller proporsjonale tall i tabeller |
| Lette overskrifter (300), vanlig skrift | Versale brett- og kortoverskrifter, små kickertekster over titler |
| Myk rødtone og lyse kort i feiloppsummeringen | Tykk farget sidekant på meldinger, feil eller eksepsjoner |
| Nøkkeltall som tekst i statuslinja | Store tallkort, dashbord eller grafer øverst |
| Én fast radhøyde (`{spacing.row-height}`) i alle tabeller | Sebrastriper eller streker inne i en delblokk |
| Radnavn uten tegn («Bruttobehov») | Fortegn i radnavn («− Bruttobehov», «= …») |
| Skrift selvhostet fra appen | Google Fonts eller annen ekstern skriftkilde |
