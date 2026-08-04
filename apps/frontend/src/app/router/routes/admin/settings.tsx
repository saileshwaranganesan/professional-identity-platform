/*
 * Settings / Profile Admin Route Page
 *
 * Admin management page for profile information & identity configuration.
 * Consumes useProfile and useUpdateProfile application layer hooks.
 */

import { useProfile, useUpdateProfile } from '@/application/profile'
import { ProfileForm } from '@/features/profile'
import type { UpdateProfileFormData } from '@/domain/profile'

export function AdminSettingsPage() {
  const { data: profile, isLoading, error } = useProfile()
  const updateProfileMutation = useUpdateProfile()

  const handleSubmit = async (data: UpdateProfileFormData) => {
    await updateProfileMutation.mutateAsync(data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Profile & Account Settings
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Manage your public identity, bio, contact details, and personal branding links.
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#38bdf8' }}>
          Loading profile details...
        </div>
      ) : error ? (
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '0.5rem', color: '#fca5a5' }}>
          Failed to load profile data. Please try refreshing.
        </div>
      ) : (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
            isSubmitting={updateProfileMutation.isPending}
          />
        </div>
      )}
    </div>
  )
}
