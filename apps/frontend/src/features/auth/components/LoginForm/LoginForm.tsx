/*
 * LoginForm Component
 *
 * Presentation component handling administrator authentication form.
 * Controlled form state with Zod schema validation.
 */

import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/application/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginSchema, type LoginFormData } from '@/domain/auth'

import styles from './LoginForm.module.css'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof LoginFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof LoginFormData] = issue.message
        }
      })
      setFieldErrors(formatted)
      return
    }

    try {
      setIsSubmitting(true)
      const user = await login(result.data)
      if (user && user.role === 'ADMIN') {
        await navigate({ to: '/admin', replace: true })
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.'
      setErrorMessage(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Portal</h1>
        <p className={styles.subtitle}>Sign in to manage your professional platform</p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(e) }} className={styles.form} noValidate>
        {errorMessage && <div className={styles.globalError}>{errorMessage}</div>}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            variant={fieldErrors.email ? 'error' : 'default'}
          />
          {fieldErrors.email && (
            <span className={styles.fieldError}>{fieldErrors.email}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            fullWidth
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            variant={fieldErrors.password ? 'error' : 'default'}
          />
          {fieldErrors.password && (
            <span className={styles.fieldError}>{fieldErrors.password}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          fullWidth
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
