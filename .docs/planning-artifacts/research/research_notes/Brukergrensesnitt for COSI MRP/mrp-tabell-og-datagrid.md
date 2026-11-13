# Designing the time-phased MRP table and data grid for COSI - MRP

Scope: how to design the part × week MRP record (6 rows per part, 8–12 weeks, up to about 1000 BOM rows, desktop only, Norwegian UI) so that planners with no MRP background can quickly find what needs action. The notes cover how existing tools do it, table best practices, alternative layouts, cell selection and an explanation panel, and grid libraries.
Research date: 2026-11-09. About 22 tool calls. Several vendor pages (Katana, Kinaxis, Epicor, MRPeasy screenshots, SAP Fiori design guidelines) could not be checked in the available budget. They are listed under Gaps.

---

## 1. How existing MRP/ERP/APS tools present the time-phased record and exceptions

### Takeaway
The textbook record (6 rows × weekly buckets) is the established layout. Commercial tools take it in two directions. Some keep a dense per-product block grid with coloured cells and action buttons (Odoo MPS). Others replace the grid with exception-first lists that use traffic lights and a drill-down into period cells (SAP MD06/MD07, SAP ERM, Fiori Material Coverage, Dynamics 365 action messages). Across tools, colour is tied to a small set of named states, and details are opened by clicking a period cell.

### Cited Findings
**Textbook MRP record (reference layout)**
- The standard record has six rows: Gross Requirements, Scheduled Receipts, Projected Available/On-hand Balance, Net Requirements, Planned Order Receipts and Planned Order Releases. There is one column per time bucket, and releases are offset by lead time. — [IEOR MRP notes](https://neoprimate.github.io/IEOR/supply-chain/planning/mrp/index.html); [Open Exam Prep CPIM MRP](https://open-exam-prep.com/study-guides/cpim/mrp-capacity/material-requirements-planning)
- Sources disagree on the net-requirements formula. Some write GR − POH − SR, which double-counts. The standard form subtracts the previous period's projected balance and the current scheduled receipts. If the explanation panel shows the formula, it should use one consistent convention. — [Open Exam Prep PE MRP](https://open-exam-prep.com/study-guides/pe-industrial/forecasting-production-planning-mrp/mrp-bom-capacity-planning); [IEOR MRP notes](https://neoprimate.github.io/IEOR/supply-chain/planning/mrp/index.html)
- A worked textbook example (lead time 2, on-hand 50, lot size 100) shows a projected on-hand row going negative (−50, 60, −160…) before planned receipts are added. Negative projected on-hand is the classic "need to act" signal in the record. — [Open Exam Prep / lecture material via search summary](https://open-exam-prep.com/study-guides/pe-industrial/forecasting-production-planning-mrp/mrp-bom-capacity-planning)

**Odoo Master Production Schedule (Odoo 18 docs)**
- Each product is its own block of rows, and BoM components appear as their own blocks. There is one column per period, and the period type (year, month, week or day) and number of periods are configurable. — [Odoo 18: Use the MPS](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/manufacturing/workflows/use_mps.html)
- Row labels carry arithmetic signs, which makes the calculation readable: "- Forecasted Demand", "- Indirect Demand Forecast" (components only), "+ Replenishment", "= Forecasted Stock". The product header row shows starting stock and links to the product's forecast report. — [Odoo 18: Use the MPS](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/manufacturing/workflows/use_mps.html)
- Only the Replenishment row is colour-coded, and each colour has a defined meaning. Green: "The quantity is ready to be replenished" (nothing ordered yet). Gray: ordered quantity equals the suggestion. Yellow: ordered quantity is below the suggestion. Red: ordered quantity is above the suggestion. A "(reset)" link appears next to manually changed cells. "Order" buttons exist globally, per product row, and as a bulk action through checkboxes. — [Odoo 18: Use the MPS](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/manufacturing/workflows/use_mps.html)
- The Odoo replenishment report is a separate list-style "interactive dashboard". It uses reordering rules, lead times and upcoming demand to show what needs restocking, which is an action list rather than a grid. — [Odoo 18: Replenishment report](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/report.html); [Odoo Forecasted report](https://odoo.com/documentation/latest/applications/inventory_and_mrp/inventory/warehouses_storage/reporting/forecast.html)

**SAP ECC/S/4 (MD04, MD06/MD07, ERM) and Fiori Material Coverage**
- MD04 is the single-material stock/requirements list and reflects current data. MD06/MD07 are collective lists across many materials. MD06 shows results as of the last MRP run. — [SAP Insider: Advanced MRP post-processing with new MD06 and MD04 (Part 1)](https://sapinsider.org/expert-insights/advanced-mrp-post-processing-with-new-md06-and-md04-part-1/) (members-only, SAP-employee author, probably 2023)
- SAP's traffic lights are based on days' supply (coverage) and exception groups. They are user-specific and set via "Define Traffic Light" in collective access. — [gotothings: MRP traffic lights](https://gotothings.com/pp/mrp-traffic-lights-sap.htm)
- A known inconsistency (2015 community thread): user-specific traffic-light settings showed up in MD06 but not in the MD04 collective list. — [SAP Community thread 3783907](https://archive.sap.com/discussions/thread/3783907)
- MD04 shows only exceptions from the net-requirements and lot-size calculations, so some messages visible in MD05 are missing from MD04 (older SAP Community answer). — [SAP Community: MRP exception message](https://answers.sap.com/questions/7625536/mrp-exception-message.html)
- SAP ERM (the "new MD06") groups critical orders into sales, production and procurement areas. Its traffic light compares coverage with replenishment lead time: red when coverage is below lead time, yellow when coverage is more than twice lead time (excess), green otherwise. It has period views where clicking a period cell shows the underlying elements in a lower pane for editing. The missing-parts list is sorted by shortage quantity by default, with multi-level pegging. — [SAP Insider ERM article](https://sapinsider.org/expert-insights/advanced-mrp-post-processing-with-new-md06-and-md04-part-1/)
- Fiori Monitor/Manage Material Coverage: one threshold type shows only green (no shortage) and red (shortage), with no yellow state. The shortage definition the user picks changes the chart colours. Users can view the stock/requirements situation as a table or a chart and preview proposed solutions. — [SAP Help, Fiori for SAP ERP (bs2013) Material Coverage pages](https://help.sap.com/fiori_bs2013/helpdata/en/5c/14a85296007b6ae10000000a423f68/content.htm) (2013-era release; which help page said what was not individually verified)
- Known Fiori issue: shortages can be missing from the app if the "shortage evaluation period" is too short, or for some planning strategies. The exception view is only as good as its horizon settings. — [SAP KBA 3536947](https://userapps.support.sap.com/sap/support/knowledge/en/3536947); [SAP KBA 3748453](https://userapps.support.sap.com/sap/support/knowledge/en/3748453)

**Microsoft Dynamics 365 Supply Chain Management**
- Action messages are system suggestions to change existing planned, approved or firmed orders. Types are Advance, Postpone, Decrease, Increase and Derived, where Derived propagates to components. Under Planning Optimization, messages for unapproved planned orders appear only inside the freeze time fence. — [Microsoft Learn: Action messages](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/action-messages)
- The Explosion page shows demand, coverage and pegging for a production or planned order. Under Planning Optimization it counts only demand generated in that run. — [Microsoft Learn: Production planning (Planning Optimization)](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/production-planning)
- Calculated delay messages are generated as a separate step after action messages, when the feature is enabled. — [Armanino: D365 master scheduling](https://www.armanino.com/articles/d365-fo-master-scheduling); [Microsoft Learn: delay value not updated](https://learn.microsoft.com/en-us/troubleshoot/dynamics-365/supply-chain/planning/delay-value-not-updated)

**MRPeasy**
- MRPeasy has a "Procurement Schedule (PS)" under Production planning → MPS, described as an overview of material demand as opposed to product demand. Its exact layout could not be verified. — [MRPeasy user manual: MPS](https://www.mrpeasy.com:443/resources/user-manual/settings/system/enterprise-functions/master-production-schedule-mps)
- MRPeasy automatically generates demand when parts are missing for a manufacturing order. — [MRPeasy Getting Started](https://www.mrpeasy.com/resources/user-manual/one/)

### Inferences
- Two design lineages exist: grid-first (textbook, Odoo MPS, SAP period-totals view) and exception-first (MD06/ERM, Fiori coverage, D365 action messages). COSI's requirements (critical-parts summary + order-suggestion list + full grid) already combine the two. That combination matches what mature tools do. The grid is for understanding and the lists are for action.
- Odoo's sign-prefixed row labels ("−", "+", "=") are a cheap, effective teaching device for novices. COSI could use row names such as "− Bruttobehov", "+ Planlagte mottak", "= Prosjektert beholdning", with a one-line explanation in the panel.
- Odoo colours only one row (Replenishment) with four named states. That supports COSI's counter-goal of not filling the table with colour: limit highlighting to 1–2 rows (for example, projected on-hand < 0 or < safety stock, and planned order release in a past or current week).
- SAP's user-configurable traffic lights and the inconsistencies between screens are a warning. Use one fixed, documented set of exception types that look the same in every view (summary, table and suggestions list). Novice planners should not configure thresholds.
- SAP's "click period cell → see underlying elements in a lower pane" is the closest commercial analogue to COSI's click-to-explain panel.

### Gaps
- No primary documentation or screenshots were retrieved for Katana, Kinaxis, Epicor or MRPeasy's grid layout. Published criticism of SAP MD04 usability (as opposed to configuration issues) was not found in this pass.
- The SAP Fiori Design Guidelines page for Manage Material Coverage (exact table and chart layout, columns) was not fetched. The Fiori help pages found are from the 2013-era release.
- No user studies were found that compare novice performance on textbook MRP grids with exception lists.

---

## 2. Data-table best practices (sticky columns, grouping, striping, density, alignment, zeros, highlighting, filtering)

### Takeaway
Freeze the header row and the identifying columns, right-align numbers in tabular figures, and keep styling minimal. Rely on alignment and light rules rather than zebra striping. Mark states with symbols as well as colour. Use filters that make their active state obvious. The evidence on zebra striping is mixed, and nothing authoritative was found on showing zero versus blank.

### Cited Findings
**Frozen headers and columns, orientation**
- "Freeze header rows and header columns (if the table is larger than the screen)." A subtle drop shadow on frozen elements reinforces spatial orientation. Make the first column a human-readable identifier. — [NN/g, Laubheimer, "Data Tables: Four Major User Tasks" (2022-04-03)](https://www.nngroup.com/articles/data-tables/)
- The four table tasks are: find records, compare data, view/edit/add a single row's data, and take action on records. Keep headers visible for comparison and bring related data close together. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)
- Roselli's recommended technique is CSS `position: sticky` on `th` elements. Column headers stick to the top with a higher z-index, and row headers (`th scope="row"`) stick to the left with a lower z-index. This is preferred over double-table or all-div hacks. Chrome 91 and Safari 14 support sticky on `thead` (2021 update). — [Adrian Roselli, "Fixed Table Headers" (2020, updated 2021)](https://adrianroselli.com/2020/01/fixed-table-headers.html)
- Wrap a scrollable table in a focusable, labelled region so keyboard users can scroll it. — [Roselli, "Talkin' Tables" slides (2025)](https://adrianroselli.com/wp-content/uploads/2025/10/Talkin-Tables_A11yTO.pdf); [Stanford UIT: Accessible table with sticky header](https://uit.stanford.edu/accessibility/concepts/tables/sticky-headers)
- Sticky columns cover the cells they overlap. They need an opaque background, and focus order must still make sense. — [modern-css: Two-axis sticky](https://modern-css.com/sticky-rows-and-columns-without-javascript/)

**Striping, rules, ink**
- NN/g recommends borders, zebra striping and hover row-highlighting to help users follow a record across wide rows. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)
- Contradicting view: Matt Ström says "zebra striping is bad" (while admitting the claim is "unsubstantiated"). He uses horizontal rules sparingly and lightly, keeps ink minimal, and reserves background colour for differences in data type (for example, sums versus single values). He marks highlights and changes with symbols such as ✻, † or ▵ rather than colour, and keeps tables largely monochrome because colour causes misinterpretation and accessibility problems. — [Matt Ström, "Design better data tables"](https://mattstromawn.com/writing/tables/) (undated, originally 2017 on Medium, so an older classic)

**Numbers**
- Right-align numeric data, left-align text, give headers the same alignment as their data, and avoid centring. Use the same number of decimals in a column. — [Matt Ström](https://mattstromawn.com/writing/tables/); [EU Data Visualisation Guide: table design scannability](https://data.europa.eu/apps/data-visualisation-guide/table-design-scannability); [Adobe Spectrum: Table](https://spectrum.adobe.com/page/table)
- Use tabular lining figures (`font-variant-numeric: tabular-nums` in CSS) so digits line up, with a monospace font as fallback. — [Matt Ström](https://mattstromawn.com/writing/tables/); [Uxcel: numbers alignment](https://app.uxcel.com/courses/ui-components-best-practices/tables-best-practices-356/numbers-alignment-1984)
- Don't repeat units on every row. Put the unit only in the header or on the first value. — [Matt Ström](https://mattstromawn.com/writing/tables/)

**Expandable rows vs side panel**
- Accordions (expandable rows) avoid covering the table, but "users don't tend to clean up after themselves". Leaving rows open clutters the view and makes it hard to compare non-adjacent records. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)
- A nonmodal side panel "allows for the full display (and editing) of a single record" while the table stays visible. Avoid modal pop-ups because they hide neighbouring records the user needs. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)

**Filtering**
- "Filters need to be discoverable, quick, and powerful." Show clearly when a filter is active. Sorting is related to filtering but is a separate tool. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)

### Inferences
These are suggestions for COSI, drawn from the findings above:
- **Frozen columns.** Freeze three left columns: part (number + description, possibly in one two-line cell), level/type, and row name. Freeze the week header row too. Use native `<table>` with `position: sticky` (Roselli), an opaque background and a thin shadow on the frozen edge (NN/g). With 8–12 weeks, horizontal scrolling may not even happen on a 1440 px or wider desktop. Design for it anyway.
- **Part blocks.** Separate parts with a heavier rule or a small gap (a "block separator"). Inside a block, use very light rules or nothing. Avoid zebra striping across the six rows: alternating stripes in 6-row blocks would visually split the block in a way that has no meaning. If you use a background at all, Ström's "background = data type" rule suggests giving the part header line, or the projected on-hand row as the key result row, a subtle tint instead.
- **Numbers.** Right-align all quantities and use tabular-nums. Use Norwegian number formatting (space as thousands separator, minus sign "−" U+2212 for negatives, or at least a hyphen-minus that is clearly visible).
- **Zero and blank.** Nothing authoritative was found (see Gaps). A reasoned option is to show blank for "no value in this bucket" in input rows (gross requirements, scheduled receipts, planned orders), because this cuts noise a lot. Projected on-hand should always show a number, including 0, because 0 is meaningful there. Explain the convention once in a legend or in the explanation panel.
- **Negative and below-safety-stock values.** Mark them with colour plus a symbol and text-equivalent, for example a red-tinted cell plus "▼" or "!" and an `aria-label`/visually hidden text "under sikkerhetslager" or "mangel". This satisfies WCAG 1.4.1. Use one or two exception types per cell at most, matching the counter-goal.
- **Critical-only filter.** A "Vis bare kritiske deler" (show only critical parts) toggle keeps BOM order among the matching parts and shows a clear active-filter chip with the count ("Viser 7 av 214 deler"). This is consistent with NN/g's "show when filters are active" and with the requirement to keep BOM order.
- **Collapsible parts.** If parts can collapse, keep a one-line summary visible when collapsed (part name + exception marker + maybe a mini indicator of the first shortage week). That way, collapsing never hides the reason the part needs attention. NN/g's warning that users leave things open argues for "Fold ut alle / Fold sammen alle" (expand all / collapse all) controls.

### Gaps
- No authoritative source was found on showing 0, blank or a dash in numeric tables. That needs either a source (for example Few, *Show Me the Numbers*, or Tufte, which are pre-2022 classics) or a small user test.
- No empirical study on zebra striping was retrieved. The NN/g recommendation and Ström's objection are both opinion-level in the sources found.
- No source was found that specifically recommends row density settings for planning grids.

---

## 3. Alternatives to one big grid (heatmap/sparkline, accordion, master-detail, tabs per level, tree table)

### Takeaway
Each alternative trades the ability to compare across parts against focus on one part. For about 1000 BOM rows with six rows each, the strongest options are the full grid with filtering and collapsible blocks plus a side panel, or master-detail (part list on the left, MRP record on the right). Tabs per BOM level break the BOM context, and a heatmap or sparkline summary works best as a supplement, not a replacement.

### Cited Findings
- Card or split layouts force users to "spatially reorient" each time they move between records, which makes comparison slow. Tables are better for comparison tasks. — [NN/g (2022) via secondary summary](https://www.nngroup.com/articles/data-tables/)
- A side panel keeps the table visible while one record is shown in full. Accordions tend to stay open and clutter the view. Modals hide context. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)
- Odoo MPS uses stacked product blocks with components as separate blocks, which is the full-grid approach. — [Odoo 18 MPS docs](https://www.odoo.com/documentation/18.0/applications/inventory_and_mrp/manufacturing/workflows/use_mps.html)
- SAP MD04 is single-material (one record at a time, like master-detail), while MD06/MD07 list many materials with traffic lights (like a master list). — [SAP Insider](https://sapinsider.org/expert-insights/advanced-mrp-post-processing-with-new-md06-and-md04-part-1/); [gotothings](https://gotothings.com/pp/mrp-traffic-lights-sap.htm)
- Fiori Material Coverage lets users switch between a table and a chart for the same stock/requirements situation. — [SAP Help Fiori bs2013](https://help.sap.com/fiori_bs2013/helpdata/en/5c/14a85296007b6ae10000000a423f68/content.htm)

### Inferences
Pros and cons for COSI:

| Alternative | Pros | Cons for COSI |
|---|---|---|
| **One grid, 6-row block per part (requirement baseline)** | Matches the textbook, so it is learnable and teachable. Lets users compare parent and child in BOM order. Fits "jump to part". | Very long page (about 1000 × 6 = 6000 rows). Needs virtualisation or pagination, collapse and a filter. Risk of visual monotony. |
| **One row per part (summary) + expand to 6 rows** | Compact overview. The summary row can carry the exception symbol and first-shortage week. | Users leave rows expanded (NN/g). Hides the record structure from novices until they expand. |
| **Master-detail (part list left, record right)** | Calm and focused. Good for novices. Small DOM. | Loses side-by-side parent/child comparison. Conflicts with "explanation panel beside the table" (three panes on one screen). Harder to see BOM propagation. |
| **Heatmap/sparkline per part (weeks × parts, colour = projected on-hand status)** | Fast "where is the problem" scan across hundreds of parts. | Colour-based by nature, so it needs symbols for WCAG 1.4.1. Adds a second encoding to learn. Risks the counter-goal ("not decorative"). Best used as an optional summary row or the critical-parts summary. |
| **Tabs per BOM level** | Short lists. | Breaks the parent→child chain that explains why a component has demand. Not recommended. |
| **Tree table (indent .1 / ..2 with expand/collapse per subassembly)** | Shows BOM structure explicitly. Combines with BOM order. | Adds a second collapse axis on top of the 6-row blocks. Keep it to indentation plus level text ("Nivå 1") rather than nested expanders. |

- Recommended direction: keep the full 6-row grid in BOM order with level indentation (".1", "..2" and/or an indent of about 16 px per level), as the requirements already fix. Add (a) the critical-parts summary above with jump-to-part, (b) a filter for critical parts and parts with exceptions, (c) optional collapse to a one-line summary per part, and (d) the side explanation panel. This combines the strengths of the grid-first and exception-first approaches identified in section 1.

### Gaps
- No usability study was found that compares master-detail with a single grid for MRP records specifically.
- No sources were retrieved on heatmap or sparkline summaries in commercial MRP tools (for example Kinaxis). Stephen Few's and Tufte's guidance on sparklines and tables was not retrieved in this pass.

---

## 4. Cell selection, keyboard navigation and the "click to explain" panel

### Takeaway
If cells are interactive (click to explain), the WAI-ARIA grid pattern gives a well-defined model. There is one tab stop, arrow keys move between cells, Home/End and Ctrl+Home/End jump, and Enter activates. A static table with a few buttons would instead use native table semantics. A nonmodal side panel is the evidence-backed way to show detail without hiding the table.

### Cited Findings
- Use the grid pattern for tabular content that is interactive. Only one element in the grid is in the tab sequence, and the author manages focus inside it. — [W3C WAI-ARIA APG: Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Data-grid keys: arrows move one cell and stop at the edges (no wrapping, which disorients assistive-technology users). Page Up/Down move an author-defined number of rows. Home/End go to the first or last cell in the row. Ctrl+Home/Ctrl+End go to the first or last cell of the grid. Enter or F2 switches into a cell's widget, and Escape returns. — [W3C APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Roles: `grid`, `row`, `columnheader`, `rowheader`, `gridcell`. Use `aria-rowcount`/`aria-rowindex` when not all rows are in the DOM (virtualisation). When built on an HTML `table`, use native `rowspan`/`colspan` rather than the ARIA span attributes. — [W3C APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Screen readers in application mode announce only focusable elements, so non-focusable cell content can be missed. In a data grid, every non-header cell should be focusable or contain a focusable element. — [W3C APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- A nonmodal side panel is recommended for viewing a single record while the table stays visible. — [NN/g (2022)](https://www.nngroup.com/articles/data-tables/)
- SAP ERM: clicking a period cell shows the underlying elements in a lower pane. — [SAP Insider](https://sapinsider.org/expert-insights/advanced-mrp-post-processing-with-new-md06-and-md04-part-1/)

### Inferences
- **Grid model.** Since every cell is clickable for explanation, COSI fits the APG data-grid model. Use a native `<table role="grid">` or plain table semantics with `th scope="row"` for row names and `th scope="col"` for weeks. Use roving tabindex (one cell with `tabindex=0`) and arrow-key navigation. Enter or Space opens the explanation panel for the focused cell.
- **Panel behaviour.** The panel opens on click or Enter, not on hover (a COSI requirement). It is a nonmodal `<aside>` or `role="complementary"` region with a heading such as "Forklaring: Del 1020 – Prosjektert beholdning, uke 46". Focus should stay in the grid when the panel updates, so the user can arrow to the next cell and see the panel follow. Announce changes with an `aria-live="polite"` region, or offer a keyboard shortcut and a "Gå til forklaring" link to move focus. Escape or a "Lukk" button closes it and returns focus to the originating cell.
- **Selected cell.** Highlight the selected cell with a thick outline (not only a background colour), and mirror it in the row and column headers (bold week header and row name) so the user sees the cell's coordinates. This fits the "not colour alone" rule.
- **Touch.** Tap equals click. Avoid a tap-and-hold-only interaction.
- **Explanation content.** For novices, the panel should show (1) what the row means in plain Norwegian, (2) the calculation with the actual numbers (for example "Prosjektert beholdning uke 46 = 40 (forrige uke) + 0 (planlagte mottak) − 60 (bruttobehov) = −20"), (3) why it is an exception and what to do ("Legg inn ordre uke 44 pga. ledetid 2 uker"), and (4) links to related cells (parent part's planned order release that created this gross requirement).

### Gaps
- No usability evidence was found specifically on "click to explain" in planning grids for novices.
- The APG page does not prescribe roving tabindex versus `aria-activedescendant`. Both are valid, and the choice is left to the implementer.

---

## 5. Grid libraries: pinned columns, grouping, virtualisation, accessibility, licensing, React

### Takeaway
For a free student project in React, the realistic choices are TanStack Table (headless, full control of semantic `<table>` markup, sticky pinning via your own CSS, virtualisation via TanStack Virtual) or AG Grid Community (MIT, built-in pinning, keyboard navigation and ARIA, with row grouping and master/detail in paid Enterprise). The MUI X features that matter here (column pinning, tree data, row grouping) are paid tiers. Glide Data Grid is canvas-based and its maintainers admit untested accessibility. With 6000 rows a plain HTML table may also be enough, especially with collapse and filtering.

### Cited Findings
**AG Grid**
- AG Grid Community is MIT-licensed. Enterprise requires a commercial licence; the vendor homepage lists $999 per developer. — [AG Grid GitHub](https://github.com/ag-grid/ag-grid); [AG Grid licensing (React)](https://www.ag-grid.com/react-grid/licensing/)
- Per the Community-vs-Enterprise page (v36.3.0), accessibility ("ARIA support and keyboard navigation") and row/column virtualisation are Community features. Row grouping, Master/Detail, Range Selection and Tool Panels/Sidebars are Enterprise. — [AG Grid: Community vs Enterprise](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise.md)
- Column pinning (with resize and reorder) is among the standard Community column interactions. — [AG Grid community README via jsDelivr](https://cdn.jsdelivr.net/npm/pms-ng-framework@1.0.3/projects/pms-framework/node_modules/ag-grid-community/README.md) (third-party mirror of the README; column pinning was not listed on the official comparison page, so treat it as likely but verify)
- Running Enterprise features without a licence shows a watermark and console warnings. — [AG Grid licensing (React)](https://www.ag-grid.com/react-grid/licensing/)

**TanStack Table**
- TanStack Table is a "headless UI" library: it provides state and logic, and you write the markup. TanStack Virtual can virtualise thousands of rows without changing table logic. — [TanStack Table docs](https://tanstack.com/table/latest/docs/guide/features)
- There is an official "Column Pinning – Sticky" example, but pinning provides state only. You apply `position: sticky` and backgrounds yourself. — [TanStack Table: column-pinning-sticky example (React)](https://tanstack.com/table/beta/docs/framework/react/examples/column-pinning-sticky); [DEV: Let's create data table – column pinning](https://dev.to/morewings/lets-create-data-table-part-4-column-pinning-5eb7)
- Licence: the sources retrieved did not state it explicitly. It is MIT according to general knowledge; check on GitHub or npm.

**MUI X Data Grid**
- Column pinning, tree data and row/column reordering are in the paid Pro plan. Row grouping, aggregation and Excel export are in Premium. — [MUI X Data Grid (v8 docs)](https://v8.mui.com/x/react-data-grid/); [MUI X Data Grid v6](https://v6.mui.com/x/react-data-grid/)
- Third-party pricing (may be outdated): Pro about $180 and Premium about $588 per developer per year. — [FitGap: MUI X Data Grid](https://us.fitgap.com/products/mui-x-data-grid)

**Glide Data Grid**
- The maintainers' FAQ: "None of the primary developers are accessibility users, so there are likely flaws in the implementation they aren't aware of." The grid renders to HTML canvas. — [Glide Data Grid FAQ](https://docs.grid.glideapps.com/faq)
- Canvas grids need a parallel DOM or fallback structure for screen readers. Another vendor's canvas renderer (Graphite Grid) is explicitly "not currently accessible". — [ITNext: I wrote an HTML canvas data grid](https://itnext.io/i-wrote-an-html-canvas-data-grid-so-you-dont-have-to-d945aa4780b4); [1771 Technologies: Graphite Grid accessibility](https://1771technologies.com/graphitegrid/documentation/accessibility)

### Inferences
| Library | Pinned columns | 6-row blocks per part | Virtualisation | Accessibility | Free for student project | Fit for COSI |
|---|---|---|---|---|---|---|
| **Plain HTML `<table>` + CSS sticky (+ own React code)** | Yes (`position: sticky`, Roselli) | Natural (`tbody` per part, `th scope="row"`, `rowspan` for the part cell) | Not needed if collapse and filter are used. 6000 rows × about 15 cells is about 90k cells, which is heavy but feasible. Add windowing if needed. | Best: native semantics, and you control the grid keyboard model | Yes | High. Simplest, and fully controllable for the exception markers and panel |
| **TanStack Table (+ TanStack Virtual)** | Yes (state + your sticky CSS) | Yes (your own markup. Grouping and expanding are built-in features) | Yes (TanStack Virtual) | As good as your markup | Yes (MIT, verify) | High. Gives the plain-table approach sorting, filter and expand state |
| **AG Grid Community** | Yes | Partly. Row grouping is Enterprise, so model each part's six rows as rows with a pinned "part" column, or use row spanning (Community status not verified) | Yes (default) | Good built-in ARIA and keyboard | Yes (MIT), but grouping and master/detail are paid | Medium. Strong engine, but the 6-row block look and custom exception cells fight its defaults |
| **MUI X Data Grid (free tier)** | No (Pro) | No (row grouping Premium) | Yes | Good | Free tier lacks the needed features | Low |
| **Handsontable** | (not verified) | (not verified) | Yes | (not verified) | Non-commercial licence exists by general knowledge; verify | Low–medium. Spreadsheet-editing focus is not needed |
| **Glide Data Grid** | Yes (by general knowledge) | Hard (canvas) | Excellent | Weak and untested by maintainers' own admission | MIT (by general knowledge; verify) | Low, given WCAG requirements |
| **Carbon DataTable** | (not verified) | Expandable rows (not verified) | (not verified) | Carbon emphasises accessibility (not verified) | Apache-2.0 (by general knowledge; verify) | Medium as a styling base, not verified |

- For COSI's scale (one product's BOM, up to about 1000 rows, 8–12 weeks), a semantic HTML table, optionally driven by TanStack Table, is probably the best fit. It meets the accessibility requirement, sticky columns are native CSS, and the 6-row block structure is natural (`<tbody>` per part). Full-featured grids mainly help when the main tasks are editing, range selection and spreadsheet-like work, which COSI does not need.

### Gaps
- The Handsontable licence for non-commercial or educational use, and the details of Carbon DataTable's sticky columns and expandable rows, were not verified in this pass.
- Whether AG Grid Community supports row spanning and column pinning in the current v36 was not confirmed on an official page (the official comparison page does not list pinning).
- No performance benchmark was retrieved for a non-virtualised HTML table with about 90k cells. A quick prototype measurement is advised.
