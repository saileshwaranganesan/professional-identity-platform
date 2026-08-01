/*
 * Education Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Education Presentation Model (FSAS-001 §7.2).
 */

import type { Education } from '@/features/education'
import { ApiError } from '@/infrastructure/http'

import { educationApiSchema } from './schema'

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
  const degreeText = dto.fieldOfStudy
    ? `${dto.degree} in ${dto.fieldOfStudy}`
    : dto.degree
  const durationText = dto.endDate
    ? `${dto.startDate} — ${dto.endDate}`
    : dto.startDate

  return {
    id: dto.id,
    degree: degreeText,
    institution: dto.institution,
    duration: durationText,
    ...(dto.grade ? { cgpa: dto.grade } : {}),
    ...(dto.description ? { achievements: [dto.description] } : {}),
  }
}

export function mapEducationList(raw: unknown): Education[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Expected an array of education items from backend',
      undefined,
      raw,
    )
  }
  return raw.map(mapEducation)
}
