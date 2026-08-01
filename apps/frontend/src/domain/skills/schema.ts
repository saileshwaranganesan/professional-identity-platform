/*
 * Skills REST API Schema
 *
 * Defines the Zod contract schema for backend SkillResponse entities (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const skillApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().default('Backend'),
  level: z.string().nullable().optional(),
})
