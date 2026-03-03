'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

import { SessionProvider } from 'next-auth/react'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Surah type
export interface Surah {
  number: number
  arabic: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface Reciter {
  id: number
  name: string
  description: string
  folder: string
  color: string
  bgColor: string
}

export type PlaybackMode = 'normal' | 'repeat-one' | 'repeat-all' | 'shuffle' | 'sequential'

interface AudioState {
  isPlaying: boolean
  currentSurah: Surah | null
  currentReciter: Reciter | null
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  playbackMode: PlaybackMode 
  shuffledList: number[]
  playQueue: number[]
  // For tawhiid audios
  currentAudio: any | null
}

interface AudioContextType {
  audioState: AudioState
  playAudio: (surah: Surah, reciter: Reciter) => void
  playTawhiidAudio: (audio: any) => void
  pauseAudio: () => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setPlaybackRate: (rate: number) => void
  seekTo: (time: number) => void
  nextTrack: () => void
  prevTrack: () => void
  hideMiniPlayer: () => void
  setPlaybackMode: (mode: PlaybackMode) => void
  addToQueue: (surahNumber: number) => void
  clearQueue: () => void
}

const defaultState: AudioState = {
  isPlaying: false,
  currentSurah: null,
  currentReciter: null,
  currentAudio: null,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  isMuted: false,
  playbackRate: 1,
  playbackMode: 'normal',
  shuffledList: [],
  playQueue: []
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioState, setAudioState] = useState<AudioState>(defaultState)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      audioRef.current.volume = audioState.volume
      audioRef.current.muted = audioState.isMuted
      audioRef.current.playbackRate = audioState.playbackRate

      // Event listeners
      const audio = audioRef.current
      
      const handleTimeUpdate = () => {
        if (audio) {
          setAudioState(prev => ({
            ...prev,
            currentTime: audio.currentTime
          }))
        }
      }

      const handleLoadedMetadata = () => {
        if (audio) {
          setAudioState(prev => ({
            ...prev,
            duration: audio.duration
          }))
        }
      }

      const handleEnded = () => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0
        }))
      }

      const handlePlay = () => {
        setAudioState(prev => ({ ...prev, isPlaying: true }))
        setShowMiniPlayer(true)
      }

      const handlePause = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }))
      }

      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('play', handlePlay)
        audio.removeEventListener('pause', handlePause)
        audio.pause()
        audio.src = ''
      }
    }
  }, [])

  // Update audio element when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.volume
      audioRef.current.muted = audioState.isMuted
      audioRef.current.playbackRate = audioState.playbackRate
    }
  }, [audioState.volume, audioState.isMuted, audioState.playbackRate])

  // Play tawhiid audio
  const playTawhiidAudio = async (audio: any) => {
    if (!audioRef.current) return

    try {
      if (audioRef.current.src === audio.url && audioState.isPlaying) {
        // Already playing
        return
      }

      audioRef.current.src = audio.url
      
      setAudioState(prev => ({
        ...prev,
        currentAudio: audio,
        currentSurah: null,
        currentReciter: null,
        isPlaying: true,
        currentTime: 0
      }))

      audioRef.current.load()
      
      audioRef.current.oncanplay = async () => {
        try {
          await audioRef.current!.play()
          toast.success(`Now playing: ${audio.title}`)
        } catch (error) {
          console.error('Play error:', error)
          setAudioState(prev => ({ ...prev, isPlaying: false }))
        }
      }

      audioRef.current.onerror = () => {
        console.error('Audio loading error')
        setAudioState(prev => ({ ...prev, isPlaying: false }))
      }
    } catch (error) {
      console.error('Play audio error:', error)
    }
  }

  // Existing functions (simplified)
  const playAudio = async (surah: Surah, reciter: Reciter) => {
    // Your existing logic
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const togglePlay = async () => {
    if (!audioRef.current) return

    try {
      if (audioState.isPlaying) {
        pauseAudio()
      } else {
        if (audioRef.current.src) {
          await audioRef.current.play()
        }
      }
    } catch (error) {
      console.error('Toggle play error:', error)
    }
  }

  const setVolume = (volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume))
    setAudioState(prev => ({ ...prev, volume: newVolume }))
  }

  const setMuted = (muted: boolean) => {
    setAudioState(prev => ({ ...prev, isMuted: muted }))
  }

  const setPlaybackRate = (rate: number) => {
    const newRate = Math.max(0.5, Math.min(4, rate))
    setAudioState(prev => ({ ...prev, playbackRate: newRate }))
  }

  const seekTo = (time: number) => {
    if (audioRef.current && !isNaN(time)) {
      const validTime = Math.max(0, Math.min(audioState.duration || 0, time))
      audioRef.current.currentTime = validTime
      setAudioState(prev => ({ ...prev, currentTime: validTime }))
    }
  }

  const nextTrack = () => {
    // Implement next track logic
    toast.info('Next track')
  }

  const prevTrack = () => {
    // Implement previous track logic
    toast.info('Previous track')
  }

  const hideMiniPlayer = () => {
    setShowMiniPlayer(false)
    pauseAudio()
  }

  const setPlaybackMode = (mode: PlaybackMode) => {
    setAudioState(prev => ({ ...prev, playbackMode: mode }))
  }

  const addToQueue = (surahNumber: number) => {
    // Queue logic
  }

  const clearQueue = () => {
    setAudioState(prev => ({ ...prev, playQueue: [] }))
  }

  const contextValue: AudioContextType = {
    audioState,
    playAudio,
    playTawhiidAudio,
    pauseAudio,
    togglePlay,
    setVolume,
    setMuted,
    setPlaybackRate,
    seekTo,
    nextTrack,
    prevTrack,
    hideMiniPlayer,
    setPlaybackMode,
    addToQueue,
    clearQueue
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  )
}