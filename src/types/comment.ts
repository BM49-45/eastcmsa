export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam'

export type Comment = {
  _id: string
  content: string
  userId: string
  userName: string
  userEmail: string
  userRole?: string
  itemId: string // ID of lecture, book, etc.
  itemType: 'lecture' | 'book' | 'event' | 'article'
  itemTitle: string
  parentId?: string // For replies
  status: CommentStatus
  likes: number
  reports: number
  isEdited: boolean
  createdAt: Date
  updatedAt?: Date
  repliedAt?: Date
  metadata?: {
    ip?: string
    userAgent?: string
  }
}

export type CommentReport = {
  _id: string
  commentId: string
  userId: string
  reason: 'spam' | 'harassment' | 'inappropriate' | 'other'
  description?: string
  status: 'pending' | 'resolved' | 'dismissed'
  createdAt: Date
  resolvedBy?: string
  resolvedAt?: Date
}

export type CommentStats = {
  total: number
  pending: number
  approved: number
  rejected: number
  spam: number
  reports: number
}