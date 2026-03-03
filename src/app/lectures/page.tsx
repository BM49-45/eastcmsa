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
  Headphones,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  MapPin,
  Search
} from 'lucide-react'
import { useAudio } from '@/context/AudioContext'
import './Page.css'

interface Lecture {
  filename: string
  title: string
  duration: string
  size: number
  speaker: string
  date: string
}

interface Metadata {
  category: string
  description: string
  files: Lecture[]
}

const AUDIO_BASE_URL = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || ''

const fallbackMetadata: Metadata = {
  category: "mihadhara",
  description: "Mihadhara ya kila semister kutoka kwa Masheikh",
  files: [
    {
      filename: "01-vipengele-kumi-katika-fani-za-kielimu.mp3",
      title: "VIPENGELE KUMI KATIKA FANI ZA KIELIMU",
      duration: "48:46",
      size: 46821375,
      speaker: "Sheikh Abuu Mus'ab At Tanzaniy",
      date: "2024-12-14"
    },
    {
      filename: "03-Kitaab-Al-Usuul-Muhimmah-li-Shabab-al-Ummah.mp3",
      title: "MISINGI MUHIMU KWA VIJANA WA UMMA WA KIISLAMU",
      duration: "02:29:14",
      size: 143262240,
      speaker: "Sheikh Abuu Umeir Adam Khamis",
      date: "2024-04-26"
    },
    {
      filename: "04-Kuzihesabu-Nafsi.mp3",
      title: "KUZIHESABU NAFSI",
      duration: "01:58:41",
      size: 113942694,
      speaker: "Sheikh Abuu Umeir Adam Khamis",
      date: "2025-06-21"
    }
  ]
}

export default function LecturesPage() {
  const [metadata, setMetadata] = useState<Metadata>(fallbackMetadata)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const playlistSetRef = useRef(false)

  const { audioState, playLectureAudio, togglePlay, setVolume, setMuted, seekTo, nextTrack, prevTrack, setPlaylist } = useAudio()

  const loadLectures = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${AUDIO_BASE_URL}/mihadhara/metadata.json`)

      if (!response.ok) {
        console.log('⚠️ Metadata haipatikani, tunatumia mock data')
        setMetadata(fallbackMetadata)
        return
      }

      const data = await response.json() as Metadata
      setMetadata(data)
    } catch (error: any) {
      console.error('❌ Hitilafu:', error)
      setError(`Hitilafu ya muunganisho: ${error.message}`)
      setMetadata(fallbackMetadata)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLectures()
  }, [])

  useEffect(() => {
    if (metadata.files.length > 0 && !playlistSetRef.current) {
      const playlist = metadata.files.map(lecture => ({
        type: 'lecture' as const,
        id: lecture.filename,
        title: lecture.title,
        speaker: lecture.speaker,
        url: `${AUDIO_BASE_URL}/mihadhara/${lecture.filename}`,
        downloadUrl: `${AUDIO_BASE_URL}/mihadhara/${lecture.filename}`,
        filename: lecture.filename,
        size: lecture.size,
        duration: lecture.duration,
        date: lecture.date,
        category: 'mihadhara',
        semester: 'Mihadhara Mbalimbali',
        venue: 'Masjid Chang\'anyikeni, Ubungo',
        topics: [],
        language: 'Swahili',
        quality: '320kbps'
      }))
      setPlaylist(playlist)
      playlistSetRef.current = true
    }
  }, [metadata.files, setPlaylist])

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('sw-TZ', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  const progressPercentage = useMemo(() => {
    return audioState.duration
      ? (audioState.currentTime / audioState.duration) * 100
      : 0
  }, [audioState.currentTime, audioState.duration])

  const volumePercentage = useMemo(() => audioState.volume * 100, [audioState.volume])

  useEffect(() => {
  try {
    document.documentElement.style.setProperty('--lectures-progress', `${progressPercentage}%`)
    document.documentElement.style.setProperty('--lectures-volume', `${volumePercentage}%`)
  } catch {}
}, [progressPercentage, volumePercentage])

  const filteredLectures = metadata.files.filter(lecture =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePlayLecture = useCallback((lecture: Lecture) => {
    playLectureAudio({
      type: 'lecture' as const,
      id: lecture.filename,
      title: lecture.title,
      speaker: lecture.speaker,
      url: `${AUDIO_BASE_URL}/mihadhara/${lecture.filename}`,
      downloadUrl: `${AUDIO_BASE_URL}/mihadhara/${lecture.filename}`,
      filename: lecture.filename,
      size: lecture.size,
      duration: lecture.duration,
      date: lecture.date,
      category: 'mihadhara',
      semester: 'Mihadhara Mbalimbali',
      venue: 'Masjid Chang\'anyikeni, Ubungo',
      topics: [],
      language: 'Swahili',
      quality: '320kbps'
    })
  }, [playLectureAudio])

  const handleDownload = useCallback((lecture: Lecture) => {
    const audioUrl = `${AUDIO_BASE_URL}/mihadhara/${lecture.filename}`
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = lecture.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleShare = useCallback(async (lecture: Lecture) => {
    const shareText = `${lecture.title}\nMhadhiri: ${lecture.speaker}\nTarehe: ${lecture.date}\nMuda: ${lecture.duration}`
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: lecture.title,
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      alert('Maelezo ya muhadhara yamepangwa kwenye clipboard!')
    }
  }, [])

  if (loading) {
    return (
      <div className="lectures-loading-container">
        <div className="lectures-spinner">
          <div className="lectures-spinner-inner"></div>
          <Headphones className="lectures-spinner-icon" />
        </div>
        <p className="lectures-loading-text">Inapakia Mihadhara...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lectures-error-container">
        <div className="lectures-error-content">
          <AlertCircle className="lectures-error-icon" />
          <h2 className="lectures-error-title">Hitilafu ya Kupakia Mihadhara</h2>
          <p className="lectures-error-message">{error}</p>
          <button
            type="button"
            onClick={loadLectures}
            className="lectures-retry-btn"
            aria-label="Jaribu upya kupakia mihadhara"
            title="Jaribu upya"
          >
            <RefreshCw className="lectures-retry-icon" />
            Jaribu Tena
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lectures-container">
      {/* Hero Section */}
      <div className="lectures-hero-section">
        <div className="lectures-hero-overlay"></div>
        <div className="lectures-hero-content">
          <div className="lectures-category-badge">
            <div className="lectures-category-dot"></div>
            <span className="lectures-category-text">Mihadhara ya Semister</span>
          </div>

          <h1 className="lectures-title">Mihadariko ya Kiislamu</h1>
          <p className="lectures-description">{metadata.description}</p>

          <div className="lectures-search-container">
            <div className="lectures-search-wrapper">
              <input
                type="text"
                placeholder="Tafuta mihadhara au mhadhiri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lectures-search-input"
                aria-label="Tafuta mihadhara"
                title="Tafuta mihadhara"
              />
              <div className="lectures-search-icon" aria-hidden="true">
                <Search size={18} />
              </div>
            </div>
          </div>

          <div className="lectures-stats-grid">
            <div className="lectures-stat-card">
              <div className="lectures-stat-value">{metadata.files.length}</div>
              <div className="lectures-stat-label">Jumla ya Mihadhara</div>
            </div>
            <div className="lectures-stat-card">
              <div className="lectures-stat-value">
                {formatSize(metadata.files.reduce((sum, lecture) => sum + lecture.size, 0))}
              </div>
              <div className="lectures-stat-label">Ukubwa Wa Jumla</div>
            </div>
            <div className="lectures-stat-card">
              <div className="lectures-stat-value">
                {metadata.files.filter(l => l.duration).length}
              </div>
              <div className="lectures-stat-label">Zina Muda</div>
            </div>
            <div className="lectures-stat-card">
              <div className="lectures-stat-value">
                {new Set(metadata.files.map(l => l.speaker)).size}
              </div>
              <div className="lectures-stat-label">Wahadhiri</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Grid */}
      <div className="lectures-grid-container">
        {filteredLectures.length > 0 ? (
          <div className="lectures-grid">
            {filteredLectures.map((lecture, index) => {
              const isPlaying = audioState.currentLecture?.filename === lecture.filename

              return (
                <div key={index} className={`lecture-card ${isPlaying ? 'lecture-card-playing' : ''}`}>
                  <div className="lecture-card-content">
                    <div className="lecture-header">
                      <div className="lecture-header-left">
                        <div className={`lecture-index-badge ${isPlaying ? 'lecture-index-playing' : ''}`}>
                          {isPlaying && audioState.isPlaying ? (
                            <div className="audio-bars">
                              <div className="audio-bar"></div>
                              <div className="audio-bar"></div>
                              <div className="audio-bar"></div>
                            </div>
                          ) : (
                            <span className="lecture-index-number">{index + 1}</span>
                          )}
                        </div>

                        {lecture.duration && (
                          <div className="lecture-duration-badge">
                            <Clock className="lecture-duration-icon" />
                            <span className="lecture-duration-text">{lecture.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className="lecture-actions">
                        <button
                          type="button"
                          onClick={() => handleDownload(lecture)}
                          className="lecture-action-btn"
                          aria-label={`Pakua ${lecture.title}`}
                          title={`Pakua ${lecture.title}`}
                        >
                          <Download className="lecture-action-icon" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShare(lecture)}
                          className="lecture-action-btn"
                          aria-label={`Shiriki ${lecture.title}`}
                          title={`Shiriki ${lecture.title}`}
                        >
                          <Share2 className="lecture-action-icon" />
                        </button>

                        <a
                          href={`${AUDIO_BASE_URL}/mihadhara/${lecture.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lecture-action-btn"
                          aria-label={`Fungua ${lecture.title} kwenye tab mpya`}
                          title={`Fungua ${lecture.title} kwenye tab mpya`}
                        >
                          <ExternalLink className="lecture-action-icon" />
                        </a>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lecture-body">
                      <h3 className="lecture-title-text">{lecture.title}</h3>
                      <div className="lecture-info-grid">
                        <div className="lecture-info-item">
                          <User className="lecture-info-icon speaker-icon" />
                          <span className="lecture-info-text">{lecture.speaker}</span>
                        </div>
                        <div className="lecture-info-item">
                          <Calendar className="lecture-info-icon date-icon" />
                          <span className="lecture-info-text">{formatDate(lecture.date)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="lecture-details">
                      <div className="lecture-detail-row">
                        <span className="lecture-detail-label">Ukubwa:</span>
                        <span className="lecture-detail-value">{formatSize(lecture.size)}</span>
                      </div>
                      <div className="lecture-detail-row">
                        <span className="lecture-detail-label">Aina:</span>
                        <span className="lecture-detail-value">
                          <FileAudio className="lecture-file-icon" /> MP3 • 320kbps
                        </span>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      type="button"
                      onClick={() => handlePlayLecture(lecture)}
                      className={`lecture-play-btn ${isPlaying ? 'lecture-playing' : ''}`}
                      disabled={audioState.isLoading && audioState.currentLecture?.filename === lecture.filename}
                      aria-label={`Sikiliza ${lecture.title}`}
                      title={`Sikiliza ${lecture.title}`}
                    >
                      {audioState.isLoading && audioState.currentLecture?.filename === lecture.filename ? (
                        <div className="lectures-loading-spinner-small"></div>
                      ) : isPlaying && audioState.isPlaying ? (
                        <>
                          <Pause className="lecture-play-icon" />
                          <span>Inasikilizwa</span>
                        </>
                      ) : (
                        <>
                          <Play className="lecture-play-icon" />
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
          <div className="lectures-empty-state">
            <Headphones className="lectures-empty-icon" />
            <h3 className="lectures-empty-title">Hakuna Mihadhara Zilizopatikana</h3>
            <p className="lectures-empty-message">
              {searchTerm ? `Hakuna mihadhara iliyo na "${searchTerm}"` : 'Hakuna mihadhara katika kategoria hii bado'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Player */}
      {audioState.currentLecture && (
        <div className="lectures-floating-player">
          <div className="floating-player-content">
            <div className="floating-player-header">
              <div className="floating-player-left">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="floating-play-btn"
                  aria-label={audioState.isPlaying ? "Simamisha" : "Sikiliza"}
                  title={audioState.isPlaying ? "Simamisha" : "Sikiliza"}
                >
                  {audioState.isPlaying ? <Pause className="floating-play-icon" /> : <Play className="floating-play-icon" />}
                </button>
                <div className="floating-player-info">
                  <p className="floating-player-title">{audioState.currentLecture.title}</p>
                  <p className="floating-player-speaker">{audioState.currentLecture.speaker}</p>
                </div>
              </div>
              <div className="floating-player-controls">
                <button
                  type="button"
                  onClick={prevTrack}
                  className="floating-control-btn"
                  aria-label="Mihadhara iliyopita"
                  title="Mihadhara iliyopita"
                >
                  <SkipBack className="floating-control-icon" />
                </button>
                <button
                  type="button"
                  onClick={nextTrack}
                  className="floating-control-btn"
                  aria-label="Mihadhara inayofuata"
                  title="Mihadhara inayofuata"
                >
                  <SkipForward className="floating-control-icon" />
                </button>
              </div>
            </div>

            {/* Progress */}
<div className="floating-progress-container">
  <div className="floating-time-display">
    <span>{formatTime(audioState.currentTime)}</span>
    <span>{formatTime(audioState.duration)}</span>
  </div>
  <div className="floating-progress-bar">
    <div className="floating-progress-track">
      <div className="floating-progress-fill"></div>
    </div>
    <input
      type="range"
      min={0}
      max={audioState.duration || 100}
      value={audioState.currentTime}
      onChange={(e) => seekTo(parseFloat(e.target.value))}
      className="floating-progress-input"
      aria-label="Endelea mbele au nyuma"
    />
  </div>
</div>

{/* Volume */}
<div className="floating-volume-container">
  <button
    type="button"
    onClick={() => setMuted(!audioState.isMuted)}
    className="floating-volume-btn"
    aria-label={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
    title={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
  >
    {audioState.isMuted ? <VolumeX className="floating-volume-icon" /> : <Volume2 className="floating-volume-icon" />}
  </button>
  <div className="floating-volume-slider">
    <div className="floating-volume-track">
      <div className="floating-volume-fill"></div>
    </div>
    <input
      type="range"
      min={0}
      max={1}
      step={0.1}
      value={audioState.volume}
      onChange={(e) => setVolume(parseFloat(e.target.value))}
      className="floating-volume-input"
      aria-label="Badilisha ukubwa wa sauti"
    />
  </div>
</div>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="lectures-location-info">
        <div className="location-content">
          <MapPin className="location-icon" />
          <div>
            <h4 className="location-title">Mahali: Msikiti Mkuu Changanyikeni, EASTC</h4>
            <p className="location-description">
              Mihadhara hufanyika kila semister. Audio zote zimehifadhiwa kwa ubora wa juu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}