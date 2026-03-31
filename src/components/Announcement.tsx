'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone, Calendar } from 'lucide-react'
import { getAnnouncements, type Announcement } from '@/lib/storage'

export default function Announcement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  useEffect(() => {
    const loadAnnouncements = () => {
      const loaded = getAnnouncements()
      setAnnouncements(loaded.filter(a => a.isActive))
    }
    
    loadAnnouncements()

    const stored = localStorage.getItem('dismissed_announcements')
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored))
      } catch (e) {
        console.error('Error parsing dismissed announcements:', e)
      }
    }
  }, [])

  const dismissAnnouncement = (id: string) => {
    const newDismissed = [...dismissedIds, id]
    setDismissedIds(newDismissed)
    localStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed))
  }

  const activeAnnouncements = announcements.filter(
    a => !dismissedIds.includes(a.id) && (!a.expiresAt || a.expiresAt > new Date())
  )

  if (activeAnnouncements.length === 0) return null

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500 border-amber-400 text-amber-100'
      case 'success':
        return 'bg-emerald-600 border-emerald-500 text-emerald-100'
      case 'error':
        return 'bg-red-600 border-red-500 text-red-100'
      default:
        return 'bg-blue-600 border-blue-500 text-blue-100'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '📢'
    }
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="container mx-auto max-w-2xl pointer-events-auto">
        <div className="space-y-2">
          {activeAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`relative ${getTypeStyles(announcement.type)} border rounded-xl p-4 shadow-lg animate-in slide-in-from-top-5 duration-300`}
              role="alert"
            >
              <button
                onClick={() => dismissAnnouncement(announcement.id)}
                className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
                title="Funga tangazo"
                aria-label="Funga tangazo"
              >
                <X size={16} className="text-white" aria-hidden="true" />
              </button>
              
              <div className="flex gap-3 pr-6">
                <div className="text-2xl flex-shrink-0" aria-hidden="true">
                  {getIcon(announcement.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Megaphone size={12} aria-hidden="true" />
                      Tangazo
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} aria-hidden="true" />
                      {new Date(announcement.createdAt).toLocaleDateString('sw', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}