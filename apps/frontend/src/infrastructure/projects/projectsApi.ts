/*
 * Projects Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for projects REST API endpoints.
 */

import {
  mapProject,
  mapProjectsList,
  type CreateProjectFormData,
  type Project,
  type UpdateProjectFormData,
} from '@/domain/projects'
import { httpClient } from '@/infrastructure/http'

export async function fetchProjectsApi(): Promise<Project[]> {
  const response = await httpClient.get<unknown>('/projects')
  return mapProjectsList(response.data)
}

export async function createProjectApi(
  payload: CreateProjectFormData,
): Promise<Project> {
  const response = await httpClient.post<unknown>('/projects', payload)
  return mapProject(response.data)
}

export async function updateProjectApi(
  id: string,
  payload: UpdateProjectFormData,
): Promise<Project> {
  const response = await httpClient.put<unknown>(`/projects/${id}`, payload)
  return mapProject(response.data)
}

export async function deleteProjectApi(id: string): Promise<void> {
  await httpClient.delete(`/projects/${id}`)
}

export async function togglePublishProjectApi(
  id: string,
  published: boolean,
): Promise<Project> {
  const response = await httpClient.patch<unknown>(
    `/projects/${id}/publish?published=${published}`,
  )
  return mapProject(response.data)
}

export async function toggleFeatureProjectApi(
  id: string,
  featured: boolean,
): Promise<Project> {
  const response = await httpClient.patch<unknown>(
    `/projects/${id}/feature?featured=${featured}`,
  )
  return mapProject(response.data)
}
