"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreatePlaylistPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/playlists/${data.id}`)
      } else {
        alert("Failed to create playlist")
      }
    } catch (error) {
      console.error("Error creating playlist:", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/playlists" className="text-emerald-600 hover:text-emerald-800 mb-8 inline-block">
          ← Back to Playlists
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Playlist</h1>
          <p className="text-gray-600 mb-8">Organize your favorite audio content</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Playlist Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                placeholder="e.g., Favorite Lectures, Quran Recitations, etc."
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe what this playlist is about..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make this playlist public
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/playlists"
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Playlist"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}