// ============================================
// SIMPLE STORAGE UTILITY
// ============================================

// ============================================
// NOTIFICATION SYSTEM
// ============================================

export interface Notification {
  id: string
  title: string
  message: string
  type: 'new_content' | 'event' | 'info' | 'warning' | 'announcement'
  category: 'tawhiid' | 'fiqh' | 'sirah' | 'muhadhara' | 'book' | 'general'
  read: boolean
  createdAt: Date
  link?: string
}

const NOTIFICATIONS_KEY = 'eastcmsa_notifications'
const LAST_CHECK_KEY = 'eastcmsa_last_notification_check'

// Track when content was last viewed by user
export const trackContentView = (contentType: string, contentId: string) => {
  if (typeof window === 'undefined') return

  const viewed = localStorage.getItem(`viewed_${contentType}_${contentId}`)
  if (!viewed) {
    localStorage.setItem(`viewed_${contentType}_${contentId}`, Date.now().toString())
  }
}

// Check if content is new to user
export const isContentNew = (contentType: string, contentId: string, createdAt: Date): boolean => {
  if (typeof window === 'undefined') return false

  const viewed = localStorage.getItem(`viewed_${contentType}_${contentId}`)
  if (!viewed) return true

  const viewedTime = parseInt(viewed)
  const contentTime = new Date(createdAt).getTime()

  // If content created after user viewed it, it's new
  return contentTime > viewedTime
}

// Generate notification for new content
export const notifyNewContent = (
  title: string,
  message: string,
  category: Notification['category'],
  contentId: string,
  contentType: string
) => {
  const notifications = getNotifications()

  // Check if notification already exists for this content
  const exists = notifications.some((n) => n.id === `${contentType}_${contentId}`)
  if (exists) return

  const newNotification: Notification = {
    id: `${contentType}_${contentId}`,
    title,
    message,
    type: 'new_content',
    category,
    read: false,
    createdAt: new Date(),
    link: `/${category}/${contentId}`,
  }

  notifications.unshift(newNotification)
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))

  // Trigger event for real-time update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('new-notification', { detail: newNotification }))
  }
}

export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    if (!stored) return []

    return JSON.parse(stored).map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
    }))
  } catch (error) {
    console.error('Error loading notifications:', error)
    return []
  }
}

export const markNotificationAsRead = (id: string) => {
  const notifications = getNotifications()
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
}

export const markAllNotificationsAsRead = () => {
  const notifications = getNotifications()
  const updated = notifications.map((n) => ({ ...n, read: true }))
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
}

export const getUnreadCount = (): number => {
  return getNotifications().filter((n) => !n.read).length
}

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
      editedAt: msg.editedAt ? new Date(msg.editedAt) : undefined,
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
  const index = messages.findIndex((m) => m.id === id)

  if (index === -1) return null

  messages[index] = {
    ...messages[index],
    text,
    editedAt: new Date(),
  }

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return messages[index]
}

export const deleteMessage = (id: string): boolean => {
  const messages = getMessages()
  const filtered = messages.filter((m) => m.id !== id)

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
  type: 'info' | 'warning' | 'success' | 'error' | 'event'
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  location?: string
  time?: string
  speaker?: string
  date?: string
}

const ANNOUNCEMENTS_KEY = 'announcements'

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  // MUHADHARA EVENT - Only this one active
  {
    id: 'muhadhara-may-2026',
    title: '📢 TANGAZO LA MUHADHARA',
    content: `NI IPI NAFASI NA DHIMA YA KIJANA WA KIISLAMU KATIKA MUJTAMAA`,
    type: 'event',
    createdAt: new Date(),
    isActive: false,
    location: 'Masjid Changanyikeni, Floor ya Kwanza',
    time: '3:00 Asubuhi',
    speaker: 'Sheikh Abuu Ayman Al-Shiiraaziy حفظه الله',
    date: 'Jumamosi, 9 May 2026',
  },
  {
    id: '2',
    title: '📢📖 DARSA MPYA KWA TAWHIID',
    content: 'Kitabu: FADHILA ZA UISLAM (فضل الإسلام) - Fadhila za kuingia katika Uislam',
    type: 'success',
    createdAt: new Date(),
    isActive: true,
  },
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
      expiresAt: a.expiresAt ? new Date(a.expiresAt) : undefined,
    }))
  } catch (error) {
    console.error('Error loading announcements:', error)
    return DEFAULT_ANNOUNCEMENTS
  }
}

export const addAnnouncement = (
  announcement: Omit<Announcement, 'id' | 'createdAt'>
): Announcement => {
  const announcements = getAnnouncements()

  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  announcements.push(newAnnouncement)
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements))

  // Auto-create notification for new announcement
  notifyNewContent(
    newAnnouncement.title,
    newAnnouncement.content.substring(0, 100),
    newAnnouncement.type === 'event' ? 'muhadhara' : 'general',
    newAnnouncement.id,
    'announcement'
  )

  return newAnnouncement
}

export const deleteAnnouncement = (id: string): boolean => {
  const announcements = getAnnouncements()
  const filtered = announcements.filter((a) => a.id !== id)

  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(filtered))
  return true
}

// ============================================
// HELPER: Trigger notification for event
// ============================================

export const triggerEventNotification = (eventId: string) => {
  const announcements = getAnnouncements()
  const event = announcements.find((a) => a.id === eventId && a.isActive)

  if (event) {
    notifyNewContent(event.title, event.content, 'muhadhara', event.id, 'event')
  }
}
