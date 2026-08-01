/*
 * Card Component
 *
 * Primary surface container component (Layer 4 — Presentation Layer).
 * Provides container styling (elevated, outlined, flat) and padding scales.
 * Renders native semantic HTML tags ('section', 'article', 'div', 'aside').
 */

import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Card.module.css'

export type CardVariant = 'elevated' | 'outlined' | 'flat'
export type CardPadding = 'none' | 'small' | 'medium'
export type CardAs = 'section' | 'article' | 'div' | 'aside'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  padding?: CardPadding
  as?: CardAs
  children: ReactNode
}

const variantClasses: Record<CardVariant, string> = {
  elevated: styles.elevated ?? '',
  outlined: styles.outlined ?? '',
  flat: styles.flat ?? '',
}

const paddingClasses: Record<CardPadding, string> = {
  none: styles.paddingNone ?? '',
  small: styles.paddingSmall ?? '',
  medium: styles.paddingMedium ?? '',
}

export function Card({
  variant = 'elevated',
  padding = 'medium',
  as: Component = 'section',
  children,
  className,
  ...restProps
}: CardProps) {
  const classNames = [
    styles.card ?? '',
    variantClasses[variant],
    paddingClasses[padding],
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
