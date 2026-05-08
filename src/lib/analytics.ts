// Analytics tracking system

export interface AnalyticsEvent {
  id: string
  type:
    | 'audio_play'
    | 'audio_complete'
    | 'book_view'
    | 'book_download'
    | 'page_view'
    | 'lecture_view'
  category: 'tawhiid' | 'fiqh' | 'sirah' | 'muhadhara' | 'book' | 'general'
  itemId: string
  itemTitle: string
  userId: string
  timestamp: Date
  duration?: number
}

const ANALYTICS_KEY = 'eastcmsa_analytics'

// Track an event
export const trackEvent = (
  type: AnalyticsEvent['type'],
  category: AnalyticsEvent['category'],
  itemId: string,
  itemTitle: string,
  duration?: number
) => {
  if (typeof window === 'undefined') return

  const events = getEvents()
  const userId = localStorage.getItem('eastcmsa_user_id') || generateUserId()

  const newEvent: AnalyticsEvent = {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    category,
    itemId,
    itemTitle,
    userId,
    timestamp: new Date(),
    duration,
  }

  events.push(newEvent)

  // Keep last 1000 events only
  if (events.length > 1000) events.shift()

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events))

  // Also send to console for debugging
  console.log(`📊 Analytics: ${type} - ${itemTitle}`)
}

// Get all events
export const getEvents = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(ANALYTICS_KEY)
    if (!stored) return []
    return JSON.parse(stored).map((e: any) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }))
  } catch {
    return []
  }
}

// Get statistics
export const getAnalyticsStats = () => {
  const events = getEvents()

  const stats = {
    totalAudioPlays: events.filter((e) => e.type === 'audio_play').length,
    totalAudioCompletes: events.filter((e) => e.type === 'audio_complete').length,
    totalBookViews: events.filter((e) => e.type === 'book_view').length,
    totalBookDownloads: events.filter((e) => e.type === 'book_download').length,
    totalPageViews: events.filter((e) => e.type === 'page_view').length,
    uniqueUsers: new Set(events.map((e) => e.userId)).size,
    byCategory: {
      tawhiid: events.filter((e) => e.category === 'tawhiid').length,
      fiqh: events.filter((e) => e.category === 'fiqh').length,
      sirah: events.filter((e) => e.category === 'sirah').length,
      muhadhara: events.filter((e) => e.category === 'muhadhara').length,
      book: events.filter((e) => e.category === 'book').length,
    },
  }

  return stats
}

// Generate unique user ID
const generateUserId = () => {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('eastcmsa_user_id', userId)
  return userId
}

// Track page view automatically
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', 'general', pageName, pageName)
}
