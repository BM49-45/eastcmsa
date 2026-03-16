"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ProfileImageUploader from "@/components/profile/ProfilePicture"

export default function Profile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    occupation: "",
    education: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [stats, setStats] = useState({
    downloads: 0,
    favorites: 0,
    playlists: 0,
    following: 0,
    followers: 0,
    memberSince: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: (session.user as any).bio || "",
        location: (session.user as any).location || "",
        website: (session.user as any).website || "",
        phone: (session.user as any).phone || "",
        occupation: (session.user as any).occupation || "",
        education: (session.user as any).education || ""
      })
    }
  }, [session])

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })

        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    if (session) {
      fetchUserStats()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          ...formData
        }
      })

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setIsEditing(false)
      
      // Auto hide message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    update({
      ...session,
      user: {
        ...session?.user,
        image: imageUrl
      }
    })
  }

  const tabs = [
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "activity", name: "Activity", icon: "📊" },
    { id: "playlists", name: "Playlists", icon: "🎵" },
    { id: "favorites", name: "Favorites", icon: "❤️" }
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Cover Photo */}
      <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white rounded-full opacity-10"></div>
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-white rounded-full opacity-10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <ProfileImageUploader
                  currentImage={session?.user?.image}
                  userName={session?.user?.name || "User"}
                  onUploadComplete={handleImageUpload}
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{session?.user?.name}</h1>
                  <p className="text-gray-500 flex items-center gap-2 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {session?.user?.email}
                  </p>
                  {(session?.user as any).location && (
                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {(session?.user as any).location}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <Link
                  href="/settings"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-8 bg-gray-50 border-b border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.downloads}</p>
              <p className="text-sm text-gray-500">Downloads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
              <p className="text-sm text-gray-500">Favorites</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.playlists}</p>
              <p className="text-sm text-gray-500">Playlists</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.following}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.followers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mx-8 mt-6 p-4 rounded-xl ${
              message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 px-8">
            <nav className="flex -mb-px space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "profile" && (
              <div>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        <input
                          id="occupation"
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                          Education
                        </label>
                        <input
                          id="education"
                          type="text"
                          value={formData.education}
                          onChange={(e) => setFormData({...formData, education: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your educational background"
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-200"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.phone && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <p className="text-gray-900 font-medium">{formData.phone}</p>
                        </div>
                      )}
                      {formData.occupation && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Occupation</p>
                          <p className="text-gray-900 font-medium">{formData.occupation}</p>
                        </div>
                      )}
                      {formData.education && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Education</p>
                          <p className="text-gray-900 font-medium">{formData.education}</p>
                        </div>
                      )}
                      {formData.location && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Location</p>
                          <p className="text-gray-900 font-medium">{formData.location}</p>
                        </div>
                      )}
                    </div>

                    {formData.bio && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Bio</p>
                        <p className="text-gray-900">{formData.bio}</p>
                      </div>
                    )}

                    {formData.website && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Website</p>
                        <a 
                          href={formData.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {formData.website}
                        </a>
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Member Since</p>
                      <p className="text-gray-900 font-medium">
                        {stats.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-600">No activity yet</p>
              </div>
            )}

            {activeTab === "playlists" && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-gray-600 mb-4">No playlists yet</p>
                <Link
                  href="/create-playlist"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Playlist
                </Link>
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-gray-600">No favorites yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}