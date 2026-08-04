/*
 * Portfolio Infrastructure Transport API
 *
 * Layer 1 (Infrastructure) HTTP transport functions for public portfolio endpoints.
 */

import { mapPortfolioData, type PortfolioData } from '@/domain/portfolio'
import { mapProject, type Project } from '@/domain/projects'
import { httpClient } from '@/infrastructure/http'

export async function fetchPublicPortfolioApi(username: string): Promise<PortfolioData> {
  const response = await httpClient.get<unknown>(`/public/${username}`)
  return mapPortfolioData(response.data)
}

export async function fetchProjectBySlugApi(slug: string): Promise<Project> {
  const response = await httpClient.get<unknown>(`/projects/${slug}`)
  return mapProject(response.data)
}
