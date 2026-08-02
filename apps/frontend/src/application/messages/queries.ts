/*
 * Messages Application Server State Hooks
 *
 * TanStack Query hooks for contact messages management.
 * Connected to Layer 1 messagesApi transport and Layer 3 domain mappers.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

  return useMutation<Message, Error, { id: string; status: MessageStatus }>({
    mutationFn: ({ id, status }) => updateMessageStatusApi(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.all })
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: deleteMessageApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages.all })
    },
  })
}