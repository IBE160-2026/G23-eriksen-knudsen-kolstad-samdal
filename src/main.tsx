import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Skriftene ligger i bygget via @fontsource og hentes aldri fra nettet (AD-1, NFR-4).
// Bare det latinske utvalget, som dekker norsk.
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-sans/latin-700.css'
import '@fontsource/ibm-plex-sans-condensed/latin-700.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import './ui/felles/tokens.css'
import './ui/felles/app.css'
import './ui/felles/sider.css'

import { App } from './ui/App.tsx'

const rot = document.getElementById('root')
if (!rot) throw new Error('Fant ikke #root i index.html')

createRoot(rot).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
