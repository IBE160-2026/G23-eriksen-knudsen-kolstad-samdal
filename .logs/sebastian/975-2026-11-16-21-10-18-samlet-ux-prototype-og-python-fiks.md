# Samlet UX-prototype og Python-fiks

## 2026-11-16 kl. 21:10 — Sebastian

### Oppgave
Åpne den nyeste UX-prototypen på Carmen/Branch, den som slår sammen Sebastians og Carmens versjon, bare som HTML. Deretter fikse at Windows ofte stopper Python, og kontrollere at alt virker etterpå.

### Plan
- Hente origin/Carmen/Branch og finne den sammenslåtte prototypen ut fra commitene og README-ene.
- Åpne den uten å bytte branch: midlertidig worktree i scratchpad, lokal server, nettleser.
- Finne årsaken til blokkeringen (Smart App Control og en usignert Python fra uv) og bytte til en signert Python fra python.org.

### Resultat
- Den sammenslåtte prototypen er `.docs/planning-artifacts/ux/samlet-prototype-2026-11-16/cosi-mrp-samlet.html` (c834a94, Carmen, 16.11). Den nyeste committen på branchen (a0b49f5, `design-b-prd-2026-11-16/`) er Carmens Design B tilpasset PRD-en, ikke sammenslåingen.
- Den første serveren feilet med «En programkontrollpolicy har blokkert denne filen» (os error 4551). Smart App Control var på (`VerifiedAndReputablePolicyState` = 1), og `~\.local\bin\python.exe` var uv-administrert og usignert.
- Python 3.12.10 er installert med `winget install Python.Python.3.12 --scope user`. Signaturen er gyldig: Python Software Foundation.
- uv sin `cpython-3.12.14` er avinstallert, og `python.exe`, `python3.exe` og `python3.12.exe` er borte fra `.local\bin`. `claude.exe` er ikke rørt.
- `UV_PYTHON_PREFERENCE=only-system` er satt som brukervariabel. I bruker-PATH kommer Python312 før WindowsApps-aliaset.
- Verifisert med ny PATH: `python`, `py` og `pip` (3.12.10), standardbiblioteket (ssl, sqlite3, tkinter), `uv python find`, `uv venv`, `python -m venv` og Git Bash.
- `http.server` på 127.0.0.1:8767 serverer prototypen og `testdata/testeksempel-01.xlsx` (begge svarer 200), og prototypen er åpnet i nettleseren.
- Terminaler og VS Code som allerede var åpne, må startes på nytt for å få den nye PATH-en.
- Ingen prosjektfiler er endret. Carmens branch ligger i en midlertidig worktree i scratchpad.

### Åpne punkter
Ingen.
