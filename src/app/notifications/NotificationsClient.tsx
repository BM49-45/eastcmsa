'use client'

import { useState, useEffect } from 'react'
import { NotificationProvider, useNotifications } from '@/context/NotificationContext'
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Archive, 
  Filter,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'
import { NotificationType } from '@/types/notification'

function NotificationsContent() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    archiveNotification, 
    deleteNotification 
  } = useNotifications()
  
  const [filter, setFilter] = useState<NotificationType | 'all'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)

  useEffect(() => {
    let filtered = notifications
    if (filter !== 'all') {
      filtered = notifications.filter(n => n.type === filter)
    }
    setFilteredNotifications(filtered)
    setTotalPages(Math.ceil(filtered.length / 20))
  }, [notifications, filter])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment_reply':
      case 'comment_like':
      case 'comment_mention':
        return '💬'
      case 'lecture_new':
        return '🎙️'
      case 'book_new':
        return '📚'
      case 'event_new':
        return '📅'
      case 'announcement':
        return '📢'
      case 'system_alert':
        return '⚠️'
      case 'welcome':
        return '👋'
      case 'achievement':
        return '🏆'
      default:
        return '📌'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const notificationTypes = [
    { value: 'all', label: 'All' },
    { value: 'comment_reply', label: 'Replies' },
    { value: 'comment_like', label: 'Likes' },
    { value: 'comment_mention', label: 'Mentions' },
    { value: 'lecture_new', label: 'Lectures' },
    { value: 'book_new', label: 'Books' },
    { value: 'event_new', label: 'Events' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'system_alert', label: 'System' },
    { value: 'achievement', label: 'Achievements' }
  ]

  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * 20,
    page * 20
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="text-green-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                title="Mark all as read"
              >
                <CheckCheck size={18} />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400" size={20} />
            <label htmlFor="notification-filter" className="sr-only">
              Filter notifications by type
            </label>
            <select
              id="notification-filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as NotificationType | 'all')
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              title="Filter notifications by type"
            >
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {paginatedNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {notification.message}
                      </p>
                      {notification.data?.actionUrl && (
                        <Link
                          href={notification.data.actionUrl}
                          className="text-sm text-green-600 hover:text-green-700 mb-2 inline-block"
                          onClick={() => !notification.read && markAsRead(notification._id)}
                        >
                          View details →
                        </Link>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: enUS
                          })}
                        </span>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                              title="Mark as read"
                            >
                              <CheckCheck size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => archiveNotification(notification._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            title="Archive"
                          >
                            <Archive size={18} />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                aria-label="Previous page"
                title="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                aria-label="Next page"
                title="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NotificationsClient() {
  return (
    <NotificationProvider>
      <NotificationsContent />
    </NotificationProvider>
  )
}