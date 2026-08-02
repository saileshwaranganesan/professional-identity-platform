/*
 * Projects Entity Mapper
 *
 * Validates backend payload via Zod and transforms to Project Domain Entity.
 */

import { ApiError } from '@/infrastructure/http'

import { projectApiSchema } from './schema'
import type { Project } from './types'

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
    slug: dto.slug,
    headline: dto.headline ?? null,
    shortDescription: dto.shortDescription ?? null,
    description: dto.description ?? dto.shortDescription ?? '',
    technologies: techArray,
    githubUrl: dto.githubUrl ?? null,
    liveUrl: dto.liveDemoUrl ?? null,
    documentationUrl: dto.documentationUrl ?? null,
    featured: dto.featured,
    published: dto.published,
    status: dto.status,
    impact: dto.impact ?? null,
    startDate: dto.startDate ?? null,
    endDate: dto.endDate ?? null,
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
