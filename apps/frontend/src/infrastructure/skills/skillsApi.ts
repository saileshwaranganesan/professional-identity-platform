/*
 * Skills Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for skills REST API endpoints.
 */

import {
  mapSkill,
  mapSkillsList,
  type CreateSkillFormData,
  type Skill,
  type UpdateSkillFormData,
} from '@/domain/skills'
import { httpClient } from '@/infrastructure/http'

export async function fetchSkillsApi(): Promise<Skill[]> {
  const response = await httpClient.get<unknown>('/skills')
  return mapSkillsList(response.data)
}

export async function createSkillApi(
  payload: CreateSkillFormData,
): Promise<Skill> {
  const response = await httpClient.post<unknown>('/skills', payload)
  return mapSkill(response.data)
}

export async function updateSkillApi(
  id: string,
  payload: UpdateSkillFormData,
): Promise<Skill> {
  const response = await httpClient.put<unknown>(`/skills/${id}`, payload)
  return mapSkill(response.data)
}

export async function deleteSkillApi(id: string): Promise<void> {
  await httpClient.delete(`/skills/${id}`)
}