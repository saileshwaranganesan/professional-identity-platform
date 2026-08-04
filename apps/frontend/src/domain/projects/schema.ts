/*
 * Projects Domain Schemas
 *
 * Defines Zod schemas for REST API contract validation and Create/Edit forms (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const projectStatusEnum = z.enum([
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'ARCHIVED',
])

export const blockTypeEnum = z.enum([
  'MARKDOWN',
  'GALLERY',
  'TIMELINE',
  'METRICS',
  'TECH_STACK',
  'VIDEO'
])

export const projectBlockSchema = z.object({
  id: z.string(),
  blockType: blockTypeEnum,
  displayOrder: z.number(),
  payload: z.record(z.string(), z.any()),
})

export const projectApiSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  headline: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveDemoUrl: z.string().nullable().optional(),
  documentationUrl: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  status: projectStatusEnum.default('COMPLETED'),
  impact: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  teamSize: z.number().nullable().optional(),
  technologies: z.union([z.array(z.string()), z.string()]).optional().default([]),
  blocks: z.array(projectBlockSchema).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
})

export const projectSummarySchema = z.object({
  title: z.string(),
  slug: z.string(),
  headline: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  status: projectStatusEnum.default('COMPLETED'),
  highlights: z.array(z.string()).optional().default([]),
})

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug cannot exceed 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly lowercase words separated by hyphens'),
  headline: z.string().max(250, 'Headline cannot exceed 250 characters').optional().or(z.literal('')),
  shortDescription: z.string().max(500, 'Short description cannot exceed 500 characters').optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveDemoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  documentationUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  status: projectStatusEnum.default('COMPLETED'),
  impact: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  duration: z.string().optional().or(z.literal('')),
  teamSize: z.number().optional().nullable(),
  blocks: z.array(z.object({
    id: z.string().optional(),
    blockType: blockTypeEnum,
    displayOrder: z.number(),
    payload: z.record(z.string(), z.any()),
  })).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
})
