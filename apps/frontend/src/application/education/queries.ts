/*
 * Education Application Server State Hooks
 *
 * TanStack Query hooks for education CRUD operations.
 * Connected to Layer 1 educationApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
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
  const toast = useToast()

  return useMutation<Education, Error, CreateEducationFormData>({
    mutationFn: createEducationApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.education.all })
      toast.success('Education entry created successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create education entry.')
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Education, Error, { id: string; data: UpdateEducationFormData }>({
    mutationFn: ({ id, data }) => updateEducationApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.education.all })
      toast.success('Education entry updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update education entry.')
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteEducationApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.education.all })
      toast.success('Education entry deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete education entry.')
    },
  })
}