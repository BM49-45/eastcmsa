"use client"

import { useState } from "react"

// Define types
interface AudioCardProps {
  audio: {
    id: string
    title: string
    speaker: string
    duration: string
    size: string
    downloads: number
    url: string
    category?: string
    categoryName?: string
    createdAt: string
    [key: string]: any
  }
  showCategory?: boolean
  isFavorite?: boolean
  onFavoriteToggle?: (id: string, audio: any) => void
  onPlay?: (audio: any) => void
}

export default function AudioCard({ 
  audio, 
  showCategory = false, 
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
  onPlay 
}: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isLoading, setIsLoading] = useState(false)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    if (onPlay) onPlay(audio)
  }

  const handleFavorite = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioId: audio.id,
          audioData: {
            title: audio.title,
            speaker: audio.speaker,
            category: audio.category || audio.categoryName,
            duration: audio.duration,
            url: audio.url
          }
        })
      })

      if (res.ok) {
        const data = await res.json()
        setIsFavorite(data.action === "added")
        if (onFavoriteToggle) {
          onFavoriteToggle(audio.id, data.action === "added")
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        {/* Waveform or cover art placeholder */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50" stroke="white" fill="none" strokeWidth="2"/>
            <path d="M0,60 Q25,40 50,60 T100,60" stroke="white" fill="none" strokeWidth="2"/>
            <path d="M0,40 Q25,60 50,40 T100,40" stroke="white" fill="none" strokeWidth="2"/>
          </svg>
        </div>
        
        {/* Play button */}
        <button 
          onClick={handlePlay}
          className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Category badge */}
        {showCategory && audio.categoryName && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {audio.categoryName}
          </span>
        )}

        {/* Duration badge */}
        <span className="absolute bottom-4 right-4 z-10 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white">
          {audio.duration}
        </span>

        {/* Favorite button */}
        <button 
          onClick={handleFavorite}
          disabled={isLoading}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/50 text-white hover:bg-rose-500'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" title={audio.title}>
          {audio.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Speaker:</span> {audio.speaker}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Downloads">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {audio.downloads || 0}
            </span>
            <span className="flex items-center gap-1" title="File size">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {audio.size || '0 MB'}
            </span>
          </div>
          <span title="Date added">{new Date(audio.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Download button */}
        <a 
          href={audio.url}
          download
          className="mt-4 w-full py-2 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 group/btn"
          aria-label={`Download ${audio.title}`}
          title="Download audio"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>
    </div>
  )
}