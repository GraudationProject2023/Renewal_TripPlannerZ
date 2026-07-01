const DEFAULT_BROWSER_API_BASE_URL = '/api/v1'

const normalizeBaseUrl = (baseUrl: string): string => baseUrl.replace(/\/$/, '')

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return DEFAULT_BROWSER_API_BASE_URL
  }

  const envBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_BROWSER_API_BASE_URL

  if (!envBaseUrl.trim()) {
    return DEFAULT_BROWSER_API_BASE_URL
  }

  return normalizeBaseUrl(envBaseUrl.trim())
}

export const getApiUrl = (path: string, baseUrl?: string): string => {
  const resolvedBaseUrl = baseUrl || getApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizeBaseUrl(resolvedBaseUrl)}${normalizedPath}`
}
