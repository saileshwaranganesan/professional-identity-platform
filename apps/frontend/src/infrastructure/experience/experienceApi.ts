/*
 * Experience Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for experiences REST API endpoints.
 */

import {
  mapExperience,
  mapExperiencesList,
  type CreateExperienceFormData,
  type Experience,
  type UpdateExperienceFormData,
} from '@/domain/experience'
import { httpClient } from '@/infrastructure/http'

export async function fetchExperiencesApi(): Promise<Experience[]> {
  const response = await httpClient.get<unknown>('/experiences')
  return mapExperiencesList(response.data)
}

export async function createExperienceApi(
  payload: CreateExperienceFormData,
): Promise<Experience> {
  const response = await httpClient.post<unknown>('/experiences', payload)
  return mapExperience(response.data)
}

export async function updateExperienceApi(
  id: string,
  payload: UpdateExperienceFormData,
): Promise<Experience> {
  const response = await httpClient.put<unknown>(`/experiences/${id}`, payload)
  return mapExperience(response.data)
}

export async function deleteExperienceApi(id: string): Promise<void> {
  await httpClient.delete(`/experiences/${id}`)
}
