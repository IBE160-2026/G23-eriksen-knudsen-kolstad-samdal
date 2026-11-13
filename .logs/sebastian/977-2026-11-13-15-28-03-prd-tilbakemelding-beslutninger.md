# PRD-tilbakemelding: beslutninger ført inn

## 2026-11-13 kl. 15:28 — Sebastian

### Oppgave
Lese faglærers tilbakemelding på PRD-en (`tilbakemelding-prd.md`) og finne ut hva som må og bør gjøres før UX. Deretter gå gjennom alle punktene, velge alternativ for hvert, skrive en gruppemelding, og føre alle beslutningene inn i PRD-en, slik at vi er klare for `bmad-ux`.

### Plan
- Sortere tilbakemeldingen i «må før UX», «bør før UX» og «kan vente».
- Gå gjennom 14 beslutninger med Sebastian, med «bestemmes senere» som alternativ for hver.
- Flytte brukertesten fra 30.11 til 2.–7.12, så den ikke faller på samme dag som kuttbeslutningen (Sebastian godtok anbefalingen).
- Føre beslutningene inn med `bmad-prd` Update: `prd.md`, `addendum.md`, ny `beslutninger-2026-11-13.md`, `.docs/ordbank.md` og `.memlog.md`.

### Resultat
- **Beslutninger** (`.docs/planning-artifacts/prds/prd-COSI - MRP-2026-10-19/beslutninger-2026-11-13.md`):
  - Minstekravet er trinn 1–3 (FR-1–FR-23 og FR-27–FR-29), som skal bestå SM-1, SM-2 og SM-4. Trinn 4–5 kuttes først.
  - Kuttmøtet er 30.11.
  - Kapasiteten får egen UJ-5.
  - Carmen tester NFR-11 på Mac.
  - SM-3 har tre oppgaver med 3 minutter per oppgave.
  - Brukertesten holdes 2.–7.12, med prøvetest rundt 27.11 og resultat i `.docs/brukertest/brukertest-resultat.md`.
  - FR-oversikt først i §4.
  - Regneeksempel i FR-6.
  - NFR-3, NFR-4 og NFR-10 beskriver atferd.
  - «Produksjonskapasitet» brukes i FR-31–FR-34.
  - Refleksjonsspørsmålene besvares i sluttrapporten, og PRD-ens lengde beholdes.
- **`prd.md`** (updated 2026-11-13, fortsatt `final`):
  - Ny UJ-5 med tallene fra testeksempel 05.
  - FR-oversikt med trinn.
  - «Kuttes først» i §4.7 og §4.9, og «Gjelder UJ-5» under FR-30–FR-34.
  - Eksempel i FR-6.
  - Minstekrav og kuttbeslutning i §7.1.
  - Ny tekst i SM-3.
  - §8.1 med tid, prøvetest og dokumentasjon.
  - §9 nr. 4 gjelder nå bare introduksjonen.
  - Vercel og lagringsteknologi er tatt ut av NFR-3, NFR-4 og NFR-10.
- **FR-6-eksempelet** er kontrollert mot `mrp_del` og gir forventet lagerbeholdning 20, 20, −40, 60 og nettobehov 0. Tilbakemeldingen oppga nettobehov 40 i uke 3, men det er verdien før fremskyndingen. Begge verdiene står i eksempelet.
- **`addendum.md`:** Vercel står under arkitekturinnspill, Carmen tester Mac, UX-innspillene for brukertesten og UJ-5 er oppdatert, og det er nye avsnitt i «Bakgrunn» og «Endringshistorikk».
- **Ordbank:** nye begreper er «Minstekrav for innlevering», «Kuttes først» og «Prøvetest». Radene for Vercel, Lokal lagring og Brukertest er justert.
- **Memlog:** seks nye linjer.
- **Reviewer-pass i Finalize** (rubrikk og polering med subagenter) er ikke kjørt, fordi endringene er små og avgrenset. Konsistensen er sjekket med grep: ingen gjenværende Vercel- eller localStorage-henvisninger i PRD-en.
- **`issues.md`:** Mac-testen og kapasitetens brukerreise er lukket, og brukertest-punktet er delvis løst.
- PRD-endringene er ikke committet.

### Åpne punkter
- Få gruppas bekreftelse på beslutningene. Gruppemeldingen er skrevet, men ikke sendt.
- Lag introduksjonen til brukertesten i UX-steget før prøvetesten rundt 27.11.
- Prøvetest rundt 27.11, og opprett `.docs/brukertest/brukertest-resultat.md`.
- Rett UJ-5 hvis håndkontrollen av fasit 05 endrer tallene.
