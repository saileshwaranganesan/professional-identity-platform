/*
 * Profile Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for profile REST API endpoints.
 */

import { mapProfile, type Profile, type UpdateProfileFormData } from '@/domain/profile'
import { httpClient } from '@/infrastructure/http'

export async function fetchProfileApi(): Promise<Profile> {
  const response = await httpClient.get<unknown>('/profile')
  return mapProfile(response.data)
}

export async function updateProfileApi(
  payload: UpdateProfileFormData,
): Promise<Profile> {
  const response = await httpClient.put<unknown>('/profile', payload)
  return mapProfile(response.data)
}
