"""Lager data.js for prototypen fra referanseberegningen bak fasitene (testdata/lag_testdata.py).

Bruk fra prosjektroten:
    uv run --with openpyxl python ".docs/planning-artifacts/ux-designs/ux-prototype-2026-11-16/lag_data.py"

Prototypen beregner ingenting selv. Alle tall kommer fra denne fila.
"""
import json
import sys
from pathlib import Path

MAPPE = Path(__file__).resolve().parent
ROT = MAPPE.parents[3]
sys.argv = ["lag_testdata.py", str(MAPPE)]  # lag_testdata leser sys.argv[1] ved import
sys.path.insert(0, str(ROT / "testdata"))
import lag_testdata as L  # noqa: E402


def dump(nr, produkt, mps, stykk, mottak):
    detaljer = {}
    tab, eks = L.beregn(mps, stykk, mottak, detaljer)
    deler, sett = [], set()
    for (niva, vn, besk, _antall, typ, _lager, _ss, _lt) in stykk:
        if vn in sett:
            continue
        sett.add(vn)
        d = detaljer[vn]
        deler.append(dict(vn=vn, besk=besk, niva=niva, type=typ, lager=d["del_"]["lager"], ss=d["del_"]["ss"],
                          lt=d["del_"]["ledetid"], rot=d["rot"], kilder=d["kilder"], spor=d["spor"], rader=tab[vn]))
    forslag = [dict(vn=x[0], besk=x[1], uke=x[2], mengde=x[3], art=x[4], forfalt=x[5])
               for x in L.bestillingsforslag(tab, detaljer)]
    ut = dict(nr=nr, produkt=produkt, rot=stykk[0][1], h=len(mps), mps=mps, mottak=mottak, deler=deler,
              eksepsjoner=[dict(vn=e[0], uke=e[1], type=e[2], melding=e[3]) for e in eks], forslag=forslag)
    return ut, (tab, eks, detaljer)


def sml(a, b):
    return [dict(gruppe=x[0], endring=x[1], vn=x[2], uke=x[3], for_=x[4], etter=x[5], melding=x[6])
            for x in L.sammenligning(a, b)]


data, kjoringer = {}, {}
for nr, produkt, mps, stykk, mottak, *_ in L.TESTEKSEMPLER:
    if nr in ("01", "02", "03", "05"):
        data[nr], kjoringer[nr] = dump(nr, produkt, mps, stykk, mottak)
data["sammenligning"] = {"02->03": sml(kjoringer["02"], kjoringer["03"]),
                         "03->02": sml(kjoringer["03"], kjoringer["02"])}
kap = L.kapasitet(L.STYKKLISTE_05, L.MOTTAK_05, len(L.MPS_05))
data["05"]["kapasitet"] = {rad: dict(verdier=v, begrensende=b) for rad, (v, b) in kap.items()}

(MAPPE / "data.js").write_text(
    "// Generert fra testdata/lag_testdata.py (referanseberegningen bak fasitene) med lag_data.py. Ikke rediger for hånd.\n"
    "window.COSI_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
print("data.js skrevet:", ", ".join(f"{nr} {data[nr]['produkt']}" for nr in ("01", "02", "03", "05")))
