'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Notification } from '@/types/notification'
import { toast } from 'sonner'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  archiveNotification: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refreshNotifications: () => Promise<void>
  showNotification: (notification: Notification) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  // Fetch notifications
  const refreshNotifications = async () => {
    if (!session) return

    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      if (res.ok) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
        setLastFetched(new Date())
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (session) {
      refreshNotifications()
    }
  }, [session])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!session) return

    const interval = setInterval(refreshNotifications, 30000)
    return () => clearInterval(interval)
  }, [session])

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      })
      
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n._id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST'
      })
      
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        )
        setUnreadCount(0)
        toast.success('All notifications marked as read')
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Archive notification
  const archiveNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/archive`, {
        method: 'PATCH'
      })
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id))
        if (!notifications.find(n => n._id === id)?.read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Error archiving notification:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id))
        if (!notifications.find(n => n._id === id)?.read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        toast.success('Notification deleted')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Show notification toast
  const showNotification = (notification: Notification) => {
    if (notification.priority === 'urgent') {
      toast.error(notification.title, {
        description: notification.message,
        duration: 10000,
        action: {
          label: 'View',
          onClick: () => {
            if (notification.data?.actionUrl) {
              window.location.href = notification.data.actionUrl
            }
          }
        }
      })
    } else if (notification.priority === 'high') {
      toast.warning(notification.title, {
        description: notification.message,
        duration: 7000
      })
    } else {
      toast.info(notification.title, {
        description: notification.message,
        duration: 5000
      })
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        deleteNotification,
        refreshNotifications,
        showNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}