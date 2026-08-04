/*
 * Achievements Application Server State Hooks
 *
 * TanStack Query hooks for Achievements CRUD.
 * Connected to Layer 1 achievementsApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type {
  Achievement,
  CreateAchievementFormData,
  UpdateAchievementFormData,
} from '@/domain/achievements'
import {
  createAchievementApi,
  deleteAchievementApi,
  fetchAchievementsApi,
  updateAchievementApi,
} from '@/infrastructure/achievements'

import { queryKeys } from '../query/keys'

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: queryKeys.achievements.all,
    queryFn: fetchAchievementsApi,
  })
}

export function useCreateAchievement() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Achievement, Error, CreateAchievementFormData>({
    mutationFn: createAchievementApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all })
      toast.success('Achievement added successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add achievement.')
    },
  })
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Achievement, Error, { id: string; data: UpdateAchievementFormData }>({
    mutationFn: ({ id, data }) => updateAchievementApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all })
      toast.success('Achievement updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update achievement.')
    },
  })
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteAchievementApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all })
      toast.success('Achievement deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete achievement.')
    },
  })
}
