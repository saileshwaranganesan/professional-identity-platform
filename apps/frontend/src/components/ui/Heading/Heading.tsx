/*
 * Heading Component
 *
 * Primitive typography component for section headings (Layer 4 — Presentation Layer).
 * Renders native semantic HTML tags (h1-h6) matching the specified level.
 */

import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Heading.module.css'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingVariant = 'default' | 'muted'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
  variant?: HeadingVariant
  children: ReactNode
}

const levelClasses: Record<HeadingLevel, string> = {
  1: styles.h1 ?? '',
  2: styles.h2 ?? '',
  3: styles.h3 ?? '',
  4: styles.h4 ?? '',
  5: styles.h5 ?? '',
  6: styles.h6 ?? '',
}

const variantClasses: Record<HeadingVariant, string> = {
  default: styles.default ?? '',
  muted: styles.muted ?? '',
}

export function Heading({
  level = 1,
  variant = 'default',
  children,
  className,
  ...restProps
}: HeadingProps) {
  const Component = `h${level}` as const
  const classNames = [
    styles.heading ?? '',
    levelClasses[level],
    variantClasses[variant],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classNames} {...restProps}>
      {children}
    </Component>
  )
}
