/*
 * Certifications Domain Types
 *
 * Domain representation of Certification entities and form payloads.
 */

import type { z } from 'zod'

import type { certificationApiSchema, certificationFormSchema } from './schema'

export type CertificationApiEntity = z.infer<typeof certificationApiSchema>

export interface Certification {
  id: string
  name: string
  issuingOrganization: string
  issueDate: string
  expiryDate?: string | null | undefined
  credentialId?: string | null | undefined
  credentialUrl?: string | null | undefined
  doesNotExpire: boolean
  displayOrder?: number | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}

export type CreateCertificationFormData = z.infer<typeof certificationFormSchema>
export type UpdateCertificationFormData = z.infer<typeof certificationFormSchema>
