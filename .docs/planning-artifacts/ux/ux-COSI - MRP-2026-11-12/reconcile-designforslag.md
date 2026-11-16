# Avstemming: designforslaget mot spinene

Kilde: [`../designforslag-2026-11-12.md`](../designforslag-2026-11-12.md) og prototypen. Spinene: [DESIGN.md](DESIGN.md), [EXPERIENCE.md](EXPERIENCE.md).

## Tatt med uendret

- Kravkartet (visning → FR) → EXPERIENCE.md, Information Architecture
- To sider, rekkefølgen på resultatsiden etter PRD §4.4 → EXPERIENCE.md, Information Architecture
- Planleggerens arbeidsbenk, farger (lys og mørk), IBM Plex, radhøyde 32 px, tabellreglene → DESIGN.md
- Fem eksepsjonstyper med farge og symbol → DESIGN.md, Colors og Components
- Kjøringslinje, seksjonsmeny med antall, ukefilter, liste over kritiske deler med hopp til tabellen → begge
- Forklaringspanelet til høyre, ark nederst på smal skjerm, Esc og «Lukk» → begge
- Kapasitetspanelet med ramme, to rader og begrensende del under tallet → begge
- «Synlig med én gang / bak et klikk / ikke i v1» → EXPERIENCE.md, Component Patterns og State Patterns
- Spørsmålene i designforslaget §7 → EXPERIENCE.md, Åpne designbeslutninger

## Endret eller presisert

| I designforslaget / prototypen | I spinene | Hvorfor |
|---|---|---|
| Nuller i `faint` (#9AA6B1) | Nuller i `ink-secondary` | Kontrast 2,48:1 er under WCAG AA 4,5:1 |
| Én knapp per celle i tabellen | WAI-ARIA grid med én tabulatorstopp `[ASSUMPTION]` | Sebastians research; 1000 rader gir titusenvis av tabulatorstopp (NFR-5) |
| Forklaringspanelet: utregning, regel, eksepsjon | Fire lag: svaret i én setning først, tall som lenker `[ASSUMPTION]` | Sebastians research (progressiv avsløring) |
| Mørk modus med i prototypen | Tokens beholdes, men ikke v1-krav `[ASSUMPTION]` | Sebastians research, SM-C1 |
| Ingen tilstander utover «Første kjøring» | 18 tilstander i EXPERIENCE.md | Krav fra NFR-9, NFR-10, FR-20, FR-30 |
| Ingen brukerreise for kapasiteten | UJ-5 `[ASSUMPTION]` | tilbakemelding-prd.md §4.2 |
| Ingen oppgaver for brukertesten | Tre oppgaver `[ASSUMPTION]` | tilbakemelding-prd.md §4.3 |

## Ikke tatt med

- Mørk modus som ferdig levert tema (se over).
- «Lagrede kjøringer» som egen side i appmenyen. Den peker til startsiden, der listen står.
- Den kvalitative ideen «uke 1 er uka brukeren handler i» er tatt med som svak bakgrunn i uke 1-kolonnen, men ikke som egen markering i bestillingsforslagene.
