/*
 * Education Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Education domain model (FSAS-001 §7.2).
 */

import { ApiError } from '@/infrastructure/http'

import { educationApiSchema } from './schema'
import type { Education } from './types'

export function mapEducation(raw: unknown): Education {
  const result = educationApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse education payload from backend',
      undefined,
      result.error.format(),
      result.error,
    )
  }

  const dto = result.data

  return {
    id: dto.id,
    institution: dto.institution,
    degree: dto.degree,
    fieldOfStudy: dto.fieldOfStudy,
    startDate: dto.startDate,
    endDate: dto.endDate,
    grade: dto.grade,
    description: dto.description ?? '',
    currentlyStudying: dto.currentlyStudying,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function mapEducationList(raw: unknown): Education[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Expected an array of education records from backend',
      undefined,
      raw,
    )
  }
  return raw.map(mapEducation)
}