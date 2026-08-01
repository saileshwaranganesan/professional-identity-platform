/*
 * Projects REST API Schema
 *
 * Defines the Zod contract schema for backend ProjectResponse entities (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const projectApiSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveDemoUrl: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  technologies: z.union([z.array(z.string()), z.string()]).optional().default([]),
})
