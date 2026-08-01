/*
 * HTTP Infrastructure Public API
 *
 * Single entry barrel export for the Infrastructure Layer (FSAS-001 §5.1).
 */

export { httpClient } from './client'
export { ApiError, normalizeError } from './errors'
export { setTokenGetter } from './interceptors'
export type { ApiErrorType, NormalizedError, RequestConfig } from './types'
