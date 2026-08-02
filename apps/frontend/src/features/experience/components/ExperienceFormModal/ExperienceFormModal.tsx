/*
 * ExperienceFormModal Component
 *
 * Modal wrapper mounting ExperienceForm for Create/Edit experience operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { CreateExperienceFormData, Experience } from '@/domain/experience'

import { ExperienceForm } from '../ExperienceForm/ExperienceForm'

interface ExperienceFormModalProps {
  isOpen: boolean
  initialData?: Experience | null
  onSubmit: (data: CreateExperienceFormData) => Promise<void>
  onClose: () => void
  isSubmitting?: boolean
}

export function ExperienceFormModal({
  isOpen,
  initialData,
  onSubmit,
  onClose,
  isSubmitting = false,
}: ExperienceFormModalProps) {
  const title = initialData ? 'Edit Experience' : 'Create New Experience'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="600px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <ExperienceForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
