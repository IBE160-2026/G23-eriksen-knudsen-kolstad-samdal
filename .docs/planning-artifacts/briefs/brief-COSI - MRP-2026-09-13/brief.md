---
title: COSI - MRP Product Brief
status: draft
created: 2026-09-13
updated: 2026-09-13
---

# Product Brief: COSI - MRP

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
