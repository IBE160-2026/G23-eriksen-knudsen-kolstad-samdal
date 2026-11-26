# Review av PR #33 (Story 1.8, kontroll av arket Stykkliste)

## 2026-11-26 kl. 16:58 — Sebastian

### Oppgave
Sebastian ba om en review av Iduns Story 1.8 (PR #33, `story/1.8-kontroll-av-arket-stykkliste`, commit fdd315d).

### Plan
- `bmad-review` med tre lenser parallelt: adversarial, edge-case og verifikasjonshull, på diffen mot merge-basen med main.
- PR-branchen flettet med dagens main i et midlertidig worktree, og testene kjørt der.
- De viktigste funnene sjekket mot koden med en midlertidig probetest (slettet etterpå).

### Resultat
- PR-en fletter uten konflikter med main. På main + branchen: `npm test` 799 grønne, lint og `tsc -b` grønne.
- Ingen blokkere: V-S01–V-S29 gir én feil hver, og de gyldige filene gir 0 feil.
- Bekreftet med probe:
  - Følgefeil som ikke sperres:
    - `RADER_INGEN_NIVAA_1` i tillegg til `NIVAA_UGYLDIG` når brukeren skriver 1 i stedet for .1.
    - `TYPE_ULIK` og `TYPE_KJOPES_INN_HAR_UNDERDELER` på samme celle.
    - En del direkte under seg selv gir også `TYPE_ULIK` og `*_FYLT_UT_SENERE`.
    - `NIVAA_2_UTEN_NIVAA_1_OVER` etter en ekstra nivå 0-rad.
  - Skjulte feil:
    - Antall kontrolleres ikke når nivået er ukjent.
    - Lager, SS og ledetid kontrolleres ikke når varenummeret er ukjent.
    - Én antallsfeil hvor som helst slår av alle underdelsreglene og sløyfekontrollen (global `kanBygge`).
  - Rekkefølgen i samme rad følger ikke kolonnene (H3 kommer før E3), stikk i strid med kommentaren og PR-teksten.
- Verifikasjonshull:
  - Testene for sikkerhetsnettet (`tilStykklisterader`, min kode fra 1.9) når ikke lenger fram til det, fordi reglene gir samme kode først.
  - Vakten for manglende Beskrivelse-overskrift har ingen test.
- Annet:
  - «forekomst» og «sløyfe» mangler i ordbanken.
  - Punkt 5 og 17 i `deferred-work.md` (stopperaden, test for at hver kode har en mal) er verken løst eller oppdatert.
  - Tolkningen er fortsatt duplisert (beskrivelse, `NIVAATALL`, `erTom`).
- Forkastet:
  - 0.1 som nivå er et bevisst valg fra 1.5 (`les.test.ts:236`).
  - Tekst med bare mellomrom i sikkerhetsnettet kan ikke komme fra `les.ts`.
- Funnlista (JSON) ligger i scratchpad for økten: `pr33-funn.json`. Ingen kodeendringer.
- Reviewen er lagt inn på PR #33 som review-kommentar (COMMENTED, ikke Approve), gruppert som over. Idun er bedt om ikke å gjøre noe med testene for sikkerhetsnettet.
- Lukket i `issues.md`: punktet om å gi Idun beskjed om plassholderen i `valider()`. PR #33 bytter den ut og legger inn malene.

**Runde 2 (Iduns rettelser i f98a509, branchen også flettet med main 78539c5):**
- Samme tre lenser på rettecommiten, med funnene fra runde 1 som bakgrunn. Testene kjørt på branchen: `npm test` 908 grønne, lint, `tsc -b` og bygg grønne.
- Probene fra runde 1 kjørt på nytt: alle gir nå bare den riktige feilen. `struktur.ts` er bare endret ved at `NIVAATALL` importeres, så beregningen oppfører seg likt.
- Nye funn, bekreftet med probe:
  - Mangler Antall-overskriften, gir en underdel som står to ganger (4 + 4 mot 8), en falsk `UNDERDELER_ULIKE`. Rettelsen fjernet `bruk('Antall')` fra sperren, og antallet blir da 1 (`valider-stykkliste.ts:225, 266`).
  - En tom rad som kutter underdelene til en forekomst, gir en falsk `UNDERDELER_ULIKE` ved siden av `RADER_IKKE_SAMMENHENGENDE`. Fantes også i runde 1.
  - `0, ..2, ..2` gir `RADER_INGEN_NIVAA_1` og `NIVAA_2_UTEN_NIVAA_1_OVER`.
- Små ting:
  - `updated` i ordbanken står på 2026-11-25.
  - Testen «nivå 1 i stedet for .1» kan bestå uten noen nivåfeil (`every` på en tom liste).
  - `antallMedFeil` sperrer alle forekomstene av delen.
  - Typefeil kan fortsatt gi to feil på én celle.
  - En rad rett under seg selv kan bli fasit for beskrivelse og type.
- Smale grensetilfeller som jeg ikke regner som verdt en ny runde: kolonnerekkefølge ved flyttede kolonner, kommentaren til `radliste`, testen for alle malene, og `TYPE_KJOPES_INN` mot fasittypen.
- Funnlista ligger i scratchpad: `pr33-runde2-funn.json`. Ingenting er lagt på PR-en ennå.

### Åpne punkter
- Gi Idun funnene fra runde 2 på PR #33 (to falske `UNDERDELER_ULIKE`, `0, ..2, ..2`, ordbankdatoen og testen), og avgjør om du godkjenner nå eller etter rettelsene.
- Testene for sikkerhetsnettet i `tests/domene/valider-mps-og-mottak.test.ts` (531–602) tester nå reglene, ikke sikkerhetsnettet: test `tilStykklisterader` direkte, eller fjern sikkerhetsnettet (min kode fra 1.9).
- Gruppa bør godkjenne Iduns forslag i PR #33: sløyfer gir `VARENUMMER_UNDER_SEG_SELV`, og `[X:1, X:1]` er det samme som `[X:2]`. `lag_testdata.py` (linje 362–372) bruker en annen regel.
