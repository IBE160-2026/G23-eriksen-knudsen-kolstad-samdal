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

## 2026-11-16 kl. 19:19 — Odawol

### Oppgave
Oda ville at PRD-en og UX-forslagene til Carmen og Sebastian ble lest, for å finne hva hvert forslag avviker fra PRD-en i, og hvordan forslagene skiller seg fra hverandre.

### Plan
- Leste hele den godkjente PRD-en (`prd-COSI - MRP-2026-10-19/prd.md`, final 13.11).
- Leste Carmens filer fra `origin/Carmen/Branch` uten å merge: EXPERIENCE.md, DESIGN.md (utkast 12.11), README for demoen, `vurdering.md` og avstemmingen, og gikk gjennom prototypen `cosi-mrp-b-mork-samlet.html`.
- Leste Sebastians filer fra `origin/Sebastian/Branch`: EXPERIENCE.md, DESIGN.md (final 14.11) og `reconcile-prd.md`.
- Filene ble kopiert til scratchpad for lesing. Ingen filer i repoet ble endret.

### Resultat
- Sammenligningen ble gitt i chatten.
- **Carmen:** demoen hun foretrekker (16.11) avviker mest. Den har egne sider for Resultat (nøkkeltall), Ukeplan, Detaljer og Kapasitet i stedet for én resultatside (§4.4). Ukeplanen erstatter lista med ukefilter (FR-17 forbyr egen ukevisning), og kapasiteten står på en egen side (FR-34). Den har også en introduksjonsside, «Krever oppfølging» i stedet for Kritiske deler, eksepsjonsnavn i vanlig språk (ordbanken 05.11) og innlogging merket «Fremtidig» (§7.2). Hennes egen EXPERIENCE.md (12.11) ligger nær PRD-en, men er skrevet før PRD-en ble final: der står UJ-5 og oppgavene i brukertesten fortsatt som antagelser.
- **Sebastian:** forslaget følger PRD-en tett. Avvikene er små: ukefilteret starter på Uke 1 (gjør at Rygg i uke 2, oppgave 3 i SM-3, er skjult ved start), filteret «Vis bare kritiske deler», shadcn/Tailwind er valgt i UX i stedet for i arkitekturen, prøvetesten gjøres med en person utenfor gruppen (§8.1 sier gruppemedlem), «fila» i stedet for «filen», og status «final» før gruppen har godkjent.
- På `origin/Carmen/Branch` ligger også `c834a94`, en samlet prototype fra gruppemøtet 16.11 med fire uavklarte valg.

### Åpne punkter
- Sebastians ukefilter starter på Uke 1, og da er svaret på oppgave 3 i brukertesten (Rygg, uke 2) skjult ved start. Gruppen bør avgjøre standardfilteret før prøvetesten rundt 27.11.
- Carmens EXPERIENCE.md er fra før PRD-en ble final (UJ-5 og oppgavene i brukertesten står som antagelser) og må oppdateres hvis den skal brukes videre.
