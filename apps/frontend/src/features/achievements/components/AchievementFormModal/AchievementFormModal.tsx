/*
 * AchievementFormModal Component
 *
 * Modal wrapper mounting AchievementForm for Create/Edit achievement operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { Achievement, CreateAchievementFormData } from '@/domain/achievements'

import { AchievementForm } from '../AchievementForm/AchievementForm'

export interface AchievementFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Achievement | null | undefined
  onSubmit: (data: CreateAchievementFormData) => Promise<void>
  isSubmitting?: boolean
}

export function AchievementFormModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: AchievementFormModalProps) {
  const title = initialData ? 'Edit Achievement' : 'Add New Achievement'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="600px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <AchievementForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
