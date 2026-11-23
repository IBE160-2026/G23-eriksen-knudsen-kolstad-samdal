import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Content Security Policy står bare ett sted: vercel.json (AD-17).
// `vite preview` bruker den samme, og tests/csp.test.ts sjekker at de er like.
// CSP-en brukes ikke på `npm run dev`, fordi Reacts oppdatering under utvikling trenger inline-skript.
type VercelHode = { key: string; value: string }
type VercelKonfig = { headers: { source: string; headers: VercelHode[] }[] }

const vercel = JSON.parse(
  readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'),
) as VercelKonfig

const sikkerhetshoder = Object.fromEntries(
  vercel.headers.flatMap((regel) => regel.headers.map((hode) => [hode.key, hode.value])),
)

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: sikkerhetshoder,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
