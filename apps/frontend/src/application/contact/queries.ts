/*
 * Contact Application Query Hooks
 *
 * Exposes useContact server state hook (FSAS-001 §5.3).
 * Currently consumes mock dataset; will transition to httpClient + Domain mappers.
 */

import { useQuery } from '@tanstack/react-query'

import { mockContact } from '@/features/contact'
import type { ContactInfo } from '@/features/contact'

import { queryKeys } from '../query/keys'

export function useContact() {
  return useQuery<ContactInfo>({
    queryKey: queryKeys.contact.all,
    queryFn: async () => Promise.resolve(mockContact),
  })
}
