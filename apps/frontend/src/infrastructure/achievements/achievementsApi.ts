/*
 * Achievements Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for achievements REST API endpoints.
 */

import {
  mapAchievement,
  mapAchievementsList,
  type Achievement,
  type CreateAchievementFormData,
  type UpdateAchievementFormData,
} from '@/domain/achievements'
import { httpClient } from '@/infrastructure/http'

export async function fetchAchievementsApi(): Promise<Achievement[]> {
  const response = await httpClient.get<unknown>('/achievements')
  return mapAchievementsList(response.data)
}

export async function createAchievementApi(
  payload: CreateAchievementFormData,
): Promise<Achievement> {
  const response = await httpClient.post<unknown>('/achievements', payload)
  return mapAchievement(response.data)
}

export async function updateAchievementApi(
  id: string,
  payload: UpdateAchievementFormData,
): Promise<Achievement> {
  const response = await httpClient.put<unknown>(`/achievements/${id}`, payload)
  return mapAchievement(response.data)
}

export async function deleteAchievementApi(id: string): Promise<void> {
  await httpClient.delete(`/achievements/${id}`)
}
