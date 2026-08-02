/*
 * Modal Component
 *
 * Primitive backdrop overlay dialog container (Layer 4 — Presentation Layer).
 * Handles Escape key press and backdrop click dismissal.
 */

import { useEffect, type ReactNode } from 'react'

import styles from './Modal.module.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: string
  preventBackdropClose?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth,
  preventBackdropClose = false,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !preventBackdropClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, preventBackdropClose, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.backdrop}
      onClick={preventBackdropClose ? undefined : onClose}
      aria-hidden="true"
    >
      <div
        className={styles.modal}
        style={maxWidth ? { maxWidth } : undefined}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  )
}
