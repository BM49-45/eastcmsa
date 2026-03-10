export type User = {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'sheikh'
  image?: string // Profile picture URL
  phone?: string
  gender?: 'male' | 'female' | 'other'
  age?: number
  category?: 'student' | 'teacher' | 'researcher' | 'other'
  bio?: string
  location?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export type UserPreferences = {
  emailNotifications: {
    comments: boolean
    replies: boolean
    likes: boolean
    newContent: boolean
    newsletter: boolean
    weeklyDigest: boolean
  }
  privacy: {
    showProfile: boolean
    showEmail: boolean
    showActivity: boolean
  }
  theme: 'light' | 'dark' | 'system'
  language: 'sw' | 'en' | 'ar'
}