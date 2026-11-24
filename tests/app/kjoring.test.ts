// Styringen av én kjøring (Story 1.10, AD-5, AD-12), med en falsk worker og falske tidtakere.
// Den ekte worker-en testes i e2e/worker.spec.ts, og det worker-en gjør, i tests/worker/kjor.test.ts.

import { describe, expect, it } from 'vitest'
import { lagKjorer, RESULTAT_ADRESSE, TIDSGRENSE_MS, type WorkerGrensesnitt } from '../../src/app/kjoring.ts'
import type { Handling } from '../../src/app/tilstand-handlinger.ts'
import type { Inndata, Valg, Valideringsresultat } from '../../src/domene/typer.ts'
import type { WorkerInn } from '../../src/worker/meldinger.ts'

class FalskWorker implements WorkerGrensesnitt {
  onmessage: ((hendelse: { data: unknown }) => void) | null = null
  onerror: ((hendelse: unknown) => void) | null = null
  onmessageerror: ((hendelse: unknown) => void) | null = null
  sendt: { melding: WorkerInn; overfor: Transferable[] }[] = []
  avsluttet = false
  kasterVedSending = false

  postMessage(melding: WorkerInn, overfor: Transferable[]): void {
    if (this.kasterVedSending) throw new DOMException('Kunne ikke sendes', 'DataCloneError')
    this.sendt.push({ melding, overfor })
  }

  terminate(): void {
    this.avsluttet = true
  }

  /** Worker-en svarer. En hendelse til en behandler som er fjernet, når ingen. */
  svar(data: unknown): void {
    this.onmessage?.({ data })
  }
}

const NAA = '2026-11-24T12:00:00.000Z'

function oppsett(alternativer: { lagWorkerKaster?: boolean; sendKaster?: boolean } = {}) {
  const workere: FalskWorker[] = []
  const tidtakere: { kall: () => void; millisekunder: number; fjernet: boolean }[] = []
  const handlinger: Handling[] = []
  const adresser: string[] = []
  const kjorer = lagKjorer({
    lagWorker: () => {
      if (alternativer.lagWorkerKaster) throw new Error('Kunne ikke lage worker')
      const w = new FalskWorker()
      workere.push(w)
      return w
    },
    settTidsgrense: (kall, millisekunder) => {
      tidtakere.push({ kall, millisekunder, fjernet: false })
      return tidtakere.length - 1
    },
    fjernTidsgrense: (id) => {
      const t = tidtakere[id as number]
      if (t) t.fjernet = true
    },
    naa: () => NAA,
    send: (handling) => {
      if (alternativer.sendKaster) throw new Error('Tilstanden kunne ikke endres')
      handlinger.push(handling)
    },
    gaTil: (adresse) => void adresser.push(adresse),
  })
  return { kjorer, workere, tidtakere, handlinger, adresser }
}

const FIL = (valgt: Valg = 'BESTILLINGSPLAN') => ({ innhold: new ArrayBuffer(16), filnavn: 'testeksempel-01.xlsx', valg: valgt })

const INNDATA: Inndata = {
  stykkliste: [
    {
      excelRad: 2,
      nivaa: '0',
      varenummer: '100-002',
      beskrivelse: 'Kontorstol Basic',
      antall: null,
      type: 'FERDIGVARE',
      lagerbeholdning: 0,
      sikkerhetslager: 0,
      ledetid: 0,
    },
  ],
  horisont: 10,
  prognostiserteBehov: [20, 25, 30, 20, 35, 30, 25, 40, 30, 20],
  planlagteMottak: [],
}

const GYLDIG = { type: 'GYLDIG', inndata: INNDATA, resultat: null, kapasitet: null }

const VALIDERINGSFEIL: Valideringsresultat = {
  feil: [{ kode: 'ANTALL_UGYLDIG', ark: 'Stykkliste', sted: { type: 'CELLE', celle: 'D9', excelRad: 9 }, felt: 'Antall', verdi: 'fem' }],
  hoppetOver: [],
}

describe('en kjøring starter', () => {
  it('worker-en får filen overført, filnavnet og valget, og tidsgrensen er 30 sekunder', () => {
    const { kjorer, workere, tidtakere } = oppsett()
    const fil = FIL('BEGGE')
    void kjorer.kjor(fil)
    expect(workere).toHaveLength(1)
    expect(workere[0]!.sendt).toHaveLength(1)
    expect(workere[0]!.sendt[0]).toEqual({ melding: { innhold: fil.innhold, filnavn: 'testeksempel-01.xlsx', valg: 'BEGGE' }, overfor: [fil.innhold] })
    expect(workere[0]!.sendt[0]!.overfor[0]).toBe(fil.innhold)
    expect(tidtakere).toHaveLength(1)
    expect(tidtakere[0]!.millisekunder).toBe(30_000)
    expect(TIDSGRENSE_MS).toBe(30_000)
    expect(kjorer.pagar()).toBe(true)
  })
})

describe('gyldig svar', () => {
  it('lager Kjoring med valg, filnavn, tidspunkt, ferdigprodukt og horisont, gir den til tilstanden og går til Resultat', async () => {
    const { kjorer, workere, handlinger, adresser } = oppsett()
    const utfall = kjorer.kjor(FIL('BESTILLINGSPLAN'))
    workere[0]!.svar(GYLDIG)
    const ferdig = await utfall
    expect(ferdig.type).toBe('FERDIG')
    if (ferdig.type !== 'FERDIG') return
    expect(ferdig.kjoring).toEqual({
      valg: 'BESTILLINGSPLAN',
      filnavn: 'testeksempel-01.xlsx',
      tidspunkt: NAA,
      ferdigprodukt: { varenummer: '100-002', beskrivelse: 'Kontorstol Basic' },
      horisont: 10,
      resultat: null,
      kapasitet: null,
      sammenligning: null,
      lagring: 'IKKE_LAGRET_BLOKKERT',
    })
    expect(handlinger).toEqual([{ type: 'VIS_KJORING', kjoring: ferdig.kjoring }])
    expect(adresser).toEqual(['#/resultat'])
    expect(RESULTAT_ADRESSE).toBe('#/resultat')
  })

  it('stopper worker-en og tidsgrensen, og en ny kjøring kan startes etterpå', async () => {
    const { kjorer, workere, tidtakere } = oppsett()
    const forste = kjorer.kjor(FIL())
    workere[0]!.svar(GYLDIG)
    await forste
    expect(workere[0]!.avsluttet).toBe(true)
    expect(tidtakere[0]!.fjernet).toBe(true)
    expect(kjorer.pagar()).toBe(false)

    const andre = kjorer.kjor(FIL())
    expect(workere).toHaveLength(2)
    workere[1]!.svar(GYLDIG)
    expect((await andre).type).toBe('FERDIG')
  })

  it('bare kapasitet gir lagringsstatusen for bare kapasitet (FR-30)', async () => {
    const { kjorer, workere } = oppsett()
    const utfall = kjorer.kjor(FIL('PRODUKSJONSKAPASITET'))
    workere[0]!.svar(GYLDIG)
    const ferdig = await utfall
    expect(ferdig.type === 'FERDIG' && ferdig.kjoring.lagring).toBe('IKKE_LAGRET_BARE_KAPASITET')
  })

  it('en melding fra worker-en etter at kjøringen er ferdig, gjør ingenting', async () => {
    const { kjorer, workere, handlinger, adresser } = oppsett()
    const utfall = kjorer.kjor(FIL())
    workere[0]!.svar(GYLDIG)
    await utfall
    workere[0]!.svar(GYLDIG)
    workere[0]!.onerror?.({})
    expect(handlinger).toHaveLength(1)
    expect(adresser).toHaveLength(1)
  })

  it('et gyldig svar uten ferdigprodukt eller et svar der tilstanden kaster, gir uventet feil og ingen kjøring', async () => {
    const tom = oppsett()
    const a = tom.kjorer.kjor(FIL())
    tom.workere[0]!.svar({ ...GYLDIG, inndata: { ...INNDATA, stykkliste: [] } })
    expect(await a).toEqual({ type: 'UVENTET_FEIL' })
    expect(tom.adresser).toEqual([])

    const kaster = oppsett({ sendKaster: true })
    const b = kaster.kjorer.kjor(FIL())
    kaster.workere[0]!.svar(GYLDIG)
    expect(await b).toEqual({ type: 'UVENTET_FEIL' })
    expect(kaster.adresser).toEqual([])
    expect(kaster.kjorer.pagar()).toBe(false)
  })
})

describe('feil gis tilbake som en verdi, uten Kjoring, og ingenting endres', () => {
  it('valideringsfeil', async () => {
    const { kjorer, workere, handlinger, adresser } = oppsett()
    const utfall = kjorer.kjor(FIL())
    workere[0]!.svar({ type: 'VALIDERINGSFEIL', feil: VALIDERINGSFEIL })
    expect(await utfall).toEqual({ type: 'VALIDERINGSFEIL', feil: VALIDERINGSFEIL })
    expect(handlinger).toEqual([])
    expect(adresser).toEqual([])
    expect(workere[0]!.avsluttet).toBe(true)
  })

  it('filfeil', async () => {
    const { kjorer, workere, handlinger } = oppsett()
    const utfall = kjorer.kjor(FIL())
    workere[0]!.svar({ type: 'FILFEIL', feil: { kode: 'PASSORDBESKYTTET' } })
    expect(await utfall).toEqual({ type: 'FILFEIL', feil: { kode: 'PASSORDBESKYTTET' } })
    expect(handlinger).toEqual([])
  })

  it('UVENTET_FEIL fra worker-en', async () => {
    const { kjorer, workere, handlinger } = oppsett()
    const utfall = kjorer.kjor(FIL())
    workere[0]!.svar({ type: 'UVENTET_FEIL' })
    expect(await utfall).toEqual({ type: 'UVENTET_FEIL' })
    expect(handlinger).toEqual([])
  })

  it.each([null, undefined, 'GYLDIG', 42, {}, { type: 'ANNET' }, { type: 'GYLDIG' }, { type: 'FILFEIL' }])(
    'et svar styringen ikke forstår (%j) gir uventet feil',
    async (svar) => {
      const { kjorer, workere, handlinger } = oppsett()
      const utfall = kjorer.kjor(FIL())
      workere[0]!.svar(svar)
      expect(await utfall).toEqual({ type: 'UVENTET_FEIL' })
      expect(handlinger).toEqual([])
    },
  )

  it('etter en feil kan en ny kjøring starte, uten å laste siden på nytt (NFR-9)', async () => {
    const { kjorer, workere } = oppsett()
    const feil = kjorer.kjor(FIL())
    workere[0]!.svar({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } })
    await feil
    const ny = kjorer.kjor(FIL())
    workere[1]!.svar(GYLDIG)
    expect((await ny).type).toBe('FERDIG')
  })
})

describe('worker som krasjer', () => {
  it.each(['onerror', 'onmessageerror'] as const)('%s gir uventet feil, og worker-en stoppes', async (hendelse) => {
    const { kjorer, workere, tidtakere, handlinger } = oppsett()
    const utfall = kjorer.kjor(FIL())
    workere[0]![hendelse]?.({ message: 'krasj' })
    expect(await utfall).toEqual({ type: 'UVENTET_FEIL' })
    expect(workere[0]!.avsluttet).toBe(true)
    expect(tidtakere[0]!.fjernet).toBe(true)
    expect(handlinger).toEqual([])
    expect(kjorer.pagar()).toBe(false)
  })

  it('en worker som ikke lar seg lage, gir uventet feil, og siden henger ikke', async () => {
    const { kjorer } = oppsett({ lagWorkerKaster: true })
    expect(await kjorer.kjor(FIL())).toEqual({ type: 'UVENTET_FEIL' })
    expect(kjorer.pagar()).toBe(false)
  })

  it('en worker som ikke kan få filen, gir uventet feil, og worker-en stoppes', async () => {
    const { kjorer, workere } = oppsettMedSendefeil()
    expect(await kjorer.kjor(FIL())).toEqual({ type: 'UVENTET_FEIL' })
    expect(workere[0]!.avsluttet).toBe(true)
    expect(kjorer.pagar()).toBe(false)
  })
})

/** En styring der worker-en kaster når filen sendes. */
function oppsettMedSendefeil() {
  const workere: FalskWorker[] = []
  const kjorer = lagKjorer({
    lagWorker: () => {
      const w = new FalskWorker()
      w.kasterVedSending = true
      workere.push(w)
      return w
    },
    settTidsgrense: () => 0,
    fjernTidsgrense: () => undefined,
    naa: () => NAA,
    send: () => undefined,
    gaTil: () => undefined,
  })
  return { kjorer, workere }
}

describe('tidsgrense (AD-5)', () => {
  it('har ikke worker-en svart innen 30 sekunder, stoppes den med terminate(), og svaret er uventet feil', async () => {
    const { kjorer, workere, tidtakere, handlinger, adresser } = oppsett()
    const utfall = kjorer.kjor(FIL())
    expect(tidtakere[0]!.millisekunder).toBe(30_000)
    tidtakere[0]!.kall()
    expect(await utfall).toEqual({ type: 'UVENTET_FEIL' })
    expect(workere[0]!.avsluttet).toBe(true)
    expect(handlinger).toEqual([])
    expect(adresser).toEqual([])
    expect(kjorer.pagar()).toBe(false)
  })

  it('et svar som kommer etter tidsgrensen, blir ignorert', async () => {
    const { kjorer, workere, tidtakere, handlinger, adresser } = oppsett()
    const utfall = kjorer.kjor(FIL())
    tidtakere[0]!.kall()
    await utfall
    workere[0]!.svar(GYLDIG)
    expect(handlinger).toEqual([])
    expect(adresser).toEqual([])
  })

  it('et svar innen tidsgrensen stopper tidtakeren, så den ikke utløses senere', async () => {
    const { kjorer, workere, tidtakere } = oppsett()
    const utfall = kjorer.kjor(FIL())
    workere[0]!.svar(GYLDIG)
    await utfall
    expect(tidtakere[0]!.fjernet).toBe(true)
    // Utløses den likevel, endrer det ingenting: kjøringen er alt avsluttet.
    expect(() => tidtakere[0]!.kall()).not.toThrow()
  })

  it('en gammel tidtaker som utløses etter at en ny kjøring har startet, rører ikke den nye', async () => {
    const { kjorer, workere, tidtakere } = oppsett()
    const forste = kjorer.kjor(FIL())
    workere[0]!.svar(GYLDIG)
    await forste

    const andre = kjorer.kjor(FIL())
    expect(kjorer.pagar()).toBe(true)
    tidtakere[0]!.kall() // den første kjøringens tidtaker, som alt er stoppet
    expect(kjorer.pagar()).toBe(true)
    expect(workere[1]!.avsluttet).toBe(false)
    expect(await kjorer.kjor(FIL())).toEqual({ type: 'OPPTATT' })

    workere[1]!.svar(GYLDIG)
    expect((await andre).type).toBe('FERDIG')
  })

  it('brukeren kan starte en ny kjøring straks etter tidsgrensen', async () => {
    const { kjorer, workere, tidtakere } = oppsett()
    const forste = kjorer.kjor(FIL())
    tidtakere[0]!.kall()
    await forste
    const andre = kjorer.kjor(FIL())
    expect(workere).toHaveLength(2)
    workere[1]!.svar(GYLDIG)
    expect((await andre).type).toBe('FERDIG')
  })
})

describe('nytt kall under en kjøring (AD-12)', () => {
  it('starter ingen ny kjøring, og den som pågår, fortsetter', async () => {
    const { kjorer, workere, tidtakere } = oppsett()
    const forste = kjorer.kjor(FIL())
    const andre = kjorer.kjor(FIL('BEGGE'))
    expect(await andre).toEqual({ type: 'OPPTATT' })
    expect(workere).toHaveLength(1)
    expect(tidtakere).toHaveLength(1)
    expect(workere[0]!.sendt).toHaveLength(1)

    workere[0]!.svar(GYLDIG)
    const ferdig = await forste
    expect(ferdig.type).toBe('FERDIG')
    expect(ferdig.type === 'FERDIG' && ferdig.kjoring.valg).toBe('BESTILLINGSPLAN')
  })

  it('mange kall under en kjøring gir like mange OPPTATT, og fortsatt bare én worker', async () => {
    const { kjorer, workere } = oppsett()
    const forste = kjorer.kjor(FIL())
    const kall = await Promise.all([kjorer.kjor(FIL()), kjorer.kjor(FIL()), kjorer.kjor(FIL())])
    expect(kall.map((k) => k.type)).toEqual(['OPPTATT', 'OPPTATT', 'OPPTATT'])
    expect(workere).toHaveLength(1)
    workere[0]!.svar({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } })
    await forste
  })
})
