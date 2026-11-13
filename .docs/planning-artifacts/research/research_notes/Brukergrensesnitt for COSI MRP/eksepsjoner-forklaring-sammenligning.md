# Eksepsjoner, forklarbare beregninger, før/etter-sammenligning og kapasitet i COSI - MRP

Scope: UI patterns for (a) exception/alert presentation and prioritisation, (b) explaining calculations to novices, (c) diffs between two MRP runs, (d) capacity/bottleneck presentation, (e) onboarding novices, applied to COSI - MRP: a desktop-only, Norwegian-language student app for planners who have no MRP background. It has 5 exception types, a side panel that explains each number, a before/after comparison when a file is re-uploaded, and a production-capacity panel.

Research date: 2026-11-09. About 20 search/fetch calls. Source dates are noted where known. Anything older than 2020 is marked **[eldre klassiker]** (older classic).

---

## 1. Management-by-exception: alert fatigue, severity, grouping, action-oriented messages, worklists

### Takeaway
The evidence is consistent. When alerts are frequent and many of them don't matter, users override most of them, often 50–90 %+ in clinical decision support (CDS) research. Mature planning tools respond in three ways: they keep only actionable message types, they use tolerances and thresholds to suppress small deviations, and they attach a concrete proposed action to each message. COSI's counter-goal ("every exception must require action") matches this well. The best fit for COSI is a short worklist grouped by part, with the type of each exception shown as text and an imperative "what to do" line.

### Cited Findings
**Alert fatigue (research)**
- A systematic review of 23 articles on clinical decision support alerts found average override rates of 46.2 %–96.2 %, and concluded that override rates are high. — [Poly et al., JMIR Medical Informatics 2020](https://medinform.jmir.org/2020/7/e15653/)
- A 2025 meta-analysis of 44 studies on drug-drug interaction alerts reported a pooled override rate of 79.8 % (95 % CI 73.0–86.7 %), and noted that there are no consistent measures of alert fatigue. *Preprint, not peer-reviewed.* — [O'Sullivan et al., JMIR Preprints 2025](https://preprints.jmir.org/preprint/88578)
- A 2026 review of reviews found that methods for measuring alert fatigue are "not clearly or consistently defined" in the existing systematic reviews. — [Ray, Wilson et al. 2026 (PDF)](https://www.metrohealth.org/globalassets/metrohealth-documents/population-health-research-institute/ray-wilson-et-al-2026-alert-fatigue-systematic-review.pdf)
- A review of interaction design for medication alerts found that role tailoring was the most successful way to reduce alert fatigue. Role tailoring means giving different alerts to different roles (prescriber vs. pharmacist). **[eldre klassiker, 2019]** — [Hussain et al., JAMIA 2019, via AHRQ PSNet](https://psnet.ahrq.gov/issue/medication-safety-alert-fatigue-may-be-reduced-interaction-design-and-clinical-role-tailoring)
- Secondary claim: a 2024 meta-analysis (Felisberto et al.) reportedly found an average override rate of about 90 %. I could only find this through a blog, so it is unverified. — [Mindbowser blog](https://www.mindbowser.com/alert-fatigue-healthcare/)

**Planning tools: types, tolerances, proposed action**
- In Dynamics 365 SCM, action messages are "a system-generated suggestion to change an existing planned, approved, or firmed order", and "You decide whether to make the suggested changes." The types are Advance, Postpone, Decrease, Increase and Derived actions. Advance and Postpone each have a *margin* (number of days) below which no message is created. This is a built-in tolerance against noise. The page was updated 2026. — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)
- Dynamics only creates action messages for unapproved planned orders inside the freeze time fence. Outside the fence, only approved and firmed orders get them. This is another way of limiting volume. — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)
- Dynamics documents an order dependency between messages: actions on BOM components must be applied before actions on their parent items, and then master planning must be run again. Messages on different BOM levels are therefore not independent. — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)
- Dynamics also has "delay messages", which are created after coverage. Some of them disappear when the user acts on related action messages. — [Armanino blog](https://www.armanino.com/articles/d365-fo-master-scheduling)
- In SAP, exception messages belong to an individual MRP element. When several messages apply to one element, the most important ones are stored. This is a form of prioritisation within an element. **[eldre klassiker, SAP 4.6C-dok.]** — [SAP Help: Creation of Exception Messages](https://help.sap.com/saphelp_46c/helpdata/en/f4/7d2c8a44af11d182b40000e829fbfe/content.htm)
- A practitioner article (SAPinsider) recommends grouping SAP exception messages into focus areas (plan, schedule, inventory) and setting tolerances so that the messages stay actionable. — [SAPinsider: Manage MRP Exception Messages](https://sapinsider.org/manage-material-requirements-planning-exception-messages-in-sap)
- According to SAP PRESS, the most common exception messages are rescheduling messages (reschedule in/out). — [SAP PRESS blog](https://blog.sap-press.com/how-to-evaluate-mrp-results-with-sap-s4hana)
- An SAP blog states that Situation Handling for MRP exceptions should *not* replace exception handling in Monitor/Manage Material Coverage or the Stock/Requirements List. Push notifications supplement the worklist and do not replace it. — [SAP blog 2021](https://blogs.sap.com/2021/06/29/use-case-for-situation-handling-mrp-material-exceptions/)
- SAP Fiori Situation Handling guidance (search-result excerpt; the page itself returned 403): situations should "describe the situation to the users in a way that supports them in understanding and resolving the issue". The guidance also recommends limiting "the number of situations per user so that users can focus on their daily business". The notification text is a short summary, a click opens a details page, and the user can navigate from there to the source of the problem. — [SAP Fiori Design: Situation Handling Guideline Overview v1.139](https://www.sap.com/design-system/fiori-design-web/v1-139/discover/sap-products/sap-s4hana-only/situation-handling-guidelines)
- The Fiori Situation Handling blog describes the concept as notifying the user proactively and "providing suggestions and recommendations on how to deal with it". — [SAP blog 2021: Fiori 3 intelligence](https://blogs.sap.com/2021/03/25/sap-fiori-3-how-to-put-intelligence-into-your-user-experience/)
- Kinaxis (now "Maestro", formerly RapidResponse) is described by third parties as exception-based alerting with drill-down for root cause and a proposed fix per alert. I found no official product documentation, so this rests on marketing and aggregator sources. — [Simplilearn](https://www.simplilearn.com/what-is-kinaxis-rapidresponse-article); [Kinaxis UX page](https://www.kinaxis.com/ja/user-experience)

**Message phrasing and severity (general UX)**
- NN/g: "Merely stating the problem is also not enough; offer some potential remedies." Messages should be placed near their source ("Display the error message close to the error's source"), should "indicate the problem's severity", and should "never use exclusively color or animation to indicate errors". Modal dialogs should be reserved for severe errors. Published May 2023. — [NN/g: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- The NN/g rubric: a message should "describe a solution that is sufficient for the user to fix the problem" with low interaction cost. — [NN/g: Error messages scoring rubric](https://www.nngroup.com/articles/error-messages-scoring-rubric/)
- Carbon Design System groups status indicators into severity levels (high, medium and low attention). These are suggestions for defining your own levels, not fixed names. An indicator consists of a text label and an icon (shape, colour, symbol). The v10 version said that at least three elements must be present for WCAG compliance. I could not confirm that on the current page. — [Carbon: Status indicator pattern](https://www.carbondesignsystem.com/patterns/status-indicator-pattern); [Carbon v10](https://v10.carbondesignsystem.com/patterns/status-indicator-pattern/)
- PatternFly: status and severity are communicated best by combining text, colour and icon. — [PatternFly: Status and severity](https://patternfly.org/patterns/status-and-severity)

### Inferences
- **Severity levels in COSI:** With 5 types, all of them actionable, there is little reason for 3–4 severity levels. Two levels (critical vs. other) or just a fixed type order should be enough. Using fewer levels also fits the counter-goal of avoiding colour decoration. A natural order by urgency: "Bestilling forsinket" (order is already too late) > "Mottak forsinket" (expedite) > "Bruk av sikkerhetslager" > "Kanseller mottak" > "Ledetid overskrider horisont" (part-level, data/setup issue). This order is my own suggestion and should be tested.
- **Grouping:** Planners solve problems one part at a time, and Dynamics' BOM rule shows that the level matters. COSI should therefore group by **part** (primary), show the exception type as a text label on each row, and offer filtering by type. Grouping by week makes sense as a secondary sort within a part. In the summary of critical parts, show "Part X — 2 eksepsjoner: Bestilling forsinket (uke 12), Bruk av sikkerhetslager (uke 14)".
- **BOM level:** Consider sorting critical parts by low-level code (components first), or at least informing the user that fixing a component can change the parent's exceptions on the next run. This is Dynamics' lesson.
- **Message template (Norwegian):** Use the structure *what* + *where/when* + *what to do* + (link to explanation), with an imperative verb first in the action. Examples:
  - "Bestilling forsinket: 40 stk skulle vært bestilt i uke 10 (ledetid 3 uker). Bestill nå og avtal raskere levering, eller flytt behovet." ("Order late: 40 pcs should have been ordered in week 10 (lead time 3 weeks). Order now and agree faster delivery, or move the demand.")
  - "Kanseller mottak: Mottaket på 100 stk i uke 15 trengs ikke. Kanseller eller utsett mottaket." ("Cancel receipt: The receipt of 100 pcs in week 15 is not needed. Cancel or postpone the receipt.")
- **Tolerances/noise filter:** To keep every exception actionable, consider simple thresholds, for example no "Bruk av sikkerhetslager" if the dip is less than X % of the safety stock or lasts only one week. Alternatively, document why no threshold is used. The precedent is Dynamics' advance/postpone margin.
- **Worklist instead of notifications:** COSI runs as a batch per upload. A static worklist (the summary of critical parts) is therefore the right pattern. Push notifications or toasts are not, consistent with SAP's statement that Situation Handling does not replace the worklist.
- **Not colour alone:** Each exception should have a text label, and optionally an icon. In the part × week table, a small text marker or an icon with an accessible name is enough. Avoid colouring whole cells (counter-goal).

### Gaps
- I could not reach the official Fiori "Manage Material Coverage" app documentation or the UI text guidelines for Situation Handling (403). Concrete wording examples from SAP are therefore missing.
- I found no official Kinaxis/Maestro documentation on alert workflow, only marketing and third-party sources.
- I found no MRP-specific research (outside healthcare) that quantifies alert fatigue among planners. The transfer from clinical research to planning is an inference.
- I did not verify the Felisberto et al. 2024 figure (~90 %).
- I did not cover Oracle, Atlassian or Fluent notification guidelines.

---

## 2. Explaining calculations to novices ("show your work", provenance, progressive disclosure)

### Takeaway
The research supports *progressive disclosure*, which means a short, simple answer first and details on request. Users look up explanations most while they are building their understanding of the system. The spreadsheet pattern (trace precedents plus step-by-step evaluation) is a proven model for a "calculation trace". COSI's explanation panel, opened on click, should therefore show (1) the result in one plain-language sentence, (2) the formula with the actual numbers filled in, and (3) clickable inputs that lead to their own explanations.

### Cited Findings
- Springer & Whittaker (ACM TiiS 10(4), 2020, DOI 10.1145/3374218) ran four studies of transparency in an algorithmic system. Transparency helps users build a mental model, but it can undermine perceived accuracy when it reveals errors. Users consulted transparency information most while they were forming a model of how the system works. The authors recommend progressive disclosure, with the user deciding when and how explanations are shown. — [arXiv preprint](https://arxiv.org/pdf/1811.02164); [dblp](https://dblp.org/rec/journals/tiis/SpringerW20.html)
- The same authors' 2019 IUI paper found that transparency could be distracting and undermine the simple heuristics users form. **[eldre, 2019]** — [arXiv 1811.02164](https://arxiv.org/abs/1811.02164v1)
- A survey of empirical XAI studies cites: progressive disclosure, with simple feedback first, helps users build heuristics. Nourani et al. suggest that a higher-level explanation can help users build more accurate mental models before detailed instance-level explanations. Interactive interfaces increased understanding compared with static ones. — [Towards Human-centered Design of XAI: A Survey of Empirical Studies (arXiv 2410.21183)](https://arxiv.org/pdf/2410.21183)
- CHI EA 2023 (Tandon & Wang, Microsoft) studied enterprise users with different levels of tech proficiency. It defines progressive disclosure as advanced information provided "on an as needed basis, only when the user requests it", and argues that it helps calibrate trust. This is an extended abstract, not a full paper. — [Microsoft Research PDF](https://microsoft.com/en-us/research/uploads/prod/2024/01/CHI-2023-Surfacing-AI-Explainability-Tech-Proficiency-Tandon-Wang.pdf)
- Excel's formula auditing works as a pattern model. *Trace Precedents* draws arrows to the cells that feed a formula. *Trace Dependents* shows where a value is used. *Evaluate Formula* walks through the calculation one step at a time, underlining the term that will be evaluated next, and lets the user "step into" it. — [GoSkills: Formula auditing tools](https://www.goskills.com/Excel/Resources/Formula-auditing-tools-Excel); [Macabacus: Precedents & Dependents](https://help.macabacus.com/article/842-precedents-dependents)
- Bret Victor, "Explorable Explanations" (2011): reactive documents where the reader can change assumptions and see the consequences. What sets them apart from isolated widgets is that they deliberately guide attention towards particular phenomena. **[eldre klassiker, 2011]** — [worrydream.com](https://worrydream.com/ExplorableExplanations/)
- NN/g: briefly explaining how the system works is useful when it helps the user resolve a problem. Help should be *pull* (shown when the user signals a need), short and progressively disclosed. — [NN/g: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/); [NN/g: Help and documentation](https://www.nngroup.com/articles/help-and-documentation/)
- Dynamics documents its order-quantity rules with plain worked examples: "If there's demand for a quantity of 60 ... master planning creates a planned purchase order for a quantity of 60. If you increase the demand by 30, master planning suggests an increase of 40, because it respects the multiple of 20". This is a model for how each rule can be explained with real numbers. — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)

### Inferences
- **Layers in the explanation panel (progressive disclosure):**
  1. *Answer sentence* in plain Norwegian: "Bestill 60 stk i uke 8 fordi det mangler 52 stk i uke 11, og ledetiden er 3 uker." ("Order 60 pcs in week 8 because 52 pcs are missing in week 11 and the lead time is 3 weeks.")
  2. *Calculation with numbers filled in* (Evaluate Formula style): "Netto behov uke 11 = bruttobehov 120 − lager 50 − planlagt mottak 18 + sikkerhetslager 0 = 52" ("Net requirement week 11 = gross requirement 120 − stock 50 − scheduled receipt 18 + safety stock 0 = 52"), then "Avrundet opp til partistørrelse 20 → 60" ("Rounded up to lot size 20 → 60"), then "Frigivelse = uke 11 − ledetid 3 = uke 8" ("Release = week 11 − lead time 3 = week 8").
  3. *Inputs as links* (Trace Precedents style): each input (gross requirement, stock, lead time, lot size) is a link or button that opens its own explanation, or highlights the source cell in the part × week table. Gross requirement links on to the parent product and its quantity per unit.
  4. *The rule in one sentence* plus a glossary link: "Regel: lot-for-lot med minste partistørrelse" ("Rule: lot-for-lot with minimum lot size").
- **Click and keyboard, never hover:** This matches NN/g's pull help and the user-driven disclosure in Springer & Whittaker. The panel should be non-modal, so that the table stays visible next to the explanation and the user can step through several cells.
- **Explanations for exceptions too:** "Bestilling forsinket" should show the calculation that makes the release week fall before the current week, which is the same trace.
- **Avoid jargon in layer 1.** Show technical terms (bruttobehov/gross requirement, netto behov/net requirement, ledetid/lead time) in layer 2 with a glossary link. They are needed because testers have to be able to "explain" the number, but they should not be the first thing the user sees.
- **What-if ("explorable") is out of scope for v1,** but a later version could let the user change the lead time in the panel and see the effect. That is Victor's idea, but it is costly.

### Gaps
- I found no primary source on TurboTax's "why this number" / "explain" feature. I don't make claims about it.
- I found no peer-reviewed study that compares an inline explanation with a side panel for numeric calculations specifically. The recommendation of a side panel rests on the progressive-disclosure literature and the user's existing decision.
- I found no studies of explanation UIs in MRP/ERP software for novices.

---

## 3. Diff/compare UI between two runs

### Takeaway
Established diff tools mark added/removed/changed with colour **plus** symbols or text (+/−, "Ny", "Fjernet"), offer a "differences only" filter, and let the user step from change to change. Red/green is a known accessibility problem: GitHub has had to offer special colour-blind themes, and these are still criticised. For COSI, the best fit is a change list grouped by category (order suggestions / exceptions / parts) with text labels and old → new values, not a side-by-side table.

### Cited Findings
- GitHub released Protanopia & Deuteranopia themes (beta, April 2022) that swap red/green for orange/blue in diffs and elsewhere. They split the earlier colour-blind theme into two. **[2022]** — [GitHub changelog](https://github.blog/changelog/2022-04-19-protanopia-deuteranopia-colorblind-themes-beta/)
- User feedback says the themes are still imperfect. One user reports that the dark protanopia theme is worse for protanopia than the standard setting, and there is a separate thread saying the Tritanopia theme is inaccessible for people with tritanopia. — [GitHub Community #44944](https://github.com/community/community/discussions/44944); [#6385](https://github.com/community/community/discussions/6385)
- The WordPress Polyglots team evaluated diff colours with colour-blindness simulation. They rated GitHub's Light Protanopia & Deuteranopia theme as the best option, but it still had problems with achromatopsia. — [make.wordpress.org 2022](https://make.wordpress.org/polyglots/2022/12/07/color-blindness-in-the-diffs-from-the-translation-memory/)
- The Emacs Modus themes offer a deuteranopia variant that replaces green in diffs with blue. **[2021]** — [Protesilaos: Modus themes diffs deuteranopia](https://protesilaos.com/codelog/2021-02-25-modus-themes-diffs-deuteranopia/)
- IBM Decision Optimization's compare table for comparing scenarios (model runs) has a toggle to show only the differences, plus arrows for stepping through each difference. — [IBM Decision Optimization: compare tables](https://jp-tok.dataplatform.cloud.ibm.com/docs/content/DO/do_expts/comparetable.html?context=wx)
- Neptune (ML experiment tracking) has a "Rows with diff only" option that hides attributes that are the same across runs. — [Neptune docs: side-by-side](https://docs.neptune.ai/side-by-side)
- NN/g on comparison tables: static tables work best for few items (under 5), and dynamic ones for more. The article does not specifically cover diff highlighting. — [NN/g: Comparison tables](https://nngroup.com/articles/comparison-tables/)
- Carbon: "Don't rely on color alone to convey meaning", which also covers "distinguishing one visual element from another". — [Carbon: Color accessibility](https://carbondesignsystem.com/guidelines/accessibility/color)
- Dynamics' action messages are in practice a "diff" between the existing plan and the new calculation, expressed as verbs (Advance/Postpone/Increase/Decrease). — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)

### Inferences
- **Change list instead of side-by-side:** COSI has already chosen to hide changes that don't affect suggestions or exceptions, which is the same principle as "differences only". A list grouped into three sections (Bestillingsforslag / Eksepsjoner / Deler) with a count in each heading ("Bestillingsforslag: 3 nye, 2 endret, 1 fjernet") lets the user see the scope at once.
- **Notation without colour dependence:** Each row should start with a text label: "Ny", "Endret", "Fjernet" for suggestions, "Ny"/"Borte" (gone) for exceptions, and "Lagt til"/"Fjernet" for parts. Changed quantities should be shown as "40 → 60 (+20)", with the arrow and sign as redundant coding. If colour is used at all, use blue/orange rather than red/green (GitHub precedent), and only as a supplement. Strikethrough for removed rows works without colour.
- **Changed week vs. quantity:** COSI's scope lists "changed quantity". A suggestion that moves from week 8 to week 9 would come out as "removed + new". Consider showing it as "Flyttet uke 8 → 9" ("Moved week 8 → 9"), like Dynamics' Advance/Postpone, because that is more understandable for novices. Whether this belongs in v1 is a scope decision.
- **"Ingen endringer" (no changes) state:** Show an explicit empty state, for example "Ingen endringer i bestillingsforslag eller eksepsjoner sammenlignet med forrige opplasting (fil X, lastet opp dato)" ("No changes in order suggestions or exceptions compared with the previous upload (file X, uploaded date)"). Also give a short note that other changes may be hidden. This guards against the user thinking the comparison failed.
- **Identify both versions:** The heading should name the before and after versions (filename + timestamp) so the user knows what is being compared.
- **Navigation:** Each row in the change list should link to the part / explanation panel, like IBM's "arrows to go through each value".

### Gaps
- I found no HCI study (CHI/ACM) that compares inline vs. side-by-side vs. change list empirically for non-technical users.
- I found no documentation of plan-version comparison in SAP/Kinaxis/Dynamics UIs (for example "compare scenarios" in Kinaxis).
- I found no primary source on the design of a "no changes" state specifically for diffs. The recommendation above is an inference.
- GitLab/Atlassian design-system docs on diffs were not covered.

---

## 4. Capacity/bottleneck presentation

### Takeaway
I found little UX-specific literature on how ATP/CTP or "limiting component" should be visualised. Vendor documentation (SAP) shows that the core concept is a *missing parts list* where one limiting component caps the quantity for all of them. That supports COSI's design: a number per week plus a named limiting part and cause. The main risk is that the user confuses "possible to complete" with "planned production". This must be addressed in labels and explanation text.

### Cited Findings
- In SAP PP, the availability check for a production order lists missing components in a *missing parts list / overview*. The system sets the status "material shortage" when components are not available on the requirement date. — [SAP Help: Missing Parts List](https://help.sap.com/saphelp_46c/helpdata/en/41/191ff545fd11d188ff0000e8322f96/content.htm); [SAP Help: Missing Parts Overview](https://help.sap.com/saphelp_46c/helpdata/en/41/19200245fd11d188ff0000e8322f96/content.htm) **[eldre klassiker, 4.6C]**
- A practitioner example: RM002 and RM003 had 8 available, but the system committed only 4 of each because RM001 had only 2 available, so all components were displayed as missing. In other words, one limiting component determines the quantity, but the UI flags everything as missing, which hides which part is actually the bottleneck. — [SAPinsider: Streamline production with ATP in SAP PP](https://sapinsider.org/streamline-your-companys-production-rates-with-atp-using-sap-pp/)
- SAP's "missing parts overview" keeps the result of the last check, and the user has to re-run the check after changes. This underlines the need to show which data the capacity is calculated from. — [SAP Help: Missing Parts Overview](https://help.sap.com/saphelp_46c/helpdata/en/41/19200245fd11d188ff0000e8322f96/content.htm)
- ATP is defined as answering how much can be delivered when, based on available resources. Gross vs. net ATP is a distinction, but Wikipedia's passage on it is marked "citation needed". — [Wikipedia: Available-to-promise](https://en.wikipedia.org/wiki/Available-to-promise)
- In Dynamics, safety stock is treated as a hard limit: action messages never suggest reducing below the safety stock requirement, and never suggest postponing orders that supply safety stock. This matters if COSI's capacity calculation should or should not count safety stock as available. — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)

### Inferences
- **Name the limiting part explicitly.** The SAP example shows that "everything is missing" is unhelpful. COSI's choice to show *one* (or a few) limiting parts per week with a cause ("lager" = stock, or "ledetid" = lead time) is better than a missing parts list. Text example: "Uke 12: 35 ferdigvarer mulig. Begrenset av Del 1040 (lager: 70 stk, 2 per enhet)." ("Week 12: 35 finished products possible. Limited by Part 1040 (stock: 70 pcs, 2 per unit).")
- **Avoid confusion with planned production:** Use a heading and row labels that say "kan fullføres" (can be completed), not "produksjon" (production). For example, the heading "Hvor mange ferdigvarer kan lages fra lager?" ("How many finished products can be made from stock?") and rows "Fra lager i dag" ("From stock today") and "Med planlagte mottak" ("With scheduled receipts"). Add a one-line explanation directly under the heading: "Viser hva som er mulig med deler du har eller har bestilt, ikke hva som er planlagt produsert." ("Shows what is possible with parts you have or have ordered, not what is planned to be produced.")
- **Same explanation mechanism:** Each capacity number should open the explanation panel with the calculation "min over komponenter av (tilgjengelig ÷ antall per enhet)" ("minimum over components of (available ÷ quantity per unit)"), with the limiting part highlighted as the line that gives the minimum. This reuses pattern 2 and needs no new visual element.
- **Visualisation:** A table with two rows and weeks as columns, consistent with the part × week table, is probably clearer than a chart for novices and avoids colour decoration. A step chart could be an optional supplement, but I found no evidence that it improves understanding. Mark it as an assumption.
- **Safety stock:** Decide, and state in the explanation, whether safety stock counts as available in the capacity calculation. Dynamics treats it as reserved.

### Gaps
- I found no UX/HCI literature or vendor UI documentation on visualisation of ATP/CTP or limiting component (step charts, constraint charts). This is a clear gap. The recommendations rest on SAP's functional docs plus inference.
- I did not find current S/4HANA Fiori documentation (for example "Check Material Coverage" / "Monitor Material Coverage") with screenshots of the limiting-component display.

---

## 5. Onboarding for novices in a domain tool

### Takeaway
NN/g's research shows that "deck-of-cards" onboarding tutorials give no better task success, and make the app seem harder. Contextual, user-initiated help works better. For COSI, this points to a short intro (or none), a downloadable sample file as a worked example, and in-place explanations via the explanation panel and glossary, rather than a carousel/walkthrough.

### Cited Findings
- NN/g's mobile tutorial study (70 users, 4 apps): those who skipped the tutorial had slightly higher task success (94 % vs. 91 %, p = 0.047), and those who read it rated the app as harder (4.92 vs. 5.49 on a 1–7 scale). NN/g concludes that tutorials can make an app seem more complicated. Mobile context, a single study. — [NN/g: Mobile tutorials](https://www.nngroup.com/articles/mobile-tutorials/)
- NN/g: walkthroughs can be useful for genuinely new interaction paradigms (for example AR), but are overused and often skipped. — [NN/g: Onboarding tutorials](https://www.nngroup.com/articles/onboarding-tutorials/)
- NN/g: help should be a pull pattern, shown when the user signals a need, short and progressively disclosed. — [NN/g: Help and documentation](https://www.nngroup.com/articles/help-and-documentation/)
- Springer & Whittaker 2020: explanations are consulted most while users are building their mental model of the system. This suggests early use, and the user test, is when the explanation panel is used most. — [arXiv 1811.02164](https://arxiv.org/pdf/1811.02164)

### Inferences
- **The success goal ("find and explain a critical part ... after a short intro") is best served by:** (1) an empty state on the first screen with "Last opp fil" ("Upload file") plus "Prøv med eksempelfil" ("Try with sample file"), where loading the sample directly in the app is better than just downloading it, (2) a 3–4 line text on the results page saying where to start ("Start med kritiske deler →", "Start with critical parts →"), and (3) the explanation panel as the main learning tool.
- **Glossary:** Domain terms (ledetid, sikkerhetslager, planlagt mottak, frigivelsesuke = lead time, safety stock, scheduled receipt, release week) should be clickable to definitions. Following COSI's principle, that means click, not hover tooltips. They can open in the same side panel.
- **The sample file should be designed** so that it triggers all 5 exception types and at least one capacity limit, so that the intro and the user test cover everything. When the same file is uploaded with an edited variant, it can also show the before/after comparison. Consider offering two sample files (v1 and v2).
- The NN/g study is mobile and consumer-oriented. The transfer to a desktop domain tool is an inference.

### Gaps
- I found no research specific to onboarding in ERP/MRP tools for novices.
- Empty-state guidelines from the Carbon/Atlassian/Fluent design systems were not fetched.

---

### Cross-cutting summary of recommendations for COSI (based on findings in sections 1–5)

| Area | Recommendation | Basis |
|---|---|---|
| Exceptions | Worklist grouped by part, exception type as a text label, filter by type; fixed type order instead of many severity levels | Dynamics/SAP types + tolerances; NN/g severity; Carbon/PatternFly text + icon |
| Exceptions | Message = what + when + imperative action; the explanation is one click away | NN/g "offer remedies"; Fiori Situation Handling |
| Exceptions | Simple thresholds, or a documented choice, to avoid noise | Dynamics advance/postpone margin; alert fatigue research |
| Explanation | 3 layers: answer sentence → calculation with numbers → clickable inputs | Springer & Whittaker; Excel Evaluate/Trace; XAI survey |
| Diff | Change list in 3 sections with counts, text labels, "gammel → ny (±Δ)", explicit "no changes" state, identify both versions | IBM/Neptune diff-only; GitHub colour-blind problems; Carbon |
| Capacity | Name the limiting part + cause per week; labels "kan fullføres" ≠ planned production; reuse the explanation panel | SAP missing parts example; inference |
| Onboarding | Sample file loaded in the app, short text, contextual help/glossary on click; avoid carousels | NN/g tutorial study; NN/g help |
