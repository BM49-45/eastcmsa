'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, CheckCircle, XCircle, Camera, Trash2 } from 'lucide-react'
import { saveProfileImage, getProfileImage, deleteProfileImage } from '@/lib/storage'

interface ProfileUploadProps {
  currentImage?: string | null
  onUploadComplete?: (url: string) => void
  onImageRemove?: () => void
}

export default function ProfileUpload({ 
  currentImage, 
  onUploadComplete,
  onImageRemove 
}: ProfileUploadProps) {
  const { data: session, update } = useSession()
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRemoveButton, setShowRemoveButton] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userId = session?.user?.id

  // Load profile image on mount
  useEffect(() => {
    const loadImage = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      // If parent provides currentImage, use it
      if (currentImage) {
        setPreviewUrl(currentImage)
        setShowRemoveButton(true)
        setIsLoading(false)
        return
      }

      try {
        const savedImage = getProfileImage(userId)
        if (savedImage) {
          setPreviewUrl(savedImage)
          setShowRemoveButton(true)
        } else {
          setShowRemoveButton(false)
        }
      } catch (error) {
        console.error('Error loading profile image:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [userId, currentImage])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) {
      setStatus('error')
      setErrorMessage('Tafadhali chagua picha (JPEG, PNG, au GIF)')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus('error')
      setErrorMessage('Picha lazima iwe chini ya 5MB')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    setUploading(true)
    setStatus('idle')

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      if (!userId) throw new Error('User not authenticated')

      // Save to localStorage
      const saved = saveProfileImage(userId, base64)
      
      if (saved) {
        // Update preview
        setPreviewUrl(base64)
        setShowRemoveButton(true)
        
        // Notify parent
        onUploadComplete?.(base64)

        setStatus('success')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        throw new Error('Failed to save')
      }
      
    } catch (error) {
      console.error('Upload error:', error)
      setStatus('error')
      setErrorMessage('Imeshindwa kupakia picha. Jaribu tena.')
      setTimeout(() => setStatus('idle'), 3000)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    if (!userId) return
    
    if (confirm('Je, unataka kuondoa picha yako ya wasifu?')) {
      const deleted = deleteProfileImage(userId)
      if (deleted) {
        setPreviewUrl(null)
        setShowRemoveButton(false)
        onImageRemove?.()
        setStatus('success')
        setErrorMessage('Picha imeondolewa')
        setTimeout(() => setStatus('idle'), 3000)
      }
    }
  }

  const triggerFileInput = () => {
    if (!uploading && !isLoading) {
      fileInputRef.current?.click()
    }
  }

  const getUserInitial = () => {
    const name = session?.user?.name || session?.user?.email || 'M'
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="relative inline-block">
      <div className="relative group">
        {/* Avatar Container */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-blue-500">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 size={24} className="text-white animate-spin" />
            </div>
          ) : previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Picha ya wasifu"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl text-white font-bold">
                {getUserInitial()}
              </span>
            </div>
          )}
        </div>

        {/* Buttons Overlay */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 bg-black/50">
          {/* Upload Button */}
          <button
            onClick={triggerFileInput}
            disabled={uploading || isLoading}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition disabled:opacity-50"
            title="Badilisha picha"
            type="button"
          >
            {uploading ? (
              <Loader2 size={16} className="text-white animate-spin" />
            ) : (
              <Camera size={16} className="text-white" />
            )}
          </button>

          {/* Remove Button - only show if image exists */}
          {showRemoveButton && (
            <button
              onClick={handleRemoveImage}
              disabled={uploading || isLoading}
              className="p-2 bg-red-500/50 hover:bg-red-600/70 rounded-full transition disabled:opacity-50"
              title="Ondoa picha"
              type="button"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleUpload}
          disabled={uploading || isLoading}
          className="hidden"
          aria-label="Chagua picha ya wasifu"
          title="Chagua picha"
        />
      </div>

      {/* Status Message */}
      {status === 'success' && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg z-10">
          <CheckCircle size={12} className="inline mr-1" />
          {errorMessage || 'Picha imehifadhiwa!'}
        </div>
      )}

      {status === 'error' && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg z-10">
          <XCircle size={12} className="inline mr-1" />
          {errorMessage}
        </div>
      )}
    </div>
  )
}