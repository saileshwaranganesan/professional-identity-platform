/*
 * Projects Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Project Presentation Model (FSAS-001 §7.2).
 */

import type { Project } from '@/features/projects'
import { ApiError } from '@/infrastructure/http'

import { projectApiSchema } from './schema'

export function mapProject(raw: unknown): Project {
  const result = projectApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse project payload from backend',
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
    title: dto.title,
    description: dto.description ?? dto.shortDescription ?? '',
    technologies: techArray,
    ...(dto.githubUrl ? { githubUrl: dto.githubUrl } : {}),
    ...(dto.liveDemoUrl ? { liveUrl: dto.liveDemoUrl } : {}),
    featured: dto.featured,
  }
}

export function mapProjectsList(raw: unknown): Project[] {
  if (!Array.isArray(raw)) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Expected an array of projects from backend',
      undefined,
      raw,
    )
  }
  return raw.map(mapProject)
}
