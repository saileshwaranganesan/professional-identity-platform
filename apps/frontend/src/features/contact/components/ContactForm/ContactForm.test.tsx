import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { ContactForm } from './ContactForm'

const mockMutateAsync = vi.fn()

vi.mock('@/application/contact', () => ({
  useSubmitContactMessage: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
}))

describe('ContactForm Component', () => {
  it('renders visitor contact form fields and submit button', () => {
    render(<ContactForm />)

    expect(screen.getByText('Send a Message')).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    render(<ContactForm />)

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Must be a valid email address')).toBeInTheDocument()
    })
  })

  it('submits contact message and displays success banner on valid input', async () => {
    mockMutateAsync.mockResolvedValueOnce({})

    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: 'Jane Visitor' } })
    fireEvent.change(screen.getByLabelText(/Your Email/i), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Consulting Query' } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello, I would like to schedule a call.' } })

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }))

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        senderName: 'Jane Visitor',
        senderEmail: 'jane@example.com',
        subject: 'Consulting Query',
        content: 'Hello, I would like to schedule a call.',
      })
      expect(screen.getByText(/Thank you for your message!/i)).toBeInTheDocument()
    })
  })
})
