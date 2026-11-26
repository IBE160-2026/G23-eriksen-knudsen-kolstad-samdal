// Toppen av Resultat gjennom hele appen (Story 2.6, UX-DR14, UX-DR15, AD-13).
//
// Testene trenger en kjøring med beregnet bestillingsplan, og den kommer først med Story 2.5 (Beregningen i kjøringen).
// Til da er `kjoring.resultat` null i den ekte appen, så testene er merket `fixme`. Når Story 2.5 er flettet inn:
// fjern `fixme`, og godkjenn skjermen mot testeksempel 01 (arkitektur kap. 8).

import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const TESTEKSEMPEL_01 = join(import.meta.dirname, '..', 'testdata', 'testeksempel-01.xlsx')

async function beregnTesteksempel01(page: Page) {
  await page.goto('/#/ny-kjoring')
  const dialog = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Velg fil' }).click()
  await (await dialog).setFiles(TESTEKSEMPEL_01)
  await page.getByRole('button', { name: 'Beregn' }).click()
  await expect(page).toHaveURL(/#\/resultat$/)
}

test.describe('Toppen av Resultat med testeksempel 01', () => {
  test.fixme(true, 'Venter på Story 2.5: kjoring.resultat er null til beregningen er koblet til kjøringen.')

  test('tallboksen for kritiske deler viser 4', async ({ page }) => {
    await beregnTesteksempel01(page)
    const boks = page.locator('.tallboks', { hasText: 'Kritiske deler' })
    await expect(boks).toContainText('4')
  })

  test('klikk på Bestillingsforslag i seksjonsmenyen setter fokus på overskriften, uten å endre adressen', async ({ page }) => {
    await beregnTesteksempel01(page)
    const meny = page.getByRole('navigation', { name: 'Seksjoner i resultatet' })
    await meny.getByRole('button', { name: /^Bestillingsforslag/ }).click()
    await expect(page.getByRole('heading', { level: 2, name: 'Bestillingsforslag' })).toBeFocused()
    await expect(page).toHaveURL(/#\/resultat$/)
  })

  test('seksjonen som er i bildet, har aria-current="location"', async ({ page }) => {
    await beregnTesteksempel01(page)
    const meny = page.getByRole('navigation', { name: 'Seksjoner i resultatet' })
    await meny.getByRole('button', { name: /^Resultattabell/ }).click()
    await expect(meny.getByRole('button', { name: /^Resultattabell/ })).toHaveAttribute('aria-current', 'location')
    await expect(meny.getByRole('button', { name: /^Kritiske deler/ })).not.toHaveAttribute('aria-current', 'location')
  })

  test('overskriften står rett under kjøringslinjen etter hopp', async ({ page }) => {
    await beregnTesteksempel01(page)
    await page.getByRole('navigation', { name: 'Seksjoner i resultatet' }).getByRole('button', { name: /^Bestillingsforslag/ }).click()
    const overskrift = page.getByRole('heading', { level: 2, name: 'Bestillingsforslag' })
    await expect(async () => {
      const linje = await page.locator('.kjoringslinje').boundingBox()
      const topp = (await overskrift.boundingBox())?.y ?? Infinity
      expect(topp).toBeGreaterThanOrEqual((linje?.y ?? 0) + (linje?.height ?? 0))
      expect(topp).toBeLessThan((linje?.y ?? 0) + (linje?.height ?? 0) + 40)
    }).toPass()
  })
})
