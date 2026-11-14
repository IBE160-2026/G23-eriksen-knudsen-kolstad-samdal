/*
 * Testeksempel 02 og 03 (Kontorstol Pro) for prototypen. KONSEPT – forslag, ikke godkjent design.
 * Kopiert uendret fra testdata/testeksempel-02.xlsx, -03.xlsx og fasitene (arkene Fasittabell, Eksepsjoner,
 * Bestillingsforslag, Utregning og Sammenligning). Fasitene er kontrollert for hånd (se testdata/README.md).
 * Ingen beregning. Laget 2026-11-13 med et engangsskript. Minus er skrevet som ekte minustegn.
 */
window.COSI_PRO = {
 "02": {
  "H": 10,
  "meta": {
   "produkt": "Kontorstol Pro",
   "varenummer": "100-001",
   "horisont": 10,
   "fil": "testeksempel-02.xlsx",
   "kjort": "13.11.2026"
  },
  "deler": [
   {
    "vn": "100-001",
    "d": "Kontorstol Pro",
    "niva": "0",
    "type": "Ferdigvare",
    "lager": 20,
    "ss": 5,
    "L": 1,
    "B": [
     30,
     30,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5
    ],
    "NB": [
     15,
     30,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30
    ],
    "POM": [
     15,
     30,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30
    ],
    "POF": [
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "foreldre": []
   },
   {
    "vn": "200-001",
    "d": "Sete",
    "niva": ".1",
    "type": "Komponent (Produseres selv)",
    "lager": 30,
    "ss": 5,
    "L": 1,
    "B": [
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5
    ],
    "NB": [
     20,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POM": [
     20,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POF": [
     55,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-001",
    "d": "Seteplate",
    "niva": "..2",
    "type": "Komponent (Kjøpes inn)",
    "lager": 120,
    "ss": 10,
    "L": 2,
    "B": [
     55,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     65,
     40,
     10,
     10,
     10,
     10,
     10,
     10,
     10,
     10
    ],
    "NB": [
     0,
     0,
     10,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POM": [
     0,
     0,
     10,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POF": [
     10,
     35,
     30,
     45,
     35,
     30,
     0,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "200-001",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-002",
    "d": "Skruesett M6",
    "niva": "..2",
    "type": "Komponent (Kjøpes inn)",
    "lager": 400,
    "ss": 50,
    "L": 1,
    "B": [
     220,
     100,
     210,
     210,
     180,
     270,
     210,
     180,
     0,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     180,
     80,
     50,
     50,
     50,
     50,
     50,
     50,
     50,
     50
    ],
    "NB": [
     0,
     0,
     180,
     210,
     180,
     270,
     210,
     180,
     0,
     0
    ],
    "POM": [
     0,
     0,
     180,
     210,
     180,
     270,
     210,
     180,
     0,
     0
    ],
    "POF": [
     0,
     180,
     210,
     180,
     270,
     210,
     180,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "200-001",
      "antall": 4
     },
     {
      "vn": "200-002",
      "antall": 2
     }
    ]
   },
   {
    "vn": "200-002",
    "d": "Rygg",
    "niva": ".1",
    "type": "Komponent (Produseres selv)",
    "lager": 85,
    "ss": 5,
    "L": 1,
    "B": [
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "PM": [
     0,
     0,
     0,
     40,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     40,
     5,
     -20,
     5,
     5,
     5,
     5,
     5,
     5,
     5
    ],
    "NB": [
     0,
     0,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POM": [
     0,
     0,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POF": [
     0,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-003",
    "d": "Ryggtrekk",
    "niva": "..2",
    "type": "Komponent (Kjøpes inn)",
    "lager": 20,
    "ss": 30,
    "L": 2,
    "B": [
     0,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30
    ],
    "NB": [
     10,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POM": [
     10,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POF": [
     35,
     35,
     30,
     45,
     35,
     30,
     0,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "200-002",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-004",
    "d": "Hjul",
    "niva": ".1",
    "type": "Komponent (Kjøpes inn)",
    "lager": 300,
    "ss": 30,
    "L": 1,
    "B": [
     225,
     175,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     75,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30
    ],
    "NB": [
     0,
     130,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0
    ],
    "POM": [
     0,
     130,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0
    ],
    "POF": [
     130,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 5
     }
    ]
   },
   {
    "vn": "300-005",
    "d": "Gassfjær",
    "niva": ".1",
    "type": "Komponent (Kjøpes inn)",
    "lager": 400,
    "ss": 10,
    "L": 12,
    "B": [
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     50,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     355,
     320,
     295,
     255,
     270,
     240,
     195,
     160,
     130,
     130
    ],
    "NB": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "POM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "POF": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 1
     }
    ]
   }
  ],
  "mottak": [
   {
    "vn": "200-002",
    "uke": 4,
    "antall": 40
   },
   {
    "vn": "300-005",
    "uke": 5,
    "antall": 50
   }
  ],
  "eksepsjoner": [
   {
    "vn": "100-001",
    "uke": 1,
    "t": "BF",
    "melding": "Lager blir −10 i uke 1. Bestillingen på 15 måtte vært frigitt i uke 0, før horisonten. De 15 er forfalt og tatt med i frigivelsen på 45 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket."
   },
   {
    "vn": "200-001",
    "uke": 1,
    "t": "BF",
    "melding": "Lager blir −15 i uke 1. Bestillingen på 20 måtte vært frigitt i uke 0, før horisonten. De 20 er forfalt og tatt med i frigivelsen på 55 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket."
   },
   {
    "vn": "200-002",
    "uke": 3,
    "t": "MF",
    "melding": "Lager blir −20 i uke 3 før mottaket kommer. Det planlagte mottaket på 40 i uke 4 må fremskyndes til uke 3 i egen produksjon. Det lages ingen ny bestilling for behovet mottaket dekker."
   },
   {
    "vn": "300-003",
    "uke": 1,
    "t": "SS",
    "melding": "Lager blir 20 i uke 1, under sikkerhetslager 30, før ny leveranse kan komme inn. Bestillingen på 10 måtte vært frigitt i uke −1. De 10 er forfalt og tatt med i frigivelsen på 35 i uke 1, men kommer tidligst i uke 3."
   },
   {
    "vn": "300-005",
    "uke": null,
    "t": "LH",
    "melding": "Ledetiden fra ferdigproduktet (13 uker: Kontorstol Pro 1 + Gassfjær 12) er minst like lang som horisonten (10 uker). Behov etter uke 10 som må bestilles nå, vises ikke i planen. Vurder lengre horisont."
   },
   {
    "vn": "300-005",
    "uke": 5,
    "t": "KM",
    "melding": "Det planlagte mottaket på 50 i uke 5 trengs ikke i horisonten (uke 5–10). Vurder å kansellere eller utsette det."
   }
  ],
  "forslag": [
   {
    "vn": "100-001",
    "uke": 1,
    "mengde": 45,
    "forfalt": 15
   },
   {
    "vn": "200-001",
    "uke": 1,
    "mengde": 55,
    "forfalt": 20
   },
   {
    "vn": "300-001",
    "uke": 1,
    "mengde": 10,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 1,
    "mengde": 35,
    "forfalt": 10
   },
   {
    "vn": "300-004",
    "uke": 1,
    "mengde": 130,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 2,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 2,
    "mengde": 25,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 2,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 2,
    "mengde": 180,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 2,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 2,
    "mengde": 125,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 3,
    "mengde": 25,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 3,
    "mengde": 40,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 3,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 3,
    "mengde": 210,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 3,
    "mengde": 25,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 3,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 3,
    "mengde": 200,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 4,
    "mengde": 40,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 4,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 4,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 4,
    "mengde": 180,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 4,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 4,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 4,
    "mengde": 175,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 5,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 5,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 5,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 5,
    "mengde": 270,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 5,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 5,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 5,
    "mengde": 150,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 6,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 6,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 6,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 6,
    "mengde": 210,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 6,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 6,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 6,
    "mengde": 225,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 7,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 7,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 7,
    "mengde": 180,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 7,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 7,
    "mengde": 175,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 8,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 8,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 8,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 8,
    "mengde": 150,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 9,
    "mengde": 30,
    "forfalt": null
   }
  ],
  "utregning": {
   "100-001": {
    "1": "Bruttobehov = MPS = 30. Disponibel = 20 + 0 − 30 = −10. Nettobehov = maks(0, 5 − (−10)) = 15. Planlagt ordremottak = 15. Forventet lager = (−10) + 15 = 5. Frigis i uke 1 − 1 = 0, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = MPS = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = MPS = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = MPS = 25. Disponibel = 5 + 0 − 25 = −20. Nettobehov = maks(0, 5 − (−20)) = 25. Planlagt ordremottak = 25. Forventet lager = (−20) + 25 = 5. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = MPS = 40. Disponibel = 5 + 0 − 40 = −35. Nettobehov = maks(0, 5 − (−35)) = 40. Planlagt ordremottak = 40. Forventet lager = (−35) + 40 = 5. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = MPS = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = MPS = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = MPS = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = MPS = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = MPS = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 10 − 1 = 9."
   },
   "200-001": {
    "1": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 30 + 0 − 45 = −15. Nettobehov = maks(0, 5 − (−15)) = 20. Planlagt ordremottak = 20. Forventet lager = (−15) + 20 = 5. Frigis i uke 1 − 1 = 0, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = 1 × 25 (100-001) = 25. Disponibel = 5 + 0 − 25 = −20. Nettobehov = maks(0, 5 − (−20)) = 25. Planlagt ordremottak = 25. Forventet lager = (−20) + 25 = 5. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = 1 × 40 (100-001) = 40. Disponibel = 5 + 0 − 40 = −35. Nettobehov = maks(0, 5 − (−35)) = 40. Planlagt ordremottak = 40. Forventet lager = (−35) + 40 = 5. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = 1 × 0 (100-001) = 0. Disponibel = 5 + 0 − 0 = 5. Nettobehov = maks(0, 5 − 5) = 0. Forventet lager = 5 + 0 = 5."
   },
   "200-002": {
    "1": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 85 + 0 − 45 = 40. Nettobehov = maks(0, 5 − 40) = 0. Forventet lager = 40 + 0 = 40.",
    "2": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 40 + 0 − 35 = 5. Nettobehov = maks(0, 5 − 5) = 0. Forventet lager = 5 + 0 = 5.",
    "3": "Bruttobehov = 1 × 25 (100-001) = 25. Disponibel = 5 + 0 − 25 = −20. Nettobehov = maks(0, 5 − (−20)) = 25. Mottaket på 40 i uke 4 fremskyndes: disponibel = 20, nettobehov = maks(0, 5 − 20) = 0. Forventet lager = 20 + 0 = 20. Tabellen viser −20, fordi det fremskyndede mottaket ikke er kommet ennå.",
    "4": "Bruttobehov = 1 × 40 (100-001) = 40. Disponibel = 20 + 0 − 40 = −20 (mottaket i uke 4 er regnet med i uke 3). Nettobehov = maks(0, 5 − (−20)) = 25. Planlagt ordremottak = 25. Forventet lager = (−20) + 25 = 5. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = 1 × 0 (100-001) = 0. Disponibel = 5 + 0 − 0 = 5. Nettobehov = maks(0, 5 − 5) = 0. Forventet lager = 5 + 0 = 5."
   },
   "300-004": {
    "1": "Bruttobehov = 5 × 45 (100-001) = 225. Disponibel = 300 + 0 − 225 = 75. Nettobehov = maks(0, 30 − 75) = 0. Forventet lager = 75 + 0 = 75.",
    "2": "Bruttobehov = 5 × 35 (100-001) = 175. Disponibel = 75 + 0 − 175 = −100. Nettobehov = maks(0, 30 − (−100)) = 130. Planlagt ordremottak = 130. Forventet lager = (−100) + 130 = 30. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = 5 × 25 (100-001) = 125. Disponibel = 30 + 0 − 125 = −95. Nettobehov = maks(0, 30 − (−95)) = 125. Planlagt ordremottak = 125. Forventet lager = (−95) + 125 = 30. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = 5 × 40 (100-001) = 200. Disponibel = 30 + 0 − 200 = −170. Nettobehov = maks(0, 30 − (−170)) = 200. Planlagt ordremottak = 200. Forventet lager = (−170) + 200 = 30. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 5 × 35 (100-001) = 175. Disponibel = 30 + 0 − 175 = −145. Nettobehov = maks(0, 30 − (−145)) = 175. Planlagt ordremottak = 175. Forventet lager = (−145) + 175 = 30. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 5 × 30 (100-001) = 150. Disponibel = 30 + 0 − 150 = −120. Nettobehov = maks(0, 30 − (−120)) = 150. Planlagt ordremottak = 150. Forventet lager = (−120) + 150 = 30. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 5 × 45 (100-001) = 225. Disponibel = 30 + 0 − 225 = −195. Nettobehov = maks(0, 30 − (−195)) = 225. Planlagt ordremottak = 225. Forventet lager = (−195) + 225 = 30. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 5 × 35 (100-001) = 175. Disponibel = 30 + 0 − 175 = −145. Nettobehov = maks(0, 30 − (−145)) = 175. Planlagt ordremottak = 175. Forventet lager = (−145) + 175 = 30. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 5 × 30 (100-001) = 150. Disponibel = 30 + 0 − 150 = −120. Nettobehov = maks(0, 30 − (−120)) = 150. Planlagt ordremottak = 150. Forventet lager = (−120) + 150 = 30. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = 5 × 0 (100-001) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30."
   },
   "300-005": {
    "1": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 400 + 0 − 45 = 355. Nettobehov = maks(0, 10 − 355) = 0. Forventet lager = 355 + 0 = 355.",
    "2": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 355 + 0 − 35 = 320. Nettobehov = maks(0, 10 − 320) = 0. Forventet lager = 320 + 0 = 320.",
    "3": "Bruttobehov = 1 × 25 (100-001) = 25. Disponibel = 320 + 0 − 25 = 295. Nettobehov = maks(0, 10 − 295) = 0. Forventet lager = 295 + 0 = 295.",
    "4": "Bruttobehov = 1 × 40 (100-001) = 40. Disponibel = 295 + 0 − 40 = 255. Nettobehov = maks(0, 10 − 255) = 0. Forventet lager = 255 + 0 = 255.",
    "5": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 255 + 50 − 35 = 270. Nettobehov = maks(0, 10 − 270) = 0. Forventet lager = 270 + 0 = 270.",
    "6": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 270 + 0 − 30 = 240. Nettobehov = maks(0, 10 − 240) = 0. Forventet lager = 240 + 0 = 240.",
    "7": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 240 + 0 − 45 = 195. Nettobehov = maks(0, 10 − 195) = 0. Forventet lager = 195 + 0 = 195.",
    "8": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 195 + 0 − 35 = 160. Nettobehov = maks(0, 10 − 160) = 0. Forventet lager = 160 + 0 = 160.",
    "9": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 160 + 0 − 30 = 130. Nettobehov = maks(0, 10 − 130) = 0. Forventet lager = 130 + 0 = 130.",
    "10": "Bruttobehov = 1 × 0 (100-001) = 0. Disponibel = 130 + 0 − 0 = 130. Nettobehov = maks(0, 10 − 130) = 0. Forventet lager = 130 + 0 = 130."
   },
   "300-001": {
    "1": "Bruttobehov = 1 × 55 (200-001) = 55. Disponibel = 120 + 0 − 55 = 65. Nettobehov = maks(0, 10 − 65) = 0. Forventet lager = 65 + 0 = 65.",
    "2": "Bruttobehov = 1 × 25 (200-001) = 25. Disponibel = 65 + 0 − 25 = 40. Nettobehov = maks(0, 10 − 40) = 0. Forventet lager = 40 + 0 = 40.",
    "3": "Bruttobehov = 1 × 40 (200-001) = 40. Disponibel = 40 + 0 − 40 = 0. Nettobehov = maks(0, 10 − 0) = 10. Planlagt ordremottak = 10. Forventet lager = 0 + 10 = 10. Frigis i uke 3 − 2 = 1.",
    "4": "Bruttobehov = 1 × 35 (200-001) = 35. Disponibel = 10 + 0 − 35 = −25. Nettobehov = maks(0, 10 − (−25)) = 35. Planlagt ordremottak = 35. Forventet lager = (−25) + 35 = 10. Frigis i uke 4 − 2 = 2.",
    "5": "Bruttobehov = 1 × 30 (200-001) = 30. Disponibel = 10 + 0 − 30 = −20. Nettobehov = maks(0, 10 − (−20)) = 30. Planlagt ordremottak = 30. Forventet lager = (−20) + 30 = 10. Frigis i uke 5 − 2 = 3.",
    "6": "Bruttobehov = 1 × 45 (200-001) = 45. Disponibel = 10 + 0 − 45 = −35. Nettobehov = maks(0, 10 − (−35)) = 45. Planlagt ordremottak = 45. Forventet lager = (−35) + 45 = 10. Frigis i uke 6 − 2 = 4.",
    "7": "Bruttobehov = 1 × 35 (200-001) = 35. Disponibel = 10 + 0 − 35 = −25. Nettobehov = maks(0, 10 − (−25)) = 35. Planlagt ordremottak = 35. Forventet lager = (−25) + 35 = 10. Frigis i uke 7 − 2 = 5.",
    "8": "Bruttobehov = 1 × 30 (200-001) = 30. Disponibel = 10 + 0 − 30 = −20. Nettobehov = maks(0, 10 − (−20)) = 30. Planlagt ordremottak = 30. Forventet lager = (−20) + 30 = 10. Frigis i uke 8 − 2 = 6.",
    "9": "Bruttobehov = 1 × 0 (200-001) = 0. Disponibel = 10 + 0 − 0 = 10. Nettobehov = maks(0, 10 − 10) = 0. Forventet lager = 10 + 0 = 10.",
    "10": "Bruttobehov = 1 × 0 (200-001) = 0. Disponibel = 10 + 0 − 0 = 10. Nettobehov = maks(0, 10 − 10) = 0. Forventet lager = 10 + 0 = 10."
   },
   "300-002": {
    "1": "Bruttobehov = 4 × 55 (200-001) + 2 × 0 (200-002) = 220. Disponibel = 400 + 0 − 220 = 180. Nettobehov = maks(0, 50 − 180) = 0. Forventet lager = 180 + 0 = 180.",
    "2": "Bruttobehov = 4 × 25 (200-001) + 2 × 0 (200-002) = 100. Disponibel = 180 + 0 − 100 = 80. Nettobehov = maks(0, 50 − 80) = 0. Forventet lager = 80 + 0 = 80.",
    "3": "Bruttobehov = 4 × 40 (200-001) + 2 × 25 (200-002) = 210. Disponibel = 80 + 0 − 210 = −130. Nettobehov = maks(0, 50 − (−130)) = 180. Planlagt ordremottak = 180. Forventet lager = (−130) + 180 = 50. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = 4 × 35 (200-001) + 2 × 35 (200-002) = 210. Disponibel = 50 + 0 − 210 = −160. Nettobehov = maks(0, 50 − (−160)) = 210. Planlagt ordremottak = 210. Forventet lager = (−160) + 210 = 50. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 4 × 30 (200-001) + 2 × 30 (200-002) = 180. Disponibel = 50 + 0 − 180 = −130. Nettobehov = maks(0, 50 − (−130)) = 180. Planlagt ordremottak = 180. Forventet lager = (−130) + 180 = 50. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 4 × 45 (200-001) + 2 × 45 (200-002) = 270. Disponibel = 50 + 0 − 270 = −220. Nettobehov = maks(0, 50 − (−220)) = 270. Planlagt ordremottak = 270. Forventet lager = (−220) + 270 = 50. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 4 × 35 (200-001) + 2 × 35 (200-002) = 210. Disponibel = 50 + 0 − 210 = −160. Nettobehov = maks(0, 50 − (−160)) = 210. Planlagt ordremottak = 210. Forventet lager = (−160) + 210 = 50. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 4 × 30 (200-001) + 2 × 30 (200-002) = 180. Disponibel = 50 + 0 − 180 = −130. Nettobehov = maks(0, 50 − (−130)) = 180. Planlagt ordremottak = 180. Forventet lager = (−130) + 180 = 50. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 4 × 0 (200-001) + 2 × 0 (200-002) = 0. Disponibel = 50 + 0 − 0 = 50. Nettobehov = maks(0, 50 − 50) = 0. Forventet lager = 50 + 0 = 50.",
    "10": "Bruttobehov = 4 × 0 (200-001) + 2 × 0 (200-002) = 0. Disponibel = 50 + 0 − 0 = 50. Nettobehov = maks(0, 50 − 50) = 0. Forventet lager = 50 + 0 = 50."
   },
   "300-003": {
    "1": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 20 + 0 − 0 = 20. Nettobehov = maks(0, 30 − 20) = 10. Planlagt ordremottak = 10. Forventet lager = 20 + 10 = 30. Frigis i uke 1 − 2 = −1, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30.",
    "3": "Bruttobehov = 1 × 25 (200-002) = 25. Disponibel = 30 + 0 − 25 = 5. Nettobehov = maks(0, 30 − 5) = 25. Planlagt ordremottak = 25. Forventet lager = 5 + 25 = 30. Frigis i uke 3 − 2 = 1.",
    "4": "Bruttobehov = 1 × 35 (200-002) = 35. Disponibel = 30 + 0 − 35 = −5. Nettobehov = maks(0, 30 − (−5)) = 35. Planlagt ordremottak = 35. Forventet lager = (−5) + 35 = 30. Frigis i uke 4 − 2 = 2.",
    "5": "Bruttobehov = 1 × 30 (200-002) = 30. Disponibel = 30 + 0 − 30 = 0. Nettobehov = maks(0, 30 − 0) = 30. Planlagt ordremottak = 30. Forventet lager = 0 + 30 = 30. Frigis i uke 5 − 2 = 3.",
    "6": "Bruttobehov = 1 × 45 (200-002) = 45. Disponibel = 30 + 0 − 45 = −15. Nettobehov = maks(0, 30 − (−15)) = 45. Planlagt ordremottak = 45. Forventet lager = (−15) + 45 = 30. Frigis i uke 6 − 2 = 4.",
    "7": "Bruttobehov = 1 × 35 (200-002) = 35. Disponibel = 30 + 0 − 35 = −5. Nettobehov = maks(0, 30 − (−5)) = 35. Planlagt ordremottak = 35. Forventet lager = (−5) + 35 = 30. Frigis i uke 7 − 2 = 5.",
    "8": "Bruttobehov = 1 × 30 (200-002) = 30. Disponibel = 30 + 0 − 30 = 0. Nettobehov = maks(0, 30 − 0) = 30. Planlagt ordremottak = 30. Forventet lager = 0 + 30 = 30. Frigis i uke 8 − 2 = 6.",
    "9": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30.",
    "10": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30."
   }
  }
 },
 "03": {
  "H": 10,
  "meta": {
   "produkt": "Kontorstol Pro",
   "varenummer": "100-001",
   "horisont": 10,
   "fil": "testeksempel-03.xlsx",
   "kjort": "13.11.2026"
  },
  "deler": [
   {
    "vn": "100-001",
    "d": "Kontorstol Pro",
    "niva": "0",
    "type": "Ferdigvare",
    "lager": 20,
    "ss": 5,
    "L": 1,
    "B": [
     30,
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5
    ],
    "NB": [
     15,
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30
    ],
    "POM": [
     15,
     45,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30
    ],
    "POF": [
     60,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "foreldre": []
   },
   {
    "vn": "200-001",
    "d": "Sete",
    "niva": ".1",
    "type": "Komponent (Produseres selv)",
    "lager": 30,
    "ss": 5,
    "L": 1,
    "B": [
     60,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5,
     5
    ],
    "NB": [
     35,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POM": [
     35,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POF": [
     70,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-001",
    "d": "Seteplate",
    "niva": "..2",
    "type": "Komponent (Kjøpes inn)",
    "lager": 120,
    "ss": 10,
    "L": 2,
    "B": [
     70,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     50,
     25,
     10,
     10,
     10,
     10,
     10,
     10,
     10,
     10
    ],
    "NB": [
     0,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POM": [
     0,
     0,
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POF": [
     25,
     35,
     30,
     45,
     35,
     30,
     0,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "200-001",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-002",
    "d": "Skruesett M6",
    "niva": "..2",
    "type": "Komponent (Kjøpes inn)",
    "lager": 400,
    "ss": 50,
    "L": 1,
    "B": [
     280,
     100,
     240,
     210,
     180,
     270,
     210,
     180,
     0,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     120,
     50,
     50,
     50,
     50,
     50,
     50,
     50,
     50,
     50
    ],
    "NB": [
     0,
     30,
     240,
     210,
     180,
     270,
     210,
     180,
     0,
     0
    ],
    "POM": [
     0,
     30,
     240,
     210,
     180,
     270,
     210,
     180,
     0,
     0
    ],
    "POF": [
     30,
     240,
     210,
     180,
     270,
     210,
     180,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "200-001",
      "antall": 4
     },
     {
      "vn": "200-002",
      "antall": 2
     }
    ]
   },
   {
    "vn": "200-002",
    "d": "Rygg",
    "niva": ".1",
    "type": "Komponent (Produseres selv)",
    "lager": 85,
    "ss": 5,
    "L": 1,
    "B": [
     60,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "PM": [
     0,
     0,
     0,
     40,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     25,
     -10,
     -35,
     5,
     5,
     5,
     5,
     5,
     5,
     5
    ],
    "NB": [
     0,
     0,
     0,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POM": [
     0,
     0,
     0,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "POF": [
     0,
     0,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-003",
    "d": "Ryggtrekk",
    "niva": "..2",
    "type": "Komponent (Kjøpes inn)",
    "lager": 20,
    "ss": 30,
    "L": 2,
    "B": [
     0,
     0,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30
    ],
    "NB": [
     10,
     0,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POM": [
     10,
     0,
     40,
     35,
     30,
     45,
     35,
     30,
     0,
     0
    ],
    "POF": [
     50,
     35,
     30,
     45,
     35,
     30,
     0,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "200-002",
      "antall": 1
     }
    ]
   },
   {
    "vn": "300-004",
    "d": "Hjul",
    "niva": ".1",
    "type": "Komponent (Kjøpes inn)",
    "lager": 300,
    "ss": 30,
    "L": 1,
    "B": [
     300,
     175,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30,
     30
    ],
    "NB": [
     30,
     175,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0
    ],
    "POM": [
     30,
     175,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0
    ],
    "POF": [
     205,
     125,
     200,
     175,
     150,
     225,
     175,
     150,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 5
     }
    ]
   },
   {
    "vn": "300-005",
    "d": "Gassfjær",
    "niva": ".1",
    "type": "Komponent (Kjøpes inn)",
    "lager": 400,
    "ss": 10,
    "L": 12,
    "B": [
     60,
     35,
     25,
     40,
     35,
     30,
     45,
     35,
     30,
     0
    ],
    "PM": [
     0,
     0,
     0,
     0,
     50,
     0,
     0,
     0,
     0,
     0
    ],
    "FL": [
     340,
     305,
     280,
     240,
     255,
     225,
     180,
     145,
     115,
     115
    ],
    "NB": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "POM": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "POF": [
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0,
     0
    ],
    "foreldre": [
     {
      "vn": "100-001",
      "antall": 1
     }
    ]
   }
  ],
  "mottak": [
   {
    "vn": "200-002",
    "uke": 4,
    "antall": 40
   },
   {
    "vn": "300-005",
    "uke": 5,
    "antall": 50
   }
  ],
  "eksepsjoner": [
   {
    "vn": "100-001",
    "uke": 1,
    "t": "BF",
    "melding": "Lager blir −10 i uke 1. Bestillingen på 15 måtte vært frigitt i uke 0, før horisonten. De 15 er forfalt og tatt med i frigivelsen på 60 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket."
   },
   {
    "vn": "200-001",
    "uke": 1,
    "t": "BF",
    "melding": "Lager blir −30 i uke 1. Bestillingen på 35 måtte vært frigitt i uke 0, før horisonten. De 35 er forfalt og tatt med i frigivelsen på 70 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket."
   },
   {
    "vn": "200-002",
    "uke": 2,
    "t": "MF",
    "melding": "Lager blir −10 i uke 2 før mottaket kommer. Det planlagte mottaket på 40 i uke 4 må fremskyndes til uke 2 i egen produksjon. Det lages ingen ny bestilling for behovet mottaket dekker."
   },
   {
    "vn": "300-003",
    "uke": 1,
    "t": "SS",
    "melding": "Lager blir 20 i uke 1, under sikkerhetslager 30, før ny leveranse kan komme inn. Bestillingen på 10 måtte vært frigitt i uke −1. De 10 er forfalt og tatt med i frigivelsen på 50 i uke 1, men kommer tidligst i uke 3."
   },
   {
    "vn": "300-004",
    "uke": 1,
    "t": "SS",
    "melding": "Lager blir 0 i uke 1, under sikkerhetslager 30, før ny leveranse kan komme inn. Bestillingen på 30 måtte vært frigitt i uke 0. De 30 er forfalt og tatt med i frigivelsen på 205 i uke 1, men kommer tidligst i uke 2."
   },
   {
    "vn": "300-005",
    "uke": null,
    "t": "LH",
    "melding": "Ledetiden fra ferdigproduktet (13 uker: Kontorstol Pro 1 + Gassfjær 12) er minst like lang som horisonten (10 uker). Behov etter uke 10 som må bestilles nå, vises ikke i planen. Vurder lengre horisont."
   },
   {
    "vn": "300-005",
    "uke": 5,
    "t": "KM",
    "melding": "Det planlagte mottaket på 50 i uke 5 trengs ikke i horisonten (uke 5–10). Vurder å kansellere eller utsette det."
   }
  ],
  "forslag": [
   {
    "vn": "100-001",
    "uke": 1,
    "mengde": 60,
    "forfalt": 15
   },
   {
    "vn": "200-001",
    "uke": 1,
    "mengde": 70,
    "forfalt": 35
   },
   {
    "vn": "300-001",
    "uke": 1,
    "mengde": 25,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 1,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 1,
    "mengde": 50,
    "forfalt": 10
   },
   {
    "vn": "300-004",
    "uke": 1,
    "mengde": 205,
    "forfalt": 30
   },
   {
    "vn": "100-001",
    "uke": 2,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 2,
    "mengde": 25,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 2,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 2,
    "mengde": 240,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 2,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 2,
    "mengde": 125,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 3,
    "mengde": 25,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 3,
    "mengde": 40,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 3,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 3,
    "mengde": 210,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 3,
    "mengde": 40,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 3,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 3,
    "mengde": 200,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 4,
    "mengde": 40,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 4,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 4,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 4,
    "mengde": 180,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 4,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 4,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 4,
    "mengde": 175,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 5,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 5,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 5,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 5,
    "mengde": 270,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 5,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 5,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 5,
    "mengde": 150,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 6,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 6,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-001",
    "uke": 6,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 6,
    "mengde": 210,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 6,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "300-003",
    "uke": 6,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 6,
    "mengde": 225,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 7,
    "mengde": 45,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 7,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-002",
    "uke": 7,
    "mengde": 180,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 7,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 7,
    "mengde": 175,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 8,
    "mengde": 35,
    "forfalt": null
   },
   {
    "vn": "200-001",
    "uke": 8,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "200-002",
    "uke": 8,
    "mengde": 30,
    "forfalt": null
   },
   {
    "vn": "300-004",
    "uke": 8,
    "mengde": 150,
    "forfalt": null
   },
   {
    "vn": "100-001",
    "uke": 9,
    "mengde": 30,
    "forfalt": null
   }
  ],
  "utregning": {
   "100-001": {
    "1": "Bruttobehov = MPS = 30. Disponibel = 20 + 0 − 30 = −10. Nettobehov = maks(0, 5 − (−10)) = 15. Planlagt ordremottak = 15. Forventet lager = (−10) + 15 = 5. Frigis i uke 1 − 1 = 0, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = MPS = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = MPS = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = MPS = 25. Disponibel = 5 + 0 − 25 = −20. Nettobehov = maks(0, 5 − (−20)) = 25. Planlagt ordremottak = 25. Forventet lager = (−20) + 25 = 5. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = MPS = 40. Disponibel = 5 + 0 − 40 = −35. Nettobehov = maks(0, 5 − (−35)) = 40. Planlagt ordremottak = 40. Forventet lager = (−35) + 40 = 5. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = MPS = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = MPS = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = MPS = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = MPS = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = MPS = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 10 − 1 = 9."
   },
   "200-001": {
    "1": "Bruttobehov = 1 × 60 (100-001) = 60. Disponibel = 30 + 0 − 60 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 1 − 1 = 0, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = 1 × 25 (100-001) = 25. Disponibel = 5 + 0 − 25 = −20. Nettobehov = maks(0, 5 − (−20)) = 25. Planlagt ordremottak = 25. Forventet lager = (−20) + 25 = 5. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = 1 × 40 (100-001) = 40. Disponibel = 5 + 0 − 40 = −35. Nettobehov = maks(0, 5 − (−35)) = 40. Planlagt ordremottak = 40. Forventet lager = (−35) + 40 = 5. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = 1 × 0 (100-001) = 0. Disponibel = 5 + 0 − 0 = 5. Nettobehov = maks(0, 5 − 5) = 0. Forventet lager = 5 + 0 = 5."
   },
   "200-002": {
    "1": "Bruttobehov = 1 × 60 (100-001) = 60. Disponibel = 85 + 0 − 60 = 25. Nettobehov = maks(0, 5 − 25) = 0. Forventet lager = 25 + 0 = 25.",
    "2": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 25 + 0 − 35 = −10. Nettobehov = maks(0, 5 − (−10)) = 15. Mottaket på 40 i uke 4 fremskyndes: disponibel = 30, nettobehov = maks(0, 5 − 30) = 0. Forventet lager = 30 + 0 = 30. Tabellen viser −10, fordi det fremskyndede mottaket ikke er kommet ennå.",
    "3": "Bruttobehov = 1 × 25 (100-001) = 25. Disponibel = 30 + 0 − 25 = 5. Nettobehov = maks(0, 5 − 5) = 0. Forventet lager = 5 + 0 = 5. Tabellen viser −35, fordi det fremskyndede mottaket ikke er kommet ennå.",
    "4": "Bruttobehov = 1 × 40 (100-001) = 40. Disponibel = 5 + 0 − 40 = −35 (mottaket i uke 4 er regnet med i uke 2). Nettobehov = maks(0, 5 − (−35)) = 40. Planlagt ordremottak = 40. Forventet lager = (−35) + 40 = 5. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 5 + 0 − 45 = −40. Nettobehov = maks(0, 5 − (−40)) = 45. Planlagt ordremottak = 45. Forventet lager = (−40) + 45 = 5. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 5 + 0 − 35 = −30. Nettobehov = maks(0, 5 − (−30)) = 35. Planlagt ordremottak = 35. Forventet lager = (−30) + 35 = 5. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 5 + 0 − 30 = −25. Nettobehov = maks(0, 5 − (−25)) = 30. Planlagt ordremottak = 30. Forventet lager = (−25) + 30 = 5. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = 1 × 0 (100-001) = 0. Disponibel = 5 + 0 − 0 = 5. Nettobehov = maks(0, 5 − 5) = 0. Forventet lager = 5 + 0 = 5."
   },
   "300-004": {
    "1": "Bruttobehov = 5 × 60 (100-001) = 300. Disponibel = 300 + 0 − 300 = 0. Nettobehov = maks(0, 30 − 0) = 30. Planlagt ordremottak = 30. Forventet lager = 0 + 30 = 30. Frigis i uke 1 − 1 = 0, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = 5 × 35 (100-001) = 175. Disponibel = 30 + 0 − 175 = −145. Nettobehov = maks(0, 30 − (−145)) = 175. Planlagt ordremottak = 175. Forventet lager = (−145) + 175 = 30. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = 5 × 25 (100-001) = 125. Disponibel = 30 + 0 − 125 = −95. Nettobehov = maks(0, 30 − (−95)) = 125. Planlagt ordremottak = 125. Forventet lager = (−95) + 125 = 30. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = 5 × 40 (100-001) = 200. Disponibel = 30 + 0 − 200 = −170. Nettobehov = maks(0, 30 − (−170)) = 200. Planlagt ordremottak = 200. Forventet lager = (−170) + 200 = 30. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 5 × 35 (100-001) = 175. Disponibel = 30 + 0 − 175 = −145. Nettobehov = maks(0, 30 − (−145)) = 175. Planlagt ordremottak = 175. Forventet lager = (−145) + 175 = 30. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 5 × 30 (100-001) = 150. Disponibel = 30 + 0 − 150 = −120. Nettobehov = maks(0, 30 − (−120)) = 150. Planlagt ordremottak = 150. Forventet lager = (−120) + 150 = 30. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 5 × 45 (100-001) = 225. Disponibel = 30 + 0 − 225 = −195. Nettobehov = maks(0, 30 − (−195)) = 225. Planlagt ordremottak = 225. Forventet lager = (−195) + 225 = 30. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 5 × 35 (100-001) = 175. Disponibel = 30 + 0 − 175 = −145. Nettobehov = maks(0, 30 − (−145)) = 175. Planlagt ordremottak = 175. Forventet lager = (−145) + 175 = 30. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 5 × 30 (100-001) = 150. Disponibel = 30 + 0 − 150 = −120. Nettobehov = maks(0, 30 − (−120)) = 150. Planlagt ordremottak = 150. Forventet lager = (−120) + 150 = 30. Frigis i uke 9 − 1 = 8.",
    "10": "Bruttobehov = 5 × 0 (100-001) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30."
   },
   "300-005": {
    "1": "Bruttobehov = 1 × 60 (100-001) = 60. Disponibel = 400 + 0 − 60 = 340. Nettobehov = maks(0, 10 − 340) = 0. Forventet lager = 340 + 0 = 340.",
    "2": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 340 + 0 − 35 = 305. Nettobehov = maks(0, 10 − 305) = 0. Forventet lager = 305 + 0 = 305.",
    "3": "Bruttobehov = 1 × 25 (100-001) = 25. Disponibel = 305 + 0 − 25 = 280. Nettobehov = maks(0, 10 − 280) = 0. Forventet lager = 280 + 0 = 280.",
    "4": "Bruttobehov = 1 × 40 (100-001) = 40. Disponibel = 280 + 0 − 40 = 240. Nettobehov = maks(0, 10 − 240) = 0. Forventet lager = 240 + 0 = 240.",
    "5": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 240 + 50 − 35 = 255. Nettobehov = maks(0, 10 − 255) = 0. Forventet lager = 255 + 0 = 255.",
    "6": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 255 + 0 − 30 = 225. Nettobehov = maks(0, 10 − 225) = 0. Forventet lager = 225 + 0 = 225.",
    "7": "Bruttobehov = 1 × 45 (100-001) = 45. Disponibel = 225 + 0 − 45 = 180. Nettobehov = maks(0, 10 − 180) = 0. Forventet lager = 180 + 0 = 180.",
    "8": "Bruttobehov = 1 × 35 (100-001) = 35. Disponibel = 180 + 0 − 35 = 145. Nettobehov = maks(0, 10 − 145) = 0. Forventet lager = 145 + 0 = 145.",
    "9": "Bruttobehov = 1 × 30 (100-001) = 30. Disponibel = 145 + 0 − 30 = 115. Nettobehov = maks(0, 10 − 115) = 0. Forventet lager = 115 + 0 = 115.",
    "10": "Bruttobehov = 1 × 0 (100-001) = 0. Disponibel = 115 + 0 − 0 = 115. Nettobehov = maks(0, 10 − 115) = 0. Forventet lager = 115 + 0 = 115."
   },
   "300-001": {
    "1": "Bruttobehov = 1 × 70 (200-001) = 70. Disponibel = 120 + 0 − 70 = 50. Nettobehov = maks(0, 10 − 50) = 0. Forventet lager = 50 + 0 = 50.",
    "2": "Bruttobehov = 1 × 25 (200-001) = 25. Disponibel = 50 + 0 − 25 = 25. Nettobehov = maks(0, 10 − 25) = 0. Forventet lager = 25 + 0 = 25.",
    "3": "Bruttobehov = 1 × 40 (200-001) = 40. Disponibel = 25 + 0 − 40 = −15. Nettobehov = maks(0, 10 − (−15)) = 25. Planlagt ordremottak = 25. Forventet lager = (−15) + 25 = 10. Frigis i uke 3 − 2 = 1.",
    "4": "Bruttobehov = 1 × 35 (200-001) = 35. Disponibel = 10 + 0 − 35 = −25. Nettobehov = maks(0, 10 − (−25)) = 35. Planlagt ordremottak = 35. Forventet lager = (−25) + 35 = 10. Frigis i uke 4 − 2 = 2.",
    "5": "Bruttobehov = 1 × 30 (200-001) = 30. Disponibel = 10 + 0 − 30 = −20. Nettobehov = maks(0, 10 − (−20)) = 30. Planlagt ordremottak = 30. Forventet lager = (−20) + 30 = 10. Frigis i uke 5 − 2 = 3.",
    "6": "Bruttobehov = 1 × 45 (200-001) = 45. Disponibel = 10 + 0 − 45 = −35. Nettobehov = maks(0, 10 − (−35)) = 45. Planlagt ordremottak = 45. Forventet lager = (−35) + 45 = 10. Frigis i uke 6 − 2 = 4.",
    "7": "Bruttobehov = 1 × 35 (200-001) = 35. Disponibel = 10 + 0 − 35 = −25. Nettobehov = maks(0, 10 − (−25)) = 35. Planlagt ordremottak = 35. Forventet lager = (−25) + 35 = 10. Frigis i uke 7 − 2 = 5.",
    "8": "Bruttobehov = 1 × 30 (200-001) = 30. Disponibel = 10 + 0 − 30 = −20. Nettobehov = maks(0, 10 − (−20)) = 30. Planlagt ordremottak = 30. Forventet lager = (−20) + 30 = 10. Frigis i uke 8 − 2 = 6.",
    "9": "Bruttobehov = 1 × 0 (200-001) = 0. Disponibel = 10 + 0 − 0 = 10. Nettobehov = maks(0, 10 − 10) = 0. Forventet lager = 10 + 0 = 10.",
    "10": "Bruttobehov = 1 × 0 (200-001) = 0. Disponibel = 10 + 0 − 0 = 10. Nettobehov = maks(0, 10 − 10) = 0. Forventet lager = 10 + 0 = 10."
   },
   "300-002": {
    "1": "Bruttobehov = 4 × 70 (200-001) + 2 × 0 (200-002) = 280. Disponibel = 400 + 0 − 280 = 120. Nettobehov = maks(0, 50 − 120) = 0. Forventet lager = 120 + 0 = 120.",
    "2": "Bruttobehov = 4 × 25 (200-001) + 2 × 0 (200-002) = 100. Disponibel = 120 + 0 − 100 = 20. Nettobehov = maks(0, 50 − 20) = 30. Planlagt ordremottak = 30. Forventet lager = 20 + 30 = 50. Frigis i uke 2 − 1 = 1.",
    "3": "Bruttobehov = 4 × 40 (200-001) + 2 × 40 (200-002) = 240. Disponibel = 50 + 0 − 240 = −190. Nettobehov = maks(0, 50 − (−190)) = 240. Planlagt ordremottak = 240. Forventet lager = (−190) + 240 = 50. Frigis i uke 3 − 1 = 2.",
    "4": "Bruttobehov = 4 × 35 (200-001) + 2 × 35 (200-002) = 210. Disponibel = 50 + 0 − 210 = −160. Nettobehov = maks(0, 50 − (−160)) = 210. Planlagt ordremottak = 210. Forventet lager = (−160) + 210 = 50. Frigis i uke 4 − 1 = 3.",
    "5": "Bruttobehov = 4 × 30 (200-001) + 2 × 30 (200-002) = 180. Disponibel = 50 + 0 − 180 = −130. Nettobehov = maks(0, 50 − (−130)) = 180. Planlagt ordremottak = 180. Forventet lager = (−130) + 180 = 50. Frigis i uke 5 − 1 = 4.",
    "6": "Bruttobehov = 4 × 45 (200-001) + 2 × 45 (200-002) = 270. Disponibel = 50 + 0 − 270 = −220. Nettobehov = maks(0, 50 − (−220)) = 270. Planlagt ordremottak = 270. Forventet lager = (−220) + 270 = 50. Frigis i uke 6 − 1 = 5.",
    "7": "Bruttobehov = 4 × 35 (200-001) + 2 × 35 (200-002) = 210. Disponibel = 50 + 0 − 210 = −160. Nettobehov = maks(0, 50 − (−160)) = 210. Planlagt ordremottak = 210. Forventet lager = (−160) + 210 = 50. Frigis i uke 7 − 1 = 6.",
    "8": "Bruttobehov = 4 × 30 (200-001) + 2 × 30 (200-002) = 180. Disponibel = 50 + 0 − 180 = −130. Nettobehov = maks(0, 50 − (−130)) = 180. Planlagt ordremottak = 180. Forventet lager = (−130) + 180 = 50. Frigis i uke 8 − 1 = 7.",
    "9": "Bruttobehov = 4 × 0 (200-001) + 2 × 0 (200-002) = 0. Disponibel = 50 + 0 − 0 = 50. Nettobehov = maks(0, 50 − 50) = 0. Forventet lager = 50 + 0 = 50.",
    "10": "Bruttobehov = 4 × 0 (200-001) + 2 × 0 (200-002) = 0. Disponibel = 50 + 0 − 0 = 50. Nettobehov = maks(0, 50 − 50) = 0. Forventet lager = 50 + 0 = 50."
   },
   "300-003": {
    "1": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 20 + 0 − 0 = 20. Nettobehov = maks(0, 30 − 20) = 10. Planlagt ordremottak = 10. Forventet lager = 20 + 10 = 30. Frigis i uke 1 − 2 = −1, før horisonten: forfalt, legges i uke 1.",
    "2": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30.",
    "3": "Bruttobehov = 1 × 40 (200-002) = 40. Disponibel = 30 + 0 − 40 = −10. Nettobehov = maks(0, 30 − (−10)) = 40. Planlagt ordremottak = 40. Forventet lager = (−10) + 40 = 30. Frigis i uke 3 − 2 = 1.",
    "4": "Bruttobehov = 1 × 35 (200-002) = 35. Disponibel = 30 + 0 − 35 = −5. Nettobehov = maks(0, 30 − (−5)) = 35. Planlagt ordremottak = 35. Forventet lager = (−5) + 35 = 30. Frigis i uke 4 − 2 = 2.",
    "5": "Bruttobehov = 1 × 30 (200-002) = 30. Disponibel = 30 + 0 − 30 = 0. Nettobehov = maks(0, 30 − 0) = 30. Planlagt ordremottak = 30. Forventet lager = 0 + 30 = 30. Frigis i uke 5 − 2 = 3.",
    "6": "Bruttobehov = 1 × 45 (200-002) = 45. Disponibel = 30 + 0 − 45 = −15. Nettobehov = maks(0, 30 − (−15)) = 45. Planlagt ordremottak = 45. Forventet lager = (−15) + 45 = 30. Frigis i uke 6 − 2 = 4.",
    "7": "Bruttobehov = 1 × 35 (200-002) = 35. Disponibel = 30 + 0 − 35 = −5. Nettobehov = maks(0, 30 − (−5)) = 35. Planlagt ordremottak = 35. Forventet lager = (−5) + 35 = 30. Frigis i uke 7 − 2 = 5.",
    "8": "Bruttobehov = 1 × 30 (200-002) = 30. Disponibel = 30 + 0 − 30 = 0. Nettobehov = maks(0, 30 − 0) = 30. Planlagt ordremottak = 30. Forventet lager = 0 + 30 = 30. Frigis i uke 8 − 2 = 6.",
    "9": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30.",
    "10": "Bruttobehov = 1 × 0 (200-002) = 0. Disponibel = 30 + 0 − 0 = 30. Nettobehov = maks(0, 30 − 30) = 0. Forventet lager = 30 + 0 = 30."
   }
  }
 },
 "SAMMENLIGNING": {
  "02>03": [
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "100-001",
    "uke": 1,
    "for": "45",
    "etter": "60",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "200-001",
    "uke": 1,
    "for": "55",
    "etter": "70",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-001",
    "uke": 1,
    "for": "10",
    "etter": "25",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Nytt",
    "vn": "300-002",
    "uke": 1,
    "for": null,
    "etter": "30",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-002",
    "uke": 2,
    "for": "180",
    "etter": "240",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "200-002",
    "uke": 3,
    "for": "25",
    "etter": "40",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-003",
    "uke": 1,
    "for": "35",
    "etter": "50",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-004",
    "uke": 1,
    "for": "130",
    "etter": "205",
    "melding": null
   },
   {
    "hva": "Eksepsjon",
    "endring": "Ny",
    "vn": "200-002",
    "uke": 2,
    "for": null,
    "etter": "Mottak forsinket",
    "melding": "Lager blir −10 i uke 2 før mottaket kommer. Det planlagte mottaket på 40 i uke 4 må fremskyndes til uke 2 i egen produksjon. Det lages ingen ny bestilling for behovet mottaket dekker."
   },
   {
    "hva": "Eksepsjon",
    "endring": "Borte",
    "vn": "200-002",
    "uke": 3,
    "for": "Mottak forsinket",
    "etter": null,
    "melding": "Lager blir −20 i uke 3 før mottaket kommer. Det planlagte mottaket på 40 i uke 4 må fremskyndes til uke 3 i egen produksjon. Det lages ingen ny bestilling for behovet mottaket dekker."
   },
   {
    "hva": "Eksepsjon",
    "endring": "Ny",
    "vn": "300-004",
    "uke": 1,
    "for": null,
    "etter": "Bruk av sikkerhetslager",
    "melding": "Lager blir 0 i uke 1, under sikkerhetslager 30, før ny leveranse kan komme inn. Bestillingen på 30 måtte vært frigitt i uke 0. De 30 er forfalt og tatt med i frigivelsen på 205 i uke 1, men kommer tidligst i uke 2."
   }
  ],
  "03>02": [
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "100-001",
    "uke": 1,
    "for": "60",
    "etter": "45",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "200-001",
    "uke": 1,
    "for": "70",
    "etter": "55",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-001",
    "uke": 1,
    "for": "25",
    "etter": "10",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Fjernet",
    "vn": "300-002",
    "uke": 1,
    "for": "30",
    "etter": null,
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-002",
    "uke": 2,
    "for": "240",
    "etter": "180",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "200-002",
    "uke": 3,
    "for": "40",
    "etter": "25",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-003",
    "uke": 1,
    "for": "50",
    "etter": "35",
    "melding": null
   },
   {
    "hva": "Bestillingsforslag",
    "endring": "Endret mengde",
    "vn": "300-004",
    "uke": 1,
    "for": "205",
    "etter": "130",
    "melding": null
   },
   {
    "hva": "Eksepsjon",
    "endring": "Borte",
    "vn": "200-002",
    "uke": 2,
    "for": "Mottak forsinket",
    "etter": null,
    "melding": "Lager blir −10 i uke 2 før mottaket kommer. Det planlagte mottaket på 40 i uke 4 må fremskyndes til uke 2 i egen produksjon. Det lages ingen ny bestilling for behovet mottaket dekker."
   },
   {
    "hva": "Eksepsjon",
    "endring": "Ny",
    "vn": "200-002",
    "uke": 3,
    "for": null,
    "etter": "Mottak forsinket",
    "melding": "Lager blir −20 i uke 3 før mottaket kommer. Det planlagte mottaket på 40 i uke 4 må fremskyndes til uke 3 i egen produksjon. Det lages ingen ny bestilling for behovet mottaket dekker."
   },
   {
    "hva": "Eksepsjon",
    "endring": "Borte",
    "vn": "300-004",
    "uke": 1,
    "for": "Bruk av sikkerhetslager",
    "etter": null,
    "melding": "Lager blir 0 i uke 1, under sikkerhetslager 30, før ny leveranse kan komme inn. Bestillingen på 30 måtte vært frigitt i uke 0. De 30 er forfalt og tatt med i frigivelsen på 205 i uke 1, men kommer tidligst i uke 2."
   }
  ]
 }
};
