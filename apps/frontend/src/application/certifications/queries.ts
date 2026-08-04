/*
 * Certifications Application Server State Hooks
 *
 * TanStack Query hooks for Certifications CRUD.
 * Connected to Layer 1 certificationsApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type {
  Certification,
  CreateCertificationFormData,
  UpdateCertificationFormData,
} from '@/domain/certifications'
import {
  createCertificationApi,
  deleteCertificationApi,
  fetchCertificationsApi,
  updateCertificationApi,
} from '@/infrastructure/certifications'

import { queryKeys } from '../query/keys'

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: queryKeys.certifications.all,
    queryFn: fetchCertificationsApi,
  })
}

export function useCreateCertification() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Certification, Error, CreateCertificationFormData>({
    mutationFn: createCertificationApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.certifications.all })
      toast.success('Certification added successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add certification.')
    },
  })
}

export function useUpdateCertification() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Certification, Error, { id: string; data: UpdateCertificationFormData }>({
    mutationFn: ({ id, data }) => updateCertificationApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.certifications.all })
      toast.success('Certification updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update certification.')
    },
  })
}

export function useDeleteCertification() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteCertificationApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.certifications.all })
      toast.success('Certification deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete certification.')
    },
  })
}
