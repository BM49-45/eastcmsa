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
  ChevronLeft
} from 'lucide-react'
import { useAudio } from '@/context/AudioContext'
import './page.css'

interface TawhiidAudio {
  filename: string
  title: string
  translation?: string
  duration: string
  size: number
  speaker: string
  date: string
  hijri?: string
}

interface TawhiidMetadata {
  category: string
  description: string
  book?: string
  author?: string
  location: string
  teacher: string
  schedule: string
  startDate?: string
  files: TawhiidAudio[]
}

const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || ''

export default function TawhiidPage() {
  const [metadata, setMetadata] = useState<TawhiidMetadata | null>(null)
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
  const playlistSetRef = useRef(false)

  const { audioState, playLectureAudio, togglePlay, setVolume, setMuted, seekTo, nextTrack, prevTrack, setPlaylist } = useAudio()

  useEffect(() => {
    loadMetadata()
    loadBookmarks()
  }, [])

  const loadBookmarks = () => {
    const saved = localStorage.getItem('tawhiid-bookmarks')
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
      localStorage.setItem('tawhiid-bookmarks', JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }

  // Set playlist when metadata changes
  useEffect(() => {
    if (metadata?.files && metadata.files.length > 0 && !playlistSetRef.current) {
      const playlist = metadata.files.map((audio, index) => ({
        type: 'lecture' as const,
        id: audio.filename,
        title: audio.title,
        speaker: audio.speaker,
        url: `${AUDIO_BASE_URL}/tawhiid/${audio.filename}`,
        downloadUrl: `${AUDIO_BASE_URL}/tawhiid/${audio.filename}`,
        filename: audio.filename,
        size: audio.size,
        duration: audio.duration,
        date: audio.date,
        category: 'tawhiid',
        semester: `Darsa la ${index + 1}`,
        venue: metadata.location,
        topics: [],
        language: 'Arabic/Swahili',
        quality: '320kbps'
      }))
      
      setPlaylist(playlist)
      playlistSetRef.current = true
    }
  }, [metadata, setPlaylist])

  const loadMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `${AUDIO_BASE_URL}/tawhiid/metadata.json`,
        {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data && data.files && Array.isArray(data.files)) {
        setMetadata(data)
      } else {
        throw new Error('Muundo wa metadata sio sahihi')
      }
    } catch (error: any) {
      console.error('❌ Hitilafu:', error)
      setError(`Hitilafu ya kupakia data: ${error.message}`)
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
      document.documentElement.style.setProperty('--tawhiid-progress', `${progressPercentage}%`)
      document.documentElement.style.setProperty('--tawhiid-volume', `${volumePercentage}%`)
    }
  }, [progressPercentage, volumePercentage])

  const speakers = useMemo(() => {
    if (!metadata?.files) return []
    const uniqueSpeakers = new Set(metadata.files.map(f => f.speaker))
    return ['all', ...Array.from(uniqueSpeakers)]
  }, [metadata?.files])

  const filteredAudios = useMemo(() => {
    if (!metadata?.files) return []
    let filtered = [...metadata.files]
    
    if (searchTerm) {
      filtered = filtered.filter(audio =>
        audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.date.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [metadata, searchTerm, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAudios.length / itemsPerPage)
  const paginatedAudios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAudios.slice(start, start + itemsPerPage)
  }, [filteredAudios, currentPage])

  const handlePlayAudio = useCallback(async (audio: TawhiidAudio) => {
    const audioUrl = `${process.env.NEXT_PUBLIC_AUDIO_BASE_URL}/tawhiid/${audio.filename}`
    
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
      category: 'tawhiid',
      semester: metadata?.book || 'Darsa za Tawhiid',
      venue: metadata?.location || 'Masjid Chang\'anyikeni, Ubungo',
      topics: [],
      language: 'Arabic/Swahili',
      quality: '320kbps'
    }
    
    try {
      // Check if same audio is playing
      if (audioState.currentLecture?.filename === audio.filename && audioState.audioType === 'lecture') {
        await togglePlay() // Toggle play/pause
      } else {
        await playLectureAudio(lectureAudio)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
    }
  }, [metadata, audioState.currentLecture, audioState.audioType, playLectureAudio, togglePlay])

  const handleDownload = useCallback((audio: TawhiidAudio) => {
      const audioUrl = `${process.env.NEXT_PUBLIC_AUDIO_BASE_URL}/tawhiid/${audio.filename}`
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = audio.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleShare = useCallback(async (audio: TawhiidAudio) => {
    const shareText = `${audio.title}\n${audio.translation || ''}\nMwalimu: ${audio.speaker}\nTarehe: ${audio.date}\nMuda: ${audio.duration}`
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

  if (loading) {
    return (
      <div className="tawhiid-loading-container">
        <div className="tawhiid-loading-spinner">
          <BookOpen className="tawhiid-loading-icon" size={48} />
        </div>
        <p className="tawhiid-loading-text">Inapakia Darsa za Tawhiid...</p>
        <p className="tawhiid-loading-subtext">Mafundisho ya Aqida</p>
      </div>
    )
  }

  if (error || !metadata) {
    return (
      <div className="tawhiid-error-container">
        <div className="tawhiid-error-card">
          <AlertCircle className="tawhiid-error-icon" size={64} />
          <h2 className="tawhiid-error-title">Hitilafu ya Kupakia Darsa</h2>
          <p className="tawhiid-error-message">{error || 'Hakuna data ya metadata ilipatikana'}</p>
          <button
            type="button"
            onClick={loadMetadata}
            className="tawhiid-retry-btn"
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
    <div className="tawhiid-container">
      {/* Hero Section */}
      <div className="tawhiid-hero">
        <div className="tawhiid-hero-pattern"></div>
        <div className="tawhiid-hero-overlay"></div>
        <div className="tawhiid-hero-content container">
          <div className="tawhiid-hero-badge" data-aos="fade-up">
            <BookOpen className="tawhiid-hero-badge-icon" size={24} />
            <span>التَّوْحِيدُ</span>
          </div>
          <h1 className="tawhiid-hero-title" data-aos="fade-up" data-aos-delay="100">
            Darsa za Tawhiid
          </h1>
          <p className="tawhiid-hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            {metadata.description}
          </p>
          <div className="tawhiid-hero-stats" data-aos="fade-up" data-aos-delay="300">
            <div className="tawhiid-hero-stat">
              <div className="tawhiid-hero-stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="tawhiid-hero-stat-content">
                <div className="tawhiid-hero-stat-value">{metadata.files.length}</div>
                <div className="tawhiid-hero-stat-label">Maudhui</div>
              </div>
            </div>
            <div className="tawhiid-hero-stat">
              <div className="tawhiid-hero-stat-icon">
                <GraduationCap size={24} />
              </div>
              <div className="tawhiid-hero-stat-content">
                <div className="tawhiid-hero-stat-value">{metadata.teacher}</div>
                <div className="tawhiid-hero-stat-label">Mwalimu</div>
              </div>
            </div>
            <div className="tawhiid-hero-stat">
              <div className="tawhiid-hero-stat-icon">
                <Building2 size={24} />
              </div>
              <div className="tawhiid-hero-stat-value">
                {metadata.location ? metadata.location.split(',')[0] : 'Chang\'anyikeni'}
                </div>
            </div>
            <div className="tawhiid-hero-stat">
              <div className="tawhiid-hero-stat-icon">
                <Calendar size={24} />
              </div>
              <div className="tawhiid-hero-stat-content">
                <div className="tawhiid-hero-stat-value">{metadata.schedule}</div>
                <div className="tawhiid-hero-stat-label">Ratiba</div>
              </div>
            </div>
          </div>
          {metadata.book && (
            <div className="tawhiid-hero-quote" data-aos="fade-up" data-aos-delay="400">
              <Heart size={24} className="tawhiid-hero-quote-icon" />
              <p>{metadata.book}</p>
              {metadata.author && <p className="tawhiid-hero-quote-translation">{metadata.author}</p>}
              {metadata.startDate && <span className="tawhiid-hero-quote-reference">Kuanzia {metadata.startDate}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="tawhiid-main container">
        {/* Controls Bar */}
        <div className="tawhiid-controls-bar" data-aos="fade-up">
          <div className="tawhiid-search-wrapper">
            <Search size={20} className="tawhiid-search-icon" />
            <input
              type="text"
              placeholder="Tafuta darsa, mwalimu, tarehe..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="tawhiid-search-input"
              aria-label="Tafuta darsa"
              title="Tafuta darsa"
            />
          </div>
          <div className="tawhiid-controls-group">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`tawhiid-filter-btn ${showFilters ? 'active' : ''}`}
              aria-label="Filters"
              title="Filters"
            >
              <Filter size={18} />
              <span className="tawhiid-filter-btn-text">Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="tawhiid-view-toggle">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`tawhiid-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                aria-label="Onyesha kwa gridi"
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`tawhiid-view-btn ${viewMode === 'list' ? 'active' : ''}`}
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
          <div className="tawhiid-filters-panel" data-aos="fade-down">
            <div className="tawhiid-filter-group">
              <label className="tawhiid-filter-label">Panga kwa</label>
              <div className="tawhiid-filter-buttons">
                <button
                  type="button"
                  onClick={() => setSortBy('date')}
                  className={`tawhiid-filter-button ${sortBy === 'date' ? 'active' : ''}`}
                  aria-label="Panga kwa tarehe"
                  title="Panga kwa tarehe"
                >
                  Tarehe
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('title')}
                  className={`tawhiid-filter-button ${sortBy === 'title' ? 'active' : ''}`}
                  aria-label="Panga kwa kichwa"
                  title="Panga kwa kichwa"
                >
                  Kichwa
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('duration')}
                  className={`tawhiid-filter-button ${sortBy === 'duration' ? 'active' : ''}`}
                  aria-label="Panga kwa muda"
                  title="Panga kwa muda"
                >
                  Muda
                </button>
              </div>
            </div>
            <div className="tawhiid-filter-group">
              <label className="tawhiid-filter-label">Mpangilio</label>
              <div className="tawhiid-filter-buttons">
                <button
                  type="button"
                  onClick={() => setSortOrder('asc')}
                  className={`tawhiid-filter-button ${sortOrder === 'asc' ? 'active' : ''}`}
                  aria-label="Panga kwa kupanda"
                  title="Panga kwa kupanda"
                >
                  Kupanda
                </button>
                <button
                  type="button"
                  onClick={() => setSortOrder('desc')}
                  className={`tawhiid-filter-button ${sortOrder === 'desc' ? 'active' : ''}`}
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
        <div className="tawhiid-results-info" data-aos="fade-up">
          <div className="tawhiid-results-count">
            <ListMusic size={20} />
            <span>
              {filteredAudios.length} {filteredAudios.length === 1 ? 'darsa' : 'darsa'}
              {searchTerm && ` zenye "${searchTerm}"`}
            </span>
          </div>
          {bookmarked.length > 0 && (
            <div className="tawhiid-bookmarks-info">
              <Bookmark size={16} />
              <span>{bookmarked.length} zimehifadhiwa</span>
            </div>
          )}
        </div>

        {/* Audio Grid/List */}
        {filteredAudios.length > 0 ? (
          <>
            <div className={`tawhiid-audios-container ${viewMode}`}>
              {paginatedAudios.map((audio, index) => {
                const isPlaying = isCurrentlyPlaying(audio.filename)
                const isBookmarked = bookmarked.includes(audio.filename)
                const darsaNumber = ((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')

                return viewMode === 'grid' ? (
                  <div
                    key={audio.filename}
                    className={`tawhiid-audio-card ${isPlaying ? 'playing' : ''}`}
                    data-aos="fade-up"
                    data-aos-delay={(index % 6) * 50}
                  >
                    <div className="tawhiid-card-header">
                      <span className="tawhiid-card-number">#{darsaNumber}</span>
                      <div className="tawhiid-card-header-actions">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(audio.filename)}
                          className={`tawhiid-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                          aria-label={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                          title={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                        >
                          <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <h3 className="tawhiid-card-title">{audio.title}</h3>
                    {audio.translation && (
                      <p className="tawhiid-card-translation">{audio.translation}</p>
                    )}
                    <div className="tawhiid-card-meta">
                      <div className="tawhiid-card-meta-item">
                        <User size={14} />
                        <span>{audio.speaker}</span>
                      </div>
                      <div className="tawhiid-card-meta-item">
                        <Calendar size={14} />
                        <span>{audio.date}</span>
                      </div>
                      <div className="tawhiid-card-meta-item">
                        <Clock size={14} />
                        <span>{formatDuration(audio.duration)}</span>
                      </div>
                    </div>
                    <div className="tawhiid-card-footer">
                      <div className="tawhiid-card-actions">
                        <button
                          type="button"
                          onClick={() => handleShare(audio)}
                          className="tawhiid-card-action"
                          aria-label="Shiriki"
                          title="Shiriki"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(audio)}
                          className="tawhiid-card-action"
                          aria-label="Pakua"
                          title="Pakua"
                        >
                          <Download size={16} />
                        </button>
                        <a
                           href={`${process.env.NEXT_PUBLIC_AUDIO_BASE_URL}/tawhiid/${audio.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tawhiid-card-action"
                          aria-label="Fungua kwenye tab mpya"
                          title="Fungua kwenye tab mpya"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(audio)}
                        className={`tawhiid-card-play-btn ${isPlaying ? 'playing' : ''}`}
                        disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                        aria-label={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                        title={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                      >
                        {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                          <div className="tawhiid-loading-spinner-small"></div>
                        ) : isPlaying ? (
                          <>
                            <Pause size={18} />
                            <span className="tawhiid-card-play-btn-text">Inacheza</span>
                          </>
                        ) : (
                          <>
                            <Play size={18} />
                            <span className="tawhiid-card-play-btn-text">Cheza</span>
                          </>
                        )}
                      </button>
                    </div>
                    {isPlaying && (
                      <div className="tawhiid-playing-indicator">
                        <span className="tawhiid-playing-bar"></span>
                        <span className="tawhiid-playing-bar"></span>
                        <span className="tawhiid-playing-bar"></span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    key={audio.filename}
                    className={`tawhiid-list-item ${isPlaying ? 'playing' : ''}`}
                    data-aos="fade-up"
                  >
                    <div className="tawhiid-list-number">{darsaNumber}</div>
                    <div className="tawhiid-list-content">
                      <div className="tawhiid-list-info">
                        <h3 className="tawhiid-list-title">{audio.title}</h3>
                        {audio.translation && (
                          <p className="tawhiid-list-translation">{audio.translation}</p>
                        )}
                        <div className="tawhiid-list-meta">
                          <span className="tawhiid-list-meta-item">
                            <User size={14} />
                            {audio.speaker}
                          </span>
                          <span className="tawhiid-list-meta-item">
                            <Calendar size={14} />
                            {audio.date}
                          </span>
                          <span className="tawhiid-list-meta-item">
                            <Clock size={14} />
                            {formatDuration(audio.duration)}
                          </span>
                          <span className="tawhiid-list-meta-item">
                            <FileAudio size={14} />
                            {formatSize(audio.size)}
                          </span>
                        </div>
                      </div>
                      <div className="tawhiid-list-actions">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(audio.filename)}
                          className={`tawhiid-list-action ${isBookmarked ? 'active' : ''}`}
                          aria-label={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                          title={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                        >
                          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShare(audio)}
                          className="tawhiid-list-action"
                          aria-label="Shiriki"
                          title="Shiriki"
                        >
                          <Share2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(audio)}
                          className="tawhiid-list-action"
                          aria-label="Pakua"
                          title="Pakua"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(audio)}
                          className={`tawhiid-list-play-btn ${isPlaying ? 'playing' : ''}`}
                          disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                          aria-label={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                          title={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                        >
                          {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                            <div className="tawhiid-loading-spinner-small"></div>
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
              <div className="tawhiid-pagination" data-aos="fade-up">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="tawhiid-pagination-btn"
                  aria-label="Ukurasa uliopita"
                  title="Ukurasa uliopita"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="tawhiid-pagination-info">
                  Ukurasa {currentPage} wa {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="tawhiid-pagination-btn"
                  aria-label="Ukurasa unaofuata"
                  title="Ukurasa unaofuata"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="tawhiid-empty-state" data-aos="fade-up">
            <BookOpen size={64} className="tawhiid-empty-icon" />
            <h3 className="tawhiid-empty-title">Hakuna Darsa Zilizopatikana</h3>
            <p className="tawhiid-empty-message">
              {searchTerm
                ? `Hakuna darsa zilizo na "${searchTerm}"`
                : 'Hakuna darsa za Tawhiid zilizopatikana.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
              className="tawhiid-empty-btn"
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
        <div className="tawhiid-now-playing-bar">
          <div className="tawhiid-now-playing-content container">
            <div className="tawhiid-now-playing-info">
              <div className="tawhiid-now-playing-cover">
                <BookOpen size={24} />
              </div>
              <div className="tawhiid-now-playing-text">
                <div className="tawhiid-now-playing-title">
                  {audioState.currentLecture.title}
                </div>
                <div className="tawhiid-now-playing-subtitle">
                  {audioState.currentLecture.speaker}
                </div>
              </div>
            </div>
            <div className="tawhiid-now-playing-controls">
              <button
                onClick={prevTrack}
                className="tawhiid-now-playing-control"
                aria-label="Darsa iliyopita"
                title="Darsa iliyopita"
                disabled={audioState.isLoading}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="tawhiid-now-playing-play"
                aria-label={audioState.isPlaying ? 'Simamisha' : 'Cheza'}
                title={audioState.isPlaying ? 'Simamisha' : 'Cheza'}
                disabled={audioState.isLoading}
              >
                {audioState.isLoading ? (
                  <div className="tawhiid-now-playing-loading"></div>
                ) : audioState.isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="tawhiid-now-playing-control"
                aria-label="Darsa inayofuata"
                title="Darsa inayofuata"
                disabled={audioState.isLoading}
              >
                <SkipForward size={20} />
              </button>
              <div className="tawhiid-now-playing-progress">
                <div className="tawhiid-now-playing-time">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
                <div className="tawhiid-now-playing-track">
                  <div className="tawhiid-now-playing-fill"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={audioState.duration || 100}
                  value={audioState.currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="tawhiid-now-playing-range"
                  aria-label="Endelea mbele au nyuma"
                  title="Endelea mbele au nyuma"
                />
              </div>
              <div className="tawhiid-now-playing-volume">
                <button
                  onClick={() => setMuted(!audioState.isMuted)}
                  className="tawhiid-now-playing-volume-btn"
                  aria-label={audioState.isMuted ? 'Washa sauti' : 'Zima sauti'}
                  title={audioState.isMuted ? 'Washa sauti' : 'Zima sauti'}
                >
                  {audioState.isMuted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                <div className="tawhiid-now-playing-volume-track">
                  <div className="tawhiid-now-playing-volume-fill"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioState.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="tawhiid-now-playing-volume-range"
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