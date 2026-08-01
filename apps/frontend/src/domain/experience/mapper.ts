/*
 * Experience Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Experience Presentation Model (FSAS-001 §7.2).
 */

import type { Experience } from '@/features/experience'
import { ApiError } from '@/infrastructure/http'

import { experienceApiSchema } from './schema'

export function mapExperience(raw: unknown): Experience {
  const result = experienceApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse experience payload from backend',
      undefined,
      result.error.format(),
      result.error,
    )
  }

  const dto = result.data
  const techArray =
    typeof dto.technologies === 'string'
      ? dto.technologies
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : dto.technologies

  return {
    id: dto.id,
    role: dto.position,
    company: dto.company,
    ...(dto.location ? { location: dto.location } : {}),
    startDate: dto.startDate,
    ...(dto.endDate ? { endDate: dto.endDate } : {}),
    description: dto.description ?? '',
    technologies: techArray,
  }
}

export function mapExperiencesList(raw: unknown): Experience[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Expected an array of experiences from backend',
      undefined,
      raw,
    )
  }
  return raw.map(mapExperience)
}
