# Åpne spørsmål besluttet

## 2026-11-05 kl. 13:02 — Sebastian

### Oppgave
Sebastian kjørte `/bmad-help`. Svaret var at neste steg er Finalize i `bmad-prd`. Han ba så om å få alle åpne spørsmål trukket frem, så han kunne svare på dem ett om gangen før Finalize. Deretter ba han om steg 1: lagre beslutningene og oppdatere filene utenom PRD-en.

### Plan
- Samle åpne spørsmål fra PRD §9, antagelsene i §10, merknadene merket [BESLUTNING] i ordbanken og de åpne punktene i `issues.md`. Slå sammen dem som overlapper (23 spørsmål).
- Stille spørsmålene ett om gangen, med alternativer og en anbefaling.
- Steg 1 (denne økten): lagre beslutningene i PRD-mappa og oppdatere ordbanken, `issues.md` og briefen.
- Steg 2 (ny økt): Finalize i `bmad-prd` med beslutningsfila.

### Resultat
- Ny fil: `.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-05.md` med alle 23 beslutningene, og for hver av dem hva som skal endres i PRD-en. De viktigste:
  - **Begreper:** «del» er samlebegrepet, og «komponent» brukes bare om typen. «Prognostiserte behov (MPS)» står første gang i dokumenter. «Eksepsjon» brukes overalt, også i appen.
  - **Typer og omfang:** tre typer. Inntil 1000 rader i stykklisten.
  - **Frist:** 15.12.2026 kl. 15:00. Står allerede i `fremdriftsplan.xlsx`, så den er ikke endret.
  - **Briefen** fryses, og PRD-en gjelder.
  - **Endringer i kravene:**
    - FR-17 får et ukefilter.
    - FR-16 følger rekkefølgen i stykklisten, uten at kritiske deler flyttes øverst.
    - FR-18 åpner forklaringen med klikk i et panel.
    - §4.5: ved et annet ferdigprodukt vises ingen sammenligning.
    - NFR-4: appen publiseres på Vercel, og alle data blir i nettleseren.
    - NFR-5 er et mål som måles tidlig.
    - NFR-8: kolonnene med varenummer og radnavn står fast ved sidescroll.
  - **Bekreftet:** FR-6 (omplanleggingshorisonten blir mulig utvidelse), FR-20, FR-22 (.xlsx) og FR-23.
  - **Lukket:** §9 spm. 8 og spm. 3 (utsatt til utvidelsen).
- `.docs/ordbank.md`: alle [BESLUTNING]-merkene er fjernet. Radene Del, Type (tre typer, raden Delmontering er fjernet), Prognostiserte behov, MPS, Eksepsjon («varsel» står nå under «Ikke bruk») og Testeksempel er oppdatert. Ny rad: Vercel. Merknadene er skrevet om til beslutninger, og merknad 5 om typelisten er ny.
- `brief.md` og `addendum.md` til briefen har fått en merknad øverst om at briefen er frosset og at PRD-en gjelder.
- Øvingseksempelet ble ikke slettet. Det finnes bare på `origin/Carmen/Branch` og `origin/Oda/Branch`, ikke på `Sebastian/Branch` eller `main`, og andres grener endres ikke herfra.
- I `issues.md` er disse punktene lukket: [BESLUTNING]-punktene i ordbanken, gruppemøtet, fasitene for FR-12/FR-28, briefen, og det gamle Finalize-punktet (videreført).
- Endringene i ordbanken, briefen og beslutningsfila er committet i 9851b76 og pushet til `origin/Sebastian/Branch` sammen med loggen, etter at Sebastian ba om det.

### Åpne punkter
- Kjør Finalize i `bmad-prd` med `beslutninger-2026-11-05.md`, i et nytt vindu.
- Gi gruppa beskjed om beslutningene. Be Carmen og Oda slette øvingseksempelet på grenene sine og ikke merge det.
- Bestem testpersoner og introduksjon for brukertesten (SM-3).
- Mål NFR-5 tidlig med en testfil på 1000 rader.
