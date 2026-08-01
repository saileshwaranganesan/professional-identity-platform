/*
 * Experience REST API Schema
 *
 * Defines the Zod contract schema for backend ExperienceResponse entities (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const experienceApiSchema = z.object({
  id: z.string(),
  position: z.string(),
  company: z.string(),
  location: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  technologies: z.union([z.array(z.string()), z.string()]).optional().default([]),
})
