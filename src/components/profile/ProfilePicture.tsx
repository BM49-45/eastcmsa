"use client"

import { useState } from "react"
import Image from "next/image"

interface ProfileImageUploaderProps {
  currentImage?: string | null
  userName: string
  onUploadComplete: (imageUrl: string) => void
}

export default function ProfileImageUploader({ 
  currentImage, 
  userName, 
  onUploadComplete 
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB")
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/user/profile-image", {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      onUploadComplete(data.imageUrl)
    } catch (error: any) {
      setError(error.message)
      setPreviewUrl(currentImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
        {previewUrl ? (
          <Image 
            src={previewUrl} 
            alt={userName}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {userName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <label 
        htmlFor="profile-image" 
        className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
          aria-label="Upload profile image"
        />
      </label>

      {error && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-600 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  )
}