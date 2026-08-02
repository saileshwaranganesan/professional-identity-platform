/*
 * ErrorBoundary Component
 *
 * Production-grade React Error Boundary catching unhandled rendering/lifecycle exceptions.
 * Provides fallback UI, retry capabilities, and centralized logging hook integration.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/components/ui/Button'

import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Placeholder error logging service function.
 * Connect to external monitoring provider (e.g. Sentry, LogRocket, Datadog) here.
 */
function logErrorToService(error: Error, errorInfo: ErrorInfo): void {
  // Production logging hook placeholder (e.g. Sentry.captureException)
  if (typeof console !== 'undefined' && console.error) {
    console.error('Unhandled React Rendering Error Captured:', error, errorInfo)
  }
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logErrorToService(error, errorInfo)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.description}>
              An unexpected error occurred while rendering this view. You can attempt to reload the view or return to the main dashboard.
            </p>

            {this.state.error?.message && (
              <div className={styles.errorDetails}>
                {this.state.error.message}
              </div>
            )}

            <div className={styles.actions}>
              <Button variant="primary" size="medium" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button
                variant="secondary"
                size="medium"
                onClick={() => { window.location.href = '/' }}
              >
                Go to Home Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
