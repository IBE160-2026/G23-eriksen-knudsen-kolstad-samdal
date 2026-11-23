// Felles vakt for alle e2e-testene (AD-16, AD-17): en test feiler hvis siden bryter CSP-en,
// skriver en feil i konsollen eller kaster et unntak som ikke fanges.
// `npm run dev` har ingen CSP, så det er her et brudd blir oppdaget.
//
// Bruk `test` og `expect` fra denne filen i stedet for fra '@playwright/test'.
// En test som skal fremprovosere et brudd med vilje, slår vakten av med
// `test.use({ forventerCspBrudd: true })` og kontrollerer bruddet selv.

import { test as base, expect } from '@playwright/test'

type Valg = { forventerCspBrudd: boolean }
type Vakter = { cspVakt: void }

export const test = base.extend<Valg & Vakter>({
  forventerCspBrudd: [false, { option: true }],

  cspVakt: [
    async ({ page, forventerCspBrudd }, use) => {
      const brudd: string[] = []
      const feil: string[] = []

      await page.exposeFunction('__meldCspBrudd', (direktiv: string, adresse: string) => {
        brudd.push(`${direktiv}: ${adresse || '(inline)'}`)
      })
      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (e) => {
          const meld = (window as unknown as { __meldCspBrudd: (d: string, a: string) => void }).__meldCspBrudd
          meld(e.effectiveDirective, e.blockedURI)
        })
      })
      page.on('console', (melding) => {
        if (melding.type() === 'error') feil.push(`konsollfeil: ${melding.text()}`)
      })
      page.on('pageerror', (unntak) => feil.push(`unntak: ${unntak.message}`))

      await use()

      if (!forventerCspBrudd) {
        expect(brudd, `Brudd på CSP-en:\n${brudd.join('\n')}`).toEqual([])
        expect(feil, feil.join('\n')).toEqual([])
      }
    },
    { auto: true },
  ],
})

export { expect }
