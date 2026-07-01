export const extractLinks = (text: string): string[] => {
  const urlRegex = /\b(?:https?:\/\/|www\.)[^\s,]+/g
  return text.match(urlRegex) || []
}

export const isOnlyLinks = (text: string): boolean => {
  const cleaned = text.replace(/[\s,]+/g, '')
  const links = extractLinks(text).join('')
  return links === cleaned
}
