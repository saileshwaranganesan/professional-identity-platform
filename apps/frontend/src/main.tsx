/*
 * main.tsx — React DOM entry point
 *
 * Sole responsibility: find the root DOM node and mount the React tree.
 * Application composition, providers, and routing live in src/app/.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
