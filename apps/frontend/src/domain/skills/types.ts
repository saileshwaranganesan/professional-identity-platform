/*
 * Skills Domain Types
 *
 * Domain representation of Skill entities and form payloads (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type {
  skillApiSchema,
  skillFormSchema,
  skillLevelEnum,
} from './schema'

export type SkillApiEntity = z.infer<typeof skillApiSchema>

export type SkillLevel = z.infer<typeof skillLevelEnum>

export interface Skill {
  id: string
  name: string
  level: SkillLevel
  category?: string | null | undefined
  displayOrder: number
  createdAt?: string | null | undefined
  updatedAt?: string | null | undefined
}

export type CreateSkillFormData = z.infer<typeof skillFormSchema>
export type UpdateSkillFormData = z.infer<typeof skillFormSchema>