'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { recordActivity, incrementDownloads, recordAudioPlay, incrementRegistrations } from '@/lib/database'

export const useAnalytics = () => {
  const { data: session } = useSession()
  const hasRecordedActive = useRef(false)
  const hasRecordedRegistration = useRef(false)

  // Record user login/active status
  useEffect(() => {
    if (session?.user && !hasRecordedActive.current) {
      hasRecordedActive.current = true
      
      recordActivity({
        userId: session.user.id || 'unknown',
        userName: session.user.name || 'Anonymous',
        action: 'login',
        details: {
          email: session.user.email,
          lastLogin: new Date().toISOString()
        }
      })
    }
  }, [session])

  // Record registration (call this after successful registration)
  const trackRegistration = (userId: string, userName: string, email: string) => {
    if (!hasRecordedRegistration.current) {
      hasRecordedRegistration.current = true
      
      recordActivity({
        userId,
        userName,
        action: 'register',
        details: {
          email,
          registeredAt: new Date().toISOString()
        }
      })
      
      incrementRegistrations()
    }
  }

  // Record audio play
  const trackAudioPlay = (audioId: string, title: string, category: string) => {
    recordAudioPlay(audioId, title, category)
    
    recordActivity({
      userId: session?.user?.id || 'anonymous',
      userName: session?.user?.name || 'Mgeni',
      action: 'play_audio',
      details: {
        audioId,
        title,
        category,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Record share
  const trackShare = (itemId?: string, itemTitle?: string) => {
    recordActivity({
      userId: session?.user?.id || 'anonymous',
      userName: session?.user?.name || 'Mgeni',
      action: 'share',
      details: {
        itemId: itemId || 'app',
        itemTitle: itemTitle || 'EASTCMSA App',
        method: 'social_share',
        timestamp: new Date().toISOString()
      }
    })
  }

  // Record download
  const trackDownload = () => {
    recordActivity({
      userId: session?.user?.id || 'anonymous',
      userName: session?.user?.name || 'Mgeni',
      action: 'download_app',
      details: {
        timestamp: new Date().toISOString(),
        platform: navigator.platform,
        userAgent: navigator.userAgent
      }
    })
    
    incrementDownloads()
  }

  // Record subscribe
  const trackSubscribe = () => {
    recordActivity({
      userId: session?.user?.id || 'anonymous',
      userName: session?.user?.name || 'Mgeni',
      action: 'subscribe',
      details: {
        timestamp: new Date().toISOString(),
        subscribedAt: new Date().toISOString()
      }
    })
  }

  return {
    trackRegistration,
    trackAudioPlay,
    trackShare,
    trackDownload,
    trackSubscribe
  }
}