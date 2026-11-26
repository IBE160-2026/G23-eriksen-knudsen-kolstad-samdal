// Resultattabellen (Story 2.7, FR-14–FR-16, AD-14, UX-DR21, UX-DR23, UX-DR24).
// Én <table> med seks rader per del og H ukekolonner, eksepsjonsmarkører i riktig celle, tegnforklaring,
// valgt celle og filteret «Vis bare kritiske deler». Tastaturstyringen (Story 2.9) og forklaringen av en celle
// (Epic 3) kommer senere: peking gjør ingenting annet enn en liten endring i ramme eller bakgrunn (FR-18).

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'
import type { Kjoring, Resultat } from '../../domene/typer.ts'
import { resultat as tekster } from '../../tekster/nb.ts'
import { DelTbody } from './DelTbody.tsx'
import { EKSEPSJONSVISNING, KODER } from './eksepsjonsvisning.ts'
import { overskriftId } from './seksjoner.ts'
import { rullInnIBildet, rullTilDel } from './rull.ts'
import {
  erLik,
  flytt,
  forstePlass,
  grupperMarkorer,
  hoppPlass,
  KOLONNE_FELT,
  KOLONNE_FORSTE_UKE,
  markorerFor,
  RADER,
  synligeDeler,
  valgEtterFilter,
  type Rutenettplass,
  type ValgtCelle,
} from './tabell-modell.ts'

function Tegnforklaring() {
  const t = tekster.tabell
  return (
    <ul className="tegnforklaring" aria-label={t.tegnforklaring.navn}>
      {KODER.map((kode) => (
        <li key={kode}>
          <span className={`markor ${EKSEPSJONSVISNING[kode].klasse}`} aria-hidden="true">
            {EKSEPSJONSVISNING[kode].symbol}
          </span>{' '}
          {t.eksepsjonsnavn[kode]}
        </li>
      ))}
      <li>
        <span className="kritisk-flagg">
          <span aria-hidden="true">●</span> {t.tegnforklaring.kritiskDel}
        </span>
      </li>
      <li>
        <span className="eksempel-valgt-celle" aria-hidden="true" /> {t.tegnforklaring.valgtCelle}
      </li>
    </ul>
  )
}

/** Det andre deler av siden kan be tabellen om (Story 2.10: hopp fra kritiske deler, og fra forfalt mengde i Story 2.11). */
export type Tabellstyring = {
  /** Ruller til delen, flytter fokus til cellen med delens tidligste eksepsjon og markerer delen kort. */
  hoppTilDel: (varenummer: string) => void
}

/** Hvor lenge delen er markert etter et hopp, i ms. */
const MARKERING_MS = 1600

type Props = { kjoring: Kjoring; resultat: Resultat; ref?: Ref<Tabellstyring> }

export function Resultattabell({ kjoring, resultat, ref }: Props) {
  const t = tekster.tabell
  const [bareKritiske, setBareKritiske] = useState(false)
  const [valgt, setValgt] = useState<ValgtCelle | null>(null)

  const markorer = useMemo(() => grupperMarkorer(resultat.eksepsjoner), [resultat.eksepsjoner])
  const uker = useMemo(() => Array.from({ length: kjoring.horisont }, (_, i) => i + 1), [kjoring.horisont])
  const synlige = useMemo(() => synligeDeler(resultat, bareKritiske), [resultat, bareKritiske])
  const harKritiske = resultat.kritiskeDeler.length > 0

  const velg = useCallback((celle: ValgtCelle) => setValgt(celle), [])

  // Tastaturstyringen (Story 2.9): én tabulatorstopp for hele tabellen (roving tabindex), og fokus flyttes med piltaster.
  const [aktiv, setAktiv] = useState<Rutenettplass | null>(null)
  const omraade = useRef<HTMLDivElement>(null)
  const skalFokusere = useRef(false)
  const skalRulleTilDel = useRef(false)
  const [markert, setMarkert] = useState<string | null>(null)
  const varenumre = useMemo(() => synlige.map((del) => del.del.varenummer), [synlige])
  // Skjules delen med tabulatorstoppet av filteret, flytter stoppet til første del som vises.
  const plass = useMemo(
    () => (aktiv !== null && varenumre.includes(aktiv.varenummer) ? aktiv : forstePlass(varenumre)),
    [aktiv, varenumre],
  )

  useLayoutEffect(() => {
    if (!skalFokusere.current || plass === null || omraade.current === null) return
    skalFokusere.current = false
    const del = omraade.current.querySelector(`tbody[data-del="${CSS.escape(plass.varenummer)}"]`)
    const celle = del?.querySelector(
      plass.k === KOLONNE_FELT ? '[data-k="0"]' : `[data-r="${plass.r}"][data-k="${plass.k}"]`,
    )
    if (!(celle instanceof HTMLElement)) return
    celle.focus({ preventScroll: true })
    if (skalRulleTilDel.current && del instanceof HTMLElement) {
      skalRulleTilDel.current = false
      rullTilDel(del, omraade.current)
    }
    rullInnIBildet(celle, omraade.current)
  }, [plass])

  // Delen er markert kort etter et hopp. Tidtakeren ryddes bort når tabellen forsvinner eller en ny markering starter.
  useEffect(() => {
    if (markert === null) return
    const tidtaker = setTimeout(() => setMarkert(null), MARKERING_MS)
    return () => clearTimeout(tidtaker)
  }, [markert])

  useImperativeHandle(
    ref,
    () => ({
      hoppTilDel(varenummer) {
        const mal = hoppPlass(resultat.eksepsjoner, varenummer)
        if (mal === null) return
        skalFokusere.current = true
        skalRulleTilDel.current = true
        setAktiv(mal)
        setMarkert(varenummer)
      },
    }),
    [resultat.eksepsjoner],
  )

  /** Cellen et element står i. Delens felt husker raden Kari kom fra. */
  function plassFra(element: Element): Rutenettplass | null {
    const celle = element.closest('[data-k]')
    const varenummer = celle?.closest('tbody')?.dataset.del
    if (!(celle instanceof HTMLElement) || varenummer === undefined) return null
    const k = Number(celle.dataset.k)
    const r = k === KOLONNE_FELT && plass?.varenummer === varenummer ? plass.r : Number(celle.dataset.r)
    return { varenummer, r, k }
  }

  function flyttFokus(ny: Rutenettplass) {
    skalFokusere.current = true
    setAktiv(ny)
  }

  function tast(hendelse: KeyboardEvent<HTMLTableElement>) {
    if (hendelse.altKey || hendelse.metaKey || hendelse.shiftKey) return
    const naa = plassFra(hendelse.target as Element)
    if (naa === null) return
    const rad = RADER[naa.r]
    if ((hendelse.key === 'Enter' || hendelse.key === ' ') && naa.k >= KOLONNE_FORSTE_UKE && rad !== undefined) {
      hendelse.preventDefault()
      setValgt({ varenummer: naa.varenummer, rad, uke: naa.k - 1 })
      return
    }
    const ny = flytt(naa, hendelse.key, hendelse.ctrlKey, varenumre, kjoring.horisont)
    if (ny === null) return
    hendelse.preventDefault() // Piltastene og PgUp/PgDn skal ikke rulle siden. Rullingen styres av rullInnIBildet.
    if (!erLik(ny, naa)) flyttFokus(ny)
  }

  // Klikk på en celle flytter tabulatorstoppet og fokus dit, så tastaturet fortsetter derfra.
  function klikk(hendelse: MouseEvent<HTMLTableElement>) {
    const ny = plassFra(hendelse.target as Element)
    if (ny !== null && !erLik(ny, plass)) flyttFokus(ny)
  }

  function byttFilter(pa: boolean) {
    setBareKritiske(pa)
    // Valgt celle i en del som skjules, nullstilles (UX-DR24).
    setValgt((forrige) => valgEtterFilter(forrige, synligeDeler(resultat, pa)))
  }

  const { beskrivelse, varenummer } = kjoring.ferdigprodukt
  return (
    <div className="resultattabell">
      <div className="tabellverktoy">
        <Tegnforklaring />
        {harKritiske && (
          <label className="tabellfilter">
            <input type="checkbox" checked={bareKritiske} onChange={(hendelse) => byttFilter(hendelse.target.checked)} />{' '}
            {t.filter.bareKritiske}
          </label>
        )}
      </div>
      {bareKritiske && (
        <p className="filterstatus">
          {t.filter.viser(synlige.length, resultat.deler.length)} ·{' '}
          <button type="button" className="lenkeknapp" onClick={() => byttFilter(false)}>
            {t.filter.visAlle}
          </button>
        </p>
      )}
      {/* Egen rulling i begge retninger. Tabulatorstoppet står i tabellen (rutenettet), ikke på området. */}
      <div className="tabellomrade" role="region" aria-labelledby={overskriftId('resultattabell')} ref={omraade}>
        <table className="resultattabell-tabell" role="grid" onKeyDown={tast} onClick={klikk}>
          <caption>{t.bildetekst(beskrivelse, varenummer, kjoring.horisont)}</caption>
          <thead>
            <tr>
              <td className="tabellhjorne" colSpan={2} />
              {uker.map((uke) => (
                <th
                  key={uke}
                  scope="col"
                  className={[uke === 1 ? 'uke-1' : '', valgt?.uke === uke ? 'uke-valgt' : ''].join(' ').trim() || undefined}
                >
                  <span className="skjult-visuelt">{t.ukeOrd} </span>
                  {uke}
                </th>
              ))}
            </tr>
          </thead>
          {synlige.map((del) => (
            <DelTbody
              key={del.del.varenummer}
              del={del}
              markorer={markorerFor(markorer, del.del.varenummer)}
              uker={uker}
              valgtRad={valgt?.varenummer === del.del.varenummer ? valgt.rad : null}
              valgtUke={valgt?.varenummer === del.del.varenummer ? valgt.uke : null}
              aktivR={plass?.varenummer === del.del.varenummer ? plass.r : null}
              aktivK={plass?.varenummer === del.del.varenummer ? plass.k : null}
              markert={markert === del.del.varenummer}
              onVelg={velg}
            />
          ))}
        </table>
      </div>
    </div>
  )
}
