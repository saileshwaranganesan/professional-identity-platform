/*
 * Button Component
 *
 * Primitive reusable UI button component (Layer 4 — Presentation Layer).
 * Supports primary/secondary/danger variants, small/medium sizes, and full-width layout.
 * Extends standard HTML button attributes for full semantic access.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'small' | 'medium'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: styles.primary ?? '',
  secondary: styles.secondary ?? '',
  danger: styles.danger ?? '',
}

const sizeClasses: Record<ButtonSize, string> = {
  small: styles.small ?? '',
  medium: styles.medium ?? '',
}

export function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  children,
  className,
  ...restProps
}: ButtonProps) {
  const classNames = [
    styles.button ?? '',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? (styles.fullWidth ?? '') : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames}
      {...restProps}
    >
      {children}
    </button>
  )
}
