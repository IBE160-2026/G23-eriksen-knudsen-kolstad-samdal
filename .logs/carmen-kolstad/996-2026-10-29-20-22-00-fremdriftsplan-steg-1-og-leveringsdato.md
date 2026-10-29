# Fremdriftsplan: steg 1 og leveringsdato

## 2026-10-29 kl. 20:22 — Carmen Kolstad

### Oppgave
Oppdatere `.docs/prosjektstyring/fremdriftsplan.xlsx`: steg 1 ferdig, «Hele gruppen» som ansvarlig for steg 1, og prosjektets endelige leveringsdato 15.12.2026, uten å endre de andre stegene eller ødelegge formler, formatering og Gantt.

### Plan
- Fila finnes bare på `main`. En kopi fra `origin/main` ble undersøkt og endret i Excel i scratchpad.
- Struktur: datoene beregnes som Dag 0 (C2, tom) + dagnummer. Gantt er betinget formatering i L5:BO19 styrt av dagnumrene. Status er en nedtrekksliste (Ikke startet/Pågår/Ferdig), og det finnes ingen prosentkolonne.
- Carmen valgte: fast dato på LEVERING (H19) i stedet for å sette Dag 0, og kontroll av kopien før den legges inn.

### Resultat
- **Endrede celler (bare tre):**
  - K5: Ikke startet → Ferdig
  - J5: (tom) → Hele gruppen
  - H19: `=IF($C$2="","",$C$2+E19)` → 15.12.2026
- **Kontrollert mot originalen:**
  - Ingen andre celler er endret, og arket Tilbakemelding er uendret.
  - Betinget formatering, nedtrekkslister, sammenslåtte celler og frosne ruter er like.
  - Gantt for steg 1 blir grønn («Ferdig»), og LEVERING er fortsatt en milepæl på dag 56.
  - Excel for Mac avrundet kolonnebreddene med omtrent 0,03 tegn ved lagring.
- **Commit og push:** Commit `8ff3a3e` på `main` («Fremdriftsplan: steg 1 ferdig, ansvarlig og leveringsdato») inneholder bare denne fila. Den er pushet direkte til `origin/main` (`9e6ad38..8ff3a3e`), og blob-ID-en på GitHub (`987c7ad`) er lik den kontrollerte kopien. Carmen/Branch er ikke merget.

### Åpne punkter
- Leveringsdatoen (H19) er nå fast og følger ikke Dag 0. Dag 0 (C2) er fortsatt tom, så de andre stegene har ingen datoer før gruppen fyller den inn.
