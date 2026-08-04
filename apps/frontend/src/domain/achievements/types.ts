/*
 * Achievements Domain Types
 *
 * Domain representation of Achievement entities and form payloads.
 */

import type { z } from 'zod'

import type { achievementApiSchema, achievementFormSchema } from './schema'

export type AchievementApiEntity = z.infer<typeof achievementApiSchema>

export interface Achievement {
  id: string
  title: string
  organization?: string | null | undefined
  achievementDate?: string | null | undefined
  description?: string | null | undefined
  achievementUrl?: string | null | undefined
  displayOrder?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type CreateAchievementFormData = z.infer<typeof achievementFormSchema>
export type UpdateAchievementFormData = z.infer<typeof achievementFormSchema>
