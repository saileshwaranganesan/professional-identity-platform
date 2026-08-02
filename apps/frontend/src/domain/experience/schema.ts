/*
 * Experience Domain Schemas
 *
 * Defines Zod schemas for REST API contract validation and Create/Edit forms (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const employmentTypeEnum = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'CONTRACT',
  'FREELANCE',
  'SELF_EMPLOYED',
])

export const employmentStatusEnum = z.enum(['CURRENT', 'PREVIOUS'])

export const experienceApiSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  employmentType: employmentTypeEnum,
  employmentStatus: employmentStatusEnum,
  location: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  technologies: z.union([z.array(z.string()), z.string()]).optional().default([]),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  currentlyWorking: z.boolean().default(false),
  companyWebsite: z.string().nullable().optional(),
  companyLogo: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
})

export const experienceFormSchema = z.object({
  company: z
    .string()
    .min(1, 'Company is required')
    .max(200, 'Company cannot exceed 200 characters'),
  position: z
    .string()
    .min(1, 'Position is required')
    .max(200, 'Position cannot exceed 200 characters'),
  employmentType: employmentTypeEnum,
  employmentStatus: employmentStatusEnum,
  location: z.string().max(255, 'Location cannot exceed 255 characters').optional().or(z.literal('')),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional().or(z.literal('')),
  technologies: z.string().max(2000, 'Technologies cannot exceed 2000 characters').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  currentlyWorking: z.boolean().default(false),
  companyWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  companyLogo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  displayOrder: z.number().int().min(0).default(0),
})
