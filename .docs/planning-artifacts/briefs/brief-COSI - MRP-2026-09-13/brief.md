---
title: COSI - MRP Product Brief
status: draft
created: 2026-09-13
updated: 2026-09-13
---

# Product Brief: COSI - MRP

## Executive Summary

I mange små produksjonsbedrifter kan MRP-planlegging være basert på et Excel-ark bygget og forstått av én person. Det er en kombinasjon av fire problemer: kunnskapen sitter i ett hode (kunnskapssilo), den ukentlige oppdateringen krever mye manuelt arbeid, formlene er sårbare for feil, og det er vanskelig å se konsekvensene når noe endres midt i planen. COSI - MRP er en nettbasert MRP-planlegger som gjør nettobehovsberegning, bestillingsforslag og eksepsjonsvarsling til en systematisk, innebygd prosess i verktøyet selv, i stedet for taus kunnskap i et regneark.

Kjerneleveransen (V1) er en MRP-beregningsmotor for enkeltnivå BOM, med inndata via opplasting av en fast Excel-mal, og resultater presentert i et forståelig dashboard. Sammenlignet med et egenutviklet Excel-ark gir COSI - MRP en dokumentert, gjenbrukbar struktur som ikke er avhengig av én person. Sammenlignet med et fullverdig ERP-system er COSI - MRP enklere og mer avgrenset — det løser MRP-beregningen godt, uten å kreve at bedriften tar i bruk et helt produksjonssystem.

Dette er et gruppeprosjekt i IBE160 (4 medlemmer), med produktbrief levert 20. september og et ferdig testet, fungerende verktøy som mål innen desember. Lykkes kjernen, er neste steg flernivå-BOM, flere produkter og scenarioanalyse — og videre ut, innlogging og støtte for flere bedrifter samtidig, samt en mulighet til å teste verktøyet mot ekte bedrifter utenfor kursets rammer.

## The Problem

I mange små produksjonsbedrifter kan MRP-planlegging være basert på et Excel-ark bygget og vedlikeholdt av én person. Dette er fire problemer i kombinasjon:

- **Kunnskapssilo:** logikken i arket (hvorfor denne innkjøpstiden, hvorfor dette sikkerhetslageret, hvorfor denne partistørrelsen) er sjelden dokumentert noe annet sted enn i selve formlene. Når personen slutter, blir syk eller er utilgjengelig, forsvinner kunnskapen med dem.
- **Tidkrevende manuelt arbeid:** den ukentlige oppdateringen av nettobehov og bestillingsforslag gjøres for hånd.
- **Risiko for feil:** manuelle formler og manuell inntasting er sårbare for regnefeil og kopieringsfeil som er vanskelige å oppdage.
- **Dårlig oversikt ved endringer:** når noe endres midt i planen (f.eks. en justert MPS), er det vanskelig å se konsekvensene nedover i planen uten å regne alt på nytt for hånd.

Resultatet er at planleggingen kan bli vanskeligere, mer sårbar og mer tidkrevende når eieren av arket er borte, og at bedriften står igjen med to dårlige alternativer: bruke uker på å læres opp en erstatter i udokumenterte formler, eller kaste arket og starte på nytt.

## Who This Serves

**Primærbruker:** en produksjonsplanlegger eller innkjøper i en liten produksjonsbedrift — ofte uten formell planleggingsbakgrunn — som i dag "eier" Excel-arket for MRP, eller er den som må overta planleggingen når arkets eier er borte. De trenger et verktøy som gjør beregningsgrunnlaget, forutsetningene og resultatene synlige og lettere å forstå.

**Validering for kursleveransen:** verktøyet testes mot en konstruert testcase — en fiktiv liten produsent (5–10 komponenter, 8–12 ukers horisont) med manuelt kontrollerte fasitsvar. Dette er valideringsmetoden for at beregningslogikken er korrekt, ikke selve målgruppen.

## The Solution

En nettbasert MRP-planlegger der brukeren laster opp en fast Excel-mal med grunnlagsdataene (MPS, BOM, lagerstatus, planlagte mottak, innkjøpstid, sikkerhetslager) — riktig struktur er innebygget i malen, ikke noe brukeren må vite fra før. Verktøyet beregner deretter nettobehov, genererer bestillingsforslag og flagger avvik (eksepsjonsmeldinger) automatisk, presentert som en oversiktlig dashboard-/tabellvisning per uke og komponent — bygget for gjentakende, ukentlig bruk, ikke engangsoppsett.

Kjernen er ikke bare selve beregningen (den er lærebok-MRP), men at *prosessen* er innebygd i verktøyet: riktig struktur, riktig rekkefølge, riktig logikk — slik at kunnskapen ikke lenger sitter i ett hode og ett regneark, men i systemet selv.

## What Makes This Different

Sammenlignet med et egenutviklet Excel-ark: COSI - MRP har riktig struktur og logikk innebygget i verktøyet selv, ikke i formler bare én person forstår. Malen og beregningen er de samme uansett hvem som bruker verktøyet, så kunnskapen forsvinner ikke når en person slutter.

Sammenlignet med et fullverdig ERP-system: COSI - MRP er avgrenset til MRP-beregningen (nettobehov, bestillingsforslag, eksepsjoner) i stedet for å dekke hele produksjonsflyten. Det gjør verktøyet enklere å ta i bruk for en liten bedrift som trenger MRP-logikken, men ikke nødvendigvis resten av et ERP-system.

Ærlig sagt: differensieringen er ikke en hemmelig algoritme — MRP-logikken er standard fagteori, og det skal den være. Fortrinnet er at verktøyet gjør riktig prosess tilgjengelig for noen uten planleggingsbakgrunn, i stedet for å kreve enten et helt ERP-system eller et regneark bygget av en ekspert som en dag slutter.

## Scope

**V1 — kjerneleveranse (denne kursleveransen, frem mot ferdigstillelse i desember):**
- MRP-beregningsmotor for **enkeltnivå BOM**: nettobehov, bestillingsforslag, eksepsjonsmeldinger
- **Ett ferdigprodukt** med 5–10 komponenter, over en horisont på 8–12 uker
- **Lot-for-lot** som eneste bestillingsregel
- Inndata via opplasting av en **fast Excel-mal** — malen låser brukeren til riktig struktur, samme prinsipp som differensieringen over
- Dashboard-/tabellvisning av resultater per uke og komponent
- Bygget for **én bedrift/ett datasett** om gangen
- Ingen innlogging — verktøyet kjøres uten brukerkontoer i denne omgang
- Web/desktop (ikke mobiltilpasset)

**Eksplisitt utenfor V1 (videreutvikling — vurderes når kjerneleveransen står):**
- Flernivå BOM-eksplosjon
- Flere produkter samtidig
- Flere bestillingsregler (utover lot-for-lot, f.eks. fast partistørrelse eller EOQ)
- Manuell inntasting som alternativ til Excel-opplasting
- Innlogging/brukerkontoer med lagring av data mellom økter
- Støtte for flere bedrifter samtidig, med adskilte data for hver bedrift (multi-tenant)
- Testing mot reelle bedrifter utover kurset (se Vision)

## Success Criteria

Prosjektet er vellykket når:

- **Beregningsmotoren er korrekt:** 100 % match mot manuelt kontrollerte testcase for enkeltnivå BOM (5–10 komponenter, 8–12 uker)
- **Eksepsjonshåndtering er pålitelig:** riktig eksepsjonstype utløses i hvert kjent avvikstilfelle, uten falske positiver eller negativer
- **Inndatakvalitet kontrolleres:** systemet validerer den opplastede Excel-malen og flagger mangler eller feil i strukturen før beregningen kjøres
- **Verktøyet er forståelig uten forkunnskap:** etter en kort introduksjon klarer 3 av 3 testpersoner å finne og forklare hovedresultatene (kritisk komponent, foreslått bestillingsmengde og bestillingsuke) uten hjelp fra utviklerne
- **Systemet håndterer et realistisk scenario:** en komplett 8–12-ukers kjøring med 5–10 komponenter og minst én midtveis-endring (f.eks. endret MPS) håndteres korrekt

## Vision

Lykkes kjerneleveransen, er neste naturlige steg å utvide selve beregningskraften: flernivå BOM-eksplosjon, støtte for flere produkter samtidig, og scenarioanalyse (teste "hva hvis"-endringer i planen før de gjennomføres). Deretter følger tilgjengelighet: innlogging med lagrede data og støtte for flere bedrifter samtidig. Derfra åpner det seg en mulighet enkelte i gruppa er interessert i å forfølge: å teste verktøyet mot reelle små bedrifter som i dag er avhengige av ett regneark og én person, for å se om kunnskapssilo-problemet faktisk lar seg løse utenfor en kontrollert testcase. Dette er ikke en del av kursets formelle omfang, men en retning verktøyet er designet for å kunne vokse inn i.
