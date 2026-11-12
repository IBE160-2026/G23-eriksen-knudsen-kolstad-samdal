# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G23 – G23-eriksen-knudsen-kolstad-samdal |
| **PRD vurdert** | `.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/prd.md` (status i frontmatter: final, sist endret 2026-11-09, commit bd7235b), med `addendum.md` |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

Dette er en sterk PRD med en tydelig tese (MRP-prosessen skal være korrekt, etterprøvbar og forståelig), 34 FR-er med testbare konsekvenser knyttet til fasitfiler, og ærlige ikke-mål. Risikoen er størrelsen: 34 FR-er og 11 NFR-er, der kapasitetsfunksjonen kom inn 2026-11-09, med frist 15. desember og ennå ingen UX, arkitektur eller epics.

## 2. Dette fungerer godt

- **FR-ene kan bli testtilfeller direkte.** FR-8: «300-003 Hjul (L = 1) i testeksempel 01 har frigivelse 175 i uke 1 (50 forfalt + 125 vanlig)». NFR-2 krever fasiter kontrollert for hånd, ikke laget med appens egen kode. Slik kan KI-generert kode kontrolleres.
- **Avveininger er synlige.** FR-7 kaller seg «en bevisst forenkling», og addendumet begrunner valget mot SAP, Oracle og Dynamics. SM-C1–C3 balanserer målene, og §7.1 sier «kuttes det som kommer sist, først».
- **Avgrensningen passer emnet.** §6: «Appen bruker ikke KI eller språkmodeller». Da faller spørsmål om kostnad, nøkler og testmodus bort. NFR-4 og NFR-9 viser at dere har tenkt på dataflyt og feilsituasjoner.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet – er valg og avveininger synlige? | sterk | Datert beslutningsspor og ett reelt åpent spørsmål (§9 nr. 4). |
| Substans – er innholdet fortjent, eller «pynt»? | sterk | Én persona (Kari) som driver hver reise, og NFR-er med tall og tester. |
| Strategisk sammenheng – har PRD-en en tese som funksjonene tjener? | god | Kjernen følger tesen. Kapasitetsfunksjonen (§4.9) er et sent tillegg uten brukerreise. |
| Testbarhet – vet man når hvert FR er ferdig? | sterk | Alle FR-er har testbare konsekvenser. Svakest er SM-3. |
| Scope og avgrensning – er utelatelser eksplisitte? | god | Ikke-mål er tydelige, men v1 er stor og mangler en minstegrense. |
| Brukbarhet for neste fase – kan UX, arkitektur og stories hente fra den? | god | Ordlisten er konsekvent og ID-ene løser seg. Kapasiteten har ingen UJ, og FR-rekkefølgen hopper. |
| Formtilpasning – passer PRD-formen produktet? | god | Fire UJ-er og ordliste passer, men dokumentet er langt (ca. 8 500 ord). |

## 4. Viktigste forbedringer

### 4.1 Sett en tydelig minstegrense for v1
- **Alvorlighet:** høy
- **Hvor:** §7.1 «Strekker ikke tiden til, kuttes det som kommer sist, først.»
- **Problem og hvorfor det betyr noe:** Rekkefølgen finnes, men ikke hvor grensen går. Kapasiteten (FR-30–34) er den mest krevende beregningen (addendumet: 2 × H søk med mange nettinger), og kom inn fire uker før fristen, i tillegg til brukertest, Mac-test av Excel og fem testeksempler. Uten avtalt grense tas kuttbeslutningen i stress.
- **Forslag:** «Minstekrav for innlevering: trinn 1–3 i §7.1 (FR-1–FR-23) bestått mot SM-1, SM-2 og SM-4. Trinn 4 og 5 startes bare hvis trinn 1–3 er testet innen [dato].» Merk FR-30–34 og FR-24–26 med `[KUTTES FØRST]`.

### 4.2 Koble kapasiteten til en brukerreise
- **Alvorlighet:** medium
- **Hvor:** §4.9, FR-30–34 har ingen «Gjelder UJ». Addendumet: «Ingen brukerreise dekker kapasiteten ennå».
- **Problem og hvorfor det betyr noe:** UX vet ikke når Kari velger kapasitet, hva hun ser først, eller hva hun gjør med svaret.
- **Forslag:** UJ-5: «Kari får en hasteforespørsel. Hun laster opp filen og velger bare produksjonskapasitet, leser raden fra lager og raden med planlagte mottak, ser at gassfjær begrenser på grunn av lager, og ringer leverandøren.» Skriv «Gjelder UJ-5» under FR-30–34. En kort FR-oversikt først i §4 hjelper også, siden FR-28 står etter FR-5 og FR-29 etter FR-12.

### 4.3 Gjør SM-3 og brukertesten målbare
- **Alvorlighet:** medium
- **Hvor:** SM-3 «Etter en kort introduksjon finner og forklarer alle testpersonene en kritisk del … uten hjelp»
- **Problem og hvorfor det betyr noe:** «Kort introduksjon» og «uten hjelp» kan tolkes ulikt. Dette er det eneste suksessmålet uten fasit eller tallgrense, og testen har ingen dato.
- **Forslag:** «Hver testperson løser tre oppgaver: (1) finn en kritisk del, (2) forklar en eksepsjon med egne ord, (3) les av mengde og frigivelsesuke for ett bestillingsforslag. Løst = riktig svar innen 3 minutter uten hjelp. Mål: alle løser alle. Feiler to eller flere på samme oppgave, endres teksten eller layouten.» Sett også dato.

### 4.4 Gi FR-6 et regneeksempel i selve kravet
- **Alvorlighet:** medium
- **Hvor:** FR-6 «regnes det første senere mottaket som fremskyndet til uke t»
- **Problem og hvorfor det betyr noe:** Kjernen i beregningen er tett tekst med to beholdningsbegreper (beholdning(t−1) og forventet lagerbeholdning), og konsekvensene viser til filer. Her er risikoen størst for at Claude Code tolker regelen annerledes enn dere mener.
- **Forslag:** Et lite eksempel under regelen: «SS 0, lager 20, brutto 0/0/60/0, mottak 100 i uke 4. Uke 3: disponibel = −40, nettobehov 40, mottaket fremskyndes til uke 3, planlagt ordremottak uke 3 = 0.» Sjekk tallene mot `beregn()`.

### 4.5 Hold teknologivalg utenfor kravene
- **Alvorlighet:** lav
- **Hvor:** NFR-3 «publisert på Vercel», NFR-10 «nettleserens lokale lagring»
- **Problem og hvorfor det betyr noe:** Kravene sier selv at rammeverk velges i arkitekturen, men hosting og lagring er allerede bundet.
- **Forslag:** Skriv atferd: «Opplastede filer forlater aldri brukerens maskin» og «Siste kjøring finnes etter at nettleseren er lukket». La Vercel og `localStorage`/IndexedDB stå i arkitekturen.

## 5. Mekaniske funn

- **ID-er:** FR-1–34, NFR-1–11, SM-1–7, SM-C1–C3 og UJ-1–4 er unike og fullstendige, og krysshenvisningene jeg sjekket løser seg. FR-ene står ikke i tallrekkefølge (se 4.2).
- **Glossar:** Konsekvent bruk av «del», «eksepsjon» og «prognostiserte behov». FR-31–34 skriver bare «kapasiteten», mens ordlisten har «Produksjonskapasitet».
- **Antagelser:** §10 sier ingen er igjen, og det stemmer med addendumet. Status er `final` med ett åpent spørsmål (§9 nr. 4), og det står tydelig.
- **Sensitive opplysninger:** Ingen funnet.

## 6. Før dere går videre

**Må avklares før UX, arkitektur og epics:**
- Hvor går minstegrensen for v1, og hvem avgjør kuttet og når (4.1)?
- Hvilken brukerreise eier kapasitetspanelet (4.2)?
- Hvem har Mac og Excel til NFR-11-testen?

**Kan vente:** brukertestens oppgaver og dokumentasjon (sett datoen nå), og måling av NFR-5 (testfilen på 1000 rader finnes ikke ennå, ifølge addendumet).

**Oppfølging av briefen:** Ja. Endring midtveis er løst (FR-19–21, UJ-3), eksepsjonstypene er listet (FR-9–12, FR-29), avviket om partistørrelse og antall deler er ryddet, fasiter finnes, beregningen er skilt ut (NFR-1), og partistørrelse er egen utvidelse.

## 7. Refleksjonsspørsmål

1. Kapasitetsfunksjonen kom fra et utkast og ble tatt inn i v1 samme dag. Hvilke kriterier brukte dere for å vurdere om den passet i omfanget, og hvordan sjekket dere at KI-assistenten ikke bare gjorde den større enn nødvendig?
2. En referanseberegning (`beregn()`) har laget fasitene, mens NFR-2 krever at de er kontrollert for hånd. Hvilke fasittall kontrollerte dere selv, og fant dere feil som KI-en hadde gjort?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._
