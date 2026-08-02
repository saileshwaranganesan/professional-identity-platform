/*
 * Education Application Server State Hooks
 *
 * TanStack Query hooks for education CRUD operations.
 * Connected to Layer 1 educationApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  CreateEducationFormData,
  Education,
  UpdateEducationFormData,
} from '@/domain/education'
import {
  createEducationApi,
  deleteEducationApi,
  fetchEducationsApi,
  updateEducationApi,
} from '@/infrastructure/education'

import { queryKeys } from '../query/keys'

export function useEducations() {
  return useQuery<Education[]>({
    queryKey: queryKeys.education.all,
    queryFn: fetchEducationsApi,
  })
}

// Alias for backward compatibility with home.tsx
export const useEducation = useEducations

export function useCreateEducation() {
  const queryClient = useQueryClient()

  return useMutation<Education, Error, CreateEducationFormData>({
    mutationFn: createEducationApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.education.all })
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()

  return useMutation<Education, Error, { id: string; data: UpdateEducationFormData }>({
    mutationFn: ({ id, data }) => updateEducationApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.education.all })
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteEducationApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.education.all })
    },
  })
}