/*
 * Auth Application Server State Hooks
 *
 * TanStack Query hooks for session restoration, login, and logout.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type { LoginCredentials, User } from '@/domain/auth'

import { fetchMeApi, loginApi, logoutApi } from '@/infrastructure/auth'
import { queryKeys } from '../query/keys'

export function useAuthMe() {
  return useQuery<User | null>({
    queryKey: queryKeys.auth.me,
    queryFn: fetchMeApi,
    staleTime: 1000 * 60 * 15, // Fresh for 15 minutes
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<User, Error, LoginCredentials>({
    mutationFn: loginApi,
    onSuccess: async (user) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.me })
      queryClient.setQueryData(queryKeys.auth.me, user)
      toast.success('Login successful.')
    },
    onError: (err) => {
      toast.error(err.message || 'Login failed. Please check your credentials.')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, void>({
    mutationFn: logoutApi,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.me })
      queryClient.setQueryData(queryKeys.auth.me, null)
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== 'auth',
      })
    },
    onSuccess: () => {
      toast.success('Logout successful.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to complete logout.')
    },
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me, null)
    },
  })
}


