// Én del i resultattabellen: en <tbody> med de seks radene fra FR-14 og delens felt (Story 2.7, AD-14, UX-DR21).
// Memoisert, så bare delene som endres tegnes på nytt når Kari velger en celle, flytter fokus eller bruker filteret.
// Klikk på en celle fanges på <tbody> (hendelsesdelegering), så ikke hver celle har sin egen behandler.
//
// Rutenettet (Story 2.9, UX-DR22): hver celle Kari kan flytte fokus til, har `data-r` (rad i delen) og `data-k`
// (kolonne: 0 delens felt, 1 radnavn, 2 og utover ukene). Roving tabindex: bare cellen som er aktiv i denne delen,
// har `tabindex="0"`, og bare den har et navn for skjermleseren. Alle de andre er uten `tabindex`, så 1000 rader
// ikke får titusener av ekstra attributter. Fokus flyttes av Resultattabell.

import { memo, type MouseEvent } from 'react'
import type { DelResultat, Eksepsjon } from '../../domene/typer.ts'
import { formaterTall, resultat as tekster } from '../../tekster/nb.ts'
import { EKSEPSJONSVISNING } from './eksepsjonsvisning.ts'
import { Markor } from './Markor.tsx'
import {
  celleNokkel,
  innrykkNivaa,
  KOLONNE_FELT,
  KOLONNE_RADNAVN,
  RADER,
  type DelensMarkorer,
  type RadId,
  type ValgtCelle,
} from './tabell-modell.ts'

type Props = {
  del: DelResultat
  markorer: DelensMarkorer
  uker: readonly number[]
  valgtRad: RadId | null
  valgtUke: number | null
  /** Cellen i denne delen som har tabulatorstoppet, eller null når den står i en annen del. */
  aktivR: number | null
  aktivK: number | null
  onVelg: (celle: ValgtCelle) => void
}

function tallKlasse(verdi: number): string {
  if (verdi === 0) return 'tall tall-null'
  return verdi < 0 ? 'tall tall-negativ' : 'tall'
}

function navnPaEksepsjoner(eksepsjoner: readonly Eksepsjon[]): string[] {
  return eksepsjoner.map((e) => tekster.tabell.markornavn(tekster.tabell.eksepsjonsnavn[e.kode], e.uke))
}

type FeltProps = { del: DelResultat; markorer: DelensMarkorer; aktiv: boolean }

function Delfelt({ del, markorer, aktiv }: FeltProps) {
  const { varenummer, beskrivelse, type, nivaa, lagerbeholdning, sikkerhetslager, ledetid, overordnede } = del.del
  const t = tekster.tabell
  const lager = t.felt.lager(lagerbeholdning)
  const ss = t.felt.sikkerhetslager(sikkerhetslager)
  const l = t.felt.ledetid(ledetid)
  const klasse = markorer.ved[0] ? ` ${EKSEPSJONSVISNING[markorer.ved[0].kode].klasse}-bakgrunn` : ''
  return (
    <th
      scope="rowgroup"
      rowSpan={RADER.length}
      className={`delfelt${klasse}`}
      data-r={0}
      data-k={KOLONNE_FELT}
      tabIndex={aktiv ? 0 : undefined}
      aria-label={
        aktiv ? t.feltNavn(varenummer, beskrivelse, t.delstyper[type], del.kritisk, navnPaEksepsjoner(markorer.ved)) : undefined
      }
    >
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

export const DelTbody = memo(function DelTbody({ del, markorer, uker, valgtRad, valgtUke, aktivR, aktivK, onVelg }: Props) {
  const { varenummer, beskrivelse } = del.del

  function klikk(hendelse: MouseEvent<HTMLTableSectionElement>) {
    const celle = (hendelse.target as Element).closest('td[data-rad]')
    if (!(celle instanceof HTMLElement)) return
    onVelg({ varenummer, rad: celle.dataset.rad as RadId, uke: Number(celle.dataset.uke) })
  }

  return (
    <tbody className={del.kritisk ? 'del del-kritisk' : 'del'} data-del={varenummer} onClick={klikk}>
      {RADER.map((rad, indeks) => {
        const serie = del[rad]
        const radnavn = tekster.tabell.rader[rad]
        const radnavnAktiv = aktivK === KOLONNE_RADNAVN && aktivR === indeks
        return (
          <tr key={rad}>
            {indeks === 0 && <Delfelt del={del} markorer={markorer} aktiv={aktivK === KOLONNE_FELT} />}
            <th
              scope="row"
              className={valgtRad === rad ? 'radnavn radnavn-valgt' : 'radnavn'}
              data-r={indeks}
              data-k={KOLONNE_RADNAVN}
              tabIndex={radnavnAktiv ? 0 : undefined}
              aria-label={radnavnAktiv ? tekster.tabell.radnavnNavn(varenummer, beskrivelse, radnavn) : undefined}
            >
              {radnavn}
            </th>
            {uker.map((uke) => {
              const eksepsjoner = markorer.celler.get(celleNokkel(rad, uke))
              const valgt = valgtRad === rad && valgtUke === uke
              const aktiv = aktivK === uke + 1 && aktivR === indeks
              const klasser = ['celle']
              if (uke === 1) klasser.push('celle-uke1')
              if (rad === 'planlagteOrdrefrigivelser') klasser.push('celle-sterk')
              if (eksepsjoner?.[0]) klasser.push(`${EKSEPSJONSVISNING[eksepsjoner[0].kode].klasse}-bakgrunn`)
              if (valgt) klasser.push('celle-valgt')
              const verdi = serie[uke - 1] ?? 0
              return (
                <td
                  key={uke}
                  className={klasser.join(' ')}
                  data-rad={rad}
                  data-uke={uke}
                  data-r={indeks}
                  data-k={uke + 1}
                  tabIndex={aktiv ? 0 : undefined}
                  aria-label={
                    aktiv
                      ? tekster.tabell.celleNavn(varenummer, beskrivelse, radnavn, uke, verdi, navnPaEksepsjoner(eksepsjoner ?? []))
                      : undefined
                  }
                >
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
