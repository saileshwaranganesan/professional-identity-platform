/*
 * Education Domain Types
 *
 * Domain representation of Education entities and form payloads (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type {
  educationApiSchema,
  educationFormSchema,
} from './schema'

export type EducationApiEntity = z.infer<typeof educationApiSchema>

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy?: string | null | undefined
  startDate: string
  endDate?: string | null | undefined
  grade?: string | null | undefined
  description?: string | null | undefined
  currentlyStudying: boolean
  createdAt?: string | null | undefined
  updatedAt?: string | null | undefined
}

export type CreateEducationFormData = z.infer<typeof educationFormSchema>
export type UpdateEducationFormData = z.infer<typeof educationFormSchema>