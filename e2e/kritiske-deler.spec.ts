// Kritiske deler gjennom hele appen (Story 2.10, FR-16, UX-DR17).
//
// Som de andre skjermtestene trenger disse en kjøring med beregnet bestillingsplan, og den kommer først med Story 2.5.
// Til da er `kjoring.resultat` null i den ekte appen, så testene er merket `fixme`. Når Story 2.5 er flettet inn:
// fjern `fixme`. Den samme oppførselen er prøvd i Chromium mot en syntetisk Resultat (1366 × 768 og 1366 × 630),
// men ikke gjennom den ekte appen. Hvilken celle et hopp lander i, og linjene i HTML, er dekket av
// tests/ui/kritiske-deler.test.ts.

import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const TESTEKSEMPEL_01 = join(import.meta.dirname, '..', 'testdata', 'testeksempel-01.xlsx')

async function beregnTesteksempel01(page: Page) {
  await page.goto('/')
  const dialog = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Velg fil' }).click()
  await (await dialog).setFiles(TESTEKSEMPEL_01)
  await page.getByRole('button', { name: 'Beregn' }).click()
  await expect(page).toHaveURL(/#\/resultat$/)
}

/** Cellen med fokus i rutenettet: del, rad i delen, kolonne (0 felt, 1 radnavn, 2 og utover ukene) og navnet. */
const fokus = (page: Page) =>
  page.evaluate(() => {
    const celle = document.activeElement?.closest<HTMLElement>('[data-k]')
    if (!celle) return null
    return {
      del: celle.closest<HTMLElement>('tbody')?.dataset.del,
      r: Number(celle.dataset.r),
      k: Number(celle.dataset.k),
      navn: celle.getAttribute('aria-label'),
    }
  })

test.describe('Kritiske deler med testeksempel 01', () => {
  test.fixme(true, 'Venter på Story 2.5: kjoring.resultat er null til beregningen er koblet til kjøringen.')

  test.use({ viewport: { width: 1366, height: 768 } })

  test('300-003, 300-004, 300-005 og 300-006 står i denne rekkefølgen, før bestillingsforslagene', async ({ page }) => {
    await beregnTesteksempel01(page)
    const seksjon = page.getByRole('region', { name: 'Kritiske deler' })
    await expect(seksjon.locator('.kritisk-linje-varenummer')).toHaveText(['300-003', '300-004', '300-005', '300-006'])
    const kritiske = await page.getByRole('heading', { level: 2, name: 'Kritiske deler' }).boundingBox()
    const forslag = await page.getByRole('heading', { level: 2, name: 'Bestillingsforslag' }).boundingBox()
    expect(kritiske!.y).toBeLessThan(forslag!.y)
  })

  test('hele linjen er én knapp med tilgjengelig navn', async ({ page }) => {
    await beregnTesteksempel01(page)
    await expect(
      page.getByRole('button', {
        name: '300-003 Hjul, Bestilling forsinket, uke 1. Bestillingen skulle vært sendt før uke 1. Se forklaring',
      }),
    ).toBeVisible()
  })

  test('valg av 300-005 Gassfjær flytter fokus til Nettobehov i uke 3, uten å sortere om tabellen', async ({ page }) => {
    await beregnTesteksempel01(page)
    const rekkefolge = () => page.locator('tbody.del').evaluateAll((deler) => deler.map((d) => (d as HTMLElement).dataset.del))
    const for_ = await rekkefolge()
    await page.getByRole('button', { name: /^300-005 Gassfjær/ }).click()
    expect(await fokus(page)).toMatchObject({ del: '300-005', r: 3, k: 4 })
    expect((await fokus(page))?.navn).toContain('Nettobehov, Uke 3')
    await expect(page.locator('tbody.del-markert[data-del="300-005"]')).toHaveCount(1)
    expect(await rekkefolge()).toEqual(for_)
    // Markeringen går bort av seg selv.
    await expect(page.locator('.del-markert')).toHaveCount(0, { timeout: 5000 })
  })

  test('Enter på linjen til 300-006 Stolfot flytter fokus til delens felt, og cellen er ikke skjult', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('button', { name: /^300-006 Stolfot/ }).focus()
    await page.keyboard.press('Enter')
    expect(await fokus(page)).toMatchObject({ del: '300-006', k: 0 })
    const skjult = await page.evaluate(() => {
      const celle = document.activeElement!.closest('[data-k]')!.getBoundingClientRect()
      const hode = document.querySelector('.tabellomrade thead')!.getBoundingClientRect()
      const linje = document.querySelector('.kjoringslinje')!.getBoundingClientRect()
      return celle.top < hode.bottom || celle.top < linje.bottom || celle.bottom > window.innerHeight
    })
    expect(skjult).toBe(false)
  })

  test('hoppet virker også med filteret «Vis bare kritiske deler» på, og piltastene fortsetter fra cellen', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).check()
    await page.getByRole('button', { name: /^300-004 Armlene/ }).click()
    expect(await fokus(page)).toMatchObject({ del: '300-004', r: 3, k: 2 })
    await page.keyboard.press('ArrowRight')
    expect(await fokus(page)).toMatchObject({ del: '300-004', r: 3, k: 3 })
  })
})
