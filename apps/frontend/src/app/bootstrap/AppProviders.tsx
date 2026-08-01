/*
 * AppProviders — Global Provider Tree
 *
 * The single location responsible for mounting all global React providers.
 * Currently a pass-through wrapper. Future providers are added here, in order:
 *
 *   1. QueryClientProvider  (server state — TanStack Query)
 *   2. RouterProvider       (navigation — TanStack Router)
 *   3. Any auth context
 *
 * This component is deliberately empty until those dependencies are installed.
 * Its existence now means future providers have an obvious, correct home.
 */

import type { ReactNode } from 'react'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>
}
