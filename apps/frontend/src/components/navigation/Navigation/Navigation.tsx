/*
 * Navigation Component
 *
 * Primary navigation menu component (Layer 4 — Presentation Layer).
 * Connects navigation items to TanStack Router links.
 */

import { Link } from '@tanstack/react-router'

import styles from './Navigation.module.css'

export interface NavigationItem {
  label: string
  href: string
}

export interface NavigationProps {
  items?: NavigationItem[]
  className?: string
}

const defaultItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
]

export function Navigation({
  items = defaultItems,
  className,
}: NavigationProps) {
  const navClasses = [styles.nav ?? '', className ?? ''].filter(Boolean).join(' ')

  return (
    <nav className={navClasses} aria-label="Main Navigation">
      <ul className={styles.list ?? ''}>
        {items.map((item) => (
          <li key={item.label} className={styles.item ?? ''}>
            <Link
              to={item.href}
              className={styles.link ?? ''}
              activeProps={{
                className: `${styles.link ?? ''} ${styles.active ?? ''}`,
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
