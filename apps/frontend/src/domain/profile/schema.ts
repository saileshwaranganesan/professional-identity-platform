/*
 * Profile Domain Validation Schemas
 *
 * Zod validation schemas for Profile entity and update form payloads.
 */

import { z } from 'zod'

export const profileApiSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  profileImagePath: z.string().nullable().optional(),
  bannerImagePath: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const updateProfileFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(100, 'Username must not exceed 100 characters')
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/,
      'Username must contain only alphanumeric characters, dots, underscores, or hyphens',
    ),
  firstName: z.string().max(100, 'First name must not exceed 100 characters').optional().or(z.literal('')),
  lastName: z.string().max(100, 'Last name must not exceed 100 characters').optional().or(z.literal('')),
  headline: z.string().max(255, 'Headline must not exceed 255 characters').optional().or(z.literal('')),
  bio: z.string().max(5000, 'Bio must not exceed 5000 characters').optional().or(z.literal('')),
  location: z.string().max(255, 'Location must not exceed 255 characters').optional().or(z.literal('')),
  website: z.string().max(512, 'Website URL must not exceed 512 characters').optional().or(z.literal('')),
  phone: z.string().max(50, 'Phone must not exceed 50 characters').optional().or(z.literal('')),
  profileImagePath: z.string().max(512, 'Profile image path must not exceed 512 characters').optional().or(z.literal('')),
  bannerImagePath: z.string().max(512, 'Banner image path must not exceed 512 characters').optional().or(z.literal('')),
})
