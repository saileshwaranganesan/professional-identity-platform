/*
 * Projects Application Query Hooks
 *
 * Exposes useProjects server state hook (FSAS-001 §5.3).
 * Connected to httpClient + Domain mapper mapProjectsList.
 */

import { useQuery } from '@tanstack/react-query'

import { mapProjectsList } from '@/domain/projects'
import type { Project } from '@/features/projects'
import { httpClient } from '@/infrastructure/http'

import { queryKeys } from '../query/keys'

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects.all,
    queryFn: async () => {
      const response = await httpClient.get<unknown>('/projects')
      return mapProjectsList(response.data)
    },
  })
}
