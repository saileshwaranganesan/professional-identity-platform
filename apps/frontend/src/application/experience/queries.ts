/*
 * Experience Application Server State Hooks
 *
 * TanStack Query hooks for experience CRUD operations.
 * Connected to Layer 1 experienceApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type {
  CreateExperienceFormData,
  Experience,
  UpdateExperienceFormData,
} from '@/domain/experience'
import {
  createExperienceApi,
  deleteExperienceApi,
  fetchExperiencesApi,
  updateExperienceApi,
} from '@/infrastructure/experience'

import { queryKeys } from '../query/keys'

export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: queryKeys.experience.all,
    queryFn: fetchExperiencesApi,
  })
}

export function useCreateExperience() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Experience, Error, CreateExperienceFormData>({
    mutationFn: createExperienceApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.experience.all })
      toast.success('Experience created successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create experience.')
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Experience, Error, { id: string; data: UpdateExperienceFormData }>({
    mutationFn: ({ id, data }) => updateExperienceApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.experience.all })
      toast.success('Experience updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update experience.')
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteExperienceApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.experience.all })
      toast.success('Experience deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete experience.')
    },
  })
}

