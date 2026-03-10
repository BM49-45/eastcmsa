import { writeFile } from 'fs/promises'
import path from 'path'
import { 
  ensureUploadDirs, 
  generateFileName, 
  getPublicUrl, 
  deleteFile,
  isValidFileType,
  isValidFileSize,
  AVATAR_DIR,
  getFileInfo
} from '@/lib/fileUtils'
import { UploadedFile, UploadResponse } from '@/types/upload'

export class UploadService {
  static async uploadAvatar(file: File, userId: string, oldImageUrl?: string | null): Promise<UploadResponse> {
    try {
      // Validate file
      if (!file) {
        return { success: false, error: 'No file uploaded' }
      }

      if (!isValidFileType(file.type)) {
        return { 
          success: false, 
          error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WEBP' 
        }
      }

      if (!isValidFileSize(file.size)) {
        return { 
          success: false, 
          error: 'File too large. Maximum size is 5MB' 
        }
      }

      // Ensure directories exist
      await ensureUploadDirs()

      // Delete old image if exists
      if (oldImageUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', oldImageUrl)
        await deleteFile(oldImagePath)
      }

      // Save new file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const filename = generateFileName(file.name)
      const filepath = path.join(AVATAR_DIR, filename)
      
      await writeFile(filepath, buffer)

      // Get public URL
      const imageUrl = getPublicUrl(filename)

      return {
        success: true,
        imageUrl
      }
    } catch (error) {
      console.error('Upload service error:', error)
      return {
        success: false,
        error: 'Failed to upload file'
      }
    }
  }

  static async deleteAvatar(imageUrl: string): Promise<boolean> {
    try {
      if (!imageUrl) return false
      
      const imagePath = path.join(process.cwd(), 'public', imageUrl)
      return await deleteFile(imagePath)
    } catch (error) {
      console.error('Delete service error:', error)
      return false
    }
  }

  static async getAvatarInfo(imageUrl: string): Promise<UploadedFile | null> {
    try {
      if (!imageUrl) return null
      
      const imagePath = path.join(process.cwd(), 'public', imageUrl)
      return await getFileInfo(imagePath)
    } catch (error) {
      console.error('Get file info error:', error)
      return null
    }
  }
}