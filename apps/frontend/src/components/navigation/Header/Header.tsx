/*
 * Header Component
 *
 * Top application header component (Layer 4 — Presentation Layer).
 * Composes Logo and Navigation components into a unified header bar.
 */

import { Logo } from '../Logo'
import { Navigation } from '../Navigation'

import styles from './Header.module.css'

export interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const headerClasses = [styles.header ?? '', className ?? ''].filter(Boolean).join(' ')

  return (
    <header className={headerClasses}>
      <Logo />
      <Navigation />
    </header>
  )
}
