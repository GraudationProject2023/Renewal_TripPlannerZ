export const IS_DEV =
  // NEXT_PUBLIC_APP_ENV is defined only in Vercel environment variables (not in local .env).
  // Distinguishes dev branch deployment from production, since Vercel always sets NODE_ENV to 'production'.
  process.env.NEXT_PUBLIC_APP_ENV === 'development' ||
  process.env.NODE_ENV === 'development'
