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
  Headphones,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { useAudio } from '@/context/AudioContext'

export default function TawhiidPage() {
  const [audios, setAudios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { audioState, playTawhiidAudio, togglePlay, setVolume, setMuted, seekTo, nextTrack, prevTrack, setPlaylist } = useAudio()

  useEffect(() => {
    loadAudios()
  }, [])

  // Update playlist when audios change
  useEffect(() => {
    if (audios.length > 0) {
      setPlaylist(audios)
    }
  }, [audios, setPlaylist])

  const loadAudios = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/audio?category=tawhiid')
      const data = await response.json()
      
      if (data.success && data.data?.tawhiid) {
        const tawhiidAudios = Array.isArray(data.data.tawhiid) 
          ? data.data.tawhiid 
          : data.data.categories?.tawhiid?.files || []
        
        setAudios(tawhiidAudios)
      } else {
        setError('Hakuna data ya audio iliyopatikana')
      }
    } catch (error: any) {
      console.error('❌ Hitilafu:', error)
      setError(`Hitilafu ya muunganisho: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return audioState.duration 
      ? (audioState.currentTime / audioState.duration) * 100 
      : 0
  }, [audioState.currentTime, audioState.duration])

  // Calculate volume percentage
  const volumePercentage = useMemo(() => {
    return audioState.volume * 100
  }, [audioState.volume])

  // Sync dynamic widths to CSS variables so we avoid inline style props
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--tawhiid-progress', `${progressPercentage}%`)
      document.documentElement.style.setProperty('--tawhiid-volume', `${volumePercentage}%`)
    }
  }, [progressPercentage, volumePercentage])

  // Filter audios
  const filteredAudios = audios.filter(audio => 
    audio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (audio.speaker || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 p-8 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
          <Headphones className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-400" size={24} />
        </div>
        <p className="mt-6 text-lg text-gray-300 font-medium">Inapakia Darsa za Tawhiid...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 p-8">
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 shadow-2xl">
            <AlertCircle className="text-red-400 mb-6 mx-auto" size={56} />
            <h2 className="text-2xl font-bold text-white text-center mb-3">Hitilafu ya Kupakia Audio</h2>
            <p className="text-gray-300 text-center mb-6">{error}</p>
            
            <button
              type="button"
              onClick={loadAudios}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw size={20} className="mr-3" />
              Jaribu Tena
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/10 to-cyan-900/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 font-medium">Darsa za Tawhiid</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
              Darsa za Itikadi
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Mfululizo kamili wa darsa za Itikadi, Sheikh Abuu Mus'ab At Tanzaniy
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tafuta darsa au mada..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  🔍
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-emerald-400">{audios.length}</div>
                <div className="text-sm text-gray-400">Jumla ya Darsa</div>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-cyan-400">
                  {formatSize(audios.reduce((sum, audio) => sum + (audio.size || 0), 0))}
                </div>
                <div className="text-sm text-gray-400">Ukubwa Wa Jumla</div>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-teal-400">
                  {audios.filter(a => a.duration).length}
                </div>
                <div className="text-sm text-gray-400">Zina Muda</div>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="text-2xl font-bold text-violet-400">18+</div>
                <div className="text-sm text-gray-400">Sehemu za Mfululizo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredAudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudios.map((audio, index) => (
              <div
                key={audio.id || index}
                className={`group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                  audioState.currentAudio?.url === audio.url
                  ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/20'
                  : 'border-gray-700/50 hover:border-emerald-400/50'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        audioState.currentAudio?.url === audio.url
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30'
                        : 'bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-emerald-900/30 group-hover:to-teal-900/30'
                      }`}>
                        {audioState.currentAudio?.url === audio.url && audioState.isPlaying ? (
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-white rounded-full audio-pulse audio-pulse-delay-0"></div>
                            <div className="w-1 h-3 bg-white rounded-full audio-pulse audio-pulse-delay-1"></div>
                            <div className="w-1 h-3 bg-white rounded-full audio-pulse audio-pulse-delay-2"></div>
                          </div>
                        ) : (
                          <span className={`font-bold text-lg ${
                            audioState.currentAudio?.url === audio.url ? 'text-white' : 'text-gray-400 group-hover:text-emerald-300'
                          }`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      
                      {audio.duration && (
                        <div className="px-3 py-1.5 bg-gray-800/60 rounded-full text-xs flex items-center gap-2">
                          <Clock size={12} className="text-emerald-400" />
                          <span className="text-gray-300">{typeof audio.duration === 'number' ? formatTime(audio.duration) : audio.duration}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = audio.downloadUrl || audio.url
                          link.download = audio.filename || audio.title.replace(/\s+/g, '-') + '.mp3'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                        className="p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/60 rounded-xl transition-all duration-300"
                        title="Pakua"
                        aria-label={`Pakua ${audio.title}`}
                      >
                        <Download size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: audio.title,
                              text: `Sikiliza "${audio.title}" kutoka kwa ${audio.speaker}`,
                              url: window.location.origin + audio.url,
                            })
                          } else {
                            navigator.clipboard.writeText(window.location.origin + audio.url)
                            alert('Kiungo kimenakiliwa kwenye clipboard!')
                          }
                        }}
                        className="p-2.5 text-gray-400 hover:text-cyan-400 hover:bg-gray-800/60 rounded-xl transition-all duration-300"
                        title="Shiriki"
                        aria-label={`Shiriki ${audio.title}`}
                      >
                        <Share2 size={18} />
                      </button>
                      <a
                        href={audio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-gray-400 hover:text-teal-400 hover:bg-gray-800/60 rounded-xl transition-all duration-300"
                        title="Fungua kwenye tab mpya"
                        aria-label="Fungua kwenye tab mpya"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-100">{audio.title}</h3>
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm flex items-center gap-3">
                        <User size={14} className="text-emerald-400" />
                        <span>{audio.speaker || "Sheikh Abuu Mus'ab At Tanzaniy"}</span>
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-3">
                        <Calendar size={14} className="text-cyan-400" />
                        <span>{audio.date || 'Tarehe haijulikani'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Info Bars */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Ukubwa:</span>
                      <span className="font-medium text-gray-300">{formatSize(audio.size || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Aina:</span>
                      <span className="font-medium text-gray-300 flex items-center gap-2">
                        <FileAudio size={12} />
                        MP3 • 320kbps
                      </span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={() => playTawhiidAudio(audio)}
                    className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center transition-all duration-300 group/btn ${
                      audioState.currentAudio?.url === audio.url && audioState.isPlaying
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:text-white hover:from-emerald-700/30 hover:to-teal-800/30 hover:shadow-lg hover:shadow-emerald-500/20 border border-gray-700 group-hover:border-emerald-500/30'
                    }`}
                    aria-label={`Sikiliza ${audio.title}`}
                  >
                    {audioState.currentAudio?.url === audio.url && audioState.isPlaying ? (
                      <>
                        <Pause size={20} className="mr-3" />
                        <span>Inasikilizwa</span>
                      </>
                    ) : (
                      <>
                        <Play size={20} className="mr-3" />
                        <span>Sikiliza Sasa</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Headphones className="mx-auto text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-300">Hakuna Darsa Zilizopatikana</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Hakuna darsa zilizo na "' + searchTerm + '"' : 'Hakuna darsa katika kategoria ya tawhiid bado'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Audio Controls */}
      {audioState.currentAudio && (
        <div className="fixed bottom-24 right-6 z-40">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  title={audioState.isPlaying ? "Simamisha" : "Sikiliza"}
                  aria-label={audioState.isPlaying ? "Simamisha" : "Sikiliza"}
                >
                  {audioState.isPlaying ? (
                    <Pause size={20} className="text-white" />
                  ) : (
                    <Play size={20} className="text-white ml-0.5" />
                  )}
                </button>
                <div className="max-w-[180px]">
                  <p className="font-medium truncate text-sm text-white">{audioState.currentAudio.title}</p>
                  <p className="text-xs text-gray-400 truncate">{audioState.currentAudio.speaker}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={prevTrack}
                  className="p-2 hover:bg-gray-700/50 rounded-xl"
                  title="Darsa iliyopita"
                  aria-label="Darsa iliyopita"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextTrack}
                  className="p-2 hover:bg-gray-700/50 rounded-xl"
                  title="Darsa inayofuata"
                  aria-label="Darsa inayofuata"
                >
                  <SkipForward size={16} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{formatTime(audioState.currentTime)}</span>
                <span>{formatTime(audioState.duration)}</span>
              </div>
              <div className="relative h-1.5">
                <div className="absolute inset-0 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 progress-fill"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={audioState.duration || 100}
                  value={audioState.currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Endelea mbele au nyuma"
                />
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMuted(!audioState.isMuted)}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg"
                title={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
                aria-label={audioState.isMuted ? "Washa sauti" : "Zima sauti"}
              >
                {audioState.isMuted ? (
                  <VolumeX size={16} className="text-gray-400" />
                ) : (
                  <Volume2 size={16} className="text-gray-400" />
                )}
              </button>
              <div className="flex-1 relative h-1.5">
                <div className="absolute inset-0 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 volume-fill"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioState.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Badilisha ukubwa wa sauti"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for audio bars animation */}
      <style jsx global>{`
        @keyframes audio-pulse {
          0%, 100% { height: 0.25rem; }
          50% { height: 1rem; }
        }
        .audio-pulse { animation: audio-pulse 0.8s infinite; }
        .audio-pulse-delay-0 { animation-delay: 0s; }
        .audio-pulse-delay-1 { animation-delay: 0.2s; }
        .audio-pulse-delay-2 { animation-delay: 0.4s; }

        /* progress & volume fills use CSS variables updated from JS */
        .progress-fill { width: var(--tawhiid-progress, 0%); }
        .volume-fill { width: var(--tawhiid-volume, 100%); }
      `}</style>
    </div>
  )
}