/*
 * Auth Domain Types
 *
 * Strongly-typed domain representations for User, Login Credentials, and Auth Session.
 */

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  username?: string | null
  firstName?: string | null
  lastName?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}
