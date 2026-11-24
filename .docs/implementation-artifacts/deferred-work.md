# Utsatt arbeid

- source_spec: `.docs/implementation-artifacts/spec-1-5-les-excel-filen.md`
  summary: En stykklisterad der Nivå og Varenummer er tomme, men en annen av malens kolonner er fylt ut (for eksempel Beskrivelse eller Antall), avslutter stykklisten. Innholdet i raden forsvinner uten valideringsfeil hvis ingenting står under den.
  evidence: PRD FR-3 og AD-15 sier at det bare er innhold «under» den tomme raden som gir feil, og `les.ts` følger det. Gjennomgang 1 av Story 1.5 (Blind Hunter) viste at en siste rad med bare Beskrivelse og Antall gir en gyldig kjøring uten den delen (medium). Gruppen avgjør om innhold i selve stopperaden også skal gi feil. Det kan løses i Story 1.8 eller med et nytt felt i `RaaArk`, som krever en egen PR for `typer.ts`.
- source_spec: `.docs/implementation-artifacts/spec-1-3-appskall-med-appmeny-og-ruting.md`
  summary: Ingen test sjekker at siden ruller til toppen ved ruteskifte (`window.scrollTo(0, 0)` i `src/ui/App.tsx`).
  evidence: Gjennomgangen av Story 1.3 (Verification Gap) viste at linjen kan slettes uten at noen test feiler. Plassholderne er for korte til å rulle, så testen bør skrives i den første storyen som gir en visning ekte innhold (1.4 eller 1.11).
