// Tester for kontrollen av malens struktur (Story 1.6, FR-2), med RaaArk bygd i koden.
// Filene i testdata/validering/ testes i tests/validering/struktur.test.ts.

import { describe, expect, it } from 'vitest'
import {
  MPS_KOLONNER,
  PLANLAGTE_MOTTAK_KOLONNER,
  STYKKLISTE_KOLONNER,
  type Arknavn,
  type HoppetOverKontroll,
  type Kolonnenavn,
  type RaaArk,
} from '../../src/domene/typer.ts'
import { hoppesOver, validerStruktur } from '../../src/domene/valider.ts'

function overskrifter<K extends Kolonnenavn>(kolonner: readonly K[]): Record<K, string | null> {
  const svar = {} as Record<K, string | null>
  kolonner.forEach((navn, i) => {
    svar[navn] = String.fromCharCode(65 + i)
  })
  return svar
}

/** En fil med alle arkene og alle overskriftene, uten rader. */
function gyldig(): RaaArk {
  return {
    filnavn: 'test.xlsx',
    alleArk: ['Veiledning', 'Stykkliste', 'MPS', 'Planlagte mottak', 'Veien videre'],
    stykkliste: { overskrifter: overskrifter(STYKKLISTE_KOLONNER), rader: [], tomRadMedInnholdUnder: null },
    mps: { overskrifter: overskrifter(MPS_KOLONNER), rader: [] },
    planlagteMottak: { overskrifter: overskrifter(PLANLAGTE_MOTTAK_KOLONNER), rader: [] },
  }
}

function linjer(hoppetOver: HoppetOverKontroll[]): string[] {
  return hoppetOver.map((h) => `${h.ark} › ${h.felt}`)
}

function utenArk(raa: RaaArk, ark: Arknavn): RaaArk {
  const kopi = { ...raa, alleArk: raa.alleArk.filter((navn) => navn !== ark) }
  if (ark === 'Stykkliste') kopi.stykkliste = null
  if (ark === 'MPS') kopi.mps = null
  if (ark === 'Planlagte mottak') kopi.planlagteMottak = null
  return kopi
}

describe('validerStruktur: matrisen i spesifikasjonen', () => {
  it('gyldig fil gir 0 feil og ingen kontroller hoppet over', () => {
    expect(validerStruktur(gyldig())).toEqual({ feil: [], hoppetOver: [] })
  })

  it('MPS mangler (som V-F01): én ARK_MANGLER, begge MPS-kolonnene og Planlagte mottak › Uke hoppes over', () => {
    const resultat = validerStruktur(utenArk(gyldig(), 'MPS'))
    expect(resultat.feil).toEqual([{ kode: 'ARK_MANGLER', ark: 'MPS', sted: { type: 'ARK' }, felt: 'Ark' }])
    expect(resultat.hoppetOver).toEqual([
      { ark: 'MPS', felt: 'Uke', fordi: { kode: 'ARK_MANGLER', ark: 'MPS' } },
      { ark: 'MPS', felt: 'Antall ferdigprodukter', fordi: { kode: 'ARK_MANGLER', ark: 'MPS' } },
      { ark: 'Planlagte mottak', felt: 'Uke', fordi: { kode: 'ARK_MANGLER', ark: 'MPS' } },
    ])
  })

  it('«Ledetid (uker)» mangler (som V-F02): én OVERSKRIFT_MANGLER i H1', () => {
    const raa = gyldig()
    raa.stykkliste!.overskrifter['Ledetid (uker)'] = null
    const resultat = validerStruktur(raa)
    expect(resultat.feil).toEqual([
      { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', sted: { type: 'OVERSKRIFT', celle: 'H1' }, felt: 'Ledetid (uker)' },
    ])
    expect(resultat.hoppetOver).toEqual([
      {
        ark: 'Stykkliste',
        felt: 'Ledetid (uker)',
        fordi: { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', felt: 'Ledetid (uker)' },
      },
    ])
  })

  it('gammel mal (som V-F03): én GAMMEL_MAL på Stykkliste og ingen ARK_MANGLER', () => {
    const raa = utenArk(gyldig(), 'Stykkliste')
    raa.alleArk = ['Veiledning', 'Produkt', 'Komponenter', 'MPS', 'Planlagte mottak']
    const resultat = validerStruktur(raa)
    expect(resultat.feil).toEqual([{ kode: 'GAMMEL_MAL', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' }])
    expect(linjer(resultat.hoppetOver)).toEqual([
      ...STYKKLISTE_KOLONNER.map((k) => `Stykkliste › ${k}`),
      'Planlagte mottak › Varenummer',
    ])
    expect(resultat.hoppetOver.every((h) => h.fordi.kode === 'ARK_MANGLER')).toBe(true)
  })

  it('en fil etter den nye malen med et gammelt ark («Produkt») i tillegg gir 0 feil', () => {
    const raa = gyldig()
    raa.alleArk = ['Produkt', ...raa.alleArk]
    expect(validerStruktur(raa)).toEqual({ feil: [], hoppetOver: [] })
  })

  it('bare ett av de gamle arkene er nok til å kjenne igjen den gamle malen', () => {
    for (const gammelt of ['Produkt', 'Komponenter']) {
      const raa = utenArk(gyldig(), 'Stykkliste')
      raa.alleArk = [gammelt, 'MPS', 'Planlagte mottak']
      expect(validerStruktur(raa).feil.map((f) => f.kode), gammelt).toEqual(['GAMMEL_MAL'])
    }
  })

  it('alt mangler: tre ARK_MANGLER i rekkefølgen Stykkliste, MPS, Planlagte mottak', () => {
    const raa: RaaArk = { filnavn: 'tom.xlsx', alleArk: [], stykkliste: null, mps: null, planlagteMottak: null }
    const resultat = validerStruktur(raa)
    expect(resultat.feil).toEqual([
      { kode: 'ARK_MANGLER', ark: 'Stykkliste', sted: { type: 'ARK' }, felt: 'Ark' },
      { kode: 'ARK_MANGLER', ark: 'MPS', sted: { type: 'ARK' }, felt: 'Ark' },
      { kode: 'ARK_MANGLER', ark: 'Planlagte mottak', sted: { type: 'ARK' }, felt: 'Ark' },
    ])
    expect(linjer(resultat.hoppetOver)).toEqual([
      ...STYKKLISTE_KOLONNER.map((k) => `Stykkliste › ${k}`),
      ...MPS_KOLONNER.map((k) => `MPS › ${k}`),
      ...PLANLAGTE_MOTTAK_KOLONNER.map((k) => `Planlagte mottak › ${k}`),
    ])
    // Hvert ark som mangler, er grunnen for sine egne kolonner.
    expect(resultat.hoppetOver.every((h) => h.fordi.kode === 'ARK_MANGLER' && h.fordi.ark === h.ark)).toBe(true)
  })
})

describe('validerStruktur: overskrifter', () => {
  it('Nivå og Antall mangler: feilene kommer i malens rekkefølge (A1 før D1)', () => {
    const raa = gyldig()
    raa.stykkliste!.overskrifter['Antall'] = null
    raa.stykkliste!.overskrifter['Nivå'] = null
    const feil = validerStruktur(raa).feil
    expect(feil.map((f) => [f.felt, f.sted])).toEqual([
      ['Nivå', { type: 'OVERSKRIFT', celle: 'A1' }],
      ['Antall', { type: 'OVERSKRIFT', celle: 'D1' }],
    ])
  })

  it('stedet er malens plass, selv om kolonnene står et annet sted i filen', () => {
    const raa = gyldig()
    raa.stykkliste!.overskrifter = { ...overskrifter(STYKKLISTE_KOLONNER), Nivå: 'K', Beskrivelse: null }
    expect(validerStruktur(raa).feil).toEqual([
      { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', sted: { type: 'OVERSKRIFT', celle: 'C1' }, felt: 'Beskrivelse' },
    ])
  })

  it('overskrifter på alle tre arkene gir feil i rekkefølgen ark for ark', () => {
    const raa = gyldig()
    raa.planlagteMottak!.overskrifter['Antall'] = null
    raa.mps!.overskrifter['Uke'] = null
    raa.stykkliste!.overskrifter['Type'] = null
    expect(validerStruktur(raa).feil.map((f) => `${f.ark} ${f.sted.type === 'OVERSKRIFT' ? f.sted.celle : ''}`)).toEqual([
      'Stykkliste E1',
      'MPS A1',
      'Planlagte mottak C1',
    ])
  })

  it('et ark som mangler, gir ingen feil for overskriftene i det', () => {
    const feil = validerStruktur(utenArk(gyldig(), 'Planlagte mottak')).feil
    expect(feil.map((f) => f.kode)).toEqual(['ARK_MANGLER'])
  })

  it('MPS › Uke mangler: bare den hoppes over, horisonten er fortsatt kjent', () => {
    const raa = gyldig()
    raa.mps!.overskrifter['Uke'] = null
    expect(linjer(validerStruktur(raa).hoppetOver)).toEqual(['MPS › Uke'])
  })
})

describe('validerStruktur: kontroller som hoppes over', () => {
  it('MPS › «Antall ferdigprodukter» mangler: Planlagte mottak › Uke hoppes over', () => {
    const raa = gyldig()
    raa.mps!.overskrifter['Antall ferdigprodukter'] = null
    expect(validerStruktur(raa).hoppetOver).toEqual([
      {
        ark: 'MPS',
        felt: 'Antall ferdigprodukter',
        fordi: { kode: 'OVERSKRIFT_MANGLER', ark: 'MPS', felt: 'Antall ferdigprodukter' },
      },
      {
        ark: 'Planlagte mottak',
        felt: 'Uke',
        fordi: { kode: 'OVERSKRIFT_MANGLER', ark: 'MPS', felt: 'Antall ferdigprodukter' },
      },
    ])
  })

  it('Stykkliste mangler: Planlagte mottak › Varenummer hoppes over', () => {
    const resultat = validerStruktur(utenArk(gyldig(), 'Stykkliste'))
    expect(resultat.feil.map((f) => f.kode)).toEqual(['ARK_MANGLER'])
    expect(resultat.hoppetOver.at(-1)).toEqual({
      ark: 'Planlagte mottak',
      felt: 'Varenummer',
      fordi: { kode: 'ARK_MANGLER', ark: 'Stykkliste' },
    })
  })

  it('Stykkliste › Varenummer mangler: Planlagte mottak › Varenummer hoppes over', () => {
    const raa = gyldig()
    raa.stykkliste!.overskrifter['Varenummer'] = null
    const resultat = validerStruktur(raa)
    expect(resultat.feil).toEqual([
      { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', sted: { type: 'OVERSKRIFT', celle: 'B1' }, felt: 'Varenummer' },
    ])
    const fordi = { kode: 'OVERSKRIFT_MANGLER', ark: 'Stykkliste', felt: 'Varenummer' }
    expect(resultat.hoppetOver).toEqual([
      { ark: 'Stykkliste', felt: 'Varenummer', fordi },
      { ark: 'Planlagte mottak', felt: 'Varenummer', fordi },
    ])
  })

  it('Stykkliste og MPS mangler: Planlagte mottak › Varenummer og › Uke i malens kolonnerekkefølge', () => {
    const resultat = validerStruktur(utenArk(utenArk(gyldig(), 'Stykkliste'), 'MPS'))
    expect(linjer(resultat.hoppetOver).filter((l) => l.startsWith('Planlagte mottak'))).toEqual([
      'Planlagte mottak › Varenummer',
      'Planlagte mottak › Uke',
    ])
  })

  it('Planlagte mottak mangler også: ingen linje gjentas, og arket selv er grunnen', () => {
    const resultat = validerStruktur(utenArk(utenArk(gyldig(), 'MPS'), 'Planlagte mottak'))
    const uke = resultat.hoppetOver.filter((h) => h.ark === 'Planlagte mottak' && h.felt === 'Uke')
    expect(uke).toEqual([{ ark: 'Planlagte mottak', felt: 'Uke', fordi: { kode: 'ARK_MANGLER', ark: 'Planlagte mottak' } }])
  })

  it('egen overskrift som mangler, går foran avhengigheten, uten gjentakelse', () => {
    const raa = utenArk(gyldig(), 'MPS')
    raa.planlagteMottak!.overskrifter['Uke'] = null
    const uke = validerStruktur(raa).hoppetOver.filter((h) => h.ark === 'Planlagte mottak' && h.felt === 'Uke')
    expect(uke).toEqual([
      { ark: 'Planlagte mottak', felt: 'Uke', fordi: { kode: 'OVERSKRIFT_MANGLER', ark: 'Planlagte mottak', felt: 'Uke' } },
    ])
  })

  it('ingen (ark, felt) står to ganger, uansett hva som mangler', () => {
    const tilfeller: RaaArk[] = [
      { filnavn: 'tom.xlsx', alleArk: [], stykkliste: null, mps: null, planlagteMottak: null },
      utenArk(utenArk(gyldig(), 'Stykkliste'), 'MPS'),
      (() => {
        const raa = gyldig()
        raa.stykkliste!.overskrifter['Varenummer'] = null
        raa.mps!.overskrifter['Antall ferdigprodukter'] = null
        raa.planlagteMottak!.overskrifter['Varenummer'] = null
        raa.planlagteMottak!.overskrifter['Uke'] = null
        return raa
      })(),
    ]
    for (const raa of tilfeller) {
      const l = linjer(validerStruktur(raa).hoppetOver)
      expect(new Set(l).size).toBe(l.length)
    }
  })
})

describe('hoppesOver', () => {
  it('svarer om kontrollen av feltet i arket er hoppet over', () => {
    const resultat = validerStruktur(utenArk(gyldig(), 'MPS'))
    expect(hoppesOver(resultat, 'MPS', 'Antall ferdigprodukter')).toBe(true)
    expect(hoppesOver(resultat, 'Planlagte mottak', 'Uke')).toBe(true)
    expect(hoppesOver(resultat, 'Planlagte mottak', 'Varenummer')).toBe(false)
    expect(hoppesOver(resultat, 'Stykkliste', 'Ledetid (uker)')).toBe(false)
  })

  it('godtar bare kolonner som finnes i arket (kontrolleres av tsc i npm run build)', () => {
    const resultat = validerStruktur(gyldig())
    // @ts-expect-error «Ledetid (uker)» er ikke en kolonne i MPS
    expect(hoppesOver(resultat, 'MPS', 'Ledetid (uker)')).toBe(false)
  })

  it('skiller på ark: Uke i MPS er ikke Uke i Planlagte mottak', () => {
    const raa = gyldig()
    raa.mps!.overskrifter['Uke'] = null
    const resultat = validerStruktur(raa)
    expect(hoppesOver(resultat, 'MPS', 'Uke')).toBe(true)
    expect(hoppesOver(resultat, 'Planlagte mottak', 'Uke')).toBe(false)
  })

  it('ingenting hoppes over i en gyldig fil', () => {
    const resultat = validerStruktur(gyldig())
    for (const k of STYKKLISTE_KOLONNER) expect(hoppesOver(resultat, 'Stykkliste', k)).toBe(false)
  })
})
