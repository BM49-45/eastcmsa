import { notFound } from "next/navigation"
import { getCategoryFiles, categories } from "@/lib/r2"
import AudioCard from "@/components/AudioCard"
import Link from "next/link"

// ... rest of your code
// Define types
interface CategoryInfo {
  id: string
  name: string
  icon: string
  color: string
  count: number
  description: string
}

interface AudioFile {
  id: string
  title: string
  speaker: string
  duration: string
  size: string
  downloads: number
  views?: number
  likes?: number
  url: string
  category: string
  categoryName?: string
  createdAt: string
  [key: string]: any
}

interface Props {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params
  
  // Validate category
  const categoryInfo = categories.find(c => c.id === category) as CategoryInfo | undefined
  if (!categoryInfo) {
    notFound()
  }

  const files = await getCategoryFiles(category) as AudioFile[]

  // Calculate stats
  const totalDownloads = files.reduce((sum, file) => sum + (file.downloads || 0), 0)
  const totalViews = files.reduce((sum, file) => sum + (file.views || 0), 0)
  const uniqueSpeakers = [...new Set(files.map(f => f.speaker))].length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-green-600">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{categoryInfo.name}</span>
        </nav>

        {/* Header with gradient */}
        <div className={`relative mb-8 p-8 rounded-3xl bg-gradient-to-br ${categoryInfo.color} text-white overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="wave" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0,10 Q5,0 10,10 T20,10" stroke="white" fill="none" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#wave)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{categoryInfo.icon}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{categoryInfo.name}</h1>
                <p className="text-xl opacity-90">{categoryInfo.description}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{files.length}</p>
                <p className="text-sm opacity-90">Maudhui</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
                <p className="text-sm opacity-90">Upakuaji</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-sm opacity-90">Matazamio</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-2xl font-bold">{uniqueSpeakers}</p>
                <p className="text-sm opacity-90">Wazungumzaji</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full opacity-10 transform -translate-x-24 translate-y-24"></div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Panga kwa:</span>
              <select 
                id="sort-select"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                title="Panga maudhui"
              >
                <option value="recent">Mpya Kabisa</option>
                <option value="downloads">Waliopakuliwa Zaidi</option>
                <option value="views">Waliotazamwa Zaidi</option>
                <option value="speaker">Mzungumzaji (A-Z)</option>
                <option value="title">Kichwa (A-Z)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tafuta maudhui..."
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
              <button
                type="submit"
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                title="Tafuta"
                aria-label="Tafuta"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Audio Grid */}
        {files.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((audio: AudioFile, index: number) => (
                <AudioCard 
                  key={audio.id || `audio-${index}`} 
                  audio={audio}
                  showCategory={false}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <button type="button" className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100" aria-label="Ukurasa uliopita">
                  ←
                </button>
                <button type="button" className="w-10 h-10 rounded-lg bg-green-600 text-white" aria-current="page">1</button>
                <button type="button" className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100">2</button>
                <button type="button" className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100">3</button>
                <span>...</span>
                <button type="button" className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100">10</button>
                <button type="button" className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100" aria-label="Ukurasa unaofuata">
                  →
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
            <div className="text-7xl mb-4 opacity-25">{categoryInfo.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hakuna Maudhui Bado</h2>
            <p className="text-gray-600 mb-8">Hatujapata maudhui yoyote katika kategoria hii.</p>
            <Link 
              href="/categories" 
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Tazama Kategoria Nyingine
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}