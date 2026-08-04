/*
 * SocialLinkFormModal Component
 *
 * Modal wrapper mounting SocialLinkForm for Create/Edit social link operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { CreateSocialLinkFormData, SocialLink } from '@/domain/socialLinks'

import { SocialLinkForm } from '../SocialLinkForm/SocialLinkForm'

export interface SocialLinkFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: SocialLink | null | undefined
  onSubmit: (data: CreateSocialLinkFormData) => Promise<void>
  isSubmitting?: boolean
}

export function SocialLinkFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: SocialLinkFormModalProps) {
  const title = initialData ? 'Edit Social Link' : 'Add New Social Link'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="560px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <SocialLinkForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
