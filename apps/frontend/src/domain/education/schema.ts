/*
 * Education REST API Schema
 *
 * Defines the Zod contract schema for backend EducationResponse entities (FSAS-001 §5.2).
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
})
