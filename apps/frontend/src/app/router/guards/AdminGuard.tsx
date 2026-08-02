/*
 * AdminGuard Component
 *
 * Route guard enforcing authentication and ADMIN role access.
 * Redirects unauthenticated users to /login.
 */

import type { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'

import { useAuth } from '@/application/auth'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0f19',
          color: '#94a3b8',
        }}
      >
        Restoring session...
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
