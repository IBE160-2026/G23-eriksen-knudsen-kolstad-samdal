// Resultattabellen (Story 2.7, FR-14–FR-16, AD-14, UX-DR21, UX-DR23, UX-DR24).
// Én <table> med seks rader per del og H ukekolonner, eksepsjonsmarkører i riktig celle, tegnforklaring,
// valgt celle og filteret «Vis bare kritiske deler». Tastaturstyringen (Story 2.9) og forklaringen av en celle
// (Epic 3) kommer senere: peking gjør ingenting annet enn en liten endring i ramme eller bakgrunn (FR-18).

import { useCallback, useMemo, useState } from 'react'
import type { Kjoring, Resultat } from '../../domene/typer.ts'
import { resultat as tekster } from '../../tekster/nb.ts'
import { DelTbody } from './DelTbody.tsx'
import { EKSEPSJONSVISNING, KODER } from './eksepsjonsvisning.ts'
import { grupperMarkorer, markorerFor, synligeDeler, valgEtterFilter, type ValgtCelle } from './tabell-modell.ts'

/** `id` på bildeteksten, som gir tabellområdet navn. */
const BILDETEKST_ID = 'resultattabell-bildetekst'

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

export function Resultattabell({ kjoring, resultat }: { kjoring: Kjoring; resultat: Resultat }) {
  const t = tekster.tabell
  const [bareKritiske, setBareKritiske] = useState(false)
  const [valgt, setValgt] = useState<ValgtCelle | null>(null)

  const markorer = useMemo(() => grupperMarkorer(resultat.eksepsjoner), [resultat.eksepsjoner])
  const uker = useMemo(() => Array.from({ length: kjoring.horisont }, (_, i) => i + 1), [kjoring.horisont])
  const synlige = useMemo(() => synligeDeler(resultat, bareKritiske), [resultat, bareKritiske])
  const harKritiske = resultat.kritiskeDeler.length > 0

  const velg = useCallback((celle: ValgtCelle) => setValgt(celle), [])

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
      {/* Egen rulling i begge retninger. tabindex="0" lar tastaturet rulle området til rutenettstyringen (Story 2.9) tar over. */}
      {/* Regionen har navn etter bildeteksten og ikke etter overskriften, så skjermleseren ikke finner to landemerker som heter «Resultattabell». */}
      <div className="tabellomrade" role="region" aria-labelledby={BILDETEKST_ID} tabIndex={0}>
        <table className="resultattabell-tabell">
          <caption id={BILDETEKST_ID}>{t.bildetekst(beskrivelse, varenummer, kjoring.horisont)}</caption>
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
              onVelg={velg}
            />
          ))}
        </table>
      </div>
    </div>
  )
}
