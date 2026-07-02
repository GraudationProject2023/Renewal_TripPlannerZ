'use client'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { getApiBaseUrl } from './base-url'

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 600000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_STORAGE: 'user-storage',
} as const

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
})

export const SESSION_EXPIRY_EVENT = 'auth:session-expired'

let isHandlingSessionExpiry = false

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

export const clearAccessToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
}

const signOutFromBackend = async (): Promise<void> => {
  try {
    await axiosInstance.post('/user/auth/logout')
  } catch (error) {
    console.error('Backend logout failed:', error)
  }
}

const dispatchSessionExpiryEvent = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRY_EVENT))
  }
}

export const handleSessionExpiryProcess = async (): Promise<void> => {
  if (isHandlingSessionExpiry || typeof window === 'undefined') {
    return
  }

  isHandlingSessionExpiry = true

  try {
    await signOutFromBackend()
    dispatchSessionExpiryEvent()
  } catch (error) {
    console.error('Error during session expiry:', error)
    dispatchSessionExpiryEvent()
  } finally {
    isHandlingSessionExpiry = false
  }
}

const handleRequest = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }
  // TODO: Add Accept-Language header
  //   config.headers['Accept-Language'] = i18n.language

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
}

const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const handleResponse = (response: AxiosResponse): AxiosResponse => {
  return response
}

const handleResponseError = async (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401) {
    await handleSessionExpiryProcess()
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.request.use(handleRequest, handleRequestError)
axiosInstance.interceptors.response.use(handleResponse, handleResponseError)

export const isAxiosError = axios.isAxiosError

export default axiosInstance
