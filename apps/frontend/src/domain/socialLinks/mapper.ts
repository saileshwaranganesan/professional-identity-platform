/*
 * Social Links Domain Mapper
 *
 * Maps raw backend DTO payloads to strongly typed SocialLink domain entities.
 */

import { z } from 'zod'

import { socialLinkApiSchema } from './schema'
import type { SocialLink } from './types'

export function mapSocialLink(data: unknown): SocialLink {
  const parsed = socialLinkApiSchema.parse(data)
  return {
    id: parsed.id,
    platform: parsed.platform,
    url: parsed.url,
    displayOrder: parsed.displayOrder,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
  }
}

export function mapSocialLinksList(data: unknown): SocialLink[] {
  return z.array(z.unknown()).parse(data).map(mapSocialLink)
}
