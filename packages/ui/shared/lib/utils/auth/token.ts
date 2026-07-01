export interface IDecodedAccessTokenPayload {
  email?: string
  sub?: string
  exp?: number
  user_metadata?: {
    full_name?: string
    name?: string
    avatar_url?: string
  }
  app_metadata?: {
    provider?: string
  }
}

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const padded = normalized + '='.repeat(padding === 0 ? 0 : 4 - padding)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

export const decodeAccessTokenPayload = (
  token: string,
): IDecodedAccessTokenPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = decodeBase64Url(parts[1]!)
    return JSON.parse(payload) as IDecodedAccessTokenPayload
  } catch (error) {
    console.error('Failed to decode access token payload:', error)
    return null
  }
}
