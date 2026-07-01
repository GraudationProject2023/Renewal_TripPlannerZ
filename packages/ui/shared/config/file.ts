import { FileType } from '../lib/file'

export const FILE_TYPE_COLORS: Record<FileType, string> = {
  pdf: 'bg-file-pdf',
  docx: 'bg-file-docx',
  txt: 'bg-file-txt',
  md: 'bg-file-md',
  jpg: 'bg-file-jpg',
  jpeg: 'bg-file-jpeg',
  gif: 'bg-file-gif',
  png: 'bg-file-png',
  webp: 'bg-file-webp',
}

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  txt: 'TXT',
  md: 'MD',
  jpg: 'JPG',
  jpeg: 'JPEG',
  gif: 'GIF',
  png: 'PNG',
  webp: 'WEBP',
}

export const FILE_EXTENSION_MAP: Record<string, FileType> = {
  '.pdf': 'pdf',
  '.doc': 'docx',
  '.docx': 'docx',
  '.txt': 'txt',
  '.md': 'md',
  '.markdown': 'md',
  '.jpg': 'jpg',
  '.jpeg': 'jpeg',
  '.gif': 'gif',
  '.png': 'png',
  '.webp': 'webp',
}

export const DEFAULT_FILE_TYPE: FileType = 'pdf'

// File category groupings
export const DOCUMENT_TYPES: FileType[] = ['pdf', 'docx', 'txt', 'md']
export const IMAGE_TYPES: FileType[] = ['jpg', 'jpeg', 'gif', 'png', 'webp']

// Default validation config
export const DEFAULT_VALIDATION_CONFIG = {
  maxSize: 100 * 1024 * 1024, // 100MB
  maxFiles: 3,
  allowedTypes: [...DOCUMENT_TYPES, ...IMAGE_TYPES] as FileType[],
  maxFileNameLength: 100,
}
