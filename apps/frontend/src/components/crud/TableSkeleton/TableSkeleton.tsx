/*
 * TableSkeleton Component
 *
 * Skeleton placeholder animation for table loading states.
 * Prevents Cumulative Layout Shift (CLS) by maintaining table column geometry.
 */

import styles from './TableSkeleton.module.css'

interface TableSkeletonProps {
  columnsCount?: number
  rowsCount?: number
}

export function TableSkeleton({
  columnsCount = 5,
  rowsCount = 5,
}: TableSkeletonProps) {
  const rows = Array.from({ length: rowsCount })
  const cols = Array.from({ length: columnsCount })

  return (
    <>
      {rows.map((_, rowIndex) => (
        <tr key={`sk-row-${rowIndex}`} className={styles.skeletonRow}>
          {cols.map((_, colIndex) => (
            <td key={`sk-col-${colIndex}`} className={styles.skeletonCell}>
              <div
                className={styles.bone}
                style={{
                  width: colIndex === 0 ? '70%' : colIndex === columnsCount - 1 ? '40%' : '85%',
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
