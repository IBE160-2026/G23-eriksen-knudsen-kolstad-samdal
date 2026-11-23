// CSP-en i vercel.json og i `vite preview` er like, og lik AD-17 (Story 1.1, NFR-4).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import viteKonfig from '../vite.config.ts'

const ROT = join(import.meta.dirname, '..')

// Teksten står ordrett i arkitektur.md, AD-17.
const CSP_FRA_AD_17 =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; worker-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"

type VercelKonfig = { headers: { source: string; headers: { key: string; value: string }[] }[] }

function cspIVercel(): string | undefined {
  const vercel = JSON.parse(readFileSync(join(ROT, 'vercel.json'), 'utf8')) as VercelKonfig
  const regel = vercel.headers.find((r) => r.source === '/(.*)')
  return regel?.headers.find((h) => h.key === 'Content-Security-Policy')?.value
}

describe('Content Security Policy', () => {
  it('vercel.json setter nøyaktig CSP-en fra AD-17 for alle adresser', () => {
    expect(cspIVercel()).toBe(CSP_FRA_AD_17)
  })

  it('vite preview bruker den samme CSP-en som vercel.json', () => {
    const hoder = (viteKonfig.preview?.headers ?? {}) as Record<string, string>
    expect(hoder['Content-Security-Policy']).toBe(cspIVercel())
  })

  it('vite dev bruker ikke CSP-en, fordi utviklingsserveren trenger inline-skript', () => {
    expect(viteKonfig.server?.headers?.['Content-Security-Policy']).toBeUndefined()
  })
})
