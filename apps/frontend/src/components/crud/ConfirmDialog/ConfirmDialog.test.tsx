import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog Component', () => {
  it('renders title, message, and action buttons when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )

    expect(screen.getByText('Delete Project')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this project?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel', hidden: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm', hidden: true })).toBeInTheDocument()
  })

  it('triggers onConfirm and onClose when buttons are clicked', () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()

    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Item"
        message="Confirm deletion?"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirm', hidden: true }))
    expect(handleConfirm).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel', hidden: true }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('disables buttons when isLoading is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Deleting..."
        message="Please wait"
        isLoading={true}
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: 'Cancel', hidden: true })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Processing...', hidden: true })).toBeDisabled()
  })
})
