// Tester for lesingen av Excel-filen (Story 1.5, AD-15).
// Ekte filer fra testdata/ for formler, hjelpekolonner, passord, skadede og tomme filer.
// Små arbeidsbøker fra lag-arbeidsbok.ts for logikken.

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Celleverdi, Filfeilkode, RaaArk } from '../../src/domene/typer.ts'
import { les } from '../../src/excel/les.ts'
import { lagArbeidsbok } from '../hjelpere/lag-arbeidsbok.ts'

const ROT = join(import.meta.dirname, '..', '..')
const TESTDATA = join(ROT, 'testdata')
const VALIDERING = join(TESTDATA, 'validering')

const STYKKLISTE_OVERSKRIFTER: Celleverdi[] = [
  'Nivå',
  'Varenummer',
  'Beskrivelse',
  'Antall',
  'Type',
  'Lagerbeholdning',
  'Sikkerhetslager',
  'Ledetid (uker)',
]

function lesFil(sti: string): ReturnType<typeof les> {
  return les(readFileSync(sti), sti.split(/[\\/]/).pop()!)
}

function lesOk(innhold: Uint8Array | ArrayBuffer, filnavn = 'test.xlsx'): RaaArk {
  const utfall = les(innhold, filnavn)
  if (!utfall.ok) throw new Error(`Ventet ok, fikk ${utfall.feil.kode}`)
  return utfall.verdi
}

function filfeil(utfall: ReturnType<typeof les>): Filfeilkode | 'ok' {
  return utfall.ok ? 'ok' : utfall.feil.kode
}

const FILFEIL: Record<string, Filfeilkode> = {
  'V-F04.csv': 'IKKE_XLSX',
  'V-F07.xlsx': 'SKADET_FIL',
  'V-F08.xlsx': 'TOM_FIL',
  'V-F09.xlsx': 'IKKE_EXCEL',
  'V-F10.xlsx': 'PASSORDBESKYTTET',
}

describe('les: filene i testdata/', () => {
  const testeksempler = [1, 2, 3, 4, 5].map((n) => `testeksempel-0${n}.xlsx`)
  const valideringsfiler = readdirSync(VALIDERING).filter((f) => /^V-[A-Z]\d+\.(xlsx|csv)$/.test(f))

  it.each(testeksempler)('%s gir RaaArk med alle tre arkene', (navn) => {
    const ark = lesOk(readFileSync(join(TESTDATA, navn)), navn)
    expect(ark.filnavn).toBe(navn)
    expect(ark.stykkliste).not.toBeNull()
    expect(ark.mps).not.toBeNull()
    expect(ark.planlagteMottak).not.toBeNull()
    expect(ark.stykkliste!.rader.length).toBeGreaterThan(0)
    expect(ark.stykkliste!.tomRadMedInnholdUnder).toBeNull()
  })

  it('hver fil i testdata/validering/ gir RaaArk eller filfeilen sin', () => {
    expect(valideringsfiler.length).toBeGreaterThan(50)
    for (const navn of valideringsfiler) {
      const utfall = lesFil(join(VALIDERING, navn))
      expect(filfeil(utfall), navn).toBe(FILFEIL[navn] ?? 'ok')
    }
    expect(Object.keys(FILFEIL).every((f) => valideringsfiler.includes(f))).toBe(true)
  })

  it('V-F03 (gammel mal): ok, uten Stykkliste, og alleArk har Produkt og Komponenter', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-F03.xlsx')), 'V-F03.xlsx')
    expect(ark.stykkliste).toBeNull()
    expect(ark.alleArk).toEqual(['Veiledning', 'Produkt', 'Komponenter', 'MPS', 'Planlagte mottak', 'Veien videre'])
    expect(ark.mps).not.toBeNull()
  })

  it('V-F01 (MPS mangler): mps er null', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-F01.xlsx')), 'V-F01.xlsx')
    expect(ark.mps).toBeNull()
    expect(ark.alleArk).not.toContain('MPS')
  })

  it('V-F02 (overskriften «Ledetid (uker)» mangler): overskriften er null, og cellene har ikke nøkkelen', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-F02.xlsx')), 'V-F02.xlsx')
    expect(ark.stykkliste!.overskrifter['Ledetid (uker)']).toBeNull()
    expect(ark.stykkliste!.overskrifter['Sikkerhetslager']).toBe('G')
    expect(ark.stykkliste!.rader.every((r) => !('Ledetid (uker)' in r.celler))).toBe(true)
  })

  it('V-S01: 7 rader (rad 2–8) og tomRadMedInnholdUnder 9', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-S01.xlsx')), 'V-S01.xlsx')
    expect(ark.stykkliste!.rader.map((r) => r.excelRad)).toEqual([2, 3, 4, 5, 6, 7, 8])
    expect(ark.stykkliste!.tomRadMedInnholdUnder).toBe(9)
  })

  it('V-S03: 1001 rader, siste rad er 1002', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-S03.xlsx')), 'V-S03.xlsx')
    expect(ark.stykkliste!.rader).toHaveLength(1001)
    expect(ark.stykkliste!.rader.at(-1)!.excelRad).toBe(1002)
    expect(ark.stykkliste!.tomRadMedInnholdUnder).toBeNull()
  })

  it('V-G03 (tomt ark Planlagte mottak): ingen rader, men overskriftene finnes', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-G03.xlsx')), 'V-G03.xlsx')
    expect(ark.planlagteMottak).toEqual({
      overskrifter: { Varenummer: 'A', Uke: 'B', Antall: 'C' },
      rader: [],
    })
  })

  it('testeksempel 01: Stykkliste har radene 2–10 og ingen tom rad med innhold under, MPS har 12 rader', () => {
    const ark = lesOk(readFileSync(join(TESTDATA, 'testeksempel-01.xlsx')), 'testeksempel-01.xlsx')
    const stykkliste = ark.stykkliste!
    expect(stykkliste.rader.map((r) => r.excelRad)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(stykkliste.tomRadMedInnholdUnder).toBeNull()
    expect(stykkliste.overskrifter).toEqual({
      Nivå: 'A',
      Varenummer: 'B',
      Beskrivelse: 'C',
      Antall: 'D',
      Type: 'E',
      Lagerbeholdning: 'F',
      Sikkerhetslager: 'G',
      'Ledetid (uker)': 'H',
    })
    expect(stykkliste.rader[0]).toEqual({
      excelRad: 2,
      celler: {
        Nivå: '0',
        Varenummer: '100-002',
        Beskrivelse: 'Kontorstol Basic',
        Antall: null,
        Type: 'Ferdigvare',
        Lagerbeholdning: 0,
        Sikkerhetslager: 0,
        'Ledetid (uker)': 0,
      },
    })

    const mps = ark.mps!
    expect(mps.rader).toHaveLength(12)
    expect(mps.rader.map((r) => r.excelRad)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    expect(mps.rader[0].celler).toEqual({ Uke: 1, 'Antall ferdigprodukter': 20 })
    expect(mps.rader[11].celler).toEqual({ Uke: 12, 'Antall ferdigprodukter': null })

    expect(ark.planlagteMottak!.rader).toEqual([
      { excelRad: 2, celler: { Varenummer: '300-005', Uke: 4, Antall: 100 } },
      { excelRad: 3, celler: { Varenummer: '300-007', Uke: 2, Antall: 120 } },
    ])
    expect(ark.alleArk).toEqual(['Veiledning', 'Stykkliste', 'MPS', 'Planlagte mottak', 'Veien videre'])
  })

  it('V-G05 (lagret fra Excel): formelcellen har den lagrede verdien, og Kontroll og hjelpekolonnene er ikke med', () => {
    const ark = lesOk(readFileSync(join(VALIDERING, 'V-G05.xlsx')), 'V-G05.xlsx')
    const stykkliste = ark.stykkliste!
    const rad5 = stykkliste.rader.find((r) => r.excelRad === 5)!
    expect(rad5.celler.Lagerbeholdning).toBe(400)
    expect(stykkliste.rader.map((r) => r.excelRad)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    // Hjelpekolonnene AA–AD har lagrede formelverdier helt ned til rad 1001, men teller ikke som innhold.
    expect(stykkliste.tomRadMedInnholdUnder).toBeNull()

    const tillatt = new Set<string>([...(STYKKLISTE_OVERSKRIFTER as string[]), 'Uke', 'Antall ferdigprodukter'])
    const alleRader = [...stykkliste.rader, ...ark.mps!.rader, ...ark.planlagteMottak!.rader]
    for (const rad of alleRader) {
      for (const nokkel of Object.keys(rad.celler)) expect(tillatt.has(nokkel), nokkel).toBe(true)
    }
    expect(alleRader.some((r) => 'Kontroll' in r.celler)).toBe(false)
  })
})

describe('les: filfeil', () => {
  const gyldig = lagArbeidsbok({ Stykkliste: [STYKKLISTE_OVERSKRIFTER] })

  it('filnavn som ikke slutter på .xlsx gir IKKE_XLSX, uansett store og små bokstaver', () => {
    expect(filfeil(les(gyldig, 'fil.csv'))).toBe('IKKE_XLSX')
    expect(filfeil(les(gyldig, 'fil.xls'))).toBe('IKKE_XLSX')
    expect(filfeil(les(gyldig, 'fil.xlsx.txt'))).toBe('IKKE_XLSX')
    expect(filfeil(les(gyldig, 'fil'))).toBe('IKKE_XLSX')
    expect(filfeil(les(gyldig, 'FIL.XLSX'))).toBe('ok')
    expect(filfeil(les(gyldig, 'fil.Xlsx'))).toBe('ok')
  })

  it('filnavnet sjekkes før innholdet', () => {
    expect(filfeil(les(new Uint8Array(0), 'tom.csv'))).toBe('IKKE_XLSX')
  })

  it('0 byte gir TOM_FIL, både som Uint8Array og ArrayBuffer', () => {
    expect(filfeil(les(new Uint8Array(0), 'tom.xlsx'))).toBe('TOM_FIL')
    expect(filfeil(les(new ArrayBuffer(0), 'tom.xlsx'))).toBe('TOM_FIL')
  })

  it('tekst og andre bytes med .xlsx-endelse gir IKKE_EXCEL', () => {
    expect(filfeil(les(new TextEncoder().encode('Nivå;Varenummer\n0;100-001\n'), 'a.xlsx'))).toBe('IKKE_EXCEL')
    expect(filfeil(les(new Uint8Array([0x50, 0x4b]), 'a.xlsx'))).toBe('IKKE_EXCEL')
    expect(filfeil(les(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]), 'a.xlsx'))).toBe('IKKE_EXCEL')
  })

  it('en CFB-fil uten EncryptedPackage (gammel .xls) gir IKKE_EXCEL', () => {
    const xls = lagArbeidsbok({ Stykkliste: [STYKKLISTE_OVERSKRIFTER] }, 'xls')
    expect([...xls.subarray(0, 4)]).toEqual([0xd0, 0xcf, 0x11, 0xe0])
    expect(filfeil(les(xls, 'gammel.xlsx'))).toBe('IKKE_EXCEL')
  })

  it('en ZIP-fil som er kuttet, gir SKADET_FIL', () => {
    expect(filfeil(les(gyldig.subarray(0, Math.floor(gyldig.length / 2)), 'kuttet.xlsx'))).toBe('SKADET_FIL')
  })

  it('en ødelagt CFB-fil gir en filfeil, ikke et unntak', () => {
    const bytes = new Uint8Array(600).fill(0xff)
    bytes.set([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    expect(() => les(bytes, 'odelagt.xlsx')).not.toThrow()
    expect(filfeil(les(bytes, 'odelagt.xlsx'))).toBe('SKADET_FIL')
  })

  it('godtar ArrayBuffer og en Uint8Array som er et utsnitt av en større buffer', () => {
    expect(filfeil(les(gyldig.slice().buffer, 'a.xlsx'))).toBe('ok')
    const stor = new Uint8Array(gyldig.length + 10)
    stor.set(gyldig, 5)
    expect(filfeil(les(stor.subarray(5, 5 + gyldig.length), 'a.xlsx'))).toBe('ok')
  })
})

describe('les: ark, kolonner og verdier', () => {
  it('Nivå og Varenummer lagret som tallene 0 og 300001 blir «0» og «300001»', () => {
    const bok = lagArbeidsbok({
      Stykkliste: [STYKKLISTE_OVERSKRIFTER, [0, 300001, 'Stol', null, 'Ferdigvare', 0, 0, 0], [0.1, 123, 'Del', 1]],
    })
    const rader = lesOk(bok).stykkliste!.rader
    expect(rader[0].celler.Nivå).toBe('0')
    expect(rader[0].celler.Varenummer).toBe('300001')
    // 0.1 tolkes ikke om til «.1» (valideringen avviser det).
    expect(rader[1].celler.Nivå).toBe('0.1')
    expect(rader[1].celler.Varenummer).toBe('123')
  })

  it('Varenummer i Planlagte mottak blir også tekst', () => {
    const bok = lagArbeidsbok({ 'Planlagte mottak': [['Varenummer', 'Uke', 'Antall'], [300001, 2, 10]] })
    expect(lesOk(bok).planlagteMottak!.rader[0].celler).toEqual({ Varenummer: '300001', Uke: 2, Antall: 10 })
  })

  it('Nivå og Varenummer trimmes, annen tekst beholdes som den er, og tom tekst blir null', () => {
    const bok = lagArbeidsbok({
      Stykkliste: [STYKKLISTE_OVERSKRIFTER, ['  .1 ', ' 000123 ', ' Sete ', '   ', 'Type', true, false, ' 5 ']],
    })
    expect(lesOk(bok).stykkliste!.rader[0].celler).toEqual({
      Nivå: '.1',
      Varenummer: '000123',
      Beskrivelse: ' Sete ',
      Antall: null,
      Type: 'Type',
      Lagerbeholdning: true,
      Sikkerhetslager: false,
      'Ledetid (uker)': ' 5 ',
    })
  })

  it('kolonner i en annen rekkefølge og en ekstra kolonne: overskrifter peker på riktig bokstav, og den ekstra er ikke med', () => {
    const bok = lagArbeidsbok({
      Stykkliste: [
        ['Varenummer', 'Ekstra', ' Nivå ', 'Ledetid (uker)', 'Beskrivelse', 'Antall', 'Type', 'Sikkerhetslager', 'Lagerbeholdning'],
        ['100-001', 'x', '0', 1, 'Stol', null, 'Ferdigvare', 2, 3],
      ],
    })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.overskrifter).toEqual({
      Nivå: 'C',
      Varenummer: 'A',
      Beskrivelse: 'E',
      Antall: 'F',
      Type: 'G',
      Lagerbeholdning: 'I',
      Sikkerhetslager: 'H',
      'Ledetid (uker)': 'D',
    })
    expect(stykkliste.rader[0].celler).toEqual({
      Nivå: '0',
      Varenummer: '100-001',
      Beskrivelse: 'Stol',
      Antall: null,
      Type: 'Ferdigvare',
      Lagerbeholdning: 3,
      Sikkerhetslager: 2,
      'Ledetid (uker)': 1,
    })
    expect('Ekstra' in stykkliste.rader[0].celler).toBe(false)
  })

  it('en overskrift lagret som NFD («a» + ring) finnes likevel', () => {
    const nfd = 'Nivå'
    expect(nfd).not.toBe('Nivå')
    const bok = lagArbeidsbok({ Stykkliste: [[nfd, 'Varenummer'], ['0', '100-001']] })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.overskrifter['Nivå']).toBe('A')
    expect(stykkliste.rader[0].celler).toEqual({ Nivå: '0', Varenummer: '100-001' })
  })

  it('en feilverdi blir teksten sin, også i Varenummer og i en tallkolonne, og avslutter ikke stykklisten', () => {
    const bok = lagArbeidsbok({
      Stykkliste: [
        STYKKLISTE_OVERSKRIFTER,
        ['0', '100-001', 'Stol', null, 'Ferdigvare', 1, 1, 1],
        [null, { feil: '#N/A' }, 'Del', { feil: '#N/A' }],
        ['.1', '300-002', 'Del 2', 1],
      ],
    })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.rader.map((r) => r.excelRad)).toEqual([2, 3, 4])
    expect(stykkliste.rader[1].celler.Varenummer).toBe('#N/A')
    expect(stykkliste.rader[1].celler.Antall).toBe('#N/A')
    expect(stykkliste.rader[1].celler.Nivå).toBeNull()
    expect(stykkliste.tomRadMedInnholdUnder).toBeNull()
  })

  it('første treff gjelder når en overskrift står to ganger', () => {
    const bok = lagArbeidsbok({ MPS: [['Uke', 'Uke', 'Antall ferdigprodukter'], [1, 99, 10]] })
    const mps = lesOk(bok).mps!
    expect(mps.overskrifter).toEqual({ Uke: 'A', 'Antall ferdigprodukter': 'C' })
    expect(mps.rader[0].celler).toEqual({ Uke: 1, 'Antall ferdigprodukter': 10 })
  })

  it('uten arket MPS er mps null, og svaret er ok', () => {
    const bok = lagArbeidsbok({ Stykkliste: [STYKKLISTE_OVERSKRIFTER], 'Planlagte mottak': [['Varenummer', 'Uke', 'Antall']] })
    const ark = lesOk(bok)
    expect(ark.mps).toBeNull()
    expect(ark.alleArk).toEqual(['Stykkliste', 'Planlagte mottak'])
  })

  it('arknavn må være eksakte', () => {
    const bok = lagArbeidsbok({ mps: [['Uke']], 'Stykkliste ': [STYKKLISTE_OVERSKRIFTER] })
    const ark = lesOk(bok)
    expect(ark.mps).toBeNull()
    expect(ark.stykkliste).toBeNull()
    expect(ark.planlagteMottak).toBeNull()
    expect(ark.alleArk).toEqual(['mps', 'Stykkliste '])
  })

  it('uten overskriften «Ledetid (uker)» er overskriften null, og svaret er ok', () => {
    const bok = lagArbeidsbok({
      Stykkliste: [STYKKLISTE_OVERSKRIFTER.slice(0, 7), ['0', '100-001', 'Stol', null, 'Ferdigvare', 1, 1, 9]],
    })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.overskrifter['Ledetid (uker)']).toBeNull()
    expect('Ledetid (uker)' in stykkliste.rader[0].celler).toBe(false)
  })

  it('MPS og Planlagte mottak: bare rader med innhold i malens kolonner, med Excel-radnummer', () => {
    const bok = lagArbeidsbok({
      MPS: [
        ['Uke', 'Antall ferdigprodukter', null, 'Hjelp'],
        [1, 10],
        [null, null, null, 'bare hjelpetekst'],
        [],
        [null, 5],
      ],
    })
    expect(lesOk(bok).mps!.rader).toEqual([
      { excelRad: 2, celler: { Uke: 1, 'Antall ferdigprodukter': 10 } },
      { excelRad: 5, celler: { Uke: null, 'Antall ferdigprodukter': 5 } },
    ])
  })
})

describe('les: Stykkliste slutter ved første tomme rad', () => {
  const rad = (n: number): Celleverdi[] => ['.1', `300-${String(n).padStart(3, '0')}`, 'Del', 1, 'Komponent (Kjøpes inn)', 0, 0, 1]

  it('1001 utfylte rader: siste rad er 1002', () => {
    const bok = lagArbeidsbok({ Stykkliste: [STYKKLISTE_OVERSKRIFTER, ...Array.from({ length: 1001 }, (_, i) => rad(i))] })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.rader).toHaveLength(1001)
    expect(stykkliste.rader.at(-1)!.excelRad).toBe(1002)
    expect(stykkliste.tomRadMedInnholdUnder).toBeNull()
  })

  it('en rad med bare Nivå eller bare Varenummer er ikke tom', () => {
    const bok = lagArbeidsbok({ Stykkliste: [STYKKLISTE_OVERSKRIFTER, rad(1), ['.1'], [null, '300-009'], rad(4)] })
    expect(lesOk(bok).stykkliste!.rader.map((r) => r.excelRad)).toEqual([2, 3, 4, 5])
  })

  it('innhold i en annen av malens kolonner under den tomme raden gir tomRadMedInnholdUnder', () => {
    const bok = lagArbeidsbok({ Stykkliste: [STYKKLISTE_OVERSKRIFTER, rad(1), rad(2), [], [null, null, null, null, null, 7]] })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.rader.map((r) => r.excelRad)).toEqual([2, 3])
    expect(stykkliste.tomRadMedInnholdUnder).toBe(4)
  })

  it('innhold langt nede (rad 1001) og under malens rader (rad 1500) oppdages', () => {
    for (const excelRad of [1001, 1500]) {
      const rader: Celleverdi[][] = [STYKKLISTE_OVERSKRIFTER, rad(1)]
      while (rader.length < excelRad - 1) rader.push([])
      rader.push([null, null, 'Beskrivelse langt nede'])
      expect(lesOk(lagArbeidsbok({ Stykkliste: rader })).stykkliste!.tomRadMedInnholdUnder, String(excelRad)).toBe(3)
    }
  })

  it('innhold under den tomme raden i kolonner utenfor malen teller ikke', () => {
    const overskrifter = [...STYKKLISTE_OVERSKRIFTER, null, 'Kontroll']
    const bok = lagArbeidsbok({
      Stykkliste: [overskrifter, rad(1), [], [null, null, null, null, null, null, null, null, null, 'Mangler nivå']],
    })
    expect(lesOk(bok).stykkliste!.tomRadMedInnholdUnder).toBeNull()
  })

  it('uten kolonnene Nivå og Varenummer er rad 2 den tomme raden', () => {
    const bok = lagArbeidsbok({ Stykkliste: [['Beskrivelse', 'Antall'], ['Stol', 1], ['Del', 2]] })
    const stykkliste = lesOk(bok).stykkliste!
    expect(stykkliste.rader).toEqual([])
    expect(stykkliste.tomRadMedInnholdUnder).toBe(2)
  })

  it('et ark uten celler gir ingen rader og alle overskrifter null', () => {
    const stykkliste = lesOk(lagArbeidsbok({ Stykkliste: [] })).stykkliste!
    expect(stykkliste.rader).toEqual([])
    expect(stykkliste.tomRadMedInnholdUnder).toBeNull()
    expect(Object.values(stykkliste.overskrifter).every((v) => v === null)).toBe(true)
  })
})
