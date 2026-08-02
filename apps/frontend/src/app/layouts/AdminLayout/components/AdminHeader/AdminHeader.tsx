/*
 * AdminHeader Component
 *
 * Header bar displaying current section title, user avatar/badge, and mobile drawer toggle button.
 */

import { useLocation } from '@tanstack/react-router'

import { useAuth } from '@/application/auth'
import { ADMIN_NAV_ITEMS } from '@/app/navigation/adminNav.config'

import styles from './AdminHeader.module.css'

interface AdminHeaderProps {
  onToggleMobileMenu: () => void
}

export function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const { user } = useAuth()
  const location = useLocation()

  // Resolve page title based on active route path
  const currentNavItem = ADMIN_NAV_ITEMS.find((item) =>
    item.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(item.path),
  )
  const pageTitle = currentNavItem?.label ?? 'Admin Dashboard'

  // User initials fallback for avatar
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user?.email ? user.email[0] : 'A'

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className={styles.mobileMenuBtn}
          onClick={onToggleMobileMenu}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.userBadge}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.firstName ?? user?.email ?? 'Administrator'}</span>
            <span className={styles.userRole}>{user?.role ?? 'ADMIN'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
