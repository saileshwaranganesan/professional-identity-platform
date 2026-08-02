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

export const contactFormSchema = z.object({
  senderName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  senderEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject cannot exceed 200 characters'),
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(5000, 'Message cannot exceed 5000 characters'),
})