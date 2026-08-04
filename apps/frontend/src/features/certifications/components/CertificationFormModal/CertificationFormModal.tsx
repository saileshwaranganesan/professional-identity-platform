/*
 * CertificationFormModal Component
 *
 * Modal wrapper mounting CertificationForm for Create/Edit certification operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { Certification, CreateCertificationFormData } from '@/domain/certifications'

import { CertificationForm } from '../CertificationForm/CertificationForm'

export interface CertificationFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Certification | null | undefined
  onSubmit: (data: CreateCertificationFormData) => Promise<void>
  isSubmitting?: boolean
}

export function CertificationFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: CertificationFormModalProps) {
  const title = initialData ? 'Edit Certification' : 'Add New Certification'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="600px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <CertificationForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
