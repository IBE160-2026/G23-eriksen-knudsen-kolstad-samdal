// Introduksjon, Ny kjøring og Veiledning (Story 1.4, UX-DR6, UX-DR7, UX-DR31, FR-27).
// Første og senere besøk (intro-sett) testes i appskall.spec.ts. Vakten i csp-vakt.ts kontrollerer
// CSP-brudd, konsollfeil og unntak i alle testene.

import { statSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from './csp-vakt.ts'

const PUBLIC = join(import.meta.dirname, '..', 'public')

test.describe('Introduksjon', () => {
  test('«Kom i gang» går til startsiden, og fokus står på h1', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/#\/introduksjon$/)
    await page.getByRole('link', { name: 'Kom i gang' }).click()
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Ny kjøring' })).toBeFocused()
  })

  test('har de tre stegene i tre bokser i én rad (bred skjerm)', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto('/#/introduksjon')
    const bokser = page.getByRole('list', { name: 'De tre stegene' }).getByRole('listitem')
    await expect(bokser).toHaveCount(3)
    const rammer = await bokser.evaluateAll((e) => e.map((el) => el.getBoundingClientRect().top))
    expect(new Set(rammer.map(Math.round)).size, 'boksene står på samme rad').toBe(1)
  })
})

test.describe('Ny kjøring', () => {
  test('har h1, setningen om ett ferdigprodukt og de tre kortene', async ({ page }) => {
    await page.goto('/#/ny-kjoring')
    await expect(page.getByRole('heading', { level: 1, name: 'Ny kjøring' })).toBeVisible()
    await expect(
      page.getByText('Hver fil gjelder ett ferdigprodukt. Lageret for deler som brukes i flere ferdigprodukter, må du fordele mellom filene selv.'),
    ).toBeVisible()
    for (const tittel of ['Fyll ut Excel-malen', 'Last opp filen', 'Velg hva du vil beregne, og beregn']) {
      await expect(page.getByRole('heading', { level: 2, name: tittel })).toBeVisible()
    }
  })

  test('alle tre kortene er synlige uten rulling i 1366 × 630 px', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 630 })
    await page.goto('/#/ny-kjoring')
    const kort = page.locator('.kort')
    await expect(kort).toHaveCount(3)
    for (let i = 0; i < 3; i++) await expect(kort.nth(i)).toBeInViewport({ ratio: 1 })
  })

  for (const { lenke, fil } of [
    { lenke: 'Last ned Excel-malen', fil: 'COSI-MRP-mal.xlsx' },
    { lenke: 'Last ned testeksempel 01', fil: 'testeksempel-01.xlsx' },
  ]) {
    test(`«${lenke}» laster ned ${fil} fra public/`, async ({ page }) => {
      await page.goto('/#/ny-kjoring')
      const nedlasting = page.waitForEvent('download')
      await page.getByRole('link', { name: lenke }).click()
      const lastet = await nedlasting
      expect(lastet.suggestedFilename()).toBe(fil)
      const sti = await lastet.path()
      expect(statSync(sti).size).toBe(statSync(join(PUBLIC, fil)).size)
    })
  }
})

test.describe('Veiledning', () => {
  test('har nummererte overskrifter og primærknappen «Til Ny kjøring» nederst', async ({ page }) => {
    await page.goto('/#/veiledning')
    const overskrifter = await page.getByRole('heading', { level: 2 }).allTextContents()
    expect(overskrifter.length).toBeGreaterThan(0)
    overskrifter.forEach((tekst, i) => expect(tekst.startsWith(`${i + 1}. `)).toBe(true))
    await page.getByRole('main').getByRole('link', { name: 'Til Ny kjøring' }).click()
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Ny kjøring' })).toBeFocused()
  })
})
