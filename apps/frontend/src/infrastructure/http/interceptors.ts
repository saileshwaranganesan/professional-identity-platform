/*
 * HTTP Infrastructure Interceptors
 *
 * Extensible request/response interceptors.
 * Injects Authorization header when token getter returns a value.
 * Normalizes HTTP failure responses via normalizeError.
 */

import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import { normalizeError } from './errors'

// Extensible placeholder token getter. Will connect to Auth store in future phases.
let tokenGetter: (() => string | null) | null = null

export function setTokenGetter(getter: () => string | null): void {
  tokenGetter = getter
}

export function setupInterceptors(axiosInstance: AxiosInstance): void {
  // Request Interceptor — Auth header injection
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (tokenGetter) {
        const token = tokenGetter()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error: unknown) => Promise.reject(normalizeError(error)),
  )

  // Response Interceptor — Error normalization
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => Promise.reject(normalizeError(error)),
  )
}
