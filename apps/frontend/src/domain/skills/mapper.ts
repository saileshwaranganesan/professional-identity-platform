/*
 * Skills Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Skill domain model (FSAS-001 §7.2).
 */

import { ApiError } from '@/infrastructure/http'

import { skillApiSchema } from './schema'
import type { Skill } from './types'

export function mapSkill(raw: unknown): Skill {
  const result = skillApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse skill payload from backend',
      undefined,
      result.error.format(),
      result.error,
    )
  }

  const dto = result.data

  return {
    id: dto.id,
    name: dto.name,
    level: dto.level,
    category: dto.category ?? '',
    displayOrder: dto.displayOrder,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function mapSkillsList(raw: unknown): Skill[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Expected an array of skills from backend',
      undefined,
      raw,
    )
  }
  return raw.map(mapSkill)
}