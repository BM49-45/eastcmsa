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
  ChevronLeft
} from 'lucide-react'
import { useAudio } from '@/context/AudioContext'
import './page.css'

const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || ''

interface SirahAudio {
  filename: string
  title: string
  translation?: string
  duration: string
  size: number
  speaker: string
  date: string
  hijri: string
}

interface SirahMetadata {
  category: string
  description: string
  book: string
  author: string
  location: string
  teacher: string
  schedule: string
  startDate: string
  files: SirahAudio[]
}

export default function SirahPage() {
  const [metadata, setMetadata] = useState<SirahMetadata | null>(null)
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
    const fetchData = async () => {
      await loadMetadata()
      loadBookmarks()
    }
    fetchData()
  }, [])

  const loadBookmarks = () => {
    const saved = localStorage.getItem('sirah-bookmarks')
    if (saved) {
      try { 
        setBookmarked(JSON.parse(saved)) 
      } catch (e) { 
        console.error(e) 
      }
    }
  }

  const toggleBookmark = (filename: string) => {
    setBookmarked(prev => {
      const newBookmarks = prev.includes(filename) 
        ? prev.filter(f => f !== filename) 
        : [...prev, filename]
      localStorage.setItem('sirah-bookmarks', JSON.stringify(newBookmarks))
      return newBookmarks
    })
  }

  useEffect(() => {
    if (metadata?.files && metadata.files.length > 0 && !playlistSetRef.current) {
      const playlist = metadata.files.map((audio, index) => ({
        type: 'lecture' as const,
        id: audio.filename,
        title: audio.title,
        speaker: audio.speaker,
        url: `${AUDIO_BASE_URL}/sirah/${audio.filename}`,
        downloadUrl: `${AUDIO_BASE_URL}/sirah/${audio.filename}`,
        filename: audio.filename,
        size: audio.size,
        duration: audio.duration,
        date: audio.date,
        category: 'sirah',
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
      const response = await fetch(`${AUDIO_BASE_URL}/sirah/metadata.json`, { cache: 'no-cache' })
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      const data = await response.json()
      if (data?.files && Array.isArray(data.files)) {
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

  const formatSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDuration = (duration: string): string => {
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

  const progressPercentage = useMemo((): number => {
    if (!audioState.duration || audioState.duration === 0) return 0
    return (audioState.currentTime / audioState.duration) * 100
  }, [audioState.currentTime, audioState.duration])

  const volumePercentage = useMemo((): number => {
    return audioState.volume * 100
  }, [audioState.volume])

  useEffect(() => {
    document.documentElement.style.setProperty('--sirah-progress', `${progressPercentage}%`)
    document.documentElement.style.setProperty('--sirah-volume', `${volumePercentage}%`)
  }, [progressPercentage, volumePercentage])

  const filteredAudios = useMemo((): SirahAudio[] => {
    if (!metadata?.files) return []
    let filtered = [...metadata.files]
    
    if (searchTerm) {
      filtered = filtered.filter(audio =>
        audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audio.hijri.toLowerCase().includes(searchTerm.toLowerCase())
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
  const paginatedAudios = useMemo((): SirahAudio[] => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAudios.slice(start, start + itemsPerPage)
  }, [filteredAudios, currentPage])

  const handlePlayAudio = useCallback(async (audio: SirahAudio): Promise<void> => {
    const audioUrl = `${AUDIO_BASE_URL}/sirah/${audio.filename}`
    
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
      category: 'sirah',
      semester: metadata?.book || 'Darsa za Sirah',
      venue: metadata?.location || 'Masjid Chang\'anyikeni, Ubungo',
      topics: [],
      language: 'Arabic/Swahili',
      quality: '320kbps'
    }
    
    try {
      if (audioState.currentLecture?.filename === audio.filename && audioState.audioType === 'lecture') {
        await togglePlay()
      } else {
        await playLectureAudio(lectureAudio)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
    }
  }, [metadata, audioState.currentLecture, audioState.audioType, playLectureAudio, togglePlay])

  const handleDownload = useCallback((audio: SirahAudio): void => {
    const audioUrl = `${AUDIO_BASE_URL}/sirah/${audio.filename}`
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = audio.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleShare = useCallback(async (audio: SirahAudio): Promise<void> => {
    const shareText = `${audio.title}\n${audio.translation || ''}\nMwalimu: ${audio.speaker}\nTarehe: ${audio.date} (${audio.hijri})\nMuda: ${audio.duration}`
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

  const isCurrentlyPlaying = useCallback((filename: string): boolean => {
    return audioState.isPlaying &&
      audioState.currentLecture?.filename === filename &&
      audioState.audioType === 'lecture'
  }, [audioState.isPlaying, audioState.currentLecture, audioState.audioType])

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (loading) {
    return (
      <div className="sirah-loading-container">
        <div className="sirah-loading-spinner">
          <History className="sirah-loading-icon" size={48} />
        </div>
        <p className="sirah-loading-text">Inapakia Darsa za Sirah...</p>
        <p className="sirah-loading-subtext">Maisha ya Mtume Muhammad (SAW)</p>
      </div>
    )
  }

  if (error || !metadata) {
    return (
      <div className="sirah-error-container">
        <div className="sirah-error-card">
          <AlertCircle className="sirah-error-icon" size={64} />
          <h2 className="sirah-error-title">Hitilafu ya Kupakia Darsa</h2>
          <p className="sirah-error-message">{error || 'Hakuna data ya metadata ilipatikana'}</p>
          <button
            onClick={loadMetadata}
            className="sirah-retry-btn"
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
    <div className="sirah-container">
      {/* Hero Section */}
      <div className="sirah-hero">
        <div className="sirah-hero-pattern"></div>
        <div className="sirah-hero-overlay"></div>
        <div className="sirah-hero-content container">
          <div className="sirah-hero-badge">
            <History className="sirah-hero-badge-icon" size={24} />
            <span>سِيرَةُ النَّبِيِّ مُحَمَّدٍ ﷺ</span>
          </div>
          <h1 className="sirah-hero-title">
            Sirah ya Mtume Muhammad <span className="sirah-hero-title-arabic">ﷺ</span>
          </h1>
          <p className="sirah-hero-subtitle">
            {metadata.description}
          </p>
          <div className="sirah-hero-stats">
            <div className="sirah-hero-stat">
              <div className="sirah-hero-stat-icon">
                <BookOpen size={24} />
              </div>
              <div className="sirah-hero-stat-content">
                <div className="sirah-hero-stat-value">{metadata.files.length}</div>
                <div className="sirah-hero-stat-label">Maudhui</div>
              </div>
            </div>
            <div className="sirah-hero-stat">
              <div className="sirah-hero-stat-icon">
                <GraduationCap size={24} />
              </div>
              <div className="sirah-hero-stat-content">
                <div className="sirah-hero-stat-value">{metadata.teacher}</div>
                <div className="sirah-hero-stat-label">Mwalimu</div>
              </div>
            </div>
            <div className="sirah-hero-stat">
              <div className="sirah-hero-stat-icon">
                <Building2 size={24} />
              </div>
              <div className="sirah-hero-stat-content">
                <div className="sirah-hero-stat-value">{metadata.location.split(',')[0]}</div>
                <div className="sirah-hero-stat-label">Mahali</div>
              </div>
            </div>
            <div className="sirah-hero-stat">
              <div className="sirah-hero-stat-icon">
                <Calendar size={24} />
              </div>
              <div className="sirah-hero-stat-content">
                <div className="sirah-hero-stat-value">{metadata.schedule}</div>
                <div className="sirah-hero-stat-label">Ratiba</div>
              </div>
            </div>
          </div>
          <div className="sirah-hero-quote">
            <Heart size={24} className="sirah-hero-quote-icon" />
            <p>{metadata.book}</p>
            <p className="sirah-hero-quote-translation">{metadata.author}</p>
            <span className="sirah-hero-quote-reference">Kuanzia {metadata.startDate}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="sirah-main container">
        {/* Controls Bar */}
        <div className="sirah-controls-bar">
          <div className="sirah-search-wrapper">
            <Search size={20} className="sirah-search-icon" />
            <input
              type="text"
              placeholder="Tafuta darsa, mwalimu, tarehe..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="sirah-search-input"
              aria-label="Tafuta darsa"
              title="Tafuta darsa"
            />
          </div>
          <div className="sirah-controls-group">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sirah-filter-btn ${showFilters ? 'active' : ''}`}
              aria-label="Filters"
              title="Filters"
            >
              <Filter size={18} />
              <span className="sirah-filter-btn-text">Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="sirah-view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`sirah-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                aria-label="Onyesha kwa gridi"
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`sirah-view-btn ${viewMode === 'list' ? 'active' : ''}`}
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
          <div className="sirah-filters-panel">
            <div className="sirah-filter-group">
              <label className="sirah-filter-label">Panga kwa</label>
              <div className="sirah-filter-buttons">
                <button
                  onClick={() => setSortBy('date')}
                  className={`sirah-filter-button ${sortBy === 'date' ? 'active' : ''}`}
                  aria-label="Panga kwa tarehe"
                  title="Panga kwa tarehe"
                >
                  Tarehe
                </button>
                <button
                  onClick={() => setSortBy('title')}
                  className={`sirah-filter-button ${sortBy === 'title' ? 'active' : ''}`}
                  aria-label="Panga kwa kichwa"
                  title="Panga kwa kichwa"
                >
                  Kichwa
                </button>
                <button
                  onClick={() => setSortBy('duration')}
                  className={`sirah-filter-button ${sortBy === 'duration' ? 'active' : ''}`}
                  aria-label="Panga kwa muda"
                  title="Panga kwa muda"
                >
                  Muda
                </button>
              </div>
            </div>
            <div className="sirah-filter-group">
              <label className="sirah-filter-label">Mpangilio</label>
              <div className="sirah-filter-buttons">
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`sirah-filter-button ${sortOrder === 'asc' ? 'active' : ''}`}
                  aria-label="Panga kwa kupanda"
                  title="Panga kwa kupanda"
                >
                  Kupanda
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`sirah-filter-button ${sortOrder === 'desc' ? 'active' : ''}`}
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
        <div className="sirah-results-info">
          <div className="sirah-results-count">
            <ListMusic size={20} />
            <span>
              {filteredAudios.length} {filteredAudios.length === 1 ? 'darsa' : 'darsa'}
              {searchTerm && ` zenye "${searchTerm}"`}
            </span>
          </div>
          
          {bookmarked.length > 0 && (
            <div className="sirah-bookmarks-info">
              <Bookmark size={16} />
              <span>{bookmarked.length} zimehifadhiwa</span>
            </div>
          )}
        </div>

        {/* Audio Grid/List */}
        {filteredAudios.length > 0 ? (
          <>
            <div className={`sirah-audios-container ${viewMode}`}>
              {paginatedAudios.map((audio, index) => {
                const isPlaying = isCurrentlyPlaying(audio.filename)
                const isBookmarked = bookmarked.includes(audio.filename)
                const darsaNumber = ((currentPage - 1) * itemsPerPage + index + 1).toString().padStart(2, '0')

                return viewMode === 'grid' ? (
                  <div
                    key={audio.filename}
                    className={`sirah-audio-card ${isPlaying ? 'playing' : ''}`}
                  >
                    <div className="sirah-card-header">
                      <span className="sirah-card-number">#{darsaNumber}</span>
                      <div className="sirah-card-header-actions">
                        <button
                          onClick={() => toggleBookmark(audio.filename)}
                          className={`sirah-bookmark-btn ${isBookmarked ? 'active' : ''}`}
                          aria-label={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                          title={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                        >
                          <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <h3 className="sirah-card-title">{audio.title}</h3>
                    {audio.translation && (
                      <p className="sirah-card-translation">{audio.translation}</p>
                    )}
                    <div className="sirah-card-meta">
                      <div className="sirah-card-meta-item">
                        <User size={14} />
                        <span>{audio.speaker}</span>
                      </div>
                      <div className="sirah-card-meta-item">
                        <Calendar size={14} />
                        <span title={audio.hijri}>{audio.date}</span>
                      </div>
                      <div className="sirah-card-meta-item">
                        <Clock size={14} />
                        <span>{formatDuration(audio.duration)}</span>
                      </div>
                    </div>
                    <div className="sirah-card-footer">
                      <div className="sirah-card-actions">
                        <button
                          onClick={() => handleShare(audio)}
                          className="sirah-card-action"
                          aria-label="Shiriki"
                          title="Shiriki"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(audio)}
                          className="sirah-card-action"
                          aria-label="Pakua"
                          title="Pakua"
                        >
                          <Download size={16} />
                        </button>
                        <a
                          href={`${AUDIO_BASE_URL}/sirah/${audio.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sirah-card-action"
                          aria-label="Fungua kwenye tab mpya"
                          title="Fungua kwenye tab mpya"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(audio)}
                        className={`sirah-card-play-btn ${isPlaying ? 'playing' : ''}`}
                        disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                        aria-label={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                        title={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                      >
                        {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                          <div className="sirah-loading-spinner-small"></div>
                        ) : isPlaying ? (
                          <>
                            <Pause size={18} />
                            <span className="sirah-card-play-btn-text">Inacheza</span>
                          </>
                        ) : (
                          <>
                            <Play size={18} />
                            <span className="sirah-card-play-btn-text">Cheza</span>
                          </>
                        )}
                      </button>
                    </div>
                    {isPlaying && (
                      <div className="sirah-playing-indicator">
                        <span className="sirah-playing-bar"></span>
                        <span className="sirah-playing-bar"></span>
                        <span className="sirah-playing-bar"></span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    key={audio.filename}
                    className={`sirah-list-item ${isPlaying ? 'playing' : ''}`}
                  >
                    <div className="sirah-list-number">{darsaNumber}</div>
                    <div className="sirah-list-content">
                      <div className="sirah-list-info">
                        <h3 className="sirah-list-title">{audio.title}</h3>
                        {audio.translation && (
                          <p className="sirah-list-translation">{audio.translation}</p>
                        )}
                        <div className="sirah-list-meta">
                          <span className="sirah-list-meta-item">
                            <User size={14} />
                            {audio.speaker}
                          </span>
                          <span className="sirah-list-meta-item">
                            <Calendar size={14} />
                            {audio.date} ({audio.hijri})
                          </span>
                          <span className="sirah-list-meta-item">
                            <Clock size={14} />
                            {formatDuration(audio.duration)}
                          </span>
                          <span className="sirah-list-meta-item">
                            <FileAudio size={14} />
                            {formatSize(audio.size)}
                          </span>
                        </div>
                      </div>
                      <div className="sirah-list-actions">
                        <button
                          onClick={() => toggleBookmark(audio.filename)}
                          className={`sirah-list-action ${isBookmarked ? 'active' : ''}`}
                          aria-label={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                          title={isBookmarked ? 'Ondoa kwenye bookmark' : 'Weka kwenye bookmark'}
                        >
                          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => handleShare(audio)}
                          className="sirah-list-action"
                          aria-label="Shiriki"
                          title="Shiriki"
                        >
                          <Share2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(audio)}
                          className="sirah-list-action"
                          aria-label="Pakua"
                          title="Pakua"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handlePlayAudio(audio)}
                          className={`sirah-list-play-btn ${isPlaying ? 'playing' : ''}`}
                          disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                          aria-label={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                          title={isPlaying ? 'Simamisha' : `Cheza ${audio.title}`}
                        >
                          {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                            <div className="sirah-loading-spinner-small"></div>
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
              <div className="sirah-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="sirah-pagination-btn"
                  aria-label="Ukurasa uliopita"
                  title="Ukurasa uliopita"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="sirah-pagination-info">
                  Ukurasa {currentPage} wa {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="sirah-pagination-btn"
                  aria-label="Ukurasa unaofuata"
                  title="Ukurasa unaofuata"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="sirah-empty-state">
            <History size={64} className="sirah-empty-icon" />
            <h3 className="sirah-empty-title">Hakuna Darsa Zilizopatikana</h3>
            <p className="sirah-empty-message">
              {searchTerm
                ? `Hakuna darsa zilizo na "${searchTerm}"`
                : 'Hakuna darsa za Sirah zilizopatikana.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
              className="sirah-empty-btn"
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
        <div className="sirah-now-playing-bar">
          <div className="sirah-now-playing-content container">
            <div className="sirah-now-playing-info">
              <div className="sirah-now-playing-cover">
                <History size={24} />
              </div>
              <div className="sirah-now-playing-text">
                <div className="sirah-now-playing-title">
                  {audioState.currentLecture.title}
                </div>
                <div className="sirah-now-playing-subtitle">
                  {audioState.currentLecture.speaker}
                </div>
              </div>
            </div>
            <div className="sirah-now-playing-controls">
              <button
                onClick={prevTrack}
                className="sirah-now-playing-control"
                aria-label="Darsa iliyopita"
                title="Darsa iliyopita"
                disabled={audioState.isLoading}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="sirah-now-playing-play"
                aria-label={audioState.isPlaying ? 'Simamisha' : 'Cheza'}
                title={audioState.isPlaying ? 'Simamisha' : 'Cheza'}
                disabled={audioState.isLoading}
              >
                {audioState.isLoading ? (
                  <div className="sirah-now-playing-loading"></div>
                ) : audioState.isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="sirah-now-playing-control"
                aria-label="Darsa inayofuata"
                title="Darsa inayofuata"
                disabled={audioState.isLoading}
              >
                <SkipForward size={20} />
              </button>
              <div className="sirah-now-playing-progress">
                <div className="sirah-now-playing-time">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
                <div className="sirah-now-playing-track">
                  <div className="sirah-now-playing-fill"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={audioState.duration || 100}
                  value={audioState.currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="sirah-now-playing-range"
                  aria-label="Endelea mbele au nyuma"
                  title="Endelea mbele au nyuma"
                />
              </div>
              <div className="sirah-now-playing-volume">
                <button
                  onClick={() => setMuted(!audioState.isMuted)}
                  className="sirah-now-playing-volume-btn"
                  aria-label={audioState.isMuted ? 'Washa sauti' : 'Zima sauti'}
                  title={audioState.isMuted ? 'Washa sauti' : 'Zima sauti'}
                >
                  {audioState.isMuted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                <div className="sirah-now-playing-volume-track">
                  <div className="sirah-now-playing-volume-fill"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioState.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="sirah-now-playing-volume-range"
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