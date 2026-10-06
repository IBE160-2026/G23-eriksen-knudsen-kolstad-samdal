"""Lager Excel-mal, testeksempel og fasit for COSI - MRP.

Bruk: uv run --with openpyxl python lag_testdata.py <testdata-mappe>
"""
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

UT = Path(sys.argv[1])
MAKS_UKER = 12
MAKS_KOMP = 10

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

KOMP_KOLONNER = ["Komponent-ID", "Navn", "Antall per ferdigprodukt",
                 "Lagerbeholdning", "Sikkerhetslager", "Innkjøpstid (uker)"]


# ---------- Testeksempel 01: fiktiv kontorstolprodusent ----------

PRODUKT = "Kontorstol Basic"
MPS = [20, 25, 30, 20, 35, 30, 25, 40, 30, 20]  # 10 ukers horisont

# (id, navn, antall per, lager, sikkerhetslager, innkjøpstid, hensikt)
KOMPONENTER = [
    ("K01", "Sete", 1, 200, 20, 2, "Normalforløp: første behov kan bestilles i tide"),
    ("K02", "Rygg", 1, 60, 10, 1, "Normalforløp med innkjøpstid 1 uke"),
    ("K03", "Hjul", 5, 80, 30, 1, "Bestilling forsinket i uke 1 (lager går under 0)"),
    ("K04", "Armlene", 2, 50, 20, 1, "Bruk av sikkerhetslager i uke 1 (lager mellom 0 og sikkerhetslager)"),
    ("K05", "Gassfjær", 1, 75, 10, 2, "Mottak forsinket: behov i uke 3, planlagt mottak først i uke 4"),
    ("K06", "Stolfot", 1, 400, 20, 10, "Innkjøpstid = horisont (grensetilfelle)"),
    ("K07", "Skruesett", 4, 150, 40, 2, "Planlagt mottak i uke 2 kommer i tide (ingen eksepsjon)"),
    ("K08", "Trekk", 1, 90, 0, 3, "Sikkerhetslager 0 og frigivelse nøyaktig i uke 1 (grensetilfelle)"),
]

# (komponent-id, uke, antall)
MOTTAK = [("K05", 4, 100), ("K07", 2, 120)]


def beregn(mps, komp, mottak):
    """MRP for én komponent etter reglene i arket 'Regler'."""
    _id, _navn, per, lager, ss, ledetid = komp[:6]
    h = len(mps)
    brutto = [m * per for m in mps]
    planlagt = [0] * h
    for kid, uke, antall in mottak:
        if kid == _id:
            planlagt[uke - 1] += antall
    forventet, netto, ordremottak, frigivelse = [], [], [], [0] * h
    eksepsjoner = []
    if ledetid >= h:
        eksepsjoner.append((_id, "–", "Innkjøpstid overskrider horisont",
                            f"Innkjøpstid {ledetid} uker ≥ horisont {h} uker. "
                            "Ingen ny bestilling kan dekke behov innenfor horisonten."))
    forrige = lager
    for t in range(h):
        uke = t + 1
        disponibel = forrige + planlagt[t] - brutto[t]
        nb = max(0, ss - disponibel)
        netto.append(nb)
        ordremottak.append(nb)
        if nb > 0:
            frigi_uke = uke - ledetid
            if frigi_uke >= 1:
                frigivelse[frigi_uke - 1] += nb
            else:
                frigivelse[0] += nb  # forfalt: må frigis straks
                if disponibel < 0:
                    eksepsjoner.append((_id, uke, "Bestilling forsinket",
                                        f"Lager blir {disponibel} i uke {uke}. Bestillingen måtte vært "
                                        f"frigitt i uke {frigi_uke}, før horisonten. Leveranse til kunde blir forsinket."))
                else:
                    eksepsjoner.append((_id, uke, "Bruk av sikkerhetslager",
                                        f"Lager blir {disponibel} i uke {uke}, under sikkerhetslager {ss}, "
                                        f"før ny leveranse kan komme inn (måtte vært frigitt i uke {frigi_uke})."))
            senere = [u for u in range(uke + 1, h + 1) if planlagt[u - 1] > 0]
            if senere:
                eksepsjoner.append((_id, uke, "Mottak forsinket",
                                    f"Nettobehov {nb} i uke {uke}, mens planlagt mottak ligger i uke {senere[0]}. "
                                    f"Vurder å fremskynde mottaket."))
        forrige = disponibel + nb
        forventet.append(forrige)
    rader = {
        "Bruttobehov": brutto,
        "Planlagte mottak": planlagt,
        "Forventet lagerbeholdning": forventet,
        "Nettobehov": netto,
        "Planlagte ordremottak": ordremottak,
        "Planlagte ordrefrigivelser": frigivelse,
    }
    return rader, eksepsjoner


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
    dv = DataValidation(type="whole", operator="greaterThanOrEqual", formula1=str(minimum),
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

def lag_mal(produkt=None, mps=None, komponenter=None, mottak=None):
    wb = Workbook()
    eksempel = produkt is not None

    # Veiledning
    ws = wb.active
    ws.title = "Veiledning"
    ws["A1"] = "COSI - MRP: Excel-mal for inndata"
    ws["A1"].font = FONT_TITTEL
    r = tekstblokk(ws, 3, [
        "Slik fyller du ut malen:",
        "1. Fyll kun ut gule celler. Ikke endre arknavn, kolonneoverskrifter eller rekkefølge.",
        "2. Produkt: navnet på ferdigproduktet (ett produkt per fil).",
        "3. MPS: antall ferdigprodukter per uke. Fyll ut fra uke 1 og sammenhengende fremover. "
        "Horisonten er antall utfylte uker (8–12). Tomme uker etter siste utfylte uke ignoreres.",
        "4. Komponenter: én rad per komponent (5–10 komponenter). Dette er BOM (enkeltnivå), "
        "lagerstatus, sikkerhetslager og innkjøpstid samlet.",
        "5. Planlagte mottak: bestillinger som allerede er lagt hos leverandør. Én rad per mottak. "
        "Arket kan stå tomt hvis det ikke finnes planlagte mottak.",
        "",
        "Regler for verdier:",
        "• Alle antall, lagerbeholdning og sikkerhetslager er heltall ≥ 0.",
        "• Innkjøpstid er hele uker, heltall ≥ 1.",
        "• Komponent-ID må være unik og må finnes i Komponenter før den brukes i Planlagte mottak.",
        "• Uke i Planlagte mottak må ligge innenfor horisonten (1 til siste utfylte MPS-uke).",
        "• Lagerbeholdning er beholdningen ved starten av uke 1.",
        "",
        "Eksempel på en utfylt rad i Komponenter (grønn = kun eksempel, skal ikke kopieres inn):",
    ])
    hode(ws, r, KOMP_KOLONNER)
    for i, v in enumerate(["K01", "Sete", 1, 200, 20, 2]):
        celle(ws, r + 1, i + 1, v, FYLL_EKSEMPEL)
    bredder(ws, {"A": 16, "B": 14, "C": 16, "D": 16, "E": 16, "F": 16})
    for rr in range(3, r):
        ws.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=6)
        ws.row_dimensions[rr].height = 28 if len(str(ws.cell(rr, 1).value or "")) > 95 else 15

    # Produkt
    ws = wb.create_sheet("Produkt")
    hode(ws, 1, ["Felt", "Verdi"])
    celle(ws, 2, 1, "Ferdigprodukt", fet=True)
    celle(ws, 2, 2, produkt, FYLL_INPUT)
    bredder(ws, {"A": 18, "B": 30})

    # MPS
    ws = wb.create_sheet("MPS")
    hode(ws, 1, ["Uke", "Antall ferdigprodukter"])
    for u in range(1, MAKS_UKER + 1):
        celle(ws, u + 1, 1, u, fet=True).alignment = Alignment(horizontal="center")
        verdi = mps[u - 1] if eksempel and u <= len(mps) else None
        celle(ws, u + 1, 2, verdi, FYLL_INPUT)
    heltall_validering(ws, f"B2:B{MAKS_UKER + 1}")
    bredder(ws, {"A": 8, "B": 24})
    ws.freeze_panes = "A2"

    # Komponenter
    ws = wb.create_sheet("Komponenter")
    hode(ws, 1, KOMP_KOLONNER)
    for i in range(MAKS_KOMP):
        rad = komponenter[i][:6] if eksempel and i < len(komponenter) else [None] * 6
        for k, v in enumerate(rad):
            celle(ws, i + 2, k + 1, v, FYLL_INPUT)
    heltall_validering(ws, f"C2:E{MAKS_KOMP + 1}")
    heltall_validering(ws, f"F2:F{MAKS_KOMP + 1}", minimum=1)
    bredder(ws, {"A": 14, "B": 18, "C": 14, "D": 16, "E": 16, "F": 14})
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = "A2"

    # Planlagte mottak
    ws = wb.create_sheet("Planlagte mottak")
    hode(ws, 1, ["Komponent-ID", "Uke", "Antall"])
    for i in range(20):
        rad = mottak[i] if eksempel and i < len(mottak) else [None] * 3
        for k, v in enumerate(rad):
            celle(ws, i + 2, k + 1, v, FYLL_INPUT)
    heltall_validering(ws, "B2:B21", minimum=1)
    heltall_validering(ws, "C2:C21", minimum=1)
    bredder(ws, {"A": 14, "B": 8, "C": 10})
    ws.freeze_panes = "A2"
    return wb


# ---------- Fasit ----------

REGLER = [
    "Beregningsregler (utkast – gruppen må bekrefte):",
    "Notasjon: uke t = 1..H, lager før uke 1 = lagerbeholdning, SS = sikkerhetslager, L = innkjøpstid.",
    "1. Bruttobehov(t) = MPS(t) × antall per ferdigprodukt.",
    "2. Disponibel(t) = forventet lager(t−1) + planlagte mottak(t) − bruttobehov(t).",
    "3. Nettobehov(t) = maks(0, SS − disponibel(t)).",
    "4. Lot-for-lot: planlagt ordremottak(t) = nettobehov(t).",
    "5. Forventet lagerbeholdning(t) = disponibel(t) + planlagt ordremottak(t).",
    "6. Planlagt ordrefrigivelse i uke t − L. Hvis t − L < 1 er frigivelsen forfalt og legges i uke 1 (må frigis straks).",
    "",
    "Eksepsjoner:",
    "• Bestilling forsinket: frigivelsen er forfalt (t − L < 1) og disponibel(t) < 0. Kunden får ikke levert i tide.",
    "• Bruk av sikkerhetslager: frigivelsen er forfalt (t − L < 1) og 0 ≤ disponibel(t) < SS. "
    "Lageret tærer på sikkerhetslageret før ny leveranse kan komme inn.",
    "• Mottak forsinket: nettobehov(t) > 0 og det finnes et planlagt mottak i en senere uke. "
    "Meldingen peker på første senere mottak, som bør fremskyndes.",
    "• Innkjøpstid overskrider horisont: L ≥ H. Gjelder komponenten (uke «–»), uavhengig av behov.",
    "• En celle kan ha flere eksepsjoner. En komponent med minst én eksepsjon er kritisk.",
    "",
    "Status: verdiene er beregnet med skript og MÅ kontrolleres for hånd av gruppen før de brukes som fasit.",
]


def lag_fasit(produkt, mps, komponenter, mottak):
    wb = Workbook()
    h = len(mps)

    ws = wb.active
    ws.title = "Regler"
    ws["A1"] = f"Fasit: testeksempel 01 – {produkt}"
    ws["A1"].font = FONT_TITTEL
    r = tekstblokk(ws, 3, REGLER)
    for rr in range(3, r):
        ws.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=8)
        ws.row_dimensions[rr].height = 28 if len(str(ws.cell(rr, 1).value or "")) > 110 else 15
    r += 1
    ws.cell(r, 1, "Hensikt med hver komponent i testeksempelet:").font = FONT_FET
    hode(ws, r + 1, ["Komponent-ID", "Navn", "Hensikt"])
    for i, k in enumerate(komponenter):
        celle(ws, r + 2 + i, 1, k[0])
        celle(ws, r + 2 + i, 2, k[1])
        celle(ws, r + 2 + i, 3, k[6])
        ws.merge_cells(start_row=r + 2 + i, start_column=3, end_row=r + 2 + i, end_column=8)
    bredder(ws, {c: 14 for c in "ABCDEFGH"})

    ws_t = wb.create_sheet("Fasittabell")
    hode(ws_t, 1, ["Komponent-ID", "Rad"] + [f"Uke {u}" for u in range(1, h + 1)])
    ws_e = wb.create_sheet("Eksepsjoner")
    hode(ws_e, 1, ["Komponent-ID", "Uke", "Eksepsjonstype", "Melding"])

    r, re_ = 2, 2
    for k in komponenter:
        rader, eks = beregn(mps, k, mottak)
        varsel_uker = {e[1] for e in eks}
        kritisk = bool(eks)
        for navn, verdier in rader.items():
            celle(ws_t, r, 1, k[0], FYLL_KRITISK if kritisk else None, fet=kritisk)
            celle(ws_t, r, 2, navn)
            for t, v in enumerate(verdier):
                fyll = FYLL_VARSEL if (t + 1) in varsel_uker and navn == "Nettobehov" else None
                celle(ws_t, r, 3 + t, v, fyll).alignment = Alignment(horizontal="right")
            r += 1
        r += 1  # tom rad mellom komponenter
        for e in eks:
            for i, v in enumerate(e):
                celle(ws_e, re_, i + 1, v).alignment = Alignment(wrap_text=True, vertical="top")
            re_ += 1
    bredder(ws_t, {"A": 14, "B": 26})
    for u in range(h):
        ws_t.column_dimensions[chr(ord("C") + u)].width = 8
    ws_t.freeze_panes = "C2"
    bredder(ws_e, {"A": 14, "B": 6, "C": 30, "D": 90})
    ws_e.freeze_panes = "A2"
    return wb


if __name__ == "__main__":
    for k in KOMPONENTER:
        rader, eks = beregn(MPS, k, MOTTAK)
        print(k[0], k[6])
        for navn, v in rader.items():
            print(f"  {navn:28}", v)
        for e in eks:
            print("  !", e[1], e[2])
    lag_mal().save(UT / "COSI-MRP-mal.xlsx")
    lag_mal(PRODUKT, MPS, KOMPONENTER, MOTTAK).save(UT / "testeksempel-01.xlsx")
    lag_fasit(PRODUKT, MPS, KOMPONENTER, MOTTAK).save(UT / "testeksempel-01-fasit.xlsx")
