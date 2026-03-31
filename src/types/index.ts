// User related types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  location?: string
  registeredAt: Date
  lastLogin: Date
  status: 'active' | 'inactive' | 'blocked'
  isSubscribed: boolean
  subscribedAt?: Date
  deviceInfo?: {
    platform: string
    browser: string
    isPWA: boolean
  }
}

// Analytics types
export interface AppAnalytics {
  totalDownloads: number
  totalRegistrations: number
  totalActiveUsers: number
  totalSubscribers: number
  dailyStats: DailyStat[]
  weeklyStats: WeeklyStat[]
  monthlyStats: MonthlyStat[]
}

export interface DailyStat {
  date: string
  downloads: number
  registrations: number
  activeUsers: number
  audioPlays: number
}

export interface WeeklyStat {
  week: string
  downloads: number
  registrations: number
  activeUsers: number
}

export interface MonthlyStat {
  month: string
  downloads: number
  registrations: number
  activeUsers: number
}

export interface AudioAnalytics {
  audioId: string
  title: string
  category: string
  totalPlays: number
  uniqueListeners: number
  averageListenTime: number
  lastPlayed: Date
}

export interface UserActivity {
  userId: string
  userName: string
  action: 'login' | 'register' | 'download_app' | 'play_audio' | 'share' | 'subscribe' | 'comment'
  details?: any
  timestamp: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}