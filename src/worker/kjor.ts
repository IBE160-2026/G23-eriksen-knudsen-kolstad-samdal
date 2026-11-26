// Det worker-en gjør med én melding (Story 1.10 og 2.5, AD-5, AD-12): leser filen, validerer den, beregner
// bestillingsplanen og svarer med én melding. Står i en egen fil, så den kan testes med de ekte filene i Node uten en worker.
//
// - Kaster aldri unntak. Et uventet unntak i lesing, validering eller beregning gir UVENTET_FEIL, uten noe resultat (AD-5).
// - Har ingen tilstand mellom kjøringer, rører ikke localStorage og har ingen tilgang til DOM-en.
// - Bestillingsplanen (struktur, beregning og eksepsjoner) beregnes når valget er Bestillingsplan eller Begge (FR-30).
//   Kapasiteten (Epic 5) kjøres her når den finnes. Til da er `kapasitet` null.

import { beregnBestillingsplan } from '../domene/beregn.ts'
import { finnEksepsjoner } from '../domene/eksepsjoner.ts'
import { byggStruktur } from '../domene/struktur.ts'
import type { Inndata, Resultat } from '../domene/typer.ts'
import { valider } from '../domene/valider.ts'
import { les } from '../excel/les.ts'
import type { WorkerInn, WorkerSvar } from './meldinger.ts'

/**
 * Bestillingsplanen for en gyldig fil: stykklistestrukturen (AD-6), beregningen nivå for nivå (AD-7, AD-8) og eksepsjonene
 * (FR-9–FR-13, FR-29). De kritiske delene er delene med minst én eksepsjon. Samme inndata gir alltid samme resultat (FR-8).
 * Kaster ved en programfeil. `kjorFil` gjør det om til UVENTET_FEIL.
 */
export function lagBestillingsplan(inndata: Inndata): Resultat {
  const plan = beregnBestillingsplan(inndata, byggStruktur(inndata.stykkliste))
  const { eksepsjoner, kritiskeDeler } = finnEksepsjoner(plan.deler, inndata.planlagteMottak, inndata.horisont)
  const kritiske = new Set(kritiskeDeler)
  return {
    ...plan,
    deler: plan.deler.map((del) => ({ ...del, kritisk: kritiske.has(del.del.varenummer) })),
    eksepsjoner,
    kritiskeDeler,
  }
}

export function kjorFil({ innhold, filnavn, valg }: WorkerInn): WorkerSvar {
  try {
    const lest = les(innhold, filnavn)
    if (!lest.ok) return { type: 'FILFEIL', feil: lest.feil }

    const validert = valider(lest.verdi)
    if (!validert.ok) return { type: 'VALIDERINGSFEIL', feil: validert.feil }

    const resultat = valg === 'PRODUKSJONSKAPASITET' ? null : lagBestillingsplan(validert.verdi)
    return { type: 'GYLDIG', inndata: validert.verdi, resultat, kapasitet: null }
  } catch {
    return { type: 'UVENTET_FEIL' }
  }
}
