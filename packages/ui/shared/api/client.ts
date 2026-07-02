'use client'
import type { AxiosRequestConfig } from 'axios'
import axiosInstance, { isAxiosError } from '../lib/utils/api/axiosInstance'
import type { ApiEnvelope, ApiError } from './types'

/** 표준 에러 래퍼를 던지는 예외. code로 분기하고 message는 사용자 노출용. */
export class ApiRequestError extends Error {
  readonly code: string
  readonly status?: number

  constructor(error: ApiError, status?: number) {
    super(error.message)
    this.name = 'ApiRequestError'
    this.code = error.code
    this.status = status
  }
}

/**
 * axiosInstance 위의 타입 안전 래퍼.
 * 성공 시 envelope.data를 언랩해서 반환하고, 실패 시 ApiRequestError를 던진다.
 */
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axiosInstance.request<ApiEnvelope<T>>(config)
    return response.data.data
  } catch (err) {
    if (isAxiosError(err)) {
      const envelope = err.response?.data as ApiEnvelope<unknown> | undefined
      if (envelope?.error) {
        throw new ApiRequestError(envelope.error, err.response?.status)
      }
    }
    throw err
  }
}

export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: 'GET', url })

export const apiPost = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: 'POST', url, data })

export const apiPut = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: 'PUT', url, data })

export const apiPatch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: 'PATCH', url, data })

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>({ ...config, method: 'DELETE', url })
