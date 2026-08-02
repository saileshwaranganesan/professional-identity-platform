/*
 * Toast Item Component
 *
 * Single toast notification item.
 */

import { useEffect } from 'react'

import type { ToastMessage } from './ToastContext'
import styles from './Toast.module.css'

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

const icons: Record<ToastMessage['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, type, message, duration = 4000 } = toast

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => {
      onDismiss(id)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`${styles.toast} ${styles[type]}`}
    >
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        aria-label="Close notification"
        className={styles.closeButton}
        onClick={() => onDismiss(id)}
      >
        ×
      </button>
    </div>
  )
}