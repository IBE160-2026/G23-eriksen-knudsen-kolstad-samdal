# Beregn flernivå og fasit 01

## 2026-11-02 kl. 21:27 — Sebastian

### Oppgave
Sebastian ba om å oppdatere `beregn()` og fasit 01 i `testdata/lag_testdata.py` etter PRD-reglene fra 2026-11-02 (FR-6/FR-12 fremskynding av mottak, FR-9 ledetid fra ferdigproduktet, FR-29 Kanseller mottak). Startet etter `/bmad-help`, som anbefalte dette før Finalize av PRD-en. Etter første runde reagerte Sebastian på 300-005: mottaket ble vist i uke 3, men er lagt inn i uke 4. Han spurte også hvorfor 300-006 får eksepsjon når lageret holder.

### Plan
- Gjøre `beregn()` om til flernivå-MRP for hele stykklisten (FR-5, FR-28): nivå for nivå, felles deler én gang på lavnivåkoden.
- Legge inn FR-6, FR-9, FR-12 og FR-29.
- Lage fasit 01 på nytt, sammenligne med den gamle fasiten og sjekke flernivå-tilfellene med eget skript.
- Etter Sebastians innspill valgte han blant tre visninger for 300-005 og tre løsninger for 300-006:
  - **300-005, løsning B:** mottaket blir stående i uken det er lagt inn. Nettingen regner det som fremskyndet, så det lages ingen ny ordre. Forventet lager er uten mottaket til det kommer.
  - **300-006, løsning 1:** eksepsjonen beholdes, men meldingen skrives om. Eksepsjonen betyr at planen er for kort, ikke at delen mangler.

### Resultat
- `testdata/lag_testdata.py`:
  - Testeksempel 01 er nå `STYKKLISTE_01` + `HENSIKT_01`. `KOMPONENTER` er fjernet.
  - Nye funksjoner:
    - `struktur()` gir delene, koblingene, lavnivåkoden og ledetiden fra ferdigproduktet med stien.
    - `mrp_del()` beregner én del. Mottakene vises der de er lagt inn, og forventet lager trekker fra fremskyndede mottak som ikke er kommet.
    - `beregn(mps, stykkliste, mottak)` gir `{varenummer: rader}` og eksepsjonene.
  - `lag_fasit()` tar stykkliste og hensikt. Arket Regler har fått nye regler og en ærlig status.
- `testdata/testeksempel-01-fasit.xlsx` er laget på nytt. Endringer mot gammel fasit:
  - Ny tabell for 100-001 (frigivelser = MPS).
  - 300-005 Gassfjær:
    - Mottaket på 100 står i uke 4.
    - Forventet lager: 55, 30, **0**, 80, 45, 15, 10, 10, 10, 10.
    - Frigivelser: 0, 0, 0, 0, 20, 40, 30, 20, 0, 0. Det lages ingen ordre for uke 3.
    - Ny melding: «Lager blir 0 i uke 3, under sikkerhetslager 10, før mottaket kommer. Det planlagte mottaket på 100 i uke 4 må fremskyndes til uke 3 hos leverandøren. Det lages ingen ny bestilling for behovet mottaket dekker.»
  - 300-006: ny melding: «Ledetiden fra ferdigproduktet (10 uker: Kontorstol Basic 0 + Stolfot 10) er minst like lang som horisonten (10 uker). Behov etter uke 10 som må bestilles nå, vises ikke i planen. Vurder lengre horisont.»
  - Alt annet er uendret. Kritiske deler er fortsatt bare 300-003–300-006 (FR-13).
- Sjekket med skript (ikke en del av repoet):
  - Eksempelet i Veiledning, med felles skruesett: bruttobehovet er 4 × frigivelser for sete + 2 × frigivelser for rygg.
  - FR-9-eksempelet (1 + 4 + 5): bare ..2-delen får eksepsjonen.
  - Kanseller mottak.
  - To mottak fremskyndet til samme uke: forventet lager stemmer uke for uke med det som faktisk kommer inn.
- PRD:
  - FR-6, FR-7 og FR-12 sier nå at mottaket vises i uken det er lagt inn, og at lageret kan være under SS før et mottak som må fremskyndes.
  - FR-9 forklarer hva eksepsjonen betyr.
  - §9 spm. 9 er markert som løst.
- `.docs/ordbank.md`: «Mottak forsinket» og «Ledetid overskrider horisont» er presisert.
- `testdata/README.md`: tabellen for testeksempel 01 bruker varenumre og «ledetid». Beskrivelsen av 300-005 og 300-006 og statusen er oppdatert. Dette lukker et punkt i issues.
- Malen og testeksempel-01.xlsx fikk bare nytt tidsstempel og ble tilbakestilt.
- Sebastian har kontrollert de nye fasitverdiene. Status i fasitens Regler-ark og i README er «kontrollert for hånd».
- Sebastian godkjente FR-29-regelen: under kontrollen fremskyndes ingen andre mottak, ellers kunne appen rådet til å kansellere et tidlig mottak og fremskynde et senere. Regelen er skrevet inn i PRD FR-29 og i ordbanken.
- Kodeendringene og dokumentendringene er ikke committet (venter på Sebastian).

### Åpne punkter
- Valg i `beregn()` som må bekreftes:
  - Planlagte mottak etter uke H blir ignorert.
  - Står en del med underdeler flere steder, telles underdelene bare under første forekomst.
  - «Bestilling forsinket» for deler rett under ferdigproduktet sier «Leveranse til kunde blir forsinket».
