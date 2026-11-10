---
title: Avstemming av PRD mot research om MRP-regler
created: 2026-11-05
kilde: .docs/planning-artifacts/research/academic-lit-mrp-regler-forfalte-ordrer-eksepsjoner-h-2026-11-02/research.md
mot: prd.md (§4.2–4.3), addendum.md (Begrunnelse fra research om MRP-reglene), .memlog.md
---

# Avstemming: PRD mot research om MRP-regler

**Kilde:** `research.md` (academic-lit, 2026-11-02, med rettelse samme dag).
**Avstemt mot:** `prd.md` (spesielt §3 og §4.2–4.3: FR-5–FR-13, FR-28, FR-29), `addendum.md` (seksjonen «Begrunnelse fra research om MRP-reglene»), `.memlog.md`. I tillegg er `ordbank.md`, `beslutninger-2026-11-05.md` og `beregn()`/`mrp_del()` i `testdata/lag_testdata.py` lest for å kontrollere funnene.

**Metode:** Hver anbefaling, regel og hvert forbehold i rapporten (Sammendrag, A–C, Funn på tvers, Motstridende evidens, Anbefalinger-tabellen, Åpne spørsmål, Når funnene bør sjekkes på nytt) er sjekket mot PRD, addendum og memlog. Anbefalinger som er avvist med begrunnelse, regnes ikke som gap (oversikt nederst).

## Oppsummering

| # | Funn | Alvor |
|---|---|---|
| G1 | Formlene i FR-6/FR-7 og §3 kan, lest bokstavelig, gi dobbel dekning igjen i ukene mellom behovsuken og mottaksuken (det research-funnet B5 skulle fjerne). `beregn()` gjør det riktig, PRD-teksten ikke | Høy |
| G2 | Slutteffekten ved horisontens slutt er ikke nevnt i addendum, slik rapporten ber om, og påvirker også FR-29 | Middels |
| G3 | Addendum kaller forventet lagerbeholdning en «målplan», men FR-6 viser den som prognose for planlagte mottak. Avviket fra rapportens «samme logikk for FR-7 og FR-12» er bare begrunnet i én setning i FR-6 | Lav–middels |
| G4 | PRD sier «Beregningen er standard MRP», og FR-9 er ikke merket som kontroll av grunnlagsdata (ikke standard eksepsjon) | Lav |
| G5 | Den forfalte delen av frigivelsen i uke 1 er ikke krevd merket i resultattabellen, bare i listen over bestillingsforslag | Lav |
| G6 | Rapportens åpne spørsmål 2–4 og foreldet kilde [14] (SAP 4.6C) er ikke ført videre | Lav |
| G7 | «Forfalt frigivelse» er en egen utvidelse av ASCM-begrepet, uten merknad i ordbank eller addendum | Lav |
| T1 | Tilleggsobservasjon (avledet, ikke i rapporten): «tidligste mottaksuke 1 + L» i FR-10 er for optimistisk når underdeler også er forfalte | Lav |

---

## G1. Formelkjeden i FR-6/FR-7 kan gi dobbel dekning i mellomliggende uker — høy

**Rapporten:** B5 (rapportens best dokumenterte funn, sikkerhet høy): MRP lager planlagt ordremottak først når alle planlagte mottak er brukt (ASCM s. 164, SAP [14]). Anbefalingen: «Regn et senere planlagt mottak som om det fremskyndes til behovsuken. Lag planlagt ordre bare for restbehovet.» Funn på tvers: appen bør «også *regne* som om det planlagte mottaket fremskyndes».

**PRD:**
- FR-6: `disponibel(t) = forventet lagerbeholdning(t−1) + planlagte mottak(t) − bruttobehov(t)`, og et fremskyndet mottak «regnes med fra uke t».
- FR-6 (samme avsnitt): «Resultattabellen viser likevel mottaket i uken det er lagt inn i Excel-malen, og forventet lagerbeholdning regnes uten mottaket til det kommer.»
- FR-7: `forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak (FR-6) som ikke er kommet ennå`.
- §3 og ordbanken: forventet lagerbeholdning = disponibel + planlagt ordremottak (uten fratrekket), og disponibel bygger på forventet(t−1).

**Vurdering:** Leses formlene bokstavelig, bygger disponibel(t+1) på den *viste* forventede lagerbeholdningen, som er uten det fremskyndede mottaket. I ukene mellom behovsuken og den opprinnelige mottaksuken blir disponibel da for lav med hele mottaksmengden. Det gir nytt nettobehov og en ny planlagt ordre (eller nok en fremskynding) for et behov mottaket allerede dekker. Det er nettopp dobbeldekningen rapporten påviste i B5. Eksempelet med gassfjær (mottak i uke 4 flyttet til uke 3) skjuler problemet, fordi det ikke finnes noen uke imellom.

`mrp_del()` i `lag_testdata.py` gjør det riktig: den regner videre med en skyggebeholdning som inkluderer mottaket (`forrige = disponibel + nb`), nuller mottaket i den opprinnelige uken og trekker det fra bare i den viste raden (`forventet = forrige − ikke_kommet`). Fasit 04 har tilfeller med mellomliggende uker (300-028: mottak i uke 3 og 5 fremskyndet til uke 2; 300-026: mottak i uke 3 fremskyndet til uke 1). En utvikler som implementerer etter PRD-teksten, vil derfor feile mot fasiten, eller ta fasiten som feil.

**Forslag:** Skill i FR-6, FR-7 og §3/ordbanken mellom beholdningen som nettoberegningen bruker (med fremskyndede mottak fra behovsuken, uten mottaket i den opprinnelige uken) og den viste forventede lagerbeholdningen. Legg til en testbar konsekvens med minst én uke mellom behovsuken og mottaksuken (for eksempel 300-028).

## G2. Slutteffekten ved horisontens slutt er ikke nevnt — middels

**Rapporten:**
- Anbefalinger-tabellen, FR-8 (horisont): «Behold. **Nevn slutteffekten for nederste nivå i addendumet**.»
- C7 (forts.), vår slutning: «planen fanger da ikke opp frigivelser som skulle vært gjort nå for behov rett etter horisonten, og det rammer de nederste delene først.»
- C8: «Det er ikke grunnlag for egne regler her, bare for å nevne effekten i addendumet.» Åpent spørsmål 3 gjelder det samme.

**PRD/addendum/memlog:** FR-8 sier at frigivelser for behov etter horisonten ikke tas med. FR-9 forklarer effekten bare når ledetiden fra ferdigproduktet er ≥ H. Addendumet nevner ikke slutteffekten, og memlog har ingen beslutning om den.

**Vurdering:** Anbefalingen er verken tatt med eller avvist. Effekten gjelder alle deler, ikke bare dem som får FR-9: en del med ledetid fra ferdigproduktet k < H mangler systematisk frigivelser i de siste k ukene. Tomme frigivelsesceller sent i horisonten kan leses som «ikke behov» (SM-3, FR-18). Effekten slår også inn i FR-29: et planlagt mottak kan få «Kanseller mottak» fordi behovet rett etter horisonten ikke er synlig. Meldingen foreslår «kansellere eller utsette», og det demper risikoen, men regelen bør nevne dette.

**Forslag:** Ett punkt i addendumet, med henvisning til C7/C8. Vurder i tillegg om FR-18 skal forklare tomme frigivelser i de siste ukene, og om FR-29-meldingen skal nevne at behov etter uke H ikke er med.

## G3. «Målplan» i addendum og visningsvalget i FR-6 — lav–middels

**Rapporten:** A2 og Anbefalinger-tabellen (FR-7): skriv i addendumet at forventet lagerbeholdning er en målplan. Funn på tvers: med endringen i B5 «følger FR-7 og den nye FR-12 samme logikk: planen viser målet, og eksepsjonen viser hva som må gjøres for å nå det.»

**PRD/addendum:** Addendumet sier: «Forventet lagerbeholdning er altså en målplan som krever fremskynding, ikke en prognose.» Men FR-6 viser forventet lagerbeholdning *uten* det fremskyndede mottaket, slik at brukeren ser hva som skjer hvis mottaket ikke blir fremskyndet. For planlagte mottak er raden altså en prognose, for nye ordrer en målplan. Begrunnelsen står bare i én setning i FR-6 («Slik ser brukeren hva som skjer …»). `mrp_del()` kaller det «valg B 2026-11-02», men verken memlog eller addendumets research-seksjon nevner valget.

**Vurdering:** Valget er begrunnet og derfor ikke et rent gap, men det avviker fra rapportens anbefaling om samme logikk, og addendumet motsier nå FR-6. Rettes sammen med G1.

**Forslag:** Endre addendumets punkt om FR-7 og FR-6/FR-12 slik at det sier at raden viser nye ordrer som om de kommer i tide (målplan), men planlagte mottak i uken de faktisk kommer, med begrunnelse.

## G4. «Standard MRP» og FR-9 som standard eksepsjon — lav

**Rapporten:**
- Motstridende evidens: «FR-7 må derfor begrunnes i addendumet som en forenkling, ikke presenteres som standard.»
- B4: «Ledetid overskrider horisont» er ikke en standard eksepsjonstype i noen av kildene. Anbefalinger-tabellen: «Kan beholdes som kontroll av grunnlagsdata. Ikke kall den en standard MRP-eksepsjon.»

**PRD:** §4.2 sier: «Beregningen er standard MRP for flernivå BOM med lot-for-lot.» FR-7 sier selv at regelen er en forenkling (det er dekket). FR-9 står som en av fem likestilte eksepsjonstyper, og verken PRD eller addendum sier at den ikke er standard. Ordbanken skiller riktignok mellom ledetid fra ferdigproduktet og kumulativ ledetid, og addendumet begrunner at FR-9 kontrolleres per del (det er ikke et gap).

**Vurdering:** Mindre ordbruksavvik, men relevant for sensor og for rapportens forbehold. **Forslag:** Skriv «standard MRP-logikk, med forenklingene i FR-7 og FR-9» i §4.2, og en setning i addendumet om at FR-9 er en kontroll av grunnlagsdata uten forbilde som eksepsjonstype i ERP-systemene.

## G5. Forfalt del av uke 1 er ikke krevd merket i tabellen — lav

**Rapporten:** Anbefalinger-tabellen, FR-8 (uke 1): «Merk den forfalte delen av uke 1, så den ikke forsvinner i summen med vanlige frigivelser, og gi den alltid en eksepsjon.»

**PRD:** Eksepsjonsdelen er dekket: FR-10/FR-11 slår alltid til (addendumet begrunner det). FR-17 merker forslag med forfalt mengde i listen. FR-14, FR-15 og FR-18 krever derimot ikke at cellen for frigivelse i uke 1 viser den forfalte andelen. Eksepsjonen står i behovsuken t, som ikke trenger å være uke 1. Ved L = 3 og nettobehov i uke 2 er frigivelsescellen i uke 1 for eksempel ikke fremhevet.

**Vurdering:** Delvis dekket. **Forslag:** En konsekvens i FR-18 (forklaringen for frigivelsen i uke 1 viser vanlig og forfalt mengde hver for seg) eller i FR-15.

## G6. Åpne spørsmål og foreldede kilder i rapporten er ikke ført videre — lav

**Rapporten:**
- Åpne spørsmål 1–4: hovedlærebøkene, SAP-primærtekst for 096 og omplanleggingskontrollen i S/4HANA, slutteffekter på lavere nivåer og Oracles «compression days».
- «Når funnene bør sjekkes på nytt»: [14] SAP 4.6C er merket **gammel**, og prinsippet «bør bekreftes mot S/4HANA». Neste sjekk er Odoo 2027-01-01.

**PRD/addendum:** Addendumet nevner bare at lærebøkene ikke er lest. Spørsmål 2–4 og forbeholdet om [14] står ikke i PRD §9, i addendumet eller i memlog. Addendumet viser til SAP som støtte for FR-6/FR-12 uten å nevne at kilden er fra ca. 2000.

**Vurdering:** Lav risiko, fordi ASCM er hovedkilden og beslutningene er tatt. Sporbarheten mot sensor blir likevel bedre om forbeholdet står. **Forslag:** En linje i addendumet om at spørsmål 2–4 står åpne i research-rapporten og ikke endrer kravene, og at SAP-kilden er versjon 4.6C.

## G7. «Forfalt frigivelse» er en egen utvidelse av ASCM-begrepet — lav

**Rapporten:** A1: «ASCM definerer ‹past-due order› bare for kundeordrer. Når vi bruker ‹forfalt frigivelse› om forsyning, er det vår egen utvidelse av begrepet.»

**PRD/ordbank:** §3 og ordbanken definerer «Forfalt frigivelse» uten denne merknaden.

**Forslag:** Legg merknaden i ordbankraden (jf. CLAUDE.md om ordbanken), så ingen tror begrepet er hentet direkte fra ASCM.

## T1. Tilleggsobservasjon: tidligste mottaksuke ved forfalte underdeler — lav

Dette er ikke et gap mot rapporten, men følger av rapportens poeng om at kumulativ ledetid binder sammen forfalte ordrer og horisonten (Funn på tvers). Rapporten anbefaler at «Bestilling forsinket» viser tidligste mottaksuke 1 + L, og PRD-en har tatt det med (FR-10). Når en forfalt frigivelse på nivå .1 gir bruttobehov i uke 1 for underdelene (FR-8), og de også blir forfalte, kan delen på nivå .1 tidligst komme i uke 1 + L(..2) + L(.1), ikke i 1 + L(.1). I tillegg regnes «uken frigivelsen skulle vært gjort» for delen på nivå ..2 fra uke 1, ikke fra det opprinnelige behovet, så forsinkelsen blir undervurdert. **Forslag:** Ingen endring nødvendig i v1, men nevn forenklingen i addendumet eller i FR-18-forklaringen.

---

## Sjekket og ikke gap (tatt med eller avvist med begrunnelse)

| Rapportens anbefaling/regel | Hvor det er dekket | Status |
|---|---|---|
| FR-12: regn senere mottak som fremskyndet, ordre bare for restbehov | FR-6, FR-12; addendum; memlog | Tatt med (se G1 om formelteksten) |
| Kall eksepsjonen «Fremskynd mottak» | Memlog: typenavnet «Mottak forsinket» beholdes fra briefen, meldingen foreslår fremskynding | Avvist med begrunnelse |
| Oppdater fasiter for FR-12 og FR-28, grensetilfeller for kumulativ ledetid | PRD §9 spm. 9 og 11; beslutninger #23 | Tatt med |
| FR-9: kontroller H mot kumulativ ledetid | FR-9 (ledetid fra ferdigproduktet, lengste sti); addendum begrunner plasseringen per del; ordbanken skiller begrepene. Største verdi er lik kumulativ ledetid for ferdigproduktet, så kontrollen av H er den samme | Tatt med, med begrunnet avvik i hvilken del som flagges |
| Grensen «≥ H» (Dynamics: «longer than») | FR-9 | Samsvarer |
| FR-10/FR-11: utløs uansett årsak | Rettelse i research.md; addendum; memlog. Begrunnelsen holder også for tilfellet «lager før uke 1 < SS» (gir alltid forfalt frigivelse når L ≥ 1) | Avvist med begrunnelse |
| Utsett mottak | Addendum og memlog (støy, SM-C2, Oracles «acceptable early days») | Avvist med begrunnelse |
| Kanseller mottak | FR-29 | Tatt med (se G2 om horisontens slutt) |
| Én eksepsjon per del og uke | Addendum og memlog | Avvist med begrunnelse |
| Dempingsterskler, frysing, toleranser | Addendum («Ikke tatt med») | Avvist med begrunnelse |
| FR-7: forenkling, målplan, vis tidligste mottaksuke | FR-7; FR-10-meldingen (1 + L); addendum | Tatt med (se G3 og T1) |
| FR-8 (uke 1): forfalt i uke 1, alltid eksepsjon | FR-8, FR-10/FR-11; addendum | Tatt med (se G5 om merking i tabellen) |
| Forfalt frigivelse blir bruttobehov i uke 1 på nivået under | FR-8 (konsekvens); ordbank | Tatt med |
| FR-8 (horisont): behov etter H tas ikke med | FR-8 | Tatt med (se G2 om slutteffekten) |
| Felles deler på lavnivåkode; bruttobehov fra overordnedes frigivelser (Krajewski) | FR-5, FR-28; addendum | Tatt med |
| `beregn()`: kumulativ ledetid før eksplosjonen, netting mot senere mottak | Addendum (Flernivå beregning); `lag_testdata.py` | Tatt med |
| Hovedlærebøkene ikke lest | Addendum | Forbeholdet er ført videre |
| Øk/reduser mengde (Dynamics 365, Deltek) | Står i rapporten som observasjon, ikke som anbefaling | Ikke relevant som gap |
| Fastsatte planlagte ordrer (*firm planned orders*) | Rapporten: «gjelder ikke nå» | Ikke relevant |
