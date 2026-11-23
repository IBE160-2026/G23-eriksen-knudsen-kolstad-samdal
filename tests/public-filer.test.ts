// Filene appen deler ut fra startsiden, er byte for byte like filene i testdata/ (Story 1.1, FR-27, AD-16).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROT = join(import.meta.dirname, '..')

describe('filene i public/', () => {
  it.each(['COSI-MRP-mal.xlsx', 'testeksempel-01.xlsx'])('public/%s er byte for byte lik filen i testdata/', (navn) => {
    const iPublic = readFileSync(join(ROT, 'public', navn))
    const iTestdata = readFileSync(join(ROT, 'testdata', navn))
    expect(iPublic.length).toBeGreaterThan(0)
    expect(iPublic.equals(iTestdata), `public/${navn} er ikke lik testdata/${navn}`).toBe(true)
  })
})
