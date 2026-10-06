---
title: COSI - MRP Product Brief
status: draft
created: 2026-09-13
updated: 2026-10-06
---

# Product Brief: COSI - MRP

## Executive Summary

I små produksjonsbedrifter kan MRP-planlegging være basert på et Excel-ark som bare én person kjenner godt. Det gjør planleggingen sårbar, tidkrevende og feilutsatt. COSI - MRP er en nettbasert løsning som gjør nettobehovsberegning, bestillingsforslag og eksepsjonsmeldinger (varsler om mangler, forsinkelser eller feil i dataene) til en fast, innebygd prosess i verktøyet selv.

Første versjon dekker enkeltnivå BOM (stykkliste) for ett ferdigprodukt, med inndata via en fast Excel-mal og resultater i en oversiktlig tabell. Lykkes dette, er neste steg flernivå BOM, flere produkter og sammenligning av ulike situasjoner og endringer, deretter innlogging og støtte for flere bedrifter.

Dette er et gruppeprosjekt i IBE160 (4 medlemmer), med produktbrief levert 20. september og et ferdig testet verktøy som mål innen desember.

## The Problem

I mange små produksjonsbedrifter er MRP-planlegging basert på et Excel-ark bygget og vedlikeholdt av én person. Det gir fire problemer:

- **Viktig kunnskap er knyttet til én person:** logikken bak innkjøpstid, sikkerhetslager og partistørrelse er sjelden dokumentert andre steder enn i formlene. Forsvinner personen, forsvinner kunnskapen.
- **Tidkrevende manuelt arbeid:** den ukentlige oppdateringen av nettobehov og bestillingsforslag gjøres for hånd.
- **Risiko for feil:** manuelle formler og manuell inntasting gir regnefeil og kopieringsfeil som er vanskelige å oppdage.
- **Dårlig oversikt ved endringer:** når noe endres midt i planen (f.eks. en justert MPS, produksjonsplanen), er det vanskelig å se konsekvensene uten å regne alt på nytt for hånd.

Planleggingen blir vanskeligere, mer sårbar og mer tidkrevende når eieren av arket er borte. Bedriften må enten bruke uker på å lære opp en erstatter i udokumenterte formler, eller kaste arket og starte på nytt.

## Who This Serves

**Primærbruker:** en produksjonsplanlegger eller innkjøper i en liten produksjonsbedrift, ofte uten formell planleggingsbakgrunn. Personen "eier" i dag Excel-arket, eller må overta det når eieren er borte. Verktøyet skal gjøre beregningsgrunnlag, forutsetninger og resultater synlige og lette å forstå.

**Validering for kursleveransen:** verktøyet testes mot et konstruert testeksempel — en fiktiv liten produsent (5–10 komponenter, 8–12 uker) med manuelt kontrollerte fasitsvar. Dette er testmetoden, ikke selve målgruppen.

## The Solution

Brukeren laster opp en fast Excel-mal med grunnlagsdata: MPS (produksjonsplan), BOM (stykkliste), lagerstatus, planlagte mottak, innkjøpstid og sikkerhetslager. Excel-malen gir dataene en fast struktur. Systemet kontrollerer at nødvendige felt og verdier er fylt ut før beregningen starter.

Verktøyet beregner deretter nettobehov, foreslår bestillinger og flagger avvik automatisk, presentert i en oversiktlig tabell per uke og komponent — bygget for gjentakende, ukentlig bruk. Varsler vises direkte i tabellen: cellen for aktuell uke og komponent fremheves, og en kort melding forklarer hva som er galt. Komponenter med minst ett varsel markeres som kritiske, slik at brukeren raskt ser hvor det må handles.

**Når planen endres:** endres noe midt i planen, for eksempel en justert MPS, oppdaterer brukeren Excel-malen og laster den opp på nytt. Verktøyet beregner hele planen på nytt og viser en før/etter-sammenligning mot forrige kjøring: hvilke bestillingsforslag som er nye, endret eller fjernet, og hvilke varsler som har kommet til eller forsvunnet. Slik ser brukeren konsekvensene av endringen uten å regne noe for hånd.

Kjernen er ikke selve beregningen (standard MRP-teori), men at hele prosessen — riktig struktur, rekkefølge og logikk — ligger i verktøyet, i stedet for hos én person.

## What Makes This Different

Sammenlignet med et egenutviklet Excel-ark: strukturen og logikken ligger i verktøyet, ikke i formler bare én person forstår. Beregningslogikken og forutsetningene forblir dokumentert i verktøyet selv om en ansatt slutter eller er fraværende.

Sammenlignet med et fullverdig ERP-system (et stort system for hele produksjonsstyringen): COSI - MRP er avgrenset til selve MRP-beregningen, og dermed enklere å ta i bruk for en liten bedrift.

Dette er ikke en hemmelig metode — MRP-logikken er standard teori i faget. Fordelen er at verktøyet gjør riktig prosess tilgjengelig for noen uten planleggingsbakgrunn, i stedet for å kreve et helt ERP-system eller et regneark bygget av en ekspert som en dag slutter.

## Scope

**Første versjon (denne kursleveransen, frem mot desember):**
- MRP-beregningsmotor for enkeltnivå BOM som viser bruttobehov, forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte ordrefrigivelser
- Ett ferdigprodukt med 5–10 komponenter, over 8–12 uker
- Lot-for-lot (bestilt mengde lik behovet) som bestillingsregel i kjernen
- Inndata via opplasting av en fast Excel-mal, med validering av struktur, tomme celler og datatyper før beregning
- Fire eksepsjonstyper, vist per uke og komponent:
  - **Bruk av sikkerhetslager:** sikkerhetslager er en ekstra lagerbeholdning som fungerer som en buffer mot uventet høy etterspørsel eller forsinkelser i leveranser. Hvis bruttobehovet begynner å benytte seg av sikkerhetslageret før neste leveranse inn til lageret er planlagt, markeres det
  - **Bestilling forsinket (fra lager til kunde):** bruttobehovet i en uke kan ikke dekkes fra lager i tide, fordi en bestilling måtte vært frigitt før første uke i horisonten. Leveransen videre til kunde blir dermed forsinket
  - **Mottak forsinket (fra leverandør til lager):** et planlagt mottak fra leverandør er lagt til en senere uke enn uken der behovet oppstår, slik at mottaket kommer for sent og må fremskyndes
  - **Innkjøpstid overskrider horisont:** innkjøpstiden for en komponent er lengre enn planleggingshorisonten
- Tabelloversikt over resultater per uke og komponent, der varsler og kritiske komponenter fremheves
- Ny opplasting ved endringer (f.eks. endret MPS), med før/etter-sammenligning mot forrige kjøring
- Én bedrift/ett datasett om gangen
- Ingen innlogging
- Web/desktop (ikke mobiltilpasset)

**Planlagt utvidelse i første versjon (etter at kjernen er ferdig og testet mot fasit):**
- Fast partistørrelse som valgbar bestillingsregel per komponent, i tillegg til lot-for-lot. Bestilt mengde rundes opp til et helt antall partier, og overskuddet føres videre i forventet lagerbeholdning.

**Ikke med i første versjon (videreutvikling):**
- Flernivå BOM (beregning gjennom flere nivåer i stykklisten)
- Flere produkter samtidig
- Andre bestillingsregler (f.eks. beregnet optimal bestillingsmengde)
- Manuell inntasting som alternativ til Excel-opplasting
- Innlogging/brukerkontoer med lagring
- Støtte for flere bedrifter med adskilte data
- Testing mot reelle bedrifter utover kurset (se Vision)

## Success Criteria

Prosjektet er vellykket når:

- **Beregningsmotoren er korrekt:** 100 % samsvar med manuelt kontrollerte testeksempler for enkeltnivå BOM (5–10 komponenter, 8–12 uker)
- **Eksepsjonshåndtering er pålitelig:** for hver av de fire eksepsjonstypene utløses riktig varsel i hvert kjent avvikstilfelle i testeksempelet, uten å gi feil varsel eller overse kjente avvik
- **Inndatakvalitet kontrolleres:** systemet validerer Excel-malen og flagger mangler eller feil i strukturen før beregningen kjøres
- **Verktøyet er forståelig uten forkunnskap:** etter en kort introduksjon finner og forklarer 3 av 3 testpersoner hovedresultatene (kritisk komponent, bestillingsmengde og bestillingsuke) uten hjelp fra utviklerne
- **Systemet håndterer et realistisk scenario:** en komplett 8–12-ukers kjøring med 5–10 komponenter og minst én endring midtveis (f.eks. endret MPS) håndteres korrekt, og før/etter-sammenligningen viser nøyaktig de bestillingsforslagene og varslene som er endret

## Vision

Lykkes første versjon, er neste steg flernivå BOM, flere produkter og sammenligning av ulike situasjoner og endringer. Deretter følger innlogging med lagrede data og støtte for flere bedrifter. Derfra åpner muligheten for å teste verktøyet mot reelle små bedrifter som i dag er avhengige av ett regneark og én person. Dette er ikke en del av kursets formelle omfang, men en retning verktøyet er designet for å kunne vokse inn i. Utprøvingen skal undersøke om verktøyet kan redusere personavhengigheten i planleggingsarbeidet.
