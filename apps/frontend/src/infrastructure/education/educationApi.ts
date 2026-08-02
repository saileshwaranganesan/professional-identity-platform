/*
 * Education Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for educations REST API endpoints.
 */

import {
  mapEducation,
  mapEducationList,
  type CreateEducationFormData,
  type Education,
  type UpdateEducationFormData,
} from '@/domain/education'
import { httpClient } from '@/infrastructure/http'

export async function fetchEducationsApi(): Promise<Education[]> {
  const response = await httpClient.get<unknown>('/educations')
  return mapEducationList(response.data)
}

export async function createEducationApi(
  payload: CreateEducationFormData,
): Promise<Education> {
  const response = await httpClient.post<unknown>('/educations', payload)
  return mapEducation(response.data)
}

export async function updateEducationApi(
  id: string,
  payload: UpdateEducationFormData,
): Promise<Education> {
  const response = await httpClient.put<unknown>(`/educations/${id}`, payload)
  return mapEducation(response.data)
}

export async function deleteEducationApi(id: string): Promise<void> {
  await httpClient.delete(`/educations/${id}`)
}