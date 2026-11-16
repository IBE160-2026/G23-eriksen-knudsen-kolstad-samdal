---
title: Skisse – resultatside
status: utkast
created: 2026-10-13
author: Carmen Kolstad
---

# Skisse: resultatside for COSI - MRP

> **Carmens forslag – til gjennomgang i gruppen.**
>
> Skissen bygger på [øvingseksempelet med 3 komponenter og 4 uker](ovingseksempel-3-komponenter-4-uker.md). Den viser innhold og rekkefølge på siden, ikke endelig design. Appen er ikke bygget ennå.

## Begreper

- **Registrerte mottak** er leveranser fra bestillinger som allerede er lagt inn. De leses fra Excel-filen.
- **Planlagte mottak** er forslag fra beregningen. Appen sender ingen bestillinger. Det er planleggeren som bestemmer om et forslag skal bestilles.

## Forutsetninger i beregningen

- **Mottak før behov:** registrerte og planlagte mottak er tilgjengelige før ukens bruttobehov trekkes fra.
- **Samme uke som produksjonen:** komponentene brukes i samme uke som produktet produseres i MPS. Bruttobehovet for en komponent i uke *t* er altså MPS(*t*) × antall per produkt, uten forskyvning.
- **Planlagt bestillingsuke** = uken mottaket trengs − innkjøpstid. Uke 1 er planstart, så uke 0 eller tidligere betyr at bestillingen måtte vært lagt inn før planstart.
- **Ingen automatisk flytting:** verktøyet flytter ikke mottak. Hvis en bestilling ikke rekker frem, varsler verktøyet, og planleggeren bestemmer hva som skal gjøres.

## 1. Toppen av siden: datagrunnlag og valg

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  COSI - MRP                                                              │
│                                                                          │
│  Datagrunnlag:  ovingseksempel.xlsx   (lastet opp 13.10.2026 kl. 10:42)  │
│                 [ Last opp endret fil ]                                  │
│                                                                          │
│  Komponent:     [ K3 – antall per A: 2           ▼ ]                     │
│  Periode:       [ Uke 1 ▼ ]  til  [ Uke 4 ▼ ]                            │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Datagrunnlag** viser alltid navnet på filen som resultatene på siden faktisk gjelder.
- **Komponent** velges i en nedtrekksliste. Komponenter med varsler står øverst og er merket «⚠».
- **Periode** begrenser hvilke uker tabellen viser. Beregningen gjøres alltid for hele planhorisonten i filen, slik at resultatene ikke endrer seg når brukeren bytter periode.

## 2. Oversikt over alle komponenter

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Oversikt – uke 1–4                                                      │
│                                                                          │
│  Komponent   Status          Varsler                                     │
│  ─────────   ─────────────   ────────────────────────────────────────    │
│  K3          ⚠ Kritisk       Bestilling forsinket (uke 2)                │
│  K1          ✓ OK            Ingen                                       │
│  K2          ✓ OK            Ingen                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

Status vises alltid med både symbol og tekst, slik at den ikke bare skilles ut med farge.

## 3. Varsler for valgt komponent (K3)

Varslene står over tabellen, slik at brukeren ser dem før tallene. Advarselen er kort og vises alltid. Den detaljerte kontrollberegningen åpnes ved behov (se avsnitt 4).

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  ⚠ BESTILLING FORSINKET – K3, uke 2                                      │
│                                                                          │
│  20 stk må være mottatt i uke 2.                                         │
│  Nødvendig bestillingsuke: uke 0 – før planstart (uke 1).                │
│                                                                          │
│  Forventet lager i uke 2 (10 stk) forutsetter at disse 20 stk likevel    │
│  kommer i tide, for eksempel ved hasteleveranse. Verktøyet har ikke      │
│  flyttet mottaket.                                                       │
│                                                                          │
│  [ ▸ Vis kontrollberegning for uke 2 ]                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

## 4. MRP-tabell for valgt komponent (K3)

```text
K3 – antall per A: 2 · startlager: 60 · sikkerhetslager: 10 · innkjøpstid: 2 uker

                                  Uke 0    Uke 1    Uke 2    Uke 3    Uke 4
  ─────────────────────────────   ─────    ─────    ─────    ─────    ─────
  Bruttobehov                         –       40       60       50       80
  Registrerte mottak                  –        0       30        0        0
  Nettobehov                          –        0       20       50       80
  Planlagte mottak                    –        0       20 ⚠     50       80
  Forventet lager                     –       20       10 *     10       10
  Planlagte bestillinger            20 ⚠      50       80        0        0

  ⚠  Bestillingen på 20 stk skulle vært lagt inn i uke 0 (før planstart).
  *  Forutsetter at det planlagte mottaket på 20 stk kommer i uke 2.
```

- **Uke 0 er et eksempel.** Bestillinger før planstart kan også havne i uke −1 eller tidligere, avhengig av innkjøpstiden. Tabellen får da en kolonne for hver slik uke, og bare raden for planlagte bestillinger har tall der.
- **Riktig bestillingsuke vises alltid**, også når den er før planstart. Verktøyet flytter ikke bestillingen eller mottaket til en senere uke.
- **«Planlagte bestillinger»** viser hvor mye som må bestilles i hver uke. Tabellen viser alltid den beregnede planen. Mottaket i uke 2 står der det trengs.

### Kontrollberegning for uke 2 uten det planlagte mottaket

Boksen åpnes med «Vis kontrollberegning for uke 2» og vises under tabellen, ikke som en ekstra rad. Den gjelder **uke 2 alene**. Den er ikke en full alternativ plan, og uke 3 og 4 regnes ikke om. Den blandes ikke med beregningen over.

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  Hvis de 20 stk ikke kommer i uke 2 (gjelder bare uke 2)                 │
│                                                                          │
│  Lager fra uke 1 + registrert mottak:   20 + 30 =  50                    │
│  Bruttobehov uke 2:                                60                    │
│  Beregnet lager uke 2:                  50 − 60 = −10                    │
│                                                                          │
│  ⚠ 10 stk udekket behov i uke 2                                          │
│  ⚠ 20 under sikkerhetslageret                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

## 5. Endre data og beregne på nytt

Appen har ingen redigering av data i første versjon. Endringer gjøres i Excel.

```text
  1. Åpne Excel-filen og endre tallene (f.eks. MPS i uke 2 fra 30 til 20).
  2. Lagre filen.
  3. Klikk [ Last opp endret fil ] øverst på resultatsiden.
  4. Filen valideres:

     ┌────────────────────────────────────────────────────────────────┐
     │  ✓ Filen er godkjent: 3 komponenter, uke 1–4.                  │
     │  [ Beregn på nytt ]                                            │
     └────────────────────────────────────────────────────────────────┘

     Ved feil vises denne meldingen:

     ┌────────────────────────────────────────────────────────────────┐
     │  ✗ Den nye filen kunne ikke brukes. Tabellen viser fortsatt    │
     │    resultatene fra forrige fil.                                │
     │                                                                │
     │    Feil: Arket «BOM», rad 4: «Antall per A» mangler.           │
     └────────────────────────────────────────────────────────────────┘

  5. Etter «Beregn på nytt» erstattes tabellen og varslene, og
     «Datagrunnlag» øverst viser navn og tidspunkt for den nye filen.
```

Feilmeldingen er: «Den nye filen kunne ikke brukes. Tabellen viser fortsatt resultatene fra forrige fil.» Ved feil står «Datagrunnlag» øverst fortsatt med navnet på forrige fil, fordi det er den resultatene gjelder.

## Carmens anbefalinger til gruppen

Dette er mine anbefalinger. Gruppen har ikke bestemt dem ennå.

- **Anbefaling:** Den korte advarselen vises alltid. Den detaljerte kontrollberegningen åpnes ved behov.
- **Anbefaling:** Nødvendig bestillingsuke vises tydelig, også når den er før planstart (uke 0, uke −1 eller tidligere).
- **Anbefaling:** Sammenligning før og etter en endring holdes utenfor første versjon.
