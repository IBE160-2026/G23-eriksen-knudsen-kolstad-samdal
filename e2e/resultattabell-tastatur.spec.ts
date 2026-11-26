// Tastaturstyringen i resultattabellen gjennom hele appen (Story 2.9, UX-DR22, WCAG 2.4.11).
//
// Som de andre skjermtestene trenger disse en kjøring med beregnet bestillingsplan, og den kommer først med Story 2.5.
// Til da er `kjoring.resultat` null i den ekte appen, så testene er merket `fixme`. Når Story 2.5 er flettet inn:
// fjern `fixme`. Den samme oppførselen er prøvd i Chromium mot en syntetisk Resultat (9 og 651 deler, 1366 × 768,
// 1366 × 630 og 1000 × 630), men ikke gjennom den ekte appen. Modellen (hvor fokus går) er dekket av
// tests/ui/resultattabell-tastatur.test.ts. Skjermleseren (NVDA) er ikke prøvd.

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

/** WCAG 2.4.11: cellen med fokus er helt synlig, og ikke bak ukeoverskriften, venstrekolonnene eller kjøringslinjen. */
async function erIkkeSkjult(page: Page) {
  const feil = await page.evaluate(() => {
    const celle = document.activeElement?.closest<HTMLElement>('[data-k]')
    if (!celle) return ['ingen celle har fokus']
    const r = celle.getBoundingClientRect()
    const omraade = document.querySelector('.tabellomrade')!.getBoundingClientRect()
    const hode = document.querySelector('.tabellomrade thead')!.getBoundingClientRect()
    const linje = document.querySelector('.kjoringslinje')!.getBoundingClientRect()
    const hjorne = document.querySelector('.tabellhjorne')!.getBoundingClientRect()
    const problemer: string[] = []
    if (r.top < hode.bottom - 0.5) problemer.push('bak ukeoverskriften')
    if (r.top < linje.bottom - 0.5) problemer.push('bak kjøringslinjen')
    if (r.bottom > window.innerHeight + 0.5 || r.bottom > omraade.bottom + 0.5) problemer.push('under det som vises')
    if (Number(celle.dataset.k) >= 2 && r.left < hjorne.right - 0.5) problemer.push('bak venstrekolonnene')
    const midt = document.elementFromPoint(r.left + Math.min(r.width / 2, 20), r.top + r.height / 2)
    if (midt?.closest('[data-k]') !== celle) problemer.push('dekket av et annet element')
    return problemer
  })
  expect(feil).toEqual([])
}

test.describe('Tastatur i resultattabellen med testeksempel 01', () => {
  test.fixme(true, 'Venter på Story 2.5: kjoring.resultat er null til beregningen er koblet til kjøringen.')

  test.use({ viewport: { width: 1366, height: 768 } })

  test('hele tabellen har én tabulatorstopp, på første uke i første rad', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).focus()
    await page.keyboard.press('Tab')
    expect(await fokus(page)).toMatchObject({ k: 2, r: 0 })
    await expect(page.locator('.resultattabell-tabell [tabindex]')).toHaveCount(1)
    await page.keyboard.press('Tab')
    expect(await fokus(page)).toBeNull() // Tab forlater tabellen
    await page.keyboard.press('Shift+Tab')
    expect(await fokus(page)).toMatchObject({ k: 2, r: 0 })
  })

  test('piltaster, Home, End og venstre til radnavn og delens felt', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('ArrowRight')
    expect(await fokus(page)).toMatchObject({ r: 0, k: 3 })
    await page.keyboard.press('ArrowDown')
    expect(await fokus(page)).toMatchObject({ r: 1, k: 3 })
    await page.keyboard.press('End')
    expect(await fokus(page)).toMatchObject({ k: 11 }) // uke 10
    await page.keyboard.press('Home')
    await page.keyboard.press('ArrowLeft')
    expect(await fokus(page)).toMatchObject({ k: 1 })
    await page.keyboard.press('ArrowLeft')
    expect(await fokus(page)).toMatchObject({ k: 0 })
    await page.keyboard.press('ArrowDown')
    expect(await fokus(page)).toMatchObject({ del: '300-001', k: 0 }) // neste del
  })

  test('Ctrl+Home, Ctrl+End, PgUp og PgDn: cellen med fokus er aldri skjult (WCAG 2.4.11)', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Control+End')
    expect(await fokus(page)).toMatchObject({ del: '300-008', r: 5, k: 11 })
    await erIkkeSkjult(page)
    await page.keyboard.press('Control+Home')
    expect(await fokus(page)).toMatchObject({ del: '100-002', r: 0, k: 2 })
    await erIkkeSkjult(page)
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('PageDown')
      await erIkkeSkjult(page)
    }
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('PageUp')
      await erIkkeSkjult(page)
    }
  })

  test('Enter og mellomrom velger cellen, og med filteret på hopper PgDn bare mellom delene som vises', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).check()
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).focus()
    await page.keyboard.press('Tab') // «Vis alle deler»
    await page.keyboard.press('Tab')
    expect(await fokus(page)).toMatchObject({ del: '300-003', k: 2 })
    await page.keyboard.press('PageDown')
    expect(await fokus(page)).toMatchObject({ del: '300-004' })
    await page.keyboard.press('Enter')
    await expect(page.locator('.celle-valgt')).toHaveCount(1)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press(' ')
    await expect(page.locator('.celle-valgt')).toHaveAttribute('data-uke', '2')
  })

  test('skjermleseren får del, rad, uke og verdi når en celle får fokus', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).check()
    await page.getByRole('checkbox', { name: 'Vis bare kritiske deler' }).focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    expect((await fokus(page))?.navn).toBe('300-003 Hjul, Nettobehov, Uke 1, 50, Bestilling forsinket, uke 1')
  })
})
