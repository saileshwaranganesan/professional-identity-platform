/*
 * AppProviders — Global Provider Tree
 *
 * The single location responsible for mounting all global React providers.
 * Mounts QueryProvider (TanStack Query), AuthProvider, and RouterProvider (TanStack Router).
 */

import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/app/router'
import { AuthProvider } from '@/application/auth'
import { QueryProvider } from '@/application/query'

export function AppProviders() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  )
}
