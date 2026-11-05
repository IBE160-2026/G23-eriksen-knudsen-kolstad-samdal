---
title: COSI - MRP Avstemming av PRD mot ordbank og beslutninger
status: rapport
created: 2026-11-05
updated: 2026-11-05
---

# Avstemming: PRD mot ordbank og beslutninger 2026-11-05

Kilder: `prd.md` (draft, updated 2026-11-05), `beslutninger-2026-11-05.md`, `.docs/ordbank.md` (updated 2026-11-05), `.memlog.md` (UJ-gjennomgang og omnummerering UJ-1–4) og, for del 3, selve Excel-malen `testdata/COSI-MRP-mal.xlsx` (arkene og overskriftene ble lest direkte fra filen).

Linjenumre viser til filene slik de står 2026-11-05. «PRD L123» er linje 123 i `prd.md`, «OB L45» er linje 45 i `ordbank.md`.

Alvor: **høy** = kan gi feil implementering, feil test eller villede neste steg (Finalize, arkitektur). **Middels** = begrepsbrudd eller hull som bør rettes før Finalize. **Lav** = ordlyd og opprydding.

## Sammendrag

| # | Funn | Alvor |
|---|---|---|
| S1 | Seksjonen «Avvik mellom malen og PRD-en» i ordbanken er utdatert: alle seks radene er løst i PRD-en, men seksjonen sier fortsatt at PRD-en «må oppdateres». De avvikene som faktisk finnes nå (mal ↔ PRD/ordbank), står ikke der. | Høy |
| S2 | Feltnavnet i arket MPS: PRD-en kaller det «Antall per uke» (FR-3, UJ-4), men overskriften i malen er «Antall ferdigprodukter» (kolonnene er Uke og Antall ferdigprodukter). | Høy |
| S3 | «MRP-tabell» står i «Ikke bruk» (Resultattabell), men PRD-en bruker det tre steder, blant annet i overskriften til FR-14. | Middels |
| S4 | «Felles del» (§3, FR-28, SM-1) og «underdel» (FR-3) mangler i ordbanken. «Underdel» blandes med «underkomponent». | Middels |
| S5 | Definisjonene av forventet lagerbeholdning (§3 og ordbank) tar ikke med fradraget for fremskyndede mottak i FR-7, og §3 bruker «bestilt mengde» om planlagt ordremottak, som ordbanken sier er «beregnet, ikke bestilt». | Middels |

Alle 23 beslutningene er ført riktig inn i PRD-en (del 1). Funnene ligger i begrepsbruken (del 2) og i ordbankens avvikseksjon (del 3).

## 1. Beslutningene

| # | Beslutning | Hvor i PRD | Status | Merknad |
|---|---|---|---|---|
| 1 | «Del» som samlebegrep, «komponent» bare i typenavn, «kritisk del» | §0 L20, §1 L26, §3 L69–70, L98, FR-13, FR-15, FR-16 | OK | Ingen «komponent» som samlebegrep og ingen «kritisk komponent» igjen. «Hovedkomponent» (L28, L71) og «underkomponent» (L75) er lov etter ordbanken. Se 2.1 om «underdel». |
| 2 | «Prognostiserte behov (MPS)» første gang, deretter «Prognostiserte behov». Arket heter fortsatt MPS | §0 L18 (første gang), L20, §3 L78, FR-5 | OK | MPS står ellers bare som arknavn (FR-2, FR-3, UJ-4). Brudd: «prognosen» i L36 (se 2.1). Feltnavnet i MPS-arket stemmer ikke med malen (S2, del 3). |
| 3 | «Eksepsjon» overalt, også i appen | §1 L26, §3 L97, §4.4 L287 | OK | Ingen «varsel» igjen. NFR-7 L444 bruker «eksepsjonsmeldinger», som står i «Ikke bruk» (2.1). |
| 4 | Øvingseksempelet slettes | – | OK | PRD-en nevner det ikke. |
| 5 | Tre typer | §3 L75, FR-3 L142, FR-17 L317 | OK | Ingen endring, stemmer. |
| 6 | Inntil 1000 rader | §3 L68, FR-3 L137, NFR-5 | OK | Ingen endring, stemmer. |
| 7 | Frist 15.12.2026 kl. 15:00 | §7 L457, §9.2 spm. 6 L514 | OK | |
| 8 | Briefen fryses, PRD gjelder ved avvik | §0 L12, §9.2 spm. 10 L518 | OK | |
| 9 | Brukertest ikke bestemt | §9.1 spm. 4 L506 | OK | |
| 10 | Ukefilter på bestillingsforslag, ingen egen visning | FR-17 L317–323, §9.2 spm. 5 L513, §7.1 L464 | OK | |
| 11 | FR-6 bekreftet, omplanleggingshorisont som mulig utvidelse | FR-6 L195, §7.2 L475, §10 L527 | OK | `[ASSUMPTION]` fjernet. |
| 12 | FR-16: stykklisterekkefølge, kritiske deler markeres, sammendrag leder dit | FR-16 L308–313, §10 L528 | OK | Tolkningen «felles del står der den står første gang» (L312) er bekreftet av Sebastian (memlog). |
| 13 | FR-18: klikk, panel, mus/tastatur/berøring, ikke hover | FR-18 L329–337, FR-15 L300, §10 L529 | OK | |
| 14 | FR-20: endringer uten betydning vises ikke | FR-20 L360, L366, §10 L530 | OK | |
| 15 | Nye og fjernede deler som egne linjer. Tillegget om annet ferdigprodukt er **erstattet** av lagring per ferdigprodukt | FR-19–FR-21 L343–376, FR-20 L358, L367–368, §4.5 L341, §4.6 L380, §7.1 L465, §7.2 L477, §10 L531, UJ-3 L55 | OK | Ingen rester av «bare en melding». Lav: rad #15 i beslutningsfila viser fortsatt det gamle tillegget uten markering. Bare merknaden øverst (L14) sier at det er erstattet. Forslag: legg «(erstattet, se merknad øverst)» i raden. |
| 16 | Eksport `.xlsx` | FR-22 L384, §10 L532 | OK | |
| 17 | Eget ark «Sammenligning» | FR-23 L393–397, §10 L533 | OK | |
| 18 | Vercel, alt i nettleseren, ingenting til server eller tredjepart | NFR-4 L441, NFR-3 L440, FR-19 L345, §6 L453, §10 L534 | OK | |
| 19 | NFR-5 som mål, måles tidlig med `lag_testdata.py` | NFR-5 L442, §10 L535 | OK | |
| 20 | NFR-8: ikke farge alene, faste kolonner ved sidescroll | NFR-8 L445, FR-15 L300, §10 L536 | OK | |
| 21 | Meldingsregel i «Bestilling forsinket», spm. 8 lukkes | FR-10 L241–245, L248–249, §9.2 spm. 8 L516 | OK | Ordbankens definisjon av «Bestilling forsinket» (OB L92) er uklar for nivå .1 (se 2.2). |
| 22 | Testeksempel med fast partistørrelse venter til utvidelsen | §4.7 L401, §9.2 spm. 3 L512 | OK | |
| 23 | Fasit for FR-12/FR-28 og grensetilfeller for kumulativ ledetid lukkes | §9.2 spm. 11 L519 | OK | Stemmer med dekningstabellen i `testdata/README.md` (FR-9: 02 300-005, 04 300-022; FR-29: 02 300-005). |
| – | «Igjen i §9 etter Finalize: spm. 4; spm. 1 besvart av del C» | §9.1, §9.2 spm. 1 L510 | OK | |

**Lav, §0 L20:** «FR-16, FR-17, FR-18, NFR-4 og NFR-8 er endret» nevner ikke at FR-10 (meldingsregelen), FR-19–FR-21 (lagring per ferdigprodukt) og brukerreisene (ny UJ-1 og UJ-4, omnummerering) også ble endret 2026-11-05. Forslag: utvid setningen, eller skriv «blant annet».

## 2. Ordbanken mot PRD-en

### 2.1 PRD-en bruker ord fra «Ikke bruk»

| Ord i PRD | Hvor i PRD | Ordbank-rad | Forslag | Alvor |
|---|---|---|---|---|
| «MRP-tabell» | §4.2 L171 («én MRP-tabell for hvert varenummer»), FR-14-overskriften L289 («Vis MRP-tabell per del»), FR-18 L327 («Hver rad i MRP-tabellen») | Resultattabell (OB L113): «MRP-tabell» i Ikke bruk | Velg én løsning. (a) PRD: «resultattabell» / «tabellen for delen», FR-14 → «Vis resultattabell per del». (b) Ordbanken: tabellen for én del er noe annet enn hele resultattabellen og trenger et eget begrep (f.eks. «MRP-tabell for en del»). Merk at ordbanken selv bruker «MRP-tabellen» i definisjonen av resultattabell. | Middels |
| «underdel(er)» | FR-3-raden «Underdeler» L143, konsekvenser L157–159 | Underkomponent (OB L45) | «Underdel» står ikke i ordbanken. PRD-en bruker «underkomponenter» i §3 L75 og «underdeler» i FR-3. Velg ett begrep. «Underdel» passer best med beslutning #1 (del = samlebegrep), men da må ordbanken endres. Se også 2.3. | Middels |
| «partistørrelse» alene | §4.7 L401 (kolonnen «Partistørrelse»), FR-24 L403–405, FR-25 L412 («partistørrelse Q»), FR-26 L420 | Fast partistørrelse (OB L85): «partistørrelse (alene)» i Ikke bruk | PRD-en bruker ordet om verdien Q og kolonnen, ikke om regelen. Det er rimelig. Forslag til ordbanken: egen rad «Partistørrelse (Q, *lot size*)» = antall per parti for en del, og presiser at «Ikke bruk» gjelder «partistørrelse» om selve regelen. | Middels |
| «produkt» alene | UJ-3 L55 («for et annet produkt», «det produktet», «for et produkt»), L52, §4.5 L341, §1 L28 | Ferdigprodukt (OB L40): «produkt» i Ikke bruk | Skriv «ferdigprodukt». Viktigst i UJ-3 og §4.5, der lagringen er per ferdigprodukt (FR-19). | Lav |
| «navn» om beskrivelsen | FR-10 L249 («navnet og varenummeret til delen over»), FR-14 L291, FR-15 L300 («delens navn»), FR-22 L384, L389 («ferdigproduktets navn») | Beskrivelse (OB L42): «navn» i Ikke bruk | Skriv «beskrivelse» («ferdigproduktets beskrivelse», «ved delens varenummer og beskrivelse»). Alternativt: ordbanken godtar «navn» i brukerrettet tekst. «Radnavn» (NFR-8) er noe annet og er greit. | Lav |
| «prognosen» | §2.1 L36 («når prognosen endres») | Prognostiserte behov (OB L48): «prognose» i Ikke bruk | «når de prognostiserte behovene endres». | Lav |
| «periode» | §3 Uke L80 («Én periode i horisonten») | Uke (OB L59): «periode» i Ikke bruk | Greit som forklaring i en definisjon (ordbanken gjør det samme). Ingen endring, eller skriv «Én uke i horisonten, nummerert 1 til H». | Lav |
| «eksepsjonsmeldinger» | NFR-7 L444 | Eksepsjon (OB L91): «eksepsjonsmelding» i Ikke bruk | «meldingene i eksepsjonene» eller «eksepsjonene». | Lav |
| «uke 0» | FR-10 L248 (meldingsteksten fra fasit 01: «måtte vært frigitt i uke 0, før horisonten») | Forfalt frigivelse (OB L81): «uke 0» i Ikke bruk | Meldingen kommer fra fasiten, så en endring krever ny fasit. Forslag: ordbanken presiserer at «uke 0» ikke skal brukes som begrep for forfalt frigivelse, men er lov som bokstavelig ukenummer i meldinger og valideringsfeil (UJ-4 L59). | Lav |
| «disponibel(t)» | FR-6 L193, FR-7 L206, FR-10 L241, FR-11 L253, FR-18 L332, FR-25 L412 | Disponibel beholdning (OB L69): «disponibel (alene)» i Ikke bruk | Greit i formler. Forslag: ordbanken sier at kortformen er lov i formler, eller PRD-en skriver «disponibel beholdning(t)». | Lav |
| «behov» alene | FR-28 L188, FR-6 L200, FR-7 L206, FR-8 L214, FR-12 L261, L264, FR-18 L327 | Bruttobehov (OB L68): «behov (alene)» i Ikke bruk | Der det er et tall i tabellen, skriv det presise begrepet: L188 og L327 «bruttobehov», L200, L261 og L264 «nettobehov». Generell bruk (L52, L84, L232) er greit. | Lav |
| «fil(en)» om den utfylte malen | 31 steder, f.eks. UJ-1–UJ-4, §3 L103 | Excel-mal (OB L37): «fil (om malen)» i Ikke bruk | PRD-en skiller i praksis mellom malen (den tomme) og filen brukeren laster opp, og ordbanken gjør det samme (Kjøring, Valideringsfeil). Forslag: ordbanken presiserer at «fil» er lov om den utfylte kopien, men ikke om malen. | Lav |
| «testtilfelle» om valideringsfiler | FR-3 L152 («minst ett testtilfelle som gir nøyaktig én valideringsfeil (`testdata/validering/`)») | Valideringstilfelle (OB L117) | «minst ett valideringstilfelle». | Lav |

Sjekket uten funn: komponent (som samlebegrep), vare, Komponent-ID/K01, Produkt A, forelder/barn/parent/child, startlager, lagerstatus, buffer, innkjøpstid (alene), leveringstid, planstart, planhorisont, eksplosjon, forventet lager/beholdning, planlagt frigivelse/bestilling, registrert mottak, innkommende ordre, varsel, exception, Under sikkerhetslager, Utsett mottak, kritisk komponent, Innkjøpstid overskrider horisont, antall per ferdigprodukt, feilmelding, feilfil, øvingseksempel, resultatside, samlet/stablet ledetid, kritisk sti, ledetid fra toppen. «Delmontering» (FR-3 L153) står bare som eksempel på en ugyldig verdi, og det er greit. «Regneark» (L37, L49, L110) gjelder kollegaens regneark og andre programmer, ikke malen.

### 2.2 PRD §3 Ordliste mot ordbanken

**Mangler i ordbanken**

| §3-begrep | PRD | Forslag | Alvor |
|---|---|---|---|
| Felles del | §3 L76, FR-28 L182–189, FR-3 L156, FR-14 L296, FR-16 L312, FR-18 L334, SM-1 L486 | Ny rad i «Inndata» eller «Beregning»: «Felles del (*common part*): En del som står flere steder i stykklisten, med samme varenummer. Beregnes én gang, på lavnivåkoden.» Ikke bruk: «samme del», «delt del». Ordbanken bruker allerede begrepet i definisjonen av lavnivåkode (OB L77). | Middels |
| Komponent | §3 L70 | Ordbanken har ingen egen rad, bare regelen i Type (OB L47) og merknad 1. Forslag: egen rad «Komponent: brukes bare i typenavnene», så den som slår opp ordet, finner regelen. | Lav |
| Kontroll-kolonnen | §3 L101 | Ordbanken har «Kontroll» (OB L110). Malen kaller kolonnen «Kontroll». Forslag: ordbanken skriver «Kontroll (Kontroll-kolonnen)», eller PRD-en skriver «kolonnen Kontroll». | Lav |

**Definert annerledes**

| Begrep | PRD §3 | Ordbank | Forslag | Alvor |
|---|---|---|---|---|
| Forventet lagerbeholdning | L95: «Disponibel beholdning + planlagt ordremottak» | OB L80: samme | Begge mangler fradraget i FR-7 L206 («− fremskyndede mottak (FR-6) som ikke er kommet ennå»). Med fremskynding (300-005 Gassfjær) gir definisjonen et annet tall enn fasiten. Forslag: legg til «, minus fremskyndede mottak som ikke er kommet ennå (FR-7)» i begge. | Middels |
| Bestillingsregel, Lot-for-lot, Fast partistørrelse | L89–91: «gjør nettobehov om til bestilt mengde», «Bestilt mengde er lik nettobehovet», «Bestilt mengde rundes opp» | OB L83–85: «… til planlagt ordremottak», «Planlagt ordremottak = nettobehov» | «Bestilt mengde» er ikke definert og kan forveksles med planlagte mottak, som er bestilt. Ordbanken sier at planlagt ordremottak er «beregnet, ikke bestilt» (OB L71). Forslag: bruk «planlagt ordremottak» i §3, som i ordbanken. | Middels |
| Overordnet del / Delen over | §3-oppslagsord «Overordnet del» L72. PRD-en bruker «overordnet del» 14 ganger og «delen over» én gang (FR-10 L249) | OB L44: oppslagsord «Delen over (overordnet del)» | Uklart hvilket som er hovedbegrepet. Malen bruker «delen over» og beslutning #21 bruker «\<delen over\>», mens PRD-en bruker «\<overordnet del\>» (FR-10 L243). Forslag: velg ett hovedbegrep i ordbanken og bruk det i FR-10-meldingen. «Overordnet del» er mest brukt i PRD-en, «delen over» i malen og appteksten. | Lav |
| BOM (stykkliste) | §3 L68: oppslagsord «BOM (stykkliste)». «Flernivå BOM» i L18, L28, L171, L462 | OB L38: «Stykkliste (BOM, *multi-level BOM*)». Innledningen (OB L10) sier at det norske begrepet skal brukes | Snu oppslagsordet til «Stykkliste (BOM)» og skriv «flernivå stykkliste» i teksten, eller godta «flernivå BOM» som fast uttrykk i ordbanken. | Lav |
| Valideringsfeil | L103: «ark, rad eller celle og årsak». FR-4 L163: «ark, rad eller celle, felt og årsak» | OB L112: «ark, rad og årsak» | Oppdater ordbanken til «ark, rad eller celle, felt og årsak», som FR-4. | Lav |
| Bestilling forsinket (ikke i §3, men i FR-10) | FR-10 L242: ferdigproduktet og nivå .1 → «Leveranse til kunde blir forsinket» | OB L92: «… til kunden (ferdigproduktet) eller til produksjonen av delen over» | For en del på nivå .1 er delen over ferdigproduktet, så ordbanken kan leses som «Produksjonen av ferdigproduktet blir forsinket», og det strider mot beslutning #21. Forslag: «… til kunden for ferdigproduktet og delene rett under det, ellers til produksjonen av delen over». (Malens Veien videre har samme uklarhet.) | Middels |

Ellers like i innhold (kontrollert): Excel-mal, Del, Nivå, Varenummer, Ferdigprodukt, Type, Lavnivåkode, Prognostiserte behov, Horisont, Uke, Lagerbeholdning («før uke 1» = «ved starten av uke 1»), Sikkerhetslager, Ledetid, Ledetid fra ferdigproduktet, Planlagt mottak, Bruttobehov, Disponibel beholdning, Nettobehov, Planlagt ordremottak, Planlagt ordrefrigivelse, Forfalt frigivelse, Bestillingsforslag, Eksepsjon, Kritisk del, Kjøring, Resultattabell, Før/etter-sammenligning, Fasit.

**Ordbank-begreper som PRD-en bruker, men som mangler i §3 (lav):** Testeksempel (brukt overalt), Omplanleggingshorisont (FR-6, §7.2), Avvik (§1, FR-7, §4.4), Frigi (brukt som verb overalt), Hovedkomponent og Underkomponent (§3 L71, L75), Vercel (NFR-3, NFR-4). Forslag: legg i det minste til Testeksempel og Omplanleggingshorisont i §3.

### 2.3 Fagbegreper verken i §3 eller i ordbanken

| Begrep | Hvor i PRD | Forslag | Alvor |
|---|---|---|---|
| Underdel | FR-3 L143, L157–159 | Se 2.1. Enten ny rad i ordbanken (og «underkomponent» som synonym), eller bytt til «underkomponent» i FR-3. | Middels |
| Fremskyndet mottak / fremskynde | FR-6 L195, FR-7 L206, FR-12, FR-29, UJ-2, UJ-3, §3 L85 (13 steder) | Kjernebegrep i FR-6. Ordbanken bruker det i definisjoner (OB L78, L94), men har ingen egen rad. Ny rad i «Beregning»: «Fremskyndet mottak: et planlagt mottak som regnes som kommet i en tidligere uke med nettobehov (FR-6). Vises i tabellen i uken det er lagt inn.» | Middels |
| Partistørrelse (Q) | §4.7, FR-24–FR-26 | Se 2.1. Q bør også stå under Forkortelser. | Middels (samme funn som i 2.1) |
| Forklaring / forklaringspanel | FR-18 L325–337, FR-15, FR-26, UJ-1, UJ-2 | Ny rad i «App og test»: «Forklaring: tekst og tall som viser hvordan en rad, celle eller eksepsjon er regnet ut. Vises i et panel ved siden av resultattabellen.» | Lav |
| Sammendrag (av kritiske deler) | FR-16 L306–313, §4.4 L287, UJ-2 | Ny rad i «App og test». | Lav |
| Ukefilter | FR-17 L317–323, §7.1 L464 | Ny rad, eller nevn det under Bestillingsforslag. | Lav |
| Eksepsjonstype, eksepsjonsliste | §3 L97, §4.3, FR-13, FR-16, FR-18, FR-22, SM-2 | Nevn i ordbankens rad for Eksepsjon («fem eksepsjonstyper», «eksepsjonslisten»). | Lav |
| Forfalt mengde | FR-10 L241, FR-11 L253, FR-17 L317, UJ-2 | Nevn under Forfalt frigivelse: «den delen av frigivelsen i uke 1 som er forfalt». | Lav |
| Tidligste mottaksuke (1 + L) | FR-10 L241, FR-7 L206 | Nevn under Forfalt frigivelse eller Bestilling forsinket. | Lav |
| Innkjøp / produksjonsordre (som slag av bestillingsforslag) | §3 L96, FR-17 L317, FR-21 | Nevn under Bestillingsforslag. | Lav |
| Forekomst | FR-3 L143, L157–159, FR-14 L296, FR-28 L189 | Nevn under Felles del: «hver gang varenummeret står i stykklisten». | Lav |
| Radtype / radnavn | FR-18 L333 («seks radtypene»), NFR-8 L445 | Nevn under Resultattabell: «radene (radtypene) bruttobehov … planlagte ordrefrigivelser». | Lav |
| Lagret kjøring / siste vellykkede kjøring | FR-19–FR-21, UJ-1, UJ-3, UJ-4 | Nevn under Kjøring eller Før/etter-sammenligning. | Lav |
| Hjelpekolonne, nedtrekksliste | §4.1 L110, FR-2 L126, FR-3 L153 | Excel-begreper fra malen. Kan stå under Excel-mal. | Lav |
| Ukeskifte («når en ny uke blir uke 1») | §4.5 L341, UJ-4 | Valgfritt. | Lav |
| Forkortelser FR, NFR, UJ, SM, JTBD, G23, KI, Q | FR 117 ganger, UJ 27, SM 19, NFR 18. JTBD L32, G23 L12, KI L451 | Legg til i ordbankens tabell Forkortelser. FR/NFR/UJ/SM brukes også i epics, stories og tester. | Lav |

## 3. Seksjonen «Avvik mellom malen og PRD-en» (OB L141–152)

**Konklusjon: ikke lenger riktig (høy).** Innledningen (OB L143) sier at PRD-en ble skrevet før malen ble bygd om, og «må oppdateres». Alle seks radene er løst i dagens PRD:

| Tema (OB) | Ordbanken sier PRD har | PRD i dag | Status |
|---|---|---|---|
| Stykkliste | Enkeltnivå, ark Produkt og Komponenter | Flernivå, ett ark Stykkliste (§3 L68, FR-2). «Produkt og Komponenter» står bare historisk (L18, L127). | Løst |
| ID | Komponent-ID (K01 …) | Varenummer (§3 L73, FR-3). Ingen K01. | Løst |
| Tid | Innkjøpstid | Ledetid (§3 L83, FR-3 L145) | Løst |
| Eksepsjon | Innkjøpstid overskrider horisont | Ledetid overskrider horisont (FR-9) | Løst |
| Antall | Antall per ferdigprodukt | Antall per enhet av overordnet del (§3 L69, FR-3 L141) | Løst |
| Antall deler | 1–500, oppgitt i Produkt-arket | Inntil 1000 rader, ikke oppgitt (FR-3 L137) | Løst |

Ved lesing av malen (`testdata/COSI-MRP-mal.xlsx`) fant jeg disse avvikene, som faktisk gjelder nå:

| Tema | PRD / ordbank | Malen | Alvor | Forslag |
|---|---|---|---|---|
| Feltnavn i MPS | FR-3 L146 «MPS / Antall per uke». UJ-4 L60: «MPS, uke 11, Antall per uke: …» | Arket MPS har kolonnene «Uke» og «Antall ferdigprodukter». Veiledningen sier «Antall ferdigprodukter er heltall ≥ 0» | Høy | Feltnavnet i valideringsfeilen (FR-4) skal være kolonneoverskriften. Endre FR-3 og UJ-4 til «Antall ferdigprodukter», eller endre overskriften i malen (og i testdata/validering) til det PRD-en sier. |
| «Prognostiserte behov» i malen | Ordbank-raden Prognostiserte behov (OB L48) og merknad 2 (OB L136): «Prognostiserte behov» brukes «i malen og appen» | Malen bruker ikke ordet. Arket heter MPS, kolonnen «Antall ferdigprodukter», og Veiledning sier «MPS: Antall ferdigprodukter per uke» | Middels | Enten rett ordbanken («i appen og i dokumentene; i malen heter arket MPS og kolonnen Antall ferdigprodukter»), eller legg inn «Prognostiserte behov» i malen (f.eks. som overskrift eller i Veiledning). |
| Eksepsjon / varsel | «Eksepsjon» overalt (beslutning #3) | Veien videre steg 5–6: «Komponenter med minst ett varsel», «6. Håndter varsler», «Hvert varsel gjelder …», «Kommer: anbefalte tiltak for hvert varsel» | Middels | Bytt til «eksepsjon» i Veien videre. |
| Del / komponent | «Del» som samlebegrep (beslutning #1) | Veien videre steg 5–6: «tabell per uke og komponent», «Komponenter med minst ett varsel er markert som kritiske», «en uke og en komponent (eller hele komponenten)». Veiledning: «100 = ferdigvarer, 200 = komponenter som produseres selv …» | Middels | Bytt til «del» i Veien videre. Varenummerforslaget kan beholde «komponenter» fordi det viser til typene, men «deler som produseres selv» er tydeligere. |
| Eksepsjonene i malen | Fem eksepsjonstyper (FR-9–FR-12, FR-29). FR-9 bruker ledetid fra ferdigproduktet | Veien videre lister fire (mangler Kanseller mottak). «Ledetid overskrider horisont: ledetiden er like lang som eller lengre enn horisonten» (gammel regel, ikke summen langs stien) | Middels | Oppdater Veien videre steg 6 etter FR-9 og FR-29. |
| Lagerstatus | Ordbanken: «lagerstatus» i Ikke bruk (OB L49) | Veiledning, Stykkliste: «med lagerstatus, sikkerhetslager og ledetid» | Lav | «med lagerbeholdning, sikkerhetslager og ledetid». |
| Feilmelding | Ordbanken: «feilmelding» i Ikke bruk (OB L112) | Veien videre steg 4: «Kommer: oversikt over feilmeldinger» | Lav | «valideringsfeil». |
| Kontroll | PRD: «Kontroll-kolonnen». Ordbank: «Kontroll» | Kolonnen heter «Kontroll» | Lav | Se 2.2. |

Det som stemmer mellom malen og PRD-en: arkene Veiledning, Stykkliste, MPS, Planlagte mottak og Veien videre (§3 L67), overskriftene i Stykkliste (§3 L68), reglene for nivå, typer og nedtrekkslister (§4.1 L110, FR-3), og at lagerbeholdning, sikkerhetslager og ledetid fylles ut bare første gang.

**Forslag:** Bytt ut seksjonen med «Avvik mellom malen og PRD/ordbank (per 2026-11-05)» og tabellen over. Skriv øverst at de seks gamle avvikene ble løst i PRD-oppdateringene 2026-10-26 og 2026-11-05. Malen må rettes i egen oppgave (Veien videre og feltnavnet i MPS), fordi Kari møter malen i UJ-1.

## 4. Foreslått rekkefølge før Finalize

1. Avgjør feltnavnet i MPS («Antall per uke» eller «Antall ferdigprodukter») og rett FR-3 og UJ-4 eller malen og valideringsfilene (S2).
2. Skriv om ordbankens avvikseksjon (del 3) og rett merknad 2 / raden Prognostiserte behov.
3. Ordbanken: legg til Felles del, Fremskyndet mottak, Partistørrelse (Q) og Underdel (eller velg underkomponent). Rett Forventet lagerbeholdning og Bestilling forsinket. Legg til forkortelsene FR/NFR/UJ/SM. Oppdater `updated`.
4. PRD: «MRP-tabell» → resultattabell (eller nytt ordbankbegrep), «bestilt mengde» → planlagt ordremottak i §3, formelen for forventet lagerbeholdning i §3, og de lave ordfunnene i 2.1.
5. Malen: Veien videre (eksepsjon, del, fem eksepsjonstyper, FR-9), «lagerstatus» og «feilmeldinger».
