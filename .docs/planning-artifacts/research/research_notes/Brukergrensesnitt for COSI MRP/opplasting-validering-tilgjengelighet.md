# Opplasting, importvalidering, startside og tilgjengelighet i COSI - MRP (UI-mønstre og krav)

Scope: UI patterns for file upload (one .xlsx), import-validation errors (all errors at once, nothing computed), start page / onboarding, notification messages, and Norwegian accessibility and legal requirements. Applies to COSI - MRP: desktop-only, Norwegian UI, localStorage only, users with mixed Excel skills. Research date: 2026-11-09.

## 1. File upload UX (drag-and-drop vs button, type hints, processing/success state, re-upload, privacy notice)

### Takeaway
The current mainstream pattern (GOV.UK since 2025, Aksel, Carbon) is a visible drop zone that also has a normal "choose file" button. Constraints (file type, one file) go in plain hint text above or inside the zone. Errors for the specific file are shown on the file itself, and a single-file uploader is replaced by the chosen file with a remove/replace action. None of the sources covers a "data stays in your browser" privacy notice, so that wording has to be designed by the team.

### Cited Findings
- **GOV.UK improved file upload (opt-in since Frontend 5.9.0, March 2025):** the drop zone is "bigger, always visible, and more responsive to interaction". The "Choose file" button now matches the secondary Button. The button and "No file chosen" texts can be translated but should be kept short. The improved version is to become the default at the next major release. — [GOV.UK Design System: File upload](https://design-system.service.gov.uk/components/file-upload/)
- **GOV.UK brand refresh (Feb 2026, v6.0.0):** updated interaction states and colours make it "easier to see when a file has been added". — [GOV.UK: File upload](https://design-system.service.gov.uk/components/file-upload/)
- **GOV.UK accessibility research:**
  - Dragon (speech recognition) users could not activate native file inputs by voice. The improved component fixes this, although browser security may still block it on first use.
  - Screen readers do not announce `required` in the improved version, and GOV.UK recommends not using it.
  - Long button text makes the component hard for screen reader users.
  - The old version had no visual drop target.
  — [GOV.UK: File upload](https://design-system.service.gov.uk/components/file-upload/)
- **GOV.UK file-specific error wordings (good templates to translate):**
  - "The selected file must be a CSV or ODS"
  - "The selected file is empty"
  - "The selected file is password protected"
  - "The selected file could not be uploaded – try again"
  - **"The selected file must use the template"**, which is directly relevant to COSI's sheet and column checks
  - "Select a [whatever they need to select]" when no file is chosen
  - Use a specific message for each error state.
  — [GOV.UK: File upload](https://design-system.service.gov.uk/components/file-upload/)
- **Aksel (NAV) FileUpload** has three parts:
  - Dropzone: drag and drop, or click to browse
  - Trigger: a button only
  - Item: a selected or uploaded file, with delete, retry or a custom action
  — [Aksel: FileUpload](https://aksel.nav.no/komponenter/core/fileupload)
- **Aksel Norwegian microcopy rules:**
  - Start the label with "Last opp" (e.g. "Last opp dokumentasjon").
  - Describe each restriction in its own sentence, using positive wording, e.g. "Du kan laste opp dokumenter i PDF- eller Word-format." / "Filer kan være opptil 10 MB."
  — [Aksel: FileUpload](https://aksel.nav.no/komponenter/core/fileupload)
- **Aksel on errors, file types and screen readers:**
  - Restricting file types limits the file browser, but users can still drag and drop other types, so the type must be validated anyway.
  - Errors about a missing file go on the Dropzone. Errors about a specific file (wrong format, too large) go on the Item.
  - The texts "dragAndDrop" and "or" are `aria-hidden`, so essential instructions must not depend on them.
  - Avoid the `disabled` prop.
  — [Aksel: FileUpload](https://aksel.nav.no/komponenter/core/fileupload)
- **Aksel upload status:** the Item has `idle` / `uploading` / `downloading` states, and the last two show a loading indicator. `fileLimit` disables the Dropzone when the maximum number of files is reached. — [Aksel: FileUpload](https://aksel.nav.no/komponenter/core/fileupload)
- **Carbon (IBM) file uploader:**
  - Two variants: a button variant (the file list appears below) and a drag-and-drop variant, where a text link in the zone opens the dialog.
  - States: loading, success, uploaded (with an "x" delete icon) and error/invalid.
  - If the error applies to the whole uploader, use an inline error notification instead of a per-file error.
  - Description text should state format and size limits.
  - For a single file, "the drop zone is removed after a successful upload". The user clicks the close icon to remove the file and upload a different one.
  - Keyboard: Space/Enter activates the zone, and focus returns to the trigger after the file dialog closes.
  — [Carbon: File uploader usage](https://carbondesignsystem.com/components/file-uploader/usage/)

### Inferences
- **Recommendation for COSI: drop zone plus button in one component.** Build it in the GOV.UK/Aksel style: a large, always-visible zone containing a secondary button, "Velg fil". Drag and drop alone is not enough for keyboard and Dragon users, and planners who mostly work through Excel's "Lagre som" may not think to drag a file. A button alone is less efficient for users who keep Explorer open. The combined zone covers both.
- **Suggested Norwegian microcopy (in the Aksel style):**
  - Label: "Last opp utfylt mal"
  - Hint: "Du kan laste opp én Excel-fil (.xlsx). Filen må bruke COSI-malen med arkene Stykkliste, MPS og Planlagte mottak."
- **Use `accept`, but validate anyway.** Set `accept=".xlsx"` on the input. Drag and drop bypasses it, and a renamed file can still be wrong, so COSI must validate both the file extension and that the file can actually be read as Excel.
- **COSI has no network progress to show, only parsing and validation.** Show a short processing state ("Leser filen …") in a live region, then switch either to a success state (the filename, "Endre fil"/"Last opp ny fil", and the run choices) or to the error summary.
- **Re-upload must keep working.** After an error, keep the uploader active and clear the input value, so selecting the same filename again fires `change` (a common browser quirk; not sourced here). This is what lets the user re-upload without reloading.
- **Translated GOV.UK templates for file-level errors:**
  - "Den valgte filen er tom."
  - "Den valgte filen må være en Excel-fil (.xlsx)."
  - "Den valgte filen er passordbeskyttet."
  - "Den valgte filen kunne ikke leses. Den kan være skadet. Prøv å lagre den på nytt i Excel og last den opp igjen."
  - "Den valgte filen må bruke COSI-malen."
- **Privacy notice.** Put a short, persistent sentence in the hint or under the zone, e.g. "Filen blir ikke sendt noe sted. Den leses bare i nettleseren din." The upload metaphor ("Last opp") can make users believe the data leaves the machine, so the notice matters. It is a design choice, not something a cited source prescribes.

### Gaps
- Microsoft Fluent 2 and Atlassian Design System file-upload guidance was not fetched. No claims are made about them.
- The Designsystemet (Digdir) file upload component was not verified. It is unknown whether Designsystemet has a file-upload component as of Nov 2026.
- No source covered privacy wording for client-side-only processing ("data stays in browser"). The wording above is a suggestion.
- No quantitative evidence was found on drag-and-drop vs button usage rates.

## 2. Import-validation error presentation (error summary, grouping by sheet, sorting, linking, import tools, writing errors, how many to show)

### Takeaway
The government design systems give a solid baseline:
- Always show an error summary, even for one error.
- Move focus to it when it appears.
- Word each item the same way as the detailed message.
- List all errors.
- Write specific, plain messages that repeat the field name early and say how to fix the problem.

Import tools (OneSchema, Dromo, HubSpot) add row and cell context and error-file downloads. Since COSI has no in-app editing and errors point into an Excel file, not into on-page fields, the summary should be grouped by sheet and sorted by row, with stable references (sheet / row / column), not page anchors.

### Cited Findings
- **GOV.UK error summary: when, where and focus.**
  - Always show it when there is a validation error, "even if there's only one".
  - Place it at the top of `main`, above the `<h1>`, with the heading "There is a problem".
  - Move keyboard focus to it.
  - Add "Error:" to the start of the page `<title>`.
  - Summary wording must match the inline error message wording.
  - `role="alert"` sits on a nested element; this fixed JAWS not reading the whole summary.
  — [GOV.UK: Error summary](https://design-system.service.gov.uk/components/error-summary/)
- **GOV.UK gives no ordering rule** for summary items. — [GOV.UK: Error summary](https://design-system.service.gov.uk/components/error-summary/)
- **Designsystemet (Digdir) ErrorSummary:**
  - Use it to show which errors must be fixed before the user can proceed, especially on forms with many fields.
  - Recommended heading: "For å gå videre må du rette opp følgende feil".
  - It receives focus automatically when it appears and when its content changes.
  - Each error links to its field, or to the first field if several are involved.
  - Use the same wording as the field-level message.
  - Do not use it for system messages; use Alert for those.
  — [Designsystemet: ErrorSummary](https://designsystemet.no/no/components/docs/error-summary/overview)
- **Designsystemet error pattern: placement.** Place the summary near Next/Submit in most cases. Place it at the top "when the page reloads on Next, when users return to a form they've left, or when the flow doesn't block progress". The summary must list all errors for the page or step. — [Designsystemet: Feilmeldinger (pattern)](https://designsystemet.no/no/patterns/errors)
- **Designsystemet error pattern: Norwegian writing rules.**
  - Be friendly, clear and short, and be specific. "Feltet er ikke fylt ut korrekt" is the bad example.
  - Repeat keywords from the label early.
  - Use indefinite form when the field name is inserted as a variable ("Postnummer må ha 4 siffer"), otherwise definite form.
  - Don't disable the submit button.
  - For combined (cross-field) errors, say clearly that the error comes from the combination and how to fix it.
  — [Designsystemet: Feilmeldinger](https://designsystemet.no/no/patterns/errors)
- **Skatteetaten's ErrorSummary** is meant for two or more errors and is "not suited to showing long technical error codes". On appearance, focus moves to its top so screen readers read the whole summary. — [Skatteetaten designsystem: ErrorSummary](https://www.skatteetaten.no/stilogtone/designsystemet/komponenter/errorsummary/)
- **Skatteetaten (Norwegian klarspråk practice):**
  - Avoid vague messages such as «Ikke gyldig verdi» or «Feltet må fylles ut», and refer to the label instead.
  - A good error message says what is wrong, explains what the user can do to move on, and is short.
  - Use an active "du" form for longer explanatory messages.
  — [Skatteetaten: Feilmeldinger](https://www.skatteetaten.no/nn/eksempler/skattekartet-beta/innhold/skjemadesign/interaksjon/feilmeldinger-og-varsler/feilmeldinger/)
- **KS (klart språk i digitale selvbetjeningsløsninger):**
  - Place the error message near the error.
  - Avoid jokey messages, because humour wears thin when users see the message repeatedly.
  — [KS: Feilmeldinger](https://www.ks.no/fagomrader/digitalisering/digital-kompetanse/klart-sprak-i-digitale-selvbetjeningslosninger/interaksjonselementer/feilmeldinger/)
- **Klarspråk definition:** the state's working definition is "korrekt, klart og brukertilpasset språk i tekster fra det offentlige". The handbook *Klar, men aldri ferdig* is from Difi/Språkrådet, 2011, which is older material. — [Språkrådet: Klar, men aldri ferdig (PDF)](https://sprakradet.no/wp-content/uploads/Klar-men-aldri-ferdig-2.-opplag.pdf)
- **NN/g Error-Message Guidelines** (Neusesser & Sunwall, 14 May 2023):
  - Visibility:
    - Show the error close to its source.
    - Use redundant, accessible indicators, never colour alone.
    - Match prominence to impact.
    - Don't show errors prematurely.
  - Communication:
    - Use human-readable language; show error codes only for diagnostics.
    - Describe the issue concisely and precisely.
    - Offer constructive advice.
    - Use a positive tone and don't blame the user.
  - Efficiency:
    - Preserve the user's input.
    - Reduce correction effort.
    - "Concisely educate on how the system works".
  — [NN/g: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- **OneSchema (vendor):**
  - Its guidance favours clear errors, filtered row-level views, in-line correction, and deleting rows with errors.
  - Warnings are counted as errors.
  — [OneSchema: Advanced CSV import features](https://www.oneschema.co/blog/advanced-csv-import-features); [OneSchema docs: Importing warnings](https://docs.oneschema.co/docs/importing-warnings)
- **Dromo (vendor):** catch errors at upload, before an import attempt, with cell-level messages naming the row and the problem. — [Dromo: 5 best practices to streamline your CSV import process](https://dromo.io/blog/5-best-practices-to-streamline-your-csv-import-process)
- **Flatfile's own blog** lists vague errors and unclear guidance among common import pain points. Its current validation UX docs were not found. — [Flatfile blog](https://flatfile.com/blog/optimizing-csv-import-experiences-flatfile-portal/)
- **HubSpot import:**
  - Errors are downloadable as a file: "Download rows with errors as file" gives a CSV with Error code, Object type, Reason and the row's values.
  - It distinguishes "row not imported" from "value not imported".
  - Values can be corrected in the import tool, but only values visible in the first 1,000 rows can be selected.
  - The page was last updated 6 Aug 2026.
  — [HubSpot KB: Troubleshoot import errors](https://knowledge.hubspot.com/import-and-export/troubleshoot-import-errors)
- **CSVBox (vendor)** describes layered validation (cell → row → table) and an error export containing only failed rows. Treat it as a vendor viewpoint. — [CSVBox blog: CSV error reports](https://blog.csvbox.io/csv-error-reports/)
- **Shopify and Salesforce** import error presentation was not researched (see Gaps).

### Inferences
- **Recommended structure for COSI's error view** (the government summary pattern combined with import-tool row context):
  1. Put the error summary at the top of the page, with focus moved to it. COSI's flow is "upload → result", which is effectively a reload/new state, which is Designsystemet's top-placement case. Set `<title>` to "Feil: …".
  2. Heading in COSI's own voice, e.g. "Filen har 12 feil. Ingenting er beregnet." Follow it with one sentence on what to do: "Rett feilene i Excel, lagre filen og last den opp på nytt."
  3. Start with structure errors, in their own group, because they often cause many value errors (a missing sheet or a misnamed column). Consider stopping value validation for a sheet whose structure is broken, to avoid hundreds of follow-on errors. The requirement is still to show all errors that are meaningful.
  4. Group the value errors by sheet, in template order: Stykkliste → MPS → Planlagte mottak. Within each sheet sort by row, then by column. Use `<h3>` per sheet with a count ("Planlagte mottak (4 feil)") and a `<ul>` or a simple table (Rad | Kolonne/felt | Feil).
  5. The format "Planlagte mottak, rad 4, Uke: uke 0 er før horisonten." matches the advice to name the location and field first. Add a fix hint where it is not obvious, e.g. "… Første uke i horisonten er uke 1." (NN/g "constructive advice"; Skatteetaten "hva brukeren kan gjøre").
  6. Optionally give the cell address too ("rad 4 (celle B4)"), because users navigate Excel by cell reference. Use the Excel row number, not a data-row index, so "rad 4" matches what Excel shows.
- **Linking errors to their location.** The summary items cannot link to fields as GOV.UK/Designsystemet require, because the fields are in Excel. Since the list is the content, the in-page jump links are only needed if the list is long. A useful substitute is "Kopier feilliste" or "Last ned feilliste (.xlsx/.csv)", following the HubSpot error-file pattern. A stronger, more costly v2 option is an annotated copy of the user's file with error cells highlighted and commented.
- **How many errors to show.** Show all, as COSI's requirement says, and as Designsystemet says ("list all errors"). With large counts (>~20), keep it readable:
  - Collapse each sheet group with an expander showing the count.
  - Detect systemic errors and roll them up, e.g. "Kolonnen «Uke» mangler i arket Planlagte mottak" instead of 50 row errors.
  - Avoid a single unstructured wall of text.
  No source gave an evidence-based numeric threshold.
- **Writing style for the ~N rules.** Make a message catalogue with one template per rule, so wording is consistent (Designsystemet's rule that summary and detail wording must match). Rules for the catalogue:
  - Positive, impersonal or "du" form.
  - No blame words ("ugyldig", "feil input"); NN/g says not to blame the user.
  - No error codes in the main text.
  - Field names exactly as the template's column headers.
  - No humour (KS).
- **Bad vs. good message, using Designsystemet's guidance:**
  - Bad: "Ugyldig verdi i Antall."
  - Good: "Stykkliste, rad 7, Antall: antallet må være et tall større enn 0. Nå står det «to»."
- **Severity: blocking errors vs warnings.** COSI's "computes nothing if any error" is a blocking-errors model. If warnings (non-blocking) are ever added, follow Designsystemet: don't put them in the error summary; use an info Alert.

### Gaps
- No independent (non-vendor) user research was found on the optimal number of errors to display or on grouping vs flat lists for import errors.
- Shopify, Salesforce and Flatfile current documentation on row-level error display was not fetched. Only HubSpot was verified.
- No Smashing Magazine article (2023–2026) on bulk import UX was verified. One 2020 article on data onboarding exists ([Smashing, 2020](https://shop.smashingmagazine.com/2020/10/overcome-data-onboarding-challenges-software-products/)); it was not read and is older material.
- No dedicated Språkrådet page on error messages was found. Klarspråk guidance for error messages comes from Skatteetaten, KS and Designsystemet, which apply klarspråk principles.

## 3. Start page / onboarding (short guide, step indicators, sample data, empty states, choosing the calculation mode)

### Takeaway
There is little hard evidence here. The relevant principle from the sources is "prevent errors first": give users the information they need before they start, keep hints visible, and avoid disabled buttons. Applied to COSI, that means a short numbered three-step guide, template and sample-file downloads placed next to the step where they are needed, a "try with example" path, and a native radio group for the run mode.

### Cited Findings
- **Designsystemet "prevent errors first":**
  - Give users the necessary information before they start, in clear language.
  - Keep hints visible rather than hidden behind a question-mark icon.
  - Let users change answers, go back, pause or quit.
  - Order options so that a common choice does not lead to mistakes.
  — [Designsystemet: Feilmeldinger](https://designsystemet.no/no/patterns/errors)
- **Don't disable the submit button.** Disabled buttons confuse users and can be hard for low-vision users to find. Let users press the button and show a summary error. — [Designsystemet: Feilmeldinger](https://designsystemet.no/no/patterns/errors)
- **GOV.UK lists "The selected file must use the template" as a standard error**, which shows that template-based uploads are an established pattern. — [GOV.UK: File upload](https://design-system.service.gov.uk/components/file-upload/)
- **NN/g:** "Concisely educate on how the system works": briefly explain the rule or process and link to more only when needed. — [NN/g: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- **GOV.UK error summary:** for radios and checkboxes, the summary links to the first option. This applies if no run mode is chosen. — [GOV.UK: Error summary](https://design-system.service.gov.uk/components/error-summary/)

### Inferences
- **Start page structure.** Use an `<h1>` and one sentence of purpose, then an ordered list `<ol>` with three steps. Each step should hold its own action:
  1. "Fyll ut malen": a "Last ned tom mal (.xlsx)" link and "Last ned eksempelfil".
  2. "Last opp filen": the drop zone.
  3. "Velg hva som skal beregnes og les resultatet".

  A static numbered list is more robust and accessible than an interactive stepper or wizard for a single-page flow. Desktop-only does not change that.
- **Sample data.** Offer "Prøv med eksempelfil" as a one-click path that runs the example without download and upload. For users with no MRP background, this shows what a correct file and a correct result look like before they invest time. Also make the sample file downloadable, so they can see it in Excel. Label the result clearly as example data.
- **Calculation mode.** Use a native radio group (`<fieldset>`/`<legend>` "Hva vil du beregne?") with three options:
  - "Bestillingsplan"
  - "Produksjonskapasitet"
  - "Begge"

  Preselect "Begge", or the most common choice, so the default does not lead to error. Each option gets a one-line hint describing the output.
  - Radios beat checkboxes here: with checkboxes, "none" is a possible invalid state.
  - Radios beat a segmented control: segmented controls are usually for switching views, not for setting a parameter before a run, and need custom ARIA work.
  - Native radios get arrow-key behaviour and grouping for free.

  These are inferences; no source compared radios with segmented controls directly.
- **Empty states and the last run.** If localStorage has a previous run for the product, show it on the start page as a "Siste kjøring" card with a timestamp. Otherwise show nothing beyond the guide, and avoid an empty "Ingen kjøringer" box that adds noise.

### Gaps
- No authoritative 2023–2026 source was fetched on onboarding guides, step indicators (Aksel FormProgress / GOV.UK step-by-step), sample-data effectiveness, or empty states. NN/g has articles on empty states and onboarding, but they were not verified in this session.
- No sourced comparison of radio buttons vs segmented controls vs checkboxes for mode selection was found.

## 4. Accessibility and legal requirements in Norway (forskrift, WCAG 2.1/2.2, WAD/EAA, relevant criteria, wide tables, applicability to a student project)

### Takeaway
Who the rules cover:
- **Private organisations:** the Norwegian forskrift requires WCAG 2.0 A/AA minus 1.2.3–1.2.5.
- **Public bodies:** must meet EN 301 549 V3.2.1 (the WAD implementation, from 1 Feb 2023).
- **WCAG 2.2:** not part of Norwegian regulation, and Uutilsynet says this "endrer seg ikke på kort sikt".
- **EAA:** in force in the EU from 28 June 2025, but its implementation in Norway/EEA is delayed.

A student project is almost certainly not legally covered. It is not an organisation's "hovedløsning" aimed at the public, and the scope excludes personal matters and work tools. It should still target WCAG 2.1 AA (ideally 2.2 AA) as good practice and as preparation for real-world use by firms.

### Cited Findings
- **Who and what is covered (Uutilsynet).** "Ikt-løsninger i Norge skal være universelt utformet" covers websites, apps and automats. "Både private og offentlige virksomheter, lag og organisasjoner må følge regelverket." — [Uutilsynet: Regelverk og krav](https://www.uutilsynet.no/regelverk/regelverk-og-krav/746)
- **Forskrift om universell utforming av IKT-løsninger (FOR-2013-06-21-732): scope (§ 2).**
  - It covers ICT solutions that are "hovedløsninger rettet mot eller stilt til rådighet for brukere".
  - It applies across society except family life and personal matters.
  - It excludes ICT in workplaces used for work, unless otherwise stated.
  - § 3 defines hovedløsning as an "integrert del av den måten virksomheten informerer og tilbyr sine tjenester til allmennheten på".
  — [Lovdata: FOR-2013-06-21-732](https://lovdata.no/dokument/SF/forskrift/2013-06-21-732)
- **Forskrift: standards and dates.**
  - Private sector (§ 4): WCAG 2.0 (NS/ISO/IEC 40500:2012) levels A and AA, except 1.2.3, 1.2.4 and 1.2.5.
  - Public sector (§ 4b): conformance with EN 301 549 V3.2.1 (2021-03) satisfies the duty.
  - The latest substantive amendment is FOR-2023-01-17-87, in force 1 Feb 2023.
  — [Lovdata: FOR-2013-06-21-732](https://lovdata.no/dokument/SF/forskrift/2013-06-21-732)
- **Education sector.** The preparatory works say ICT in the education sector "i opplæringsøyemed" is not covered by the duty in § 11 (2). This is from a Regjeringen document via search snippet, not verified in full, and the current forskrift has a § 3 g on education "hovedløsning". So it is contested/unclear (see Gaps). — [Regjeringen (search result)](https://regjeringen.no/link/da2352e815ab42c7958084226cff3658.aspx?id=2327097); compare [Lovdata](https://lovdata.no/dokument/SF/forskrift/2013-06-21-732)
- **WCAG 2.2 status in Norway.**
  - WCAG 2.2 was finalised on 5 Oct 2023.
  - It is not part of Norwegian regulation, and this "endrer seg ikke på kort sikt".
  - Adoption depends on the EU revising EN 301 549, plus a national process that "tar gjerne et par år".
  - Uutilsynet still expects 4.1.1 Parsing to be met (it is removed in 2.2).
  - The page was last modified 8 Nov 2023, so it may be outdated as of Nov 2026.
  — [Uutilsynet: Status for nyere versjoner av WCAG](https://www.uutilsynet.no/fremtidig-regelverk/status-nyere-versjoner-av-wcag/1868)
- **EAA (tilgjengelighetsdirektivet).** "Regelverket trådte i kraft i EU 28. juni 2025." "I EØS-landene Norge, Island og Liechtenstein er gjennomføringen forsinket." No Norwegian date is given. — [Uutilsynet: Fremtidige regelverk og krav](https://www.uutilsynet.no/regelverk/fremtidige-regelverk-og-krav/747)
- **WCAG 1.4.10 Reflow** has an exception for "parts of the content which require two-dimensional layout", including data tables (not individual cells).
  - A table may scroll in its own container while the surrounding content reflows.
  - Headings, search fields and pagination near a table are not excepted.
  - 320 CSS px equals a 1280 px viewport at 400 % zoom.
  — [W3C: Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- **Designsystemet: criteria and ARIA for errors.**
  - Relevant criteria: 3.3.1, 3.3.3, 1.4.3 and 1.4.11.
  - Contrast: 3:1 for the field border against its background, 4.5:1 for red error text.
  - Combine colour with icon and text.
  - Use `aria-invalid="true"` and `aria-describedby`; avoid `aria-errormessage` (weak AT support).
  - Use `aria-live="polite"` for dynamically inserted errors.
  — [Designsystemet: Feilmeldinger](https://designsystemet.no/no/patterns/errors)
- **NN/g:** never rely on colour or animation alone for errors. — [NN/g: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- **Carbon:** the upload trigger must be operable with Space/Enter, and focus returns to the trigger after the file dialog closes. — [Carbon: File uploader](https://carbondesignsystem.com/components/file-uploader/usage/)
- **GOV.UK:** speech-recognition (Dragon) users had problems with native file inputs. — [GOV.UK: File upload](https://design-system.service.gov.uk/components/file-upload/)

### Inferences
- **Legal applicability.** COSI v1 is a student project. It is not operated by a "virksomhet" as a "hovedløsning" offered to the public, so the forskrift most likely does not apply legally. If a firm adopts COSI internally for planners, the work-tool exclusion in § 2 likely applies too. If it is ever published to the public by an organisation (e.g. HiMolde, a public body, or a company), it would be covered:
  - EN 301 549 / WCAG 2.1 for public bodies
  - WCAG 2.0 for private bodies
  - possibly the EAA later

  Recommend stating in the project documentation: "Målet er WCAG 2.1 AA (og WCAG 2.2 AA der det er enkelt), som god praksis; løsningen er ikke juridisk omfattet av forskriften." Note that EN 301 549 V3.2.1 incorporates WCAG 2.1 A/AA; that comes from background knowledge, not verified in this session.
- **Criteria most relevant to COSI and how to meet them:**
  - **1.4.1 Use of colour.** Errors, and any shortages or capacity overloads in result tables, must have text or icons, not only red cells.
  - **1.4.3 / 1.4.11 Contrast.** Text 4.5:1. The drop-zone border, focus ring and error borders 3:1.
  - **2.1.1 Keyboard.** The drop zone needs a real `<button>`/`<input type=file>`, radios native, error links focusable, no keyboard traps in expanders.
  - **2.4.7 Focus Visible and 2.4.11 Focus Not Obscured (2.2).** Use a visible focus ring. Sticky table headers or banners must not hide the focused cell or link.
  - **3.3.1 / 3.3.3.** Every error is identified in text, with a suggested fix where known. This is the error catalogue.
  - **4.1.3 Status messages.** "Leser filen …", "Beregning ferdig", "Kjøringen er ikke lagret" are announced via `role="status"` without moving focus. When the error summary appears, move focus to it, following GOV.UK/Designsystemet.
  - **1.4.10 Reflow.** Desktop-only does not exempt from 400 % zoom. Make the wide MRP tables (weeks as columns) scroll in their own `tabindex="0"` region with an accessible name, while headings, buttons and text reflow.
- **Screen readers and big tables.**
  - Use real `<table>` with `<caption>`, `<th scope="col">` for weeks and `<th scope="row">` for items/rows.
  - Avoid nested tables, or divs styled as grids.
  - Give a text summary above the table (e.g. "3 varer har behov for bestilling i uke 5–8").
  - Avoid ARIA `grid` unless cells are interactive. v1 tables are read-only, so a native table is enough. This rests on background knowledge of the ARIA APG and was not fetched in this session.

### Gaps
- Uutilsynet's exact numbers of required criteria (e.g. "35 for private / 47–49 for public") were not verified. 35 is inferred from WCAG 2.0 A+AA (38 criteria) minus 3 exemptions.
- Whether Norway adopted a new forskrift for the EAA, or a WCAG 2.2-based EN 301 549 (V4.x), between 2024 and Nov 2026 was not confirmed. The Uutilsynet WCAG-status page is dated 2023, and the EAA page only says implementation is delayed.
- Whether HiMolde (a public institution) hosting a student project would make it a covered "hovedløsning", and the current interpretation of the education-sector exception, remained unclear. Contact Uutilsynet if it matters.
- The WAI-ARIA APG table/grid guidance was not fetched in this session.

## 5. Status and notification messages ("run not saved", "no changes", processing errors): banners vs toasts vs inline alerts

### Takeaway
Avoid auto-dismissing toasts for anything that matters. GitHub Primer does not recommend toasts at all, citing WCAG 2.2.1, 1.3.2, 2.1.1 and 4.1.3. Use persistent inline alerts or banners in the page flow, exposed through a pre-existing live region. Use the error summary, not an Alert, for validation errors, and an Alert for system-level problems such as "storage blocked" or "file could not be read".

### Cited Findings
- **GitHub Primer's position on toasts:** "Toasts pose significant accessibility concerns and are not recommended for use". — [Primer: Accessible notifications and messages](https://primer.style/accessibility/toasts/)
  - Usability problems: toasts sit outside the field of view on large or magnified screens, auto-dismiss before they are read, cover content, appear far from the trigger, and suffer from banner blindness.
  - Primary WCAG criteria involved: 2.2.1 Timing Adjustable, 1.3.2 Meaningful Sequence, 2.1.1 Keyboard, 4.1.3 Status Messages.
  - Secondary WCAG criteria involved: 1.4.4, 1.4.10, 2.4.3, 3.2.4.
  - Recommended alternatives: persistent banners for unsuccessful actions and long-running results; dialogs only for interrupting errors; inline validation for forms; no extra message for simple, self-evident successes.
- **Whether auto-dismissing toasts fail 2.2.1 is contested** among practitioners on the W3C WAI-IG list (2025). The safe practical fix is to keep messages until the user dismisses them. — [W3C WAI-IG archive, 2025](https://lists.w3.org/Archives/Public/w3c-wai-ig/2025AprJun/0085.html); [W3C WAI-IG archive, 2025](https://lists.w3.org/Archives/Public/w3c-wai-ig/2025AprJun/0088.html)
- **Live region pattern:**
  - Use `role="status"` (polite) for non-critical messages.
  - The live-region container must exist in the DOM before the message is injected, or it may not be announced.
  - Red Hat's toast exposes `role="status"`/`aria-live="polite"`, not `role="alert"`.
  — [Red Hat UX: Alert accessibility](https://ux.redhat.com/patterns/alert/accessibility/); [Freelock: Making status updates accessible (2025)](https://www.freelock.com/advent/2025/6-did-you-get-message-making-status-updates-accessible)
- **Skatteetaten Alert:** a short, timely status message about an important event or the result of an action. It suits system and loading errors. Keep it short and precise, with text contrast ≥ 4.5:1. — [Skatteetaten: Alert](https://www.skatteetaten.no/stilogtone/designsystemet/komponenter/alert/)
- **Designsystemet:** ErrorSummary is not for system messages; use Alert for those. — [Designsystemet: ErrorSummary](https://designsystemet.no/no/components/docs/error-summary/overview)
- **Aksel GlobalAlert** lists Toast as unsuitable for that component. Only the search snippet was seen, not the full page. — [Aksel: GlobalAlert](https://aksel.nav.no/komponenter/core/globalalert)
- **NN/g:** design errors based on their impact. Use subtle notices for minor issues and reserve modal dialogs for serious errors. — [NN/g: Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)

### Inferences
- **Mapping for COSI:**
  - **"Kjøringen er ikke lagret"** (localStorage blocked or full): a persistent warning Alert near the results heading, with `role="status"`. Not a toast; the user must see it while reading results. Wording: "Kjøringen er ikke lagret. Nettleseren tillater ikke lagring (for eksempel i et privat vindu). Resultatet forsvinner når du lukker siden." Optionally offer an export action if the app has one. Check storage availability with try/catch at startup and when saving.
  - **"Ingen endringer"** (same file and settings as the last run): an info Alert or a single inline line by the result. It is low impact, so keep it subtle (NN/g, "design based on impact").
  - **Corrupt, empty or non-Excel file:** an error message on the uploader (Aksel/Carbon "file-level error"). It doesn't belong in the row-level error summary, because there are no rows. Move focus to the uploader's error, or announce it via a live region, and keep the uploader enabled for a new attempt.
  - **Validation errors:** the error summary from section 2, with focus moved there.
  - **Success:** move to or render the result with an `<h2>` and announce it with `role="status"` ("Beregning ferdig: bestillingsplan for Produkt X."). Per Primer, no separate success toast is needed when the result itself is visible.
- **Live region setup.** Create one polite live region at page load (an empty `<div role="status">`) and reuse it for all non-critical announcements. This avoids the "injected region not announced" failure.

### Gaps
- Designsystemet's (Digdir) own Alert component page and any toast guidance were not fetched directly. Aksel's Alert/InlineMessage guidance was not fetched beyond a search snippet.
- No sourced guidance was found on messaging specifically for localStorage or private-browsing limits. The wording above is a suggestion.
