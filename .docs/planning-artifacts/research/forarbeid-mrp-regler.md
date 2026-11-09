---
title: Forarbeid til research – MRP-regler for forfalte ordrer, eksepsjoner og horisont
status: klar for bmad-deep-recon
created: 2026-11-02
updated: 2026-11-02
type: academic-lit + domain
---

# Forarbeid til research: MRP-regler

Dette er innspill til `bmad-deep-recon`. Det beskriver beslutningen vi står foran og spørsmålene researchen skal svare på. Innholdet her er **ikke kilde**: hvordan vi gjør det i dag, er bare med for å vise hva som skal sjekkes, ikke hva som er riktig.

**Slik starter du:** Åpne en ny kontekst og skriv for eksempel:

> /bmad-deep-recon run academic-lit på `.docs/planning-artifacts/research/forarbeid-mrp-regler.md`

Velg **Draft** i stedet for Run hvis du vil kjøre prompten i ChatGPT, Gemini eller Perplexity og så bruke Process på rapporten.

## Beslutningen

Før PRD-en ferdigstilles og `beregn()` utvides til flere nivåer, skal gruppen G23 avgjøre om tre sett med regler i PRD-utkastet stemmer med vanlig MRP-praksis i lærebøker og ERP-systemer:

1. Hvordan forfalte frigivelser og forfalte ordremottak behandles (FR-7, FR-8, fasitregel 6 og 7)
2. Hvilke eksepsjonstyper appen skal ha, og hvordan de virker sammen med lot-for-lot (FR-9 til FR-13)
3. Hvordan planhorisonten forholder seg til samlet ledetid gjennom en stykkliste med tre nivåer (FR-5, FR-8, FR-9, FR-28)

Er en regel feil, må PRD-en, fasitene i `testdata/` og `beregn()` endres før arkitekturen lages. Resultatet skal stå som begrunnelse i PRD-ens `addendum.md`.

## Hvordan vi gjør det i dag (bare for å vise hva som skal sjekkes)

Varianten er tidsfaset MRP, ukebøtter, lot-for-lot, horisont H på 8–12 uker, ett ferdigprodukt, inntil tre nivåer og felles deler beregnet på lavnivåkode.

- **Forfalt frigivelse (FR-8):** Hvis t − L < 1, legges frigivelsen i uke 1 sammen med vanlige frigivelser for uke 1.
- **Forfalt ordremottak (FR-7):** Mottaket vises likevel i uke t, der behovet er, selv om det tidligst kan komme i uke 1 + L. Forventet lagerbeholdning forutsetter altså at behovet dekkes i tide, og avviket vises bare som eksepsjon.
- **Eksepsjoner (FR-9 til FR-12):**
  - «Ledetid overskrider horisont»: L ≥ H, uansett behov.
  - «Bestilling forsinket»: nettobehov > 0, forfalt frigivelse og disponibel < 0.
  - «Bruk av sikkerhetslager»: nettobehov > 0, forfalt frigivelse og 0 ≤ disponibel < SS.
  - «Mottak forsinket»: nettobehov > 0 og et planlagt mottak i en senere uke. Appen foreslår å fremskynde mottaket.
- **Horisont (FR-8, FR-9):** Frigivelser for behov etter horisonten tas ikke med. Det finnes ingen kontroll av samlet ledetid gjennom nivåene.
- **Mangler i dag:** eksepsjoner for å utsette eller kansellere et planlagt mottak, og eksepsjon ved brudd på sikkerhetslager når frigivelsen ikke er forfalt.

## Forskningsspørsmål

### A. Forfalte ordrer og forventet lagerbeholdning
1. Hvordan behandler standardlitteraturen en planlagt ordrefrigivelse som skulle vært gjort før planstart (past-due release)? Legges den i periode 1, i en egen «past due»-kolonne, eller noe annet?
2. Hvilken uke vises tilhørende planlagt ordremottak i: behovsuken eller tidligste realistiske mottaksuke (1 + L)? Hvordan påvirker valget forventet lagerbeholdning (projected available balance)?
3. Hvordan viser SAP (MRP-liste og eksepsjonsmeldinger), Odoo og en eller to andre systemer dette til planleggeren?

### B. Eksepsjonstyper (action/exception messages)
4. Hvilke typer action messages beskriver litteraturen (for eksempel release, reschedule in, reschedule out, cancel, past due, lead time exceeds horizon, safety stock violation)? Hvilke anses som minimum for et nyttig MRP-system?
5. Når et planlagt mottak kommer for sent: lager MRP normalt *både* en ny planlagt ordre og en melding om å fremskynde mottaket, eller antar den at mottaket fremskyndes (firm planned / scheduled receipt)? Hvordan unngår systemene at behovet dekkes to ganger?
6. Hvordan begrunnes antall og typer meldinger for å unngå støy (nervous system, alert fatigue)?

### C. Horisont og samlet ledetid i flere nivåer
7. Hvilken regel gjelder for planhorisont mot samlet ledetid (cumulative lead time, critical path) gjennom stykklisten? Hva skjer med behov for delene nederst når horisonten er for kort?
8. Hvordan behandles behov i slutten av horisonten (end-of-horizon effect) for deler på lavere nivå?
9. Bekrefter litteraturen at felles deler beregnes én gang på lavnivåkoden med samlet bruttobehov, og at forfalte frigivelser på nivå .1 gir bruttobehov i periode 1 for nivå ..2?

## Hva vi trenger tilbake

For hvert spørsmål: hva litteraturen sier og hva systemene gjør, med kilde og årstall, og om det er uenighet mellom kilder. Til slutt en kort liste over hvilke av reglene over som stemmer, som avviker men kan forsvares som forenkling i et studentprosjekt, og som bør endres.

## Kilder

**Foretrekkes:**
- Jacobs, Berry, Whybark og Vollmann, *Manufacturing Planning and Control for Supply Chain Management*
- Ptak og Smith, *Orlicky's Material Requirements Planning* (3. utg.)
- ASCM/APICS Dictionary
- Offisiell dokumentasjon fra SAP (exception messages i MRP), Odoo MRP og ERPNext
- Fagfellevurderte artikler om MRP-nervøsitet og planhorisont

**Unngå:** leverandørblogger uten kilder og innhold generert av KI.

**Krav:** To uavhengige kilder for hver regel som en anbefaling bygger på. Lærebokstoff har ingen krav til hvor nytt det er, men sjekk om nyere utgaver har endret noe.
