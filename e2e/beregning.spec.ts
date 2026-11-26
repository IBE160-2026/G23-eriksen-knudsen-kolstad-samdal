// Beregningen i kjøringen gjennom hele appen (Story 2.5, AD-12, UX-DR4, FR-8): Beregn gir en ferdig beregnet plan, og
// kunngjøringen sier hvor mange bestillingsforslag og kritiske deler den har. Kjører mot det ferdige bygget med den ekte
// worker-en og CSP-en. Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak.

import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const TESTDATA = join(import.meta.dirname, '..', 'testdata')
const TESTEKSEMPEL_01 = join(TESTDATA, 'testeksempel-01.xlsx')
const KUNNGJORING_01 = 'Kjøringen er ferdig: 59 bestillingsforslag, 4 kritiske deler.'

type Svar = { type: string; [nokkel: string]: unknown }

async function velgFilOgBeregn(page: Page, sti: string) {
  const dialog = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: 'Velg fil' }).click()
  await (await dialog).setFiles(sti)
  await page.getByRole('button', { name: 'Beregn' }).click()
}

/** Adressen til worker-filen, slik appens skript peker på den (Vite legger den i /assets/). */
async function workerAdresse(page: Page): Promise<string> {
  const adresse = await page.evaluate(async () => {
    const skript = [...document.scripts].map((s) => s.src).find((s) => /\/assets\/index-[^/]*\.js$/.test(s))
    if (!skript) return null
    const kode = await (await fetch(skript)).text()
    return /assets\/beregning\.worker-[\w-]+\.js/.exec(kode)?.[0] ?? null
  })
  expect(adresse, 'appens skript peker på en worker-fil i /assets/').not.toBeNull()
  return `/${adresse}`
}

/** Kjører testeksempel 01 i en ny worker og gir svaret som tekst. */
async function kjorIWorker(page: Page, adresse: string): Promise<Svar> {
  return page.evaluate(async (adresse) => {
    const innhold = await (await fetch('/testeksempel-01.xlsx')).arrayBuffer()
    const worker = new Worker(adresse, { type: 'module' })
    try {
      return await new Promise<Svar>((lever, avvis) => {
        const tidsgrense = setTimeout(() => avvis(new Error('worker-en svarte ikke innen 20 sekunder')), 20_000)
        worker.onmessage = (hendelse) => {
          clearTimeout(tidsgrense)
          lever(hendelse.data as Svar)
        }
        worker.onerror = (hendelse) => {
          clearTimeout(tidsgrense)
          avvis(new Error(`worker-feil: ${hendelse.message}`))
        }
        worker.postMessage({ innhold, filnavn: 'testeksempel-01.xlsx', valg: 'BESTILLINGSPLAN' }, [innhold])
      })
    } finally {
      worker.terminate()
    }
  }, adresse)
}

test('testeksempel 01 lastet opp to ganger: begge ganger kunngjøres 4 kritiske deler (FR-8)', async ({ page }) => {
  await page.goto('/#/ny-kjoring')
  for (let runde = 1; runde <= 2; runde++) {
    await velgFilOgBeregn(page, TESTEKSEMPEL_01)
    await expect(page).toHaveURL(/#\/resultat$/)
    await expect(page.getByRole('status')).toHaveText(KUNNGJORING_01)
    // «Last opp ny fil» tar deg tilbake til startsiden for neste runde.
    await page.getByRole('link', { name: 'Last opp ny fil' }).click()
    await expect(page).toHaveURL(/#\/ny-kjoring$/)
  }
})

test('to kjøringer av samme fil gir nøyaktig samme resultat, hver i sin worker (AD-12, FR-8)', async ({ page }) => {
  await page.goto('/')
  const adresse = await workerAdresse(page)
  const første = await kjorIWorker(page, adresse)
  const andre = await kjorIWorker(page, adresse)
  expect(første['type']).toBe('GYLDIG')
  expect(JSON.stringify(andre)).toBe(JSON.stringify(første))
  const resultat = første['resultat'] as { kritiskeDeler: string[]; bestillingsforslag: unknown[]; eksepsjoner: unknown[] }
  expect(resultat.kritiskeDeler).toEqual(['300-003', '300-004', '300-005', '300-006'])
  expect(resultat.bestillingsforslag).toHaveLength(59)
  expect(resultat.eksepsjoner).toHaveLength(4)
})
