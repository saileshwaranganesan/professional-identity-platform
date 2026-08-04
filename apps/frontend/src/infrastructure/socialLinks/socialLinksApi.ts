/*
 * Social Links Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for social links REST API endpoints.
 */

import {
  mapSocialLink,
  mapSocialLinksList,
  type CreateSocialLinkFormData,
  type SocialLink,
  type UpdateSocialLinkFormData,
} from '@/domain/socialLinks'
import { httpClient } from '@/infrastructure/http'

export async function fetchSocialLinksApi(): Promise<SocialLink[]> {
  const response = await httpClient.get<unknown>('/social-links')
  return mapSocialLinksList(response.data)
}

export async function createSocialLinkApi(
  payload: CreateSocialLinkFormData,
): Promise<SocialLink> {
  const response = await httpClient.post<unknown>('/social-links', payload)
  return mapSocialLink(response.data)
}

export async function updateSocialLinkApi(
  id: string,
  payload: UpdateSocialLinkFormData,
): Promise<SocialLink> {
  const response = await httpClient.put<unknown>(`/social-links/${id}`, payload)
  return mapSocialLink(response.data)
}

export async function deleteSocialLinkApi(id: string): Promise<void> {
  await httpClient.delete(`/social-links/${id}`)
}
