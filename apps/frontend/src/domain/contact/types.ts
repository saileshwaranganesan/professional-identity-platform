/*
 * Contact Domain Types
 *
 * Inferred backend entity type derived from Zod schema (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { contactApiSchema } from './schema'

export type ContactApiEntity = z.infer<typeof contactApiSchema>
