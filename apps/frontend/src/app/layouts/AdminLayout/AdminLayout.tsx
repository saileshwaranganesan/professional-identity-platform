/*
 * AdminLayout Component
 *
 * Administration shell composition root.
 * Integrates responsive AdminSidebar, AdminHeader, and child route <Outlet /> content.
 * Handles mobile menu toggle state and keyboard accessibility.
 */

import { useState, useEffect, useCallback, type ReactNode } from 'react'

import { AdminHeader } from './components/AdminHeader'
import { AdminSidebar } from './components/AdminSidebar'
import styles from './AdminLayout.module.css'

interface AdminLayoutProps {
  children?: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleToggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev)
  }, [])

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseMobile()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCloseMobile])

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  return (
    <div className={styles.container}>
      <AdminSidebar isMobileOpen={isMobileOpen} onCloseMobile={handleCloseMobile} />

      <div className={styles.mainWrapper}>
        <AdminHeader onToggleMobileMenu={handleToggleMobile} />
        <main className={styles.contentBody}>{children}</main>
      </div>
    </div>
  )
}
