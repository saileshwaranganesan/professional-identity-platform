/*
 * Achievements Domain Mapper
 *
 * Maps raw backend DTO payloads to strongly typed Achievement domain entities.
 */

import { z } from 'zod'

import { achievementApiSchema } from './schema'
import type { Achievement } from './types'

export function mapAchievement(data: unknown): Achievement {
  const parsed = achievementApiSchema.parse(data)
  return {
    id: parsed.id,
    title: parsed.title,
    organization: parsed.organization,
    achievementDate: parsed.achievementDate,
    description: parsed.description,
    achievementUrl: parsed.achievementUrl,
    displayOrder: parsed.displayOrder,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
  }
}

export function mapAchievementsList(data: unknown): Achievement[] {
  return z.array(z.unknown()).parse(data).map(mapAchievement)
}
