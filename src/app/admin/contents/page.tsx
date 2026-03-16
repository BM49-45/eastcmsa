"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface ContentItem {
  id: string
  title: string
  category: string
  speaker: string
  duration: string
  size: string
  downloads: number
  createdAt: string
  status: "published" | "draft"
}

export default function Contents() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: "all",
    status: "all",
    search: ""
  })

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const res = await fetch("/api/admin/contents")
      const data = await res.json()
      setContents(data)
    } catch (error) {
      console.error("Failed to fetch contents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      const res = await fetch(`/api/admin/contents/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setContents(contents.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete content:", error)
    }
  }

  const categories = ["all", "tawhiid", "fiqh", "sirah", "mihadhara"]

  const filteredContents = contents.filter(content => {
    if (filter.category !== "all" && content.category !== filter.category) return false
    if (filter.status !== "all" && content.status !== filter.status) return false
    if (filter.search && !content.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Content</h1>
            <p className="text-gray-600 mt-2">Manage audio content across categories</p>
          </div>
          <Link
            href="/admin/contents/upload"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload New Audio
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="searchContent" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                id="searchContent"
                type="text"
                placeholder="Search by title..."
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="categoryFilter"
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilter({ category: "all", status: "all", search: "" })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div key={content.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    content.status === "published" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {content.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {content.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Speaker:</span> {content.speaker}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {content.category}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>⏱ {content.duration}</span>
                    <span>📁 {content.size}</span>
                    <span>📥 {content.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Added {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      aria-label={`Edit ${content.title}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(content.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      aria-label={`Delete ${content.title}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-gray-600 mb-4">No content found</p>
            <Link
              href="/admin/contents/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Your First Audio
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}