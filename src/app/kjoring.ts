// Styringen av én kjøring (Story 1.10, AD-5, AD-12): starter worker-en, venter på svaret og gjør det om til
// en `Kjoring` eller en feil. Bare denne fila kjører en kjøring.
//
// - Én kjøring om gangen: et nytt kall mens en kjøring pågår, starter ingen ny (AD-12).
// - Har worker-en ikke svart innen 30 sekunder, stopper styringen den med `terminate()` og gir uventet feil (AD-5).
// - En worker som krasjer (`error` eller `messageerror`), og et svar styringen ikke forstår, gir uventet feil.
// - Ved gyldig svar lages `Kjoring`, den gis til tilstanden, og appen går til `#/resultat`. Tidspunktet settes her, ikke i kjernen (AD-2).
// - Alt utenfra (worker, tidtakere, klokke, tilstand og navigering) kommer inn som parametre, så fila kan testes
//   med en falsk worker og falske tidtakere.
//
// Statusmeldingene («Leser filen …» og «Beregner …») og feilmeldingene hører til Story 1.11. Denne fila gir
// feilene tilbake som en verdi, så skjermen kan vise dem. Lagring og sammenligning med forrige kjøring (AD-12,
// punkt 3–6) kommer i Epic 4 (Story 4.1 og 4.2).

import type { Dispatch } from 'react'
import type { Filfeil, Kjoring, Valg, Valideringsresultat } from '../domene/typer.ts'
import { erWorkerSvar, type WorkerInn, type WorkerSvar } from '../worker/meldinger.ts'
import type { Handling } from './tilstand-handlinger.ts'

/** Tiden worker-en har på seg (AD-5). */
export const TIDSGRENSE_MS = 30_000

/** Adressen appen går til når en kjøring er ferdig (AD-13). */
export const RESULTAT_ADRESSE = '#/resultat'

/** Den delen av en `Worker` styringen bruker. En falsk worker i testene har de samme medlemmene. */
export interface WorkerGrensesnitt {
  onmessage: ((hendelse: { data: unknown }) => void) | null
  onerror: ((hendelse: unknown) => void) | null
  onmessageerror: ((hendelse: unknown) => void) | null
  postMessage(melding: WorkerInn, overfor: Transferable[]): void
  terminate(): void
}

export type KjoringAvhengigheter = {
  lagWorker: () => WorkerGrensesnitt
  /** `setTimeout` i nettleseren, en falsk tidtaker i testene. */
  settTidsgrense: (kall: () => void, millisekunder: number) => unknown
  fjernTidsgrense: (id: unknown) => void
  /** Tidspunktet nå som ISO 8601-tekst (AD-2, AD-4). */
  naa: () => string
  /** Gir handlinger til den felles tilstanden (AD-13). */
  send: Dispatch<Handling>
  /** Går til en adresse i appen. */
  gaTil: (adresse: string) => void
}

/** Det som skal leses og beregnes. `innhold` overføres til worker-en, så det er tomt i styringen etterpå. */
export type FilTilKjoring = {
  innhold: ArrayBuffer
  filnavn: string
  valg: Valg
}

export type KjoringUtfall =
  | { type: 'FERDIG'; kjoring: Kjoring }
  | { type: 'VALIDERINGSFEIL'; feil: Valideringsresultat }
  | { type: 'FILFEIL'; feil: Filfeil }
  | { type: 'UVENTET_FEIL' }
  /** Et kall mens en kjøring pågår. Ingen ny kjøring er startet. */
  | { type: 'OPPTATT' }

export type Kjorer = {
  kjor(fil: FilTilKjoring): Promise<KjoringUtfall>
  /** Om en kjøring pågår nå. */
  pagar(): boolean
}

const UVENTET: KjoringUtfall = { type: 'UVENTET_FEIL' }

export function lagKjorer(av: KjoringAvhengigheter): Kjorer {
  let pagar = false

  function kjor({ innhold, filnavn, valg }: FilTilKjoring): Promise<KjoringUtfall> {
    if (pagar) return Promise.resolve({ type: 'OPPTATT' })
    pagar = true

    return new Promise<KjoringUtfall>((lever) => {
      let ferdig = false
      let worker: WorkerGrensesnitt | null = null
      let tidsgrense: unknown

      /** Avslutter kjøringen én gang: rydder opp og gir utfallet. Senere hendelser fra worker-en ignoreres. */
      const avslutt = (utfall: KjoringUtfall): void => {
        if (ferdig) return
        ferdig = true
        pagar = false
        av.fjernTidsgrense(tidsgrense)
        if (worker) {
          worker.onmessage = null
          worker.onerror = null
          worker.onmessageerror = null
          worker.terminate()
        }
        lever(utfall)
      }

      try {
        worker = av.lagWorker()
        tidsgrense = av.settTidsgrense(() => avslutt(UVENTET), TIDSGRENSE_MS)
        worker.onmessage = ({ data }) => avslutt(tilUtfall(data, { valg, filnavn }, av))
        worker.onerror = () => avslutt(UVENTET)
        worker.onmessageerror = () => avslutt(UVENTET)
        worker.postMessage({ innhold, filnavn, valg }, [innhold])
      } catch {
        // Worker-en kunne ikke lages eller få filen. Det er uventet, og siden skal ikke henge.
        avslutt(UVENTET)
      }
    })
  }

  return { kjor, pagar: () => pagar }
}

/**
 * Svaret fra worker-en som utfall. Ved gyldig svar lages `Kjoring`, den gis til tilstanden, og appen går til
 * Resultat. Et svar styringen ikke forstår, gir uventet feil, og det gjør også en feil under dette (AD-5).
 */
function tilUtfall(svar: unknown, fil: { valg: Valg; filnavn: string }, av: KjoringAvhengigheter): KjoringUtfall {
  if (!erWorkerSvar(svar)) return UVENTET
  return utfallFor(svar, fil, av)
}

function utfallFor(svar: WorkerSvar, { valg, filnavn }: { valg: Valg; filnavn: string }, av: KjoringAvhengigheter): KjoringUtfall {
  switch (svar.type) {
    case 'VALIDERINGSFEIL':
      return { type: 'VALIDERINGSFEIL', feil: svar.feil }
    case 'FILFEIL':
      return { type: 'FILFEIL', feil: svar.feil }
    case 'UVENTET_FEIL':
      return UVENTET
    case 'GYLDIG': {
      const ferdigprodukt = svar.inndata.stykkliste[0]
      if (!ferdigprodukt) return UVENTET
      try {
        const kjoring: Kjoring = {
          valg,
          filnavn,
          tidspunkt: av.naa(),
          ferdigprodukt: { varenummer: ferdigprodukt.varenummer, beskrivelse: ferdigprodukt.beskrivelse },
          horisont: svar.inndata.horisont,
          resultat: svar.resultat,
          kapasitet: svar.kapasitet,
          sammenligning: null,
          // Midlertidig til lagring av kjøringer er bygd (Story 4.1): ingenting lagres ennå.
          lagring: valg === 'PRODUKSJONSKAPASITET' ? 'IKKE_LAGRET_BARE_KAPASITET' : 'IKKE_LAGRET_BLOKKERT',
        }
        av.send({ type: 'VIS_KJORING', kjoring })
        av.gaTil(RESULTAT_ADRESSE)
        return { type: 'FERDIG', kjoring }
      } catch {
        return UVENTET
      }
    }
  }
}

/**
 * Styringen med den ekte worker-en, klokken og tidtakerne i nettleseren. `send` er `send` fra
 * `useTilstand()`. `new Worker(new URL(…))` er formen Vite bundler som en egen fil, som CSP-en tillater (`worker-src 'self'`).
 */
export function lagStandardKjorer(send: Dispatch<Handling>): Kjorer {
  return lagKjorer({
    lagWorker: () =>
      new Worker(new URL('../worker/beregning.worker.ts', import.meta.url), { type: 'module' }) as unknown as WorkerGrensesnitt,
    settTidsgrense: (kall, millisekunder) => setTimeout(kall, millisekunder),
    fjernTidsgrense: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
    naa: () => new Date().toISOString(),
    send,
    gaTil: (adresse) => {
      window.location.hash = adresse
    },
  })
}
