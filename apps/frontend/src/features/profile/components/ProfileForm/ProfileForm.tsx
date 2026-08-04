/*
 * ProfileForm Component
 *
 * Form component for updating user profile settings.
 * Includes client-side validation using Zod (updateProfileFormSchema).
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  updateProfileFormSchema,
  type Profile,
  type UpdateProfileFormData,
} from '@/domain/profile'

import styles from './ProfileForm.module.css'

export interface ProfileFormProps {
  initialData?: Profile | null | undefined
  onSubmit: (data: UpdateProfileFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ProfileForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    username: initialData?.username ?? '',
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    headline: initialData?.headline ?? '',
    bio: initialData?.bio ?? '',
    location: initialData?.location ?? '',
    website: initialData?.website ?? '',
    phone: initialData?.phone ?? '',
    profileImagePath: initialData?.profileImagePath ?? '',
    bannerImagePath: initialData?.bannerImagePath ?? '',
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UpdateProfileFormData, string>>>({})

  const handleChange = <K extends keyof UpdateProfileFormData>(
    field: K,
    value: UpdateProfileFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = updateProfileFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof UpdateProfileFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof UpdateProfileFormData] = issue.message
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
          <label htmlFor="username" className={styles.label}>Username *</label>
          <Input
            id="username"
            placeholder="e.g. janesmith"
            variant={fieldErrors.username ? 'error' : 'default'}
            fullWidth
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
          {fieldErrors.username && <span className={styles.inputError}>{fieldErrors.username}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="firstName" className={styles.label}>First Name</label>
          <Input
            id="firstName"
            placeholder="e.g. Jane"
            variant={fieldErrors.firstName ? 'error' : 'default'}
            fullWidth
            value={formData.firstName ?? ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
          {fieldErrors.firstName && <span className={styles.inputError}>{fieldErrors.firstName}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName" className={styles.label}>Last Name</label>
          <Input
            id="lastName"
            placeholder="e.g. Smith"
            variant={fieldErrors.lastName ? 'error' : 'default'}
            fullWidth
            value={formData.lastName ?? ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
          {fieldErrors.lastName && <span className={styles.inputError}>{fieldErrors.lastName}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="headline" className={styles.label}>Professional Headline</label>
        <Input
          id="headline"
          placeholder="e.g. Senior Software Architect & Lead Developer"
          variant={fieldErrors.headline ? 'error' : 'default'}
          fullWidth
          value={formData.headline ?? ''}
          onChange={(e) => handleChange('headline', e.target.value)}
        />
        {fieldErrors.headline && <span className={styles.inputError}>{fieldErrors.headline}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="bio" className={styles.label}>Bio / Summary</label>
        <textarea
          id="bio"
          className={`${styles.textarea} ${fieldErrors.bio ? styles.textareaError : ''}`}
          placeholder="Write a concise overview of your professional background, expertise, and career goals."
          value={formData.bio ?? ''}
          onChange={(e) => handleChange('bio', e.target.value)}
        />
        {fieldErrors.bio && <span className={styles.inputError}>{fieldErrors.bio}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="location" className={styles.label}>Location</label>
          <Input
            id="location"
            placeholder="e.g. San Francisco, CA"
            variant={fieldErrors.location ? 'error' : 'default'}
            fullWidth
            value={formData.location ?? ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
          {fieldErrors.location && <span className={styles.inputError}>{fieldErrors.location}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>Phone Number</label>
          <Input
            id="phone"
            placeholder="e.g. +1 (555) 123-4567"
            variant={fieldErrors.phone ? 'error' : 'default'}
            fullWidth
            value={formData.phone ?? ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          {fieldErrors.phone && <span className={styles.inputError}>{fieldErrors.phone}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="website" className={styles.label}>Personal Website / Portfolio URL</label>
        <Input
          id="website"
          placeholder="e.g. https://janesmith.dev"
          variant={fieldErrors.website ? 'error' : 'default'}
          fullWidth
          value={formData.website ?? ''}
          onChange={(e) => handleChange('website', e.target.value)}
        />
        {fieldErrors.website && <span className={styles.inputError}>{fieldErrors.website}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="profileImagePath" className={styles.label}>Profile Image URL</label>
          <Input
            id="profileImagePath"
            placeholder="e.g. https://example.com/avatar.jpg"
            variant={fieldErrors.profileImagePath ? 'error' : 'default'}
            fullWidth
            value={formData.profileImagePath ?? ''}
            onChange={(e) => handleChange('profileImagePath', e.target.value)}
          />
          {fieldErrors.profileImagePath && <span className={styles.inputError}>{fieldErrors.profileImagePath}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="bannerImagePath" className={styles.label}>Banner Image URL</label>
          <Input
            id="bannerImagePath"
            placeholder="e.g. https://example.com/banner.jpg"
            variant={fieldErrors.bannerImagePath ? 'error' : 'default'}
            fullWidth
            value={formData.bannerImagePath ?? ''}
            onChange={(e) => handleChange('bannerImagePath', e.target.value)}
          />
          {fieldErrors.bannerImagePath && <span className={styles.inputError}>{fieldErrors.bannerImagePath}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  )
}
