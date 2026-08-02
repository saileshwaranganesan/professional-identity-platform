import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

function ProblematicComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test Rendering Exception')
  }
  return <div>Normal Content</div>
}

describe('ErrorBoundary Component', () => {
  // Suppress console.error in Vitest output for intentional error boundary test
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  it('renders children normally when no exception is thrown', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Normal Content')).toBeInTheDocument()
  })

  it('renders fallback error UI when a child component throws an unhandled error', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test Rendering Exception')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('resets error state when Try Again button is clicked', () => {
    const handleReset = vi.fn()

    render(
      <ErrorBoundary onReset={handleReset}>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(handleReset).toHaveBeenCalledTimes(1)
  })
})
