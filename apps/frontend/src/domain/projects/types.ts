/*
 * Projects Domain Types
 *
 * Domain representation of Project entities and form payloads (FSAS-001 §5.2).
 */

import type { z } from 'zod'

import type { projectApiSchema, projectFormSchema, projectSummarySchema } from './schema'

export type ProjectApiEntity = z.infer<typeof projectApiSchema>
export type ProjectSummaryEntity = z.infer<typeof projectSummarySchema>

export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'
export type BlockType = 'MARKDOWN' | 'GALLERY' | 'TIMELINE' | 'METRICS' | 'TECH_STACK' | 'VIDEO'

export interface ProjectBlock {
  id: string
  blockType: BlockType
  displayOrder: number
  payload: Record<string, any>
}

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
  role?: string | null
  duration?: string | null
  teamSize?: number | null
  technologies: string[]
  blocks: ProjectBlock[]
  highlights: string[]
}

export interface ProjectSummary {
  title: string
  slug: string
  headline?: string | null
  shortDescription?: string | null
  featured: boolean
  status: ProjectStatus
  highlights: string[]
}

export type CreateProjectFormData = z.infer<typeof projectFormSchema>
export type UpdateProjectFormData = z.infer<typeof projectFormSchema>
