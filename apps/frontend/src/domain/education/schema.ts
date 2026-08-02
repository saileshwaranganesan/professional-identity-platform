/*
 * Education Domain Schemas
 *
 * Defines Zod schemas for REST API contract validation and Create/Edit forms (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const educationApiSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  currentlyStudying: z.boolean().default(false),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})

export const educationFormSchema = z.object({
  institution: z
    .string()
    .min(1, 'Institution is required')
    .max(200, 'Institution cannot exceed 200 characters'),
  degree: z
    .string()
    .min(1, 'Degree is required')
    .max(200, 'Degree cannot exceed 200 characters'),
  fieldOfStudy: z
    .string()
    .max(200, 'Field of study cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  grade: z
    .string()
    .max(100, 'Grade cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional()
    .or(z.literal('')),
  currentlyStudying: z.boolean().default(false),
})