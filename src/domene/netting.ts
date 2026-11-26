// Nettingen for én del (Story 2.1, arkitektur AD-7).
//
// Bare denne fila regner disponibel beholdning, fremskynding, nettobehov, planlagt ordremottak,
// forventet lagerbeholdning og planlagt ordrefrigivelse. Beregningen nivå for nivå (beregn.ts),
// eksepsjonene (eksepsjoner.ts) og senere kapasiteten bruker den samme funksjonen.
//
// Reglene per uke t = 1..H (PRD FR-6–FR-8). I planleggingen ga reglene 0 avvik mot alle delene i
// fasit 01–05. Enhetstestene bruker tall fra fasit 01 og 04. Fasittestene som leser alle
// testeksemplene fra Excel, kommer med beregningen nivå for nivå (Story 2.2).
// 1. Beholdning forrige uke = lagerbeholdningen for t = 1, ellers forventet lagerbeholdning(t−1)
//    pluss fremskyndede mottak som ikke er kommet ennå.
// 2. Planlagte mottak(t) = mottakene i uke t som ikke alt er fremskyndet til en tidligere uke.
// 3. Disponibel = beholdning + planlagte mottak(t) − bruttobehov(t). Nettobehov = maks(0, SS − disponibel).
// 4. Så lenge nettobehovet er > 0, flyttes alle mottakene i første senere uke som har mottak igjen,
//    til uke t, og nettobehovet regnes på nytt (FR-6). Mottak i samme uke legges sammen i
//    beregningen (AD-4), så hele uken flyttes samlet, men hver linje står som egen post.
// 5. Planlagt ordremottak = nettobehov (lot-for-lot, FR-7).
// 6. Forventet lagerbeholdning = disponibel + ordremottak − fremskyndede mottak som ikke er kommet (FR-7).
// 7. Frigivelsen står i uke t − L. Er t − L < 1, legges den i uke 1 og er forfalt (FR-8).
//
// Raden Planlagte mottak i resultattabellen viser alle mottakene i uken de er lagt inn, også de
// som er fremskyndet (FR-6). Funksjonen er ren: den endrer ikke inndataene og gir samme svar for
// samme inndata.

import type { PlanlagtMottak, Utregning } from './typer.ts'

/**
 * Det nettingen trenger for én del. Den som kaller, sender bare mottakene for denne delen.
 * Nettingen kjenner ikke varenummer eller stykklistestrukturen.
 *
 * Forutsetter kontrollerte data (FR-3, Story 1.8 og 1.9): lagerbeholdning, SS og bruttobehov er
 * heltall ≥ 0, ledetiden er et heltall ≥ 0, og mottakene har heltallsuke og antall ≥ 1. Nettingen
 * kontrollerer ikke dette selv. Andre verdier gir et udefinert svar.
 */
export type NettingInndata = {
  lagerbeholdning: number
  sikkerhetslager: number
  ledetid: number
  /** Bruttobehov per uke. Lengden er horisonten H. */
  bruttobehov: readonly number[]
  /** Planlagte mottak som enkeltlinjer (AD-4). Linjer utenfor uke 1..H regnes ikke med. */
  planlagteMottak: readonly PlanlagtMottak[]
}

/**
 * Innstillingene nettingen regner med (AD-7). Senere innstillinger (produksjonskapasitet FR-31,
 * fast partistørrelse FR-25) blir nye felt, der standardverdien gir dagens oppførsel.
 */
export type Nettinginnstillinger = {
  /** Om planlagte mottak kan fremskyndes (FR-6). Av når «Kanseller mottak» kontrolleres (FR-29). */
  fremskynding: boolean
}

/** Standardinnstillingene gir bestillingsplanen (AD-7). */
export const STANDARDINNSTILLINGER: Readonly<Nettinginnstillinger> = Object.freeze({ fremskynding: true })

/** Ett fremskyndet mottak, med uken det er lagt inn i (FR-6). */
export type FremskyndetMottak = Utregning['fremskyndedeMottak'][number]

/**
 * Tallene for én uke. Samme felt som `Utregning`, unntatt bruttobehovet fordelt på overordnede deler
 * og prognostiserte behov, som beregningen nivå for nivå legger til (Story 2.2).
 */
export type NettingUke = Omit<Utregning, 'bruttobehovFra' | 'prognostiserteBehov'> & {
  planlagtOrdremottak: number
  forventetLagerbeholdning: number
}

/** Svaret fra nettingen. Alle serier har lengde H. */
export type Nettingsvar = {
  /** Raden Planlagte mottak: alle mottakene i uken de er lagt inn, også de som er fremskyndet. */
  planlagteMottak: number[]
  forventetLagerbeholdning: number[]
  nettobehov: number[]
  planlagteOrdremottak: number[]
  planlagteOrdrefrigivelser: number[]
  /** Summen av forfalt mengde i alle ukene. Den ligger i frigivelsen i uke 1. 0 når ingenting er forfalt. */
  forfaltMengde: number
  /** Én per uke, lengde H. */
  uker: NettingUke[]
}

/** Regner nettingen for én del uke for uke (FR-6–FR-8). */
export function beregnNetting(
  inndata: NettingInndata,
  innstillinger: Partial<Nettinginnstillinger> = {},
): Nettingsvar {
  // Felt for felt, så et felt som er satt til undefined, gir standardverdien og ikke av.
  const fremskynding = innstillinger.fremskynding ?? STANDARDINNSTILLINGER.fremskynding
  const { lagerbeholdning, sikkerhetslager, ledetid, bruttobehov } = inndata
  const horisont = bruttobehov.length

  // Mottakene som ikke er regnet med ennå, per uke, i rekkefølgen de kom inn.
  const ikkeRegnet = new Map<number, FremskyndetMottak[]>()
  const visteMottak = new Array<number>(horisont).fill(0)
  for (const mottak of inndata.planlagteMottak) {
    if (!Number.isInteger(mottak.uke) || mottak.uke < 1 || mottak.uke > horisont) continue
    visteMottak[mottak.uke - 1] += mottak.antall
    const liste = ikkeRegnet.get(mottak.uke) ?? []
    liste.push({ mottaksuke: mottak.uke, antall: mottak.antall, excelRad: mottak.excelRad })
    ikkeRegnet.set(mottak.uke, liste)
  }

  const alleFremskyndede: FremskyndetMottak[] = []
  const planlagteOrdrefrigivelser = new Array<number>(horisont).fill(0)
  const uker: NettingUke[] = []
  let beholdning = lagerbeholdning
  let forfaltMengde = 0

  for (let uke = 1; uke <= horisont; uke++) {
    // FR-6: mottak som alt er fremskyndet, er fjernet fra uken sin og telles ikke igjen.
    const planlagteMottak = sum(ikkeRegnet.get(uke) ?? [])
    ikkeRegnet.delete(uke)

    const disponibelForFremskynding = beholdning + planlagteMottak - bruttobehov[uke - 1]
    let disponibel = disponibelForFremskynding
    let nettobehov = Math.max(0, sikkerhetslager - disponibel)

    // FR-6: fremskynd hele senere uker, én om gangen, til nettobehovet er dekket.
    const fremskyndedeMottak: FremskyndetMottak[] = []
    for (let senere = uke + 1; fremskynding && nettobehov > 0 && senere <= horisont; senere++) {
      const liste = ikkeRegnet.get(senere)
      if (liste === undefined) continue
      ikkeRegnet.delete(senere)
      fremskyndedeMottak.push(...liste)
      alleFremskyndede.push(...liste)
      disponibel += sum(liste)
      nettobehov = Math.max(0, sikkerhetslager - disponibel)
    }

    // FR-7: lot-for-lot.
    const planlagtOrdremottak = nettobehov
    const fremskyndetIkkeKommet = sum(alleFremskyndede.filter((m) => m.mottaksuke > uke))
    const forventetLagerbeholdning = disponibel + planlagtOrdremottak - fremskyndetIkkeKommet

    // FR-8: frigivelse i uke t − L, eller i uke 1 som forfalt.
    let forfaltIUken = 0
    if (planlagtOrdremottak > 0) {
      const frigivelsesuke = uke - ledetid
      if (frigivelsesuke >= 1) {
        planlagteOrdrefrigivelser[frigivelsesuke - 1] += planlagtOrdremottak
      } else {
        planlagteOrdrefrigivelser[0] += planlagtOrdremottak
        forfaltIUken = planlagtOrdremottak
      }
    }
    forfaltMengde += forfaltIUken

    uker.push({
      uke,
      beholdningForrigeUke: beholdning,
      planlagteMottak,
      bruttobehov: bruttobehov[uke - 1],
      disponibelForFremskynding,
      disponibelEtterFremskynding: disponibel,
      sikkerhetslager,
      nettobehov,
      fremskyndedeMottak,
      fremskyndetIkkeKommet,
      forfaltMengde: forfaltIUken,
      planlagtOrdremottak,
      forventetLagerbeholdning,
    })

    // Beholdningen neste uke regner med de fremskyndede mottakene som ikke er kommet (FR-6).
    beholdning = forventetLagerbeholdning + fremskyndetIkkeKommet
  }

  return {
    planlagteMottak: visteMottak,
    forventetLagerbeholdning: uker.map((u) => u.forventetLagerbeholdning),
    nettobehov: uker.map((u) => u.nettobehov),
    planlagteOrdremottak: uker.map((u) => u.planlagtOrdremottak),
    planlagteOrdrefrigivelser,
    forfaltMengde,
    uker,
  }
}

function sum(mottak: readonly FremskyndetMottak[]): number {
  return mottak.reduce((s, m) => s + m.antall, 0)
}
