/*
 * Auth Provider Component
 *
 * React Context provider encapsulating active session state and auth actions.
 */

import { useMemo, type ReactNode } from 'react'

import { AuthContext, type AuthContextValue } from './AuthContext'
import { useAuthMe, useLogin, useLogout } from './queries'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user = null, isLoading } = useAuthMe()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      login: async (credentials) => loginMutation.mutateAsync(credentials),
      logout: async () => logoutMutation.mutateAsync(),
    }),
    [user, isLoading, loginMutation, logoutMutation],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
