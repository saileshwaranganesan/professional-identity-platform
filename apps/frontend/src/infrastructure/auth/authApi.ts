/*
 * Auth Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for authentication endpoints.
 */

import { mapUser, type LoginCredentials, type User } from '@/domain/auth'
import { httpClient } from '@/infrastructure/http'

export async function loginApi(credentials: LoginCredentials): Promise<User> {
  const response = await httpClient.post<unknown>('/auth/login', credentials)
  return mapUser(response.data)
}

export async function logoutApi(): Promise<void> {
  await httpClient.post('/auth/logout')
}

export async function fetchMeApi(): Promise<User | null> {
  try {
    const response = await httpClient.get<unknown>('/auth/me')
    return mapUser(response.data)
  } catch {
    return null
  }
}
