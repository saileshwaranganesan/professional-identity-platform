import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'

import { useLogin, useLogout, useAuthMe } from './queries'
import { queryKeys } from '../query/keys'
import type { User } from '@/domain/auth'

const mockLoginApi = vi.fn()
const mockLogoutApi = vi.fn()
const mockFetchMeApi = vi.fn()

vi.mock('@/infrastructure/auth', () => ({
  loginApi: (credentials: unknown) => mockLoginApi(credentials),
  logoutApi: () => mockLogoutApi(),
  fetchMeApi: () => mockFetchMeApi(),
}))

vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('Authentication Lifecycle & Session Invalidation', () => {
  let queryClient: QueryClient

  const mockUser: User = {
    id: 'user-1',
    email: 'admin@example.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
  }

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    vi.clearAllMocks()
  })

  it('updates query cache on successful login', async () => {
    mockLoginApi.mockResolvedValueOnce(mockUser)

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({ email: 'admin@example.com', password: 'Password123!' })
    })

    const cachedData = queryClient.getQueryData<User>(queryKeys.auth.me)
    expect(cachedData).toEqual(mockUser)
  })

  it('clears auth cache to null and purges domain data on logout without triggering fetchMe', async () => {
    mockLogoutApi.mockResolvedValueOnce(undefined)

    // Pre-populate query cache
    queryClient.setQueryData(queryKeys.auth.me, mockUser)
    queryClient.setQueryData(['projects', 'list'], [{ id: 'p1' }])

    const { result: logoutResult } = renderHook(() => useLogout(), { wrapper: createWrapper() })

    await act(async () => {
      await logoutResult.current.mutateAsync()
    })

    // auth.me must be explicitly null in cache
    const authData = queryClient.getQueryData(queryKeys.auth.me)
    expect(authData).toBeNull()

    // Non-auth queries must be removed
    const projectsData = queryClient.getQueryData(['projects', 'list'])
    expect(projectsData).toBeUndefined()

    // fetchMeApi should NOT have been invoked during logout cleanup
    expect(mockFetchMeApi).not.toHaveBeenCalled()
  })

  it('ensures session restoration returns null when logged out', async () => {
    mockFetchMeApi.mockResolvedValueOnce(null)

    const { result } = renderHook(() => useAuthMe(), { wrapper: createWrapper() })

    await act(async () => {
      await vi.waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    expect(result.current.data).toBeNull()
  })
})
