// Mappestrukturen fra arkitektur kap. 2 finnes (Story 1.1).

import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROT = join(import.meta.dirname, '..')

const MAPPER = [
  'src/domene',
  'src/tekster',
  'src/excel',
  'src/lagring',
  'src/worker',
  'src/app',
  'src/ui',
  'public',
  'tests',
  'e2e',
]

describe('mappestrukturen', () => {
  it.each(MAPPER)('%s finnes', (mappe) => {
    const sti = join(ROT, mappe)
    expect(existsSync(sti) && statSync(sti).isDirectory(), `${mappe} mangler`).toBe(true)
  })
})
