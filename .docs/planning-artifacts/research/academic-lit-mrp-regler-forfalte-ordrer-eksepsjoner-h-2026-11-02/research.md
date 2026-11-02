---
title: 'academic-lit research: MRP-regler for forfalte ordrer, eksepsjoner og horisont'
type: 'academic-lit'
topic: 'MRP-regler: forfalte ordrer, eksepsjoner og horisont'
decision: 'Stemmer reglene i FR-5, FR-7 til FR-13 og FR-28 med praksis i lærebøker og ERP-systemer, eller må PRD, testdata/ og beregn() endres før arkitekturen lages?'
source: 'native run (bmad-deep-recon), 3 runder, 13 digester'
status: complete
claims_verified: 9
claims_unverified: 5
preset: 'deep'
validation: 'normal + brukerkrav: to uavhengige kilder per regel en anbefaling bygger på'
created: '2026-11-02'
updated: '2026-11-02'
---


# Research: MRP-regler for forfalte ordrer, eksepsjoner og horisont

**Beslutningen researchen skal støtte:** Stemmer reglene i PRD-utkastet med vanlig MRP-praksis, eller må PRD-en, fasitene i `testdata/` og `beregn()` endres før arkitekturen lages? Resultatet skal stå som begrunnelse i PRD-ens `addendum.md`.

## Sammendrag

**Svaret:** De fleste reglene kan stå. **Tre regler bør endres før arkitekturen lages** (FR-12, FR-9/FR-28 og FR-10/FR-11). **To eksepsjonstyper mangler** (utsett og kanseller), og vi anbefaler **én ny regel** mot for mange eksepsjoner.

**Bør endres:**

1. **«Mottak forsinket» (FR-12) gjør at samme behov dekkes to ganger.** Et planlagt mottak som kommer for sent, gir i dag både et nettobehov (en ny planlagt ordre) og et forslag om å fremskynde mottaket. Standardlogikken er en annen: MRP antar at et planlagt mottak kan fremskyndes, og lager planlagt ordremottak først når alle planlagte mottak er brukt (ASCM: *rescheduling assumption*) [1]. SAP lager nytt bestillingsforslag bare hvis mengden i det planlagte mottaket ikke strekker til [14], og Hopp & Spearmans eksempel viser det samme [4]. **Endring:** regn et senere planlagt mottak som om det fremskyndes, og lag planlagt ordre bare for et eventuelt restbehov. **Sikkerhet:** høy, to uavhengige primærkilder.
2. **«Ledetid overskrider horisont» (FR-9/FR-28) tester feil størrelse.** ASCM sier at horisonten minst skal dekke *kumulativ ledetid*, altså den lengste summen av ledetider langs en sti i stykklisten [1]. Dynamics 365 krever en horisont som er lengre enn «total lead time» [20], og JD Edwards definerer kumulativ ledetid som ASCM [26]. En kjede på tre nivåer kan bryte regelen uten at noen enkeltdel har L ≥ H. **Endring:** kontroller H mot kumulativ ledetid per del. **Sikkerhet:** middels–høy. Regelen står eksplisitt bare hos ASCM, og Dynamics 365 støtter den hvis «total lead time» betyr ledetiden gjennom hele stykklisten.
3. **Eksepsjonen for brudd på sikkerhetslager er bundet til forfalt frigivelse (FR-10/FR-11).** I ERP-systemene og i Gardners undervisningsmodell er den en egen eksepsjon: SAP 096 [16], Oracle «Items below safety stock» [9][11] og en egen rad for sikkerhetslagermeldinger hos Gardner [5]. Ingen av kildene knytter den til forfalte frigivelser. **Endring:** utløs eksepsjonen når disponibel beholdning går under 0 eller under SS, uansett årsak. **Sikkerhet:** middels.

**Mangler:**

4. **Utsett og kanseller planlagt mottak.** ASCM nevner frigi ordre, fremskynd, utsett og kanseller som eksempler på *action messages* [1]. SAP har fremskynd, utsett og kanseller [14][16], og Oracle har alle fire [9]. Dynamics 365 har fremskynd og utsett, men ikke kanseller [19]. **Endring:** legg til «Utsett mottak» og «Kanseller mottak», eller begrunn i addendumet hvorfor de er utelatt. **Sikkerhet:** høy.

**Ny regel:**

5. **Én eksepsjon per del og uke** (den alvorligste), mot for mange eksepsjoner (støy). Regelen er tilpasset fra SAP, som bare lagrer den viktigste meldingen per MRP-element [15]. Dempingsterskler trengs ikke i en enkeltkjøring. **Sikkerhet:** middels.

**Kan stå:**

- **FR-8 (uke 1):** at en forfalt frigivelse legges i uke 1, er forsvarbart. Oracle viser forfalt forsyning og behov i første periode (*bucket*) [8], og alle kildene flagger forfalte frigivelser [5][9][16].
- **FR-7:** at planlagt ordremottak vises i behovsuken, avviker fra de fleste moderne ERP-systemene. De legger planlagt ordremottak i *i dag + L* [12][18][23][24][25]. FR-7 kan forsvares som en forenkling hvis addendumet kaller forventet lagerbeholdning en *målplan som krever fremskynding*, og eksepsjonen viser hvor mange uker planlagt ordremottak blir forsinket (se A2).
- **FR-8 (horisont):** at frigivelser for behov etter horisonten ikke tas med, tilsvarer standardoppførselen i Dynamics 365 [20].
- **Felles deler på lavnivåkode** stemmer (se C9).

**Største forbehold:** Vi fikk ikke lest de to hovedlærebøkene (Jacobs m.fl., *MPC*, og Ptak & Smith, *Orlicky's MRP*). Lærebokstandpunktene bygger derfor på ASCM-ordboken (18. utg., primærkilde) [1], Krajewski m.fl. [2], Nahmias [3] og kursmateriale. Hvordan selve lærebøkene behandler forfalte frigivelser, er ikke verifisert (se Åpne spørsmål 1).

## A. Forfalte ordrer og forventet lagerbeholdning

**A1: Hvor legges en forfalt frigivelse?** Kildene er enige om at en forfalt frigivelse **alltid skal vises som avvik** [5][9][16]. De er bare uenige om hvor tallet skal stå. Ingen lærebok vi fikk lest, behandler tilfellet eksplisitt. Nahmias bygger eksemplene sine slik at alle frigivelser havner innenfor tabellen [3], og Krajewski omtaler ikke tilfellet i MRP-kapitlet [2]. Kildene peker i tre retninger:

- **Legges i første periode:** Oracle sier at planleggingen «considers past due supply and demand as if it were due today», og at rapporter i ukebøtter «show past due demand in the first bucket» [8]. Oracle ASCP setter avhengig behov til første dag i horisonten i planer uten kapasitetsbegrensning (bare fra søkeutdrag) [11]. Begge kildene er fra samme leverandør (Oracle).
- **Egen PD-kolonne** (PD = *past due*, forfalt)**:** UNCW-kursmaterialet har en PD-kolonne i MRP-tabellen, men i eksemplet står lagerbeholdningen før uke 1 der, ikke frigivelser [6]. En PD-bøtte i programvare har vi ellers bare sett i søkeutdrag (lav sikkerhet).
- **Feilmelding:** Gardners undervisningsmodell lar frigivelsen falle ut av tabellen og skriver «Not enough leadtime to meet net rq. in week N». Løsningen er å endre hovedplanen «or find some other way to avoid the leadtime problem» [5]. SAP lager den planlagte ordren og flagger den med 003 «New, and the start date is in the past» eller 006 «The start date is in the past» [16].

ASCM definerer «past-due order» bare for kundeordrer [1]. Når vi bruker «forfalt frigivelse» om forsyning, er det vår egen utvidelse av begrepet.

**A2: I hvilken uke vises planlagt ordremottak?** Systemene deler seg i to leirer:

| Prinsipp | Systemer | Forventet lagerbeholdning |
|---|---|---|
| **Behold forfallsdato, komprimer ledetiden, flagg** (= FR-7) | Oracle ASCP: eksepsjonen «Orders with compression days» [9]. At forfallsdatoen beholdes i planer uten kapasitetsbegrensning, vet vi bare fra søkeutdrag [11]. SAP *innenfor* tillatte dager i fortiden: startdatoen blir liggende i fortiden og flagges (bare fra søkeutdrag) [13][16]. Gardner, underforstått [5] | Viser behovet som dekket i tide. Avviket står bare i eksepsjonen |
| **Planlegg fremover fra i dag: planlagt ordremottak = i dag + L** | SAP S/4HANA: «automatically switches to forward scheduling, using the current date as the order start date» [12], med melding 30 [13]. Dynamics 365: «forward-plans the order from the current date», med «delayed date» og antall forsinkelsesdager. Ønsket dato beholdes ved siden av [18]. Infor CSI foreslår aldri mottak tidligere enn i dag + L [25]. Odoo [23] og ERPNext [24] daterer fremover fra i dag, men viser ikke forsinkelsen | Viser den reelle mangelen i ukene før mottaket |

**Vurdering:** FR-7 tilsvarer Oracle-varianten og er en gyldig forenkling, men den gir en optimistisk forventet lagerbeholdning. **Sikkerhet:** middels. To uavhengige leverandører bekrefter at begge prinsippene finnes.

Ingen kilde kaller komprimering av ledetiden «læreboknormen». ASCM nevner «compressing lead time» som noe *planleggeren* gjør ved omplanlegging nedenfra og opp (*bottom-up replanning*), ikke systemet [1]. McGraw-Hills lysbilder til Vollmann m.fl. sier at ledetider «must be compressed to meet the end-item schedule». Kopien vi fant er uautorisert og ikke verifisert, så vi regner den ikke som kilde.

**A3: Hva ser planleggeren?**

- **SAP:** et meldingsnummer per MRP-element. Bare den viktigste meldingen lagres per element [15].
- **Dynamics 365:** forsinket dato og antall forsinkelsesdager ved siden av ønsket dato [18].
- **Oracle:** en egen eksepsjonsliste med blant annet «Past due orders» og «Orders with compression days» [9].
- **Odoo:** merker bare innkjøpsordren som «late» på dashbordet. Ingen eksepsjonskode [23].
- **ERPNext:** ingen tidsfasing og ingen eksepsjoner [24], så det egner seg dårlig som referanse.

## B. Eksepsjonstyper

**B4: Hvilke typer finnes, og hva er minimum?** ASCM definerer *action message* (synonym *exception message*, i ordbanken «eksepsjon») som utdata som viser hva som må gjøres. Eksemplene er «release order, reschedule in, reschedule out, and cancel» [1]. Kildene nedenfor har den samme kjernen, uavhengig av hverandre:

- **SAP:** 010 fremskynd, 015 utsett, 002–007 datoer i fortiden og 096 under sikkerhetslager [16], i tillegg til «Cancel process» [14]. Nummeret 020 for kansellering finnes bare i forumtråder.
- **Oracle:** «Orders to be rescheduled in/out», «Orders to be cancelled», «Past due orders», «Items below safety stock», «Items with a shortage» og «Orders with compression days» [9].
- **Dynamics 365:** Advance, Postpone, Increase, Decrease og Derived, men ikke kanseller [19].
- **Deltek:** Planned Order, Reschedule, Decrease Quantity og Cancel [36].
- **Krajewski:** frigi nye ordrer og juster forfallsdatoen på planlagte mottak, mens kansellering behandles som en egen transaksjon [2].

Ingen kilde oppgir et formelt minimumssett. Frigi, fremskynd og utsett går igjen overalt, og kanseller finnes overalt unntatt i Dynamics 365. **«Ledetid overskrider horisont» er ikke en standard eksepsjonstype** i noen av kildene. Dynamics 365 gir bare et oppsettsråd: «you must ensure that the coverage time fence is longer than the total lead time» [20]. Eksepsjonen kan likevel forsvares som en kontroll av grunnlagsdataene, men den bør bygge på kumulativ ledetid (se C7).

**B4 (forts.): Når utløses eksepsjonen for sikkerhetslager?** **Vurdering:** Appens skille mellom «Bestilling forsinket» (under 0) og «Bruk av sikkerhetslager» (under SS) er forsvarbart. Det som avviker, er at appen bare utløser eksepsjonen når frigivelsen er forfalt. Evidensen:

- **Oracle:** «Items below safety stock» utløses når forventet lagerbeholdning per periode går under sikkerhetslageret (søkeutdrag) [11], eller «to a negative level or below safety stock» [9]. Oracle har i tillegg en egen eksepsjon, «Items with a shortage» [9].
- **SAP:** 096 «Stock is lower than the safety stock» [16]. Vi fant ikke hva som utløser den.
- **Dynamics 365:** sikkerhetslager er en grense for beholdningen til enhver tid, ikke et datert behov [22].
- Ingen av kildene knytter eksepsjonen til forfalte frigivelser. Grensene 0 og SS er appens egne.

**Vår slutning (ikke fra kilde):** Med lot-for-lot og sikkerhetslager i nettoberegningen er forfalt frigivelse den vanligste årsaken til brudd. Brudd kan likevel oppstå på andre måter, for eksempel når et planlagt mottak er forsinket eller lagerbeholdningen før uke 1 er lavere enn sikkerhetslageret. **Sikkerhet:** middels.

**B5: Når et planlagt mottak er forsinket, lages det både ny ordre og eksepsjon om å fremskynde?** Nei. Dette er det best dokumenterte funnet i researchen:

- **ASCM:** «existing open orders can be rescheduled in nearer time periods far more easily than new orders can be released and received. As a result, planned order receipts are not created until all scheduled receipts have been applied to cover gross requirements.» [1, s. 164]
- **SAP:** omplanleggingskontrollen «is used to change the dates of already existing firmed receipts», og systemet «will only create another procurement proposal if the receipt quantity is not sufficient» [14].
- **Oracle:** «always generates a reschedule in message if an order is scheduled to arrive later than it is required» [10]. Kilden sier ikke om Oracle i tillegg lager en ny ordre.
- **Hopp & Spearman**, gjengitt i MIT-forelesninger: planlagte mottak utsettes eller fremskyndes *før* nye ordrer planlegges [4]. Det vises i et eksempel, ikke som en regel.

Ifølge ordbanken inngår et planlagt mottak bare i disponibel beholdning for uken det står i. Da gir beregningen nettobehov i behovsuken, altså en ny planlagt ordre, *og* FR-12 gir en eksepsjon om å fremskynde det planlagte mottaket. Behovet dekkes to ganger. **Vurdering:** bør endres. **Sikkerhet:** høy. ASCM og SAP er to uavhengige primærkilder, og Hopp & Spearman (sekundært) støtter dem.

Systemet kan ikke endre fastsatte planlagte ordrer (*firm planned orders*) automatisk. Det må planleggeren gjøre [1]. Appen har ingen slike ordrer, så dette gjelder ikke nå.

**B6: Hvordan unngår man for mange eksepsjoner (støy)?** **For appen:** overfør SAP-regelen om bare den viktigste meldingen per MRP-element [15] til **én eksepsjon per del og uke** (den alvorligste). Den overføringen er vår egen tilpasning. Dempingsterskler trengs ikke: nervøsitet oppstår ved gjentatte kjøringer med rullerende horisont [27][30], og en enkeltkjøring i et studentprosjekt har lite av det. **Sikkerhet:** middels.

Systemene bruker fire mekanismer:

- toleranser der «no exception message is to be created» (SAP) [14]
- bare den viktigste meldingen per element (SAP) [15]
- Oracles «acceptable early days», som bare demper utsettelser, aldri fremskyndinger [10]
- marginer for fremskynding og utsettelse, pluss frosset periode (Dynamics 365) [19]

Forskningen definerer nervøsitet som at små endringer høyt i stykklisten gir store endringer lenger ned [1]. Blackburn m.fl. finner at det å fryse planen og legge inn en kostnad for endringer er «dominant» [27]. Kadipasaoglu & Sridharan finner at frysing virker best når den dekker kumulativ ledetid [28], og å fryse opptil 50 % av horisonten har bare marginal kostnadseffekt [29]. Dempingsregler beskrives som filtre som «screen out excessive rescheduling messages» [31], og de er delt inn i typer [32]. Nesten all evidensen om dempingsregler kommer fra én forsker (C.-J. Ho), så den bør leses som en sterk ledetråd. Ingen artikkel vi fant, måler antall eksepsjoner som arbeidsbelastning for planleggeren.

## C. Horisont og kumulativ ledetid gjennom flere nivåer

**C7: Hvilken regel gjelder?** **Regel:** med lot-for-lot blir regelen **H ≥ kumulativ ledetid**. Evidensen:

- **ASCM:** horisonten for en hovedplan «is normally set to cover a minimum of cumulative lead time plus time for lot sizing low-level components and time for capacity changes» [1, s. 141]. Kumulativ ledetid er «the longest planned length of time … found by reviewing the lead time for each bill of material path below the item» [1, s. 47]. Synonymer er *critical path lead time* og *stacked lead time*. Med lot-for-lot er tillegget for partistørrelse null.
- **JD Edwards:** definerer det samme rekursivt: delens egen ledetid pluss den lengste kumulative ledetiden blant underkomponentene [26].
- **Dynamics 365:** dekningshorisonten (*coverage time fence*) skal være «longer than the total lead time» [20].
- **Universitetet i Napoli** (kurs basert på Vollmann): horisonten skal minst dekke gjennomløpstiden [7].
- **Nahmias:** et annet kriterium. Horisonten skal være så lang at beslutningen i første periode ikke endrer seg [3]. Kriteriet handler om partistørrelse og er ikke i strid med ASCM.
- **Kadipasaoglu & Sridharan:** frysing virker best når den dekker kumulativ ledetid [28]. Det støtter at kumulativ ledetid er den relevante størrelsen.

**Sikkerhet:** middels–høy. Regelen står eksplisitt bare hos ASCM. Dynamics 365 sier «total lead time», og JD Edwards gir bare definisjonen.

**C7 (forts.): Hva skjer når horisonten er for kort?** **Vurdering:** FR-8 (horisont), at frigivelser for behov etter horisonten ikke tas med, tilsvarer standardoppførselen i Dynamics 365 og er forsvarbar [20]. Dynamics 365 tar ikke med forsyning og behov utenfor dekningshorisonten, og beregner heller ingen forsinkelser der [20]. Avhengig behov fra en overordnet del innenfor horisonten planlegges likevel som standard. Fra versjon 10.0.49 kan det filtreres bort [20]. Ingen kilde beskriver hva som skjer med delene på nederste nivå i flernivå-MRP. **Vår slutning:** planen fanger da ikke opp frigivelser som skulle vært gjort nå for behov rett etter horisonten, og det rammer de nederste delene først. **Sikkerhet:** middels.

**C8: Effekter ved slutten av horisonten.** Forskningen på slutteffekter handler om partistørrelse på ett nivå. Hvis sluttbeholdningen ikke verdsettes, får den verdien null, og det gir flere omstillinger (*setups*) [33]. Andre tiltak er å se forbi horisonten [34] eller å forlenge den [35]. Med lot-for-lot er det ingen partistørrelse, så denne effekten forsvinner i stor grad. Vi fant **ingen kilde** om slutteffekter på lavere nivåer i flernivå-MRP. Det er ikke grunnlag for egne regler her, bare for å nevne effekten i addendumet.

**C9: Lavnivåkode og felles deler.** Dette er bekreftet:

- **ASCM:** en lavnivåkode er det laveste nivået delen står på, og «net requirements for a given component are not calculated until all the gross requirements have been calculated down to that level» [1, s. 109].
- **Krajewski:** bruttobehov er summen over alle overordnede deler. Det er de overordnede delenes *planlagte ordrefrigivelser*, «not the gross requirements, scheduled receipts, or planned receipts», som gir underkomponentenes bruttobehov [2].
- **Nahmias:** underkomponentens behov havner i samme uke som frigivelsen til den overordnede delen [3].
- **SAP:** planlegger lavnivåkode 0 først, så 1 og så videre (søkeutdrag) [17].

**Gir en forfalt frigivelse på nivå .1 bruttobehov i uke 1 for nivå ..2?** Oracle sier at «dependent demand is set due on the horizon start date» i planer uten kapasitetsbegrensning (søkeutdrag) [11]. Det samme følger av at SAP planlegger fremover fra i dag (vår slutning) [12]. Dynamics 365 «always processes requirements that occur before the current date» [21]. **Sikkerhet:** middels, ingen lærebokkilde.

## Funn på tvers av dimensjonene

- **FR-7 og FR-12 bygger på samme forutsetning:** at forsinkelser løses ved å fremskynde, enten den nye ordren (FR-7) eller det planlagte mottaket (FR-12). ASCM og SAP gjør denne forutsetningen eksplisitt for planlagte mottak [1][14]. Er appen konsekvent, bør den derfor også *regne* som om det planlagte mottaket fremskyndes. Det er nettopp endringen i B5. Da følger FR-7 og den nye FR-12 samme logikk: planen viser målet, og eksepsjonen viser hva som må gjøres for å nå det.
- **Kumulativ ledetid binder sammen A og C.** En frigivelse på nederste nivå forfaller når behovsuken t på nivå 0 er slik at t − kumulativ ledetid < 1. Kontrollen i C7 viser dermed på forhånd hvor mange av de første ukene som vil gi forfalte frigivelser lenger ned. Det gir et naturlig grensetilfelle for testdata.

## Motstridende evidens

Vi kjørte ikke en egen runde med motargumenter (*red team*). Materialet har likevel to motforestillinger:

- **Flertallet av ERP-systemene gjør ikke som FR-7** [12][18][23][25]. Dynamics 365 og SAP viser den reelle mangelen. FR-7 må derfor begrunnes i addendumet som en forenkling, ikke presenteres som standard.
- **Studiene av nervøsitet er delvis uenige.** Sridharan m.fl. finner at frysing koster lite [29], mens Blackburn m.fl. finner at frysing dominerer [27]. Ingen av funnene påvirker beslutningen her.

## Anbefalinger

Sortert etter hva som må gjøres først.

| Regel | Vurdering | Hva må gjøres | Kilder | Sikkerhet |
|---|---|---|---|---|
| FR-12: mottak forsinket | **Bør endres** | Regn et senere planlagt mottak som om det fremskyndes til behovsuken. Lag planlagt ordre bare for restbehovet. Eksepsjon: «Fremskynd mottak». Oppdater fasiter som har dette tilfellet | ASCM [1], SAP [14]; Hopp & Spearman [4] (sekundært) | Høy |
| FR-9/FR-28: ledetid overskrider horisont | **Bør endres** | Beregn kumulativ ledetid per del (lengste sti ned i stykklisten), og gi eksepsjon når den er ≥ H. Kan beholdes som kontroll av grunnlagsdata. Ikke kall den en standard MRP-eksepsjon | ASCM [1]; Dynamics 365 [20] («total lead time»); definisjon fra JDE [26] | Middels–høy |
| FR-10/FR-11: bestilling forsinket / bruk av sikkerhetslager | **Forsvarbar todeling, men vilkåret bør utvides** | Utløs eksepsjonen når disponibel beholdning går under 0 eller under SS, uansett årsak. En forfalt frigivelse nevnes da som årsak i eksepsjonsteksten, men er ikke lenger vilkåret. Dekker også SS-brudd når frigivelsen ikke er forfalt | Oracle [9][11], Gardner [5]; SAP 096 finnes [16], men vi vet ikke hva som utløser den | Middels |
| Mangler: utsett planlagt mottak og kanseller planlagt mottak | **Bør legges til** (eller begrunnes som utelatt) | Utsett: et planlagt mottak kommer før uken det trengs. Kanseller: det planlagte mottaket trengs ikke innenfor horisonten | ASCM [1], SAP [14][16], Oracle [9]; Dynamics 365 bare utsett [19] | Høy |
| Støy (for mange eksepsjoner) | **Ny regel, enkel** | Én eksepsjon per del og uke (den alvorligste). Ingen dempingsterskler i en enkeltkjøring | Tilpasset fra SAP [15] (én melding per MRP-element) | Middels |
| FR-7: planlagt ordremottak vist i behovsuken | **Avviker, men forsvarbar forenkling** | Behold, men skriv i addendumet at forventet lagerbeholdning er en målplan. La «Bestilling forsinket» vise tidligste uke for planlagt ordremottak (1 + L) eller antall uker forsinkelse, slik Dynamics 365 viser forsinkelsesdager | Oracle mot SAP, Dynamics 365 og Infor [11][12][18][25] | Middels |
| FR-8 (uke 1): forfalt frigivelse i uke 1 | **Stemmer / forsvarbar** | Behold. Merk den forfalte delen av uke 1, så den ikke forsvinner i summen med vanlige frigivelser, og gi den alltid en eksepsjon | Oracle [8]; flagging: Gardner, SAP og Oracle [5][16][9] | Middels–høy |
| Forfalt frigivelse blir bruttobehov i uke 1 på nivået under (fasitregel 6/7) | **Forsvarbar** | Behold | Oracle [11], logikken i SAP [12] | Middels |
| FR-8 (horisont): behov etter horisonten tas ikke med | **Stemmer / forsvarbar** | Behold. Nevn slutteffekten for nederste nivå i addendumet | Dynamics 365 [20] | Middels |
| Felles deler på lavnivåkode | **Stemmer** | Behold | ASCM [1], Krajewski [2], SAP [17] | Høy |

Resultatet skal brukes tre steder:

- **`addendum.md`:** begrunnelsen for hver regel i tabellen, inkludert forbeholdet om FR-7.
- **`testdata/`:** nye eller oppdaterte fasiter for FR-12 og FR-28, og grensetilfeller for kumulativ ledetid.
- **`beregn()`:** et steg som regner ut kumulativ ledetid før eksplosjonen, og nettoberegning mot senere planlagte mottak.

## Åpne spørsmål

| # | Spørsmål | Påvirker | Rute |
|---|---|---|---|
| 1 | Hva sier hovedlærebøkene (Jacobs m.fl. *MPC*, kapitlene om MRP og bruk av MRP-systemet; Ptak & Smith *Orlicky's MRP*) om forfalte frigivelser og i hvilken uke planlagt ordremottak vises? Fulltekst var stengt: utlån på archive.org krever innlogging, og Google Books ga CAPTCHA og var over kvoten | FR-7, FR-8 (uke 1) | Lån bøkene på biblioteket i Molde, eller lån skannet utgave på archive.org med gratis konto (`materialrequirem00orli`, `orlickysmaterial00orli`, `manufacturingpla00voll`, `manufacturingpla0005unse`). Søk etter «past due», «action bucket», «reschedul» og «cumulative lead time». Kjør så Deepen-steget i bmad-deep-recon |
| 2 | SAP-primærtekst for «Start in the past» (OPU3/OPPR), for melding 096 og for omplanleggingskontrollen i S/4HANA [14]. help.sap.com ga bare sidetittelen | FR-7, FR-10/FR-11, FR-12 | Åpne sidene i nettleser |
| 3 | Slutteffekter på lavere nivåer i flernivå-MRP. Vi fant ingen kilde. Simpson (1999, EJOR) kan dekke det, men vi fant bare referansen, ikke sammendraget | FR-8 (horisont) | Hent artikkelen gjennom biblioteket |
| 4 | Oracle ASCP, fullstendig definisjon av «compression days». Den delen av siden vi fikk lest, sluttet før definisjonen | FR-7 | Les resten av siden [11] |

## Kildevedlegg

| # | Påstand/funn | Utgiver | Publisert | Lest | Sikkerhet |
|---|---|---|---|---|---|
| [1] | Definisjoner: action message s. 7, rescheduling assumption s. 164, planning horizon s. 141, cumulative lead time s. 47, low-level code s. 109, firm planned order, past-due order, nervousness s. 122, bottom-up replanning s. 23 | [ASCM, *ASCM Supply Chain Dictionary*, 18. utg.](https://learn.ascm.org/sfc/servlet.shepherd/document/download/069R3000006PlDHIA0?operationContext=S1) | 2024 | 2026-11-02 | høy |
| [2] | Bruttobehov = summen av de overordnede delenes planlagte frigivelser; action notices; ca. s. 465–473 | Pearson: Krajewski, Malhotra & Ritzman, *Operations Management*, 11. utg. (siteres fra trykt bok; nettkopien er uautorisert og lenkes ikke) | 2016 | 2026-11-02 | høy |
| [3] | Eksplosjon i samme uke (s. 372–374); kriterium for horisont (s. 391) | McGraw-Hill/Irwin: Nahmias, *Production and Operations Analysis*, 6. utg. | 2009 | 2026-11-02 | høy |
| [4] | Planlagte mottak justeres før nye ordrer; lavnivåkode (basert på Hopp & Spearman) | [MIT OCW, Gershwin, 2.854 MRP-slides](https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf) | 2006/2016 | 2026-11-02 | middels–høy (sekundær) |
| [5] | «Not enough leadtime»-melding; egen rad for sikkerhetslagermeldinger | [Univ. of Houston, Gardner, OM-tekst kap. 4](https://www.bauer.uh.edu/egardner/3301H%20Operations%20Management/OM%20Text/4MRP-1.pdf) | u.å. | 2026-11-02 | middels |
| [6] | MRP-tabell med PD-kolonne; unntaksrapporter for forsinkede ordrer | [UNCW, Janicki, OPS 370 Module 11](https://csbapp.uncw.edu/janickit/ops370/modules/Module11.pdf) | 2014 | 2026-11-02 | middels (sekundær) |
| [7] | Horisont ≥ gjennomløpstid (basert på Vollmann) | [Univ. di Napoli Federico II, Grassi, MRP-slides](https://www.docenti.unina.it/webdocenti-be/allegati/materiale-didattico/34433111) | 2021 | 2026-11-02 | middels (sekundær) |
| [8] | Forfalt forsyning/behov «as if it were due today», vist i første periode | [Oracle, MRP: Time-Phasing Requirements (R11)](https://docs.oracle.com/cd/A60725_05/html/comnls/us/mrp/timphreq.htm) | ca. 2000 | 2026-11-02 | høy (for Oracle) |
| [9] | Oracles eksepsjonsliste (forfalte ordrer, fremskynd, utsett, kanseller, under SS, mangel, komprimering) | [Oracle, Reviewing Planning Exceptions (R11)](https://docs.oracle.com/cd/A60725_05/html/comnls/us/mrp/planin09.htm) | ca. 2000 | 2026-11-02 | høy |
| [10] | Fremskyndingsmelding gis alltid; acceptable early days demper bare utsettelser | [Oracle, Acceptable Early Days Delivery (R11)](https://docs.oracle.com/cd/A60725_05/html/comnls/us/mrp/planco01.htm) | ca. 2000 | 2026-11-02 | høy |
| [11] | Komprimeringsdager; avhengig behov i første uke av horisonten; under SS per bøtte | [Oracle, ASCP Implementation and User's Guide 12.1, exception messages](https://docs.oracle.com/cd/E18727_01/doc.121/e13358/T309464T309475.htm) | 12.1 | 2026-11-02 | middels (delvis søkeutdrag) |
| [12] | Planlegging fremover fra dagens dato når starten havner i fortiden | [SAP Learning, Understanding MRP in SAP S/4HANA](https://learning.sap.com/courses/exploring-production-planning-in-sap-s-4hana/understanding-mrp-in-sap-s-4hana) | S42220_26 | 2026-11-02 | høy |
| [13] | Melding 30 og innstillingen «Start in past» (OPPR) | [SAP Support Content, exception message 30](https://help.sap.com/docs/SUPPORT_CONTENT/mrp/3138697939.html) | u.å. | 2026-11-02 | lav–middels (søkeutdrag) |
| [14] | Omplanleggingskontroll: fremskynd/utsett/kanseller; ny ordre bare ved for lite mengde; toleranser | [SAP Help 4.6C, Rescheduling Check](https://help.sap.com/SAPHelp_46c/helpdata/EN/f4/7d2c9744af11d182b40000e829fbfe/content.htm) | ca. 2000 | 2026-11-02 | høy (gammel versjon) |
| [15] | Bare den viktigste meldingen lagres per element | [SAP Help 4.6C, Creation of Exception Messages](https://help.sap.com/SAPHelp_46c/helpdata/EN/f4/7d2c8a44af11d182b40000e829fbfe/content.htm) | ca. 2000 | 2026-11-02 | høy |
| [16] | SAPs meldingsliste 001–007, 010, 015, 030, 096 | [SAP Help AFS 6.0, Description of the Exception Messages](https://help.sap.com/saphelp_afs60/helpdata/en/6e/d09066145211d4b2b70050da4c2924/content.htm) | AFS 6.0 | 2026-11-02 | middels–høy |
| [17] | Lavnivåkode bestemmer planleggingsrekkefølgen | [SAP Help, Calculating Low-Level Codes](https://help.sap.com/docs/SAP_ERP/85d3fce10e264972a0155c8b46ecf93b/a797b6535fe6b74ce10000000a174cb4.html) | u.å. | 2026-11-02 | middels (søkeutdrag) |
| [18] | Forsinkelser: planlegging fremover fra i dag, forsinket dato, ønsket dato beholdes | [Microsoft Learn, D365 Delays](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/delays) | 2025-08-22 | 2026-11-02 | høy |
| [19] | Action messages (fremskynd/utsett/øk/reduser); marginer; frosset periode | [Microsoft Learn, D365 Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages) | 2026-03-26 | 2026-11-02 | høy |
| [20] | Dekningshorisont må være lengre enn «total lead time»; behov utenfor horisonten tas ikke med; avledet behov (10.0.49) | [Microsoft Learn, D365 Coverage time fences](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/coverage-time-fence) | 2026-07-27 | 2026-11-02 | høy |
| [21] | Behov før dagens dato behandles alltid; tidsgrenser i hovedplaner | [Microsoft Learn, D365 Master plans overview](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/master-plans) | 2026-03-23 | 2026-11-02 | høy |
| [22] | Sikkerhetslager er en grense, ikke et datert behov | [Microsoft Learn, D365 Safety stock fulfillment](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/safety-stock-replenishment) | 2026-03-26 | 2026-11-02 | høy |
| [23] | Datering fremover (Order Deadline + Vendor Lead Time); «late»-merking | [Odoo 18, Lead times](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/lead_times.html) | 18.0 | 2026-11-02 | middels |
| [24] | ERPNext: dato = i dag + L, ingen tidsfasing, ingen eksepsjoner, ingen horisont | [Frappe/ERPNext, kildekode material_request.py](https://raw.githubusercontent.com/frappe/erpnext/develop/erpnext/manufacturing/doctype/production_plan/services/material_request.py) | 2026-10-17 | 2026-11-02 | høy |
| [25] | Mottak aldri tidligere enn i dag + L; «Rcpt Projected Late» | [Infor CSI 10.x, About Exception Messages](https://docs.infor.com/csi/10.x/en-us/csbiolh/inventory_user_cl_sl/lsm1454144400736.html) | 10.x | 2026-11-02 | middels–høy |
| [26] | Kumulativ ledetid = egen ledetid + lengste kumulative ledetid blant komponentene | [Oracle, JD Edwards 9.2, Cumulative Lead Time](https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoapd/cumulative-lead-time.html) | 9.2 | 2026-11-02 | høy |
| [27] | Kostnad for endring og frysing dominerer; sikkerhetslager og lot-for-lot er ikke kostnadseffektive (fagfellevurdert, sammendrag) | [Management Science 32(4), Blackburn, Kropp & Millen](https://doi.org/10.1287/mnsc.32.4.413) | 1986 | 2026-11-02 | høy |
| [28] | Frysing er mest effektiv når den dekker kumulativ ledetid, i flernivåsystemer (fagfellevurdert, sammendrag) | [JOM 13(3), Kadipasaoglu & Sridharan](https://doi.org/10.1016/0272-6963(95)00023-L) | 1995 | 2026-11-02 | høy |
| [29] | Frysing av opptil 50 % av horisonten har marginal kostnadseffekt (fagfellevurdert, sammendrag) | [Management Science 33(9), Sridharan, Berry & Udayabhanu](https://doi.org/10.1287/mnsc.33.9.1137) | 1987 | 2026-11-02 | høy |
| [30] | Endringskostnad i partistørrelsesmodellen reduserer nervøsitet (fagfellevurdert, sammendrag) | [Management Science 25(8), Carlson, Jucker & Kropp](https://doi.org/10.1287/mnsc.25.8.754) | 1979 | 2026-11-02 | høy |
| [31] | Dempingsprosedyrer filtrerer bort overdrevne omplanleggingsmeldinger (fagfellevurdert, sammendrag) | [IJPR 46(18), Ho](https://doi.org/10.1080/00207540701338887) | 2008 | 2026-11-02 | høy (samme forsker som [32]) |
| [32] | Inndeling av dempingsmetoder (fagfellevurdert, sammendrag) | [IJPR 33(2), Ho, Law & Rampal](https://doi.org/10.1080/00207549508930161) | 1995 | 2026-11-02 | høy (samme forsker som [31]) |
| [33] | Slutteffekter; verdsetting av sluttbeholdning (fagfellevurdert, sammendrag) | [Management Science 47(5), Fisher, Ramdas & Zheng](https://doi.org/10.1287/mnsc.47.5.679.10485) | 2001 | 2026-11-02 | høy |
| [34] | Å se forbi horisonten demper slutteffekter (fagfellevurdert, sammendrag) | [Management Science 46(2), Stadtler](https://doi.org/10.1287/mnsc.46.2.318.11924) | 2000 | 2026-11-02 | høy |
| [35] | Lengre horisont og sluttbetingelser forbedrer rullerende planer (fagfellevurdert, sammendrag) | [Management Science 25(4), Baker & Peterson](https://ideas.repec.org/a/inm/ormnsc/v25y1979i4p341-351.html) | 1979 | 2026-11-02 | høy |
| [36] | Meldingssett: Planned Order, Reschedule, Decrease Quantity, Cancel; filtre i dager | [Deltek Costpoint 8.1, Creating MRP Messages](https://help.deltek.com/PRODUCT/COSTPOINT/8.1/GA/mrx_Creating_MRP_Messages.html) | 8.1 | 2026-11-02 | høy (for Deltek) |

## Når funnene bør sjekkes på nytt

Datoene er regnet ut av `recon_kit.py staleness`. Gyldighetstiden er: ERP-oppførsel 24 mnd., definisjoner 60 mnd., lærebokregler 120 mnd. og empiri 240 mnd.

| Påstand | Ny sjekk | Status |
|---|---|---|
| [23] Odoo 18, ledetider | 2027-01-01 | ok |
| [18] D365, forsinkelser | 2027-08-01 | ok |
| [12] SAP S/4HANA, planlegging fremover | 2028-01-01 | ok |
| [19] D365, action messages | 2028-03-01 | ok |
| [20] D365, dekningshorisont / avledet behov (10.0.49) | 2028-07-01 | ok |
| [24] ERPNext, kildekode | 2028-10-01 | ok |
| [1] ASCM Dictionary, 18. utg. | 2029-09-01 | ok |
| [14] SAP 4.6C, omplanleggingskontroll | 2002-01-01 | **gammel**: prinsippet støttes av ASCM [1], men bør bekreftes mot S/4HANA (Åpent spørsmål 2) |
| [2] Krajewski, 11. utg. | 2026-01-01 | gammel etter vinduet, men lærebokstoff har ingen krav til hvor nytt det er. Sjekk 12./13. utg. ved Deepen |
| [27] Blackburn m.fl. 1986 | 2006-04-01 | sentral studie, ingen krav til hvor ny den er. Ingen nyere studie motsier funnet |

Neste reelle sjekk er **Odoo, 2027-01-01**. Kjør Refresh i bmad-deep-recon på denne mappen.
