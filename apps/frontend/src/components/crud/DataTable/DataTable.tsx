/*
 * DataTable Component
 *
 * Generic tabular data renderer supporting custom column accessors, cell renderers,
 * loading skeletons, and empty state fallback.
 */

import type { ReactNode } from 'react'

import { TableSkeleton } from '../TableSkeleton'
import styles from './DataTable.module.css'

export interface ColumnDef<T> {
  key: string
  header: string
  accessor?: keyof T | ((row: T) => ReactNode)
  renderCell?: (row: T) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyExtractor: (item: T) => string
  isLoading?: boolean
  emptyState?: ReactNode
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyState,
}: DataTableProps<T>) {
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return styles.alignCenter
    if (align === 'right') return styles.alignRight
    return styles.alignLeft
  }

  const renderCellValue = (row: T, col: ColumnDef<T>): ReactNode => {
    if (col.renderCell) {
      return col.renderCell(row)
    }

    if (typeof col.accessor === 'function') {
      return col.accessor(row)
    }

    if (col.accessor) {
      const val = row[col.accessor]
      if (val === null || val === undefined) return '—'
      if (typeof val === 'boolean') return val ? 'Yes' : 'No'
      return String(val)
    }

    return null
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${getAlignmentClass(col.align)}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <TableSkeleton columnsCount={columns.length} rowsCount={5} />
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className={styles.tr}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${styles.td} ${getAlignmentClass(col.align)}`}
                  >
                    {renderCellValue(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
