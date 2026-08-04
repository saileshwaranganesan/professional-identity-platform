/*
 * CertificationForm Component
 *
 * Form component for Create and Edit Certification modes.
 * Validates inputs using certificationFormSchema.
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  certificationFormSchema,
  type Certification,
  type CreateCertificationFormData,
} from '@/domain/certifications'

import styles from './CertificationForm.module.css'

export interface CertificationFormProps {
  initialData?: Certification | null | undefined
  onSubmit: (data: CreateCertificationFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CertificationForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CertificationFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateCertificationFormData>({
    name: initialData?.name ?? '',
    issuingOrganization: initialData?.issuingOrganization ?? '',
    issueDate: initialData?.issueDate ?? '',
    expiryDate: initialData?.expiryDate ?? '',
    credentialId: initialData?.credentialId ?? '',
    credentialUrl: initialData?.credentialUrl ?? '',
    doesNotExpire: initialData?.doesNotExpire ?? false,
    displayOrder: initialData?.displayOrder ?? 0,
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateCertificationFormData, string>>>({})

  const handleChange = <K extends keyof CreateCertificationFormData>(
    field: K,
    value: CreateCertificationFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = certificationFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateCertificationFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateCertificationFormData] = issue.message
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
          <label htmlFor="name" className={styles.label}>Certification Name *</label>
          <Input
            id="name"
            placeholder="e.g. AWS Certified Solutions Architect"
            variant={fieldErrors.name ? 'error' : 'default'}
            fullWidth
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {fieldErrors.name && <span className={styles.inputError}>{fieldErrors.name}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="issuingOrganization" className={styles.label}>Issuing Organization *</label>
          <Input
            id="issuingOrganization"
            placeholder="e.g. Amazon Web Services, Google"
            variant={fieldErrors.issuingOrganization ? 'error' : 'default'}
            fullWidth
            value={formData.issuingOrganization}
            onChange={(e) => handleChange('issuingOrganization', e.target.value)}
          />
          {fieldErrors.issuingOrganization && <span className={styles.inputError}>{fieldErrors.issuingOrganization}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="issueDate" className={styles.label}>Issue Date *</label>
          <Input
            id="issueDate"
            type="date"
            variant={fieldErrors.issueDate ? 'error' : 'default'}
            fullWidth
            value={formData.issueDate}
            onChange={(e) => handleChange('issueDate', e.target.value)}
          />
          {fieldErrors.issueDate && <span className={styles.inputError}>{fieldErrors.issueDate}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
          <Input
            id="expiryDate"
            type="date"
            disabled={formData.doesNotExpire}
            variant={fieldErrors.expiryDate ? 'error' : 'default'}
            fullWidth
            value={formData.doesNotExpire ? '' : (formData.expiryDate ?? '')}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
          />
          {fieldErrors.expiryDate && <span className={styles.inputError}>{fieldErrors.expiryDate}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.doesNotExpire}
              onChange={(e) => {
                const checked = e.target.checked
                handleChange('doesNotExpire', checked)
                if (checked) {
                  handleChange('expiryDate', '')
                }
              }}
            />
            This certification does not expire
          </label>
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

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="credentialId" className={styles.label}>Credential ID</label>
          <Input
            id="credentialId"
            placeholder="e.g. AWS-12345678"
            variant={fieldErrors.credentialId ? 'error' : 'default'}
            fullWidth
            value={formData.credentialId ?? ''}
            onChange={(e) => handleChange('credentialId', e.target.value)}
          />
          {fieldErrors.credentialId && <span className={styles.inputError}>{fieldErrors.credentialId}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="credentialUrl" className={styles.label}>Credential Verification URL</label>
          <Input
            id="credentialUrl"
            placeholder="e.g. https://www.credly.com/badges/12345"
            variant={fieldErrors.credentialUrl ? 'error' : 'default'}
            fullWidth
            value={formData.credentialUrl ?? ''}
            onChange={(e) => handleChange('credentialUrl', e.target.value)}
          />
          {fieldErrors.credentialUrl && <span className={styles.inputError}>{fieldErrors.credentialUrl}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="medium" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Certification' : 'Add Certification'}
        </Button>
      </div>
    </form>
  )
}
