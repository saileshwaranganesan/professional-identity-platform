/*
 * AppProviders — Global Provider Tree
 *
 * The single location responsible for mounting all global React providers.
 * Mounts ErrorBoundary, QueryProvider (TanStack Query), ToastProvider (Global Toasts),
 * AuthProvider, and RouterProvider (TanStack Router).
 */

import { RouterProvider } from '@tanstack/react-router'

import { router } from '@/app/router'
import { AuthProvider } from '@/application/auth'
import { QueryProvider } from '@/application/query'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ToastProvider } from '@/components/ui/Toast'

export function AppProviders() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </ErrorBoundary>
  )
}

