/*
 * Experience Application Server State Hooks
 *
 * TanStack Query hooks for experience CRUD operations.
 * Connected to Layer 1 experienceApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

  return useMutation<Experience, Error, CreateExperienceFormData>({
    mutationFn: createExperienceApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.experience.all })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()

  return useMutation<Experience, Error, { id: string; data: UpdateExperienceFormData }>({
    mutationFn: ({ id, data }) => updateExperienceApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.experience.all })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteExperienceApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.experience.all })
    },
  })
}
