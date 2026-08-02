/*
 * ProjectForm Component
 *
 * Single reusable form for Create and Edit Project modes.
 * Controlled state with Zod schema validation (projectFormSchema).
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  projectFormSchema,
  type CreateProjectFormData,
  type Project,
  type ProjectStatus,
} from '@/domain/projects'

import styles from './ProjectForm.module.css'

export interface ProjectFormProps {
  initialData?: Project | null | undefined
  onSubmit: (data: CreateProjectFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProjectFormProps) {
  const isEditMode = Boolean(initialData)

  const [formData, setFormData] = useState<CreateProjectFormData>({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    headline: initialData?.headline ?? '',
    shortDescription: initialData?.shortDescription ?? '',
    description: initialData?.description ?? '',
    githubUrl: initialData?.githubUrl ?? '',
    liveDemoUrl: initialData?.liveUrl ?? '',
    documentationUrl: initialData?.documentationUrl ?? '',
    featured: initialData?.featured ?? false,
    published: initialData?.published ?? false,
    status: initialData?.status ?? 'COMPLETED',
    impact: initialData?.impact ?? '',
    startDate: initialData?.startDate ?? '',
    endDate: initialData?.endDate ?? '',
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateProjectFormData, string>>>({})

  const handleChange = <K extends keyof CreateProjectFormData>(field: K, value: CreateProjectFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (!isEditMode && field === 'title' && typeof value === 'string') {
        next.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
      return next
    })
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = projectFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateProjectFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateProjectFormData] = issue.message
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
          <label htmlFor="title" className={styles.label}>
            Project Title *
          </label>
          <Input
            id="title"
            placeholder="e.g. Portfolio Platform"
            variant={fieldErrors.title ? 'error' : 'default'}
            fullWidth
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          {fieldErrors.title && <span className={styles.inputError}>{fieldErrors.title}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="slug" className={styles.label}>
            URL Slug *
          </label>
          <Input
            id="slug"
            placeholder="portfolio-platform"
            variant={fieldErrors.slug ? 'error' : 'default'}
            fullWidth
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
          />
          {fieldErrors.slug && <span className={styles.inputError}>{fieldErrors.slug}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="headline" className={styles.label}>
          Headline / Tagline
        </label>
        <Input
          id="headline"
          placeholder="e.g. Production Full-Stack Identity System"
          variant={fieldErrors.headline ? 'error' : 'default'}
          fullWidth
          value={formData.headline ?? ''}
          onChange={(e) => handleChange('headline', e.target.value)}
        />
        {fieldErrors.headline && <span className={styles.inputError}>{fieldErrors.headline}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="shortDescription" className={styles.label}>
          Short Description
        </label>
        <textarea
          id="shortDescription"
          placeholder="Brief 1-2 sentence overview for cards..."
          className={styles.textarea}
          value={formData.shortDescription ?? ''}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
        />
        {fieldErrors.shortDescription && (
          <span className={styles.inputError}>{fieldErrors.shortDescription}</span>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="githubUrl" className={styles.label}>
            GitHub Repository URL
          </label>
          <Input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/username/repo"
            variant={fieldErrors.githubUrl ? 'error' : 'default'}
            fullWidth
            value={formData.githubUrl ?? ''}
            onChange={(e) => handleChange('githubUrl', e.target.value)}
          />
          {fieldErrors.githubUrl && <span className={styles.inputError}>{fieldErrors.githubUrl}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="liveDemoUrl" className={styles.label}>
            Live Demo URL
          </label>
          <Input
            id="liveDemoUrl"
            type="url"
            placeholder="https://myproject.com"
            variant={fieldErrors.liveDemoUrl ? 'error' : 'default'}
            fullWidth
            value={formData.liveDemoUrl ?? ''}
            onChange={(e) => handleChange('liveDemoUrl', e.target.value)}
          />
          {fieldErrors.liveDemoUrl && <span className={styles.inputError}>{fieldErrors.liveDemoUrl}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>
            Project Status
          </label>
          <select
            id="status"
            className={styles.select}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ProjectStatus)}
          >
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PLANNED">Planned</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.published}
              onChange={(e) => handleChange('published', e.target.checked)}
            />
            Published
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
            />
            Featured
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="medium" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
