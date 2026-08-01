/*
 * HTTP Infrastructure Configuration
 *
 * Reads environment variables for base URL and request timeout with safe defaults.
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:8080/api/v1'

export const REQUEST_TIMEOUT: number =
  Number(import.meta.env.VITE_REQUEST_TIMEOUT as string | undefined) || 10000
