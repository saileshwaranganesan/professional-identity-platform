/*
 * App — React tree root
 *
 * Mounts the Application Shell and renders the current content inside it.
 * Once routing is added, the router replaces the placeholder content
 * and manages what renders inside AppLayout.
 */

import { AppLayout } from '@/app/layouts/AppLayout'

function App() {
  return (
    <AppLayout>
      <p>Professional Identity Platform</p>
    </AppLayout>
  )
}

export default App
