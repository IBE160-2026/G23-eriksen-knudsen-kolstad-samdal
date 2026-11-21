# UX: mørk samlet prototype og lokal rydding

## 2026-11-15 kl. 15:28 — Carmen Kolstad

### Oppgave
Se Sebastians UX-design uten å påvirke Carmen/Branch, og lage én ny samlet prototype bygd på det opprinnelige mørke Design B, med innlogging og bedriftskonto som fremtidig UX-demonstrasjon. Klargjøre prototypen for gruppemøtet 16.11 og legge den på GitHub. Analysere Carmen/Branch og gjøre en begrenset lokal opprydding som Carmen godkjente.

### Plan
- Se Sebastians arbeid fra en frakoblet worktree av origin/Sebastian/Branch i scratchpad, servert på port 8766.
- Ny fil som kopi av `design-b-dashboard.html`, med kontofunksjonene fra `cosi-mrp-b-konto.html` lagt inn (patch), og egen CSS i Design B sitt mørke uttrykk. B2-temaet tas ikke med.
- Teste hele brukerreisen i Chrome uten vindu (CDP-skript i scratchpad), og fra en ny klone av Carmen/Branch på port 8767.
- Lesende analyse av branchen, deretter bare de oppryddingspunktene Carmen godkjente (B1, B3, B4, B5).

### Resultat
- **Sebastians UX** finnes bare på origin/Sebastian/Branch: `.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-13/`. De nyeste er fire nøkkelskjermer i `mockups/` (startside, resultatside, endringer, kapasitet), lagt inn 14.11 med de ferdige DESIGN.md og EXPERIENCE.md.
- **Ny prototype:** `.docs/planning-artifacts/ux/demo-2026-11-16/cosi-mrp-b-mork-samlet.html`.
  - Bygd på `design-b-dashboard.html`, med mørk intro, meny, nøkkeltall og ukeplan, og lyse tabeller og skjemaer.
  - Innlogging, opprettelse av bedriftskonto, bedrift og profil i menyen og delte kjøringer er merket «Fremtidig». Ingen ekte autentisering eller lagring.
  - Egne lagringsnøkler (`cosi-b-mork-samlet-*`).
- **Test:** 40 av 40 kontroller besto på 1440 px og 390 px, og også fra en ny klone av Carmen/Branch. Ingen JS-feil, bare at `favicon.ico` mangler på serveren.
- **README:** `demo-2026-11-16/README.md` er skrevet om. Den viser det foretrukne forslaget, hvordan det åpnes, MVP og fremtidige forslag hver for seg, hva som er simulert, avhengighetene og spørsmål til gruppen.
- **Commit `9d528d4`** «docs(ux): samlet mørk COSI-MRP-prototype til gruppemøte» med bare de to filene, pushet til origin/Carmen/Branch. Den lokale merge-commiten `3fc439e` fulgte med etter Carmens godkjenning. origin/main er uendret (`d5482d7`).
- **Lokal opprydding (godkjent av Carmen):**
  - Serverne på port 8766 og 8767 er stoppet. 8765 kjører fortsatt.
  - Worktreen `…/scratchpad/sebastian-wt` er fjernet med `git worktree remove` (ren, HEAD `af5dadd` finnes på origin/Sebastian/Branch). Testklonen `…/scratchpad/klone` er slettet (bare to usporede filer, identiske med de pushede).
  - `.git/info/exclude` (lokal, deles ikke) holder nå utenfor Git: `cosi-mrp-demo.html`, `design-a-minimal.html`, `design-b-dashboard.html`, `design-b2-dempet.html`, `design-c-premium.html`, `cosi-mrp-b-konto.html` og mappen `ux/framtid-bedriftskonto-2026-11-15/`. Filene ligger fortsatt på Mac-en.
  - `prd-carmen-lesekopi.pdf` er flyttet fra prosjektroten til `~/Documents/COSI-MRP/`. SHA-256 er lik før og etter.
  - `issues.md`: punktene om B2, Design C og b-konto er lukket med begrunnelse, og tre nye punkter er lagt til.
- **Ikke rørt (etter Carmens instruks):** technology.md, EXPERIENCE.md og .memlog.md, konsept-3-hybrid.html (fortsatt endret, ikke committet), arkitekturmappen, stasher, sikkerhetskopien `backup-2026-11-15`, lokal main, gamle scratchpad-mapper og `…/scratchpad/bmork` (arbeidsmappe for prototypen).
- Denne loggen er ikke committet, etter Carmens instruks.

### Åpne punkter
- Gruppen vurderer det foretrukne forslaget `cosi-mrp-b-mork-samlet.html` 16.11, med de seks spørsmålene i demo-README-en.
- Gruppen avklarer hvilken UX-spesifikasjon som gjelder: Carmens utkast (`ux/ux-COSI - MRP-2026-11-12/`) eller Sebastians ferdige (`ux-designs/ux-COSI - MRP-2026-11-13/`).
- Avgjør de to stashene med brief-arbeid (bruk eller forkast, eksporter til patch før eventuell sletting).
