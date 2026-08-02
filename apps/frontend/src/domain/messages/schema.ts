/*
 * Messages Domain Schemas
 *
 * Defines Zod schemas for REST API contract validation (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const messageStatusEnum = z.enum(['UNREAD', 'READ', 'ARCHIVED'])

export const messageApiSchema = z.object({
  id: z.string(),
  senderName: z.string(),
  senderEmail: z.string().email(),
  subject: z.string(),
  content: z.string(),
  status: messageStatusEnum.default('UNREAD'),
  createdAt: z.string(),
})