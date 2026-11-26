// Startsiden «Ny kjøring» (Story 1.4 og 1.11, UX-DR7–UX-DR10, UX-DR12, FR-1, FR-27).
// h1, setningen om ett ferdigprodukt per fil og tre nummererte kort: nedlastingene, opplastingssonen og Beregn.
// All tekst står i tekster/nb.ts.
//
// Beregn (Story 1.11, AD-12):
// 1. Uten valgt fil: «Velg en fil først.» i sonen, og fokus til «Velg fil». Beregn deaktiveres aldri.
// 2. «Leser filen …» mens filen leses inn i nettleseren (`arrayBuffer()`), så «Beregner …» mens worker-en
//    arbeider. Ingen overlegg og ingen spinner.
// 3. Styringen (app/kjoring.ts) gir et utfall. Ved gyldig fil har den allerede gitt kjøringen til tilstanden
//    og gått til Resultat. Ved feil i hele filen eller uventet feil står meldingen i sonen, og filvalget
//    nullstilles. Ved valideringsfeil står feiloppsummeringen øverst og får fokus (Story 1.12).
//
// Feiloppsummeringen (Story 1.12, UX-DR11): overskriften i den er sidens h1, så «Ny kjøring» blir h2 så lenge
// den vises, og sidetittelen begynner med «Feil:». Gir en ny fil nye feil, oppdateres den, og fokus flyttes dit igjen.
//
// Statusen vises ved Beregn (synlig, uten role) og kunngjøres i den ene statusregionen i App.tsx,
// så skjermleseren ikke får den to ganger.
//
// Radiogruppen «Hva vil du beregne?» kommer i Epic 5. Til da gir Beregn bestillingsplanen (UX-DR9).

import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useTilstand } from '../../app/tilstand-handlinger.ts'
import { felles, filfeilOgValidering } from '../../tekster/nb.ts'
import { Feiloppsummering } from './Feiloppsummering.tsx'
import { lagOppsummering } from './feiloppsummering.ts'
import { endreFilvalg, startFilvalg, type Filvalg, type FilvalgHandling } from './filvalg.ts'
import { Opplastingssone } from './Opplastingssone.tsx'

// Filene ligger i public/ og er byte for byte like filene i testdata/ (tests/public-filer.test.ts).
const MAL = '/COSI-MRP-mal.xlsx'
const TESTEKSEMPEL_01 = '/testeksempel-01.xlsx'

/** Hvor lenge statusregionen står tom før en ny melding, så samme tekst to ganger også blir lest opp. */
const KUNNGJORING_PAUSE_MS = 50

const tekst = felles.nyKjoring

const redusent = (tilstand: Filvalg<File>, handling: FilvalgHandling<File>) => endreFilvalg(tilstand, handling)

export function NyKjoring() {
  const { send, kjorer } = useTilstand()
  const [filvalg, sendFilvalg] = useReducer(redusent, undefined, startFilvalg<File>)
  const velgFilKnapp = useRef<HTMLButtonElement>(null)
  const feilbrett = useRef<HTMLElement>(null)
  const pagar = useRef(false)
  const kunngjoring = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  /** Gir teksten til statusregionen. Den tømmes først, så en gjentatt melding også leses opp. */
  function kunngjor(melding: string) {
    clearTimeout(kunngjoring.current)
    send({ type: 'FJERN_STATUSMELDING' })
    kunngjoring.current = setTimeout(() => send({ type: 'VIS_STATUSMELDING', melding }), KUNNGJORING_PAUSE_MS)
  }

  const oppsummering = useMemo(
    () => (filvalg.valideringsfeil === null ? null : lagOppsummering(filvalg.valideringsfeil)),
    [filvalg.valideringsfeil],
  )

  // Feiloppsummeringen får fokus etter hver kjøring med valideringsfeil (UX-DR11). Hvert svar er et nytt objekt,
  // så fokus flyttes også når en ny fil gir feil mens den forrige oppsummeringen står.
  useEffect(() => {
    if (oppsummering !== null) feilbrett.current?.focus()
  }, [oppsummering])

  // «Velg en fil først.»: fokus til «Velg fil» etter at meldingen er tegnet og koblet til knappen med
  // aria-describedby, så skjermleseren leser meldingen sammen med knappen. Hvert klikk gir et nytt objekt.
  useEffect(() => {
    if (filvalg.melding?.type === 'VELG_FIL_FORST') velgFilKnapp.current?.focus()
  }, [filvalg.melding])

  function velgFiler(filer: File[]) {
    if (filvalg.fremdrift !== 'KLAR') return
    sendFilvalg({ type: 'VELG_FILER', filer })
    // Etter et slipp står fokus ikke i sonen, så meldingen kunngjøres.
    if (filer.length > 1) kunngjor(tekst.opplasting.flereFiler)
  }

  async function beregn() {
    // Et nytt klikk mens en kjøring pågår, starter ingen ny (AD-12). Styringen sperrer også, men lesingen skjer før den.
    if (pagar.current) return
    const fil = filvalg.fil
    if (!fil) {
      // Fokus flyttes til «Velg fil» i effekten over, og meldingen leses fordi knappen er beskrevet av den.
      // Ingen kunngjøring i tillegg.
      sendFilvalg({ type: 'BEREGN_UTEN_FIL' })
      return
    }

    pagar.current = true
    try {
      sendFilvalg({ type: 'START_LESING' })
      kunngjor(tekst.beregning.leserFilen)
      let innhold: ArrayBuffer
      try {
        innhold = await fil.arrayBuffer()
      } catch {
        sendFilvalg({ type: 'LESING_FEILET' })
        kunngjor(filfeilOgValidering.heleFilen.UVENTET_FEIL)
        return
      }

      sendFilvalg({ type: 'START_BEREGNING' })
      kunngjor(tekst.beregning.beregner)
      const utfall = await kjorer.kjor({ innhold, filnavn: fil.name, valg: 'BESTILLINGSPLAN' })
      sendFilvalg({ type: 'SVAR', utfall })

      switch (utfall.type) {
        case 'FERDIG': {
          const plan = utfall.kjoring.resultat
          kunngjor(
            plan === null
              ? tekst.beregning.ferdigUtenPlan
              : tekst.beregning.ferdig(plan.bestillingsforslag.length, plan.kritiskeDeler.length),
          )
          break
        }
        case 'FILFEIL':
          kunngjor(filfeilOgValidering.heleFilen[utfall.feil.kode])
          break
        case 'UVENTET_FEIL':
          kunngjor(filfeilOgValidering.heleFilen.UVENTET_FEIL)
          break
        case 'VALIDERINGSFEIL':
          // Meldingen får fokus og leses opp derfra. Statusregionen tømmes.
          clearTimeout(kunngjoring.current)
          send({ type: 'FJERN_STATUSMELDING' })
          break
        case 'OPPTATT':
          break
      }
    } finally {
      pagar.current = false
    }
  }

  const fremdriftstekst =
    filvalg.fremdrift === 'LESER' ? tekst.beregning.leserFilen : filvalg.fremdrift === 'BEREGNER' ? tekst.beregning.beregner : ''

  return (
    <section className="visning">
      {oppsummering === null ? (
        <>
          <title>{felles.sidetittel(felles.visninger.nyKjoring)}</title>
          <h1 tabIndex={-1}>{felles.visninger.nyKjoring}</h1>
        </>
      ) : (
        <>
          <title>{filfeilOgValidering.feiloppsummering.sidetittel}</title>
          <Feiloppsummering oppsummering={oppsummering} brett={feilbrett} />
          <h2 className="visningstittel">{felles.visninger.nyKjoring}</h2>
        </>
      )}
      <p className="ingress">{tekst.ettFerdigprodukt}</p>
      <ol className="startkort">
        <li className="kort">
          <h2>{tekst.kort.fyllUt.tittel}</h2>
          <p className="kort-tekst">{tekst.kort.fyllUt.tekst}</p>
          <p className="knapp-rad">
            <a className="knapp" href={MAL} download>
              {tekst.kort.fyllUt.lastNedMalen}
            </a>
            <a className="knapp" href={TESTEKSEMPEL_01} download>
              {tekst.kort.fyllUt.lastNedTesteksempel}
            </a>
          </p>
        </li>
        <li className="kort">
          <h2>{tekst.kort.lastOpp.tittel}</h2>
          <Opplastingssone
            filnavn={filvalg.fil?.name ?? null}
            melding={filvalg.melding}
            velgFiler={velgFiler}
            velgFilKnapp={velgFilKnapp}
          />
        </li>
        <li className="kort kort-bred">
          <h2>{tekst.kort.beregn.tittel}</h2>
          <div className="beregn-rad">
            <p className="kort-tekst">{tekst.kort.beregn.tekst}</p>
            <div className="beregn-handling">
              <button type="button" className="knapp knapp-primaer knapp-beregn" onClick={() => void beregn()}>
                {tekst.beregning.beregn}
              </button>
              <p className="beregn-status">{fremdriftstekst}</p>
            </div>
          </div>
        </li>
      </ol>
    </section>
  )
}
