---
title: COSI - MRP PRD – Addendum
status: draft
created: 2026-10-19
updated: 2026-11-02
---

# Addendum til PRD

Bakgrunn og tekniske innspill fra PRD-arbeidet som hører hjemme i arkitekturen eller senere dokumenter, ikke i selve PRD-en. Ved avvik gjelder `prd.md`.

## Innspill til arkitekturen

- **Lokal lagring av siste kjøring (FR-19):** Uten innlogging og serverlagring er nettleserens lokale lagring (for eksempel `localStorage` eller IndexedDB) det naturlige stedet. Arkitekturen bør velge og begrunne. En kjøring med 1000 rader i stykklisten og 12 uker er liten nok for begge.
- **Beregning skilt fra resten (NFR-1):** Beregningen bør være en ren funksjon med inndata (stykkliste, MPS, planlagte mottak) og utdata (resultattabell, eksepsjoner). Excel-lesing, lagring og visning kaller den. Da kan testene bruke fasiten direkte.
- **Samme beregning for fasit og app:** `testdata/lag_testdata.py` inneholder en referanseberegning (`beregn`). Appen bør ikke importere skriptet. Testene skal sammenligne med fasitfilene, som er kontrollert for hånd, ikke med skriptet.
- **Valideringsreglene (FR-3)** er de samme som datavalideringen og Kontroll-formlene i `lag_testdata.py` (`lag_mal` og `kontroll`). Endres malen, må begge oppdateres.
- **Flernivå beregning (FR-5, FR-28):** Stykklisten leses som en liste av rader der overordnet del er nærmeste rad over med ett nivå høyere. Bygg en graf fra varenummer til overordnede varenumre med antall, regn ut lavnivåkoden per varenummer og beregn delene sortert etter lavnivåkode. Ledetiden fra ferdigproduktet (FR-9) kan regnes i samme gjennomløp ovenfra: delens egen L pluss den største ledetiden fra ferdigproduktet blant de overordnede delene. Fremskynding av mottak (FR-6) gjøres i nettoberegningen per del før planlagte ordremottak lages, og FR-29 krever en ekstra beregning per planlagt mottak uten mottaket. `beregn` i `lag_testdata.py` er foreløpig bare enkeltnivå og må utvides før fasiten for testeksempelet med tre nivåer kan lages.
- **Lesing av Excel-malen:** Nivå er lagret som tekst (`0`, `.1`, `..2`), og Excel kan ha lagret `0` som tall. Varenummer kan også være lagret som tall hvis brukeren har skrevet bare sifre. Les begge som tekst. Malen har formler i hjelpekolonnene og ferdige, tomme rader med formatering helt ned til rad 1001, så slutten på tabellen er første rad uten nivå og varenummer.
- **Eksport (FR-22):** Et Excel-bibliotek for skriving trengs. Det kan være det samme som brukes til lesing.
- **Tekster samlet (NFR-7):** Meldinger og etiketter bør ligge samlet, så engelsk kan legges til uten å endre beregningen.

## Bakgrunn for valg i PRD-en

- **Rask vei:** PRD-en er skrevet på rask vei 2026-10-19 med alt tilgjengelig materiale som bestemt. Gruppen går gjennom den på et møte og kan bruke coaching-veien senere ved store endringer.
- **Eksport i v1:** Sebastian ønsket at brukeren skal kunne lagre resultatet selv. Det dekker også behovet for å ta vare på flere kjøringer uten brukerkontoer.
- **Forfalte frigivelser:** Bestemt 2026-10-19. De legges i uke 1 sammen med vanlige frigivelser, og meldingen oppgir hvor mye som er forfalt. Forfalte ordremottak vises i uken behovet er (regel 6 og 7 i fasiten).

## Begrunnelse fra research om MRP-reglene (2026-11-02)

Reglene i FR-6 til FR-13, FR-28 og FR-29 er sjekket mot ASCM Supply Chain Dictionary (18. utg., 2024), lærebøker (Krajewski m.fl., Nahmias), kursmateriale og dokumentasjonen til SAP, Oracle, Dynamics 365, Infor, Odoo og ERPNext. Rapporten med kilder: `.docs/planning-artifacts/research/academic-lit-mrp-regler-forfalte-ordrer-eksepsjoner-h-2026-11-02/research.md`. Hovedlærebøkene (Jacobs m.fl. *MPC* og Ptak & Smith *Orlicky's MRP*) var ikke tilgjengelige og er ikke lest.

- **Forfalt frigivelse i uke 1 (FR-8), beholdt.** Oracle viser forfalt forsyning og behov i første periode, og alle kildene flagger forfalte frigivelser. Hver forfalt frigivelse gir alltid FR-10 eller FR-11, fordi nettobehov > 0 betyr disponibel < SS.
- **Forfalt ordremottak i behovsuken (FR-7), beholdt som forenkling.** Oracle beholder forfallsdatoen og rapporterer hvor mye ledetiden må komprimeres. SAP S/4HANA, Dynamics 365 og Infor planlegger i stedet fremover fra i dag, slik at mottaket kommer i uke 1 + L og mangelen vises i forventet lagerbeholdning. Vi har valgt den første varianten fordi den er enklere å forklare, og fordi FR-10-meldingen allerede oppgir tidligste mottaksuke. Forventet lagerbeholdning er altså en målplan som krever fremskynding, ikke en prognose.
- **Mottak forsinket (FR-6, FR-12), endret.** Den gamle regelen lagde både et nytt bestillingsforslag og et forslag om å fremskynde mottaket, så samme behov ble dekket to ganger. ASCM sier at MRP antar at åpne ordrer kan fremskyndes lettere enn nye kan frigis og mottas, og lager planlagte ordremottak først når alle planlagte mottak er brukt (*rescheduling assumption*, s. 164). SAP lager nytt forslag bare hvis mottaksmengden er for liten.
- **Ledetid overskrider horisont (FR-9), endret.** ASCM sier at horisonten minst skal dekke kumulativ ledetid (s. 141), og Dynamics 365 krever at horisonten er lengre enn «total lead time». Med tre nivåer kan en kjede bryte regelen uten at noen enkelt ledetid er ≥ H. Vi kontrollerer derfor per del ledetiden fra ferdigproduktet, slik at eksepsjonen står på delen som ikke kan bestilles i tide.
- **Kanseller mottak (FR-29), ny.** ASCM nevner frigi, fremskynd, utsett og kanseller som typiske eksepsjoner. SAP og Oracle har alle fire. «Utsett mottak» er utelatt med vilje: et mottak som kommer litt tidlig, gir mye støy og lite handling (SM-C2). Oracle demper slike meldinger av samme grunn (*acceptable early days*).
- **Bestilling forsinket og bruk av sikkerhetslager (FR-10, FR-11), beholdt.** Research foreslo å utløse dem når beholdningen går under 0 eller SS uansett årsak. Med nettobehov = maks(0, SS − disponibel) ville det slått til for hver vanlig ordre. Når mottak antas i tide (FR-7), oppstår et reelt brudd bare ved forfalt frigivelse (FR-10, FR-11) eller forsinket mottak (FR-12). Koblingen til forfalt frigivelse er derfor riktig.
- **Flere eksepsjoner per uke, beholdt.** SAP lagrer bare den viktigste meldingen per ordre. Med fem typer, der FR-10 og FR-11 allerede utelukker hverandre, ville én per uke skjule for eksempel «Mottak forsinket» bak «Bestilling forsinket».
- **Felles deler på lavnivåkode (FR-28), bekreftet.** ASCM (s. 109), Krajewski og SAP beskriver det samme.
- **Ikke tatt med:** dempingsterskler og frysing. Forskningen på nervøsitet gjelder gjentatte kjøringer med rullerende horisont. Appen gjør én kjøring om gangen.
- **Språk:** Norsk i v1, deretter engelsk, så flere språk på lengre sikt.
- **Flernivå BOM i v1 (2026-10-26):** Briefen flyttet flernivå BOM inn i v1 2026-10-22. Malen har tre nivåer (0, .1, ..2), slik testeksempelet i briefen krever. Ferdigproduktet beregnes med full MRP, slik at lager, sikkerhetslager og ledetid på nivå 0 får betydning. Med 0 i alle tre blir resultatet det samme som når MPS ganges rett inn i nivå .1.
- **Typer:** Ferdigvare, Komponent (Kjøpes inn) og Komponent (Produseres selv). Delmontering og råvaretypene ble fjernet 2026-10-26, fordi de ikke endrer beregningen og gjorde listen lengre enn nødvendig.
- **Ingen innliming:** Excel kan ikke hindre innliming uten makroer, og malen skal være en vanlig `.xlsx`. Derfor står regelen i Veiledning, Kontroll-kolonnen fanger ugyldige nivåer og typer, og appen validerer alt på nytt (FR-3).
