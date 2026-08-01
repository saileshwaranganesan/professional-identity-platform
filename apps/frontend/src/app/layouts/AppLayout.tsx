/*
 * AppLayout — Application Shell
 *
 * The persistent structural frame that wraps every page of the application.
 *
 * Responsibilities:
 *   - Render the Header bar (Logo + Navigation)
 *   - Render the <main> content area where page components render
 *   - Own the top-level page layout grid
 *
 * This component is pure structure — Presentation Layer (FSAS-001 §5.4).
 * No server state. No domain logic. No API calls.
 */

import type { ReactNode } from 'react'

import { Header } from '@/components/navigation/Header'

import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
