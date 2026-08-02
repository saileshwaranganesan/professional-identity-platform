/*
 * Skills Domain Schemas
 *
 * Defines Zod schemas for REST API contract validation and Create/Edit forms (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const skillLevelEnum = z.enum([
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
])

export const skillApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: skillLevelEnum,
  category: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})

export const skillFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(100, 'Skill name cannot exceed 100 characters'),
  level: skillLevelEnum,
  category: z
    .string()
    .max(100, 'Category cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  displayOrder: z.number().int().min(0, 'Display order must be 0 or positive').default(0),
})