/*
 * Auth Domain Validation Schemas
 *
 * Zod schemas for login form validation and backend user DTO parsing.
 */

import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const userApiSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.string(),
  username: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
})

export type UserApiEntity = z.infer<typeof userApiSchema>
