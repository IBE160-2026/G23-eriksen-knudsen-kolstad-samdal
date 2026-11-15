# Gjennomgang av UX-forslag

## 2026-11-15 kl. 16:14 — Odawol

### Oppgave
Oda ville se UX-forslagene i Carmens og Sebastians brancher før gruppemøtet 16.11.

### Plan
- Hentet remote-branchene og listet UX-filene i `origin/Carmen/Branch` og `origin/Sebastian/Branch` mot `main`.
- Leste Carmens `demo-2026-11-16/README.md` og `resultatkonsepter-2026-11-15/vurdering.md`.
- Sjekket ut hver branch i et midlertidig git-worktree i scratchpad, slik at `Oda/Branch` og de ukommitterte endringene ikke ble rørt, og startet en lokal server for hver (port 8765 og 8766).
- Åpnet forslagene i nettleseren, og stoppet serverne og fjernet worktreene da Oda var ferdig.

### Resultat
- **Carmen** (`9d528d4`): én samlet klikkbar prototype, `.docs/planning-artifacts/ux/demo-2026-11-16/cosi-mrp-b-mork-samlet.html`. Mørkt Design B med sidemeny, og sidene Introduksjon, Ny kjøring, Resultat, Ukeplan, Detaljer, Endringer, Kapasitet, Lagrede kjøringer og Veiledning. Innlogging og bedriftskonto er merket «Fremtidig». Beregningen er simulert med fasitene fra testeksempel 01–03. DESIGN.md og EXPERIENCE.md er utkast «til godkjenning».
- **Sebastian** (`af5dadd`): fire skisser av hovedskjermbildene i `.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-13/mockups/` (startside, resultatside, endringer, kapasitet). DESIGN.md og EXPERIENCE.md er merket «final». Han har også fem designretninger og fargetemaer under `.working/`, `reconcile-prd.md` og en valideringsrapport.
- Ingen filer i repoet ble endret. De midlertidige worktreene er fjernet (`git worktree list` viser bare `C:/IBE160`).

### Åpne punkter
- Carmens `vurdering.md` anbefaler resultatkonsept A som hovedvisning, men demoen til møtet bygger på B. Gruppen bør avklare hvilken retning hun foreslår.
- Gruppen må velge mellom Carmens og Sebastians UX-forslag, eller slå dem sammen. Begge har egne versjoner av DESIGN.md og EXPERIENCE.md.
- Carmens liste over konflikter med PRD-en må avgjøres før retningen føres inn i EXPERIENCE.md: FR-17 (ukeliste med filter), FR-18 (forklaringspanel ved siden av tabellen), vanlig språk mot ordbankens navn på eksepsjonene, og introduksjonssiden.
- Godkjente menyord (Resultat, Ukeplan, Detaljer, Krever oppfølging) må legges inn i ordbanken.
- Carmens branch har 61 nye filer, blant annet PRD-utkast, testdata-arkiv og logger. UX-delen bør trolig få sin egen PR hvis den skal inn på `main`.

## 2026-11-15 kl. 21:50 — Odawol

### Oppgave
Oda ville åpne Carmens UX-forslag i nettleseren for å teste en kjøring selv.

### Plan
- Hentet `origin/Carmen/Branch`. Den står fortsatt på `9d528d4`, samme commit som ved gjennomgangen tidligere i dag.
- Leste `demo-2026-11-16/README.md` for oppstartsinstruksjon og forslag til testkjøring.
- Sjekket ut branchen i et midlertidig git-worktree i scratchpad og startet `python -m http.server 8765` derfra.
- Åpnet `cosi-mrp-b-mork-samlet.html` i standardnettleseren, og stoppet serveren og fjernet worktreen da Oda var ferdig.

### Resultat
- Prototypen svarte med HTTP 200 og ble åpnet på http://localhost:8765/.docs/planning-artifacts/ux/demo-2026-11-16/cosi-mrp-b-mork-samlet.html.
- Oda fikk oppskriften på testkjøringen: last opp testeksempel 01, gå gjennom Resultat, Ukeplan og Detaljer, last opp 02 og 03 for å se Endringer, og bruk «Prototypevalg» for å se Kapasitet.
- Ingen filer i repoet ble endret. Serveren er stoppet og worktreen fjernet (`git worktree list` viser bare `C:/IBE160`).

### Åpne punkter
Ingen nye. Punktene fra gjennomgangen tidligere i dag står fortsatt åpne i `issues.md`.
