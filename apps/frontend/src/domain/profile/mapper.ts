/*
 * Profile Domain Mapper
 *
 * Maps raw backend DTO payloads to strongly typed Profile domain entities.
 */

import { profileApiSchema } from './schema'
import type { Profile } from './types'

export function mapProfile(data: unknown): Profile {
  const parsed = profileApiSchema.parse(data)
  return {
    id: parsed.id,
    username: parsed.username,
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    headline: parsed.headline,
    bio: parsed.bio,
    location: parsed.location,
    website: parsed.website,
    phone: parsed.phone,
    profileImagePath: parsed.profileImagePath,
    bannerImagePath: parsed.bannerImagePath,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
  }
}
