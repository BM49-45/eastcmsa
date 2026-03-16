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

export interface Activity {
  _id: string
  userId: string
  type: ActivityType
  itemId?: string
  itemTitle?: string
  category?: string
  metadata?: {
    comment?: string
    duration?: number
    [key: string]: any
  }
  createdAt: Date
}

export interface ActivityStats {
  lectures: number
  books: number
  comments: number
  likes: number
  downloads: number
}

export interface ActivityFeedResponse {
  activities: Activity[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}