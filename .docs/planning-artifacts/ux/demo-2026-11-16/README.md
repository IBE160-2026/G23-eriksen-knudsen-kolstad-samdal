# UX-forslag til gruppemøtet 16.11.2026

**Carmens foretrukne UX-forslag: `cosi-mrp-b-mork-samlet.html`.** Det er et forslag og er ikke godkjent av gruppen.

Prototypen bygger på det opprinnelige mørke Design B (dashboard). Den samler hele brukerreisen i én nettside med felles sidemeny og delt tilstand. Innlogging og bedriftskonto er med som en tydelig merket demonstrasjon av en mulig fremtidig versjon.

## Slik åpner du den

Prototypen må åpnes via en lokal server fra prosjektroten. Da virker nedlasting av malen og testeksemplene, som Safari ikke tillater fra `file://`.

```
cd <prosjektroten>
python3 -m http.server 8765 --bind 127.0.0.1
```

Åpne http://localhost:8765/.docs/planning-artifacts/ux/demo-2026-11-16/cosi-mrp-b-mork-samlet.html

Det trengs ingen installasjon, innlogging eller nettilgang. Prototypen henter ingenting fra internett.

### Forslag til gjennomgang i møtet

1. **Introduksjon** → «Kom i gang».
2. **Ny kjøring**: last opp `testdata/testeksempel-01.xlsx` (dra inn eller velg fil).
3. **Resultat** → **Ukeplan** (velg en uke) → **Detaljer** (klikk en celle for forklaringen, eller en del).
4. **Lagrede kjøringer** og **Veiledning**.
5. Endringer: last opp `testeksempel-02.xlsx` og så `testeksempel-03.xlsx` (samme produkt). Da vises **Endringer** i menyen.
6. Kapasitet: «Prototypevalg» → «Med produksjonskapasitet», og velg «Bestillingsplan og produksjonskapasitet» før du laster opp testeksempel 01.
7. Fremtidig: «Logg inn» i menyen eller på introduksjonen, og «Opprett bedriftskonto».

## Innhold

### MVP-funksjoner (i tråd med PRD-en)

| Side | Adresse | Innhold |
|---|---|---|
| Introduksjon | `#/intro` | Mørk blågrønn introduksjon med «Kom i gang» og et dekorbilde av dashboardet (produksjon, innkjøp og oppfølging). Vises ved første besøk. |
| Ny kjøring | `#/start` | Last ned Excel-malen, last opp den utfylte fila, valg av hva som skal beregnes, kontroll med valideringsfeil. |
| Resultat | `#/resultat` | Nøkkeltall i et mørkt felt, «Krever oppfølging» og neste steg. |
| Ukeplan | `#/ukeplan` | Mørk tavle med produksjon, innkjøp og forhold som krever oppfølging per uke, og hva som skal gjøres i valgt uke. |
| Detaljer | `#/tabell`, `#/del/<varenr>` | Full MRP-tabell med forklaringspanel, og detaljer for én del. |
| Endringer | `#/endringer` | Hva som er endret siden forrige kjøring av samme produkt. Vises bare når det finnes en forrige kjøring. |
| Kapasitet | `#/kapasitet` | Produksjonskapasitet. Vises bare når kapasiteten er valgt. |
| Lagrede kjøringer | `#/lagret` | Siste kjøring per ferdigprodukt, lagret i nettleseren. |
| Veiledning | `#/veiledning` | Hvordan malen fylles ut. |

Arbeidsflatene (tabeller, lister og skjemaer) er lyse for lesbarhet. Sidemenyen, introduksjonen, nøkkeltallene og ukeplanen beholder det mørke uttrykket fra Design B.

### Fremtidige forslag (ikke MVP)

Alt dette er merket «Fremtidig» i prototypen. PRD §7.2 setter innlogging, brukerkontoer og flere bedrifter som videreutvikling. I v1 skjer alt i nettleseren uten innlogging (NFR-4).

| Side eller element | Adresse | Innhold |
|---|---|---|
| Logg inn | `#/logg-inn` | Innlogging med Microsoft-konto eller e-post. |
| Opprett bedriftskonto | `#/ny-bedrift` | Tre steg: bedrift, din profil, bekreft. |
| Bedrift og profil i menyen | (etter innlogging) | Bedriftsnavn øverst og profil nederst i sidemenyen, med menyer. |
| Delte kjøringer | `#/lagret` (innlogget) | Egne kjøringer og fiktive kollegers kjøringer, merket «Delt med bedriften». |

«Kom i gang» fører fortsatt rett til Ny kjøring uten innlogging, slik MVP skal fungere.

## Hva som bare er simulert

- **Ingen beregning.** Den opplastede fila leses ikke. Alle tall er forhåndsdefinerte testdata fra de håndkontrollerte fasitene. Hvilke testdata som vises, avgjøres av filnavnet: «02» eller «03» gir Kontorstol Pro, alle andre `.xlsx` gir testeksempel 01 (Kontorstol Basic).
- **Valideringsfeil** vises bare når de slås på under «Prototypevalg».
- **Eksport til Excel** er en demonstrasjon.
- **Lagrede kjøringer** lagres i nettleserens `localStorage` med egne nøkler (`cosi-b-mork-samlet-*`), så de blandes ikke med andre prototyper.
- **Innlogging og bedriftskonto** er bare en visning. Brukeren og bedriften er fiktive (Kari Nordmann, Eksempel Produksjon AS). Passordfeltet er deaktivert, feltene kan ikke endres, og innloggingen finnes bare i minnet i fanen. Ingenting sendes eller lagres, og det er ingen ekte autentisering eller server.
- **Kollegenes kjøringer** og menyvalg som «Bytt bedrift», «Inviter kolleger» og «Min profil» er fiktive og viser bare en melding.

## Filer prototypen trenger

Prototypen er én HTML-fil med all CSS og JavaScript inne i seg, pluss disse filene i repoet:

| Fil | Brukes til |
|---|---|
| `../konsepter-2026-11-12/felles.js` | Testdata og beregningsoppsett for testeksempel 01 (lastes som skript, påkrevd) |
| `../konsepter-2026-11-12/data-kontorstol-pro.js` | Testdata for Kontorstol Pro, testeksempel 02 og 03 (lastes som skript, påkrevd) |
| `testdata/COSI-MRP-mal.xlsx` | «Last ned malen» |
| `testdata/testeksempel-01.xlsx`, `-02.xlsx`, `-03.xlsx` | Nedlastingslenker til testeksemplene |
| `../konsepter-2026-11-12/brukerreise-v3.html`, `../resultatkonsepter-2026-11-15/konsept-b-ukeplan.html` | Bare lenker i prototypelinjen øverst («Bygger på …») |

## Tidligere designvarianter

Prototypen bygger på disse filene. De beholdes lokalt som arbeidsgrunnlag, men legges ikke på GitHub, slik at gruppen bare ser ett forslag:

- `cosi-mrp-demo.html`: den første samlede prototypen uten eget designlag.
- `design-a-minimal.html`: A, lys og minimalistisk.
- `design-b-dashboard.html`: det opprinnelige mørke Design B, som er grunnlaget for det foretrukne forslaget.
- `design-b2-dempet.html`: B2, lys og dempet variant av B. Ikke valgt.
- `design-c-premium.html`: C, premium SaaS. Ikke valgt.
- `cosi-mrp-b-konto.html`: B2 med innlogging. Erstattet av det foretrukne forslaget, som har samme kontofunksjoner i det mørke uttrykket.

## Til avklaring i gruppen

1. Godtar gruppen det mørke Design B som visuell retning?
2. Skal appen ha en introduksjonsside? Den finnes ikke i PRD-en, og SM-3 forutsetter at alle testpersonene får samme introduksjon (PRD §8.1 og §9 nr. 4).
3. Skal Resultat (oppsummering) og Ukeplan være egne sider? EXPERIENCE.md-utkastet og PRD §4.4 beskriver én resultatside.
4. Skal eksepsjonene vises med det offisielle navnet fra ordbanken og en setning i vanlig språk, slik prototypen gjør?
5. Skal menyen bruke ordene «Resultat», «Ukeplan», «Detaljer» og «Krever oppfølging»? Godkjennes de, legges de inn i ordbanken.
6. Innlogging og bedriftskonto: skal dette tas med som et mulig neste trinn? Det krever server, database og personvernvurdering, og må i så fall inn i PRD-en og arkitekturen som en ny versjon.
