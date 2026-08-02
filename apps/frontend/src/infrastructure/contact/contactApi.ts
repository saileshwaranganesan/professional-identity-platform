/*
 * Contact Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for visitor contact form API endpoint.
 */

import type { CreateContactFormData } from '@/domain/contact'
import type { Message } from '@/domain/messages'
import { mapMessage } from '@/domain/messages'
import { httpClient } from '@/infrastructure/http'

export async function submitContactMessageApi(
  payload: CreateContactFormData,
): Promise<Message> {
  const response = await httpClient.post<unknown>('/contact', payload)
  return mapMessage(response.data)
}