---
title: COSI - MRP Addendum
status: draft
created: 2026-09-13
updated: 2026-09-13
---

# Addendum

Supporting depth captured during the brief conversation that belongs in downstream documents (architecture / implementation plan / sprint planning) rather than the brief itself.

## Technical implementation roadmap (user-authored, from prior discussion)

Prosjektbrief: MRP – Ukentlig komponentplan

**Mål:** Utvikle et system som beregner nettobehov, genererer bestillingsforslag og eksepsjonsmeldinger basert på MPS, BOM, lagerstatus, innkjøpstid og sikkerhetslager.

### Fase 1 – Datamodell og grunnlag
**Mål:** Etablere strukturen systemet bygger på.
- Definer datastrukturer for MPS, BOM (enkel-nivå), lagerstatus, innkjøpstid, sikkerhetslager
- Lag testdata (minst 3–5 komponenter, 4–8 ukers horisont)
- **Test:** Kan systemet lese/parse testdataene uten feil? Stemmer datastrukturen med et manuelt kontrollert eksempel?

### Fase 2 – Kjernelogikk: Nettobehovsberegning
**Mål:** Implementere selve MRP-beregningen for enkeltnivå BOM.
- Beregn nettobehov per uke (brutto behov – lagerstatus – innkommende ordre)
- Ta høyde for sikkerhetslager
- **Test:** Sammenlign systemets output mot en manuelt utregnet MRP-tabell (Excel). Krav: 100 % match på minst 3 testcase.

### Fase 3 – Bestillingsforslag
**Mål:** Oversette nettobehov til konkrete bestillingsforslag.
- Beregn bestillingstidspunkt basert på innkjøpstid (offset bakover fra behovsuke)
- Implementer enkel partistørrelse-logikk (f.eks. lot-for-lot eller fast partistørrelse)
- **Test:** Verifiser at bestillingsforslag alltid ligger før behovsuken med korrekt offset. Test grensetilfeller (behov i uke 1, innkjøpstid > horisont).

### Fase 4 – Exception-meldinger
**Mål:** Systemet skal varsle planlegger om avvik automatisk.
- Definer eksepsjonstyper (f.eks. "under sikkerhetslager", "bestilling forsinket", "innkjøpstid overskrider horisont")
- Generer lesbare meldinger per uke/komponent
- **Test:** Kjør testcase med kjente avvik – valider at riktig eksepsjonstype trigges hver gang (ingen falske positiver/negativer).

### Fase 5 – Multi-nivå BOM (utvidelse)
**Mål:** Utvide fra enkeltnivå til flernivå struktur.
- Implementer rekursiv "eksplosjon" av behov nedover i BOM-strukturen
- **Test:** Bygg en 3-nivås BOM manuelt, sammenlign systemets output mot manuell beregning.

### Fase 6 – Brukergrensesnitt / presentasjon
**Mål:** Gjøre output tilgjengelig og forståelig.
- Enkel visning av nettobehov, bestillingsforslag og eksepsjoner per uke (tabell/dashboard)
- **Test:** Brukertest – kan en person uten forkunnskap om koden forstå outputen?

### Fase 7 – Validering mot realistisk scenario
**Mål:** Teste systemet på en mer helhetlig, realistisk case.
- Kjør et komplett scenario over 8–12 uker med flere komponenter og minst én forstyrrelse (f.eks. endret MPS midtveis)
- **Test:** Dokumenter hvordan systemet håndterer endringen – riktig oppdatering av bestillingsforslag og eksepsjoner.

**Målbare leveranser per fase:** kode + testdata + testresultat (dokumentert avvik/samsvar) — konkret bevis på fremgang og noe å vise til emneansvarlig underveis, ikke bare et ferdig produkt til slutt.
