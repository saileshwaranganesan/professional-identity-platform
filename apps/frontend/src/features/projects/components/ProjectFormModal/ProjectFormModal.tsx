/*
 * ProjectFormModal Component
 *
 * Modal wrapper mounting ProjectForm for Create/Edit project operations.
 */

import { Modal } from '@/components/ui/Modal'
import type { CreateProjectFormData, Project } from '@/domain/projects'

import { ProjectForm } from '../ProjectForm/ProjectForm'

interface ProjectFormModalProps {
  isOpen: boolean
  initialData?: Project | null
  onSubmit: (data: CreateProjectFormData) => Promise<void>
  onClose: () => void
  isSubmitting?: boolean
}

export function ProjectFormModal({
  isOpen,
  initialData,
  onSubmit,
  onClose,
  isSubmitting = false,
}: ProjectFormModalProps) {
  const title = initialData ? 'Edit Project' : 'Create New Project'

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isSubmitting} maxWidth="560px">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h2>
      </div>

      <ProjectForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
