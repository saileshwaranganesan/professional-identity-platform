/*
 * Login Page Route Component
 *
 * Mounts the LoginForm feature component inside a centered dark view.
 */

import { LoginForm } from '@/features/auth'

export function LoginPage() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b0f19',
        padding: '1.5rem',
      }}
    >
      <LoginForm />
    </div>
  )
}
