/*
 * Experience Domain Types
 *
 * Domain representation of Experience entities and form payloads (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type {
  experienceApiSchema,
  experienceFormSchema,
  employmentTypeEnum,
  employmentStatusEnum,
} from './schema'

export type ExperienceApiEntity = z.infer<typeof experienceApiSchema>

export type EmploymentType = z.infer<typeof employmentTypeEnum>
export type EmploymentStatus = z.infer<typeof employmentStatusEnum>

export interface Experience {
  id: string
  company: string
  position: string
  employmentType: EmploymentType
  employmentStatus: EmploymentStatus
  location?: string | null | undefined
  description: string
  technologies: string[]
  startDate: string
  endDate?: string | null | undefined
  currentlyWorking: boolean
  companyWebsite?: string | null | undefined
  companyLogo?: string | null | undefined
  displayOrder: number
}

export type CreateExperienceFormData = z.infer<typeof experienceFormSchema>
export type UpdateExperienceFormData = z.infer<typeof experienceFormSchema>
