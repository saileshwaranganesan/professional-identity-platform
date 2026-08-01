/*
 * TanStack QueryClient Configuration
 *
 * Configures global QueryClient with sensible caching and retry defaults (FSAS-001 §5.3).
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 5 minutes before background refetching occurs.
      staleTime: 1000 * 60 * 5,

      // Inactive query cache is garbage collected after 10 minutes.
      gcTime: 1000 * 60 * 10,

      // Retries failed queries once before raising an error state.
      retry: 1,

      // Prevents aggressive network refetching when window regains focus in dev/demo.
      refetchOnWindowFocus: false,

      // Automatically refetches queries when network connection is restored.
      refetchOnReconnect: true,
    },
  },
})
