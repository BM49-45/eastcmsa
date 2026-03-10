export type ActivityType = 
  | 'lecture_watch'
  | 'lecture_download'
  | 'book_read'
  | 'book_download'
  | 'comment'
  | 'like'
  | 'share'
  | 'register'
  | 'login'

export type Activity = {
  _id: string
  userId: string
  type: ActivityType
  itemId?: string
  itemTitle?: string
  metadata?: Record<string, any>
  createdAt: Date | string
  ip?: string
  userAgent?: string
}

export type ActivityFeedResponse = {
  activities: Activity[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ActivityStats = {
  lectures: number
  books: number
  comments: number
  likes: number
  downloads: number
}