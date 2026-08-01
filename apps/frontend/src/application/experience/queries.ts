/*
 * Experience Application Query Hooks
 *
 * Exposes useExperience server state hook (FSAS-001 §5.3).
 * Connected to httpClient + Domain mapper mapExperiencesList.
 */

import { useQuery } from '@tanstack/react-query'

import { mapExperiencesList } from '@/domain/experience'
import type { Experience } from '@/features/experience'
import { httpClient } from '@/infrastructure/http'

import { queryKeys } from '../query/keys'

export function useExperience() {
  return useQuery<Experience[]>({
    queryKey: queryKeys.experience.all,
    queryFn: async () => {
      const response = await httpClient.get<unknown>('/experiences')
      return mapExperiencesList(response.data)
    },
  })
}
