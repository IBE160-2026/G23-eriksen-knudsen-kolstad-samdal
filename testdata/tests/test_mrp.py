"""Tester for beregningen i lag_testdata.py mot fasitene i testdata/.

Kjør fra testdata/: uv run --with openpyxl --with pytest pytest tests -v
"""
import csv
import sys
from pathlib import Path

import pytest

TESTDATA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TESTDATA))

import lag_testdata as lt  # noqa: E402

GAMMEL_FASIT_01 = TESTDATA / "tests" / "data" / "testeksempel-01-fasit-2026-10-19"
# Eksepsjonen ble omdøpt da «innkjøpstid» ble erstattet med «ledetid»
NYE_NAVN = {"Innkjøpstid overskrider horisont": "Ledetid overskrider horisont"}


def regn(nummer):
    deler, koblinger, prognose, mottak = lt.les_eksempel(TESTDATA / f"testeksempel-{nummer}.xlsx")
    return deler, lt.beregn_flerniva(deler, koblinger, prognose, mottak)


def les_tabell(fil):
    with open(fil, encoding="utf-8") as f:
        return {(r["varenummer"], r["rad"], int(r["uke"])): int(r["verdi"]) for r in csv.DictReader(f)}


def les_eksepsjoner(fil):
    with open(fil, encoding="utf-8") as f:
        return [tuple(r.values()) for r in csv.DictReader(f)]


def som_tabell(resultat):
    return {(nr, navn, uke): v
            for nr, (rader, _) in resultat.items()
            for navn, verdier in rader.items()
            for uke, v in enumerate(verdier, start=1)}


def eksepsjoner(resultat):
    return [tuple(str(x) for x in e) for _, eks in resultat.values() for e in eks]


@pytest.mark.parametrize("nummer", ["01", "02"])
def test_beregning_stemmer_med_fasit(nummer):
    _, resultat = regn(nummer)
    assert som_tabell(resultat) == les_tabell(TESTDATA / "fasit" / f"testeksempel-{nummer}-tabell.csv")
    assert eksepsjoner(resultat) == les_eksepsjoner(TESTDATA / "fasit" / f"testeksempel-{nummer}-eksepsjoner.csv")


def test_01_gir_samme_tall_som_fasiten_fra_2026_10_19():
    _, resultat = regn("01")
    gammel = les_tabell(f"{GAMMEL_FASIT_01}-tabell.csv")
    ny = {k: v for k, v in som_tabell(resultat).items() if k[0] != "100-001"}
    assert ny == gammel
    gamle_eks = [(nr, uke, NYE_NAVN.get(typ, typ)) for nr, uke, typ in les_eksepsjoner(f"{GAMMEL_FASIT_01}-eksepsjoner.csv")]
    assert sorted(e[:3] for e in eksepsjoner(resultat)) == sorted(gamle_eks)


def test_01_ferdigvaren_sender_prognosen_videre_uendret():
    _, resultat = regn("01")
    rader, eks = resultat["100-001"]
    assert rader["Planlagte ordrefrigivelser"] == lt.MPS
    assert eks == []


def test_02_dekker_alle_fire_eksepsjonstypene():
    _, resultat = regn("02")
    typer = {e[2] for e in eksepsjoner(resultat)}
    assert typer == {"Bestilling forsinket", "Bruk av sikkerhetslager", "Mottak forsinket",
                     "Ledetid overskrider horisont"}


def test_02_har_tre_nivaer_og_5_til_10_deler():
    deler, _ = regn("02")
    assert {d["nivå"] for d in deler.values()} == {0, 1, 2}
    assert 5 <= len(deler) - 1 <= 10  # deler under ferdigvaren


def test_02_skruesett_summeres_fra_begge_stedene():
    _, resultat = regn("02")
    sete = resultat["200-001"][0]["Planlagte ordrefrigivelser"]
    rygg = resultat["200-002"][0]["Planlagte ordrefrigivelser"]
    brutto = resultat["300-002"][0]["Bruttobehov"]
    assert brutto == [4 * s + 2 * r for s, r in zip(sete, rygg)]
    assert any(r > 0 for r in rygg) and any(s > 0 for s in sete)


def test_02_forfalt_frigivelse_paa_ferdigvaren_slaar_ut_paa_nivaa_1():
    _, resultat = regn("02")
    ferdig_rader, ferdig_eks = resultat["100-001"]
    assert ("100-001", 1, "Bestilling forsinket") in [e[:3] for e in ferdig_eks]
    assert "Leveranse til kunde blir forsinket." in ferdig_eks[0][3]
    # Frigivelsen i uke 1 inneholder den forfalte bestillingen og blir bruttobehov for setet i uke 1
    assert resultat["200-001"][0]["Bruttobehov"][0] == ferdig_rader["Planlagte ordrefrigivelser"][0]
    sete_eks = resultat["200-001"][1]
    assert ("200-001", 1, "Bestilling forsinket") in [e[:3] for e in sete_eks]
    assert "til produksjonen av delen over" in sete_eks[0][3]


def test_02_mottak_forsinket_paa_delmontering_er_fra_egen_produksjon():
    _, resultat = regn("02")
    eks = [e for e in resultat["200-002"][1] if e[2] == "Mottak forsinket"]
    assert eks and "fra egen produksjon" in eks[0][3]


def test_02_ledetid_over_horisont_uten_behov():
    _, resultat = regn("02")
    rader, eks = resultat["300-005"]
    assert [e[1:3] for e in eks] == [("–", "Ledetid overskrider horisont")]
    assert not any(rader["Nettobehov"])


RAD_0 = ("0", "100-001", "Stol", None, "Ferdigvare", 0, 0, 0)


def test_delmontering_med_underdeler_kan_ikke_staa_to_steder():
    rader = [RAD_0,
             (".1", "200-001", "Sete", 1, lt.PROD, 5, 0, 1),
             ("..2", "300-001", "Plate", 1, lt.KJOPT, 5, 0, 1),
             (".1", "200-001", "Sete", 1, lt.PROD, None, None, None)]
    with pytest.raises(lt.MalFeil, match="kan bare stå ett sted"):
        lt.les_stykkliste(rader)


def test_ugyldig_hopp_i_nivaa():
    rader = [RAD_0, ("..2", "300-001", "Plate", 1, lt.KJOPT, 5, 0, 1)]
    with pytest.raises(lt.MalFeil, match="kan bare stå rett under"):
        lt.les_stykkliste(rader)


def test_forste_rad_maa_vaere_nivaa_0():
    with pytest.raises(lt.MalFeil, match="første rad må være nivå 0"):
        lt.les_stykkliste([(".1", "300-001", "Plate", 1, lt.KJOPT, 5, 0, 1)])


def test_del_som_kjopes_inn_kan_ikke_ha_underdeler():
    rader = [RAD_0,
             (".1", "300-001", "Plate", 1, lt.KJOPT, 5, 0, 1),
             ("..2", "300-002", "Skrue", 1, lt.KJOPT, 5, 0, 1)]
    with pytest.raises(lt.MalFeil, match="kjøpes inn"):
        lt.les_stykkliste(rader)
