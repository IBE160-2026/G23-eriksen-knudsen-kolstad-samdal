// Røyktester fra prosjektoppsettet (Story 1.1): appen starter i nettleseren med CSP-en fra AD-17,
// og nettleseren stopper et forsøk på å koble til en annen adresse (NFR-4).
// Testene for visningene kommer med Story 1.3 og senere.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'

type VercelKonfig = { headers: { source: string; headers: { key: string; value: string }[] }[] }

function cspIVercel(): string {
  const vercel = JSON.parse(
    readFileSync(join(import.meta.dirname, '..', 'vercel.json'), 'utf8'),
  ) as VercelKonfig
  const verdi = vercel.headers
    .find((r) => r.source === '/(.*)')
    ?.headers.find((h) => h.key === 'Content-Security-Policy')?.value
  if (!verdi) throw new Error('vercel.json har ingen Content-Security-Policy')
  return verdi
}

// Reservert domene (RFC 2606) som aldri brukes på nettet. Testen fanger også adressen selv,
// så ingenting kan sendes ut selv om CSP-en skulle svikte.
const EKSTERN_ADRESSE = 'https://ekstern.example/cosi-mrp-test'

test('appen åpnes uten feil, med hele CSP-hodet fra vercel.json', async ({ page }) => {
  const problemer: string[] = []
  page.on('console', (melding) => {
    if (melding.type() === 'error') problemer.push(melding.text())
  })
  page.on('pageerror', (feil) => problemer.push(feil.message))

  const svar = await page.goto('/')
  expect(svar?.headers()['content-security-policy']).toBe(cspIVercel())

  await expect(page.getByRole('heading', { level: 1, name: 'COSI - MRP' })).toBeVisible()
  expect(problemer, problemer.join('\n')).toEqual([])
})

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
