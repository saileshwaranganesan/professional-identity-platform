/*
 * AppLayout — Application Shell
 *
 * The persistent structural frame that wraps every page of the application.
 *
 * Responsibilities:
 *   - Render the <header> region where navigation will mount
 *   - Render the <main> content area where page components render
 *   - Own the top-level page layout grid
 *
 * This component is pure structure — Presentation Layer (FSAS-001 §5.4).
 * No server state. No domain logic. No API calls.
 */

import type { ReactNode } from 'react'

import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        {/*
         * Navigation component mounts here.
         * Implemented once routing and auth are in place.
         */}
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  )
}
