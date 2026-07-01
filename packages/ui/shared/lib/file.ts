export type FileType =
  'pdf' | 'docx' | 'txt' | 'md' | 'jpg' | 'jpeg' | 'gif' | 'png' | 'webp'

export interface FileItem {
  uuid: string
  name: string
  url: string
  type: FileType
  size?: string
}
