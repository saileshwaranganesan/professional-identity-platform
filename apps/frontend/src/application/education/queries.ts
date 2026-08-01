/*
 * Education Application Query Hooks
 *
 * Exposes useEducation server state hook (FSAS-001 §5.3).
 * Connected to httpClient + Domain mapper mapEducationList.
 */

import { useQuery } from '@tanstack/react-query'

import { mapEducationList } from '@/domain/education'
import type { Education } from '@/features/education'
import { httpClient } from '@/infrastructure/http'

import { queryKeys } from '../query/keys'

export function useEducation() {
  return useQuery<Education[]>({
    queryKey: queryKeys.education.all,
    queryFn: async () => {
      const response = await httpClient.get<unknown>('/educations')
      return mapEducationList(response.data)
    },
  })
}
