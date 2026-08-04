/*
 * Achievements Domain Validation Schemas
 *
 * Zod validation schemas for Achievement entity and form payloads.
 */

import { z } from 'zod'

export const achievementApiSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string().nullable().optional(),
  achievementDate: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  achievementUrl: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const achievementFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
  organization: z.string().max(255, 'Organization must not exceed 255 characters').optional().or(z.literal('')),
  achievementDate: z.string().optional().or(z.literal('')),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional().or(z.literal('')),
  achievementUrl: z.string().max(512, 'URL must not exceed 512 characters').optional().or(z.literal('')),
  displayOrder: z.number().min(0, 'Display order must be a positive integer').optional(),
})
