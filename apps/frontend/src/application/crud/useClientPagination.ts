/*
 * useClientPagination Hook
 *
 * Custom hook for client-side array slicing and pagination state.
 */

import { useMemo, useState } from 'react'

interface UseClientPaginationOptions<T> {
  data: T[]
  pageSize?: number
}

interface UseClientPaginationResult<T> {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  paginatedData: T[]
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  canNextPage: boolean
  canPrevPage: boolean
}

export function useClientPagination<T>({
  data,
  pageSize = 10,
}: UseClientPaginationOptions<T>): UseClientPaginationResult<T> {
  const [page, setPage] = useState(1)

  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Ensure current page stays within bounds when data size changes
  const currentPage = Math.min(page, totalPages)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize])

  return {
    page: currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    setPage,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    canNextPage: currentPage < totalPages,
    canPrevPage: currentPage > 1,
  }
}
