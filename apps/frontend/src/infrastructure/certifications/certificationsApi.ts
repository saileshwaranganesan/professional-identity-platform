/*
 * Certifications Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for certifications REST API endpoints.
 */

import {
  mapCertification,
  mapCertificationsList,
  type Certification,
  type CreateCertificationFormData,
  type UpdateCertificationFormData,
} from '@/domain/certifications'
import { httpClient } from '@/infrastructure/http'

export async function fetchCertificationsApi(): Promise<Certification[]> {
  const response = await httpClient.get<unknown>('/certifications')
  return mapCertificationsList(response.data)
}

export async function createCertificationApi(
  payload: CreateCertificationFormData,
): Promise<Certification> {
  const response = await httpClient.post<unknown>('/certifications', payload)
  return mapCertification(response.data)
}

export async function updateCertificationApi(
  id: string,
  payload: UpdateCertificationFormData,
): Promise<Certification> {
  const response = await httpClient.put<unknown>(`/certifications/${id}`, payload)
  return mapCertification(response.data)
}

export async function deleteCertificationApi(id: string): Promise<void> {
  await httpClient.delete(`/certifications/${id}`)
}
