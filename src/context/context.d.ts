declare module '@/context/NotificationContext' {
  export interface Notification {
    _id: string
    userId: string
    type: string
    title: string
    message: string
    priority: string
    read: boolean
    archived: boolean
    data?: any
    createdAt: string
    updatedAt: string
  }

  export function useNotifications(): {
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

  export function NotificationProvider({ children }: { children: React.ReactNode }): JSX.Element
}