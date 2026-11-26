// Feiloppsummeringen på startsiden gjennom hele appen (Story 1.12, FR-2, FR-4, UX-DR11).
// Kjører mot bygget med den ekte worker-en og CSP-en. Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak.
// Grupperingen, sorteringen og sammenslåingen er testet i tests/ui/feiloppsummering.test.ts. Her testes
// fokus, sidetittelen, plasseringen, ny opplasting, høyden i 1366 × 630 og kontrasten i lys og mørk visning.

import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const TESTDATA = join(import.meta.dirname, '..', 'testdata')
const TESTEKSEMPEL_01 = join(TESTDATA, 'testeksempel-01.xlsx')
const fil = (navn: string) => join(TESTDATA, 'validering', navn)

const VISNINGSNOKKEL = 'cosi-mrp:visning'
const URORT = 'Den lagrede kjøringen er ikke endret.'
const overskrift = (antall: number) =>
  `Filen har ${antall} feil. Ingenting er beregnet. Rett feilene i Excel og last opp filen på nytt.`

const brett = (page: Page) => page.locator('.feiloppsummering')
const sone = (page: Page) => page.locator('.opplastingssone')
const velgFilKnapp = (page: Page) => page.getByRole('button', { name: 'Velg fil' })
const beregnKnapp = (page: Page) => page.getByRole('button', { name: 'Beregn' })

async function velgFil(page: Page, sti: string) {
  const dialog = page.waitForEvent('filechooser')
  await velgFilKnapp(page).click()
  await (await dialog).setFiles(sti)
}

/** Velger filen, trykker Beregn og venter til kjøringen er ferdig. */
async function lastOpp(page: Page, sti: string) {
  await velgFil(page, sti)
  await beregnKnapp(page).click()
  await expect(page.locator('.beregn-status')).toHaveText('')
}

async function forbered(page: Page) {
  await page.goto('/#/ny-kjoring')
  await page.evaluate(() => ((window as unknown as { __sammeSide: boolean }).__sammeSide = true))
}

const sammeSide = (page: Page) => page.evaluate(() => (window as unknown as { __sammeSide?: boolean }).__sammeSide === true)

/** Overskriftene i gruppene (h2 inne i brettet). */
const grupper = (page: Page) => brett(page).locator('h2')

/** Radene i tabellen under en gruppe, som [Ark, Sted, Felt, Feil]. */
async function rader(gruppe: Locator): Promise<string[][]> {
  return gruppe.locator('tbody tr').evaluateAll((trer) =>
    trer.map((tr) => Array.from(tr.querySelectorAll('td'), (td) => td.textContent ?? '')),
  )
}

const gruppe = (page: Page, navn: string) => brett(page).locator('section.feiloppsummering-gruppe', { has: page.getByRole('heading', { level: 2, name: navn, exact: true }) })

test.describe('V-F05 og V-F06 (FR-2, FR-4)', () => {
  test('V-F05: tre feil i tre grupper, øverst på startsiden, med fokus og «Feil:» i sidetittelen', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F05.xlsx'))

    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText(overskrift(3))
    await expect(brett(page)).toBeFocused()
    await expect(page).toHaveTitle(/^Feil: Ny kjøring – COSI - MRP$/)
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    await expect(brett(page)).toContainText(URORT)
    await expect(brett(page)).not.toHaveAttribute('role', 'alert')
    await expect(page.locator('[role="alert"]')).toHaveCount(0)

    // Øverst i visningen, over «Ny kjøring» og kortene.
    const forste = page.locator('.visning > *:not(title)').first()
    await expect(forste).toHaveClass(/feiloppsummering/)
    await expect(page.getByRole('heading', { level: 2, name: 'Ny kjøring' })).toBeVisible()

    await expect(grupper(page)).toHaveText(['Stykkliste (1 feil)', 'Prognostiserte behov (arket MPS) (1 feil)', 'Planlagte mottak (1 feil)'])
    expect(await rader(gruppe(page, 'Stykkliste (1 feil)'))).toEqual([
      ['Stykkliste', 'rad 9', 'Antall', '«0» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.'],
    ])
    expect(await rader(gruppe(page, 'Prognostiserte behov (arket MPS) (1 feil)'))).toEqual([
      ['Prognostiserte behov (arket MPS)', 'uke 3', 'Antall ferdigprodukter', '«−5» er ikke et gyldig antall. Skriv et heltall som er 0 eller mer.'],
    ])
    expect(await rader(gruppe(page, 'Planlagte mottak (1 feil)'))).toEqual([
      ['Planlagte mottak', 'rad 2', 'Uke', 'Uke 0 er før horisonten. Første uke i horisonten er uke 1.'],
    ])

    // Tabellene er ekte tabeller med kolonneoverskrifter, navngitt av gruppen.
    const tabell = page.getByRole('table', { name: 'Planlagte mottak (1 feil)' })
    await expect(tabell.getByRole('columnheader')).toHaveText(['Ark', 'Sted', 'Felt', 'Feil'])
    // Regionen har overskriften som navn, så skjermleseren leser den når brettet får fokus.
    await expect(page.getByRole('region', { name: overskrift(3) })).toBeFocused()

    // Filvalget er nullstilt, og sonen er fortsatt aktiv.
    await expect(sone(page)).not.toContainText('Valgt fil:')
  })

  test('V-F06: én strukturfeil og én verdifeil, og hvilke kontroller som er hoppet over', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F06.xlsx'))

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(overskrift(2))
    await expect(brett(page)).toBeFocused()
    await expect(grupper(page)).toHaveText(['Filen følger ikke malen', 'Planlagte mottak (1 feil)'])
    expect(await rader(gruppe(page, 'Filen følger ikke malen'))).toEqual([
      ['Stykkliste', 'H1', 'Ledetid (uker)', 'Kolonneoverskriften «Ledetid (uker)» mangler. Skriv den inn slik den står i malen.'],
    ])
    expect(await rader(gruppe(page, 'Planlagte mottak (1 feil)'))).toEqual([
      ['Planlagte mottak', 'rad 3', 'Antall', '«0» er ikke et gyldig antall. Skriv et heltall som er 1 eller mer.'],
    ])
    await expect(gruppe(page, 'Filen følger ikke malen').getByRole('listitem')).toHaveText([
      'Verdiene i kolonnen «Ledetid (uker)» i arket Stykkliste er ikke kontrollert, fordi overskriften mangler.',
    ])
  })
})

test.describe('ny opplasting (UX-DR11)', () => {
  test('en ny fil med andre feil oppdaterer listen og flytter fokus dit på nytt, uten ny sidelasting', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F05.xlsx'))
    await expect(brett(page)).toBeFocused()

    await lastOpp(page, fil('V-M01.xlsx'))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(overskrift(1))
    await expect(brett(page)).toBeFocused()
    await expect(grupper(page)).toHaveText(['Prognostiserte behov (arket MPS) (1 feil)'])
    await expect(brett(page)).toHaveCount(1)
    expect(await sammeSide(page)).toBe(true)
  })

  test('samme filnavn kan velges på nytt etter valideringsfeil, og gir oppsummeringen igjen med fokus', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F06.xlsx'))
    await velgFil(page, fil('V-F06.xlsx'))
    await expect(sone(page)).toContainText('Valgt fil: V-F06.xlsx')
    // Oppsummeringen står mens neste fil er valgt.
    await expect(brett(page)).toBeVisible()
    await beregnKnapp(page).click()
    await expect(sone(page)).not.toContainText('Valgt fil:')
    await expect(brett(page)).toBeFocused()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(overskrift(2))
  })

  test('en gyldig fil etter valideringsfeil gir Resultat, og oppsummeringen er borte', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F05.xlsx'))
    await velgFil(page, TESTEKSEMPEL_01)
    await beregnKnapp(page).click()

    await expect(page).toHaveURL(/#\/resultat$/)
    await expect(page.getByText('Kontorstol Basic (100-002)')).toBeVisible()
    await expect(page.getByText('Horisont: 10 uker')).toBeVisible()
    await expect(brett(page)).toHaveCount(0)

    await page.getByRole('link', { name: 'Last opp ny fil' }).click()
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    await expect(brett(page)).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ny kjøring')
    await expect(page).toHaveTitle('Ny kjøring – COSI - MRP')
    expect(await sammeSide(page)).toBe(true)
  })

  test('en fil med feil i hele filen etter valideringsfeil fjerner oppsummeringen og gir meldingen i sonen', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F05.xlsx'))
    await lastOpp(page, fil('V-F08.xlsx'))
    await expect(brett(page)).toHaveCount(0)
    await expect(page.locator('.sonemelding')).toHaveText('Filen er tom. Lagre malen i Excel og last den opp på nytt.')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ny kjøring')
    await expect(page).toHaveTitle('Ny kjøring – COSI - MRP')
  })

  test('Tab fra brettet går videre til innholdet under, i vanlig rekkefølge', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F05.xlsx'))
    await expect(brett(page)).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Last ned Excel-malen' })).toBeFocused()
  })
})

test.describe('1366 × 630 px med feiloppsummering (vedtatt av gruppen 26.11, DESIGN.md › Layout & Spacing)', () => {
  test.use({ viewport: { width: 1366, height: 630 } })

  // Kravet om at sonen og Beregn er synlige uten rulling gjelder startsiden uten feiloppsummering
  // (e2e/opplasting.spec.ts). Med feil står oppsummeringen øverst med fokus, og resten nås ved rulling.
  test('oppsummeringen står øverst med overskriften synlig og fokus, og sonen og Beregn nås ved rulling', async ({ page }) => {
    await forbered(page)
    await lastOpp(page, fil('V-F05.xlsx'))
    await expect(brett(page)).toBeFocused()
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport({ ratio: 1 })
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    // Siden ruller loddrett, ikke vannrett.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

    await beregnKnapp(page).scrollIntoViewIfNeeded()
    await expect(beregnKnapp(page)).toBeInViewport({ ratio: 1 })
    await velgFilKnapp(page).scrollIntoViewIfNeeded()
    await expect(sone(page)).toBeInViewport({ ratio: 1 })
  })
})

/** Kontrasten mellom to beregnede farger i siden (WCAG 2.1). */
async function kontrastI(page: Page, forgrunn: Locator, bakgrunn: Locator): Promise<number> {
  return page.evaluate(
    ([f, b]) => {
      const rgb = (farge: string) => (farge.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
      const lys = (farge: string) => {
        const [r, g, bl] = rgb(farge).map((c) => {
          const s = c / 255
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!
      }
      const a = lys(getComputedStyle(f!).color)
      const c = lys(getComputedStyle(b!).backgroundColor)
      return (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05)
    },
    [await forgrunn.elementHandle(), await bakgrunn.elementHandle()] as const,
  )
}

for (const visning of ['lys', 'mork'] as const) {
  test(`${visning === 'lys' ? 'lys' : 'mørk'} visning: tekst i oppsummeringen har kontrast minst 4,5:1 (WCAG 2.1 AA)`, async ({ page }) => {
    if (visning === 'mork') await page.addInitScript((nokkel) => localStorage.setItem(nokkel, 'mork'), VISNINGSNOKKEL)
    await forbered(page)
    if (visning === 'mork') await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
    else await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
    await lastOpp(page, fil('V-F06.xlsx'))

    const b = brett(page)
    const tabell = b.locator('table').first()
    for (const [navn, forgrunn, bakgrunn] of [
      ['h1 på brettet', b.locator('h1'), b],
      ['h2 på brettet', b.locator('h2').first(), b],
      ['teksten om lagret kjøring', b.locator('.feiloppsummering-urort'), b],
      ['listen over kontroller som er hoppet over', b.locator('li').first(), b],
      ['en celle i tabellen', tabell.locator('td').first(), tabell],
      ['kolonneoverskriften', tabell.locator('th').first(), tabell.locator('th').first()],
    ] as const) {
      expect(await kontrastI(page, forgrunn, bakgrunn), navn).toBeGreaterThanOrEqual(4.5)
    }
    // Brettet har ikke samme bakgrunn som siden, så det skiller seg ut i begge visningene.
    const farger = await page.evaluate(() => [
      getComputedStyle(document.querySelector('.feiloppsummering')!).backgroundColor,
      getComputedStyle(document.body).backgroundColor,
    ])
    expect(farger[0]).not.toBe(farger[1])
  })
}
