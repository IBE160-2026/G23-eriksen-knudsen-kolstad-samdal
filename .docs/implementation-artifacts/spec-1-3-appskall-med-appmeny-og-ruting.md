---
title: 'Story 1.3: Appskall med appmeny og ruting'
type: 'feature'
created: '2026-11-24'
status: 'done'
baseline_commit: '89fed1857aa0b01485dc12db785b90149db09e66'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '/Users/carmenkolstad/Utvikling/G23-story-1.3/.docs/planning-artifacts/epics.md'
  - '/Users/carmenkolstad/Utvikling/G23-story-1.3/.docs/planning-artifacts/architecture/architecture-COSI - MRP-2026-11-22-vedtatt/arkitektur.md'
  - '/Users/carmenkolstad/Utvikling/G23-story-1.3/.docs/planning-artifacts/ux-designs/ux-COSI - MRP-2026-11-22/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen har bare en midlertidig rotkomponent. Story 1.4 og senere stories trenger et appskall å bygge på: appmeny, egne adresser per visning, felles tilstand, feilgrense og statusregion (Story 1.3 i `epics.md`, AD-1, AD-5, AD-10, AD-13).

**Approach:** Bygg skallet i React etter prototypen v3 (`ux-prototype-2026-11-17-v3/index.html`), med DESIGN.md og EXPERIENCE.md foran prototypen ved avvik. Egen hash-ruting uten bibliotek, tilstand i Context med `useReducer`, og nøkkelen `cosi-mrp:intro-sett` bare via `lagring/`. De fem visningene er plassholdere med én h1 og egen sidetittel.

## Boundaries & Constraints

**Always:**
- Importgrensene i arkitektur kap. 2: `ui/` bruker bare `app/`, `tekster/` og typer fra `domene/`. Bare `app/` bruker `lagring/`. Bare `lagring/lagrede-kjoringer.ts` bruker `localStorage`, og hver lesing og skriving står i `try/catch`.
- CSP-en i AD-17: ingen inline-skript, ingen `<style>` og ingen `style`-attributter. CSS bare i filer.
- Komponentene bruker bare CSS-variablene i `ui/felles/tokens.css` (lys visning).
- All tekst kommer fra `tekster/nb.ts`, i de seksjonene som finnes (ingen nye seksjoner). Ordene følger ordbanken.
- Skriftene fra `@fontsource`, aldri fra nettet.
- Ingen nye avhengigheter. Enhetstester i Vitest (`node`), komponenter med `react-dom/server` der det trengs, og resten i Playwright.

**Never:**
- Innholdet på Introduksjon, Ny kjøring og Veiledning (Story 1.4), knappen og tokenene for mørk visning (1.13), kjøringen, worker-en og kjøringslinjen (1.10, 1.11), seksjonsmeny og innholdet i Resultat (Epic 2), Lagrede kjøringer (Epic 4).
- Prototypens panel Prototypevalg, protobar, undermeny i appmenyen, ruting og `localStorage`-nøkler.
- Endringer i prototypefilene, `typer.ts` eller arkitekturen.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Første besøk | Ingen adresse, `intro-sett` mangler | `#/introduksjon` med `replaceState`, `intro-sett` lagres | – |
| Senere besøk | Ingen eller ukjent adresse, `intro-sett` finnes | `#/ny-kjoring` med `replaceState` | – |
| Bokmerke | `#/veiledning` (eller en annen av de fem) | Den visningen, uansett `intro-sett` | – |
| Tilbake og Frem | Navigert via appmenyen | Følger adressene. Aktiv side og sidetittel følger med | – |
| Lagring blokkert | `localStorage` kaster | Appen virker, introduksjonen ved hvert besøk | Lesing gir «ikke sett», skriving ignoreres |
| Resultat uten kjøring | `#/resultat`, ingen kjøring i minnet | h1 «Resultat» og kort melding med lenke til Ny kjøring | – |
| Feil under tegning | En visning kaster | Norsk reservemelding med lenke til Ny kjøring. Skallet står | Nullstilles når ruten endres, uten omlasting |

</frozen-after-approval>

## Code Map

- **Prosjektroten er worktreen `/Users/carmenkolstad/Utvikling/G23-story-1.3` (branch `story/1.3-appskall`).** Alle filer leses og endres der, og kommandoene kjøres der. Ikke rør `/Users/carmenkolstad/Desktop/G23-eriksen-knudsen-kolstad-samdal`. Ingen commit, push eller nye pakker.
- `src/ui/App.tsx` -- midlertidig rot fra 1.1. Erstattes av skallet.
- `src/main.tsx` -- `main` kan bare importere `ui/`, React og `@fontsource` (`tests/hjelpere/arkitekturregler.ts`, `REGLER`). Skrifter og CSS importeres her.
- `src/tekster/nb.ts` -- faste seksjoner. Tekstene for appmenyen og sidetitlene legges i `felles`, og meldingen for Resultat uten kjøring i `resultat`.
- `src/domene/typer.ts` -- `Kjoring` (bare som type i tilstanden). Endres ikke.
- `vite.config.ts` -- Vitest `environment: 'node'`, `include: tests/**/*.test.ts`. Ingen DOM.
- `tsconfig.test.json` -- har ingen `jsx`. Må få `"jsx": "react-jsx"` når testene importerer `.tsx`.
- `.oxlintrc.json` -- `react/only-export-components` er warn, og lint kjøres med `--deny-warnings`. Derfor eksporterer `.tsx`-filene bare komponenter, og logikk står i `.ts`.
- `e2e/csp-vakt.ts` -- alle e2e-tester bruker `test` og `expect` herfra.
- `e2e/oppstart.spec.ts` -- forventer h1 «COSI - MRP» på `/`. Må endres til introduksjonen.
- Prototypen v3, linje 11–80 (tokens, `.app`, `.rail`, `.btn`), 325–335 (smal skjerm) og 339–358 (markup for appmenyen), og `route()` på linje 616–631.

## Tasks & Acceptance

**Execution:**
- [x] `src/lagring/lagrede-kjoringer.ts` -- `lesIntroSett`, `lagreIntroSett` med `try/catch` og en lager som kan settes inn i testene -- AD-10
- [x] `src/app/introduksjon.ts` -- `harSettIntroduksjonen`, `merkIntroduksjonenSomSett` -- `ui/` kan ikke bruke `lagring/`
- [x] `src/app/tilstand-handlinger.ts` -- `Tilstand` (`kjoring: Kjoring | null`, `statusmelding: string`), `Handling`, `endreTilstand`, kontekst og `useTilstand` -- AD-13
- [x] `src/app/tilstand.tsx` -- `TilstandLeverandor` med `useReducer` -- AD-13
- [x] `src/ui/ruter.ts` -- rutetabell (id, adresse, tittel), `finnRute`, `standardRute`, `useRute` (`hashchange`, `replaceState` ved manglende eller ukjent adresse) -- AD-13
- [x] `src/ui/felles/tokens.css` -- alle lyse tokens fra DESIGN.md som CSS-variabler -- UX-DR1
- [x] `src/ui/felles/app.css` -- grunnstil, appmeny, hovedfelt, informasjonsboks, fokusring, under 900 px, `prefers-reduced-motion` -- DESIGN.md
- [x] `src/ui/felles/Feilgrense.tsx` -- klassekomponent som nullstilles når ruten endres -- AD-5
- [x] `src/ui/appmeny/Appmeny.tsx` -- `<nav aria-label>` med logo og fem lenker, `aria-current="page"` -- UX-DR3
- [x] `src/ui/{introduksjon,ny-kjoring,resultat,lagrede-kjoringer,veiledning}/*.tsx` -- plassholdere med én h1 (`tabindex="-1"`) og `<title>`. Resultat: melding uten kjøring -- AD-13, UX-DR4, UX-DR27
- [x] `src/ui/App.tsx`, `src/main.tsx` -- skallet, én `role="status"`-region som aldri byttes ut, fokus til h1 ved ruteskifte, skrifter og CSS
- [x] `src/tekster/nb.ts` -- tekstene -- AD-9
- [x] `.docs/ordbank.md` -- «Feilgrense» og «Statusregion», og `updated` -- CLAUDE.md
- [x] `tsconfig.test.json` -- `"jsx": "react-jsx"`
- [x] `tests/lagring/`, `tests/app/`, `tests/ui/` -- enhetstester for matrisen, reduseren, feilgrensen og én h1 per visning
- [x] `e2e/appskall.spec.ts`, `e2e/oppstart.spec.ts` -- fem visninger, første og andre besøk, bokmerke, Tilbake og Frem, ukjent adresse, blokkert lagring, tastatur, sidetitler, 800 px uten sidescroll

**Acceptance Criteria:**
- Gitt appmenyen, når Kari tabber, så nås logoen og de fem lenkene i rekkefølge med synlig fokusring, og Enter åpner visningen og flytter fokus til h1.
- Gitt hver visning, når den vises, så har den nøyaktig én synlig h1 og sidetittelen «‹visning› – COSI - MRP».
- Gitt et vindu under 900 px, når appen vises, så står appmenyen øverst, og siden ruller ikke sideveis.
- Gitt Chromium og Firefox, når de fem visningene åpnes, så gir ingen av dem brudd på CSP-en, konsollfeil eller unntak.

## Implementation Notes

- Implementert 24.11 i worktreen. Kontroll: `npm test` 94/94, `npm run lint` exit 0, `npm run build` exit 0, `npm run test:e2e` 38/38 (Chromium og Firefox).
- Tilstanden har handlingene `VIS_KJORING`, `FJERN_KJORING`, `VIS_STATUSMELDING` og `FJERN_STATUSMELDING`. Reduseren, konteksten og `useTilstand` står i `app/tilstand-handlinger.ts`, fordi lint-regelen `react/only-export-components` krever at `.tsx`-filer bare eksporterer komponenter.
- `Feilgrense` nullstilles med `getDerivedStateFromProps` når ruten endres. Står brukeren allerede på Ny kjøring, nullstiller lenken grensen direkte. Den dekkes av enhetstester. Produksjonsbygget kan ikke få en visning til å kaste, så det er ingen e2e-test for den.
- Fokus flyttes til h1 bare ved ruteskifte, ikke ved første tegning.
- Skriftene er bare de latinske utvalgene fra `@fontsource`.
- Logoen bruker ordbankens «COSI - MRP», ikke «COSI-MRP» fra DESIGN.md.
- Meldingene i feilgrensen og på Resultat uten kjøring er nye tekster som gruppen bør se over.
- Funnet ved visuell kontroll 24.11, etter gjennomgangen: under 900 px ble appmenyen strukket til halve skjermhøyden, fordi grid-radene fylte `min-height: 100vh`. Rettet med `grid-template-rows: auto minmax(0, 1fr)` i `app.css`. E2e-testen for smal skjerm sjekker nå også at appmenyen er høyst 200 px høy. Etter rettingen: `npm test` 96/96, lint og build exit 0, `test:e2e` 40/40.
- 24.11, Carmens beslutning etter visuell kontroll: under 900 px viser appmenyen ett menyvalg per linje i full bredde, som i prototypen v3 (`.rail a.nav { width: 100% }`). Tidligere lå lenkene på rad og brøt linje, så «Veiledning» kunne stå alene. Endringen er bare i media-spørringen i `app.css`, der overstyringene som la lenkene på rad, er fjernet. Desktop er uendret. E2e-testen for smal skjerm sjekker nå ett menyvalg per linje på 768, 390 og 320 px, og at appmenyen ikke strekkes. Testen for bred skjerm kjøres på 900 og 1366 px. Kontrollert at testen feiler med den gamle løsningen. Menyen er 282 px høy under 900 px. Etter endringen: `npm test` 96/96, lint og build exit 0, `test:e2e` 44/44.
- 24.11, Iduns gjennomgang av PR #27: `Feilgrense` har fått `componentDidCatch` med `console.error(error, info)`. React 19 logger også selve feilen én gang (`onCaughtError`), så feilen står to ganger i konsollen, den andre med komponentstakken. Lenken «Til Ny kjøring» nullstiller nå grensen ut fra grensens egen rute (`state.nokkel`), ikke `window.location.hash`. Fra en annen rute gjør ruteskiftet det. Fokus flyttes bare én gang: `componentDidUpdate` hopper over ruteskifter, fordi `Skall` tar dem. Nye e2e-tester for fokus på h1 og rulling til toppen avslørte at Chromium gjenoppretter den gamle rulleposisjonen ved Tilbake. Rettet med `history.scrollRestoration = 'manual'` i `App.tsx`. Testene feiler hvis rullingen, fokuset eller `scrollRestoration` fjernes. Punktet om rulling er fjernet fra `deferred-work.md`. Direkte besøk på `#/introduksjon` merker fortsatt introduksjonen som sett (AD-10: «sier om introduksjonssiden er vist»). Endres ikke før Carmen og gruppen har bestemt det. Etter rettingene: `npm test` 171/171, lint og build exit 0, `test:e2e` 50/50.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Vurdering | Begrunnelse | Rute |
|---|---|---|---|---|---|
| 1 | blind | Ordbanken mangler flere ord (Hovedfelt, Reservemelding o.l.) | low | Appmeny og Informasjonsboks finnes allerede i ordbanken eller DESIGN.md. Resten er interne navn i koden, ikke fagord | avvist |
| 2 | blind | Toppkommentaren i `app.css` sier at bare tokens brukes, men noen mål er hardkodet | low | Kommentaren lovet mer enn filen holder | patch (kommentaren er rettet) |
| 3 | blind | Aktiv side ligner hover | low | Følger DESIGN.md (`surface-sunken` og fet tekst) | avvist |
| 4 | blind | Feilgrensen logger ikke | false | React 19 logger fangede feil med `console.error` | avvist |
| 5 | blind | Feilgrensen ligger bare rundt visningene | false | AD-5 sier «rundt visningene» | avvist |
| 6 | blind+edge | Fokus går tapt når feilgrensen nullstilles via lenken, eller når en visning kaster uten ruteskifte | medium | Lenken forsvinner fra siden, så fokus faller til `body` | patch (`componentDidUpdate` setter fokus på h1) |
| 7 | blind+vg | Feilgrensens feilgren og `provIgjen` er ikke testet | medium | Ingen test kaller `render()` med en fanget feil | patch (to nye enhetstester) |
| 8 | blind+vg | At statusregionen aldri byttes ut, er ikke testet | medium | Bare antallet ble sjekket | patch (e2e-testen sjekker at det er samme element) |
| 9 | blind | Smal skjerm er bare testet på 800 px | low | Kontrollen var for snever | patch (testet også på 320 px, grønn uten endring i CSS) |
| 10 | blind | Logolenken går til samme sted som Introduksjon | low | Slik er det i prototypen v3 | avvist |
| 11 | blind | `color-scheme` mangler | false | Uten `color-scheme` tegner nettleseren lyst | avvist |
| 12 | blind | `@fontsource` mangler i `package.json` | false | Pakkene står i `package.json` | avvist |
| 13 | blind | Mindre testhull (`useTilstand` utenfor leverandøren, fokus ved Tilbake) | low | Lite sannsynlig i bruk | avvist |
| 14 | edge | Klikk på Ny kjøring i appmenyen nullstiller ikke grensen når Ny kjøring er visningen som feiler | low | Visningen kaster igjen uansett | avvist |
| 15 | edge | Enter på lenken til siden man står på, flytter ikke fokus | low | Det skjer ingen navigering | avvist |
| 16 | edge | Samme statusmelding to ganger blir ikke lest opp igjen | low | Ingen kode sender statusmeldinger før Story 1.11 | avvist |
| 17 | edge | Reduseren har ingen `default` | false | `switch` dekker alle handlingene, og TypeScript sjekker det | avvist |
| 18 | edge | Tilbake og Frem ruller til toppen | low | Slik er det i prototypen, og plassholderne kan ikke rulles | avvist |
| 19 | vg | Rulling til toppen ved ruteskifte er ikke testet | medium (ikke kontrollert) | Plassholderne er for korte til å rulle | defer |

## Design Notes

Sidetittelen settes med Reacts `<title>` i visningen (React 19 flytter den til `<head>`). Aktiv side følger DESIGN.md: `surface-sunken` og fet tekst, ikke prototypens `accent-soft`. Appmenyen har `surface-raised` og ramme i `line`. `intro-sett` lagres hver gang introduksjonen vises, som i prototypen. Statusregionen er skjult visuelt til Story 1.11 bestemmer hvor den skal stå.

**Introduksjonen ved direkte besøk (Carmens beslutning 24.11, etter Iduns gjennomgang av PR #27).** Også et direkte besøk på `#/introduksjon`, for eksempel fra en delt lenke eller fra appmenyen, lagrer `cosi-mrp:intro-sett`. Grunnlaget er AD-10, der nøkkelen «sier om introduksjonssiden er vist i denne nettleseren», og prototypen v3, som lagrer nøkkelen hver gang introduksjonen vises. Akseptkriteriet i Story 1.3 sier at nøkkelen lagres når appen går til introduksjonen fra en åpning uten adresse eller med en ukjent adresse, men det sier ikke at et direkte besøk ikke skal telle. FR-27 og EXPERIENCE.md sier bare at introduksjonen vises første gang og startsiden senere. Har brukeren sett introduksjonen, er den vist, og neste åpning uten adresse går til Ny kjøring.

## Verification

**Commands:**
- `npm test` -- grønn, også arkitekturtesten
- `npm run lint` -- exit 0
- `npm run build` -- exit 0
- `npm run test:e2e` -- grønn i Chromium og Firefox

**Manual checks (if no CLI):**
- Vercel-delen av akseptkriteriene (forhåndsvisning, Node 24, Analytics, Speed Insights og toolbar av, HSTS) krever push. Kontrolleres når PR-en er godkjent av Carmen.
