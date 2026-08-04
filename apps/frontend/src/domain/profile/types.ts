/*
 * Profile Domain Types
 *
 * Domain types for Profile entity and update form payloads.
 */

import type { z } from 'zod'

import type { profileApiSchema, updateProfileFormSchema } from './schema'

export type ProfileApiEntity = z.infer<typeof profileApiSchema>

export interface Profile {
  id: string
  username: string
  firstName?: string | null | undefined
  lastName?: string | null | undefined
  headline?: string | null | undefined
  bio?: string | null | undefined
  location?: string | null | undefined
  website?: string | null | undefined
  phone?: string | null | undefined
  profileImagePath?: string | null | undefined
  bannerImagePath?: string | null | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>
