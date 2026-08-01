/*
 * Skills Application Query Hooks
 *
 * Exposes useSkills server state hook (FSAS-001 §5.3).
 * Connected to httpClient + Domain mapper mapSkillsList.
 */

import { useQuery } from '@tanstack/react-query'

import { mapSkillsList } from '@/domain/skills'
import type { Skill } from '@/features/skills'
import { httpClient } from '@/infrastructure/http'

import { queryKeys } from '../query/keys'

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: queryKeys.skills.all,
    queryFn: async () => {
      const response = await httpClient.get<unknown>('/skills')
      return mapSkillsList(response.data)
    },
  })
}
