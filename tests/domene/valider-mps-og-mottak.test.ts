// Tester for kontrollen av MPS og Planlagte mottak og for den samlede valider (Story 1.9, FR-3, FR-4,
// AD-4, AD-5), med RaaArk bygd i koden. Filene i testdata/ testes i tests/validering/mps-og-mottak.test.ts.

import { describe, expect, it } from 'vitest'
import {
  MPS_KOLONNER,
  PLANLAGTE_MOTTAK_KOLONNER,
  STYKKLISTE_KOLONNER,
  type Celleverdi,
  type Kolonnenavn,
  type RaaArk,
  type RaaRad,
  type StykklisteKolonne,
  type Valideringsfeil,
} from '../../src/domene/typer.ts'
import { valider, validerMpsOgMottak, validerStruktur } from '../../src/domene/valider.ts'

function overskrifter<K extends Kolonnenavn>(kolonner: readonly K[]): Record<K, string | null> {
  const svar = {} as Record<K, string | null>
  kolonner.forEach((navn, i) => {
    svar[navn] = String.fromCharCode(65 + i)
  })
  return svar
}

type Stykklisteverdier = [Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi, Celleverdi]

function stykklisterader(rader: Stykklisteverdier[]): RaaRad<StykklisteKolonne>[] {
  return rader.map((verdier, i) => {
    const celler: RaaRad<StykklisteKolonne>['celler'] = {}
    STYKKLISTE_KOLONNER.forEach((kolonne, k) => {
      celler[kolonne] = verdier[k]
    })
    return { excelRad: i + 2, celler }
  })
}

/** MPS slik malen har den: Uke er fylt ut i rad 2–13, og antallene står fra uke 1. */
function mpsRader(antall: Celleverdi[]): RaaRad<'Uke' | 'Antall ferdigprodukter'>[] {
  const rader: RaaRad<'Uke' | 'Antall ferdigprodukter'>[] = []
  for (let i = 0; i < Math.max(12, antall.length); i++) {
    rader.push({ excelRad: i + 2, celler: { Uke: i + 1, 'Antall ferdigprodukter': antall[i] ?? null } })
  }
  return rader
}

function mottak(...rader: [Celleverdi, Celleverdi, Celleverdi][]): RaaRad<'Varenummer' | 'Uke' | 'Antall'>[] {
  return rader.map(([varenummer, uke, antall], i) => ({
    excelRad: i + 2,
    celler: { Varenummer: varenummer, Uke: uke, Antall: antall },
  }))
}

const TI_UKER = [20, 25, 30, 20, 35, 30, 25, 40, 30, 20]

/** En gyldig fil: fire rader i stykklisten, H = 10 og to planlagte mottak. */
function gyldig(): RaaArk {
  return {
    filnavn: 'test.xlsx',
    alleArk: ['Veiledning', 'Stykkliste', 'MPS', 'Planlagte mottak', 'Veien videre'],
    stykkliste: {
      overskrifter: overskrifter(STYKKLISTE_KOLONNER),
      rader: stykklisterader([
        ['0', '100-001', 'Stol', null, 'Ferdigvare', 20, 5, 1],
        ['.1', '200-001', 'Sete', 1, 'Komponent (Produseres selv)', 10, 0, 2],
        ['..2', '300-001', 'Skrue', 4, 'Komponent (Kjøpes inn)', 100, 10, 1],
        ['.1', '300001', 'Hjul', 5, 'Komponent (Kjøpes inn)', '0', 0, 1],
      ]),
      tomRadMedInnholdUnder: null,
    },
    mps: { overskrifter: overskrifter(MPS_KOLONNER), rader: mpsRader(TI_UKER) },
    planlagteMottak: {
      overskrifter: overskrifter(PLANLAGTE_MOTTAK_KOLONNER),
      rader: mottak(['200-001', 4, 100], ['300-001', 2, 50]),
    },
  }
}

function feilI(raa: RaaArk): Valideringsfeil[] {
  const utfall = valider(raa)
  if (utfall.ok) return []
  return utfall.feil.feil
}

/** «KODE sted» for hver feil, for eksempel «MPS_ANTALL_UGYLDIG uke 3» eller «MOTTAK_ANTALL_UGYLDIG C3». */
function kort(feil: Valideringsfeil[]): string[] {
  return feil.map((f) => {
    const sted =
      f.sted.type === 'UKE'
        ? `uke ${f.sted.uke}`
        : f.sted.type === 'CELLE' || f.sted.type === 'OVERSKRIFT'
          ? f.sted.celle
          : f.sted.type === 'RAD'
            ? `rad ${f.sted.excelRad}`
            : '–'
    return `${f.kode} ${sted}`
  })
}

function medMps(antall: Celleverdi[]): RaaArk {
  const raa = gyldig()
  raa.mps!.rader = mpsRader(antall)
  return raa
}

function medMottak(...rader: [Celleverdi, Celleverdi, Celleverdi][]): RaaArk {
  const raa = gyldig()
  raa.planlagteMottak!.rader = mottak(...rader)
  return raa
}

describe('valider: gyldig fil gir Inndata', () => {
  it('stykklisteradene med koder og Excel-rad, horisonten, prognostiserte behov og mottakene', () => {
    const utfall = valider(gyldig())
    expect(utfall.ok).toBe(true)
    if (!utfall.ok) return
    expect(utfall.verdi).toEqual({
      stykkliste: [
        {
          excelRad: 2,
          nivaa: '0',
          varenummer: '100-001',
          beskrivelse: 'Stol',
          antall: null,
          type: 'FERDIGVARE',
          lagerbeholdning: 20,
          sikkerhetslager: 5,
          ledetid: 1,
        },
        {
          excelRad: 3,
          nivaa: '.1',
          varenummer: '200-001',
          beskrivelse: 'Sete',
          antall: 1,
          type: 'PRODUSERES_SELV',
          lagerbeholdning: 10,
          sikkerhetslager: 0,
          ledetid: 2,
        },
        {
          excelRad: 4,
          nivaa: '..2',
          varenummer: '300-001',
          beskrivelse: 'Skrue',
          antall: 4,
          type: 'KJOPES_INN',
          lagerbeholdning: 100,
          sikkerhetslager: 10,
          ledetid: 1,
        },
        {
          excelRad: 5,
          nivaa: '.1',
          varenummer: '300001',
          beskrivelse: 'Hjul',
          antall: 5,
          type: 'KJOPES_INN',
          lagerbeholdning: 0,
          sikkerhetslager: 0,
          ledetid: 1,
        },
      ],
      horisont: 10,
      prognostiserteBehov: TI_UKER,
      planlagteMottak: [
        { varenummer: '200-001', uke: 4, antall: 100, excelRad: 2 },
        { varenummer: '300-001', uke: 2, antall: 50, excelRad: 3 },
      ],
    })
  })

  it('en tom celle i et tallfelt blir null', () => {
    const raa = gyldig()
    // Andre gang 300-001 står, er lager, sikkerhetslager og ledetid tomme (FR-3). Raden står på nivå .1, under ferdigproduktet.
    const [rad] = stykklisterader([['.1', '300-001', 'Skrue', 2, 'Komponent (Kjøpes inn)', null, null, null]])
    raa.stykkliste!.rader.push({ ...rad, excelRad: 6 })
    const utfall = valider(raa)
    expect(utfall.ok).toBe(true)
    if (!utfall.ok) return
    expect(utfall.verdi.stykkliste.at(-1)).toEqual({
      excelRad: 6,
      nivaa: '.1',
      varenummer: '300-001',
      beskrivelse: 'Skrue',
      antall: 2,
      type: 'KJOPES_INN',
      lagerbeholdning: null,
      sikkerhetslager: null,
      ledetid: null,
    })
  })

  it('to mottak for samme del og uke er to linjer, ikke lagt sammen (AD-4)', () => {
    const utfall = valider(medMottak(['300-001', 3, 40], ['300-001', 3, 60]))
    expect(utfall.ok).toBe(true)
    if (!utfall.ok) return
    expect(utfall.verdi.planlagteMottak).toEqual([
      { varenummer: '300-001', uke: 3, antall: 40, excelRad: 2 },
      { varenummer: '300-001', uke: 3, antall: 60, excelRad: 3 },
    ])
  })

  it('H = 8 og H = 12 er gyldige grenser, og prognostiserteBehov har lengde H', () => {
    for (const h of [8, 12]) {
      const utfall = valider(medMps(Array.from({ length: h }, (_, i) => i * 5)))
      expect(utfall.ok, `H = ${h}`).toBe(true)
      if (!utfall.ok) continue
      expect(utfall.verdi.horisont).toBe(h)
      expect(utfall.verdi.prognostiserteBehov).toHaveLength(h)
      expect(utfall.verdi.prognostiserteBehov[0]).toBe(0)
    }
  })

  it('et tomt ark Planlagte mottak er gyldig', () => {
    const utfall = valider(medMottak())
    expect(utfall.ok).toBe(true)
    if (utfall.ok) expect(utfall.verdi.planlagteMottak).toEqual([])
  })

  it('heltall lagret som tekst godtas og blir tall', () => {
    const raa = medMps(['20', ' 25 ', '30', '20', '35', '30', '25', '40'])
    raa.planlagteMottak!.rader = mottak(['300-001', '3', '40'])
    const utfall = valider(raa)
    expect(utfall.ok).toBe(true)
    if (!utfall.ok) return
    expect(utfall.verdi.prognostiserteBehov).toEqual([20, 25, 30, 20, 35, 30, 25, 40])
    expect(utfall.verdi.planlagteMottak).toEqual([{ varenummer: '300-001', uke: 3, antall: 40, excelRad: 2 }])
  })

  it('uken leses fra Excel-raden, ikke fra kolonnen Uke', () => {
    const raa = gyldig()
    for (const rad of raa.mps!.rader) rad.celler['Uke'] = 'feil uke'
    const utfall = valider(raa)
    expect(utfall.ok).toBe(true)
    if (utfall.ok) expect(utfall.verdi.horisont).toBe(10)
  })
})

describe('MPS: horisonten', () => {
  it('H = 7 gir én MPS_HORISONT_UGYLDIG på uke 8', () => {
    const feil = feilI(medMps(TI_UKER.slice(0, 7)))
    expect(feil).toEqual([
      { kode: 'MPS_HORISONT_UGYLDIG', ark: 'MPS', sted: { type: 'UKE', uke: 8 }, felt: 'Antall ferdigprodukter', verdi: null },
    ])
  })

  it('H = 7 og et mottak i uke 9: ingen MOTTAK_UKE_UTENFOR_HORISONT (ingen følgefeil)', () => {
    const raa = medMps(TI_UKER.slice(0, 7))
    raa.planlagteMottak!.rader = mottak(['300-001', 9, 40])
    expect(kort(feilI(raa))).toEqual(['MPS_HORISONT_UGYLDIG uke 8'])
  })

  it('ugyldig horisont: uke 0 og negative uker avvises likevel (PR #28, Carmen)', () => {
    const raa = medMps(TI_UKER.slice(0, 7))
    raa.planlagteMottak!.rader = mottak(['300-001', 0, 40], ['300-001', -2, 40], ['300-001', 9, 40])
    expect(kort(feilI(raa))).toEqual([
      'MPS_HORISONT_UGYLDIG uke 8',
      'MOTTAK_UKE_UTENFOR_HORISONT B2',
      'MOTTAK_UKE_UTENFOR_HORISONT B3',
    ])
  })

  it('ugyldig horisont: uken må fortsatt være et heltall', () => {
    const raa = medMps(TI_UKER.slice(0, 7))
    raa.planlagteMottak!.rader = mottak(['300-001', 'ni', 40])
    expect(kort(feilI(raa))).toEqual(['MPS_HORISONT_UGYLDIG uke 8', 'MOTTAK_UKE_IKKE_HELTALL B2'])
  })

  it('H = 13 gir én MPS_HORISONT_UGYLDIG på uke 13, med verdien der', () => {
    const feil = feilI(medMps([...TI_UKER, 20, 20, 15]))
    expect(feil).toEqual([
      { kode: 'MPS_HORISONT_UGYLDIG', ark: 'MPS', sted: { type: 'UKE', uke: 13 }, felt: 'Antall ferdigprodukter', verdi: 15 },
    ])
  })

  it('H = 14 gir fortsatt bare én feil, på uke 13', () => {
    expect(kort(feilI(medMps([...TI_UKER, 1, 2, 3, 4])))).toEqual(['MPS_HORISONT_UGYLDIG uke 13'])
  })

  it('tomt ark MPS (H = 0) gir MPS_HORISONT_UGYLDIG på uke 1', () => {
    const raa = gyldig()
    raa.mps!.rader = []
    expect(kort(feilI(raa))).toEqual(['MPS_HORISONT_UGYLDIG uke 1'])
  })
})

describe('MPS: hull', () => {
  it('uke 9 tom og uke 10 fylt ut (som V-M02): MPS_UKE_ETTER_HULL på uke 10', () => {
    expect(feilI(medMps([...TI_UKER.slice(0, 8), null, 30]))).toEqual([
      { kode: 'MPS_UKE_ETTER_HULL', ark: 'MPS', sted: { type: 'UKE', uke: 10 }, felt: 'Antall ferdigprodukter', verdi: 30 },
    ])
  })

  it('hver utfylte uke etter hullet gir sin egen feil', () => {
    expect(kort(feilI(medMps([...TI_UKER.slice(0, 8), null, 30, null, 20])))).toEqual([
      'MPS_UKE_ETTER_HULL uke 10',
      'MPS_UKE_ETTER_HULL uke 12',
    ])
  })

  it('hull før uke 8: horisonten er for kort, og uken etter hullet gir også en feil', () => {
    expect(kort(feilI(medMps([1, 2, 3, 4, 5, null, 7, 8, 9])))).toEqual([
      'MPS_HORISONT_UGYLDIG uke 6',
      'MPS_UKE_ETTER_HULL uke 7',
      'MPS_UKE_ETTER_HULL uke 8',
      'MPS_UKE_ETTER_HULL uke 9',
    ])
  })
})

describe('MPS: antall', () => {
  it.each([
    ['−5', -5],
    ['«tretti»', 'tretti'],
    ['30,5', 30.5],
    ['«30,5»', '30,5'],
    ['«ca. 40»', 'ca. 40'],
    ['sannhetsverdi', true],
  ] as const)('%s gir MPS_ANTALL_UGYLDIG på uken', (_navn, verdi) => {
    const antall: Celleverdi[] = [...TI_UKER]
    antall[2] = verdi
    expect(feilI(medMps(antall))).toEqual([
      { kode: 'MPS_ANTALL_UGYLDIG', ark: 'MPS', sted: { type: 'UKE', uke: 3 }, felt: 'Antall ferdigprodukter', verdi },
    ])
  })

  it('0 er gyldig', () => {
    expect(valider(medMps([0, 0, 0, 0, 0, 0, 0, 0])).ok).toBe(true)
  })

  it('ugyldig antall i uke 13 når H > 12 gir både horisontfeilen og antallsfeilen', () => {
    expect(kort(feilI(medMps([...TI_UKER, 20, 20, -1])))).toEqual([
      'MPS_HORISONT_UGYLDIG uke 13',
      'MPS_ANTALL_UGYLDIG uke 13',
    ])
  })

  it('ugyldig antall etter et hull gir begge feilene', () => {
    expect(kort(feilI(medMps([...TI_UKER.slice(0, 8), null, 'ti'])))).toEqual([
      'MPS_UKE_ETTER_HULL uke 10',
      'MPS_ANTALL_UGYLDIG uke 10',
    ])
  })

  it('null er en tom uke, ikke et ugyldig antall', () => {
    expect(kort(feilI(medMps([...TI_UKER.slice(0, 8), null])))).toEqual([])
  })
})

describe('Planlagte mottak: varenummer', () => {
  it('et varenummer som ikke finnes i Stykkliste (som V-P01), gir MOTTAK_VARENUMMER_UKJENT på cellen', () => {
    expect(feilI(medMottak(['200-001', 4, 100], ['300-099', 5, 50]))).toEqual([
      {
        kode: 'MOTTAK_VARENUMMER_UKJENT',
        ark: 'Planlagte mottak',
        sted: { type: 'CELLE', celle: 'A3', excelRad: 3 },
        felt: 'Varenummer',
        verdi: '300-099',
      },
    ])
  })

  it('et tomt varenummer gir MOTTAK_VARENUMMER_UKJENT', () => {
    expect(kort(feilI(medMottak([null, 4, 100])))).toEqual(['MOTTAK_VARENUMMER_UKJENT A2'])
  })

  it('tallet 300001 i mottaket er det samme som «300001» i Stykkliste (tekst mot tekst)', () => {
    expect(valider(medMottak([300001, 4, 100])).ok).toBe(true)
  })

  it('tallet 300001 i Stykkliste er det samme som «300001» i mottaket', () => {
    const raa = medMottak(['300001', 4, 100])
    raa.stykkliste!.rader[3].celler['Varenummer'] = 300001
    expect(valider(raa).ok).toBe(true)
  })

  it('«000123» og «123» er ulike varenumre', () => {
    const raa = medMottak(['123', 4, 100])
    raa.stykkliste!.rader[3].celler['Varenummer'] = '000123'
    expect(kort(feilI(raa))).toEqual(['MOTTAK_VARENUMMER_UKJENT A2'])
  })

  it('Stykkliste › Varenummer mangler: varenumrene i mottakene kontrolleres ikke', () => {
    const raa = medMottak(['finnes-ikke', 4, 100])
    raa.stykkliste!.overskrifter['Varenummer'] = null
    expect(kort(feilI(raa))).toEqual(['OVERSKRIFT_MANGLER B1'])
  })

  it('arket Stykkliste mangler: varenumrene i mottakene kontrolleres ikke, resten gjør det', () => {
    const raa = medMottak(['finnes-ikke', 4, 0])
    raa.stykkliste = null
    raa.alleArk = raa.alleArk.filter((navn) => navn !== 'Stykkliste')
    expect(kort(feilI(raa))).toEqual(['ARK_MANGLER –', 'MOTTAK_ANTALL_UGYLDIG C2'])
  })
})

describe('Planlagte mottak: uke', () => {
  it.each([
    ['«fire»', 'fire'],
    ['4,5', 4.5],
    ['tom', null],
    ['«4 »', '4 x'],
  ] as const)('%s gir MOTTAK_UKE_IKKE_HELTALL', (_navn, uke) => {
    expect(feilI(medMottak(['300-001', uke, 40]))).toEqual([
      {
        kode: 'MOTTAK_UKE_IKKE_HELTALL',
        ark: 'Planlagte mottak',
        sted: { type: 'CELLE', celle: 'B2', excelRad: 2 },
        felt: 'Uke',
        verdi: uke,
      },
    ])
  })

  it.each([0, -1, 11, 99])('uke %s gir MOTTAK_UKE_UTENFOR_HORISONT (H = 10)', (uke) => {
    expect(kort(feilI(medMottak(['300-001', uke, 40])))).toEqual(['MOTTAK_UKE_UTENFOR_HORISONT B2'])
  })

  it('uke 1 og uke H er gyldige', () => {
    expect(valider(medMottak(['300-001', 1, 40], ['300-001', 10, 40], ['300-001', '10', 40])).ok).toBe(true)
  })

  it('arket MPS mangler: ukene kontrolleres ikke mot H, men resten av mottaket gjør det', () => {
    const raa = medMottak(['300-001', 99, 40], ['300-099', 'tolv', 40])
    raa.mps = null
    raa.alleArk = raa.alleArk.filter((navn) => navn !== 'MPS')
    expect(kort(feilI(raa))).toEqual(['ARK_MANGLER –', 'MOTTAK_VARENUMMER_UKJENT A3'])
  })

  it('MPS › «Antall ferdigprodukter» mangler: ingen MPS-feil og ingen kontroll av ukene i mottakene', () => {
    const raa = medMottak(['300-001', 99, 40])
    raa.mps!.overskrifter['Antall ferdigprodukter'] = null
    raa.mps!.rader = mpsRader([-5, 'tretti'])
    expect(kort(feilI(raa))).toEqual(['OVERSKRIFT_MANGLER B1'])
  })

  it('Planlagte mottak › Uke mangler: ingen ukefeil, men varenummer og antall kontrolleres', () => {
    const raa = medMottak(['300-099', 'fire', 0], ['300-001', 99, 40])
    raa.planlagteMottak!.overskrifter['Uke'] = null
    for (const rad of raa.planlagteMottak!.rader) delete rad.celler['Uke']
    expect(kort(feilI(raa))).toEqual([
      'OVERSKRIFT_MANGLER B1',
      'MOTTAK_VARENUMMER_UKJENT A2',
      'MOTTAK_ANTALL_UGYLDIG C2',
    ])
  })

  it('stedet bruker kolonnebokstaven fra overskriftene', () => {
    const raa = medMottak(['300-001', 0, 40])
    raa.planlagteMottak!.overskrifter = { Varenummer: 'B', Uke: 'E', Antall: 'F' }
    expect(kort(feilI(raa))).toEqual(['MOTTAK_UKE_UTENFOR_HORISONT E2'])
  })
})

describe('Planlagte mottak: antall', () => {
  it.each([
    ['0', 0],
    ['−5', -5],
    ['1,5', 1.5],
    ['«ti»', 'ti'],
    ['tom', null],
  ] as const)('%s gir MOTTAK_ANTALL_UGYLDIG', (_navn, antall) => {
    expect(feilI(medMottak(['300-001', 4, antall]))).toEqual([
      {
        kode: 'MOTTAK_ANTALL_UGYLDIG',
        ark: 'Planlagte mottak',
        sted: { type: 'CELLE', celle: 'C2', excelRad: 2 },
        felt: 'Antall',
        verdi: antall,
      },
    ])
  })

  it('1 er gyldig', () => {
    expect(valider(medMottak(['300-001', 4, 1])).ok).toBe(true)
  })

  it('flere feil i samme rad står i kolonnerekkefølgen', () => {
    expect(kort(feilI(medMottak(['300-099', 0, 0])))).toEqual([
      'MOTTAK_VARENUMMER_UKJENT A2',
      'MOTTAK_UKE_UTENFOR_HORISONT B2',
      'MOTTAK_ANTALL_UGYLDIG C2',
    ])
  })

  it('feil i flere rader står rad for rad, og kolonne for kolonne i hver rad', () => {
    expect(kort(feilI(medMottak(['300-099', 0, 40], ['300-001', 'fire', 0])))).toEqual([
      'MOTTAK_VARENUMMER_UKJENT A2',
      'MOTTAK_UKE_UTENFOR_HORISONT B2',
      'MOTTAK_UKE_IKKE_HELTALL B3',
      'MOTTAK_ANTALL_UGYLDIG C3',
    ])
  })
})

describe('valider: rekkefølge og samlet svar', () => {
  it('strukturfeil, så Stykkliste, så MPS og så Planlagte mottak, med hoppetOver fra strukturen', () => {
    const raa = medMottak(['300-001', 4, 0])
    raa.stykkliste!.overskrifter['Ledetid (uker)'] = null
    raa.stykkliste!.rader[2].celler['Nivå'] = '3'
    raa.mps!.rader = mpsRader([20, 25, -5, 20, 35, 30, 25, 40])
    const utfall = valider(raa)
    expect(utfall.ok).toBe(false)
    if (utfall.ok) return
    expect(kort(utfall.feil.feil)).toEqual([
      'OVERSKRIFT_MANGLER H1',
      'NIVAA_UGYLDIG A4',
      'MPS_ANTALL_UGYLDIG uke 3',
      'MOTTAK_ANTALL_UGYLDIG C2',
    ])
    expect(utfall.feil.hoppetOver.map((h) => `${h.ark} › ${h.felt}`)).toEqual(['Stykkliste › Ledetid (uker)'])
  })

  it('validerMpsOgMottak gir bare MPS- og mottaksfeilene', () => {
    const raa = medMottak(['300-001', 11, 40])
    raa.mps!.rader = mpsRader([...TI_UKER.slice(0, 2), 'x', ...TI_UKER.slice(3)])
    raa.stykkliste!.rader[2].celler['Nivå'] = '3'
    expect(kort(validerMpsOgMottak(raa, validerStruktur(raa)))).toEqual([
      'MPS_ANTALL_UGYLDIG uke 3',
      'MOTTAK_UKE_UTENFOR_HORISONT B2',
    ])
  })

  it('kaster aldri, heller ikke for en fil uten ark', () => {
    const raa: RaaArk = { filnavn: 'tom.xlsx', alleArk: [], stykkliste: null, mps: null, planlagteMottak: null }
    expect(kort(feilI(raa))).toEqual(['ARK_MANGLER –', 'ARK_MANGLER –', 'ARK_MANGLER –'])
  })
})

describe('valider: sikkerhetsnettet for Stykklisterad', () => {
  it('nivå «3», resten gyldig: ok: false med NIVAA_UGYLDIG, ikke et unntak', () => {
    const raa = gyldig()
    raa.stykkliste!.rader[2].celler['Nivå'] = '3'
    const utfall = valider(raa) // et unntak her feiler testen
    expect(utfall.ok).toBe(false)
    if (utfall.ok) return
    // Inneholder, ikke er lik: Story 1.8 legger til Stykkliste-regler som kan gi flere feil.
    expect(utfall.feil.feil).toContainEqual({
      kode: 'NIVAA_UGYLDIG',
      ark: 'Stykkliste',
      sted: { type: 'CELLE', celle: 'A4', excelRad: 4 },
      felt: 'Nivå',
      verdi: '3',
    })
  })

  it.each([
    ['Nivå', 'NIVAA_UGYLDIG', 'A', null],
    ['Nivå', 'NIVAA_UGYLDIG', 'A', '...3'],
    ['Varenummer', 'VARENUMMER_MANGLER', 'B', null],
    ['Beskrivelse', 'BESKRIVELSE_MANGLER', 'C', null],
    ['Antall', 'ANTALL_UGYLDIG', 'D', 'fem'],
    ['Type', 'TYPE_UGYLDIG', 'E', 'Råvare (Kjøpes inn)'],
    ['Type', 'TYPE_UGYLDIG', 'E', null],
    ['Lagerbeholdning', 'LAGERBEHOLDNING_UGYLDIG', 'F', 1.5],
    ['Sikkerhetslager', 'SIKKERHETSLAGER_UGYLDIG', 'G', '2,5'],
    ['Ledetid (uker)', 'LEDETID_UGYLDIG', 'H', 'to'],
  ] as const)('%s = %s gir %s', (felt, kode, kolonne, verdi) => {
    // Rad 5 (300001 Hjul) har ingen planlagte mottak, så et tomt varenummer gir ingen mottaksfeil.
    const raa = gyldig()
    raa.stykkliste!.rader[3].celler[felt] = verdi
    expect(feilI(raa)).toEqual([
      { kode, ark: 'Stykkliste', sted: { type: 'CELLE', celle: `${kolonne}5`, excelRad: 5 }, felt, verdi },
    ])
  })

  it('grensene for tallfeltene (antall 0, lager −3) kontrolleres av Stykkliste-reglene (Story 1.8), og gir hver én feil', () => {
    const raa = gyldig()
    raa.stykkliste!.rader[1].celler['Antall'] = 0
    raa.stykkliste!.rader[1].celler['Lagerbeholdning'] = -3
    // Sikkerhetsnettet kjøres bare når reglene gir 0 feil, så feilene kommer ikke dobbelt.
    expect(feilI(raa).map((f) => f.kode)).toEqual(['ANTALL_UGYLDIG', 'LAGERBEHOLDNING_UGYLDIG'])
  })

  it('godtar beskrivelse som tall og type med mellomrom bak, og trimmer beskrivelsen', () => {
    const raa = gyldig()
    raa.stykkliste!.rader[0].celler['Beskrivelse'] = 2000
    raa.stykkliste!.rader[0].celler['Type'] = 'Ferdigvare '
    raa.stykkliste!.rader[1].celler['Beskrivelse'] = ' Sete '
    const utfall = valider(raa)
    expect(utfall.ok).toBe(true)
    if (!utfall.ok) return
    expect(utfall.verdi.stykkliste[0]).toMatchObject({ beskrivelse: '2000', type: 'FERDIGVARE' })
    expect(utfall.verdi.stykkliste[1].beskrivelse).toBe('Sete')
  })

  it('nivå og varenummer lagret som tall gjøres om til tekst', () => {
    const raa = gyldig()
    raa.stykkliste!.rader[0].celler['Nivå'] = 0
    raa.stykkliste!.rader[0].celler['Varenummer'] = 100001
    const utfall = valider(raa)
    expect(utfall.ok).toBe(true)
    if (utfall.ok) expect(utfall.verdi.stykkliste[0]).toMatchObject({ nivaa: '0', varenummer: '100001' })
  })

  it('felt som hoppes over, gir ingen feil fra sikkerhetsnettet', () => {
    const raa = gyldig()
    raa.stykkliste!.overskrifter['Nivå'] = null
    for (const rad of raa.stykkliste!.rader) delete rad.celler['Nivå']
    expect(kort(feilI(raa))).toEqual(['OVERSKRIFT_MANGLER A1'])
  })
})
