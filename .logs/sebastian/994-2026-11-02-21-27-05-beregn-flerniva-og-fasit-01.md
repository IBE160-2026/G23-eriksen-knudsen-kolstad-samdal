# Beregn flernivå og fasit 01

## 2026-11-02 kl. 21:27 — Sebastian

### Oppgave
Sebastian ba om å oppdatere `beregn()` og fasit 01 i `testdata/lag_testdata.py` etter PRD-reglene fra 2026-11-02 (FR-6/FR-12 fremskynding av mottak, FR-9 ledetid fra ferdigproduktet, FR-29 Kanseller mottak). Startet etter `/bmad-help`, som anbefalte dette før Finalize av PRD-en.

### Plan
- Gjøre `beregn()` om til flernivå-MRP for hele stykklisten (FR-5, FR-28): nivå for nivå, felles deler én gang på lavnivåkoden.
- Legge inn FR-6 (fremskynding før nye ordrer), FR-9 (største sum av ledetider langs en sti), FR-12 (ny melding med hvor mottaket må fremskyndes) og FR-29 (Kanseller mottak).
- Lage fasit 01 på nytt, sammenligne med den gamle fasiten og sjekke flernivå-tilfellene med eget skript.

### Resultat
- `testdata/lag_testdata.py`:
  - Testeksempel 01 er nå `STYKKLISTE_01` + `HENSIKT_01`. `KOMPONENTER` er fjernet.
  - Nye funksjoner: `struktur()` gir delene, koblingene, lavnivåkoden og ledetiden fra ferdigproduktet med stien. `mrp_del()` beregner én del. `beregn(mps, stykkliste, mottak)` gir `{varenummer: rader}` og eksepsjonene sortert etter stykkliste og uke.
  - `lag_fasit()` tar stykkliste og hensikt. Arket Regler har fått nye regler og en ærlig status.
- `testdata/testeksempel-01-fasit.xlsx` er laget på nytt. Sammenlignet med gammel fasit er det bare disse endringene, som forventet:
  - Ny tabell for 100-001 (frigivelser = MPS).
  - 300-005 Gassfjær: mottaket på 100 regnes i uke 3, med forventet lager 55, 30, 100, 80, 45, 15, 10, 10, 10, 10 og frigivelser 0, 0, 0, 0, 20, 40, 30, 20, 0, 0. Det er ingen ordre for uke 3, og eksepsjonen har ny melding.
  - 300-006: meldingen viser ledetiden fra ferdigproduktet med sti («Kontorstol Basic 0 + Stolfot 10»).
  - Alt annet er uendret. Kritiske deler er fortsatt bare 300-003–300-006 (FR-13).
- Sjekket med skript (ikke en del av repoet):
  - Eksempelet i Veiledning, med felles skruesett: bruttobehovet er 4 × frigivelser for sete + 2 × frigivelser for rygg.
  - FR-9-eksempelet (1 + 4 + 5 = 10): bare ..2-delen får eksepsjonen.
  - Kanseller mottak når lageret er over SS.
  - To mottak fremskyndet til samme uke.
- `testdata/README.md`: tabellen for testeksempel 01 bruker nå varenumre og «ledetid», og statusen er oppdatert. Dette lukker et punkt i issues.
- Malen og testeksempel-01.xlsx fikk bare nytt tidsstempel og ble tilbakestilt.
- Ordbanken hadde allerede alle begrepene.
- Kodeendringene er ikke committet (venter på Sebastian).

### Åpne punkter
- Kontroller for hånd de nye fasitverdiene for 300-005 og meldingene for 300-005 og 300-006 i testeksempel-01-fasit.xlsx.
- Valg som må bekreftes:
  - FR-29: «trengs ikke» er tolket som at det ikke er noe nettobehov fra mottaksuken når mottaket fjernes *og ingen andre mottak fremskyndes*.
  - Planlagte mottak etter uke H blir ignorert.
  - Står en del med underdeler flere steder, telles underdelene bare under første forekomst.
  - «Bestilling forsinket» for deler rett under ferdigproduktet sier «Leveranse til kunde blir forsinket».
- PRD §9 spm. 9 (fasit for 300-005) kan lukkes, og FR-6 bør vise til den oppdaterte fasiten.
