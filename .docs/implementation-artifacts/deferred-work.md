# Utsatt arbeid

- source_spec: `.docs/implementation-artifacts/spec-1-5-les-excel-filen.md`
  summary: En stykklisterad der Nivå og Varenummer er tomme, men en annen av malens kolonner er fylt ut (for eksempel Beskrivelse eller Antall), avslutter stykklisten. Innholdet i raden forsvinner uten valideringsfeil hvis ingenting står under den.
  evidence: PRD FR-3 og AD-15 sier at det bare er innhold «under» den tomme raden som gir feil, og `les.ts` følger det. Gjennomgang 1 av Story 1.5 (Blind Hunter) viste at en siste rad med bare Beskrivelse og Antall gir en gyldig kjøring uten den delen (medium). Gruppen avgjør om innhold i selve stopperaden også skal gi feil. Det kan løses i Story 1.8 eller med et nytt felt i `RaaArk`, som krever en egen PR for `typer.ts`.

- source_spec: `.docs/implementation-artifacts/spec-1-6-kontroll-av-malens-struktur.md`
  summary: Avhengigheter inne i Stykkliste står ikke i `hoppetOver`. Uten overskriften Varenummer kan reglene «fylt ut første gang, tom de neste», `TYPE_ULIK` og `UNDERDELER_ULIKE` ikke brukes, og uten Nivå kan reglene om nivå, underdeler og ledetid ≥ 0 for nivå 0 ikke brukes.
  evidence: Gjennomgang 1 av Story 1.6 (Blind Hunter), medium. `HoppetOverKontroll` har bare (ark, felt), så en delregel kan ikke beskrives uten endring i `typer.ts`. Story 1.8 (Idun) må hoppe over disse reglene for å unngå følgefeil (FR-2), og avgjøre om feiloppsummeringen skal nevne dem.

- source_spec: `.docs/implementation-artifacts/spec-1-9-kontroll-av-mps-og-planlagte-mottak.md`
  summary: Meldingen for `MOTTAK_UKE_UTENFOR_HORISONT` etter horisonten sier ikke hva horisonten H er, så Kari må telle ukene i Prognostiserte behov selv.
  evidence: Gjennomgang 1 av Story 1.9 (Blind Hunter), low. `Valideringsfeil` har ikke et felt for H, og `typer.ts` endres bare i egen PR (AD-3). Kan løses med et valgfritt felt `horisont`, eller ved at feiloppsummeringen i 1.12 viser H.

- source_spec: `.docs/implementation-artifacts/spec-1-9-kontroll-av-mps-og-planlagte-mottak.md`
  summary: Sikkerhetsnettet i `valider()` kan gi Stykkliste-koder (`NIVAA_UGYLDIG`, `TYPE_UGYLDIG` med flere) som ikke har en tekstmal i `nb.ts`. Ingen test sjekker at alle kodene `valider` kan gi, har en mal.
  evidence: Gjennomgang 1 av Story 1.9 (Blind Hunter), medium. Malene for Stykkliste hører til 1.8 (Idun). Når 1.8 er flettet, bør en test sjekke at hver kode i `VALIDERINGSKODER` har en mal i `filfeilOgValidering`, før 1.12 viser feilene.
