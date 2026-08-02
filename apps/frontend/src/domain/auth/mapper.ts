/*
 * Auth Entity Mapper
 *
 * Validates backend user DTO payload via Zod and transforms to Auth User domain entity.
 */

import { ApiError } from '@/infrastructure/http'

import { userApiSchema } from './schema'
import type { User } from './types'

export function mapUser(raw: unknown): User {
  const result = userApiSchema.safeParse(raw)
  if (!result.success) {
    throw new ApiError(
      'VALIDATION_ERROR',
      'Failed to parse user response from backend',
      undefined,
      result.error.format(),
      result.error,
    )
  }

  const dto = result.data
  return {
    id: dto.id,
    email: dto.email,
    role: dto.role === 'ADMIN' ? 'ADMIN' : 'USER',
    username: dto.username ?? null,
    firstName: dto.firstName ?? null,
    lastName: dto.lastName ?? null,
  }
}
