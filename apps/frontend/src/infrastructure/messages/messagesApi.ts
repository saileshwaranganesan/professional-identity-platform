/*
 * Messages Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for contact messages REST API endpoints.
 */

import {
  mapMessage,
  mapMessagesList,
  type Message,
  type MessageStatus,
} from '@/domain/messages'
import { httpClient } from '@/infrastructure/http'

export async function fetchMessagesApi(): Promise<Message[]> {
  const response = await httpClient.get<unknown>('/messages')
  return mapMessagesList(response.data)
}

export async function updateMessageStatusApi(
  id: string,
  status: MessageStatus,
): Promise<Message> {
  const response = await httpClient.patch<unknown>(`/messages/${id}/status`, { status })
  return mapMessage(response.data)
}

export async function deleteMessageApi(id: string): Promise<void> {
  await httpClient.delete(`/messages/${id}`)
}