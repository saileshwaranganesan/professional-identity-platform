/*
 * Login Page Route Component
 *
 * Mounts the LoginForm feature component inside a centered dark view.
 * Redirects authenticated users to /admin automatically.
 */

import { Navigate } from '@tanstack/react-router'

import { useAuth } from '@/application/auth'
import { LoginForm } from '@/features/auth'

export function LoginPage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (!isLoading && isAuthenticated && user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

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
