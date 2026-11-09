"""Lager Excel-mal, testeksempel og fasit for COSI - MRP.

Bruk: uv run --with openpyxl python lag_testdata.py <testdata-mappe> [--alle]

Uten --alle lages bare malen. Med --alle lages også testeksempel 01–05 med fasit og valideringsfilene.
"""
import datetime
import io
import re
import sys
import zipfile
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.formatting.rule import FormulaRule
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.hyperlink import Hyperlink

UT = Path(sys.argv[1])
FAST_TID = datetime.datetime(2026, 11, 5)  # brukes i alle filene, så en ny kjøring gir like filer når innholdet er likt


def lagre(wb, sti):
    """Lagrer arbeidsboken med fast tid i dokumentegenskaper og zip, og skriver bare når innholdet er endret."""
    wb.properties.created = wb.properties.modified = FAST_TID
    rå = io.BytesIO()
    wb.save(rå)
    ut = io.BytesIO()
    with zipfile.ZipFile(rå) as inn, zipfile.ZipFile(ut, "w", zipfile.ZIP_DEFLATED) as zut:
        for info in inn.infolist():
            ny = zipfile.ZipInfo(info.filename, date_time=(1980, 1, 1, 0, 0, 0))
            ny.compress_type = zipfile.ZIP_DEFLATED
            innhold = inn.read(info.filename)
            if info.filename == "docProps/core.xml":  # openpyxl setter «modified» til nå ved lagring
                innhold = re.sub(rb"(<dcterms:modified[^>]*>)[^<]*", rb"\g<1>2026-11-05T00:00:00Z", innhold)
            zut.writestr(ny, innhold)
    data = ut.getvalue()
    sti = Path(sti)
    if not sti.exists() or sti.read_bytes() != data:
        sti.write_bytes(data)
MAKS_UKER = 12

FONT = Font(name="Arial", size=10)
FONT_FET = Font(name="Arial", size=10, bold=True)
FONT_TITTEL = Font(name="Arial", size=14, bold=True)
FONT_HVIT = Font(name="Arial", size=10, bold=True, color="FFFFFF")
FYLL_HODE = PatternFill("solid", fgColor="1F4E78")
FYLL_INPUT = PatternFill("solid", fgColor="FFF2CC")
FYLL_EKSEMPEL = PatternFill("solid", fgColor="E2EFDA")
FYLL_VARSEL = PatternFill("solid", fgColor="F8CBAD")
FYLL_KRITISK = PatternFill("solid", fgColor="FCE4D6")
TYNN = Side(style="thin", color="BFBFBF")
RAMME = Border(left=TYNN, right=TYNN, top=TYNN, bottom=TYNN)

STYKK_KOLONNER = ["Nivå", "Varenummer", "Beskrivelse", "Antall", "Type",
                  "Lagerbeholdning", "Sikkerhetslager", "Ledetid (uker)"]
NIVAER = ["0", ".1", "..2"]
TYPER = ["Ferdigvare", "Komponent (Kjøpes inn)", "Komponent (Produseres selv)"]
KJOPT = "Komponent (Kjøpes inn)"
PROD = "Komponent (Produseres selv)"

# Eksempelet i Veiledning: skruesettet brukes både i setet og i ryggen, og lager mm. står bare første gang
EKSEMPEL_STYKKLISTE = [
    ("0", "100-001", "Kontorstol Basic", None, "Ferdigvare", 10, 0, 1),
    (".1", "200-001", "Sete", 1, PROD, 40, 10, 1),
    ("..2", "300-001", "Seteplate", 1, KJOPT, 50, 10, 2),
    ("..2", "300-002", "Skruesett M6", 4, KJOPT, 150, 40, 2),
    (".1", "200-002", "Rygg", 1, PROD, 30, 5, 1),
    ("..2", "300-002", "Skruesett M6", 2, KJOPT, None, None, None),
    (".1", "300-003", "Hjul", 5, KJOPT, 80, 30, 1),
]


# ---------- Testeksempel 01: fiktiv kontorstolprodusent ----------

PRODUKT = "Kontorstol Basic"
MPS = [20, 25, 30, 20, 35, 30, 25, 40, 30, 20]  # 10 ukers horisont

# Testeksempel 01 har to nivåer: ferdigproduktet uten lager, SS og ledetid, og åtte innkjøpte deler på nivå .1.
# Da er frigivelsene for ferdigproduktet lik MPS, og tallene for delene er de samme som før flernivå.
STYKKLISTE_01 = [
    ("0", "100-002", PRODUKT, None, "Ferdigvare", 0, 0, 0),
    (".1", "300-001", "Sete", 1, KJOPT, 200, 20, 2),
    (".1", "300-002", "Rygg", 1, KJOPT, 60, 10, 1),
    (".1", "300-003", "Hjul", 5, KJOPT, 80, 30, 1),
    (".1", "300-004", "Armlene", 2, KJOPT, 50, 20, 1),
    (".1", "300-005", "Gassfjær", 1, KJOPT, 75, 10, 2),
    (".1", "300-006", "Stolfot", 1, KJOPT, 400, 20, 10),
    (".1", "300-007", "Skruesett", 4, KJOPT, 150, 40, 2),
    (".1", "300-008", "Trekk", 1, KJOPT, 90, 0, 3),
]

HENSIKT_01 = {
    "100-002": "Ferdigproduktet uten lager, sikkerhetslager og ledetid: frigivelsene er lik MPS",
    "300-001": "Normalforløp: første behov kan bestilles i tide",
    "300-002": "Normalforløp med ledetid 1 uke",
    "300-003": "Bestilling forsinket i uke 1 (lager går under 0)",
    "300-004": "Bruk av sikkerhetslager i uke 1 (lager mellom 0 og sikkerhetslager)",
    "300-005": "Mottak forsinket: behov i uke 3, planlagt mottak i uke 4 fremskyndes til uke 3",
    "300-006": "Ledetid fra ferdigproduktet = horisont (grensetilfelle)",
    "300-007": "Planlagt mottak i uke 2 kommer i tide og trengs (ingen eksepsjon)",
    "300-008": "Sikkerhetslager 0 og frigivelse nøyaktig i uke 1 (grensetilfelle)",
}

# (varenummer, uke, antall)
MOTTAK = [("300-005", 4, 100), ("300-007", 2, 120)]

STATUS_01 = ("Status: verdiene er beregnet med skript og kontrollert for hånd (2026-10-19, endringene for 300-005, "
             "300-006 og 100-002 2026-11-02).")


# ---------- Testeksempel 02: flernivå (tre nivåer), laget av Carmen 2026-10-29 og tilpasset 2026-11-05 ----------

PRODUKT_02 = "Kontorstol Pro"
MPS_02 = [30, 30, 35, 25, 40, 35, 30, 45, 35, 30]  # 10 ukers horisont

STYKKLISTE_02 = [
    ("0", "100-001", PRODUKT_02, None, "Ferdigvare", 20, 5, 1),
    (".1", "200-001", "Sete", 1, PROD, 30, 5, 1),
    ("..2", "300-001", "Seteplate", 1, KJOPT, 120, 10, 2),
    ("..2", "300-002", "Skruesett M6", 4, KJOPT, 400, 50, 1),
    (".1", "200-002", "Rygg", 1, PROD, 85, 5, 1),
    ("..2", "300-002", "Skruesett M6", 2, KJOPT, None, None, None),
    ("..2", "300-003", "Ryggtrekk", 1, KJOPT, 20, 30, 2),
    (".1", "300-004", "Hjul", 5, KJOPT, 300, 30, 1),
    (".1", "300-005", "Gassfjær", 1, KJOPT, 400, 10, 12),
]

MOTTAK_02 = [("200-002", 4, 40), ("300-005", 5, 50)]

HENSIKT_02 = {
    "100-001": "Ferdigprodukt med egen lagerbeholdning, sikkerhetslager og ledetid 1. Lageret går under 0 i uke 1: "
               "Bestilling forsinket (til kunde). Den forfalte frigivelsen legges i uke 1 og blir bruttobehov på nivå .1 i uke 1",
    "200-001": "Produseres selv og har deler under seg. Får den forfalte frigivelsen fra 100-001 som bruttobehov i uke 1, "
               "og lageret går under 0: Bestilling forsinket. Delen over er ferdigproduktet, så leveransen til kunde blir forsinket",
    "200-002": "Produseres selv, med planlagt mottak i uke 4 mens nettobehovet kommer i uke 3: Mottak forsinket. Mottaket "
               "fremskyndes i egen produksjon, og det lages ingen ny ordre for uke 3",
    "300-001": "Bruttobehov = frigivelsene til Sete × 1. Normalforløp uten eksepsjon",
    "300-002": "Står to steder: bruttobehov = frigivelsene til Sete × 4 + frigivelsene til Rygg × 2, summert uke for uke",
    "300-003": "Lageret (20) er under sikkerhetslageret (30) fra start, og en ny bestilling kommer tidligst i uke 3: "
               "Bruk av sikkerhetslager i uke 1",
    "300-004": "Normalforløp på nivå .1 uten eksepsjon (kontroll på at det ikke kommer falske varsler)",
    "300-005": "Ledetid fra ferdigproduktet 1 + 12 = 13 ≥ horisont 10: Ledetid overskrider horisont, selv om lageret dekker "
               "hele horisonten. Det planlagte mottaket på 50 i uke 5 trengs ikke: Kanseller mottak",
}

STATUS_02 = ("Status: beregnet med skript 2026-11-05 etter PRD-reglene fra 2026-11-02 og kontrollert for hånd "
             "(Carmen 2026-10-24, endringene for 200-002, 300-002, 300-003, 300-005 og 200-001 Sebastian 2026-11-05).")

# Forventede eksepsjoner per del: (uke, type). Skriptet stopper hvis beregn() gir noe annet (se kontroller()).
FORVENTET_01 = {
    "300-003": [(1, "Bestilling forsinket")],
    "300-004": [(1, "Bruk av sikkerhetslager")],
    "300-005": [(3, "Mottak forsinket")],
    "300-006": [("–", "Ledetid overskrider horisont")],
}
FORVENTET_02 = {
    "100-001": [(1, "Bestilling forsinket")],
    "200-001": [(1, "Bestilling forsinket")],
    "200-002": [(3, "Mottak forsinket")],
    "300-003": [(1, "Bruk av sikkerhetslager")],
    "300-005": [("–", "Ledetid overskrider horisont"), (5, "Kanseller mottak")],
}


# ---------- Testeksempel 03: testeksempel 02 med økt MPS i uke 2, for før/etter-sammenligningen ----------

MPS_03 = list(MPS_02)
MPS_03[1] = 45  # uke 2: 30 → 45
HENSIKT_03 = dict(HENSIKT_02)
HENSIKT_03.update({
    "100-001": "Som i testeksempel 02, men MPS i uke 2 er økt fra 30 til 45. Bestilling forsinket i uke 1 som før, "
               "med større frigivelse i uke 1",
    "200-002": "Mottaket i uke 4 må nå fremskyndes til uke 2 i stedet for uke 3 (eksepsjonen flytter uke)",
    "300-002": "Får et nytt bestillingsforslag i uke 1",
    "300-004": "Ny eksepsjon: Bruk av sikkerhetslager i uke 1, fordi behovet i uke 1 øker",
})
FORVENTET_03 = {
    "100-001": [(1, "Bestilling forsinket")],
    "200-001": [(1, "Bestilling forsinket")],
    "200-002": [(2, "Mottak forsinket")],
    "300-003": [(1, "Bruk av sikkerhetslager")],
    "300-004": [(1, "Bruk av sikkerhetslager")],
    "300-005": [("–", "Ledetid overskrider horisont"), (5, "Kanseller mottak")],
}
STATUS_03 = ("Status: beregnet med skript og kontrollert for hånd 2026-11-05. Testeksempelet er testeksempel 02 med "
             "MPS i uke 2 økt fra 30 til 45. Arket Sammenligning viser forskjellene i bestillingsforslag og eksepsjoner "
             "begge veier (02 → 03 og 03 → 02).")


# ---------- Testeksempel 04: grensetilfeller (tre nivåer, 12 uker) ----------

PRODUKT_04 = "Kontorstol Ergo"
MPS_04 = [20, 30, 25, 0, 30, 35, 0, 20, 25, 30, 40, 30]  # 12 ukers horisont (største), med uker uten behov

STYKKLISTE_04 = [
    ("0", "100-003", PRODUKT_04, None, "Ferdigvare", 20, 0, 1),
    (".1", "200-010", "Sete", 1, PROD, 70, 5, 4),
    ("..2", "300-022", "Skruesett M8", 4, KJOPT, 1000, 0, 7),
    ("..2", "300-023", "Monteringsbrakett", 1, KJOPT, 120, 10, 1),
    (".1", "200-011", "Rygg", 1, PROD, 40, 5, 3),
    ("..2", "300-021", "Ryggplate", 1, KJOPT, 400, 10, 7),
    ("..2", "300-022", "Skruesett M8", 2, KJOPT, None, None, None),
    (".1", "200-012", "Armlene", 1, PROD, 20, 0, 1),
    ("..2", "300-024", "Armlenepute", 1, KJOPT, 200, 0, 1),
    ("..2", "300-025", "Skrue M5", 2, KJOPT, 500, 20, 1),
    (".1", "300-023", "Monteringsbrakett", 2, KJOPT, None, None, None),
    (".1", "200-012", "Armlene", 1, PROD, None, None, None),
    ("..2", "300-025", "Skrue M5", 2, KJOPT, None, None, None),
    ("..2", "300-024", "Armlenepute", 1, KJOPT, None, None, None),
    (".1", "200-013", "Fotkryss", 1, PROD, 300, 0, 2),
    ("..2", "300-029", "Hjul", 5, KJOPT, 2000, 0, 1),
    (".1", "200-013", "Fotkryss", 1, PROD, None, None, None),
    (".1", "300-026", "Låseskive", 4, KJOPT, 0, 0, 1),
    (".1", "300-027", "Trekk", 1, KJOPT, 40, 0, 2),
    (".1", "300-028", "Hodestøtte", 1, KJOPT, 10, 0, 1),
]

MOTTAK_04 = [("100-003", 2, 20), ("300-026", 3, 30), ("300-027", 4, 20), ("300-027", 4, 30),
             ("300-028", 3, 10), ("300-028", 5, 15)]

HENSIKT_04 = {
    "100-003": "Ferdigprodukt med planlagt mottak (produksjonsordre) på 20 i uke 2 som kommer i tide og trengs. "
               "Uke 4 og 7 har MPS 0. Horisonten er 12 uker",
    "200-010": "Ledetid 4 og lager som dekker de fire første ukene: ingen forfalt frigivelse",
    "300-022": "Står under Sete og Rygg. Ledetid fra ferdigproduktet er 1 + 4 + 7 = 12 = H langs den lengste stien, "
               "selv om ingen enkelt ledetid er ≥ H (via Rygg er den 11). Bestilling forsinket i uke 7, og meldingen "
               "nevner begge delene over",
    "300-023": "Står både på nivå .1 (2 per stol) og på nivå ..2 (1 per sete). Beregnes én gang på lavnivåkode 2, med "
               "bruttobehov = 2 × frigivelsene til 100-003 + 1 × frigivelsene til 200-010",
    "200-011": "Ledetid 3, ingen eksepsjon",
    "300-021": "Ledetid fra ferdigproduktet er 1 + 3 + 7 = 11 = H − 1: ingen eksepsjon",
    "200-012": "Står to ganger på nivå .1 med de samme underdelene i ulik rekkefølge. Bruttobehov = 2 × frigivelsene "
               "til 100-003",
    "300-024": "Underdel av 200-012. Telles én gang: bruttobehov = 1 × frigivelsene til 200-012, ikke 2 ×",
    "300-025": "Underdel av 200-012 med sikkerhetslager. Telles én gang: bruttobehov = 2 × frigivelsene til 200-012",
    "200-013": "Står to ganger på nivå .1, med underdeler bare under første forekomst. Bruttobehov = 2 × frigivelsene "
               "til 100-003",
    "300-029": "Underdel av 200-013: bruttobehov = 5 × frigivelsene til 200-013. Lageret dekker hele horisonten",
    "300-026": "Lager 0 og sikkerhetslager 0. Mottaket på 30 i uke 3 er for lite til behovet på 40 i uke 1: samme uke "
               "får både Mottak forsinket og Bestilling forsinket for resten (to eksepsjoner i én celle)",
    "300-027": "To planlagte mottak i samme uke (20 + 30 i uke 4) legges sammen til 50. De kommer i tide og trengs",
    "300-028": "To planlagte mottak (uke 3 og uke 5) fremskyndes begge til uke 2: to eksepsjoner Mottak forsinket i "
               "samme uke",
}
FORVENTET_04 = {
    "300-022": [("–", "Ledetid overskrider horisont"), (7, "Bestilling forsinket")],
    "300-026": [(1, "Bestilling forsinket"), (1, "Mottak forsinket")],
    "300-028": [(2, "Mottak forsinket"), (2, "Mottak forsinket")],
}
STATUS_04 = ("Status: beregnet med skript og kontrollert for hånd 2026-11-05. Testeksempelet samler "
             "grensetilfellene som ikke er dekket av testeksempel 01–03.")


# ---------- Testeksempel 05: produksjonskapasitet fra lager (PRD §4.9, FR-31–FR-33, SM-7) ----------

PRODUKT_05 = "Kontorstol Kompakt"
MPS_05 = [5, 5, 6, 6, 8, 8, 6, 6]  # 8 ukers horisont (minste). MPS påvirker ikke kapasiteten

# Små tall, så kapasiteten kan regnes for hånd. Dekker SM-7: sikkerhetslager, planlagte mottak, lager av
# ferdigproduktet og av en del som produseres selv (Sete), en felles del (Skruesett M6) og ledetid som begrenser.
STYKKLISTE_05 = [
    ("0", "100-004", PRODUKT_05, None, "Ferdigvare", 12, 2, 1),
    (".1", "200-020", "Sete", 1, PROD, 8, 0, 2),
    ("..2", "300-031", "Seteplate", 1, KJOPT, 40, 10, 2),
    ("..2", "300-032", "Skruesett M6", 4, KJOPT, 140, 20, 1),
    (".1", "200-021", "Rygg", 1, PROD, 0, 0, 1),
    ("..2", "300-033", "Ryggplate", 1, KJOPT, 25, 5, 3),
    ("..2", "300-032", "Skruesett M6", 2, KJOPT, None, None, None),
    (".1", "300-034", "Hjul", 5, KJOPT, 150, 30, 1),
]

MOTTAK_05 = [("300-034", 3, 100), ("300-033", 5, 30)]

HENSIKT_05 = {
    "100-004": "Ferdigprodukt med lager 12 og SS 2: ledig beholdning 10 telles med i kapasiteten. Ledetid 1, så "
               "produksjon rekker tidligst uke 2. Begrenser i uke 1 (ledetid)",
    "200-020": "Produseres selv, med lager 8 (mellomlager) som brukes før underdelene. Ledetid 2, så nye seter "
               "rekker tidligst uke 4. Begrenser i uke 3 (ledetid)",
    "300-031": "Seteplate med SS 10: ledig beholdning 30. Begrenser ikke",
    "300-032": "Felles del: 4 per sete og 2 per rygg. Ledig 120. Begrenser i uke 7–8 med planlagte mottak (lager). "
               "En enkel regel uten mellomlager ville gitt 120 / 6 = 20 stoler, men riktig svar er 25",
    "200-021": "Produseres selv, uten lager, ledetid 1: rygger rekker tidligst uke 3. Begrenser i uke 2 (ledetid)",
    "300-033": "Ryggplate med SS 5: ledig 20. Begrenser fra uke 4. Mottaket på 30 i uke 5 hjelper først fra uke 7, "
               "fordi ryggplaten trengs to uker før stolen er ferdig. I MRP-beregningen fremskyndes mottaket til uke 4: "
               "Mottak forsinket",
    "300-034": "Hjul med SS 30: ledig 120 (24 stoler). Mottaket på 100 i uke 3 gir 44 stoler. Begrenser ikke",
}

FORVENTET_05 = {"300-033": [(4, "Mottak forsinket")]}
STATUS_05 = ("Status: beregnet med skript 2026-11-09 (MRP og kapasitet). Kapasiteten er også regnet for hånd i arket "
             "Kapasitet, og skriptet stopper hvis tallene avviker. Må kontrolleres for hånd av gruppen.")

# Forventet kapasitet per uke og forventede begrensende deler for N + 1, som (rad, uke): [(varenummer, årsak)].
# Regnet for hånd (se KAPASITET_UTREGNING_05). Skriptet stopper hvis kapasitet() gir noe annet.
FORVENTET_KAP_05 = {
    "Fra lager": [10, 10, 18, 30, 30, 30, 30, 30],
    "Med planlagte mottak": [10, 10, 18, 30, 30, 30, 35, 35],
}
FORVENTET_BEGR_05 = {
    **{(rad, 1): [("100-004", "ledetid")] for rad in FORVENTET_KAP_05},
    **{(rad, 2): [("200-021", "ledetid")] for rad in FORVENTET_KAP_05},
    **{(rad, 3): [("200-020", "ledetid")] for rad in FORVENTET_KAP_05},
    **{("Fra lager", u): [("300-033", "lager")] for u in range(4, 9)},
    **{("Med planlagte mottak", u): [("300-033", "lager")] for u in range(4, 7)},
    **{("Med planlagte mottak", u): [("300-032", "lager")] for u in range(7, 9)},
}

KAPASITET_UTREGNING_05 = [
    "Ledig beholdning = maks(0, lagerbeholdning − SS): 100-004 12 − 2 = 10, 200-020 8, 200-021 0, "
    "300-031 40 − 10 = 30, 300-032 140 − 20 = 120, 300-033 25 − 5 = 20, 300-034 150 − 30 = 120.",
    "Behov på N stoler i uke t. Ferdigproduktet dekker 10 fra lager. Resten, P = N − 10, må produseres (L = 1) og "
    "frigis i uke t − 1, så det krever t ≥ 2. Produksjonen trenger P seter, P rygger og 5P hjul i uke t − 1.",
    "Sete (lager 8, L = 2): 8 fra lager i uke t − 1. Resten, P − 8, frigis i uke t − 3, så det krever t ≥ 4. "
    "Det trenger P − 8 seteplater og 4(P − 8) skruesett i uke t − 3.",
    "Rygg (lager 0, L = 1): P rygger frigis i uke t − 2, så det krever t ≥ 3. Det trenger P ryggplater og "
    "2P skruesett i uke t − 2.",
    "Uke 1: ingen produksjon rekker, fordi ferdigproduktet måtte vært frigitt i uke 0. Kapasitet 10. Stol nr. 11 "
    "stopper på 100-004 (ledetid).",
    "Uke 2: produksjonen frigis i uke 1, men rygger måtte vært frigitt i uke 0. P = 0, kapasitet 10. Stol nr. 11 "
    "stopper på 200-021 Rygg (ledetid).",
    "Uke 3: rygger frigis i uke 1 (ryggplate 20 ≥ P). Seter bare fra lager: P ≤ 8. Hjul 5 × 8 = 40 ≤ 120. "
    "Kapasitet 10 + 8 = 18. Stol nr. 19 trenger et sete som måtte vært frigitt i uke 0: 200-020 Sete (ledetid).",
    "Uke 4–8, fra lager: ryggplate P ≤ 20, hjul 5P ≤ 120 gir P ≤ 24, seteplate P − 8 ≤ 30 gir P ≤ 38, skruesett "
    "4(P − 8) + 2P ≤ 120 gir P ≤ 25. P = 20, kapasitet 30. Stol nr. 31 stopper på 300-033 Ryggplate (lager). "
    "Skruesett for P = 21: 4 × 13 + 2 × 21 = 94 ≤ 120, så skruesettet begrenser ikke.",
    "Med planlagte mottak: hjul +100 fra uke 3 (hjul trengs i uke t − 1, så det hjelper fra uke 4) og ryggplate +30 "
    "fra uke 5 (ryggplate trengs i uke t − 2, så det hjelper fra uke 7). Uke 1–3 er som fra lager.",
    "Uke 4–6 med mottak: ryggplaten er fortsatt 20, så kapasiteten er 30, og 300-033 begrenser.",
    "Uke 7–8 med mottak: ryggplate P ≤ 50, hjul 5P ≤ 220 gir P ≤ 44, seteplate P ≤ 38, skruesett P ≤ 25. P = 25, "
    "kapasitet 35. For P = 25 trengs 4 × 17 + 2 × 25 = 118 ≤ 120 skruesett. Stol nr. 36 stopper på 300-032 "
    "Skruesett M6 (lager): 4 × 18 + 2 × 26 = 124 > 120.",
]



# ---------- Beregning (PRD §4.2–4.3) ----------

def struktur(stykkliste):
    """Leser stykklisten: data per varenummer, koblinger forelder → del, lavnivåkode og ledetid fra ferdigproduktet.

    Data (beskrivelse, type, lager, SS, ledetid) hentes fra første rad med varenummeret (FR-28).
    Står en del med underdeler flere steder, brukes underdelene én gang, så de ikke telles dobbelt. De kan stå bare
    under første forekomst eller likt under hver forekomst. Ulike underdeler er en feil (PRD FR-3).
    """
    deler, rekkefolge = {}, []
    foreldrerad, siste = [], {}
    for i, (niva, vn, besk, _antall, typ, lager, ss, ledetid) in enumerate(stykkliste):
        d = NIVAER.index(niva)
        siste[d] = i
        foreldrerad.append(siste[d - 1] if d > 0 else None)
        if vn not in deler:
            deler[vn] = dict(beskrivelse=besk, type=typ, lager=lager, ss=ss, ledetid=ledetid)
            rekkefolge.append(vn)
    rot = stykkliste[0][1]
    barnrader = {}
    for i, p in enumerate(foreldrerad):
        if p is not None:
            barnrader.setdefault(p, []).append(i)
    blokk = {}
    for p in sorted(barnrader):
        vn = stykkliste[p][1]
        if vn in blokk:
            forste = sorted((stykkliste[i][1], stykkliste[i][3]) for i in barnrader[blokk[vn]])
            denne = sorted((stykkliste[i][1], stykkliste[i][3]) for i in barnrader[p])
            if forste != denne:
                raise ValueError(f"{vn} har ulike underdeler i rad {blokk[vn] + 2} og rad {p + 2} i Stykkliste.")
        blokk.setdefault(vn, p)
    kanter = [(vn, stykkliste[i][1], stykkliste[i][3]) for vn, p in blokk.items() for i in barnrader[p]]

    llk = {vn: 0 for vn in deler}
    for _ in range(len(NIVAER)):
        for f, b, _a in kanter:
            llk[b] = max(llk[b], llk[f] + 1)
    # Ledetid fra ferdigproduktet (FR-9): lengste sum av ledetider langs en sti fra ferdigproduktet til delen
    kum = {rot: (deler[rot]["ledetid"], [rot])}
    for vn in sorted(deler, key=lambda v: (llk[v], rekkefolge.index(v))):
        if vn == rot:
            continue
        best = max((kum[f] for f, b, _a in kanter if b == vn), key=lambda x: x[0])
        kum[vn] = (best[0] + deler[vn]["ledetid"], best[1] + [vn])
    return deler, rekkefolge, kanter, llk, kum, rot


def mrp_del(brutto, mottak, lager, ss, ledetid, fremskynd=True):
    """MRP for én del med lot-for-lot (FR-6–FR-8). Gir radene og hendelsene som eksepsjonene bygger på.

    Nettingen regner et fremskyndet mottak fra uken det trengs (planlagt), men tabellen viser mottaket i uken
    det er lagt inn, og forventet lagerbeholdning er uten mottaket til det kommer (FR-6, valg B 2026-11-02).
    """
    h = len(brutto)
    planlagt = list(mottak)
    forventet, netto, ordremottak, frigivelse = [], [], [], [0] * h
    fremskyndet, forfalte, spor = [], [], []
    forrige = lager
    for t in range(h):
        uke = t + 1
        disponibel = forrige + planlagt[t] - brutto[t]
        nb = max(0, ss - disponibel)
        uten = disponibel  # disponibel før noe mottak er fremskyndet, som tabellen viser
        steg = dict(forrige=forrige, mottak=planlagt[t], brutto=brutto[t], disponibel=disponibel, nb=nb, flytt=[])
        # FR-6: senere planlagte mottak fremskyndes før det lages nye ordrer
        for u in range(t + 1, h):
            if nb == 0 or not fremskynd:
                break
            if planlagt[u] > 0:
                fremskyndet.append(dict(uke=uke, fra=u + 1, antall=planlagt[u], disponibel=uten))
                planlagt[t] += planlagt[u]
                disponibel += planlagt[u]
                steg["flytt"].append(dict(fra=u + 1, antall=planlagt[u], disponibel=disponibel,
                                          nb=max(0, ss - disponibel)))
                planlagt[u] = 0
                nb = max(0, ss - disponibel)
        netto.append(nb)
        ordremottak.append(nb)
        if nb > 0:
            frigi_uke = uke - ledetid
            if frigi_uke >= 1:
                frigivelse[frigi_uke - 1] += nb
            else:
                frigivelse[0] += nb  # forfalt: må frigis straks
                forfalte.append(dict(uke=uke, antall=nb, disponibel=disponibel, frigi_uke=frigi_uke))
        forrige = disponibel + nb
        ikke_kommet = sum(f["antall"] for f in fremskyndet if f["fra"] > uke)
        forventet.append(forrige - ikke_kommet)
        steg.update(ordremottak=nb, slutt=forrige, vist=forrige - ikke_kommet,
                    frigi_uke=uke - ledetid if nb > 0 else None)
        spor.append(steg)
    rader = {
        "Bruttobehov": list(brutto),
        "Planlagte mottak": list(mottak),
        "Forventet lagerbeholdning": forventet,
        "Nettobehov": netto,
        "Planlagte ordremottak": ordremottak,
        "Planlagte ordrefrigivelser": frigivelse,
    }
    return rader, fremskyndet, forfalte, spor


def beregn(mps, stykkliste, mottak, detaljer=None):
    """Flernivå MRP for hele stykklisten.

    Gir {varenummer: rader} i stykklistens rekkefølge og eksepsjonene som (varenummer, uke, type, melding),
    sortert etter stykklisten og uke («–» først).
    """
    h = len(mps)
    deler, rekkefolge, kanter, llk, kum, rot = struktur(stykkliste)
    tabeller, eksepsjoner = {}, []
    for vn in sorted(deler, key=lambda v: (llk[v], rekkefolge.index(v))):
        d = deler[vn]
        foreldre = [f for f, b, _a in kanter if b == vn]
        if vn == rot:
            brutto = list(mps)  # FR-5
        else:
            brutto = [sum(a * tabeller[f]["Planlagte ordrefrigivelser"][t] for f, b, a in kanter if b == vn)
                      for t in range(h)]
        planlagt = [0] * h
        for mvn, uke, antall in mottak:
            if mvn == vn and 1 <= uke <= h:
                planlagt[uke - 1] += antall
        lager, ss, ledetid = d["lager"], d["ss"], d["ledetid"]
        rader, fremskyndet, forfalte, spor = mrp_del(brutto, planlagt, lager, ss, ledetid)
        tabeller[vn] = rader
        eks = []

        # FR-9: ledetid fra ferdigproduktet ≥ H
        sum_l, sti = kum[vn]
        if sum_l >= h:
            ledd = " + ".join(f"{deler[s]['beskrivelse']} {deler[s]['ledetid']}" for s in sti)
            eks.append((vn, "–", "Ledetid overskrider horisont",
                        f"Ledetiden fra ferdigproduktet ({sum_l} uker: {ledd}) er minst like lang som horisonten "
                        f"({h} uker). Behov etter uke {h} som må bestilles nå, vises ikke i planen. "
                        "Vurder lengre horisont."))

        # FR-10 / FR-11: forfalt frigivelse
        if vn == rot or rot in foreldre:
            folge = "Leveranse til kunde blir forsinket."
        else:
            navn = " og ".join(f"{deler[f]['beskrivelse']} ({f})" for f in foreldre)
            folge = f"Produksjonen av {navn} blir forsinket."
        for f in forfalte:
            forfalt = (f"Bestillingen på {f['antall']} måtte vært frigitt i uke {f['frigi_uke']}"
                       f"{', før horisonten' if f['disponibel'] < 0 else ''}. "
                       f"De {f['antall']} er forfalt og tatt med i frigivelsen på "
                       f"{rader['Planlagte ordrefrigivelser'][0]} i uke 1, men kommer tidligst i uke {1 + ledetid}.")
            if f["disponibel"] < 0:
                eks.append((vn, f["uke"], "Bestilling forsinket",
                            f"Lager blir {f['disponibel']} i uke {f['uke']}. {forfalt} {folge}"))
            else:
                eks.append((vn, f["uke"], "Bruk av sikkerhetslager",
                            f"Lager blir {f['disponibel']} i uke {f['uke']}, under sikkerhetslager {ss}, "
                            f"før ny leveranse kan komme inn. {forfalt}"))

        # FR-12: fremskyndet mottak
        hvor = "hos leverandøren" if d["type"] == KJOPT else "i egen produksjon"
        for f in fremskyndet:
            under = "" if f["disponibel"] < 0 else f", under sikkerhetslager {ss},"
            eks.append((vn, f["uke"], "Mottak forsinket",
                        f"Lager blir {f['disponibel']} i uke {f['uke']}{under} før mottaket kommer. "
                        f"Det planlagte mottaket på {f['antall']} i uke {f['fra']} må fremskyndes til "
                        f"uke {f['uke']} {hvor}. Det lages ingen ny bestilling for behovet mottaket dekker."))

        # FR-29: mottak som ikke trengs i horisonten
        flyttet = {f["fra"] for f in fremskyndet}
        for u in range(h):
            if planlagt[u] > 0 and (u + 1) not in flyttet:
                uten = list(planlagt)
                uten[u] = 0
                rader_uten = mrp_del(brutto, uten, lager, ss, ledetid, fremskynd=False)[0]
                if not any(rader_uten["Nettobehov"][u:]):
                    eks.append((vn, u + 1, "Kanseller mottak",
                                f"Det planlagte mottaket på {planlagt[u]} i uke {u + 1} trengs ikke i horisonten "
                                f"(uke {u + 1}–{h}). Vurder å kansellere eller utsette det."))
        eksepsjoner += sorted(eks, key=lambda e: 0 if e[1] == "–" else e[1])
        if detaljer is not None:
            detaljer[vn] = dict(del_=d, llk=llk[vn], rot=vn == rot, spor=spor, mottak=planlagt,
                                kilder=[(f, a) for f, b, a in kanter if b == vn])
    rang = {vn: i for i, vn in enumerate(rekkefolge)}
    eksepsjoner.sort(key=lambda e: rang[e[0]])  # stabil sortering: ukeordenen per del beholdes
    return {vn: tabeller[vn] for vn in rekkefolge}, eksepsjoner


# ---------- Produksjonskapasitet (PRD §4.9, FR-31–FR-33) ----------

KAP_RADER = ("Fra lager", "Med planlagte mottak")
KAP_AARSAK = {"lager": "For lite på lager og i planlagte mottak", "ledetid": "Ledetid: ordren måtte vært frigitt før uke 1"}


def kapasitet_mangler(n, uke, strukt, mottak, h):
    """Delene som ikke kan dekkes når behovet er n ferdigprodukter i uken (FR-31). Tom liste: behovet kan dekkes.

    Nettingen er MRP-beregningen (mrp_del) med ledig beholdning som lager, SS 0 og uten fremskynding. Deler uten
    underdeler kan ikke få planlagte ordremottak (årsak «lager»). Ferdigproduktet og deler som produseres selv kan
    det, men ikke med forfalt frigivelse (årsak «ledetid»). Den forfalte delen sendes ikke videre til underdelene,
    så bare delene som selv mangler, regnes som begrensende (FR-33).
    """
    deler, rekkefolge, kanter, llk, _kum, rot = strukt
    har_underdeler = {f for f, _b, _a in kanter}
    frig, mangler = {}, []
    for vn in sorted(deler, key=lambda v: (llk[v], rekkefolge.index(v))):
        d = deler[vn]
        if vn == rot:
            brutto = [n if t == uke - 1 else 0 for t in range(h)]
        else:
            brutto = [sum(a * frig[f][t] for f, b, a in kanter if b == vn) for t in range(h)]
        planlagt = [0] * h
        for mvn, mu, antall in mottak:
            if mvn == vn and 1 <= mu <= h:
                planlagt[mu - 1] += antall
        ledig = max(0, d["lager"] - d["ss"])
        rader, _fr, forfalte, _sp = mrp_del(brutto, planlagt, ledig, 0, d["ledetid"], fremskynd=False)
        frigivelse = list(rader["Planlagte ordrefrigivelser"])
        if vn not in har_underdeler:
            if any(rader["Planlagte ordremottak"]):
                mangler.append((vn, "lager"))
        elif forfalte:
            mangler.append((vn, "ledetid"))
            frigivelse[0] -= sum(f["antall"] for f in forfalte)
        frig[vn] = frigivelse
    rang = {vn: i for i, vn in enumerate(rekkefolge)}
    return sorted(mangler, key=lambda m: rang[m[0]])


def kapasitet(stykkliste, mottak, h):
    """Kapasitet per uke på to rader (FR-32), med begrensende deler for N + 1 (FR-33).

    Gir {rad: (kapasitet per uke, begrensende deler per uke)}. Svaret er monotont i N, så dobling og binærsøk virker.
    """
    strukt = struktur(stykkliste)
    ut = {}
    for rad, mot in zip(KAP_RADER, ([], mottak)):
        verdier, begrensende = [], []
        for uke in range(1, h + 1):
            kan = lambda n: not kapasitet_mangler(n, uke, strukt, mot, h)
            lav, hoy = 0, 1
            while kan(hoy):
                lav, hoy = hoy, hoy * 2
                assert hoy < 10 ** 9, "Kapasiteten er ubegrenset (ingen del begrenser)"
            while hoy - lav > 1:
                midt = (lav + hoy) // 2
                lav, hoy = (midt, hoy) if kan(midt) else (lav, midt)
            verdier.append(lav)
            begrensende.append(kapasitet_mangler(lav + 1, uke, strukt, mot, h))
        ut[rad] = (verdier, begrensende)
    return ut


# ---------- Hjelpefunksjoner for formatering ----------

def hode(ws, rad, verdier, kol=1):
    for i, v in enumerate(verdier):
        c = ws.cell(rad, kol + i, v)
        c.font, c.fill, c.border = FONT_HVIT, FYLL_HODE, RAMME
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)


def celle(ws, rad, kol, verdi=None, fyll=None, fet=False):
    c = ws.cell(rad, kol, verdi)
    c.font = FONT_FET if fet else FONT
    c.border = RAMME
    if fyll:
        c.fill = fyll
    return c


def bredder(ws, bredder_):
    for bokstav, b in bredder_.items():
        ws.column_dimensions[bokstav].width = b


def heltall_validering(ws, omraade, minimum=0):
    dv = DataValidation(type="whole", operator="greaterThanOrEqual", formula1=str(minimum), allow_blank=True,
                        showErrorMessage=True, errorTitle="Ugyldig verdi",
                        error=f"Skriv et heltall større enn eller lik {minimum}.")
    ws.add_data_validation(dv)
    dv.add(omraade)


def tekstblokk(ws, start, linjer, kol=1):
    r = start
    for linje in linjer:
        c = ws.cell(r, kol, linje)
        c.font = FONT_FET if linje.endswith(":") else FONT
        c.alignment = Alignment(wrap_text=True, vertical="top")
        r += 1
    return r


# ---------- Malen (inndatafilen brukeren laster opp) ----------

PROGNOSE = "MPS"
PROGNOSE_REF = f"'{PROGNOSE}'"
PROGNOSE_START = 8    # uker som vises før brukeren har fylt ut noe
MOTTAK_RADER = 200
STYKK_RADER = 1000    # én rad per del; samme del kan stå flere steder i stykklisten
FONT_LENKE = Font(name="Arial", size=10, color="0563C1", underline="single")
FONT_SKJULT = Font(name="Arial", size=10, color="FFFFFF")
FONT_KOMMER = Font(name="Arial", size=10, italic=True, color="808080")
FONT_ROD = Font(name="Arial", size=10, color="C00000")
# Fyll i betinget formatering må ha både start- og sluttfarge for å vises riktig i Excel
AKTIV_RAD = dict(fill=PatternFill("solid", start_color="FFF2CC", end_color="FFF2CC"),
                 border=RAMME, font=Font(color="000000"))
UTFYLT = dict(fill=PatternFill("solid", start_color="FFFFFF", end_color="FFFFFF"), border=RAMME)
GRAA = dict(fill=PatternFill("solid", start_color="E7E6E6", end_color="E7E6E6"), border=RAMME)


def lenke(ws, ref, tekst, ark, celle_="A1"):
    c = ws[ref]
    c.value = tekst
    c.hyperlink = Hyperlink(ref=ref, location=f"'{ark}'!{celle_}", display=tekst)
    c.font = FONT_LENKE
    c.alignment = Alignment(vertical="top")
    return c


def tilbake_lenke(ws, ref):
    lenke(ws, ref, "← Til veiledning", "Veiledning")


def hvit_naar_utfylt(ws, omraade):
    """Gule celler blir hvite når de er fylt ut. Må legges til før vis_rad_naar, så den vinner."""
    topp = omraade.split(":")[0]
    ws.conditional_formatting.add(omraade, FormulaRule(formula=[f"NOT(ISBLANK({topp}))"],
                                                       stopIfTrue=True, **UTFYLT))


def vis_rad_naar(ws, omraade, formel, gul=True):
    """Rader i området blir gule med ramme når formelen er sann, ellers ser de blanke ut."""
    stil = AKTIV_RAD if gul else {k: v for k, v in AKTIV_RAD.items() if k != "fill"}
    ws.conditional_formatting.add(omraade, FormulaRule(formula=[formel], **stil))


def graa_naar(ws, omraade, formel):
    """Celler som skal stå tomme blir grå. Må legges til før vis_rad_naar, så den vinner."""
    ws.conditional_formatting.add(omraade, FormulaRule(formula=[formel], stopIfTrue=True, **GRAA))


def regel_validering(ws, omraade, formel, feil):
    dv = DataValidation(type="custom", formula1=formel, allow_blank=True,
                        showErrorMessage=True, errorTitle="Ugyldig verdi", error=feil)
    ws.add_data_validation(dv)
    dv.add(omraade)


def tekstrader(ws, start, rader, sluttkol=7):
    """Skriver rader med (lenke/etikett i kolonne A, tekst i B–sluttkol).

    Etiketten er enten None, en tekst eller (tekst, arknavn) for lenke til arket.
    """
    r = start
    for etikett, tekst in rader:
        if isinstance(etikett, tuple):
            lenke(ws, f"A{r}", *etikett)
        elif etikett:
            c = ws.cell(r, 1, etikett)
            c.font = FONT_FET
            c.alignment = Alignment(vertical="top")
        c = ws.cell(r, 2, tekst)
        c.font = FONT_KOMMER if str(tekst).startswith("Kommer:") else FONT
        c.alignment = Alignment(wrap_text=True, vertical="top")
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=sluttkol)
        ws.row_dimensions[r].height = 15 * (len(str(tekst or "")) // 85 + 1)
        r += 1
    return r


def overskrift(ws, rad, tekst):
    ws.cell(rad, 1, tekst).font = FONT_FET
    return rad + 1


def kontroll(n):
    """Formel for Kontroll-kolonnen i Stykkliste: hva som mangler eller ikke stemmer i rad n."""
    p, nx = n - 1, n + 1
    forste = f"COUNTIF($B$1:$B{p},$B{n})=0"
    typer = "{" + ",".join(f'"{t}"' for t in TYPER) + "}"
    if n == 2:
        nivaregel = [f'IF(AND($A{n}<>"",$A{n}&""<>"0"),"Første rad må være nivå 0. ","")']
    else:
        nivaregel = [
            f'IF($A{n}&""="0","Bare første rad kan være nivå 0. ","")',
            f'IF(AND($A{n}&""="..2",$A{p}&""<>".1",$A{p}&""<>"..2"),"Nivå ..2 må stå rett under .1 eller ..2. ","")',
        ]
    deler = [
        f'IF($A{n}="","Mangler nivå. ","")',
        # Innlimte verdier omgår nedtrekkslistene, så verdiene kontrolleres også her
        f'IF(AND($A{n}<>"",ISNA(MATCH($A{n}&"",$Z$2:$Z$4,0))),"Ugyldig nivå, velg 0, .1 eller ..2. ","")',
        *nivaregel,
        f'IF($B{n}="","Mangler varenummer. ","")',
        f'IF($C{n}="","Mangler beskrivelse. ","")',
        f'IF(AND($A{n}<>"",$A{n}&""<>"0",$D{n}=""),"Mangler antall. ","")',
        f'IF($E{n}="","Mangler type. ","")',
        f'IF(AND($E{n}<>"",ISNA(MATCH($E{n},{typer},0))),"Ugyldig type, velg fra listen. ","")',
        f'IF(AND($B{n}<>"",{forste},COUNT($F{n}:$H{n})<3),"Mangler lager, sikkerhetslager eller ledetid. ","")',
        f'IF(AND($B{n}<>"",NOT({forste}),COUNTIFS($B$1:$B{p},$B{n},$C$1:$C{p},$C{n})=0),'
        f'"Annen beskrivelse enn første gang varenummeret står. ","")',
        f'IF(AND($B{n}<>"",NOT({forste}),COUNTIFS($B$1:$B{p},$B{n},$E$1:$E{p},$E{n})=0),'
        f'"Annen type enn første gang varenummeret står. ","")',
        # Nivåene er 0, .1 og ..2, så lengre tekst betyr lavere nivå
        f'IF(AND(ISNUMBER(SEARCH("Kjøpes inn",$E{n})),ISNUMBER(MATCH($A{n}&"",$Z$2:$Z$4,0)),$A{nx}<>"",'
        f'LEN($A{nx})>LEN($A{n})),'
        f'"Har underkomponenter, men kjøpes inn. ","")',
        f'IF(AND($A{n}&""="0",$E{n}<>"",$E{n}<>"Ferdigvare"),"Nivå 0 skal ha type Ferdigvare. ","")',
        f'IF(AND($A{n}<>"",$A{n}&""<>"0",$E{n}="Ferdigvare"),"Ferdigvare brukes bare på nivå 0. ","")',
        underdeler(n),
    ]
    return f'=IF(COUNTA($A{n}:$H{n})=0,"",' + "&".join(deler) + ")"


def underdeler(n):
    """Del av Kontroll-formelen: underdelene i rad n skal være like dem under første forekomst av delen over (FR-3).

    Bruker de skjulte hjelpekolonnene AC (overordnet varenummer for en ..2-rad) og AD (raden til nærmeste .1 over).
    Første blokk er blokken til første ..2-rad med samme overordnede del. En senere blokk er lik hvis den har like mange
    rader og hver rad (varenummer, antall) står like mange ganger i begge blokkene, så rekkefølgen spiller ingen rolle.
    """
    s = STYKK_RADER + 1
    ac, ad, b, d = (f"${k}$2:${k}${s}" for k in ("AC", "AD", "B", "D"))
    forste = f"INDEX({ad},MATCH($AC{n},{ac},0))"
    like_rader = (f"COUNTIFS({ac},$AC{n},{ad},$AD{n},{b},$B{n},{d},$D{n})"
                  f"<>COUNTIFS({ac},$AC{n},{ad},{forste},{b},$B{n},{d},$D{n})")
    like_mange = f"COUNTIFS({ac},$AC{n},{ad},$AD{n})<>COUNTIFS({ac},$AC{n},{ad},{forste})"
    return (f'IF($AC{n}="","",IF($AD{n}={forste},"",IF(OR({like_rader},{like_mange}),'
            f'"Andre underdeler under "&$AC{n}&" enn første gang (rad "&{forste}&"). ","")))')


def lag_mal(mps=None, stykkliste=None, mottak=None):
    wb = Workbook()
    eksempel = mps is not None

    # Veiledning
    ws = wb.active
    ws.title = "Veiledning"
    ws.sheet_view.showGridLines = False
    ws["A1"] = "COSI - MRP: Excel-mal for inndata"
    ws["A1"].font = FONT_TITTEL
    r = overskrift(ws, 3, "Slik fyller du ut malen (klikk på arknavnet for å gå dit):")
    r = tekstrader(ws, r, [
        ("Generelt", "Fyll kun ut gule celler. En celle blir hvit når den er fylt ut, og grå celler skal stå tomme. "
                     "Ikke endre arknavn, kolonneoverskrifter eller rekkefølge. Nye rader blir gule etter hvert som "
                     "du fyller ut."),
        (("Stykkliste", "Stykkliste"), "Ferdigproduktet og alle delene det består av, med lagerstatus, "
                                       "sikkerhetslager og ledetid. Én rad per del, ovenfra og ned. Nivå 0 er "
                                       "ferdigproduktet (første rad, ett produkt per fil). Nivå .1 er "
                                       "hovedkomponentene, f.eks. sete, rygg og armlene. Nivå ..2 er delene som "
                                       "trengs for å bygge hovedkomponenten rett over. Neste rad kommer frem når "
                                       "nivå og varenummer i raden over er fylt ut."),
        ((PROGNOSE, PROGNOSE), "Antall ferdigprodukter per uke. Fyll ut fra uke 1 og sammenhengende fremover. "
                               f"De {PROGNOSE_START} første ukene vises fra start, og neste uke kommer frem når "
                               f"alle ukene over er fylt ut. Horisonten er antall utfylte uker (8–{MAKS_UKER})."),
        (("Planlagte mottak", "Planlagte mottak"), "Bestillinger som allerede er lagt hos leverandør, og "
                                                   "produksjonsordrer som allerede er startet. Én rad per "
                                                   "mottak. Varenummer velges fra en liste som henter "
                                                   "varenumrene fra Stykkliste og oppdateres av seg selv. "
                                                   "Neste rad kommer frem når raden over er fylt ut. Arket "
                                                   "kan stå tomt hvis det ikke finnes planlagte mottak."),
        (("Veien videre", "Veien videre"), "Hva du gjør når malen er ferdig utfylt."),
    ], sluttkol=8)
    r = overskrift(ws, r + 1, "Regler for nivåer i stykklisten:")
    r = tekstrader(ws, r, [
        (None, "Velg nivå fra nedtrekkslisten. Første rad må være 0, og det kan bare være ett nivå 0."),
        (None, "Nivå .1 kan bare brukes når nivå 0 er lagt inn. Nivå ..2 kan bare brukes rett under en .1 "
               "eller en annen ..2."),
        (None, "Du kan gå opp igjen fra ..2 til .1 når delene til en hovedkomponent er lagt inn. En del på nivå "
               "..2 tilhører nærmeste .1 over seg."),
        (None, "Kolonnen «Kontroll» sier fra hvis en rad bryter reglene over."),
    ], sluttkol=8)
    r = overskrift(ws, r + 1, "Regler for nedtrekkslister:")
    r = tekstrader(ws, r, [
        (None, "Ikke lim inn data i celler med nedtrekksliste: Nivå og Type i Stykkliste og Varenummer i "
               "Planlagte mottak. Innliming fjerner listen og kontrollen av verdien i cellen. Velg verdien fra "
               "listen eller skriv den inn. Har du limt inn ved et uhell, angrer du med Ctrl+Z."),
    ], sluttkol=8)
    r = overskrift(ws, r + 1, "Regler for verdier:")
    r = tekstrader(ws, r, [
        (("Stykkliste", "Stykkliste"), "Samme del kan stå flere steder i stykklisten, f.eks. skruer. Den står "
                                       "da med samme varenummer, beskrivelse og type hver gang."),
        (("Stykkliste", "Stykkliste"), "Antall er hvor mange av delen som trengs per enhet av delen over, "
                                       "heltall ≥ 1. Antall fylles ikke ut for nivå 0."),
        (("Stykkliste", "Stykkliste"), "Type velges fra listen: " + ", ".join(TYPER) + ". Ferdigvare brukes "
                                       "bare på nivå 0. En del med underkomponenter kan ikke være en type som "
                                       "kjøpes inn."),
        (("Stykkliste", "Stykkliste"), "Lagerbeholdning (ved starten av uke 1) og sikkerhetslager er heltall ≥ 0. "
                                       "Ledetid er hele uker: innkjøpstid for deler som kjøpes inn og "
                                       "produksjonstid for deler som produseres selv, heltall ≥ 1 (0 er lov for "
                                       "ferdigvaren). De tre fylles "
                                       "bare ut første gang et varenummer står i stykklisten."),
        (("Stykkliste", "Stykkliste"), "Kolonnen «Kontroll» viser hva som mangler eller ikke stemmer i hver rad, "
                                       "bl.a. brudd på reglene for nivåer og verdier som ikke finnes i "
                                       "nedtrekkslistene. Den skal være tom når stykklisten er ferdig."),
        ((PROGNOSE, PROGNOSE), "Antall ferdigprodukter er heltall ≥ 0."),
        (("Planlagte mottak", "Planlagte mottak"), "Varenummer velges fra listen. Uke må ligge innenfor "
                                                   "horisonten (1 til siste utfylte uke)."),
    ], sluttkol=8)
    r = overskrift(ws, r + 1, "Forslag til varenummer:")
    r = tekstrader(ws, r, [
        (None, "Tre siffer for varegruppe, bindestrek og tre siffer løpenummer, f.eks. 300-002. 100 = "
               "ferdigvarer, 200 = komponenter som produseres selv, 300 = komponenter som kjøpes inn. Nummeret sier ikke noe om nivå, "
               "slik at samme del kan brukes flere steder og flyttes i stykklisten uten å få nytt nummer. "
               "Bindestreken gjør at Excel lagrer nummeret som tekst."),
    ], sluttkol=8)
    r = overskrift(ws, r + 1, "Eksempel (grønn = kun eksempel, skal ikke kopieres inn). "
                              "Skruesettet brukes både i setet og i ryggen:")
    hode(ws, r, STYKK_KOLONNER)
    ws.row_dimensions[r].height = 30
    for j, rad in enumerate(EKSEMPEL_STYKKLISTE):
        for i, v in enumerate(rad):
            celle(ws, r + 1 + j, i + 1, v, FYLL_EKSEMPEL)
    bredder(ws, {"A": 22, "B": 14, "C": 18, "D": 10, "E": 26, "F": 16, "G": 16, "H": 12})

    # Stykkliste: én rad per del ovenfra og ned. Neste rad vises når nivå og varenummer i raden over er
    # fylt ut (overskriftsraden teller som utfylt, så rad 2 vises fra start)
    ws = wb.create_sheet("Stykkliste")
    ws.sheet_view.showGridLines = False
    hode(ws, 1, STYKK_KOLONNER)
    siste = STYKK_RADER + 1
    for i in range(STYKK_RADER):
        n = i + 2
        rad = stykkliste[i] if eksempel and i < len(stykkliste) else [None] * len(STYKK_KOLONNER)
        for k, v in enumerate(rad):
            ws.cell(n, k + 1, v).font = FONT
        ws.cell(n, 1).number_format = "@"  # ellers gjør Excel .1 om til tallet 0,1
        ws.cell(n, 10, kontroll(n)).font = FONT_ROD
        # Varenummerlisten til Planlagte mottak (skjulte kolonner): AA nummererer første forekomst av hvert
        # varenummer, AB henter varenumrene i den rekkefølgen
        ws.cell(n, 27, f'=IF(AND($B{n}<>"",COUNTIF($B$2:$B{n},$B{n})=1),MAX($AA$1:$AA{n - 1})+1,"")')
        ws.cell(n, 28, f'=IFERROR(INDEX($B$2:$B${siste},MATCH(ROW()-1,$AA$2:$AA${siste},0)),"")')
        # Hjelpekolonner for underdelskontrollen: AD er raden til nærmeste .1 over (eller raden selv),
        # AC er varenummeret til den overordnede delen for en ..2-rad
        ws.cell(n, 30, f'=IF($A{n}&""=".1",ROW(),' + ('""' if n == 2 else f'IF($A{n}&""="0","",$AD{n - 1})') + ")")
        ws.cell(n, 29, f'=IF(AND($A{n}&""="..2",N($AD{n})>0),INDEX($B:$B,$AD{n}),"")')
    forrige_fylt = "COUNTA($A1:$B1)=2"
    forste = "COUNTIF($B$1:$B1,$B2)=0"
    hvit_naar_utfylt(ws, f"A2:H{siste}")
    graa_naar(ws, f"D2:D{siste}", '$A2&""="0"')
    graa_naar(ws, f"F2:H{siste}", f'AND($B2<>"",NOT({forste}))')
    vis_rad_naar(ws, f"A2:H{siste}", forrige_fylt)
    # Nivålisten ligger i en skjult kolonne. Rad 2 kan bare være 0, raden rett under 0 bare .1
    for n, niva in enumerate(NIVAER, start=2):
        ws.cell(n, 26, niva).number_format = "@"
    for kol in ["Z", "AA", "AB", "AC", "AD"]:
        ws.column_dimensions[kol].hidden = True
    # Navnet Varenumre er så langt som antall ulike varenumre, så listen vokser når stykklisten fylles ut
    wb.defined_names["Varenumre"] = DefinedName(
        "Varenumre", attr_text=f"OFFSET(Stykkliste!$AB$2,0,0,MAX(1,MAX(Stykkliste!$AA$2:$AA${siste})),1)")
    dv = DataValidation(type="list", formula1='IF(ROW()=2,$Z$2,IF($A1&""="0",$Z$3,$Z$3:$Z$4))',
                        allow_blank=True, showErrorMessage=True, errorTitle="Ugyldig nivå",
                        error="Velg nivå fra listen. Første rad er nivå 0 (ferdigproduktet). Nivå .1 krever at "
                              "nivå 0 er lagt inn, og ..2 må stå rett under en .1 eller en annen ..2.")
    ws.add_data_validation(dv)
    dv.add(f"A2:A{siste}")
    regel_validering(ws, f"B2:B{siste}", f'AND({forrige_fylt},$A2<>"")',
                     "Fyll ut nivå og varenummer i raden over først, og velg nivå i denne raden.")
    regel_validering(ws, f"C2:C{siste}", forrige_fylt, "Fyll ut nivå og varenummer i raden over først.")
    regel_validering(ws, f"D2:D{siste}", f'AND({forrige_fylt},$A2&""<>"0",D2=INT(D2),D2>=1)',
                     "Antall fylles ikke ut for nivå 0 (ferdigproduktet). Ellers må antall være et heltall "
                     "større enn eller lik 1.")
    dv = DataValidation(type="list", formula1='"' + ",".join(TYPER) + '"', allow_blank=True,
                        showErrorMessage=True, errorTitle="Ugyldig type", error="Velg type fra listen.")
    ws.add_data_validation(dv)
    dv.add(f"E2:E{siste}")
    regel_validering(ws, f"F2:G{siste}", f"AND({forrige_fylt},{forste},F2=INT(F2),F2>=0)",
                     "Fylles bare ut første gang varenummeret står i stykklisten. Verdien må være et heltall "
                     "større enn eller lik 0.")
    regel_validering(ws, f"H2:H{siste}", f'AND({forrige_fylt},{forste},H2=INT(H2),H2>=IF($A2&""="0",0,1))',
                     "Fylles bare ut første gang varenummeret står i stykklisten. Ledetid må være et heltall "
                     "større enn eller lik 1 (0 er lov for ferdigproduktet).")
    bredder(ws, {"A": 8, "B": 13, "C": 24, "D": 9, "E": 26, "F": 15, "G": 15, "H": 11, "I": 4, "J": 50,
                 "K": 4, "L": 18})
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = "A2"
    ws["J1"] = "Kontroll"
    ws["J1"].font = FONT_FET
    ws["J1"].alignment = Alignment(vertical="center")
    tilbake_lenke(ws, "L1")

    # MPS
    ws = wb.create_sheet(PROGNOSE)
    ws.sheet_view.showGridLines = False
    hode(ws, 1, ["Uke", "Antall ferdigprodukter"])
    for u in range(1, MAKS_UKER + 1):
        verdi = mps[u - 1] if eksempel and u <= len(mps) else None
        if u <= PROGNOSE_START:
            celle(ws, u + 1, 1, u, fet=True)
            celle(ws, u + 1, 2, verdi, FYLL_INPUT)
        else:
            ws.cell(u + 1, 1, u).font = FONT_SKJULT
            ws.cell(u + 1, 2, verdi).font = FONT
        ws.cell(u + 1, 1).alignment = Alignment(horizontal="center")
    forste_skjulte = PROGNOSE_START + 2
    # Uke u vises når alle ukene over er fylt ut
    vis = f"COUNT($B$1:$B{forste_skjulte - 1})=ROW()-2"
    hvit_naar_utfylt(ws, f"B2:B{MAKS_UKER + 1}")
    vis_rad_naar(ws, f"A{forste_skjulte}:A{MAKS_UKER + 1}", vis, gul=False)
    vis_rad_naar(ws, f"B{forste_skjulte}:B{MAKS_UKER + 1}", vis)
    heltall_validering(ws, f"B2:B{forste_skjulte - 1}")
    regel_validering(ws, f"B{forste_skjulte}:B{MAKS_UKER + 1}",
                     f"AND(COUNT($B$1:$B{forste_skjulte - 1})=ROW()-2,"
                     f"B{forste_skjulte}=INT(B{forste_skjulte}),B{forste_skjulte}>=0)",
                     "Fyll ut alle ukene over først. Verdien må være et heltall større enn eller lik 0.")
    bredder(ws, {"A": 8, "B": 24, "C": 4, "D": 18})
    ws.freeze_panes = "A2"
    tilbake_lenke(ws, "D1")

    # Planlagte mottak: neste rad vises når raden over er fylt ut (overskriftsraden teller som utfylt)
    ws = wb.create_sheet("Planlagte mottak")
    ws.sheet_view.showGridLines = False
    hode(ws, 1, ["Varenummer", "Uke", "Antall"])
    siste = MOTTAK_RADER + 1
    for i in range(MOTTAK_RADER):
        rad = mottak[i] if eksempel and i < len(mottak) else [None] * 3
        for k, v in enumerate(rad):
            if i == 0:
                celle(ws, 2, k + 1, v, FYLL_INPUT)
            else:
                ws.cell(i + 2, k + 1, v).font = FONT
    hvit_naar_utfylt(ws, f"A2:C{siste}")
    vis_rad_naar(ws, f"A3:C{siste}", "COUNTA($A2:$C2)=3")
    forrige_fylt = "COUNTA($A1:$C1)=3"
    horisont = f"COUNT({PROGNOSE_REF}!$B$2:$B${MAKS_UKER + 1})"
    dv = DataValidation(type="list", formula1="Varenumre", allow_blank=True, showErrorMessage=True,
                        errorTitle="Ugyldig varenummer", error="Velg et varenummer fra listen. Listen viser "
                                                               "varenumrene i arket Stykkliste.")
    ws.add_data_validation(dv)
    dv.add(f"A2:A{siste}")
    regel_validering(ws, f"B2:B{siste}", f"AND({forrige_fylt},B2=INT(B2),B2>=1,B2<={horisont})",
                     "Fyll ut raden over først. Uke må være et heltall fra 1 til siste utfylte uke "
                     f"i {PROGNOSE}.")
    regel_validering(ws, f"C2:C{siste}", f"AND({forrige_fylt},C2=INT(C2),C2>=1)",
                     "Fyll ut raden over først. Antall må være et heltall større enn eller lik 1.")
    bredder(ws, {"A": 14, "B": 8, "C": 10, "D": 4, "E": 18})
    ws.freeze_panes = "A2"
    tilbake_lenke(ws, "E1")

    # Veien videre: skjelett som fylles ut etter hvert som appen utvikles
    ws = wb.create_sheet("Veien videre")
    ws.sheet_view.showGridLines = False
    ws["A1"] = "Veien videre: når malen er ferdig utfylt"
    ws["A1"].font = FONT_TITTEL
    tilbake_lenke(ws, "A2")
    c = ws.cell(3, 1, "Utkast. Denne veiledningen bygges ut etter hvert som appen utvikles. "
                      "Grå tekst merket «Kommer:» er ikke bestemt ennå.")
    c.font = FONT_KOMMER
    r = overskrift(ws, 5, "Steg for steg:")
    r = tekstrader(ws, r, [
        ("1. Kontroller", "Se over at alle gule celler er fylt ut, at kolonnen Kontroll i Stykkliste er tom, og at "
                          "ukene i MPS er sammenhengende fra uke 1."),
        ("2. Lagre", "Lagre filen som .xlsx. Filnavnet kan du velge selv, men arknavnene må ikke endres."),
        ("3. Last opp", "Last opp filen i COSI - MRP."),
        (None, "Kommer: lenke til appen og hvordan opplastingen gjøres."),
        ("4. Rett feil", "Appen kontrollerer at nødvendige felt og verdier er fylt ut før beregningen starter. "
                         "Rett eventuelle feil i malen og last opp på nytt."),
        (None, "Kommer: oversikt over feilmeldinger og hvordan de rettes."),
        ("5. Les resultatet", "Resultatet vises i en tabell per uke og komponent: bruttobehov, planlagte mottak, "
                              "forventet lagerbeholdning, nettobehov, planlagte ordremottak og planlagte "
                              "ordrefrigivelser. Komponenter med minst ett varsel er markert som kritiske."),
        (None, "Kommer: skisse av resultattabellen og forklaring av fremhevingene."),
        ("6. Håndter varsler", "Hvert varsel gjelder en uke og en komponent (eller hele komponenten):"),
        (None, "• Bruk av sikkerhetslager: lageret går under sikkerhetslageret før ny leveranse kan komme inn."),
        (None, "• Bestilling forsinket: behovet kan ikke dekkes i tide, og leveransen blir forsinket (til kunden "
                "for ferdigproduktet, eller til produksjonen av delen over i stykklisten)."),
        (None, "• Mottak forsinket: et planlagt mottak kommer senere enn behovet og bør fremskyndes."),
        (None, "• Ledetid overskrider horisont: ledetiden er like lang som eller lengre enn horisonten."),
        (None, "Kommer: anbefalte tiltak for hvert varsel."),
        ("7. Ved endringer", "Endres noe i planen, oppdaterer du malen og laster den opp på nytt. Appen viser da "
                             "hva som er nytt, endret eller fjernet sammenlignet med forrige kjøring."),
        (None, "Kommer: hvordan før/etter-sammenligningen leses."),
    ])
    bredder(ws, {"A": 22, "B": 14, "C": 16, "D": 16, "E": 16, "F": 16, "G": 10})
    return wb


# ---------- Fasit ----------

REGLER = [
    "Beregningsregler (PRD §4.2–4.3, oppdatert 2026-11-02):",
    "Notasjon: uke t = 1..H, lager før uke 1 = lagerbeholdning, SS = sikkerhetslager, L = ledetid.",
    "Beregningen gjøres nivå for nivå ovenfra og ned, og hver del beregnes én gang på sin lavnivåkode (FR-28). "
    "Lager, SS og ledetid hentes fra første rad med varenummeret.",
    "1. Bruttobehov(t): for ferdigproduktet MPS(t). For en del summen av planlagt ordrefrigivelse(t) for hver overordnet del "
    "× antall på raden.",
    "2. Disponibel(t) = forventet lager(t−1) + planlagte mottak(t) − bruttobehov(t).",
    "3. Nettobehov(t) = maks(0, SS − disponibel(t)). Er nettobehovet > 0 og finnes det planlagte mottak i senere uker, "
    "fremskyndes det første senere mottaket i sin helhet til uke t, og disponibel og nettobehov regnes på nytt. "
    "Slik fortsetter det til nettobehovet er 0 eller det ikke finnes flere senere mottak. "
    "Raden Planlagte mottak viser mottaket i uken det er lagt inn, og forventet lagerbeholdning er uten mottaket "
    "til det kommer. Lageret kan da ligge under SS i ukene før et mottak som må fremskyndes.",
    "4. Lot-for-lot: planlagt ordremottak(t) = nettobehov(t).",
    "5. Forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t) − fremskyndede mottak som ikke er kommet ennå.",
    "6. Planlagt ordrefrigivelse i uke t − L. Hvis t − L < 1 er frigivelsen forfalt og legges i uke 1 (må frigis straks), "
    "sammen med eventuelle ordinære frigivelser for uke 1. Eksepsjonsmeldingen oppgir hvor mye av uke 1 som er forfalt.",
    "7. Et forfalt planlagt ordremottak vises likevel i uke t, der behovet er, selv om det fysisk kommer tidligst i uke 1 + L. "
    "Forventet lagerbeholdning forutsetter altså at behovet dekkes i tide. Avviket varsles med eksepsjonen "
    "«Bestilling forsinket» eller «Bruk av sikkerhetslager».",
    "",
    "Eksepsjoner (fem typer, alle nivåer):",
    "• Ledetid overskrider horisont: ledetid fra ferdigproduktet ≥ H, dvs. største sum av L langs en sti fra ferdigproduktet "
    "ned til og med delen. Gjelder delen (uke «–»), uavhengig av behov og lager: planen er for kort til å vise behov "
    "som må bestilles nå.",
    "• Bestilling forsinket: nettobehov(t) > 0, frigivelsen er forfalt (t − L < 1) og disponibel(t) < 0. "
    "Leveransen til kunde (ferdigproduktet og delene rett under) eller produksjonen av den overordnede delen blir forsinket.",
    "• Bruk av sikkerhetslager: nettobehov(t) > 0, frigivelsen er forfalt (t − L < 1) og 0 ≤ disponibel(t) < SS. "
    "Lageret tærer på sikkerhetslageret før ny leveranse kan komme inn.",
    "• Mottak forsinket: et planlagt mottak er fremskyndet til uke t (regel 3). Én eksepsjon per mottak, i uke t. "
    "Det lages ikke bestillingsforslag for den delen av behovet mottaket dekker.",
    "• Kanseller mottak: delen får ikke noe nettobehov fra mottaksuken til og med uke H når mottaket tas bort "
    "(og ingen andre mottak fremskyndes). Eksepsjonen står i mottaksuken. Fremskyndede mottak får den ikke.",
    "• En celle kan ha flere eksepsjoner. En del med minst én eksepsjon er kritisk.",
]


def neg(x):
    return f"({x})" if x < 0 else str(x)


def beregningsrekkefolge(tabeller, detaljer):
    rekke = list(tabeller)
    return sorted(detaljer, key=lambda v: (detaljer[v]["llk"], rekke.index(v)))


def utregning(tabeller, eks, detaljer):
    """Tekstlinjer for arket Utregning: hver del i beregningsrekkefølge, uke for uke etter reglene i arket Regler."""
    linjer = []
    for vn in beregningsrekkefolge(tabeller, detaljer):
        x = detaljer[vn]
        d = x["del_"]
        if x["rot"]:
            kilde = "Bruttobehov fra MPS."
        else:
            kilde = "Bruttobehov fra frigivelsene til " + " + ".join(f"{f} × {a}" for f, a in x["kilder"]) + "."
        mottak = [f"uke {u}: {m}" for u, m in enumerate(x["mottak"], start=1) if m]
        linjer.append(("del", f"{vn} {d['beskrivelse']} – lavnivåkode {x['llk']}, {d['type']}. Lager {d['lager']}, "
                              f"SS {d['ss']}, L {d['ledetid']}. {kilde}"
                              + (f" Planlagte mottak: {', '.join(mottak)}." if mottak else "")))
        ss = d["ss"]
        flyttet_fra = {f["fra"]: u for u, st in enumerate(x["spor"], start=1) for f in st["flytt"]}
        for t, st in enumerate(x["spor"]):
            uke = t + 1
            if x["rot"]:
                b = f"Bruttobehov = MPS = {st['brutto']}."
            else:
                ledd = " + ".join(f"{a} × {tabeller[f]['Planlagte ordrefrigivelser'][t]} ({f})" for f, a in x["kilder"])
                b = f"Bruttobehov = {ledd} = {st['brutto']}."
            disp = f"Disponibel = {neg(st['forrige'])} + {st['mottak']} − {st['brutto']} = {st['disponibel']}"
            if uke in flyttet_fra:
                disp += f" (mottaket i uke {uke} er regnet med i uke {flyttet_fra[uke]})"
            tekst = [b, disp + ".", f"Nettobehov = maks(0, {ss} − {neg(st['disponibel'])}) = {st['nb']}."]
            for f in st["flytt"]:
                tekst.append(f"Mottaket på {f['antall']} i uke {f['fra']} fremskyndes: disponibel = {f['disponibel']}, "
                             f"nettobehov = maks(0, {ss} − {neg(f['disponibel'])}) = {f['nb']}.")
            if st["ordremottak"]:
                tekst.append(f"Planlagt ordremottak = {st['ordremottak']}.")
            tekst.append(f"Forventet lager = {neg(st['slutt'] - st['ordremottak'])} + {st['ordremottak']} = {st['slutt']}.")
            if st["vist"] != st["slutt"]:
                tekst.append(f"Tabellen viser {st['vist']}, fordi det fremskyndede mottaket ikke er kommet ennå.")
            if st["frigi_uke"] is not None:
                fu = st["frigi_uke"]
                tekst.append(f"Frigis i uke {uke} − {d['ledetid']} = {fu}"
                             + (", før horisonten: forfalt, legges i uke 1." if fu < 1 else "."))
            linjer.append(("uke", f"Uke {uke}: " + " ".join(tekst)))
        frig = [f"uke {u}: {v}" for u, v in enumerate(tabeller[vn]["Planlagte ordrefrigivelser"], start=1) if v]
        linjer.append(("sum", "Planlagte ordrefrigivelser: " + ", ".join(frig) + "." if frig
                       else "Ingen planlagte ordrefrigivelser."))
        for e in eks:
            if e[0] == vn:
                linjer.append(("eks", f"Eksepsjon, uke {e[1]}: {e[2]}. {e[3]}"))
    return linjer


def bestillingsforslag(tabeller, detaljer):
    """Bestillingsforslagene (FR-17): én linje per planlagt ordrefrigivelse > 0, sortert etter uke og stykkliste.

    Gir (varenummer, beskrivelse, uke, mengde, art, forfalt mengde). Forfalt mengde er den delen av frigivelsen i uke 1
    som skulle vært frigitt før horisonten.
    """
    linjer = []
    rekke = list(tabeller)
    for vn, rader in tabeller.items():
        d = detaljer[vn]["del_"]
        art = "Innkjøp" if d["type"] == KJOPT else "Produksjonsordre"
        forfalt = sum(st["ordremottak"] for st in detaljer[vn]["spor"]
                      if st["frigi_uke"] is not None and st["frigi_uke"] < 1)
        for u, q in enumerate(rader["Planlagte ordrefrigivelser"], start=1):
            if q:
                linjer.append((vn, d["beskrivelse"], u, q, art, forfalt if u == 1 else 0))
    return sorted(linjer, key=lambda x: (x[2], rekke.index(x[0])))


def sammenligning(for_, etter):
    """Før/etter-sammenligning (FR-20) mellom to kjøringer, hver gitt som (tabeller, eksepsjoner, detaljer).

    Et bestillingsforslag er identifisert av varenummer og frigivelsesuke. Samme varenummer og uke med ny mengde er
    «Endret mengde». Flytter et forslag uke, vises det som «Fjernet» i den gamle uken og «Nytt» i den nye.
    En eksepsjon er identifisert av varenummer, uke og type. En endret melding alene er ingen endring.
    """
    def forslag(k):
        return {(x[0], x[2]): x for x in bestillingsforslag(k[0], k[2])}
    f1, f2 = forslag(for_), forslag(etter)
    rekke = list(etter[0]) + [v for v in for_[0] if v not in etter[0]]
    linjer = []
    for vn, u in sorted(set(f1) | set(f2), key=lambda k: (rekke.index(k[0]), k[1])):
        a, b = f1.get((vn, u)), f2.get((vn, u))
        if a and b and a[3] != b[3]:
            linjer.append(("Bestillingsforslag", "Endret mengde", vn, u, a[3], b[3], ""))
        elif a and not b:
            linjer.append(("Bestillingsforslag", "Fjernet", vn, u, a[3], None, ""))
        elif b and not a:
            linjer.append(("Bestillingsforslag", "Nytt", vn, u, None, b[3], ""))
    e1 = {e[:3]: e for e in for_[1]}
    e2 = {e[:3]: e for e in etter[1]}
    for k in sorted(set(e1) | set(e2), key=lambda k: (rekke.index(k[0]), 0 if k[1] == "–" else k[1])):
        if k in e1 and k not in e2:
            linjer.append(("Eksepsjon", "Borte", k[0], k[1], k[2], None, e1[k][3]))
        elif k in e2 and k not in e1:
            linjer.append(("Eksepsjon", "Ny", k[0], k[1], None, k[2], e2[k][3]))
    return linjer


def kjoring(mps, stykkliste, mottak):
    detaljer = {}
    tabeller, eks = beregn(mps, stykkliste, mottak, detaljer)
    return tabeller, eks, detaljer


def kapasitet_ark(wb, nr, produkt, mps, stykkliste, mottak, utregning):
    """Arket Kapasitet (FR-31–FR-34): kapasitet per uke på to rader, begrensende deler, grunnlag per del og håndregning."""
    h = len(mps)
    kap = kapasitet(stykkliste, mottak, h)
    deler, rekkefolge, kanter, _llk, _kum, _rot = struktur(stykkliste)
    ws = wb.create_sheet("Kapasitet")
    ws["A1"] = f"Produksjonskapasitet fra lager: testeksempel {nr} – {produkt}"
    ws["A1"].font = FONT_TITTEL
    r = tekstblokk(ws, 2, [
        "Kapasiteten i uke t er det største antallet hele ferdigprodukter N som kan være ferdige innen uke t (FR-31). "
        "Behovet på N i uke t brytes ned gjennom stykklisten som i MRP-beregningen, med ledig beholdning "
        "(maks(0, lager − SS)) som lager og SS 0. Planlagte mottak regnes fra mottaksuken og fremskyndes ikke.",
        "Deler uten underdeler kan ikke få nye ordrer. Ferdigproduktet og deler som produseres selv kan det, men ingen "
        "frigivelse kan være før uke 1. Prognostiserte behov (MPS) påvirker ikke kapasiteten.",
        "Begrensende deler er delene som ikke kan dekkes når behovet er N + 1 (FR-33).",
    ])
    for rr in range(2, r):
        ws.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=2 + h)
        ws.row_dimensions[rr].height = 30
    r += 1
    ws.cell(r, 1, "Kapasitet per uke (FR-32)").font = FONT_FET
    hode(ws, r + 1, ["Rad", ""] + [f"Uke {u}" for u in range(1, h + 1)])
    r += 2
    for rad in KAP_RADER:
        celle(ws, r, 1, rad, fet=True)
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=2)
        for t, v in enumerate(kap[rad][0]):
            celle(ws, r, 3 + t, v).alignment = Alignment(horizontal="right")
        r += 1
    r += 1
    ws.cell(r, 1, "Begrensende deler for N + 1 (FR-33)").font = FONT_FET
    hode(ws, r + 1, ["Rad", "Uke", "Kapasitet", "Varenummer", "Beskrivelse", "Årsak"])
    r += 2
    for rad in KAP_RADER:
        verdier, begr = kap[rad]
        for t in range(h):
            for vn, aarsak in begr[t]:
                for k, v in enumerate([rad, t + 1, verdier[t], vn, deler[vn]["beskrivelse"], KAP_AARSAK[aarsak]], 1):
                    celle(ws, r, k, v)
                r += 1
    r += 1
    ws.cell(r, 1, "Grunnlag per del (FR-34)").font = FONT_FET
    hode(ws, r + 1, ["Varenummer", "Beskrivelse", "Type", "Lager", "SS", "Ledig", "Ledetid"]
         + [f"Mottak uke {u}" for u in range(1, h + 1)])
    r += 2
    for vn in rekkefolge:
        d = deler[vn]
        planlagt = [0] * h
        for mvn, mu, antall in mottak:
            if mvn == vn and 1 <= mu <= h:
                planlagt[mu - 1] += antall
        rad = [vn, d["beskrivelse"], d["type"], d["lager"], d["ss"], max(0, d["lager"] - d["ss"]), d["ledetid"]]
        for k, v in enumerate(rad + [p or None for p in planlagt], 1):
            celle(ws, r, k, v)
        r += 1
    r += 1
    ws.cell(r, 1, "Håndregning").font = FONT_FET
    r += 1
    for linje in utregning:
        c = ws.cell(r, 1, linje)
        c.font = FONT
        c.alignment = Alignment(wrap_text=True, vertical="top")
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=7 + h)
        ws.row_dimensions[r].height = 15 * (1 + len(linje) // 140)
        r += 1
    bredder(ws, {"A": 22, "B": 10, "C": 26, "D": 12, "E": 18, "F": 40, "G": 9})
    for u in range(h):
        ws.column_dimensions[chr(ord("H") + u)].width = 12


def lag_fasit(nr, produkt, mps, stykkliste, mottak, hensikt, status, sammenlign=(), kap_utregning=None):
    """Fasit for ett testeksempel. sammenlign er en liste med (overskrift, kjøring før, kjøring etter).
    kap_utregning (liste med linjer) gir i tillegg arket Kapasitet."""
    wb = Workbook()
    h = len(mps)
    tabeller, eks, detaljer = kjoring(mps, stykkliste, mottak)
    beskrivelse = {}
    for rad in stykkliste:
        beskrivelse.setdefault(rad[1], rad[2])

    ws = wb.active
    ws.title = "Regler"
    ws["A1"] = f"Fasit: testeksempel {nr} – {produkt}"
    ws["A1"].font = FONT_TITTEL
    r = tekstblokk(ws, 3, REGLER + ["", status])
    for rr in range(3, r):
        ws.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=8)
        lengde = len(str(ws.cell(rr, 1).value or ""))
        ws.row_dimensions[rr].height = 15 * (1 + lengde // 110)
    r += 1
    ws.cell(r, 1, "Hensikt med hver del i testeksempelet:").font = FONT_FET
    hode(ws, r + 1, ["Varenummer", "Beskrivelse", "Hensikt"])
    for i, vn in enumerate(tabeller):
        celle(ws, r + 2 + i, 1, vn)
        celle(ws, r + 2 + i, 2, beskrivelse[vn])
        celle(ws, r + 2 + i, 3, hensikt.get(vn, ""))
        ws.merge_cells(start_row=r + 2 + i, start_column=3, end_row=r + 2 + i, end_column=8)
    bredder(ws, {c: 14 for c in "ABCDEFGH"})

    ws_t = wb.create_sheet("Fasittabell")
    hode(ws_t, 1, ["Varenummer", "Rad"] + [f"Uke {u}" for u in range(1, h + 1)])
    ws_e = wb.create_sheet("Eksepsjoner")
    hode(ws_e, 1, ["Varenummer", "Uke", "Eksepsjonstype", "Melding"])

    r = 2
    for vn, rader in tabeller.items():
        mine = [e for e in eks if e[0] == vn]
        varsel_uker = {e[1] for e in mine}
        kritisk = bool(mine)
        for navn, verdier in rader.items():
            celle(ws_t, r, 1, vn, FYLL_KRITISK if kritisk else None, fet=kritisk)
            celle(ws_t, r, 2, navn)
            for t, v in enumerate(verdier):
                fyll = FYLL_VARSEL if (t + 1) in varsel_uker and navn == "Nettobehov" else None
                celle(ws_t, r, 3 + t, v, fyll).alignment = Alignment(horizontal="right")
            r += 1
        r += 1  # tom rad mellom delene
    for re_, e in enumerate(eks, start=2):
        for i, v in enumerate(e):
            celle(ws_e, re_, i + 1, v).alignment = Alignment(wrap_text=True, vertical="top")
    bredder(ws_t, {"A": 14, "B": 26})
    for u in range(h):
        ws_t.column_dimensions[chr(ord("C") + u)].width = 8
    ws_t.freeze_panes = "C2"
    bredder(ws_e, {"A": 14, "B": 6, "C": 30, "D": 90})
    ws_e.freeze_panes = "A2"

    ws_u = wb.create_sheet("Utregning")
    ws_u["A1"] = f"Utregning steg for steg: testeksempel {nr} – {produkt}"
    ws_u["A1"].font = FONT_TITTEL
    ws_u["A2"] = ("Delene står i beregningsrekkefølge (lavnivåkode 0, 1, 2). Hver linje er én uke med reglene i arket "
                  "Regler. Tall i parentes er negative.")
    ws_u["A3"] = status
    for c in ("A2", "A3"):
        ws_u[c].font = FONT
    r = 5
    for slag, tekst in utregning(tabeller, eks, detaljer):
        if slag == "del" and r > 5:
            r += 1
        c = ws_u.cell(r, 1, tekst)
        c.font = FONT_FET if slag == "del" else FONT
        c.alignment = Alignment(wrap_text=True, vertical="top")
        ws_u.row_dimensions[r].height = 15 * (1 + len(tekst) // 150)
        r += 1
    ws_u.column_dimensions["A"].width = 160

    ws_m = wb.create_sheet("Materiell")
    hode(ws_m, 1, ["Varenummer", "Beskrivelse", "Lavnivåkode"])
    for i, vn in enumerate(beregningsrekkefolge(tabeller, detaljer), start=2):
        celle(ws_m, i, 1, vn)
        celle(ws_m, i, 2, detaljer[vn]["del_"]["beskrivelse"])
        celle(ws_m, i, 3, detaljer[vn]["llk"])
    bredder(ws_m, {"A": 14, "B": 22, "C": 14})

    ws_b = wb.create_sheet("Bestillingsforslag")
    hode(ws_b, 1, ["Varenummer", "Beskrivelse", "Frigivelsesuke", "Mengde", "Art", "Forfalt mengde"])
    for i, linje in enumerate(bestillingsforslag(tabeller, detaljer), start=2):
        for k, v in enumerate(linje, start=1):
            celle(ws_b, i, k, v if (k != 6 or v) else None)
    bredder(ws_b, {"A": 14, "B": 22, "C": 14, "D": 10, "E": 18, "F": 16})
    ws_b.freeze_panes = "A2"

    if sammenlign:
        ws_s = wb.create_sheet("Sammenligning")
        ws_s["A1"] = "Før/etter-sammenligning (FR-20)"
        ws_s["A1"].font = FONT_TITTEL
        r = tekstblokk(ws_s, 2, [
            "Et bestillingsforslag er identifisert av varenummer og frigivelsesuke. Samme varenummer og uke med ny "
            "mengde er «Endret mengde». Flytter et forslag uke, vises det som «Fjernet» i den gamle uken og «Nytt» i "
            "den nye.",
            "En eksepsjon er identifisert av varenummer, uke og type. En endret melding alene er ingen endring.",
            "Lastes samme fil opp to ganger, er det ingen endringer.",
        ])
        for rr in range(2, r):
            ws_s.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=7)
            ws_s.row_dimensions[rr].height = 28
        r += 1
        for tittel, for_, etter in sammenlign:
            ws_s.cell(r, 1, tittel).font = FONT_FET
            hode(ws_s, r + 1, ["Hva", "Endring", "Varenummer", "Uke", "Før", "Etter", "Melding"])
            r += 2
            for linje in sammenligning(for_, etter):
                for k, v in enumerate(linje, start=1):
                    celle(ws_s, r, k, v).alignment = Alignment(wrap_text=True, vertical="top")
                r += 1
            r += 1
        bredder(ws_s, {"A": 18, "B": 16, "C": 12, "D": 6, "E": 26, "F": 26, "G": 80})
    if kap_utregning:
        kapasitet_ark(wb, nr, produkt, mps, stykkliste, mottak, kap_utregning)
    return wb


# ---------- Valideringstilfeller (FR-1–FR-4) ----------
# Hver fil bygger på testeksempel 02 og har nøyaktig én valideringsfeil (unntak: V-F05 har tre, V-F06 to, og G-filene har
# ingen). Radnumrene er Excel-rader i arket. Testeksempel 02 har disse radene i Stykkliste:
# 2: 0 100-001, 3: .1 200-001, 4: ..2 300-001, 5: ..2 300-002, 6: .1 200-002, 7: ..2 300-002 (gjentatt),
# 8: ..2 300-003, 9: .1 300-004, 10: .1 300-005.

def _rad(stykk, excel_rad, **endr):
    """Kopi av stykklisten der én rad (Excel-rad) har fått nye verdier."""
    felt = ["niva", "vn", "besk", "antall", "type", "lager", "ss", "ledetid"]
    ny = [list(r) for r in stykk]
    for k, v in endr.items():
        ny[excel_rad - 2][felt.index(k)] = v
    return [tuple(r) for r in ny]


def _sett_inn(stykk, excel_rad, *rader):
    return stykk[:excel_rad - 2] + list(rader) + stykk[excel_rad - 2:]


def _mps(**uker):
    m = list(MPS_02)
    for k, v in uker.items():
        u = int(k[1:])
        while len(m) < u:
            m.append(None)
        m[u - 1] = v
    return m


S02, M02, R02 = STYKKLISTE_02, MPS_02, MOTTAK_02
_REPETER = ("..2", "300-001", "Seteplate", 1, KJOPT, None, None, None)

# (id, beskrivelse, ark, rad/celle, felt, regel, (stykkliste, mps, mottak), etterbehandling eller None)
VALIDERING = [
    ("S01", "Tom rad midt i stykklisten", "Stykkliste", "rad 9", "Rader", "FR-3: rader sammenhengende fra rad 2",
     (_sett_inn(S02, 9, (None,) * 8), M02, R02[:1]), None),  # mottaket for 300-005 (under den tomme raden) er tatt ut
    ("S02", "Ingen rad med nivå .1", "Stykkliste", "rad 2", "Rader", "FR-3: minst én rad med nivå .1",
     (S02[:1], M02, []), None),
    ("S03", "1001 rader i stykklisten", "Stykkliste", "rad 1002", "Rader", "FR-3: inntil 1000 rader",
     (_sett_inn(S02, 5, *[_REPETER] * 992), M02, R02), None),
    ("S04", "Ugyldig nivå «3»", "Stykkliste", "A8", "Nivå", "FR-3: nivå er 0, .1 eller ..2",
     (_rad(S02, 8, niva="3"), M02, R02), None),
    ("S05", "Første rad er nivå .1", "Stykkliste", "A2", "Nivå", "FR-3: første rad er 0",
     (_rad(S02, 2, niva=".1", antall=1, type=PROD), M02, R02), None),
    ("S06", "To rader med nivå 0", "Stykkliste", "A11", "Nivå", "FR-3: ingen andre rader er 0",
     (S02 + [("0", "100-002", "Kontorstol Pro 2", None, "Ferdigvare", 0, 0, 0)], M02, R02), None),
    ("S07", "Nivå ..2 rett under nivå 0", "Stykkliste", "A3", "Nivå", "FR-3: ..2 står rett under .1 eller ..2",
     (_rad(S02, 3, niva="..2"), M02, R02), None),
    ("S08", "Varenummer mangler", "Stykkliste", "B8", "Varenummer", "FR-3: varenummer fylt ut",
     (_rad(S02, 8, vn=None), M02, R02), None),
    ("S09", "Del står under seg selv", "Stykkliste", "B6", "Varenummer", "FR-3: en del kan ikke stå under seg selv",
     (_sett_inn(S02, 6, ("..2", "200-001", "Sete", 1, PROD, None, None, None)), M02, R02), None),
    ("S10", "Beskrivelse mangler", "Stykkliste", "C9", "Beskrivelse", "FR-3: beskrivelse fylt ut",
     (_rad(S02, 9, besk=None), M02, R02), None),
    ("S11", "Annen beskrivelse for samme varenummer", "Stykkliste", "C7", "Beskrivelse",
     "FR-3: lik beskrivelse for samme varenummer", (_rad(S02, 7, besk="Skruesett M8"), M02, R02), None),
    ("S12", "Antall fylt ut for nivå 0", "Stykkliste", "D2", "Antall", "FR-3: antall tom for nivå 0",
     (_rad(S02, 2, antall=1), M02, R02), None),
    ("S13", "Antall mangler", "Stykkliste", "D9", "Antall", "FR-3: antall heltall ≥ 1",
     (_rad(S02, 9, antall=None), M02, R02), None),
    ("S14", "Antall 0", "Stykkliste", "D9", "Antall", "FR-3: antall heltall ≥ 1",
     (_rad(S02, 9, antall=0), M02, R02), None),
    ("S15", "Antall med desimal (1,5)", "Stykkliste", "D4", "Antall", "FR-3: antall heltall ≥ 1",
     (_rad(S02, 4, antall=1.5), M02, R02), None),
    ("S16", "Antall er tekst («fem»)", "Stykkliste", "D9", "Antall", "FR-3: antall heltall ≥ 1",
     (_rad(S02, 9, antall="fem"), M02, R02), None),
    ("S17", "Type som ikke finnes i listen («Råvare (Kjøpes inn)»)", "Stykkliste", "E8", "Type",
     "FR-3: type fra listen", (_rad(S02, 8, type="Råvare (Kjøpes inn)"), M02, R02), None),
    ("S18", "Ferdigvare på nivå .1", "Stykkliste", "E9", "Type", "FR-3: Ferdigvare bare på nivå 0",
     (_rad(S02, 9, type="Ferdigvare"), M02, R02), None),
    ("S19", "Nivå 0 er ikke Ferdigvare", "Stykkliste", "E2", "Type", "FR-3: Ferdigvare på nivå 0",
     (_rad(S02, 2, type=PROD), M02, R02), None),
    ("S20", "Annen type for samme varenummer", "Stykkliste", "E7", "Type", "FR-3: lik type for samme varenummer",
     (_rad(S02, 7, type=PROD), M02, R02), None),
    ("S21", "Del som kjøpes inn, har underdeler", "Stykkliste", "E3", "Type",
     "FR-3: en del som kjøpes inn, har ingen rader under seg", (_rad(S02, 3, type=KJOPT), M02, R02), None),
    ("S22", "Ulike underdeler under samme del", "Stykkliste", "rad 12", "Underdeler",
     "FR-3: underdelene er like under hver forekomst",
     (S02 + [(".1", "200-001", "Sete", 1, PROD, None, None, None),
             ("..2", "300-001", "Seteplate", 2, KJOPT, None, None, None)], M02, R02), None),
    ("S23", "Negativ lagerbeholdning", "Stykkliste", "F9", "Lagerbeholdning", "FR-3: heltall ≥ 0",
     (_rad(S02, 9, lager=-5), M02, R02), None),
    ("S24", "Sikkerhetslager med desimal (2,5)", "Stykkliste", "G4", "Sikkerhetslager", "FR-3: heltall ≥ 0",
     (_rad(S02, 4, ss=2.5), M02, R02), None),
    ("S25", "Lagerbeholdning mangler første gang varenummeret står", "Stykkliste", "F8", "Lagerbeholdning",
     "FR-3: fylt ut første gang", (_rad(S02, 8, lager=None), M02, R02), None),
    ("S26", "Lagerbeholdning fylt ut andre gang varenummeret står", "Stykkliste", "F7", "Lagerbeholdning",
     "FR-3: tom de neste gangene", (_rad(S02, 7, lager=10), M02, R02), None),
    ("S27", "Ledetid 0 for en komponent", "Stykkliste", "H9", "Ledetid (uker)", "FR-3: heltall ≥ 1 (≥ 0 for nivå 0)",
     (_rad(S02, 9, ledetid=0), M02, R02), None),
    ("S28", "Ledetid mangler", "Stykkliste", "H10", "Ledetid (uker)", "FR-3: fylt ut første gang",
     (_rad(S02, 10, ledetid=None), M02, R02), None),
    ("S29", "Ledetid fylt ut andre gang varenummeret står", "Stykkliste", "H7", "Ledetid (uker)",
     "FR-3: tom de neste gangene", (_rad(S02, 7, ledetid=1), M02, R02), None),
    ("M01", "Negativt antall i MPS", "MPS", "uke 3", "Antall per uke", "FR-3: heltall ≥ 0",
     (S02, _mps(u3=-5), R02), None),
    ("M02", "Uke fylt ut etter et hull (uke 9 tom, uke 10 fylt)", "MPS", "uke 10", "Antall per uke",
     "FR-3: ingen uke fylt ut etter et hull", (S02, _mps(u9=None), R02), None),
    ("M03", "Horisont på 7 uker", "MPS", "uke 8", "Antall per uke", "FR-3: horisonten er 8–12 uker",
     (S02, MPS_02[:7], R02), None),
    ("M04", "Antall er tekst («tretti»)", "MPS", "uke 2", "Antall per uke", "FR-3: heltall ≥ 0",
     (S02, _mps(u2="tretti"), R02), None),
    ("M05", "Antall med desimal (30,5)", "MPS", "uke 2", "Antall per uke", "FR-3: heltall ≥ 0",
     (S02, _mps(u2=30.5), R02), None),
    ("P01", "Varenummer som ikke finnes i Stykkliste", "Planlagte mottak", "A3", "Varenummer",
     "FR-3: varenummer finnes i Stykkliste", (S02, M02, [R02[0], ("300-099", 5, 50)]), None),
    ("P02", "Uke 0", "Planlagte mottak", "B3", "Uke", "FR-3: uke fra 1 til H",
     (S02, M02, [R02[0], ("300-005", 0, 50)]), None),
    ("P03", "Uke etter horisonten (uke 11, H = 10)", "Planlagte mottak", "B3", "Uke", "FR-3: uke fra 1 til H",
     (S02, M02, [R02[0], ("300-005", 11, 50)]), None),
    ("P04", "Antall 0", "Planlagte mottak", "C3", "Antall", "FR-3: antall heltall ≥ 1",
     (S02, M02, [R02[0], ("300-005", 5, 0)]), None),
    ("F01", "Arket MPS mangler", "MPS", "–", "Ark", "FR-2: arkene Stykkliste, MPS og Planlagte mottak finnes",
     (S02, M02, R02), "slett_mps"),
    ("F02", "Kolonneoverskriften «Ledetid (uker)» mangler", "Stykkliste", "H1", "Overskrift",
     "FR-2: kolonneoverskriftene fra malen", (S02, M02, R02), "feil_overskrift"),
    ("F03", "Fil etter den gamle malen (arkene Produkt og Komponenter)", "Stykkliste", "–", "Ark",
     "FR-2: gammel mal gir feil om at Stykkliste mangler", (S02, M02, R02), "gammel_mal"),
    ("F04", "Fil som ikke er .xlsx (CSV)", "–", "–", "Fil", "FR-1: bare .xlsx tas imot", None, "csv"),
    ("F05", "Tre feil på tre ark", "Stykkliste, MPS, Planlagte mottak", "D9, uke 3, B2", "Antall, Antall per uke, Uke",
     "FR-4: alle feilene vises samlet (3 feil)", (_rad(S02, 9, antall=0), _mps(u3=-5), [("200-002", 0, 40)]), None),
    ("F06", "Strukturfeil og verdifeil i samme fil: overskriften «Ledetid (uker)» mangler, og et mottak har antall 0",
     "Stykkliste, Planlagte mottak", "H1, C3", "Overskrift, Antall",
     "FR-2 og FR-4: verdier som ikke avhenger av kolonnen som mangler, kontrolleres likevel (2 feil)",
     (S02, M02, [R02[0], ("300-005", 5, 0)]), "feil_overskrift"),
    ("G01", "Gyldig: horisont 8 uker", "–", "–", "–", "FR-3: grenseverdi, ingen feil", (S02, MPS_02[:8], R02), None),
    ("G02", "Gyldig: horisont 12 uker", "–", "–", "–", "FR-3: grenseverdi, ingen feil",
     (S02, MPS_02 + [25, 40], R02), None),
    ("G03", "Gyldig: tomt ark Planlagte mottak", "–", "–", "–", "FR-3: tomt ark er gyldig, ingen feil",
     (S02, M02, []), None),
    ("G04", "Gyldig: del med underdeler to ganger, likt og bare første gang", "–", "–", "–",
     "FR-3: underdeler like eller bare første gang, ingen feil",
     (S02 + [(".1", "200-001", "Sete", 1, PROD, None, None, None),
             ("..2", "300-002", "Skruesett M6", 4, KJOPT, None, None, None),
             ("..2", "300-001", "Seteplate", 1, KJOPT, None, None, None),
             (".1", "200-002", "Rygg", 1, PROD, None, None, None)], M02, R02), None),
]


def _antall_feil(vid):
    return {"F04": None, "F05": 3, "F06": 2}.get(vid, 0 if vid.startswith("G") else 1)


def lag_valideringsfiler(mappe):
    """Lager filene i testdata/validering/ og README.md med forventet resultat for hver fil."""
    mappe.mkdir(exist_ok=True)
    nye = {f"V-{v[0]}.csv" if v[7] == "csv" else f"V-{v[0]}.xlsx" for v in VALIDERING}
    for gammel in mappe.glob("V-*"):
        if gammel.name not in nye:
            gammel.unlink()
    rader = []
    for vid, besk, ark, sted, felt, regel, data, etter in VALIDERING:
        navn = f"V-{vid}.csv" if etter == "csv" else f"V-{vid}.xlsx"
        if etter == "csv":
            (mappe / navn).write_text("Nivå;Varenummer;Beskrivelse\n0;100-001;Kontorstol Pro\n", encoding="utf-8")
        else:
            stykk, mps, mottak = data
            wb = lag_mal(mps, stykk[:STYKK_RADER], mottak)
            ws = wb["Stykkliste"]
            for i, rad in enumerate(stykk[STYKK_RADER:], start=STYKK_RADER + 2):
                for k, v in enumerate(rad, start=1):
                    ws.cell(i, k, v).font = FONT
            if etter == "slett_mps":
                del wb[PROGNOSE]
            elif etter == "feil_overskrift":
                ws["H1"] = "Ledetid"
            elif etter == "gammel_mal":
                ws.title = "Komponenter"
                wb.create_sheet("Produkt", 1)["A1"] = "Produktnavn"
                wb["Produkt"]["B1"] = PRODUKT_02
            lagre(wb, mappe / navn)
        n = _antall_feil(vid)
        rader.append((navn, besk, "avvist" if n is None else str(n), ark, sted, felt, regel))
    linjer = [
        "# Valideringstilfeller",
        "",
        "Filene her tester valideringen før beregningen (PRD FR-1–FR-4). De lages av `lag_testdata.py` "
        "(`--alle`) og bygger på testeksempel 02. Hver fil har nøyaktig én feil, unntatt V-F05 (tre feil på tre ark, "
        "FR-4), V-F06 (en strukturfeil og en verdifeil) og G-filene (gyldige grenseverdier, ingen feil). V-F04 er ikke en Excel-fil og skal avvises (FR-1).",
        "",
        "Kolonnen «Feil» er antall valideringsfeil appen skal vise. Sted er cellen eller raden feilen gjelder. "
        "Ordlyden i feilmeldingen bestemmer appen, men den skal oppgi ark, rad eller celle, felt og årsak (FR-4).",
        "",
        "Antagelser:",
        "",
        "- Mangler et ark eller en overskrift (FR-2), kontrolleres likevel de verdiene som ikke avhenger av det som "
        "mangler (FR-3). Kontroller som avhenger av det, hoppes over: uten MPS er horisonten ukjent, så ukene i Planlagte "
        "mottak kontrolleres ikke, og uten overskriften «Ledetid (uker)» kontrolleres ikke ledetidene. V-F01–F03 har "
        "ingen andre feil og gir én feil. V-F06 har i tillegg en verdifeil og gir to (bestemt av Sebastian 2026-11-05).",
        "- V-S05 og V-S19 har ingen rad med typen Ferdigvare. Det regnes ikke som en egen feil.",
        "- V-S01 har ingen planlagte mottak for delene under den tomme raden, så det blir ikke en ekstra feil om appen "
        "slutter å lese ved den tomme raden.",
        "- V-S03 har 1001 rader, så rad 1002 ligger utenfor malens 1000 rader.",
        "",
        "| Fil | Tilfelle | Feil | Ark | Sted | Felt | Regel |",
        "|---|---|---|---|---|---|---|",
    ] + [f"| `{a}` | {b} | {c} | {d} | {e} | {f} | {g} |" for a, b, c, d, e, f, g in rader]
    (mappe / "README.md").write_text("\n".join(linjer) + "\n", encoding="utf-8")


def kontroller():
    """Stopper hvis beregn() gir andre eksepsjoner enn det testeksemplene skal teste, eller hvis viktige tall endres."""
    for nr, _p, mps, stykk, mottak, _h, _s, forventet in TESTEKSEMPLER:
        _t, eks = beregn(mps, stykk, mottak)
        fikk = sorted((e[0], str(e[1]), e[2]) for e in eks)
        skal = sorted((vn, str(u), typ) for vn, liste in forventet.items() for u, typ in liste)
        assert fikk == skal, f"Testeksempel {nr}: forventet {skal}, fikk {fikk}"
    t, _e = beregn(MPS_04, STYKKLISTE_04, MOTTAK_04)
    frig = {vn: r["Planlagte ordrefrigivelser"] for vn, r in t.items()}
    h = len(MPS_04)
    assert t["300-023"]["Bruttobehov"] == [2 * frig["100-003"][u] + frig["200-010"][u] for u in range(h)]
    assert t["300-024"]["Bruttobehov"] == frig["200-012"]
    assert t["300-025"]["Bruttobehov"] == [2 * q for q in frig["200-012"]]
    assert t["300-029"]["Bruttobehov"] == [5 * q for q in frig["200-013"]]
    assert t["200-012"]["Bruttobehov"] == t["200-013"]["Bruttobehov"] == [2 * q for q in frig["100-003"]]
    assert t["300-022"]["Bruttobehov"] == [4 * frig["200-010"][u] + 2 * frig["200-011"][u] for u in range(h)]
    assert t["300-027"]["Planlagte mottak"][3] == 50
    a = kjoring(MPS_02, STYKKLISTE_02, MOTTAK_02)
    assert sammenligning(a, a) == [], "Samme kjøring to ganger skal gi ingen endringer"
    # Produksjonskapasitet (FR-31–FR-33): skriptet skal gi det som er regnet for hånd for testeksempel 05
    kap = kapasitet(STYKKLISTE_05, MOTTAK_05, len(MPS_05))
    for rad, (verdier, begr) in kap.items():
        assert verdier == FORVENTET_KAP_05[rad], f"Kapasitet 05, {rad}: forventet {FORVENTET_KAP_05[rad]}, fikk {verdier}"
        assert verdier == sorted(verdier), f"Kapasitet 05, {rad}: blir lavere fra en uke til den neste"
        for uke, b in enumerate(begr, start=1):
            assert b == FORVENTET_BEGR_05[(rad, uke)], f"Begrensende 05, {rad}, uke {uke}: fikk {b}"
    assert all(m >= f for m, f in zip(kap["Med planlagte mottak"][0], kap["Fra lager"][0]))


TESTEKSEMPLER = [
    ("01", PRODUKT, MPS, STYKKLISTE_01, MOTTAK, HENSIKT_01, STATUS_01, FORVENTET_01),
    ("02", PRODUKT_02, MPS_02, STYKKLISTE_02, MOTTAK_02, HENSIKT_02, STATUS_02, FORVENTET_02),
    ("03", PRODUKT_02, MPS_03, STYKKLISTE_02, MOTTAK_02, HENSIKT_03, STATUS_03, FORVENTET_03),
    ("04", PRODUKT_04, MPS_04, STYKKLISTE_04, MOTTAK_04, HENSIKT_04, STATUS_04, FORVENTET_04),
    ("05", PRODUKT_05, MPS_05, STYKKLISTE_05, MOTTAK_05, HENSIKT_05, STATUS_05, FORVENTET_05),
]
KAPASITET_UTREGNING = {"05": KAPASITET_UTREGNING_05}  # testeksempler med arket Kapasitet i fasiten

if __name__ == "__main__":
    lagre(lag_mal(), UT / "COSI-MRP-mal.xlsx")
    if "--alle" in sys.argv:
        kontroller()
        k02 = kjoring(MPS_02, STYKKLISTE_02, MOTTAK_02)
        k03 = kjoring(MPS_03, STYKKLISTE_02, MOTTAK_02)
        sammen = {"03": [("Fra testeksempel 02 til 03 (02 lastet opp først, så 03)", k02, k03),
                         ("Fra testeksempel 03 til 02 (03 lastet opp først, så 02)", k03, k02)]}
        for nr, produkt, mps, stykk, mottak, hensikt, status, _f in TESTEKSEMPLER:
            tabeller, eks = beregn(mps, stykk, mottak)
            print(f"===== Testeksempel {nr}: {produkt}")
            for vn, rader in tabeller.items():
                print(vn, hensikt[vn])
                for navn, v in rader.items():
                    print(f"  {navn:28}", v)
                for e in eks:
                    if e[0] == vn:
                        print("  !", e[1], e[2])
            lagre(lag_mal(mps, stykk, mottak), UT / f"testeksempel-{nr}.xlsx")
            lagre(lag_fasit(nr, produkt, mps, stykk, mottak, hensikt, status, sammen.get(nr, ()),
                            KAPASITET_UTREGNING.get(nr)),
                  UT / f"testeksempel-{nr}-fasit.xlsx")
        lag_valideringsfiler(UT / "validering")
