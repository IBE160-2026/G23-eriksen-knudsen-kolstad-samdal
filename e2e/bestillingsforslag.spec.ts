// Bestillingsforslag gjennom hele appen (Story 2.11, FR-17, UX-DR18, UX-DR19).
//
// Som de andre skjermtestene trenger disse en kjøring med beregnet bestillingsplan, og den kommer først med Story 2.5.
// Til da er `kjoring.resultat` null i den ekte appen, så testene er merket `fixme`. Når Story 2.5 er flettet inn:
// fjern `fixme`, og kontroller at listen er lik arket Bestillingsforslag i fasit 01. Den samme oppførselen er prøvd
// i Chromium mot en syntetisk Resultat (5 og 40 forslag), men ikke gjennom den ekte appen. Modellen og HTML-en er dekket av
// tests/ui/bestillingsforslag.test.ts.

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

const rader = (page: Page) => page.locator('.forslagtabell tbody tr')

test.describe('Bestillingsforslag med testeksempel 01', () => {
  test.fixme(true, 'Venter på Story 2.5: kjoring.resultat er null til beregningen er koblet til kjøringen.')

  test.use({ viewport: { width: 1366, height: 768 } })

  test('listen har én linje per planlagt ordrefrigivelse over 0, og forslagene for delene på nivå .1 er innkjøp', async ({ page }) => {
    await beregnTesteksempel01(page)
    // Antallet skal være lik antall frigivelser over 0 i arket Bestillingsforslag i fasit 01.
    const antall = await rader(page).count()
    await expect(page.locator('.tallboks', { hasText: 'Bestillingsforslag i alt' })).toContainText(String(antall))
    const nivaa1 = ['300-001', '300-002', '300-003', '300-004', '300-005', '300-006', '300-007', '300-008']
    for (const varenummer of nivaa1) {
      const forslag = rader(page).filter({ has: page.locator('.forslag-varenummer', { hasText: varenummer }) })
      for (const rad of await forslag.all()) await expect(rad.locator('.art-merke')).toHaveText('Innkjøp')
    }
  })

  test('det første forslaget for 300-002 Rygg er 25 i frigivelsesuke 2 (brukertestens oppgave 3)', async ({ page }) => {
    await beregnTesteksempel01(page)
    const rygg = rader(page).filter({ has: page.locator('.forslag-varenummer', { hasText: '300-002' }) }).first()
    await expect(rygg.locator('td').nth(0)).toHaveText('2')
    await expect(rygg.locator('.forslag-mengde')).toHaveText('25')
  })

  test('filter på uke 1 viser bare uke 1, også 175 hjul med «! 50 forfalt», og «Vis alle uker» viser alle igjen', async ({ page }) => {
    await beregnTesteksempel01(page)
    const alle = await rader(page).count()
    await expect(page.getByRole('button', { name: /^Alle uker/ })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: /^Uke 1,/ }).click()
    for (const uke of await page.locator('.forslagtabell tbody tr td:first-child').allInnerTexts()) expect(uke).toBe('1')
    const hjul = rader(page).filter({ has: page.locator('.forslag-varenummer', { hasText: '300-003' }) })
    await expect(hjul.locator('.forslag-mengde')).toHaveText('175')
    await expect(hjul.getByRole('button', { name: '50 forfalt: se eksepsjonen for 300-003 Hjul' })).toBeVisible()
    await expect(page.locator('.filterstatus')).toContainText('Viser')
    await page.getByRole('button', { name: 'Vis alle uker' }).click()
    await expect(rader(page)).toHaveCount(alle)
    // Filteret endrer ikke tallboksene.
    await expect(page.locator('.tallboks', { hasText: 'Bestillingsforslag i alt' })).toContainText(String(alle))
  })

  test('en uke uten forslag viser meldingen og «Vis alle uker»', async ({ page }) => {
    await beregnTesteksempel01(page)
    const tom = page.getByRole('button', { name: /^Uke \d+, 0 forslag$/ }).first()
    const navn = (await tom.getAttribute('aria-label'))!
    const uke = /Uke (\d+)/.exec(navn)![1]
    await tom.click()
    await expect(page.locator('.filterstatus')).toContainText(`Ingen bestillingsforslag skal frigis i uke ${uke}.`)
    await page.getByRole('button', { name: 'Vis alle uker' }).click()
    await expect(rader(page).first()).toBeVisible()
  })

  test('«! 50 forfalt» ruller tabellen til delen og flytter fokus til cellen med eksepsjonen, og et klikk andre steder på raden gjør ingenting', async ({ page }) => {
    await beregnTesteksempel01(page)
    const hjul = rader(page).filter({ has: page.locator('.forslag-varenummer', { hasText: '300-003' }) }).first()
    await hjul.locator('td').nth(2).click()
    await expect(page.locator('.del-markert')).toHaveCount(0)
    await hjul.getByRole('button', { name: /forfalt/ }).click()
    const fokus = await page.evaluate(() => {
      const celle = document.activeElement?.closest<HTMLElement>('[data-k]')
      return { del: celle?.closest<HTMLElement>('tbody')?.dataset.del, r: Number(celle?.dataset.r), k: Number(celle?.dataset.k) }
    })
    expect(fokus).toEqual({ del: '300-003', r: 3, k: 2 })
    await expect(page.locator('tbody.del-markert[data-del="300-003"]')).toHaveCount(1)
  })
})
