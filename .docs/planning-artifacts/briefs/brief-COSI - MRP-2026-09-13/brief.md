---
title: COSI - MRP Product Brief
status: draft
created: 2026-09-13
updated: 2026-09-13
---

# Product Brief: COSI - MRP

## Executive Summary

Små produksjonsbedrifter planlegger i dag ofte MRP i et Excel-ark bygget og forstått av én person. Når den personen slutter, stopper planleggingen opp — kunnskapen forsvinner med dem. COSI - MRP er en web-basert MRP-planlegger som gjør nettobehovsberegning, bestillingsforslag og eksepsjonsvarsling til en systematisk, innebygd prosess i verktøyet selv, i stedet for taus kunnskap i et regneark.

Kjerneleveransen (V1) er en fullverdig MRP-beregningsmotor — fra enkeltnivå til flernivå BOM-eksplosjon — med inndata via manuell registrering eller en fast Excel-mal, og resultater presentert i et forståelig dashboard. Markedet i dag tilbyr enten dyre abonnements-ERP-er (fra $49–350+/mnd) eller upolerte gratisalternativer; det finnes ikke noe godt mellomsteg, og det er der COSI - MRP sikter.

Dette er et gruppeprosjekt i IBE160 (4 medlemmer), med produktbrief levert 20. september og et ferdig testet, fungerende verktøy som mål innen desember. Lykkes kjernen, er neste steg innlogging og støtte for flere bedrifter samtidig — og på sikt, en mulighet til å teste verktøyet mot ekte bedrifter utenfor kursets rammer.

## The Problem

Bedrifter som i dag planlegger produksjon med MRP-logikk, gjør det som oftest i et Excel-ark bygget og vedlikeholdt av én person. Arket fungerer — men bare så lenge den personen er der. Når vedkommende slutter, blir syk eller er utilgjengelig, står bedriften igjen med to dårlige alternativer: bruke uker på å læres opp en erstatter i udokumenterte formler og stilltiende forutsetninger, eller kaste arket og tilpasse seg hva enn den nye ansatte kan fra før. Uansett stopper planleggingen opp, og kunnskap som aldri fantes noe sted utenom ett hode, forsvinner ut døra med personen.

Dette er et kunnskapssilo-problem like mye som et verktøyproblem: logikken i arket (hvorfor denne innkjøpstiden, hvorfor dette sikkerhetslageret, hvorfor denne partistørrelsen) er sjelden dokumentert noe annet sted enn i selve formlene.

## Who This Serves

**Primærbruker for kursleveransen:** en konstruert testcase — en fiktiv liten produsent (3–5 komponenter, 4–8 ukers horisont) bygget for å bevise at MRP-beregningslogikken er korrekt mot manuelt kontrollerte testdata.

**Den reelle brukeren problemet er designet for (utenfor kursets formelle omfang):** personen i en liten produksjonsbedrift — ofte uten formell planleggingsbakgrunn — som i dag "eier" Excel-arket, samt den som må overta planleggingen når den personen er borte.

## The Solution

En web-basert MRP-planlegger som fører brukeren gjennom en styrt, validert inndataflyt for grunnlagsdataene (MPS, BOM, lagerstatus, innkjøpstid, sikkerhetslager) — riktig struktur er innebygget i verktøyet, ikke noe brukeren må vite fra før. Verktøyet beregner deretter nettobehov, genererer bestillingsforslag og flagger avvik (eksepsjonsmeldinger) automatisk, presentert som en oversiktlig dashboard-/tabellvisning per uke og komponent — bygget for gjentakende, ukentlig bruk, ikke engangsoppsett.

Kjernen er ikke bare selve beregningen (den er lærebok-MRP), men at *prosessen* er innebygd i verktøyet: riktig rekkefølge, riktige felt, riktig logikk — slik at kunnskapen ikke lenger sitter i ett hode og ett regneark, men i systemet selv.

## What Makes This Different

Markedet i dag er delt i to: tunge, abonnementsbaserte "ERP-lite"-verktøy (MRPeasy, Katana, Fishbowl, Cin7 — fra $49–350+/mnd, bygget for hele produksjonsflyten) og gratis Excel-maler eller upolerte åpen kildekode-forsøk som gjør beregningen, men ikke guider brukeren gjennom den. Det finnes ikke noe midt imellom: et enkelt, standalone verktøy som gjør ekte flernivå MRP-beregning (ikke bare BOM-kost-rollup) med en brukervennlig, systematisk flyt.

Ærlig sagt: differensieringen er ikke en hemmelig algoritme — MRP-logikken er standard fagteori, og det skal den være. Fortrinnet er at verktøyet gjør riktig prosess tilgjengelig for noen uten planleggingsbakgrunn, i stedet for å kreve enten en dyr lisens eller et regneark bygget av en ekspert som en dag slutter.

## Scope

**V1 — kjerneleveranse (denne kursleveransen, frem mot ferdigstillelse i desember):**
- Full MRP-beregningsmotor: nettobehov, bestillingsforslag, eksepsjonsmeldinger, fra enkeltnivå til flernivå BOM-eksplosjon
- Inndata via manuell inntasting **eller** opplasting av en fast Excel-mal — malen låser brukeren til riktig struktur, samme prinsipp som differensieringen over
- Dashboard-/tabellvisning av resultater per uke og komponent
- Bygget for **én bedrift/ett datasett** om gangen
- Ingen innlogging — verktøyet kjøres uten brukerkontoer i denne omgang
- Web/desktop (ikke mobiltilpasset)

**Eksplisitt utenfor V1 (stretch goals — vurderes når kjerneleveransen står):**
- Innlogging/brukerkontoer med lagring av data mellom økter
- Støtte for flere bedrifter samtidig (multi-tenant)
- Testing mot reelle bedrifter utover kurset (se Vision)

## Success Criteria

Prosjektet er vellykket når:

- **Beregningsmotoren er korrekt:** 100 % match mot manuelt kontrollerte testcase for både enkeltnivå- og flernivå BOM
- **Eksepsjonshåndtering er pålitelig:** riktig eksepsjonstype utløses i hvert kjent avvikstilfelle, uten falske positiver eller negativer
- **Verktøyet er forståelig uten forkunnskap:** en bruker uten kjennskap til koden kan lese og forstå dashboardet uten forklaring
- **Systemet håndterer et realistisk scenario:** en komplett 8–12-ukers kjøring med flere komponenter og minst én midtveis-endring (f.eks. endret MPS) håndteres korrekt
- **Levert innen frist:** et ferdig testet og fungerende prosjekt levert innen desember — slik gruppa selv har definert suksess for kurset

## Vision

Lykkes kjerneleveransen, er neste naturlige steg å bygge ut stretch-goals fra Scope: innlogging med lagrede data, og støtte for flere bedrifter samtidig. Derfra åpner det seg en mulighet enkelte i gruppa er interessert i å forfølge: å teste verktøyet mot reelle små bedrifter som i dag er avhengige av ett regneark og én person, for å se om kunnskapssilo-problemet faktisk lar seg løse utenfor en kontrollert testcase. Dette er ikke en del av kursets formelle omfang, men en retning verktøyet er designet for å kunne vokse inn i.
