/*
 * Experience Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Experience domain model (FSAS-001 §7.2).
 */

import { ApiError } from '@/infrastructure/http'

import { experienceApiSchema } from './schema'
import type { Experience } from './types'

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
      : (dto.technologies ?? [])

  return {
    id: dto.id,
    company: dto.company,
    position: dto.position,
    employmentType: dto.employmentType,
    employmentStatus: dto.employmentStatus,
    location: dto.location,
    description: dto.description ?? '',
    technologies: techArray,
    startDate: dto.startDate,
    endDate: dto.endDate,
    currentlyWorking: dto.currentlyWorking,
    companyWebsite: dto.companyWebsite,
    companyLogo: dto.companyLogo,
    displayOrder: dto.displayOrder,
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
