/*
 * Messages Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Message domain model (FSAS-001 §7.2).
 */

import { ApiError } from '@/infrastructure/http'

import { messageApiSchema } from './schema'
import type { Message } from './types'

export function mapMessage(raw: unknown): Message {
  const result = messageApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse message payload from backend',
      undefined,
      result.error.format(),
      result.error,
    )
  }

  const dto = result.data

  return {
    id: dto.id,
    senderName: dto.senderName,
    senderEmail: dto.senderEmail,
    subject: dto.subject,
    content: dto.content,
    status: dto.status,
    createdAt: dto.createdAt,
  }
}

export function mapMessagesList(raw: unknown): Message[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Expected an array of messages from backend',
      undefined,
      raw,
    )
  }
  return raw.map(mapMessage)
}