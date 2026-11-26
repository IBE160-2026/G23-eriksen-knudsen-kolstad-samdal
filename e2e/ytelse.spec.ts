// Ytelse med 1000 stykklisterader (Story 2.8, NFR-5, AD-14): under 3 sekunder fra Beregn til synlig resultattabell.
//
// Filen `testdata/ytelse-1000.xlsx` lages med `uv run --with openpyxl python lag_testdata.py testdata --ytelse`:
// 1000 rader, tre nivåer, felles deler og 12 uker.
//
// - Lesing og validering i worker-en måles med den ekte worker-en i bygget, tre ganger (tid i worker-en, uten tegning).
// - Hele veien fra Beregn til synlig tabell kan først måles når beregningen er koblet til kjøringen (Story 2.5). Til da
//   er den testen merket `fixme`. Tegningen av tabellen alene er målt med en syntetisk Resultat (se Story 2.8, PR-en).
//
// Tidene logges som merknader på testen. Grensene er skjønnsmessig romslige for en treg CI-maskin. Budsjettet i NFR-5
// er 3 sekunder totalt, og målingene på en bærbar PC står i PR-en.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const YTELSESFIL = join(import.meta.dirname, '..', 'testdata', 'ytelse-1000.xlsx')
const BUDSJETT_MS = 3000

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

/** Sender filen til en ny worker og gir svartypen og tiden i worker-en (fra melding til svar) i millisekunder. */
async function tidIWorker(page: Page, adresse: string, bytes: number[]): Promise<{ type: string; ms: number }> {
  return page.evaluate(
    async ({ adresse, bytes }) => {
      const innhold = new Uint8Array(bytes).buffer
      const worker = new Worker(adresse, { type: 'module' })
      try {
        return await new Promise<{ type: string; ms: number }>((lever, avvis) => {
          const tidsgrense = setTimeout(() => avvis(new Error('worker-en svarte ikke innen 20 sekunder')), 20_000)
          const start = performance.now()
          worker.onmessage = (hendelse) => {
            clearTimeout(tidsgrense)
            lever({ type: (hendelse.data as { type: string }).type, ms: Math.round(performance.now() - start) })
          }
          worker.onerror = (hendelse) => {
            clearTimeout(tidsgrense)
            avvis(new Error(`worker-feil: ${hendelse.message}`))
          }
          worker.postMessage({ innhold, filnavn: 'ytelse-1000.xlsx', valg: 'BESTILLINGSPLAN' }, [innhold])
        })
      } finally {
        worker.terminate()
      }
    },
    { adresse, bytes },
  )
}

test('ytelse-1000.xlsx er gyldig og leses og valideres i worker-en på under 3 sekunder, tre ganger', async ({ page }, testInfo) => {
  await page.goto('/')
  const adresse = await workerAdresse(page)
  const bytes = Array.from(readFileSync(YTELSESFIL))
  const tider: number[] = []
  for (let i = 0; i < 3; i++) {
    const svar = await tidIWorker(page, adresse, bytes)
    expect(svar.type, 'ytelsesfilen skal valideres uten feil').toBe('GYLDIG')
    tider.push(svar.ms)
  }
  testInfo.annotations.push({ type: 'lesing og validering (ms)', description: tider.join(', ') })
  for (const ms of tider) expect(ms).toBeLessThan(BUDSJETT_MS)
})

test.describe('Fra Beregn til synlig resultattabell', () => {
  test.fixme(true, 'Venter på Story 2.5: kjoring.resultat er null til beregningen er koblet til kjøringen.')

  test('tre målinger av ytelse-1000.xlsx er under 3 sekunder (NFR-5)', async ({ page }, testInfo) => {
    const tider: number[] = []
    for (let i = 0; i < 3; i++) {
      await page.goto('/')
      const dialog = page.waitForEvent('filechooser')
      await page.getByRole('button', { name: 'Velg fil' }).click()
      await (await dialog).setFiles(YTELSESFIL)
      const start = Date.now()
      await page.getByRole('button', { name: 'Beregn' }).click()
      await page.locator('table.resultattabell-tabell tbody.del').first().waitFor({ state: 'visible', timeout: 15_000 })
      // Tegningen er ferdig når nettleseren har malt siden.
      await page.evaluate(() => new Promise((lever) => requestAnimationFrame(() => requestAnimationFrame(lever))))
      tider.push(Date.now() - start)
    }
    testInfo.annotations.push({ type: 'Beregn til synlig tabell (ms)', description: tider.join(', ') })
    for (const ms of tider) expect(ms).toBeLessThan(BUDSJETT_MS)
  })
})
