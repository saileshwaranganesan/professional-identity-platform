/*
 * Pagination Component
 *
 * Pagination bar displaying current item slice and next/prev page controls.
 */

import { Button } from '@/components/ui/Button'

import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onNextPage: () => void
  onPrevPage: () => void
  canNextPage: boolean
  canPrevPage: boolean
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onNextPage,
  onPrevPage,
  canNextPage,
  canPrevPage,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems)

  return (
    <div className={styles.bar}>
      <span className={styles.info}>
        Showing {startItem} to {endItem} of {totalItems} items
      </span>

      <div className={styles.controls}>
        <Button variant="secondary" size="small" onClick={onPrevPage} disabled={!canPrevPage}>
          Previous
        </Button>
        <span className={styles.pageIndicator}>
          Page {page} of {totalPages}
        </span>
        <Button variant="secondary" size="small" onClick={onNextPage} disabled={!canNextPage}>
          Next
        </Button>
      </div>
    </div>
  )
}
