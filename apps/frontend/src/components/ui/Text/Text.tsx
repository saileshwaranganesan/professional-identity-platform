/*
 * Text Component
 *
 * Primitive typography component for paragraph and inline body copy (Layer 4 — Presentation Layer).
 * Supports body, small, and muted variants. Accepts semantic 'p', 'span', or 'div' elements.
 */

import type { HTMLAttributes, ReactNode } from 'react'

import styles from './Text.module.css'

export type TextVariant = 'body' | 'small' | 'muted'
export type TextAs = 'p' | 'span' | 'div'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant
  as?: TextAs
  children: ReactNode
}

const variantClasses: Record<TextVariant, string> = {
  body: styles.body ?? '',
  small: styles.small ?? '',
  muted: styles.muted ?? '',
}

export function Text({
  variant = 'body',
  as: Component = 'p',
  children,
  className,
  ...restProps
}: TextProps) {
  const classNames = [
    styles.text ?? '',
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
