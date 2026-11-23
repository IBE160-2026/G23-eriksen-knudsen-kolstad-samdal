// CSP-en og sikkerhetshodene i vercel.json og i `vite preview` er like, og like AD-17 (Story 1.1, NFR-4).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import viteKonfig from '../vite.config.ts'

const ROT = join(import.meta.dirname, '..')

// Teksten står ordrett i arkitektur.md, AD-17.
const CSP_FRA_AD_17 =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; worker-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"

// De andre sikkerhetshodene fra AD-17. HSTS sender Vercel selv, så det står ikke her.
const ANDRE_HODER_FRA_AD_17 = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
}

type VercelKonfig = { headers: { source: string; headers: { key: string; value: string }[] }[] }

function hoderIVercel(): Record<string, string> {
  const vercel = JSON.parse(readFileSync(join(ROT, 'vercel.json'), 'utf8')) as VercelKonfig
  const regel = vercel.headers.find((r) => r.source === '/(.*)')
  return Object.fromEntries((regel?.headers ?? []).map((h) => [h.key, h.value]))
}

function hoderIPreview(): Record<string, string> {
  return (viteKonfig.preview?.headers ?? {}) as Record<string, string>
}

describe('Content Security Policy', () => {
  it('vercel.json setter nøyaktig CSP-en fra AD-17 for alle adresser', () => {
    expect(hoderIVercel()['Content-Security-Policy']).toBe(CSP_FRA_AD_17)
  })

  it('vite preview bruker den samme CSP-en som vercel.json', () => {
    expect(hoderIPreview()['Content-Security-Policy']).toBe(hoderIVercel()['Content-Security-Policy'])
  })

  it('vite dev bruker ikke CSP-en, fordi utviklingsserveren trenger inline-skript', () => {
    expect(viteKonfig.server?.headers?.['Content-Security-Policy']).toBeUndefined()
  })
})

describe('andre sikkerhetshoder', () => {
  it('vercel.json setter nøyaktig CSP-en og de andre sikkerhetshodene fra AD-17, og ingen flere', () => {
    expect(hoderIVercel()).toEqual({ 'Content-Security-Policy': CSP_FRA_AD_17, ...ANDRE_HODER_FRA_AD_17 })
  })

  it('vite preview sender de samme hodene som vercel.json', () => {
    expect(hoderIPreview()).toEqual(hoderIVercel())
  })
})
