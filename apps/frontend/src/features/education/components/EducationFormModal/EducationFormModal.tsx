/*
 * EducationFormModal Component
 *
 * Modal wrapper mounting EducationForm for Create/Edit education operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { CreateEducationFormData, Education } from '@/domain/education'

import { EducationForm } from '../EducationForm/EducationForm'

interface EducationFormModalProps {
  isOpen: boolean
  initialData?: Education | null
  onSubmit: (data: CreateEducationFormData) => Promise<void>
  onClose: () => void
  isSubmitting?: boolean
}

export function EducationFormModal({
  isOpen,
  initialData,
  onSubmit,
  onClose,
  isSubmitting = false,
}: EducationFormModalProps) {
  const title = initialData ? 'Edit Education' : 'Add New Education'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="600px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <EducationForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}