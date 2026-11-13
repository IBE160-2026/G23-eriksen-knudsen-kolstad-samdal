---
title: COSI - MRP Beslutninger etter faglærers tilbakemelding
status: besluttet
created: 2026-11-13
updated: 2026-11-13
---

# Beslutninger etter faglærers tilbakemelding (ført inn 2026-11-13)

Faglærer ga formativ tilbakemelding på PRD-en 2026-11-12 (`tilbakemelding-prd.md`). Sebastian gikk gjennom alle punktene 2026-11-13 og valgte ett alternativ for hvert. Beslutningene er ført inn i `prd.md`, `addendum.md` og `.docs/ordbank.md` samme dag. Punkt 1–4 og brukertesten (5–7) er sendt til gruppen for bekreftelse.

| # | Punkt i tilbakemeldingen | Beslutning | Endret i PRD |
|---|---|---|---|
| 1 | 4.1 Minstegrense for v1 | Minstekravet for innlevering er trinn 1–3 i §7.1 (FR-1–FR-23 og FR-27–FR-29), og de skal bestå SM-1, SM-2 og SM-4. Trinn 4 (produksjonskapasitet) og trinn 5 (fast partistørrelse) kuttes først. | §7.1, FR-oversikten i §4, §4.7, §4.9 |
| 2 | 4.1 Når og hvordan kuttet avgjøres | Trinn 1–3 skal være testet innen 30. november 2026. Gruppen avgjør da sammen på et møte om trinn 4–5 startes. Rettelser etter brukertesten går foran trinn 4. | §7.1 |
| 3 | 4.2 Brukerreise for kapasiteten | Egen UJ-5: Kari svarer på en hasteforespørsel med produksjonskapasiteten (tallene fra testeksempel 05). | §2.3 UJ-5, §4.9, FR-30–FR-34 |
| 4 | §6 Mac og Excel til NFR-11 | Carmen tester med sin Mac og Excel. | Addendum (Excel for Windows og macOS) |
| 5 | 4.3 SM-3 målbar | Tre oppgaver: finn en kritisk del, forklar en eksepsjon med egne ord, og les av mengde og frigivelsesuke for ett bestillingsforslag. Riktig svar innen 3 minutter uten hjelp. Alle skal løse alle. Feiler to eller flere på samme oppgave, endres teksten eller layouten. | SM-3 |
| 6 | 4.3 Dato for brukertesten | 2.–7. desember 2026, med prøvetest med et gruppemedlem rundt 27. november. Testen bruker bare trinn 1–2. | §8.1 |
| 7 | §9 nr. 4 Hvor resultatet dokumenteres | Egen fil: `.docs/brukertest/brukertest-resultat.md`. | §8.1, §9 nr. 4 (gjelder nå bare introduksjonen) |
| 8 | 4.2 og §5 FR-ene står ikke i tallrekkefølge | Oversiktstabell først i §4. ID-ene beholdes. | §4 |
| 9 | 4.4 Regneeksempel i FR-6 | Forslaget fra tilbakemeldingen, kontrollert mot `mrp_del` og for hånd. Nettobehovet i uke 3 er 40 før fremskyndingen og 0 etter, og tabellen viser 0. | FR-6 |
| 10 | 4.5 Teknologi i kravene | NFR-3, NFR-4 og NFR-10 beskriver atferd. Vercel og lagringsteknologien står i addendum («Innspill til arkitekturen»). | NFR-3, NFR-4, NFR-10 |
| 11 | §5 Ordbruk i FR-31–FR-34 | «Produksjonskapasitet» brukes første gang i hvert krav. | FR-31–FR-34 |
| 12 | §6 Måling av NFR-5 | Tidlig i utviklingen, som planlagt 2026-11-05. | Ingen endring |
| 13 | §7 Refleksjonsspørsmålene | Besvares i sluttrapporten. | Ingen endring |
| 14 | §3 Lengden på PRD-en | Beholdes. FR-oversikten gjør det lettere å finne fram. | Ingen endring |

## Hvorfor brukertesten ikke er 30. november

Først ble brukertesten satt til 30.11–07.12, samme dag som kuttbeslutningen. Da måtte kjernen være brukbar for testpersoner samme dag som gruppen avgjør om den er testet. Brukertesten bruker bare trinn 1–2 (opplasting, beregning, eksepsjoner, resultattabell, bestillingsforslag og forklaringer), og ikke lagring, sammenligning og eksport. Testen starter derfor 2. desember, slik at det er to dager til å rette det kuttmøtet finner, og åtte dager igjen til fristen etter siste test.

## Valg gjort da beslutningene ble ført inn

- **Minstekravet** er skrevet som FR-1–FR-23 og FR-27–FR-29, fordi FR-27–FR-29 også hører til trinn 1. Tilbakemeldingen skrev bare FR-1–FR-23.
- **UJ-5** bruker tallene fra testeksempel 05 (Kontorstol Kompakt): kapasitet 30 i uke 5 på begge radene, 35 fra uke 7 med planlagte mottak, og ryggplate (300-033) som begrensende del på grunn av lageret. Fasit 05 er ikke kontrollert for hånd ennå.
- **NFR-4** har fått setningen «Opplastede filer forlater aldri brukerens maskin», og **NFR-10** har fått «Siste kjøring finnes etter at nettleseren er lukket og åpnet igjen», slik tilbakemeldingen foreslo.
