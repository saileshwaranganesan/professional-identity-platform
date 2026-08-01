/*
 * Logo Component
 *
 * Brand identity logo component (Layer 4 — Presentation Layer).
 * Displays platform brand mark and title using design tokens and Text primitive.
 */

import { Text } from '@/components/ui/Text'

import styles from './Logo.module.css'

export interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const classNames = [styles.logo ?? '', className ?? ''].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      <span className={styles.mark ?? ''} aria-hidden="true">
        P
      </span>
      <Text as="span" variant="body" className={styles.title ?? ''}>
        Identity Platform
      </Text>
    </div>
  )
}
