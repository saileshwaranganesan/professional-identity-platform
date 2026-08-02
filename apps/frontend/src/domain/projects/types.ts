/*
 * Projects Domain Types
 *
 * Domain representation of Project entities and form payloads (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { projectApiSchema, projectFormSchema } from './schema'

export type ProjectApiEntity = z.infer<typeof projectApiSchema>

export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

export interface Project {
  id: string
  title: string
  slug: string
  headline?: string | null
  shortDescription?: string | null
  description: string
  githubUrl?: string | null
  liveUrl?: string | null
  documentationUrl?: string | null
  featured: boolean
  published: boolean
  status: ProjectStatus
  impact?: string | null
  startDate?: string | null
  endDate?: string | null
  technologies: string[]
}

export type CreateProjectFormData = z.infer<typeof projectFormSchema>
export type UpdateProjectFormData = z.infer<typeof projectFormSchema>
