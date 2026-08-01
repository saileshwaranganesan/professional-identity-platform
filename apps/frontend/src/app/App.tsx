/*
 * App — Application Composition Root
 *
 * Mounts AppProviders, which encapsulates the global provider tree and router instance.
 */

import { AppProviders } from '@/app/bootstrap/AppProviders'

function App() {
  return <AppProviders />
}

export default App
