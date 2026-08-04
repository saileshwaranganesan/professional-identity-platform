/*
 * Profile Application Server State Hooks
 *
 * TanStack Query hooks for Profile retrieval and updates.
 * Connected to Layer 1 profileApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type { Profile, UpdateProfileFormData } from '@/domain/profile'
import { fetchProfileApi, updateProfileApi } from '@/infrastructure/profile'

import { queryKeys } from '../query/keys'

export function useProfile() {
  return useQuery<Profile>({
    queryKey: queryKeys.profile.me,
    queryFn: fetchProfileApi,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Profile, Error, UpdateProfileFormData>({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile.me })
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
      toast.success('Profile updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile.')
    },
  })
}
