// Tester for kontrollen av arket Stykkliste (Story 1.8, FR-3), med RaaArk bygd i koden.
// Valideringsfilene V-S01–V-S29 og V-G04 testes i tests/validering/stykkliste.test.ts.

import { describe, expect, it } from 'vitest'
import {
  STYKKLISTE_KOLONNER,
  type Celleverdi,
  type RaaArk,
  type RaaRad,
  type StykklisteKolonne,
  type Valideringsfeil,
} from '../../src/domene/typer.ts'
import { MAKS_RADER, validerStykklisteVerdier } from '../../src/domene/valider-stykkliste.ts'

type Stykkliste = NonNullable<RaaArk['stykkliste']>
type Verdier = [Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi]

function raderFra(verdier: Verdier[], førsteRad = 2): RaaRad<StykklisteKolonne>[] {
  return verdier.map((v, i) => {
    const celler: RaaRad<StykklisteKolonne>['celler'] = {}
    STYKKLISTE_KOLONNER.forEach((kolonne, k) => {
      celler[kolonne] = v[k]
    })
    return { excelRad: førsteRad + i, celler }
  })
}

function arkFra(verdier: Verdier[], ekstra: Partial<Stykkliste> = {}): Stykkliste {
  const overskrifter = {} as Stykkliste['overskrifter']
  STYKKLISTE_KOLONNER.forEach((navn, i) => {
    overskrifter[navn] = String.fromCharCode(65 + i)
  })
  return { overskrifter, rader: raderFra(verdier), tomRadMedInnholdUnder: null, ...ekstra }
}

/** Testeksempel 02: ferdigprodukt, to deler som produseres selv og en felles del (300-002) i rad 5 og 7. */
const GYLDIG: Verdier[] = [
  ['0', '100-001', 'Kontorstol Pro', null, 'Ferdigvare', 20, 5, 1],
  ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 30, 5, 1],
  ['..2', '300-001', 'Seteplate', 1, 'Komponent (Kjøpes inn)', 120, 10, 2],
  ['..2', '300-002', 'Skruesett M6', 4, 'Komponent (Kjøpes inn)', 400, 50, 1],
  ['.1', '200-002', 'Rygg', 1, 'Komponent (Produseres selv)', 85, 5, 1],
  ['..2', '300-002', 'Skruesett M6', 2, 'Komponent (Kjøpes inn)', null, null, null],
  ['..2', '300-003', 'Ryggtrekk', 1, 'Komponent (Kjøpes inn)', 20, 30, 2],
  ['.1', '300-004', 'Hjul', 5, 'Komponent (Kjøpes inn)', 300, 30, 1],
  ['.1', '300-005', 'Gassfjær', 1, 'Komponent (Kjøpes inn)', 400, 10, 12],
]

/** Rad 2 er indeks 0. Endrer én celle i en kopi av stykklisten. */
function endre(verdier: Verdier[], indeks: number, kolonne: number, verdi: Celleverdi): Verdier[] {
  const kopi = verdier.map((v) => [...v] as Verdier)
  kopi[indeks]![kolonne] = verdi
  return kopi
}

const NIVAA = 0
const VARENUMMER = 1
const BESKRIVELSE = 2
const ANTALL = 3
const TYPE = 4
const LAGER = 5
const SS = 6
const LEDETID = 7

function valider(ark: Stykkliste, hoppesOver: StykklisteKolonne[] = []): Valideringsfeil[] {
  return validerStykklisteVerdier(ark, (felt) => hoppesOver.includes(felt))
}

/** «KODE@sted», for eksempel «ANTALL_UGYLDIG@D9» eller «UNDERDELER_ULIKE@rad 12». */
function kort(feil: Valideringsfeil[]): string[] {
  return feil.map((f) => {
    const sted = f.sted.type === 'CELLE' ? f.sted.celle : f.sted.type === 'RAD' ? `rad ${f.sted.excelRad}` : f.sted.type
    return `${f.kode}@${sted}`
  })
}

const feilIVerdier = (verdier: Verdier[], hoppesOver: StykklisteKolonne[] = []) => kort(valider(arkFra(verdier), hoppesOver))

describe('en gyldig stykkliste', () => {
  it('gir 0 feil, også med felles del, tall som tekst og varenummer som tall', () => {
    expect(valider(arkFra(GYLDIG))).toEqual([])
    expect(feilIVerdier(endre(endre(GYLDIG, 3, ANTALL, '7'), 0, NIVAA, 0))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 3, ANTALL, '007'))).toEqual([])
    // 300001 som tall i rad 4 og «300001» som tekst i rad 11 er samme varenummer.
    const medTall = endre(GYLDIG, 2, VARENUMMER, 300001)
    expect(feilIVerdier([...medTall, ['.1', '300001', 'Seteplate', 1, 'Komponent (Kjøpes inn)', null, null, null]])).toEqual([])
  })

  it('kaster ikke og gir ikke feil for sannhetsverdier og andre merkelige celler: de blir feil på cellen', () => {
    expect(() => valider(arkFra(endre(GYLDIG, 1, NIVAA, true)))).not.toThrow()
    expect(feilIVerdier(endre(GYLDIG, 1, NIVAA, true))).toContain('NIVAA_UGYLDIG@A3')
    expect(feilIVerdier(endre(GYLDIG, 1, ANTALL, false))).toContain('ANTALL_UGYLDIG@D3')
  })

  it('endrer ikke radene som sendes inn', () => {
    const ark = arkFra(endre(GYLDIG, 3, ANTALL, 'fem'))
    const kopi = structuredClone(ark)
    valider(ark)
    expect(ark).toEqual(kopi)
  })
})

describe('rader (FR-3)', () => {
  it('innhold under en tom rad gir én feil på den tomme raden', () => {
    expect(kort(valider(arkFra(GYLDIG, { tomRadMedInnholdUnder: 11 })))).toEqual(['RADER_IKKE_SAMMENHENGENDE@rad 11'])
  })

  it(`mer enn ${MAKS_RADER} rader gir én feil på den første raden over, og den kontrolleres ikke ellers`, () => {
    const rader: Verdier[] = [GYLDIG[0]!, GYLDIG[1]!]
    while (rader.length < MAKS_RADER) rader.push(['.1', `300-${rader.length}`, 'Del', 1, 'Komponent (Kjøpes inn)', 1, 0, 1])
    // Rad 1001 er rad 1002 i arket. Den har bare tull i seg, men er utenfor malen og kontrolleres ikke.
    rader.push([null, null, null, 'tull', 'tull', 'tull', 'tull', 'tull'])
    expect(rader).toHaveLength(MAKS_RADER + 1)
    expect(kort(valider(arkFra(rader)))).toEqual(['RADER_FOR_MANGE@rad 1002'])
    expect(kort(valider(arkFra(rader.slice(0, MAKS_RADER))))).toEqual([])
  })

  it('ingen rad med nivå .1 gir én feil på første rad, og en tom stykkliste gir den på rad 2', () => {
    expect(kort(valider(arkFra([GYLDIG[0]!])))).toEqual(['RADER_INGEN_NIVAA_1@rad 2'])
    expect(kort(valider(arkFra([])))).toEqual(['RADER_INGEN_NIVAA_1@rad 2'])
  })

  it('når første rad er nivå .1, er det bare nivåfeilen, ikke «ingen nivå .1» og ikke «ingen Ferdigvare»', () => {
    expect(feilIVerdier(endre(endre(endre(GYLDIG, 0, NIVAA, '.1'), 0, ANTALL, 1), 0, TYPE, 'Komponent (Produseres selv)'))).toEqual([
      'NIVAA_FORSTE_RAD_IKKE_0@A2',
    ])
  })
})

describe('nivå (FR-3)', () => {
  it.each([
    ['3', 'NIVAA_UGYLDIG'],
    ['..3', 'NIVAA_UGYLDIG'],
    [null, 'NIVAA_UGYLDIG'],
    ['', 'NIVAA_UGYLDIG'],
    [1, 'NIVAA_UGYLDIG'],
  ] as const)('«%s» i rad 7 gir %s', (verdi, kode) => {
    expect(feilIVerdier(endre(GYLDIG, 5, NIVAA, verdi))).toEqual([`${kode}@A7`])
  })

  it('første rad som ikke er 0, og en ekstra rad med nivå 0', () => {
    expect(feilIVerdier(endre(endre(endre(GYLDIG, 0, NIVAA, '.1'), 0, ANTALL, 1), 0, TYPE, 'Komponent (Produseres selv)'))).toEqual([
      'NIVAA_FORSTE_RAD_IKKE_0@A2',
    ])
    expect(feilIVerdier([...GYLDIG, ['0', '100-002', 'Stol 2', null, 'Ferdigvare', 0, 0, 0]])).toEqual(['NIVAA_FLERE_NIVAA_0@A11'])
  })

  it('..2 rett under nivå 0 er en feil, men ..2 under ..2 er greit', () => {
    expect(feilIVerdier(endre(GYLDIG, 1, NIVAA, '..2'))).toEqual(['NIVAA_2_UTEN_NIVAA_1_OVER@A3'])
  })

  it('en rad med ugyldig nivå gir ikke følgefeil i raden under', () => {
    // Rad 4 er «3», og rad 5 er ..2. Vi vet ikke hva som står over, så bare rad 4 er en feil.
    expect(feilIVerdier(endre(GYLDIG, 2, NIVAA, '3'))).toEqual(['NIVAA_UGYLDIG@A4'])
  })
})

describe('varenummer (FR-3)', () => {
  it('mangler: én feil, og ingen følgefeil for lager, sikkerhetslager og ledetid i samme rad', () => {
    expect(feilIVerdier(endre(GYLDIG, 2, VARENUMMER, null))).toEqual(['VARENUMMER_MANGLER@B4'])
    expect(feilIVerdier(endre(GYLDIG, 2, VARENUMMER, '  '))).toEqual(['VARENUMMER_MANGLER@B4'])
  })

  it('en del rett under seg selv, og en del under seg selv gjennom en annen', () => {
    const rett = endre(endre(GYLDIG, 2, VARENUMMER, '200-001'), 2, BESKRIVELSE, 'Sete')
    expect(valider(arkFra([...rett.slice(0, 2), ['..2', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', null, null, null], ...rett.slice(3)]))).toMatchObject([
      { kode: 'VARENUMMER_UNDER_SEG_SELV', varenummer: '200-001', andreRader: [3] },
    ])
  })

  it('A under B og B under A er én feil, som peker på raden der sløyfen sluttes', () => {
    const sløyfe: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'A', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['..2', '200-002', 'B', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['.1', '200-002', 'B', 1, 'Komponent (Produseres selv)', null, null, null],
      ['..2', '200-001', 'A', 1, 'Komponent (Produseres selv)', null, null, null],
    ]
    const feil = valider(arkFra(sløyfe))
    expect(kort(feil)).toEqual(['VARENUMMER_UNDER_SEG_SELV@B6'])
    expect(feil[0]).toMatchObject({ felt: 'Varenummer', verdi: '200-001', varenummer: '200-001', andreRader: [3] })
  })

  it('en felles del under to forskjellige deler er ikke en sløyfe', () => {
    expect(valider(arkFra(GYLDIG))).toEqual([])
  })
})

describe('beskrivelse (FR-3)', () => {
  it('mangler, og bare mellomrom er det samme som mangler', () => {
    expect(feilIVerdier(endre(GYLDIG, 7, BESKRIVELSE, null))).toEqual(['BESKRIVELSE_MANGLER@C9'])
    expect(feilIVerdier(endre(GYLDIG, 7, BESKRIVELSE, '   '))).toEqual(['BESKRIVELSE_MANGLER@C9'])
  })

  it('en annen beskrivelse for samme varenummer er en feil på den andre raden', () => {
    const feil = valider(arkFra(endre(GYLDIG, 5, BESKRIVELSE, 'Skruesett M8')))
    expect(kort(feil)).toEqual(['BESKRIVELSE_ULIK@C7'])
    expect(feil[0]).toMatchObject({ varenummer: '300-002', andreRader: [5] })
  })

  it('mellomrom foran og bak spiller ingen rolle, og mangler den første, er det bare den som er feil', () => {
    expect(feilIVerdier(endre(GYLDIG, 5, BESKRIVELSE, '  Skruesett M6 '))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 3, BESKRIVELSE, null))).toEqual(['BESKRIVELSE_MANGLER@C5'])
  })
})

describe('antall (FR-3)', () => {
  it.each([
    ['fem', 'ANTALL_UGYLDIG'],
    [1.5, 'ANTALL_UGYLDIG'],
    ['1,5', 'ANTALL_UGYLDIG'],
    [0, 'ANTALL_UGYLDIG'],
    [-2, 'ANTALL_UGYLDIG'],
    ['1 000', 'ANTALL_UGYLDIG'],
    ['+5', 'ANTALL_UGYLDIG'],
    [null, 'ANTALL_MANGLER'],
    ['  ', 'ANTALL_MANGLER'],
  ] as const)('%s i rad 9 gir %s', (verdi, kode) => {
    expect(feilIVerdier(endre(GYLDIG, 7, ANTALL, verdi))).toEqual([`${kode}@D9`])
  })

  it('«7» og «007» er 7, og ferdigproduktet har tomt antall', () => {
    expect(feilIVerdier(endre(GYLDIG, 7, ANTALL, '7'))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 0, ANTALL, 1))).toEqual(['ANTALL_FYLT_UT_FOR_NIVAA_0@D2'])
    expect(feilIVerdier(endre(GYLDIG, 0, ANTALL, '  '))).toEqual([])
  })

  it('antall som mangler gir én feil, ikke også «ulike underdeler»', () => {
    // 300-002 står to ganger, og antallet mangler i den første forekomsten.
    expect(feilIVerdier(endre(GYLDIG, 3, ANTALL, null))).toEqual(['ANTALL_MANGLER@D5'])
  })
})

describe('type (FR-3)', () => {
  it('teksten må være en av de tre, og mellomrom bak godtas', () => {
    expect(feilIVerdier(endre(GYLDIG, 7, TYPE, 'Komponent (Kjøpes inn) '))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 7, TYPE, 'Delmontering'))).toEqual(['TYPE_UGYLDIG@E9'])
    expect(feilIVerdier(endre(GYLDIG, 7, TYPE, null))).toEqual(['TYPE_UGYLDIG@E9'])
  })

  it('Ferdigvare bare på nivå 0, og nivå 0 er alltid Ferdigvare', () => {
    expect(feilIVerdier(endre(GYLDIG, 7, TYPE, 'Ferdigvare'))).toEqual(['TYPE_FERDIGVARE_IKKE_NIVAA_0@E9'])
    expect(feilIVerdier(endre(GYLDIG, 0, TYPE, 'Komponent (Produseres selv)'))).toEqual(['TYPE_NIVAA_0_IKKE_FERDIGVARE@E2'])
  })

  it('samme varenummer må ha samme type, og den første raden er fasit', () => {
    const feil = valider(arkFra(endre(GYLDIG, 5, TYPE, 'Komponent (Produseres selv)')))
    expect(kort(feil)).toEqual(['TYPE_ULIK@E7'])
    expect(feil[0]).toMatchObject({ varenummer: '300-002', andreRader: [5] })
  })

  it('en del som kjøpes inn, har ingen underdeler, og feilen peker på delen og radene under', () => {
    const feil = valider(arkFra(endre(GYLDIG, 1, TYPE, 'Komponent (Kjøpes inn)')))
    expect(kort(feil)).toEqual(['TYPE_KJOPES_INN_HAR_UNDERDELER@E3'])
    expect(feil[0]).toMatchObject({ varenummer: '200-001', andreRader: [4, 5] })
  })
})

describe('lagerbeholdning, sikkerhetslager og ledetid: fylt ut første gang, tom de neste (FR-3)', () => {
  it.each([
    ['Lagerbeholdning', LAGER, 'F', 'LAGERBEHOLDNING'],
    ['Sikkerhetslager', SS, 'G', 'SIKKERHETSLAGER'],
    ['Ledetid (uker)', LEDETID, 'H', 'LEDETID'],
  ] as const)('%s: mangler første gang, og fylt ut senere', (_felt, kolonne, bokstav, prefiks) => {
    expect(feilIVerdier(endre(GYLDIG, 6, kolonne, null))).toEqual([`${prefiks}_MANGLER@${bokstav}8`])
    expect(feilIVerdier(endre(GYLDIG, 5, kolonne, 3))).toEqual([`${prefiks}_FYLT_UT_SENERE@${bokstav}7`])
    expect(feilIVerdier(endre(GYLDIG, 5, kolonne, 'tre'))).toEqual([`${prefiks}_FYLT_UT_SENERE@${bokstav}7`])
  })

  it('lager og sikkerhetslager: 0 er greit, negativt og desimaler er det ikke', () => {
    expect(feilIVerdier(endre(GYLDIG, 6, LAGER, 0))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 6, SS, '0'))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 6, LAGER, -5))).toEqual(['LAGERBEHOLDNING_UGYLDIG@F8'])
    expect(feilIVerdier(endre(GYLDIG, 6, SS, 2.5))).toEqual(['SIKKERHETSLAGER_UGYLDIG@G8'])
  })

  it('ledetid: minst 1 uke for en komponent, men 0 er greit for ferdigproduktet', () => {
    expect(feilIVerdier(endre(GYLDIG, 6, LEDETID, 0))).toEqual(['LEDETID_UGYLDIG@H8'])
    expect(feilIVerdier(endre(GYLDIG, 6, LEDETID, 1.5))).toEqual(['LEDETID_UGYLDIG@H8'])
    expect(feilIVerdier(endre(GYLDIG, 0, LEDETID, 0))).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 0, LEDETID, -1))).toEqual(['LEDETID_UGYLDIG@H2'])
  })

  it('første forekomst med ugyldig verdi er én feil, og senere forekomster med tomme celler er greie', () => {
    expect(feilIVerdier(endre(GYLDIG, 3, LAGER, 'mye'))).toEqual(['LAGERBEHOLDNING_UGYLDIG@F5'])
  })
})

describe('underdeler (FR-3, AD-6)', () => {
  /** 200-001 står to ganger under ferdigproduktet, med underdelene gitt i hver forekomst. */
  function medForekomster(...forekomster: Verdier[][]): Verdier[] {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ...forekomster[0]!,
    ]
    for (const underdeler of forekomster.slice(1)) {
      rader.push(['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', null, null, null], ...underdeler)
    }
    return rader
  }
  const skrue = (antall: Celleverdi, forste = false): Verdier => ['..2', '300-002', 'Skrue', antall, 'Komponent (Kjøpes inn)', forste ? 10 : null, forste ? 0 : null, forste ? 1 : null]
  const plate = (antall: Celleverdi, forste = false): Verdier => ['..2', '300-001', 'Plate', antall, 'Komponent (Kjøpes inn)', forste ? 10 : null, forste ? 0 : null, forste ? 1 : null]

  it('like underdeler under begge forekomstene er greit, også i en annen rekkefølge', () => {
    expect(feilIVerdier(medForekomster([skrue(4, true), plate(1, true)], [plate(1), skrue(4)]))).toEqual([])
  })

  it('underdeler bare under den første, eller bare under en senere, forekomst er greit', () => {
    expect(feilIVerdier(medForekomster([skrue(4, true), plate(1, true)], []))).toEqual([])
    expect(feilIVerdier(medForekomster([], [skrue(4, true), plate(1, true)]))).toEqual([])
  })

  it('et annet antall eller en annen underdel gir én feil som nevner varenummeret og begge forekomstene', () => {
    // Første forekomst er rad 3, med underdeler i rad 4 og 5. Andre forekomst er rad 6, med underdelen i rad 7.
    const feil = valider(arkFra(medForekomster([skrue(4, true), plate(1, true)], [plate(2)])))
    expect(kort(feil)).toEqual(['UNDERDELER_ULIKE@rad 7'])
    expect(feil[0]).toMatchObject({ felt: 'Underdeler', varenummer: '200-001', andreRader: [3, 6] })
    expect(kort(valider(arkFra(medForekomster([skrue(4, true)], [skrue(3)]))))).toEqual(['UNDERDELER_ULIKE@rad 6'])
  })

  it('med tre forekomster er det den som avviker, som får feilen', () => {
    const feil = valider(arkFra(medForekomster([skrue(4, true)], [skrue(4)], [skrue(9)])))
    expect(feil).toHaveLength(1)
    expect(feil[0]).toMatchObject({ kode: 'UNDERDELER_ULIKE', andreRader: [3, 7] })
  })

  it('en underdel som står to ganger rett under samme del, regnes som summen', () => {
    // [4 + 4] er det samme som [8], slik byggStruktur regner den, og forskjellig fra [4].
    expect(feilIVerdier(medForekomster([skrue(4, true), skrue(4)], [skrue(8)]))).toEqual([])
    expect(feilIVerdier(medForekomster([skrue(4, true), skrue(4)], [skrue(4)]))).toEqual(['UNDERDELER_ULIKE@rad 7'])
  })

  it('ugyldig antall gir bare antallsfeilen, så strukturen ikke gir følgefeil', () => {
    expect(feilIVerdier(medForekomster([skrue(4, true)], [skrue(null)]))).toEqual(['ANTALL_MANGLER@D6'])
    expect(feilIVerdier(medForekomster([skrue(4, true)], [skrue('fem')]))).toEqual(['ANTALL_UGYLDIG@D6'])
  })
})

describe('kontroller som hoppes over når en kolonne mangler (FR-2)', () => {
  it('uten Ledetid (uker) kontrolleres ikke ledetiden', () => {
    const ugyldigLedetid = endre(endre(GYLDIG, 6, LEDETID, 0), 5, LEDETID, 3)
    expect(feilIVerdier(ugyldigLedetid)).toEqual(['LEDETID_FYLT_UT_SENERE@H7', 'LEDETID_UGYLDIG@H8'])
    expect(feilIVerdier(ugyldigLedetid, ['Ledetid (uker)'])).toEqual([])
  })

  it('uten Varenummer kontrolleres ikke «første gang», beskrivelse og type per varenummer, eller underdeler', () => {
    const rotete = endre(endre(endre(GYLDIG, 6, LAGER, null), 5, BESKRIVELSE, 'Noe annet'), 5, TYPE, 'Komponent (Produseres selv)')
    expect(feilIVerdier(rotete, ['Varenummer'])).toEqual([])
  })

  it('uten Nivå kontrolleres ikke nivåene, antall for ferdigproduktet eller underdelene, og «ingen nivå .1» er ikke en feil', () => {
    expect(feilIVerdier(endre(endre(GYLDIG, 1, NIVAA, '3'), 1, TYPE, 'Komponent (Kjøpes inn)'), ['Nivå'])).toEqual([])
    expect(feilIVerdier([GYLDIG[0]!], ['Nivå'])).toEqual([])
  })

  it('uten Antall og uten Type hoppes underdelsreglene over, og resten kontrolleres som vanlig', () => {
    expect(feilIVerdier(endre(GYLDIG, 1, TYPE, 'Komponent (Kjøpes inn)'), ['Type'])).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 7, ANTALL, 'fem'), ['Antall'])).toEqual([])
    expect(feilIVerdier(endre(GYLDIG, 7, BESKRIVELSE, null), ['Antall'])).toEqual(['BESKRIVELSE_MANGLER@C9'])
  })
})

describe('rekkefølgen på feilene (FR-4)', () => {
  it('feilene står i rekkefølgen de har i arket, og kolonnene i en rad står fra A til H', () => {
    const rotete = endre(endre(endre(GYLDIG, 7, LEDETID, 0), 7, ANTALL, 'fem'), 1, TYPE, 'Delmontering')
    expect(feilIVerdier(rotete)).toEqual(['TYPE_UGYLDIG@E3', 'ANTALL_UGYLDIG@D9', 'LEDETID_UGYLDIG@H9'])
  })

  it('feilene i underdelene står på plass mellom radfeilene', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['..2', '300-002', 'Skrue', 4, 'Komponent (Kjøpes inn)', 10, 0, 1],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', null, null, null],
      ['..2', '300-002', 'Skrue', 3, 'Komponent (Kjøpes inn)', null, null, null],
      ['.1', '300-009', 'Hjul', 5, 'Komponent (Kjøpes inn)', 0, 0, 0],
    ]
    expect(feilIVerdier(rader)).toEqual(['UNDERDELER_ULIKE@rad 6', 'LEDETID_UGYLDIG@H7'])
  })
})

// Rettelser etter Sebastians gjennomgang av PR #33: færre følgefeil, og feil som ikke lenger blir stående.
describe('følgefeil (gjennomgangen av PR #33)', () => {
  it('nivå «1» i stedet for «.1» gir nivåfeilen på raden, ikke også «ingen nivå .1»', () => {
    expect(feilIVerdier(endre(GYLDIG.slice(0, 2), 1, NIVAA, '1'))).toEqual(['NIVAA_UGYLDIG@A3'])
    const alle = GYLDIG.map((v, i) => (i === 0 ? v : (['1', ...v.slice(1)] as Verdier)))
    const feil = feilIVerdier(alle)
    expect(feil).toHaveLength(GYLDIG.length - 1)
    expect(feil.every((k) => k.startsWith('NIVAA_UGYLDIG'))).toBe(true)
  })

  it('..2 i stedet for .1 rett under ferdigproduktet gir bare nivåfeilen, ikke også «ingen nivå .1»', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['..2', '300-001', 'Plate', 1, 'Komponent (Kjøpes inn)', 10, 0, 1],
      ['..2', '300-002', 'Skrue', 1, 'Komponent (Kjøpes inn)', 10, 0, 1],
    ]
    expect(feilIVerdier(rader)).toEqual(['NIVAA_2_UTEN_NIVAA_1_OVER@A3'])
  })

  it('en typefeil mot nivået gir ikke også «ulik type» på samme celle', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['.1', '200-001', 'Sete', 1, 'Ferdigvare', null, null, null],
    ]
    expect(feilIVerdier(rader)).toEqual(['TYPE_FERDIGVARE_IKKE_NIVAA_0@E4'])
  })

  it('Ferdigvare på .1 i første rad med varenummeret er ikke fasit: neste rad får ikke «ulik type»', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Ferdigvare', 10, 0, 1],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', null, null, null],
    ]
    expect(feilIVerdier(rader)).toEqual(['TYPE_FERDIGVARE_IKKE_NIVAA_0@E3'])
  })

  it('en tom rad som stopper lesingen før første .1-rad, gir bare «ikke sammenhengende»', () => {
    const ark = arkFra([GYLDIG[0]!], { tomRadMedInnholdUnder: 3 })
    expect(kort(valider(ark))).toEqual(['RADER_IKKE_SAMMENHENGENDE@rad 3'])
  })

  it('en annen type i en senere forekomst som har underdeler, gir bare TYPE_ULIK på cellen', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Kjøpes inn)', null, null, null],
      ['..2', '300-001', 'Plate', 1, 'Komponent (Kjøpes inn)', 10, 0, 1],
    ]
    expect(feilIVerdier(rader)).toEqual(['TYPE_ULIK@E4'])
  })

  it('en del rett under seg selv gir bare VARENUMMER_UNDER_SEG_SELV, også med annen beskrivelse, type og tall', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['..2', '200-001', 'Noe annet', 1, 'Komponent (Kjøpes inn)', 5, 1, 3],
    ]
    expect(feilIVerdier(rader)).toEqual(['VARENUMMER_UNDER_SEG_SELV@B4'])
  })

  it('..2 rett etter en ekstra nivå 0-rad gir bare «flere nivå 0»', () => {
    const rader: Verdier[] = [
      ...GYLDIG.slice(0, 2),
      ['0', '100-002', 'Stol 2', null, 'Ferdigvare', 0, 0, 0],
      ['..2', '300-001', 'Plate', 1, 'Komponent (Kjøpes inn)', 10, 0, 1],
    ]
    expect(feilIVerdier(rader)).toEqual(['NIVAA_FLERE_NIVAA_0@A4'])
  })
})

describe('feil som ikke skal bli stående til neste opplasting (gjennomgangen av PR #33)', () => {
  const ferdig: Verdier = ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0]
  const sete = (type = 'Komponent (Produseres selv)', forste = false): Verdier => [
    '.1',
    '200-001',
    'Sete',
    1,
    type,
    forste ? 10 : null,
    forste ? 0 : null,
    forste ? 1 : null,
  ]
  const skrue = (antall: Celleverdi, forste = false): Verdier => [
    '..2',
    '300-002',
    'Skrue',
    antall,
    'Komponent (Kjøpes inn)',
    forste ? 10 : null,
    forste ? 0 : null,
    forste ? 1 : null,
  ]

  it('antall som ikke er et heltall på 1 eller mer, er feil også uten Nivå-overskriften', () => {
    expect(feilIVerdier(endre(GYLDIG, 7, ANTALL, 'fem'), ['Nivå'])).toEqual(['ANTALL_UGYLDIG@D9'])
    expect(feilIVerdier(endre(GYLDIG, 7, ANTALL, 0), ['Nivå'])).toEqual(['ANTALL_UGYLDIG@D9'])
    expect(feilIVerdier(GYLDIG, ['Nivå'])).toEqual([])
  })

  it('lager, sikkerhetslager og ledetid som ikke er heltall, er feil også uten Varenummer-overskriften', () => {
    expect(feilIVerdier(endre(GYLDIG, 1, LAGER, -5), ['Varenummer'])).toEqual(['LAGERBEHOLDNING_UGYLDIG@F3'])
    expect(feilIVerdier(endre(GYLDIG, 1, SS, 2.5), ['Varenummer'])).toEqual(['SIKKERHETSLAGER_UGYLDIG@G3'])
    expect(feilIVerdier(endre(GYLDIG, 1, LEDETID, 'to'), ['Varenummer'])).toEqual(['LEDETID_UGYLDIG@H3'])
    // Tomme celler og «første gang» kontrolleres ikke uten varenummer.
    expect(feilIVerdier(GYLDIG, ['Varenummer'])).toEqual([])
  })

  it('ledetid 0 for en komponent er feil også når nivået er ukjent, men 0 er greit på første rad', () => {
    expect(feilIVerdier(endre(GYLDIG, 1, LEDETID, 0), ['Nivå'])).toEqual(['LEDETID_UGYLDIG@H3'])
    expect(feilIVerdier(endre(GYLDIG, 0, LEDETID, 0), ['Nivå'])).toEqual([])
    expect(feilIVerdier(endre(endre(GYLDIG, 1, NIVAA, '3'), 1, LEDETID, 0))).toEqual(['NIVAA_UGYLDIG@A3', 'LEDETID_UGYLDIG@H3'])
  })

  it('et urelatert antall med feil slår ikke av reglene om underdeler for andre deler', () => {
    const rader: Verdier[] = [
      ferdig,
      sete('Komponent (Kjøpes inn)', true),
      skrue(4, true),
      ['.1', '300-009', 'Hjul', 'fem', 'Komponent (Kjøpes inn)', 10, 0, 1],
    ]
    expect(feilIVerdier(rader)).toEqual(['TYPE_KJOPES_INN_HAR_UNDERDELER@E3', 'ANTALL_UGYLDIG@D5'])
  })

  it('en sløyfe oppdages også uten Antall- og Type-overskriftene', () => {
    const sløyfe: Verdier[] = [
      ferdig,
      ['.1', '200-001', 'A', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['..2', '200-002', 'B', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['.1', '200-002', 'B', 1, 'Komponent (Produseres selv)', null, null, null],
      ['..2', '200-001', 'A', 1, 'Komponent (Produseres selv)', null, null, null],
    ]
    expect(feilIVerdier(sløyfe, ['Antall', 'Type'])).toEqual(['VARENUMMER_UNDER_SEG_SELV@B6'])
  })

  it('en sløyfe med tre deler (A→B→C→A) er én feil', () => {
    const rader: Verdier[] = [
      ferdig,
      ['.1', '200-001', 'A', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['..2', '200-002', 'B', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['.1', '200-002', 'B', 1, 'Komponent (Produseres selv)', null, null, null],
      ['..2', '200-003', 'C', 1, 'Komponent (Produseres selv)', 10, 0, 1],
      ['.1', '200-003', 'C', 1, 'Komponent (Produseres selv)', null, null, null],
      ['..2', '200-001', 'A', 1, 'Komponent (Produseres selv)', null, null, null],
    ]
    expect(feilIVerdier(rader)).toEqual(['VARENUMMER_UNDER_SEG_SELV@B8'])
  })

  it('ulike underdeler i flere forekomster: hver forekomst som avviker, får sin feil', () => {
    const rader: Verdier[] = [ferdig, sete(undefined, true), skrue(4, true), sete(), skrue(3), sete(), skrue(9)]
    const feil = valider(arkFra(rader))
    expect(kort(feil)).toEqual(['UNDERDELER_ULIKE@rad 6', 'UNDERDELER_ULIKE@rad 8'])
    expect(feil.map((f) => f.andreRader)).toEqual([
      [3, 5],
      [3, 7],
    ])
  })

  it('en del som kjøpes inn, med underdeler under flere forekomster, gir en feil per forekomst', () => {
    const feil = valider(arkFra([ferdig, sete('Komponent (Kjøpes inn)', true), skrue(4, true), sete('Komponent (Kjøpes inn)'), skrue(4)]))
    expect(kort(feil)).toEqual(['TYPE_KJOPES_INN_HAR_UNDERDELER@E3', 'TYPE_KJOPES_INN_HAR_UNDERDELER@E5'])
    expect(feil.map((f) => f.andreRader)).toEqual([[4], [6]])
  })

  it('er første rad for et varenummer ugyldig eller tom, er første gyldige rad fasit for beskrivelse og type', () => {
    const rader: Verdier[] = [
      ferdig,
      ['.1', '200-001', null, 1, 'Delmontering', 10, 0, 1],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', null, null, null],
      ['.1', '200-001', 'Stol-sete', 1, 'Komponent (Kjøpes inn)', null, null, null],
    ]
    const feil = valider(arkFra(rader))
    expect(kort(feil)).toEqual(['BESKRIVELSE_MANGLER@C3', 'TYPE_UGYLDIG@E3', 'BESKRIVELSE_ULIK@C5', 'TYPE_ULIK@E5'])
    expect(feil[2]).toMatchObject({ andreRader: [4] })
    expect(feil[3]).toMatchObject({ andreRader: [4] })
  })

  it('uten Beskrivelse-overskriften kontrolleres ikke beskrivelsen', () => {
    const rader = endre(endre(GYLDIG, 5, BESKRIVELSE, 'Noe annet'), 6, BESKRIVELSE, null)
    expect(feilIVerdier(rader, ['Beskrivelse'])).toEqual([])
    expect(feilIVerdier(rader)).toEqual(['BESKRIVELSE_ULIK@C7', 'BESKRIVELSE_MANGLER@C8'])
  })
})

describe('rekkefølgen i en rad med feil i underdelene (gjennomgangen av PR #33)', () => {
  it('en cellefeil og en underdelsfeil i samme rad står i kolonnerekkefølge: Type før Ledetid', () => {
    const rader: Verdier[] = [
      ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0],
      ['.1', '200-001', 'Sete', 1, 'Komponent (Kjøpes inn)', 10, 0, 'to'],
      ['..2', '300-001', 'Plate', 1, 'Komponent (Kjøpes inn)', 10, 0, 1],
    ]
    expect(feilIVerdier(rader)).toEqual(['TYPE_KJOPES_INN_HAR_UNDERDELER@E3', 'LEDETID_UGYLDIG@H3'])
  })
})

// Andre runde av gjennomgangen av PR #33: falske «ulike underdeler».
describe('ingen falske «ulike underdeler» (andre runde av gjennomgangen av PR #33)', () => {
  const ferdig: Verdier = ['0', '100-001', 'Stol', null, 'Ferdigvare', 0, 0, 0]
  const sete = (forste = false): Verdier => [
    '.1',
    '200-001',
    'Sete',
    1,
    'Komponent (Produseres selv)',
    forste ? 10 : null,
    forste ? 0 : null,
    forste ? 1 : null,
  ]
  const del = (varenummer: string, antall: Celleverdi, forste = false): Verdier => [
    '..2',
    varenummer,
    varenummer,
    antall,
    'Komponent (Kjøpes inn)',
    forste ? 10 : null,
    forste ? 0 : null,
    forste ? 1 : null,
  ]

  /** Som en fil uten Antall-kolonnen: cellene finnes ikke, og kontrollen hoppes over. */
  const utenAntallkolonne = (rader: Verdier[]) => {
    const ark = arkFra(rader)
    for (const rad of ark.rader) delete rad.celler['Antall']
    return kort(valider(ark, ['Antall']))
  }

  it('uten Antall-overskriften sammenlignes bare varenumrene: X to ganger (4 + 4) og X én gang (8) er like', () => {
    const rader: Verdier[] = [ferdig, sete(true), del('300-001', 4, true), del('300-001', 4), sete(), del('300-001', 8)]
    expect(feilIVerdier(rader)).toEqual([])
    expect(utenAntallkolonne(rader)).toEqual([])
  })

  it('uten Antall-overskriften gir en annen underdel fortsatt UNDERDELER_ULIKE', () => {
    const rader: Verdier[] = [ferdig, sete(true), del('300-001', 4, true), sete(), del('300-002', 4, true)]
    expect(utenAntallkolonne(rader)).toEqual(['UNDERDELER_ULIKE@rad 6'])
  })

  it('en tom rad som kutter underdelene til en forekomst, gir bare «ikke sammenhengende»', () => {
    // Rad 3 og 4 er første forekomst med X og Y, rad 6 og 7 er andre forekomst. Lesingen stoppet ved en tom rad etter rad 7.
    const rader: Verdier[] = [ferdig, sete(true), del('300-001', 1, true), del('300-002', 1, true), sete(), del('300-001', 1)]
    const ark = arkFra(rader, { tomRadMedInnholdUnder: 8 })
    expect(kort(valider(ark))).toEqual(['RADER_IKKE_SAMMENHENGENDE@rad 8'])
  })

  it('mer enn 1000 rader gir bare «for mange rader», ikke «ulike underdeler»', () => {
    const rader: Verdier[] = [ferdig, sete(true), del('300-001', 1, true), del('300-002', 1, true), sete(), del('300-001', 1)]
    while (rader.length <= MAKS_RADER) rader.push(['.1', `400-${rader.length}`, 'Del', 1, 'Komponent (Kjøpes inn)', 1, 0, 1])
    expect(kort(valider(arkFra(rader)))).toEqual(['RADER_FOR_MANGE@rad 1002'])
  })

  it('et ugyldig antall sperrer bare forekomsten det står i, ikke hele delen', () => {
    // Første forekomst er rent. Andre har antall «fem» (egen feil). Tredje avviker fra den første.
    const rader: Verdier[] = [ferdig, sete(true), del('300-001', 4, true), sete(), del('300-001', 'fem'), sete(), del('300-001', 9)]
    expect(feilIVerdier(rader)).toEqual(['ANTALL_UGYLDIG@D6', 'UNDERDELER_ULIKE@rad 8'])
  })
})
