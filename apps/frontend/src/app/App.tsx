/*
 * App — Application Composition Root
 *
 * Composes the three structural layers of the application:
 *   1. AppProviders  — global provider tree (query, router, auth)
 *   2. AppLayout     — persistent structural frame (header + main)
 *   3. Content       — current page (managed by router once routing is added)
 *
 * This file's role is composition only. No logic lives here.
 */

import { AppProviders } from '@/app/bootstrap/AppProviders'
import { AppLayout } from '@/app/layouts/AppLayout'

function App() {
  return (
    <AppProviders>
      <AppLayout>
        <p>Professional Identity Platform</p>
      </AppLayout>
    </AppProviders>
  )
}

export default App
