export interface UploadConfig {
  maxFileSize: number
  allowedTypes: string[]
  uploadDir: string
  avatarDir: string
}

export interface UploadedFile {
  filename: string
  originalName: string
  path: string
  url: string
  size: number
  mimeType: string
  createdAt: Date
}

export interface UploadResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export const UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  uploadDir: 'public/uploads',
  avatarDir: 'public/uploads/avatars'
}