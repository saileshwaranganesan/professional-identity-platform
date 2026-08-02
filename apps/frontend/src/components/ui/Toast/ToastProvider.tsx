/*
 * ToastProvider Component
 *
 * Global context provider managing active toast state.
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { ToastContainer } from './ToastContainer'
import {
  ToastContext,
  type ToastContextValue,
  type ToastMessage,
  type ToastType,
} from './ToastContext'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      setToasts((prev) => [...prev.slice(-4), { id, type, message, duration }])
    },
    [],
  )

  const success = useCallback((message: string, duration?: number) => showToast('success', message, duration), [showToast])
  const error = useCallback((message: string, duration?: number) => showToast('error', message, duration), [showToast])
  const warning = useCallback((message: string, duration?: number) => showToast('warning', message, duration), [showToast])
  const info = useCallback((message: string, duration?: number) => showToast('info', message, duration), [showToast])

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      dismissToast,
    }),
    [showToast, success, error, warning, info, dismissToast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}