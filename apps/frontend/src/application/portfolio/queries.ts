/*
 * Portfolio Application Hooks
 *
 * TanStack Query hooks for public portfolio and project detail endpoints.
 */

import { useQuery } from '@tanstack/react-query'

import type { PortfolioData } from '@/domain/portfolio'
import type { Project } from '@/domain/projects'
import { fetchProjectBySlugApi, fetchPublicPortfolioApi } from '@/infrastructure/portfolio'

import { queryKeys } from '../query/keys'

export function usePublicPortfolio(username = 'admin') {
  return useQuery<PortfolioData>({
    queryKey: queryKeys.portfolio.byUsername(username),
    queryFn: () => fetchPublicPortfolioApi(username),
  })
}

export function useProjectBySlug(slug: string) {
  return useQuery<Project>({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: () => fetchProjectBySlugApi(slug),
    enabled: Boolean(slug),
  })
}
