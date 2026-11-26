// Tester for fasitleseren (Story 2.2). Leseren skal avvise en fasit med feil form, så en feil i
// fasitfilen aldri gir en falsk grønn fasittest. Radene står her som data, uten SheetJS (AD-15).

import { describe, expect, it } from 'vitest'
import { FASITRADER, lesFasit, tolkBestillingsforslag, tolkFasittabell } from '../hjelpere/fasit-leser.ts'

const OVERSKRIFT = ['Varenummer', 'Rad', 'Uke 1', 'Uke 2', 'Uke 3']

/** Seks rader for én del, med samme tall i alle ukene. */
function del(varenummer: string): unknown[][] {
  return FASITRADER.map((rad, i) => [varenummer, rad, i, i, i])
}

describe('tolkFasittabell', () => {
  it('leser delene i rekkefølge, hopper over tomme rader og finner horisonten', () => {
    const fasit = tolkFasittabell('test.xlsx', [OVERSKRIFT, ...del('A'), [null, null, null, null, null], ...del('B')])
    expect(fasit.horisont).toBe(3)
    expect(fasit.deler).toEqual(['A', 'B'])
    expect(fasit.tabell.get('B')!['Planlagte ordrefrigivelser']).toEqual([5, 5, 5])
  })

  it('avviser en rad som står to ganger for samme del', () => {
    const rader = [OVERSKRIFT, ...del('A'), ['A', 'Nettobehov', 9, 9, 9]]
    expect(() => tolkFasittabell('test.xlsx', rader)).toThrow('A har raden «Nettobehov» to ganger')
  })

  it('avviser en del som står to ganger (en felles del skal stå én gang, FR-16)', () => {
    expect(() => tolkFasittabell('test.xlsx', [OVERSKRIFT, ...del('A'), ...del('B'), ...del('A')])).toThrow(/to ganger/)
  })

  it('avviser ukekolonner som ikke er Uke 1 … Uke H rett etter Rad', () => {
    const hull = ['Varenummer', 'Rad', 'Uke 1', null, 'Uke 2', 'Uke 3']
    expect(() => tolkFasittabell('test.xlsx', [hull, ...del('A')])).toThrow('kolonne 4 i Fasittabell skal være «Uke 2»')
    const byttet = ['Varenummer', 'Rad', 'Uke 2', 'Uke 1', 'Uke 3']
    expect(() => tolkFasittabell('test.xlsx', [byttet, ...del('A')])).toThrow('skal være «Uke 1», ikke «Uke 2»')
  })

  it('avviser en del som mangler en rad, en ukjent rad og tall som ikke er heltall', () => {
    expect(() => tolkFasittabell('test.xlsx', [OVERSKRIFT, ...del('A').slice(0, 5)])).toThrow('A mangler Planlagte ordrefrigivelser')
    expect(() => tolkFasittabell('test.xlsx', [OVERSKRIFT, ['A', 'Lager', 1, 1, 1]])).toThrow('ukjent rad «Lager»')
    expect(() => tolkFasittabell('test.xlsx', [OVERSKRIFT, ['A', 'Nettobehov', 1, 1.5, 1]])).toThrow('ventet heltall')
  })

  it('avviser feil overskrift og et tomt ark', () => {
    expect(() => tolkFasittabell('test.xlsx', [['Del', 'Rad', 'Uke 1']])).toThrow('uventet overskrift')
    expect(() => tolkFasittabell('test.xlsx', [])).toThrow('uventet overskrift')
  })
})

describe('tolkBestillingsforslag', () => {
  const overskrift = ['Varenummer', 'Beskrivelse', 'Frigivelsesuke', 'Mengde', 'Art', 'Forfalt mengde']

  it('gjør tom forfalt mengde om til 0 og arten om til kode', () => {
    const forslag = tolkBestillingsforslag('test.xlsx', [
      overskrift,
      ['300-003', 'Hjul', 1, 175, 'Innkjøp', 50],
      ['100-002', 'Kontorstol Basic', 2, 20, 'Produksjonsordre', null],
    ])
    expect(forslag).toEqual([
      { varenummer: '300-003', beskrivelse: 'Hjul', frigivelsesuke: 1, mengde: 175, forfaltMengde: 50, art: 'INNKJOP' },
      { varenummer: '100-002', beskrivelse: 'Kontorstol Basic', frigivelsesuke: 2, mengde: 20, forfaltMengde: 0, art: 'PRODUKSJONSORDRE' },
    ])
  })

  it('avviser ukjent art og feil overskrift', () => {
    expect(() => tolkBestillingsforslag('test.xlsx', [overskrift, ['A', 'A', 1, 1, 'Kjøp', null]])).toThrow('ukjent art «Kjøp»')
    expect(() => tolkBestillingsforslag('test.xlsx', [overskrift.slice(0, 5)])).toThrow('uventet overskrift')
  })
})

describe('lesFasit med de ekte fasitfilene', () => {
  it.each(['01', '02', '03', '04', '05'])('fasit %s har seks rader per del og ett forslag per frigivelse > 0', (nr) => {
    const fasit = lesFasit(nr)
    expect(fasit.deler.length).toBeGreaterThan(0)
    const frigivelser = fasit.deler.reduce(
      (sum, v) => sum + fasit.tabell.get(v)!['Planlagte ordrefrigivelser'].filter((f) => f > 0).length,
      0,
    )
    expect(fasit.bestillingsforslag).toHaveLength(frigivelser)
  })
})
