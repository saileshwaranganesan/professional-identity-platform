/*
 * AppProviders — Global Provider Tree
 *
 * The single location responsible for mounting all global React providers.
 * Mounts RouterProvider (TanStack Router). Future providers (e.g. QueryClientProvider)
 * will wrap RouterProvider here.
 */

import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/app/router'

export function AppProviders() {
  return <RouterProvider router={router} />
}
