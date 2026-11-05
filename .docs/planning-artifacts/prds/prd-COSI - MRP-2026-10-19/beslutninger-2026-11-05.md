---
title: COSI - MRP Beslutninger til PRD
status: besluttet
created: 2026-11-05
updated: 2026-11-05
---

# Beslutninger 2026-11-05

Sebastian gikk gjennom alle åpne spørsmål i PRD §9, antagelsene i §10, merknadene i ordbanken og de åpne punktene i `.logs/sebas/issues.md`, ett om gangen. Svarene står under. Ordbanken, `issues.md` og briefen er allerede oppdatert.

**Ført inn i `prd.md` 2026-11-05** (Update i `bmad-prd`, ikke Finalize). Arket i malen heter fortsatt MPS. «Prognostiserte behov» brukes i teksten (Sebastian, 2026-11-05).

**Endret senere samme dag (gjennomgang av UJ-2, nå UJ-3):** Tillegget i #15 om at et annet ferdigprodukt bare gir en melding, er erstattet. Appen husker siste kjøring per ferdigprodukt (varenummer på nivå 0), og hvert produkt sammenlignes med sin egen forrige kjøring (PRD FR-19–FR-21).

## A. Begreper

| # | Spørsmål | Beslutning | Endres i PRD |
|---|---|---|---|
| 1 | Del eller komponent? | «Del» er samlebegrepet for alle rader i stykklisten. «Komponent» brukes bare om typen (Komponent (Kjøpes inn), Komponent (Produseres selv)). «Kritisk komponent» blir «kritisk del». | Hele dokumentet, særlig §1, §3, FR-15, FR-16 |
| 2 | Prognostiserte behov eller MPS? | «Prognostiserte behov» i malen og appen. I dokumentene skrives «Prognostiserte behov (MPS)» første gang, og «Prognostiserte behov» etterpå. | §0 (oppdateringen 2026-10-26), §3, §4 |
| 3 | Eksepsjon eller varsel? | «Eksepsjon» overalt, også i teksten i appen. Forklaringene (FR-18) gjør begrepet forståelig. | §1 («varsler om avvik»), §4.4 |
| 4 | Øvingseksempelet (3 komponenter, 4 uker) | Slettes. Testeksempel 01–04 og valideringsfilene dekker alt. Fila finnes bare på `origin/Carmen/Branch` og `origin/Oda/Branch` (`testeksempler/ovingseksempel-3-komponenter-4-uker.md`), ikke på `main`. | – |
| 5 | Typelisten | Tre typer: Ferdigvare, Komponent (Kjøpes inn), Komponent (Produseres selv). Slik PRD-en, malen og testdataene har det. | Ingen (bekrefter dagens tekst) |

## B. Omfang og plan

| # | Spørsmål | Beslutning | Endres i PRD |
|---|---|---|---|
| 6 | 500 deler eller 1000 rader? | Inntil 1000 rader i stykklisten, slik PRD-en har det. Briefen endres ikke for dette. | Ingen |
| 7 | Frist (§9 spm. 6) | 15. desember 2026 kl. 15:00. Alt skal være ferdig og levert. | §9 spm. 6 lukkes, fristen inn der planen står |
| 8 | Brief (§9 spm. 10) | Briefen fryses. Den har fått en merknad øverst om at PRD-en gjelder foran briefen ved avvik. | §9 spm. 10 lukkes |
| 9 | Brukertest (§9 spm. 4, SM-3) | Ikke bestemt ennå. Står åpent. | §9 spm. 4 står |
| 10 | Ukeoversikt (§9 spm. 5) | Ja, som et ukefilter på listen over bestillingsforslag (FR-17): brukeren velger en uke og ser forslagene som skal frigis da. Ingen egen visning. | FR-17, §9 spm. 5 lukkes |

## C. Antagelser i §10

Bekreftede antagelser blir krav, og `[ASSUMPTION]` fjernes.

| # | Krav | Beslutning |
|---|---|---|
| 11 | FR-6 | Bekreftes for v1: et mottak kan fremskyndes fra hvilken som helst senere uke i horisonten, og hele mottaket flyttes. Omplanleggingshorisont nevnes som mulig utvidelse. |
| 12 | FR-16 | **Endres.** Tabellen følger rekkefølgen i stykklisten. Kritiske deler markeres, og sammendraget over tabellen lar brukeren gå direkte til dem. Kritiske deler flyttes ikke øverst. |
| 13 | FR-18 | **Endres.** Forklaringen åpnes ved klikk på raden eller cellen, i et panel ved siden av tabellen som står til brukeren lukker det. Virker med mus, tastatur og berøring. Ikke peking (hover). |
| 14 | FR-20 | Bekreftes: endringer som ikke påvirker bestillingsforslag eller eksepsjoner, vises ikke. |
| 15 | §4.5 Notater | Bekreftes: nye og fjernede deler vises som egne linjer. **Tillegg:** har den nye filen et annet ferdigprodukt, vises ingen sammenligning, bare en melding om at kjøringene gjelder ulike produkter. |
| 16 | FR-22 | Bekreftes: eksporten er `.xlsx`. |
| 17 | FR-23 | Bekreftes: før/etter-sammenligningen tas med i eksporten som et eget ark «Sammenligning», som i fasit 03. |
| 18 | NFR-4 | **Endres.** Appen publiseres på Vercel. Innlesing, validering, beregning og lagring av kjøringer skjer i brukerens nettleser. Opplastede filer og kjøringer sendes ikke til serveren eller til tredjepartstjenester. Konsekvens: lagrede kjøringer finnes bare i nettleseren der de ble laget. Valg av rammeverk avgjøres i arkitekturen. |
| 19 | NFR-5 | Bekreftes som mål: under 3 sekunder for 1000 rader, tre nivåer og 12 uker. Måles tidlig med en testfil på 1000 rader (`lag_testdata.py`). Holder det ikke, endres kravet med begrunnelse. |
| 20 | NFR-8 | Del 1 bekreftes: ikke farge alene. Del 2 **endres**: kolonnene med varenummer, beskrivelse og radnavn står fast når tabellen scrolles sideveis, i stedet for kravet om ingen sidescroll på 1366 px. |

## D. Lukket eller utsatt

| # | Punkt | Beslutning |
|---|---|---|
| 21 | §9 spm. 8 (meldingen for 300-003 Hjul) | Lukkes. Regelen fra 2026-11-02 gjelder: deler rett under ferdigproduktet får «Leveranse til kunde blir forsinket», og deler lenger ned får «Produksjonen av \<delen over\> blir forsinket». Fasit 01 følger regelen. |
| 22 | §9 spm. 3 (testeksempel med fast partistørrelse) | Venter til utvidelsen starter. Flyttes fra åpne spørsmål til utvidelser. |
| 23 | `issues.md`: fasit for FR-12 og FR-28 og grensetilfeller for kumulativ ledetid | Lukkes. Dekket av testeksempel 01, 02 og 04 (se dekningstabellen i `testdata/README.md`). |

## Igjen i PRD §9 etter Finalize

- Spm. 4: testpersoner og introduksjon for brukertesten (SM-3).
- Spm. 1 er besvart av del C over.
