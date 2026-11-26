// Én del i resultattabellen: en <tbody> med de seks radene fra FR-14 og delens felt (Story 2.7, AD-14, UX-DR21).
// Memoisert, så bare delene som endres tegnes på nytt når Kari velger en celle eller bruker filteret.
// Klikk på en celle fanges på <tbody> (hendelsesdelegering), så ikke hver celle har sin egen behandler.

import { memo, type MouseEvent } from 'react'
import type { DelResultat } from '../../domene/typer.ts'
import { formaterTall, resultat as tekster } from '../../tekster/nb.ts'
import { EKSEPSJONSVISNING } from './eksepsjonsvisning.ts'
import { Markor } from './Markor.tsx'
import { celleNokkel, innrykkNivaa, RADER, type DelensMarkorer, type RadId, type ValgtCelle } from './tabell-modell.ts'

type Props = {
  del: DelResultat
  markorer: DelensMarkorer
  uker: readonly number[]
  valgtRad: RadId | null
  valgtUke: number | null
  onVelg: (celle: ValgtCelle) => void
}

function tallKlasse(verdi: number): string {
  if (verdi === 0) return 'tall tall-null'
  return verdi < 0 ? 'tall tall-negativ' : 'tall'
}

function Delfelt({ del, markorer }: { del: DelResultat; markorer: DelensMarkorer }) {
  const { varenummer, beskrivelse, type, nivaa, lagerbeholdning, sikkerhetslager, ledetid, overordnede } = del.del
  const t = tekster.tabell
  const lager = t.felt.lager(lagerbeholdning)
  const ss = t.felt.sikkerhetslager(sikkerhetslager)
  const l = t.felt.ledetid(ledetid)
  const klasse = markorer.ved[0] ? ` ${EKSEPSJONSVISNING[markorer.ved[0].kode].klasse}-bakgrunn` : ''
  return (
    <th scope="rowgroup" rowSpan={RADER.length} className={`delfelt${klasse}`}>
      <div className={`delfelt-innhold innrykk-${innrykkNivaa(nivaa)}`}>
        <div className="delfelt-topp">
          <span className="nivaamerke">
            <span className="skjult-visuelt">Nivå </span>
            {nivaa}
          </span>
          <span className="delfelt-varenummer">{varenummer}</span>
          {markorer.ved.map((eksepsjon) => (
            <Markor key={eksepsjon.kode} eksepsjon={eksepsjon} />
          ))}
        </div>
        <div className="delfelt-beskrivelse">{beskrivelse}</div>
        {del.kritisk && (
          <div className="kritisk-flagg">
            <span aria-hidden="true">●</span> {t.kritiskDel}
          </div>
        )}
        <div className="delfelt-meta">{t.delstyper[type]}</div>
        <div className="delfelt-meta">
          <span aria-hidden="true">
            {lager.kort} · {ss.kort} · {l.kort}
          </span>
          <span className="skjult-visuelt">
            {lager.lang}, {ss.lang}, {l.lang}
          </span>
        </div>
        {overordnede.map((o) => (
          <div key={o.varenummer} className="delfelt-meta">
            {t.felt.antall(o.antall, o.varenummer)}
          </div>
        ))}
      </div>
    </th>
  )
}

export const DelTbody = memo(function DelTbody({ del, markorer, uker, valgtRad, valgtUke, onVelg }: Props) {
  const varenummer = del.del.varenummer

  function klikk(hendelse: MouseEvent<HTMLTableSectionElement>) {
    const celle = (hendelse.target as Element).closest('td[data-rad]')
    if (!(celle instanceof HTMLElement)) return
    onVelg({ varenummer, rad: celle.dataset.rad as RadId, uke: Number(celle.dataset.uke) })
  }

  return (
    <tbody className={del.kritisk ? 'del del-kritisk' : 'del'} data-del={varenummer} onClick={klikk}>
      {RADER.map((rad, indeks) => {
        const serie = del[rad]
        return (
          <tr key={rad}>
            {indeks === 0 && <Delfelt del={del} markorer={markorer} />}
            <th scope="row" className={valgtRad === rad ? 'radnavn radnavn-valgt' : 'radnavn'}>
              {tekster.tabell.rader[rad]}
            </th>
            {uker.map((uke) => {
              const eksepsjoner = markorer.celler.get(celleNokkel(rad, uke))
              const valgt = valgtRad === rad && valgtUke === uke
              const klasser = ['celle']
              if (uke === 1) klasser.push('celle-uke1')
              if (rad === 'planlagteOrdrefrigivelser') klasser.push('celle-sterk')
              if (eksepsjoner?.[0]) klasser.push(`${EKSEPSJONSVISNING[eksepsjoner[0].kode].klasse}-bakgrunn`)
              if (valgt) klasser.push('celle-valgt')
              const verdi = serie[uke - 1] ?? 0
              return (
                <td key={uke} className={klasser.join(' ')} data-rad={rad} data-uke={uke}>
                  <span className="celle-innhold">
                    {eksepsjoner?.map((eksepsjon) => <Markor key={eksepsjon.kode} eksepsjon={eksepsjon} />)}
                    <span className={tallKlasse(verdi)}>{formaterTall(verdi)}</span>
                  </span>
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
})
