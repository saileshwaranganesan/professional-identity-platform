import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { LoginForm } from './LoginForm'

// Mock useNavigate and useAuth
const mockNavigate = vi.fn()
const mockLogin = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/application/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}))

describe('LoginForm Component', () => {
  it('renders login form with email, password fields and sign in button', () => {
    render(<LoginForm />)

    expect(screen.getByText('Admin Portal')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('shows validation error when submitted with invalid email format', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'invalid-email' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'short' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument()
    })
  })

  it('calls login function and navigates to admin dashboard on valid credentials', async () => {
    mockLogin.mockResolvedValueOnce({})

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Admin@123456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'Admin@123456',
      })
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' })
    })
  })
})
