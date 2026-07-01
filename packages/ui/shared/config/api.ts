export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export const REDIRECT_PATHS = {
  MAIN: '/main',
  TERMS: '/terms',
  ERROR: '/error',
} as const

export const ERROR_REASONS = {
  MISSING_CODE: 'missing_code',
  FETCH_USER_FAILED: 'fetch_user_failed',
} as const
