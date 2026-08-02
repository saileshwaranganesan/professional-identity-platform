/*
 * ConfirmDialog Component
 *
 * Accessible confirmation modal for destructive or state-changing operations.
 * Wraps Modal primitive with custom action buttons and icon indicator.
 */

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

import styles from './ConfirmDialog.module.css'

export type ConfirmVariant = 'danger' | 'warning' | 'info'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const iconClassMap: Record<ConfirmVariant, string> = {
    danger: styles.iconDanger ?? '',
    warning: styles.iconWarning ?? '',
    info: styles.iconInfo ?? '',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} preventBackdropClose={isLoading} maxWidth="440px">
      <div className={styles.header}>
        <div className={`${styles.iconWrapper} ${iconClassMap[variant]}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="medium" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="medium"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
