// Seksjonen Bestillingsforslag (Story 2.11, FR-17, UX-DR18, UX-DR19, DESIGN.md › Components › Bestillingsforslag).
// Alle forslagene i én liste med fast høyde og egen rulling, sortert på frigivelsesuke og så stykklisterekkefølge (det er
// rekkefølgen i `Resultat`). Ukefilteret over listen viser én uke om gangen og endrer verken tallboksene eller `Resultat`.
// «! 50 forfalt» gjør det samme som linjen for delen i Kritiske deler: ruller tabellen til delen og flytter fokus til
// cellen med delens tidligste eksepsjon. Et klikk andre steder på raden gjør ingenting.

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Eksepsjon, Kjoring, Resultat } from '../../domene/typer.ts'
import { formaterTall, resultat as tekster } from '../../tekster/nb.ts'
import { antallPerUke, filtrerUke } from './forslag-modell.ts'
import { Markor } from './Markor.tsx'

type Props = {
  kjoring: Kjoring
  resultat: Resultat
  /** Ruller tabellen til delen og flytter fokus til cellen med den tidligste eksepsjonen (Story 2.10). */
  onHopp: (varenummer: string) => void
}

/** Antall rader som får plass uten rulling. Over det ruller listen i sitt eget område. */
const MAKS_SYNLIGE_RADER = 10

export function Bestillingsforslag({ kjoring, resultat, onHopp }: Props) {
  const t = tekster.bestillingsforslag
  const forslag = resultat.bestillingsforslag
  const [valgtUke, setValgtUke] = useState<number | null>(null)
  const omraade = useRef<HTMLDivElement>(null)

  const perUke = useMemo(() => antallPerUke(forslag, kjoring.horisont), [forslag, kjoring.horisont])
  const synlige = useMemo(() => filtrerUke(forslag, valgtUke), [forslag, valgtUke])
  // Eksepsjonene per del, for symbolet ved beskrivelsen. En kritisk del har minst én.
  const eksepsjonerPerDel = useMemo(() => {
    const per = new Map<string, Eksepsjon[]>()
    for (const e of resultat.eksepsjoner) per.set(e.varenummer, [...(per.get(e.varenummer) ?? []), e])
    return per
  }, [resultat.eksepsjoner])

  // Høyden er fast og regnes ut av alle forslagene, ikke de som vises, så siden ikke hopper når Kari bytter uke.
  useLayoutEffect(() => {
    omraade.current?.style.setProperty('--antall-rader', String(Math.min(forslag.length, MAKS_SYNLIGE_RADER)))
  }, [forslag.length])

  if (forslag.length === 0) {
    return (
      <div className="informasjonsboks">
        <p>{t.ingen}</p>
      </div>
    )
  }

  const uker = Array.from({ length: kjoring.horisont }, (_, i) => i + 1)
  return (
    <div className="bestillingsforslag">
      <p className="forslag-hjelp">{t.hjelp}</p>

      <div className="ukefilter" role="group" aria-label={t.filterNavn}>
        <button
          type="button"
          className="ukechip"
          aria-pressed={valgtUke === null}
          aria-label={t.ukeknapp(t.alleUker, forslag.length)}
          onClick={() => setValgtUke(null)}
        >
          {t.alleUker} <span className="ukechip-antall">{formaterTall(forslag.length)}</span>
        </button>
        {uker.map((uke) => (
          <button
            key={uke}
            type="button"
            className="ukechip"
            aria-pressed={valgtUke === uke}
            aria-label={t.ukeknapp(t.uke(uke), perUke[uke - 1] ?? 0)}
            onClick={() => setValgtUke(uke)}
          >
            {t.uke(uke)} <span className="ukechip-antall">{formaterTall(perUke[uke - 1] ?? 0)}</span>
          </button>
        ))}
      </div>

      {/* Plassen er reservert hele tiden, så innholdet under ikke flytter seg når linjen kommer og går. */}
      <p className="filterstatus filterstatus-plass" role="status">
        {valgtUke !== null && (
          <>
            {synlige.length === 0 ? t.ingenIUke(valgtUke) : t.viser(synlige.length, forslag.length)} ·{' '}
            <button type="button" className="lenkeknapp" onClick={() => setValgtUke(null)}>
              {t.visAlleUker}
            </button>
          </>
        )}
      </p>

      {synlige.length > 0 && (
        // Egen rulling. Området er et tabulatorstopp, så tastaturet kan rulle det også når ingen rad har en knapp.
        <div className="forslagomrade" role="region" aria-label={t.listeNavn} tabIndex={0} ref={omraade}>
          <table className="forslagtabell">
            <thead>
              <tr>
                <th scope="col">{t.kolonner.uke}</th>
                <th scope="col">{t.kolonner.varenummer}</th>
                <th scope="col">{t.kolonner.beskrivelse}</th>
                <th scope="col" className="forslag-tall">
                  {t.kolonner.mengde}
                </th>
                <th scope="col">{t.kolonner.art}</th>
                <th scope="col">{t.kolonner.forfalt}</th>
              </tr>
            </thead>
            <tbody>
              {synlige.map((f, indeks) => (
                <tr key={`${f.varenummer}-${f.frigivelsesuke}-${indeks}`} className={f.frigivelsesuke === 1 ? 'forslag-uke1' : undefined}>
                  <td>{f.frigivelsesuke}</td>
                  <td className="forslag-varenummer">{f.varenummer}</td>
                  <td>
                    <span className="forslag-beskrivelse">
                      {f.beskrivelse}
                      {eksepsjonerPerDel.get(f.varenummer)?.map((e) => <Markor key={`${e.kode}-${e.uke}`} eksepsjon={e} />)}
                    </span>
                  </td>
                  <td className="forslag-tall forslag-mengde">{formaterTall(f.mengde)}</td>
                  <td>
                    <span className="art-merke">{t.art[f.art]}</span>
                  </td>
                  <td>
                    {f.forfaltMengde > 0 && (
                      <button
                        type="button"
                        className="forfalt-knapp"
                        aria-label={t.forfaltNavn(f.forfaltMengde, f.varenummer, f.beskrivelse)}
                        onClick={() => onHopp(f.varenummer)}
                      >
                        <span aria-hidden="true">! </span>
                        {t.forfalt(f.forfaltMengde)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
