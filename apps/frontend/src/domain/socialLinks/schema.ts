/*
 * Social Links Domain Validation Schemas
 *
 * Zod validation schemas for SocialLink entity and form payloads.
 */

import { z } from 'zod'

export const SOCIAL_PLATFORMS = [
  'LINKEDIN',
  'GITHUB',
  'PORTFOLIO',
  'TWITTER',
  'INSTAGRAM',
  'FACEBOOK',
  'YOUTUBE',
  'MEDIUM',
  'DEVTO',
  'LEETCODE',
  'CODEFORCES',
  'HACKERRANK',
  'BEHANCE',
  'DRIBBBLE',
  'OTHER',
] as const

export const socialPlatformEnumSchema = z.enum(SOCIAL_PLATFORMS)

export const socialLinkApiSchema = z.object({
  id: z.string(),
  platform: socialPlatformEnumSchema,
  url: z.string(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const socialLinkFormSchema = z.object({
  platform: socialPlatformEnumSchema,
  url: z
    .string()
    .min(1, 'URL is required')
    .max(512, 'URL must not exceed 512 characters')
    .url('Please enter a valid HTTP or HTTPS URL'),
  displayOrder: z.number().min(0, 'Display order must be a positive integer').optional(),
})
