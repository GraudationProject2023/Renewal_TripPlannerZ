export function generateUuid(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  const { v4 } = require('uuid') as typeof import('uuid')
  return v4()
}
