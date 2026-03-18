'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Clock, Play, BookOpen, MessageCircle, Heart, Download, User, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Activity {
  _id: string
  type: 'lecture_watch' | 'book_read' | 'comment' | 'like' | 'download'
  itemTitle?: string
  itemId?: string
  category?: string
  createdAt: string
}

export default function ActivityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/user/activity?limit=50')
        if (res.ok) {
          const data = await res.json()
          setActivities(data.activities || [])
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchActivities()
    }
  }, [session])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lecture_watch': return <Play className="w-5 h-5 text-blue-500" />
      case 'book_read': return <BookOpen className="w-5 h-5 text-green-500" />
      case 'comment': return <MessageCircle className="w-5 h-5 text-orange-500" />
      case 'like': return <Heart className="w-5 h-5 text-red-500" />
      case 'download': return <Download className="w-5 h-5 text-purple-500" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'lecture_watch': return `Umesikiliza: ${activity.itemTitle || 'Somo'}`
      case 'book_read': return `Umesoma: ${activity.itemTitle || 'Kitabu'}`
      case 'comment': return `Umetoa maoni kwenye: ${activity.itemTitle || 'kipengele'}`
      case 'like': return `Umeipenda: ${activity.itemTitle || 'kipengele'}`
      case 'download': return `Umedownload: ${activity.itemTitle || 'faili'}`
      default: return 'Shughuli'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Inapakia shughuli zako...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shughuli Zako</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Historia ya shughuli zako kwenye tovuti</p>

        {activities.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hakuna shughuli bado</h2>
            <p className="text-gray-600 dark:text-gray-400">Shughuli zako zitaonekana hapa utakapoanza kutumia tovuti.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {getActivityText(activity)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(activity.createdAt).toLocaleDateString('sw-TZ')}
                      </span>
                      {activity.category && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                          {activity.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}