# Reviewer gate – ARCHITECTURE-SPINE.md (2026-11-21)

Kjørt i samme kontekst som forfatteren (ikke uavhengige subagenter). Lint: `lint_spine.py` – 0 funn.

## 1. Rubrikk (good-spine checklist)

| Punkt | Vurdering |
| --- | --- |
| Fikser de reelle divergenspunktene for epics | Ja: lag og avhengigheter (AD-2), dataformer (AD-3), Excel (AD-4), lagring (AD-5), tilstand og flyt (AD-6), meldinger (AD-7), test og bygg (AD-8). |
| Hver regel kan håndheves | Ja. Arkitekturtest (importgraf), fasittester, CSP-likhetstest, mal-likhetstest, uttømmende typesjekk i tekster/. |
| Deferred kan ikke gi divergens | Ett unntak: «tall lagret som tekst og trimming» kan gi ulik validering. Merket som blokkerende før validering bygges. |
| Teknologi verifisert | Ja, se 2. |
| Dekker PRD-ens kapabiliteter | Ja, alle FR-1–FR-34 og NFR-1–NFR-11 står i kapabilitetskartet. NFR-8 er utsatt til UX. |
| Driftsrammen | Ja: miljøer (lokalt, forhåndsvisning, produksjon), Vercel, CSP, ingen server, ingen overvåking (med vilje). |

## 2. Verifisert mot nettet og prosjektet (finalize_reviewers 1)

| Teknologi | Kilde | Status |
| --- | --- | --- |
| vite 8.3.8, react 19.3.1, typescript 7.0.2, vitest 5.1.1, @playwright/test 1.65.1 | `npm view` 2026-11-21 | Bekreftet |
| create-vite react-ts (plugin-react ^6.1.2, oxlint ^1.90.0, typescript ~7.0.2) | Malens package.json, hentet 2026-11-21 | Bekreftet |
| read-excel-file 9.3.20, write-excel-file 4.1.1 | `npm view` + prøveskript mot testdata/ | Bekreftet |
| SheetJS (reserve) | npm 0.18.5 berørt av CVE-2023-30533 (GitLab Advisory) | Nyeste CDN-versjon ikke bekreftet – må sjekkes hvis reserven tas i bruk |
| Node 24 | Lokalt v24.20.0 | Bekreftet lokalt |
| CSP og read-excel-file | Kildekoden til worker-f lager Worker fra blob:-URL | worker-src blob: lagt inn |
| oxlint eksakt versjon | Bare malens område ^1.90.0 sett | Låses ved installasjon |

## 3. Motstander: to enheter som følger alle AD-er, men ikke passer sammen (finalize_reviewers 2)

| Funn | Lukket med |
| --- | --- |
| Innstillinger (intro vist): ui/ kan ikke bruke lagring/, og bare lagring/ rører localStorage | AD-5: innstillinger går gjennom lagring/ og nås via flyt/ |
| Ukeindeks 0- eller 1-basert | Konvensjon «Uker» ([ASSUMPTION], må bekreftes) |
| Identifikatorer med æøå eller ASCII | Konvensjon «Identifikatorer og filnavn» ([ASSUMPTION], må bekreftes) |
| Eksport skriver formatert tekst eller tall | AD-4: tall som tall |
| Kaste unntak eller returnere utfall mellom lag | Konvensjon «Feil over laggrenser» |
| Hvem tolker lagret JSON | AD-5: kjerne/, kalt av flyt/ |
| Hvor stykklisten slutter | AD-2: kjerne/ finner slutten; inn/ stopper ikke |
| Kjøring uten grunnlagsdata gjør FR-18 umulig | AD-3: Kjøring inneholder Grunnlagsdata i minnet |

## Gjenstående til Carmen

1. Bekreft eller endre de to [ASSUMPTION]-konvensjonene (ukeindeks og identifikatorer).
2. Tall lagret som tekst og trimming (FR-3) – gruppen.
3. Tilby uavhengig gjennomgang med egne subagenter hvis Carmen ønsker det.
