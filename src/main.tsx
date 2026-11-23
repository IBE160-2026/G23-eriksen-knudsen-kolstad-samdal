import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './ui/App.tsx'

const rot = document.getElementById('root')
if (!rot) throw new Error('Fant ikke #root i index.html')

createRoot(rot).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
