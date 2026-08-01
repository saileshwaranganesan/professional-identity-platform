/*
 * Input Component
 *
 * Primitive text input component (Layer 4 — Presentation Layer).
 * Supports default/error variants, small/medium sizes, and full-width layout.
 * Wraps native HTML input with React.forwardRef for form library compatibility.
 */

import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

import styles from './Input.module.css'

export type InputVariant = 'default' | 'error'
export type InputSize = 'small' | 'medium'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant
  size?: InputSize
  fullWidth?: boolean
}

const variantClasses: Record<InputVariant, string> = {
  default: styles.default ?? '',
  error: styles.error ?? '',
}

const sizeClasses: Record<InputSize, string> = {
  small: styles.small ?? '',
  medium: styles.medium ?? '',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = 'default',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    type = 'text',
    className,
    ...restProps
  },
  ref,
) {
  const classNames = [
    styles.input ?? '',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? (styles.fullWidth ?? '') : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={classNames}
      {...restProps}
    />
  )
})
