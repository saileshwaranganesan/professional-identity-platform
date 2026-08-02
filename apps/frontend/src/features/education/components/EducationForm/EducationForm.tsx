/*
 * EducationForm Component
 *
 * Single reusable form for Create and Edit Education modes.
 * Controlled state with Zod schema validation (educationFormSchema).
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  educationFormSchema,
  type CreateEducationFormData,
  type Education,
} from '@/domain/education'

import styles from './EducationForm.module.css'

export interface EducationFormProps {
  initialData?: Education | null | undefined
  onSubmit: (data: CreateEducationFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function EducationForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EducationFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateEducationFormData>({
    institution: initialData?.institution ?? '',
    degree: initialData?.degree ?? '',
    fieldOfStudy: initialData?.fieldOfStudy ?? '',
    startDate: initialData?.startDate ?? '',
    endDate: initialData?.endDate ?? '',
    grade: initialData?.grade ?? '',
    description: initialData?.description ?? '',
    currentlyStudying: initialData?.currentlyStudying ?? false,
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateEducationFormData, string>>>({})

  const handleChange = <K extends keyof CreateEducationFormData>(
    field: K,
    value: CreateEducationFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = educationFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateEducationFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateEducationFormData] = issue.message
        }
      })
      setFieldErrors(formatted)
      return
    }

    await onSubmit(result.data)
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className={styles.form} noValidate>
      {/* Institution / Degree */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="institution" className={styles.label}>Institution *</label>
          <Input
            id="institution"
            placeholder="e.g. Stanford University"
            variant={fieldErrors.institution ? 'error' : 'default'}
            fullWidth
            value={formData.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
          />
          {fieldErrors.institution && <span className={styles.inputError}>{fieldErrors.institution}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="degree" className={styles.label}>Degree *</label>
          <Input
            id="degree"
            placeholder="e.g. Bachelor of Science"
            variant={fieldErrors.degree ? 'error' : 'default'}
            fullWidth
            value={formData.degree}
            onChange={(e) => handleChange('degree', e.target.value)}
          />
          {fieldErrors.degree && <span className={styles.inputError}>{fieldErrors.degree}</span>}
        </div>
      </div>

      {/* Field of Study / Grade */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="fieldOfStudy" className={styles.label}>Field of Study</label>
          <Input
            id="fieldOfStudy"
            placeholder="e.g. Computer Science & Engineering"
            variant={fieldErrors.fieldOfStudy ? 'error' : 'default'}
            fullWidth
            value={formData.fieldOfStudy ?? ''}
            onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
          />
          {fieldErrors.fieldOfStudy && <span className={styles.inputError}>{fieldErrors.fieldOfStudy}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="grade" className={styles.label}>Grade / Score</label>
          <Input
            id="grade"
            placeholder="e.g. 3.9 / 4.0 or First Class"
            variant={fieldErrors.grade ? 'error' : 'default'}
            fullWidth
            value={formData.grade ?? ''}
            onChange={(e) => handleChange('grade', e.target.value)}
          />
          {fieldErrors.grade && <span className={styles.inputError}>{fieldErrors.grade}</span>}
        </div>
      </div>

      {/* Start Date / End Date */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="startDate" className={styles.label}>Start Date *</label>
          <Input
            id="startDate"
            type="date"
            variant={fieldErrors.startDate ? 'error' : 'default'}
            fullWidth
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
          {fieldErrors.startDate && <span className={styles.inputError}>{fieldErrors.startDate}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="endDate" className={styles.label}>End Date</label>
          <Input
            id="endDate"
            type="date"
            fullWidth
            value={formData.endDate ?? ''}
            disabled={formData.currentlyStudying}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={formData.currentlyStudying}
            onChange={(e) => {
              handleChange('currentlyStudying', e.target.checked)
              if (e.target.checked) {
                handleChange('endDate', '')
              }
            }}
          />
          Currently studying here
        </label>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Description / Key Achievements</label>
        <textarea
          id="description"
          placeholder="Mention relevant coursework, honors, or extracurricular achievements..."
          className={styles.textarea}
          value={formData.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {fieldErrors.description && <span className={styles.inputError}>{fieldErrors.description}</span>}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="secondary" size="medium" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Education' : 'Create Education'}
        </Button>
      </div>
    </form>
  )
}