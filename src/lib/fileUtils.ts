import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { UPLOAD_CONFIG, UploadedFile } from '@/types/upload'

export const UPLOAD_DIR = path.join(process.cwd(), UPLOAD_CONFIG.uploadDir)
export const AVATAR_DIR = path.join(process.cwd(), UPLOAD_CONFIG.avatarDir)

export async function ensureUploadDirs(): Promise<void> {
  try {
    await fs.mkdir(AVATAR_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating upload directories:', error)
    throw new Error('Failed to create upload directories')
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function generateFileName(originalName: string): string {
  const ext = getFileExtension(originalName)
  return `${uuidv4()}${ext ? `.${ext}` : ''}`
}

export function getPublicUrl(filename: string): string {
  return `/uploads/avatars/${filename}`
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

export function isValidFileType(mimeType: string): boolean {
  return UPLOAD_CONFIG.allowedTypes.includes(mimeType)
}

export function isValidFileSize(size: number): boolean {
  return size <= UPLOAD_CONFIG.maxFileSize
}

export async function getFileInfo(filePath: string): Promise<UploadedFile | null> {
  try {
    const stats = await fs.stat(filePath)
    const filename = path.basename(filePath)
    
    return {
      filename,
      originalName: filename, // You might want to store original name separately
      path: filePath,
      url: getPublicUrl(filename),
      size: stats.size,
      mimeType: `image/${path.extname(filePath).slice(1)}`,
      createdAt: stats.birthtime
    }
  } catch (error) {
    console.error('Error getting file info:', error)
    return null
  }
}

export async function listUploadedFiles(directory: string = AVATAR_DIR): Promise<UploadedFile[]> {
  try {
    const files = await fs.readdir(directory)
    const fileInfos: UploadedFile[] = []
    
    for (const file of files) {
      if (file === '.gitkeep') continue
      
      const filePath = path.join(directory, file)
      const info = await getFileInfo(filePath)
      if (info) {
        fileInfos.push(info)
      }
    }
    
    return fileInfos
  } catch (error) {
    console.error('Error listing files:', error)
    return []
  }
}

export async function cleanupOldFiles(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
  // maxAge in milliseconds, default 7 days
  try {
    const files = await listUploadedFiles()
    const now = Date.now()
    let deletedCount = 0
    
    for (const file of files) {
      const fileAge = now - file.createdAt.getTime()
      if (fileAge > maxAge) {
        const deleted = await deleteFile(file.path)
        if (deleted) deletedCount++
      }
    }
    
    return deletedCount
  } catch (error) {
    console.error('Error cleaning up old files:', error)
    return 0
  }
}