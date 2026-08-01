/*
 * Projects Domain Types
 *
 * Inferred backend entity type derived from Zod schema (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { projectApiSchema } from './schema'

export type ProjectApiEntity = z.infer<typeof projectApiSchema>
