/*
 * Skills Domain Types
 *
 * Inferred backend entity type derived from Zod schema (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { skillApiSchema } from './schema'

export type SkillApiEntity = z.infer<typeof skillApiSchema>
