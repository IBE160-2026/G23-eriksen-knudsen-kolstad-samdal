// Stykklistestrukturen (Story 1.7, arkitektur AD-6).
//
// Bare denne fila bygger `Struktur` fra stykklisteradene. Valideringen, beregningen, eksepsjonene
// og kapasiteten bruker resultatet og leser aldri radene direkte.
//
// Reglene (PRD FR-3, FR-5, FR-9, FR-28, FR-31):
// - Overordnet del er nærmeste rad over med ett nivå høyere. Like varenumre er slått sammen til én del.
// - Står en del flere steder, teller hvert sted for delen selv (200-012 to ganger under ferdigproduktet
//   gir antall 2 til den overordnede). Underdelene teller derimot én gang, enten de står likt under
//   hver forekomst eller bare under én (FR-3, FR-28).
// - Lagerbeholdning, sikkerhetslager og ledetid hentes fra første rad med varenummeret (FR-28).

import { NIVAATALL } from './celler.ts'
import type { Forekomst, Struktur, StrukturDel, Stykklisterad } from './typer.ts'

/** Underdelene til én del, slått sammen over forekomstene (hver underdel én gang). */
type Kant = { underdel: string; antall: number }

type Beregnet = {
  lavnivaakode: number
  ledetidFraFerdigproduktet: number
  stiForLedetid: string[]
  antallPerFerdigprodukt: number
}

/**
 * Bygger strukturen fra kontrollerte stykklisterader i stykklisterekkefølge.
 * Kaster ikke unntak. Er radene ikke kontrollert (valideringen har ikke kjørt), er svaret ikke definert,
 * men funksjonen stopper alltid.
 */
export function byggStruktur(rader: readonly Stykklisterad[]): Struktur {
  const { deler: delerMap, forekomster } = samleDelerOgForekomster(rader)

  // Underdelene per del: summert innenfor en forekomst, og hver underdel én gang over forekomstene.
  const kanter = new Map<string, Kant[]>()
  for (const [varenummer, liste] of forekomster) kanter.set(varenummer, slaaSammenUnderdeler(liste))

  // Overordnede deler med antall per enhet, i stykklisterekkefølge for den overordnede delen (FR-5).
  const overordnede = new Map<string, { varenummer: string; antall: number }[]>()
  for (const varenummer of delerMap.keys()) overordnede.set(varenummer, [])
  for (const [overordnet, underdeler] of kanter) {
    for (const { underdel, antall } of underdeler) {
      overordnede.get(underdel)?.push({ varenummer: overordnet, antall })
    }
  }

  const beregnet = new Map<string, Beregnet>()
  const regn = (varenummer: string, paaStien: Set<string>): Beregnet => {
    const ferdig = beregnet.get(varenummer)
    if (ferdig) return ferdig
    const del = delerMap.get(varenummer)!
    paaStien.add(varenummer)

    let resultat: Beregnet | null = null
    for (const { varenummer: over, antall } of overordnede.get(varenummer) ?? []) {
      // En kant tilbake til en del på stien er en sløyfe. Den hoppes over, så beregningen alltid stopper.
      if (paaStien.has(over)) continue
      const fra = regn(over, paaStien)
      if (!resultat) {
        resultat = {
          lavnivaakode: fra.lavnivaakode + 1,
          ledetidFraFerdigproduktet: fra.ledetidFraFerdigproduktet + del.ledetid,
          stiForLedetid: [...fra.stiForLedetid, varenummer],
          antallPerFerdigprodukt: antall * fra.antallPerFerdigprodukt,
        }
        continue
      }
      resultat.lavnivaakode = Math.max(resultat.lavnivaakode, fra.lavnivaakode + 1)
      resultat.antallPerFerdigprodukt += antall * fra.antallPerFerdigprodukt
      // Lengste sti (FR-9). Ved lik ledetid beholdes den første stien.
      if (fra.ledetidFraFerdigproduktet + del.ledetid > resultat.ledetidFraFerdigproduktet) {
        resultat.ledetidFraFerdigproduktet = fra.ledetidFraFerdigproduktet + del.ledetid
        resultat.stiForLedetid = [...fra.stiForLedetid, varenummer]
      }
    }

    // Ferdigproduktet (og en del uten overordnet del) står øverst: ett stykke per ferdigprodukt (FR-31).
    resultat ??= {
      lavnivaakode: 0,
      ledetidFraFerdigproduktet: del.ledetid,
      stiForLedetid: [varenummer],
      antallPerFerdigprodukt: 1,
    }
    paaStien.delete(varenummer)
    beregnet.set(varenummer, resultat)
    return resultat
  }

  const deler: StrukturDel[] = []
  for (const [varenummer, del] of delerMap) {
    const b = regn(varenummer, new Set())
    deler.push({
      ...del,
      overordnede: overordnede.get(varenummer) ?? [],
      forekomster: forekomster.get(varenummer) ?? [],
      ...b,
    })
  }

  // Delene beregnes etter stigende lavnivåkode, og ved likhet i stykklisterekkefølge (AD-6).
  // Array.prototype.sort er stabil, så stykklisterekkefølgen bevares ved likhet.
  const beregningsrekkefolge = deler
    .map((d) => d.varenummer)
    .sort((a, b) => beregnet.get(a)!.lavnivaakode - beregnet.get(b)!.lavnivaakode)

  return { deler, beregningsrekkefolge }
}

type DelUtenBeregning = Omit<
  StrukturDel,
  'overordnede' | 'forekomster' | 'lavnivaakode' | 'ledetidFraFerdigproduktet' | 'stiForLedetid' | 'antallPerFerdigprodukt'
>

/** Går gjennom radene én gang: unike deler og forekomstene med underdelene rett under. */
function samleDelerOgForekomster(rader: readonly Stykklisterad[]) {
  const deler = new Map<string, DelUtenBeregning>()
  const forekomster = new Map<string, Forekomst[]>()
  // Nærmeste forekomst over på hvert nivå. Overordnet del er nærmeste rad over med ett nivå høyere.
  const sisteForekomst: (Forekomst | undefined)[] = [undefined, undefined, undefined]
  const sisteVarenummer: (string | undefined)[] = [undefined, undefined, undefined]

  for (const rad of rader) {
    const nivaa = NIVAATALL[rad.nivaa]
    const overordnetForekomst = nivaa > 0 ? sisteForekomst[nivaa - 1] : undefined
    const overordnetVarenummer = nivaa > 0 ? sisteVarenummer[nivaa - 1] : undefined

    const forekomst: Forekomst = {
      excelRad: rad.excelRad,
      nivaa: rad.nivaa,
      overordnet: overordnetVarenummer ?? null,
      antall: rad.antall,
      underdeler: [],
    }
    overordnetForekomst?.underdeler.push({
      varenummer: rad.varenummer,
      antall: rad.antall ?? 0,
      excelRad: rad.excelRad,
    })
    sisteForekomst[nivaa] = forekomst
    sisteVarenummer[nivaa] = rad.varenummer
    // Det som står under en ny rad på et høyere nivå, hører ikke til en tidligere rad.
    for (let i = nivaa + 1; i < sisteForekomst.length; i++) {
      sisteForekomst[i] = undefined
      sisteVarenummer[i] = undefined
    }

    const liste = forekomster.get(rad.varenummer)
    if (liste) liste.push(forekomst)
    else forekomster.set(rad.varenummer, [forekomst])

    // Første rad med varenummeret gir beskrivelse, type, lager, SS og ledetid (FR-28).
    if (!deler.has(rad.varenummer)) {
      deler.set(rad.varenummer, {
        varenummer: rad.varenummer,
        beskrivelse: rad.beskrivelse,
        type: rad.type,
        nivaa: rad.nivaa,
        lagerbeholdning: rad.lagerbeholdning ?? 0,
        sikkerhetslager: rad.sikkerhetslager ?? 0,
        ledetid: rad.ledetid ?? 0,
      })
    }
  }
  return { deler, forekomster }
}

/**
 * Slår sammen underdelene til en del over alle forekomstene (FR-3, FR-28).
 * - Innenfor én forekomst legges antallet sammen, så en underdel som står to ganger rett under samme
 *   overordnede del, teller to ganger (fasit 04: 200-012 under 100-003).
 * - Mellom forekomster teller hver underdel én gang, med antallet fra første forekomst som har den.
 *   Står underdelene likt under hver forekomst, eller bare under én, er det ingen forskjell (V-G04).
 */
function slaaSammenUnderdeler(forekomster: readonly Forekomst[]): Kant[] {
  const resultat = new Map<string, number>()
  for (const forekomst of forekomster) {
    const iDenne = new Map<string, number>()
    for (const { varenummer, antall } of forekomst.underdeler) {
      iDenne.set(varenummer, (iDenne.get(varenummer) ?? 0) + antall)
    }
    for (const [varenummer, antall] of iDenne) {
      if (!resultat.has(varenummer)) resultat.set(varenummer, antall)
    }
  }
  return [...resultat].map(([underdel, antall]) => ({ underdel, antall }))
}
