import { felles } from '../tekster/nb.ts'

// Midlertidig rotkomponent fra prosjektoppsettet (Story 1.1).
// Appskallet med appmeny og ruting kommer i Story 1.3.
export function App() {
  return (
    <main>
      <h1>{felles.appnavn}</h1>
    </main>
  )
}
