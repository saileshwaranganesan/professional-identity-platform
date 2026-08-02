/*
 * ContactForm Component
 *
 * Public visitor contact submission form (Layer 4 — Presentation Layer).
 * Validates payload via Zod contactFormSchema and dispatches submit mutation.
 */

import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSubmitContactMessage } from '@/application/contact'
import { contactFormSchema, type CreateContactFormData } from '@/domain/contact'

import styles from './ContactForm.module.css'

export function ContactForm() {
  const submitMutation = useSubmitContactMessage()

  const [formData, setFormData] = useState<CreateContactFormData>({
    senderName: '',
    senderEmail: '',
    subject: '',
    content: '',
  })

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateContactFormData, string>>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = <K extends keyof CreateContactFormData>(
    field: K,
    value: CreateContactFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    if (isSuccess) setIsSuccess(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const result = contactFormSchema.safeParse(formData)
    if (!result.success) {
      const formatted: Partial<Record<keyof CreateContactFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formatted[issue.path[0] as keyof CreateContactFormData] = issue.message
        }
      })
      setFieldErrors(formatted)
      return
    }

    try {
      await submitMutation.mutateAsync(result.data)
      setIsSuccess(true)
      setFormData({ senderName: '', senderEmail: '', subject: '', content: '' })
    } catch {
      // Error handled by mutation state
    }
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} className={styles.form} noValidate>
      <h3 className={styles.title}>Send a Message</h3>

      {isSuccess && (
        <div className={styles.successBanner}>
          ✓ Thank you for your message! Your message has been sent successfully.
        </div>
      )}

      {submitMutation.isError && (
        <div className={styles.errorBanner}>
          Failed to send message: {submitMutation.error.message || 'Please try again.'}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="senderName" className={styles.label}>Your Name *</label>
          <Input
            id="senderName"
            placeholder="Jane Doe"
            variant={fieldErrors.senderName ? 'error' : 'default'}
            fullWidth
            value={formData.senderName}
            onChange={(e) => handleChange('senderName', e.target.value)}
          />
          {fieldErrors.senderName && <span className={styles.inputError}>{fieldErrors.senderName}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="senderEmail" className={styles.label}>Your Email *</label>
          <Input
            id="senderEmail"
            type="email"
            placeholder="jane@example.com"
            variant={fieldErrors.senderEmail ? 'error' : 'default'}
            fullWidth
            value={formData.senderEmail}
            onChange={(e) => handleChange('senderEmail', e.target.value)}
          />
          {fieldErrors.senderEmail && <span className={styles.inputError}>{fieldErrors.senderEmail}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="subject" className={styles.label}>Subject *</label>
        <Input
          id="subject"
          placeholder="e.g. Inquiry regarding architecture consulting"
          variant={fieldErrors.subject ? 'error' : 'default'}
          fullWidth
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
        />
        {fieldErrors.subject && <span className={styles.inputError}>{fieldErrors.subject}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="content" className={styles.label}>Message *</label>
        <textarea
          id="content"
          placeholder="Write your message here..."
          className={styles.textarea}
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
        />
        {fieldErrors.content && <span className={styles.inputError}>{fieldErrors.content}</span>}
      </div>

      <div className={styles.actions}>
        <Button variant="primary" size="medium" type="submit" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  )
}