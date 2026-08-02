/*
 * Messages Application Server State Hooks
 *
 * TanStack Query hooks for contact messages management.
 * Connected to Layer 1 messagesApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/Toast'
import type { Message, MessageStatus } from '@/domain/messages'
import {
  deleteMessageApi,
  fetchMessagesApi,
  updateMessageStatusApi,
} from '@/infrastructure/messages'

import { queryKeys } from '../query/keys'

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: queryKeys.messages.all,
    queryFn: fetchMessagesApi,
  })
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<Message, Error, { id: string; status: MessageStatus }>({
    mutationFn: ({ id, status }) => updateMessageStatusApi(id, status),
    onSuccess: (message) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.all })
      toast.success(message.status === 'READ' ? 'Message marked as read.' : 'Message marked as unread.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update message status.')
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation<void, Error, string>({
    mutationFn: deleteMessageApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.all })
      toast.success('Message deleted successfully.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete message.')
    },
  })
}