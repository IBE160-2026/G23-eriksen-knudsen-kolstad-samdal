// Meldingene mellom styringen (app/kjoring.ts) og worker-en (worker/beregning.worker.ts) (Story 1.10, AD-12).
// Typene bruker typene fra domene/typer.ts, og meldingene kan sendes med structuredClone: ingen funksjoner
// og ingen klasser, bare data.

import type { Filfeil, Inndata, Kapasitet, Resultat, Valg, Valideringsresultat } from '../domene/typer.ts'

/** Det styringen sender: filens innhold (overført, ikke kopiert), filnavnet og valget under «Hva vil du beregne?». */
export type WorkerInn = {
  innhold: ArrayBuffer
  filnavn: string
  valg: Valg
}

/**
 * Det worker-en svarer, som én melding per kjøring (AD-5, AD-12). Worker-en sender aldri et halvt resultat.
 *
 * - GYLDIG: filen er lest og gyldig. `resultat` og `kapasitet` er null til beregningen (Epic 2) og
 *   kapasiteten (Epic 5) er bygd. Da fylles de ut etter valget (FR-30).
 * - VALIDERINGSFEIL: alle feilene i filen, samlet (FR-4).
 * - FILFEIL: feil i hele filen (NFR-9).
 * - UVENTET_FEIL: noe uventet gikk galt i lesing eller validering. Styringen gjør det om til en norsk melding.
 */
export type WorkerSvar =
  | { type: 'GYLDIG'; inndata: Inndata; resultat: Resultat | null; kapasitet: Kapasitet | null }
  | { type: 'VALIDERINGSFEIL'; feil: Valideringsresultat }
  | { type: 'FILFEIL'; feil: Filfeil }
  | { type: 'UVENTET_FEIL' }

export type WorkerSvarType = WorkerSvar['type']

const SVARTYPER: readonly WorkerSvarType[] = ['GYLDIG', 'VALIDERINGSFEIL', 'FILFEIL', 'UVENTET_FEIL']

function erObjekt(verdi: unknown): verdi is Record<string, unknown> {
  return typeof verdi === 'object' && verdi !== null
}

/**
 * Om noe som kom fra worker-en, har formen til et `WorkerSvar`. Styringen kontrollerer det, siden et svar
 * den ikke forstår, ikke skal bli til en kjøring (AD-5).
 */
export function erWorkerSvar(verdi: unknown): verdi is WorkerSvar {
  if (!erObjekt(verdi) || !SVARTYPER.includes(verdi['type'] as WorkerSvarType)) return false
  switch (verdi['type']) {
    case 'GYLDIG':
      return erObjekt(verdi['inndata']) && Array.isArray(verdi['inndata']['stykkliste']) && typeof verdi['inndata']['horisont'] === 'number'
    case 'VALIDERINGSFEIL':
      return erObjekt(verdi['feil']) && Array.isArray(verdi['feil']['feil'])
    case 'FILFEIL':
      return erObjekt(verdi['feil']) && typeof verdi['feil']['kode'] === 'string'
    default:
      return true
  }
}
