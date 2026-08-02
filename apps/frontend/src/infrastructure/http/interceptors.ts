/*
 * HTTP Infrastructure Interceptors
 *
 * Extensible request/response interceptors.
 * Normalizes HTTP failure responses via normalizeError.
 * Cookie-based auth is handled automatically via withCredentials: true.
 */

import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import { normalizeError } from './errors'

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  // Request Interceptor — Passes configuration through
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error: unknown) => Promise.reject(normalizeError(error)),
  )

  // Response Interceptor — Error normalization
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => Promise.reject(normalizeError(error)),
  )
}
