/*
 * AppProviders — Global Provider Tree
 *
 * The single location responsible for mounting all global React providers.
 * Mounts QueryProvider (TanStack Query) and RouterProvider (TanStack Router).
 */

import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/app/router'
import { QueryProvider } from '@/application/query'

export function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}
