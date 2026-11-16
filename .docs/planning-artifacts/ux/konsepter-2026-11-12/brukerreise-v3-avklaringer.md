---
title: Brukerreise v3 – avklaringer gruppen må godkjenne
status: forslag – ikke godkjent av gruppen
created: 2026-11-14
author: Carmen Kolstad
prototype: brukerreise-v3.html
---

# Brukerreise v3 – avklaringer

> **Forslag, ikke godkjent av gruppen.** Versjon 3 av brukerreisen (`brukerreise-v3.html`) er en minimalistisk retning med *progressive disclosure*: vis bare det kunden trenger for å ta en beslutning, alt annet ett klikk unna. PRD, EXPERIENCE.md, DESIGN.md og arkitekturdokumentene er **ikke** endret. Versjon 2 (`brukerreise-startside.html` med `konsept-4-hybrid-forbedret.html`) står uendret til sammenligning.

**Åpne:** start den lokale serveren fra prosjektroten (`python3 -m http.server 8765 --bind 127.0.0.1`) og gå til <http://localhost:8765/.docs/planning-artifacts/ux/konsepter-2026-11-12/brukerreise-v3.html>.

## Struktur i versjon 3

| Visning | Adresse | Innhold |
|---|---|---|
| Ny kjøring | `#/start` | Startsiden fra versjon 2: kort introduksjon, tre steg, opplasting, valideringsfeil øverst |
| Oversikt (standard etter opplasting) | `#/resultat` | Tre nøkkeltall, bestillingsforslag med én nedtrekksliste for uke, «Krever handling» |
| Del | `#/del/<varenummer>` | Avvik, bestillinger og delens beregning med forklaringspanel. Åpnes ved klikk på en del |
| Alle deler | `#/tabell` | Full MRP-tabell med sammendrag av kritiske deler over tabellen |
| Endringer | `#/endringer` | Før/etter-sammenligning. Bare i menyen når det finnes en tidligere kjøring |
| Kapasitet | `#/kapasitet` | Produksjonskapasitet. Bare i menyen når trinn 4 er valgt |
| Lagrede kjøringer | `#/lagret` | Siste kjøring per ferdigprodukt, med sletting |
| Veiledning | `#/veiledning` | Den utfyllende veiledningen (stykkliste, MPS, planlagte mottak, sjekkliste) |

## Avklaringer

| # | Avklaring | Forslag i v3 | Berører |
|---|---|---|---|
| 1 | Skal resultatet deles i visninger som sidemenyen bytter mellom, i stedet for én lang side? | Ja, med én adresse per visning, så tilbake-knappen virker | EXPERIENCE.md (Resultatside: «alt om én kjøring, i fast rekkefølge»), PRD §4.4 |
| 2 | PRD §4.4 sier at brukeren ser bestillingsforslag, deretter kritiske deler og så tabellen. Holder det at rekkefølgen gjelder Oversikt (forslag, så «Krever handling»), og at tabellen er én visning unna? | Ja. Tabellen finnes og er komplett i «Alle deler» (FR-14), og sammendraget står over tabellen der (FR-16) | PRD §4.4, FR-14, FR-16 (tolkning) |
| 3 | Del-visning som egen visning når brukeren klikker på en del, med delens tabell og forklaringspanel | Ja. FR-16 («velger brukeren en del i sammendraget, vises delens tabell») oppfylles i Del-visningen | FR-16, FR-18 |
| 4 | Nøkkeltall: hvilke og hvor mange? | Tre: bestillinger i uke 1, med forfalt mengde, deler som krever handling. Et fjerde (endringer) bare ved sammenligning | Ny i EXPERIENCE.md |
| 5 | Standardfilter for bestillingsforslag (åpen designbeslutning 3) | «Alle uker», med uke 1 merket «Bestill nå». Ukefilteret er én nedtrekksliste | FR-17, EXPERIENCE.md |
| 6 | Avvik vises med norsk navn og uke (for eksempel «Bestilling forsinket · uke 1»), med symbolet bare som støtte | Ja. Meldingen står i Del-visningen: første setning synlig, resten under «Les mer og hvorfor» | FR-15, NFR-8, SM-3 |
| 7 | Ordet i appen: ordbanken sier at «eksepsjon» brukes i teksten i appen (besluttet 2026-11-05), og at «avvik» er situasjonen som gir eksepsjonen | v3 følger ordbanken: radnavnet «Eksepsjoner» i tabellen og typenavnene («Bestilling forsinket» osv.) overalt. Overskriften på Oversikt er «Krever handling», et nytt UI-uttrykk som ikke står i ordbanken. Vil gruppen heller bruke «avvik» i appen for brukere uten MRP-bakgrunn, må beslutningen fra 2026-11-05 endres | Ordbanken, FR-9–FR-13 |
| 8 | «Last opp ny fil» fjernes fra kjøringslinjen. «Ny kjøring» i menyen gjør det samme | Ja. Resultatet står urørt under Resultat når en ny fil har feil | EXPERIENCE.md (Kjøringslinje) |
| 9 | Den utfyllende veiledningen er en egen visning. Startsiden beholder trestegsveiledningen og en lenke «Slik fyller du ut malen» | Ja | FR-27, EXPERIENCE.md (Første/Senere besøk) |
| 10 | Lagrede kjøringer er en egen visning, ikke en seksjon på startsiden | Ja | FR-21, EXPERIENCE.md (Lagrede kjøringer: «Startside») |
| 11 | Endringer vises på Oversikt bare som nøkkeltall, merker ved bestillingsforslagene («Ny», «Endret (45 → 60)») og en egen visning | Ja | FR-20 |
| 12 | Kapasitet er en egen visning når trinn 4 bygges | Ja. Uten trinn 4 finnes verken valget, menypunktet eller visningen | FR-30–FR-34, PRD §7.1 |
| 13 | «Regelen» i forklaringspanelet er lukket som standard («Regelen ▸») | Ja. Svar, utregning og avvik står åpent | FR-18 (alle fire lagene finnes fortsatt) |
| 14 | Resultatet beholdes når siden lastes på nytt i samme fane (sesjonslagring) | Bare i prototypen, for manuell testing. Appen må avgjøre dette i arkitekturen | NFR-10 |

## Funksjonskrav som er beholdt

FR-14–FR-23 og FR-27 finnes alle i v3. FR-30–FR-34 finnes som valgfri visning. Kontrollert med en automatisk test i Chrome (76 kontroller, se sesjonsloggen 2026-11-14). Kontrollene dekker:

- tallene i forklaringen for 300-003 Hjul, uke 1, sammenlignet med FR-18
- 59 bestillingsforslag og filteret på uke 1 (FR-17)
- 4 kritiske deler (FR-16)
- 11 linjer i sammenligningen 02 → 03 (FR-20)
- «Ingen endringer» når samme fil lastes opp to ganger
- sletting med bekreftelse i siden (FR-21)

## Hva som bare er prototype

- Filen leses ikke. Filnavnet avgjør testdataene: «02» eller «03» gir Kontorstol Pro, alt annet gir testeksempel 01. Det står i den gule linjen og i merket «Testdata: fasit for testeksempel …» i kjøringslinjen.
- Valideringsfeilene er alltid eksempelet fra UJ-4, og vises bare når «Neste opplasting gir valideringsfeil» er slått på under Prototypevalg.
- Eksporten lager ingen fil.
- Kapasitetstallene for testeksempel 01 er ikke manuelt kontrollert.
- Versjon 3 lagrer kjøringer under en egen nøkkel i nettleseren (`cosi-proto-v3-runs`), så den ikke blander seg med versjon 2.
