/*
 * Social Links Domain Types
 *
 * Domain representation of SocialLink entities and form payloads.
 */

import type { z } from 'zod'

import type { socialLinkApiSchema, socialLinkFormSchema, socialPlatformEnumSchema } from './schema'

export type SocialPlatform = z.infer<typeof socialPlatformEnumSchema>

export type SocialLinkApiEntity = z.infer<typeof socialLinkApiSchema>

export interface SocialLink {
  id: string
  platform: SocialPlatform
  url: string
  displayOrder?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type CreateSocialLinkFormData = z.infer<typeof socialLinkFormSchema>
export type UpdateSocialLinkFormData = z.infer<typeof socialLinkFormSchema>
