'use client'

import { useAudio } from '@/context/AudioContext'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, Music, BookOpen, Headphones } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import './GlobalAudioPlayer.css'

export default function GlobalAudioPlayer() {
  const {
    audioState,
    togglePlay,
    setVolume,
    setMuted,
    seekTo,
    nextTrack,
    prevTrack,
    getCurrentPlaying,
    getCurrentType
  } = useAudio()

  const [isExpanded, setIsExpanded] = useState(true)
  const [localVolume, setLocalVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    setLocalVolume(audioState.volume)
  }, [audioState.volume])

  // Clear error after 3 seconds
  useEffect(() => {
    if (lastError) {
      const timer = setTimeout(() => setLastError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [lastError])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVolumeChange = (value: number) => {
    const newVolume = Math.max(0, Math.min(1, value))
    setLocalVolume(newVolume)
    setVolume(newVolume)
    if (newVolume === 0) {
      setMuted(true)
    } else if (audioState.isMuted) {
      setMuted(false)
    }
  }

  const handleMuteToggle = () => {
    if (audioState.isMuted) {
      setMuted(false)
      setVolume(localVolume > 0 ? localVolume : 0.7)
    } else {
      setMuted(true)
    }
  }

  // Safe toggle play with error handling
  const handleTogglePlay = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    setLastError(null)
    
    try {
      console.log('🎵 GlobalAudioPlayer: Toggling play...')
      await togglePlay()
      console.log('🎵 GlobalAudioPlayer: Toggle successful')
    } catch (error) {
      console.error('🎵 GlobalAudioPlayer: Toggle failed:', error)
      setLastError(error instanceof Error ? error.message : 'Imeshindwa kucheza audio')
    } finally {
      setIsLoading(false)
    }
  }

  // Safe next/prev track
  const handleNextTrack = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await nextTrack()
    } catch (error) {
      console.error('🎵 GlobalAudioPlayer: Next track failed:', error)
      setLastError('Imeshindwa kucheza audio ijayo')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevTrack = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoading) return
    
    setIsLoading(true)
    try {
      await prevTrack()
    } catch (error) {
      console.error('🎵 GlobalAudioPlayer: Prev track failed:', error)
      setLastError('Imeshindwa kucheza audio iliyopita')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!audioState.duration || audioState.duration <= 0) return 0
    const percentage = (audioState.currentTime / audioState.duration) * 100
    return Math.min(Math.max(Math.floor(percentage), 0), 100)
  }, [audioState.currentTime, audioState.duration])

  // Calculate volume percentage
  const volumePercentage = useMemo(() => {
    const percentage = audioState.isMuted ? 0 : audioState.volume * 100
    return Math.min(Math.max(Math.floor(percentage), 0), 100)
  }, [audioState.volume, audioState.isMuted])

  // Get current content info
  const currentContent = useMemo(() => {
    const currentType = getCurrentType()
    const currentPlaying = getCurrentPlaying()
    
    if (!currentPlaying) return null

    if (currentType === 'quran' && 'surah' in currentPlaying) {
      return {
        type: 'quran' as const,
        title: currentPlaying.surah.englishName,
        subtitle: currentPlaying.reciter.name,
        icon: 'quran' as const,
        bgClass: 'quran-bg',
        color: 'text-blue-400'
      }
    } else if (currentType === 'tawhiid' && 'title' in currentPlaying) {
      return {
        type: 'tawhiid' as const,
        title: currentPlaying.title,
        subtitle: currentPlaying.speaker || '',
        icon: 'tawhiid' as const,
        bgClass: 'tawhiid-bg',
        color: 'text-green-400'
      }
    } else if (currentType === 'lecture' && 'title' in currentPlaying) {
      return {
        type: 'lecture' as const,
        title: currentPlaying.title,
        subtitle: currentPlaying.speaker || '',
        icon: 'lecture' as const,
        bgClass: 'lecture-bg',
        color: 'text-purple-400'
      }
    }
    
    return null
  }, [getCurrentType, getCurrentPlaying])

  // Don't render if nothing is playing
  if (!currentContent) {
    return null
  }

  // Get progress fill class
  const getProgressFillClass = () => {
    return `progress-fill-${progressPercentage}`
  }

  // Get volume fill class
  const getVolumeFillClass = () => {
    return `progress-fill-${volumePercentage}`
  }

  // Get icon component based on type
  const getIcon = () => {
    switch (currentContent.icon) {
      case 'quran':
        return <BookOpen className="player-icon-svg" />
      case 'tawhiid':
        return <BookOpen className="player-icon-svg" />
      case 'lecture':
        return <Headphones className="player-icon-svg" />
      default:
        return <Music className="player-icon-svg" />
    }
  }

  return (
    <div className={`global-audio-player ${currentContent.bgClass} ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Error Message */}
      {lastError && (
        <div className="player-error-message">
          <span className="player-error-text">{lastError}</span>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="player-loading-overlay">
          <div className="player-loading-spinner"></div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
        className="player-toggle-btn"
        aria-label={isExpanded ? "Ficha mpiga muziki" : "Onyesha mpiga muziki"}
        title={isExpanded ? "Ficha" : "Onyesha"}
        disabled={isLoading}
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        <span>{isExpanded ? 'Ficha' : 'Onyesha'}</span>
      </button>

      {isExpanded && (
        <div className="player-expanded-content">
          {/* Current playing info */}
          <div className="player-info-section">
            <div className="player-media-info">
              <div className={`player-icon-container ${currentContent.icon}`}>
                {currentContent.icon === 'quran' && audioState.currentSurah ? (
                  <span className="player-icon-text">
                    {audioState.currentSurah.number.toString().padStart(3, '0')}
                  </span>
                ) : (
                  getIcon()
                )}
              </div>
              <div className="player-text-info">
                <div className="player-badge-container">
                  {currentContent.icon === 'quran' ? (
                    <BookOpen size={16} className="player-badge-icon" />
                  ) : currentContent.icon === 'tawhiid' ? (
                    <BookOpen size={16} className="player-badge-icon" />
                  ) : (
                    <Headphones size={16} className="player-badge-icon" />
                  )}
                  <span className={`player-badge ${currentContent.icon}`}>
                    {currentContent.type === 'quran' ? 'Quran' : 
                     currentContent.type === 'tawhiid' ? 'Tawhiid' : 'Lecture'}
                  </span>
                </div>
                <h3 className="player-title" title={currentContent.title}>
                  {currentContent.title}
                </h3>
                <p className="player-subtitle" title={currentContent.subtitle}>
                  {currentContent.subtitle}
                </p>
              </div>
            </div>

            {/* Control buttons */}
            <div className="player-controls">
              <button
                type="button"
                onClick={handlePrevTrack}
                className="player-control-btn prev-btn"
                aria-label="Darsa iliyopita"
                title="Darsa iliyopita"
                disabled={isLoading}
              >
                <SkipBack size={20} />
              </button>
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`player-play-btn ${currentContent.icon} ${isLoading ? 'loading' : ''}`}
                aria-label={audioState.isPlaying ? "Simamisha sauti" : "Sikiliza sauti"}
                title={audioState.isPlaying ? "Simamisha" : "Sikiliza"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="player-spinner"></div>
                ) : audioState.isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} />
                )}
              </button>
              <button
                type="button"
                onClick={handleNextTrack}
                className="player-control-btn next-btn"
                aria-label="Darsa inayofuata"
                title="Darsa inayofuata"
                disabled={isLoading}
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="player-progress-section">
            <div className="player-time-display">
              <span>{formatTime(audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
            <div className="player-progress-bar">
              <div className={`player-progress-fill ${getProgressFillClass()} ${currentContent.icon}`} />
              <input
                type="range"
                min="0"
                max={audioState.duration || 100}
                value={audioState.currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="player-progress-input"
                aria-label="Nenda mahali fulani kwenye sauti"
                title="Badili mahali"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Volume control */}
          <div className="player-volume-section">
            <div className="player-volume-controls">
              <button
                type="button"
                onClick={handleMuteToggle}
                className="player-volume-btn"
                aria-label={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
                title={audioState.isMuted ? "Washa" : "Zima"}
                disabled={isLoading}
              >
                {audioState.isMuted || audioState.volume === 0 ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              <div className="player-volume-slider">
                <div className="player-volume-track">
                  <div className={`player-volume-fill ${getVolumeFillClass()} ${currentContent.icon}`} />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioState.isMuted ? 0 : localVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="player-volume-input"
                  aria-label="Badilisha sauti"
                  title="Punguza/ongeza sauti"
                  disabled={isLoading}
                />
              </div>
              <span className="player-volume-percentage">
                {audioState.isMuted ? 'Zimwa' : `${Math.round(localVolume * 100)}%`}
              </span>
            </div>

            {/* Speed info */}
            <div className="player-speed-info">
              <span className={`player-speed-badge ${currentContent.icon}`}>
                {audioState.playbackRate}x
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed view */}
      {!isExpanded && (
        <div className="player-collapsed-content">
          <div className="player-collapsed-info">
            <div className={`player-collapsed-icon ${currentContent.icon}`}>
              {currentContent.icon === 'quran' && audioState.currentSurah ? (
                <span className="player-collapsed-icon-text">
                  {audioState.currentSurah.number}
                </span>
              ) : (
                getIcon()
              )}
            </div>
            <div className="player-collapsed-text">
              <p className="player-collapsed-title" title={currentContent.title}>
                {currentContent.title}
              </p>
              <div className="player-collapsed-time">
                <span className={`player-current-time ${currentContent.icon}`}>
                  {formatTime(audioState.currentTime)}
                </span>
                <span className="player-time-separator">/</span>
                <span className="player-total-time">
                  {formatTime(audioState.duration)}
                </span>
              </div>
            </div>
          </div>
          <div className="player-collapsed-controls">
            <button
              type="button"
              onClick={handlePrevTrack}
              className="player-collapsed-control-btn prev-btn"
              aria-label="Darsa iliyopita"
              title="Darsa iliyopita"
              disabled={isLoading}
            >
              <SkipBack size={14} />
            </button>
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`player-collapsed-play-btn ${currentContent.icon} ${isLoading ? 'loading' : ''}`}
              aria-label={audioState.isPlaying ? "Simamisha sauti" : "Sikiliza sauti"}
              title={audioState.isPlaying ? "Simamisha" : "Sikiliza"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="player-collapsed-spinner"></div>
              ) : audioState.isPlaying ? (
                <Pause size={14} />
              ) : (
                <Play size={14} />
              )}
            </button>
            <button
              type="button"
              onClick={handleNextTrack}
              className="player-collapsed-control-btn next-btn"
              aria-label="Darsa inayofuata"
              title="Darsa inayofuata"
              disabled={isLoading}
            >
              <SkipForward size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}