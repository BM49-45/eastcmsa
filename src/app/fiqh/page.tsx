'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  User,
  Calendar,
  FileAudio,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  BookOpen,
  Search,
  ListMusic,
  History,
  Bookmark,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Building2,
  Heart,
  ChevronRight,
  ChevronLeft,
  Scale
} from 'lucide-react'
import { useAudio } from '@/context/AudioContext'
import './page.css'

interface FiqhAudio {
  filename: string
  title: string
  duration: string
  size: number
  speaker: string
  date: string
  hijri?: string
}

interface FiqhMetadata {
  category: string
  description: string
  author: string
  location: string
  teacher: string
  schedule: string
  files: FiqhAudio[]
}

const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || ''

// Mock data
const MOCK_METADATA: FiqhMetadata = {
  category: "fiqh",
  description: "Darsa ya Fiqh - Kitabu: عمدة الأحكام مِنْ كَلَام خَيْر الْأَنَامِ ﷺ",
  author: "الإمام الحافظ عبد الغني المقدسي",
  location: "Masjid Chang'anyikeni – Ubungo, Dar es Salaam",
  teacher: "USTADH Fadhili Adam",
  schedule: "Jumatatu na Alhamisi baada ya Swala ya Maghrib",
  files: [
    {
      filename: "01-fiqh-darsa-no-1.mp3",
      title: "فقه - الدَّرْسُ الْأَوَّلُ",
      duration: "57:04",
      size: 54797516,
      speaker: "Ustadh Fadhili Adam",
      date: "2025-12-22",
      hijri: "3 Rajab 1447H"
    },
    {
      filename: "02-fiqh-darsa-no-2.mp3",
      title: "فقه - الدَّرْسُ الثَّانِي",
      duration: "42:01",
      size: 40340209,
      speaker: "Ustadh Fadhili Adam",
      date: "2026-01-01",
      hijri: "12 Rajab 1447H"
    },
    {
      filename: "03-fiqh-darsa-no-3.mp3",
      title: "فقه - الدَّرْسُ الثَّالِثُ",
      duration: "52:52",
      size: 50752507,
      speaker: "Ustadh Fadhili Adam",
      date: "2026-01-05",
      hijri: "16 Rajab 1447H"
    },
    {
      filename: "04-fiqh-darsa-no-4.mp3",
      title: "فقه - الدَّرْسُ الرَّابِعُ",
      duration: "57:58",
      size: 55655778,
      speaker: "Ustadh Ahmad Salum",
      date: "2026-01-08",
      hijri: "18 Rajab 1447H"
    },
    {
      filename: "05-fiqh-darsa-no-5.mp3",
      title: "فقه - الدَّرْسُ الْخَامِسُ",
      duration: "59:14",
      size: 56872039,
      speaker: "Ustadh Ahmad Salum",
      date: "2026-01-12",
      hijri: "23 Rajab 1447H"
    },
    {
      filename: "06-fiqh-darsa-no-6.mp3",
      title: "فقه - الدَّرْسُ السَّادِسُ",
      duration: "35:11",
      size: 33792751,
      speaker: "Ustadh Fadhili Adam",
      date: "2026-01-26",
      hijri: "7 Sha'ban 1447H"
    },
    {
      filename: "07-fiqh-darsa-no-7.mp3",
      title: "فقه - الدَّرْسُ السَّابِعُ",
      duration: "58:02",
      size: 55721397,
      speaker: "Ustadh Fadhili Adam",
      date: "2026-02-02",
      hijri: "14 Sha'ban 1447H"
    },
    {
      filename: "08-fiqh-darsa-no-8.mp3",
      title: "فقه - الدَّرْسُ الثَّامِنُ",
      duration: "41:16",
      size: 39711889,
      speaker: "Ustadh Fadhili Adam",
      date: "2026-02-16",
      hijri: "29 Sha'ban 1447H"
    },
    {
      filename: "09-fiqh-darsa-no-9.mp3",
      title: "فقه - الدَّرْسُ التَّاسِعُ",
      duration: "1:00:25",
      size: 58093441,
      speaker: "Ustadh Fadhili Adam",
      date: "2026-02-16",
      hijri: "29 Sha'ban 1447H"
    }
  ]
}

export default function FiqhPage() {
  const [metadata, setMetadata] = useState<FiqhMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'duration'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [useMockData, setUseMockData] = useState(false)
  const playlistSetRef = useRef(false)

  const { audioState, playLectureAudio, togglePlay, setVolume, setMuted, seekTo, nextTrack, prevTrack, setPlaylist } = useAudio()

  useEffect(() => {
    loadMetadata()
    loadBookmarks()
  }, [])

  const loadBookmarks = () => {
    const saved = localStorage.getItem('fiqh-bookmarks')
    if (saved) {
      try {
        setBookmarked(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading bookmarks:', e)
      }
    }
  }

  const toggleBookmark = (filename: string) => {
    setBookmarked(prev => {
      const newBookmarks = prev.includes(filename)
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
      localStorage.setItem('fiqh-bookmarks', JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }

  useEffect(() => {
    const dataToUse = useMockData ? MOCK_METADATA : metadata
    
    if (dataToUse?.files && dataToUse.files.length > 0 && !playlistSetRef.current) {
      const playlist = dataToUse.files.map((audio, index) => ({
        type: 'lecture' as const,
        id: audio.filename,
        title: audio.title,
        speaker: audio.speaker,
        url: `${AUDIO_BASE_URL}/fiqh/${audio.filename}`,
        downloadUrl: `${AUDIO_BASE_URL}/fiqh/${audio.filename}`,
        filename: audio.filename,
        size: audio.size,
        duration: audio.duration,
        date: audio.date,
        category: 'fiqh',
        semester: `Darsa la ${index + 1}`,
        venue: dataToUse.location,
        topics: [],
        language: 'Arabic/Swahili',
        quality: '320kbps'
      }))
      
      setPlaylist(playlist)
      playlistSetRef.current = true
    }
  }, [metadata, useMockData, setPlaylist])

  const loadMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `${AUDIO_BASE_URL}/fiqh/metadata.json`,
        {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      )
      
      if (!response.ok) {
        console.log('⚠️ Metadata haipatikani kwenye R2, tunatumia mock data')
        setUseMockData(true)
        setMetadata(MOCK_METADATA)
        return
      }
      
      const data = await response.json()
      if (data && data.files && Array.isArray(data.files)) {
        setMetadata(data)
        setUseMockData(false)
      } else {
        setUseMockData(true)
        setMetadata(MOCK_METADATA)
      }
    } catch (error: any) {
      console.error('❌ Hitilafu:', error)
      setUseMockData(true)
      setMetadata(MOCK_METADATA)
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDuration = (duration: string) => {
    if (!duration) return '0:00'
    if (duration.includes(':')) {
      const [mins, secs] = duration.split(':').map(Number)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return duration
  }

  const durationToSeconds = (duration: string): number => {
    if (!duration) return 0
    if (duration.includes(':')) {
      const [mins, secs] = duration.split(':').map(Number)
      return (mins * 60) + secs
    }
    return parseInt(duration) || 0
  }

  const progressPercentage = useMemo(() => {
    if (!audioState.duration || audioState.duration === 0) return 0
    return (audioState.currentTime / audioState.duration) * 100
  }, [audioState.currentTime, audioState.duration])

  const volumePercentage = useMemo(() => {
    return audioState.volume * 100
  }, [audioState.volume])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--fiqh-progress', `${progressPercentage}%`)
      document.documentElement.style.setProperty('--fiqh-volume', `${volumePercentage}%`)
    }
  }, [progressPercentage, volumePercentage])

  const filteredAudios = useMemo(() => {
    const dataToUse = useMockData ? MOCK_METADATA : metadata
    if (!dataToUse?.files) return []
    let filtered = [...dataToUse.files]
    
    if (searchTerm) {
      filtered = filtered.filter(audio =>
        audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (audio.hijri && audio.hijri.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'duration':
          comparison = durationToSeconds(a.duration) - durationToSeconds(b.duration)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return filtered
  }, [metadata, useMockData, searchTerm, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAudios.length / itemsPerPage)
  const paginatedAudios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAudios.slice(start, start + itemsPerPage)
  }, [filteredAudios, currentPage])

  const handlePlayAudio = useCallback(async (audio: FiqhAudio) => {
    const audioUrl = `${AUDIO_BASE_URL}/fiqh/${audio.filename}`
    const dataToUse = useMockData ? MOCK_METADATA : metadata
    const lectureAudio = {
      type: 'lecture' as const,
      id: audio.filename,
      title: audio.title,
      speaker: audio.speaker,
      url: audioUrl,
      downloadUrl: audioUrl,
      filename: audio.filename,
      size: audio.size,
      duration: audio.duration,
      date: audio.date,
      category: 'fiqh',
      semester: 'Darsa za Fiqh',
      venue: dataToUse?.location || 'Masjid Chang\'anyikeni, Ubungo',
      topics: [],
      language: 'Arabic/Swahili',
      quality: '320kbps'
    }
    try {
      await playLectureAudio(lectureAudio)
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
    }
  }, [metadata, useMockData, playLectureAudio])

  const handleDownload = useCallback((audio: FiqhAudio) => {
    const audioUrl = `${AUDIO_BASE_URL}/fiqh/${audio.filename}`
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = audio.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleShare = useCallback(async (audio: FiqhAudio) => {
    const shareText = `${audio.title}\nMwalimu: ${audio.speaker}\nTarehe: ${audio.date}${audio.hijri ? ` (${audio.hijri})` : ''}\nMuda: ${audio.duration}`
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: audio.title,
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      alert('Maelezo ya darsa yamepangwa kwenye clipboard!')
    }
  }, [])

  const isCurrentlyPlaying = useCallback((filename: string) => {
    return audioState.isPlaying &&
      audioState.currentLecture?.filename === filename &&
      audioState.audioType === 'lecture'
  }, [audioState.isPlaying, audioState.currentLecture, audioState.audioType])

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const displayMetadata = useMockData ? MOCK_METADATA : metadata

  if (loading) {
    return (
      <div className="fiqh-loading-container">
        <div className="fiqh-loading-spinner">
          <Scale className="fiqh-loading-icon" size={48} />
        </div>
        <p className="fiqh-loading-text">Inapakia Darsa za Fiqh...</p>
        <p className="fiqh-loading-subtext">Fiqh ya Kiislamu</p>
      </div>
    )
  }

  if (!displayMetadata) {
    return (
      <div className="fiqh-error-container">
        <div className="fiqh-error-card">
          <AlertCircle className="fiqh-error-icon" size={64} />
          <h2 className="fiqh-error-title">Hitilafu ya Kupakia Darsa</h2>
          <p className="fiqh-error-message">Hakuna data ya metadata ilipatikana</p>
          <button
            type="button"
            onClick={loadMetadata}
            className="fiqh-retry-btn"
            aria-label="Jaribu tena"
            title="Jaribu tena"
          >
            <RefreshCw size={20} />
            <span>Jaribu Tena</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fiqh-container">
      {/* Hero Section */}
      <div className="fiqh-hero">
        <div className="fiqh-hero-pattern"></div>
        <div className="fiqh-hero-overlay"></div>
        <div className="fiqh-hero-content container">
          <div className="fiqh-hero-badge" data-aos="fade-up">
            <Scale className="fiqh-hero-badge-icon" size={24} />
            <span>الفِقْهُ</span>
          </div>
          <h1 className="fiqh-hero-title" data-aos="fade-up" data-aos-delay="100">
            Darsa za Fiqh
          </h1>
          <p className="fiqh-hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            {displayMetadata.description}
          </p>
          <div className="fiqh-hero-stats" data-aos="fade-up" data-aos-delay="300">
            <div className="fiqh-hero-stat">
              <div className="fiqh-hero-stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="fiqh-hero-stat-content">
                <div className="fiqh-hero-stat-value">{displayMetadata.files.length}</div>
                <div className="fiqh-hero-stat-label">Maudhui</div>
              </div>
            </div>
            <div className="fiqh-hero-stat">
              <div className="fiqh-hero-stat-icon">
                <GraduationCap size={24} />
              </div>
              <div className="fiqh-hero-stat-content">
                <div className="fiqh-hero-stat-value">{displayMetadata.teacher}</div>
                <div className="fiqh-hero-stat-label">Mwalimu</div>
              </div>
            </div>
            <div className="fiqh-hero-stat">
              <div className="fiqh-hero-stat-icon">
                <Building2 size={24} />
              </div>
              <div className="fiqh-hero-stat-content">
                <div className="fiqh-hero-stat-value">{displayMetadata.location.split(',')[0]}</div>
                <div className="fiqh-hero-stat-label">Mahali</div>
              </div>
            </div>
            <div className="fiqh-hero-stat">
              <div className="fiqh-hero-stat-icon">
                <Calendar size={24} />
              </div>
              <div className="fiqh-hero-stat-content">
                <div className="fiqh-hero-stat-value">{displayMetadata.schedule}</div>
                <div className="fiqh-hero-stat-label">Ratiba</div>
              </div>
            </div>
          </div>
          <div className="fiqh-hero-quote" data-aos="fade-up" data-aos-delay="400">
            <Heart size={24} className="fiqh-hero-quote-icon" />
            <p>{displayMetadata.author}</p>
            <p className="fiqh-hero-quote-reference">Kitabu: عمدة الأحكام</p>
          </div>
          {useMockData && (
            <div className="fiqh-mock-badge" data-aos="fade-up" data-aos-delay="450">
              <span>⚡ Inatumia Mock Data (metadata.json haipatikani kwenye R2)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="fiqh-main container">
        {/* Controls Bar */}
        <div className="fiqh-controls-bar" data-aos="fade-up">
          <div className="fiqh-search-wrapper">
            <Search size={20} className="fiqh-search-icon" />
            <input
              type="text"
              placeholder="Tafuta darsa, mwalimu, tarehe..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="fiqh-search-input"
              aria-label="Tafuta darsa"
              title="Tafuta darsa"
            />
          </div>
          <div className="fiqh-controls-group">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`fiqh-filter-btn ${showFilters ? 'active' : ''}`}
              aria-label="Filters"
              title="Filters"
            >
              <Filter size={18} />
              <span className="fiqh-filter-btn-text">Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="fiqh-view-toggle">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`fiqh-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                aria-label="Onyesha kwa gridi"
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`fiqh-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                aria-label="Onyesha kwa orodha"
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="fiqh-filters-panel" data-aos="fade-down">
            <div className="fiqh-filter-group">
              <label className="fiqh-filter-label">Panga kwa</label>
              <div className="fiqh-filter-buttons">
                <button
                  type="button"
                  onClick={() => setSortBy('date')}
                  className={`fiqh-filter-button ${sortBy === 'date' ? 'active' : ''}`}
                  aria-label="Panga kwa tarehe"
                  title="Panga kwa tarehe"
                >
                  Tarehe
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('title')}
                  className={`fiqh-filter-button ${sortBy === 'title' ? 'active' : ''}`}
                  aria-label="Panga kwa kichwa"
                  title="Panga kwa kichwa"
                >
                  Kichwa
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('duration')}
                  className={`fiqh-filter-button ${sortBy === 'duration' ? 'active' : ''}`}
                  aria-label="Panga kwa muda"
                  title="Panga kwa muda"
                >
                  Muda
                </button>
              </div>
            </div>
            <div className="fiqh-filter-group">
              <label className="fiqh-filter-label">Mpangilio</label>
              <div className="fiqh-filter-buttons">
                <button
                  type="button"
                  onClick={() => setSortOrder('asc')}
                  className={`fiqh-filter-button ${sortOrder === 'asc' ? 'active' : ''}`}
                  aria-label="Panga kwa kupanda"
                  title="Panga kwa kupanda"
                >
                  Kupanda
                </button>
                <button
                  type="button"
                  onClick={() => setSortOrder('desc')}
                  className={`fiqh-filter-button ${sortOrder === 'desc' ? 'active' : ''}`}
                  aria-label="Panga kwa kushuka"
                  title="Panga kwa kushuka"
                >
                  Kushuka
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="fiqh-results-info" data-aos="fade-up">
          <div className="fiqh-results-count">
            <ListMusic size={20} />
            <span>
              {filteredAudios.length} {filteredAudios.length === 1 ? 'darsa' : 'darsa'}
              {searchTerm && ` zenye "${searchTerm}"`}
            </span>
          </div>
          {bookmarked.length > 0 && (
            <div className="fiqh-bookmarks-info">
              <Bookmark size={16} />
              <span>{bookmarked.length} zimehifadhiwa</span>
            </div>
          )}
        </div>

        {/* Audio Grid/List */}
        {filteredAudios.length > 0 ? (
          <>
            <div className={`fiqh-audios-container ${viewMode}`}>
              {paginatedAudios.map((audio, index) => {
                const isPlaying = isCurrentlyPlaying(audio.filename)
                const isBookmarked = bookmarked.includes(audio.filename)
                const darsaNumber = ((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')

                return viewMode === 'grid' ? (
                  <div
                    key={audio.filename}
                    className={`fiqh-audio-card ${isPlaying ? 'playing' : ''}`}
                    data-aos="fade-up"
                    data-aos-delay={(index % 6) * 50}
                  >
                    <div className="fiqh-card-header">
                      <span className="fiqh-card-number">#{darsaNumber}</span>
                      <div className="fiqh-card-header-actions">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(audio.filename)}
                          className={`fiqh-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                          aria-label={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                          title={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                        >
                          <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <h3 className="fiqh-card-title">{audio.title}</h3>
                    <div className="fiqh-card-meta">
                      <div className="fiqh-card-meta-item">
                        <User size={14} />
                        <span>{audio.speaker}</span>
                      </div>
                      <div className="fiqh-card-meta-item">
                        <Calendar size={14} />
                        <span title={audio.hijri || ''}>{audio.date}</span>
                      </div>
                      <div className="fiqh-card-meta-item">
                        <Clock size={14} />
                        <span>{formatDuration(audio.duration)}</span>
                      </div>
                    </div>
                    <div className="fiqh-card-footer">
                      <div className="fiqh-card-actions">
                        <button
                          type="button"
                          onClick={() => handleShare(audio)}
                          className="fiqh-card-action"
                          aria-label="Shiriki"
                          title="Shiriki"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(audio)}
                          className="fiqh-card-action"
                          aria-label="Pakua"
                          title="Pakua"
                        >
                          <Download size={16} />
                        </button>
                        <a
                          href={`${AUDIO_BASE_URL}/fiqh/${audio.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fiqh-card-action"
                          aria-label="Fungua kwenye tab mpya"
                          title="Fungua kwenye tab mpya"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(audio)}
                        className={`fiqh-card-play-btn ${isPlaying ? 'playing' : ''}`}
                        disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                        aria-label={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                        title={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                      >
                        {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                          <div className="fiqh-loading-spinner-small"></div>
                        ) : isPlaying ? (
                          <>
                            <Pause size={18} />
                            <span className="fiqh-card-play-btn-text">Inacheza</span>
                          </>
                        ) : (
                          <>
                            <Play size={18} />
                            <span className="fiqh-card-play-btn-text">Cheza</span>
                          </>
                        )}
                      </button>
                    </div>
                    {isPlaying && (
                      <div className="fiqh-playing-indicator">
                        <span className="fiqh-playing-bar"></span>
                        <span className="fiqh-playing-bar"></span>
                        <span className="fiqh-playing-bar"></span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    key={audio.filename}
                    className={`fiqh-list-item ${isPlaying ? 'playing' : ''}`}
                    data-aos="fade-up"
                  >
                    <div className="fiqh-list-number">{darsaNumber}</div>
                    <div className="fiqh-list-content">
                      <div className="fiqh-list-info">
                        <h3 className="fiqh-list-title">{audio.title}</h3>
                        <div className="fiqh-list-meta">
                          <span className="fiqh-list-meta-item">
                            <User size={14} />
                            {audio.speaker}
                          </span>
                          <span className="fiqh-list-meta-item">
                            <Calendar size={14} />
                            {audio.date} {audio.hijri && `(${audio.hijri})`}
                          </span>
                          <span className="fiqh-list-meta-item">
                            <Clock size={14} />
                            {formatDuration(audio.duration)}
                          </span>
                          <span className="fiqh-list-meta-item">
                            <FileAudio size={14} />
                            {formatSize(audio.size)}
                          </span>
                        </div>
                      </div>
                      <div className="fiqh-list-actions">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(audio.filename)}
                          className={`fiqh-list-action ${isBookmarked ? 'active' : ''}`}
                          aria-label={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                          title={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                        >
                          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare(audio)}
                          className="fiqh-list-action"
                          aria-label="Shiriki"
                          title="Shiriki"
                        >
                          <Share2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(audio)}
                          className="fiqh-list-action"
                          aria-label="Pakua"
                          title="Pakua"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(audio)}
                          className={`fiqh-list-play-btn ${isPlaying ? 'playing' : ''}`}
                          disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                          aria-label={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                          title={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                        >
                          {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                            <div className="fiqh-loading-spinner-small"></div>
                          ) : isPlaying ? (
                            <Pause size={20} />
                          ) : (
                            <Play size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="fiqh-pagination" data-aos="fade-up">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="fiqh-pagination-btn"
                  aria-label="Ukurasa uliopita"
                  title="Ukurasa uliopita"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="fiqh-pagination-info">
                  Ukurasa {currentPage} wa {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="fiqh-pagination-btn"
                  aria-label="Ukurasa unaofuata"
                  title="Ukurasa unaofuata"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="fiqh-empty-state" data-aos="fade-up">
            <Scale size={64} className="fiqh-empty-icon" />
            <h3 className="fiqh-empty-title">Hakuna Darsa Zilizopatikana</h3>
            <p className="fiqh-empty-message">
              {searchTerm
                ? `Hakuna darsa zilizo na "${searchTerm}"`
                : 'Hakuna darsa za Fiqh zilizopatikana.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
              className="fiqh-empty-btn"
              aria-label="Ondoa filters"
              title="Ondoa filters"
            >
              Ondoa Filters
            </button>
          </div>
        )}
      </div>

      {/* Global Now Playing Bar */}
      {audioState.currentLecture && audioState.audioType === 'lecture' && (
        <div className="fiqh-now-playing-bar">
          <div className="fiqh-now-playing-content container">
            <div className="fiqh-now-playing-info">
              <div className="fiqh-now-playing-cover">
                <Scale size={24} />
              </div>
              <div className="fiqh-now-playing-text">
                <div className="fiqh-now-playing-title">
                  {audioState.currentLecture.title}
                </div>
                <div className="fiqh-now-playing-subtitle">
                  {audioState.currentLecture.speaker}
                </div>
              </div>
            </div>
            <div className="fiqh-now-playing-controls">
              <button
                onClick={prevTrack}
                className="fiqh-now-playing-control"
                aria-label="Darsa iliyopita"
                title="Darsa iliyopita"
                disabled={audioState.isLoading}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="fiqh-now-playing-play"
                aria-label={audioState.isPlaying ? 'Simamisha' : 'Cheza'}
                title={audioState.isPlaying ? 'Simamisha' : 'Cheza'}
                disabled={audioState.isLoading}
              >
                {audioState.isLoading ? (
                  <div className="fiqh-now-playing-loading"></div>
                ) : audioState.isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="fiqh-now-playing-control"
                aria-label="Darsa inayofuata"
                title="Darsa inayofuata"
                disabled={audioState.isLoading}
              >
                <SkipForward size={20} />
              </button>
              <div className="fiqh-now-playing-progress">
                <div className="fiqh-now-playing-time">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
                <div className="fiqh-now-playing-track">
                  <div className="fiqh-now-playing-fill"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={audioState.duration || 100}
                  value={audioState.currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="fiqh-now-playing-range"
                  aria-label="Endelea mbele au nyuma"
                  title="Endelea mbele au nyuma"
                />
              </div>
              <div className="fiqh-now-playing-volume">
                <button
                  onClick={() => setMuted(!audioState.isMuted)}
                  className="fiqh-now-playing-volume-btn"
                  aria-label={audioState.isMuted ? 'Washa sauti' : 'Zima sauti'}
                  title={audioState.isMuted ? 'Washa sauti' : 'Zima sauti'}
                >
                  {audioState.isMuted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                <div className="fiqh-now-playing-volume-track">
                  <div className="fiqh-now-playing-volume-fill"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioState.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="fiqh-now-playing-volume-range"
                  aria-label="Badilisha ukubwa wa sauti"
                  title="Badilisha ukubwa wa sauti"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}