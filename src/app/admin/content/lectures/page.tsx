'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

type Lecture = {
  _id: string
  title: string
  description: string
  speaker: string
  category: string
  duration: number
  audioUrl: string
  imageUrl?: string
  views: number
  likes: number
  comments: number
  downloads: number
  published: boolean
  createdAt: string
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'title'>('newest')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedLectures, setSelectedLectures] = useState<string[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [lectureToDelete, setLectureToDelete] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLectures()
  }, [])

  const fetchLectures = async () => {
    try {
      const res = await fetch('/api/admin/lectures')
      const data = await res.json()
      if (res.ok) {
        setLectures(data)
      }
    } catch (error) {
      console.error('Error fetching lectures:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLecture = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/lectures/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setLectures(lectures.filter(l => l._id !== id))
        setSuccess('Lecture deleted successfully')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Failed to delete lecture')
    }
    setShowDeleteModal(false)
    setLectureToDelete(null)
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedLectures.length} lectures?`)) return
    
    try {
      await Promise.all(selectedLectures.map(id => 
        fetch(`/api/admin/lectures/${id}`, { method: 'DELETE' })
      ))
      setLectures(lectures.filter(l => !selectedLectures.includes(l._id)))
      setSelectedLectures([])
      setSuccess(`${selectedLectures.length} lectures deleted`)
    } catch (error) {
      setError('Failed to delete some lectures')
    }
  }

  const handlePublishToggle = async (id: string, published: boolean) => {
    try {
      const res = await fetch(`/api/admin/lectures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published })
      })
      if (res.ok) {
        setLectures(lectures.map(l => 
          l._id === id ? { ...l, published: !published } : l
        ))
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const filteredLectures = lectures
    .filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                           l.speaker.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || l.category === category
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return sortOrder === 'desc' 
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === 'popular') {
        return sortOrder === 'desc' 
          ? b.views - a.views
          : a.views - b.views
      } else {
        return sortOrder === 'desc'
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title)
      }
    })

  const categories = Array.from(new Set(lectures.map(l => l.category)))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Lectures
        </h1>
        <div className="flex space-x-2">
          {selectedLectures.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
              aria-label={`Delete ${selectedLectures.length} selected lectures`}
            >
              <Trash2 size={18} />
              <span>Delete Selected ({selectedLectures.length})</span>
            </button>
          )}
          <Link
            href="/admin/content/lectures/new"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={18} />
            <span>New Lecture</span>
          </Link>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div 
          className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}
      {error && (
        <div 
          className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center"
          role="alert"
          aria-live="assertive"
        >
          <XCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search-lectures" className="sr-only">
              Search lectures
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="search-lectures"
                type="text"
                placeholder="Search lectures by title or speaker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                aria-label="Search lectures"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category-filter" className="sr-only">
              Filter by category
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              aria-label="Filter lectures by category"
              title="Select category to filter lectures"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort-by" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'title')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              aria-label="Sort lectures by"
              title="Select sorting criteria"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="title">Title</option>
            </select>
          </div>

          <button
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            aria-label={`Sort in ${sortOrder === 'asc' ? 'descending' : 'ascending'} order`}
            title={`Click to sort in ${sortOrder === 'asc' ? 'descending' : 'ascending'} order`}
          >
            <span>Sort Order</span>
            {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Lectures Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">
              List of all lectures with their details and management options
            </caption>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <label htmlFor="select-all" className="sr-only">
                    Select all lectures
                  </label>
                  <input
                    id="select-all"
                    type="checkbox"
                    checked={selectedLectures.length === filteredLectures.length && filteredLectures.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLectures(filteredLectures.map(l => l._id))
                      } else {
                        setSelectedLectures([])
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    aria-label="Select all lectures"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Speaker
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stats
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLectures.map((lecture) => (
                <tr key={lecture._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <label htmlFor={`select-${lecture._id}`} className="sr-only">
                      Select lecture {lecture.title}
                    </label>
                    <input
                      id={`select-${lecture._id}`}
                      type="checkbox"
                      checked={selectedLectures.includes(lecture._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLectures([...selectedLectures, lecture._id])
                        } else {
                          setSelectedLectures(selectedLectures.filter(id => id !== lecture._id))
                        }
                      }}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      aria-label={`Select lecture ${lecture.title}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lecture.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lecture.description.substring(0, 60)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {lecture.speaker}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {lecture.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center" title={`${lecture.views} views`}>
                        <Eye size={14} className="mr-1" />
                        {lecture.views}
                      </span>
                      <span className="flex items-center" title={`${lecture.likes} likes`}>
                        <Heart size={14} className="mr-1" />
                        {lecture.likes}
                      </span>
                      <span className="flex items-center" title={`${lecture.comments} comments`}>
                        <MessageCircle size={14} className="mr-1" />
                        {lecture.comments}
                      </span>
                      <span className="flex items-center" title={`${lecture.downloads} downloads`}>
                        <Download size={14} className="mr-1" />
                        {lecture.downloads}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handlePublishToggle(lecture._id, lecture.published)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        lecture.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                      aria-label={`${lecture.published ? 'Unpublish' : 'Publish'} lecture ${lecture.title}`}
                      title={`Click to ${lecture.published ? 'unpublish' : 'publish'} this lecture`}
                    >
                      {lecture.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/content/lectures/${lecture._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition inline-block"
                      aria-label={`Edit lecture ${lecture.title}`}
                      title={`Edit lecture ${lecture.title}`}
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button
                      onClick={() => {
                        setLectureToDelete(lecture._id)
                        setShowDeleteModal(true)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      aria-label={`Delete lecture ${lecture.title}`}
                      title={`Delete lecture ${lecture.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 id="delete-modal-title" className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Delete Lecture
            </h3>
            <p id="delete-modal-description" className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this lecture? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                onClick={() => lectureToDelete && handleDeleteLecture(lectureToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                aria-label="Confirm deletion"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredLectures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No lectures found. Create your first lecture to get started.
          </p>
        </div>
      )}
    </div>
  )
}