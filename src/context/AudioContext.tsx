'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react'

// ==================== INTERFACES ====================

export interface Surah {
  number: number
  arabic: string
  englishName: string
  englishNameTranslation: string
  revelationType: 'Meccan' | 'Medinan'
  numberOfAyahs: number
}

export interface Reciter {
  id: number
  name: string
  folder: string
  bgColor?: string
  color?: string
  description?: string
}

export interface TawhiidAudio {
  id?: string
  title: string
  speaker?: string
  url: string
  downloadUrl?: string
  filename?: string
  size?: number
  duration?: string | number
  date?: string
  category?: string
  type?: 'tawhiid'
}

export interface LectureAudio {
  id?: string
  title: string
  speaker?: string
  url: string
  downloadUrl?: string
  filename?: string
  size?: number
  duration?: string | number
  date?: string
  category?: string
  type?: 'lecture'
  semester?: string
  venue?: string
  topics?: string[]
  language?: string
  quality?: string
}

export interface QuranAudio {
  type: 'quran'
  surah: Surah
  reciter: Reciter
  title: string
  speaker: string
}

type AudioItem = QuranAudio | TawhiidAudio | LectureAudio

interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  currentAudio: TawhiidAudio | null
  currentLecture: LectureAudio | null
  currentSurah: Surah | null
  currentReciter: Reciter | null
  playlist: (TawhiidAudio | LectureAudio)[]
  currentIndex: number
  audioType: 'quran' | 'tawhiid' | 'lecture' | null
  isLoading: boolean
  error: string | null
}

interface AudioContextType {
  audioState: AudioState
  
  // Play functions
  playAudio: (surah: Surah, reciter: Reciter) => Promise<void>
  playQuranAudio: (surah: Surah, reciter: Reciter) => Promise<void>
  playTawhiidAudio: (audio: TawhiidAudio) => Promise<void>
  playLectureAudio: (lecture: LectureAudio) => Promise<void>
  
  // Control functions
  pauseAudio: () => void
  togglePlay: () => Promise<void>
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setPlaybackRate: (rate: number) => void
  seekTo: (time: number) => void
  nextTrack: () => Promise<void>
  prevTrack: () => Promise<void>
  
  // Playlist functions
  setPlaylist: (playlist: (TawhiidAudio | LectureAudio)[]) => void
  addToPlaylist: (audio: TawhiidAudio | LectureAudio) => void
  removeFromPlaylist: (index: number) => void
  clearPlaylist: () => void
  
  // Utility functions
  isGlobalAudioPlaying: () => boolean
  clearAudio: () => void
  getCurrentPlaying: () => TawhiidAudio | LectureAudio | QuranAudio | null
  getCurrentType: () => 'quran' | 'tawhiid' | 'lecture' | null
  
  // Error handling
  clearError: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// ==================== PROVIDER ====================

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    playbackRate: 1,
    currentAudio: null,
    currentLecture: null,
    currentSurah: null,
    currentReciter: null,
    playlist: [],
    currentIndex: -1,
    audioType: null,
    isLoading: false,
    error: null
  })

  // ==================== INITIALIZATION ====================
  
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = audioState.volume
    audio.playbackRate = audioState.playbackRate
    
    // Set crossOrigin for CORS if needed
    audio.crossOrigin = 'anonymous'
    
    audioRef.current = audio
    
    // Event Handlers
    const handleTimeUpdate = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || prev.duration
      }))
    }
    const handlePlay = () => {
      console.log('🎵 AudioContext: play event')
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        isLoading: false,
        error: null
      }))
    }
    const handlePause = () => {
      console.log('🎵 AudioContext: pause event')
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false
      }))
    }
    const handleLoadedMetadata = () => {
      console.log('🎵 AudioContext: metadata loaded')
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false
      }))
    }
    const handleEnded = () => {
      console.log('🎵 AudioContext: ended event')
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false
      }))
      
      // Auto-play next track if in playlist
      if (audioState.playlist.length > 0) {
        const nextIndex = audioState.currentIndex + 1
        if (nextIndex < audioState.playlist.length) {
          const nextAudio = audioState.playlist[nextIndex]
          if (nextAudio.type === 'lecture') {
            playLectureAudio(nextAudio as LectureAudio)
          } else if (nextAudio.type === 'tawhiid') {
            playTawhiidAudio(nextAudio as TawhiidAudio)
          }
        }
      }
    }
    const handleError = (e: Event) => {
      console.error('🎵 AudioContext: audio error:', e)
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: 'Audio load error. Check file path and CORS.'
      }))
    }
    const handleStalled = () => {
      console.log('🎵 AudioContext: stalled - buffering')
      setAudioState(prev => ({ ...prev, isLoading: true }))
    }
    const handleCanPlay = () => {
      console.log('🎵 AudioContext: can play')
      setAudioState(prev => ({ ...prev, isLoading: false }))
    }

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('stalled', handleStalled)
    audio.addEventListener('canplay', handleCanPlay)

    // Cleanup
    return () => {
      console.log('🎵 AudioContext: Cleaning up')
      
      // Abort any ongoing fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // Remove event listeners
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('stalled', handleStalled)
      audio.removeEventListener('canplay', handleCanPlay)
      
      // Clean up audio
      audio.pause()
      audio.src = ''
      audio.load()
    }
  }, [])

  // ==================== UTILITY FUNCTIONS ====================
  
  const setLoading = (loading: boolean) => {
    setAudioState(prev => ({ ...prev, isLoading: loading }))
  }

  const setError = (error: string | null) => {
    setAudioState(prev => ({ ...prev, error }))
  }

  // ==================== PLAY FUNCTIONS ====================
  
  // Play Quran Audio
  const playQuranAudio = useCallback(async (surah: Surah, reciter: Reciter) => {
    console.log('🎵 AudioContext: playQuranAudio called', surah.englishName, reciter.name)
    
    if (!audioRef.current) {
      setError('Audio player not initialized')
      return
    }
    
    const audioElement = audioRef.current
    const paddedNum = surah.number.toString().padStart(3, '0')
    
    const audioUrl = `/audio/${reciter.folder}/${paddedNum}.mp3`
    
    console.log('🎵 Audio URL:', audioUrl)
    
    try {
      setLoading(true)
      setError(null)
      
      // Check if same audio is playing
      const isSameAudio = audioState.currentSurah?.number === surah.number &&
                         audioState.currentReciter?.id === reciter.id
      
      if (isSameAudio && audioElement.src && !audioElement.paused) {
        console.log('🎵 Same Quran audio already playing, pausing')
        audioElement.pause()
        setLoading(false)
        return
      }

      if (isSameAudio && audioElement.src && audioElement.paused) {
        console.log('🎵 Same Quran audio paused, resuming')
        await audioElement.play()
        return
      }

      // Check if audio file exists
      try {
        const controller = new AbortController()
        abortControllerRef.current = controller
        
        const response = await fetch(audioUrl, {
          method: 'HEAD',
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error(`Audio file not found: ${audioUrl}`)
        }
      } catch (fetchError) {
        console.error('🎵 Audio file check failed:', fetchError)
        setError(`Audio haipatikani: Surah ${surah.number} - ${reciter.name}`)
        setLoading(false)
        return
      }

      // Load new audio
      console.log('🎵 Setting audio src:', audioUrl)
      audioElement.src = audioUrl
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        if (audioElement.readyState >= 3) {
          resolve()
        } else {
          const handleCanPlayThrough = () => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            resolve()
          }
          
          const handleLoadError = (e: Event) => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            reject(new Error('Audio load failed'))
          }
          
          audioElement.addEventListener('canplaythrough', handleCanPlayThrough)
          audioElement.addEventListener('error', handleLoadError)
          
          // Timeout after 10 seconds
          setTimeout(() => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            resolve()
          }, 10000)
        }
      })

      // Update state
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        currentSurah: surah,
        currentReciter: reciter,
        currentAudio: null,
        currentLecture: null,
        currentTime: 0,
        audioType: 'quran',
        error: null
      }))
      
      console.log('🎵 Playing Quran audio...')
      await audioElement.play()
      console.log('🎵 Quran audio playing successfully')
      
    } catch (error) {
      console.error('🎵 Failed to play Quran audio:', error)
      setError(error instanceof Error ? error.message : 'Unknown error playing audio')
      
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentSurah: null,
        currentReciter: null,
        audioType: null,
        isLoading: false
      }))
    } finally {
      setLoading(false)
    }
  }, [audioState.currentSurah?.number, audioState.currentReciter?.id])

  // Alias: playAudio = playQuranAudio
  const playAudio = playQuranAudio

  // Play Tawhiid Audio
  const playTawhiidAudio = useCallback(async (audio: TawhiidAudio) => {
    console.log('🎵 AudioContext: playTawhiidAudio called', audio.title)
    
    if (!audioRef.current) {
      setError('Audio player not initialized')
      return
    }
    
    const audioElement = audioRef.current
    
    try {
      setLoading(true)
      setError(null)
      
      // Check if same audio is playing - FIXED: Use filename comparison
      const isSameAudio = audioState.currentAudio?.filename === audio.filename ||
                         audioState.currentAudio?.url === audio.url
      
      if (isSameAudio && audioElement.src && !audioElement.paused) {
        console.log('🎵 Same Tawhiid audio already playing, pausing')
        audioElement.pause()
        setLoading(false)
        return
      }

      if (isSameAudio && audioElement.src && audioElement.paused) {
        console.log('🎵 Same Tawhiid audio paused, resuming')
        await audioElement.play()
        return
      }

      // Check if audio file exists
      try {
        const controller = new AbortController()
        abortControllerRef.current = controller
        
        const response = await fetch(audio.url, {
          method: 'HEAD',
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error(`Audio file not found: ${audio.url}`)
        }
      } catch (fetchError) {
        console.error('🎵 Audio file check failed:', fetchError)
        setError(`Audio haipatikani: ${audio.title}`)
        setLoading(false)
        return
      }

      // Load new audio
      audioElement.src = audio.url
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        if (audioElement.readyState >= 3) {
          resolve()
        } else {
          const handleCanPlayThrough = () => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            resolve()
          }
          
          const handleLoadError = (e: Event) => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            reject(new Error('Audio load failed'))
          }
          
          audioElement.addEventListener('canplaythrough', handleCanPlayThrough)
          audioElement.addEventListener('error', handleLoadError)
          
          setTimeout(() => {
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            resolve()
          }, 10000)
        }
      })

      // Find index in playlist
      const index = audioState.playlist.findIndex(item =>
        item.filename === audio.filename || item.url === audio.url
      )

      // Update state
      setAudioState(prev => ({
        ...prev,
        currentAudio: { ...audio, type: 'tawhiid' },
        currentLecture: null,
        currentSurah: null,
        currentReciter: null,
        currentIndex: index >= 0 ? index : prev.currentIndex,
        isPlaying: true,
        currentTime: 0,
        audioType: 'tawhiid',
        error: null
      }))
      
      console.log('🎵 Playing Tawhiid audio...')
      await audioElement.play()
      console.log('🎵 Tawhiid audio playing successfully')
      
    } catch (error) {
      console.error('🎵 Failed to play Tawhiid audio:', error)
      setError(error instanceof Error ? error.message : 'Unknown error playing audio')
      
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentAudio: null,
        audioType: null,
        isLoading: false
      }))
    } finally {
      setLoading(false)
    }
  }, [audioState.currentAudio, audioState.playlist, audioState.audioType])

  // Play Lecture Audio - FIXED VERSION
  const playLectureAudio = useCallback(async (lecture: LectureAudio) => {
    console.log('🎵 AudioContext: playLectureAudio called', lecture.title, 'filename:', lecture.filename)
    
    if (!audioRef.current) {
      setError('Audio player not initialized')
      return
    }
    
    const audioElement = audioRef.current
    
    try {
      setLoading(true)
      setError(null)
      
      // FIXED: Check if same audio is playing using filename or URL
      const isSameAudio = (audioState.currentLecture?.filename === lecture.filename) ||
                         (audioState.currentLecture?.url === lecture.url)
      
      console.log('🎵 isSameAudio check:', {
        currentFilename: audioState.currentLecture?.filename,
        newFilename: lecture.filename,
        currentUrl: audioState.currentLecture?.url,
        newUrl: lecture.url,
        isSameAudio
      })
      
      if (isSameAudio && audioElement.src && !audioElement.paused) {
        console.log('🎵 Same Lecture audio already playing, pausing')
        audioElement.pause()
        setLoading(false)
        return
      }

      if (isSameAudio && audioElement.src && audioElement.paused) {
        console.log('🎵 Same Lecture audio paused, resuming')
        await audioElement.play()
        return
      }

      // Check if audio file exists
      try {
        const controller = new AbortController()
        abortControllerRef.current = controller
        
        const response = await fetch(lecture.url, {
          method: 'HEAD',
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error(`Audio file not found: ${lecture.url}`)
        }
        
        console.log('🎵 Audio file exists:', lecture.url)
      } catch (fetchError) {
        console.error('🎵 Audio file check failed:', fetchError)
        setError(`Audio haipatikani: ${lecture.title}`)
        setLoading(false)
        return
      }

      // FIXED: Reset audio element properly before loading new source
      console.log('🎵 Loading new audio source:', lecture.url)
      
      // Pause current audio first
      if (!audioElement.paused) {
        audioElement.pause()
      }
      
      // Clear current source
      audioElement.src = ''
      
      // Set new source
      audioElement.src = lecture.url
      
      // Load the new audio
      audioElement.load()
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        if (audioElement.readyState >= 3) {
          console.log('🎵 Audio already ready, state:', audioElement.readyState)
          resolve()
        } else {
          const handleCanPlayThrough = () => {
            console.log('🎵 canplaythrough event fired')
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            resolve()
          }
          
          const handleLoadError = (e: Event) => {
            console.error('🎵 Audio load error:', e)
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            reject(new Error('Audio load failed'))
          }
          
          audioElement.addEventListener('canplaythrough', handleCanPlayThrough)
          audioElement.addEventListener('error', handleLoadError)
          
          setTimeout(() => {
            console.log('🎵 Audio load timeout')
            audioElement.removeEventListener('canplaythrough', handleCanPlayThrough)
            audioElement.removeEventListener('error', handleLoadError)
            resolve() // Try to play anyway
          }, 10000)
        }
      })

      // Find index in playlist
      const index = audioState.playlist.findIndex(item =>
        item.filename === lecture.filename || item.url === lecture.url
      )

      // Update state
      setAudioState(prev => ({
        ...prev,
        currentLecture: { ...lecture, type: 'lecture' },
        currentAudio: null,
        currentSurah: null,
        currentReciter: null,
        currentIndex: index >= 0 ? index : prev.currentIndex,
        isPlaying: true,
        currentTime: 0,
        audioType: 'lecture',
        error: null
      }))
      
      console.log('🎵 Playing Lecture audio...')
      await audioElement.play()
      console.log('🎵 Lecture audio playing successfully')
      
    } catch (error) {
      console.error('🎵 Failed to play Lecture audio:', error)
      setError(error instanceof Error ? error.message : 'Unknown error playing audio')
      
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentLecture: null,
        audioType: null,
        isLoading: false
      }))
    } finally {
      setLoading(false)
    }
  }, [audioState.currentLecture, audioState.playlist, audioState.audioType])

  // ==================== CONTROL FUNCTIONS ====================
  
  const pauseAudio = useCallback(() => {
    console.log('🎵 AudioContext: pauseAudio called')
    
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setAudioState(prev => ({ ...prev, isPlaying: false }))
    }
  }, [])

  const togglePlay = useCallback(async () => {
    console.log('🎵 AudioContext: togglePlay called')
    
    if (!audioRef.current) {
      setError('Audio player not initialized')
      return
    }
    
    const audioElement = audioRef.current
    
    try {
      setLoading(true)
      
      if (audioElement.paused) {
        console.log('🎵 togglePlay: audio is paused, attempting to play')
        
        // Check if we have a valid source
        if (!audioElement.src) {
          console.log('🎵 togglePlay: no audio source')
          setError('Hakuna audio iliyochaguliwa')
          setLoading(false)
          return
        }
        
        await audioElement.play()
        console.log('🎵 togglePlay: play successful')
      } else {
        console.log('🎵 togglePlay: audio is playing, pausing')
        audioElement.pause()
      }
      
    } catch (error) {
      console.error('🎵 togglePlay: error:', error)
      setError(error instanceof Error ? error.message : 'Failed to toggle play')
      
      // If play fails, try to reload the audio
      if (audioElement.src) {
        console.log('🎵 togglePlay: attempting to reload audio')
        const currentSrc = audioElement.src
        audioElement.src = currentSrc
        audioElement.load()
        
        try {
          await audioElement.play()
        } catch (retryError) {
          console.error('🎵 togglePlay: retry also failed:', retryError)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      const newVolume = Math.max(0, Math.min(1, volume))
      audioRef.current.volume = newVolume
      setAudioState(prev => ({
        ...prev,
        volume: newVolume,
        isMuted: newVolume === 0 ? true : prev.isMuted
      }))
    }
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = muted
      setAudioState(prev => ({ ...prev, isMuted: muted }))
    }
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      const newRate = Math.max(0.5, Math.min(4, rate))
      audioRef.current.playbackRate = newRate
      setAudioState(prev => ({ ...prev, playbackRate: newRate }))
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && !isNaN(time)) {
      const validTime = Math.max(0, Math.min(time, audioState.duration || time))
      audioRef.current.currentTime = validTime
      setAudioState(prev => ({ ...prev, currentTime: validTime }))
    }
  }, [audioState.duration])

  const nextTrack = useCallback(async () => {
    console.log('🎵 AudioContext: nextTrack called')
    
    if (audioState.playlist.length === 0) {
      console.log('🎵 nextTrack: playlist is empty')
      return
    }
    
    let nextIndex = audioState.currentIndex + 1
    if (nextIndex >= audioState.playlist.length) {
      nextIndex = 0
    }
    
    const nextAudio = audioState.playlist[nextIndex]
    console.log('🎵 nextTrack: playing index', nextIndex, nextAudio)
    
    if (nextAudio) {
      if (nextAudio.type === 'lecture') {
        await playLectureAudio(nextAudio as LectureAudio)
      } else {
        await playTawhiidAudio(nextAudio as TawhiidAudio)
      }
    }
  }, [audioState.playlist, audioState.currentIndex, playTawhiidAudio, playLectureAudio])

  const prevTrack = useCallback(async () => {
    console.log('🎵 AudioContext: prevTrack called')
    
    if (audioState.playlist.length === 0) {
      console.log('🎵 prevTrack: playlist is empty')
      return
    }
    
    let prevIndex = audioState.currentIndex - 1
    if (prevIndex < 0) {
      prevIndex = audioState.playlist.length - 1
    }
    
    const prevAudio = audioState.playlist[prevIndex]
    console.log('🎵 prevTrack: playing index', prevIndex, prevAudio)
    
    if (prevAudio) {
      if (prevAudio.type === 'lecture') {
        await playLectureAudio(prevAudio as LectureAudio)
      } else {
        await playTawhiidAudio(prevAudio as TawhiidAudio)
      }
    }
  }, [audioState.playlist, audioState.currentIndex, playTawhiidAudio, playLectureAudio])

  // ==================== PLAYLIST FUNCTIONS ====================
  
  const setPlaylist = useCallback((playlist: (TawhiidAudio | LectureAudio)[]) => {
    console.log('🎵 AudioContext: Setting playlist with', playlist.length, 'items')
    setAudioState(prev => ({ ...prev, playlist }))
  }, [])

  const addToPlaylist = useCallback((audio: TawhiidAudio | LectureAudio) => {
    console.log('🎵 AudioContext: Adding to playlist:', audio.title)
    setAudioState(prev => ({
      ...prev,
      playlist: [...prev.playlist, audio]
    }))
  }, [])

  const removeFromPlaylist = useCallback((index: number) => {
    console.log('🎵 AudioContext: Removing from playlist at index:', index)
    setAudioState(prev => {
      const newPlaylist = [...prev.playlist]
      newPlaylist.splice(index, 1)
      
      // Adjust current index if needed
      let newIndex = prev.currentIndex
      if (index < prev.currentIndex) {
        newIndex = prev.currentIndex - 1
      } else if (index === prev.currentIndex) {
        newIndex = -1
      }
      
      return {
        ...prev,
        playlist: newPlaylist,
        currentIndex: newIndex
      }
    })
  }, [])

  const clearPlaylist = useCallback(() => {
    console.log('🎵 AudioContext: Clearing playlist')
    setAudioState(prev => ({
      ...prev,
      playlist: [],
      currentIndex: -1
    }))
  }, [])

  // ==================== UTILITY FUNCTIONS ====================
  
  const isGlobalAudioPlaying = useCallback(() => {
    return audioState.isPlaying
  }, [audioState.isPlaying])

  const clearAudio = useCallback(() => {
    console.log('🎵 AudioContext: Clearing audio')
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current.currentTime = 0
    }
    
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      currentAudio: null,
      currentLecture: null,
      currentSurah: null,
      currentReciter: null,
      currentIndex: -1,
      audioType: null,
      isLoading: false,
      error: null
    }))
  }, [])

  const getCurrentPlaying = useCallback(() => {
    if (audioState.currentSurah && audioState.currentReciter) {
      return {
        type: 'quran' as const,
        surah: audioState.currentSurah,
        reciter: audioState.currentReciter,
        title: audioState.currentSurah.englishName,
        speaker: audioState.currentReciter.name
      }
    } else if (audioState.currentLecture) {
      return audioState.currentLecture
    } else if (audioState.currentAudio) {
      return audioState.currentAudio
    }
    return null
  }, [audioState.currentAudio, audioState.currentLecture, audioState.currentSurah, audioState.currentReciter])

  const getCurrentType = useCallback(() => {
    return audioState.audioType
  }, [audioState.audioType])

  const clearError = useCallback(() => {
    setAudioState(prev => ({ ...prev, error: null }))
  }, [])

  // ==================== UPDATE AUDIO PROPERTIES ====================
  
  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current
    
    audio.volume = audioState.isMuted ? 0 : audioState.volume
    audio.playbackRate = audioState.playbackRate
    audio.muted = audioState.isMuted
  }, [audioState.volume, audioState.playbackRate, audioState.isMuted])

  // ==================== CONTEXT VALUE ====================
  
  const value: AudioContextType = {
    audioState,
    
    // Play functions
    playAudio,
    playQuranAudio,
    playTawhiidAudio,
    playLectureAudio,
    
    // Control functions
    pauseAudio,
    togglePlay,
    setVolume,
    setMuted,
    setPlaybackRate,
    seekTo,
    nextTrack,
    prevTrack,
    
    // Playlist functions
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    
    // Utility functions
    isGlobalAudioPlaying,
    clearAudio,
    getCurrentPlaying,
    getCurrentType,
    
    // Error handling
    clearError
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

// ==================== HOOK ====================

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}