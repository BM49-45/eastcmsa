'use client'

import { useEffect, useState } from 'react'
import { 
  Play,
  BookOpen,
  MessageCircle,
  Heart,
  Download
} from 'lucide-react'

export default function ActivitySummary() {
  const [stats, setStats] = useState({
    lectures: 0,
    books: 0,
    comments: 0,
    likes: 0,
    downloads: 0
  })

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
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
        <Play className="w-5 h-5 mx-auto text-blue-600 mb-1" />
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {stats.lectures}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Masomo</div>
      </div>
      
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
        <BookOpen className="w-5 h-5 mx-auto text-green-600 mb-1" />
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {stats.books}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Vitabu</div>
      </div>
      
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
        <MessageCircle className="w-5 h-5 mx-auto text-orange-600 mb-1" />
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {stats.comments}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Maoni</div>
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
        <Heart className="w-5 h-5 mx-auto text-red-600 mb-1" />
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {stats.likes}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Zinazopendwa</div>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
        <Download className="w-5 h-5 mx-auto text-purple-600 mb-1" />
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {stats.downloads}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Downloads</div>
      </div>
    </div>
  )
}