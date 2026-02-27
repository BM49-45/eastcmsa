'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react'
import { toast } from 'sonner'

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

export interface LectureAudio {
  type: 'lecture'
  id: string
  title: string
  speaker: string
  url: string
  downloadUrl: string
  filename: string
  size: number
  duration: string
  date: string
  category: string
  semester: string
  venue: string
  topics: string[]
  language: string
  quality: string
}

interface AudioState {
  isPlaying: boolean
  isLoading: boolean
  currentSurah: Surah | null
  currentReciter: Reciter | null
  currentLecture: LectureAudio | null
  audioType: 'quran' | 'lecture' | null
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  playbackMode: PlaybackMode
  shuffledList: number[]
  playQueue: LectureAudio[]
}

interface AudioContextType {
  audioState: AudioState
  playAudio: (surah: Surah, reciter: Reciter) => Promise<void>
  playLectureAudio: (lecture: LectureAudio) => Promise<void>
  pauseAudio: () => void
  togglePlay: () => Promise<void>
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setPlaybackRate: (rate: number) => void
  seekTo: (time: number) => void
  nextTrack: () => void
  prevTrack: () => void
  hideMiniPlayer: () => void
  setPlaybackMode: (mode: PlaybackMode) => void
  addToQueue: (lecture: LectureAudio) => void
  clearQueue: () => void
  setPlaylist: (playlist: LectureAudio[]) => void
}

const defaultState: AudioState = {
  isPlaying: false,
  isLoading: false,
  currentSurah: null,
  currentReciter: null,
  currentLecture: null,
  audioType: null,
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

// Helper function to get full URL
const getFullUrl = (url: string): string => {
  if (url.startsWith('http')) return url
  
  const baseUrl = process.env.NEXT_PUBLIC_AUDIO_BASE_URL
  if (!baseUrl) {
    console.error('❌ NEXT_PUBLIC_AUDIO_BASE_URL haipo!')
    return url
  }
  
  // Remove leading slash if present
  const cleanPath = url.startsWith('/') ? url.substring(1) : url
  const fullUrl = `${baseUrl}/${cleanPath}`
  console.log('🔍 URL constructed:', { original: url, full: fullUrl })
  return fullUrl
}

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [audioState, setAudioState] = useState<AudioState>(defaultState)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
      audioRef.current.volume = audioState.volume
      audioRef.current.muted = audioState.isMuted
      audioRef.current.playbackRate = audioState.playbackRate
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, []) // Empty dependency array - run once

  // Update audio element properties when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.volume
      audioRef.current.muted = audioState.isMuted
      audioRef.current.playbackRate = audioState.playbackRate
    }
  }, [audioState.volume, audioState.isMuted, audioState.playbackRate])

  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }))
    }

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false
      }))
    }

    const handleEnded = () => {
      if (audioState.playbackMode === 'repeat-one') {
        audio.currentTime = 0
        audio.play().catch(console.error)
      } else if (audioState.playQueue.length > 0) {
        const nextLecture = audioState.playQueue[0]
        const newQueue = audioState.playQueue.slice(1)
        setAudioState(prev => ({ ...prev, playQueue: newQueue }))
        
        if (nextLecture) {
          const fullUrl = getFullUrl(nextLecture.url)
          audio.src = fullUrl
          audio.load()
          audio.play().catch(console.error)
          
          setAudioState(prev => ({
            ...prev,
            currentLecture: nextLecture,
            audioType: 'lecture',
            isPlaying: true,
            currentTime: 0
          }))
        }
      } else {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0
        }))
      }
    }

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, isLoading: false }))
    }

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isLoading: false }))
    }

    const handleWaiting = () => {
      setAudioState(prev => ({ ...prev, isLoading: true }))
    }

    const handleError = (e: ErrorEvent) => {
      console.error('❌ Audio error:', {
        message: e.message,
        error: e.error,
        src: audio.src,
        currentSrc: audio.currentSrc
      })
      
      if (audio.error) {
        console.error('🎵 Audio element error:', {
          code: audio.error.code,
          message: audio.error.message,
          src: audio.src
        })
        
        // Check if it's a 404 error (network error)
        if (audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
          toast.error('Faili la audio halipatikani (404). Angalia URL.')
          console.error('❌ URL isiyofanya kazi:', audio.src)
          console.error('🔧 BASE_URL =', process.env.NEXT_PUBLIC_AUDIO_BASE_URL)
        } else if (audio.error.code === MediaError.MEDIA_ERR_NETWORK) {
          toast.error('Hitilafu ya mtandao. Angalia connection yako.')
        } else {
          toast.error('Hitilafu ya kucheza audio')
        }
      }
      
      setAudioState(prev => ({ ...prev, isLoading: false, isPlaying: false }))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('error', handleError)
    }
  }, [audioState.playbackMode, audioState.playQueue]) // Remove audioState.currentLecture from dependencies

  // Play Quran audio
  const playAudio = useCallback(async (surah: Surah, reciter: Reciter) => {
    if (!audioRef.current) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_AUDIO_BASE_URL
      if (!baseUrl) {
        toast.error('Audio URL haijasanidiwa')
        return
      }
      
      const audioUrl = `${baseUrl}/${reciter.folder}/${surah.number.toString().padStart(3, '0')}.mp3`
      console.log('🎵 Playing Quran:', audioUrl)
      
      audioRef.current.src = audioUrl
      
      setAudioState(prev => ({
        ...prev,
        currentSurah: surah,
        currentReciter: reciter,
        currentLecture: null,
        audioType: 'quran',
        isLoading: true,
        isPlaying: false,
        currentTime: 0
      }))

      audioRef.current.load()
      await audioRef.current.play()
      toast.success(`Inacheza: ${surah.englishName}`)
    } catch (error) {
      console.error('Play error:', error)
      toast.error('Hitilafu ya kucheza audio')
      setAudioState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Play lecture audio
  const playLectureAudio = useCallback(async (lecture: LectureAudio) => {
    if (!audioRef.current) return

    try {
      // Check if same lecture is playing
      if (audioState.currentLecture?.id === lecture.id && audioState.audioType === 'lecture') {
        if (audioState.isPlaying) {
          audioRef.current.pause()
          setAudioState(prev => ({ ...prev, isPlaying: false }))
        } else {
          await audioRef.current.play()
          setAudioState(prev => ({ ...prev, isPlaying: true }))
        }
        return
      }

      // New lecture
      setAudioState(prev => ({
        ...prev,
        isLoading: true,
        isPlaying: false
      }))

      const fullUrl = getFullUrl(lecture.url)
      console.log('🎵 Playing lecture:', fullUrl)
      
      audioRef.current.src = fullUrl
      audioRef.current.load()
      
      await audioRef.current.play()
      
      setAudioState(prev => ({
        ...prev,
        currentLecture: lecture,
        currentSurah: null,
        currentReciter: null,
        audioType: 'lecture',
        isLoading: false,
        isPlaying: true,
        currentTime: 0
      }))
      
      toast.success(`Inacheza: ${lecture.title}`)
    } catch (error) {
      console.error('Play error:', error)
      setAudioState(prev => ({ ...prev, isLoading: false, isPlaying: false }))
      toast.error('Hitilafu ya kucheza audio')
    }
  }, [audioState.currentLecture, audioState.audioType, audioState.isPlaying])

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return

    try {
      if (audioState.isPlaying) {
        audioRef.current.pause()
      } else {
        if (audioRef.current.src) {
          await audioRef.current.play()
        }
      }
    } catch (error) {
      console.error('Toggle play error:', error)
    }
  }, [audioState.isPlaying])

  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume))
    setAudioState(prev => ({ ...prev, volume: newVolume }))
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    setAudioState(prev => ({ ...prev, isMuted: muted }))
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    const newRate = Math.max(0.5, Math.min(4, rate))
    setAudioState(prev => ({ ...prev, playbackRate: newRate }))
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && !isNaN(time)) {
      const validTime = Math.max(0, Math.min(audioState.duration || 0, time))
      audioRef.current.currentTime = validTime
      setAudioState(prev => ({ ...prev, currentTime: validTime }))
    }
  }, [audioState.duration])

  const nextTrack = useCallback(() => {
    if (audioState.playQueue.length > 0) {
      const nextLecture = audioState.playQueue[0]
      const newQueue = audioState.playQueue.slice(1)
      setAudioState(prev => ({ ...prev, playQueue: newQueue }))
      
      if (nextLecture && audioRef.current) {
        const fullUrl = getFullUrl(nextLecture.url)
        audioRef.current.src = fullUrl
        audioRef.current.load()
        audioRef.current.play().catch(console.error)
        
        setAudioState(prev => ({
          ...prev,
          currentLecture: nextLecture,
          audioType: 'lecture',
          isPlaying: true,
          currentTime: 0
        }))
      }
    }
  }, [audioState.playQueue])

  const prevTrack = useCallback(() => {
    if (audioState.currentTime > 3) {
      seekTo(0)
    }
  }, [audioState.currentTime, seekTo])

  const hideMiniPlayer = useCallback(() => {
    pauseAudio()
  }, [pauseAudio])

  const setPlaybackMode = useCallback((mode: PlaybackMode) => {
    setAudioState(prev => ({ ...prev, playbackMode: mode }))
  }, [])

  const addToQueue = useCallback((lecture: LectureAudio) => {
    setAudioState(prev => ({
      ...prev,
      playQueue: [...prev.playQueue, lecture]
    }))
    toast.info('Imeongezwa kwenye foleni')
  }, [])

  const clearQueue = useCallback(() => {
    setAudioState(prev => ({ ...prev, playQueue: [] }))
  }, [])

  const setPlaylist = useCallback((playlist: LectureAudio[]) => {
    setAudioState(prev => ({
      ...prev,
      playQueue: playlist
    }))
  }, [])

  const contextValue: AudioContextType = {
    audioState,
    playAudio,
    playLectureAudio,
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
    clearQueue,
    setPlaylist
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  )
}