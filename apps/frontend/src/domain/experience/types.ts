/*
 * Experience Domain Types
 *
 * Inferred backend entity type derived from Zod schema (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { experienceApiSchema } from './schema'

export type ExperienceApiEntity = z.infer<typeof experienceApiSchema>
