/*
 * AchievementForm Component
 *
 * Form component for Create and Edit Achievement modes.
 * Validates inputs using achievementFormSchema.
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  achievementFormSchema,
  type Achievement,
  type CreateAchievementFormData,
} from '@/domain/achievements'

import styles from './AchievementForm.module.css'

export interface AchievementFormProps {
  initialData?: Achievement | null | undefined
  onSubmit: (data: CreateAchievementFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function AchievementForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AchievementFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateAchievementFormData>({
    title: initialData?.title ?? '',
    organization: initialData?.organization ?? '',
    achievementDate: initialData?.achievementDate ?? '',
    description: initialData?.description ?? '',
    achievementUrl: initialData?.achievementUrl ?? '',
    displayOrder: initialData?.displayOrder ?? 0,
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateAchievementFormData, string>>>({})

  const handleChange = <K extends keyof CreateAchievementFormData>(
    field: K,
    value: CreateAchievementFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = achievementFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateAchievementFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateAchievementFormData] = issue.message
        }
      })
      setFieldErrors(formatted)
      return
    }

    await onSubmit(result.data)
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>Achievement Title *</label>
        <Input
          id="title"
          placeholder="e.g. 1st Place Global Hackathon, Keynote Speaker"
          variant={fieldErrors.title ? 'error' : 'default'}
          fullWidth
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        {fieldErrors.title && <span className={styles.inputError}>{fieldErrors.title}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="organization" className={styles.label}>Organization / Issuer</label>
          <Input
            id="organization"
            placeholder="e.g. IEEE, TechCrunch, Major League Hacking"
            variant={fieldErrors.organization ? 'error' : 'default'}
            fullWidth
            value={formData.organization ?? ''}
            onChange={(e) => handleChange('organization', e.target.value)}
          />
          {fieldErrors.organization && <span className={styles.inputError}>{fieldErrors.organization}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="achievementDate" className={styles.label}>Achievement Date</label>
          <Input
            id="achievementDate"
            type="date"
            variant={fieldErrors.achievementDate ? 'error' : 'default'}
            fullWidth
            value={formData.achievementDate ?? ''}
            onChange={(e) => handleChange('achievementDate', e.target.value)}
          />
          {fieldErrors.achievementDate && <span className={styles.inputError}>{fieldErrors.achievementDate}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          className={`${styles.textarea} ${fieldErrors.description ? styles.textareaError : ''}`}
          placeholder="Summarize the achievement, context, and key impact."
          value={formData.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {fieldErrors.description && <span className={styles.inputError}>{fieldErrors.description}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="achievementUrl" className={styles.label}>Achievement URL</label>
          <Input
            id="achievementUrl"
            placeholder="e.g. https://example.com/award"
            variant={fieldErrors.achievementUrl ? 'error' : 'default'}
            fullWidth
            value={formData.achievementUrl ?? ''}
            onChange={(e) => handleChange('achievementUrl', e.target.value)}
          />
          {fieldErrors.achievementUrl && <span className={styles.inputError}>{fieldErrors.achievementUrl}</span>}
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
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Achievement' : 'Add Achievement'}
        </Button>
      </div>
    </form>
  )
}
