/*
 * Axios Singleton Client Instance
 *
 * Single configured Axios instance for all HTTP transport (FSAS-001 §5.1).
 */

import axios from 'axios'

import { API_BASE_URL, REQUEST_TIMEOUT } from './config'
import { setupInterceptors } from './interceptors'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

setupInterceptors(httpClient)
