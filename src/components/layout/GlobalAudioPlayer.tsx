'use client'

import { useAudio } from '@/context/AudioContext'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import './GlobalAudioPlayer.css'

export default function GlobalAudioPlayer() {
  const { audioState, togglePlay, nextTrack, prevTrack, setVolume, setMuted, seekTo, hideMiniPlayer } = useAudio()

  if (!audioState.currentLecture && !audioState.currentSurah) return null

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const title = audioState.currentLecture?.title || audioState.currentSurah?.englishName || 'Playing'
  const subtitle = audioState.currentLecture?.speaker || audioState.currentReciter?.name || ''

  return (
    <div className="global-audio-player">
      <div className="player-content">
        {/* Now Playing Info */}
        <div className="now-playing-info">
          <div className="now-playing-icon">
            {audioState.audioType === 'quran' ? 'Q' : 'L'}
          </div>
          <div className="now-playing-text">
            <div className="now-playing-title">{title}</div>
            <div className="now-playing-subtitle">{subtitle}</div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="player-controls">
          <button
            onClick={prevTrack}
            disabled={!audioState.currentLecture && !audioState.currentSurah}
            className="control-button"
            aria-label="Previous"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            disabled={audioState.isLoading}
            className="play-button"
            aria-label={audioState.isPlaying ? 'Pause' : 'Play'}
          >
            {audioState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={nextTrack}
            disabled={!audioState.currentLecture && !audioState.currentSurah}
            className="control-button"
            aria-label="Next"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress & Volume */}
        <div className="progress-area">
          <span className="time-display">{formatTime(audioState.currentTime)}</span>
          <input
            type="range"
            min="0"
            max={audioState.duration || 100}
            value={audioState.currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="progress-slider"
            aria-label="Seek"
          />
          <span className="time-display">{formatTime(audioState.duration)}</span>

          <div className="volume-control">
            <button
              onClick={() => setMuted(!audioState.isMuted)}
              className="control-button"
              aria-label={audioState.isMuted ? 'Unmute' : 'Mute'}
            >
              {audioState.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={hideMiniPlayer}
        className="close-button"
        aria-label="Close player"
      >
        <X size={16} />
      </button>
    </div>
  )
}