// Worker-en i nettleseren (Story 1.10, AD-12, AD-17): bygget lager worker-en som en egen fil, CSP-en tillater den
// (`worker-src 'self'`), og SheetJS virker inne i den. Testen finner worker-filen i bygget, starter den med ekte
// filer og sjekker svaret. Opplastingen og Beregn-knappen gjennom hele appen testes i Story 1.11.
// Vakten i csp-vakt.ts kontrollerer CSP-brudd, konsollfeil og unntak i alle testene.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './csp-vakt.ts'

const TESTDATA = join(import.meta.dirname, '..', 'testdata')

type Svar = { type: string; [nokkel: string]: unknown }

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

/** Starter en ny worker, sender filen (overført) og gir det ene svaret tilbake. Worker-en stoppes etterpå. */
async function kjorIWorker(page: Page, adresse: string, bytes: number[] | 'testeksempel-01', filnavn: string): Promise<Svar> {
  return page.evaluate(
    async ({ adresse, bytes, filnavn }) => {
      const innhold =
        bytes === 'testeksempel-01'
          ? await (await fetch('/testeksempel-01.xlsx')).arrayBuffer()
          : new Uint8Array(bytes).buffer
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
          worker.postMessage({ innhold, filnavn, valg: 'BESTILLINGSPLAN' }, [innhold])
        })
      } finally {
        worker.terminate()
      }
    },
    { adresse, bytes, filnavn },
  )
}

const bytesFor = (fil: string): number[] => Array.from(readFileSync(join(TESTDATA, fil)))

test('bygget har worker-en som en egen fil, og den lastes under CSP-en', async ({ page }) => {
  await page.goto('/')
  const adresse = await workerAdresse(page)
  const svar = await page.request.get(adresse)
  expect(svar.status()).toBe(200)
  expect(svar.headers()['content-type']).toMatch(/javascript/)
})

test('en gyldig fil gir GYLDIG: Kontorstol Basic (100-002) og horisont 10', async ({ page }) => {
  await page.goto('/')
  const svar = await kjorIWorker(page, await workerAdresse(page), 'testeksempel-01', 'testeksempel-01.xlsx')
  expect(svar).toMatchObject({ type: 'GYLDIG', resultat: null, kapasitet: null })
  const inndata = svar['inndata'] as { horisont: number; stykkliste: { varenummer: string; beskrivelse: string }[] }
  expect(inndata.horisont).toBe(10)
  expect(inndata.stykkliste[0]).toMatchObject({ varenummer: '100-002', beskrivelse: 'Kontorstol Basic' })
})

test('feil i hele filen gir FILFEIL, også for tekst og en tom fil', async ({ page }) => {
  await page.goto('/')
  const adresse = await workerAdresse(page)
  const tekst = Array.from(new TextEncoder().encode('dette er ikke en Excel-fil'))
  expect(await kjorIWorker(page, adresse, tekst, 'V-F04.csv')).toEqual({ type: 'FILFEIL', feil: { kode: 'IKKE_XLSX' } })
  expect(await kjorIWorker(page, adresse, [], 'V-F08.xlsx')).toEqual({ type: 'FILFEIL', feil: { kode: 'TOM_FIL' } })
  expect(await kjorIWorker(page, adresse, bytesFor('validering/V-F07.xlsx'), 'V-F07.xlsx')).toEqual({ type: 'FILFEIL', feil: { kode: 'SKADET_FIL' } })
  expect(await kjorIWorker(page, adresse, bytesFor('validering/V-F10.xlsx'), 'V-F10.xlsx')).toEqual({
    type: 'FILFEIL',
    feil: { kode: 'PASSORDBESKYTTET' },
  })
})

test('en fil med valideringsfeil gir VALIDERINGSFEIL med alle feilene', async ({ page }) => {
  await page.goto('/')
  const svar = await kjorIWorker(page, await workerAdresse(page), bytesFor('validering/V-M01.xlsx'), 'V-M01.xlsx')
  expect(svar['type']).toBe('VALIDERINGSFEIL')
  const feil = (svar['feil'] as { feil: { kode: string }[] }).feil
  expect(feil.map((f) => f.kode)).toEqual(['MPS_ANTALL_UGYLDIG'])
})

test('worker-en har ingen tilstand: en gyldig fil etter en med feil gir GYLDIG, hver i sin worker', async ({ page }) => {
  await page.goto('/')
  const adresse = await workerAdresse(page)
  expect((await kjorIWorker(page, adresse, bytesFor('validering/V-M01.xlsx'), 'V-M01.xlsx')).type).toBe('VALIDERINGSFEIL')
  expect((await kjorIWorker(page, adresse, 'testeksempel-01', 'testeksempel-01.xlsx')).type).toBe('GYLDIG')
  expect((await kjorIWorker(page, adresse, [], 'a.xlsx')).type).toBe('FILFEIL')
})
