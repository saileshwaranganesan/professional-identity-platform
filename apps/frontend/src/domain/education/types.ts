/*
 * Education Domain Types
 *
 * Inferred backend entity type derived from Zod schema (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { educationApiSchema } from './schema'

export type EducationApiEntity = z.infer<typeof educationApiSchema>
