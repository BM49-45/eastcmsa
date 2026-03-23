'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, Mail, MapPin, Globe, User } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", bio: "", location: "", website: "" })
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: (session.user as any).bio || "",
        location: (session.user as any).location || "",
        website: (session.user as any).website || ""
      })
    }
  }, [session, status, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error("Update failed")
      
      await update()
      setMessage("Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      setMessage("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("/api/user/profile-picture", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      await update({ ...session, user: { ...session?.user, image: data.imageUrl } })
    } catch (error) {
      setMessage("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    setIsUploading(true)
    try {
      const res = await fetch("/api/user/profile-picture", { method: "DELETE" })
      if (!res.ok) throw new Error("Remove failed")
      await update({ ...session, user: { ...session?.user, image: null } })
    } catch (error) {
      setMessage("Failed to remove image")
    } finally {
      setIsUploading(false)
    }
  }

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600"></div>
          
          <div className="px-8 pb-8 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">{session?.user?.name?.charAt(0) || "U"}</span>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full cursor-pointer hover:bg-green-700">
                  <Camera className="w-4 h-4 text-white" />
                  <input id="profile-image" type="file" accept="image/*" title="Upload profile picture" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
                {session?.user?.image && (
                  <button type="button" onClick={handleRemoveImage} className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition">
                    Remove
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsEditing(!isEditing)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg">
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User size={18} />
                  <span>{session?.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail size={18} />
                  <span>{session?.user?.email}</span>
                </div>
                {(formData as any).location && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin size={18} />
                    <span>{(formData as any).location}</span>
                  </div>
                )}
                {(formData as any).website && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Globe size={18} />
                    <a href={(formData as any).website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      {(formData as any).website}
                    </a>
                  </div>
                )}
                {(formData as any).bio && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium mb-1">Bio</p>
                    <p className="text-gray-600 dark:text-gray-400">{(formData as any).bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}