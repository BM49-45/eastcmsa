'use client'

import { useEffect, useState } from 'react'
import { 
  Play,
  BookOpen,
  MessageCircle,
  Heart,
  Download,
  Loader2
} from 'lucide-react'
import { ActivityStats } from '@/types/activity'

export default function ActivitySummary() {
  const [stats, setStats] = useState<ActivityStats>({
    lectures: 0,
    books: 0,
    comments: 0,
    likes: 0,
    downloads: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/activity/stats')
        const data = await res.json()
        if (res.ok) {
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching activity stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center animate-pulse">
            <div className="w-5 h-5 mx-auto bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-6 w-8 mx-auto bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-3 w-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    { label: 'Masomo', value: stats.lectures, icon: Play, color: 'blue' },
    { label: 'Vitabu', value: stats.books, icon: BookOpen, color: 'green' },
    { label: 'Maoni', value: stats.comments, icon: MessageCircle, color: 'orange' },
    { label: 'Zinazopendwa', value: stats.likes, icon: Heart, color: 'red' },
    { label: 'Downloads', value: stats.downloads, icon: Download, color: 'purple' }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon
        const colorClasses = {
          blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
          green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
          orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
          red: 'bg-red-50 dark:bg-red-900/20 text-red-600',
          purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600'
        }[item.color]

        return (
          <div key={item.label} className={`${colorClasses} rounded-lg p-3 text-center`}>
            <Icon className="w-5 h-5 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {item.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{item.label}</div>
          </div>
        )
      })}
    </div>
  )
}