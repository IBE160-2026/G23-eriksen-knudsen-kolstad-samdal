// Appskallet (Story 1.3): appmenyen, rutingen, sidetitlene, introduksjonen ved første besøk,
// blokkert lagring, tastaturet og smal skjerm (AD-10, AD-13, UX-DR3, UX-DR4, UX-DR27).
// Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak i alle testene.

import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const VISNINGER = [
  { adresse: '#/introduksjon', navn: 'Introduksjon' },
  { adresse: '#/ny-kjoring', navn: 'Ny kjøring' },
  { adresse: '#/resultat', navn: 'Resultat' },
  { adresse: '#/lagrede-kjoringer', navn: 'Lagrede kjøringer' },
  { adresse: '#/veiledning', navn: 'Veiledning' },
]

function appmeny(page: Page) {
  return page.getByRole('navigation', { name: 'Appmeny' })
}

// Introduksjonssiden har overskriften fra designet (Story 1.4, UX-DR6). Menyvalget og sidetittelen heter fortsatt Introduksjon.
const INTRO_OVERSKRIFT = 'Hele produksjonsplanen. Én Excel-mal.'

function overskriftFor(navn: string): string {
  return navn === 'Introduksjon' ? INTRO_OVERSKRIFT : navn
}

async function forventVisning(page: Page, adresse: string, navn: string) {
  await expect(page).toHaveURL(new RegExp(`${adresse}$`))
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1, name: overskriftFor(navn) })).toBeVisible()
  await expect(page).toHaveTitle(`${navn} – COSI - MRP`)
  await expect(appmeny(page).getByRole('link', { name: navn })).toHaveAttribute('aria-current', 'page')
  await expect(appmeny(page).locator('[aria-current="page"]')).toHaveCount(1)
}

test.describe('de fem visningene', () => {
  for (const { adresse, navn } of VISNINGER) {
    test(`${navn} har adressen ${adresse}, én h1 og sidetittelen`, async ({ page }) => {
      await page.goto(`/${adresse}`)
      await forventVisning(page, adresse, navn)
      await expect(page.getByRole('status')).toHaveCount(1)
    })
  }

  test('appmenyen har logoen og de fem lenkene i rekkefølge', async ({ page }) => {
    await page.goto('/#/ny-kjoring')
    const lenker = appmeny(page).getByRole('link')
    await expect(lenker).toHaveText(['COSI - MRP', ...VISNINGER.map((v) => v.navn)])
  })
})

test.describe('første og senere besøk', () => {
  test('første besøk går til Introduksjon og lagrer intro-sett, neste besøk går til Ny kjøring', async ({ page }) => {
    await page.goto('/')
    await forventVisning(page, '#/introduksjon', 'Introduksjon')
    expect(await page.evaluate(() => localStorage.getItem('cosi-mrp:intro-sett'))).not.toBeNull()

    await page.goto('/')
    await forventVisning(page, '#/ny-kjoring', 'Ny kjøring')
  })

  test('en ukjent adresse går til Introduksjon første gang og til Ny kjøring senere', async ({ page }) => {
    await page.goto('/#/ukjent')
    await forventVisning(page, '#/introduksjon', 'Introduksjon')

    await page.goto('/#/finnes-ikke')
    await forventVisning(page, '#/ny-kjoring', 'Ny kjøring')
  })

  test('en ukjent adresse skrevet inn mens appen er åpen, går til standardruten', async ({ page }) => {
    await page.goto('/#/veiledning')
    await page.evaluate(() => {
      location.hash = '#/ukjent'
    })
    await forventVisning(page, '#/introduksjon', 'Introduksjon')
  })

  test('et bokmerke åpner visningen, også ved første besøk', async ({ page }) => {
    await page.goto('/#/veiledning')
    await forventVisning(page, '#/veiledning', 'Veiledning')
    expect(await page.evaluate(() => localStorage.getItem('cosi-mrp:intro-sett'))).toBeNull()
  })
})

test('Tilbake og Frem følger adressene, med aktiv side og sidetittel', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  // Statusregionen skal være det samme elementet hele veien (AD-13): merk det og sjekk merket til slutt.
  await page.getByRole('status').evaluate((el) => {
    ;(el as HTMLElement & { __cosiMerke?: boolean }).__cosiMerke = true
  })
  await appmeny(page).getByRole('link', { name: 'Veiledning' }).click()
  await forventVisning(page, '#/veiledning', 'Veiledning')
  await appmeny(page).getByRole('link', { name: 'Lagrede kjøringer' }).click()
  await forventVisning(page, '#/lagrede-kjoringer', 'Lagrede kjøringer')

  await page.goBack()
  await forventVisning(page, '#/veiledning', 'Veiledning')
  await page.goBack()
  await forventVisning(page, '#/ny-kjoring', 'Ny kjøring')
  await page.goForward()
  await forventVisning(page, '#/veiledning', 'Veiledning')

  const sammeElement = await page
    .getByRole('status')
    .evaluate((el) => (el as HTMLElement & { __cosiMerke?: boolean }).__cosiMerke === true)
  expect(sammeElement, 'statusregionen ble byttet ut').toBe(true)
})

test('Resultat uten kjøring viser en kort melding med lenke til Ny kjøring', async ({ page }) => {
  await page.goto('/#/resultat')
  await forventVisning(page, '#/resultat', 'Resultat')
  const lenke = page.getByRole('main').getByRole('link', { name: 'Til Ny kjøring' })
  await expect(lenke).toBeVisible()
  await lenke.click()
  await forventVisning(page, '#/ny-kjoring', 'Ny kjøring')
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

  test('appen virker, og introduksjonen vises ved hvert besøk', async ({ page }) => {
    await page.goto('/')
    await forventVisning(page, '#/introduksjon', 'Introduksjon')
    await appmeny(page).getByRole('link', { name: 'Veiledning' }).click()
    await forventVisning(page, '#/veiledning', 'Veiledning')

    await page.goto('/')
    await forventVisning(page, '#/introduksjon', 'Introduksjon')
  })
})

test('tastaturet: logoen og de fem lenkene nås i rekkefølge med synlig fokusring, og Enter flytter fokus til h1', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  const navn = ['COSI - MRP', ...VISNINGER.map((v) => v.navn)]
  for (const forventet of navn) {
    await page.keyboard.press('Tab')
    const fokus = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const stil = getComputedStyle(el)
      return {
        tekst: el.textContent?.trim(),
        iAppmeny: Boolean(el.closest('nav[aria-label="Appmeny"]')),
        outlineStyle: stil.outlineStyle,
        outlineWidth: stil.outlineWidth,
      }
    })
    expect(fokus).toEqual({ tekst: forventet, iAppmeny: true, outlineStyle: 'solid', outlineWidth: '2px' })
  }

  // Fokus står på Veiledning.
  await page.keyboard.press('Enter')
  await forventVisning(page, '#/veiledning', 'Veiledning')
  await expect(page.getByRole('heading', { level: 1, name: 'Veiledning' })).toBeFocused()
})

for (const vindusbredde of [768, 390, 320]) test(`under 900 px (${vindusbredde} px) står appmenyen øverst, og siden ruller ikke sideveis`, async ({ page }) => {
  await page.setViewportSize({ width: vindusbredde, height: 600 })
  for (const { adresse, navn } of VISNINGER) {
    await page.goto(`/${adresse}`)
    await forventVisning(page, adresse, navn)
    const meny = await appmeny(page).boundingBox()
    const hoved = await page.getByRole('main').boundingBox()
    expect(meny && hoved && meny.y + meny.height <= hoved.y + 1, 'appmenyen står over hovedfeltet').toBe(true)

    // Som i prototypen v3: ett menyvalg per linje, i samme kolonne og nesten full bredde.
    const lenker = await appmeny(page).locator('.appmeny-lenke').evaluateAll((els) =>
      els.map((el) => {
        const b = el.getBoundingClientRect()
        return { x: b.x, y: b.y, bunn: b.bottom, bredde: b.width }
      }),
    )
    expect(lenker).toHaveLength(5)
    for (let i = 1; i < lenker.length; i++) {
      expect(lenker[i].y, 'ett menyvalg per linje').toBeGreaterThanOrEqual(lenker[i - 1].bunn - 1)
      expect(Math.abs(lenker[i].x - lenker[0].x), 'menyvalgene står i samme kolonne').toBeLessThanOrEqual(1)
    }
    expect(lenker[0].bredde, 'menyvalget går over nesten hele bredden').toBeGreaterThanOrEqual(vindusbredde - 40)
    // Appmenyen strekkes ikke for å fylle skjermen: den slutter rett under det siste i menyen,
    // som er knappen for lys og mørk visning (Story 1.13).
    const visningsknapp = await appmeny(page).locator('.appmeny-visning').boundingBox()
    expect(visningsknapp && visningsknapp.y >= lenker[4].bunn - 1, 'knappen for visning står under siste menyvalg').toBe(true)
    expect(meny && visningsknapp && meny.y + meny.height - (visningsknapp.y + visningsknapp.height) <= 24, 'appmenyen er strukket').toBe(true)

    const bredde = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      vindu: document.documentElement.clientWidth,
    }))
    expect(bredde.scroll, 'siden ruller sideveis').toBeLessThanOrEqual(bredde.vindu)
  }
})

for (const vindusbredde of [900, 1366]) test(`på bred skjerm (${vindusbredde} px) står appmenyen fast til venstre`, async ({ page }) => {
  await page.setViewportSize({ width: vindusbredde, height: 630 })
  await page.goto('/#/ny-kjoring')
  const meny = await appmeny(page).boundingBox()
  const hoved = await page.getByRole('main').boundingBox()
  expect(meny && hoved && meny.x + meny.width <= hoved.x + 1, 'appmenyen står til venstre for hovedfeltet').toBe(true)
  const bredde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(bredde, 'siden ruller sideveis').toBeLessThanOrEqual(0)
})

test.describe('ruteskifte: fokus til h1 og rulling til toppen', () => {
  // Plassholderne er for korte til å rulle, så testen legger et høyt element utenfor #root.
  // Høyden settes med CSSOM (el.style), som CSP-en tillater. Vakten i csp-vakt.ts er på som vanlig.
  async function gjorSidenHoyOgRullNed(page: Page) {
    await page.evaluate(() => {
      if (!document.getElementById('test-hoyde')) {
        const hoyde = document.createElement('div')
        hoyde.id = 'test-hoyde'
        hoyde.style.height = '3000px'
        document.body.append(hoyde)
      }
      window.scrollTo(0, 1500)
    })
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  }

  async function forventFokusOgToppen(page: Page, navn: string) {
    await expect(page.getByRole('heading', { level: 1, name: overskriftFor(navn) })).toBeFocused()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  }

  test('første tegning flytter ikke fokus', async ({ page }) => {
    await page.goto('/#/ny-kjoring')
    await expect(page.getByRole('heading', { level: 1, name: 'Ny kjøring' })).toBeVisible()
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BODY')
  })

  test('ny adresse, Tilbake og Frem flytter fokus til h1 og ruller til toppen', async ({ page }) => {
    await page.goto('/#/ny-kjoring')

    await gjorSidenHoyOgRullNed(page)
    await page.evaluate(() => {
      location.hash = '#/veiledning'
    })
    await forventFokusOgToppen(page, 'Veiledning')

    await gjorSidenHoyOgRullNed(page)
    await page.goBack()
    await forventFokusOgToppen(page, 'Ny kjøring')

    await gjorSidenHoyOgRullNed(page)
    await page.goForward()
    await forventFokusOgToppen(page, 'Veiledning')
  })

  test('en ukjent adresse fører til standardruten med fokus på h1', async ({ page }) => {
    await page.goto('/#/veiledning')
    await gjorSidenHoyOgRullNed(page)
    await page.evaluate(() => {
      location.hash = '#/ukjent'
    })
    await expect(page).toHaveURL(/#\/introduksjon$/)
    await forventFokusOgToppen(page, 'Introduksjon')
  })
})
