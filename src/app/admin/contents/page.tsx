'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Play, Pause, Download, Clock, User, Calendar, 
  BookOpen, Scale, History, Mic, Heart, Eye, Trash2, Edit, Upload, 
  Search, Filter, LayoutGrid, List, ChevronDown, ChevronUp, 
  ChevronRight, ChevronLeft, RefreshCw, FileText, BarChart, 
  Shield, Users, Settings, UserCircle, LayoutDashboard, ListMusic,
  Volume2, VolumeX
} from 'lucide-react'

// ============================================
// Types & Configuration
// ============================================

interface ContentItem {
  id: string
  title: string
  speaker: string
  category: string
  duration: string
  size: string
  downloads: number
  views: number
  likes: number
  date: string
  status: 'published' | 'draft'
  audioUrl: string
}

interface CategoryConfig {
  name: string
  icon: any
  bgColor: string
  textColor: string
}

interface AudioStats {
  counts: {
    total: number
    tawhiid: number
    fiqh: number
    sirah: number
    lecture: number
  }
  totalDownloads: number
  totalViews: number
  totalLikes: number
}

// ============================================
// Navigation Links (from Navbar)
// ============================================

const sidebarLinks = [
  { name: 'Dashibodi', href: '/dashboard', icon: LayoutDashboard, title: 'Dashibodi yako' },
  { name: 'Wasifu', href: '/profile', icon: UserCircle, title: 'Wasifu wako' },
  { name: 'Mipangilio', href: '/settings', icon: Settings, title: 'Mipangilio ya akaunti' },
  { name: 'Favorites', href: '/favorites', icon: Heart, title: 'Orodha ya favorites zako' },
  { name: 'Orodha Zangu', href: '/playlists', icon: ListMusic, title: 'Orodha zako za kusikiliza' },
  { name: 'Shughuli', href: '/activity', icon: Clock, title: 'Shughuli zako za karibuni' },
  { name: 'Jumuiya', href: '/community', icon: Users, title: 'Jumuiya ya wanafunzi' },
]

const adminLinks = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield, title: 'Dhibiti mfumo' },
  { name: 'Dhibiti Watumiaji', href: '/admin/users', icon: Users, title: 'Dhibiti watumiaji wote' },
  { name: 'Dhibiti Maudhui', href: '/admin/contents', icon: FileText, title: 'Dhibiti maudhui' },
  { name: 'Takwimu', href: '/admin/analytics', icon: BarChart, title: 'Takwimu za mfumo' },
]

const quickActions = [
  { name: 'Tawhiid', href: '/tawhiid', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
  { name: 'Fiqh', href: '/fiqh', icon: Scale, color: 'from-green-500 to-green-600' },
  { name: 'Sirah', href: '/sirah', icon: History, color: 'from-amber-500 to-amber-600' },
  { name: 'Mihadhara', href: '/mihadhara', icon: Mic, color: 'from-blue-500 to-blue-600' },
]

// ============================================
// Category Configuration with Correct Icons
// ============================================

// Category Configuration
const categoryConfig: Record<string, CategoryConfig> = {
  tawhiid: { 
    name: 'Tawhiid', 
    icon: BookOpen,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30', 
    textColor: 'text-purple-600 dark:text-purple-400' 
  },
  fiqh: { 
    name: 'Fiqh', 
    icon: Scale,
    bgColor: 'bg-green-100 dark:bg-green-900/30', 
    textColor: 'text-green-600 dark:text-green-400' 
  },
  sirah: { 
    name: 'Sirah', 
    icon: History,
    bgColor: 'bg-amber-100 dark:bg-amber-900/30', 
    textColor: 'text-amber-600 dark:text-amber-400' 
  },
  mihadhara: {  
    name: 'Mihadhara', 
    icon: Mic,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30', 
    textColor: 'text-blue-600 dark:text-blue-400' 
  }
}

const categoriesList = ['all', 'tawhiid', 'fiqh', 'sirah', 'mihadhara']

// ============================================
// Main Component
// ============================================

export default function AdminContentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State
  const [contents, setContents] = useState<ContentItem[]>([])
  const [audioStats, setAudioStats] = useState<AudioStats>({
    counts: { total: 0, tawhiid: 0, fiqh: 0, sirah: 0, lecture: 0 },
    totalDownloads: 0,
    totalViews: 0,
    totalLikes: 0
  })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [filter, setFilter] = useState({ status: 'all', search: '' })
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'downloads' | 'views'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Audio player
  const [currentAudio, setCurrentAudio] = useState<ContentItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ============================================
  // Effects
  // ============================================

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (session?.user?.role === 'admin') {
      fetchContents()
      fetchAudioStats()
    }
  }, [session, status, router])

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => { setDuration(audio.duration); setIsLoadingAudio(false) }
    const handleEnded = () => { setIsPlaying(false); setCurrentAudio(null) }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleWaiting = () => setIsLoadingAudio(true)
    const handleCanPlay = () => setIsLoadingAudio(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  // ============================================
  // Data Fetching
  // ============================================

  const fetchContents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/content')
      if (res.ok) {
        const data = await res.json()
        setContents(data)
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAudioStats = async () => {
    try {
      const res = await fetch('/api/audio/counts')
      if (res.ok) {
        const data = await res.json()
        setAudioStats({
          counts: data.counts,
          totalDownloads: data.totalDownloads,
          totalViews: data.totalViews,
          totalLikes: data.totalLikes
        })
      }
    } catch (error) {
      console.error('Error fetching audio stats:', error)
    }
  }

  // ============================================
  // Handlers
  // ============================================

  const handlePlay = (content: ContentItem) => {
    if (!audioRef.current) return
    if (currentAudio?.id === content.id && isPlaying) {
      audioRef.current.pause()
    } else if (currentAudio?.id === content.id && !isPlaying) {
      audioRef.current.play()
    } else {
      setIsLoadingAudio(true)
      audioRef.current.src = content.audioUrl
      audioRef.current.load()
      audioRef.current.play().catch(() => setIsLoadingAudio(false))
      setCurrentAudio(content)
      setCurrentTime(0)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Je, una uhakika unataka kufuta maudhui haya?')) return
    try {
      const res = await fetch(`/api/content/${id}`, { method: 'DELETE' })
      if (res.ok) setContents(contents.filter(c => c.id !== id))
    } catch (error) { console.error('Error deleting content:', error) }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // ============================================
  // Data Processing
  // ============================================

  const categoriesList = ['all', 'tawhiid', 'fiqh', 'sirah', 'lecture']
  const categoriesWithCounts = categoriesList.map(cat => ({
    id: cat,
    name: cat === 'all' ? 'Zote' : categoryConfig[cat]?.name || cat,
    count: cat === 'all' 
      ? audioStats.counts.total 
      : audioStats.counts[cat as keyof typeof audioStats.counts] || 0,
    icon: cat === 'all' ? null : categoryConfig[cat]?.icon
  }))

  const filteredContents = contents.filter(content => {
    if (selectedCategory !== 'all' && content.category !== selectedCategory) return false
    if (filter.status !== 'all' && content.status !== filter.status) return false
    if (filter.search && !content.title.toLowerCase().includes(filter.search.toLowerCase()) && 
        !content.speaker.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case 'date': comparison = new Date(b.date).getTime() - new Date(a.date).getTime(); break
      case 'title': comparison = a.title.localeCompare(b.title); break
      case 'downloads': comparison = b.downloads - a.downloads; break
      case 'views': comparison = b.views - a.views; break
    }
    return sortOrder === 'asc' ? -comparison : comparison
  })

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage)
  const paginatedContents = filteredContents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // ============================================
  // Loading & Auth States
  // ============================================

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Inapakia maudhui...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-600 text-lg">Unauthorized Access</p>
        </div>
      </div>
    )
  }

  // ============================================
  // Render
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dhibiti Maudhui</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Simamia na dhibiti darsa na mihadhara yote</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/contents/upload" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-2">
              <Upload className="w-5 h-5" /> Pakia Maudhui Mapya
            </Link>
            <button onClick={() => { fetchContents(); fetchAudioStats(); }} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title="Onyesha upya" aria-label="Refresh content">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                href={action.href}
                className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg transition-all group`}
                title={action.name}
                aria-label={`Nenda kwenye ${action.name}`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{action.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Stats Cards - Real R2 Data */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600">{audioStats.counts.total}</p>
            <p className="text-xs text-gray-500">Jumla ya Mafaili</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-purple-600">{audioStats.counts.tawhiid}</p>
            <p className="text-xs text-gray-500">Tawhiid</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600">{audioStats.counts.fiqh}</p>
            <p className="text-xs text-gray-500">Fiqh</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-amber-600">{audioStats.counts.sirah}</p>
            <p className="text-xs text-gray-500">Sirah</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-blue-600">{audioStats.counts.lecture}</p>
            <p className="text-xs text-gray-500">Mihadhara</p>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-xl font-bold text-blue-600">{audioStats.totalViews.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Matazamio Jumla</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-xl font-bold text-green-600">{audioStats.totalDownloads.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Upakuaji Jumla</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-xl font-bold text-red-600">{audioStats.totalLikes.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Kupendwa Jumla</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          {categoriesWithCounts.map(cat => {
            const isActive = selectedCategory === cat.id
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                  isActive 
                    ? cat.id === 'all'
                      ? 'bg-green-600 text-white'
                      : `${categoryConfig[cat.id]?.bgColor} ${categoryConfig[cat.id]?.textColor}`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={`Onyesha ${cat.name}`}
                aria-label={`Chagua ${cat.name}`}
              >
                {Icon && <Icon size={16} />}
                <span>{cat.name}</span>
                <span className="text-xs opacity-70">({cat.count})</span>
              </button>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tafuta kwa jina au mhadhiri..."
                value={filter.search}
                onChange={(e) => setFilter({...filter, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                aria-label="Tafuta maudhui"
                title="Tafuta kwa jina au mhadhiri"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                title="Onyesha vichujio"
                aria-label="Onyesha vichujio"
              >
                <Filter size={18} /> Filters {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`} title="Muonekano wa gridi" aria-label="Grid view">
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`} title="Muonekano wa orodha" aria-label="List view">
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hali</label>
                <select 
                  id="statusFilter"
                  value={filter.status} 
                  onChange={(e) => setFilter({...filter, status: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  title="Chagua hali"
                  aria-label="Chagua hali"
                >
                  <option value="all">Zote</option>
                  <option value="published">Imechapishwa</option>
                  <option value="draft">Rasimu</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Panga kwa</label>
                <select 
                  id="sortBy"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  title="Panga kwa"
                  aria-label="Panga kwa"
                >
                  <option value="date">Tarehe</option>
                  <option value="title">Kichwa</option>
                  <option value="downloads">Upakuaji</option>
                  <option value="views">Matazamio</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mpangilio</label>
                <select 
                  id="sortOrder"
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as any)} 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  title="Mpangilio"
                  aria-label="Mpangilio"
                >
                  <option value="desc">Kushuka</option>
                  <option value="asc">Kupanda</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content Display */}
        {paginatedContents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Hakuna maudhui yaliyopatikana</p>
            <Link href="/admin/contents/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Upload className="w-5 h-5" /> Pakia Maudhui ya Kwanza
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedContents.map((content) => {
              const config = categoryConfig[content.category]
              const Icon = config?.icon
              const isCurrentPlaying = currentAudio?.id === content.id && isPlaying
              const isLoadingCurrent = currentAudio?.id === content.id && isLoadingAudio
              
              return (
                <div key={content.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <button 
                      onClick={() => handlePlay(content)} 
                      className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition"
                      title={isCurrentPlaying ? "Simamisha" : "Cheza"}
                      aria-label={isCurrentPlaying ? "Pause audio" : "Play audio"}
                    >
                      {isLoadingCurrent ? <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div> : isCurrentPlaying ? <Pause className="w-8 h-8 text-green-600" /> : <Play className="w-8 h-8 text-green-600 ml-1" />}
                    </button>
                    <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 rounded-lg text-xs text-white">{content.duration}</span>
                    <span className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${content.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                      {content.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {Icon && <Icon size={16} className={config?.textColor} />}
                      <span className={`text-xs ${config?.textColor} capitalize`}>{config?.name}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{content.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <User size={14} /> <span>{content.speaker}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2"><Eye size={12} /> {content.views.toLocaleString()}</div>
                      <div className="flex items-center gap-2"><Download size={12} /> {content.downloads.toLocaleString()}</div>
                      <div className="flex items-center gap-2"><Heart size={12} className="text-red-500" /> {content.likes}</div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <a href={content.audioUrl} download className="p-2 text-gray-500 hover:text-green-600 transition-colors" title="Pakua" aria-label="Download audio"><Download size={18} /></a>
                      <Link href={`/${content.category}/${content.id}/edit`} className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Hariri" aria-label="Edit content"><Edit size={18} /></Link>
                      <button onClick={() => handleDelete(content.id)} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Futa" aria-label="Delete content"><Trash2 size={18} /></button>
                      <Link href={`/${content.category}/${content.id}`} className="p-2 text-gray-500 hover:text-green-600 transition-colors" title="Tazama" aria-label="View content"><Eye size={18} /></Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Kichwa</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Mhadhiri</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Kategoria</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Muda</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-500">Vitendo</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedContents.map((content) => {
                    const config = categoryConfig[content.category]
                    const isCurrentPlaying = currentAudio?.id === content.id && isPlaying
                    return (
                      <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handlePlay(content)} 
                              className="p-1 text-gray-500 hover:text-green-600"
                              title={isCurrentPlaying ? "Simamisha" : "Cheza"}
                              aria-label={isCurrentPlaying ? "Pause audio" : "Play audio"}
                            >
                              {isCurrentPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <span className="font-medium text-gray-900 dark:text-white">{content.title}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{content.speaker}</td>
                        <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${config?.bgColor} ${config?.textColor}`}>{config?.name}</span></td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{content.duration}</td>
                        <td className="p-4 text-right space-x-2">
                          <a href={content.audioUrl} download className="p-1 text-gray-500 hover:text-green-600 inline-block" title="Pakua" aria-label="Download audio"><Download size={16} /></a>
                          <Link href={`/${content.category}/${content.id}/edit`} className="p-1 text-gray-500 hover:text-blue-600 inline-block" title="Hariri" aria-label="Edit content"><Edit size={16} /></Link>
                          <button onClick={() => handleDelete(content.id)} className="p-1 text-gray-500 hover:text-red-600 inline-block" title="Futa" aria-label="Delete content"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1} 
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
              title="Ukurasa uliopita"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="p-2 text-sm text-gray-600 dark:text-gray-400">Ukurasa {currentPage} wa {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages} 
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
              title="Ukurasa unaofuata"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Now Playing Bar */}
        {currentAudio && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  {(() => {
                    const Icon = categoryConfig[currentAudio.category]?.icon
                    return Icon ? <Icon size={20} className="text-green-600" /> : <BookOpen size={20} className="text-green-600" />
                  })()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{currentAudio.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentAudio.speaker}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handlePlay(currentAudio)} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  title={isPlaying ? "Simamisha" : "Cheza"}
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isLoadingAudio ? <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div> : isPlaying ? <Pause size={20} className="text-green-600" /> : <Play size={20} className="text-green-600" />}
                </button>
                <div className="w-32 text-xs text-gray-600 dark:text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="p-1"
                    title={isMuted ? "Washa sauti" : "Zima sauti"}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))} 
                    className="w-20"
                    title="Badilisha sauti"
                    aria-label="Volume control"
                  />
                </div>
              </div>
            </div>
            <div className="h-1 bg-gray-200">
              <div className="h-full bg-green-600 transition-all progress-bar-fill" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}