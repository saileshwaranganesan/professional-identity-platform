/*
 * HTTP Infrastructure Types
 *
 * Defines transport-related interfaces and error type taxonomy (FSAS-001 §8.6).
 * Formatted to comply with exactOptionalPropertyTypes: true.
 */

export type ApiErrorType =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CANCELLED_ERROR'
  | 'UNAUTHORIZED_ERROR'
  | 'VALIDATION_ERROR'
  | 'API_ERROR'
  | 'UNKNOWN_ERROR'

export interface NormalizedError {
  type: ApiErrorType
  message: string
  status?: number | undefined
  details?: unknown
  originalError: unknown
}

export interface RequestConfig {
  headers?: Record<string, string> | undefined
  params?: Record<string, unknown> | undefined
}
