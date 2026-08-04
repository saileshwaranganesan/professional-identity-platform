/*
 * SocialLinkForm Component
 *
 * Form component for Create and Edit SocialLink modes.
 * Validates inputs using socialLinkFormSchema.
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  SOCIAL_PLATFORMS,
  socialLinkFormSchema,
  type CreateSocialLinkFormData,
  type SocialLink,
  type SocialPlatform,
} from '@/domain/socialLinks'

import { SocialPlatformIcon } from '../SocialPlatformIcon/SocialPlatformIcon'
import styles from './SocialLinkForm.module.css'

export interface SocialLinkFormProps {
  initialData?: SocialLink | null | undefined
  onSubmit: (data: CreateSocialLinkFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function SocialLinkForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SocialLinkFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateSocialLinkFormData>({
    platform: initialData?.platform ?? 'GITHUB',
    url: initialData?.url ?? '',
    displayOrder: initialData?.displayOrder ?? 0,
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateSocialLinkFormData, string>>>({})

  const handleChange = <K extends keyof CreateSocialLinkFormData>(
    field: K,
    value: CreateSocialLinkFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = socialLinkFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateSocialLinkFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateSocialLinkFormData] = issue.message
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
          <label htmlFor="platform" className={styles.label}>Platform *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SocialPlatformIcon platform={formData.platform} size={24} />
            <select
              id="platform"
              className={styles.select}
              value={formData.platform}
              onChange={(e) => handleChange('platform', e.target.value as SocialPlatform)}
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.platform && <span className={styles.inputError}>{fieldErrors.platform}</span>}
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

      <div className={styles.field}>
        <label htmlFor="url" className={styles.label}>Profile / Channel URL *</label>
        <Input
          id="url"
          placeholder="e.g. https://github.com/username or https://linkedin.com/in/username"
          variant={fieldErrors.url ? 'error' : 'default'}
          fullWidth
          value={formData.url}
          onChange={(e) => handleChange('url', e.target.value)}
        />
        {fieldErrors.url && <span className={styles.inputError}>{fieldErrors.url}</span>}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="medium" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Social Link' : 'Add Social Link'}
        </Button>
      </div>
    </form>
  )
}
