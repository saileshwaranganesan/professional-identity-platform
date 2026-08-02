/*
 * SkillFormModal Component
 *
 * Modal wrapper mounting SkillForm for Create/Edit skill operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { CreateSkillFormData, Skill } from '@/domain/skills'

import { SkillForm } from '../SkillForm/SkillForm'

interface SkillFormModalProps {
  isOpen: boolean
  initialData?: Skill | null
  onSubmit: (data: CreateSkillFormData) => Promise<void>
  onClose: () => void
  isSubmitting?: boolean
}

export function SkillFormModal({
  isOpen,
  initialData,
  onSubmit,
  onClose,
  isSubmitting = false,
}: SkillFormModalProps) {
  const title = initialData ? 'Edit Skill' : 'Create New Skill'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="560px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <SkillForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}