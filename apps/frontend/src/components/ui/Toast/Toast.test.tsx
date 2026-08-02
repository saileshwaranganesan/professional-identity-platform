import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ToastProvider, useToast } from './index'

function TestComponent() {
  const toast = useToast()
  return (
    <div>
      <button onClick={() => toast.success('Operation succeeded')}>Trigger Success</button>
      <button onClick={() => toast.error('Something went wrong')}>Trigger Error</button>
    </div>
  )
}

describe('Toast Component & Provider', () => {
  it('displays success toast message on trigger and dismisses on close button click', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    )

    act(() => {
      fireEvent.click(screen.getByText('Trigger Success'))
    })

    expect(screen.getByText('Operation succeeded')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: 'Close notification' })
    act(() => {
      fireEvent.click(closeBtn)
    })

    expect(screen.queryByText('Operation succeeded')).not.toBeInTheDocument()
  })

  it('displays error toast message on trigger', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    )

    act(() => {
      fireEvent.click(screen.getByText('Trigger Error'))
    })

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
