/*
 * Messages Domain Types
 *
 * Domain representation of Contact Message entities (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { messageApiSchema, messageStatusEnum } from './schema'

export type MessageApiEntity = z.infer<typeof messageApiSchema>

export type MessageStatus = z.infer<typeof messageStatusEnum>

export interface Message {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  content: string
  status: MessageStatus
  createdAt: string
}