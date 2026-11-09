---
title: COSI - MRP Beslutninger fra gruppemøtet
status: besluttet
created: 2026-11-09
updated: 2026-11-09
---

# Beslutninger fra gruppemøtet (ført inn 2026-11-09)

Gruppen gikk gjennom PRD-ene på grenene (møteside: https://claude.ai/artifact/83NFSnwVy3SsTA9hpZK321) og tok stilling til de fire punktene under «Til avgjørelse på møtet». Sebastian ga beslutningene videre 2026-11-09, og de er ført inn i `prd.md`, `addendum.md` og `.docs/ordbank.md` samme dag.

| # | Spørsmål på møtet | Beslutning | Endret i PRD |
|---|---|---|---|
| 1 | Skal Iduns produksjonskapasitet fra lager inn i v1, eller vente til etter fristen 15.12? | **Med i v1.** Først formidlet som «avvent», men rettet av Sebastian samme dag (se under). | §4.9, §7.1 trinn 4, SM-7 |
| 2 | Hvilke av Carmens ekstra NFR-er tar vi inn? | NFR-05, NFR-09, NFR-11 og NFR-12 fra `prd-carmen-utkast.md`. | NFR-9 (fra NFR-05), NFR-10 (fra NFR-09), NFR-11 (fra NFR-11). NFR-12 er skrevet inn i NFR-1 og NFR-2, fordi de overlappet. Se addendum. |
| 3 | Er vi enige om byggerekkefølgen? | Ja, slik den står i PRD §7.1. | Ingen endring i teksten |
| 4 | Brukertesten (SM-3): testpersoner, introduksjon og dokumentasjon | Testpersonene og prosedyren er besluttet (teksten under). Hva introduksjonen og oppgavene inneholder, og hvor resultatet dokumenteres, er ikke besluttet. | Ny §8.1, SM-3 («alle testpersonene» i stedet for «3 av 3»), §9 nr. 4 snevret inn |
| 5 | (Nytt på møtet) | F3 fra Iduns PRD-utkast (`prd-COSI - MRP-2026-11-04/prd.md` på `Idun/Branch`) tas inn i PRD-en og i v1. | Ny §4.9 med FR-30–FR-34, nye begreper i §3 |

**Punkt 1 og 5:** F3 er nettopp produksjonskapasiteten fra punkt 1. De ble først lest som «beskrives nå, bygges etter v1». Sebastian rettet det samme dag: F3 skal inn i v1.

## F3 i v1 (Sebastian, 2026-11-09)

| Spørsmål | Beslutning |
|---|---|
| Plass i byggerekkefølgen (§7.1) | Trinn 4, etter lagring, sammenligning og eksport. Fast partistørrelse blir trinn 5. |
| MPS må fylles ut også når bare kapasiteten vises (FR-30) | Bekreftet. |
| En kjøring med bare kapasiteten lagres ikke, og kapasiteten er ikke med i eksporten (FR-30) | Bekreftet. |
| Ferdigproduktets eget lager (FR-31) | Telles med: ledig beholdning av ferdigproduktet legges til. |
| Lager av deler som produseres selv brukes før underdelene (FR-31) | Bekreftet. |
| Ledetid (FR-31, FR-32) | Er med. Kapasiteten i uke t er det som kan være ferdig innen uke t. |

PRD-en ble satt til `final` etter dette.

## Teksten om brukertesten (punkt 4)

Slik gruppen skrev den. Omskrevet til PRD-ens begreper i §8.1 («kritisk komponent» er «kritisk del», «bestillingsuke» er «frigivelsesuke», og «avsnitt 5» er SM-3).

> **Testpersoner for brukstesting**
> Hvert gruppemedlem rekrutterer 1–2 testpersoner, totalt ca. 4–8 personer. Det tilstrebes variasjon i testpersonenes bakgrunn, blant annet når det gjelder erfaring med innkjøp og produksjonsplanlegging, Excel-ferdigheter og faglig kompetanse. Formålet er å undersøke hvordan verktøyet fungerer for brukere med ulik erfaring og kompetanse.
> Det stilles ikke krav om tidligere erfaring med verktøyet, ettersom et av suksesskriteriene (avsnitt 5) er at brukeren skal kunne identifisere kritisk komponent, bestillingsmengde og bestillingsuke etter kun en kort introduksjon.
> For å sikre sammenlignbare og pålitelige resultater gjennomføres testene individuelt og etter en standardisert prosedyre. Alle testpersonene får den samme introduksjonen og de samme oppgavene, uten veiledning under selve oppgaveløsningen. Eventuelle tekniske problemer kan avklares av testleder, uten at dette påvirker hvordan oppgavene løses.

## Valg gjort da beslutningene ble ført inn

Disse valgene ble gjort da beslutningene ble skrevet inn, og gruppen bør se over dem:

- **SM-3:** «3 av 3 testpersoner» er endret til «alle testpersonene», som holder kravet på samme nivå med 4–8 personer.
- **Carmens NFR-12** er ikke et eget krav, men skrevet inn i NFR-1 og NFR-2.
- **«Ledig beholdning»** er brukt om lager minus sikkerhetslager i F3, fordi «disponibel beholdning» allerede betyr noe annet (FR-6).
- **Iduns graf over prognostiserte behov** (fra F1 og F2 i utkastet) er ikke tatt inn, fordi bare F3 ble besluttet.
