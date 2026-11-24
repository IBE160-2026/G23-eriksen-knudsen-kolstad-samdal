// Det worker-en gjør med én melding (Story 1.10, AD-5, AD-12): leser filen, validerer den og svarer.
// Står i en egen fil, så den kan testes med de ekte filene i Node uten en worker.
//
// - Kaster aldri unntak. Et uventet unntak i lesing eller validering gir UVENTET_FEIL (AD-5).
// - Har ingen tilstand mellom kjøringer, rører ikke localStorage og har ingen tilgang til DOM-en.
// - Beregningen (Epic 2) og kapasiteten (Epic 5) kjøres her når de finnes. Til da er `resultat` og `kapasitet` null.

import { valider } from '../domene/valider.ts'
import { les } from '../excel/les.ts'
import type { WorkerInn, WorkerSvar } from './meldinger.ts'

export function kjorFil({ innhold, filnavn }: WorkerInn): WorkerSvar {
  try {
    const lest = les(innhold, filnavn)
    if (!lest.ok) return { type: 'FILFEIL', feil: lest.feil }

    const validert = valider(lest.verdi)
    if (!validert.ok) return { type: 'VALIDERINGSFEIL', feil: validert.feil }

    return { type: 'GYLDIG', inndata: validert.verdi, resultat: null, kapasitet: null }
  } catch {
    return { type: 'UVENTET_FEIL' }
  }
}
