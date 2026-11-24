# Review av PR #26 (Story 1.7 Stykklistestruktur)

## 2026-11-24 kl. 17:39 — Sebastian

### Oppgave
Sebastian ba om en review av PR #26, og deretter om å legge funnene inn som kommentar på PR-en (Idun, Story 1.7: `src/domene/struktur.ts` med `byggStruktur`, tester og dokumentrettelser om lavnivåkode som lengste vei).

### Plan
- `bmad-review` med lensene adversarial, edge-case-hunter og verification-gap. De redaksjonelle lensene ble ikke kjørt, siden innholdet er en kodediff.
- PR-diffen og PR-beskrivelsen ble lagret i scratchpad. PR-headen (90af469) ble sjekket ut i et midlertidig worktree, som er fjernet igjen.
- De viktigste påstandene ble kontrollert mot koden: ordbanken, arkitekturloggen, vaktregexen i testen, `lag_testdata.py` og typen til `Forekomst.underdeler`.

### Resultat
23 funn (12 adversarial, 7 edge-case, 4 verification-gap). Ingen kodeendringer. De kontrollerte hovedfunnene:
- Vaktregexen `/\bberegningsrekkefolge\s*[:,}]/` (`struktur.test.ts:306-312`) treffer også destrukturering (`const { deler, beregningsrekkefolge } = s`), så Story 1.9/2.x får rød test når de leser `Struktur` på vanlig måte.
- Ingen test sjekker at den lengste stien vinner når den kommer fra en senere overordnet del. Fixturen har tilfellet allerede: 300-023 i 04 skal ha ledetid 6 via 200-010, ikke 2. Uavgjort sti (300-002 i 02) er heller ikke testet.
- `.docs/ordbank.md:81` har fortsatt den gamle definisjonen av lavnivåkode (CLAUDE.md-regel).
- I arkitekturen er AD-6-regelen ikke oppdatert, og loggraden 23.11 står etter raden for 24.11.
- Sløyfer (A under B og B under A) slipper gjennom valideringen. `byggStruktur` dropper kanten uten signal, og resultatet avhenger av besøksrekkefølgen. PR-en nevner dette selv og sender det videre til 1.8.
- JSDoc sier at svaret er udefinert for ukontrollerte rader, men Story 1.8 skal bruke `Struktur` til reglene om underdeler.
- `underdeler[].antall` er `number` i `typer.ts:306`, så tomt antall blir 0. Det kan gi to valideringsfeil for én feil.
- `slaaSammenUnderdeler` summerer like underdeler innenfor en forekomst, mens `lag_testdata.py` sammenligner rå lister. «Likt» i FR-3 er ikke avklart.
Hele funnlista i JSON lå i scratchpad (`pr26-review.json`).

Funnene er senere lagt inn som én review-kommentar (COMMENTED, ikke godkjenning eller endringskrav) på PR #26, gruppert i tester, kontrakten mot Story 1.8, dokumenter og mindre punkter.

### Åpne punkter
Ingen. Idun har fått funnene som review-kommentar på PR #26.

## 2026-11-24 kl. 18:00 — Sebastian

### Oppgave
Idun svarte på reviewen av PR #26. Sebastian ba om en vurdering av om PR-en er klar til godkjenning, og deretter om å godkjenne den.

### Plan
- Lest Iduns svar og diffen i `dc2756d` og `7ea4d9f` mot `90af469`.
- Kjørt tester, lint og bygg på PR-headen i et midlertidig worktree, som er fjernet igjen. Prøveflettet med `story/1.6-kontroll-struktur`.

### Resultat
- Rettet: testvakten ser nå etter bygging av `Struktur`, ikke etter feltnavnet. Nye tester dekker lengste sti (300-023 = 6), lik ledetid (300-002), underdeler bare under en senere forekomst og at en overordnet del står før underdelene. AD-6-regelen, rekkefølgen i endringsloggen og ordbanken er oppdatert. `struktur.ts` er uendret.
- På `7ea4d9f` er 127 av 127 tester grønne, og lint og bygg er grønne. Prøveflettingen med #25 ga ingen konflikter.
- PR #26 er godkjent fra Sebastians konto (reviewDecision APPROVED, mergeStateStatus CLEAN).
- Flyttet til Story 1.8 etter avtale: sløyfer, tomt antall som blir 0, og hva «like» underdeler betyr (FR-3). Kommentaren i `typer.ts:323` rettes i en egen PR.

### Åpne punkter
- Før Story 1.8 skrives, må gruppen avgjøre hvordan sløyfer håndteres og hva «like» underdeler betyr i FR-3 (Idun fører dette i sin `issues.md`).
