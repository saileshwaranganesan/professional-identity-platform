/*
 * FormField Component
 *
 * Form field composition component (Layer 4 — Presentation Layer).
 * Composes label, Input primitive, helper text, and error messages into a unified layout.
 * Does not implement validation logic or form state — pure presentational composition.
 */

import { forwardRef, useId } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'

import styles from './FormField.module.css'

export interface FormFieldProps extends InputProps {
  label?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    {
      label,
      helperText,
      errorMessage,
      required = false,
      id: customId,
      variant,
      fullWidth = false,
      className,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId()
    const inputId = customId ?? generatedId

    // Automatically set Input variant to error if errorMessage is provided
    const resolvedVariant = variant ?? (errorMessage ? 'error' : 'default')

    const containerClasses = [
      styles.field ?? '',
      fullWidth ? (styles.fullWidth ?? '') : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label ?? ''}>
            <Text as="span" variant="small">
              {label}
            </Text>
            {required && (
              <span className={styles.requiredIndicator ?? ''} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <Input
          ref={ref}
          id={inputId}
          variant={resolvedVariant}
          fullWidth={fullWidth}
          required={required}
          {...inputProps}
        />

        {errorMessage ? (
          <Text as="span" variant="small" className={styles.errorText ?? ''}>
            {errorMessage}
          </Text>
        ) : helperText ? (
          <Text as="span" variant="small">
            {helperText}
          </Text>
        ) : null}
      </div>
    )
  },
)
