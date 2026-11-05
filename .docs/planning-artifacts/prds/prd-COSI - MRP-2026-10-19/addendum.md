---
title: COSI - MRP PRD – Addendum
status: draft
created: 2026-10-19
updated: 2026-11-05
---

# Addendum til PRD

Bakgrunn, begrunnelser og tekniske innspill fra PRD-arbeidet som ikke hører hjemme i selve PRD-en. Ved avvik gjelder `prd.md`. Briefen er frosset, og PRD-en gjelder foran briefen. Beslutningene fra 2026-11-05 står i `beslutninger-2026-11-05.md`, og hele sporet av beslutninger i `.memlog.md`.

**Hvor du begynner:**
- **Arkitektur:** «Innspill til arkitekturen».
- **UX:** «Innspill til UX».
- **Epics:** «Innspill til epics: faseplan».
- **Sensor og gruppen:** «Bakgrunn for valg i PRD-en», «Begrunnelse fra research», «Endringshistorikk», «Lukkede spørsmål» og «Antagelser som ble besluttet».

## Innspill til arkitekturen

### Publisering, data og lagring

- **Publisering og data (NFR-4):** Appen publiseres på Vercel, som bare leverer appens kode. Innlesing, validering, beregning og lagring skjer i nettleseren, og opplastede filer og kjøringer sendes ikke til serveren eller til tredjepartstjenester. Arkitekturen velger rammeverk og må sikre at ingen del av løsningen, for eksempel serverfunksjoner eller analyseverktøy, sender data ut.
- **Lagring av siste kjøring per ferdigprodukt (FR-19):** Uten innlogging og serverlagring er nettleserens lokale lagring (for eksempel `localStorage` eller IndexedDB) det naturlige stedet. Det lagres én kjøring per ferdigprodukt, med varenummeret på nivå 0 som nøkkel, fordi brukeren planlegger flere produkter hver dag. En kjøring med 1000 rader og 12 uker er liten, men med flere produkter bør arkitekturen sjekke grensen for `localStorage` (ca. 5 MB) eller velge IndexedDB. Arkitekturen velger og begrunner.
- **Ny opplasting gir alltid sammenligning (FR-19, FR-20):** Når planen flyttes én uke fram, slik at en ny uke blir uke 1, sammenlignes den nye kjøringen likevel med forrige, og sammenligningen viser da mange endringer. Arkitekturen trenger ikke å kjenne igjen ukeskiftet.
- **Ytelse (NFR-5):** Mål ytelsen tidlig i utviklingen med en testfil på 1000 rader. Den må lages med `testdata/lag_testdata.py`, som ikke lager en slik fil ennå. Nås ikke målet på 3 sekunder, endres kravet med begrunnelse.

### Beregningsmotoren

- **Beregning skilt fra resten (NFR-1):** Beregningen bør være en ren funksjon med inndata (stykkliste, prognostiserte behov, planlagte mottak) og utdata (resultattabell, eksepsjoner). Excel-lesing, lagring og visning kaller den. Da kan testene bruke fasiten direkte.
- **Testene bruker fasitfilene, ikke skriptet:** `testdata/lag_testdata.py` inneholder en referanseberegning (`beregn`). Appen bør ikke importere skriptet. Testene skal sammenligne med fasitfilene, som er kontrollert for hånd.
- **Flernivå beregning (FR-5, FR-28):** Stykklisten leses som en liste av rader der overordnet del er nærmeste rad over med ett nivå høyere. Bygg en graf fra varenummer til overordnede varenumre med antall, regn ut lavnivåkoden per varenummer og beregn delene sortert etter lavnivåkode. Ledetiden fra ferdigproduktet (FR-9) kan regnes i samme gjennomløp ovenfra: delens egen L pluss den største ledetiden fra ferdigproduktet blant de overordnede delene. Fremskynding av mottak (FR-6) gjøres i nettobehovsberegningen per del før planlagte ordremottak lages. Nettobehovsberegningen bruker beholdning(t−1) fra FR-6, der fremskyndede mottak er tatt med, mens den viste forventede lagerbeholdningen er uten dem (FR-7). FR-29 krever at delen beregnes én gang til for hvert planlagte mottak, uten det mottaket. `beregn` i `lag_testdata.py` gjør alt dette og har laget fasitene for testeksempel 01–04.
- **Slutten av horisonten:** Behov etter uke H er ikke med i beregningen. Deler med lang ledetid fra ferdigproduktet kan derfor se ut til ikke å trenge bestilling, og det rammer delene nederst i stykklisten først. FR-9 dekker tilfellet der ledetiden fra ferdigproduktet er ≥ H, men ikke en del med kortere ledetid fra ferdigproduktet som har behov rett etter H. Av samme grunn kan FR-29 foreslå å kansellere et mottak som trengs rett etter horisonten.

### Excel inn og ut

- **Lesing og skriving av Excel (FR-1–FR-4, FR-22):** Nivå er lagret som tekst (`0`, `.1`, `..2`), og Excel kan ha lagret `0` som tall. Varenummer kan også være lagret som tall hvis brukeren har skrevet bare sifre. Les begge som tekst. Malen har formler i hjelpekolonnene og ferdige, tomme rader med formatering helt ned til rad 1001, så stykklisten slutter ved første rad der både Nivå og Varenummer er tomme. Arket med prognostiserte behov heter MPS, og kolonnen heter «Antall ferdigprodukter». Eksporten trenger et bibliotek for å skrive Excel, og det kan være det samme som brukes til lesing.
- **Valideringsreglene (FR-3):** Reglene er de samme som i datavalideringen og Kontroll-formlene, som lages av `lag_mal` og `kontroll` i `lag_testdata.py`. Endres malen, må både appens validering og skriptet oppdateres.

### Tekster

- **Tekster samlet (NFR-7):** Meldinger og etiketter bør ligge samlet, så engelsk kan legges til uten å endre beregningen.

## Innspill til UX

- **Forklaringspanel og tabell (FR-18, NFR-8):** Forklaringen åpnes ved klikk og vises i et panel ved siden av tabellen. Den må virke med tastatur og berøring. Kolonnene med varenummer, beskrivelse og radnavn står fast ved sidescroll.
- **Slutten av horisonten (FR-9, FR-29):** Vurder å skrive i meldingene for FR-9 og FR-29 og i forklaringen at de bare gjelder innenfor horisonten (se «Beregningsmotoren»).
- **Ordlyden i meldingene (FR-13):** Ordlyden er ikke et krav, bare opplysningene i meldingen. Tekstene i fasitene kan derfor forbedres i UX-steget.

## Innspill til epics: faseplan

Faseplanen i briefens addendum (`briefs/brief-COSI - MRP-2026-09-13/addendum.md`) er grunnlaget for epics, slik faglærer anbefalte. Rekkefølgen i PRD §7.1 bygger på den:

| Fase i briefen | Innhold | PRD |
|---|---|---|
| 1 Datamodell og grunnlag | Lese stykkliste, prognostiserte behov, lagerbeholdning, ledetid og sikkerhetslager. Testdata med fasit | FR-1–FR-4, testdata |
| 2 Nettobehovsberegning | Flernivå, nivå for nivå, sikkerhetslager, felles deler | FR-5–FR-7, FR-28 |
| 3 Bestillingsforslag | Offset med ledetid, lot-for-lot, grensetilfeller | FR-8, FR-17 |
| 4 Eksepsjoner | Fem typer (briefen hadde fire; Kanseller mottak kom til 2026-11-02) | FR-9–FR-13, FR-29 |
| 5 Brukergrensesnitt | Resultattabell, fremheving, forklaringer, brukertest | FR-14–FR-16, FR-18, FR-27, SM-3 |
| 6 Realistisk scenario | Endring midtveis, før/etter-sammenligning, eksport | FR-19–FR-23, SM-5 |
| 7 Fast partistørrelse | Planlagt utvidelse | FR-24–FR-26 |

Prinsippet fra briefen gjelder fortsatt: hver fase leverer kode, testdata og dokumentert testresultat (samsvar eller avvik), så fremgangen kan vises til emneansvarlig underveis.

## Bakgrunn for valg i PRD-en

- **Rask vei:** PRD-en ble skrevet på rask vei 2026-10-19: et fullt utkast med antagelser merket, som gruppen så retter. Alt tilgjengelig materiale ble regnet som bestemt, og utkastet er rettet i flere runder siden (se «Endringshistorikk»).
- **Eksport i v1:** Sebastian ønsket at brukeren skal kunne lagre resultatet selv. Det dekker også behovet for å ta vare på flere kjøringer uten brukerkontoer, siden appen bare husker den siste kjøringen per ferdigprodukt.
- **Forfalte frigivelser (2026-10-19):** De legges i uke 1 sammen med vanlige frigivelser, og eksepsjonen oppgir hvor mye som er forfalt. Se FR-7 og FR-8 under «Begrunnelse fra research».
- **Språk:** Norsk i v1, deretter engelsk, så flere språk på lengre sikt.
- **Flernivå BOM i v1 (2026-10-26):** Briefen flyttet 2026-10-22 flernivå BOM inn i v1. Malen har tre nivåer (0, .1, ..2), slik testeksempelet i briefen krever. Ferdigproduktet beregnes med full MRP, slik at lager, sikkerhetslager og ledetid på nivå 0 får betydning. Med 0 i alle tre blir resultatet det samme som når prognostiserte behov ganges rett inn i nivå .1.
- **Typer:** Ferdigvare, Komponent (Kjøpes inn) og Komponent (Produseres selv). Delmontering og råvaretypene ble fjernet 2026-10-26, fordi de ikke endrer beregningen og gjorde listen lengre enn nødvendig.
- **Ingen innliming (FR-3):** Malen ber brukeren om ikke å lime inn i celler med nedtrekksliste (Nivå og Type i Stykkliste, og Varenummer i Planlagte mottak). Excel kan ikke hindre det uten makroer, og malen skal være en vanlig `.xlsx`. Innliming fjerner både listen og valideringen i cellen, og brukeren kan også ha brukt et annet regnearkprogram som ikke håndhever valideringen. Derfor står regelen i arket Veiledning, Kontroll-kolonnen fanger ugyldige nivåer og typer, og appen validerer alt på nytt.
- **Felles deler mellom produkter (2026-11-05):** Sebastian ønsker samlet planlegging av flere ferdigprodukter, men som første utvidelse etter v1 på grunn av fristen. I v1 fordeler brukeren selv lageret for deler som brukes i flere ferdigprodukter, mellom filene (PRD §6, FR-27).

## Begrunnelse fra research om MRP-reglene (2026-11-02)

Reglene i FR-6–FR-13, FR-28 og FR-29 er sjekket mot ASCM Supply Chain Dictionary (18. utg., 2024), lærebøker (Krajewski m.fl., Nahmias), kursmateriale og dokumentasjonen til SAP, Oracle, Dynamics 365, Infor, Odoo og ERPNext. Rapporten med kilder: `.docs/planning-artifacts/research/academic-lit-mrp-regler-forfalte-ordrer-eksepsjoner-h-2026-11-02/research.md`. Hovedlærebøkene (Jacobs m.fl. *MPC* og Ptak & Smith *Orlicky's MRP*) var ikke tilgjengelige og er ikke lest.

- **Forfalt frigivelse i uke 1 (FR-8), beholdt.** Oracle viser forfalt forsyning og behov i første periode, og alle kildene markerer forfalte frigivelser. Hver forfalt frigivelse gir alltid eksepsjonen i FR-10 eller FR-11, fordi nettobehov > 0 betyr disponibel < SS.
- **Forfalt ordremottak i behovsuken (FR-7), beholdt som forenkling.** Oracle beholder forfallsdatoen og rapporterer hvor mye ledetiden må komprimeres. SAP S/4HANA, Dynamics 365 og Infor planlegger i stedet fremover fra i dag, slik at mottaket kommer i uke 1 + L og mangelen vises i forventet lagerbeholdning. Vi har valgt den første varianten fordi den er enklere å forklare, og fordi FR-10-meldingen allerede oppgir tidligste mottaksuke. Hva det betyr for tabellen, står i FR-7.
- **Mottak forsinket (FR-6, FR-12), endret.** Et senere planlagt mottak regnes nå som fremskyndet til uken det trengs, og nye ordrer lages bare for et restbehov. Den gamle regelen lagde både et nytt bestillingsforslag og et forslag om å fremskynde mottaket, så samme behov ble dekket to ganger. Ifølge ASCM antar MRP at planlagte mottak kan fremskyndes lettere enn nye ordrer kan frigis og mottas, og lager derfor planlagte ordremottak først når alle planlagte mottak er brukt (omplanleggingsantakelsen, *rescheduling assumption*, s. 164). SAP lager nytt forslag bare hvis mottaksmengden er for liten. Omplanleggingshorisont, som begrenser hvor langt fram et mottak kan hentes fra, er ikke tatt med i v1 (PRD §7.2).
- **Ledetid overskrider horisont (FR-9), endret.** ASCM sier at horisonten minst skal dekke kumulativ ledetid (s. 141), og Dynamics 365 krever at horisonten er lengre enn «total lead time». Med tre nivåer kan en sti bryte regelen uten at noen enkelt ledetid er ≥ H. Vi kontrollerer derfor ledetiden fra ferdigproduktet for hver del, slik at eksepsjonen står på delen som ikke kan bestilles i tide.
- **Kanseller mottak (FR-29), ny.** ASCM nevner frigi, fremskynd, utsett og kanseller som typiske eksepsjoner. SAP og Oracle har alle fire. «Utsett mottak» er utelatt med vilje: en eksepsjon for et mottak som kommer litt tidlig, men trengs senere, gir mye støy og lite å handle på (SM-C2). Oracle demper slike meldinger av samme grunn (*acceptable early days*). Under kontrollen fremskyndes ingen andre mottak, ellers kunne appen rådet til å kansellere et tidlig mottak og samtidig fremskynde et senere (Sebastian, 2026-11-02).
- **Bestilling forsinket og bruk av sikkerhetslager (FR-10, FR-11), beholdt.** Research foreslo å utløse dem når beholdningen går under 0 eller SS uansett årsak. Med nettobehov = maks(0, SS − disponibel) ville eksepsjonene slått til for hver vanlig ordre. Når mottak antas å komme i tide (FR-7), oppstår et reelt brudd bare ved forfalt frigivelse (FR-10, FR-11) eller forsinket mottak (FR-12). Koblingen til forfalt frigivelse er derfor riktig.
- **Flere eksepsjoner per uke, beholdt.** SAP lagrer bare den viktigste meldingen per ordre. Med fem typer, der FR-10 og FR-11 allerede utelukker hverandre, ville én eksepsjon per uke skjule for eksempel «Mottak forsinket» bak «Bestilling forsinket».
- **Felles deler på lavnivåkode (FR-28), bekreftet.** ASCM (s. 109), Krajewski og SAP beskriver det samme.
- **Ikke tatt med:** dempingsterskler (*dampeners*) og frysing (*time fence*). Forskningen på nervøsitet i planen (*system nervousness*) gjelder gjentatte kjøringer med rullerende horisont. Appen gjør én kjøring om gangen.

## Endringshistorikk for PRD-en

- **2026-10-19:** Første utkast på rask vei (FR-1–FR-27, NFR-1–NFR-8, SM-1–SM-6).
- **2026-10-26:** Flernivå BOM med i v1, slik briefen sier fra 2026-10-22. Excel-malen bygd om: arkene Produkt og Komponenter er erstattet av Stykkliste, arket med prognostiserte behov heter MPS, og «innkjøpstid» heter nå «ledetid». Ny FR-28 (felles deler).
- **2026-11-02:** Reglene avstemt mot research (FR-6–FR-13, FR-28). Ny FR-29 (Kanseller mottak).
- **2026-11-05:** Alle åpne spørsmål og antagelser besluttet (`beslutninger-2026-11-05.md`). «Del» er samlebegrepet, og «komponent» brukes bare i typenavnene. «Prognostiserte behov» erstatter «MPS» i teksten, men arket heter fortsatt MPS. «Eksepsjon» brukes overalt. Brukerreisene gjennomgått med Sebastian og nummerert om (UJ-1, der Kari tar i bruk COSI - MRP første gang, er ny). Lagring per ferdigprodukt, byggerekkefølge og begrensningen for deler som brukes i flere ferdigprodukter, lagt inn. Gjennomgått mot kildene og kvalitetssjekklisten, og strammet inn. Gruppen går gjennom PRD-en før den settes til `final`.

## Lukkede spørsmål (fra PRD §9)

Numrene er de samme som i PRD §9.

- **1.** Bekrefte eller endre antagelsene i PRD §10. **Løst 2026-11-05:** alle er bekreftet eller endret (se Antagelser som ble besluttet).
- **2.** Testeksempel med endrede prognostiserte behov for før/etter-sammenligningen (FR-20, SM-5). **Løst 2026-11-05:** testeksempel 03 med fasit og arket Sammenligning.
- **3.** Testeksempel med fast partistørrelse (FR-25). **Flyttet 2026-11-05** til utvidelsen (PRD §4.7). Lages når utvidelsen starter.
- **5.** Egen ukeoversikt over bestillingsforslag. **Løst 2026-11-05:** ukefilter på listen over bestillingsforslag (FR-17), ingen egen visning.
- **6.** Frist. **Løst 2026-11-05:** 15. desember 2026 kl. 15:00 (PRD §7).
- **7.** Testeksempel med 5–10 deler på 3 nivåer og felles del (FR-5, FR-28, SM-1). **Løst 2026-11-05:** testeksempel 02 (Kontorstol Pro, 8 deler på 3 nivåer, felles del 300-002) med fasit.
- **8.** Meldingen i «Bestilling forsinket» for 300-003 Hjul. **Løst 2026-11-05:** regelen fra 2026-11-02 gjelder (FR-10). Hjul står rett under ferdigproduktet og får «Leveranse til kunde blir forsinket». Fasit 01 følger regelen.
- **9.** Fasit for 300-005 Gassfjær etter FR-6/FR-12. **Løst 2026-11-02:** `beregn()` og fasiten er oppdatert.
- **10.** Oppdatere briefen med de nye eksepsjonsreglene. **Løst 2026-11-05:** briefen er frosset, og en merknad øverst sier at PRD-en gjelder ved avvik.
- **11.** Testtilfeller for FR-9 (ledetid fra ferdigproduktet) og FR-29. **Løst 2026-11-05:** testeksempel 02 har et mottak som ikke trengs (300-005 i uke 5), og testeksempel 04 har tilfellet for FR-9 (300-022, 1 + 4 + 7 = 12 = H).

## Antagelser som ble besluttet (fra PRD §10)

| Krav | Beslutning 2026-11-05 |
|---|---|
| FR-6 Fremskynding fra hvilken som helst senere uke | Bekreftet. Omplanleggingshorisont er en mulig utvidelse (PRD §7.2). |
| FR-16 Kritiske deler øverst | Endret. Tabellen følger stykklisten, og sammendraget leder til de kritiske delene. |
| FR-18 Forklaring ved peking eller klikk | Endret. Forklaringen åpnes ved klikk, ikke ved peking, og vises i et panel ved siden av tabellen. Den virker med mus, tastatur og berøring. |
| FR-20 Endringer uten betydning vises ikke | Bekreftet. |
| FR-20 Nye og fjernede deler | Bekreftet. Tillegget om at opplasting av et annet ferdigprodukt bare gir en melding, ble erstattet samme dag av lagring per ferdigprodukt (FR-19). |
| FR-22 Eksportformat | Bekreftet: `.xlsx`. |
| FR-23 Sammenligning i eksporten | Bekreftet: eget ark «Sammenligning». |
| NFR-4 Data sendes ikke ut | Endret. Appen publiseres på Vercel, og alt skjer i nettleseren. |
| NFR-5 Under 3 sekunder | Bekreftet som mål, måles tidlig. |
| NFR-8 Ingen sidescroll på 1366 px | Første ledd bekreftet. Andre ledd endret til faste kolonner ved sidescroll. |
