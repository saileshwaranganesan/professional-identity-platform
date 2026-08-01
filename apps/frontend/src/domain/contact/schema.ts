/*
 * Contact REST API Schema
 *
 * Defines the Zod contract schema for backend contact entities (FSAS-001 §5.2).
 */

import { z } from 'zod'

export const contactApiSchema = z.object({
  email_address: z.string().email(),
  phone_number: z.string().nullable().optional(),
  location_text: z.string(),
  linkedin_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
})
