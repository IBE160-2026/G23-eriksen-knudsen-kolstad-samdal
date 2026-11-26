// Worker-en for en kjøring (Story 1.10, AD-12). Tar imot én melding med filen og svarer med én melding.
// Selve arbeidet står i kjor.ts. Worker-en har ingen tilstand, rører ikke localStorage og bruker ikke DOM-en.

import { kjorFil } from './kjor.ts'
import type { WorkerInn, WorkerSvar } from './meldinger.ts'

/** Den delen av worker-ens globale objekt vi bruker. `self` er typet som et vindu i denne tsconfig-en. */
type Arbeidsrom = {
  onmessage: ((hendelse: { data: WorkerInn }) => void) | null
  postMessage(svar: WorkerSvar): void
}

const rom = self as unknown as Arbeidsrom

rom.onmessage = ({ data }) => {
  try {
    rom.postMessage(kjorFil(data))
  } catch {
    // Selv svaret kunne ikke sendes. Styringen får beskjed om at noe gikk galt, og aldri et halvt svar (AD-5).
    rom.postMessage({ type: 'UVENTET_FEIL' })
  }
}
