'use client'

import { useState, useRef } from 'react'

interface AudioPlayerFixedProps {
  title: string
  speaker: string
  duration: string
  audioUrl: string
}

export default function AudioPlayerFixed({ title, speaker, duration, audioUrl }: AudioPlayerFixedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [playbackRate, setPlaybackRate] = useState(1)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    
    const current = audioRef.current.currentTime
    const duration = audioRef.current.duration
    
    setCurrentTime(formatTime(current))
    setProgress((current / duration) * 100)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    
    const value = parseFloat(e.target.value)
    const duration = audioRef.current.duration
    const newTime = (value / 100) * duration
    
    audioRef.current.currentTime = newTime
    setProgress(value)
    setCurrentTime(formatTime(newTime))
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % rates.length
    const newRate = rates[nextIndex]
    
    setPlaybackRate(newRate)
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate
    }
  }

  const skipForward = (seconds: number) => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime += seconds
  }

  const skipBackward = (seconds: number) => {
    if (!audioRef.current) return
    
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - seconds)
  }

  const handleDownload = () => {
    try {
      const link = document.createElement('a')
      link.href = audioUrl
      link.download = `${title}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please check console for details.')
    }
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">By {speaker}</p>
        </div>
        <div className="text-gray-400">
          {currentTime} / {duration}
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
          aria-label="Seek audio"
        />
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Skip Backward 15s */}
          <button
            onClick={() => skipBackward(15)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            aria-label="Skip backward 15 seconds"
            title="Skip backward 15s"
          >
            ⏪
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-green-600 hover:bg-green-700"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Skip Forward 15s */}
          <button
            onClick={() => skipForward(15)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            aria-label="Skip forward 15 seconds"
            title="Skip forward 15s"
          >
            ⏩
          </button>

          {/* Playback Speed */}
          <button
            onClick={changePlaybackRate}
            className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
            aria-label={`Playback speed: ${playbackRate}x`}
            title={`Speed: ${playbackRate}x`}
          >
            {playbackRate}x
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.volume = volume > 0 ? 0 : 1
                setVolume(volume > 0 ? 0 : 1)
              }
            }}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
            title={volume > 0 ? 'Mute' : 'Unmute'}
          >
            {volume > 0 ? '🔊' : '🔇'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
            aria-label="Volume control"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2"
            aria-label="Download audio"
            title="Download MP3"
          >
            <span>📥</span>
            <span>Download</span>
          </button>

          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            aria-label="Share audio"
            title="Share"
          >
            <span>↗️</span>
            <span>Share</span>
          </button>
        </div>

        <div className="text-sm text-gray-400">
          MP3 • 320kbps
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>URL: {audioUrl.split('/').pop()}</span>
          <span>Speed: {playbackRate}x</span>
        </div>
      </div>
    </div>
  )
}