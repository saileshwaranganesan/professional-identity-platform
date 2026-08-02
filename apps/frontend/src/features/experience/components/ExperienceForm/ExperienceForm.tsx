/*
 * ExperienceForm Component
 *
 * Single reusable form for Create and Edit Experience modes.
 * Controlled state with Zod schema validation (experienceFormSchema).
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  experienceFormSchema,
  type CreateExperienceFormData,
  type Experience,
  type EmploymentType,
  type EmploymentStatus,
} from '@/domain/experience'

import styles from './ExperienceForm.module.css'

export interface ExperienceFormProps {
  initialData?: Experience | null | undefined
  onSubmit: (data: CreateExperienceFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'SELF_EMPLOYED', label: 'Self-employed' },
]

const EMPLOYMENT_STATUS_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: 'CURRENT', label: 'Current' },
  { value: 'PREVIOUS', label: 'Previous' },
]

export function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ExperienceFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateExperienceFormData>({
    company: initialData?.company ?? '',
    position: initialData?.position ?? '',
    employmentType: initialData?.employmentType ?? 'FULL_TIME',
    employmentStatus: initialData?.employmentStatus ?? 'CURRENT',
    location: initialData?.location ?? '',
    description: initialData?.description ?? '',
    technologies: Array.isArray(initialData?.technologies)
      ? initialData.technologies.join(', ')
      : '',
    startDate: initialData?.startDate ?? '',
    endDate: initialData?.endDate ?? '',
    currentlyWorking: initialData?.currentlyWorking ?? false,
    companyWebsite: initialData?.companyWebsite ?? '',
    companyLogo: initialData?.companyLogo ?? '',
    displayOrder: initialData?.displayOrder ?? 0,
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateExperienceFormData, string>>>({})

  const handleChange = <K extends keyof CreateExperienceFormData>(
    field: K,
    value: CreateExperienceFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = experienceFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateExperienceFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateExperienceFormData] = issue.message
        }
      })
      setFieldErrors(formatted)
      return
    }

    await onSubmit(result.data)
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className={styles.form} noValidate>
      {/* Company / Position */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="company" className={styles.label}>Company *</label>
          <Input
            id="company"
            placeholder="e.g. Google LLC"
            variant={fieldErrors.company ? 'error' : 'default'}
            fullWidth
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
          {fieldErrors.company && <span className={styles.inputError}>{fieldErrors.company}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="position" className={styles.label}>Position / Role *</label>
          <Input
            id="position"
            placeholder="e.g. Senior Software Engineer"
            variant={fieldErrors.position ? 'error' : 'default'}
            fullWidth
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
          />
          {fieldErrors.position && <span className={styles.inputError}>{fieldErrors.position}</span>}
        </div>
      </div>

      {/* Employment Type / Status */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="employmentType" className={styles.label}>Employment Type *</label>
          <select
            id="employmentType"
            className={styles.select}
            value={formData.employmentType}
            onChange={(e) => handleChange('employmentType', e.target.value as EmploymentType)}
          >
            {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="employmentStatus" className={styles.label}>Employment Status *</label>
          <select
            id="employmentStatus"
            className={styles.select}
            value={formData.employmentStatus}
            onChange={(e) => handleChange('employmentStatus', e.target.value as EmploymentStatus)}
          >
            {EMPLOYMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className={styles.field}>
        <label htmlFor="location" className={styles.label}>Location</label>
        <Input
          id="location"
          placeholder="e.g. San Francisco, CA (or Remote)"
          fullWidth
          value={formData.location ?? ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      {/* Start Date / End Date / Currently Working */}
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
            disabled={formData.currentlyWorking}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={formData.currentlyWorking}
            onChange={(e) => {
              handleChange('currentlyWorking', e.target.checked)
              if (e.target.checked) {
                handleChange('endDate', '')
              }
            }}
          />
          Currently working here
        </label>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          placeholder="Describe your responsibilities and achievements..."
          className={styles.textarea}
          value={formData.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {fieldErrors.description && <span className={styles.inputError}>{fieldErrors.description}</span>}
      </div>

      {/* Technologies */}
      <div className={styles.field}>
        <label htmlFor="technologies" className={styles.label}>Technologies</label>
        <Input
          id="technologies"
          placeholder="e.g. React, TypeScript, Spring Boot (comma-separated)"
          fullWidth
          value={formData.technologies ?? ''}
          onChange={(e) => handleChange('technologies', e.target.value)}
        />
        <span className={styles.hint}>Separate technologies with commas</span>
      </div>

      {/* Company Website / Logo */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="companyWebsite" className={styles.label}>Company Website</label>
          <Input
            id="companyWebsite"
            type="url"
            placeholder="https://company.com"
            variant={fieldErrors.companyWebsite ? 'error' : 'default'}
            fullWidth
            value={formData.companyWebsite ?? ''}
            onChange={(e) => handleChange('companyWebsite', e.target.value)}
          />
          {fieldErrors.companyWebsite && <span className={styles.inputError}>{fieldErrors.companyWebsite}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="companyLogo" className={styles.label}>Company Logo URL</label>
          <Input
            id="companyLogo"
            type="url"
            placeholder="https://company.com/logo.png"
            variant={fieldErrors.companyLogo ? 'error' : 'default'}
            fullWidth
            value={formData.companyLogo ?? ''}
            onChange={(e) => handleChange('companyLogo', e.target.value)}
          />
          {fieldErrors.companyLogo && <span className={styles.inputError}>{fieldErrors.companyLogo}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="secondary" size="medium" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Experience' : 'Create Experience'}
        </Button>
      </div>
    </form>
  )
}
