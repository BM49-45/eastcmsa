'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  X,
  Upload,
  Clock,
  Image as ImageIcon,
  Loader2
} from 'lucide-react'

export default function NewLecturePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    category: '',
    duration: '',
    audioUrl: '',
    imageUrl: '',
    published: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration) || 0
        })
      })

      if (res.ok) {
        router.push('/admin/content/lectures')
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating lecture:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Lecture
          </h1>
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            aria-label="Go back"
            title="Go back to lectures list"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Understanding Tawhid"
              aria-required="true"
              aria-describedby="title-description"
            />
            <p id="title-description" className="sr-only">Enter the lecture title</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the lecture..."
              aria-describedby="description-help"
            />
            <p id="description-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Provide a brief overview of what the lecture covers
            </p>
          </div>

          {/* Speaker and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speaker <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="speaker"
                type="text"
                required
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Sheikh Ahmed"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                aria-required="true"
                title="Select lecture category"
              >
                <option value="">Select Category</option>
                <option value="Tawhid">Tawhid</option>
                <option value="Fiqh">Fiqh</option>
                <option value="Sirah">Sirah</option>
                <option value="Quran">Quran</option>
                <option value="Hadith">Hadith</option>
              </select>
            </div>
          </div>

          {/* Duration and Audio URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                <input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="45"
                  min="0"
                  step="1"
                  aria-describedby="duration-help"
                />
              </div>
              <p id="duration-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the lecture length in minutes
              </p>
            </div>
            <div>
              <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Audio URL <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                <input
                  id="audioUrl"
                  type="url"
                  required
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/audio.mp3"
                  aria-required="true"
                  aria-describedby="audioUrl-help"
                />
              </div>
              <p id="audioUrl-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Provide the direct URL to the audio file
              </p>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL (optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
                aria-describedby="imageUrl-help"
              />
            </div>
            <p id="imageUrl-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional: Add a cover image for the lecture
            </p>
          </div>

          {/* Publish Status */}
          <fieldset className="space-y-2">
            <legend className="sr-only">Publication status</legend>
            <div className="flex items-center space-x-2">
              <input
                id="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                aria-describedby="published-help"
              />
              <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-300">
                Publish immediately
              </label>
            </div>
            <p id="published-help" className="text-xs text-gray-500 dark:text-gray-400 ml-6">
              If unchecked, the lecture will be saved as a draft
            </p>
          </fieldset>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              aria-label="Cancel and return to lectures list"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={loading ? 'Saving lecture...' : 'Save lecture'}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} aria-hidden="true" />
                  <span>Save Lecture</span>
                </>
              )}
            </button>
          </div>

          {/* Required fields note */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
            <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">Fields marked with an asterisk</span> Required fields
          </p>
        </form>
      </div>
    </div>
  )
}