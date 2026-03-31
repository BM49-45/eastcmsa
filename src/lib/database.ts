'use client'

// Storage keys
const ANALYTICS_KEY = 'app_analytics'
const AUDIO_ANALYTICS_KEY = 'audio_analytics'
const USER_ACTIVITIES_KEY = 'user_activities'
const USERS_KEY = 'app_users'

export interface AppAnalytics {
  totalDownloads: number
  totalRegistrations: number
  totalActiveUsers: number
  totalSubscribers: number
  dailyStats: DailyStat[]
}

export interface DailyStat {
  date: string
  downloads: number
  registrations: number
  activeUsers: number
  audioPlays: number
}

export interface AudioAnalytics {
  audioId: string
  title: string
  category: string
  totalPlays: number
  lastPlayed: Date
}

export interface UserActivity {
  userId: string
  userName: string
  action: 'login' | 'register' | 'download_app' | 'play_audio' | 'share' | 'subscribe'
  details?: any
  timestamp: Date
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  gender?: string
  location?: string
  isSubscribed?: boolean
  registeredAt?: Date
}

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0]
}

// ============================================
// ANALYTICS
// ============================================

export const getAnalytics = (): AppAnalytics => {
  if (typeof window === 'undefined') {
    return {
      totalDownloads: 0,
      totalRegistrations: 0,
      totalActiveUsers: 0,
      totalSubscribers: 0,
      dailyStats: []
    }
  }
  try {
    const stored = localStorage.getItem(ANALYTICS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading analytics:', error)
  }
  
  // Initialize default analytics
  const defaultAnalytics: AppAnalytics = {
    totalDownloads: 0,
    totalRegistrations: 0,
    totalActiveUsers: 0,
    totalSubscribers: 0,
    dailyStats: []
  }
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(defaultAnalytics))
  return defaultAnalytics
}

export const updateAnalytics = (analytics: AppAnalytics): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics))
}

export const incrementDownloads = (): void => {
  const analytics = getAnalytics()
  analytics.totalDownloads++
  
  const today = getTodayString()
  const dailyIndex = analytics.dailyStats.findIndex(d => d.date === today)
  if (dailyIndex >= 0) {
    analytics.dailyStats[dailyIndex].downloads++
  } else {
    analytics.dailyStats.unshift({
      date: today,
      downloads: 1,
      registrations: 0,
      activeUsers: 0,
      audioPlays: 0
    })
    analytics.dailyStats = analytics.dailyStats.slice(0, 30)
  }
  
  updateAnalytics(analytics)
}

export const incrementRegistrations = (): void => {
  const analytics = getAnalytics()
  analytics.totalRegistrations++
  
  const today = getTodayString()
  const dailyIndex = analytics.dailyStats.findIndex(d => d.date === today)
  if (dailyIndex >= 0) {
    analytics.dailyStats[dailyIndex].registrations++
  } else {
    analytics.dailyStats.unshift({
      date: today,
      downloads: 0,
      registrations: 1,
      activeUsers: 0,
      audioPlays: 0
    })
    analytics.dailyStats = analytics.dailyStats.slice(0, 30)
  }
  
  updateAnalytics(analytics)
}

export const incrementActiveUsers = (): void => {
  const analytics = getAnalytics()
  const today = getTodayString()
  const dailyIndex = analytics.dailyStats.findIndex(d => d.date === today)
  if (dailyIndex >= 0) {
    analytics.dailyStats[dailyIndex].activeUsers++
  }
  updateAnalytics(analytics)
}

export const incrementAudioPlays = (): void => {
  const analytics = getAnalytics()
  const today = getTodayString()
  const dailyIndex = analytics.dailyStats.findIndex(d => d.date === today)
  if (dailyIndex >= 0) {
    analytics.dailyStats[dailyIndex].audioPlays++
  }
  updateAnalytics(analytics)
}

export const incrementSubscribers = (): void => {
  const analytics = getAnalytics()
  analytics.totalSubscribers++
  updateAnalytics(analytics)
}

// ============================================
// AUDIO ANALYTICS
// ============================================

export const getAudioAnalytics = (): AudioAnalytics[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(AUDIO_ANALYTICS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((a: any) => ({
        ...a,
        lastPlayed: new Date(a.lastPlayed)
      }))
    }
  } catch (error) {
    console.error('Error loading audio analytics:', error)
  }
  return []
}

export const updateAudioAnalytics = (analytics: AudioAnalytics[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUDIO_ANALYTICS_KEY, JSON.stringify(analytics))
}

export const recordAudioPlay = (audioId: string, title: string, category: string): void => {
  const analytics = getAudioAnalytics()
  const existingIndex = analytics.findIndex(a => a.audioId === audioId)
  
  if (existingIndex >= 0) {
    analytics[existingIndex].totalPlays++
    analytics[existingIndex].lastPlayed = new Date()
  } else {
    analytics.push({
      audioId,
      title,
      category,
      totalPlays: 1,
      lastPlayed: new Date()
    })
  }
  
  updateAudioAnalytics(analytics)
  incrementAudioPlays()
}

// ============================================
// USER ACTIVITIES
// ============================================

export const getUserActivities = (): UserActivity[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(USER_ACTIVITIES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp)
      }))
    }
  } catch (error) {
    console.error('Error loading user activities:', error)
  }
  return []
}

export const recordActivity = (activity: Omit<UserActivity, 'timestamp'>): void => {
  const activities = getUserActivities()
  const newActivity: UserActivity = {
    ...activity,
    timestamp: new Date()
  }
  activities.unshift(newActivity)
  // Keep only last 500 activities
  localStorage.setItem(USER_ACTIVITIES_KEY, JSON.stringify(activities.slice(0, 500)))
}

// ============================================
// USER MANAGEMENT (Frontend)
// ============================================

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((u: any) => ({
        ...u,
        registeredAt: u.registeredAt ? new Date(u.registeredAt) : undefined
      }))
    }
  } catch (error) {
    console.error('Error loading users:', error)
  }
  return []
}

export const saveUser = (user: User): void => {
  const users = getUsers()
  const existingIndex = users.findIndex(u => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...user }
  } else {
    users.push(user)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}