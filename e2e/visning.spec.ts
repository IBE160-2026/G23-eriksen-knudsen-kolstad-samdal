// Lys og mørk visning (Story 1.13, AD-1, AD-10, UX-DR3): knappen nederst i appmenyen, valget lagres i
// `cosi-mrp:visning` og består en omlasting, siden tegnes riktig før appen er lastet, og blokkert lagring.
// Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak i alle testene.

import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const NOKKEL = 'cosi-mrp:visning'
const SIDER = [
  { navn: 'Introduksjon', adresse: '#/introduksjon' },
  { navn: 'Ny kjøring', adresse: '#/ny-kjoring' },
  { navn: 'Resultat', adresse: '#/resultat' },
  { navn: 'Lagrede kjøringer', adresse: '#/lagrede-kjoringer' },
  { navn: 'Veiledning', adresse: '#/veiledning' },
]

// surface-base i lys og mørk visning (DESIGN.md).
const BAKGRUNN_LYS = 'rgb(244, 246, 247)'
const BAKGRUNN_MORK = 'rgb(14, 19, 23)'

function appmeny(page: Page) {
  return page.getByRole('navigation', { name: 'Appmeny' })
}

function tilMork(page: Page) {
  return appmeny(page).getByRole('button', { name: 'Bytt til mørk' })
}

function tilLys(page: Page) {
  return appmeny(page).getByRole('button', { name: 'Bytt til lys' })
}

function lagretVisning(page: Page) {
  return page.evaluate((nokkel) => localStorage.getItem(nokkel), NOKKEL)
}

test('lys er standard: ingen lagret valg, og knappen heter «Bytt til mørk»', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
  await expect(page.locator('body')).toHaveCSS('background-color', BAKGRUNN_LYS)
  await expect(tilMork(page)).toBeVisible()
  expect(await lagretVisning(page)).toBeNull()
})

test('knappen står nederst i appmenyen, under de fem menyvalgene', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 630 })
  await page.goto('/#/ny-kjoring')
  const siste = await appmeny(page).getByRole('link', { name: 'Veiledning' }).boundingBox()
  const knapp = await tilMork(page).boundingBox()
  const meny = await appmeny(page).boundingBox()
  expect(siste && knapp && knapp.y > siste.y + siste.height - 1, 'knappen står under siste menyvalg').toBe(true)
  expect(meny && knapp && meny.y + meny.height - (knapp.y + knapp.height) <= 24, 'knappen står nederst').toBe(true)
})

test('bytt til mørk: alle sidene blir mørke, knappen heter «Bytt til lys», og valget lagres', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  await tilMork(page).click()
  await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
  await expect(tilLys(page)).toBeVisible()
  expect(await lagretVisning(page)).toBe('mork')

  for (const { navn, adresse } of SIDER) {
    await appmeny(page).getByRole('link', { name: navn }).click()
    await expect(page).toHaveURL(new RegExp(`${adresse}$`))
    await expect(page.locator('body'), `${navn} er mørk`).toHaveCSS('background-color', BAKGRUNN_MORK)
    await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
  }
})

test('mørk visning består en omlasting, og så gjør lys visning også', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  await tilMork(page).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
  await expect(page.locator('body')).toHaveCSS('background-color', BAKGRUNN_MORK)
  await expect(tilLys(page)).toBeVisible()

  await tilLys(page).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
  expect(await lagretVisning(page)).toBe('lys')
  await page.reload()
  await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
  await expect(page.locator('body')).toHaveCSS('background-color', BAKGRUNN_LYS)
  await expect(tilMork(page)).toBeVisible()
})

test('siden er mørk før appen er lastet, så den ikke blinker i feil visning', async ({ page }) => {
  await page.addInitScript((nokkel) => localStorage.setItem(nokkel, 'mork'), NOKKEL)
  // Appens skript får et tomt svar, så bare visning.js og stilarket virker.
  await page.route('**/assets/*.js', (rute) => rute.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.goto('/')
  await expect(page.locator('#root')).toBeEmpty()
  await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
  await expect(page.locator('body')).toHaveCSS('background-color', BAKGRUNN_MORK)
})

test('knappen virker med tastaturet, og fokus blir på knappen', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  await tilMork(page).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
  await expect(tilLys(page)).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
  await expect(tilMork(page)).toBeFocused()
})

test.describe('blokkert lagring', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const blokkert = () => {
        throw new DOMException('Lagringen er blokkert', 'SecurityError')
      }
      Storage.prototype.getItem = blokkert
      Storage.prototype.setItem = blokkert
    })
  })

  test('valget gjelder til siden lukkes', async ({ page }) => {
    await page.goto('/#/ny-kjoring')
    await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
    await tilMork(page).click()
    await expect(page.locator('html')).toHaveAttribute('data-visning', 'mork')
    await appmeny(page).getByRole('link', { name: 'Veiledning' }).click()
    await expect(page).toHaveURL(/#\/veiledning$/)
    await expect(page.locator('body')).toHaveCSS('background-color', BAKGRUNN_MORK)
    await tilLys(page).click()
    await expect(page.locator('html')).not.toHaveAttribute('data-visning', 'mork')
  })
})
