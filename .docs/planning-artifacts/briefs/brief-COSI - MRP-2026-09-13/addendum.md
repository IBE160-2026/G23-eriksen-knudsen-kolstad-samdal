---
title: COSI - MRP Addendum
status: draft
created: 2026-09-13
updated: 2026-10-22
---

# Addendum

Supporting depth captured during the brief conversation that belongs in downstream documents (architecture / implementation plan / sprint planning) rather than the brief itself.

> **Merk (2026-10-06):** Ved avvik gjelder `brief.md`. Faseplanen under er justert etter tilbakemeldingen fra faglærer: testdata følger briefens omfang (5–10 komponenter, 8–12 uker), lot-for-lot er bestillingsregelen i kjernen med fast partistørrelse som planlagt utvidelse, og flernivå BOM er flyttet ut av første versjon.
>
> **Merk (2026-10-22):** Flernivå BOM er flyttet tilbake inn i første versjon. Testeksempelet skal ha 5–10 komponenter fordelt på 3 nivåer i stykklisten. Behovsnedbrytningen gjennom nivåene er derfor lagt inn i fase 2, og den tidligere fase 5 er fjernet. «Innkjøpstid» er erstattet med «ledetid», som også dekker produksjonstid for komponenter som settes sammen internt.

## Technical implementation roadmap (user-authored, from prior discussion)

Prosjektbrief: MRP – Ukentlig komponentplan

**Mål:** Utvikle et system som beregner nettobehov, genererer bestillingsforslag og eksepsjonsmeldinger basert på MPS, BOM, lagerstatus, ledetid og sikkerhetslager.

### Fase 1 – Datamodell og grunnlag
**Mål:** Etablere strukturen systemet bygger på.
- Definer datastrukturer for MPS, BOM (flernivå, med overordnet komponent og antall per enhet), lagerstatus, ledetid, sikkerhetslager
- Lag testdata (5–10 komponenter fordelt på 3 nivåer, 8–12 ukers horisont) med manuelt utregnet fasittabell per uke og komponent
- **Test:** Kan systemet lese/parse testdataene uten feil? Stemmer datastrukturen med et manuelt kontrollert eksempel?

### Fase 2 – Kjernelogikk: Nettobehovsberegning
**Mål:** Implementere selve MRP-beregningen for flernivå BOM.
- Beregn nettobehov per uke (brutto behov – lagerstatus – innkommende ordre)
- Ta høyde for sikkerhetslager
- Beregn nivå for nivå: planlagte ordrefrigivelser for en overordnet komponent, ganget med antall per enhet, blir bruttobehov for komponentene under
- **Test:** Sammenlign systemets output mot en manuelt utregnet MRP-tabell (Excel). Krav: 100 % match på minst 3 testcase.

### Fase 3 – Bestillingsforslag
**Mål:** Oversette nettobehov til konkrete bestillingsforslag.
- Beregn bestillingstidspunkt basert på ledetid (offset bakover fra behovsuke)
- Implementer lot-for-lot som bestillingsregel (fast partistørrelse kommer som utvidelse i fase 7)
- **Test:** Verifiser at bestillingsforslag alltid ligger før behovsuken med korrekt offset. Test grensetilfeller (behov i uke 1, ledetid = horisont og ledetid > horisont).

### Fase 4 – Exception-meldinger
**Mål:** Systemet skal varsle planlegger om avvik automatisk.
- Implementer de fire eksepsjonstypene fra briefen: "bruk av sikkerhetslager", "bestilling forsinket", "mottak forsinket", "ledetid overskrider horisont"
- Generer lesbare meldinger per uke/komponent
- **Test:** Kjør testcase med kjente avvik – valider at riktig eksepsjonstype trigges hver gang (ingen falske positiver/negativer).

### Fase 5 – Brukergrensesnitt / presentasjon
**Mål:** Gjøre output tilgjengelig og forståelig.
- Enkel visning av nettobehov, bestillingsforslag og eksepsjoner per uke (tabell/dashboard), der varsler og kritiske komponenter fremheves
- **Test:** Brukertest – kan en person uten forkunnskap om koden forstå outputen?

### Fase 6 – Validering mot realistisk scenario
**Mål:** Teste systemet på en mer helhetlig, realistisk case.
- Kjør et komplett scenario over 8–12 uker med 5–10 komponenter fordelt på 3 nivåer og minst én forstyrrelse (f.eks. endret MPS midtveis)
- Endringen håndteres ved ny opplasting av Excel-malen, med før/etter-sammenligning mot forrige kjøring
- **Test:** Dokumenter hvordan systemet håndterer endringen – riktig oppdatering av bestillingsforslag og eksepsjoner, og at sammenligningen viser nøyaktig det som er endret.

### Fase 7 – Fast partistørrelse (planlagt utvidelse)
**Mål:** Legge til fast partistørrelse som valgbar bestillingsregel per komponent, etter at kjernen er ferdig og testet mot fasit.
- Bestilt mengde rundes opp til et helt antall partier, og overskuddet føres videre i forventet lagerbeholdning
- **Test:** Utvid fasittabellen med komponenter som bruker fast partistørrelse, og krev 100 % samsvar.

**Målbare leveranser per fase:** kode + testdata + testresultat (dokumentert avvik/samsvar) — konkret bevis på fremgang og noe å vise til emneansvarlig underveis, ikke bare et ferdig produkt til slutt.
