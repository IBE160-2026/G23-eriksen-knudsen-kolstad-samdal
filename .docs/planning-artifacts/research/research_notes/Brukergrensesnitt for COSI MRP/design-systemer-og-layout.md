# Designsystemer, layoutmønstre og visuell stil for COSI - MRP

Scope: overordnede UI-retninger, designsystemer og sideoppsett for en datatett, desktop-only MRP-app (React-lignende stack på Vercel, norsk UI, planleggere uten MRP-bakgrunn, motmål "ikke oversvøm tabellen med farger/symboler"). Universell utforming er dekket av en annen researcher; bare relevante berøringspunkter er notert her.

Metodenotat: ca. 17 søk/hentinger. Flere offisielle sider (SAP Fiori "flexible column layout", deler av designsystemet.no) returnerte 403/404 eller lite innhold ved henting. Funn som bygger på forfatterens bakgrunnskunnskap uten verifisering i denne økten, er merket **[ikke verifisert i økten]** og hører hjemme under Inferences, ikke Cited Findings.

---

## 1. Hvilke designsystemer passer best for datatette desktop-arbeidsapper, og hva er praktisk for et lite studentteam?

### Takeaway
Systemene med eksplisitt tetthetsmodell og moden datatabell (IBM Carbon, SAP Fiori, Ant Design) er tydeligst tilpasset "planlegger ved skrivebord"-arbeid; Carbon har den mest konkrete tabellveiledningen (5 radhøyder, verktøylinje, utvidbare rader, sidepanel som alternativ). For et lite React-team på Vercel med norsk UI er de mest realistiske valgene enten (a) Digdirs Designsystemet (MIT, React-pakke, norsk opphav, UU-fokus, men generelt og ikke laget for datatett planlegging) eller (b) shadcn/ui/Mantine/Ant Design + en egen tabell (f.eks. TanStack Table). Fiori/UI5 er uforholdsmessig tungt for et studentprosjekt.

### Cited Findings
**IBM Carbon (datatabell)**
- Carbon har fem radstørrelser: xs 24 px, sm 32 px, md 40 px (standard), lg 48 px, xl 64 px; header-raden skal alltid matche radstørrelsen, og xl brukes kun når rader forventes å ha to linjer innhold — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- Verktøylinjen skal matche radhøyden og er reservert for globale handlinger (innstillinger, komplekse filtre, eksport, redigering), maks fem handlinger før overflow-meny — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- Utvidbare rader brukes for tilleggsinformasjon/data som krever ekstra spørretid; når utvidet innhold blir trangt, anbefaler Carbon heller en egen side, et **sidepanel** eller en separat tabell. "Utvid alle" er valgfritt og ikke vist som standard — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- Zebrastriper anbefales for horisontal skanning; hover-tilstand på rad skal alltid være på, også for ikke-interaktive rader, for å hjelpe skanning — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)
- Batch-handlingslinje dukker opp over tabellen når noe velges; radnivå-handlinger deaktiveres i batch-modus — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)

**SAP Fiori (tetthet)**
- Fiori har to tetthetsmoduser: "cozy" (44 px berøringsflate) og "compact" (32 px for rader/verktøylinjer). Alle Fiori-komponenter støtter begge; de fleste har cozy som standard — [SAP Fiori: Content Density (Cozy and Compact)](https://www.sap.com/design-system/fiori-design-web/v1-139/foundations/visual/cozy-compact)
- Valg skal være enhetsbasert: berøring → cozy; mus og tastatur → compact. Cozy og compact skal ikke blandes på samme side; sett tetthet på applikasjonsnivå — [SAP Fiori: Content Density](https://www.sap.com/design-system/fiori-design-web/v1-139/foundations/visual/cozy-compact)
- Dialoger åpnet fra en compact-visning arver ikke tettheten automatisk (rendres et annet sted i DOM) — [SAPUI5 1.38 Content Densities (eldre dok.)](https://ui5.sap.com/1.38.63/docs/guide/e54f729da8e3405fae5e4fe8ae7784c1.html)
- Fiori-guidelines ligger nå under sap.com/design-system; experience.sap.com/fiori-design-web/flexible-column-layout/ 301-videresender dit (siden returnerte 403 ved henting) — [SAP Fiori FCL (redirect)](https://www.sap.com/design-system/fiori-design-web/page-types/page-layouts/flexible-column-layout/)

**Microsoft Fluent 2**
- Fluent 2 bruker en global spacing-rampe med 4 px basisenhet, og grid-oppførsel (fixed/stretch/hybrid) velges per innholdstype — [Fluent 2 Layout](https://fluent2.microsoft.design/layout)
- Fluents (WinUI) "compact sizing" er primært for pekerinput og informasjonstette oppsett ("dense, information-rich groups of controls ... browsing large amounts of content"), og endrer f.eks. 44 epx-grid til 40 epx — [Microsoft Learn: Spacing](https://learn.microsoft.com/en-us/windows/apps/design/style/spacing)
- Fant ikke offisiell Fluent 2-veiledning om tetthet for DataGrid/Drawer i søkene (se Gaps).

**Designsystemet (Digdir)**
- Designsystemet er et felles verktøysett av UI-komponenter, retningslinjer og mønstre ("Kom i gang", "Komponenter", "Mønstre"); komponentene beskrives som rammeverksuavhengige — [designsystemet.no](https://www.designsystemet.no/)
- Repo digdir/designsystemet er MIT-lisensiert; pakker: `@digdir/designsystemet-react` (React), `@digdir/designsystemet-web` (web components), `@digdir/designsystemet-css` (CSS + standardtema), CLI som genererer CSS/tokens fra konfig, samt TypeScript-typer. Temabygger på theme.designsystemet.no. Uttalt mål: konsistente, brukervennlige digitale løsninger for offentlige tjenester — [GitHub digdir/designsystemet](https://github.com/digdir/designsystemet)

**Ant Design, shadcn/ui, Mantine (React-bibliotek)**
- Ant Design v5 styles via design-tokens og temaalgoritmer (default, dark, **compact**) konfigurert gjennom en provider; beskrevet som bygget av Alibaba for komplekse, datatunge B2B-apper; Table har sortering, filtrering, paginering og virtuell scrolling — [DesignRevision: Ant Design alternatives (2026)](https://designrevision.com/alternatives/ant-design); [AdminLTE: shadcn vs MUI vs Ant Design](https://adminlte.io/blog/shadcn-ui-vs-mui-vs-ant-design/)
- shadcn/ui er en kopier-og-lim-modell der man eier kildekoden; én anmeldelse hevder at man "hits walls faster" i komplekse datatunge apper — [AdminLTE: shadcn vs MUI vs Ant Design](https://adminlte.io/blog/shadcn-ui-vs-mui-vs-ant-design/) (merk: blogg, delvis leverandørtilknyttet; meningsytring, ikke benchmark)
- Mantine beskrives som et populært React-bibliotek med 100+ komponenter og 50+ hooks — [DesignRevision: Ant Design alternatives](https://designrevision.com/alternatives/ant-design) (bloggkilde)

**Generelt om tetthet i grid-komponenter**
- Kompakt grid-modus krever at også verktøylinje, filterrad, paginering og editorer krympes for å holde konsistens (Telerik-eksempel) — [Telerik blog: compact mode](https://www.telerik.com/blogs/introducing-compact-mode-optimize-available-screen-space-blazor-datagrid)

### Inferences
- **Tetthet:** COSI er desktop-only med mus/tastatur, så etter Fiori-logikken bør appen bruke én konsekvent "compact/medium" tetthet (Carbon sm 32 px eller md 40 px rader) for MRP-tabellen — men brukere uten MRP-bakgrunn og krav om tastatur+touch-klikk på celler taler for **md (≈40 px)** som standard og evt. en enkel "kompakt"-bryter, i stedet for xs/24 px. Ikke bland tettheter på samme side.
- **Kandidatvurdering for COSI** (syntese):
  - *Carbon (React-pakke @carbon/react)* — sterkest dokumentert tabell-/tetthetsveiledning; IBM-preget visuelt uttrykk; relativt tungt (Sass), men realistisk. Godt valg som **referanse for regler** selv om man ikke bruker biblioteket. [ikke verifisert i økten: at @carbon/react er gjeldende pakkenavn]
  - *SAP Fiori/UI5* — best domenetilpasning (ERP/planlegging), men UI5 er eget rammeverk, ikke React-native; høy læringskurve. Bruk som **inspirasjon** (dynamic page, object page, FCL), ikke som bibliotek.
  - *Fluent 2 (@fluentui/react-components)* — gjenkjennelig "Office/Excel"-uttrykk for planleggere som allerede bruker Excel; har DataGrid og Drawer [ikke verifisert i økten].
  - *Designsystemet (Digdir)* — norsk, MIT, React-pakke, UU-fokus, temabygger; men laget for offentlige tjenester (skjema/innhold), ikke datatette arbeidsflater; en avansert datatabell må trolig bygges selv. Kan gi "norsk/UU-trygg" grunnstil.
  - *Ant Design* — innebygd compact-algoritme og kraftig Table; tung pakke og kinesisk-preget estetikk/dokumentasjon; i18n støtter nb_NO [ikke verifisert i økten].
  - *shadcn/ui + Tailwind (+ TanStack Table)* — maksimal kontroll, lett å få "rolig" uttrykk, populært i Vercel-økosystemet; man må selv sikre tabellmønstre (sticky header/første kolonne, tastaturnavigasjon i grid) og UU.
  - *Mantine* — mange ferdige komponenter (inkl. Drawer, Notifications), enkel temaing; mellomting mellom Ant og shadcn.
  - *Material 3, Polaris, Primer, Atlassian* — M3 er mer forbruker/mobil-orientert (romslig); Polaris er knyttet til Shopify-admin; Primer til GitHub; Atlassian-komponenter er delvis knyttet til Atlassian-produkter. Lavere relevans som bibliotek, men nyttige som mønsterreferanser. [ikke verifisert i økten]
- **Praktisk anbefaling for studentteam:** velg ett komponentbibliotek med ferdig Drawer/Sheet, Alert/Notification, Tabs, Dialog og god tastaturstøtte (Mantine eller shadcn/ui; evt. Designsystemet-react hvis norsk offentlig preg og UU-dokumentasjon veier tyngst), og bygg MRP-rutenettet som egen komponent (TanStack Table) etter Carbons og NN/gs tabellregler.

### Gaps
- Fikk ikke hentet Fluent 2 DataGrid/Drawer-sider, Atlassian, Primer, Polaris, M3 sine tabell-/tetthetssider — ingen sitater herfra.
- Designsystemet: fikk ikke bekreftet komponentliste (Table, Dialog, Alert, ev. "Drawer"), størrelsesmoduser (sm/md/lg) eller versjonsstatus — "Kom i gang"-URL ga 404.
- Fant ingen uavhengig, metodisk sammenligning av React-bibliotekenes tetthet/tabell for datatette apper; kun blogger.
- SAP Fiori Flexible Column Layout-siden returnerte 403; innhold om list-detail-detail kan ikke siteres.

---

## 2. Hvilket sidemønster passer flyten opplasting → feil → forslag → kritiske deler → tabell → forklaringspanel → sammenligning → kapasitet?

### Takeaway
En lett, eksplisitt stegindikator (Last opp → Valider → Resultat) er riktig for den sjeldne, lineære innleveringsdelen (NN/g: veivisere passer nybegynnere og sjeldne oppgaver), mens resultatdelen bør være ett **arbeidsområde** (workspace) med stablede seksjoner i fast rekkefølge (ordreforslag → kritiske deler → MRP-tabell) og et **ikke-modalt høyre inspektørpanel** for forklaringer. Sammenligning og kapasitet passer best som egne faner/visninger innen samme arbeidsområde, ikke flere wizard-steg.

### Cited Findings
- NN/g definerer en veiviser (wizard) som en steg-for-steg-prosess der brukeren legger inn informasjon i fast rekkefølge og senere steg kan avhenge av tidligere; anbefales for nybegynnere eller sjeldne oppgaver (oppsett/konfigurasjon); ulemper: flere klikk og mindre brukerkontroll; fortell brukeren på forhånd hvor mange steg det er — [NN/g: Wizards](https://www.nngroup.com/articles/wizards/) (sammendrag via søk; full artikkel ikke hentet)
- Andre designsystemer advarer mot veivisere når brukeren trenger oversikt eller vil redigere i vilkårlig rekkefølge; terskler varierer (Visa: 4+ steg; Semrush: 3–5 steg) — [Visa Design System: Wizard](https://design.visa.com/patterns/wizard/usage/); [Semrush Intergalactic: Wizard](https://developer.semrush.com/intergalactic/components/wizard/wizard); [PatternFly: Wizard](https://patternfly.org/components/wizard/design-guidelines)
- NN/g (2022) sammenligner måter å vise/redigere én rad: modal popup frarådes fordi den skjuler naborader brukeren ofte trenger å referere til; **ikke-modalt panel eller eget vindu** lar brukeren jobbe med en post mens tabellen er synlig; trekkspill-utvidelse skjuler ikke tabellen, men brukere lar dem stå åpne og det blir vanskelig å referere til fjerne rader — [NN/g: Data Tables: Four Major User Tasks (2022)](https://www.nngroup.com/articles/data-tables/) **(2022 – litt eldre enn 2023-vinduet, men fortsatt gjeldende NN/g-veiledning)**
- NN/g: tabeller skal støtte fire oppgaver — finne poster etter kriterier, sammenligne, vise/redigere én rad, utføre handlinger; frys header-rad og første kolonne når tabellen er større enn skjermen; første kolonne bør være en lesbar identifikator (ikke autogenerert ID); kolonner sorteres etter viktighet og relaterte kolonner holdes ved siden av hverandre — [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)
- Carbon nevner sidepanel som alternativ når utvidet radinnhold blir trangt — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)

### Inferences
- **Anbefalt hybrid ("guided workspace"):**
  1. *Inngang:* Én side med opplastingssone + stegindikator (1 Last opp, 2 Kontroll, 3 Resultat). Ved feil: blir på steg 2 med en samlet feilliste (gruppert per ark/rad, lenke til celle), ikke en kjede av modaler. Dette er den eneste "wizard-aktige" delen.
  2. *Resultat-arbeidsområde:* sticky toppfelt (sammendragslinje) med kjøringens metadata (filnavn, tidspunkt, horisont uke 1–N), nøkkeltall (antall ordreforslag, antall kritiske deler, antall unntak) og globale handlinger (Eksporter til Excel, Ny kjøring, Sammenlign med forrige). Deretter stablede seksjoner i den fastsatte rekkefølgen: Ordreforslag (med ukefilter) → Kritiske deler (kort oppsummering) → MRP-tabell.
  3. *Inspektørpanel høyre side (ikke-modalt, push/overlay-drawer):* åpnes ved klikk/Enter på celle/rad, viser "hvorfor"-forklaring (formelkjede: brutto – planlagt mottak – lager = netto, ledetid-forskyvning, lotstørrelse). Tabellen forblir synlig (NN/g-begrunnelse). Lukk med Esc, fokus returneres til cellen.
  4. *Sammenligning og Produksjonskapasitet:* egne faner/visninger på samme nivå som "Resultat" (f.eks. faner: Resultat | Endringer fra forrige kjøring | Produksjonskapasitet), fordi de er sekundære analyser med egne tabeller. Kapasitetspanelet er eksplisitt "separat" i kravene.
- **Hvorfor ikke ren dashboard/"bento":** bento-kort fragmenterer informasjonen og bryter den fastsatte rekkefølgen; kan likevel brukes i liten skala i sammendragslinjen (3–4 nøkkeltall-fliser).
- **Hvorfor ikke ren master-detail/FCL:** MRP-tabellen er en matrise (del × uke) som trenger full bredde; et permanent listepanel til venstre stjeler kolonner. Bedre: deleliste er radene i matrisen, og detaljen er høyre inspektør. En utvidbar rad (accordion) er dårlig for 8–12 ukekolonner × 6 MRP-linjer per del.
- **Tabeller vs. stablede seksjoner:** Stablede seksjoner for hovedflyten (rekkefølgen er et krav og leses ovenfra og ned); faner kun for parallelle, alternative visninger (sammenligning, kapasitet). Ankerlenker/innholdsnavigasjon i toppfeltet kan hoppe til seksjonene.
- **MRP-tabellstruktur:** frys første kolonne (delenummer + navn) og ukeheader; gruppér de seks MRP-linjene per del (rad-gruppe) med subtil gruppeskille; sorter delene etter BOM-nivå eller etter "kritisk først" med filter "Vis bare deler med unntak".

### Gaps
- Fikk ikke hentet NN/g-artikler om "overlay vs. side panel/drawer" eller "progressive disclosure" direkte; anbefalingen om ikke-modalt panel hviler på NN/g-tabellartikkelen og Carbon.
- Ingen empiriske studier funnet som sammenligner wizard vs. workspace spesifikt for planleggingsverktøy.

---

## 3. Visuelle stiltrender 2024–2026 for enterprise-programvare (minimalisme, "calm UI", dark mode, tetthetsvalg) og hva forskning sier om effekten

### Takeaway
Den sterkeste forskningen gjelder polaritet: NN/g oppsummerer at lys modus (mørk tekst på lys bakgrunn) gir bedre ytelse for normalt seende, særlig ved lesing/korrekturlesing, mens nyere studier viser stor individuell variasjon. For COSI bør lys modus være standard; mørk modus er "nice to have". Tetthetsvalg er etablert praksis (Fiori, Fluent, Ant, Carbon), men skal settes konsekvent på applikasjonsnivå. "Calm UI"/minimalisme som trend er godt synlig, men lite empirisk underbygget utover generelle prinsipper — det stemmer likevel med prosjektets motmål om å unngå farge-/symbolflom.

### Cited Findings
- NN/g: i studier slo positiv polaritet (lys modus) negativ polaritet på synsskarphet og korrekturlesing på tvers av aldersgrupper; i en relatert studie var det ingen signifikant forskjell ved dagslys, men lys modus var bedre ved simulert natt; deltakerne opplevde ikke forskjell i lesbarhet selv om de presterte bedre i lys modus; mørk modus kan ha fordeler for enkelte svaksynte (f.eks. grå stær) — [NN/g: Dark Mode vs. Light Mode](https://www.nngroup.com/articles/dark-mode/) **(publisert 2020 – eldre enn 2023; sammendrag via søk, ikke full henting)**
- 2024 IEEE VIS kortartikkel: hvilken polaritet som ga best ytelse, og hvor mye, varierte individuelt, og best ytende polaritet samsvarte ikke alltid med foretrukket polaritet — [arXiv 2409.10841](https://www.arxiv.org/pdf/2409.10841)
- En 2025 eye-tracking-studie rapporterte høyere relativ pupilldilatasjon i mørk modus, men lavere opplevd arbeidsbelastning enn i lys modus — [Univ. St. Gallen (Alexandria)](https://www.alexandria.unisg.ch/server/api/core/bitstreams/62e4b3c1-0521-4d3a-bbad-e6e5eb81795e/content) (sammendrag via søk; detaljer ikke verifisert)
- Tetthet: Fiori anbefaler compact for mus/tastatur og at tetthet settes på app-nivå, ikke blandes — [SAP Fiori Content Density](https://www.sap.com/design-system/fiori-design-web/v1-139/foundations/visual/cozy-compact); Fluent compact er ment for informasjonstette oppsett med pekerinput — [Microsoft Learn: Spacing](https://learn.microsoft.com/en-us/windows/apps/design/style/spacing); Ant Design v5 har en egen compact-temaalgoritme — [DesignRevision](https://designrevision.com/alternatives/ant-design)
- Mange produkter tilbyr brukerstyrt grid-tetthet (eks. Adobe Analytics Workspace "view density", Alloy Navigator grid density) — [Adobe Experience League: View density](https://experienceleague.adobe.com/en/docs/analytics/analyze/analysis-workspace/build-workspace-project/view-density?lang=en); [Alloy Navigator: Customize grid density](https://docs.alloysoftware.com/alloynavigator/help/webportal/content/common-functions/customizing-grids/customize-grid-density.htm)
- Carbon: zebrastriper og rad-hover hjelper horisontal skanning — [Carbon Data table usage](https://carbondesignsystem.com/components/data-table/usage/)

### Inferences
- **Visuell retning for COSI ("rolig, nøytral, data først"):** nøytral gråskala-base, én aksentfarge for primærhandlinger, og semantiske farger (rød/oransje/grønn/blå) reservert for unntak og status — aldri som dekor. Tall høyrejustert med tabulære siffer (tabular-nums), lik desimalpresisjon. Dette realiserer motmålet om å ikke oversvømme tabellen.
- **Unntak i tabellen:** marker med liten, konsekvent indikator (ikon + tekst/aria-label, ikke bare farge – WCAG 1.4.1) i cellen eller en egen "Unntak"-kolonne, og la full forklaring ligge i inspektørpanelet (progressiv avsløring). Maks én fremhevingskanal per celle.
- **Lys modus som standard**; mørk modus kan utsettes til etter v1 (begrunnelse: NN/g + at Excel-eksport og utskrift er lys). Hvis implementert: bruk tokens slik at begge temaer får AA-kontrast.
- **Tetthetsbryter** (Standard/Kompakt) er billig å legge inn hvis man bruker tokens, og nyttig for 12 ukers kolonner på små laptopskjermer (1366 px) — men ikke nødvendig for v1.
- Trend-påstander om "calm UI", "bento grids" og AI-paneler i 2024–2026 er hovedsakelig bransjeblogger; behandle som stil, ikke evidens.

### Gaps
- Fant ingen fagfellevurdert studie om effekt av "calm"/minimalistisk enterprise-UI eller av tetthetsnivå på oppgaveytelse i datatabeller.
- Fikk ikke hentet NN/g-artikler om informasjonstetthet / "dense UI" fra 2023–2026.

---

## 4. Informasjonshierarki for "management by exception": hvordan strukturerer ledende planleggingsverktøy landingsvisningen etter en planleggingskjøring?

### Takeaway
Felles mønster: planleggeren lander på **varsler/unntak og handlingslister**, ikke på hele planen; derfra drilles det ned til en planleggingsvisning for den aktuelle varen. SAP IBP viser varsler på Fiori Launchpad og lenker hvert varsel til en lagret planleggingsvisning; MRPeasy har en egen "Critical on-hand"-liste; Odoo har en interaktiv "Replenishment"-rapport som samler hva som må etterfylles med info-ikon for detaljer. Dette støtter COSIs fastsatte rekkefølge (ordreforslag → kritiske deler → full tabell).

### Cited Findings
- **SAP IBP:** varsler vises på Fiori Launchpad-hjemmesiden og i Excel-ribbon (antall varsler med minst ett unntak); fra et varsel kan brukeren åpne en lenket favoritt-planleggingsvisning for å jobbe med unntaket. Brukere kan definere egne varsler med terskler (f.eks. minimumslager per lokasjon) — [SAP Learning: Setting up an Alert in a Favorite](https://learning.sap.com/courses/mastering-the-advanced-configuration-in-sap-ibp/setting-up-an-alert-in-a-favorite-1); [SAP Learning: Creating Custom Alerts](https://learning.sap.com/courses/mastering-the-main-features-and-function-in-sap-supply-chain-control-tower/creating-custom-alerts_be80457f-5560-408d-9379-cd1fb5caf5a4)
- SAP markedsfører en AI-basert "Exception Management Agent" som oppdager unntak og oppsummerer dem med anbefalinger — [SAP: Exception management agent](https://www.sap.com/products/scm/exception-management-agent.html) (markedsføring); og ML-baserte varsler i IBP — [SAP IBP machine learning alerts](https://www.sap.com/uk/products/scm/integrated-business-planning-machine-learning-alerts.html)
- **Kinaxis Maestro:** beskrives (av tredjepart) som å la brukere lage fleksible unntak og varsler, med tilpassbare dashboards, varsler og unntak — [SoftwareConnect: Kinaxis Maestro review](https://softwareconnect.com/reviews/kinaxis-maestro/) (tredjepart). Kinaxis' agent-lansering hevder en farmasikunde reduserte stegene for å identifisere lagerrisiko fra 40 klikk til 4 — [BusinessWire okt. 2025](https://www.businesswire.com/news/home/20251017746583/en/Kinaxis-Accelerates-Agentic-Era-for-Supply-Chain-Orchestration-with-the-Launch-of-Maestro-Agents) (leverandørpåstand)
- Logistics Viewpoints plasserer Kinaxis i et "Autonomous Exception Management" MarketMap (2026) — [Logistics Viewpoints, okt. 2026](https://logisticsviewpoints.com/2026/10/01/kinaxis-concurrent-planning-continuous-response/)
- **MRPeasy:** Stock → Critical on-hand lister alle varer (innkjøpte og produserte) der tilgjengelig mengde er under bestillingspunkt og som må bestilles på nytt; varen vises bare hvis bestillingspunkt er satt (også 0); lister kan sendes på e-post hver time — [MRPeasy manual: Critical On-hand](https://www.mrpeasy.com/resources/user-manual/stock/critical-on-hand/); [MRPeasy blog: inventory notifications](https://www.mrpeasy.com/blog/manufacturing-inventory-notifications)
- **Odoo 17:** Replenishment-rapporten (Inventory ‣ Operations ‣ Replenishment) er et interaktivt dashboard som kombinerer bestillingsregler, ledetider og kommende behov for å vise hvilke produkter som må etterfylles; hver linje har et info-ikon som åpner popup med ledetider og forventet dato — [Odoo 17 docs: Replenishment report](https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/report.html). Eldre (15.3) dok beskrev at rapporten lister produkter med negativ prognose og har "Automate Orders" — [Odoo 15.3 docs: strategies](https://www.odoo.com/documentation/saas-15.3/applications/inventory_and_mrp/inventory/management/products/strategies.html) **(eldre versjon)**
- Odoo MPS (Master Production Schedule) viser en tidsfaset tabell per produkt × periode — [Odoo 17 docs: MPS](https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/manufacturing/workflows/use_mps.html) (innhold ikke hentet i detalj)

### Inferences
- **Mønster å kopiere:** (1) handlingsliste først (ordreforslag = "hva skal jeg gjøre denne uka"), (2) unntaksoppsummering (kritiske deler, gruppert etter unntakstype med antall), (3) full tidsfaset tabell som oppslag, (4) drill-down til "hvorfor"-forklaring (IBP: varsel → planleggingsvisning; Odoo: info-ikon → popup; COSI: klikk → høyre panel). COSI sin rekkefølge samsvarer med dette.
- **Ordreforslag-lista** bør vise: del, antall, frigivelsesuke, behovsuke, årsak (kort), og være filtrerbar på uke (krav). Standardfilter "denne uka + forfalte/sene" gir management-by-exception-fokus.
- **Kritiske deler-oppsummering:** kort liste/tabell, maks ~5–10 synlige rader + "vis alle", med unntakstype i tekst; klikk hopper til raden i MRP-tabellen og åpner forklaringspanelet.
- **Sammenligning (før/etter):** vis endringer som egen visning med filter "Kun endrede", og diff-markering (pil/±tall) heller enn fargefylte celler — i tråd med motmålet.
- **Kapasitetspanel:** én rad per uke med "kan produsere X stk" og navngitt begrensende del (flaskehals) — tilsvarer "hva begrenser meg"-spørsmålet; kan lenke til delen i MRP-tabellen.
- Enterprise-verktøyene (IBP, Kinaxis, o9) bygger på konfigurerbare varsler og dashboards for erfarne planleggere; for COSIs nybegynnere er en **fast, kuratert** landingsrekkefølge bedre enn konfigurerbare dashboards.

### Gaps
- Fant ikke primærdokumentasjon/skjermbilder for landingsvisningen i Kinaxis Maestro (Knowledge Network krever innlogging), o9, Oracle Supply Chain Planning eller Katana — ingen sitater for disse.
- SAP IBP-detaljer kommer fra SAP Learning-kursbeskrivelser; selve Fiori-hjemmesiden for IBP ble ikke inspisert.
- Odoo 17: om "Automate Orders" og forslag-UI fortsatt finnes i 17 ble ikke bekreftet.
