'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, Archive, Clock, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Link from 'next/link'

// Define proper types
interface Notification {
  _id: string
  type: 'welcome' | 'lecture_new' | 'book_new' | 'event_new' | 'announcement' | 'system_alert' | 'achievement'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load real notifications from API
  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/user/notifications')
        if (res.ok) {
          const data = await res.json()
          setNotifications(data)
        } else {
          setNotifications([])
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [session])

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle ESC key
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'welcome':
        return '👋'
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
      case 'achievement':
        return '🏆'
      default:
        return '📌'
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/user/notifications/${id}/read`, {
        method: 'POST'
      })
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === id ? { ...n, read: true } : n)
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/user/notifications/read-all', {
        method: 'POST'
      })
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const archiveNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/user/notifications/${id}/archive`, {
        method: 'POST'
      })
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id))
      }
    } catch (error) {
      console.error('Error archiving notification:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/user/notifications/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // If not logged in, show empty bell
  if (!session) {
    return (
      <div className="relative">
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed"
          aria-label="Notifications"
          title="Ingia ili kuona notifications"
          disabled
        >
          <Bell size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label="Notifications"
        title={unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} mpya` : 'Hakuna notifications mpya'}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-green-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                  {unreadCount} mpya
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors flex items-center gap-1"
                  title="Soma zote"
                >
                  <CheckCheck size={16} />
                  <span className="hidden sm:inline text-xs">Soma zote</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Funga"
                title="Funga"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inapakia...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Hakuna notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Utapokea arifa hapa zitakapotokea
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/5' : ''
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-r-full"></div>
                  )}
                  
                  <div className="flex items-start gap-3 pl-2">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {notification.title}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getPriorityColor(notification.priority)}`}>
                          {notification.priority === 'urgent' ? 'Haraka' :
                           notification.priority === 'high' ? 'Muhimu' :
                           notification.priority === 'medium' ? 'Kawaida' : 'Chini'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                          <Clock size={10} />
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: enUS
                          })}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Soma"
                            >
                              <CheckCheck size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => archiveNotification(notification._id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Weka kwenye kumbukumbu"
                          >
                            <Archive size={14} />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Futa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                Tazama zote ({notifications.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}