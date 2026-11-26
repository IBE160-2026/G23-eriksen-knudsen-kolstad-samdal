// Opplasting og Beregn på startsiden gjennom hele appen (Story 1.11, UX-DR4, UX-DR7–UX-DR10, UX-DR12, UX-DR13, NFR-9).
// Kjører mot bygget med den ekte worker-en og CSP-en. Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak.
//
// «Velg fil» testes gjennom knappen: Playwright fanger fildialogen (`filechooser`) og velger filen.
// Dra og slipp testes med en ekte DataTransfer med filen, sendt som `drop` til sonen.

import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const TESTDATA = join(import.meta.dirname, '..', 'testdata')
const TESTEKSEMPEL_01 = join(TESTDATA, 'testeksempel-01.xlsx')
const fil = (navn: string) => join(TESTDATA, 'validering', navn)

const MELDING = {
  IKKE_XLSX: 'Appen tar bare imot Excel-malen (.xlsx).',
  SKADET_FIL: 'Filen kan ikke leses. Den er kanskje skadet. Lagre den på nytt fra Excel og prøv igjen.',
  TOM_FIL: 'Filen er tom. Lagre malen i Excel og last den opp på nytt.',
  IKKE_EXCEL: 'Filen heter .xlsx, men er ikke en Excel-fil. Åpne malen i Excel og lagre den som Excel-arbeidsbok.',
}

const sone = (page: Page) => page.locator('.opplastingssone')
const velgFilKnapp = (page: Page) => page.getByRole('button', { name: 'Velg fil' })
const beregnKnapp = (page: Page) => page.getByRole('button', { name: 'Beregn' })
const sonemelding = (page: Page) => page.locator('.sonemelding')

/** Velger filen gjennom «Velg fil» og fildialogen, slik Kari gjør. */
async function velgFil(page: Page, sti: string) {
  const dialog = page.waitForEvent('filechooser')
  await velgFilKnapp(page).click()
  await (await dialog).setFiles(sti)
}

/** Lager en DataTransfer med filene i siden. */
async function dataMedFiler(page: Page, stier: string[]) {
  const filer = stier.map((sti) => ({ navn: basename(sti), bytes: Array.from(readFileSync(sti)) }))
  return page.evaluateHandle((filer) => {
    const data = new DataTransfer()
    for (const { navn, bytes } of filer) data.items.add(new File([new Uint8Array(bytes)], navn))
    return data
  }, filer)
}

/** Drar filene inn og slipper dem på målet. */
async function slipp(page: Page, mal: Locator, stier: string[]) {
  const dataTransfer = await dataMedFiler(page, stier)
  await mal.dispatchEvent('dragenter', { dataTransfer })
  await mal.dispatchEvent('dragover', { dataTransfer })
  await mal.dispatchEvent('drop', { dataTransfer })
}

/** Teller worker-ene siden lager, og merker vinduet, så en ny sidelasting oppdages. */
async function forbered(page: Page) {
  await page.addInitScript(() => {
    const Ekte = window.Worker
    const w = window as unknown as { __antallWorkere: number }
    w.__antallWorkere = 0
    window.Worker = class extends Ekte {
      constructor(...args: ConstructorParameters<typeof Worker>) {
        super(...args)
        w.__antallWorkere++
      }
    }
  })
  await page.goto('/#/ny-kjoring')
  await page.evaluate(() => ((window as unknown as { __sammeSide: boolean }).__sammeSide = true))
}

const sammeSide = (page: Page) => page.evaluate(() => (window as unknown as { __sammeSide?: boolean }).__sammeSide === true)
const antallWorkere = (page: Page) => page.evaluate(() => (window as unknown as { __antallWorkere: number }).__antallWorkere)

test.describe('gyldig fil', () => {
  test('testeksempel 01 gir Resultat med «Kontorstol Basic (100-002)» og «Horisont: 10 uker» (UX-DR13)', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await expect(sone(page)).toContainText('Valgt fil: testeksempel-01.xlsx')
    await beregnKnapp(page).click()

    await expect(page).toHaveURL(/#\/resultat$/)
    const linje = page.locator('.kjoringslinje')
    await expect(linje).toContainText('Kontorstol Basic (100-002)')
    await expect(linje).toContainText('Horisont: 10 uker')
    await expect(linje).toContainText('testeksempel-01.xlsx')
    await expect(linje).toContainText(/Kjørt \d{2}\.\d{2}\.\d{4} kl\. \d{2}:\d{2}/)
    await expect(linje.getByRole('link', { name: 'Last opp ny fil' })).toBeVisible()
  })

  test('fokus på den skjulte h1, sidetittelen og kunngjøringen etter Beregn (UX-DR4)', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).click()

    const h1 = page.getByRole('heading', { level: 1, name: 'Resultat for Kontorstol Basic' })
    await expect(h1).toBeFocused()
    await expect(h1).toHaveClass(/skjult-visuelt/)
    await expect(page).toHaveTitle('Kontorstol Basic (100-002) – Resultat – COSI - MRP')
    await expect(page.getByRole('status')).toHaveText('Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.')
    await expect(page.getByRole('status')).toHaveCount(1)
  })

  test('Resultat sier at bestillingsplanen ikke er beregnet ennå', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).click()
    const boks = page.getByRole('main').locator('.informasjonsboks')
    await expect(boks).toContainText('Filen er lest og kontrollert, og den har ingen feil.')
    await expect(boks).toContainText('Bestillingsplanen beregnes ikke ennå.')
    await expect(boks).toBeVisible()
  })

  test('statusen viser «Leser filen …» og så «Beregner …» ved Beregn, uten overlegg (UX-DR10)', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await page.evaluate(() => {
      const w = window as unknown as { __statuser: string[] }
      w.__statuser = []
      const status = document.querySelector('.beregn-status')!
      new MutationObserver(() => {
        const tekst = status.textContent ?? ''
        if (tekst && w.__statuser.at(-1) !== tekst) w.__statuser.push(tekst)
      }).observe(status, { childList: true, characterData: true, subtree: true })
    })
    await beregnKnapp(page).click()
    await expect(page).toHaveURL(/#\/resultat$/)
    const statuser = await page.evaluate(() => (window as unknown as { __statuser: string[] }).__statuser)
    expect(statuser).toEqual(['Leser filen …', 'Beregner …'])
  })

  test('«Last opp ny fil» og Tilbake i nettleseren går til startsiden', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).click()
    await expect(page).toHaveURL(/#\/resultat$/)

    await page.goBack()
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Ny kjøring' })).toBeFocused()

    await page.goForward()
    await expect(page).toHaveURL(/#\/resultat$/)
    await page.getByRole('link', { name: 'Last opp ny fil' }).click()
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Ny kjøring' })).toBeFocused()
  })

  test('et dobbeltklikk på Beregn starter bare én kjøring (AD-12)', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).dblclick()
    await expect(page).toHaveURL(/#\/resultat$/)
    expect(await antallWorkere(page)).toBe(1)
  })
})

test.describe('feil i hele filen (UX-DR12, NFR-9)', () => {
  test('V-F04.csv, V-F07, V-F08 og V-F09 gir hver sin melding, og testeksempel 01 virker etterpå uten ny sidelasting', async ({
    page,
  }) => {
    await forbered(page)
    for (const [navn, melding] of [
      ['V-F04.csv', MELDING.IKKE_XLSX],
      ['V-F07.xlsx', MELDING.SKADET_FIL],
      ['V-F08.xlsx', MELDING.TOM_FIL],
      ['V-F09.xlsx', MELDING.IKKE_EXCEL],
    ] as const) {
      await velgFil(page, fil(navn))
      await beregnKnapp(page).click()
      await expect(sonemelding(page), navn).toHaveText(melding)
      await expect(sonemelding(page)).toHaveCount(1)
      // Filvalget er nullstilt, og sonen er fortsatt aktiv.
      await expect(sone(page)).not.toContainText('Valgt fil:')
      await expect(velgFilKnapp(page)).toBeEnabled()
      await expect(page.getByRole('status')).toHaveText(melding)
    }

    await velgFil(page, TESTEKSEMPEL_01)
    await expect(sonemelding(page)).toHaveCount(0)
    await beregnKnapp(page).click()
    await expect(page.locator('.kjoringslinje')).toContainText('Kontorstol Basic (100-002)')
    expect(await sammeSide(page), 'siden ble lastet på nytt').toBe(true)
  })

  test('samme fil kan velges på nytt etter en feil, og gir meldingen igjen', async ({ page }) => {
    await forbered(page)
    await velgFil(page, fil('V-F08.xlsx'))
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText(MELDING.TOM_FIL)

    await velgFil(page, fil('V-F08.xlsx'))
    await expect(sone(page)).toContainText('Valgt fil: V-F08.xlsx')
    await expect(sonemelding(page)).toHaveCount(0)
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText(MELDING.TOM_FIL)
  })

  test('meldingen beskriver «Velg fil», så skjermleseren leser den når knappen får fokus', async ({ page }) => {
    await forbered(page)
    await velgFil(page, fil('V-F07.xlsx'))
    await beregnKnapp(page).click()
    await expect(velgFilKnapp(page)).toHaveAccessibleDescription(MELDING.SKADET_FIL)
  })
})

test.describe('dra og slipp og «Velg fil» bruker samme kontroll (UX-DR8)', () => {
  test('samme fil gir samme melding, enten den slippes eller velges', async ({ page }) => {
    await forbered(page)
    await slipp(page, sone(page), [fil('V-F09.xlsx')])
    await expect(sone(page)).toContainText('Valgt fil: V-F09.xlsx')
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText(MELDING.IKKE_EXCEL)

    await velgFil(page, fil('V-F09.xlsx'))
    await expect(sone(page)).toContainText('Valgt fil: V-F09.xlsx')
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText(MELDING.IKKE_EXCEL)
  })

  test('testeksempel 01 sluppet i sonen gir Resultat', async ({ page }) => {
    await forbered(page)
    await slipp(page, sone(page), [TESTEKSEMPEL_01])
    await beregnKnapp(page).click()
    await expect(page.locator('.kjoringslinje')).toContainText('Horisont: 10 uker')
  })

  test('sonen får valgt-tone når en fil dras over, og mister den når filen dras ut', async ({ page }) => {
    await forbered(page)
    const dataTransfer = await dataMedFiler(page, [TESTEKSEMPEL_01])
    await sone(page).dispatchEvent('dragenter', { dataTransfer })
    await expect(sone(page)).toHaveClass(/opplastingssone-over/)
    await sone(page).dispatchEvent('dragleave', { dataTransfer })
    await expect(sone(page)).not.toHaveClass(/opplastingssone-over/)
  })

  test('tekst som dras over sonen, gir ikke valgt-tone', async ({ page }) => {
    await forbered(page)
    const dataTransfer = await page.evaluateHandle(() => {
      const data = new DataTransfer()
      data.setData('text/plain', 'en tekst')
      return data
    })
    await sone(page).dispatchEvent('dragenter', { dataTransfer })
    await expect(sone(page)).not.toHaveClass(/opplastingssone-over/)
  })

  test('flere filer: ingen brukes, og sonen sier «Slipp bare én fil. Ingen av filene er lest.»', async ({ page }) => {
    await forbered(page)
    await slipp(page, sone(page), [TESTEKSEMPEL_01, fil('V-F08.xlsx')])
    await expect(sonemelding(page)).toHaveText('Slipp bare én fil. Ingen av filene er lest.')
    await expect(sone(page)).not.toContainText('Valgt fil:')
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText('Velg en fil først.')
  })

  test('et slipp utenfor sonen gjør ingenting', async ({ page }) => {
    await forbered(page)
    const h1 = page.getByRole('heading', { level: 1, name: 'Ny kjøring' })
    expect(await draOgSlippUtenfor(page, 'main h1', 'fil')).toEqual({ over: true, slipp: true })
    await slipp(page, h1, [TESTEKSEMPEL_01])
    await expect(sone(page)).not.toContainText('Valgt fil:')
    await expect(sonemelding(page)).toHaveCount(0)
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    expect(await sammeSide(page)).toBe(true)
  })

  test('inne i sonen tar sonen imot filen, og nettleserens standardhandling stoppes også der', async ({ page }) => {
    await forbered(page)
    expect(await draOgSlippUtenfor(page, '.opplastingssone', 'fil')).toEqual({ over: true, slipp: true })
    await expect(sone(page)).toContainText('Valgt fil: testeksempel-01.xlsx')
  })
})

/**
 * Sender `dragover` og `drop` med en fil (eller tekst) til elementet og sier om standardhandlingen ble stoppet.
 * Et syntetisk slipp åpner aldri filen i nettleseren, så testen sjekker `defaultPrevented`: uten det ville
 * nettleseren åpnet filen og forlatt appen ved et ekte slipp.
 */
async function draOgSlippUtenfor(page: Page, velger: string, innhold: 'fil' | 'tekst') {
  return page.evaluate(
    ({ velger, innhold }) => {
      const mal = document.querySelector(velger)
      if (!mal) throw new Error(`fant ikke ${velger}`)
      const lag = () => {
        const data = new DataTransfer()
        if (innhold === 'fil') data.items.add(new File(['x'], 'testeksempel-01.xlsx'))
        else data.setData('text/plain', 'en tekst')
        return data
      }
      const send = (type: string) => {
        const hendelse = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: lag() })
        mal.dispatchEvent(hendelse)
        return hendelse.defaultPrevented
      }
      return { over: send('dragover'), slipp: send('drop') }
    },
    { velger, innhold },
  )
}

test.describe('fil sluppet utenfor sonen på andre visninger', () => {
  test('på Resultat åpnes ikke filen, og kjøringen står', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).click()
    await expect(page.locator('.kjoringslinje')).toContainText('Kontorstol Basic (100-002)')

    for (const velger of ['.kjoringslinje', '.informasjonsboks', 'body']) {
      expect(await draOgSlippUtenfor(page, velger, 'fil'), velger).toEqual({ over: true, slipp: true })
    }
    await expect(page).toHaveURL(/#\/resultat$/)
    await expect(page.locator('.kjoringslinje')).toContainText('Kontorstol Basic (100-002)')
    expect(await sammeSide(page)).toBe(true)
  })

  test('på Veiledning og Introduksjon åpnes ikke filen', async ({ page }) => {
    await forbered(page)
    const appmeny = page.getByRole('navigation', { name: 'Appmeny' })
    for (const [lenke, adresse] of [
      ['Veiledning', '#/veiledning'],
      ['Introduksjon', '#/introduksjon'],
      ['Lagrede kjøringer', '#/lagrede-kjoringer'],
    ] as const) {
      await appmeny.getByRole('link', { name: lenke, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${adresse}$`))
      expect(await draOgSlippUtenfor(page, 'main h1', 'fil'), adresse).toEqual({ over: true, slipp: true })
      await expect(page).toHaveURL(new RegExp(`${adresse}$`))
    }
    expect(await sammeSide(page)).toBe(true)
  })

  test('tekst som dras, berøres ikke, så vanlig dra og slipp virker', async ({ page }) => {
    await forbered(page)
    expect(await draOgSlippUtenfor(page, 'main h1', 'tekst')).toEqual({ over: false, slipp: false })
    await page.getByRole('navigation', { name: 'Appmeny' }).getByRole('link', { name: 'Veiledning' }).click()
    expect(await draOgSlippUtenfor(page, 'main h1', 'tekst')).toEqual({ over: false, slipp: false })
  })
})

test.describe('Beregn og «Velg fil» (UX-DR8, UX-DR10)', () => {
  test('uten valgt fil: «Velg en fil først.», fokus til «Velg fil», og Beregn er aldri deaktivert', async ({ page }) => {
    await forbered(page)
    await expect(beregnKnapp(page)).toBeEnabled()
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText('Velg en fil først.')
    await expect(velgFilKnapp(page)).toBeFocused()
    // Meldingen er koblet til knappen når den får fokus, så skjermleseren leser dem sammen.
    expect(
      await velgFilKnapp(page).evaluate((knapp) => document.getElementById(knapp.getAttribute('aria-describedby') ?? '')?.textContent),
    ).toBe('Velg en fil først.')
    await expect(beregnKnapp(page)).toBeEnabled()
  })

  test('fokus går tilbake til «Velg fil» etter fildialogen', async ({ page }) => {
    await forbered(page)
    await velgFil(page, TESTEKSEMPEL_01)
    await expect(velgFilKnapp(page)).toBeFocused()
  })

  test('«Velg fil» kan brukes med tastaturet', async ({ page }) => {
    await forbered(page)
    await velgFilKnapp(page).focus()
    const dialog = page.waitForEvent('filechooser')
    await page.keyboard.press('Enter')
    await (await dialog).setFiles(TESTEKSEMPEL_01)
    await expect(sone(page)).toContainText('Valgt fil: testeksempel-01.xlsx')
  })

  test('valideringsfeil: feiloppsummeringen står over kortene og får fokus (Story 1.12, e2e/feiloppsummering.spec.ts)', async ({ page }) => {
    await forbered(page)
    await velgFil(page, fil('V-M01.xlsx'))
    await beregnKnapp(page).click()
    const brett = page.locator('.feiloppsummering')
    await expect(brett.getByRole('heading', { level: 1 })).toHaveText(
      'Filen har 1 feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.',
    )
    await expect(brett).toBeFocused()
    await expect(sone(page)).not.toContainText('Valgt fil:')
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
  })
})

test.describe('1366 × 630 px uten rulling (UX-DR7, DESIGN.md › Layout & Spacing)', () => {
  test.use({ viewport: { width: 1366, height: 630 } })

  /** Opplastingssonen, «Velg fil», Beregn og statusen er helt synlige. Med `kort` også alle tre kortene. */
  async function allSynlig(page: Page, tilstand: string, kort = true) {
    for (const [navn, element] of [
      ['opplastingssonen', sone(page)],
      ['Velg fil', velgFilKnapp(page)],
      ['Beregn', beregnKnapp(page)],
      ['statusen ved Beregn', page.locator('.beregn-status')],
    ] as const) {
      await expect(element, `${navn} (${tilstand})`).toBeInViewport({ ratio: 1 })
    }
    if (kort) {
      const alle = page.locator('.kort')
      for (let i = 0; i < 3; i++) await expect(alle.nth(i), `kort ${i + 1} (${tilstand})`).toBeInViewport({ ratio: 1 })
    }
  }

  test('uten fil, med valgt fil, med meldinger og under Beregn', async ({ page }) => {
    await forbered(page)
    await allSynlig(page, 'uten fil')

    await velgFil(page, TESTEKSEMPEL_01)
    await allSynlig(page, 'valgt fil')

    // Den lengste meldingen om feil i hele filen.
    await velgFil(page, fil('V-F09.xlsx'))
    await beregnKnapp(page).click()
    await expect(sonemelding(page)).toHaveText(MELDING.IKKE_EXCEL)
    await allSynlig(page, 'feil i hele filen')

    await velgFil(page, fil('V-F09.xlsx'))
    await allSynlig(page, 'valgt fil etter en feil')

    await page.goto('/#/ny-kjoring')
    await beregnKnapp(page).click()
    await allSynlig(page, '«Velg en fil først.»')

    await slipp(page, sone(page), [TESTEKSEMPEL_01, fil('V-F08.xlsx')])
    await allSynlig(page, '«Slipp bare én fil …»')
  })

  // Med feiloppsummering gjelder ikke kravet om alt uten rulling (vedtatt av gruppen 26.11, DESIGN.md › Layout & Spacing).
  // Den tilstanden testes i e2e/feiloppsummering.spec.ts. Når en gyldig fil gir Resultat og Kari går tilbake,
  // er oppsummeringen borte, og alt er synlig igjen.
  test('etter valideringsfeil og så en gyldig fil er alt synlig igjen på startsiden', async ({ page }) => {
    await forbered(page)
    await velgFil(page, fil('V-M01.xlsx'))
    await beregnKnapp(page).click()
    await expect(page.locator('.feiloppsummering')).toBeVisible()
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).click()
    await expect(page).toHaveURL(/#\/resultat$/)
    await page.goto('/#/ny-kjoring')
    await expect(page.locator('.feiloppsummering')).toHaveCount(0)
    await allSynlig(page, 'tilbake etter valideringsfeil')
  })
})
