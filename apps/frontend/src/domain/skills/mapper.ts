/*
 * Skills Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Skill Presentation Model (FSAS-001 §7.2).
 */

import type { Skill } from '@/features/skills'
import { ApiError } from '@/infrastructure/http'

import { skillApiSchema } from './schema'

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

  let categoryGroup: Skill['category'] = 'Backend'
  if (
    ['Frontend', 'Backend', 'Database', 'DevOps & Tools'].includes(dto.category)
  ) {
    categoryGroup = dto.category as Skill['category']
  }

  let proficiencyLevel: Skill['proficiency'] = undefined
  if (dto.level) {
    const lvl = dto.level.toUpperCase()
    if (lvl.includes('EXPERT')) proficiencyLevel = 'Expert'
    else if (lvl.includes('ADVANCED') || lvl.includes('INTERMEDIATE'))
      proficiencyLevel = 'Advanced'
    else proficiencyLevel = 'Proficient'
  }

  return {
    id: dto.id,
    name: dto.name,
    category: categoryGroup,
    ...(proficiencyLevel ? { proficiency: proficiencyLevel } : {}),
    featured: true,
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
