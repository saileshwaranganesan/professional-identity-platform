/*
 * Contact Application Query Hooks
 *
 * Exposes useContact server state hook and useSubmitContactMessage mutation hook (FSAS-001 §5.3).
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type { CreateContactFormData } from '@/domain/contact'
import type { Message } from '@/domain/messages'
import { mockContact, type ContactInfo } from '@/features/contact'
import { submitContactMessageApi } from '@/infrastructure/contact'

import { queryKeys } from '../query/keys'

export function useContact() {
  return useQuery<ContactInfo>({
    queryKey: queryKeys.contact.all,
    queryFn: async () => Promise.resolve(mockContact),
  })
}

export function useSubmitContactMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Message, Error, CreateContactFormData>({
    mutationFn: submitContactMessageApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.all })
      toast.success('Message sent successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send message. Please try again.')
    },
  })
}