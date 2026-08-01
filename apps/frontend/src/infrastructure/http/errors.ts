/*
 * HTTP Infrastructure Error Taxonomy & Normalization
 *
 * Normalizes raw Axios/network errors into strongly-typed error models (FSAS-001 §8.6).
 */

import type { AxiosError } from 'axios'
import axios from 'axios'

import type { ApiErrorType, NormalizedError } from './types'

export class ApiError extends Error implements NormalizedError {
  readonly type: ApiErrorType
  readonly status?: number | undefined
  readonly details?: unknown
  readonly originalError: unknown

  constructor(
    type: ApiErrorType,
    message: string,
    status?: number,
    details?: unknown,
    originalError?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.status = status
    this.details = details
    this.originalError = originalError
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isCancel(error)) {
    return new ApiError(
      'CANCELLED_ERROR',
      'Request was cancelled',
      undefined,
      undefined,
      error,
    )
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Record<string, unknown>>

    if (axiosError.code === 'ECONNABORTED') {
      return new ApiError(
        'TIMEOUT_ERROR',
        'Request timed out. Please try again.',
        undefined,
        undefined,
        error,
      )
    }

    if (!axiosError.response) {
      return new ApiError(
        'NETWORK_ERROR',
        'Network error. Please check your internet connection.',
        undefined,
        undefined,
        error,
      )
    }

    const status = axiosError.response.status
    const data = axiosError.response.data
    const message =
      (data?.message as string | undefined) ??
      (data?.error as string | undefined) ??
      axiosError.message ??
      'An unexpected server error occurred.'

    if (status === 401) {
      return new ApiError('UNAUTHORIZED_ERROR', message, status, data, error)
    }

    if (status === 422 || status === 400) {
      return new ApiError('VALIDATION_ERROR', message, status, data, error)
    }

    return new ApiError('API_ERROR', message, status, data, error)
  }

  const fallbackMessage =
    error instanceof Error ? error.message : 'An unknown error occurred.'
  return new ApiError('UNKNOWN_ERROR', fallbackMessage, undefined, undefined, error)
}
