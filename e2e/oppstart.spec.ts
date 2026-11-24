// Røyktester fra prosjektoppsettet (Story 1.1): appen starter i nettleseren med CSP-en og
// sikkerhetshodene fra AD-17, og nettleseren stopper et forsøk på å koble til en annen adresse (NFR-4).
// Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak i alle testene.
// Testene for visningene står i appskall.spec.ts (Story 1.3).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from './csp-vakt.ts'

type VercelKonfig = { headers: { source: string; headers: { key: string; value: string }[] }[] }

function hoderIVercel(): Record<string, string> {
  const vercel = JSON.parse(
    readFileSync(join(import.meta.dirname, '..', 'vercel.json'), 'utf8'),
  ) as VercelKonfig
  const regel = vercel.headers.find((r) => r.source === '/(.*)')
  if (!regel?.headers.some((h) => h.key === 'Content-Security-Policy')) {
    throw new Error('vercel.json har ingen Content-Security-Policy')
  }
  return Object.fromEntries(regel.headers.map((h) => [h.key.toLowerCase(), h.value]))
}

// Reservert domene (RFC 2606) som aldri brukes på nettet. Testen fanger også adressen selv,
// så ingenting kan sendes ut selv om CSP-en skulle svikte.
const EKSTERN_ADRESSE = 'https://ekstern.example/cosi-mrp-test'

test('appen åpnes uten feil, med CSP-en og sikkerhetshodene fra vercel.json', async ({ page }) => {
  const svar = await page.goto('/')
  const mottatt = svar?.headers() ?? {}
  for (const [navn, verdi] of Object.entries(hoderIVercel())) {
    expect(mottatt[navn], navn).toBe(verdi)
  }

  // Første besøk går til introduksjonssiden (FR-27, AD-13).
  await expect(page).toHaveURL(/#\/introduksjon$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Introduksjon' })).toBeVisible()
})

test('vakten feiler en test når siden bryter CSP-en', async ({ page }) => {
  // Forventet å feile: vakten i csp-vakt.ts skal stoppe testen på stilen under (style-src).
  test.fail()
  await page.goto('/')
  await page.evaluate(() => {
    const stil = document.createElement('style')
    stil.textContent = 'body { color: red }'
    document.head.append(stil)
  })
  await page.waitForTimeout(500)
})

test.describe('med vilje brudd på CSP-en', () => {
  test.use({ forventerCspBrudd: true })

  test('nettleseren stopper en tilkobling til en ekstern adresse (connect-src)', async ({ page }) => {
    const naddeFram: string[] = []
    await page.route('https://ekstern.example/**', async (rute) => {
      naddeFram.push(rute.request().url())
      await rute.fulfill({ status: 204, body: '' })
    })

    await page.goto('/')

    const resultat = await page.evaluate(async (adresse) => {
      const brudd = new Promise<string>((ferdig) => {
        document.addEventListener('securitypolicyviolation', (e) => ferdig(e.effectiveDirective), { once: true })
      })
      let stoppet = false
      try {
        await fetch(adresse, { method: 'GET', cache: 'no-store' })
      } catch {
        stoppet = true
      }
      const direktiv = await Promise.race([brudd, new Promise<string>((f) => setTimeout(() => f(''), 2000))])
      return { stoppet, direktiv }
    }, EKSTERN_ADRESSE)

    expect(resultat.stoppet, 'fetch til en ekstern adresse skulle vært stoppet').toBe(true)
    expect(resultat.direktiv).toBe('connect-src')
    expect(naddeFram, 'forespørselen nådde nettverket').toEqual([])
  })
})
