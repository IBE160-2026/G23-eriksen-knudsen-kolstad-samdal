# Avvik mellom UX-prototypen (v3) og PRD-en, ordbanken og UX-dokumentene

Laget 17.11.2026 for Odas prototype `ux-prototype-2026-11-17-v3` med standardvalgene.

**Kilder:**
- PRD final 13.11 (`prds/prd-COSI - MRP-2026-10-19/prd.md`), med `addendum.md` og `beslutninger-2026-11-13.md`
- Ordbanken (`.docs/ordbank.md`)
- Carmens `DESIGN.md` og `EXPERIENCE.md` (12.11, «utkast – må godkjennes av gruppen», finnes bare på `Carmen/Branch`)

**!** betyr at et viktig dokument må oppdateres hvis gruppen velger løsningen slik den er i prototypen. Uten «!» trengs ingen endring, eller dokumentene sier ingenting om saken.

## Avvik

| | Tema (U-nr.) | Prototypen | Hva dokumentene sier | Må oppdateres |
|---|---|---|---|---|
| **!** | Rekkefølgen i resultatet (U14) | Kritiske deler står først, deretter Bestillingsforslag, Endringer, Resultattabell og Ukeplan. Boksene og knappene følger samme rekkefølge. | PRD §4.4: brukeren ser først bestillingsforslagene, så kritiske deler, så tabellen. UJ-2: «Først ser hun på bestillingsforslagene». UJ-1 nevner dem i samme rekkefølge. EXPERIENCE.md bruker rekkefølgen fra PRD-en. | PRD §4.4, UJ-1, UJ-2 og EXPERIENCE.md. Velger gruppen «Bestillingsforslag først» under Prototypevalg, trengs ingen endring. |
| **!** | Ukeplan (U5) | Ukeplanen står nederst i resultatet. | FR-17: «Det er ingen egen ukevisning i tillegg til listen.» EXPERIENCE.md har ingen ukeplan. | FR-17 (og EXPERIENCE.md), eller så fjernes ukeplanen. |
| **!** | Introduksjonsside og startside (U6) | Introduksjonen er en egen side som vises første gang. Malen og testeksempel 01 lastes ned fra Ny kjøring, og teksten om én fil per ferdigprodukt står der. Lagrede kjøringer er en egen side. | FR-27 og UJ-1: malen lastes ned og veiledningen leses «fra appens startside». PRD-en har ingen introduksjonsside. EXPERIENCE.md samler veiledning, nedlasting, valg, opplasting og lagrede kjøringer på startsiden. | FR-27 og UJ-1 må si hvilken side som er startsiden. EXPERIENCE.md (skjermlisten). |
| **!** | Ord i grensesnittet som mangler i ordbanken (U8) | Introduksjon, Ny kjøring, Resultat, Lagrede kjøringer, Ukeplan, Sammendrag, Frigivelsesuke og Bestillingsplan | «Frigivelsesuke» (FR-17) og «Bestillingsplan» (FR-30) står i PRD-en, men ikke i ordbanken. De andre ordene står ingen steder. CLAUDE.md krever at nye begreper legges inn i ordbanken. | Ordbanken |
| **!** | «Sammendrag» (U8) | Boksene med tall øverst i resultatet heter «Sammendrag» (skjermleser) | I PRD-en er «sammendraget» FR-16, sammendraget av kritiske deler. UJ-2: «Sammendraget viser fire kritiske deler.» I prototypen heter den seksjonen «Kritiske deler». | Ordbanken eller FR-16 må skille mellom de to, eller boksene må få et annet navn. |
| **!** | Eksepsjonstekst A, vanlig språk først (U2) | Standardvalget viser først korte navn som «Kommer for sent» og under dem typenavnet fra ordbanken. | Ordbanken (merknad 3) og PRD §4.3 har faste typenavn. De korte navnene finnes ikke. | Ordbanken, hvis A velges. Med B (offisielt typenavn først) trengs ingen endring. |
| **!** | «Krever oppfølging» (U3) | Kan velges under Prototypevalg. Standard er «Kritiske deler». | PRD FR-13 og FR-16 og ordbanken: «Kritisk del» | Bare hvis gruppen velger det: ordbanken og PRD FR-13 og FR-16 |
| **!** | Standardvalg for beregning (U11) | Bestillingsplan | PRD-en sier ingenting om standardvalget. EXPERIENCE.md: «Bestillingsplan og produksjonskapasitet (standard)». | EXPERIENCE.md |
| **!** | Fire bokser og runde knapper (nytt i v3) | Fire bokser med tall øverst og en rad med runde knapper for seksjonene | PRD-en sier ingenting om dem. EXPERIENCE.md nevner en «seksjonsmeny» i tabulatorrekkefølgen, men ikke boksene med tall. Mot-målet SM-C3: ikke fyll med farger og symboler for å se informativ ut. | EXPERIENCE.md (komponentene). Gruppen bør vurdere om de fargede tallene går mot SM-C3. |
| **!** | Lys og mørk (U7) | Begge finnes. Lys er standard. | DESIGN.md: lys er standard, og mørk modus er ikke et krav i v1. Carmens valgte retning (v3 Design B) er mørk. | DESIGN.md, hvis gruppen velger mørk. |
| | Én resultatside (U1) | A: én lang side. B: utvidbare seksjoner. | PRD-en bruker ikke uttrykket. FR-34 sier bare «på samme side». Ordbanken sier «Ikke bruk» om «resultatside». | Ingen endring. Gruppen må avklare. |
| | Hvor Endringer står (U9) | Etter Bestillingsforslag | PRD-en sier det ikke. EXPERIENCE.md har den samme plasseringen. | Ingen |
| | Startvalget for ukefilteret (U4) | Alle uker | PRD-en sier det ikke. UJ-2 («når hun filtrerer på uke 1») passer med «Alle uker». | Ingen. Se det åpne punktet om brukertesten. |
| | Filteret «Vis bare kritiske deler» (U10) | Finnes i tabellen | Står ikke i PRD-en. FR-16 sier at kritiske deler ikke flyttes øverst, og filteret flytter dem ikke. | Ingen. Kan føres inn i FR-16. |
| | Hvilken rad bærer eksepsjonsmarkøren (U12), og ordlyden i meldingene (U13) | Sebastians kobling og forslag til tekst | FR-15 og FR-13: ordlyden er ikke et krav, bare opplysningene. | Ingen |
| | Mobil | Prototypen virker på smal skjerm. | NFR-6: ikke tilpasset mobil i v1 | Ingen. Prototypen gjør mer enn kravet. |
| | Introduksjonen til brukertesten | Introduksjonssiden kan brukes. | PRD §9 nr. 4 er fortsatt åpent og skal avgjøres før prøvetesten rundt 27.11. | PRD §9 nr. 4 når gruppen bestemmer seg |

## Kontrollert uten avvik

- **Resultattabellen** følger FR-14 og FR-15:
  - seks rader per del
  - stykklisterekkefølge
  - én tabell for en felles del
  - eksepsjoner markert med symbol og farge
  - eksepsjoner med uke «–» vist ved delens navn
- **Kritiske deler (FR-16):** antall, liste med eksepsjonstyper, og hopp til delen i tabellen.
- **Bestillingsforslag (FR-17):** sortert etter frigivelsesuke, med innkjøp eller produksjonsordre, merket forfalt mengde og ukefilter.
- **Forklaringspanelet (FR-18):** står ved siden av tabellen, åpnes ved klikk eller Enter (aldri ved peking) og står til det lukkes.
- **Før/etter-sammenligning (FR-20):** «Ingen endringer» når samme fil lastes opp to ganger.
- **Slette lagret kjøring (FR-21):** finnes.
- **Startsiden (FR-27):** nedlasting av malen og testeksempel 01, og «Hver fil gjelder ett ferdigprodukt …».
- **Hva vil du beregne? (FR-30):** med bare kapasitet vises ingen tabell eller eksportknapp, og kjøringen lagres ikke. Om kapasiteten holdes utenfor eksporten når begge er valgt, kan ikke sjekkes, fordi eksporten bare er en knapp i prototypen.
- **Kapasitetspanelet (FR-34):** eget panel med egen overskrift. Det sier at ledetid er med, men ikke prognostiserte behov, og begrensende deler har årsak og symbol.
- **Faste kolonner (NFR-8)** og **melding når lagring er blokkert (NFR-10)**.
- **Ingen innlogging** (§7.2).

## Annet funnet under gjennomgangen

- **!** `.docs/planning-artifacts/architecture/technology.md` beskriver et annet prosjekt (Pytagoras-nettsiden med Stripe, Vipps og Supabase), ikke COSI - MRP. Fila bør fjernes eller erstattes før arkitektursteget.
- Carmens `EXPERIENCE.md` og `DESIGN.md` finnes bare på `Carmen/Branch`, ikke på `main`. Det er ikke avgjort hvilken UX som er gjeldende.
