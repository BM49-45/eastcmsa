'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  Upload, FileAudio, CheckCircle, AlertCircle, 
  Loader2, ArrowLeft, Music, Mic, BookOpen, Scale, History
} from 'lucide-react'

const categories = [
  { id: 'tawhiid', name: 'Tawhiid', icon: BookOpen, color: 'purple' },
  { id: 'fiqh', name: 'Fiqh', icon: Scale, color: 'green' },
  { id: 'sirah', name: 'Sirah', icon: History, color: 'amber' },
  { id: 'lectures', name: 'Mihadhara', icon: Mic, color: 'blue' }
]

export default function UploadContentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [speaker, setSpeaker] = useState('')
  const [category, setCategory] = useState('tawhiid')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (session?.user?.role !== 'admin') {
    router.push('/')
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('audio/')) {
      setError('Tafadhali chagua faili la sauti (MP3, M4A, WAV)')
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('Faili la sauti lisizidi 50MB')
      return
    }

    setFile(selectedFile)
    setError('')
    
    // Auto-fill title from filename
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '')
      setTitle(fileName.replace(/[-_]/g, ' '))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Tafadhali chagua faili la sauti')
      return
    }
    if (!title.trim()) {
      setError('Tafadhali weka kichwa cha maudhui')
      return
    }
    if (!speaker.trim()) {
      setError('Tafadhali weka jina la mhadhiri')
      return
    }

    setIsUploading(true)
    setError('')
    setSuccess('')
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('speaker', speaker)
    formData.append('category', category)
    formData.append('description', description)

    try {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100
          setUploadProgress(percent)
        }
      })

      const res = await fetch('/api/admin/contents/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess('Maudhui yamepakiwa kikamilifu!')
      setFile(null)
      setTitle('')
      setSpeaker('')
      setDescription('')
      setUploadProgress(0)
      
      setTimeout(() => {
        router.push('/admin/contents')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Hitilafu katika kupakia maudhui')
    } finally {
      setIsUploading(false)
    }
  }

  const selectedCategoryIcon = categories.find(c => c.id === category)?.icon

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/contents" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-4">
            <ArrowLeft size={20} />
            <span>Rudi kwenye Orodha</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pakia Maudhui Mapya</h1>
          <p className="text-gray-600 mt-1">Pakia darsa mpya au muhadhara kwenye maktaba</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faili la Sauti <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors">
                <div className="space-y-1 text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <FileAudio className="w-12 h-12 text-green-600 mb-2" />
                      <p className="text-sm text-gray-900 font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Ondoa
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                        >
                          <span>Chagua faili</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="audio/*"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">au buruta na uachia hapa</p>
                      </div>
                      <p className="text-xs text-gray-500">MP3, M4A, WAV hadi 50MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Kichwa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mfano: Al-Usuul Al-Thalatha - Misingi Mitatu"
                required
              />
            </div>

            {/* Speaker */}
            <div>
              <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 mb-1">
                Mhadhiri <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="speaker"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mfano: Sheikh Abuu Mus'ab At Tanzaniy"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategoria <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = category === cat.id
                  const colorClasses = {
                    purple: isSelected ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300',
                    green: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300',
                    amber: isSelected ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-amber-300',
                    blue: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'
                  }
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${colorClasses[cat.color as keyof typeof colorClasses]}`}
                    >
                      <Icon size={24} />
                      <span className="text-sm font-medium mt-1">{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Maelezo (Hiari)
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Maelezo ya darsa au muhadhara..."
              />
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Inapakia...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <progress
                  value={uploadProgress}
                  max={100}
                  className="w-full h-2 rounded-full overflow-hidden bg-gray-200 accent-green-600"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle size={18} />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/admin/contents"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Ghairi
              </Link>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Inapakia...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Pakia Maudhui
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}