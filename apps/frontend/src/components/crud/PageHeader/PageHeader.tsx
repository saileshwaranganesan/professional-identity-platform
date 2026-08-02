/*
 * PageHeader Component
 *
 * Reusable section header displaying resource title, subtitle, and primary action slot.
 */

import type { ReactNode } from 'react'

import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {action && <div className={styles.actionWrapper}>{action}</div>}
    </div>
  )
}
