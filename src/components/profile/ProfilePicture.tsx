'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface ProfilePictureProps {
  currentImage?: string | null
  userName: string
  onUpdate?: () => void
}

export default function ProfilePicture({ currentImage, userName, onUpdate }: ProfilePictureProps) {
  const { data: session, update: updateSession } = useSession()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Update session with new image
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          image: data.imageUrl
        }
      })

      // Force a refresh of the session
      await updateSession()

      // Callback
      onUpdate?.()

      // Reset
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Reload the page to ensure all components update
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete profile picture?')) return

    setUploading(true)
    try {
      const res = await fetch('/api/user/profile-picture', {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Delete failed')
      }

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          image: null
        }
      })

      await updateSession()
      
      // Callback
      onUpdate?.()

      // Reload the page
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const cancelPreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Helper function to get image source
  const getImageSrc = () => {
    if (preview) return preview
    if (currentImage) {
      // Add timestamp to prevent caching
      return `${currentImage}?t=${new Date().getTime()}`
    }
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600">
          {getImageSrc() ? (
            <img
              src={getImageSrc()!}
              alt={userName}
              className="w-full h-full object-cover"
              key={getImageSrc()} // Force re-render when image changes
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-white">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
          aria-label="Change profile picture"
          title="Upload new picture"
        >
          <Camera size={18} />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-picture-upload"
          aria-label="Upload profile picture"
        />
      </div>

      {/* Preview Actions */}
      {preview && (
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center space-x-2"
            aria-label="Save uploaded picture"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
          <button
            onClick={cancelPreview}
            disabled={uploading}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Cancel upload"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Current Image Actions */}
      {!preview && currentImage && (
        <button
          onClick={handleDelete}
          disabled={uploading}
          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          aria-label="Remove profile picture"
        >
          {uploading ? 'Deleting...' : 'Remove picture'}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}