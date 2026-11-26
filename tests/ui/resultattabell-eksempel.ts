// Eksempeldata til testene av resultattabellen (Story 2.7): ni deler som i testeksempel 01, med de fire kritiske delene
// og eksepsjonene fra fasit 01 (EKSEPSJONER_01). Radene for 300-003 Hjul er de ekte tallene fra fasit 01
// (HJUL_RESULTAT). De andre delene har enkle, utfylte tall som bare skal fylle tabellen: de er ikke fasittall.
// Fasittestene mot arket Fasittabell kommer i Story 2.2 (AD-16).

import type { DelResultat, Delstype, Kjoring, Nivaa, Resultat, StrukturDel } from '../../src/domene/typer.ts'
import { EKSEPSJONER_01, HJUL_RESULTAT, RESULTAT_01 } from '../domene/typer-eksempler.ts'

const H = 10

function struktur(
  varenummer: string,
  beskrivelse: string,
  type: Delstype,
  nivaa: Nivaa,
  lager: number,
  ss: number,
  ledetid: number,
  overordnede: StrukturDel['overordnede'],
): StrukturDel {
  return {
    varenummer,
    beskrivelse,
    type,
    nivaa,
    lagerbeholdning: lager,
    sikkerhetslager: ss,
    ledetid,
    overordnede,
    forekomster: [],
    lavnivaakode: nivaa.length - nivaa.replace(/\./g, '').length,
    ledetidFraFerdigproduktet: ledetid,
    stiForLedetid: [],
    antallPerFerdigprodukt: overordnede[0]?.antall ?? 1,
  }
}

const serie = (verdi: number) => Array.from({ length: H }, () => verdi)

function del(del: StrukturDel, kritisk: boolean, rader: Partial<DelResultat> = {}): DelResultat {
  return {
    del,
    bruttobehov: serie(20),
    planlagteMottak: serie(0),
    forventetLagerbeholdning: serie(10),
    nettobehov: serie(0),
    planlagteOrdremottak: serie(0),
    planlagteOrdrefrigivelser: serie(0),
    forfaltMengde: 0,
    utregning: [],
    kritisk,
    ...rader,
  }
}

export const DELER_01: DelResultat[] = [
  del(struktur('100-002', 'Kontorstol Basic', 'FERDIGVARE', '0', 0, 0, 0, []), false),
  del(struktur('300-001', 'Sete', 'PRODUSERES_SELV', '.1', 40, 10, 1, [{ varenummer: '100-002', antall: 1 }]), false),
  del(struktur('300-002', 'Rygg', 'KJOPES_INN', '.1', 60, 0, 1, [{ varenummer: '100-002', antall: 1 }]), false),
  HJUL_RESULTAT,
  del(struktur('300-004', 'Armlene', 'KJOPES_INN', '.1', 90, 20, 1, [{ varenummer: '100-002', antall: 2 }]), true, {
    forventetLagerbeholdning: [20, ...serie(20).slice(1)],
    nettobehov: [10, ...serie(0).slice(1)],
  }),
  del(struktur('300-005', 'Gassfjær', 'KJOPES_INN', '.1', 20, 10, 1, [{ varenummer: '100-002', antall: 1 }]), true, {
    // 0 i uke 3 (mottaket på 100 i uke 4 fremskyndes), og et negativt tall for å prøve minustegnet.
    forventetLagerbeholdning: [20, 10, 0, 80, 60, 40, 20, 0, -5, -25],
    planlagteMottak: [0, 0, 0, 100, 0, 0, 0, 0, 0, 0],
  }),
  del(struktur('300-006', 'Stolfot', 'KJOPES_INN', '.1', 200, 0, 10, [{ varenummer: '100-002', antall: 1 }]), true),
  del(struktur('300-007', 'Skruesett', 'KJOPES_INN', '..2', 500, 0, 1, [{ varenummer: '300-001', antall: 4 }]), false),
  del(struktur('300-008', 'Trekk', 'KJOPES_INN', '..2', 90, 0, 1, [{ varenummer: '300-001', antall: 1 }]), false),
]

export const RESULTAT_TABELL: Resultat = {
  ...RESULTAT_01,
  deler: DELER_01,
  eksepsjoner: EKSEPSJONER_01,
  kritiskeDeler: ['300-003', '300-004', '300-005', '300-006'],
}

export const KJORING_TABELL: Kjoring = {
  valg: 'BESTILLINGSPLAN',
  filnavn: 'testeksempel-01.xlsx',
  tidspunkt: '2026-11-13T07:04:00.000Z',
  ferdigprodukt: { varenummer: '100-002', beskrivelse: 'Kontorstol Basic' },
  horisont: H,
  resultat: RESULTAT_TABELL,
  kapasitet: null,
  sammenligning: null,
  lagring: 'LAGRET',
}
