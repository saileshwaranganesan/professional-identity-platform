/*
 * ToastContainer Component
 *
 * Viewport fixed container rendering list of active toasts.
 */

import { Toast } from './Toast'
import type { ToastMessage } from './ToastContext'
import styles from './Toast.module.css'

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}