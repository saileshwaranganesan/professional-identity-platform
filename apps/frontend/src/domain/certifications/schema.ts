/*
 * Certifications Domain Validation Schemas
 *
 * Zod validation schemas for Certification entity and form payloads.
 */

import { z } from 'zod'

export const certificationApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuingOrganization: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().nullable().optional(),
  credentialId: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional(),
  doesNotExpire: z.boolean(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const certificationFormSchema = z
  .object({
    name: z.string().min(1, 'Certification name is required').max(255, 'Name must not exceed 255 characters'),
    issuingOrganization: z
      .string()
      .min(1, 'Issuing organization is required')
      .max(255, 'Organization name must not exceed 255 characters'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().optional().or(z.literal('')),
    credentialId: z.string().max(255, 'Credential ID must not exceed 255 characters').optional().or(z.literal('')),
    credentialUrl: z.string().max(512, 'Credential URL must not exceed 512 characters').optional().or(z.literal('')),
    doesNotExpire: z.boolean(),
    displayOrder: z.number().min(0, 'Display order must be a positive integer').optional(),
  })
  .refine(
    (data) => {
      if (!data.doesNotExpire && !data.expiryDate) {
        return false
      }
      return true
    },
    {
      message: 'Expiry date is required if the certification expires',
      path: ['expiryDate'],
    },
  )
