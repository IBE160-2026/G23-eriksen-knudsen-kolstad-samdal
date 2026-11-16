---
title: Øvingseksempel – 3 komponenter, 4 uker
status: utkast
created: 2026-10-13
author: Carmen Kolstad
---

# Øvingseksempel: MRP med 3 komponenter over 4 uker

> **Utkast – skal kontrolleres før bruk som fasit.**
> Tallene er ikke uavhengig kontrollert ennå. 

Dette er et innledende øvingseksempel. Det endrer ikke prosjektets avgrensning i product brief (5–10 komponenter, 8–12 uker).

## Inndata

**Ferdigprodukt:** Produkt A. Uke 1 er planstart, og planhorisonten er uke 1–4.

**MPS (antall produkt A per uke):**

| Uke | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| MPS | 20 | 30 | 25 | 40 |

**BOM og komponentdata (enkeltnivå BOM, lot-for-lot):**

| Komponent | Antall per A | Startlager | Registrerte mottak | Sikkerhetslager | Innkjøpstid |
|---|---|---|---|---|---|
| K1 | 1 | 35 | 20 i uke 3 | 5 | 1 uke |
| K2 | 4 | 300 | ingen | 40 | 1 uke |
| K3 | 2 | 60 | 30 i uke 2 | 10 | 2 uker |

**Bruttobehov per komponent (MPS × antall per A):**

| Komponent | Uke 1 | Uke 2 | Uke 3 | Uke 4 |
|---|---|---|---|---|
| K1 | 20 | 30 | 25 | 40 |
| K2 | 80 | 120 | 100 | 160 |
| K3 | 40 | 60 | 50 | 80 |

## Beregningsregler

For hver komponent og hver uke *t*:

1. **Bruttobehov** = MPS(*t*) × antall per A
2. **Tilgjengelig** = forventet beholdning(*t* − 1) + registrerte mottak(*t*). For uke 1 er forventet beholdning(0) lik startlageret.
3. **Nettobehov** = maks(0, bruttobehov + sikkerhetslager − tilgjengelig)
4. **Planlagt mottak** = nettobehov (lot-for-lot)
5. **Planlagt frigivelse** = det planlagte mottaket, lagt i uke *t* − innkjøpstid
6. **Forventet beholdning** = tilgjengelig + planlagt mottak − bruttobehov

**Forutsetninger:**

- Mottak er tilgjengelige før ukens behov trekkes fra.
- Komponentene brukes i samme uke som produksjonen i MPS.

En frigivelse som havner før uke 1 betyr at bestillingen måtte vært lagt inn før planstart, og den gir varselet **«Bestilling forsinket – nytt bestillingsforslag»**.

## K1

Data: antall per A 1, startlager 35, registrert mottak 20 i uke 3, sikkerhetslager 5, innkjøpstid 1 uke.

| Uke | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Bruttobehov | 20 | 30 | 25 | 40 |
| Registrerte mottak | 0 | 0 | 20 | 0 |
| Tilgjengelig | 35 | 15 | 25 | 5 |
| Nettobehov | 0 | 20 | 5 | 40 |
| Planlagte mottak | 0 | 20 | 5 | 40 |
| Forventet beholdning (start 35) | 15 | 5 | 5 | 5 |
| Planlagte frigivelser | 20 | 5 | 40 | 0 |

Varsler: ingen.

## K2

Data: antall per A 4, startlager 300, ingen registrerte mottak, sikkerhetslager 40, innkjøpstid 1 uke.

| Uke | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Bruttobehov | 80 | 120 | 100 | 160 |
| Registrerte mottak | 0 | 0 | 0 | 0 |
| Tilgjengelig | 300 | 220 | 100 | 40 |
| Nettobehov | 0 | 0 | 40 | 160 |
| Planlagte mottak | 0 | 0 | 40 | 160 |
| Forventet beholdning (start 300) | 220 | 100 | 40 | 40 |
| Planlagte frigivelser | 0 | 40 | 160 | 0 |

Varsler: ingen.

## K3

Data: antall per A 2, startlager 60, registrert mottak 30 i uke 2, sikkerhetslager 10, innkjøpstid 2 uker.

### Trinnvis beregning

**Uke 1**
- Tilgjengelig = 60 + 0 = 60
- Nettobehov = maks(0, 40 + 10 − 60) = maks(0, −10) = 0
- Forventet beholdning = 60 + 0 − 40 = 20

**Uke 2**
- Tilgjengelig = 20 + 30 = 50
- Nettobehov = maks(0, 60 + 10 − 50) = 20
- Planlagt mottak = 20, med frigivelse i uke 2 − 2 = **uke 0** (før planstart) ⚠
- Forventet beholdning = 50 + 20 − 60 = 10

**Uke 3**
- Tilgjengelig = 10 + 0 = 10
- Nettobehov = maks(0, 50 + 10 − 10) = 50
- Planlagt mottak = 50, med frigivelse i uke 3 − 2 = uke 1
- Forventet beholdning = 10 + 50 − 50 = 10

**Uke 4**
- Tilgjengelig = 10 + 0 = 10
- Nettobehov = maks(0, 80 + 10 − 10) = 80
- Planlagt mottak = 80, med frigivelse i uke 4 − 2 = uke 2
- Forventet beholdning = 10 + 80 − 80 = 10

### MRP-tabell

| Uke | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Bruttobehov | | 40 | 60 | 50 | 80 |
| Registrerte mottak | | 0 | 30 | 0 | 0 |
| Tilgjengelig | | 60 | 50 | 10 | 10 |
| Nettobehov | | 0 | 20 | 50 | 80 |
| Planlagte mottak | | 0 | 20 | 50 | 80 |
| Forventet beholdning (start 60) | | 20 | 10 | 10 | 10 |
| Planlagte frigivelser | **20 ⚠** | 50 | 80 | 0 | 0 |

Varsel: **⚠ Bestilling forsinket – nytt bestillingsforslag.** K3 trenger 20 stk i uke 2, men med 2 ukers innkjøpstid måtte bestillingen vært lagt inn i uke 0, altså før planstart.

**Merk:** Forventet beholdning på 10 i uke 2 forutsetter at det planlagte mottaket på 20 faktisk kommer i uke 2. Det krever at mottaket fremskyndes, for eksempel med hasteleveranse eller kortere innkjøpstid enn normalt. Tabellen over flytter ikke mottaket. Den viser den beregnede MRP-planen med frigivelse i uke 0.

### Kontroll: uke 2 uten det planlagte mottaket

Dette er en egen kontrollberegning. Den erstatter ikke tabellen over og blandes ikke med den. Den viser hva som skjer i uke 2 hvis det planlagte mottaket på 20 ikke kommer.

Kontrollberegningen gjelder **uke 2 alene**. Den er ikke en full alternativ plan, og uke 3 og 4 er ikke beregnet på nytt.

- Tilgjengelig = 20 + 30 = 50
- Bruttobehov = 60
- Beregnet lager = 50 − 60 = **−10**

Det betyr:
- **10 enheter udekket behov** i uke 2 (0 − (−10) = 10)
- **20 under sikkerhetslageret** (10 − (−10) = 20)

I denne situasjonen gjelder også varselet **«Under sikkerhetslager»** for K3 i uke 2.

## Oppsummering av forventede varsler

| Komponent | Uke | Varsel |
|---|---|---|
| K3 | 2 (frigivelse uke 0) | Bestilling forsinket – nytt bestillingsforslag |
| K3 | 2 (bare hvis mottaket ikke fremskyndes) | Under sikkerhetslager |

«Innkjøpstid overskrider horisont» utløses ikke, fordi alle innkjøpstidene er kortere enn horisonten på 4 uker.

## Spørsmål

- Forslag: MRP-tabellen brukes som forventet resultat for beregningen, under forutsetning av at planlagte mottak kommer i tide. Kontrollberegningen for uke 2 forklarer mangelen dersom mottaket på 20 komponenter uteblir. Skal begge vises i appen slik skissen foreslår?

