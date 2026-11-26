// Resultattabellen gjennom hele appen (Story 2.7, FR-14–FR-16, UX-DR21–UX-DR24).
//
// Som e2e/resultat-toppen.spec.ts trenger testene en kjøring med beregnet bestillingsplan, og den kommer først med
// Story 2.5. Til da er `kjoring.resultat` null i den ekte appen, så testene er merket `fixme`. Når Story 2.5 er
// flettet inn: fjern `fixme`, og godkjenn tabellen mot testeksempel 01 (arkitektur kap. 8).
//
// Oppbyggingen, markørenes plassering og filterets modell er dekket av tests/ui/resultattabell.test.ts. Her testes
// klikk, filter og rulling i nettleseren. Tastaturstyringen kommer i Story 2.9.

import { join } from 'node:path'
import type { Locator, Page } from '@playwright/test'
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

const del = (page: Page, varenummer: string): Locator => page.locator(`tbody[data-del="${varenummer}"]`)
const celle = (page: Page, varenummer: string, rad: string, uke: number): Locator =>
  del(page, varenummer).locator(`td[data-rad="${rad}"][data-uke="${uke}"]`)

test.describe('Resultattabellen med testeksempel 01', () => {
  test.fixme(true, 'Venter på Story 2.5: kjoring.resultat er null til beregningen er koblet til kjøringen.')

  test('300-003 Hjul i uke 1 har bruttobehov 100, forventet lagerbeholdning 30, nettobehov 50 og frigivelse 175', async ({ page }) => {
    await beregnTesteksempel01(page)
    await expect(celle(page, '300-003', 'bruttobehov', 1)).toHaveText('100')
    await expect(celle(page, '300-003', 'forventetLagerbeholdning', 1)).toHaveText('30')
    await expect(celle(page, '300-003', 'nettobehov', 1)).toContainText('50')
    await expect(celle(page, '300-003', 'planlagteOrdrefrigivelser', 1)).toHaveText('175')
  })

  test('alle eksepsjonene i fasiten står på riktig del og uke', async ({ page }) => {
    await beregnTesteksempel01(page)
    await expect(celle(page, '300-003', 'nettobehov', 1).getByRole('img', { name: 'Bestilling forsinket, uke 1' })).toBeVisible()
    await expect(celle(page, '300-004', 'nettobehov', 1).getByRole('img', { name: 'Bruk av sikkerhetslager, uke 1' })).toBeVisible()
    await expect(celle(page, '300-005', 'nettobehov', 3).getByRole('img', { name: 'Mottak forsinket, uke 3' })).toBeVisible()
    await expect(del(page, '300-006').getByRole('img', { name: 'Ledetid overskrider horisont, hele delen' })).toBeVisible()
    await expect(page.getByRole('img', { name: /, (uke \d+|hele delen)$/ })).toHaveCount(4)
  })

  test('klikk på en celle velger den, og radnavn og ukeoverskrift blir fete', async ({ page }) => {
    await beregnTesteksempel01(page)
    const valgt = celle(page, '300-003', 'nettobehov', 1)
    await valgt.click()
    await expect(valgt).toHaveClass(/celle-valgt/)
    await expect(del(page, '300-003').getByRole('rowheader', { name: 'Nettobehov' })).toHaveCSS('font-weight', '700')
    await expect(page.getByRole('columnheader', { name: 'Uke 1' })).toHaveCSS('font-weight', '700')
    // Valget beholdes til en annen celle velges.
    await celle(page, '300-004', 'bruttobehov', 2).click()
    await expect(page.locator('.celle-valgt')).toHaveCount(1)
    await expect(valgt).not.toHaveClass(/celle-valgt/)
  })

  test('peking gjør ingenting annet enn en liten endring i rammen', async ({ page }) => {
    await beregnTesteksempel01(page)
    await celle(page, '300-003', 'bruttobehov', 2).hover()
    await expect(page.locator('.celle-valgt')).toHaveCount(0)
    await expect(page.locator('aside')).toHaveCount(0)
  })

  test('«Vis bare kritiske deler» viser 4 av 9 deler, nullstiller valgt celle i skjulte deler og endrer ikke tallboksene', async ({ page }) => {
    await beregnTesteksempel01(page)
    const filter = page.getByRole('checkbox', { name: 'Vis bare kritiske deler' })
    await expect(filter).not.toBeChecked()
    await expect(page.locator('tbody.del')).toHaveCount(9)
    await celle(page, '300-001', 'nettobehov', 2).click()

    await filter.check()
    await expect(page.getByText('Viser 4 av 9 deler')).toBeVisible()
    await expect(page.locator('tbody.del')).toHaveCount(4)
    await expect(page.locator('.celle-valgt')).toHaveCount(0)
    await expect(page.locator('.tallboks', { hasText: 'Kritiske deler' })).toContainText('4')

    await page.getByRole('button', { name: 'Vis alle deler' }).click()
    await expect(filter).not.toBeChecked()
    await expect(page.locator('tbody.del')).toHaveCount(9)
    await expect(page.locator('.celle-valgt')).toHaveCount(0)
  })

  test('ukeoverskriften og venstrekolonnene står fast og er ugjennomsiktige ved rulling i området', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 630 })
    await beregnTesteksempel01(page)
    const omraade = page.locator('.tabellomrade')
    await expect(omraade).toHaveAttribute('role', 'region')
    await omraade.evaluate((e) => {
      e.scrollLeft = 300
      e.scrollTop = 200
    })
    const hode = page.getByRole('columnheader', { name: 'Uke 10' })
    const ramme = (await omraade.boundingBox())!
    const topp = (await hode.boundingBox())!
    expect(topp.y).toBeLessThan(ramme.y + 40)
    await expect(del(page, '300-003').locator('th.delfelt')).toHaveCSS('position', 'sticky')
    await expect(del(page, '300-003').locator('th.radnavn').first()).toHaveCSS('position', 'sticky')
    for (const velger of ['th.delfelt', 'th.radnavn']) {
      const bakgrunn = await del(page, '300-003').locator(velger).first().evaluate((e) => getComputedStyle(e).backgroundColor)
      expect(bakgrunn).not.toMatch(/rgba\(.*, 0\)|transparent/)
    }
  })
})
