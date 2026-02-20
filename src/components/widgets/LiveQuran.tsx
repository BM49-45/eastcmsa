'use client'

import { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react'
import { surahs, Surah as LocalSurah } from '@/components/widgets/surahs'
import { motion } from 'framer-motion'
import { useAudio } from '@/context/AudioContext'
import type { Surah as AudioSurah, Reciter as AudioReciter } from '@/context/AudioContext'
import './LiveQuran.css'

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Download,
  Share2,
  BookOpen,
  Clock,
  RotateCcw,
  User,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Headphones
} from 'lucide-react'

// workaround for framer-motion typing issues
const MDiv: any = motion.div

/* =======================
   RECITERS WITH THEIR OWN FOLDERS
======================= */

const reciters = [
  {
    id: 1,
    name: 'Mishary Alafasy',
    description: 'Murattal - Mp3Quran',
    folder: 'quran',
    color: 'from-emerald-900/40 to-emerald-700/50',
    bgColor: '#064e3b'
  },
  {
    id: 2,
    name: 'Maher Al-Muaiqly',
    description: 'Haramain Style',
    folder: 'quran1',
    color: 'from-blue-900/40 to-blue-700/50',
    bgColor: '#1e40af'
  },
  {
    id: 3,
    name: 'Abu Bakr Al-Shatiri',
    description: 'Beautiful Tajweed',
    folder: 'quran2',
    color: 'from-purple-900/40 to-purple-700/50',
    bgColor: '#5b21b6'
  }
]

/* =======================
   IMPORTANT QURAN VERSES WITH TRANSLATIONS
======================= */

const quranQuotes = [
  {
    arabic: "وَٱعۡبُدُواْ ٱللَّهَ وَلَا تُشۡرِكُواْ بِهِۦ شَيۡـٔٗاۖ وَبِٱلۡوَٰلِدَيۡنِ إِحۡسَٰنٗا",
    translation: "Na muabuduni Mwenyezi Mungu, wala msimshirikishe na chochote. Na wafanyie wema wazazi wawili",
    reference: "An-Nisa' 4:36",
    teaching: "Tawheed na birrul walidain (kumtii Allah na kuwatendea wazazi wema)"
  },
  {
    arabic: "إِنَّمَا ٱلۡمُؤۡمِنُونَ إِخۡوَةٞ فَأَصۡلِحُواْ بَيۡنَ أَخَوَيۡكُمۡۚ",
    translation: "Hakika Waumini ni ndugu, basi patanisheni baina ya ndugu zenu",
    reference: "Al-Hujurat 49:10",
    teaching: "Umoja na upatanishi kati ya Waumini"
  },
  {
    arabic: "وَٱلۡعَصۡرِ إِنَّ ٱلۡإِنسَٰنَ لَفِي خُسۡرٍ إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ",
    translation: "Naapa kwa wakati! Hakika mwanadamu yumo katika hasara. Isipokuwa wale walioamini na wakatenda vitendo vyema",
    reference: "Al-Asr 103:1-3",
    teaching: "Thamani ya wakati na umuhimu wa Imani na Amali Salih"
  },
  {
    arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ ٱسۡتَعِينُواْ بِٱلصَّبۡرِ وَٱلصَّلَوٰةِۚ",
    translation: "Enyi mlioamini! Takeni msaada kwa kuvumilia na Sala",
    reference: "Al-Baqarah 2:153",
    teaching: "Uthubutu na Saburi pamoja na Sala"
  },
  {
    arabic: "قُلۡ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ",
    translation: "Sema: Yeye Mwenyezi Mungu ni Mmoja. Mwenyezi Mungu Mkusudiwa",
    reference: "Al-Ikhlas 112:1-2",
    teaching: "Umoja wa Mwenyezi Mungu na Sifa Zake"
  },
  {
    arabic: "وَتَعَاوَنُواْ عَلَى ٱلۡبِرِّ وَٱلتَّقۡوَىٰۖ وَلَا تَعَاوَنُواْ عَلَى ٱلۡإِثۡمِ وَٱلۡعُدۡوَٰنِۚ",
    translation: "Na saidianieni katika kufanya wema na kumcha Mungu. Wala msisadiane katika dhambi na uadui",
    reference: "Al-Ma'idah 5:2",
    teaching: "Usaidiano katika wema na kuepuka ushirikiano katika maovu"
  },
  {
    arabic: "يَٰٓأَيُّهَا ٱلنَّاسُ إِنَّا خَلَقۡنَٰكُم مِّن ذَكَرٖ وَأُنثَىٰ وَجَعَلۡنَٰكُمۡ شُعُوبٗا وَقَبَآئِلَ لِتَعَارَفُوٓاْۚ",
    translation: "Enyi watu! Hakika Sisi tumekuumbeni kutoka kwa mwanamume na mwanamke. Na tumekufanyeni mataifa na makabila ili mjue",
    reference: "Al-Hujurat 49:13",
    teaching: "Usawa wa binadamu na umuhimu wa kutambuana"
  },
  {
    arabic: "إِنَّ ٱللَّهَ يَأۡمُرُ بِٱلۡعَدۡلِ وَٱلۡإِحۡسَٰنِ",
    translation: "Hakika Mwenyezi Mungu anauamuru uadilifu na wema",
    reference: "An-Nahl 16:90",
    teaching: "Amri ya Mwenyezi Mungu kuhusu uadilifu na fadhila"
  },
  {
    arabic: "رَبَّنَآ ءَاتِنَا فِي ٱلدُّنۡيَا حَسَنَةٗ وَفِي ٱلۡأٓخِرَةِ حَسَنَةٗ وَقِنَا عَذَابَ ٱلنَّارِ",
    translation: "Mola wetu! Tupatie wema katika ulimwengu na wema katika Akhera, na utulinde na adhabu ya Moto",
    reference: "Al-Baqarah 2:201",
    teaching: "Dua ya kusaliwa wema wa dunia na Akhera"
  },
  {
    arabic: "وَٱذۡكُر رَّبَّكَ فِي نَفۡسِكَ تَضَرُّعٗا وَخِيفَةٗ",
    translation: "Na mkumbuke Mola wako katika nafsi yako kwa unyenyekevu na khofu",
    reference: "Al-A'raf 7:205",
    teaching: "Umuhimu wa kumdhikiri Mwenyezi Mungu kwa unyenyekevu"
  }
]

const animationPatterns = [
  {
    color: 'from-emerald-900/40 to-emerald-700/50',
    image: '/image/Quran.jpg',
    verse: quranQuotes[0].arabic,
    translation: quranQuotes[0].translation,
    reference: quranQuotes[0].reference,
    teaching: quranQuotes[0].teaching,
    bgColor: '#064e3b'
  },
  {
    color: 'from-green-900/40 to-green-700/50',
    image: '/image/Quran1.jpg',
    verse: quranQuotes[1].arabic,
    translation: quranQuotes[1].translation,
    reference: quranQuotes[1].reference,
    teaching: quranQuotes[1].teaching,
    bgColor: '#166534'
  },
  {
    color: 'from-teal-900/40 to-teal-700/50',
    image: '/image/Quran2.jpg',
    verse: quranQuotes[2].arabic,
    translation: quranQuotes[2].translation,
    reference: quranQuotes[2].reference,
    teaching: quranQuotes[2].teaching,
    bgColor: '#115e59'
  },
  {
    color: 'from-cyan-900/40 to-cyan-700/50',
    image: '/image/Quran3.jpg',
    verse: quranQuotes[3].arabic,
    translation: quranQuotes[3].translation,
    reference: quranQuotes[3].reference,
    teaching: quranQuotes[3].teaching,
    bgColor: '#155e75'
  },
  {
    color: 'from-blue-900/40 to-blue-700/50',
    image: '/image/Quran4.jpg',
    verse: quranQuotes[4].arabic,
    translation: quranQuotes[4].translation,
    reference: quranQuotes[4].reference,
    teaching: quranQuotes[4].teaching,
    bgColor: '#1e40af'
  },
  {
    color: 'from-purple-900/40 to-purple-700/50',
    image: '/image/Quran.jpg',
    verse: quranQuotes[5].arabic,
    translation: quranQuotes[5].translation,
    reference: quranQuotes[5].reference,
    teaching: quranQuotes[5].teaching,
    bgColor: '#5b21b6'
  },
  {
    color: 'from-pink-900/40 to-pink-700/50',
    image: '/image/Quran1.jpg',
    verse: quranQuotes[6].arabic,
    translation: quranQuotes[6].translation,
    reference: quranQuotes[6].reference,
    teaching: quranQuotes[6].teaching,
    bgColor: '#9d174d'
  },
  {
    color: 'from-orange-900/40 to-orange-700/50',
    image: '/image/Quran2.jpg',
    verse: quranQuotes[7].arabic,
    translation: quranQuotes[7].translation,
    reference: quranQuotes[7].reference,
    teaching: quranQuotes[7].teaching,
    bgColor: '#9a3412'
  },
  {
    color: 'from-yellow-900/40 to-yellow-700/50',
    image: '/image/Quran3.jpg',
    verse: quranQuotes[8].arabic,
    translation: quranQuotes[8].translation,
    reference: quranQuotes[8].reference,
    teaching: quranQuotes[8].teaching,
    bgColor: '#854d0e'
  },
  {
    color: 'from-red-900/40 to-red-700/50',
    image: '/image/Quran4.jpg',
    verse: quranQuotes[9].arabic,
    translation: quranQuotes[9].translation,
    reference: quranQuotes[9].reference,
    teaching: quranQuotes[9].teaching,
    bgColor: '#991b1b'
  }
]

const pad = (n: number) => n.toString().padStart(3, '0')

/* =======================
   COMPONENT - MEMOIZED FOR PERFORMANCE
======================= */

const LiveQuran = memo(function LiveQuran() {
  // Use global audio context
  const {
    audioState,
    playAudio,
    pauseAudio,
    togglePlay,
    setVolume,
    setMuted,
    setPlaybackRate,
    seekTo,
    isGlobalAudioPlaying
  } = useAudio()

  // Local state for UI
  const [reciter, setReciter] = useState<AudioReciter | typeof reciters[0]>(reciters[0])
  const [surah, setSurah] = useState<AudioSurah | LocalSurah>(surahs[0])
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [showReciters, setShowReciters] = useState(false)
  const [liked, setLiked] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Refs for elements where styles are updated dynamically
  const containerRef = useRef<HTMLDivElement | null>(null)
  const ayahProgressRef = useRef<HTMLDivElement | null>(null)
  const progressFillRef = useRef<HTMLDivElement | null>(null)
  const progressKnobRef = useRef<HTMLDivElement | null>(null)
  const progressTrackRef = useRef<HTMLDivElement | null>(null)
  const volumeSliderRef = useRef<HTMLInputElement | null>(null)
  
  // Animation refs to prevent re-renders - FIXED: Added null initial value
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Optimized animation rotation - doesn't cause re-renders of parent
  useEffect(() => {
    animationIntervalRef.current = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animationPatterns.length)
    }, 6000)

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, []) // Empty dependency array - runs once

  // Update background color
  useEffect(() => {
    if (containerRef.current) {
      const bgColor = reciter?.bgColor || animationPatterns[currentAnimation].bgColor
      containerRef.current.style.background = `linear-gradient(135deg, ${bgColor} 0%, #0f172a 100%)`
    }
  }, [reciter, currentAnimation])

  // Update ayah progress
  useEffect(() => {
    if (ayahProgressRef.current && surah.numberOfAyahs) {
      const currentAyah = (audioState.duration && surah.numberOfAyahs)
        ? Math.max(1, Math.round((audioState.currentTime / audioState.duration) * surah.numberOfAyahs))
        : 1
      const width = (currentAyah / surah.numberOfAyahs) * 100
      ayahProgressRef.current.style.width = `${width}%`
    }
  }, [audioState.currentTime, audioState.duration, surah.numberOfAyahs])

  // Optimized progress updates using requestAnimationFrame
  useEffect(() => {
    let rafId: number
    
    const updateProgress = () => {
      const pct = (audioState.currentTime / (audioState.duration || 1)) * 100
      
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${pct}%`
      }
      
      if (progressKnobRef.current && progressTrackRef.current) {
        const trackWidth = progressTrackRef.current.offsetWidth
        const knobWidth = progressKnobRef.current.offsetWidth
        let leftPosition = (pct / 100) * trackWidth
        
        // Ensure knob stays within track
        if (leftPosition < knobWidth / 2) {
          leftPosition = knobWidth / 2
        } else if (leftPosition > trackWidth - knobWidth / 2) {
          leftPosition = trackWidth - knobWidth / 2
        }
        
        progressKnobRef.current.style.left = `${leftPosition}px`
      }
      
      rafId = requestAnimationFrame(updateProgress)
    }
    
    rafId = requestAnimationFrame(updateProgress)
    
    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [audioState.currentTime, audioState.duration])

  // Update volume slider background
  useEffect(() => {
    if (volumeSliderRef.current) {
      const volPct = Math.round(audioState.volume * 100)
      volumeSliderRef.current.style.background = `linear-gradient(to right, ${audioState.volume >= 0.01 ? '#10b981' : '#ffffff20'} ${volPct}%, #ffffff20 ${volPct}%)`
    }
  }, [audioState.volume, audioState.isMuted])

  // Sync with global audio state
  useEffect(() => {
    if (audioState.currentSurah) {
      setSurah(audioState.currentSurah)
    }
    if (audioState.currentReciter) {
      setReciter(audioState.currentReciter)
    }
  }, [audioState.currentSurah, audioState.currentReciter])

  // Get audio URL
  const getAudioUrl = useCallback((surahNumber: number): string => {
    const paddedNum = pad(surahNumber)
    return `/audio/${reciter.folder}/${paddedNum}.mp3`
  }, [reciter.folder])

  // Check if audio file exists
  const checkAudioAvailability = useCallback(async (surahNumber: number) => {
    const audioUrl = getAudioUrl(surahNumber)
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' })
      setAudioAvailable(response.ok)
      return response.ok
    } catch (error) {
      setAudioAvailable(false)
      return false
    }
  }, [getAudioUrl])

  // Handle play/pause
  const handleTogglePlay = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const isAvailable = await checkAudioAvailability(surah.number)
      if (!isAvailable) {
        alert(`Audio ya Surah ${surah.number} haipatikani kwa ${reciter.name}`)
        setIsLoading(false)
        return
      }

      const isSameAudio = audioState.currentSurah?.number === surah.number &&
                         audioState.currentReciter?.id === reciter.id

      if (isSameAudio) {
        await togglePlay()
      } else {
        if (audioState.isPlaying) {
          pauseAudio()
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        await playAudio(surah, reciter)
      }
    } catch (error) {
      console.error('🎵 LiveQuran: Error in handleTogglePlay:', error)
      alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, checkAudioAvailability, surah, reciter, audioState, togglePlay, pauseAudio, playAudio])

  // Next Surah
  const nextSurah = useCallback(async () => {
    if (surah.number < 114) {
      const nextSurahObj = surahs.find(s => s.number === surah.number + 1)
      if (nextSurahObj) {
        setSurah(nextSurahObj)

        const isAvailable = await checkAudioAvailability(nextSurahObj.number)
        if (!isAvailable) {
          alert(`Audio ya Surah ${nextSurahObj.number} haipatikani kwa ${reciter.name}`)
          return
        }

        try {
          await playAudio(nextSurahObj, reciter)
        } catch (error) {
          console.error('🎵 LiveQuran: Error playing next surah:', error)
          alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
        }
      }
    }
  }, [surah.number, reciter, checkAudioAvailability, playAudio])

  // Previous Surah
  const prevSurah = useCallback(async () => {
    if (surah.number > 1) {
      const prevSurahObj = surahs.find(s => s.number === surah.number - 1)
      if (prevSurahObj) {
        setSurah(prevSurahObj)

        const isAvailable = await checkAudioAvailability(prevSurahObj.number)
        if (!isAvailable) {
          alert(`Audio ya Surah ${prevSurahObj.number} haipatikani kwa ${reciter.name}`)
          return
        }

        try {
          await playAudio(prevSurahObj, reciter)
        } catch (error) {
          console.error('🎵 LiveQuran: Error playing previous surah:', error)
          alert('Kuna tatizo la kusikiliza audio. Tafadhali jaribu tena.')
        }
      }
    }
  }, [surah.number, reciter, checkAudioAvailability, playAudio])

  // Handle seek
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    seekTo(time)
  }, [seekTo])

  // Format time
  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Memoized formatted times
  const formattedCurrentTime = useMemo(() => formatTime(audioState.currentTime), [audioState.currentTime, formatTime])
  const formattedDuration = useMemo(() => formatTime(audioState.duration), [audioState.duration, formatTime])

  // Handle download
  const handleDownload = useCallback(async () => {
    const audioUrl = getAudioUrl(surah.number)

    const isAvailable = await checkAudioAvailability(surah.number)
    if (!isAvailable) {
      alert(`Faili ya kupakua haipatikani. Angalia: ${audioUrl}`)
      return
    }

    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `surah-${surah.number}-${surah.englishName}-${reciter.name.replace(/\s+/g, '-')}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [surah, reciter, getAudioUrl, checkAudioAvailability])

  // Get volume color
  const getVolumeColor = useCallback(() => {
    const volume = audioState.volume
    if (volume === 0 || audioState.isMuted) return 'text-gray-400'
    if (volume < 0.3) return 'text-green-400'
    if (volume < 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }, [audioState.volume, audioState.isMuted])

  // Get volume icon
  const getVolumeIcon = useCallback(() => {
    const volume = audioState.volume
    if (audioState.isMuted || volume === 0) return <VolumeX size={20} />
    if (volume < 0.3) return <Volume1 size={20} />
    return <Volume2 size={20} />
  }, [audioState.volume, audioState.isMuted])

  // Handle reciter change
  const handleReciterChange = useCallback(async (newReciter: typeof reciters[0]) => {
    setReciter(newReciter)
    setShowReciters(false)

    const isAvailable = await checkAudioAvailability(surah.number)

    if (audioState.isPlaying && audioState.currentSurah?.number === surah.number) {
      if (isAvailable) {
        try {
          await playAudio(surah, newReciter)
        } catch (error) {
          console.error('🎵 LiveQuran: Error changing reciter:', error)
          pauseAudio()
        }
      } else {
        pauseAudio()
      }
    }
  }, [surah, audioState, checkAudioAvailability, playAudio, pauseAudio])

  // Calculate current ayah
  const currentAyah = useMemo(() => {
    if (!audioState.duration || !surah.numberOfAyahs) return 1
    const progress = audioState.currentTime / audioState.duration
    return Math.max(1, Math.round(progress * surah.numberOfAyahs))
  }, [audioState.currentTime, audioState.duration, surah.numberOfAyahs])

  // Check if this surah is currently playing
  const isThisSurahPlaying = useMemo(() => {
    return audioState.isPlaying &&
           audioState.currentSurah?.number === surah.number &&
           audioState.currentReciter?.id === reciter.id
  }, [audioState.isPlaying, audioState.currentSurah, audioState.currentReciter, surah.number, reciter.id])

  // Memoized volume values
  const volumeColor = useMemo(() => getVolumeColor(), [getVolumeColor])
  const volumeIcon = useMemo(() => getVolumeIcon(), [getVolumeIcon])

  return (
    <div
      ref={containerRef}
      className="live-quran-container"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        {/* HEADER WITH GLOBAL PLAYING INDICATOR */}
        <div className="text-center mb-4">
          {isGlobalAudioPlaying() && audioState.currentReciter?.id !== reciter.id && (
            <div className="mb-2 p-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
                <Headphones size={14} />
                <span>Now playing: {audioState.currentSurah?.englishName} - {audioState.currentReciter?.name}</span>
              </div>
            </div>
          )}

          {/* QURAN QUOTES ANIMATION SECTION - SMOOTH TRANSITION */}
          <div className="quran-animation-section">
            <img
              src={animationPatterns[currentAnimation].image}
              alt="Quran background"
              className="transition-opacity duration-700"
            />
            <div className="overlay"></div>
            <div className="content">
              <div className="arabic-text-main">
                {animationPatterns[currentAnimation].verse}
              </div>
              
              <div className="verse-translation">
                "{animationPatterns[currentAnimation].translation}"
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
                <div className="text-sm text-emerald-300 bg-emerald-900/30 px-3 py-1 rounded-full">
                  {animationPatterns[currentAnimation].reference}
                </div>
                <div className="text-xs text-amber-200 bg-amber-900/30 px-3 py-1 rounded-full">
                  {animationPatterns[currentAnimation].teaching}
                </div>
              </div>
              
              <div className="text-xs text-white/60 mt-3">
                Quote {currentAnimation + 1} of {animationPatterns.length}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2 mb-1">
            <BookOpen size={20} className="text-green-300" />
            <span>Qur'an Recitation</span>
            {isThisSurahPlaying && (
              <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full live-indicator">
                ● LIVE
              </span>
            )}
          </h2>

          <div className="text-xs text-white/70 flex items-center justify-center gap-1">
            {audioAvailable ? (
              <>
                <CheckCircle size={12} className="text-green-400" />
                <span>Audio Available</span>
              </>
            ) : (
              <>
                <AlertTriangle size={12} className="text-yellow-400" />
                <span>Check Audio Files</span>
              </>
            )}
          </div>
        </div>

        {/* NOW PLAYING CARD */}
        <div className="now-playing-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="text-center md:text-left">
              <div className="arabic-surah-name">
                {surah.arabic}
              </div>
              <div className="text-white font-medium text-lg">{surah.englishName}</div>
              <div className="text-sm text-green-300">{surah.englishNameTranslation}</div>
              <div className="text-xs text-white/60 mt-1">
                {surah.revelationType} • {surah.numberOfAyahs} verses
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-xs text-white/70 mb-1">Reciter</div>
              <div className="flex items-center justify-center md:justify-end gap-2">
                <User size={14} className="text-green-400" />
                <span className="text-green-300 font-medium">{reciter.name}</span>
              </div>
            </div>
          </div>

          {/* AYAH PROGRESS */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex justify-between items-center">
              <div className="text-xs text-white/70">Ayah Progress</div>
              <div className="text-sm text-white font-medium">
                Ayah {currentAyah} of {surah.numberOfAyahs}
              </div>
            </div>
            <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={ayahProgressRef}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>

        {/* TIME PROGRESS - FIXED KNOB POSITIONING */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>{formattedCurrentTime}</span>
            <div className="flex items-center gap-2">
              <span>{formattedDuration}</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded">Total</span>
            </div>
          </div>

          <div className="relative h-6 flex items-center">
            <div 
              ref={progressTrackRef}
              className="relative w-full h-2"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-white/20 rounded-full"></div>
              <div
                ref={progressFillRef}
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-300"
              ></div>
              <div
              ref={progressKnobRef}
              className="progress-knob"
              aria-hidden="true"
              ></div>

              <input
                type="range"
                min="0"
                max={audioState.duration || 100}
                value={audioState.currentTime}
                onChange={handleSeek}
                className="progress-range"
                aria-label="Audio progress"
                title="Seek audio"
              />
            </div>
          </div>

          <div className="mt-2 text-center">
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full">
              <span className="text-xs text-white/70">
                Surah {surah.number} • {formattedCurrentTime} / {formattedDuration}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTROLS */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={prevSurah}
            className="control-button"
            disabled={surah.number <= 1 || isLoading}
            title="Previous Surah"
            aria-label="Previous surah"
          >
            <SkipBack size={22} />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className={`play-button ${isThisSurahPlaying && audioState.isPlaying ? 'playing' : 'paused'} ${!audioAvailable || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!audioAvailable || isLoading}
            title={!audioAvailable ? `Audio not available for ${reciter.name}` : isThisSurahPlaying && audioState.isPlaying ? "Pause" : "Play"}
            aria-label={isThisSurahPlaying && audioState.isPlaying ? "Pause audio" : "Play audio"}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
            ) : isThisSurahPlaying && audioState.isPlaying ? (
              <Pause size={26} />
            ) : (
              <Play size={26} />
            )}
          </button>

          <button
            type="button"
            onClick={nextSurah}
            className="control-button"
            disabled={surah.number >= 114 || isLoading}
            title="Next Surah"
            aria-label="Next surah"
          >
            <SkipForward size={22} />
          </button>
        </div>

        {/* RECITER SELECTOR */}
        <div className="mb-4 relative">
          <button
            type="button"
            onClick={() => setShowReciters(!showReciters)}
            className="reciter-selector"
            aria-haspopup="listbox"
            aria-controls="reciter-list"
            disabled={isLoading}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${(reciter.color ?? reciters[0].color).split(' ')[0].replace('from-', 'bg-')}`}></div>
              <div className="text-left">
                <div className="text-sm font-medium">{reciter.name}</div>
                <div className="text-xs text-white/70">Folder: {reciter.folder}</div>
              </div>
            </div>
            <ChevronDown size={18} className={`transition-transform ${showReciters ? 'rotate-180' : ''}`} />
          </button>

          {showReciters && (
            <div className="reciter-dropdown">
              {reciters.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleReciterChange(r)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-white/10 ${reciter.id === r.id ? 'bg-green-900/30' : ''}`}
                  aria-label={`Select ${r.name}`}
                >
                  <div className={`w-2 h-2 rounded-full ${r.color.split(' ')[0].replace('from-', 'bg-')}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{r.name}</div>
                    <div className="text-xs text-white/70">{r.folder} • {r.description}</div>
                  </div>
                  {reciter.id === r.id && (
                    <div className="w-2 h-2 bg-green-400 rounded-full live-indicator"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SURAH SELECTOR */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Select Surah (1-114)
          </label>
          <select
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
            value={surah.number}
            onChange={async (e) => {
              const selected = surahs.find(s => s.number === Number(e.target.value))
              if (selected) {
                setSurah(selected)
                await checkAudioAvailability(selected.number)
              }
            }}
            aria-label="Select surah"
            disabled={isLoading}
          >
            {surahs.map(s => (
              <option key={s.number} value={s.number} className="bg-gray-900">
                {s.number.toString().padStart(3, '0')}. {surah.number === s.number && isThisSurahPlaying ? '▶ ' : ''}{s.englishName} ({s.arabic})
              </option>
            ))}
          </select>
        </div>

        {/* VOLUME CONTROL */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMuted(!audioState.isMuted)}
                className={`p-1.5 rounded-lg transition-colors ${audioState.isMuted ? 'bg-red-900/30 text-red-300' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                title={audioState.isMuted ? "Unmute" : "Mute"}
                aria-label={audioState.isMuted ? "Unmute audio" : "Mute audio"}
                disabled={isLoading}
              >
                {volumeIcon}
              </button>
              <span className="text-sm text-white/80">Volume</span>
            </div>

            <div className="flex items-center gap-2">
              {audioState.volume > 0.8 && (
                <AlertTriangle size={14} className="text-red-400 animate-pulse" aria-label="High volume may damage hearing" />
              )}
              <span className={`text-sm font-medium ${volumeColor}`}>
                {audioState.isMuted ? 'Muted' : `${Math.round(audioState.volume * 100)}%`}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className={`flex-1 ${audioState.volume >= 0.01 ? 'bg-green-500' : 'bg-white/10'}`}></div>
              <div className={`flex-1 ${audioState.volume >= 0.3 ? 'bg-yellow-500' : 'bg-white/10'}`}></div>
              <div className={`flex-1 ${audioState.volume >= 0.7 ? 'bg-orange-500' : 'bg-white/10'}`}></div>
              <div className={`flex-1 ${audioState.volume >= 0.9 ? 'bg-red-500' : 'bg-white/10'}`}></div>
            </div>

            <input
              ref={volumeSliderRef}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={audioState.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
              aria-label="Volume control"
              title="Adjust volume"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* SECONDARY CONTROLS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              const speeds = [0.75, 1, 1.25, 1.5, 2]
              const currentIndex = speeds.indexOf(audioState.playbackRate)
              const nextIndex = (currentIndex + 1) % speeds.length
              setPlaybackRate(speeds[nextIndex])
            }}
            className="control-button flex items-center justify-center gap-2"
            title="Playback Speed"
            aria-label="Change playback speed"
            disabled={isLoading}
          >
            <Clock size={18} className="text-blue-400" />
            <div className="text-left">
              <div className="text-xs text-white/70">Speed</div>
              <div className="text-sm font-medium">{audioState.playbackRate}x</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => seekTo(0)}
            className="control-button flex items-center justify-center gap-2"
            title="Restart Surah"
            aria-label="Restart surah"
            disabled={isLoading}
          >
            <RotateCcw size={18} className="text-green-400" />
            <div className="text-left">
              <div className="text-xs text-white/70">Restart</div>
              <div className="text-sm font-medium">From Start</div>
            </div>
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className={`control-button ${liked ? 'bg-gradient-to-r from-red-900/40 to-pink-900/40 text-red-300 border border-red-700/30' : ''}`}
              title={liked ? "Unlike" : "Like this recitation"}
              aria-label={liked ? "Unlike audio" : "Like audio"}
              disabled={isLoading}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className={`control-button ${!audioAvailable ? 'bg-red-900/30 hover:bg-red-900/40 cursor-not-allowed' : ''}`}
              title={audioAvailable ? "Download MP3" : "Audio not available for download"}
              disabled={!audioAvailable || isLoading}
              aria-label="Download audio"
            >
              <Download size={20} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Surah ${surah.englishName} - ${reciter.name}`,
                    text: `Listening to Surah ${surah.englishName} (${surah.arabic}) from ${reciter.name}`,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }
              }}
              className="control-button"
              title="Share"
              aria-label="Share audio"
              disabled={isLoading}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

LiveQuran.displayName = 'LiveQuran'

export default LiveQuran