---
title: COSI - MRP Addendum
status: draft
created: 2026-09-13
updated: 2026-10-01
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

## Excel-mal for inndata (utkast – ikke vedtatt av gruppen)

Forslag til hvordan den faste Excel-malen fra briefen (The Solution / Scope) kan se ut. Omfanget følger briefen: ett ferdigprodukt, enkeltnivå BOM, 5–10 komponenter, 8–12 uker, lot-for-lot. Der veikartet over sier noe annet (3–5 komponenter, 4–8 uker, fast partistørrelse), er det briefen som gjelder.

### Arkstruktur

Én `.xlsx`-fil med tre ark. Arknavn og kolonnenavn er faste og står i rad 1; data starter i rad 2.

**Ark 1 – `MPS`** (produksjonsplan for ferdigproduktet, én rad per uke)

| Kolonne | Type | Regel |
|---|---|---|
| `uke` | heltall | 1, 2, 3 … uten hull. Antall rader bestemmer planhorisonten. |
| `antall` | heltall ≥ 0 | Antall ferdigprodukter som skal produseres i uken. 0 er lov, tom celle er ikke. |

**Ark 2 – `Komponenter`** (BOM, lagerstatus, innkjøpstid og sikkerhetslager, én rad per komponent)

| Kolonne | Type | Regel |
|---|---|---|
| `komponent_id` | tekst | Unik per rad. |
| `navn` | tekst | Vises i resultattabellen. |
| `antall_per_produkt` | heltall > 0 | Hvor mange av komponenten som går inn i ett ferdigprodukt. |
| `lager` | heltall ≥ 0 | Beholdning ved starten av uke 1. |
| `innkjopstid_uker` | heltall ≥ 0 | Hele uker fra bestilling til mottak. |
| `sikkerhetslager` | heltall ≥ 0 | Minste ønskede beholdning ved slutten av hver uke. |

**Ark 3 – `PlanlagteMottak`** (allerede bestilte leveranser, én rad per mottak)

| Kolonne | Type | Regel |
|---|---|---|
| `komponent_id` | tekst | Må finnes i `Komponenter`. |
| `uke` | heltall | Må ligge innenfor planhorisonten i `MPS`. |
| `antall` | heltall > 0 | Mottatt mengde i uken. |

Arket kan være tomt (bare overskriftsrad). Uker uten rad betyr ingen mottak.

### Eksempel

`MPS`:

| uke | antall |
|---|---|
| 1 | 20 |
| 2 | 0 |
| 3 | 35 |

`Komponenter`:

| komponent_id | navn | antall_per_produkt | lager | innkjopstid_uker | sikkerhetslager |
|---|---|---|---|---|---|
| K01 | Ramme | 1 | 40 | 2 | 10 |
| K02 | Hjul | 4 | 120 | 1 | 20 |

`PlanlagteMottak`:

| komponent_id | uke | antall |
|---|---|---|
| K02 | 2 | 80 |

### Validering før beregning

**Feil – beregningen stoppes, og brukeren får beskjed om ark, rad og kolonne:**
- Et ark eller en kolonne mangler eller har feil navn
- Tom celle i et obligatorisk felt
- Tekst eller desimaltall der det skal være heltall, eller negativt tall
- `antall_per_produkt` er 0
- Samme `komponent_id` står flere ganger i `Komponenter`
- `uke` i `MPS` starter ikke på 1, har hull eller står flere ganger
- `PlanlagteMottak` viser til en komponent som ikke finnes, eller en uke utenfor planhorisonten
- Samme komponent og uke står flere ganger i `PlanlagteMottak`

**Varsel – beregningen kjøres, men brukeren får beskjed:**
- Færre enn 5 eller flere enn 10 komponenter, eller planhorisont utenfor 8–12 uker (utenfor det første versjon er testet for)
- `lager` er lavere enn `sikkerhetslager` allerede ved start
- `innkjopstid_uker` er lengre enn planhorisonten
- `antall` er 0 i alle uker i `MPS`

### Åpne spørsmål til gruppen

- **Ett eller flere ark for komponentdata:** utkastet samler BOM, lager, innkjøpstid og sikkerhetslager i ett ark fordi første versjon har ett ferdigprodukt og enkeltnivå BOM. Ved flernivå BOM og flere produkter må BOM trolig skilles ut i eget ark.
- **Uker som tall eller datoer:** utkastet bruker ukenummer 1–N. Datoer er mer gjenkjennelig for en planlegger, men gir mer validering.
- **Bare heltall:** holder for stykkvarer, men ikke for komponenter som måles i kg eller meter.
- **Grenser som feil eller varsel:** utkastet gir bare varsel når antall komponenter eller uker er utenfor 5–10 og 8–12.
- **Kolonnenavn uten æøå:** utkastet skriver `innkjopstid_uker` for å unngå tegnsettproblemer ved innlesing.
