'use client'

import { useState, useEffect } from 'react'
import { 
  Clock,
  Play,
  Download,
  BookOpen,
  MessageCircle,
  Heart,
  Share2,
  UserPlus,
  LogIn,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale' // Using English locale as fallback

// Import types
import { Activity, ActivityType, ActivityFeedResponse } from '@/types/activity'

// Define filter options
const filterOptions = [
  { value: 'all', label: 'Zote' },
  { value: 'lecture_watch', label: 'Masomo' },
  { value: 'comment', label: 'Maoni' },
  { value: 'like', label: 'Zinazopendwa' },
  { value: 'downloads', label: 'Downloads' }
] as const

type FilterValue = typeof filterOptions[number]['value']

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState<FilterValue>('all')

  const fetchActivities = async () => {
    setLoading(true)
    try {
      // Build type parameter based on filter
      let typeParam = ''
      if (filter === 'downloads') {
        typeParam = 'lecture_download,book_download'
      } else if (filter !== 'all') {
        typeParam = filter
      }
      
      const url = `/api/user/activity?page=${page}&limit=10${typeParam ? `&type=${typeParam}` : ''}`
      const res = await fetch(url)
      const data: ActivityFeedResponse = await res.json()
      
      if (res.ok) {
        setActivities(data.activities)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [page, filter])

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'lecture_watch':
        return <Play className="w-5 h-5 text-blue-500" />
      case 'lecture_download':
      case 'book_download':
        return <Download className="w-5 h-5 text-purple-500" />
      case 'book_read':
        return <BookOpen className="w-5 h-5 text-green-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-orange-500" />
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'share':
        return <Share2 className="w-5 h-5 text-indigo-500" />
      case 'register':
        return <UserPlus className="w-5 h-5 text-emerald-500" />
      case 'login':
        return <LogIn className="w-5 h-5 text-cyan-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getActivityText = (activity: Activity): string => {
    switch (activity.type) {
      case 'lecture_watch':
        return `Umesikiliza somo: ${activity.itemTitle || 'Somo'}`
      case 'lecture_download':
        return `Umedownload somo: ${activity.itemTitle || 'Somo'}`
      case 'book_read':
        return `Umesoma kitabu: ${activity.itemTitle || 'Kitabu'}`
      case 'book_download':
        return `Umedownload kitabu: ${activity.itemTitle || 'Kitabu'}`
      case 'comment':
        return `Umetoa maoni: "${activity.metadata?.comment || ''}"`
      case 'like':
        return `Umeipenda: ${activity.itemTitle || 'kipengele'}`
      case 'share':
        return `Umeshare: ${activity.itemTitle || 'kipengele'}`
      case 'register':
        return 'Umejiunga na EASTCMSA'
      case 'login':
        return 'Umeingia kwenye akaunti yako'
      default:
        return 'Shughuli'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-green-600" />
          Shughuli Zako
        </h2>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setFilter(option.value)
                setPage(1)
              }}
              aria-label={`Filter by ${option.label}`}
              title={`Show ${option.label} activities`}
              className={`px-3 py-1 text-sm rounded-full transition ${
                filter === option.value
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Hakuna shughuli za hivi karibuni
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                      locale: enUS // Using English locale
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            title="Previous page"
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Ukurasa {page} kati ya {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            title="Next page"
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}