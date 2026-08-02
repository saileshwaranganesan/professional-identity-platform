/*
 * Admin Dashboard Route Component
 *
 * Overview dashboard page for administrator.
 */

import { useAuth } from '@/application/auth'

export function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Welcome back, {user?.firstName ?? user?.email ?? 'Administrator'}!
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          This is the central administration dashboard for your Professional Identity Platform.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Account Role</span>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.25rem' }}>
            {user?.role}
          </p>
        </div>

        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Authentication Security</span>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#4ade80', marginTop: '0.25rem' }}>
            HttpOnly Secure Cookie
          </p>
        </div>
      </div>
    </div>
  )
}
