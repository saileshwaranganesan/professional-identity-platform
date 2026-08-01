/*
 * Navigation Component
 *
 * Primary navigation menu component (Layer 4 — Presentation Layer).
 * Renders static navigation items. Decoupled from router implementations.
 */

import styles from './Navigation.module.css'

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

export interface NavigationProps {
  items?: NavigationItem[]
  className?: string
}

const defaultItems: NavigationItem[] = [
  { label: 'Overview', href: '#', isActive: true },
  { label: 'Projects', href: '#' },
  { label: 'Experience', href: '#' },
  { label: 'Settings', href: '#' },
]

export function Navigation({
  items = defaultItems,
  className,
}: NavigationProps) {
  const navClasses = [styles.nav ?? '', className ?? ''].filter(Boolean).join(' ')

  return (
    <nav className={navClasses} aria-label="Main Navigation">
      <ul className={styles.list ?? ''}>
        {items.map((item) => {
          const linkClasses = [
            styles.link ?? '',
            item.isActive ? (styles.active ?? '') : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={item.label} className={styles.item ?? ''}>
              <a href={item.href} className={linkClasses}>
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
