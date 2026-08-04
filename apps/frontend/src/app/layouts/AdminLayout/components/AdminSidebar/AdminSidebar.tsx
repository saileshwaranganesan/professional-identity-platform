/*
 * AdminSidebar Component
 *
 * Config-driven sidebar navigation for desktop & mobile drawer.
 * Consumes ADMIN_NAV_ITEMS configuration from app/navigation.
 */

import { Link, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/application/auth'
import { ADMIN_NAV_ITEMS } from '@/app/navigation/adminNav.config'

import { AdminNavIcon } from '../AdminNavIcon'
import styles from './AdminSidebar.module.css'

interface AdminSidebarProps {
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export function AdminSidebar({ isMobileOpen, onCloseMobile }: AdminSidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    onCloseMobile()
    try {
      await logout()
    } finally {
      await navigate({ to: '/', replace: true })
    }
  }

  const sidebarClass = [
    styles.sidebar,
    isMobileOpen ? styles.sidebarOpen : '',
  ]
    .filter(Boolean)
    .join(' ')

  const backdropClass = [
    styles.backdrop,
    isMobileOpen ? styles.backdropVisible : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className={backdropClass} onClick={onCloseMobile} aria-hidden="true" />

      <aside className={sidebarClass}>
        <div className={styles.logoArea}>
          <span className={styles.logoText}>Identity Platform</span>
          <button type="button" aria-label="Close menu" className={styles.closeBtn} onClick={onCloseMobile}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className={styles.nav}>
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={styles.navLink}
              activeProps={{ className: styles.activeNavLink }}
              activeOptions={{ exact: item.path === '/admin' }}
              onClick={onCloseMobile}
            >
              <AdminNavIcon name={item.iconName} />
              <span>{item.label}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link to="/" className={styles.publicViewLink} target="_blank" rel="noreferrer">
            <span>View Live Website</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          <Button variant="secondary" size="small" fullWidth onClick={() => { void handleLogout() }}>
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}
