/*
 * SkillForm Component
 *
 * Single reusable form for Create and Edit Skill modes.
 * Controlled state with Zod schema validation (skillFormSchema).
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  skillFormSchema,
  type CreateSkillFormData,
  type Skill,
  type SkillLevel,
} from '@/domain/skills'

import styles from './SkillForm.module.css'

export interface SkillFormProps {
  initialData?: Skill | null | undefined
  onSubmit: (data: CreateSkillFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const SKILL_LEVEL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
]

export function SkillForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SkillFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateSkillFormData>({
    name: initialData?.name ?? '',
    level: initialData?.level ?? 'INTERMEDIATE',
    category: initialData?.category ?? '',
    displayOrder: initialData?.displayOrder ?? 0,
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateSkillFormData, string>>>({})

  const handleChange = <K extends keyof CreateSkillFormData>(
    field: K,
    value: CreateSkillFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = skillFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateSkillFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateSkillFormData] = issue.message
        }
      })
      setFieldErrors(formatted)
      return
    }

    await onSubmit(result.data)
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className={styles.form} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Skill Name *</label>
          <Input
            id="name"
            placeholder="e.g. React, Spring Boot, PostgreSQL"
            variant={fieldErrors.name ? 'error' : 'default'}
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {fieldErrors.name && <span className={styles.inputError}>{fieldErrors.name}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="level" className={styles.label}>Proficiency Level *</label>
          <select
            id="level"
            className={styles.select}
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value as SkillLevel)}
          >
            {SKILL_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>Category</label>
          <Input
            id="category"
            placeholder="e.g. Frontend, Backend, Database, DevOps & Tools"
            variant={fieldErrors.category ? 'error' : 'default'}
            fullWidth
            value={formData.category ?? ''}
            onChange={(e) => handleChange('category', e.target.value)}
          />
          {fieldErrors.category && <span className={styles.inputError}>{fieldErrors.category}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="displayOrder" className={styles.label}>Display Order</label>
          <Input
            id="displayOrder"
            type="number"
            min={0}
            placeholder="0"
            variant={fieldErrors.displayOrder ? 'error' : 'default'}
            fullWidth
            value={formData.displayOrder ?? 0}
            onChange={(e) => handleChange('displayOrder', Number(e.target.value))}
          />
          {fieldErrors.displayOrder && <span className={styles.inputError}>{fieldErrors.displayOrder}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="medium" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Skill' : 'Create Skill'}
        </Button>
      </div>
    </form>
  )
}