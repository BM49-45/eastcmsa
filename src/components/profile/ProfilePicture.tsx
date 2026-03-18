"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Loader2, Trash2 } from 'lucide-react'
import { useSession } from "next-auth/react"

interface ProfilePictureProps {
  currentImage?: string | null
  userName: string
  onUploadComplete: (imageUrl: string) => void
  onRemove?: () => void
}

export default function ProfilePicture({ 
  currentImage, 
  userName, 
  onUploadComplete,
  onRemove 
}: ProfilePictureProps) {
  const { update: updateSession } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // CRITICAL: Stop all default behaviors
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Tafadhali chagua faili la picha")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Picha isizidi 2MB")
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      setPreviewUrl(loadEvent.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload without refreshing
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/user/profile-picture", {
        method: "POST",
        body: formData,
        // CRITICAL: Don't follow redirects
        redirect: "manual"
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to upload image")
      }

      const data = await res.json()

      // Update session silently
      await updateSession({
        user: {
          ...(await fetch("/api/auth/session").then(r => r.json())).user,
          image: data.imageUrl
        }
      })

      // Call the callback
      onUploadComplete(data.imageUrl)
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error: any) {
      console.error("Upload error:", error)
      setError(error.message || "Hitilafu ya kupakia picha")
      setPreviewUrl(currentImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm("Una uhakika unataka kuondoa picha yako?")) return

    setIsUploading(true)
    try {
      const res = await fetch("/api/user/profile-picture", {
        method: "DELETE",
        redirect: "manual"
      })

      if (res.ok) {
        setPreviewUrl(null)
        
        // Update session
        await updateSession({
          user: {
            ...(await fetch("/api/auth/session").then(r => r.json())).user,
            image: null
          }
        })

        if (onRemove) onRemove()
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error("Error removing image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    // CRITICAL: Stop propagation and prevent default
    e.preventDefault()
    e.stopPropagation()
    
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="relative group">
      <div className="relative w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-xl">
        {previewUrl ? (
          <Image 
            src={previewUrl} 
            alt={`Profile picture of ${userName}`}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {userName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="profile-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
        aria-label="Upload new profile picture"
      />

      {/* Upload button - using a div to avoid form submission */}
      <div
        onClick={handleButtonClick}
        className={`absolute bottom-0 right-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg border-2 border-white cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        aria-label="Change profile picture"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleButtonClick(e as any)}
      >
        <Camera className="w-4 h-4 text-white" />
      </div>

      {/* Remove button */}
      {previewUrl && (
        <button
          onClick={handleRemove}
          disabled={isUploading}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100 disabled:opacity-50"
          aria-label="Remove profile picture"
          type="button"
        >
          <Trash2 className="w-3 h-3 inline mr-1" />
          Ondoa
        </button>
      )}

      {error && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-600 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  )
}