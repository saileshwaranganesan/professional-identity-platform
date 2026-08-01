/*
 * Contact Entity Mapper
 *
 * Validates backend payload via Zod and transforms to ContactInfo Presentation Model (FSAS-001 §7.2).
 */

import type { ContactInfo } from '@/features/contact'
import { ApiError } from '@/infrastructure/http'

import { contactApiSchema } from './schema'

export function mapContact(raw: unknown): ContactInfo {
  const result = contactApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse contact payload from backend',
      undefined,
      result.error.format(),
      result.error,
    )
  }

  const dto = result.data
  return {
    email: dto.email_address,
    ...(dto.phone_number ? { phone: dto.phone_number } : {}),
    location: dto.location_text,
    ...(dto.linkedin_url ? { linkedInUrl: dto.linkedin_url } : {}),
    ...(dto.github_url ? { githubUrl: dto.github_url } : {}),
  }
}
