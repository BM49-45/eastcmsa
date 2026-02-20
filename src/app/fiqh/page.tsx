'use client'

import { useState, useEffect, useMemo } from 'react'
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
  MapPin,
  Search,
  ListMusic
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
  hijri: string
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

export default function FiqhPage() {
  const [metadata, setMetadata] = useState<FiqhMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { audioState, playLectureAudio, togglePlay, setVolume, setMuted, seekTo, nextTrack, prevTrack, setPlaylist } = useAudio()
  
  useEffect(() => {
    loadMetadata()
  }, [])

  // Update playlist when audios change
  useEffect(() => {
    if (metadata?.files && metadata.files.length > 0) {
      const playlist = metadata.files.map(audio => ({
        type: 'lecture' as const,
        id: audio.filename,
        title: audio.title,
        speaker: audio.speaker,
        url: `/audio/fiqh/${audio.filename}`,
        downloadUrl: `/audio/fiqh/${audio.filename}`,
        filename: audio.filename,
        size: audio.size,
        duration: audio.duration,
        date: audio.date,
        category: 'fiqh',
        semester: 'Darsa za Fiqh',
        venue: metadata.location,
        topics: [],
        language: 'Arabic/Swahili',
        quality: '320kbps'
      }))
      
      console.log('📝 Fiqh playlist created:', playlist.length, 'items')
      setPlaylist(playlist)
    }
  }, [metadata, setPlaylist])

  const loadMetadata = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load metadata from public folder
      const response = await fetch('/audio/fiqh/metadata.json', {
        cache: 'no-cache'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data && data.files && Array.isArray(data.files)) {
        console.log('📋 Metadata loaded:', data.files.length, 'files')
        setMetadata(data)
      } else {
        setError('Muundo wa metadata sio sahihi')
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

  // Format duration to minutes
  const formatDuration = (duration: string) => {
    if (!duration) return '0:00'
    if (duration.includes(':')) {
      const [mins, secs] = duration.split(':').map(Number)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return duration
  }

  // Convert duration string to seconds
  const durationToSeconds = (duration: string): number => {
    if (!duration) return 0
    if (duration.includes(':')) {
      const [mins, secs] = duration.split(':').map(Number)
      return (mins * 60) + secs
    }
    return parseInt(duration) || 0
  }

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!audioState.duration || audioState.duration === 0) return 0
    return (audioState.currentTime / audioState.duration) * 100
  }, [audioState.currentTime, audioState.duration])

  // Calculate volume percentage
  const volumePercentage = useMemo(() => {
    return audioState.volume * 100
  }, [audioState.volume])

  // Sync dynamic widths to CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--fiqh-progress', `${progressPercentage}%`)
      document.documentElement.style.setProperty('--fiqh-volume', `${volumePercentage}%`)
    }
  }, [progressPercentage, volumePercentage])

  // Filter audios
  const filteredAudios = metadata?.files?.filter(audio => {
    return searchTerm === '' ||
      audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audio.date.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  const handlePlayAudio = async (audio: FiqhAudio) => {
    const audioUrl = `/audio/fiqh/${audio.filename}`
    
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
      venue: metadata?.location || 'Masjid Chang\'anyikeni, Ubungo',
      topics: [],
      language: 'Arabic/Swahili',
      quality: '320kbps'
    }
    
    try {
      console.log('🎵 Playing Fiqh audio:', {
        title: audio.title,
        filename: audio.filename,
        url: audioUrl,
        currentPlaying: audioState.currentLecture?.filename
      })
      
      await playLectureAudio(lectureAudio)
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
    }
  }

  const handleDownload = (audio: FiqhAudio) => {
    const audioUrl = `/audio/fiqh/${audio.filename}`
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = audio.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = (audio: FiqhAudio) => {
    const shareText = `${audio.title}\nMwalimu: ${audio.speaker}\nTarehe: ${audio.date} (${audio.hijri})\nMuda: ${audio.duration}`
    const shareUrl = window.location.href
    
    if (navigator.share) {
      navigator.share({
        title: audio.title,
        text: shareText,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      alert('Maelezo ya darsa yamepangwa kwenye clipboard!')
    }
  }

  const isCurrentlyPlaying = (filename: string) => {
    const isPlaying = audioState.isPlaying &&
                     audioState.currentLecture?.filename === filename &&
                     audioState.audioType === 'lecture'
    
    return isPlaying
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (loading) {
    return (
      <div className="fiqh-loading-container">
        <div className="fiqh-loading-spinner">
          <BookOpen className="fiqh-loading-icon" size={32} />
        </div>
        <p className="fiqh-loading-text">Inapakia Darsa za Fiqh...</p>
      </div>
    )
  }

  if (error || !metadata) {
    return (
      <div className="fiqh-error-container">
        <div className="fiqh-error-card">
          <AlertCircle className="fiqh-error-icon" size={56} />
          <h2 className="fiqh-error-title">Hitilafu ya Kupakia Darsa</h2>
          <p className="fiqh-error-message">{error || 'Hakuna data ya metadata ilipatikana'}</p>
          
          <button
            type="button"
            onClick={loadMetadata}
            className="fiqh-retry-btn"
          >
            <RefreshCw size={20} className="mr-3" />
            Jaribu Tena
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fiqh-container">
      {/* Hero Section - WITHOUT background image */}
      <div className="fiqh-hero">
        <div className="fiqh-hero-overlay">
          <div className="fiqh-hero-content">
            <div className="fiqh-hero-badge">
              <div className="fiqh-hero-badge-dot"></div>
              <span className="fiqh-hero-badge-text">دَرْسُ الْفِقْهِ</span>
            </div>
            
            <h1 className="fiqh-hero-title">Darsa za Fiqh</h1>
            
            <div className="fiqh-hero-grid">
              <div>
                <p className="fiqh-hero-description">
                  {metadata.description}
                  <br />
                  <span className="fiqh-hero-author">{metadata.author}</span>
                </p>
                
                <div className="fiqh-hero-info">
                  <div className="fiqh-info-item">
                    <MapPin size={18} />
                    <span>{metadata.location}</span>
                  </div>
                  <div className="fiqh-info-item">
                    <User size={18} />
                    <span>Mwenyekiti: {metadata.teacher}</span>
                  </div>
                  <div className="fiqh-info-item">
                    <Calendar size={18} />
                    <span>{metadata.schedule}</span>
                  </div>
                </div>
              </div>
              
              <div className="fiqh-stats-card">
                <h3 className="fiqh-stats-title">Takwimu za Darsa</h3>
                <div className="fiqh-stats-grid">
                  <div className="fiqh-stat">
                    <div className="fiqh-stat-number">{metadata.files.length}</div>
                    <div className="fiqh-stat-label">Darsa</div>
                  </div>
                  <div className="fiqh-stat">
                    <div className="fiqh-stat-number">
                      {Array.from(new Set(metadata.files.map(f => f.speaker))).length}
                    </div>
                    <div className="fiqh-stat-label">Waalimu</div>
                  </div>
                  <div className="fiqh-stat">
                    <div className="fiqh-stat-number">
                      {formatSize(metadata.files.reduce((sum, audio) => sum + audio.size, 0))}
                    </div>
                    <div className="fiqh-stat-label">Ukubwa</div>
                  </div>
                  <div className="fiqh-stat">
                    <div className="fiqh-stat-number">
                      {Math.round(metadata.files.reduce((sum, audio) => {
                        return sum + durationToSeconds(audio.duration) / 60
                      }, 0))}+
                    </div>
                    <div className="fiqh-stat-label">Dakika</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Search Bar */}
            <div className="fiqh-search-container">
              <div className="fiqh-search-wrapper">
                <Search size={20} className="fiqh-search-icon" />
                <input
                  type="text"
                  placeholder="Tafuta darsa, mwalimu, au tarehe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="fiqh-search-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Grid */}
      <div className="fiqh-content-container">
        <div className="fiqh-list-header">
          <h2 className="fiqh-list-title">
            <ListMusic size={24} className="mr-2" />
            Darsa zote za Fiqh
          </h2>
          <div className="fiqh-list-count">
            {filteredAudios.length} ya {metadata.files.length} darsa
          </div>
        </div>
        {filteredAudios.length > 0 ? (
          <div className="fiqh-grid">
            {filteredAudios.map((audio, index) => {
              const isPlaying = isCurrentlyPlaying(audio.filename)
              return (
                <div
                  key={`${audio.filename}-${index}`}
                  className={`fiqh-audio-card ${isPlaying ? 'fiqh-audio-card-playing' : ''}`}
                >
                  <div className="fiqh-audio-number">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="fiqh-audio-content">
                    <div className="fiqh-audio-header">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="fiqh-audio-title">
                            {audio.title}
                            {isPlaying && (
                              <span className="fiqh-playing-badge">
                                <Volume2 size={14} />
                                Inasikilizwa
                              </span>
                            )}
                          </h3>
                          <div className="fiqh-audio-meta">
                            <div className="fiqh-meta-item">
                              <Clock size={14} />
                              <span>{formatDuration(audio.duration)}</span>
                            </div>
                            <div className="fiqh-meta-item">
                              <Calendar size={14} />
                              <span>{audio.date} ({audio.hijri})</span>
                            </div>
                            <div className="fiqh-meta-item">
                              <User size={14} />
                              <span>{audio.speaker}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="fiqh-audio-actions-top">
                          <button
                            type="button"
                            onClick={() => handleDownload(audio)}
                            className="fiqh-action-icon"
                            title="Pakua"
                            aria-label={`Pakua ${audio.title}`}
                          >
                            <Download size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(audio)}
                            className="fiqh-action-icon"
                            title="Shiriki"
                            aria-label={`Shiriki ${audio.title}`}
                          >
                            <Share2 size={18} />
                          </button>
                          <a
                            href={`/audio/fiqh/${audio.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fiqh-action-icon"
                            title="Fungua kwenye tab mpya"
                            aria-label="Fungua kwenye tab mpya"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Speaker Badge */}
                    <div className="mb-4">
                      <span className={`fiqh-speaker-badge ${
                        audio.speaker.includes('Fadhili')
                          ? 'fiqh-speaker-badge-fadhili'
                          : audio.speaker.includes('Ahmad')
                          ? 'fiqh-speaker-badge-ahmad'
                          : 'fiqh-speaker-badge-default'
                      }`}>
                        {audio.speaker}
                      </span>
                    </div>
                    
                    {/* Audio Info */}
                    <div className="fiqh-audio-info">
                      <div className="fiqh-info-row">
                        <span className="fiqh-info-label">Ukubwa:</span>
                        <span className="fiqh-info-value">{formatSize(audio.size)}</span>
                      </div>
                      <div className="fiqh-info-row">
                        <span className="fiqh-info-label">Aina:</span>
                        <span className="fiqh-info-value">
                          <FileAudio size={12} className="inline mr-1" />
                          MP3 • 320kbps
                        </span>
                      </div>
                      <div className="fiqh-info-row">
                        <span className="fiqh-info-label">Darsa Namba:</span>
                        <span className="fiqh-info-value">{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                    
                    {/* Play Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(audio)}
                      className={`fiqh-play-btn ${isPlaying ? 'fiqh-play-btn-playing' : ''}`}
                      aria-label={isPlaying ? "Pause" : `Sikiliza ${audio.title}`}
                      disabled={audioState.isLoading && audioState.currentLecture?.filename === audio.filename}
                    >
                      {audioState.isLoading && audioState.currentLecture?.filename === audio.filename ? (
                        <div className="fiqh-loading-spinner-small"></div>
                      ) : isPlaying ? (
                        <>
                          <Pause size={20} className="mr-2" />
                          <span>Inasikilizwa</span>
                        </>
                      ) : (
                        <>
                          <Play size={20} className="mr-2" />
                          <span>Sikiliza Sasa</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="fiqh-empty-state">
            <BookOpen className="fiqh-empty-icon" size={48} />
            <h3 className="fiqh-empty-title">Hakuna Darsa Zilizopatikana</h3>
            <p className="fiqh-empty-message">
              {searchTerm
                ? `Hakuna darsa zilizo na "${searchTerm}"`
                : 'Hakuna darsa za Fiqh zilizopatikana.'}
            </p>
          </div>
        )}
      </div>

      {/* Global Now Playing Bar */}
      {audioState.currentLecture && audioState.audioType === 'lecture' && (
        <div className="fiqh-now-playing-bar">
          <div className="fiqh-now-playing-content">
            <div className="fiqh-now-playing-info">
              <div className="fiqh-now-playing-cover">
                <BookOpen size={24} />
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
                title="Darsa iliyopita"
                aria-label="Darsa iliyopita"
                disabled={audioState.isLoading}
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={togglePlay}
                className="fiqh-now-playing-play"
                title={audioState.isPlaying ? "Pause" : "Play"}
                aria-label={audioState.isPlaying ? "Pause" : "Play"}
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
                title="Darsa inayofuata"
                aria-label="Darsa inayofuata"
                disabled={audioState.isLoading}
              >
                <SkipForward size={20} />
              </button>
              
              {/* Progress Bar */}
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
                />
              </div>
              
              {/* Volume Control */}
              <div className="fiqh-now-playing-volume">
                <button
                  onClick={() => setMuted(!audioState.isMuted)}
                  className="fiqh-now-playing-volume-btn"
                  title={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
                  aria-label={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
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
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for progress bars */}
      <style jsx global>{`
        .fiqh-now-playing-fill {
          width: var(--fiqh-progress, 0%);
        }
        
        .fiqh-now-playing-volume-fill {
          width: var(--fiqh-volume, 100%);
        }
        
        @keyframes audio-pulse {
          0%, 100% { height: 0.25rem; }
          50% { height: 1rem; }
        }
        
        .audio-pulse { animation: audio-pulse 0.8s infinite; }
        .audio-pulse-delay-0 { animation-delay: 0s; }
        .audio-pulse-delay-1 { animation-delay: 0.2s; }
        .audio-pulse-delay-2 { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}