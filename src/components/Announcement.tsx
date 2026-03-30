'use client'

import { useState, useEffect } from 'react'
import { getAnnouncements, deleteAnnouncement, type Announcement } from '@/lib/storage'
import { X, Megaphone, Calendar } from 'lucide-react'

export default function Announcement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  useEffect(() => {
    // Load announcements
    const loadAnnouncements = () => {
      const loaded = getAnnouncements()
      setAnnouncements(loaded.filter(a => a.isActive))
    }

    loadAnnouncements()

    // Load dismissed announcements
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
        return 'bg-amber-500/20 border-amber-500/50 text-amber-200'
      case 'success':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
      case 'error':
        return 'bg-red-500/20 border-red-500/50 text-red-200'
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-200'
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
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <div className="space-y-2">
        {activeAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`relative ${getTypeStyles(announcement.type)} backdrop-blur-md border rounded-xl p-4 animate-in slide-in-from-top-5 duration-300`}
            role="alert"
          >
            <button
              onClick={() => dismissAnnouncement(announcement.id)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-lg transition"
              title="Dismiss announcement"
              aria-label="Close announcement"
            >
              <X size={16} aria-hidden="true" />
            </button>

            <div className="flex gap-3">
              <div className="text-2xl" aria-hidden="true">{getIcon(announcement.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{announcement.title}</h3>
                <p className="text-sm text-gray-200">{announcement.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs opacity-70">
                  <span className="flex items-center gap-1">
                    <Megaphone size={12} aria-hidden="true" />
                    Announcement
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} aria-hidden="true" />
                    {announcement.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}