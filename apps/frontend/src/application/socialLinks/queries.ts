/*
 * Social Links Application Server State Hooks
 *
 * TanStack Query hooks for SocialLinks CRUD.
 * Connected to Layer 1 socialLinksApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type {
  CreateSocialLinkFormData,
  SocialLink,
  UpdateSocialLinkFormData,
} from '@/domain/socialLinks'
import {
  createSocialLinkApi,
  deleteSocialLinkApi,
  fetchSocialLinksApi,
  updateSocialLinkApi,
} from '@/infrastructure/socialLinks'

import { queryKeys } from '../query/keys'

export function useSocialLinks() {
  return useQuery<SocialLink[]>({
    queryKey: queryKeys.socialLinks.all,
    queryFn: fetchSocialLinksApi,
  })
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<SocialLink, Error, CreateSocialLinkFormData>({
    mutationFn: createSocialLinkApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.socialLinks.all })
      toast.success('Social link added successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add social link.')
    },
  })
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<SocialLink, Error, { id: string; data: UpdateSocialLinkFormData }>({
    mutationFn: ({ id, data }) => updateSocialLinkApi(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.socialLinks.all })
      toast.success('Social link updated successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update social link.')
    },
  })
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteSocialLinkApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.socialLinks.all })
      toast.success('Social link deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete social link.')
    },
  })
}
