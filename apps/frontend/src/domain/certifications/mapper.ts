/*
 * Certifications Domain Mapper
 *
 * Maps raw backend DTO payloads to strongly typed Certification domain entities.
 */

import { z } from 'zod'

import { certificationApiSchema } from './schema'
import type { Certification } from './types'

export function mapCertification(data: unknown): Certification {
  const parsed = certificationApiSchema.parse(data)
  return {
    id: parsed.id,
    name: parsed.name,
    issuingOrganization: parsed.issuingOrganization,
    issueDate: parsed.issueDate,
    expiryDate: parsed.expiryDate,
    credentialId: parsed.credentialId,
    credentialUrl: parsed.credentialUrl,
    doesNotExpire: parsed.doesNotExpire,
    displayOrder: parsed.displayOrder,
    createdAt: parsed.createdAt,
    updatedAt: parsed.updatedAt,
  }
}

export function mapCertificationsList(data: unknown): Certification[] {
  return z.array(z.unknown()).parse(data).map(mapCertification)
}
