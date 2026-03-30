// Simple storage utility using localStorage

// ============================================
// COMMUNITY MESSAGES STORAGE
// ============================================

export interface Message {
  id: string
  text: string
  userId: string
  userName: string
  userImage?: string
  createdAt: Date
  editedAt?: Date
}

const MESSAGES_KEY = 'community_messages'

export const getMessages = (): Message[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(MESSAGES_KEY)
    if (!stored) return []
    
    const messages = JSON.parse(stored)
    return messages.map((msg: any) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
      editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined
    }))
  } catch (error) {
    console.error('Error loading messages:', error)
    return []
  }
}

export const addMessage = (message: Omit<Message, 'id' | 'createdAt'>): Message => {
  const messages = getMessages()
  
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  
  messages.push(newMessage)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  
  return newMessage
}

export const updateMessage = (id: string, text: string): Message | null => {
  const messages = getMessages()
  const index = messages.findIndex(m => m.id === id)
  
  if (index === -1) return null
  
  messages[index] = {
    ...messages[index],
    text,
    editedAt: new Date()
  }
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return messages[index]
}

export const deleteMessage = (id: string): boolean => {
  const messages = getMessages()
  const filtered = messages.filter(m => m.id !== id)
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered))
  return true
}

// ============================================
// PROFILE IMAGE STORAGE
// ============================================

const PROFILE_IMAGES_KEY = 'profile_images'

export const saveProfileImage = (userId: string, imageData: string): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    // Get existing images
    const existing = localStorage.getItem(PROFILE_IMAGES_KEY)
    let images: Record<string, string> = existing ? JSON.parse(existing) : {}
    
    // Save new image
    images[userId] = imageData
    
    // Store back
    localStorage.setItem(PROFILE_IMAGES_KEY, JSON.stringify(images))
    
    console.log('✅ Profile image saved for user:', userId)
    return true
  } catch (error) {
    console.error('❌ Error saving profile image:', error)
    return false
  }
}

export const getProfileImage = (userId: string): string | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const existing = localStorage.getItem(PROFILE_IMAGES_KEY)
    if (!existing) return null
    
    const images: Record<string, string> = JSON.parse(existing)
    const image = images[userId] || null
    
    console.log('📸 Profile image loaded:', image ? 'found' : 'not found')
    return image
  } catch (error) {
    console.error('❌ Error loading profile image:', error)
    return null
  }
}

export const deleteProfileImage = (userId: string): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const existing = localStorage.getItem(PROFILE_IMAGES_KEY)
    if (!existing) return true
    
    const images: Record<string, string> = JSON.parse(existing)
    delete images[userId]
    
    localStorage.setItem(PROFILE_IMAGES_KEY, JSON.stringify(images))
    console.log('🗑️ Profile image deleted for user:', userId)
    return true
  } catch (error) {
    console.error('❌ Error deleting profile image:', error)
    return false
  }
}

// ============================================
// ANNOUNCEMENTS STORAGE (with Swahili content)
// ============================================

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
}

const ANNOUNCEMENTS_KEY = 'announcements'

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Karibu! EASTCMSA Community',
    content: 'Upate kudurusu darsa mbalimabli zenye manufaa na mazigatio makubwa kwa kila mmoja. Pia, utapata kusikiliza Quran Tukufu na mambo mengine mengi yenye manufaa hapa duniani na kesho akhera..!',
    type: 'info',
    createdAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    title: 'Kwa uharaka zaidi!',
    content: 'Jisajili na uweze kushiriki maoni, ushauri, au kuuliza huku tukizingatia maadili na wema wa Uislamu. Karibu sana!',
    type: 'success',
    createdAt: new Date(),
    isActive: true,
  }
]

export const getAnnouncements = (): Announcement[] => {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENTS
  
  try {
    const stored = localStorage.getItem(ANNOUNCEMENTS_KEY)
    if (!stored) {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENTS))
      return DEFAULT_ANNOUNCEMENTS
    }
    
    const announcements = JSON.parse(stored)
    return announcements.map((a: any) => ({
      ...a,
      createdAt: new Date(a.createdAt),
      expiresAt: a.expiresAt ? new Date(a.expiresAt) : undefined
    }))
  } catch (error) {
    console.error('Error loading announcements:', error)
    return DEFAULT_ANNOUNCEMENTS
  }
}

export const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>): Announcement => {
  const announcements = getAnnouncements()
  
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  
  announcements.push(newAnnouncement)
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements))
  
  return newAnnouncement
}

export const deleteAnnouncement = (id: string): boolean => {
  const announcements = getAnnouncements()
  const filtered = announcements.filter(a => a.id !== id)
  
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(filtered))
  return true
}