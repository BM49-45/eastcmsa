export type NotificationType = 
  | 'comment_reply'
  | 'comment_like'
  | 'comment_mention'
  | 'lecture_new'
  | 'book_new'
  | 'event_new'
  | 'announcement'
  | 'system_alert'
  | 'welcome'
  | 'achievement'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Notification = {
  _id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  read: boolean
  archived: boolean
  data?: {
    itemId?: string
    itemType?: string
    itemTitle?: string
    actorId?: string
    actorName?: string
    actionUrl?: string
    imageUrl?: string
  }
  createdAt: Date
  readAt?: Date
  expiresAt?: Date
}

export type NotificationPreferences = {
  userId: string
  email: {
    comment_reply: boolean
    comment_like: boolean
    comment_mention: boolean
    lecture_new: boolean
    book_new: boolean
    event_new: boolean
    announcement: boolean
    system_alert: boolean
    weekly_digest: boolean
  }
  push: {
    enabled: boolean
    comment_reply: boolean
    comment_like: boolean
    comment_mention: boolean
    lecture_new: boolean
    book_new: boolean
    event_new: boolean
    announcement: boolean
  }
  inApp: {
    enabled: boolean
    sound: boolean
    desktop: boolean
  }
  updatedAt: Date
}

export type NotificationStats = {
  total: number
  unread: number
  byType: Record<NotificationType, number>
  byPriority: Record<NotificationPriority, number>
}